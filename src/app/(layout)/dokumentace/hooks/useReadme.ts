import { promises as fs } from 'fs'
const readmeUrl = '/documentation.md'

export const getReadmeRawData = async () => {
	const data = await fs.readFile(process.cwd() + '/public' + readmeUrl, 'utf8')
	return data
}
