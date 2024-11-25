import useAuth from '@/hooks/auth/useAuth'

export const useUserProfileImage = (userGuid?: string) => {
	const { info } = useAuth()
	if (userGuid !== info.guid) {
		return '/assets/profile-image-default.png'
	}

	return '/assets/profile-image-default.png'
	// info.pictureUrl ||
}
