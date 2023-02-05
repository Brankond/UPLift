// external dependencies
import {extendTheme} from "native-base";

const theme = extendTheme({
    colors: {
        "primary": {
            "50": "#cfe2ff",
            "100": "#adceff",
            "200": "#8bb9ff",
            "300": "#69a5ff",
            "400": "#4690ff",
            "500": "#3986fa",
            "600": "#2b7bf4",
            "700": "#1e71ec",
            "800": "#1968dd",
            "900": "#1d60c6"
        }
    },
    letterSpacings: {
        "xs": "-0.05em",
        "sm": "-0.025em",
        "md": 0,
        "lg": "0.025em",
        "xl": "0.05em",
        "2xl": "0.1em",
    },
    lineHeights: {
        "2xs": "1em",
        "xs": "1.125em",
        "sm": "1.25em",
        "md": "1.375em",
        "lg": "1.5em",
        "xl": "1.75em",
        "2xl": "2em",
        "3xl": "2.5em",
        "4xl": "3em",
        "5xl": "4em",
    },
    fontWeights: {
        hairline: "100",
        thin: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
    },
    fonts: {
        main: "Inter"
    },
    fontSizes: {
        "2xs": 10,
        "xs": 12,
        "sm": 14,
        "md": 16,
        "lg": 18,
        "xl": 20,
        "2xl": 24,
        "3xl": 30,
        "3.5xl": 32,
        "4xl": 36,
        "5xl": 48,
        "6xl": 60,
        "7xl": 72,
        "8xl": 96,
        "9xl": 128,
    },
})

export {theme}