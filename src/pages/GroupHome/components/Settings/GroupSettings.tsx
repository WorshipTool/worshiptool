import { Box, Divider, LinearProgress, Typography } from "@mui/material";
import Card from "../../../../components/Card/Card";
import Gap from "../../../../components/Gap";
import { usePermission } from "../../../../hooks/auth/usePermission";
import useGroup from "../../../../hooks/group/useGroup";
import UsersPanel from "./UsersPanel";
import PinPlaylistPanel from "./components/PinPlaylist/PinPlaylistPanel";
import { PushPin } from "@mui/icons-material";

export default function GroupSettings() {
    const { guid } = useGroup();
    const isOwner = usePermission("GROUP_OWNER", guid);

    return isOwner === null ? (
        <LinearProgress />
    ) : !isOwner ? (
        <></>
    ) : (
        <Box
            sx={{
                padding: 5
            }}>
            <Card title="Nastavení skupiny">
                <Typography>
                    Tato skupina je veřejná. Kdokoliv může prohlížet její obsah.
                </Typography>
                <Typography>
                    {" "}
                    <strong>Ne ale každý může její obsah upravovat.</strong>
                </Typography>
                <Gap />
                <Divider />
                <Gap />
                <UsersPanel />
            </Card>
            <Gap />
            <PinPlaylistPanel />
        </Box>
    );
}
