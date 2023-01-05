export default interface song{
    title: string,
    alternativeTitles: string[],
    creators: {
        name: string, 
        type: string
    }[],
    variants: {
        sheet: string,
        sheetText: string,
        sections: section[],
        preferredTitle: string
    }[]
}

export interface segment {
    chord?: string,
    text?: string
}
export interface line {
    segments: segment[],
    text? : string
}
export interface section {
    name?: string,
    lines?: line[],
    text? : string
}