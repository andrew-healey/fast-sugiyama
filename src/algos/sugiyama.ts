/*
 * @author: sylsaint
 * @Description: sugiyama hierarchy algorightm
 * @params: {Graph} graph, {integer} width, {integer} height, {String} align
 * @return: {Graph} graph
 */

/*
 * Given a directed graph (digraph) G.V; E/ with a set of vertices Vand a set of edges E,the Sugiyama algorithm solves the problem of ﬁnding a 2D
 * hierarchical drawing of G subject to thefollowing readability requirements:
 * (a) Vertices are drawn on horizontal lines without overlapping; each line represents a level in thehierarchy; all edges point downwards.
 * (b) Short-span edges (i.e., edges between adjacent levels) are drawn with straight lines.
 * (c) Long-span edges (i.e., edges between nonadjacent levels) are drawn as close to straight linesas possible.
 * (d) The number of edge crossings is the minimum.(e) Vertices connected to each other are placed as close to each other as possible.
 * (f) The layout of edges coming into (or going out of) a vertex is balanced, i.e., edges are evenlyspaced around a common target (or source) vertex.
 */

import { divide } from './weakconnect';
import { makeHierarchy } from './hierarchy';
import { LayoutOptions } from '../interface/definition';
import { defaultOptions } from '../interface/constant';
import { baryCentric } from './barycentric';
import { brandeskopf,BKGraph } from './brandeskopf';

export function layout(g: BKGraph, options = defaultOptions): BKGraph[] {
  const graphs: BKGraph[] = divide(g);
  let aggregateLeftMargin: number = 0;
  const mergedOptions: LayoutOptions = { ...options };
  const { width, gutter = 0 } = mergedOptions;
  return graphs.map((subGraph) => {
    const levels: string[][] = makeHierarchy(subGraph);
    const { levels: orderedLevels } = baryCentric(g,levels, {});
    brandeskopf(subGraph,orderedLevels, mergedOptions);
    const maxWidth: number = Math.max.apply(
      null,
      orderedLevels.flatMap((nodeIds) => nodeIds).map((nodeId) => g.data(nodeId).x!),
    );
    aggregateLeftMargin = maxWidth + width + (gutter || 20);
    mergedOptions.margin = { ...(mergedOptions.margin || {}), left: aggregateLeftMargin };
    return subGraph;
  });
}
