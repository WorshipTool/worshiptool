import React from 'react'

interface DragAndDropProps {
    children: React.ReactNode 
    onDragOver?: ()=>void,
    onDragLeave?: ()=>void,
    onDrop?: (files: File[])=>void,
    accept?: string[],
}

export default function DragAndDrop(props: DragAndDropProps) {
    const [draggingOver, setDraggingOver] = React.useState(false);

    const getFilteredFiles = (files: FileList) => {
        const filteredFiles: File[] = [];
        for(let i = 0; i < files.length; i++){
            const file = files[i];
            if(!props.accept || props.accept.includes(file.type)){
                filteredFiles.push(file);
            }
        }
        return filteredFiles;
    }

    const onDragOver = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingOver(true);

        if(props.onDragOver) props.onDragOver();
    }

    const onDragLeave = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingOver(false);

        if(props.onDragLeave) props.onDragLeave();
    }

    const onDrop = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingOver(false);

        const files = getFilteredFiles(e.dataTransfer.files);
        if(files.length && props.onDrop) props.onDrop(files);
    }

    return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      {props.children}
    </div>
  )
}
