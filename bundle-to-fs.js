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

    const evalString = sess(prop)("CallExpression[callee.name='eval'] > LiteralStringExpression").get(0).value;
    assert(typeof evalString === "string");

    // jsbeautify file contents and write to ./out/relFilename
    const prettyFile = beautifier.js_beautify(evalString, {indent_size: 2});

    const outPath = `./out/${relFilename}`;
    const outDir = outPath.split("/").slice(0, -1).join("/");
    mkdirSync(outDir, {recursive: true});
    writeFileSync(outPath, prettyFile);
    console.log(`Wrote ${outPath}`);
});