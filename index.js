"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.A=void 0;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}(),_react=require("react"),_react2=_interopRequireDefault(_react),_propTypes=require("prop-types"),_propTypes2=_interopRequireDefault(_propTypes),_createBrowserHistory=require("history/createBrowserHistory"),_createBrowserHistory2=_interopRequireDefault(_createBrowserHistory);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var Rhaetia=function(){function e(t){_classCallCheck(this,e),this.history=(0,_createBrowserHistory2.default)(),this.routes=this.setRoutes(t),this.path=this.getLocation(),this.push=this.history.push,this.replace=this.history.replace,this.location=this.history.location}return _createClass(e,[{key:"listen",value:function(e){var t=this;this.history.listen(function(r){t.path=t.getLocation(),e()})}},{key:"getLocation",value:function(){return window.location.pathname.substring(1).split("/")}},{key:"setRoutes",value:function(e,t,r,o){var n=[];void 0===t&&(t=""),void 0===r&&(r=[]),void 0===o&&(o=null);for(var i=0;i<e.length;i++){var s=e[i],a=Array.isArray(s[2]),u="";u=null===s[0]||""===s[0]?t:""===t?s[0]:t+"/"+s[0];var l=[].concat(_toConsumableArray(r),[s[1]]),c=void 0!==s[3]?s[3]:o;!1===a?n.push([u,l,c]):n=[].concat(_toConsumableArray(n),_toConsumableArray(this.setRoutes(s[2],u,l,c)))}return n}},{key:"match",value:function(e,t){var r=null;"object"===(void 0===e?"undefined":_typeof(e))&&null!==e||(e={});for(var o=0;o<this.routes.length;o++){var n=this.routes[o],i=n[0].split("/"),s=n[1],a=n[2],u=!0,l={};if(i.length!==this.path.length)u=!1;else for(var c=0;c<i.length;c++)":"===i[c][0]?l[i[c].substring(1)]=this.path[c]:i[c]!==this.path[c]&&(u=!1);if(!0===u){if(!1===t&&!0===a)r=1;else if(!0===t&&!1===a)r=-1;else for(var p=s.length-1;p>=0;p--){var f=s[p];e.params=l,r=_react2.default.createElement(f,e,r)}break}}return r}}]),e}();exports.default=Rhaetia;var A=exports.A=function(e){function t(e){return _classCallCheck(this,t),_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return _inherits(t,_react2.default.Component),_createClass(t,[{key:"goto",value:function(e){e.preventDefault(),this.context.router.push(this.props.href)}},{key:"render",value:function(){var e=this;return _react2.default.createElement("a",{href:this.props.href,className:this.props.className,onClick:function(t){return e.goto(t)}},this.props.children)}}]),t}();A.contextTypes={router:_propTypes2.default.instanceOf(Rhaetia)};