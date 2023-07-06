import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const groupContext = createContext<useProvideGroupI>({} as useProvideGroupI);

export default function useGroup(){
    return useContext(groupContext);
}

export const GroupProvider = ({children}:{children:any}) => {
    const auth = useProvideGroup();
    return <groupContext.Provider value={auth}>{children}</groupContext.Provider>
}

interface useProvideGroupI{
    shortName: string,
    fullName: string,
    urlName: string,
    longerName: string,
    logoUrl: string
} 

export const useProvideGroup = () : useProvideGroupI => {
    return {
        shortName: "CB 13ka",
        longerName: "CB Třináctka",
        fullName: "Církev bratrská na Praze 13",
        urlName: "13ka",
        logoUrl: "/static/assets/13ka-icon.png"

    }
}