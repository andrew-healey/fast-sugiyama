import {assert} from '../utils/uuid';

  interface Options {
    circular?: boolean;
  }



/**
 * A simple dependency graph
 */

/**
 * Helper for creating a Topological Sort using Depth-First-Search on a set of edges.
 *
 * Detects cycles and throws an Error if one is detected (unless the "circular"
 * parameter is "true" in which case it ignores them).
 *
 * @param edges The edges to DFS through (this is a Map of node to Array of nodes)
 * @param leavesOnly Whether to only return "leaf" nodes (ones who have no edges)
 * @param result An array in which the results will be populated
 * @param circular A boolean to allow circular dependencies
 */
function createDFS(edges, leavesOnly, result, circular) {
  var visited = new Set();
  return function (start) {
    if (visited.has(start)) {
      return;
    }
    var inCurrentPath = new Set();
    var currentPath = [];
    var todo = []; // used as a stack
    todo.push({ node: start, processed: false });
    while (todo.length > 0) {
      var current = todo[todo.length - 1]; // peek at the todo stack
      var processed = current.processed;
      var node = current.node;
      if (!processed) {
        // Haven't visited edges yet (visiting phase)
        if (visited.has(node)) {
          todo.pop();
          continue;
        } else if (inCurrentPath.has(node)) {
          // It's not a DAG
          if (circular) {
            todo.pop();
            // If we're tolerating cycles, don't revisit the node
            continue;
          }
          currentPath.push(node);
          throw new DepGraphCycleError(currentPath);
        }

        inCurrentPath.add(node);
        currentPath.push(node);
        var nodeEdges = edges.get(node);
        // (push edges onto the todo stack in reverse order to be order-compatible with the old DFS implementation)
        for (var i = nodeEdges.length - 1; i >= 0; i--) {
          todo.push({ node: nodeEdges[i], processed: false });
        }
        current.processed = true;
      } else {
        // Have visited edges (stack unrolling phase)
        todo.pop();
        currentPath.pop();
        inCurrentPath.delete(node);
        visited.add(node);
        if (!leavesOnly || edges.get(node).length === 0) {
          result.push(node);
        }
      }
    }
  };
}

/**
 * Simple Dependency Graph
 */
class DepGraph<T> {
  private nodes: Map<string, T>;
  private outgoingEdges: Map<string, Set<string>>;
  private incomingEdges: Map<string, Set<string>>;
  private circular: boolean;

  constructor(opts?: { circular: boolean }) {
    this.nodes = new Map();
    this.outgoingEdges = new Map();
    this.incomingEdges = new Map();
    this.circular = !!opts && !!opts.circular;
  }

  /**
   * Creates an instance of DepGraph with optional Options.
   */
  public *ns(): IterableIterator<string> {
    for(let n in this.nodes) yield n;
  }

  public outEdges(node: string): Set<string> {
    const ret= this.outgoingEdges.get(node);
    assert(ret, `no out edges for ${node}`);
    return ret;
  }

  public inEdges(node: string): Set<string> {
    const ret= this.incomingEdges.get(node);
    assert(ret, `no in edges for ${node}`);
    return ret;
  }

  /**
   * The number of nodes in the graph.
   */
  public size(): number {
    return this.nodes.size;
  }

  /**
   * Add a node in the graph with optional data. If data is not given, name will be used as data.
   * @param {string} name
   * @param data
   */
  public addNode(name: string, data?: T): void {
    if (!this.hasNode(name)) {
      this.nodes.set(name, data || name as any);
      this.outgoingEdges.set(name, new Set());
      this.incomingEdges.set(name, new Set());
    }
  }

  /**
   * Remove a node from the graph.
   * @param {string} name
   */
  public removeNode(name: string): void {
    if (this.hasNode(name)) {
      this.nodes.delete(name);
      this.outgoingEdges.delete(name);
      this.incomingEdges.delete(name);
      [this.incomingEdges, this.outgoingEdges].forEach(function (edgeList) {
        edgeList.forEach( (v) => v.delete(name) );
      });
    }
  }

  /**
   * Check if a node exists in the graph.
   * @param {string} name
   */
  public hasNode(name: string): boolean {
    return this.nodes.has(name);
  }

  /**
   * Get the data associated with a node (will throw an Error if the node does not exist).
   * @param {string} name
   */
  public getNodeData(name: string): T {
    if (this.hasNode(name)) {
      return this.nodes.get(name);
    } else {
      throw new Error("Node does not exist: " + name);
    }
  }

