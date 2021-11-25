export type Key = Record<'key', string>

export type DatasetKeyValue = string | boolean | number

export type Dataset = Record<string, DatasetKeyValue>

export type ResponseTypeKeys = Record<'keys', Key[]>

export interface ResponseTypeDatasets {
	datasets: Dataset[]
	limit: number
	page: number
}

export type GetDatasetsPayload = Record<
	string,
	DatasetKeyValue | DatasetKeyValue[]
>
