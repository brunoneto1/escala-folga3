export function normalizarNome(nome: string): string {
  return nome.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}
export function limparNome(nome: string): string {
  return nome.trim().replace(/\s+/g, " ");
}
export function nomeDuplicado(nome: string, existentes: { id: string; nome: string }[], ignorarId?: string) {
  const n = normalizarNome(nome);
  return existentes.some((e) => e.id !== ignorarId && normalizarNome(e.nome) === n);
}
export const PALETA: [string, ...string[]] = ["#0f766e","#2563eb","#db2777","#ea580c","#7c3aed","#16a34a","#ca8a04","#dc2626","#0891b2","#9333ea","#65a30d","#c2410c"];
export function sugerirCor(usadas: string[]): string {
  return PALETA.find((c) => !usadas.includes(c)) ?? PALETA[usadas.length % PALETA.length] ?? PALETA[0];
}
