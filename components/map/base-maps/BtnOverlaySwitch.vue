<script setup lang="ts">

const items = [
  {label: 'DarkMatter', value: 'darkmatter'},
  {label: 'OSM', value: 'osm'},
  {label: 'OSM Vector', value: 'osm-vector-tile'},
  {label: 'Яндекс', value: 'yandex'},
  {label: '2Гис', value: '2gis'},
  {label: 'ArcGis', value: 'arcgis'},
];
const store = useMapStore();

</script>
<template>
  <q-page-sticky position="top-right" :offset="[10,70]" style="z-index: 10">
    <q-btn icon="mdi-layers-outline">
      <q-menu anchor="top right" auto-close>
        <q-list>
          <q-item v-for="item in items" :key="item.value" clickable v-ripple @click="store.overlay=item.value">
            <q-item-section side>
              <q-radio v-model="store.overlay" :val="item.value" checked-icon="mdi-checkbox-outline"
                       unchecked-icon="mdi-checkbox-blank-outline"></q-radio>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-page-sticky>
</template>

<style scoped lang="sass">
.body--dark .q-btn
  background: $grey-8

.body--light .q-btn
  background: $grey-1
</style>

