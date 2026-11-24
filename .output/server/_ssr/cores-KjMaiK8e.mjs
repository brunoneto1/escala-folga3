import { _ as nomeDuplicado, g as limparNome } from "./nomes-BOIzUybv.mjs";
import { t as supabase } from "./client-CPmvs8V5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cores-KjMaiK8e.js
async function listarCargos() {
	const { data, error } = await supabase.from("cargos").select("*").order("nome");
	if (error) throw new Error("Não foi possível carregar os cargos.");
	return data;
}
async function validar(nome, id) {
	const limpo = limparNome(nome);
	if (!limpo) throw new Error("Informe o nome do cargo.");
	if (nomeDuplicado(limpo, await listarCargos(), id)) throw new Error(`Já existe um cargo chamado "${limpo}".`);
	return limpo;
}
async function salvarCargo(nome, cor, id) {
	const limpo = await validar(nome, id);
	const { error } = id ? await supabase.from("cargos").update({
		nome: limpo,
		cor
	}).eq("id", id) : await supabase.from("cargos").insert({
		nome: limpo,
		cor
	});
	if (error) throw new Error(error.code === "23505" ? `Já existe um cargo chamado "${limpo}".` : "Não foi possível salvar o cargo.");
}
async function excluirCargo(id) {
	const { count } = await supabase.from("funcionarios").select("id", {
		count: "exact",
		head: true
	}).eq("cargo_id", id);
	if (count && count > 0) throw new Error(`Este cargo não pode ser excluído: ${count} funcionário${count > 1 ? "s usam" : " usa"} este cargo.`);
	const { error } = await supabase.from("cargos").delete().eq("id", id);
	if (error) throw new Error("Não foi possível excluir o cargo.");
}
function normalizarHora(v) {
	if (!v) return "";
	return v.replace(/^(\d{2}:\d{2}):\d{2}$/, "$1");
}
function paraMinutos(hhmm) {
	const [horas, minutos] = hhmm.split(":");
	return Number(horas) * 60 + Number(minutos);
}
function validarJornada(j) {
	if ([
		j.entrada,
		j.saida,
		j.intervalo_inicio,
		j.intervalo_fim
	].some((hora) => hora !== "" && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora))) return "Informe horários válidos no formato HH:MM.";
	const temEntrada = j.entrada !== "";
	const temSaida = j.saida !== "";
	const temInicioIntervalo = j.intervalo_inicio !== "";
	const temFimIntervalo = j.intervalo_fim !== "";
	if (temInicioIntervalo !== temFimIntervalo) return "Informe o início e o fim do intervalo.";
	if (!temEntrada || !temSaida) {
		if (temInicioIntervalo && temFimIntervalo) return "Informe entrada e saída para definir o intervalo.";
		if (temEntrada || temSaida) return "Informe entrada e saída da jornada.";
		return null;
	}
	const entrada = paraMinutos(j.entrada);
	const saida = paraMinutos(j.saida);
	if (saida <= entrada) return "A saída deve ser depois da entrada.";
	if (temInicioIntervalo && temFimIntervalo) {
		const inicio = paraMinutos(j.intervalo_inicio);
		const fim = paraMinutos(j.intervalo_fim);
		if (inicio < entrada) return "O início do intervalo não pode ser antes da entrada.";
		if (fim <= inicio) return "O fim do intervalo deve ser depois do início.";
		if (fim > saida) return "O fim do intervalo não pode ser depois da saída.";
	}
	return null;
}
function cargaDiariaMinutos(j) {
	if (validarJornada(j) || !j.entrada || !j.saida) return null;
	const duracaoIntervalo = j.intervalo_inicio && j.intervalo_fim ? paraMinutos(j.intervalo_fim) - paraMinutos(j.intervalo_inicio) : 0;
	return paraMinutos(j.saida) - paraMinutos(j.entrada) - duracaoIntervalo;
}
function formatarDuracao(min) {
	const horas = Math.floor(min / 60);
	const minutos = min % 60;
	return minutos === 0 ? `${horas}h` : `${horas}h${String(minutos).padStart(2, "0")}`;
}
function formatarJornadaCompacta(j) {
	if (!j.entrada || !j.saida) return "—";
	const jornada = `${j.entrada}–${j.saida}`;
	if (!j.intervalo_inicio || !j.intervalo_fim) return jornada;
	const inicio = paraMinutos(j.intervalo_inicio);
	const fim = paraMinutos(j.intervalo_fim);
	return `${jornada} · Int. ${inicio % 60 === 0 && fim % 60 === 0 ? `${inicio / 60}–${fim / 60}h` : `${j.intervalo_inicio}–${j.intervalo_fim}`}`;
}
async function listarFuncionarios() {
	const { data, error } = await supabase.from("funcionarios").select("id, nome, cargo_id, created_at, entrada, saida, intervalo_inicio, intervalo_fim, cargos(nome, cor)").order("nome");
	if (error) throw new Error("Não foi possível carregar os funcionários.");
	return data;
}
async function salvarFuncionario(input, id) {
	const nome = limparNome(input.nome);
	if (!nome) throw new Error("Informe o nome do funcionário.");
	if (!input.cargo_id) throw new Error("Escolha um cargo.");
	const erroJornada = validarJornada(input);
	if (erroJornada) throw new Error(erroJornada);
	if (nomeDuplicado(nome, await listarFuncionarios(), id)) throw new Error(`Já existe um funcionário chamado "${nome}".`);
	const payload = {
		nome,
		cargo_id: input.cargo_id,
		entrada: input.entrada || null,
		saida: input.saida || null,
		intervalo_inicio: input.intervalo_inicio || null,
		intervalo_fim: input.intervalo_fim || null
	};
	const { error } = id ? await supabase.from("funcionarios").update(payload).eq("id", id) : await supabase.from("funcionarios").insert(payload);
	if (error) {
		if (error.code === "23505") throw new Error(`Já existe um funcionário chamado "${nome}".`);
		if (error.code === "23514") throw new Error("Jornada inválida: confira entrada, saída e intervalo.");
		throw new Error("Não foi possível salvar o funcionário.");
	}
}
async function excluirFuncionario(id) {
	const { error } = await supabase.from("funcionarios").delete().eq("id", id);
	if (error) throw new Error("Não foi possível excluir o funcionário.");
}
function textoSobreCor(cor) {
	const hex = cor.replace("#", "");
	if (!/^[\da-f]{6}$/i.test(hex)) return "#0f172a";
	const r = Number.parseInt(hex.slice(0, 2), 16) / 255;
	const g = Number.parseInt(hex.slice(2, 4), 16) / 255;
	const b = Number.parseInt(hex.slice(4, 6), 16) / 255;
	const luminancia = (canal) => canal <= .03928 ? canal / 12.92 : ((canal + .055) / 1.055) ** 2.4;
	return .2126 * luminancia(r) + .7152 * luminancia(g) + .0722 * luminancia(b) > .179 ? "#0f172a" : "#ffffff";
}
//#endregion
export { formatarJornadaCompacta as a, normalizarHora as c, textoSobreCor as d, validarJornada as f, formatarDuracao as i, salvarCargo as l, excluirCargo as n, listarCargos as o, excluirFuncionario as r, listarFuncionarios as s, cargaDiariaMinutos as t, salvarFuncionario as u };
