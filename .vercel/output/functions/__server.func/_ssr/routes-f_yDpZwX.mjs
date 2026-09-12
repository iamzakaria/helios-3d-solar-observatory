import { i as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Play, i as Spline, n as Telescope, o as Pause, r as Tag, s as CircleDashed } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-f_yDpZwX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var KIND_LABEL = {
	star: "Star",
	terrestrial: "Terrestrial planet",
	"gas-giant": "Gas giant",
	"ice-giant": "Ice giant",
	moon: "Natural satellite"
};
var BODIES = [
	{
		id: "sun",
		name: "Sun",
		kind: "star",
		radius: 5.4,
		orbitRadius: 0,
		period: 1,
		phase: 0,
		inclination: 0,
		tilt: .13,
		spin: .07,
		color: "#ffd27a",
		trailColor: "#ffd27a",
		roughness: 1,
		metalness: 0,
		facts: {
			distance: "Center",
			year: "—",
			day: "25.4 Earth days",
			diameter: "1,392,700 km",
			moons: "8 planets",
			summary: "A G-type main-sequence star holding the system together. Its light takes eight minutes to reach Earth."
		}
	},
	{
		id: "mercury",
		name: "Mercury",
		kind: "terrestrial",
		radius: .38,
		orbitRadius: 12.2,
		period: 7.4,
		phase: .6,
		inclination: .09,
		tilt: .01,
		spin: .14,
		color: "#9a9086",
		trailColor: "#b7aea4",
		roughness: .92,
		metalness: .08,
		facts: {
			distance: "0.39 AU",
			year: "88 Earth days",
			day: "59 Earth days",
			diameter: "4,879 km",
			moons: "None",
			summary: "The smallest planet — a cratered, airless world that races around the Sun in just 88 days."
		}
	},
	{
		id: "venus",
		name: "Venus",
		kind: "terrestrial",
		radius: .72,
		orbitRadius: 16.4,
		period: 13.2,
		phase: 2.1,
		inclination: .05,
		tilt: 3.1,
		spin: -.05,
		color: "#d9c4a0",
		trailColor: "#e2d1b3",
		roughness: .55,
		metalness: 0,
		facts: {
			distance: "0.72 AU",
			year: "225 Earth days",
			day: "243 Earth days, retrograde",
			diameter: "12,104 km",
			moons: "None",
			summary: "Earth’s veiled twin, wrapped in acid clouds and spinning slowly backwards under a runaway greenhouse."
		}
	},
	{
		id: "earth",
		name: "Earth",
		kind: "terrestrial",
		radius: .78,
		orbitRadius: 21.2,
		period: 22,
		phase: .2,
		inclination: 0,
		tilt: .41,
		spin: .55,
		color: "#6ea0d6",
		trailColor: "#8eb6e0",
		roughness: .62,
		metalness: 0,
		clouds: true,
		facts: {
			distance: "1.00 AU",
			year: "365.25 days",
			day: "23 hours 56 minutes",
			diameter: "12,742 km",
			moons: "1",
			summary: "The only known harbour of life — oceans, weather, and a single companion tracing a quiet month-long path."
		}
	},
	{
		id: "moon",
		name: "Moon",
		kind: "moon",
		parentId: "earth",
		radius: .22,
		orbitRadius: 1.85,
		period: 4.4,
		phase: 1.2,
		inclination: .09,
		tilt: .12,
		spin: .12,
		color: "#c5c1b8",
		trailColor: "#d8d4cc",
		roughness: .95,
		metalness: 0,
		facts: {
			distance: "384,400 km from Earth",
			year: "27.3 Earth days",
			day: "27.3 Earth days (tidally locked)",
			diameter: "3,475 km",
			moons: "—",
			summary: "Earth’s companion, locked in a slow face-forward dance. Its pull lifts the oceans twice a day."
		}
	},
	{
		id: "mars",
		name: "Mars",
		kind: "terrestrial",
		radius: .5,
		orbitRadius: 27.2,
		period: 36,
		phase: 4,
		inclination: .04,
		tilt: .44,
		spin: .52,
		color: "#c07a55",
		trailColor: "#d39270",
		roughness: .88,
		metalness: 0,
		facts: {
			distance: "1.52 AU",
			year: "687 Earth days",
			day: "24 hours 37 minutes",
			diameter: "6,779 km",
			moons: "2",
			summary: "A rusted desert of volcanoes and canyons, with polar ice and the tallest mountain in the solar system."
		}
	},
	{
		id: "jupiter",
		name: "Jupiter",
		kind: "gas-giant",
		radius: 2.35,
		orbitRadius: 40.5,
		period: 92,
		phase: 1.4,
		inclination: .025,
		tilt: .05,
		spin: 1.05,
		color: "#d0b48a",
		trailColor: "#ddc49a",
		roughness: .48,
		metalness: 0,
		facts: {
			distance: "5.20 AU",
			year: "11.9 Earth years",
			day: "9 hours 56 minutes",
			diameter: "139,820 km",
			moons: "95+",
			summary: "A failed star of hydrogen and helium. The Great Red Spot has raged longer than written history."
		}
	},
	{
		id: "saturn",
		name: "Saturn",
		kind: "gas-giant",
		radius: 2.02,
		orbitRadius: 53.4,
		period: 134,
		phase: 5.6,
		inclination: .04,
		tilt: .47,
		spin: .92,
		color: "#e0d0a8",
		trailColor: "#ead9b4",
		roughness: .5,
		metalness: 0,
		rings: {
			inner: 1.35,
			outer: 2.25,
			color: "#d9c9a6"
		},
		facts: {
			distance: "9.58 AU",
			year: "29.4 Earth years",
			day: "10 hours 33 minutes",
			diameter: "116,460 km",
			moons: "146+",
			summary: "The jewel of the system — a pale gas giant wearing ice-and-rock rings only tens of metres thick."
		}
	},
	{
		id: "uranus",
		name: "Uranus",
		kind: "ice-giant",
		radius: 1.16,
		orbitRadius: 65.8,
		period: 196,
		phase: 2.8,
		inclination: .02,
		tilt: 1.71,
		spin: .62,
		color: "#9fd3d8",
		trailColor: "#b7e0e4",
		roughness: .42,
		metalness: 0,
		rings: {
			inner: 1.28,
			outer: 1.72,
			color: "#c5d4d6"
		},
		facts: {
			distance: "19.2 AU",
			year: "84 Earth years",
			day: "17 hours 14 minutes",
			diameter: "50,724 km",
			moons: "28",
			summary: "An ice giant knocked on its side, rolling around the Sun with faint rings and a methane-blue sheen."
		}
	},
	{
		id: "neptune",
		name: "Neptune",
		kind: "ice-giant",
		radius: 1.12,
		orbitRadius: 77.6,
		period: 248,
		phase: .9,
		inclination: .03,
		tilt: .49,
		spin: .7,
		color: "#4d73c9",
		trailColor: "#7b97d8",
		roughness: .4,
		metalness: 0,
		facts: {
			distance: "30.1 AU",
			year: "165 Earth years",
			day: "16 hours 6 minutes",
			diameter: "49,244 km",
			moons: "16",
			summary: "The outermost planet, a deep cobalt world of supersonic winds — the first found by mathematics."
		}
	}
];
var BODIES_BY_ID = Object.fromEntries(BODIES.map((body) => [body.id, body]));
var NAV_BODIES = BODIES.filter((body) => body.kind !== "moon");
var EARTH_PERIOD = BODIES_BY_ID.earth?.period ?? 22;
var useSolar = create((set) => ({
	paused: false,
	speed: 1,
	selectedId: "earth",
	focusedId: null,
	showLabels: true,
	showOrbits: true,
	showTrails: true,
	elapsed: 0,
	togglePause: () => set((s) => ({ paused: !s.paused })),
	setPaused: (paused) => set({ paused }),
	setSpeed: (speed) => set({ speed }),
	select: (id) => set({ selectedId: id }),
	focus: (id) => set(id ? {
		focusedId: id,
		selectedId: id
	} : { focusedId: null }),
	resetView: () => set({ focusedId: null }),
	setShowLabels: (showLabels) => set({ showLabels }),
	setShowOrbits: (showOrbits) => set({ showOrbits }),
	setShowTrails: (showTrails) => set({ showTrails }),
	setElapsed: (elapsed) => set({ elapsed })
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatSpeed(speed) {
	return `${Math.round(speed * 100) / 100}×`;
}
function Hud() {
	const paused = useSolar((s) => s.paused);
	const speed = useSolar((s) => s.speed);
	const selectedId = useSolar((s) => s.selectedId);
	const focusedId = useSolar((s) => s.focusedId);
	const showLabels = useSolar((s) => s.showLabels);
	const showOrbits = useSolar((s) => s.showOrbits);
	const showTrails = useSolar((s) => s.showTrails);
	const years = useSolar((s) => s.elapsed) / EARTH_PERIOD;
	const selected = selectedId ? BODIES_BY_ID[selectedId] : void 0;
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) useSolar.getState().setPaused(true);
	}, []);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			const target = event.target;
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
				state.setSpeed(Math.min(16, Math.round((state.speed + .25) * 100) / 100));
				return;
			}
			if (event.key === "-" || event.key === "_") {
				state.setSpeed(Math.max(.25, Math.round((state.speed - .25) * 100) / 100));
				return;
			}
			if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
				const next = NAV_BODIES[(NAV_BODIES.findIndex((body) => body.id === (state.selectedId ?? "earth")) + (event.key === "ArrowRight" ? 1 : -1) + NAV_BODIES.length) % NAV_BODIES.length];
				if (next) state.focus(next.id);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-root",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "hud-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hud-mark",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Telescope, { strokeWidth: 1.5 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "hud-title",
					children: "Helios"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hud-kicker",
					children: "Solar observatory"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-tools",
				role: "toolbar",
				"aria-label": "Simulation controls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconToggle, {
						pressed: showLabels,
						onClick: () => useSolar.getState().setShowLabels(!showLabels),
						label: "Labels",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { strokeWidth: 1.6 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconToggle, {
						pressed: showOrbits,
						onClick: () => useSolar.getState().setShowOrbits(!showOrbits),
						label: "Orbits",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDashed, { strokeWidth: 1.6 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconToggle, {
						pressed: showTrails,
						onClick: () => useSolar.getState().setShowTrails(!showTrails),
						label: "Trails",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spline, { strokeWidth: 1.6 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "hud-icon-btn",
						onClick: () => useSolar.getState().togglePause(),
						"aria-label": paused ? "Resume simulation" : "Pause simulation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hud-icon-swap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("hud-icon-face", paused ? "is-on" : "is-off"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { strokeWidth: 1.6 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("hud-icon-face", paused ? "is-off" : "is-on"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { strokeWidth: 1.6 })
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "hud-nav",
				"aria-label": "Worlds",
				children: NAV_BODIES.map((body) => {
					const active = selectedId === body.id;
					const tracking = focusedId === body.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cn("hud-nav-item", active && "is-active"),
						onClick: () => useSolar.getState().focus(body.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hud-swatch",
								style: { background: body.color }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: body.name }),
							tracking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hud-tracking",
								children: "Tracking"
							}) : null
						]
					}, body.id);
				})
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hud-info",
				"aria-live": "polite",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-info-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hud-info-kind",
							children: KIND_LABEL[selected.kind]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "hud-info-name",
							children: selected.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hud-info-summary",
							children: selected.facts.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "hud-facts",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Distance",
									value: selected.facts.distance
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Year",
									value: selected.facts.year
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Day",
									value: selected.facts.day
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Diameter",
									value: selected.facts.diameter
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Moons",
									value: selected.facts.moons
								})
							]
						})
					]
				}, selected.id)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "hud-bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "hud-speed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hud-speed-label",
								children: "Speed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: .25,
								max: 16,
								step: .25,
								value: speed,
								"aria-valuetext": formatSpeed(speed),
								onChange: (event) => useSolar.getState().setSpeed(Number(event.target.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hud-speed-value tabular-nums",
								children: formatSpeed(speed)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hud-year tabular-nums",
						children: [
							"Year ",
							years.toFixed(2),
							paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hud-paused",
								children: "Paused"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hud-bar-actions",
						children: focusedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-text-btn",
							onClick: () => useSolar.getState().resetView(),
							children: "System view"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hud-hint",
							children: "Click a world to focus"
						})
					})
				]
			})
		]
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-fact",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value })]
	});
}
function IconToggle({ pressed, onClick, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("hud-icon-btn", pressed && "is-pressed"),
		"aria-pressed": pressed,
		"aria-label": label,
		onClick,
		children
	});
}
function SolarCanvas() {
	const hostRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const host = hostRef.current;
		const canvas = canvasRef.current;
		if (!host || !canvas) return;
		let disposed = false;
		let engine;
		import("./engine-TgUoIzhy.mjs").then(({ createHeliosEngine }) => {
			if (disposed) return;
			engine = createHeliosEngine(canvas, host);
			if (disposed) {
				engine.dispose();
				engine = void 0;
			}
		}).catch((err) => {
			if (disposed) return;
			setError(err instanceof Error ? err.message : "Unable to start the observatory.");
		});
		return () => {
			disposed = true;
			engine?.dispose();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: hostRef,
		className: "solar-stage",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "solar-canvas"
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "solar-error",
			children: error
		}) : null]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "solar-app",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: "Helios — solar observatory"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolarCanvas, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {})
		]
	});
}
//#endregion
export { useSolar as n, BODIES as r, routes_exports as t };
