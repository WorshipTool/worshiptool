import { Box } from "@mui/material";
import React from "react";
import Snowfall from "react-snowfall";

const imagesName = ["y", "i", "p", "k"];

const images = imagesName.map((name) => {
    const snowflake1 = document.createElement("img");
    snowflake1.src = `/static/assets/flakes/${name}.png`;
    return snowflake1;
});

export default function Snow() {
    return (
        <Box displayPrint={"none"}>
            <Snowfall
                snowflakeCount={30}
                speed={[0.2, 1]}
                color="#0085FF44"
                images={images}
                radius={[5, 15]}
                style={{
                    zIndex: -100,
                    opacity: 0.8,
                    filter: "blur(1px)"
                }}
            />
        </Box>
    );
}
