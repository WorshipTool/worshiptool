import { Box, Divider } from "@mui/material";
import CurrentSongCount from "./components/CurrentSongCount";
import GetToken from "./components/GetToken";
import TurnOnGetter from "./components/TurnOnGetter";
import AddPermissionToUser from "./components/AddPermissionToUser/AddPermissionToUser";

export default function AdminPanel() {
    return (
        <Box display={"flex"} flexDirection={"column"} gap={1}>
            <CurrentSongCount />
            <Divider />
            <AddPermissionToUser />
            <Divider />
            <TurnOnGetter />
            <Divider />
            <GetToken />
        </Box>
    );
}
