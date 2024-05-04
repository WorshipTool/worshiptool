import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import React from "react";
import { ReactComponent as SvgIcon } from "@assets/icon.svg";
import "./LoadingScreen.styles.css";
import Gap from "../../../ui/Gap/Gap";
import { AnimatePresence, motion } from "framer-motion";

const size = 56;

type LoadingScreenProps = {
    isVisible?: boolean;
};

export default function LoadingScreen({
    isVisible = true
}: LoadingScreenProps) {
    const theme = useTheme();
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1,
                        backdropFilter: "blur(4px) grayscale(100%)"
                    }}
                    exit={{
                        opacity: 0,
                        backdropFilter: "blur(0px)"
                    }}
                    style={{
                        position: "fixed",
                        zIndex: 10000,
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            width: "100vw",
                            color: "black",
                            // background: theme.palette.primary.main,
                            flexDirection: "column"
                        }}>
                        {/* Loading */}
                        <SvgIcon
                            fill="white"
                            height={size}
                            className="rotate"
                        />
                        {/* <CircularProgress
                color="inherit"
                size={size * 1.3}
                thickness={2}
                variant="indeterminate"
                sx={{
                    position: "absolute",
                    zIndex: 1,
                    opacity: 0.2
                }}
            /> */}
                        <Gap value={2} />
                        <Typography className="loadingText">
                            Načítání aplikace...
                        </Typography>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
