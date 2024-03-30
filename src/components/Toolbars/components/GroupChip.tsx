import React from "react";
import useGroup from "../../../hooks/group/useGroup";
import { Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { GROUP_URL } from "../../../routes/routes";

interface GroupChipProps {
    avatar?: ReactElement;
}

export default function GroupChip({ avatar }: GroupChipProps) {
    const { isOn, name, turnOff } = useGroup();
    const navigate = useNavigate();

    const onDelete = () => {
        turnOff();
        if (window.location.pathname.startsWith(GROUP_URL)) navigate("/");
    };

    return (
        <Box sx={{ pointerEvents: "auto" }}>
            {isOn ? (
                <Chip
                    label={name}
                    onDelete={onDelete}
                    color="secondary"
                    avatar={avatar}
                />
            ) : (
                <></>
            )}
        </Box>
    );
}
