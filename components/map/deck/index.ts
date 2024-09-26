import { DeckProps, Layer, PickingInfo } from '@deck.gl/core';
import { castArray, chain, isEmpty, remove } from 'lodash';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import { MapboxOverlay } from '@deck.gl/mapbox';

export type LayerGetter<L extends Layer = Layer> = () => L | L[] | undefined
export type SortedLayer = { id: string, zIndex?: number, layer: LayerGetter }
type HoverListener = DeckProps['onHover'];
type ClickListener = DeckProps['onClick'];

const sortedLayers = ref<SortedLayer[]>();
const hoverListeners = [] as HoverListener[];
const clickListeners = [] as ClickListener[];

const deckOnHover: HoverListener = (info: PickingInfo, event: MjolnirPointerEvent) => {
  hoverListeners.forEach((listener) => {
    if (listener) listener(info, event);
  });
};
const deckOnClick: ClickListener = (info: PickingInfo, event: MjolnirGestureEvent) => {
  clickListeners.forEach((listener) => {
    if (listener) listener(info, event);
  });
};


const getLayers = () => {
  const layers = chain(sortedLayers.value).sortBy('zIndex').map(sl => sl.layer()).flatten().compact().value();
  // console.log(layers);
  return layers;
};

export const useSetupDeckGl = () => {
  return { deckOnHover, deckOnClick, getLayers };
};

const addLayer = (layer: SortedLayer) => {
  sortedLayers.value = chain(castArray(layer)).unionBy(sortedLayers.value, 'id').reject(l => isEmpty(l.id)).value();
};
const removeLayer = (l?: string | { id: string }) => {
  const id = (l as { id: string }).id ?? l;
  sortedLayers.value = chain(sortedLayers.value).reject({ id: id }).reject(l => isEmpty(l.id)).value();
};

const onHover = (listener: HoverListener) => hoverListeners.push(listener);
const unHover = (listener: HoverListener) => remove(hoverListeners, (l) => l === listener);
const onClick = (listener: ClickListener) => clickListeners.push(listener);
const unClick = (listener: ClickListener) => remove(clickListeners, (l) => l === listener);


const setupLayer = (layer: SortedLayer) => {
  onMounted(() => {
    addLayer(layer);
  });
  onUnmounted(() => {
    removeLayer(layer);
  });
};

export const useDeckGl = () => {
  const deck = inject('deck-gl') as Ref<MapboxOverlay>;
  return { onHover, unHover, onClick, unClick, deck, setupLayer };
};

export const useOnHover = (listener: HoverListener) => {

  onMounted(() => {
    onHover(listener);
  });
  onUnmounted(() => {
    unHover(listener);
  });
};

export const useOnClick = (listener: ClickListener) => {
  onMounted(() => {
    onClick(listener);
  });
  onUnmounted(() => {
    unClick(listener);
  });
};
