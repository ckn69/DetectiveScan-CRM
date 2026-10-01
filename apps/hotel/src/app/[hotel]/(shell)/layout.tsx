import { DemoBanner } from "@/components/shell/demo-banner";
import { MobileNav } from "@/components/shell/mobile-nav";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { DEMO_HOTEL, DEMO_USER } from "@/lib/demo";

/** Navigation complète : sidebar (ou rail), barre haute, bandeau démo, barre du bas sur mobile. */
export default function ShellLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[72px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)]">
      <a
        href="#contenu"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-sm bg-white px-4 py-2 text-[14px] font-semibold text-black transition-transform duration-150 focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
      >
        Aller au contenu
      </a>
      <Sidebar hotel={DEMO_HOTEL} user={DEMO_USER} />
      <div className="flex min-w-0 flex-col">
        <Topbar hotel={DEMO_HOTEL} user={DEMO_USER} />
        <DemoBanner />
        <main id="contenu" tabIndex={-1} className="flex-1 px-4 pb-28 pt-2 outline-none md:px-8 md:pb-12">
          {children}
        </main>
      </div>
      <MobileNav hotelSlug={DEMO_HOTEL.slug} />
    </div>
  );
}
