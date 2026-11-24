import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./input-2NYfids5.mjs";
import { d as ChevronRight, f as ChevronLeft, i as Trash2, o as Search, r as TriangleAlert, s as Plus } from "../_libs/lucide-react.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, f as DialogHeader, i as AlertDialogContent, l as Dialog, m as Label, n as AlertDialogAction, o as AlertDialogFooter, p as DialogTitle, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as DialogContent } from "./nomes-BOIzUybv.mjs";
import { t as supabase } from "./client-CPmvs8V5.mjs";
import { a as formatarJornadaCompacta, c as normalizarHora, d as textoSobreCor, i as formatarDuracao, o as listarCargos, s as listarFuncionarios, t as cargaDiariaMinutos } from "./cores-KjMaiK8e.mjs";
import { n as listarTiposFolga } from "./tiposFolga-C4I1QWjk.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendario-D4Y_cm3L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function listarFolgas() {
	const { data, error } = await supabase.from("folgas").select("id, funcionario_id, data, tipo_id, tipo:tipos_folga(nome, sigla)").order("data");
	if (error) throw new Error("Não foi possível carregar as folgas.");
	return data;
}
async function criarFolga(funcionario_id, data, tipo_id) {
	const { error } = await supabase.from("folgas").insert({
		funcionario_id,
		data,
		tipo_id: tipo_id || null
	});
	if (error) throw new Error(error.code === "23505" ? "Este funcionário já tem folga neste dia." : "Não foi possível salvar a folga.");
}
async function atualizarTipoFolga(id, tipo_id) {
	const { data, error } = await supabase.from("folgas").update({ tipo_id }).eq("id", id).select("id").maybeSingle();
	if (error) throw new Error("Não foi possível atualizar o tipo da folga.");
	if (!data) throw new Error("A folga não foi atualizada. Atualize a página e tente novamente.");
}
async function excluirFolga(id) {
	const { error } = await supabase.from("folgas").delete().eq("id", id);
	if (error) throw new Error("Não foi possível remover a folga.");
}
var CONFIG_PADRAO = {
	limitePorCargoDia: 1,
	maxFolgasMes: 4
};
function somarDias(data, dias) {
	const d = /* @__PURE__ */ new Date(`${data}T12:00:00Z`);
	d.setUTCDate(d.getUTCDate() + dias);
	return d.toISOString().slice(0, 10);
}
var limitePorCargo = {
	id: "limite-cargo-dia",
	descricao: "Limite de pessoas do mesmo cargo de folga no mesmo dia",
	validar({ funcionario, data, folgas, funcionarios, config }) {
		const cargoDe = new Map(funcionarios.map((f) => [f.id, f.cargo_id]));
		const mesmos = folgas.filter((f) => f.data === data && f.funcionario_id !== funcionario.id && cargoDe.get(f.funcionario_id) === funcionario.cargo_id).length;
		return mesmos + 1 > config.limitePorCargoDia ? {
			valido: false,
			mensagem: `Já há ${mesmos} pessoa(s) do mesmo cargo de folga neste dia (limite: ${config.limitePorCargoDia}).`
		} : { valido: true };
	}
};
var maxFolgasMes = {
	id: "max-folgas-mes",
	descricao: "Número máximo de folgas por mês",
	validar({ funcionario, data, folgas, config }) {
		const mes = data.slice(0, 7);
		const qtd = folgas.filter((f) => f.funcionario_id === funcionario.id && f.data.startsWith(mes) && f.data !== data).length;
		return qtd + 1 > config.maxFolgasMes ? {
			valido: false,
			mensagem: `${funcionario.nome} já tem ${qtd} folga(s) neste mês (máximo: ${config.maxFolgasMes}).`
		} : { valido: true };
	}
};
var semDiasSeguidos = {
	id: "sem-dias-seguidos",
	descricao: "Nada de folgas em dias seguidos",
	validar({ funcionario, data, folgas }) {
		const vizinhos = [somarDias(data, -1), somarDias(data, 1)];
		return folgas.some((f) => f.funcionario_id === funcionario.id && vizinhos.includes(f.data)) ? {
			valido: false,
			mensagem: `${funcionario.nome} já tem folga no dia anterior ou seguinte.`
		} : { valido: true };
	}
};
var diaDaSemana = (data) => (/* @__PURE__ */ new Date(`${data}T12:00:00Z`)).getUTCDay();
var inicioDaSemana = (data) => somarDias(data, -((diaDaSemana(data) - 0 + 7) % 7));
var ddmm = (data) => `${data.slice(8, 10)}/${data.slice(5, 7)}`;
var regras = [
	limitePorCargo,
	maxFolgasMes,
	semDiasSeguidos,
	{
		id: "uma-folga-semana",
		descricao: "Cada funcionário só pode ter uma folga por semana",
		validar({ funcionario, data, folgas }) {
			const semana = inicioDaSemana(data);
			const outra = folgas.find((f) => f.funcionario_id === funcionario.id && f.data !== data && inicioDaSemana(f.data) === semana);
			return outra ? {
				valido: false,
				mensagem: `${funcionario.nome} já tem folga nesta semana (dia ${ddmm(outra.data)}).`
			} : { valido: true };
		}
	}
];
/** Retorna as mensagens das regras violadas (lista vazia = tudo certo). */
function verificarFolga(ctx) {
	return regras.map((r) => r.validar(ctx)).filter((r) => !r.valido).map((r) => r.mensagem ?? "Regra violada.");
}
var SEMANA = [
	"Dom",
	"Seg",
	"Ter",
	"Qua",
	"Qui",
	"Sex",
	"Sáb"
];
var pad = (n) => String(n).padStart(2, "0");
var iso = (a, m, d) => `${a}-${pad(m + 1)}-${pad(d)}`;
var CHAVE = "escala-config";
var LARGURA_COLUNA_NOMES = "14rem";
function resumoJornada(jornada) {
	const partes = [];
	if (jornada.entrada) partes.push(`Entrada ${jornada.entrada}`);
	if (jornada.saida) partes.push(`Saída ${jornada.saida}`);
	if (jornada.intervalo_inicio && jornada.intervalo_fim) partes.push(`Intervalo ${jornada.intervalo_inicio}–${jornada.intervalo_fim}`);
	const carga = cargaDiariaMinutos(jornada);
	if (carga !== null) partes.push(`Carga ${formatarDuracao(carga)}`);
	return partes.length > 0 ? partes.join(" · ") : "—";
}
function CalendarioPage() {
	const qc = useQueryClient();
	const { data: funcionarios = [] } = useQuery({
		queryKey: ["funcionarios"],
		queryFn: listarFuncionarios
	});
	const { data: cargos = [] } = useQuery({
		queryKey: ["cargos"],
		queryFn: listarCargos
	});
	const { data: folgas = [] } = useQuery({
		queryKey: ["folgas"],
		queryFn: listarFolgas
	});
	const { data: tiposFolga = [] } = useQuery({
		queryKey: ["tipos-folga"],
		queryFn: listarTiposFolga
	});
	const hoje = /* @__PURE__ */ new Date();
	const [mes, setMes] = (0, import_react.useState)({
		a: hoje.getFullYear(),
		m: hoje.getMonth()
	});
	const [visao, setVisao] = (0, import_react.useState)("calendario");
	const [mostrarCobertura, setMostrarCobertura] = (0, import_react.useState)(false);
	const [mostrarJornada, setMostrarJornada] = (0, import_react.useState)(false);
	const [config, setConfig] = (0, import_react.useState)(CONFIG_PADRAO);
	const [dia, setDia] = (0, import_react.useState)(null);
	const [funcionarioPendenteId, setFuncionarioPendenteId] = (0, import_react.useState)(null);
	const [tipoAoMarcar, setTipoAoMarcar] = (0, import_react.useState)("");
	const [buscaFuncionariosDia, setBuscaFuncionariosDia] = (0, import_react.useState)("");
	const [avisos, setAvisos] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const s = localStorage.getItem(CHAVE);
			if (s) setConfig({
				...CONFIG_PADRAO,
				...JSON.parse(s)
			});
		} catch {}
	}, []);
	const mudarConfig = (c) => {
		setConfig(c);
		localStorage.setItem(CHAVE, JSON.stringify(c));
	};
	const porId = (0, import_react.useMemo)(() => new Map(funcionarios.map((f) => [f.id, f])), [funcionarios]);
	const hojeIso = iso(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
	const inicio = new Date(mes.a, mes.m, 1).getDay();
	const total = new Date(mes.a, mes.m + 1, 0).getDate();
	const celulas = [...Array(inicio).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
	const titulo = new Date(mes.a, mes.m, 1).toLocaleDateString("pt-BR", {
		month: "long",
		year: "numeric"
	});
	const andar = (n) => {
		const d = new Date(mes.a, mes.m + n, 1);
		setMes({
			a: d.getFullYear(),
			m: d.getMonth()
		});
	};
	const abrirDia = (data) => {
		setFuncionarioPendenteId(null);
		setTipoAoMarcar("");
		setBuscaFuncionariosDia("");
		setAvisos([]);
		setDia(data);
	};
	const doDia = dia ? folgas.filter((f) => f.data === dia) : [];
	const gruposFuncionarios = (0, import_react.useMemo)(() => agruparFuncionarios(funcionarios), [funcionarios]);
	const folgaPorFuncionario = (0, import_react.useMemo)(() => {
		const porFuncionario = /* @__PURE__ */ new Map();
		doDia.forEach((folga) => porFuncionario.set(folga.funcionario_id, folga));
		return porFuncionario;
	}, [doDia]);
	const termoBuscaFolgas = buscaFuncionariosDia.trim().toLocaleLowerCase("pt-BR");
	const gruposDoDia = (0, import_react.useMemo)(() => gruposFuncionarios.map((grupo) => ({
		...grupo,
		totalCargo: grupo.funcionarios.length,
		deFolga: grupo.funcionarios.filter((f) => folgaPorFuncionario.has(f.id) && f.nome.toLocaleLowerCase("pt-BR").includes(termoBuscaFolgas)),
		trabalhando: grupo.funcionarios.filter((f) => !folgaPorFuncionario.has(f.id) && f.nome.toLocaleLowerCase("pt-BR").includes(termoBuscaFolgas))
	})).filter((grupo) => grupo.deFolga.length > 0 || grupo.trabalhando.length > 0), [
		gruposFuncionarios,
		folgaPorFuncionario,
		termoBuscaFolgas
	]);
	const totalDeFolga = funcionarios.reduce((total, f) => total + (folgaPorFuncionario.has(f.id) ? 1 : 0), 0);
	const totalTrabalhando = funcionarios.length - totalDeFolga;
	const atualizar = () => qc.invalidateQueries({ queryKey: ["folgas"] });
	const adicionar = useMutation({
		mutationFn: ({ funcionarioId, tipoId }) => criarFolga(funcionarioId, dia, tipoId),
		onSuccess: () => {
			toast.success("Folga marcada.");
			setFuncionarioPendenteId(null);
			setAvisos([]);
			atualizar();
		},
		onError: (e) => {
			toast.error(e.message);
			setFuncionarioPendenteId(null);
			setAvisos([]);
		}
	});
	const remover = useMutation({
		mutationFn: excluirFolga,
		onSuccess: () => {
			toast.success("Folga removida.");
			atualizar();
		},
		onError: (e) => toast.error(e.message)
	});
	const alterarTipo = useMutation({
		mutationFn: ({ id, tipo_id }) => atualizarTipoFolga(id, tipo_id),
		onSuccess: () => {
			toast.success("Tipo de folga atualizado.");
			atualizar();
		},
		onError: (e) => toast.error(e.message)
	});
	const tentarAdicionar = (funcionarioId) => {
		const f = porId.get(funcionarioId);
		if (!f || !dia) {
			toast.error("Escolha um funcionário.");
			return;
		}
		setFuncionarioPendenteId(funcionarioId);
		const v = verificarFolga({
			funcionario: f,
			data: dia,
			folgas,
			funcionarios,
			config
		});
		if (v.length) setAvisos(v);
		else adicionar.mutate({
			funcionarioId,
			tipoId: tipoAoMarcar || null
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `mx-auto w-full ${visao === "tabela" ? "calendar-table-view flex min-h-0 flex-1 flex-col max-w-none" : "max-w-6xl"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: "Calendário"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-border/70 bg-card px-3 py-2 shadow-sm lg:flex-nowrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-wrap items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "size-8 shrink-0",
							"aria-label": "Mês anterior",
							onClick: () => andar(-1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-8 shrink-0",
							onClick: () => setMes({
								a: hoje.getFullYear(),
								m: hoje.getMonth()
							}),
							children: "Hoje"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "size-8 shrink-0",
							"aria-label": "Próximo mês",
							onClick: () => andar(1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "ml-1 whitespace-nowrap px-1 text-base font-bold capitalize",
							children: titulo
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-4 gap-y-2 lg:flex-nowrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "lim",
								className: "whitespace-nowrap text-xs",
								children: "Máx. por cargo/dia"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lim",
								type: "number",
								min: 1,
								className: "h-8 w-16 px-2 text-sm",
								value: config.limitePorCargoDia,
								onChange: (e) => mudarConfig({
									...config,
									limitePorCargoDia: Math.max(1, Number(e.target.value) || 1)
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "max",
								className: "whitespace-nowrap text-xs",
								children: "Máx. folgas/mês"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "max",
								type: "number",
								min: 1,
								className: "h-8 w-16 px-2 text-sm",
								value: config.maxFolgasMes,
								onChange: (e) => mudarConfig({
									...config,
									maxFolgasMes: Math.max(1, Number(e.target.value) || 1)
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "group",
							"aria-label": "Visão da escala",
							className: "flex items-center gap-1 rounded-lg border bg-card p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: visao === "calendario" ? "secondary" : "ghost",
								"aria-pressed": visao === "calendario",
								onClick: () => setVisao("calendario"),
								children: "Calendário"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: visao === "tabela" ? "secondary" : "ghost",
								"aria-pressed": visao === "tabela",
								onClick: () => setVisao("tabela"),
								children: "Tabela"
							})]
						}),
						visao === "tabela" && funcionarios.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							"aria-expanded": mostrarCobertura,
							"aria-controls": "cobertura-escala",
							onClick: () => setMostrarCobertura((mostrar) => !mostrar),
							children: mostrarCobertura ? "Ocultar cobertura" : "Mostrar cobertura"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "outline",
							"aria-pressed": mostrarJornada,
							onClick: () => setMostrarJornada((mostrar) => !mostrar),
							children: mostrarJornada ? "Ocultar jornada" : "Mostrar jornada"
						})] })
					]
				})]
			}),
			visao === "calendario" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-7 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 shadow-sm md:grid",
				children: [SEMANA.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-muted px-2 py-2 text-center text-xs font-bold uppercase text-muted-foreground",
					children: s
				}, s)), celulas.map((d, i) => d === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-card/50" }, `v${i}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiaCelula, {
					dataIso: iso(mes.a, mes.m, d),
					numero: d,
					hoje: hojeIso,
					folgas,
					porId,
					onClick: abrirDia
				}, d))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 md:hidden",
				children: Array.from({ length: total }, (_, i) => i + 1).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiaCelula, {
					dataIso: iso(mes.a, mes.m, d),
					numero: d,
					hoje: hojeIso,
					folgas,
					porId,
					onClick: abrirDia,
					lista: true
				}, d))
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabelaEscala, {
				mes,
				funcionarios,
				folgas,
				hoje: hojeIso,
				mostrarCobertura,
				mostrarJornada,
				onCellClick: abrirDia
			}),
			visao === "calendario" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendaCargos, {
				cargos,
				tipos: tiposFolga
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!dia,
				onOpenChange: (o) => {
					if (!o) {
						setDia(null);
						setFuncionarioPendenteId(null);
						setTipoAoMarcar("");
						setBuscaFuncionariosDia("");
						setAvisos([]);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "flex w-[calc(100%-2rem)] max-w-4xl min-w-0 max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-4 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "min-w-0 shrink-0 gap-3 pr-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "min-w-0 break-words",
							children: [
								"Folgas de",
								" ",
								dia && (/* @__PURE__ */ new Date(`${dia}T12:00`)).toLocaleDateString("pt-BR", {
									weekday: "long",
									day: "numeric",
									month: "long"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid min-w-0 gap-3 md:grid-cols-[auto_minmax(0,1fr)] md:items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "min-w-0 text-sm text-muted-foreground",
								children: [
									totalDeFolga,
									" de folga · ",
									totalTrabalhando,
									" trabalhando"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid min-w-0 gap-2 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "busca-funcionarios-dia",
										children: "Buscar funcionário"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "busca-funcionarios-dia",
											"aria-label": "Buscar funcionário",
											value: buscaFuncionariosDia,
											onChange: (e) => setBuscaFuncionariosDia(e.target.value),
											placeholder: "Nome do funcionário",
											className: "h-9 pl-9"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "tipo-ao-marcar",
										children: "Tipo ao marcar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "tipo-ao-marcar",
										"aria-label": "Tipo ao marcar",
										className: "h-9 w-full min-w-0 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
										value: tipoAoMarcar,
										onChange: (e) => setTipoAoMarcar(e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Folga comum"
										}), tiposFolga.map((tipo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: tipo.id,
											children: [
												tipo.sigla,
												" — ",
												tipo.nome
											]
										}, tipo.id))]
									})]
								})]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid min-h-0 min-w-0 flex-1 grid-rows-2 gap-3 md:grid-cols-2 md:grid-rows-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecaoFolgasDia, {
							titulo: "De folga",
							tipo: "deFolga",
							grupos: gruposDoDia,
							contagem: gruposDoDia.reduce((n, grupo) => n + grupo.deFolga.length, 0),
							folgaPorFuncionario,
							tiposFolga,
							marcando: adicionar.isPending,
							removendo: remover.isPending,
							atualizandoTipo: alterarTipo.isPending,
							onMarcar: tentarAdicionar,
							onRemover: (id) => remover.mutate(id),
							onMudarTipo: (id, tipo_id) => alterarTipo.mutate({
								id,
								tipo_id
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecaoFolgasDia, {
							titulo: "Trabalhando",
							tipo: "trabalhando",
							grupos: gruposDoDia,
							contagem: gruposDoDia.reduce((n, grupo) => n + grupo.trabalhando.length, 0),
							folgaPorFuncionario,
							tiposFolga,
							marcando: adicionar.isPending,
							removendo: remover.isPending,
							atualizandoTipo: alterarTipo.isPending,
							onMarcar: tentarAdicionar,
							onRemover: (id) => remover.mutate(id),
							onMudarTipo: (id, tipo_id) => alterarTipo.mutate({
								id,
								tipo_id
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: avisos.length > 0,
				onOpenChange: (o) => {
					if (!o) {
						setAvisos([]);
						setFuncionarioPendenteId(null);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "text-destructive" }), " Atenção: regra da escala"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc space-y-1 pl-5",
						children: avisos.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: a }, a))
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					onClick: () => setFuncionarioPendenteId(null),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => {
						if (funcionarioPendenteId) adicionar.mutate({
							funcionarioId: funcionarioPendenteId,
							tipoId: tipoAoMarcar || null
						});
						setFuncionarioPendenteId(null);
					},
					children: "Continuar mesmo assim"
				})] })] })
			})
		]
	});
}
function jornadaDoFuncionario(funcionario) {
	return {
		entrada: normalizarHora(funcionario.entrada),
		saida: normalizarHora(funcionario.saida),
		intervalo_inicio: normalizarHora(funcionario.intervalo_inicio),
		intervalo_fim: normalizarHora(funcionario.intervalo_fim)
	};
}
function agruparFuncionarios(funcionarios) {
	const porCargo = /* @__PURE__ */ new Map();
	funcionarios.forEach((funcionario) => {
		const id = funcionario.cargo_id ?? "__sem_cargo__";
		const grupo = porCargo.get(id) ?? {
			id,
			nome: funcionario.cargos?.nome ?? "Sem cargo",
			cor: funcionario.cargos?.cor ?? void 0,
			funcionarios: []
		};
		grupo.funcionarios.push(funcionario);
		porCargo.set(id, grupo);
	});
	return Array.from(porCargo.values()).map((grupo) => ({
		...grupo,
		funcionarios: grupo.funcionarios.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
	})).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}
