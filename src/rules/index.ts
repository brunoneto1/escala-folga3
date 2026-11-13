import type { ConfigEscala, ContextoFolga, FolgaRef, FuncionarioRef, RegraEscala } from "./types";
export type { RegraEscala, ResultadoRegra, ContextoFolga, ConfigEscala, FolgaRef, FuncionarioRef } from "./types";

export const CONFIG_PADRAO: ConfigEscala = { limitePorCargoDia: 1, maxFolgasMes: 4 };

function somarDias(data: string, dias: number) {
  const d = new Date(`${data}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export const limitePorCargo: RegraEscala = {
  id: "limite-cargo-dia",
  descricao: "Limite de pessoas do mesmo cargo de folga no mesmo dia",
  validar({ funcionario, data, folgas, funcionarios, config }) {
    const cargoDe = new Map(funcionarios.map((f) => [f.id, f.cargo_id]));
    const mesmos = folgas.filter((f) => f.data === data && f.funcionario_id !== funcionario.id && cargoDe.get(f.funcionario_id) === funcionario.cargo_id).length;
    return mesmos + 1 > config.limitePorCargoDia
      ? { valido: false, mensagem: `Já há ${mesmos} pessoa(s) do mesmo cargo de folga neste dia (limite: ${config.limitePorCargoDia}).` }
      : { valido: true };
  },
};

export const maxFolgasMes: RegraEscala = {
  id: "max-folgas-mes",
  descricao: "Número máximo de folgas por mês",
  validar({ funcionario, data, folgas, config }) {
    const mes = data.slice(0, 7);
    const qtd = folgas.filter((f) => f.funcionario_id === funcionario.id && f.data.startsWith(mes) && f.data !== data).length;
    return qtd + 1 > config.maxFolgasMes
      ? { valido: false, mensagem: `${funcionario.nome} já tem ${qtd} folga(s) neste mês (máximo: ${config.maxFolgasMes}).` }
      : { valido: true };
  },
};

export const semDiasSeguidos: RegraEscala = {
  id: "sem-dias-seguidos",
  descricao: "Nada de folgas em dias seguidos",
  validar({ funcionario, data, folgas }) {
    const vizinhos = [somarDias(data, -1), somarDias(data, 1)];
    const seguido = folgas.some((f) => f.funcionario_id === funcionario.id && vizinhos.includes(f.data));
    return seguido ? { valido: false, mensagem: `${funcionario.nome} já tem folga no dia anterior ou seguinte.` } : { valido: true };
  },
};

/** Primeiro dia da semana: 0 = domingo (igual ao calendário do app), 1 = segunda. */
export const INICIO_SEMANA = 0;

/**
 * Se preenchido ("AAAA-MM-DD"), a regra dos domingos só vale a partir dessa data.
 * Útil no começo do uso: sem histórico, "sem folga cadastrada" conta como "trabalhou".
 */
export const DOMINGOS_A_PARTIR_DE: string | null = null;

const diaDaSemana = (data: string) => new Date(`${data}T12:00:00Z`).getUTCDay();
const inicioDaSemana = (data: string) => somarDias(data, -((diaDaSemana(data) - INICIO_SEMANA + 7) % 7));
const ddmm = (data: string) => `${data.slice(8, 10)}/${data.slice(5, 7)}`;

/** Regra: cada funcionário só pode ter uma folga por semana. */
export const umaFolgaPorSemana: RegraEscala = {
  id: "uma-folga-semana",
  descricao: "Cada funcionário só pode ter uma folga por semana",
  validar({ funcionario, data, folgas }) {
    const semana = inicioDaSemana(data);
    const outra = folgas.find((f) => f.funcionario_id === funcionario.id && f.data !== data && inicioDaSemana(f.data) === semana);
    return outra
      ? { valido: false, mensagem: `${funcionario.nome} já tem folga nesta semana (dia ${ddmm(outra.data)}).` }
      : { valido: true };
  },
};

/**
 * Regra dos domingos: depois de 2 domingos seguidos trabalhados, o próximo domingo é folga.
 * Devolve os domingos (entre `de` e `ate`) em que o funcionário DEVERIA estar de folga e não está.
 * Dia sem folga cadastrada conta como dia trabalhado.
 */
export function domingosObrigatorios(
  funcionarioId: string, folgas: FolgaRef[], de: string, ate: string, desde: string | null = DOMINGOS_A_PARTIR_DE,
): string[] {
  const dias = new Set(folgas.filter((f) => f.funcionario_id === funcionarioId).map((f) => f.data));
  const resultado: string[] = [];
  for (let d = somarDias(de, (7 - diaDaSemana(de)) % 7); d <= ate; d = somarDias(d, 7)) {
    if (dias.has(d)) continue;
    if (desde && somarDias(d, -14) < desde) continue; // sem histórico suficiente
    if (!dias.has(somarDias(d, -7)) && !dias.has(somarDias(d, -14))) resultado.push(d);
  }
  return resultado;
}

export interface PendenciaEscala { funcionario_id: string; data: string; mensagem: string }

/** Varre o período e lista tudo que está fora das duas regras novas (inclusive folgas aceitas com "continuar mesmo assim"). */
export function verificarEscala(
  { funcionarios, folgas, de, ate, desde }: { funcionarios: FuncionarioRef[]; folgas: FolgaRef[]; de: string; ate: string; desde?: string | null },
): PendenciaEscala[] {
  const pendencias: PendenciaEscala[] = [];
  for (const f of funcionarios) {
    for (const d of domingosObrigatorios(f.id, folgas, de, ate, desde)) {
      pendencias.push({ funcionario_id: f.id, data: d, mensagem: `${f.nome} trabalhou 2 domingos seguidos: o domingo ${ddmm(d)} deveria ser folga.` });
    }
    const porSemana = new Map<string, string[]>();
    for (const x of folgas.filter((x) => x.funcionario_id === f.id && x.data >= de && x.data <= ate).sort((a, b) => a.data.localeCompare(b.data))) {
      const s = inicioDaSemana(x.data);
      porSemana.set(s, [...(porSemana.get(s) ?? []), x.data]);
    }
    for (const dias of porSemana.values()) {
      for (const d of dias.slice(1)) pendencias.push({ funcionario_id: f.id, data: d, mensagem: `${f.nome} tem mais de uma folga na semana (dia ${ddmm(d)}).` });
    }
  }
  return pendencias.sort((a, b) => a.data.localeCompare(b.data));
}

export const regras: RegraEscala[] = [limitePorCargo, maxFolgasMes, semDiasSeguidos, umaFolgaPorSemana];

/** Retorna as mensagens das regras violadas (lista vazia = tudo certo). */
export function verificarFolga(ctx: ContextoFolga): string[] {
  return regras.map((r) => r.validar(ctx)).filter((r) => !r.valido).map((r) => r.mensagem ?? "Regra violada.");
}