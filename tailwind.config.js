/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./Spotlight.tsx",
    "./adapters/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--spotlight-background)",
        foreground: "var(--spotlight-foreground)",
        muted: "var(--spotlight-muted)",
        "muted-foreground": "var(--spotlight-muted-foreground)",
        popover: "var(--spotlight-popover)",
        "popover-foreground": "var(--spotlight-foreground)",
        card: "var(--spotlight-popover)",
        "card-foreground": "var(--spotlight-foreground)",
        border: "var(--spotlight-border)",
        input: "var(--spotlight-border)",
        primary: "var(--spotlight-primary)",
        "primary-foreground": "var(--spotlight-background)",
        secondary: "var(--spotlight-muted)",
        "secondary-foreground": "var(--spotlight-foreground)",
        accent: "var(--spotlight-accent)",
        "accent-foreground": "var(--spotlight-accent-foreground)",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        ring: "var(--spotlight-ring)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
