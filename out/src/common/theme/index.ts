Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTheme = exports.cssVarPrefix = void 0;
// 暗色主题颜色配置
var DarkThemeConfig = {
  "background-color": "#1D1E1F",
  "background-dot-color": "rgba(190, 208, 255, 0.2)",
  "line-default-color": "#787F86",
  "line-running-color": "#2B98FD",
  "node-background-color": "rgba(29, 30, 31, 0.8)",
  "node-background-hover-color": "rgba(50, 146, 245, 0.43)",
  "node-border-color": "rgba(40, 157, 233, 0.8)",
  "node-run-success": "#5CDD9B",
  "node-run-error": "#F05252",
  "node-font-color": "#fff",
  "node-icon-color": "#8D94A1",
  "port-background-color": "#2B98FD",
  "port-border-color": "#111730",
  "port-connectable-color": "rgba(57, 202, 116, 0.6)",
  "port-not-connectable-color": "rgba(240, 82, 82, 0.6)",
  "box-shadow-color": "#8D94A1",
  "loading-color": "#3f90dc",
  "loading-bg-color": "rgba(224, 224, 224, 0.3)",
  "toolbox-font-color": "#fff",
  "toolbox-border-color": "#676869",
  "toolbox-bg-color": "#2B2D31",
  "toolbox-bg-color-reverse": "#fff",
  "contextmenu-bg-color": "#2b2d31",
  "contextmenu-border-color": "#2b2d31",
  "contextmenu-boxshadow-color": "rgba(0, 0, 0, 1)",
  "contextmenu-item-color": "#e6f7ff",
  "contextmenu-item-sep-color": "#43464c",
  "contextmenu-item-icon-color": "#e6f7ff",
  "contextmenu-item-shortcut-color": "#e6f7ff",
  "contextmenu-item-sub-arrow": "#e6f7ff",
  "contextmenu-item-hover-color": "#676869",
};
// 浅色主题颜色配置
var LightThemeConfig = {
  "background-color": "#F5F7FA",
  "background-dot-color": "#F5F7FA",
  "line-default-color": "gray",
  "line-running-color": "#3F90DC",
  "node-background-color": "#fff",
  "node-background-hover-color": "rgba(227, 244, 255, 0.9)",
  "node-border-color": "rgba(40, 157, 233, 0.8)",
  "node-run-success": "#5CDD9B",
  "node-run-error": "#F05252",
  "node-font-color": "rgba(0, 0, 0, 0.7)",
  "node-icon-color": "#8D94A1",
  "port-background-color": "#FFF",
  "port-border-color": "rgba(0, 0, 0, 0.38)",
  "port-connectable-color": "rgba(57, 202, 116, 0.6)",
  "port-not-connectable-color": "rgba(240, 82, 82, 0.6)",
  "box-shadow-color": "#8D94A1",
  "loading-color": "#3f90dc",
  "loading-bg-color": "rgba(0, 0, 0, 0.1)",
  "toolbox-font-color": "rgb(141, 148, 161)",
  "toolbox-border-color": "rgb(224, 224, 224)",
  "toolbox-bg-color": "#fff",
  "toolbox-bg-color-reverse": "rgb(141, 148, 161)",
  "contextmenu-bg-color": "#fff",
  "contextmenu-border-color": "#eee",
  "contextmenu-boxshadow-color": "rgba(0, 0, 0, 0.15)",
  "contextmenu-item-color": "#333",
  "contextmenu-item-sep-color": "#eee",
  "contextmenu-item-icon-color": "#666",
  "contextmenu-item-shortcut-color": "#aaa",
  "contextmenu-item-sub-arrow": "#333",
  "contextmenu-item-hover-color": "#e8f6ff",
};
var ThemeMap = new Map();
ThemeMap.set("dark", DarkThemeConfig);
ThemeMap.set("light", LightThemeConfig);
exports.cssVarPrefix = "--";

