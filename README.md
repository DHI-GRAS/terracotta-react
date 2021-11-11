<br />
<h1 align="center">@dhi-gras/terracotta-react</h1>

<div align="center">

[![Latest](https://img.shields.io/npm/v/@dhi-gras/terracotta-react/latest)](https://www.npmjs.com/package/@dhi-gras/terracotta-react)
[![semantic-release](https://img.shields.io/badge/semantic-release-e10079.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
</div>
<br />

# Docs

React library tailored for implementing [Terracotta]('https://terracotta-python.readthedocs.io/en/latest/index.html') through the provided hooks. 

This package is created using [TypeScript](https://www.typescriptlang.org/) and [MaterialUI](https://material-ui.com/), built using [Yarn](https://classic.yarnpkg.com/en/) and bundled using [TSDX](https://tsdx.io/).

## Prerequisites

Check the `peerDependencies` of the [terracotta-react package](./packages/terracotta-react).

## Usage

Install the package

```
yarn add @dhi-gras/terracotta-provider

// or

npm install @dhi-gras/terracotta-provider
```

# TerracottaContextProvider

The context provider aims to offer a few state values and methods to ease the implementation of Terracotta in your project. 

```
import React, { FC } from "react"
import TerracottaProvider from "@dhi-gras/terracotta-react"

const App: FC = () => (
	<TerracottaProvider
		host={'https://your-terracotta-host.com'} // Without the ending "/".
	>
		<AppScreen />
	</TerracottaProvider>
)

export default App
```

# Hooks

## useTerracotta

The hook helps you get the values of the context state through your react tree.

```
import React, { FC } from "react"
import { useTerracotta } from "@dhi-gras/terracotta-react"

const AppScreen: FC = () => {
	const { keys, isLoading, getDatasets } = useTerracotta()

	return null;
}

export default AppScreen
```

### Provided state values and methods

#### `keys`

An object respective to the response received from the `/keys` endpoint of the provided terracotta host.

Example: 
```
[
	{
		"key": "keyName",
	},
	{
		"key": "keyName",
	},
	...
]
```

#### `isLoading`

A `boolean` value that represents the loading state of the provider. The value changes to `true` when making requests to various terracotta endpoints.

#### `getDatasets`

A method that returns a Promise by making a call to the `/datasets` endpoint. It can take in an argument containing the query parameters used for filtering through the available datasets from the provided Terracotta host.

For example, in the following call, the method will try to query the terracotta datasets for the `project_id: 2` including the `type: preprocess` and `type: postprocess` with that id.

```
const { getDatasets } = useTerracotta()

const handleDatasets = async () => {
	try{
		const response = await getDatasets({
			project_id: 2,
			type: [ 'preprocess', 'postprocess' ]
		})

		const datasets = response.datasets

		return datasets

	}catch(err){
		console.error(err)
	}
}
```

# Deck.gl hooks

This package includes a few helper functions that can be used during the implementation of Terracotta and Deck.gl. This readme file should give you an overview of what hooks are available and how to use them.

## useRasterLayer

The hook is an implementation of [TileLayer](https://deck.gl/docs/api-reference/geo-layers/tile-layer) and [BitmapLayer]('https://deck.gl/docs/api-reference/layers/bitmap-layer') in order to render and cache raster data progressively on the map, taking into account the bounding box of the viewport that the user is currently viewing. 

### Usage

```
import { useRasterLayer } from "@dhi-gras/terracotta-react";

const rasterLayer = useRasterLayer({
	id: 'post-classification-terracotta-layer',
	data: https://www.terracotta-deployment.com/key1/key2/{z}/{x}/{y}.png,
	...otherTileLayerProps
})

```

The component is taking in the same properties as the [TileLayer](https://deck.gl/docs/api-reference/geo-layers/tile-layer).

## useTerracottaLayer

The hook applies the same concept as the `useRasterLayer`, and at the same time it wraps up some of the logic around rendering the terracotta raster/s.

The layer can take in more than one dataset and show it on the map, especially when there are multiple tiles to be displayed for the same area of interest.

### Usage

```
import { useTerracottaLayer } from "@dhi-gras/terracotta-react";

const datasets = [
	{
		"key1": "",
		"key2": false,
		"key3": 0
	},
	{
		"key1": "",
		"key2": true,
		"key3": 0
	}
]

const terracotta = useTerracottaLayer({
	id: 'post-classification-terracotta-layer',
	url: https://www.terracotta-deployment.com,
	datasets: [ ...datasets ],
	type: "singleband",
	queryString: "colormap=binary&stretch_range=[0,1]" // Depends on the type of data
	...otherTileLayerProps
})

```
### Props

List of specific props related mainly to Terracotta. The rest of the props passed are the same as for the TileLayer and will be applied to the [TileLayer](https://deck.gl/docs/api-reference/geo-layers/tile-layer). 

#### `url`*
The terracotta instance url without the ending "/".

#### `id`*
The unique identifier for the given layer.

#### `datasets`
This represents the dataset/s that are to be displayed on the map as TileLayers.

#### `type`

The type is related to the type of data that the user would like to render. The options available are 'singleband' and 'rgb'. You can read more about the differences in the [official documentation](https://terracotta-python.readthedocs.io/en/latest/concepts.html?highlight=singleband#data-model).

#### `queryString`

The queryString is used to specify the ranges you would like to see for the Red, Green or Blue band through the r_range, b_range, g_range query parameters. 

You can also specify the [colormap](https://terracotta-python.readthedocs.io/en/latest/reference/colormaps.html) and the stretch_range in case of 'singleband' or to specify the colors for the categorical data.
