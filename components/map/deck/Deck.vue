<script setup lang="ts">
import { MapboxOverlay } from '@deck.gl/mapbox';
import { useMaplibre } from '~/components/map/maplibre';
import { Map } from 'maplibre-gl';
import { useSetupDeckGl } from '~/components/map/deck/index';

const { deckOnClick, deckOnHover, getLayers } = useSetupDeckGl();
const { map } = useMaplibre();
const deck = ref();
provide('deck-gl', deck);
onMounted(() => {
  const deckOverlay = new MapboxOverlay({
    layers: getLayers(),
    onHover: deckOnHover,
    onClick: deckOnClick
  });
  deck.value = markRaw(deckOverlay);
  onChangeMap(map.value);
});
onUnmounted(() => {
  if (map.value && deck.value)
    map.value.removeControl(deck.value);
});
const onChangeMap = (n?: Map, o?: Map) => {
  const d = toValue(deck);
  if (o && d) {
    o.removeControl(d);
  }
  if (n && d) {
    n.addControl(d);
  }
};

watch(() => map.value, onChangeMap);

watchEffect(() => {
  if (deck.value)
    deck.value.setProps({ layers: getLayers() });
});

</script>

<template>
  <slot></slot>
</template>
