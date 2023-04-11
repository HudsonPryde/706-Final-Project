"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graph_js_1 = require("../typescript/utils/graph.js");
var Dijkstra = /** @class */ (function (_super) {
    __extends(Dijkstra, _super);
    function Dijkstra() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dijkstra.prototype.dijkstra = function (startNode, endNode) {
        var nodes = d_graph.getNodes();
        var distances = {};
        var predecessors = {};
        var N = []; // N is the array of definite least-cost path nodes
        // INITIALIZATION: 
        N.push(startNode);
        // init distances to infinity except when they are direct neighbours of start node
        var neighbors = d_graph.getNeighbors(startNode);
        for (var node in nodes) {
            distances[nodes[node]] = Infinity;
            predecessors[nodes[node]] = 'null';
        }
        for (var node in nodes) {
            if (node in neighbors) {
                for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                    var neighbor = neighbors_1[_i];
                    distances[neighbor.to] = neighbor.weight;
                    predecessors[neighbor.to] = startNode;
                }
            }
        }
        distances[startNode] = 0;
        delete predecessors[startNode];
        // MAIN LOOP:
        while (N.length <= d_graph.getNodes().length) {
            var nextNodes = [];
            var min = undefined;
            var minNode = '';
            for (var node in nodes) {
                if (N.indexOf(nodes[node]) == -1 && distances[nodes[node]] < Infinity) {
                    nextNodes.push(nodes[node]);
                }
                for (var n in nextNodes) {
                    if (min != undefined && distances[nextNodes[n]] < min) {
                        min = distances[nextNodes[n]];
                        minNode = nextNodes[n];
                    }
                }
                var neighbors_3 = d_graph.getNeighbors(minNode);
                for (var _a = 0, neighbors_2 = neighbors_3; _a < neighbors_2.length; _a++) {
                    var neighbor = neighbors_2[_a];
                    // check all neighbours of the new node;
                    var distance = distances[minNode] + neighbor.weight;
                    if (distance < distances[neighbor.to]) {
                        // update the distance and the predecessor if new dist is less than previous
                        distances[neighbor.to] = distance;
                        predecessors[neighbor.to] = minNode;
                    }
                }
                N.push(minNode);
            }
        }
        var path = [endNode];
        var current = endNode;
        while (current !== startNode) {
            var predecessor = predecessors[current];
            if (!predecessor) {
                // no path return empty array
                return [];
            }
            path.unshift(predecessor);
            current = predecessor;
        }
        return path.map(function (node) { return [node, distances[node]]; });
    };
    return Dijkstra;
}(graph_js_1.Graph));
//Usage
var edges = [
    { from: 'A', to: 'B', weight: 5 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'B', weight: 1 },
    { from: 'A', to: 'E', weight: 3 },
    { from: 'E', to: 'B', weight: 2 },
];
var d_graph = new Dijkstra(edges);
var shortestPath = d_graph.dijkstra('A', 'E');
console.log(shortestPath);
