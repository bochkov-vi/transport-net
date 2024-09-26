<script setup lang="ts">
import { TerraDraw, TerraDrawLineStringMode, TerraDrawMapLibreGLAdapter } from 'terra-draw';
import { useMaplibre } from '~/components/map/maplibre';

const { map } = useMaplibre();

const update = () => {
  if (map.value) {
    const draw = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({
        map: map.value
      }),
      modes: [new TerraDrawLineStringMode(),]
    });

// Start drawing
    draw.start();
    draw.setMode('linestring');
  }
};
watch(() => map.value, update);

</script>

<template>
  <slot></slot>
</template>
