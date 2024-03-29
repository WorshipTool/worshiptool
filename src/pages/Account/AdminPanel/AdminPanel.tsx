import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    InputBase,
    Typography
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../../hooks/auth/useAuth";
import { LoginRequestDTO, LoginResultDTO } from "../../../api/dtos/dtosAuth";
import { songGetCountDTO } from "../../../api/dtos/dtosSong";
import useGroup from "../../../hooks/group/useGroup";
import AddToSelection from "./components/AddToSelection";
import RemoveFromSelection from "./components/RemoveFromSelection";
import Gap from "../../../components/Gap";
import { handleApiCall } from "../../../tech/handleApiCall";
import { useApiState, useApiStateEffect } from "../../../tech/ApiState";
import { useApi } from "../../../hooks/api/useApi";
import { CheckBox } from "@mui/icons-material";

export default function AdminPanel() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const {fetchData} = useFetch();
    const { songGettingApi, authApi, getterApi } = useApi();
    const { isLoggedIn, apiConfiguration } = useAuth();
    const [apiState, reloadGetter] = useApiStateEffect(async () => {
        if (!isLoggedIn) return Promise.resolve(false);
        const r = await handleApiCall(getterApi.getterControllerIsActive());
        return r;
    }, [isLoggedIn]);
    const { fetchApiState, apiState: apiState2 } = useApiState();

    const onGetterChange = (e: any) => {
        if (!isLoggedIn) return;
        const newValue = e.target.checked;

        fetchApiState(() =>
            handleApiCall(
                newValue
                    ? getterApi.getterControllerActivate()
                    : getterApi.getterControllerDeactivate()
            ).then(() => {
                reloadGetter();
            })
        );
    };

    const [songCount, setSongCount] = useState<number>();

    const getCount = async () => {
        handleApiCall(songGettingApi.songGettingControllerGetSongsCount())
            .then((r) => {
                setSongCount(r);
            })
            .catch((e) => {
                console.log(e);
            });
        // const r = await fetchData<songGetCountDTO>({url: getUrl_GETSONGCOUNT()});
        // setSongCount(r.data.count);
    };

    useEffect(() => {
        getCount();
        const interval = setInterval(getCount, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const [token, setToken] = useState("");

    // const {post} = useFetch();

    const showToken = () => {
        const body: LoginRequestDTO = {
            email,
            password
        };
        handleApiCall(authApi.authControllerLogin(body))
            .then((r) => {
                setToken(r.token);
                navigator.clipboard.writeText(r.token);
                console.log(r.token);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const { isOn } = useGroup();

    return (
        <Box>
            <Typography>Ziskej token uzivatele:</Typography>
            <InputBase
                placeholder="Email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <InputBase
                placeholder="Heslo"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <Button onClick={showToken}>Získat token</Button>
            {token != "" && (
                <Typography>Token copied in clipboard...</Typography>
            )}

            <Box>
                <Typography>Aktualní počet písní: {songCount}</Typography>
            </Box>

            {isOn ? (
                <>
                    <Gap />
                    <Typography variant="h6">
                        Spravovat playlist skupiny
                    </Typography>
                    <AddToSelection />
                    <RemoveFromSelection />
                </>
            ) : (
                <>
                    <Typography>Skupina není aktivní</Typography>
                </>
            )}

            <FormControlLabel
                control={
                    <Checkbox
                        checked={Boolean(apiState.data)}
                        onChange={onGetterChange}
                    />
                }
                disabled={apiState.loading || apiState2.loading}
                label={"Automatické získávání písní (Getter)"}
            />
        </Box>
    );
}
