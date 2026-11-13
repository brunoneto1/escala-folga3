import { describe, expect, it } from "vitest";
import { verificarFolga, limitePorCargo, maxFolgasMes, semDiasSeguidos, umaFolgaPorSemana, domingosObrigatorios, verificarEscala } from "./index";
const ana = { id: "a", nome: "Ana", cargo_id: "c1" };
const bia = { id: "b", nome: "Bia", cargo_id: "c1" };
const caio = { id: "c", nome: "Caio", cargo_id: "c2" };
const base = { funcionarios: [ana, bia, caio], config: { limitePorCargoDia: 1, maxFolgasMes: 2 } };
describe("regras de folga", () => {
  it("limite 1: segunda pessoa do mesmo cargo no mesmo dia é avisada", () =>
    expect(limitePorCargo.validar({ ...base, funcionario: bia, data: "2026-11-10", folgas: [{ funcionario_id: "a", data: "2026-11-10" }] }).valido).toBe(false));
  it("cargo diferente no mesmo dia é permitido", () =>
    expect(limitePorCargo.validar({ ...base, funcionario: caio, data: "2026-11-10", folgas: [{ funcionario_id: "a", data: "2026-11-10" }] }).valido).toBe(true));
  it("máximo 2 por mês: terceira folga é avisada", () =>
    expect(maxFolgasMes.validar({ ...base, funcionario: ana, data: "2026-11-20", folgas: [{ funcionario_id: "a", data: "2026-11-01" }, { funcionario_id: "a", data: "2026-11-05" }] }).valido).toBe(false));
  it("folga em outro mês não conta", () =>
    expect(maxFolgasMes.validar({ ...base, funcionario: ana, data: "2026-11-20", folgas: [{ funcionario_id: "a", data: "2026-10-01" }, { funcionario_id: "a", data: "2026-10-05" }] }).valido).toBe(true));
  it("dia seguido é avisado, inclusive na virada do mês", () =>
    expect(semDiasSeguidos.validar({ ...base, funcionario: ana, data: "2026-12-01", folgas: [{ funcionario_id: "a", data: "2026-11-30" }] }).valido).toBe(false));
  it("sem conflitos não há avisos", () =>
    expect(verificarFolga({ ...base, funcionario: ana, data: "2026-11-10", folgas: [] })).toEqual([]));
});

// Novembro/2026: domingos = 1, 8, 15, 22, 29. Semana = domingo a sábado.
const folga = (id: string, data: string) => ({ funcionario_id: id, data });
describe("uma folga por semana", () => {
  it("segunda folga na mesma semana é avisada", () =>
    expect(umaFolgaPorSemana.validar({ ...base, funcionario: ana, data: "2026-11-13", folgas: [folga("a", "2026-11-10")] }).valido).toBe(false));
  it("folga em outra semana é permitida", () =>
    expect(umaFolgaPorSemana.validar({ ...base, funcionario: ana, data: "2026-11-15", folgas: [folga("a", "2026-11-10")] }).valido).toBe(true));
  it("folga de outro funcionário na mesma semana não conta", () =>
    expect(umaFolgaPorSemana.validar({ ...base, funcionario: ana, data: "2026-11-13", folgas: [folga("b", "2026-11-10")] }).valido).toBe(true));
  it("a própria folga já cadastrada no dia não conta contra si", () =>
    expect(umaFolgaPorSemana.validar({ ...base, funcionario: ana, data: "2026-11-10", folgas: [folga("a", "2026-11-10")] }).valido).toBe(true));
  it("semana que cruza o mês é respeitada (28/11 sáb e 29/11 dom são semanas diferentes)", () =>
    expect(umaFolgaPorSemana.validar({ ...base, funcionario: ana, data: "2026-11-29", folgas: [folga("a", "2026-11-28")] }).valido).toBe(true));
  it("semana que cruza o mês: 30/11 (seg) e 05/12 (sáb) são a mesma semana", () =>
    expect(umaFolgaPorSemana.validar({ ...base, funcionario: ana, data: "2026-12-05", folgas: [folga("a", "2026-11-30")] }).valido).toBe(false));
});
describe("2 domingos seguidos trabalhados -> o próximo é folga", () => {
  const desde = "2026-11-01";
  it("sem folgas: a partir do 3º domingo é obrigatório", () =>
    expect(domingosObrigatorios("a", [], "2026-11-01", "2026-11-30", desde)).toEqual(["2026-11-15", "2026-11-22", "2026-11-29"]));
  it("folga no 3º domingo resolve e reinicia a contagem", () =>
    expect(domingosObrigatorios("a", [folga("a", "2026-11-15")], "2026-11-01", "2026-11-30", desde)).toEqual([]));
  it("folga em um dos 2 domingos anteriores impede a obrigação, até a contagem recomeçar", () =>
    expect(domingosObrigatorios("a", [folga("a", "2026-11-08")], "2026-11-01", "2026-11-30", desde)).toEqual(["2026-11-29"]));
  it("folga de outro funcionário não conta", () =>
    expect(domingosObrigatorios("a", [folga("b", "2026-11-15")], "2026-11-01", "2026-11-15", desde)).toEqual(["2026-11-15"]));
  it("enxerga o histórico de meses anteriores", () =>
    expect(domingosObrigatorios("a", [], "2026-12-01", "2026-12-06", "2026-11-01")).toEqual(["2026-12-06"]));
  it("sem 'desde', dia sem folga conta como trabalhado desde sempre", () =>
    expect(domingosObrigatorios("a", [], "2026-11-01", "2026-11-08", null)).toEqual(["2026-11-01", "2026-11-08"]));
});
describe("verificarEscala", () => {
  it("lista domingo obrigatório e semana com 2 folgas", () => {
    const r = verificarEscala({
      funcionarios: [ana], de: "2026-11-01", ate: "2026-11-30", desde: "2026-11-01",
      folgas: [folga("a", "2026-11-10"), folga("a", "2026-11-12"), folga("a", "2026-11-29")],
    });
    expect(r.map((p) => p.data)).toEqual(["2026-11-12", "2026-11-15", "2026-11-22"]);
  });
  it("escala em dia não gera pendências", () =>
    expect(verificarEscala({ funcionarios: [ana], de: "2026-11-01", ate: "2026-11-30", desde: "2026-11-01", folgas: [folga("a", "2026-11-15"), folga("a", "2026-11-24")] })).toEqual([]));
});