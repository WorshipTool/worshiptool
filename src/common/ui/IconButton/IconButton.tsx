import React, { ComponentProps } from "react";
import { IconButton as IconBtn } from "@mui/material";
import { ColorType } from "../ui.types";
import { Clickable } from "../Clickable";
import { CommonLinkProps, Link } from "../Link/CustomLink";
import { RouterProps } from "../../../routes";
import Tooltip from "../CustomTooltip/Tooltip";

type IconButtonProps<T extends keyof RouterProps> = {
    children: React.ReactNode;
    onClick?: () => void;
    color?: ColorType;

    tooltip?: string;
    tooltipPlacement?: ComponentProps<typeof Tooltip>["placement"];
    to?: CommonLinkProps<T>["to"];
    toParams?: CommonLinkProps<T>["params"];
    toState?: CommonLinkProps<T>["state"];
};

export const IconButton = <T extends keyof RouterProps>({
    color = "primary",
    ...props
}: IconButtonProps<T>) => {
    const ButtonComponent = () => (
        <IconBtn color={color} onClick={props.onClick}>
            {props.children}
        </IconBtn>
    );

    const typedParams: CommonLinkProps<T>["params"] =
        props.toParams as CommonLinkProps<T>["params"];
    const typedState: CommonLinkProps<T>["state"] =
        props.toState as CommonLinkProps<T>["state"];

    const LinkComponent = () =>
        props.to ? (
            <Link to={props.to} state={typedState} params={typedParams}>
                <ButtonComponent />
            </Link>
        ) : (
            <ButtonComponent />
        );
    return (
        <Clickable>
            {props.tooltip ? (
                <Tooltip
                    title={props.tooltip}
                    placement={props.tooltipPlacement}>
                    <LinkComponent />
                </Tooltip>
            ) : (
                <LinkComponent />
            )}
        </Clickable>
    );
};
