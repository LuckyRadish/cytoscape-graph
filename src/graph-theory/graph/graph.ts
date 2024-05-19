import cytoscape, { Core, SearchVisitFunction } from 'cytoscape';
import { Parser } from '../parser';
import { Node } from '../tree/tree.interface';
import { IEdge, IGraph, IVertex, Visit } from './graph.interface';

/**
 * (1) Implement IGraph interface
 */
export class Graph implements IGraph {
  // root: Node;
  cy: Core;
  constructor(tree: Node) {
    // this.root = tree;

    /**
     * (2) Use Parser interface to parse tree
     */
    const parser: Parser = (tree, graph, parent) => {
      const vertices = graph?.vertices || [];
      const edges = graph?.edges || [];

      vertices.push(tree);

      if (parent) {
        edges.push({ source: parent.id, target: tree.id });
      }

      for (const child of tree.children) {
        parser(child, { vertices, edges }, tree);
      }

      return { vertices, edges };
    };

    const { vertices, edges } = parser(tree);

    /**
     * (3) Initialize cytoscape with parsed data
     */
    this.cy = cytoscape({
      elements: {
        nodes: vertices.map((data) => ({ data })),
        edges: edges.map((data) => ({ data })),
      },
    });
  }

  /**
   * (4) Use cytoscape under the hood
   */
  bfs(visit: Visit<IVertex, IEdge>) {
    this.cy.elements().bfs({
      roots: '#A',
      root: '#A',
      directed: true,
      visit: (v, e) =>
        visit(
          { id: v.id(), name: v.id() },
          { source: e?.source().id(), target: e?.target().id() }
        ),
    });

    /*
    let [head, tail] = [0, 0];

    const que = {
      [tail++]: this.root,
    };
    visit(this.root, { source: '', target: '' });

    while (head < tail) {
      const cur = que[head++];
      if (cur) {
        for (const next of cur.children) {
          visit(next, { source: cur.id, target: next.id });
          que[tail++] = next;
        }
      }
    }
    */
  }

  /**
   * (5) Use cytoscape under the hood
   */
  dfs(visit: Visit<IVertex, IEdge>) {
    this.cy.elements().dfs({
      roots: '#A',
      root: '#A',
      directed: true,
      visit: (v, e) =>
        visit(
          { id: v.id(), name: v.id() },
          { source: e?.source().id(), target: e?.target().id() }
        ),
    });

    /*
    const stk = [this.root];
    
    while (stk.length) {
      const cur = stk.pop();
      if (cur) {
        stk.push(...cur.children);
        visit(cur, { source: '', target: '' });
      }
    }
    */
  }
}
