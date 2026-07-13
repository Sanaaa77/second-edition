import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        accent: "var(--accent)",
        muted: "var(--muted)",
        surface: {
          DEFAULT: "var(--surface)",
          glass: "var(--glass-surface)",
        }
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'button': 'var(--radius-button)',
      },
      spacing: {
        'section': 'var(--space-section)',
      },
      animation: {
        'bounce-slow': 'bounce 4s infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-rtl': 'marquee-rtl 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' },
        },
        'marquee-rtl': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
