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
var classnames_1 = __webpack_require__( /*! classnames */ "./node_modules/classnames/index.js");
var delegation_1 = __webpack_require__( /*! ./delegation */ "./src/components/delegation.ts");
var PortView = /** @class */ (function(_super) {
  __extends(PortView, _super);

  function PortView(props) {
    var _this = _super.call(this, props) || this;
    _this.onMouseEnter = function() {
      _this.setState({
        visible: true
      });
    };
    _this.onMouseLeave = function() {
      var port = _this.props.port;
      port.absorbable = false;
      _this.setState({
        visible: false
      });
    };
    _this.state = {
      visible: false,
    };
    return _this;
  }
  PortView.prototype.render = function() {
    var visible = this.state.visible;
    var _a = this.props,
      port = _a.port,
      _b = _a.inDragMode,
      inDragMode = _b === void 0 ? false : _b;
    var portClass = (0, classnames_1.default)({
      "node-port": true,
      connectable: port.connectable || false,
    });
    var magnetClass = (0, classnames_1.default)({
      "port-magnet": true,
      absorbable: port.absorbable || false,
    });
    var event = inDragMode ?
      {} :
      {
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
      };
    return (React.createElement("div", __assign({
        className: portClass,
        "data-action-type": delegation_1.ActionType.Port,
        "data-id": port.id,
        "data-attached": port.attached
      }, event),
      React.createElement("span", {
        className: magnetClass
      })));
  };
  return PortView;
}(React.Component));
exports.default = PortView;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9wb3J0LnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3BvcnQudHN4PzU5OWIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IElOb2RlIGZyb20gXCJAL2NvcmUvbm9kZVwiO1xuaW1wb3J0IFBvcnQgZnJvbSBcIkAvY29yZS9wb3J0XCI7XG5pbXBvcnQgeyBBY3Rpb25UeXBlIH0gZnJvbSBcIi4vZGVsZWdhdGlvblwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBvcnRQcm9wcyB7XG4gIHBvcnQ6IFBvcnQ7XG4gIG5vZGU6IElOb2RlO1xuICBvcmRlcjogbnVtYmVyO1xuICBpbkRyYWdNb2RlPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFBvcnRTdGF0ZSB7XG4gIHZpc2libGU6IGJvb2xlYW47XG59XG5cbmNsYXNzIFBvcnRWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFBvcnRQcm9wcywgUG9ydFN0YXRlPiB7XG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQb3J0UHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBvbk1vdXNlRW50ZXIgPSAoKSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGU6IHRydWUgfSk7XG4gIH07XG5cbiAgb25Nb3VzZUxlYXZlID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgcG9ydCB9ID0gdGhpcy5wcm9wcztcbiAgICBwb3J0LmFic29yYmFibGUgPSBmYWxzZTtcbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdmlzaWJsZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IHBvcnQsIGluRHJhZ01vZGUgPSBmYWxzZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBwb3J0Q2xhc3MgPSBjbGFzc05hbWVzKHtcbiAgICAgIFwibm9kZS1wb3J0XCI6IHRydWUsXG4gICAgICBjb25uZWN0YWJsZTogcG9ydC5jb25uZWN0YWJsZSB8fCBmYWxzZSxcbiAgICB9KTtcbiAgICBjb25zdCBtYWduZXRDbGFzcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJwb3J0LW1hZ25ldFwiOiB0cnVlLFxuICAgICAgYWJzb3JiYWJsZTogcG9ydC5hYnNvcmJhYmxlIHx8IGZhbHNlLFxuICAgIH0pO1xuICAgIGNvbnN0IGV2ZW50OiBhbnkgPSBpbkRyYWdNb2RlXG4gICAgICA/IHt9XG4gICAgICA6IHtcbiAgICAgICAgICBvbk1vdXNlRW50ZXI6IHRoaXMub25Nb3VzZUVudGVyLFxuICAgICAgICAgIG9uTW91c2VMZWF2ZTogdGhpcy5vbk1vdXNlTGVhdmUsXG4gICAgICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtwb3J0Q2xhc3N9XG4gICAgICAgIGRhdGEtYWN0aW9uLXR5cGU9e0FjdGlvblR5cGUuUG9ydH1cbiAgICAgICAgZGF0YS1pZD17cG9ydC5pZH1cbiAgICAgICAgZGF0YS1hdHRhY2hlZD17cG9ydC5hdHRhY2hlZH1cbiAgICAgICAgey4uLmV2ZW50fVxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e21hZ25ldENsYXNzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3J0VmlldztcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFHQTtBQWFBO0FBQUE7QUFDQTtBQUFBO0FBT0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBQ0E7QUFDQTs7QUFDQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBR0E7QUFDQTtBQUFBO0FBRUE7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/components/port.tsx