import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futura: ['"Futura"', '"Century Gothic"', '"Apple Gothic"', 'sans-serif'],
      },
      colors: {
        cosmic: {
          bg: "#0a0a1a",
          card: "rgba(255,255,255,0.08)",
          purple: "#8b5cf6",
          pink: "#ec4899",
          success: "#22c55e",
          error: "#ef4444",
          warn: "#f59e0b",
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(5px) rotate(-1deg)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(139,92,246,0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(139,92,246,0.6)" },
        },
      },
    },
  },
  plugins: [
    function({ addVariant }: { addVariant: (name: string, rule: string) => void }) {
      addVariant('landscape', '@media (orientation: landscape)');
    },
  ],
};

export default config;
