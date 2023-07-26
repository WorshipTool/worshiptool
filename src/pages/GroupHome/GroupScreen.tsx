import GroupHome from "./GroupHome";
import { GroupProvider } from "./hooks/useGroup";


export default function GroupScreen() {


    return (
        <GroupProvider>
            <GroupHome/>
        </GroupProvider>
    )
}
