import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import User, { ROLES } from "../../interfaces/user";
import {
    LoginRequestDTO,
    LoginResultDTO,
    PostLoginGoogleDto,
    SignUpRequestDTO,
    loginResultDTOToUser
} from "../../api/dtos/dtosAuth";
import { useSnackbar } from "notistack";
import useGroup from "../group/useGroup";
import { CredentialResponse, useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthApi, Configuration, LoginInputData } from "../../api/generated";
import { access } from "fs";

export const authContext = createContext<ReturnType<typeof useProvideAuth>>({
    login: async () => {},
    loginWithGoogle: () => {},
    logout: () => {},
    signup: () => {},
    isLoggedIn: () => false,
    user: undefined,
    info: {} as User,
    getAuthHeader: () => ({}),
    isTrustee: () => false,
    isAdmin: () => false,
    loading: false,
    apiConfiguration: {
        isJsonMime: () => true
    }
});

export const AuthProvider = ({ children }: { children: any }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export default function useAuth() {
    return useContext(authContext);
}

export function useProvideAuth() {
    const [user, setUser] = useState<User>();

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);

    const authApi = new AuthApi();

    const [googleShouldLogin, setGoogleShouldLogin] = useState<boolean>(false);
    const autoGoogleLogin = useGoogleOneTapLogin({
        disabled: !googleShouldLogin,
        onSuccess: (credentialResponse: CredentialResponse) => {
            loginWithGoogle(credentialResponse);
        }
    });

    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u != null) {
            setUser(JSON.parse(u));
        } else {
            setGoogleShouldLogin(true);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (user !== undefined) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    const login = async (
        { email, password }: { email: string; password: string },
        after?: (r: any) => void
    ) => {
        setLoading(true);

        const body: LoginInputData = {
            email,
            password
        };

        return authApi
            .authControllerLogin(body)
            .then((result) => {
                innerLogin(loginResultDTOToUser(result.data));
                if (after) after(result.data);
            })
            .catch((err) => {
                console.log(err);
                if (after) after(err.response);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const innerLogin = (user: User) => {
        enqueueSnackbar(
            `Ahoj ${user.firstName} ${user.lastName}. Ať najdeš, po čem paseš.`
        );
        setUser(user);
    };
    const logout = () => {
        setLoading(false);
        setUser(undefined);
        localStorage.removeItem("user");
        enqueueSnackbar("Byl jsi odhlášen. Zase někdy!");
        // navigate("/");
        setLoading(false);
    };

    const signup = (data: SignUpRequestDTO, after?: (r: boolean) => void) => {
        setLoading(true);
        const body = data;

        authApi
            .authControllerSignup(body)
            .then((result) => {
                if (after) after(true);
            })
            .catch((err) => {
                console.log(err);
                if (after) after(false);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const loginWithGoogle = (
        response: CredentialResponse,
        after?: (r: any) => void
    ) => {
        setLoading(true);

        const decoded: any = jwtDecode(response.credential || "");
        const data = {
            userToken: decoded.sub,
            email: decoded.email,
            firstName: decoded.given_name,
            lastName: decoded.family_name
        };

        authApi
            .authControllerLoginWithGoogle(data)
            .then((result) => {
                innerLogin(loginResultDTOToUser(result.data));
                if (after) after(result.data);
            })
            .catch((err) => {
                console.log(err);
                if (after) after(err.response);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const isLoggedIn = () => {
        return user !== undefined;
    };

    const getAuthHeader = () => {
        if (user) return { Authorization: "Bearer " + user.token };
        return {};
    };

    const apiConfiguration: Configuration = useMemo(
        () => ({
            isJsonMime: () => true,
            accessToken: user?.token
        }),
        [user]
    );

    return {
        login,
        logout,
        signup,
        loginWithGoogle,
        isLoggedIn,
        user,
        info: user ? user : ({} as User),
        getAuthHeader,
        isTrustee: () => user != undefined && user.role == ROLES.Trustee,
        isAdmin: () => user != undefined && user.role == ROLES.Admin,
        loading,
        apiConfiguration
    };
}
