import React, {
	createContext,
	FC,
	useState,
	ReactNode,
	useEffect,
	useCallback,
} from 'react'
import getData from '../utils/getData'
import {
	Key,
	ResponseTypeKeys,
	ResponseTypeDatasets,
	GetDatasetsPayload,
	Dataset,
	ResponseTypeMetadata,
	ResponseTypeMetadataWithMessage,
	MessageResponse,
} from './types'

interface TerracottaContextProviderValues {
	state: {
		keys: Key[] | undefined
		isLoading: boolean
	}
	actions: {
		setKeys: (k: Key[] | undefined) => void
		setIsLoading: (l: boolean) => void
		getDatasets: (p: GetDatasetsPayload) => Promise<ResponseTypeDatasets>
		getMetadata: (p: Dataset) => Promise<ResponseTypeMetadata>
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
			const response = await getData<ResponseTypeKeys>({
				host,
				endpoint: '/keys',
			})
			setKeys(response.keys as Key[])
		} catch (err) {
			console.error(err) // eslint-disable-line no-console
		} finally {
			setIsLoading(false)
		}
	}, [host])

	const getDatasets = useCallback(
		async (payload: GetDatasetsPayload) => {
			try {
				setIsLoading(true)
				return await getData<ResponseTypeDatasets>({
					host,
					endpoint: '/datasets',
					params: payload,
				})
			} catch (err) {
				throw Error(String(err))
				// console.error(err) // eslint-disable-line no-console
			} finally {
				setIsLoading(false)
			}
		},
		[host],
	)

	const getMetadata = useCallback(
		async (payDataset: Dataset): Promise<ResponseTypeMetadata> => {
			try {
				setIsLoading(true)
				const metadataUrl = Object.keys(payDataset)
					.map((datasetKey) => `/${String(payDataset[datasetKey])}`)
					.join('')
				const response = await getData<ResponseTypeMetadataWithMessage>({
					host,
					endpoint: `/metadata${metadataUrl}`,
				})

				if ((response as MessageResponse).message) {
					throw Error(String((response as MessageResponse).message))
				}

				return response as ResponseTypeMetadata
			} catch (err) {
				throw Error(String(err))
				// console.error(err) // eslint-disable-line no-console
			} finally {
				setIsLoading(false)
			}
		},
		[host],
	)

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
					getDatasets,
					getMetadata,
				},
			}}
		>
			{children}
		</TerracottaContext.Provider>
	)
}

export default TerracottaContextProvider
