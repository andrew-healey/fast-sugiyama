// import { LayoutOptions } from '@/interface/definition';
import {LayoutOptions} from './definition.js';

// default property name for graph
export const PX = '_x';
export const PY = '_y';
export const DUMMY = 'dummy';

export enum Direction {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

export const defaultOptions: LayoutOptions = {
  margin: { left: 0, right: 0, top: 0, bottom: 0 },
  width: 100,
  height: 50,
  gutter: 0,
};
