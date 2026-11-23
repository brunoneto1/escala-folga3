import { supabase } from "@/integrations/supabase/client";
import { validarJornada, type Jornada } from "@/lib/jornada";
import { limparNome, nomeDuplicado } from "@/lib/nomes";

export type Funcionario = {
  id: string;
  nome: string;
  cargo_id: string;
  created_at: string;
  entrada: string | null;
  saida: string | null;
  intervalo_inicio: string | null;
  intervalo_fim: string | null;
  cargos: { nome: string; cor: string } | null;
};
export type FuncionarioInput = { nome: string; cargo_id: string } & Jornada;

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const { data, error } = await supabase
    .from("funcionarios")
    .select(
      "id, nome, cargo_id, created_at, entrada, saida, intervalo_inicio, intervalo_fim, cargos(nome, cor)",
    )
    .order("nome");
  if (error) throw new Error("Não foi possível carregar os funcionários.");
  return data as Funcionario[];
}

export async function salvarFuncionario(input: FuncionarioInput, id?: string) {
  const nome = limparNome(input.nome);
  if (!nome) throw new Error("Informe o nome do funcionário.");
  if (!input.cargo_id) throw new Error("Escolha um cargo.");
  const erroJornada = validarJornada(input);
  if (erroJornada) throw new Error(erroJornada);
  if (nomeDuplicado(nome, await listarFuncionarios(), id))
    throw new Error(`Já existe um funcionário chamado "${nome}".`);
  const payload = {
    nome,
    cargo_id: input.cargo_id,
    entrada: input.entrada || null,
    saida: input.saida || null,
    intervalo_inicio: input.intervalo_inicio || null,
    intervalo_fim: input.intervalo_fim || null,
  };
  const { error } = id
    ? await supabase.from("funcionarios").update(payload).eq("id", id)
    : await supabase.from("funcionarios").insert(payload);
  if (error) {
    if (error.code === "23505") throw new Error(`Já existe um funcionário chamado "${nome}".`);
    if (error.code === "23514")
      throw new Error("Jornada inválida: confira entrada, saída e intervalo.");
    throw new Error("Não foi possível salvar o funcionário.");
  }
}

export async function excluirFuncionario(id: string) {
  const { error } = await supabase.from("funcionarios").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o funcionário.");
}
