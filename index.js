"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.renderChild=exports.A=exports.Router=void 0;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,r,o){return r&&e(t.prototype,r),o&&e(t,o),t}}(),_react=require("react"),_react2=_interopRequireDefault(_react),_propTypes=require("prop-types"),_propTypes2=_interopRequireDefault(_propTypes),_createBrowserHistory=require("history/createBrowserHistory"),_createBrowserHistory2=_interopRequireDefault(_createBrowserHistory);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var RhaetiaHistory=function(){function e(){_classCallCheck(this,e)}return _createClass(e,null,[{key:"setBlockDialog",value:function(e){this.getUserConfirmation=e}}]),e}();RhaetiaHistory.self=(0,_createBrowserHistory2.default)({getUserConfirmation:function(e,t){RhaetiaHistory.getUserConfirmation?RhaetiaHistory.getUserConfirmation(e,t):t(window.confirm(e))}});var Router=exports.Router=function(e){function t(e){_classCallCheck(this,t);var r=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.state={router:r.getRouterObject(),children:null},r.routes=r.setRoutes(r.props.routeTree),RhaetiaHistory.self.listen(r.match.bind(r)),r}return _inherits(t,_react2.default.Component),_createClass(t,[{key:"componentDidMount",value:function(){this.match()}},{key:"getPath",value:function(){var e=window.location.pathname.substring(1).split("/");return e.length>1&&""===e[e.length-1]&&e.pop(),e}},{key:"getQuery",value:function(){var e={};return window.location.search.substring(1).split("&").forEach(function(t){var r=t.split("=");2===r.length&&(e[r[0]]=r[1])}),e}},{key:"getRouterObject",value:function(){return{setBlockDialog:this.setBlockDialog.bind(this),show404:this.show404.bind(this),toFallback:this.toFallback.bind(this),push:RhaetiaHistory.self.push,replace:RhaetiaHistory.self.replace,block:RhaetiaHistory.self.block,path:this.getPath(),query:this.getQuery()}}},{key:"setRoutes",value:function(e){for(var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=[],a=null,i=function(i){var s=e[i];if(!Array.isArray(s))throw new TypeError("route_branch must be an array. Instead received: "+String(s));if(s.length<2||s.length>4)throw new TypeError("route_branch must have a length between 2 and 4.");if(null!==s[0]&&"string"!=typeof s[0])throw new TypeError("route_branch[0] must be either null or a string. Instead received: "+String(s[0]));if(!_react2.default.Component.isPrototypeOf(s[1])&&"function"!=typeof s[1])throw new TypeError("route_branch[1] must be a React component. Instead received: "+String(s[1]));if(null===s[0]&&2===s.length)throw new TypeError("route_branch[2] must be an array of route_branches, if route_branch[0] is null.");if(3===s.length&&!Array.isArray(s[2])&&s[2].constructor!==Object)throw new TypeError("route_branch[2] must be either a route_options object, or an array of route_branches. Instead received: "+String(s[2]));if(4===s.length&&s[2].constructor!==Object)throw new TypeError("route_branch[2] must be a route_options object. Instead received: "+String(s[2]));if(4===s.length&&!Array.isArray(s[3]))throw new TypeError("route_branch[3] must be an array of route_branches. Instead received: "+String(s[3]));var l=[],u={};switch(s.length){case 4:l=s[3],u=s[2];break;case 3:Array.isArray(s[2])?l=s[2]:u=s[2]}var c="";c=null===s[0]||""===s[0]?r:""===r?s[0]:r+"/"+s[0];var h=[].concat(_toConsumableArray(o),[s[1]]),p=Object.assign({is_default:!1,match_mode:"exact",needs_children:!0},u),f={};c.split("/").filter(function(e){return":"===e[0]}).map(function(e){return"?"===e[e.length-1]?e.substring(1,e.length-1):e.substring(1)}).forEach(function(e){f[e]=null}),c=c.split("?")[0],l.length>0&&n.push.apply(n,_toConsumableArray(t.setRoutes(l,c,h))),0!==l.length&&!1!==p.needs_children||n.push([c,h,p,f]),null!==s[0]&&"?"===s[0][s[0].length-1]&&n.push([c.substring(0,c.lastIndexOf("/")),h,p,f]),!0===p.is_default&&(a=[r,h,p,f])},s=0;s<e.length;s++){var l=i(s);if("object"===(void 0===l?"undefined":_typeof(l)))return l.v}return null!==a&&n.push(a),n}},{key:"match",value:function(){for(var e=this.getRouterObject(),t=null,r=0;r<this.routes.length;r++){var o=this.routes[r],n=o[0].split("/"),a=o[1],i=!0,s=Object.assign({},o[3]);if(("forgiving"===o[2].match_mode||"loose"===o[2].match_mode)&&n.length>e.path.length||"exact"===o[2].match_mode&&n.length!==e.path.length)i=!1;else for(var l=0;l<n.length;l++){if(":"===n[l][0])s[n[l].substring(1)]=void 0!==e.path[l]&&""!==e.path[l]?e.path[l]:null;else n[l]!==e.path[l]&&(i=!1)}if(!0===i){e.params=s;for(var u=a.length-1;u>=0;u--)t=_react2.default.createElement(a[u],{router:e},t);"forgiving"===o[2].match_mode&&n.length<e.path.length&&RhaetiaHistory.self.replace("/"+e.path.slice(0,n.length).join("/"));break}}this.setState({children:t,router:e})}},{key:"setBlockDialog",value:function(e){RhaetiaHistory.setBlockDialog(e)}},{key:"show404",value:function(){this.setState({children:_react2.default.createElement(this.props.page404)})}},{key:"toFallback",value:function(){if(!this.props.fallbackURL)throw new TypeError("Rhaetia.Router did not receive a fallbackURL prop.");RhaetiaHistory.self.replace(this.props.fallbackURL)}},{key:"render",value:function(){return Rhaetia.renderChild(this.props.children,{router:this.state.router,children:this.state.children})}}]),t}(),A=exports.A=function(e){function t(e){return _classCallCheck(this,t),_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return _inherits(t,_react2.default.Component),_createClass(t,[{key:"goto",value:function(e){this.props.target||(e.preventDefault(),!0===this.props.replace?RhaetiaHistory.self.replace(this.props.href):RhaetiaHistory.self.push(this.props.href)),this.props.onClick&&this.props.onClick(e)}},{key:"render",value:function(){var e=this;return _react2.default.createElement("a",Object.assign({},this.props,{onClick:function(t){return e.goto(t)}}),this.props.children)}}]),t}();A.propTypes={href:_propTypes2.default.string.isRequired,onClick:_propTypes2.default.func,replace:_propTypes2.default.bool};var renderChild=exports.renderChild=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!_react2.default.isValidElement(e)&&null!==e)throw new TypeError("child must be a React element or null. Instead received: "+String(e));return e&&_react2.default.cloneElement(e,Object.assign({},t))},Rhaetia={Router:Router,A:A,renderChild:renderChild};exports.default=Rhaetia,module.exports=Rhaetia;