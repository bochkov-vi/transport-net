<script setup lang="ts">
import DglLayer from '~/components/map/deck/layer/DglLayer.vue';
import {Accessor, Color, Layer} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {chain, isNull, isNumber, isString, isUndefined, toNumber} from 'lodash';
import type {Feature, Geometry} from 'geojson';
import {useColor} from '~/components/map/deck/layer/index';
import {ClusterTileLayer} from '~/components/map/deck/layer/cluster-tile-layer';

const props = defineProps({
  layer: {type: [Function, Object] as PropType<LayerGetter | Layer | Layer[]>},
  zIndex: {type: [Number, String], default: () => 0},
  id: {type: String, required: true},
  data: {type: [String], required: true},
  clusterMaxZoom: {type: [Number, String], default: () => 12},
  maxZoom: {type: [Number, String]},
  minZoom: {type: [Number, String]},
  maxZoomVisible: {type: [Number, String]},
  minZoomVisible: {type: [Number, String]},
  extent: {type: Array as PropType<number[]>},
  dataLoadingZoom: {type: [Number, String]},
  clusterDistance: {type: [Number, String], default: () => 30},
  icon: {type: [String, Function, Object], required: true},
  iconImageWith: {type: [String, Number], required: false, default: () => 48},
  iconImageHeight: {type: [String, Number], required: false, default: () => 48},
  iconSize: {
    type: [String, Number] as PropType<string | Accessor<Feature<Geometry>, number>>,
    required: false,
    default: () => 20
  },
  fillColor: {
    type: [String, Array, Function] as PropType<Color | string | (() => Color | string)>,
    default: () => 'rgba(255,255,255,0.5)'
  },
  textColor: {
    type: [String, Array, Function] as PropType<Color | string | (() => Color | string)>,
    default: () => 'rgba(0,0,0)'
  },
  strokeColor: {
    type: [String, Array, Function] as PropType<Color | string | (() => Color | string)>
  },
  strokeWidth: {type: [Number, String] as PropType<number | string>},
});

const {fillColor, strokeColor, textColor} = toRefs(props);
const cmpFillColor = useColor(fillColor);
const cmpStrokeColor = useColor(strokeColor);
const cmpTextColor = useColor(textColor);


const getIcon = computed(() => {
  let rsl: Accessor<Feature<Geometry, NonNullable<unknown>>, NonNullable<unknown>>;
  if (isString(props.icon)) {
    rsl = () => ({url: props.icon, height: toNumber(props.iconImageHeight), width: toNumber(props.iconImageWith)});
  } else {
    rsl = props.icon;
  }
  return rsl;
});

const getIconSize = computed(() => {
  let rsl: Accessor<Feature<Geometry>, number>;
  if (isString(props.iconSize)) {
    rsl = toNumber(props.iconSize);
  } else {
    rsl = props.iconSize;
  }
  return rsl;
});

const mapStore = useMapStore();
const visible = computed(() => {
  const maxZoomVisible = toNumber(props.maxZoomVisible);
  const minZoomVisible = toNumber(props.minZoomVisible);
  const v = (isNaN(minZoomVisible) || minZoomVisible <= mapStore.zoom) && (isNaN(maxZoomVisible) || maxZoomVisible >= mapStore.zoom);
  return v;
});

const layer = computed(() => {
  const args = chain({
    getClusterFillColor: cmpFillColor as Accessor<Feature, Color>,
    clusterStroked: !!strokeColor?.value,
    getClusterLineColor: cmpStrokeColor as Accessor<Feature, Color>,
    getClusterLineWidth: toNumber(props.strokeWidth),
    lineWidthUnits: 'pixels',
    getClusterLabelColor: cmpTextColor,
    minZoomVisible: toNumber(props.minZoomVisible),
    maxZoomVisible: toNumber(props.maxZoomVisible),
    maxZoom: toNumber(props.maxZoom ?? props.dataLoadingZoom),
    minZoom: toNumber(props.minZoom ?? props.dataLoadingZoom),
    clusterMaxZoom: toNumber(props.clusterMaxZoom),
    clusterDistance: toNumber(props.clusterDistance),
    extent: props.extent,
    visible: visible.value
  }).omitBy(isUndefined).omitBy(isNull).omitBy(v => isNumber(v) && isNaN(v)).value();
  return new ClusterTileLayer({
    id: props.id,
    data: props.data,
    pointType: 'icon',
    pickable: true,
    markerLayer(args) {
      return new GeoJsonLayer(args, {
        pointType: 'icon',
        getIcon: getIcon.value,
        getIconSize: getIconSize.value,
      });
    },
    //@ts-expect-error err
  }, args);
});


</script>

<template>
  <dgl-layer :id="id" :layer="layer" :z-index="zIndex">
    <slot></slot>
  </dgl-layer>
</template>

<style scoped>

</style>
