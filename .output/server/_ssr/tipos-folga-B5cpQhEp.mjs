import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input, t as Button } from "./input-BTXCllkk.mjs";
import { c as Pencil, i as Trash2, s as Plus } from "../_libs/lucide-react.mjs";
import { d as DialogFooter, f as DialogHeader, g as PageHeader, l as Dialog, m as Label, p as DialogTitle, u as DialogContent } from "./nomes-zltfDt9_.mjs";
import { n as listarTiposFolga, r as salvarTipoFolga, t as excluirTipoFolga } from "./tiposFolga-CFZa3EzW.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHead, i as TableCell, n as Table, o as TableHeader, r as TableBody, s as TableRow, t as ConfirmDialog } from "./ConfirmDialog-vgkDbybm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tipos-folga-B5cpQhEp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TiposFolgaPage() {
	const qc = useQueryClient();
	const { data: tipos = [], isLoading } = useQuery({
		queryKey: ["tipos-folga"],
		queryFn: listarTiposFolga
	});
	const [editando, setEditando] = (0, import_react.useState)(null);
	const [aberto, setAberto] = (0, import_react.useState)(false);
	const [nome, setNome] = (0, import_react.useState)("");
	const [sigla, setSigla] = (0, import_react.useState)("");
	const [excluir, setExcluir] = (0, import_react.useState)(null);
	const salvar = useMutation({
		mutationFn: () => salvarTipoFolga(nome, sigla, editando?.id),
		onSuccess: () => {
			toast.success(editando ? "Tipo de folga atualizado." : "Tipo de folga criado.");
			setAberto(false);
			qc.invalidateQueries({ queryKey: ["tipos-folga"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remover = useMutation({
		mutationFn: excluirTipoFolga,
		onSuccess: () => {
			toast.success("Tipo de folga excluído.");
			qc.invalidateQueries({ queryKey: ["tipos-folga"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const abrir = (tipo) => {
		setEditando(tipo);
		setNome(tipo?.nome ?? "");
		setSigla(tipo?.sigla ?? "");
		setAberto(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Tipos de folga",
				subtitle: "Classifique as folgas da equipe com uma sigla curta.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => abrir(null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Novo tipo"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border bg-card shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Sigla" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-28 text-right",
						children: "Ações"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 3,
					className: "text-muted-foreground",
					children: "Carregando…"
				}) }) : tipos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 3,
					className: "py-10 text-center text-muted-foreground",
					children: "Nenhum tipo de folga cadastrado ainda."
				}) }) : tipos.map((tipo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-semibold",
						children: tipo.nome
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex min-w-10 justify-center rounded-md border border-dashed px-2 py-1 text-xs font-semibold text-foreground",
						children: tipo.sigla
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": `Editar ${tipo.nome}`,
							onClick: () => abrir(tipo),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": `Excluir ${tipo.nome}`,
							onClick: () => setExcluir(tipo),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "text-destructive" })
						})]
					})
				] }, tipo.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: aberto,
				onOpenChange: setAberto,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editando ? "Editar tipo de folga" : "Novo tipo de folga" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						salvar.mutate();
					},
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nome-tipo",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nome-tipo",
								value: nome,
								onChange: (e) => setNome(e.target.value),
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sigla-tipo",
									children: "Sigla"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sigla-tipo",
									value: sigla,
									onChange: (e) => setSigla(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "A sigla aparece na etiqueta do calendário."
								})
							]
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
				title: "Excluir tipo de folga?",
				description: `O tipo "${excluir?.nome ?? ""}" será removido.`,
				onConfirm: () => {
					if (excluir) remover.mutate(excluir.id);
					setExcluir(null);
				}
			})
		]
	});
}
//#endregion
export { TiposFolgaPage as component };
