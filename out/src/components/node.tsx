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
var lodash_1 = __webpack_require__( /*! lodash */ "./node_modules/lodash/lodash.js");
var node_1 = __webpack_require__( /*! @/core/node */ "./src/core/node.ts");
var port_1 = __webpack_require__( /*! @/core/port */ "./src/core/port.ts");
var dom = __webpack_require__( /*! @/utils/dom */ "./src/utils/dom.ts");
var others_1 = __webpack_require__( /*! @/utils/others */ "./src/utils/others.ts");
var icon_1 = __webpack_require__( /*! ./icon */ "./src/components/icon.tsx");
var port_2 = __webpack_require__( /*! ./port */ "./src/components/port.tsx");
var delegation_1 = __webpack_require__( /*! ./delegation */ "./src/components/delegation.ts");
var node_progress_1 = __webpack_require__( /*! ./node-progress */ "./src/components/node-progress.tsx");
var NodeView = /** @class */ (function(_super) {
  __extends(NodeView, _super);

  function NodeView(props) {
    var _this = _super.call(this, props) || this;
    _this.pointerX = 0;
    _this.pointerY = 0;
    _this.onAction = function(topic, payload) {
      var _a = _this.props,
        node = _a.node,
        graph = _a.graph;
      var event = payload.event,
        actionEvent = payload.actionEvent,
        options = payload.options;
      var followMove = false;
      var gViewCoordSys = (0, lodash_1.get)(options, "gViewCoordSys");
      if (actionEvent.type === delegation_1.ActionType.Blank) {
        if (delegation_1.Action.Click.toString() === topic) {
          node.setProp("selected", false);
          _this.forceUpdate();
        }
        if (delegation_1.Action.MouseUp.toString() === topic) {
          // 处理高亮不消失的问题
          _this.restore(node);
          _this.forceUpdate();
        }
      }
      if (actionEvent.type === delegation_1.ActionType.Node) {
        if (actionEvent.target !== node.id) {
          // 已经选中的节点如果检测到有节点移动则跟随移动，但是有一种情况例外，
          // 即被移动节点尚未被选中，此时被选中的其他节点不跟随移动
          if (node.getProp("selected")) {
            followMove = true;
            if (!graph.getNode(actionEvent.target).getProp("selected")) {
              followMove = false;
            }
          }
          if (actionEvent.action === delegation_1.Action.Click && !dom.isCtrlOrMeta(event)) {
            node.setProp("selected", false);
            _this.forceUpdate();
          }
        }
        if (actionEvent.target === node.id ||
          (node.getProp("selected") && followMove)) {
          var offsetX = 0;
          var offsetY = 0;
          var positionX = 0;
          var positionY = 0;
          switch (topic) {
            case delegation_1.Action.MouseDown.toString():
              _this.pointerX = actionEvent.coordinate.x;
              _this.pointerY = actionEvent.coordinate.y;
              break;
            case delegation_1.Action.Click.toString():
              node.setProp("selected", true);
              _this.forceUpdate();
              break;
            case delegation_1.Action.MouseUp.toString():
            case delegation_1.Action.MouseMove.toString():
              offsetX = actionEvent.coordinate.x - _this.pointerX;
              offsetY = actionEvent.coordinate.y - _this.pointerY;
              positionX = node.positionX + offsetX / (gViewCoordSys.scaleX || 1);
              positionY = node.positionY + offsetY / (gViewCoordSys.scaleY || 1);
              dom.transform(_this._self.current, {
                x: positionX,
                y: positionY,
              });
              graph.pubsub.publish(delegation_1.Action.NodeMoving.toString(), {
                coordinate: {
                  x: positionX,
                  y: positionY
                },
                id: node.id,
              });
              if (delegation_1.Action.MouseUp.toString() === topic) {
                node.positionX = positionX;
                node.positionY = positionY;
                _this.forceUpdate();
                graph.pubsub.publish(delegation_1.Action.NodeMoved.toString(), {
                  coordinate: {
                    x: positionX,
                    y: positionY
                  },
                  id: node.id,
                });
              }
              break;
          }
        }
      }
    };
    _this.onConnect = function(topic, payload) {
      var node = _this.props.node;
      var sourcePort = (0, lodash_1.get)(payload, "sourcePort");
      var event = (0, lodash_1.get)(payload, "event");
      var targetNode = null;
      var targetPort = null;
      switch (topic) {
        case delegation_1.Action.LinkConnect.toString():
          // 开始连线，更新可连接的端口状态
          if (sourcePort.direction === port_1.PortDirection.OUT) {
            node.outPorts.map(function(port) {
              port.connectable = false;
            });
            node.inPorts.map(function(port) {
              if (_this.canPortConnect(sourcePort, port)) {
                port.connectable = true;
              } else {
                port.connectable = false;
              }
            });
          }
          if (sourcePort.direction === port_1.PortDirection.IN) {
            node.inPorts.map(function(port) {
              port.connectable = false;
            });
            node.outPorts.map(function(port) {
              if (_this.canPortConnect(sourcePort, port)) {
                port.connectable = true;
              } else {
                port.connectable = false;
              }
            });
          }
          break;
        case delegation_1.Action.LinkConnecting.toString():
          // 连接过程中，判断是否在当前节点的可连接范围内
          targetNode = (0, lodash_1.get)(payload, "targetNode");
          targetPort = (0, lodash_1.get)(payload, "targetPort");
          if (targetPort) {
            var port = node.getPort(targetPort.id);
            if (port && port.connectable) {
              port.absorbable = true;
              _this.forceUpdate();
            }
          }
          if (targetNode && targetNode.id === node.id) {
            var pointerX_1 = event.clientX;
            var bounding_1 = _this._self.current.getBoundingClientRect();
            if (sourcePort.direction === port_1.PortDirection.IN) {
              node.outPorts.map(function(pt, idx) {
                if (bounding_1.x + (idx * bounding_1.width) / node.outPorts.length <=
                  pointerX_1 &&
                  pointerX_1 <=
                  bounding_1.x +
                  ((idx + 1) * bounding_1.width) / node.outPorts.length &&
                  pt.connectable) {
                  pt.absorbable = true;
                } else {
                  pt.absorbable = false;
                }
              });
            }
            if (sourcePort.direction === port_1.PortDirection.OUT) {
              node.inPorts.map(function(pt, idx) {
                if (bounding_1.x + (idx * bounding_1.width) / node.inPorts.length <=
                  pointerX_1 &&
                  pointerX_1 <=
                  bounding_1.x +
                  ((idx + 1) * bounding_1.width) / node.inPorts.length &&
                  pt.connectable &&
                  !pt.connected) {
                  pt.absorbable = true;
                } else {
                  pt.absorbable = false;
                }
              });
            }
            _this.forceUpdate();
          }
          break;
        case delegation_1.Action.LinkConnected.toString():
          // 连接结束，取消高亮状态
          _this.restore(node);
          _this.forceUpdate();
          break;
      }
    };
    _this.restore = function(node) {
      node.inPorts.map(function(port) {
        port.connectable = false;
        port.absorbable = false;
      });
      node.outPorts.map(function(port) {
        port.connectable = false;
        port.absorbable = false;
      });
    };
    _this.onUpdateNode = function(topic, payload) {
      var node = _this.props.node;
      var nodesMap = (0, lodash_1.get)(payload, "nodeMap");
      var from = {
        x: node.positionX,
        y: node.positionY
      };
      if (nodesMap[node.id]) {
        Object.keys(nodesMap[node.id]).map(function(key) {
          node.setProp(key, nodesMap[node.id][key]);
        });
        var to = {
          x: node.positionX,
          y: node.positionY
        };
        _this.updatePosition(from, to);
      }
    };
    _this.onMouseLeave = function() {
      var node = _this.props.node;
      node.inPorts.map(function(port) {
        port.absorbable = false;
      });
      node.outPorts.map(function(port) {
        port.absorbable = false;
      });
      _this.forceUpdate();
    };
    _this.onIconMouseEnter = function() {
      _this.setState({
        visible: true
      });
    };
    _this.onIconMouseLeave = function() {
      _this.setState({
        visible: false
      });
    };
    _this.state = {
      x: -1,
      y: -1,
      visible: false,
    };
    _this._self = React.createRef();
    var graph = _this.props.graph;
    _this._token = graph.pubsub.subscribe([
      delegation_1.Action.Click.toString(),
      delegation_1.Action.MouseDown.toString(),
      delegation_1.Action.MouseMove.toString(),
      delegation_1.Action.MouseUp.toString(),
    ], _this.onAction);
    _this._connectToken = graph.pubsub.subscribe([
      delegation_1.Action.LinkConnect.toString(),
      delegation_1.Action.LinkConnecting.toString(),
      delegation_1.Action.LinkConnected.toString(),
    ], _this.onConnect);
    _this._updateToken = graph.pubsub.subscribe(delegation_1.Action.UpdateGraph.toString(), _this.onUpdateNode);
    return _this;
  }
  NodeView.prototype.componentWillUnmount = function() {
    var graph = this.props.graph;
    graph.pubsub.unsubscribe(this._token);
    this._token = "";
    graph.pubsub.unsubscribe(this._connectToken);
    this._connectToken = "";
    graph.pubsub.unsubscribe(this._updateToken);
    this._updateToken = "";
  };
  NodeView.prototype.canPortConnect = function(port, targetPort) {
    var graph = this.props.graph;
    return (0, others_1.canPortConnect)(port, targetPort);
  };
  NodeView.prototype.updatePosition = function(from, to) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var that = this;
    var deltaX = (to.x - from.x) / 30;
    var deltaY = (to.y - from.y) / 30;
    var count = 1;

    function updatePos() {
      var positionX = from.x + count * deltaX;
      var positionY = from.y + count * deltaY;
      if (Math.abs(positionX - to.x) > Math.abs(deltaX) ||
        Math.abs(positionY - to.y) > Math.abs(deltaY)) {
        dom.transform(that._self.current, {
          x: positionX,
          y: positionY
        });
        count += 1;
        window.requestAnimationFrame(updatePos);
      } else {
        dom.transform(that._self.current, {
          x: to.x,
          y: to.y
        });
        that.forceUpdate();
      }
    }
    updatePos();
  };
  NodeView.prototype.render = function() {
    var visible = this.state.visible;
    var _a = this.props,
      node = _a.node,
      _b = _a.inDragMode,
      inDragMode = _b === void 0 ? false : _b;
    var nodeId = node.id;
    var positionX = node.positionX;
    var positionY = node.positionY;
    var width = node.data.width || 180;
    var height = node.data.height || 30;
    var selected = node.getProp("selected");
    var nodeClass = (0, classnames_1.default)({
      "node-content": true,
      selected: selected,
      "has-status": node.data.status !== node_1.NodeStatus.CREATED,
    });
    var nodeProgress = null;
    if (node.data.status === node_1.NodeStatus.RUNNING) {
      nodeProgress = (React.createElement(node_progress_1.default, {
        radius: 8,
        progress: node.data.progress || 0
      }));
    }
    var statusIcon = node.data.status;
    if (node.data.status === node_1.NodeStatus.CANCELED) {
      statusIcon = "cancel-circle";
    }
    if (node.data.status === node_1.NodeStatus.QUEUEING) {
      statusIcon = "hour-glass";
    }
    var nodeWrapperClass = (0, classnames_1.default)({
      "node-wrapper": true,
      running: node.data.status == node_1.NodeStatus.RUNNING,
    });
    var gEvent = inDragMode ? {} : {
      onMouseLeave: this.onMouseLeave
    };
    var iconEvent = inDragMode ?
      {} :
      {
        onMouseEnter: this.onIconMouseEnter,
        onMouseLeave: this.onIconMouseLeave,
      };
    return (React.createElement("g", __assign({
        className: "node",
        style: {
          transform: "translate(".concat(positionX, "px, ").concat(positionY, "px)")
        },
        ref: this._self
      }, gEvent),
      React.createElement("foreignObject", {
          width: width,
          height: height
        },
        React.createElement("div", {
            className: nodeWrapperClass,
            "data-action-type": delegation_1.ActionType.Node,
            "data-id": nodeId
          },
          React.createElement("div", {
              className: nodeClass
            },
            React.createElement("div", __assign({
                className: "icon"
              }, iconEvent),
              React.createElement(icon_1.default, {
                name: node.data.tag,
                icon: node.data.type
              })),
            React.createElement("div", {
              className: "text"
            }, node.data.title),
            React.createElement("div", {
                className: "status",
                title: "".concat(nodeProgress ?
                  node.data.progress + "%" :
                  node.data.statusDetail)
              },
              React.createElement("span", {
                className: "icon-".concat(statusIcon)
              }, nodeProgress)),
            React.createElement("div", {
              className: "node-port-list in"
            }, (0, lodash_1.map)(node.inPorts, function(port, idx, ports) {
              return (React.createElement("div", {
                  className: "node-port-wrapper",
                  style: {
                    width: "".concat(100 / (node.inPorts.length + 1), "%")
                  },
                  key: port.id
                },
                React.createElement(port_2.default, {
                  port: port,
                  node: node,
                  order: idx,
                  inDragMode: inDragMode
                })));
            })),
            React.createElement("div", {
              className: "node-port-list out"
            }, (0, lodash_1.map)(node.outPorts, function(port, idx, ports) {
              return (React.createElement("div", {
                  className: "node-port-wrapper",
                  style: {
                    width: "".concat(100 / (node.outPorts.length + 1), "%")
                  },
                  key: port.id
                },
                React.createElement(port_2.default, {
                  port: port,
                  node: node,
                  order: idx,
                  inDragMode: inDragMode
                })));
            })))))));
  };
  return NodeView;
}(React.Component));
exports.default = NodeView;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9ub2RlLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL25vZGUudHN4PzFmMWUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IHsgZ2V0LCBtYXAgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgR3JhcGggZnJvbSBcIkAvY29yZS9ncmFwaFwiO1xuaW1wb3J0IElOb2RlLCB7IE5vZGVVcGRhdGUsIE5vZGVTdGF0dXMgfSBmcm9tIFwiQC9jb3JlL25vZGVcIjtcbmltcG9ydCBQb3J0LCB7IFBvcnREaXJlY3Rpb24gfSBmcm9tIFwiQC9jb3JlL3BvcnRcIjtcbmltcG9ydCAqIGFzIGRvbSBmcm9tIFwiQC91dGlscy9kb21cIjtcbmltcG9ydCAqIGFzIENvb3JkU3lzIGZyb20gXCJAL3V0aWxzL2Nvb3JkLXN5c1wiO1xuaW1wb3J0IHsgY2FuUG9ydENvbm5lY3QgfSBmcm9tIFwiQC91dGlscy9vdGhlcnNcIjtcbmltcG9ydCBJY29uIGZyb20gXCIuL2ljb25cIjtcbmltcG9ydCBQb3J0VmlldyBmcm9tIFwiLi9wb3J0XCI7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblR5cGUgfSBmcm9tIFwiLi9kZWxlZ2F0aW9uXCI7XG5pbXBvcnQgTm9kZVByb2dyZXNzIGZyb20gXCIuL25vZGUtcHJvZ3Jlc3NcIjtcblxuZXhwb3J0IGludGVyZmFjZSBOb2RlUHJvcHMge1xuICBub2RlOiBJTm9kZTtcbiAgZ3JhcGg6IEdyYXBoO1xuICBrZXk6IGFueTtcbiAgaW5EcmFnTW9kZT86IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBOb2RlU3RhdGUge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgdmlzaWJsZTogYm9vbGVhbjtcbn1cblxuY2xhc3MgTm9kZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8Tm9kZVByb3BzLCBOb2RlU3RhdGU+IHtcbiAgX3NlbGY6IFJlYWN0LlJlZk9iamVjdDxTVkdTVkdFbGVtZW50PjtcbiAgcHJpdmF0ZSBwb2ludGVyWCA9IDA7XG4gIHByaXZhdGUgcG9pbnRlclkgPSAwO1xuICBwcml2YXRlIF90b2tlbjogc3RyaW5nO1xuICBwcml2YXRlIF9jb25uZWN0VG9rZW46IHN0cmluZztcbiAgcHJpdmF0ZSBfdXBkYXRlVG9rZW46IHN0cmluZztcbiAgY29uc3RydWN0b3IocHJvcHM6IE5vZGVQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgeDogLTEsXG4gICAgICB5OiAtMSxcbiAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgIH07XG4gICAgdGhpcy5fc2VsZiA9IFJlYWN0LmNyZWF0ZVJlZjxTVkdTVkdFbGVtZW50PigpO1xuICAgIGNvbnN0IHsgZ3JhcGggfSA9IHRoaXMucHJvcHM7XG4gICAgdGhpcy5fdG9rZW4gPSBncmFwaC5wdWJzdWIuc3Vic2NyaWJlKFxuICAgICAgW1xuICAgICAgICBBY3Rpb24uQ2xpY2sudG9TdHJpbmcoKSxcbiAgICAgICAgQWN0aW9uLk1vdXNlRG93bi50b1N0cmluZygpLFxuICAgICAgICBBY3Rpb24uTW91c2VNb3ZlLnRvU3RyaW5nKCksXG4gICAgICAgIEFjdGlvbi5Nb3VzZVVwLnRvU3RyaW5nKCksXG4gICAgICBdLFxuICAgICAgdGhpcy5vbkFjdGlvblxuICAgICk7XG4gICAgdGhpcy5fY29ubmVjdFRva2VuID0gZ3JhcGgucHVic3ViLnN1YnNjcmliZShcbiAgICAgIFtcbiAgICAgICAgQWN0aW9uLkxpbmtDb25uZWN0LnRvU3RyaW5nKCksXG4gICAgICAgIEFjdGlvbi5MaW5rQ29ubmVjdGluZy50b1N0cmluZygpLFxuICAgICAgICBBY3Rpb24uTGlua0Nvbm5lY3RlZC50b1N0cmluZygpLFxuICAgICAgXSxcbiAgICAgIHRoaXMub25Db25uZWN0XG4gICAgKTtcbiAgICB0aGlzLl91cGRhdGVUb2tlbiA9IGdyYXBoLnB1YnN1Yi5zdWJzY3JpYmUoXG4gICAgICBBY3Rpb24uVXBkYXRlR3JhcGgudG9TdHJpbmcoKSxcbiAgICAgIHRoaXMub25VcGRhdGVOb2RlXG4gICAgKTtcbiAgfVxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBjb25zdCB7IGdyYXBoIH0gPSB0aGlzLnByb3BzO1xuICAgIGdyYXBoLnB1YnN1Yi51bnN1YnNjcmliZSh0aGlzLl90b2tlbik7XG4gICAgdGhpcy5fdG9rZW4gPSBcIlwiO1xuICAgIGdyYXBoLnB1YnN1Yi51bnN1YnNjcmliZSh0aGlzLl9jb25uZWN0VG9rZW4pO1xuICAgIHRoaXMuX2Nvbm5lY3RUb2tlbiA9IFwiXCI7XG4gICAgZ3JhcGgucHVic3ViLnVuc3Vic2NyaWJlKHRoaXMuX3VwZGF0ZVRva2VuKTtcbiAgICB0aGlzLl91cGRhdGVUb2tlbiA9IFwiXCI7XG4gIH1cbiAgcHJpdmF0ZSBvbkFjdGlvbiA9ICh0b3BpYzogc3RyaW5nLCBwYXlsb2FkOiBhbnkpID0+IHtcbiAgICBjb25zdCB7IG5vZGUsIGdyYXBoIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZXZlbnQsIGFjdGlvbkV2ZW50LCBvcHRpb25zIH0gPSBwYXlsb2FkO1xuICAgIGxldCBmb2xsb3dNb3ZlID0gZmFsc2U7XG4gICAgY29uc3QgZ1ZpZXdDb29yZFN5czogQ29vcmRTeXMuQ29vcmRTeXN0ZW0gPSBnZXQob3B0aW9ucywgXCJnVmlld0Nvb3JkU3lzXCIpO1xuICAgIGlmIChhY3Rpb25FdmVudC50eXBlID09PSBBY3Rpb25UeXBlLkJsYW5rKSB7XG4gICAgICBpZiAoQWN0aW9uLkNsaWNrLnRvU3RyaW5nKCkgPT09IHRvcGljKSB7XG4gICAgICAgIG5vZGUuc2V0UHJvcChcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKEFjdGlvbi5Nb3VzZVVwLnRvU3RyaW5nKCkgPT09IHRvcGljKSB7XG4gICAgICAgIC8vIOWkhOeQhumrmOS6ruS4jea2iOWkseeahOmXrumimFxuICAgICAgICB0aGlzLnJlc3RvcmUobm9kZSk7XG4gICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFjdGlvbkV2ZW50LnR5cGUgPT09IEFjdGlvblR5cGUuTm9kZSkge1xuICAgICAgaWYgKGFjdGlvbkV2ZW50LnRhcmdldCAhPT0gbm9kZS5pZCkge1xuICAgICAgICAvLyDlt7Lnu4/pgInkuK3nmoToioLngrnlpoLmnpzmo4DmtYvliLDmnInoioLngrnnp7vliqjliJnot5/pmo/np7vliqjvvIzkvYbmmK/mnInkuIDnp43mg4XlhrXkvovlpJbvvIxcbiAgICAgICAgLy8g5Y2z6KKr56e75Yqo6IqC54K55bCa5pyq6KKr6YCJ5Lit77yM5q2k5pe26KKr6YCJ5Lit55qE5YW25LuW6IqC54K55LiN6Lef6ZqP56e75YqoXG4gICAgICAgIGlmIChub2RlLmdldFByb3AoXCJzZWxlY3RlZFwiKSkge1xuICAgICAgICAgIGZvbGxvd01vdmUgPSB0cnVlO1xuICAgICAgICAgIGlmICghZ3JhcGguZ2V0Tm9kZShhY3Rpb25FdmVudC50YXJnZXQpLmdldFByb3AoXCJzZWxlY3RlZFwiKSkge1xuICAgICAgICAgICAgZm9sbG93TW92ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uRXZlbnQuYWN0aW9uID09PSBBY3Rpb24uQ2xpY2sgJiYgIWRvbS5pc0N0cmxPck1ldGEoZXZlbnQpKSB7XG4gICAgICAgICAgbm9kZS5zZXRQcm9wKFwic2VsZWN0ZWRcIiwgZmFsc2UpO1xuICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBhY3Rpb25FdmVudC50YXJnZXQgPT09IG5vZGUuaWQgfHxcbiAgICAgICAgKG5vZGUuZ2V0UHJvcChcInNlbGVjdGVkXCIpICYmIGZvbGxvd01vdmUpXG4gICAgICApIHtcbiAgICAgICAgbGV0IG9mZnNldFggPSAwO1xuICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XG4gICAgICAgIGxldCBwb3NpdGlvblggPSAwO1xuICAgICAgICBsZXQgcG9zaXRpb25ZID0gMDtcbiAgICAgICAgc3dpdGNoICh0b3BpYykge1xuICAgICAgICAgIGNhc2UgQWN0aW9uLk1vdXNlRG93bi50b1N0cmluZygpOlxuICAgICAgICAgICAgdGhpcy5wb2ludGVyWCA9IGFjdGlvbkV2ZW50LmNvb3JkaW5hdGUueDtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclkgPSBhY3Rpb25FdmVudC5jb29yZGluYXRlLnk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEFjdGlvbi5DbGljay50b1N0cmluZygpOlxuICAgICAgICAgICAgbm9kZS5zZXRQcm9wKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEFjdGlvbi5Nb3VzZVVwLnRvU3RyaW5nKCk6XG4gICAgICAgICAgY2FzZSBBY3Rpb24uTW91c2VNb3ZlLnRvU3RyaW5nKCk6XG4gICAgICAgICAgICBvZmZzZXRYID0gYWN0aW9uRXZlbnQuY29vcmRpbmF0ZS54IC0gdGhpcy5wb2ludGVyWDtcbiAgICAgICAgICAgIG9mZnNldFkgPSBhY3Rpb25FdmVudC5jb29yZGluYXRlLnkgLSB0aGlzLnBvaW50ZXJZO1xuICAgICAgICAgICAgcG9zaXRpb25YID0gbm9kZS5wb3NpdGlvblggKyBvZmZzZXRYIC8gKGdWaWV3Q29vcmRTeXMuc2NhbGVYIHx8IDEpO1xuICAgICAgICAgICAgcG9zaXRpb25ZID0gbm9kZS5wb3NpdGlvblkgKyBvZmZzZXRZIC8gKGdWaWV3Q29vcmRTeXMuc2NhbGVZIHx8IDEpO1xuICAgICAgICAgICAgZG9tLnRyYW5zZm9ybSh0aGlzLl9zZWxmLmN1cnJlbnQsIHtcbiAgICAgICAgICAgICAgeDogcG9zaXRpb25YLFxuICAgICAgICAgICAgICB5OiBwb3NpdGlvblksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGdyYXBoLnB1YnN1Yi5wdWJsaXNoKEFjdGlvbi5Ob2RlTW92aW5nLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICAgICAgY29vcmRpbmF0ZTogeyB4OiBwb3NpdGlvblgsIHk6IHBvc2l0aW9uWSB9LFxuICAgICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKEFjdGlvbi5Nb3VzZVVwLnRvU3RyaW5nKCkgPT09IHRvcGljKSB7XG4gICAgICAgICAgICAgIG5vZGUucG9zaXRpb25YID0gcG9zaXRpb25YO1xuICAgICAgICAgICAgICBub2RlLnBvc2l0aW9uWSA9IHBvc2l0aW9uWTtcbiAgICAgICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgICAgICBncmFwaC5wdWJzdWIucHVibGlzaChBY3Rpb24uTm9kZU1vdmVkLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlOiB7IHg6IHBvc2l0aW9uWCwgeTogcG9zaXRpb25ZIH0sXG4gICAgICAgICAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIG9uQ29ubmVjdCA9ICh0b3BpYzogc3RyaW5nLCBwYXlsb2FkOiBhbnkpID0+IHtcbiAgICBjb25zdCB7IG5vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc291cmNlUG9ydCA9IGdldChwYXlsb2FkLCBcInNvdXJjZVBvcnRcIikgYXMgUG9ydDtcbiAgICBjb25zdCBldmVudCA9IGdldChwYXlsb2FkLCBcImV2ZW50XCIpIGFzIE1vdXNlRXZlbnQ7XG4gICAgbGV0IHRhcmdldE5vZGU6IElOb2RlID0gbnVsbDtcbiAgICBsZXQgdGFyZ2V0UG9ydDogUG9ydCA9IG51bGw7XG4gICAgc3dpdGNoICh0b3BpYykge1xuICAgICAgY2FzZSBBY3Rpb24uTGlua0Nvbm5lY3QudG9TdHJpbmcoKTpcbiAgICAgICAgLy8g5byA5aeL6L+e57q/77yM5pu05paw5Y+v6L+e5o6l55qE56uv5Y+j54q25oCBXG4gICAgICAgIGlmIChzb3VyY2VQb3J0LmRpcmVjdGlvbiA9PT0gUG9ydERpcmVjdGlvbi5PVVQpIHtcbiAgICAgICAgICBub2RlLm91dFBvcnRzLm1hcCgocG9ydDogUG9ydCkgPT4ge1xuICAgICAgICAgICAgcG9ydC5jb25uZWN0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vZGUuaW5Qb3J0cy5tYXAoKHBvcnQ6IFBvcnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhblBvcnRDb25uZWN0KHNvdXJjZVBvcnQsIHBvcnQpKSB7XG4gICAgICAgICAgICAgIHBvcnQuY29ubmVjdGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcG9ydC5jb25uZWN0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzb3VyY2VQb3J0LmRpcmVjdGlvbiA9PT0gUG9ydERpcmVjdGlvbi5JTikge1xuICAgICAgICAgIG5vZGUuaW5Qb3J0cy5tYXAoKHBvcnQ6IFBvcnQpID0+IHtcbiAgICAgICAgICAgIHBvcnQuY29ubmVjdGFibGUgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub2RlLm91dFBvcnRzLm1hcCgocG9ydDogUG9ydCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2FuUG9ydENvbm5lY3Qoc291cmNlUG9ydCwgcG9ydCkpIHtcbiAgICAgICAgICAgICAgcG9ydC5jb25uZWN0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwb3J0LmNvbm5lY3RhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEFjdGlvbi5MaW5rQ29ubmVjdGluZy50b1N0cmluZygpOlxuICAgICAgICAvLyDov57mjqXov4fnqIvkuK3vvIzliKTmlq3mmK/lkKblnKjlvZPliY3oioLngrnnmoTlj6/ov57mjqXojIPlm7TlhoVcbiAgICAgICAgdGFyZ2V0Tm9kZSA9IGdldChwYXlsb2FkLCBcInRhcmdldE5vZGVcIikgYXMgSU5vZGU7XG4gICAgICAgIHRhcmdldFBvcnQgPSBnZXQocGF5bG9hZCwgXCJ0YXJnZXRQb3J0XCIpIGFzIFBvcnQ7XG4gICAgICAgIGlmICh0YXJnZXRQb3J0KSB7XG4gICAgICAgICAgY29uc3QgcG9ydDogUG9ydCA9IG5vZGUuZ2V0UG9ydCh0YXJnZXRQb3J0LmlkKTtcbiAgICAgICAgICBpZiAocG9ydCAmJiBwb3J0LmNvbm5lY3RhYmxlKSB7XG4gICAgICAgICAgICBwb3J0LmFic29yYmFibGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0Tm9kZSAmJiB0YXJnZXROb2RlLmlkID09PSBub2RlLmlkKSB7XG4gICAgICAgICAgY29uc3QgcG9pbnRlclg6IG51bWJlciA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgY29uc3QgYm91bmRpbmc6IERPTVJlY3QgPVxuICAgICAgICAgICAgdGhpcy5fc2VsZi5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIGFzIERPTVJlY3Q7XG4gICAgICAgICAgaWYgKHNvdXJjZVBvcnQuZGlyZWN0aW9uID09PSBQb3J0RGlyZWN0aW9uLklOKSB7XG4gICAgICAgICAgICBub2RlLm91dFBvcnRzLm1hcCgocHQ6IFBvcnQsIGlkeDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBib3VuZGluZy54ICsgKGlkeCAqIGJvdW5kaW5nLndpZHRoKSAvIG5vZGUub3V0UG9ydHMubGVuZ3RoIDw9XG4gICAgICAgICAgICAgICAgICBwb2ludGVyWCAmJlxuICAgICAgICAgICAgICAgIHBvaW50ZXJYIDw9XG4gICAgICAgICAgICAgICAgICBib3VuZGluZy54ICtcbiAgICAgICAgICAgICAgICAgICAgKChpZHggKyAxKSAqIGJvdW5kaW5nLndpZHRoKSAvIG5vZGUub3V0UG9ydHMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgcHQuY29ubmVjdGFibGVcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcHQuYWJzb3JiYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHQuYWJzb3JiYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNvdXJjZVBvcnQuZGlyZWN0aW9uID09PSBQb3J0RGlyZWN0aW9uLk9VVCkge1xuICAgICAgICAgICAgbm9kZS5pblBvcnRzLm1hcCgocHQ6IFBvcnQsIGlkeDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBib3VuZGluZy54ICsgKGlkeCAqIGJvdW5kaW5nLndpZHRoKSAvIG5vZGUuaW5Qb3J0cy5sZW5ndGggPD1cbiAgICAgICAgICAgICAgICAgIHBvaW50ZXJYICYmXG4gICAgICAgICAgICAgICAgcG9pbnRlclggPD1cbiAgICAgICAgICAgICAgICAgIGJvdW5kaW5nLnggK1xuICAgICAgICAgICAgICAgICAgICAoKGlkeCArIDEpICogYm91bmRpbmcud2lkdGgpIC8gbm9kZS5pblBvcnRzLmxlbmd0aCAmJlxuICAgICAgICAgICAgICAgIHB0LmNvbm5lY3RhYmxlICYmXG4gICAgICAgICAgICAgICAgIXB0LmNvbm5lY3RlZFxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBwdC5hYnNvcmJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwdC5hYnNvcmJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEFjdGlvbi5MaW5rQ29ubmVjdGVkLnRvU3RyaW5nKCk6XG4gICAgICAgIC8vIOi/nuaOpee7k+adn++8jOWPlua2iOmrmOS6rueKtuaAgVxuICAgICAgICB0aGlzLnJlc3RvcmUobm9kZSk7XG4gICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9O1xuICByZXN0b3JlID0gKG5vZGU6IElOb2RlKSA9PiB7XG4gICAgbm9kZS5pblBvcnRzLm1hcCgocG9ydDogUG9ydCkgPT4ge1xuICAgICAgcG9ydC5jb25uZWN0YWJsZSA9IGZhbHNlO1xuICAgICAgcG9ydC5hYnNvcmJhYmxlID0gZmFsc2U7XG4gICAgfSk7XG4gICAgbm9kZS5vdXRQb3J0cy5tYXAoKHBvcnQ6IFBvcnQpID0+IHtcbiAgICAgIHBvcnQuY29ubmVjdGFibGUgPSBmYWxzZTtcbiAgICAgIHBvcnQuYWJzb3JiYWJsZSA9IGZhbHNlO1xuICAgIH0pO1xuICB9O1xuICBjYW5Qb3J0Q29ubmVjdChwb3J0OiBQb3J0LCB0YXJnZXRQb3J0OiBQb3J0KTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyBncmFwaCB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gY2FuUG9ydENvbm5lY3QocG9ydCwgdGFyZ2V0UG9ydCk7XG4gIH1cbiAgdXBkYXRlUG9zaXRpb24oZnJvbTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LCB0bzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgZGVsdGFYID0gKHRvLnggLSBmcm9tLngpIC8gMzA7XG4gICAgY29uc3QgZGVsdGFZID0gKHRvLnkgLSBmcm9tLnkpIC8gMzA7XG4gICAgbGV0IGNvdW50ID0gMTtcbiAgICBmdW5jdGlvbiB1cGRhdGVQb3MoKSB7XG4gICAgICBjb25zdCBwb3NpdGlvblggPSBmcm9tLnggKyBjb3VudCAqIGRlbHRhWDtcbiAgICAgIGNvbnN0IHBvc2l0aW9uWSA9IGZyb20ueSArIGNvdW50ICogZGVsdGFZO1xuICAgICAgaWYgKFxuICAgICAgICBNYXRoLmFicyhwb3NpdGlvblggLSB0by54KSA+IE1hdGguYWJzKGRlbHRhWCkgfHxcbiAgICAgICAgTWF0aC5hYnMocG9zaXRpb25ZIC0gdG8ueSkgPiBNYXRoLmFicyhkZWx0YVkpXG4gICAgICApIHtcbiAgICAgICAgZG9tLnRyYW5zZm9ybSh0aGF0Ll9zZWxmLmN1cnJlbnQsIHsgeDogcG9zaXRpb25YLCB5OiBwb3NpdGlvblkgfSk7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlUG9zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbS50cmFuc2Zvcm0odGhhdC5fc2VsZi5jdXJyZW50LCB7IHg6IHRvLngsIHk6IHRvLnkgfSk7XG4gICAgICAgIHRoYXQuZm9yY2VVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlUG9zKCk7XG4gIH1cbiAgb25VcGRhdGVOb2RlID0gKHRvcGljOiBzdHJpbmcsIHBheWxvYWQ6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgbm9kZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBub2Rlc01hcDogeyBba2V5OiBzdHJpbmddOiBOb2RlVXBkYXRlIH0gPSBnZXQocGF5bG9hZCwgXCJub2RlTWFwXCIpIGFzIHtcbiAgICAgIFtrZXk6IHN0cmluZ106IE5vZGVVcGRhdGU7XG4gICAgfTtcbiAgICBjb25zdCBmcm9tID0geyB4OiBub2RlLnBvc2l0aW9uWCwgeTogbm9kZS5wb3NpdGlvblkgfTtcbiAgICBpZiAobm9kZXNNYXBbbm9kZS5pZF0pIHtcbiAgICAgIE9iamVjdC5rZXlzKG5vZGVzTWFwW25vZGUuaWRdKS5tYXAoKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgIG5vZGUuc2V0UHJvcChrZXksIG5vZGVzTWFwW25vZGUuaWRdW2tleV0pO1xuICAgICAgfSk7XG4gICAgICBjb25zdCB0byA9IHsgeDogbm9kZS5wb3NpdGlvblgsIHk6IG5vZGUucG9zaXRpb25ZIH07XG4gICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKGZyb20sIHRvKTtcbiAgICB9XG4gIH07XG4gIG9uTW91c2VMZWF2ZSA9ICgpID0+IHtcbiAgICBjb25zdCB7IG5vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgbm9kZS5pblBvcnRzLm1hcCgocG9ydDogUG9ydCkgPT4ge1xuICAgICAgcG9ydC5hYnNvcmJhYmxlID0gZmFsc2U7XG4gICAgfSk7XG4gICAgbm9kZS5vdXRQb3J0cy5tYXAoKHBvcnQ6IFBvcnQpID0+IHtcbiAgICAgIHBvcnQuYWJzb3JiYWJsZSA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfTtcbiAgb25JY29uTW91c2VFbnRlciA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogdHJ1ZSB9KTtcbiAgfTtcbiAgb25JY29uTW91c2VMZWF2ZSA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gIH07XG4gIHJlbmRlcigpOiBSZWFjdC5SZWFjdE5vZGUge1xuICAgIGNvbnN0IHsgdmlzaWJsZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IG5vZGUsIGluRHJhZ01vZGUgPSBmYWxzZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBub2RlSWQ6IHN0cmluZyA9IG5vZGUuaWQ7XG4gICAgY29uc3QgcG9zaXRpb25YOiBudW1iZXIgPSBub2RlLnBvc2l0aW9uWDtcbiAgICBjb25zdCBwb3NpdGlvblk6IG51bWJlciA9IG5vZGUucG9zaXRpb25ZO1xuICAgIGNvbnN0IHdpZHRoOiBudW1iZXIgPSBub2RlLmRhdGEud2lkdGggfHwgMTgwO1xuICAgIGNvbnN0IGhlaWdodDogbnVtYmVyID0gbm9kZS5kYXRhLmhlaWdodCB8fCAzMDtcbiAgICBjb25zdCBzZWxlY3RlZDogYm9vbGVhbiA9IG5vZGUuZ2V0UHJvcChcInNlbGVjdGVkXCIpO1xuICAgIGNvbnN0IG5vZGVDbGFzczogc3RyaW5nID0gY2xhc3NOYW1lcyh7XG4gICAgICBcIm5vZGUtY29udGVudFwiOiB0cnVlLFxuICAgICAgc2VsZWN0ZWQsXG4gICAgICBcImhhcy1zdGF0dXNcIjogbm9kZS5kYXRhLnN0YXR1cyAhPT0gTm9kZVN0YXR1cy5DUkVBVEVELFxuICAgIH0pO1xuICAgIGxldCBub2RlUHJvZ3Jlc3M6IFJlYWN0LlJlYWN0Tm9kZSA9IG51bGw7XG4gICAgaWYgKG5vZGUuZGF0YS5zdGF0dXMgPT09IE5vZGVTdGF0dXMuUlVOTklORykge1xuICAgICAgbm9kZVByb2dyZXNzID0gKFxuICAgICAgICA8Tm9kZVByb2dyZXNzIHJhZGl1cz17OH0gcHJvZ3Jlc3M9e25vZGUuZGF0YS5wcm9ncmVzcyB8fCAwfSAvPlxuICAgICAgKTtcbiAgICB9XG4gICAgbGV0IHN0YXR1c0ljb246IHN0cmluZyA9IG5vZGUuZGF0YS5zdGF0dXM7XG4gICAgaWYgKG5vZGUuZGF0YS5zdGF0dXMgPT09IE5vZGVTdGF0dXMuQ0FOQ0VMRUQpIHtcbiAgICAgIHN0YXR1c0ljb24gPSBcImNhbmNlbC1jaXJjbGVcIjtcbiAgICB9XG4gICAgaWYgKG5vZGUuZGF0YS5zdGF0dXMgPT09IE5vZGVTdGF0dXMuUVVFVUVJTkcpIHtcbiAgICAgIHN0YXR1c0ljb24gPSBcImhvdXItZ2xhc3NcIjtcbiAgICB9XG4gICAgY29uc3Qgbm9kZVdyYXBwZXJDbGFzcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJub2RlLXdyYXBwZXJcIjogdHJ1ZSxcbiAgICAgIHJ1bm5pbmc6IG5vZGUuZGF0YS5zdGF0dXMgPT0gTm9kZVN0YXR1cy5SVU5OSU5HLFxuICAgIH0pO1xuICAgIGNvbnN0IGdFdmVudDogYW55ID0gaW5EcmFnTW9kZSA/IHt9IDogeyBvbk1vdXNlTGVhdmU6IHRoaXMub25Nb3VzZUxlYXZlIH07XG4gICAgY29uc3QgaWNvbkV2ZW50OiBhbnkgPSBpbkRyYWdNb2RlXG4gICAgICA/IHt9XG4gICAgICA6IHtcbiAgICAgICAgICBvbk1vdXNlRW50ZXI6IHRoaXMub25JY29uTW91c2VFbnRlcixcbiAgICAgICAgICBvbk1vdXNlTGVhdmU6IHRoaXMub25JY29uTW91c2VMZWF2ZSxcbiAgICAgICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgPGdcbiAgICAgICAgY2xhc3NOYW1lPVwibm9kZVwiXG4gICAgICAgIHN0eWxlPXt7IHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke3Bvc2l0aW9uWH1weCwgJHtwb3NpdGlvbll9cHgpYCB9fVxuICAgICAgICByZWY9e3RoaXMuX3NlbGZ9XG4gICAgICAgIHsuLi5nRXZlbnR9XG4gICAgICA+XG4gICAgICAgIDxmb3JlaWduT2JqZWN0IHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17bm9kZVdyYXBwZXJDbGFzc31cbiAgICAgICAgICAgIGRhdGEtYWN0aW9uLXR5cGU9e0FjdGlvblR5cGUuTm9kZX1cbiAgICAgICAgICAgIGRhdGEtaWQ9e25vZGVJZH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bm9kZUNsYXNzfT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpY29uXCIgey4uLmljb25FdmVudH0+XG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT17bm9kZS5kYXRhLnRhZ30gaWNvbj17bm9kZS5kYXRhLnR5cGV9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHRcIj57bm9kZS5kYXRhLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3RhdHVzXCJcbiAgICAgICAgICAgICAgICB0aXRsZT17YCR7XG4gICAgICAgICAgICAgICAgICBub2RlUHJvZ3Jlc3NcbiAgICAgICAgICAgICAgICAgICAgPyBub2RlLmRhdGEucHJvZ3Jlc3MgKyBcIiVcIlxuICAgICAgICAgICAgICAgICAgICA6IG5vZGUuZGF0YS5zdGF0dXNEZXRhaWxcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24tJHtzdGF0dXNJY29ufWB9Pntub2RlUHJvZ3Jlc3N9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub2RlLXBvcnQtbGlzdCBpblwiPlxuICAgICAgICAgICAgICAgIHttYXAoXG4gICAgICAgICAgICAgICAgICBub2RlLmluUG9ydHMsXG4gICAgICAgICAgICAgICAgICAocG9ydDogUG9ydCwgaWR4OiBudW1iZXIsIHBvcnRzOiBQb3J0W10pOiBSZWFjdC5SZWFjdE5vZGUgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibm9kZS1wb3J0LXdyYXBwZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHsxMDAgLyAobm9kZS5pblBvcnRzLmxlbmd0aCArIDEpfSVgIH19XG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtwb3J0LmlkfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFBvcnRWaWV3XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3J0PXtwb3J0fVxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZT17bm9kZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyPXtpZHh9XG4gICAgICAgICAgICAgICAgICAgICAgICBpbkRyYWdNb2RlPXtpbkRyYWdNb2RlfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vZGUtcG9ydC1saXN0IG91dFwiPlxuICAgICAgICAgICAgICAgIHttYXAoXG4gICAgICAgICAgICAgICAgICBub2RlLm91dFBvcnRzLFxuICAgICAgICAgICAgICAgICAgKHBvcnQ6IFBvcnQsIGlkeDogbnVtYmVyLCBwb3J0czogUG9ydFtdKTogUmVhY3QuUmVhY3ROb2RlID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm5vZGUtcG9ydC13cmFwcGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogYCR7MTAwIC8gKG5vZGUub3V0UG9ydHMubGVuZ3RoICsgMSl9JWAgfX1cbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e3BvcnQuaWR9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8UG9ydFZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ9e3BvcnR9XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlPXtub2RlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI9e2lkeH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGluRHJhZ01vZGU9e2luRHJhZ01vZGV9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb3JlaWduT2JqZWN0PlxuICAgICAgPC9nPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVZpZXc7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZUE7QUFBQTtBQU9BO0FBQUE7QUFMQTtBQUNBO0FBNENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNEJBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUErQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUlBO0FBQ0E7QUFHQTtBQUVBO0FBU0E7QUFVQTtBQVNBO0FBZUE7QUFDQTtBQUFBO0FBRUE7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/components/node.tsx