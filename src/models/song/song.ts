
import { Creator } from "./creator"
import { Media } from "./media"
import { Variant } from "./variant"

export default interface Song{
    guid:string,
    title: string,
    creators: Creator[],
    variants: Variant[],
    media: Media[],
    tags: string[]

}
