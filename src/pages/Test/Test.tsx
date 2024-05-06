import React, { useEffect } from "react";
import { useSmartNavigate } from "../../routes";
import { Button } from "../../common/ui";

export default function Test() {
    const navigate = useSmartNavigate();

    return (
        <div
            style={{
                backgroundColor: "red",
                padding: 20
            }}>
            <Button variant="outlined">Ahoj</Button>
        </div>
    );
}
