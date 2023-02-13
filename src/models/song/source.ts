export enum SourceTypes{
    "Url"
}

export interface Source{
    type: SourceTypes,
    value: string
}