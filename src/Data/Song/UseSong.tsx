import { useEffect, useState } from "react";
import Song from "./Song";

interface IUseSong{
    getName: ()=> string
}

export const useSong = (guid: string) : IUseSong => {
    const [song, setSong] = useState<Song>();

    useEffect(()=>{

    })
    const getName = () => {
        return "Noname jet here";
    }

    return {getName:getName};
}