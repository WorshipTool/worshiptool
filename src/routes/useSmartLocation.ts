import React from "react";
import { useLocation, Location } from "react-router-dom";
import { RouterProps } from "./routes";
import { SmartState } from "./routes.types";

type SmartLocationReturn<T extends keyof RouterProps> = Omit<
    Location,
    "state"
> & {
    state: RouterProps[T];
};

export const useSmartLocation = <T extends keyof RouterProps>(
    page: T
): SmartLocationReturn<T> => {
    const loc = useLocation();

    return {
        ...loc,
        state: loc.state || ({} as RouterProps[T])
    };
};

export const getSmartParams = (url: string, pattern: string) => {
    //Patern is for example "/playlist/:guid";
    //Url is for example http://localhost:5500/playlist/13bedb3a-eaaa-4a88-ac70-e14f37787a70
    let u: URL;
    try {
        u = new URL(url);
    } catch (e) {
        return {};
    }
    const urlParts = u.pathname.split("/");
    const patternParts = pattern.split("/");
    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
        const part = patternParts[i];
        if (part.startsWith(":")) {
            params[part.slice(1)] = urlParts[i];
        }
    }

    return params;
};
