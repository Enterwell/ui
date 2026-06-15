'use client';

import { createTheme } from "@mui/material";
import { docsFontFamily } from "../src/fonts";

export const theme = createTheme({
    colorSchemes: {
        dark: true
    },
    typography: {
        fontFamily: docsFontFamily,
    },
});
