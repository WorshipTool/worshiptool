import React, { useEffect } from "react";
import { useSmartNavigate } from "../../routes";
import { Button, IconButton } from "../../common/ui";

export default function Test() {
    const onClick = (e: any) => {};
    return (
        <div
            style={{
                backgroundColor: "red",
                padding: 20
            }}>
            <IconButton onClick={onClick}>Ahoj</IconButton>
        </div>
    );
}
