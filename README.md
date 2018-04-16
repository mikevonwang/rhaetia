# rhaetia

Rhaetia is a lightweight router for React.

## Installation

`npm install rhaetia --save`

## Usage and Example

After installation, there are 6 main steps to implementing Rhaetia:

**1.** Import Rhaetia into your app at the top of each component you want to use it with:

```javascript
import Rhaetia from 'rhaetia';
```

If you use Webpack, you could instead include Rhaetia in Webpack's `providePlugin()`, and avoid having to write the above `import` statement over and over:

```javascript
plugins: [
  new webpack.ProvidePlugin({
    Rhaetia: 'rhaetia',
  }),
],
```

**2.** Create a `route_tree` array (see below for specifications).

```javascript
const route_tree = [
  // These 2 routes are viewable to unauthenticated users only. They are both wrapped in a
  // "Front" React Component.
  [null, Front, [
    ['login', Login],
    ['register', Register],
  ], false],

  // These 4 routes are viewable to authenticated users only. They are all wrapped in a
  // "Main" React Component. The 3rd and 4th routes include url parameters.
  [null, Main, [
    ['', Home],
    ['settings', Settings],
    ['post/:post_id', Post],
    [':username', Profile],
  ], true],

  // This route is viewable to all users.
  ['terms', TermsConditions],
];
```

