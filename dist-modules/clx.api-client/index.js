var ty = { exports: {} }, iv = {}, ny = { exports: {} }, bt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vx;
function k_() {
  if (vx) return bt;
  vx = 1;
  var y = Symbol.for("react.element"), M = Symbol.for("react.portal"), x = Symbol.for("react.fragment"), J = Symbol.for("react.strict_mode"), te = Symbol.for("react.profiler"), Ne = Symbol.for("react.provider"), S = Symbol.for("react.context"), Qe = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), Q = Symbol.for("react.memo"), We = Symbol.for("react.lazy"), ne = Symbol.iterator;
  function me(D) {
    return D === null || typeof D != "object" ? null : (D = ne && D[ne] || D["@@iterator"], typeof D == "function" ? D : null);
  }
  var le = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ye = Object.assign, Le = {};
  function Je(D, I, Ze) {
    this.props = D, this.context = I, this.refs = Le, this.updater = Ze || le;
  }
  Je.prototype.isReactComponent = {}, Je.prototype.setState = function(D, I) {
    if (typeof D != "object" && typeof D != "function" && D != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, D, I, "setState");
  }, Je.prototype.forceUpdate = function(D) {
    this.updater.enqueueForceUpdate(this, D, "forceUpdate");
  };
  function $() {
  }
  $.prototype = Je.prototype;
  function xe(D, I, Ze) {
    this.props = D, this.context = I, this.refs = Le, this.updater = Ze || le;
  }
  var je = xe.prototype = new $();
  je.constructor = xe, ye(je, Je.prototype), je.isPureReactComponent = !0;
  var ue = Array.isArray, Te = Object.prototype.hasOwnProperty, He = { current: null }, Ve = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Yt(D, I, Ze) {
    var Ke, ht = {}, ft = null, st = null;
    if (I != null) for (Ke in I.ref !== void 0 && (st = I.ref), I.key !== void 0 && (ft = "" + I.key), I) Te.call(I, Ke) && !Ve.hasOwnProperty(Ke) && (ht[Ke] = I[Ke]);
    var dt = arguments.length - 2;
    if (dt === 1) ht.children = Ze;
    else if (1 < dt) {
      for (var mt = Array(dt), $t = 0; $t < dt; $t++) mt[$t] = arguments[$t + 2];
      ht.children = mt;
    }
    if (D && D.defaultProps) for (Ke in dt = D.defaultProps, dt) ht[Ke] === void 0 && (ht[Ke] = dt[Ke]);
    return { $$typeof: y, type: D, key: ft, ref: st, props: ht, _owner: He.current };
  }
  function Vt(D, I) {
    return { $$typeof: y, type: D.type, key: I, ref: D.ref, props: D.props, _owner: D._owner };
  }
  function tn(D) {
    return typeof D == "object" && D !== null && D.$$typeof === y;
  }
  function on(D) {
    var I = { "=": "=0", ":": "=2" };
    return "$" + D.replace(/[=:]/g, function(Ze) {
      return I[Ze];
    });
  }
  var Dt = /\/+/g;
  function Be(D, I) {
    return typeof D == "object" && D !== null && D.key != null ? on("" + D.key) : I.toString(36);
  }
  function Ft(D, I, Ze, Ke, ht) {
    var ft = typeof D;
    (ft === "undefined" || ft === "boolean") && (D = null);
    var st = !1;
    if (D === null) st = !0;
    else switch (ft) {
      case "string":
      case "number":
        st = !0;
        break;
      case "object":
        switch (D.$$typeof) {
          case y:
          case M:
            st = !0;
        }
    }
    if (st) return st = D, ht = ht(st), D = Ke === "" ? "." + Be(st, 0) : Ke, ue(ht) ? (Ze = "", D != null && (Ze = D.replace(Dt, "$&/") + "/"), Ft(ht, I, Ze, "", function($t) {
      return $t;
    })) : ht != null && (tn(ht) && (ht = Vt(ht, Ze + (!ht.key || st && st.key === ht.key ? "" : ("" + ht.key).replace(Dt, "$&/") + "/") + D)), I.push(ht)), 1;
    if (st = 0, Ke = Ke === "" ? "." : Ke + ":", ue(D)) for (var dt = 0; dt < D.length; dt++) {
      ft = D[dt];
      var mt = Ke + Be(ft, dt);
      st += Ft(ft, I, Ze, mt, ht);
    }
    else if (mt = me(D), typeof mt == "function") for (D = mt.call(D), dt = 0; !(ft = D.next()).done; ) ft = ft.value, mt = Ke + Be(ft, dt++), st += Ft(ft, I, Ze, mt, ht);
    else if (ft === "object") throw I = String(D), Error("Objects are not valid as a React child (found: " + (I === "[object Object]" ? "object with keys {" + Object.keys(D).join(", ") + "}" : I) + "). If you meant to render a collection of children, use an array instead.");
    return st;
  }
  function Ot(D, I, Ze) {
    if (D == null) return D;
    var Ke = [], ht = 0;
    return Ft(D, Ke, "", "", function(ft) {
      return I.call(Ze, ft, ht++);
    }), Ke;
  }
  function Lt(D) {
    if (D._status === -1) {
      var I = D._result;
      I = I(), I.then(function(Ze) {
        (D._status === 0 || D._status === -1) && (D._status = 1, D._result = Ze);
      }, function(Ze) {
        (D._status === 0 || D._status === -1) && (D._status = 2, D._result = Ze);
      }), D._status === -1 && (D._status = 0, D._result = I);
    }
    if (D._status === 1) return D._result.default;
    throw D._result;
  }
  var Oe = { current: null }, ae = { transition: null }, Me = { ReactCurrentDispatcher: Oe, ReactCurrentBatchConfig: ae, ReactCurrentOwner: He };
  function fe() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return bt.Children = { map: Ot, forEach: function(D, I, Ze) {
    Ot(D, function() {
      I.apply(this, arguments);
    }, Ze);
  }, count: function(D) {
    var I = 0;
    return Ot(D, function() {
      I++;
    }), I;
  }, toArray: function(D) {
    return Ot(D, function(I) {
      return I;
    }) || [];
  }, only: function(D) {
    if (!tn(D)) throw Error("React.Children.only expected to receive a single React element child.");
    return D;
  } }, bt.Component = Je, bt.Fragment = x, bt.Profiler = te, bt.PureComponent = xe, bt.StrictMode = J, bt.Suspense = se, bt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Me, bt.act = fe, bt.cloneElement = function(D, I, Ze) {
    if (D == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + D + ".");
    var Ke = ye({}, D.props), ht = D.key, ft = D.ref, st = D._owner;
    if (I != null) {
      if (I.ref !== void 0 && (ft = I.ref, st = He.current), I.key !== void 0 && (ht = "" + I.key), D.type && D.type.defaultProps) var dt = D.type.defaultProps;
      for (mt in I) Te.call(I, mt) && !Ve.hasOwnProperty(mt) && (Ke[mt] = I[mt] === void 0 && dt !== void 0 ? dt[mt] : I[mt]);
    }
    var mt = arguments.length - 2;
    if (mt === 1) Ke.children = Ze;
    else if (1 < mt) {
      dt = Array(mt);
      for (var $t = 0; $t < mt; $t++) dt[$t] = arguments[$t + 2];
      Ke.children = dt;
    }
    return { $$typeof: y, type: D.type, key: ht, ref: ft, props: Ke, _owner: st };
  }, bt.createContext = function(D) {
    return D = { $$typeof: S, _currentValue: D, _currentValue2: D, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, D.Provider = { $$typeof: Ne, _context: D }, D.Consumer = D;
  }, bt.createElement = Yt, bt.createFactory = function(D) {
    var I = Yt.bind(null, D);
    return I.type = D, I;
  }, bt.createRef = function() {
    return { current: null };
  }, bt.forwardRef = function(D) {
    return { $$typeof: Qe, render: D };
  }, bt.isValidElement = tn, bt.lazy = function(D) {
    return { $$typeof: We, _payload: { _status: -1, _result: D }, _init: Lt };
  }, bt.memo = function(D, I) {
    return { $$typeof: Q, type: D, compare: I === void 0 ? null : I };
  }, bt.startTransition = function(D) {
    var I = ae.transition;
    ae.transition = {};
    try {
      D();
    } finally {
      ae.transition = I;
    }
  }, bt.unstable_act = fe, bt.useCallback = function(D, I) {
    return Oe.current.useCallback(D, I);
  }, bt.useContext = function(D) {
    return Oe.current.useContext(D);
  }, bt.useDebugValue = function() {
  }, bt.useDeferredValue = function(D) {
    return Oe.current.useDeferredValue(D);
  }, bt.useEffect = function(D, I) {
    return Oe.current.useEffect(D, I);
  }, bt.useId = function() {
    return Oe.current.useId();
  }, bt.useImperativeHandle = function(D, I, Ze) {
    return Oe.current.useImperativeHandle(D, I, Ze);
  }, bt.useInsertionEffect = function(D, I) {
    return Oe.current.useInsertionEffect(D, I);
  }, bt.useLayoutEffect = function(D, I) {
    return Oe.current.useLayoutEffect(D, I);
  }, bt.useMemo = function(D, I) {
    return Oe.current.useMemo(D, I);
  }, bt.useReducer = function(D, I, Ze) {
    return Oe.current.useReducer(D, I, Ze);
  }, bt.useRef = function(D) {
    return Oe.current.useRef(D);
  }, bt.useState = function(D) {
    return Oe.current.useState(D);
  }, bt.useSyncExternalStore = function(D, I, Ze) {
    return Oe.current.useSyncExternalStore(D, I, Ze);
  }, bt.useTransition = function() {
    return Oe.current.useTransition();
  }, bt.version = "18.3.1", bt;
}
var ov = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
ov.exports;
var hx;
function __() {
  return hx || (hx = 1, (function(y, M) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var x = "18.3.1", J = Symbol.for("react.element"), te = Symbol.for("react.portal"), Ne = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), Qe = Symbol.for("react.profiler"), se = Symbol.for("react.provider"), Q = Symbol.for("react.context"), We = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), me = Symbol.for("react.suspense_list"), le = Symbol.for("react.memo"), ye = Symbol.for("react.lazy"), Le = Symbol.for("react.offscreen"), Je = Symbol.iterator, $ = "@@iterator";
      function xe(h) {
        if (h === null || typeof h != "object")
          return null;
        var b = Je && h[Je] || h[$];
        return typeof b == "function" ? b : null;
      }
      var je = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ue = {
        transition: null
      }, Te = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, He = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Ve = {}, Yt = null;
      function Vt(h) {
        Yt = h;
      }
      Ve.setExtraStackFrame = function(h) {
        Yt = h;
      }, Ve.getCurrentStack = null, Ve.getStackAddendum = function() {
        var h = "";
        Yt && (h += Yt);
        var b = Ve.getCurrentStack;
        return b && (h += b() || ""), h;
      };
      var tn = !1, on = !1, Dt = !1, Be = !1, Ft = !1, Ot = {
        ReactCurrentDispatcher: je,
        ReactCurrentBatchConfig: ue,
        ReactCurrentOwner: He
      };
      Ot.ReactDebugCurrentFrame = Ve, Ot.ReactCurrentActQueue = Te;
      function Lt(h) {
        {
          for (var b = arguments.length, A = new Array(b > 1 ? b - 1 : 0), F = 1; F < b; F++)
            A[F - 1] = arguments[F];
          ae("warn", h, A);
        }
      }
      function Oe(h) {
        {
          for (var b = arguments.length, A = new Array(b > 1 ? b - 1 : 0), F = 1; F < b; F++)
            A[F - 1] = arguments[F];
          ae("error", h, A);
        }
      }
      function ae(h, b, A) {
        {
          var F = Ot.ReactDebugCurrentFrame, re = F.getStackAddendum();
          re !== "" && (b += "%s", A = A.concat([re]));
          var Ie = A.map(function(de) {
            return String(de);
          });
          Ie.unshift("Warning: " + b), Function.prototype.apply.call(console[h], console, Ie);
        }
      }
      var Me = {};
      function fe(h, b) {
        {
          var A = h.constructor, F = A && (A.displayName || A.name) || "ReactClass", re = F + "." + b;
          if (Me[re])
            return;
          Oe("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", b, F), Me[re] = !0;
        }
      }
      var D = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(h) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(h, b, A) {
          fe(h, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(h, b, A, F) {
          fe(h, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(h, b, A, F) {
          fe(h, "setState");
        }
      }, I = Object.assign, Ze = {};
      Object.freeze(Ze);
      function Ke(h, b, A) {
        this.props = h, this.context = b, this.refs = Ze, this.updater = A || D;
      }
      Ke.prototype.isReactComponent = {}, Ke.prototype.setState = function(h, b) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, b, "setState");
      }, Ke.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var ht = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, ft = function(h, b) {
          Object.defineProperty(Ke.prototype, h, {
            get: function() {
              Lt("%s(...) is deprecated in plain JavaScript React classes. %s", b[0], b[1]);
            }
          });
        };
        for (var st in ht)
          ht.hasOwnProperty(st) && ft(st, ht[st]);
      }
      function dt() {
      }
      dt.prototype = Ke.prototype;
      function mt(h, b, A) {
        this.props = h, this.context = b, this.refs = Ze, this.updater = A || D;
      }
      var $t = mt.prototype = new dt();
      $t.constructor = mt, I($t, Ke.prototype), $t.isPureReactComponent = !0;
      function Mn() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var Dr = Array.isArray;
      function Rn(h) {
        return Dr(h);
      }
      function lr(h) {
        {
          var b = typeof Symbol == "function" && Symbol.toStringTag, A = b && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return A;
        }
      }
      function Yn(h) {
        try {
          return $n(h), !1;
        } catch {
          return !0;
        }
      }
      function $n(h) {
        return "" + h;
      }
      function Gr(h) {
        if (Yn(h))
          return Oe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", lr(h)), $n(h);
      }
      function pi(h, b, A) {
        var F = h.displayName;
        if (F)
          return F;
        var re = b.displayName || b.name || "";
        return re !== "" ? A + "(" + re + ")" : A;
      }
      function da(h) {
        return h.displayName || "Context";
      }
      function Jn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Oe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case Ne:
            return "Fragment";
          case te:
            return "Portal";
          case Qe:
            return "Profiler";
          case S:
            return "StrictMode";
          case ne:
            return "Suspense";
          case me:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Q:
              var b = h;
              return da(b) + ".Consumer";
            case se:
              var A = h;
              return da(A._context) + ".Provider";
            case We:
              return pi(h, h.render, "ForwardRef");
            case le:
              var F = h.displayName || null;
              return F !== null ? F : Jn(h.type) || "Memo";
            case ye: {
              var re = h, Ie = re._payload, de = re._init;
              try {
                return Jn(de(Ie));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Tn = Object.prototype.hasOwnProperty, Qn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, br, Ga, Un;
      Un = {};
      function xr(h) {
        if (Tn.call(h, "ref")) {
          var b = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (b && b.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function pa(h) {
        if (Tn.call(h, "key")) {
          var b = Object.getOwnPropertyDescriptor(h, "key").get;
          if (b && b.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function qa(h, b) {
        var A = function() {
          br || (br = !0, Oe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", b));
        };
        A.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: A,
          configurable: !0
        });
      }
      function vi(h, b) {
        var A = function() {
          Ga || (Ga = !0, Oe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", b));
        };
        A.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: A,
          configurable: !0
        });
      }
      function oe(h) {
        if (typeof h.ref == "string" && He.current && h.__self && He.current.stateNode !== h.__self) {
          var b = Jn(He.current.type);
          Un[b] || (Oe('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', b, h.ref), Un[b] = !0);
        }
      }
      var Ue = function(h, b, A, F, re, Ie, de) {
        var Ge = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: J,
          // Built-in properties that belong on the element
          type: h,
          key: b,
          ref: A,
          props: de,
          // Record the component responsible for creating this element.
          _owner: Ie
        };
        return Ge._store = {}, Object.defineProperty(Ge._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Ge, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: F
        }), Object.defineProperty(Ge, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: re
        }), Object.freeze && (Object.freeze(Ge.props), Object.freeze(Ge)), Ge;
      };
      function pt(h, b, A) {
        var F, re = {}, Ie = null, de = null, Ge = null, Et = null;
        if (b != null) {
          xr(b) && (de = b.ref, oe(b)), pa(b) && (Gr(b.key), Ie = "" + b.key), Ge = b.__self === void 0 ? null : b.__self, Et = b.__source === void 0 ? null : b.__source;
          for (F in b)
            Tn.call(b, F) && !Qn.hasOwnProperty(F) && (re[F] = b[F]);
        }
        var _t = arguments.length - 2;
        if (_t === 1)
          re.children = A;
        else if (_t > 1) {
          for (var ln = Array(_t), qt = 0; qt < _t; qt++)
            ln[qt] = arguments[qt + 2];
          Object.freeze && Object.freeze(ln), re.children = ln;
        }
        if (h && h.defaultProps) {
          var vt = h.defaultProps;
          for (F in vt)
            re[F] === void 0 && (re[F] = vt[F]);
        }
        if (Ie || de) {
          var Kt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Ie && qa(re, Kt), de && vi(re, Kt);
        }
        return Ue(h, Ie, de, Ge, Et, He.current, re);
      }
      function Pt(h, b) {
        var A = Ue(h.type, b, h.ref, h._self, h._source, h._owner, h.props);
        return A;
      }
      function nn(h, b, A) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var F, re = I({}, h.props), Ie = h.key, de = h.ref, Ge = h._self, Et = h._source, _t = h._owner;
        if (b != null) {
          xr(b) && (de = b.ref, _t = He.current), pa(b) && (Gr(b.key), Ie = "" + b.key);
          var ln;
          h.type && h.type.defaultProps && (ln = h.type.defaultProps);
          for (F in b)
            Tn.call(b, F) && !Qn.hasOwnProperty(F) && (b[F] === void 0 && ln !== void 0 ? re[F] = ln[F] : re[F] = b[F]);
        }
        var qt = arguments.length - 2;
        if (qt === 1)
          re.children = A;
        else if (qt > 1) {
          for (var vt = Array(qt), Kt = 0; Kt < qt; Kt++)
            vt[Kt] = arguments[Kt + 2];
          re.children = vt;
        }
        return Ue(h.type, Ie, de, Ge, Et, _t, re);
      }
      function mn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === J;
      }
      var sn = ".", Zn = ":";
      function rn(h) {
        var b = /[=:]/g, A = {
          "=": "=0",
          ":": "=2"
        }, F = h.replace(b, function(re) {
          return A[re];
        });
        return "$" + F;
      }
      var Qt = !1, Wt = /\/+/g;
      function va(h) {
        return h.replace(Wt, "$&/");
      }
      function Rr(h, b) {
        return typeof h == "object" && h !== null && h.key != null ? (Gr(h.key), rn("" + h.key)) : b.toString(36);
      }
      function ka(h, b, A, F, re) {
        var Ie = typeof h;
        (Ie === "undefined" || Ie === "boolean") && (h = null);
        var de = !1;
        if (h === null)
          de = !0;
        else
          switch (Ie) {
            case "string":
            case "number":
              de = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case J:
                case te:
                  de = !0;
              }
          }
        if (de) {
          var Ge = h, Et = re(Ge), _t = F === "" ? sn + Rr(Ge, 0) : F;
          if (Rn(Et)) {
            var ln = "";
            _t != null && (ln = va(_t) + "/"), ka(Et, b, ln, "", function(rd) {
              return rd;
            });
          } else Et != null && (mn(Et) && (Et.key && (!Ge || Ge.key !== Et.key) && Gr(Et.key), Et = Pt(
            Et,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            A + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Et.key && (!Ge || Ge.key !== Et.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              va("" + Et.key) + "/"
            ) : "") + _t
          )), b.push(Et));
          return 1;
        }
        var qt, vt, Kt = 0, yn = F === "" ? sn : F + Zn;
        if (Rn(h))
          for (var Tl = 0; Tl < h.length; Tl++)
            qt = h[Tl], vt = yn + Rr(qt, Tl), Kt += ka(qt, b, A, vt, re);
        else {
          var Zo = xe(h);
          if (typeof Zo == "function") {
            var $i = h;
            Zo === $i.entries && (Qt || Lt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Qt = !0);
            for (var es = Zo.call($i), du, nd = 0; !(du = es.next()).done; )
              qt = du.value, vt = yn + Rr(qt, nd++), Kt += ka(qt, b, A, vt, re);
          } else if (Ie === "object") {
            var hc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (hc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : hc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Kt;
      }
      function Bi(h, b, A) {
        if (h == null)
          return h;
        var F = [], re = 0;
        return ka(h, F, "", "", function(Ie) {
          return b.call(A, Ie, re++);
        }), F;
      }
      function ru(h) {
        var b = 0;
        return Bi(h, function() {
          b++;
        }), b;
      }
      function au(h, b, A) {
        Bi(h, function() {
          b.apply(this, arguments);
        }, A);
      }
      function ml(h) {
        return Bi(h, function(b) {
          return b;
        }) || [];
      }
      function yl(h) {
        if (!mn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function iu(h) {
        var b = {
          $$typeof: Q,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: h,
          _currentValue2: h,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        b.Provider = {
          $$typeof: se,
          _context: b
        };
        var A = !1, F = !1, re = !1;
        {
          var Ie = {
            $$typeof: Q,
            _context: b
          };
          Object.defineProperties(Ie, {
            Provider: {
              get: function() {
                return F || (F = !0, Oe("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), b.Provider;
              },
              set: function(de) {
                b.Provider = de;
              }
            },
            _currentValue: {
              get: function() {
                return b._currentValue;
              },
              set: function(de) {
                b._currentValue = de;
              }
            },
            _currentValue2: {
              get: function() {
                return b._currentValue2;
              },
              set: function(de) {
                b._currentValue2 = de;
              }
            },
            _threadCount: {
              get: function() {
                return b._threadCount;
              },
              set: function(de) {
                b._threadCount = de;
              }
            },
            Consumer: {
              get: function() {
                return A || (A = !0, Oe("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), b.Consumer;
              }
            },
            displayName: {
              get: function() {
                return b.displayName;
              },
              set: function(de) {
                re || (Lt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", de), re = !0);
              }
            }
          }), b.Consumer = Ie;
        }
        return b._currentRenderer = null, b._currentRenderer2 = null, b;
      }
      var Or = -1, Nr = 0, ur = 1, hi = 2;
      function Ka(h) {
        if (h._status === Or) {
          var b = h._result, A = b();
          if (A.then(function(Ie) {
            if (h._status === Nr || h._status === Or) {
              var de = h;
              de._status = ur, de._result = Ie;
            }
          }, function(Ie) {
            if (h._status === Nr || h._status === Or) {
              var de = h;
              de._status = hi, de._result = Ie;
            }
          }), h._status === Or) {
            var F = h;
            F._status = Nr, F._result = A;
          }
        }
        if (h._status === ur) {
          var re = h._result;
          return re === void 0 && Oe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, re), "default" in re || Oe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, re), re.default;
        } else
          throw h._result;
      }
      function mi(h) {
        var b = {
          // We use these fields to store the result.
          _status: Or,
          _result: h
        }, A = {
          $$typeof: ye,
          _payload: b,
          _init: Ka
        };
        {
          var F, re;
          Object.defineProperties(A, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return F;
              },
              set: function(Ie) {
                Oe("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), F = Ie, Object.defineProperty(A, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return re;
              },
              set: function(Ie) {
                Oe("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), re = Ie, Object.defineProperty(A, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return A;
      }
      function yi(h) {
        h != null && h.$$typeof === le ? Oe("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Oe("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Oe("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Oe("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var b = {
          $$typeof: We,
          render: h
        };
        {
          var A;
          Object.defineProperty(b, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return A;
            },
            set: function(F) {
              A = F, !h.name && !h.displayName && (h.displayName = F);
            }
          });
        }
        return b;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function W(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === Ne || h === Qe || Ft || h === S || h === ne || h === me || Be || h === Le || tn || on || Dt || typeof h == "object" && h !== null && (h.$$typeof === ye || h.$$typeof === le || h.$$typeof === se || h.$$typeof === Q || h.$$typeof === We || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function pe(h, b) {
        W(h) || Oe("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var A = {
          $$typeof: le,
          type: h,
          compare: b === void 0 ? null : b
        };
        {
          var F;
          Object.defineProperty(A, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return F;
            },
            set: function(re) {
              F = re, !h.name && !h.displayName && (h.displayName = re);
            }
          });
        }
        return A;
      }
      function Re() {
        var h = je.current;
        return h === null && Oe(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function lt(h) {
        var b = Re();
        if (h._context !== void 0) {
          var A = h._context;
          A.Consumer === h ? Oe("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : A.Provider === h && Oe("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return b.useContext(h);
      }
      function rt(h) {
        var b = Re();
        return b.useState(h);
      }
      function St(h, b, A) {
        var F = Re();
        return F.useReducer(h, b, A);
      }
      function yt(h) {
        var b = Re();
        return b.useRef(h);
      }
      function wn(h, b) {
        var A = Re();
        return A.useEffect(h, b);
      }
      function an(h, b) {
        var A = Re();
        return A.useInsertionEffect(h, b);
      }
      function cn(h, b) {
        var A = Re();
        return A.useLayoutEffect(h, b);
      }
      function or(h, b) {
        var A = Re();
        return A.useCallback(h, b);
      }
      function Xa(h, b) {
        var A = Re();
        return A.useMemo(h, b);
      }
      function Ja(h, b, A) {
        var F = Re();
        return F.useImperativeHandle(h, b, A);
      }
      function ut(h, b) {
        {
          var A = Re();
          return A.useDebugValue(h, b);
        }
      }
      function ct() {
        var h = Re();
        return h.useTransition();
      }
      function Za(h) {
        var b = Re();
        return b.useDeferredValue(h);
      }
      function lu() {
        var h = Re();
        return h.useId();
      }
      function uu(h, b, A) {
        var F = Re();
        return F.useSyncExternalStore(h, b, A);
      }
      var gl = 0, Xu, Sl, qr, qo, Lr, pc, vc;
      function Ju() {
      }
      Ju.__reactDisabledLog = !0;
      function El() {
        {
          if (gl === 0) {
            Xu = console.log, Sl = console.info, qr = console.warn, qo = console.error, Lr = console.group, pc = console.groupCollapsed, vc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Ju,
              writable: !0
            };
            Object.defineProperties(console, {
              info: h,
              log: h,
              warn: h,
              error: h,
              group: h,
              groupCollapsed: h,
              groupEnd: h
            });
          }
          gl++;
        }
      }
      function ha() {
        {
          if (gl--, gl === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: I({}, h, {
                value: Xu
              }),
              info: I({}, h, {
                value: Sl
              }),
              warn: I({}, h, {
                value: qr
              }),
              error: I({}, h, {
                value: qo
              }),
              group: I({}, h, {
                value: Lr
              }),
              groupCollapsed: I({}, h, {
                value: pc
              }),
              groupEnd: I({}, h, {
                value: vc
              })
            });
          }
          gl < 0 && Oe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ei = Ot.ReactCurrentDispatcher, ti;
      function Zu(h, b, A) {
        {
          if (ti === void 0)
            try {
              throw Error();
            } catch (re) {
              var F = re.stack.trim().match(/\n( *(at )?)/);
              ti = F && F[1] || "";
            }
          return `
` + ti + h;
        }
      }
      var ou = !1, Cl;
      {
        var eo = typeof WeakMap == "function" ? WeakMap : Map;
        Cl = new eo();
      }
      function to(h, b) {
        if (!h || ou)
          return "";
        {
          var A = Cl.get(h);
          if (A !== void 0)
            return A;
        }
        var F;
        ou = !0;
        var re = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ie;
        Ie = ei.current, ei.current = null, El();
        try {
          if (b) {
            var de = function() {
              throw Error();
            };
            if (Object.defineProperty(de.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(de, []);
              } catch (yn) {
                F = yn;
              }
              Reflect.construct(h, [], de);
            } else {
              try {
                de.call();
              } catch (yn) {
                F = yn;
              }
              h.call(de.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (yn) {
              F = yn;
            }
            h();
          }
        } catch (yn) {
          if (yn && F && typeof yn.stack == "string") {
            for (var Ge = yn.stack.split(`
`), Et = F.stack.split(`
`), _t = Ge.length - 1, ln = Et.length - 1; _t >= 1 && ln >= 0 && Ge[_t] !== Et[ln]; )
              ln--;
            for (; _t >= 1 && ln >= 0; _t--, ln--)
              if (Ge[_t] !== Et[ln]) {
                if (_t !== 1 || ln !== 1)
                  do
                    if (_t--, ln--, ln < 0 || Ge[_t] !== Et[ln]) {
                      var qt = `
` + Ge[_t].replace(" at new ", " at ");
                      return h.displayName && qt.includes("<anonymous>") && (qt = qt.replace("<anonymous>", h.displayName)), typeof h == "function" && Cl.set(h, qt), qt;
                    }
                  while (_t >= 1 && ln >= 0);
                break;
              }
          }
        } finally {
          ou = !1, ei.current = Ie, ha(), Error.prepareStackTrace = re;
        }
        var vt = h ? h.displayName || h.name : "", Kt = vt ? Zu(vt) : "";
        return typeof h == "function" && Cl.set(h, Kt), Kt;
      }
      function Ii(h, b, A) {
        return to(h, !1);
      }
      function ed(h) {
        var b = h.prototype;
        return !!(b && b.isReactComponent);
      }
      function Yi(h, b, A) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return to(h, ed(h));
        if (typeof h == "string")
          return Zu(h);
        switch (h) {
          case ne:
            return Zu("Suspense");
          case me:
            return Zu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case We:
              return Ii(h.render);
            case le:
              return Yi(h.type, b, A);
            case ye: {
              var F = h, re = F._payload, Ie = F._init;
              try {
                return Yi(Ie(re), b, A);
              } catch {
              }
            }
          }
        return "";
      }
      var Mt = {}, no = Ot.ReactDebugCurrentFrame;
      function kt(h) {
        if (h) {
          var b = h._owner, A = Yi(h.type, h._source, b ? b.type : null);
          no.setExtraStackFrame(A);
        } else
          no.setExtraStackFrame(null);
      }
      function Ko(h, b, A, F, re) {
        {
          var Ie = Function.call.bind(Tn);
          for (var de in h)
            if (Ie(h, de)) {
              var Ge = void 0;
              try {
                if (typeof h[de] != "function") {
                  var Et = Error((F || "React class") + ": " + A + " type `" + de + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[de] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Et.name = "Invariant Violation", Et;
                }
                Ge = h[de](b, de, F, A, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (_t) {
                Ge = _t;
              }
              Ge && !(Ge instanceof Error) && (kt(re), Oe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", F || "React class", A, de, typeof Ge), kt(null)), Ge instanceof Error && !(Ge.message in Mt) && (Mt[Ge.message] = !0, kt(re), Oe("Failed %s type: %s", A, Ge.message), kt(null));
            }
        }
      }
      function gi(h) {
        if (h) {
          var b = h._owner, A = Yi(h.type, h._source, b ? b.type : null);
          Vt(A);
        } else
          Vt(null);
      }
      var nt;
      nt = !1;
      function ro() {
        if (He.current) {
          var h = Jn(He.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function sr(h) {
        if (h !== void 0) {
          var b = h.fileName.replace(/^.*[\\\/]/, ""), A = h.lineNumber;
          return `

Check your code at ` + b + ":" + A + ".";
        }
        return "";
      }
      function Si(h) {
        return h != null ? sr(h.__source) : "";
      }
      var Mr = {};
      function Ei(h) {
        var b = ro();
        if (!b) {
          var A = typeof h == "string" ? h : h.displayName || h.name;
          A && (b = `

Check the top-level render call using <` + A + ">.");
        }
        return b;
      }
      function fn(h, b) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var A = Ei(b);
          if (!Mr[A]) {
            Mr[A] = !0;
            var F = "";
            h && h._owner && h._owner !== He.current && (F = " It was passed a child from " + Jn(h._owner.type) + "."), gi(h), Oe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', A, F), gi(null);
          }
        }
      }
      function Gt(h, b) {
        if (typeof h == "object") {
          if (Rn(h))
            for (var A = 0; A < h.length; A++) {
              var F = h[A];
              mn(F) && fn(F, b);
            }
          else if (mn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var re = xe(h);
            if (typeof re == "function" && re !== h.entries)
              for (var Ie = re.call(h), de; !(de = Ie.next()).done; )
                mn(de.value) && fn(de.value, b);
          }
        }
      }
      function bl(h) {
        {
          var b = h.type;
          if (b == null || typeof b == "string")
            return;
          var A;
          if (typeof b == "function")
            A = b.propTypes;
          else if (typeof b == "object" && (b.$$typeof === We || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          b.$$typeof === le))
            A = b.propTypes;
          else
            return;
          if (A) {
            var F = Jn(b);
            Ko(A, h.props, "prop", F, h);
          } else if (b.PropTypes !== void 0 && !nt) {
            nt = !0;
            var re = Jn(b);
            Oe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", re || "Unknown");
          }
          typeof b.getDefaultProps == "function" && !b.getDefaultProps.isReactClassApproved && Oe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Wn(h) {
        {
          for (var b = Object.keys(h.props), A = 0; A < b.length; A++) {
            var F = b[A];
            if (F !== "children" && F !== "key") {
              gi(h), Oe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", F), gi(null);
              break;
            }
          }
          h.ref !== null && (gi(h), Oe("Invalid attribute `ref` supplied to `React.Fragment`."), gi(null));
        }
      }
      function Ur(h, b, A) {
        var F = W(h);
        if (!F) {
          var re = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (re += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ie = Si(b);
          Ie ? re += Ie : re += ro();
          var de;
          h === null ? de = "null" : Rn(h) ? de = "array" : h !== void 0 && h.$$typeof === J ? (de = "<" + (Jn(h.type) || "Unknown") + " />", re = " Did you accidentally export a JSX literal instead of a component?") : de = typeof h, Oe("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", de, re);
        }
        var Ge = pt.apply(this, arguments);
        if (Ge == null)
          return Ge;
        if (F)
          for (var Et = 2; Et < arguments.length; Et++)
            Gt(arguments[Et], h);
        return h === Ne ? Wn(Ge) : bl(Ge), Ge;
      }
      var _a = !1;
      function su(h) {
        var b = Ur.bind(null, h);
        return b.type = h, _a || (_a = !0, Lt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(b, "type", {
          enumerable: !1,
          get: function() {
            return Lt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), b;
      }
      function Xo(h, b, A) {
        for (var F = nn.apply(this, arguments), re = 2; re < arguments.length; re++)
          Gt(arguments[re], F.type);
        return bl(F), F;
      }
      function Jo(h, b) {
        var A = ue.transition;
        ue.transition = {};
        var F = ue.transition;
        ue.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (ue.transition = A, A === null && F._updatedFibers) {
            var re = F._updatedFibers.size;
            re > 10 && Lt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), F._updatedFibers.clear();
          }
        }
      }
      var xl = !1, cu = null;
      function td(h) {
        if (cu === null)
          try {
            var b = ("require" + Math.random()).slice(0, 7), A = y && y[b];
            cu = A.call(y, "timers").setImmediate;
          } catch {
            cu = function(re) {
              xl === !1 && (xl = !0, typeof MessageChannel > "u" && Oe("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ie = new MessageChannel();
              Ie.port1.onmessage = re, Ie.port2.postMessage(void 0);
            };
          }
        return cu(h);
      }
      var Da = 0, ni = !1;
      function Ci(h) {
        {
          var b = Da;
          Da++, Te.current === null && (Te.current = []);
          var A = Te.isBatchingLegacy, F;
          try {
            if (Te.isBatchingLegacy = !0, F = h(), !A && Te.didScheduleLegacyUpdate) {
              var re = Te.current;
              re !== null && (Te.didScheduleLegacyUpdate = !1, Rl(re));
            }
          } catch (vt) {
            throw Oa(b), vt;
          } finally {
            Te.isBatchingLegacy = A;
          }
          if (F !== null && typeof F == "object" && typeof F.then == "function") {
            var Ie = F, de = !1, Ge = {
              then: function(vt, Kt) {
                de = !0, Ie.then(function(yn) {
                  Oa(b), Da === 0 ? ao(yn, vt, Kt) : vt(yn);
                }, function(yn) {
                  Oa(b), Kt(yn);
                });
              }
            };
            return !ni && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              de || (ni = !0, Oe("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Ge;
          } else {
            var Et = F;
            if (Oa(b), Da === 0) {
              var _t = Te.current;
              _t !== null && (Rl(_t), Te.current = null);
              var ln = {
                then: function(vt, Kt) {
                  Te.current === null ? (Te.current = [], ao(Et, vt, Kt)) : vt(Et);
                }
              };
              return ln;
            } else {
              var qt = {
                then: function(vt, Kt) {
                  vt(Et);
                }
              };
              return qt;
            }
          }
        }
      }
      function Oa(h) {
        h !== Da - 1 && Oe("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Da = h;
      }
      function ao(h, b, A) {
        {
          var F = Te.current;
          if (F !== null)
            try {
              Rl(F), td(function() {
                F.length === 0 ? (Te.current = null, b(h)) : ao(h, b, A);
              });
            } catch (re) {
              A(re);
            }
          else
            b(h);
        }
      }
      var io = !1;
      function Rl(h) {
        if (!io) {
          io = !0;
          var b = 0;
          try {
            for (; b < h.length; b++) {
              var A = h[b];
              do
                A = A(!0);
              while (A !== null);
            }
            h.length = 0;
          } catch (F) {
            throw h = h.slice(b + 1), F;
          } finally {
            io = !1;
          }
        }
      }
      var fu = Ur, lo = Xo, uo = su, ri = {
        map: Bi,
        forEach: au,
        count: ru,
        toArray: ml,
        only: yl
      };
      M.Children = ri, M.Component = Ke, M.Fragment = Ne, M.Profiler = Qe, M.PureComponent = mt, M.StrictMode = S, M.Suspense = ne, M.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ot, M.act = Ci, M.cloneElement = lo, M.createContext = iu, M.createElement = fu, M.createFactory = uo, M.createRef = Mn, M.forwardRef = yi, M.isValidElement = mn, M.lazy = mi, M.memo = pe, M.startTransition = Jo, M.unstable_act = Ci, M.useCallback = or, M.useContext = lt, M.useDebugValue = ut, M.useDeferredValue = Za, M.useEffect = wn, M.useId = lu, M.useImperativeHandle = Ja, M.useInsertionEffect = an, M.useLayoutEffect = cn, M.useMemo = Xa, M.useReducer = St, M.useRef = yt, M.useState = rt, M.useSyncExternalStore = uu, M.useTransition = ct, M.version = x, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(ov, ov.exports)), ov.exports;
}
var mx;
function sv() {
  return mx || (mx = 1, process.env.NODE_ENV === "production" ? ny.exports = k_() : ny.exports = __()), ny.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yx;
function D_() {
  if (yx) return iv;
  yx = 1;
  var y = sv(), M = Symbol.for("react.element"), x = Symbol.for("react.fragment"), J = Object.prototype.hasOwnProperty, te = y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Ne = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(Qe, se, Q) {
    var We, ne = {}, me = null, le = null;
    Q !== void 0 && (me = "" + Q), se.key !== void 0 && (me = "" + se.key), se.ref !== void 0 && (le = se.ref);
    for (We in se) J.call(se, We) && !Ne.hasOwnProperty(We) && (ne[We] = se[We]);
    if (Qe && Qe.defaultProps) for (We in se = Qe.defaultProps, se) ne[We] === void 0 && (ne[We] = se[We]);
    return { $$typeof: M, type: Qe, key: me, ref: le, props: ne, _owner: te.current };
  }
  return iv.Fragment = x, iv.jsx = S, iv.jsxs = S, iv;
}
var lv = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gx;
function O_() {
  return gx || (gx = 1, process.env.NODE_ENV !== "production" && (function() {
    var y = sv(), M = Symbol.for("react.element"), x = Symbol.for("react.portal"), J = Symbol.for("react.fragment"), te = Symbol.for("react.strict_mode"), Ne = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), Qe = Symbol.for("react.context"), se = Symbol.for("react.forward_ref"), Q = Symbol.for("react.suspense"), We = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), me = Symbol.for("react.lazy"), le = Symbol.for("react.offscreen"), ye = Symbol.iterator, Le = "@@iterator";
    function Je(R) {
      if (R === null || typeof R != "object")
        return null;
      var W = ye && R[ye] || R[Le];
      return typeof W == "function" ? W : null;
    }
    var $ = y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function xe(R) {
      {
        for (var W = arguments.length, pe = new Array(W > 1 ? W - 1 : 0), Re = 1; Re < W; Re++)
          pe[Re - 1] = arguments[Re];
        je("error", R, pe);
      }
    }
    function je(R, W, pe) {
      {
        var Re = $.ReactDebugCurrentFrame, lt = Re.getStackAddendum();
        lt !== "" && (W += "%s", pe = pe.concat([lt]));
        var rt = pe.map(function(St) {
          return String(St);
        });
        rt.unshift("Warning: " + W), Function.prototype.apply.call(console[R], console, rt);
      }
    }
    var ue = !1, Te = !1, He = !1, Ve = !1, Yt = !1, Vt;
    Vt = Symbol.for("react.module.reference");
    function tn(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === J || R === Ne || Yt || R === te || R === Q || R === We || Ve || R === le || ue || Te || He || typeof R == "object" && R !== null && (R.$$typeof === me || R.$$typeof === ne || R.$$typeof === S || R.$$typeof === Qe || R.$$typeof === se || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Vt || R.getModuleId !== void 0));
    }
    function on(R, W, pe) {
      var Re = R.displayName;
      if (Re)
        return Re;
      var lt = W.displayName || W.name || "";
      return lt !== "" ? pe + "(" + lt + ")" : pe;
    }
    function Dt(R) {
      return R.displayName || "Context";
    }
    function Be(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && xe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case J:
          return "Fragment";
        case x:
          return "Portal";
        case Ne:
          return "Profiler";
        case te:
          return "StrictMode";
        case Q:
          return "Suspense";
        case We:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case Qe:
            var W = R;
            return Dt(W) + ".Consumer";
          case S:
            var pe = R;
            return Dt(pe._context) + ".Provider";
          case se:
            return on(R, R.render, "ForwardRef");
          case ne:
            var Re = R.displayName || null;
            return Re !== null ? Re : Be(R.type) || "Memo";
          case me: {
            var lt = R, rt = lt._payload, St = lt._init;
            try {
              return Be(St(rt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Ft = Object.assign, Ot = 0, Lt, Oe, ae, Me, fe, D, I;
    function Ze() {
    }
    Ze.__reactDisabledLog = !0;
    function Ke() {
      {
        if (Ot === 0) {
          Lt = console.log, Oe = console.info, ae = console.warn, Me = console.error, fe = console.group, D = console.groupCollapsed, I = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: Ze,
            writable: !0
          };
          Object.defineProperties(console, {
            info: R,
            log: R,
            warn: R,
            error: R,
            group: R,
            groupCollapsed: R,
            groupEnd: R
          });
        }
        Ot++;
      }
    }
    function ht() {
      {
        if (Ot--, Ot === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ft({}, R, {
              value: Lt
            }),
            info: Ft({}, R, {
              value: Oe
            }),
            warn: Ft({}, R, {
              value: ae
            }),
            error: Ft({}, R, {
              value: Me
            }),
            group: Ft({}, R, {
              value: fe
            }),
            groupCollapsed: Ft({}, R, {
              value: D
            }),
            groupEnd: Ft({}, R, {
              value: I
            })
          });
        }
        Ot < 0 && xe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ft = $.ReactCurrentDispatcher, st;
    function dt(R, W, pe) {
      {
        if (st === void 0)
          try {
            throw Error();
          } catch (lt) {
            var Re = lt.stack.trim().match(/\n( *(at )?)/);
            st = Re && Re[1] || "";
          }
        return `
` + st + R;
      }
    }
    var mt = !1, $t;
    {
      var Mn = typeof WeakMap == "function" ? WeakMap : Map;
      $t = new Mn();
    }
    function Dr(R, W) {
      if (!R || mt)
        return "";
      {
        var pe = $t.get(R);
        if (pe !== void 0)
          return pe;
      }
      var Re;
      mt = !0;
      var lt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var rt;
      rt = ft.current, ft.current = null, Ke();
      try {
        if (W) {
          var St = function() {
            throw Error();
          };
          if (Object.defineProperty(St.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(St, []);
            } catch (ut) {
              Re = ut;
            }
            Reflect.construct(R, [], St);
          } else {
            try {
              St.call();
            } catch (ut) {
              Re = ut;
            }
            R.call(St.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (ut) {
            Re = ut;
          }
          R();
        }
      } catch (ut) {
        if (ut && Re && typeof ut.stack == "string") {
          for (var yt = ut.stack.split(`
`), wn = Re.stack.split(`
`), an = yt.length - 1, cn = wn.length - 1; an >= 1 && cn >= 0 && yt[an] !== wn[cn]; )
            cn--;
          for (; an >= 1 && cn >= 0; an--, cn--)
            if (yt[an] !== wn[cn]) {
              if (an !== 1 || cn !== 1)
                do
                  if (an--, cn--, cn < 0 || yt[an] !== wn[cn]) {
                    var or = `
` + yt[an].replace(" at new ", " at ");
                    return R.displayName && or.includes("<anonymous>") && (or = or.replace("<anonymous>", R.displayName)), typeof R == "function" && $t.set(R, or), or;
                  }
                while (an >= 1 && cn >= 0);
              break;
            }
        }
      } finally {
        mt = !1, ft.current = rt, ht(), Error.prepareStackTrace = lt;
      }
      var Xa = R ? R.displayName || R.name : "", Ja = Xa ? dt(Xa) : "";
      return typeof R == "function" && $t.set(R, Ja), Ja;
    }
    function Rn(R, W, pe) {
      return Dr(R, !1);
    }
    function lr(R) {
      var W = R.prototype;
      return !!(W && W.isReactComponent);
    }
    function Yn(R, W, pe) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return Dr(R, lr(R));
      if (typeof R == "string")
        return dt(R);
      switch (R) {
        case Q:
          return dt("Suspense");
        case We:
          return dt("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case se:
            return Rn(R.render);
          case ne:
            return Yn(R.type, W, pe);
          case me: {
            var Re = R, lt = Re._payload, rt = Re._init;
            try {
              return Yn(rt(lt), W, pe);
            } catch {
            }
          }
        }
      return "";
    }
    var $n = Object.prototype.hasOwnProperty, Gr = {}, pi = $.ReactDebugCurrentFrame;
    function da(R) {
      if (R) {
        var W = R._owner, pe = Yn(R.type, R._source, W ? W.type : null);
        pi.setExtraStackFrame(pe);
      } else
        pi.setExtraStackFrame(null);
    }
    function Jn(R, W, pe, Re, lt) {
      {
        var rt = Function.call.bind($n);
        for (var St in R)
          if (rt(R, St)) {
            var yt = void 0;
            try {
              if (typeof R[St] != "function") {
                var wn = Error((Re || "React class") + ": " + pe + " type `" + St + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[St] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw wn.name = "Invariant Violation", wn;
              }
              yt = R[St](W, St, Re, pe, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (an) {
              yt = an;
            }
            yt && !(yt instanceof Error) && (da(lt), xe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Re || "React class", pe, St, typeof yt), da(null)), yt instanceof Error && !(yt.message in Gr) && (Gr[yt.message] = !0, da(lt), xe("Failed %s type: %s", pe, yt.message), da(null));
          }
      }
    }
    var Tn = Array.isArray;
    function Qn(R) {
      return Tn(R);
    }
    function br(R) {
      {
        var W = typeof Symbol == "function" && Symbol.toStringTag, pe = W && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return pe;
      }
    }
    function Ga(R) {
      try {
        return Un(R), !1;
      } catch {
        return !0;
      }
    }
    function Un(R) {
      return "" + R;
    }
    function xr(R) {
      if (Ga(R))
        return xe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", br(R)), Un(R);
    }
    var pa = $.ReactCurrentOwner, qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, vi, oe;
    function Ue(R) {
      if ($n.call(R, "ref")) {
        var W = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (W && W.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function pt(R) {
      if ($n.call(R, "key")) {
        var W = Object.getOwnPropertyDescriptor(R, "key").get;
        if (W && W.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Pt(R, W) {
      typeof R.ref == "string" && pa.current;
    }
    function nn(R, W) {
      {
        var pe = function() {
          vi || (vi = !0, xe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", W));
        };
        pe.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: pe,
          configurable: !0
        });
      }
    }
    function mn(R, W) {
      {
        var pe = function() {
          oe || (oe = !0, xe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", W));
        };
        pe.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: pe,
          configurable: !0
        });
      }
    }
    var sn = function(R, W, pe, Re, lt, rt, St) {
      var yt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: M,
        // Built-in properties that belong on the element
        type: R,
        key: W,
        ref: pe,
        props: St,
        // Record the component responsible for creating this element.
        _owner: rt
      };
      return yt._store = {}, Object.defineProperty(yt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(yt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Re
      }), Object.defineProperty(yt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: lt
      }), Object.freeze && (Object.freeze(yt.props), Object.freeze(yt)), yt;
    };
    function Zn(R, W, pe, Re, lt) {
      {
        var rt, St = {}, yt = null, wn = null;
        pe !== void 0 && (xr(pe), yt = "" + pe), pt(W) && (xr(W.key), yt = "" + W.key), Ue(W) && (wn = W.ref, Pt(W, lt));
        for (rt in W)
          $n.call(W, rt) && !qa.hasOwnProperty(rt) && (St[rt] = W[rt]);
        if (R && R.defaultProps) {
          var an = R.defaultProps;
          for (rt in an)
            St[rt] === void 0 && (St[rt] = an[rt]);
        }
        if (yt || wn) {
          var cn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          yt && nn(St, cn), wn && mn(St, cn);
        }
        return sn(R, yt, wn, lt, Re, pa.current, St);
      }
    }
    var rn = $.ReactCurrentOwner, Qt = $.ReactDebugCurrentFrame;
    function Wt(R) {
      if (R) {
        var W = R._owner, pe = Yn(R.type, R._source, W ? W.type : null);
        Qt.setExtraStackFrame(pe);
      } else
        Qt.setExtraStackFrame(null);
    }
    var va;
    va = !1;
    function Rr(R) {
      return typeof R == "object" && R !== null && R.$$typeof === M;
    }
    function ka() {
      {
        if (rn.current) {
          var R = Be(rn.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Bi(R) {
      return "";
    }
    var ru = {};
    function au(R) {
      {
        var W = ka();
        if (!W) {
          var pe = typeof R == "string" ? R : R.displayName || R.name;
          pe && (W = `

Check the top-level render call using <` + pe + ">.");
        }
        return W;
      }
    }
    function ml(R, W) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var pe = au(W);
        if (ru[pe])
          return;
        ru[pe] = !0;
        var Re = "";
        R && R._owner && R._owner !== rn.current && (Re = " It was passed a child from " + Be(R._owner.type) + "."), Wt(R), xe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', pe, Re), Wt(null);
      }
    }
    function yl(R, W) {
      {
        if (typeof R != "object")
          return;
        if (Qn(R))
          for (var pe = 0; pe < R.length; pe++) {
            var Re = R[pe];
            Rr(Re) && ml(Re, W);
          }
        else if (Rr(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var lt = Je(R);
          if (typeof lt == "function" && lt !== R.entries)
            for (var rt = lt.call(R), St; !(St = rt.next()).done; )
              Rr(St.value) && ml(St.value, W);
        }
      }
    }
    function iu(R) {
      {
        var W = R.type;
        if (W == null || typeof W == "string")
          return;
        var pe;
        if (typeof W == "function")
          pe = W.propTypes;
        else if (typeof W == "object" && (W.$$typeof === se || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        W.$$typeof === ne))
          pe = W.propTypes;
        else
          return;
        if (pe) {
          var Re = Be(W);
          Jn(pe, R.props, "prop", Re, R);
        } else if (W.PropTypes !== void 0 && !va) {
          va = !0;
          var lt = Be(W);
          xe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", lt || "Unknown");
        }
        typeof W.getDefaultProps == "function" && !W.getDefaultProps.isReactClassApproved && xe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Or(R) {
      {
        for (var W = Object.keys(R.props), pe = 0; pe < W.length; pe++) {
          var Re = W[pe];
          if (Re !== "children" && Re !== "key") {
            Wt(R), xe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Re), Wt(null);
            break;
          }
        }
        R.ref !== null && (Wt(R), xe("Invalid attribute `ref` supplied to `React.Fragment`."), Wt(null));
      }
    }
    var Nr = {};
    function ur(R, W, pe, Re, lt, rt) {
      {
        var St = tn(R);
        if (!St) {
          var yt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (yt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var wn = Bi();
          wn ? yt += wn : yt += ka();
          var an;
          R === null ? an = "null" : Qn(R) ? an = "array" : R !== void 0 && R.$$typeof === M ? (an = "<" + (Be(R.type) || "Unknown") + " />", yt = " Did you accidentally export a JSX literal instead of a component?") : an = typeof R, xe("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", an, yt);
        }
        var cn = Zn(R, W, pe, lt, rt);
        if (cn == null)
          return cn;
        if (St) {
          var or = W.children;
          if (or !== void 0)
            if (Re)
              if (Qn(or)) {
                for (var Xa = 0; Xa < or.length; Xa++)
                  yl(or[Xa], R);
                Object.freeze && Object.freeze(or);
              } else
                xe("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              yl(or, R);
        }
        if ($n.call(W, "key")) {
          var Ja = Be(R), ut = Object.keys(W).filter(function(lu) {
            return lu !== "key";
          }), ct = ut.length > 0 ? "{key: someKey, " + ut.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Nr[Ja + ct]) {
            var Za = ut.length > 0 ? "{" + ut.join(": ..., ") + ": ...}" : "{}";
            xe(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, ct, Ja, Za, Ja), Nr[Ja + ct] = !0;
          }
        }
        return R === J ? Or(cn) : iu(cn), cn;
      }
    }
    function hi(R, W, pe) {
      return ur(R, W, pe, !0);
    }
    function Ka(R, W, pe) {
      return ur(R, W, pe, !1);
    }
    var mi = Ka, yi = hi;
    lv.Fragment = J, lv.jsx = mi, lv.jsxs = yi;
  })()), lv;
}
var Sx;
function N_() {
  return Sx || (Sx = 1, process.env.NODE_ENV === "production" ? ty.exports = D_() : ty.exports = O_()), ty.exports;
}
var P = N_(), Zf = {}, ry = { exports: {} }, Qa = {}, ay = { exports: {} }, bS = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ex;
function L_() {
  return Ex || (Ex = 1, (function(y) {
    function M(ae, Me) {
      var fe = ae.length;
      ae.push(Me);
      e: for (; 0 < fe; ) {
        var D = fe - 1 >>> 1, I = ae[D];
        if (0 < te(I, Me)) ae[D] = Me, ae[fe] = I, fe = D;
        else break e;
      }
    }
    function x(ae) {
      return ae.length === 0 ? null : ae[0];
    }
    function J(ae) {
      if (ae.length === 0) return null;
      var Me = ae[0], fe = ae.pop();
      if (fe !== Me) {
        ae[0] = fe;
        e: for (var D = 0, I = ae.length, Ze = I >>> 1; D < Ze; ) {
          var Ke = 2 * (D + 1) - 1, ht = ae[Ke], ft = Ke + 1, st = ae[ft];
          if (0 > te(ht, fe)) ft < I && 0 > te(st, ht) ? (ae[D] = st, ae[ft] = fe, D = ft) : (ae[D] = ht, ae[Ke] = fe, D = Ke);
          else if (ft < I && 0 > te(st, fe)) ae[D] = st, ae[ft] = fe, D = ft;
          else break e;
        }
      }
      return Me;
    }
    function te(ae, Me) {
      var fe = ae.sortIndex - Me.sortIndex;
      return fe !== 0 ? fe : ae.id - Me.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Ne = performance;
      y.unstable_now = function() {
        return Ne.now();
      };
    } else {
      var S = Date, Qe = S.now();
      y.unstable_now = function() {
        return S.now() - Qe;
      };
    }
    var se = [], Q = [], We = 1, ne = null, me = 3, le = !1, ye = !1, Le = !1, Je = typeof setTimeout == "function" ? setTimeout : null, $ = typeof clearTimeout == "function" ? clearTimeout : null, xe = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function je(ae) {
      for (var Me = x(Q); Me !== null; ) {
        if (Me.callback === null) J(Q);
        else if (Me.startTime <= ae) J(Q), Me.sortIndex = Me.expirationTime, M(se, Me);
        else break;
        Me = x(Q);
      }
    }
    function ue(ae) {
      if (Le = !1, je(ae), !ye) if (x(se) !== null) ye = !0, Lt(Te);
      else {
        var Me = x(Q);
        Me !== null && Oe(ue, Me.startTime - ae);
      }
    }
    function Te(ae, Me) {
      ye = !1, Le && (Le = !1, $(Yt), Yt = -1), le = !0;
      var fe = me;
      try {
        for (je(Me), ne = x(se); ne !== null && (!(ne.expirationTime > Me) || ae && !on()); ) {
          var D = ne.callback;
          if (typeof D == "function") {
            ne.callback = null, me = ne.priorityLevel;
            var I = D(ne.expirationTime <= Me);
            Me = y.unstable_now(), typeof I == "function" ? ne.callback = I : ne === x(se) && J(se), je(Me);
          } else J(se);
          ne = x(se);
        }
        if (ne !== null) var Ze = !0;
        else {
          var Ke = x(Q);
          Ke !== null && Oe(ue, Ke.startTime - Me), Ze = !1;
        }
        return Ze;
      } finally {
        ne = null, me = fe, le = !1;
      }
    }
    var He = !1, Ve = null, Yt = -1, Vt = 5, tn = -1;
    function on() {
      return !(y.unstable_now() - tn < Vt);
    }
    function Dt() {
      if (Ve !== null) {
        var ae = y.unstable_now();
        tn = ae;
        var Me = !0;
        try {
          Me = Ve(!0, ae);
        } finally {
          Me ? Be() : (He = !1, Ve = null);
        }
      } else He = !1;
    }
    var Be;
    if (typeof xe == "function") Be = function() {
      xe(Dt);
    };
    else if (typeof MessageChannel < "u") {
      var Ft = new MessageChannel(), Ot = Ft.port2;
      Ft.port1.onmessage = Dt, Be = function() {
        Ot.postMessage(null);
      };
    } else Be = function() {
      Je(Dt, 0);
    };
    function Lt(ae) {
      Ve = ae, He || (He = !0, Be());
    }
    function Oe(ae, Me) {
      Yt = Je(function() {
        ae(y.unstable_now());
      }, Me);
    }
    y.unstable_IdlePriority = 5, y.unstable_ImmediatePriority = 1, y.unstable_LowPriority = 4, y.unstable_NormalPriority = 3, y.unstable_Profiling = null, y.unstable_UserBlockingPriority = 2, y.unstable_cancelCallback = function(ae) {
      ae.callback = null;
    }, y.unstable_continueExecution = function() {
      ye || le || (ye = !0, Lt(Te));
    }, y.unstable_forceFrameRate = function(ae) {
      0 > ae || 125 < ae ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Vt = 0 < ae ? Math.floor(1e3 / ae) : 5;
    }, y.unstable_getCurrentPriorityLevel = function() {
      return me;
    }, y.unstable_getFirstCallbackNode = function() {
      return x(se);
    }, y.unstable_next = function(ae) {
      switch (me) {
        case 1:
        case 2:
        case 3:
          var Me = 3;
          break;
        default:
          Me = me;
      }
      var fe = me;
      me = Me;
      try {
        return ae();
      } finally {
        me = fe;
      }
    }, y.unstable_pauseExecution = function() {
    }, y.unstable_requestPaint = function() {
    }, y.unstable_runWithPriority = function(ae, Me) {
      switch (ae) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          ae = 3;
      }
      var fe = me;
      me = ae;
      try {
        return Me();
      } finally {
        me = fe;
      }
    }, y.unstable_scheduleCallback = function(ae, Me, fe) {
      var D = y.unstable_now();
      switch (typeof fe == "object" && fe !== null ? (fe = fe.delay, fe = typeof fe == "number" && 0 < fe ? D + fe : D) : fe = D, ae) {
        case 1:
          var I = -1;
          break;
        case 2:
          I = 250;
          break;
        case 5:
          I = 1073741823;
          break;
        case 4:
          I = 1e4;
          break;
        default:
          I = 5e3;
      }
      return I = fe + I, ae = { id: We++, callback: Me, priorityLevel: ae, startTime: fe, expirationTime: I, sortIndex: -1 }, fe > D ? (ae.sortIndex = fe, M(Q, ae), x(se) === null && ae === x(Q) && (Le ? ($(Yt), Yt = -1) : Le = !0, Oe(ue, fe - D))) : (ae.sortIndex = I, M(se, ae), ye || le || (ye = !0, Lt(Te))), ae;
    }, y.unstable_shouldYield = on, y.unstable_wrapCallback = function(ae) {
      var Me = me;
      return function() {
        var fe = me;
        me = Me;
        try {
          return ae.apply(this, arguments);
        } finally {
          me = fe;
        }
      };
    };
  })(bS)), bS;
}
var xS = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Cx;
function M_() {
  return Cx || (Cx = 1, (function(y) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var M = !1, x = 5;
      function J(oe, Ue) {
        var pt = oe.length;
        oe.push(Ue), S(oe, Ue, pt);
      }
      function te(oe) {
        return oe.length === 0 ? null : oe[0];
      }
      function Ne(oe) {
        if (oe.length === 0)
          return null;
        var Ue = oe[0], pt = oe.pop();
        return pt !== Ue && (oe[0] = pt, Qe(oe, pt, 0)), Ue;
      }
      function S(oe, Ue, pt) {
        for (var Pt = pt; Pt > 0; ) {
          var nn = Pt - 1 >>> 1, mn = oe[nn];
          if (se(mn, Ue) > 0)
            oe[nn] = Ue, oe[Pt] = mn, Pt = nn;
          else
            return;
        }
      }
      function Qe(oe, Ue, pt) {
        for (var Pt = pt, nn = oe.length, mn = nn >>> 1; Pt < mn; ) {
          var sn = (Pt + 1) * 2 - 1, Zn = oe[sn], rn = sn + 1, Qt = oe[rn];
          if (se(Zn, Ue) < 0)
            rn < nn && se(Qt, Zn) < 0 ? (oe[Pt] = Qt, oe[rn] = Ue, Pt = rn) : (oe[Pt] = Zn, oe[sn] = Ue, Pt = sn);
          else if (rn < nn && se(Qt, Ue) < 0)
            oe[Pt] = Qt, oe[rn] = Ue, Pt = rn;
          else
            return;
        }
      }
      function se(oe, Ue) {
        var pt = oe.sortIndex - Ue.sortIndex;
        return pt !== 0 ? pt : oe.id - Ue.id;
      }
      var Q = 1, We = 2, ne = 3, me = 4, le = 5;
      function ye(oe, Ue) {
      }
      var Le = typeof performance == "object" && typeof performance.now == "function";
      if (Le) {
        var Je = performance;
        y.unstable_now = function() {
          return Je.now();
        };
      } else {
        var $ = Date, xe = $.now();
        y.unstable_now = function() {
          return $.now() - xe;
        };
      }
      var je = 1073741823, ue = -1, Te = 250, He = 5e3, Ve = 1e4, Yt = je, Vt = [], tn = [], on = 1, Dt = null, Be = ne, Ft = !1, Ot = !1, Lt = !1, Oe = typeof setTimeout == "function" ? setTimeout : null, ae = typeof clearTimeout == "function" ? clearTimeout : null, Me = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function fe(oe) {
        for (var Ue = te(tn); Ue !== null; ) {
          if (Ue.callback === null)
            Ne(tn);
          else if (Ue.startTime <= oe)
            Ne(tn), Ue.sortIndex = Ue.expirationTime, J(Vt, Ue);
          else
            return;
          Ue = te(tn);
        }
      }
      function D(oe) {
        if (Lt = !1, fe(oe), !Ot)
          if (te(Vt) !== null)
            Ot = !0, Un(I);
          else {
            var Ue = te(tn);
            Ue !== null && xr(D, Ue.startTime - oe);
          }
      }
      function I(oe, Ue) {
        Ot = !1, Lt && (Lt = !1, pa()), Ft = !0;
        var pt = Be;
        try {
          var Pt;
          if (!M) return Ze(oe, Ue);
        } finally {
          Dt = null, Be = pt, Ft = !1;
        }
      }
      function Ze(oe, Ue) {
        var pt = Ue;
        for (fe(pt), Dt = te(Vt); Dt !== null && !(Dt.expirationTime > pt && (!oe || pi())); ) {
          var Pt = Dt.callback;
          if (typeof Pt == "function") {
            Dt.callback = null, Be = Dt.priorityLevel;
            var nn = Dt.expirationTime <= pt, mn = Pt(nn);
            pt = y.unstable_now(), typeof mn == "function" ? Dt.callback = mn : Dt === te(Vt) && Ne(Vt), fe(pt);
          } else
            Ne(Vt);
          Dt = te(Vt);
        }
        if (Dt !== null)
          return !0;
        var sn = te(tn);
        return sn !== null && xr(D, sn.startTime - pt), !1;
      }
      function Ke(oe, Ue) {
        switch (oe) {
          case Q:
          case We:
          case ne:
          case me:
          case le:
            break;
          default:
            oe = ne;
        }
        var pt = Be;
        Be = oe;
        try {
          return Ue();
        } finally {
          Be = pt;
        }
      }
      function ht(oe) {
        var Ue;
        switch (Be) {
          case Q:
          case We:
          case ne:
            Ue = ne;
            break;
          default:
            Ue = Be;
            break;
        }
        var pt = Be;
        Be = Ue;
        try {
          return oe();
        } finally {
          Be = pt;
        }
      }
      function ft(oe) {
        var Ue = Be;
        return function() {
          var pt = Be;
          Be = Ue;
          try {
            return oe.apply(this, arguments);
          } finally {
            Be = pt;
          }
        };
      }
      function st(oe, Ue, pt) {
        var Pt = y.unstable_now(), nn;
        if (typeof pt == "object" && pt !== null) {
          var mn = pt.delay;
          typeof mn == "number" && mn > 0 ? nn = Pt + mn : nn = Pt;
        } else
          nn = Pt;
        var sn;
        switch (oe) {
          case Q:
            sn = ue;
            break;
          case We:
            sn = Te;
            break;
          case le:
            sn = Yt;
            break;
          case me:
            sn = Ve;
            break;
          case ne:
          default:
            sn = He;
            break;
        }
        var Zn = nn + sn, rn = {
          id: on++,
          callback: Ue,
          priorityLevel: oe,
          startTime: nn,
          expirationTime: Zn,
          sortIndex: -1
        };
        return nn > Pt ? (rn.sortIndex = nn, J(tn, rn), te(Vt) === null && rn === te(tn) && (Lt ? pa() : Lt = !0, xr(D, nn - Pt))) : (rn.sortIndex = Zn, J(Vt, rn), !Ot && !Ft && (Ot = !0, Un(I))), rn;
      }
      function dt() {
      }
      function mt() {
        !Ot && !Ft && (Ot = !0, Un(I));
      }
      function $t() {
        return te(Vt);
      }
      function Mn(oe) {
        oe.callback = null;
      }
      function Dr() {
        return Be;
      }
      var Rn = !1, lr = null, Yn = -1, $n = x, Gr = -1;
      function pi() {
        var oe = y.unstable_now() - Gr;
        return !(oe < $n);
      }
      function da() {
      }
      function Jn(oe) {
        if (oe < 0 || oe > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        oe > 0 ? $n = Math.floor(1e3 / oe) : $n = x;
      }
      var Tn = function() {
        if (lr !== null) {
          var oe = y.unstable_now();
          Gr = oe;
          var Ue = !0, pt = !0;
          try {
            pt = lr(Ue, oe);
          } finally {
            pt ? Qn() : (Rn = !1, lr = null);
          }
        } else
          Rn = !1;
      }, Qn;
      if (typeof Me == "function")
        Qn = function() {
          Me(Tn);
        };
      else if (typeof MessageChannel < "u") {
        var br = new MessageChannel(), Ga = br.port2;
        br.port1.onmessage = Tn, Qn = function() {
          Ga.postMessage(null);
        };
      } else
        Qn = function() {
          Oe(Tn, 0);
        };
      function Un(oe) {
        lr = oe, Rn || (Rn = !0, Qn());
      }
      function xr(oe, Ue) {
        Yn = Oe(function() {
          oe(y.unstable_now());
        }, Ue);
      }
      function pa() {
        ae(Yn), Yn = -1;
      }
      var qa = da, vi = null;
      y.unstable_IdlePriority = le, y.unstable_ImmediatePriority = Q, y.unstable_LowPriority = me, y.unstable_NormalPriority = ne, y.unstable_Profiling = vi, y.unstable_UserBlockingPriority = We, y.unstable_cancelCallback = Mn, y.unstable_continueExecution = mt, y.unstable_forceFrameRate = Jn, y.unstable_getCurrentPriorityLevel = Dr, y.unstable_getFirstCallbackNode = $t, y.unstable_next = ht, y.unstable_pauseExecution = dt, y.unstable_requestPaint = qa, y.unstable_runWithPriority = Ke, y.unstable_scheduleCallback = st, y.unstable_shouldYield = pi, y.unstable_wrapCallback = ft, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(xS)), xS;
}
var bx;
function zx() {
  return bx || (bx = 1, process.env.NODE_ENV === "production" ? ay.exports = L_() : ay.exports = M_()), ay.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xx;
function U_() {
  if (xx) return Qa;
  xx = 1;
  var y = sv(), M = zx();
  function x(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var J = /* @__PURE__ */ new Set(), te = {};
  function Ne(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (te[n] = r, n = 0; n < r.length; n++) J.add(r[n]);
  }
  var Qe = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), se = Object.prototype.hasOwnProperty, Q = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, We = {}, ne = {};
  function me(n) {
    return se.call(ne, n) ? !0 : se.call(We, n) ? !1 : Q.test(n) ? ne[n] = !0 : (We[n] = !0, !1);
  }
  function le(n, r, l, o) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function ye(n, r, l, o) {
    if (r === null || typeof r > "u" || le(n, r, l, o)) return !0;
    if (o) return !1;
    if (l !== null) switch (l.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function Le(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var Je = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    Je[n] = new Le(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    Je[r] = new Le(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    Je[n] = new Le(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    Je[n] = new Le(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    Je[n] = new Le(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    Je[n] = new Le(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    Je[n] = new Le(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    Je[n] = new Le(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    Je[n] = new Le(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var $ = /[\-:]([a-z])/g;
  function xe(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      $,
      xe
    );
    Je[r] = new Le(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace($, xe);
    Je[r] = new Le(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace($, xe);
    Je[r] = new Le(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    Je[n] = new Le(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), Je.xlinkHref = new Le("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    Je[n] = new Le(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function je(n, r, l, o) {
    var c = Je.hasOwnProperty(r) ? Je[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ye(r, l, c, o) && (l = null), o || c === null ? me(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var ue = y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Te = Symbol.for("react.element"), He = Symbol.for("react.portal"), Ve = Symbol.for("react.fragment"), Yt = Symbol.for("react.strict_mode"), Vt = Symbol.for("react.profiler"), tn = Symbol.for("react.provider"), on = Symbol.for("react.context"), Dt = Symbol.for("react.forward_ref"), Be = Symbol.for("react.suspense"), Ft = Symbol.for("react.suspense_list"), Ot = Symbol.for("react.memo"), Lt = Symbol.for("react.lazy"), Oe = Symbol.for("react.offscreen"), ae = Symbol.iterator;
  function Me(n) {
    return n === null || typeof n != "object" ? null : (n = ae && n[ae] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var fe = Object.assign, D;
  function I(n) {
    if (D === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      D = r && r[1] || "";
    }
    return `
` + D + n;
  }
  var Ze = !1;
  function Ke(n, r) {
    if (!n || Ze) return "";
    Ze = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (j) {
          var o = j;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (j) {
          o = j;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (j) {
          o = j;
        }
        n();
      }
    } catch (j) {
      if (j && o && typeof j.stack == "string") {
        for (var c = j.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, C = d.length - 1; 1 <= m && 0 <= C && c[m] !== d[C]; ) C--;
        for (; 1 <= m && 0 <= C; m--, C--) if (c[m] !== d[C]) {
          if (m !== 1 || C !== 1)
            do
              if (m--, C--, 0 > C || c[m] !== d[C]) {
                var T = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", n.displayName)), T;
              }
            while (1 <= m && 0 <= C);
          break;
        }
      }
    } finally {
      Ze = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? I(n) : "";
  }
  function ht(n) {
    switch (n.tag) {
      case 5:
        return I(n.type);
      case 16:
        return I("Lazy");
      case 13:
        return I("Suspense");
      case 19:
        return I("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Ke(n.type, !1), n;
      case 11:
        return n = Ke(n.type.render, !1), n;
      case 1:
        return n = Ke(n.type, !0), n;
      default:
        return "";
    }
  }
  function ft(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case Ve:
        return "Fragment";
      case He:
        return "Portal";
      case Vt:
        return "Profiler";
      case Yt:
        return "StrictMode";
      case Be:
        return "Suspense";
      case Ft:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case on:
        return (n.displayName || "Context") + ".Consumer";
      case tn:
        return (n._context.displayName || "Context") + ".Provider";
      case Dt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Ot:
        return r = n.displayName || null, r !== null ? r : ft(n.type) || "Memo";
      case Lt:
        r = n._payload, n = n._init;
        try {
          return ft(n(r));
        } catch {
        }
    }
    return null;
  }
  function st(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return ft(r);
      case 8:
        return r === Yt ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function dt(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function mt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function $t(n) {
    var r = mt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(m) {
        o = "" + m, d.call(this, m);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(m) {
        o = "" + m;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Mn(n) {
    n._valueTracker || (n._valueTracker = $t(n));
  }
  function Dr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = mt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function Rn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function lr(n, r) {
    var l = r.checked;
    return fe({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Yn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = dt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function $n(n, r) {
    r = r.checked, r != null && je(n, "checked", r, !1);
  }
  function Gr(n, r) {
    $n(n, r);
    var l = dt(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? da(n, r.type, l) : r.hasOwnProperty("defaultValue") && da(n, r.type, dt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function pi(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function da(n, r, l) {
    (r !== "number" || Rn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Jn = Array.isArray;
  function Tn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + dt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Qn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(x(91));
    return fe({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function br(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(x(92));
        if (Jn(l)) {
          if (1 < l.length) throw Error(x(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: dt(l) };
  }
  function Ga(n, r) {
    var l = dt(r.value), o = dt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Un(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function xr(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function pa(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? xr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var qa, vi = (function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  })(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (qa = qa || document.createElement("div"), qa.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = qa.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function oe(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Ue = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, pt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Ue).forEach(function(n) {
    pt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Ue[r] = Ue[n];
    });
  });
  function Pt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || Ue.hasOwnProperty(n) && Ue[n] ? ("" + r).trim() : r + "px";
  }
  function nn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Pt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var mn = fe({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function sn(n, r) {
    if (r) {
      if (mn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(x(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(x(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(x(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(x(62));
    }
  }
  function Zn(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var rn = null;
  function Qt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Wt = null, va = null, Rr = null;
  function ka(n) {
    if (n = Fe(n)) {
      if (typeof Wt != "function") throw Error(x(280));
      var r = n.stateNode;
      r && (r = gn(r), Wt(n.stateNode, n.type, r));
    }
  }
  function Bi(n) {
    va ? Rr ? Rr.push(n) : Rr = [n] : va = n;
  }
  function ru() {
    if (va) {
      var n = va, r = Rr;
      if (Rr = va = null, ka(n), r) for (n = 0; n < r.length; n++) ka(r[n]);
    }
  }
  function au(n, r) {
    return n(r);
  }
  function ml() {
  }
  var yl = !1;
  function iu(n, r, l) {
    if (yl) return n(r, l);
    yl = !0;
    try {
      return au(n, r, l);
    } finally {
      yl = !1, (va !== null || Rr !== null) && (ml(), ru());
    }
  }
  function Or(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = gn(l);
    if (o === null) return null;
    l = o[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (o = !o.disabled) || (n = n.type, o = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !o;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(x(231, r, typeof l));
    return l;
  }
  var Nr = !1;
  if (Qe) try {
    var ur = {};
    Object.defineProperty(ur, "passive", { get: function() {
      Nr = !0;
    } }), window.addEventListener("test", ur, ur), window.removeEventListener("test", ur, ur);
  } catch {
    Nr = !1;
  }
  function hi(n, r, l, o, c, d, m, C, T) {
    var j = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, j);
    } catch (K) {
      this.onError(K);
    }
  }
  var Ka = !1, mi = null, yi = !1, R = null, W = { onError: function(n) {
    Ka = !0, mi = n;
  } };
  function pe(n, r, l, o, c, d, m, C, T) {
    Ka = !1, mi = null, hi.apply(W, arguments);
  }
  function Re(n, r, l, o, c, d, m, C, T) {
    if (pe.apply(this, arguments), Ka) {
      if (Ka) {
        var j = mi;
        Ka = !1, mi = null;
      } else throw Error(x(198));
      yi || (yi = !0, R = j);
    }
  }
  function lt(n) {
    var r = n, l = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, (r.flags & 4098) !== 0 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function rt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function St(n) {
    if (lt(n) !== n) throw Error(x(188));
  }
  function yt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = lt(n), r === null) throw Error(x(188));
      return r !== n ? null : n;
    }
    for (var l = n, o = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (o = c.return, o !== null) {
          l = o;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l) return St(c), n;
          if (d === o) return St(c), r;
          d = d.sibling;
        }
        throw Error(x(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, C = c.child; C; ) {
          if (C === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (C === o) {
            m = !0, o = c, l = d;
            break;
          }
          C = C.sibling;
        }
        if (!m) {
          for (C = d.child; C; ) {
            if (C === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (C === o) {
              m = !0, o = d, l = c;
              break;
            }
            C = C.sibling;
          }
          if (!m) throw Error(x(189));
        }
      }
      if (l.alternate !== o) throw Error(x(190));
    }
    if (l.tag !== 3) throw Error(x(188));
    return l.stateNode.current === l ? n : r;
  }
  function wn(n) {
    return n = yt(n), n !== null ? an(n) : null;
  }
  function an(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = an(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var cn = M.unstable_scheduleCallback, or = M.unstable_cancelCallback, Xa = M.unstable_shouldYield, Ja = M.unstable_requestPaint, ut = M.unstable_now, ct = M.unstable_getCurrentPriorityLevel, Za = M.unstable_ImmediatePriority, lu = M.unstable_UserBlockingPriority, uu = M.unstable_NormalPriority, gl = M.unstable_LowPriority, Xu = M.unstable_IdlePriority, Sl = null, qr = null;
  function qo(n) {
    if (qr && typeof qr.onCommitFiberRoot == "function") try {
      qr.onCommitFiberRoot(Sl, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Lr = Math.clz32 ? Math.clz32 : Ju, pc = Math.log, vc = Math.LN2;
  function Ju(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (pc(n) / vc | 0) | 0;
  }
  var El = 64, ha = 4194304;
  function ei(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function ti(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var C = m & ~c;
      C !== 0 ? o = ei(C) : (d &= m, d !== 0 && (o = ei(d)));
    } else m = l & ~c, m !== 0 ? o = ei(m) : d !== 0 && (o = ei(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && (r & c) === 0 && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if ((o & 4) !== 0 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - Lr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Zu(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function ou(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - Lr(d), C = 1 << m, T = c[m];
      T === -1 ? ((C & l) === 0 || (C & o) !== 0) && (c[m] = Zu(C, r)) : T <= r && (n.expiredLanes |= C), d &= ~C;
    }
  }
  function Cl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function eo() {
    var n = El;
    return El <<= 1, (El & 4194240) === 0 && (El = 64), n;
  }
  function to(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Ii(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Lr(r), n[r] = l;
  }
  function ed(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Lr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Yi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - Lr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Mt = 0;
  function no(n) {
    return n &= -n, 1 < n ? 4 < n ? (n & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var kt, Ko, gi, nt, ro, sr = !1, Si = [], Mr = null, Ei = null, fn = null, Gt = /* @__PURE__ */ new Map(), bl = /* @__PURE__ */ new Map(), Wn = [], Ur = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function _a(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Mr = null;
        break;
      case "dragenter":
      case "dragleave":
        Ei = null;
        break;
      case "mouseover":
      case "mouseout":
        fn = null;
        break;
      case "pointerover":
      case "pointerout":
        Gt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        bl.delete(r.pointerId);
    }
  }
  function su(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = Fe(r), r !== null && Ko(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Xo(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Mr = su(Mr, n, r, l, o, c), !0;
      case "dragenter":
        return Ei = su(Ei, n, r, l, o, c), !0;
      case "mouseover":
        return fn = su(fn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Gt.set(d, su(Gt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, bl.set(d, su(bl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Jo(n) {
    var r = gu(n.target);
    if (r !== null) {
      var l = lt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = rt(l), r !== null) {
            n.blockedOn = r, ro(n.priority, function() {
              gi(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function xl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = lo(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        rn = o, l.target.dispatchEvent(o), rn = null;
      } else return r = Fe(l), r !== null && Ko(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function cu(n, r, l) {
    xl(n) && l.delete(r);
  }
  function td() {
    sr = !1, Mr !== null && xl(Mr) && (Mr = null), Ei !== null && xl(Ei) && (Ei = null), fn !== null && xl(fn) && (fn = null), Gt.forEach(cu), bl.forEach(cu);
  }
  function Da(n, r) {
    n.blockedOn === r && (n.blockedOn = null, sr || (sr = !0, M.unstable_scheduleCallback(M.unstable_NormalPriority, td)));
  }
  function ni(n) {
    function r(c) {
      return Da(c, n);
    }
    if (0 < Si.length) {
      Da(Si[0], n);
      for (var l = 1; l < Si.length; l++) {
        var o = Si[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (Mr !== null && Da(Mr, n), Ei !== null && Da(Ei, n), fn !== null && Da(fn, n), Gt.forEach(r), bl.forEach(r), l = 0; l < Wn.length; l++) o = Wn[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < Wn.length && (l = Wn[0], l.blockedOn === null); ) Jo(l), l.blockedOn === null && Wn.shift();
  }
  var Ci = ue.ReactCurrentBatchConfig, Oa = !0;
  function ao(n, r, l, o) {
    var c = Mt, d = Ci.transition;
    Ci.transition = null;
    try {
      Mt = 1, Rl(n, r, l, o);
    } finally {
      Mt = c, Ci.transition = d;
    }
  }
  function io(n, r, l, o) {
    var c = Mt, d = Ci.transition;
    Ci.transition = null;
    try {
      Mt = 4, Rl(n, r, l, o);
    } finally {
      Mt = c, Ci.transition = d;
    }
  }
  function Rl(n, r, l, o) {
    if (Oa) {
      var c = lo(n, r, l, o);
      if (c === null) wc(n, r, o, fu, l), _a(n, o);
      else if (Xo(c, n, r, l, o)) o.stopPropagation();
      else if (_a(n, o), r & 4 && -1 < Ur.indexOf(n)) {
        for (; c !== null; ) {
          var d = Fe(c);
          if (d !== null && kt(d), d = lo(n, r, l, o), d === null && wc(n, r, o, fu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else wc(n, r, o, null, l);
    }
  }
  var fu = null;
  function lo(n, r, l, o) {
    if (fu = null, n = Qt(o), n = gu(n), n !== null) if (r = lt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = rt(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return fu = n, null;
  }
  function uo(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ct()) {
          case Za:
            return 1;
          case lu:
            return 4;
          case uu:
          case gl:
            return 16;
          case Xu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ri = null, h = null, b = null;
  function A() {
    if (b) return b;
    var n, r = h, l = r.length, o, c = "value" in ri ? ri.value : ri.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return b = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function F(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function re() {
    return !0;
  }
  function Ie() {
    return !1;
  }
  function de(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var C in n) n.hasOwnProperty(C) && (l = n[C], this[C] = l ? l(d) : d[C]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? re : Ie, this.isPropagationStopped = Ie, this;
    }
    return fe(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = re);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = re);
    }, persist: function() {
    }, isPersistent: re }), r;
  }
  var Ge = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Et = de(Ge), _t = fe({}, Ge, { view: 0, detail: 0 }), ln = de(_t), qt, vt, Kt, yn = fe({}, _t, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ld, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Kt && (Kt && n.type === "mousemove" ? (qt = n.screenX - Kt.screenX, vt = n.screenY - Kt.screenY) : vt = qt = 0, Kt = n), qt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : vt;
  } }), Tl = de(yn), Zo = fe({}, yn, { dataTransfer: 0 }), $i = de(Zo), es = fe({}, _t, { relatedTarget: 0 }), du = de(es), nd = fe({}, Ge, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), hc = de(nd), rd = fe({}, Ge, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), cv = de(rd), ad = fe({}, Ge, { data: 0 }), id = de(ad), fv = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, dv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, ly = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Qi(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ly[n]) ? !!r[n] : !1;
  }
  function ld() {
    return Qi;
  }
  var ud = fe({}, _t, { key: function(n) {
    if (n.key) {
      var r = fv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = F(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? dv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ld, charCode: function(n) {
    return n.type === "keypress" ? F(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? F(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), od = de(ud), sd = fe({}, yn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), pv = de(sd), mc = fe({}, _t, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ld }), vv = de(mc), Kr = fe({}, Ge, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Wi = de(Kr), zn = fe({}, yn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Gi = de(zn), cd = [9, 13, 27, 32], oo = Qe && "CompositionEvent" in window, ts = null;
  Qe && "documentMode" in document && (ts = document.documentMode);
  var ns = Qe && "TextEvent" in window && !ts, hv = Qe && (!oo || ts && 8 < ts && 11 >= ts), mv = " ", yc = !1;
  function yv(n, r) {
    switch (n) {
      case "keyup":
        return cd.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function gv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var so = !1;
  function Sv(n, r) {
    switch (n) {
      case "compositionend":
        return gv(r);
      case "keypress":
        return r.which !== 32 ? null : (yc = !0, mv);
      case "textInput":
        return n = r.data, n === mv && yc ? null : n;
      default:
        return null;
    }
  }
  function uy(n, r) {
    if (so) return n === "compositionend" || !oo && yv(n, r) ? (n = A(), b = h = ri = null, so = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return hv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var oy = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Ev(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!oy[n.type] : r === "textarea";
  }
  function fd(n, r, l, o) {
    Bi(o), r = os(r, "onChange"), 0 < r.length && (l = new Et("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var bi = null, pu = null;
  function Cv(n) {
    mu(n, 0);
  }
  function rs(n) {
    var r = ii(n);
    if (Dr(r)) return n;
  }
  function sy(n, r) {
    if (n === "change") return r;
  }
  var bv = !1;
  if (Qe) {
    var dd;
    if (Qe) {
      var pd = "oninput" in document;
      if (!pd) {
        var xv = document.createElement("div");
        xv.setAttribute("oninput", "return;"), pd = typeof xv.oninput == "function";
      }
      dd = pd;
    } else dd = !1;
    bv = dd && (!document.documentMode || 9 < document.documentMode);
  }
  function Rv() {
    bi && (bi.detachEvent("onpropertychange", Tv), pu = bi = null);
  }
  function Tv(n) {
    if (n.propertyName === "value" && rs(pu)) {
      var r = [];
      fd(r, pu, n, Qt(n)), iu(Cv, r);
    }
  }
  function cy(n, r, l) {
    n === "focusin" ? (Rv(), bi = r, pu = l, bi.attachEvent("onpropertychange", Tv)) : n === "focusout" && Rv();
  }
  function wv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return rs(pu);
  }
  function fy(n, r) {
    if (n === "click") return rs(r);
  }
  function kv(n, r) {
    if (n === "input" || n === "change") return rs(r);
  }
  function dy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ai = typeof Object.is == "function" ? Object.is : dy;
  function as(n, r) {
    if (ai(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!se.call(r, c) || !ai(n[c], r[c])) return !1;
    }
    return !0;
  }
  function _v(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function gc(n, r) {
    var l = _v(n);
    n = 0;
    for (var o; l; ) {
      if (l.nodeType === 3) {
        if (o = n + l.textContent.length, n <= r && o >= r) return { node: l, offset: r - n };
        n = o;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = _v(l);
    }
  }
  function wl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? wl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function is() {
    for (var n = window, r = Rn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = Rn(n.document);
    }
    return r;
  }
  function Sc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function co(n) {
    var r = is(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && wl(l.ownerDocument.documentElement, l)) {
      if (o !== null && Sc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = gc(l, d);
          var m = gc(
            l,
            o
          );
          c && m && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== m.node || n.focusOffset !== m.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > o ? (n.addRange(r), n.extend(m.node, m.offset)) : (r.setEnd(m.node, m.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var py = Qe && "documentMode" in document && 11 >= document.documentMode, fo = null, vd = null, ls = null, hd = !1;
  function md(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    hd || fo == null || fo !== Rn(o) || (o = fo, "selectionStart" in o && Sc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ls && as(ls, o) || (ls = o, o = os(vd, "onSelect"), 0 < o.length && (r = new Et("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = fo)));
  }
  function Ec(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var vu = { animationend: Ec("Animation", "AnimationEnd"), animationiteration: Ec("Animation", "AnimationIteration"), animationstart: Ec("Animation", "AnimationStart"), transitionend: Ec("Transition", "TransitionEnd") }, cr = {}, yd = {};
  Qe && (yd = document.createElement("div").style, "AnimationEvent" in window || (delete vu.animationend.animation, delete vu.animationiteration.animation, delete vu.animationstart.animation), "TransitionEvent" in window || delete vu.transitionend.transition);
  function Cc(n) {
    if (cr[n]) return cr[n];
    if (!vu[n]) return n;
    var r = vu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in yd) return cr[n] = r[l];
    return n;
  }
  var Dv = Cc("animationend"), Ov = Cc("animationiteration"), Nv = Cc("animationstart"), Lv = Cc("transitionend"), gd = /* @__PURE__ */ new Map(), bc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Na(n, r) {
    gd.set(n, r), Ne(r, [n]);
  }
  for (var Sd = 0; Sd < bc.length; Sd++) {
    var hu = bc[Sd], vy = hu.toLowerCase(), hy = hu[0].toUpperCase() + hu.slice(1);
    Na(vy, "on" + hy);
  }
  Na(Dv, "onAnimationEnd"), Na(Ov, "onAnimationIteration"), Na(Nv, "onAnimationStart"), Na("dblclick", "onDoubleClick"), Na("focusin", "onFocus"), Na("focusout", "onBlur"), Na(Lv, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), Ne("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ne("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ne("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ne("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ne("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ne("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var us = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Ed = new Set("cancel close invalid load scroll toggle".split(" ").concat(us));
  function xc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, Re(o, r, void 0, n), n.currentTarget = null;
  }
  function mu(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var C = o[m], T = C.instance, j = C.currentTarget;
          if (C = C.listener, T !== d && c.isPropagationStopped()) break e;
          xc(c, C, j), d = T;
        }
        else for (m = 0; m < o.length; m++) {
          if (C = o[m], T = C.instance, j = C.currentTarget, C = C.listener, T !== d && c.isPropagationStopped()) break e;
          xc(c, C, j), d = T;
        }
      }
    }
    if (yi) throw n = R, yi = !1, R = null, n;
  }
  function Bt(n, r) {
    var l = r[fs];
    l === void 0 && (l = r[fs] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (Mv(r, n, 2, !1), l.add(o));
  }
  function Rc(n, r, l) {
    var o = 0;
    r && (o |= 4), Mv(l, n, o, r);
  }
  var Tc = "_reactListening" + Math.random().toString(36).slice(2);
  function po(n) {
    if (!n[Tc]) {
      n[Tc] = !0, J.forEach(function(l) {
        l !== "selectionchange" && (Ed.has(l) || Rc(l, !1, n), Rc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Tc] || (r[Tc] = !0, Rc("selectionchange", !1, r));
    }
  }
  function Mv(n, r, l, o) {
    switch (uo(r)) {
      case 1:
        var c = ao;
        break;
      case 4:
        c = io;
        break;
      default:
        c = Rl;
    }
    l = c.bind(null, r, l, n), c = void 0, !Nr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function wc(n, r, l, o, c) {
    var d = o;
    if ((r & 1) === 0 && (r & 2) === 0 && o !== null) e: for (; ; ) {
      if (o === null) return;
      var m = o.tag;
      if (m === 3 || m === 4) {
        var C = o.stateNode.containerInfo;
        if (C === c || C.nodeType === 8 && C.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var T = m.tag;
          if ((T === 3 || T === 4) && (T = m.stateNode.containerInfo, T === c || T.nodeType === 8 && T.parentNode === c)) return;
          m = m.return;
        }
        for (; C !== null; ) {
          if (m = gu(C), m === null) return;
          if (T = m.tag, T === 5 || T === 6) {
            o = d = m;
            continue e;
          }
          C = C.parentNode;
        }
      }
      o = o.return;
    }
    iu(function() {
      var j = d, K = Qt(l), Z = [];
      e: {
        var q = gd.get(n);
        if (q !== void 0) {
          var Se = Et, we = n;
          switch (n) {
            case "keypress":
              if (F(l) === 0) break e;
            case "keydown":
            case "keyup":
              Se = od;
              break;
            case "focusin":
              we = "focus", Se = du;
              break;
            case "focusout":
              we = "blur", Se = du;
              break;
            case "beforeblur":
            case "afterblur":
              Se = du;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              Se = Tl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Se = $i;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Se = vv;
              break;
            case Dv:
            case Ov:
            case Nv:
              Se = hc;
              break;
            case Lv:
              Se = Wi;
              break;
            case "scroll":
              Se = ln;
              break;
            case "wheel":
              Se = Gi;
              break;
            case "copy":
            case "cut":
            case "paste":
              Se = cv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Se = pv;
          }
          var De = (r & 4) !== 0, Nn = !De && n === "scroll", O = De ? q !== null ? q + "Capture" : null : q;
          De = [];
          for (var k = j, U; k !== null; ) {
            U = k;
            var X = U.stateNode;
            if (U.tag === 5 && X !== null && (U = X, O !== null && (X = Or(k, O), X != null && De.push(vo(k, X, U)))), Nn) break;
            k = k.return;
          }
          0 < De.length && (q = new Se(q, we, null, l, K), Z.push({ event: q, listeners: De }));
        }
      }
      if ((r & 7) === 0) {
        e: {
          if (q = n === "mouseover" || n === "pointerover", Se = n === "mouseout" || n === "pointerout", q && l !== rn && (we = l.relatedTarget || l.fromElement) && (gu(we) || we[qi])) break e;
          if ((Se || q) && (q = K.window === K ? K : (q = K.ownerDocument) ? q.defaultView || q.parentWindow : window, Se ? (we = l.relatedTarget || l.toElement, Se = j, we = we ? gu(we) : null, we !== null && (Nn = lt(we), we !== Nn || we.tag !== 5 && we.tag !== 6) && (we = null)) : (Se = null, we = j), Se !== we)) {
            if (De = Tl, X = "onMouseLeave", O = "onMouseEnter", k = "mouse", (n === "pointerout" || n === "pointerover") && (De = pv, X = "onPointerLeave", O = "onPointerEnter", k = "pointer"), Nn = Se == null ? q : ii(Se), U = we == null ? q : ii(we), q = new De(X, k + "leave", Se, l, K), q.target = Nn, q.relatedTarget = U, X = null, gu(K) === j && (De = new De(O, k + "enter", we, l, K), De.target = U, De.relatedTarget = Nn, X = De), Nn = X, Se && we) t: {
              for (De = Se, O = we, k = 0, U = De; U; U = kl(U)) k++;
              for (U = 0, X = O; X; X = kl(X)) U++;
              for (; 0 < k - U; ) De = kl(De), k--;
              for (; 0 < U - k; ) O = kl(O), U--;
              for (; k--; ) {
                if (De === O || O !== null && De === O.alternate) break t;
                De = kl(De), O = kl(O);
              }
              De = null;
            }
            else De = null;
            Se !== null && Uv(Z, q, Se, De, !1), we !== null && Nn !== null && Uv(Z, Nn, we, De, !0);
          }
        }
        e: {
          if (q = j ? ii(j) : window, Se = q.nodeName && q.nodeName.toLowerCase(), Se === "select" || Se === "input" && q.type === "file") var ke = sy;
          else if (Ev(q)) if (bv) ke = kv;
          else {
            ke = wv;
            var $e = cy;
          }
          else (Se = q.nodeName) && Se.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (ke = fy);
          if (ke && (ke = ke(n, j))) {
            fd(Z, ke, l, K);
            break e;
          }
          $e && $e(n, q, j), n === "focusout" && ($e = q._wrapperState) && $e.controlled && q.type === "number" && da(q, "number", q.value);
        }
        switch ($e = j ? ii(j) : window, n) {
          case "focusin":
            (Ev($e) || $e.contentEditable === "true") && (fo = $e, vd = j, ls = null);
            break;
          case "focusout":
            ls = vd = fo = null;
            break;
          case "mousedown":
            hd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            hd = !1, md(Z, l, K);
            break;
          case "selectionchange":
            if (py) break;
          case "keydown":
          case "keyup":
            md(Z, l, K);
        }
        var qe;
        if (oo) e: {
          switch (n) {
            case "compositionstart":
              var tt = "onCompositionStart";
              break e;
            case "compositionend":
              tt = "onCompositionEnd";
              break e;
            case "compositionupdate":
              tt = "onCompositionUpdate";
              break e;
          }
          tt = void 0;
        }
        else so ? yv(n, l) && (tt = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (tt = "onCompositionStart");
        tt && (hv && l.locale !== "ko" && (so || tt !== "onCompositionStart" ? tt === "onCompositionEnd" && so && (qe = A()) : (ri = K, h = "value" in ri ? ri.value : ri.textContent, so = !0)), $e = os(j, tt), 0 < $e.length && (tt = new id(tt, n, null, l, K), Z.push({ event: tt, listeners: $e }), qe ? tt.data = qe : (qe = gv(l), qe !== null && (tt.data = qe)))), (qe = ns ? Sv(n, l) : uy(n, l)) && (j = os(j, "onBeforeInput"), 0 < j.length && (K = new id("onBeforeInput", "beforeinput", null, l, K), Z.push({ event: K, listeners: j }), K.data = qe));
      }
      mu(Z, r);
    });
  }
  function vo(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function os(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = Or(n, l), d != null && o.unshift(vo(n, d, c)), d = Or(n, r), d != null && o.push(vo(n, d, c))), n = n.return;
    }
    return o;
  }
  function kl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function Uv(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var C = l, T = C.alternate, j = C.stateNode;
      if (T !== null && T === o) break;
      C.tag === 5 && j !== null && (C = j, c ? (T = Or(l, d), T != null && m.unshift(vo(l, T, C))) : c || (T = Or(l, d), T != null && m.push(vo(l, T, C)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var zv = /\r\n?/g, my = /\u0000|\uFFFD/g;
  function Av(n) {
    return (typeof n == "string" ? n : "" + n).replace(zv, `
`).replace(my, "");
  }
  function kc(n, r, l) {
    if (r = Av(r), Av(n) !== r && l) throw Error(x(425));
  }
  function _l() {
  }
  var ss = null, yu = null;
  function _c(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Dc = typeof setTimeout == "function" ? setTimeout : void 0, Cd = typeof clearTimeout == "function" ? clearTimeout : void 0, jv = typeof Promise == "function" ? Promise : void 0, ho = typeof queueMicrotask == "function" ? queueMicrotask : typeof jv < "u" ? function(n) {
    return jv.resolve(null).then(n).catch(Oc);
  } : Dc;
  function Oc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function mo(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (o === 0) {
          n.removeChild(c), ni(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    ni(r);
  }
  function xi(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function Hv(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0) return n;
          r--;
        } else l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var Dl = Math.random().toString(36).slice(2), Ri = "__reactFiber$" + Dl, cs = "__reactProps$" + Dl, qi = "__reactContainer$" + Dl, fs = "__reactEvents$" + Dl, yo = "__reactListeners$" + Dl, yy = "__reactHandles$" + Dl;
  function gu(n) {
    var r = n[Ri];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[qi] || l[Ri]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Hv(n); n !== null; ) {
          if (l = n[Ri]) return l;
          n = Hv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function Fe(n) {
    return n = n[Ri] || n[qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ii(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(x(33));
  }
  function gn(n) {
    return n[cs] || null;
  }
  var xt = [], La = -1;
  function Ma(n) {
    return { current: n };
  }
  function un(n) {
    0 > La || (n.current = xt[La], xt[La] = null, La--);
  }
  function Ae(n, r) {
    La++, xt[La] = n.current, n.current = r;
  }
  var Tr = {}, bn = Ma(Tr), Gn = Ma(!1), Xr = Tr;
  function Jr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Tr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function An(n) {
    return n = n.childContextTypes, n != null;
  }
  function go() {
    un(Gn), un(bn);
  }
  function Fv(n, r, l) {
    if (bn.current !== Tr) throw Error(x(168));
    Ae(bn, r), Ae(Gn, l);
  }
  function ds(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(x(108, st(n) || "Unknown", c));
    return fe({}, l, o);
  }
  function er(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Tr, Xr = bn.current, Ae(bn, n), Ae(Gn, Gn.current), !0;
  }
  function Nc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(x(169));
    l ? (n = ds(n, r, Xr), o.__reactInternalMemoizedMergedChildContext = n, un(Gn), un(bn), Ae(bn, n)) : un(Gn), Ae(Gn, l);
  }
  var Ti = null, So = !1, Ki = !1;
  function Lc(n) {
    Ti === null ? Ti = [n] : Ti.push(n);
  }
  function Ol(n) {
    So = !0, Lc(n);
  }
  function wi() {
    if (!Ki && Ti !== null) {
      Ki = !0;
      var n = 0, r = Mt;
      try {
        var l = Ti;
        for (Mt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ti = null, So = !1;
      } catch (c) {
        throw Ti !== null && (Ti = Ti.slice(n + 1)), cn(Za, wi), c;
      } finally {
        Mt = r, Ki = !1;
      }
    }
    return null;
  }
  var Nl = [], Ll = 0, Ml = null, Xi = 0, jn = [], Ua = 0, ma = null, ki = 1, _i = "";
  function Su(n, r) {
    Nl[Ll++] = Xi, Nl[Ll++] = Ml, Ml = n, Xi = r;
  }
  function Pv(n, r, l) {
    jn[Ua++] = ki, jn[Ua++] = _i, jn[Ua++] = ma, ma = n;
    var o = ki;
    n = _i;
    var c = 32 - Lr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Lr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, ki = 1 << 32 - Lr(r) + c | l << c | o, _i = d + n;
    } else ki = 1 << d | l << c | o, _i = n;
  }
  function Mc(n) {
    n.return !== null && (Su(n, 1), Pv(n, 1, 0));
  }
  function Uc(n) {
    for (; n === Ml; ) Ml = Nl[--Ll], Nl[Ll] = null, Xi = Nl[--Ll], Nl[Ll] = null;
    for (; n === ma; ) ma = jn[--Ua], jn[Ua] = null, _i = jn[--Ua], jn[Ua] = null, ki = jn[--Ua], jn[Ua] = null;
  }
  var Zr = null, ea = null, pn = !1, za = null;
  function bd(n, r) {
    var l = Pa(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Vv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Zr = n, ea = xi(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Zr = n, ea = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = ma !== null ? { id: ki, overflow: _i } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Pa(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Zr = n, ea = null, !0) : !1;
      default:
        return !1;
    }
  }
  function xd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Rd(n) {
    if (pn) {
      var r = ea;
      if (r) {
        var l = r;
        if (!Vv(n, r)) {
          if (xd(n)) throw Error(x(418));
          r = xi(l.nextSibling);
          var o = Zr;
          r && Vv(n, r) ? bd(o, l) : (n.flags = n.flags & -4097 | 2, pn = !1, Zr = n);
        }
      } else {
        if (xd(n)) throw Error(x(418));
        n.flags = n.flags & -4097 | 2, pn = !1, Zr = n;
      }
    }
  }
  function qn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Zr = n;
  }
  function zc(n) {
    if (n !== Zr) return !1;
    if (!pn) return qn(n), pn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !_c(n.type, n.memoizedProps)), r && (r = ea)) {
      if (xd(n)) throw ps(), Error(x(418));
      for (; r; ) bd(n, r), r = xi(r.nextSibling);
    }
    if (qn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(x(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                ea = xi(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        ea = null;
      }
    } else ea = Zr ? xi(n.stateNode.nextSibling) : null;
    return !0;
  }
  function ps() {
    for (var n = ea; n; ) n = xi(n.nextSibling);
  }
  function Ul() {
    ea = Zr = null, pn = !1;
  }
  function Ji(n) {
    za === null ? za = [n] : za.push(n);
  }
  var gy = ue.ReactCurrentBatchConfig;
  function Eu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(x(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(x(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var C = c.refs;
          m === null ? delete C[d] : C[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(x(284));
      if (!l._owner) throw Error(x(290, n));
    }
    return n;
  }
  function Ac(n, r) {
    throw n = Object.prototype.toString.call(r), Error(x(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Bv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Cu(n) {
    function r(O, k) {
      if (n) {
        var U = O.deletions;
        U === null ? (O.deletions = [k], O.flags |= 16) : U.push(k);
      }
    }
    function l(O, k) {
      if (!n) return null;
      for (; k !== null; ) r(O, k), k = k.sibling;
      return null;
    }
    function o(O, k) {
      for (O = /* @__PURE__ */ new Map(); k !== null; ) k.key !== null ? O.set(k.key, k) : O.set(k.index, k), k = k.sibling;
      return O;
    }
    function c(O, k) {
      return O = Bl(O, k), O.index = 0, O.sibling = null, O;
    }
    function d(O, k, U) {
      return O.index = U, n ? (U = O.alternate, U !== null ? (U = U.index, U < k ? (O.flags |= 2, k) : U) : (O.flags |= 2, k)) : (O.flags |= 1048576, k);
    }
    function m(O) {
      return n && O.alternate === null && (O.flags |= 2), O;
    }
    function C(O, k, U, X) {
      return k === null || k.tag !== 6 ? (k = tp(U, O.mode, X), k.return = O, k) : (k = c(k, U), k.return = O, k);
    }
    function T(O, k, U, X) {
      var ke = U.type;
      return ke === Ve ? K(O, k, U.props.children, X, U.key) : k !== null && (k.elementType === ke || typeof ke == "object" && ke !== null && ke.$$typeof === Lt && Bv(ke) === k.type) ? (X = c(k, U.props), X.ref = Eu(O, k, U), X.return = O, X) : (X = Is(U.type, U.key, U.props, null, O.mode, X), X.ref = Eu(O, k, U), X.return = O, X);
    }
    function j(O, k, U, X) {
      return k === null || k.tag !== 4 || k.stateNode.containerInfo !== U.containerInfo || k.stateNode.implementation !== U.implementation ? (k = mf(U, O.mode, X), k.return = O, k) : (k = c(k, U.children || []), k.return = O, k);
    }
    function K(O, k, U, X, ke) {
      return k === null || k.tag !== 7 ? (k = al(U, O.mode, X, ke), k.return = O, k) : (k = c(k, U), k.return = O, k);
    }
    function Z(O, k, U) {
      if (typeof k == "string" && k !== "" || typeof k == "number") return k = tp("" + k, O.mode, U), k.return = O, k;
      if (typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case Te:
            return U = Is(k.type, k.key, k.props, null, O.mode, U), U.ref = Eu(O, null, k), U.return = O, U;
          case He:
            return k = mf(k, O.mode, U), k.return = O, k;
          case Lt:
            var X = k._init;
            return Z(O, X(k._payload), U);
        }
        if (Jn(k) || Me(k)) return k = al(k, O.mode, U, null), k.return = O, k;
        Ac(O, k);
      }
      return null;
    }
    function q(O, k, U, X) {
      var ke = k !== null ? k.key : null;
      if (typeof U == "string" && U !== "" || typeof U == "number") return ke !== null ? null : C(O, k, "" + U, X);
      if (typeof U == "object" && U !== null) {
        switch (U.$$typeof) {
          case Te:
            return U.key === ke ? T(O, k, U, X) : null;
          case He:
            return U.key === ke ? j(O, k, U, X) : null;
          case Lt:
            return ke = U._init, q(
              O,
              k,
              ke(U._payload),
              X
            );
        }
        if (Jn(U) || Me(U)) return ke !== null ? null : K(O, k, U, X, null);
        Ac(O, U);
      }
      return null;
    }
    function Se(O, k, U, X, ke) {
      if (typeof X == "string" && X !== "" || typeof X == "number") return O = O.get(U) || null, C(k, O, "" + X, ke);
      if (typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case Te:
            return O = O.get(X.key === null ? U : X.key) || null, T(k, O, X, ke);
          case He:
            return O = O.get(X.key === null ? U : X.key) || null, j(k, O, X, ke);
          case Lt:
            var $e = X._init;
            return Se(O, k, U, $e(X._payload), ke);
        }
        if (Jn(X) || Me(X)) return O = O.get(U) || null, K(k, O, X, ke, null);
        Ac(k, X);
      }
      return null;
    }
    function we(O, k, U, X) {
      for (var ke = null, $e = null, qe = k, tt = k = 0, rr = null; qe !== null && tt < U.length; tt++) {
        qe.index > tt ? (rr = qe, qe = null) : rr = qe.sibling;
        var At = q(O, qe, U[tt], X);
        if (At === null) {
          qe === null && (qe = rr);
          break;
        }
        n && qe && At.alternate === null && r(O, qe), k = d(At, k, tt), $e === null ? ke = At : $e.sibling = At, $e = At, qe = rr;
      }
      if (tt === U.length) return l(O, qe), pn && Su(O, tt), ke;
      if (qe === null) {
        for (; tt < U.length; tt++) qe = Z(O, U[tt], X), qe !== null && (k = d(qe, k, tt), $e === null ? ke = qe : $e.sibling = qe, $e = qe);
        return pn && Su(O, tt), ke;
      }
      for (qe = o(O, qe); tt < U.length; tt++) rr = Se(qe, O, tt, U[tt], X), rr !== null && (n && rr.alternate !== null && qe.delete(rr.key === null ? tt : rr.key), k = d(rr, k, tt), $e === null ? ke = rr : $e.sibling = rr, $e = rr);
      return n && qe.forEach(function($l) {
        return r(O, $l);
      }), pn && Su(O, tt), ke;
    }
    function De(O, k, U, X) {
      var ke = Me(U);
      if (typeof ke != "function") throw Error(x(150));
      if (U = ke.call(U), U == null) throw Error(x(151));
      for (var $e = ke = null, qe = k, tt = k = 0, rr = null, At = U.next(); qe !== null && !At.done; tt++, At = U.next()) {
        qe.index > tt ? (rr = qe, qe = null) : rr = qe.sibling;
        var $l = q(O, qe, At.value, X);
        if ($l === null) {
          qe === null && (qe = rr);
          break;
        }
        n && qe && $l.alternate === null && r(O, qe), k = d($l, k, tt), $e === null ? ke = $l : $e.sibling = $l, $e = $l, qe = rr;
      }
      if (At.done) return l(
        O,
        qe
      ), pn && Su(O, tt), ke;
      if (qe === null) {
        for (; !At.done; tt++, At = U.next()) At = Z(O, At.value, X), At !== null && (k = d(At, k, tt), $e === null ? ke = At : $e.sibling = At, $e = At);
        return pn && Su(O, tt), ke;
      }
      for (qe = o(O, qe); !At.done; tt++, At = U.next()) At = Se(qe, O, tt, At.value, X), At !== null && (n && At.alternate !== null && qe.delete(At.key === null ? tt : At.key), k = d(At, k, tt), $e === null ? ke = At : $e.sibling = At, $e = At);
      return n && qe.forEach(function(Rh) {
        return r(O, Rh);
      }), pn && Su(O, tt), ke;
    }
    function Nn(O, k, U, X) {
      if (typeof U == "object" && U !== null && U.type === Ve && U.key === null && (U = U.props.children), typeof U == "object" && U !== null) {
        switch (U.$$typeof) {
          case Te:
            e: {
              for (var ke = U.key, $e = k; $e !== null; ) {
                if ($e.key === ke) {
                  if (ke = U.type, ke === Ve) {
                    if ($e.tag === 7) {
                      l(O, $e.sibling), k = c($e, U.props.children), k.return = O, O = k;
                      break e;
                    }
                  } else if ($e.elementType === ke || typeof ke == "object" && ke !== null && ke.$$typeof === Lt && Bv(ke) === $e.type) {
                    l(O, $e.sibling), k = c($e, U.props), k.ref = Eu(O, $e, U), k.return = O, O = k;
                    break e;
                  }
                  l(O, $e);
                  break;
                } else r(O, $e);
                $e = $e.sibling;
              }
              U.type === Ve ? (k = al(U.props.children, O.mode, X, U.key), k.return = O, O = k) : (X = Is(U.type, U.key, U.props, null, O.mode, X), X.ref = Eu(O, k, U), X.return = O, O = X);
            }
            return m(O);
          case He:
            e: {
              for ($e = U.key; k !== null; ) {
                if (k.key === $e) if (k.tag === 4 && k.stateNode.containerInfo === U.containerInfo && k.stateNode.implementation === U.implementation) {
                  l(O, k.sibling), k = c(k, U.children || []), k.return = O, O = k;
                  break e;
                } else {
                  l(O, k);
                  break;
                }
                else r(O, k);
                k = k.sibling;
              }
              k = mf(U, O.mode, X), k.return = O, O = k;
            }
            return m(O);
          case Lt:
            return $e = U._init, Nn(O, k, $e(U._payload), X);
        }
        if (Jn(U)) return we(O, k, U, X);
        if (Me(U)) return De(O, k, U, X);
        Ac(O, U);
      }
      return typeof U == "string" && U !== "" || typeof U == "number" ? (U = "" + U, k !== null && k.tag === 6 ? (l(O, k.sibling), k = c(k, U), k.return = O, O = k) : (l(O, k), k = tp(U, O.mode, X), k.return = O, O = k), m(O)) : l(O, k);
    }
    return Nn;
  }
  var kn = Cu(!0), ve = Cu(!1), ya = Ma(null), ta = null, Eo = null, Td = null;
  function wd() {
    Td = Eo = ta = null;
  }
  function kd(n) {
    var r = ya.current;
    un(ya), n._currentValue = r;
  }
  function _d(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function Sn(n, r) {
    ta = n, Td = Eo = null, n = n.dependencies, n !== null && n.firstContext !== null && ((n.lanes & r) !== 0 && (Fn = !0), n.firstContext = null);
  }
  function Aa(n) {
    var r = n._currentValue;
    if (Td !== n) if (n = { context: n, memoizedValue: r, next: null }, Eo === null) {
      if (ta === null) throw Error(x(308));
      Eo = n, ta.dependencies = { lanes: 0, firstContext: n };
    } else Eo = Eo.next = n;
    return r;
  }
  var bu = null;
  function Dd(n) {
    bu === null ? bu = [n] : bu.push(n);
  }
  function Od(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Dd(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ga(n, o);
  }
  function ga(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Sa = !1;
  function Nd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Iv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Zi(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function zl(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (Rt & 2) !== 0) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ga(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Dd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ga(n, l);
  }
  function jc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Yi(n, l);
    }
  }
  function Yv(n, r) {
    var l = n.updateQueue, o = n.alternate;
    if (o !== null && (o = o.updateQueue, l === o)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var m = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = m : d = d.next = m, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else c = d = r;
      l = { baseState: o.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: o.shared, effects: o.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function vs(n, r, l, o) {
    var c = n.updateQueue;
    Sa = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, C = c.shared.pending;
    if (C !== null) {
      c.shared.pending = null;
      var T = C, j = T.next;
      T.next = null, m === null ? d = j : m.next = j, m = T;
      var K = n.alternate;
      K !== null && (K = K.updateQueue, C = K.lastBaseUpdate, C !== m && (C === null ? K.firstBaseUpdate = j : C.next = j, K.lastBaseUpdate = T));
    }
    if (d !== null) {
      var Z = c.baseState;
      m = 0, K = j = T = null, C = d;
      do {
        var q = C.lane, Se = C.eventTime;
        if ((o & q) === q) {
          K !== null && (K = K.next = {
            eventTime: Se,
            lane: 0,
            tag: C.tag,
            payload: C.payload,
            callback: C.callback,
            next: null
          });
          e: {
            var we = n, De = C;
            switch (q = r, Se = l, De.tag) {
              case 1:
                if (we = De.payload, typeof we == "function") {
                  Z = we.call(Se, Z, q);
                  break e;
                }
                Z = we;
                break e;
              case 3:
                we.flags = we.flags & -65537 | 128;
              case 0:
                if (we = De.payload, q = typeof we == "function" ? we.call(Se, Z, q) : we, q == null) break e;
                Z = fe({}, Z, q);
                break e;
              case 2:
                Sa = !0;
            }
          }
          C.callback !== null && C.lane !== 0 && (n.flags |= 64, q = c.effects, q === null ? c.effects = [C] : q.push(C));
        } else Se = { eventTime: Se, lane: q, tag: C.tag, payload: C.payload, callback: C.callback, next: null }, K === null ? (j = K = Se, T = Z) : K = K.next = Se, m |= q;
        if (C = C.next, C === null) {
          if (C = c.shared.pending, C === null) break;
          q = C, C = q.next, q.next = null, c.lastBaseUpdate = q, c.shared.pending = null;
        }
      } while (!0);
      if (K === null && (T = Z), c.baseState = T, c.firstBaseUpdate = j, c.lastBaseUpdate = K, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Mi |= m, n.lanes = m, n.memoizedState = Z;
    }
  }
  function Ld(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(x(191, c));
        c.call(o);
      }
    }
  }
  var hs = {}, Di = Ma(hs), ms = Ma(hs), ys = Ma(hs);
  function xu(n) {
    if (n === hs) throw Error(x(174));
    return n;
  }
  function Md(n, r) {
    switch (Ae(ys, r), Ae(ms, n), Ae(Di, hs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : pa(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = pa(r, n);
    }
    un(Di), Ae(Di, r);
  }
  function Ru() {
    un(Di), un(ms), un(ys);
  }
  function $v(n) {
    xu(ys.current);
    var r = xu(Di.current), l = pa(r, n.type);
    r !== l && (Ae(ms, n), Ae(Di, l));
  }
  function Hc(n) {
    ms.current === n && (un(Di), un(ms));
  }
  var En = Ma(0);
  function Fc(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if ((r.flags & 128) !== 0) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var gs = [];
  function Pe() {
    for (var n = 0; n < gs.length; n++) gs[n]._workInProgressVersionPrimary = null;
    gs.length = 0;
  }
  var gt = ue.ReactCurrentDispatcher, Ut = ue.ReactCurrentBatchConfig, Xt = 0, zt = null, Hn = null, tr = null, Pc = !1, Ss = !1, Tu = 0, G = 0;
  function Nt() {
    throw Error(x(321));
  }
  function Xe(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ai(n[l], r[l])) return !1;
    return !0;
  }
  function Al(n, r, l, o, c, d) {
    if (Xt = d, zt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, gt.current = n === null || n.memoizedState === null ? tf : Ts, n = l(o, c), Ss) {
      d = 0;
      do {
        if (Ss = !1, Tu = 0, 25 <= d) throw Error(x(301));
        d += 1, tr = Hn = null, r.updateQueue = null, gt.current = nf, n = l(o, c);
      } while (Ss);
    }
    if (gt.current = Ou, r = Hn !== null && Hn.next !== null, Xt = 0, tr = Hn = zt = null, Pc = !1, r) throw Error(x(300));
    return n;
  }
  function li() {
    var n = Tu !== 0;
    return Tu = 0, n;
  }
  function wr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return tr === null ? zt.memoizedState = tr = n : tr = tr.next = n, tr;
  }
  function _n() {
    if (Hn === null) {
      var n = zt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Hn.next;
    var r = tr === null ? zt.memoizedState : tr.next;
    if (r !== null) tr = r, Hn = n;
    else {
      if (n === null) throw Error(x(310));
      Hn = n, n = { memoizedState: Hn.memoizedState, baseState: Hn.baseState, baseQueue: Hn.baseQueue, queue: Hn.queue, next: null }, tr === null ? zt.memoizedState = tr = n : tr = tr.next = n;
    }
    return tr;
  }
  function el(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function jl(n) {
    var r = _n(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = Hn, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var C = m = null, T = null, j = d;
      do {
        var K = j.lane;
        if ((Xt & K) === K) T !== null && (T = T.next = { lane: 0, action: j.action, hasEagerState: j.hasEagerState, eagerState: j.eagerState, next: null }), o = j.hasEagerState ? j.eagerState : n(o, j.action);
        else {
          var Z = {
            lane: K,
            action: j.action,
            hasEagerState: j.hasEagerState,
            eagerState: j.eagerState,
            next: null
          };
          T === null ? (C = T = Z, m = o) : T = T.next = Z, zt.lanes |= K, Mi |= K;
        }
        j = j.next;
      } while (j !== null && j !== d);
      T === null ? m = o : T.next = C, ai(o, r.memoizedState) || (Fn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, zt.lanes |= d, Mi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function wu(n) {
    var r = _n(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ai(d, r.memoizedState) || (Fn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function Vc() {
  }
  function Bc(n, r) {
    var l = zt, o = _n(), c = r(), d = !ai(o.memoizedState, c);
    if (d && (o.memoizedState = c, Fn = !0), o = o.queue, Es($c.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || tr !== null && tr.memoizedState.tag & 1) {
      if (l.flags |= 2048, ku(9, Yc.bind(null, l, o, c, r), void 0, null), Kn === null) throw Error(x(349));
      (Xt & 30) !== 0 || Ic(l, r, c);
    }
    return c;
  }
  function Ic(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = zt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, zt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Yc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Qc(r) && Wc(n);
  }
  function $c(n, r, l) {
    return l(function() {
      Qc(r) && Wc(n);
    });
  }
  function Qc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ai(n, l);
    } catch {
      return !0;
    }
  }
  function Wc(n) {
    var r = ga(n, 1);
    r !== null && Hr(r, n, 1, -1);
  }
  function Gc(n) {
    var r = wr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: el, lastRenderedState: n }, r.queue = n, n = n.dispatch = Du.bind(null, zt, n), [r.memoizedState, n];
  }
  function ku(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = zt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, zt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function qc() {
    return _n().memoizedState;
  }
  function Co(n, r, l, o) {
    var c = wr();
    zt.flags |= n, c.memoizedState = ku(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function bo(n, r, l, o) {
    var c = _n();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Hn !== null) {
      var m = Hn.memoizedState;
      if (d = m.destroy, o !== null && Xe(o, m.deps)) {
        c.memoizedState = ku(r, l, d, o);
        return;
      }
    }
    zt.flags |= n, c.memoizedState = ku(1 | r, l, d, o);
  }
  function Kc(n, r) {
    return Co(8390656, 8, n, r);
  }
  function Es(n, r) {
    return bo(2048, 8, n, r);
  }
  function Xc(n, r) {
    return bo(4, 2, n, r);
  }
  function Cs(n, r) {
    return bo(4, 4, n, r);
  }
  function _u(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Jc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, bo(4, 4, _u.bind(null, r, n), l);
  }
  function bs() {
  }
  function Zc(n, r) {
    var l = _n();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Xe(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function ef(n, r) {
    var l = _n();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Xe(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Ud(n, r, l) {
    return (Xt & 21) === 0 ? (n.baseState && (n.baseState = !1, Fn = !0), n.memoizedState = l) : (ai(l, r) || (l = eo(), zt.lanes |= l, Mi |= l, n.baseState = !0), r);
  }
  function xs(n, r) {
    var l = Mt;
    Mt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Ut.transition;
    Ut.transition = {};
    try {
      n(!1), r();
    } finally {
      Mt = l, Ut.transition = o;
    }
  }
  function zd() {
    return _n().memoizedState;
  }
  function Rs(n, r, l) {
    var o = Ui(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, na(n)) Qv(r, l);
    else if (l = Od(n, r, l, o), l !== null) {
      var c = Bn();
      Hr(l, n, o, c), en(l, r, o);
    }
  }
  function Du(n, r, l) {
    var o = Ui(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (na(n)) Qv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, C = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = C, ai(C, m)) {
          var T = r.interleaved;
          T === null ? (c.next = c, Dd(r)) : (c.next = T.next, T.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Od(n, r, c, o), l !== null && (c = Bn(), Hr(l, n, o, c), en(l, r, o));
    }
  }
  function na(n) {
    var r = n.alternate;
    return n === zt || r !== null && r === zt;
  }
  function Qv(n, r) {
    Ss = Pc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function en(n, r, l) {
    if ((l & 4194240) !== 0) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Yi(n, l);
    }
  }
  var Ou = { readContext: Aa, useCallback: Nt, useContext: Nt, useEffect: Nt, useImperativeHandle: Nt, useInsertionEffect: Nt, useLayoutEffect: Nt, useMemo: Nt, useReducer: Nt, useRef: Nt, useState: Nt, useDebugValue: Nt, useDeferredValue: Nt, useTransition: Nt, useMutableSource: Nt, useSyncExternalStore: Nt, useId: Nt, unstable_isNewReconciler: !1 }, tf = { readContext: Aa, useCallback: function(n, r) {
    return wr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Aa, useEffect: Kc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, Co(
      4194308,
      4,
      _u.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return Co(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return Co(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = wr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = wr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Rs.bind(null, zt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = wr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Gc, useDebugValue: bs, useDeferredValue: function(n) {
    return wr().memoizedState = n;
  }, useTransition: function() {
    var n = Gc(!1), r = n[0];
    return n = xs.bind(null, n[1]), wr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = zt, c = wr();
    if (pn) {
      if (l === void 0) throw Error(x(407));
      l = l();
    } else {
      if (l = r(), Kn === null) throw Error(x(349));
      (Xt & 30) !== 0 || Ic(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Kc($c.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, ku(9, Yc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = wr(), r = Kn.identifierPrefix;
    if (pn) {
      var l = _i, o = ki;
      l = (o & ~(1 << 32 - Lr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Tu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = G++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Ts = {
    readContext: Aa,
    useCallback: Zc,
    useContext: Aa,
    useEffect: Es,
    useImperativeHandle: Jc,
    useInsertionEffect: Xc,
    useLayoutEffect: Cs,
    useMemo: ef,
    useReducer: jl,
    useRef: qc,
    useState: function() {
      return jl(el);
    },
    useDebugValue: bs,
    useDeferredValue: function(n) {
      var r = _n();
      return Ud(r, Hn.memoizedState, n);
    },
    useTransition: function() {
      var n = jl(el)[0], r = _n().memoizedState;
      return [n, r];
    },
    useMutableSource: Vc,
    useSyncExternalStore: Bc,
    useId: zd,
    unstable_isNewReconciler: !1
  }, nf = { readContext: Aa, useCallback: Zc, useContext: Aa, useEffect: Es, useImperativeHandle: Jc, useInsertionEffect: Xc, useLayoutEffect: Cs, useMemo: ef, useReducer: wu, useRef: qc, useState: function() {
    return wu(el);
  }, useDebugValue: bs, useDeferredValue: function(n) {
    var r = _n();
    return Hn === null ? r.memoizedState = n : Ud(r, Hn.memoizedState, n);
  }, useTransition: function() {
    var n = wu(el)[0], r = _n().memoizedState;
    return [n, r];
  }, useMutableSource: Vc, useSyncExternalStore: Bc, useId: zd, unstable_isNewReconciler: !1 };
  function ui(n, r) {
    if (n && n.defaultProps) {
      r = fe({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Ad(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : fe({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var rf = { isMounted: function(n) {
    return (n = n._reactInternals) ? lt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Bn(), c = Ui(n), d = Zi(o, c);
    d.payload = r, l != null && (d.callback = l), r = zl(n, d, c), r !== null && (Hr(r, n, c, o), jc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Bn(), c = Ui(n), d = Zi(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = zl(n, d, c), r !== null && (Hr(r, n, c, o), jc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Bn(), o = Ui(n), c = Zi(l, o);
    c.tag = 2, r != null && (c.callback = r), r = zl(n, c, o), r !== null && (Hr(r, n, o, l), jc(r, n, o));
  } };
  function Wv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !as(l, o) || !as(c, d) : !0;
  }
  function af(n, r, l) {
    var o = !1, c = Tr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Aa(d) : (c = An(r) ? Xr : bn.current, o = r.contextTypes, d = (o = o != null) ? Jr(n, c) : Tr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = rf, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Gv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && rf.enqueueReplaceState(r, r.state, null);
  }
  function ws(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, Nd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Aa(d) : (d = An(r) ? Xr : bn.current, c.context = Jr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Ad(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && rf.enqueueReplaceState(c, c.state, null), vs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function Nu(n, r) {
    try {
      var l = "", o = r;
      do
        l += ht(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function jd(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Hd(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var lf = typeof WeakMap == "function" ? WeakMap : Map;
  function qv(n, r, l) {
    l = Zi(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      _o || (_o = !0, Uu = o), Hd(n, r);
    }, l;
  }
  function Fd(n, r, l) {
    l = Zi(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Hd(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Hd(n, r), typeof o != "function" && (Pl === null ? Pl = /* @__PURE__ */ new Set([this]) : Pl.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Pd(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new lf();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = Ty.bind(null, n, r, l), r.then(n, n));
  }
  function Kv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Hl(n, r, l, o, c) {
    return (n.mode & 1) === 0 ? (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Zi(-1, 1), r.tag = 2, zl(l, r, 1))), l.lanes |= 1), n) : (n.flags |= 65536, n.lanes = c, n);
  }
  var ks = ue.ReactCurrentOwner, Fn = !1;
  function fr(n, r, l, o) {
    r.child = n === null ? ve(r, null, l, o) : kn(r, n.child, l, o);
  }
  function ra(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return Sn(r, c), o = Al(n, r, l, o, d, c), l = li(), n !== null && !Fn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ha(n, r, c)) : (pn && l && Mc(r), r.flags |= 1, fr(n, r, o, c), r.child);
  }
  function Lu(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !ep(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, ot(n, r, d, o, c)) : (n = Is(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, (n.lanes & c) === 0) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : as, l(m, o) && n.ref === r.ref) return Ha(n, r, c);
    }
    return r.flags |= 1, n = Bl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function ot(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (as(d, o) && n.ref === r.ref) if (Fn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) (n.flags & 131072) !== 0 && (Fn = !0);
      else return r.lanes = n.lanes, Ha(n, r, c);
    }
    return Xv(n, r, l, o, c);
  }
  function _s(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if ((r.mode & 1) === 0) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ae(To, Ea), Ea |= l;
    else {
      if ((l & 1073741824) === 0) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Ae(To, Ea), Ea |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, Ae(To, Ea), Ea |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, Ae(To, Ea), Ea |= o;
    return fr(n, r, c, l), r.child;
  }
  function Vd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Xv(n, r, l, o, c) {
    var d = An(l) ? Xr : bn.current;
    return d = Jr(r, d), Sn(r, c), l = Al(n, r, l, o, d, c), o = li(), n !== null && !Fn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ha(n, r, c)) : (pn && o && Mc(r), r.flags |= 1, fr(n, r, l, c), r.child);
  }
  function Jv(n, r, l, o, c) {
    if (An(l)) {
      var d = !0;
      er(r);
    } else d = !1;
    if (Sn(r, c), r.stateNode === null) ja(n, r), af(r, l, o), ws(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, C = r.memoizedProps;
      m.props = C;
      var T = m.context, j = l.contextType;
      typeof j == "object" && j !== null ? j = Aa(j) : (j = An(l) ? Xr : bn.current, j = Jr(r, j));
      var K = l.getDerivedStateFromProps, Z = typeof K == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      Z || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (C !== o || T !== j) && Gv(r, m, o, j), Sa = !1;
      var q = r.memoizedState;
      m.state = q, vs(r, o, m, c), T = r.memoizedState, C !== o || q !== T || Gn.current || Sa ? (typeof K == "function" && (Ad(r, l, K, o), T = r.memoizedState), (C = Sa || Wv(r, l, C, o, q, T, j)) ? (Z || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = j, o = C) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Iv(n, r), C = r.memoizedProps, j = r.type === r.elementType ? C : ui(r.type, C), m.props = j, Z = r.pendingProps, q = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = Aa(T) : (T = An(l) ? Xr : bn.current, T = Jr(r, T));
      var Se = l.getDerivedStateFromProps;
      (K = typeof Se == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (C !== Z || q !== T) && Gv(r, m, o, T), Sa = !1, q = r.memoizedState, m.state = q, vs(r, o, m, c);
      var we = r.memoizedState;
      C !== Z || q !== we || Gn.current || Sa ? (typeof Se == "function" && (Ad(r, l, Se, o), we = r.memoizedState), (j = Sa || Wv(r, l, j, o, q, we, T) || !1) ? (K || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, we, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, we, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || C === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || C === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = we), m.props = o, m.state = we, m.context = T, o = j) : (typeof m.componentDidUpdate != "function" || C === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || C === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return Ds(n, r, l, o, d, c);
  }
  function Ds(n, r, l, o, c, d) {
    Vd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && Nc(r, l, !1), Ha(n, r, d);
    o = r.stateNode, ks.current = r;
    var C = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = kn(r, n.child, null, d), r.child = kn(r, null, C, d)) : fr(n, r, C, d), r.memoizedState = o.state, c && Nc(r, l, !0), r.child;
  }
  function xo(n) {
    var r = n.stateNode;
    r.pendingContext ? Fv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Fv(n, r.context, !1), Md(n, r.containerInfo);
  }
  function Zv(n, r, l, o, c) {
    return Ul(), Ji(c), r.flags |= 256, fr(n, r, l, o), r.child;
  }
  var uf = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Bd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function of(n, r, l) {
    var o = r.pendingProps, c = En.current, d = !1, m = (r.flags & 128) !== 0, C;
    if ((C = m) || (C = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), C ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Ae(En, c & 1), n === null)
      return Rd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? ((r.mode & 1) === 0 ? r.lanes = 1 : n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, (o & 1) === 0 && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Il(m, o, 0, null), n = al(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Bd(l), r.memoizedState = uf, n) : Id(r, m));
    if (c = n.memoizedState, c !== null && (C = c.dehydrated, C !== null)) return eh(n, r, m, o, C, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, C = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return (m & 1) === 0 && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Bl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), C !== null ? d = Bl(C, d) : (d = al(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Bd(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = uf, o;
    }
    return d = n.child, n = d.sibling, o = Bl(d, { mode: "visible", children: o.children }), (r.mode & 1) === 0 && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Id(n, r) {
    return r = Il({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function Os(n, r, l, o) {
    return o !== null && Ji(o), kn(r, n.child, null, l), n = Id(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function eh(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = jd(Error(x(422))), Os(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Il({ mode: "visible", children: o.children }, c, 0, null), d = al(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, (r.mode & 1) !== 0 && kn(r, n.child, null, m), r.child.memoizedState = Bd(m), r.memoizedState = uf, d);
    if ((r.mode & 1) === 0) return Os(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var C = o.dgst;
      return o = C, d = Error(x(419)), o = jd(d, o, void 0), Os(n, r, m, o);
    }
    if (C = (m & n.childLanes) !== 0, Fn || C) {
      if (o = Kn, o !== null) {
        switch (m & -m) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = (c & (o.suspendedLanes | m)) !== 0 ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ga(n, c), Hr(o, n, c, -1));
      }
      return Zd(), o = jd(Error(x(421))), Os(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = wy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, ea = xi(c.nextSibling), Zr = r, pn = !0, za = null, n !== null && (jn[Ua++] = ki, jn[Ua++] = _i, jn[Ua++] = ma, ki = n.id, _i = n.overflow, ma = r), r = Id(r, o.children), r.flags |= 4096, r);
  }
  function Yd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), _d(n.return, r, l);
  }
  function zr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function Oi(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (fr(n, r, o.children, l), o = En.current, (o & 2) !== 0) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && (n.flags & 128) !== 0) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Yd(n, l, r);
        else if (n.tag === 19) Yd(n, l, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      o &= 1;
    }
    if (Ae(En, o), (r.mode & 1) === 0) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Fc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), zr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Fc(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        zr(r, !0, l, null, d);
        break;
      case "together":
        zr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function ja(n, r) {
    (r.mode & 1) === 0 && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Ha(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Mi |= r.lanes, (l & r.childLanes) === 0) return null;
    if (n !== null && r.child !== n.child) throw Error(x(153));
    if (r.child !== null) {
      for (n = r.child, l = Bl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Bl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function Ns(n, r, l) {
    switch (r.tag) {
      case 3:
        xo(r), Ul();
        break;
      case 5:
        $v(r);
        break;
      case 1:
        An(r.type) && er(r);
        break;
      case 4:
        Md(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Ae(ya, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Ae(En, En.current & 1), r.flags |= 128, null) : (l & r.child.childLanes) !== 0 ? of(n, r, l) : (Ae(En, En.current & 1), n = Ha(n, r, l), n !== null ? n.sibling : null);
        Ae(En, En.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, (n.flags & 128) !== 0) {
          if (o) return Oi(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Ae(En, En.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, _s(n, r, l);
    }
    return Ha(n, r, l);
  }
  var Fa, Pn, th, nh;
  Fa = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6) n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r) return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, Pn = function() {
  }, th = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, xu(Di.current);
      var d = null;
      switch (l) {
        case "input":
          c = lr(n, c), o = lr(n, o), d = [];
          break;
        case "select":
          c = fe({}, c, { value: void 0 }), o = fe({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Qn(n, c), o = Qn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = _l);
      }
      sn(l, o);
      var m;
      l = null;
      for (j in c) if (!o.hasOwnProperty(j) && c.hasOwnProperty(j) && c[j] != null) if (j === "style") {
        var C = c[j];
        for (m in C) C.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else j !== "dangerouslySetInnerHTML" && j !== "children" && j !== "suppressContentEditableWarning" && j !== "suppressHydrationWarning" && j !== "autoFocus" && (te.hasOwnProperty(j) ? d || (d = []) : (d = d || []).push(j, null));
      for (j in o) {
        var T = o[j];
        if (C = c != null ? c[j] : void 0, o.hasOwnProperty(j) && T !== C && (T != null || C != null)) if (j === "style") if (C) {
          for (m in C) !C.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && C[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          j,
          l
        )), l = T;
        else j === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, C = C ? C.__html : void 0, T != null && C !== T && (d = d || []).push(j, T)) : j === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(j, "" + T) : j !== "suppressContentEditableWarning" && j !== "suppressHydrationWarning" && (te.hasOwnProperty(j) ? (T != null && j === "onScroll" && Bt("scroll", n), d || C === T || (d = [])) : (d = d || []).push(j, T));
      }
      l && (d = d || []).push("style", l);
      var j = d;
      (r.updateQueue = j) && (r.flags |= 4);
    }
  }, nh = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function Ls(n, r) {
    if (!pn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var o = null; l !== null; ) l.alternate !== null && (o = l), l = l.sibling;
        o === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : o.sibling = null;
    }
  }
  function nr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function rh(n, r, l) {
    var o = r.pendingProps;
    switch (Uc(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return nr(r), null;
      case 1:
        return An(r.type) && go(), nr(r), null;
      case 3:
        return o = r.stateNode, Ru(), un(Gn), un(bn), Pe(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (zc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && (r.flags & 256) === 0 || (r.flags |= 1024, za !== null && (zu(za), za = null))), Pn(n, r), nr(r), null;
      case 5:
        Hc(r);
        var c = xu(ys.current);
        if (l = r.type, n !== null && r.stateNode != null) th(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(x(166));
            return nr(r), null;
          }
          if (n = xu(Di.current), zc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ri] = r, o[cs] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Bt("cancel", o), Bt("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Bt("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < us.length; c++) Bt(us[c], o);
                break;
              case "source":
                Bt("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Bt(
                  "error",
                  o
                ), Bt("load", o);
                break;
              case "details":
                Bt("toggle", o);
                break;
              case "input":
                Yn(o, d), Bt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Bt("invalid", o);
                break;
              case "textarea":
                br(o, d), Bt("invalid", o);
            }
            sn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var C = d[m];
              m === "children" ? typeof C == "string" ? o.textContent !== C && (d.suppressHydrationWarning !== !0 && kc(o.textContent, C, n), c = ["children", C]) : typeof C == "number" && o.textContent !== "" + C && (d.suppressHydrationWarning !== !0 && kc(
                o.textContent,
                C,
                n
              ), c = ["children", "" + C]) : te.hasOwnProperty(m) && C != null && m === "onScroll" && Bt("scroll", o);
            }
            switch (l) {
              case "input":
                Mn(o), pi(o, d, !0);
                break;
              case "textarea":
                Mn(o), Un(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = _l);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = xr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ri] = r, n[cs] = o, Fa(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Zn(l, o), l) {
                case "dialog":
                  Bt("cancel", n), Bt("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Bt("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < us.length; c++) Bt(us[c], n);
                  c = o;
                  break;
                case "source":
                  Bt("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Bt(
                    "error",
                    n
                  ), Bt("load", n), c = o;
                  break;
                case "details":
                  Bt("toggle", n), c = o;
                  break;
                case "input":
                  Yn(n, o), c = lr(n, o), Bt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = fe({}, o, { value: void 0 }), Bt("invalid", n);
                  break;
                case "textarea":
                  br(n, o), c = Qn(n, o), Bt("invalid", n);
                  break;
                default:
                  c = o;
              }
              sn(l, c), C = c;
              for (d in C) if (C.hasOwnProperty(d)) {
                var T = C[d];
                d === "style" ? nn(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && vi(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && oe(n, T) : typeof T == "number" && oe(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (te.hasOwnProperty(d) ? T != null && d === "onScroll" && Bt("scroll", n) : T != null && je(n, d, T, m));
              }
              switch (l) {
                case "input":
                  Mn(n), pi(n, o, !1);
                  break;
                case "textarea":
                  Mn(n), Un(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + dt(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? Tn(n, !!o.multiple, d, !1) : o.defaultValue != null && Tn(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = _l);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return nr(r), null;
      case 6:
        if (n && r.stateNode != null) nh(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(x(166));
          if (l = xu(ys.current), xu(Di.current), zc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ri] = r, (d = o.nodeValue !== l) && (n = Zr, n !== null)) switch (n.tag) {
              case 3:
                kc(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && kc(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ri] = r, r.stateNode = o;
        }
        return nr(r), null;
      case 13:
        if (un(En), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (pn && ea !== null && (r.mode & 1) !== 0 && (r.flags & 128) === 0) ps(), Ul(), r.flags |= 98560, d = !1;
          else if (d = zc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(x(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(x(317));
              d[Ri] = r;
            } else Ul(), (r.flags & 128) === 0 && (r.memoizedState = null), r.flags |= 4;
            nr(r), d = !1;
          } else za !== null && (zu(za), za = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return (r.flags & 128) !== 0 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, (r.mode & 1) !== 0 && (n === null || (En.current & 1) !== 0 ? On === 0 && (On = 3) : Zd())), r.updateQueue !== null && (r.flags |= 4), nr(r), null);
      case 4:
        return Ru(), Pn(n, r), n === null && po(r.stateNode.containerInfo), nr(r), null;
      case 10:
        return kd(r.type._context), nr(r), null;
      case 17:
        return An(r.type) && go(), nr(r), null;
      case 19:
        if (un(En), d = r.memoizedState, d === null) return nr(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) Ls(d, !1);
        else {
          if (On !== 0 || n !== null && (n.flags & 128) !== 0) for (n = r.child; n !== null; ) {
            if (m = Fc(n), m !== null) {
              for (r.flags |= 128, Ls(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return Ae(En, En.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && ut() > ko && (r.flags |= 128, o = !0, Ls(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Fc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ls(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !pn) return nr(r), null;
          } else 2 * ut() - d.renderingStartTime > ko && l !== 1073741824 && (r.flags |= 128, o = !0, Ls(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = ut(), r.sibling = null, l = En.current, Ae(En, o ? l & 1 | 2 : l & 1), r) : (nr(r), null);
      case 22:
      case 23:
        return Jd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && (r.mode & 1) !== 0 ? (Ea & 1073741824) !== 0 && (nr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : nr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(x(156, r.tag));
  }
  function sf(n, r) {
    switch (Uc(r), r.tag) {
      case 1:
        return An(r.type) && go(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Ru(), un(Gn), un(bn), Pe(), n = r.flags, (n & 65536) !== 0 && (n & 128) === 0 ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Hc(r), null;
      case 13:
        if (un(En), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(x(340));
          Ul();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return un(En), null;
      case 4:
        return Ru(), null;
      case 10:
        return kd(r.type._context), null;
      case 22:
      case 23:
        return Jd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ms = !1, kr = !1, Sy = typeof WeakSet == "function" ? WeakSet : Set, be = null;
  function Ro(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      vn(n, r, o);
    }
    else l.current = null;
  }
  function cf(n, r, l) {
    try {
      l();
    } catch (o) {
      vn(n, r, o);
    }
  }
  var ah = !1;
  function ih(n, r) {
    if (ss = Oa, n = is(), Sc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var o = l.getSelection && l.getSelection();
        if (o && o.rangeCount !== 0) {
          l = o.anchorNode;
          var c = o.anchorOffset, d = o.focusNode;
          o = o.focusOffset;
          try {
            l.nodeType, d.nodeType;
          } catch {
            l = null;
            break e;
          }
          var m = 0, C = -1, T = -1, j = 0, K = 0, Z = n, q = null;
          t: for (; ; ) {
            for (var Se; Z !== l || c !== 0 && Z.nodeType !== 3 || (C = m + c), Z !== d || o !== 0 && Z.nodeType !== 3 || (T = m + o), Z.nodeType === 3 && (m += Z.nodeValue.length), (Se = Z.firstChild) !== null; )
              q = Z, Z = Se;
            for (; ; ) {
              if (Z === n) break t;
              if (q === l && ++j === c && (C = m), q === d && ++K === o && (T = m), (Se = Z.nextSibling) !== null) break;
              Z = q, q = Z.parentNode;
            }
            Z = Se;
          }
          l = C === -1 || T === -1 ? null : { start: C, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (yu = { focusedElem: n, selectionRange: l }, Oa = !1, be = r; be !== null; ) if (r = be, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, be = n;
    else for (; be !== null; ) {
      r = be;
      try {
        var we = r.alternate;
        if ((r.flags & 1024) !== 0) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (we !== null) {
              var De = we.memoizedProps, Nn = we.memoizedState, O = r.stateNode, k = O.getSnapshotBeforeUpdate(r.elementType === r.type ? De : ui(r.type, De), Nn);
              O.__reactInternalSnapshotBeforeUpdate = k;
            }
            break;
          case 3:
            var U = r.stateNode.containerInfo;
            U.nodeType === 1 ? U.textContent = "" : U.nodeType === 9 && U.documentElement && U.removeChild(U.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(x(163));
        }
      } catch (X) {
        vn(r, r.return, X);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, be = n;
        break;
      }
      be = r.return;
    }
    return we = ah, ah = !1, we;
  }
  function Us(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && cf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function zs(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var o = l.create;
          l.destroy = o();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function $d(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function ff(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, ff(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ri], delete r[cs], delete r[fs], delete r[yo], delete r[yy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function As(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function tl(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || As(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Ni(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = _l));
    else if (o !== 4 && (n = n.child, n !== null)) for (Ni(n, r, l), n = n.sibling; n !== null; ) Ni(n, r, l), n = n.sibling;
  }
  function Li(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Li(n, r, l), n = n.sibling; n !== null; ) Li(n, r, l), n = n.sibling;
  }
  var Dn = null, Ar = !1;
  function jr(n, r, l) {
    for (l = l.child; l !== null; ) lh(n, r, l), l = l.sibling;
  }
  function lh(n, r, l) {
    if (qr && typeof qr.onCommitFiberUnmount == "function") try {
      qr.onCommitFiberUnmount(Sl, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        kr || Ro(l, r);
      case 6:
        var o = Dn, c = Ar;
        Dn = null, jr(n, r, l), Dn = o, Ar = c, Dn !== null && (Ar ? (n = Dn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : Dn.removeChild(l.stateNode));
        break;
      case 18:
        Dn !== null && (Ar ? (n = Dn, l = l.stateNode, n.nodeType === 8 ? mo(n.parentNode, l) : n.nodeType === 1 && mo(n, l), ni(n)) : mo(Dn, l.stateNode));
        break;
      case 4:
        o = Dn, c = Ar, Dn = l.stateNode.containerInfo, Ar = !0, jr(n, r, l), Dn = o, Ar = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!kr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && cf(l, r, m), c = c.next;
          } while (c !== o);
        }
        jr(n, r, l);
        break;
      case 1:
        if (!kr && (Ro(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (C) {
          vn(l, r, C);
        }
        jr(n, r, l);
        break;
      case 21:
        jr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (kr = (o = kr) || l.memoizedState !== null, jr(n, r, l), kr = o) : jr(n, r, l);
        break;
      default:
        jr(n, r, l);
    }
  }
  function uh(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new Sy()), r.forEach(function(o) {
        var c = mh.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function oi(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, C = m;
        e: for (; C !== null; ) {
          switch (C.tag) {
            case 5:
              Dn = C.stateNode, Ar = !1;
              break e;
            case 3:
              Dn = C.stateNode.containerInfo, Ar = !0;
              break e;
            case 4:
              Dn = C.stateNode.containerInfo, Ar = !0;
              break e;
          }
          C = C.return;
        }
        if (Dn === null) throw Error(x(160));
        lh(d, m, c), Dn = null, Ar = !1;
        var T = c.alternate;
        T !== null && (T.return = null), c.return = null;
      } catch (j) {
        vn(c, r, j);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Qd(r, n), r = r.sibling;
  }
  function Qd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (oi(r, n), aa(n), o & 4) {
          try {
            Us(3, n, n.return), zs(3, n);
          } catch (De) {
            vn(n, n.return, De);
          }
          try {
            Us(5, n, n.return);
          } catch (De) {
            vn(n, n.return, De);
          }
        }
        break;
      case 1:
        oi(r, n), aa(n), o & 512 && l !== null && Ro(l, l.return);
        break;
      case 5:
        if (oi(r, n), aa(n), o & 512 && l !== null && Ro(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            oe(c, "");
          } catch (De) {
            vn(n, n.return, De);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, C = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            C === "input" && d.type === "radio" && d.name != null && $n(c, d), Zn(C, m);
            var j = Zn(C, d);
            for (m = 0; m < T.length; m += 2) {
              var K = T[m], Z = T[m + 1];
              K === "style" ? nn(c, Z) : K === "dangerouslySetInnerHTML" ? vi(c, Z) : K === "children" ? oe(c, Z) : je(c, K, Z, j);
            }
            switch (C) {
              case "input":
                Gr(c, d);
                break;
              case "textarea":
                Ga(c, d);
                break;
              case "select":
                var q = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var Se = d.value;
                Se != null ? Tn(c, !!d.multiple, Se, !1) : q !== !!d.multiple && (d.defaultValue != null ? Tn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Tn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[cs] = d;
          } catch (De) {
            vn(n, n.return, De);
          }
        }
        break;
      case 6:
        if (oi(r, n), aa(n), o & 4) {
          if (n.stateNode === null) throw Error(x(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (De) {
            vn(n, n.return, De);
          }
        }
        break;
      case 3:
        if (oi(r, n), aa(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          ni(r.containerInfo);
        } catch (De) {
          vn(n, n.return, De);
        }
        break;
      case 4:
        oi(r, n), aa(n);
        break;
      case 13:
        oi(r, n), aa(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (qd = ut())), o & 4 && uh(n);
        break;
      case 22:
        if (K = l !== null && l.memoizedState !== null, n.mode & 1 ? (kr = (j = kr) || K, oi(r, n), kr = j) : oi(r, n), aa(n), o & 8192) {
          if (j = n.memoizedState !== null, (n.stateNode.isHidden = j) && !K && (n.mode & 1) !== 0) for (be = n, K = n.child; K !== null; ) {
            for (Z = be = K; be !== null; ) {
              switch (q = be, Se = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Us(4, q, q.return);
                  break;
                case 1:
                  Ro(q, q.return);
                  var we = q.stateNode;
                  if (typeof we.componentWillUnmount == "function") {
                    o = q, l = q.return;
                    try {
                      r = o, we.props = r.memoizedProps, we.state = r.memoizedState, we.componentWillUnmount();
                    } catch (De) {
                      vn(o, l, De);
                    }
                  }
                  break;
                case 5:
                  Ro(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    js(Z);
                    continue;
                  }
              }
              Se !== null ? (Se.return = q, be = Se) : js(Z);
            }
            K = K.sibling;
          }
          e: for (K = null, Z = n; ; ) {
            if (Z.tag === 5) {
              if (K === null) {
                K = Z;
                try {
                  c = Z.stateNode, j ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (C = Z.stateNode, T = Z.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, C.style.display = Pt("display", m));
                } catch (De) {
                  vn(n, n.return, De);
                }
              }
            } else if (Z.tag === 6) {
              if (K === null) try {
                Z.stateNode.nodeValue = j ? "" : Z.memoizedProps;
              } catch (De) {
                vn(n, n.return, De);
              }
            } else if ((Z.tag !== 22 && Z.tag !== 23 || Z.memoizedState === null || Z === n) && Z.child !== null) {
              Z.child.return = Z, Z = Z.child;
              continue;
            }
            if (Z === n) break e;
            for (; Z.sibling === null; ) {
              if (Z.return === null || Z.return === n) break e;
              K === Z && (K = null), Z = Z.return;
            }
            K === Z && (K = null), Z.sibling.return = Z.return, Z = Z.sibling;
          }
        }
        break;
      case 19:
        oi(r, n), aa(n), o & 4 && uh(n);
        break;
      case 21:
        break;
      default:
        oi(
          r,
          n
        ), aa(n);
    }
  }
  function aa(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (As(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(x(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (oe(c, ""), o.flags &= -33);
            var d = tl(n);
            Li(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, C = tl(n);
            Ni(n, C, m);
            break;
          default:
            throw Error(x(161));
        }
      } catch (T) {
        vn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function Ey(n, r, l) {
    be = n, Wd(n);
  }
  function Wd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; be !== null; ) {
      var c = be, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Ms;
        if (!m) {
          var C = c.alternate, T = C !== null && C.memoizedState !== null || kr;
          C = Ms;
          var j = kr;
          if (Ms = m, (kr = T) && !j) for (be = c; be !== null; ) m = be, T = m.child, m.tag === 22 && m.memoizedState !== null ? Gd(c) : T !== null ? (T.return = m, be = T) : Gd(c);
          for (; d !== null; ) be = d, Wd(d), d = d.sibling;
          be = c, Ms = C, kr = j;
        }
        oh(n);
      } else (c.subtreeFlags & 8772) !== 0 && d !== null ? (d.return = c, be = d) : oh(n);
    }
  }
  function oh(n) {
    for (; be !== null; ) {
      var r = be;
      if ((r.flags & 8772) !== 0) {
        var l = r.alternate;
        try {
          if ((r.flags & 8772) !== 0) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              kr || zs(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !kr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ui(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && Ld(r, d, o);
              break;
            case 3:
              var m = r.updateQueue;
              if (m !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                Ld(r, m, l);
              }
              break;
            case 5:
              var C = r.stateNode;
              if (l === null && r.flags & 4) {
                l = C;
                var T = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    T.autoFocus && l.focus();
                    break;
                  case "img":
                    T.src && (l.src = T.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var j = r.alternate;
                if (j !== null) {
                  var K = j.memoizedState;
                  if (K !== null) {
                    var Z = K.dehydrated;
                    Z !== null && ni(Z);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(x(163));
          }
          kr || r.flags & 512 && $d(r);
        } catch (q) {
          vn(r, r.return, q);
        }
      }
      if (r === n) {
        be = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, be = l;
        break;
      }
      be = r.return;
    }
  }
  function js(n) {
    for (; be !== null; ) {
      var r = be;
      if (r === n) {
        be = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, be = l;
        break;
      }
      be = r.return;
    }
  }
  function Gd(n) {
    for (; be !== null; ) {
      var r = be;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              zs(4, r);
            } catch (T) {
              vn(r, l, T);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (T) {
                vn(r, c, T);
              }
            }
            var d = r.return;
            try {
              $d(r);
            } catch (T) {
              vn(r, d, T);
            }
            break;
          case 5:
            var m = r.return;
            try {
              $d(r);
            } catch (T) {
              vn(r, m, T);
            }
        }
      } catch (T) {
        vn(r, r.return, T);
      }
      if (r === n) {
        be = null;
        break;
      }
      var C = r.sibling;
      if (C !== null) {
        C.return = r.return, be = C;
        break;
      }
      be = r.return;
    }
  }
  var Cy = Math.ceil, Fl = ue.ReactCurrentDispatcher, Mu = ue.ReactCurrentOwner, dr = ue.ReactCurrentBatchConfig, Rt = 0, Kn = null, Vn = null, pr = 0, Ea = 0, To = Ma(0), On = 0, Hs = null, Mi = 0, wo = 0, df = 0, Fs = null, ia = null, qd = 0, ko = 1 / 0, Ca = null, _o = !1, Uu = null, Pl = null, pf = !1, nl = null, Ps = 0, Vl = 0, Do = null, Vs = -1, _r = 0;
  function Bn() {
    return (Rt & 6) !== 0 ? ut() : Vs !== -1 ? Vs : Vs = ut();
  }
  function Ui(n) {
    return (n.mode & 1) === 0 ? 1 : (Rt & 2) !== 0 && pr !== 0 ? pr & -pr : gy.transition !== null ? (_r === 0 && (_r = eo()), _r) : (n = Mt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : uo(n.type)), n);
  }
  function Hr(n, r, l, o) {
    if (50 < Vl) throw Vl = 0, Do = null, Error(x(185));
    Ii(n, l, o), ((Rt & 2) === 0 || n !== Kn) && (n === Kn && ((Rt & 2) === 0 && (wo |= l), On === 4 && si(n, pr)), la(n, o), l === 1 && Rt === 0 && (r.mode & 1) === 0 && (ko = ut() + 500, So && wi()));
  }
  function la(n, r) {
    var l = n.callbackNode;
    ou(n, r);
    var o = ti(n, n === Kn ? pr : 0);
    if (o === 0) l !== null && or(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && or(l), r === 1) n.tag === 0 ? Ol(Kd.bind(null, n)) : Lc(Kd.bind(null, n)), ho(function() {
        (Rt & 6) === 0 && wi();
      }), l = null;
      else {
        switch (no(o)) {
          case 1:
            l = Za;
            break;
          case 4:
            l = lu;
            break;
          case 16:
            l = uu;
            break;
          case 536870912:
            l = Xu;
            break;
          default:
            l = uu;
        }
        l = gh(l, vf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function vf(n, r) {
    if (Vs = -1, _r = 0, (Rt & 6) !== 0) throw Error(x(327));
    var l = n.callbackNode;
    if (Oo() && n.callbackNode !== l) return null;
    var o = ti(n, n === Kn ? pr : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & n.expiredLanes) !== 0 || r) r = hf(n, o);
    else {
      r = o;
      var c = Rt;
      Rt |= 2;
      var d = ch();
      (Kn !== n || pr !== r) && (Ca = null, ko = ut() + 500, rl(n, r));
      do
        try {
          fh();
          break;
        } catch (C) {
          sh(n, C);
        }
      while (!0);
      wd(), Fl.current = d, Rt = c, Vn !== null ? r = 0 : (Kn = null, pr = 0, r = On);
    }
    if (r !== 0) {
      if (r === 2 && (c = Cl(n), c !== 0 && (o = c, r = Bs(n, c))), r === 1) throw l = Hs, rl(n, 0), si(n, o), la(n, ut()), l;
      if (r === 6) si(n, o);
      else {
        if (c = n.current.alternate, (o & 30) === 0 && !by(c) && (r = hf(n, o), r === 2 && (d = Cl(n), d !== 0 && (o = d, r = Bs(n, d))), r === 1)) throw l = Hs, rl(n, 0), si(n, o), la(n, ut()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(x(345));
          case 2:
            ju(n, ia, Ca);
            break;
          case 3:
            if (si(n, o), (o & 130023424) === o && (r = qd + 500 - ut(), 10 < r)) {
              if (ti(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Bn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Dc(ju.bind(null, n, ia, Ca), r);
              break;
            }
            ju(n, ia, Ca);
            break;
          case 4:
            if (si(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - Lr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = ut() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * Cy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Dc(ju.bind(null, n, ia, Ca), o);
              break;
            }
            ju(n, ia, Ca);
            break;
          case 5:
            ju(n, ia, Ca);
            break;
          default:
            throw Error(x(329));
        }
      }
    }
    return la(n, ut()), n.callbackNode === l ? vf.bind(null, n) : null;
  }
  function Bs(n, r) {
    var l = Fs;
    return n.current.memoizedState.isDehydrated && (rl(n, r).flags |= 256), n = hf(n, r), n !== 2 && (r = ia, ia = l, r !== null && zu(r)), n;
  }
  function zu(n) {
    ia === null ? ia = n : ia.push.apply(ia, n);
  }
  function by(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var o = 0; o < l.length; o++) {
          var c = l[o], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ai(d(), c)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null) l.return = r, r = l;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function si(n, r) {
    for (r &= ~df, r &= ~wo, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Lr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Kd(n) {
    if ((Rt & 6) !== 0) throw Error(x(327));
    Oo();
    var r = ti(n, 0);
    if ((r & 1) === 0) return la(n, ut()), null;
    var l = hf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = Cl(n);
      o !== 0 && (r = o, l = Bs(n, o));
    }
    if (l === 1) throw l = Hs, rl(n, 0), si(n, r), la(n, ut()), l;
    if (l === 6) throw Error(x(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, ju(n, ia, Ca), la(n, ut()), null;
  }
  function Xd(n, r) {
    var l = Rt;
    Rt |= 1;
    try {
      return n(r);
    } finally {
      Rt = l, Rt === 0 && (ko = ut() + 500, So && wi());
    }
  }
  function Au(n) {
    nl !== null && nl.tag === 0 && (Rt & 6) === 0 && Oo();
    var r = Rt;
    Rt |= 1;
    var l = dr.transition, o = Mt;
    try {
      if (dr.transition = null, Mt = 1, n) return n();
    } finally {
      Mt = o, dr.transition = l, Rt = r, (Rt & 6) === 0 && wi();
    }
  }
  function Jd() {
    Ea = To.current, un(To);
  }
  function rl(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, Cd(l)), Vn !== null) for (l = Vn.return; l !== null; ) {
      var o = l;
      switch (Uc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && go();
          break;
        case 3:
          Ru(), un(Gn), un(bn), Pe();
          break;
        case 5:
          Hc(o);
          break;
        case 4:
          Ru();
          break;
        case 13:
          un(En);
          break;
        case 19:
          un(En);
          break;
        case 10:
          kd(o.type._context);
          break;
        case 22:
        case 23:
          Jd();
      }
      l = l.return;
    }
    if (Kn = n, Vn = n = Bl(n.current, null), pr = Ea = r, On = 0, Hs = null, df = wo = Mi = 0, ia = Fs = null, bu !== null) {
      for (r = 0; r < bu.length; r++) if (l = bu[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var m = d.next;
          d.next = c, o.next = m;
        }
        l.pending = o;
      }
      bu = null;
    }
    return n;
  }
  function sh(n, r) {
    do {
      var l = Vn;
      try {
        if (wd(), gt.current = Ou, Pc) {
          for (var o = zt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Pc = !1;
        }
        if (Xt = 0, tr = Hn = zt = null, Ss = !1, Tu = 0, Mu.current = null, l === null || l.return === null) {
          On = 1, Hs = r, Vn = null;
          break;
        }
        e: {
          var d = n, m = l.return, C = l, T = r;
          if (r = pr, C.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var j = T, K = C, Z = K.tag;
            if ((K.mode & 1) === 0 && (Z === 0 || Z === 11 || Z === 15)) {
              var q = K.alternate;
              q ? (K.updateQueue = q.updateQueue, K.memoizedState = q.memoizedState, K.lanes = q.lanes) : (K.updateQueue = null, K.memoizedState = null);
            }
            var Se = Kv(m);
            if (Se !== null) {
              Se.flags &= -257, Hl(Se, m, C, d, r), Se.mode & 1 && Pd(d, j, r), r = Se, T = j;
              var we = r.updateQueue;
              if (we === null) {
                var De = /* @__PURE__ */ new Set();
                De.add(T), r.updateQueue = De;
              } else we.add(T);
              break e;
            } else {
              if ((r & 1) === 0) {
                Pd(d, j, r), Zd();
                break e;
              }
              T = Error(x(426));
            }
          } else if (pn && C.mode & 1) {
            var Nn = Kv(m);
            if (Nn !== null) {
              (Nn.flags & 65536) === 0 && (Nn.flags |= 256), Hl(Nn, m, C, d, r), Ji(Nu(T, C));
              break e;
            }
          }
          d = T = Nu(T, C), On !== 4 && (On = 2), Fs === null ? Fs = [d] : Fs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var O = qv(d, T, r);
                Yv(d, O);
                break e;
              case 1:
                C = T;
                var k = d.type, U = d.stateNode;
                if ((d.flags & 128) === 0 && (typeof k.getDerivedStateFromError == "function" || U !== null && typeof U.componentDidCatch == "function" && (Pl === null || !Pl.has(U)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var X = Fd(d, C, r);
                  Yv(d, X);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        ph(l);
      } catch (ke) {
        r = ke, Vn === l && l !== null && (Vn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ch() {
    var n = Fl.current;
    return Fl.current = Ou, n === null ? Ou : n;
  }
  function Zd() {
    (On === 0 || On === 3 || On === 2) && (On = 4), Kn === null || (Mi & 268435455) === 0 && (wo & 268435455) === 0 || si(Kn, pr);
  }
  function hf(n, r) {
    var l = Rt;
    Rt |= 2;
    var o = ch();
    (Kn !== n || pr !== r) && (Ca = null, rl(n, r));
    do
      try {
        xy();
        break;
      } catch (c) {
        sh(n, c);
      }
    while (!0);
    if (wd(), Rt = l, Fl.current = o, Vn !== null) throw Error(x(261));
    return Kn = null, pr = 0, On;
  }
  function xy() {
    for (; Vn !== null; ) dh(Vn);
  }
  function fh() {
    for (; Vn !== null && !Xa(); ) dh(Vn);
  }
  function dh(n) {
    var r = yh(n.alternate, n, Ea);
    n.memoizedProps = n.pendingProps, r === null ? ph(n) : Vn = r, Mu.current = null;
  }
  function ph(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, (r.flags & 32768) === 0) {
        if (l = rh(l, r, Ea), l !== null) {
          Vn = l;
          return;
        }
      } else {
        if (l = sf(l, r), l !== null) {
          l.flags &= 32767, Vn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          On = 6, Vn = null;
          return;
        }
      }
      if (r = r.sibling, r !== null) {
        Vn = r;
        return;
      }
      Vn = r = n;
    } while (r !== null);
    On === 0 && (On = 5);
  }
  function ju(n, r, l) {
    var o = Mt, c = dr.transition;
    try {
      dr.transition = null, Mt = 1, Ry(n, r, l, o);
    } finally {
      dr.transition = c, Mt = o;
    }
    return null;
  }
  function Ry(n, r, l, o) {
    do
      Oo();
    while (nl !== null);
    if ((Rt & 6) !== 0) throw Error(x(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(x(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (ed(n, d), n === Kn && (Vn = Kn = null, pr = 0), (l.subtreeFlags & 2064) === 0 && (l.flags & 2064) === 0 || pf || (pf = !0, gh(uu, function() {
      return Oo(), null;
    })), d = (l.flags & 15990) !== 0, (l.subtreeFlags & 15990) !== 0 || d) {
      d = dr.transition, dr.transition = null;
      var m = Mt;
      Mt = 1;
      var C = Rt;
      Rt |= 4, Mu.current = null, ih(n, l), Qd(l, n), co(yu), Oa = !!ss, yu = ss = null, n.current = l, Ey(l), Ja(), Rt = C, Mt = m, dr.transition = d;
    } else n.current = l;
    if (pf && (pf = !1, nl = n, Ps = c), d = n.pendingLanes, d === 0 && (Pl = null), qo(l.stateNode), la(n, ut()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (_o) throw _o = !1, n = Uu, Uu = null, n;
    return (Ps & 1) !== 0 && n.tag !== 0 && Oo(), d = n.pendingLanes, (d & 1) !== 0 ? n === Do ? Vl++ : (Vl = 0, Do = n) : Vl = 0, wi(), null;
  }
  function Oo() {
    if (nl !== null) {
      var n = no(Ps), r = dr.transition, l = Mt;
      try {
        if (dr.transition = null, Mt = 16 > n ? 16 : n, nl === null) var o = !1;
        else {
          if (n = nl, nl = null, Ps = 0, (Rt & 6) !== 0) throw Error(x(331));
          var c = Rt;
          for (Rt |= 4, be = n.current; be !== null; ) {
            var d = be, m = d.child;
            if ((be.flags & 16) !== 0) {
              var C = d.deletions;
              if (C !== null) {
                for (var T = 0; T < C.length; T++) {
                  var j = C[T];
                  for (be = j; be !== null; ) {
                    var K = be;
                    switch (K.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Us(8, K, d);
                    }
                    var Z = K.child;
                    if (Z !== null) Z.return = K, be = Z;
                    else for (; be !== null; ) {
                      K = be;
                      var q = K.sibling, Se = K.return;
                      if (ff(K), K === j) {
                        be = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = Se, be = q;
                        break;
                      }
                      be = Se;
                    }
                  }
                }
                var we = d.alternate;
                if (we !== null) {
                  var De = we.child;
                  if (De !== null) {
                    we.child = null;
                    do {
                      var Nn = De.sibling;
                      De.sibling = null, De = Nn;
                    } while (De !== null);
                  }
                }
                be = d;
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && m !== null) m.return = d, be = m;
            else e: for (; be !== null; ) {
              if (d = be, (d.flags & 2048) !== 0) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Us(9, d, d.return);
              }
              var O = d.sibling;
              if (O !== null) {
                O.return = d.return, be = O;
                break e;
              }
              be = d.return;
            }
          }
          var k = n.current;
          for (be = k; be !== null; ) {
            m = be;
            var U = m.child;
            if ((m.subtreeFlags & 2064) !== 0 && U !== null) U.return = m, be = U;
            else e: for (m = k; be !== null; ) {
              if (C = be, (C.flags & 2048) !== 0) try {
                switch (C.tag) {
                  case 0:
                  case 11:
                  case 15:
                    zs(9, C);
                }
              } catch (ke) {
                vn(C, C.return, ke);
              }
              if (C === m) {
                be = null;
                break e;
              }
              var X = C.sibling;
              if (X !== null) {
                X.return = C.return, be = X;
                break e;
              }
              be = C.return;
            }
          }
          if (Rt = c, wi(), qr && typeof qr.onPostCommitFiberRoot == "function") try {
            qr.onPostCommitFiberRoot(Sl, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Mt = l, dr.transition = r;
      }
    }
    return !1;
  }
  function vh(n, r, l) {
    r = Nu(l, r), r = qv(n, r, 1), n = zl(n, r, 1), r = Bn(), n !== null && (Ii(n, 1, r), la(n, r));
  }
  function vn(n, r, l) {
    if (n.tag === 3) vh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        vh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Pl === null || !Pl.has(o))) {
          n = Nu(l, n), n = Fd(r, n, 1), r = zl(r, n, 1), n = Bn(), r !== null && (Ii(r, 1, n), la(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Ty(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Bn(), n.pingedLanes |= n.suspendedLanes & l, Kn === n && (pr & l) === l && (On === 4 || On === 3 && (pr & 130023424) === pr && 500 > ut() - qd ? rl(n, 0) : df |= l), la(n, r);
  }
  function hh(n, r) {
    r === 0 && ((n.mode & 1) === 0 ? r = 1 : (r = ha, ha <<= 1, (ha & 130023424) === 0 && (ha = 4194304)));
    var l = Bn();
    n = ga(n, r), n !== null && (Ii(n, r, l), la(n, l));
  }
  function wy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), hh(n, l);
  }
  function mh(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var o = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        o = n.stateNode;
        break;
      default:
        throw Error(x(314));
    }
    o !== null && o.delete(r), hh(n, l);
  }
  var yh;
  yh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Gn.current) Fn = !0;
    else {
      if ((n.lanes & l) === 0 && (r.flags & 128) === 0) return Fn = !1, Ns(n, r, l);
      Fn = (n.flags & 131072) !== 0;
    }
    else Fn = !1, pn && (r.flags & 1048576) !== 0 && Pv(r, Xi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        ja(n, r), n = r.pendingProps;
        var c = Jr(r, bn.current);
        Sn(r, l), c = Al(null, r, o, n, c, l);
        var d = li();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, An(o) ? (d = !0, er(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, Nd(r), c.updater = rf, r.stateNode = c, c._reactInternals = r, ws(r, o, n, l), r = Ds(null, r, o, !0, d, l)) : (r.tag = 0, pn && d && Mc(r), fr(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (ja(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = _y(o), n = ui(o, n), c) {
            case 0:
              r = Xv(null, r, o, n, l);
              break e;
            case 1:
              r = Jv(null, r, o, n, l);
              break e;
            case 11:
              r = ra(null, r, o, n, l);
              break e;
            case 14:
              r = Lu(null, r, o, ui(o.type, n), l);
              break e;
          }
          throw Error(x(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ui(o, c), Xv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ui(o, c), Jv(n, r, o, c, l);
      case 3:
        e: {
          if (xo(r), n === null) throw Error(x(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Iv(n, r), vs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = Nu(Error(x(423)), r), r = Zv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = Nu(Error(x(424)), r), r = Zv(n, r, o, l, c);
            break e;
          } else for (ea = xi(r.stateNode.containerInfo.firstChild), Zr = r, pn = !0, za = null, l = ve(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ul(), o === c) {
              r = Ha(n, r, l);
              break e;
            }
            fr(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return $v(r), n === null && Rd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, _c(o, c) ? m = null : d !== null && _c(o, d) && (r.flags |= 32), Vd(n, r), fr(n, r, m, l), r.child;
      case 6:
        return n === null && Rd(r), null;
      case 13:
        return of(n, r, l);
      case 4:
        return Md(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = kn(r, null, o, l) : fr(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ui(o, c), ra(n, r, o, c, l);
      case 7:
        return fr(n, r, r.pendingProps, l), r.child;
      case 8:
        return fr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return fr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, Ae(ya, o._currentValue), o._currentValue = m, d !== null) if (ai(d.value, m)) {
            if (d.children === c.children && !Gn.current) {
              r = Ha(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var C = d.dependencies;
            if (C !== null) {
              m = d.child;
              for (var T = C.firstContext; T !== null; ) {
                if (T.context === o) {
                  if (d.tag === 1) {
                    T = Zi(-1, l & -l), T.tag = 2;
                    var j = d.updateQueue;
                    if (j !== null) {
                      j = j.shared;
                      var K = j.pending;
                      K === null ? T.next = T : (T.next = K.next, K.next = T), j.pending = T;
                    }
                  }
                  d.lanes |= l, T = d.alternate, T !== null && (T.lanes |= l), _d(
                    d.return,
                    l,
                    r
                  ), C.lanes |= l;
                  break;
                }
                T = T.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(x(341));
              m.lanes |= l, C = m.alternate, C !== null && (C.lanes |= l), _d(m, l, r), m = d.sibling;
            } else m = d.child;
            if (m !== null) m.return = d;
            else for (m = d; m !== null; ) {
              if (m === r) {
                m = null;
                break;
              }
              if (d = m.sibling, d !== null) {
                d.return = m.return, m = d;
                break;
              }
              m = m.return;
            }
            d = m;
          }
          fr(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, Sn(r, l), c = Aa(c), o = o(c), r.flags |= 1, fr(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ui(o, r.pendingProps), c = ui(o.type, c), Lu(n, r, o, c, l);
      case 15:
        return ot(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ui(o, c), ja(n, r), r.tag = 1, An(o) ? (n = !0, er(r)) : n = !1, Sn(r, l), af(r, o, c), ws(r, o, c, l), Ds(null, r, o, !0, n, l);
      case 19:
        return Oi(n, r, l);
      case 22:
        return _s(n, r, l);
    }
    throw Error(x(156, r.tag));
  };
  function gh(n, r) {
    return cn(n, r);
  }
  function ky(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Pa(n, r, l, o) {
    return new ky(n, r, l, o);
  }
  function ep(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function _y(n) {
    if (typeof n == "function") return ep(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Dt) return 11;
      if (n === Ot) return 14;
    }
    return 2;
  }
  function Bl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Pa(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Is(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") ep(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case Ve:
        return al(l.children, c, d, r);
      case Yt:
        m = 8, c |= 8;
        break;
      case Vt:
        return n = Pa(12, l, r, c | 2), n.elementType = Vt, n.lanes = d, n;
      case Be:
        return n = Pa(13, l, r, c), n.elementType = Be, n.lanes = d, n;
      case Ft:
        return n = Pa(19, l, r, c), n.elementType = Ft, n.lanes = d, n;
      case Oe:
        return Il(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case tn:
            m = 10;
            break e;
          case on:
            m = 9;
            break e;
          case Dt:
            m = 11;
            break e;
          case Ot:
            m = 14;
            break e;
          case Lt:
            m = 16, o = null;
            break e;
        }
        throw Error(x(130, n == null ? n : typeof n, ""));
    }
    return r = Pa(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function al(n, r, l, o) {
    return n = Pa(7, n, o, r), n.lanes = l, n;
  }
  function Il(n, r, l, o) {
    return n = Pa(22, n, o, r), n.elementType = Oe, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function tp(n, r, l) {
    return n = Pa(6, n, null, r), n.lanes = l, n;
  }
  function mf(n, r, l) {
    return r = Pa(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function Sh(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = to(0), this.expirationTimes = to(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = to(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function yf(n, r, l, o, c, d, m, C, T) {
    return n = new Sh(n, r, l, C, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Pa(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Nd(d), n;
  }
  function Dy(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: He, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function np(n) {
    if (!n) return Tr;
    n = n._reactInternals;
    e: {
      if (lt(n) !== n || n.tag !== 1) throw Error(x(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (An(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(x(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (An(l)) return ds(n, l, r);
    }
    return r;
  }
  function Eh(n, r, l, o, c, d, m, C, T) {
    return n = yf(l, o, !0, n, c, d, m, C, T), n.context = np(null), l = n.current, o = Bn(), c = Ui(l), d = Zi(o, c), d.callback = r ?? null, zl(l, d, c), n.current.lanes = c, Ii(n, c, o), la(n, o), n;
  }
  function gf(n, r, l, o) {
    var c = r.current, d = Bn(), m = Ui(c);
    return l = np(l), r.context === null ? r.context = l : r.pendingContext = l, r = Zi(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = zl(c, r, m), n !== null && (Hr(n, c, m, d), jc(n, c, m)), m;
  }
  function Sf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function rp(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function Ef(n, r) {
    rp(n, r), (n = n.alternate) && rp(n, r);
  }
  function Ch() {
    return null;
  }
  var Hu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function ap(n) {
    this._internalRoot = n;
  }
  Cf.prototype.render = ap.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(x(409));
    gf(n, r, null, null);
  }, Cf.prototype.unmount = ap.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Au(function() {
        gf(null, n, null, null);
      }), r[qi] = null;
    }
  };
  function Cf(n) {
    this._internalRoot = n;
  }
  Cf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = nt();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < Wn.length && r !== 0 && r < Wn[l].priority; l++) ;
      Wn.splice(l, 0, n), l === 0 && Jo(n);
    }
  };
  function ip(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function bf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function bh() {
  }
  function Oy(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var j = Sf(m);
          d.call(j);
        };
      }
      var m = Eh(r, o, n, 0, null, !1, !1, "", bh);
      return n._reactRootContainer = m, n[qi] = m.current, po(n.nodeType === 8 ? n.parentNode : n), Au(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var C = o;
      o = function() {
        var j = Sf(T);
        C.call(j);
      };
    }
    var T = yf(n, 0, !1, null, null, !1, !1, "", bh);
    return n._reactRootContainer = T, n[qi] = T.current, po(n.nodeType === 8 ? n.parentNode : n), Au(function() {
      gf(r, T, l, o);
    }), T;
  }
  function Ys(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var C = c;
        c = function() {
          var T = Sf(m);
          C.call(T);
        };
      }
      gf(r, m, n, c);
    } else m = Oy(l, r, n, c, o);
    return Sf(m);
  }
  kt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = ei(r.pendingLanes);
          l !== 0 && (Yi(r, l | 1), la(r, ut()), (Rt & 6) === 0 && (ko = ut() + 500, wi()));
        }
        break;
      case 13:
        Au(function() {
          var o = ga(n, 1);
          if (o !== null) {
            var c = Bn();
            Hr(o, n, 1, c);
          }
        }), Ef(n, 1);
    }
  }, Ko = function(n) {
    if (n.tag === 13) {
      var r = ga(n, 134217728);
      if (r !== null) {
        var l = Bn();
        Hr(r, n, 134217728, l);
      }
      Ef(n, 134217728);
    }
  }, gi = function(n) {
    if (n.tag === 13) {
      var r = Ui(n), l = ga(n, r);
      if (l !== null) {
        var o = Bn();
        Hr(l, n, r, o);
      }
      Ef(n, r);
    }
  }, nt = function() {
    return Mt;
  }, ro = function(n, r) {
    var l = Mt;
    try {
      return Mt = n, r();
    } finally {
      Mt = l;
    }
  }, Wt = function(n, r, l) {
    switch (r) {
      case "input":
        if (Gr(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = gn(o);
              if (!c) throw Error(x(90));
              Dr(o), Gr(o, c);
            }
          }
        }
        break;
      case "textarea":
        Ga(n, l);
        break;
      case "select":
        r = l.value, r != null && Tn(n, !!l.multiple, r, !1);
    }
  }, au = Xd, ml = Au;
  var Ny = { usingClientEntryPoint: !1, Events: [Fe, ii, gn, Bi, ru, Xd] }, $s = { findFiberByHostInstance: gu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, xh = { bundleType: $s.bundleType, version: $s.version, rendererPackageName: $s.rendererPackageName, rendererConfig: $s.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ue.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = wn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: $s.findFiberByHostInstance || Ch, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Yl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yl.isDisabled && Yl.supportsFiber) try {
      Sl = Yl.inject(xh), qr = Yl;
    } catch {
    }
  }
  return Qa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ny, Qa.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ip(r)) throw Error(x(200));
    return Dy(n, r, null, l);
  }, Qa.createRoot = function(n, r) {
    if (!ip(n)) throw Error(x(299));
    var l = !1, o = "", c = Hu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = yf(n, 1, !1, null, null, l, !1, o, c), n[qi] = r.current, po(n.nodeType === 8 ? n.parentNode : n), new ap(r);
  }, Qa.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(x(188)) : (n = Object.keys(n).join(","), Error(x(268, n)));
    return n = wn(r), n = n === null ? null : n.stateNode, n;
  }, Qa.flushSync = function(n) {
    return Au(n);
  }, Qa.hydrate = function(n, r, l) {
    if (!bf(r)) throw Error(x(200));
    return Ys(null, n, r, !0, l);
  }, Qa.hydrateRoot = function(n, r, l) {
    if (!ip(n)) throw Error(x(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Hu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = Eh(r, null, n, 1, l ?? null, c, !1, d, m), n[qi] = r.current, po(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new Cf(r);
  }, Qa.render = function(n, r, l) {
    if (!bf(r)) throw Error(x(200));
    return Ys(null, n, r, !1, l);
  }, Qa.unmountComponentAtNode = function(n) {
    if (!bf(n)) throw Error(x(40));
    return n._reactRootContainer ? (Au(function() {
      Ys(null, null, n, !1, function() {
        n._reactRootContainer = null, n[qi] = null;
      });
    }), !0) : !1;
  }, Qa.unstable_batchedUpdates = Xd, Qa.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!bf(l)) throw Error(x(200));
    if (n == null || n._reactInternals === void 0) throw Error(x(38));
    return Ys(n, r, l, !1, o);
  }, Qa.version = "18.3.1-next-f1338f8080-20240426", Qa;
}
var Wa = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rx;
function z_() {
  return Rx || (Rx = 1, process.env.NODE_ENV !== "production" && (function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var y = sv(), M = zx(), x = y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, J = !1;
    function te(e) {
      J = e;
    }
    function Ne(e) {
      if (!J) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Qe("warn", e, a);
      }
    }
    function S(e) {
      if (!J) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Qe("error", e, a);
      }
    }
    function Qe(e, t, a) {
      {
        var i = x.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var se = 0, Q = 1, We = 2, ne = 3, me = 4, le = 5, ye = 6, Le = 7, Je = 8, $ = 9, xe = 10, je = 11, ue = 12, Te = 13, He = 14, Ve = 15, Yt = 16, Vt = 17, tn = 18, on = 19, Dt = 21, Be = 22, Ft = 23, Ot = 24, Lt = 25, Oe = !0, ae = !1, Me = !1, fe = !1, D = !1, I = !0, Ze = !0, Ke = !0, ht = !0, ft = /* @__PURE__ */ new Set(), st = {}, dt = {};
    function mt(e, t) {
      $t(e, t), $t(e + "Capture", t);
    }
    function $t(e, t) {
      st[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), st[e] = t;
      {
        var a = e.toLowerCase();
        dt[a] = e, e === "onDoubleClick" && (dt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        ft.add(t[i]);
    }
    var Mn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Dr = Object.prototype.hasOwnProperty;
    function Rn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function lr(e) {
      try {
        return Yn(e), !1;
      } catch {
        return !0;
      }
    }
    function Yn(e) {
      return "" + e;
    }
    function $n(e, t) {
      if (lr(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Yn(e);
    }
    function Gr(e) {
      if (lr(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Rn(e)), Yn(e);
    }
    function pi(e, t) {
      if (lr(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Yn(e);
    }
    function da(e, t) {
      if (lr(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Yn(e);
    }
    function Jn(e) {
      if (lr(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Rn(e)), Yn(e);
    }
    function Tn(e) {
      if (lr(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Rn(e)), Yn(e);
    }
    var Qn = 0, br = 1, Ga = 2, Un = 3, xr = 4, pa = 5, qa = 6, vi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", oe = vi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Ue = new RegExp("^[" + vi + "][" + oe + "]*$"), pt = {}, Pt = {};
    function nn(e) {
      return Dr.call(Pt, e) ? !0 : Dr.call(pt, e) ? !1 : Ue.test(e) ? (Pt[e] = !0, !0) : (pt[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function mn(e, t, a) {
      return t !== null ? t.type === Qn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function sn(e, t, a, i) {
      if (a !== null && a.type === Qn)
        return !1;
      switch (typeof t) {
        case "function":
        // $FlowIssue symbol is perfectly valid here
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Zn(e, t, a, i) {
      if (t === null || typeof t > "u" || sn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Un:
            return !t;
          case xr:
            return t === !1;
          case pa:
            return isNaN(t);
          case qa:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function rn(e) {
      return Wt.hasOwnProperty(e) ? Wt[e] : null;
    }
    function Qt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === Ga || t === Un || t === xr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Wt = {}, va = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    va.forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Qn,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Wt[t] = new Qt(
        t,
        br,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Ga,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Ga,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Un,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        Un,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        xr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        qa,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        pa,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Rr = /[\-\:]([a-z])/g, ka = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Rr, ka);
      Wt[t] = new Qt(
        t,
        br,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Rr, ka);
      Wt[t] = new Qt(
        t,
        br,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Rr, ka);
      Wt[t] = new Qt(
        t,
        br,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        br,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Bi = "xlinkHref";
    Wt[Bi] = new Qt(
      "xlinkHref",
      br,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Wt[e] = new Qt(
        e,
        br,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var ru = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, au = !1;
    function ml(e) {
      !au && ru.test(e) && (au = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function yl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        $n(a, t), i.sanitizeURL && ml("" + a);
        var s = i.attributeName, f = null;
        if (i.type === xr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Zn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Zn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Un)
            return a;
          f = e.getAttribute(s);
        }
        return Zn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function iu(e, t, a, i) {
      {
        if (!nn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return $n(a, t), u === "" + a ? a : u;
      }
    }
    function Or(e, t, a, i) {
      var u = rn(t);
      if (!mn(t, u, i)) {
        if (Zn(t, a, u, i) && (a = null), i || u === null) {
          if (nn(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : ($n(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === Un ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var g = u.attributeName, E = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(g);
        else {
          var _ = u.type, w;
          _ === Un || _ === xr && a === !0 ? w = "" : ($n(a, g), w = "" + a, u.sanitizeURL && ml(w.toString())), E ? e.setAttributeNS(E, g, w) : e.setAttribute(g, w);
        }
      }
    }
    var Nr = Symbol.for("react.element"), ur = Symbol.for("react.portal"), hi = Symbol.for("react.fragment"), Ka = Symbol.for("react.strict_mode"), mi = Symbol.for("react.profiler"), yi = Symbol.for("react.provider"), R = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), pe = Symbol.for("react.suspense"), Re = Symbol.for("react.suspense_list"), lt = Symbol.for("react.memo"), rt = Symbol.for("react.lazy"), St = Symbol.for("react.scope"), yt = Symbol.for("react.debug_trace_mode"), wn = Symbol.for("react.offscreen"), an = Symbol.for("react.legacy_hidden"), cn = Symbol.for("react.cache"), or = Symbol.for("react.tracing_marker"), Xa = Symbol.iterator, Ja = "@@iterator";
    function ut(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Xa && e[Xa] || e[Ja];
      return typeof t == "function" ? t : null;
    }
    var ct = Object.assign, Za = 0, lu, uu, gl, Xu, Sl, qr, qo;
    function Lr() {
    }
    Lr.__reactDisabledLog = !0;
    function pc() {
      {
        if (Za === 0) {
          lu = console.log, uu = console.info, gl = console.warn, Xu = console.error, Sl = console.group, qr = console.groupCollapsed, qo = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Lr,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Za++;
      }
    }
    function vc() {
      {
        if (Za--, Za === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ct({}, e, {
              value: lu
            }),
            info: ct({}, e, {
              value: uu
            }),
            warn: ct({}, e, {
              value: gl
            }),
            error: ct({}, e, {
              value: Xu
            }),
            group: ct({}, e, {
              value: Sl
            }),
            groupCollapsed: ct({}, e, {
              value: qr
            }),
            groupEnd: ct({}, e, {
              value: qo
            })
          });
        }
        Za < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Ju = x.ReactCurrentDispatcher, El;
    function ha(e, t, a) {
      {
        if (El === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            El = i && i[1] || "";
          }
        return `
` + El + e;
      }
    }
    var ei = !1, ti;
    {
      var Zu = typeof WeakMap == "function" ? WeakMap : Map;
      ti = new Zu();
    }
    function ou(e, t) {
      if (!e || ei)
        return "";
      {
        var a = ti.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      ei = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Ju.current, Ju.current = null, pc();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (H) {
              i = H;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (H) {
              i = H;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (H) {
            i = H;
          }
          e();
        }
      } catch (H) {
        if (H && i && typeof H.stack == "string") {
          for (var p = H.stack.split(`
`), v = i.stack.split(`
`), g = p.length - 1, E = v.length - 1; g >= 1 && E >= 0 && p[g] !== v[E]; )
            E--;
          for (; g >= 1 && E >= 0; g--, E--)
            if (p[g] !== v[E]) {
              if (g !== 1 || E !== 1)
                do
                  if (g--, E--, E < 0 || p[g] !== v[E]) {
                    var _ = `
` + p[g].replace(" at new ", " at ");
                    return e.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", e.displayName)), typeof e == "function" && ti.set(e, _), _;
                  }
                while (g >= 1 && E >= 0);
              break;
            }
        }
      } finally {
        ei = !1, Ju.current = s, vc(), Error.prepareStackTrace = u;
      }
      var w = e ? e.displayName || e.name : "", z = w ? ha(w) : "";
      return typeof e == "function" && ti.set(e, z), z;
    }
    function Cl(e, t, a) {
      return ou(e, !0);
    }
    function eo(e, t, a) {
      return ou(e, !1);
    }
    function to(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Ii(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return ou(e, to(e));
      if (typeof e == "string")
        return ha(e);
      switch (e) {
        case pe:
          return ha("Suspense");
        case Re:
          return ha("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case W:
            return eo(e.render);
          case lt:
            return Ii(e.type, t, a);
          case rt: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Ii(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function ed(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case le:
          return ha(e.type);
        case Yt:
          return ha("Lazy");
        case Te:
          return ha("Suspense");
        case on:
          return ha("SuspenseList");
        case se:
        case We:
        case Ve:
          return eo(e.type);
        case je:
          return eo(e.type.render);
        case Q:
          return Cl(e.type);
        default:
          return "";
      }
    }
    function Yi(e) {
      try {
        var t = "", a = e;
        do
          t += ed(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Mt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function no(e) {
      return e.displayName || "Context";
    }
    function kt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case hi:
          return "Fragment";
        case ur:
          return "Portal";
        case mi:
          return "Profiler";
        case Ka:
          return "StrictMode";
        case pe:
          return "Suspense";
        case Re:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return no(t) + ".Consumer";
          case yi:
            var a = e;
            return no(a._context) + ".Provider";
          case W:
            return Mt(e, e.render, "ForwardRef");
          case lt:
            var i = e.displayName || null;
            return i !== null ? i : kt(e.type) || "Memo";
          case rt: {
            var u = e, s = u._payload, f = u._init;
            try {
              return kt(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Ko(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function gi(e) {
      return e.displayName || "Context";
    }
    function nt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Ot:
          return "Cache";
        case $:
          var i = a;
          return gi(i) + ".Consumer";
        case xe:
          var u = a;
          return gi(u._context) + ".Provider";
        case tn:
          return "DehydratedFragment";
        case je:
          return Ko(a, a.render, "ForwardRef");
        case Le:
          return "Fragment";
        case le:
          return a;
        case me:
          return "Portal";
        case ne:
          return "Root";
        case ye:
          return "Text";
        case Yt:
          return kt(a);
        case Je:
          return a === Ka ? "StrictMode" : "Mode";
        case Be:
          return "Offscreen";
        case ue:
          return "Profiler";
        case Dt:
          return "Scope";
        case Te:
          return "Suspense";
        case on:
          return "SuspenseList";
        case Lt:
          return "TracingMarker";
        // The display name for this tags come from the user-provided type:
        case Q:
        case se:
        case Vt:
        case We:
        case He:
        case Ve:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var ro = x.ReactDebugCurrentFrame, sr = null, Si = !1;
    function Mr() {
      {
        if (sr === null)
          return null;
        var e = sr._debugOwner;
        if (e !== null && typeof e < "u")
          return nt(e);
      }
      return null;
    }
    function Ei() {
      return sr === null ? "" : Yi(sr);
    }
    function fn() {
      ro.getCurrentStack = null, sr = null, Si = !1;
    }
    function Gt(e) {
      ro.getCurrentStack = e === null ? null : Ei, sr = e, Si = !1;
    }
    function bl() {
      return sr;
    }
    function Wn(e) {
      Si = e;
    }
    function Ur(e) {
      return "" + e;
    }
    function _a(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Tn(e), e;
        default:
          return "";
      }
    }
    var su = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Xo(e, t) {
      su[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Jo(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function xl(e) {
      return e._valueTracker;
    }
    function cu(e) {
      e._valueTracker = null;
    }
    function td(e) {
      var t = "";
      return e && (Jo(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Da(e) {
      var t = Jo(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Tn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            Tn(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            Tn(p), i = "" + p;
          },
          stopTracking: function() {
            cu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function ni(e) {
      xl(e) || (e._valueTracker = Da(e));
    }
    function Ci(e) {
      if (!e)
        return !1;
      var t = xl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = td(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function Oa(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var ao = !1, io = !1, Rl = !1, fu = !1;
    function lo(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function uo(e, t) {
      var a = e, i = t.checked, u = ct({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ri(e, t) {
      Xo("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !io && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Mr() || "A component", t.type), io = !0), t.value !== void 0 && t.defaultValue !== void 0 && !ao && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Mr() || "A component", t.type), ao = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: _a(t.value != null ? t.value : i),
        controlled: lo(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && Or(a, "checked", i, !1);
    }
    function b(e, t) {
      var a = e;
      {
        var i = lo(t);
        !a._wrapperState.controlled && i && !fu && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), fu = !0), a._wrapperState.controlled && !i && !Rl && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Rl = !0);
      }
      h(e, t);
      var u = _a(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Ur(u)) : a.value !== Ur(u) && (a.value = Ur(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ie(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ie(a, t.type, _a(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function A(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Ur(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function F(e, t) {
      var a = e;
      b(a, t), re(a, t);
    }
    function re(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        $n(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Vh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Ci(f), b(f, p);
          }
        }
      }
    }
    function Ie(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Oa(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Ur(e._wrapperState.initialValue) : e.defaultValue !== Ur(a) && (e.defaultValue = Ur(a)));
    }
    var de = !1, Ge = !1, Et = !1;
    function _t(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? y.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Ge || (Ge = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Et || (Et = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !de && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), de = !0);
    }
    function ln(e, t) {
      t.value != null && e.setAttribute("value", Ur(_a(t.value)));
    }
    var qt = Array.isArray;
    function vt(e) {
      return qt(e);
    }
    var Kt;
    Kt = !1;
    function yn() {
      var e = Mr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Tl = ["value", "defaultValue"];
    function Zo(e) {
      {
        Xo("select", e);
        for (var t = 0; t < Tl.length; t++) {
          var a = Tl[t];
          if (e[a] != null) {
            var i = vt(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, yn()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, yn());
          }
        }
      }
    }
    function $i(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var g = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== g && (u[v].selected = g), g && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var E = Ur(_a(a)), _ = null, w = 0; w < u.length; w++) {
          if (u[w].value === E) {
            u[w].selected = !0, i && (u[w].defaultSelected = !0);
            return;
          }
          _ === null && !u[w].disabled && (_ = u[w]);
        }
        _ !== null && (_.selected = !0);
      }
    }
    function es(e, t) {
      return ct({}, t, {
        value: void 0
      });
    }
    function du(e, t) {
      var a = e;
      Zo(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Kt && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Kt = !0);
    }
    function nd(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? $i(a, !!t.multiple, i, !1) : t.defaultValue != null && $i(a, !!t.multiple, t.defaultValue, !0);
    }
    function hc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? $i(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? $i(a, !!t.multiple, t.defaultValue, !0) : $i(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function rd(e, t) {
      var a = e, i = t.value;
      i != null && $i(a, !!t.multiple, i, !1);
    }
    var cv = !1;
    function ad(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = ct({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Ur(a._wrapperState.initialValue)
      });
      return i;
    }
    function id(e, t) {
      var a = e;
      Xo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !cv && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Mr() || "A component"), cv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (vt(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            s = u;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: _a(i)
      };
    }
    function fv(e, t) {
      var a = e, i = _a(t.value), u = _a(t.defaultValue);
      if (i != null) {
        var s = Ur(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Ur(u));
    }
    function dv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ly(e, t) {
      fv(e, t);
    }
    var Qi = "http://www.w3.org/1999/xhtml", ld = "http://www.w3.org/1998/Math/MathML", ud = "http://www.w3.org/2000/svg";
    function od(e) {
      switch (e) {
        case "svg":
          return ud;
        case "math":
          return ld;
        default:
          return Qi;
      }
    }
    function sd(e, t) {
      return e == null || e === Qi ? od(t) : e === ud && t === "foreignObject" ? Qi : e;
    }
    var pv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, mc, vv = pv(function(e, t) {
      if (e.namespaceURI === ud && !("innerHTML" in e)) {
        mc = mc || document.createElement("div"), mc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = mc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Kr = 1, Wi = 3, zn = 8, Gi = 9, cd = 11, oo = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Wi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, ts = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, ns = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function hv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var mv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(ns).forEach(function(e) {
      mv.forEach(function(t) {
        ns[hv(t, e)] = ns[e];
      });
    });
    function yc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(ns.hasOwnProperty(e) && ns[e]) ? t + "px" : (da(t, e), ("" + t).trim());
    }
    var yv = /([A-Z])/g, gv = /^ms-/;
    function so(e) {
      return e.replace(yv, "-$1").toLowerCase().replace(gv, "-ms-");
    }
    var Sv = function() {
    };
    {
      var uy = /^(?:webkit|moz|o)[A-Z]/, oy = /^-ms-/, Ev = /-(.)/g, fd = /;\s*$/, bi = {}, pu = {}, Cv = !1, rs = !1, sy = function(e) {
        return e.replace(Ev, function(t, a) {
          return a.toUpperCase();
        });
      }, bv = function(e) {
        bi.hasOwnProperty(e) && bi[e] || (bi[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          sy(e.replace(oy, "ms-"))
        ));
      }, dd = function(e) {
        bi.hasOwnProperty(e) && bi[e] || (bi[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, pd = function(e, t) {
        pu.hasOwnProperty(t) && pu[t] || (pu[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(fd, "")));
      }, xv = function(e, t) {
        Cv || (Cv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Rv = function(e, t) {
        rs || (rs = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      Sv = function(e, t) {
        e.indexOf("-") > -1 ? bv(e) : uy.test(e) ? dd(e) : fd.test(t) && pd(e, t), typeof t == "number" && (isNaN(t) ? xv(e, t) : isFinite(t) || Rv(e, t));
      };
    }
    var Tv = Sv;
    function cy(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : so(i)) + ":", t += yc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function wv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || Tv(i, t[i]);
          var s = yc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function fy(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function kv(e) {
      var t = {};
      for (var a in e)
        for (var i = ts[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function dy(e, t) {
      {
        if (!t)
          return;
        var a = kv(e), i = kv(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, S("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", fy(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var ai = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, as = ct({
      menuitem: !0
    }, ai), _v = "__html";
    function gc(e, t) {
      if (t) {
        if (as[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(_v in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && S("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function wl(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        // These are reserved SVG and MathML elements.
        // We don't mind this list too much because we expect it to never grow.
        // The alternative is to track the namespace in a few places which is convoluted.
        // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var is = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, Sc = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, co = {}, py = new RegExp("^(aria)-[" + oe + "]*$"), fo = new RegExp("^(aria)[A-Z][" + oe + "]*$");
    function vd(e, t) {
      {
        if (Dr.call(co, t) && co[t])
          return !0;
        if (fo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = Sc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), co[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), co[t] = !0, !0;
        }
        if (py.test(t)) {
          var u = t.toLowerCase(), s = Sc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return co[t] = !0, !1;
          if (t !== s)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), co[t] = !0, !0;
        }
      }
      return !0;
    }
    function ls(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = vd(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function hd(e, t) {
      wl(e, t) || ls(e, t);
    }
    var md = !1;
    function Ec(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !md && (md = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var vu = function() {
    };
    {
      var cr = {}, yd = /^on./, Cc = /^on[^A-Z]/, Dv = new RegExp("^(aria)-[" + oe + "]*$"), Ov = new RegExp("^(aria)[A-Z][" + oe + "]*$");
      vu = function(e, t, a, i) {
        if (Dr.call(cr, t) && cr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), cr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, p), cr[t] = !0, !0;
          if (yd.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), cr[t] = !0, !0;
        } else if (yd.test(t))
          return Cc.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), cr[t] = !0, !0;
        if (Dv.test(t) || Ov.test(t))
          return !0;
        if (u === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), cr[t] = !0, !0;
        if (u === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), cr[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), cr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), cr[t] = !0, !0;
        var v = rn(t), g = v !== null && v.type === Qn;
        if (is.hasOwnProperty(u)) {
          var E = is[u];
          if (E !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, E), cr[t] = !0, !0;
        } else if (!g && t !== u)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), cr[t] = !0, !0;
        return typeof a == "boolean" && sn(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), cr[t] = !0, !0) : g ? !0 : sn(t, a, v, !1) ? (cr[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Un && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), cr[t] = !0), !0);
      };
    }
    var Nv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = vu(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function Lv(e, t, a) {
      wl(e, t) || Nv(e, t, a);
    }
    var gd = 1, bc = 2, Na = 4, Sd = gd | bc | Na, hu = null;
    function vy(e) {
      hu !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), hu = e;
    }
    function hy() {
      hu === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), hu = null;
    }
    function us(e) {
      return e === hu;
    }
    function Ed(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Wi ? t.parentNode : t;
    }
    var xc = null, mu = null, Bt = null;
    function Rc(e) {
      var t = Mo(e);
      if (t) {
        if (typeof xc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Vh(a);
          xc(t.stateNode, t.type, i);
        }
      }
    }
    function Tc(e) {
      xc = e;
    }
    function po(e) {
      mu ? Bt ? Bt.push(e) : Bt = [e] : mu = e;
    }
    function Mv() {
      return mu !== null || Bt !== null;
    }
    function wc() {
      if (mu) {
        var e = mu, t = Bt;
        if (mu = null, Bt = null, Rc(e), t)
          for (var a = 0; a < t.length; a++)
            Rc(t[a]);
      }
    }
    var vo = function(e, t) {
      return e(t);
    }, os = function() {
    }, kl = !1;
    function Uv() {
      var e = Mv();
      e && (os(), wc());
    }
    function zv(e, t, a) {
      if (kl)
        return e(t, a);
      kl = !0;
      try {
        return vo(e, t, a);
      } finally {
        kl = !1, Uv();
      }
    }
    function my(e, t, a) {
      vo = e, os = a;
    }
    function Av(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function kc(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && Av(t));
        default:
          return !1;
      }
    }
    function _l(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Vh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (kc(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var ss = !1;
    if (Mn)
      try {
        var yu = {};
        Object.defineProperty(yu, "passive", {
          get: function() {
            ss = !0;
          }
        }), window.addEventListener("test", yu, yu), window.removeEventListener("test", yu, yu);
      } catch {
        ss = !1;
      }
    function _c(e, t, a, i, u, s, f, p, v) {
      var g = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, g);
      } catch (E) {
        this.onError(E);
      }
    }
    var Dc = _c;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var Cd = document.createElement("react");
      Dc = function(t, a, i, u, s, f, p, v, g) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var E = document.createEvent("Event"), _ = !1, w = !0, z = window.event, H = Object.getOwnPropertyDescriptor(window, "event");
        function V() {
          Cd.removeEventListener(B, Ye, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = z);
        }
        var he = Array.prototype.slice.call(arguments, 3);
        function Ye() {
          _ = !0, V(), a.apply(i, he), w = !1;
        }
        var ze, wt = !1, Ct = !1;
        function N(L) {
          if (ze = L.error, wt = !0, ze === null && L.colno === 0 && L.lineno === 0 && (Ct = !0), L.defaultPrevented && ze != null && typeof ze == "object")
            try {
              ze._suppressLogging = !0;
            } catch {
            }
        }
        var B = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", N), Cd.addEventListener(B, Ye, !1), E.initEvent(B, !1, !1), Cd.dispatchEvent(E), H && Object.defineProperty(window, "event", H), _ && w && (wt ? Ct && (ze = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : ze = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(ze)), window.removeEventListener("error", N), !_)
          return V(), _c.apply(this, arguments);
      };
    }
    var jv = Dc, ho = !1, Oc = null, mo = !1, xi = null, Hv = {
      onError: function(e) {
        ho = !0, Oc = e;
      }
    };
    function Dl(e, t, a, i, u, s, f, p, v) {
      ho = !1, Oc = null, jv.apply(Hv, arguments);
    }
    function Ri(e, t, a, i, u, s, f, p, v) {
      if (Dl.apply(this, arguments), ho) {
        var g = fs();
        mo || (mo = !0, xi = g);
      }
    }
    function cs() {
      if (mo) {
        var e = xi;
        throw mo = !1, xi = null, e;
      }
    }
    function qi() {
      return ho;
    }
    function fs() {
      if (ho) {
        var e = Oc;
        return ho = !1, Oc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function yo(e) {
      return e._reactInternals;
    }
    function yy(e) {
      return e._reactInternals !== void 0;
    }
    function gu(e, t) {
      e._reactInternals = t;
    }
    var Fe = (
      /*                      */
      0
    ), ii = (
      /*                */
      1
    ), gn = (
      /*                    */
      2
    ), xt = (
      /*                       */
      4
    ), La = (
      /*                */
      16
    ), Ma = (
      /*                 */
      32
    ), un = (
      /*                     */
      64
    ), Ae = (
      /*                   */
      128
    ), Tr = (
      /*            */
      256
    ), bn = (
      /*                          */
      512
    ), Gn = (
      /*                     */
      1024
    ), Xr = (
      /*                      */
      2048
    ), Jr = (
      /*                    */
      4096
    ), An = (
      /*                   */
      8192
    ), go = (
      /*             */
      16384
    ), Fv = (
      /*               */
      32767
    ), ds = (
      /*                   */
      32768
    ), er = (
      /*                */
      65536
    ), Nc = (
      /* */
      131072
    ), Ti = (
      /*                       */
      1048576
    ), So = (
      /*                    */
      2097152
    ), Ki = (
      /*                 */
      4194304
    ), Lc = (
      /*                */
      8388608
    ), Ol = (
      /*               */
      16777216
    ), wi = (
      /*              */
      33554432
    ), Nl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      xt | Gn | 0
    ), Ll = gn | xt | La | Ma | bn | Jr | An, Ml = xt | un | bn | An, Xi = Xr | La, jn = Ki | Lc | So, Ua = x.ReactCurrentOwner;
    function ma(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (gn | Jr)) !== Fe && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === ne ? a : null;
    }
    function ki(e) {
      if (e.tag === Te) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function _i(e) {
      return e.tag === ne ? e.stateNode.containerInfo : null;
    }
    function Su(e) {
      return ma(e) === e;
    }
    function Pv(e) {
      {
        var t = Ua.current;
        if (t !== null && t.tag === Q) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", nt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = yo(e);
      return u ? ma(u) === u : !1;
    }
    function Mc(e) {
      if (ma(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Uc(e) {
      var t = e.alternate;
      if (!t) {
        var a = ma(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var p = s.return;
          if (p !== null) {
            i = u = p;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var v = s.child; v; ) {
            if (v === i)
              return Mc(s), e;
            if (v === u)
              return Mc(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = f;
        else {
          for (var g = !1, E = s.child; E; ) {
            if (E === i) {
              g = !0, i = s, u = f;
              break;
            }
            if (E === u) {
              g = !0, u = s, i = f;
              break;
            }
            E = E.sibling;
          }
          if (!g) {
            for (E = f.child; E; ) {
              if (E === i) {
                g = !0, i = f, u = s;
                break;
              }
              if (E === u) {
                g = !0, u = f, i = s;
                break;
              }
              E = E.sibling;
            }
            if (!g)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== ne)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Zr(e) {
      var t = Uc(e);
      return t !== null ? ea(t) : null;
    }
    function ea(e) {
      if (e.tag === le || e.tag === ye)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = ea(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function pn(e) {
      var t = Uc(e);
      return t !== null ? za(t) : null;
    }
    function za(e) {
      if (e.tag === le || e.tag === ye)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== me) {
          var a = za(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var bd = M.unstable_scheduleCallback, Vv = M.unstable_cancelCallback, xd = M.unstable_shouldYield, Rd = M.unstable_requestPaint, qn = M.unstable_now, zc = M.unstable_getCurrentPriorityLevel, ps = M.unstable_ImmediatePriority, Ul = M.unstable_UserBlockingPriority, Ji = M.unstable_NormalPriority, gy = M.unstable_LowPriority, Eu = M.unstable_IdlePriority, Ac = M.unstable_yieldValue, Bv = M.unstable_setDisableYieldValue, Cu = null, kn = null, ve = null, ya = !1, ta = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function Eo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ze && (e = ct({}, e, {
          getLaneLabelMap: bu,
          injectProfilingHooks: Aa
        })), Cu = t.inject(e), kn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Td(e, t) {
      if (kn && typeof kn.onScheduleFiberRoot == "function")
        try {
          kn.onScheduleFiberRoot(Cu, e, t);
        } catch (a) {
          ya || (ya = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function wd(e, t) {
      if (kn && typeof kn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Ae) === Ae;
          if (Ke) {
            var i;
            switch (t) {
              case zr:
                i = ps;
                break;
              case Oi:
                i = Ul;
                break;
              case ja:
                i = Ji;
                break;
              case Ha:
                i = Eu;
                break;
              default:
                i = Ji;
                break;
            }
            kn.onCommitFiberRoot(Cu, e, i, a);
          }
        } catch (u) {
          ya || (ya = !0, S("React instrumentation encountered an error: %s", u));
        }
    }
    function kd(e) {
      if (kn && typeof kn.onPostCommitFiberRoot == "function")
        try {
          kn.onPostCommitFiberRoot(Cu, e);
        } catch (t) {
          ya || (ya = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function _d(e) {
      if (kn && typeof kn.onCommitFiberUnmount == "function")
        try {
          kn.onCommitFiberUnmount(Cu, e);
        } catch (t) {
          ya || (ya = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Sn(e) {
      if (typeof Ac == "function" && (Bv(e), te(e)), kn && typeof kn.setStrictMode == "function")
        try {
          kn.setStrictMode(Cu, e);
        } catch (t) {
          ya || (ya = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Aa(e) {
      ve = e;
    }
    function bu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Tu; a++) {
          var i = Qv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Dd(e) {
      ve !== null && typeof ve.markCommitStarted == "function" && ve.markCommitStarted(e);
    }
    function Od() {
      ve !== null && typeof ve.markCommitStopped == "function" && ve.markCommitStopped();
    }
    function ga(e) {
      ve !== null && typeof ve.markComponentRenderStarted == "function" && ve.markComponentRenderStarted(e);
    }
    function Sa() {
      ve !== null && typeof ve.markComponentRenderStopped == "function" && ve.markComponentRenderStopped();
    }
    function Nd(e) {
      ve !== null && typeof ve.markComponentPassiveEffectMountStarted == "function" && ve.markComponentPassiveEffectMountStarted(e);
    }
    function Iv() {
      ve !== null && typeof ve.markComponentPassiveEffectMountStopped == "function" && ve.markComponentPassiveEffectMountStopped();
    }
    function Zi(e) {
      ve !== null && typeof ve.markComponentPassiveEffectUnmountStarted == "function" && ve.markComponentPassiveEffectUnmountStarted(e);
    }
    function zl() {
      ve !== null && typeof ve.markComponentPassiveEffectUnmountStopped == "function" && ve.markComponentPassiveEffectUnmountStopped();
    }
    function jc(e) {
      ve !== null && typeof ve.markComponentLayoutEffectMountStarted == "function" && ve.markComponentLayoutEffectMountStarted(e);
    }
    function Yv() {
      ve !== null && typeof ve.markComponentLayoutEffectMountStopped == "function" && ve.markComponentLayoutEffectMountStopped();
    }
    function vs(e) {
      ve !== null && typeof ve.markComponentLayoutEffectUnmountStarted == "function" && ve.markComponentLayoutEffectUnmountStarted(e);
    }
    function Ld() {
      ve !== null && typeof ve.markComponentLayoutEffectUnmountStopped == "function" && ve.markComponentLayoutEffectUnmountStopped();
    }
    function hs(e, t, a) {
      ve !== null && typeof ve.markComponentErrored == "function" && ve.markComponentErrored(e, t, a);
    }
    function Di(e, t, a) {
      ve !== null && typeof ve.markComponentSuspended == "function" && ve.markComponentSuspended(e, t, a);
    }
    function ms(e) {
      ve !== null && typeof ve.markLayoutEffectsStarted == "function" && ve.markLayoutEffectsStarted(e);
    }
    function ys() {
      ve !== null && typeof ve.markLayoutEffectsStopped == "function" && ve.markLayoutEffectsStopped();
    }
    function xu(e) {
      ve !== null && typeof ve.markPassiveEffectsStarted == "function" && ve.markPassiveEffectsStarted(e);
    }
    function Md() {
      ve !== null && typeof ve.markPassiveEffectsStopped == "function" && ve.markPassiveEffectsStopped();
    }
    function Ru(e) {
      ve !== null && typeof ve.markRenderStarted == "function" && ve.markRenderStarted(e);
    }
    function $v() {
      ve !== null && typeof ve.markRenderYielded == "function" && ve.markRenderYielded();
    }
    function Hc() {
      ve !== null && typeof ve.markRenderStopped == "function" && ve.markRenderStopped();
    }
    function En(e) {
      ve !== null && typeof ve.markRenderScheduled == "function" && ve.markRenderScheduled(e);
    }
    function Fc(e, t) {
      ve !== null && typeof ve.markForceUpdateScheduled == "function" && ve.markForceUpdateScheduled(e, t);
    }
    function gs(e, t) {
      ve !== null && typeof ve.markStateUpdateScheduled == "function" && ve.markStateUpdateScheduled(e, t);
    }
    var Pe = (
      /*                         */
      0
    ), gt = (
      /*                 */
      1
    ), Ut = (
      /*                    */
      2
    ), Xt = (
      /*               */
      8
    ), zt = (
      /*              */
      16
    ), Hn = Math.clz32 ? Math.clz32 : Ss, tr = Math.log, Pc = Math.LN2;
    function Ss(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (tr(t) / Pc | 0) | 0;
    }
    var Tu = 31, G = (
      /*                        */
      0
    ), Nt = (
      /*                          */
      0
    ), Xe = (
      /*                        */
      1
    ), Al = (
      /*    */
      2
    ), li = (
      /*             */
      4
    ), wr = (
      /*            */
      8
    ), _n = (
      /*                     */
      16
    ), el = (
      /*                */
      32
    ), jl = (
      /*                       */
      4194240
    ), wu = (
      /*                        */
      64
    ), Vc = (
      /*                        */
      128
    ), Bc = (
      /*                        */
      256
    ), Ic = (
      /*                        */
      512
    ), Yc = (
      /*                        */
      1024
    ), $c = (
      /*                        */
      2048
    ), Qc = (
      /*                        */
      4096
    ), Wc = (
      /*                        */
      8192
    ), Gc = (
      /*                        */
      16384
    ), ku = (
      /*                       */
      32768
    ), qc = (
      /*                       */
      65536
    ), Co = (
      /*                       */
      131072
    ), bo = (
      /*                       */
      262144
    ), Kc = (
      /*                       */
      524288
    ), Es = (
      /*                       */
      1048576
    ), Xc = (
      /*                       */
      2097152
    ), Cs = (
      /*                            */
      130023424
    ), _u = (
      /*                             */
      4194304
    ), Jc = (
      /*                             */
      8388608
    ), bs = (
      /*                             */
      16777216
    ), Zc = (
      /*                             */
      33554432
    ), ef = (
      /*                             */
      67108864
    ), Ud = _u, xs = (
      /*          */
      134217728
    ), zd = (
      /*                          */
      268435455
    ), Rs = (
      /*               */
      268435456
    ), Du = (
      /*                        */
      536870912
    ), na = (
      /*                   */
      1073741824
    );
    function Qv(e) {
      {
        if (e & Xe)
          return "Sync";
        if (e & Al)
          return "InputContinuousHydration";
        if (e & li)
          return "InputContinuous";
        if (e & wr)
          return "DefaultHydration";
        if (e & _n)
          return "Default";
        if (e & el)
          return "TransitionHydration";
        if (e & jl)
          return "Transition";
        if (e & Cs)
          return "Retry";
        if (e & xs)
          return "SelectiveHydration";
        if (e & Rs)
          return "IdleHydration";
        if (e & Du)
          return "Idle";
        if (e & na)
          return "Offscreen";
      }
    }
    var en = -1, Ou = wu, tf = _u;
    function Ts(e) {
      switch (Hl(e)) {
        case Xe:
          return Xe;
        case Al:
          return Al;
        case li:
          return li;
        case wr:
          return wr;
        case _n:
          return _n;
        case el:
          return el;
        case wu:
        case Vc:
        case Bc:
        case Ic:
        case Yc:
        case $c:
        case Qc:
        case Wc:
        case Gc:
        case ku:
        case qc:
        case Co:
        case bo:
        case Kc:
        case Es:
        case Xc:
          return e & jl;
        case _u:
        case Jc:
        case bs:
        case Zc:
        case ef:
          return e & Cs;
        case xs:
          return xs;
        case Rs:
          return Rs;
        case Du:
          return Du;
        case na:
          return na;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function nf(e, t) {
      var a = e.pendingLanes;
      if (a === G)
        return G;
      var i = G, u = e.suspendedLanes, s = e.pingedLanes, f = a & zd;
      if (f !== G) {
        var p = f & ~u;
        if (p !== G)
          i = Ts(p);
        else {
          var v = f & s;
          v !== G && (i = Ts(v));
        }
      } else {
        var g = a & ~u;
        g !== G ? i = Ts(g) : s !== G && (i = Ts(s));
      }
      if (i === G)
        return G;
      if (t !== G && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === G) {
        var E = Hl(i), _ = Hl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          E >= _ || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          E === _n && (_ & jl) !== G
        )
          return t;
      }
      (i & li) !== G && (i |= a & _n);
      var w = e.entangledLanes;
      if (w !== G)
        for (var z = e.entanglements, H = i & w; H > 0; ) {
          var V = Fn(H), he = 1 << V;
          i |= z[V], H &= ~he;
        }
      return i;
    }
    function ui(e, t) {
      for (var a = e.eventTimes, i = en; t > 0; ) {
        var u = Fn(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Ad(e, t) {
      switch (e) {
        case Xe:
        case Al:
        case li:
          return t + 250;
        case wr:
        case _n:
        case el:
        case wu:
        case Vc:
        case Bc:
        case Ic:
        case Yc:
        case $c:
        case Qc:
        case Wc:
        case Gc:
        case ku:
        case qc:
        case Co:
        case bo:
        case Kc:
        case Es:
        case Xc:
          return t + 5e3;
        case _u:
        case Jc:
        case bs:
        case Zc:
        case ef:
          return en;
        case xs:
        case Rs:
        case Du:
        case na:
          return en;
        default:
          return S("Should have found matching lanes. This is a bug in React."), en;
      }
    }
    function rf(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Fn(f), v = 1 << p, g = s[p];
        g === en ? ((v & i) === G || (v & u) !== G) && (s[p] = Ad(v, t)) : g <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Wv(e) {
      return Ts(e.pendingLanes);
    }
    function af(e) {
      var t = e.pendingLanes & ~na;
      return t !== G ? t : t & na ? na : G;
    }
    function Gv(e) {
      return (e & Xe) !== G;
    }
    function ws(e) {
      return (e & zd) !== G;
    }
    function Nu(e) {
      return (e & Cs) === e;
    }
    function jd(e) {
      var t = Xe | li | _n;
      return (e & t) === G;
    }
    function Hd(e) {
      return (e & jl) === e;
    }
    function lf(e, t) {
      var a = Al | li | wr | _n;
      return (t & a) !== G;
    }
    function qv(e, t) {
      return (t & e.expiredLanes) !== G;
    }
    function Fd(e) {
      return (e & jl) !== G;
    }
    function Pd() {
      var e = Ou;
      return Ou <<= 1, (Ou & jl) === G && (Ou = wu), e;
    }
    function Kv() {
      var e = tf;
      return tf <<= 1, (tf & Cs) === G && (tf = _u), e;
    }
    function Hl(e) {
      return e & -e;
    }
    function ks(e) {
      return Hl(e);
    }
    function Fn(e) {
      return 31 - Hn(e);
    }
    function fr(e) {
      return Fn(e);
    }
    function ra(e, t) {
      return (e & t) !== G;
    }
    function Lu(e, t) {
      return (e & t) === t;
    }
    function ot(e, t) {
      return e | t;
    }
    function _s(e, t) {
      return e & ~t;
    }
    function Vd(e, t) {
      return e & t;
    }
    function Xv(e) {
      return e;
    }
    function Jv(e, t) {
      return e !== Nt && e < t ? e : t;
    }
    function Ds(e) {
      for (var t = [], a = 0; a < Tu; a++)
        t.push(e);
      return t;
    }
    function xo(e, t, a) {
      e.pendingLanes |= t, t !== Du && (e.suspendedLanes = G, e.pingedLanes = G);
      var i = e.eventTimes, u = fr(t);
      i[u] = a;
    }
    function Zv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Fn(i), s = 1 << u;
        a[u] = en, i &= ~s;
      }
    }
    function uf(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Bd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = G, e.pingedLanes = G, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Fn(f), v = 1 << p;
        i[p] = G, u[p] = en, s[p] = en, f &= ~v;
      }
    }
    function of(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = Fn(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Id(e, t) {
      var a = Hl(t), i;
      switch (a) {
        case li:
          i = Al;
          break;
        case _n:
          i = wr;
          break;
        case wu:
        case Vc:
        case Bc:
        case Ic:
        case Yc:
        case $c:
        case Qc:
        case Wc:
        case Gc:
        case ku:
        case qc:
        case Co:
        case bo:
        case Kc:
        case Es:
        case Xc:
        case _u:
        case Jc:
        case bs:
        case Zc:
        case ef:
          i = el;
          break;
        case Du:
          i = Rs;
          break;
        default:
          i = Nt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Nt ? Nt : i;
    }
    function Os(e, t, a) {
      if (ta)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = fr(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function eh(e, t) {
      if (ta)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = fr(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Yd(e, t) {
      return null;
    }
    var zr = Xe, Oi = li, ja = _n, Ha = Du, Ns = Nt;
    function Fa() {
      return Ns;
    }
    function Pn(e) {
      Ns = e;
    }
    function th(e, t) {
      var a = Ns;
      try {
        return Ns = e, t();
      } finally {
        Ns = a;
      }
    }
    function nh(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ls(e, t) {
      return e > t ? e : t;
    }
    function nr(e, t) {
      return e !== 0 && e < t;
    }
    function rh(e) {
      var t = Hl(e);
      return nr(zr, t) ? nr(Oi, t) ? ws(t) ? ja : Ha : Oi : zr;
    }
    function sf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ms;
    function kr(e) {
      Ms = e;
    }
    function Sy(e) {
      Ms(e);
    }
    var be;
    function Ro(e) {
      be = e;
    }
    var cf;
    function ah(e) {
      cf = e;
    }
    var ih;
    function Us(e) {
      ih = e;
    }
    var zs;
    function $d(e) {
      zs = e;
    }
    var ff = !1, As = [], tl = null, Ni = null, Li = null, Dn = /* @__PURE__ */ new Map(), Ar = /* @__PURE__ */ new Map(), jr = [], lh = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function uh(e) {
      return lh.indexOf(e) > -1;
    }
    function oi(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function Qd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          tl = null;
          break;
        case "dragenter":
        case "dragleave":
          Ni = null;
          break;
        case "mouseover":
        case "mouseout":
          Li = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Dn.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Ar.delete(i);
          break;
        }
      }
    }
    function aa(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = oi(t, a, i, u, s);
        if (t !== null) {
          var p = Mo(t);
          p !== null && be(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function Ey(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return tl = aa(tl, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return Ni = aa(Ni, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return Li = aa(Li, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, g = v.pointerId;
          return Dn.set(g, aa(Dn.get(g) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var E = u, _ = E.pointerId;
          return Ar.set(_, aa(Ar.get(_) || null, e, t, a, i, E)), !0;
        }
      }
      return !1;
    }
    function Wd(e) {
      var t = Gs(e.target);
      if (t !== null) {
        var a = ma(t);
        if (a !== null) {
          var i = a.tag;
          if (i === Te) {
            var u = ki(a);
            if (u !== null) {
              e.blockedOn = u, zs(e.priority, function() {
                cf(a);
              });
              return;
            }
          } else if (i === ne) {
            var s = a.stateNode;
            if (sf(s)) {
              e.blockedOn = _i(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function oh(e) {
      for (var t = ih(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < jr.length && nr(t, jr[i].priority); i++)
        ;
      jr.splice(i, 0, a), i === 0 && Wd(a);
    }
    function js(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = wo(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          vy(s), u.target.dispatchEvent(s), hy();
        } else {
          var f = Mo(i);
          return f !== null && be(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Gd(e, t, a) {
      js(e) && a.delete(t);
    }
    function Cy() {
      ff = !1, tl !== null && js(tl) && (tl = null), Ni !== null && js(Ni) && (Ni = null), Li !== null && js(Li) && (Li = null), Dn.forEach(Gd), Ar.forEach(Gd);
    }
    function Fl(e, t) {
      e.blockedOn === t && (e.blockedOn = null, ff || (ff = !0, M.unstable_scheduleCallback(M.unstable_NormalPriority, Cy)));
    }
    function Mu(e) {
      if (As.length > 0) {
        Fl(As[0], e);
        for (var t = 1; t < As.length; t++) {
          var a = As[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      tl !== null && Fl(tl, e), Ni !== null && Fl(Ni, e), Li !== null && Fl(Li, e);
      var i = function(p) {
        return Fl(p, e);
      };
      Dn.forEach(i), Ar.forEach(i);
      for (var u = 0; u < jr.length; u++) {
        var s = jr[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; jr.length > 0; ) {
        var f = jr[0];
        if (f.blockedOn !== null)
          break;
        Wd(f), f.blockedOn === null && jr.shift();
      }
    }
    var dr = x.ReactCurrentBatchConfig, Rt = !0;
    function Kn(e) {
      Rt = !!e;
    }
    function Vn() {
      return Rt;
    }
    function pr(e, t, a) {
      var i = df(t), u;
      switch (i) {
        case zr:
          u = Ea;
          break;
        case Oi:
          u = To;
          break;
        case ja:
        default:
          u = On;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function Ea(e, t, a, i) {
      var u = Fa(), s = dr.transition;
      dr.transition = null;
      try {
        Pn(zr), On(e, t, a, i);
      } finally {
        Pn(u), dr.transition = s;
      }
    }
    function To(e, t, a, i) {
      var u = Fa(), s = dr.transition;
      dr.transition = null;
      try {
        Pn(Oi), On(e, t, a, i);
      } finally {
        Pn(u), dr.transition = s;
      }
    }
    function On(e, t, a, i) {
      Rt && Hs(e, t, a, i);
    }
    function Hs(e, t, a, i) {
      var u = wo(e, t, a, i);
      if (u === null) {
        Hy(e, t, i, Mi, a), Qd(e, i);
        return;
      }
      if (Ey(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Qd(e, i), t & Na && uh(e)) {
        for (; u !== null; ) {
          var s = Mo(u);
          s !== null && Sy(s);
          var f = wo(e, t, a, i);
          if (f === null && Hy(e, t, i, Mi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Hy(e, t, i, null, a);
    }
    var Mi = null;
    function wo(e, t, a, i) {
      Mi = null;
      var u = Ed(i), s = Gs(u);
      if (s !== null) {
        var f = ma(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === Te) {
            var v = ki(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === ne) {
            var g = f.stateNode;
            if (sf(g))
              return _i(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Mi = s, null;
    }
    function df(e) {
      switch (e) {
        // Used by SimpleEventPlugin:
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        // Used by polyfills:
        // eslint-disable-next-line no-fallthrough
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        // Only enableCreateEventHandleAPI:
        // eslint-disable-next-line no-fallthrough
        case "beforeblur":
        case "afterblur":
        // Not used by React but could be by user code:
        // eslint-disable-next-line no-fallthrough
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return zr;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        // Not used by React but could be by user code:
        // eslint-disable-next-line no-fallthrough
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return Oi;
        case "message": {
          var t = zc();
          switch (t) {
            case ps:
              return zr;
            case Ul:
              return Oi;
            case Ji:
            case gy:
              return ja;
            case Eu:
              return Ha;
            default:
              return ja;
          }
        }
        default:
          return ja;
      }
    }
    function Fs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ia(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function qd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function ko(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Ca = null, _o = null, Uu = null;
    function Pl(e) {
      return Ca = e, _o = Ps(), !0;
    }
    function pf() {
      Ca = null, _o = null, Uu = null;
    }
    function nl() {
      if (Uu)
        return Uu;
      var e, t = _o, a = t.length, i, u = Ps(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Uu = u.slice(e, p), Uu;
    }
    function Ps() {
      return "value" in Ca ? Ca.value : Ca.textContent;
    }
    function Vl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function Do() {
      return !0;
    }
    function Vs() {
      return !1;
    }
    function _r(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var g = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return g ? this.isDefaultPrevented = Do : this.isDefaultPrevented = Vs, this.isPropagationStopped = Vs, this;
      }
      return ct(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Do);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Do);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: Do
      }), t;
    }
    var Bn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Ui = _r(Bn), Hr = ct({}, Bn, {
      view: 0,
      detail: 0
    }), la = _r(Hr), vf, Bs, zu;
    function by(e) {
      e !== zu && (zu && e.type === "mousemove" ? (vf = e.screenX - zu.screenX, Bs = e.screenY - zu.screenY) : (vf = 0, Bs = 0), zu = e);
    }
    var si = ct({}, Hr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: vn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (by(e), vf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Bs;
      }
    }), Kd = _r(si), Xd = ct({}, si, {
      dataTransfer: 0
    }), Au = _r(Xd), Jd = ct({}, Hr, {
      relatedTarget: 0
    }), rl = _r(Jd), sh = ct({}, Bn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ch = _r(sh), Zd = ct({}, Bn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), hf = _r(Zd), xy = ct({}, Bn, {
      data: 0
    }), fh = _r(xy), dh = fh, ph = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, ju = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function Ry(e) {
      if (e.key) {
        var t = ph[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Vl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? ju[e.keyCode] || "Unidentified" : "";
    }
    var Oo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function vh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = Oo[e];
      return i ? !!a[i] : !1;
    }
    function vn(e) {
      return vh;
    }
    var Ty = ct({}, Hr, {
      key: Ry,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: vn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Vl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Vl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), hh = _r(Ty), wy = ct({}, si, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), mh = _r(wy), yh = ct({}, Hr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vn
    }), gh = _r(yh), ky = ct({}, Bn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Pa = _r(ky), ep = ct({}, si, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), _y = _r(ep), Bl = [9, 13, 27, 32], Is = 229, al = Mn && "CompositionEvent" in window, Il = null;
    Mn && "documentMode" in document && (Il = document.documentMode);
    var tp = Mn && "TextEvent" in window && !Il, mf = Mn && (!al || Il && Il > 8 && Il <= 11), Sh = 32, yf = String.fromCharCode(Sh);
    function Dy() {
      mt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), mt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), mt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), mt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var np = !1;
    function Eh(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function gf(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function Sf(e, t) {
      return e === "keydown" && t.keyCode === Is;
    }
    function rp(e, t) {
      switch (e) {
        case "keyup":
          return Bl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Is;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Ef(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function Ch(e) {
      return e.locale === "ko";
    }
    var Hu = !1;
    function ap(e, t, a, i, u) {
      var s, f;
      if (al ? s = gf(t) : Hu ? rp(t, i) && (s = "onCompositionEnd") : Sf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      mf && !Ch(i) && (!Hu && s === "onCompositionStart" ? Hu = Pl(u) : s === "onCompositionEnd" && Hu && (f = nl()));
      var p = _h(a, s);
      if (p.length > 0) {
        var v = new fh(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var g = Ef(i);
          g !== null && (v.data = g);
        }
      }
    }
    function Cf(e, t) {
      switch (e) {
        case "compositionend":
          return Ef(t);
        case "keypress":
          var a = t.which;
          return a !== Sh ? null : (np = !0, yf);
        case "textInput":
          var i = t.data;
          return i === yf && np ? null : i;
        default:
          return null;
      }
    }
    function ip(e, t) {
      if (Hu) {
        if (e === "compositionend" || !al && rp(e, t)) {
          var a = nl();
          return pf(), Hu = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!Eh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return mf && !Ch(t) ? null : t.data;
        default:
          return null;
      }
    }
    function bf(e, t, a, i, u) {
      var s;
      if (tp ? s = Cf(t, i) : s = ip(t, i), !s)
        return null;
      var f = _h(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new dh("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function bh(e, t, a, i, u, s, f) {
      ap(e, t, a, i, u), bf(e, t, a, i, u);
    }
    var Oy = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function Ys(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Oy[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Ny(e) {
      if (!Mn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function $s() {
      mt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function xh(e, t, a, i) {
      po(i);
      var u = _h(t, "onChange");
      if (u.length > 0) {
        var s = new Ui("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var Yl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      xh(t, n, e, Ed(e)), zv(o, t);
    }
    function o(e) {
      $S(e, 0);
    }
    function c(e) {
      var t = _f(e);
      if (Ci(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    Mn && (m = Ny("input") && (!document.documentMode || document.documentMode > 9));
    function C(e, t) {
      Yl = e, n = t, Yl.attachEvent("onpropertychange", j);
    }
    function T() {
      Yl && (Yl.detachEvent("onpropertychange", j), Yl = null, n = null);
    }
    function j(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function K(e, t, a) {
      e === "focusin" ? (T(), C(t, a)) : e === "focusout" && T();
    }
    function Z(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function q(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Se(e, t) {
      if (e === "click")
        return c(t);
    }
    function we(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function De(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ie(e, "number", e.value);
    }
    function Nn(e, t, a, i, u, s, f) {
      var p = a ? _f(a) : window, v, g;
      if (r(p) ? v = d : Ys(p) ? m ? v = we : (v = Z, g = K) : q(p) && (v = Se), v) {
        var E = v(t, a);
        if (E) {
          xh(e, E, i, u);
          return;
        }
      }
      g && g(t, p, a), t === "focusout" && De(p);
    }
    function O() {
      $t("onMouseEnter", ["mouseout", "mouseover"]), $t("onMouseLeave", ["mouseout", "mouseover"]), $t("onPointerEnter", ["pointerout", "pointerover"]), $t("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function k(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !us(i)) {
        var g = i.relatedTarget || i.fromElement;
        if (g && (Gs(g) || Sp(g)))
          return;
      }
      if (!(!v && !p)) {
        var E;
        if (u.window === u)
          E = u;
        else {
          var _ = u.ownerDocument;
          _ ? E = _.defaultView || _.parentWindow : E = window;
        }
        var w, z;
        if (v) {
          var H = i.relatedTarget || i.toElement;
          if (w = a, z = H ? Gs(H) : null, z !== null) {
            var V = ma(z);
            (z !== V || z.tag !== le && z.tag !== ye) && (z = null);
          }
        } else
          w = null, z = a;
        if (w !== z) {
          var he = Kd, Ye = "onMouseLeave", ze = "onMouseEnter", wt = "mouse";
          (t === "pointerout" || t === "pointerover") && (he = mh, Ye = "onPointerLeave", ze = "onPointerEnter", wt = "pointer");
          var Ct = w == null ? E : _f(w), N = z == null ? E : _f(z), B = new he(Ye, wt + "leave", w, i, u);
          B.target = Ct, B.relatedTarget = N;
          var L = null, ee = Gs(u);
          if (ee === a) {
            var Ce = new he(ze, wt + "enter", z, i, u);
            Ce.target = N, Ce.relatedTarget = Ct, L = Ce;
          }
          iR(e, B, L, w, z);
        }
      }
    }
    function U(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var X = typeof Object.is == "function" ? Object.is : U;
    function ke(e, t) {
      if (X(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!Dr.call(t, s) || !X(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function $e(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function qe(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function tt(e, t) {
      for (var a = $e(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Wi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = $e(qe(a));
      }
    }
    function rr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return At(e, u, s, f, p);
    }
    function At(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, g = 0, E = e, _ = null;
      e: for (; ; ) {
        for (var w = null; E === t && (a === 0 || E.nodeType === Wi) && (f = s + a), E === i && (u === 0 || E.nodeType === Wi) && (p = s + u), E.nodeType === Wi && (s += E.nodeValue.length), (w = E.firstChild) !== null; )
          _ = E, E = w;
        for (; ; ) {
          if (E === e)
            break e;
          if (_ === t && ++v === a && (f = s), _ === i && ++g === u && (p = s), (w = E.nextSibling) !== null)
            break;
          E = _, _ = E.parentNode;
        }
        E = w;
      }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function $l(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var g = tt(e, f), E = tt(e, p);
        if (g && E) {
          if (u.rangeCount === 1 && u.anchorNode === g.node && u.anchorOffset === g.offset && u.focusNode === E.node && u.focusOffset === E.offset)
            return;
          var _ = a.createRange();
          _.setStart(g.node, g.offset), u.removeAllRanges(), f > p ? (u.addRange(_), u.extend(E.node, E.offset)) : (_.setEnd(E.node, E.offset), u.addRange(_));
        }
      }
    }
    function Rh(e) {
      return e && e.nodeType === Wi;
    }
    function US(e, t) {
      return !e || !t ? !1 : e === t ? !0 : Rh(e) ? !1 : Rh(t) ? US(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function Vx(e) {
      return e && e.ownerDocument && US(e.ownerDocument.documentElement, e);
    }
    function Bx(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function zS() {
      for (var e = window, t = Oa(); t instanceof e.HTMLIFrameElement; ) {
        if (Bx(t))
          e = t.contentWindow;
        else
          return t;
        t = Oa(e.document);
      }
      return t;
    }
    function Ly(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function Ix() {
      var e = zS();
      return {
        focusedElem: e,
        selectionRange: Ly(e) ? $x(e) : null
      };
    }
    function Yx(e) {
      var t = zS(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && Vx(a)) {
        i !== null && Ly(a) && Qx(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === Kr && u.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < u.length; f++) {
          var p = u[f];
          p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
        }
      }
    }
    function $x(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = rr(e), t || {
        start: 0,
        end: 0
      };
    }
    function Qx(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : $l(e, t);
    }
    var Wx = Mn && "documentMode" in document && document.documentMode <= 11;
    function Gx() {
      mt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var xf = null, My = null, lp = null, Uy = !1;
    function qx(e) {
      if ("selectionStart" in e && Ly(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function Kx(e) {
      return e.window === e ? e.document : e.nodeType === Gi ? e : e.ownerDocument;
    }
    function AS(e, t, a) {
      var i = Kx(a);
      if (!(Uy || xf == null || xf !== Oa(i))) {
        var u = qx(xf);
        if (!lp || !ke(lp, u)) {
          lp = u;
          var s = _h(My, "onSelect");
          if (s.length > 0) {
            var f = new Ui("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = xf;
          }
        }
      }
    }
    function Xx(e, t, a, i, u, s, f) {
      var p = a ? _f(a) : window;
      switch (t) {
        // Track the input node that has focus.
        case "focusin":
          (Ys(p) || p.contentEditable === "true") && (xf = p, My = a, lp = null);
          break;
        case "focusout":
          xf = null, My = null, lp = null;
          break;
        // Don't fire the event while the user is dragging. This matches the
        // semantics of the native select event.
        case "mousedown":
          Uy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Uy = !1, AS(e, i, u);
          break;
        // Chrome and IE fire non-standard event when selection is changed (and
        // sometimes when it hasn't). IE's event fires out of order with respect
        // to key and input events on deletion, so we discard it.
        //
        // Firefox doesn't support selectionchange, so check selection status
        // after each key entry. The selection changes after keydown and before
        // keyup, but we check on keydown as well in the case of holding down a
        // key, when multiple keydown events are fired but only one keyup is.
        // This is also our approach for IE handling, for the reason above.
        case "selectionchange":
          if (Wx)
            break;
        // falls through
        case "keydown":
        case "keyup":
          AS(e, i, u);
      }
    }
    function Th(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Rf = {
      animationend: Th("Animation", "AnimationEnd"),
      animationiteration: Th("Animation", "AnimationIteration"),
      animationstart: Th("Animation", "AnimationStart"),
      transitionend: Th("Transition", "TransitionEnd")
    }, zy = {}, jS = {};
    Mn && (jS = document.createElement("div").style, "AnimationEvent" in window || (delete Rf.animationend.animation, delete Rf.animationiteration.animation, delete Rf.animationstart.animation), "TransitionEvent" in window || delete Rf.transitionend.transition);
    function wh(e) {
      if (zy[e])
        return zy[e];
      if (!Rf[e])
        return e;
      var t = Rf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in jS)
          return zy[e] = t[a];
      return e;
    }
    var HS = wh("animationend"), FS = wh("animationiteration"), PS = wh("animationstart"), VS = wh("transitionend"), BS = /* @__PURE__ */ new Map(), IS = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function No(e, t) {
      BS.set(e, t), mt(t, [e]);
    }
    function Jx() {
      for (var e = 0; e < IS.length; e++) {
        var t = IS[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        No(a, "on" + i);
      }
      No(HS, "onAnimationEnd"), No(FS, "onAnimationIteration"), No(PS, "onAnimationStart"), No("dblclick", "onDoubleClick"), No("focusin", "onFocus"), No("focusout", "onBlur"), No(VS, "onTransitionEnd");
    }
    function Zx(e, t, a, i, u, s, f) {
      var p = BS.get(t);
      if (p !== void 0) {
        var v = Ui, g = t;
        switch (t) {
          case "keypress":
            if (Vl(i) === 0)
              return;
          /* falls through */
          case "keydown":
          case "keyup":
            v = hh;
            break;
          case "focusin":
            g = "focus", v = rl;
            break;
          case "focusout":
            g = "blur", v = rl;
            break;
          case "beforeblur":
          case "afterblur":
            v = rl;
            break;
          case "click":
            if (i.button === 2)
              return;
          /* falls through */
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          // TODO: Disabled elements should not respond to mouse events
          /* falls through */
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Kd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Au;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = gh;
            break;
          case HS:
          case FS:
          case PS:
            v = ch;
            break;
          case VS:
            v = Pa;
            break;
          case "scroll":
            v = la;
            break;
          case "wheel":
            v = _y;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = hf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = mh;
            break;
        }
        var E = (s & Na) !== 0;
        {
          var _ = !E && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", w = rR(a, p, i.type, E, _);
          if (w.length > 0) {
            var z = new v(p, g, null, i, u);
            e.push({
              event: z,
              listeners: w
            });
          }
        }
      }
    }
    Jx(), O(), $s(), Gx(), Dy();
    function eR(e, t, a, i, u, s, f) {
      Zx(e, t, a, i, u, s);
      var p = (s & Sd) === 0;
      p && (k(e, t, a, i, u), Nn(e, t, a, i, u), Xx(e, t, a, i, u), bh(e, t, a, i, u));
    }
    var up = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Ay = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(up));
    function YS(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ri(i, t, void 0, e), e.currentTarget = null;
    }
    function tR(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          YS(e, v, p), i = f;
        }
      else
        for (var g = 0; g < t.length; g++) {
          var E = t[g], _ = E.instance, w = E.currentTarget, z = E.listener;
          if (_ !== i && e.isPropagationStopped())
            return;
          YS(e, z, w), i = _;
        }
    }
    function $S(e, t) {
      for (var a = (t & Na) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        tR(s, f, a);
      }
      cs();
    }
    function nR(e, t, a, i, u) {
      var s = Ed(a), f = [];
      eR(f, e, i, a, s, t), $S(f, t);
    }
    function Cn(e, t) {
      Ay.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = LT(t), u = lR(e);
      i.has(u) || (QS(t, e, bc, a), i.add(u));
    }
    function jy(e, t, a) {
      Ay.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Na), QS(a, e, i, t);
    }
    var kh = "_reactListening" + Math.random().toString(36).slice(2);
    function op(e) {
      if (!e[kh]) {
        e[kh] = !0, ft.forEach(function(a) {
          a !== "selectionchange" && (Ay.has(a) || jy(a, !1, e), jy(a, !0, e));
        });
        var t = e.nodeType === Gi ? e : e.ownerDocument;
        t !== null && (t[kh] || (t[kh] = !0, jy("selectionchange", !1, t)));
      }
    }
    function QS(e, t, a, i, u) {
      var s = pr(e, t, a), f = void 0;
      ss && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? qd(e, t, s, f) : ia(e, t, s) : f !== void 0 ? ko(e, t, s, f) : Fs(e, t, s);
    }
    function WS(e, t) {
      return e === t || e.nodeType === zn && e.parentNode === t;
    }
    function Hy(e, t, a, i, u) {
      var s = i;
      if ((t & gd) === 0 && (t & bc) === 0) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === ne || v === me) {
              var g = p.stateNode.containerInfo;
              if (WS(g, f))
                break;
              if (v === me)
                for (var E = p.return; E !== null; ) {
                  var _ = E.tag;
                  if (_ === ne || _ === me) {
                    var w = E.stateNode.containerInfo;
                    if (WS(w, f))
                      return;
                  }
                  E = E.return;
                }
              for (; g !== null; ) {
                var z = Gs(g);
                if (z === null)
                  return;
                var H = z.tag;
                if (H === le || H === ye) {
                  p = s = z;
                  continue e;
                }
                g = g.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      zv(function() {
        return nR(e, t, a, s);
      });
    }
    function sp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function rR(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], g = e, E = null; g !== null; ) {
        var _ = g, w = _.stateNode, z = _.tag;
        if (z === le && w !== null && (E = w, p !== null)) {
          var H = _l(g, p);
          H != null && v.push(sp(g, H, E));
        }
        if (u)
          break;
        g = g.return;
      }
      return v;
    }
    function _h(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === le && f !== null) {
          var v = f, g = _l(u, a);
          g != null && i.unshift(sp(u, g, v));
          var E = _l(u, t);
          E != null && i.push(sp(u, E, v));
        }
        u = u.return;
      }
      return i;
    }
    function Tf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== le);
      return e || null;
    }
    function aR(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = Tf(s))
        u++;
      for (var f = 0, p = i; p; p = Tf(p))
        f++;
      for (; u - f > 0; )
        a = Tf(a), u--;
      for (; f - u > 0; )
        i = Tf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Tf(a), i = Tf(i);
      }
      return null;
    }
    function GS(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, g = v.alternate, E = v.stateNode, _ = v.tag;
        if (g !== null && g === i)
          break;
        if (_ === le && E !== null) {
          var w = E;
          if (u) {
            var z = _l(p, s);
            z != null && f.unshift(sp(p, z, w));
          } else if (!u) {
            var H = _l(p, s);
            H != null && f.push(sp(p, H, w));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function iR(e, t, a, i, u) {
      var s = i && u ? aR(i, u) : null;
      i !== null && GS(e, t, i, s, !1), u !== null && a !== null && GS(e, a, u, s, !0);
    }
    function lR(e, t) {
      return e + "__bubble";
    }
    var Va = !1, cp = "dangerouslySetInnerHTML", Dh = "suppressContentEditableWarning", Lo = "suppressHydrationWarning", qS = "autoFocus", Qs = "children", Ws = "style", Oh = "__html", Fy, Nh, fp, KS, Lh, XS, JS;
    Fy = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Nh = function(e, t) {
      hd(e, t), Ec(e, t), Lv(e, t, {
        registrationNameDependencies: st,
        possibleRegistrationNames: dt
      });
    }, XS = Mn && !document.documentMode, fp = function(e, t, a) {
      if (!Va) {
        var i = Mh(a), u = Mh(t);
        u !== i && (Va = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, KS = function(e) {
      if (!Va) {
        Va = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, Lh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, JS = function(e, t) {
      var a = e.namespaceURI === Qi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var uR = /\r\n?/g, oR = /\u0000|\uFFFD/g;
    function Mh(e) {
      Jn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(uR, `
`).replace(oR, "");
    }
    function Uh(e, t, a, i) {
      var u = Mh(t), s = Mh(e);
      if (s !== u && (i && (Va || (Va = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Oe))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function ZS(e) {
      return e.nodeType === Gi ? e : e.ownerDocument;
    }
    function sR() {
    }
    function zh(e) {
      e.onclick = sR;
    }
    function cR(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Ws)
            f && Object.freeze(f), wv(t, f);
          else if (s === cp) {
            var p = f ? f[Oh] : void 0;
            p != null && vv(t, p);
          } else if (s === Qs)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && oo(t, f);
            } else typeof f == "number" && oo(t, "" + f);
          else s === Dh || s === Lo || s === qS || (st.hasOwnProperty(s) ? f != null && (typeof f != "function" && Lh(s, f), s === "onScroll" && Cn("scroll", t)) : f != null && Or(t, s, f, u));
        }
    }
    function fR(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Ws ? wv(e, f) : s === cp ? vv(e, f) : s === Qs ? oo(e, f) : Or(e, s, f, i);
      }
    }
    function dR(e, t, a, i) {
      var u, s = ZS(a), f, p = i;
      if (p === Qi && (p = od(e)), p === Qi) {
        if (u = wl(e, t), !u && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var g = v.firstChild;
          f = v.removeChild(g);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var E = f;
          t.multiple ? E.multiple = !0 : t.size && (E.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Qi && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !Dr.call(Fy, e) && (Fy[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function pR(e, t) {
      return ZS(t).createTextNode(e);
    }
    function vR(e, t, a, i) {
      var u = wl(t, a);
      Nh(t, a);
      var s;
      switch (t) {
        case "dialog":
          Cn("cancel", e), Cn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Cn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < up.length; f++)
            Cn(up[f], e);
          s = a;
          break;
        case "source":
          Cn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          Cn("error", e), Cn("load", e), s = a;
          break;
        case "details":
          Cn("toggle", e), s = a;
          break;
        case "input":
          ri(e, a), s = uo(e, a), Cn("invalid", e);
          break;
        case "option":
          _t(e, a), s = a;
          break;
        case "select":
          du(e, a), s = es(e, a), Cn("invalid", e);
          break;
        case "textarea":
          id(e, a), s = ad(e, a), Cn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (gc(t, s), cR(t, e, i, s, u), t) {
        case "input":
          ni(e), A(e, a, !1);
          break;
        case "textarea":
          ni(e), dv(e);
          break;
        case "option":
          ln(e, a);
          break;
        case "select":
          nd(e, a);
          break;
        default:
          typeof s.onClick == "function" && zh(e);
          break;
      }
    }
    function hR(e, t, a, i, u) {
      Nh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = uo(e, a), p = uo(e, i), s = [];
          break;
        case "select":
          f = es(e, a), p = es(e, i), s = [];
          break;
        case "textarea":
          f = ad(e, a), p = ad(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && zh(e);
          break;
      }
      gc(t, p);
      var v, g, E = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Ws) {
            var _ = f[v];
            for (g in _)
              _.hasOwnProperty(g) && (E || (E = {}), E[g] = "");
          } else v === cp || v === Qs || v === Dh || v === Lo || v === qS || (st.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var w = p[v], z = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || w === z || w == null && z == null))
          if (v === Ws)
            if (w && Object.freeze(w), z) {
              for (g in z)
                z.hasOwnProperty(g) && (!w || !w.hasOwnProperty(g)) && (E || (E = {}), E[g] = "");
              for (g in w)
                w.hasOwnProperty(g) && z[g] !== w[g] && (E || (E = {}), E[g] = w[g]);
            } else
              E || (s || (s = []), s.push(v, E)), E = w;
          else if (v === cp) {
            var H = w ? w[Oh] : void 0, V = z ? z[Oh] : void 0;
            H != null && V !== H && (s = s || []).push(v, H);
          } else v === Qs ? (typeof w == "string" || typeof w == "number") && (s = s || []).push(v, "" + w) : v === Dh || v === Lo || (st.hasOwnProperty(v) ? (w != null && (typeof w != "function" && Lh(v, w), v === "onScroll" && Cn("scroll", e)), !s && z !== w && (s = [])) : (s = s || []).push(v, w));
      }
      return E && (dy(E, p[Ws]), (s = s || []).push(Ws, E)), s;
    }
    function mR(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = wl(a, i), f = wl(a, u);
      switch (fR(e, t, s, f), a) {
        case "input":
          b(e, u);
          break;
        case "textarea":
          fv(e, u);
          break;
        case "select":
          hc(e, u);
          break;
      }
    }
    function yR(e) {
      {
        var t = e.toLowerCase();
        return is.hasOwnProperty(t) && is[t] || null;
      }
    }
    function gR(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = wl(t, a), Nh(t, a), t) {
        case "dialog":
          Cn("cancel", e), Cn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Cn("load", e);
          break;
        case "video":
        case "audio":
          for (var g = 0; g < up.length; g++)
            Cn(up[g], e);
          break;
        case "source":
          Cn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Cn("error", e), Cn("load", e);
          break;
        case "details":
          Cn("toggle", e);
          break;
        case "input":
          ri(e, a), Cn("invalid", e);
          break;
        case "option":
          _t(e, a);
          break;
        case "select":
          du(e, a), Cn("invalid", e);
          break;
        case "textarea":
          id(e, a), Cn("invalid", e);
          break;
      }
      gc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var E = e.attributes, _ = 0; _ < E.length; _++) {
          var w = E[_].name.toLowerCase();
          switch (w) {
            // Controlled attributes are not validated
            // TODO: Only ignore them on controlled tags.
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(E[_].name);
          }
        }
      }
      var z = null;
      for (var H in a)
        if (a.hasOwnProperty(H)) {
          var V = a[H];
          if (H === Qs)
            typeof V == "string" ? e.textContent !== V && (a[Lo] !== !0 && Uh(e.textContent, V, s, f), z = [Qs, V]) : typeof V == "number" && e.textContent !== "" + V && (a[Lo] !== !0 && Uh(e.textContent, V, s, f), z = [Qs, "" + V]);
          else if (st.hasOwnProperty(H))
            V != null && (typeof V != "function" && Lh(H, V), H === "onScroll" && Cn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var he = void 0, Ye = rn(H);
            if (a[Lo] !== !0) {
              if (!(H === Dh || H === Lo || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              H === "value" || H === "checked" || H === "selected")) {
                if (H === cp) {
                  var ze = e.innerHTML, wt = V ? V[Oh] : void 0;
                  if (wt != null) {
                    var Ct = JS(e, wt);
                    Ct !== ze && fp(H, ze, Ct);
                  }
                } else if (H === Ws) {
                  if (v.delete(H), XS) {
                    var N = cy(V);
                    he = e.getAttribute("style"), N !== he && fp(H, he, N);
                  }
                } else if (p && !D)
                  v.delete(H.toLowerCase()), he = iu(e, H, V), V !== he && fp(H, he, V);
                else if (!mn(H, Ye, p) && !Zn(H, V, Ye, p)) {
                  var B = !1;
                  if (Ye !== null)
                    v.delete(Ye.attributeName), he = yl(e, H, V, Ye);
                  else {
                    var L = i;
                    if (L === Qi && (L = od(t)), L === Qi)
                      v.delete(H.toLowerCase());
                    else {
                      var ee = yR(H);
                      ee !== null && ee !== H && (B = !0, v.delete(ee)), v.delete(H);
                    }
                    he = iu(e, H, V);
                  }
                  var Ce = D;
                  !Ce && V !== he && !B && fp(H, he, V);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[Lo] !== !0 && KS(v), t) {
        case "input":
          ni(e), A(e, a, !0);
          break;
        case "textarea":
          ni(e), dv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && zh(e);
          break;
      }
      return z;
    }
    function SR(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Py(e, t) {
      {
        if (Va)
          return;
        Va = !0, S("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Vy(e, t) {
      {
        if (Va)
          return;
        Va = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function By(e, t, a) {
      {
        if (Va)
          return;
        Va = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Iy(e, t) {
      {
        if (t === "" || Va)
          return;
        Va = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function ER(e, t, a) {
      switch (t) {
        case "input":
          F(e, a);
          return;
        case "textarea":
          ly(e, a);
          return;
        case "select":
          rd(e, a);
          return;
      }
    }
    var dp = function() {
    }, pp = function() {
    };
    {
      var CR = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], eE = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], bR = eE.concat(["button"]), xR = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], tE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      pp = function(e, t) {
        var a = ct({}, e || tE), i = {
          tag: t
        };
        return eE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), bR.indexOf(t) !== -1 && (a.pTagInButtonScope = null), CR.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var RR = function(e, t) {
        switch (t) {
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
          // but
          case "option":
            return e === "#text";
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
          // No special behavior since these rules fall back to "in body" mode for
          // all except special table nodes which cause bad parsing behavior anyway.
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
          case "colgroup":
            return e === "col" || e === "template";
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return xR.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, TR = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, nE = {};
      dp = function(e, t, a) {
        a = a || tE;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = RR(e, u) ? null : i, f = s ? null : TR(e, a), p = s || f;
        if (p) {
          var v = p.tag, g = !!s + "|" + e + "|" + v;
          if (!nE[g]) {
            nE[g] = !0;
            var E = e, _ = "";
            if (e === "#text" ? /\S/.test(t) ? E = "Text nodes" : (E = "Whitespace text nodes", _ = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : E = "<" + e + ">", s) {
              var w = "";
              v === "table" && e === "tr" && (w += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), S("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", E, v, _, w);
            } else
              S("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", E, v);
          }
        }
      };
    }
    var Ah = "suppressHydrationWarning", jh = "$", Hh = "/$", vp = "$?", hp = "$!", wR = "style", Yy = null, $y = null;
    function kR(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Gi:
        case cd: {
          t = i === Gi ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : sd(null, "");
          break;
        }
        default: {
          var s = i === zn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = sd(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = pp(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function _R(e, t, a) {
      {
        var i = e, u = sd(i.namespace, t), s = pp(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function gD(e) {
      return e;
    }
    function DR(e) {
      Yy = Vn(), $y = Ix();
      var t = null;
      return Kn(!1), t;
    }
    function OR(e) {
      Yx($y), Kn(Yy), Yy = null, $y = null;
    }
    function NR(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (dp(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = pp(f.ancestorInfo, e);
          dp(null, p, v);
        }
        s = f.namespace;
      }
      var g = dR(e, t, a, s);
      return gp(u, g), Zy(g, t), g;
    }
    function LR(e, t) {
      e.appendChild(t);
    }
    function MR(e, t, a, i, u) {
      switch (vR(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function UR(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = pp(f.ancestorInfo, t);
          dp(null, p, v);
        }
      }
      return hR(e, t, a, i);
    }
    function Qy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function zR(e, t, a, i) {
      {
        var u = a;
        dp(null, e, u.ancestorInfo);
      }
      var s = pR(e, t);
      return gp(i, s), s;
    }
    function AR() {
      var e = window.event;
      return e === void 0 ? ja : df(e.type);
    }
    var Wy = typeof setTimeout == "function" ? setTimeout : void 0, jR = typeof clearTimeout == "function" ? clearTimeout : void 0, Gy = -1, rE = typeof Promise == "function" ? Promise : void 0, HR = typeof queueMicrotask == "function" ? queueMicrotask : typeof rE < "u" ? function(e) {
      return rE.resolve(null).then(e).catch(FR);
    } : Wy;
    function FR(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function PR(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function VR(e, t, a, i, u, s) {
      mR(e, t, a, i, u), Zy(e, u);
    }
    function aE(e) {
      oo(e, "");
    }
    function BR(e, t, a) {
      e.nodeValue = a;
    }
    function IR(e, t) {
      e.appendChild(t);
    }
    function YR(e, t) {
      var a;
      e.nodeType === zn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && zh(a);
    }
    function $R(e, t, a) {
      e.insertBefore(t, a);
    }
    function QR(e, t, a) {
      e.nodeType === zn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function WR(e, t) {
      e.removeChild(t);
    }
    function GR(e, t) {
      e.nodeType === zn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function qy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === zn) {
          var s = u.data;
          if (s === Hh)
            if (i === 0) {
              e.removeChild(u), Mu(t);
              return;
            } else
              i--;
          else (s === jh || s === vp || s === hp) && i++;
        }
        a = u;
      } while (a);
      Mu(t);
    }
    function qR(e, t) {
      e.nodeType === zn ? qy(e.parentNode, t) : e.nodeType === Kr && qy(e, t), Mu(e);
    }
    function KR(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function XR(e) {
      e.nodeValue = "";
    }
    function JR(e, t) {
      e = e;
      var a = t[wR], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = yc("display", i);
    }
    function ZR(e, t) {
      e.nodeValue = t;
    }
    function eT(e) {
      e.nodeType === Kr ? e.textContent = "" : e.nodeType === Gi && e.documentElement && e.removeChild(e.documentElement);
    }
    function tT(e, t, a) {
      return e.nodeType !== Kr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function nT(e, t) {
      return t === "" || e.nodeType !== Wi ? null : e;
    }
    function rT(e) {
      return e.nodeType !== zn ? null : e;
    }
    function iE(e) {
      return e.data === vp;
    }
    function Ky(e) {
      return e.data === hp;
    }
    function aT(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function iT(e, t) {
      e._reactRetry = t;
    }
    function Fh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Kr || t === Wi)
          break;
        if (t === zn) {
          var a = e.data;
          if (a === jh || a === hp || a === vp)
            break;
          if (a === Hh)
            return null;
        }
      }
      return e;
    }
    function mp(e) {
      return Fh(e.nextSibling);
    }
    function lT(e) {
      return Fh(e.firstChild);
    }
    function uT(e) {
      return Fh(e.firstChild);
    }
    function oT(e) {
      return Fh(e.nextSibling);
    }
    function sT(e, t, a, i, u, s, f) {
      gp(s, e), Zy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var g = (s.mode & gt) !== Pe;
      return gR(e, t, a, p, i, g, f);
    }
    function cT(e, t, a, i) {
      return gp(a, e), a.mode & gt, SR(e, t);
    }
    function fT(e, t) {
      gp(t, e);
    }
    function dT(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === zn) {
          var i = t.data;
          if (i === Hh) {
            if (a === 0)
              return mp(t);
            a--;
          } else (i === jh || i === hp || i === vp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function lE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === zn) {
          var i = t.data;
          if (i === jh || i === hp || i === vp) {
            if (a === 0)
              return t;
            a--;
          } else i === Hh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function pT(e) {
      Mu(e);
    }
    function vT(e) {
      Mu(e);
    }
    function hT(e) {
      return e !== "head" && e !== "body";
    }
    function mT(e, t, a, i) {
      var u = !0;
      Uh(t.nodeValue, a, i, u);
    }
    function yT(e, t, a, i, u, s) {
      if (t[Ah] !== !0) {
        var f = !0;
        Uh(i.nodeValue, u, s, f);
      }
    }
    function gT(e, t) {
      t.nodeType === Kr ? Py(e, t) : t.nodeType === zn || Vy(e, t);
    }
    function ST(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Kr ? Py(a, t) : t.nodeType === zn || Vy(a, t));
      }
    }
    function ET(e, t, a, i, u) {
      (u || t[Ah] !== !0) && (i.nodeType === Kr ? Py(a, i) : i.nodeType === zn || Vy(a, i));
    }
    function CT(e, t, a) {
      By(e, t);
    }
    function bT(e, t) {
      Iy(e, t);
    }
    function xT(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && By(i, t);
      }
    }
    function RT(e, t) {
      {
        var a = e.parentNode;
        a !== null && Iy(a, t);
      }
    }
    function TT(e, t, a, i, u, s) {
      (s || t[Ah] !== !0) && By(a, i);
    }
    function wT(e, t, a, i, u) {
      (u || t[Ah] !== !0) && Iy(a, i);
    }
    function kT(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function _T(e) {
      op(e);
    }
    var wf = Math.random().toString(36).slice(2), kf = "__reactFiber$" + wf, Xy = "__reactProps$" + wf, yp = "__reactContainer$" + wf, Jy = "__reactEvents$" + wf, DT = "__reactListeners$" + wf, OT = "__reactHandles$" + wf;
    function NT(e) {
      delete e[kf], delete e[Xy], delete e[Jy], delete e[DT], delete e[OT];
    }
    function gp(e, t) {
      t[kf] = e;
    }
    function Ph(e, t) {
      t[yp] = e;
    }
    function uE(e) {
      e[yp] = null;
    }
    function Sp(e) {
      return !!e[yp];
    }
    function Gs(e) {
      var t = e[kf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[yp] || a[kf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = lE(e); u !== null; ) {
              var s = u[kf];
              if (s)
                return s;
              u = lE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Mo(e) {
      var t = e[kf] || e[yp];
      return t && (t.tag === le || t.tag === ye || t.tag === Te || t.tag === ne) ? t : null;
    }
    function _f(e) {
      if (e.tag === le || e.tag === ye)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Vh(e) {
      return e[Xy] || null;
    }
    function Zy(e, t) {
      e[Xy] = t;
    }
    function LT(e) {
      var t = e[Jy];
      return t === void 0 && (t = e[Jy] = /* @__PURE__ */ new Set()), t;
    }
    var oE = {}, sE = x.ReactDebugCurrentFrame;
    function Bh(e) {
      if (e) {
        var t = e._owner, a = Ii(e.type, e._source, t ? t.type : null);
        sE.setExtraStackFrame(a);
      } else
        sE.setExtraStackFrame(null);
    }
    function il(e, t, a, i, u) {
      {
        var s = Function.call.bind(Dr);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (g) {
              p = g;
            }
            p && !(p instanceof Error) && (Bh(u), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), Bh(null)), p instanceof Error && !(p.message in oE) && (oE[p.message] = !0, Bh(u), S("Failed %s type: %s", a, p.message), Bh(null));
          }
      }
    }
    var eg = [], Ih;
    Ih = [];
    var Fu = -1;
    function Uo(e) {
      return {
        current: e
      };
    }
    function ua(e, t) {
      if (Fu < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== Ih[Fu] && S("Unexpected Fiber popped."), e.current = eg[Fu], eg[Fu] = null, Ih[Fu] = null, Fu--;
    }
    function oa(e, t, a) {
      Fu++, eg[Fu] = e.current, Ih[Fu] = a, e.current = t;
    }
    var tg;
    tg = {};
    var ci = {};
    Object.freeze(ci);
    var Pu = Uo(ci), Ql = Uo(!1), ng = ci;
    function Df(e, t, a) {
      return a && Wl(t) ? ng : Pu.current;
    }
    function cE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Of(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return ci;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = nt(e) || "Unknown";
          il(i, s, "context", p);
        }
        return u && cE(e, t, s), s;
      }
    }
    function Yh() {
      return Ql.current;
    }
    function Wl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function $h(e) {
      ua(Ql, e), ua(Pu, e);
    }
    function rg(e) {
      ua(Ql, e), ua(Pu, e);
    }
    function fE(e, t, a) {
      {
        if (Pu.current !== ci)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        oa(Pu, t, e), oa(Ql, a, e);
      }
    }
    function dE(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = nt(e) || "Unknown";
            tg[s] || (tg[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((nt(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = nt(e) || "Unknown";
          il(u, f, "child context", v);
        }
        return ct({}, a, f);
      }
    }
    function Qh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ci;
        return ng = Pu.current, oa(Pu, a, e), oa(Ql, Ql.current, e), !0;
      }
    }
    function pE(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = dE(e, t, ng);
          i.__reactInternalMemoizedMergedChildContext = u, ua(Ql, e), ua(Pu, e), oa(Pu, u, e), oa(Ql, a, e);
        } else
          ua(Ql, e), oa(Ql, a, e);
      }
    }
    function MT(e) {
      {
        if (!Su(e) || e.tag !== Q)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case ne:
              return t.stateNode.context;
            case Q: {
              var a = t.type;
              if (Wl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var zo = 0, Wh = 1, Vu = null, ag = !1, ig = !1;
    function vE(e) {
      Vu === null ? Vu = [e] : Vu.push(e);
    }
    function UT(e) {
      ag = !0, vE(e);
    }
    function hE() {
      ag && Ao();
    }
    function Ao() {
      if (!ig && Vu !== null) {
        ig = !0;
        var e = 0, t = Fa();
        try {
          var a = !0, i = Vu;
          for (Pn(zr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Vu = null, ag = !1;
        } catch (s) {
          throw Vu !== null && (Vu = Vu.slice(e + 1)), bd(ps, Ao), s;
        } finally {
          Pn(t), ig = !1;
        }
      }
      return null;
    }
    var Nf = [], Lf = 0, Gh = null, qh = 0, zi = [], Ai = 0, qs = null, Bu = 1, Iu = "";
    function zT(e) {
      return Xs(), (e.flags & Ti) !== Fe;
    }
    function AT(e) {
      return Xs(), qh;
    }
    function jT() {
      var e = Iu, t = Bu, a = t & ~HT(t);
      return a.toString(32) + e;
    }
    function Ks(e, t) {
      Xs(), Nf[Lf++] = qh, Nf[Lf++] = Gh, Gh = e, qh = t;
    }
    function mE(e, t, a) {
      Xs(), zi[Ai++] = Bu, zi[Ai++] = Iu, zi[Ai++] = qs, qs = e;
      var i = Bu, u = Iu, s = Kh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Kh(t) + s;
      if (v > 30) {
        var g = s - s % 5, E = (1 << g) - 1, _ = (f & E).toString(32), w = f >> g, z = s - g, H = Kh(t) + z, V = p << z, he = V | w, Ye = _ + u;
        Bu = 1 << H | he, Iu = Ye;
      } else {
        var ze = p << s, wt = ze | f, Ct = u;
        Bu = 1 << v | wt, Iu = Ct;
      }
    }
    function lg(e) {
      Xs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Ks(e, a), mE(e, a, i);
      }
    }
    function Kh(e) {
      return 32 - Hn(e);
    }
    function HT(e) {
      return 1 << Kh(e) - 1;
    }
    function ug(e) {
      for (; e === Gh; )
        Gh = Nf[--Lf], Nf[Lf] = null, qh = Nf[--Lf], Nf[Lf] = null;
      for (; e === qs; )
        qs = zi[--Ai], zi[Ai] = null, Iu = zi[--Ai], zi[Ai] = null, Bu = zi[--Ai], zi[Ai] = null;
    }
    function FT() {
      return Xs(), qs !== null ? {
        id: Bu,
        overflow: Iu
      } : null;
    }
    function PT(e, t) {
      Xs(), zi[Ai++] = Bu, zi[Ai++] = Iu, zi[Ai++] = qs, Bu = t.id, Iu = t.overflow, qs = e;
    }
    function Xs() {
      Pr() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Fr = null, ji = null, ll = !1, Js = !1, jo = null;
    function VT() {
      ll && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function yE() {
      Js = !0;
    }
    function BT() {
      return Js;
    }
    function IT(e) {
      var t = e.stateNode.containerInfo;
      return ji = uT(t), Fr = e, ll = !0, jo = null, Js = !1, !0;
    }
    function YT(e, t, a) {
      return ji = oT(t), Fr = e, ll = !0, jo = null, Js = !1, a !== null && PT(e, a), !0;
    }
    function gE(e, t) {
      switch (e.tag) {
        case ne: {
          gT(e.stateNode.containerInfo, t);
          break;
        }
        case le: {
          var a = (e.mode & gt) !== Pe;
          ET(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case Te: {
          var i = e.memoizedState;
          i.dehydrated !== null && ST(i.dehydrated, t);
          break;
        }
      }
    }
    function SE(e, t) {
      gE(e, t);
      var a = Gk();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= La) : i.push(a);
    }
    function og(e, t) {
      {
        if (Js)
          return;
        switch (e.tag) {
          case ne: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case le:
                var i = t.type;
                t.pendingProps, CT(a, i);
                break;
              case ye:
                var u = t.pendingProps;
                bT(a, u);
                break;
            }
            break;
          }
          case le: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case le: {
                var v = t.type, g = t.pendingProps, E = (e.mode & gt) !== Pe;
                TT(
                  s,
                  f,
                  p,
                  v,
                  g,
                  // TODO: Delete this argument when we remove the legacy root API.
                  E
                );
                break;
              }
              case ye: {
                var _ = t.pendingProps, w = (e.mode & gt) !== Pe;
                wT(
                  s,
                  f,
                  p,
                  _,
                  // TODO: Delete this argument when we remove the legacy root API.
                  w
                );
                break;
              }
            }
            break;
          }
          case Te: {
            var z = e.memoizedState, H = z.dehydrated;
            if (H !== null) switch (t.tag) {
              case le:
                var V = t.type;
                t.pendingProps, xT(H, V);
                break;
              case ye:
                var he = t.pendingProps;
                RT(H, he);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function EE(e, t) {
      t.flags = t.flags & ~Jr | gn, og(e, t);
    }
    function CE(e, t) {
      switch (e.tag) {
        case le: {
          var a = e.type;
          e.pendingProps;
          var i = tT(t, a);
          return i !== null ? (e.stateNode = i, Fr = e, ji = lT(i), !0) : !1;
        }
        case ye: {
          var u = e.pendingProps, s = nT(t, u);
          return s !== null ? (e.stateNode = s, Fr = e, ji = null, !0) : !1;
        }
        case Te: {
          var f = rT(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: FT(),
              retryLane: na
            };
            e.memoizedState = p;
            var v = qk(f);
            return v.return = e, e.child = v, Fr = e, ji = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function sg(e) {
      return (e.mode & gt) !== Pe && (e.flags & Ae) === Fe;
    }
    function cg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function fg(e) {
      if (ll) {
        var t = ji;
        if (!t) {
          sg(e) && (og(Fr, e), cg()), EE(Fr, e), ll = !1, Fr = e;
          return;
        }
        var a = t;
        if (!CE(e, t)) {
          sg(e) && (og(Fr, e), cg()), t = mp(a);
          var i = Fr;
          if (!t || !CE(e, t)) {
            EE(Fr, e), ll = !1, Fr = e;
            return;
          }
          SE(i, a);
        }
      }
    }
    function $T(e, t, a) {
      var i = e.stateNode, u = !Js, s = sT(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function QT(e) {
      var t = e.stateNode, a = e.memoizedProps, i = cT(t, a, e);
      if (i) {
        var u = Fr;
        if (u !== null)
          switch (u.tag) {
            case ne: {
              var s = u.stateNode.containerInfo, f = (u.mode & gt) !== Pe;
              mT(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case le: {
              var p = u.type, v = u.memoizedProps, g = u.stateNode, E = (u.mode & gt) !== Pe;
              yT(
                p,
                v,
                g,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                E
              );
              break;
            }
          }
      }
      return i;
    }
    function WT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      fT(a, e);
    }
    function GT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return dT(a);
    }
    function bE(e) {
      for (var t = e.return; t !== null && t.tag !== le && t.tag !== ne && t.tag !== Te; )
        t = t.return;
      Fr = t;
    }
    function Xh(e) {
      if (e !== Fr)
        return !1;
      if (!ll)
        return bE(e), ll = !0, !1;
      if (e.tag !== ne && (e.tag !== le || hT(e.type) && !Qy(e.type, e.memoizedProps))) {
        var t = ji;
        if (t)
          if (sg(e))
            xE(e), cg();
          else
            for (; t; )
              SE(e, t), t = mp(t);
      }
      return bE(e), e.tag === Te ? ji = GT(e) : ji = Fr ? mp(e.stateNode) : null, !0;
    }
    function qT() {
      return ll && ji !== null;
    }
    function xE(e) {
      for (var t = ji; t; )
        gE(e, t), t = mp(t);
    }
    function Mf() {
      Fr = null, ji = null, ll = !1, Js = !1;
    }
    function RE() {
      jo !== null && (yb(jo), jo = null);
    }
    function Pr() {
      return ll;
    }
    function dg(e) {
      jo === null ? jo = [e] : jo.push(e);
    }
    var KT = x.ReactCurrentBatchConfig, XT = null;
    function JT() {
      return KT.transition;
    }
    var ul = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var ZT = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Xt && (t = a), a = a.return;
        return t;
      }, Zs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, Ep = [], Cp = [], bp = [], xp = [], Rp = [], Tp = [], ec = /* @__PURE__ */ new Set();
      ul.recordUnsafeLifecycleWarnings = function(e, t) {
        ec.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && Ep.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillMount == "function" && Cp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && bp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillReceiveProps == "function" && xp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Rp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillUpdate == "function" && Tp.push(e));
      }, ul.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        Ep.length > 0 && (Ep.forEach(function(w) {
          e.add(nt(w) || "Component"), ec.add(w.type);
        }), Ep = []);
        var t = /* @__PURE__ */ new Set();
        Cp.length > 0 && (Cp.forEach(function(w) {
          t.add(nt(w) || "Component"), ec.add(w.type);
        }), Cp = []);
        var a = /* @__PURE__ */ new Set();
        bp.length > 0 && (bp.forEach(function(w) {
          a.add(nt(w) || "Component"), ec.add(w.type);
        }), bp = []);
        var i = /* @__PURE__ */ new Set();
        xp.length > 0 && (xp.forEach(function(w) {
          i.add(nt(w) || "Component"), ec.add(w.type);
        }), xp = []);
        var u = /* @__PURE__ */ new Set();
        Rp.length > 0 && (Rp.forEach(function(w) {
          u.add(nt(w) || "Component"), ec.add(w.type);
        }), Rp = []);
        var s = /* @__PURE__ */ new Set();
        if (Tp.length > 0 && (Tp.forEach(function(w) {
          s.add(nt(w) || "Component"), ec.add(w.type);
        }), Tp = []), t.size > 0) {
          var f = Zs(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = Zs(i);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = Zs(s);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var g = Zs(e);
          Ne(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, g);
        }
        if (a.size > 0) {
          var E = Zs(a);
          Ne(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, E);
        }
        if (u.size > 0) {
          var _ = Zs(u);
          Ne(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, _);
        }
      };
      var Jh = /* @__PURE__ */ new Map(), TE = /* @__PURE__ */ new Set();
      ul.recordLegacyContextWarning = function(e, t) {
        var a = ZT(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!TE.has(e.type)) {
          var i = Jh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Jh.set(a, i)), i.push(e));
        }
      }, ul.flushLegacyContextWarning = function() {
        Jh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(nt(s) || "Component"), TE.add(s.type);
            });
            var u = Zs(i);
            try {
              Gt(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              fn();
            }
          }
        });
      }, ul.discardPendingWarnings = function() {
        Ep = [], Cp = [], bp = [], xp = [], Rp = [], Tp = [], Jh = /* @__PURE__ */ new Map();
      };
    }
    var pg, vg, hg, mg, yg, wE = function(e, t) {
    };
    pg = !1, vg = !1, hg = {}, mg = {}, yg = {}, wE = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = nt(t) || "Component";
        mg[a] || (mg[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function e1(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function wp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Xt || I) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== Q) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !e1(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = nt(e) || "Component";
          hg[u] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), hg[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== Q)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          pi(i, "ref");
          var g = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === g)
            return t.ref;
          var E = function(_) {
            var w = v.refs;
            _ === null ? delete w[g] : w[g] = _;
          };
          return E._stringRef = g, E;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function Zh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function em(e) {
      {
        var t = nt(e) || "Component";
        if (yg[t])
          return;
        yg[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function kE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function _E(e) {
      function t(N, B) {
        if (e) {
          var L = N.deletions;
          L === null ? (N.deletions = [B], N.flags |= La) : L.push(B);
        }
      }
      function a(N, B) {
        if (!e)
          return null;
        for (var L = B; L !== null; )
          t(N, L), L = L.sibling;
        return null;
      }
      function i(N, B) {
        for (var L = /* @__PURE__ */ new Map(), ee = B; ee !== null; )
          ee.key !== null ? L.set(ee.key, ee) : L.set(ee.index, ee), ee = ee.sibling;
        return L;
      }
      function u(N, B) {
        var L = sc(N, B);
        return L.index = 0, L.sibling = null, L;
      }
      function s(N, B, L) {
        if (N.index = L, !e)
          return N.flags |= Ti, B;
        var ee = N.alternate;
        if (ee !== null) {
          var Ce = ee.index;
          return Ce < B ? (N.flags |= gn, B) : Ce;
        } else
          return N.flags |= gn, B;
      }
      function f(N) {
        return e && N.alternate === null && (N.flags |= gn), N;
      }
      function p(N, B, L, ee) {
        if (B === null || B.tag !== ye) {
          var Ce = dS(L, N.mode, ee);
          return Ce.return = N, Ce;
        } else {
          var ge = u(B, L);
          return ge.return = N, ge;
        }
      }
      function v(N, B, L, ee) {
        var Ce = L.type;
        if (Ce === hi)
          return E(N, B, L.props.children, ee, L.key);
        if (B !== null && (B.elementType === Ce || // Keep this check inline so it only runs on the false path:
        Mb(B, L) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Ce == "object" && Ce !== null && Ce.$$typeof === rt && kE(Ce) === B.type)) {
          var ge = u(B, L.props);
          return ge.ref = wp(N, B, L), ge.return = N, ge._debugSource = L._source, ge._debugOwner = L._owner, ge;
        }
        var et = fS(L, N.mode, ee);
        return et.ref = wp(N, B, L), et.return = N, et;
      }
      function g(N, B, L, ee) {
        if (B === null || B.tag !== me || B.stateNode.containerInfo !== L.containerInfo || B.stateNode.implementation !== L.implementation) {
          var Ce = pS(L, N.mode, ee);
          return Ce.return = N, Ce;
        } else {
          var ge = u(B, L.children || []);
          return ge.return = N, ge;
        }
      }
      function E(N, B, L, ee, Ce) {
        if (B === null || B.tag !== Le) {
          var ge = Go(L, N.mode, ee, Ce);
          return ge.return = N, ge;
        } else {
          var et = u(B, L);
          return et.return = N, et;
        }
      }
      function _(N, B, L) {
        if (typeof B == "string" && B !== "" || typeof B == "number") {
          var ee = dS("" + B, N.mode, L);
          return ee.return = N, ee;
        }
        if (typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case Nr: {
              var Ce = fS(B, N.mode, L);
              return Ce.ref = wp(N, null, B), Ce.return = N, Ce;
            }
            case ur: {
              var ge = pS(B, N.mode, L);
              return ge.return = N, ge;
            }
            case rt: {
              var et = B._payload, it = B._init;
              return _(N, it(et), L);
            }
          }
          if (vt(B) || ut(B)) {
            var Zt = Go(B, N.mode, L, null);
            return Zt.return = N, Zt;
          }
          Zh(N, B);
        }
        return typeof B == "function" && em(N), null;
      }
      function w(N, B, L, ee) {
        var Ce = B !== null ? B.key : null;
        if (typeof L == "string" && L !== "" || typeof L == "number")
          return Ce !== null ? null : p(N, B, "" + L, ee);
        if (typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case Nr:
              return L.key === Ce ? v(N, B, L, ee) : null;
            case ur:
              return L.key === Ce ? g(N, B, L, ee) : null;
            case rt: {
              var ge = L._payload, et = L._init;
              return w(N, B, et(ge), ee);
            }
          }
          if (vt(L) || ut(L))
            return Ce !== null ? null : E(N, B, L, ee, null);
          Zh(N, L);
        }
        return typeof L == "function" && em(N), null;
      }
      function z(N, B, L, ee, Ce) {
        if (typeof ee == "string" && ee !== "" || typeof ee == "number") {
          var ge = N.get(L) || null;
          return p(B, ge, "" + ee, Ce);
        }
        if (typeof ee == "object" && ee !== null) {
          switch (ee.$$typeof) {
            case Nr: {
              var et = N.get(ee.key === null ? L : ee.key) || null;
              return v(B, et, ee, Ce);
            }
            case ur: {
              var it = N.get(ee.key === null ? L : ee.key) || null;
              return g(B, it, ee, Ce);
            }
            case rt:
              var Zt = ee._payload, jt = ee._init;
              return z(N, B, L, jt(Zt), Ce);
          }
          if (vt(ee) || ut(ee)) {
            var Xn = N.get(L) || null;
            return E(B, Xn, ee, Ce, null);
          }
          Zh(B, ee);
        }
        return typeof ee == "function" && em(B), null;
      }
      function H(N, B, L) {
        {
          if (typeof N != "object" || N === null)
            return B;
          switch (N.$$typeof) {
            case Nr:
            case ur:
              wE(N, L);
              var ee = N.key;
              if (typeof ee != "string")
                break;
              if (B === null) {
                B = /* @__PURE__ */ new Set(), B.add(ee);
                break;
              }
              if (!B.has(ee)) {
                B.add(ee);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", ee);
              break;
            case rt:
              var Ce = N._payload, ge = N._init;
              H(ge(Ce), B, L);
              break;
          }
        }
        return B;
      }
      function V(N, B, L, ee) {
        for (var Ce = null, ge = 0; ge < L.length; ge++) {
          var et = L[ge];
          Ce = H(et, Ce, N);
        }
        for (var it = null, Zt = null, jt = B, Xn = 0, Ht = 0, In = null; jt !== null && Ht < L.length; Ht++) {
          jt.index > Ht ? (In = jt, jt = null) : In = jt.sibling;
          var ca = w(N, jt, L[Ht], ee);
          if (ca === null) {
            jt === null && (jt = In);
            break;
          }
          e && jt && ca.alternate === null && t(N, jt), Xn = s(ca, Xn, Ht), Zt === null ? it = ca : Zt.sibling = ca, Zt = ca, jt = In;
        }
        if (Ht === L.length) {
          if (a(N, jt), Pr()) {
            var Wr = Ht;
            Ks(N, Wr);
          }
          return it;
        }
        if (jt === null) {
          for (; Ht < L.length; Ht++) {
            var di = _(N, L[Ht], ee);
            di !== null && (Xn = s(di, Xn, Ht), Zt === null ? it = di : Zt.sibling = di, Zt = di);
          }
          if (Pr()) {
            var Ta = Ht;
            Ks(N, Ta);
          }
          return it;
        }
        for (var wa = i(N, jt); Ht < L.length; Ht++) {
          var fa = z(wa, N, Ht, L[Ht], ee);
          fa !== null && (e && fa.alternate !== null && wa.delete(fa.key === null ? Ht : fa.key), Xn = s(fa, Xn, Ht), Zt === null ? it = fa : Zt.sibling = fa, Zt = fa);
        }
        if (e && wa.forEach(function(Jf) {
          return t(N, Jf);
        }), Pr()) {
          var Ku = Ht;
          Ks(N, Ku);
        }
        return it;
      }
      function he(N, B, L, ee) {
        var Ce = ut(L);
        if (typeof Ce != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          L[Symbol.toStringTag] === "Generator" && (vg || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), vg = !0), L.entries === Ce && (pg || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), pg = !0);
          var ge = Ce.call(L);
          if (ge)
            for (var et = null, it = ge.next(); !it.done; it = ge.next()) {
              var Zt = it.value;
              et = H(Zt, et, N);
            }
        }
        var jt = Ce.call(L);
        if (jt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Xn = null, Ht = null, In = B, ca = 0, Wr = 0, di = null, Ta = jt.next(); In !== null && !Ta.done; Wr++, Ta = jt.next()) {
          In.index > Wr ? (di = In, In = null) : di = In.sibling;
          var wa = w(N, In, Ta.value, ee);
          if (wa === null) {
            In === null && (In = di);
            break;
          }
          e && In && wa.alternate === null && t(N, In), ca = s(wa, ca, Wr), Ht === null ? Xn = wa : Ht.sibling = wa, Ht = wa, In = di;
        }
        if (Ta.done) {
          if (a(N, In), Pr()) {
            var fa = Wr;
            Ks(N, fa);
          }
          return Xn;
        }
        if (In === null) {
          for (; !Ta.done; Wr++, Ta = jt.next()) {
            var Ku = _(N, Ta.value, ee);
            Ku !== null && (ca = s(Ku, ca, Wr), Ht === null ? Xn = Ku : Ht.sibling = Ku, Ht = Ku);
          }
          if (Pr()) {
            var Jf = Wr;
            Ks(N, Jf);
          }
          return Xn;
        }
        for (var av = i(N, In); !Ta.done; Wr++, Ta = jt.next()) {
          var tu = z(av, N, Wr, Ta.value, ee);
          tu !== null && (e && tu.alternate !== null && av.delete(tu.key === null ? Wr : tu.key), ca = s(tu, ca, Wr), Ht === null ? Xn = tu : Ht.sibling = tu, Ht = tu);
        }
        if (e && av.forEach(function(w_) {
          return t(N, w_);
        }), Pr()) {
          var T_ = Wr;
          Ks(N, T_);
        }
        return Xn;
      }
      function Ye(N, B, L, ee) {
        if (B !== null && B.tag === ye) {
          a(N, B.sibling);
          var Ce = u(B, L);
          return Ce.return = N, Ce;
        }
        a(N, B);
        var ge = dS(L, N.mode, ee);
        return ge.return = N, ge;
      }
      function ze(N, B, L, ee) {
        for (var Ce = L.key, ge = B; ge !== null; ) {
          if (ge.key === Ce) {
            var et = L.type;
            if (et === hi) {
              if (ge.tag === Le) {
                a(N, ge.sibling);
                var it = u(ge, L.props.children);
                return it.return = N, it._debugSource = L._source, it._debugOwner = L._owner, it;
              }
            } else if (ge.elementType === et || // Keep this check inline so it only runs on the false path:
            Mb(ge, L) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof et == "object" && et !== null && et.$$typeof === rt && kE(et) === ge.type) {
              a(N, ge.sibling);
              var Zt = u(ge, L.props);
              return Zt.ref = wp(N, ge, L), Zt.return = N, Zt._debugSource = L._source, Zt._debugOwner = L._owner, Zt;
            }
            a(N, ge);
            break;
          } else
            t(N, ge);
          ge = ge.sibling;
        }
        if (L.type === hi) {
          var jt = Go(L.props.children, N.mode, ee, L.key);
          return jt.return = N, jt;
        } else {
          var Xn = fS(L, N.mode, ee);
          return Xn.ref = wp(N, B, L), Xn.return = N, Xn;
        }
      }
      function wt(N, B, L, ee) {
        for (var Ce = L.key, ge = B; ge !== null; ) {
          if (ge.key === Ce)
            if (ge.tag === me && ge.stateNode.containerInfo === L.containerInfo && ge.stateNode.implementation === L.implementation) {
              a(N, ge.sibling);
              var et = u(ge, L.children || []);
              return et.return = N, et;
            } else {
              a(N, ge);
              break;
            }
          else
            t(N, ge);
          ge = ge.sibling;
        }
        var it = pS(L, N.mode, ee);
        return it.return = N, it;
      }
      function Ct(N, B, L, ee) {
        var Ce = typeof L == "object" && L !== null && L.type === hi && L.key === null;
        if (Ce && (L = L.props.children), typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case Nr:
              return f(ze(N, B, L, ee));
            case ur:
              return f(wt(N, B, L, ee));
            case rt:
              var ge = L._payload, et = L._init;
              return Ct(N, B, et(ge), ee);
          }
          if (vt(L))
            return V(N, B, L, ee);
          if (ut(L))
            return he(N, B, L, ee);
          Zh(N, L);
        }
        return typeof L == "string" && L !== "" || typeof L == "number" ? f(Ye(N, B, "" + L, ee)) : (typeof L == "function" && em(N), a(N, B));
      }
      return Ct;
    }
    var Uf = _E(!0), DE = _E(!1);
    function t1(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = sc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = sc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function n1(e, t) {
      for (var a = e.child; a !== null; )
        Ik(a, t), a = a.sibling;
    }
    var gg = Uo(null), Sg;
    Sg = {};
    var tm = null, zf = null, Eg = null, nm = !1;
    function rm() {
      tm = null, zf = null, Eg = null, nm = !1;
    }
    function OE() {
      nm = !0;
    }
    function NE() {
      nm = !1;
    }
    function LE(e, t, a) {
      oa(gg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== Sg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = Sg;
    }
    function Cg(e, t) {
      var a = gg.current;
      ua(gg, t), e._currentValue = a;
    }
    function bg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (Lu(i.childLanes, t) ? u !== null && !Lu(u.childLanes, t) && (u.childLanes = ot(u.childLanes, t)) : (i.childLanes = ot(i.childLanes, t), u !== null && (u.childLanes = ot(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function r1(e, t, a) {
      a1(e, t, a);
    }
    function a1(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === Q) {
                var p = ks(a), v = Yu(en, p);
                v.tag = im;
                var g = i.updateQueue;
                if (g !== null) {
                  var E = g.shared, _ = E.pending;
                  _ === null ? v.next = v : (v.next = _.next, _.next = v), E.pending = v;
                }
              }
              i.lanes = ot(i.lanes, a);
              var w = i.alternate;
              w !== null && (w.lanes = ot(w.lanes, a)), bg(i.return, a, e), s.lanes = ot(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === xe)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === tn) {
          var z = i.return;
          if (z === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          z.lanes = ot(z.lanes, a);
          var H = z.alternate;
          H !== null && (H.lanes = ot(H.lanes, a)), bg(z, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var V = u.sibling;
            if (V !== null) {
              V.return = u.return, u = V;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Af(e, t) {
      tm = e, zf = null, Eg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ra(a.lanes, t) && Vp(), a.firstContext = null);
      }
    }
    function ar(e) {
      nm && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (Eg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (zf === null) {
          if (tm === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          zf = a, tm.dependencies = {
            lanes: G,
            firstContext: a
          };
        } else
          zf = zf.next = a;
      }
      return t;
    }
    var tc = null;
    function xg(e) {
      tc === null ? tc = [e] : tc.push(e);
    }
    function i1() {
      if (tc !== null) {
        for (var e = 0; e < tc.length; e++) {
          var t = tc[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var s = u.next;
              u.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        tc = null;
      }
    }
    function ME(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, xg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, am(e, i);
    }
    function l1(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, xg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function u1(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, xg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, am(e, i);
    }
    function Ba(e, t) {
      return am(e, t);
    }
    var o1 = am;
    function am(e, t) {
      e.lanes = ot(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = ot(a.lanes, t)), a === null && (e.flags & (gn | Jr)) !== Fe && Db(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = ot(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = ot(a.childLanes, t) : (u.flags & (gn | Jr)) !== Fe && Db(e), i = u, u = u.return;
      if (i.tag === ne) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var UE = 0, zE = 1, im = 2, Rg = 3, lm = !1, Tg, um;
    Tg = !1, um = null;
    function wg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: G
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function AE(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function Yu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: UE,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Ho(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (um === u && !Tg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), Tg = !0), lk()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, o1(e, a);
      } else
        return u1(e, u, t, a);
    }
    function om(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Fd(a)) {
          var s = u.lanes;
          s = Vd(s, e.pendingLanes);
          var f = ot(s, a);
          u.lanes = f, of(e, f);
        }
      }
    }
    function kg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var g = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = g : (f.next = g, f = g), v = v.next;
            } while (v !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var E = a.lastBaseUpdate;
      E === null ? a.firstBaseUpdate = t : E.next = t, a.lastBaseUpdate = t;
    }
    function s1(e, t, a, i, u, s) {
      switch (a.tag) {
        case zE: {
          var f = a.payload;
          if (typeof f == "function") {
            OE();
            var p = f.call(s, i, u);
            {
              if (e.mode & Xt) {
                Sn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  Sn(!1);
                }
              }
              NE();
            }
            return p;
          }
          return f;
        }
        case Rg:
          e.flags = e.flags & ~er | Ae;
        // Intentional fallthrough
        case UE: {
          var v = a.payload, g;
          if (typeof v == "function") {
            OE(), g = v.call(s, i, u);
            {
              if (e.mode & Xt) {
                Sn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  Sn(!1);
                }
              }
              NE();
            }
          } else
            g = v;
          return g == null ? i : ct({}, i, g);
        }
        case im:
          return lm = !0, i;
      }
      return i;
    }
    function sm(e, t, a, i) {
      var u = e.updateQueue;
      lm = !1, um = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, g = v.next;
        v.next = null, f === null ? s = g : f.next = g, f = v;
        var E = e.alternate;
        if (E !== null) {
          var _ = E.updateQueue, w = _.lastBaseUpdate;
          w !== f && (w === null ? _.firstBaseUpdate = g : w.next = g, _.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var z = u.baseState, H = G, V = null, he = null, Ye = null, ze = s;
        do {
          var wt = ze.lane, Ct = ze.eventTime;
          if (Lu(i, wt)) {
            if (Ye !== null) {
              var B = {
                eventTime: Ct,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Nt,
                tag: ze.tag,
                payload: ze.payload,
                callback: ze.callback,
                next: null
              };
              Ye = Ye.next = B;
            }
            z = s1(e, u, ze, z, t, a);
            var L = ze.callback;
            if (L !== null && // If the update was already committed, we should not queue its
            // callback again.
            ze.lane !== Nt) {
              e.flags |= un;
              var ee = u.effects;
              ee === null ? u.effects = [ze] : ee.push(ze);
            }
          } else {
            var N = {
              eventTime: Ct,
              lane: wt,
              tag: ze.tag,
              payload: ze.payload,
              callback: ze.callback,
              next: null
            };
            Ye === null ? (he = Ye = N, V = z) : Ye = Ye.next = N, H = ot(H, wt);
          }
          if (ze = ze.next, ze === null) {
            if (p = u.shared.pending, p === null)
              break;
            var Ce = p, ge = Ce.next;
            Ce.next = null, ze = ge, u.lastBaseUpdate = Ce, u.shared.pending = null;
          }
        } while (!0);
        Ye === null && (V = z), u.baseState = V, u.firstBaseUpdate = he, u.lastBaseUpdate = Ye;
        var et = u.shared.interleaved;
        if (et !== null) {
          var it = et;
          do
            H = ot(H, it.lane), it = it.next;
          while (it !== et);
        } else s === null && (u.shared.lanes = G);
        Zp(H), e.lanes = H, e.memoizedState = z;
      }
      um = null;
    }
    function c1(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function jE() {
      lm = !1;
    }
    function cm() {
      return lm;
    }
    function HE(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, c1(f, a));
        }
    }
    var kp = {}, Fo = Uo(kp), _p = Uo(kp), fm = Uo(kp);
    function dm(e) {
      if (e === kp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function FE() {
      var e = dm(fm.current);
      return e;
    }
    function _g(e, t) {
      oa(fm, t, e), oa(_p, e, e), oa(Fo, kp, e);
      var a = kR(t);
      ua(Fo, e), oa(Fo, a, e);
    }
    function jf(e) {
      ua(Fo, e), ua(_p, e), ua(fm, e);
    }
    function Dg() {
      var e = dm(Fo.current);
      return e;
    }
    function PE(e) {
      dm(fm.current);
      var t = dm(Fo.current), a = _R(t, e.type);
      t !== a && (oa(_p, e, e), oa(Fo, a, e));
    }
    function Og(e) {
      _p.current === e && (ua(Fo, e), ua(_p, e));
    }
    var f1 = 0, VE = 1, BE = 1, Dp = 2, ol = Uo(f1);
    function Ng(e, t) {
      return (e & t) !== 0;
    }
    function Hf(e) {
      return e & VE;
    }
    function Lg(e, t) {
      return e & VE | t;
    }
    function d1(e, t) {
      return e | t;
    }
    function Po(e, t) {
      oa(ol, t, e);
    }
    function Ff(e) {
      ua(ol, e);
    }
    function p1(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function pm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === Te) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || iE(i) || Ky(i))
              return t;
          }
        } else if (t.tag === on && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Ae) !== Fe;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Ia = (
      /*   */
      0
    ), vr = (
      /* */
      1
    ), Gl = (
      /*  */
      2
    ), hr = (
      /*    */
      4
    ), Vr = (
      /*   */
      8
    ), Mg = [];
    function Ug() {
      for (var e = 0; e < Mg.length; e++) {
        var t = Mg[e];
        t._workInProgressVersionPrimary = null;
      }
      Mg.length = 0;
    }
    function v1(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Ee = x.ReactCurrentDispatcher, Op = x.ReactCurrentBatchConfig, zg, Pf;
    zg = /* @__PURE__ */ new Set();
    var nc = G, Jt = null, mr = null, yr = null, vm = !1, Np = !1, Lp = 0, h1 = 0, m1 = 25, Y = null, Hi = null, Vo = -1, Ag = !1;
    function It() {
      {
        var e = Y;
        Hi === null ? Hi = [e] : Hi.push(e);
      }
    }
    function ce() {
      {
        var e = Y;
        Hi !== null && (Vo++, Hi[Vo] !== e && y1(e));
      }
    }
    function Vf(e) {
      e != null && !vt(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", Y, typeof e);
    }
    function y1(e) {
      {
        var t = nt(Jt);
        if (!zg.has(t) && (zg.add(t), Hi !== null)) {
          for (var a = "", i = 30, u = 0; u <= Vo; u++) {
            for (var s = Hi[u], f = u === Vo ? e : s, p = u + 1 + ". " + s; p.length < i; )
              p += " ";
            p += f + `
`, a += p;
          }
          S(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function sa() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function jg(e, t) {
      if (Ag)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", Y), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, Y, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!X(e[a], t[a]))
          return !1;
      return !0;
    }
    function Bf(e, t, a, i, u, s) {
      nc = s, Jt = t, Hi = e !== null ? e._debugHookTypes : null, Vo = -1, Ag = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = G, e !== null && e.memoizedState !== null ? Ee.current = cC : Hi !== null ? Ee.current = sC : Ee.current = oC;
      var f = a(i, u);
      if (Np) {
        var p = 0;
        do {
          if (Np = !1, Lp = 0, p >= m1)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Ag = !1, mr = null, yr = null, t.updateQueue = null, Vo = -1, Ee.current = fC, f = a(i, u);
        } while (Np);
      }
      Ee.current = km, t._debugHookTypes = Hi;
      var v = mr !== null && mr.next !== null;
      if (nc = G, Jt = null, mr = null, yr = null, Y = null, Hi = null, Vo = -1, e !== null && (e.flags & jn) !== (t.flags & jn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & gt) !== Pe && S("Internal React error: Expected static flag was missing. Please notify the React team."), vm = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function If() {
      var e = Lp !== 0;
      return Lp = 0, e;
    }
    function IE(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & zt) !== Pe ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = _s(e.lanes, a);
    }
    function YE() {
      if (Ee.current = km, vm) {
        for (var e = Jt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        vm = !1;
      }
      nc = G, Jt = null, mr = null, yr = null, Hi = null, Vo = -1, Y = null, rC = !1, Np = !1, Lp = 0;
    }
    function ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return yr === null ? Jt.memoizedState = yr = e : yr = yr.next = e, yr;
    }
    function Fi() {
      var e;
      if (mr === null) {
        var t = Jt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = mr.next;
      var a;
      if (yr === null ? a = Jt.memoizedState : a = yr.next, a !== null)
        yr = a, a = yr.next, mr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        mr = e;
        var i = {
          memoizedState: mr.memoizedState,
          baseState: mr.baseState,
          baseQueue: mr.baseQueue,
          queue: mr.queue,
          next: null
        };
        yr === null ? Jt.memoizedState = yr = i : yr = yr.next = i;
      }
      return yr;
    }
    function $E() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Hg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Fg(e, t, a) {
      var i = ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: G,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = C1.bind(null, Jt, s);
      return [i.memoizedState, f];
    }
    function Pg(e, t, a) {
      var i = Fi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = mr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, g = p.next;
          f.next = g, p.next = v;
        }
        s.baseQueue !== f && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var E = f.next, _ = s.baseState, w = null, z = null, H = null, V = E;
        do {
          var he = V.lane;
          if (Lu(nc, he)) {
            if (H !== null) {
              var ze = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Nt,
                action: V.action,
                hasEagerState: V.hasEagerState,
                eagerState: V.eagerState,
                next: null
              };
              H = H.next = ze;
            }
            if (V.hasEagerState)
              _ = V.eagerState;
            else {
              var wt = V.action;
              _ = e(_, wt);
            }
          } else {
            var Ye = {
              lane: he,
              action: V.action,
              hasEagerState: V.hasEagerState,
              eagerState: V.eagerState,
              next: null
            };
            H === null ? (z = H = Ye, w = _) : H = H.next = Ye, Jt.lanes = ot(Jt.lanes, he), Zp(he);
          }
          V = V.next;
        } while (V !== null && V !== E);
        H === null ? w = _ : H.next = z, X(_, i.memoizedState) || Vp(), i.memoizedState = _, i.baseState = w, i.baseQueue = H, u.lastRenderedState = _;
      }
      var Ct = u.interleaved;
      if (Ct !== null) {
        var N = Ct;
        do {
          var B = N.lane;
          Jt.lanes = ot(Jt.lanes, B), Zp(B), N = N.next;
        } while (N !== Ct);
      } else f === null && (u.lanes = G);
      var L = u.dispatch;
      return [i.memoizedState, L];
    }
    function Vg(e, t, a) {
      var i = Fi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, f = u.pending, p = i.memoizedState;
      if (f !== null) {
        u.pending = null;
        var v = f.next, g = v;
        do {
          var E = g.action;
          p = e(p, E), g = g.next;
        } while (g !== v);
        X(p, i.memoizedState) || Vp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function SD(e, t, a) {
    }
    function ED(e, t, a) {
    }
    function Bg(e, t, a) {
      var i = Jt, u = ql(), s, f = Pr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Pf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), Pf = !0);
      } else {
        if (s = t(), !Pf) {
          var p = t();
          X(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Pf = !0);
        }
        var v = Qm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        lf(v, nc) || QE(i, t, s);
      }
      u.memoizedState = s;
      var g = {
        value: s,
        getSnapshot: t
      };
      return u.queue = g, Sm(GE.bind(null, i, g, e), [e]), i.flags |= Xr, Mp(vr | Vr, WE.bind(null, i, g, s, t), void 0, null), s;
    }
    function hm(e, t, a) {
      var i = Jt, u = Fi(), s = t();
      if (!Pf) {
        var f = t();
        X(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Pf = !0);
      }
      var p = u.memoizedState, v = !X(p, s);
      v && (u.memoizedState = s, Vp());
      var g = u.queue;
      if (zp(GE.bind(null, i, g, e), [e]), g.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      yr !== null && yr.memoizedState.tag & vr) {
        i.flags |= Xr, Mp(vr | Vr, WE.bind(null, i, g, s, t), void 0, null);
        var E = Qm();
        if (E === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        lf(E, nc) || QE(i, t, s);
      }
      return s;
    }
    function QE(e, t, a) {
      e.flags |= go;
      var i = {
        getSnapshot: t,
        value: a
      }, u = Jt.updateQueue;
      if (u === null)
        u = $E(), Jt.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function WE(e, t, a, i) {
      t.value = a, t.getSnapshot = i, qE(t) && KE(e);
    }
    function GE(e, t, a) {
      var i = function() {
        qE(t) && KE(e);
      };
      return a(i);
    }
    function qE(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !X(a, i);
      } catch {
        return !0;
      }
    }
    function KE(e) {
      var t = Ba(e, Xe);
      t !== null && Cr(t, e, Xe, en);
    }
    function mm(e) {
      var t = ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: G,
        dispatch: null,
        lastRenderedReducer: Hg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = b1.bind(null, Jt, a);
      return [t.memoizedState, i];
    }
    function Ig(e) {
      return Pg(Hg);
    }
    function Yg(e) {
      return Vg(Hg);
    }
    function Mp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = Jt.updateQueue;
      if (s === null)
        s = $E(), Jt.updateQueue = s, s.lastEffect = u.next = u;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = u.next = u;
        else {
          var p = f.next;
          f.next = u, u.next = p, s.lastEffect = u;
        }
      }
      return u;
    }
    function $g(e) {
      var t = ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function ym(e) {
      var t = Fi();
      return t.memoizedState;
    }
    function Up(e, t, a, i) {
      var u = ql(), s = i === void 0 ? null : i;
      Jt.flags |= e, u.memoizedState = Mp(vr | t, a, void 0, s);
    }
    function gm(e, t, a, i) {
      var u = Fi(), s = i === void 0 ? null : i, f = void 0;
      if (mr !== null) {
        var p = mr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (jg(s, v)) {
            u.memoizedState = Mp(t, a, f, s);
            return;
          }
        }
      }
      Jt.flags |= e, u.memoizedState = Mp(vr | t, a, f, s);
    }
    function Sm(e, t) {
      return (Jt.mode & zt) !== Pe ? Up(wi | Xr | Lc, Vr, e, t) : Up(Xr | Lc, Vr, e, t);
    }
    function zp(e, t) {
      return gm(Xr, Vr, e, t);
    }
    function Qg(e, t) {
      return Up(xt, Gl, e, t);
    }
    function Em(e, t) {
      return gm(xt, Gl, e, t);
    }
    function Wg(e, t) {
      var a = xt;
      return a |= Ki, (Jt.mode & zt) !== Pe && (a |= Ol), Up(a, hr, e, t);
    }
    function Cm(e, t) {
      return gm(xt, hr, e, t);
    }
    function XE(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || S("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var s = e();
        return u.current = s, function() {
          u.current = null;
        };
      }
    }
    function Gg(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = xt;
      return u |= Ki, (Jt.mode & zt) !== Pe && (u |= Ol), Up(u, hr, XE.bind(null, t, e), i);
    }
    function bm(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return gm(xt, hr, XE.bind(null, t, e), i);
    }
    function g1(e, t) {
    }
    var xm = g1;
    function qg(e, t) {
      var a = ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function Rm(e, t) {
      var a = Fi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (jg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Kg(e, t) {
      var a = ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function Tm(e, t) {
      var a = Fi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (jg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Xg(e) {
      var t = ql();
      return t.memoizedState = e, e;
    }
    function JE(e) {
      var t = Fi(), a = mr, i = a.memoizedState;
      return eC(t, i, e);
    }
    function ZE(e) {
      var t = Fi();
      if (mr === null)
        return t.memoizedState = e, e;
      var a = mr.memoizedState;
      return eC(t, a, e);
    }
    function eC(e, t, a) {
      var i = !jd(nc);
      if (i) {
        if (!X(a, t)) {
          var u = Pd();
          Jt.lanes = ot(Jt.lanes, u), Zp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Vp()), e.memoizedState = a, a;
    }
    function S1(e, t, a) {
      var i = Fa();
      Pn(nh(i, Oi)), e(!0);
      var u = Op.transition;
      Op.transition = {};
      var s = Op.transition;
      Op.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Pn(i), Op.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && Ne("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Jg() {
      var e = mm(!1), t = e[0], a = e[1], i = S1.bind(null, a), u = ql();
      return u.memoizedState = i, [t, i];
    }
    function tC() {
      var e = Ig(), t = e[0], a = Fi(), i = a.memoizedState;
      return [t, i];
    }
    function nC() {
      var e = Yg(), t = e[0], a = Fi(), i = a.memoizedState;
      return [t, i];
    }
    var rC = !1;
    function E1() {
      return rC;
    }
    function Zg() {
      var e = ql(), t = Qm(), a = t.identifierPrefix, i;
      if (Pr()) {
        var u = jT();
        i = ":" + a + "R" + u;
        var s = Lp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = h1++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function wm() {
      var e = Fi(), t = e.memoizedState;
      return t;
    }
    function C1(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Qo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (aC(e))
        iC(t, u);
      else {
        var s = ME(e, t, u, i);
        if (s !== null) {
          var f = Ra();
          Cr(s, e, i, f), lC(s, t, i);
        }
      }
      uC(e, i);
    }
    function b1(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Qo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (aC(e))
        iC(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === G && (s === null || s.lanes === G)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = Ee.current, Ee.current = sl;
            try {
              var v = t.lastRenderedState, g = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = g, X(g, v)) {
                l1(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              Ee.current = p;
            }
          }
        }
        var E = ME(e, t, u, i);
        if (E !== null) {
          var _ = Ra();
          Cr(E, e, i, _), lC(E, t, i);
        }
      }
      uC(e, i);
    }
    function aC(e) {
      var t = e.alternate;
      return e === Jt || t !== null && t === Jt;
    }
    function iC(e, t) {
      Np = vm = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function lC(e, t, a) {
      if (Fd(a)) {
        var i = t.lanes;
        i = Vd(i, e.pendingLanes);
        var u = ot(i, a);
        t.lanes = u, of(e, u);
      }
    }
    function uC(e, t, a) {
      gs(e, t);
    }
    var km = {
      readContext: ar,
      useCallback: sa,
      useContext: sa,
      useEffect: sa,
      useImperativeHandle: sa,
      useInsertionEffect: sa,
      useLayoutEffect: sa,
      useMemo: sa,
      useReducer: sa,
      useRef: sa,
      useState: sa,
      useDebugValue: sa,
      useDeferredValue: sa,
      useTransition: sa,
      useMutableSource: sa,
      useSyncExternalStore: sa,
      useId: sa,
      unstable_isNewReconciler: ae
    }, oC = null, sC = null, cC = null, fC = null, Kl = null, sl = null, _m = null;
    {
      var e0 = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, at = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      oC = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", It(), Vf(t), qg(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", It(), ar(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", It(), Vf(t), Sm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", It(), Vf(a), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", It(), Vf(t), Qg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", It(), Vf(t), Wg(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", It(), Vf(t);
          var a = Ee.current;
          Ee.current = Kl;
          try {
            return Kg(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", It();
          var i = Ee.current;
          Ee.current = Kl;
          try {
            return Fg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", It(), $g(e);
        },
        useState: function(e) {
          Y = "useState", It();
          var t = Ee.current;
          Ee.current = Kl;
          try {
            return mm(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", It(), void 0;
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", It(), Xg(e);
        },
        useTransition: function() {
          return Y = "useTransition", It(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", It(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", It(), Bg(e, t, a);
        },
        useId: function() {
          return Y = "useId", It(), Zg();
        },
        unstable_isNewReconciler: ae
      }, sC = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", ce(), qg(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", ce(), ar(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", ce(), Sm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", ce(), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", ce(), Qg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", ce(), Wg(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", ce();
          var a = Ee.current;
          Ee.current = Kl;
          try {
            return Kg(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", ce();
          var i = Ee.current;
          Ee.current = Kl;
          try {
            return Fg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", ce(), $g(e);
        },
        useState: function(e) {
          Y = "useState", ce();
          var t = Ee.current;
          Ee.current = Kl;
          try {
            return mm(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", ce(), void 0;
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", ce(), Xg(e);
        },
        useTransition: function() {
          return Y = "useTransition", ce(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", ce(), Bg(e, t, a);
        },
        useId: function() {
          return Y = "useId", ce(), Zg();
        },
        unstable_isNewReconciler: ae
      }, cC = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", ce(), Rm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", ce(), ar(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", ce(), zp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", ce(), bm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", ce(), Em(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", ce(), Cm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", ce();
          var a = Ee.current;
          Ee.current = sl;
          try {
            return Tm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", ce();
          var i = Ee.current;
          Ee.current = sl;
          try {
            return Pg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", ce(), ym();
        },
        useState: function(e) {
          Y = "useState", ce();
          var t = Ee.current;
          Ee.current = sl;
          try {
            return Ig(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", ce(), xm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", ce(), JE(e);
        },
        useTransition: function() {
          return Y = "useTransition", ce(), tC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", ce(), hm(e, t);
        },
        useId: function() {
          return Y = "useId", ce(), wm();
        },
        unstable_isNewReconciler: ae
      }, fC = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", ce(), Rm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", ce(), ar(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", ce(), zp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", ce(), bm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", ce(), Em(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", ce(), Cm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", ce();
          var a = Ee.current;
          Ee.current = _m;
          try {
            return Tm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", ce();
          var i = Ee.current;
          Ee.current = _m;
          try {
            return Vg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", ce(), ym();
        },
        useState: function(e) {
          Y = "useState", ce();
          var t = Ee.current;
          Ee.current = _m;
          try {
            return Yg(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", ce(), xm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", ce(), ZE(e);
        },
        useTransition: function() {
          return Y = "useTransition", ce(), nC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", ce(), hm(e, t);
        },
        useId: function() {
          return Y = "useId", ce(), wm();
        },
        unstable_isNewReconciler: ae
      }, Kl = {
        readContext: function(e) {
          return e0(), ar(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", at(), It(), qg(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", at(), It(), ar(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", at(), It(), Sm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", at(), It(), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", at(), It(), Qg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", at(), It(), Wg(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", at(), It();
          var a = Ee.current;
          Ee.current = Kl;
          try {
            return Kg(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", at(), It();
          var i = Ee.current;
          Ee.current = Kl;
          try {
            return Fg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", at(), It(), $g(e);
        },
        useState: function(e) {
          Y = "useState", at(), It();
          var t = Ee.current;
          Ee.current = Kl;
          try {
            return mm(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", at(), It(), void 0;
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", at(), It(), Xg(e);
        },
        useTransition: function() {
          return Y = "useTransition", at(), It(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", at(), It(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", at(), It(), Bg(e, t, a);
        },
        useId: function() {
          return Y = "useId", at(), It(), Zg();
        },
        unstable_isNewReconciler: ae
      }, sl = {
        readContext: function(e) {
          return e0(), ar(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", at(), ce(), Rm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", at(), ce(), ar(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", at(), ce(), zp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", at(), ce(), bm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", at(), ce(), Em(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", at(), ce(), Cm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", at(), ce();
          var a = Ee.current;
          Ee.current = sl;
          try {
            return Tm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", at(), ce();
          var i = Ee.current;
          Ee.current = sl;
          try {
            return Pg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", at(), ce(), ym();
        },
        useState: function(e) {
          Y = "useState", at(), ce();
          var t = Ee.current;
          Ee.current = sl;
          try {
            return Ig(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", at(), ce(), xm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", at(), ce(), JE(e);
        },
        useTransition: function() {
          return Y = "useTransition", at(), ce(), tC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", at(), ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", at(), ce(), hm(e, t);
        },
        useId: function() {
          return Y = "useId", at(), ce(), wm();
        },
        unstable_isNewReconciler: ae
      }, _m = {
        readContext: function(e) {
          return e0(), ar(e);
        },
        useCallback: function(e, t) {
          return Y = "useCallback", at(), ce(), Rm(e, t);
        },
        useContext: function(e) {
          return Y = "useContext", at(), ce(), ar(e);
        },
        useEffect: function(e, t) {
          return Y = "useEffect", at(), ce(), zp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return Y = "useImperativeHandle", at(), ce(), bm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return Y = "useInsertionEffect", at(), ce(), Em(e, t);
        },
        useLayoutEffect: function(e, t) {
          return Y = "useLayoutEffect", at(), ce(), Cm(e, t);
        },
        useMemo: function(e, t) {
          Y = "useMemo", at(), ce();
          var a = Ee.current;
          Ee.current = sl;
          try {
            return Tm(e, t);
          } finally {
            Ee.current = a;
          }
        },
        useReducer: function(e, t, a) {
          Y = "useReducer", at(), ce();
          var i = Ee.current;
          Ee.current = sl;
          try {
            return Vg(e, t, a);
          } finally {
            Ee.current = i;
          }
        },
        useRef: function(e) {
          return Y = "useRef", at(), ce(), ym();
        },
        useState: function(e) {
          Y = "useState", at(), ce();
          var t = Ee.current;
          Ee.current = sl;
          try {
            return Yg(e);
          } finally {
            Ee.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return Y = "useDebugValue", at(), ce(), xm();
        },
        useDeferredValue: function(e) {
          return Y = "useDeferredValue", at(), ce(), ZE(e);
        },
        useTransition: function() {
          return Y = "useTransition", at(), ce(), nC();
        },
        useMutableSource: function(e, t, a) {
          return Y = "useMutableSource", at(), ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return Y = "useSyncExternalStore", at(), ce(), hm(e, t);
        },
        useId: function() {
          return Y = "useId", at(), ce(), wm();
        },
        unstable_isNewReconciler: ae
      };
    }
    var Bo = M.unstable_now, dC = 0, Dm = -1, Ap = -1, Om = -1, t0 = !1, Nm = !1;
    function pC() {
      return t0;
    }
    function x1() {
      Nm = !0;
    }
    function R1() {
      t0 = !1, Nm = !1;
    }
    function T1() {
      t0 = Nm, Nm = !1;
    }
    function vC() {
      return dC;
    }
    function hC() {
      dC = Bo();
    }
    function n0(e) {
      Ap = Bo(), e.actualStartTime < 0 && (e.actualStartTime = Bo());
    }
    function mC(e) {
      Ap = -1;
    }
    function Lm(e, t) {
      if (Ap >= 0) {
        var a = Bo() - Ap;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Ap = -1;
      }
    }
    function Xl(e) {
      if (Dm >= 0) {
        var t = Bo() - Dm;
        Dm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ne:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case ue:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function r0(e) {
      if (Om >= 0) {
        var t = Bo() - Om;
        Om = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ne:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case ue:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function Jl() {
      Dm = Bo();
    }
    function a0() {
      Om = Bo();
    }
    function i0(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function cl(e, t) {
      if (e && e.defaultProps) {
        var a = ct({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var l0 = {}, u0, o0, s0, c0, f0, yC, Mm, d0, p0, v0, jp;
    {
      u0 = /* @__PURE__ */ new Set(), o0 = /* @__PURE__ */ new Set(), s0 = /* @__PURE__ */ new Set(), c0 = /* @__PURE__ */ new Set(), d0 = /* @__PURE__ */ new Set(), f0 = /* @__PURE__ */ new Set(), p0 = /* @__PURE__ */ new Set(), v0 = /* @__PURE__ */ new Set(), jp = /* @__PURE__ */ new Set();
      var gC = /* @__PURE__ */ new Set();
      Mm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          gC.has(a) || (gC.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, yC = function(e, t) {
        if (t === void 0) {
          var a = kt(e) || "Component";
          f0.has(a) || (f0.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(l0, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(l0);
    }
    function h0(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Xt) {
          Sn(!0);
          try {
            s = a(i, u);
          } finally {
            Sn(!1);
          }
        }
        yC(t, s);
      }
      var f = s == null ? u : ct({}, u, s);
      if (e.memoizedState = f, e.lanes === G) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var m0 = {
      isMounted: Pv,
      enqueueSetState: function(e, t, a) {
        var i = yo(e), u = Ra(), s = Qo(i), f = Yu(u, s);
        f.payload = t, a != null && (Mm(a, "setState"), f.callback = a);
        var p = Ho(i, f, s);
        p !== null && (Cr(p, i, s, u), om(p, i, s)), gs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = yo(e), u = Ra(), s = Qo(i), f = Yu(u, s);
        f.tag = zE, f.payload = t, a != null && (Mm(a, "replaceState"), f.callback = a);
        var p = Ho(i, f, s);
        p !== null && (Cr(p, i, s, u), om(p, i, s)), gs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = yo(e), i = Ra(), u = Qo(a), s = Yu(i, u);
        s.tag = im, t != null && (Mm(t, "forceUpdate"), s.callback = t);
        var f = Ho(a, s, u);
        f !== null && (Cr(f, a, u, i), om(f, a, u)), Fc(a, u);
      }
    };
    function SC(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Xt) {
            Sn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              Sn(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", kt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !ke(a, i) || !ke(u, s) : !0;
    }
    function w1(e, t, a) {
      var i = e.stateNode;
      {
        var u = kt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !jp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Xt) === Pe && (jp.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !jp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Xt) === Pe && (jp.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !p0.has(t) && (p0.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", kt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !s0.has(t) && (s0.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", kt(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || vt(p)) && S("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function EC(e, t) {
      t.updater = m0, e.stateNode = t, gu(t, e), t._reactInternalInstance = l0;
    }
    function CC(e, t, a) {
      var i = !1, u = ci, s = ci, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !v0.has(t)) {
          v0.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === yi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", kt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = ar(f);
      else {
        u = Df(e, t, !0);
        var g = t.contextTypes;
        i = g != null, s = i ? Of(e, u) : ci;
      }
      var E = new t(a, s);
      if (e.mode & Xt) {
        Sn(!0);
        try {
          E = new t(a, s);
        } finally {
          Sn(!1);
        }
      }
      var _ = e.memoizedState = E.state !== null && E.state !== void 0 ? E.state : null;
      EC(e, E);
      {
        if (typeof t.getDerivedStateFromProps == "function" && _ === null) {
          var w = kt(t) || "Component";
          o0.has(w) || (o0.add(w), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", w, E.state === null ? "null" : "undefined", w));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof E.getSnapshotBeforeUpdate == "function") {
          var z = null, H = null, V = null;
          if (typeof E.componentWillMount == "function" && E.componentWillMount.__suppressDeprecationWarning !== !0 ? z = "componentWillMount" : typeof E.UNSAFE_componentWillMount == "function" && (z = "UNSAFE_componentWillMount"), typeof E.componentWillReceiveProps == "function" && E.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? H = "componentWillReceiveProps" : typeof E.UNSAFE_componentWillReceiveProps == "function" && (H = "UNSAFE_componentWillReceiveProps"), typeof E.componentWillUpdate == "function" && E.componentWillUpdate.__suppressDeprecationWarning !== !0 ? V = "componentWillUpdate" : typeof E.UNSAFE_componentWillUpdate == "function" && (V = "UNSAFE_componentWillUpdate"), z !== null || H !== null || V !== null) {
            var he = kt(t) || "Component", Ye = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            c0.has(he) || (c0.add(he), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, he, Ye, z !== null ? `
  ` + z : "", H !== null ? `
  ` + H : "", V !== null ? `
  ` + V : ""));
          }
        }
      }
      return i && cE(e, u, s), E;
    }
    function k1(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", nt(e) || "Component"), m0.enqueueReplaceState(t, t.state, null));
    }
    function bC(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = nt(e) || "Component";
          u0.has(s) || (u0.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        m0.enqueueReplaceState(t, t.state, null);
      }
    }
    function y0(e, t, a, i) {
      w1(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, wg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = ar(s);
      else {
        var f = Df(e, t, !0);
        u.context = Of(e, f);
      }
      {
        if (u.state === a) {
          var p = kt(t) || "Component";
          d0.has(p) || (d0.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Xt && ul.recordLegacyContextWarning(e, u), ul.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (h0(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (k1(e, u), sm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var g = xt;
        g |= Ki, (e.mode & zt) !== Pe && (g |= Ol), e.flags |= g;
      }
    }
    function _1(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ci;
      if (typeof p == "object" && p !== null)
        v = ar(p);
      else {
        var g = Df(e, t, !0);
        v = Of(e, g);
      }
      var E = t.getDerivedStateFromProps, _ = typeof E == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !_ && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && bC(e, u, a, v), jE();
      var w = e.memoizedState, z = u.state = w;
      if (sm(e, a, u, i), z = e.memoizedState, s === a && w === z && !Yh() && !cm()) {
        if (typeof u.componentDidMount == "function") {
          var H = xt;
          H |= Ki, (e.mode & zt) !== Pe && (H |= Ol), e.flags |= H;
        }
        return !1;
      }
      typeof E == "function" && (h0(e, t, E, a), z = e.memoizedState);
      var V = cm() || SC(e, t, s, a, w, z, v);
      if (V) {
        if (!_ && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var he = xt;
          he |= Ki, (e.mode & zt) !== Pe && (he |= Ol), e.flags |= he;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Ye = xt;
          Ye |= Ki, (e.mode & zt) !== Pe && (Ye |= Ol), e.flags |= Ye;
        }
        e.memoizedProps = a, e.memoizedState = z;
      }
      return u.props = a, u.state = z, u.context = v, V;
    }
    function D1(e, t, a, i, u) {
      var s = t.stateNode;
      AE(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : cl(t.type, f);
      s.props = p;
      var v = t.pendingProps, g = s.context, E = a.contextType, _ = ci;
      if (typeof E == "object" && E !== null)
        _ = ar(E);
      else {
        var w = Df(t, a, !0);
        _ = Of(t, w);
      }
      var z = a.getDerivedStateFromProps, H = typeof z == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !H && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || g !== _) && bC(t, s, i, _), jE();
      var V = t.memoizedState, he = s.state = V;
      if (sm(t, i, s, u), he = t.memoizedState, f === v && V === he && !Yh() && !cm() && !Me)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= xt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= Gn), !1;
      typeof z == "function" && (h0(t, a, z, i), he = t.memoizedState);
      var Ye = cm() || SC(t, a, p, i, V, he, _) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Me;
      return Ye ? (!H && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, he, _), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, he, _)), typeof s.componentDidUpdate == "function" && (t.flags |= xt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Gn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= xt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= Gn), t.memoizedProps = i, t.memoizedState = he), s.props = i, s.state = he, s.context = _, Ye;
    }
    function rc(e, t) {
      return {
        value: e,
        source: t,
        stack: Yi(t),
        digest: null
      };
    }
    function g0(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function O1(e, t) {
      return !0;
    }
    function S0(e, t) {
      try {
        var a = O1(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === Q)
            return;
          console.error(i);
        }
        var p = u ? nt(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", g;
        if (e.tag === ne)
          g = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var E = nt(e) || "Anonymous";
          g = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + E + ".");
        }
        var _ = v + `
` + f + `

` + ("" + g);
        console.error(_);
      } catch (w) {
        setTimeout(function() {
          throw w;
        });
      }
    }
    var N1 = typeof WeakMap == "function" ? WeakMap : Map;
    function xC(e, t, a) {
      var i = Yu(en, a);
      i.tag = Rg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        xk(u), S0(e, t);
      }, i;
    }
    function E0(e, t, a) {
      var i = Yu(en, a);
      i.tag = Rg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          Ub(e), S0(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        Ub(e), S0(e, t), typeof u != "function" && Ck(this);
        var v = t.value, g = t.stack;
        this.componentDidCatch(v, {
          componentStack: g !== null ? g : ""
        }), typeof u != "function" && (ra(e.lanes, Xe) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", nt(e) || "Unknown"));
      }), i;
    }
    function RC(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new N1(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = Rk.bind(null, e, t, a);
        ta && ev(e, a), t.then(s, s);
      }
    }
    function L1(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function M1(e, t) {
      var a = e.tag;
      if ((e.mode & gt) === Pe && (a === se || a === je || a === Ve)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function TC(e) {
      var t = e;
      do {
        if (t.tag === Te && p1(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function wC(e, t, a, i, u) {
      if ((e.mode & gt) === Pe) {
        if (e === t)
          e.flags |= er;
        else {
          if (e.flags |= Ae, a.flags |= Nc, a.flags &= -52805, a.tag === Q) {
            var s = a.alternate;
            if (s === null)
              a.tag = Vt;
            else {
              var f = Yu(en, Xe);
              f.tag = im, Ho(a, f, Xe);
            }
          }
          a.lanes = ot(a.lanes, Xe);
        }
        return e;
      }
      return e.flags |= er, e.lanes = u, e;
    }
    function U1(e, t, a, i, u) {
      if (a.flags |= ds, ta && ev(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        M1(a), Pr() && a.mode & gt && yE();
        var f = TC(t);
        if (f !== null) {
          f.flags &= ~Tr, wC(f, t, a, e, u), f.mode & gt && RC(e, s, u), L1(f, e, s);
          return;
        } else {
          if (!Gv(u)) {
            RC(e, s, u), Z0();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (Pr() && a.mode & gt) {
        yE();
        var v = TC(t);
        if (v !== null) {
          (v.flags & er) === Fe && (v.flags |= Tr), wC(v, t, a, e, u), dg(rc(i, a));
          return;
        }
      }
      i = rc(i, a), pk(i);
      var g = t;
      do {
        switch (g.tag) {
          case ne: {
            var E = i;
            g.flags |= er;
            var _ = ks(u);
            g.lanes = ot(g.lanes, _);
            var w = xC(g, E, _);
            kg(g, w);
            return;
          }
          case Q:
            var z = i, H = g.type, V = g.stateNode;
            if ((g.flags & Ae) === Fe && (typeof H.getDerivedStateFromError == "function" || V !== null && typeof V.componentDidCatch == "function" && !Tb(V))) {
              g.flags |= er;
              var he = ks(u);
              g.lanes = ot(g.lanes, he);
              var Ye = E0(g, z, he);
              kg(g, Ye);
              return;
            }
            break;
        }
        g = g.return;
      } while (g !== null);
    }
    function z1() {
      return null;
    }
    var Hp = x.ReactCurrentOwner, fl = !1, C0, Fp, b0, x0, R0, ac, T0, Um, Pp;
    C0 = {}, Fp = {}, b0 = {}, x0 = {}, R0 = {}, ac = !1, T0 = {}, Um = {}, Pp = {};
    function ba(e, t, a, i) {
      e === null ? t.child = DE(t, null, a, i) : t.child = Uf(t, e.child, a, i);
    }
    function A1(e, t, a, i) {
      t.child = Uf(t, e.child, null, i), t.child = Uf(t, null, a, i);
    }
    function kC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && il(
          s,
          i,
          // Resolved props
          "prop",
          kt(a)
        );
      }
      var f = a.render, p = t.ref, v, g;
      Af(t, u), ga(t);
      {
        if (Hp.current = t, Wn(!0), v = Bf(e, t, f, i, p, u), g = If(), t.mode & Xt) {
          Sn(!0);
          try {
            v = Bf(e, t, f, i, p, u), g = If();
          } finally {
            Sn(!1);
          }
        }
        Wn(!1);
      }
      return Sa(), e !== null && !fl ? (IE(e, t, u), $u(e, t, u)) : (Pr() && g && lg(t), t.flags |= ii, ba(e, t, v, u), t.child);
    }
    function _C(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (Vk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Xf(s), t.tag = Ve, t.type = f, _0(t, s), DC(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && il(
            p,
            i,
            // Resolved props
            "prop",
            kt(s)
          ), a.defaultProps !== void 0) {
            var v = kt(s) || "Unknown";
            Pp[v] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Pp[v] = !0);
          }
        }
        var g = cS(a.type, null, i, t, t.mode, u);
        return g.ref = t.ref, g.return = t, t.child = g, g;
      }
      {
        var E = a.type, _ = E.propTypes;
        _ && il(
          _,
          i,
          // Resolved props
          "prop",
          kt(E)
        );
      }
      var w = e.child, z = U0(e, u);
      if (!z) {
        var H = w.memoizedProps, V = a.compare;
        if (V = V !== null ? V : ke, V(H, i) && e.ref === t.ref)
          return $u(e, t, u);
      }
      t.flags |= ii;
      var he = sc(w, i);
      return he.ref = t.ref, he.return = t, t.child = he, he;
    }
    function DC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === rt) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var g = s && s.propTypes;
          g && il(
            g,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            kt(s)
          );
        }
      }
      if (e !== null) {
        var E = e.memoizedProps;
        if (ke(E, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (fl = !1, t.pendingProps = i = E, U0(e, u))
            (e.flags & Nc) !== Fe && (fl = !0);
          else return t.lanes = e.lanes, $u(e, t, u);
      }
      return w0(e, t, a, i, u);
    }
    function OC(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || fe)
        if ((t.mode & gt) === Pe) {
          var f = {
            baseLanes: G,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Wm(t, a);
        } else if (ra(a, na)) {
          var _ = {
            baseLanes: G,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = _;
          var w = s !== null ? s.baseLanes : a;
          Wm(t, w);
        } else {
          var p = null, v;
          if (s !== null) {
            var g = s.baseLanes;
            v = ot(g, a);
          } else
            v = a;
          t.lanes = t.childLanes = na;
          var E = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = E, t.updateQueue = null, Wm(t, v), null;
        }
      else {
        var z;
        s !== null ? (z = ot(s.baseLanes, a), t.memoizedState = null) : z = a, Wm(t, z);
      }
      return ba(e, t, u, a), t.child;
    }
    function j1(e, t, a) {
      var i = t.pendingProps;
      return ba(e, t, i, a), t.child;
    }
    function H1(e, t, a) {
      var i = t.pendingProps.children;
      return ba(e, t, i, a), t.child;
    }
    function F1(e, t, a) {
      {
        t.flags |= xt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return ba(e, t, s, a), t.child;
    }
    function NC(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= bn, t.flags |= So);
    }
    function w0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && il(
          s,
          i,
          // Resolved props
          "prop",
          kt(a)
        );
      }
      var f;
      {
        var p = Df(t, a, !0);
        f = Of(t, p);
      }
      var v, g;
      Af(t, u), ga(t);
      {
        if (Hp.current = t, Wn(!0), v = Bf(e, t, a, i, f, u), g = If(), t.mode & Xt) {
          Sn(!0);
          try {
            v = Bf(e, t, a, i, f, u), g = If();
          } finally {
            Sn(!1);
          }
        }
        Wn(!1);
      }
      return Sa(), e !== null && !fl ? (IE(e, t, u), $u(e, t, u)) : (Pr() && g && lg(t), t.flags |= ii, ba(e, t, v, u), t.child);
    }
    function LC(e, t, a, i, u) {
      {
        switch (n_(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= Ae, t.flags |= er;
            var g = new Error("Simulated error coming from DevTools"), E = ks(u);
            t.lanes = ot(t.lanes, E);
            var _ = E0(t, rc(g, t), E);
            kg(t, _);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var w = a.propTypes;
          w && il(
            w,
            i,
            // Resolved props
            "prop",
            kt(a)
          );
        }
      }
      var z;
      Wl(a) ? (z = !0, Qh(t)) : z = !1, Af(t, u);
      var H = t.stateNode, V;
      H === null ? (Am(e, t), CC(t, a, i), y0(t, a, i, u), V = !0) : e === null ? V = _1(t, a, i, u) : V = D1(e, t, a, i, u);
      var he = k0(e, t, a, V, z, u);
      {
        var Ye = t.stateNode;
        V && Ye.props !== i && (ac || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", nt(t) || "a component"), ac = !0);
      }
      return he;
    }
    function k0(e, t, a, i, u, s) {
      NC(e, t);
      var f = (t.flags & Ae) !== Fe;
      if (!i && !f)
        return u && pE(t, a, !1), $u(e, t, s);
      var p = t.stateNode;
      Hp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, mC();
      else {
        ga(t);
        {
          if (Wn(!0), v = p.render(), t.mode & Xt) {
            Sn(!0);
            try {
              p.render();
            } finally {
              Sn(!1);
            }
          }
          Wn(!1);
        }
        Sa();
      }
      return t.flags |= ii, e !== null && f ? A1(e, t, v, s) : ba(e, t, v, s), t.memoizedState = p.state, u && pE(t, a, !0), t.child;
    }
    function MC(e) {
      var t = e.stateNode;
      t.pendingContext ? fE(e, t.pendingContext, t.pendingContext !== t.context) : t.context && fE(e, t.context, !1), _g(e, t.containerInfo);
    }
    function P1(e, t, a) {
      if (MC(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      AE(e, t), sm(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var p = f.element;
      if (u.isDehydrated) {
        var v = {
          element: p,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, g = t.updateQueue;
        if (g.baseState = v, t.memoizedState = v, t.flags & Tr) {
          var E = rc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return UC(e, t, p, a, E);
        } else if (p !== s) {
          var _ = rc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return UC(e, t, p, a, _);
        } else {
          IT(t);
          var w = DE(t, null, p, a);
          t.child = w;
          for (var z = w; z; )
            z.flags = z.flags & ~gn | Jr, z = z.sibling;
        }
      } else {
        if (Mf(), p === s)
          return $u(e, t, a);
        ba(e, t, p, a);
      }
      return t.child;
    }
    function UC(e, t, a, i, u) {
      return Mf(), dg(u), t.flags |= Tr, ba(e, t, a, i), t.child;
    }
    function V1(e, t, a) {
      PE(t), e === null && fg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Qy(i, u);
      return p ? f = null : s !== null && Qy(i, s) && (t.flags |= Ma), NC(e, t), ba(e, t, f, a), t.child;
    }
    function B1(e, t) {
      return e === null && fg(t), null;
    }
    function I1(e, t, a, i) {
      Am(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var g = t.tag = Bk(v), E = cl(v, u), _;
      switch (g) {
        case se:
          return _0(t, v), t.type = v = Xf(v), _ = w0(null, t, v, E, i), _;
        case Q:
          return t.type = v = aS(v), _ = LC(null, t, v, E, i), _;
        case je:
          return t.type = v = iS(v), _ = kC(null, t, v, E, i), _;
        case He: {
          if (t.type !== t.elementType) {
            var w = v.propTypes;
            w && il(
              w,
              E,
              // Resolved for outer only
              "prop",
              kt(v)
            );
          }
          return _ = _C(
            null,
            t,
            v,
            cl(v.type, E),
            // The inner type can have defaults too
            i
          ), _;
        }
      }
      var z = "";
      throw v !== null && typeof v == "object" && v.$$typeof === rt && (z = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + z));
    }
    function Y1(e, t, a, i, u) {
      Am(e, t), t.tag = Q;
      var s;
      return Wl(a) ? (s = !0, Qh(t)) : s = !1, Af(t, u), CC(t, a, i), y0(t, a, i, u), k0(null, t, a, !0, s, u);
    }
    function $1(e, t, a, i) {
      Am(e, t);
      var u = t.pendingProps, s;
      {
        var f = Df(t, a, !1);
        s = Of(t, f);
      }
      Af(t, i);
      var p, v;
      ga(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var g = kt(a) || "Unknown";
          C0[g] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", g, g), C0[g] = !0);
        }
        t.mode & Xt && ul.recordLegacyContextWarning(t, null), Wn(!0), Hp.current = t, p = Bf(null, t, a, u, s, i), v = If(), Wn(!1);
      }
      if (Sa(), t.flags |= ii, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var E = kt(a) || "Unknown";
        Fp[E] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", E, E, E), Fp[E] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var _ = kt(a) || "Unknown";
          Fp[_] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _, _, _), Fp[_] = !0);
        }
        t.tag = Q, t.memoizedState = null, t.updateQueue = null;
        var w = !1;
        return Wl(a) ? (w = !0, Qh(t)) : w = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, wg(t), EC(t, p), y0(t, a, u, i), k0(null, t, a, !0, w, i);
      } else {
        if (t.tag = se, t.mode & Xt) {
          Sn(!0);
          try {
            p = Bf(null, t, a, u, s, i), v = If();
          } finally {
            Sn(!1);
          }
        }
        return Pr() && v && lg(t), ba(null, t, p, i), _0(t, a), t.child;
      }
    }
    function _0(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Mr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), R0[u] || (R0[u] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = kt(t) || "Unknown";
          Pp[f] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Pp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = kt(t) || "Unknown";
          x0[p] || (S("%s: Function components do not support getDerivedStateFromProps.", p), x0[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = kt(t) || "Unknown";
          b0[v] || (S("%s: Function components do not support contextType.", v), b0[v] = !0);
        }
      }
    }
    var D0 = {
      dehydrated: null,
      treeContext: null,
      retryLane: Nt
    };
    function O0(e) {
      return {
        baseLanes: e,
        cachePool: z1(),
        transitions: null
      };
    }
    function Q1(e, t) {
      var a = null;
      return {
        baseLanes: ot(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function W1(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Ng(e, Dp);
    }
    function G1(e, t) {
      return _s(e.childLanes, t);
    }
    function zC(e, t, a) {
      var i = t.pendingProps;
      r_(t) && (t.flags |= Ae);
      var u = ol.current, s = !1, f = (t.flags & Ae) !== Fe;
      if (f || W1(u, e) ? (s = !0, t.flags &= ~Ae) : (e === null || e.memoizedState !== null) && (u = d1(u, BE)), u = Hf(u), Po(t, u), e === null) {
        fg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return Z1(t, v);
        }
        var g = i.children, E = i.fallback;
        if (s) {
          var _ = q1(t, g, E, a), w = t.child;
          return w.memoizedState = O0(a), t.memoizedState = D0, _;
        } else
          return N0(t, g);
      } else {
        var z = e.memoizedState;
        if (z !== null) {
          var H = z.dehydrated;
          if (H !== null)
            return ew(e, t, f, i, H, z, a);
        }
        if (s) {
          var V = i.fallback, he = i.children, Ye = X1(e, t, he, V, a), ze = t.child, wt = e.child.memoizedState;
          return ze.memoizedState = wt === null ? O0(a) : Q1(wt, a), ze.childLanes = G1(e, a), t.memoizedState = D0, Ye;
        } else {
          var Ct = i.children, N = K1(e, t, Ct, a);
          return t.memoizedState = null, N;
        }
      }
    }
    function N0(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = L0(u, i);
      return s.return = e, e.child = s, s;
    }
    function q1(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & gt) === Pe && s !== null ? (p = s, p.childLanes = G, p.pendingProps = f, e.mode & Ut && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Go(a, u, i, null)) : (p = L0(f, u), v = Go(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function L0(e, t, a) {
      return Ab(e, t, G, null);
    }
    function AC(e, t) {
      return sc(e, t);
    }
    function K1(e, t, a, i) {
      var u = e.child, s = u.sibling, f = AC(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & gt) === Pe && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= La) : p.push(s);
      }
      return t.child = f, f;
    }
    function X1(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, g;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & gt) === Pe && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var E = t.child;
        g = E, g.childLanes = G, g.pendingProps = v, t.mode & Ut && (g.actualDuration = 0, g.actualStartTime = -1, g.selfBaseDuration = f.selfBaseDuration, g.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        g = AC(f, v), g.subtreeFlags = f.subtreeFlags & jn;
      var _;
      return p !== null ? _ = sc(p, i) : (_ = Go(i, s, u, null), _.flags |= gn), _.return = t, g.return = t, g.sibling = _, t.child = g, _;
    }
    function zm(e, t, a, i) {
      i !== null && dg(i), Uf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = N0(t, s);
      return f.flags |= gn, t.memoizedState = null, f;
    }
    function J1(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = L0(f, s), v = Go(i, s, u, null);
      return v.flags |= gn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & gt) !== Pe && Uf(t, e.child, null, u), v;
    }
    function Z1(e, t, a) {
      return (e.mode & gt) === Pe ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = Xe) : Ky(t) ? e.lanes = wr : e.lanes = na, null;
    }
    function ew(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Tr) {
          t.flags &= ~Tr;
          var N = g0(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return zm(e, t, f, N);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Ae, null;
          var B = i.children, L = i.fallback, ee = J1(e, t, B, L, f), Ce = t.child;
          return Ce.memoizedState = O0(f), t.memoizedState = D0, ee;
        }
      else {
        if (VT(), (t.mode & gt) === Pe)
          return zm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Ky(u)) {
          var p, v, g;
          {
            var E = aT(u);
            p = E.digest, v = E.message, g = E.stack;
          }
          var _;
          v ? _ = new Error(v) : _ = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var w = g0(_, p, g);
          return zm(e, t, f, w);
        }
        var z = ra(f, e.childLanes);
        if (fl || z) {
          var H = Qm();
          if (H !== null) {
            var V = Id(H, f);
            if (V !== Nt && V !== s.retryLane) {
              s.retryLane = V;
              var he = en;
              Ba(e, V), Cr(H, e, V, he);
            }
          }
          Z0();
          var Ye = g0(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return zm(e, t, f, Ye);
        } else if (iE(u)) {
          t.flags |= Ae, t.child = e.child;
          var ze = Tk.bind(null, e);
          return iT(u, ze), null;
        } else {
          YT(t, u, s.treeContext);
          var wt = i.children, Ct = N0(t, wt);
          return Ct.flags |= Jr, Ct;
        }
      }
    }
    function jC(e, t, a) {
      e.lanes = ot(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = ot(i.lanes, t)), bg(e.return, t, a);
    }
    function tw(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === Te) {
          var u = i.memoizedState;
          u !== null && jC(i, a, e);
        } else if (i.tag === on)
          jC(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function nw(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && pm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function rw(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !T0[e])
        if (T0[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              S('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          S('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function aw(e, t) {
      e !== void 0 && !Um[e] && (e !== "collapsed" && e !== "hidden" ? (Um[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Um[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function HC(e, t) {
      {
        var a = vt(e), i = !a && typeof ut(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function iw(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (vt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!HC(e[a], a))
              return;
        } else {
          var i = ut(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!HC(s.value, f))
                  return;
                f++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function M0(e, t, a, i, u) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = u);
    }
    function FC(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      rw(u), aw(s, u), iw(f, u), ba(e, t, f, a);
      var p = ol.current, v = Ng(p, Dp);
      if (v)
        p = Lg(p, Dp), t.flags |= Ae;
      else {
        var g = e !== null && (e.flags & Ae) !== Fe;
        g && tw(t, t.child, a), p = Hf(p);
      }
      if (Po(t, p), (t.mode & gt) === Pe)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var E = nw(t.child), _;
            E === null ? (_ = t.child, t.child = null) : (_ = E.sibling, E.sibling = null), M0(
              t,
              !1,
              // isBackwards
              _,
              E,
              s
            );
            break;
          }
          case "backwards": {
            var w = null, z = t.child;
            for (t.child = null; z !== null; ) {
              var H = z.alternate;
              if (H !== null && pm(H) === null) {
                t.child = z;
                break;
              }
              var V = z.sibling;
              z.sibling = w, w = z, z = V;
            }
            M0(
              t,
              !0,
              // isBackwards
              w,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            M0(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function lw(e, t, a) {
      _g(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Uf(t, null, i, a) : ba(e, t, i, a), t.child;
    }
    var PC = !1;
    function uw(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || PC || (PC = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && il(v, s, "prop", "Context.Provider");
      }
      if (LE(t, u, p), f !== null) {
        var g = f.value;
        if (X(g, p)) {
          if (f.children === s.children && !Yh())
            return $u(e, t, a);
        } else
          r1(t, u, a);
      }
      var E = s.children;
      return ba(e, t, E, a), t.child;
    }
    var VC = !1;
    function ow(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (VC || (VC = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Af(t, a);
      var f = ar(i);
      ga(t);
      var p;
      return Hp.current = t, Wn(!0), p = s(f), Wn(!1), Sa(), t.flags |= ii, ba(e, t, p, a), t.child;
    }
    function Vp() {
      fl = !0;
    }
    function Am(e, t) {
      (t.mode & gt) === Pe && e !== null && (e.alternate = null, t.alternate = null, t.flags |= gn);
    }
    function $u(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), mC(), Zp(t.lanes), ra(a, t.childLanes) ? (t1(e, t), t.child) : null;
    }
    function sw(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= La) : s.push(e), a.flags |= gn, a;
      }
    }
    function U0(e, t) {
      var a = e.lanes;
      return !!ra(a, t);
    }
    function cw(e, t, a) {
      switch (t.tag) {
        case ne:
          MC(t), t.stateNode, Mf();
          break;
        case le:
          PE(t);
          break;
        case Q: {
          var i = t.type;
          Wl(i) && Qh(t);
          break;
        }
        case me:
          _g(t, t.stateNode.containerInfo);
          break;
        case xe: {
          var u = t.memoizedProps.value, s = t.type._context;
          LE(t, s, u);
          break;
        }
        case ue:
          {
            var f = ra(a, t.childLanes);
            f && (t.flags |= xt);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case Te: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Po(t, Hf(ol.current)), t.flags |= Ae, null;
            var g = t.child, E = g.childLanes;
            if (ra(a, E))
              return zC(e, t, a);
            Po(t, Hf(ol.current));
            var _ = $u(e, t, a);
            return _ !== null ? _.sibling : null;
          } else
            Po(t, Hf(ol.current));
          break;
        }
        case on: {
          var w = (e.flags & Ae) !== Fe, z = ra(a, t.childLanes);
          if (w) {
            if (z)
              return FC(e, t, a);
            t.flags |= Ae;
          }
          var H = t.memoizedState;
          if (H !== null && (H.rendering = null, H.tail = null, H.lastEffect = null), Po(t, ol.current), z)
            break;
          return null;
        }
        case Be:
        case Ft:
          return t.lanes = G, OC(e, t, a);
      }
      return $u(e, t, a);
    }
    function BC(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return sw(e, t, cS(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Yh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          fl = !0;
        else {
          var s = U0(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Ae) === Fe)
            return fl = !1, cw(e, t, a);
          (e.flags & Nc) !== Fe ? fl = !0 : fl = !1;
        }
      } else if (fl = !1, Pr() && zT(t)) {
        var f = t.index, p = AT();
        mE(t, p, f);
      }
      switch (t.lanes = G, t.tag) {
        case We:
          return $1(e, t, t.type, a);
        case Yt: {
          var v = t.elementType;
          return I1(e, t, v, a);
        }
        case se: {
          var g = t.type, E = t.pendingProps, _ = t.elementType === g ? E : cl(g, E);
          return w0(e, t, g, _, a);
        }
        case Q: {
          var w = t.type, z = t.pendingProps, H = t.elementType === w ? z : cl(w, z);
          return LC(e, t, w, H, a);
        }
        case ne:
          return P1(e, t, a);
        case le:
          return V1(e, t, a);
        case ye:
          return B1(e, t);
        case Te:
          return zC(e, t, a);
        case me:
          return lw(e, t, a);
        case je: {
          var V = t.type, he = t.pendingProps, Ye = t.elementType === V ? he : cl(V, he);
          return kC(e, t, V, Ye, a);
        }
        case Le:
          return j1(e, t, a);
        case Je:
          return H1(e, t, a);
        case ue:
          return F1(e, t, a);
        case xe:
          return uw(e, t, a);
        case $:
          return ow(e, t, a);
        case He: {
          var ze = t.type, wt = t.pendingProps, Ct = cl(ze, wt);
          if (t.type !== t.elementType) {
            var N = ze.propTypes;
            N && il(
              N,
              Ct,
              // Resolved for outer only
              "prop",
              kt(ze)
            );
          }
          return Ct = cl(ze.type, Ct), _C(e, t, ze, Ct, a);
        }
        case Ve:
          return DC(e, t, t.type, t.pendingProps, a);
        case Vt: {
          var B = t.type, L = t.pendingProps, ee = t.elementType === B ? L : cl(B, L);
          return Y1(e, t, B, ee, a);
        }
        case on:
          return FC(e, t, a);
        case Dt:
          break;
        case Be:
          return OC(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Yf(e) {
      e.flags |= xt;
    }
    function IC(e) {
      e.flags |= bn, e.flags |= So;
    }
    var YC, z0, $C, QC;
    YC = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === le || u.tag === ye)
          LR(e, u.stateNode);
        else if (u.tag !== me) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, z0 = function(e, t) {
    }, $C = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Dg(), v = UR(f, a, s, i, u, p);
        t.updateQueue = v, v && Yf(t);
      }
    }, QC = function(e, t, a, i) {
      a !== i && Yf(t);
    };
    function Bp(e, t) {
      if (!Pr())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, s = null; u !== null; )
              u.alternate !== null && (s = u), u = u.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Br(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = G, i = Fe;
      if (t) {
        if ((e.mode & Ut) !== Pe) {
          for (var v = e.selfBaseDuration, g = e.child; g !== null; )
            a = ot(a, ot(g.lanes, g.childLanes)), i |= g.subtreeFlags & jn, i |= g.flags & jn, v += g.treeBaseDuration, g = g.sibling;
          e.treeBaseDuration = v;
        } else
          for (var E = e.child; E !== null; )
            a = ot(a, ot(E.lanes, E.childLanes)), i |= E.subtreeFlags & jn, i |= E.flags & jn, E.return = e, E = E.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ut) !== Pe) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = ot(a, ot(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = ot(a, ot(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function fw(e, t, a) {
      if (qT() && (t.mode & gt) !== Pe && (t.flags & Ae) === Fe)
        return xE(t), Mf(), t.flags |= Tr | ds | er, !1;
      var i = Xh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (WT(t), Br(t), (t.mode & Ut) !== Pe) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Mf(), (t.flags & Ae) === Fe && (t.memoizedState = null), t.flags |= xt, Br(t), (t.mode & Ut) !== Pe) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return RE(), !0;
    }
    function WC(e, t, a) {
      var i = t.pendingProps;
      switch (ug(t), t.tag) {
        case We:
        case Yt:
        case Ve:
        case se:
        case je:
        case Le:
        case Je:
        case ue:
        case $:
        case He:
          return Br(t), null;
        case Q: {
          var u = t.type;
          return Wl(u) && $h(t), Br(t), null;
        }
        case ne: {
          var s = t.stateNode;
          if (jf(t), rg(t), Ug(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Xh(t);
            if (f)
              Yf(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Tr) !== Fe) && (t.flags |= Gn, RE());
            }
          }
          return z0(e, t), Br(t), null;
        }
        case le: {
          Og(t);
          var v = FE(), g = t.type;
          if (e !== null && t.stateNode != null)
            $C(e, t, g, i, v), e.ref !== t.ref && IC(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Br(t), null;
            }
            var E = Dg(), _ = Xh(t);
            if (_)
              $T(t, v, E) && Yf(t);
            else {
              var w = NR(g, i, v, E, t);
              YC(w, t, !1, !1), t.stateNode = w, MR(w, g, i, v) && Yf(t);
            }
            t.ref !== null && IC(t);
          }
          return Br(t), null;
        }
        case ye: {
          var z = i;
          if (e && t.stateNode != null) {
            var H = e.memoizedProps;
            QC(e, t, H, z);
          } else {
            if (typeof z != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var V = FE(), he = Dg(), Ye = Xh(t);
            Ye ? QT(t) && Yf(t) : t.stateNode = zR(z, V, he, t);
          }
          return Br(t), null;
        }
        case Te: {
          Ff(t);
          var ze = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var wt = fw(e, t, ze);
            if (!wt)
              return t.flags & er ? t : null;
          }
          if ((t.flags & Ae) !== Fe)
            return t.lanes = a, (t.mode & Ut) !== Pe && i0(t), t;
          var Ct = ze !== null, N = e !== null && e.memoizedState !== null;
          if (Ct !== N && Ct) {
            var B = t.child;
            if (B.flags |= An, (t.mode & gt) !== Pe) {
              var L = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              L || Ng(ol.current, BE) ? dk() : Z0();
            }
          }
          var ee = t.updateQueue;
          if (ee !== null && (t.flags |= xt), Br(t), (t.mode & Ut) !== Pe && Ct) {
            var Ce = t.child;
            Ce !== null && (t.treeBaseDuration -= Ce.treeBaseDuration);
          }
          return null;
        }
        case me:
          return jf(t), z0(e, t), e === null && _T(t.stateNode.containerInfo), Br(t), null;
        case xe:
          var ge = t.type._context;
          return Cg(ge, t), Br(t), null;
        case Vt: {
          var et = t.type;
          return Wl(et) && $h(t), Br(t), null;
        }
        case on: {
          Ff(t);
          var it = t.memoizedState;
          if (it === null)
            return Br(t), null;
          var Zt = (t.flags & Ae) !== Fe, jt = it.rendering;
          if (jt === null)
            if (Zt)
              Bp(it, !1);
            else {
              var Xn = vk() && (e === null || (e.flags & Ae) === Fe);
              if (!Xn)
                for (var Ht = t.child; Ht !== null; ) {
                  var In = pm(Ht);
                  if (In !== null) {
                    Zt = !0, t.flags |= Ae, Bp(it, !1);
                    var ca = In.updateQueue;
                    return ca !== null && (t.updateQueue = ca, t.flags |= xt), t.subtreeFlags = Fe, n1(t, a), Po(t, Lg(ol.current, Dp)), t.child;
                  }
                  Ht = Ht.sibling;
                }
              it.tail !== null && qn() > vb() && (t.flags |= Ae, Zt = !0, Bp(it, !1), t.lanes = Ud);
            }
          else {
            if (!Zt) {
              var Wr = pm(jt);
              if (Wr !== null) {
                t.flags |= Ae, Zt = !0;
                var di = Wr.updateQueue;
                if (di !== null && (t.updateQueue = di, t.flags |= xt), Bp(it, !0), it.tail === null && it.tailMode === "hidden" && !jt.alternate && !Pr())
                  return Br(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              qn() * 2 - it.renderingStartTime > vb() && a !== na && (t.flags |= Ae, Zt = !0, Bp(it, !1), t.lanes = Ud);
            }
            if (it.isBackwards)
              jt.sibling = t.child, t.child = jt;
            else {
              var Ta = it.last;
              Ta !== null ? Ta.sibling = jt : t.child = jt, it.last = jt;
            }
          }
          if (it.tail !== null) {
            var wa = it.tail;
            it.rendering = wa, it.tail = wa.sibling, it.renderingStartTime = qn(), wa.sibling = null;
            var fa = ol.current;
            return Zt ? fa = Lg(fa, Dp) : fa = Hf(fa), Po(t, fa), wa;
          }
          return Br(t), null;
        }
        case Dt:
          break;
        case Be:
        case Ft: {
          J0(t);
          var Ku = t.memoizedState, Jf = Ku !== null;
          if (e !== null) {
            var av = e.memoizedState, tu = av !== null;
            tu !== Jf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !fe && (t.flags |= An);
          }
          return !Jf || (t.mode & gt) === Pe ? Br(t) : ra(eu, na) && (Br(t), t.subtreeFlags & (gn | xt) && (t.flags |= An)), null;
        }
        case Ot:
          return null;
        case Lt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function dw(e, t, a) {
      switch (ug(t), t.tag) {
        case Q: {
          var i = t.type;
          Wl(i) && $h(t);
          var u = t.flags;
          return u & er ? (t.flags = u & ~er | Ae, (t.mode & Ut) !== Pe && i0(t), t) : null;
        }
        case ne: {
          t.stateNode, jf(t), rg(t), Ug();
          var s = t.flags;
          return (s & er) !== Fe && (s & Ae) === Fe ? (t.flags = s & ~er | Ae, t) : null;
        }
        case le:
          return Og(t), null;
        case Te: {
          Ff(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Mf();
          }
          var p = t.flags;
          return p & er ? (t.flags = p & ~er | Ae, (t.mode & Ut) !== Pe && i0(t), t) : null;
        }
        case on:
          return Ff(t), null;
        case me:
          return jf(t), null;
        case xe:
          var v = t.type._context;
          return Cg(v, t), null;
        case Be:
        case Ft:
          return J0(t), null;
        case Ot:
          return null;
        default:
          return null;
      }
    }
    function GC(e, t, a) {
      switch (ug(t), t.tag) {
        case Q: {
          var i = t.type.childContextTypes;
          i != null && $h(t);
          break;
        }
        case ne: {
          t.stateNode, jf(t), rg(t), Ug();
          break;
        }
        case le: {
          Og(t);
          break;
        }
        case me:
          jf(t);
          break;
        case Te:
          Ff(t);
          break;
        case on:
          Ff(t);
          break;
        case xe:
          var u = t.type._context;
          Cg(u, t);
          break;
        case Be:
        case Ft:
          J0(t);
          break;
      }
    }
    var qC = null;
    qC = /* @__PURE__ */ new Set();
    var jm = !1, Ir = !1, pw = typeof WeakSet == "function" ? WeakSet : Set, _e = null, $f = null, Qf = null;
    function vw(e) {
      Dl(null, function() {
        throw e;
      }), fs();
    }
    var hw = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Ut)
        try {
          Jl(), t.componentWillUnmount();
        } finally {
          Xl(e);
        }
      else
        t.componentWillUnmount();
    };
    function KC(e, t) {
      try {
        Io(hr, e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function A0(e, t, a) {
      try {
        hw(e, a);
      } catch (i) {
        dn(e, t, i);
      }
    }
    function mw(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        dn(e, t, i);
      }
    }
    function XC(e, t) {
      try {
        ZC(e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function Wf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Ke && ht && e.mode & Ut)
              try {
                Jl(), i = a(null);
              } finally {
                Xl(e);
              }
            else
              i = a(null);
          } catch (u) {
            dn(e, t, u);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", nt(e));
        } else
          a.current = null;
    }
    function Hm(e, t, a) {
      try {
        a();
      } catch (i) {
        dn(e, t, i);
      }
    }
    var JC = !1;
    function yw(e, t) {
      DR(e.containerInfo), _e = t, gw();
      var a = JC;
      return JC = !1, a;
    }
    function gw() {
      for (; _e !== null; ) {
        var e = _e, t = e.child;
        (e.subtreeFlags & Nl) !== Fe && t !== null ? (t.return = e, _e = t) : Sw();
      }
    }
    function Sw() {
      for (; _e !== null; ) {
        var e = _e;
        Gt(e);
        try {
          Ew(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        fn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, _e = t;
          return;
        }
        _e = e.return;
      }
    }
    function Ew(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Gn) !== Fe) {
        switch (Gt(e), e.tag) {
          case se:
          case je:
          case Ve:
            break;
          case Q: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !ac && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", nt(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", nt(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : cl(e.type, i), u);
              {
                var p = qC;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", nt(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case ne: {
            {
              var v = e.stateNode;
              eT(v.containerInfo);
            }
            break;
          }
          case le:
          case ye:
          case me:
          case Vt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        fn();
      }
    }
    function dl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Vr) !== Ia ? Zi(t) : (e & hr) !== Ia && vs(t), (e & Gl) !== Ia && tv(!0), Hm(t, a, p), (e & Gl) !== Ia && tv(!1), (e & Vr) !== Ia ? zl() : (e & hr) !== Ia && Ld());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Io(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & Vr) !== Ia ? Nd(t) : (e & hr) !== Ia && jc(t);
            var f = s.create;
            (e & Gl) !== Ia && tv(!0), s.destroy = f(), (e & Gl) !== Ia && tv(!1), (e & Vr) !== Ia ? Iv() : (e & hr) !== Ia && Yv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & hr) !== Fe ? v = "useLayoutEffect" : (s.tag & Gl) !== Fe ? v = "useInsertionEffect" : v = "useEffect";
                var g = void 0;
                p === null ? g = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? g = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : g = " You returned: " + p, S("%s must not return anything besides a function, which is used for clean-up.%s", v, g);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function Cw(e, t) {
      if ((t.flags & xt) !== Fe)
        switch (t.tag) {
          case ue: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = vC(), p = t.alternate === null ? "mount" : "update";
            pC() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case ne:
                  var g = v.stateNode;
                  g.passiveEffectDuration += a;
                  break e;
                case ue:
                  var E = v.stateNode;
                  E.passiveEffectDuration += a;
                  break e;
              }
              v = v.return;
            }
            break;
          }
        }
    }
    function bw(e, t, a, i) {
      if ((a.flags & Ml) !== Fe)
        switch (a.tag) {
          case se:
          case je:
          case Ve: {
            if (!Ir)
              if (a.mode & Ut)
                try {
                  Jl(), Io(hr | vr, a);
                } finally {
                  Xl(a);
                }
              else
                Io(hr | vr, a);
            break;
          }
          case Q: {
            var u = a.stateNode;
            if (a.flags & xt && !Ir)
              if (t === null)
                if (a.type === a.elementType && !ac && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", nt(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", nt(a) || "instance")), a.mode & Ut)
                  try {
                    Jl(), u.componentDidMount();
                  } finally {
                    Xl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : cl(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !ac && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", nt(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", nt(a) || "instance")), a.mode & Ut)
                  try {
                    Jl(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Xl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !ac && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", nt(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", nt(a) || "instance")), HE(a, p, u));
            break;
          }
          case ne: {
            var v = a.updateQueue;
            if (v !== null) {
              var g = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case le:
                    g = a.child.stateNode;
                    break;
                  case Q:
                    g = a.child.stateNode;
                    break;
                }
              HE(a, v, g);
            }
            break;
          }
          case le: {
            var E = a.stateNode;
            if (t === null && a.flags & xt) {
              var _ = a.type, w = a.memoizedProps;
              PR(E, _, w);
            }
            break;
          }
          case ye:
            break;
          case me:
            break;
          case ue: {
            {
              var z = a.memoizedProps, H = z.onCommit, V = z.onRender, he = a.stateNode.effectDuration, Ye = vC(), ze = t === null ? "mount" : "update";
              pC() && (ze = "nested-update"), typeof V == "function" && V(a.memoizedProps.id, ze, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Ye);
              {
                typeof H == "function" && H(a.memoizedProps.id, ze, he, Ye), Sk(a);
                var wt = a.return;
                e: for (; wt !== null; ) {
                  switch (wt.tag) {
                    case ne:
                      var Ct = wt.stateNode;
                      Ct.effectDuration += he;
                      break e;
                    case ue:
                      var N = wt.stateNode;
                      N.effectDuration += he;
                      break e;
                  }
                  wt = wt.return;
                }
              }
            }
            break;
          }
          case Te: {
            Ow(e, a);
            break;
          }
          case on:
          case Vt:
          case Dt:
          case Be:
          case Ft:
          case Lt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Ir || a.flags & bn && ZC(a);
    }
    function xw(e) {
      switch (e.tag) {
        case se:
        case je:
        case Ve: {
          if (e.mode & Ut)
            try {
              Jl(), KC(e, e.return);
            } finally {
              Xl(e);
            }
          else
            KC(e, e.return);
          break;
        }
        case Q: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && mw(e, e.return, t), XC(e, e.return);
          break;
        }
        case le: {
          XC(e, e.return);
          break;
        }
      }
    }
    function Rw(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === le) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? KR(u) : JR(i.stateNode, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
          }
        } else if (i.tag === ye) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? XR(s) : ZR(s, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
        } else if (!((i.tag === Be || i.tag === Ft) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function ZC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case le:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Ut)
            try {
              Jl(), u = t(i);
            } finally {
              Xl(e);
            }
          else
            u = t(i);
          typeof u == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", nt(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", nt(e)), t.current = i;
      }
    }
    function Tw(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function eb(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, eb(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === le) {
          var a = e.stateNode;
          a !== null && NT(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function ww(e) {
      for (var t = e.return; t !== null; ) {
        if (tb(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function tb(e) {
      return e.tag === le || e.tag === ne || e.tag === me;
    }
    function nb(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || tb(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== le && t.tag !== ye && t.tag !== tn; ) {
          if (t.flags & gn || t.child === null || t.tag === me)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & gn))
          return t.stateNode;
      }
    }
    function kw(e) {
      var t = ww(e);
      switch (t.tag) {
        case le: {
          var a = t.stateNode;
          t.flags & Ma && (aE(a), t.flags &= ~Ma);
          var i = nb(e);
          H0(e, i, a);
          break;
        }
        case ne:
        case me: {
          var u = t.stateNode.containerInfo, s = nb(e);
          j0(e, s, u);
          break;
        }
        // eslint-disable-next-line-no-fallthrough
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function j0(e, t, a) {
      var i = e.tag, u = i === le || i === ye;
      if (u) {
        var s = e.stateNode;
        t ? QR(a, s, t) : YR(a, s);
      } else if (i !== me) {
        var f = e.child;
        if (f !== null) {
          j0(f, t, a);
          for (var p = f.sibling; p !== null; )
            j0(p, t, a), p = p.sibling;
        }
      }
    }
    function H0(e, t, a) {
      var i = e.tag, u = i === le || i === ye;
      if (u) {
        var s = e.stateNode;
        t ? $R(a, s, t) : IR(a, s);
      } else if (i !== me) {
        var f = e.child;
        if (f !== null) {
          H0(f, t, a);
          for (var p = f.sibling; p !== null; )
            H0(p, t, a), p = p.sibling;
        }
      }
    }
    var Yr = null, pl = !1;
    function _w(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case le: {
              Yr = i.stateNode, pl = !1;
              break e;
            }
            case ne: {
              Yr = i.stateNode.containerInfo, pl = !0;
              break e;
            }
            case me: {
              Yr = i.stateNode.containerInfo, pl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Yr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        rb(e, t, a), Yr = null, pl = !1;
      }
      Tw(a);
    }
    function Yo(e, t, a) {
      for (var i = a.child; i !== null; )
        rb(e, t, i), i = i.sibling;
    }
    function rb(e, t, a) {
      switch (_d(a), a.tag) {
        case le:
          Ir || Wf(a, t);
        // eslint-disable-next-line-no-fallthrough
        case ye: {
          {
            var i = Yr, u = pl;
            Yr = null, Yo(e, t, a), Yr = i, pl = u, Yr !== null && (pl ? GR(Yr, a.stateNode) : WR(Yr, a.stateNode));
          }
          return;
        }
        case tn: {
          Yr !== null && (pl ? qR(Yr, a.stateNode) : qy(Yr, a.stateNode));
          return;
        }
        case me: {
          {
            var s = Yr, f = pl;
            Yr = a.stateNode.containerInfo, pl = !0, Yo(e, t, a), Yr = s, pl = f;
          }
          return;
        }
        case se:
        case je:
        case He:
        case Ve: {
          if (!Ir) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var g = v.next, E = g;
                do {
                  var _ = E, w = _.destroy, z = _.tag;
                  w !== void 0 && ((z & Gl) !== Ia ? Hm(a, t, w) : (z & hr) !== Ia && (vs(a), a.mode & Ut ? (Jl(), Hm(a, t, w), Xl(a)) : Hm(a, t, w), Ld())), E = E.next;
                } while (E !== g);
              }
            }
          }
          Yo(e, t, a);
          return;
        }
        case Q: {
          if (!Ir) {
            Wf(a, t);
            var H = a.stateNode;
            typeof H.componentWillUnmount == "function" && A0(a, t, H);
          }
          Yo(e, t, a);
          return;
        }
        case Dt: {
          Yo(e, t, a);
          return;
        }
        case Be: {
          if (
            // TODO: Remove this dead flag
            a.mode & gt
          ) {
            var V = Ir;
            Ir = V || a.memoizedState !== null, Yo(e, t, a), Ir = V;
          } else
            Yo(e, t, a);
          break;
        }
        default: {
          Yo(e, t, a);
          return;
        }
      }
    }
    function Dw(e) {
      e.memoizedState;
    }
    function Ow(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && vT(s);
          }
        }
      }
    }
    function ab(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new pw()), t.forEach(function(i) {
          var u = wk.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), ta)
              if ($f !== null && Qf !== null)
                ev(Qf, $f);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function Nw(e, t, a) {
      $f = a, Qf = e, Gt(t), ib(t, e), Gt(t), $f = null, Qf = null;
    }
    function vl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            _w(e, t, s);
          } catch (v) {
            dn(s, t, v);
          }
        }
      var f = bl();
      if (t.subtreeFlags & Ll)
        for (var p = t.child; p !== null; )
          Gt(p), ib(p, e), p = p.sibling;
      Gt(f);
    }
    function ib(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case se:
        case je:
        case He:
        case Ve: {
          if (vl(t, e), Zl(e), u & xt) {
            try {
              dl(Gl | vr, e, e.return), Io(Gl | vr, e);
            } catch (et) {
              dn(e, e.return, et);
            }
            if (e.mode & Ut) {
              try {
                Jl(), dl(hr | vr, e, e.return);
              } catch (et) {
                dn(e, e.return, et);
              }
              Xl(e);
            } else
              try {
                dl(hr | vr, e, e.return);
              } catch (et) {
                dn(e, e.return, et);
              }
          }
          return;
        }
        case Q: {
          vl(t, e), Zl(e), u & bn && i !== null && Wf(i, i.return);
          return;
        }
        case le: {
          vl(t, e), Zl(e), u & bn && i !== null && Wf(i, i.return);
          {
            if (e.flags & Ma) {
              var s = e.stateNode;
              try {
                aE(s);
              } catch (et) {
                dn(e, e.return, et);
              }
            }
            if (u & xt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, g = e.type, E = e.updateQueue;
                if (e.updateQueue = null, E !== null)
                  try {
                    VR(f, E, g, v, p, e);
                  } catch (et) {
                    dn(e, e.return, et);
                  }
              }
            }
          }
          return;
        }
        case ye: {
          if (vl(t, e), Zl(e), u & xt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var _ = e.stateNode, w = e.memoizedProps, z = i !== null ? i.memoizedProps : w;
            try {
              BR(_, z, w);
            } catch (et) {
              dn(e, e.return, et);
            }
          }
          return;
        }
        case ne: {
          if (vl(t, e), Zl(e), u & xt && i !== null) {
            var H = i.memoizedState;
            if (H.isDehydrated)
              try {
                pT(t.containerInfo);
              } catch (et) {
                dn(e, e.return, et);
              }
          }
          return;
        }
        case me: {
          vl(t, e), Zl(e);
          return;
        }
        case Te: {
          vl(t, e), Zl(e);
          var V = e.child;
          if (V.flags & An) {
            var he = V.stateNode, Ye = V.memoizedState, ze = Ye !== null;
            if (he.isHidden = ze, ze) {
              var wt = V.alternate !== null && V.alternate.memoizedState !== null;
              wt || fk();
            }
          }
          if (u & xt) {
            try {
              Dw(e);
            } catch (et) {
              dn(e, e.return, et);
            }
            ab(e);
          }
          return;
        }
        case Be: {
          var Ct = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & gt
          ) {
            var N = Ir;
            Ir = N || Ct, vl(t, e), Ir = N;
          } else
            vl(t, e);
          if (Zl(e), u & An) {
            var B = e.stateNode, L = e.memoizedState, ee = L !== null, Ce = e;
            if (B.isHidden = ee, ee && !Ct && (Ce.mode & gt) !== Pe) {
              _e = Ce;
              for (var ge = Ce.child; ge !== null; )
                _e = ge, Mw(ge), ge = ge.sibling;
            }
            Rw(Ce, ee);
          }
          return;
        }
        case on: {
          vl(t, e), Zl(e), u & xt && ab(e);
          return;
        }
        case Dt:
          return;
        default: {
          vl(t, e), Zl(e);
          return;
        }
      }
    }
    function Zl(e) {
      var t = e.flags;
      if (t & gn) {
        try {
          kw(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        e.flags &= ~gn;
      }
      t & Jr && (e.flags &= ~Jr);
    }
    function Lw(e, t, a) {
      $f = a, Qf = t, _e = e, lb(e, t, a), $f = null, Qf = null;
    }
    function lb(e, t, a) {
      for (var i = (e.mode & gt) !== Pe; _e !== null; ) {
        var u = _e, s = u.child;
        if (u.tag === Be && i) {
          var f = u.memoizedState !== null, p = f || jm;
          if (p) {
            F0(e, t, a);
            continue;
          } else {
            var v = u.alternate, g = v !== null && v.memoizedState !== null, E = g || Ir, _ = jm, w = Ir;
            jm = p, Ir = E, Ir && !w && (_e = u, Uw(u));
            for (var z = s; z !== null; )
              _e = z, lb(
                z,
                // New root; bubble back up to here and stop.
                t,
                a
              ), z = z.sibling;
            _e = u, jm = _, Ir = w, F0(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ml) !== Fe && s !== null ? (s.return = u, _e = s) : F0(e, t, a);
      }
    }
    function F0(e, t, a) {
      for (; _e !== null; ) {
        var i = _e;
        if ((i.flags & Ml) !== Fe) {
          var u = i.alternate;
          Gt(i);
          try {
            bw(t, u, i, a);
          } catch (f) {
            dn(i, i.return, f);
          }
          fn();
        }
        if (i === e) {
          _e = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, _e = s;
          return;
        }
        _e = i.return;
      }
    }
    function Mw(e) {
      for (; _e !== null; ) {
        var t = _e, a = t.child;
        switch (t.tag) {
          case se:
          case je:
          case He:
          case Ve: {
            if (t.mode & Ut)
              try {
                Jl(), dl(hr, t, t.return);
              } finally {
                Xl(t);
              }
            else
              dl(hr, t, t.return);
            break;
          }
          case Q: {
            Wf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && A0(t, t.return, i);
            break;
          }
          case le: {
            Wf(t, t.return);
            break;
          }
          case Be: {
            var u = t.memoizedState !== null;
            if (u) {
              ub(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, _e = a) : ub(e);
      }
    }
    function ub(e) {
      for (; _e !== null; ) {
        var t = _e;
        if (t === e) {
          _e = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, _e = a;
          return;
        }
        _e = t.return;
      }
    }
    function Uw(e) {
      for (; _e !== null; ) {
        var t = _e, a = t.child;
        if (t.tag === Be) {
          var i = t.memoizedState !== null;
          if (i) {
            ob(e);
            continue;
          }
        }
        a !== null ? (a.return = t, _e = a) : ob(e);
      }
    }
    function ob(e) {
      for (; _e !== null; ) {
        var t = _e;
        Gt(t);
        try {
          xw(t);
        } catch (i) {
          dn(t, t.return, i);
        }
        if (fn(), t === e) {
          _e = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, _e = a;
          return;
        }
        _e = t.return;
      }
    }
    function zw(e, t, a, i) {
      _e = t, Aw(t, e, a, i);
    }
    function Aw(e, t, a, i) {
      for (; _e !== null; ) {
        var u = _e, s = u.child;
        (u.subtreeFlags & Xi) !== Fe && s !== null ? (s.return = u, _e = s) : jw(e, t, a, i);
      }
    }
    function jw(e, t, a, i) {
      for (; _e !== null; ) {
        var u = _e;
        if ((u.flags & Xr) !== Fe) {
          Gt(u);
          try {
            Hw(t, u, a, i);
          } catch (f) {
            dn(u, u.return, f);
          }
          fn();
        }
        if (u === e) {
          _e = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, _e = s;
          return;
        }
        _e = u.return;
      }
    }
    function Hw(e, t, a, i) {
      switch (t.tag) {
        case se:
        case je:
        case Ve: {
          if (t.mode & Ut) {
            a0();
            try {
              Io(Vr | vr, t);
            } finally {
              r0(t);
            }
          } else
            Io(Vr | vr, t);
          break;
        }
      }
    }
    function Fw(e) {
      _e = e, Pw();
    }
    function Pw() {
      for (; _e !== null; ) {
        var e = _e, t = e.child;
        if ((_e.flags & La) !== Fe) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              _e = u, Iw(u, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var p = f.sibling;
                    f.sibling = null, f = p;
                  } while (f !== null);
                }
              }
            }
            _e = e;
          }
        }
        (e.subtreeFlags & Xi) !== Fe && t !== null ? (t.return = e, _e = t) : Vw();
      }
    }
    function Vw() {
      for (; _e !== null; ) {
        var e = _e;
        (e.flags & Xr) !== Fe && (Gt(e), Bw(e), fn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, _e = t;
          return;
        }
        _e = e.return;
      }
    }
    function Bw(e) {
      switch (e.tag) {
        case se:
        case je:
        case Ve: {
          e.mode & Ut ? (a0(), dl(Vr | vr, e, e.return), r0(e)) : dl(Vr | vr, e, e.return);
          break;
        }
      }
    }
    function Iw(e, t) {
      for (; _e !== null; ) {
        var a = _e;
        Gt(a), $w(a, t), fn();
        var i = a.child;
        i !== null ? (i.return = a, _e = i) : Yw(e);
      }
    }
    function Yw(e) {
      for (; _e !== null; ) {
        var t = _e, a = t.sibling, i = t.return;
        if (eb(t), t === e) {
          _e = null;
          return;
        }
        if (a !== null) {
          a.return = i, _e = a;
          return;
        }
        _e = i;
      }
    }
    function $w(e, t) {
      switch (e.tag) {
        case se:
        case je:
        case Ve: {
          e.mode & Ut ? (a0(), dl(Vr, e, t), r0(e)) : dl(Vr, e, t);
          break;
        }
      }
    }
    function Qw(e) {
      switch (e.tag) {
        case se:
        case je:
        case Ve: {
          try {
            Io(hr | vr, e);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case Q: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
      }
    }
    function Ww(e) {
      switch (e.tag) {
        case se:
        case je:
        case Ve: {
          try {
            Io(Vr | vr, e);
          } catch (t) {
            dn(e, e.return, t);
          }
          break;
        }
      }
    }
    function Gw(e) {
      switch (e.tag) {
        case se:
        case je:
        case Ve: {
          try {
            dl(hr | vr, e, e.return);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case Q: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && A0(e, e.return, t);
          break;
        }
      }
    }
    function qw(e) {
      switch (e.tag) {
        case se:
        case je:
        case Ve:
          try {
            dl(Vr | vr, e, e.return);
          } catch (t) {
            dn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Ip = Symbol.for;
      Ip("selector.component"), Ip("selector.has_pseudo_class"), Ip("selector.role"), Ip("selector.test_id"), Ip("selector.text");
    }
    var Kw = [];
    function Xw() {
      Kw.forEach(function(e) {
        return e();
      });
    }
    var Jw = x.ReactCurrentActQueue;
    function Zw(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function sb() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && Jw.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var ek = Math.ceil, P0 = x.ReactCurrentDispatcher, V0 = x.ReactCurrentOwner, $r = x.ReactCurrentBatchConfig, hl = x.ReactCurrentActQueue, gr = (
      /*             */
      0
    ), cb = (
      /*               */
      1
    ), Qr = (
      /*                */
      2
    ), Pi = (
      /*                */
      4
    ), Qu = 0, Yp = 1, ic = 2, Fm = 3, $p = 4, fb = 5, B0 = 6, Tt = gr, xa = null, Ln = null, Sr = G, eu = G, I0 = Uo(G), Er = Qu, Qp = null, Pm = G, Wp = G, Vm = G, Gp = null, Ya = null, Y0 = 0, db = 500, pb = 1 / 0, tk = 500, Wu = null;
    function qp() {
      pb = qn() + tk;
    }
    function vb() {
      return pb;
    }
    var Bm = !1, $0 = null, Gf = null, lc = !1, $o = null, Kp = G, Q0 = [], W0 = null, nk = 50, Xp = 0, G0 = null, q0 = !1, Im = !1, rk = 50, qf = 0, Ym = null, Jp = en, $m = G, hb = !1;
    function Qm() {
      return xa;
    }
    function Ra() {
      return (Tt & (Qr | Pi)) !== gr ? qn() : (Jp !== en || (Jp = qn()), Jp);
    }
    function Qo(e) {
      var t = e.mode;
      if ((t & gt) === Pe)
        return Xe;
      if ((Tt & Qr) !== gr && Sr !== G)
        return ks(Sr);
      var a = JT() !== XT;
      if (a) {
        if ($r.transition !== null) {
          var i = $r.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return $m === Nt && ($m = Pd()), $m;
      }
      var u = Fa();
      if (u !== Nt)
        return u;
      var s = AR();
      return s;
    }
    function ak(e) {
      var t = e.mode;
      return (t & gt) === Pe ? Xe : Kv();
    }
    function Cr(e, t, a, i) {
      _k(), hb && S("useInsertionEffect must not schedule updates."), q0 && (Im = !0), xo(e, a, i), (Tt & Qr) !== G && e === xa ? Nk(t) : (ta && Os(e, t, a), Lk(t), e === xa && ((Tt & Qr) === gr && (Wp = ot(Wp, a)), Er === $p && Wo(e, Sr)), $a(e, i), a === Xe && Tt === gr && (t.mode & gt) === Pe && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !hl.isBatchingLegacy && (qp(), hE()));
    }
    function ik(e, t, a) {
      var i = e.current;
      i.lanes = t, xo(e, t, a), $a(e, a);
    }
    function lk(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Tt & Qr) !== gr
      );
    }
    function $a(e, t) {
      var a = e.callbackNode;
      rf(e, t);
      var i = nf(e, e === xa ? Sr : G);
      if (i === G) {
        a !== null && Nb(a), e.callbackNode = null, e.callbackPriority = Nt;
        return;
      }
      var u = Hl(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(hl.current !== null && a !== nS)) {
        a == null && s !== Xe && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && Nb(a);
      var f;
      if (u === Xe)
        e.tag === zo ? (hl.isBatchingLegacy !== null && (hl.didScheduleLegacyUpdate = !0), UT(gb.bind(null, e))) : vE(gb.bind(null, e)), hl.current !== null ? hl.current.push(Ao) : HR(function() {
          (Tt & (Qr | Pi)) === gr && Ao();
        }), f = null;
      else {
        var p;
        switch (rh(i)) {
          case zr:
            p = ps;
            break;
          case Oi:
            p = Ul;
            break;
          case ja:
            p = Ji;
            break;
          case Ha:
            p = Eu;
            break;
          default:
            p = Ji;
            break;
        }
        f = rS(p, mb.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function mb(e, t) {
      if (R1(), Jp = en, $m = G, (Tt & (Qr | Pi)) !== gr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = qu();
      if (i && e.callbackNode !== a)
        return null;
      var u = nf(e, e === xa ? Sr : G);
      if (u === G)
        return null;
      var s = !lf(e, u) && !qv(e, u) && !t, f = s ? mk(e, u) : Gm(e, u);
      if (f !== Qu) {
        if (f === ic) {
          var p = af(e);
          p !== G && (u = p, f = K0(e, p));
        }
        if (f === Yp) {
          var v = Qp;
          throw uc(e, G), Wo(e, u), $a(e, qn()), v;
        }
        if (f === B0)
          Wo(e, u);
        else {
          var g = !lf(e, u), E = e.current.alternate;
          if (g && !ok(E)) {
            if (f = Gm(e, u), f === ic) {
              var _ = af(e);
              _ !== G && (u = _, f = K0(e, _));
            }
            if (f === Yp) {
              var w = Qp;
              throw uc(e, G), Wo(e, u), $a(e, qn()), w;
            }
          }
          e.finishedWork = E, e.finishedLanes = u, uk(e, f, u);
        }
      }
      return $a(e, qn()), e.callbackNode === a ? mb.bind(null, e) : null;
    }
    function K0(e, t) {
      var a = Gp;
      if (sf(e)) {
        var i = uc(e, t);
        i.flags |= Tr, kT(e.containerInfo);
      }
      var u = Gm(e, t);
      if (u !== ic) {
        var s = Ya;
        Ya = a, s !== null && yb(s);
      }
      return u;
    }
    function yb(e) {
      Ya === null ? Ya = e : Ya.push.apply(Ya, e);
    }
    function uk(e, t, a) {
      switch (t) {
        case Qu:
        case Yp:
          throw new Error("Root did not complete. This is a bug in React.");
        // Flow knows about invariant, so it complains if I add a break
        // statement, but eslint doesn't know about invariant, so it complains
        // if I do. eslint-disable-next-line no-fallthrough
        case ic: {
          oc(e, Ya, Wu);
          break;
        }
        case Fm: {
          if (Wo(e, a), Nu(a) && // do not delay if we're inside an act() scope
          !Lb()) {
            var i = Y0 + db - qn();
            if (i > 10) {
              var u = nf(e, G);
              if (u !== G)
                break;
              var s = e.suspendedLanes;
              if (!Lu(s, a)) {
                Ra(), uf(e, s);
                break;
              }
              e.timeoutHandle = Wy(oc.bind(null, e, Ya, Wu), i);
              break;
            }
          }
          oc(e, Ya, Wu);
          break;
        }
        case $p: {
          if (Wo(e, a), Hd(a))
            break;
          if (!Lb()) {
            var f = ui(e, a), p = f, v = qn() - p, g = kk(v) - v;
            if (g > 10) {
              e.timeoutHandle = Wy(oc.bind(null, e, Ya, Wu), g);
              break;
            }
          }
          oc(e, Ya, Wu);
          break;
        }
        case fb: {
          oc(e, Ya, Wu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function ok(e) {
      for (var t = e; ; ) {
        if (t.flags & go) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!X(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & go && v !== null) {
          v.return = t, t = v;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function Wo(e, t) {
      t = _s(t, Vm), t = _s(t, Wp), Zv(e, t);
    }
    function gb(e) {
      if (T1(), (Tt & (Qr | Pi)) !== gr)
        throw new Error("Should not already be working.");
      qu();
      var t = nf(e, G);
      if (!ra(t, Xe))
        return $a(e, qn()), null;
      var a = Gm(e, t);
      if (e.tag !== zo && a === ic) {
        var i = af(e);
        i !== G && (t = i, a = K0(e, i));
      }
      if (a === Yp) {
        var u = Qp;
        throw uc(e, G), Wo(e, t), $a(e, qn()), u;
      }
      if (a === B0)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, oc(e, Ya, Wu), $a(e, qn()), null;
    }
    function sk(e, t) {
      t !== G && (of(e, ot(t, Xe)), $a(e, qn()), (Tt & (Qr | Pi)) === gr && (qp(), Ao()));
    }
    function X0(e, t) {
      var a = Tt;
      Tt |= cb;
      try {
        return e(t);
      } finally {
        Tt = a, Tt === gr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !hl.isBatchingLegacy && (qp(), hE());
      }
    }
    function ck(e, t, a, i, u) {
      var s = Fa(), f = $r.transition;
      try {
        return $r.transition = null, Pn(zr), e(t, a, i, u);
      } finally {
        Pn(s), $r.transition = f, Tt === gr && qp();
      }
    }
    function Gu(e) {
      $o !== null && $o.tag === zo && (Tt & (Qr | Pi)) === gr && qu();
      var t = Tt;
      Tt |= cb;
      var a = $r.transition, i = Fa();
      try {
        return $r.transition = null, Pn(zr), e ? e() : void 0;
      } finally {
        Pn(i), $r.transition = a, Tt = t, (Tt & (Qr | Pi)) === gr && Ao();
      }
    }
    function Sb() {
      return (Tt & (Qr | Pi)) !== gr;
    }
    function Wm(e, t) {
      oa(I0, eu, e), eu = ot(eu, t);
    }
    function J0(e) {
      eu = I0.current, ua(I0, e);
    }
    function uc(e, t) {
      e.finishedWork = null, e.finishedLanes = G;
      var a = e.timeoutHandle;
      if (a !== Gy && (e.timeoutHandle = Gy, jR(a)), Ln !== null)
        for (var i = Ln.return; i !== null; ) {
          var u = i.alternate;
          GC(u, i), i = i.return;
        }
      xa = e;
      var s = sc(e.current, null);
      return Ln = s, Sr = eu = t, Er = Qu, Qp = null, Pm = G, Wp = G, Vm = G, Gp = null, Ya = null, i1(), ul.discardPendingWarnings(), s;
    }
    function Eb(e, t) {
      do {
        var a = Ln;
        try {
          if (rm(), YE(), fn(), V0.current = null, a === null || a.return === null) {
            Er = Yp, Qp = t, Ln = null;
            return;
          }
          if (Ke && a.mode & Ut && Lm(a, !0), Ze)
            if (Sa(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Di(a, i, Sr);
            } else
              hs(a, t, Sr);
          U1(e, a.return, a, t, Sr), Rb(a);
        } catch (u) {
          t = u, Ln === a && a !== null ? (a = a.return, Ln = a) : a = Ln;
          continue;
        }
        return;
      } while (!0);
    }
    function Cb() {
      var e = P0.current;
      return P0.current = km, e === null ? km : e;
    }
    function bb(e) {
      P0.current = e;
    }
    function fk() {
      Y0 = qn();
    }
    function Zp(e) {
      Pm = ot(e, Pm);
    }
    function dk() {
      Er === Qu && (Er = Fm);
    }
    function Z0() {
      (Er === Qu || Er === Fm || Er === ic) && (Er = $p), xa !== null && (ws(Pm) || ws(Wp)) && Wo(xa, Sr);
    }
    function pk(e) {
      Er !== $p && (Er = ic), Gp === null ? Gp = [e] : Gp.push(e);
    }
    function vk() {
      return Er === Qu;
    }
    function Gm(e, t) {
      var a = Tt;
      Tt |= Qr;
      var i = Cb();
      if (xa !== e || Sr !== t) {
        if (ta) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (ev(e, Sr), u.clear()), eh(e, t);
        }
        Wu = Yd(), uc(e, t);
      }
      Ru(t);
      do
        try {
          hk();
          break;
        } catch (s) {
          Eb(e, s);
        }
      while (!0);
      if (rm(), Tt = a, bb(i), Ln !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Hc(), xa = null, Sr = G, Er;
    }
    function hk() {
      for (; Ln !== null; )
        xb(Ln);
    }
    function mk(e, t) {
      var a = Tt;
      Tt |= Qr;
      var i = Cb();
      if (xa !== e || Sr !== t) {
        if (ta) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (ev(e, Sr), u.clear()), eh(e, t);
        }
        Wu = Yd(), qp(), uc(e, t);
      }
      Ru(t);
      do
        try {
          yk();
          break;
        } catch (s) {
          Eb(e, s);
        }
      while (!0);
      return rm(), bb(i), Tt = a, Ln !== null ? ($v(), Qu) : (Hc(), xa = null, Sr = G, Er);
    }
    function yk() {
      for (; Ln !== null && !xd(); )
        xb(Ln);
    }
    function xb(e) {
      var t = e.alternate;
      Gt(e);
      var a;
      (e.mode & Ut) !== Pe ? (n0(e), a = eS(t, e, eu), Lm(e, !0)) : a = eS(t, e, eu), fn(), e.memoizedProps = e.pendingProps, a === null ? Rb(e) : Ln = a, V0.current = null;
    }
    function Rb(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & ds) === Fe) {
          Gt(t);
          var u = void 0;
          if ((t.mode & Ut) === Pe ? u = WC(a, t, eu) : (n0(t), u = WC(a, t, eu), Lm(t, !1)), fn(), u !== null) {
            Ln = u;
            return;
          }
        } else {
          var s = dw(a, t);
          if (s !== null) {
            s.flags &= Fv, Ln = s;
            return;
          }
          if ((t.mode & Ut) !== Pe) {
            Lm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= ds, i.subtreeFlags = Fe, i.deletions = null;
          else {
            Er = B0, Ln = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          Ln = v;
          return;
        }
        t = i, Ln = t;
      } while (t !== null);
      Er === Qu && (Er = fb);
    }
    function oc(e, t, a) {
      var i = Fa(), u = $r.transition;
      try {
        $r.transition = null, Pn(zr), gk(e, t, a, i);
      } finally {
        $r.transition = u, Pn(i);
      }
      return null;
    }
    function gk(e, t, a, i) {
      do
        qu();
      while ($o !== null);
      if (Dk(), (Tt & (Qr | Pi)) !== gr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Dd(s), u === null)
        return Od(), null;
      if (s === G && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = G, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Nt;
      var f = ot(u.lanes, u.childLanes);
      Bd(e, f), e === xa && (xa = null, Ln = null, Sr = G), ((u.subtreeFlags & Xi) !== Fe || (u.flags & Xi) !== Fe) && (lc || (lc = !0, W0 = a, rS(Ji, function() {
        return qu(), null;
      })));
      var p = (u.subtreeFlags & (Nl | Ll | Ml | Xi)) !== Fe, v = (u.flags & (Nl | Ll | Ml | Xi)) !== Fe;
      if (p || v) {
        var g = $r.transition;
        $r.transition = null;
        var E = Fa();
        Pn(zr);
        var _ = Tt;
        Tt |= Pi, V0.current = null, yw(e, u), hC(), Nw(e, u, s), OR(e.containerInfo), e.current = u, ms(s), Lw(u, e, s), ys(), Rd(), Tt = _, Pn(E), $r.transition = g;
      } else
        e.current = u, hC();
      var w = lc;
      if (lc ? (lc = !1, $o = e, Kp = s) : (qf = 0, Ym = null), f = e.pendingLanes, f === G && (Gf = null), w || _b(e.current, !1), wd(u.stateNode, i), ta && e.memoizedUpdaters.clear(), Xw(), $a(e, qn()), t !== null)
        for (var z = e.onRecoverableError, H = 0; H < t.length; H++) {
          var V = t[H], he = V.stack, Ye = V.digest;
          z(V.value, {
            componentStack: he,
            digest: Ye
          });
        }
      if (Bm) {
        Bm = !1;
        var ze = $0;
        throw $0 = null, ze;
      }
      return ra(Kp, Xe) && e.tag !== zo && qu(), f = e.pendingLanes, ra(f, Xe) ? (x1(), e === G0 ? Xp++ : (Xp = 0, G0 = e)) : Xp = 0, Ao(), Od(), null;
    }
    function qu() {
      if ($o !== null) {
        var e = rh(Kp), t = Ls(ja, e), a = $r.transition, i = Fa();
        try {
          return $r.transition = null, Pn(t), Ek();
        } finally {
          Pn(i), $r.transition = a;
        }
      }
      return !1;
    }
    function Sk(e) {
      Q0.push(e), lc || (lc = !0, rS(Ji, function() {
        return qu(), null;
      }));
    }
    function Ek() {
      if ($o === null)
        return !1;
      var e = W0;
      W0 = null;
      var t = $o, a = Kp;
      if ($o = null, Kp = G, (Tt & (Qr | Pi)) !== gr)
        throw new Error("Cannot flush passive effects while already rendering.");
      q0 = !0, Im = !1, xu(a);
      var i = Tt;
      Tt |= Pi, Fw(t.current), zw(t, t.current, a, e);
      {
        var u = Q0;
        Q0 = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          Cw(t, f);
        }
      }
      Md(), _b(t.current, !0), Tt = i, Ao(), Im ? t === Ym ? qf++ : (qf = 0, Ym = t) : qf = 0, q0 = !1, Im = !1, kd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function Tb(e) {
      return Gf !== null && Gf.has(e);
    }
    function Ck(e) {
      Gf === null ? Gf = /* @__PURE__ */ new Set([e]) : Gf.add(e);
    }
    function bk(e) {
      Bm || (Bm = !0, $0 = e);
    }
    var xk = bk;
    function wb(e, t, a) {
      var i = rc(a, t), u = xC(e, i, Xe), s = Ho(e, u, Xe), f = Ra();
      s !== null && (xo(s, Xe, f), $a(s, f));
    }
    function dn(e, t, a) {
      if (vw(a), tv(!1), e.tag === ne) {
        wb(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === ne) {
          wb(i, e, a);
          return;
        } else if (i.tag === Q) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !Tb(s)) {
            var f = rc(a, e), p = E0(i, f, Xe), v = Ho(i, p, Xe), g = Ra();
            v !== null && (xo(v, Xe, g), $a(v, g));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function Rk(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ra();
      uf(e, a), Mk(e), xa === e && Lu(Sr, a) && (Er === $p || Er === Fm && Nu(Sr) && qn() - Y0 < db ? uc(e, G) : Vm = ot(Vm, a)), $a(e, u);
    }
    function kb(e, t) {
      t === Nt && (t = ak(e));
      var a = Ra(), i = Ba(e, t);
      i !== null && (xo(i, t, a), $a(i, a));
    }
    function Tk(e) {
      var t = e.memoizedState, a = Nt;
      t !== null && (a = t.retryLane), kb(e, a);
    }
    function wk(e, t) {
      var a = Nt, i;
      switch (e.tag) {
        case Te:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case on:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), kb(e, a);
    }
    function kk(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : ek(e / 1960) * 1960;
    }
    function _k() {
      if (Xp > nk)
        throw Xp = 0, G0 = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      qf > rk && (qf = 0, Ym = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function Dk() {
      ul.flushLegacyContextWarning(), ul.flushPendingUnsafeLifecycleWarnings();
    }
    function _b(e, t) {
      Gt(e), qm(e, Ol, Gw), t && qm(e, wi, qw), qm(e, Ol, Qw), t && qm(e, wi, Ww), fn();
    }
    function qm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Fe ? i = i.child : ((i.flags & t) !== Fe && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Km = null;
    function Db(e) {
      {
        if ((Tt & Qr) !== gr || !(e.mode & gt))
          return;
        var t = e.tag;
        if (t !== We && t !== ne && t !== Q && t !== se && t !== je && t !== He && t !== Ve)
          return;
        var a = nt(e) || "ReactComponent";
        if (Km !== null) {
          if (Km.has(a))
            return;
          Km.add(a);
        } else
          Km = /* @__PURE__ */ new Set([a]);
        var i = sr;
        try {
          Gt(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Gt(e) : fn();
        }
      }
    }
    var eS;
    {
      var Ok = null;
      eS = function(e, t, a) {
        var i = jb(Ok, t);
        try {
          return BC(e, t, a);
        } catch (s) {
          if (BT() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (rm(), YE(), GC(e, t), jb(t, i), t.mode & Ut && n0(t), Dl(null, BC, null, e, t, a), qi()) {
            var u = fs();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var Ob = !1, tS;
    tS = /* @__PURE__ */ new Set();
    function Nk(e) {
      if (Si && !E1())
        switch (e.tag) {
          case se:
          case je:
          case Ve: {
            var t = Ln && nt(Ln) || "Unknown", a = t;
            if (!tS.has(a)) {
              tS.add(a);
              var i = nt(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case Q: {
            Ob || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), Ob = !0);
            break;
          }
        }
    }
    function ev(e, t) {
      if (ta) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Os(e, i, t);
        });
      }
    }
    var nS = {};
    function rS(e, t) {
      {
        var a = hl.current;
        return a !== null ? (a.push(t), nS) : bd(e, t);
      }
    }
    function Nb(e) {
      if (e !== nS)
        return Vv(e);
    }
    function Lb() {
      return hl.current !== null;
    }
    function Lk(e) {
      {
        if (e.mode & gt) {
          if (!sb())
            return;
        } else if (!Zw() || Tt !== gr || e.tag !== se && e.tag !== je && e.tag !== Ve)
          return;
        if (hl.current === null) {
          var t = sr;
          try {
            Gt(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, nt(e));
          } finally {
            t ? Gt(e) : fn();
          }
        }
      }
    }
    function Mk(e) {
      e.tag !== zo && sb() && hl.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function tv(e) {
      hb = e;
    }
    var Vi = null, Kf = null, Uk = function(e) {
      Vi = e;
    };
    function Xf(e) {
      {
        if (Vi === null)
          return e;
        var t = Vi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function aS(e) {
      return Xf(e);
    }
    function iS(e) {
      {
        if (Vi === null)
          return e;
        var t = Vi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Xf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: W,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function Mb(e, t) {
      {
        if (Vi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case Q: {
            typeof i == "function" && (u = !0);
            break;
          }
          case se: {
            (typeof i == "function" || s === rt) && (u = !0);
            break;
          }
          case je: {
            (s === W || s === rt) && (u = !0);
            break;
          }
          case He:
          case Ve: {
            (s === lt || s === rt) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = Vi(a);
          if (f !== void 0 && f === Vi(i))
            return !0;
        }
        return !1;
      }
    }
    function Ub(e) {
      {
        if (Vi === null || typeof WeakSet != "function")
          return;
        Kf === null && (Kf = /* @__PURE__ */ new WeakSet()), Kf.add(e);
      }
    }
    var zk = function(e, t) {
      {
        if (Vi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        qu(), Gu(function() {
          lS(e.current, i, a);
        });
      }
    }, Ak = function(e, t) {
      {
        if (e.context !== ci)
          return;
        qu(), Gu(function() {
          nv(t, e, null, null);
        });
      }
    };
    function lS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case se:
          case Ve:
          case Q:
            v = p;
            break;
          case je:
            v = p.render;
            break;
        }
        if (Vi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var g = !1, E = !1;
        if (v !== null) {
          var _ = Vi(v);
          _ !== void 0 && (a.has(_) ? E = !0 : t.has(_) && (f === Q ? E = !0 : g = !0));
        }
        if (Kf !== null && (Kf.has(e) || i !== null && Kf.has(i)) && (E = !0), E && (e._debugNeedsRemount = !0), E || g) {
          var w = Ba(e, Xe);
          w !== null && Cr(w, e, Xe, en);
        }
        u !== null && !E && lS(u, t, a), s !== null && lS(s, t, a);
      }
    }
    var jk = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return uS(e.current, i, a), a;
      }
    };
    function uS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case se:
          case Ve:
          case Q:
            p = f;
            break;
          case je:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? Hk(e, a) : i !== null && uS(i, t, a), u !== null && uS(u, t, a);
      }
    }
    function Hk(e, t) {
      {
        var a = Fk(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case le:
              t.add(i.stateNode);
              return;
            case me:
              t.add(i.stateNode.containerInfo);
              return;
            case ne:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function Fk(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === le)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var oS;
    {
      oS = !1;
      try {
        var zb = Object.preventExtensions({});
      } catch {
        oS = !0;
      }
    }
    function Pk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Fe, this.subtreeFlags = Fe, this.deletions = null, this.lanes = G, this.childLanes = G, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !oS && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var fi = function(e, t, a, i) {
      return new Pk(e, t, a, i);
    };
    function sS(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Vk(e) {
      return typeof e == "function" && !sS(e) && e.defaultProps === void 0;
    }
    function Bk(e) {
      if (typeof e == "function")
        return sS(e) ? Q : se;
      if (e != null) {
        var t = e.$$typeof;
        if (t === W)
          return je;
        if (t === lt)
          return He;
      }
      return We;
    }
    function sc(e, t) {
      var a = e.alternate;
      a === null ? (a = fi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Fe, a.subtreeFlags = Fe, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & jn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case We:
        case se:
        case Ve:
          a.type = Xf(e.type);
          break;
        case Q:
          a.type = aS(e.type);
          break;
        case je:
          a.type = iS(e.type);
          break;
      }
      return a;
    }
    function Ik(e, t) {
      e.flags &= jn | gn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = G, e.lanes = t, e.child = null, e.subtreeFlags = Fe, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Fe, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function Yk(e, t, a) {
      var i;
      return e === Wh ? (i = gt, t === !0 && (i |= Xt, i |= zt)) : i = Pe, ta && (i |= Ut), fi(ne, null, null, i);
    }
    function cS(e, t, a, i, u, s) {
      var f = We, p = e;
      if (typeof e == "function")
        sS(e) ? (f = Q, p = aS(p)) : p = Xf(p);
      else if (typeof e == "string")
        f = le;
      else
        e: switch (e) {
          case hi:
            return Go(a.children, u, s, t);
          case Ka:
            f = Je, u |= Xt, (u & gt) !== Pe && (u |= zt);
            break;
          case mi:
            return $k(a, u, s, t);
          case pe:
            return Qk(a, u, s, t);
          case Re:
            return Wk(a, u, s, t);
          case wn:
            return Ab(a, u, s, t);
          case an:
          // eslint-disable-next-line no-fallthrough
          case St:
          // eslint-disable-next-line no-fallthrough
          case cn:
          // eslint-disable-next-line no-fallthrough
          case or:
          // eslint-disable-next-line no-fallthrough
          case yt:
          // eslint-disable-next-line no-fallthrough
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case yi:
                  f = xe;
                  break e;
                case R:
                  f = $;
                  break e;
                case W:
                  f = je, p = iS(p);
                  break e;
                case lt:
                  f = He;
                  break e;
                case rt:
                  f = Yt, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var g = i ? nt(i) : null;
              g && (v += `

Check the render method of \`` + g + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var E = fi(f, a, t, u);
      return E.elementType = e, E.type = p, E.lanes = s, E._debugOwner = i, E;
    }
    function fS(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = cS(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Go(e, t, a, i) {
      var u = fi(Le, e, i, t);
      return u.lanes = a, u;
    }
    function $k(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = fi(ue, e, i, t | Ut);
      return u.elementType = mi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function Qk(e, t, a, i) {
      var u = fi(Te, e, i, t);
      return u.elementType = pe, u.lanes = a, u;
    }
    function Wk(e, t, a, i) {
      var u = fi(on, e, i, t);
      return u.elementType = Re, u.lanes = a, u;
    }
    function Ab(e, t, a, i) {
      var u = fi(Be, e, i, t);
      u.elementType = wn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function dS(e, t, a) {
      var i = fi(ye, e, null, t);
      return i.lanes = a, i;
    }
    function Gk() {
      var e = fi(le, null, null, Pe);
      return e.elementType = "DELETED", e;
    }
    function qk(e) {
      var t = fi(tn, null, null, Pe);
      return t.stateNode = e, t;
    }
    function pS(e, t, a) {
      var i = e.children !== null ? e.children : [], u = fi(me, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function jb(e, t) {
      return e === null && (e = fi(We, null, null, Pe)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Kk(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Gy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Nt, this.eventTimes = Ds(G), this.expirationTimes = Ds(en), this.pendingLanes = G, this.suspendedLanes = G, this.pingedLanes = G, this.expiredLanes = G, this.mutableReadLanes = G, this.finishedLanes = G, this.entangledLanes = G, this.entanglements = Ds(G), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Tu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Wh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case zo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Hb(e, t, a, i, u, s, f, p, v, g) {
      var E = new Kk(e, t, a, p, v), _ = Yk(t, s);
      E.current = _, _.stateNode = E;
      {
        var w = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        _.memoizedState = w;
      }
      return wg(_), E;
    }
    var vS = "18.3.1";
    function Xk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Gr(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: ur,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var hS, mS;
    hS = !1, mS = {};
    function Fb(e) {
      if (!e)
        return ci;
      var t = yo(e), a = MT(t);
      if (t.tag === Q) {
        var i = t.type;
        if (Wl(i))
          return dE(t, i, a);
      }
      return a;
    }
    function Jk(e, t) {
      {
        var a = yo(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Zr(a);
        if (u === null)
          return null;
        if (u.mode & Xt) {
          var s = nt(a) || "Component";
          if (!mS[s]) {
            mS[s] = !0;
            var f = sr;
            try {
              Gt(u), a.mode & Xt ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Gt(f) : fn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function Pb(e, t, a, i, u, s, f, p) {
      var v = !1, g = null;
      return Hb(e, t, v, g, a, i, u, s, f);
    }
    function Vb(e, t, a, i, u, s, f, p, v, g) {
      var E = !0, _ = Hb(a, i, E, e, u, s, f, p, v);
      _.context = Fb(null);
      var w = _.current, z = Ra(), H = Qo(w), V = Yu(z, H);
      return V.callback = t ?? null, Ho(w, V, H), ik(_, H, z), _;
    }
    function nv(e, t, a, i) {
      Td(t, e);
      var u = t.current, s = Ra(), f = Qo(u);
      En(f);
      var p = Fb(a);
      t.context === null ? t.context = p : t.pendingContext = p, Si && sr !== null && !hS && (hS = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, nt(sr) || "Unknown"));
      var v = Yu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var g = Ho(u, v, f);
      return g !== null && (Cr(g, u, f, s), om(g, u, f)), f;
    }
    function Xm(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case le:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function Zk(e) {
      switch (e.tag) {
        case ne: {
          var t = e.stateNode;
          if (sf(t)) {
            var a = Wv(t);
            sk(t, a);
          }
          break;
        }
        case Te: {
          Gu(function() {
            var u = Ba(e, Xe);
            if (u !== null) {
              var s = Ra();
              Cr(u, e, Xe, s);
            }
          });
          var i = Xe;
          yS(e, i);
          break;
        }
      }
    }
    function Bb(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Jv(a.retryLane, t));
    }
    function yS(e, t) {
      Bb(e, t);
      var a = e.alternate;
      a && Bb(a, t);
    }
    function e_(e) {
      if (e.tag === Te) {
        var t = xs, a = Ba(e, t);
        if (a !== null) {
          var i = Ra();
          Cr(a, e, t, i);
        }
        yS(e, t);
      }
    }
    function t_(e) {
      if (e.tag === Te) {
        var t = Qo(e), a = Ba(e, t);
        if (a !== null) {
          var i = Ra();
          Cr(a, e, t, i);
        }
        yS(e, t);
      }
    }
    function Ib(e) {
      var t = pn(e);
      return t === null ? null : t.stateNode;
    }
    var Yb = function(e) {
      return null;
    };
    function n_(e) {
      return Yb(e);
    }
    var $b = function(e) {
      return !1;
    };
    function r_(e) {
      return $b(e);
    }
    var Qb = null, Wb = null, Gb = null, qb = null, Kb = null, Xb = null, Jb = null, Zb = null, ex = null;
    {
      var tx = function(e, t, a) {
        var i = t[a], u = vt(e) ? e.slice() : ct({}, e);
        return a + 1 === t.length ? (vt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = tx(e[i], t, a + 1), u);
      }, nx = function(e, t) {
        return tx(e, t, 0);
      }, rx = function(e, t, a, i) {
        var u = t[i], s = vt(e) ? e.slice() : ct({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], vt(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = rx(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, ax = function(e, t, a) {
        if (t.length !== a.length) {
          Ne("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              Ne("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return rx(e, t, a, 0);
      }, ix = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = vt(e) ? e.slice() : ct({}, e);
        return s[u] = ix(e[u], t, a + 1, i), s;
      }, lx = function(e, t, a) {
        return ix(e, t, 0, a);
      }, gS = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Qb = function(e, t, a, i) {
        var u = gS(e, t);
        if (u !== null) {
          var s = lx(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = ct({}, e.memoizedProps);
          var f = Ba(e, Xe);
          f !== null && Cr(f, e, Xe, en);
        }
      }, Wb = function(e, t, a) {
        var i = gS(e, t);
        if (i !== null) {
          var u = nx(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = ct({}, e.memoizedProps);
          var s = Ba(e, Xe);
          s !== null && Cr(s, e, Xe, en);
        }
      }, Gb = function(e, t, a, i) {
        var u = gS(e, t);
        if (u !== null) {
          var s = ax(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = ct({}, e.memoizedProps);
          var f = Ba(e, Xe);
          f !== null && Cr(f, e, Xe, en);
        }
      }, qb = function(e, t, a) {
        e.pendingProps = lx(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ba(e, Xe);
        i !== null && Cr(i, e, Xe, en);
      }, Kb = function(e, t) {
        e.pendingProps = nx(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ba(e, Xe);
        a !== null && Cr(a, e, Xe, en);
      }, Xb = function(e, t, a) {
        e.pendingProps = ax(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ba(e, Xe);
        i !== null && Cr(i, e, Xe, en);
      }, Jb = function(e) {
        var t = Ba(e, Xe);
        t !== null && Cr(t, e, Xe, en);
      }, Zb = function(e) {
        Yb = e;
      }, ex = function(e) {
        $b = e;
      };
    }
    function a_(e) {
      var t = Zr(e);
      return t === null ? null : t.stateNode;
    }
    function i_(e) {
      return null;
    }
    function l_() {
      return sr;
    }
    function u_(e) {
      var t = e.findFiberByHostInstance, a = x.ReactCurrentDispatcher;
      return Eo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Qb,
        overrideHookStateDeletePath: Wb,
        overrideHookStateRenamePath: Gb,
        overrideProps: qb,
        overridePropsDeletePath: Kb,
        overridePropsRenamePath: Xb,
        setErrorHandler: Zb,
        setSuspenseHandler: ex,
        scheduleUpdate: Jb,
        currentDispatcherRef: a,
        findHostInstanceByFiber: a_,
        findFiberByHostInstance: t || i_,
        // React Refresh
        findHostInstancesForRefresh: jk,
        scheduleRefresh: zk,
        scheduleRoot: Ak,
        setRefreshHandler: Uk,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: l_,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: vS
      });
    }
    var ux = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function SS(e) {
      this._internalRoot = e;
    }
    Jm.prototype.render = SS.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Zm(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== zn) {
          var i = Ib(t.current);
          i && i.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      nv(e, t, null, null);
    }, Jm.prototype.unmount = SS.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        Sb() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Gu(function() {
          nv(null, e, null, null);
        }), uE(t);
      }
    };
    function o_(e, t) {
      if (!Zm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      ox(e);
      var a = !1, i = !1, u = "", s = ux;
      t != null && (t.hydrate ? Ne("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Nr && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = Pb(e, Wh, null, a, i, u, s);
      Ph(f.current, e);
      var p = e.nodeType === zn ? e.parentNode : e;
      return op(p), new SS(f);
    }
    function Jm(e) {
      this._internalRoot = e;
    }
    function s_(e) {
      e && oh(e);
    }
    Jm.prototype.unstable_scheduleHydration = s_;
    function c_(e, t, a) {
      if (!Zm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      ox(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = ux;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var g = Vb(t, null, e, Wh, i, s, f, p, v);
      if (Ph(g.current, e), op(e), u)
        for (var E = 0; E < u.length; E++) {
          var _ = u[E];
          v1(g, _);
        }
      return new Jm(g);
    }
    function Zm(e) {
      return !!(e && (e.nodeType === Kr || e.nodeType === Gi || e.nodeType === cd));
    }
    function rv(e) {
      return !!(e && (e.nodeType === Kr || e.nodeType === Gi || e.nodeType === cd || e.nodeType === zn && e.nodeValue === " react-mount-point-unstable "));
    }
    function ox(e) {
      e.nodeType === Kr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), Sp(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var f_ = x.ReactCurrentOwner, sx;
    sx = function(e) {
      if (e._reactRootContainer && e.nodeType !== zn) {
        var t = Ib(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = ES(e), u = !!(i && Mo(i));
      u && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Kr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function ES(e) {
      return e ? e.nodeType === Gi ? e.documentElement : e.firstChild : null;
    }
    function cx() {
    }
    function d_(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var w = Xm(f);
            s.call(w);
          };
        }
        var f = Vb(
          t,
          i,
          e,
          zo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          cx
        );
        e._reactRootContainer = f, Ph(f.current, e);
        var p = e.nodeType === zn ? e.parentNode : e;
        return op(p), Gu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var g = i;
          i = function() {
            var w = Xm(E);
            g.call(w);
          };
        }
        var E = Pb(
          e,
          zo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          cx
        );
        e._reactRootContainer = E, Ph(E.current, e);
        var _ = e.nodeType === zn ? e.parentNode : e;
        return op(_), Gu(function() {
          nv(t, E, a, i);
        }), E;
      }
    }
    function p_(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function ey(e, t, a, i, u) {
      sx(a), p_(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = d_(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Xm(f);
            p.call(v);
          };
        }
        nv(t, f, e, u);
      }
      return Xm(f);
    }
    var fx = !1;
    function v_(e) {
      {
        fx || (fx = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = f_.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", kt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Kr ? e : Jk(e, "findDOMNode");
    }
    function h_(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !rv(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Sp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return ey(null, e, t, !0, a);
    }
    function m_(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !rv(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Sp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return ey(null, e, t, !1, a);
    }
    function y_(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !rv(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !yy(e))
        throw new Error("parentComponent must be a valid React Component");
      return ey(e, t, a, !1, i);
    }
    var dx = !1;
    function g_(e) {
      if (dx || (dx = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !rv(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = Sp(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = ES(e), i = a && !Mo(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Gu(function() {
          ey(null, null, e, !1, function() {
            e._reactRootContainer = null, uE(e);
          });
        }), !0;
      } else {
        {
          var u = ES(e), s = !!(u && Mo(u)), f = e.nodeType === Kr && rv(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    kr(Zk), Ro(e_), ah(t_), Us(Fa), $d(th), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Tc(ER), my(X0, ck, Gu);
    function S_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Zm(t))
        throw new Error("Target container is not a DOM element.");
      return Xk(e, t, null, a);
    }
    function E_(e, t, a, i) {
      return y_(e, t, a, i);
    }
    var CS = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Mo, _f, Vh, po, wc, X0]
    };
    function C_(e, t) {
      return CS.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), o_(e, t);
    }
    function b_(e, t, a) {
      return CS.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), c_(e, t, a);
    }
    function x_(e) {
      return Sb() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Gu(e);
    }
    var R_ = u_({
      findFiberByHostInstance: Gs,
      bundleType: 1,
      version: vS,
      rendererPackageName: "react-dom"
    });
    if (!R_ && Mn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var px = window.location.protocol;
      /^(https?|file):$/.test(px) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (px === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Wa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = CS, Wa.createPortal = S_, Wa.createRoot = C_, Wa.findDOMNode = v_, Wa.flushSync = x_, Wa.hydrate = h_, Wa.hydrateRoot = b_, Wa.render = m_, Wa.unmountComponentAtNode = g_, Wa.unstable_batchedUpdates = X0, Wa.unstable_renderSubtreeIntoContainer = E_, Wa.version = vS, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  })()), Wa;
}
var Tx;
function A_() {
  if (Tx) return ry.exports;
  Tx = 1;
  function y() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(y);
      } catch (M) {
        console.error(M);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (y(), ry.exports = U_()) : ry.exports = z_(), ry.exports;
}
var wx;
function j_() {
  if (wx) return Zf;
  wx = 1;
  var y = A_();
  if (process.env.NODE_ENV === "production")
    Zf.createRoot = y.createRoot, Zf.hydrateRoot = y.hydrateRoot;
  else {
    var M = y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    Zf.createRoot = function(x, J) {
      M.usingClientEntryPoint = !0;
      try {
        return y.createRoot(x, J);
      } finally {
        M.usingClientEntryPoint = !1;
      }
    }, Zf.hydrateRoot = function(x, J, te) {
      M.usingClientEntryPoint = !0;
      try {
        return y.hydrateRoot(x, J, te);
      } finally {
        M.usingClientEntryPoint = !1;
      }
    };
  }
  return Zf;
}
var Ax = j_(), xn = sv();
const LS = "clx-apiclient-history", H_ = 50;
function jx() {
  try {
    const y = localStorage.getItem(LS);
    return y ? JSON.parse(y) : [];
  } catch {
    return [];
  }
}
function Hx(y) {
  const x = jx().filter((te) => !(te.url === y.url && te.method === y.method));
  x.unshift(y);
  const J = x.slice(0, H_);
  return localStorage.setItem(LS, JSON.stringify(J)), window.dispatchEvent(new CustomEvent("apiclient-history-changed", { detail: J })), J;
}
function F_() {
  localStorage.removeItem(LS), window.dispatchEvent(new CustomEvent("apiclient-history-changed", { detail: [] }));
}
const _S = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  DELETE: "#f93e3e",
  PATCH: "#50e3c2",
  HEAD: "#9012fe",
  OPTIONS: "#0d5aa7"
};
let DS = null;
function P_(y) {
  DS = y;
}
function iy(y, M) {
  if (!DS) throw new Error("API Client host is not configured");
  return DS.moduleCall(`clx.api-client.${y}`, M);
}
const Fx = (y) => iy("request", y), V_ = (y) => iy("streamStart", y), B_ = (y) => iy("streamPoll", { requestId: y }), I_ = (y) => iy("streamAbort", { requestId: y });
function kx(y) {
  if (y.length === 0) return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
  const M = [...y].sort((x, J) => x - J);
  return {
    min: M[0],
    max: M[M.length - 1],
    avg: Math.round(M.reduce((x, J) => x + J, 0) / M.length),
    p50: M[Math.floor(M.length * 0.5)],
    p95: M[Math.floor(M.length * 0.95)],
    p99: M[Math.floor(M.length * 0.99)]
  };
}
let ie = {
  method: "GET",
  url: "",
  headers: [{ id: "h0", key: "", value: "", enabled: !0 }],
  params: [{ id: "p0", key: "", value: "", enabled: !0 }],
  body: "",
  activeTab: "params",
  curlInput: "",
  response: null,
  isLoading: !1,
  copied: !1,
  isStreaming: !1,
  streamStatus: null,
  runner: {
    concurrency: 10,
    total: 100,
    mode: "count",
    durationSec: 10,
    running: !1,
    sent: 0,
    success: 0,
    errors: 0,
    reqPerSec: 0,
    latencies: [],
    errorList: [],
    stats: { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 }
  }
}, OS = /* @__PURE__ */ new Set(), Y_ = 100;
function hn() {
  OS.forEach((y) => y());
}
function _x() {
  return ie;
}
function RS() {
  return String(++Y_);
}
function $_(y) {
  return OS.add(y), () => {
    OS.delete(y);
  };
}
function TS(y) {
  ie = { ...ie, method: y }, hn();
}
function wS(y) {
  ie = { ...ie, url: y }, hn();
}
function cc(y) {
  ie = { ...ie, headers: y }, hn();
}
function fc(y) {
  ie = { ...ie, params: y }, hn();
}
function uv(y) {
  ie = { ...ie, body: y }, hn();
}
function kS(y) {
  ie = { ...ie, activeTab: y }, hn();
}
function Dx(y) {
  ie = { ...ie, curlInput: y }, hn();
}
function Ox(y) {
  ie = { ...ie, copied: y }, hn();
}
function Q_(y) {
  ie = { ...ie, runner: { ...ie.runner, concurrency: y } }, hn();
}
function W_(y) {
  ie = { ...ie, runner: { ...ie.runner, mode: y } }, hn();
}
function G_(y) {
  ie = { ...ie, runner: { ...ie.runner, total: y } }, hn();
}
function q_(y) {
  ie = { ...ie, runner: { ...ie.runner, durationSec: y } }, hn();
}
function MS() {
  const y = ie.params.filter((M) => M.enabled && M.key);
  return y.length === 0 ? ie.url : ie.url + "?" + y.map((M) => encodeURIComponent(M.key) + "=" + encodeURIComponent(M.value)).join("&");
}
let nu = null;
async function Nx() {
  if (!ie.url.trim() || ie.isLoading) return;
  ie = { ...ie, isLoading: !0, response: null }, hn();
  const y = [];
  for (const J of ie.headers)
    J.enabled && J.key && y.push([J.key, J.value]);
  const M = y.some(
    ([J, te]) => J.toLowerCase() === "accept" && (te.includes("text/event-stream") || te.includes("application/x-ndjson"))
  ), x = MS();
  if (M) {
    ie = { ...ie, isStreaming: !0 }, hn();
    const J = crypto.randomUUID();
    nu = J;
    try {
      const te = await V_({
        method: ie.method,
        url: x,
        headers: y,
        body: ie.body || null,
        requestId: J
      });
      nu = te.requestId, Z_(te.requestId);
    } catch (te) {
      ie = {
        ...ie,
        isLoading: !1,
        isStreaming: !1,
        response: {
          status: 0,
          statusText: "Error",
          headers: {},
          body: typeof te == "string" ? te : te.message || String(te),
          duration: 0,
          size: 0
        }
      }, nu = null, hn();
    }
  } else
    try {
      const J = {
        method: ie.method,
        url: x,
        headers: y,
        body: ie.body || null
      }, te = await Fx(J), Ne = new TextEncoder().encode(te.body).length, S = {};
      for (const [Qe, se] of te.headers) S[Qe] = se;
      ie = {
        ...ie,
        isLoading: !1,
        response: {
          status: te.status,
          statusText: te.statusText,
          headers: S,
          body: te.body,
          duration: te.duration,
          size: Ne
        }
      }, Hx({
        url: x,
        method: ie.method,
        timestamp: Date.now(),
        headers: ie.headers.map((Qe) => ({ key: Qe.key, value: Qe.value, enabled: Qe.enabled })),
        params: ie.params.map((Qe) => ({ key: Qe.key, value: Qe.value, enabled: Qe.enabled })),
        body: ie.body
      }), hn();
    } catch (J) {
      ie = {
        ...ie,
        isLoading: !1,
        response: {
          status: 0,
          statusText: "Error",
          headers: {},
          body: typeof J == "string" ? J : J.message || String(J),
          duration: 0,
          size: 0
        }
      }, hn();
    }
}
async function K_() {
  nu && (await I_(nu), ie = { ...ie, isLoading: !1, isStreaming: !1 }, nu = null, hn());
}
let NS = !1;
async function X_() {
  if (!ie.url.trim() || ie.runner.running) return;
  NS = !1;
  const y = ie.runner.concurrency, M = ie.runner.mode === "count" ? ie.runner.total : 999999, x = ie.runner.mode === "duration" ? performance.now() + ie.runner.durationSec * 1e3 : 1 / 0, J = MS(), te = ie.method, Ne = ie.body, S = [];
  for (const ue of ie.headers)
    ue.enabled && ue.key && S.push([ue.key, ue.value]);
  const Qe = te !== "GET" && te !== "HEAD" && !!Ne;
  ie = {
    ...ie,
    runner: {
      ...ie.runner,
      running: !0,
      sent: 0,
      success: 0,
      errors: 0,
      reqPerSec: 0,
      latencies: [],
      errorList: [],
      stats: { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 }
    }
  };
  const se = performance.now();
  hn();
  let Q = 0, We = 0, ne = 0;
  const me = [], le = [], Le = setInterval(() => {
    const ue = (performance.now() - se) / 1e3;
    ie = {
      ...ie,
      runner: {
        ...ie.runner,
        sent: Q,
        success: We,
        errors: ne,
        latencies: [...me],
        reqPerSec: ue > 0 ? Math.round(Q / ue) : 0,
        stats: kx(me)
      }
    }, hn();
  }, 500);
  let Je = 0;
  const $ = async () => {
    for (; Je < M && performance.now() < x && !NS && !(Je++ >= M); ) {
      const Te = performance.now();
      Q++;
      try {
        const He = await Fx({ method: te, url: J, headers: S, body: Qe ? Ne : null });
        He.status >= 200 && He.status < 300 ? We++ : (ne++, le.length < 20 && le.push(He.status + " " + He.statusText));
      } catch (He) {
        ne++, le.length < 20 && le.push(He.message || String(He));
      }
      me.push(Math.round(performance.now() - Te));
    }
  }, xe = [];
  for (let ue = 0; ue < y; ue++) xe.push($());
  await Promise.all(xe), clearInterval(Le);
  const je = (performance.now() - se) / 1e3;
  ie = {
    ...ie,
    runner: {
      ...ie.runner,
      running: !1,
      sent: Q,
      success: We,
      errors: ne,
      latencies: [...me],
      errorList: le,
      reqPerSec: je > 0 ? Math.round(Q / je) : 0,
      stats: kx(me)
    }
  }, hn(), Hx({
    url: J,
    method: te,
    timestamp: Date.now(),
    headers: ie.headers.map((ue) => ({ key: ue.key, value: ue.value, enabled: ue.enabled })),
    params: ie.params.map((ue) => ({ key: ue.key, value: ue.value, enabled: ue.enabled })),
    body: Ne
  });
}
function J_() {
  NS = !0, ie = {
    ...ie,
    runner: { ...ie.runner, running: !1 }
  }, hn();
}
let dc = [], ir = null;
function Lx(y) {
  if (y.eventType === "start") {
    const M = {};
    if (y.headers) for (const [x, J] of y.headers) M[x] = J;
    ir = { status: y.status || 200, statusText: y.statusText || "OK", headers: M }, dc = [], ie = { ...ie, streamStatus: ir, isStreaming: !0 }, hn();
  } else y.eventType === "data" ? (dc = [...dc, y.chunk], ie = {
    ...ie,
    response: {
      status: (ir == null ? void 0 : ir.status) || 200,
      statusText: (ir == null ? void 0 : ir.statusText) || "OK",
      headers: (ir == null ? void 0 : ir.headers) || {},
      body: dc.join(""),
      duration: 0,
      size: new TextEncoder().encode(dc.join("")).length
    }
  }, hn()) : y.eventType === "done" ? (ie = {
    ...ie,
    isStreaming: !1,
    isLoading: !1,
    response: {
      status: (ir == null ? void 0 : ir.status) || 200,
      statusText: (ir == null ? void 0 : ir.statusText) || "OK",
      headers: (ir == null ? void 0 : ir.headers) || {},
      body: dc.join(""),
      duration: 0,
      size: new TextEncoder().encode(dc.join("")).length
    }
  }, nu = null, hn()) : y.eventType === "error" && (ie = {
    ...ie,
    isStreaming: !1,
    isLoading: !1,
    response: {
      status: 0,
      statusText: "Error",
      headers: {},
      body: y.error || "Stream error",
      duration: 0,
      size: 0
    }
  }, nu = null, hn());
}
async function Z_(y) {
  try {
    for (; nu === y; ) {
      const M = await B_(y);
      for (const x of M.events) Lx(x);
      if (!M.active) break;
      M.events.length === 0 && await new Promise((x) => window.setTimeout(x, 50));
    }
  } catch (M) {
    nu === y && Lx({
      chunk: "",
      eventType: "error",
      status: null,
      statusText: null,
      headers: null,
      error: M instanceof Error ? M.message : String(M)
    });
  }
}
function eD() {
  const [y, M] = xn.useState(_x());
  return xn.useEffect(() => $_(() => M(_x())), []), y;
}
function tD(y) {
  const M = y.trim();
  if (!M.startsWith("curl ")) return null;
  const x = M.indexOf("^") >= 0 && M.indexOf('^"') >= 0;
  let J = M;
  x ? (J = J.replace(/\^\s*\n\s*/g, " "), J = rD(J)) : J = J.replace(/\\\s*\n\s*/g, " ");
  const te = nD(J);
  let Ne = "GET", S = "";
  const Qe = [];
  let se = "", Q = 1, We = -1;
  for (let ye = 0; ye < te.length; ye++)
    if (te[ye].startsWith("http://") || te[ye].startsWith("https://")) {
      S = te[ye], We = ye;
      break;
    }
  if (!S)
    for (; Q < te.length; ) {
      if (!te[Q].startsWith("-")) {
        S = te[Q];
        break;
      }
      Q++;
    }
  for (; Q < te.length; ) {
    if (Q === We) {
      Q++;
      continue;
    }
    const ye = te[Q];
    if (ye === "-X" || ye === "--request") {
      if (Q++, Q === We && Q++, Q < te.length) {
        const Le = te[Q].toUpperCase();
        ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].includes(Le) && (Ne = Le), Q++;
      }
    } else if (ye === "-H" || ye === "--header") {
      if (Q++, Q === We && Q++, Q < te.length) {
        const Le = te[Q], Je = Le.indexOf(":");
        Je > 0 && Qe.push({ id: crypto.randomUUID(), key: Le.slice(0, Je).trim(), value: Le.slice(Je + 1).trim(), enabled: !0 }), Q++;
      }
    } else if (ye === "-b" || ye === "--cookie") {
      if (Q++, Q === We && Q++, Q < te.length) {
        const Le = te[Q];
        !Le.includes("=") || Le.startsWith("@") || Qe.push({ id: crypto.randomUUID(), key: "Cookie", value: Le, enabled: !0 }), Q++;
      }
    } else ye === "-d" || ye === "--data" || ye === "--data-raw" || ye === "--data-binary" ? (Q++, Q === We && Q++, Q < te.length && (se = te[Q], Ne === "GET" && (Ne = "POST"), Q++)) : Q++;
  }
  const ne = [], me = S.indexOf("?"), le = me >= 0 ? S.slice(0, me) : S;
  return me >= 0 && S.slice(me + 1).split("&").forEach((ye) => {
    const Le = ye.indexOf("=");
    if (Le >= 0) {
      const Je = decodeURIComponent(ye.slice(0, Le)), $ = decodeURIComponent(ye.slice(Le + 1));
      Je && ne.push({ id: crypto.randomUUID(), key: Je, value: $, enabled: !0 });
    } else ye && ne.push({ id: crypto.randomUUID(), key: ye, value: "", enabled: !0 });
  }), { url: le, method: Ne, headers: Qe, body: se, params: ne };
}
function nD(y) {
  const M = [];
  let x = 0;
  for (; x < y.length; ) {
    if (y[x] === " " || y[x] === "	" || y[x] === `
` || y[x] === "\r") {
      x++;
      continue;
    }
    if (y[x] === "'") {
      x++;
      let J = "";
      for (; x < y.length && y[x] !== "'"; )
        J += y[x], x++;
      x < y.length && x++, M.push(J);
    } else if (y[x] === '"') {
      x++;
      let J = "";
      for (; x < y.length && y[x] !== '"'; )
        y[x] === "\\" && x + 1 < y.length ? (J += y[x + 1], x += 2) : (J += y[x], x++);
      x < y.length && x++, M.push(J);
    } else {
      let J = "";
      for (; x < y.length && y[x] !== " " && y[x] !== "	" && y[x] !== `
` && y[x] !== "\r"; )
        J += y[x], x++;
      M.push(J);
    }
  }
  return M;
}
function rD(y) {
  let M = "", x = 0;
  for (; x < y.length; )
    if (y[x] === "^" && x + 1 < y.length && y[x + 1] === '"') {
      x += 2;
      let J = "";
      for (; x < y.length; )
        if (y[x] === "^" && x + 1 < y.length)
          if (y[x + 1] === '"') {
            x += 2;
            break;
          } else
            J += y[x + 1], x += 2;
        else
          J += y[x], x++;
      J = J.replace(new RegExp('(?<!\\\\)"', "g"), '\\"'), M += '"' + J + '"';
    } else y[x] === "^" && x + 1 < y.length ? (M += y[x + 1], x += 2) : (M += y[x], x++);
  return M;
}
const aD = (y) => ({
  200: "OK",
  201: "Created",
  204: "No Content",
  301: "Moved",
  302: "Found",
  304: "Not Modified",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Timeout",
  409: "Conflict",
  422: "Unprocessable",
  429: "Rate Limited",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout"
})[y] || "", iD = (y) => y >= 200 && y < 300 ? "text-green-400" : y >= 300 && y < 400 ? "text-yellow-400" : y >= 400 ? "text-red-400" : "text-slate-400", lD = (y) => y < 1024 ? y + " B" : y < 1048576 ? (y / 1024).toFixed(1) + " KB" : (y / 1048576).toFixed(1) + " MB", uD = (y) => {
  try {
    return JSON.stringify(JSON.parse(y), null, 2);
  } catch {
    return y;
  }
}, oD = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
function sD(y, M, x, J) {
  const te = ["curl"];
  y !== "GET" && te.push(`-X ${y}`);
  for (const Ne of x)
    Ne.enabled && Ne.key && te.push(`-H '${Ne.key}: ${Ne.value}'`);
  if (J && y !== "GET" && y !== "HEAD") {
    const Ne = J.replace(/'/g, "'\\''");
    te.push(`-d '${Ne}'`);
  }
  return te.push(`'${M}'`), te.join(` \\
  `);
}
function cD() {
  return /* @__PURE__ */ P.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-6 w-6", children: /* @__PURE__ */ P.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" }) });
}
function fD() {
  return /* @__PURE__ */ P.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "h-4 w-4", children: /* @__PURE__ */ P.jsx("path", { d: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" }) });
}
function dD() {
  return /* @__PURE__ */ P.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ P.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) });
}
function pD() {
  return /* @__PURE__ */ P.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ P.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" }) });
}
function Mx() {
  return /* @__PURE__ */ P.jsxs("svg", { className: "animate-spin h-4 w-4 text-cyber-electric", viewBox: "0 0 24 24", fill: "none", children: [
    /* @__PURE__ */ P.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
    /* @__PURE__ */ P.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
  ] });
}
function Ux() {
  return /* @__PURE__ */ P.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ P.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" }) });
}
function vD() {
  return /* @__PURE__ */ P.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ P.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.499 5.882v8.236m0 0a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Zm0 0A2.25 2.25 0 0 1 6.75 12.25h1.5A2.25 2.25 0 0 0 10.5 10v-.118a2.25 2.25 0 0 1 4.5 0V10a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 1 2.25 2.25v0a2.25 2.25 0 0 1-4.5 0v0" }) });
}
function hD({ row: y, onChangeKey: M, onChangeValue: x, onToggle: J, onDelete: te }) {
  return /* @__PURE__ */ P.jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ P.jsx("button", { type: "button", onClick: J, className: "w-5 h-5 shrink-0 rounded text-[10px] flex items-center justify-center border transition " + (y.enabled ? "bg-cyber-electric/20 border-cyber-electric/40 text-cyber-electric" : "bg-transparent border-cyber-line/30 text-slate-600"), title: "Toggle", children: "✓" }),
    /* @__PURE__ */ P.jsx("input", { type: "text", placeholder: "Key", value: y.key, onChange: (Ne) => M(Ne.target.value), className: "flex-1 rounded border bg-cyber-base/50 px-2 py-1.5 text-[11px] text-slate-300 font-mono outline-none transition placeholder:text-slate-600 focus:border-cyber-neon/50 " + (y.enabled ? "border-cyber-line/50" : "border-cyber-line/20 opacity-50") }),
    /* @__PURE__ */ P.jsx("input", { type: "text", placeholder: "Value", value: y.value, onChange: (Ne) => x(Ne.target.value), className: "flex-1 rounded border bg-cyber-base/50 px-2 py-1.5 text-[11px] text-slate-300 font-mono outline-none transition placeholder:text-slate-600 focus:border-cyber-neon/50 " + (y.enabled ? "border-cyber-line/50" : "border-cyber-line/20 opacity-50") }),
    /* @__PURE__ */ P.jsx("button", { type: "button", onClick: te, className: "w-5 h-5 shrink-0 flex items-center justify-center rounded text-slate-600 hover:text-red-400 transition", children: /* @__PURE__ */ P.jsx(pD, {}) })
  ] });
}
function mD() {
  const y = eD(), [M, x] = xn.useState(250), J = xn.useRef(!1), te = xn.useRef(null), Ne = xn.useRef(0), S = xn.useRef(0), Qe = xn.useMemo(() => MS(), [y.url, y.params]), se = xn.useCallback(($, xe) => {
    xe([...$, { id: RS(), key: "", value: "", enabled: !0 }]);
  }, []), Q = xn.useRef({
    updateRow($, xe, je, ue, Te) {
      xe($.map((He) => He.id === je ? { ...He, [ue]: Te } : He));
    },
    toggleRow($, xe, je) {
      xe($.map((ue) => ue.id === je ? { ...ue, enabled: !ue.enabled } : ue));
    },
    deleteRow($, xe, je) {
      xe($.filter((ue) => ue.id !== je));
    }
  });
  xn.useEffect(() => {
    const $ = (xe) => {
      (xe.ctrlKey || xe.metaKey) && xe.key === "Enter" && (xe.preventDefault(), Nx());
    };
    return window.addEventListener("keydown", $), () => window.removeEventListener("keydown", $);
  }, []), xn.useEffect(() => {
    const $ = (xe) => {
      var He, Ve;
      const ue = xe.detail;
      if (!ue || !ue.url) return;
      TS(ue.method);
      const Te = ue.url.indexOf("?");
      wS(Te >= 0 ? ue.url.slice(0, Te) : ue.url), (He = ue.headers) != null && He.length && cc(ue.headers.map((Yt) => ({ id: RS(), ...Yt }))), (Ve = ue.params) != null && Ve.length && fc(ue.params.map((Yt) => ({ id: RS(), ...Yt }))), ue.body && uv(ue.body), kS(ue.body ? "body" : "params");
    };
    return window.addEventListener("apiclient-history-select", $), () => window.removeEventListener("apiclient-history-select", $);
  }, []);
  const We = xn.useCallback(($) => {
    $.preventDefault(), J.current = !0, Ne.current = $.clientY, S.current = M, document.body.style.cursor = "row-resize", document.body.style.userSelect = "none";
  }, [M]);
  xn.useEffect(() => {
    const $ = (je) => {
      var Ve;
      if (!J.current) return;
      const ue = Ne.current - je.clientY, Te = ((Ve = te.current) == null ? void 0 : Ve.clientHeight) || 600, He = Math.max(80, Math.min(Te - 150, S.current + ue));
      x(He);
    }, xe = () => {
      J.current && (J.current = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    };
    return window.addEventListener("mousemove", $), window.addEventListener("mouseup", xe), () => {
      window.removeEventListener("mousemove", $), window.removeEventListener("mouseup", xe);
    };
  }, []);
  const ne = xn.useCallback(async () => {
    var $;
    if (($ = y.response) != null && $.body)
      try {
        await navigator.clipboard.writeText(y.response.body), Ox(!0), setTimeout(() => Ox(!1), 1500);
      } catch {
      }
  }, [y.response]), me = xn.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(y.body);
    } catch {
    }
  }, [y.body]), le = xn.useCallback(() => {
    if (!y.curlInput.trim()) return;
    const $ = tD(y.curlInput);
    if ($) {
      if (TS($.method), wS($.url), $.headers.length > 0 && cc($.headers), $.params.length > 0 && fc($.params), $.body)
        try {
          uv(JSON.stringify(JSON.parse($.body), null, 2));
        } catch {
          uv($.body);
        }
      Dx(""), kS($.body ? "body" : "params");
    }
  }, [y.curlInput]), ye = xn.useCallback(() => {
    try {
      uv(JSON.stringify(JSON.parse(y.body), null, 2));
    } catch {
    }
  }, [y.body]), Le = y.runner.stats, Je = xn.useCallback(async () => {
    const $ = sD(y.method, Qe, y.headers, y.body);
    try {
      await navigator.clipboard.writeText($);
    } catch {
    }
  }, [y.method, Qe, y.headers, y.body]);
  return /* @__PURE__ */ P.jsxs("div", { ref: te, className: "flex h-full flex-col bg-cyber-base overflow-hidden relative", children: [
    /* @__PURE__ */ P.jsxs("div", { className: "flex shrink-0 items-center gap-3 border-b border-cyber-line p-3 bg-cyber-base/70", children: [
      /* @__PURE__ */ P.jsxs("h2", { className: "font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ P.jsx(cD, {}),
        "API Client"
      ] }),
      /* @__PURE__ */ P.jsx("span", { className: "text-[9px] text-slate-500 ml-auto font-mono", children: "Ctrl+Enter to send" })
    ] }),
    /* @__PURE__ */ P.jsxs("div", { className: "flex shrink-0 gap-2 border-b border-cyber-line/50 bg-cyber-panel/20 px-3 py-2", children: [
      /* @__PURE__ */ P.jsx("input", { type: "text", placeholder: "Paste curl command here...", value: y.curlInput, onChange: ($) => Dx($.target.value), onKeyDown: ($) => {
        $.key === "Enter" && le();
      }, className: "flex-1 rounded border border-cyber-line bg-cyber-base/50 px-2.5 py-1 text-[11px] text-slate-300 font-mono outline-none placeholder:text-slate-600 focus:border-cyber-neon/50 transition" }),
      /* @__PURE__ */ P.jsx("button", { type: "button", onClick: le, disabled: !y.curlInput.trim(), className: "shrink-0 rounded border border-cyber-neon/40 bg-cyber-neon/10 px-3 py-1 text-[10px] font-semibold text-cyber-neon transition hover:bg-cyber-neon/20 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider", children: "Parse Curl" })
    ] }),
    /* @__PURE__ */ P.jsxs("div", { className: "flex shrink-0 gap-0 border-b border-cyber-line px-3 py-2.5", children: [
      /* @__PURE__ */ P.jsx("select", { value: y.method, onChange: ($) => TS($.target.value), className: "h-9 rounded-l-md border border-cyber-line bg-cyber-base px-2.5 text-[12px] font-bold uppercase text-slate-200 outline-none appearance-none pr-7 cursor-pointer focus:border-cyber-neon/50 transition", style: { color: _S[y.method] }, children: oD.map(($) => /* @__PURE__ */ P.jsx("option", { value: $, style: { color: _S[$] }, children: $ }, $)) }),
      /* @__PURE__ */ P.jsx("input", { type: "text", placeholder: "https://api.example.com/v1/endpoint", value: y.url, onChange: ($) => wS($.target.value), className: "h-9 flex-1 border-y border-cyber-line bg-cyber-base px-2.5 text-[12px] text-slate-200 font-mono outline-none placeholder:text-slate-600 focus:border-cyber-neon/50 transition" }),
      y.isLoading ? /* @__PURE__ */ P.jsx("button", { type: "button", onClick: K_, className: "h-9 shrink-0 rounded-r-md border border-red-500/40 bg-red-500/10 px-4 text-[11px] font-bold text-red-400 uppercase tracking-wider hover:bg-red-500/20 transition", children: /* @__PURE__ */ P.jsx(Mx, {}) }) : /* @__PURE__ */ P.jsxs(P.Fragment, { children: [
        /* @__PURE__ */ P.jsxs("button", { type: "button", onClick: Nx, disabled: !y.url.trim(), className: "h-9 shrink-0 border-y border-r border-cyber-electric/40 bg-cyber-electric/10 px-4 text-[11px] font-bold text-cyber-electric uppercase tracking-wider transition hover:bg-cyber-electric/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5", children: [
          /* @__PURE__ */ P.jsx(fD, {}),
          "Send"
        ] }),
        /* @__PURE__ */ P.jsx("button", { type: "button", onClick: Je, disabled: !y.url.trim(), title: "Copy as cURL", className: "h-9 shrink-0 rounded-r-md border border-cyber-line/40 bg-cyber-base/50 px-3 text-[10px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition uppercase tracking-wider font-semibold disabled:opacity-30 disabled:cursor-not-allowed", children: "cURL" })
      ] })
    ] }),
    /* @__PURE__ */ P.jsx("div", { className: "flex shrink-0 border-b border-cyber-line", children: ["params", "headers", "body", "runner"].map(($) => /* @__PURE__ */ P.jsx("button", { type: "button", onClick: () => kS($), className: "px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition border-b-2 -mb-[1px] " + (y.activeTab === $ ? "text-cyber-electric border-cyber-electric" : "text-slate-500 border-transparent hover:text-slate-300"), children: $ === "params" ? "Params" : $ === "headers" ? "Headers" : $ === "body" ? "Body" : "Runner" }, $)) }),
    /* @__PURE__ */ P.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col min-h-0", children: [
      y.activeTab !== "body" && y.activeTab !== "runner" && /* @__PURE__ */ P.jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-1", children: [
        (y.activeTab === "params" ? y.params : y.headers).map(($) => /* @__PURE__ */ P.jsx(
          hD,
          {
            row: $,
            onChangeKey: (xe) => Q.current.updateRow(y.activeTab === "params" ? y.params : y.headers, y.activeTab === "params" ? fc : cc, $.id, "key", xe),
            onChangeValue: (xe) => Q.current.updateRow(y.activeTab === "params" ? y.params : y.headers, y.activeTab === "params" ? fc : cc, $.id, "value", xe),
            onToggle: () => Q.current.toggleRow(y.activeTab === "params" ? y.params : y.headers, y.activeTab === "params" ? fc : cc, $.id),
            onDelete: () => Q.current.deleteRow(y.activeTab === "params" ? y.params : y.headers, y.activeTab === "params" ? fc : cc, $.id)
          },
          $.id
        )),
        /* @__PURE__ */ P.jsxs("button", { type: "button", onClick: () => se(y.activeTab === "params" ? y.params : y.headers, y.activeTab === "params" ? fc : cc), className: "mt-2 flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyber-neon transition font-semibold uppercase", children: [
          /* @__PURE__ */ P.jsx(dD, {}),
          "Add " + (y.activeTab === "params" ? "Param" : "Header")
        ] })
      ] }),
      y.activeTab === "body" && /* @__PURE__ */ P.jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [
        /* @__PURE__ */ P.jsxs("div", { className: "flex items-center justify-between px-3 py-1.5 border-b border-cyber-line/30 bg-cyber-base/20 shrink-0", children: [
          /* @__PURE__ */ P.jsx("span", { className: "text-[9px] font-semibold uppercase tracking-wider text-slate-400", children: "Request Body" }),
          /* @__PURE__ */ P.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ P.jsxs("button", { type: "button", onClick: ye, className: "rounded border border-cyber-line/40 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition flex items-center gap-1", children: [
              /* @__PURE__ */ P.jsx(vD, {}),
              "Pretty"
            ] }),
            /* @__PURE__ */ P.jsxs("button", { type: "button", onClick: me, className: "rounded border border-cyber-line/40 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition flex items-center gap-1", children: [
              /* @__PURE__ */ P.jsx(Ux, {}),
              "Copy"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ P.jsx("textarea", { value: y.body, onChange: ($) => uv($.target.value), placeholder: '{"key": "value"}', className: "flex-1 resize-none bg-transparent px-3 py-2 text-[12px] text-slate-300 font-mono outline-none placeholder:text-slate-600", spellCheck: !1 })
      ] }),
      y.activeTab === "runner" && /* @__PURE__ */ P.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 min-h-0", children: [
        /* @__PURE__ */ P.jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
          /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3", children: [
            /* @__PURE__ */ P.jsx("label", { className: "block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Concurrency" }),
            /* @__PURE__ */ P.jsx("input", { type: "number", min: 1, max: 100, value: y.runner.concurrency, onChange: ($) => Q_(Math.max(1, Math.min(100, parseInt($.target.value) || 1))), disabled: y.runner.running, className: "w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[13px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40" })
          ] }),
          /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3", children: [
            /* @__PURE__ */ P.jsx("label", { className: "block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Mode" }),
            /* @__PURE__ */ P.jsxs("select", { value: y.runner.mode, onChange: ($) => W_($.target.value), disabled: y.runner.running, className: "w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[12px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40", children: [
              /* @__PURE__ */ P.jsx("option", { value: "count", children: "N requests" }),
              /* @__PURE__ */ P.jsx("option", { value: "duration", children: "Duration" })
            ] })
          ] }),
          y.runner.mode === "count" ? /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3", children: [
            /* @__PURE__ */ P.jsx("label", { className: "block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Total Requests" }),
            /* @__PURE__ */ P.jsx("input", { type: "number", min: 1, max: 1e5, step: 100, value: y.runner.total, onChange: ($) => G_(Math.max(1, parseInt($.target.value) || 1)), disabled: y.runner.running, className: "w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[13px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40" })
          ] }) : /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3", children: [
            /* @__PURE__ */ P.jsx("label", { className: "block text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5", children: "Duration (sec)" }),
            /* @__PURE__ */ P.jsx("input", { type: "number", min: 1, max: 3600, value: y.runner.durationSec, onChange: ($) => q_(Math.max(1, parseInt($.target.value) || 1)), disabled: y.runner.running, className: "w-full rounded border border-cyber-line/50 bg-cyber-base px-2 py-1.5 text-[13px] font-bold text-cyber-electric font-mono outline-none focus:border-cyber-neon/50 disabled:opacity-40" })
          ] }),
          /* @__PURE__ */ P.jsx("div", { className: "flex items-end", children: y.runner.running ? /* @__PURE__ */ P.jsx("button", { type: "button", onClick: J_, className: "w-full rounded border border-red-500/50 bg-red-500/15 px-3 py-2 text-[11px] font-bold text-red-400 uppercase tracking-wider transition hover:bg-red-500/25", children: "Stop" }) : /* @__PURE__ */ P.jsx("button", { type: "button", onClick: X_, disabled: !y.url.trim(), className: "w-full rounded border border-cyber-neon/50 bg-cyber-neon/15 px-3 py-2 text-[11px] font-bold text-cyber-neon uppercase tracking-wider transition hover:bg-cyber-neon/25 disabled:opacity-30 disabled:cursor-not-allowed", children: "Start" }) })
        ] }),
        /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3 space-y-2", children: [
          /* @__PURE__ */ P.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ P.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400", children: "Progress" }),
            /* @__PURE__ */ P.jsx("span", { className: "text-[10px] font-mono text-slate-500", children: y.runner.mode === "count" ? y.runner.sent + " / " + y.runner.total + " (" + Math.round(y.runner.sent / Math.max(y.runner.total, 1) * 100) + "%)" : y.runner.sent + " sent" })
          ] }),
          /* @__PURE__ */ P.jsx("div", { className: "h-2 rounded-full bg-cyber-base overflow-hidden", children: /* @__PURE__ */ P.jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-cyber-electric to-cyber-neon transition-all duration-300", style: { width: y.runner.mode === "count" ? Math.min(100, y.runner.sent / Math.max(y.runner.total, 1) * 100) + "%" : "100%" } }) })
        ] }),
        /* @__PURE__ */ P.jsx("div", { className: "grid grid-cols-4 gap-3", children: [{ label: "Requests/sec", value: y.runner.reqPerSec, color: "text-cyber-neon" }, { label: "Sent", value: y.runner.sent, color: "text-cyber-electric" }, { label: "2xx OK", value: y.runner.success, color: "text-green-400" }, { label: "Errors", value: y.runner.errors, color: y.runner.errors > 0 ? "text-red-400" : "text-slate-400" }].map(($) => /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3 text-center", children: [
          /* @__PURE__ */ P.jsx("div", { className: "text-2xl font-bold font-mono " + $.color, children: $.value }),
          /* @__PURE__ */ P.jsx("div", { className: "text-[9px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5", children: $.label })
        ] }, $.label)) }),
        y.runner.latencies.length > 0 && /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3", children: [
          /* @__PURE__ */ P.jsx("h4", { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Latency (ms)" }),
          /* @__PURE__ */ P.jsx("div", { className: "grid grid-cols-6 gap-2 text-center", children: [{ label: "Min", val: Le.min }, { label: "Avg", val: Le.avg }, { label: "P50", val: Le.p50 }, { label: "P95", val: Le.p95 }, { label: "P99", val: Le.p99 }, { label: "Max", val: Le.max }].map(($) => /* @__PURE__ */ P.jsxs("div", { className: "rounded bg-cyber-base/50 px-2 py-1.5", children: [
            /* @__PURE__ */ P.jsx("div", { className: "text-[13px] font-bold font-mono text-slate-200", children: $.val }),
            /* @__PURE__ */ P.jsx("div", { className: "text-[8px] font-semibold uppercase tracking-wider text-slate-500", children: $.label })
          ] }, $.label)) })
        ] }),
        y.runner.errorList.length > 0 && /* @__PURE__ */ P.jsxs("div", { className: "rounded-lg border border-cyber-line/40 bg-cyber-panel/20 p-3", children: [
          /* @__PURE__ */ P.jsx("h4", { className: "text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-2", children: "Errors (max 20 shown)" }),
          /* @__PURE__ */ P.jsx("div", { className: "space-y-0.5 max-h-32 overflow-y-auto", children: y.runner.errorList.map(($, xe) => /* @__PURE__ */ P.jsx("div", { className: "text-[10px] font-mono text-red-300/80 break-all", children: $ }, xe)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ P.jsx("div", { onMouseDown: We, className: "h-1.5 shrink-0 bg-cyber-line/30 hover:bg-cyber-electric/40 cursor-row-resize transition-colors relative group", children: /* @__PURE__ */ P.jsx("div", { className: "absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-cyber-electric/0 group-hover:bg-cyber-electric/60 transition-colors" }) }),
    y.response && /* @__PURE__ */ P.jsxs("div", { className: "flex flex-col shrink-0 overflow-hidden border-t border-cyber-line/50", style: { height: M }, children: [
      /* @__PURE__ */ P.jsxs("div", { className: "flex shrink-0 items-center justify-between px-3 py-2 border-b border-cyber-line/30 bg-cyber-base/30", children: [
        /* @__PURE__ */ P.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ P.jsx("span", { className: "text-lg font-bold font-mono " + iD(y.response.status), children: y.response.status }),
          /* @__PURE__ */ P.jsx("span", { className: "text-[11px] font-mono text-slate-300", children: aD(y.response.status) || y.response.statusText })
        ] }),
        /* @__PURE__ */ P.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ P.jsxs("span", { className: "text-[9px] text-slate-500 font-mono", children: [
            y.response.duration,
            "ms"
          ] }),
          /* @__PURE__ */ P.jsx("span", { className: "text-[9px] text-slate-500 font-mono", children: lD(y.response.size) }),
          /* @__PURE__ */ P.jsxs("button", { type: "button", onClick: ne, className: "rounded border border-cyber-line/40 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition flex items-center gap-1", children: [
            /* @__PURE__ */ P.jsx(Ux, {}),
            y.copied ? "Copied!" : "Copy"
          ] })
        ] })
      ] }),
      Object.keys(y.response.headers).length > 0 && /* @__PURE__ */ P.jsxs("details", { className: "shrink-0 border-b border-cyber-line/20", children: [
        /* @__PURE__ */ P.jsx("summary", { className: "px-3 py-1.5 text-[10px] text-slate-500 cursor-pointer hover:text-slate-300 font-semibold uppercase tracking-wider", children: "Response Headers (" + Object.keys(y.response.headers).length + ")" }),
        /* @__PURE__ */ P.jsx("div", { className: "px-3 py-1.5 space-y-0.5 max-h-32 overflow-y-auto", children: Object.entries(y.response.headers).map(([$, xe]) => /* @__PURE__ */ P.jsxs("div", { className: "flex gap-2 text-[10px] font-mono", children: [
          /* @__PURE__ */ P.jsxs("span", { className: "text-cyber-neon shrink-0", children: [
            $,
            ":"
          ] }),
          /* @__PURE__ */ P.jsx("span", { className: "text-slate-400 break-all", children: xe })
        ] }, $)) })
      ] }),
      /* @__PURE__ */ P.jsx("pre", { className: "flex-1 overflow-auto p-3 text-[11px] text-slate-300 font-mono whitespace-pre-wrap break-all leading-relaxed", children: /* @__PURE__ */ P.jsx("code", { children: uD(y.response.body) }) })
    ] }),
    y.isLoading && /* @__PURE__ */ P.jsxs("div", { className: "flex shrink-0 items-center gap-2 border-t border-cyber-line/50 bg-cyber-panel/20 px-3 py-2", children: [
      /* @__PURE__ */ P.jsx(Mx, {}),
      /* @__PURE__ */ P.jsx("span", { className: "text-[11px] text-slate-400 font-mono", children: y.isStreaming ? "Streaming... (click to abort)" : "Sending request..." })
    ] })
  ] });
}
function yD() {
  const [y, M] = xn.useState([]), [x, J] = xn.useState(""), te = xn.useRef((S) => {
    M(S.detail);
  });
  xn.useEffect(() => {
    M(jx());
    const S = te.current;
    return window.addEventListener("apiclient-history-changed", S), () => window.removeEventListener("apiclient-history-changed", S);
  }, []);
  const Ne = xn.useMemo(() => {
    const S = x.trim().toLowerCase();
    return S ? y.filter((Qe) => Qe.url.toLowerCase().includes(S) || Qe.method.toLowerCase().includes(S)) : y;
  }, [y, x]);
  return /* @__PURE__ */ P.jsxs("div", { className: "flex h-full flex-col overflow-hidden", children: [
    /* @__PURE__ */ P.jsxs("div", { className: "flex shrink-0 items-center justify-between border-b border-cyber-line p-4", children: [
      /* @__PURE__ */ P.jsx("h2", { className: "font-display text-xs font-bold uppercase tracking-[0.2em] text-cyber-neon", children: "API History" }),
      /* @__PURE__ */ P.jsx("button", { type: "button", onClick: () => F_(), className: "rounded border border-cyber-line/40 px-2 py-0.5 text-[9px] font-semibold uppercase text-slate-400 hover:border-red-400/40 hover:text-red-400", children: "Clear" })
    ] }),
    /* @__PURE__ */ P.jsx("div", { className: "shrink-0 border-b border-cyber-line/50 p-2", children: /* @__PURE__ */ P.jsx(
      "input",
      {
        type: "text",
        placeholder: "Search URL or method...",
        value: x,
        onChange: (S) => J(S.target.value),
        className: "w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-[11px] text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyber-electric"
      }
    ) }),
    /* @__PURE__ */ P.jsx("div", { className: "flex-1 overflow-y-auto", children: Ne.length === 0 ? /* @__PURE__ */ P.jsx("div", { className: "p-6 text-center text-[11px] text-slate-600", children: y.length === 0 ? "No requests yet." : `No results for "${x}".` }) : Ne.map((S, Qe) => /* @__PURE__ */ P.jsxs(
      "button",
      {
        type: "button",
        onClick: () => window.dispatchEvent(new CustomEvent("apiclient-history-select", { detail: S })),
        className: "flex w-full items-start gap-2 border-b border-cyber-line/20 px-4 py-2.5 text-left transition hover:bg-cyber-neon/5",
        children: [
          /* @__PURE__ */ P.jsx("span", { className: "min-w-[44px] shrink-0 font-mono text-[10px] font-bold", style: { color: _S[S.method] }, children: S.method }),
          /* @__PURE__ */ P.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ P.jsx("div", { className: "truncate font-mono text-[11px] text-slate-300", children: S.url }),
            /* @__PURE__ */ P.jsx("div", { className: "mt-0.5 text-[9px] text-slate-600", children: new Date(S.timestamp).toLocaleString() })
          ] })
        ]
      },
      `${S.method}:${S.url}:${Qe}`
    )) })
  ] });
}
function Px(y) {
  if (y.apiVersion !== 1 || y.moduleId !== "clx.api-client")
    throw new Error("API Client requires CLX UI host API v1");
  P_(y);
}
function CD(y) {
  Px(y), y.registerContribution({
    id: "api-client.main",
    kind: "mainPanel",
    mount(M) {
      const x = Ax.createRoot(M);
      return x.render(/* @__PURE__ */ P.jsx(mD, {})), () => x.unmount();
    }
  });
}
function bD(y) {
  Px(y), y.registerContribution({
    id: "api-client.history",
    kind: "mainPanel",
    mount(M) {
      const x = Ax.createRoot(M);
      return x.render(/* @__PURE__ */ P.jsx(yD, {})), () => x.unmount();
    }
  });
}
export {
  bD as registerHistory,
  CD as registerMain
};
