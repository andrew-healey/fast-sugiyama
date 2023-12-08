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
var marker_1 = __webpack_require__( /*! ./marker */ "./src/components/marker.tsx");
var pattern_1 = __webpack_require__( /*! ./pattern */ "./src/components/pattern.tsx");
var Defs = /** @class */ (function(_super) {
  __extends(Defs, _super);

  function Defs() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  Defs.prototype.render = function() {
    var _a = this.props,
      edgeArrowSize = _a.edgeArrowSize,
      gridDotSize = _a.gridDotSize,
      gridSpacing = _a.gridSpacing;
    return (React.createElement("defs", null,
      React.createElement(marker_1.default, {
        edgeArrowSize: edgeArrowSize
      }),
      React.createElement(React.Fragment, null, this.props.renderDefs && this.props.renderDefs()),
      React.createElement(pattern_1.default, {
        gridDotSize: gridDotSize,
        gridSpacing: gridSpacing
      })));
  };
  Defs.defaultProps = {
    gridDotSize: 1,
    gridSpacing: 36
  };
  return Defs;
}(React.Component));
exports.default = Defs;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9kZWZzLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2RlZnMudHN4P2MwMDQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgQXJyb3dNYXJrZXIgZnJvbSBcIi4vbWFya2VyXCI7XG5pbXBvcnQgUGF0dGVybiBmcm9tIFwiLi9wYXR0ZXJuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVmc1Byb3BzIHtcbiAgZWRnZUFycm93U2l6ZT86IG51bWJlcjtcbiAgZ3JpZFNwYWNpbmc/OiBudW1iZXI7XG4gIGdyaWREb3RTaXplPzogbnVtYmVyO1xuICByZW5kZXJEZWZzPzogKCkgPT4gUmVhY3QuUmVhY3RFbGVtZW50IHwgQXJyYXk8UmVhY3QuUmVhY3RFbGVtZW50PiB8IG51bGw7XG59XG5cbmNsYXNzIERlZnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8RGVmc1Byb3BzPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZ3JpZERvdFNpemU6IDEsXG4gICAgZ3JpZFNwYWNpbmc6IDM2XG4gIH07XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGVkZ2VBcnJvd1NpemUsIGdyaWREb3RTaXplLCBncmlkU3BhY2luZyB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRlZnM+XG4gICAgICAgIDxBcnJvd01hcmtlciBlZGdlQXJyb3dTaXplPXtlZGdlQXJyb3dTaXplfSAvPlxuICAgICAgICA8UmVhY3QuRnJhZ21lbnQ+XG4gICAgICAgICAge3RoaXMucHJvcHMucmVuZGVyRGVmcyAmJiB0aGlzLnByb3BzLnJlbmRlckRlZnMoKX1cbiAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgICAgICAgPFBhdHRlcm4gZ3JpZERvdFNpemU9e2dyaWREb3RTaXplfSBncmlkU3BhY2luZz17Z3JpZFNwYWNpbmd9IC8+XG4gICAgICA8L2RlZnM+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZzO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQVNBO0FBQUE7QUFBQTs7QUFpQkE7QUFaQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFHQTtBQWZBO0FBQ0E7QUFDQTtBQUNBO0FBYUE7QUFBQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/components/defs.tsx