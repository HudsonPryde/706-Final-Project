export interface Edge {
    from: string;
    to: string;
    weight: number;
  }
  
  export class Graph {
    public edges: Edge[];
  
    constructor(edges: Edge[]) {
      this.edges = edges;
    }
  
    public getNodes(): string[] {
      const nodes = new Set<string>();
      for (const edge of this.edges) {
        nodes.add(edge.from);
        nodes.add(edge.to);
      }
      return Array.from(nodes);
    }
  
    public getNeighbors(node: string): Edge[] {
      return this.edges.filter((edge) => edge.from === node);
    }
}