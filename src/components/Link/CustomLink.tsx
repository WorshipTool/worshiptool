import { Link, styled } from "@mui/material";
import React, { useMemo } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import {
    getReplacedUrlWithParams,
    RouterProps,
    routesParams,
    RoutesParamsType,
    routesPaths,
    SmartParams,
    SmartState,
    SmartTo
} from "../../routes";

type CustomLinkProps<T extends keyof RouterProps> = {
    to: T;
    state: RouterProps[T];
    params: T extends keyof typeof routesParams ? SmartParams<T> : {};
    children: React.ReactNode;
} & Omit<NavLinkProps, "to" | "state">;

export default function CustomLink<T extends keyof RouterProps>(
    props: CustomLinkProps<T>
) {
    const to = useMemo(() => {
        return getReplacedUrlWithParams(routesPaths[props.to], props.params);
    }, [props.to, props.params]);

    return (
        <NavLink
            {...props}
            to={to}
            style={{
                color: "inherit",
                textDecoration: "none",
                ...props.style
            }}>
            {props.children}
        </NavLink>
    );
}
