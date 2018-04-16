"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.renderChild=exports.A=exports.router=void 0;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),_react=require("react"),_react2=_interopRequireDefault(_react),_propTypes=require("prop-types"),_propTypes2=_interopRequireDefault(_propTypes),_createBrowserHistory=require("history/createBrowserHistory"),_createBrowserHistory2=_interopRequireDefault(_createBrowserHistory);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _possibleConstructorReturn(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function _inherits(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var rhaetia_history=(0,_createBrowserHistory2.default)(),router=exports.router=function(){function e(r,t){var o=this;if(_classCallCheck(this,e),!Object.getPrototypeOf(r).isReactComponent)throw new TypeError("root must be a React class component. Instead received: "+String(r));if("function"!=typeof r.onDidNavigate)throw new TypeError("onDidNavigate must be a function. Instead received: "+String(r.onDidNavigate));if(!Array.isArray(t))throw new TypeError("route_tree must be an array. Instead received: "+String(t));this.routes=this.setRoutes(t),this.path=this.getPath(),this.query=this.getQuery(),this.push=rhaetia_history.push,this.replace=rhaetia_history.replace,rhaetia_history.listen(function(){o.path=o.getPath(),o.query=o.getQuery(),r.onDidNavigate()})}return _createClass(e,[{key:"getPath",value:function(){return window.location.pathname.substring(1).split("/")}},{key:"getQuery",value:function(){var e={};return location.search.substring(1).split("&").forEach(function(r){var t=r.split("=");2===t.length&&(e[t[0]]=t[1])}),e}},{key:"setRoutes",value:function(e){for(var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,n=[],a=0;a<e.length;a++){var i=e[a];if(!Array.isArray(i))throw new TypeError("route_branch must be an array. Instead received: "+String(i));if(i.length<2||i.length>4)throw new TypeError("route_branch must have a length between 2 and 4.");if(null!==i[0]&&"string"!=typeof i[0])throw new TypeError("route_branch[0] must be either null or a string. Instead received: "+String(i[0]));if(!_react2.default.Component.isPrototypeOf(i[1]))throw new TypeError("route_branch[1] must be a React component. Instead received: "+String(i[1]));if(i.length>=3&&!Array.isArray(i[2]))throw new TypeError("route_branch[2] must be an array. Instead received: "+String(i[2]));if(null===i[0]&&2===i.length)throw new TypeError("route_branch[2] must be an array, if route_branch[0] is null.");if(4===i.length&&"boolean"!=typeof i[3])throw new TypeError("route_branch[3] must be a boolean. Instead received: "+String(i[3]));var s=Array.isArray(i[2]),u="";u=null===i[0]||""===i[0]?r:""===r?i[0]:r+"/"+i[0];var l=[].concat(_toConsumableArray(t),[i[1]]),h=void 0!==i[3]?i[3]:o;!1===s?n.push([u,l,h]):n=[].concat(_toConsumableArray(n),_toConsumableArray(this.setRoutes(i[2],u,l,h)))}return n}},{key:"match",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments[1];if("object"!==(void 0===e?"undefined":_typeof(e)))throw new TypeError("child_props must be an object. Instead received: "+String(e));if(void 0!==e.router)throw new TypeError("child_props cannot have the property: router");if("boolean"!=typeof r)throw new TypeError("is_authenticated must be a boolean. Instead received: "+String(r));e.router={push:this.push,replace:this.replace,path:this.path,query:this.query};for(var t=null,o=0;o<this.routes.length;o++){var n=this.routes[o],a=n[0].split("/"),i=n[1],s=n[2],u=!0,l={};if(a.length!==this.path.length)u=!1;else for(var h=0;h<a.length;h++)":"===a[h][0]?l[a[h].substring(1)]=this.path[h]:a[h]!==this.path[h]&&(u=!1);if(!0===u){if(!1===r&&!0===s)t=1;else if(!0===r&&!1===s)t=-1;else{e.router.params=l;for(var c=i.length-1;c>=0;c--)t=_react2.default.createElement(i[c],e,t)}break}}return t}}]),e}(),A=exports.A=function(e){function r(e){return _classCallCheck(this,r),_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e))}return _inherits(r,_react2.default.Component),_createClass(r,[{key:"goto",value:function(e){e.preventDefault(),!0===this.props.replace?rhaetia_history.replace(this.props.href):rhaetia_history.push(this.props.href)}},{key:"render",value:function(){var e=this;return _react2.default.createElement("a",{href:this.props.href,className:this.props.className,onClick:function(r){return e.goto(r)}},this.props.children)}}]),r}(),renderChild=exports.renderChild=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e&&_react2.default.cloneElement(e,Object.assign({},r))},Rhaetia={router:router,A:A,renderChild:renderChild};exports.default=Rhaetia,module.exports=Rhaetia;