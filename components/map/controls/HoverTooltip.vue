<template>
  <on-hover :position="position" v-model:info="info"
            v-model:x="x"
            v-model:y="y"
            v-model:coordinate="coordinate">
    <template #default="{info,x,y,coordinate}">
      <popper-tooltip v-if="coordinate" :coordinate="coordinate" v-bind="$attrs">
        <slot v-if="info" :info="info" :x="x" :y="y"></slot>
      </popper-tooltip>
    </template>
  </on-hover>
</template>

<script lang="ts" setup>
import { Layer, PickingInfo } from '@deck.gl/core';
import PopperTooltip from '~/components/map/controls/interactions/PopperTooltip.vue';
import OnHover from '~/components/map/controls/interactions/OnHover.vue';

const info = defineModel('info', { type: Object as PropType<PickingInfo> });
const x = defineModel('x', { type: Number as PropType<number> });
const y = defineModel('y', { type: Number as PropType<number> });
const coordinate = defineModel('coordinate', { type: Array as PropType<number[]> });
defineProps({
  layer: { type: [String, Object] as PropType<string | Layer> },
  position: { type: String as PropType<'centroid' | 'event'>, default: () => 'centroid' }
});

</script>
