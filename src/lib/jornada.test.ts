import { describe, expect, it } from "vitest";
import {
  cargaDiariaMinutos,
  formatarDuracao,
  formatarJornadaCompacta,
  normalizarHora,
  paraMinutos,
  validarJornada,
  type Jornada,
} from "./jornada";

const jornadaVazia: Jornada = {
  entrada: "",
  saida: "",
  intervalo_inicio: "",
  intervalo_fim: "",
};

describe("normalizarHora", () => {
  it("converte horários com segundos e valores vazios", () => {
    expect(normalizarHora("08:00:00")).toBe("08:00");
    expect(normalizarHora("08:00")).toBe("08:00");
    expect(normalizarHora(null)).toBe("");
    expect(normalizarHora(undefined)).toBe("");
  });
});

describe("paraMinutos", () => {
  it("converte HH:MM em minutos desde meia-noite", () => {
    expect(paraMinutos("08:25")).toBe(505);
  });
});

describe("validarJornada", () => {
  it.each([
    ["jornada vazia", jornadaVazia],
    ["jornada sem intervalo", { ...jornadaVazia, entrada: "08:00", saida: "16:20" }],
    [
      "intervalo válido",
      {
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:20",
        intervalo_inicio: "13:00",
        intervalo_fim: "14:00",
      },
    ],
    [
      "intervalo na entrada e saída",
      {
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:20",
        intervalo_inicio: "08:00",
        intervalo_fim: "16:20",
      },
    ],
  ])("aceita %s", (_caso, jornada) => {
    expect(validarJornada(jornada)).toBeNull();
  });

  it.each([
    [
      "entrada sem saída",
      { ...jornadaVazia, entrada: "08:00" },
      "Informe entrada e saída da jornada.",
    ],
    [
      "saída sem entrada",
      { ...jornadaVazia, saida: "16:00" },
      "Informe entrada e saída da jornada.",
    ],
    [
      "saída igual à entrada",
      { ...jornadaVazia, entrada: "08:00", saida: "08:00" },
      "A saída deve ser depois da entrada.",
    ],
    [
      "saída antes da entrada",
      { ...jornadaVazia, entrada: "09:00", saida: "08:00" },
      "A saída deve ser depois da entrada.",
    ],
    [
      "intervalo incompleto",
      {
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:00",
        intervalo_inicio: "12:00",
      },
      "Informe o início e o fim do intervalo.",
    ],
    [
      "intervalo sem entrada e saída",
      {
        ...jornadaVazia,
        intervalo_inicio: "12:00",
        intervalo_fim: "13:00",
      },
      "Informe entrada e saída para definir o intervalo.",
    ],
    [
      "início do intervalo antes da entrada",
      {
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:00",
        intervalo_inicio: "07:59",
        intervalo_fim: "12:00",
      },
      "O início do intervalo não pode ser antes da entrada.",
    ],
    [
      "fim do intervalo igual ao início",
      {
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:00",
        intervalo_inicio: "12:00",
        intervalo_fim: "12:00",
      },
      "O fim do intervalo deve ser depois do início.",
    ],
    [
      "fim do intervalo antes do início",
      {
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:00",
        intervalo_inicio: "13:00",
        intervalo_fim: "12:00",
      },
      "O fim do intervalo deve ser depois do início.",
    ],
    [
      "fim do intervalo depois da saída",
      {
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:00",
        intervalo_inicio: "15:00",
        intervalo_fim: "16:01",
      },
      "O fim do intervalo não pode ser depois da saída.",
    ],
    [
      "horário fora do formato",
      { ...jornadaVazia, entrada: "25:00", saida: "26:00" },
      "Informe horários válidos no formato HH:MM.",
    ],
  ])("rejeita %s", (_caso, jornada, mensagem) => {
    expect(validarJornada(jornada)).toBe(mensagem);
  });
});

describe("cargaDiariaMinutos", () => {
  it("calcula a jornada descontando o intervalo", () => {
    expect(
      cargaDiariaMinutos({
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:20",
        intervalo_inicio: "13:00",
        intervalo_fim: "14:00",
      }),
    ).toBe(440);
  });

  it("retorna null para jornadas incompletas ou inválidas", () => {
    expect(cargaDiariaMinutos(jornadaVazia)).toBeNull();
    expect(cargaDiariaMinutos({ ...jornadaVazia, entrada: "08:00" })).toBeNull();
    expect(
      cargaDiariaMinutos({
        ...jornadaVazia,
        entrada: "08:00",
        saida: "08:00",
      }),
    ).toBeNull();
  });
});

describe("formatarDuracao", () => {
  it("formata horas e minutos", () => {
    expect(formatarDuracao(440)).toBe("7h20");
    expect(formatarDuracao(480)).toBe("8h");
    expect(formatarDuracao(20)).toBe("0h20");
  });
});

describe("formatarJornadaCompacta", () => {
  it("formata a jornada e intervalo em horas inteiras", () => {
    expect(
      formatarJornadaCompacta({
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:20",
        intervalo_inicio: "13:00",
        intervalo_fim: "14:00",
      }),
    ).toBe("08:00–16:20 · Int. 13–14h");
  });

  it("formata intervalo com minutos", () => {
    expect(
      formatarJornadaCompacta({
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:20",
        intervalo_inicio: "13:30",
        intervalo_fim: "14:30",
      }),
    ).toBe("08:00–16:20 · Int. 13:30–14:30");
  });

  it("formata jornada sem intervalo ou sem jornada", () => {
    expect(
      formatarJornadaCompacta({
        ...jornadaVazia,
        entrada: "08:00",
        saida: "16:20",
      }),
    ).toBe("08:00–16:20");
    expect(formatarJornadaCompacta(jornadaVazia)).toBe("—");
  });
});
