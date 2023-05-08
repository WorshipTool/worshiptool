import { LOGIN_URL, BACKEND_URL, GETSONGBYGUID_URL, GETSONGQUERY_URL, POSTNEWSONG_URL, SIGNUP_URL, VERIFYSONG_URL, UNVERIFYSONG_URL, DELETESONG_URL, GETUNVERIFIED_URL, GETLOADERUNVERIFIED_URL, GETSONGCOUNT_URL, GETSONGLIST_URL, POSTMERGESONGS_URL } from './constants';


export function getUrl_GETSONGBYGUID(guid:string){
    const generatedURL = BACKEND_URL + GETSONGBYGUID_URL.replace(":guid", guid);
    return generatedURL;
}


export function getUrl_ADDSONGDATA(){
    const generatedURL = BACKEND_URL + POSTNEWSONG_URL;
    return generatedURL;
}

export function getUrl_LOGIN(){
    const generatedURL = BACKEND_URL + LOGIN_URL;
    return generatedURL;
}

export function getUrl_SIGNUP(){
    const generatedURL = BACKEND_URL + SIGNUP_URL;
    return generatedURL;
}

export function getUrl_VERIFYVARIANT(guid:string){
    const generatedURL = BACKEND_URL + VERIFYSONG_URL.replace(":guid", guid);
    return generatedURL;
}

export function getUrl_UNVERIFYVARIANT(guid:string){
    const generatedURL = BACKEND_URL + UNVERIFYSONG_URL.replace(":guid", guid);
    return generatedURL;
}

export function getUrl_DELETEVARIANT(guid:string){
    const generatedURL = BACKEND_URL + DELETESONG_URL.replace(":guid", guid);
    return generatedURL;
}

export function getUrl_GETSONGCOUNT(){
    const generatedURL = BACKEND_URL + GETSONGCOUNT_URL;
    return generatedURL;
}

export function getUrl_GETSONGLIST(page: number){
    const generatedURL = BACKEND_URL + GETSONGLIST_URL + `?page=${page}`;
    return generatedURL;
}

export function getUrl_POSTMERGESONGS(){
    const generatedURL = BACKEND_URL + POSTMERGESONGS_URL
    return generatedURL;
}



