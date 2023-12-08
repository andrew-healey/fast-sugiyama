Object.defineProperty(exports, "__esModule", {
  value: true
});
var lodash_1 = __webpack_require__( /*! lodash */ "./node_modules/lodash/lodash.js");
var uuid_1 = __webpack_require__( /*! @/utils/uuid */ "./src/utils/uuid.ts");
var Link = /** @class */ (function() {
  function Link(source, target, sourcePort, targetPort, uid) {
    this.excludeKeys = {
      source: true,
      target: true,
      sourcePort: true,
      targetPort: true,
    };
    this._data = {
      source: source,
      target: target,
      sourcePort: sourcePort,
      targetPort: targetPort,
      id: uid || (0, uuid_1.uuidv4)(),
      type: "default",
    };
  }
  Object.defineProperty(Link.prototype, "id", {
    get: function() {
      return this._data.id;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Link.prototype, "source", {
    get: function() {
      return this._data.source;
    },
    set: function(s) {
      this._data.source = s;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Link.prototype, "target", {
    get: function() {
      return this._data.target;
    },
    set: function(t) {
      this._data.target = t;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Link.prototype, "sourcePort", {
    get: function() {
      return this._data.sourcePort;
    },
    set: function(sp) {
      this._data.sourcePort = sp;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Link.prototype, "targetPort", {
    get: function() {
      return this._data.targetPort;
    },
    set: function(tt) {
      this._data.targetPort = tt;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Link.prototype, "data", {
    get: function() {
      return this._data;
    },
    enumerable: false,
    configurable: true
  });
  Link.prototype.setData = function(ld) {
    var _this = this;
    Object.keys(ld).map(function(key) {
      if (_this.excludeKeys[key])
        return;
      _this._data[key] = ld[key];
    });
  };
  Link.fromData = function(ld) {
    var source = ld.source,
      target = ld.target,
      sourcePort = ld.sourcePort,
      targetPort = ld.targetPort;
    var newLink = new Link(source, target, sourcePort, targetPort);
    newLink.setData(ld);
    return newLink;
  };
  Link.prototype.exportJson = function() {
    return (0, lodash_1.cloneDeep)(this._data);
  };
  return Link;
}());
exports.default = Link;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29yZS9saW5rLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvbGluay50cz85NDI4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IHV1aWR2NCB9IGZyb20gXCJAL3V0aWxzL3V1aWRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBMaW5rRGF0YSB7XG4gIGlkOiBzdHJpbmc7XG4gIHNvdXJjZTogc3RyaW5nO1xuICB0YXJnZXQ6IHN0cmluZztcbiAgc291cmNlUG9ydDogc3RyaW5nO1xuICB0YXJnZXRQb3J0OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsge1xuICBwcml2YXRlIHJlYWRvbmx5IGV4Y2x1ZGVLZXlzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge1xuICAgIHNvdXJjZTogdHJ1ZSxcbiAgICB0YXJnZXQ6IHRydWUsXG4gICAgc291cmNlUG9ydDogdHJ1ZSxcbiAgICB0YXJnZXRQb3J0OiB0cnVlLFxuICB9O1xuICBwcml2YXRlIF9kYXRhOiBMaW5rRGF0YTtcbiAgY29uc3RydWN0b3IoXG4gICAgc291cmNlOiBzdHJpbmcsXG4gICAgdGFyZ2V0OiBzdHJpbmcsXG4gICAgc291cmNlUG9ydDogc3RyaW5nLFxuICAgIHRhcmdldFBvcnQ6IHN0cmluZyxcbiAgICB1aWQ/OiBzdHJpbmdcbiAgKSB7XG4gICAgdGhpcy5fZGF0YSA9IHtcbiAgICAgIHNvdXJjZSxcbiAgICAgIHRhcmdldCxcbiAgICAgIHNvdXJjZVBvcnQsXG4gICAgICB0YXJnZXRQb3J0LFxuICAgICAgaWQ6IHVpZCB8fCB1dWlkdjQoKSxcbiAgICAgIHR5cGU6IFwiZGVmYXVsdFwiLFxuICAgIH07XG4gIH1cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuaWQ7XG4gIH1cbiAgZ2V0IHNvdXJjZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kYXRhLnNvdXJjZTtcbiAgfVxuICBzZXQgc291cmNlKHM6IHN0cmluZykge1xuICAgIHRoaXMuX2RhdGEuc291cmNlID0gcztcbiAgfVxuICBnZXQgdGFyZ2V0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEudGFyZ2V0O1xuICB9XG4gIHNldCB0YXJnZXQodDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZGF0YS50YXJnZXQgPSB0O1xuICB9XG4gIGdldCBzb3VyY2VQb3J0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuc291cmNlUG9ydDtcbiAgfVxuICBzZXQgc291cmNlUG9ydChzcDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZGF0YS5zb3VyY2VQb3J0ID0gc3A7XG4gIH1cbiAgZ2V0IHRhcmdldFBvcnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS50YXJnZXRQb3J0O1xuICB9XG4gIHNldCB0YXJnZXRQb3J0KHR0OiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kYXRhLnRhcmdldFBvcnQgPSB0dDtcbiAgfVxuICBnZXQgZGF0YSgpOiBMaW5rRGF0YSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cbiAgc2V0RGF0YShsZDogTGlua0RhdGEpIHtcbiAgICBPYmplY3Qua2V5cyhsZCkubWFwKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLmV4Y2x1ZGVLZXlzW2tleV0pIHJldHVybjtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGxkW2tleV07XG4gICAgfSk7XG4gIH1cbiAgc3RhdGljIGZyb21EYXRhKGxkOiBMaW5rRGF0YSk6IExpbmsge1xuICAgIGNvbnN0IHsgc291cmNlLCB0YXJnZXQsIHNvdXJjZVBvcnQsIHRhcmdldFBvcnQgfSA9IGxkO1xuICAgIGNvbnN0IG5ld0xpbms6IExpbmsgPSBuZXcgTGluayhzb3VyY2UsIHRhcmdldCwgc291cmNlUG9ydCwgdGFyZ2V0UG9ydCk7XG4gICAgbmV3TGluay5zZXREYXRhKGxkKTtcbiAgICByZXR1cm4gbmV3TGluaztcbiAgfVxuICBleHBvcnRKc29uKCk6IExpbmtEYXRhIHtcbiAgICByZXR1cm4gY2xvbmVEZWVwKHRoaXMuX2RhdGEpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQWFBO0FBUUE7QUFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSEE7QUFJQTtBQUFBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/core/link.ts