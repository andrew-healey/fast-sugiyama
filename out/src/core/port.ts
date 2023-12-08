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
exports.PortDirection = void 0;
var lodash_1 = __webpack_require__( /*! lodash */ "./node_modules/lodash/lodash.js");
var uuid_1 = __webpack_require__( /*! @/utils/uuid */ "./src/utils/uuid.ts");
var PortDirection;
(function(PortDirection) {
  PortDirection[PortDirection["IN"] = 0] = "IN";
  PortDirection[PortDirection["OUT"] = 1] = "OUT";
})(PortDirection = exports.PortDirection || (exports.PortDirection = {}));
var Port = /** @class */ (function() {
  function Port(type, uid, options) {
    this.excludeKeys = {
      id: true,
      type: true,
      connected: true,
      connectable: true,
      absorbable: true,
      links: true,
    };
    this._data = __assign(__assign({
      description: "",
      connected: false,
      connectable: false,
      absorbable: false,
      direction: PortDirection.IN,
      label: type,
      selected: false,
      selectedAble: true,
      links: []
    }, options), {
      type: type,
      id: uid || (0, uuid_1.uuidv4)()
    });
  }
  Object.defineProperty(Port.prototype, "id", {
    get: function() {
      return this._data.id;
    },
    set: function(uid) {
      this._data.id = uid;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "attached", {
    get: function() {
      return this._attached;
    },
    set: function(nodeId) {
      this._attached = nodeId;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "direction", {
    get: function() {
      return this._data.direction;
    },
    set: function(d) {
      this._data.direction = d;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "description", {
    get: function() {
      return this._data.description;
    },
    set: function(desc) {
      this._data.description = desc;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "type", {
    get: function() {
      return this._data.type;
    },
    set: function(tp) {
      this._data.type = tp;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "connected", {
    get: function() {
      return this._data.connected;
    },
    set: function(c) {
      this._data.connected = c;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "connectable", {
    get: function() {
      return this._data.connectable;
    },
    set: function(c) {
      this._data.connectable = c;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "absorbable", {
    get: function() {
      return this._data.absorbable;
    },
    set: function(m) {
      this._data.absorbable = m;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Port.prototype, "data", {
    get: function() {
      return this._data;
    },
    set: function(d) {
      this._data = d;
    },
    enumerable: false,
    configurable: true
  });
  Port.prototype.setData = function(d) {
    var _this = this;
    Object.keys(d).map(function(key) {
      if (_this.excludeKeys[key])
        return;
      _this._data[key] = (0, lodash_1.cloneDeep)(d[key]);
    });
  };
  Object.defineProperty(Port.prototype, "links", {
    get: function() {
      return this._data.links;
    },
    enumerable: false,
    configurable: true
  });
  Port.prototype.addLink = function(linkId) {
    if (!this.hasLink(linkId)) {
      this._data.links.push(linkId);
      this._data.connected = true;
    }
  };
  Port.prototype.hasLink = function(linkId) {
    return this._data.links.indexOf(linkId) > -1;
  };
  Port.prototype.removeLink = function(linkId) {
    var idx = this._data.links.indexOf(linkId);
    if (idx > -1)
      this._data.links.splice(idx, 1);
    if (this._data.links.length === 0)
      this._data.connected = false;
  };
  Port.prototype.setProp = function(key, value) {
    this._data[key] = value;
  };
  Port.prototype.clone = function() {
    return Port.from(this);
  };
  Port.from = function(port) {
    var newPort = new Port(port.data.type);
    newPort.setData(port.data);
    return newPort;
  };
  Port.fromData = function(d) {
    var newPort = new Port(d.type, d.id);
    newPort.setData(d);
    return newPort;
  };
  Port.prototype.exportJson = function() {
    return (0, lodash_1.cloneDeep)(this._data);
  };
  return Port;
}());
exports.default = Port;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29yZS9wb3J0LnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvcG9ydC50cz8yNWJmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IHV1aWR2NCB9IGZyb20gXCJAL3V0aWxzL3V1aWRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBQb3J0RGF0YSB7XG4gIGlkPzogc3RyaW5nO1xuICB0eXBlOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBsYWJlbD86IHN0cmluZztcbiAgY29ubmVjdGFibGU6IGJvb2xlYW47XG4gIGNvbm5lY3RlZDogYm9vbGVhbjtcbiAgYWJzb3JiYWJsZTogYm9vbGVhbjtcbiAgZGlyZWN0aW9uOiBQb3J0RGlyZWN0aW9uO1xuICBsaW5rcz86IHN0cmluZ1tdO1xuICBzdWJ0eXBlPzogc3RyaW5nO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBlbnVtIFBvcnREaXJlY3Rpb24ge1xuICBJTiA9IDAsXG4gIE9VVCA9IDEsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvcnQge1xuICBwcml2YXRlIHJlYWRvbmx5IGV4Y2x1ZGVLZXlzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge1xuICAgIGlkOiB0cnVlLFxuICAgIHR5cGU6IHRydWUsXG4gICAgY29ubmVjdGVkOiB0cnVlLFxuICAgIGNvbm5lY3RhYmxlOiB0cnVlLFxuICAgIGFic29yYmFibGU6IHRydWUsXG4gICAgbGlua3M6IHRydWUsXG4gIH07XG4gIHByaXZhdGUgX2RhdGE6IFBvcnREYXRhO1xuICBwcml2YXRlIF9hdHRhY2hlZDogc3RyaW5nO1xuICBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcsIHVpZD86IHN0cmluZywgb3B0aW9ucz86IG9iamVjdCkge1xuICAgIHRoaXMuX2RhdGEgPSB7XG4gICAgICBkZXNjcmlwdGlvbjogXCJcIixcbiAgICAgIGNvbm5lY3RlZDogZmFsc2UsXG4gICAgICBjb25uZWN0YWJsZTogZmFsc2UsXG4gICAgICBhYnNvcmJhYmxlOiBmYWxzZSxcbiAgICAgIGRpcmVjdGlvbjogUG9ydERpcmVjdGlvbi5JTixcbiAgICAgIGxhYmVsOiB0eXBlLFxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgc2VsZWN0ZWRBYmxlOiB0cnVlLFxuICAgICAgbGlua3M6IFtdLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHR5cGUsXG4gICAgICBpZDogdWlkIHx8IHV1aWR2NCgpLFxuICAgIH07XG4gIH1cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuaWQ7XG4gIH1cbiAgc2V0IGlkKHVpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZGF0YS5pZCA9IHVpZDtcbiAgfVxuICBnZXQgYXR0YWNoZWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWQ7XG4gIH1cbiAgc2V0IGF0dGFjaGVkKG5vZGVJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5fYXR0YWNoZWQgPSBub2RlSWQ7XG4gIH1cbiAgZ2V0IGRpcmVjdGlvbigpOiBQb3J0RGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5kaXJlY3Rpb247XG4gIH1cbiAgc2V0IGRpcmVjdGlvbihkOiBQb3J0RGlyZWN0aW9uKSB7XG4gICAgdGhpcy5fZGF0YS5kaXJlY3Rpb24gPSBkO1xuICB9XG4gIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kYXRhLmRlc2NyaXB0aW9uO1xuICB9XG4gIHNldCBkZXNjcmlwdGlvbihkZXNjOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9kYXRhLmRlc2NyaXB0aW9uID0gZGVzYztcbiAgfVxuICBnZXQgdHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kYXRhLnR5cGU7XG4gIH1cbiAgc2V0IHR5cGUodHA6IHN0cmluZykge1xuICAgIHRoaXMuX2RhdGEudHlwZSA9IHRwO1xuICB9XG4gIGdldCBjb25uZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY29ubmVjdGVkO1xuICB9XG4gIHNldCBjb25uZWN0ZWQoYzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RhdGEuY29ubmVjdGVkID0gYztcbiAgfVxuICBnZXQgY29ubmVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuY29ubmVjdGFibGU7XG4gIH1cbiAgc2V0IGNvbm5lY3RhYmxlKGM6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kYXRhLmNvbm5lY3RhYmxlID0gYztcbiAgfVxuICBnZXQgYWJzb3JiYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5hYnNvcmJhYmxlO1xuICB9XG4gIHNldCBhYnNvcmJhYmxlKG06IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kYXRhLmFic29yYmFibGUgPSBtO1xuICB9XG4gIGdldCBkYXRhKCk6IFBvcnREYXRhIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuICBzZXQgZGF0YShkOiBQb3J0RGF0YSkge1xuICAgIHRoaXMuX2RhdGEgPSBkO1xuICB9XG4gIHNldERhdGEoZDogUG9ydERhdGEpIHtcbiAgICBPYmplY3Qua2V5cyhkKS5tYXAoKGtleSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZXhjbHVkZUtleXNba2V5XSkgcmV0dXJuO1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gY2xvbmVEZWVwKGRba2V5XSk7XG4gICAgfSk7XG4gIH1cbiAgZ2V0IGxpbmtzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5saW5rcztcbiAgfVxuICBhZGRMaW5rKGxpbmtJZDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmhhc0xpbmsobGlua0lkKSkge1xuICAgICAgdGhpcy5fZGF0YS5saW5rcy5wdXNoKGxpbmtJZCk7XG4gICAgICB0aGlzLl9kYXRhLmNvbm5lY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGhhc0xpbmsobGlua0lkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5saW5rcy5pbmRleE9mKGxpbmtJZCkgPiAtMTtcbiAgfVxuICByZW1vdmVMaW5rKGxpbmtJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgaWR4OiBudW1iZXIgPSB0aGlzLl9kYXRhLmxpbmtzLmluZGV4T2YobGlua0lkKTtcbiAgICBpZiAoaWR4ID4gLTEpIHRoaXMuX2RhdGEubGlua3Muc3BsaWNlKGlkeCwgMSk7XG4gICAgaWYgKHRoaXMuX2RhdGEubGlua3MubGVuZ3RoID09PSAwKSB0aGlzLl9kYXRhLmNvbm5lY3RlZCA9IGZhbHNlO1xuICB9XG4gIHNldFByb3Aoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kYXRhW2tleV0gPSB2YWx1ZTtcbiAgfVxuICBjbG9uZSgpOiBQb3J0IHtcbiAgICByZXR1cm4gUG9ydC5mcm9tKHRoaXMpO1xuICB9XG4gIHN0YXRpYyBmcm9tKHBvcnQ6IFBvcnQpOiBQb3J0IHtcbiAgICBjb25zdCBuZXdQb3J0OiBQb3J0ID0gbmV3IFBvcnQocG9ydC5kYXRhLnR5cGUpO1xuICAgIG5ld1BvcnQuc2V0RGF0YShwb3J0LmRhdGEpO1xuICAgIHJldHVybiBuZXdQb3J0O1xuICB9XG4gIHN0YXRpYyBmcm9tRGF0YShkOiBQb3J0RGF0YSk6IFBvcnQge1xuICAgIGNvbnN0IG5ld1BvcnQ6IFBvcnQgPSBuZXcgUG9ydChkLnR5cGUsIGQuaWQpO1xuICAgIG5ld1BvcnQuc2V0RGF0YShkKTtcbiAgICByZXR1cm4gbmV3UG9ydDtcbiAgfVxuICBleHBvcnRKc29uKCk6IFBvcnREYXRhIHtcbiAgICByZXR1cm4gY2xvbmVEZWVwKHRoaXMuX2RhdGEpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQWdCQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFXQTtBQVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQWNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUhBO0FBSUE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBOzs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBOzsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/core/port.ts