import { EggAlt } from "@mui/icons-material";
import {
    CircularProgress,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Tooltip,
    useTheme
} from "@mui/material";
import React from "react";
import { useApi } from "../../../../hooks/api/useApi";
import { useApiState } from "../../../../tech/ApiState";
import { LoadingButton } from "@mui/lab";
import { PostCreateCopyOutDto } from "../../../../api/generated";
import { handleApiCall } from "../../../../tech/handleApiCall";
import { useNavigate } from "react-router-dom";
import { getVariantUrl } from "../../../../routes/routes";

export type CreateCopyButtonProps = {
    variantGuid: string;
    asMenuItem?: boolean;
};

export default function CreateCopyButton(props: CreateCopyButtonProps) {
    const { songAddingApi } = useApi();

    const { fetchApiState, apiState } = useApiState<PostCreateCopyOutDto>();
    const navigate = useNavigate();

    const onClick = async () => {
        await fetchApiState(
            async () => {
                const result = await handleApiCall(
                    songAddingApi.songAddingControllerCreateCopy({
                        variantGuid: props.variantGuid
                    })
                );

                return result;
            },
            (data) => {
                navigate(getVariantUrl(data.alias));
            }
        );
    };

    const theme = useTheme();

    return props.asMenuItem ? (
        <MenuItem onClick={onClick} disabled={apiState.loading}>
            <ListItemIcon>
                {apiState.loading ? (
                    <CircularProgress size={`1rem`} color="inherit" />
                ) : (
                    <EggAlt color="inherit" />
                )}
            </ListItemIcon>
            <ListItemText primary="Vytvořit kopii" />
        </MenuItem>
    ) : (
        <Tooltip title={"Vytvořit kopii písně"}>
            <LoadingButton
                color="success"
                variant="contained"
                startIcon={
                    <EggAlt
                        sx={{
                            [theme.breakpoints.down("lg")]: {
                                display: "none"
                            }
                        }}
                    />
                }
                loading={apiState.loading}
                onClick={onClick}>
                Vlastní úprava
            </LoadingButton>
        </Tooltip>
    );
}
