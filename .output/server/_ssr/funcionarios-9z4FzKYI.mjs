import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn, n as Input, t as Button } from "./input-2NYfids5.mjs";
import { c as Pencil, i as Trash2, m as Check, n as Users, p as ChevronDown, s as Plus, u as ChevronUp } from "../_libs/lucide-react.mjs";
import { d as DialogFooter, f as DialogHeader, l as Dialog, m as Label, p as DialogTitle, u as DialogContent } from "./nomes-BOIzUybv.mjs";
import { a as formatarJornadaCompacta, c as normalizarHora, d as textoSobreCor, f as validarJornada, i as formatarDuracao, o as listarCargos, r as excluirFuncionario, s as listarFuncionarios, t as cargaDiariaMinutos, u as salvarFuncionario } from "./cores-KjMaiK8e.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHead, i as TableCell, n as Table, o as TableHeader, r as TableBody, s as TableRow, t as ConfirmDialog } from "./ConfirmDialog-jCJOZO9Q.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/funcionarios-9z4FzKYI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function FuncionariosPage() {
	const qc = useQueryClient();
	const { data: funcionarios = [], isLoading } = useQuery({
		queryKey: ["funcionarios"],
		queryFn: listarFuncionarios
	});
	const { data: cargos = [] } = useQuery({
		queryKey: ["cargos"],
		queryFn: listarCargos
	});
	const [aberto, setAberto] = (0, import_react.useState)(false);
	const [editando, setEditando] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		nome: "",
		cargo_id: "",
		entrada: "",
		saida: "",
		intervalo_inicio: "",
		intervalo_fim: ""
	});
	const [excluir, setExcluir] = (0, import_react.useState)(null);
	const erroJornada = validarJornada(form);
	const cargaMinutos = cargaDiariaMinutos(form);
	const jornadaVazia = !form.entrada && !form.saida && !form.intervalo_inicio && !form.intervalo_fim;
	const salvar = useMutation({
		mutationFn: () => salvarFuncionario(form, editando?.id),
		onSuccess: () => {
			toast.success(editando ? "Funcionário atualizado." : "Funcionário cadastrado.");
			setAberto(false);
			qc.invalidateQueries({ queryKey: ["funcionarios"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remover = useMutation({
		mutationFn: (id) => excluirFuncionario(id),
		onSuccess: () => {
			toast.success("Funcionário excluído.");
			qc.invalidateQueries({ queryKey: ["funcionarios"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const abrir = (f) => {
		if (!f && cargos.length === 0) {
			toast.error("Cadastre um cargo antes de adicionar funcionários.");
			return;
		}
		setEditando(f);
		setForm(f ? {
			nome: f.nome,
			cargo_id: f.cargo_id,
			entrada: normalizarHora(f.entrada),
			saida: normalizarHora(f.saida),
			intervalo_inicio: normalizarHora(f.intervalo_inicio),
			intervalo_fim: normalizarHora(f.intervalo_fim)
		} : {
			nome: "",
			cargo_id: "",
			entrada: "",
			saida: "",
			intervalo_inicio: "",
			intervalo_fim: ""
		});
		setAberto(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_var(--primary)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
							className: "size-5",
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl",
							children: "Funcionários"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Equipe que participa da escala de folgas."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => abrir(null),
					className: "rounded-xl shadow-[0_8px_20px_-8px_var(--primary)] hover:brightness-110",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), " Novo funcionário"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-muted/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: "border-border hover:bg-transparent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-bold uppercase tracking-[0.14em] text-foreground",
								children: "FUNCIONÁRIO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-bold uppercase tracking-[0.14em] text-muted-foreground",
								children: "CARGO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "font-bold uppercase tracking-[0.14em] text-muted-foreground",
								children: "JORNADA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "w-28 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Ações"
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
					className: "border-border hover:bg-transparent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 4,
						className: "px-5 py-12 text-center text-muted-foreground",
						children: "Carregando…"
					})
				}) : funcionarios.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
					className: "border-border hover:bg-transparent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 4,
						className: "px-5 py-12 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
								className: "size-12 text-muted-foreground/40",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nenhum funcionário cadastrado ainda." })]
						})
					})
				}) : funcionarios.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					style: { "--cor": f.cargos?.cor },
					className: "border-border transition-[background-color,box-shadow] duration-200 hover:bg-muted/50 hover:shadow-[inset_3px_0_0_var(--cor)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-center gap-3 font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-3.5 shrink-0 rounded-full ring-2 ring-background",
								style: { backgroundColor: f.cargos?.cor }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 rounded-md px-2 py-1 [overflow-wrap:anywhere]",
								style: {
									backgroundColor: f.cargos?.cor,
									color: f.cargos?.cor ? textoSobreCor(f.cargos.cor) : void 0
								},
								children: f.nome
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: f.cargos?.cor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold text-foreground",
							style: {
								backgroundColor: "color-mix(in oklab, var(--cor) 15%, transparent)",
								borderColor: "color-mix(in oklab, var(--cor) 40%, transparent)"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-1.5 shrink-0 rounded-full",
								style: { backgroundColor: "var(--cor)" }
							}), f.cargos.nome]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "—"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm text-muted-foreground tabular-nums whitespace-nowrap",
							children: formatarJornadaCompacta({
								entrada: normalizarHora(f.entrada),
								saida: normalizarHora(f.saida),
								intervalo_inicio: normalizarHora(f.intervalo_inicio),
								intervalo_fim: normalizarHora(f.intervalo_fim)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-10 rounded-xl text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring",
								"aria-label": `Editar ${f.nome}`,
								onClick: () => abrir(f),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-10 rounded-xl text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring",
								"aria-label": `Excluir ${f.nome}`,
								onClick: () => setExcluir(f),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
							})]
						})
					]
				}, f.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: aberto,
				onOpenChange: setAberto,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editando ? "Editar funcionário" : "Novo funcionário" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
								value: form.nome,
								onChange: (e) => setForm({
									...form,
									nome: e.target.value
								}),
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cargo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.cargo_id,
								onValueChange: (v) => setForm({
									...form,
									cargo_id: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Escolha um cargo" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: cargos.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.nome
								}, c.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium text-foreground",
									children: "Jornada (opcional)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "entrada",
												children: "Entrada"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "entrada",
												type: "time",
												value: form.entrada,
												onChange: (e) => setForm({
													...form,
													entrada: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "intervalo_inicio",
												children: "Início do intervalo"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "intervalo_inicio",
												type: "time",
												value: form.intervalo_inicio,
												onChange: (e) => setForm({
													...form,
													intervalo_inicio: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "intervalo_fim",
												children: "Fim do intervalo"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "intervalo_fim",
												type: "time",
												value: form.intervalo_fim,
												onChange: (e) => setForm({
													...form,
													intervalo_fim: e.target.value
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "saida",
												children: "Saída"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "saida",
												type: "time",
												value: form.saida,
												onChange: (e) => setForm({
													...form,
													saida: e.target.value
												})
											})]
										})
									]
								}),
								!jornadaVazia && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm ${erroJornada ? "text-destructive" : "text-muted-foreground"}`,
									children: erroJornada ?? (cargaMinutos !== null ? `Carga diária: ${formatarDuracao(cargaMinutos)}` : "")
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
							disabled: salvar.isPending || !!erroJornada,
							children: "Salvar"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!excluir,
				onOpenChange: (o) => !o && setExcluir(null),
				title: "Excluir funcionário?",
				description: `"${excluir?.nome ?? ""}" será removido, junto com suas folgas.`,
				onConfirm: () => {
					if (excluir) remover.mutate(excluir.id);
					setExcluir(null);
				}
			})
		]
	});
}
//#endregion
export { FuncionariosPage as component };
