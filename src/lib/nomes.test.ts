import { describe, expect, it } from "vitest";
import { nomeDuplicado, sugerirCor, PALETA } from "./nomes";
const lista = [{ id: "1", nome: "Garçom" }];
describe("nomes duplicados", () => {
  it("ignora maiúsculas e espaços", () => expect(nomeDuplicado("  GARÇOM ", lista)).toBe(true));
  it("nome diferente não é duplicado", () => expect(nomeDuplicado("Cozinheiro", lista)).toBe(false));
  it("ao editar, ignora o próprio registro", () => expect(nomeDuplicado("garçom", lista, "1")).toBe(false));
  it("sugere cor ainda não usada", () => expect(sugerirCor([PALETA[0]])).toBe("#2563eb"));
});
