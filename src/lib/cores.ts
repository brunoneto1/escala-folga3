export function textoSobreCor(cor: string): "#0f172a" | "#ffffff" {
  const hex = cor.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(hex)) return "#0f172a";

  const r = Number.parseInt(hex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(hex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(hex.slice(4, 6), 16) / 255;
  const luminancia = (canal: number) => canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
  const brilho = 0.2126 * luminancia(r) + 0.7152 * luminancia(g) + 0.0722 * luminancia(b);

  return brilho > 0.179 ? "#0f172a" : "#ffffff";
}
