import { _ as limparNome, v as nomeDuplicado } from "./nomes-zltfDt9_.mjs";
import { t as supabase } from "./client-CPmvs8V5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cores-C6rzIDTZ.js
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
async function listarFuncionarios() {
	const { data, error } = await supabase.from("funcionarios").select("id, nome, cargo_id, created_at, cargos(nome, cor)").order("nome");
	if (error) throw new Error("Não foi possível carregar os funcionários.");
	return data;
}
async function salvarFuncionario(input, id) {
	const nome = limparNome(input.nome);
	if (!nome) throw new Error("Informe o nome do funcionário.");
	if (!input.cargo_id) throw new Error("Escolha um cargo.");
	if (nomeDuplicado(nome, await listarFuncionarios(), id)) throw new Error(`Já existe um funcionário chamado "${nome}".`);
	const payload = {
		nome,
		cargo_id: input.cargo_id
	};
	const { error } = id ? await supabase.from("funcionarios").update(payload).eq("id", id) : await supabase.from("funcionarios").insert(payload);
	if (error) throw new Error(error.code === "23505" ? `Já existe um funcionário chamado "${nome}".` : "Não foi possível salvar o funcionário.");
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
export { salvarCargo as a, listarFuncionarios as i, excluirFuncionario as n, salvarFuncionario as o, listarCargos as r, textoSobreCor as s, excluirCargo as t };
