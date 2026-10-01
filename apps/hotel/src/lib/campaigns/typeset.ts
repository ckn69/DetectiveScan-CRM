const NBSP = "\u00a0";
const THIN_NBSP = "\u202f";

/**
 * Typographie française du texte saisi par l'hôtel, à l'affichage : espace insécable avant
 * « : ; ! ? » et à l'intérieur des guillemets, entre un nombre et son unité (« 20 h », « 49 € »).
 * On ne remplace que des espaces déjà tapées : une adresse comme `https://` reste intacte.
 */
export function typeset(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/ ([:;!?»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) %/g, `$1${THIN_NBSP}%`)
    .replace(/(\d) (h|€|min)(?![\p{L}\d])/gu, `$1${NBSP}$2`);
}
