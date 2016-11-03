# `async-module-loader` for webpack

_Based on https://github.com/webpack/bundle-loader with improvements of error handling_

``npm install async-module-loader``

## Usage

[webpack documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Also you will need to [use a `AsyncModulePlugin`](#plugin).

### Basic usage

`async-module-loader` returns function which accepts 2 callbacks: for success and for fail
Exports of the requested module are passed into success callback as a first argument

```js
require('async-module-loader!./file.js')(function onLoad(mod) {
  mod.doSomething();
}, function onError() {
  // error happened
});
```

Also you can use Promises with `promise` option specified, like this:

```js
require('async-module-loader?promise!./file.js').then(function onLoad(mod) {
  mod.doSomething();
}, function onError() {
  // error happened
});
```

### Specifying a chunk name

```js
require('async-module-loader?name=my-chunk!./file.js')(function onLoad(mod) {
  mod.doSomething();
}, function onError() {
  // error happened
});
```

### Delayed execution

If you do not want your module to be executed immediately (maybe because some animation is in play), then you can tell to `async-module-loader` to load a chunk, but not execute it. In such, a function will be passed to the success callback instead of a `module.exports` object of requested chunk. Call that function then you will need you chunk executed:

```js
require('async-module-loader?noexec!./file.js')(function onLoad(executeChunk) {
  setTimeout(function() {
    var mod = executeChunk();
    mod.doSomething();
  }, 500);
}, function onError() {
  // error happened
});
```

## Plugin

To make `async-module-loader` work correctly you need to add `AsyncModulePlugin` to your plugins.

```js
// webpack.config.js

var AsyncModulePlugin = require('async-module-loader/plugin');

module.exports = {
  // ...

  plugins: [
    // ... other plugins

    new AsyncModulePlugin()
  ]
  // ...
}
```

## Query parameters

* `name`: Use this to specify output name for requested chunk. See [webpack documentation](https://github.com/webpack/loader-utils#interpolatename)

* `promise`: Use this to return a promise from `async-module-loader`.

* `noexec`: Use this to delay chunk execution

## License

MIT (http://www.opensource.org/licenses/mit-license)
