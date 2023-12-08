Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleReadOnly = exports.filterContextMenu = exports.exportOldGraphData = exports.loadOldGraphData = exports.canPortConnect = exports.hasProperty = exports.emptyImage = void 0;
var lodash_1 = __webpack_require__( /*! lodash */ "./node_modules/lodash/lodash.js");
var node_1 = __webpack_require__( /*! @/core/node */ "./src/core/node.ts");
var delegation_1 = __webpack_require__( /*! @/components/delegation */ "./src/components/delegation.ts");
var uuid_1 = __webpack_require__( /*! ./uuid */ "./src/utils/uuid.ts");
exports.emptyImage = (function() {
  var img = (new Image().src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  return img;
})();

function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
  // return obj.hasOwnProperty(prop);
}
exports.hasProperty = hasProperty;

function canPortConnect(port, targetPort) {
  if (port.attached === targetPort.attached)
    return false;
  if (port.direction === targetPort.direction)
    return false;
  return true;
  /**
  // 类型相同的节点不能连
  if (port.direction === targetPort.direction) return false;
  // 类型不同，并且不在同一个节点上
  let preCond = false;
  if (port.type === targetPort.type && port.attached !== targetPort.attached)
    preCond = true;
  if (preCond) {
    // 如果是输入口，必须保证自己没有连接过
    if (port.direction === PortDirection.IN && !port.connected) {
      return true;
    }
    // 如果是输出口，必须保证对端没有连接过
    if (port.direction === PortDirection.OUT && !targetPort.connected) {
      return true;
    }
  }
  return false;
   *
   */
}
exports.canPortConnect = canPortConnect;

function loadOldGraphData(graphData) {
  var oldData = (0, lodash_1.cloneDeep)(graphData);
  var newData = {};
  if (oldData.gViewCoords) {
    newData.gViewCoords = oldData.gViewCoords;
  } else {
    var gViewCoords = {
      x: oldData.offsetX || 0,
      y: oldData.offsetY || 0,
      scaleX: (oldData.zoom || 100) / 100,
      scaleY: (oldData.zoom || 100) / 100,
    };
    newData.gViewCoords = gViewCoords;
  }
  if (oldData.theme) {
    newData.theme = oldData.theme;
  } else {
    newData.theme = "light";
  }
  if (oldData.svgCoords) {
    newData.svgCoords = oldData.svgCoords;
  }
  newData.id = oldData.id || (0, uuid_1.uuidv4)();
  newData.nodes = (oldData.nodes || []).map(function(node) {
    node.inPorts = node.ports.filter(function(port) {
      return port.in;
    });
    node.outPorts = node.ports.filter(function(port) {
      return !port.in;
    });
    return node;
  });
  newData.links = (oldData.links || []).map(function(link) {
    return {
      id: link.id,
      source: link.source,
      sourcePort: link.sourcePort,
      target: link.target,
      targetPort: link.targetPort,
    };
  });
  return newData;
}
exports.loadOldGraphData = loadOldGraphData;

function exportOldGraphData(graphData) {
  var exportData = (0, lodash_1.cloneDeep)(graphData);
  var oldData = {};
  oldData.id = exportData.id;
  oldData.theme = exportData.theme;
  oldData.gridSize = 0;
  oldData.svgCoords = graphData.svgCoords;
  oldData.gViewCoords = graphData.gViewCoords;
  oldData.offsetX = exportData.gViewCoords.x;
  oldData.offsetY = exportData.gViewCoords.y;
  oldData.zoom = exportData.gViewCoords.scaleX * 100;
  var portMap = {};
  oldData.links = exportData.links.map(function(link) {
    link.selected = false;
    link.selectedAble = true;
    link.extras = {};
    link.points = [];
    if (portMap[link.targetPort]) {
      portMap[link.targetPort].push(link.id);
    } else {
      portMap[link.targetPort] = [link.id];
    }
    if (portMap[link.sourcePort]) {
      portMap[link.sourcePort].push(link.id);
    } else {
      portMap[link.sourcePort] = [link.id];
    }
    return link;
  });
  oldData.nodes = exportData.nodes.map(function(node) {
    node.ports = [];
    node.inPorts.map(function(port, idx) {
      port.in = true;
      port.idx = idx;
      port.links = portMap[port.id] || [];
      port.parentNode = node.id;
      node.ports.push(port);
    });
    delete node.inPorts;
    node.outPorts.map(function(port, idx) {
      port.in = false;
      port.idx = idx;
      port.links = portMap[port.id] || [];
      port.parentNode = node.id;
      node.ports.push(port);
    });
    delete node.outPorts;
    return node;
  });
  return oldData;
}
exports.exportOldGraphData = exportOldGraphData;

