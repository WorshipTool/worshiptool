import { Box, InputBase, styled, useTheme } from "@mui/material";
import { useEffect } from "react";
import useGroup from "../../hooks/group/useGroup";
import HomeDesktop from "./HomeDesktop";
import HomeMobile from "./HomeMobile";

export default function Home() {
    const theme = useTheme();
    const { turnOff } = useGroup();

    /**
     * Set document title
     */
    useEffect(() => {
        turnOff();
    }, []);

    return (
        <Box>
            <Box
                flex={1}
                display={"flex"}
                sx={{
                    [theme.breakpoints.down("sm")]: {
                        display: "none"
                    }
                }}>
                <HomeDesktop />
            </Box>
            <Box
                flex={1}
                display={"none"}
                sx={{
                    [theme.breakpoints.down("sm")]: {
                        display: "flex"
                    }
                }}>
                <HomeMobile />
            </Box>
        </Box>
    );
}
