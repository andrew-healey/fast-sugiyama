import { BaryCentricOptions } from '../algos/barycentric';

export interface LayoutOptions {
  margin?: Margin;
  gutter?: number;
  width: number;
  height: number;
  barycentricOptions?: BaryCentricOptions;
}

export interface Margin {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface Priority {
  up: number;
  down: number;
}

export interface Order {
  value: number;
  idx: number;
}

export interface BKOptions {
  root: object;
  align: object;
  sink: object;
  shift: object;
}

export type DummyData = {
  isDummy: boolean;
}

export type CoordData = {
  x: number|null;
  y: number;
}

export type BrandesKopfData = {
  pos: number; // position in the layer
  next: string; // id of the next node in the layer
  prev: string; // id of the previous node in the layer
  level: number; // level of the node
  x?: number; // x coordinate of the node
  y?: number; // y coordinate of the node
};