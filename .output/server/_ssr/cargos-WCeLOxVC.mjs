import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./input-BTXCllkk.mjs";
import { c as Pencil, i as Trash2, m as Check, s as Plus } from "../_libs/lucide-react.mjs";
import { d as DialogFooter, f as DialogHeader, g as PageHeader, h as PALETA, l as Dialog, m as Label, p as DialogTitle, u as DialogContent, y as sugerirCor } from "./nomes-zltfDt9_.mjs";
import { a as salvarCargo, i as listarFuncionarios, r as listarCargos, s as textoSobreCor, t as excluirCargo } from "./cores-C6rzIDTZ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHead, i as TableCell, n as Table, o as TableHeader, r as TableBody, s as TableRow, t as ConfirmDialog } from "./ConfirmDialog-vgkDbybm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cargos-WCeLOxVC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CargosPage() {
	const qc = useQueryClient();
	const { data: cargos = [], isLoading } = useQuery({
		queryKey: ["cargos"],
		queryFn: listarCargos
	});
	const { data: funcionarios = [], isLoading: funcionariosLoading } = useQuery({
		queryKey: ["funcionarios"],
		queryFn: listarFuncionarios
	});
	const [editando, setEditando] = (0, import_react.useState)(null);
	const [aberto, setAberto] = (0, import_react.useState)(false);
	const [nome, setNome] = (0, import_react.useState)("");
	const [cor, setCor] = (0, import_react.useState)(PALETA[0]);
	const [excluir, setExcluir] = (0, import_react.useState)(null);
	const salvar = useMutation({
		mutationFn: () => salvarCargo(nome, cor, editando?.id),
		onSuccess: () => {
			toast.success(editando ? "Cargo atualizado." : "Cargo criado.");
			setAberto(false);
			qc.invalidateQueries({ queryKey: ["cargos"] });
			qc.invalidateQueries({ queryKey: ["funcionarios"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remover = useMutation({
		mutationFn: (id) => excluirCargo(id),
		onSuccess: () => {
			toast.success("Cargo excluído.");
			qc.invalidateQueries({ queryKey: ["cargos"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const abrir = (c) => {
		setEditando(c);
		setNome(c?.nome ?? "");
		setCor(c?.cor ?? sugerirCor(cargos.map((cargo) => cargo.cor)));
		setAberto(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Cargos",
				subtitle: "Funções que os funcionários podem ocupar.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => abrir(null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Novo cargo"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border bg-card shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-48 min-w-48",
						children: "Nome"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Funcionários" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-28 text-right",
						children: "Ações"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 3,
					className: "text-muted-foreground",
					children: "Carregando…"
				}) }) : cargos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 3,
					className: "py-10 text-center text-muted-foreground",
					children: "Nenhum cargo cadastrado ainda."
				}) }) : cargos.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "align-top",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex whitespace-nowrap rounded-md px-2 py-1 text-sm font-semibold",
							style: {
								backgroundColor: c.cor,
								color: textoSobreCor(c.cor)
							},
							children: c.nome
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "align-top",
						children: funcionariosLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Carregando…"
						}) : funcionarios.every((f) => f.cargo_id !== c.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted-foreground",
							children: "Nenhum funcionário"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-x-6 sm:grid-cols-2",
							children: funcionarios.filter((f) => f.cargo_id === c.id).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 border-b border-border/60 py-1 text-sm [overflow-wrap:anywhere]",
								children: f.nome
							}, f.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "align-top text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Editar",
							onClick: () => abrir(c),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Excluir",
							onClick: () => setExcluir(c),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "text-destructive" })
						})]
					})
				] }, c.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: aberto,
				onOpenChange: setAberto,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editando ? "Editar cargo" : "Novo cargo" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						salvar.mutate();
					},
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nome",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nome",
								value: nome,
								onChange: (e) => setNome(e.target.value),
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cor dos funcionários deste cargo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: PALETA.map((corPaleta) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Cor ${corPaleta}`,
									onClick: () => setCor(corPaleta),
									className: "flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition hover:scale-110 data-[sel=true]:ring-2 data-[sel=true]:ring-ring",
									"data-sel": cor === corPaleta,
									style: { backgroundColor: corPaleta },
									children: cor === corPaleta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-4",
										style: { color: textoSobreCor(corPaleta) }
									})
								}, corPaleta))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setAberto(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: salvar.isPending,
							children: "Salvar"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!excluir,
				onOpenChange: (o) => !o && setExcluir(null),
				title: "Excluir cargo?",
				description: `O cargo "${excluir?.nome ?? ""}" será removido.`,
				onConfirm: () => {
					if (excluir) remover.mutate(excluir.id);
					setExcluir(null);
				}
			})
		]
	});
}
//#endregion
export { CargosPage as component };
