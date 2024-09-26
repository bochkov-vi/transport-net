<script setup lang="ts">
import { Map, type MapLibreEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {EMPTY_MAP_STYLE} from '~/components/map/maplibre/index';


const map = ref();

provide('ml-map', map);
const store = useMapStore();
onMounted(() => {
  const m = new Map({
    container: 'map',
    center: store.center ?? [88.262724, 56.585504],
    zoom: store.zoom,
    attributionControl: false,
    hash: true,
    style:EMPTY_MAP_STYLE
  });

  m.on('moveend', (ev) => onCenterChange(ev));
  m.on('zoomend', (ev) => onZoomChange(ev));
  map.value = markRaw(m);
});

const onCenterChange = useDebounce((e: MapLibreEvent) => {
  const m = e.target;
  if (m) {
    store.center = m.getCenter();
  }
}, 50);
const onZoomChange = useDebounce((e: MapLibreEvent) => {
  const m = e.target;
  if (m) {
    store.zoom = m.getZoom();
  }
}, 50);
</script>

<template>
  <slot>
  </slot>
</template>

