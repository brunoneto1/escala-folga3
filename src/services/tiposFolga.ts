import { supabase } from "@/integrations/supabase/client";
import { limparNome, nomeDuplicado } from "@/lib/nomes";
import type { Tables } from "@/integrations/supabase/types";

export type TipoFolga = Tables<"tipos_folga">;

export async function listarTiposFolga(): Promise<TipoFolga[]> {
  const { data, error } = await supabase.from("tipos_folga").select("*").order("nome");
  if (error) throw new Error("Não foi possível carregar os tipos de folga.");
  return data;
}

async function validar(nome: string, sigla: string, id?: string) {
  const nomeLimpo = limparNome(nome);
  const siglaLimpa = sigla.trim().toLocaleUpperCase("pt-BR");
  if (!nomeLimpo) throw new Error("Informe o nome do tipo de folga.");
  if (!siglaLimpa) throw new Error("Informe a sigla do tipo de folga.");

  const existentes = await listarTiposFolga();
  if (nomeDuplicado(nomeLimpo, existentes, id)) throw new Error(`Já existe um tipo chamado "${nomeLimpo}".`);
  if (existentes.some((tipo) => tipo.id !== id && tipo.sigla.trim().toLocaleUpperCase("pt-BR") === siglaLimpa)) {
    throw new Error(`Já existe um tipo com a sigla "${siglaLimpa}".`);
  }

  return { nome: nomeLimpo, sigla: siglaLimpa };
}

export async function salvarTipoFolga(nome: string, sigla: string, id?: string) {
  const dados = await validar(nome, sigla, id);
  const { error } = id
    ? await supabase.from("tipos_folga").update(dados).eq("id", id)
    : await supabase.from("tipos_folga").insert(dados);
  if (error) {
    throw new Error(error.code === "23505"
      ? "Já existe um tipo de folga com esse nome ou sigla."
      : "Não foi possível salvar o tipo de folga.");
  }
}

export async function excluirTipoFolga(id: string) {
  const { count, error: countError } = await supabase
    .from("folgas")
    .select("id", { count: "exact", head: true })
    .eq("tipo_id", id);
  if (countError) throw new Error("Não foi possível verificar se o tipo de folga está em uso.");
  if (count && count > 0) {
    throw new Error(`Este tipo não pode ser excluído: ${count} ${count === 1 ? "folga está vinculada a ele." : "folgas estão vinculadas a ele."}`);
  }

  const { error } = await supabase.from("tipos_folga").delete().eq("id", id);
  if (error) {
    throw new Error(error.code === "23503"
      ? "Este tipo não pode ser excluído porque há folgas vinculadas a ele."
      : "Não foi possível excluir o tipo de folga.");
  }
}
