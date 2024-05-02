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
