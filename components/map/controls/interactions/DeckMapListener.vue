<template>
  <slot v-if="info" :info="info" :x="x" :y="y" :coordinate="coordinate" :clear="clear"></slot>
</template>

<script lang="ts" setup>
import { Layer, PickingInfo, WebMercatorViewport } from '@deck.gl/core';
import { center, getCoord } from '@turf/turf';
import { useDeckLayer } from '~/components/map/deck/layer';


const props = defineProps({
  layer: { type: [String, Object] as PropType<string | Layer> },
  position: { type: String as PropType<'centroid' | 'event'>, default: () => 'centroid' },
  handler: { type: Function as PropType<(listener: (pickingInfo: PickingInfo) => void) => void>, required: true }
});

const x = defineModel('x', { type: Number as PropType<number> });
const y = defineModel('y', { type: Number as PropType<number> });
const coordinate = defineModel('coordinate', { type: Array as PropType<number[]> });
const info = defineModel('info', { type: Object as PropType<PickingInfo> });

const { layer, layerId } = useDeckLayer(props.layer);

const clear = () => {
  coordinate.value = undefined;
  info.value = undefined;
};
const listener = (pickingInfo: PickingInfo) => {
  if (pickingInfo.picked) {
    if (layer) {
      const id = layerId();
      if (id) {
        if (id !== pickingInfo?.layer?.id) {
          info.value = undefined;
          return;
        }
      }
    }

    info.value = pickingInfo;
    if (props.position === 'centroid') {
      const c = getCoord(center(pickingInfo.object));
      const m = new WebMercatorViewport(pickingInfo.viewport);
      const xy = m.project(c);
      x.value = xy[0];
      y.value = xy[1];
      coordinate.value = c;
    } else {
      x.value = pickingInfo.x;
      y.value = pickingInfo.y;
      coordinate.value = pickingInfo.coordinate;
    }
  } else {
    info.value = undefined;
    coordinate.value = undefined;
  }
};
props.handler(listener);
</script>
