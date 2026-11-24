export function domingosDoMes(ano: number, mes0: number): string[] {
  const primeiroDia = new Date(Date.UTC(ano, mes0, 1, 12));
  const primeiroDomingo = 1 + ((7 - primeiroDia.getUTCDay()) % 7);
  const totalDias = new Date(Date.UTC(ano, mes0 + 1, 0, 12)).getUTCDate();

  return Array.from(
    { length: Math.floor((totalDias - primeiroDomingo) / 7) + 1 },
    (_, indice) =>
      `${ano}-${String(mes0 + 1).padStart(2, "0")}-${String(primeiroDomingo + indice * 7).padStart(2, "0")}`,
  );
}

function somarDiasUtc(data: string, dias: number): string {
  const dataUtc = new Date(`${data}T12:00:00Z`);
  dataUtc.setUTCDate(dataUtc.getUTCDate() + dias);
  return dataUtc.toISOString().slice(0, 10);
}

export function domingosSeguidosTrabalhados(
  funcionarioId: string,
  folgas: { funcionario_id: string; data: string }[],
  ate: string,
  desde: string | null = null,
  limite = 26,
): number {
  const domingosDeFolga = new Set(
    folgas.filter((folga) => folga.funcionario_id === funcionarioId).map((folga) => folga.data),
  );
  const diaDaSemana = new Date(`${ate}T12:00:00Z`).getUTCDay();
  let domingo = somarDiasUtc(ate, -diaDaSemana);
  let seguidos = 0;

  for (let contagem = 0; contagem < limite; contagem += 1) {
    if ((desde && domingo < desde) || domingosDeFolga.has(domingo)) break;
    seguidos += 1;
    domingo = somarDiasUtc(domingo, -7);
  }

  return seguidos;
}
