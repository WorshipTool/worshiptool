import { Box } from '@/common/ui/Box'
import { SxProps } from '@/common/ui/mui'
import { useTheme } from '@/common/ui/tech'
import { useResponsiveValue } from '@/common/ui/tech/useResponsiveValue'
import { ResponsiveStyleValue } from '@mui/system'
import { ReactElement } from 'react'
import { Masonry as M } from 'react-masonry'

type MasonryProps = {
	children?: ReactElement[]
	columns?: ResponsiveStyleValue<number>
	sx?: SxProps
	spacing?: number
}

export const Masonry = ({
	columns = 1,
	spacing = 1,
	...props
}: MasonryProps) => {
	const theme = useTheme()

	const columnsCount = useResponsiveValue(columns)
	const columnWidth = 100 / columnsCount
	const itemPadding = spacing / 2

	const fixMargin = `-${theme.spacing(spacing / 2)}`

	return (
		<Box sx={props.sx}>
			<M
				enterOneAfterAnother
				transition={'fade'}
				style={{
					width: `calc(100% + ${theme.spacing(spacing)})`,
					marginLeft: fixMargin,
					marginTop: fixMargin,
				}}
			>
				{props.children?.map((c, index) => (
					<Box key={c.key} width={`${columnWidth}%`}>
						<Box padding={itemPadding}>{c}</Box>
					</Box>
				))}
			</M>
		</Box>
	)
}
