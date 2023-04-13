import React, { FC, useState, useRef } from "react";
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
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startSide, setStartSide] = useState('');
  const [endSide, setEndSide] = useState('');

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
  const cyRef = useRef<cytoscape.Core | null>(null);

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

  /**
   * Removes the last node and any edges connecting to that node
   */
  function removeLastNodeAndEdges() {
    var nodes = data.nodes;
    var lastNode = nodes.pop()?.data.id;

    var newEdge = edges;
    var removedEdge: Edge[] = [];
    for(let i = 0; i < edges.length; i++) {
      if(newEdge[i].from === lastNode || newEdge[i].to === lastNode) {
        removedEdge.push(newEdge[i]);
      }
    } 
    console.log(removedEdge);
    newEdge = newEdge.filter(edge => removedEdge.indexOf(edge) < 0);
    setEdges(newEdge)
    setNumberOfNodes(numberOfNodes - 1);
  }
  
  function removeAllHighlight() {
    const newEdges = [...edges];
      for (let j = 0; j < newEdges.length; j++) {
        newEdges[j].isHighlighted = false;
      }
    setEdges(newEdges); 
  }

  function directedToUndirected(cy: cytoscape.Core): Edge[] {
    let paralellEdges = [...edges];
    cy.edges().forEach((edge) => {
      const source = edge.source();
      const target = edge.target();
      // check if there is a reverse edge already
      const hasReverse = cy.edges().some((e) => {
        console.log(e.data('source'), e.data('target'))
        return e.data('source') === target.id() && e.data('target') === source.id();
      });
      console.log(source, target, hasReverse)
      if (!hasReverse) {
        // create a reverse edge
        paralellEdges.push({from: target.id(), to: source.id(), weight: edge.data('label')});
      }
    });
    return paralellEdges;
  }

  return (
    <StyledDiv>
      <StyledInnerDiv>
        <div style={{ border: "1px solid blue" }}>
          <Form onSubmit={(event) => {
            event.preventDefault();
            const startNode = event.currentTarget.start.value;
            const endStartSide = event.currentTarget.startSide.value;
            const endNode = event.currentTarget.end.value;
            const endNodeSide = event.currentTarget.endSide.value;
            if(endStartSide == "server" && endStartSide == endNodeSide) {
              alert("No server-server communication")
            }
            else {
              setStart(startNode);
              setStartSide(endStartSide);
              setEnd(endNode);
              setEndSide(endNodeSide);
            }
            //Need to call setStart() or setEnd() on input change instead of this way
          }}>
            <Button
              onClick={async (event) => {
                removeAllHighlight()
                // clear node colors
                cyRef.current!.nodes().forEach(((node) => {node.style('background-color', ''); return true;}));
                const undirected =  directedToUndirected(cyRef.current!);
                const graph = new BellmansGraph(undirected);
                const res = await graph.bellmanFord(cyRef.current!, start, end);

                const newEdges = [...undirected];
                for (let i = 0; i < res.length - 1; i++) {
                  for (let j = 0; j < newEdges.length; j++) {
                    if ((
                      newEdges[j].from === res[i][0] &&
                      newEdges[j].to === res[i + 1][0]
                    ) || (
                      newEdges[j].to === res[i][0] &&
                      newEdges[j].from === res[i + 1][0]
                    )) {
                      newEdges[j].isHighlighted = true;
                    }
                  }
                }
                setEdges(newEdges);
              }}
            >
              Compute Decentralized
            </Button>
            <Button onClick={() => {
              removeAllHighlight()

              setDijkstra(!isDijkstra)

              /* Uncomment when dijkstra algorithm is added
              const graph = new DijkstraGraph(edges);
              const res = graph.dijkstra(start, end);

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
              setEdges(newEdges);
              */
            }}
            >
              Compute Centralized
            </Button>
            <br></br>
            <label>Find shortest path</label>
            <Form.Field>
              <label>Starting node:</label>
              <input name="start" minLength={1} maxLength={1} required></input>
              <select name="startSide" required>
                <option value="client">Client</option>
                <option value="server">Server</option>
              </select>
            </Form.Field>
            <Form.Field>
              <label>Ending node:</label>
              <input name="end" minLength={1} maxLength={1} required></input>
              <select name="endSide" required>
                <option value="client">Client</option>
                <option value="server">Server</option>
              </select>
            </Form.Field>
            <Button type="submit">Set Nodes</Button>
          </Form>
        </div>

        <Button
          onClick={() => {
            setNumberOfNodes(numberOfNodes + 1);
          }}
        >
          Add Node
        </Button>
        <Button 
          onClick={() => {
            //setNumberOfNodes(numberOfNodes - 1) moved to the function below;
            removeLastNodeAndEdges();
          }}>
          Remove Node (Last node)
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
              <input name="from" type="text" minLength={1} maxLength={1} required></input>
            </Form.Field>
            <Form.Field>
              <label>To:</label>
              <input name="to" type="text" minLength={1} maxLength={1} required></input>
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
          cy={(cy) => {cyRef.current = cy}}
        />
      </div>
    </StyledDiv>
  );
};
