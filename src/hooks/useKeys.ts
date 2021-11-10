import { useContext } from 'react'
import { TerracottaContext } from 'provider/TerracottaProvider'
import { Key } from 'provider/types'

const useKeys = (): Key[] | undefined => {
	const {
		state: { keys },
	} = useContext(TerracottaContext)

	return keys
}

export default useKeys
