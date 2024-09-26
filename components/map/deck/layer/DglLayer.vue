<script setup lang="ts">
import {Layer} from '@deck.gl/core';
import {isFunction, toNumber} from 'lodash';
import {PROVIDE_LAYER_ID} from '~/components/map/deck/layer/index';
import {LayerGetter, useDeckGl} from '~/components/map/deck';

const props = defineProps({
  layer: {type: [Function, Object] as PropType<LayerGetter | Layer | Layer[]>},
  zIndex: {type: [Number, String], default: () => 0},
  id: {type: String, required: true}
});

const zIndex = computed(() => toNumber(props.zIndex));
const layer = computed(() => {
  if (isFunction(props.layer)) {
    return props.layer();
  } else {
    return props.layer;
  }
});
provide(PROVIDE_LAYER_ID, layer);
useDeckGl().setupLayer({id: props.id, zIndex: zIndex.value, layer: () => layer.value});
</script>
<template>
  <slot></slot>
</template>
