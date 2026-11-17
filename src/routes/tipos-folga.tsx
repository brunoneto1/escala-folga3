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
import { excluirTipoFolga, listarTiposFolga, salvarTipoFolga, type TipoFolga } from "@/services/tiposFolga";

export const Route = createFileRoute("/tipos-folga")({
  head: () => ({ meta: [
    { title: "Tipos de folga — Escala de Folgas" },
    { name: "description", content: "Cadastre e gerencie os tipos de folga da equipe." },
    { property: "og:title", content: "Tipos de folga — Escala de Folgas" },
    { property: "og:description", content: "Cadastre e gerencie os tipos de folga da equipe." },
  ] }),
  component: TiposFolgaPage,
});

function TiposFolgaPage() {
  const qc = useQueryClient();
  const { data: tipos = [], isLoading } = useQuery({ queryKey: ["tipos-folga"], queryFn: listarTiposFolga });
  const [editando, setEditando] = useState<TipoFolga | null>(null);
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [excluir, setExcluir] = useState<TipoFolga | null>(null);

  const salvar = useMutation({
    mutationFn: () => salvarTipoFolga(nome, sigla, editando?.id),
    onSuccess: () => {
      toast.success(editando ? "Tipo de folga atualizado." : "Tipo de folga criado.");
      setAberto(false);
      qc.invalidateQueries({ queryKey: ["tipos-folga"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remover = useMutation({
    mutationFn: excluirTipoFolga,
    onSuccess: () => {
      toast.success("Tipo de folga excluído.");
      qc.invalidateQueries({ queryKey: ["tipos-folga"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const abrir = (tipo: TipoFolga | null) => {
    setEditando(tipo);
    setNome(tipo?.nome ?? "");
    setSigla(tipo?.sigla ?? "");
    setAberto(true);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Tipos de folga" subtitle="Classifique as folgas da equipe com uma sigla curta."
        action={<Button onClick={() => abrir(null)}><Plus /> Novo tipo</Button>} />
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Sigla</TableHead><TableHead className="w-28 text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={3} className="text-muted-foreground">Carregando…</TableCell></TableRow>
            : tipos.length === 0 ? <TableRow><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">Nenhum tipo de folga cadastrado ainda.</TableCell></TableRow>
            : tipos.map((tipo) => (
              <TableRow key={tipo.id}>
                <TableCell className="font-semibold">{tipo.nome}</TableCell>
                <TableCell>
                  <span className="inline-flex min-w-10 justify-center rounded-md border border-dashed px-2 py-1 text-xs font-semibold text-foreground">
                    {tipo.sigla}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" aria-label={`Editar ${tipo.nome}`} onClick={() => abrir(tipo)}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label={`Excluir ${tipo.nome}`} onClick={() => setExcluir(tipo)}><Trash2 className="text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editando ? "Editar tipo de folga" : "Novo tipo de folga"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); salvar.mutate(); }} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="nome-tipo">Nome</Label><Input id="nome-tipo" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus /></div>
            <div className="space-y-2">
              <Label htmlFor="sigla-tipo">Sigla</Label>
              <Input id="sigla-tipo" value={sigla} onChange={(e) => setSigla(e.target.value)} />
              <p className="text-xs text-muted-foreground">A sigla aparece na etiqueta do calendário.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
              <Button type="submit" disabled={salvar.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)} title="Excluir tipo de folga?"
        description={`O tipo "${excluir?.nome ?? ""}" será removido.`}
        onConfirm={() => { if (excluir) remover.mutate(excluir.id); setExcluir(null); }} />
    </div>
  );
}
