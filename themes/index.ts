export interface SpotlightTheme {
  name: string;
  variables: {
    background: string;
    foreground: string;
    muted: string;
    "muted-foreground": string;
    popover: string;
    border: string;
    accent: string;
    "accent-foreground": string;
    ring: string;
    primary: string;
  };
}

export const themes: Record<string, SpotlightTheme> = {
  light: {
    name: "Light",
    variables: {
      background: "#ffffff",
      foreground: "#020817",
      muted: "#f1f5f9",
      "muted-foreground": "#64748b",
      popover: "#ffffff",
      border: "#e2e8f0",
      accent: "#f1f5f9",
      "accent-foreground": "#0f172a",
      ring: "#94a3b8",
      primary: "#0f172a",
    },
  },
  dark: {
    name: "Dark",
    variables: {
      background: "#020817",
      foreground: "#f8fafc",
      muted: "#1e293b",
      "muted-foreground": "#94a3b8",
      popover: "#020817",
      border: "#1e293b",
      accent: "#1e293b",
      "accent-foreground": "#f8fafc",
      ring: "#1e293b",
      primary: "#f8fafc",
    },
  },
  ocean: {
    name: "Ocean",
    variables: {
      background: "#0f172a",
      foreground: "#f8fafc",
      muted: "#1e293b",
      "muted-foreground": "#94a3b8",
      popover: "#0f172a",
      border: "#1e293b",
      accent: "#1e293b",
      "accent-foreground": "#38bdf8",
      ring: "#0ea5e9",
      primary: "#0ea5e9",
    },
  },
  forest: {
    name: "Forest",
    variables: {
      background: "#052e16",
      foreground: "#f0fdf4",
      muted: "#14532d",
      "muted-foreground": "#86efac",
      popover: "#052e16",
      border: "#14532d",
      accent: "#14532d",
      "accent-foreground": "#4ade80",
      ring: "#22c55e",
      primary: "#22c55e",
    },
  },
  sunset: {
    name: "Sunset",
    variables: {
      background: "#431407",
      foreground: "#fff7ed",
      muted: "#7c2d12",
      "muted-foreground": "#fdba74",
      popover: "#431407",
      border: "#7c2d12",
      accent: "#7c2d12",
      "accent-foreground": "#fb923c",
      ring: "#f97316",
      primary: "#f97316",
    },
  },
  midnight: {
    name: "Midnight",
    variables: {
      background: "#000000",
      foreground: "#ffffff",
      muted: "#171717",
      "muted-foreground": "#a3a3a3",
      popover: "#000000",
      border: "#333333",
      accent: "#262626",
      "accent-foreground": "#ffffff",
      ring: "#ffffff",
      primary: "#ffffff",
    },
  },
  rose: {
    name: "Rose",
    variables: {
      background: "#fff1f2",
      foreground: "#881337",
      muted: "#ffe4e6",
      "muted-foreground": "#fb7185",
      popover: "#fff1f2",
      border: "#fecdd3",
      accent: "#ffe4e6",
      "accent-foreground": "#e11d48",
      ring: "#f43f5e",
      primary: "#be123c",
    },
  },
  amber: {
    name: "Amber",
    variables: {
      background: "#fffbeb",
      foreground: "#78350f",
      muted: "#fef3c7",
      "muted-foreground": "#d97706",
      popover: "#fffbeb",
      border: "#fde68a",
      accent: "#fef3c7",
      "accent-foreground": "#b45309",
      ring: "#f59e0b",
      primary: "#b45309",
    },
  },
  slate: {
    name: "Slate",
    variables: {
      background: "#f8fafc",
      foreground: "#0f172a",
      muted: "#e2e8f0",
      "muted-foreground": "#64748b",
      popover: "#f8fafc",
      border: "#cbd5e1",
      accent: "#e2e8f0",
      "accent-foreground": "#0f172a",
      ring: "#94a3b8",
      primary: "#475569",
    },
  },
  violet: {
    name: "Violet",
    variables: {
      background: "#2e1065",
      foreground: "#faf5ff",
      muted: "#4c1d95",
      "muted-foreground": "#a78bfa",
      popover: "#2e1065",
      border: "#5b21b6",
      accent: "#5b21b6",
      "accent-foreground": "#c084fc",
      ring: "#8b5cf6",
      primary: "#8b5cf6",
    },
  },
};
