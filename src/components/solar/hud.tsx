import { useEffect, type ReactNode } from "react";
import {
  CircleDashed,
  Pause,
  Play,
  Spline,
  Tag,
  Telescope,
} from "lucide-react";
import { BODIES_BY_ID, EARTH_PERIOD, KIND_LABEL, NAV_BODIES } from "@/lib/solar/bodies";
import { useSolar } from "@/lib/solar/store";
import { cn } from "@/lib/utils";

function formatSpeed(speed: number) {
  const rounded = Math.round(speed * 100) / 100;
  return `${rounded}×`;
}

export function Hud() {
  const paused = useSolar((s) => s.paused);
  const speed = useSolar((s) => s.speed);
  const selectedId = useSolar((s) => s.selectedId);
  const focusedId = useSolar((s) => s.focusedId);
  const showLabels = useSolar((s) => s.showLabels);
  const showOrbits = useSolar((s) => s.showOrbits);
  const showTrails = useSolar((s) => s.showTrails);
  const elapsed = useSolar((s) => s.elapsed);
  const years = elapsed / EARTH_PERIOD;
  const selected = selectedId ? BODIES_BY_ID[selectedId] : undefined;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) useSolar.getState().setPaused(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const state = useSolar.getState();
      if (event.code === "Space") {
        event.preventDefault();
        state.togglePause();
        return;
      }
      if (event.code === "Escape") {
        state.resetView();
        return;
      }
      if (event.key === "=" || event.key === "+") {
        state.setSpeed(Math.min(16, Math.round((state.speed + 0.25) * 100) / 100));
        return;
      }
      if (event.key === "-" || event.key === "_") {
        state.setSpeed(Math.max(0.25, Math.round((state.speed - 0.25) * 100) / 100));
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const index = NAV_BODIES.findIndex((body) => body.id === (state.selectedId ?? "earth"));
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = NAV_BODIES[(index + delta + NAV_BODIES.length) % NAV_BODIES.length];
        if (next) state.focus(next.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="hud-root">
      <header className="hud-brand">
        <span className="hud-mark" aria-hidden="true">
          <Telescope strokeWidth={1.5} />
        </span>
        <div>
          <h1 className="hud-title">Helios</h1>
          <p className="hud-kicker">Solar observatory</p>
          <p className="hud-credit">Made by Zakaria Shagor with help of Grok AI</p>
        </div>
      </header>

      <div className="hud-tools" role="toolbar" aria-label="Simulation controls">
        <IconToggle
          pressed={showLabels}
          onClick={() => useSolar.getState().setShowLabels(!showLabels)}
          label="Labels"
        >
          <Tag strokeWidth={1.6} />
        </IconToggle>
        <IconToggle
          pressed={showOrbits}
          onClick={() => useSolar.getState().setShowOrbits(!showOrbits)}
          label="Orbits"
        >
          <CircleDashed strokeWidth={1.6} />
        </IconToggle>
        <IconToggle
          pressed={showTrails}
          onClick={() => useSolar.getState().setShowTrails(!showTrails)}
          label="Trails"
        >
          <Spline strokeWidth={1.6} />
        </IconToggle>
        <button
          type="button"
          className="hud-icon-btn"
          onClick={() => useSolar.getState().togglePause()}
          aria-label={paused ? "Resume simulation" : "Pause simulation"}
        >
          <span className="hud-icon-swap">
            <span className={cn("hud-icon-face", paused ? "is-on" : "is-off")}>
              <Play strokeWidth={1.6} />
            </span>
            <span className={cn("hud-icon-face", paused ? "is-off" : "is-on")}>
              <Pause strokeWidth={1.6} />
            </span>
          </span>
        </button>
      </div>

      <nav className="hud-nav" aria-label="Worlds">
        {NAV_BODIES.map((body) => {
          const active = selectedId === body.id;
          const tracking = focusedId === body.id;
          return (
            <button
              key={body.id}
              type="button"
              className={cn("hud-nav-item", active && "is-active")}
              onClick={() => useSolar.getState().focus(body.id)}
            >
              <span className="hud-swatch" style={{ background: body.color }} />
              <span>{body.name}</span>
              {tracking ? <span className="hud-tracking">Tracking</span> : null}
            </button>
          );
        })}
      </nav>

      {selected ? (
        <aside className="hud-info" aria-live="polite">
          <div key={selected.id} className="hud-info-inner">
            <p className="hud-info-kind">{KIND_LABEL[selected.kind]}</p>
            <h2 className="hud-info-name">{selected.name}</h2>
            <p className="hud-info-summary">{selected.facts.summary}</p>
            <dl className="hud-facts">
              <Fact label="Distance" value={selected.facts.distance} />
              <Fact label="Year" value={selected.facts.year} />
              <Fact label="Day" value={selected.facts.day} />
              <Fact label="Diameter" value={selected.facts.diameter} />
              <Fact label="Moons" value={selected.facts.moons} />
            </dl>
          </div>
        </aside>
      ) : null}

      <footer className="hud-bar">
        <label className="hud-speed">
          <span className="hud-speed-label">Speed</span>
          <input
            type="range"
            min={0.25}
            max={16}
            step={0.25}
            value={speed}
            aria-valuetext={formatSpeed(speed)}
            onChange={(event) => useSolar.getState().setSpeed(Number(event.target.value))}
          />
          <span className="hud-speed-value tabular-nums">{formatSpeed(speed)}</span>
        </label>
        <p className="hud-year tabular-nums">
          Year {years.toFixed(2)}
          {paused ? <span className="hud-paused">Paused</span> : null}
        </p>
        <div className="hud-bar-actions">
          {focusedId ? (
            <button type="button" className="hud-text-btn" onClick={() => useSolar.getState().resetView()}>
              System view
            </button>
          ) : (
            <p className="hud-hint">Click a world to focus</p>
          )}
        </div>
      </footer>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function IconToggle({
  pressed,
  onClick,
  label,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn("hud-icon-btn", pressed && "is-pressed")}
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
