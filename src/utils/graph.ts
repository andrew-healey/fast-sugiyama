import Graph from '../interface/graph';
import { CoordData } from '../interface/definition';
import { uuidv4 } from '../utils/uuid';
import {assert} from './uuid'

// in-place transpose edge direction
export function transpose<T>(g: Graph<T>): Graph<T> {
  const newGraph = new Graph<T>();
  for(let node of g.ns()){
    newGraph.addNode(node,g.data(node));
  }
  for(let node of g.ns()){
    for(let dependency of g.outEdges(node)){
      newGraph.addDependency(dependency,node);
    }
  }
  return newGraph;
}

export function printVertexNeighbours<T>(g: Graph<T>) {
  console.log('== print incident edges of vertex ==');
  for(let node in g.ns()){
    const outgoing = g.directDependenciesOf(node);
    const incoming = g.directDependantsOf(node);
    console.log(`${node} -> ${outgoing.join(',')}`);
    console.log(`${node} <- ${incoming.join(',')}`);
  }
}

export function getDummyId() {
  return uuidv4();
}

export function showVertices(g:Graph<CoordData>,levels: string[][]):string {
  const xs = levels.flatMap(nodeIds=>nodeIds.map(nodeId=>g.data(nodeId).x!));
  assert(xs.every(x=>typeof x === 'number'),'x should be number');
  const maxWidth = xs.reduce((acc,cur)=>Math.max(acc,cur),0);
  const ret = levels.map((nodeIds) => 
    nodeIds.reduce(({str,prevX},nodeId)=>{
      const node = g.data(nodeId);
      const spaces = (node.x! - prevX) * 50 / maxWidth;
      for(let i=0;i<spaces;i++) str += ' ';
      str += nodeId;
      return {str,prevX:node.x!};
    }, {str:'',prevX:0})
  ).join('\n');;

  console.log(ret);
  return ret;
}
