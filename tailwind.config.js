module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    wdColors: {
      blue: {
        dark: "#181B32",
        default: '#202543',
        light: '#2F3457',
      },
      white: {
        full: "#FFFFFF",
        transparent: "#434343"
      },
      pink: '#FC6280',
      red:'#AA2f2f',
      orange: '#df933e'
    },
    colors: ({ theme }) => ({
      direct: { ...theme("wdColors") }, //If you want to directly refer to some color, instead of refering to them by purpose
      wdBg: theme("wdColors.blue.dark"),
      wdText: theme("wdColors.white.full"),
      wdBar: theme("wdColors.blue.light"),
      wdPrimary: theme("wdColors.blue.light"),
      wdSecondary: theme("wdColors.blue.default"),
      wdTertiary: theme("wdColors.white.transparent"),
      wdSpecial: theme("wdColors.pink"),
      wdBehind: theme("wdColors.red"),
      wdAhead: theme("wdColors.orange"),
    }),
    screens: {
      "tablet": "768px",
      "laptop": "1076px",
      "laptopL": "1200px",
    },
    fontFamily: {
      global: "Montserrat, sans-serif",
      numbers: 'Helvetica Neue, sans-serif'
    },
    extend: {
      width: {
        "5.5": "1.375rem" //22px 
      },
      height: {
        "5.5": "1.375rem" //22px 
      },
      fontSize: {
        smMinus: ["0.825rem", "1.25rem"]
      }
    },
  },
  plugins: [],
}
