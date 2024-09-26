<template>
  <dgl-image-tile-layer
      id="2gis"
      :z-index="0"
      data="https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1"/>
</template>
<script lang="ts" setup>
import DglImageTileLayer from '~/components/map/deck/layer/DglImageTileLayer.vue';
</script>
