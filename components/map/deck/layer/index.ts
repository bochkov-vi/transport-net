import { Accessor, Color, Layer } from '@deck.gl/core';
import { colors } from 'quasar';
import { Feature } from 'geojson';
import { isFunction, isString } from 'lodash';
import textToRgb = colors.textToRgb;
import { LayerGetter } from '~/components/map/deck';

export const PROVIDE_LAYER_ID = 'deck-layer';
export const useDeckLayer = (defaultLayer?: Layer | string) => {
  const layer = inject(PROVIDE_LAYER_ID) as Layer | Ref<Layer> | LayerGetter | undefined | string;
  const layerId = () => {
    return resolveLayerId(defaultLayer, layer);
  };
  return { layer, layerId };
};

export const resolveLayerId = <L extends Layer | Ref<Layer> | LayerGetter | undefined | string>(...layer: L[]): string | undefined => {
  let _layers = useChain(toValue(layer)).map(l => toValue(l as MaybeRef)).compact().value();
  if (_layers.length > 1) {
    for (let i = 0; i < _layers.length; i++) {
      const id = resolveLayerId(layer[i]);
      if (id) return id;
    }
  }
  let _layer = useFirst(_layers);

  if (_layer) {
    if (isFunction(_layer)) {
      _layer = (_layer)();
    }
    const id = (useProperty('id')(_layer) ?? layer) as string;
    return id;
  }
};


export const webGlColor = (color: Color | string): Color => {
  if (isString(color)) {
    const c = textToRgb(color);
    const a = 255 * (c.a ?? 100) * 0.01;
    return [c.r, c.g, c.b, a];
  }
  return color as Color;
};
export const colorFunc = (f: (data: NonNullable<unknown>) => Color | string) => {
  return function(data: NonNullable<unknown>) {
    const clr = f(data);
    return webGlColor(clr);
  };
};
export const useColor = (color: Ref<Color | string | ((d: NonNullable<unknown>) => Color | string) | undefined> | undefined): Accessor<Feature, Color> => {
  if (color) {
    if (isFunction(toValue(color))) {
      return colorFunc(toValue(color) as (d: NonNullable<unknown>) => Color);
    } else if (toValue(color)) {
      return () => webGlColor(toValue(color) as Color | string);
    }
  }
  return [0, 0, 0];
};
