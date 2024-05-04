import { Button as Btn } from "@mui/material";

type ButtonProps = {
    children?: string;
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "secondary" | "success" | "error" | "inherit";
    size?: "small" | "medium" | "large";
    onClick?: () => void;
};

export const Button = ({
    children = "",
    variant = "contained",
    color = "primary",
    size = "medium",
    onClick
}: ButtonProps) => {
    return (
        <Btn variant={variant} color={color} size={size} onClick={onClick}>
            {children}
        </Btn>
    );
};
