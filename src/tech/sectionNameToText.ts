export const sectionNameToText = (name: string) => {
    const letter = (name.charAt(0) || "").toUpperCase();
    
    const postNumber = name.slice(1, name.length) || "";
    switch(letter){
        case 'V': return "Sloka " + postNumber;
        case 'R': return "Refrén " + postNumber;
        case 'B': return "Bridge " + postNumber

    }
    return name
}