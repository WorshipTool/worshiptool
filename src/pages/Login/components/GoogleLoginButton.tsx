import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/auth/useAuth";

type GoogleLoginButtonProps = {
    afterLogin?: () => void;
};

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const onSuccess = (credentialResponse: CredentialResponse) => {
        loginWithGoogle(
            credentialResponse,
            props.afterLogin || (() => navigate("/"))
        );
    };

    const onFailure = () => {};

    return (
        <div>
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onFailure}
                useOneTap
                auto_select
            />
        </div>
    );
}
