import { line, section, segment } from "../models/song";


export default function convertSheetToSections(sheet: string) : section[]{
    let isOk = true;
    const sections: section[] = sheet.split("{").filter((partA, ia)=>{
      if(ia==0&&partA==="")return 0;
      return 1;
    }).map((partA, ia) => {
  
      const arrA: string[] = partA.split("}");
      
      if (ia==0&&arrA.length<2){ //situation when it doesnt begin with {
        arrA.splice(0, 0, "");
      }
  
      
      if (ia!=0&&arrA.length < 2) {
        isOk = false;
        return {};
      }

      let sectionText = "";
  
      const name = arrA[0];
      const lines: line[] = arrA[1]
      .split("\n")
      .map((partB) => {

        let lineText = "";
  
        const segments: segment[] = partB.split("[").map((partC, ib) => {
          const arrC = partC.split("]");
  
          if(ib==0){
            const segText = arrC[0].replaceAll(' ', '\u00A0');
            lineText += segText;
            return { text: segText};
          }else{
            if (ib!=0&&arrC.length < 2) {
              isOk = false;
              return {};
            }
          }
          const segText = arrC[1].replaceAll(' ', '\u00A0');
          lineText += segText;
          return { chord: arrC[0], text: segText};
        })
        
        sectionText += (sectionText!=""?"\n":"") + lineText;

        return { segments: segments, text: lineText};
      })
  
  
      return { name: name, lines: lines, text: sectionText }
    })
  
    return sections;
  }