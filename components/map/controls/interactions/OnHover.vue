<template>
  <deck-map-listener :handler="useOnHover" :layer="layer" :position="position"
                     v-model:info="info"
                     v-model:x="x"
                     v-model:y="y"
                     v-model:coordinate="coordinate"
  >
    <template #default="{info,x,y,coordinate}">
      <slot v-if="info" :info="info" :x="x" :y="y" :coordinate="coordinate"></slot>
    </template>
  </deck-map-listener>
</template>

<script lang="ts" setup>
import { useOnHover } from '~/components/map/deck';
import { Layer, PickingInfo } from '@deck.gl/core';
import DeckMapListener from '~/components/map/controls/interactions/DeckMapListener.vue';

const info = defineModel('info', { type: Object as PropType<PickingInfo> });
const x = defineModel('x', { type: Number as PropType<number> });
const y = defineModel('y', { type: Number as PropType<number> });
const coordinate = defineModel('coordinate', { type: Array as PropType<number[]> });
defineProps({
  layer: { type: [String, Object] as PropType<string | Layer> },
  position: { type: String as PropType<'centroid' | 'event'>, default: () => 'centroid' }
});
// watchEffect(()=>{
//   console.log(info.value)
// })
</script>
