/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: 'nodeee',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
}