**3.** Create a `new Rhaetia.router()` in the `constructor()` of your top-level React component. Pass your `route_tree` to it, and assign the result to `this.router`.

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // Normally, the route_tree array is not a named variable, but instead is passed directly
    // into this constructor.
    this.router = new Rhaetia.router(this, route_tree);
  }
}
```

**4.** Create a `onDidNavigate()` function in your top-level React component, wherein `match()` is called, and the result is passed to `setState()`.

```javascript
onDidNavigate() {
  // This object will be available to every matched React element as this.props
  const element_props = {
    data: this.state,
    key: 'MyElement',
  };

  // This boolean is used by Rhaetia to decide whether a user should be able to view a route or not
  const is_logged_in = this.state.is_logged_in;

  let child = this.router.match(element_props, is_logged_in);

  // If the user is allowed to view the matched route, then setState() is called. Otherwise, the app
  // kicks the user out to a route they are allowed to see.
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

**5.** Return the result of step 4 in the `render()` of your top-level React component.

```javascript
render() {
  return (this.state.child);
}
```

**6.** For any React components in your `route_tree` with child components, use `Rhaetia.renderChild()` to render those children:

```javascript
class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main>
        {Rhaetia.renderChild(this.props.children, {
          message: 'Hello World!',
        })}
      </main>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section>
        <h1>{this.props.message}</h1>
      </section>
    );
  }
}
```

## Documentation

### `new Rhaetia.router(root, route_tree)`

Creates a new Rhaetia router. This should be called in the `constructor()` function of your top-level React component.

#### Parameters

##### `root` **React Component** *required*

Your top-level React Component. Usually passed in as `this`:

```javascript
this.router = new Rhaetia.router(this, route_tree);
```

##### `route_tree` **Array** *required*

An array detailing every route in the app.

Every item in the array must be a `route_branch` array. These arrays must be ordered from most specific to most general, i.e. routes with url parameters should appear after routes without them. For example:

```javascript
const route_tree = [
  ['settings', Settings],
  ['post/new', NewPost],

  // This route_branch has a url parameter as its second route_path piece.
  // Its partner above it has an identical first route_path piece, but a literal as its second
  // route_path piece.
  // This route must therefore appear after its partner, otherwise a url like 'example.com/post/new'
  // would match this route instead of its partner.
  ['post/:post_id', Post],

  // This route_branch has a url parameter as its first route_path piece, and is therefore the most
  // general.
  // It must be at the bottom, otherwise a url like 'example.com/settings' would match this
  // route instead of the first one.
  [':username', Profile],
];
```

###### `route_branch` **Array**

A 2-4 element array detailing a single route in the app. The elements are, in order:

**1.** `route_path` **String | null** *required*

Used to match routes to the url.

If the `route_path` contains `/` characters, it is split along those characters, and each piece compared individually.

* Pieces beginning with an alphabetic character are treated as literal and exact matches.

* Pieces beginning with `:` (and up to the next `/`, or the end of the string) are treated as url parameters, with the value of the url parameter being stored under `this.props.params` with the piece as the key.

If the `route_path` is `null`, the `route_children` element of the `route_branch` must exist and will be examined for matching.

If the url being matched against has query parameters, they will be stored in `this.props.query` as key-value pairs.

Consider the following examples:

```javascript
// Matches 'example.com/login'
['login', MyElement]

// Matches 'example.com/user/1994', with the following stored in the matched element:
//   this.props.params.user_id = '1994'
['user/:user_id', MyElement]

// Matches 'example.com/photo/4314955/edit?mode=guest', with the following stored in the matched element:
//   this.props.params.photo_id = '4314955'
//   this.props.query.mode      = 'guest'
['photo/:photo_id/edit', MyElement]

// Defers matching to the route_branches in the children array.
// If one of those child routes is a match, it will be wrapped in MyElement.
[null, MyElement, children]
```

**2.** `route_element` **React Component** *required*

The React element that matches a certain `route_path`. Multiple `route_branch` arrays can have the same `route_element` value.

**3.** `route_children` **Array | null** *required | optional*

A `route_tree` array of child routes. This is usually an optional parameter, but is required if `route_path` is `null`.

**4.** `route_locked` **Boolean | undefined** *optional*

Signifies whether or not the authentication status of a user affects their ability to view the route. This is actually a ternary value:

`true` if only authenticated users should be able to access this route.

`false` if only unauthenticated users should be able to access this route.

`undefined` if all users should be able to access this route.

#### Return value

A Rhaetia router.

---

### `match(child_props, is_authenticated)`

Attempts to match the current url to a tree of React elements. This should be called in the `onDidNavigate()` function passed to `listen()`.

#### Parameters

##### `child_props` **Object**

An object of properties that each React element matched by the current url should have.

##### `is_authenticated` **Boolean**

`true` if user is authenticated, `false` otherwise.

#### Return value

Either:

1. A `React Element` matching the current url.

2. The number `1`, if the user is not authenticated and is accessing a route with `route_locked` set to `true`.

3. The number `-1`, if the user is authenticated and is accessing a route with `route_locked` set to `false`.

---

### `push()`, `replace()`

Aliases of [`history.push()` and `history.replace()`](https://github.com/ReactTraining/history#navigation).

Use `push()` whenever you want the user to be able to use their browser's back button to return to the current route, e.g. when navigating to a new route upon a button click.

Use `replace()` whenever you don't want the user to be able to use their browser's back button to return to the current route, e.g. when kicking the user out of a route they aren't allowed to view and onto one they are allowed to.

These functions should be called on `this.props.router`, i.e.

```javascript
this.props.router.push('/settings');
```
```javascript
this.props.router.replace('/login');
```
---

### `Rhaetia.renderChild(child, props)`

Used in React components that wrap other React components according to your `route_tree`.

To use, place one `Rhaetia.renderChild()` in your React component wherever you want its child to appear;

```javascript
<main>
  {Rhaetia.renderChild(this.props.children, {
    message: 'Hello World!',
  })}
</main>
```

#### Parameters

##### `child` **React component** *required*

The child of this component. Usually passed in as `this.props.children`.

##### `props` **Object** *optional*

Any additional props that you wish to pass into the child of this component.

#### Return value

A React element presenting the child of this component.

---

### `<A/>`

Wrapper for an `<a/>` tag with a valid `href` attribute, that uses `push()` (by default) to take the user to that `href`. Used for intra-app links in single page apps, where a regular `<a/>` tag is undesirable because it would cause the entire app to reload.

To use, place an `<Rhaetia.A/>` in your React component wherever you want an intra-app link, and give it an `href` attribute;

```javascript
<Rhaetia.A href='/photos'>{'Your Photos'}</Rhaetia.A>
```

The shorthand `<A/>` also exists. To use, either adjust your `import Rhaetia` statement to include `A`:

```javascript
import Rhaetia, {A} from 'Rhaetia';
```

Or, if you use Webpack, adjust your `providePlugin()` to include `A`:

```javascript
plugins: [
  new webpack.ProvidePlugin({
    Rhaetia: 'rhaetia',
    A: ['rhaetia', 'A'],
  }),
],
```

This cleans up the above syntax a little:

```javascript
<A href='/photos'>{'Your Photos'}</A>
```

#### Attributes

##### `href` **String** *required*

Used as the `href` attribute for the rendered `<a/>` element. Must be a relative URL; links with absolute URLs should directly use a regular `<a/>` element.

##### `className` **String** *optional*

Used as the `class` attribute for the rendered `<a/>` element.

##### `replace` **Boolean** *optional*

If `true` (using `===`), then this element will use `replace()` instead of `push()`.
