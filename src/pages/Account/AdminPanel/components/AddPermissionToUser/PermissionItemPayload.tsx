import React, { useEffect, useMemo, useState } from "react";
import {
    PermissionPayloadType,
    PermissionType
} from "../../../../../interfaces/permission.types";
import { Box, CircularProgress, NativeSelect, Typography } from "@mui/material";
import { useGroups } from "../../../../../hooks/group/useGroups";
import { useApiStateEffect } from "../../../../../tech/ApiState";
import { SkeletonLoader } from "../../../../../common/providers/SkeletonLoader";

type PermissionItemPayloadProps<T extends PermissionType> = {
    type: T;
    editable?: boolean;
    value?: PermissionPayloadType<T>;
    onChange?: (value: PermissionPayloadType<T>) => void;
};

export default function PermissionItemPayload<T extends PermissionType>(
    props: PermissionItemPayloadProps<T>
) {
    const group = useGroups();
    const containsGroup = useMemo(
        () => props.type.includes("GROUP"),
        [props.type]
    );
    const [groupState] = useApiStateEffect(async () => {
        if (containsGroup && props.value?.trim() != "")
            return group.getInfoByGuid(props.value as string);
    });

    const [groupListState] = useApiStateEffect(async () => {
        if (containsGroup && props.editable) return group.getAllGroups();
    }, [props.editable]);

    useEffect(() => {
        if (groupListState.data)
            props.onChange?.(groupListState.data?.[0]?.guid);
    }, [props.editable, groupListState.data]);

    return (
        <>
            {props.editable ? (
                <>
                    {containsGroup && (
                        <SkeletonLoader
                            data={[groupListState]}
                            render={() => (
                                <>
                                    <NativeSelect
                                        defaultValue={
                                            groupListState.data?.[0]?.guid
                                        }
                                        onChange={(e) => {
                                            props.onChange?.(e.target.value);
                                        }}>
                                        {groupListState.data?.map((g) => (
                                            <option value={g.guid}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </>
                            )}
                            renderLoading={() => (
                                <>
                                    <Typography>Načítání...</Typography>
                                </>
                            )}
                        />
                    )}
                </>
            ) : (
                <>
                    {containsGroup && (
                        <Box display={"flex"} flexDirection={"row"} gap={1}>
                            <Typography>
                                <b>Skupina</b>
                            </Typography>
                            <SkeletonLoader
                                data={[groupState]}
                                render={() => (
                                    <>
                                        <Typography>
                                            {groupState.data?.name}
                                        </Typography>
                                    </>
                                )}
                                renderLoading={() => (
                                    <>
                                        <Typography>Načítání...</Typography>
                                    </>
                                )}
                            />
                        </Box>
                    )}
                </>
            )}
        </>
    );
}