function SecaoFolgasDia({ titulo, tipo, grupos, contagem, folgaPorFuncionario, tiposFolga, marcando, removendo, atualizandoTipo, onMarcar, onRemover, onMudarTipo }) {
	const gruposVisiveis = grupos.filter((grupo) => grupo[tipo].length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 shrink-0 items-center justify-between gap-2 border-b px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "min-w-0 font-semibold",
				children: titulo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
				children: contagem
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 min-w-0 max-h-[60vh] flex-1 overflow-y-auto overscroll-contain p-2 pr-1",
			children: gruposVisiveis.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-8 text-center text-sm text-muted-foreground",
				children: "Nenhum funcionário nesta seção."
			}) : gruposVisiveis.map((grupo) => {
				const pessoas = grupo[tipo];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center justify-between gap-2 px-2 py-1.5",
						children: [grupo.cor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 max-w-full break-words rounded-md px-2 py-1 text-xs font-semibold [overflow-wrap:anywhere]",
							style: {
								backgroundColor: grupo.cor,
								color: textoSobreCor(grupo.cor)
							},
							children: grupo.nome
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 break-words text-sm font-semibold [overflow-wrap:anywhere]",
							children: grupo.nome
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: [
								pessoas.length,
								" de ",
								grupo.totalCargo
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border/60",
						children: pessoas.map((funcionario) => {
							const folga = folgaPorFuncionario.get(funcionario.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-center justify-between gap-2 px-2 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 break-words text-sm text-foreground [overflow-wrap:anywhere]",
									children: funcionario.nome
								}), tipo === "trabalhando" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									className: "h-8 shrink-0 px-2 sm:px-3",
									"aria-label": `Marcar folga de ${funcionario.nome}`,
									disabled: marcando,
									onClick: () => onMarcar(funcionario.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Marcar folga"
									})]
								}) : folga && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 shrink-0 items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative inline-flex w-14 min-w-0 shrink-0 cursor-pointer rounded-md transition-colors hover:bg-muted/50 focus-within:ring-2 focus-within:ring-ring",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											className: `flex w-full min-w-0 justify-center overflow-hidden rounded-md border border-dashed px-2.5 py-1.5 text-xs font-semibold leading-none ${folga.tipo?.sigla ? "text-foreground" : "text-muted-foreground"}`,
											children: folga.tipo?.sigla ?? "+ tipo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "absolute inset-0 h-full w-full cursor-pointer bg-background text-foreground [&>option]:bg-background [&>option]:text-foreground opacity-0 disabled:cursor-not-allowed",
											value: folga.tipo_id ?? "",
											"aria-label": `Trocar tipo da folga de ${funcionario.nome}`,
											title: folga.tipo ? `Tipo atual: ${folga.tipo.nome}` : "Adicionar tipo à folga",
											disabled: atualizandoTipo,
											onChange: (e) => onMudarTipo(folga.id, e.target.value || null),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Folga comum"
											}), tiposFolga.map((tipoFolga) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: tipoFolga.id,
												children: [
													tipoFolga.sigla,
													" — ",
													tipoFolga.nome
												]
											}, tipoFolga.id))]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon",
										className: "min-w-0 shrink-0",
										"aria-label": `Remover folga de ${funcionario.nome}`,
										disabled: removendo,
										onClick: () => onRemover(folga.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "text-destructive" })
									})]
								})]
							}, funcionario.id);
						})
					})]
				}, grupo.id);
			})
		})]
	});
}
function TabelaEscala({ mes, funcionarios, folgas, hoje, mostrarCobertura, mostrarJornada, onCellClick }) {
	const grupos = (0, import_react.useMemo)(() => agruparFuncionarios(funcionarios), [funcionarios]);
	const [cargosOcultos, setCargosOcultos] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const gruposVisiveis = (0, import_react.useMemo)(() => grupos.filter((grupo) => !cargosOcultos.has(grupo.id)), [cargosOcultos, grupos]);
	const dias = Array.from({ length: new Date(mes.a, mes.m + 1, 0).getDate() }, (_, i) => i + 1);
	const folgasPorCelula = (0, import_react.useMemo)(() => {
		const porCelula = /* @__PURE__ */ new Map();
		folgas.forEach((folga) => porCelula.set(`${folga.funcionario_id}:${folga.data}`, folga));
		return porCelula;
	}, [folgas]);
	const ausentesPorDia = (0, import_react.useMemo)(() => {
		const porDia = /* @__PURE__ */ new Map();
		folgas.forEach((folga) => {
			const ausentes = porDia.get(folga.data) ?? /* @__PURE__ */ new Set();
			ausentes.add(folga.funcionario_id);
			porDia.set(folga.data, ausentes);
		});
		return porDia;
	}, [folgas]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border",
		children: funcionarios.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 py-10 text-center text-sm text-muted-foreground",
			children: "Cadastre funcionários para montar a escala."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-9 flex-wrap gap-1.5 border-b px-3 py-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": cargosOcultos.size === 0,
				"aria-label": "Mostrar todos os cargos",
				className: `h-7 rounded-full px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${cargosOcultos.size === 0 ? "bg-muted text-foreground" : "border border-border bg-transparent text-muted-foreground"}`,
				onClick: () => setCargosOcultos(/* @__PURE__ */ new Set()),
				children: "Todos"
			}), grupos.map((grupo) => {
				const visivel = !cargosOcultos.has(grupo.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": visivel,
					"aria-label": `Mostrar cargo ${grupo.nome}`,
					className: `h-7 rounded-full px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${visivel ? "" : "border border-border bg-transparent text-muted-foreground"}`,
					style: visivel && grupo.cor ? {
						backgroundColor: grupo.cor,
						color: textoSobreCor(grupo.cor)
					} : void 0,
					onClick: () => setCargosOcultos((atuais) => {
						const proximos = new Set(atuais);
						if (proximos.has(grupo.id)) proximos.delete(grupo.id);
						else proximos.add(grupo.id);
						return proximos;
					}),
					children: [!visivel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-1.5 inline-block size-2 rounded-sm align-middle",
						style: grupo.cor ? { backgroundColor: grupo.cor } : void 0
					}), grupo.nome]
				}, grupo.id);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 min-w-0 flex-1 overflow-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
						className: "sr-only",
						children: "Escala mensal de folgas por funcionário e cargo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: "sticky left-0 top-0 z-40 h-7 w-56 min-w-56 max-w-56 border-b border-border bg-muted/50 px-2 py-0 text-left text-xs font-bold text-muted-foreground shadow-[1px_0_0_var(--border)]",
							children: "Funcionário / cargo"
						}),
						mostrarJornada && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							style: { left: LARGURA_COLUNA_NOMES },
							className: "sticky top-0 z-40 h-7 w-44 min-w-44 max-w-44 border-b border-border bg-muted/50 px-2 py-0 text-left text-xs font-bold text-muted-foreground shadow-[1px_0_0_var(--border)]",
							children: "Jornada"
						}),
						dias.map((numero) => {
							const data = iso(mes.a, mes.m, numero);
							const diaSemana = (/* @__PURE__ */ new Date(`${data}T12:00`)).getDay();
							const semana = SEMANA[diaSemana];
							const domingo = diaSemana === 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: `sticky top-0 z-30 h-7 min-w-8 border-b border-border px-1 py-0 text-center text-xs font-bold text-muted-foreground ${domingo || data === hoje ? "bg-primary/10 text-foreground" : "bg-muted/50"} ${domingo || data === hoje ? "border-t-[3px] border-t-[#ea6109]" : ""} ${domingo ? "ring-2 ring-inset ring-primary" : ""} ${domingo && numero !== 1 ? "border-l border-l-border/70" : ""} ${numero === dias.length ? "border-r-0" : "border-r border-border/35"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: `flex w-full flex-col items-center rounded px-1 py-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${domingo ? "hover:bg-black/10" : "hover:bg-accent"}`,
									"aria-label": `Abrir folgas de ${(/* @__PURE__ */ new Date(`${data}T12:00`)).toLocaleDateString("pt-BR", {
										weekday: "long",
										day: "numeric",
										month: "long"
									})}`,
									onClick: () => onCellClick(data),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs ${data === hoje ? "text-primary" : "text-foreground"}`,
										children: numero
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: data === hoje ? "text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary" : "text-[10px] font-bold uppercase text-muted-foreground",
										children: data === hoje ? "HOJE" : semana
									})]
								})
							}, data);
						})
					] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "[&_tr:last-child_th]:border-b-0 [&_tr:last-child_td]:border-b-0",
						children: gruposVisiveis.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: dias.length + 1 + Number(mostrarJornada),
							className: "px-4 py-6 text-center text-sm text-muted-foreground",
							children: [
								"Nenhum cargo selecionado.",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "font-semibold text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									onClick: () => setCargosOcultos(/* @__PURE__ */ new Set()),
									children: "Todos"
								})
							]
						}) }) : gruposVisiveis.map((grupo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							scope: "rowgroup",
							className: "sticky left-0 z-20 h-[22px] w-56 min-w-56 max-w-56 border-b border-border/60 border-t border-border/60 bg-muted/40 px-3 py-0.5 text-left shadow-[1px_0_0_var(--border)]",
							children: [grupo.cor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md px-2 py-0 leading-5 text-xs font-semibold",
								style: {
									backgroundColor: grupo.cor,
									color: textoSobreCor(grupo.cor)
								},
								children: grupo.nome
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: grupo.nome
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 text-[11px] font-normal text-muted-foreground",
								children: [
									grupo.funcionarios.length,
									" ",
									grupo.funcionarios.length === 1 ? "funcionário" : "funcionários"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: dias.length + Number(mostrarJornada),
							className: "border-b border-border/60 border-t border-border/60 bg-muted/40"
						})] }), grupo.funcionarios.map((funcionario) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									scope: "row",
									className: "sticky left-0 z-20 h-6 w-56 min-w-56 max-w-56 border-b border-border/60 bg-muted/50 px-2 py-0 text-left text-xs leading-4 font-medium shadow-[1px_0_0_var(--border)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block min-w-0 truncate",
										title: resumoJornada(jornadaDoFuncionario(funcionario)),
										children: funcionario.nome
									})
								}),
								mostrarJornada && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { left: LARGURA_COLUNA_NOMES },
									title: resumoJornada(jornadaDoFuncionario(funcionario)),
									className: "sticky z-20 h-6 w-44 min-w-44 max-w-44 truncate border-b border-border/60 bg-muted/50 px-2 py-0 text-[11px] tabular-nums text-muted-foreground whitespace-nowrap shadow-[1px_0_0_var(--border)]",
									children: formatarJornadaCompacta(jornadaDoFuncionario(funcionario))
								}),
								dias.map((numero) => {
									const data = iso(mes.a, mes.m, numero);
									const domingo = (/* @__PURE__ */ new Date(`${data}T12:00`)).getDay() === 0;
									const inicioSemana = domingo && numero !== 1;
									const folga = folgasPorCelula.get(`${funcionario.id}:${data}`);
									const nomeData = (/* @__PURE__ */ new Date(`${data}T12:00`)).toLocaleDateString("pt-BR", {
										weekday: "long",
										day: "numeric",
										month: "long"
									});
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: `h-6 min-w-8 border-b border-border/60 p-0 text-center ${domingo && !folga ? "bg-primary/5" : data === hoje && !folga ? "bg-primary/5" : ""} ${domingo ? "border-t-[3px] border-t-[#ea6109] ring-2 ring-inset ring-primary" : ""} ${folga && !grupo.cor ? "bg-muted" : ""} ${inicioSemana ? "border-l border-l-border/70" : ""} ${numero === dias.length ? "border-r-0" : "border-r border-border/35"}`,
										style: folga && grupo.cor ? { backgroundColor: grupo.cor } : void 0,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: `h-6 w-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${folga ? "block rounded-none bg-transparent text-center text-[11px] font-semibold" : "hover:bg-accent/60"}`,
											style: folga && grupo.cor ? { color: textoSobreCor(grupo.cor) } : void 0,
											"aria-label": folga ? `${funcionario.nome} está de folga em ${nomeData}${folga.tipo?.sigla ? `, tipo ${folga.tipo.sigla}` : ""}` : `Marcar folga para ${funcionario.nome} em ${nomeData}`,
											title: folga ? `${folga.tipo?.nome ?? "Folga comum"} — ${nomeData}` : `Marcar folga — ${nomeData}`,
											onClick: () => onCellClick(data),
											children: folga ? folga.tipo?.sigla ?? "F" : null
										})
									}, data);
								})
							]
						}, funcionario.id))] }, grupo.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tfoot", {
						id: "cobertura-escala",
						hidden: !mostrarCobertura,
						className: "[&_tr:last-child_th]:border-b-0 [&_tr:last-child_td]:border-b-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "sticky left-0 z-20 w-56 min-w-56 max-w-56 border-b border-border/60 border-t border-border/60 bg-muted/40 px-2 py-1 text-left text-xs font-bold uppercase text-muted-foreground shadow-[1px_0_0_var(--border)]",
							children: [" ", "Funcionários trabalhando"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: dias.length + Number(mostrarJornada),
							className: "border-b border-border/60 border-t border-border/60 bg-muted/40"
						})] }), gruposVisiveis.map((grupo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-muted/60 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									scope: "row",
									className: "sticky left-0 z-20 w-56 min-w-56 max-w-56 border-b border-border/60 border-t border-border/60 bg-muted/40 px-2 py-0.5 text-left text-xs shadow-[1px_0_0_var(--border)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block min-w-0 truncate",
										children: grupo.nome
									})
								}),
								mostrarJornada && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border-b border-border/60 border-t border-border/60 bg-muted/40" }),
								dias.map((numero) => {
									const data = iso(mes.a, mes.m, numero);
									const domingo = (/* @__PURE__ */ new Date(`${data}T12:00`)).getDay() === 0;
									const inicioSemana = domingo && numero !== 1;
									const ausentes = ausentesPorDia.get(data);
									const cobertura = grupo.funcionarios.reduce((total, funcionario) => total + (ausentes?.has(funcionario.id) ? 0 : 1), 0);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										title: `${cobertura} de ${grupo.funcionarios.length} trabalhando`,
										className: `min-w-8 border-b border-border/60 border-t border-border/60 px-0.5 py-1 text-center text-xs ${domingo ? "bg-primary/5 border-t-[3px] border-t-[#ea6109] ring-2 ring-inset ring-primary" : "bg-muted/40"} ${inicioSemana ? "border-l border-l-border/70" : ""} ${numero === dias.length ? "border-r-0" : "border-r border-border/35"}`,
										children: cobertura
									}, data);
								})
							]
						}, grupo.id))]
					})
				]
			})
		})] })
	});
}
function LegendaCargos({ cargos, tipos }) {
	if (cargos.length === 0 && tipos.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-3 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-bold uppercase text-muted-foreground",
				children: "Legenda"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-end gap-x-5 gap-y-3",
				children: [cargos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 text-right text-[10px] font-semibold uppercase text-muted-foreground",
					children: "Cargos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-end gap-2",
					children: cargos.map((cargo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md px-2 py-1 text-xs font-semibold",
						style: {
							backgroundColor: cargo.cor,
							color: textoSobreCor(cargo.cor)
						},
						children: cargo.nome
					}, cargo.id))
				})] }), tipos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cargos.length > 0 ? "border-l pl-5" : "",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1.5 text-right text-[10px] font-semibold uppercase text-muted-foreground",
						children: "Tipos de folga"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap justify-end gap-2",
						children: tipos.map((tipo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-md border border-dashed px-2 py-1 text-xs font-semibold text-foreground",
							children: [
								tipo.sigla,
								" — ",
								tipo.nome
							]
						}, tipo.id))
					})]
				})]
			})]
		})
	});
}
function DiaCelula({ dataIso, numero, hoje, folgas, porId, onClick, lista }) {
	const doDia = folgas.filter((f) => f.data === dataIso);
	const semana = SEMANA[(/* @__PURE__ */ new Date(`${dataIso}T12:00`)).getDay()];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onClick(dataIso),
		className: `flex w-full flex-col gap-1 bg-card p-2 text-left transition hover:bg-accent ${lista ? "rounded-lg border" : "min-h-28"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `text-sm font-bold ${dataIso === hoje ? "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground" : ""}`,
			children: [numero, lista && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-2 font-normal text-muted-foreground",
				children: semana
			})]
		}), doDia.map((f) => {
			const fn = porId.get(f.funcionario_id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "truncate rounded px-1.5 py-0.5 text-xs font-semibold",
				style: {
					backgroundColor: fn?.cargos?.cor,
					color: fn?.cargos?.cor ? textoSobreCor(fn.cargos.cor) : void 0
				},
				children: [f.tipo?.sigla && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-1",
					children: f.tipo.sigla
				}), fn?.nome]
			}, f.id);
		})]
	});
}
//#endregion
export { CalendarioPage as component };
