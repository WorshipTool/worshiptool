import React, { useRef } from 'react'

export interface UploadFileInputProps{
    inputRef?: React.RefObject<HTMLInputElement>,
    onUpload?: (files: File[]) => void;
}

export default function UploadFileInput(props: UploadFileInputProps) {
    const handleFileChange = () => {

        //@ts-ignore
        const files = props.inputRef.current.files;
        if(!files || files.length === 0) return;
        
        props.onUpload?.(Array.from(files));
    }
  return (
    <>
      <input
            style={{display: 'none'}}
            ref={props.inputRef}
            type="file"
            name='file'
            onChange={handleFileChange}
            multiple
            accept='image/*'
        />
    </>
  )
}
