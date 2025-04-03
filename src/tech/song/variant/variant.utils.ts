import { VariantPackAlias } from '@/types/song'

export const parseVariantAlias = (variantAlias: VariantPackAlias) => {
	const alias = variantAlias

	// Part before first -
	const hex = alias.split('-')[0]
	// Part after first - to the end
	const code = alias.split('-').slice(1).join('-')

	return { hex, alias: code }
}

export const makeVariantAlias = (hex: string, code: string) => {
	return `${hex}-${code}`
}
