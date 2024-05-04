import { TypographyProps, Typography as Typo } from "@mui/material";
import React from "react";

type CustomTypographyProps = {
    children?: string;
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
    strong?: boolean | number;
};

export default function Typography({
    children,
    variant = "normal",
    strong = false
}: CustomTypographyProps) {
    const fontWeight = strong ? (strong === true ? 700 : strong) : undefined;

    const typoVariant = variant === "normal" ? "body1" : variant;

    return (
        <Typo variant={typoVariant} fontWeight={fontWeight}>
            {children}
        </Typo>
    );
}
