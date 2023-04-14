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

  private findMinimum(nextNodes: Array<string>, distances: Record<string, number>): string{
    let min: number = -1
    let minNode: string = '';
    for (const n in nextNodes){
      if (min == -1 || distances[nextNodes[n]] < min) {
        min = distances[nextNodes[n]];
        minNode = nextNodes[n];
      }
    }
    return minNode
  }


  public async dijkstra(
    cy: any,
    startNode: string,
    endNode: string
    ): Promise<(string | number)[][]> {
    console.log(this.edges)
    const nodes = this.getNodes();
    const distances: Record<string, number> = {};
    const predecessors: Record<string, string> = {};
    const N: Array<string> = []; // N is the array of definite least-cost path nodes
    const animationSteps: (() => void)[] = [];

    // INITIALIZATION: 

    N.push(startNode);

    // init distances to infinity except when they are direct neighbours of start node
    const neighbors = this.getNeighbors(startNode)

    for (const node in nodes){
        distances[nodes[node]] = Infinity;
        predecessors[nodes[node]] = 'null';        
    }

    for (const node in nodes){
      if (node in neighbors) {
        for (const neighbor of neighbors){
          distances[neighbor.to] =  neighbor.weight;
          predecessors[neighbor.to] = startNode;
        }
      }
    }

    distances[startNode] = 0;
    delete predecessors[startNode];

    animationSteps.push(() => cy.$(`[id='${startNode}']`).style('background-color', 'green'));
    // MAIN LOOP:

    while (N.length <= this.getNodes().length){

      const nextNodes: Array<string> = nodes.filter(next => N.indexOf(next) == -1 && distances[next] < Infinity)
      const minNode: string = this.findMinimum(nextNodes, distances)

      const neighbors = this.getNeighbors(minNode)
        
      for (const neighbor of neighbors) {
        // check all neighbours of the new node;
        const distance = distances[minNode] + neighbor.weight;
        if (distance < distances[neighbor.to]) {
          // update the distance and the predecessor if new dist is less than previous
          distances[neighbor.to] = distance;
          predecessors[neighbor.to] = minNode;
        }

        animationSteps.push(() => {
          cy.$(`[id='${neighbor.to}']`).style('background-color', 'orange');
          cy.$(`[id='${neighbor.to}']`).animate({ style: { 'background-color': 'red' } }, { duration: 500 });
          cy.$(`[id='${neighbor.to}']`).animate({ style: { 'background-color': 'orange' } }, { duration: 500 });
        });
      }
      N.push(minNode);
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
      path.unshift(predecessor);
      current = predecessor;
    }

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
  }
} 
