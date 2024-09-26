<template>
  <dgl-image-tile-layer
      id="yandex"
      :z-index="0"
      data="https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&lang=ru_RU&projection=web_mercator"/>
</template>
<script lang="ts" setup>
import DglImageTileLayer from '~/components/map/deck/layer/DglImageTileLayer.vue';
</script>
