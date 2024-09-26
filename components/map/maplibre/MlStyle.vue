<script setup lang="ts">
import {Map, StyleSpecification} from 'maplibre-gl';
import {EMPTY_MAP_STYLE, useMaplibre} from '~/components/map/maplibre/index';
import {useChain} from '#imports';


const props = defineProps({
  mapStyle: {
    type: [String, Object] as PropType<string | StyleSpecification>,
    required: true
  },
  lang: {type: String, default: () => 'ru'}
});
const {map} = useMaplibre();
const style = computed(() => {
  return `${props.mapStyle}`;
});

function onMapChange(map?: Map, old?: Map) {
  if (old) {
    old.setStyle(EMPTY_MAP_STYLE);
  }
  if (map) {
    map.setStyle(style.value);
    /*map.on('load', (ev) => {
      const mp = ev.target;
      mp.getStyle().layers.forEach(function (thisLayer) {
        const textField = useProperty('text-field')(thisLayer.layout) as Record<string, any>;
        if (textField) {
          console.log(thisLayer.id);
          const ruTextField = replaceEnRu(textField);
          console.log(textField, ruTextField);
          // const layout = mp.getLayoutProperty(thisLayer.id, 'text-field');
          // mp.setLayoutProperty(thisLayer.id, 'text-field', ['coalesce', ['get', 'name:ru'], ['get', 'name:en'], ['get', 'name:class']]);
        }

      });
    });*/
  }

}

watch(() => map.value, onMapChange);
watch(() => props.mapStyle, () => onMapChange(map.value));
onMounted(() => {
  onMapChange(map.value);
});

onUnmounted(() => {
  onMapChange(undefined, map.value);
});

const replaceEnRu = (o: any): any => {
  const regexp = /:en\b/;
  if (isString(o)) {
    const ru = useReplace(o, regexp, ':ru');
    const simple = useReplace(o, regexp, '');
    return ['coalesce', ['get', ru], ['get', simple]];
  } else if (isArray(o)) {
    return useChain(o).map(replaceEnRu).value();
  } else {
    return o;
  }
};

</script>

<template>
  <slot></slot>
</template>
