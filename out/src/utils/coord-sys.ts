Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert = void 0;
// 浏览器的默认坐标系，左上角为(0, 0), 横轴为x轴，向右为正方向；纵轴为y轴，向下为正方向
// 坐标系转换公式为：
// +-               + +    +    +    +
// | sx * cosθ  -sinθ  ox | | x0 |    | x1 |
// | sinθ   sy * cosθ  oy | | y0 | =  | y1 |
// |    0           0   1 | |  1 |    |  1 |
// +-                    -+ +    +    +    +
// 其中 θ 表示旋转的角度，逆时针时 θ > 0，顺时针时 θ < 0
// ox 表示水平偏移，oy 表示竖直偏移
// 所有的坐标变换都可以等价地转换为坐标系变换，这样就可以保证处理的统一性，下面实现的是坐标系变换，
// 如果想要用于坐标变换，也是可以的, 只需要将坐标系反向变换下
// 正常来说坐标系变化顺序为srt, 那么逆过来的顺序就是trs
// scale then rotate then translate
function convert(fromCoordSys, toCoordSys, from, reversed) {
  // first scale
  if ("x" in from && "y" in from) {
    if (reversed) {
      return trs(from, fromCoordSys, toCoordSys);
    }
    return srt(from, fromCoordSys, toCoordSys);
  } else {
    var coordinates_1 = [];
    from.map(function(coord) {
      if (reversed) {
        coordinates_1.push(trs(coord, fromCoordSys, toCoordSys));
      }
      coordinates_1.push(srt(coord, fromCoordSys, toCoordSys));
    });
    return coordinates_1;
  }
}
exports.convert = convert;

function srt(from, fromCoordSys, toCoordSys) {
  // 偏移反向移动
  var offsetX = fromCoordSys.x - toCoordSys.x;
  var offsetY = fromCoordSys.y - toCoordSys.y;
  var radianDiff = (toCoordSys.radian || 0) - (fromCoordSys.radian || 0);
  var scaleXDiff = (toCoordSys.scaleX || 1) / (fromCoordSys.scaleX || 1);
  var scaleYDiff = (toCoordSys.scaleY || 1) / (fromCoordSys.scaleY || 1);
  // scale
  var x1 = from.x * scaleXDiff;
  var y1 = from.y * scaleYDiff;
  // rotate and translate
  var msr = Math.sin(radianDiff);
  var mcr = Math.cos(radianDiff);
  var x2 = mcr * x1 - msr * y1 + offsetX;
  var y2 = msr * x1 + mcr * y1 + offsetY;
  return {
    x: x2,
    y: y2,
  };
}

