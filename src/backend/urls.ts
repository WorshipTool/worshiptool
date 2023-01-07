import { BACKEND_URL, GETSONGBYGUID_URL, GETSONGQUERY_URL, POSTNEWSONG_URL } from "./constants";
import { songGetQueryDTO } from "./dtos";

export function getUrl_GETSONGBYGUID(guid:string){
    const generatedURL = BACKEND_URL + GETSONGBYGUID_URL.replace(":guid", guid);
    return generatedURL;
}

export function getUrl_GETSONGSBYQUERY(query: songGetQueryDTO){
    const generatedURL = BACKEND_URL + GETSONGQUERY_URL + `?key=${query.key}&body=${query.body}&count=${query.count}`;
    return generatedURL;
}

export function getUrl_POSTNEWSONG(){
    const generatedURL = BACKEND_URL + POSTNEWSONG_URL;
    return generatedURL;
}