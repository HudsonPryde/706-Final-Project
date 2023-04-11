interface Edge {
    from: string;
    to: string;
    weight: number;
  }
  
  class Graph {
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
  
    public dijkstra(startNode: string, endNode: string): (string | number)[][] {
      const nodes = this.getNodes();
      const distances: Record<string, number> = {};
      const predecessors: Record<string, string> = {};
      const N: Array<string> = []; // N is the array of definite least-cost path nodes
      
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
  
  
      // MAIN LOOP:
  
      while (N.length <= this.getNodes().length){
        const nextNodes: Array<string> = []
        let min: number = -1
        let minNode: string = '';
  
        for (const node in nodes){
          if (N.indexOf(nodes[node]) == -1 && distances[nodes[node]] < Infinity) { 
            nextNodes.push(nodes[node])
          } 
          for (const n in nextNodes){
            if (distances[nextNodes[n]] < min || min == -1) {
              min = distances[nextNodes[n]];
              minNode = nextNodes[n];
            }
          }
  
          const neighbors = this.getNeighbors(minNode)
          for (const neighbor of neighbors) {
            // check all neighbours of the new node;
            const distance = distances[minNode] + neighbor.weight;
            if (distance < distances[neighbor.to]) {
              // update the distance and the predecessor if new dist is less than previous
              distances[neighbor.to] = distance;
              predecessors[neighbor.to] = minNode;
            }
          }
          N.push(minNode);
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
  // const edges: Edge[] = [
  //   { from: 'A', to: 'B', weight: 5 },
  //   { from: 'A', to: 'C', weight: 2 },
  //   { from: 'C', to: 'D', weight: 1 },
  //   { from: 'D', to: 'B', weight: 1 },
  //   { from: 'A', to: 'E', weight: 3 },
  //   { from: 'E', to: 'B', weight: 2 },
  // ];
  
  // const graph = new Graph(edges);
  // const shortestPath = graph.dijkstra('A', 'E');
  // console.log(shortestPath);