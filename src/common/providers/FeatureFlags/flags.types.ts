type ExistingFlags =
	| 'enable_file_parser'
	| 'enable_url_parser'
	| 'app_temporarily_unavailable'
	| 'enable_smart_search'
	| 'show_loading_screen'
	| 'show_media_on_song_page'
	| 'allow_translation_likes'

export type FeatureFlag = ExistingFlags | String

type ExistingCloudNumbers = 'year'
export type CloudNumber = ExistingCloudNumbers | String
