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
var SelectionArea = /** @class */ (function(_super) {
  __extends(SelectionArea, _super);

  function SelectionArea() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  SelectionArea.prototype.render = function() {
    var _a = this.props,
      area = _a.area,
      _b = _a.visible,
      visible = _b === void 0 ? false : _b,
      forwardedRef = _a.forwardedRef;
    var _c = area.x,
      x = _c === void 0 ? 0 : _c,
      _d = area.y,
      y = _d === void 0 ? 0 : _d,
      _e = area.x1,
      x1 = _e === void 0 ? 0 : _e,
      _f = area.y1,
      y1 = _f === void 0 ? 0 : _f;
    var leftX = Math.min(x, x1);
    var leftY = Math.min(y, y1);
    var width = Math.max(x, x1) - leftX;
    var height = Math.max(y, y1) - leftY;
    return (React.createElement("foreignObject", {
        ref: forwardedRef,
        x: leftX,
        y: leftY,
        width: width,
        height: height,
        style: {
          display: visible ? "inherit" : "none",
          overflow: "visible"
        }
      },
      React.createElement("div", {
        className: "editor-selection-area"
      })));
  };
  return SelectionArea;
}(React.Component));
exports.default = React.forwardRef(function(props, ref) {
  return (React.createElement(SelectionArea, __assign({}, props, {
    forwardedRef: ref
  })));
});
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9zZWxlY3Rpb24udHN4LmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvc2VsZWN0aW9uLnRzeD9kNjQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgUmVjdEFyZWEgfSBmcm9tIFwiQC91dGlscy9jb29yZC1zeXNcIjtcblxuaW50ZXJmYWNlIFNlbGVjdGlvblByb3BzIHtcbiAgYXJlYTogUmVjdEFyZWE7XG4gIHZpc2libGU6IGJvb2xlYW47XG4gIGZvcndhcmRlZFJlZjogUmVhY3QuUmVmT2JqZWN0PFNWR1NWR0VsZW1lbnQ+O1xufVxuXG5jbGFzcyBTZWxlY3Rpb25BcmVhIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFNlbGVjdGlvblByb3BzLCBhbnk+IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgYXJlYSwgdmlzaWJsZSA9IGZhbHNlLCBmb3J3YXJkZWRSZWYgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyB4ID0gMCwgeSA9IDAsIHgxID0gMCwgeTEgPSAwIH0gPSBhcmVhO1xuICAgIGNvbnN0IGxlZnRYID0gTWF0aC5taW4oeCwgeDEpO1xuICAgIGNvbnN0IGxlZnRZID0gTWF0aC5taW4oeSwgeTEpO1xuICAgIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoeCwgeDEpIC0gbGVmdFg7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoeSwgeTEpIC0gbGVmdFk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGZvcmVpZ25PYmplY3RcbiAgICAgICAgcmVmPXtmb3J3YXJkZWRSZWZ9XG4gICAgICAgIHg9e2xlZnRYfVxuICAgICAgICB5PXtsZWZ0WX1cbiAgICAgICAgd2lkdGg9e3dpZHRofVxuICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogdmlzaWJsZSA/IFwiaW5oZXJpdFwiIDogXCJub25lXCIsIG92ZXJmbG93OiBcInZpc2libGVcIiB9fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVkaXRvci1zZWxlY3Rpb24tYXJlYVwiIC8+XG4gICAgICA8L2ZvcmVpZ25PYmplY3Q+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5mb3J3YXJkUmVmKChwcm9wczogYW55LCByZWYpID0+IChcbiAgPFNlbGVjdGlvbkFyZWEgey4uLnByb3BzfSBmb3J3YXJkZWRSZWY9e3JlZn0gLz5cbikpO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFTQTtBQUFBO0FBQUE7O0FBc0JBO0FBckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFTQTtBQUdBO0FBQ0E7QUFBQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/components/selection.tsx