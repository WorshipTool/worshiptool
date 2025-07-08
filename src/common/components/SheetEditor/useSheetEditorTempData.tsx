export const useSheetEditorTempData = (disable: boolean) => {
	if (disable)
		return {
			title: '',
			sheetData: '',
		}
	return {
		title: 'Example',
		sheetData: `{S}Zkousim [C]hustou vec
Snad to postaci

{R}Dulezite [E]ale rict
Ver Bohu`,
	}
}
