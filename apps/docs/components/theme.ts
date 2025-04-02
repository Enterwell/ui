'use client';

import { createTheme } from "@mui/material";
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const theme = createTheme({
    colorSchemes: {
        dark: true
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});