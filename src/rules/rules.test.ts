import { describe, expect, it } from "vitest";
import { verificarFolga, limitePorCargo, maxFolgasMes, semDiasSeguidos } from "./index";
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
