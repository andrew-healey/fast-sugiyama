Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInRect = exports.isCtrlOrMeta = exports.isKeyRepeat = exports.isRerun = exports.isRun = exports.isSelectAll = exports.isUndo = exports.isRedo = exports.isDelete = exports.isSaveAs = exports.isSave = exports.isPaste = exports.isCut = exports.isCopy = exports.Alpha = exports.FunctionKey = exports.EditingKey = exports.WhitespaceKey = exports.ModifierKey = exports.removeEventListener = exports.addEventListener = exports.containsElement = exports.getBoundingClientRect = exports.client = exports.offset = exports.viewport = exports.screen = exports.replaceClass = exports.containsClass = exports.toggleClass = exports.removeClass = exports.addClass = exports.scrollBy = exports.scroll = exports.transform = exports.setAttributes = exports.setAttribute = exports.getAttribute = exports.isLeftButton = exports.querySelector = exports.closest = void 0;
var others_1 = __webpack_require__( /*! ./others */ "./src/utils/others.ts");
var ua_1 = __webpack_require__( /*! ./ua */ "./src/utils/ua.ts");

function closest(el, selector) {
  return el.closest(selector) || null;
}
exports.closest = closest;

function querySelector(el, selector) {
  return el.querySelector(selector) || null;
}
exports.querySelector = querySelector;
// from stackoverflow: https://stackoverflow.com/questions/3944122/detect-left-mouse-button-press
function isLeftButton(event) {
  var nativeEvent = event.nativeEvent;
  if (nativeEvent.metaKey ||
    nativeEvent.ctrlKey ||
    nativeEvent.altKey ||
    nativeEvent.shiftKey) {
    return false;
  } else if ((0, others_1.hasProperty)(event, "buttons")) {
    return nativeEvent.buttons === 1;
  } else if ((0, others_1.hasProperty)(event, "which")) {
    return nativeEvent.which === 1;
  } else {
    return nativeEvent.button === 1 || nativeEvent.type === "click";
  }
}
exports.isLeftButton = isLeftButton;
// handle attribute funcitons
function getAttribute(el, name) {
  return el.getAttribute(name);
}
exports.getAttribute = getAttribute;

function setAttribute(el, name, value) {
  el.setAttribute(name, value);
}
exports.setAttribute = setAttribute;

function setAttributes(el, values) {
  Object.keys(values).map(function(key) {
    el.setAttribute(key, values[key]);
  });
}
exports.setAttributes = setAttributes;
// handle style functions
function transform(el, coord) {
  // when called frequently, setAttribute costs at least 49ms
  // el.setAttribute("transform", `translate(${coord.x}, ${coord.y})`);
  el.style.transform = "translate(".concat(coord.x, "px, ").concat(coord.y, "px)");
}
exports.transform = transform;

function scroll(el, coord) {
  el.scroll({
    top: coord.y,
    left: coord.x,
  });
}
exports.scroll = scroll;

function scrollBy(el, coord) {
  el.scrollBy({
    top: 0 - coord.y,
    left: 0 - coord.x,
  });
}
exports.scrollBy = scrollBy;
// 处理类的函数
function addClass(el) {
  var _a;
  var cls = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    cls[_i - 1] = arguments[_i];
  }
  (_a = el.classList).add.apply(_a, cls);
}
exports.addClass = addClass;

function removeClass(el) {
  var _a;
  var cls = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    cls[_i - 1] = arguments[_i];
  }
  (_a = el.classList).remove.apply(_a, cls);
}
exports.removeClass = removeClass;

function toggleClass(el, cls, force) {
  if (force === undefined) {
    el.classList.toggle(cls);
  } else {
    el.classList.toggle(cls, force);
  }
}
exports.toggleClass = toggleClass;

function containsClass(el, cls) {
  return el.classList.contains(cls);
}
exports.containsClass = containsClass;

