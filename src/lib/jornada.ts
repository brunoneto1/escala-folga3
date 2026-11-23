export type Jornada = {
  entrada: string;
  saida: string;
  intervalo_inicio: string;
  intervalo_fim: string;
};

export function normalizarHora(v?: string | null): string {
  if (!v) return "";
  return v.replace(/^(\d{2}:\d{2}):\d{2}$/, "$1");
}

export function paraMinutos(hhmm: string): number {
  const [horas, minutos] = hhmm.split(":");
  return Number(horas) * 60 + Number(minutos);
}

export function validarJornada(j: Jornada): string | null {
  const horarios = [j.entrada, j.saida, j.intervalo_inicio, j.intervalo_fim];
  if (horarios.some((hora) => hora !== "" && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora))) {
    return "Informe horários válidos no formato HH:MM.";
  }

  const temEntrada = j.entrada !== "";
  const temSaida = j.saida !== "";
  const temInicioIntervalo = j.intervalo_inicio !== "";
  const temFimIntervalo = j.intervalo_fim !== "";

  if (temInicioIntervalo !== temFimIntervalo) {
    return "Informe o início e o fim do intervalo.";
  }

  if (!temEntrada || !temSaida) {
    if (temInicioIntervalo && temFimIntervalo) {
      return "Informe entrada e saída para definir o intervalo.";
    }
    if (temEntrada || temSaida) {
      return "Informe entrada e saída da jornada.";
    }
    return null;
  }

  const entrada = paraMinutos(j.entrada);
  const saida = paraMinutos(j.saida);
  if (saida <= entrada) {
    return "A saída deve ser depois da entrada.";
  }

  if (temInicioIntervalo && temFimIntervalo) {
    const inicio = paraMinutos(j.intervalo_inicio);
    const fim = paraMinutos(j.intervalo_fim);
    if (inicio < entrada) {
      return "O início do intervalo não pode ser antes da entrada.";
    }
    if (fim <= inicio) {
      return "O fim do intervalo deve ser depois do início.";
    }
    if (fim > saida) {
      return "O fim do intervalo não pode ser depois da saída.";
    }
  }

  return null;
}

export function cargaDiariaMinutos(j: Jornada): number | null {
  if (validarJornada(j) || !j.entrada || !j.saida) return null;

  const duracaoIntervalo =
    j.intervalo_inicio && j.intervalo_fim
      ? paraMinutos(j.intervalo_fim) - paraMinutos(j.intervalo_inicio)
      : 0;
  return paraMinutos(j.saida) - paraMinutos(j.entrada) - duracaoIntervalo;
}

export function formatarDuracao(min: number): string {
  const horas = Math.floor(min / 60);
  const minutos = min % 60;
  return minutos === 0 ? `${horas}h` : `${horas}h${String(minutos).padStart(2, "0")}`;
}

export function formatarJornadaCompacta(j: Jornada): string {
  if (!j.entrada || !j.saida) return "—";

  const jornada = `${j.entrada}–${j.saida}`;
  if (!j.intervalo_inicio || !j.intervalo_fim) return jornada;

  const inicio = paraMinutos(j.intervalo_inicio);
  const fim = paraMinutos(j.intervalo_fim);
  const intervalo =
    inicio % 60 === 0 && fim % 60 === 0
      ? `${inicio / 60}–${fim / 60}h`
      : `${j.intervalo_inicio}–${j.intervalo_fim}`;
  return `${jornada} · Int. ${intervalo}`;
}
