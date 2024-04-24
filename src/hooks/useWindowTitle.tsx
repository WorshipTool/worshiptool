import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Titles = string[] | string;

const MAIN_TITLE = "Chval Otce";
const DIVIDER = " - ";
export const useWindowTitle = (titles?: Titles) => {
    const ctx: ReturnType<typeof useProvideWindowTitle> =
        useContext(titleContext);

    useEffect(() => {
        ctx.add(titles || []);
        return () => {
            ctx.remove(titles || []);
        };
    }, [titles]);

    return ctx;
};
const useProvideWindowTitle = () => {
    const [titles, setTitles] = useState<string[]>([MAIN_TITLE]);
    const add = (tls: Titles) => {
        setTitles((titles) => {
            const arr = Array.isArray(tls) ? tls : [tls];
            return [...titles, ...arr];
        });
    };

    const remove = (tls: Titles) => {
        setTitles((titles) => {
            const arr = Array.isArray(tls) ? tls : [tls];

            const newArr = [...titles];
            arr.forEach((title) => {
                const index = newArr.indexOf(title);
                if (index >= 0) {
                    newArr.splice(index, 1);
                }
            });
            return newArr;
        });
    };

    useEffect(() => {
        setWindowTitles(titles);
    }, [titles]);

    return {
        add,
        remove
    };
};

const titleContext = createContext(undefined as any);

export const WindowTitleProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const hook = useProvideWindowTitle();

    return (
        <titleContext.Provider value={hook}>{children}</titleContext.Provider>
    );
};

const setWindowTitles = (titles?: string[]) => {
    document.title =
        titles && titles.length > 0
            ? [...titles].reverse().join(DIVIDER)
            : MAIN_TITLE;
};
