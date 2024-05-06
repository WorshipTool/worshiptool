import { SxProps } from "@mui/material";
import { CustomLink } from "../Link";
import { CommonLinkProps, LinkProps } from "../Link/CustomLink";
import { RouterProps } from "../../../routes";
import Tooltip from "../CustomTooltip/Tooltip";
import { ComponentProps, useMemo } from "react";
import { LoadingButton } from "@mui/lab";

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
    sx?: SxProps<{}>;

    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;

    loading?: boolean;
    disabled?: boolean;
};

export const Button = <T extends keyof RouterProps>({
    children = "",
    variant = "contained",
    color = "primary",
    size = "medium",
    onClick,

    ...props
}: ButtonProps<T>) => {
    const disabled = useMemo(
        () => props.loading || props.disabled,
        [props.loading, props.disabled]
    );

    const ButtonComponent = () => (
        <LoadingButton
            loading={props.loading}
            disabled={disabled}
            variant={variant}
            color={color}
            size={size}
            onClick={onClick}
            startIcon={props.startIcon}
            endIcon={props.endIcon}
            sx={{
                ...props.sx
            }}>
            {children}
        </LoadingButton>
    );

    const typedParams: CommonLinkProps<T>["params"] =
        props.toParams as CommonLinkProps<T>["params"];
    const typedState: CommonLinkProps<T>["state"] =
        props.toState as CommonLinkProps<T>["state"];

    const LinkComponent = () =>
        props.to && !disabled ? (
            <CustomLink
                to={props.to}
                state={typedState}
                params={typedParams}
                sx={{
                    display: "flex",
                    ...props.sx
                }}>
                <ButtonComponent />
            </CustomLink>
        ) : (
            <ButtonComponent />
        );

    return props.tooltip && !disabled ? (
        <Tooltip title={props.tooltip} placement={props.tooltipPlacement}>
            <LinkComponent />
        </Tooltip>
    ) : (
        <LinkComponent />
    );
};
