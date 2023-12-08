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
var __rest = (this && this.__rest) || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var React = __webpack_require__( /*! react */ "./node_modules/react/index.js");

function genIcon(name, icon) {
  if (/TwoClass/.test(name)) {
    return 'two-class';
  }
  if (/MultiClass/.test(name)) {
    return 'multi-class';
  }
  if (/Regression/.test(name)) {
    return 'regression';
  }
  if (/Evaluation/.test(name)) {
    return 'evaluation';
  }
  if (/Preprocess/.test(name)) {
    return 'pre-treatment';
  }
  if (/Feature/.test(name)) {
    return 'feature';
  }
  if (/Network/.test(name)) {
    return 'network-analysis';
  }
  if (/Prediction/.test(name)) {
    return 'prediction';
  }
  if (/Clustering/.test(name)) {
    return 'cluster';
  }
  if (/Sophon/.test(name)) {
    return 'sophon';
  }
  if (/Time/.test(name)) {
    return 'time-analysis';
  }
  return icon;
}
var Icon = function(_a) {
  var name = _a.name,
    icon = _a.icon,
    rest = __rest(_a, ["name", "icon"]);
  var iconName = genIcon(name, icon);
  return React.createElement("span", __assign({
    className: "icon-".concat(iconName)
  }, rest));
};
Icon.defaultProps = {
  width: 16,
};
exports.default = Icon;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9pY29uLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2ljb24udHN4P2EyMWUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5mdW5jdGlvbiBnZW5JY29uKG5hbWU6IHN0cmluZywgaWNvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKC9Ud29DbGFzcy8udGVzdChuYW1lKSkge1xuICAgIHJldHVybiAndHdvLWNsYXNzJztcbiAgfVxuICBpZiAoL011bHRpQ2xhc3MvLnRlc3QobmFtZSkpIHtcbiAgICByZXR1cm4gJ211bHRpLWNsYXNzJztcbiAgfVxuICBpZiAoL1JlZ3Jlc3Npb24vLnRlc3QobmFtZSkpIHtcbiAgICByZXR1cm4gJ3JlZ3Jlc3Npb24nO1xuICB9XG4gIGlmICgvRXZhbHVhdGlvbi8udGVzdChuYW1lKSkge1xuICAgIHJldHVybiAnZXZhbHVhdGlvbic7XG4gIH1cbiAgaWYgKC9QcmVwcm9jZXNzLy50ZXN0KG5hbWUpKSB7XG4gICAgcmV0dXJuICdwcmUtdHJlYXRtZW50JztcbiAgfVxuICBpZiAoL0ZlYXR1cmUvLnRlc3QobmFtZSkpIHtcbiAgICByZXR1cm4gJ2ZlYXR1cmUnO1xuICB9XG4gIGlmICgvTmV0d29yay8udGVzdChuYW1lKSkge1xuICAgIHJldHVybiAnbmV0d29yay1hbmFseXNpcyc7XG4gIH1cbiAgaWYgKC9QcmVkaWN0aW9uLy50ZXN0KG5hbWUpKSB7XG4gICAgcmV0dXJuICdwcmVkaWN0aW9uJztcbiAgfVxuICBpZiAoL0NsdXN0ZXJpbmcvLnRlc3QobmFtZSkpIHtcbiAgICByZXR1cm4gJ2NsdXN0ZXInO1xuICB9XG4gIGlmICgvU29waG9uLy50ZXN0KG5hbWUpKSB7XG4gICAgcmV0dXJuICdzb3Bob24nO1xuICB9XG4gIGlmICgvVGltZS8udGVzdChuYW1lKSkge1xuICAgIHJldHVybiAndGltZS1hbmFseXNpcyc7XG4gIH1cbiAgcmV0dXJuIGljb247XG59XG5cbmNvbnN0IEljb24gPSAoeyBuYW1lLCBpY29uLCAuLi5yZXN0IH06IHsgbmFtZTogc3RyaW5nOyBpY29uOiBzdHJpbmc7IFtrZXk6IHN0cmluZ106IGFueSB9KSA9PiB7XG4gIGNvbnN0IGljb25OYW1lOiBzdHJpbmcgPSBnZW5JY29uKG5hbWUsIGljb24pO1xuICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPXtgaWNvbi0ke2ljb25OYW1lfWB9IHsuLi5yZXN0fSAvPjtcbn07XG5cbkljb24uZGVmYXVsdFByb3BzID0ge1xuICB3aWR0aDogMTYsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBJY29uO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/components/icon.tsx