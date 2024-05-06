import React, { useMemo } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import {
    getReplacedUrlWithParams,
    RouterProps,
    routesParams,
    routesPaths,
    SmartParams
} from "../../../routes";

export type CommonLinkProps<T extends keyof RouterProps> = {
    to: T;
    state: RouterProps[T];
    params: T extends keyof typeof routesParams ? SmartParams<T> : {};
};

export type CustomLinkProps<T extends keyof RouterProps> =
    CommonLinkProps<T> & {
        children: React.ReactNode;
    } & Omit<NavLinkProps, "to" | "state">;

export function CustomLink<T extends keyof RouterProps>(
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
