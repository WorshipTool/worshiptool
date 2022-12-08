import { IDBAllSongData } from "./interfaces";
import Variant from "./Variant";

interface ICreator{
    name:string,
    type:string
}

export default class Song{
    name = "";
    creators : ICreator[] = [];
    variants: Variant[] = [];

    

}
export const CreateSongFromIDBAll = (data: IDBAllSongData) : Song => {
    const s = new Song();
    s.name = data.song.name;
    s.creators = [];
    data.creators.forEach((c)=>{
        const creator : ICreator = {name: c.creator.name, type: c.link.type}
        s.creators.push(creator);
    })

    
    s.variants = [];
    data.variants.map((v)=>{
        const variant : Variant = new Variant();
        variant.sheet = v.sheet;
        s.variants.push(variant);
    })

    return s;
}