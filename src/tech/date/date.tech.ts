export const isDateTodayOrInFuture = (date: Date, now?: Date): boolean => {
	now = now || new Date()
	date.setHours(0, 0, 0, 0)
	now.setHours(0, 0, 0, 0)
	return date >= now
}

export const isDateToday = (date: Date, now?: Date): boolean => {
	now = now || new Date()
	date.setHours(0, 0, 0, 0)
	now.setHours(0, 0, 0, 0)
	return date.getTime() === now.getTime()
}

export const isDateTomorrow = (date: Date, now?: Date): boolean => {
	now = now || new Date()
	now.setDate(now.getDate() + 1)
	return isDateToday(date, now)
}
