import { IDBAllSongData } from "../database/interfaces";

interface ICreator{
    name:string,
    type:string
}
export class Variant{
    sheet = "";
    name = "variant name not found";
}

export default class Song{
    name = "";
    guid = "";
    alternativeNames : string[] = []; 
    creators : ICreator[] = [];
    variants: Variant[] = [];

    

}
export const CreateSongFromIDBAll = (data: IDBAllSongData) : Song => {
    const s = new Song();
    s.guid = data.song.guid;
    const nameFound = data.names.find((name)=>{
        return name.guid==data.song.mainNameGUID;
    });
    if(nameFound!=undefined){
        s.name = nameFound.name;
    }else{
        s.name = "Name not found.";
    }

    s.creators = [];
    // data.creators.forEach((c)=>{
    //     const creator : ICreator = {name: c.creator.name, type: c.link.type}
    //     s.creators.push(creator);
    // })

    
    s.variants = [];
    data.variants.map((v)=>{
        const variant : Variant = new Variant();
        variant.sheet = v.sheet;
        const nameFound = data.names.find((name)=>{
            return name.guid == v.mainNameGUID;
        })
        if(nameFound){
            variant.name = nameFound.name;
        }

        s.variants.push(variant);
    })

    return s;
}