function replaceClass(el, oldCls, newCls) {
  el.classList.replace(oldCls, newCls);
}
exports.replaceClass = replaceClass;
// window 容器相关
function screen() {
  return {
    width: window.screen.width,
    height: window.screen.height,
  };
}
exports.screen = screen;

function viewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
exports.viewport = viewport;

function offset(el) {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}
exports.offset = offset;

function client(el) {
  return {
    width: el.clientWidth,
    height: el.clientHeight,
  };
}
exports.client = client;

function getBoundingClientRect(el) {
  return el.getBoundingClientRect();
}
exports.getBoundingClientRect = getBoundingClientRect;
// 元素包含关系
function containsElement(container, el) {
  return container.contains(el);
}
exports.containsElement = containsElement;
// 监听事件
function addEventListener(el, eventName, callback) {
  el.addEventListener(eventName, callback);
}
exports.addEventListener = addEventListener;

function removeEventListener(el, eventName, callback) {
  el.removeEventListener(eventName, callback);
}
exports.removeEventListener = removeEventListener;
// 按键事件
/*
 * There are three types of keyboard events: keydown, keypress, and keyup.
 * For most keys, Gecko dispatches a sequence of key events like this:
 * 1. When the key is first pressed, the keydown event is sent.
 * 2. If the key is not a modifier key, the keypress event is sent.
 * 3. When the user releases the key, the keyup event is sent.
 *
 *
 */
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
var ModifierKey;
(function(ModifierKey) {
  ModifierKey["Control"] = "ctrlKey";
  ModifierKey["Alt"] = "altKey";
  ModifierKey["Meta"] = "metaKey";
  ModifierKey["Shift"] = "shiftKey";
})(ModifierKey = exports.ModifierKey || (exports.ModifierKey = {}));
var WhitespaceKey;
(function(WhitespaceKey) {
  WhitespaceKey["Enter"] = "Enter";
  WhitespaceKey["Tab"] = "Tab";
  WhitespaceKey["Space"] = " ";
})(WhitespaceKey = exports.WhitespaceKey || (exports.WhitespaceKey = {}));
var EditingKey;
(function(EditingKey) {
  EditingKey["Copy"] = "Copy";
  EditingKey["Cut"] = "Cut";
  EditingKey["Delete"] = "Delete";
  EditingKey["Paste"] = "Paste";
  EditingKey["Redo"] = "Redo";
  EditingKey["Undo"] = "Undo";
})(EditingKey = exports.EditingKey || (exports.EditingKey = {}));
var FunctionKey;
(function(FunctionKey) {
  FunctionKey["F5"] = "F5";
})(FunctionKey = exports.FunctionKey || (exports.FunctionKey = {}));
var Alpha;
(function(Alpha) {
  Alpha["a"] = "a";
  Alpha["c"] = "c";
  Alpha["d"] = "d";
  Alpha["f"] = "f";
  Alpha["s"] = "s";
  Alpha["v"] = "v";
  Alpha["x"] = "x";
  Alpha["z"] = "z";
})(Alpha = exports.Alpha || (exports.Alpha = {}));
// 复制, 剪切，粘贴, 运行，停止，删除，全选, 保存，另存为，查找, 重做，撤销
function isCombinationOf(event, modifier, key) {
  if (ua_1.default.IS_MAC && modifier === ModifierKey.Control) {
    modifier = ModifierKey.Meta;
  }
  return event.key === key && event[modifier];
}

function isCopy(event) {
  return isCombinationOf(event, ModifierKey.Control, Alpha.c);
}
exports.isCopy = isCopy;

function isCut(event) {
  return isCombinationOf(event, ModifierKey.Control, Alpha.x);
}
exports.isCut = isCut;

function isPaste(event) {
  return isCombinationOf(event, ModifierKey.Control, Alpha.v);
}
exports.isPaste = isPaste;

function isSave(event) {
  return (isCombinationOf(event, ModifierKey.Control, Alpha.s) && !event.shiftKey);
}
exports.isSave = isSave;

