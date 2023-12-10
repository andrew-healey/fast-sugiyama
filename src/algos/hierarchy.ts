import Graph from '../interface/graph';
import { getDummyId } from '../utils/graph';
// import { PX, PY, DUMMY } from '@/interface/constant';
// import { CoordData } from '@/interface/definition';
// import { uuidv4 } from '@/utils/uuid';

const assert = (condition: boolean, message?: string) => {
  if (!condition) throw new Error(message);
}

const createDFS = (g:Graph<any>, order:(string[]|string)[]) => {
  const BLUE = true;
  const GREEN = false;
  const WHITE = undefined;
  const color:Map<string,true|false> = new Map(); // from node to color (true for blue, false for green, no entry for white)
  let cycleSet:Set<string> = new Set();
  let cycleStartIdx = Infinity;
  const path:string[] = [];
  const nodeDepthsInPath = new Map();

  const visit = (nodeId:string) => {
    const depth = path.length;
    path.push(nodeId);
    // console.log("push",node,depth);
    const nodeColor = color.get(nodeId);
    if (nodeColor === BLUE) {
      path.pop();
      // console.log("pop",node,depth);
      return;
    } else if (nodeColor === GREEN) {
      // cycle detected
      const nodeDepth = nodeDepthsInPath.get(nodeId);
      assert(nodeDepth !== undefined);

      cycleSet.add(nodeId);
      cycleStartIdx = Math.min(cycleStartIdx, nodeDepth);
      path.pop();
      // console.log("pop",node,depth);
    } else if (nodeColor === WHITE) {
      color.set(nodeId, GREEN);
      nodeDepthsInPath.set(nodeId, depth);

      const outgoingEdges = g.outEdges(nodeId);
      assert(outgoingEdges !== undefined);
      for(let dependency of outgoingEdges) {
        visit(dependency);
      }

      color.set(nodeId, BLUE);
      nodeDepthsInPath.delete(nodeId);

      path.pop();
      // console.log("pop",node,depth);
      if (path.length !== depth) debugger;
      assert(path.length === depth);

      if (cycleStartIdx === Infinity) order.push(nodeId);
      else if (depth === cycleStartIdx) {
        // put all the nodes in the cycle into the result, as one list
        order.push([...cycleSet]);

        // reset cycle detection
        cycleSet = new Set();
        cycleStartIdx = Infinity;
      } else {
        assert(depth > cycleStartIdx);
        cycleSet.add(nodeId);
      }
    } else {
      assert(false, "color must be one of BLUE, GREEN, WHITE");
    }
  };

  return visit;
};

export const getLayersWithCycles = (g:Graph<any>):string[][] => {
  const order:(string[]|string)[] = [];
  const dfsVisit = createDFS(g, order);

  for (let node of g.ns()) {
    dfsVisit(node);
  }

  // turn into layers
  // every layer has an ordered list of nodes (string) and cycles (string[]).
  const layers:(string[]|string)[][] = [];
  const layerMapping:Map<string,number> = new Map();

  for (let nodeOrNodes of order) {

    const isCycle = Array.isArray(nodeOrNodes);
    assert(
      isCycle || typeof nodeOrNodes === "string",
      `nodeOrSet is ${Object.getPrototypeOf(nodeOrNodes).constructor.name}`
    );

    const deps = isCycle
      ? (nodeOrNodes as string[]).flatMap((n) => [...g.outEdges(n)])
      : [...g.outEdges(nodeOrNodes as string)];
    const maxDepLayer = deps
      .map((dep) => (assert(layerMapping.has(dep)), layerMapping.get(dep)!))
      .reduce((max, layer) => (layer > max ? layer : max), -1);
    const layer = maxDepLayer + 1;
    if (!layers[layer]) layers[layer] = [];

    if (isCycle) {
      layers[layer].push([...(nodeOrNodes as string[])]);
      for (let node of nodeOrNodes as string[]) {
        layerMapping.set(node, layer);
      }
    } else {
      layers[layer].push(nodeOrNodes as string);
      layerMapping.set(nodeOrNodes as string, layer);
    }
  }

  // turn each layer into a list of lists. each list is either a cycle or a list of independent nodes.

  return layers.map((layer) => {
    const cycles = layer.filter((nodeOrSet) => Array.isArray(nodeOrSet)) as string[][];
    const nodes = layer.filter((nodeOrSet) => !Array.isArray(nodeOrSet)) as string[];
    return [nodes, ...cycles].flat() as string[];
  });
};

export function makeHierarchy(g: Graph<any>): string[][] {
  const layers = getLayersWithCycles(g).map((layer) => new Set(layer));;

  // add dummy vertices
  // iterate through layers. for every edge that doesn't end in the next layer, split it into two edges - one from src -> dummy in next layer, and one from dummy -> target

  for(let lid = 0; lid < layers.length - 1; lid++) {
    const currLayer = layers[lid];
    const nextLayer = layers[lid + 1];
    assert(lid+1===layers.length || nextLayer!==undefined);
    for(let v of currLayer){
      for(let n of g.inEdges(v)){
        if(nextLayer.has(n)) continue;

        const dummyId = getDummyId();
        g.addNode(dummyId,{});
        nextLayer.add(dummyId);

        // replace edge with two edges
        g.removeDependency(n,v);
        g.addDependency(n,dummyId);
        g.addDependency(dummyId,v);
      }
    }
  }

  return layers.map(l=>[...l]);
}


