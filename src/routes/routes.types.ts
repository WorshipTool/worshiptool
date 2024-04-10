import { NavigateOptions } from "react-router-dom";
import { CustomRouterProps } from "./routes";

export type RoutesProps = Record<string, undefined | Record<string, any>>;
export type RoutesPaths<TRouterProps extends RoutesProps> = Record<
    keyof TRouterProps,
    string
>;

export type SmartTo<T extends keyof RoutesProps> = T;
export type SmartState<T extends keyof CustomRouterProps> = T extends string
    ? CustomRouterProps[T]
    : undefined;

type NavigateOptionsNoState = Omit<NavigateOptions, "state">;

// If SmartState<T> is undefined join state?, otherwise join state: SmartState<T>
export type SmartNavigateOptions<T extends keyof CustomRouterProps> =
    NavigateOptionsNoState & {
        state: SmartState<T>;
    };
