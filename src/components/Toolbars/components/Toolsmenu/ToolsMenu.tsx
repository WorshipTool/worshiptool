import { Box, Collapse, Fade, Paper, styled} from '@mui/material';
import React from 'react'
import useOutsideClick from './hooks/useOutsideClick';
import useToolsMenuItems from './hooks/useToolsMenuItems';
import MenuItem from './components/MenuItem';


const Container = styled(Box)(({theme})=>({
    position: "absolute",
    top: 50,
    right: theme.spacing(2),
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ccc",
    // borderStyle: "solid",
    borderRadius: theme.spacing(1),
    color: "black",
    boxShadow: "0px 1px 6px 2px #00000044",
    gap: theme.spacing(0),
    padding: theme.spacing(2)
}))

interface ToolsMenuProps{
    open?: boolean,
    onClose? : ()=>void
}

export default function ToolsMenu({open, onClose} : ToolsMenuProps) {

    const ref = useOutsideClick(()=>{
        onClose && onClose();
    })

    const {items} = useToolsMenuItems();
    return (
        <Fade in={open}>
            <Container ref={ref} sx={{display: "flex" }}>
                    {items.map((item)=>{
                        return <MenuItem title={item.title} img={item.image} onClick={item.action} disabled={item.disabled} key={`menuitem${item.title}`}/>
                    })}
            </Container>
        </Fade>
    )
}
