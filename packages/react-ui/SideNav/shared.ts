import { Theme } from "@mui/material";

export const itemOpacity = 0.7;
export const itemHoverOpacity = 0.9;

export function itemBackgroundImageHighlight(theme: Theme, amount = 0.05) {
    return theme.palette.mode === "dark"
      ? `linear-gradient(180deg, rgba(255,255,255,${amount}) 0%, rgba(255,255,255,${amount}) 100%)`
      : `linear-gradient(180deg, rgba(0,0,0,${amount}) 0%, rgba(0,0,0,${amount}) 100%)`;
  }