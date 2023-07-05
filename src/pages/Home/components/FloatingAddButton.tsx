import { Close, Edit } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import useAuth from '../../../hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom';

interface FloatingAddButtonProps{

}

export default function FloatingAddButton({}: FloatingAddButtonProps) {
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    const onClickAddSong = useCallback(()=>{
        navigate("/create");
    },[]);

    return (
        <div>
        {isLoggedIn()&&<>
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
                </>}
        </div>
    )
}
