import { supabase } from "@/integrations/supabase/client";
export type Folga = { id: string; funcionario_id: string; data: string };

export async function listarFolgas(): Promise<Folga[]> {
  const { data, error } = await supabase.from("folgas").select("id, funcionario_id, data").order("data");
  if (error) throw new Error("Não foi possível carregar as folgas.");
  return data;
}
export async function criarFolga(funcionario_id: string, data: string) {
  const { error } = await supabase.from("folgas").insert({ funcionario_id, data });
  if (error) throw new Error(error.code === "23505" ? "Este funcionário já tem folga neste dia." : "Não foi possível salvar a folga.");
}
export async function excluirFolga(id: string) {
  const { error } = await supabase.from("folgas").delete().eq("id", id);
  if (error) throw new Error("Não foi possível remover a folga.");
}
