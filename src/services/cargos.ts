import { supabase } from "@/integrations/supabase/client";
import { limparNome, nomeDuplicado } from "@/lib/nomes";

export type Cargo = { id: string; nome: string; created_at: string };

export async function listarCargos(): Promise<Cargo[]> {
  const { data, error } = await supabase.from("cargos").select("*").order("nome");
  if (error) throw new Error("Não foi possível carregar os cargos.");
  return data;
}

async function validar(nome: string, id?: string) {
  const limpo = limparNome(nome);
  if (!limpo) throw new Error("Informe o nome do cargo.");
  if (nomeDuplicado(limpo, await listarCargos(), id)) throw new Error(`Já existe um cargo chamado "${limpo}".`);
  return limpo;
}

export async function salvarCargo(nome: string, id?: string) {
  const limpo = await validar(nome, id);
  const { error } = id
    ? await supabase.from("cargos").update({ nome: limpo }).eq("id", id)
    : await supabase.from("cargos").insert({ nome: limpo });
  if (error) throw new Error(error.code === "23505" ? `Já existe um cargo chamado "${limpo}".` : "Não foi possível salvar o cargo.");
}

export async function excluirCargo(id: string) {
  const { count } = await supabase.from("funcionarios").select("id", { count: "exact", head: true }).eq("cargo_id", id);
  if (count && count > 0)
    throw new Error(`Este cargo não pode ser excluído: ${count} funcionário${count > 1 ? "s usam" : " usa"} este cargo.`);
  const { error } = await supabase.from("cargos").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o cargo.");
}
