/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#120821",
        wine: "#3a1238",
        violet: "#6f3fb5",
        oracle: "#c89b4a",
        pearl: "#f6e9c9"
      },
      boxShadow: {
        glow: "0 0 30px rgba(200,155,74,.35)",
        card: "0 18px 50px rgba(0,0,0,.35)"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"]
      }
    }
  },
  plugins: []
};
