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

  setRoutes(route_tree, trunk, hierarchy, locked) {
    let route_array = [];
    if (trunk === undefined) {
      trunk = '';
    }
    if (hierarchy === undefined) {
      hierarchy = [];
    }
    if (locked === undefined) {
      locked = null;
    }
    for (let i=0; i<route_tree.length; i++) {
      let route = route_tree[i];
      let has_children = Array.isArray(route[2]);
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
      let new_hierarchy = [...hierarchy, route[1]];
      let new_locked = (route[3] !== undefined) ? route[3] : locked;
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
