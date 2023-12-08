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
var Background = /** @class */ (function(_super) {
  __extends(Background, _super);

  function Background() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  Background.prototype.render = function() {
    var _a = this.props,
      gridSize = _a.gridSize,
      fill = _a.fill;
    return (React.createElement("rect", {
      x: -(gridSize || 0) / 4,
      y: -(gridSize || 0) / 4,
      width: gridSize,
      height: gridSize,
      fill: "url(".concat(fill || "", ")")
    }));
  };
  Background.defaultProps = {
    fill: "#grid",
    gridSize: 40960
  };
  return Background;
}(React.Component));
exports.default = Background;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9iYWNrZ3JvdW5kLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2JhY2tncm91bmQudHN4PzZhYzIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFja2dyb3VuZFByb3BzIHtcbiAgZ3JpZFNpemU/OiBudW1iZXI7XG4gIGZpbGw/OiBzdHJpbmc7XG59XG5cbmNsYXNzIEJhY2tncm91bmQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8QmFja2dyb3VuZFByb3BzPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZmlsbDogXCIjZ3JpZFwiLFxuICAgIGdyaWRTaXplOiA0MDk2MFxuICB9O1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBncmlkU2l6ZSwgZmlsbCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPHJlY3RcbiAgICAgICAgeD17LShncmlkU2l6ZSB8fCAwKSAvIDR9XG4gICAgICAgIHk9ey0oZ3JpZFNpemUgfHwgMCkgLyA0fVxuICAgICAgICB3aWR0aD17Z3JpZFNpemV9XG4gICAgICAgIGhlaWdodD17Z3JpZFNpemV9XG4gICAgICAgIGZpbGw9e2B1cmwoJHtmaWxsIHx8IFwiXCJ9KWB9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFja2dyb3VuZDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQU9BO0FBQUE7QUFBQTs7QUFpQkE7QUFaQTtBQUNBO0FBQ0E7QUFTQTtBQWZBO0FBQ0E7QUFDQTtBQUNBO0FBYUE7QUFBQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/components/background.tsx