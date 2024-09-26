<template>
  <on-click
    :position="position"
    v-model:info="info"
    v-model:x="x"
    v-model:y="y"
    v-model:coordinate="coordinate">
    <template #default="{info,x,y,coordinate,clear}">
      <popper-tooltip v-if="coordinate" :coordinate="coordinate" v-bind="$attrs" :arrow="false"
                      class="bg-white text-black" style="pointer-events: inherit">
        <slot v-if="info" :info="info" :x="x" :y="y" :coordinate="coordinate" :clear="clear"></slot>
      </popper-tooltip>
    </template>
  </on-click>
</template>

<script lang="ts" setup>
import { Layer, PickingInfo } from '@deck.gl/core';
import OnClick from '~/components/map/controls/interactions/OnClick.vue';
import PopperTooltip from '~/components/map/controls/interactions/PopperTooltip.vue';

const info = defineModel('info', { type: Object as PropType<PickingInfo> });
const x = defineModel('x', { type: Number as PropType<number> });
const y = defineModel('y', { type: Number as PropType<number> });
const coordinate = defineModel('coordinate', { type: Array as PropType<number[]> });
defineProps({
  layer: { type: [String, Object] as PropType<string | Layer> },
  position: { type: String as PropType<'centroid' | 'event'>, default: () => 'centroid' }
});
</script>
