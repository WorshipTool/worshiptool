describe('Every page.tsx exports SmartPage', () => {
	const glob = require('glob')
	const path = require('path')
	// Check if every file named page.tsx exports SmartPage

	const files = glob.sync('src/**/page.tsx')
	files.forEach((file) => {
		const filePath = path.resolve(file)
		let page
		try {
			page = require(filePath)
		} catch (e) {
			return
		}

		const defaultExport = page.default

		const functionName = defaultExport?.name

		test(`${filePath} exports SmartPage`, () => {
			expect(functionName).toBeDefined()
			expect(functionName).toBe('SmartPageFunctionName')
		})
	})
})
