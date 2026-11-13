import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { listarCargos } from "@/services/cargos";
import { listarFuncionarios, salvarFuncionario, excluirFuncionario, type Funcionario } from "@/services/funcionarios";
import { textoSobreCor } from "@/lib/cores";

export const Route = createFileRoute("/funcionarios")({
  head: () => ({ meta: [
    { title: "Funcionários — Escala de Folgas" },
    { name: "description", content: "Cadastre funcionários, seus cargos e cores na escala." },
    { property: "og:title", content: "Funcionários — Escala de Folgas" },
    { property: "og:description", content: "Cadastre funcionários, seus cargos e cores na escala." },
  ] }),
  component: FuncionariosPage,
});

function FuncionariosPage() {
  const qc = useQueryClient();
  const { data: funcionarios = [], isLoading } = useQuery({ queryKey: ["funcionarios"], queryFn: listarFuncionarios });
  const { data: cargos = [] } = useQuery({ queryKey: ["cargos"], queryFn: listarCargos });
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [form, setForm] = useState({ nome: "", cargo_id: "" });
  const [excluir, setExcluir] = useState<Funcionario | null>(null);

  const salvar = useMutation({
    mutationFn: () => salvarFuncionario(form, editando?.id),
    onSuccess: () => { toast.success(editando ? "Funcionário atualizado." : "Funcionário cadastrado."); setAberto(false); qc.invalidateQueries({ queryKey: ["funcionarios"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remover = useMutation({
    mutationFn: (id: string) => excluirFuncionario(id),
    onSuccess: () => { toast.success("Funcionário excluído."); qc.invalidateQueries({ queryKey: ["funcionarios"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const abrir = (f: Funcionario | null) => {
    if (!f && cargos.length === 0) { toast.error("Cadastre um cargo antes de adicionar funcionários."); return; }
    setEditando(f);
    setForm(f ? { nome: f.nome, cargo_id: f.cargo_id } : { nome: "", cargo_id: "" });
    setAberto(true);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Funcionários" subtitle="Equipe que participa da escala de folgas."
        action={<Button onClick={() => abrir(null)}><Plus /> Novo funcionário</Button>} />
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Cargo</TableHead><TableHead className="w-28 text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={3} className="text-muted-foreground">Carregando…</TableCell></TableRow>
            : funcionarios.length === 0 ? <TableRow><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">Nenhum funcionário cadastrado ainda.</TableCell></TableRow>
            : funcionarios.map((f) => (
              <TableRow key={f.id}>
                <TableCell><span className="flex items-center gap-3 font-semibold"><span className="size-3.5 rounded-full ring-2 ring-background" style={{ backgroundColor: f.cargos?.cor }} /><span className="rounded-md px-2 py-1" style={{ backgroundColor: f.cargos?.cor, color: f.cargos?.cor ? textoSobreCor(f.cargos.cor) : undefined }}>{f.nome}</span></span></TableCell>
                <TableCell className="text-muted-foreground">{f.cargos?.nome ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => abrir(f)}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label="Excluir" onClick={() => setExcluir(f)}><Trash2 className="text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editando ? "Editar funcionário" : "Novo funcionário"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); salvar.mutate(); }} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} autoFocus /></div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select value={form.cargo_id} onValueChange={(v) => setForm({ ...form, cargo_id: v })}>
                <SelectTrigger><SelectValue placeholder="Escolha um cargo" /></SelectTrigger>
                <SelectContent>{cargos.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvar.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)} title="Excluir funcionário?"
        description={`"${excluir?.nome ?? ""}" será removido, junto com suas folgas.`}
        onConfirm={() => { if (excluir) remover.mutate(excluir.id); setExcluir(null); }} />
    </div>
  );
}
