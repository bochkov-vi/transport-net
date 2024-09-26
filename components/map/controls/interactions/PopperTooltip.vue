<template>
  <teleport to=".q-page">
    <div class="anchor"
         ref="anchor"></div>
    <div id="tooltip" ref="tooltip" v-bind="$attrs">
      <slot></slot>
      <div v-show="arrow" id="arrow" data-popper-arrow></div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { createPopper, Instance } from '@popperjs/core';
import { Marker } from 'maplibre-gl';
import { useMaplibre } from '~/components/map/maplibre';

const store = useMapStore();
const props = defineProps({
  coordinate: { type: Array as PropType<number[]>, required: true },
  arrow: { type: Boolean, default: () => true }
});
const { map } = useMaplibre();

const anchor = ref<HTMLElement>();
const tooltip = ref<HTMLElement>();
let popper: Instance | undefined;
let marker: Marker;
watch(() => [store.center, store.zoom, props.coordinate], () => {
  nextTick(() => update());
});

const update = () => {
  if (props.coordinate) marker.setLngLat(props.coordinate as [number, number]);
  popper?.forceUpdate();
};


const create = () => {
  if (popper) {
    popper.destroy();
    popper = undefined;
  }
  popper = createPopper(anchor.value as HTMLElement, tooltip.value as HTMLElement, {
    placement: 'top',
    modifiers: [{ name: 'offset', options: { offset: [0, 20] } }, {
      name: 'preventOverflow',
      options: { boundary: document.querySelector('.q-page') }
    }]
  });
};
onMounted(() => {
  marker = new Marker({ element: anchor.value }).setLngLat(props.coordinate as [number, number]);
  marker.addTo(map.value);
  map.value.on('zoom', update);
  map.value.on('move', update);
  create();

});
onUnmounted(() => {
  map.value.off('zoom', update);
  map.value.off('move', update);
  popper?.destroy();
  marker?.remove();
});
</script>
<style scoped>
.anchor {
  background: transparent;
  z-index: 3;
  width: 5px;
  height: 5px;
  pointer-events: none;
  position: absolute;
}

#tooltip {
  z-index: 3;
  color: white;
  pointer-events: none;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  background-blend-mode: normal;
}

#arrow,
#arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  background-blend-mode: normal;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
}

#tooltip[data-popper-placement^='top'] > #arrow {
  bottom: -4px;
}

#tooltip[data-popper-placement^='bottom'] > #arrow {
  top: -4px;
}

#tooltip[data-popper-placement^='left'] > #arrow {
  right: -4px;
}

#tooltip[data-popper-placement^='right'] > #arrow {
  left: -4px;
}
</style>
