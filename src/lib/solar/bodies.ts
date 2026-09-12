export type BodyKind = "star" | "terrestrial" | "gas-giant" | "ice-giant" | "moon";

export type BodyFacts = {
  distance: string;
  year: string;
  day: string;
  diameter: string;
  moons: string;
  summary: string;
};

export type BodyDef = {
  id: string;
  name: string;
  kind: BodyKind;
  parentId?: string;
  radius: number;
  orbitRadius: number;
  period: number;
  phase: number;
  inclination: number;
  tilt: number;
  spin: number;
  color: string;
  trailColor: string;
  roughness: number;
  metalness: number;
  clouds?: boolean;
  rings?: { inner: number; outer: number; color: string };
  facts: BodyFacts;
};

export const KIND_LABEL: Record<BodyKind, string> = {
  star: "Star",
  terrestrial: "Terrestrial planet",
  "gas-giant": "Gas giant",
  "ice-giant": "Ice giant",
  moon: "Natural satellite",
};

export const BODIES: BodyDef[] = [
  {
    id: "sun",
    name: "Sun",
    kind: "star",
    radius: 5.4,
    orbitRadius: 0,
    period: 1,
    phase: 0,
    inclination: 0,
    tilt: 0.13,
    spin: 0.07,
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
      summary:
        "A G-type main-sequence star holding the system together. Its light takes eight minutes to reach Earth.",
    },
  },
  {
    id: "mercury",
    name: "Mercury",
    kind: "terrestrial",
    radius: 0.38,
    orbitRadius: 12.2,
    period: 7.4,
    phase: 0.6,
    inclination: 0.09,
    tilt: 0.01,
    spin: 0.14,
    color: "#9a9086",
    trailColor: "#b7aea4",
    roughness: 0.92,
    metalness: 0.08,
    facts: {
      distance: "0.39 AU",
      year: "88 Earth days",
      day: "59 Earth days",
      diameter: "4,879 km",
      moons: "None",
      summary:
        "The smallest planet — a cratered, airless world that races around the Sun in just 88 days.",
    },
  },
  {
    id: "venus",
    name: "Venus",
    kind: "terrestrial",
    radius: 0.72,
    orbitRadius: 16.4,
    period: 13.2,
    phase: 2.1,
    inclination: 0.05,
    tilt: 3.1,
    spin: -0.05,
    color: "#d9c4a0",
    trailColor: "#e2d1b3",
    roughness: 0.55,
    metalness: 0,
    facts: {
      distance: "0.72 AU",
      year: "225 Earth days",
      day: "243 Earth days, retrograde",
      diameter: "12,104 km",
      moons: "None",
      summary:
        "Earth’s veiled twin, wrapped in acid clouds and spinning slowly backwards under a runaway greenhouse.",
    },
  },
  {
    id: "earth",
    name: "Earth",
    kind: "terrestrial",
    radius: 0.78,
    orbitRadius: 21.2,
    period: 22,
    phase: 0.2,
    inclination: 0,
    tilt: 0.41,
    spin: 0.55,
    color: "#6ea0d6",
    trailColor: "#8eb6e0",
    roughness: 0.62,
    metalness: 0,
    clouds: true,
    facts: {
      distance: "1.00 AU",
      year: "365.25 days",
      day: "23 hours 56 minutes",
      diameter: "12,742 km",
      moons: "1",
      summary:
        "The only known harbour of life — oceans, weather, and a single companion tracing a quiet month-long path.",
    },
  },
  {
    id: "moon",
    name: "Moon",
    kind: "moon",
    parentId: "earth",
    radius: 0.22,
    orbitRadius: 1.85,
    period: 4.4,
    phase: 1.2,
    inclination: 0.09,
    tilt: 0.12,
    spin: 0.12,
    color: "#c5c1b8",
    trailColor: "#d8d4cc",
    roughness: 0.95,
    metalness: 0,
    facts: {
      distance: "384,400 km from Earth",
      year: "27.3 Earth days",
      day: "27.3 Earth days (tidally locked)",
      diameter: "3,475 km",
      moons: "—",
      summary:
        "Earth’s companion, locked in a slow face-forward dance. Its pull lifts the oceans twice a day.",
    },
  },
  {
    id: "mars",
    name: "Mars",
    kind: "terrestrial",
    radius: 0.5,
    orbitRadius: 27.2,
    period: 36,
    phase: 4.0,
    inclination: 0.04,
    tilt: 0.44,
    spin: 0.52,
    color: "#c07a55",
    trailColor: "#d39270",
    roughness: 0.88,
    metalness: 0,
    facts: {
      distance: "1.52 AU",
      year: "687 Earth days",
      day: "24 hours 37 minutes",
      diameter: "6,779 km",
      moons: "2",
      summary:
        "A rusted desert of volcanoes and canyons, with polar ice and the tallest mountain in the solar system.",
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kind: "gas-giant",
    radius: 2.35,
    orbitRadius: 40.5,
    period: 92,
    phase: 1.4,
    inclination: 0.025,
    tilt: 0.05,
    spin: 1.05,
    color: "#d0b48a",
    trailColor: "#ddc49a",
    roughness: 0.48,
    metalness: 0,
    facts: {
      distance: "5.20 AU",
      year: "11.9 Earth years",
      day: "9 hours 56 minutes",
      diameter: "139,820 km",
      moons: "95+",
      summary:
        "A failed star of hydrogen and helium. The Great Red Spot has raged longer than written history.",
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    kind: "gas-giant",
    radius: 2.02,
    orbitRadius: 53.4,
    period: 134,
    phase: 5.6,
    inclination: 0.04,
    tilt: 0.47,
    spin: 0.92,
    color: "#e0d0a8",
    trailColor: "#ead9b4",
    roughness: 0.5,
    metalness: 0,
    rings: { inner: 1.35, outer: 2.25, color: "#d9c9a6" },
    facts: {
      distance: "9.58 AU",
      year: "29.4 Earth years",
      day: "10 hours 33 minutes",
      diameter: "116,460 km",
      moons: "146+",
      summary:
        "The jewel of the system — a pale gas giant wearing ice-and-rock rings only tens of metres thick.",
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    kind: "ice-giant",
    radius: 1.16,
    orbitRadius: 65.8,
    period: 196,
    phase: 2.8,
    inclination: 0.02,
    tilt: 1.71,
    spin: 0.62,
    color: "#9fd3d8",
    trailColor: "#b7e0e4",
    roughness: 0.42,
    metalness: 0,
    rings: { inner: 1.28, outer: 1.72, color: "#c5d4d6" },
    facts: {
      distance: "19.2 AU",
      year: "84 Earth years",
      day: "17 hours 14 minutes",
      diameter: "50,724 km",
      moons: "28",
      summary:
        "An ice giant knocked on its side, rolling around the Sun with faint rings and a methane-blue sheen.",
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    kind: "ice-giant",
    radius: 1.12,
    orbitRadius: 77.6,
    period: 248,
    phase: 0.9,
    inclination: 0.03,
    tilt: 0.49,
    spin: 0.7,
    color: "#4d73c9",
    trailColor: "#7b97d8",
    roughness: 0.4,
    metalness: 0,
    facts: {
      distance: "30.1 AU",
      year: "165 Earth years",
      day: "16 hours 6 minutes",
      diameter: "49,244 km",
      moons: "16",
      summary:
        "The outermost planet, a deep cobalt world of supersonic winds — the first found by mathematics.",
    },
  },
];

export const BODIES_BY_ID: Record<string, BodyDef> = Object.fromEntries(
  BODIES.map((body) => [body.id, body]),
);

export const NAV_BODIES = BODIES.filter((body) => body.kind !== "moon");

export const EARTH_PERIOD = BODIES_BY_ID.earth?.period ?? 22;
