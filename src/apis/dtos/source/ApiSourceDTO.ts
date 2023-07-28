import { SourceTypes } from "../../../interfaces/song/source";

export interface ApiSourceDTO{
    type: SourceTypes,
    value: string
}