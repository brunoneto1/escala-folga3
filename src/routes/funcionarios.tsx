import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { listarCargos } from "@/services/cargos";
import {
  listarFuncionarios,
  salvarFuncionario,
  excluirFuncionario,
  type Funcionario,
  type FuncionarioInput,
} from "@/services/funcionarios";
import { textoSobreCor } from "@/lib/cores";
import {
  cargaDiariaMinutos,
  formatarDuracao,
  formatarJornadaCompacta,
  normalizarHora,
  validarJornada,
} from "@/lib/jornada";

export const Route = createFileRoute("/funcionarios")({
  head: () => ({
    meta: [
      { title: "Funcionários — Escala de Folgas" },
      { name: "description", content: "Cadastre funcionários, seus cargos e cores na escala." },
      { property: "og:title", content: "Funcionários — Escala de Folgas" },
      {
        property: "og:description",
        content: "Cadastre funcionários, seus cargos e cores na escala.",
      },
    ],
  }),
  component: FuncionariosPage,
});

function FuncionariosPage() {
  const qc = useQueryClient();
  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: listarFuncionarios,
  });
  const { data: cargos = [] } = useQuery({ queryKey: ["cargos"], queryFn: listarCargos });
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [form, setForm] = useState<FuncionarioInput>({
    nome: "",
    cargo_id: "",
    entrada: "",
    saida: "",
    intervalo_inicio: "",
    intervalo_fim: "",
  });
  const [excluir, setExcluir] = useState<Funcionario | null>(null);
  const erroJornada = validarJornada(form);
  const cargaMinutos = cargaDiariaMinutos(form);
  const jornadaVazia =
    !form.entrada && !form.saida && !form.intervalo_inicio && !form.intervalo_fim;

  const salvar = useMutation({
    mutationFn: () => salvarFuncionario(form, editando?.id),
    onSuccess: () => {
      toast.success(editando ? "Funcionário atualizado." : "Funcionário cadastrado.");
      setAberto(false);
      qc.invalidateQueries({ queryKey: ["funcionarios"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remover = useMutation({
    mutationFn: (id: string) => excluirFuncionario(id),
    onSuccess: () => {
      toast.success("Funcionário excluído.");
      qc.invalidateQueries({ queryKey: ["funcionarios"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const abrir = (f: Funcionario | null) => {
    if (!f && cargos.length === 0) {
      toast.error("Cadastre um cargo antes de adicionar funcionários.");
      return;
    }
    setEditando(f);
    setForm(
      f
        ? {
            nome: f.nome,
            cargo_id: f.cargo_id,
            entrada: normalizarHora(f.entrada),
            saida: normalizarHora(f.saida),
            intervalo_inicio: normalizarHora(f.intervalo_inicio),
            intervalo_fim: normalizarHora(f.intervalo_fim),
          }
        : {
            nome: "",
            cargo_id: "",
            entrada: "",
            saida: "",
            intervalo_inicio: "",
            intervalo_fim: "",
          },
    );
    setAberto(true);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_var(--primary)]">
            <Users className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl">
              Funcionários
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Equipe que participa da escala de folgas.
            </p>
          </div>
        </div>
        <Button
          onClick={() => abrir(null)}
          className="rounded-xl shadow-[0_8px_20px_-8px_var(--primary)] hover:brightness-110"
        >
          <Plus /> Novo funcionário
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold uppercase tracking-[0.14em] text-foreground">
                FUNCIONÁRIO
              </TableHead>
              <TableHead className="font-bold uppercase tracking-[0.14em] text-muted-foreground">
                CARGO
              </TableHead>
              <TableHead className="font-bold uppercase tracking-[0.14em] text-muted-foreground">
                JORNADA
              </TableHead>
              <TableHead className="w-28 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                  Carregando…
                </TableCell>
              </TableRow>
            ) : funcionarios.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Users className="size-12 text-muted-foreground/40" aria-hidden="true" />
                    <span>Nenhum funcionário cadastrado ainda.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              funcionarios.map((f) => (
                <TableRow
                  key={f.id}
                  style={{ "--cor": f.cargos?.cor } as React.CSSProperties}
                  className="border-border transition-[background-color,box-shadow] duration-200 hover:bg-muted/50 hover:shadow-[inset_3px_0_0_var(--cor)]"
                >
                  <TableCell>
                    <span className="flex min-w-0 items-center gap-3 font-semibold">
                      <span
                        className="size-3.5 shrink-0 rounded-full ring-2 ring-background"
                        style={{ backgroundColor: f.cargos?.cor }}
                      />
                      <span
                        className="min-w-0 rounded-md px-2 py-1 [overflow-wrap:anywhere]"
                        style={{
                          backgroundColor: f.cargos?.cor,
                          color: f.cargos?.cor ? textoSobreCor(f.cargos.cor) : undefined,
                        }}
                      >
                        {f.nome}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    {f.cargos?.cor ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold text-foreground"
                        style={{
                          backgroundColor: "color-mix(in oklab, var(--cor) 15%, transparent)",
                          borderColor: "color-mix(in oklab, var(--cor) 40%, transparent)",
                        }}
                      >
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--cor)" }}
                        />
                        {f.cargos.nome}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                    {formatarJornadaCompacta({
                      entrada: normalizarHora(f.entrada),
                      saida: normalizarHora(f.saida),
                      intervalo_inicio: normalizarHora(f.intervalo_inicio),
                      intervalo_fim: normalizarHora(f.intervalo_fim),
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 rounded-xl text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Editar ${f.nome}`}
                      onClick={() => abrir(f)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 rounded-xl text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Excluir ${f.nome}`}
                      onClick={() => setExcluir(f)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar funcionário" : "Novo funcionário"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              salvar.mutate();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Select
                value={form.cargo_id}
                onValueChange={(v) => setForm({ ...form, cargo_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um cargo" />
                </SelectTrigger>
                <SelectContent>
                  {cargos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <section className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Jornada (opcional)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="entrada">Entrada</Label>
                  <Input
                    id="entrada"
                    type="time"
                    value={form.entrada}
                    onChange={(e) => setForm({ ...form, entrada: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intervalo_inicio">Início do intervalo</Label>
                  <Input
                    id="intervalo_inicio"
                    type="time"
                    value={form.intervalo_inicio}
                    onChange={(e) => setForm({ ...form, intervalo_inicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intervalo_fim">Fim do intervalo</Label>
                  <Input
                    id="intervalo_fim"
                    type="time"
                    value={form.intervalo_fim}
                    onChange={(e) => setForm({ ...form, intervalo_fim: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saida">Saída</Label>
                  <Input
                    id="saida"
                    type="time"
                    value={form.saida}
                    onChange={(e) => setForm({ ...form, saida: e.target.value })}
                  />
                </div>
              </div>
              {!jornadaVazia && (
                <p
                  className={`text-sm ${erroJornada ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {erroJornada ??
                    (cargaMinutos !== null ? `Carga diária: ${formatarDuracao(cargaMinutos)}` : "")}
                </p>
              )}
            </section>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={salvar.isPending || !!erroJornada}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!excluir}
        onOpenChange={(o) => !o && setExcluir(null)}
        title="Excluir funcionário?"
        description={`"${excluir?.nome ?? ""}" será removido, junto com suas folgas.`}
        onConfirm={() => {
          if (excluir) remover.mutate(excluir.id);
          setExcluir(null);
        }}
      />
    </div>
  );
}
