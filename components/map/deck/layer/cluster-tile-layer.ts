import {chain, has, pick, property, set} from 'lodash';
import {getCoord} from '@turf/turf';
import type {Feature, Point} from 'geojson';
import type {PointFeature} from 'supercluster';
import {_Tile2DHeader, MVTLayer} from '@deck.gl/geo-layers';
import {
  DefaultProps,
  FilterContext,
  GetPickingInfoParams,
  Layer,
  LayersList,
  PickingInfo,
  Position,
  UpdateParameters
} from '@deck.gl/core';
import {_ClusterLayerProps, ClusterLayer} from '~/components/map/deck/layer/cluster-layer';

type _ClusterTileLayerProps<
  DetailsT extends NonNullable<unknown> = NonNullable<unknown>,
  DataT extends PointFeature<DetailsT> = PointFeature<DetailsT>
> = {
  clusterMaxZoom: number;
  clustering: boolean;
  maxZoom?: number;
  minZoom?: number;
  extent?: number[]
} & Partial<_ClusterLayerProps<DetailsT, DataT>>;

type ClusterTileLayerProps<
  DetailsT extends NonNullable<unknown> = NonNullable<unknown>,
  DataT extends PointFeature<DetailsT> = PointFeature<DetailsT>
> = _ClusterTileLayerProps<DetailsT, DataT>;

export class ClusterTileLayer<
  DetailsT extends NonNullable<unknown> = NonNullable<unknown>,
  DataT extends PointFeature<DetailsT> = PointFeature<DetailsT>
> extends MVTLayer<DetailsT, Required<ClusterTileLayerProps<DetailsT, DataT>>> {
  declare state: {
    _data: DataT[];
    showClusters: boolean;
    updateClusters: boolean;
  } & MVTLayer['state'];

  initializeState() {
    super.initializeState();
  }

  updateState(params: UpdateParameters<this>) {
    super.updateState(params);
    const {changeFlags, context, props, oldProps} = params;
    const showClusters = props.clustering && context.viewport.zoom < (props.clusterMaxZoom ?? 10);
    this.setState({showClusters});

    if ((changeFlags.dataChanged || this.state.updateClusters)) {
      // console.log('tile data update');
      const _data = chain(this.state.tileset?.tiles).map('dataInWGS84').flatten().compact().unionBy('id').value();
      this.setState({_data, updateClusters: false});
    }
  }

  _onTileLoad(tile: _Tile2DHeader) {
    set(tile, '_contentWGS84', undefined);
    super._onTileLoad(tile);
    this.setState({updateClusters: true});
  }

  _onTileUnload(tile: _Tile2DHeader) {
    super._onTileUnload(tile);
    this.setState({updateClusters: true});
  }

  renderLayers(): Layer | LayersList | null {
    if (this.state.showClusters) {
      const data = this.state._data ?? [];
      const props = pick(this.props, ['getPosition', 'pickable', 'clusterStroked', 'markerLayer', 'clusterDistance', 'getClusterRadius', 'getClusterFillColor', 'getClusterLabelColor', 'getClusterLineColor', 'getClusterLineWidth', 'stroked']);
      const clusterLayer = new ClusterLayer<DetailsT>(props, {
        id: `${this.props.id}-clusters`,
        markerLayer: this.props.markerLayer,
        data: data,
        maxZoom: this.props.clusterMaxZoom,
        visible: this.props.visible
      });
      return chain(super.renderLayers()).concat(clusterLayer).value();
    }
    return super.renderLayers();
  }

  renderSubLayers(
    props: MVTLayer['props'] & {
      id: string;
      data: DataT[];
      _offset: number;
      tile: _Tile2DHeader<DataT[]>;
    } & ClusterTileLayerProps<DataT>
  ): Layer | LayersList | null {
    // console.log('redraw tiles');
    if (this.props.markerLayer) {
      const markers = this.props.markerLayer({
        id: `${props.id}-markers`,
        data: property('dataInWGS84')(props.tile),
        getPosition: (f: Feature<Point>) => f.geometry.coordinates,
        pickable: this.props.pickable,
        visible: this.props.visible
      });
      return [markers];
    }
    return super.renderSubLayers(props);
  }

  filterSubLayer({layer, cullRect}: FilterContext) {
    const {tile} = (layer as Layer<{ tile: _Tile2DHeader }>).props;
    if (tile) {
      return !this.state.showClusters && (this.state.tileset?.isTileVisible(tile, cullRect) ?? false);
    } else {
      return true;
    }
  }

  //@ts-expect-error err
  getPickingInfo(params: GetPickingInfoParams) {
    if (has(params, 'params.info.tile'))
      return super.getPickingInfo(params);
    return params.info as PickingInfo;
  }
}

ClusterTileLayer.layerName = 'cluster-tile-layer';
//@ts-expect-error err
ClusterTileLayer.defaultProps = {
  maxRequests: 20,
  cluster: true,
  clusterMaxZoom: 8,
  clusterDistance: 30,
  clustering: true,
  getPosition: (d: Feature<Point>) => getCoord(d) as Position,
} as DefaultProps<ClusterTileLayerProps>;
