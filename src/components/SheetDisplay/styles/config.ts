import { Sheet } from "@pepavlin/sheet-api";
import DefaultStyle from "./DefaultStyle";
import ExperimentalStyle from "./ExperimentalStyle";

export type SheetStyle = "default"|"experimental";
export interface SheetStyleComponentProps{
    sheet: Sheet,
    title?: string

}
export type SheetStyleComponentType = (props: SheetStyleComponentProps) => JSX.Element;

export const sheetStyles : {[style in SheetStyle]:SheetStyleComponentType}  = {
    ["default"] : DefaultStyle,
    ["experimental"]: ExperimentalStyle
}