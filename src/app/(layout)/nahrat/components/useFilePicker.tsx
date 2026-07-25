'use client'

import { useRef } from 'react'
import UploadFileInput from './UploadFileInput'

/**
 * The hidden file input plus the handle that opens it.
 *
 * Shared by the desktop drop panel and the phone hero — those two present the
 * upload differently on purpose (drag-and-drop vs camera-first), but the picker
 * itself is the same in both, and it's the part with the sharp edges (resetting
 * the input value so re-picking the same file still fires).
 *
 * Render `input` anywhere in the tree and call `open()` from your own button.
 */
export function useFilePicker(onUpload?: (files: File[]) => void) {
	const inputRef = useRef<HTMLInputElement>(null)

	return {
		open: () => inputRef.current?.click(),
		input: <UploadFileInput inputRef={inputRef} onUpload={onUpload} />,
	}
}
