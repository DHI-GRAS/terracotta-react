import { useContext } from 'react'
import { TerracottaContext } from '../provider/TerracottaProvider'
import { Key, GetDatasetsPayload } from '../provider/types'

export interface UseTerracottaReturn {
	keys: Key[] | undefined
	isLoading: boolean
	getDatasets: (p: GetDatasetsPayload | undefined) => Promise<void>
}

const useTerracotta = (): UseTerracottaReturn => {
	const {
		state: { keys, isLoading },
		actions: { getDatasets },
	} = useContext(TerracottaContext)

	return {
		keys,
		isLoading,
		getDatasets,
	}
}

export default useTerracotta
