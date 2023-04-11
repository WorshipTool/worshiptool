import { chordData, transposeNote, note, notes, transposeChordData } from '@pepavlin/sheet-api';
import { useState } from "react";

export default function useTranspose(){
    const [offset, setOffset] = useState<number>(0);

    const getChord = (c: chordData) : chordData => {
        return transposeChordData(c, offset);
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