function filterContextMenu(menuList, node, readonly) {
  var _a = node.data,
    nodeType = _a.type,
    nodeStatus = _a.status;
  var excludeKeys = [];
  if (nodeType === "dataset") {
    excludeKeys = [
      delegation_1.Action.ViewResult,
      delegation_1.Action.ViewLog,
      delegation_1.Action.ExportResult,
      delegation_1.Action.CreateModel,
    ];
  }
  if (nodeType === "algo") {
    excludeKeys = [delegation_1.Action.Preview];
  }
  var filteredList = menuList.filter(function(menu) {
    return excludeKeys.indexOf(menu.action) < 0;
  });
  filteredList = (0, lodash_1.cloneDeep)(filteredList);
  filteredList = handleReadOnly(filteredList, readonly);
  excludeKeys = [delegation_1.Action.ViewResult, delegation_1.Action.ExportResult, delegation_1.Action.CreateModel];
  filteredList.map(function(menu) {
    if (excludeKeys.indexOf(menu.action) > -1 &&
      nodeStatus !== node_1.NodeStatus.FINISHED) {
      menu.disabled = true;
    }
  });
  // 只有输出为model的节点才可以创建模型
  var hasModel = false;
  node.outPorts.map(function(port) {
    if (port.type.indexOf("model") > -1)
      hasModel = true;
  });
  filteredList = filteredList.filter(function(menu) {
    if (menu.action === delegation_1.Action.CreateModel) {
      return hasModel;
    } else {
      return true;
    }
  });
  return filteredList;
}
exports.filterContextMenu = filterContextMenu;

