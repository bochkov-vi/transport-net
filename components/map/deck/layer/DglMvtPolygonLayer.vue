<script setup lang="ts">
import DglLayer from '~/components/map/deck/layer/DglLayer.vue';
import { MVTLayer, MVTLayerProps } from '@deck.gl/geo-layers';
import { Color } from '@deck.gl/core';
import { chain, isNull, isUndefined, toNumber } from 'lodash';
import { useColor } from '~/components/map/deck/layer/index';

const props = defineProps({
  zIndex: { type: [Number, String], default: () => 0 },
  id: { type: String, required: true },
  data: { type: String, required: true },
  fillColor: {
    type: [String, Array, Function] as PropType<Color | string | (() => Color | string)>,
    default: () => 'rgba(0,0,0,0.5)'
  },
  strokeColor: {
    type: [String, Array, Function] as PropType<Color | string | (() => Color | string)>
  },
  strokeWidth: { type: [Number, String] as PropType<number | string> },
  minZoom: { type: [Number, String] as PropType<number | string> },
  maxZoom: { type: [Number, String] as PropType<number | string> },
  extent: { type: Array as PropType<number[]> },
  pickable: { type: Boolean as PropType<boolean> }
});

const { fillColor, strokeColor } = toRefs(props);
const cmpFillColor = useColor(fillColor);
const cmpStrokeColor = useColor(strokeColor);

const layerProps = computed(() => (chain({
  id: props.id,
  data: props.data,
  getFillColor: cmpFillColor,
  stroked: !!strokeColor,
  filled: !!cmpFillColor,
  getLineColor: cmpStrokeColor,
  getLineWidth: toNumber(props.strokeWidth),
  lineWidthUnits: 'pixels',
  minZoom: toNumber(props.minZoom),
  maxZoom: toNumber(props.maxZoom),
  extent: props.extent,
  pickable: props.pickable
} as MVTLayerProps)).omitBy(isUndefined).omitBy(isNull).value());
const layer = computed(() => new MVTLayer(layerProps.value as NonNullable<unknown>));
</script>
<template>
  <dgl-layer :id="id" :layer="layer" :z-index="zIndex">
    <slot></slot>
  </dgl-layer>
</template>
