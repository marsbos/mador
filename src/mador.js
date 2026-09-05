/**
 * mador.js - Make Any DOm Reactive
 * @param {*} initialState
 * @returns a tuple [r, w] to read and write state
 */
export default function (initialState) {
  // Temp. track reading & writing paths
  let activeEffect = null;
  let pendingPaths = [];
  // state proxy
  function state(target, path = []) {
    return new Proxy(target, {
      get(obj, prop) {
        const fullPath = path.concat(prop).join(".");
        activeEffect?.(fullPath);

        const val = Reflect.get(obj, prop);
        // make it recursive so we can 'track' each property
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
          return state(val, path.concat(prop));
        }
        return val;
      },
      set(obj, prop, value) {
        const fullPath = path.concat(prop).join(".");
        const oldVal = Reflect.get(obj, prop);
        // functional update support
        const newVal = typeof value === "function" ? value(oldVal) : value;

        if (oldVal !== newVal) {
          pendingPaths.push(fullPath);
          Reflect.set(obj, prop, newVal);
        }
        return true;
      },
    });
  }

  const store = state({ ...initialState });

  let runners = [];
  let isQueued = false;
  // write state
  function w(fn) {
    pendingPaths = [];
    fn(store);
    if (!isQueued) {
      isQueued = true;
      queueMicrotask(() => {
        isQueued = false;
        // filter runners without active elements
        runners = runners.filter((r) => r.run(pendingPaths));
      });
    }
  }
  // read: effect on state updates
  function r(selector, updateFn, valueFn) {
    const runner = {
      matches(changedPaths) {
        if (!this.deps) return true;
        return this.deps.some((p) =>
          changedPaths.some((d) => d.includes(p) || p.includes(d)),
        );
      },
      run(paths) {
        if (paths && !this.matches(paths)) return true;
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return false; // no active elements for this runner

        // read dependencies/paths
        this.deps = [];
        activeEffect = (path) => this.deps.push(path);
        const nextValue = valueFn(store);
        activeEffect = null;

        elements.forEach((el) => {
          if (el.isConnected)
            updateFn(el, Array.isArray(nextValue) ? [...nextValue] : nextValue);
        });

        return true;
      },
    };
    runners.push(runner);
    // initial run
    runner.run();
  }
  // the tuple!
  return [r, w];
}
