import React, { useEffect } from "react";
import { useSmartNavigate } from "../../routes";
import { Button, IconButton } from "../../common/ui";
import { Helmet } from "react-helmet";

export default function Test() {
    const onClick = (e: any) => {};
    return (
        <div
            style={{
                backgroundColor: "red",
                padding: 20
            }}>
            <IconButton onClick={onClick}>Ahoj</IconButton>
            <Helmet>
                <title>Testoidd</title>
            </Helmet>
        </div>
    );
}
