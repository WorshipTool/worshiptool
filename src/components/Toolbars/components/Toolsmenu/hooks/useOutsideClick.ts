import React from "react";

export default function useOutsideClick (callback: ()=>void) {
  const ref = React.useRef();

  React.useEffect(() => {
    const handleClick = (event:any) => {
      //@ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [ref]);

  return ref;
};