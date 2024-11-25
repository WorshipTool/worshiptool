'use client'
import { Box } from '@/common/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Snowfall from 'react-snowfall'
import { useSmartMatch } from '../../routes/useSmartMatch'
import OnScrollComponent from '../providers/OnScrollComponent/OnScrollComponent'

const imagesName = ['y', 'i', 'p', 'k']

export default function Snow() {
	const [images, setImages] = useState<HTMLImageElement[]>([])
	useEffect(() => {
		const images = imagesName.map((name) => {
			const snowflake1 = document.createElement('img')
			snowflake1.src = `/assets/flakes/${name}.png`
			return snowflake1
		})
		setImages(images)
	}, [])

	const isHome = useSmartMatch('home')
	const [top, setTop] = useState(true)

	const [blur, setBlur] = useState(0)

	return (
		<Box displayPrint={'none'}>
			<OnScrollComponent
				onChange={(top, y) => {
					const level = Math.min(1, Math.pow(y / 100, 3))
					setBlur(level * 10)
				}}
			/>
			<AnimatePresence>
				<motion.div
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
					}}
				>
					{isHome && (
						<Snowfall
							snowflakeCount={30}
							speed={[0.2, 1]}
							color="#0085FF44"
							images={images}
							radius={[5, 15]}
							style={{
								zIndex: -100,
								opacity: 0.8,
								filter: `blur(${blur}px)`,

								transition: 'all 0.1s ',
								position: 'fixed',
								top: 0,
							}}
						/>
					)}
				</motion.div>
			</AnimatePresence>
		</Box>
	)
}
