import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/funcionarios" }); },
  head: () => ({ meta: [
    { title: "Escala de Folgas" },
    { name: "description", content: "Gestão de cargos, funcionários e folgas." },
    { property: "og:title", content: "Escala de Folgas" },
    { property: "og:description", content: "Gestão de cargos, funcionários e folgas." },
  ] }),
});
