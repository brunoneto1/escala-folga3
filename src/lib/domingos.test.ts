import { describe, expect, it } from "vitest";
import { domingosDoMes, domingosSeguidosTrabalhados } from "./domingos";

describe("domingosDoMes", () => {
  it("devolve todos os domingos de dezembro de 2026", () => {
    expect(domingosDoMes(2026, 11)).toEqual([
      "2026-12-06",
      "2026-12-13",
      "2026-12-20",
      "2026-12-27",
    ]);
  });

  it("devolve todos os domingos de novembro de 2026", () => {
    expect(domingosDoMes(2026, 10)).toEqual([
      "2026-11-01",
      "2026-11-08",
      "2026-11-15",
      "2026-11-22",
      "2026-11-29",
    ]);
  });
});

describe("domingosSeguidosTrabalhados", () => {
  it("conta domingos sem folga a partir do primeiro domingo informado", () => {
    expect(domingosSeguidosTrabalhados("func-1", [], "2026-11-29", "2026-11-01")).toBe(5);
  });

  it("para no domingo com folga no meio da sequência", () => {
    expect(
      domingosSeguidosTrabalhados(
        "func-1",
        [{ funcionario_id: "func-1", data: "2026-11-15" }],
        "2026-11-29",
        "2026-11-01",
      ),
    ).toBe(2);
  });

  it("retorna zero quando há folga no último domingo", () => {
    expect(
      domingosSeguidosTrabalhados(
        "func-1",
        [{ funcionario_id: "func-1", data: "2026-11-29" }],
        "2026-11-29",
      ),
    ).toBe(0);
  });

  it("respeita o limite máximo de domingos", () => {
    expect(domingosSeguidosTrabalhados("func-1", [], "2026-11-29", null, 2)).toBe(2);
  });
});
