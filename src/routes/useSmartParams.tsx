import { useParams } from "react-router-dom";
import { RouterProps, routesParams } from "./routes";
import { SmartParams } from "./routes.types";

export const useSmartParams = <T extends keyof typeof routesParams>(
    page: T
) => {
    const params = useParams();
    const p: SmartParams<T> = params as any;
    return p;
};

export const getParamsFromUrl = (url: string, pattern: string) => {
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