function updateTheme(themeName) {
  var selectedThemeConfig = ThemeMap.get(themeName) || LightThemeConfig;
  var html = document.getElementsByName("html")[0] || document.documentElement;
  Object.keys(selectedThemeConfig).forEach(function(key) {
    html.style.setProperty("".concat(exports.cssVarPrefix).concat(key), selectedThemeConfig[key]);
  });
}
exports.updateTheme = updateTheme;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tbW9uL3RoZW1lL2luZGV4LnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi90aGVtZS9pbmRleC50cz8zYmM1Il0sInNvdXJjZXNDb250ZW50IjpbImludGVyZmFjZSBUaGVtZUNvbmZpZyB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cblxuLy8g5pqX6Imy5Li76aKY6aKc6Imy6YWN572uXG5jb25zdCBEYXJrVGhlbWVDb25maWc6IFRoZW1lQ29uZmlnID0ge1xuICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjMUQxRTFGXCIsXG4gIFwiYmFja2dyb3VuZC1kb3QtY29sb3JcIjogXCJyZ2JhKDE5MCwgMjA4LCAyNTUsIDAuMilcIixcbiAgXCJsaW5lLWRlZmF1bHQtY29sb3JcIjogXCIjNzg3Rjg2XCIsXG4gIFwibGluZS1ydW5uaW5nLWNvbG9yXCI6IFwiIzJCOThGRFwiLFxuICBcIm5vZGUtYmFja2dyb3VuZC1jb2xvclwiOiBcInJnYmEoMjksIDMwLCAzMSwgMC44KVwiLFxuICBcIm5vZGUtYmFja2dyb3VuZC1ob3Zlci1jb2xvclwiOiBcInJnYmEoNTAsIDE0NiwgMjQ1LCAwLjQzKVwiLFxuICBcIm5vZGUtYm9yZGVyLWNvbG9yXCI6IFwicmdiYSg0MCwgMTU3LCAyMzMsIDAuOClcIixcbiAgXCJub2RlLXJ1bi1zdWNjZXNzXCI6IFwiIzVDREQ5QlwiLFxuICBcIm5vZGUtcnVuLWVycm9yXCI6IFwiI0YwNTI1MlwiLFxuICBcIm5vZGUtZm9udC1jb2xvclwiOiBcIiNmZmZcIixcbiAgXCJub2RlLWljb24tY29sb3JcIjogXCIjOEQ5NEExXCIsXG4gIFwicG9ydC1iYWNrZ3JvdW5kLWNvbG9yXCI6IFwiIzJCOThGRFwiLFxuICBcInBvcnQtYm9yZGVyLWNvbG9yXCI6IFwiIzExMTczMFwiLFxuICBcInBvcnQtY29ubmVjdGFibGUtY29sb3JcIjogXCJyZ2JhKDU3LCAyMDIsIDExNiwgMC42KVwiLFxuICBcInBvcnQtbm90LWNvbm5lY3RhYmxlLWNvbG9yXCI6IFwicmdiYSgyNDAsIDgyLCA4MiwgMC42KVwiLFxuICBcImJveC1zaGFkb3ctY29sb3JcIjogXCIjOEQ5NEExXCIsXG4gIFwibG9hZGluZy1jb2xvclwiOiBcIiMzZjkwZGNcIixcbiAgXCJsb2FkaW5nLWJnLWNvbG9yXCI6IFwicmdiYSgyMjQsIDIyNCwgMjI0LCAwLjMpXCIsXG4gIFwidG9vbGJveC1mb250LWNvbG9yXCI6IFwiI2ZmZlwiLFxuICBcInRvb2xib3gtYm9yZGVyLWNvbG9yXCI6IFwiIzY3Njg2OVwiLFxuICBcInRvb2xib3gtYmctY29sb3JcIjogXCIjMkIyRDMxXCIsXG4gIFwidG9vbGJveC1iZy1jb2xvci1yZXZlcnNlXCI6IFwiI2ZmZlwiLFxuICBcImNvbnRleHRtZW51LWJnLWNvbG9yXCI6IFwiIzJiMmQzMVwiLFxuICBcImNvbnRleHRtZW51LWJvcmRlci1jb2xvclwiOiBcIiMyYjJkMzFcIixcbiAgXCJjb250ZXh0bWVudS1ib3hzaGFkb3ctY29sb3JcIjogXCJyZ2JhKDAsIDAsIDAsIDEpXCIsXG4gIFwiY29udGV4dG1lbnUtaXRlbS1jb2xvclwiOiBcIiNlNmY3ZmZcIixcbiAgXCJjb250ZXh0bWVudS1pdGVtLXNlcC1jb2xvclwiOiBcIiM0MzQ2NGNcIixcbiAgXCJjb250ZXh0bWVudS1pdGVtLWljb24tY29sb3JcIjogXCIjZTZmN2ZmXCIsXG4gIFwiY29udGV4dG1lbnUtaXRlbS1zaG9ydGN1dC1jb2xvclwiOiBcIiNlNmY3ZmZcIixcbiAgXCJjb250ZXh0bWVudS1pdGVtLXN1Yi1hcnJvd1wiOiBcIiNlNmY3ZmZcIixcbiAgXCJjb250ZXh0bWVudS1pdGVtLWhvdmVyLWNvbG9yXCI6IFwiIzY3Njg2OVwiLFxufTtcblxuLy8g5rWF6Imy5Li76aKY6aKc6Imy6YWN572uXG5jb25zdCBMaWdodFRoZW1lQ29uZmlnOiBUaGVtZUNvbmZpZyA9IHtcbiAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI0Y1RjdGQVwiLFxuICBcImJhY2tncm91bmQtZG90LWNvbG9yXCI6IFwiI0Y1RjdGQVwiLFxuICBcImxpbmUtZGVmYXVsdC1jb2xvclwiOiBcImdyYXlcIixcbiAgXCJsaW5lLXJ1bm5pbmctY29sb3JcIjogXCIjM0Y5MERDXCIsXG4gIFwibm9kZS1iYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICBcIm5vZGUtYmFja2dyb3VuZC1ob3Zlci1jb2xvclwiOiBcInJnYmEoMjI3LCAyNDQsIDI1NSwgMC45KVwiLFxuICBcIm5vZGUtYm9yZGVyLWNvbG9yXCI6IFwicmdiYSg0MCwgMTU3LCAyMzMsIDAuOClcIixcbiAgXCJub2RlLXJ1bi1zdWNjZXNzXCI6IFwiIzVDREQ5QlwiLFxuICBcIm5vZGUtcnVuLWVycm9yXCI6IFwiI0YwNTI1MlwiLFxuICBcIm5vZGUtZm9udC1jb2xvclwiOiBcInJnYmEoMCwgMCwgMCwgMC43KVwiLFxuICBcIm5vZGUtaWNvbi1jb2xvclwiOiBcIiM4RDk0QTFcIixcbiAgXCJwb3J0LWJhY2tncm91bmQtY29sb3JcIjogXCIjRkZGXCIsXG4gIFwicG9ydC1ib3JkZXItY29sb3JcIjogXCJyZ2JhKDAsIDAsIDAsIDAuMzgpXCIsXG4gIFwicG9ydC1jb25uZWN0YWJsZS1jb2xvclwiOiBcInJnYmEoNTcsIDIwMiwgMTE2LCAwLjYpXCIsXG4gIFwicG9ydC1ub3QtY29ubmVjdGFibGUtY29sb3JcIjogXCJyZ2JhKDI0MCwgODIsIDgyLCAwLjYpXCIsXG4gIFwiYm94LXNoYWRvdy1jb2xvclwiOiBcIiM4RDk0QTFcIixcbiAgXCJsb2FkaW5nLWNvbG9yXCI6IFwiIzNmOTBkY1wiLFxuICBcImxvYWRpbmctYmctY29sb3JcIjogXCJyZ2JhKDAsIDAsIDAsIDAuMSlcIixcbiAgXCJ0b29sYm94LWZvbnQtY29sb3JcIjogXCJyZ2IoMTQxLCAxNDgsIDE2MSlcIixcbiAgXCJ0b29sYm94LWJvcmRlci1jb2xvclwiOiBcInJnYigyMjQsIDIyNCwgMjI0KVwiLFxuICBcInRvb2xib3gtYmctY29sb3JcIjogXCIjZmZmXCIsXG4gIFwidG9vbGJveC1iZy1jb2xvci1yZXZlcnNlXCI6IFwicmdiKDE0MSwgMTQ4LCAxNjEpXCIsXG4gIFwiY29udGV4dG1lbnUtYmctY29sb3JcIjogXCIjZmZmXCIsXG4gIFwiY29udGV4dG1lbnUtYm9yZGVyLWNvbG9yXCI6IFwiI2VlZVwiLFxuICBcImNvbnRleHRtZW51LWJveHNoYWRvdy1jb2xvclwiOiBcInJnYmEoMCwgMCwgMCwgMC4xNSlcIixcbiAgXCJjb250ZXh0bWVudS1pdGVtLWNvbG9yXCI6IFwiIzMzM1wiLFxuICBcImNvbnRleHRtZW51LWl0ZW0tc2VwLWNvbG9yXCI6IFwiI2VlZVwiLFxuICBcImNvbnRleHRtZW51LWl0ZW0taWNvbi1jb2xvclwiOiBcIiM2NjZcIixcbiAgXCJjb250ZXh0bWVudS1pdGVtLXNob3J0Y3V0LWNvbG9yXCI6IFwiI2FhYVwiLFxuICBcImNvbnRleHRtZW51LWl0ZW0tc3ViLWFycm93XCI6IFwiIzMzM1wiLFxuICBcImNvbnRleHRtZW51LWl0ZW0taG92ZXItY29sb3JcIjogXCIjZThmNmZmXCIsXG59O1xuXG5jb25zdCBUaGVtZU1hcDogTWFwPHN0cmluZywgVGhlbWVDb25maWc+ID0gbmV3IE1hcCgpO1xuVGhlbWVNYXAuc2V0KFwiZGFya1wiLCBEYXJrVGhlbWVDb25maWcpO1xuVGhlbWVNYXAuc2V0KFwibGlnaHRcIiwgTGlnaHRUaGVtZUNvbmZpZyk7XG5cbmV4cG9ydCBjb25zdCBjc3NWYXJQcmVmaXggPSBcIi0tXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUaGVtZSh0aGVtZU5hbWU6IHN0cmluZykge1xuICBjb25zdCBzZWxlY3RlZFRoZW1lQ29uZmlnOiBUaGVtZUNvbmZpZyA9XG4gICAgVGhlbWVNYXAuZ2V0KHRoZW1lTmFtZSkgfHwgTGlnaHRUaGVtZUNvbmZpZztcbiAgY29uc3QgaHRtbDogSFRNTEVsZW1lbnQgPVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKFwiaHRtbFwiKVswXSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIE9iamVjdC5rZXlzKHNlbGVjdGVkVGhlbWVDb25maWcpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgaHRtbC5zdHlsZS5zZXRQcm9wZXJ0eShgJHtjc3NWYXJQcmVmaXh9JHtrZXl9YCwgc2VsZWN0ZWRUaGVtZUNvbmZpZ1trZXldKTtcbiAgfSk7XG59XG4iXSwibWFwcGluZ3MiOiI7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/common/theme/index.ts