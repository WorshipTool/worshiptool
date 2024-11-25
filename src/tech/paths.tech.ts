export const getIconUrl = (icon: string) => {
	return getAssetUrl(`/icons/${icon}`)
}

export const getAssetUrl = (asset: string) => {
	if (asset.startsWith('/')) asset = asset.substring(1)
	return `/assets/${asset}`
}
