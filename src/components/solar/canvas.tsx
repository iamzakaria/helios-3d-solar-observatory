import { useEffect, useRef, useState } from "react";

type EngineHandle = {
  dispose: () => void;
};

export function SolarCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let disposed = false;
    let engine: EngineHandle | undefined;

    void import("@/lib/solar/engine")
      .then(({ createHeliosEngine }) => {
        if (disposed) return;
        engine = createHeliosEngine(canvas, host);
        if (disposed) {
          engine.dispose();
          engine = undefined;
        }
      })
      .catch((err: unknown) => {
        if (disposed) return;
        setError(err instanceof Error ? err.message : "Unable to start the observatory.");
      });

    return () => {
      disposed = true;
      engine?.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className="solar-stage">
      <canvas ref={canvasRef} className="solar-canvas" />
      {error ? <p className="solar-error">{error}</p> : null}
    </div>
  );
}
