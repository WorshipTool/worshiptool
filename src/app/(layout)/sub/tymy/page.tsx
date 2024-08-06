'use client'

import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'

export default SmartPage(Page, {
	transparentToolbar: true,
})

function Page() {
	return <div>Tymuju tady</div>
}
