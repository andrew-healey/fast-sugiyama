Object.defineProperty(exports, "__esModule", {
  value: true
});
var ua = navigator.userAgent;
exports.default = {
  IS_IE: ua.indexOf("MSIE") >= 0,
  IS_IE11: !!ua.match(/Trident\/7\./),
  IS_NS: ua.indexOf("Mozilla/") >= 0 && ua.indexOf("MSIE") < 0,
  IS_FF: ua.indexOf("Firefox/") >= 0,
  IS_GC: ua.indexOf("Chrome/") >= 0,
  IS_SF: ua.indexOf("AppleWebKit/") >= 0 && ua.indexOf("Chrome/") < 0,
  IS_OP: ua.indexOf("Opera/") >= 0,
  IS_OT: ua.indexOf("Presto/2.4.") < 0 &&
    ua.indexOf("Presto/2.3.") < 0 &&
    ua.indexOf("Presto/2.2.") < 0 &&
    ua.indexOf("Presto/2.1.") < 0 &&
    ua.indexOf("Presto/2.0.") < 0 &&
    ua.indexOf("Presto/1.") < 0,
  IS_MT: (ua.indexOf("Firefox/") >= 0 &&
      ua.indexOf("Firefox/1.") < 0 &&
      ua.indexOf("Firefox/2.") < 0) ||
    (ua.indexOf("Iceweasel/") >= 0 &&
      ua.indexOf("Iceweasel/1.") < 0 &&
      ua.indexOf("Iceweasel/2.") < 0) ||
    (ua.indexOf("SeaMonkey/") >= 0 && ua.indexOf("SeaMonkey/1.") < 0) ||
    (ua.indexOf("Iceape/") >= 0 && ua.indexOf("Iceape/1.") < 0),
  IS_IOS: !!ua.match(/(iPad|iPhone|iPod)/g),
  IS_WIN: ua.indexOf("Win") > 0,
  IS_MAC: ua.indexOf("Mac") > 0,
  IS_POINTER: window.navigator.msPointerEnabled || !1,
  IS_TOUCH: "ontouchstart" in document.documentElement ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0,
  SUPPORT_FOREIGN_OBJECT: (function() {
    if (document.createElementNS) {
      var e = Object.prototype.toString,
        t = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
      return /SVGForeignObject/.test(e.call(t));
    }
    return !1;
  })(),
};
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvdWEudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvdWEudHM/NDQyYiJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1YTogc3RyaW5nID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBJU19JRTogdWEuaW5kZXhPZihcIk1TSUVcIikgPj0gMCxcbiAgSVNfSUUxMTogISF1YS5tYXRjaCgvVHJpZGVudFxcLzdcXC4vKSxcbiAgSVNfTlM6IHVhLmluZGV4T2YoXCJNb3ppbGxhL1wiKSA+PSAwICYmIHVhLmluZGV4T2YoXCJNU0lFXCIpIDwgMCxcbiAgSVNfRkY6IHVhLmluZGV4T2YoXCJGaXJlZm94L1wiKSA+PSAwLFxuICBJU19HQzogdWEuaW5kZXhPZihcIkNocm9tZS9cIikgPj0gMCxcbiAgSVNfU0Y6IHVhLmluZGV4T2YoXCJBcHBsZVdlYktpdC9cIikgPj0gMCAmJiB1YS5pbmRleE9mKFwiQ2hyb21lL1wiKSA8IDAsXG4gIElTX09QOiB1YS5pbmRleE9mKFwiT3BlcmEvXCIpID49IDAsXG4gIElTX09UOlxuICAgIHVhLmluZGV4T2YoXCJQcmVzdG8vMi40LlwiKSA8IDAgJiZcbiAgICB1YS5pbmRleE9mKFwiUHJlc3RvLzIuMy5cIikgPCAwICYmXG4gICAgdWEuaW5kZXhPZihcIlByZXN0by8yLjIuXCIpIDwgMCAmJlxuICAgIHVhLmluZGV4T2YoXCJQcmVzdG8vMi4xLlwiKSA8IDAgJiZcbiAgICB1YS5pbmRleE9mKFwiUHJlc3RvLzIuMC5cIikgPCAwICYmXG4gICAgdWEuaW5kZXhPZihcIlByZXN0by8xLlwiKSA8IDAsXG4gIElTX01UOlxuICAgICh1YS5pbmRleE9mKFwiRmlyZWZveC9cIikgPj0gMCAmJlxuICAgICAgdWEuaW5kZXhPZihcIkZpcmVmb3gvMS5cIikgPCAwICYmXG4gICAgICB1YS5pbmRleE9mKFwiRmlyZWZveC8yLlwiKSA8IDApIHx8XG4gICAgKHVhLmluZGV4T2YoXCJJY2V3ZWFzZWwvXCIpID49IDAgJiZcbiAgICAgIHVhLmluZGV4T2YoXCJJY2V3ZWFzZWwvMS5cIikgPCAwICYmXG4gICAgICB1YS5pbmRleE9mKFwiSWNld2Vhc2VsLzIuXCIpIDwgMCkgfHxcbiAgICAodWEuaW5kZXhPZihcIlNlYU1vbmtleS9cIikgPj0gMCAmJiB1YS5pbmRleE9mKFwiU2VhTW9ua2V5LzEuXCIpIDwgMCkgfHxcbiAgICAodWEuaW5kZXhPZihcIkljZWFwZS9cIikgPj0gMCAmJiB1YS5pbmRleE9mKFwiSWNlYXBlLzEuXCIpIDwgMCksXG4gIElTX0lPUzogISF1YS5tYXRjaCgvKGlQYWR8aVBob25lfGlQb2QpL2cpLFxuICBJU19XSU46IHVhLmluZGV4T2YoXCJXaW5cIikgPiAwLFxuICBJU19NQUM6IHVhLmluZGV4T2YoXCJNYWNcIikgPiAwLFxuICBJU19QT0lOVEVSOiAod2luZG93Lm5hdmlnYXRvciBhcyBhbnkpLm1zUG9pbnRlckVuYWJsZWQgfHwgITEsXG4gIElTX1RPVUNIOlxuICAgIFwib250b3VjaHN0YXJ0XCIgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8XG4gICAgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMCB8fFxuICAgIChuYXZpZ2F0b3IgYXMgYW55KS5tc01heFRvdWNoUG9pbnRzID4gMCxcbiAgU1VQUE9SVF9GT1JFSUdOX09CSkVDVDogKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKSB7XG4gICAgICBjb25zdCBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICAgICAgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJmb3JlaWduT2JqZWN0XCJcbiAgICAgICAgKTtcbiAgICAgIHJldHVybiAvU1ZHRm9yZWlnbk9iamVjdC8udGVzdChlLmNhbGwodCkpO1xuICAgIH1cbiAgICByZXR1cm4gITE7XG4gIH0pKCksXG59O1xuIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/utils/ua.ts