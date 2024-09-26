<script setup lang="ts">


import YandexTileLayer from '~/components/map/base-maps/layers/YandexTileLayer.vue';
import OsmTileLayer from '~/components/map/base-maps/layers/OsmTileLayer.vue';
import Gis2Layer from '~/components/map/base-maps/layers/Gis2Layer.vue';
import ArcGisTileLayer from '~/components/map/base-maps/layers/ArcGisTileLayer.vue';
import OsmVectorTile from '~/components/map/base-maps/layers/OsmVectorTile.vue';
import DarkMatterVectorTile from '~/components/map/base-maps/layers/DarkMatterVectorTile.vue';

const store = useMapStore();
</script>

<template>
  <yandex-tile-layer v-if="store.overlay ==='yandex'"/>
  <osm-tile-layer v-if="store.overlay==='osm'"/>
  <gis2-layer v-if="store.overlay==='2gis'"/>
  <arc-gis-tile-layer v-if="store.overlay==='arcgis'"/>
  <osm-vector-tile v-if="store.overlay==='osm-vector-tile'"/>
  <dark-matter-vector-tile v-if="store.overlay==='darkmatter'"/>
</template>

