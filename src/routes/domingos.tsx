import { createFileRoute } from "@tanstack/react-router";
import { CalendarioPagina } from "@/components/calendario/CalendarioPagina";

export const Route = createFileRoute("/domingos")({
  head: () => ({
    meta: [
      { title: "Domingos — Escala de Folgas" },
      { name: "description", content: "Visualize a escala de folgas aos domingos." },
    ],
  }),
  component: () => <CalendarioPagina modo="domingos" />,
});
