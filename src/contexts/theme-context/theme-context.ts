const palette = {
    blue: "#4690FF",
    white: "#FFFFFB",
    dark_grey: "#343434"
} as const;

const font_size = {
    extra_large: 48,
    large: 32,
    medium: 24,
    small: 16,
    extra_small: 12
} as const;

const typefaces = {
    bold: "Inter-Bold",
    medium: "Inter-Medium",
    regular: "Inter-Regular",
    light: "Inter-light"
} as const;

const theme = {
    colors: {
        background: palette.white,
        foreground: palette.dark_grey,
        primary: palette.blue
    },
    spacing: {
        s: 8,
        m: 16,
        x: 24,
        xl: 40
    },
    type: {
        l0_header: {
            fontFamily: typefaces.bold,
            fontSize: font_size.extra_large
        },
        l1_header: {
            fontFamily: typefaces.bold,
            fontSize: font_size.large
        },
        l2_header: {
            fontFamily: typefaces.bold,
            fontSize: font_size.medium
        },
        body: {
            fontFamily: typefaces.regular,
            fontSize: font_size.small
        },
    }
} as const;

export { theme }