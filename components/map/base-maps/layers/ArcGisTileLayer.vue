<template>
  <dgl-image-tile-layer
      id="arcgis"
      :z-index="0"
      data="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
</template>
<script lang="ts" setup>
import DglImageTileLayer from '~/components/map/deck/layer/DglImageTileLayer.vue';
</script>
