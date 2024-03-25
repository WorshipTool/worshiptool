export const isSheetDataValid = (sheetData: string) => {
    if (!sheetData) return false;
    sheetData = sheetData.trim();
    return sheetData.length > 10 && sheetData.split("\n").length > 1;
};
