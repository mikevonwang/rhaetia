import React from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';

class RhaetiaHistory {
  static setBlockDialog(newGetUserConfirmation) {
    this.getUserConfirmation = newGetUserConfirmation;
  }
}
RhaetiaHistory.self = createHistory({
  getUserConfirmation: (message, callback) =>{
    if (RhaetiaHistory.getUserConfirmation) {
      RhaetiaHistory.getUserConfirmation(message, callback);
    }
    else {
      callback(window.confirm(message));
    }
  },
});

export class Router extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      router: this.getRouterObject(),
      children: null,
    };
    this.routes = this.setRoutes(this.props.routeTree);
    this.unblocker = null;
    RhaetiaHistory.self.listen(this.match.bind(this));
  }

  componentDidMount() {
    this.match();
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
    window.location.search.substring(1).split('&').forEach((c) => {
      let pair = c.split('=');
      if (pair.length === 2) {
        query[pair[0]] = pair[1];
      }
    });
    return query;
  }

  getRouterObject() {
    return ({
      setBlockDialog: this.setBlockDialog.bind(this),
      show404: this.show404.bind(this),
      toFallback: this.toFallback.bind(this),
      push: RhaetiaHistory.self.push,
      replace: RhaetiaHistory.self.replace,
      block: this.block.bind(this),
      unblock: this.unblock.bind(this),
      isBlocked: () => this.unblocker !== null,
      path: this.getPath(),
      query: this.getQuery(),
    });
  }

  setRoutes(route_tree, trunk = '', hierarchy = []) {
    let route_array = [];
    let default_route = null;
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
        needs_children: true,
      }, options);

      const empty_params = {};
      new_trunk.split('/').filter((piece) => {
        return (piece[0] === ':');
      }).map((piece) => {
        if (piece[piece.length-1] === '?') {
          return piece.substring(1,piece.length-1);
        }
        else {
          return piece.substring(1);
        }
      }).forEach((piece) => {
        empty_params[piece] = null;
      });

      new_trunk = new_trunk.split('?')[0];

      if (children.length > 0) {
        route_array.push(...this.setRoutes(children, new_trunk, new_hierarchy));
      }
      if (children.length === 0 || full_options.needs_children === false) {
        route_array.push([
          new_trunk,
          new_hierarchy,
          full_options,
          empty_params,
        ]);
      }
      if (route[0] !== null && route[0][route[0].length-1] === '?') {
        route_array.push([
          new_trunk.substring(0, new_trunk.lastIndexOf('/')),
          new_hierarchy,
          full_options,
          empty_params,
        ]);
      }
      if (full_options.is_default === true) {
        default_route = [
          trunk,
          new_hierarchy,
          full_options,
          empty_params,
        ];
      }
    }
    if (default_route !== null) {
      route_array.push(default_route);
    }
    return route_array;
  }

  match() {
    const router = this.getRouterObject();

    let child = null;
    for (let i=0; i<this.routes.length; i++) {
      const route = this.routes[i];
      const route_path = route[0].split('/');
      const hierarchy = route[1];
      let is_match = true;
      let params = Object.assign({}, route[3]);

      if (
        ((route[2].match_mode === 'forgiving' || route[2].match_mode === 'loose') && (route_path.length > router.path.length)) ||
        ((route[2].match_mode === 'exact') && (route_path.length !== router.path.length))
      ) {
        is_match = false;
      }
      else {
        for (let j=0; j<route_path.length; j++) {
          if (route_path[j][0] === ':') {
            const param_name = route_path[j].substring(1);
            params[param_name] = (router.path[j] !== undefined && router.path[j] !== '') ? router.path[j] : null;
          }
          else if (route_path[j] !== router.path[j]) {
            is_match = false;
          }
        }
      }
      if (is_match === true) {
        router.params = params;
        for (let j=hierarchy.length-1; j>=0; j--) {
          child = React.createElement(hierarchy[j], {router}, child);
        }
        if (route[2].match_mode === 'forgiving' && route_path.length < router.path.length) {
          RhaetiaHistory.self.replace('/' + router.path.slice(0,route_path.length).join('/'));
        }
        break;
      }
    }

    if (child === null) {
      child = React.createElement(this.props.page404);
    }

    this.setState({
      children: child,
      router: router,
    });
  }

  block(blocking_function = 'Are you sure you want to leave this page?') {
    if (this.unblocker) {
      this.unblocker();
    }
    this.unblocker = RhaetiaHistory.self.block(blocking_function);
  }

  unblock() {
    if (this.unblocker) {
      this.unblocker();
    }
    this.unblocker = null;
  }

  setBlockDialog(newGetUserConfirmation) {
    RhaetiaHistory.setBlockDialog(newGetUserConfirmation);
  }

  show404() {
    this.setState({
      children: React.createElement(this.props.page404),
    });
  }

  toFallback() {
    if (this.props.fallbackURL) {
      RhaetiaHistory.self.replace(this.props.fallbackURL);
    }
    else {
      throw new TypeError('Rhaetia.Router did not receive a fallbackURL prop.');
    }
  }

  render() {
    return Rhaetia.renderChild(this.props.children, {
      router: this.state.router,
      children: this.state.children,
    });
  }

}

export class A extends React.Component {

  constructor(props) {
    super(props);
  }

  goto(e) {
    if (!this.props.target) {
      e.preventDefault();
      if (this.props.replace === true) {
        RhaetiaHistory.self.replace(this.props.href);
      }
      else {
        RhaetiaHistory.self.push(this.props.href);
      }
    }
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    return React.createElement('a', Object.assign({}, this.props, {
      onClick: (e) => this.goto(e),
    }), this.props.children);
  }

};
A.propTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
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
  Router,
  A,
  renderChild,
};

export default Rhaetia;

module.exports = Rhaetia;
