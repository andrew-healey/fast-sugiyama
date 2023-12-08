Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcHierachyLayout = void 0;
var sun_hierarchy_1 = __webpack_require__( /*! sun-hierarchy */ "./node_modules/sun-hierarchy/dist/index.js");

function calcHierachyLayout(graph) {
  var vMap = {};
  var vertices = graph.vertices.map(function(v) {
    var node = new sun_hierarchy_1.Vertex(v.id);
    vMap[v.id] = node;
    return node;
  });
  var edges = graph.edges
    .map(function(e) {
      if (vMap[e.source] && vMap[e.target]) {
        return new sun_hierarchy_1.Edge(vMap[e.source], vMap[e.target]);
      }
      return undefined;
    })
    .filter(function(e) {
      return !!e;
    });
  var g = new sun_hierarchy_1.Graph(vertices, edges, {
    directed: true
  });
  var graphs = (0, sun_hierarchy_1.default)(g, {
    margin: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    },
    width: 180,
    height: 180,
    gutter: 10,
  });
  return graphs;
}
exports.calcHierachyLayout = calcHierachyLayout;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGxheWdyb3VuZC9sYXlvdXQudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcGxheWdyb3VuZC9sYXlvdXQudHM/NmI0MyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbGF5b3V0LCB7IEdyYXBoLCBWZXJ0ZXgsIEVkZ2UgfSBmcm9tIFwic3VuLWhpZXJhcmNoeVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FsY0hpZXJhY2h5TGF5b3V0KGdyYXBoOiB7IHZlcnRpY2VzOiBhbnlbXTsgZWRnZXM6IGFueVtdIH0pIHtcbiAgY29uc3Qgdk1hcDogeyBba2V5OiBzdHJpbmddOiBWZXJ0ZXggfSA9IHt9O1xuICBjb25zdCB2ZXJ0aWNlczogQXJyYXk8VmVydGV4PiA9IGdyYXBoLnZlcnRpY2VzLm1hcCgodikgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBuZXcgVmVydGV4KHYuaWQpO1xuICAgIHZNYXBbdi5pZF0gPSBub2RlO1xuICAgIHJldHVybiBub2RlO1xuICB9KTtcblxuICBjb25zdCBlZGdlczogQXJyYXk8RWRnZT4gPSBncmFwaC5lZGdlc1xuICAgIC5tYXAoKGUpID0+IHtcbiAgICAgIGlmICh2TWFwW2Uuc291cmNlXSAmJiB2TWFwW2UudGFyZ2V0XSkge1xuICAgICAgICByZXR1cm4gbmV3IEVkZ2Uodk1hcFtlLnNvdXJjZV0sIHZNYXBbZS50YXJnZXRdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSlcbiAgICAuZmlsdGVyKChlKSA9PiAhIWUpO1xuXG4gIGNvbnN0IGcgPSBuZXcgR3JhcGgodmVydGljZXMsIGVkZ2VzLCB7IGRpcmVjdGVkOiB0cnVlIH0pO1xuICBjb25zdCBncmFwaHMgPSBsYXlvdXQoZywge1xuICAgIG1hcmdpbjogeyBsZWZ0OiAyMCwgcmlnaHQ6IDIwLCB0b3A6IDIwLCBib3R0b206IDIwIH0sXG4gICAgd2lkdGg6IDE4MCxcbiAgICBoZWlnaHQ6IDE4MCxcbiAgICBndXR0ZXI6IDEwLFxuICB9KTtcbiAgcmV0dXJuIGdyYXBocztcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6QkE7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/playground/layout.ts