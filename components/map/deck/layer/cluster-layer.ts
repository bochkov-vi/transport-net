import {chain, merge, toString} from 'lodash';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {getCoord} from '@turf/turf';
import Supercluster, {type ClusterFeature, type PointFeature} from 'supercluster';
import {
  type Accessor,
  type Color,
  CompositeLayer,
  type DefaultProps,
  type Layer,
  type LayerContext,
  type LayerDataSource,
  type LayersList,
  type Position,
  type UpdateParameters
} from '@deck.gl/core';
import type {Feature, Point} from 'geojson';


export type ClusterLayerProps<
  DetailsT extends NonNullable<unknown> = NonNullable<unknown>,
  DataT extends PointFeature<DetailsT> = PointFeature<DetailsT>
> = _ClusterLayerProps<DataT>;
export type _ClusterLayerProps<
  DetailsT extends NonNullable<unknown> = NonNullable<unknown>,
  DataT extends PointFeature<DetailsT> = PointFeature<DetailsT>
> = {
  data: LayerDataSource<DataT>;
  maxZoom?: number;
  getPosition: Accessor<Feature<Point, DetailsT>, Position>;
  markerLayer: (props: NonNullable<unknown>) => Layer;
  clusterDistance: number,
  getClusterRadius: number,
  getClusterFillColor?: Accessor<ClusterFeature<DetailsT>, Color>,
  getClusterLabelColor?: Accessor<ClusterFeature<DetailsT>, Color>,
  getClusterLineColor?: Accessor<ClusterFeature<DetailsT>, Color>,
  getClusterLineWidth?: Accessor<ClusterFeature<DetailsT>, number>,
  clusterStroked?: boolean
};

export class ClusterLayer<
  DetailsT extends NonNullable<unknown> = NonNullable<unknown>,
  DataT extends PointFeature<DetailsT> = PointFeature<DetailsT>,
  ExtraPropsT extends NonNullable<unknown> = NonNullable<unknown>
> extends CompositeLayer<ExtraPropsT & Required<_ClusterLayerProps<DetailsT, DataT>>> {
  declare state: {
    index: Supercluster<DetailsT, DetailsT>;
    z: number;
    features: PointFeature<DetailsT>[];
    clusters: ClusterFeature<DetailsT>[];
  } & CompositeLayer['state'];

  initializeState(context: LayerContext) {
    super.initializeState(context);
    this.setState({
      features: Array<PointFeature<DetailsT>>(),
      clusters: Array<ClusterFeature<DetailsT>>(),
    });
  }

  updateState(
    params: UpdateParameters<this>
  ) {
    super.updateState(params);
    const {changeFlags, context, props} = params;
    const rebuildIndex = changeFlags.dataChanged;

    if (rebuildIndex) {
      const index = new Supercluster<DetailsT, DetailsT>({
        maxZoom: this.props.maxZoom,
        radius: this.props.clusterDistance
      });
      const data = (props.data as DataT[]) ?? [];
      index.load(data);
      this.setState({index, data});
    }

    const z = Math.floor(context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      // console.log('rebuild data');
      const clustered = this.state.index.getClusters([-180, -90, 180, 90], z);
      const {features, clusters} = chain(clustered)
        .reduce(
          (agg, feature) => {
            if ((feature as ClusterFeature<DetailsT>).properties.cluster) {
              agg.clusters.push(feature as ClusterFeature<DetailsT>);
            } else {
              agg.features.push(feature as PointFeature<DetailsT>);
            }
            return agg;
          },
          {features: Array<PointFeature<DetailsT>>(), clusters: Array<ClusterFeature<DetailsT>>()}
        )
        .value();
      this.setState({
        features,
        clusters,
        z,
      });
    }
  }

  renderLayers(): Layer | LayersList | null {
    const circles = new ScatterplotLayer({
      id: `${this.props.id}-cluster-circles`,
      getRadius: (f: ClusterFeature<DetailsT>) => 15 + Math.log(f.properties.point_count),
      getFillColor: this.props.getClusterFillColor,
      getLineColor: this.props.getClusterLineColor,
      getLineWidth: this.props.getClusterLineWidth,
      lineWidthUnits: 'pixels',
      stroked: this.props.clusterStroked,
      radiusUnits: 'pixels',
      getPosition: this.props.getPosition,
      data: this.state.clusters,
      visible: this.props.visible
    });
    const labels = new TextLayer({
      id: `${this.props.id}-cluster-labels`,
      getSize: 12,
      fontWeight: 'bold',
      sizeUnits: 'pixels',
      getText: (f: ClusterFeature<DetailsT>) => {
        return toString(f.properties.point_count);
      },
      getColor: this.props.getClusterLabelColor,
      getPosition: this.props.getPosition,
      data: this.state.clusters,
      visible: this.props.visible
    });
    const makerLayerProps = merge({
      id: `${this.props.id}-markers`,
      data: this.state.features,
      getPosition: this.props.getPosition,
      pickable: this.props.pickable,
      visible: this.props.visible
    });
    const markerLayer = this.props.markerLayer(makerLayerProps);
    return [circles, labels, markerLayer];
  }
}

ClusterLayer.layerName = 'ClusterLayer';
ClusterLayer.defaultProps = {
  shipStyle: 1,
  shipLabel: true,
  maxZoom: 10,
  clusterDistance: 30,
  getClusterRadius: (f: ClusterFeature<NonNullable<unknown>>) => 15 + Math.log(f.properties.point_count),
  getClusterFillColor: [200, 40, 160, 255],
  getClusterLineColor: [255, 255, 255],
  getClusterLineWidth: 2,
  clusterStroked: true,
  getClusterLabelColor: [255, 255, 255],
  getPosition: (d) => {
    if (d.geometry) return getCoord(d);
    else {
      console.error('пустая геометрия');
    }
  },
} as DefaultProps<_ClusterLayerProps>;
