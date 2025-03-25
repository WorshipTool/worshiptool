import { PackTranslationType, SongLanguage } from '@/types/song'

export const getTranslationData = (
	type: PackTranslationType,
	language?: SongLanguage
): {
	color?: string
	message?: string
} => {
	switch (language) {
		case 'cs':
			switch (type) {
				case PackTranslationType.Original:
					return {
						color: 'success.main',
						message: 'Český originál',
					}
				case PackTranslationType.OfficialTranslation:
					return {
						color: 'error.light',
						message: 'Oficiální český překlad',
					}
				case PackTranslationType.Translation:
					return {
						color: 'secondary.main',
						message: 'Český překlad',
					}
			}
		default:
			switch (type) {
				case PackTranslationType.Original:
					return {
						color: 'primary.main',
						message: 'Originál',
					}
				case PackTranslationType.OfficialTranslation:
				case PackTranslationType.Translation:
					return {
						color: 'primary.light',
						message: 'Překlad',
					}
				default:
					return {}
			}
	}
}
