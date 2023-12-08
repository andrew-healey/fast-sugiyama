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
exports.ContextMenu = void 0;
var React = __webpack_require__( /*! react */ "./node_modules/react/index.js");
var ReactDOM = __webpack_require__( /*! react-dom */ "./node_modules/react-dom/index.js");
var classnames_1 = __webpack_require__( /*! classnames */ "./node_modules/classnames/index.js");
var lodash_1 = __webpack_require__( /*! lodash */ "./node_modules/lodash/lodash.js");
var dom = __webpack_require__( /*! @/utils/dom */ "./src/utils/dom.ts");
var others_1 = __webpack_require__( /*! @/utils/others */ "./src/utils/others.ts");
var ua_1 = __webpack_require__( /*! @/utils/ua */ "./src/utils/ua.ts");
var delegation_1 = __webpack_require__( /*! ./delegation */ "./src/components/delegation.ts");
var ctrlKey = "Ctrl";
if (ua_1.default.IS_MAC) {
  ctrlKey = "⌘";
}
var MenuCategory;
(function(MenuCategory) {
  MenuCategory[MenuCategory["Node"] = 1] = "Node";
  MenuCategory[MenuCategory["Link"] = 2] = "Link";
  MenuCategory[MenuCategory["Blank"] = 4] = "Blank";
  MenuCategory[MenuCategory["Port"] = 8] = "Port";
})(MenuCategory || (MenuCategory = {}));
var ContextMenu = /** @class */ (function(_super) {
  __extends(ContextMenu, _super);

  function ContextMenu(props) {
    var _this = _super.call(this, props) || this;
    _this._self = React.createRef();
    _this.visible = false;
    _this.padding = 15;
    _this.items = [{
        name: "rename",
        icon: "pencil2",
        shortcut: "",
        action: delegation_1.Action.Rename,
        category: MenuCategory.Node,
        group: 0,
      },
      {
        name: "copy",
        icon: "copy",
        shortcut: "".concat(ctrlKey, " + C"),
        action: delegation_1.Action.Copy,
        category: MenuCategory.Node,
        group: 0,
      },
      {
        name: "copy selected",
        icon: "copy",
        shortcut: "".concat(ctrlKey, " + C"),
        action: delegation_1.Action.Copy,
        category: MenuCategory.Blank,
        group: 0,
      },
      {
        name: "delete",
        icon: "bin",
        shortcut: "Delete",
        action: delegation_1.Action.Delete,
        category: MenuCategory.Node | MenuCategory.Link,
        group: 0,
      },
      {
        name: "delete selected",
        icon: "bin",
        shortcut: "Delete",
        action: delegation_1.Action.Delete,
        category: MenuCategory.Blank,
        group: 0,
      },
      {
        name: "paste",
        icon: "paste",
        shortcut: "".concat(ctrlKey, " + V"),
        action: delegation_1.Action.Paste,
        category: MenuCategory.Blank,
        group: 0,
      },
      {
        name: "undo",
        icon: "undo",
        shortcut: "".concat(ctrlKey, " + Z"),
        action: delegation_1.Action.Undo,
        category: MenuCategory.Blank,
        group: 0,
      },
      {
        name: "redo",
        icon: "redo",
        shortcut: "".concat(ctrlKey, " + Shift + Z"),
        action: delegation_1.Action.Redo,
        category: MenuCategory.Blank,
        group: 0,
      },
      /*
      {
        name: "预览数据",
        icon: "eye",
        shortcut: "",
        action: Action.Preview,
        category: MenuCategory.Node,
        group: 1,
      },
      {
        name: "创建模型",
        icon: "model",
        shortcut: "",
        action: Action.CreateModel,
        category: MenuCategory.Node,
        group: 1,
      },
      {
        name: "查看结果",
        icon: "eye",
        shortcut: "",
        action: Action.ViewResult,
        category: MenuCategory.Node,
        subMenu: 0,
        subPos: "top",
        group: 1,
      },
      {
        name: "查看日志",
        icon: "file-text",
        shortcut: "",
        action: Action.ViewLog,
        category: MenuCategory.Node,
        group: 1,
      },
      {
        name: "导出结果",
        icon: "download",
        shortcut: "",
        action: Action.ExportResult,
        category: MenuCategory.Node,
        subMenu: 0,
        subPos: "bottom",
        group: 1,
      },
      {
        name: "保存实验",
        icon: "floppy-disk",
        shortcut: `${ctrlKey} + S`,
        action: Action.Save,
        category: MenuCategory.Blank,
        group: 1,
      },
      {
        name: "实验另存为",
        icon: "drive",
        shortcut: `${ctrlKey} + Shift + S`,
        action: Action.SaveAs,
        category: MenuCategory.Blank,
        group: 1,
      },
      {
        name: "从节点开始运行",
        icon: "play2",
        shortcut: "",
        action: Action.RunFromNode,
        category: MenuCategory.Node,
        group: 2,
      },
      {
        name: "执行到该节点",
        icon: "next",
        shortcut: "",
        action: Action.RunToNode,
        category: MenuCategory.Node,
        group: 2,
      },
      */
    ];
    _this.onContextMenu = function(topic, payload) {
      var readonly = _this.props.readonly;
      var subPos = _this.state.subPos;
      var event = (0, lodash_1.get)(payload, "event");
      var actionEvent = (0, lodash_1.get)(payload, "actionEvent");
      var renderItems = _this.items;
      if (actionEvent.type === delegation_1.ActionType.Blank) {
        renderItems = (0, others_1.handleReadOnly)(renderItems, readonly);
      }
      if (actionEvent.type === delegation_1.ActionType.Link) {
        renderItems = _this.items.filter(function(item) {
          return item.category & MenuCategory.Link;
        });
        renderItems = (0, others_1.handleReadOnly)(renderItems, readonly);
      }
      if (actionEvent.type === delegation_1.ActionType.Node) {
        var node = _this.props.graph.getNode(actionEvent.target);
        var subMenu_1 = node.outPorts.length;
        renderItems = _this.items.filter(function(item) {
          return item.category & MenuCategory.Node;
        });
        renderItems = (0, others_1.filterContextMenu)(renderItems, node, readonly);
        renderItems.map(function(m) {
          if (m.action === delegation_1.Action.ViewResult) {
            m.subMenu = subMenu_1;
          }
          if (m.action === delegation_1.Action.ExportResult) {
            m.subMenu = subMenu_1;
          }
        });
      }
      if (actionEvent.type === delegation_1.ActionType.Blank) {
        renderItems = _this.items.filter(function(item) {
          return item.category & MenuCategory.Blank;
        });
      }
      if (actionEvent.type === delegation_1.ActionType.Port) {
        renderItems = _this.items.filter(function(item) {
          return item.category & MenuCategory.Port;
        });
      }
      if (renderItems.length === 0)
        return;
      _this._container.classList.add("visible");
      if (_this._self.current) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var bbox = {
          width: 200,
          height: 10 + renderItems.length * 26,
        };
        var offsetX = event.clientX + bbox.width + _this.padding <= windowWidth ?
          event.clientX :
          event.clientX - bbox.width;
        var offsetY = event.clientY + bbox.height + _this.padding <= windowHeight ?
          event.clientY :
          event.clientY - bbox.height;
        if (event.clientX + bbox.width + 180 + _this.padding <= windowWidth) {
          subPos = "right";
        } else {
          subPos = "left";
        }
        _this.setState({
          positionX: offsetX,
          positionY: offsetY,
          payload: payload,
          renderItems: renderItems,
          subPos: subPos,
        });
      } else {
        _this.setState({
          positionX: event.clientX,
          positionY: event.clientY,
          payload: payload,
          renderItems: renderItems,
          subPos: "right",
        });
      }
    };
    _this.onULClick = function(event) {
      _this.stopEmit(event);
    };
    _this.onItemClick = function(event, action, subMenu) {
      _this.stopEmit(event);
      _this._container.classList.remove("visible");
      _this.setState({
        positionX: 0,
        positionY: 0
      });
      var payload = _this.state.payload;
      var actionEvent = (0, lodash_1.get)(payload, "actionEvent");
      _this.props.onItemClick(actionEvent.target, actionEvent.type, action, subMenu);
    };
    _this.onContainerClick = function(event) {
      event.preventDefault();
      _this._container.classList.remove("visible");
      _this.setState({
        positionX: 0,
        positionY: 0
      });
    };
    _this.onContainerContext = function(event) {
      event.preventDefault();
      if (_this._self &&
        dom.containsElement(_this._self.current, event.target)) {
        // do nothing
      } else {
        _this._container.classList.remove("visible");
        _this.setState({
          positionX: 0,
          positionY: 0
        });
      }
    };
    _this.stopEmit = function(event) {
      // 避免右键点击节点出现的一个bug，右键点击先出先节点菜单，然后又出现图菜单
      event.preventDefault();
      event.stopPropagation();
    };
    _this.state = {
      positionX: 0,
      positionY: 0,
      payload: {},
      renderItems: [],
      subPos: "right",
      readonly: false,
    };
    _this._container = document.createElement("div");
    _this._container.setAttribute("tabindex", "-1");
    _this._container.classList.add("context-menu-layer");
    document.body.appendChild(_this._container);
    _this._container.addEventListener("click", _this.onContainerClick);
    _this._container.addEventListener("contextmenu", _this.onContainerContext);
    _this._container.addEventListener("mousedown", _this.stopEmit);
    var graph = _this.props.graph;
    graph.pubsub.subscribe(delegation_1.Action.ContextMenu.toString(), _this.onContextMenu);
    return _this;
  }
  ContextMenu.prototype.componentWillUnmount = function() {
    document.body.removeChild(this._container);
    this._container.removeEventListener("click", this.onContainerClick);
    this._container.removeEventListener("contextmenu", this.onContainerContext);
    this._container.removeEventListener("mousedown", this.stopEmit);
  };
  ContextMenu.prototype.renderSubItems = function(items, className, action) {
    var _a;
    var _this = this;
    var subClass = (0, classnames_1.default)((_a = {
        "context-menu": true
      },
      _a[className] = true,
      _a));
    return (React.createElement("ul", {
      className: subClass,
      key: "".concat(action, "-submenu")
    }, items.map(function(m) {
      return (React.createElement("li", {
          className: "context-menu-item",
          key: "".concat(m.action, "-").concat(m.subMenu),
          onClick: function(event) {
            return _this.onItemClick(event, m.action, m.subMenu);
          }
        },
        React.createElement("i", {
          className: "icon icon-".concat(m.icon)
        }),
        React.createElement("span", {
          className: "item-name"
        }, m.name),
        React.createElement("span", {
            className: "shortcut"
          },
          React.createElement("i", null, m.shortcut))));
    })));
  };
  ContextMenu.prototype.renderItems = function(items, x, y) {
    var _this = this;
    var subPos = this.state.subPos;
    var preventActions = [delegation_1.Action.ViewResult, delegation_1.Action.ExportResult];
    var contextMenu = (React.createElement("ul", {
      className: "context-menu",
      style: {
        left: x,
        top: y
      },
      ref: this._self,
      onClick: this.onULClick,
      onContextMenu: this.stopEmit
    }, items.map(function(m, idx) {
      var itemClass = (0, classnames_1.default)({
        "context-menu-item": true,
        "context-menu-sub": !!m.subMenu,
        disabled: !!m.disabled,
      });
      var menuList = [];
      if (m.subMenu) {
        for (var i = 0; i < m.subMenu; i++) {
          menuList.push({
            name: "".concat(m.name, " ").concat(i + 1),
            icon: m.icon,
            action: m.action,
            category: m.category,
            shortcut: m.shortcut,
            subMenu: i,
          });
        }
      }
      var separator = null;
      if (idx > 0 && items[idx].group !== items[idx - 1].group) {
        separator = React.createElement("li", {
          className: "context-menu-item separator"
        });
      }
      var isPreventAction = preventActions.includes(m.action);
      return (React.createElement(React.Fragment, {
          key: m.action
        },
        separator,
        React.createElement("li", {
            className: itemClass,
            key: m.action,
            onClick: function(event) {
              return !isPreventAction &&
                _this.onItemClick(event, m.action, m.subMenu);
            }
          },
          React.createElement("i", {
            className: "icon icon-".concat(m.icon)
          }),
          React.createElement("span", {
            className: "item-name"
          }, m.name),
          React.createElement("span", {
              className: "shortcut"
            },
            React.createElement("i", null, m.shortcut)),
          m.subMenu ?
          _this.renderSubItems(menuList, "".concat(subPos, "-").concat(m.subPos), m.action) :
          null)));
    })));
    return ReactDOM.createPortal(contextMenu, this._container);
  };
  ContextMenu.prototype.render = function() {
    var _a = this.state,
      renderItems = _a.renderItems,
      positionX = _a.positionX,
      positionY = _a.positionY;
    return this.renderItems(renderItems, positionX, positionY);
  };
  return ContextMenu;
}(React.Component));
exports.ContextMenu = ContextMenu;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9jb250ZXh0bWVudS50c3guanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jb250ZXh0bWVudS50c3g/M2JiZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCAqIGFzIFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcbmltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgeyBnZXQgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgR3JhcGggZnJvbSBcIkAvY29yZS9ncmFwaFwiO1xuaW1wb3J0IElOb2RlIGZyb20gXCJAL2NvcmUvbm9kZVwiO1xuaW1wb3J0ICogYXMgZG9tIGZyb20gXCJAL3V0aWxzL2RvbVwiO1xuaW1wb3J0IHsgZmlsdGVyQ29udGV4dE1lbnUsIGhhbmRsZVJlYWRPbmx5IH0gZnJvbSBcIkAvdXRpbHMvb3RoZXJzXCI7XG5pbXBvcnQgVXNlckFnZW50IGZyb20gXCJAL3V0aWxzL3VhXCI7XG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvbkV2ZW50LCBBY3Rpb25UeXBlIH0gZnJvbSBcIi4vZGVsZWdhdGlvblwiO1xuXG5sZXQgY3RybEtleSA9IFwiQ3RybFwiO1xuXG5pZiAoVXNlckFnZW50LklTX01BQykge1xuICBjdHJsS2V5ID0gXCLijJhcIjtcbn1cblxuZW51bSBNZW51Q2F0ZWdvcnkge1xuICBOb2RlID0gMSxcbiAgTGluayA9IDEgPDwgMSxcbiAgQmxhbmsgPSAxIDw8IDIsXG4gIFBvcnQgPSAxIDw8IDMsXG59XG5cbmV4cG9ydCB0eXBlIE1lbnUgPSB7XG4gIGljb246IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBzaG9ydGN1dDogc3RyaW5nO1xuICBhY3Rpb246IEFjdGlvbjtcbiAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeTtcbiAgc3ViTWVudT86IG51bWJlcjtcbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICBzdWJQb3M/OiBzdHJpbmc7XG4gIGdyb3VwPzogbnVtYmVyO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0UHJvcHMge1xuICBpdGVtcz86IEFycmF5PE1lbnU+O1xuICBncmFwaDogR3JhcGg7XG4gIHJlYWRvbmx5PzogYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIG9uSXRlbUNsaWNrOiAoXG4gICAgdGFyZ2V0OiBzdHJpbmcsXG4gICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZSxcbiAgICBhY3Rpb246IEFjdGlvbixcbiAgICBzdWJNZW51OiBudW1iZXJcbiAgKSA9PiB2b2lkO1xufVxuXG5pbnRlcmZhY2UgQ29udGV4dFN0YXRlIHtcbiAgcG9zaXRpb25YOiBudW1iZXI7XG4gIHBvc2l0aW9uWTogbnVtYmVyO1xuICBwYXlsb2FkOiBhbnk7XG4gIHJlbmRlckl0ZW1zOiBNZW51W107XG4gIHN1YlBvczogc3RyaW5nO1xuICByZWFkb25seTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PENvbnRleHRQcm9wcywgQ29udGV4dFN0YXRlPiB7XG4gIF9zZWxmOiBSZWFjdC5SZWZPYmplY3Q8SFRNTFVMaXN0RWxlbWVudD4gPSBSZWFjdC5jcmVhdGVSZWYoKTtcbiAgX2NvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gIHZpc2libGUgPSBmYWxzZTtcbiAgcGFkZGluZyA9IDE1O1xuICBpdGVtczogTWVudVtdID0gW1xuICAgIHtcbiAgICAgIG5hbWU6IFwicmVuYW1lXCIsXG4gICAgICBpY29uOiBcInBlbmNpbDJcIixcbiAgICAgIHNob3J0Y3V0OiBcIlwiLFxuICAgICAgYWN0aW9uOiBBY3Rpb24uUmVuYW1lLFxuICAgICAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeS5Ob2RlLFxuICAgICAgZ3JvdXA6IDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiBcImNvcHlcIixcbiAgICAgIGljb246IFwiY29weVwiLFxuICAgICAgc2hvcnRjdXQ6IGAke2N0cmxLZXl9ICsgQ2AsXG4gICAgICBhY3Rpb246IEFjdGlvbi5Db3B5LFxuICAgICAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeS5Ob2RlLFxuICAgICAgZ3JvdXA6IDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiBcImNvcHkgc2VsZWN0ZWRcIixcbiAgICAgIGljb246IFwiY29weVwiLFxuICAgICAgc2hvcnRjdXQ6IGAke2N0cmxLZXl9ICsgQ2AsXG4gICAgICBhY3Rpb246IEFjdGlvbi5Db3B5LFxuICAgICAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeS5CbGFuayxcbiAgICAgIGdyb3VwOiAwLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogXCJkZWxldGVcIixcbiAgICAgIGljb246IFwiYmluXCIsXG4gICAgICBzaG9ydGN1dDogXCJEZWxldGVcIixcbiAgICAgIGFjdGlvbjogQWN0aW9uLkRlbGV0ZSxcbiAgICAgIGNhdGVnb3J5OiBNZW51Q2F0ZWdvcnkuTm9kZSB8IE1lbnVDYXRlZ29yeS5MaW5rLFxuICAgICAgZ3JvdXA6IDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiBcImRlbGV0ZSBzZWxlY3RlZFwiLFxuICAgICAgaWNvbjogXCJiaW5cIixcbiAgICAgIHNob3J0Y3V0OiBcIkRlbGV0ZVwiLFxuICAgICAgYWN0aW9uOiBBY3Rpb24uRGVsZXRlLFxuICAgICAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeS5CbGFuayxcbiAgICAgIGdyb3VwOiAwLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiBcInBhc3RlXCIsXG4gICAgICBpY29uOiBcInBhc3RlXCIsXG4gICAgICBzaG9ydGN1dDogYCR7Y3RybEtleX0gKyBWYCxcbiAgICAgIGFjdGlvbjogQWN0aW9uLlBhc3RlLFxuICAgICAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeS5CbGFuayxcbiAgICAgIGdyb3VwOiAwLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogXCJ1bmRvXCIsXG4gICAgICBpY29uOiBcInVuZG9cIixcbiAgICAgIHNob3J0Y3V0OiBgJHtjdHJsS2V5fSArIFpgLFxuICAgICAgYWN0aW9uOiBBY3Rpb24uVW5kbyxcbiAgICAgIGNhdGVnb3J5OiBNZW51Q2F0ZWdvcnkuQmxhbmssXG4gICAgICBncm91cDogMCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwicmVkb1wiLFxuICAgICAgaWNvbjogXCJyZWRvXCIsXG4gICAgICBzaG9ydGN1dDogYCR7Y3RybEtleX0gKyBTaGlmdCArIFpgLFxuICAgICAgYWN0aW9uOiBBY3Rpb24uUmVkbyxcbiAgICAgIGNhdGVnb3J5OiBNZW51Q2F0ZWdvcnkuQmxhbmssXG4gICAgICBncm91cDogMCxcbiAgICB9LFxuXG4gICAgLypcbiAgICB7XG4gICAgICBuYW1lOiBcIumihOiniOaVsOaNrlwiLFxuICAgICAgaWNvbjogXCJleWVcIixcbiAgICAgIHNob3J0Y3V0OiBcIlwiLFxuICAgICAgYWN0aW9uOiBBY3Rpb24uUHJldmlldyxcbiAgICAgIGNhdGVnb3J5OiBNZW51Q2F0ZWdvcnkuTm9kZSxcbiAgICAgIGdyb3VwOiAxLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogXCLliJvlu7rmqKHlnotcIixcbiAgICAgIGljb246IFwibW9kZWxcIixcbiAgICAgIHNob3J0Y3V0OiBcIlwiLFxuICAgICAgYWN0aW9uOiBBY3Rpb24uQ3JlYXRlTW9kZWwsXG4gICAgICBjYXRlZ29yeTogTWVudUNhdGVnb3J5Lk5vZGUsXG4gICAgICBncm91cDogMSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwi5p+l55yL57uT5p6cXCIsXG4gICAgICBpY29uOiBcImV5ZVwiLFxuICAgICAgc2hvcnRjdXQ6IFwiXCIsXG4gICAgICBhY3Rpb246IEFjdGlvbi5WaWV3UmVzdWx0LFxuICAgICAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeS5Ob2RlLFxuICAgICAgc3ViTWVudTogMCxcbiAgICAgIHN1YlBvczogXCJ0b3BcIixcbiAgICAgIGdyb3VwOiAxLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogXCLmn6XnnIvml6Xlv5dcIixcbiAgICAgIGljb246IFwiZmlsZS10ZXh0XCIsXG4gICAgICBzaG9ydGN1dDogXCJcIixcbiAgICAgIGFjdGlvbjogQWN0aW9uLlZpZXdMb2csXG4gICAgICBjYXRlZ29yeTogTWVudUNhdGVnb3J5Lk5vZGUsXG4gICAgICBncm91cDogMSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwi5a+85Ye657uT5p6cXCIsXG4gICAgICBpY29uOiBcImRvd25sb2FkXCIsXG4gICAgICBzaG9ydGN1dDogXCJcIixcbiAgICAgIGFjdGlvbjogQWN0aW9uLkV4cG9ydFJlc3VsdCxcbiAgICAgIGNhdGVnb3J5OiBNZW51Q2F0ZWdvcnkuTm9kZSxcbiAgICAgIHN1Yk1lbnU6IDAsXG4gICAgICBzdWJQb3M6IFwiYm90dG9tXCIsXG4gICAgICBncm91cDogMSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwi5L+d5a2Y5a6e6aqMXCIsXG4gICAgICBpY29uOiBcImZsb3BweS1kaXNrXCIsXG4gICAgICBzaG9ydGN1dDogYCR7Y3RybEtleX0gKyBTYCxcbiAgICAgIGFjdGlvbjogQWN0aW9uLlNhdmUsXG4gICAgICBjYXRlZ29yeTogTWVudUNhdGVnb3J5LkJsYW5rLFxuICAgICAgZ3JvdXA6IDEsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiBcIuWunumqjOWPpuWtmOS4ulwiLFxuICAgICAgaWNvbjogXCJkcml2ZVwiLFxuICAgICAgc2hvcnRjdXQ6IGAke2N0cmxLZXl9ICsgU2hpZnQgKyBTYCxcbiAgICAgIGFjdGlvbjogQWN0aW9uLlNhdmVBcyxcbiAgICAgIGNhdGVnb3J5OiBNZW51Q2F0ZWdvcnkuQmxhbmssXG4gICAgICBncm91cDogMSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwi5LuO6IqC54K55byA5aeL6L+Q6KGMXCIsXG4gICAgICBpY29uOiBcInBsYXkyXCIsXG4gICAgICBzaG9ydGN1dDogXCJcIixcbiAgICAgIGFjdGlvbjogQWN0aW9uLlJ1bkZyb21Ob2RlLFxuICAgICAgY2F0ZWdvcnk6IE1lbnVDYXRlZ29yeS5Ob2RlLFxuICAgICAgZ3JvdXA6IDIsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiBcIuaJp+ihjOWIsOivpeiKgueCuVwiLFxuICAgICAgaWNvbjogXCJuZXh0XCIsXG4gICAgICBzaG9ydGN1dDogXCJcIixcbiAgICAgIGFjdGlvbjogQWN0aW9uLlJ1blRvTm9kZSxcbiAgICAgIGNhdGVnb3J5OiBNZW51Q2F0ZWdvcnkuTm9kZSxcbiAgICAgIGdyb3VwOiAyLFxuICAgIH0sXG4gICAgKi9cbiAgXTtcbiAgY29uc3RydWN0b3IocHJvcHM6IENvbnRleHRQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcG9zaXRpb25YOiAwLFxuICAgICAgcG9zaXRpb25ZOiAwLFxuICAgICAgcGF5bG9hZDoge30sXG4gICAgICByZW5kZXJJdGVtczogW10sXG4gICAgICBzdWJQb3M6IFwicmlnaHRcIixcbiAgICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgICB9O1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5fY29udGFpbmVyLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgdGhpcy5fY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJjb250ZXh0LW1lbnUtbGF5ZXJcIik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLl9jb250YWluZXIpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNvbnRhaW5lckNsaWNrKTtcbiAgICB0aGlzLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIHRoaXMub25Db250YWluZXJDb250ZXh0KTtcbiAgICB0aGlzLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLnN0b3BFbWl0KTtcbiAgICBjb25zdCB7IGdyYXBoIH0gPSB0aGlzLnByb3BzO1xuICAgIGdyYXBoLnB1YnN1Yi5zdWJzY3JpYmUoQWN0aW9uLkNvbnRleHRNZW51LnRvU3RyaW5nKCksIHRoaXMub25Db250ZXh0TWVudSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgdGhpcy5fY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ29udGFpbmVyQ2xpY2spO1xuICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgdGhpcy5vbkNvbnRhaW5lckNvbnRleHQpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuc3RvcEVtaXQpO1xuICB9XG4gIG9uQ29udGV4dE1lbnUgPSAodG9waWM6IHN0cmluZywgcGF5bG9hZDogYW55KSA9PiB7XG4gICAgY29uc3QgeyByZWFkb25seSB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgeyBzdWJQb3MgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgZXZlbnQ6IE1vdXNlRXZlbnQgPSBnZXQocGF5bG9hZCwgXCJldmVudFwiKSBhcyBNb3VzZUV2ZW50O1xuICAgIGNvbnN0IGFjdGlvbkV2ZW50OiBBY3Rpb25FdmVudCA9IGdldChwYXlsb2FkLCBcImFjdGlvbkV2ZW50XCIpIGFzIEFjdGlvbkV2ZW50O1xuICAgIGxldCByZW5kZXJJdGVtczogTWVudVtdID0gdGhpcy5pdGVtcztcbiAgICBpZiAoYWN0aW9uRXZlbnQudHlwZSA9PT0gQWN0aW9uVHlwZS5CbGFuaykge1xuICAgICAgcmVuZGVySXRlbXMgPSBoYW5kbGVSZWFkT25seShyZW5kZXJJdGVtcywgcmVhZG9ubHkpO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uRXZlbnQudHlwZSA9PT0gQWN0aW9uVHlwZS5MaW5rKSB7XG4gICAgICByZW5kZXJJdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKFxuICAgICAgICAoaXRlbTogTWVudSkgPT4gaXRlbS5jYXRlZ29yeSAmIE1lbnVDYXRlZ29yeS5MaW5rXG4gICAgICApO1xuICAgICAgcmVuZGVySXRlbXMgPSBoYW5kbGVSZWFkT25seShyZW5kZXJJdGVtcywgcmVhZG9ubHkpO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uRXZlbnQudHlwZSA9PT0gQWN0aW9uVHlwZS5Ob2RlKSB7XG4gICAgICBjb25zdCBub2RlOiBJTm9kZSA9IHRoaXMucHJvcHMuZ3JhcGguZ2V0Tm9kZShhY3Rpb25FdmVudC50YXJnZXQpO1xuICAgICAgY29uc3Qgc3ViTWVudTogbnVtYmVyID0gbm9kZS5vdXRQb3J0cy5sZW5ndGg7XG4gICAgICByZW5kZXJJdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKFxuICAgICAgICAoaXRlbTogTWVudSkgPT4gaXRlbS5jYXRlZ29yeSAmIE1lbnVDYXRlZ29yeS5Ob2RlXG4gICAgICApO1xuICAgICAgcmVuZGVySXRlbXMgPSBmaWx0ZXJDb250ZXh0TWVudShyZW5kZXJJdGVtcywgbm9kZSwgcmVhZG9ubHkpO1xuICAgICAgcmVuZGVySXRlbXMubWFwKChtOiBNZW51KSA9PiB7XG4gICAgICAgIGlmIChtLmFjdGlvbiA9PT0gQWN0aW9uLlZpZXdSZXN1bHQpIHtcbiAgICAgICAgICBtLnN1Yk1lbnUgPSBzdWJNZW51O1xuICAgICAgICB9XG4gICAgICAgIGlmIChtLmFjdGlvbiA9PT0gQWN0aW9uLkV4cG9ydFJlc3VsdCkge1xuICAgICAgICAgIG0uc3ViTWVudSA9IHN1Yk1lbnU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYWN0aW9uRXZlbnQudHlwZSA9PT0gQWN0aW9uVHlwZS5CbGFuaykge1xuICAgICAgcmVuZGVySXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcihcbiAgICAgICAgKGl0ZW06IE1lbnUpID0+IGl0ZW0uY2F0ZWdvcnkgJiBNZW51Q2F0ZWdvcnkuQmxhbmtcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChhY3Rpb25FdmVudC50eXBlID09PSBBY3Rpb25UeXBlLlBvcnQpIHtcbiAgICAgIHJlbmRlckl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoXG4gICAgICAgIChpdGVtOiBNZW51KSA9PiBpdGVtLmNhdGVnb3J5ICYgTWVudUNhdGVnb3J5LlBvcnRcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChyZW5kZXJJdGVtcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG4gICAgaWYgKHRoaXMuX3NlbGYuY3VycmVudCkge1xuICAgICAgY29uc3Qgd2luZG93V2lkdGg6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgY29uc3Qgd2luZG93SGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICBjb25zdCBiYm94OiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0gPSB7XG4gICAgICAgIHdpZHRoOiAyMDAsXG4gICAgICAgIGhlaWdodDogMTAgKyByZW5kZXJJdGVtcy5sZW5ndGggKiAyNixcbiAgICAgIH07XG4gICAgICBjb25zdCBvZmZzZXRYOiBudW1iZXIgPVxuICAgICAgICBldmVudC5jbGllbnRYICsgYmJveC53aWR0aCArIHRoaXMucGFkZGluZyA8PSB3aW5kb3dXaWR0aFxuICAgICAgICAgID8gZXZlbnQuY2xpZW50WFxuICAgICAgICAgIDogZXZlbnQuY2xpZW50WCAtIGJib3gud2lkdGg7XG4gICAgICBjb25zdCBvZmZzZXRZOiBudW1iZXIgPVxuICAgICAgICBldmVudC5jbGllbnRZICsgYmJveC5oZWlnaHQgKyB0aGlzLnBhZGRpbmcgPD0gd2luZG93SGVpZ2h0XG4gICAgICAgICAgPyBldmVudC5jbGllbnRZXG4gICAgICAgICAgOiBldmVudC5jbGllbnRZIC0gYmJveC5oZWlnaHQ7XG4gICAgICBpZiAoZXZlbnQuY2xpZW50WCArIGJib3gud2lkdGggKyAxODAgKyB0aGlzLnBhZGRpbmcgPD0gd2luZG93V2lkdGgpIHtcbiAgICAgICAgc3ViUG9zID0gXCJyaWdodFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3ViUG9zID0gXCJsZWZ0XCI7XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcG9zaXRpb25YOiBvZmZzZXRYLFxuICAgICAgICBwb3NpdGlvblk6IG9mZnNldFksXG4gICAgICAgIHBheWxvYWQsXG4gICAgICAgIHJlbmRlckl0ZW1zLFxuICAgICAgICBzdWJQb3MsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHBvc2l0aW9uWDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgcG9zaXRpb25ZOiBldmVudC5jbGllbnRZLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICByZW5kZXJJdGVtcyxcbiAgICAgICAgc3ViUG9zOiBcInJpZ2h0XCIsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIG9uVUxDbGljayA9IChldmVudDogUmVhY3QuU3ludGhldGljRXZlbnQ8SFRNTEVsZW1lbnQsIE1vdXNlRXZlbnQ+KSA9PiB7XG4gICAgdGhpcy5zdG9wRW1pdChldmVudCk7XG4gIH07XG4gIG9uSXRlbUNsaWNrID0gKFxuICAgIGV2ZW50OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudCwgTW91c2VFdmVudD4sXG4gICAgYWN0aW9uOiBBY3Rpb24sXG4gICAgc3ViTWVudTogbnVtYmVyXG4gICkgPT4ge1xuICAgIHRoaXMuc3RvcEVtaXQoZXZlbnQpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgcG9zaXRpb25YOiAwLCBwb3NpdGlvblk6IDAgfSk7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGFjdGlvbkV2ZW50OiBBY3Rpb25FdmVudCA9IGdldChwYXlsb2FkLCBcImFjdGlvbkV2ZW50XCIpIGFzIEFjdGlvbkV2ZW50O1xuICAgIHRoaXMucHJvcHMub25JdGVtQ2xpY2soXG4gICAgICBhY3Rpb25FdmVudC50YXJnZXQsXG4gICAgICBhY3Rpb25FdmVudC50eXBlLFxuICAgICAgYWN0aW9uLFxuICAgICAgc3ViTWVudVxuICAgICk7XG4gIH07XG4gIG9uQ29udGFpbmVyQ2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgcG9zaXRpb25YOiAwLCBwb3NpdGlvblk6IDAgfSk7XG4gIH07XG4gIG9uQ29udGFpbmVyQ29udGV4dCA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5fc2VsZiAmJlxuICAgICAgZG9tLmNvbnRhaW5zRWxlbWVudCh0aGlzLl9zZWxmLmN1cnJlbnQsIGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudClcbiAgICApIHtcbiAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBvc2l0aW9uWDogMCwgcG9zaXRpb25ZOiAwIH0pO1xuICAgIH1cbiAgfTtcbiAgc3RvcEVtaXQgPSAoXG4gICAgZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY0V2ZW50PEhUTUxFbGVtZW50LCBNb3VzZUV2ZW50PiB8IE1vdXNlRXZlbnRcbiAgKSA9PiB7XG4gICAgLy8g6YG/5YWN5Y+z6ZSu54K55Ye76IqC54K55Ye6546w55qE5LiA5LiqYnVn77yM5Y+z6ZSu54K55Ye75YWI5Ye65YWI6IqC54K56I+c5Y2V77yM54S25ZCO5Y+I5Ye6546w5Zu+6I+c5Y2VXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfTtcbiAgcmVuZGVyU3ViSXRlbXMoXG4gICAgaXRlbXM6IE1lbnVbXSxcbiAgICBjbGFzc05hbWU6IHN0cmluZyxcbiAgICBhY3Rpb246IEFjdGlvblxuICApOiBSZWFjdC5SZWFjdE5vZGUge1xuICAgIGNvbnN0IHN1YkNsYXNzID0gY2xhc3NOYW1lcyh7XG4gICAgICBcImNvbnRleHQtbWVudVwiOiB0cnVlLFxuICAgICAgW2NsYXNzTmFtZV06IHRydWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDx1bCBjbGFzc05hbWU9e3N1YkNsYXNzfSBrZXk9e2Ake2FjdGlvbn0tc3VibWVudWB9PlxuICAgICAgICB7aXRlbXMubWFwKChtOiBNZW51KSA9PiAoXG4gICAgICAgICAgPGxpXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJjb250ZXh0LW1lbnUtaXRlbVwiXG4gICAgICAgICAgICBrZXk9e2Ake20uYWN0aW9ufS0ke20uc3ViTWVudX1gfVxuICAgICAgICAgICAgb25DbGljaz17KGV2ZW50OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudCwgTW91c2VFdmVudD4pID0+XG4gICAgICAgICAgICAgIHRoaXMub25JdGVtQ2xpY2soZXZlbnQsIG0uYWN0aW9uLCBtLnN1Yk1lbnUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPXtgaWNvbiBpY29uLSR7bS5pY29ufWB9IC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpdGVtLW5hbWVcIj57bS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNob3J0Y3V0XCI+XG4gICAgICAgICAgICAgIDxpPnttLnNob3J0Y3V0fTwvaT5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICApKX1cbiAgICAgIDwvdWw+XG4gICAgKTtcbiAgfVxuICByZW5kZXJJdGVtcyhcbiAgICBpdGVtczogTWVudVtdLFxuICAgIHg6IG51bWJlciB8IHN0cmluZyxcbiAgICB5OiBudW1iZXIgfCBzdHJpbmdcbiAgKTogUmVhY3QuUmVhY3ROb2RlIHtcbiAgICBjb25zdCB7IHN1YlBvcyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBwcmV2ZW50QWN0aW9ucyA9IFtBY3Rpb24uVmlld1Jlc3VsdCwgQWN0aW9uLkV4cG9ydFJlc3VsdF07XG4gICAgY29uc3QgY29udGV4dE1lbnU6IFJlYWN0LlJlYWN0Tm9kZSA9IChcbiAgICAgIDx1bFxuICAgICAgICBjbGFzc05hbWU9XCJjb250ZXh0LW1lbnVcIlxuICAgICAgICBzdHlsZT17eyBsZWZ0OiB4LCB0b3A6IHkgfX1cbiAgICAgICAgcmVmPXt0aGlzLl9zZWxmfVxuICAgICAgICBvbkNsaWNrPXt0aGlzLm9uVUxDbGlja31cbiAgICAgICAgb25Db250ZXh0TWVudT17dGhpcy5zdG9wRW1pdH1cbiAgICAgID5cbiAgICAgICAge2l0ZW1zLm1hcCgobTogTWVudSwgaWR4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICBjb25zdCBpdGVtQ2xhc3MgPSBjbGFzc05hbWVzKHtcbiAgICAgICAgICAgIFwiY29udGV4dC1tZW51LWl0ZW1cIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiY29udGV4dC1tZW51LXN1YlwiOiAhIW0uc3ViTWVudSxcbiAgICAgICAgICAgIGRpc2FibGVkOiAhIW0uZGlzYWJsZWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgbWVudUxpc3Q6IE1lbnVbXSA9IFtdO1xuICAgICAgICAgIGlmIChtLnN1Yk1lbnUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbS5zdWJNZW51OyBpKyspIHtcbiAgICAgICAgICAgICAgbWVudUxpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogYCR7bS5uYW1lfSAke2kgKyAxfWAsXG4gICAgICAgICAgICAgICAgaWNvbjogbS5pY29uLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogbS5hY3Rpb24sXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IG0uY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgc2hvcnRjdXQ6IG0uc2hvcnRjdXQsXG4gICAgICAgICAgICAgICAgc3ViTWVudTogaSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBzZXBhcmF0b3I6IFJlYWN0LlJlYWN0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgaWYgKGlkeCA+IDAgJiYgaXRlbXNbaWR4XS5ncm91cCAhPT0gaXRlbXNbaWR4IC0gMV0uZ3JvdXApIHtcbiAgICAgICAgICAgIHNlcGFyYXRvciA9IDxsaSBjbGFzc05hbWU9XCJjb250ZXh0LW1lbnUtaXRlbSBzZXBhcmF0b3JcIiAvPjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpc1ByZXZlbnRBY3Rpb24gPSBwcmV2ZW50QWN0aW9ucy5pbmNsdWRlcyhtLmFjdGlvbik7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50IGtleT17bS5hY3Rpb259PlxuICAgICAgICAgICAgICB7c2VwYXJhdG9yfVxuICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2l0ZW1DbGFzc31cbiAgICAgICAgICAgICAgICBrZXk9e20uYWN0aW9ufVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhcbiAgICAgICAgICAgICAgICAgIGV2ZW50OiBSZWFjdC5TeW50aGV0aWNFdmVudDxIVE1MRWxlbWVudCwgTW91c2VFdmVudD5cbiAgICAgICAgICAgICAgICApID0+XG4gICAgICAgICAgICAgICAgICAhaXNQcmV2ZW50QWN0aW9uICYmXG4gICAgICAgICAgICAgICAgICB0aGlzLm9uSXRlbUNsaWNrKGV2ZW50LCBtLmFjdGlvbiwgbS5zdWJNZW51KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17YGljb24gaWNvbi0ke20uaWNvbn1gfSAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIml0ZW0tbmFtZVwiPnttLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNob3J0Y3V0XCI+XG4gICAgICAgICAgICAgICAgICA8aT57bS5zaG9ydGN1dH08L2k+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIHttLnN1Yk1lbnVcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJTdWJJdGVtcyhcbiAgICAgICAgICAgICAgICAgICAgICBtZW51TGlzdCxcbiAgICAgICAgICAgICAgICAgICAgICBgJHtzdWJQb3N9LSR7bS5zdWJQb3N9YCxcbiAgICAgICAgICAgICAgICAgICAgICBtLmFjdGlvblxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICA6IG51bGx9XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC91bD5cbiAgICApO1xuICAgIHJldHVybiBSZWFjdERPTS5jcmVhdGVQb3J0YWwoY29udGV4dE1lbnUsIHRoaXMuX2NvbnRhaW5lcikgYXMgYW55O1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHJlbmRlckl0ZW1zLCBwb3NpdGlvblgsIHBvc2l0aW9uWSB9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJJdGVtcyhyZW5kZXJJdGVtcywgcG9zaXRpb25YLCBwb3NpdGlvblkpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbUNBO0FBQUE7QUF1SkE7QUFBQTtBQXRKQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkVBO0FBQ0E7QUE0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE2SEE7O0FBQUE7QUFLQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFBQTtBQUtBO0FBQ0E7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFNQTtBQUNBO0FBREE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUlBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQXpaQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/components/contextmenu.tsx