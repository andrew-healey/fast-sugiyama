Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Edge = exports.ActionEvent = exports.ActionType = exports.Action = void 0;
var Action;
(function(Action) {
  Action[Action["Null"] = -1] = "Null";
  Action[Action["MouseDown"] = 0] = "MouseDown";
  Action[Action["MouseMove"] = 1] = "MouseMove";
  Action[Action["MouseUp"] = 2] = "MouseUp";
  Action[Action["Click"] = 3] = "Click";
  Action[Action["DoubleClick"] = 4] = "DoubleClick";
  Action[Action["ContextMenu"] = 5] = "ContextMenu";
  Action[Action["Wheel"] = 6] = "Wheel";
  Action[Action["Scroll"] = 7] = "Scroll";
  Action[Action["Copy"] = 8] = "Copy";
  Action[Action["Paste"] = 9] = "Paste";
  Action[Action["Cut"] = 10] = "Cut";
  Action[Action["Delete"] = 11] = "Delete";
  Action[Action["SelectAll"] = 12] = "SelectAll";
  Action[Action["Save"] = 13] = "Save";
  Action[Action["SaveAs"] = 14] = "SaveAs";
  Action[Action["Find"] = 15] = "Find";
  Action[Action["Redo"] = 16] = "Redo";
  Action[Action["Undo"] = 17] = "Undo";
  Action[Action["Run"] = 18] = "Run";
  Action[Action["ReRun"] = 19] = "ReRun";
  Action[Action["Stop"] = 20] = "Stop";
  Action[Action["NodeMoving"] = 21] = "NodeMoving";
  Action[Action["NodeMoved"] = 22] = "NodeMoved";
  Action[Action["LinkConnect"] = 23] = "LinkConnect";
  Action[Action["LinkConnecting"] = 24] = "LinkConnecting";
  Action[Action["LinkConnected"] = 25] = "LinkConnected";
  Action[Action["Rename"] = 26] = "Rename";
  Action[Action["ViewResult"] = 27] = "ViewResult";
  Action[Action["ViewLog"] = 28] = "ViewLog";
  Action[Action["ExportResult"] = 29] = "ExportResult";
  Action[Action["Preview"] = 30] = "Preview";
  Action[Action["Keydown"] = 31] = "Keydown";
  Action[Action["UpdateGraph"] = 32] = "UpdateGraph";
  Action[Action["CreateModel"] = 33] = "CreateModel";
  Action[Action["RunFromNode"] = 34] = "RunFromNode";
  Action[Action["RunToNode"] = 35] = "RunToNode";
})(Action = exports.Action || (exports.Action = {}));
var ActionType;
(function(ActionType) {
  ActionType["Node"] = "0";
  ActionType["Port"] = "1";
  ActionType["Link"] = "2";
  ActionType["Blank"] = "3";
  ActionType["Outside"] = "4";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
// 定义鼠标事件
var ActionEvent = /** @class */ (function() {
  function ActionEvent(action, type, target, coordinate, src) {
    this.action = action;
    this.type = type;
    this.target = target;
    this.coordinate = coordinate;
    if (src)
      this.src = src;
  }
  ActionEvent.prototype.addSubAction = function(action) {
    this.subAction = action;
  };
  return ActionEvent;
}());
exports.ActionEvent = ActionEvent;
var Edge;
(function(Edge) {
  Edge["left"] = "left";
  Edge["right"] = "right";
  Edge["top"] = "top";
  Edge["bottom"] = "bottom";
  Edge["leftTop"] = "left-top";
  Edge["leftBottom"] = "left-bottom";
  Edge["rightTop"] = "right-top";
  Edge["rightBottom"] = "right-bottom";
  Edge["in"] = "in";
})(Edge = exports.Edge || (exports.Edge = {}));
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcG9uZW50cy9kZWxlZ2F0aW9uLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZGVsZWdhdGlvbi50cz85ZmNmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvb3JkaW5hdGUgfSBmcm9tIFwiQC9jb3JlL2ludGVyZmFjZVwiO1xuXG5leHBvcnQgZW51bSBBY3Rpb24ge1xuICBOdWxsID0gLTEsXG4gIE1vdXNlRG93biA9IDAsXG4gIE1vdXNlTW92ZSA9IDEsXG4gIE1vdXNlVXAgPSAyLFxuICBDbGljayA9IDMsXG4gIERvdWJsZUNsaWNrID0gNCxcbiAgQ29udGV4dE1lbnUgPSA1LFxuICBXaGVlbCA9IDYsXG4gIFNjcm9sbCA9IDcsXG4gIENvcHkgPSA4LFxuICBQYXN0ZSA9IDksXG4gIEN1dCA9IDEwLFxuICBEZWxldGUgPSAxMSxcbiAgU2VsZWN0QWxsID0gMTIsXG4gIFNhdmUgPSAxMyxcbiAgU2F2ZUFzID0gMTQsXG4gIEZpbmQgPSAxNSxcbiAgUmVkbyA9IDE2LFxuICBVbmRvID0gMTcsXG4gIFJ1biA9IDE4LFxuICBSZVJ1biA9IDE5LFxuICBTdG9wID0gMjAsXG4gIE5vZGVNb3ZpbmcgPSAyMSxcbiAgTm9kZU1vdmVkID0gMjIsXG4gIExpbmtDb25uZWN0ID0gMjMsXG4gIExpbmtDb25uZWN0aW5nID0gMjQsXG4gIExpbmtDb25uZWN0ZWQgPSAyNSxcbiAgUmVuYW1lID0gMjYsXG4gIFZpZXdSZXN1bHQgPSAyNyxcbiAgVmlld0xvZyA9IDI4LFxuICBFeHBvcnRSZXN1bHQgPSAyOSxcbiAgUHJldmlldyA9IDMwLFxuICBLZXlkb3duID0gMzEsXG4gIFVwZGF0ZUdyYXBoID0gMzIsXG4gIENyZWF0ZU1vZGVsID0gMzMsXG4gIFJ1bkZyb21Ob2RlID0gMzQsXG4gIFJ1blRvTm9kZSA9IDM1LFxufVxuXG5leHBvcnQgZW51bSBBY3Rpb25UeXBlIHtcbiAgTm9kZSA9IFwiMFwiLFxuICBQb3J0ID0gXCIxXCIsXG4gIExpbmsgPSBcIjJcIixcbiAgQmxhbmsgPSBcIjNcIixcbiAgT3V0c2lkZSA9IFwiNFwiLFxufVxuXG4vLyDlrprkuYnpvKDmoIfkuovku7ZcbmV4cG9ydCBjbGFzcyBBY3Rpb25FdmVudCB7XG4gIGFjdGlvbjogQWN0aW9uO1xuICB0eXBlOiBBY3Rpb25UeXBlO1xuICB0YXJnZXQ6IHN0cmluZztcbiAgY29vcmRpbmF0ZTogQ29vcmRpbmF0ZTtcbiAgc3JjOiBIVE1MRWxlbWVudDtcbiAgc3ViQWN0aW9uOiBBY3Rpb247XG4gIGNvbnN0cnVjdG9yKFxuICAgIGFjdGlvbjogQWN0aW9uLFxuICAgIHR5cGU6IEFjdGlvblR5cGUsXG4gICAgdGFyZ2V0OiBzdHJpbmcsXG4gICAgY29vcmRpbmF0ZTogQ29vcmRpbmF0ZSxcbiAgICBzcmM/OiBIVE1MRWxlbWVudFxuICApIHtcbiAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMuY29vcmRpbmF0ZSA9IGNvb3JkaW5hdGU7XG4gICAgaWYgKHNyYykgdGhpcy5zcmMgPSBzcmM7XG4gIH1cbiAgYWRkU3ViQWN0aW9uKGFjdGlvbjogQWN0aW9uKSB7XG4gICAgdGhpcy5zdWJBY3Rpb24gPSBhY3Rpb247XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gRWRnZSB7XG4gIGxlZnQgPSBcImxlZnRcIixcbiAgcmlnaHQgPSBcInJpZ2h0XCIsXG4gIHRvcCA9IFwidG9wXCIsXG4gIGJvdHRvbSA9IFwiYm90dG9tXCIsXG4gIGxlZnRUb3AgPSBcImxlZnQtdG9wXCIsXG4gIGxlZnRCb3R0b20gPSBcImxlZnQtYm90dG9tXCIsXG4gIHJpZ2h0VG9wID0gXCJyaWdodC10b3BcIixcbiAgcmlnaHRCb3R0b20gPSBcInJpZ2h0LWJvdHRvbVwiLFxuICBpbiA9IFwiaW5cIixcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7O0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQU9BO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBdkJBO0FBeUJBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=webpack-internal:///./src/components/delegation.ts