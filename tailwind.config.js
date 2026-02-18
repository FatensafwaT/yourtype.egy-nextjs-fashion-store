/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-fashion": "url('/images/hero.jpg')",
      },
      colors: {
        brand: {
          100: "#d8cbc4",
          200: "#bca89f",
          300: "#a08679",
          400: "#8b6c5c",
          500: "#765341",
          600: "#6a4a3a",
          700: "#5b3e31",
          800: "#4c3228",
          900: "#3d251e",
        },
        qahwa: {
          fateera: "#d8cbc4",
          khafeefa: "#bca89f",
          mutawassita: "#a08679",
          qawia: "#8b6c5c",
          asel: "#765341",
          bunna: "#6a4a3a",
          shokola: "#5b3e31",
          tamr: "#4c3228",
          "qahwa-arabiya": "#3d251e",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
