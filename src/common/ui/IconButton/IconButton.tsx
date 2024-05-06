import React, { ComponentProps, useCallback, useMemo } from "react";
import { IconButton as IconBtn, SxProps } from "@mui/material";
import { ColorType } from "../ui.types";
import { Clickable } from "../Clickable";
import { CommonLinkProps, Link } from "../Link/CustomLink";
import { RouterProps } from "../../../routes";
import Tooltip from "../CustomTooltip/Tooltip";

type IconButtonProps<T extends keyof RouterProps> = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    color?: ColorType;

    tooltip?: string;
    tooltipPlacement?: ComponentProps<typeof Tooltip>["placement"];
    to?: CommonLinkProps<T>["to"];
    toParams?: CommonLinkProps<T>["params"];
    toState?: CommonLinkProps<T>["state"];

    sx?: SxProps<{}>;
    disabled?: boolean;
};

const ButtonComponent = ({
    color = "primary",
    ...props
}: IconButtonProps<keyof RouterProps>) => {
    return (
        <IconBtn
            color={color}
            onClick={(e: any) => props.onClick?.(e)}
            sx={props.sx}
            disabled={props.disabled}>
            {props.children}
        </IconBtn>
    );
};

const LinkComponent = <T extends keyof RouterProps>(
    props: IconButtonProps<T>
) => {
    const typedParams: CommonLinkProps<T>["params"] = useMemo(
        () => props.toParams as CommonLinkProps<T>["params"],
        [props.toParams]
    );
    const typedState: CommonLinkProps<T>["state"] = useMemo(
        () => props.toState as CommonLinkProps<T>["state"],
        [props.toState]
    );

    return props.to ? (
        <Link
            to={props.to}
            state={typedState}
            params={typedParams}
            sx={props.sx}>
            <ButtonComponent {...props} />
        </Link>
    ) : (
        <ButtonComponent {...props} />
    );
};

const ClickableComponent = <T extends keyof RouterProps>({
    ...props
}: IconButtonProps<T>) => {
    return (
        <Clickable>
            {props.tooltip ? (
                <Tooltip
                    title={props.tooltip}
                    placement={props.tooltipPlacement}>
                    <LinkComponent {...props} />
                </Tooltip>
            ) : (
                <LinkComponent {...props} />
            )}
        </Clickable>
    );
};

export const IconButton = <T extends keyof RouterProps>({
    ...props
}: IconButtonProps<T>) => {
    return <ClickableComponent {...props} />;
};
