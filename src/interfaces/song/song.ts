
import { Creator } from "./creator"
import { Media } from "./media"
import { VariantDTO } from "../variant/VariantDTO"

export default interface Song{
    guid:string,
    title: string,
    creators: Creator[],
    variants: VariantDTO[],
    media: Media[],
    tags: string[]

}
