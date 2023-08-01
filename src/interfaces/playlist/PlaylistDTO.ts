import { note } from "@pepavlin/sheet-api";
import { VariantDTO } from "../variant/VariantDTO";

export default interface PlaylistDTO{
    guid: string,
    title: string,
    items: PlaylistItemDTO[]
}

export interface PlaylistItemDTO{
    guid: string,
    toneKey: note,
    order: number,
    variant: VariantDTO
}