<template>
  <dgl-layer :id="id" :layer="layer" :z-index="zIndex">
    <slot></slot>
  </dgl-layer>
</template>
<script lang="ts" setup>
import { BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import _, { assign, isNull, isUndefined, random } from 'lodash';
import DglLayer from '~/components/map/deck/layer/DglLayer.vue';

const props = defineProps({
  id: {
    type: String,
    default: () => 'ImageTileLayer-' + random(1000, false)
  },
  data: {
    required: false
  },
  maxZoom: {
    type: Number,
    default: () => 19
  },
  minZoom: {
    type: Number,
    default: () => 0
  },
  renderSubLayers: {
    type: Function
  },
  tileSize: {
    type: Number,
    default: () => 256
  },
  opacity: {
    type: Number
  },
  zIndex: {
    type: Number
  }
});


const layerProps = () => {
  let result = {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    renderSubLayers: (props: any) => {
      const { boundingBox } = props.tile;
      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
      });
    }
  };
  result = assign(result, _(props).omitBy(isNull).omitBy(isUndefined).value());
  return result;
};

const layer = () => {
  return new TileLayer(layerProps());
};

</script>
