import React, { useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import AppLayout from "../../common/components/app/AppLayout/AppLayout";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useApiStateEffect } from "../../tech/ApiState";
import {
    SkeletonLoader,
    SkeletonLoaderCore
} from "../../common/providers/SkeletonLoader";
import SongContainer from "./SongContainer";
import { Helmet } from "react-helmet";
import { useApi } from "../../hooks/api/useApi";
import { handleApiCall } from "../../tech/handleApiCall";
import { useSmartLocation } from "../../routes";

export default function SongRoutePage() {
    const { alias: code, hex } = useParams();
    const alias = useMemo(() => code && hex && `${hex}-${code}`, [code, hex]);

    const { urlAliasApi } = useApi();

    const [apiState] = useApiStateEffect(async () => {
        if (!alias) return null;
        const guid = await handleApiCall(
            urlAliasApi.urlAliasControllerGetVariantFromAlias(alias)
        );
        return guid;
    }, [alias]);

    const { state } = useSmartLocation("variant");

    return (
        <AppLayout>
            <SkeletonLoaderCore
                data={[apiState]}
                render={() => (
                    <>
                        {apiState.data ? (
                            <SongContainer
                                variantGuid={apiState.data}
                                stateTitle={state?.title}
                            />
                        ) : (
                            <Typography>Pisen nenalezena</Typography>
                        )}
                    </>
                )}
                renderLoading={() => (
                    <>
                        <LinearProgress />
                    </>
                )}
                renderError={() => (
                    <>
                        <Typography>Píseň nenalezena.</Typography>
                    </>
                )}
            />
        </AppLayout>
    );
}