// export function makeHierarchy(g: Graph): Vertex[][] {
//   let roots: Vertex[] = [];
//   // find all the roots without incoming edges
//   let cloned: Graph = cloneGraph(g);
//   cloned.vertices.map((v) => {
//     let isRoot: boolean = true;
//     let outDegree: number = 0;
//     let inDegree: number = 0;
//     v.edges.map((edge) => {
//       if (edge.down == v) {
//         isRoot = false;
//         inDegree += 1;
//       } else {
//         outDegree += 1;
//       }
//     });
//     if (isRoot) {
//       roots.push(v);
//     } else {
//       v.setOptions('outInRatio', outDegree / inDegree);
//     }
//   });
//   // judge if roots is empty, if yes, add max (out(v) / in (v)) to roots
//   if (!roots.length) {
//     // find the maximum ratio
//     let max: number = 0;
//     cloned.vertices.map((v) => {
//       let ratio: number = v.getOptions('outInRatio');
//       if (ratio > max) max = ratio;
//     });
//     cloned.vertices.map((v) => {
//       if (v.getOptions('outInRatio') == max) roots.push(v);
//     });
//   }
//   let visited = [];
//   while (roots.length) {
//     const node: Vertex = roots.shift() as Vertex;
//     if (!node.getOptions(PY)) {
//       node.setOptions(PY, 1);
//     }
//     if (visited.indexOf(node) > -1) {
//       continue;
//     }
//     visited.push(node);
//     let exclude: Array<Edge> = [];
//     node.edges.map((edge) => {
//       const down: Vertex = edge.down;
//       exclude.push(edge);
//       let only: boolean = true;
//       // check if there are other incomming edges
//       down.edges.map((edge) => {
//         if (edge.up != node && edge.down == down) only = false;
//       });
//       if (only) {
//         let downLevel: number = down.getOptions(PY);
//         if (!downLevel) {
//           down.setOptions(PY, node.getOptions(PY) + 1);
//         } else {
//           // ensure even there are cycles, procedure can be terminated
//           if (downLevel < node.getOptions(PY) + 1 && downLevel != 1) {
//             down.setOptions(PY, node.getOptions(PY) + 1);
//           }
//         }
//         roots.push(down);
//       }
//     });
//     exclude.map((edge) => cloned.removeEdge(edge));
//   }
//   let levels: Array<Array<Vertex>> = adjustLevel(g, visited);
//   addDummy(g, levels);
//   return levels;
// }

// function adjustLevel(g: Graph, vertices: Array<Vertex>): Vertex[][] {
//   // retrieving real vertices from visited
//   let levels: Array<Array<Vertex>> = [];
//   let gVertices: Array<Vertex> = [];
//   vertices.map((v) => {
//     const found = findVertexById(g, v.id);
//     if (found) {
//       found.setOptions(PY, v.getOptions(PY));
//       found.setOptions(PX, v.getOptions(PX));
//       gVertices.push(found);
//     }
//   });
//   if (gVertices.length != vertices.length) {
//     throw new Error('vertices are not equal to expected !');
//   }
//   gVertices.map((v) => {
//     const lvl: number = v.getOptions(PY);
//     if (levels[lvl - 1]) {
//       levels[lvl - 1].push(v);
//     } else {
//       levels[lvl - 1] = [v];
//     }
//   });
//   for (let i: number = levels.length - 1; i >= 0; i--) {
//     let exclude: Array<Vertex> = [];
//     levels[i].map((v) => {
//       let min: number = Number.POSITIVE_INFINITY;
//       v.edges.map((edge) => {
//         if (edge.up == v && edge.down.getOptions(PY) < min) min = edge.down.getOptions(PY);
//       });
//       if (min != Number.POSITIVE_INFINITY && min != 1 && v.getOptions(PY) != min - 1) {
//         v.setOptions(PY, min - 1);
//         levels[min - 2].push(v);
//         exclude.push(v);
//       }
//     });
//     exclude.map((v) => {
//       const pos: number = levels[i].indexOf(v);
//       if (pos > -1) levels[i].splice(pos, 1);
//     });
//   }
//   return levels;
// }

// function addDummy(g: Graph, levels: Vertex[][]): Vertex[][] {
//   levels.map((level) => {
//     level.map((v, idx) => {
//       const currentLevel: number = v.getOptions(PY);
//       const dummyVertice: Array<Vertex> = [];
//       const dummyEdges: Array<Edge> = [];
//       const excludeEdges: Array<Edge> = [];
//       v.edges.map((edge) => {
//         if (edge.up != v) return;
//         let down: Vertex = edge.down;
//         const nextLevel: number = down.getOptions(PY);
//         let up: Vertex = v;
//         if (nextLevel - currentLevel > 1) {
//           for (let lvl: number = currentLevel + 1; lvl < nextLevel; lvl++) {
//             let dummpyVertex: Vertex = new Vertex(getDummyId(), { level: lvl, type: DUMMY });
//             dummyVertice.push(dummpyVertex);
//             dummyEdges.push(new Edge(up, dummpyVertex));
//             up = dummpyVertex;
//             if (idx >= levels[lvl - 1].length) {
//               levels[lvl - 1].push(dummpyVertex);
//             } else {
//               levels[lvl - 1].splice(idx, 0, dummpyVertex);
//             }
//           }
//           dummyEdges.push(new Edge(up, down));
//           excludeEdges.push(edge);
//         }
//       });
//       dummyVertice.map((v) => {
//         g.addVertex(v);
//       });
//       dummyEdges.map((e) => {
//         g.addEdge(e);
//       });
//       excludeEdges.map((e) => {
//         g.removeEdge(e);
//       });
//     });
//   });
//   return levels;
// }
