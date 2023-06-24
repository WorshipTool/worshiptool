export const sectionNameToText = (name: string) => {
    const letter = (name.charAt(name.length-1) || "").toUpperCase();
    
    const postNumber = name.slice(0, name.length-1) || "";
    switch(letter){
        case 'V': return "Sloka " + postNumber;
        case 'R': return "Refrén " + postNumber;
        case 'B': return "Bridge " + postNumber

    }
    return name
}