function isSaveAs(event) {
  return isCombinationOf(event, ModifierKey.Control, Alpha.s) && event.shiftKey;
}
exports.isSaveAs = isSaveAs;

function isDelete(event) {
  return event.key === EditingKey.Delete;
}
exports.isDelete = isDelete;

function isRedo(event) {
  return isCombinationOf(event, ModifierKey.Control, Alpha.z) && event.shiftKey;
}
exports.isRedo = isRedo;

function isUndo(event) {
  return (isCombinationOf(event, ModifierKey.Control, Alpha.z) && !event.shiftKey);
}
exports.isUndo = isUndo;

function isSelectAll(event) {
  return isCombinationOf(event, ModifierKey.Control, Alpha.a);
}
exports.isSelectAll = isSelectAll;
// For macOS only, in Windows F5 means refreshing the page
function isRun(event) {
  if (ua_1.default.IS_MAC) {
    return event.key === FunctionKey.F5 && !event.ctrlKey;
  }
  return false;
}
exports.isRun = isRun;

function isRerun(event) {
  if (ua_1.default.IS_MAC) {
    return isRun(event) && event.ctrlKey;
  }
  return false;
}
exports.isRerun = isRerun;

function isKeyRepeat(event) {
  return event.repeat;
}
exports.isKeyRepeat = isKeyRepeat;

