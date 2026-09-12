import { createFileRoute } from "@tanstack/react-router";
import { Hud } from "@/components/solar/hud";
import { SolarCanvas } from "@/components/solar/canvas";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="solar-app">
      <h1 className="sr-only">Helios — solar observatory</h1>
      <SolarCanvas />
      <Hud />
    </main>
  );
}
