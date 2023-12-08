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
exports.NodeStatus = void 0;
var lodash_1 = __webpack_require__( /*! lodash */ "./node_modules/lodash/lodash.js");
var uuid_1 = __webpack_require__( /*! @/utils/uuid */ "./src/utils/uuid.ts");
var port_1 = __webpack_require__( /*! ./port */ "./src/core/port.ts");
var NodeStatus;
(function(NodeStatus) {
  NodeStatus["CREATED"] = "created";
  NodeStatus["RUNNING"] = "running";
  NodeStatus["FINISHED"] = "finished";
  NodeStatus["FAILED"] = "failed";
  NodeStatus["CANCELED"] = "canceled";
  NodeStatus["QUEUEING"] = "queuing";
})(NodeStatus = exports.NodeStatus || (exports.NodeStatus = {}));
var INode = /** @class */ (function() {
  function INode(uid, options) {
    this.excludeKeys = {
      id: true,
      inPorts: true,
      outPorts: true,
      progress: true,
    };
    this._inPortsMap = new Map();
    this._outPortsMap = new Map();
    this._data = __assign(__assign({
      x: 0,
      y: 0,
      width: 180,
      height: 30,
      status: NodeStatus.CREATED
    }, options), {
      id: uid || (0, uuid_1.uuidv4)(),
      inPorts: [],
      outPorts: []
    });
  }
  Object.defineProperty(INode.prototype, "data", {
    get: function() {
      return this._data;
    },
    set: function(nd) {
      this._data = nd;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(INode.prototype, "id", {
    get: function() {
      return this._data.id;
    },
    set: function(_id) {
      this._data.id = _id;
    },
    enumerable: false,
    configurable: true
  });
  INode.prototype.hasInPort = function(port) {
    if (typeof port === "string") {
      return this._inPortsMap.has(port);
    }
    if (port instanceof port_1.default) {
      return this._inPortsMap.has(port.id);
    }
    return false;
  };
  INode.prototype.addInPort = function(port) {
    if (this.hasInPort(port))
      return;
    port.attached = this.id;
    port.direction = port_1.PortDirection.IN;
    this._inPortsMap.set(port.id, port);
    this._data.inPorts.push(port.data);
  };
  INode.prototype.hasOutPort = function(port) {
    if (typeof port === "string") {
      return this._outPortsMap.has(port);
    }
    if (port instanceof port_1.default) {
      return this._outPortsMap.has(port.id);
    }
    return false;
  };
  INode.prototype.addOutPort = function(port) {
    if (this.hasOutPort(port))
      return;
    port.attached = this.id;
    port.direction = port_1.PortDirection.OUT;
    this._outPortsMap.set(port.id, port);
    this._data.outPorts.push(port.data);
  };
  Object.defineProperty(INode.prototype, "inPorts", {
    get: function() {
      return Array.from(this._inPortsMap.values());
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(INode.prototype, "outPorts", {
    get: function() {
      return Array.from(this._outPortsMap.values());
    },
    enumerable: false,
    configurable: true
  });
  INode.prototype.getPort = function(port) {
    if (this.hasInPort(port)) {
      if (typeof port === "string") {
        return this._inPortsMap.get(port);
      }
      if (port instanceof port_1.default) {
        return this._inPortsMap.get(port.id);
      }
    }
    if (this.hasOutPort(port)) {
      if (typeof port === "string") {
        return this._outPortsMap.get(port);
      }
      if (port instanceof port_1.default) {
        return this._outPortsMap.get(port.id);
      }
    }
  };
  INode.prototype.getPortOrder = function(port) {
    var pt = this.getPort(port);
    var order = -1;
    if (!pt)
      return -1;
    this.inPorts.map(function(port, idx) {
      if (port.id === pt.id) {
        order = idx;
      }
    });
    this.outPorts.map(function(port, idx) {
      if (port.id === pt.id) {
        order = idx;
      }
    });
    return order;
  };
  Object.defineProperty(INode.prototype, "positionX", {
    get: function() {
      return this._data.x;
    },
    set: function(_x) {
      this._data.x = _x;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(INode.prototype, "positionY", {
    get: function() {
      return this._data.y;
    },
    set: function(_y) {
      this._data.y = _y;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(INode.prototype, "coordinate", {
    get: function() {
      return {
        x: this.positionX,
        y: this.positionY
      };
    },
    set: function(coord) {
      this.positionX = coord.x;
      this.positionY = coord.y;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(INode.prototype, "offset", {
    set: function(offset) {
      this.positionX = this.positionX + offset.x;
      this.positionY = this.positionY + offset.y;
    },
    enumerable: false,
    configurable: true
  });
  INode.prototype.updatePort = function(portId, linkId, addLink) {
    if (addLink === void 0) {
      addLink = true;
    }
    var port = this.getPort(portId);
    if (addLink) {
      port.addLink(linkId);
    } else {
      port.removeLink(linkId);
    }
  };
  INode.prototype.clone = function(offsetX, offsetY) {
    if (offsetX === void 0) {
      offsetX = 20;
    }
    if (offsetY === void 0) {
      offsetY = 20;
    }
    var cloned = INode.from(this);
    cloned.offset = {
      x: offsetX,
      y: offsetY
    };
    return cloned;
  };
  INode.prototype.setData = function(nd, newPort) {
    var _this = this;
    if (newPort === void 0) {
      newPort = false;
    }
    Object.keys(nd).map(function(key) {
      if (_this.excludeKeys[key])
        return;
      _this._data[key] = (0, lodash_1.cloneDeep)(nd[key]);
    });
    if (nd.inPorts && nd.inPorts.length) {
      nd.inPorts.map(function(pd) {
        var port = port_1.default.fromData(pd);
        if (newPort)
          port.id = (0, uuid_1.uuidv4)();
        _this.addInPort(port);
      });
    }
    if (nd.outPorts && nd.outPorts.length) {
      nd.outPorts.map(function(pd) {
        var port = port_1.default.fromData(pd);
        if (newPort)
          port.id = (0, uuid_1.uuidv4)();
        _this.addOutPort(port);
      });
    }
  };
  INode.prototype.setProp = function(name, value) {
    this._data[name] = value;
  };
  INode.prototype.getProp = function(name) {
    return this._data[name];
  };
  INode.from = function(node) {
    var newNode = new INode();
    newNode.setData(node.data, true);
    newNode.data.status = NodeStatus.CREATED;
    return newNode;
  };
  INode.fromData = function(nodeData) {
    var newNode = new INode(nodeData.id);
    newNode.setData(nodeData);
    return newNode;
  };
  INode.prototype.exportJson = function() {
    var inPorts = this.inPorts.map(function(port) {
      return port.exportJson();
    });
    var outPorts = this.outPorts.map(function(port) {
      return port.exportJson();
    });
    return __assign(__assign({}, (0, lodash_1.cloneDeep)(this._data)), {
      inPorts: inPorts,
      outPorts: outPorts
    });
  };
  return INode;
}());
exports.default = INode;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29yZS9ub2RlLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvbm9kZS50cz8zYzMxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IHV1aWR2NCB9IGZyb20gXCJAL3V0aWxzL3V1aWRcIjtcbmltcG9ydCBQb3J0LCB7IFBvcnREYXRhLCBQb3J0RGlyZWN0aW9uIH0gZnJvbSBcIi4vcG9ydFwiO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZSB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xuXG5leHBvcnQgZW51bSBOb2RlU3RhdHVzIHtcbiAgQ1JFQVRFRCA9IFwiY3JlYXRlZFwiLFxuICBSVU5OSU5HID0gXCJydW5uaW5nXCIsXG4gIEZJTklTSEVEID0gXCJmaW5pc2hlZFwiLFxuICBGQUlMRUQgPSBcImZhaWxlZFwiLFxuICBDQU5DRUxFRCA9IFwiY2FuY2VsZWRcIixcbiAgUVVFVUVJTkcgPSBcInF1ZXVpbmdcIixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb2RlRGF0YSB7XG4gIGlkOiBzdHJpbmc7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBpblBvcnRzOiBBcnJheTxQb3J0RGF0YT47XG4gIG91dFBvcnRzOiBBcnJheTxQb3J0RGF0YT47XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBzZWxlY3RlZD86IGJvb2xlYW47XG4gIHNlbGVjdGFibGU/OiBib29sZWFuO1xuICBzZWxlY3RlZEFibGU/OiBib29sZWFuO1xuICBleHRyYXM/OiBvYmplY3Q7XG4gIGljb24/OiBzdHJpbmc7XG4gIHN0YXR1cz86IE5vZGVTdGF0dXM7XG4gIHN0YXR1c0RldGFpbD86IHN0cmluZztcbiAgcmVsYXRlSWQ/OiBudW1iZXI7XG4gIGFyZ3VtZW50Pzogb2JqZWN0O1xuICB0eXBlPzogc3RyaW5nO1xuICBzdWJ0eXBlPzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJvZ3Jlc3M/OiBudW1iZXI7XG4gIHRhZz86IHN0cmluZztcbiAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgdHlwZSBOb2RlVXBkYXRlID0ge1xuICBpZDogc3RyaW5nO1xuICBzdGF0dXM/OiBOb2RlU3RhdHVzO1xuICBzdGF0dXNEZXRhaWw/OiBzdHJpbmc7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBhcmd1bWVudD86IG9iamVjdDtcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByb2dyZXNzPzogbnVtYmVyO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJTm9kZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZXhjbHVkZUtleXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7XG4gICAgaWQ6IHRydWUsXG4gICAgaW5Qb3J0czogdHJ1ZSxcbiAgICBvdXRQb3J0czogdHJ1ZSxcbiAgICBwcm9ncmVzczogdHJ1ZSxcbiAgfTtcbiAgcHJpdmF0ZSBfZGF0YTogTm9kZURhdGE7XG4gIHByaXZhdGUgX2luUG9ydHNNYXA6IE1hcDxzdHJpbmcsIFBvcnQ+ID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIF9vdXRQb3J0c01hcDogTWFwPHN0cmluZywgUG9ydD4gPSBuZXcgTWFwKCk7XG4gIGNvbnN0cnVjdG9yKHVpZD86IHN0cmluZywgb3B0aW9ucz86IG9iamVjdCkge1xuICAgIHRoaXMuX2RhdGEgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICAgIHdpZHRoOiAxODAsXG4gICAgICBoZWlnaHQ6IDMwLFxuICAgICAgc3RhdHVzOiBOb2RlU3RhdHVzLkNSRUFURUQsXG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgaWQ6IHVpZCB8fCB1dWlkdjQoKSxcbiAgICAgIGluUG9ydHM6IFtdLFxuICAgICAgb3V0UG9ydHM6IFtdLFxuICAgIH07XG4gIH1cbiAgZ2V0IGRhdGEoKTogTm9kZURhdGEge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG4gIHNldCBkYXRhKG5kOiBOb2RlRGF0YSkge1xuICAgIHRoaXMuX2RhdGEgPSBuZDtcbiAgfVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5pZDtcbiAgfVxuICBzZXQgaWQoX2lkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kYXRhLmlkID0gX2lkO1xuICB9XG4gIGhhc0luUG9ydChwb3J0OiBzdHJpbmcgfCBQb3J0KTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiBwb3J0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gdGhpcy5faW5Qb3J0c01hcC5oYXMocG9ydCk7XG4gICAgfVxuICAgIGlmIChwb3J0IGluc3RhbmNlb2YgUG9ydCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2luUG9ydHNNYXAuaGFzKHBvcnQuaWQpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgYWRkSW5Qb3J0KHBvcnQ6IFBvcnQpIHtcbiAgICBpZiAodGhpcy5oYXNJblBvcnQocG9ydCkpIHJldHVybjtcbiAgICBwb3J0LmF0dGFjaGVkID0gdGhpcy5pZDtcbiAgICBwb3J0LmRpcmVjdGlvbiA9IFBvcnREaXJlY3Rpb24uSU47XG4gICAgdGhpcy5faW5Qb3J0c01hcC5zZXQocG9ydC5pZCwgcG9ydCk7XG4gICAgdGhpcy5fZGF0YS5pblBvcnRzLnB1c2gocG9ydC5kYXRhKTtcbiAgfVxuICBoYXNPdXRQb3J0KHBvcnQ6IHN0cmluZyB8IFBvcnQpOiBib29sZWFuIHtcbiAgICBpZiAodHlwZW9mIHBvcnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vdXRQb3J0c01hcC5oYXMocG9ydCk7XG4gICAgfVxuICAgIGlmIChwb3J0IGluc3RhbmNlb2YgUG9ydCkge1xuICAgICAgcmV0dXJuIHRoaXMuX291dFBvcnRzTWFwLmhhcyhwb3J0LmlkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGFkZE91dFBvcnQocG9ydDogUG9ydCkge1xuICAgIGlmICh0aGlzLmhhc091dFBvcnQocG9ydCkpIHJldHVybjtcbiAgICBwb3J0LmF0dGFjaGVkID0gdGhpcy5pZDtcbiAgICBwb3J0LmRpcmVjdGlvbiA9IFBvcnREaXJlY3Rpb24uT1VUO1xuICAgIHRoaXMuX291dFBvcnRzTWFwLnNldChwb3J0LmlkLCBwb3J0KTtcbiAgICB0aGlzLl9kYXRhLm91dFBvcnRzLnB1c2gocG9ydC5kYXRhKTtcbiAgfVxuICBnZXQgaW5Qb3J0cygpOiBBcnJheTxQb3J0PiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5faW5Qb3J0c01hcC52YWx1ZXMoKSk7XG4gIH1cbiAgZ2V0IG91dFBvcnRzKCk6IEFycmF5PFBvcnQ+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9vdXRQb3J0c01hcC52YWx1ZXMoKSk7XG4gIH1cbiAgZ2V0UG9ydChwb3J0OiBzdHJpbmcgfCBQb3J0KTogUG9ydCB7XG4gICAgaWYgKHRoaXMuaGFzSW5Qb3J0KHBvcnQpKSB7XG4gICAgICBpZiAodHlwZW9mIHBvcnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luUG9ydHNNYXAuZ2V0KHBvcnQpO1xuICAgICAgfVxuICAgICAgaWYgKHBvcnQgaW5zdGFuY2VvZiBQb3J0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pblBvcnRzTWFwLmdldChwb3J0LmlkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaGFzT3V0UG9ydChwb3J0KSkge1xuICAgICAgaWYgKHR5cGVvZiBwb3J0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vdXRQb3J0c01hcC5nZXQocG9ydCk7XG4gICAgICB9XG4gICAgICBpZiAocG9ydCBpbnN0YW5jZW9mIFBvcnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX291dFBvcnRzTWFwLmdldChwb3J0LmlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0UG9ydE9yZGVyKHBvcnQ6IHN0cmluZyB8IFBvcnQpOiBudW1iZXIge1xuICAgIGNvbnN0IHB0OiBQb3J0ID0gdGhpcy5nZXRQb3J0KHBvcnQpO1xuICAgIGxldCBvcmRlciA9IC0xO1xuICAgIGlmICghcHQpIHJldHVybiAtMTtcbiAgICB0aGlzLmluUG9ydHMubWFwKChwb3J0OiBQb3J0LCBpZHg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHBvcnQuaWQgPT09IHB0LmlkKSB7XG4gICAgICAgIG9yZGVyID0gaWR4O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMub3V0UG9ydHMubWFwKChwb3J0OiBQb3J0LCBpZHg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHBvcnQuaWQgPT09IHB0LmlkKSB7XG4gICAgICAgIG9yZGVyID0gaWR4O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvcmRlcjtcbiAgfVxuICBnZXQgcG9zaXRpb25YKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEueDtcbiAgfVxuICBzZXQgcG9zaXRpb25YKF94OiBudW1iZXIpIHtcbiAgICB0aGlzLl9kYXRhLnggPSBfeDtcbiAgfVxuICBnZXQgcG9zaXRpb25ZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEueTtcbiAgfVxuICBzZXQgcG9zaXRpb25ZKF95OiBudW1iZXIpIHtcbiAgICB0aGlzLl9kYXRhLnkgPSBfeTtcbiAgfVxuICBnZXQgY29vcmRpbmF0ZSgpOiBDb29yZGluYXRlIHtcbiAgICByZXR1cm4geyB4OiB0aGlzLnBvc2l0aW9uWCwgeTogdGhpcy5wb3NpdGlvblkgfTtcbiAgfVxuICBzZXQgY29vcmRpbmF0ZShjb29yZDogQ29vcmRpbmF0ZSkge1xuICAgIHRoaXMucG9zaXRpb25YID0gY29vcmQueDtcbiAgICB0aGlzLnBvc2l0aW9uWSA9IGNvb3JkLnk7XG4gIH1cbiAgc2V0IG9mZnNldChvZmZzZXQ6IENvb3JkaW5hdGUpIHtcbiAgICB0aGlzLnBvc2l0aW9uWCA9IHRoaXMucG9zaXRpb25YICsgb2Zmc2V0Lng7XG4gICAgdGhpcy5wb3NpdGlvblkgPSB0aGlzLnBvc2l0aW9uWSArIG9mZnNldC55O1xuICB9XG4gIHVwZGF0ZVBvcnQocG9ydElkOiBzdHJpbmcsIGxpbmtJZDogc3RyaW5nLCBhZGRMaW5rID0gdHJ1ZSkge1xuICAgIGNvbnN0IHBvcnQ6IFBvcnQgPSB0aGlzLmdldFBvcnQocG9ydElkKTtcbiAgICBpZiAoYWRkTGluaykge1xuICAgICAgcG9ydC5hZGRMaW5rKGxpbmtJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcnQucmVtb3ZlTGluayhsaW5rSWQpO1xuICAgIH1cbiAgfVxuICBjbG9uZShvZmZzZXRYID0gMjAsIG9mZnNldFkgPSAyMCk6IElOb2RlIHtcbiAgICBjb25zdCBjbG9uZWQ6IElOb2RlID0gSU5vZGUuZnJvbSh0aGlzKTtcbiAgICBjbG9uZWQub2Zmc2V0ID0geyB4OiBvZmZzZXRYLCB5OiBvZmZzZXRZIH07XG4gICAgcmV0dXJuIGNsb25lZDtcbiAgfVxuICBzZXREYXRhKG5kOiBOb2RlRGF0YSwgbmV3UG9ydCA9IGZhbHNlKSB7XG4gICAgT2JqZWN0LmtleXMobmQpLm1hcCgoa2V5KSA9PiB7XG4gICAgICBpZiAodGhpcy5leGNsdWRlS2V5c1trZXldKSByZXR1cm47XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBjbG9uZURlZXAobmRba2V5XSk7XG4gICAgfSk7XG4gICAgaWYgKG5kLmluUG9ydHMgJiYgbmQuaW5Qb3J0cy5sZW5ndGgpIHtcbiAgICAgIG5kLmluUG9ydHMubWFwKChwZCkgPT4ge1xuICAgICAgICBjb25zdCBwb3J0OiBQb3J0ID0gUG9ydC5mcm9tRGF0YShwZCk7XG4gICAgICAgIGlmIChuZXdQb3J0KSBwb3J0LmlkID0gdXVpZHY0KCk7XG4gICAgICAgIHRoaXMuYWRkSW5Qb3J0KHBvcnQpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChuZC5vdXRQb3J0cyAmJiBuZC5vdXRQb3J0cy5sZW5ndGgpIHtcbiAgICAgIG5kLm91dFBvcnRzLm1hcCgocGQpID0+IHtcbiAgICAgICAgY29uc3QgcG9ydDogUG9ydCA9IFBvcnQuZnJvbURhdGEocGQpO1xuICAgICAgICBpZiAobmV3UG9ydCkgcG9ydC5pZCA9IHV1aWR2NCgpO1xuICAgICAgICB0aGlzLmFkZE91dFBvcnQocG9ydCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgc2V0UHJvcChuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kYXRhW25hbWVdID0gdmFsdWU7XG4gIH1cbiAgZ2V0UHJvcChuYW1lOiBzdHJpbmcpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhW25hbWVdO1xuICB9XG4gIHN0YXRpYyBmcm9tKG5vZGU6IElOb2RlKTogSU5vZGUge1xuICAgIGNvbnN0IG5ld05vZGU6IElOb2RlID0gbmV3IElOb2RlKCk7XG4gICAgbmV3Tm9kZS5zZXREYXRhKG5vZGUuZGF0YSwgdHJ1ZSk7XG4gICAgbmV3Tm9kZS5kYXRhLnN0YXR1cyA9IE5vZGVTdGF0dXMuQ1JFQVRFRDtcbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxuICBzdGF0aWMgZnJvbURhdGEobm9kZURhdGE6IE5vZGVEYXRhKTogSU5vZGUge1xuICAgIGNvbnN0IG5ld05vZGU6IElOb2RlID0gbmV3IElOb2RlKG5vZGVEYXRhLmlkKTtcbiAgICBuZXdOb2RlLnNldERhdGEobm9kZURhdGEpO1xuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG4gIGV4cG9ydEpzb24oKTogTm9kZURhdGEge1xuICAgIGNvbnN0IGluUG9ydHM6IFBvcnREYXRhW10gPSB0aGlzLmluUG9ydHMubWFwKChwb3J0OiBQb3J0KSA9PiB7XG4gICAgICByZXR1cm4gcG9ydC5leHBvcnRKc29uKCk7XG4gICAgfSk7XG4gICAgY29uc3Qgb3V0UG9ydHM6IFBvcnREYXRhW10gPSB0aGlzLm91dFBvcnRzLm1hcCgocG9ydDogUG9ydCkgPT4ge1xuICAgICAgcmV0dXJuIHBvcnQuZXhwb3J0SnNvbigpO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jbG9uZURlZXAodGhpcy5fZGF0YSksXG4gICAgICBpblBvcnRzLFxuICAgICAgb3V0UG9ydHMsXG4gICAgfTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUdBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVDQTtBQVVBO0FBVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBV0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFKQTtBQUtBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQUE7OyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/core/node.ts