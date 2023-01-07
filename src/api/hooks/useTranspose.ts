import { useState } from "react";
import chord from "../models/chord"
import { note, notes } from "../models/note"

export default function useTranspose(){
    const [offset, setOffset] = useState<number>(0);

    const transposeNote = (n: note, offset: number):note => {
        let index =(notes.indexOf(n) + offset) % notes.length;
        if(index<0)index+=notes.length;
        return notes[index];
    }

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