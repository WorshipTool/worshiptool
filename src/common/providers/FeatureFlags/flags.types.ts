type ExistingFlags =
	| 'enable_file_parser'
	| 'enable_url_parser'
	| 'app_temporarily_unavailable'

export type FeatureFlag = ExistingFlags | String
