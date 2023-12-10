const { refactor } = require("shift-refactor");
const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const assert = require("assert");
const beautifier = require("js-beautify");

const src = readFileSync("pack.js", "utf8");
const sess = refactor(src);
const mainObj = sess.query("Script > ExpressionStatement > ObjectExpression").get(0);
assert(mainObj)

mainObj.properties.forEach(prop => {
    const relFilename = prop.name.value;
    assert(typeof relFilename === "string");

    const evalLiteral = sess(prop)("CallExpression[callee.name='eval'] > LiteralStringExpression").get(0);
    const evalString = evalLiteral.value;
    assert(typeof evalString === "string");

    const outPath = `./out/${relFilename}`;
    const outFile = readFileSync(outPath, "utf8").replace(/require\(/g,"__webpack_require__(");
    console.log(`Read ${outPath}`);
    evalLiteral.value = outFile;
});

writeFileSync("packNew.js", sess.print());

const ogBundlePart = `/*! For license information please see bundle.js.LICENSE.txt */
!function (g) {
  var n = {};
  function I(e) {
    if (n[e]) return n[e].exports;
    var t = (n[e] = { i: e, l: !1, exports: {} });
    if(!g[e]) throw new Error('Cannot find module "' + e + '"');
    return g[e].call(t.exports, t, t.exports, I), (t.l = !0), t.exports;
  }
  (I.m = g),
    (I.c = n),
    (I.d = function (g, n, e) {
      I.o(g, n) || Object.defineProperty(g, n, { enumerable: !0, get: e });
    }),
    (I.r = function (g) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(g, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(g, "__esModule", { value: !0 });
    }),
    (I.t = function (g, n) {
      if ((1 & n && (g = I(g)), 8 & n)) return g;
      if (4 & n && "object" == typeof g && g && g.__esModule) return g;
      var e = Object.create(null);
      if (
        (I.r(e),
        Object.defineProperty(e, "default", { enumerable: !0, value: g }),
        2 & n && "string" != typeof g)
      )
        for (var t in g)
          I.d(
            e,
            t,
            function (n) {
              return g[n];
            }.bind(null, t)
          );
      return e;
    }),
    (I.n = function (g) {
      var n =
        g && g.__esModule
          ? function () {
              return g.default;
            }
          : function () {
              return g;
            };
      return I.d(n, "a", n), n;
    }),
    (I.o = function (g, n) {
      return Object.prototype.hasOwnProperty.call(g, n);
    }),
    (I.p = ""),
    I((I.s = "./src/index.tsx"));
}`;
const newBundle = `${ogBundlePart}${sess.print()}`;

writeFileSync("bundleNew.js", newBundle);