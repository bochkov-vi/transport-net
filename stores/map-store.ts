import type {LngLatLike} from 'maplibre-gl';
import {useIncludes} from '#build/imports';

export const useMapStore = defineStore('maplibre-store', () => {
  const center = ref<LngLatLike>([88.262724, 56.585504]);
  const zoom = ref(5);
  const overlay = ref<string>('osm-vector-tile');
  const layers = ref<string[]>([]);
  return {center, zoom, overlay, layers};
}, {persist: true});

export const useStoredLayerKeys = (availableKeys: string[],) => {
  const store = useMapStore();

  const enabled = ref(useChain(availableKeys).filter(v => useIncludes(store.layers, v)).value());

  watch(() => enabled.value, () => {
    const disabled = useChain(availableKeys).without(...enabled.value).value();
    store.layers = useChain(store.layers).union(enabled.value).without(...disabled).value();
  });

  const toggle = (v: string) => {
    setEnabled(v, !isEnabled(v));
  };

  const isEnabled = (k: string) => {
    return useIncludes(enabled.value, k);
  };
  const setEnabled = (k: string, v: boolean) => {
    if (v) {
      enabled.value = useChain(enabled.value).concat(k).uniq().value();
    } else {
      enabled.value = useChain(enabled.value).without(k).compact().uniq().value();
    }
  };
  const allEnabled = computed({
    get: () => {
      return useChain(availableKeys).every(k => useIncludes(enabled.value, k)).value();
    }, set: (v) => {
      if (v) enabled.value = availableKeys;
      else enabled.value = [];
    }
  });
  const r = {enabled, toggle, allEnabled};
  const rsl = r as typeof r & Record<string, Ref<boolean>>;
  useChain(availableKeys).forEach(k => rsl[k] = computed({
    get: () => isEnabled(k), set: (v) => {
      setEnabled(k, v);
    }
  })).value();
  return rsl;
};