function isCtrlOrMeta(event) {
  if (ua_1.default.IS_MAC) {
    return event.metaKey;
  } else {
    return event.ctrlKey;
  }
}
exports.isCtrlOrMeta = isCtrlOrMeta;
// 持续按下按键时的处理方法
// 在DOM Level 3规范中的调度的事件序列为
// keydown
// keypress
// keydown
// keypress
// <<repeating until the user release the key>>
// keyup
// From: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
// 判断一个矩形是否在另外一个矩形内
function isInRect(el, container) {
  // left underflow
  if (el.x < container.x) {
    return false;
  }
  // top underflow
  if (el.y < container.y) {
    return false;
  }
  // right overflow
  if (el.x + el.width > container.x + container.width) {
    return false;
  }
  // bottom overflow
  if (el.y + el.height > container.y + container.height) {
    return false;
  }
  return true;
}
exports.isInRect = isInRect;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvZG9tLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RvbS50cz8yMzQwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvb3JkaW5hdGUsIFZpZXdCb3ggfSBmcm9tIFwiQC9jb3JlL2ludGVyZmFjZVwiO1xuaW1wb3J0IHsgaGFzUHJvcGVydHkgfSBmcm9tIFwiLi9vdGhlcnNcIjtcbmltcG9ydCBVc2VyQWdlbnQgZnJvbSBcIi4vdWFcIjtcblxuZXhwb3J0IGludGVyZmFjZSBWaWV3UG9ydCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VzdChlbDogSFRNTEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICByZXR1cm4gKGVsLmNsb3Nlc3Qoc2VsZWN0b3IpIGFzIEhUTUxFbGVtZW50KSB8fCBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcXVlcnlTZWxlY3RvcihcbiAgZWw6IEhUTUxFbGVtZW50LFxuICBzZWxlY3Rvcjogc3RyaW5nXG4pOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICByZXR1cm4gZWwucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgfHwgbnVsbDtcbn1cblxuLy8gZnJvbSBzdGFja292ZXJmbG93OiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zOTQ0MTIyL2RldGVjdC1sZWZ0LW1vdXNlLWJ1dHRvbi1wcmVzc1xuZXhwb3J0IGZ1bmN0aW9uIGlzTGVmdEJ1dHRvbihcbiAgZXZlbnQ6IFJlYWN0LlN5bnRoZXRpY0V2ZW50PEhUTUxFbGVtZW50LCBNb3VzZUV2ZW50PlxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50ID0gZXZlbnQubmF0aXZlRXZlbnQ7XG4gIGlmIChcbiAgICBuYXRpdmVFdmVudC5tZXRhS2V5IHx8XG4gICAgbmF0aXZlRXZlbnQuY3RybEtleSB8fFxuICAgIG5hdGl2ZUV2ZW50LmFsdEtleSB8fFxuICAgIG5hdGl2ZUV2ZW50LnNoaWZ0S2V5XG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChoYXNQcm9wZXJ0eShldmVudCwgXCJidXR0b25zXCIpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUV2ZW50LmJ1dHRvbnMgPT09IDE7XG4gIH0gZWxzZSBpZiAoaGFzUHJvcGVydHkoZXZlbnQsIFwid2hpY2hcIikpIHtcbiAgICByZXR1cm4gbmF0aXZlRXZlbnQud2hpY2ggPT09IDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5hdGl2ZUV2ZW50LmJ1dHRvbiA9PT0gMSB8fCBuYXRpdmVFdmVudC50eXBlID09PSBcImNsaWNrXCI7XG4gIH1cbn1cblxuLy8gaGFuZGxlIGF0dHJpYnV0ZSBmdW5jaXRvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0dHJpYnV0ZShlbDogRWxlbWVudCwgbmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZShuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEF0dHJpYnV0ZShlbDogRWxlbWVudCwgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gIGVsLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKGVsOiBFbGVtZW50LCB2YWx1ZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgT2JqZWN0LmtleXModmFsdWVzKS5tYXAoKGtleTogc3RyaW5nKSA9PiB7XG4gICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsdWVzW2tleV0pO1xuICB9KTtcbn1cblxuLy8gaGFuZGxlIHN0eWxlIGZ1bmN0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtKGVsOiBIVE1MRWxlbWVudCB8IFNWR1NWR0VsZW1lbnQsIGNvb3JkOiBDb29yZGluYXRlKSB7XG4gIC8vIHdoZW4gY2FsbGVkIGZyZXF1ZW50bHksIHNldEF0dHJpYnV0ZSBjb3N0cyBhdCBsZWFzdCA0OW1zXG4gIC8vIGVsLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7Y29vcmQueH0sICR7Y29vcmQueX0pYCk7XG4gIGVsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtjb29yZC54fXB4LCAke2Nvb3JkLnl9cHgpYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbChlbDogSFRNTEVsZW1lbnQsIGNvb3JkOiBDb29yZGluYXRlKSB7XG4gIGVsLnNjcm9sbCh7XG4gICAgdG9wOiBjb29yZC55LFxuICAgIGxlZnQ6IGNvb3JkLngsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsQnkoZWw6IEhUTUxFbGVtZW50LCBjb29yZDogQ29vcmRpbmF0ZSkge1xuICBlbC5zY3JvbGxCeSh7XG4gICAgdG9wOiAwIC0gY29vcmQueSxcbiAgICBsZWZ0OiAwIC0gY29vcmQueCxcbiAgfSk7XG59XG5cbi8vIOWkhOeQhuexu+eahOWHveaVsFxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ2xhc3MoZWw6IEhUTUxFbGVtZW50LCAuLi5jbHM6IHN0cmluZ1tdKSB7XG4gIGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsOiBIVE1MRWxlbWVudCwgLi4uY2xzOiBzdHJpbmdbXSkge1xuICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNscyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVDbGFzcyhlbDogSFRNTEVsZW1lbnQsIGNsczogc3RyaW5nLCBmb3JjZT86IGJvb2xlYW4pIHtcbiAgaWYgKGZvcmNlID09PSB1bmRlZmluZWQpIHtcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKGNscyk7XG4gIH0gZWxzZSB7XG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShjbHMsIGZvcmNlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnNDbGFzcyhlbDogSFRNTEVsZW1lbnQsIGNsczogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VDbGFzcyhlbDogSFRNTEVsZW1lbnQsIG9sZENsczogc3RyaW5nLCBuZXdDbHM6IHN0cmluZykge1xuICBlbC5jbGFzc0xpc3QucmVwbGFjZShvbGRDbHMsIG5ld0Nscyk7XG59XG5cbi8vIHdpbmRvdyDlrrnlmajnm7jlhbNcblxuZXhwb3J0IGZ1bmN0aW9uIHNjcmVlbigpOiBWaWV3UG9ydCB7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpbmRvdy5zY3JlZW4ud2lkdGgsXG4gICAgaGVpZ2h0OiB3aW5kb3cuc2NyZWVuLmhlaWdodCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpZXdwb3J0KCk6IFZpZXdQb3J0IHtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvZmZzZXQoZWw6IEhUTUxFbGVtZW50KTogVmlld1BvcnQge1xuICByZXR1cm4ge1xuICAgIHdpZHRoOiBlbC5vZmZzZXRXaWR0aCxcbiAgICBoZWlnaHQ6IGVsLm9mZnNldEhlaWdodCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsaWVudChlbDogSFRNTEVsZW1lbnQpOiBWaWV3UG9ydCB7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGVsLmNsaWVudFdpZHRoLFxuICAgIGhlaWdodDogZWwuY2xpZW50SGVpZ2h0LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsOiBIVE1MRWxlbWVudCk6IERPTVJlY3Qge1xuICByZXR1cm4gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgYXMgRE9NUmVjdDtcbn1cblxuLy8g5YWD57Sg5YyF5ZCr5YWz57O7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluc0VsZW1lbnQoXG4gIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gIGVsOiBIVE1MRWxlbWVudFxuKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb250YWluZXIuY29udGFpbnMoZWwpO1xufVxuXG4vLyDnm5HlkKzkuovku7ZcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIoXG4gIGVsOiBIVE1MRWxlbWVudCB8IFdpbmRvdyxcbiAgZXZlbnROYW1lOiBzdHJpbmcsXG4gIGNhbGxiYWNrOiAoZXZlbnQ6IEV2ZW50KSA9PiBhbnlcbikge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgZWw6IEhUTUxFbGVtZW50IHwgV2luZG93LFxuICBldmVudE5hbWU6IHN0cmluZyxcbiAgY2FsbGJhY2s6IChldmVudDogRXZlbnQpID0+IGFueVxuKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYWxsYmFjayk7XG59XG5cbi8vIOaMiemUruS6i+S7tlxuLypcbiAqIFRoZXJlIGFyZSB0aHJlZSB0eXBlcyBvZiBrZXlib2FyZCBldmVudHM6IGtleWRvd24sIGtleXByZXNzLCBhbmQga2V5dXAuXG4gKiBGb3IgbW9zdCBrZXlzLCBHZWNrbyBkaXNwYXRjaGVzIGEgc2VxdWVuY2Ugb2Yga2V5IGV2ZW50cyBsaWtlIHRoaXM6XG4gKiAxLiBXaGVuIHRoZSBrZXkgaXMgZmlyc3QgcHJlc3NlZCwgdGhlIGtleWRvd24gZXZlbnQgaXMgc2VudC5cbiAqIDIuIElmIHRoZSBrZXkgaXMgbm90IGEgbW9kaWZpZXIga2V5LCB0aGUga2V5cHJlc3MgZXZlbnQgaXMgc2VudC5cbiAqIDMuIFdoZW4gdGhlIHVzZXIgcmVsZWFzZXMgdGhlIGtleSwgdGhlIGtleXVwIGV2ZW50IGlzIHNlbnQuXG4gKlxuICpcbiAqL1xuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9rZXkvS2V5X1ZhbHVlc1xuXG5leHBvcnQgZW51bSBNb2RpZmllcktleSB7XG4gIENvbnRyb2wgPSBcImN0cmxLZXlcIixcbiAgQWx0ID0gXCJhbHRLZXlcIixcbiAgTWV0YSA9IFwibWV0YUtleVwiLFxuICBTaGlmdCA9IFwic2hpZnRLZXlcIixcbn1cblxuZXhwb3J0IGVudW0gV2hpdGVzcGFjZUtleSB7XG4gIEVudGVyID0gXCJFbnRlclwiLFxuICBUYWIgPSBcIlRhYlwiLFxuICBTcGFjZSA9IFwiIFwiLFxufVxuXG5leHBvcnQgZW51bSBFZGl0aW5nS2V5IHtcbiAgQ29weSA9IFwiQ29weVwiLFxuICBDdXQgPSBcIkN1dFwiLFxuICBEZWxldGUgPSBcIkRlbGV0ZVwiLFxuICBQYXN0ZSA9IFwiUGFzdGVcIixcbiAgUmVkbyA9IFwiUmVkb1wiLFxuICBVbmRvID0gXCJVbmRvXCIsXG59XG5cbmV4cG9ydCBlbnVtIEZ1bmN0aW9uS2V5IHtcbiAgRjUgPSBcIkY1XCIsXG59XG5cbmV4cG9ydCBlbnVtIEFscGhhIHtcbiAgYSA9IFwiYVwiLFxuICBjID0gXCJjXCIsXG4gIGQgPSBcImRcIixcbiAgZiA9IFwiZlwiLFxuICBzID0gXCJzXCIsXG4gIHYgPSBcInZcIixcbiAgeCA9IFwieFwiLFxuICB6ID0gXCJ6XCIsXG59XG5cbi8vIOWkjeWItiwg5Ymq5YiH77yM57KY6LS0LCDov5DooYzvvIzlgZzmraLvvIzliKDpmaTvvIzlhajpgIksIOS/neWtmO+8jOWPpuWtmOS4uu+8jOafpeaJviwg6YeN5YGa77yM5pKk6ZSAXG5cbmZ1bmN0aW9uIGlzQ29tYmluYXRpb25PZihcbiAgZXZlbnQ6IEtleWJvYXJkRXZlbnQsXG4gIG1vZGlmaWVyOiBNb2RpZmllcktleSxcbiAga2V5OiBBbHBoYVxuKTogYm9vbGVhbiB7XG4gIGlmIChVc2VyQWdlbnQuSVNfTUFDICYmIG1vZGlmaWVyID09PSBNb2RpZmllcktleS5Db250cm9sKSB7XG4gICAgbW9kaWZpZXIgPSBNb2RpZmllcktleS5NZXRhO1xuICB9XG4gIHJldHVybiBldmVudC5rZXkgPT09IGtleSAmJiBldmVudFttb2RpZmllcl07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvcHkoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQ29tYmluYXRpb25PZihldmVudCwgTW9kaWZpZXJLZXkuQ29udHJvbCwgQWxwaGEuYyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0N1dChldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNDb21iaW5hdGlvbk9mKGV2ZW50LCBNb2RpZmllcktleS5Db250cm9sLCBBbHBoYS54KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGFzdGUoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQ29tYmluYXRpb25PZihldmVudCwgTW9kaWZpZXJLZXkuQ29udHJvbCwgQWxwaGEudik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NhdmUoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBpc0NvbWJpbmF0aW9uT2YoZXZlbnQsIE1vZGlmaWVyS2V5LkNvbnRyb2wsIEFscGhhLnMpICYmICFldmVudC5zaGlmdEtleVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTYXZlQXMoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzQ29tYmluYXRpb25PZihldmVudCwgTW9kaWZpZXJLZXkuQ29udHJvbCwgQWxwaGEucykgJiYgZXZlbnQuc2hpZnRLZXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlbGV0ZShldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZXZlbnQua2V5ID09PSBFZGl0aW5nS2V5LkRlbGV0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVkbyhldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNDb21iaW5hdGlvbk9mKGV2ZW50LCBNb2RpZmllcktleS5Db250cm9sLCBBbHBoYS56KSAmJiBldmVudC5zaGlmdEtleTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5kbyhldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGlzQ29tYmluYXRpb25PZihldmVudCwgTW9kaWZpZXJLZXkuQ29udHJvbCwgQWxwaGEueikgJiYgIWV2ZW50LnNoaWZ0S2V5XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NlbGVjdEFsbChldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNDb21iaW5hdGlvbk9mKGV2ZW50LCBNb2RpZmllcktleS5Db250cm9sLCBBbHBoYS5hKTtcbn1cblxuLy8gRm9yIG1hY09TIG9ubHksIGluIFdpbmRvd3MgRjUgbWVhbnMgcmVmcmVzaGluZyB0aGUgcGFnZVxuZXhwb3J0IGZ1bmN0aW9uIGlzUnVuKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogYm9vbGVhbiB7XG4gIGlmIChVc2VyQWdlbnQuSVNfTUFDKSB7XG4gICAgcmV0dXJuIGV2ZW50LmtleSA9PT0gRnVuY3Rpb25LZXkuRjUgJiYgIWV2ZW50LmN0cmxLZXk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZXJ1bihldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICBpZiAoVXNlckFnZW50LklTX01BQykge1xuICAgIHJldHVybiBpc1J1bihldmVudCkgJiYgZXZlbnQuY3RybEtleTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0tleVJlcGVhdChldmVudDogS2V5Ym9hcmRFdmVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZXZlbnQucmVwZWF0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDdHJsT3JNZXRhKGV2ZW50OiBNb3VzZUV2ZW50KTogYm9vbGVhbiB7XG4gIGlmIChVc2VyQWdlbnQuSVNfTUFDKSB7XG4gICAgcmV0dXJuIGV2ZW50Lm1ldGFLZXk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV2ZW50LmN0cmxLZXk7XG4gIH1cbn1cblxuLy8g5oyB57ut5oyJ5LiL5oyJ6ZSu5pe255qE5aSE55CG5pa55rOVXG4vLyDlnKhET00gTGV2ZWwgM+inhOiMg+S4reeahOiwg+W6pueahOS6i+S7tuW6j+WIl+S4ulxuLy8ga2V5ZG93blxuLy8ga2V5cHJlc3Ncbi8vIGtleWRvd25cbi8vIGtleXByZXNzXG4vLyA8PHJlcGVhdGluZyB1bnRpbCB0aGUgdXNlciByZWxlYXNlIHRoZSBrZXk+PlxuLy8ga2V5dXBcblxuLy8gRnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0tleWJvYXJkRXZlbnRcblxuLy8g5Yik5pat5LiA5Liq55+p5b2i5piv5ZCm5Zyo5Y+m5aSW5LiA5Liq55+p5b2i5YaFXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0luUmVjdChlbDogVmlld0JveCwgY29udGFpbmVyOiBWaWV3Qm94KTogYm9vbGVhbiB7XG4gIC8vIGxlZnQgdW5kZXJmbG93XG4gIGlmIChlbC54IDwgY29udGFpbmVyLngpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gdG9wIHVuZGVyZmxvd1xuICBpZiAoZWwueSA8IGNvbnRhaW5lci55KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIHJpZ2h0IG92ZXJmbG93XG4gIGlmIChlbC54ICsgZWwud2lkdGggPiBjb250YWluZXIueCArIGNvbnRhaW5lci53aWR0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBib3R0b20gb3ZlcmZsb3dcbiAgaWYgKGVsLnkgKyBlbC5oZWlnaHQgPiBjb250YWluZXIueSArIGNvbnRhaW5lci5oZWlnaHQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG4iXSwibWFwcGluZ3MiOiI7OztBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBSUE7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFsQkE7QUFvQkE7QUFFQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFFQTs7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFDQTtBQUZBO0FBSUE7O0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUVBO0FBSUE7QUFDQTtBQUxBO0FBT0E7QUFFQTtBQUtBO0FBQ0E7QUFOQTtBQVFBO0FBS0E7QUFDQTtBQU5BO0FBUUE7QUFDQTs7Ozs7Ozs7QUFRQTtBQUVBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFHQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUdBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxCQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/utils/dom.ts