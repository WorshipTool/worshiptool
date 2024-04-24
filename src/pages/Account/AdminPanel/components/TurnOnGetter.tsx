import { FormControlLabel, Checkbox, Typography } from "@mui/material";
import React from "react";
import { useApi } from "../../../../hooks/api/useApi";
import useAuth from "../../../../hooks/auth/useAuth";
import { useApiStateEffect, useApiState } from "../../../../tech/ApiState";
import { handleApiCall } from "../../../../tech/handleApiCall";
import Card from "../../../../components/Card/Card";
import { AutoMode } from "@mui/icons-material";

export default function TurnOnGetter() {
    const { getterApi } = useApi();
    const { isLoggedIn } = useAuth();
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

    return (
        <Card
            title="Zapnout automatické získávání písní (Getter)"
            icon={<AutoMode />}
            actions={
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={Boolean(apiState.data)}
                            onChange={onGetterChange}
                        />
                    }
                    sx={{ ml: 0 }}
                    disabled={apiState.loading || apiState2.loading}
                    label={"Zapnout (Getter)"}
                />
            }>
            <Typography variant="body2">
                Automatické získávání písní je momentálně{" "}
                {apiState.loading
                    ? "načítání..."
                    : apiState.data
                    ? "zapnuto"
                    : "vypnuto"}
            </Typography>
        </Card>
    );
}
