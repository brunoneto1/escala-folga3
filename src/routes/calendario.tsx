import { createFileRoute } from "@tanstack/react-router";
import { CalendarioPagina } from "@/components/calendario/CalendarioPagina";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Gestor de Escala" },
      { name: "description", content: "Monte a escala de folgas da equipe no calendário do mês." },
      { property: "og:title", content: "Gestor de Escala" },
      {
        property: "og:description",
        content: "Monte a escala de folgas da equipe no calendário do mês.",
      },
    ],
  }),
  component: () => <CalendarioPagina />,
});
