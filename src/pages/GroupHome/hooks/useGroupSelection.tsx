import { useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import usePlaylist from "../../../hooks/playlist/usePlaylist";
import useGroup from "./useGroup";

interface useGroupSelectionI{
    variants: VariantDTO[],
}

export default function useGroupSelection() : useGroupSelectionI{

    const {selectionGuid} = useGroup();
    const {variants} = usePlaylist(selectionGuid);


    return {
        variants
    }

}