import { Add, Close, Edit } from "@mui/icons-material";
import {
    Box,
    Fab,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Tooltip
} from "@mui/material";
import React, { useCallback, useMemo } from "react";
import useAuth from "../../../hooks/auth/useAuth";
import { useSmartNavigate } from "../../../routes";
import { Link } from "../../../common/ui/Link/CustomLink";

interface FloatingAddButtonProps {
    extended?: boolean;
}

export default function FloatingAddButton({
    extended
}: FloatingAddButtonProps) {
    const { isLoggedIn } = useAuth();
    const navigate = useSmartNavigate();

    const transition = "all 0.2s ease";
    const titleWidth = "90px";
    return (
        <Link to="addMenu" state={undefined} params={{}}>
            {isLoggedIn() && (
                <Tooltip title={"Přidat novou píseň"} placement="left">
                    <Fab
                        sx={{
                            position: "fixed",
                            bottom: 30,
                            right: 30,
                            transition,
                            ...(extended
                                ? {
                                      width: `calc( ${titleWidth} + 56px)`
                                  }
                                : {
                                      width: 56
                                  })
                        }}
                        color="primary"
                        variant={extended ? "extended" : "circular"}>
                        <Add
                            sx={{
                                position: "absolute",
                                transition,
                                ...(extended
                                    ? {
                                          mr: titleWidth
                                      }
                                    : {
                                          mr: 0
                                      })
                            }}
                        />
                        <Add sx={{ opacity: 0 }} />
                        <Box
                            sx={{
                                transition,
                                overflowWrap: "none",
                                overflow: "hidden",
                                ...(extended
                                    ? {
                                          width: titleWidth
                                      }
                                    : {
                                          width: 0,
                                          opacity: 0
                                      })
                            }}>
                            Vytvořit
                        </Box>
                    </Fab>
                </Tooltip>
            )}
            {/* {isLoggedIn()&&<>
                    <SpeedDial
                        ariaLabel="FloatingAddButton"
                        sx={{ position: 'fixed', bottom: 30, right: 30 }}
                        icon={<SpeedDialIcon openIcon={<Close />} />}>
                            <SpeedDialAction
                                icon={<Edit />}
                                tooltipTitle={"Přidej text a akordy"}
                                onClick={onClickAddSong}
                                />
                            
                    </SpeedDial>
                </>} */}
        </Link>
    );
}
