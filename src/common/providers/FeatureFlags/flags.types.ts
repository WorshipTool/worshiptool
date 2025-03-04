type ExistingFlags =
	| 'enable_file_parser'
	| 'enable_url_parser'
	| 'app_temporarily_unavailable'
	| 'enable_smart_search'
	| 'show_loading_screen'

export type FeatureFlag = ExistingFlags | String
