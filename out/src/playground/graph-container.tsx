var __extends = (this && this.__extends) || (function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({
          __proto__: []
        }
        instanceof Array && function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var __assign = (this && this.__assign) || function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var React = __webpack_require__( /*! react */ "./node_modules/react/index.js");
var graph_1 = __webpack_require__( /*! @/components/graph */ "./src/components/graph.tsx");
var graph_data_1 = __webpack_require__( /*! ./graph-data */ "./src/playground/graph-data.ts");
__webpack_require__( /*! ./style.scss */ "./src/playground/style.scss");
var layout_1 = __webpack_require__( /*! ./layout */ "./src/playground/layout.ts");
var graphProps = {
  data: graph_data_1.graphData,
  edgeArrowSize: 8,
  gridSize: 4000,
  gridDotSize: 1,
  gridSpacing: 36,
  zoomRange: [0.1, 5],
  selected: [],
};
var GraphContainer = /** @class */ (function(_super) {
  __extends(GraphContainer, _super);

  function GraphContainer(props) {
    var _this = _super.call(this, props) || this;
    _this.counter = 0;
    _this.ref = null;
    _this.state = {
      graphConfig: graphProps,
    };
    _this.onAddNode = _this.onAddNode.bind(_this);
    _this.onZoomIn = _this.onZoomIn.bind(_this);
    _this.onZoomOut = _this.onZoomOut.bind(_this);
    _this.onAutoLayout = _this.onAutoLayout.bind(_this);
    return _this;
  }
  GraphContainer.prototype.onZoomIn = function() {
    this.ref.zoomIn(0.1);
  };
  GraphContainer.prototype.onZoomOut = function() {
    this.ref.zoomOut(0.1);
  };
  GraphContainer.prototype.onAddNode = function() {
    this.counter += 1;
    var i = this.counter;
    this.ref.addNodeWithData({
      id: "node-".concat(i),
      x: 1000 * Math.random(),
      y: 600 * Math.random(),
      title: "node-".concat(i),
      width: 180,
      height: 30,
      inPorts: [{
        id: "node-".concat(i, "-in-port-1"),
        type: "dataset",
      }, ],
      outPorts: [{
        id: "node-".concat(i, "-out-port-1"),
        type: "dataset",
      }, ],
    });
  };
  GraphContainer.prototype.onAutoLayout = function() {
    var nodes = this.ref.graph.nodes;
    var links = this.ref.graph.links;
    var graphs = (0, layout_1.calcHierachyLayout)({
      vertices: nodes,
      edges: links
    });
    var nodesToUpdate = graphs
      .flatMap(function(graph) {
        return graph.vertices;
      })
      .map(function(v) {
        var intervals = {};
        v.edges.map(function(edge) {
          var tmpNode = edge.down;
          var coords = [];
          var count = 0;
          while (tmpNode.getOptions("type") === "dummy") {
            coords.push({
              x: tmpNode.getOptions("x"),
              y: tmpNode.getOptions("y"),
            });
            tmpNode = tmpNode.edges.filter(function(edge) {
              return edge.up.id === tmpNode.id;
            })[0].down;
            count += 1;
            if (count > 10)
              break;
          }
          intervals[tmpNode.id] = coords;
        });
        return {
          id: v.id.toString(),
          x: v.getOptions("x"),
          y: v.getOptions("y"),
          internal: intervals,
        };
      });
    console.log(nodesToUpdate);
    this.ref.updateGraph(nodesToUpdate);
  };
  GraphContainer.prototype.render = function() {
    var _this = this;
    var graphConfig = this.state.graphConfig;
    return (React.createElement("div", null,
      React.createElement("div", {
          style: {
            padding: 20
          }
        },
        React.createElement("button", {
          style: {
            marginRight: 10
          },
          onClick: this.onAddNode
        }, "add node"),
        React.createElement("button", {
          style: {
            marginRight: 10
          },
          onClick: this.onZoomIn
        }, "enlarge"),
        React.createElement("button", {
          style: {
            marginRight: 10
          },
          onClick: this.onZoomOut
        }, "shrink"),
        React.createElement("button", {
          onClick: this.onAutoLayout
        }, "autolayout")),
      React.createElement("div", {
          style: {
            width: 1000,
            height: 600,
            marginLeft: 20,
            border: "1px solid #dedede",
            borderRadius: 2,
          }
        },
        React.createElement(graph_1.default, __assign({
          ref: function(ref) {
            return (_this.ref = ref);
          }
        }, graphConfig)))));
  };
  return GraphContainer;
}(React.Component));
exports.default = GraphContainer;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGxheWdyb3VuZC9ncmFwaC1jb250YWluZXIudHN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3BsYXlncm91bmQvZ3JhcGgtY29udGFpbmVyLnRzeD8zYzhjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IEdyYXBoVmlldywgeyBHcmFwaFByb3BzIH0gZnJvbSBcIkAvY29tcG9uZW50cy9ncmFwaFwiO1xuaW1wb3J0IHsgVmVydGV4IH0gZnJvbSBcInN1bi1oaWVyYXJjaHlcIjtcbmltcG9ydCB7IGdyYXBoRGF0YSB9IGZyb20gXCIuL2dyYXBoLWRhdGFcIjtcbmltcG9ydCBcIi4vc3R5bGUuc2Nzc1wiO1xuaW1wb3J0IHsgUG9ydERhdGEgfSBmcm9tIFwiQC9jb3JlL3BvcnRcIjtcbmltcG9ydCB7IGNhbGNIaWVyYWNoeUxheW91dCB9IGZyb20gXCIuL2xheW91dFwiO1xuaW1wb3J0IHsgTm9kZVVwZGF0ZSB9IGZyb20gXCJAL2NvcmUvbm9kZVwiO1xuXG5jb25zdCBncmFwaFByb3BzOiBHcmFwaFByb3BzID0ge1xuICBkYXRhOiBncmFwaERhdGEsXG4gIGVkZ2VBcnJvd1NpemU6IDgsXG4gIGdyaWRTaXplOiA0MDAwLFxuICBncmlkRG90U2l6ZTogMSxcbiAgZ3JpZFNwYWNpbmc6IDM2LFxuICB6b29tUmFuZ2U6IFswLjEsIDVdLFxuICBzZWxlY3RlZDogW10sXG59O1xuXG50eXBlIEdyYXBoU3RhdGUgPSB7XG4gIGdyYXBoQ29uZmlnOiBHcmFwaFByb3BzO1xufTtcblxuY2xhc3MgR3JhcGhDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBHcmFwaFN0YXRlPiB7XG4gIHJlZjogR3JhcGhWaWV3O1xuICBjb3VudGVyID0gMDtcbiAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZiA9IG51bGw7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGdyYXBoQ29uZmlnOiBncmFwaFByb3BzLFxuICAgIH07XG4gICAgdGhpcy5vbkFkZE5vZGUgPSB0aGlzLm9uQWRkTm9kZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25ab29tSW4gPSB0aGlzLm9uWm9vbUluLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vblpvb21PdXQgPSB0aGlzLm9uWm9vbU91dC5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25BdXRvTGF5b3V0ID0gdGhpcy5vbkF1dG9MYXlvdXQuYmluZCh0aGlzKTtcbiAgfVxuICBvblpvb21JbigpIHtcbiAgICB0aGlzLnJlZi56b29tSW4oMC4xKTtcbiAgfVxuICBvblpvb21PdXQoKSB7XG4gICAgdGhpcy5yZWYuem9vbU91dCgwLjEpO1xuICB9XG4gIG9uQWRkTm9kZSgpIHtcbiAgICB0aGlzLmNvdW50ZXIgKz0gMTtcbiAgICBjb25zdCBpID0gdGhpcy5jb3VudGVyO1xuICAgIHRoaXMucmVmLmFkZE5vZGVXaXRoRGF0YSh7XG4gICAgICBpZDogYG5vZGUtJHtpfWAsXG4gICAgICB4OiAxMDAwICogTWF0aC5yYW5kb20oKSxcbiAgICAgIHk6IDYwMCAqIE1hdGgucmFuZG9tKCksXG4gICAgICB0aXRsZTogYG5vZGUtJHtpfWAsXG4gICAgICB3aWR0aDogMTgwLFxuICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIGluUG9ydHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBgbm9kZS0ke2l9LWluLXBvcnQtMWAsXG4gICAgICAgICAgdHlwZTogXCJkYXRhc2V0XCIsXG4gICAgICAgIH0gYXMgUG9ydERhdGEsXG4gICAgICBdLFxuICAgICAgb3V0UG9ydHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBgbm9kZS0ke2l9LW91dC1wb3J0LTFgLFxuICAgICAgICAgIHR5cGU6IFwiZGF0YXNldFwiLFxuICAgICAgICB9IGFzIFBvcnREYXRhLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuICBvbkF1dG9MYXlvdXQoKSB7XG4gICAgY29uc3Qgbm9kZXMgPSB0aGlzLnJlZi5ncmFwaC5ub2RlcztcbiAgICBjb25zdCBsaW5rcyA9IHRoaXMucmVmLmdyYXBoLmxpbmtzO1xuICAgIGNvbnN0IGdyYXBocyA9IGNhbGNIaWVyYWNoeUxheW91dCh7IHZlcnRpY2VzOiBub2RlcywgZWRnZXM6IGxpbmtzIH0pO1xuICAgIGNvbnN0IG5vZGVzVG9VcGRhdGU6IE5vZGVVcGRhdGVbXSA9IGdyYXBoc1xuICAgICAgLmZsYXRNYXAoKGdyYXBoKSA9PiBncmFwaC52ZXJ0aWNlcylcbiAgICAgIC5tYXAoKHY6IFZlcnRleCkgPT4ge1xuICAgICAgICBjb25zdCBpbnRlcnZhbHM6IHsgW2tleTogc3RyaW5nXTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9W10gfSA9IHt9O1xuICAgICAgICB2LmVkZ2VzLm1hcCgoZWRnZSkgPT4ge1xuICAgICAgICAgIGxldCB0bXBOb2RlID0gZWRnZS5kb3duO1xuICAgICAgICAgIGNvbnN0IGNvb3JkczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9W10gPSBbXTtcbiAgICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICAgIHdoaWxlICh0bXBOb2RlLmdldE9wdGlvbnMoXCJ0eXBlXCIpID09PSBcImR1bW15XCIpIHtcbiAgICAgICAgICAgIGNvb3Jkcy5wdXNoKHtcbiAgICAgICAgICAgICAgeDogdG1wTm9kZS5nZXRPcHRpb25zKFwieFwiKSxcbiAgICAgICAgICAgICAgeTogdG1wTm9kZS5nZXRPcHRpb25zKFwieVwiKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdG1wTm9kZSA9IHRtcE5vZGUuZWRnZXMuZmlsdGVyKFxuICAgICAgICAgICAgICAoZWRnZSkgPT4gZWRnZS51cC5pZCA9PT0gdG1wTm9kZS5pZFxuICAgICAgICAgICAgKVswXS5kb3duO1xuICAgICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDEwKSBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaW50ZXJ2YWxzW3RtcE5vZGUuaWRdID0gY29vcmRzO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogdi5pZC50b1N0cmluZygpLFxuICAgICAgICAgIHg6IHYuZ2V0T3B0aW9ucyhcInhcIiksXG4gICAgICAgICAgeTogdi5nZXRPcHRpb25zKFwieVwiKSxcbiAgICAgICAgICBpbnRlcm5hbDogaW50ZXJ2YWxzLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgY29uc29sZS5sb2cobm9kZXNUb1VwZGF0ZSk7XG4gICAgdGhpcy5yZWYudXBkYXRlR3JhcGgobm9kZXNUb1VwZGF0ZSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZ3JhcGhDb25maWcgfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogMjAgfX0+XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17eyBtYXJnaW5SaWdodDogMTAgfX0gb25DbGljaz17dGhpcy5vbkFkZE5vZGV9PlxuICAgICAgICAgICAgYWRkIG5vZGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiAxMCB9fSBvbkNsaWNrPXt0aGlzLm9uWm9vbUlufT5cbiAgICAgICAgICAgIGVubGFyZ2VcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiAxMCB9fSBvbkNsaWNrPXt0aGlzLm9uWm9vbU91dH0+XG4gICAgICAgICAgICBzaHJpbmtcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMub25BdXRvTGF5b3V0fT5hdXRvbGF5b3V0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgICBtYXJnaW5MZWZ0OiAyMCxcbiAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI2RlZGVkZVwiLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8R3JhcGhWaWV3IHJlZj17KHJlZikgPT4gKHRoaXMucmVmID0gcmVmKX0gey4uLmdyYXBoQ29uZmlnfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JhcGhDb250YWluZXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFBQTtBQUdBO0FBQUE7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBR0E7QUFHQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQUE7QUFFQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/playground/graph-container.tsx