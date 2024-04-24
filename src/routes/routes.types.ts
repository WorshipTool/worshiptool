import { NavigateOptions } from "react-router-dom";
import { RouterProps } from "./routes";

export type RoutesPropsType = Record<string, undefined | Record<string, any>>;
export type RoutesPathsType<TRouterProps extends RoutesPropsType> = Record<
    keyof TRouterProps,
    string
>;

export type SmartTo<T extends keyof RoutesPropsType> = T;
export type SmartState<T extends keyof RouterProps> = T extends string
    ? RouterProps[T]
    : undefined;

type NavigateOptionsNoState = Omit<NavigateOptions, "state">;

// If SmartState<T> is undefined join state?, otherwise join state: SmartState<T>
export type SmartNavigateOptions<T extends keyof RouterProps> =
    NavigateOptionsNoState & {
        state: SmartState<T>;
    };
