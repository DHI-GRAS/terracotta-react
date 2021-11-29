import { useContext } from 'react'
import { TerracottaContext } from '../provider/TerracottaProvider'
import {
	Key,
	GetDatasetsPayload,
	ResponseTypeDatasets,
	Dataset,
	ResponseTypeMetadata,
} from '../provider/types'

export interface UseTerracottaReturn {
	keys: Key[] | undefined
	isLoading: boolean
	getDatasets: (
		p: GetDatasetsPayload | undefined,
	) => Promise<ResponseTypeDatasets>
	getMetadata: (p: Dataset) => Promise<ResponseTypeMetadata>
}

const useTerracotta = (): UseTerracottaReturn => {
	const {
		state: { keys, isLoading },
		actions: { getDatasets, getMetadata },
	} = useContext(TerracottaContext)

	return {
		keys,
		isLoading,
		getDatasets,
		getMetadata,
	}
}

export default useTerracotta
