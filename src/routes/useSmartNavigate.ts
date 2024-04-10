import { useNavigate } from "react-router-dom";
import { CustomRouterProps, routesPaths } from "./routes";
import { SmartNavigateOptions, SmartTo } from "./routes.types";

export const useSmartNavigate = () => {
    const nv = useNavigate();

    const navigate = <T extends keyof CustomRouterProps>(
        to: SmartTo<T>,
        options: SmartNavigateOptions<T>
    ) => {
        nv(routesPaths[to], options);
    };

    return navigate;
};
