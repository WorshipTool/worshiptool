import { Cyclone, DonutLarge, EggAlt } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useApi } from "../../../../hooks/api/useApi";
import { useApiState } from "../../../../tech/ApiState";
import { LoadingButton } from "@mui/lab";
import { PostCreateCopyOutDto, SongVariant } from "../../../../api/generated";
import { handleApiCall } from "../../../../tech/handleApiCall";
import { useNavigate } from "react-router-dom";
import { getVariantUrl } from "../../../../routes/routes";

export type CreateCopyButtonProps = {
    variantGuid: string;
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

    return (
        <LoadingButton
            color="success"
            variant="outlined"
            startIcon={<EggAlt />}
            loading={apiState.loading}
            onClick={onClick}>
            Vytvořit kopii
        </LoadingButton>
    );
}
