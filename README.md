# Rhaetia

Rhaetia is a lightweight declarative router for React.

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

**2.** In your top-level React file, create a `route_tree` array that defines your app's routes.

```javascript
const route_tree = [
  // These 2 routes are both wrapped in a "Front" React Component.
  [null, Front, [
    ['login', Login],
    ['register', Register],
  ]],

  // These 4 routes are wrapped in a "Main" React Component.
  // The 2nd route has 2 children; the first child is marked as default.
  // The 3rd and 4th routes include url parameters.
  [null, Main, [
    ['', Home],
    ['settings', Settings, [
      ['profile', SettingsProfile, {is_default: true}],
      ['account', SettingsAccount],
    ]],
    ['post/:post_id', Post],
    [':username', Profile],
  ]],

  // This route has no children.
  ['terms', TermsConditions],
]
```

**3.** In your `ReactDOM.render()` function, wrap your top-level React Component with a `Rhaetia.Router`. Give the router your `route_tree`:

```javascript
ReactDOM.render((
  <Rhaetia.Router routeTree={route_tree}>
    <App/>
  </Rhaetia.Router>
), document.getElementById('root'));
```

**4.** Return `this.props.children` in the `render()` of any component that is assigned children according to your `route_tree` (and also in your top-level React Component).

```javascript
render() {
  return (this.props.children);
}
```

**5.** To pass additional props to a Component's Rhaetia-assigned children, use `Rhaetia.renderChild`:

```javascript
// This Component will pass a `message` prop to any child that Rhaetia assigns to it
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

// This Component will receive a `message` prop from its parent
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

**6.** To create intra-app links that don't refresh your entire app, use `Rhaetia.A`. With some extra setup, you could also use the shorthand `A`:

```javascript
render() {
  return <A href='/photos'>{'Your Photos'}</A>
}
```

## Documentation

### `<Rhaetia.Router/>`

A Rhaetia router. Rhaetia.Router is a React Component, and should wrap your top-level Component (see step 3 in "Usage and Example" for an example). This Component can take two props: `routeTree` and `page404`.

#### Props

##### `routeTree` **Array** *required*

A `route_tree` array detailing every route in the app.

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

If the `route_path` contains `/` characters, it is split along those characters into `route_path_piece`'s, and each `route_path_piece` compared individually.

* `route_path_piece`'s beginning with an alphabetic character are treated as literal and exact matches.

* `route_path_piece`'s beginning with `:` are treated as url parameters, with the value of the url parameter being stored under `this.props.params` with the piece as the key.

* `route_path_piece`'s beginning with `:` and ending with `?` are treated as optional url parameters. They behave just like normal url parameters, except when the url doesn't contain the parameter; in this case, `null` is stored in `this.props.params`. Only the last `route_path_piece` in a `route_path` may be an optional url parameter.

If the `route_path` is `null`, the `route_children` element of this `route_branch` must exist and will be examined for matching.

If the url being matched against has query parameters, they will be stored in `this.props.query` as key-value pairs.

Consider the following examples:

```javascript
// Matches 'example.com/login'
['login', Login],

// Matches 'example.com/user/1994', with the following stored in the matched element:
//   this.props.params.user_id = '1994'
['user/:user_id', User],

// Matches 'example.com/photo/4314955/edit?mode=guest', with the following stored in the matched element:
//   this.props.params.photo_id = '4314955'
//   this.props.query.mode      = 'guest'
['photo/:photo_id/edit', Photo],

// Matches 'example.com/admin/posts', with the following stored in the matched element:
//   this.props.params.post_id = null
// Also matches 'example.com/admin/posts/125', with the following stored in the matched element:
//   this.props.params.post_id = '125'
['admin/posts/:post_id?', Post],

// Behaves as follows:
//   'example.com/graphs'                renders  <Graph/>
//   'example.com/graphs/19'             renders  <Graph/>
//   'example.com/graphs/19/reviews'     renders  <Graph><Review/></Graph>
//   'example.com/graphs/19/reviews/75'  renders  <Graph><Review/></Graph>
// With `graph` and `review_id` stored in `this.props.params` of each rendered element.
['graphs/:graph_id?', Graph, [
  ['reviews/:review_id?', Review]
]],

