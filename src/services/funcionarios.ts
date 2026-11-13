import { supabase } from "@/integrations/supabase/client";
import { limparNome, nomeDuplicado } from "@/lib/nomes";

export type Funcionario = { id: string; nome: string; cargo_id: string; created_at: string; cargos: { nome: string; cor: string } | null };
export type FuncionarioInput = { nome: string; cargo_id: string };

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const { data, error } = await supabase.from("funcionarios").select("id, nome, cargo_id, created_at, cargos(nome, cor)").order("nome");
  if (error) throw new Error("Não foi possível carregar os funcionários.");
  return data as Funcionario[];
}

export async function salvarFuncionario(input: FuncionarioInput, id?: string) {
  const nome = limparNome(input.nome);
  if (!nome) throw new Error("Informe o nome do funcionário.");
  if (!input.cargo_id) throw new Error("Escolha um cargo.");
  if (nomeDuplicado(nome, await listarFuncionarios(), id)) throw new Error(`Já existe um funcionário chamado "${nome}".`);
  const payload = { nome, cargo_id: input.cargo_id };
  const { error } = id
    ? await supabase.from("funcionarios").update(payload).eq("id", id)
    : await supabase.from("funcionarios").insert(payload);
  if (error) throw new Error(error.code === "23505" ? `Já existe um funcionário chamado "${nome}".` : "Não foi possível salvar o funcionário.");
}

export async function excluirFuncionario(id: string) {
  const { error } = await supabase.from("funcionarios").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o funcionário.");
}
