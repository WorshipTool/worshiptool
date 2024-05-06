import { Button as Btn, SxProps, Theme } from "@mui/material";
import { CustomLink } from "../Link";
import { CommonLinkProps, CustomLinkProps } from "../Link/CustomLink";
import { RouterProps } from "../../../routes";
import Tooltip from "../CustomTooltip/Tooltip";
import { ComponentProps } from "react";

type ButtonProps<T extends keyof RouterProps> = {
    children?: string;
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "secondary" | "success" | "error" | "inherit";
    size?: "small" | "medium" | "large";
    onClick?: () => void;
    tooltip?: string;
    tooltipPlacement?: ComponentProps<typeof Tooltip>["placement"];
    to?: CommonLinkProps<T>["to"];
    toParams?: CommonLinkProps<T>["params"];
    toState?: CommonLinkProps<T>["state"];
    sx?: SxProps<Theme>;

    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
};

export const Button = <T extends keyof RouterProps>({
    children = "",
    variant = "contained",
    color = "primary",
    size = "medium",
    onClick,

    ...props
}: ButtonProps<T>) => {
    const ButtonComponent = () => (
        <Btn
            variant={variant}
            color={color}
            size={size}
            onClick={onClick}
            startIcon={props.startIcon}
            endIcon={props.endIcon}
            sx={props.sx}>
            {children}
        </Btn>
    );

    const typedParams: CommonLinkProps<T>["params"] =
        props.toParams as CommonLinkProps<T>["params"];
    const typedState: CommonLinkProps<T>["state"] =
        props.toState as CommonLinkProps<T>["state"];

    const LinkComponent = () =>
        props.to ? (
            <CustomLink to={props.to} state={typedState} params={typedParams}>
                <ButtonComponent />
            </CustomLink>
        ) : (
            <ButtonComponent />
        );

    return props.tooltip ? (
        <Tooltip title={props.tooltip} placement={props.tooltipPlacement}>
            <LinkComponent />
        </Tooltip>
    ) : (
        <LinkComponent />
    );
};