  public data(name: string): T {
    return this.getNodeData(name);
  }

  /**
   * Set the data for an existing node (will throw an Error if the node does not exist).
   * @param {string} name
   * @param data
   */
  public setNodeData(name: string, data?: T): void {
    if (this.hasNode(name)) {
      this.nodes.set(name, data);
    } else {
      throw new Error("Node does not exist: " + name);
    }
  }

  /**
   * Add a dependency between two nodes (will throw an Error if one of the nodes does not exist).
   * @param {string} from
   * @param {string} to
   */
  public addDependency(from: string, to: string): void {
    if (!this.hasNode(from)) {
      throw new Error("Node does not exist: " + from);
    }
    if (!this.hasNode(to)) {
      throw new Error("Node does not exist: " + to);
    }
    if(!this.outgoingEdges.get(from).has(to)) {
      this.outgoingEdges.get(from).add(to);
    }
    if(!this.incomingEdges.get(to).has(from)) {
      this.incomingEdges.get(to).add(from);
    }
  }

  /**
   * Remove a dependency between two nodes.
   * @param {string} from
   * @param {string} to
   */
  public removeDependency(from: string, to: string): void {
    if(this.hasNode(from)) this.outgoingEdges.get(from).delete(to);
    if(this.hasNode(to)) this.incomingEdges.get(to).delete(from);
  }

  /**
   * Return a clone of the dependency graph (If any custom data is attached
   * to the nodes, it will only be shallow copied).
   */
  public clone(): DepGraph<T> {
    var result = new DepGraph<T>();
    this.nodes.forEach(function (v, n) {
      result.nodes.set(n, v);
      result.outgoingEdges.set(n, new Set(this.outgoingEdges.get(n)));
      result.incomingEdges.set(n, new Set(this.incomingEdges.get(n)));
    }, this);
    result.circular = this.circular;
    return result;
  }

  /**
   * Get an array containing the direct dependency nodes of the specified node.
   * @param name
   */
  public directDependenciesOf(name: string): string[] {
    if (this.hasNode(name)) {
      return [...this.outgoingEdges.get(name)];
    } else {
      throw new Error("Node does not exist: " + name);
    }
  }

  /**
   * Get an array containing the nodes that directly depend on the specified node.
   * @param name
   */
  public directDependantsOf(name: string): string[] {
    if (this.hasNode(name)) {
      return [...this.incomingEdges.get(name)];
    } else {
      throw new Error("Node does not exist: " + name);
    }
  }

  /**
   * Alias of `directDependantsOf`
   *
   * @see directDependantsOf
   * @param {string} name
   */
  public directDependentsOf(name: string): string[] {
    return this.directDependantsOf(name);
  }

  /**
   * Get an array containing the nodes that the specified node depends on (transitively). If leavesOnly is true, only nodes that do not depend on any other nodes will be returned in the array.
   * @param {string} name
   * @param {boolean} leavesOnly
   */
  public dependenciesOf(name: string, leavesOnly?: boolean): string[] {
    if (this.hasNode(name)) {
      var result = [];
      var DFS = createDFS(
        this.outgoingEdges,
        leavesOnly,
        result,
        this.circular
      );
      DFS(name);
      var idx = result.indexOf(name);
      if (idx >= 0) {
        result.splice(idx, 1);
      }
      return result;
    } else {
      throw new Error("Node does not exist: " + name);
    }
  }

  /**
   * Get an array containing the nodes that depend on the specified node (transitively). If leavesOnly is true, only nodes that do not have any dependants will be returned in the array.
   * @param {string} name
   * @param {boolean} leavesOnly
   */
  public dependantsOf(name: string, leavesOnly?: boolean): string[] {
    if (this.hasNode(name)) {
      var result = [];
      var DFS = createDFS(
        this.incomingEdges,
        leavesOnly,
        result,
        this.circular
      );
      DFS(name);
      var idx = result.indexOf(name);
      if (idx >= 0) {
        result.splice(idx, 1);
      }
      return result;
    } else {
      throw new Error("Node does not exist: " + name);
    }
  }

  /**
   * Alias of `dependantsOf`
   *
   * @see dependantsOf
   * @param name
   * @param leavesOnly
   */
  public dependentsOf(name: string, leavesOnly?: boolean): string[] {
    return this.dependantsOf(name, leavesOnly);
  }

