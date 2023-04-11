import { Graph } from './utils/graph.js';
import { Edge } from './utils/graph.js';

class Bellman extends Graph{

  public bellmanFord(startNode: string, endNode: string): (string | number)[][] {
    const nodes = b_graph.getNodes();
    const distances: Record<string, number> = {};
    const predecessors: Record<string, string> = {};

    for (const node of nodes) {
        // algortithm is decentralized, so initial distances are set to infinity
      distances[node] = Infinity;
      predecessors[node] = 'null';
    }

    distances[startNode] = 0;

    // calculate distances
    for (let i = 0; i < nodes.length - 1; i++) {
      for (const node of nodes) {
        const neighbors = b_graph.getNeighbors(node);
        for (const neighbor of neighbors) {
          // if the distance to the neighbor is shorter than the current distance
          const distance = distances[node] + neighbor.weight;
          if (distance < distances[neighbor.to]) {
            // update the distance and the predecessor
            distances[neighbor.to] = distance;
            predecessors[neighbor.to] = node;
          }
        }
      }
    }

    const path: string[] = [endNode];
    let current = endNode;

    while (current !== startNode) {
      const predecessor = predecessors[current];
      if (!predecessor) {
        // no path return empty array
        return [];
      }
      path.unshift(predecessor);
      current = predecessor;
    }

    return path.map((node) => [node, distances[node]]);
  }
}

// Usage
const edges: Edge[] = [
   { from: 'A', to: 'B', weight: (-5) },
   { from: 'A', to: 'C', weight: (-2) },
   { from: 'C', to: 'D', weight: (-3) },
   { from: 'D', to: 'B', weight: (-1) },
   { from: 'A', to: 'E', weight: 3 },
   { from: 'E', to: 'B', weight: 2 },
];

const b_graph = new Bellman(edges)
const shortestPath = b_graph.bellmanFord('A', 'B');
console.log(shortestPath); 