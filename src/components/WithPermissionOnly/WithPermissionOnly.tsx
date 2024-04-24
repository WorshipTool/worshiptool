import React, { useMemo } from "react";
import { usePermission } from "../../hooks/auth/usePermission";
import { usePermissions } from "../../hooks/auth/usePermissions";
import { SkeletonLoader } from "../SkeletonLoader";
import { PermissionDataType } from "../../interfaces/permission.types";

export type WithPermissionOnlyProps = {
    permissions: PermissionDataType[] | PermissionDataType;
    children?: React.ReactNode;
};

export default function WithPermissionOnly(props: WithPermissionOnlyProps) {
    const a = usePermissions();
    const containsAll = useMemo(() => {
        return Array.isArray(props.permissions)
            ? props.permissions.every((p) =>
                  a.includesPermission(p.type, p.payload)
              )
            : a.includesPermission(
                  props.permissions.type,
                  props.permissions.payload
              );
    }, [a.permissions]);
    return (
        <SkeletonLoader
            data={[a.state]}
            render={() => <>{containsAll && props.children}</>}
            renderLoading={() => <></>}
        />
    );
}
