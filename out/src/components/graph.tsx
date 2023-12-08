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
var context_1 = __webpack_require__( /*! @/common/context */ "./src/common/context/index.ts");
var graph_1 = __webpack_require__( /*! @/core/graph */ "./src/core/graph.ts");
var link_1 = __webpack_require__( /*! @/core/link */ "./src/core/link.ts");
var node_1 = __webpack_require__( /*! @/core/node */ "./src/core/node.ts");
var port_1 = __webpack_require__( /*! @/core/port */ "./src/core/port.ts");
var theme_1 = __webpack_require__( /*! @/common/theme */ "./src/common/theme/index.ts");
var plugins_1 = __webpack_require__( /*! @/plugins */ "./src/plugins/index.ts");
var coord_sys_1 = __webpack_require__( /*! @/utils/coord-sys */ "./src/utils/coord-sys.ts");
var dom = __webpack_require__( /*! @/utils/dom */ "./src/utils/dom.ts");
var others_1 = __webpack_require__( /*! @/utils/others */ "./src/utils/others.ts");
var delegation_1 = __webpack_require__( /*! ./delegation */ "./src/components/delegation.ts");
var defs_1 = __webpack_require__( /*! ./defs */ "./src/components/defs.tsx");
var background_1 = __webpack_require__( /*! ./background */ "./src/components/background.tsx");
var node_2 = __webpack_require__( /*! ./node */ "./src/components/node.tsx");
var link_2 = __webpack_require__( /*! ./link */ "./src/components/link.tsx");
var contextmenu_1 = __webpack_require__( /*! ./contextmenu */ "./src/components/contextmenu.tsx");
var selection_1 = __webpack_require__( /*! ./selection */ "./src/components/selection.tsx");
__webpack_require__( /*! @/styles/main.scss */ "./src/styles/main.scss");
var GraphView = /** @class */ (function(_super) {
  __extends(GraphView, _super);

  function GraphView(props, state) {
    var _this = _super.call(this, props, state) || this;
    _this.canvas = {
      width: 0,
      height: 0,
      padding: "",
    };
    _this.throttleThreshold = 1000;
    _this.viewer = React.createRef();
    _this.scrollPane = React.createRef();
    _this.selectionRef = React.createRef();
    _this.mouseMoved = 0;
    // 修复快速点击并移出节点导致的无法取消选中的问题
    _this.mouseMoveThrehold = 1;
    _this.scrollTop = 0;
    _this.scrollLeft = 0;
    _this.pointerX = 0;
    _this.pointerY = 0;
    _this.zoomRange = [0.2, 2];
    _this.zoomStep = 0.1;
    // 设置标志位，解决一个诡异的chrome问题，拖拽移出绘图区域，然后快速右键，再点击取消contextmenu，
    // 此时用户已经不需要按着鼠标了，连线会自动跟随，在图中点击之后，会再一次触发mousedown事件，这就
    // 相当于触发了两次的mousedown事件，为了解决这个问题，增加标志位，表示是否在拖拽模式中，如果在了，
    // 不响应mousedown事件，只响应mouseup事件，避免连线bug和内存泄露
    _this.inDragMode = false;
    _this.wrapCoordSys = {
      x: 0,
      y: 0,
    };
    _this.svgCoordSys = {
      x: 0,
      y: 0,
      width: 2 * dom.screen().width,
      height: 2 * dom.screen().height,
    };
    _this.gViewCoordSys = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    };
    // 是否在框选模式下
    _this.selectionArea = {
      x: 0,
      y: 0,
      x1: 0,
      y1: 0,
    };
    _this.updateWrapCoordSys = function() {
      if (_this.viewer.current) {
        var editorRect = dom.getBoundingClientRect(_this.viewer.current);
        _this.assignBoxToCoord(editorRect, _this.wrapCoordSys);
      }
    };
    // 添加节点
    _this.addNodeWithData = function(data) {
      var node = node_1.default.fromData(data);
      node.coordinate = (0, coord_sys_1.convert)({
        x: 0,
        y: 0
      }, _this.svgCoordSys, node.coordinate);
      var coord = node.coordinate;
      var pos = _this.reachEdge(coord, {
        width: node.data.width,
        height: node.data.height,
      });
      var offsetX = node.data.width * 2 * _this.gViewCoordSys.scaleX;
      var offsetY = node.data.height * 2 * _this.gViewCoordSys.scaleY;
      var extendX = 0;
      var extendY = 0;
      var scrollDirectionX = 0;
      var scrollDirectionY = 0;
      switch (pos) {
        case delegation_1.Edge.left:
          extendX = offsetX;
          scrollDirectionX = -1;
          break;
        case delegation_1.Edge.top:
          scrollDirectionY = -1;
          extendY = offsetY;
          break;
        case delegation_1.Edge.right:
          extendX = offsetX;
          break;
        case delegation_1.Edge.bottom:
          extendY = offsetY;
          break;
        case delegation_1.Edge.leftTop:
          extendX = offsetX;
          extendY = offsetY;
          scrollDirectionX = -1;
          scrollDirectionY = -1;
          break;
        case delegation_1.Edge.leftBottom:
          extendX = offsetX;
          extendY = offsetY;
          scrollDirectionX = -1;
          break;
        case delegation_1.Edge.rightTop:
          extendX = offsetX;
          extendY = offsetY;
          scrollDirectionY = -1;
          break;
        case delegation_1.Edge.rightBottom:
          extendX = offsetX;
          extendY = offsetY;
          break;
        default:
          break;
      }
      node.coordinate = (0, coord_sys_1.convert)(_this.gViewCoordSys, {
        x: 0,
        y: 0
      }, node.coordinate, true);
      _this.graph.addNode(node);
      if (extendX) {
        _this.svgCoordSys.width += extendX;
        if (scrollDirectionX) {
          _this.gViewCoordSys.x -= scrollDirectionX * extendX;
        }
      }
      if (extendY) {
        _this.svgCoordSys.height += extendY;
        if (scrollDirectionY) {
          _this.gViewCoordSys.y -= scrollDirectionY * extendY;
        }
      }
      _this.setState({
        svgCoords: (0, lodash_1.cloneDeep)(_this.svgCoordSys),
        gViewCoords: (0, lodash_1.cloneDeep)(_this.gViewCoordSys),
      }, function() {
        dom.scrollBy(_this.viewer.current, {
          x: scrollDirectionX * extendX,
          y: scrollDirectionY * extendY,
        });
      });
    };
    // 主题更新
    _this.updateTheme = function(themeName) {
      _this.graph.data.theme = themeName;
      (0, theme_1.updateTheme)(themeName);
    };
    _this.getZoom = function() {
      return _this.gViewCoordSys.scaleX;
    };
    // 缩放相关
    _this.zoomIn = function(step) {
      if (step === void 0) {
        step = _this.zoomStep;
      }
      return _this.scale(step);
    };
    _this.zoomOut = function(step) {
      if (step === void 0) {
        step = _this.zoomStep;
      }
      return _this.scale(0 - step);
    };
    _this.zoomToFit = function() {
      // find rect area
      var topmost = Number.POSITIVE_INFINITY;
      var leftmost = Number.POSITIVE_INFINITY;
      var rightmost = Number.NEGATIVE_INFINITY;
      var bottommost = Number.NEGATIVE_INFINITY;
      var rightmostNode;
      var bottommostNode;
      _this.graph.nodes.map(function(node) {
        if (node.positionX < leftmost)
          leftmost = node.positionX;
        if (node.positionX > rightmost) {
          rightmost = node.positionX;
          rightmostNode = node;
        }
        if (node.positionY < topmost)
          topmost = node.positionY;
        if (node.positionY > bottommost) {
          bottommost = node.positionY;
          bottommostNode = node;
        }
      });
      var nodesWidth = 0;
      var nodesHeight = 0;
      if (rightmostNode && bottommostNode) {
        nodesWidth = rightmost + rightmostNode.data.width - leftmost;
        nodesHeight = bottommost + bottommostNode.data.height - topmost;
      }
      // 如果没有节点则直接返回
      if (nodesWidth <= 0 || nodesHeight <= 0) {
        return 1;
      }
      var zoom = 1;
      var scaleX = Math.ceil((_this.wrapCoordSys.width * 9) / nodesWidth) / 10;
      var scaleY = Math.ceil((_this.wrapCoordSys.height * 9) / nodesHeight) / 10;
      if (scaleX >= 1 && scaleY >= 1) {
        zoom = Math.min(Math.min(scaleX, scaleY), _this.zoomRange[1]);
      } else if (scaleX <= 1 && scaleY <= 1) {
        zoom = Math.max(Math.min(scaleX, scaleY), _this.zoomRange[0]);
      } else {
        zoom = Math.max(Math.min(scaleX, scaleY), _this.zoomRange[0]);
      }
      var centerX = nodesWidth / 2 + leftmost;
      var centerY = nodesHeight / 2 + topmost;
      _this.gViewCoordSys.scaleX = zoom;
      _this.gViewCoordSys.scaleY = zoom;
      var newCenterX = centerX * zoom;
      var newCenterY = centerY * zoom;
      _this.svgCoordSys.width = dom.screen().width * 2;
      _this.svgCoordSys.height = dom.screen().height * 2;
      var offsetX = _this.svgCoordSys.width / 2 - newCenterX;
      var offsetY = _this.svgCoordSys.height / 2 - newCenterY;
      _this.gViewCoordSys.x = offsetX;
      _this.gViewCoordSys.y = offsetY;
      // 将svg滚动到中间位置
      var scrollTop = (_this.svgCoordSys.height - _this.wrapCoordSys.height) / 2;
      var scrollLeft = (_this.svgCoordSys.width - _this.wrapCoordSys.width) / 2;
      _this.svgCoordSys.x = _this.wrapCoordSys.x - scrollLeft;
      _this.svgCoordSys.y = _this.wrapCoordSys.y - scrollTop;
      _this.setState({
        svgCoords: (0, lodash_1.cloneDeep)(_this.svgCoordSys),
        gViewCoords: (0, lodash_1.cloneDeep)(_this.gViewCoordSys),
      }, function() {
        dom.scroll(_this.viewer.current, {
          x: scrollLeft,
          y: scrollTop,
        });
      });
      return zoom;
    };
    _this.updateGraph = function(nodes) {
      var nodeMap = {};
      nodes.map(function(node) {
        var iNode = _this.graph.getNode(node.id);
        if (iNode) {
          node.originX = iNode.positionX;
          node.originY = iNode.positionY;
        }
        nodeMap[node.id] = node;
      });
      _this.graph.pubsub.publish(delegation_1.Action.UpdateGraph.toString(), {
        nodeMap: nodeMap
      });
    };
    _this.loadGraph = function(graphData) {
      _this.setState({
        loading: true
      });
      _this.graph.reset();
      _this.graph.loadData(graphData);
      var defaultView = dom.screen();
      _this.updateTheme(graphData.theme || "light");
      _this.graph.data.svgCoords = _this.graph.data.svgCoords || {
        x: 0,
        y: 0,
        width: 2 * defaultView.width,
        height: 2 * defaultView.height,
      };
      _this.svgCoordSys = _this.graph.data.svgCoords;
      _this.graph.data.gViewCoords = _this.graph.data.gViewCoords || {
        x: 0,
        y: 0,
        width: 2 * defaultView.width,
        height: 2 * defaultView.height,
        scaleX: 1,
        scaleY: 1,
      };
      _this.gViewCoordSys = _this.graph.data.gViewCoords;
      _this.setState({
        loading: false,
        svgCoords: (0, lodash_1.cloneDeep)(_this.svgCoordSys),
        gViewCoords: (0, lodash_1.cloneDeep)(_this.gViewCoordSys),
      }, function() {
        dom.scroll(_this.viewer.current, {
          x: _this.wrapCoordSys.x - _this.svgCoordSys.x,
          y: _this.wrapCoordSys.y - _this.svgCoordSys.y,
        });
      });
    };
    _this.exportGraph = function() {
      return _this.graph.exportJson();
    };
    _this.onAction = function(topic, payload) {
      var _a = _this.props,
        readonly = _a.readonly,
        onLinkConnected = _a.onLinkConnected,
        inSelectionMode = _a.inSelectionMode;
      var event = payload.event,
        actionEvent = payload.actionEvent;
      var maxScrollTop = _this.svgCoordSys.height - _this.wrapCoordSys.height;
      var maxScrollLeft = _this.svgCoordSys.width - _this.wrapCoordSys.width;
      if (actionEvent.type === delegation_1.ActionType.Blank) {
        if (inSelectionMode) {
          var _b = (0, coord_sys_1.convert)({
              x: 0,
              y: 0
            }, _this.svgCoordSys, actionEvent.coordinate),
            x = _b.x,
            y = _b.y;
          switch (topic) {
            case delegation_1.Action.MouseDown.toString():
              _this.selectionArea.x = x;
              _this.selectionArea.y = y;
              _this.selectionArea.x1 = x;
              _this.selectionArea.y1 = y;
              _this.setState({
                selectionArea: __assign({}, _this.selectionArea)
              });
              break;
            case delegation_1.Action.MouseUp.toString():
              _this.selectNodesInArea(__assign({}, _this.selectionArea));
              _this.selectionArea.x = x;
              _this.selectionArea.y = y;
              _this.selectionArea.x1 = x;
              _this.selectionArea.y1 = y;
              if (_this.selectionRef.current) {
                dom.setAttributes(_this.selectionRef.current, {
                  x: "".concat(Math.min(_this.selectionArea.x, _this.selectionArea.x1)),
                  y: "".concat(Math.min(_this.selectionArea.y, _this.selectionArea.y1)),
                  width: "".concat(Math.abs(_this.selectionArea.x - _this.selectionArea.x1)),
                  height: "".concat(Math.abs(_this.selectionArea.y - _this.selectionArea.y1)),
                });
              }
              _this.setState({
                selectionArea: __assign({}, _this.selectionArea),
                inDragMode: false,
              });
              break;
            case delegation_1.Action.MouseMove.toString():
              _this.selectionArea.x1 = x;
              _this.selectionArea.y1 = y;
              if (_this.selectionRef.current) {
                dom.setAttributes(_this.selectionRef.current, {
                  x: "".concat(Math.min(_this.selectionArea.x, _this.selectionArea.x1)),
                  y: "".concat(Math.min(_this.selectionArea.y, _this.selectionArea.y1)),
                  width: "".concat(Math.abs(_this.selectionArea.x - _this.selectionArea.x1)),
                  height: "".concat(Math.abs(_this.selectionArea.y - _this.selectionArea.y1)),
                });
              }
              break;
          }
        } else {
          var offsetX = 0;
          var offsetY = 0;
          var scrollLeft = 0;
          var scrollTop = 0;
          switch (topic) {
            case delegation_1.Action.MouseDown.toString():
              _this.pointerX = actionEvent.coordinate.x;
              _this.pointerY = actionEvent.coordinate.y;
              _this.scrollTop = _this.wrapCoordSys.y - _this.svgCoordSys.y;
              _this.scrollLeft = _this.wrapCoordSys.x - _this.svgCoordSys.x;
              break;
            case delegation_1.Action.Click.toString():
              _this.forceUpdate();
              break;
            case delegation_1.Action.DoubleClick.toString():
              // 双击空白处自动放大
              _this.zoomIn();
              break;
            case delegation_1.Action.MouseUp.toString():
              _this.pointerX = 0;
              _this.pointerY = 0;
              // 修复鼠标移出图区域然后点击右键出现菜单之后点击取消菜单，再移回来点击空白处导致连线无法消失的问题
              if (_this.preLink) {
                _this.graph.removeLink(_this.preLink, true);
                _this.preLink = null;
                _this.setState({
                  inDragMode: false
                });
              }
              break;
            case delegation_1.Action.MouseMove.toString():
              offsetX = actionEvent.coordinate.x - _this.pointerX;
              offsetY = actionEvent.coordinate.y - _this.pointerY;
              scrollLeft = Math.min(maxScrollLeft, Math.max(0, _this.scrollLeft - offsetX));
              scrollTop = Math.min(maxScrollTop, Math.max(0, _this.scrollTop - offsetY));
              dom.scroll(_this.viewer.current, {
                x: scrollLeft,
                y: scrollTop,
              });
              break;
          }
        }
      }
      // 如果动作对象是port
      if (delegation_1.ActionType.Port === actionEvent.type) {
        if (readonly)
          return;
        var offsetX = 0;
        var offsetY = 0;
        var positionX = 0;
        var positionY = 0;
        var targetNode = null;
        var targetPort = null;
        var targetPortEl = null;
        // FIXME: this is a hack now
        var portElement = dom.querySelector(document.documentElement, "[data-id=\"".concat(actionEvent.target, "\"]"));
        var nodeId = portElement.dataset.attached;
        var sourceNode = _this.graph.getNode(nodeId);
        var sourcePort = sourceNode.getPort(actionEvent.target);
        // 针对端口的操作分两种：
        // 第一种：输出口 -> 输入口
        // 第二种: 输入口 -> 输出口
        switch (topic) {
          case delegation_1.Action.MouseDown.toString():
            _this.graph.fakeNode = _this.makeFakeNode(sourceNode, actionEvent.target);
            _this.pointerX = actionEvent.coordinate.x;
            _this.pointerY = actionEvent.coordinate.y;
            _this.preLink = _this.makeLink(sourceNode, actionEvent.target, _this.graph.fakeNode);
            _this.graph.addLink(_this.preLink, true);
            _this.graph.pubsub.publish(delegation_1.Action.LinkConnect.toString(), {
              sourceNode: sourceNode,
              sourcePort: sourcePort,
              event: event,
            });
            _this.forceUpdate();
            break;
          case delegation_1.Action.MouseMove.toString():
          case delegation_1.Action.MouseUp.toString():
            // FIXME: this is a hack now
            targetPortEl = _this.findClosest(event.target, "[data-action-type]");
            if (targetPortEl) {
              var actionType = targetPortEl.dataset.actionType;
              var dataId = targetPortEl.dataset.id;
              if (actionType === delegation_1.ActionType.Port) {
                var nodeId_1 = targetPortEl.dataset.attached;
                targetNode = _this.graph.getNode(nodeId_1);
                targetPort = targetNode.getPort(dataId);
              }
              if (actionType === delegation_1.ActionType.Node) {
                targetNode = _this.graph.getNode(dataId);
              }
            }
            offsetX = actionEvent.coordinate.x - _this.pointerX;
            offsetY = actionEvent.coordinate.y - _this.pointerY;
            positionX =
              sourceNode.positionX + offsetX / (_this.gViewCoordSys.scaleX || 1);
            if (sourceNode.hasInPort(actionEvent.target)) {
              positionY =
                sourceNode.positionY -
                _this.graph.fakeNode.data.height +
                offsetY / (_this.gViewCoordSys.scaleY || 1);
            }
            if (sourceNode.hasOutPort(actionEvent.target)) {
              positionY =
                sourceNode.positionY +
                _this.graph.fakeNode.data.height +
                offsetY / (_this.gViewCoordSys.scaleY || 1);
            }
            _this.graph.fakeNode.coordinate = {
              x: positionX,
              y: positionY
            };
            _this.graph.pubsub.publish(delegation_1.Action.NodeMoving.toString(), {
              coordinate: _this.graph.fakeNode.coordinate,
              id: _this.graph.fakeNode.id,
            });
            _this.graph.pubsub.publish(delegation_1.Action.LinkConnecting.toString(), {
              sourceNode: sourceNode,
              sourcePort: sourcePort,
              event: event,
              targetNode: targetNode,
              targetPort: targetPort,
            });
            if (delegation_1.Action.MouseUp.toString() === topic) {
              if (targetPort && (0, others_1.canPortConnect)(sourcePort, targetPort)) {
                if (targetPort.direction === port_1.PortDirection.IN) {
                  _this.preLink.target = targetPort.attached;
                  _this.preLink.targetPort = targetPort.id;
                }
                if (targetPort.direction === port_1.PortDirection.OUT) {
                  _this.preLink.source = targetPort.attached;
                  _this.preLink.sourcePort = targetPort.id;
                }
                _this.graph.converFakeLinkToNormal(_this.preLink);
                onLinkConnected &&
                  onLinkConnected((0, lodash_1.cloneDeep)(_this.preLink.exportJson()));
              } else if (targetNode && sourcePort.attached !== targetNode.id) {
                var isConnected_1 = false;
                targetNode.outPorts.map(function(pt) {
                  if (pt.absorbable) {
                    _this.preLink.source = pt.attached;
                    _this.preLink.sourcePort = pt.id;
                    _this.graph.converFakeLinkToNormal(_this.preLink);
                    isConnected_1 = true;
                  }
                });
                targetNode.inPorts.map(function(pt) {
                  if (pt.absorbable) {
                    _this.preLink.target = pt.attached;
                    _this.preLink.targetPort = pt.id;
                    _this.graph.converFakeLinkToNormal(_this.preLink);
                    isConnected_1 = true;
                  }
                });
                if (!isConnected_1) {
                  _this.graph.removeLink(_this.preLink, true);
                } else {
                  onLinkConnected &&
                    onLinkConnected((0, lodash_1.cloneDeep)(_this.preLink.exportJson()));
                }
              } else {
                _this.graph.removeLink(_this.preLink, true);
              }
              _this.preLink = null;
              _this.setState({
                inDragMode: false
              });
              _this.graph.pubsub.publish(delegation_1.Action.LinkConnected.toString(), {
                event: event,
                sourceNode: sourceNode,
                sourcePort: sourcePort,
              });
            }
            break;
        }
      }
    };
    _this.onGraphClick = function(event) {
      var onGraphClick = _this.props.onGraphClick;
      // 如果是Ctrl/Command + Click事件的话，无视this.mouseMoved
      if (_this.mouseMoved <= _this.mouseMoveThrehold ||
        dom.isCtrlOrMeta(event.nativeEvent)) {
        var actionEvent = _this.makeActionEvent(event.nativeEvent, delegation_1.Action.Click);
        _this.trigger(event.nativeEvent, actionEvent);
        if (actionEvent.type === delegation_1.ActionType.Node) {
          var node = _this.graph.getNode(actionEvent.target);
          onGraphClick && onGraphClick(delegation_1.ActionType.Node, node.exportJson());
        }
        if (actionEvent.type === delegation_1.ActionType.Link) {
          var link = _this.graph.getLink(actionEvent.target);
          onGraphClick && onGraphClick(delegation_1.ActionType.Link, link.exportJson());
        }
        if (actionEvent.type === delegation_1.ActionType.Port) {
          // TODO: add port action callback
        }
        if (actionEvent.type === delegation_1.ActionType.Blank) {
          onGraphClick && onGraphClick(delegation_1.ActionType.Blank, null);
        }
      }
    };
    // zoom in the graph
    _this.onGraphDoubleClick = function(event) {
      var actionEvent = _this.makeActionEvent(event.nativeEvent, delegation_1.Action.DoubleClick);
      _this.trigger(event.nativeEvent, actionEvent);
    };
    _this.onGraphMouseDown = function(event) {
      // 获取焦点用于捕获按键事件
      _this.viewer.current.focus();
      // in macOS, ctrl + click in chrome trigger contextmenu
      if (event.nativeEvent.ctrlKey || !dom.isLeftButton(event))
        return;
      // 已经在拖拽中时无法继续触发mousedown事件
      if (_this.inDragMode)
        return;
      var src = _this.findClosest(event.target, "[data-action-type]");
      if (dom.isLeftButton(event)) {
        dom.addClass(document.body, "editor-cursor-moving");
        dom.replaceClass(_this.viewer.current, "editor-cursor-move", "editor-cursor-moving");
      }
      _this.srcElement = src;
      var actionEvent = _this.makeActionEvent(event.nativeEvent, delegation_1.Action.MouseDown, src);
      _this.triggerMousedown(event, actionEvent);
    };
    _this.triggerMousedown = function(event, action) {
      event.preventDefault();
      _this.inDragMode = true;
      _this.mouseMoved = 0;
      // trigger mousemove and mouseup event
      if (_this.viewer.current) {
        dom.addEventListener(window, "mousemove", _this.onGraphMouseMove);
        dom.addEventListener(window, "mouseup", _this.onGraphMouseUp);
      }
      _this.trigger(event.nativeEvent, action, {
        wrapCoordSys: _this.wrapCoordSys,
        svgCoordSys: _this.svgCoordSys,
        gViewCoordSys: _this.gViewCoordSys,
      });
    };
    _this.onGraphMouseMove = function(event) {
      event.preventDefault();
      _this.mouseMoved += 1;
      var actionEvent = _this.makeActionEvent(event, delegation_1.Action.MouseMove, _this.srcElement);
      _this.trigger(event, actionEvent, {
        wrapCoordSys: _this.wrapCoordSys,
        svgCoordSys: _this.svgCoordSys,
        gViewCoordSys: _this.gViewCoordSys,
      });
    };
    _this.onGraphMouseUp = function(event) {
      _this.inDragMode = false;
      _this.setState({
        inDragMode: _this.inDragMode
      });
      var actionEvent = _this.makeActionEvent(event, delegation_1.Action.MouseUp, _this.srcElement);
      dom.replaceClass(_this.viewer.current, "editor-cursor-moving", "editor-cursor-move");
      _this.srcElement = null;
      dom.removeClass(document.body, "editor-cursor-moving");
      if (_this.viewer.current) {
        dom.removeEventListener(window, "mousemove", _this.onGraphMouseMove);
        dom.removeEventListener(window, "mouseup", _this.onGraphMouseUp);
      }
      _this.trigger(event, actionEvent, {
        wrapCoordSys: _this.wrapCoordSys,
        svgCoordSys: _this.svgCoordSys,
        gViewCoordSys: _this.gViewCoordSys,
      });
    };
    _this.onKeydownAction = function(topic, payload) {
      var readonly = _this.props.readonly;
      var _a = _this.props,
        onCopySelected = _a.onCopySelected,
        onRemoveSelected = _a.onRemoveSelected,
        onRedo = _a.onRedo,
        onUndo = _a.onUndo,
        onSave = _a.onSave,
        onSaveAs = _a.onSaveAs,
        onRun = _a.onRun,
        onRerun = _a.onRerun;
      var actionEvent = (0, lodash_1.get)(payload, "actionEvent");
      var subAction = actionEvent.subAction;
      if (actionEvent.subAction === delegation_1.Action.SaveAs) {
        event.preventDefault();
        var graphDataAs = _this.graph.exportJson();
        onSaveAs && onSaveAs(graphDataAs);
      }
      // 只读情况下，不响应除另存为之外的快捷键
      if (readonly)
        return;
      if (actionEvent.subAction === delegation_1.Action.Copy) {
        var selected = _this.graph.getNodesWith("selected", true);
        _this.graph.plugins.edit.copyNodes(selected);
        onCopySelected &&
          onCopySelected(selected.map(function(node) {
            return (0, lodash_1.cloneDeep)(node.data);
          }));
      }
      if (actionEvent.subAction === delegation_1.Action.Paste) {
        _this.graph.plugins.edit.pasteNodes();
        // TODO: 增加回调函数
      }
      if (actionEvent.subAction === delegation_1.Action.Delete) {
        var selected = _this.graph.getNodesWith("selected", true);
        _this.graph.plugins.edit.removeNodes(selected);
        onRemoveSelected &&
          onRemoveSelected(selected.map(function(node) {
            return (0, lodash_1.cloneDeep)(node.data);
          }));
      }
      if (actionEvent.subAction === delegation_1.Action.Redo) {
        _this.graph.plugins.edit.redo();
        onRedo && onRedo();
      }
      if (actionEvent.subAction === delegation_1.Action.Undo) {
        _this.graph.plugins.edit.undo();
        onUndo && onUndo();
      }
      if (actionEvent.subAction === delegation_1.Action.Save) {
        event.preventDefault();
        var graphData = _this.graph.exportJson();
        onSave && onSave(graphData);
      }
      if (actionEvent.subAction === delegation_1.Action.Run) {
        var graphData = _this.graph.exportJson();
        onRun && onRun(graphData);
      }
      if (actionEvent.subAction === delegation_1.Action.ReRun) {
        var graphData = _this.graph.exportJson();
        onRerun && onRerun(graphData);
      }
      _this.setState({
        loading: false
      });
    };
    _this.onGraphKeydown = function(event) {
      var nevt = event.nativeEvent;
      var action = delegation_1.Action.Null;
      var repeat = false;
      if (dom.isCopy(nevt)) {
        action = delegation_1.Action.Copy;
      }
      if (dom.isPaste(nevt)) {
        action = delegation_1.Action.Paste;
        // TODO: 增加回调函数
      }
      if (dom.isDelete(nevt)) {
        action = delegation_1.Action.Delete;
      }
      if (dom.isRedo(nevt)) {
        action = delegation_1.Action.Redo;
      }
      if (dom.isUndo(nevt)) {
        action = delegation_1.Action.Undo;
      }
      if (dom.isSave(nevt)) {
        action = delegation_1.Action.Save;
      }
      if (dom.isSaveAs(nevt)) {
        action = delegation_1.Action.SaveAs;
      }
      if (dom.isRun(nevt)) {
        action = delegation_1.Action.Run;
      }
      if (dom.isRerun(nevt)) {
        action = delegation_1.Action.ReRun;
      }
      if (dom.isSelectAll(nevt)) {
        action = delegation_1.Action.SelectAll;
      }
      if (action === delegation_1.Action.Null) {
        return;
      }
      var actionEvent = new delegation_1.ActionEvent(delegation_1.Action.Keydown, delegation_1.ActionType.Blank, "", {
        x: 0,
        y: 0,
      });
      actionEvent.addSubAction(action);
      repeat = dom.isKeyRepeat(nevt);
      _this.setState({
        loading: true
      });
      if (repeat) {
        _this.debounceTrigger(nevt, actionEvent);
      } else {
        _this.trigger(nevt, actionEvent);
      }
    };
    _this.onGraphKeyUp = function(event) {
      // console.log(event);
    };
    _this.onGraphWheel = function(event) {
      // console.log(event);
      var actionEvent = _this.makeActionEvent(event.nativeEvent, delegation_1.Action.Wheel);
      _this.trigger(event.nativeEvent, actionEvent);
    };
    _this.onGraphContextMenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      var actionEvent = _this.makeActionEvent(event.nativeEvent, delegation_1.Action.ContextMenu);
      _this.trigger(event.nativeEvent, actionEvent);
    };
    _this.onGraphScroll = function(event) {
      var wrapper = _this.viewer.current;
      _this.svgCoordSys.x = _this.wrapCoordSys.x - wrapper.scrollLeft;
      _this.svgCoordSys.y = _this.wrapCoordSys.y - wrapper.scrollTop;
    };
    _this.onContextMenuClick = function(target, actionType, action, subMenu) {
      if (actionType === delegation_1.ActionType.Link) {
        var onLinkRemoved = _this.props.onLinkRemoved;
        var link = null;
        switch (action) {
          case delegation_1.Action.Delete:
            link = _this.graph.getLink(target);
            _this.graph.removeLink(target);
            onLinkRemoved && onLinkRemoved(link.data);
            break;
        }
      }
      if (actionType === delegation_1.ActionType.Node) {
        var _a = _this.props,
          onNodeRename = _a.onNodeRename,
          onNodeCopy = _a.onNodeCopy,
          onNodeRemoved = _a.onNodeRemoved,
          onNodePreviewData = _a.onNodePreviewData,
          onNodePreviewResult = _a.onNodePreviewResult,
          onNodeResultExport = _a.onNodeResultExport,
          onNodePreviewLog = _a.onNodePreviewLog,
          onContextMenuAction = _a.onContextMenuAction,
          onRunFromNode = _a.onRunFromNode,
          onRunToNode = _a.onRunToNode;
        var node = _this.graph.getNode(target);
        var nodeData = (0, lodash_1.cloneDeep)(node.data);
        switch (action) {
          case delegation_1.Action.Rename:
            _this.viewer.current.blur();
            onNodeRename && onNodeRename(nodeData);
            onContextMenuAction && onContextMenuAction(delegation_1.Action.Rename, nodeData);
            break;
          case delegation_1.Action.Copy:
            _this.graph.plugins.edit.copyNodes([node]);
            onNodeCopy && onNodeCopy(nodeData);
            break;
          case delegation_1.Action.Delete:
            _this.graph.plugins.edit.removeNode(target);
            onNodeRemoved && onNodeRemoved(nodeData);
            break;
          case delegation_1.Action.Preview:
            _this.viewer.current.blur();
            onNodePreviewData && onNodePreviewData(nodeData);
            onContextMenuAction && onContextMenuAction(delegation_1.Action.Preview, nodeData);
            break;
          case delegation_1.Action.CreateModel:
            _this.viewer.current.blur();
            onContextMenuAction &&
              onContextMenuAction(delegation_1.Action.CreateModel, nodeData);
            break;
          case delegation_1.Action.ViewResult:
            _this.viewer.current.blur();
            onNodePreviewResult && onNodePreviewResult(nodeData);
            onContextMenuAction &&
              onContextMenuAction(delegation_1.Action.ViewResult, nodeData, subMenu);
            break;
          case delegation_1.Action.ViewLog:
            _this.viewer.current.blur();
            onNodePreviewLog && onNodePreviewLog(nodeData);
            onContextMenuAction && onContextMenuAction(delegation_1.Action.ViewLog, nodeData);
            break;
          case delegation_1.Action.ExportResult:
            onNodeResultExport && onNodeResultExport(nodeData, subMenu);
            onContextMenuAction &&
              onContextMenuAction(delegation_1.Action.ExportResult, nodeData, subMenu);
            break;
          case delegation_1.Action.RunFromNode:
            onRunFromNode && onRunFromNode(nodeData);
            onContextMenuAction &&
              onContextMenuAction(delegation_1.Action.RunFromNode, nodeData);
            break;
          case delegation_1.Action.RunToNode:
            onRunToNode && onRunToNode(nodeData);
            onContextMenuAction &&
              onContextMenuAction(delegation_1.Action.RunToNode, nodeData);
            break;
          default:
            break;
        }
      }
      if (actionType === delegation_1.ActionType.Blank) {
        var _b = _this.props,
          onCopySelected = _b.onCopySelected,
          onPasteSelected = _b.onPasteSelected,
          onUndo = _b.onUndo,
          onRedo = _b.onRedo,
          onSave = _b.onSave,
          onSaveAs = _b.onSaveAs,
          onRemoveSelected = _b.onRemoveSelected;
        var selected = [];
        var graphData = {
          nodes: [],
          links: [],
          id: "",
        };
        var graphDataAs = {
          nodes: [],
          links: [],
          id: "",
        };
        var toRemoved = [];
        switch (action) {
          case delegation_1.Action.Copy:
            selected = _this.graph.getNodesWith("selected", true);
            _this.graph.plugins.edit.copyNodes(selected);
            onCopySelected &&
              onCopySelected(selected.map(function(node) {
                return (0, lodash_1.cloneDeep)(node.data);
              }));
            break;
          case delegation_1.Action.Paste:
            _this.graph.plugins.edit.pasteNodes();
            break;
          case delegation_1.Action.Undo:
            _this.graph.plugins.edit.undo();
            onUndo && onUndo();
            break;
          case delegation_1.Action.Redo:
            _this.graph.plugins.edit.redo();
            onRedo && onRedo();
            break;
          case delegation_1.Action.Save:
            graphData = _this.graph.exportJson();
            onSave && onSave(graphData);
            break;
          case delegation_1.Action.SaveAs:
            graphDataAs = _this.graph.exportJson();
            onSaveAs && onSaveAs(graphDataAs);
            break;
          case delegation_1.Action.Delete:
            toRemoved = _this.graph.getNodesWith("selected", true);
            _this.graph.plugins.edit.removeNodes(toRemoved);
            onRemoveSelected &&
              onRemoveSelected(toRemoved.map(function(node) {
                return (0, lodash_1.cloneDeep)(node.data);
              }));
            break;
        }
      }
      _this.forceUpdate();
    };
    _this.graph = new graph_1.default();
    _this.graph.addPlugin("edit", new plugins_1.Edit(_this.graph));
    _this.debounceTrigger = (0, lodash_1.throttle)(_this.trigger, _this.throttleThreshold).bind(_this);
    _this._token = _this.graph.pubsub.subscribe([
      delegation_1.Action.Click.toString(),
      delegation_1.Action.MouseDown.toString(),
      delegation_1.Action.MouseMove.toString(),
      delegation_1.Action.MouseUp.toString(),
      delegation_1.Action.DoubleClick.toString(),
    ], _this.onAction);
    _this._keyToken = _this.graph.pubsub.subscribe(delegation_1.Action.Keydown.toString(), _this.onKeydownAction);
    _this.state = {
      loading: false,
      svgCoords: (0, lodash_1.cloneDeep)(_this.svgCoordSys),
      gViewCoords: (0, lodash_1.cloneDeep)(_this.gViewCoordSys),
      selectionArea: {
        x: 0,
        y: 0,
        x1: 0,
        y1: 0
      },
      inDragMode: false,
    };
    return _this;
  }
  GraphView.prototype.componentDidMount = function() {
    var data = this.props.data;
    // 载入图数据
    this.graph.loadData(data);
    // 设置g.view坐标系
    this.gViewCoordSys =
      this.graph.data.gViewCoords || this.gViewCoordSys;
    // 设置可见视图的坐标系
    if (this.viewer.current) {
      var editorRect = dom.getBoundingClientRect(this.viewer.current);
      this.assignBoxToCoord(editorRect, this.wrapCoordSys);
      // 设置svg 坐标系
      if (this.graph.data.svgCoords) {
        this.svgCoordSys = this.graph.data.svgCoords;
      } else {
        this.svgCoordSys.x =
          this.wrapCoordSys.x -
          Math.ceil((this.svgCoordSys.width - this.wrapCoordSys.width) / 2);
        this.svgCoordSys.y =
          this.wrapCoordSys.y -
          Math.ceil((this.svgCoordSys.height - this.wrapCoordSys.height) / 2);
      }
    }
    dom.scroll(this.viewer.current, {
      x: this.wrapCoordSys.x - this.svgCoordSys.x,
      y: this.wrapCoordSys.y - this.svgCoordSys.y,
    });
    dom.addEventListener(window, "resize", this.updateWrapCoordSys);
    this.setState({
      svgCoords: (0, lodash_1.cloneDeep)(this.svgCoordSys),
      gViewCoords: (0, lodash_1.cloneDeep)(this.gViewCoordSys),
    });
  };
  GraphView.prototype.componentDidUpdate = function() {
    this.updateWrapCoordSys();
  };
  GraphView.prototype.componentWillUnmount = function() {
    dom.removeEventListener(window, "resize", this.updateWrapCoordSys);
    this.graph.pubsub.unsubscribe(this._token);
    this.graph.pubsub.unsubscribe(this._keyToken);
    this.graph.reset();
  };
  GraphView.prototype.reachEdge = function(coord, nodeData) {
    var horizon = "";
    var vertical = "";
    // 达到边缘区域的触发条件，增加一个padding，在距离边缘为padding的时候就触发到达边缘
    var padding = 30;
    var _a = this.svgCoordSys,
      width = _a.width,
      height = _a.height;
    var _b = this.gViewCoordSys,
      scaleX = _b.scaleX,
      scaleY = _b.scaleY;
    // 左侧达到边缘区域
    if (coord.x < padding)
      horizon = "left";
    if (coord.y < padding)
      vertical = "top";
    if (coord.x + padding + nodeData.width * scaleX >= width)
      horizon = "right";
    if (coord.y + padding + nodeData.height * scaleY >= height)
      vertical = "bottom";
    if (horizon && vertical) {
      return "".concat(horizon, "-").concat(vertical);
    }
    if (horizon || vertical) {
      return (horizon || vertical);
    }
    return "in";
  };
  // 获取BoundingClientRect并赋值给坐标系统
  GraphView.prototype.assignBoxToCoord = function(rect, coord) {
    coord.x = rect.x;
    coord.y = rect.y;
    coord.width = rect.width;
    coord.height = rect.height;
    return coord;
  };
  GraphView.prototype.scale = function(step) {
    if (step === void 0) {
      step = 0;
    }
    var onGraphZoom = this.props.onGraphZoom;
    if (!this.graph.nodes.length)
      return 1;
    var scaleX = this.gViewCoordSys.scaleX || 1;
    var scaleY = this.gViewCoordSys.scaleY || 1;
    var zoom = Math.max(this.zoomRange[0], Math.min(this.zoomRange[1], scaleX + step));
    this.gViewCoordSys.scaleX = zoom;
    this.gViewCoordSys.scaleY = zoom;
    var svgWidth = this.svgCoordSys.width;
    var svgHeight = this.svgCoordSys.height;
    if (zoom > 1) {
      svgWidth = Math.ceil((this.svgCoordSys.width / scaleX) * zoom);
      svgHeight = Math.ceil((this.svgCoordSys.height / scaleY) * zoom);
    }
    // 在缩放的时候对位移进行处理，避免节点溢出
    var scaleXDiff = zoom / scaleX;
    var scaleYDiff = zoom / scaleY;
    var _a = (0, coord_sys_1.convert)(this.wrapCoordSys, this.svgCoordSys, {
        x: this.wrapCoordSys.width / 2,
        y: this.wrapCoordSys.height / 2,
      }),
      centerX = _a.x,
      centerY = _a.y;
    this.gViewCoordSys.x =
      scaleXDiff * this.gViewCoordSys.x - scaleXDiff * centerX + centerX;
    this.gViewCoordSys.y =
      scaleYDiff * this.gViewCoordSys.y - scaleYDiff * centerY + centerY;
    this.setState({
      svgCoords: __assign(__assign({}, this.svgCoordSys), {
        width: svgWidth,
        height: svgHeight
      }),
      gViewCoords: {
        x: this.gViewCoordSys.x,
        y: this.gViewCoordSys.y,
        scaleX: zoom,
        scaleY: zoom,
      },
    });
    onGraphZoom && onGraphZoom(zoom);
    return zoom;
  };
  GraphView.prototype.selectNodesInArea = function(area) {
    var leftX = Math.min(area.x, area.x1);
    var leftY = Math.min(area.y, area.y1);
    var rightX = Math.max(area.x, area.x1);
    var rightY = Math.max(area.y, area.y1);
    var _a = (0, coord_sys_1.convert)(this.gViewCoordSys, {
        x: 0,
        y: 0
      }, {
        x: leftX,
        y: leftY
      }, true),
      x = _a.x,
      y = _a.y;
    var _b = (0, coord_sys_1.convert)(this.gViewCoordSys, {
        x: 0,
        y: 0
      }, {
        x: rightX,
        y: rightY
      }, true),
      x1 = _b.x,
      y1 = _b.y;
    var detectInArea = function(node, area) {
      var leftCorner = area.x <= node.coordinate.x && area.y <= node.coordinate.y;
      var rightCorner = area.x1 >= node.coordinate.x + node.data.width &&
        area.y1 >= node.coordinate.y + node.data.height;
      return leftCorner && rightCorner;
    };
    this.graph.nodes.map(function(node) {
      if (detectInArea(node, {
          x: x,
          y: y,
          x1: x1,
          y1: y1
        })) {
        node.setProp("selected", true);
      } else {
        node.setProp("selected", false);
      }
    });
  };
  GraphView.prototype.makeFakeNode = function(node, target) {
    var nodeData = __assign({}, node.data);
    var tmpPorts = nodeData.inPorts;
    nodeData.inPorts = nodeData.outPorts;
    nodeData.outPorts = tmpPorts;
    var fakeNode = node_1.default.fromData(nodeData);
    fakeNode.id = "fake";
    if (node.hasOutPort(target)) {
      fakeNode.positionY += fakeNode.data.height;
    }
    if (node.hasInPort(target)) {
      fakeNode.positionY -= fakeNode.data.height;
    }
    return fakeNode;
  };
  GraphView.prototype.makeLink = function(node, target, fakeNode) {
    var sourceNodeId = "";
    var targetNodeId = "";
    if (node.hasOutPort(target)) {
      sourceNodeId = node.id;
      targetNodeId = fakeNode.id;
    }
    if (node.hasInPort(target)) {
      sourceNodeId = fakeNode.id;
      targetNodeId = node.id;
    }
    return new link_1.default(sourceNodeId, targetNodeId, target, target);
  };
  GraphView.prototype.renderBackground = function() {
    var _a = this.props,
      gridSize = _a.gridSize,
      backgroundFill = _a.backgroundFill,
      renderBackground = _a.renderBackground;
    if (renderBackground) {
      return renderBackground(gridSize);
    } else {
      return React.createElement(background_1.default, {
        fill: backgroundFill
      });
    }
  };
  GraphView.prototype.findClosest = function(el, selector) {
    return el.closest(selector);
  };
  GraphView.prototype.makeActionEvent = function(event, action, src) {
    if (src === undefined) {
      src = this.findClosest(event.target, "[data-action-type]");
    }
    var target = {
      actionType: delegation_1.ActionType.Blank,
      id: ""
    };
    if (src) {
      target = __assign({}, src.dataset);
    }
    var actionType = target.actionType;
    var dataId = target.id;
    var coordinate = {
      x: event.clientX,
      y: event.clientY,
    };
    return new delegation_1.ActionEvent(action, actionType, dataId, coordinate);
  };
  GraphView.prototype.trigger = function(event, actionEvent, options) {
    this.graph.pubsub.publish(actionEvent.action.toString(), {
      event: event,
      actionEvent: actionEvent,
      options: options,
    });
  };
  GraphView.prototype.render = function() {
    var _this = this;
    var _a = this.props,
      edgeArrowSize = _a.edgeArrowSize,
      gridSpacing = _a.gridSpacing,
      gridDotSize = _a.gridDotSize,
      renderDefs = _a.renderDefs,
      readonly = _a.readonly,
      inSelectionMode = _a.inSelectionMode;
    var _b = this.state,
      svgCoords = _b.svgCoords,
      gViewCoords = _b.gViewCoords,
      selectionArea = _b.selectionArea,
      inDragMode = _b.inDragMode;
    var width = svgCoords.width,
      height = svgCoords.height;
    var x = gViewCoords.x,
      y = gViewCoords.y,
      scaleX = gViewCoords.scaleX,
      scaleY = gViewCoords.scaleY;
    var editorClass = (0, classnames_1.default)({
      "editor-wrap": true,
      "editor-cursor-move": true,
      "editor-selecting": inSelectionMode,
    });
    return (React.createElement(context_1.default.Provider, {
        value: {
          theme: "light",
          updateTheme: function(theme) {
            return (0, theme_1.updateTheme)(theme);
          },
        }
      },
      React.createElement("div", {
          ref: this.viewer,
          "data-id": this.graph.id,
          tabIndex: 0,
          className: editorClass,
          onClick: this.onGraphClick,
          onDoubleClick: this.onGraphDoubleClick,
          onMouseDown: this.onGraphMouseDown,
          onKeyDown: this.onGraphKeydown,
          onContextMenu: this.onGraphContextMenu,
          onScroll: this.onGraphScroll
        },
        React.createElement("div", {
            className: "editor-scroll",
            style: {
              width: width,
              height: height
            },
            ref: this.scrollPane
          },
          React.createElement("div", {
              className: "editor-stage",
              style: {
                width: width,
                height: height
              }
            },
            React.createElement("svg", {
                className: "editor-svg",
                width: width,
                height: height
              },
              React.createElement(defs_1.default, {
                edgeArrowSize: edgeArrowSize,
                gridSpacing: gridSpacing,
                gridDotSize: gridDotSize,
                renderDefs: renderDefs
              }),
              React.createElement("g", {
                className: "background"
              }, this.renderBackground()),
              React.createElement("g", {
                  className: "view",
                  transform: "matrix(".concat(scaleX, " 0 0 ").concat(scaleY, " ").concat(x, " ").concat(y, ")")
                },
                React.createElement("g", {
                    className: "links-group"
                  },
                  React.createElement("g", {
                    className: "link-container"
                  }, this.graph.links.map(function(link) {
                    return (React.createElement(link_2.default, {
                      link: link,
                      key: link.id,
                      graph: _this.graph
                    }));
                  }))),
                React.createElement("g", {
                  className: "node-group"
                }, this.graph.nodes.map(function(node) {
                  return (React.createElement(node_2.default, {
                    node: node,
                    key: node.id,
                    graph: _this.graph,
                    inDragMode: inDragMode
                  }));
                }))),
              React.createElement("g", {
                  className: "node-selection-area"
                },
                React.createElement(selection_1.default, {
                  area: selectionArea,
                  visible: inSelectionMode,
                  ref: this.selectionRef
                }))))),
        React.createElement(contextmenu_1.ContextMenu, {
          graph: this.graph,
          readonly: readonly,
          onItemClick: this.onContextMenuClick
        }))));
  };
  GraphView.defaultProps = {
    edgeArrowSize: 8,
    gridSpacing: 30,
    zoomRange: [0.1, 2],
    readonly: false,
    showGraphControl: true,
    zoomAnimation: true,
    isOver: false,
    canDrop: true,
    data: {
      nodes: [],
      links: [],
      id: "",
    },
  };
  return GraphView;
}(React.Component));
exports.default = GraphView;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9ncmFwaC50c3guanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9ncmFwaC50c3g/MDJhNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyB0aHJvdHRsZSwgY2xvbmVEZWVwLCBnZXQgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgR3JhcGhDb250ZXh0IGZyb20gXCJAL2NvbW1vbi9jb250ZXh0XCI7XG5pbXBvcnQgR3JhcGgsIHsgR3JhcGhKc29uIH0gZnJvbSBcIkAvY29yZS9ncmFwaFwiO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZSB9IGZyb20gXCJAL2NvcmUvaW50ZXJmYWNlXCI7XG5pbXBvcnQgTGluaywgeyBMaW5rRGF0YSB9IGZyb20gXCJAL2NvcmUvbGlua1wiO1xuaW1wb3J0IE5vZGUsIHsgTm9kZURhdGEsIE5vZGVVcGRhdGUgfSBmcm9tIFwiQC9jb3JlL25vZGVcIjtcbmltcG9ydCBQb3J0LCB7IFBvcnREaXJlY3Rpb24sIFBvcnREYXRhIH0gZnJvbSBcIkAvY29yZS9wb3J0XCI7XG5pbXBvcnQgeyB1cGRhdGVUaGVtZSB9IGZyb20gXCJAL2NvbW1vbi90aGVtZVwiO1xuaW1wb3J0IHsgRWRpdCB9IGZyb20gXCJAL3BsdWdpbnNcIjtcbmltcG9ydCB7IENvb3JkU3lzdGVtLCBjb252ZXJ0LCBSZWN0QXJlYSB9IGZyb20gXCJAL3V0aWxzL2Nvb3JkLXN5c1wiO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gXCJAL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgY2FuUG9ydENvbm5lY3QgfSBmcm9tIFwiQC91dGlscy9vdGhlcnNcIjtcbmltcG9ydCB7IEFjdGlvbkV2ZW50LCBBY3Rpb24sIEFjdGlvblR5cGUsIEVkZ2UgfSBmcm9tIFwiLi9kZWxlZ2F0aW9uXCI7XG5pbXBvcnQgRGVmcyBmcm9tIFwiLi9kZWZzXCI7XG5pbXBvcnQgQmFja2dyb3VuZCBmcm9tIFwiLi9iYWNrZ3JvdW5kXCI7XG5pbXBvcnQgTm9kZVZpZXcgZnJvbSBcIi4vbm9kZVwiO1xuaW1wb3J0IExpbmtWaWV3IGZyb20gXCIuL2xpbmtcIjtcbmltcG9ydCB7IENvbnRleHRNZW51IH0gZnJvbSBcIi4vY29udGV4dG1lbnVcIjtcbmltcG9ydCBTZWxlY3Rpb25BcmVhIGZyb20gXCIuL3NlbGVjdGlvblwiO1xuaW1wb3J0IFwiQC9zdHlsZXMvbWFpbi5zY3NzXCI7XG5cbi8qXG4gKiDlrp7pqoznvJbovpHlmajkuK3lhbHmtonlj4rlpoLkuIvlh6Dnp43lnZDmoIfns7vnu5/vvJpcbiAqIOa1j+iniOWZqOm7mOiupOeahOWdkOagh+ezu+e7n++8jOWni+S6jua1j+iniOWZqOW3puS4iuinkigwLCAwKVxuICogZGl2LmVkaXRvci13cmFwIOWdkOagh+ezu+e7n++8jOWunumqjOeahOWPr+inhuWMuuWfn++8jOi2heWHuumDqOWIhua7muWKqOWkhOeQhlxuICogZGl2LmVkaXRvci1zY3JvbGwg5Z2Q5qCH57O757uf77yM5a6e6aqM55qE55yf5a6e5Yy65Z+f5aSn5bCP77yM6buY6K6k5Li65LiK6Z2i5Z2Q5qCH57O757uf55qEMuWAjVxuICogc3ZnIOWdkOagh+ezu+e7n++8jGRpdi5lZGl0b3Itc2Nyb2xs55u45ZCMXG4gKiBzdmcg5LitIGcudmlldyDlnZDmoIfns7vnu5/vvIzov5nkuKrmmK/nm7jlr7nkuo5zdmflnZDmoIfns7vnu5/nmoTlnZDmoIfns7vnu5/vvIzkuI7lhbbku5blnZDmoIfns7vnu5/kuYvpl7TnmoTlj5jmjaLlv4XpobvpgJrov4dzdmflnZDmoIfns7vnu59cbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEdyYXBoUHJvcHMge1xuICBkYXRhOiBHcmFwaEpzb247XG4gIGJhY2tncm91bmRGaWxsPzogc3RyaW5nO1xuICBlZGdlQXJyb3dTaXplPzogbnVtYmVyO1xuICBncmlkRG90U2l6ZT86IG51bWJlcjtcbiAgZ3JpZFNpemU/OiBudW1iZXI7XG4gIGdyaWRTcGFjaW5nPzogbnVtYmVyO1xuICB6b29tUmFuZ2U6IEFycmF5PG51bWJlcj47XG4gIHpvb21BbmltYXRpb24/OiBib29sZWFuO1xuICByZWFkb25seT86IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzZWxlY3RlZD86IEFycmF5PGFueT47XG4gIHNob3dHcmFwaENvbnRyb2w/OiBib29sZWFuO1xuICBpblNlbGVjdGlvbk1vZGU/OiBib29sZWFuO1xuICAvLyBsaW5rIGNhbGJhY2sgZnVuY3Rpb25zXG4gIG9uTGlua1JlbW92ZWQ/OiAoc2VsZWN0ZWQ6IExpbmtEYXRhKSA9PiB2b2lkO1xuICBvbkxpbmtTZWxlY3RlZD86IChzZWxlY3RlZDogTGluaykgPT4gdm9pZDtcbiAgb25MaW5rQ29ubmVjdGVkPzogKHNlbGVjdGVkOiBMaW5rRGF0YSkgPT4gdm9pZDtcbiAgLy8gbm9kZSBjYWxsYmFjayBmdW5jdGlvbnNcbiAgb25Ob2RlQ2xpY2s/OiAoc2VsZWN0ZWQ6IE5vZGVEYXRhKSA9PiB2b2lkO1xuICBvbk5vZGVSZW5hbWU/OiAoc2VsZWN0ZWQ6IE5vZGVEYXRhKSA9PiB2b2lkO1xuICBvbk5vZGVDb3B5PzogKHNlbGVjdGVkOiBOb2RlRGF0YSB8IE5vZGVEYXRhW10pID0+IHZvaWQ7XG4gIG9uTm9kZUNyZWF0ZWQ/OiAoc2VsZWN0ZWQ6IE5vZGVEYXRhKSA9PiB2b2lkO1xuICBvbk5vZGVSZW1vdmVkPzogKHNlbGVjdGVkOiBOb2RlRGF0YSkgPT4gdm9pZDtcbiAgb25Ob2RlUHJldmlld0RhdGE/OiAoc2VsZWN0ZWQ6IE5vZGVEYXRhKSA9PiB2b2lkO1xuICBvbk5vZGVQcmV2aWV3TG9nPzogKHNlbGVjdGVkOiBOb2RlRGF0YSkgPT4gdm9pZDtcbiAgb25Ob2RlUHJldmlld1Jlc3VsdD86IChzZWxlY3RlZDogTm9kZURhdGEpID0+IHZvaWQ7XG4gIG9uTm9kZVJlc3VsdEV4cG9ydD86IChzZWxlY3RlZDogTm9kZURhdGEsIG9yZGVyOiBudW1iZXIpID0+IHZvaWQ7XG4gIG9uUnVuRnJvbU5vZGU/OiAoc2VsZWN0ZWQ6IE5vZGVEYXRhKSA9PiB2b2lkO1xuICBvblJ1blRvTm9kZT86IChzZWxlY3RlZDogTm9kZURhdGEpID0+IHZvaWQ7XG4gIC8vIGdyYXBoIGNhbGxiYWNrIGZ1bmN0aW9uc1xuICBvbkNvcHlTZWxlY3RlZD86IChub2RlczogTm9kZURhdGFbXSkgPT4gdm9pZDtcbiAgb25QYXN0ZVNlbGVjdGVkPzogKG5vZGVzOiBOb2RlRGF0YVtdKSA9PiB2b2lkO1xuICBvblJlbW92ZVNlbGVjdGVkPzogKG5vZGVzOiBOb2RlRGF0YVtdKSA9PiB2b2lkO1xuICBvblVuZG8/OiAoKSA9PiB2b2lkO1xuICBvblJlZG8/OiAoKSA9PiB2b2lkO1xuICBvblJ1bj86IChncmFwaERhdGE6IEdyYXBoSnNvbikgPT4gdm9pZDtcbiAgb25SZXJ1bj86IChncmFwaERhdGE6IEdyYXBoSnNvbikgPT4gdm9pZDtcbiAgb25TYXZlPzogKGdyYXBoRGF0YTogR3JhcGhKc29uKSA9PiB2b2lkO1xuICBvblNhdmVBcz86IChncmFwaERhdGE6IEdyYXBoSnNvbikgPT4gdm9pZDtcbiAgb25TZWxlY3ROb2RlPzogKG5vZGU6IE5vZGUsIGV2ZW50OiBhbnkpID0+IHZvaWQ7XG4gIG9uU2VsZWN0Tm9kZXM/OiAobm9kZXM6IEFycmF5PE5vZGU+LCBldmVudDogYW55KSA9PiB2b2lkO1xuICBvbkJhY2tncm91bmRDbGljaz86ICh4OiBudW1iZXIsIHk6IG51bWJlciwgZXZlbnQ6IGFueSkgPT4gdm9pZDtcbiAgb25Db250ZXh0TWVudUFjdGlvbj86IChcbiAgICBhY3Rpb246IEFjdGlvbixcbiAgICBub2RlRGF0YTogTm9kZURhdGEsXG4gICAgc3ViTWVudT86IG51bWJlclxuICApID0+IHZvaWQ7XG4gIG9uR3JhcGhDbGljaz86IChcbiAgICBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLFxuICAgIGRhdGE6IFBvcnREYXRhIHwgTm9kZURhdGEgfCBMaW5rRGF0YSB8IG51bGxcbiAgKSA9PiB2b2lkO1xuICBvbkdyYXBoWm9vbT86ICh6b29tOiBudW1iZXIpID0+IHZvaWQ7XG5cbiAgLy8gY29tbW9uIGNhbGxiYWNrIGZ1bmN0aW9uc1xuICByZW5kZXJCYWNrZ3JvdW5kPzogKGdyaWRTaXplPzogbnVtYmVyKSA9PiBhbnk7XG4gIHJlbmRlckRlZnM/OiAoKSA9PiBhbnk7XG4gIHJlbmRlck5vZGU/OiAobm9kZTogTm9kZSkgPT4gUmVhY3QuUmVhY3ROb2RlO1xufVxuXG5pbnRlcmZhY2UgR3JhcGhTdGF0ZSB7XG4gIGxvYWRpbmc6IGJvb2xlYW47XG4gIHN2Z0Nvb3JkczogQ29vcmRTeXN0ZW07XG4gIGdWaWV3Q29vcmRzOiBDb29yZFN5c3RlbTtcbiAgc2VsZWN0aW9uQXJlYTogUmVjdEFyZWE7XG4gIGluRHJhZ01vZGU6IGJvb2xlYW47XG59XG5cbmNsYXNzIEdyYXBoVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxHcmFwaFByb3BzLCBHcmFwaFN0YXRlPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZWRnZUFycm93U2l6ZTogOCxcbiAgICBncmlkU3BhY2luZzogMzAsXG4gICAgem9vbVJhbmdlOiBbMC4xLCAyXSxcbiAgICByZWFkb25seTogZmFsc2UsXG4gICAgc2hvd0dyYXBoQ29udHJvbDogdHJ1ZSxcbiAgICB6b29tQW5pbWF0aW9uOiB0cnVlLFxuICAgIGlzT3ZlcjogZmFsc2UsXG4gICAgY2FuRHJvcDogdHJ1ZSxcbiAgICBkYXRhOiB7XG4gICAgICBub2RlczogW10gYXMgTm9kZURhdGFbXSxcbiAgICAgIGxpbmtzOiBbXSBhcyBMaW5rRGF0YVtdLFxuICAgICAgaWQ6IFwiXCIsXG4gICAgfSxcbiAgfTtcbiAgc3RhdGU6IEdyYXBoU3RhdGU7XG4gIGdyYXBoOiBHcmFwaDtcbiAgY2FudmFzOiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyOyBwYWRkaW5nOiBzdHJpbmcgfSA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgcGFkZGluZzogXCJcIixcbiAgfTtcbiAgcHJpdmF0ZSB0aHJvdHRsZVRocmVzaG9sZCA9IDEwMDA7XG4gIHByaXZhdGUgZGVib3VuY2VUcmlnZ2VyOiBhbnk7XG4gIHByaXZhdGUgdmlld2VyOiBSZWFjdC5SZWZPYmplY3Q8SFRNTERpdkVsZW1lbnQ+ID0gUmVhY3QuY3JlYXRlUmVmKCk7XG4gIHByaXZhdGUgc2Nyb2xsUGFuZTogUmVhY3QuUmVmT2JqZWN0PEhUTUxEaXZFbGVtZW50PiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xuICBwcml2YXRlIHNlbGVjdGlvblJlZjogUmVhY3QuUmVmT2JqZWN0PFNWR1NWR0VsZW1lbnQ+ID0gUmVhY3QuY3JlYXRlUmVmKCk7XG4gIHByaXZhdGUgc3JjRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xuICBwcml2YXRlIG1vdXNlTW92ZWQgPSAwO1xuICAvLyDkv67lpI3lv6vpgJ/ngrnlh7vlubbnp7vlh7roioLngrnlr7zoh7TnmoTml6Dms5Xlj5bmtojpgInkuK3nmoTpl67pophcbiAgcHJpdmF0ZSBtb3VzZU1vdmVUaHJlaG9sZCA9IDE7XG4gIHByaXZhdGUgc2Nyb2xsVG9wID0gMDtcbiAgcHJpdmF0ZSBzY3JvbGxMZWZ0ID0gMDtcbiAgcHJpdmF0ZSBwb2ludGVyWCA9IDA7XG4gIHByaXZhdGUgcG9pbnRlclkgPSAwO1xuICBwcml2YXRlIHpvb21SYW5nZTogbnVtYmVyW10gPSBbMC4yLCAyXTtcbiAgcHJpdmF0ZSB6b29tU3RlcCA9IDAuMTtcbiAgLy8g6K6+572u5qCH5b+X5L2N77yM6Kej5Yaz5LiA5Liq6K+h5byC55qEY2hyb21l6Zeu6aKY77yM5ouW5ou956e75Ye657uY5Zu+5Yy65Z+f77yM54S25ZCO5b+r6YCf5Y+z6ZSu77yM5YaN54K55Ye75Y+W5raIY29udGV4dG1lbnXvvIxcbiAgLy8g5q2k5pe255So5oi35bey57uP5LiN6ZyA6KaB5oyJ552A6byg5qCH5LqG77yM6L+e57q/5Lya6Ieq5Yqo6Lef6ZqP77yM5Zyo5Zu+5Lit54K55Ye75LmL5ZCO77yM5Lya5YaN5LiA5qyh6Kem5Y+RbW91c2Vkb3du5LqL5Lu277yM6L+Z5bCxXG4gIC8vIOebuOW9k+S6juinpuWPkeS6huS4pOasoeeahG1vdXNlZG93buS6i+S7tu+8jOS4uuS6huino+WGs+i/meS4qumXrumimO+8jOWinuWKoOagh+W/l+S9je+8jOihqOekuuaYr+WQpuWcqOaLluaLveaooeW8j+S4re+8jOWmguaenOWcqOS6hu+8jFxuICAvLyDkuI3lk43lupRtb3VzZWRvd27kuovku7bvvIzlj6rlk43lupRtb3VzZXVw5LqL5Lu277yM6YG/5YWN6L+e57q/YnVn5ZKM5YaF5a2Y5rOE6ZyyXG4gIHByaXZhdGUgaW5EcmFnTW9kZSA9IGZhbHNlO1xuICBwcml2YXRlIHdyYXBDb29yZFN5czogQ29vcmRTeXN0ZW0gPSB7XG4gICAgeDogMCxcbiAgICB5OiAwLFxuICB9O1xuICBwcml2YXRlIHN2Z0Nvb3JkU3lzOiBDb29yZFN5c3RlbSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgd2lkdGg6IDIgKiBkb20uc2NyZWVuKCkud2lkdGgsXG4gICAgaGVpZ2h0OiAyICogZG9tLnNjcmVlbigpLmhlaWdodCxcbiAgfTtcbiAgcHJpdmF0ZSBnVmlld0Nvb3JkU3lzOiBDb29yZFN5c3RlbSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gICAgc2NhbGVYOiAxLFxuICAgIHNjYWxlWTogMSxcbiAgfTtcbiAgcHJpdmF0ZSBwcmVMaW5rOiBMaW5rO1xuICBfdG9rZW46IHN0cmluZztcbiAgX2tleVRva2VuOiBzdHJpbmc7XG4gIC8vIOaYr+WQpuWcqOahhumAieaooeW8j+S4i1xuICBwcml2YXRlIHNlbGVjdGlvbkFyZWE6IFJlY3RBcmVhID0ge1xuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgICB4MTogMCxcbiAgICB5MTogMCxcbiAgfTtcbiAgY29uc3RydWN0b3IocHJvcHM6IEdyYXBoUHJvcHMsIHN0YXRlOiBHcmFwaFN0YXRlKSB7XG4gICAgc3VwZXIocHJvcHMsIHN0YXRlKTtcbiAgICB0aGlzLmdyYXBoID0gbmV3IEdyYXBoKCk7XG4gICAgdGhpcy5ncmFwaC5hZGRQbHVnaW4oXCJlZGl0XCIsIG5ldyBFZGl0KHRoaXMuZ3JhcGgpKTtcbiAgICB0aGlzLmRlYm91bmNlVHJpZ2dlciA9IHRocm90dGxlKHRoaXMudHJpZ2dlciwgdGhpcy50aHJvdHRsZVRocmVzaG9sZCkuYmluZChcbiAgICAgIHRoaXNcbiAgICApO1xuICAgIHRoaXMuX3Rva2VuID0gdGhpcy5ncmFwaC5wdWJzdWIuc3Vic2NyaWJlKFxuICAgICAgW1xuICAgICAgICBBY3Rpb24uQ2xpY2sudG9TdHJpbmcoKSxcbiAgICAgICAgQWN0aW9uLk1vdXNlRG93bi50b1N0cmluZygpLFxuICAgICAgICBBY3Rpb24uTW91c2VNb3ZlLnRvU3RyaW5nKCksXG4gICAgICAgIEFjdGlvbi5Nb3VzZVVwLnRvU3RyaW5nKCksXG4gICAgICAgIEFjdGlvbi5Eb3VibGVDbGljay50b1N0cmluZygpLFxuICAgICAgXSxcbiAgICAgIHRoaXMub25BY3Rpb25cbiAgICApO1xuICAgIHRoaXMuX2tleVRva2VuID0gdGhpcy5ncmFwaC5wdWJzdWIuc3Vic2NyaWJlKFxuICAgICAgQWN0aW9uLktleWRvd24udG9TdHJpbmcoKSxcbiAgICAgIHRoaXMub25LZXlkb3duQWN0aW9uXG4gICAgKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICBzdmdDb29yZHM6IGNsb25lRGVlcCh0aGlzLnN2Z0Nvb3JkU3lzKSxcbiAgICAgIGdWaWV3Q29vcmRzOiBjbG9uZURlZXAodGhpcy5nVmlld0Nvb3JkU3lzKSxcbiAgICAgIHNlbGVjdGlvbkFyZWE6IHsgeDogMCwgeTogMCwgeDE6IDAsIHkxOiAwIH0sXG4gICAgICBpbkRyYWdNb2RlOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzLnByb3BzO1xuICAgIC8vIOi9veWFpeWbvuaVsOaNrlxuICAgIHRoaXMuZ3JhcGgubG9hZERhdGEoZGF0YSk7XG4gICAgLy8g6K6+572uZy52aWV35Z2Q5qCH57O7XG4gICAgdGhpcy5nVmlld0Nvb3JkU3lzID1cbiAgICAgICh0aGlzLmdyYXBoLmRhdGEuZ1ZpZXdDb29yZHMgYXMgQ29vcmRTeXN0ZW0pIHx8IHRoaXMuZ1ZpZXdDb29yZFN5cztcbiAgICAvLyDorr7nva7lj6/op4Hop4blm77nmoTlnZDmoIfns7tcbiAgICBpZiAodGhpcy52aWV3ZXIuY3VycmVudCkge1xuICAgICAgY29uc3QgZWRpdG9yUmVjdDogRE9NUmVjdCA9IGRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoXG4gICAgICAgIHRoaXMudmlld2VyLmN1cnJlbnRcbiAgICAgICk7XG4gICAgICB0aGlzLmFzc2lnbkJveFRvQ29vcmQoZWRpdG9yUmVjdCwgdGhpcy53cmFwQ29vcmRTeXMpO1xuICAgICAgLy8g6K6+572uc3ZnIOWdkOagh+ezu1xuICAgICAgaWYgKHRoaXMuZ3JhcGguZGF0YS5zdmdDb29yZHMpIHtcbiAgICAgICAgdGhpcy5zdmdDb29yZFN5cyA9IHRoaXMuZ3JhcGguZGF0YS5zdmdDb29yZHMgYXMgQ29vcmRTeXN0ZW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN2Z0Nvb3JkU3lzLnggPVxuICAgICAgICAgIHRoaXMud3JhcENvb3JkU3lzLnggLVxuICAgICAgICAgIE1hdGguY2VpbCgodGhpcy5zdmdDb29yZFN5cy53aWR0aCAtIHRoaXMud3JhcENvb3JkU3lzLndpZHRoKSAvIDIpO1xuICAgICAgICB0aGlzLnN2Z0Nvb3JkU3lzLnkgPVxuICAgICAgICAgIHRoaXMud3JhcENvb3JkU3lzLnkgLVxuICAgICAgICAgIE1hdGguY2VpbCgodGhpcy5zdmdDb29yZFN5cy5oZWlnaHQgLSB0aGlzLndyYXBDb29yZFN5cy5oZWlnaHQpIC8gMik7XG4gICAgICB9XG4gICAgfVxuICAgIGRvbS5zY3JvbGwodGhpcy52aWV3ZXIuY3VycmVudCwge1xuICAgICAgeDogdGhpcy53cmFwQ29vcmRTeXMueCAtIHRoaXMuc3ZnQ29vcmRTeXMueCxcbiAgICAgIHk6IHRoaXMud3JhcENvb3JkU3lzLnkgLSB0aGlzLnN2Z0Nvb3JkU3lzLnksXG4gICAgfSk7XG4gICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCBcInJlc2l6ZVwiLCB0aGlzLnVwZGF0ZVdyYXBDb29yZFN5cyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdmdDb29yZHM6IGNsb25lRGVlcCh0aGlzLnN2Z0Nvb3JkU3lzKSxcbiAgICAgIGdWaWV3Q29vcmRzOiBjbG9uZURlZXAodGhpcy5nVmlld0Nvb3JkU3lzKSxcbiAgICB9KTtcbiAgfVxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVXcmFwQ29vcmRTeXMoKTtcbiAgfVxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csIFwicmVzaXplXCIsIHRoaXMudXBkYXRlV3JhcENvb3JkU3lzKTtcbiAgICB0aGlzLmdyYXBoLnB1YnN1Yi51bnN1YnNjcmliZSh0aGlzLl90b2tlbik7XG4gICAgdGhpcy5ncmFwaC5wdWJzdWIudW5zdWJzY3JpYmUodGhpcy5fa2V5VG9rZW4pO1xuICAgIHRoaXMuZ3JhcGgucmVzZXQoKTtcbiAgfVxuICB1cGRhdGVXcmFwQ29vcmRTeXMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMudmlld2VyLmN1cnJlbnQpIHtcbiAgICAgIGNvbnN0IGVkaXRvclJlY3Q6IERPTVJlY3QgPSBkb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KFxuICAgICAgICB0aGlzLnZpZXdlci5jdXJyZW50XG4gICAgICApO1xuICAgICAgdGhpcy5hc3NpZ25Cb3hUb0Nvb3JkKGVkaXRvclJlY3QsIHRoaXMud3JhcENvb3JkU3lzKTtcbiAgICB9XG4gIH07XG4gIC8vIOa3u+WKoOiKgueCuVxuICBhZGROb2RlV2l0aERhdGEgPSAoZGF0YTogTm9kZURhdGEpID0+IHtcbiAgICBjb25zdCBub2RlOiBOb2RlID0gTm9kZS5mcm9tRGF0YShkYXRhKTtcbiAgICBub2RlLmNvb3JkaW5hdGUgPSBjb252ZXJ0KFxuICAgICAgeyB4OiAwLCB5OiAwIH0sXG4gICAgICB0aGlzLnN2Z0Nvb3JkU3lzLFxuICAgICAgbm9kZS5jb29yZGluYXRlXG4gICAgKSBhcyBDb29yZGluYXRlO1xuICAgIGNvbnN0IGNvb3JkOiBDb29yZGluYXRlID0gbm9kZS5jb29yZGluYXRlO1xuICAgIGNvbnN0IHBvczogRWRnZSA9IHRoaXMucmVhY2hFZGdlKGNvb3JkLCB7XG4gICAgICB3aWR0aDogbm9kZS5kYXRhLndpZHRoLFxuICAgICAgaGVpZ2h0OiBub2RlLmRhdGEuaGVpZ2h0LFxuICAgIH0pO1xuICAgIGNvbnN0IG9mZnNldFg6IG51bWJlciA9IG5vZGUuZGF0YS53aWR0aCAqIDIgKiB0aGlzLmdWaWV3Q29vcmRTeXMuc2NhbGVYO1xuICAgIGNvbnN0IG9mZnNldFk6IG51bWJlciA9IG5vZGUuZGF0YS5oZWlnaHQgKiAyICogdGhpcy5nVmlld0Nvb3JkU3lzLnNjYWxlWTtcbiAgICBsZXQgZXh0ZW5kWCA9IDA7XG4gICAgbGV0IGV4dGVuZFkgPSAwO1xuICAgIGxldCBzY3JvbGxEaXJlY3Rpb25YID0gMDtcbiAgICBsZXQgc2Nyb2xsRGlyZWN0aW9uWSA9IDA7XG4gICAgc3dpdGNoIChwb3MpIHtcbiAgICAgIGNhc2UgRWRnZS5sZWZ0OlxuICAgICAgICBleHRlbmRYID0gb2Zmc2V0WDtcbiAgICAgICAgc2Nyb2xsRGlyZWN0aW9uWCA9IC0xO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRWRnZS50b3A6XG4gICAgICAgIHNjcm9sbERpcmVjdGlvblkgPSAtMTtcbiAgICAgICAgZXh0ZW5kWSA9IG9mZnNldFk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFZGdlLnJpZ2h0OlxuICAgICAgICBleHRlbmRYID0gb2Zmc2V0WDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVkZ2UuYm90dG9tOlxuICAgICAgICBleHRlbmRZID0gb2Zmc2V0WTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVkZ2UubGVmdFRvcDpcbiAgICAgICAgZXh0ZW5kWCA9IG9mZnNldFg7XG4gICAgICAgIGV4dGVuZFkgPSBvZmZzZXRZO1xuICAgICAgICBzY3JvbGxEaXJlY3Rpb25YID0gLTE7XG4gICAgICAgIHNjcm9sbERpcmVjdGlvblkgPSAtMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVkZ2UubGVmdEJvdHRvbTpcbiAgICAgICAgZXh0ZW5kWCA9IG9mZnNldFg7XG4gICAgICAgIGV4dGVuZFkgPSBvZmZzZXRZO1xuICAgICAgICBzY3JvbGxEaXJlY3Rpb25YID0gLTE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFZGdlLnJpZ2h0VG9wOlxuICAgICAgICBleHRlbmRYID0gb2Zmc2V0WDtcbiAgICAgICAgZXh0ZW5kWSA9IG9mZnNldFk7XG4gICAgICAgIHNjcm9sbERpcmVjdGlvblkgPSAtMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVkZ2UucmlnaHRCb3R0b206XG4gICAgICAgIGV4dGVuZFggPSBvZmZzZXRYO1xuICAgICAgICBleHRlbmRZID0gb2Zmc2V0WTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgbm9kZS5jb29yZGluYXRlID0gY29udmVydChcbiAgICAgIHRoaXMuZ1ZpZXdDb29yZFN5cyxcbiAgICAgIHsgeDogMCwgeTogMCB9LFxuICAgICAgbm9kZS5jb29yZGluYXRlLFxuICAgICAgdHJ1ZVxuICAgICkgYXMgQ29vcmRpbmF0ZTtcbiAgICB0aGlzLmdyYXBoLmFkZE5vZGUobm9kZSk7XG4gICAgaWYgKGV4dGVuZFgpIHtcbiAgICAgIHRoaXMuc3ZnQ29vcmRTeXMud2lkdGggKz0gZXh0ZW5kWDtcbiAgICAgIGlmIChzY3JvbGxEaXJlY3Rpb25YKSB7XG4gICAgICAgIHRoaXMuZ1ZpZXdDb29yZFN5cy54IC09IHNjcm9sbERpcmVjdGlvblggKiBleHRlbmRYO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXh0ZW5kWSkge1xuICAgICAgdGhpcy5zdmdDb29yZFN5cy5oZWlnaHQgKz0gZXh0ZW5kWTtcbiAgICAgIGlmIChzY3JvbGxEaXJlY3Rpb25ZKSB7XG4gICAgICAgIHRoaXMuZ1ZpZXdDb29yZFN5cy55IC09IHNjcm9sbERpcmVjdGlvblkgKiBleHRlbmRZO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKFxuICAgICAge1xuICAgICAgICBzdmdDb29yZHM6IGNsb25lRGVlcCh0aGlzLnN2Z0Nvb3JkU3lzKSxcbiAgICAgICAgZ1ZpZXdDb29yZHM6IGNsb25lRGVlcCh0aGlzLmdWaWV3Q29vcmRTeXMpLFxuICAgICAgfSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgZG9tLnNjcm9sbEJ5KHRoaXMudmlld2VyLmN1cnJlbnQsIHtcbiAgICAgICAgICB4OiBzY3JvbGxEaXJlY3Rpb25YICogZXh0ZW5kWCxcbiAgICAgICAgICB5OiBzY3JvbGxEaXJlY3Rpb25ZICogZXh0ZW5kWSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcbiAgcmVhY2hFZGdlKFxuICAgIGNvb3JkOiBDb29yZGluYXRlLFxuICAgIG5vZGVEYXRhOiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH1cbiAgKTogRWRnZSB7XG4gICAgbGV0IGhvcml6b24gPSBcIlwiO1xuICAgIGxldCB2ZXJ0aWNhbCA9IFwiXCI7XG4gICAgLy8g6L6+5Yiw6L6557yY5Yy65Z+f55qE6Kem5Y+R5p2h5Lu277yM5aKe5Yqg5LiA5LiqcGFkZGluZ++8jOWcqOi3neemu+i+uee8mOS4unBhZGRpbmfnmoTml7blgJnlsLHop6blj5HliLDovr7ovrnnvJhcbiAgICBjb25zdCBwYWRkaW5nID0gMzA7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLnN2Z0Nvb3JkU3lzO1xuICAgIGNvbnN0IHsgc2NhbGVYLCBzY2FsZVkgfSA9IHRoaXMuZ1ZpZXdDb29yZFN5cztcbiAgICAvLyDlt6bkvqfovr7liLDovrnnvJjljLrln59cbiAgICBpZiAoY29vcmQueCA8IHBhZGRpbmcpIGhvcml6b24gPSBcImxlZnRcIjtcbiAgICBpZiAoY29vcmQueSA8IHBhZGRpbmcpIHZlcnRpY2FsID0gXCJ0b3BcIjtcbiAgICBpZiAoY29vcmQueCArIHBhZGRpbmcgKyBub2RlRGF0YS53aWR0aCAqIHNjYWxlWCA+PSB3aWR0aCkgaG9yaXpvbiA9IFwicmlnaHRcIjtcbiAgICBpZiAoY29vcmQueSArIHBhZGRpbmcgKyBub2RlRGF0YS5oZWlnaHQgKiBzY2FsZVkgPj0gaGVpZ2h0KVxuICAgICAgdmVydGljYWwgPSBcImJvdHRvbVwiO1xuICAgIGlmIChob3Jpem9uICYmIHZlcnRpY2FsKSB7XG4gICAgICByZXR1cm4gYCR7aG9yaXpvbn0tJHt2ZXJ0aWNhbH1gIGFzIEVkZ2U7XG4gICAgfVxuICAgIGlmIChob3Jpem9uIHx8IHZlcnRpY2FsKSB7XG4gICAgICByZXR1cm4gKGhvcml6b24gfHwgdmVydGljYWwpIGFzIEVkZ2U7XG4gICAgfVxuICAgIHJldHVybiBcImluXCIgYXMgRWRnZTtcbiAgfVxuICAvLyDojrflj5ZCb3VuZGluZ0NsaWVudFJlY3TlubbotYvlgLznu5nlnZDmoIfns7vnu59cbiAgYXNzaWduQm94VG9Db29yZChyZWN0OiBET01SZWN0LCBjb29yZDogQ29vcmRTeXN0ZW0pOiBDb29yZFN5c3RlbSB7XG4gICAgY29vcmQueCA9IHJlY3QueDtcbiAgICBjb29yZC55ID0gcmVjdC55O1xuICAgIGNvb3JkLndpZHRoID0gcmVjdC53aWR0aDtcbiAgICBjb29yZC5oZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgICByZXR1cm4gY29vcmQ7XG4gIH1cbiAgLy8g5Li76aKY5pu05pawXG4gIHVwZGF0ZVRoZW1lID0gKHRoZW1lTmFtZTogXCJsaWdodFwiIHwgXCJkYXJrXCIpID0+IHtcbiAgICB0aGlzLmdyYXBoLmRhdGEudGhlbWUgPSB0aGVtZU5hbWU7XG4gICAgdXBkYXRlVGhlbWUodGhlbWVOYW1lKTtcbiAgfTtcbiAgZ2V0Wm9vbSA9ICgpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiB0aGlzLmdWaWV3Q29vcmRTeXMuc2NhbGVYO1xuICB9O1xuICAvLyDnvKnmlL7nm7jlhbNcbiAgem9vbUluID0gKHN0ZXA6IG51bWJlciA9IHRoaXMuem9vbVN0ZXApID0+IHtcbiAgICByZXR1cm4gdGhpcy5zY2FsZShzdGVwKTtcbiAgfTtcbiAgem9vbU91dCA9IChzdGVwOiBudW1iZXIgPSB0aGlzLnpvb21TdGVwKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2NhbGUoMCAtIHN0ZXApO1xuICB9O1xuICBwcml2YXRlIHNjYWxlKHN0ZXAgPSAwKSB7XG4gICAgY29uc3QgeyBvbkdyYXBoWm9vbSB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoIXRoaXMuZ3JhcGgubm9kZXMubGVuZ3RoKSByZXR1cm4gMTtcbiAgICBjb25zdCBzY2FsZVggPSB0aGlzLmdWaWV3Q29vcmRTeXMuc2NhbGVYIHx8IDE7XG4gICAgY29uc3Qgc2NhbGVZID0gdGhpcy5nVmlld0Nvb3JkU3lzLnNjYWxlWSB8fCAxO1xuICAgIGNvbnN0IHpvb206IG51bWJlciA9IE1hdGgubWF4KFxuICAgICAgdGhpcy56b29tUmFuZ2VbMF0sXG4gICAgICBNYXRoLm1pbih0aGlzLnpvb21SYW5nZVsxXSwgc2NhbGVYICsgc3RlcClcbiAgICApO1xuICAgIHRoaXMuZ1ZpZXdDb29yZFN5cy5zY2FsZVggPSB6b29tO1xuICAgIHRoaXMuZ1ZpZXdDb29yZFN5cy5zY2FsZVkgPSB6b29tO1xuICAgIGxldCBzdmdXaWR0aDogbnVtYmVyID0gdGhpcy5zdmdDb29yZFN5cy53aWR0aDtcbiAgICBsZXQgc3ZnSGVpZ2h0OiBudW1iZXIgPSB0aGlzLnN2Z0Nvb3JkU3lzLmhlaWdodDtcbiAgICBpZiAoem9vbSA+IDEpIHtcbiAgICAgIHN2Z1dpZHRoID0gTWF0aC5jZWlsKCh0aGlzLnN2Z0Nvb3JkU3lzLndpZHRoIC8gc2NhbGVYKSAqIHpvb20pO1xuICAgICAgc3ZnSGVpZ2h0ID0gTWF0aC5jZWlsKCh0aGlzLnN2Z0Nvb3JkU3lzLmhlaWdodCAvIHNjYWxlWSkgKiB6b29tKTtcbiAgICB9XG4gICAgLy8g5Zyo57yp5pS+55qE5pe25YCZ5a+55L2N56e76L+b6KGM5aSE55CG77yM6YG/5YWN6IqC54K55rqi5Ye6XG4gICAgY29uc3Qgc2NhbGVYRGlmZjogbnVtYmVyID0gem9vbSAvIHNjYWxlWDtcbiAgICBjb25zdCBzY2FsZVlEaWZmOiBudW1iZXIgPSB6b29tIC8gc2NhbGVZO1xuICAgIGNvbnN0IHsgeDogY2VudGVyWCwgeTogY2VudGVyWSB9ID0gY29udmVydChcbiAgICAgIHRoaXMud3JhcENvb3JkU3lzLFxuICAgICAgdGhpcy5zdmdDb29yZFN5cyxcbiAgICAgIHtcbiAgICAgICAgeDogdGhpcy53cmFwQ29vcmRTeXMud2lkdGggLyAyLFxuICAgICAgICB5OiB0aGlzLndyYXBDb29yZFN5cy5oZWlnaHQgLyAyLFxuICAgICAgfVxuICAgICkgYXMgQ29vcmRpbmF0ZTtcbiAgICB0aGlzLmdWaWV3Q29vcmRTeXMueCA9XG4gICAgICBzY2FsZVhEaWZmICogdGhpcy5nVmlld0Nvb3JkU3lzLnggLSBzY2FsZVhEaWZmICogY2VudGVyWCArIGNlbnRlclg7XG4gICAgdGhpcy5nVmlld0Nvb3JkU3lzLnkgPVxuICAgICAgc2NhbGVZRGlmZiAqIHRoaXMuZ1ZpZXdDb29yZFN5cy55IC0gc2NhbGVZRGlmZiAqIGNlbnRlclkgKyBjZW50ZXJZO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3ZnQ29vcmRzOiB7XG4gICAgICAgIC4uLnRoaXMuc3ZnQ29vcmRTeXMsXG4gICAgICAgIHdpZHRoOiBzdmdXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBzdmdIZWlnaHQsXG4gICAgICB9LFxuICAgICAgZ1ZpZXdDb29yZHM6IHtcbiAgICAgICAgeDogdGhpcy5nVmlld0Nvb3JkU3lzLngsXG4gICAgICAgIHk6IHRoaXMuZ1ZpZXdDb29yZFN5cy55LFxuICAgICAgICBzY2FsZVg6IHpvb20sXG4gICAgICAgIHNjYWxlWTogem9vbSxcbiAgICAgIH0gYXMgQ29vcmRTeXN0ZW0sXG4gICAgfSk7XG4gICAgb25HcmFwaFpvb20gJiYgb25HcmFwaFpvb20oem9vbSk7XG4gICAgcmV0dXJuIHpvb207XG4gIH1cbiAgem9vbVRvRml0ID0gKCkgPT4ge1xuICAgIC8vIGZpbmQgcmVjdCBhcmVhXG4gICAgbGV0IHRvcG1vc3Q6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBsZXQgbGVmdG1vc3Q6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBsZXQgcmlnaHRtb3N0OiBudW1iZXIgPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG4gICAgbGV0IGJvdHRvbW1vc3Q6IG51bWJlciA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbiAgICBsZXQgcmlnaHRtb3N0Tm9kZTogTm9kZTtcbiAgICBsZXQgYm90dG9tbW9zdE5vZGU6IE5vZGU7XG4gICAgdGhpcy5ncmFwaC5ub2Rlcy5tYXAoKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlLnBvc2l0aW9uWCA8IGxlZnRtb3N0KSBsZWZ0bW9zdCA9IG5vZGUucG9zaXRpb25YO1xuICAgICAgaWYgKG5vZGUucG9zaXRpb25YID4gcmlnaHRtb3N0KSB7XG4gICAgICAgIHJpZ2h0bW9zdCA9IG5vZGUucG9zaXRpb25YO1xuICAgICAgICByaWdodG1vc3ROb2RlID0gbm9kZTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLnBvc2l0aW9uWSA8IHRvcG1vc3QpIHRvcG1vc3QgPSBub2RlLnBvc2l0aW9uWTtcbiAgICAgIGlmIChub2RlLnBvc2l0aW9uWSA+IGJvdHRvbW1vc3QpIHtcbiAgICAgICAgYm90dG9tbW9zdCA9IG5vZGUucG9zaXRpb25ZO1xuICAgICAgICBib3R0b21tb3N0Tm9kZSA9IG5vZGU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGV0IG5vZGVzV2lkdGggPSAwO1xuICAgIGxldCBub2Rlc0hlaWdodCA9IDA7XG4gICAgaWYgKHJpZ2h0bW9zdE5vZGUgJiYgYm90dG9tbW9zdE5vZGUpIHtcbiAgICAgIG5vZGVzV2lkdGggPSByaWdodG1vc3QgKyByaWdodG1vc3ROb2RlLmRhdGEud2lkdGggLSBsZWZ0bW9zdDtcbiAgICAgIG5vZGVzSGVpZ2h0ID0gYm90dG9tbW9zdCArIGJvdHRvbW1vc3ROb2RlLmRhdGEuaGVpZ2h0IC0gdG9wbW9zdDtcbiAgICB9XG4gICAgLy8g5aaC5p6c5rKh5pyJ6IqC54K55YiZ55u05o6l6L+U5ZueXG4gICAgaWYgKG5vZGVzV2lkdGggPD0gMCB8fCBub2Rlc0hlaWdodCA8PSAwKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgbGV0IHpvb20gPSAxO1xuICAgIGNvbnN0IHNjYWxlWDogbnVtYmVyID1cbiAgICAgIE1hdGguY2VpbCgodGhpcy53cmFwQ29vcmRTeXMud2lkdGggKiA5KSAvIG5vZGVzV2lkdGgpIC8gMTA7XG4gICAgY29uc3Qgc2NhbGVZOiBudW1iZXIgPVxuICAgICAgTWF0aC5jZWlsKCh0aGlzLndyYXBDb29yZFN5cy5oZWlnaHQgKiA5KSAvIG5vZGVzSGVpZ2h0KSAvIDEwO1xuICAgIGlmIChzY2FsZVggPj0gMSAmJiBzY2FsZVkgPj0gMSkge1xuICAgICAgem9vbSA9IE1hdGgubWluKE1hdGgubWluKHNjYWxlWCwgc2NhbGVZKSwgdGhpcy56b29tUmFuZ2VbMV0pO1xuICAgIH0gZWxzZSBpZiAoc2NhbGVYIDw9IDEgJiYgc2NhbGVZIDw9IDEpIHtcbiAgICAgIHpvb20gPSBNYXRoLm1heChNYXRoLm1pbihzY2FsZVgsIHNjYWxlWSksIHRoaXMuem9vbVJhbmdlWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgem9vbSA9IE1hdGgubWF4KE1hdGgubWluKHNjYWxlWCwgc2NhbGVZKSwgdGhpcy56b29tUmFuZ2VbMF0pO1xuICAgIH1cbiAgICBjb25zdCBjZW50ZXJYOiBudW1iZXIgPSBub2Rlc1dpZHRoIC8gMiArIGxlZnRtb3N0O1xuICAgIGNvbnN0IGNlbnRlclk6IG51bWJlciA9IG5vZGVzSGVpZ2h0IC8gMiArIHRvcG1vc3Q7XG5cbiAgICB0aGlzLmdWaWV3Q29vcmRTeXMuc2NhbGVYID0gem9vbTtcbiAgICB0aGlzLmdWaWV3Q29vcmRTeXMuc2NhbGVZID0gem9vbTtcblxuICAgIGNvbnN0IG5ld0NlbnRlclg6IG51bWJlciA9IGNlbnRlclggKiB6b29tO1xuICAgIGNvbnN0IG5ld0NlbnRlclk6IG51bWJlciA9IGNlbnRlclkgKiB6b29tO1xuICAgIHRoaXMuc3ZnQ29vcmRTeXMud2lkdGggPSBkb20uc2NyZWVuKCkud2lkdGggKiAyO1xuICAgIHRoaXMuc3ZnQ29vcmRTeXMuaGVpZ2h0ID0gZG9tLnNjcmVlbigpLmhlaWdodCAqIDI7XG4gICAgY29uc3Qgb2Zmc2V0WDogbnVtYmVyID0gdGhpcy5zdmdDb29yZFN5cy53aWR0aCAvIDIgLSBuZXdDZW50ZXJYO1xuICAgIGNvbnN0IG9mZnNldFk6IG51bWJlciA9IHRoaXMuc3ZnQ29vcmRTeXMuaGVpZ2h0IC8gMiAtIG5ld0NlbnRlclk7XG4gICAgdGhpcy5nVmlld0Nvb3JkU3lzLnggPSBvZmZzZXRYO1xuICAgIHRoaXMuZ1ZpZXdDb29yZFN5cy55ID0gb2Zmc2V0WTtcblxuICAgIC8vIOWwhnN2Z+a7muWKqOWIsOS4remXtOS9jee9rlxuICAgIGNvbnN0IHNjcm9sbFRvcDogbnVtYmVyID1cbiAgICAgICh0aGlzLnN2Z0Nvb3JkU3lzLmhlaWdodCAtIHRoaXMud3JhcENvb3JkU3lzLmhlaWdodCkgLyAyO1xuICAgIGNvbnN0IHNjcm9sbExlZnQ6IG51bWJlciA9XG4gICAgICAodGhpcy5zdmdDb29yZFN5cy53aWR0aCAtIHRoaXMud3JhcENvb3JkU3lzLndpZHRoKSAvIDI7XG4gICAgdGhpcy5zdmdDb29yZFN5cy54ID0gdGhpcy53cmFwQ29vcmRTeXMueCAtIHNjcm9sbExlZnQ7XG4gICAgdGhpcy5zdmdDb29yZFN5cy55ID0gdGhpcy53cmFwQ29vcmRTeXMueSAtIHNjcm9sbFRvcDtcbiAgICB0aGlzLnNldFN0YXRlKFxuICAgICAge1xuICAgICAgICBzdmdDb29yZHM6IGNsb25lRGVlcCh0aGlzLnN2Z0Nvb3JkU3lzKSxcbiAgICAgICAgZ1ZpZXdDb29yZHM6IGNsb25lRGVlcCh0aGlzLmdWaWV3Q29vcmRTeXMpLFxuICAgICAgfSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgZG9tLnNjcm9sbCh0aGlzLnZpZXdlci5jdXJyZW50LCB7XG4gICAgICAgICAgeDogc2Nyb2xsTGVmdCxcbiAgICAgICAgICB5OiBzY3JvbGxUb3AsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHpvb207XG4gIH07XG4gIHVwZGF0ZUdyYXBoID0gKG5vZGVzOiBOb2RlVXBkYXRlW10pID0+IHtcbiAgICBjb25zdCBub2RlTWFwOiB7IFtrZXk6IHN0cmluZ106IE5vZGVVcGRhdGUgfSA9IHt9O1xuICAgIG5vZGVzLm1hcCgobm9kZTogTm9kZVVwZGF0ZSkgPT4ge1xuICAgICAgY29uc3QgaU5vZGUgPSB0aGlzLmdyYXBoLmdldE5vZGUobm9kZS5pZCk7XG4gICAgICBpZiAoaU5vZGUpIHtcbiAgICAgICAgbm9kZS5vcmlnaW5YID0gaU5vZGUucG9zaXRpb25YO1xuICAgICAgICBub2RlLm9yaWdpblkgPSBpTm9kZS5wb3NpdGlvblk7XG4gICAgICB9XG4gICAgICBub2RlTWFwW25vZGUuaWRdID0gbm9kZTtcbiAgICB9KTtcbiAgICB0aGlzLmdyYXBoLnB1YnN1Yi5wdWJsaXNoKEFjdGlvbi5VcGRhdGVHcmFwaC50b1N0cmluZygpLCB7IG5vZGVNYXAgfSk7XG4gIH07XG4gIGxvYWRHcmFwaCA9IChncmFwaERhdGE6IEdyYXBoSnNvbikgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsb2FkaW5nOiB0cnVlIH0pO1xuICAgIHRoaXMuZ3JhcGgucmVzZXQoKTtcbiAgICB0aGlzLmdyYXBoLmxvYWREYXRhKGdyYXBoRGF0YSk7XG4gICAgY29uc3QgZGVmYXVsdFZpZXc6IGRvbS5WaWV3UG9ydCA9IGRvbS5zY3JlZW4oKTtcbiAgICB0aGlzLnVwZGF0ZVRoZW1lKGdyYXBoRGF0YS50aGVtZSB8fCBcImxpZ2h0XCIpO1xuICAgIHRoaXMuZ3JhcGguZGF0YS5zdmdDb29yZHMgPSB0aGlzLmdyYXBoLmRhdGEuc3ZnQ29vcmRzIHx8IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgd2lkdGg6IDIgKiBkZWZhdWx0Vmlldy53aWR0aCxcbiAgICAgIGhlaWdodDogMiAqIGRlZmF1bHRWaWV3LmhlaWdodCxcbiAgICB9O1xuICAgIHRoaXMuc3ZnQ29vcmRTeXMgPSB0aGlzLmdyYXBoLmRhdGEuc3ZnQ29vcmRzO1xuICAgIHRoaXMuZ3JhcGguZGF0YS5nVmlld0Nvb3JkcyA9IHRoaXMuZ3JhcGguZGF0YS5nVmlld0Nvb3JkcyB8fCB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIHdpZHRoOiAyICogZGVmYXVsdFZpZXcud2lkdGgsXG4gICAgICBoZWlnaHQ6IDIgKiBkZWZhdWx0Vmlldy5oZWlnaHQsXG4gICAgICBzY2FsZVg6IDEsXG4gICAgICBzY2FsZVk6IDEsXG4gICAgfTtcbiAgICB0aGlzLmdWaWV3Q29vcmRTeXMgPSB0aGlzLmdyYXBoLmRhdGEuZ1ZpZXdDb29yZHM7XG4gICAgdGhpcy5zZXRTdGF0ZShcbiAgICAgIHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIHN2Z0Nvb3JkczogY2xvbmVEZWVwKHRoaXMuc3ZnQ29vcmRTeXMpLFxuICAgICAgICBnVmlld0Nvb3JkczogY2xvbmVEZWVwKHRoaXMuZ1ZpZXdDb29yZFN5cyksXG4gICAgICB9LFxuICAgICAgKCkgPT4ge1xuICAgICAgICBkb20uc2Nyb2xsKHRoaXMudmlld2VyLmN1cnJlbnQsIHtcbiAgICAgICAgICB4OiB0aGlzLndyYXBDb29yZFN5cy54IC0gdGhpcy5zdmdDb29yZFN5cy54LFxuICAgICAgICAgIHk6IHRoaXMud3JhcENvb3JkU3lzLnkgLSB0aGlzLnN2Z0Nvb3JkU3lzLnksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH07XG4gIGV4cG9ydEdyYXBoID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLmdyYXBoLmV4cG9ydEpzb24oKTtcbiAgfTtcbiAgcHJpdmF0ZSBzZWxlY3ROb2Rlc0luQXJlYShhcmVhOiBSZWN0QXJlYSkge1xuICAgIGNvbnN0IGxlZnRYOiBudW1iZXIgPSBNYXRoLm1pbihhcmVhLngsIGFyZWEueDEpO1xuICAgIGNvbnN0IGxlZnRZOiBudW1iZXIgPSBNYXRoLm1pbihhcmVhLnksIGFyZWEueTEpO1xuICAgIGNvbnN0IHJpZ2h0WDogbnVtYmVyID0gTWF0aC5tYXgoYXJlYS54LCBhcmVhLngxKTtcbiAgICBjb25zdCByaWdodFk6IG51bWJlciA9IE1hdGgubWF4KGFyZWEueSwgYXJlYS55MSk7XG4gICAgY29uc3QgeyB4LCB5IH06IENvb3JkaW5hdGUgPSBjb252ZXJ0KFxuICAgICAgdGhpcy5nVmlld0Nvb3JkU3lzLFxuICAgICAgeyB4OiAwLCB5OiAwIH0sXG4gICAgICB7IHg6IGxlZnRYLCB5OiBsZWZ0WSB9LFxuICAgICAgdHJ1ZVxuICAgICkgYXMgQ29vcmRpbmF0ZTtcbiAgICBjb25zdCB7IHg6IHgxLCB5OiB5MSB9OiBDb29yZGluYXRlID0gY29udmVydChcbiAgICAgIHRoaXMuZ1ZpZXdDb29yZFN5cyxcbiAgICAgIHsgeDogMCwgeTogMCB9LFxuICAgICAgeyB4OiByaWdodFgsIHk6IHJpZ2h0WSB9LFxuICAgICAgdHJ1ZVxuICAgICkgYXMgQ29vcmRpbmF0ZTtcbiAgICBjb25zdCBkZXRlY3RJbkFyZWEgPSAobm9kZTogTm9kZSwgYXJlYTogUmVjdEFyZWEpOiBib29sZWFuID0+IHtcbiAgICAgIGNvbnN0IGxlZnRDb3JuZXI6IGJvb2xlYW4gPVxuICAgICAgICBhcmVhLnggPD0gbm9kZS5jb29yZGluYXRlLnggJiYgYXJlYS55IDw9IG5vZGUuY29vcmRpbmF0ZS55O1xuICAgICAgY29uc3QgcmlnaHRDb3JuZXI6IGJvb2xlYW4gPVxuICAgICAgICBhcmVhLngxID49IG5vZGUuY29vcmRpbmF0ZS54ICsgbm9kZS5kYXRhLndpZHRoICYmXG4gICAgICAgIGFyZWEueTEgPj0gbm9kZS5jb29yZGluYXRlLnkgKyBub2RlLmRhdGEuaGVpZ2h0O1xuICAgICAgcmV0dXJuIGxlZnRDb3JuZXIgJiYgcmlnaHRDb3JuZXI7XG4gICAgfTtcbiAgICB0aGlzLmdyYXBoLm5vZGVzLm1hcCgobm9kZTogTm9kZSkgPT4ge1xuICAgICAgaWYgKGRldGVjdEluQXJlYShub2RlLCB7IHgsIHksIHgxLCB5MSB9KSkge1xuICAgICAgICBub2RlLnNldFByb3AoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUuc2V0UHJvcChcInNlbGVjdGVkXCIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIG9uQWN0aW9uID0gKHRvcGljOiBzdHJpbmcsIHBheWxvYWQ6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgcmVhZG9ubHksIG9uTGlua0Nvbm5lY3RlZCwgaW5TZWxlY3Rpb25Nb2RlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZXZlbnQsIGFjdGlvbkV2ZW50IH0gPSBwYXlsb2FkO1xuICAgIGNvbnN0IG1heFNjcm9sbFRvcDogbnVtYmVyID1cbiAgICAgIHRoaXMuc3ZnQ29vcmRTeXMuaGVpZ2h0IC0gdGhpcy53cmFwQ29vcmRTeXMuaGVpZ2h0O1xuICAgIGNvbnN0IG1heFNjcm9sbExlZnQ6IG51bWJlciA9XG4gICAgICB0aGlzLnN2Z0Nvb3JkU3lzLndpZHRoIC0gdGhpcy53cmFwQ29vcmRTeXMud2lkdGg7XG4gICAgaWYgKGFjdGlvbkV2ZW50LnR5cGUgPT09IEFjdGlvblR5cGUuQmxhbmspIHtcbiAgICAgIGlmIChpblNlbGVjdGlvbk1vZGUpIHtcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBjb252ZXJ0KFxuICAgICAgICAgIHsgeDogMCwgeTogMCB9LFxuICAgICAgICAgIHRoaXMuc3ZnQ29vcmRTeXMsXG4gICAgICAgICAgYWN0aW9uRXZlbnQuY29vcmRpbmF0ZVxuICAgICAgICApIGFzIENvb3JkaW5hdGU7XG4gICAgICAgIHN3aXRjaCAodG9waWMpIHtcbiAgICAgICAgICBjYXNlIEFjdGlvbi5Nb3VzZURvd24udG9TdHJpbmcoKTpcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQXJlYS54ID0geDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQXJlYS55ID0geTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQXJlYS54MSA9IHg7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkFyZWEueTEgPSB5O1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGlvbkFyZWE6IHsgLi4udGhpcy5zZWxlY3Rpb25BcmVhIH0gfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEFjdGlvbi5Nb3VzZVVwLnRvU3RyaW5nKCk6XG4gICAgICAgICAgICB0aGlzLnNlbGVjdE5vZGVzSW5BcmVhKHsgLi4udGhpcy5zZWxlY3Rpb25BcmVhIH0pO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25BcmVhLnggPSB4O1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25BcmVhLnkgPSB5O1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25BcmVhLngxID0geDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQXJlYS55MSA9IHk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25SZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICBkb20uc2V0QXR0cmlidXRlcyh0aGlzLnNlbGVjdGlvblJlZi5jdXJyZW50LCB7XG4gICAgICAgICAgICAgICAgeDogYCR7TWF0aC5taW4odGhpcy5zZWxlY3Rpb25BcmVhLngsIHRoaXMuc2VsZWN0aW9uQXJlYS54MSl9YCxcbiAgICAgICAgICAgICAgICB5OiBgJHtNYXRoLm1pbih0aGlzLnNlbGVjdGlvbkFyZWEueSwgdGhpcy5zZWxlY3Rpb25BcmVhLnkxKX1gLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBgJHtNYXRoLmFicyhcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQXJlYS54IC0gdGhpcy5zZWxlY3Rpb25BcmVhLngxXG4gICAgICAgICAgICAgICAgKX1gLFxuICAgICAgICAgICAgICAgIGhlaWdodDogYCR7TWF0aC5hYnMoXG4gICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkFyZWEueSAtIHRoaXMuc2VsZWN0aW9uQXJlYS55MVxuICAgICAgICAgICAgICAgICl9YCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9uQXJlYTogeyAuLi50aGlzLnNlbGVjdGlvbkFyZWEgfSxcbiAgICAgICAgICAgICAgaW5EcmFnTW9kZTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQWN0aW9uLk1vdXNlTW92ZS50b1N0cmluZygpOlxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25BcmVhLngxID0geDtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQXJlYS55MSA9IHk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25SZWYuY3VycmVudCkge1xuICAgICAgICAgICAgICBkb20uc2V0QXR0cmlidXRlcyh0aGlzLnNlbGVjdGlvblJlZi5jdXJyZW50LCB7XG4gICAgICAgICAgICAgICAgeDogYCR7TWF0aC5taW4odGhpcy5zZWxlY3Rpb25BcmVhLngsIHRoaXMuc2VsZWN0aW9uQXJlYS54MSl9YCxcbiAgICAgICAgICAgICAgICB5OiBgJHtNYXRoLm1pbih0aGlzLnNlbGVjdGlvbkFyZWEueSwgdGhpcy5zZWxlY3Rpb25BcmVhLnkxKX1gLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBgJHtNYXRoLmFicyhcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQXJlYS54IC0gdGhpcy5zZWxlY3Rpb25BcmVhLngxXG4gICAgICAgICAgICAgICAgKX1gLFxuICAgICAgICAgICAgICAgIGhlaWdodDogYCR7TWF0aC5hYnMoXG4gICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkFyZWEueSAtIHRoaXMuc2VsZWN0aW9uQXJlYS55MVxuICAgICAgICAgICAgICAgICl9YCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG9mZnNldFggPSAwO1xuICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XG4gICAgICAgIGxldCBzY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgbGV0IHNjcm9sbFRvcCA9IDA7XG4gICAgICAgIHN3aXRjaCAodG9waWMpIHtcbiAgICAgICAgICBjYXNlIEFjdGlvbi5Nb3VzZURvd24udG9TdHJpbmcoKTpcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclggPSBhY3Rpb25FdmVudC5jb29yZGluYXRlLng7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJZID0gYWN0aW9uRXZlbnQuY29vcmRpbmF0ZS55O1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb3AgPSB0aGlzLndyYXBDb29yZFN5cy55IC0gdGhpcy5zdmdDb29yZFN5cy55O1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxMZWZ0ID0gdGhpcy53cmFwQ29vcmRTeXMueCAtIHRoaXMuc3ZnQ29vcmRTeXMueDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQWN0aW9uLkNsaWNrLnRvU3RyaW5nKCk6XG4gICAgICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEFjdGlvbi5Eb3VibGVDbGljay50b1N0cmluZygpOlxuICAgICAgICAgICAgLy8g5Y+M5Ye756m655m95aSE6Ieq5Yqo5pS+5aSnXG4gICAgICAgICAgICB0aGlzLnpvb21JbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBBY3Rpb24uTW91c2VVcC50b1N0cmluZygpOlxuICAgICAgICAgICAgdGhpcy5wb2ludGVyWCA9IDA7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJZID0gMDtcbiAgICAgICAgICAgIC8vIOS/ruWkjem8oOagh+enu+WHuuWbvuWMuuWfn+eEtuWQjueCueWHu+WPs+mUruWHuueOsOiPnOWNleS5i+WQjueCueWHu+WPlua2iOiPnOWNle+8jOWGjeenu+WbnuadpeeCueWHu+epuueZveWkhOWvvOiHtOi/nue6v+aXoOazlea2iOWkseeahOmXrumimFxuICAgICAgICAgICAgaWYgKHRoaXMucHJlTGluaykge1xuICAgICAgICAgICAgICB0aGlzLmdyYXBoLnJlbW92ZUxpbmsodGhpcy5wcmVMaW5rLCB0cnVlKTtcbiAgICAgICAgICAgICAgdGhpcy5wcmVMaW5rID0gbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGluRHJhZ01vZGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBBY3Rpb24uTW91c2VNb3ZlLnRvU3RyaW5nKCk6XG4gICAgICAgICAgICBvZmZzZXRYID0gYWN0aW9uRXZlbnQuY29vcmRpbmF0ZS54IC0gdGhpcy5wb2ludGVyWDtcbiAgICAgICAgICAgIG9mZnNldFkgPSBhY3Rpb25FdmVudC5jb29yZGluYXRlLnkgLSB0aGlzLnBvaW50ZXJZO1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IE1hdGgubWluKFxuICAgICAgICAgICAgICBtYXhTY3JvbGxMZWZ0LFxuICAgICAgICAgICAgICBNYXRoLm1heCgwLCB0aGlzLnNjcm9sbExlZnQgLSBvZmZzZXRYKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IE1hdGgubWluKFxuICAgICAgICAgICAgICBtYXhTY3JvbGxUb3AsXG4gICAgICAgICAgICAgIE1hdGgubWF4KDAsIHRoaXMuc2Nyb2xsVG9wIC0gb2Zmc2V0WSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkb20uc2Nyb2xsKHRoaXMudmlld2VyLmN1cnJlbnQsIHtcbiAgICAgICAgICAgICAgeDogc2Nyb2xsTGVmdCxcbiAgICAgICAgICAgICAgeTogc2Nyb2xsVG9wLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyDlpoLmnpzliqjkvZzlr7nosaHmmK9wb3J0XG4gICAgaWYgKEFjdGlvblR5cGUuUG9ydCA9PT0gYWN0aW9uRXZlbnQudHlwZSkge1xuICAgICAgaWYgKHJlYWRvbmx5KSByZXR1cm47XG4gICAgICBsZXQgb2Zmc2V0WCA9IDA7XG4gICAgICBsZXQgb2Zmc2V0WSA9IDA7XG4gICAgICBsZXQgcG9zaXRpb25YID0gMDtcbiAgICAgIGxldCBwb3NpdGlvblkgPSAwO1xuICAgICAgbGV0IHRhcmdldE5vZGU6IE5vZGUgPSBudWxsO1xuICAgICAgbGV0IHRhcmdldFBvcnQ6IFBvcnQgPSBudWxsO1xuICAgICAgbGV0IHRhcmdldFBvcnRFbDogSFRNTEVsZW1lbnQgPSBudWxsO1xuICAgICAgLy8gRklYTUU6IHRoaXMgaXMgYSBoYWNrIG5vd1xuICAgICAgY29uc3QgcG9ydEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9tLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgYFtkYXRhLWlkPVwiJHthY3Rpb25FdmVudC50YXJnZXR9XCJdYFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5vZGVJZDogc3RyaW5nID0gcG9ydEVsZW1lbnQuZGF0YXNldC5hdHRhY2hlZDtcbiAgICAgIGNvbnN0IHNvdXJjZU5vZGU6IE5vZGUgPSB0aGlzLmdyYXBoLmdldE5vZGUobm9kZUlkKTtcbiAgICAgIGNvbnN0IHNvdXJjZVBvcnQ6IFBvcnQgPSBzb3VyY2VOb2RlLmdldFBvcnQoYWN0aW9uRXZlbnQudGFyZ2V0KTtcbiAgICAgIC8vIOmSiOWvueerr+WPo+eahOaTjeS9nOWIhuS4pOenje+8mlxuICAgICAgLy8g56ys5LiA56eN77ya6L6T5Ye65Y+jIC0+IOi+k+WFpeWPo1xuICAgICAgLy8g56ys5LqM56eNOiDovpPlhaXlj6MgLT4g6L6T5Ye65Y+jXG4gICAgICBzd2l0Y2ggKHRvcGljKSB7XG4gICAgICAgIGNhc2UgQWN0aW9uLk1vdXNlRG93bi50b1N0cmluZygpOlxuICAgICAgICAgIHRoaXMuZ3JhcGguZmFrZU5vZGUgPSB0aGlzLm1ha2VGYWtlTm9kZShcbiAgICAgICAgICAgIHNvdXJjZU5vZGUsXG4gICAgICAgICAgICBhY3Rpb25FdmVudC50YXJnZXRcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucG9pbnRlclggPSBhY3Rpb25FdmVudC5jb29yZGluYXRlLng7XG4gICAgICAgICAgdGhpcy5wb2ludGVyWSA9IGFjdGlvbkV2ZW50LmNvb3JkaW5hdGUueTtcbiAgICAgICAgICB0aGlzLnByZUxpbmsgPSB0aGlzLm1ha2VMaW5rKFxuICAgICAgICAgICAgc291cmNlTm9kZSxcbiAgICAgICAgICAgIGFjdGlvbkV2ZW50LnRhcmdldCxcbiAgICAgICAgICAgIHRoaXMuZ3JhcGguZmFrZU5vZGVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZ3JhcGguYWRkTGluayh0aGlzLnByZUxpbmssIHRydWUpO1xuICAgICAgICAgIHRoaXMuZ3JhcGgucHVic3ViLnB1Ymxpc2goQWN0aW9uLkxpbmtDb25uZWN0LnRvU3RyaW5nKCksIHtcbiAgICAgICAgICAgIHNvdXJjZU5vZGUsXG4gICAgICAgICAgICBzb3VyY2VQb3J0LFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjdGlvbi5Nb3VzZU1vdmUudG9TdHJpbmcoKTpcbiAgICAgICAgY2FzZSBBY3Rpb24uTW91c2VVcC50b1N0cmluZygpOlxuICAgICAgICAgIC8vIEZJWE1FOiB0aGlzIGlzIGEgaGFjayBub3dcbiAgICAgICAgICB0YXJnZXRQb3J0RWwgPSB0aGlzLmZpbmRDbG9zZXN0KGV2ZW50LnRhcmdldCwgXCJbZGF0YS1hY3Rpb24tdHlwZV1cIik7XG4gICAgICAgICAgaWYgKHRhcmdldFBvcnRFbCkge1xuICAgICAgICAgICAgY29uc3QgYWN0aW9uVHlwZTogc3RyaW5nID0gdGFyZ2V0UG9ydEVsLmRhdGFzZXQuYWN0aW9uVHlwZTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFJZDogc3RyaW5nID0gdGFyZ2V0UG9ydEVsLmRhdGFzZXQuaWQ7XG4gICAgICAgICAgICBpZiAoYWN0aW9uVHlwZSA9PT0gQWN0aW9uVHlwZS5Qb3J0KSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5vZGVJZDogc3RyaW5nID0gdGFyZ2V0UG9ydEVsLmRhdGFzZXQuYXR0YWNoZWQ7XG4gICAgICAgICAgICAgIHRhcmdldE5vZGUgPSB0aGlzLmdyYXBoLmdldE5vZGUobm9kZUlkKTtcbiAgICAgICAgICAgICAgdGFyZ2V0UG9ydCA9IHRhcmdldE5vZGUuZ2V0UG9ydChkYXRhSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFjdGlvblR5cGUgPT09IEFjdGlvblR5cGUuTm9kZSkge1xuICAgICAgICAgICAgICB0YXJnZXROb2RlID0gdGhpcy5ncmFwaC5nZXROb2RlKGRhdGFJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIG9mZnNldFggPSBhY3Rpb25FdmVudC5jb29yZGluYXRlLnggLSB0aGlzLnBvaW50ZXJYO1xuICAgICAgICAgIG9mZnNldFkgPSBhY3Rpb25FdmVudC5jb29yZGluYXRlLnkgLSB0aGlzLnBvaW50ZXJZO1xuICAgICAgICAgIHBvc2l0aW9uWCA9XG4gICAgICAgICAgICBzb3VyY2VOb2RlLnBvc2l0aW9uWCArIG9mZnNldFggLyAodGhpcy5nVmlld0Nvb3JkU3lzLnNjYWxlWCB8fCAxKTtcbiAgICAgICAgICBpZiAoc291cmNlTm9kZS5oYXNJblBvcnQoYWN0aW9uRXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgcG9zaXRpb25ZID1cbiAgICAgICAgICAgICAgc291cmNlTm9kZS5wb3NpdGlvblkgLVxuICAgICAgICAgICAgICB0aGlzLmdyYXBoLmZha2VOb2RlLmRhdGEuaGVpZ2h0ICtcbiAgICAgICAgICAgICAgb2Zmc2V0WSAvICh0aGlzLmdWaWV3Q29vcmRTeXMuc2NhbGVZIHx8IDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc291cmNlTm9kZS5oYXNPdXRQb3J0KGFjdGlvbkV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uWSA9XG4gICAgICAgICAgICAgIHNvdXJjZU5vZGUucG9zaXRpb25ZICtcbiAgICAgICAgICAgICAgdGhpcy5ncmFwaC5mYWtlTm9kZS5kYXRhLmhlaWdodCArXG4gICAgICAgICAgICAgIG9mZnNldFkgLyAodGhpcy5nVmlld0Nvb3JkU3lzLnNjYWxlWSB8fCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5ncmFwaC5mYWtlTm9kZS5jb29yZGluYXRlID0geyB4OiBwb3NpdGlvblgsIHk6IHBvc2l0aW9uWSB9O1xuICAgICAgICAgIHRoaXMuZ3JhcGgucHVic3ViLnB1Ymxpc2goQWN0aW9uLk5vZGVNb3ZpbmcudG9TdHJpbmcoKSwge1xuICAgICAgICAgICAgY29vcmRpbmF0ZTogdGhpcy5ncmFwaC5mYWtlTm9kZS5jb29yZGluYXRlLFxuICAgICAgICAgICAgaWQ6IHRoaXMuZ3JhcGguZmFrZU5vZGUuaWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5ncmFwaC5wdWJzdWIucHVibGlzaChBY3Rpb24uTGlua0Nvbm5lY3RpbmcudG9TdHJpbmcoKSwge1xuICAgICAgICAgICAgc291cmNlTm9kZSxcbiAgICAgICAgICAgIHNvdXJjZVBvcnQsXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIHRhcmdldE5vZGUsXG4gICAgICAgICAgICB0YXJnZXRQb3J0LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChBY3Rpb24uTW91c2VVcC50b1N0cmluZygpID09PSB0b3BpYykge1xuICAgICAgICAgICAgaWYgKHRhcmdldFBvcnQgJiYgY2FuUG9ydENvbm5lY3Qoc291cmNlUG9ydCwgdGFyZ2V0UG9ydCkpIHtcbiAgICAgICAgICAgICAgaWYgKHRhcmdldFBvcnQuZGlyZWN0aW9uID09PSBQb3J0RGlyZWN0aW9uLklOKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVMaW5rLnRhcmdldCA9IHRhcmdldFBvcnQuYXR0YWNoZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVMaW5rLnRhcmdldFBvcnQgPSB0YXJnZXRQb3J0LmlkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0YXJnZXRQb3J0LmRpcmVjdGlvbiA9PT0gUG9ydERpcmVjdGlvbi5PVVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByZUxpbmsuc291cmNlID0gdGFyZ2V0UG9ydC5hdHRhY2hlZDtcbiAgICAgICAgICAgICAgICB0aGlzLnByZUxpbmsuc291cmNlUG9ydCA9IHRhcmdldFBvcnQuaWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5ncmFwaC5jb252ZXJGYWtlTGlua1RvTm9ybWFsKHRoaXMucHJlTGluayk7XG4gICAgICAgICAgICAgIG9uTGlua0Nvbm5lY3RlZCAmJlxuICAgICAgICAgICAgICAgIG9uTGlua0Nvbm5lY3RlZChjbG9uZURlZXAodGhpcy5wcmVMaW5rLmV4cG9ydEpzb24oKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXROb2RlICYmIHNvdXJjZVBvcnQuYXR0YWNoZWQgIT09IHRhcmdldE5vZGUuaWQpIHtcbiAgICAgICAgICAgICAgbGV0IGlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIHRhcmdldE5vZGUub3V0UG9ydHMubWFwKChwdDogUG9ydCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwdC5hYnNvcmJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnByZUxpbmsuc291cmNlID0gcHQuYXR0YWNoZWQ7XG4gICAgICAgICAgICAgICAgICB0aGlzLnByZUxpbmsuc291cmNlUG9ydCA9IHB0LmlkO1xuICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaC5jb252ZXJGYWtlTGlua1RvTm9ybWFsKHRoaXMucHJlTGluayk7XG4gICAgICAgICAgICAgICAgICBpc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGFyZ2V0Tm9kZS5pblBvcnRzLm1hcCgocHQ6IFBvcnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocHQuYWJzb3JiYWJsZSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5wcmVMaW5rLnRhcmdldCA9IHB0LmF0dGFjaGVkO1xuICAgICAgICAgICAgICAgICAgdGhpcy5wcmVMaW5rLnRhcmdldFBvcnQgPSBwdC5pZDtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGguY29udmVyRmFrZUxpbmtUb05vcm1hbCh0aGlzLnByZUxpbmspO1xuICAgICAgICAgICAgICAgICAgaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmICghaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXBoLnJlbW92ZUxpbmsodGhpcy5wcmVMaW5rLCB0cnVlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvbkxpbmtDb25uZWN0ZWQgJiZcbiAgICAgICAgICAgICAgICAgIG9uTGlua0Nvbm5lY3RlZChjbG9uZURlZXAodGhpcy5wcmVMaW5rLmV4cG9ydEpzb24oKSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmdyYXBoLnJlbW92ZUxpbmsodGhpcy5wcmVMaW5rLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJlTGluayA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaW5EcmFnTW9kZTogZmFsc2UgfSk7XG4gICAgICAgICAgICB0aGlzLmdyYXBoLnB1YnN1Yi5wdWJsaXNoKEFjdGlvbi5MaW5rQ29ubmVjdGVkLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgIHNvdXJjZU5vZGUsXG4gICAgICAgICAgICAgIHNvdXJjZVBvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBwcml2YXRlIG1ha2VGYWtlTm9kZShub2RlOiBOb2RlLCB0YXJnZXQ6IHN0cmluZyk6IE5vZGUge1xuICAgIGNvbnN0IG5vZGVEYXRhOiBOb2RlRGF0YSA9IHsgLi4ubm9kZS5kYXRhIH07XG4gICAgY29uc3QgdG1wUG9ydHM6IGFueSA9IG5vZGVEYXRhLmluUG9ydHM7XG4gICAgbm9kZURhdGEuaW5Qb3J0cyA9IG5vZGVEYXRhLm91dFBvcnRzO1xuICAgIG5vZGVEYXRhLm91dFBvcnRzID0gdG1wUG9ydHMgYXMgQXJyYXk8UG9ydERhdGE+O1xuICAgIGNvbnN0IGZha2VOb2RlID0gTm9kZS5mcm9tRGF0YShub2RlRGF0YSk7XG4gICAgZmFrZU5vZGUuaWQgPSBcImZha2VcIjtcbiAgICBpZiAobm9kZS5oYXNPdXRQb3J0KHRhcmdldCkpIHtcbiAgICAgIGZha2VOb2RlLnBvc2l0aW9uWSArPSBmYWtlTm9kZS5kYXRhLmhlaWdodDtcbiAgICB9XG4gICAgaWYgKG5vZGUuaGFzSW5Qb3J0KHRhcmdldCkpIHtcbiAgICAgIGZha2VOb2RlLnBvc2l0aW9uWSAtPSBmYWtlTm9kZS5kYXRhLmhlaWdodDtcbiAgICB9XG4gICAgcmV0dXJuIGZha2VOb2RlO1xuICB9XG4gIHByaXZhdGUgbWFrZUxpbmsobm9kZTogTm9kZSwgdGFyZ2V0OiBzdHJpbmcsIGZha2VOb2RlOiBOb2RlKTogTGluayB7XG4gICAgbGV0IHNvdXJjZU5vZGVJZCA9IFwiXCI7XG4gICAgbGV0IHRhcmdldE5vZGVJZCA9IFwiXCI7XG4gICAgaWYgKG5vZGUuaGFzT3V0UG9ydCh0YXJnZXQpKSB7XG4gICAgICBzb3VyY2VOb2RlSWQgPSBub2RlLmlkO1xuICAgICAgdGFyZ2V0Tm9kZUlkID0gZmFrZU5vZGUuaWQ7XG4gICAgfVxuICAgIGlmIChub2RlLmhhc0luUG9ydCh0YXJnZXQpKSB7XG4gICAgICBzb3VyY2VOb2RlSWQgPSBmYWtlTm9kZS5pZDtcbiAgICAgIHRhcmdldE5vZGVJZCA9IG5vZGUuaWQ7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTGluayhzb3VyY2VOb2RlSWQsIHRhcmdldE5vZGVJZCwgdGFyZ2V0LCB0YXJnZXQpO1xuICB9XG4gIHByaXZhdGUgcmVuZGVyQmFja2dyb3VuZCgpOiBSZWFjdC5SZWFjdEVsZW1lbnQge1xuICAgIGNvbnN0IHsgZ3JpZFNpemUsIGJhY2tncm91bmRGaWxsLCByZW5kZXJCYWNrZ3JvdW5kIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChyZW5kZXJCYWNrZ3JvdW5kKSB7XG4gICAgICByZXR1cm4gcmVuZGVyQmFja2dyb3VuZChncmlkU2l6ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8QmFja2dyb3VuZCBmaWxsPXtiYWNrZ3JvdW5kRmlsbH0gLz47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBmaW5kQ2xvc2VzdChlbDogSFRNTEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGVsLmNsb3Nlc3Qoc2VsZWN0b3IpIGFzIEhUTUxFbGVtZW50O1xuICB9XG4gIHByaXZhdGUgbWFrZUFjdGlvbkV2ZW50KFxuICAgIGV2ZW50OiBNb3VzZUV2ZW50LFxuICAgIGFjdGlvbjogQWN0aW9uLFxuICAgIHNyYz86IEhUTUxFbGVtZW50XG4gICk6IEFjdGlvbkV2ZW50IHtcbiAgICBpZiAoc3JjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNyYyA9IHRoaXMuZmluZENsb3Nlc3QoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50LCBcIltkYXRhLWFjdGlvbi10eXBlXVwiKTtcbiAgICB9XG4gICAgbGV0IHRhcmdldDogYW55ID0geyBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLkJsYW5rLCBpZDogXCJcIiB9O1xuICAgIGlmIChzcmMpIHtcbiAgICAgIHRhcmdldCA9IHsgLi4uc3JjLmRhdGFzZXQgfTtcbiAgICB9XG4gICAgY29uc3QgYWN0aW9uVHlwZTogQWN0aW9uVHlwZSA9IHRhcmdldC5hY3Rpb25UeXBlO1xuICAgIGNvbnN0IGRhdGFJZDogc3RyaW5nID0gdGFyZ2V0LmlkO1xuICAgIGNvbnN0IGNvb3JkaW5hdGU6IENvb3JkaW5hdGUgPSB7XG4gICAgICB4OiBldmVudC5jbGllbnRYLFxuICAgICAgeTogZXZlbnQuY2xpZW50WSxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgQWN0aW9uRXZlbnQoYWN0aW9uLCBhY3Rpb25UeXBlLCBkYXRhSWQsIGNvb3JkaW5hdGUpO1xuICB9XG4gIHByaXZhdGUgdHJpZ2dlcihcbiAgICBldmVudDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQsXG4gICAgYWN0aW9uRXZlbnQ6IEFjdGlvbkV2ZW50LFxuICAgIG9wdGlvbnM/OiBhbnlcbiAgKSB7XG4gICAgdGhpcy5ncmFwaC5wdWJzdWIucHVibGlzaChhY3Rpb25FdmVudC5hY3Rpb24udG9TdHJpbmcoKSwge1xuICAgICAgZXZlbnQsXG4gICAgICBhY3Rpb25FdmVudCxcbiAgICAgIG9wdGlvbnMsXG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBvbkdyYXBoQ2xpY2sgPSAoXG4gICAgZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY0V2ZW50PEhUTUxFbGVtZW50LCBNb3VzZUV2ZW50PlxuICApID0+IHtcbiAgICBjb25zdCB7IG9uR3JhcGhDbGljayB9ID0gdGhpcy5wcm9wcztcbiAgICAvLyDlpoLmnpzmmK9DdHJsL0NvbW1hbmQgKyBDbGlja+S6i+S7tueahOivne+8jOaXoOinhnRoaXMubW91c2VNb3ZlZFxuICAgIGlmIChcbiAgICAgIHRoaXMubW91c2VNb3ZlZCA8PSB0aGlzLm1vdXNlTW92ZVRocmVob2xkIHx8XG4gICAgICBkb20uaXNDdHJsT3JNZXRhKGV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICkge1xuICAgICAgY29uc3QgYWN0aW9uRXZlbnQ6IEFjdGlvbkV2ZW50ID0gdGhpcy5tYWtlQWN0aW9uRXZlbnQoXG4gICAgICAgIGV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICBBY3Rpb24uQ2xpY2tcbiAgICAgICk7XG4gICAgICB0aGlzLnRyaWdnZXIoZXZlbnQubmF0aXZlRXZlbnQsIGFjdGlvbkV2ZW50KTtcbiAgICAgIGlmIChhY3Rpb25FdmVudC50eXBlID09PSBBY3Rpb25UeXBlLk5vZGUpIHtcbiAgICAgICAgY29uc3Qgbm9kZTogTm9kZSA9IHRoaXMuZ3JhcGguZ2V0Tm9kZShhY3Rpb25FdmVudC50YXJnZXQpO1xuICAgICAgICBvbkdyYXBoQ2xpY2sgJiYgb25HcmFwaENsaWNrKEFjdGlvblR5cGUuTm9kZSwgbm9kZS5leHBvcnRKc29uKCkpO1xuICAgICAgfVxuICAgICAgaWYgKGFjdGlvbkV2ZW50LnR5cGUgPT09IEFjdGlvblR5cGUuTGluaykge1xuICAgICAgICBjb25zdCBsaW5rOiBMaW5rID0gdGhpcy5ncmFwaC5nZXRMaW5rKGFjdGlvbkV2ZW50LnRhcmdldCk7XG4gICAgICAgIG9uR3JhcGhDbGljayAmJiBvbkdyYXBoQ2xpY2soQWN0aW9uVHlwZS5MaW5rLCBsaW5rLmV4cG9ydEpzb24oKSk7XG4gICAgICB9XG4gICAgICBpZiAoYWN0aW9uRXZlbnQudHlwZSA9PT0gQWN0aW9uVHlwZS5Qb3J0KSB7XG4gICAgICAgIC8vIFRPRE86IGFkZCBwb3J0IGFjdGlvbiBjYWxsYmFja1xuICAgICAgfVxuICAgICAgaWYgKGFjdGlvbkV2ZW50LnR5cGUgPT09IEFjdGlvblR5cGUuQmxhbmspIHtcbiAgICAgICAgb25HcmFwaENsaWNrICYmIG9uR3JhcGhDbGljayhBY3Rpb25UeXBlLkJsYW5rLCBudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8vIHpvb20gaW4gdGhlIGdyYXBoXG4gIHByaXZhdGUgb25HcmFwaERvdWJsZUNsaWNrID0gKFxuICAgIGV2ZW50OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudCwgTW91c2VFdmVudD5cbiAgKSA9PiB7XG4gICAgY29uc3QgYWN0aW9uRXZlbnQ6IEFjdGlvbkV2ZW50ID0gdGhpcy5tYWtlQWN0aW9uRXZlbnQoXG4gICAgICBldmVudC5uYXRpdmVFdmVudCxcbiAgICAgIEFjdGlvbi5Eb3VibGVDbGlja1xuICAgICk7XG4gICAgdGhpcy50cmlnZ2VyKGV2ZW50Lm5hdGl2ZUV2ZW50LCBhY3Rpb25FdmVudCk7XG4gIH07XG4gIHByaXZhdGUgb25HcmFwaE1vdXNlRG93biA9IChcbiAgICBldmVudDogUmVhY3QuU3ludGhldGljRXZlbnQ8SFRNTEVsZW1lbnQsIE1vdXNlRXZlbnQ+XG4gICkgPT4ge1xuICAgIC8vIOiOt+WPlueEpueCueeUqOS6juaNleiOt+aMiemUruS6i+S7tlxuICAgIHRoaXMudmlld2VyLmN1cnJlbnQuZm9jdXMoKTtcbiAgICAvLyBpbiBtYWNPUywgY3RybCArIGNsaWNrIGluIGNocm9tZSB0cmlnZ2VyIGNvbnRleHRtZW51XG4gICAgaWYgKGV2ZW50Lm5hdGl2ZUV2ZW50LmN0cmxLZXkgfHwgIWRvbS5pc0xlZnRCdXR0b24oZXZlbnQpKSByZXR1cm47XG4gICAgLy8g5bey57uP5Zyo5ouW5ou95Lit5pe25peg5rOV57un57ut6Kem5Y+RbW91c2Vkb3du5LqL5Lu2XG4gICAgaWYgKHRoaXMuaW5EcmFnTW9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IHNyYzogSFRNTEVsZW1lbnQgPSB0aGlzLmZpbmRDbG9zZXN0KFxuICAgICAgZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50LFxuICAgICAgXCJbZGF0YS1hY3Rpb24tdHlwZV1cIlxuICAgICk7XG4gICAgaWYgKGRvbS5pc0xlZnRCdXR0b24oZXZlbnQpKSB7XG4gICAgICBkb20uYWRkQ2xhc3MoZG9jdW1lbnQuYm9keSwgXCJlZGl0b3ItY3Vyc29yLW1vdmluZ1wiKTtcbiAgICAgIGRvbS5yZXBsYWNlQ2xhc3MoXG4gICAgICAgIHRoaXMudmlld2VyLmN1cnJlbnQsXG4gICAgICAgIFwiZWRpdG9yLWN1cnNvci1tb3ZlXCIsXG4gICAgICAgIFwiZWRpdG9yLWN1cnNvci1tb3ZpbmdcIlxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5zcmNFbGVtZW50ID0gc3JjO1xuICAgIGNvbnN0IGFjdGlvbkV2ZW50OiBBY3Rpb25FdmVudCA9IHRoaXMubWFrZUFjdGlvbkV2ZW50KFxuICAgICAgZXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICBBY3Rpb24uTW91c2VEb3duLFxuICAgICAgc3JjXG4gICAgKTtcbiAgICB0aGlzLnRyaWdnZXJNb3VzZWRvd24oZXZlbnQsIGFjdGlvbkV2ZW50KTtcbiAgfTtcbiAgcHJpdmF0ZSB0cmlnZ2VyTW91c2Vkb3duID0gKFxuICAgIGV2ZW50OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudCwgTW91c2VFdmVudD4sXG4gICAgYWN0aW9uOiBBY3Rpb25FdmVudFxuICApID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuaW5EcmFnTW9kZSA9IHRydWU7XG4gICAgdGhpcy5tb3VzZU1vdmVkID0gMDtcbiAgICAvLyB0cmlnZ2VyIG1vdXNlbW92ZSBhbmQgbW91c2V1cCBldmVudFxuICAgIGlmICh0aGlzLnZpZXdlci5jdXJyZW50KSB7XG4gICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csIFwibW91c2Vtb3ZlXCIsIHRoaXMub25HcmFwaE1vdXNlTW92ZSk7XG4gICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csIFwibW91c2V1cFwiLCB0aGlzLm9uR3JhcGhNb3VzZVVwKTtcbiAgICB9XG4gICAgdGhpcy50cmlnZ2VyKGV2ZW50Lm5hdGl2ZUV2ZW50LCBhY3Rpb24sIHtcbiAgICAgIHdyYXBDb29yZFN5czogdGhpcy53cmFwQ29vcmRTeXMsXG4gICAgICBzdmdDb29yZFN5czogdGhpcy5zdmdDb29yZFN5cyxcbiAgICAgIGdWaWV3Q29vcmRTeXM6IHRoaXMuZ1ZpZXdDb29yZFN5cyxcbiAgICB9KTtcbiAgfTtcbiAgcHJpdmF0ZSBvbkdyYXBoTW91c2VNb3ZlID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLm1vdXNlTW92ZWQgKz0gMTtcbiAgICBjb25zdCBhY3Rpb25FdmVudDogQWN0aW9uRXZlbnQgPSB0aGlzLm1ha2VBY3Rpb25FdmVudChcbiAgICAgIGV2ZW50LFxuICAgICAgQWN0aW9uLk1vdXNlTW92ZSxcbiAgICAgIHRoaXMuc3JjRWxlbWVudFxuICAgICk7XG4gICAgdGhpcy50cmlnZ2VyKGV2ZW50LCBhY3Rpb25FdmVudCwge1xuICAgICAgd3JhcENvb3JkU3lzOiB0aGlzLndyYXBDb29yZFN5cyxcbiAgICAgIHN2Z0Nvb3JkU3lzOiB0aGlzLnN2Z0Nvb3JkU3lzLFxuICAgICAgZ1ZpZXdDb29yZFN5czogdGhpcy5nVmlld0Nvb3JkU3lzLFxuICAgIH0pO1xuICB9O1xuICBwcml2YXRlIG9uR3JhcGhNb3VzZVVwID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgdGhpcy5pbkRyYWdNb2RlID0gZmFsc2U7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGluRHJhZ01vZGU6IHRoaXMuaW5EcmFnTW9kZSB9KTtcbiAgICBjb25zdCBhY3Rpb25FdmVudDogQWN0aW9uRXZlbnQgPSB0aGlzLm1ha2VBY3Rpb25FdmVudChcbiAgICAgIGV2ZW50LFxuICAgICAgQWN0aW9uLk1vdXNlVXAsXG4gICAgICB0aGlzLnNyY0VsZW1lbnRcbiAgICApO1xuICAgIGRvbS5yZXBsYWNlQ2xhc3MoXG4gICAgICB0aGlzLnZpZXdlci5jdXJyZW50LFxuICAgICAgXCJlZGl0b3ItY3Vyc29yLW1vdmluZ1wiLFxuICAgICAgXCJlZGl0b3ItY3Vyc29yLW1vdmVcIlxuICAgICk7XG4gICAgdGhpcy5zcmNFbGVtZW50ID0gbnVsbDtcbiAgICBkb20ucmVtb3ZlQ2xhc3MoZG9jdW1lbnQuYm9keSwgXCJlZGl0b3ItY3Vyc29yLW1vdmluZ1wiKTtcbiAgICBpZiAodGhpcy52aWV3ZXIuY3VycmVudCkge1xuICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCBcIm1vdXNlbW92ZVwiLCB0aGlzLm9uR3JhcGhNb3VzZU1vdmUpO1xuICAgICAgZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCBcIm1vdXNldXBcIiwgdGhpcy5vbkdyYXBoTW91c2VVcCk7XG4gICAgfVxuICAgIHRoaXMudHJpZ2dlcihldmVudCwgYWN0aW9uRXZlbnQsIHtcbiAgICAgIHdyYXBDb29yZFN5czogdGhpcy53cmFwQ29vcmRTeXMsXG4gICAgICBzdmdDb29yZFN5czogdGhpcy5zdmdDb29yZFN5cyxcbiAgICAgIGdWaWV3Q29vcmRTeXM6IHRoaXMuZ1ZpZXdDb29yZFN5cyxcbiAgICB9KTtcbiAgfTtcbiAgcHJpdmF0ZSBvbktleWRvd25BY3Rpb24gPSAodG9waWM6IHN0cmluZywgcGF5bG9hZDogYW55KSA9PiB7XG4gICAgY29uc3QgeyByZWFkb25seSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7XG4gICAgICBvbkNvcHlTZWxlY3RlZCxcbiAgICAgIG9uUmVtb3ZlU2VsZWN0ZWQsXG4gICAgICBvblJlZG8sXG4gICAgICBvblVuZG8sXG4gICAgICBvblNhdmUsXG4gICAgICBvblNhdmVBcyxcbiAgICAgIG9uUnVuLFxuICAgICAgb25SZXJ1bixcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBhY3Rpb25FdmVudDogQWN0aW9uRXZlbnQgPSBnZXQocGF5bG9hZCwgXCJhY3Rpb25FdmVudFwiKSBhcyBBY3Rpb25FdmVudDtcbiAgICBjb25zdCBzdWJBY3Rpb246IEFjdGlvbiA9IGFjdGlvbkV2ZW50LnN1YkFjdGlvbjtcbiAgICBpZiAoYWN0aW9uRXZlbnQuc3ViQWN0aW9uID09PSBBY3Rpb24uU2F2ZUFzKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZ3JhcGhEYXRhQXM6IEdyYXBoSnNvbiA9IHRoaXMuZ3JhcGguZXhwb3J0SnNvbigpO1xuICAgICAgb25TYXZlQXMgJiYgb25TYXZlQXMoZ3JhcGhEYXRhQXMpO1xuICAgIH1cbiAgICAvLyDlj6ror7vmg4XlhrXkuIvvvIzkuI3lk43lupTpmaTlj6blrZjkuLrkuYvlpJbnmoTlv6vmjbfplK5cbiAgICBpZiAocmVhZG9ubHkpIHJldHVybjtcbiAgICBpZiAoYWN0aW9uRXZlbnQuc3ViQWN0aW9uID09PSBBY3Rpb24uQ29weSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQ6IE5vZGVbXSA9IHRoaXMuZ3JhcGguZ2V0Tm9kZXNXaXRoKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICB0aGlzLmdyYXBoLnBsdWdpbnMuZWRpdC5jb3B5Tm9kZXMoc2VsZWN0ZWQpO1xuICAgICAgb25Db3B5U2VsZWN0ZWQgJiZcbiAgICAgICAgb25Db3B5U2VsZWN0ZWQoc2VsZWN0ZWQubWFwKChub2RlKSA9PiBjbG9uZURlZXAobm9kZS5kYXRhKSkpO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uRXZlbnQuc3ViQWN0aW9uID09PSBBY3Rpb24uUGFzdGUpIHtcbiAgICAgIHRoaXMuZ3JhcGgucGx1Z2lucy5lZGl0LnBhc3RlTm9kZXMoKTtcbiAgICAgIC8vIFRPRE86IOWinuWKoOWbnuiwg+WHveaVsFxuICAgIH1cbiAgICBpZiAoYWN0aW9uRXZlbnQuc3ViQWN0aW9uID09PSBBY3Rpb24uRGVsZXRlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZDogTm9kZVtdID0gdGhpcy5ncmFwaC5nZXROb2Rlc1dpdGgoXCJzZWxlY3RlZFwiLCB0cnVlKTtcbiAgICAgIHRoaXMuZ3JhcGgucGx1Z2lucy5lZGl0LnJlbW92ZU5vZGVzKHNlbGVjdGVkKTtcbiAgICAgIG9uUmVtb3ZlU2VsZWN0ZWQgJiZcbiAgICAgICAgb25SZW1vdmVTZWxlY3RlZChzZWxlY3RlZC5tYXAoKG5vZGU6IE5vZGUpID0+IGNsb25lRGVlcChub2RlLmRhdGEpKSk7XG4gICAgfVxuICAgIGlmIChhY3Rpb25FdmVudC5zdWJBY3Rpb24gPT09IEFjdGlvbi5SZWRvKSB7XG4gICAgICB0aGlzLmdyYXBoLnBsdWdpbnMuZWRpdC5yZWRvKCk7XG4gICAgICBvblJlZG8gJiYgb25SZWRvKCk7XG4gICAgfVxuICAgIGlmIChhY3Rpb25FdmVudC5zdWJBY3Rpb24gPT09IEFjdGlvbi5VbmRvKSB7XG4gICAgICB0aGlzLmdyYXBoLnBsdWdpbnMuZWRpdC51bmRvKCk7XG4gICAgICBvblVuZG8gJiYgb25VbmRvKCk7XG4gICAgfVxuICAgIGlmIChhY3Rpb25FdmVudC5zdWJBY3Rpb24gPT09IEFjdGlvbi5TYXZlKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZ3JhcGhEYXRhOiBHcmFwaEpzb24gPSB0aGlzLmdyYXBoLmV4cG9ydEpzb24oKTtcbiAgICAgIG9uU2F2ZSAmJiBvblNhdmUoZ3JhcGhEYXRhKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbkV2ZW50LnN1YkFjdGlvbiA9PT0gQWN0aW9uLlJ1bikge1xuICAgICAgY29uc3QgZ3JhcGhEYXRhOiBHcmFwaEpzb24gPSB0aGlzLmdyYXBoLmV4cG9ydEpzb24oKTtcbiAgICAgIG9uUnVuICYmIG9uUnVuKGdyYXBoRGF0YSk7XG4gICAgfVxuICAgIGlmIChhY3Rpb25FdmVudC5zdWJBY3Rpb24gPT09IEFjdGlvbi5SZVJ1bikge1xuICAgICAgY29uc3QgZ3JhcGhEYXRhOiBHcmFwaEpzb24gPSB0aGlzLmdyYXBoLmV4cG9ydEpzb24oKTtcbiAgICAgIG9uUmVydW4gJiYgb25SZXJ1bihncmFwaERhdGEpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogZmFsc2UgfSk7XG4gIH07XG4gIHByaXZhdGUgb25HcmFwaEtleWRvd24gPSAoZXZlbnQ6IFJlYWN0LktleWJvYXJkRXZlbnQpID0+IHtcbiAgICBjb25zdCBuZXZ0OiBLZXlib2FyZEV2ZW50ID0gZXZlbnQubmF0aXZlRXZlbnQ7XG4gICAgbGV0IGFjdGlvbjogQWN0aW9uID0gQWN0aW9uLk51bGw7XG4gICAgbGV0IHJlcGVhdCA9IGZhbHNlO1xuICAgIGlmIChkb20uaXNDb3B5KG5ldnQpKSB7XG4gICAgICBhY3Rpb24gPSBBY3Rpb24uQ29weTtcbiAgICB9XG4gICAgaWYgKGRvbS5pc1Bhc3RlKG5ldnQpKSB7XG4gICAgICBhY3Rpb24gPSBBY3Rpb24uUGFzdGU7XG4gICAgICAvLyBUT0RPOiDlop7liqDlm57osIPlh73mlbBcbiAgICB9XG4gICAgaWYgKGRvbS5pc0RlbGV0ZShuZXZ0KSkge1xuICAgICAgYWN0aW9uID0gQWN0aW9uLkRlbGV0ZTtcbiAgICB9XG4gICAgaWYgKGRvbS5pc1JlZG8obmV2dCkpIHtcbiAgICAgIGFjdGlvbiA9IEFjdGlvbi5SZWRvO1xuICAgIH1cbiAgICBpZiAoZG9tLmlzVW5kbyhuZXZ0KSkge1xuICAgICAgYWN0aW9uID0gQWN0aW9uLlVuZG87XG4gICAgfVxuICAgIGlmIChkb20uaXNTYXZlKG5ldnQpKSB7XG4gICAgICBhY3Rpb24gPSBBY3Rpb24uU2F2ZTtcbiAgICB9XG4gICAgaWYgKGRvbS5pc1NhdmVBcyhuZXZ0KSkge1xuICAgICAgYWN0aW9uID0gQWN0aW9uLlNhdmVBcztcbiAgICB9XG4gICAgaWYgKGRvbS5pc1J1bihuZXZ0KSkge1xuICAgICAgYWN0aW9uID0gQWN0aW9uLlJ1bjtcbiAgICB9XG4gICAgaWYgKGRvbS5pc1JlcnVuKG5ldnQpKSB7XG4gICAgICBhY3Rpb24gPSBBY3Rpb24uUmVSdW47XG4gICAgfVxuICAgIGlmIChkb20uaXNTZWxlY3RBbGwobmV2dCkpIHtcbiAgICAgIGFjdGlvbiA9IEFjdGlvbi5TZWxlY3RBbGw7XG4gICAgfVxuICAgIGlmIChhY3Rpb24gPT09IEFjdGlvbi5OdWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGFjdGlvbkV2ZW50OiBBY3Rpb25FdmVudCA9IG5ldyBBY3Rpb25FdmVudChcbiAgICAgIEFjdGlvbi5LZXlkb3duLFxuICAgICAgQWN0aW9uVHlwZS5CbGFuayxcbiAgICAgIFwiXCIsXG4gICAgICB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICB9XG4gICAgKTtcbiAgICBhY3Rpb25FdmVudC5hZGRTdWJBY3Rpb24oYWN0aW9uKTtcbiAgICByZXBlYXQgPSBkb20uaXNLZXlSZXBlYXQobmV2dCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxvYWRpbmc6IHRydWUgfSk7XG4gICAgaWYgKHJlcGVhdCkge1xuICAgICAgdGhpcy5kZWJvdW5jZVRyaWdnZXIobmV2dCwgYWN0aW9uRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXIobmV2dCwgYWN0aW9uRXZlbnQpO1xuICAgIH1cbiAgfTtcbiAgcHJpdmF0ZSBvbkdyYXBoS2V5VXAgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhldmVudCk7XG4gIH07XG4gIHByaXZhdGUgb25HcmFwaFdoZWVsID0gKFxuICAgIGV2ZW50OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudCwgTW91c2VFdmVudD5cbiAgKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coZXZlbnQpO1xuICAgIGNvbnN0IGFjdGlvbkV2ZW50OiBBY3Rpb25FdmVudCA9IHRoaXMubWFrZUFjdGlvbkV2ZW50KFxuICAgICAgZXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICBBY3Rpb24uV2hlZWxcbiAgICApO1xuICAgIHRoaXMudHJpZ2dlcihldmVudC5uYXRpdmVFdmVudCwgYWN0aW9uRXZlbnQpO1xuICB9O1xuICBwcml2YXRlIG9uR3JhcGhDb250ZXh0TWVudSA9IChcbiAgICBldmVudDogUmVhY3QuU3ludGhldGljRXZlbnQ8SFRNTEVsZW1lbnQsIE1vdXNlRXZlbnQ+XG4gICkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgYWN0aW9uRXZlbnQ6IEFjdGlvbkV2ZW50ID0gdGhpcy5tYWtlQWN0aW9uRXZlbnQoXG4gICAgICBldmVudC5uYXRpdmVFdmVudCxcbiAgICAgIEFjdGlvbi5Db250ZXh0TWVudVxuICAgICk7XG4gICAgdGhpcy50cmlnZ2VyKGV2ZW50Lm5hdGl2ZUV2ZW50LCBhY3Rpb25FdmVudCk7XG4gIH07XG4gIHByaXZhdGUgb25HcmFwaFNjcm9sbCA9IChcbiAgICBldmVudDogUmVhY3QuU3ludGhldGljRXZlbnQ8SFRNTEVsZW1lbnQsIFVJRXZlbnQ+XG4gICkgPT4ge1xuICAgIGNvbnN0IHdyYXBwZXI6IEhUTUxFbGVtZW50ID0gdGhpcy52aWV3ZXIuY3VycmVudDtcbiAgICB0aGlzLnN2Z0Nvb3JkU3lzLnggPSB0aGlzLndyYXBDb29yZFN5cy54IC0gd3JhcHBlci5zY3JvbGxMZWZ0O1xuICAgIHRoaXMuc3ZnQ29vcmRTeXMueSA9IHRoaXMud3JhcENvb3JkU3lzLnkgLSB3cmFwcGVyLnNjcm9sbFRvcDtcbiAgfTtcbiAgcHJpdmF0ZSBvbkNvbnRleHRNZW51Q2xpY2sgPSAoXG4gICAgdGFyZ2V0OiBzdHJpbmcsXG4gICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZSxcbiAgICBhY3Rpb246IEFjdGlvbixcbiAgICBzdWJNZW51OiBudW1iZXJcbiAgKSA9PiB7XG4gICAgaWYgKGFjdGlvblR5cGUgPT09IEFjdGlvblR5cGUuTGluaykge1xuICAgICAgY29uc3QgeyBvbkxpbmtSZW1vdmVkIH0gPSB0aGlzLnByb3BzO1xuICAgICAgbGV0IGxpbms6IExpbmsgPSBudWxsO1xuICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSBBY3Rpb24uRGVsZXRlOlxuICAgICAgICAgIGxpbmsgPSB0aGlzLmdyYXBoLmdldExpbmsodGFyZ2V0KTtcbiAgICAgICAgICB0aGlzLmdyYXBoLnJlbW92ZUxpbmsodGFyZ2V0KTtcbiAgICAgICAgICBvbkxpbmtSZW1vdmVkICYmIG9uTGlua1JlbW92ZWQobGluay5kYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFjdGlvblR5cGUgPT09IEFjdGlvblR5cGUuTm9kZSkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBvbk5vZGVSZW5hbWUsXG4gICAgICAgIG9uTm9kZUNvcHksXG4gICAgICAgIG9uTm9kZVJlbW92ZWQsXG4gICAgICAgIG9uTm9kZVByZXZpZXdEYXRhLFxuICAgICAgICBvbk5vZGVQcmV2aWV3UmVzdWx0LFxuICAgICAgICBvbk5vZGVSZXN1bHRFeHBvcnQsXG4gICAgICAgIG9uTm9kZVByZXZpZXdMb2csXG4gICAgICAgIG9uQ29udGV4dE1lbnVBY3Rpb24sXG4gICAgICAgIG9uUnVuRnJvbU5vZGUsXG4gICAgICAgIG9uUnVuVG9Ob2RlLFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICBjb25zdCBub2RlOiBOb2RlID0gdGhpcy5ncmFwaC5nZXROb2RlKHRhcmdldCk7XG4gICAgICBjb25zdCBub2RlRGF0YTogTm9kZURhdGEgPSBjbG9uZURlZXAobm9kZS5kYXRhKTtcbiAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgQWN0aW9uLlJlbmFtZTpcbiAgICAgICAgICB0aGlzLnZpZXdlci5jdXJyZW50LmJsdXIoKTtcbiAgICAgICAgICBvbk5vZGVSZW5hbWUgJiYgb25Ob2RlUmVuYW1lKG5vZGVEYXRhKTtcbiAgICAgICAgICBvbkNvbnRleHRNZW51QWN0aW9uICYmIG9uQ29udGV4dE1lbnVBY3Rpb24oQWN0aW9uLlJlbmFtZSwgbm9kZURhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjdGlvbi5Db3B5OlxuICAgICAgICAgIHRoaXMuZ3JhcGgucGx1Z2lucy5lZGl0LmNvcHlOb2Rlcyhbbm9kZV0pO1xuICAgICAgICAgIG9uTm9kZUNvcHkgJiYgb25Ob2RlQ29weShub2RlRGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWN0aW9uLkRlbGV0ZTpcbiAgICAgICAgICB0aGlzLmdyYXBoLnBsdWdpbnMuZWRpdC5yZW1vdmVOb2RlKHRhcmdldCk7XG4gICAgICAgICAgb25Ob2RlUmVtb3ZlZCAmJiBvbk5vZGVSZW1vdmVkKG5vZGVEYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBY3Rpb24uUHJldmlldzpcbiAgICAgICAgICB0aGlzLnZpZXdlci5jdXJyZW50LmJsdXIoKTtcbiAgICAgICAgICBvbk5vZGVQcmV2aWV3RGF0YSAmJiBvbk5vZGVQcmV2aWV3RGF0YShub2RlRGF0YSk7XG4gICAgICAgICAgb25Db250ZXh0TWVudUFjdGlvbiAmJiBvbkNvbnRleHRNZW51QWN0aW9uKEFjdGlvbi5QcmV2aWV3LCBub2RlRGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWN0aW9uLkNyZWF0ZU1vZGVsOlxuICAgICAgICAgIHRoaXMudmlld2VyLmN1cnJlbnQuYmx1cigpO1xuICAgICAgICAgIG9uQ29udGV4dE1lbnVBY3Rpb24gJiZcbiAgICAgICAgICAgIG9uQ29udGV4dE1lbnVBY3Rpb24oQWN0aW9uLkNyZWF0ZU1vZGVsLCBub2RlRGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWN0aW9uLlZpZXdSZXN1bHQ6XG4gICAgICAgICAgdGhpcy52aWV3ZXIuY3VycmVudC5ibHVyKCk7XG4gICAgICAgICAgb25Ob2RlUHJldmlld1Jlc3VsdCAmJiBvbk5vZGVQcmV2aWV3UmVzdWx0KG5vZGVEYXRhKTtcbiAgICAgICAgICBvbkNvbnRleHRNZW51QWN0aW9uICYmXG4gICAgICAgICAgICBvbkNvbnRleHRNZW51QWN0aW9uKEFjdGlvbi5WaWV3UmVzdWx0LCBub2RlRGF0YSwgc3ViTWVudSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWN0aW9uLlZpZXdMb2c6XG4gICAgICAgICAgdGhpcy52aWV3ZXIuY3VycmVudC5ibHVyKCk7XG4gICAgICAgICAgb25Ob2RlUHJldmlld0xvZyAmJiBvbk5vZGVQcmV2aWV3TG9nKG5vZGVEYXRhKTtcbiAgICAgICAgICBvbkNvbnRleHRNZW51QWN0aW9uICYmIG9uQ29udGV4dE1lbnVBY3Rpb24oQWN0aW9uLlZpZXdMb2csIG5vZGVEYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBY3Rpb24uRXhwb3J0UmVzdWx0OlxuICAgICAgICAgIG9uTm9kZVJlc3VsdEV4cG9ydCAmJiBvbk5vZGVSZXN1bHRFeHBvcnQobm9kZURhdGEsIHN1Yk1lbnUpO1xuICAgICAgICAgIG9uQ29udGV4dE1lbnVBY3Rpb24gJiZcbiAgICAgICAgICAgIG9uQ29udGV4dE1lbnVBY3Rpb24oQWN0aW9uLkV4cG9ydFJlc3VsdCwgbm9kZURhdGEsIHN1Yk1lbnUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjdGlvbi5SdW5Gcm9tTm9kZTpcbiAgICAgICAgICBvblJ1bkZyb21Ob2RlICYmIG9uUnVuRnJvbU5vZGUobm9kZURhdGEpO1xuICAgICAgICAgIG9uQ29udGV4dE1lbnVBY3Rpb24gJiZcbiAgICAgICAgICAgIG9uQ29udGV4dE1lbnVBY3Rpb24oQWN0aW9uLlJ1bkZyb21Ob2RlLCBub2RlRGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWN0aW9uLlJ1blRvTm9kZTpcbiAgICAgICAgICBvblJ1blRvTm9kZSAmJiBvblJ1blRvTm9kZShub2RlRGF0YSk7XG4gICAgICAgICAgb25Db250ZXh0TWVudUFjdGlvbiAmJlxuICAgICAgICAgICAgb25Db250ZXh0TWVudUFjdGlvbihBY3Rpb24uUnVuVG9Ob2RlLCBub2RlRGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhY3Rpb25UeXBlID09PSBBY3Rpb25UeXBlLkJsYW5rKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG9uQ29weVNlbGVjdGVkLFxuICAgICAgICBvblBhc3RlU2VsZWN0ZWQsXG4gICAgICAgIG9uVW5kbyxcbiAgICAgICAgb25SZWRvLFxuICAgICAgICBvblNhdmUsXG4gICAgICAgIG9uU2F2ZUFzLFxuICAgICAgICBvblJlbW92ZVNlbGVjdGVkLFxuICAgICAgfSA9IHRoaXMucHJvcHM7XG4gICAgICBsZXQgc2VsZWN0ZWQ6IE5vZGVbXSA9IFtdO1xuICAgICAgbGV0IGdyYXBoRGF0YTogR3JhcGhKc29uID0ge1xuICAgICAgICBub2RlczogW10sXG4gICAgICAgIGxpbmtzOiBbXSxcbiAgICAgICAgaWQ6IFwiXCIsXG4gICAgICB9O1xuICAgICAgbGV0IGdyYXBoRGF0YUFzOiBHcmFwaEpzb24gPSB7XG4gICAgICAgIG5vZGVzOiBbXSxcbiAgICAgICAgbGlua3M6IFtdLFxuICAgICAgICBpZDogXCJcIixcbiAgICAgIH07XG4gICAgICBsZXQgdG9SZW1vdmVkOiBOb2RlW10gPSBbXTtcbiAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgQWN0aW9uLkNvcHk6XG4gICAgICAgICAgc2VsZWN0ZWQgPSB0aGlzLmdyYXBoLmdldE5vZGVzV2l0aChcInNlbGVjdGVkXCIsIHRydWUpO1xuICAgICAgICAgIHRoaXMuZ3JhcGgucGx1Z2lucy5lZGl0LmNvcHlOb2RlcyhzZWxlY3RlZCk7XG4gICAgICAgICAgb25Db3B5U2VsZWN0ZWQgJiZcbiAgICAgICAgICAgIG9uQ29weVNlbGVjdGVkKHNlbGVjdGVkLm1hcCgobm9kZTogTm9kZSkgPT4gY2xvbmVEZWVwKG5vZGUuZGF0YSkpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBY3Rpb24uUGFzdGU6XG4gICAgICAgICAgdGhpcy5ncmFwaC5wbHVnaW5zLmVkaXQucGFzdGVOb2RlcygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjdGlvbi5VbmRvOlxuICAgICAgICAgIHRoaXMuZ3JhcGgucGx1Z2lucy5lZGl0LnVuZG8oKTtcbiAgICAgICAgICBvblVuZG8gJiYgb25VbmRvKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWN0aW9uLlJlZG86XG4gICAgICAgICAgdGhpcy5ncmFwaC5wbHVnaW5zLmVkaXQucmVkbygpO1xuICAgICAgICAgIG9uUmVkbyAmJiBvblJlZG8oKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBY3Rpb24uU2F2ZTpcbiAgICAgICAgICBncmFwaERhdGEgPSB0aGlzLmdyYXBoLmV4cG9ydEpzb24oKTtcbiAgICAgICAgICBvblNhdmUgJiYgb25TYXZlKGdyYXBoRGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWN0aW9uLlNhdmVBczpcbiAgICAgICAgICBncmFwaERhdGFBcyA9IHRoaXMuZ3JhcGguZXhwb3J0SnNvbigpO1xuICAgICAgICAgIG9uU2F2ZUFzICYmIG9uU2F2ZUFzKGdyYXBoRGF0YUFzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBY3Rpb24uRGVsZXRlOlxuICAgICAgICAgIHRvUmVtb3ZlZCA9IHRoaXMuZ3JhcGguZ2V0Tm9kZXNXaXRoKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy5ncmFwaC5wbHVnaW5zLmVkaXQucmVtb3ZlTm9kZXModG9SZW1vdmVkKTtcbiAgICAgICAgICBvblJlbW92ZVNlbGVjdGVkICYmXG4gICAgICAgICAgICBvblJlbW92ZVNlbGVjdGVkKFxuICAgICAgICAgICAgICB0b1JlbW92ZWQubWFwKChub2RlOiBOb2RlKSA9PiBjbG9uZURlZXAobm9kZS5kYXRhKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfTtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGVkZ2VBcnJvd1NpemUsXG4gICAgICBncmlkU3BhY2luZyxcbiAgICAgIGdyaWREb3RTaXplLFxuICAgICAgcmVuZGVyRGVmcyxcbiAgICAgIHJlYWRvbmx5LFxuICAgICAgaW5TZWxlY3Rpb25Nb2RlLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgc3ZnQ29vcmRzLCBnVmlld0Nvb3Jkcywgc2VsZWN0aW9uQXJlYSwgaW5EcmFnTW9kZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHN2Z0Nvb3JkcztcbiAgICBjb25zdCB7IHgsIHksIHNjYWxlWCwgc2NhbGVZIH0gPSBnVmlld0Nvb3JkcztcbiAgICBjb25zdCBlZGl0b3JDbGFzcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJlZGl0b3Itd3JhcFwiOiB0cnVlLFxuICAgICAgXCJlZGl0b3ItY3Vyc29yLW1vdmVcIjogdHJ1ZSxcbiAgICAgIFwiZWRpdG9yLXNlbGVjdGluZ1wiOiBpblNlbGVjdGlvbk1vZGUsXG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxHcmFwaENvbnRleHQuUHJvdmlkZXJcbiAgICAgICAgdmFsdWU9e3tcbiAgICAgICAgICB0aGVtZTogXCJsaWdodFwiLFxuICAgICAgICAgIHVwZGF0ZVRoZW1lOiAodGhlbWUpID0+IHVwZGF0ZVRoZW1lKHRoZW1lKSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj17dGhpcy52aWV3ZXJ9XG4gICAgICAgICAgZGF0YS1pZD17dGhpcy5ncmFwaC5pZH1cbiAgICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgICBjbGFzc05hbWU9e2VkaXRvckNsYXNzfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub25HcmFwaENsaWNrfVxuICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e3RoaXMub25HcmFwaERvdWJsZUNsaWNrfVxuICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLm9uR3JhcGhNb3VzZURvd259XG4gICAgICAgICAgb25LZXlEb3duPXt0aGlzLm9uR3JhcGhLZXlkb3dufVxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9e3RoaXMub25HcmFwaENvbnRleHRNZW51fVxuICAgICAgICAgIG9uU2Nyb2xsPXt0aGlzLm9uR3JhcGhTY3JvbGx9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJlZGl0b3Itc2Nyb2xsXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoLCBoZWlnaHQgfX1cbiAgICAgICAgICAgIHJlZj17dGhpcy5zY3JvbGxQYW5lfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWRpdG9yLXN0YWdlXCIgc3R5bGU9e3sgd2lkdGgsIGhlaWdodCB9fT5cbiAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJlZGl0b3Itc3ZnXCIgd2lkdGg9e3dpZHRofSBoZWlnaHQ9e2hlaWdodH0+XG4gICAgICAgICAgICAgICAgPERlZnNcbiAgICAgICAgICAgICAgICAgIGVkZ2VBcnJvd1NpemU9e2VkZ2VBcnJvd1NpemV9XG4gICAgICAgICAgICAgICAgICBncmlkU3BhY2luZz17Z3JpZFNwYWNpbmd9XG4gICAgICAgICAgICAgICAgICBncmlkRG90U2l6ZT17Z3JpZERvdFNpemV9XG4gICAgICAgICAgICAgICAgICByZW5kZXJEZWZzPXtyZW5kZXJEZWZzfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGcgY2xhc3NOYW1lPVwiYmFja2dyb3VuZFwiPnt0aGlzLnJlbmRlckJhY2tncm91bmQoKX08L2c+XG4gICAgICAgICAgICAgICAgPGdcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInZpZXdcIlxuICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgbWF0cml4KCR7c2NhbGVYfSAwIDAgJHtzY2FsZVl9ICR7eH0gJHt5fSlgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cImxpbmtzLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cImxpbmstY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ3JhcGgubGlua3MubWFwKChsaW5rKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGlua1ZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGluaz17bGlua31cbiAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtsaW5rLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBncmFwaD17dGhpcy5ncmFwaH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cIm5vZGUtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMuZ3JhcGgubm9kZXMubWFwKChub2RlKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPE5vZGVWaWV3XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlPXtub2RlfVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtub2RlLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGg9e3RoaXMuZ3JhcGh9XG4gICAgICAgICAgICAgICAgICAgICAgICBpbkRyYWdNb2RlPXtpbkRyYWdNb2RlfVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8ZyBjbGFzc05hbWU9XCJub2RlLXNlbGVjdGlvbi1hcmVhXCI+XG4gICAgICAgICAgICAgICAgICA8U2VsZWN0aW9uQXJlYVxuICAgICAgICAgICAgICAgICAgICBhcmVhPXtzZWxlY3Rpb25BcmVhfVxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlPXtpblNlbGVjdGlvbk1vZGV9XG4gICAgICAgICAgICAgICAgICAgIHJlZj17dGhpcy5zZWxlY3Rpb25SZWZ9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Q29udGV4dE1lbnVcbiAgICAgICAgICAgIGdyYXBoPXt0aGlzLmdyYXBofVxuICAgICAgICAgICAgcmVhZG9ubHk9e3JlYWRvbmx5fVxuICAgICAgICAgICAgb25JdGVtQ2xpY2s9e3RoaXMub25Db250ZXh0TWVudUNsaWNrfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9HcmFwaENvbnRleHQuUHJvdmlkZXI+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHcmFwaFZpZXc7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE4RUE7QUFBQTtBQXFFQTtBQUFBO0FBbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBMkVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFpQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQWlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFrQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF3RUE7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEzb0NBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBa0dBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFnQkE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBa0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBTUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW9hQTtBQUFBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQVlBO0FBS0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUlBO0FBQ0E7QUFVQTtBQVdBO0FBQ0E7QUFTQTtBQVFBO0FBaHpDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFteUNBO0FBQUE7QUFFQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/components/graph.tsx