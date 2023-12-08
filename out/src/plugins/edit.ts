Object.defineProperty(exports, "__esModule", {
  value: true
});
var delegation_1 = __webpack_require__( /*! @/components/delegation */ "./src/components/delegation.ts");
var Edit = /** @class */ (function() {
  function Edit(graph) {
    this._graph = graph;
  }
  Edit.prototype.undo = function() {
    var _this = this;
    var editAction = this._graph.buffer.current();
    switch (editAction.action) {
      case delegation_1.Action.Paste:
        editAction.nodes.map(function(node) {
          _this._graph.removeNode(node);
        });
        break;
      case delegation_1.Action.Delete:
        editAction.nodes.map(function(node) {
          _this._graph.addNode(node);
        });
        break;
    }
    this._graph.buffer.prev();
  };
  Edit.prototype.redo = function() {
    var _this = this;
    this._graph.buffer.next();
    var editAction = this._graph.buffer.current();
    switch (editAction.action) {
      case delegation_1.Action.Paste:
        this.addNodes(editAction.nodes);
        break;
      case delegation_1.Action.Delete:
        editAction.nodes.map(function(node) {
          _this._graph.removeNode(node);
        });
        break;
    }
  };
  Edit.prototype.removeNode = function(node) {
    if (typeof node === "string") {
      node = this._graph.getNode(node);
    }
    this._graph.removeNode(node);
    this._graph.buffer.push({
      action: delegation_1.Action.Delete,
      nodes: [node]
    });
  };
  Edit.prototype.removeNodes = function(nodes) {
    var _this = this;
    nodes.map(function(node) {
      _this._graph.removeNode(node);
    });
    this._graph.buffer.push({
      action: delegation_1.Action.Delete,
      nodes: nodes
    });
  };
  Edit.prototype.copyNodes = function(nodes) {
    this._graph.buffer.push({
      action: delegation_1.Action.Copy,
      nodes: nodes
    });
  };
  Edit.prototype.addNodes = function(nodes) {
    var _this = this;
    nodes.map(function(node) {
      _this._graph.addNode(node);
    });
  };
  // TODO: 连续复制的时候需要能够自动增加位置, 需要能够支持在鼠标位置复制元素
  Edit.prototype.pasteNodes = function(nodes) {
    var _this = this;
    if (!nodes) {
      var edit = this._graph.buffer.pop();
      if (!edit)
        return;
      nodes = edit.nodes;
    }
    var saveNodes = [];
    // 如果节点已经被删除，则无法粘贴
    nodes.map(function(node) {
      if (!_this._graph.hasNode(node))
        return;
      var cloned = _this._graph.getNode(node).clone();
      _this._graph.addNode(cloned);
      saveNodes.push(cloned);
    });
    this._graph.buffer.push({
      action: delegation_1.Action.Paste,
      nodes: saveNodes
    });
  };
  return Edit;
}());
exports.default = Edit;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy9lZGl0LnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbnMvZWRpdC50cz81YWVmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHcmFwaCBmcm9tIFwiQC9jb3JlL2dyYXBoXCI7XG5pbXBvcnQgTm9kZSBmcm9tIFwiQC9jb3JlL25vZGVcIjtcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCJAL2NvbXBvbmVudHMvZGVsZWdhdGlvblwiO1xuXG5pbnRlcmZhY2UgRWRpdEFjdGlvbiB7XG4gIGFjdGlvbjogQWN0aW9uO1xuICBub2RlczogTm9kZVtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0IHtcbiAgcHJpdmF0ZSBfZ3JhcGg6IEdyYXBoO1xuICBjb25zdHJ1Y3RvcihncmFwaDogR3JhcGgpIHtcbiAgICB0aGlzLl9ncmFwaCA9IGdyYXBoO1xuICB9XG4gIHVuZG8oKSB7XG4gICAgY29uc3QgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiA9IHRoaXMuX2dyYXBoLmJ1ZmZlci5jdXJyZW50KCk7XG4gICAgc3dpdGNoIChlZGl0QWN0aW9uLmFjdGlvbikge1xuICAgICAgY2FzZSBBY3Rpb24uUGFzdGU6XG4gICAgICAgIGVkaXRBY3Rpb24ubm9kZXMubWFwKChub2RlOiBOb2RlKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZ3JhcGgucmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBBY3Rpb24uRGVsZXRlOlxuICAgICAgICBlZGl0QWN0aW9uLm5vZGVzLm1hcCgobm9kZTogTm9kZSkgPT4ge1xuICAgICAgICAgIHRoaXMuX2dyYXBoLmFkZE5vZGUobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5fZ3JhcGguYnVmZmVyLnByZXYoKTtcbiAgfVxuICByZWRvKCkge1xuICAgIHRoaXMuX2dyYXBoLmJ1ZmZlci5uZXh0KCk7XG4gICAgY29uc3QgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiA9IHRoaXMuX2dyYXBoLmJ1ZmZlci5jdXJyZW50KCk7XG4gICAgc3dpdGNoIChlZGl0QWN0aW9uLmFjdGlvbikge1xuICAgICAgY2FzZSBBY3Rpb24uUGFzdGU6XG4gICAgICAgIHRoaXMuYWRkTm9kZXMoZWRpdEFjdGlvbi5ub2Rlcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBBY3Rpb24uRGVsZXRlOlxuICAgICAgICBlZGl0QWN0aW9uLm5vZGVzLm1hcCgobm9kZTogTm9kZSkgPT4ge1xuICAgICAgICAgIHRoaXMuX2dyYXBoLnJlbW92ZU5vZGUobm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmVtb3ZlTm9kZShub2RlOiBzdHJpbmcgfCBOb2RlKSB7XG4gICAgaWYgKHR5cGVvZiBub2RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBub2RlID0gdGhpcy5fZ3JhcGguZ2V0Tm9kZShub2RlKTtcbiAgICB9XG4gICAgdGhpcy5fZ3JhcGgucmVtb3ZlTm9kZShub2RlKTtcbiAgICB0aGlzLl9ncmFwaC5idWZmZXIucHVzaCh7IGFjdGlvbjogQWN0aW9uLkRlbGV0ZSwgbm9kZXM6IFtub2RlXSB9KTtcbiAgfVxuICByZW1vdmVOb2Rlcyhub2RlczogTm9kZVtdKSB7XG4gICAgbm9kZXMubWFwKChub2RlOiBOb2RlKSA9PiB7XG4gICAgICB0aGlzLl9ncmFwaC5yZW1vdmVOb2RlKG5vZGUpO1xuICAgIH0pO1xuICAgIHRoaXMuX2dyYXBoLmJ1ZmZlci5wdXNoKHsgYWN0aW9uOiBBY3Rpb24uRGVsZXRlLCBub2Rlczogbm9kZXMgfSk7XG4gIH1cbiAgY29weU5vZGVzKG5vZGVzOiBOb2RlW10pIHtcbiAgICB0aGlzLl9ncmFwaC5idWZmZXIucHVzaCh7IGFjdGlvbjogQWN0aW9uLkNvcHksIG5vZGVzIH0pO1xuICB9XG4gIGFkZE5vZGVzKG5vZGVzOiBOb2RlW10pIHtcbiAgICBub2Rlcy5tYXAoKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgIHRoaXMuX2dyYXBoLmFkZE5vZGUobm9kZSk7XG4gICAgfSk7XG4gIH1cbiAgLy8gVE9ETzog6L+e57ut5aSN5Yi255qE5pe25YCZ6ZyA6KaB6IO95aSf6Ieq5Yqo5aKe5Yqg5L2N572uLCDpnIDopoHog73lpJ/mlK/mjIHlnKjpvKDmoIfkvY3nva7lpI3liLblhYPntKBcbiAgcGFzdGVOb2Rlcyhub2Rlcz86IE5vZGVbXSkge1xuICAgIGlmICghbm9kZXMpIHtcbiAgICAgIGNvbnN0IGVkaXQ6IEVkaXRBY3Rpb24gPSB0aGlzLl9ncmFwaC5idWZmZXIucG9wKCk7XG4gICAgICBpZiAoIWVkaXQpIHJldHVybjtcbiAgICAgIG5vZGVzID0gZWRpdC5ub2RlcztcbiAgICB9XG4gICAgY29uc3Qgc2F2ZU5vZGVzOiBOb2RlW10gPSBbXTtcbiAgICAvLyDlpoLmnpzoioLngrnlt7Lnu4/ooqvliKDpmaTvvIzliJnml6Dms5XnspjotLRcbiAgICBub2Rlcy5tYXAoKG5vZGU6IE5vZGUpID0+IHtcbiAgICAgIGlmICghdGhpcy5fZ3JhcGguaGFzTm9kZShub2RlKSkgcmV0dXJuO1xuICAgICAgY29uc3QgY2xvbmVkOiBOb2RlID0gdGhpcy5fZ3JhcGguZ2V0Tm9kZShub2RlKS5jbG9uZSgpO1xuICAgICAgdGhpcy5fZ3JhcGguYWRkTm9kZShjbG9uZWQpO1xuICAgICAgc2F2ZU5vZGVzLnB1c2goY2xvbmVkKTtcbiAgICB9KTtcbiAgICB0aGlzLl9ncmFwaC5idWZmZXIucHVzaCh7IGFjdGlvbjogQWN0aW9uLlBhc3RlLCBub2Rlczogc2F2ZU5vZGVzIH0pO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7O0FBRUE7QUFPQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7OyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/plugins/edit.ts