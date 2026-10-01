"use client";

import { Button, Spinner } from "@detectivescan/ui";
import { CircleAlert, ScanLine } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/** API native de lecture de codes (Chrome sur Android et macOS) ; jsQR prend le relais ailleurs, dont Safari. */
type NativeDetector = { detect(source: CanvasImageSource): Promise<{ rawValue: string }[]> };
type NativeDetectorClass = {
  new (options: { formats: string[] }): NativeDetector;
  getSupportedFormats?: () => Promise<string[]>;
};

type CameraState = "idle" | "starting" | "running" | "denied" | "unavailable" | "failed";

/**
 * Lecteur de QR par la caméra arrière. La caméra ne s'ouvre qu'au clic, s'arrête dès
 * qu'un QR est lu, et aucune image ne quitte le téléphone.
 */
export function QrScanner({ onResult }: { onResult: (text: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>("idle");

  const stop = useCallback(() => {
    for (const track of stream.current?.getTracks() ?? []) track.stop();
    stream.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unavailable");
      return;
    }
    setState("starting");
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      stream.current = media;
      const element = video.current;
      if (!element) return stop();
      element.srcObject = media;
      await element.play();
      setState("running");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setState(
        name === "NotAllowedError" || name === "SecurityError"
          ? "denied"
          : name === "NotFoundError" || name === "OverconstrainedError"
            ? "unavailable"
            : "failed",
      );
    }
  }

  useEffect(() => {
    if (state !== "running") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    void (async () => {
      const Native = (window as unknown as { BarcodeDetector?: NativeDetectorClass }).BarcodeDetector;
      let detector: NativeDetector | null = null;
      if (Native) {
        try {
          const formats = (await Native.getSupportedFormats?.()) ?? ["qr_code"];
          if (formats.includes("qr_code")) detector = new Native({ formats: ["qr_code"] });
        } catch {
          detector = null;
        }
      }
      const decode = detector ? null : (await import("jsqr")).default;

      const tick = async () => {
        if (cancelled) return;
        const element = video.current;
        let text: string | null = null;
        if (element && element.readyState >= 2 && element.videoWidth > 0) {
          if (detector) {
            text = (await detector.detect(element).catch(() => []))[0]?.rawValue ?? null;
          } else if (decode && context) {
            const scale = Math.min(1, 720 / element.videoWidth);
            canvas.width = Math.round(element.videoWidth * scale);
            canvas.height = Math.round(element.videoHeight * scale);
            context.drawImage(element, 0, 0, canvas.width, canvas.height);
            const image = context.getImageData(0, 0, canvas.width, canvas.height);
            text = decode(image.data, image.width, image.height, { inversionAttempts: "dontInvert" })?.data ?? null;
          }
        }
        if (cancelled) return;
        if (text) {
          navigator.vibrate?.(40);
          stop();
          setState("idle");
          onResult(text);
          return;
        }
        timer = setTimeout(tick, 180);
      };
      void tick();
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [state, onResult, stop]);

  const running = state === "running";

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-line bg-chrome">
        <video
          ref={video}
          playsInline
          muted
          aria-hidden
          className={running ? "absolute inset-0 size-full object-cover" : "hidden"}
        />

        {running ? (
          <>
            <div aria-hidden className="absolute inset-[18%] rounded-md border-2 border-white/80" />
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black/70 px-2.5 py-1 text-[13px] font-medium text-fg">
              Visez le QR code
            </p>
          </>
        ) : (
          <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 px-6 text-center">
            {state === "starting" ? (
              <p className="flex items-center gap-2.5 text-[14px] text-fg-2">
                <Spinner />
                Ouverture de la caméra…
              </p>
            ) : state === "idle" ? (
              <>
                <ScanLine className="size-8 text-fg-2" strokeWidth={1.75} aria-hidden />
                <Button variant="secondary" onClick={start}>
                  Activer la caméra
                </Button>
                <p className="max-w-[30ch] text-[12.5px] leading-snug text-fg-3">
                  La caméra ne sert qu'à lire le QR : aucune image n'est enregistrée.
                </p>
              </>
            ) : (
              <>
                <CircleAlert className="size-7 text-warning" strokeWidth={1.75} aria-hidden />
                <p role="alert" className="max-w-[34ch] text-[14px] leading-snug text-fg-2">
                  {state === "denied"
                    ? "Accès à la caméra refusé. Autorisez-le dans les réglages du navigateur, ou saisissez l'identifiant ci-dessous."
                    : state === "unavailable"
                      ? "Aucune caméra disponible sur cet appareil. Saisissez l'identifiant ci-dessous."
                      : "La caméra n'a pas pu démarrer."}
                </p>
                {state !== "unavailable" ? (
                  <Button variant="secondary" size="sm" onClick={start}>
                    Réessayer
                  </Button>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>

      {running ? (
        <Button
          variant="ghost"
          size="sm"
          className="justify-self-start"
          onClick={() => {
            stop();
            setState("idle");
          }}
        >
          Arrêter la caméra
        </Button>
      ) : null}
    </div>
  );
}
