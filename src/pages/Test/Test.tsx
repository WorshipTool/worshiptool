import React, { useEffect } from 'react'
import { SongsApi, SongsControllerGetByQueryKeyEnum } from '../../api/generated';
import { useApiState, useApiStateEffect } from '../../tech/ApiState';
import { handleApiCall } from '../../tech/handleApiCall';
import { useNavigate } from 'react-router-dom';

export default function Test() {
    const songsApi = new SongsApi();
    const navigate = useNavigate();

    const [] = useApiStateEffect(async ()=>{
        // return undefined;
        return undefined;
        return handleApiCall(songsApi.songsControllerGetByQuery(SongsControllerGetByQueryKeyEnum.Random))
    },[])

    return (
        <div>
            baf
            <button onClick={()=>{
                navigate("/")
            }}>click</button>
        </div>
    )
}
