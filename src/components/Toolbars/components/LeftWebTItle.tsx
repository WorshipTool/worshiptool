import { Box, Button, Link, Typography, styled } from "@mui/material";
import React, { useMemo } from "react";
import { ReactComponent as SvgIcon } from "../../../assets/icon.svg";
import useGroup from "../../../hooks/group/useGroup";
import { useSmartNavigate } from "../../../routes";

const Container = styled(Box)(({ theme }) => ({
    height: "100%",
    alignItems: "center",
    justifyContent: "start",
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    transition: "all 0.2s ease",
    "&:hover": {
        filter: "drop-shadow(4px 4px 4px #00000022)",
        transform: "scale(102%)"
    },
    "&:active": {
        transform: "scale(98%)"
    },
    cursor: "default",
    userSelect: "none",
    pointerEvents: "auto"
}));
interface LeftWebTitleProps {
    transparent?: boolean;
}
export default function LeftWebTitle({ transparent }: LeftWebTitleProps) {
    const navigate = useSmartNavigate();

    const color = useMemo(() => {
        return transparent ? "transparent" : "white";
    }, [transparent]);
    const size = 36;

    const { isOn, code } = useGroup();
    const goHomeClick = () => {
        if (isOn)
            navigate("group", {
                params: {
                    groupCode: code
                }
            });
        else navigate("home", {});
        window.scroll({
            top: 0,
            behavior: "smooth"
        });
    };
    return (
        <Container
            color={color}
            onClick={goHomeClick}
            display={transparent ? "none" : "flex"}>
            <SvgIcon fill="white" height={size} />
            <Typography fontWeight={800} fontSize={18} marginLeft={0}>
                Chvalotce
            </Typography>
        </Container>
    );
}
