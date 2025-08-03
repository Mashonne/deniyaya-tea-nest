import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deniyaya Tea Factory Brand Colors
        tea: {
          50: "#f0f9f4",
          100: "#dcf2e3",
          200: "#bce5cc",
          300: "#8dd3a8",
          400: "#5bb87e",
          500: "#3a9d5f", // Primary tea green
          600: "#2d7d4a", // Dark tea green
          700: "#25633c",
          800: "#1f4f31",
          900: "#1a4129",
          950: "#0d2315",
        },
        // Ceylon Amber/Gold colors
        ceylon: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308", // Primary ceylon gold
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
        },
        // Sri Lanka inspired colors
        srilanka: {
          blue: "#1e40af", // Ocean blue
          red: "#dc2626", // Flag red
          orange: "#ea580c", // Sunset orange
          brown: "#92400e", // Earth brown
        },
        // Neutral tea-inspired grays
        leaf: {
          50: "#f8faf8",
          100: "#f1f5f1",
          200: "#e2e8e2",
          300: "#cbd5cb",
          400: "#9caa9c",
          500: "#6b7a6b",
          600: "#556155",
          700: "#434d43",
          800: "#374037",
          900: "#2f352f",
          950: "#1a1e1a",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
        tea: ["Crimson Text", "serif"], // Elegant tea typography
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        tea: "0 4px 6px -1px rgba(58, 157, 95, 0.1), 0 2px 4px -1px rgba(58, 157, 95, 0.06)",
        "tea-lg":
          "0 10px 15px -3px rgba(58, 157, 95, 0.1), 0 4px 6px -2px rgba(58, 157, 95, 0.05)",
        ceylon:
          "0 4px 6px -1px rgba(234, 179, 8, 0.1), 0 2px 4px -1px rgba(234, 179, 8, 0.06)",
        leaf: "0 4px 6px -1px rgba(107, 122, 107, 0.1), 0 2px 4px -1px rgba(107, 122, 107, 0.06)",
      },
      backgroundImage: {
        "tea-gradient": "linear-gradient(135deg, #f0f9f4 0%, #fefce8 100%)",
        "ceylon-gradient": "linear-gradient(135deg, #eab308 0%, #facc15 100%)",
        "srilanka-gradient":
          "linear-gradient(135deg, #1e40af 0%, #dc2626 100%)",
        "leaf-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dcf2e3' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        "tea-float": "tea-float 3s ease-in-out infinite",
        "leaf-fall": "leaf-fall 4s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        "tea-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "leaf-fall": {
          "0%": { transform: "translateY(-100vh) rotate(0deg)" },
          "100%": { transform: "translateY(100vh) rotate(360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      // Custom utilities for tea-specific components
      utilities: {
        ".tea-card": {
          "@apply bg-white rounded-xl shadow-tea hover:shadow-tea-lg transition-all duration-300":
            {},
        },
        ".tea-button": {
          "@apply bg-tea-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-tea-700 transition-colors duration-200":
            {},
        },
        ".tea-button-outline": {
          "@apply border-2 border-tea-600 text-tea-600 px-6 py-3 rounded-lg font-semibold hover:bg-tea-600 hover:text-white transition-all duration-200":
            {},
        },
        ".ceylon-button": {
          "@apply bg-ceylon-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-ceylon-600 transition-colors duration-200":
            {},
        },
      },
    },
  },
  plugins: [
    // Custom plugin for tea-themed components
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        ".tea-card": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.xl"),
          boxShadow: theme("boxShadow.tea"),
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: theme("boxShadow.tea-lg"),
            transform: "translateY(-2px)",
          },
        },
        ".tea-button": {
          backgroundColor: theme("colors.tea.600"),
          color: theme("colors.white"),
          padding: `${theme("spacing.3")} ${theme("spacing.6")}`,
          borderRadius: theme("borderRadius.lg"),
          fontWeight: theme("fontWeight.semibold"),
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: theme("colors.tea.700"),
          },
        },
        ".tea-button-outline": {
          border: `2px solid ${theme("colors.tea.600")}`,
          color: theme("colors.tea.600"),
          padding: `${theme("spacing.3")} ${theme("spacing.6")}`,
          borderRadius: theme("borderRadius.lg"),
          fontWeight: theme("fontWeight.semibold"),
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: theme("colors.tea.600"),
            color: theme("colors.white"),
          },
        },
        ".ceylon-button": {
          backgroundColor: theme("colors.ceylon.500"),
          color: theme("colors.white"),
          padding: `${theme("spacing.3")} ${theme("spacing.6")}`,
          borderRadius: theme("borderRadius.lg"),
          fontWeight: theme("fontWeight.semibold"),
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: theme("colors.ceylon.600"),
          },
        },
        ".tea-gradient-bg": {
          background: "linear-gradient(135deg, #f0f9f4 0%, #fefce8 100%)",
        },
        ".ceylon-gradient-bg": {
          background: "linear-gradient(135deg, #eab308 0%, #facc15 100%)",
        },
        ".srilanka-gradient-bg": {
          background: "linear-gradient(135deg, #1e40af 0%, #dc2626 100%)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
