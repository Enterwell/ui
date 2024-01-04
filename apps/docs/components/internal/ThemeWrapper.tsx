import { useMutationObserver } from "@enterwell/react-hooks";
import { ThemeProvider } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { theme } from "../theme";

export function ThemeWrapper({ children }: PropsWithChildren) {
    const [resolvedTheme, setResolvedTheme] = useState(
        typeof document !== 'undefined' ? (document.querySelector('html')?.style.colorScheme === 'dark' ? 'dark' : 'light') : 'light'
    );

    if (typeof document !== 'undefined') {
        useMutationObserver(
            document.querySelector('html'),
            () => {
                document.querySelector('html')?.style.colorScheme === 'dark' ? setResolvedTheme('dark') : setResolvedTheme('light');
            }, {
            attributes: true,
            subtree: true
        });
    }

    return (
        <ThemeProvider theme={theme(resolvedTheme)}>
            {children}
        </ThemeProvider>
    );
};