import type { ConfigEscala, ContextoFolga, RegraEscala } from "./types";
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

export const regras: RegraEscala[] = [limitePorCargo, maxFolgasMes, semDiasSeguidos];

/** Retorna as mensagens das regras violadas (lista vazia = tudo certo). */
export function verificarFolga(ctx: ContextoFolga): string[] {
  return regras.map((r) => r.validar(ctx)).filter((r) => !r.valido).map((r) => r.mensagem ?? "Regra violada.");
}
