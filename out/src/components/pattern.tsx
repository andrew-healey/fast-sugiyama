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
Object.defineProperty(exports, "__esModule", {
  value: true
});
var React = __webpack_require__( /*! react */ "./node_modules/react/index.js");
var Pattern = /** @class */ (function(_super) {
  __extends(Pattern, _super);

  function Pattern() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  Pattern.prototype.render = function() {
    var _a = this.props,
      gridSpacing = _a.gridSpacing,
      gridDotSize = _a.gridDotSize;
    return (React.createElement(React.Fragment, null,
      React.createElement("pattern", {
          id: "grid",
          key: "grid",
          width: gridSpacing,
          height: gridSpacing,
          patternUnits: "userSpaceOnUse"
        },
        React.createElement("rect", {
          width: gridSpacing,
          height: gridSpacing,
          x: "0",
          y: "0",
          className: "turing-background"
        }),
        React.createElement("circle", {
          className: "turing-background-dot",
          cx: gridSpacing / 2,
          cy: gridSpacing / 2,
          r: gridDotSize
        }))));
  };
  Pattern.defaultProps = {
    gridSpacing: 36,
    gridDotSize: 1,
  };
  return Pattern;
}(React.Component));
exports.default = Pattern;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9wYXR0ZXJuLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3BhdHRlcm4udHN4PzliODMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhdHRlcm5Qcm9wcyB7XG4gIGdyaWRTcGFjaW5nPzogbnVtYmVyO1xuICBncmlkRG90U2l6ZT86IG51bWJlcjtcbn1cblxuY2xhc3MgUGF0dGVybiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQYXR0ZXJuUHJvcHM+IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBncmlkU3BhY2luZzogMzYsXG4gICAgZ3JpZERvdFNpemU6IDEsXG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGdyaWRTcGFjaW5nLCBncmlkRG90U2l6ZSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgICA8cGF0dGVyblxuICAgICAgICAgIGlkPVwiZ3JpZFwiXG4gICAgICAgICAga2V5PVwiZ3JpZFwiXG4gICAgICAgICAgd2lkdGg9e2dyaWRTcGFjaW5nfVxuICAgICAgICAgIGhlaWdodD17Z3JpZFNwYWNpbmd9XG4gICAgICAgICAgcGF0dGVyblVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgIHdpZHRoPXtncmlkU3BhY2luZ31cbiAgICAgICAgICAgIGhlaWdodD17Z3JpZFNwYWNpbmd9XG4gICAgICAgICAgICB4PVwiMFwiXG4gICAgICAgICAgICB5PVwiMFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0dXJpbmctYmFja2dyb3VuZFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0dXJpbmctYmFja2dyb3VuZC1kb3RcIlxuICAgICAgICAgICAgY3g9e2dyaWRTcGFjaW5nIC8gMn1cbiAgICAgICAgICAgIGN5PXtncmlkU3BhY2luZyAvIDJ9XG4gICAgICAgICAgICByPXtncmlkRG90U2l6ZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3BhdHRlcm4+XG4gICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGF0dGVybjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQU9BO0FBQUE7QUFBQTs7QUFpQ0E7QUE1QkE7QUFDQTtBQUNBO0FBRUE7QUFPQTtBQU9BO0FBU0E7QUEvQkE7QUFDQTtBQUNBO0FBQ0E7QUE2QkE7QUFBQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/components/pattern.tsx