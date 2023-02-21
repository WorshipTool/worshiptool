import { useEffect, useState } from "react";
import { RequestResult, isSuccess } from "../backend/dtosRequestResult";

interface resultProps<T>{
    result: RequestResult<any>, 
    data: T[]
}

export const countPerPage = 10;

export default function usePagination<T>( func:(page:number, resolve:(result: resultProps<T>)=>void)=>void){
    const [lastPage, setLastPage] = useState(-1);
    const [array, setArray] = useState<T[]>([]);
    const [nextExists, setNextExists] = useState(true);


    const loadPage = async (page: number, replace?: boolean) => {
        const result : resultProps<T> = await new Promise((res, reject) => {
            func(page,(d)=>{
                res(d);
            });
        });
        if(isSuccess(result.result)){
            const continues = result.data.length>countPerPage;
            const newData = result.data.slice(0, countPerPage);
            setNextExists(continues);

            if((replace!=undefined&&replace)||lastPage==-1){
                setArray(newData);
            }else{
                setArray([...array, ...newData]);
            }
            setLastPage(page);
        }
    }

    const nextPage = () => {
        return loadPage(lastPage+1, false);
    }


    return {
        loadPage, nextPage,
        data: array,
        nextExists
    }
}


