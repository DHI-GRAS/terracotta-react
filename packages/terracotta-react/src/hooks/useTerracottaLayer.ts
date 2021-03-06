import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { PickInfo } from 'deck.gl'

import { TileLayerProps } from '@deck.gl/geo-layers/src/tile-layer/tile-layer'

type Payload<T> = TileLayerProps<T>
type DatasetType = Record<string, string | boolean | number>
export interface TerracottaProps<T> extends Payload<T> {
	id: string
	url: string
	datasets?: DatasetType[] | DatasetType
	type?: 'singleband' | 'rgb'
	queryString?: string
	onClick?: (pickInfo: PickInfo<string>) => void
}

const useTerracotta = ({
	id,
	url,
	datasets = undefined,
	type = 'singleband',
	queryString = undefined,
	...otherProps
}: TerracottaProps<unknown>): TileLayer<string>[] | undefined => {
	if (datasets?.length > 0) {
		// todo handle dataset without array
		const localDatasets = Array.isArray(datasets) ? datasets : [datasets]
		return localDatasets.map((dataset, i) => {
			let datasetCopy = { ...dataset }
			if (type === 'rgb') {
				const { band, ...rest } = datasetCopy
				datasetCopy = rest
			}
			const keysStructure = Object.keys(datasetCopy)
				.map((key) => `${String(datasetCopy[key])}/`)
				.join('')

			const localUrl = `${url}/${type}/${keysStructure}{z}/{x}/{y}.png${
				queryString ? `?${queryString}` : ''
			}`

			return new TileLayer({
				id: `${id}-${i}`,
				data: localUrl,
				pickable: true,
				minZoom: 0,
				maxZoom: 19,
				tileSize: 256,
				...otherProps,
				renderSubLayers: (props) => {
					const {
						bbox: { west, south, east, north },
					} = props.tile

					return new BitmapLayer(props, {
						data: null,
						image: props.data,
						bounds: [west, south, east, north],
					})
				},
			})
		})
	}
	return undefined
}

export default useTerracotta
