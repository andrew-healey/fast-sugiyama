Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uuidv4 = void 0;
var HEX_DIGITS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f"
];

function uuidv4() {
  var binary = new Array(16);
  for (var i = 0; i < 16; i++) {
    binary[i] = Math.floor(Math.random() * 256);
  }
  binary[6] = (binary[6] & 0x0f) | 0x40; // set time-high-and-version msb
  binary[8] = (binary[8] & 0x3f) | 0x80; // set clock-seq-and-reserved msb
  var strs = binary.map(function(b) {
    return "".concat(HEX_DIGITS[Math.floor(b / 16)]).concat(HEX_DIGITS[b % 16]);
  });
  strs.splice(4, 0, "-");
  strs.splice(7, 0, "-");
  strs.splice(10, 0, "-");
  strs.splice(13, 0, "-");
  return strs.join("");
}
exports.uuidv4 = uuidv4;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvdXVpZC50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy91dGlscy91dWlkLnRzP2E5MzAiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSEVYX0RJR0lUUzogQXJyYXk8c3RyaW5nPiA9IFtcbiAgXCIwXCIsXG4gIFwiMVwiLFxuICBcIjJcIixcbiAgXCIzXCIsXG4gIFwiNFwiLFxuICBcIjVcIixcbiAgXCI2XCIsXG4gIFwiN1wiLFxuICBcIjhcIixcbiAgXCI5XCIsXG4gIFwiYVwiLFxuICBcImJcIixcbiAgXCJjXCIsXG4gIFwiZFwiLFxuICBcImVcIixcbiAgXCJmXCJcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiB1dWlkdjQoKTogc3RyaW5nIHtcbiAgY29uc3QgYmluYXJ5ID0gbmV3IEFycmF5KDE2KTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgYmluYXJ5W2ldID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KTtcbiAgfVxuICBiaW5hcnlbNl0gPSAoYmluYXJ5WzZdICYgMHgwZikgfCAweDQwOyAvLyBzZXQgdGltZS1oaWdoLWFuZC12ZXJzaW9uIG1zYlxuICBiaW5hcnlbOF0gPSAoYmluYXJ5WzhdICYgMHgzZikgfCAweDgwOyAvLyBzZXQgY2xvY2stc2VxLWFuZC1yZXNlcnZlZCBtc2JcbiAgY29uc3Qgc3RycyA9IGJpbmFyeS5tYXAoXG4gICAgYiA9PiBgJHtIRVhfRElHSVRTW01hdGguZmxvb3IoYiAvIDE2KV19JHtIRVhfRElHSVRTW2IgJSAxNl19YFxuICApO1xuICBzdHJzLnNwbGljZSg0LCAwLCBcIi1cIik7XG4gIHN0cnMuc3BsaWNlKDcsIDAsIFwiLVwiKTtcbiAgc3Rycy5zcGxpY2UoMTAsIDAsIFwiLVwiKTtcbiAgc3Rycy5zcGxpY2UoMTMsIDAsIFwiLVwiKTtcbiAgcmV0dXJuIHN0cnMuam9pbihcIlwiKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWZBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/utils/uuid.ts