  /**
   * Get an array of nodes that have no dependants (i.e. nothing depends on them).
   */
  public entryNodes(): string[] {
    return Array.from(this.nodes.keys()).filter(node => this.incomingEdges.get(node).size === 0);
  }

  /**
   * Construct the overall processing order for the dependency graph. If leavesOnly is true, only nodes that do not depend on any other nodes will be returned.
   * @param {boolean} leavesOnly
   */
  public overallOrder(leavesOnly?: boolean): string[] {
    var result = [];
    var keys = Array.from(this.nodes.keys());
    if (keys.length === 0) {
      return result; // Empty graph
    } else {
      if (!this.circular) {
        // Look for cycles - we run the DFS starting at all the nodes in case there
        // are several disconnected subgraphs inside this dependency graph.
        var CycleDFS = createDFS(this.outgoingEdges, false, [], this.circular);
        keys.forEach(function (n) {
          CycleDFS(n);
        });
      }

      var DFS = createDFS(
        this.outgoingEdges,
        leavesOnly,
        result,
        this.circular
      );
      // Find all potential starting points (nodes with nothing depending on them) an
      // run a DFS starting at these points to get the order
      keys
        .filter(node => this.incomingEdges.get(node).size === 0)
        .forEach(n => DFS(n));

      // If we're allowing cycles - we need to run the DFS against any remaining
      // nodes that did not end up in the initial result (as they are part of a
      // subgraph that does not have a clear starting point)
      if (this.circular) {
        keys
          .filter(node => result.indexOf(node) === -1)
          .forEach(n => DFS(n));
      }

      return result;
    }
  }
}

class DepGraphCycleError extends Error {
  public cyclePath: string[];

  constructor(cyclePath: string[]) {
    super("Dependency Cycle Found: " + cyclePath.join(" -> "));
    this.cyclePath = cyclePath;
    Object.setPrototypeOf(this, DepGraphCycleError.prototype);
  }
}

export type Graph<T=any> = DepGraph<T>;
export default DepGraph;

// class Configurable<T extends {}> {
//   options: T;
//   constructor(opts?: Partial<T>){
//     this.options = {...this.defaults,...(opts??{})};
//   }
//   get defaults():T{
//     throw new Error("not implemented")
//   }
//   getOptions(name: string) {
//     return this.options[name];
//   }
//   setOptions(name: string, value: any) {
//     this.options[name] = value;
//   }
//   removeOptions(name: string): any {
//     const v: any = this.options[name];
//     delete this.options[name];
//     return v;
//   }
// }

// class WithID<T extends {}> extends Configurable<T> {
//   private _id: number | string;
//   constructor(id:number|string,opts?:Partial<T>){
//     super(opts);
//     this._id = id;
//   }
//   get id() {
//     return this._id;
//   }
// }

// export class Vertex{
//   incoming: Set<Edge>;
//   notIncoming: Set<Edge>;
//   constructor() {
//     this.incoming = new Set;
//     this.notIncoming = new Set;
//   }
//   /*
//    * Adding edge which current vertext incident to
//    * @param: {Edge} e
//    * @return: {boolean}
//    */
//   public add(e: Edge): boolean {
//     if(e.down === this) this.incoming.set(e.up.id,e);
//     else this.notIncoming.set(e.down.id,e)
//     return true;
//   }
//   /*
//    * Removing edge which current vertext incident to
//    * @param: {Edge} e
//    * @return: {boolean}
//    */
//   public remove(e: Edge): boolean {
//     if(e.down.id == this.id) this.incoming.delete(e.up.id);
//     else this.notIncoming.delete(e.down.id);
//     return true;
//   }
//   /*
//    * return all the edges which current vertex is incident to
//    */
//   get edges(): Set<Edge> {
//     return new Set([...this.incoming.values(),...this.notIncoming.values()]);
//   }
// }

// /*
//  * Edge class: immutable
//  * @param: {Vertex} source -- endvertex
//  * @param: {Vertex} target -- endvertex
//  */
// export class Edge {
//   private source: Vertex;
//   private target: Vertex;
//   constructor(source: Vertex, target: Vertex) {
//     this.source = source;
//     this.target = target;
//   }
//   /*
//    * Returning upstream end vertex
//    * @return: {Vertex}
//    */
//   get up(): Vertex {
//     return this.source;
//   }
//   set up(v: Vertex) {
//     this.source = v;
//   }
//   /*
//    * Returning downstream end vertex
//    * @return: {Vertex}
//    */
//   get down(): Vertex {
//     return this.target;
//   }
//   set down(v: Vertex) {
//     this.target = v;
//   }
// }

