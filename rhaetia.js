import React from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';

let getUserConfirmation;

const rhaetia_history = createHistory({
  getUserConfirmation: (message, callback) =>{
    if (getUserConfirmation) {
      getUserConfirmation(message, callback);
    }
    else {
      callback(window.confirm(message));
    }
  },
});

export class router {

  constructor(root, route_tree) {
    if (!Object.getPrototypeOf(root).isReactComponent) {
      throw new TypeError('root must be a React class component. Instead received: ' + String(root));
      return null;
    }
    else if (typeof root.onDidNavigate !== 'function') {
      throw new TypeError('onDidNavigate must be a function. Instead received: ' + String(root.onDidNavigate));
      return null;
    }
    else if (!Array.isArray(route_tree)) {
      throw new TypeError('route_tree must be an array. Instead received: ' + String(route_tree));
      return null;
    }

    this.routes = this.setRoutes(route_tree);

    this.path = this.getPath();
    this.query = this.getQuery();

    this.push = rhaetia_history.push;
    this.replace = rhaetia_history.replace;
    this.block = rhaetia_history.block;

    rhaetia_history.listen(() => {
      this.path = this.getPath();
      this.query = this.getQuery();
      root.onDidNavigate();
    });
  }

  getPath() {
    let path = window.location.pathname.substring(1).split('/');
    if (path.length > 1 && path[path.length-1] === '') {
      path.pop();
    }
    return path;
  }

  getQuery() {
    let query = {};
    location.search.substring(1).split('&').forEach((c) => {
      let pair = c.split('=');
      if (pair.length === 2) {
        query[pair[0]] = pair[1];
      }
    });
    return query;
  }

  setRoutes(route_tree, trunk = '', hierarchy = []) {
    let route_array = [];
    for (let i=0; i<route_tree.length; i++) {
      const route = route_tree[i];

      if (!Array.isArray(route)) {
        throw new TypeError('route_branch must be an array. Instead received: ' + String(route));
        return null;
      }
      else if (route.length < 2 || route.length > 4) {
        throw new TypeError('route_branch must have a length between 2 and 4.');
        return null;
      }
      else if (route[0] !== null && typeof route[0] !== 'string') {
        throw new TypeError('route_branch[0] must be either null or a string. Instead received: ' + String(route[0]));
        return null;
      }
      else if (!React.Component.isPrototypeOf(route[1])) {
        throw new TypeError('route_branch[1] must be a React component. Instead received: ' + String(route[1]));
        return null;
      }
      else if (route[0] === null && route.length === 2) {
        throw new TypeError('route_branch[2] must be an array of route_branches, if route_branch[0] is null.');
        return null;
      }
      else if (route.length === 3 && !(Array.isArray(route[2]) || route[2].constructor === Object)) {
        throw new TypeError('route_branch[2] must be either a route_options object, or an array of route_branches. Instead received: ' + String(route[2]));
        return null;
      }
      else if (route.length === 4 && route[2].constructor !== Object) {
        throw new TypeError('route_branch[2] must be a route_options object. Instead received: ' + String(route[2]));
        return null;
      }
      else if (route.length === 4 && !Array.isArray(route[3])) {
        throw new TypeError('route_branch[3] must be an array of route_branches. Instead received: ' + String(route[3]));
        return null;
      }

      let children = [];
      let options = {};
      switch (route.length) {
        case 4:
          children = route[3];
          options = route[2];
        break;
        case 3:
          if (Array.isArray(route[2])) {
            children = route[2];
          }
          else {
            options = route[2];
          }
        break;
      }
      let new_trunk = '';
      if (route[0] === null || route[0] === '') {
        new_trunk = trunk;
      }
      else if (trunk === '') {
        new_trunk = route[0];
      }
      else {
        new_trunk = trunk + '/' + route[0];
      }
      const new_hierarchy = [...hierarchy, route[1]];
      const full_options = Object.assign({
        is_default: false,
        match_mode: 'exact',
      }, options);
      if (children.length === 0) {
        if (options.is_default === true) {
          route_array.push([
            trunk,
            new_hierarchy,
            full_options,
          ]);
        }
        route_array.push([
          new_trunk,
          new_hierarchy,
          full_options,
        ]);
      }
      else {
        if (full_options.is_default === true) {
          throw new TypeError('route_branch must have no children, if route_options.is_default === true');
          return null;
        }
        else {
          route_array = [...route_array, ...this.setRoutes(route[2], new_trunk, new_hierarchy)];
        }
      }
    }
    return route_array;
  }

  match(child_props = {}) {
    if (typeof child_props !== 'object') {
      throw new TypeError('child_props must be an object. Instead received: ' + String(child_props));
      return null;
    }
    else if (child_props.router !== undefined) {
      throw new TypeError('child_props cannot have the property: ' + 'router');
      return null;
    }

    child_props.router = {
      push: this.push,
      replace: this.replace,
      block: this.block,
      path: this.path,
      query: this.query,
      setBlockDialog: this.setBlockDialog,
    };

    let child = null;
    for (let i=0; i<this.routes.length; i++) {
      const route = this.routes[i];
      const route_path = route[0].split('/');
      const hierarchy = route[1];
      let is_match = true;
      let params = {};

      if (
        ((route[2].match_mode === 'forgiving' || route[2].match_mode === 'loose') && (route_path.length > this.path.length)) ||
        (route[2].match_mode === 'exact' && (
          ((route_path[route_path.length-1][0] === ':' && route[0][route[0].length-1] === '?') && route_path.length !== this.path.length && route_path.length-1 !== this.path.length) ||
          ((route_path[route_path.length-1][0] !== ':' || route[0][route[0].length-1] !== '?') && route_path.length !== this.path.length)
        ))
      ) {
        is_match = false;
      }
      else {
        for (let j=0; j<route_path.length; j++) {
          if (route_path[j][0] === ':') {
            const param_name = (route_path[j][route_path[j].length-1] === '?') ? route_path[j].substring(1, route_path[j].length-1) : route_path[j].substring(1);
            params[param_name] = (this.path[j] !== undefined && this.path[j] !== '') ? this.path[j] : null;
          }
          else if (route_path[j] !== this.path[j]) {
            is_match = false;
          }
        }
      }
      if (is_match === true) {
        child_props.router.params = params;
        for (let j=hierarchy.length-1; j>=0; j--) {
          child = React.createElement(hierarchy[j], child_props, child);
        }
        if (route[2].match_mode === 'forgiving' && route_path.length < this.path.length) {
          this.replace('/' + this.path.slice(0,route_path.length).join('/'));
        }
        break;
      }
    }
    return child;
  }

  setBlockDialog(newGetUserConfirmation) {
    getUserConfirmation = newGetUserConfirmation;
  }

};

export class A extends React.Component {

  constructor(props) {
    super(props);
  }

  goto(e) {
    e.preventDefault();
    if (this.props.replace === true) {
      rhaetia_history.replace(this.props.href);
    }
    else {
      rhaetia_history.push(this.props.href);
    }
  }

  render() {
    return React.createElement('a', {
      href: this.props.href,
      className: this.props.className,
      onClick: (e) => this.goto(e),
    }, this.props.children);
  }

};
A.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  replace: PropTypes.bool,
}

export const renderChild = (child, props = {}) => {
  if (!React.isValidElement(child) && child !== null) {
    throw new TypeError('child must be a React element or null. Instead received: ' + String(child));
    return null;
  }

  return (child && React.cloneElement(child, Object.assign({}, props)));
};

const Rhaetia = {
  router,
  A,
  renderChild,
};

export default Rhaetia;

module.exports = Rhaetia;
