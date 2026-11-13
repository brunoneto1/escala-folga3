import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/PageHeader";
import { listarCargos, type Cargo } from "@/services/cargos";
import { listarFuncionarios } from "@/services/funcionarios";
import { listarFolgas, criarFolga, excluirFolga } from "@/services/folgas";
import { CONFIG_PADRAO, verificarFolga, type ConfigEscala } from "@/rules";
import { textoSobreCor } from "@/lib/cores";

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [
    { title: "Calendário — Escala de Folgas" },
    { name: "description", content: "Monte a escala de folgas da equipe no calendário do mês." },
    { property: "og:title", content: "Calendário — Escala de Folgas" },
    { property: "og:description", content: "Monte a escala de folgas da equipe no calendário do mês." },
  ] }),
  component: CalendarioPage,
});

const SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (a: number, m: number, d: number) => `${a}-${pad(m + 1)}-${pad(d)}`;
const CHAVE = "escala-config";

function CalendarioPage() {
  const qc = useQueryClient();
  const { data: funcionarios = [] } = useQuery({ queryKey: ["funcionarios"], queryFn: listarFuncionarios });
  const { data: cargos = [] } = useQuery({ queryKey: ["cargos"], queryFn: listarCargos });
  const { data: folgas = [] } = useQuery({ queryKey: ["folgas"], queryFn: listarFolgas });
  const hoje = new Date();
  const [mes, setMes] = useState({ a: hoje.getFullYear(), m: hoje.getMonth() });
  const [config, setConfig] = useState<ConfigEscala>(CONFIG_PADRAO);
  const [dia, setDia] = useState<string | null>(null);
  const [escolhido, setEscolhido] = useState("");
  const [avisos, setAvisos] = useState<string[]>([]);

  useEffect(() => { try { const s = localStorage.getItem(CHAVE); if (s) setConfig({ ...CONFIG_PADRAO, ...JSON.parse(s) }); } catch { /* ignore */ } }, []);
  const mudarConfig = (c: ConfigEscala) => { setConfig(c); localStorage.setItem(CHAVE, JSON.stringify(c)); };

  const porId = useMemo(() => new Map(funcionarios.map((f) => [f.id, f])), [funcionarios]);
  const hojeIso = iso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const inicio = new Date(mes.a, mes.m, 1).getDay();
  const total = new Date(mes.a, mes.m + 1, 0).getDate();
  const celulas = [...Array(inicio).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const titulo = new Date(mes.a, mes.m, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const andar = (n: number) => { const d = new Date(mes.a, mes.m + n, 1); setMes({ a: d.getFullYear(), m: d.getMonth() }); };

  const doDia = dia ? folgas.filter((f) => f.data === dia) : [];
  const disponiveis = funcionarios.filter((f) => !doDia.some((x) => x.funcionario_id === f.id));

  const atualizar = () => qc.invalidateQueries({ queryKey: ["folgas"] });
  const adicionar = useMutation({
    mutationFn: () => criarFolga(escolhido, dia!),
    onSuccess: () => { toast.success("Folga marcada."); setEscolhido(""); setAvisos([]); atualizar(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remover = useMutation({
    mutationFn: excluirFolga,
    onSuccess: () => { toast.success("Folga removida."); atualizar(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const tentarAdicionar = () => {
    const f = porId.get(escolhido);
    if (!f || !dia) { toast.error("Escolha um funcionário."); return; }
    const v = verificarFolga({ funcionario: f, data: dia, folgas, funcionarios, config });
    if (v.length) setAvisos(v); else adicionar.mutate();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Calendário" subtitle="Clique em um dia para marcar ou remover folgas." />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Mês anterior" onClick={() => andar(-1)}><ChevronLeft /></Button>
          <Button variant="outline" onClick={() => setMes({ a: hoje.getFullYear(), m: hoje.getMonth() })}>Hoje</Button>
          <Button variant="outline" size="icon" aria-label="Próximo mês" onClick={() => andar(1)}><ChevronRight /></Button>
          <h2 className="ml-2 text-lg font-bold capitalize">{titulo}</h2>
        </div>
        <div className="flex gap-4">
          <div className="space-y-1"><Label htmlFor="lim">Máx. por cargo/dia</Label>
            <Input id="lim" type="number" min={1} className="w-28" value={config.limitePorCargoDia}
              onChange={(e) => mudarConfig({ ...config, limitePorCargoDia: Math.max(1, Number(e.target.value) || 1) })} /></div>
          <div className="space-y-1"><Label htmlFor="max">Máx. folgas/mês</Label>
            <Input id="max" type="number" min={1} className="w-28" value={config.maxFolgasMes}
              onChange={(e) => mudarConfig({ ...config, maxFolgasMes: Math.max(1, Number(e.target.value) || 1) })} /></div>
        </div>
      </div>

      <div className="hidden grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border shadow-sm md:grid">
        {SEMANA.map((s) => <div key={s} className="bg-muted px-2 py-2 text-center text-xs font-bold uppercase text-muted-foreground">{s}</div>)}
        {celulas.map((d, i) => d === null ? <div key={`v${i}`} className="bg-card/50" /> : (
          <DiaCelula key={d} dataIso={iso(mes.a, mes.m, d)} numero={d} hoje={hojeIso} folgas={folgas} porId={porId} onClick={setDia} />
        ))}
      </div>
      <div className="space-y-2 md:hidden">
        {Array.from({ length: total }, (_, i) => i + 1).map((d) => (
          <DiaCelula key={d} dataIso={iso(mes.a, mes.m, d)} numero={d} hoje={hojeIso} folgas={folgas} porId={porId} onClick={setDia} lista />
        ))}
      </div>

      <LegendaCargos cargos={cargos} />

      <Dialog open={!!dia} onOpenChange={(o) => { if (!o) { setDia(null); setEscolhido(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Folgas de {dia && new Date(`${dia}T12:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {doDia.length === 0 ? <p className="text-sm text-muted-foreground">Ninguém de folga neste dia.</p> : doDia.map((f) => {
              const fn = porId.get(f.funcionario_id);
              return (
                <div key={f.id} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                  <span className="flex min-w-0 flex-1 items-center gap-2 font-semibold">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: fn?.cargos?.cor }} />
                    <span className="min-w-0 rounded px-2 py-1 [overflow-wrap:anywhere]" style={{ backgroundColor: fn?.cargos?.cor, color: fn?.cargos?.cor ? textoSobreCor(fn.cargos.cor) : undefined }}>{fn?.nome}</span>
                    <span className="min-w-0 max-w-28 truncate text-xs font-normal text-muted-foreground">{fn?.cargos?.nome}</span>
                  </span>
                  <Button variant="ghost" size="icon" className="shrink-0" aria-label="Remover folga" onClick={() => remover.mutate(f.id)}><Trash2 className="text-destructive" /></Button>
                </div>
              );
            })}
          </div>
          {funcionarios.length === 0 ? <p className="text-sm text-muted-foreground">Cadastre funcionários para marcar folgas.</p> : (
            <DialogFooter className="gap-2 sm:justify-start">
              <Select value={escolhido} onValueChange={setEscolhido}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Escolha um funcionário" /></SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">{disponiveis.map((f) => <SelectItem key={f.id} value={f.id}><span className="min-w-0 [overflow-wrap:anywhere]">{f.nome} — {f.cargos?.nome}</span></SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={tentarAdicionar} disabled={!escolhido || adicionar.isPending}>Marcar folga</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={avisos.length > 0} onOpenChange={(o) => !o && setAvisos([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" /> Atenção: regra da escala</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <ul className="list-disc space-y-1 pl-5">{avisos.map((a) => <li key={a}>{a}</li>)}</ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => adicionar.mutate()}>Continuar mesmo assim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function LegendaCargos({ cargos }: { cargos: Cargo[] }) {
  if (cargos.length === 0) return null;

  return (
    <div className="mt-4 flex justify-end">
      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Legenda</p>
        <div className="flex flex-wrap justify-end gap-2">
          {cargos.map((cargo) => (
            <span key={cargo.id} className="rounded-md px-2 py-1 text-xs font-semibold" style={{ backgroundColor: cargo.cor, color: textoSobreCor(cargo.cor) }}>
              {cargo.nome}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type Fn = Awaited<ReturnType<typeof listarFuncionarios>>[number];
function DiaCelula({ dataIso, numero, hoje, folgas, porId, onClick, lista }: {
  dataIso: string; numero: number; hoje: string; folgas: { id: string; funcionario_id: string; data: string }[];
  porId: Map<string, Fn>; onClick: (d: string) => void; lista?: boolean;
}) {
  const doDia = folgas.filter((f) => f.data === dataIso);
  const semana = SEMANA[new Date(`${dataIso}T12:00`).getDay()];
  return (
    <button type="button" onClick={() => onClick(dataIso)}
      className={`flex w-full flex-col gap-1 bg-card p-2 text-left transition hover:bg-accent ${lista ? "rounded-lg border" : "min-h-28"}`}>
      <span className={`text-sm font-bold ${dataIso === hoje ? "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground" : ""}`}>
        {numero}{lista && <span className="ml-2 font-normal text-muted-foreground">{semana}</span>}
      </span>
      {doDia.map((f) => { const fn = porId.get(f.funcionario_id); return (
        <span key={f.id} className="truncate rounded px-1.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: fn?.cargos?.cor, color: fn?.cargos?.cor ? textoSobreCor(fn.cargos.cor) : undefined }}>{fn?.nome}</span>
      ); })}
    </button>
  );
}
