
<div align="left">

[![CI - build & release](https://github.com/DHI-GRAS/terracotta-react/actions/workflows/main.yml/badge.svg)](https://github.com/DHI-GRAS/terracotta-react/actions/workflows/main.yml)
[![Latest](https://img.shields.io/npm/v/@dhi-gras/terracotta-react/latest)](https://www.npmjs.com/package/@dhi-gras/terracotta-react)
![NPM](https://img.shields.io/npm/l/@dhi-gras/terracotta-react)
[![semantic-release](https://img.shields.io/badge/semantic-release-e10079.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
</div>
<img src="https://grasdatastorage.blob.core.windows.net/images/tc-logo-banner.svg">
<h1 align="left">@dhi-gras/terracotta-react</h1>

React implementation of a context wrapper for abstracting away some of the logic around the [Terracotta](https://github.com/DHI-GRAS/terracotta) XYZ tile server.

Terracotta is a pure Python tile server that runs as a WSGI app on a dedicated webserver or as a serverless app on AWS Lambda. It is built on a modern Python 3.6 stack, powered by awesome open-source software such as [Flask](http://flask.pocoo.org), [Zappa](https://github.com/Miserlou/Zappa), and [Rasterio](https://github.com/mapbox/rasterio).

## Why Terracotta-react
- Abstracts away the logic around what endpoints you should hit to get the right datasets and display them on a map. All of it through a friendly API.
- Uses the highly performant [Deck.gl](https://deck.gl/) based on the WebGL framework.
- Includes TypeScript definitions, therefore, it prevents unpredictable type errors when used in your app. The types are available by importing them from the package.

## Prerequisites

Check the `peerDependencies` of the [terracotta-react package](./packages/terracotta-react).

## Usage

Install the package

```
yarn add @dhi-gras/terracotta-react

// or

npm install @dhi-gras/terracotta-react
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

#### `getMetadata`

A method that returns a Promise by making a call to the `/metadata` endpoint. It can take in an argument containing one of the datasets from the available dataset list. 

```
const { getMetadata } = useTerracotta()

const handleMetadata = async () => {
	try {
		const metadata = await getMetadata({ ...dataset })

		return metadata

	} catch(err) {
		console.error(err)
	}
}
```

# Deck.gl hooks

This package includes a few helper functions that can be used during the implementation of Terracotta and Deck.gl. This readme file should give you an overview of what hooks are available and how to use them.

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


## useRasterLayer

The package exports a generic layer `useRasterLayer` that can be used in conjunction with any type of XYZ server. The layer takes in the same properties as For readming more about it, you can visit the [TileLayer](https://deck.gl/docs/api-reference/geo-layers/tile-layer) documentation.

### Usage

```
import { useRasterLayer } from "@dhi-gras/terracotta-react";

const rasterLayer = useRasterLayer({
	id: 'post-classification-terracotta-layer',
	data: https://www.terracotta-deployment.com/key1/key2/{z}/{x}/{y}.png,
	...otherTileLayerProps
})

```

# Terracotta specific query parameters

In order to render the right colormaps for your data, some specific combination of query parameters must be set.

## RGB layers

For rendering RGB layers, we have to specify the following:

- The bands respective to red, green and blue colors.
- The ranges respective to each band.

```
const rRangeValue = encodeURI([0,1000])
const gRangeValue = encodeURI([0,1000])
const bRangeValue = encodeURI([0,1000])

`.../{z}/{x}/{y}.png?r=B04&g=B03&b=B02&r_range=${rRangeValue}&g_range=${gRangeValue}&b_range=${bRangeValue}`
```

## Singleband layers

For rendering singleband layers, we have the following use-cases

### Cateogorical data

For categorical data we must specify:

- The `explicit` colormap
- The `explicit_color_map` values

```
const categoricalColors = encodeURI({ "1": "B9D400", "2": "001BCB" })

`.../{z}/{x}/{y}.png?colormap=explicit&explicit_color_map=${categoricalColors}`
```

### Continuous data

For continuous data we must specify:

- The desired `colormap` from the list of [available colormaps](https://terracotta-python.readthedocs.io/en/latest/reference/colormaps.html).
- The `stretch_range` for the range of values to be displayed.

```
const stretchContinuousColor = encodeURI([0,1])
const continuousColor = 'autumn'

`.../{z}/{x}/{y}.png?colormap=autumn&stretch_range=${stretchContinuousColor}`
```
