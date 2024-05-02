import { useNavigate } from "react-router-dom";
import { RouterProps, routesPaths, getReplacedUrlWithParams } from "./routes";
import { SmartTo, SmartNavigateOptions } from "./routes.types";

export const useSmartNavigate = () => {
    const nv = useNavigate();

    const navigate = <T extends keyof RouterProps>(
        to: SmartTo<T>,
        options: SmartNavigateOptions<T>
    ) => {
        const params = (options as any).params;
        const toUrl = routesPaths[to];
        const urlWithParams = params
            ? getReplacedUrlWithParams(toUrl, params)
            : toUrl;

        nv(urlWithParams, options);
    };

    return navigate;
};
