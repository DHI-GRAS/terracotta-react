import { useContext } from 'react'
import { TerracottaContext } from '../provider/TerracottaProvider'
import { Key } from '../provider/types'

export interface UseTerracottaReturn {
	keys: Key[] | undefined
	isLoading: boolean
}

const useTerracotta = (): UseTerracottaReturn => {
	const {
		state: { keys, isLoading },
	} = useContext(TerracottaContext)

	return {
		keys,
		isLoading,
	}
}

export default useTerracotta
