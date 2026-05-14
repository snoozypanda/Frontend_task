/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: "#4F46E5",
        "primary-dark": "#3525CD",
        "on-primary": "#FFFFFF",
        "primary-container": "#4F46E5",
        "on-primary-container": "#DAD7FF",
        "primary-fixed": "#E2DFFF",
        "primary-fixed-dim": "#C3C0FF",
        "inverse-primary": "#C3C0FF",

        // Secondary
        secondary: "#006A61",
        "on-secondary": "#FFFFFF",
        "secondary-container": "#86F2E4",
        "on-secondary-container": "#006F66",
        "secondary-fixed": "#89F5E7",

        // Tertiary
        tertiary: "#7E3000",
        "on-tertiary": "#FFFFFF",
        "tertiary-container": "#A44100",
        "on-tertiary-container": "#FFD2BE",
        "tertiary-fixed": "#FFDBCC",
        "tertiary-fixed-dim": "#FFB695",

        // Error
        error: "#BA1A1A",
        "on-error": "#FFFFFF",
        "error-container": "#FFDAD6",
        "on-error-container": "#93000A",

        // Surface
        surface: "#F9F9FF",
        "surface-dim": "#D3DAEF",
        "surface-bright": "#F9F9FF",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F1F3FF",
        "surface-container": "#E9EDFF",
        "surface-container-high": "#E1E8FD",
        "surface-container-highest": "#DCE2F7",
        "surface-variant": "#DCE2F7",
        "surface-tint": "#4D44E3",
        "on-surface": "#141B2B",
        "on-surface-variant": "#464555",

        // Other
        outline: "#777587",
        "outline-variant": "#C7C4D8",
        "inverse-surface": "#293040",
        "inverse-on-surface": "#EDF0FF",
        background: "#F9F9FF",
        "on-background": "#141B2B",

        // Functional
        "stock-green": "#0D9488",
        "stock-amber": "#D97706",
      },
      fontFamily: {
        "hanken": ["HankenGrotesk"],
        "inter": ["Inter"],
        "mono": ["JetBrainsMono"],
      },
      spacing: {
        "base": 8,
        "container-margin": 20,
        "stack-gap": 12,
        "section-gap": 24,
        "touch-target": 44,
      },
      borderRadius: {
        "sm": 4,
        "DEFAULT": 8,
        "md": 12,
        "lg": 16,
        "xl": 24,
        "full": 9999,
      },
    },
  },
  plugins: [],
};
