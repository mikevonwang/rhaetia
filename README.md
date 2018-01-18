# rhaetia

Rhaetia is a lightweight router for React.

## Installation

`npm install rhaetia --save-dev`

## Usage

There are 5 main steps to implementing Rhaetia:

1. Create a `route_tree` array (see below for specifications).

2. Create a `new Rhaetia()` in the `constructor()` of your top-level React component, and pass it your `route_tree`.

3. Create a `onWillNavigate()` function, wherein `findRoute()` is called, and the result is passed to `setState()`.

4. Call `listen()` in the `componentWillMount()` of your top-level React component, and pass it your `onWillNavigate`.

5. Return the result of step 3 in the `render()` of your top-level React component.

## Documentation

### `new Rhaetia(route_tree)` **function**

Creates a new Rhaetia router.

**Parameters**

`route_tree` The array detailing every route in the app.

**Return value**

A Rhaetia router.

#### `route_tree` **array**

The `route_tree` constant is an array of `route_branch` arrays, comprising every route in the app.

### `route_branch` **array**

A 2-4 element array detailing a single route in the app. The elements are, in order:

1. `route_path` *required*
2. `route_element` *required*
3. `route_children` *optional*
4. `route_locked` *optional*

### `route_path` **string** | **null**

`route_path` is used to match routes to the url.

If the parameter contains `/` characters, the parameter is split along those characters, and each piece compared individually.

Pieces beginning with an alphabetic character are treated as literal and exact matches.

Pieces values beginning with `:` (and up to the next `/`, if one exists) are treated as parameters, with the value of the parameter in the url being stored under `params` with the piece as the key.

If the parameter is `null`, the `route_children` element of the `route_branch` must exist and will be examined for matching.

**Example**

```
['login', Element] // matches example.com/login

['user/:user_id', Element] // matches example.com/user/1994, with '1994'
stored as this.props.params.user_id

[null, Element, children] // defers matching to the route_branches in the children array.
```

### `route_element` **React element**

`route_element` is the React element that matches a certain `route_path`. Multiple `route_branch` arrays can have the same `route_element` value.

### `route_children` **array**

A `route_tree` of child routes. This is usually an optional parameter, but is required if `route_path` is `null`.

### `route_locked` **boolean**

`true` if an unauthenticated user should not be able to access this route.

`false` if an authenticated user should not be able to access this route.

`undefined` if all users should be able to access this route.

### `onWillNavigate()` **function**

This function is called whenever a browser navigation event occurs. Two important things must occur within this function:

1. `findRoute()` must be called
2. `setState()` must be called with the results of `findRoute()`

**Parameters**

None.

**Return value**

None.

**Example**

```
onWillNavigate() {

  // step 1: call findRoute()
  let child = this.router.findRoute({
    key: 'MyElement',
  }, this.state.is_logged_in);

  // step 2: call setState()
  this.setState({
    child: child,
  });

}
```

### `findRoute(props, is_authenticated)` **function**

**Parameters**

`props` An object of properties that each React element matched by the current url should have.

`is_authenticated` Boolean value. True if user is authenticated, false otherwise.

**Return value**

Either:

1. A React element matching the current url.

2. `401`, if the user is not authenticated and is accessing a authenticated-only page.

3. `402`, if the user is authenticated and is accessing an unauthenticated-only page.
