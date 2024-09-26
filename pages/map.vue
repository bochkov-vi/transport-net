<script setup lang="ts">
import MlMap from '~/components/map/maplibre/MlMap.vue';
import Deck from '~/components/map/deck/Deck.vue';
import OverlayMaps from '~/components/map/base-maps/OverlayMaps.vue';
import BtnOverlaySwitch from '~/components/map/base-maps/BtnOverlaySwitch.vue';

const leftDrawerOpen = ref(true);
const rightDrawerOpen = ref(true);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};
definePageMeta({
  path: '/|map'
});
</script>

<template>
  <ml-map>
    <deck>
      <q-layout view="hHh lpR lfr">
        <q-page-container>
          <q-page>
            <overlay-maps/>
            <btn-overlay-switch/>
            <div id="map" class="full-height full-width absolute" style="position: absolute"></div>
            <q-page-sticky position="top-right" :offset="[10, 10]" style="z-index: 10">
              <q-btn v-if="rightDrawerOpen" round unelevated color="primary" icon="mdi-close"
                     @click="toggleRightDrawer"/>
              <q-btn v-else round unelevated color="primary" icon="mdi-menu" @click="toggleRightDrawer"/>
            </q-page-sticky>
            <q-page-sticky position="top-left" :offset="[10, 10]" style="z-index: 10">
              <q-btn v-if="leftDrawerOpen" round unelevated color="primary" icon="mdi-close" @click="toggleLeftDrawer"/>
              <q-btn v-else round unelevated color="primary" icon="mdi-menu" @click="toggleLeftDrawer"/>
            </q-page-sticky>
          </q-page>
        </q-page-container>
        <!--        <q-header elevated>
                  <q-toolbar>
                    <q-btn flat dense round icon="mdi-menu" aria-label="Menu" @click="toggleLeftDrawer"/>
                    <q-toolbar-title><span @click="$q.dark.toggle()">Wildberries</span></q-toolbar-title>
                    <q-space/>
                  </q-toolbar>
                </q-header>-->
<!--        <q-footer class="bg-white" id="footer"></q-footer>   -->
        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered v-scroll :width="350">
        </q-drawer>
        <q-drawer v-model="rightDrawerOpen" v-scroll :width="350" bordered side="right">
        </q-drawer>
      </q-layout>
    </deck>
  </ml-map>
</template>
<style scoped></style>
