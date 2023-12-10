import { Graph } from '../interface/graph';
import { LayoutOptions,BrandesKopfData } from '../interface/definition';
import { defaultOptions } from '../interface/constant';
import {assert} from '../utils/uuid';

export type stringIdMap = { [key: string]: string };
export type stringIdNumberMap = { [key: string]: number };
export type IdstringMap = { [key: string]: string };

export type BKGraph = Graph<BrandesKopfData>;

function getPos(g:BKGraph,vertex: string, vertices: string[], reversed = false): number {
  if (reversed) return vertices.length - g.data(vertex).pos - 1;
  return g.data(vertex).pos;
}

function getPrev(g:BKGraph,vertex: string, reversed = false): string {
  if (reversed) return g.data(vertex).next;
  return g.data(vertex).prev;
}

function getNext(g:BKGraph,vertex: string, reversed = false): string {
  if (reversed) return g.data(vertex).prev;
  return g.data(vertex).next;
}

function getDownMedianNeighborPos(g:BKGraph,vertex: string, min: number): number {
  const neighbors:string[] = [...g.outEdges(vertex)];
  const highs = neighbors.filter((v) => g.data(v).pos >= min);
  if (highs.length) return g.data(highs[0]).pos;
  if (neighbors.length) return g.data(neighbors[0]).pos;
  return -1;
}

function getConfictKey(from: string, to: string, reversed = false) {
  if (reversed) return `${to}_|_${from}`;
  return `${from}_|_${to}`;
}

function markstringCoflict(
  g:BKGraph,
  left: string,
  right: string,
  k0: number,
  k1: number,
  conflictResult: ConflictResult,
): ConflictResult {
  for(let neighbor of g.outEdges(left)){
    if(g.data(neighbor).pos < k0 || g.data(neighbor).pos > k1){
      conflictResult[getConfictKey(left, right)] = true;
    }
  }
  return conflictResult;
}

function preprocess(g:BKGraph,levels: string[][]) {
  levels.forEach((nodeIds, lvl) => {
    nodeIds.forEach((nodeId, pos) => {
      const node = g.data(nodeId);
      node.level = lvl;
      node.pos = pos;
      node.prev = nodeIds[pos - 1];
      node.next = nodeIds[pos + 1];
      assert(node.prev !== undefined)
      assert(node.next !== undefined);
    });
  });
}

export type ConflictResult = {
  [key: string]: boolean;
};

export function markConflicts(g:BKGraph,levels: string[][]): ConflictResult {
  const conflictResult: ConflictResult = {};
  // mark type 0, 1, 2 conflicts in linear time
  const verticalDepth = levels.length;
  for (let i = 0; i < verticalDepth - 1; i++) {
    const horizonWidth = levels[i].length;
    const vertices = levels[i];
    let k0 = 0,
      k1 = levels[i + 1].length - 1,
      l0 = 0;
    for (let l1 = 1; l1 < horizonWidth; l1++) {
      k1 = getDownMedianNeighborPos(g,vertices[l1], k0);
      if (k1 === -1) continue;
      if (k1 < k0) k1 = k0;
      for (; l0 <= l1; l0++) {
        markstringCoflict(g,vertices[l0], vertices[l1], k0, k1, conflictResult);
      }
      k0 = k1;
    }
  }
  return conflictResult;
}

function getUpperMedianNeighbors(g:BKGraph,vertex: string, verticalOrder = true, horizonOrder = true): string[] {
  let upperNeighbours = verticalOrder ? [...g.inEdges(vertex)] : [...g.outEdges(vertex)]
  const upperLength = upperNeighbours.length;
  if (upperLength === 0) return [];
  if (upperLength % 2 === 1) return [upperNeighbours[(upperLength - 1) / 2]];
  if (horizonOrder) {
    return [upperNeighbours[upperLength / 2 - 1], upperNeighbours[upperLength / 2]];
  } else {
    return [upperNeighbours[upperLength / 2], upperNeighbours[upperLength / 2 - 1]];
  }
}

