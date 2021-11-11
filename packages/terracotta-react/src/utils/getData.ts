export interface GetDataPayload {
	host: string
	endpoint: string
	params?: Record<string, string | boolean | number>
	additionalHeaders?: Record<string, string>
}

const getData = async <T extends unknown>({
	host,
	endpoint,
	params = {},
	additionalHeaders = {},
}: GetDataPayload): Promise<T> => {
	const callUrl = `${host}${endpoint}`
	const queryParameters = Object.keys(params)
		.map((key, i) => `${i === 0 ? '?' : '&'}${key}=${String(params[key])}`)
		.join('')
	const response = await fetch(`${callUrl}${queryParameters}`, {
		...additionalHeaders,
	})
	return response.json()
}


export default getData
