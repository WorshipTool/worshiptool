import { chordData } from "@pepavlin/sheet-api/lib/models/chordData";
import { transposeChordData, transposeNote } from "@pepavlin/sheet-api/lib/utils/transpose";
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