export type AlignOptions = {
  conflicts: ConflictResult;
  root?: Map<string, string>;
  align?: Map<string, string>;
  horizonOrder?: boolean;
  verticalOrder?: boolean;
};

export type AlignResult = {
  root: Map<string, string>;
  align: Map<string, string>;
};

export function alignVertices(
  g:BKGraph,
  levels: string[][],
  { root = new Map(), align = new Map(), horizonOrder = true, verticalOrder = true, conflicts }: AlignOptions,
): AlignResult {
  const reorderedLevels = [...levels];
  if (root.size === 0 && align.size === 0) {
    levels
      .flatMap((vertices) => vertices)
      .map((v) => {
        root.set(v, v);
        align.set(v, v);
      });
  }
  if (!verticalOrder) {
    reorderedLevels.reverse();
  }
  if (!horizonOrder) {
    for (let i = 0; i < reorderedLevels.length; i++) {
      reorderedLevels[i] = [...reorderedLevels[i]];
      reorderedLevels[i].reverse();
    }
  }
  for (let vi = 1; vi < reorderedLevels.length; vi++) {
    let r = -1;
    for (let hi = 0; hi < reorderedLevels[vi].length; hi++) {
      const vertex = reorderedLevels[vi][hi];
      const upperNeighbours = getUpperMedianNeighbors(g,vertex, verticalOrder, horizonOrder);
      upperNeighbours.map((um) => {
        const posUm = getPos(g,um, reorderedLevels[vi - 1], !horizonOrder);
        if (align.get(vertex) === vertex) {
          if (!conflicts[getConfictKey(um, vertex)] && r < posUm) {
            align.set(um, vertex);
            root.set(vertex, root.get(um) as string);
            align.set(vertex, root.get(vertex) as string);
            r = posUm;
          }
        }
      });
    }
  }
  return { root, align };
}

export type CompactionOptions = {
  levels: string[][];
  root: Map<string, string>;
  align: Map<string, string>;
  horizonOrder: boolean;
  verticalOrder: boolean;
};

export type CompactionResult = {
  sink: stringIdMap;
  shift: stringIdNumberMap;
  xcoords: stringIdNumberMap;
};

export function compact(
  g:BKGraph,
  {
  root,
  align,
  horizonOrder = true,
  verticalOrder = true,
  levels,
}: CompactionOptions) {
  const sink: stringIdMap = {};
  const shift: stringIdNumberMap = {};
  let xcoords: stringIdNumberMap = {};
  let selfRoot: (string)[] = [];
  const vertices: (string)[] = [];
  root.forEach((_value, key) => {
    vertices.push(key);
  });
  vertices.map((vid) => {
    sink[vid] = vid;
    shift[vid] = Number.POSITIVE_INFINITY;
    if (vid === root.get(vid)) selfRoot.push(vid);
  });

  // sort root
  const ordered: (string)[] = [];
  const sortMap: { [key: string]: (string)[] } = {};
  selfRoot.map((vid) => {
    const prevVid = getPrev(g,vid, !horizonOrder);
    if (prevVid !== undefined) {
      const prevRootId = root.get(prevVid) as string;
      if (!sortMap[prevRootId]) {
        sortMap[prevRootId] = [vid];
      } else {
        sortMap[prevRootId].push(vid);
      }
    }
    const nextVid = getNext(g,vid, !horizonOrder);
    if (nextVid !== undefined) {
      const nextRootId = root.get(nextVid) as string;
      if (!sortMap[vid]) {
        sortMap[vid] = [nextRootId];
      } else {
        sortMap[vid].push(nextRootId);
      }
    }
  });

  while (selfRoot.length) {
    const tails: { [key: string]: boolean } = {};
    selfRoot.map((vid) => {
      sortMap[vid]?.map((tid) => {
        tails[tid] = true;
      });
    });
    const heads = selfRoot.filter((vid) => !tails[vid]);
    heads.map((vid) => {
      ordered.push(vid);
      delete sortMap[vid];
    });
    selfRoot = selfRoot.filter((vid) => !heads.includes(vid));
  }

  // root coordinates relative to sink
  ordered.map(
    (vid) =>
      (xcoords = placeBlock(g,vid, {
        root,
        align,
        sink,
        shift,
        xcoords,
        verticalOrder,
        horizonOrder,
        levels,
      })),
  );

  // absolute coordinates
  vertices.map((vid) => {
    const rootVid = root.get(vid) as string;
    xcoords[vid] = xcoords[rootVid];
    if (shift[sink[rootVid]] < Number.POSITIVE_INFINITY) {
      xcoords[vid] += shift[sink[rootVid]];
    }
  });
  return { sink, shift, xcoords };
}

