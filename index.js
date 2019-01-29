"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.renderChild=exports.A=exports.router=void 0;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}(),_react=require("react"),_react2=_interopRequireDefault(_react),_propTypes=require("prop-types"),_propTypes2=_interopRequireDefault(_propTypes),_createBrowserHistory=require("history/createBrowserHistory"),_createBrowserHistory2=_interopRequireDefault(_createBrowserHistory);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _getUserConfirmation=void 0,rhaetia_history=(0,_createBrowserHistory2.default)({getUserConfirmation:function(e,t){_getUserConfirmation?_getUserConfirmation(e,t):t(window.confirm(e))}}),router=exports.router=function(){function e(t,r){var o=this;if(_classCallCheck(this,e),!Object.getPrototypeOf(t).isReactComponent)throw new TypeError("root must be a React class component. Instead received: "+String(t));if("function"!=typeof t.onDidNavigate)throw new TypeError("onDidNavigate must be a function. Instead received: "+String(t.onDidNavigate));if(!Array.isArray(r))throw new TypeError("route_tree must be an array. Instead received: "+String(r));this.set404=this.set404.bind(t),this.routes=this.setRoutes(r),this.path=this.getPath(),this.query=this.getQuery(),this.push=rhaetia_history.push,this.replace=rhaetia_history.replace,this.block=rhaetia_history.block,rhaetia_history.listen(function(){o.path=o.getPath(),o.query=o.getQuery(),t.onDidNavigate()})}return _createClass(e,[{key:"getPath",value:function(){var e=window.location.pathname.substring(1).split("/");return e.length>1&&""===e[e.length-1]&&e.pop(),e}},{key:"getQuery",value:function(){var e={};return location.search.substring(1).split("&").forEach(function(t){var r=t.split("=");2===r.length&&(e[r[0]]=r[1])}),e}},{key:"setRoutes",value:function(e){for(var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=[],i=null,a=function(a){var s=e[a];if(!Array.isArray(s))throw new TypeError("route_branch must be an array. Instead received: "+String(s));if(s.length<2||s.length>4)throw new TypeError("route_branch must have a length between 2 and 4.");if(null!==s[0]&&"string"!=typeof s[0])throw new TypeError("route_branch[0] must be either null or a string. Instead received: "+String(s[0]));if(!_react2.default.Component.isPrototypeOf(s[1]))throw new TypeError("route_branch[1] must be a React component. Instead received: "+String(s[1]));if(null===s[0]&&2===s.length)throw new TypeError("route_branch[2] must be an array of route_branches, if route_branch[0] is null.");if(3===s.length&&!Array.isArray(s[2])&&s[2].constructor!==Object)throw new TypeError("route_branch[2] must be either a route_options object, or an array of route_branches. Instead received: "+String(s[2]));if(4===s.length&&s[2].constructor!==Object)throw new TypeError("route_branch[2] must be a route_options object. Instead received: "+String(s[2]));if(4===s.length&&!Array.isArray(s[3]))throw new TypeError("route_branch[3] must be an array of route_branches. Instead received: "+String(s[3]));var u=[],l={};switch(s.length){case 4:u=s[3],l=s[2];break;case 3:Array.isArray(s[2])?u=s[2]:l=s[2]}var h="";h=null===s[0]||""===s[0]?r:""===r?s[0]:r+"/"+s[0];var c=[].concat(_toConsumableArray(o),[s[1]]),p=Object.assign({is_default:!1,match_mode:"exact",needs_children:!0},l),f={};h.split("/").filter(function(e){return":"===e[0]}).map(function(e){return"?"===e[e.length-1]?e.substring(1,e.length-1):e.substring(1)}).forEach(function(e){f[e]=null}),h=h.split("?")[0],u.length>0&&n.push.apply(n,_toConsumableArray(t.setRoutes(u,h,c))),0!==u.length&&!1!==p.needs_children||n.push([h,c,p,f]),null!==s[0]&&"?"===s[0][s[0].length-1]&&n.push([h.substring(0,h.lastIndexOf("/")),c,p,f]),!0===p.is_default&&(i=[r,c,p,f])},s=0;s<e.length;s++){var u=a(s);if("object"===(void 0===u?"undefined":_typeof(u)))return u.v}return null!==i&&n.push(i),n}},{key:"match",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if("object"!==(void 0===e?"undefined":_typeof(e)))throw new TypeError("child_props must be an object. Instead received: "+String(e));if(void 0!==e.router)throw new TypeError("child_props cannot have the property: router");e.router={push:this.push,replace:this.replace,block:this.block,path:this.path,query:this.query,setBlockDialog:this.setBlockDialog,set404:this.set404};for(var t=null,r=0;r<this.routes.length;r++){var o=this.routes[r],n=o[0].split("/"),i=o[1],a=!0,s=Object.assign({},o[3]);if(("forgiving"===o[2].match_mode||"loose"===o[2].match_mode)&&n.length>this.path.length||"exact"===o[2].match_mode&&n.length!==this.path.length)a=!1;else for(var u=0;u<n.length;u++){if(":"===n[u][0])s[n[u].substring(1)]=void 0!==this.path[u]&&""!==this.path[u]?this.path[u]:null;else n[u]!==this.path[u]&&(a=!1)}if(!0===a){e.router.params=s;for(var l=i.length-1;l>=0;l--)t=_react2.default.createElement(i[l],e,t);"forgiving"===o[2].match_mode&&n.length<this.path.length&&this.replace("/"+this.path.slice(0,n.length).join("/"));break}}return t}},{key:"setBlockDialog",value:function(e){_getUserConfirmation=e}},{key:"set404",value:function(){this.on404()}}]),e}(),A=exports.A=function(e){function t(e){return _classCallCheck(this,t),_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return _inherits(t,_react2.default.Component),_createClass(t,[{key:"goto",value:function(e){this.props.target||(e.preventDefault(),!0===this.props.replace?rhaetia_history.replace(this.props.href):rhaetia_history.push(this.props.href)),this.props.onClick&&this.props.onClick(e)}},{key:"render",value:function(){var e=this;return _react2.default.createElement("a",Object.assign({},this.props,{onClick:function(t){return e.goto(t)}}),this.props.children)}}]),t}();A.propTypes={href:_propTypes2.default.string.isRequired,onClick:_propTypes2.default.func,replace:_propTypes2.default.bool};var renderChild=exports.renderChild=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!_react2.default.isValidElement(e)&&null!==e)throw new TypeError("child must be a React element or null. Instead received: "+String(e));return e&&_react2.default.cloneElement(e,Object.assign({},t))},Rhaetia={router:router,A:A,renderChild:renderChild};exports.default=Rhaetia,module.exports=Rhaetia;