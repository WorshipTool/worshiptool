import React, { useEffect, useMemo } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import {
    getReplacedUrlWithParams,
    RouterProps,
    routesParams,
    routesPaths,
    SmartParams
} from "../../../routes";
import { SxProps, styled } from "@mui/material";

export type CommonLinkProps<T extends keyof RouterProps> = {
    to: T;
    state: RouterProps[T];
    params: T extends keyof typeof routesParams ? SmartParams<T> : {};
};

export type LinkProps<T extends keyof RouterProps> = CommonLinkProps<T> & {
    children: React.ReactNode;
    onlyWithShift?: boolean;
    sx?: SxProps<{}>;
    newTab?: boolean;
    disabled?: boolean;
} & Omit<NavLinkProps, "to" | "state">;

const StyledLink = styled(NavLink)({});

export function Link<T extends keyof RouterProps>(props: LinkProps<T>) {
    const to = useMemo(() => {
        return getReplacedUrlWithParams(routesPaths[props.to], props.params);
    }, [props.to, props.params]);

    const [shiftOn, setShiftOn] = React.useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "Control" ||
                e.key === "Shift" ||
                e.key === "Alt" ||
                e.key === "Meta"
            ) {
                setShiftOn(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (
                e.key === "Control" ||
                e.key === "Shift" ||
                e.key === "Alt" ||
                e.key === "Meta"
            ) {
                setShiftOn(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (props.onlyWithShift && !shiftOn) || props.disabled ? (
        <>{props.children}</>
    ) : (
        <StyledLink
            {...props}
            to={to}
            target={props.newTab ? "_blank" : undefined}
            style={{
                color: "inherit",
                textDecoration: "none",
                ...props.style
            }}>
            {props.children}
        </StyledLink>
    );
}
