import React from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';

export default class Rhaetia {

  constructor(route_tree) {
    this.history = createHistory();
    this.routes = this.setRoutes(route_tree);
    this.path = this.getLocation();
    this.push = this.history.push;
    this.replace = this.history.replace;
    this.location = this.history.location;
  }

  listen(listener) {
    this.history.listen((location) => {
      this.path = this.getLocation();
      listener();
    });
  }

  getLocation() {
    return window.location.pathname.substring(1).split('/');
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

  setRoutes(route_tree, trunk = '', hierarchy = [], locked = null) {
    if (!Array.isArray(route_tree)) {
      throw new TypeError('route_tree must be an array. Instead received: ' + String(route_tree));
      return null;
    }

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
        throw new TypeError('route_branch[1] must be a React element. Instead received: ' + String(route[1]));
        return null;
      }
      else if (route.length >= 3 && !Array.isArray(route[2])) {
        throw new TypeError('route_branch[2] must be an array. Instead received: ' + String(route[2]));
        return null;
      }
      else if (route[0] === null && route.length === 2) {
        throw new TypeError('route_branch[2] must be an array, if route_branch[0] is null.');
        return null;
      }
      else if (route.length === 4 && typeof route[3] !== 'boolean') {
        throw new TypeError('route_branch[3] must be a boolean. Instead received: ' + String(route[3]));
        return null;
      }

      const has_children = Array.isArray(route[2]);
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
      const new_locked = (route[3] !== undefined) ? route[3] : locked;
      if (has_children === false) {
        route_array.push([
          new_trunk,
          new_hierarchy,
          new_locked,
        ]);
      }
      else {
        route_array = [...route_array, ...this.setRoutes(route[2], new_trunk, new_hierarchy, new_locked)];
      }
    }
    return route_array;
  }

  match(props, is_authenticated) {
    let child = null;
    if (typeof props !== 'object' || props === null) {
      props = {};
    }
    const query = this.getQuery();
    for (let i=0; i<this.routes.length; i++) {
      const route = this.routes[i];
      const route_path = route[0].split('/');
      const hierarchy = route[1];
      const locked = route[2]
      let is_match = true;
      let params = {};

      if (route_path.length !== this.path.length) {
        is_match = false;
      }
      else {
        for (let j=0; j<route_path.length; j++) {
          if (route_path[j][0] === ':') {
            params[route_path[j].substring(1)] = this.path[j];
          }
          else if (route_path[j] !== this.path[j]) {
            is_match = false;
          }
        }
      }
      if (is_match === true) {
        if (is_authenticated === false && locked === true) {
          child = 1;
        }
        else if (is_authenticated === true && locked === false) {
          child = -1;
        }
        else {
          for (let j=hierarchy.length-1; j>=0; j--) {
            let Node = hierarchy[j];
            props.params = params;
            props.query = query;
            child = React.createElement(Node, props, child);
          }
        }
        break;
      }
    }
    return child;
  }

};

export class A extends React.Component {

  constructor(props) {
    super(props);
  }

  goto(e) {
    e.preventDefault();
    this.context.router.push(this.props.href);
  }

  render() {
    return React.createElement('a', {
      href: this.props.href,
      className: this.props.className,
      onClick: (e) => this.goto(e),
    }, this.props.children);
  }
};

A.contextTypes = {
  router: PropTypes.instanceOf(Rhaetia),
};
