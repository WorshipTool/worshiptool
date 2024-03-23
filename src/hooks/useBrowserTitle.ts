import { useEffect } from "react";

export const useBrowserTitle = (titles?: string[]) => {
    useEffect(() => {
        setTitles(titles);
        return () => {
            setTitles([]);
        };
    }, [titles]);
    return setTitles;
};

const setTitles = (titles?: string[]) => {
    document.title =
        titles && titles.length > 0 ? titles.join(" | ") : "Chvalotce";
};
