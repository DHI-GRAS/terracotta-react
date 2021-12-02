import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import { TileLayerProps } from '@deck.gl/geo-layers/src/tile-layer/tile-layer'

export type RasterLayer<T> = TileLayerProps<T>

const useRasterLayer = ({
	...otherProps
}: RasterLayer<unknown>): TileLayer<unknown> =>
	new TileLayer({
		minZoom: 0,
		pickable: true,
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

export default useRasterLayer
