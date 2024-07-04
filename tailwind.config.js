/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "heading-xs": "16px",
        "heading-sm": "25px",
        "heading-lg": "40px",
        "label-s": "13px",
        "label-xs": "13px",
        "label-sm": "17px",
        "label-md": "19px",
        "label-lg": "22px",
      },
      colors: {
        primary: "#e6d466",
      },
    },
    screens: {
      xs: "0px",
      ss: "350px",
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1536px",
      xxl: "2000px",
    },
  },
  plugins: [],
};
