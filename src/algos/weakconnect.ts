import Graph from '../interface/graph';
import {assert} from '../utils/uuid';

export function divide<T>(g: Graph<T>): Graph<T>[] {
  let graphs: Graph<T>[] = [];
  let visited: Set<string> = new Set;
  for(let v of g.ns()){
    if(visited.has(v)) continue;
    visited.add(v);

    const newGraph = new Graph<T>();

    let nodes: string[] = [v];
    newGraph.addNode(v);
    while (nodes.length) {
      const node: string = nodes.pop()!;
      assert(g.hasNode(node));

      for(let dependency of g.outEdges(node)) {
        newGraph.addNode(dependency);
        newGraph.addDependency(node, dependency);
      }

      for(let dependent of g.inEdges(node)) {
        newGraph.addNode(dependent);
        newGraph.addDependency(node, dependent);
      }
    }
    graphs.push(newGraph);
  };
  return graphs;
}
