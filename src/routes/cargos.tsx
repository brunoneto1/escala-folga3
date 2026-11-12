import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { listarCargos, salvarCargo, excluirCargo, type Cargo } from "@/services/cargos";

export const Route = createFileRoute("/cargos")({
  head: () => ({ meta: [
    { title: "Cargos — Escala de Folgas" },
    { name: "description", content: "Cadastre e gerencie os cargos da equipe." },
    { property: "og:title", content: "Cargos — Escala de Folgas" },
    { property: "og:description", content: "Cadastre e gerencie os cargos da equipe." },
  ] }),
  component: CargosPage,
});

function CargosPage() {
  const qc = useQueryClient();
  const { data: cargos = [], isLoading } = useQuery({ queryKey: ["cargos"], queryFn: listarCargos });
  const [editando, setEditando] = useState<Cargo | null>(null);
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [excluir, setExcluir] = useState<Cargo | null>(null);

  const salvar = useMutation({
    mutationFn: () => salvarCargo(nome, editando?.id),
    onSuccess: () => { toast.success(editando ? "Cargo atualizado." : "Cargo criado."); setAberto(false); qc.invalidateQueries({ queryKey: ["cargos"] }); qc.invalidateQueries({ queryKey: ["funcionarios"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remover = useMutation({
    mutationFn: (id: string) => excluirCargo(id),
    onSuccess: () => { toast.success("Cargo excluído."); qc.invalidateQueries({ queryKey: ["cargos"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const abrir = (c: Cargo | null) => { setEditando(c); setNome(c?.nome ?? ""); setAberto(true); };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Cargos" subtitle="Funções que os funcionários podem ocupar."
        action={<Button onClick={() => abrir(null)}><Plus /> Novo cargo</Button>} />
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead className="w-28 text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={2} className="text-muted-foreground">Carregando…</TableCell></TableRow>
            : cargos.length === 0 ? <TableRow><TableCell colSpan={2} className="py-10 text-center text-muted-foreground">Nenhum cargo cadastrado ainda.</TableCell></TableRow>
            : cargos.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-semibold">{c.nome}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => abrir(c)}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label="Excluir" onClick={() => setExcluir(c)}><Trash2 className="text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editando ? "Editar cargo" : "Novo cargo"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); salvar.mutate(); }} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvar.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)} title="Excluir cargo?"
        description={`O cargo "${excluir?.nome ?? ""}" será removido.`}
        onConfirm={() => { if (excluir) remover.mutate(excluir.id); setExcluir(null); }} />
    </div>
  );
}
