import { Link, styled } from "@mui/material";
import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { RouterProps, routesPaths, SmartState, SmartTo } from "../../routes";

type CustomLinkProps<T extends keyof RouterProps> = {
    to: string;
    type: T;
    state: RouterProps[T];
    children: React.ReactNode;
} & Omit<NavLinkProps, "to" | "state">;

export default function CustomLink<T extends keyof RouterProps>(
    props: CustomLinkProps<T>
) {
    return (
        <NavLink
            {...props}
            style={{
                color: "inherit",
                textDecoration: "none",
                ...props.style
            }}>
            {props.children}
        </NavLink>
    );
}
