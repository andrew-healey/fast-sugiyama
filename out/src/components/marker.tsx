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
var ArrowMarker = /** @class */ (function(_super) {
  __extends(ArrowMarker, _super);

  function ArrowMarker() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  ArrowMarker.prototype.render = function() {
    var edgeArrowSize = this.props.edgeArrowSize;
    return (React.createElement(React.Fragment, null,
      React.createElement("marker", {
          id: "end-arrow",
          key: "end-arrow",
          viewBox: "0 -".concat(edgeArrowSize / 2, " ").concat(edgeArrowSize, " ").concat(edgeArrowSize),
          refX: "2",
          markerUnits: "userSpaceOnUse",
          markerWidth: "".concat(edgeArrowSize),
          markerHeight: "".concat(edgeArrowSize),
          orient: "auto"
        },
        React.createElement("path", {
          className: "arrow",
          d: "M1,-".concat(edgeArrowSize / 2, "L").concat(edgeArrowSize, ",0L1,").concat(edgeArrowSize / 2, " Z")
        })),
      React.createElement("marker", {
          id: "end-arrow-running",
          key: "end-arrow-running",
          viewBox: "0 -".concat(edgeArrowSize / 2, " ").concat(edgeArrowSize, " ").concat(edgeArrowSize),
          refX: "2",
          markerUnits: "userSpaceOnUse",
          markerWidth: "".concat(edgeArrowSize),
          markerHeight: "".concat(edgeArrowSize),
          orient: "auto"
        },
        React.createElement("path", {
          className: "arrow running",
          d: "M1,-".concat(edgeArrowSize / 2, "L").concat(edgeArrowSize, ",0L1,").concat(edgeArrowSize / 2, " Z")
        }))));
  };
  ArrowMarker.defaultProps = {
    edgeArrowSize: 8,
  };
  return ArrowMarker;
}(React.Component));
exports.default = ArrowMarker;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9tYXJrZXIudHN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbWFya2VyLnRzeD81YmNmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBBcnJvd01ha2VyUHJvcHMge1xuICBlZGdlQXJyb3dTaXplPzogbnVtYmVyO1xufVxuXG5jbGFzcyBBcnJvd01hcmtlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxBcnJvd01ha2VyUHJvcHM+IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBlZGdlQXJyb3dTaXplOiA4LFxuICB9O1xuXG4gIHJlbmRlcigpOiBSZWFjdC5SZWFjdE5vZGUge1xuICAgIGNvbnN0IHsgZWRnZUFycm93U2l6ZSB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgICA8bWFya2VyXG4gICAgICAgICAgaWQ9XCJlbmQtYXJyb3dcIlxuICAgICAgICAgIGtleT1cImVuZC1hcnJvd1wiXG4gICAgICAgICAgdmlld0JveD17YDAgLSR7ZWRnZUFycm93U2l6ZSAvIDJ9ICR7ZWRnZUFycm93U2l6ZX0gJHtlZGdlQXJyb3dTaXplfWB9XG4gICAgICAgICAgcmVmWD1cIjJcIlxuICAgICAgICAgIG1hcmtlclVuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgIG1hcmtlcldpZHRoPXtgJHtlZGdlQXJyb3dTaXplfWB9XG4gICAgICAgICAgbWFya2VySGVpZ2h0PXtgJHtlZGdlQXJyb3dTaXplfWB9XG4gICAgICAgICAgb3JpZW50PVwiYXV0b1wiXG4gICAgICAgID5cbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXJyb3dcIlxuICAgICAgICAgICAgZD17YE0xLC0ke2VkZ2VBcnJvd1NpemUgLyAyfUwke2VkZ2VBcnJvd1NpemV9LDBMMSwke2VkZ2VBcnJvd1NpemUgLyAyfSBaYH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L21hcmtlcj5cbiAgICAgICAgPG1hcmtlclxuICAgICAgICAgIGlkPVwiZW5kLWFycm93LXJ1bm5pbmdcIlxuICAgICAgICAgIGtleT1cImVuZC1hcnJvdy1ydW5uaW5nXCJcbiAgICAgICAgICB2aWV3Qm94PXtgMCAtJHtlZGdlQXJyb3dTaXplIC8gMn0gJHtlZGdlQXJyb3dTaXplfSAke2VkZ2VBcnJvd1NpemV9YH1cbiAgICAgICAgICByZWZYPVwiMlwiXG4gICAgICAgICAgbWFya2VyVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgbWFya2VyV2lkdGg9e2Ake2VkZ2VBcnJvd1NpemV9YH1cbiAgICAgICAgICBtYXJrZXJIZWlnaHQ9e2Ake2VkZ2VBcnJvd1NpemV9YH1cbiAgICAgICAgICBvcmllbnQ9XCJhdXRvXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJhcnJvdyBydW5uaW5nXCJcbiAgICAgICAgICAgIGQ9e2BNMSwtJHtlZGdlQXJyb3dTaXplIC8gMn1MJHtlZGdlQXJyb3dTaXplfSwwTDEsJHtlZGdlQXJyb3dTaXplIC8gMn0gWmB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9tYXJrZXI+XG4gICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXJyb3dNYXJrZXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFNQTtBQUFBO0FBQUE7O0FBMENBO0FBckNBO0FBQ0E7QUFDQTtBQUVBO0FBVUE7QUFLQTtBQVVBO0FBT0E7QUF4Q0E7QUFDQTtBQUNBO0FBdUNBO0FBQUE7QUFFQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/components/marker.tsx