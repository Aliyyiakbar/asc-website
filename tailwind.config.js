/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        brand: {
          cyan: "#00D2FF",
          blue: "#2563EB",
          teal: "#00C9A7",
          violet: "#7C3AED",
        },
      },
      animation: {
        blob: "blob 12s infinite",
        "blob-slow": "blob 18s infinite",
        marquee: "marquee 45s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradientX 6s ease infinite",
        shimmer: "shimmer 3s linear infinite",
        "bounce-soft": "bounceSoft 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.15)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
