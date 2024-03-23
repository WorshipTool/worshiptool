import React from "react";
import useAuth from "../../../../hooks/auth/useAuth";
import { Button, CircularProgress, useTheme } from "@mui/material";
import { verify } from "crypto";
import {
    getUrl_UNVERIFYVARIANT,
    getUrl_VERIFYVARIANT
} from "../../../../api/urls";
import { VariantDTO } from "../../../../interfaces/variant/VariantDTO";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { Public, PublicOff } from "@mui/icons-material";
import { SongsApi } from "../../../../api/generated";
import { useApiState } from "../../../../tech/ApiState";
import { handleApiCall } from "../../../../tech/handleApiCall";
import { SongVariantDto } from "../../../../api/dtos";

export interface VerifyButtonProps {
    variant: SongVariantDto;
    reloadSong: () => void;
}

export default function VerifyButton(props: VerifyButtonProps) {
    const { apiConfiguration } = useAuth();
    const songsApi = new SongsApi(apiConfiguration);
    const {
        fetchApiState,
        apiState: { loading }
    } = useApiState();

    const { enqueueSnackbar } = useSnackbar();

    // const [loading, setLoading] = React.useState(false);

    const reload = () => {
        props.reloadSong();
    };

    const unverify = () => {
        fetchApiState(
            async () => {
                return handleApiCall(
                    songsApi.songsControllerUnverify(props.variant.guid)
                );
            },
            () => {
                reload();
                enqueueSnackbar(
                    `Zveřejnění písně ${
                        (props.variant.preferredTitle && " ") || ""
                    }bylo zrušeno`
                );
            }
        );
    };
    const verify = () => {
        fetchApiState(
            async () => {
                return handleApiCall(
                    songsApi.songsControllerVerify(props.variant.guid)
                );
            },
            () => {
                reload();
                enqueueSnackbar(
                    `Píseň ${
                        (props.variant.preferredTitle && " ") || ""
                    }byla zveřejněna.`
                );
            }
        );
    };

    const theme = useTheme();

    return (
        <div>
            <LoadingButton
                onClick={() => {
                    if (props.variant.verified) {
                        unverify();
                    } else {
                        verify();
                    }
                }}
                loading={loading}
                loadingPosition="start"
                startIcon={
                    props.variant.verified ? (
                        <PublicOff
                            sx={{
                                [theme.breakpoints.down("lg")]: {
                                    display: "none"
                                }
                            }}
                        />
                    ) : (
                        <Public
                            sx={{
                                [theme.breakpoints.down("lg")]: {
                                    display: "none"
                                }
                            }}
                        />
                    )
                }>
                {props.variant.verified ? "Zrušit zveřejnění" : "Zveřejnit"}
            </LoadingButton>
        </div>
    );
}
