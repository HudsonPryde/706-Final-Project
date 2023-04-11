"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
var Graph = /** @class */ (function () {
    function Graph(edges) {
        this.edges = edges;
    }
    Graph.prototype.getNodes = function () {
        var nodes = new Set();
        for (var _i = 0, _a = this.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            nodes.add(edge.from);
            nodes.add(edge.to);
        }
        return Array.from(nodes);
    };
    Graph.prototype.getNeighbors = function (node) {
        return this.edges.filter(function (edge) { return edge.from === node; });
    };
    return Graph;
}());
exports.Graph = Graph;