// Defers matching to the route_branches in the `children` array.
// If one of those child routes is a match, it will be wrapped in MyElement.
[null, MyElement, children],
```

**2.** `route_element` **React Component** *required*

The React element that matches a certain `route_path`. Multiple `route_branch` arrays can have the same `route_element` value.

**3.** `route_options` **Object** *optional*

An object with properties declaring optional properties of this route. Valid properties are:

- `is_default` **Boolean**

  Default value is `false`. If `true`, then this route will behave as if its `route_path` were either its given value or `''`. For example:

  ```javascript
  ['settings', Settings, [

    // This first route will match both 'settings/profile' and 'settings'.
    ['profile', SettingsProfile, {is_default: true}],

    // This second route will match only 'settings/account'.
    ['account', SettingsAccount],
  ]],
  ```

  This is equivalent to just setting `route_path` to `''`. This example below behaves exactly like the one above:

  ```javascript
  ['settings', Settings, [
    ['', SettingsProfile],
    ['profile', SettingsProfile],
    ['account', SettingsAccount],
  ]],
  ```

- `match_mode`  **String**

  Can be one of three values: `'exact'`, `'forgiving'`, or `'loose'`. Default value is `'exact'`.

  If `'exact'`, then this route will only match urls that follow the pattern of its `route_path` exactly and don't have any extra pieces. For example:

  ```javascript
  // Both these routes will match `terms`, but not `terms/current`.
  ['terms', Terms],
  ['terms', Terms, {match_mode: 'exact'}],
  ```

  If `'forgiving'`, then this route will match urls that have extra pieces beyond the pattern of its `route_path`. It will replace the url with one that matches the pattern of its `route_path`, i.e. it will truncate the url and remove the extra pieces.

  ```javascript
  // This route will match both `terms` and `terms/current`. In the latter case, it will replace
  // the url with `terms`.
  ['terms', Terms, {match_mode: 'forgiving'}],
  ```

  If `'loose'`, then this route will also match urls that have extra pieces beyond the pattern of its `route_path`, but it will not truncate the url.

  ```javascript
  // This route will match both `terms` and `terms/current`. In the latter case, it will leave
  // the url as `terms/current`.
  ['terms', Terms, {match_mode: 'loose'}],
  ```

  If a `route_branch` has children, then `match_mode` will be ignored.

- `needs_children` **Boolean**

  Default value is `true`. If `false`, then a route will be matched with whether or not its children are matched with. For example:

  ```javascript
  // This first route tree will match both `graphs` and `graphs/bar`.
  ['graphs', Graphs, {needs_children: false}, [
    ['bar', GraphBar],
  ]],

  // This second route tree will match only `graphs/bar`.
  ['graphs', Graphs, [
    ['bar', GraphBar],
  ]],
  ```

  If a `route_branch` has no children, then `needs_children` will be ignored.

**3. or 4.** `route_children` **Array | null** *required | optional*

A `route_tree` array of child routes.

This is usually an optional parameter, but is required if `route_path` is `null`.

If the 3rd item in this `route_branch` is `route_options`, then `route_children` must be the 4th item. Otherwise, if no `route_options` is given, `route_children` must be the 3rd item.

##### `page404` **React Component** *optional*

Any React Component that you want to be shown when Rhaetia does not find a matching route, or when `show404()` is called.

---

### `push()`, `replace()`, `block()`

Aliases of [`history.push()`, `history.replace()` and `history.block()`](https://github.com/ReactTraining/history#navigation).

Use `push()` whenever you want the user to be able to use their browser's back button to return to the current route, e.g. when navigating to a new route upon a button click.

Use `replace()` whenever you don't want the user to be able to use their browser's back button to return to the current route, e.g. when kicking the user out of a route they aren't allowed to view and onto one they are allowed to.

Use `block()` whenever you want to ask the user for confirmation whether or not they actually wish to leave a page when they click a button or link that will navigate them away. This function returns another function, which you can store and then call to prevent the confirmation dialog from appearing.

These functions should be called on `this.props.router`, i.e.

```javascript
this.props.router.push('/settings');
```
```javascript
this.props.router.replace('/login');
```
```javascript
this.unblock = this.props.router.block((new_location) => {
  if (location.pathname !== new_location.pathname) {
    return ('Are you sure you wish to leave this page?');
  }
});
```
---

### `setBlockDialog(getUserConfirmation)`

Sets a function to be called whenever `block()` is called, and Rhaetia needs to check whether or not the user actually wants to leave a page (i.e. customizes the confirmation dialog).

#### Parameters

##### `getUserConfirmation` **Function**

A function that takes 2 arguments:

1. `message` - the message displayed in the confirmation dialog.

2. `callback` - call this function with `true` if the user indicates that they do wish to leave a page, and with `false` if otherwise.

As an example:

```javascript
// This custom function is passed to `setBlockDialog` as a custom user confirmation function.
// If the response to an (imaginary) custom dialog is true, then it invokes the callback.
// It receives the `message` from `block()`, but ignores it.
openLeavePageDialog(message, callback) {
  if (responseToCustomDialog() === true) {
    callback();
  }
}

componentDidMount() {
  // If `setBlockDialog()` weren't called here, then the normal system dialog would appear when
  // `block()` is triggered.
  this.props.router.setBlockDialog(this.openLeavePageDialog.bind(this));
}
```

---

### `show404()`

Used to redirect to a 404 page without changing the url. Whenever you wish to redirect to your 404 page, call:

```javascript
this.props.router.show404()
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

A React element representing the child of this component.

---

### `<A/>`

Wrapper for an `<a/>` tag with a valid `href` attribute, that uses `push()` (by default) to take the user to that `href`. Used for intra-app links in single page apps, where a regular `<a/>` tag is undesirable because it would cause the entire app to reload.

To use, place a `<Rhaetia.A/>` in your React component wherever you want an intra-app link, and give it an `href` attribute;

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

#### Props

All props except for `replace` are passed down onto the rendered `<a/>` tag.

##### `href` **String** *required*

Used as the `href` attribute for the rendered `<a/>` element. Must be a relative URL; links with absolute URLs should directly use a regular `<a/>` element.

##### `replace` **Boolean** *optional*

If `true` (using `===`), then this element will use `replace()` instead of `push()`.
