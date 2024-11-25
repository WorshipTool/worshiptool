import { ListItemText } from '@/common/ui/mui'

export default function NotValidWarning() {
	return (
		<ListItemText
			primary={'Neplatný obsah'}
			secondary={'Obsah musí být delší a mít alespoň dva řádky'}
		/>
	)
}
