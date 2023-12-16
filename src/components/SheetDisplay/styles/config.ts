import { Sheet } from "@pepavlin/sheet-api";
import DefaultStyle from "./DefaultStyle";
import ExperimentalStyle from "./ExperimentalStyle";
import ModernStyle from "./ModernStyle";
import { signature } from "@pepavlin/sheet-api/lib/models/note";

export type SheetStyle = "default"|"experimental"| "modern";
export interface SheetStyleComponentProps{
    sheet: Sheet,
    title?: string,
    signature?: signature,

}
export type SheetStyleComponentType = (props: SheetStyleComponentProps) => JSX.Element;

export const sheetStyles : {[style in SheetStyle]:SheetStyleComponentType}  = {
    ["default"] : DefaultStyle,
    ["experimental"]: ExperimentalStyle,
    ["modern"]: ModernStyle
}