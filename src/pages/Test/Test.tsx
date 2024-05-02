import React, { useEffect } from "react";
import { useSmartNavigate } from "../../routes";

export default function Test() {
    const navigate = useSmartNavigate();

    return (
        <div>
            baf
            <button
                onClick={() => {
                    navigate("home", {});
                }}>
                click
            </button>
        </div>
    );
}
