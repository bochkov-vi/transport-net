<template>
  <dgl-image-tile-layer id="osm" :z-index="0" data="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png" />
</template>
<script lang="ts" setup>
import DglImageTileLayer from '~/components/map/deck/layer/DglImageTileLayer.vue';
</script>
