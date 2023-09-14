import { createTheme } from "@mui/material";
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#b5b5b5',
        }
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});