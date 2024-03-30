import React from "react";
import useAuth from "../../../../hooks/auth/useAuth";
import {
    Button,
    CircularProgress,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    useTheme
} from "@mui/material";
import { verify } from "crypto";
import { VariantDTO } from "../../../../interfaces/variant/VariantDTO";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { Public, PublicOff } from "@mui/icons-material";
import { useApiState } from "../../../../tech/ApiState";
import { handleApiCall } from "../../../../tech/handleApiCall";
import { SongVariantDto } from "../../../../api/dtos";
import { useApi } from "../../../../hooks/api/useApi";

export interface VerifyButtonProps {
    variant: SongVariantDto;
    reloadSong: () => void;
}

export default function VerifyButton(props: VerifyButtonProps) {
    const { songEditingApi } = useApi();
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
                    songEditingApi.songEditingControllerUnverify(
                        props.variant.guid
                    )
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
                    songEditingApi.songEditingControllerVerify(
                        props.variant.guid
                    )
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
        <MenuItem
            onClick={() => {
                if (props.variant.verified) {
                    unverify();
                } else {
                    verify();
                }
            }}
            disabled={loading}>
            <ListItemIcon>
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : props.variant.verified ? (
                    <PublicOff />
                ) : (
                    <Public />
                )}
            </ListItemIcon>
            <ListItemText
                primary={
                    props.variant.verified ? "Zrušit zveřejnění" : "Zveřejnit"
                }
            />
        </MenuItem>
    );
}
