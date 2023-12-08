Object.defineProperty(exports, "__esModule", {
  value: true
});
var pubsub_1 = __webpack_require__( /*! @/utils/pubsub */ "./src/utils/pubsub.ts");
var buffer_1 = __webpack_require__( /*! @/utils/buffer */ "./src/utils/buffer.ts");
var uuid_1 = __webpack_require__( /*! @/utils/uuid */ "./src/utils/uuid.ts");
var node_1 = __webpack_require__( /*! ./node */ "./src/core/node.ts");
var link_1 = __webpack_require__( /*! ./link */ "./src/core/link.ts");
var Graph = /** @class */ (function() {
  function Graph(uid) {
    this.excludeKeys = {
      id: true,
      nodes: true,
      links: true,
    };
    this._plugins = {};
    this._linksMap = new Map();
    this._nodesMap = new Map();
    this.pubsub = new pubsub_1.default();
    this.buffer = new buffer_1.default();
    this._data = {
      nodes: this._nodesMap,
      links: this._linksMap,
      id: uid || (0, uuid_1.uuidv4)(),
      svgCoords: {
        x: 0,
        y: 0,
        width: 3940,
        height: 2160,
      },
      gViewCoords: {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      },
    };
  }
  Object.defineProperty(Graph.prototype, "id", {
    get: function() {
      return this._data.id;
    },
    set: function(uid) {
      this._data.id = uid;
    },
    enumerable: false,
    configurable: true
  });
  Graph.prototype.addNode = function(node) {
    if (!this.hasNode(node)) {
      this._nodesMap.set(node.id, node);
      return true;
    }
    return false;
  };
  Object.defineProperty(Graph.prototype, "fakeNode", {
    get: function() {
      return this._fakeNode;
    },
    set: function(fk) {
      this._fakeNode = fk;
    },
    enumerable: false,
    configurable: true
  });
  Graph.prototype.converFakeLinkToNormal = function(link) {
    if (!this.hasLink(link))
      return;
    // 更新源端口状态
    var snode = this.getNode(link.source);
    if (snode)
      snode.updatePort(link.sourcePort, link.id, true);
    // 更新目的端口状态
    var tnode = this.getNode(link.target);
    if (tnode)
      tnode.updatePort(link.targetPort, link.id, true);
  };
  Graph.prototype.hasNode = function(node) {
    if (typeof node === "string") {
      return this._nodesMap.has(node);
    }
    if (node instanceof node_1.default) {
      return this._nodesMap.has(node.id);
    }
  };
  Graph.prototype.removeNode = function(node) {
    var _this = this;
    if (!this.hasNode(node))
      return true;
    var toDeleteNode = this.getNode(node);
    this.links.map(function(link) {
      if (link.target === toDeleteNode.id || link.source === toDeleteNode.id) {
        _this.removeLink(link);
      }
    });
    if (typeof node === "string") {
      this._nodesMap.delete(node);
    }
    if (node instanceof node_1.default) {
      this._nodesMap.delete(node.id);
    }
  };
  Graph.prototype.removeAllNodes = function() {
    this._nodesMap = new Map();
  };
  Graph.prototype.getNode = function(node) {
    // first get fake node
    if (this.fakeNode) {
      if (typeof node === "string") {
        if (this._fakeNode.id === node)
          return this._fakeNode;
      }
      if (node instanceof node_1.default) {
        if (this._fakeNode.id === node.id)
          return this._fakeNode;
      }
    }
    if (!this.hasNode(node))
      return null;
    if (typeof node === "string") {
      return this._nodesMap.get(node);
    }
    if (node instanceof node_1.default) {
      return this._nodesMap.get(node.id);
    }
  };
  Object.defineProperty(Graph.prototype, "nodes", {
    get: function() {
      return Array.from(this._nodesMap.values());
    },
    enumerable: false,
    configurable: true
  });
  Graph.prototype.getNodesWith = function(propName, value) {
    return this.nodes.filter(function(node) {
      return node.data[propName] === value;
    });
  };
  Graph.prototype.hasLink = function(link) {
    if (typeof link === "string") {
      return this._linksMap.has(link);
    }
    if (link instanceof link_1.default) {
      return this._linksMap.has(link.id);
    }
  };
  Graph.prototype.addLink = function(link, fake) {
    if (!this.hasLink(link)) {
      this._linksMap.set(link.id, link);
      // 如果是虚拟节点则不更新端口状态
      if (fake)
        return true;
      // 更新源端口状态
      var snode = this.getNode(link.source);
      if (snode)
        snode.updatePort(link.sourcePort, link.id, true);
      // 更新目的端口状态
      var tnode = this.getNode(link.target);
      if (tnode)
        tnode.updatePort(link.targetPort, link.id, true);
      return true;
    }
    return false;
  };
  Graph.prototype.removeLink = function(link, fake) {
    if (!this.hasLink(link))
      return true;
    var toDeleteLink = this.getLink(link);
    if (typeof link === "string") {
      this._linksMap.delete(link);
    }
    if (link instanceof link_1.default) {
      this._linksMap.delete(link.id);
    }
    // 如果是虚拟节点不更新节点状态
    if (fake)
      return true;
    // 更新源端口状态
    var snode = this.getNode(toDeleteLink.source);
    if (snode)
      snode.updatePort(toDeleteLink.sourcePort, toDeleteLink.id, false);
    // 更新目的端口状态
    var tnode = this.getNode(toDeleteLink.target);
    if (tnode)
      tnode.updatePort(toDeleteLink.targetPort, toDeleteLink.id, false);
    return true;
  };
  Graph.prototype.getLink = function(link) {
    if (!this.hasLink(link))
      return null;
    if (typeof link === "string") {
      return this._linksMap.get(link);
    }
    if (link instanceof link_1.default) {
      return this._linksMap.get(link.id);
    }
  };
  Object.defineProperty(Graph.prototype, "links", {
    get: function() {
      return Array.from(this._linksMap.values());
    },
    enumerable: false,
    configurable: true
  });
  Graph.prototype.removeAllLinks = function() {
    this._linksMap = new Map();
  };
  Object.defineProperty(Graph.prototype, "data", {
    get: function() {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  Graph.prototype.setProp = function(key, value) {
    this._data[key] = value;
  };
  Graph.prototype.exportJson = function() {
    var nodes = [];
    this.nodes.map(function(node) {
      nodes.push(node.exportJson());
    });
    var links = [];
    this.links.map(function(link) {
      links.push(link.exportJson());
    });
    return {
      id: this.id,
      svgCoords: this._data.svgCoords,
      gViewCoords: this._data.gViewCoords,
      nodes: nodes,
      links: links,
      theme: this._data.theme,
    };
  };
  Graph.prototype.setData = function(data) {
    var _this = this;
    Object.keys(data).map(function(key) {
      if (_this.excludeKeys[key])
        return;
      _this._data[key] = data[key];
    });
  };
  Graph.prototype.loadData = function(data) {
    var _this = this;
    this.reset();
    this.setData(data);
    this.id = data.id;
    data.nodes.map(function(d) {
      _this.addNode(node_1.default.fromData(d));
    });
    data.links.map(function(ld) {
      _this.addLink(link_1.default.fromData(ld));
    });
    return this;
  };
  Graph.prototype.reset = function() {
    this.removeAllLinks();
    this.removeAllNodes();
    this.buffer.clear();
  };
  Graph.prototype.addPlugin = function(name, plugin) {
    this._plugins[name] = plugin;
  };
  Object.defineProperty(Graph.prototype, "plugins", {
    get: function() {
      return this._plugins;
    },
    enumerable: false,
    configurable: true
  });
  return Graph;
}());
exports.default = Graph;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29yZS9ncmFwaC50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb3JlL2dyYXBoLnRzP2IwYTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFB1YlN1YiBmcm9tIFwiQC91dGlscy9wdWJzdWJcIjtcbmltcG9ydCBBY3Rpb25CdWZmZXIgZnJvbSBcIkAvdXRpbHMvYnVmZmVyXCI7XG5pbXBvcnQgeyB1dWlkdjQgfSBmcm9tIFwiQC91dGlscy91dWlkXCI7XG5pbXBvcnQgeyBDb29yZFN5c3RlbSB9IGZyb20gXCJAL3V0aWxzL2Nvb3JkLXN5c1wiO1xuaW1wb3J0IE5vZGUsIHsgTm9kZURhdGEgfSBmcm9tIFwiLi9ub2RlXCI7XG5pbXBvcnQgTGluaywgeyBMaW5rRGF0YSB9IGZyb20gXCIuL2xpbmtcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHcmFwaERhdGEge1xuICBub2RlczogTWFwPHN0cmluZywgTm9kZT47XG4gIGxpbmtzOiBNYXA8c3RyaW5nLCBMaW5rPjtcbiAgaWQ6IHN0cmluZztcbiAgc3ZnQ29vcmRzPzogQ29vcmRTeXN0ZW07XG4gIGdWaWV3Q29vcmRzPzogQ29vcmRTeXN0ZW07XG4gIHRoZW1lPzogXCJsaWdodFwiIHwgXCJkYXJrXCI7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHcmFwaEpzb24ge1xuICBub2RlczogQXJyYXk8Tm9kZURhdGEgfCBvYmplY3Q+O1xuICBsaW5rczogQXJyYXk8TGlua0RhdGEgfCBvYmplY3Q+O1xuICBpZDogc3RyaW5nO1xuICB0aGVtZT86IFwibGlnaHRcIiB8IFwiZGFya1wiO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIHN2Z0Nvb3Jkcz86IENvb3JkU3lzdGVtO1xuICBnVmlld0Nvb3Jkcz86IENvb3JkU3lzdGVtO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZXhjbHVkZUtleXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7XG4gICAgaWQ6IHRydWUsXG4gICAgbm9kZXM6IHRydWUsXG4gICAgbGlua3M6IHRydWUsXG4gIH07XG4gIF9saW5rc01hcDogTWFwPHN0cmluZywgTGluaz47XG4gIF9ub2Rlc01hcDogTWFwPHN0cmluZywgTm9kZT47XG4gIF9kYXRhOiBHcmFwaERhdGE7XG4gIHB1YnN1YjogUHViU3ViO1xuICBidWZmZXI6IEFjdGlvbkJ1ZmZlcjtcbiAgcHJpdmF0ZSBfZmFrZU5vZGU6IE5vZGU7XG4gIHByaXZhdGUgX3BsdWdpbnM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcbiAgY29uc3RydWN0b3IodWlkPzogc3RyaW5nKSB7XG4gICAgdGhpcy5fbGlua3NNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fbm9kZXNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5wdWJzdWIgPSBuZXcgUHViU3ViKCk7XG4gICAgdGhpcy5idWZmZXIgPSBuZXcgQWN0aW9uQnVmZmVyKCk7XG4gICAgdGhpcy5fZGF0YSA9IHtcbiAgICAgIG5vZGVzOiB0aGlzLl9ub2Rlc01hcCxcbiAgICAgIGxpbmtzOiB0aGlzLl9saW5rc01hcCxcbiAgICAgIGlkOiB1aWQgfHwgdXVpZHY0KCksXG4gICAgICBzdmdDb29yZHM6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgd2lkdGg6IDM5NDAsXG4gICAgICAgIGhlaWdodDogMjE2MCxcbiAgICAgIH0sXG4gICAgICBnVmlld0Nvb3Jkczoge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICBzY2FsZVg6IDEsXG4gICAgICAgIHNjYWxlWTogMSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5pZDtcbiAgfVxuICBzZXQgaWQodWlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kYXRhLmlkID0gdWlkO1xuICB9XG4gIHB1YmxpYyBhZGROb2RlKG5vZGU6IE5vZGUpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuaGFzTm9kZShub2RlKSkge1xuICAgICAgdGhpcy5fbm9kZXNNYXAuc2V0KG5vZGUuaWQsIG5vZGUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBnZXQgZmFrZU5vZGUoKTogTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zha2VOb2RlO1xuICB9XG4gIHNldCBmYWtlTm9kZShmazogTm9kZSkge1xuICAgIHRoaXMuX2Zha2VOb2RlID0gZms7XG4gIH1cbiAgcHVibGljIGNvbnZlckZha2VMaW5rVG9Ob3JtYWwobGluazogTGluaykge1xuICAgIGlmICghdGhpcy5oYXNMaW5rKGxpbmspKSByZXR1cm47XG4gICAgLy8g5pu05paw5rqQ56uv5Y+j54q25oCBXG4gICAgY29uc3Qgc25vZGU6IE5vZGUgPSB0aGlzLmdldE5vZGUobGluay5zb3VyY2UpO1xuICAgIGlmIChzbm9kZSkgc25vZGUudXBkYXRlUG9ydChsaW5rLnNvdXJjZVBvcnQsIGxpbmsuaWQsIHRydWUpO1xuICAgIC8vIOabtOaWsOebrueahOerr+WPo+eKtuaAgVxuICAgIGNvbnN0IHRub2RlOiBOb2RlID0gdGhpcy5nZXROb2RlKGxpbmsudGFyZ2V0KTtcbiAgICBpZiAodG5vZGUpIHRub2RlLnVwZGF0ZVBvcnQobGluay50YXJnZXRQb3J0LCBsaW5rLmlkLCB0cnVlKTtcbiAgfVxuICBwdWJsaWMgaGFzTm9kZShub2RlOiBzdHJpbmcgfCBOb2RlKTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbm9kZXNNYXAuaGFzKG5vZGUpO1xuICAgIH1cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ub2Rlc01hcC5oYXMobm9kZS5pZCk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyByZW1vdmVOb2RlKG5vZGU6IHN0cmluZyB8IE5vZGUpIHtcbiAgICBpZiAoIXRoaXMuaGFzTm9kZShub2RlKSkgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgdG9EZWxldGVOb2RlOiBOb2RlID0gdGhpcy5nZXROb2RlKG5vZGUpO1xuICAgIHRoaXMubGlua3MubWFwKChsaW5rOiBMaW5rKSA9PiB7XG4gICAgICBpZiAobGluay50YXJnZXQgPT09IHRvRGVsZXRlTm9kZS5pZCB8fCBsaW5rLnNvdXJjZSA9PT0gdG9EZWxldGVOb2RlLmlkKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGluayhsaW5rKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRoaXMuX25vZGVzTWFwLmRlbGV0ZShub2RlKTtcbiAgICB9XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9ub2Rlc01hcC5kZWxldGUobm9kZS5pZCk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyByZW1vdmVBbGxOb2RlcygpIHtcbiAgICB0aGlzLl9ub2Rlc01hcCA9IG5ldyBNYXAoKTtcbiAgfVxuICBwdWJsaWMgZ2V0Tm9kZShub2RlOiBzdHJpbmcgfCBOb2RlKTogbnVsbCB8IE5vZGUge1xuICAgIC8vIGZpcnN0IGdldCBmYWtlIG5vZGVcbiAgICBpZiAodGhpcy5mYWtlTm9kZSkge1xuICAgICAgaWYgKHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGlmICh0aGlzLl9mYWtlTm9kZS5pZCA9PT0gbm9kZSkgcmV0dXJuIHRoaXMuX2Zha2VOb2RlO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgIGlmICh0aGlzLl9mYWtlTm9kZS5pZCA9PT0gbm9kZS5pZCkgcmV0dXJuIHRoaXMuX2Zha2VOb2RlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXRoaXMuaGFzTm9kZShub2RlKSkgcmV0dXJuIG51bGw7XG4gICAgaWYgKHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbm9kZXNNYXAuZ2V0KG5vZGUpO1xuICAgIH1cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ub2Rlc01hcC5nZXQobm9kZS5pZCk7XG4gICAgfVxuICB9XG4gIGdldCBub2RlcygpOiBBcnJheTxOb2RlPiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fbm9kZXNNYXAudmFsdWVzKCkpO1xuICB9XG4gIGdldE5vZGVzV2l0aChwcm9wTmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogTm9kZVtdIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5maWx0ZXIoKG5vZGU6IE5vZGUpID0+IG5vZGUuZGF0YVtwcm9wTmFtZV0gPT09IHZhbHVlKTtcbiAgfVxuICBwdWJsaWMgaGFzTGluayhsaW5rOiBzdHJpbmcgfCBMaW5rKTogYm9vbGVhbiB7XG4gICAgaWYgKHR5cGVvZiBsaW5rID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGlua3NNYXAuaGFzKGxpbmspO1xuICAgIH1cbiAgICBpZiAobGluayBpbnN0YW5jZW9mIExpbmspIHtcbiAgICAgIHJldHVybiB0aGlzLl9saW5rc01hcC5oYXMobGluay5pZCk7XG4gICAgfVxuICB9XG4gIHB1YmxpYyBhZGRMaW5rKGxpbms6IExpbmssIGZha2U/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmhhc0xpbmsobGluaykpIHtcbiAgICAgIHRoaXMuX2xpbmtzTWFwLnNldChsaW5rLmlkLCBsaW5rKTtcbiAgICAgIC8vIOWmguaenOaYr+iZmuaLn+iKgueCueWImeS4jeabtOaWsOerr+WPo+eKtuaAgVxuICAgICAgaWYgKGZha2UpIHJldHVybiB0cnVlO1xuICAgICAgLy8g5pu05paw5rqQ56uv5Y+j54q25oCBXG4gICAgICBjb25zdCBzbm9kZTogTm9kZSA9IHRoaXMuZ2V0Tm9kZShsaW5rLnNvdXJjZSk7XG4gICAgICBpZiAoc25vZGUpIHNub2RlLnVwZGF0ZVBvcnQobGluay5zb3VyY2VQb3J0LCBsaW5rLmlkLCB0cnVlKTtcbiAgICAgIC8vIOabtOaWsOebrueahOerr+WPo+eKtuaAgVxuICAgICAgY29uc3QgdG5vZGU6IE5vZGUgPSB0aGlzLmdldE5vZGUobGluay50YXJnZXQpO1xuICAgICAgaWYgKHRub2RlKSB0bm9kZS51cGRhdGVQb3J0KGxpbmsudGFyZ2V0UG9ydCwgbGluay5pZCwgdHJ1ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHB1YmxpYyByZW1vdmVMaW5rKGxpbms6IHN0cmluZyB8IExpbmssIGZha2U/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmhhc0xpbmsobGluaykpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHRvRGVsZXRlTGluazogTGluayA9IHRoaXMuZ2V0TGluayhsaW5rKTtcbiAgICBpZiAodHlwZW9mIGxpbmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRoaXMuX2xpbmtzTWFwLmRlbGV0ZShsaW5rKTtcbiAgICB9XG4gICAgaWYgKGxpbmsgaW5zdGFuY2VvZiBMaW5rKSB7XG4gICAgICB0aGlzLl9saW5rc01hcC5kZWxldGUobGluay5pZCk7XG4gICAgfVxuICAgIC8vIOWmguaenOaYr+iZmuaLn+iKgueCueS4jeabtOaWsOiKgueCueeKtuaAgVxuICAgIGlmIChmYWtlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyDmm7TmlrDmupDnq6/lj6PnirbmgIFcbiAgICBjb25zdCBzbm9kZTogTm9kZSA9IHRoaXMuZ2V0Tm9kZSh0b0RlbGV0ZUxpbmsuc291cmNlKTtcbiAgICBpZiAoc25vZGUpXG4gICAgICBzbm9kZS51cGRhdGVQb3J0KHRvRGVsZXRlTGluay5zb3VyY2VQb3J0LCB0b0RlbGV0ZUxpbmsuaWQsIGZhbHNlKTtcbiAgICAvLyDmm7TmlrDnm67nmoTnq6/lj6PnirbmgIFcbiAgICBjb25zdCB0bm9kZTogTm9kZSA9IHRoaXMuZ2V0Tm9kZSh0b0RlbGV0ZUxpbmsudGFyZ2V0KTtcbiAgICBpZiAodG5vZGUpXG4gICAgICB0bm9kZS51cGRhdGVQb3J0KHRvRGVsZXRlTGluay50YXJnZXRQb3J0LCB0b0RlbGV0ZUxpbmsuaWQsIGZhbHNlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwdWJsaWMgZ2V0TGluayhsaW5rOiBzdHJpbmcgfCBMaW5rKTogbnVsbCB8IExpbmsge1xuICAgIGlmICghdGhpcy5oYXNMaW5rKGxpbmspKSByZXR1cm4gbnVsbDtcbiAgICBpZiAodHlwZW9mIGxpbmsgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9saW5rc01hcC5nZXQobGluayk7XG4gICAgfVxuICAgIGlmIChsaW5rIGluc3RhbmNlb2YgTGluaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2xpbmtzTWFwLmdldChsaW5rLmlkKTtcbiAgICB9XG4gIH1cbiAgZ2V0IGxpbmtzKCk6IEFycmF5PExpbms+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9saW5rc01hcC52YWx1ZXMoKSk7XG4gIH1cbiAgcHVibGljIHJlbW92ZUFsbExpbmtzKCkge1xuICAgIHRoaXMuX2xpbmtzTWFwID0gbmV3IE1hcCgpO1xuICB9XG4gIGdldCBkYXRhKCk6IEdyYXBoRGF0YSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cbiAgc2V0UHJvcChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbHVlO1xuICB9XG4gIGV4cG9ydEpzb24oKTogR3JhcGhKc29uIHtcbiAgICBjb25zdCBub2RlczogQXJyYXk8b2JqZWN0PiA9IFtdO1xuICAgIHRoaXMubm9kZXMubWFwKChub2RlOiBOb2RlKSA9PiB7XG4gICAgICBub2Rlcy5wdXNoKG5vZGUuZXhwb3J0SnNvbigpKTtcbiAgICB9KTtcbiAgICBjb25zdCBsaW5rczogQXJyYXk8b2JqZWN0PiA9IFtdO1xuICAgIHRoaXMubGlua3MubWFwKChsaW5rOiBMaW5rKSA9PiB7XG4gICAgICBsaW5rcy5wdXNoKGxpbmsuZXhwb3J0SnNvbigpKTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICBzdmdDb29yZHM6IHRoaXMuX2RhdGEuc3ZnQ29vcmRzLFxuICAgICAgZ1ZpZXdDb29yZHM6IHRoaXMuX2RhdGEuZ1ZpZXdDb29yZHMsXG4gICAgICBub2RlcyxcbiAgICAgIGxpbmtzLFxuICAgICAgdGhlbWU6IHRoaXMuX2RhdGEudGhlbWUsXG4gICAgfTtcbiAgfVxuICBzZXREYXRhKGRhdGE6IEdyYXBoSnNvbikge1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLm1hcCgoa2V5KSA9PiB7XG4gICAgICBpZiAodGhpcy5leGNsdWRlS2V5c1trZXldKSByZXR1cm47XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgfSk7XG4gIH1cbiAgbG9hZERhdGEoZGF0YTogR3JhcGhKc29uKTogR3JhcGgge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnNldERhdGEoZGF0YSk7XG4gICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgZGF0YS5ub2Rlcy5tYXAoKGQ6IG9iamVjdCkgPT4ge1xuICAgICAgdGhpcy5hZGROb2RlKE5vZGUuZnJvbURhdGEoZCBhcyBOb2RlRGF0YSkpO1xuICAgIH0pO1xuICAgIGRhdGEubGlua3MubWFwKChsZDogb2JqZWN0KSA9PiB7XG4gICAgICB0aGlzLmFkZExpbmsoTGluay5mcm9tRGF0YShsZCBhcyBMaW5rRGF0YSkpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMucmVtb3ZlQWxsTGlua3MoKTtcbiAgICB0aGlzLnJlbW92ZUFsbE5vZGVzKCk7XG4gICAgdGhpcy5idWZmZXIuY2xlYXIoKTtcbiAgfVxuICBhZGRQbHVnaW4obmFtZTogc3RyaW5nLCBwbHVnaW46IGFueSkge1xuICAgIHRoaXMuX3BsdWdpbnNbbmFtZV0gPSBwbHVnaW47XG4gIH1cbiAgZ2V0IHBsdWdpbnMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgcmV0dXJuIHRoaXMuX3BsdWdpbnM7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBc0JBO0FBYUE7QUFaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFIQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBO0FBQUE7OyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/core/graph.ts