// /*
//  * Common Graph class Representation, accepting vertices and edges
//  * @param: {Array<Vertex>} vertices
//  */
// export default class Graph {
//   private _vertices: Map<Vertex,number> = new Map;
//   private _verticesT: Map<number,Vertex> = new Map;
//   private maxVid:number = 0;
//   private _edges: Map<Edge,number> = new Map;
//   private _edgesT: Map<number,Edge> = new Map;
//   private maxEid:number = 0;
//   constructor(vertices?: Set<Vertex>, edges?: Set<Edge>) {
//     // note: only shallow copies
//     if(vertices) vertices.forEach((v) => this.addVertex(v));
//     if(edges) this.addEdges(edges);
//   }
//   findVertex(v: Vertex): number {
//     const ret = this._vertices.get(v);
//     assert(ret);
//     return ret!;
//   }
//   getVertexById(vid: number): Vertex {
//     const ret = this._verticesT.get(vid);
//     assert(ret);
//     return ret!;
//   }
//   hasVertex(v: Vertex): boolean {
//     return this._vertices.has(v);
//   }
//   addVertex(v: Vertex) {
//     if (!this.hasVertex(v)) {
//       this._vertices.set(v,this.maxVid);
//       this._verticesT.set(this.maxVid,v);
//       this.maxVid++;
//     }
//   }
//   removeVertex(v: Vertex): Vertex | any {
//     if (this.hasVertex(v)) {
//       const vid = this._vertices.get(v)!;
//       this._vertices.delete(v);
//       this._verticesT.delete(vid);
//       for(let e of v.edges) this.removeEdge(e);
//       return v;
//     }
//     return null;
//   }
//   hasEdge(edge: Edge): boolean {
//     const down: Vertex = edge.down;
//     return down.incoming.has(edge.up.id);
//   }
//   findEdge(edge: Edge): number {
//     return this._edges.get(edge)!;
//   }
//   addEdge(edge: Edge) {
//     if (this.edgeAddable(edge)) {
//       this._edges.set(edge,this.maxEid);
//       this._edgesT.set(this.maxEid,edge);
//       this.addEdgeToVertex(edge);
//     }
//   }
//   addEdges(edges: Set<Edge>) {
//     for(let edge of edges) this.addEdge(edge);
//   }
//   addEdgeToVertex(edge: Edge) {
//     edge.up.add(edge);
//     edge.down.add(edge);
//   }
//   edgeAddable(edge: Edge): boolean {
//     // my code:
//     return !this.hasEdge(edge) && this.hasVertex(edge.up) && this.hasVertex(edge.down);
//   }
//   removeEdge(edge: Edge): any {
//     if (this.hasEdge(edge)) {
//       const eid: number = this.findEdge(edge);
//       this._edges.delete(edge);
//       this._edgesT.delete(eid);

//       const up: Vertex = edge.up
//       const down: Vertex = edge.down;
//       assert(up && down)
//       up.remove(edge);
//       down.remove(edge);
//       return edge;
//     }
//     return null;
//   }
//   /*
//    * Return the number of vertices
//    */
//   get order(): number {
//     return this._vertices.size;
//   }
//   /*
//    * Indicate whether the graph is emtpy
//    */
//   get empty(): boolean {
//     return this.order == 0;
//   }
//   /*
//    * Indicate whether the graph is trivial
//    */
//   get trivial(): boolean {
//     return this.order <= 1;
//   }

//   *vertices(): IterableIterator<Vertex> {
//     yield* this._vertices.keys();
//   }

//   copy(): Graph {
//     const vertexCopies: Map<Vertex,Vertex> = new Map([...this._vertices.keys()].map((v) => [v,new Vertex(v.id,v.options)]));
//     const edgeCopies: Map<Edge,Edge> = new Map([...this._edges.keys()].map((e) => [e,new Edge(vertexCopies.get(e.up)!,vertexCopies.get(e.down)!) as Edge]));
//     const g: Graph = new Graph(new Set(vertexCopies.values()),new Set(edgeCopies.values()));
//     return g;
//   }
// }
