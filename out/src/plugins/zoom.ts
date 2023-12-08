Object.defineProperty(exports, "__esModule", {
  value: true
});
var Zoom = /** @class */ (function() {
  function Zoom(graph) {
    this._zoom = 1;
    this._zoomRange = [0.1, 10];
    this._graph = graph;
    this._graph.setProp("zoom", this._zoom);
  }
  Object.defineProperty(Zoom.prototype, "zoom", {
    get: function() {
      return this._zoom;
    },
    set: function(n) {
      if (n < this._zoomRange[0]) {
        this._zoom = this._zoomRange[0];
      } else if (n > this._zoomRange[1]) {
        this._zoom = this._zoomRange[1];
      } else {
        this._zoom = n;
      }
      this._graph.setProp("zoom", this._zoom);
    },
    enumerable: false,
    configurable: true
  });
  Zoom.prototype._scale = function(step) {
    var zoomed = this._zoom + step;
    if (zoomed < this._zoomRange[0]) {
      this._zoom = this._zoomRange[0];
    } else if (zoomed > this._zoomRange[1]) {
      this._zoom = this._zoomRange[1];
    } else {
      this._zoom = zoomed;
    }
    this._graph.setProp("zoom", this._zoom);
    return this._zoom;
  };
  Zoom.prototype.zoomInBy = function(step) {
    return this._scale(step);
  };
  Zoom.prototype.zoomOutBy = function(step) {
    return this._scale(0 - step);
  };
  return Zoom;
}());
exports.default = Zoom;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGx1Z2lucy96b29tLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbnMvem9vbS50cz9hNmQ1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHcmFwaCBmcm9tIFwiQC9jb3JlL2dyYXBoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFpvb20ge1xuICBwcml2YXRlIF96b29tID0gMTtcbiAgcHJpdmF0ZSBfem9vbVJhbmdlOiBBcnJheTxudW1iZXI+ID0gWzAuMSwgMTBdO1xuICBwcml2YXRlIF9ncmFwaDogR3JhcGg7XG4gIGNvbnN0cnVjdG9yKGdyYXBoOiBHcmFwaCkge1xuICAgIHRoaXMuX2dyYXBoID0gZ3JhcGg7XG4gICAgdGhpcy5fZ3JhcGguc2V0UHJvcChcInpvb21cIiwgdGhpcy5fem9vbSk7XG4gIH1cbiAgZ2V0IHpvb20oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgfVxuICBzZXQgem9vbShuOiBudW1iZXIpIHtcbiAgICBpZiAobiA8IHRoaXMuX3pvb21SYW5nZVswXSkge1xuICAgICAgdGhpcy5fem9vbSA9IHRoaXMuX3pvb21SYW5nZVswXTtcbiAgICB9IGVsc2UgaWYgKG4gPiB0aGlzLl96b29tUmFuZ2VbMV0pIHtcbiAgICAgIHRoaXMuX3pvb20gPSB0aGlzLl96b29tUmFuZ2VbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3pvb20gPSBuO1xuICAgIH1cbiAgICB0aGlzLl9ncmFwaC5zZXRQcm9wKFwiem9vbVwiLCB0aGlzLl96b29tKTtcbiAgfVxuICBwcml2YXRlIF9zY2FsZShzdGVwOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHpvb21lZDogbnVtYmVyID0gdGhpcy5fem9vbSArIHN0ZXA7XG4gICAgaWYgKHpvb21lZCA8IHRoaXMuX3pvb21SYW5nZVswXSkge1xuICAgICAgdGhpcy5fem9vbSA9IHRoaXMuX3pvb21SYW5nZVswXTtcbiAgICB9IGVsc2UgaWYgKHpvb21lZCA+IHRoaXMuX3pvb21SYW5nZVsxXSkge1xuICAgICAgdGhpcy5fem9vbSA9IHRoaXMuX3pvb21SYW5nZVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fem9vbSA9IHpvb21lZDtcbiAgICB9XG4gICAgdGhpcy5fZ3JhcGguc2V0UHJvcChcInpvb21cIiwgdGhpcy5fem9vbSk7XG4gICAgcmV0dXJuIHRoaXMuX3pvb207XG4gIH1cbiAgem9vbUluQnkoc3RlcDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2NhbGUoc3RlcCk7XG4gIH1cbiAgem9vbU91dEJ5KHN0ZXA6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3NjYWxlKDAgLSBzdGVwKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOztBQUVBO0FBSUE7QUFIQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQVZBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7OyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/plugins/zoom.ts