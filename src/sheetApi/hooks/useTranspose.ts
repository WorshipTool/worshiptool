import { chord, note, notes } from "@pepavlin/sheet-api";
import { useState } from "react";

export const transposeNote = (n: note, offset: number):note => {
    let index =(notes.indexOf(n) + offset) % notes.length;
    if(index<0)index+=notes.length;
    return notes[index];
}
export default function useTranspose(){
    const [offset, setOffset] = useState<number>(0);

    const getChord = (c: chord) : chord => {
        return {...c, 
            rootNote: transposeNote(c.rootNote, offset)
        }
    }

    const transpose = (add:number) => {
        setOffset(offset+add);
    }

    return {
        getChord,
        transpose,
        transposeNote,
        setTransposeOffset: setOffset,
        getTransposeOffset: ()=>offset
    }
}