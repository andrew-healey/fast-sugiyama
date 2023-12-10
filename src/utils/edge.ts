import {Graph} from '../interface/graph';
import {assert} from './uuid'

export function edgeMatrix(g:Graph<any>,ups: string[], downs: string[]): number[][] {
  const edgeMatrix = ups.map((up) => 
    downs.map((down) => { 
      assert(g.hasNode(up));
      assert(g.hasNode(down));
      return g.outEdges(up).has(down) ? 1 : 0
    })
  );
  return edgeMatrix;
}

export function range(from: number, to: number, step?: number): Array<number> {
  const sign = from < to ? 1 : -1;
  step = Math.abs(step || 1) * sign;
  let length = Math.ceil((to - from) / step);
  const rt = Array(length + 1);
  let index = -1;
  while (length--) {
    rt[++index] = from;
    from += step;
  }
  rt[++index] = to;
  return rt;
}
