import { useEffect } from "react";
import useGroup from "./useGroup";
import usePlaylist from "../playlist/usePlaylist";

interface useGroupSelectionI extends ReturnType<typeof usePlaylist>{
}

export default function useGroupSelection() : useGroupSelectionI{

    const {selectionGuid} = useGroup();
    const p = usePlaylist(selectionGuid);


    return p

}