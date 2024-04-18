import { useNavigate } from "react-router-dom";
import { RouterProps, routesPaths } from "./routes";
import { SmartNavigateOptions, SmartTo } from "./routes.types";

export const useSmartNavigate = () => {
    const nv = useNavigate();

    const navigate = <T extends keyof RouterProps>(
        to: SmartTo<T>,
        options?: SmartNavigateOptions<T>
    ) => {
        nv(routesPaths[to], options);
    };

    return navigate;
};
