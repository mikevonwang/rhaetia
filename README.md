# rhaetia

Rhaetia is a lightweight router for React.

## Installation

`npm install rhaetia --save-dev`

## Usage and Example

After installation, there are 6 main steps to implementing Rhaetia:

1. Import Rhaetia into your app at the beginning of your top-level React component.

```javascript
import Rhaetia from 'rhaetia';
```

2. Create a `route_tree` array (see below for specifications).

```javascript
const route_tree = [

  [null, Front, [
    ['login', Login],
    ['register', Register],
  ], false],

  [null, Main, [
    ['', Home],
    ['settings', Settings],
    ['post/:post_id', Post],
    [':username', Profile],
  ], true],

  ['terms', TermsConditions],
]
```

3. Create a `new Rhaetia()` in the `constructor()` of your top-level React component, and pass it your `route_tree`.

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.router = new Rhaetia(route_tree);
  }
}
```

4. Create a `onDidNavigate()` function in your top-level React component, wherein `match()` is called, and the result is passed to `setState()`.

```javascript
onDidNavigate() {
  const element_props = {
    data: this.state,
    router: this.router,
    key: 'MyElement',
  };

  let child = this.router.match(element_props, this.state.is_logged_in);

  if (child === 1) {
    this.router.replace('/login');
  }
  else if (child === -1) {
    this.router.replace('/');
  }
  else {
    this.setState({
      child: child,
    });
  }
}
```

5. Call `listen()` in the `componentWillMount()` of your top-level React component, and pass it your `onDidNavigate`.

```javascript
componentWillMount() {
  this.router.listen(this.onDidNavigate.bind(this));
}
```

6. Return the result of step 3 in the `render()` of your top-level React component.

```javascript
render() {
  return (this.state.child);
}
```

## Documentation

### `new Rhaetia(route_tree)`

Creates a new Rhaetia router. This should be called in the `constructor()` function of your top-level React component.

#### Parameters

##### `route_tree` **Array**

An array detailing every route in the app.

Every item in the array must be a `route_branch` array.

###### `route_branch` **Array**

A 2-4 element array detailing a single route in the app. The elements are, in order:

**0.** `route_path` **String | null** *required*

Used to match routes to the url.

If the parameter contains `/` characters, the parameter is split along those characters, and each piece compared individually.

Pieces beginning with an alphabetic character are treated as literal and exact matches.

Pieces values beginning with `:` (and up to the next `/`, if one exists) are treated as parameters, with the value of the parameter in the url being stored under `params` with the piece as the key.

If the parameter is `null`, the `route_children` element of the `route_branch` must exist and will be examined for matching.

Consider the following examples:

```javascript
['login', Element]         // matches example.com/login

['user/:user_id', Element] // matches example.com/user/1994, with '1994' stored as this.props.params.user_id in the matched element.

[null, Element, children]  // defers matching to the route_branches in the children array.
```

**1.** `route_element` **ReactElement** *required*

The React element that matches a certain `route_path`. Multiple `route_branch` arrays can have the same `route_element` value.

**2.** `route_children` **Array | null** *required | optional*

A `route_tree` array of child routes. This is usually an optional parameter, but is required if `route_path` is `null`.

**3.** `route_locked` **Boolean | undefined** *optional*

Signifies whether or not the authentication status of a user affects their ability to view the route. This is actually a ternary value:

`true` if only authenticated users should be able to access this route.

`false` if only unauthenticated users should be able to access this route.

`undefined` if all users should be able to access this route.

#### Return value

A Rhaetia router.

### `listen(onDidNavigate)`

Allows Rhaetia to listen to browser navigation events. This should be called in the `componentWillMount()` function of your top-level React component.

#### Parameters

##### `onDidNavigate` **Function**

A function which calls `match()` and responds to the result, whether it be navigating away from a forbidden route or setting the matched React elements to the component's state. This function takes no parameters.

#### Return value

`undefined`

### `match(child_props, is_authenticated)`

Attempts to match the current url to a tree of React elements. This should be called in the `onDidNavigate()` function passed to `listen()`.

#### Parameters

##### `child_props` **Object**

An object of properties that each React element matched by the current url should have.

##### `is_authenticated` **Boolean**

`true` if user is authenticated, `false` otherwise.

#### Return value

Either:

1. A `ReactElement` matching the current url.

2. The number `1`, if the user is not authenticated and is accessing a route with `route_locked` set to `true`.

3. The number `-1`, if the user is authenticated and is accessing a route with `route_locked` set to `false`.

### `push()`, `replace()`

Aliases of [`history.push()` and `history.replace()`](https://github.com/ReactTraining/history#navigation)
