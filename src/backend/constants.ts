export const BACKEND_URL = process.env.NODE_ENV !== 'production'
                            ?"http://localhost:3300/"
                            :"http://chvalotce.cz:3300/";

export const GETSONGBYGUID_URL = "songs/data/:guid";
export const POSTNEWSONG_URL = "songs";
export const GETSONGQUERY_URL = "songs";
export const GETSONGSEARCH_URL = "songs/search";
export const GETSONGLIST_URL = "songs/list";
export const GETUNVERIFIED_URL = "songs/unverified";
export const GETLOADERUNVERIFIED_URL = "songs/loaderunverified";
export const VERIFYSONG_URL = "songs/variant/verify/:guid"
export const UNVERIFYSONG_URL = "songs/variant/unverify/:guid"
export const DELETESONG_URL = "songs/variant/delete/:guid"
export const GETSONGCOUNT_URL = "songs/count";

export const LOGIN_URL = "auth/login";
export const SIGNUP_URL = "auth/signup";