function handleReadOnly(filteredList, readonly) {
  if (readonly === void 0) {
    readonly = false;
  }
  var actionKeys = [
    delegation_1.Action.Copy,
    delegation_1.Action.Delete,
    delegation_1.Action.Paste,
    delegation_1.Action.Redo,
    delegation_1.Action.Undo,
    delegation_1.Action.Rename,
    delegation_1.Action.Save,
    delegation_1.Action.RunToNode,
    delegation_1.Action.RunFromNode,
  ];
  return filteredList.map(function(menu) {
    if (readonly && actionKeys.indexOf(menu.action) > -1) {
      menu.disabled = true;
    } else {
      menu.disabled = false;
    }
    return menu;
  });
}
exports.handleReadOnly = handleReadOnly;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvb3RoZXJzLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL290aGVycy50cz83Zjg3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBJTm9kZSwgeyBOb2RlU3RhdHVzIH0gZnJvbSBcIkAvY29yZS9ub2RlXCI7XG5pbXBvcnQgUG9ydCwgeyBQb3J0RGlyZWN0aW9uIH0gZnJvbSBcIkAvY29yZS9wb3J0XCI7XG5pbXBvcnQgeyBHcmFwaEpzb24gfSBmcm9tIFwiQC9jb3JlL2dyYXBoXCI7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tIFwiQC9jb21wb25lbnRzL2RlbGVnYXRpb25cIjtcbmltcG9ydCB7IENvb3JkU3lzdGVtIH0gZnJvbSBcIi4vY29vcmQtc3lzXCI7XG5pbXBvcnQgeyB1dWlkdjQgfSBmcm9tIFwiLi91dWlkXCI7XG5cbmV4cG9ydCBjb25zdCBlbXB0eUltYWdlOiBhbnkgPSAoKCkgPT4ge1xuICBjb25zdCBpbWc6IGFueSA9IChuZXcgSW1hZ2UoKS5zcmMgPVxuICAgIFwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFJQUFBQUFBQVAvLy95SDVCQUVBQUFBQUxBQUFBQUFCQUFFQUFBSUJSQUE3XCIpO1xuICByZXR1cm4gaW1nO1xufSkoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1Byb3BlcnR5KG9iajogb2JqZWN0LCBwcm9wOiBzdHJpbmcgfCBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuICAvLyByZXR1cm4gb2JqLmhhc093blByb3BlcnR5KHByb3ApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuUG9ydENvbm5lY3QocG9ydDogUG9ydCwgdGFyZ2V0UG9ydDogUG9ydCk6IGJvb2xlYW4ge1xuICBpZiAocG9ydC5hdHRhY2hlZCA9PT0gdGFyZ2V0UG9ydC5hdHRhY2hlZCkgcmV0dXJuIGZhbHNlO1xuICBpZiAocG9ydC5kaXJlY3Rpb24gPT09IHRhcmdldFBvcnQuZGlyZWN0aW9uKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xuICAvKipcbiAgLy8g57G75Z6L55u45ZCM55qE6IqC54K55LiN6IO96L+eXG4gIGlmIChwb3J0LmRpcmVjdGlvbiA9PT0gdGFyZ2V0UG9ydC5kaXJlY3Rpb24pIHJldHVybiBmYWxzZTtcbiAgLy8g57G75Z6L5LiN5ZCM77yM5bm25LiU5LiN5Zyo5ZCM5LiA5Liq6IqC54K55LiKXG4gIGxldCBwcmVDb25kID0gZmFsc2U7XG4gIGlmIChwb3J0LnR5cGUgPT09IHRhcmdldFBvcnQudHlwZSAmJiBwb3J0LmF0dGFjaGVkICE9PSB0YXJnZXRQb3J0LmF0dGFjaGVkKVxuICAgIHByZUNvbmQgPSB0cnVlO1xuICBpZiAocHJlQ29uZCkge1xuICAgIC8vIOWmguaenOaYr+i+k+WFpeWPo++8jOW/hemhu+S/neivgeiHquW3seayoeaciei/nuaOpei/h1xuICAgIGlmIChwb3J0LmRpcmVjdGlvbiA9PT0gUG9ydERpcmVjdGlvbi5JTiAmJiAhcG9ydC5jb25uZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyDlpoLmnpzmmK/ovpPlh7rlj6PvvIzlv4Xpobvkv53or4Hlr7nnq6/msqHmnInov57mjqXov4dcbiAgICBpZiAocG9ydC5kaXJlY3Rpb24gPT09IFBvcnREaXJlY3Rpb24uT1VUICYmICF0YXJnZXRQb3J0LmNvbm5lY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbiAgICogXG4gICAqL1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE9sZEdyYXBoRGF0YShncmFwaERhdGE6IGFueSk6IEdyYXBoSnNvbiB7XG4gIGNvbnN0IG9sZERhdGE6IGFueSA9IGNsb25lRGVlcChncmFwaERhdGEpO1xuICBjb25zdCBuZXdEYXRhOiBHcmFwaEpzb24gPSB7fSBhcyBHcmFwaEpzb247XG4gIGlmIChvbGREYXRhLmdWaWV3Q29vcmRzKSB7XG4gICAgbmV3RGF0YS5nVmlld0Nvb3JkcyA9IG9sZERhdGEuZ1ZpZXdDb29yZHM7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZ1ZpZXdDb29yZHM6IENvb3JkU3lzdGVtID0ge1xuICAgICAgeDogb2xkRGF0YS5vZmZzZXRYIHx8IDAsXG4gICAgICB5OiBvbGREYXRhLm9mZnNldFkgfHwgMCxcbiAgICAgIHNjYWxlWDogKG9sZERhdGEuem9vbSB8fCAxMDApIC8gMTAwLFxuICAgICAgc2NhbGVZOiAob2xkRGF0YS56b29tIHx8IDEwMCkgLyAxMDAsXG4gICAgfTtcbiAgICBuZXdEYXRhLmdWaWV3Q29vcmRzID0gZ1ZpZXdDb29yZHM7XG4gIH1cbiAgaWYgKG9sZERhdGEudGhlbWUpIHtcbiAgICBuZXdEYXRhLnRoZW1lID0gb2xkRGF0YS50aGVtZTtcbiAgfSBlbHNlIHtcbiAgICBuZXdEYXRhLnRoZW1lID0gXCJsaWdodFwiO1xuICB9XG4gIGlmIChvbGREYXRhLnN2Z0Nvb3Jkcykge1xuICAgIG5ld0RhdGEuc3ZnQ29vcmRzID0gb2xkRGF0YS5zdmdDb29yZHM7XG4gIH1cbiAgbmV3RGF0YS5pZCA9IG9sZERhdGEuaWQgfHwgdXVpZHY0KCk7XG4gIG5ld0RhdGEubm9kZXMgPSAob2xkRGF0YS5ub2RlcyB8fCBbXSkubWFwKChub2RlOiBhbnkpID0+IHtcbiAgICBub2RlLmluUG9ydHMgPSBub2RlLnBvcnRzLmZpbHRlcigocG9ydDogYW55KSA9PiBwb3J0LmluKTtcbiAgICBub2RlLm91dFBvcnRzID0gbm9kZS5wb3J0cy5maWx0ZXIoKHBvcnQ6IGFueSkgPT4gIXBvcnQuaW4pO1xuICAgIHJldHVybiBub2RlO1xuICB9KTtcbiAgbmV3RGF0YS5saW5rcyA9IChvbGREYXRhLmxpbmtzIHx8IFtdKS5tYXAoKGxpbms6IGFueSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogbGluay5pZCxcbiAgICAgIHNvdXJjZTogbGluay5zb3VyY2UsXG4gICAgICBzb3VyY2VQb3J0OiBsaW5rLnNvdXJjZVBvcnQsXG4gICAgICB0YXJnZXQ6IGxpbmsudGFyZ2V0LFxuICAgICAgdGFyZ2V0UG9ydDogbGluay50YXJnZXRQb3J0LFxuICAgIH07XG4gIH0pO1xuICByZXR1cm4gbmV3RGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydE9sZEdyYXBoRGF0YShncmFwaERhdGE6IEdyYXBoSnNvbikge1xuICBjb25zdCBleHBvcnREYXRhOiBHcmFwaEpzb24gPSBjbG9uZURlZXAoZ3JhcGhEYXRhKTtcbiAgY29uc3Qgb2xkRGF0YTogYW55ID0ge30gYXMgYW55O1xuICBvbGREYXRhLmlkID0gZXhwb3J0RGF0YS5pZDtcbiAgb2xkRGF0YS50aGVtZSA9IGV4cG9ydERhdGEudGhlbWU7XG4gIG9sZERhdGEuZ3JpZFNpemUgPSAwO1xuICBvbGREYXRhLnN2Z0Nvb3JkcyA9IGdyYXBoRGF0YS5zdmdDb29yZHM7XG4gIG9sZERhdGEuZ1ZpZXdDb29yZHMgPSBncmFwaERhdGEuZ1ZpZXdDb29yZHM7XG4gIG9sZERhdGEub2Zmc2V0WCA9IGV4cG9ydERhdGEuZ1ZpZXdDb29yZHMueDtcbiAgb2xkRGF0YS5vZmZzZXRZID0gZXhwb3J0RGF0YS5nVmlld0Nvb3Jkcy55O1xuICBvbGREYXRhLnpvb20gPSBleHBvcnREYXRhLmdWaWV3Q29vcmRzLnNjYWxlWCAqIDEwMDtcbiAgY29uc3QgcG9ydE1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmdbXSB9ID0ge307XG4gIG9sZERhdGEubGlua3MgPSBleHBvcnREYXRhLmxpbmtzLm1hcCgobGluazogYW55KSA9PiB7XG4gICAgbGluay5zZWxlY3RlZCA9IGZhbHNlO1xuICAgIGxpbmsuc2VsZWN0ZWRBYmxlID0gdHJ1ZTtcbiAgICBsaW5rLmV4dHJhcyA9IHt9O1xuICAgIGxpbmsucG9pbnRzID0gW107XG4gICAgaWYgKHBvcnRNYXBbbGluay50YXJnZXRQb3J0XSkge1xuICAgICAgcG9ydE1hcFtsaW5rLnRhcmdldFBvcnRdLnB1c2gobGluay5pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcnRNYXBbbGluay50YXJnZXRQb3J0XSA9IFtsaW5rLmlkXTtcbiAgICB9XG4gICAgaWYgKHBvcnRNYXBbbGluay5zb3VyY2VQb3J0XSkge1xuICAgICAgcG9ydE1hcFtsaW5rLnNvdXJjZVBvcnRdLnB1c2gobGluay5pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcnRNYXBbbGluay5zb3VyY2VQb3J0XSA9IFtsaW5rLmlkXTtcbiAgICB9XG4gICAgcmV0dXJuIGxpbms7XG4gIH0pO1xuICBvbGREYXRhLm5vZGVzID0gZXhwb3J0RGF0YS5ub2Rlcy5tYXAoKG5vZGU6IGFueSkgPT4ge1xuICAgIG5vZGUucG9ydHMgPSBbXSBhcyBhbnk7XG4gICAgbm9kZS5pblBvcnRzLm1hcCgocG9ydDogYW55LCBpZHg6IG51bWJlcikgPT4ge1xuICAgICAgcG9ydC5pbiA9IHRydWU7XG4gICAgICBwb3J0LmlkeCA9IGlkeDtcbiAgICAgIHBvcnQubGlua3MgPSBwb3J0TWFwW3BvcnQuaWRdIHx8IFtdO1xuICAgICAgcG9ydC5wYXJlbnROb2RlID0gbm9kZS5pZDtcbiAgICAgIG5vZGUucG9ydHMucHVzaChwb3J0KTtcbiAgICB9KTtcbiAgICBkZWxldGUgbm9kZS5pblBvcnRzO1xuICAgIG5vZGUub3V0UG9ydHMubWFwKChwb3J0OiBhbnksIGlkeDogbnVtYmVyKSA9PiB7XG4gICAgICBwb3J0LmluID0gZmFsc2U7XG4gICAgICBwb3J0LmlkeCA9IGlkeDtcbiAgICAgIHBvcnQubGlua3MgPSBwb3J0TWFwW3BvcnQuaWRdIHx8IFtdO1xuICAgICAgcG9ydC5wYXJlbnROb2RlID0gbm9kZS5pZDtcbiAgICAgIG5vZGUucG9ydHMucHVzaChwb3J0KTtcbiAgICB9KTtcbiAgICBkZWxldGUgbm9kZS5vdXRQb3J0cztcbiAgICByZXR1cm4gbm9kZTtcbiAgfSk7XG4gIHJldHVybiBvbGREYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyQ29udGV4dE1lbnUoXG4gIG1lbnVMaXN0OiBhbnlbXSxcbiAgbm9kZTogSU5vZGUsXG4gIHJlYWRvbmx5PzogYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWRcbik6IGFueVtdIHtcbiAgY29uc3QgeyB0eXBlOiBub2RlVHlwZSwgc3RhdHVzOiBub2RlU3RhdHVzIH0gPSBub2RlLmRhdGE7XG5cbiAgbGV0IGV4Y2x1ZGVLZXlzOiBhbnlbXSA9IFtdO1xuICBpZiAobm9kZVR5cGUgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgZXhjbHVkZUtleXMgPSBbXG4gICAgICBBY3Rpb24uVmlld1Jlc3VsdCxcbiAgICAgIEFjdGlvbi5WaWV3TG9nLFxuICAgICAgQWN0aW9uLkV4cG9ydFJlc3VsdCxcbiAgICAgIEFjdGlvbi5DcmVhdGVNb2RlbCxcbiAgICBdO1xuICB9XG4gIGlmIChub2RlVHlwZSA9PT0gXCJhbGdvXCIpIHtcbiAgICBleGNsdWRlS2V5cyA9IFtBY3Rpb24uUHJldmlld107XG4gIH1cbiAgbGV0IGZpbHRlcmVkTGlzdDogYW55W10gPSBtZW51TGlzdC5maWx0ZXIoKG1lbnU6IGFueSkgPT4ge1xuICAgIHJldHVybiBleGNsdWRlS2V5cy5pbmRleE9mKG1lbnUuYWN0aW9uKSA8IDA7XG4gIH0pO1xuICBmaWx0ZXJlZExpc3QgPSBjbG9uZURlZXAoZmlsdGVyZWRMaXN0KTtcbiAgZmlsdGVyZWRMaXN0ID0gaGFuZGxlUmVhZE9ubHkoZmlsdGVyZWRMaXN0LCByZWFkb25seSk7XG4gIGV4Y2x1ZGVLZXlzID0gW0FjdGlvbi5WaWV3UmVzdWx0LCBBY3Rpb24uRXhwb3J0UmVzdWx0LCBBY3Rpb24uQ3JlYXRlTW9kZWxdO1xuICBmaWx0ZXJlZExpc3QubWFwKChtZW51OiBhbnkpID0+IHtcbiAgICBpZiAoXG4gICAgICBleGNsdWRlS2V5cy5pbmRleE9mKG1lbnUuYWN0aW9uKSA+IC0xICYmXG4gICAgICBub2RlU3RhdHVzICE9PSBOb2RlU3RhdHVzLkZJTklTSEVEXG4gICAgKSB7XG4gICAgICBtZW51LmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICAvLyDlj6rmnInovpPlh7rkuLptb2RlbOeahOiKgueCueaJjeWPr+S7peWIm+W7uuaooeWei1xuICBsZXQgaGFzTW9kZWwgPSBmYWxzZTtcbiAgbm9kZS5vdXRQb3J0cy5tYXAoKHBvcnQ6IFBvcnQpID0+IHtcbiAgICBpZiAocG9ydC50eXBlLmluZGV4T2YoXCJtb2RlbFwiKSA+IC0xKSBoYXNNb2RlbCA9IHRydWU7XG4gIH0pO1xuICBmaWx0ZXJlZExpc3QgPSBmaWx0ZXJlZExpc3QuZmlsdGVyKChtZW51OiBhbnkpID0+IHtcbiAgICBpZiAobWVudS5hY3Rpb24gPT09IEFjdGlvbi5DcmVhdGVNb2RlbCkge1xuICAgICAgcmV0dXJuIGhhc01vZGVsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVyZWRMaXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUmVhZE9ubHkoZmlsdGVyZWRMaXN0OiBhbnlbXSwgcmVhZG9ubHkgPSBmYWxzZSk6IGFueVtdIHtcbiAgY29uc3QgYWN0aW9uS2V5cyA9IFtcbiAgICBBY3Rpb24uQ29weSxcbiAgICBBY3Rpb24uRGVsZXRlLFxuICAgIEFjdGlvbi5QYXN0ZSxcbiAgICBBY3Rpb24uUmVkbyxcbiAgICBBY3Rpb24uVW5kbyxcbiAgICBBY3Rpb24uUmVuYW1lLFxuICAgIEFjdGlvbi5TYXZlLFxuICAgIEFjdGlvbi5SdW5Ub05vZGUsXG4gICAgQWN0aW9uLlJ1bkZyb21Ob2RlLFxuICBdO1xuICByZXR1cm4gZmlsdGVyZWRMaXN0Lm1hcCgobWVudTogYW55KSA9PiB7XG4gICAgaWYgKHJlYWRvbmx5ICYmIGFjdGlvbktleXMuaW5kZXhPZihtZW51LmFjdGlvbikgPiAtMSkge1xuICAgICAgbWVudS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbnUuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbnU7XG4gIH0pO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBR0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7QUFDQTtBQXhCQTtBQTBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdENBO0FBd0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsREE7QUFvREE7QUFLQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBOUNBO0FBZ0RBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwQkE7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/utils/others.ts