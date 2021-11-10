import React, {
	createContext,
	FC,
	useState,
	ReactNode,
	useEffect,
	useCallback,
} from 'react'
import getData from '../utils/getData'
import { Key } from './types'

interface TerracottaContextProviderValues {
	state: {
		keys: Key[] | undefined
		isLoading: boolean
	}
	actions: {
		setKeys: (k: Key[] | undefined) => void
		setIsLoading: (l: boolean) => void
	}
}

type Context = TerracottaContextProviderValues

export const TerracottaContext = createContext<Context>(null)

interface Props {
	children: ReactNode
	host: string
}

const TerracottaContextProvider: FC<Props> = ({ children, host }) => {
	const [keys, setKeys] = useState<Key[] | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(false)

	const handleKeys = useCallback(async () => {
		try {
			setIsLoading(true)
			const response = await getData({
				host,
				endpoint: '/keys',
			})
			setKeys(response.keys as Key[])
		} catch (err) {
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}, [host])

	useEffect(() => {
		void handleKeys()
	}, [handleKeys])

	return (
		<TerracottaContext.Provider
			value={{
				state: {
					isLoading,
					keys,
				},
				actions: {
					setKeys,
					setIsLoading,
				},
			}}
		>
			{children}
		</TerracottaContext.Provider>
	)
}

export default TerracottaContextProvider
