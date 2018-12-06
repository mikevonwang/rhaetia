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

**2.** Create a `new Rhaetia.router()` in the `constructor()` of your top-level React component, and assign the result to `this.router`. The first argument is normally just `this`. The second argument is a `route_tree` array, and defines your app's routes.

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.router = new Rhaetia.router(this, [
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
    ]);
  }
}
```

**3.** Create a `onDidNavigate()` function in your top-level React component, wherein `match()` is called, and the result is passed to `setState()`.

```javascript
onDidNavigate() {
  // This object will be available to every matched React element as this.props
  const element_props = {
    data: this.state,
    key: 'MyElement',
  };

  // Call setState() to update the children of your top-level React component
  this.setState({
    child: this.router.match(element_props),
  });
}
```

**4.** Return the result of step 3 in the `render()` of your top-level React component.

```javascript
render() {
  return (this.state.child);
}
```

**5.** For any React components in your `route_tree` with child components, use `Rhaetia.renderChild()` to render those children:

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

**6.** To create intra-app links that don't refresh your entire app, use `Rhaetia.A`. With some adjustments, you could also use the shorthand `A`:

```javascript
render() {
  return <A href='/photos'>{'Your Photos'}</A>
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

If the `route_path` contains `/` characters, it is split along those characters into `route_path_piece`'s, and each `route_path_piece` compared individually.

* `route_path_piece`'s beginning with an alphabetic character are treated as literal and exact matches.

* `route_path_piece`'s beginning with `:` are treated as url parameters, with the value of the url parameter being stored under `this.props.params` with the piece as the key.

* `route_path_piece`'s beginning with `:` and ending with `?` are treated as optional url parameters. They behave just like normal url parameters, except when the url doesn't contain the parameter; in this case, `null` is stored in `this.props.params`. Only the last `route_path_piece` in a `route_path` may be an optional url parameter.

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

// Matches 'example.com/admin/posts', with the following stored in the matched element:
//   this.props.params.post_id = null
// Also matches 'example.com/admin/posts/125', with the following stored in the matched element:
//   this.props.params.post_id = '125'
['admin/posts/:post_id?', MyElement]

// Defers matching to the route_branches in the children array.
// If one of those child routes is a match, it will be wrapped in MyElement.
[null, MyElement, children]
```

**2.** `route_element` **React Component** *required*

The React element that matches a certain `route_path`. Multiple `route_branch` arrays can have the same `route_element` value.

**3.** `route_options` **Object** *optional*

An object with properties declaring optional properties of this route. Valid properties are:

- `is_default` **Boolean** *optional*

  If `true`, then this route will behave as if its `route_path` were either its given value or `''`. For example:

  ```javascript
  // The first route will match both 'settings/profile' and 'settings'.
  // The second route will match only 'settings/account'.
  ['settings', Settings, [
    ['profile', SettingsProfile, {is_default: true}],
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

  Also, if `is_default` is `true`, then this route must have no children.

- `match_mode`  **String** *optional*

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

**3. or 4.** `route_children` **Array | null** *required | optional*

A `route_tree` array of child routes.

This is usually an optional parameter, but is required if `route_path` is `null`.

If the 3rd item in this `route_branch` is `route_options`, then `route_children` must be the 4th item. Otherwise, if no `route_options` is given, `route_children` must be the 3rd item.

#### Return value

A Rhaetia router.

---

### `match(child_props)`

Attempts to match the current url to a tree of React elements. This should be called in the `onDidNavigate()` function.

#### Parameters

##### `child_props` **Object**

An object of properties that each React element matched by the current url should have.

#### Return value

A `React Element` matching the current url.

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

A React element representing the child of this component.

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
