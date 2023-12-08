Object.defineProperty(exports, "__esModule", {
  value: true
});
var View = /** @class */ (function() {
  function View(graph) {
    this._offset = {
      x: 0,
      y: 0
    };
    this._graph = graph;
    this._graph.setProp("offset", this._offset);
  }
  Object.defineProperty(View.prototype, "viewBox", {
    get: function() {
      var minX = Number.POSITIVE_INFINITY;
      var maxX = Number.NEGATIVE_INFINITY;
      var minY = Number.POSITIVE_INFINITY;
      var maxY = Number.NEGATIVE_INFINITY;
      this._graph._nodesMap.forEach(function(node) {
        if (node.positionX < minX)
          minX = node.positionX;
        if (node.positionX > maxX)
          maxX = node.positionX;
        if (node.positionY < minY)
          minY = node.positionY;
        if (node.positionY > maxY)
          maxY = node.positionY;
      });
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(View.prototype, "offset", {
    get: function() {
      return this._offset;
    },
    set: function(off) {
      this._offset = off;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(View.prototype, "offsetX", {
    get: function() {
      return this._offset.x;
    },
    set: function(x) {
      this._offset.x = x;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(View.prototype, "offsetY", {
    get: function() {
      return this._offset.y;
    },
    set: function(y) {
      this._offset.y = y;
    },
    enumerable: false,
    configurable: true
  });
  return View;
}());
exports.default = View;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy92aWV3LnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbnMvdmlldy50cz82ZDYzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZpZXdCb3gsIENvb3JkaW5hdGUgfSBmcm9tIFwiQC9jb3JlL2ludGVyZmFjZVwiO1xuaW1wb3J0IEdyYXBoIGZyb20gXCJAL2NvcmUvZ3JhcGhcIjtcbmltcG9ydCBOb2RlIGZyb20gXCJAL2NvcmUvbm9kZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgcHJvdGVjdGVkIF9vZmZzZXQ6IENvb3JkaW5hdGUgPSB7IHg6IDAsIHk6IDAgfTtcbiAgcHJpdmF0ZSBfZ3JhcGg6IEdyYXBoO1xuICBjb25zdHJ1Y3RvcihncmFwaDogR3JhcGgpIHtcbiAgICB0aGlzLl9ncmFwaCA9IGdyYXBoO1xuICAgIHRoaXMuX2dyYXBoLnNldFByb3AoXCJvZmZzZXRcIiwgdGhpcy5fb2Zmc2V0KTtcbiAgfVxuICBnZXQgdmlld0JveCgpOiBWaWV3Qm94IHtcbiAgICBsZXQgbWluWDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGxldCBtYXhYOiBudW1iZXIgPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG4gICAgbGV0IG1pblk6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBsZXQgbWF4WTogbnVtYmVyID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIHRoaXMuX2dyYXBoLl9ub2Rlc01hcC5mb3JFYWNoKChub2RlOiBOb2RlKSA9PiB7XG4gICAgICBpZiAobm9kZS5wb3NpdGlvblggPCBtaW5YKSBtaW5YID0gbm9kZS5wb3NpdGlvblg7XG4gICAgICBpZiAobm9kZS5wb3NpdGlvblggPiBtYXhYKSBtYXhYID0gbm9kZS5wb3NpdGlvblg7XG4gICAgICBpZiAobm9kZS5wb3NpdGlvblkgPCBtaW5ZKSBtaW5ZID0gbm9kZS5wb3NpdGlvblk7XG4gICAgICBpZiAobm9kZS5wb3NpdGlvblkgPiBtYXhZKSBtYXhZID0gbm9kZS5wb3NpdGlvblk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG1pblgsXG4gICAgICB5OiBtaW5ZLFxuICAgICAgd2lkdGg6IG1heFggLSBtaW5YLFxuICAgICAgaGVpZ2h0OiBtYXhZIC0gbWluWSxcbiAgICB9O1xuICB9XG4gIGdldCBvZmZzZXQoKTogQ29vcmRpbmF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX29mZnNldDtcbiAgfVxuICBzZXQgb2Zmc2V0KG9mZjogQ29vcmRpbmF0ZSkge1xuICAgIHRoaXMuX29mZnNldCA9IG9mZjtcbiAgfVxuICBnZXQgb2Zmc2V0WCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQueDtcbiAgfVxuICBzZXQgb2Zmc2V0WCh4OiBudW1iZXIpIHtcbiAgICB0aGlzLl9vZmZzZXQueCA9IHg7XG4gIH1cbiAgZ2V0IG9mZnNldFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0Lnk7XG4gIH1cbiAgc2V0IG9mZnNldFkoeTogbnVtYmVyKSB7XG4gICAgdGhpcy5fb2Zmc2V0LnkgPSB5O1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7O0FBSUE7QUFHQTtBQUZBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBOzsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/plugins/view.ts