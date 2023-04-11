import React, { FC, useEffect, useState } from "react";
import { Graph as BellmansGraph, Edge } from "./Bellmans";
import { Button, Form, Input } from "semantic-ui-react";
import CytoscapeComponent from "react-cytoscapejs";
import { StyledDiv, StyledInnerDiv, StyledText } from "./Styles";
import { ElementDefinition } from "cytoscape";
export interface EdgeProps {
  edge: Edge;
  onChange: (a: string) => void;
}
export const EdgeDisplay: FC<EdgeProps> = ({ edge, onChange }: EdgeProps) => {
  return (
    <div>
      <StyledText>
        {edge.from}-{edge.to}
      </StyledText>
      <Input
        onChange={(e) => {
          e.preventDefault();
          onChange(e.target.value);
        }}
      ></Input>
    </div>
  );
};

export const GraphUI: FC = () => {
  const [edges, setEdges] = useState<Edge[]>([
    { from: "A", to: "B", weight: 5, isHighlighted: false },
    { from: "A", to: "C", weight: 2, isHighlighted: false },
    { from: "C", to: "D", weight: 1, isHighlighted: false },
    { from: "D", to: "B", weight: 1, isHighlighted: false },
    { from: "A", to: "E", weight: 3, isHighlighted: false },
    { from: "E", to: "B", weight: 2, isHighlighted: false },
  ]);

  useEffect(() => {
    console.log(edges);
  }, [edges]);

  const bellmanGraph = new BellmansGraph(edges);

  const [isDijkstra, setDijkstra] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [numberOfNodes, setNumberOfNodes] = useState(5);

  console.log(selectedNodes);

  useEffect(() => {
    console.log("selected nodes", selectedNodes);
  }, [selectedNodes]);
  useEffect(() => {
    console.log("edges: ", edges);
  }, [edges]);

  const layout = {
    name: "breadthfirst",
    fit: true,
    circle: true,
    directed: true,
    padding: 50,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false,
  };
  const layout2 = {
    name: "cose-bilkent",
  };

  const data = {
    nodes: Array.from({ length: numberOfNodes }, (x, i) => ({
      data: {
        id: (i + 10).toString(36).toUpperCase(),
        label: (i + 10).toString(36).toUpperCase(),
      },
      selectable: false,
      selected: selectedNodes.includes((i + 10).toString(36).toUpperCase()),
    })) as ElementDefinition[],
    edges: edges.map((e) => ({
      data: {
        source: e.from,
        target: e.to,
        label: e.weight,
      },
      selectable: false,
      selected: e.isHighlighted,
    })) as ElementDefinition[],
  };
  console.log(data);

  return (
    <StyledDiv>
      <StyledInnerDiv>
        <div style={{ border: "1px solid blue" }}>
          <Button
            onClick={() => {
              const graph = new BellmansGraph(edges);
              console.log(selectedNodes);
              const res = graph.bellmanFord("A", "B");
              console.log(res);

              const newEdges = [...edges];
              for (let i = 0; i < res.length - 1; i++) {
                for (let j = 0; j < newEdges.length; j++) {
                  if (
                    newEdges[j].from === res[i][0] &&
                    newEdges[j].to === res[i + 1][0]
                  ) {
                    newEdges[j].isHighlighted = true;
                  }
                }
              }
              console.log(newEdges);
              setEdges(newEdges);
            }}
          >
            Compute Decentralized
          </Button>
          <Button onClick={() => setDijkstra(!isDijkstra)}>
            Compute Centralized
          </Button>
        </div>
        <Button
          onClick={() => {
            setNumberOfNodes(numberOfNodes + 1);
          }}
        >
          Add Node
        </Button>
        <Button onClick={() => setNumberOfNodes(numberOfNodes - 1)}>
          Remove Node
        </Button>
        <Button
          onClick={() => {
            setEdges([
              { from: "A", to: "B", weight: 5, isHighlighted: false },
              { from: "A", to: "C", weight: 2, isHighlighted: false },
              { from: "C", to: "D", weight: 1, isHighlighted: false },
              { from: "D", to: "B", weight: 1, isHighlighted: false },
              { from: "A", to: "E", weight: 3, isHighlighted: false },
              { from: "E", to: "B", weight: 2, isHighlighted: false },
            ]);
            setEdges(
              edges.map((e) => ({
                ...e,
                isHighlighted: false,
              }))
            );
          }}
        >
          Reset
        </Button>
        <div style={{ border: "1px solid red" }}>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              const newEdges = [...edges];
              newEdges.push({
                from: event.currentTarget.from.value,
                to: event.currentTarget.to.value,
                weight: -1,
              });
              setEdges(newEdges);
            }}
          >
            <label>Add edge:</label>
            <Form.Field>
              <label>From:</label>
              <input name="from"></input>
            </Form.Field>
            <Form.Field>
              <label>To:</label>
              <input name="to"></input>
            </Form.Field>
            <Button type="submit">Submit</Button>
          </Form>
        </div>
        {edges.map((e, idx) => (
          <EdgeDisplay
            edge={e}
            onChange={(newWeight) => {
              const newEdges = [...edges];
              newEdges[idx].weight = Number(newWeight);
              setEdges(newEdges);
            }}
          />
        ))}
      </StyledInnerDiv>
      <div
        style={{
          border: "1px solid",
        }}
      >
        <CytoscapeComponent
          layout={layout}
          elements={CytoscapeComponent.normalizeElements(data)}
          style={{ width: "800px", height: "800px" }}
          cy={(cy) => {
            cy.on("tap", "node", (evt) => {
              var node = evt.target;
              // console.log("EVT", evt);
              // console.log("TARGET", node.data());
              // console.log("TARGET TYPE", typeof node[0]);
              if (selectedNodes.length === 0) {
                setSelectedNodes([node.data().id]);
              }
              if (selectedNodes.length === 2) {
                setSelectedNodes([node.data().id]);
              } else {
                setSelectedNodes([selectedNodes[0], node.data().id]);
              }
              console.log(selectedNodes);
            });
          }}
        />
      </div>
    </StyledDiv>
  );
};
