'use client'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { useSmartParams } from '../../../../routes/useSmartParams'

const parsingMessages = [
	'Nahrávám soubor...',
	'Zpracovávám soubor...',
	'Snažím se přečíst soubor...',
	'Hledám píseň ve vašem souboru...',
]

const uploadingMessages = [
	'Nahrávám píseň...',
	'Přidávám píseň do databáze...',
	'Ukládám píseň...',
	'Ukládám píseň do databáze...',
]

export default SmartPage(Parse)
function Parse() {
	const { files } = useSmartParams('uploadParse')

	return <>{files}</>
}
