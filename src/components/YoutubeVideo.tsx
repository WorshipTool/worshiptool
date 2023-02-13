import React, { useEffect, useState } from 'react'
import useYoutube from '../hooks/useYoutube'

export default function YoutubeVideo({src}: {src:string}) {
  const [url, setUrl] = useState("");
  const {getEmbedUrl, getId} = useYoutube();
  useEffect(()=>{
    const id = getId(src);
    if(id===null){
      console.log("Invalid youtube url.");
      return;
    }
    const emurl = getEmbedUrl(id);
    console.log(emurl);
    setUrl(emurl);
  },[src])

  return (
    <div>
        <iframe 
            width="560" 
            height="315" 
            src={url}
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen></iframe>
    </div>
  )
}
