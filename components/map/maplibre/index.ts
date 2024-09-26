import {LayerSpecification, Map, StyleSpecification} from 'maplibre-gl';
export const EMPTY_MAP_STYLE = {version: 8, sources: {}, layers: []} as StyleSpecification;
export const PROVIDE_LAYER_ID = 'ml-layer';
export const PROVIDE_SOURCE_ID = 'ml-source';
export const useMaplibre = () => {
  const map = inject('ml-map') as Ref<Map>;
  return { map };
};
export const useMaplibreLayer = () => {
  const layer = inject(PROVIDE_LAYER_ID, ref()) as Ref<LayerSpecification>;
  return { layer };
};
export const useMaplibreSource = (defaultSource?:string) => {
  const source = inject(PROVIDE_SOURCE_ID, ref(defaultSource)) as Ref<string>;
  return { source };
};
