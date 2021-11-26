import { Polygon } from 'geojson'

export type Key = Record<'key', string>

export type DatasetKeyValue = string | boolean | number

export type Dataset = Record<string, DatasetKeyValue>

export type ResponseTypeKeys = Record<'keys', Key[]>

export interface ResponseTypeDatasets {
	datasets: Dataset[]
	limit: number
	page: number
}

export type MessageResponse = {
	message: string
}

export interface ResponseTypeMetadata {
	keys: Dataset
	bounds: number[]
	convex_hull: Polygon
	valid_percentage: number
	range: number
	mean: number
	stdev: number
	percentiles: number[]
	metadata: Dataset
}

export type ResponseTypeMetadataWithMessage =
	| MessageResponse
	| ResponseTypeMetadata

export type GetMetadataPayload = Dataset

export type GetDatasetsPayload = Record<
	string,
	DatasetKeyValue | DatasetKeyValue[]
>
