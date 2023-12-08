Object.defineProperty(exports, "__esModule", {
  value: true
});
var ActionBuffer = /** @class */ (function() {
  function ActionBuffer(capacity) {
    if (capacity === void 0) {
      capacity = 1000;
    }
    this._pointer = 0;
    this._cap = capacity;
    this._array = [];
  }
  ActionBuffer.prototype.push = function(item) {
    if (this.full)
      this._array.shift();
    this._array.push(item);
    this._pointer = this._array.length - 1;
    return true;
  };
  ActionBuffer.prototype.prev = function() {
    if (this._pointer > 0) {
      this._pointer -= 1;
    }
  };
  ActionBuffer.prototype.next = function() {
    if (this._pointer + 1 < this._array.length) {
      this._pointer += 1;
    }
  };
  ActionBuffer.prototype.current = function() {
    if (this.empty)
      return undefined;
    return this._array[this._pointer];
  };
  ActionBuffer.prototype.pop = function() {
    if (this.empty)
      return undefined;
    this._pointer = this._array.length - 1;
    return this._array[this._pointer];
  };
  ActionBuffer.prototype.clear = function() {
    this._array = [];
  };
  Object.defineProperty(ActionBuffer.prototype, "empty", {
    get: function() {
      return this._array.length === 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActionBuffer.prototype, "full", {
    get: function() {
      return this._array.length >= this._cap;
    },
    enumerable: false,
    configurable: true
  });
  return ActionBuffer;
}());
exports.default = ActionBuffer;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvYnVmZmVyLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2J1ZmZlci50cz80OWVkIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdGlvbkJ1ZmZlciB7XG4gIHByaXZhdGUgX2FycmF5OiBBcnJheTxhbnk+O1xuICBwcml2YXRlIF9jYXA6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcG9pbnRlciA9IDA7XG4gIGNvbnN0cnVjdG9yKGNhcGFjaXR5ID0gMTAwMCkge1xuICAgIHRoaXMuX2NhcCA9IGNhcGFjaXR5O1xuICAgIHRoaXMuX2FycmF5ID0gW107XG4gIH1cbiAgcHVibGljIHB1c2g8VD4oaXRlbTogVCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmZ1bGwpIHRoaXMuX2FycmF5LnNoaWZ0KCk7XG4gICAgdGhpcy5fYXJyYXkucHVzaChpdGVtKTtcbiAgICB0aGlzLl9wb2ludGVyID0gdGhpcy5fYXJyYXkubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwdWJsaWMgcHJldigpOiBhbnkge1xuICAgIGlmICh0aGlzLl9wb2ludGVyID4gMCkge1xuICAgICAgdGhpcy5fcG9pbnRlciAtPSAxO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgbmV4dCgpOiBhbnkge1xuICAgIGlmICh0aGlzLl9wb2ludGVyICsgMSA8IHRoaXMuX2FycmF5Lmxlbmd0aCkge1xuICAgICAgdGhpcy5fcG9pbnRlciArPSAxO1xuICAgIH1cbiAgfVxuICBwdWJsaWMgY3VycmVudCgpOiBhbnkge1xuICAgIGlmICh0aGlzLmVtcHR5KSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiB0aGlzLl9hcnJheVt0aGlzLl9wb2ludGVyXTtcbiAgfVxuICBwdWJsaWMgcG9wKCk6IGFueSB7XG4gICAgaWYgKHRoaXMuZW1wdHkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcG9pbnRlciA9IHRoaXMuX2FycmF5Lmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIHRoaXMuX2FycmF5W3RoaXMuX3BvaW50ZXJdO1xuICB9XG4gIHB1YmxpYyBjbGVhcigpIHtcbiAgICB0aGlzLl9hcnJheSA9IFtdO1xuICB9XG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYXJyYXkubGVuZ3RoID09PSAwO1xuICB9XG4gIGdldCBmdWxsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hcnJheS5sZW5ndGggPj0gdGhpcy5fY2FwO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFJQTtBQUFBO0FBREE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBO0FBQUE7OyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/utils/buffer.ts