import { supabase } from "@/integrations/supabase/client";
export type Folga = {
  id: string;
  funcionario_id: string;
  data: string;
  tipo_id: string | null;
  tipo: { nome: string; sigla: string } | null;
};

export async function listarFolgas(): Promise<Folga[]> {
  const { data, error } = await supabase
    .from("folgas")
    .select("id, funcionario_id, data, tipo_id, tipo:tipos_folga(nome, sigla)")
    .order("data");
  if (error) throw new Error("Não foi possível carregar as folgas.");
  return data;
}
export async function criarFolga(funcionario_id: string, data: string, tipo_id?: string | null) {
  const { error } = await supabase.from("folgas").insert({ funcionario_id, data, tipo_id: tipo_id || null });
  if (error) throw new Error(error.code === "23505" ? "Este funcionário já tem folga neste dia." : "Não foi possível salvar a folga.");
}

export async function atualizarTipoFolga(id: string, tipo_id: string | null) {
  const { data, error } = await supabase
    .from("folgas")
    .update({ tipo_id })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) throw new Error("Não foi possível atualizar o tipo da folga.");
  if (!data) throw new Error("A folga não foi atualizada. Atualize a página e tente novamente.");
}

export async function excluirFolga(id: string) {
  const { error } = await supabase.from("folgas").delete().eq("id", id);
  if (error) throw new Error("Não foi possível remover a folga.");
}
