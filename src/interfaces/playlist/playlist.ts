import { VariantDTO } from "../variant/VariantDTO";

export default interface Playlist{
    guid: string,
    title: string,
    variants: VariantDTO[]
}