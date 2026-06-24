import { act, renderHook } from '@testing-library/react'
import { useApiState } from '../useApiState'

describe('useApiState silent refresh', () => {
	it('does not toggle loading or clear data during a silent fetch', async () => {
		const { result } = renderHook(() => useApiState<number>())

		// Seed initial data with a normal fetch.
		await act(async () => {
			await result.current.fetchApiState(async () => 1)
		})
		expect(result.current.apiState.data).toBe(1)

		// Silent refetch: while in-flight, loading stays false and data is kept.
		let resolve: (v: number) => void = () => {}
		const pending = new Promise<number>((r) => (resolve = r))
		act(() => {
			result.current.fetchApiState(async () => pending, undefined, {
				silent: true,
			})
		})
		expect(result.current.apiState.loading).toBe(false)
		expect(result.current.apiState.data).toBe(1)

		await act(async () => {
			resolve(2)
			await pending
		})
		expect(result.current.apiState.data).toBe(2)
	})

	it('still toggles loading for a non-silent fetch', async () => {
		const { result } = renderHook(() => useApiState<number>())
		let resolve: (v: number) => void = () => {}
		const pending = new Promise<number>((r) => (resolve = r))
		act(() => {
			result.current.fetchApiState(async () => pending)
		})
		expect(result.current.apiState.loading).toBe(true)
		await act(async () => {
			resolve(9)
			await pending
		})
		expect(result.current.apiState.loading).toBe(false)
	})
})
