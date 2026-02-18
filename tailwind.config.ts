import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.json",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"]
      },
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        card: "var(--card)",
        border: "var(--border)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        pop: "var(--pop)",
        stone: "var(--stone)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)"
      },
      boxShadow: {
        card: "var(--shadow)"
      },
      borderRadius: {
        brand: "var(--radius)"
      }
    }
  },
  plugins: []
};

export default config;
