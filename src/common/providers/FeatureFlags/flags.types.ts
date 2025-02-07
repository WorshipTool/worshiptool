type ExistingFlags =
	| 'enable_file_parser'
	| 'enable_url_parser'
	| 'app_temporarily_unavailable'
	| 'enable_smart_search'

export type FeatureFlag = ExistingFlags | String
