import usePlaylist from "../playlist/usePlaylist";
import useGroup from "./useGroup";

interface useGroupSelectionI extends ReturnType<typeof usePlaylist> {}

export default function useGroupSelection(): useGroupSelectionI {
    const { selectionGuid } = useGroup();

    const p = usePlaylist(selectionGuid);

    return p;
}
