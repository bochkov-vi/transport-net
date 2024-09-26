<script setup lang="ts">

import { useMaplibre, useMaplibreSource } from '~/components/map/maplibre';
import { LayerSpecification } from 'maplibre-gl';

const props = defineProps({
  id: { type: String, required: true },
  type: { type: String as PropType<string> },
  source: { type: String },
  layer: { type: [Object] as PropType<Partial<LayerSpecification>>, required: true }
});
const { map } = useMaplibre();
const { source } = useMaplibreSource(props.source);
const update = () => {
  if (source.value) {
    const layer = { id: props.id, type: props.type, source: source.value, ...props.layer } as LayerSpecification;
    map.value.addLayer(layer);
  }
};
watch(() => source.value, update);

onMounted(() => {
  update();

});
onUnmounted(() => {
  const l = map.value.getLayer(props.id);
  if (l) map.value.removeLayer(props.id);
});
</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>
