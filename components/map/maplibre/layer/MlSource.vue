<script setup lang="ts">
import { PROVIDE_SOURCE_ID, useMaplibre } from '~/components/map/maplibre';
import { SourceSpecification } from 'maplibre-gl';

const props = defineProps({
  id: { type: String, required: true },
  type: {
    type: String as PropType<'vector' | 'raster' | 'raster-dem' | 'geojson' | 'video' | 'image'>,
    required: true
  },
  data: { type: [Object] as PropType<GeoJSON.GeoJSON>, required: true }
});
const { map } = useMaplibre();
const source = ref();
onMounted(() => {
  const src = { type: props.type, data: markRaw(props.data) } as SourceSpecification;
  map.value.addSource(props.id, src);
  source.value = props.id;
});
onUnmounted(() => {
  map.value.removeSource(props.id);
});
provide(PROVIDE_SOURCE_ID, source);
</script>

<template>
  <slot></slot>
</template>
