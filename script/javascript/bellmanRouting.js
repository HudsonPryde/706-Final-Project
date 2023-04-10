var GraphJS = /** @class */ (function () {
    function GraphJS(edges) {
        this.edges = edges;
    }
    GraphJS.prototype.getNodes = function () {
        var nodes = new Set();
        for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            nodes.add(edge.from);
            nodes.add(edge.to);
        }
        return Array.from(nodes);
    };
    GraphJS.prototype.getNeighbors = function (node) {
        return this.edges.filter(function (edge) { return edge.from === node; });
    };
    GraphJS.prototype.bellmanFord = function (startNode, endNode) {
        var nodes = this.getNodes();
        var distances = {};
        var predecessors = {};
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            // algortithm is decentralized, so initial distances are set to infinity
            distances[node] = Infinity;
            predecessors[node] = 'null';
        }
        distances[startNode] = 0;
        // calculate distances
        for (var i = 0; i < nodes.length - 1; i++) {
            for (var _a = 0, nodes_2 = nodes; _a < nodes_2.length; _a++) {
                var node = nodes_2[_a];
                var neighbors = this.getNeighbors(node);
                for (var _b = 0, neighbors_1 = neighbors; _b < neighbors_1.length; _b++) {
                    var neighbor = neighbors_1[_b];
                    // if the distance to the neighbor is shorter than the current distance
                    var distance = distances[node] + neighbor.weight;
                    if (distance < distances[neighbor.to]) {
                        // update the distance and the predecessor
                        distances[neighbor.to] = distance;
                        predecessors[neighbor.to] = node;
                    }
                }
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
            //console.log(current);
            path.unshift(predecessor);
            current = predecessor;
        }
        return path.map(function (node) { return [node, distances[node]]; });
        // return path;
    };
    return GraphJS;
}());
// Usage

function myFunction() {
    var edges = [
        { from: 'A', to: 'B', weight: 5 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'C', to: 'D', weight: 1 },
        { from: 'D', to: 'B', weight: 1 },
        { from: 'A', to: 'E', weight: 3 },
        { from: 'E', to: 'B', weight: 2 },
    ];
    var graph = new GraphJS(edges);
    var shortestPath = graph.bellmanFord('A', 'B');
    console.log(shortestPath); // [ [ 'A', 0 ], [ 'C', 2 ], [ 'D', 3 ], [ 'B', 4 ] ]
}
