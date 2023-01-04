export default interface song{
    title: string,
    alternativeTitles: string[],
    creators: {
        name: string, 
        type: string
    }[],
    variants: {
        sheet: string,
        preferredTitle: string
    }[]

    

}