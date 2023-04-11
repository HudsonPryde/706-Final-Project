import { Graph } from './../utils/graph.js';
import { Edge } from './../utils/graph.js';

class Dijkstra extends Graph{

    public dijkstra(startNode: string, endNode: string): (string | number)[][] {
      const nodes = d_graph.getNodes();
      const distances: Record<string, number> = {};
      const predecessors: Record<string, string> = {};
      const N: Array<string> = []; // N is the array of definite least-cost path nodes
      
      // INITIALIZATION: 
  
      N.push(startNode);
  
      // init distances to infinity except when they are direct neighbours of start node
      const neighbors = d_graph.getNeighbors(startNode)
  
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
  
      while (N.length <= d_graph.getNodes().length){
        const nextNodes: Array<string> = []
        let min: number | undefined = undefined
        let minNode: string = '';
  
        for (const node in nodes){
          if (N.indexOf(nodes[node]) == -1 && distances[nodes[node]] < Infinity) { 
            nextNodes.push(nodes[node])
          } 
          for (const n in nextNodes){
            if (min !=undefined && distances[nextNodes[n]] < min) {
              min = distances[nextNodes[n]];
              minNode = nextNodes[n];
            }
          }
  
          const neighbors = d_graph.getNeighbors(minNode)
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
  //Usage
  
  const edges: Edge[] = [
    { from: 'A', to: 'B', weight: 5 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'B', weight: 1 },
    { from: 'A', to: 'E', weight: 3 },
    { from: 'E', to: 'B', weight: 2 },
  ];
  
  const d_graph = new Dijkstra(edges);
  const shortestPath = d_graph.dijkstra('A', 'E');
  console.log(shortestPath);
