interface GetDataPayload {
	host: string
	endpoint: string
	params?: Record<string, string | boolean | number>
	additionalHeaders?: Record<string, string>
}

export default async ({
	host,
	endpoint,
	params = {},
	additionalHeaders = {},
}: GetDataPayload): Promise<unknown> => {
	const callUrl = `${host}${endpoint}`
	const queryParameters = Object.keys(params)
		.map((key, i) => `${i === 0 ? '?' : '&'}${key}=${String(params[key])}`)
		.join('')
	const response = await fetch(`${callUrl}${queryParameters}`, {
		...additionalHeaders,
	})
	return response.json()
}
