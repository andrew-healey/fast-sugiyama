Object.defineProperty(exports, "__esModule", {
  value: true
});
var PubSub = /** @class */ (function() {
  function PubSub() {
    this.reset();
  }
  PubSub.prototype.publish = function(topic, payload, sync) {
    if (sync === void 0) {
      sync = true;
    }
    if (!this._topics.has(topic))
      return;
    var subscribers = this._topics.get(topic);
    subscribers.forEach(function(fn, token) {
      if (sync) {
        return fn(topic, payload);
      }
      return new Promise(function(resolve, reject) {
        fn(topic, payload);
      });
    });
  };
  PubSub.prototype.subscribe = function(topics, fn) {
    var _this = this;
    var token = "_token_".concat(this._lastId++);
    if (typeof topics === "string") {
      this.addSubscriber(topics, fn, token);
      this.addToken(token, [topics]);
    }
    if (topics instanceof Array) {
      var uniqueTopics = Array.from(new Set(topics));
      var ids = uniqueTopics.map(function(topic) {
        _this.addSubscriber(topic, fn, token);
        return topic;
      });
      this.addToken(token, ids);
    }
    return token;
  };
  PubSub.prototype.addSubscriber = function(topic, fn, token) {
    if (!this._topics.get(topic)) {
      this._topics.set(topic, new Map());
      var topicMap = this._topics.get(topic);
      topicMap.set(token, fn);
    }
    var subscriber = this._topics.get(topic);
    subscriber.set(token, fn);
  };
  PubSub.prototype.addToken = function(token, ids) {
    this._tokenMap.set(token, ids);
  };
  PubSub.prototype.unsubscribe = function(token) {
    var _this = this;
    if (!this._tokenMap.has(token))
      return true;
    var topics = this._tokenMap.get(token);
    topics.map(function(topic) {
      return _this._topics.get(topic).delete(token);
    });
    return true;
  };
  PubSub.prototype.reset = function() {
    this._topics = new Map();
    this._tokenMap = new Map();
    this._lastId = 0;
  };
  return PubSub;
}());
exports.default = PubSub;
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvdXRpbHMvcHVic3ViLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3B1YnN1Yi50cz8xOTFlIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB0eXBlIENhbGxiYWNrRnVuYyA9ICh2OiBhbnksIHA6IGFueSkgPT4gYW55O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQdWJTdWIge1xuICBwcml2YXRlIF90b3BpY3M6IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIENhbGxiYWNrRnVuYz4+O1xuICBwcml2YXRlIF90b2tlbk1hcDogTWFwPHN0cmluZywgQXJyYXk8c3RyaW5nPj47XG4gIHByaXZhdGUgX2xhc3RJZDogbnVtYmVyO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cbiAgcHVibGlzaCh0b3BpYzogc3RyaW5nLCBwYXlsb2FkOiBvYmplY3QsIHN5bmMgPSB0cnVlKSB7XG4gICAgaWYgKCF0aGlzLl90b3BpY3MuaGFzKHRvcGljKSkgcmV0dXJuO1xuICAgIGNvbnN0IHN1YnNjcmliZXJzOiBNYXA8c3RyaW5nLCBDYWxsYmFja0Z1bmM+ID0gdGhpcy5fdG9waWNzLmdldCh0b3BpYyk7XG4gICAgc3Vic2NyaWJlcnMuZm9yRWFjaCgoZm46IENhbGxiYWNrRnVuYywgdG9rZW46IHN0cmluZykgPT4ge1xuICAgICAgaWYgKHN5bmMpIHtcbiAgICAgICAgcmV0dXJuIGZuKHRvcGljLCBwYXlsb2FkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGZuKHRvcGljLCBwYXlsb2FkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHN1YnNjcmliZSh0b3BpY3M6IHN0cmluZyB8IEFycmF5PHN0cmluZz4sIGZuOiBDYWxsYmFja0Z1bmMpOiBzdHJpbmcge1xuICAgIGNvbnN0IHRva2VuID0gYF90b2tlbl8ke3RoaXMuX2xhc3RJZCsrfWA7XG4gICAgaWYgKHR5cGVvZiB0b3BpY3MgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRoaXMuYWRkU3Vic2NyaWJlcih0b3BpY3MsIGZuLCB0b2tlbik7XG4gICAgICB0aGlzLmFkZFRva2VuKHRva2VuLCBbdG9waWNzXSk7XG4gICAgfVxuICAgIGlmICh0b3BpY3MgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgY29uc3QgdW5pcXVlVG9waWNzOiBBcnJheTxzdHJpbmc+ID0gQXJyYXkuZnJvbShuZXcgU2V0KHRvcGljcykpO1xuICAgICAgY29uc3QgaWRzOiBBcnJheTxzdHJpbmc+ID0gdW5pcXVlVG9waWNzLm1hcCgodG9waWMpID0+IHtcbiAgICAgICAgdGhpcy5hZGRTdWJzY3JpYmVyKHRvcGljLCBmbiwgdG9rZW4pO1xuICAgICAgICByZXR1cm4gdG9waWM7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYWRkVG9rZW4odG9rZW4sIGlkcyk7XG4gICAgfVxuICAgIHJldHVybiB0b2tlbjtcbiAgfVxuICBwcml2YXRlIGFkZFN1YnNjcmliZXIodG9waWM6IHN0cmluZywgZm46IENhbGxiYWNrRnVuYywgdG9rZW46IHN0cmluZykge1xuICAgIGlmICghdGhpcy5fdG9waWNzLmdldCh0b3BpYykpIHtcbiAgICAgIHRoaXMuX3RvcGljcy5zZXQodG9waWMsIG5ldyBNYXAoKSk7XG4gICAgICBjb25zdCB0b3BpY01hcDogTWFwPHN0cmluZywgQ2FsbGJhY2tGdW5jPiA9IHRoaXMuX3RvcGljcy5nZXQodG9waWMpO1xuICAgICAgdG9waWNNYXAuc2V0KHRva2VuLCBmbik7XG4gICAgfVxuICAgIGNvbnN0IHN1YnNjcmliZXI6IE1hcDxzdHJpbmcsIENhbGxiYWNrRnVuYz4gPSB0aGlzLl90b3BpY3MuZ2V0KHRvcGljKTtcbiAgICBzdWJzY3JpYmVyLnNldCh0b2tlbiwgZm4pO1xuICB9XG4gIHByaXZhdGUgYWRkVG9rZW4odG9rZW46IHN0cmluZywgaWRzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgdGhpcy5fdG9rZW5NYXAuc2V0KHRva2VuLCBpZHMpO1xuICB9XG4gIHVuc3Vic2NyaWJlKHRva2VuOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuX3Rva2VuTWFwLmhhcyh0b2tlbikpIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHRvcGljczogQXJyYXk8c3RyaW5nPiA9IHRoaXMuX3Rva2VuTWFwLmdldCh0b2tlbik7XG4gICAgdG9waWNzLm1hcCgodG9waWMpID0+IHRoaXMuX3RvcGljcy5nZXQodG9waWMpLmRlbGV0ZSh0b2tlbikpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX3RvcGljcyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl90b2tlbk1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9sYXN0SWQgPSAwO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7O0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTs7Iiwic291cmNlUm9vdCI6IiJ9
//# sourceURL=webpack-internal:///./src/utils/pubsub.ts