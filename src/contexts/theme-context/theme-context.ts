const palette = {
    blue: "#4690FF",
    white: "#FFFFFB",
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
    semi_bold: "Inter-SemiBold",
    medium: "Inter-Medium",
    regular: "Inter-Regular",
    light: "Inter-light"
} as const;

const theme = {
    colors: {
        background: palette.white,
        foreground: '#343434',
        primary: palette.blue,
        grey: {
            300: '#D9D9D9',
            500: '#575757',
            700: '#343434'
        }
    },
    font_size: {
        ...font_size
    },
    font_family: {
        ...typefaces
    },
    spacing: {
        s: 8,
        sm: 14,
        m: 16,
        x: 24,
        xl: 32,
        l: 48
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