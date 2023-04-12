import React, { FC, useState } from "react";
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

  const [isDijkstra, setDijkstra] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [numberOfNodes, setNumberOfNodes] = useState(5);
  const [refresh, setRefresh] = useState(false);

  const tracePath = async (cy: any, startNode: string, endNode: string) => {
    const graph = new BellmansGraph(edges);
    console.log(graph);
    let res = graph.bellmanFord(startNode, endNode);
    console.log(startNode, endNode, res);
    // res.forEach((node) => {
    //   cy.$id(node[0]).animate({
    //     style: {
    //       "background-color": "red",
    //     },
    //     duration: 1000,
    //   });
    // });
    for (let i = 0; i < res.length - 1; i++) {
      const node = cy.$id(res[i][0]);
      const edge = node.edgesWith(cy.$id(res[i+1][0]));
      console.log(edge);
      await edge.animate({
        style: {
          "line-color": "red",
        },
        duration: 1000,
      });
    }
  };

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

  const data: { nodes: ElementDefinition[]; edges: ElementDefinition[] } = {
    nodes: Array.from({ length: numberOfNodes }, (x, i) => {
      const letter = (i + 10).toString(36).toUpperCase();

      return {
        data: {
          id: letter,
          label: letter,
        },
        selectable: false,
        selected: selectedNodes.includes((i + 10).toString(36).toUpperCase()),
      };
    }),
    edges: edges.map((e) => ({
      data: {
        source: e.from,
        target: e.to,
        label: e.weight,
      },
      selectable: false,
      selected: e.isHighlighted,
    })),
  };
  console.log(data);

  return (
    <StyledDiv>
      <StyledInnerDiv>
        <div style={{ border: "1px solid blue" }}>
          <Form onSubmit={(event) => {
              event.preventDefault();
              setSelectedNodes([event.currentTarget.start.value, event.currentTarget.end.value])
              //Need to figure out how to pass these two values to decentralize and centralize button below
           }}>
            <Button
              onClick={(event) => {
                // // TODO: replace with nodes selected
                // const res = graph.bellmanFord(startNode, endNode);

                // const newEdges = [...edges];
                // for (let i = 0; i < res.length - 1; i++) {
                //   for (let j = 0; j < newEdges.length; j++) {
                //     if (
                //       newEdges[j].from === res[i][0] &&
                //       newEdges[j].to === res[i + 1][0]
                //     ) {
                //       newEdges[j].isHighlighted = true;
                //     }
                //   }
                // }
                // setEdges(newEdges);
                setRefresh(!refresh);
              }}
            >
              Compute Decentralized
            </Button>
            <Button onClick={() => setDijkstra(!isDijkstra)}>
              Compute Centralized
            </Button>
            <br></br>
            <label>Find shortest path</label>
            <Form.Field>
              <label>Starting node:</label>
              <input name="start"></input>
            </Form.Field>
            <Form.Field>
              <label>Ending node:</label>
              <input name="end"></input>
            </Form.Field>
            <Button type="submit">Submit</Button>
          </Form>
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
            var collection = cy.collection();
            cy.nodes().on("click", (evt) => {
              var clickedNode = evt.target;
              if (collection.length > 2) {
                collection = cy.collection();
              }
              collection = collection.union(clickedNode);
              console.log(clickedNode.data('id'), collection.length);
              if (collection.length === 2) {
                tracePath(cy, collection[0].data('id'), collection[1].data('id'));
              }
            });
          }}
        />
      </div>
    </StyledDiv>
  );
};
