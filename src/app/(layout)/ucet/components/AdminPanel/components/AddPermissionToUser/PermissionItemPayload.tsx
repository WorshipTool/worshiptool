import { Box, NativeSelect, Typography } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { SkeletonLoader } from '../../../../../../../common/providers/SkeletonLoader'
import { useGroups } from '../../../../../../../hooks/group/useGroups'
import {
	PermissionPayloadType,
	PermissionType,
	PermissionsTypes,
} from '../../../../../../../hooks/permissions/permission.types'
import { useApiStateEffect } from '../../../../../../../tech/ApiState'

type PermissionItemPayloadProps<T extends PermissionType> = {
	type: T
	editable?: boolean
	value?: PermissionPayloadType<PermissionsTypes, T>
	onChange?: (value: PermissionPayloadType<PermissionsTypes, T>) => void
}

export default function PermissionItemPayload<T extends PermissionType>(
	props: PermissionItemPayloadProps<T>
) {
	const group = useGroups()
	const containsGroup = useMemo(
		() => props.type.includes('GROUP'),
		[props.type]
	)
	const [groupState] = useApiStateEffect(async () => {
		if (containsGroup && props.value?.trim() != '')
			return group.getInfoByGuid(props.value as string)
	})

	const [groupListState] = useApiStateEffect(async () => {
		if (containsGroup && props.editable) return group.getAllGroups()
	}, [props.editable])

	useEffect(() => {
		if (groupListState.data) props.onChange?.(groupListState.data?.[0]?.guid)
	}, [props.editable, groupListState.data])

	return (
		<>
			{props.editable ? (
				<>
					{containsGroup && (
						<SkeletonLoader
							data={[groupListState]}
							render={() => (
								<>
									<NativeSelect
										defaultValue={groupListState.data?.[0]?.guid}
										onChange={(e) => {
											props.onChange?.(e.target.value)
										}}
									>
										{groupListState.data?.map((g) => (
											<option key={g.guid} value={g.guid}>
												{g.name}
											</option>
										))}
									</NativeSelect>
								</>
							)}
							renderLoading={() => (
								<>
									<Typography>Načítání...</Typography>
								</>
							)}
						/>
					)}
				</>
			) : (
				<>
					{containsGroup && (
						<Box display={'flex'} flexDirection={'row'} gap={1}>
							<Typography>
								<b>Skupina</b>
							</Typography>
							<SkeletonLoader
								data={[groupState]}
								render={() => (
									<>
										<Typography>{groupState.data?.name}</Typography>
									</>
								)}
								renderLoading={() => (
									<>
										<Typography>Načítání...</Typography>
									</>
								)}
							/>
						</Box>
					)}
				</>
			)}
		</>
	)
}
