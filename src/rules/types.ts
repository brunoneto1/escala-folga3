/** Contrato das regras da escala de folgas. */
export interface ResultadoRegra { valido: boolean; mensagem?: string }
export interface FolgaRef { funcionario_id: string; data: string } // data: "AAAA-MM-DD"
export interface FuncionarioRef { id: string; nome: string; cargo_id: string }
export interface ConfigEscala { limitePorCargoDia: number; maxFolgasMes: number }
export interface ContextoFolga {
  funcionario: FuncionarioRef;
  data: string;
  folgas: FolgaRef[];
  funcionarios: FuncionarioRef[];
  config: ConfigEscala;
}
export interface RegraEscala<Contexto = ContextoFolga> {
  id: string;
  descricao: string;
  validar(contexto: Contexto): ResultadoRegra;
}
