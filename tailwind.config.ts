import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        page: "rgb(var(--page) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        timestamp: "rgb(var(--timestamp) / <alpha-value>)",
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        bubble: {
          assistant: "rgb(var(--bubble-assistant) / <alpha-value>)",
          user: "rgb(var(--bubble-user) / <alpha-value>)",
        },
        "chat-border": "rgb(var(--chat-border) / <alpha-value>)",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 6px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "typing-dot": {
          "0%, 80%, 100%": { opacity: "0.2", transform: "translateY(0)" },
          "40%": { opacity: "1", transform: "translateY(-2px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "slide-up-fade": "slide-up-fade 180ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        card: "0 10px 40px -15px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [
    animate,
    typography,
    plugin((helpers) => {
      helpers.addBase({
        ":root": {
          "--page": "247 247 248",
          "--surface": "255 255 255",
          "--background": "255 255 255",
          "--foreground": "26 26 26",
          "--card": "255 255 255",
          "--card-foreground": "26 26 26",
          "--popover": "255 255 255",
          "--popover-foreground": "26 26 26",
          "--primary": "99 102 241",
          "--primary-foreground": "255 255 255",
          "--secondary": "247 247 248",
          "--secondary-foreground": "26 26 26",
          "--muted": "244 244 247",
          "--muted-foreground": "102 102 120",
          "--accent": "99 102 241",
          "--accent-foreground": "255 255 255",
          "--destructive": "239 68 68",
          "--destructive-foreground": "255 255 255",
          "--border": "226 226 226",
          "--input": "226 226 226",
          "--ring": "99 102 241",
          "--timestamp": "120 120 132",
          "--bubble-assistant": "247 247 248",
          "--bubble-user": "229 232 255",
          "--chat-border": "226 226 226",
          "--radius": "1.25rem",
        },
        ":root[data-theme='dark'], .dark": {
          "--page": "14 14 17",
          "--surface": "24 24 28",
          "--background": "24 24 28",
          "--foreground": "237 237 237",
          "--card": "28 28 32",
          "--card-foreground": "237 237 237",
          "--popover": "28 28 32",
          "--popover-foreground": "237 237 237",
          "--primary": "139 92 246",
          "--primary-foreground": "15 15 18",
          "--secondary": "32 32 38",
          "--secondary-foreground": "237 237 237",
          "--muted": "34 34 40",
          "--muted-foreground": "174 174 188",
          "--accent": "139 92 246",
          "--accent-foreground": "237 237 237",
          "--destructive": "239 68 68",
          "--destructive-foreground": "255 255 255",
          "--border": "43 43 43",
          "--input": "43 43 43",
          "--ring": "139 92 246",
          "--timestamp": "154 154 170",
          "--bubble-assistant": "28 28 32",
          "--bubble-user": "45 45 56",
          "--chat-border": "43 43 43",
          "--radius": "1.25rem",
        },
      });
    }),
  ],
};

export default config;
