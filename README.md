# mador.js

### Make DOM Reactive. Nothing more.

Mador:

- is a very small reactive DOM runtime.
- **is for people who don't need or want a framework**.

It gives you reactive state and a way to bind that state to existing DOM.

Mador is a native ES module and can be used through npm or directly from a CDN.

```js
import mador from "https://cdn.jsdelivr.net/npm/mador/+esm";

const [r, w] = mador({
  count: 1,
});

r(
  ".counter",
  (el, count) => {
    el.textContent = `Count: ${count}`;
  },
  (state) => state.count,
);

r(
  ".another-counter",
  (el, count) => {
    el.textContent = count * 3;
  },
  (state) => state.count,
);

w((state) => {
  state.count++;
});
```

And that's basically all.

There are no components, templates or virtual DOM.
Mador works with the DOM you already have.

### Reactive bindings

A binding consists of three things:

```js
r(selector, update, read);
```

`selector` selects the elements to update.

`update` receives each element and the value returned by read.

`read` selects the state the binding depends on.

```js
r(
  ".counter",
  (el, count) => {
    el.textContent = count * 2;
  },
  (state) => state.count,
);
```

Mador tracks the properties read by the binding and only reruns it when those dependencies change.

### State

State is changed through `w`:

```js
w((state) => {
  state.count++;
});
```

Writes are **batched**, so multiple changes made in the same write are processed together.

### DOM lifetime

'Bindings' are associated with the DOM they update.

When the matching elements are gone, Mador can remove the corresponding reactive runner.

**There is no component lifecycle to manage**.

### Why mador.js?

Sometimes a page doesn't need a framework.

It already has HTML & Javascript, but is just needs a little reactivity.

Mador is made to do that.

### Size

Mador is intentionally small.

The runtime is currently around `855 bytes` minified.

### Usage

Mador is distributed as an ES module.

```js
import mador from "mador";
```

No global runtime and no build step is required.

## License

MIT