export type BlockOptions = CompactionOptions & CompactionResult;

/**
 * @description mutant of original without recursion
 * @param v
 * @param options
 */
function placeBlock(g:BKGraph,vid: string, options: BlockOptions): stringIdNumberMap {
  const { sink, shift, root, align, xcoords, levels, horizonOrder } = options;
  const delta = 1;
  // vertex has been handled
  if (xcoords[vid] !== undefined) {
    return xcoords;
  }
  xcoords[vid] = 0;
  let w = vid;
  do {
    const level = levels[g.data(w).level];
    const vertex = w;
    if (getPos(g,vertex, level, !horizonOrder) === 0) {
      w = align.get(w) as string;
      continue;
    }
    const u = root.get(getPrev(g,vertex, !horizonOrder)) as string;
    if (sink[vid] === vid) sink[vid] = sink[u];
    if (sink[vid] !== sink[u]) {
      shift[sink[u]] = Math.min(shift[sink[u]], xcoords[vid] - xcoords[u] - delta);
    } else {
      xcoords[vid] = Math.max(xcoords[vid], xcoords[u] + delta);
    }
    w = align.get(w) as string;
  } while (w !== vid);
  return xcoords;
}

function balance(g:BKGraph,levels: string[][], xss: stringIdNumberMap[], options: LayoutOptions): string[][] {
  const { width, height, gutter = 0, margin = { left: 0, top: 0 } } = options;
  const { left = 0, top = 0 } = margin;
  levels
    .flatMap((vertices) => vertices)
    .map((v) => {
      const posList: number[] = xss.map((map) => map[v]);
      const xs: number = posList.reduce((prev, cur) => prev + cur, 0) / posList.length;
      const vertex = g.data(v);
      vertex.x = left + xs * (width + gutter);
      vertex.y = top + vertex.level * (height + gutter);
    });
  return levels;
}

function normalize(xcoords: stringIdNumberMap, reversed = false): { xcoords: stringIdNumberMap; width: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  Object.keys(xcoords).map((key) => {
    if (xcoords[key] < min) min = xcoords[key];
    if (xcoords[key] > max) max = xcoords[key];
  });
  const width = max - min;
  Object.keys(xcoords).map((key) => {
    if (min < 0) {
      xcoords[key] = xcoords[key] + Math.abs(min);
    }
    if (reversed) {
      xcoords[key] = width - xcoords[key];
    }
  });
  return { xcoords, width };
}

export function brandeskopf(g:BKGraph,levels: string[][], layoutOptions: LayoutOptions = defaultOptions) {
  preprocess(g,levels);
  const conflicts = markConflicts(g,levels);
  const xss: { xcoords: stringIdNumberMap; width: number }[] = [];
  [true, false].map((verticalOrder) => {
    [true, false].map((horizonOrder) => {
      const { root, align } = alignVertices(g,levels, {
        conflicts,
        verticalOrder,
        horizonOrder,
      });
      const { xcoords } = compact(g,{ root, align, horizonOrder, verticalOrder, levels });
      xss.push(normalize(xcoords, !horizonOrder));
    });
  });
  const minWidthXss = xss.map((xs) => xs.xcoords);
  return balance(g,levels, minWidthXss, layoutOptions);
}
