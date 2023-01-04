import { BACKEND_URL, GETSONGBYGUID_URL } from "./constants";

export function getUrl_GETSONGBYGUD(guid:string){
    const generatedURL = BACKEND_URL + GETSONGBYGUID_URL.replace(":guid", guid);
    return generatedURL;
}