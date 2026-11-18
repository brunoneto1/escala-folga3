import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check, ChevronDown, ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/PageHeader";
import { listarCargos, type Cargo } from "@/services/cargos";
import { listarFuncionarios } from "@/services/funcionarios";
import { listarFolgas, criarFolga, excluirFolga, atualizarTipoFolga } from "@/services/folgas";
import { listarTiposFolga } from "@/services/tiposFolga";
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
  const { data: tiposFolga = [] } = useQuery({ queryKey: ["tipos-folga"], queryFn: listarTiposFolga });
  const hoje = new Date();
  const [mes, setMes] = useState({ a: hoje.getFullYear(), m: hoje.getMonth() });
  const [visao, setVisao] = useState<"calendario" | "tabela">("calendario");
  const [config, setConfig] = useState<ConfigEscala>(CONFIG_PADRAO);
  const [dia, setDia] = useState<string | null>(null);
  const [escolhido, setEscolhido] = useState("");
  const [tipoEscolhido, setTipoEscolhido] = useState("");
  const [buscaFuncionario, setBuscaFuncionario] = useState("");
  const [seletorFuncionarioAberto, setSeletorFuncionarioAberto] = useState(false);
  const [cargosAbertos, setCargosAbertos] = useState<string[]>([]);
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
  const abrirDia = (data: string, funcionarioId?: string) => { setEscolhido(funcionarioId ?? ""); setTipoEscolhido(""); setDia(data); };

  const doDia = dia ? folgas.filter((f) => f.data === dia) : [];
  const disponiveis = funcionarios.filter((f) => !doDia.some((x) => x.funcionario_id === f.id));
  const gruposDisponiveis = useMemo(() => {
    const grupos = new Map<string, { id: string; nome: string; funcionarios: typeof funcionarios }>();
    disponiveis.forEach((f) => {
      const id = f.cargo_id ?? "__sem_cargo__";
      const grupo = grupos.get(id) ?? { id, nome: f.cargos?.nome ?? "Sem cargo", funcionarios: [] as typeof funcionarios };
      grupo.funcionarios.push(f);
      grupos.set(id, grupo);
    });
    return Array.from(grupos.values())
      .map((grupo) => ({ ...grupo, funcionarios: grupo.funcionarios.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")) }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [disponiveis]);
  const termoBuscaFuncionario = buscaFuncionario.trim().toLocaleLowerCase("pt-BR");
  const gruposVisiveis = useMemo(() => gruposDisponiveis
    .map((grupo) => ({
      ...grupo,
      funcionarios: grupo.funcionarios.filter((f) => f.nome.toLocaleLowerCase("pt-BR").includes(termoBuscaFuncionario)),
    }))
    .filter((grupo) => grupo.funcionarios.length > 0), [gruposDisponiveis, termoBuscaFuncionario]);

  const atualizar = () => qc.invalidateQueries({ queryKey: ["folgas"] });
  const adicionar = useMutation({
    mutationFn: () => criarFolga(escolhido, dia!, tipoEscolhido || null),
    onSuccess: () => { toast.success("Folga marcada."); setEscolhido(""); setTipoEscolhido(""); setAvisos([]); atualizar(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remover = useMutation({
    mutationFn: excluirFolga,
    onSuccess: () => { toast.success("Folga removida."); atualizar(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const alterarTipo = useMutation({
    mutationFn: ({ id, tipo_id }: { id: string; tipo_id: string | null }) => atualizarTipoFolga(id, tipo_id),
    onSuccess: () => { toast.success("Tipo de folga atualizado."); atualizar(); },
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
      <PageHeader title="Calendário" subtitle="Consulte a escala do mês e marque ou remova folgas."
        action={<div role="group" aria-label="Visão da escala" className="flex items-center gap-1 rounded-lg border bg-card p-1">
          <Button type="button" size="sm" variant={visao === "calendario" ? "secondary" : "ghost"} aria-pressed={visao === "calendario"} onClick={() => setVisao("calendario")}>Calendário</Button>
          <Button type="button" size="sm" variant={visao === "tabela" ? "secondary" : "ghost"} aria-pressed={visao === "tabela"} onClick={() => setVisao("tabela")}>Tabela</Button>
        </div>} />

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

      {visao === "calendario" ? (
        <>
          <div className="hidden grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border shadow-sm md:grid">
            {SEMANA.map((s) => <div key={s} className="bg-muted px-2 py-2 text-center text-xs font-bold uppercase text-muted-foreground">{s}</div>)}
            {celulas.map((d, i) => d === null ? <div key={`v${i}`} className="bg-card/50" /> : (
              <DiaCelula key={d} dataIso={iso(mes.a, mes.m, d)} numero={d} hoje={hojeIso} folgas={folgas} porId={porId} onClick={abrirDia} />
            ))}
          </div>
          <div className="space-y-2 md:hidden">
            {Array.from({ length: total }, (_, i) => i + 1).map((d) => (
              <DiaCelula key={d} dataIso={iso(mes.a, mes.m, d)} numero={d} hoje={hojeIso} folgas={folgas} porId={porId} onClick={abrirDia} lista />
            ))}
          </div>
        </>
      ) : (
        <TabelaEscala mes={mes} funcionarios={funcionarios} folgas={folgas} hoje={hojeIso} onCellClick={abrirDia} />
      )}

      <LegendaCargos cargos={cargos} tipos={tiposFolga} />

      <Dialog open={!!dia} onOpenChange={(o) => { if (!o) { setDia(null); setEscolhido(""); setTipoEscolhido(""); setSeletorFuncionarioAberto(false); setBuscaFuncionario(""); } }}>
        <DialogContent className="flex w-[calc(100%-2rem)] max-w-2xl min-w-0 max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-4 sm:p-6">
          <DialogHeader className="min-w-0 shrink-0 pr-8">
            <DialogTitle className="min-w-0 break-words">Folgas de {dia && new Date(`${dia}T12:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 min-w-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 max-h-[55vh]">
            {doDia.length === 0 ? <p className="min-w-0 text-sm text-muted-foreground">Ninguém de folga neste dia.</p> : doDia.map((f) => {
              const fn = porId.get(f.funcionario_id);
              return (
                <div key={f.id} className="grid min-w-0 grid-cols-1 gap-2 rounded-lg border px-3 py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="min-w-0 flex-1 basis-40 break-words [overflow-wrap:anywhere] font-semibold text-foreground">{fn?.nome}</span>
                    {fn?.cargos && (
                      <span className="min-w-0 max-w-full break-words [overflow-wrap:anywhere] rounded-md px-2 py-1 text-xs font-semibold" style={{ backgroundColor: fn.cargos.cor, color: textoSobreCor(fn.cargos.cor) }}>
                        {fn.cargos.nome}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
                    <span className="relative inline-flex w-14 min-w-0 shrink-0 cursor-pointer rounded-md transition-colors hover:bg-muted/50 focus-within:ring-2 focus-within:ring-ring">
                      <span aria-hidden="true" className={`flex w-full min-w-0 justify-center overflow-hidden rounded-md border border-dashed px-2.5 py-1.5 text-xs font-semibold leading-none ${f.tipo?.sigla ? "text-foreground" : "text-muted-foreground"}`}>
                        {f.tipo?.sigla ?? "+ tipo"}
                      </span>
                      <select
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        value={f.tipo_id ?? ""}
                        aria-label={`Trocar tipo da folga de ${fn?.nome ?? "funcionário"}`}
                        title={f.tipo ? `Tipo atual: ${f.tipo.nome}` : "Adicionar tipo à folga"}
                        onChange={(e) => alterarTipo.mutate({ id: f.id, tipo_id: e.target.value || null })}
                      >
                        <option value="">Folga comum</option>
                        {tiposFolga.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.sigla} — {tipo.nome}</option>)}
                      </select>
                    </span>
                    <Button variant="ghost" size="icon" className="min-w-0 shrink-0" aria-label="Remover folga" onClick={() => remover.mutate(f.id)}><Trash2 className="text-destructive" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
          {funcionarios.length === 0 ? <p className="min-w-0 text-sm text-muted-foreground">Cadastre funcionários para marcar folgas.</p> : (
            <DialogFooter className="w-full min-w-0 flex-col gap-2 sm:flex-row sm:justify-start sm:space-x-0">
              <Popover open={seletorFuncionarioAberto} onOpenChange={(aberto) => { setSeletorFuncionarioAberto(aberto); if (!aberto) setBuscaFuncionario(""); }}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full min-w-0 justify-between font-normal sm:flex-1">
                    <span className="min-w-0 truncate">{porId.get(escolhido)?.nome ?? "Escolha um funcionário"}</span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[min(28rem,calc(100vw-2rem))] min-w-0 p-0">
                  <div className="relative border-b p-2">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input autoFocus aria-label="Buscar funcionário" value={buscaFuncionario} onChange={(e) => setBuscaFuncionario(e.target.value)} placeholder="Buscar funcionário..." className="h-9 pl-8" />
                  </div>
                  {gruposVisiveis.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                      {disponiveis.length === 0 ? "Todos os funcionários já estão de folga neste dia." : "Nenhum funcionário encontrado."}
                    </p>
                  ) : (
                    <Accordion type="multiple" value={termoBuscaFuncionario ? gruposVisiveis.map((grupo) => grupo.id) : cargosAbertos} onValueChange={setCargosAbertos} className="max-h-[min(60vh,28rem)] overflow-y-auto px-2">
                      {gruposVisiveis.map((grupo) => (
                        <AccordionItem key={grupo.id} value={grupo.id} className="border-b border-border/60">
                          <AccordionTrigger className="py-3 hover:no-underline">
                            <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                              <span className="min-w-0 truncate text-left">{grupo.nome}</span>
                              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{grupo.funcionarios.length}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-2">
                            <div className="space-y-1">
                              {grupo.funcionarios.map((f) => (
                                <Button key={f.id} type="button" variant={escolhido === f.id ? "secondary" : "ghost"} className="w-full min-w-0 justify-between text-left" onClick={() => { setEscolhido(f.id); setSeletorFuncionarioAberto(false); setBuscaFuncionario(""); }}>
                                  <span className="min-w-0 break-words [overflow-wrap:anywhere]">{f.nome}</span>
                                  {escolhido === f.id && <Check className="shrink-0" aria-hidden="true" />}
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </PopoverContent>
              </Popover>
              <select
                id="tipo-folga"
                aria-label="Tipo de folga"
                className="h-9 w-full min-w-0 cursor-pointer rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring sm:flex-1"
                value={tipoEscolhido}
                onChange={(e) => setTipoEscolhido(e.target.value)}
              >
                <option value="">Folga comum</option>
                {tiposFolga.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.sigla} — {tipo.nome}</option>)}
              </select>
              <Button className="w-full min-w-0 sm:w-auto sm:shrink-0" onClick={tentarAdicionar} disabled={!escolhido || adicionar.isPending}>Marcar folga</Button>
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

type GrupoTabela = { id: string; nome: string; cor?: string; funcionarios: Fn[] };

function TabelaEscala({ mes, funcionarios, folgas, hoje, onCellClick }: {
  mes: { a: number; m: number };
  funcionarios: Fn[];
  folgas: Awaited<ReturnType<typeof listarFolgas>>;
  hoje: string;
  onCellClick: (data: string, funcionarioId?: string) => void;
}) {
  const grupos = useMemo(() => {
    const porCargo = new Map<string, GrupoTabela>();
    funcionarios.forEach((funcionario) => {
      const id = funcionario.cargo_id ?? "__sem_cargo__";
      const grupo = porCargo.get(id) ?? {
        id,
        nome: funcionario.cargos?.nome ?? "Sem cargo",
        cor: funcionario.cargos?.cor ?? undefined,
        funcionarios: [],
      };
      grupo.funcionarios.push(funcionario);
      porCargo.set(id, grupo);
    });
    return Array.from(porCargo.values())
      .map((grupo) => ({ ...grupo, funcionarios: grupo.funcionarios.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")) }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [funcionarios]);
  const dias = Array.from({ length: new Date(mes.a, mes.m + 1, 0).getDate() }, (_, i) => i + 1);
  const folgasPorCelula = useMemo(() => {
    const porCelula = new Map<string, (typeof folgas)[number]>();
    folgas.forEach((folga) => porCelula.set(`${folga.funcionario_id}:${folga.data}`, folga));
    return porCelula;
  }, [folgas]);
  const ausentesPorDia = useMemo(() => {
    const porDia = new Map<string, Set<string>>();
    folgas.forEach((folga) => {
      const ausentes = porDia.get(folga.data) ?? new Set<string>();
      ausentes.add(folga.funcionario_id);
      porDia.set(folga.data, ausentes);
    });
    return porDia;
  }, [folgas]);

  if (funcionarios.length === 0) {
    return <div className="rounded-xl border bg-card px-4 py-10 text-center text-sm text-muted-foreground">Cadastre funcionários para montar a escala.</div>;
  }

  return (
    <div className="max-h-[70vh] overflow-auto rounded-xl border bg-card shadow-sm">
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Escala mensal de folgas por funcionário e cargo</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 top-0 z-40 min-w-56 border-b border-r bg-muted px-3 py-2 text-left font-semibold">Funcionário / cargo</th>
            {dias.map((numero) => {
              const data = iso(mes.a, mes.m, numero);
              const semana = SEMANA[new Date(`${data}T12:00`).getDay()];
              return (
                <th key={data} scope="col" className={`sticky top-0 z-30 w-12 min-w-12 border-b border-r px-1 py-1 text-center ${data === hoje ? "bg-primary/10" : "bg-muted"}`}>
                  <button type="button" className="flex w-full flex-col items-center rounded px-1 py-1 hover:bg-accent" aria-label={`Abrir folgas de ${new Date(`${data}T12:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}`} onClick={() => onCellClick(data)}>
                    <span className="font-semibold">{numero}</span>
                    <span className="text-[10px] font-normal uppercase text-muted-foreground">{semana}</span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <Fragment key={grupo.id}>
              <tr>
                <th scope="rowgroup" colSpan={dias.length + 1} className="border-b border-t bg-muted/60 px-3 py-2 text-left">
                  {grupo.cor ? (
                    <span className="rounded-md px-2 py-1 text-xs font-semibold" style={{ backgroundColor: grupo.cor, color: textoSobreCor(grupo.cor) }}>{grupo.nome}</span>
                  ) : <span className="font-semibold">{grupo.nome}</span>}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">{grupo.funcionarios.length} {grupo.funcionarios.length === 1 ? "funcionário" : "funcionários"}</span>
                </th>
              </tr>
              {grupo.funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-muted/20">
                  <th scope="row" className="sticky left-0 z-20 min-w-56 border-b border-r bg-card px-3 py-1.5 text-left font-medium">
                    <span className="block min-w-0 [overflow-wrap:anywhere]">{funcionario.nome}</span>
                  </th>
                  {dias.map((numero) => {
                    const data = iso(mes.a, mes.m, numero);
                    const folga = folgasPorCelula.get(`${funcionario.id}:${data}`);
                    const nomeData = new Date(`${data}T12:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
                    return (
                      <td key={data} className="w-12 min-w-12 border-b border-r p-1 text-center">
                        <button type="button" className={`h-8 w-full rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${folga ? (grupo.cor ? "font-semibold" : "bg-muted font-semibold") : "hover:bg-accent"}`} style={folga && grupo.cor ? { backgroundColor: grupo.cor, color: textoSobreCor(grupo.cor) } : undefined} aria-label={folga ? `${funcionario.nome} está de folga em ${nomeData}${folga.tipo?.sigla ? `, tipo ${folga.tipo.sigla}` : ""}` : `Marcar folga para ${funcionario.nome} em ${nomeData}`} title={folga ? `${folga.tipo?.nome ?? "Folga comum"} — ${nomeData}` : `Marcar folga — ${nomeData}`} onClick={() => onCellClick(data, folga ? undefined : funcionario.id)}>
                          {folga ? folga.tipo?.sigla ?? "F" : null}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={dias.length + 1} className="border-t bg-muted px-3 py-2 text-left text-xs font-bold uppercase text-muted-foreground">Cobertura por cargo — pessoas trabalhando</th>
          </tr>
          {grupos.map((grupo) => (
            <tr key={grupo.id} className="bg-muted/60 font-semibold">
              <th scope="row" className="sticky left-0 z-20 min-w-56 border-b border-r border-t bg-muted px-3 py-2 text-left">
                <span className="block min-w-0 truncate">{grupo.nome}</span>
              </th>
              {dias.map((numero) => {
                const data = iso(mes.a, mes.m, numero);
                const ausentes = ausentesPorDia.get(data);
                const cobertura = grupo.funcionarios.reduce((total, funcionario) => total + (ausentes?.has(funcionario.id) ? 0 : 1), 0);
                return <td key={data} title={`${cobertura} de ${grupo.funcionarios.length} trabalhando`} className="w-12 min-w-12 border-b border-r border-t bg-muted px-1 py-2 text-center">{cobertura}</td>;
              })}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}

function LegendaCargos({ cargos, tipos }: { cargos: Cargo[]; tipos: Awaited<ReturnType<typeof listarTiposFolga>> }) {
  if (cargos.length === 0 && tipos.length === 0) return null;

  return (
    <div className="mt-4 flex justify-end">
      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Legenda</p>
        <div className="flex flex-wrap justify-end gap-x-5 gap-y-3">
          {cargos.length > 0 && (
            <div>
              <p className="mb-1.5 text-right text-[10px] font-semibold uppercase text-muted-foreground">Cargos</p>
              <div className="flex flex-wrap justify-end gap-2">
                {cargos.map((cargo) => (
                  <span key={cargo.id} className="rounded-md px-2 py-1 text-xs font-semibold" style={{ backgroundColor: cargo.cor, color: textoSobreCor(cargo.cor) }}>
                    {cargo.nome}
                  </span>
                ))}
              </div>
            </div>
          )}
          {tipos.length > 0 && (
            <div className={cargos.length > 0 ? "border-l pl-5" : ""}>
              <p className="mb-1.5 text-right text-[10px] font-semibold uppercase text-muted-foreground">Tipos de folga</p>
              <div className="flex flex-wrap justify-end gap-2">
                {tipos.map((tipo) => (
                  <span key={tipo.id} className="rounded-md border border-dashed px-2 py-1 text-xs font-semibold text-foreground">
                    {tipo.sigla} — {tipo.nome}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Fn = Awaited<ReturnType<typeof listarFuncionarios>>[number];
function DiaCelula({ dataIso, numero, hoje, folgas, porId, onClick, lista }: {
  dataIso: string; numero: number; hoje: string; folgas: Awaited<ReturnType<typeof listarFolgas>>;
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
        <span key={f.id} className="truncate rounded px-1.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: fn?.cargos?.cor, color: fn?.cargos?.cor ? textoSobreCor(fn.cargos.cor) : undefined }}>{f.tipo?.sigla && <span className="mr-1">{f.tipo.sigla}</span>}{fn?.nome}</span>
      ); })}
    </button>
  );
}
