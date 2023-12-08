Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphData = void 0;
var graphData = {
  id: "graph",
  svgCoords: {
    x: 0,
    y: 0,
    width: 3000,
    height: 3000,
  },
  gViewCoords: {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
  },
  nodes: [],
  links: [],
};
exports.graphData = graphData;
for (var i = 1; i < 1; i++) {
  graphData.nodes.push({
    id: "node-".concat(i),
    x: 1000 * Math.random(),
    y: 600 * Math.random(),
    title: "node-".concat(i),
    width: 180,
    height: 30,
    inPorts: [{
        id: "node-".concat(i, "-in-port-1"),
        type: "dataset",
      },
      {
        id: "node-".concat(i, "-in-port-2"),
        type: "dataset",
      },
      {
        id: "node-".concat(i, "-in-port-3"),
        type: "dataset",
      },
    ],
    outPorts: [{
        id: "node-".concat(i, "-out-port-1"),
        type: "dataset",
      },
      {
        id: "node-".concat(i, "-out-port-2"),
        type: "dataset",
      },
    ],
  });
}
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGxheWdyb3VuZC9ncmFwaC1kYXRhLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3BsYXlncm91bmQvZ3JhcGgtZGF0YS50cz84NTlhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdyYXBoSnNvbiB9IGZyb20gXCIuLi9jb3JlL2dyYXBoXCI7XG5pbXBvcnQgeyBQb3J0RGF0YSB9IGZyb20gXCIuLi9jb3JlL3BvcnRcIjtcbmltcG9ydCB7IE5vZGVEYXRhIH0gZnJvbSBcIi4uL2NvcmUvbm9kZVwiO1xuaW1wb3J0IHsgQ29vcmRTeXN0ZW0gfSBmcm9tIFwiLi4vdXRpbHMvY29vcmQtc3lzXCI7XG5cbmNvbnN0IGdyYXBoRGF0YTogR3JhcGhKc29uID0ge1xuICBpZDogXCJncmFwaFwiLFxuICBzdmdDb29yZHM6IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IDMwMDAsXG4gICAgaGVpZ2h0OiAzMDAwLFxuICB9IGFzIENvb3JkU3lzdGVtLFxuICBnVmlld0Nvb3Jkczoge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICBzY2FsZVg6IDEsXG4gICAgc2NhbGVZOiAxLFxuICB9IGFzIENvb3JkU3lzdGVtLFxuICBub2RlczogW10sXG4gIGxpbmtzOiBbXSxcbn07XG5cbmZvciAobGV0IGkgPSAxOyBpIDwgMTsgaSsrKSB7XG4gIGdyYXBoRGF0YS5ub2Rlcy5wdXNoKHtcbiAgICBpZDogYG5vZGUtJHtpfWAsXG4gICAgeDogMTAwMCAqIE1hdGgucmFuZG9tKCksXG4gICAgeTogNjAwICogTWF0aC5yYW5kb20oKSxcbiAgICB0aXRsZTogYG5vZGUtJHtpfWAsXG4gICAgd2lkdGg6IDE4MCxcbiAgICBoZWlnaHQ6IDMwLFxuICAgIGluUG9ydHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IGBub2RlLSR7aX0taW4tcG9ydC0xYCxcbiAgICAgICAgdHlwZTogXCJkYXRhc2V0XCIsXG4gICAgICB9IGFzIFBvcnREYXRhLFxuICAgICAge1xuICAgICAgICBpZDogYG5vZGUtJHtpfS1pbi1wb3J0LTJgLFxuICAgICAgICB0eXBlOiBcImRhdGFzZXRcIixcbiAgICAgIH0gYXMgUG9ydERhdGEsXG4gICAgICB7XG4gICAgICAgIGlkOiBgbm9kZS0ke2l9LWluLXBvcnQtM2AsXG4gICAgICAgIHR5cGU6IFwiZGF0YXNldFwiLFxuICAgICAgfSBhcyBQb3J0RGF0YSxcbiAgICBdLFxuICAgIG91dFBvcnRzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiBgbm9kZS0ke2l9LW91dC1wb3J0LTFgLFxuICAgICAgICB0eXBlOiBcImRhdGFzZXRcIixcbiAgICAgIH0gYXMgUG9ydERhdGEsXG4gICAgICB7XG4gICAgICAgIGlkOiBgbm9kZS0ke2l9LW91dC1wb3J0LTJgLFxuICAgICAgICB0eXBlOiBcImRhdGFzZXRcIixcbiAgICAgIH0gYXMgUG9ydERhdGEsXG4gICAgXSxcbiAgfSBhcyBOb2RlRGF0YSk7XG59XG5cbmV4cG9ydCB7IGdyYXBoRGF0YSB9O1xuIl0sIm1hcHBpbmdzIjoiOzs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcUNBO0FBbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/playground/graph-data.ts