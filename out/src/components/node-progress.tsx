Object.defineProperty(exports, "__esModule", {
  value: true
});
var React = __webpack_require__( /*! react */ "./node_modules/react/index.js");
var arc = "\n         M 50,50\n          m 0,-25\n          a 25,25 0 1 1 0,50\n          a 25,25 0 1 1 0,-50\n";

function NodeProgress(props) {
  var _a = props.progress,
    progress = _a === void 0 ? 0 : _a,
    _b = props.radius,
    radius = _b === void 0 ? 8 : _b;
  var dashArray = Math.PI * 50;
  var dashOffset = (dashArray * (100 - progress)) / 100;
  return (React.createElement("svg", {
      width: radius * 2,
      height: radius * 2,
      viewBox: "0 0 100 100",
      style: {
        margin: 5
      }
    },
    React.createElement("circle", {
      r: 50,
      cx: 50,
      cy: 50,
      fill: "#E0E0E0"
    }),
    React.createElement("path", {
      d: arc,
      fillOpacity: "0",
      stroke: "#298de9",
      strokeWidth: 50,
      strokeDasharray: "".concat(dashArray, ",").concat(dashArray),
      strokeDashoffset: dashOffset,
      strokeLinecap: "butt",
      style: {
        transition: "stroke-dashoffset 0.5s ease 0s"
      }
    })));
}
exports.default = NodeProgress;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9ub2RlLXByb2dyZXNzLnRzeC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL25vZGUtcHJvZ3Jlc3MudHN4PzA2YmIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmludGVyZmFjZSBOb2RlRGVzY3JpcnB0aW9uUHJvcHMge1xuICBwcm9ncmVzczogbnVtYmVyO1xuICByYWRpdXM/OiBudW1iZXI7XG59XG5cbmNvbnN0IGFyYyA9IGBcbiAgICAgICAgIE0gNTAsNTBcbiAgICAgICAgICBtIDAsLTI1XG4gICAgICAgICAgYSAyNSwyNSAwIDEgMSAwLDUwXG4gICAgICAgICAgYSAyNSwyNSAwIDEgMSAwLC01MFxuYDtcblxuZnVuY3Rpb24gTm9kZVByb2dyZXNzKHByb3BzOiBOb2RlRGVzY3JpcnB0aW9uUHJvcHMpIHtcbiAgY29uc3QgeyBwcm9ncmVzcyA9IDAsIHJhZGl1cyA9IDggfSA9IHByb3BzO1xuICBjb25zdCBkYXNoQXJyYXk6IG51bWJlciA9IE1hdGguUEkgKiA1MDtcbiAgY29uc3QgZGFzaE9mZnNldDogbnVtYmVyID0gKGRhc2hBcnJheSAqICgxMDAgLSBwcm9ncmVzcykpIC8gMTAwO1xuICByZXR1cm4gKFxuICAgIDxzdmdcbiAgICAgIHdpZHRoPXtyYWRpdXMgKiAyfVxuICAgICAgaGVpZ2h0PXtyYWRpdXMgKiAyfVxuICAgICAgdmlld0JveD1cIjAgMCAxMDAgMTAwXCJcbiAgICAgIHN0eWxlPXt7IG1hcmdpbjogNSB9fVxuICAgID5cbiAgICAgIDxjaXJjbGUgcj17NTB9IGN4PXs1MH0gY3k9ezUwfSBmaWxsPVwiI0UwRTBFMFwiIC8+XG4gICAgICA8cGF0aFxuICAgICAgICBkPXthcmN9XG4gICAgICAgIGZpbGxPcGFjaXR5PVwiMFwiXG4gICAgICAgIHN0cm9rZT1cIiMyOThkZTlcIlxuICAgICAgICBzdHJva2VXaWR0aD17NTB9XG4gICAgICAgIHN0cm9rZURhc2hhcnJheT17YCR7ZGFzaEFycmF5fSwke2Rhc2hBcnJheX1gfVxuICAgICAgICBzdHJva2VEYXNob2Zmc2V0PXtkYXNoT2Zmc2V0fVxuICAgICAgICBzdHJva2VMaW5lY2FwPVwiYnV0dFwiXG4gICAgICAgIHN0eWxlPXt7IHRyYW5zaXRpb246IFwic3Ryb2tlLWRhc2hvZmZzZXQgMC41cyBlYXNlIDBzXCIgfX1cbiAgICAgIC8+XG4gICAgPC9zdmc+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVQcm9ncmVzcztcbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQU9BO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFZQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/components/node-progress.tsx