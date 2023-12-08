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
var classnames_1 = __webpack_require__( /*! classnames */ "./node_modules/classnames/index.js");
var lodash_1 = __webpack_require__( /*! lodash */ "./node_modules/lodash/lodash.js");
var node_1 = __webpack_require__( /*! @/core/node */ "./src/core/node.ts");
var dom = __webpack_require__( /*! @/utils/dom */ "./src/utils/dom.ts");
var delegation_1 = __webpack_require__( /*! ./delegation */ "./src/components/delegation.ts");
var LinkView = /** @class */ (function(_super) {
  __extends(LinkView, _super);

  function LinkView(props) {
    var _this = _super.call(this, props) || this;
    _this._self = React.createRef();
    _this._selfbg = React.createRef();
    _this.lastMove = {
      x: 0,
      y: 0
    };
    _this.lastMoveTarget = -1;
    _this.onAction = function(topic, payload) {
      var _a = _this.props,
        link = _a.link,
        graph = _a.graph;
      if (topic === delegation_1.Action.NodeMoving.toString() ||
        topic === delegation_1.Action.NodeMoved.toString()) {
        if (payload.id === link.source || payload.id === link.target) {
          var startNode = graph.getNode(link.source);
          var startPortOrder = startNode.getPortOrder(link.sourcePort);
          var endNode = graph.getNode(link.target);
          var endPortOrder = endNode.getPortOrder(link.targetPort);
          var startPos = _this.calcOutPortPos(startNode, startPortOrder);
          var endPos = _this.calcInPortPos(endNode, endPortOrder);
          if (payload.id === link.source) {
            startPos = _this.calcOutPortPos(startNode, startPortOrder, payload.coordinate);
            if (_this.lastMoveTarget == 1) {
              endPos = _this.calcOutPortPos(endNode, endPortOrder, _this.lastMove);
            }
            _this.lastMove = payload.coordinate;
            _this.lastMoveTarget = 0;
          }
          if (payload.id === link.target) {
            endPos = _this.calcInPortPos(endNode, endPortOrder, payload.coordinate);
            if (_this.lastMoveTarget == 0) {
              startPos = _this.calcOutPortPos(startNode, startPortOrder, _this.lastMove);
            }
            _this.lastMove = payload.coordinate;
            _this.lastMoveTarget = 1;
          }
          var pathData = _this.generateCurvePath(startPos, endPos);
          dom.setAttribute(_this._self.current, "d", pathData);
          dom.setAttribute(_this._selfbg.current, "d", pathData);
        }
      }
      if (topic === delegation_1.Action.NodeMoved.toString()) {
        _this.lastMoveTarget = -1;
        _this.forceUpdate();
      }
    };
    _this.onUpdateNode = function(topic, payload) {
      var link = _this.props.link;
      var nodesMap = (0, lodash_1.get)(payload, "nodeMap");
      if (nodesMap[link.target] || nodesMap[link.source]) {
        var source = nodesMap[link.source];
        var target = nodesMap[link.target];
        if (source.x || source.y || target.x || target.y) {
          _this.updatePosition(source, target);
        }
      }
    };
    // 优化曲线连接方式
    _this.generateCurvePath = function(source, target) {
      var sourceX = source.x;
      var sourceY = source.y;
      var targetX = target.x;
      var targetY = target.y;
      // 判断y轴的间距是否过小
      var verticalGutter = 0;
      if (Math.abs(sourceY - targetY) < 15 && sourceX > targetX) {
        verticalGutter = 20;
      }
      var ctrlGutter = 50;
      // Organic / curved edge
      var mX = (sourceX + targetX) / 2;
      var mY = (sourceY + targetY) / 2;
      var cX = sourceX;
      var cY = sourceY + ctrlGutter;
      return [
        "M",
        sourceX + 1,
        sourceY + 3,
        "Q",
        cX,
        cY,
        mX,
        mY,
        "T",
        targetX + 1,
        targetY - 11,
      ].join(" ");
    };
    _this._token = _this.props.graph.pubsub.subscribe([
      delegation_1.Action.Click.toString(),
      delegation_1.Action.NodeMoving.toString(),
      delegation_1.Action.NodeMoved.toString(),
    ], _this.onAction);
    _this._updateToken = _this.props.graph.pubsub.subscribe(delegation_1.Action.UpdateGraph.toString(), _this.onUpdateNode);
    return _this;
  }
  LinkView.prototype.componentWillUnmount = function() {
    this.props.graph.pubsub.unsubscribe(this._token);
    this._token = "";
    this.props.graph.pubsub.unsubscribe(this._updateToken);
    this._updateToken = "";
  };
  LinkView.prototype.updatePosition = function(from, to) {
    var _a = this.props,
      link = _a.link,
      graph = _a.graph;
    var startNode = graph.getNode(link.source);
    var startPortOrder = startNode.getPortOrder(link.sourcePort);
    var endNode = graph.getNode(link.target);
    var endPortOrder = endNode.getPortOrder(link.targetPort);
    console.log(from, to);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var that = this;
    var deltaFromX = (from.x - (from.originX || from.x)) / 30;
    var deltaFromY = (from.y - (from.originY || from.y)) / 30;
    var deltaToX = (to.x - (to.originX || to.x)) / 30;
    var deltaToY = (to.y - (to.originY || to.y)) / 30;
    var count = 1;

    function updatePos() {
      var positionFromX = (from.originX || from.x) + count * deltaFromX;
      var positionFromY = (from.originY || from.y) + count * deltaFromY;
      var positionToX = (to.originX || to.x) + count * deltaToX;
      var positionToY = (to.originY || to.y) + count * deltaToY;
      var fromAway = Math.abs(from.x - positionFromX) > Math.abs(deltaFromX) ||
        Math.abs(from.y - positionFromY) > Math.abs(deltaFromY);
      var toAway = Math.abs(to.x - positionToX) > Math.abs(deltaToX) ||
        Math.abs(to.y - positionToY) > Math.abs(deltaToY);
      console.log(fromAway, toAway);
      console.log(positionFromX, from.x, deltaFromX);
      if (fromAway || toAway) {
        var startPos = that.calcOutPortPos(startNode, startPortOrder, {
          x: positionFromX,
          y: positionFromY
        });
        var endPos = that.calcInPortPos(endNode, endPortOrder, {
          x: positionToX,
          y: positionToY,
        });
        dom.setAttribute(that._self.current, "d", that.generateCurvePath(startPos, endPos));
        dom.setAttribute(that._selfbg.current, "d", that.generateCurvePath(startPos, endPos));
        count += 1;
        if (count < 60) {
          window.requestAnimationFrame(updatePos);
        }
      } else {
        var startPos = that.calcOutPortPos(startNode, startPortOrder);
        var endPos = that.calcInPortPos(endNode, endPortOrder);
        dom.setAttribute(that._self.current, "d", that.generateCurvePath(startPos, endPos));
        dom.setAttribute(that._selfbg.current, "d", that.generateCurvePath(startPos, endPos));
        that.forceUpdate();
      }
    }
    updatePos();
  };
  LinkView.prototype.calcOutPortPos = function(node, outPortOrder, coord) {
    var portCenterX = (coord ? coord.x : node.positionX) +
      (node.data.width * (outPortOrder + 1)) / (node.outPorts.length + 1);
    var portCenterY = (coord ? coord.y : node.positionY) + node.data.height;
    return {
      x: portCenterX,
      y: portCenterY,
    };
  };
  LinkView.prototype.calcInPortPos = function(node, inPortOrder, coord) {
    var portCenterX = (coord ? coord.x : node.positionX) +
      (node.data.width * (inPortOrder + 1)) / (node.inPorts.length + 1);
    var portCenterY = coord ? coord.y : node.positionY;
    return {
      x: portCenterX,
      y: portCenterY,
    };
  };
  LinkView.prototype.render = function() {
    var _a = this.props,
      link = _a.link,
      graph = _a.graph;
    var startNode = graph.getNode(link.source);
    if (!startNode)
      return null;
    var startPortOrder = startNode.getPortOrder(link.sourcePort);
    var startPos = this.calcOutPortPos(startNode, startPortOrder);
    var endNode = graph.getNode(link.target);
    if (!endNode)
      return null;
    var endPortOrder = endNode.getPortOrder(link.targetPort);
    var endPos = this.calcInPortPos(endNode, endPortOrder);
    var linkClass = (0, classnames_1.default)({
      connector: true,
      running: endNode.getProp("status") === node_1.NodeStatus.RUNNING,
    });
    return (React.createElement("g", {
        className: "link-wrap"
      },
      React.createElement("path", {
        ref: this._self,
        className: linkClass,
        d: this.generateCurvePath(startPos, endPos),
        markerEnd: endNode.getProp("status") === node_1.NodeStatus.RUNNING ?
          "url(#end-arrow-running)" :
          "url(#end-arrow)",
        "data-action-type": delegation_1.ActionType.Link,
        "data-id": link.id
      }),
      React.createElement("path", {
        ref: this._selfbg,
        className: "connector-background",
        d: this.generateCurvePath(startPos, endPos),
        "data-action-type": delegation_1.ActionType.Link,
        "data-id": link.id
      })));
  };
  return LinkView;
}(React.Component));
exports.default = LinkView;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9saW5rLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2xpbmsudHN4PzgxMWIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgZ2V0IH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IEdyYXBoIGZyb20gXCJAL2NvcmUvZ3JhcGhcIjtcbmltcG9ydCBJTm9kZSwgeyBOb2RlU3RhdHVzLCBOb2RlVXBkYXRlIH0gZnJvbSBcIkAvY29yZS9ub2RlXCI7XG5pbXBvcnQgTGluayBmcm9tIFwiQC9jb3JlL2xpbmtcIjtcbmltcG9ydCB7IENvb3JkaW5hdGUgfSBmcm9tIFwiQC9jb3JlL2ludGVyZmFjZVwiO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gXCJAL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgQWN0aW9uLCBBY3Rpb25UeXBlIH0gZnJvbSBcIi4vZGVsZWdhdGlvblwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmtQcm9wcyB7XG4gIGxpbms6IExpbms7XG4gIGdyYXBoOiBHcmFwaDtcbn1cblxuaW50ZXJmYWNlIExpbmtTdGF0ZSB7XG4gIGRhdGE6IExpbmtQcm9wcztcbn1cblxuY2xhc3MgTGlua1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8TGlua1Byb3BzLCBMaW5rU3RhdGU+IHtcbiAgX3NlbGY6IFJlYWN0LlJlZk9iamVjdDxTVkdQYXRoRWxlbWVudD4gPSBSZWFjdC5jcmVhdGVSZWYoKTtcbiAgX3NlbGZiZzogUmVhY3QuUmVmT2JqZWN0PFNWR1BhdGhFbGVtZW50PiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xuICBsYXN0TW92ZTogQ29vcmRpbmF0ZSA9IHsgeDogMCwgeTogMCB9O1xuICBsYXN0TW92ZVRhcmdldCA9IC0xO1xuICBwcml2YXRlIF90b2tlbjogc3RyaW5nO1xuICBwcml2YXRlIF91cGRhdGVUb2tlbjogc3RyaW5nO1xuICBjb25zdHJ1Y3Rvcihwcm9wczogTGlua1Byb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuX3Rva2VuID0gdGhpcy5wcm9wcy5ncmFwaC5wdWJzdWIuc3Vic2NyaWJlKFxuICAgICAgW1xuICAgICAgICBBY3Rpb24uQ2xpY2sudG9TdHJpbmcoKSxcbiAgICAgICAgQWN0aW9uLk5vZGVNb3ZpbmcudG9TdHJpbmcoKSxcbiAgICAgICAgQWN0aW9uLk5vZGVNb3ZlZC50b1N0cmluZygpLFxuICAgICAgXSxcbiAgICAgIHRoaXMub25BY3Rpb25cbiAgICApO1xuICAgIHRoaXMuX3VwZGF0ZVRva2VuID0gdGhpcy5wcm9wcy5ncmFwaC5wdWJzdWIuc3Vic2NyaWJlKFxuICAgICAgQWN0aW9uLlVwZGF0ZUdyYXBoLnRvU3RyaW5nKCksXG4gICAgICB0aGlzLm9uVXBkYXRlTm9kZVxuICAgICk7XG4gIH1cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5ncmFwaC5wdWJzdWIudW5zdWJzY3JpYmUodGhpcy5fdG9rZW4pO1xuICAgIHRoaXMuX3Rva2VuID0gXCJcIjtcbiAgICB0aGlzLnByb3BzLmdyYXBoLnB1YnN1Yi51bnN1YnNjcmliZSh0aGlzLl91cGRhdGVUb2tlbik7XG4gICAgdGhpcy5fdXBkYXRlVG9rZW4gPSBcIlwiO1xuICB9XG4gIHByaXZhdGUgb25BY3Rpb24gPSAodG9waWM6IHN0cmluZywgcGF5bG9hZDogYW55KSA9PiB7XG4gICAgY29uc3QgeyBsaW5rLCBncmFwaCB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoXG4gICAgICB0b3BpYyA9PT0gQWN0aW9uLk5vZGVNb3ZpbmcudG9TdHJpbmcoKSB8fFxuICAgICAgdG9waWMgPT09IEFjdGlvbi5Ob2RlTW92ZWQudG9TdHJpbmcoKVxuICAgICkge1xuICAgICAgaWYgKHBheWxvYWQuaWQgPT09IGxpbmsuc291cmNlIHx8IHBheWxvYWQuaWQgPT09IGxpbmsudGFyZ2V0KSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0Tm9kZTogSU5vZGUgPSBncmFwaC5nZXROb2RlKGxpbmsuc291cmNlKTtcbiAgICAgICAgY29uc3Qgc3RhcnRQb3J0T3JkZXI6IG51bWJlciA9IHN0YXJ0Tm9kZS5nZXRQb3J0T3JkZXIobGluay5zb3VyY2VQb3J0KTtcbiAgICAgICAgY29uc3QgZW5kTm9kZTogSU5vZGUgPSBncmFwaC5nZXROb2RlKGxpbmsudGFyZ2V0KTtcbiAgICAgICAgY29uc3QgZW5kUG9ydE9yZGVyOiBudW1iZXIgPSBlbmROb2RlLmdldFBvcnRPcmRlcihsaW5rLnRhcmdldFBvcnQpO1xuICAgICAgICBsZXQgc3RhcnRQb3M6IENvb3JkaW5hdGUgPSB0aGlzLmNhbGNPdXRQb3J0UG9zKFxuICAgICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgICBzdGFydFBvcnRPcmRlclxuICAgICAgICApO1xuICAgICAgICBsZXQgZW5kUG9zOiBDb29yZGluYXRlID0gdGhpcy5jYWxjSW5Qb3J0UG9zKGVuZE5vZGUsIGVuZFBvcnRPcmRlcik7XG4gICAgICAgIGlmIChwYXlsb2FkLmlkID09PSBsaW5rLnNvdXJjZSkge1xuICAgICAgICAgIHN0YXJ0UG9zID0gdGhpcy5jYWxjT3V0UG9ydFBvcyhcbiAgICAgICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgIHN0YXJ0UG9ydE9yZGVyLFxuICAgICAgICAgICAgcGF5bG9hZC5jb29yZGluYXRlXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy5sYXN0TW92ZVRhcmdldCA9PSAxKSB7XG4gICAgICAgICAgICBlbmRQb3MgPSB0aGlzLmNhbGNPdXRQb3J0UG9zKGVuZE5vZGUsIGVuZFBvcnRPcmRlciwgdGhpcy5sYXN0TW92ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubGFzdE1vdmUgPSBwYXlsb2FkLmNvb3JkaW5hdGU7XG4gICAgICAgICAgdGhpcy5sYXN0TW92ZVRhcmdldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBheWxvYWQuaWQgPT09IGxpbmsudGFyZ2V0KSB7XG4gICAgICAgICAgZW5kUG9zID0gdGhpcy5jYWxjSW5Qb3J0UG9zKFxuICAgICAgICAgICAgZW5kTm9kZSxcbiAgICAgICAgICAgIGVuZFBvcnRPcmRlcixcbiAgICAgICAgICAgIHBheWxvYWQuY29vcmRpbmF0ZVxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHRoaXMubGFzdE1vdmVUYXJnZXQgPT0gMCkge1xuICAgICAgICAgICAgc3RhcnRQb3MgPSB0aGlzLmNhbGNPdXRQb3J0UG9zKFxuICAgICAgICAgICAgICBzdGFydE5vZGUsXG4gICAgICAgICAgICAgIHN0YXJ0UG9ydE9yZGVyLFxuICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmxhc3RNb3ZlID0gcGF5bG9hZC5jb29yZGluYXRlO1xuICAgICAgICAgIHRoaXMubGFzdE1vdmVUYXJnZXQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhdGhEYXRhOiBzdHJpbmcgPSB0aGlzLmdlbmVyYXRlQ3VydmVQYXRoKHN0YXJ0UG9zLCBlbmRQb3MpO1xuICAgICAgICBkb20uc2V0QXR0cmlidXRlKHRoaXMuX3NlbGYuY3VycmVudCwgXCJkXCIsIHBhdGhEYXRhKTtcbiAgICAgICAgZG9tLnNldEF0dHJpYnV0ZSh0aGlzLl9zZWxmYmcuY3VycmVudCwgXCJkXCIsIHBhdGhEYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRvcGljID09PSBBY3Rpb24uTm9kZU1vdmVkLnRvU3RyaW5nKCkpIHtcbiAgICAgIHRoaXMubGFzdE1vdmVUYXJnZXQgPSAtMTtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICB9XG4gIH07XG4gIHVwZGF0ZVBvc2l0aW9uKFxuICAgIGZyb206IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IG9yaWdpblg6IG51bWJlcjsgb3JpZ2luWTogbnVtYmVyIH0sXG4gICAgdG86IHsgeDogbnVtYmVyOyBvcmlnaW5YOiBudW1iZXI7IHk6IG51bWJlcjsgb3JpZ2luWTogbnVtYmVyIH1cbiAgKSB7XG4gICAgY29uc3QgeyBsaW5rLCBncmFwaCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzdGFydE5vZGU6IElOb2RlID0gZ3JhcGguZ2V0Tm9kZShsaW5rLnNvdXJjZSk7XG4gICAgY29uc3Qgc3RhcnRQb3J0T3JkZXI6IG51bWJlciA9IHN0YXJ0Tm9kZS5nZXRQb3J0T3JkZXIobGluay5zb3VyY2VQb3J0KTtcbiAgICBjb25zdCBlbmROb2RlOiBJTm9kZSA9IGdyYXBoLmdldE5vZGUobGluay50YXJnZXQpO1xuICAgIGNvbnN0IGVuZFBvcnRPcmRlcjogbnVtYmVyID0gZW5kTm9kZS5nZXRQb3J0T3JkZXIobGluay50YXJnZXRQb3J0KTtcbiAgICBjb25zb2xlLmxvZyhmcm9tLCB0byk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgZGVsdGFGcm9tWCA9IChmcm9tLnggLSAoZnJvbS5vcmlnaW5YIHx8IGZyb20ueCkpIC8gMzA7XG4gICAgY29uc3QgZGVsdGFGcm9tWSA9IChmcm9tLnkgLSAoZnJvbS5vcmlnaW5ZIHx8IGZyb20ueSkpIC8gMzA7XG4gICAgY29uc3QgZGVsdGFUb1ggPSAodG8ueCAtICh0by5vcmlnaW5YIHx8IHRvLngpKSAvIDMwO1xuICAgIGNvbnN0IGRlbHRhVG9ZID0gKHRvLnkgLSAodG8ub3JpZ2luWSB8fCB0by55KSkgLyAzMDtcbiAgICBsZXQgY291bnQgPSAxO1xuICAgIGZ1bmN0aW9uIHVwZGF0ZVBvcygpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uRnJvbVggPSAoZnJvbS5vcmlnaW5YIHx8IGZyb20ueCkgKyBjb3VudCAqIGRlbHRhRnJvbVg7XG4gICAgICBjb25zdCBwb3NpdGlvbkZyb21ZID0gKGZyb20ub3JpZ2luWSB8fCBmcm9tLnkpICsgY291bnQgKiBkZWx0YUZyb21ZO1xuICAgICAgY29uc3QgcG9zaXRpb25Ub1ggPSAodG8ub3JpZ2luWCB8fCB0by54KSArIGNvdW50ICogZGVsdGFUb1g7XG4gICAgICBjb25zdCBwb3NpdGlvblRvWSA9ICh0by5vcmlnaW5ZIHx8IHRvLnkpICsgY291bnQgKiBkZWx0YVRvWTtcbiAgICAgIGNvbnN0IGZyb21Bd2F5ID1cbiAgICAgICAgTWF0aC5hYnMoZnJvbS54IC0gcG9zaXRpb25Gcm9tWCkgPiBNYXRoLmFicyhkZWx0YUZyb21YKSB8fFxuICAgICAgICBNYXRoLmFicyhmcm9tLnkgLSBwb3NpdGlvbkZyb21ZKSA+IE1hdGguYWJzKGRlbHRhRnJvbVkpO1xuICAgICAgY29uc3QgdG9Bd2F5ID1cbiAgICAgICAgTWF0aC5hYnModG8ueCAtIHBvc2l0aW9uVG9YKSA+IE1hdGguYWJzKGRlbHRhVG9YKSB8fFxuICAgICAgICBNYXRoLmFicyh0by55IC0gcG9zaXRpb25Ub1kpID4gTWF0aC5hYnMoZGVsdGFUb1kpO1xuICAgICAgY29uc29sZS5sb2coZnJvbUF3YXksIHRvQXdheSk7XG4gICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbkZyb21YLCBmcm9tLngsIGRlbHRhRnJvbVgpO1xuICAgICAgaWYgKGZyb21Bd2F5IHx8IHRvQXdheSkge1xuICAgICAgICBjb25zdCBzdGFydFBvczogQ29vcmRpbmF0ZSA9IHRoYXQuY2FsY091dFBvcnRQb3MoXG4gICAgICAgICAgc3RhcnROb2RlLFxuICAgICAgICAgIHN0YXJ0UG9ydE9yZGVyLFxuICAgICAgICAgIHsgeDogcG9zaXRpb25Gcm9tWCwgeTogcG9zaXRpb25Gcm9tWSB9XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGVuZFBvczogQ29vcmRpbmF0ZSA9IHRoYXQuY2FsY0luUG9ydFBvcyhlbmROb2RlLCBlbmRQb3J0T3JkZXIsIHtcbiAgICAgICAgICB4OiBwb3NpdGlvblRvWCxcbiAgICAgICAgICB5OiBwb3NpdGlvblRvWSxcbiAgICAgICAgfSk7XG4gICAgICAgIGRvbS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgdGhhdC5fc2VsZi5jdXJyZW50LFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIHRoYXQuZ2VuZXJhdGVDdXJ2ZVBhdGgoc3RhcnRQb3MsIGVuZFBvcylcbiAgICAgICAgKTtcbiAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICB0aGF0Ll9zZWxmYmcuY3VycmVudCxcbiAgICAgICAgICBcImRcIixcbiAgICAgICAgICB0aGF0LmdlbmVyYXRlQ3VydmVQYXRoKHN0YXJ0UG9zLCBlbmRQb3MpXG4gICAgICAgICk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgIGlmIChjb3VudCA8IDYwKSB7XG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQb3MpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdGFydFBvczogQ29vcmRpbmF0ZSA9IHRoYXQuY2FsY091dFBvcnRQb3MoXG4gICAgICAgICAgc3RhcnROb2RlLFxuICAgICAgICAgIHN0YXJ0UG9ydE9yZGVyXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGVuZFBvczogQ29vcmRpbmF0ZSA9IHRoYXQuY2FsY0luUG9ydFBvcyhlbmROb2RlLCBlbmRQb3J0T3JkZXIpO1xuICAgICAgICBkb20uc2V0QXR0cmlidXRlKFxuICAgICAgICAgIHRoYXQuX3NlbGYuY3VycmVudCxcbiAgICAgICAgICBcImRcIixcbiAgICAgICAgICB0aGF0LmdlbmVyYXRlQ3VydmVQYXRoKHN0YXJ0UG9zLCBlbmRQb3MpXG4gICAgICAgICk7XG4gICAgICAgIGRvbS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgdGhhdC5fc2VsZmJnLmN1cnJlbnQsXG4gICAgICAgICAgXCJkXCIsXG4gICAgICAgICAgdGhhdC5nZW5lcmF0ZUN1cnZlUGF0aChzdGFydFBvcywgZW5kUG9zKVxuICAgICAgICApO1xuICAgICAgICB0aGF0LmZvcmNlVXBkYXRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZVBvcygpO1xuICB9XG4gIG9uVXBkYXRlTm9kZSA9ICh0b3BpYzogc3RyaW5nLCBwYXlsb2FkOiBhbnkpID0+IHtcbiAgICBjb25zdCB7IGxpbmsgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgbm9kZXNNYXA6IHsgW2tleTogc3RyaW5nXTogTm9kZVVwZGF0ZSB9ID0gZ2V0KHBheWxvYWQsIFwibm9kZU1hcFwiKSBhcyB7XG4gICAgICBba2V5OiBzdHJpbmddOiBOb2RlVXBkYXRlO1xuICAgIH07XG4gICAgaWYgKG5vZGVzTWFwW2xpbmsudGFyZ2V0XSB8fCBub2Rlc01hcFtsaW5rLnNvdXJjZV0pIHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IG5vZGVzTWFwW2xpbmsuc291cmNlXTtcbiAgICAgIGNvbnN0IHRhcmdldCA9IG5vZGVzTWFwW2xpbmsudGFyZ2V0XTtcbiAgICAgIGlmIChzb3VyY2UueCB8fCBzb3VyY2UueSB8fCB0YXJnZXQueCB8fCB0YXJnZXQueSkge1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKHNvdXJjZSBhcyBhbnksIHRhcmdldCBhcyBhbnkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLy8g5LyY5YyW5puy57q/6L+e5o6l5pa55byPXG4gIGdlbmVyYXRlQ3VydmVQYXRoID0gKHNvdXJjZTogQ29vcmRpbmF0ZSwgdGFyZ2V0OiBDb29yZGluYXRlKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBzb3VyY2VYID0gc291cmNlLng7XG4gICAgY29uc3Qgc291cmNlWSA9IHNvdXJjZS55O1xuICAgIGNvbnN0IHRhcmdldFggPSB0YXJnZXQueDtcbiAgICBjb25zdCB0YXJnZXRZID0gdGFyZ2V0Lnk7XG4gICAgLy8g5Yik5pateei9tOeahOmXtOi3neaYr+WQpui/h+Wwj1xuICAgIGxldCB2ZXJ0aWNhbEd1dHRlciA9IDA7XG4gICAgaWYgKE1hdGguYWJzKHNvdXJjZVkgLSB0YXJnZXRZKSA8IDE1ICYmIHNvdXJjZVggPiB0YXJnZXRYKSB7XG4gICAgICB2ZXJ0aWNhbEd1dHRlciA9IDIwO1xuICAgIH1cbiAgICBjb25zdCBjdHJsR3V0dGVyID0gNTA7XG4gICAgLy8gT3JnYW5pYyAvIGN1cnZlZCBlZGdlXG4gICAgY29uc3QgbVggPSAoc291cmNlWCArIHRhcmdldFgpIC8gMjtcbiAgICBjb25zdCBtWSA9IChzb3VyY2VZICsgdGFyZ2V0WSkgLyAyO1xuICAgIGNvbnN0IGNYID0gc291cmNlWDtcbiAgICBjb25zdCBjWSA9IHNvdXJjZVkgKyBjdHJsR3V0dGVyO1xuICAgIHJldHVybiBbXG4gICAgICBcIk1cIixcbiAgICAgIHNvdXJjZVggKyAxLFxuICAgICAgc291cmNlWSArIDMsXG4gICAgICBcIlFcIixcbiAgICAgIGNYLFxuICAgICAgY1ksXG4gICAgICBtWCxcbiAgICAgIG1ZLFxuICAgICAgXCJUXCIsXG4gICAgICB0YXJnZXRYICsgMSxcbiAgICAgIHRhcmdldFkgLSAxMSxcbiAgICBdLmpvaW4oXCIgXCIpO1xuICB9O1xuICBjYWxjT3V0UG9ydFBvcyhcbiAgICBub2RlOiBJTm9kZSxcbiAgICBvdXRQb3J0T3JkZXI6IG51bWJlcixcbiAgICBjb29yZD86IENvb3JkaW5hdGVcbiAgKTogQ29vcmRpbmF0ZSB7XG4gICAgY29uc3QgcG9ydENlbnRlclg6IG51bWJlciA9XG4gICAgICAoY29vcmQgPyBjb29yZC54IDogbm9kZS5wb3NpdGlvblgpICtcbiAgICAgIChub2RlLmRhdGEud2lkdGggKiAob3V0UG9ydE9yZGVyICsgMSkpIC8gKG5vZGUub3V0UG9ydHMubGVuZ3RoICsgMSk7XG4gICAgY29uc3QgcG9ydENlbnRlclk6IG51bWJlciA9XG4gICAgICAoY29vcmQgPyBjb29yZC55IDogbm9kZS5wb3NpdGlvblkpICsgbm9kZS5kYXRhLmhlaWdodDtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcG9ydENlbnRlclgsXG4gICAgICB5OiBwb3J0Q2VudGVyWSxcbiAgICB9O1xuICB9XG4gIGNhbGNJblBvcnRQb3MoXG4gICAgbm9kZTogSU5vZGUsXG4gICAgaW5Qb3J0T3JkZXI6IG51bWJlcixcbiAgICBjb29yZD86IENvb3JkaW5hdGVcbiAgKTogQ29vcmRpbmF0ZSB7XG4gICAgY29uc3QgcG9ydENlbnRlclg6IG51bWJlciA9XG4gICAgICAoY29vcmQgPyBjb29yZC54IDogbm9kZS5wb3NpdGlvblgpICtcbiAgICAgIChub2RlLmRhdGEud2lkdGggKiAoaW5Qb3J0T3JkZXIgKyAxKSkgLyAobm9kZS5pblBvcnRzLmxlbmd0aCArIDEpO1xuICAgIGNvbnN0IHBvcnRDZW50ZXJZOiBudW1iZXIgPSBjb29yZCA/IGNvb3JkLnkgOiBub2RlLnBvc2l0aW9uWTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcG9ydENlbnRlclgsXG4gICAgICB5OiBwb3J0Q2VudGVyWSxcbiAgICB9O1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGxpbmssIGdyYXBoIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHN0YXJ0Tm9kZTogSU5vZGUgPSBncmFwaC5nZXROb2RlKGxpbmsuc291cmNlKTtcbiAgICBpZiAoIXN0YXJ0Tm9kZSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgc3RhcnRQb3J0T3JkZXI6IG51bWJlciA9IHN0YXJ0Tm9kZS5nZXRQb3J0T3JkZXIobGluay5zb3VyY2VQb3J0KTtcbiAgICBjb25zdCBzdGFydFBvczogQ29vcmRpbmF0ZSA9IHRoaXMuY2FsY091dFBvcnRQb3Moc3RhcnROb2RlLCBzdGFydFBvcnRPcmRlcik7XG4gICAgY29uc3QgZW5kTm9kZTogSU5vZGUgPSBncmFwaC5nZXROb2RlKGxpbmsudGFyZ2V0KTtcbiAgICBpZiAoIWVuZE5vZGUpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGVuZFBvcnRPcmRlcjogbnVtYmVyID0gZW5kTm9kZS5nZXRQb3J0T3JkZXIobGluay50YXJnZXRQb3J0KTtcbiAgICBjb25zdCBlbmRQb3M6IENvb3JkaW5hdGUgPSB0aGlzLmNhbGNJblBvcnRQb3MoZW5kTm9kZSwgZW5kUG9ydE9yZGVyKTtcbiAgICBjb25zdCBsaW5rQ2xhc3M6IHN0cmluZyA9IGNsYXNzTmFtZXMoe1xuICAgICAgY29ubmVjdG9yOiB0cnVlLFxuICAgICAgcnVubmluZzogZW5kTm9kZS5nZXRQcm9wKFwic3RhdHVzXCIpID09PSBOb2RlU3RhdHVzLlJVTk5JTkcsXG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxnIGNsYXNzTmFtZT1cImxpbmstd3JhcFwiPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIHJlZj17dGhpcy5fc2VsZn1cbiAgICAgICAgICBjbGFzc05hbWU9e2xpbmtDbGFzc31cbiAgICAgICAgICBkPXt0aGlzLmdlbmVyYXRlQ3VydmVQYXRoKHN0YXJ0UG9zLCBlbmRQb3MpfVxuICAgICAgICAgIG1hcmtlckVuZD17XG4gICAgICAgICAgICBlbmROb2RlLmdldFByb3AoXCJzdGF0dXNcIikgPT09IE5vZGVTdGF0dXMuUlVOTklOR1xuICAgICAgICAgICAgICA/IFwidXJsKCNlbmQtYXJyb3ctcnVubmluZylcIlxuICAgICAgICAgICAgICA6IFwidXJsKCNlbmQtYXJyb3cpXCJcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YS1hY3Rpb24tdHlwZT17QWN0aW9uVHlwZS5MaW5rfVxuICAgICAgICAgIGRhdGEtaWQ9e2xpbmsuaWR9XG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgcmVmPXt0aGlzLl9zZWxmYmd9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiY29ubmVjdG9yLWJhY2tncm91bmRcIlxuICAgICAgICAgIGQ9e3RoaXMuZ2VuZXJhdGVDdXJ2ZVBhdGgoc3RhcnRQb3MsIGVuZFBvcyl9XG4gICAgICAgICAgZGF0YS1hY3Rpb24tdHlwZT17QWN0aW9uVHlwZS5MaW5rfVxuICAgICAgICAgIGRhdGEtaWQ9e2xpbmsuaWR9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMaW5rVmlldztcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFXQTtBQUFBO0FBT0E7QUFBQTtBQU5BO0FBQ0E7QUFDQTtBQUNBO0FBd0JBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNEVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9MQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFJQTtBQUNBO0FBS0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNkNBO0FBS0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU1BO0FBQ0E7QUFLQTtBQVNBO0FBQ0E7QUFBQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/components/link.tsx