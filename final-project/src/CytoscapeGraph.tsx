import React, { ReactElement, useEffect, useState } from "react";
import { Graph as BellmansGraph, Edge } from "./Bellmans";
import { Button, Input } from "semantic-ui-react";
import CytoscapeComponent from "react-cytoscapejs";
import { StyledDiv, StyledInnerDiv, StyledText } from "./Styles";
export interface EdgeProps {
  edge: Edge;
  onChange: (a: string) => void
}
export const EdgeDisplay: React.FC<EdgeProps> = ({ edge, onChange }: EdgeProps) => {
  return (
    <div>
        <StyledText>
          {edge.from}-{edge.to}
        </StyledText>
        <Input onChange={(e) => {onChange(e.target.value)}} value={edge.weight}></Input>
    </div>
  );
};

export const GraphUI = () => {
  const [edges, setEdges] = useState<Edge[]>([
    { from: "A", to: "B", weight: 5 },
    { from: "A", to: "C", weight: 2 },
    { from: "C", to: "D", weight: 1 },
    { from: "D", to: "B", weight: 1 },
    { from: "A", to: "E", weight: 3 },
    { from: "E", to: "B", weight: 2 },
  ]);
  useEffect(() => {
    console.log(edges);
  }, [edges])

  const bellmanGraph = new BellmansGraph(edges);

  const [isDijkstra, setDijkstra] = useState(false);

  const elements = [
    { data: { id: "one", label: "Node 1" }, position: { x: 0, y: 0 } },
    { data: { id: "two", label: "Node 2" }, position: { x: 100, y: 0 } },
    {
      data: { source: "one", target: "two", label: "Edge from Node1 to Node2" },
    },
  ];
  return (
    <StyledDiv>
      <StyledInnerDiv>
        {isDijkstra ? (
          <Button onClick={() => setDijkstra(!isDijkstra)}>
            Set Decentralized
          </Button>
        ) : (
          <Button onClick={() => setDijkstra(!isDijkstra)}>
            Set Centralized
          </Button>
        )}
        {
          edges.map((e, idx) => (
            <EdgeDisplay edge={e} onChange={(newWeight) => {
              const newEdges = edges;
              newEdges[idx].weight = newWeight as unknown as number;
              setEdges(newEdges);
            }}/>
          ))
        }
      </StyledInnerDiv>
      <CytoscapeComponent
        elements={elements}
        style={{ width: "1500px", height: "1500px" }}
      />
    </StyledDiv>
  );
};