function trs(from, fromCoordSys, toCoordSys) {
  var offsetX = toCoordSys.x - fromCoordSys.x;
  var offsetY = toCoordSys.y - fromCoordSys.y;
  var radianDiff = (toCoordSys.radian || 0) - (fromCoordSys.radian || 0);
  var scaleXDiff = (toCoordSys.scaleX || 1) / (fromCoordSys.scaleX || 1);
  var scaleYDiff = (toCoordSys.scaleY || 1) / (fromCoordSys.scaleY || 1);
  // translate
  var x1 = from.x + offsetX;
  var y1 = from.y + offsetY;
  // rotate
  var msr = Math.sin(radianDiff);
  var mcr = Math.cos(radianDiff);
  var x2 = mcr * x1 - msr * y1;
  var y2 = msr * x1 + mcr * y1;
  // scale
  x1 = x2 * scaleXDiff;
  y1 = y2 * scaleYDiff;
  return {
    x: x1,
    y: y1,
  };
}
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvY29vcmQtc3lzLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2Nvb3JkLXN5cy50cz9lOTc0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvb3JkaW5hdGUgfSBmcm9tIFwiQC9jb3JlL2ludGVyZmFjZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvb3JkU3lzdGVtIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHNjYWxlWD86IG51bWJlcjtcbiAgc2NhbGVZPzogbnVtYmVyO1xuICByYWRpYW4/OiBudW1iZXI7IC8vIOW8p+W6puWAvFxuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlY3RBcmVhIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHgxOiBudW1iZXI7XG4gIHkxOiBudW1iZXI7XG59XG5cbi8vIOa1j+iniOWZqOeahOm7mOiupOWdkOagh+ezu++8jOW3puS4iuinkuS4uigwLCAwKSwg5qiq6L205Li6eOi9tO+8jOWQkeWPs+S4uuato+aWueWQke+8m+e6tei9tOS4unnovbTvvIzlkJHkuIvkuLrmraPmlrnlkJFcbi8vIOWdkOagh+ezu+i9rOaNouWFrOW8j+S4uu+8mlxuLy8gKy0gICAgICAgICAgICAgICArICsgICAgKyAgICArICAgICtcbi8vIHwgc3ggKiBjb3POuCAgLXNpbs64ICBveCB8IHwgeDAgfCAgICB8IHgxIHxcbi8vIHwgc2luzrggICBzeSAqIGNvc864ICBveSB8IHwgeTAgfCA9ICB8IHkxIHxcbi8vIHwgICAgMCAgICAgICAgICAgMCAgIDEgfCB8ICAxIHwgICAgfCAgMSB8XG4vLyArLSAgICAgICAgICAgICAgICAgICAgLSsgKyAgICArICAgICsgICAgK1xuLy8g5YW25LitIM64IOihqOekuuaXi+i9rOeahOinkuW6pu+8jOmAhuaXtumSiOaXtiDOuCA+IDDvvIzpobrml7bpkojml7YgzrggPCAwXG4vLyBveCDooajnpLrmsLTlubPlgY/np7vvvIxveSDooajnpLrnq5bnm7TlgY/np7tcblxuLy8g5omA5pyJ55qE5Z2Q5qCH5Y+Y5o2i6YO95Y+v5Lul562J5Lu35Zyw6L2s5o2i5Li65Z2Q5qCH57O75Y+Y5o2i77yM6L+Z5qC35bCx5Y+v5Lul5L+d6K+B5aSE55CG55qE57uf5LiA5oCn77yM5LiL6Z2i5a6e546w55qE5piv5Z2Q5qCH57O75Y+Y5o2i77yMXG4vLyDlpoLmnpzmg7PopoHnlKjkuo7lnZDmoIflj5jmjaLvvIzkuZ/mmK/lj6/ku6XnmoQsIOWPqumcgOimgeWwhuWdkOagh+ezu+WPjeWQkeWPmOaNouS4i1xuLy8g5q2j5bi45p2l6K+05Z2Q5qCH57O75Y+Y5YyW6aG65bqP5Li6c3J0LCDpgqPkuYjpgIbov4fmnaXnmoTpobrluo/lsLHmmK90cnNcblxuLy8gc2NhbGUgdGhlbiByb3RhdGUgdGhlbiB0cmFuc2xhdGVcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnQoXG4gIGZyb21Db29yZFN5czogQ29vcmRTeXN0ZW0sXG4gIHRvQ29vcmRTeXM6IENvb3JkU3lzdGVtLFxuICBmcm9tOiBDb29yZGluYXRlIHwgQ29vcmRpbmF0ZVtdLFxuICByZXZlcnNlZD86IGJvb2xlYW5cbik6IENvb3JkaW5hdGUgfCBDb29yZGluYXRlW10ge1xuICAvLyBmaXJzdCBzY2FsZVxuICBpZiAoXCJ4XCIgaW4gZnJvbSAmJiBcInlcIiBpbiBmcm9tKSB7XG4gICAgaWYgKHJldmVyc2VkKSB7XG4gICAgICByZXR1cm4gdHJzKGZyb20sIGZyb21Db29yZFN5cywgdG9Db29yZFN5cykgYXMgQ29vcmRpbmF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHNydChmcm9tLCBmcm9tQ29vcmRTeXMsIHRvQ29vcmRTeXMpIGFzIENvb3JkaW5hdGU7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXM6IENvb3JkaW5hdGVbXSA9IFtdO1xuICAgIChmcm9tIGFzIENvb3JkaW5hdGVbXSkubWFwKChjb29yZDogQ29vcmRpbmF0ZSkgPT4ge1xuICAgICAgaWYgKHJldmVyc2VkKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2godHJzKGNvb3JkLCBmcm9tQ29vcmRTeXMsIHRvQ29vcmRTeXMpIGFzIENvb3JkaW5hdGUpO1xuICAgICAgfVxuICAgICAgY29vcmRpbmF0ZXMucHVzaChzcnQoY29vcmQsIGZyb21Db29yZFN5cywgdG9Db29yZFN5cykgYXMgQ29vcmRpbmF0ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNydChcbiAgZnJvbTogQ29vcmRpbmF0ZSxcbiAgZnJvbUNvb3JkU3lzOiBDb29yZFN5c3RlbSxcbiAgdG9Db29yZFN5czogQ29vcmRTeXN0ZW1cbik6IENvb3JkaW5hdGUge1xuICAvLyDlgY/np7vlj43lkJHnp7vliqhcbiAgY29uc3Qgb2Zmc2V0WDogbnVtYmVyID0gZnJvbUNvb3JkU3lzLnggLSB0b0Nvb3JkU3lzLng7XG4gIGNvbnN0IG9mZnNldFk6IG51bWJlciA9IGZyb21Db29yZFN5cy55IC0gdG9Db29yZFN5cy55O1xuICBjb25zdCByYWRpYW5EaWZmOiBudW1iZXIgPVxuICAgICh0b0Nvb3JkU3lzLnJhZGlhbiB8fCAwKSAtIChmcm9tQ29vcmRTeXMucmFkaWFuIHx8IDApO1xuICBjb25zdCBzY2FsZVhEaWZmOiBudW1iZXIgPVxuICAgICh0b0Nvb3JkU3lzLnNjYWxlWCB8fCAxKSAvIChmcm9tQ29vcmRTeXMuc2NhbGVYIHx8IDEpO1xuICBjb25zdCBzY2FsZVlEaWZmOiBudW1iZXIgPVxuICAgICh0b0Nvb3JkU3lzLnNjYWxlWSB8fCAxKSAvIChmcm9tQ29vcmRTeXMuc2NhbGVZIHx8IDEpO1xuICAvLyBzY2FsZVxuICBjb25zdCB4MTogbnVtYmVyID0gZnJvbS54ICogc2NhbGVYRGlmZjtcbiAgY29uc3QgeTE6IG51bWJlciA9IGZyb20ueSAqIHNjYWxlWURpZmY7XG4gIC8vIHJvdGF0ZSBhbmQgdHJhbnNsYXRlXG4gIGNvbnN0IG1zcjogbnVtYmVyID0gTWF0aC5zaW4ocmFkaWFuRGlmZik7XG4gIGNvbnN0IG1jcjogbnVtYmVyID0gTWF0aC5jb3MocmFkaWFuRGlmZik7XG4gIGNvbnN0IHgyOiBudW1iZXIgPSBtY3IgKiB4MSAtIG1zciAqIHkxICsgb2Zmc2V0WDtcbiAgY29uc3QgeTI6IG51bWJlciA9IG1zciAqIHgxICsgbWNyICogeTEgKyBvZmZzZXRZO1xuICByZXR1cm4ge1xuICAgIHg6IHgyLFxuICAgIHk6IHkyLFxuICB9O1xufVxuXG5mdW5jdGlvbiB0cnMoXG4gIGZyb206IENvb3JkaW5hdGUsXG4gIGZyb21Db29yZFN5czogQ29vcmRTeXN0ZW0sXG4gIHRvQ29vcmRTeXM6IENvb3JkU3lzdGVtXG4pOiBDb29yZGluYXRlIHtcbiAgY29uc3Qgb2Zmc2V0WDogbnVtYmVyID0gdG9Db29yZFN5cy54IC0gZnJvbUNvb3JkU3lzLng7XG4gIGNvbnN0IG9mZnNldFk6IG51bWJlciA9IHRvQ29vcmRTeXMueSAtIGZyb21Db29yZFN5cy55O1xuICBjb25zdCByYWRpYW5EaWZmOiBudW1iZXIgPVxuICAgICh0b0Nvb3JkU3lzLnJhZGlhbiB8fCAwKSAtIChmcm9tQ29vcmRTeXMucmFkaWFuIHx8IDApO1xuICBjb25zdCBzY2FsZVhEaWZmOiBudW1iZXIgPVxuICAgICh0b0Nvb3JkU3lzLnNjYWxlWCB8fCAxKSAvIChmcm9tQ29vcmRTeXMuc2NhbGVYIHx8IDEpO1xuICBjb25zdCBzY2FsZVlEaWZmOiBudW1iZXIgPVxuICAgICh0b0Nvb3JkU3lzLnNjYWxlWSB8fCAxKSAvIChmcm9tQ29vcmRTeXMuc2NhbGVZIHx8IDEpO1xuICAvLyB0cmFuc2xhdGVcbiAgbGV0IHgxOiBudW1iZXIgPSBmcm9tLnggKyBvZmZzZXRYO1xuICBsZXQgeTE6IG51bWJlciA9IGZyb20ueSArIG9mZnNldFk7XG4gIC8vIHJvdGF0ZVxuICBjb25zdCBtc3I6IG51bWJlciA9IE1hdGguc2luKHJhZGlhbkRpZmYpO1xuICBjb25zdCBtY3I6IG51bWJlciA9IE1hdGguY29zKHJhZGlhbkRpZmYpO1xuICBjb25zdCB4MjogbnVtYmVyID0gbWNyICogeDEgLSBtc3IgKiB5MTtcbiAgY29uc3QgeTI6IG51bWJlciA9IG1zciAqIHgxICsgbWNyICogeTE7XG4gIC8vIHNjYWxlXG4gIHgxID0geDIgKiBzY2FsZVhEaWZmO1xuICB5MSA9IHkyICogc2NhbGVZRGlmZjtcbiAgcmV0dXJuIHtcbiAgICB4OiB4MSxcbiAgICB5OiB5MSxcbiAgfTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7O0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF0QkE7QUF3QkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///./src/utils/coord-sys.ts