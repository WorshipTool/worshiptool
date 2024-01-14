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
    setUrl(emurl);
  },[src])

  return (
    <div style={{
        position: "relative",
        maxWidth: 560,
        // height: 315,
    }}>
        <img src="http://placehold.it/16x9" alt="16:9 Image" style={{
            width: "100%",
            height: "auto",
            display: "block"
        }} />
        <iframe 
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            }}
            width="100%" 
            height="100%" 
            src={url}
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen></iframe>
    </div>
  )
}
