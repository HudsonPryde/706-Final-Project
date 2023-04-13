export interface Edge {
  from: string;
  to: string;
  weight: number;
  isHighlighted?: boolean;
}

export class Graph {
  private edges: Edge[];

  constructor(edges: Edge[]) {
    this.edges = edges;
  }

  private getNodes(): string[] {
    const nodes = new Set<string>();
    for (const edge of this.edges) {
      nodes.add(edge.from);
      nodes.add(edge.to);
    }
    return Array.from(nodes);
  }

  private getNeighbors(node: string): Edge[] {
    return this.edges.filter((edge) => edge.from === node);
  }

  public async bellmanFord(
    cy: any,
    startNode: string,
    endNode: string
  ): Promise<(string | number)[][]> {
    console.log(this.edges)
    const nodes = this.getNodes();
    const distances: Record<string, number> = {};
    const predecessors: Record<string, string> = {};
    const animationSteps: (() => void)[] = [];

    for (const node of nodes) {
      // algortithm is decentralized, so initial distances are set to infinity
      distances[node] = Infinity;
      predecessors[node] = "null";
    }

    distances[startNode] = 0;

    // calculate distances
    for (let i = 0; i < nodes.length - 1; i++) {
      for (const node of nodes) {
        const neighbors = this.getNeighbors(node);
        for (const neighbor of neighbors) {
          // if the distance to the neighbor is shorter than the current distance
          const distance = distances[node] + neighbor.weight;
          if (distance < distances[neighbor.to]) {
            // update the distance and the predecessor
            distances[neighbor.to] = distance;
            predecessors[neighbor.to] = node;

            animationSteps.push(() => {
              cy.$(`[id='${neighbor.to}']`).style('background-color', 'orange');
              cy.$(`[id='${neighbor.to}']`).animate({ style: { 'background-color': 'red' } }, { duration: 500 });
              cy.$(`[id='${neighbor.to}']`).animate({ style: { 'background-color': 'orange' } }, { duration: 500 });
            });
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
      const node = cy.$id(current);
      animationSteps.push(() => {
        node.style('background-color', 'green');
      });
      //console.log(current);
      path.unshift(predecessor);
      current = predecessor;
    }
    animationSteps.push(() => cy.$(`[id='${startNode}']`).style('background-color', 'green'));

    await new Promise<void>((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        animationSteps[i]();
        i++;
        if (i >= animationSteps.length) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });

    return path.map((node) => [node, distances[node]]);
    // return path;
  }
}

// Usage
// const edges: Edge[] = [
//   { from: 'A', to: 'B', weight: 5 },
//   { from: 'A', to: 'C', weight: 2 },
//   { from: 'C', to: 'D', weight: 1 },
//   { from: 'D', to: 'B', weight: 1 },
//   { from: 'A', to: 'E', weight: 3 },
//   { from: 'E', to: 'B', weight: 2 },
// ];

// const graph = new Graph(edges);
// const shortestPath = graph.bellmanFord('A', 'B');
// console.log(shortestPath); // [ 3, 5 ]
