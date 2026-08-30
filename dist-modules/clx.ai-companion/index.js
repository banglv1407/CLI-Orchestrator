var Gm = { exports: {} }, Zp = {}, qm = { exports: {} }, Ct = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var XR;
function tk() {
  if (XR) return Ct;
  XR = 1;
  var Q = Symbol.for("react.element"), I = Symbol.for("react.portal"), N = Symbol.for("react.fragment"), wt = Symbol.for("react.strict_mode"), tt = Symbol.for("react.profiler"), gt = Symbol.for("react.provider"), S = Symbol.for("react.context"), Dt = Symbol.for("react.forward_ref"), ce = Symbol.for("react.suspense"), pe = Symbol.for("react.memo"), Pe = Symbol.for("react.lazy"), Z = Symbol.iterator;
  function ye(_) {
    return _ === null || typeof _ != "object" ? null : (_ = Z && _[Z] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var re = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Fe = Object.assign, nt = {};
  function rt(_, P, Ve) {
    this.props = _, this.context = P, this.refs = nt, this.updater = Ve || re;
  }
  rt.prototype.isReactComponent = {}, rt.prototype.setState = function(_, P) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, _, P, "setState");
  }, rt.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function tn() {
  }
  tn.prototype = rt.prototype;
  function ot(_, P, Ve) {
    this.props = _, this.context = P, this.refs = nt, this.updater = Ve || re;
  }
  var Ye = ot.prototype = new tn();
  Ye.constructor = ot, Fe(Ye, rt.prototype), Ye.isPureReactComponent = !0;
  var vt = Array.isArray, ee = Object.prototype.hasOwnProperty, Ae = { current: null }, ge = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Ot(_, P, Ve) {
    var je, ct = {}, at = null, Ze = null;
    if (P != null) for (je in P.ref !== void 0 && (Ze = P.ref), P.key !== void 0 && (at = "" + P.key), P) ee.call(P, je) && !ge.hasOwnProperty(je) && (ct[je] = P[je]);
    var it = arguments.length - 2;
    if (it === 1) ct.children = Ve;
    else if (1 < it) {
      for (var ft = Array(it), Yt = 0; Yt < it; Yt++) ft[Yt] = arguments[Yt + 2];
      ct.children = ft;
    }
    if (_ && _.defaultProps) for (je in it = _.defaultProps, it) ct[je] === void 0 && (ct[je] = it[je]);
    return { $$typeof: Q, type: _, key: at, ref: Ze, props: ct, _owner: Ae.current };
  }
  function St(_, P) {
    return { $$typeof: Q, type: _.type, key: P, ref: _.ref, props: _.props, _owner: _._owner };
  }
  function st(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === Q;
  }
  function ht(_) {
    var P = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function(Ve) {
      return P[Ve];
    });
  }
  var Ge = /\/+/g;
  function _e(_, P) {
    return typeof _ == "object" && _ !== null && _.key != null ? ht("" + _.key) : P.toString(36);
  }
  function Pt(_, P, Ve, je, ct) {
    var at = typeof _;
    (at === "undefined" || at === "boolean") && (_ = null);
    var Ze = !1;
    if (_ === null) Ze = !0;
    else switch (at) {
      case "string":
      case "number":
        Ze = !0;
        break;
      case "object":
        switch (_.$$typeof) {
          case Q:
          case I:
            Ze = !0;
        }
    }
    if (Ze) return Ze = _, ct = ct(Ze), _ = je === "" ? "." + _e(Ze, 0) : je, vt(ct) ? (Ve = "", _ != null && (Ve = _.replace(Ge, "$&/") + "/"), Pt(ct, P, Ve, "", function(Yt) {
      return Yt;
    })) : ct != null && (st(ct) && (ct = St(ct, Ve + (!ct.key || Ze && Ze.key === ct.key ? "" : ("" + ct.key).replace(Ge, "$&/") + "/") + _)), P.push(ct)), 1;
    if (Ze = 0, je = je === "" ? "." : je + ":", vt(_)) for (var it = 0; it < _.length; it++) {
      at = _[it];
      var ft = je + _e(at, it);
      Ze += Pt(at, P, Ve, ft, ct);
    }
    else if (ft = ye(_), typeof ft == "function") for (_ = ft.call(_), it = 0; !(at = _.next()).done; ) at = at.value, ft = je + _e(at, it++), Ze += Pt(at, P, Ve, ft, ct);
    else if (at === "object") throw P = String(_), Error("Objects are not valid as a React child (found: " + (P === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : P) + "). If you meant to render a collection of children, use an array instead.");
    return Ze;
  }
  function Lt(_, P, Ve) {
    if (_ == null) return _;
    var je = [], ct = 0;
    return Pt(_, je, "", "", function(at) {
      return P.call(Ve, at, ct++);
    }), je;
  }
  function Nt(_) {
    if (_._status === -1) {
      var P = _._result;
      P = P(), P.then(function(Ve) {
        (_._status === 0 || _._status === -1) && (_._status = 1, _._result = Ve);
      }, function(Ve) {
        (_._status === 0 || _._status === -1) && (_._status = 2, _._result = Ve);
      }), _._status === -1 && (_._status = 0, _._result = P);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var Te = { current: null }, J = { transition: null }, xe = { ReactCurrentDispatcher: Te, ReactCurrentBatchConfig: J, ReactCurrentOwner: Ae };
  function ae() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Ct.Children = { map: Lt, forEach: function(_, P, Ve) {
    Lt(_, function() {
      P.apply(this, arguments);
    }, Ve);
  }, count: function(_) {
    var P = 0;
    return Lt(_, function() {
      P++;
    }), P;
  }, toArray: function(_) {
    return Lt(_, function(P) {
      return P;
    }) || [];
  }, only: function(_) {
    if (!st(_)) throw Error("React.Children.only expected to receive a single React element child.");
    return _;
  } }, Ct.Component = rt, Ct.Fragment = N, Ct.Profiler = tt, Ct.PureComponent = ot, Ct.StrictMode = wt, Ct.Suspense = ce, Ct.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = xe, Ct.act = ae, Ct.cloneElement = function(_, P, Ve) {
    if (_ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + _ + ".");
    var je = Fe({}, _.props), ct = _.key, at = _.ref, Ze = _._owner;
    if (P != null) {
      if (P.ref !== void 0 && (at = P.ref, Ze = Ae.current), P.key !== void 0 && (ct = "" + P.key), _.type && _.type.defaultProps) var it = _.type.defaultProps;
      for (ft in P) ee.call(P, ft) && !ge.hasOwnProperty(ft) && (je[ft] = P[ft] === void 0 && it !== void 0 ? it[ft] : P[ft]);
    }
    var ft = arguments.length - 2;
    if (ft === 1) je.children = Ve;
    else if (1 < ft) {
      it = Array(ft);
      for (var Yt = 0; Yt < ft; Yt++) it[Yt] = arguments[Yt + 2];
      je.children = it;
    }
    return { $$typeof: Q, type: _.type, key: ct, ref: at, props: je, _owner: Ze };
  }, Ct.createContext = function(_) {
    return _ = { $$typeof: S, _currentValue: _, _currentValue2: _, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, _.Provider = { $$typeof: gt, _context: _ }, _.Consumer = _;
  }, Ct.createElement = Ot, Ct.createFactory = function(_) {
    var P = Ot.bind(null, _);
    return P.type = _, P;
  }, Ct.createRef = function() {
    return { current: null };
  }, Ct.forwardRef = function(_) {
    return { $$typeof: Dt, render: _ };
  }, Ct.isValidElement = st, Ct.lazy = function(_) {
    return { $$typeof: Pe, _payload: { _status: -1, _result: _ }, _init: Nt };
  }, Ct.memo = function(_, P) {
    return { $$typeof: pe, type: _, compare: P === void 0 ? null : P };
  }, Ct.startTransition = function(_) {
    var P = J.transition;
    J.transition = {};
    try {
      _();
    } finally {
      J.transition = P;
    }
  }, Ct.unstable_act = ae, Ct.useCallback = function(_, P) {
    return Te.current.useCallback(_, P);
  }, Ct.useContext = function(_) {
    return Te.current.useContext(_);
  }, Ct.useDebugValue = function() {
  }, Ct.useDeferredValue = function(_) {
    return Te.current.useDeferredValue(_);
  }, Ct.useEffect = function(_, P) {
    return Te.current.useEffect(_, P);
  }, Ct.useId = function() {
    return Te.current.useId();
  }, Ct.useImperativeHandle = function(_, P, Ve) {
    return Te.current.useImperativeHandle(_, P, Ve);
  }, Ct.useInsertionEffect = function(_, P) {
    return Te.current.useInsertionEffect(_, P);
  }, Ct.useLayoutEffect = function(_, P) {
    return Te.current.useLayoutEffect(_, P);
  }, Ct.useMemo = function(_, P) {
    return Te.current.useMemo(_, P);
  }, Ct.useReducer = function(_, P, Ve) {
    return Te.current.useReducer(_, P, Ve);
  }, Ct.useRef = function(_) {
    return Te.current.useRef(_);
  }, Ct.useState = function(_) {
    return Te.current.useState(_);
  }, Ct.useSyncExternalStore = function(_, P, Ve) {
    return Te.current.useSyncExternalStore(_, P, Ve);
  }, Ct.useTransition = function() {
    return Te.current.useTransition();
  }, Ct.version = "18.3.1", Ct;
}
var tv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
tv.exports;
var JR;
function nk() {
  return JR || (JR = 1, (function(Q, I) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var N = "18.3.1", wt = Symbol.for("react.element"), tt = Symbol.for("react.portal"), gt = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), Dt = Symbol.for("react.profiler"), ce = Symbol.for("react.provider"), pe = Symbol.for("react.context"), Pe = Symbol.for("react.forward_ref"), Z = Symbol.for("react.suspense"), ye = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), Fe = Symbol.for("react.lazy"), nt = Symbol.for("react.offscreen"), rt = Symbol.iterator, tn = "@@iterator";
      function ot(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = rt && h[rt] || h[tn];
        return typeof C == "function" ? C : null;
      }
      var Ye = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, vt = {
        transition: null
      }, ee = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Ae = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ge = {}, Ot = null;
      function St(h) {
        Ot = h;
      }
      ge.setExtraStackFrame = function(h) {
        Ot = h;
      }, ge.getCurrentStack = null, ge.getStackAddendum = function() {
        var h = "";
        Ot && (h += Ot);
        var C = ge.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var st = !1, ht = !1, Ge = !1, _e = !1, Pt = !1, Lt = {
        ReactCurrentDispatcher: Ye,
        ReactCurrentBatchConfig: vt,
        ReactCurrentOwner: Ae
      };
      Lt.ReactDebugCurrentFrame = ge, Lt.ReactCurrentActQueue = ee;
      function Nt(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), j = 1; j < C; j++)
            z[j - 1] = arguments[j];
          J("warn", h, z);
        }
      }
      function Te(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), j = 1; j < C; j++)
            z[j - 1] = arguments[j];
          J("error", h, z);
        }
      }
      function J(h, C, z) {
        {
          var j = Lt.ReactDebugCurrentFrame, X = j.getStackAddendum();
          X !== "" && (C += "%s", z = z.concat([X]));
          var Le = z.map(function(ie) {
            return String(ie);
          });
          Le.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Le);
        }
      }
      var xe = {};
      function ae(h, C) {
        {
          var z = h.constructor, j = z && (z.displayName || z.name) || "ReactClass", X = j + "." + C;
          if (xe[X])
            return;
          Te("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, j), xe[X] = !0;
        }
      }
      var _ = {
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
        enqueueForceUpdate: function(h, C, z) {
          ae(h, "forceUpdate");
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
        enqueueReplaceState: function(h, C, z, j) {
          ae(h, "replaceState");
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
        enqueueSetState: function(h, C, z, j) {
          ae(h, "setState");
        }
      }, P = Object.assign, Ve = {};
      Object.freeze(Ve);
      function je(h, C, z) {
        this.props = h, this.context = C, this.refs = Ve, this.updater = z || _;
      }
      je.prototype.isReactComponent = {}, je.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, je.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var ct = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, at = function(h, C) {
          Object.defineProperty(je.prototype, h, {
            get: function() {
              Nt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var Ze in ct)
          ct.hasOwnProperty(Ze) && at(Ze, ct[Ze]);
      }
      function it() {
      }
      it.prototype = je.prototype;
      function ft(h, C, z) {
        this.props = h, this.context = C, this.refs = Ve, this.updater = z || _;
      }
      var Yt = ft.prototype = new it();
      Yt.constructor = ft, P(Yt, je.prototype), Yt.isPureReactComponent = !0;
      function On() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var wr = Array.isArray;
      function Cn(h) {
        return wr(h);
      }
      function nr(h) {
        {
          var C = typeof Symbol == "function" && Symbol.toStringTag, z = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return z;
        }
      }
      function Vn(h) {
        try {
          return Bn(h), !1;
        } catch {
          return !0;
        }
      }
      function Bn(h) {
        return "" + h;
      }
      function $r(h) {
        if (Vn(h))
          return Te("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", nr(h)), Bn(h);
      }
      function ci(h, C, z) {
        var j = h.displayName;
        if (j)
          return j;
        var X = C.displayName || C.name || "";
        return X !== "" ? z + "(" + X + ")" : z;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function qn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Te("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case gt:
            return "Fragment";
          case tt:
            return "Portal";
          case Dt:
            return "Profiler";
          case S:
            return "StrictMode";
          case Z:
            return "Suspense";
          case ye:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case pe:
              var C = h;
              return sa(C) + ".Consumer";
            case ce:
              var z = h;
              return sa(z._context) + ".Provider";
            case Pe:
              return ci(h, h.render, "ForwardRef");
            case re:
              var j = h.displayName || null;
              return j !== null ? j : qn(h.type) || "Memo";
            case Fe: {
              var X = h, Le = X._payload, ie = X._init;
              try {
                return qn(ie(Le));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Rn = Object.prototype.hasOwnProperty, In = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, gr, $a, Ln;
      Ln = {};
      function Sr(h) {
        if (Rn.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function ca(h) {
        if (Rn.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function Qa(h, C) {
        var z = function() {
          gr || (gr = !0, Te("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: z,
          configurable: !0
        });
      }
      function fi(h, C) {
        var z = function() {
          $a || ($a = !0, Te("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: z,
          configurable: !0
        });
      }
      function te(h) {
        if (typeof h.ref == "string" && Ae.current && h.__self && Ae.current.stateNode !== h.__self) {
          var C = qn(Ae.current.type);
          Ln[C] || (Te('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Ln[C] = !0);
        }
      }
      var be = function(h, C, z, j, X, Le, ie) {
        var ze = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: wt,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: z,
          props: ie,
          // Record the component responsible for creating this element.
          _owner: Le
        };
        return ze._store = {}, Object.defineProperty(ze._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(ze, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: j
        }), Object.defineProperty(ze, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: X
        }), Object.freeze && (Object.freeze(ze.props), Object.freeze(ze)), ze;
      };
      function lt(h, C, z) {
        var j, X = {}, Le = null, ie = null, ze = null, yt = null;
        if (C != null) {
          Sr(C) && (ie = C.ref, te(C)), ca(C) && ($r(C.key), Le = "" + C.key), ze = C.__self === void 0 ? null : C.__self, yt = C.__source === void 0 ? null : C.__source;
          for (j in C)
            Rn.call(C, j) && !In.hasOwnProperty(j) && (X[j] = C[j]);
        }
        var kt = arguments.length - 2;
        if (kt === 1)
          X.children = z;
        else if (kt > 1) {
          for (var ln = Array(kt), qt = 0; qt < kt; qt++)
            ln[qt] = arguments[qt + 2];
          Object.freeze && Object.freeze(ln), X.children = ln;
        }
        if (h && h.defaultProps) {
          var ut = h.defaultProps;
          for (j in ut)
            X[j] === void 0 && (X[j] = ut[j]);
        }
        if (Le || ie) {
          var Kt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Le && Qa(X, Kt), ie && fi(X, Kt);
        }
        return be(h, Le, ie, ze, yt, Ae.current, X);
      }
      function Vt(h, C) {
        var z = be(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return z;
      }
      function nn(h, C, z) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var j, X = P({}, h.props), Le = h.key, ie = h.ref, ze = h._self, yt = h._source, kt = h._owner;
        if (C != null) {
          Sr(C) && (ie = C.ref, kt = Ae.current), ca(C) && ($r(C.key), Le = "" + C.key);
          var ln;
          h.type && h.type.defaultProps && (ln = h.type.defaultProps);
          for (j in C)
            Rn.call(C, j) && !In.hasOwnProperty(j) && (C[j] === void 0 && ln !== void 0 ? X[j] = ln[j] : X[j] = C[j]);
        }
        var qt = arguments.length - 2;
        if (qt === 1)
          X.children = z;
        else if (qt > 1) {
          for (var ut = Array(qt), Kt = 0; Kt < qt; Kt++)
            ut[Kt] = arguments[Kt + 2];
          X.children = ut;
        }
        return be(h.type, Le, ie, ze, yt, kt, X);
      }
      function vn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === wt;
      }
      var on = ".", Kn = ":";
      function rn(h) {
        var C = /[=:]/g, z = {
          "=": "=0",
          ":": "=2"
        }, j = h.replace(C, function(X) {
          return z[X];
        });
        return "$" + j;
      }
      var Qt = !1, Wt = /\/+/g;
      function fa(h) {
        return h.replace(Wt, "$&/");
      }
      function Er(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), rn("" + h.key)) : C.toString(36);
      }
      function xa(h, C, z, j, X) {
        var Le = typeof h;
        (Le === "undefined" || Le === "boolean") && (h = null);
        var ie = !1;
        if (h === null)
          ie = !0;
        else
          switch (Le) {
            case "string":
            case "number":
              ie = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case wt:
                case tt:
                  ie = !0;
              }
          }
        if (ie) {
          var ze = h, yt = X(ze), kt = j === "" ? on + Er(ze, 0) : j;
          if (Cn(yt)) {
            var ln = "";
            kt != null && (ln = fa(kt) + "/"), xa(yt, C, ln, "", function(Xf) {
              return Xf;
            });
          } else yt != null && (vn(yt) && (yt.key && (!ze || ze.key !== yt.key) && $r(yt.key), yt = Vt(
            yt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            z + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (yt.key && (!ze || ze.key !== yt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + yt.key) + "/"
            ) : "") + kt
          )), C.push(yt));
          return 1;
        }
        var qt, ut, Kt = 0, hn = j === "" ? on : j + Kn;
        if (Cn(h))
          for (var Rl = 0; Rl < h.length; Rl++)
            qt = h[Rl], ut = hn + Er(qt, Rl), Kt += xa(qt, C, z, ut, X);
        else {
          var qo = ot(h);
          if (typeof qo == "function") {
            var Bi = h;
            qo === Bi.entries && (Qt || Nt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Qt = !0);
            for (var Ko = qo.call(Bi), ou, Kf = 0; !(ou = Ko.next()).done; )
              qt = ou.value, ut = hn + Er(qt, Kf++), Kt += xa(qt, C, z, ut, X);
          } else if (Le === "object") {
            var sc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (sc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : sc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Kt;
      }
      function Hi(h, C, z) {
        if (h == null)
          return h;
        var j = [], X = 0;
        return xa(h, j, "", "", function(Le) {
          return C.call(z, Le, X++);
        }), j;
      }
      function Zl(h) {
        var C = 0;
        return Hi(h, function() {
          C++;
        }), C;
      }
      function eu(h, C, z) {
        Hi(h, function() {
          C.apply(this, arguments);
        }, z);
      }
      function pl(h) {
        return Hi(h, function(C) {
          return C;
        }) || [];
      }
      function vl(h) {
        if (!vn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function tu(h) {
        var C = {
          $$typeof: pe,
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
        C.Provider = {
          $$typeof: ce,
          _context: C
        };
        var z = !1, j = !1, X = !1;
        {
          var Le = {
            $$typeof: pe,
            _context: C
          };
          Object.defineProperties(Le, {
            Provider: {
              get: function() {
                return j || (j = !0, Te("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(ie) {
                C.Provider = ie;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(ie) {
                C._currentValue = ie;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(ie) {
                C._currentValue2 = ie;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(ie) {
                C._threadCount = ie;
              }
            },
            Consumer: {
              get: function() {
                return z || (z = !0, Te("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(ie) {
                X || (Nt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ie), X = !0);
              }
            }
          }), C.Consumer = Le;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var _r = -1, kr = 0, rr = 1, di = 2;
      function Wa(h) {
        if (h._status === _r) {
          var C = h._result, z = C();
          if (z.then(function(Le) {
            if (h._status === kr || h._status === _r) {
              var ie = h;
              ie._status = rr, ie._result = Le;
            }
          }, function(Le) {
            if (h._status === kr || h._status === _r) {
              var ie = h;
              ie._status = di, ie._result = Le;
            }
          }), h._status === _r) {
            var j = h;
            j._status = kr, j._result = z;
          }
        }
        if (h._status === rr) {
          var X = h._result;
          return X === void 0 && Te(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, X), "default" in X || Te(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, X), X.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var C = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, z = {
          $$typeof: Fe,
          _payload: C,
          _init: Wa
        };
        {
          var j, X;
          Object.defineProperties(z, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return j;
              },
              set: function(Le) {
                Te("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), j = Le, Object.defineProperty(z, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return X;
              },
              set: function(Le) {
                Te("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), X = Le, Object.defineProperty(z, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return z;
      }
      function vi(h) {
        h != null && h.$$typeof === re ? Te("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Te("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Te("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Te("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: Pe,
          render: h
        };
        {
          var z;
          Object.defineProperty(C, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return z;
            },
            set: function(j) {
              z = j, !h.name && !h.displayName && (h.displayName = j);
            }
          });
        }
        return C;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function B(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === gt || h === Dt || Pt || h === S || h === Z || h === ye || _e || h === nt || st || ht || Ge || typeof h == "object" && h !== null && (h.$$typeof === Fe || h.$$typeof === re || h.$$typeof === ce || h.$$typeof === pe || h.$$typeof === Pe || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function le(h, C) {
        B(h) || Te("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var z = {
          $$typeof: re,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var j;
          Object.defineProperty(z, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return j;
            },
            set: function(X) {
              j = X, !h.name && !h.displayName && (h.displayName = X);
            }
          });
        }
        return z;
      }
      function me() {
        var h = Ye.current;
        return h === null && Te(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function Ke(h) {
        var C = me();
        if (h._context !== void 0) {
          var z = h._context;
          z.Consumer === h ? Te("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : z.Provider === h && Te("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function Qe(h) {
        var C = me();
        return C.useState(h);
      }
      function mt(h, C, z) {
        var j = me();
        return j.useReducer(h, C, z);
      }
      function dt(h) {
        var C = me();
        return C.useRef(h);
      }
      function Tn(h, C) {
        var z = me();
        return z.useEffect(h, C);
      }
      function an(h, C) {
        var z = me();
        return z.useInsertionEffect(h, C);
      }
      function sn(h, C) {
        var z = me();
        return z.useLayoutEffect(h, C);
      }
      function ar(h, C) {
        var z = me();
        return z.useCallback(h, C);
      }
      function Ga(h, C) {
        var z = me();
        return z.useMemo(h, C);
      }
      function qa(h, C, z) {
        var j = me();
        return j.useImperativeHandle(h, C, z);
      }
      function Xe(h, C) {
        {
          var z = me();
          return z.useDebugValue(h, C);
        }
      }
      function et() {
        var h = me();
        return h.useTransition();
      }
      function Ka(h) {
        var C = me();
        return C.useDeferredValue(h);
      }
      function nu() {
        var h = me();
        return h.useId();
      }
      function ru(h, C, z) {
        var j = me();
        return j.useSyncExternalStore(h, C, z);
      }
      var hl = 0, Wu, ml, Qr, $o, Dr, uc, oc;
      function Gu() {
      }
      Gu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Wu = console.log, ml = console.info, Qr = console.warn, $o = console.error, Dr = console.group, uc = console.groupCollapsed, oc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Gu,
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
          hl++;
        }
      }
      function da() {
        {
          if (hl--, hl === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: P({}, h, {
                value: Wu
              }),
              info: P({}, h, {
                value: ml
              }),
              warn: P({}, h, {
                value: Qr
              }),
              error: P({}, h, {
                value: $o
              }),
              group: P({}, h, {
                value: Dr
              }),
              groupCollapsed: P({}, h, {
                value: uc
              }),
              groupEnd: P({}, h, {
                value: oc
              })
            });
          }
          hl < 0 && Te("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = Lt.ReactCurrentDispatcher, Ja;
      function qu(h, C, z) {
        {
          if (Ja === void 0)
            try {
              throw Error();
            } catch (X) {
              var j = X.stack.trim().match(/\n( *(at )?)/);
              Ja = j && j[1] || "";
            }
          return `
` + Ja + h;
        }
      }
      var au = !1, gl;
      {
        var Ku = typeof WeakMap == "function" ? WeakMap : Map;
        gl = new Ku();
      }
      function Xu(h, C) {
        if (!h || au)
          return "";
        {
          var z = gl.get(h);
          if (z !== void 0)
            return z;
        }
        var j;
        au = !0;
        var X = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Le;
        Le = Xa.current, Xa.current = null, yl();
        try {
          if (C) {
            var ie = function() {
              throw Error();
            };
            if (Object.defineProperty(ie.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ie, []);
              } catch (hn) {
                j = hn;
              }
              Reflect.construct(h, [], ie);
            } else {
              try {
                ie.call();
              } catch (hn) {
                j = hn;
              }
              h.call(ie.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (hn) {
              j = hn;
            }
            h();
          }
        } catch (hn) {
          if (hn && j && typeof hn.stack == "string") {
            for (var ze = hn.stack.split(`
`), yt = j.stack.split(`
`), kt = ze.length - 1, ln = yt.length - 1; kt >= 1 && ln >= 0 && ze[kt] !== yt[ln]; )
              ln--;
            for (; kt >= 1 && ln >= 0; kt--, ln--)
              if (ze[kt] !== yt[ln]) {
                if (kt !== 1 || ln !== 1)
                  do
                    if (kt--, ln--, ln < 0 || ze[kt] !== yt[ln]) {
                      var qt = `
` + ze[kt].replace(" at new ", " at ");
                      return h.displayName && qt.includes("<anonymous>") && (qt = qt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, qt), qt;
                    }
                  while (kt >= 1 && ln >= 0);
                break;
              }
          }
        } finally {
          au = !1, Xa.current = Le, da(), Error.prepareStackTrace = X;
        }
        var ut = h ? h.displayName || h.name : "", Kt = ut ? qu(ut) : "";
        return typeof h == "function" && gl.set(h, Kt), Kt;
      }
      function Pi(h, C, z) {
        return Xu(h, !1);
      }
      function Gf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, z) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Xu(h, Gf(h));
        if (typeof h == "string")
          return qu(h);
        switch (h) {
          case Z:
            return qu("Suspense");
          case ye:
            return qu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Pe:
              return Pi(h.render);
            case re:
              return Vi(h.type, C, z);
            case Fe: {
              var j = h, X = j._payload, Le = j._init;
              try {
                return Vi(Le(X), C, z);
              } catch {
              }
            }
          }
        return "";
      }
      var zt = {}, Ju = Lt.ReactDebugCurrentFrame;
      function _t(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          Ju.setExtraStackFrame(z);
        } else
          Ju.setExtraStackFrame(null);
      }
      function Qo(h, C, z, j, X) {
        {
          var Le = Function.call.bind(Rn);
          for (var ie in h)
            if (Le(h, ie)) {
              var ze = void 0;
              try {
                if (typeof h[ie] != "function") {
                  var yt = Error((j || "React class") + ": " + z + " type `" + ie + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[ie] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw yt.name = "Invariant Violation", yt;
                }
                ze = h[ie](C, ie, j, z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (kt) {
                ze = kt;
              }
              ze && !(ze instanceof Error) && (_t(X), Te("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", j || "React class", z, ie, typeof ze), _t(null)), ze instanceof Error && !(ze.message in zt) && (zt[ze.message] = !0, _t(X), Te("Failed %s type: %s", z, ze.message), _t(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          St(z);
        } else
          St(null);
      }
      var $e;
      $e = !1;
      function Zu() {
        if (Ae.current) {
          var h = qn(Ae.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function ir(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), z = h.lineNumber;
          return `

Check your code at ` + C + ":" + z + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? ir(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var C = Zu();
        if (!C) {
          var z = typeof h == "string" ? h : h.displayName || h.name;
          z && (C = `

Check the top-level render call using <` + z + ">.");
        }
        return C;
      }
      function cn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var z = yi(C);
          if (!Or[z]) {
            Or[z] = !0;
            var j = "";
            h && h._owner && h._owner !== Ae.current && (j = " It was passed a child from " + qn(h._owner.type) + "."), hi(h), Te('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', z, j), hi(null);
          }
        }
      }
      function Gt(h, C) {
        if (typeof h == "object") {
          if (Cn(h))
            for (var z = 0; z < h.length; z++) {
              var j = h[z];
              vn(j) && cn(j, C);
            }
          else if (vn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var X = ot(h);
            if (typeof X == "function" && X !== h.entries)
              for (var Le = X.call(h), ie; !(ie = Le.next()).done; )
                vn(ie.value) && cn(ie.value, C);
          }
        }
      }
      function Sl(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var z;
          if (typeof C == "function")
            z = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === Pe || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === re))
            z = C.propTypes;
          else
            return;
          if (z) {
            var j = qn(C);
            Qo(z, h.props, "prop", j, h);
          } else if (C.PropTypes !== void 0 && !$e) {
            $e = !0;
            var X = qn(C);
            Te("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", X || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && Te("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Yn(h) {
        {
          for (var C = Object.keys(h.props), z = 0; z < C.length; z++) {
            var j = C[z];
            if (j !== "children" && j !== "key") {
              hi(h), Te("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", j), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), Te("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Lr(h, C, z) {
        var j = B(h);
        if (!j) {
          var X = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (X += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Le = mi(C);
          Le ? X += Le : X += Zu();
          var ie;
          h === null ? ie = "null" : Cn(h) ? ie = "array" : h !== void 0 && h.$$typeof === wt ? (ie = "<" + (qn(h.type) || "Unknown") + " />", X = " Did you accidentally export a JSX literal instead of a component?") : ie = typeof h, Te("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ie, X);
        }
        var ze = lt.apply(this, arguments);
        if (ze == null)
          return ze;
        if (j)
          for (var yt = 2; yt < arguments.length; yt++)
            Gt(arguments[yt], h);
        return h === gt ? Yn(ze) : Sl(ze), ze;
      }
      var ba = !1;
      function iu(h) {
        var C = Lr.bind(null, h);
        return C.type = h, ba || (ba = !0, Nt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return Nt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Wo(h, C, z) {
        for (var j = nn.apply(this, arguments), X = 2; X < arguments.length; X++)
          Gt(arguments[X], j.type);
        return Sl(j), j;
      }
      function Go(h, C) {
        var z = vt.transition;
        vt.transition = {};
        var j = vt.transition;
        vt.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (vt.transition = z, z === null && j._updatedFibers) {
            var X = j._updatedFibers.size;
            X > 10 && Nt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), j._updatedFibers.clear();
          }
        }
      }
      var El = !1, lu = null;
      function qf(h) {
        if (lu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), z = Q && Q[C];
            lu = z.call(Q, "timers").setImmediate;
          } catch {
            lu = function(X) {
              El === !1 && (El = !0, typeof MessageChannel > "u" && Te("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Le = new MessageChannel();
              Le.port1.onmessage = X, Le.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var wa = 0, Za = !1;
      function gi(h) {
        {
          var C = wa;
          wa++, ee.current === null && (ee.current = []);
          var z = ee.isBatchingLegacy, j;
          try {
            if (ee.isBatchingLegacy = !0, j = h(), !z && ee.didScheduleLegacyUpdate) {
              var X = ee.current;
              X !== null && (ee.didScheduleLegacyUpdate = !1, Cl(X));
            }
          } catch (ut) {
            throw _a(C), ut;
          } finally {
            ee.isBatchingLegacy = z;
          }
          if (j !== null && typeof j == "object" && typeof j.then == "function") {
            var Le = j, ie = !1, ze = {
              then: function(ut, Kt) {
                ie = !0, Le.then(function(hn) {
                  _a(C), wa === 0 ? eo(hn, ut, Kt) : ut(hn);
                }, function(hn) {
                  _a(C), Kt(hn);
                });
              }
            };
            return !Za && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ie || (Za = !0, Te("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), ze;
          } else {
            var yt = j;
            if (_a(C), wa === 0) {
              var kt = ee.current;
              kt !== null && (Cl(kt), ee.current = null);
              var ln = {
                then: function(ut, Kt) {
                  ee.current === null ? (ee.current = [], eo(yt, ut, Kt)) : ut(yt);
                }
              };
              return ln;
            } else {
              var qt = {
                then: function(ut, Kt) {
                  ut(yt);
                }
              };
              return qt;
            }
          }
        }
      }
      function _a(h) {
        h !== wa - 1 && Te("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), wa = h;
      }
      function eo(h, C, z) {
        {
          var j = ee.current;
          if (j !== null)
            try {
              Cl(j), qf(function() {
                j.length === 0 ? (ee.current = null, C(h)) : eo(h, C, z);
              });
            } catch (X) {
              z(X);
            }
          else
            C(h);
        }
      }
      var to = !1;
      function Cl(h) {
        if (!to) {
          to = !0;
          var C = 0;
          try {
            for (; C < h.length; C++) {
              var z = h[C];
              do
                z = z(!0);
              while (z !== null);
            }
            h.length = 0;
          } catch (j) {
            throw h = h.slice(C + 1), j;
          } finally {
            to = !1;
          }
        }
      }
      var uu = Lr, no = Wo, ro = iu, ei = {
        map: Hi,
        forEach: eu,
        count: Zl,
        toArray: pl,
        only: vl
      };
      I.Children = ei, I.Component = je, I.Fragment = gt, I.Profiler = Dt, I.PureComponent = ft, I.StrictMode = S, I.Suspense = Z, I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Lt, I.act = gi, I.cloneElement = no, I.createContext = tu, I.createElement = uu, I.createFactory = ro, I.createRef = On, I.forwardRef = vi, I.isValidElement = vn, I.lazy = pi, I.memo = le, I.startTransition = Go, I.unstable_act = gi, I.useCallback = ar, I.useContext = Ke, I.useDebugValue = Xe, I.useDeferredValue = Ka, I.useEffect = Tn, I.useId = nu, I.useImperativeHandle = qa, I.useInsertionEffect = an, I.useLayoutEffect = sn, I.useMemo = Ga, I.useReducer = mt, I.useRef = dt, I.useState = Qe, I.useSyncExternalStore = ru, I.useTransition = et, I.version = N, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(tv, tv.exports)), tv.exports;
}
var ZR;
function nv() {
  return ZR || (ZR = 1, process.env.NODE_ENV === "production" ? qm.exports = tk() : qm.exports = nk()), qm.exports;
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
var eT;
function rk() {
  if (eT) return Zp;
  eT = 1;
  var Q = nv(), I = Symbol.for("react.element"), N = Symbol.for("react.fragment"), wt = Object.prototype.hasOwnProperty, tt = Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, gt = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(Dt, ce, pe) {
    var Pe, Z = {}, ye = null, re = null;
    pe !== void 0 && (ye = "" + pe), ce.key !== void 0 && (ye = "" + ce.key), ce.ref !== void 0 && (re = ce.ref);
    for (Pe in ce) wt.call(ce, Pe) && !gt.hasOwnProperty(Pe) && (Z[Pe] = ce[Pe]);
    if (Dt && Dt.defaultProps) for (Pe in ce = Dt.defaultProps, ce) Z[Pe] === void 0 && (Z[Pe] = ce[Pe]);
    return { $$typeof: I, type: Dt, key: ye, ref: re, props: Z, _owner: tt.current };
  }
  return Zp.Fragment = N, Zp.jsx = S, Zp.jsxs = S, Zp;
}
var ev = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var tT;
function ak() {
  return tT || (tT = 1, process.env.NODE_ENV !== "production" && (function() {
    var Q = nv(), I = Symbol.for("react.element"), N = Symbol.for("react.portal"), wt = Symbol.for("react.fragment"), tt = Symbol.for("react.strict_mode"), gt = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), Dt = Symbol.for("react.context"), ce = Symbol.for("react.forward_ref"), pe = Symbol.for("react.suspense"), Pe = Symbol.for("react.suspense_list"), Z = Symbol.for("react.memo"), ye = Symbol.for("react.lazy"), re = Symbol.for("react.offscreen"), Fe = Symbol.iterator, nt = "@@iterator";
    function rt(R) {
      if (R === null || typeof R != "object")
        return null;
      var B = Fe && R[Fe] || R[nt];
      return typeof B == "function" ? B : null;
    }
    var tn = Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ot(R) {
      {
        for (var B = arguments.length, le = new Array(B > 1 ? B - 1 : 0), me = 1; me < B; me++)
          le[me - 1] = arguments[me];
        Ye("error", R, le);
      }
    }
    function Ye(R, B, le) {
      {
        var me = tn.ReactDebugCurrentFrame, Ke = me.getStackAddendum();
        Ke !== "" && (B += "%s", le = le.concat([Ke]));
        var Qe = le.map(function(mt) {
          return String(mt);
        });
        Qe.unshift("Warning: " + B), Function.prototype.apply.call(console[R], console, Qe);
      }
    }
    var vt = !1, ee = !1, Ae = !1, ge = !1, Ot = !1, St;
    St = Symbol.for("react.module.reference");
    function st(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === wt || R === gt || Ot || R === tt || R === pe || R === Pe || ge || R === re || vt || ee || Ae || typeof R == "object" && R !== null && (R.$$typeof === ye || R.$$typeof === Z || R.$$typeof === S || R.$$typeof === Dt || R.$$typeof === ce || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === St || R.getModuleId !== void 0));
    }
    function ht(R, B, le) {
      var me = R.displayName;
      if (me)
        return me;
      var Ke = B.displayName || B.name || "";
      return Ke !== "" ? le + "(" + Ke + ")" : le;
    }
    function Ge(R) {
      return R.displayName || "Context";
    }
    function _e(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && ot("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case wt:
          return "Fragment";
        case N:
          return "Portal";
        case gt:
          return "Profiler";
        case tt:
          return "StrictMode";
        case pe:
          return "Suspense";
        case Pe:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case Dt:
            var B = R;
            return Ge(B) + ".Consumer";
          case S:
            var le = R;
            return Ge(le._context) + ".Provider";
          case ce:
            return ht(R, R.render, "ForwardRef");
          case Z:
            var me = R.displayName || null;
            return me !== null ? me : _e(R.type) || "Memo";
          case ye: {
            var Ke = R, Qe = Ke._payload, mt = Ke._init;
            try {
              return _e(mt(Qe));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Pt = Object.assign, Lt = 0, Nt, Te, J, xe, ae, _, P;
    function Ve() {
    }
    Ve.__reactDisabledLog = !0;
    function je() {
      {
        if (Lt === 0) {
          Nt = console.log, Te = console.info, J = console.warn, xe = console.error, ae = console.group, _ = console.groupCollapsed, P = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: Ve,
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
        Lt++;
      }
    }
    function ct() {
      {
        if (Lt--, Lt === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Pt({}, R, {
              value: Nt
            }),
            info: Pt({}, R, {
              value: Te
            }),
            warn: Pt({}, R, {
              value: J
            }),
            error: Pt({}, R, {
              value: xe
            }),
            group: Pt({}, R, {
              value: ae
            }),
            groupCollapsed: Pt({}, R, {
              value: _
            }),
            groupEnd: Pt({}, R, {
              value: P
            })
          });
        }
        Lt < 0 && ot("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var at = tn.ReactCurrentDispatcher, Ze;
    function it(R, B, le) {
      {
        if (Ze === void 0)
          try {
            throw Error();
          } catch (Ke) {
            var me = Ke.stack.trim().match(/\n( *(at )?)/);
            Ze = me && me[1] || "";
          }
        return `
` + Ze + R;
      }
    }
    var ft = !1, Yt;
    {
      var On = typeof WeakMap == "function" ? WeakMap : Map;
      Yt = new On();
    }
    function wr(R, B) {
      if (!R || ft)
        return "";
      {
        var le = Yt.get(R);
        if (le !== void 0)
          return le;
      }
      var me;
      ft = !0;
      var Ke = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Qe;
      Qe = at.current, at.current = null, je();
      try {
        if (B) {
          var mt = function() {
            throw Error();
          };
          if (Object.defineProperty(mt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(mt, []);
            } catch (Xe) {
              me = Xe;
            }
            Reflect.construct(R, [], mt);
          } else {
            try {
              mt.call();
            } catch (Xe) {
              me = Xe;
            }
            R.call(mt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Xe) {
            me = Xe;
          }
          R();
        }
      } catch (Xe) {
        if (Xe && me && typeof Xe.stack == "string") {
          for (var dt = Xe.stack.split(`
`), Tn = me.stack.split(`
`), an = dt.length - 1, sn = Tn.length - 1; an >= 1 && sn >= 0 && dt[an] !== Tn[sn]; )
            sn--;
          for (; an >= 1 && sn >= 0; an--, sn--)
            if (dt[an] !== Tn[sn]) {
              if (an !== 1 || sn !== 1)
                do
                  if (an--, sn--, sn < 0 || dt[an] !== Tn[sn]) {
                    var ar = `
` + dt[an].replace(" at new ", " at ");
                    return R.displayName && ar.includes("<anonymous>") && (ar = ar.replace("<anonymous>", R.displayName)), typeof R == "function" && Yt.set(R, ar), ar;
                  }
                while (an >= 1 && sn >= 0);
              break;
            }
        }
      } finally {
        ft = !1, at.current = Qe, ct(), Error.prepareStackTrace = Ke;
      }
      var Ga = R ? R.displayName || R.name : "", qa = Ga ? it(Ga) : "";
      return typeof R == "function" && Yt.set(R, qa), qa;
    }
    function Cn(R, B, le) {
      return wr(R, !1);
    }
    function nr(R) {
      var B = R.prototype;
      return !!(B && B.isReactComponent);
    }
    function Vn(R, B, le) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return wr(R, nr(R));
      if (typeof R == "string")
        return it(R);
      switch (R) {
        case pe:
          return it("Suspense");
        case Pe:
          return it("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case ce:
            return Cn(R.render);
          case Z:
            return Vn(R.type, B, le);
          case ye: {
            var me = R, Ke = me._payload, Qe = me._init;
            try {
              return Vn(Qe(Ke), B, le);
            } catch {
            }
          }
        }
      return "";
    }
    var Bn = Object.prototype.hasOwnProperty, $r = {}, ci = tn.ReactDebugCurrentFrame;
    function sa(R) {
      if (R) {
        var B = R._owner, le = Vn(R.type, R._source, B ? B.type : null);
        ci.setExtraStackFrame(le);
      } else
        ci.setExtraStackFrame(null);
    }
    function qn(R, B, le, me, Ke) {
      {
        var Qe = Function.call.bind(Bn);
        for (var mt in R)
          if (Qe(R, mt)) {
            var dt = void 0;
            try {
              if (typeof R[mt] != "function") {
                var Tn = Error((me || "React class") + ": " + le + " type `" + mt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[mt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Tn.name = "Invariant Violation", Tn;
              }
              dt = R[mt](B, mt, me, le, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (an) {
              dt = an;
            }
            dt && !(dt instanceof Error) && (sa(Ke), ot("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", me || "React class", le, mt, typeof dt), sa(null)), dt instanceof Error && !(dt.message in $r) && ($r[dt.message] = !0, sa(Ke), ot("Failed %s type: %s", le, dt.message), sa(null));
          }
      }
    }
    var Rn = Array.isArray;
    function In(R) {
      return Rn(R);
    }
    function gr(R) {
      {
        var B = typeof Symbol == "function" && Symbol.toStringTag, le = B && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return le;
      }
    }
    function $a(R) {
      try {
        return Ln(R), !1;
      } catch {
        return !0;
      }
    }
    function Ln(R) {
      return "" + R;
    }
    function Sr(R) {
      if ($a(R))
        return ot("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", gr(R)), Ln(R);
    }
    var ca = tn.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, te;
    function be(R) {
      if (Bn.call(R, "ref")) {
        var B = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (B && B.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function lt(R) {
      if (Bn.call(R, "key")) {
        var B = Object.getOwnPropertyDescriptor(R, "key").get;
        if (B && B.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Vt(R, B) {
      typeof R.ref == "string" && ca.current;
    }
    function nn(R, B) {
      {
        var le = function() {
          fi || (fi = !0, ot("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", B));
        };
        le.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: le,
          configurable: !0
        });
      }
    }
    function vn(R, B) {
      {
        var le = function() {
          te || (te = !0, ot("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", B));
        };
        le.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: le,
          configurable: !0
        });
      }
    }
    var on = function(R, B, le, me, Ke, Qe, mt) {
      var dt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: I,
        // Built-in properties that belong on the element
        type: R,
        key: B,
        ref: le,
        props: mt,
        // Record the component responsible for creating this element.
        _owner: Qe
      };
      return dt._store = {}, Object.defineProperty(dt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(dt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: me
      }), Object.defineProperty(dt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ke
      }), Object.freeze && (Object.freeze(dt.props), Object.freeze(dt)), dt;
    };
    function Kn(R, B, le, me, Ke) {
      {
        var Qe, mt = {}, dt = null, Tn = null;
        le !== void 0 && (Sr(le), dt = "" + le), lt(B) && (Sr(B.key), dt = "" + B.key), be(B) && (Tn = B.ref, Vt(B, Ke));
        for (Qe in B)
          Bn.call(B, Qe) && !Qa.hasOwnProperty(Qe) && (mt[Qe] = B[Qe]);
        if (R && R.defaultProps) {
          var an = R.defaultProps;
          for (Qe in an)
            mt[Qe] === void 0 && (mt[Qe] = an[Qe]);
        }
        if (dt || Tn) {
          var sn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          dt && nn(mt, sn), Tn && vn(mt, sn);
        }
        return on(R, dt, Tn, Ke, me, ca.current, mt);
      }
    }
    var rn = tn.ReactCurrentOwner, Qt = tn.ReactDebugCurrentFrame;
    function Wt(R) {
      if (R) {
        var B = R._owner, le = Vn(R.type, R._source, B ? B.type : null);
        Qt.setExtraStackFrame(le);
      } else
        Qt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function Er(R) {
      return typeof R == "object" && R !== null && R.$$typeof === I;
    }
    function xa() {
      {
        if (rn.current) {
          var R = _e(rn.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Hi(R) {
      return "";
    }
    var Zl = {};
    function eu(R) {
      {
        var B = xa();
        if (!B) {
          var le = typeof R == "string" ? R : R.displayName || R.name;
          le && (B = `

Check the top-level render call using <` + le + ">.");
        }
        return B;
      }
    }
    function pl(R, B) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var le = eu(B);
        if (Zl[le])
          return;
        Zl[le] = !0;
        var me = "";
        R && R._owner && R._owner !== rn.current && (me = " It was passed a child from " + _e(R._owner.type) + "."), Wt(R), ot('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', le, me), Wt(null);
      }
    }
    function vl(R, B) {
      {
        if (typeof R != "object")
          return;
        if (In(R))
          for (var le = 0; le < R.length; le++) {
            var me = R[le];
            Er(me) && pl(me, B);
          }
        else if (Er(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var Ke = rt(R);
          if (typeof Ke == "function" && Ke !== R.entries)
            for (var Qe = Ke.call(R), mt; !(mt = Qe.next()).done; )
              Er(mt.value) && pl(mt.value, B);
        }
      }
    }
    function tu(R) {
      {
        var B = R.type;
        if (B == null || typeof B == "string")
          return;
        var le;
        if (typeof B == "function")
          le = B.propTypes;
        else if (typeof B == "object" && (B.$$typeof === ce || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        B.$$typeof === Z))
          le = B.propTypes;
        else
          return;
        if (le) {
          var me = _e(B);
          qn(le, R.props, "prop", me, R);
        } else if (B.PropTypes !== void 0 && !fa) {
          fa = !0;
          var Ke = _e(B);
          ot("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Ke || "Unknown");
        }
        typeof B.getDefaultProps == "function" && !B.getDefaultProps.isReactClassApproved && ot("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(R) {
      {
        for (var B = Object.keys(R.props), le = 0; le < B.length; le++) {
          var me = B[le];
          if (me !== "children" && me !== "key") {
            Wt(R), ot("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", me), Wt(null);
            break;
          }
        }
        R.ref !== null && (Wt(R), ot("Invalid attribute `ref` supplied to `React.Fragment`."), Wt(null));
      }
    }
    var kr = {};
    function rr(R, B, le, me, Ke, Qe) {
      {
        var mt = st(R);
        if (!mt) {
          var dt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (dt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Tn = Hi();
          Tn ? dt += Tn : dt += xa();
          var an;
          R === null ? an = "null" : In(R) ? an = "array" : R !== void 0 && R.$$typeof === I ? (an = "<" + (_e(R.type) || "Unknown") + " />", dt = " Did you accidentally export a JSX literal instead of a component?") : an = typeof R, ot("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", an, dt);
        }
        var sn = Kn(R, B, le, Ke, Qe);
        if (sn == null)
          return sn;
        if (mt) {
          var ar = B.children;
          if (ar !== void 0)
            if (me)
              if (In(ar)) {
                for (var Ga = 0; Ga < ar.length; Ga++)
                  vl(ar[Ga], R);
                Object.freeze && Object.freeze(ar);
              } else
                ot("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ar, R);
        }
        if (Bn.call(B, "key")) {
          var qa = _e(R), Xe = Object.keys(B).filter(function(nu) {
            return nu !== "key";
          }), et = Xe.length > 0 ? "{key: someKey, " + Xe.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!kr[qa + et]) {
            var Ka = Xe.length > 0 ? "{" + Xe.join(": ..., ") + ": ...}" : "{}";
            ot(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, et, qa, Ka, qa), kr[qa + et] = !0;
          }
        }
        return R === wt ? _r(sn) : tu(sn), sn;
      }
    }
    function di(R, B, le) {
      return rr(R, B, le, !0);
    }
    function Wa(R, B, le) {
      return rr(R, B, le, !1);
    }
    var pi = Wa, vi = di;
    ev.Fragment = wt, ev.jsx = pi, ev.jsxs = vi;
  })()), ev;
}
var nT;
function ik() {
  return nT || (nT = 1, process.env.NODE_ENV === "production" ? Gm.exports = rk() : Gm.exports = ak()), Gm.exports;
}
var $t = ik(), Wf = {}, Km = { exports: {} }, Ia = {}, Xm = { exports: {} }, vE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rT;
function lk() {
  return rT || (rT = 1, (function(Q) {
    function I(J, xe) {
      var ae = J.length;
      J.push(xe);
      e: for (; 0 < ae; ) {
        var _ = ae - 1 >>> 1, P = J[_];
        if (0 < tt(P, xe)) J[_] = xe, J[ae] = P, ae = _;
        else break e;
      }
    }
    function N(J) {
      return J.length === 0 ? null : J[0];
    }
    function wt(J) {
      if (J.length === 0) return null;
      var xe = J[0], ae = J.pop();
      if (ae !== xe) {
        J[0] = ae;
        e: for (var _ = 0, P = J.length, Ve = P >>> 1; _ < Ve; ) {
          var je = 2 * (_ + 1) - 1, ct = J[je], at = je + 1, Ze = J[at];
          if (0 > tt(ct, ae)) at < P && 0 > tt(Ze, ct) ? (J[_] = Ze, J[at] = ae, _ = at) : (J[_] = ct, J[je] = ae, _ = je);
          else if (at < P && 0 > tt(Ze, ae)) J[_] = Ze, J[at] = ae, _ = at;
          else break e;
        }
      }
      return xe;
    }
    function tt(J, xe) {
      var ae = J.sortIndex - xe.sortIndex;
      return ae !== 0 ? ae : J.id - xe.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var gt = performance;
      Q.unstable_now = function() {
        return gt.now();
      };
    } else {
      var S = Date, Dt = S.now();
      Q.unstable_now = function() {
        return S.now() - Dt;
      };
    }
    var ce = [], pe = [], Pe = 1, Z = null, ye = 3, re = !1, Fe = !1, nt = !1, rt = typeof setTimeout == "function" ? setTimeout : null, tn = typeof clearTimeout == "function" ? clearTimeout : null, ot = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ye(J) {
      for (var xe = N(pe); xe !== null; ) {
        if (xe.callback === null) wt(pe);
        else if (xe.startTime <= J) wt(pe), xe.sortIndex = xe.expirationTime, I(ce, xe);
        else break;
        xe = N(pe);
      }
    }
    function vt(J) {
      if (nt = !1, Ye(J), !Fe) if (N(ce) !== null) Fe = !0, Nt(ee);
      else {
        var xe = N(pe);
        xe !== null && Te(vt, xe.startTime - J);
      }
    }
    function ee(J, xe) {
      Fe = !1, nt && (nt = !1, tn(Ot), Ot = -1), re = !0;
      var ae = ye;
      try {
        for (Ye(xe), Z = N(ce); Z !== null && (!(Z.expirationTime > xe) || J && !ht()); ) {
          var _ = Z.callback;
          if (typeof _ == "function") {
            Z.callback = null, ye = Z.priorityLevel;
            var P = _(Z.expirationTime <= xe);
            xe = Q.unstable_now(), typeof P == "function" ? Z.callback = P : Z === N(ce) && wt(ce), Ye(xe);
          } else wt(ce);
          Z = N(ce);
        }
        if (Z !== null) var Ve = !0;
        else {
          var je = N(pe);
          je !== null && Te(vt, je.startTime - xe), Ve = !1;
        }
        return Ve;
      } finally {
        Z = null, ye = ae, re = !1;
      }
    }
    var Ae = !1, ge = null, Ot = -1, St = 5, st = -1;
    function ht() {
      return !(Q.unstable_now() - st < St);
    }
    function Ge() {
      if (ge !== null) {
        var J = Q.unstable_now();
        st = J;
        var xe = !0;
        try {
          xe = ge(!0, J);
        } finally {
          xe ? _e() : (Ae = !1, ge = null);
        }
      } else Ae = !1;
    }
    var _e;
    if (typeof ot == "function") _e = function() {
      ot(Ge);
    };
    else if (typeof MessageChannel < "u") {
      var Pt = new MessageChannel(), Lt = Pt.port2;
      Pt.port1.onmessage = Ge, _e = function() {
        Lt.postMessage(null);
      };
    } else _e = function() {
      rt(Ge, 0);
    };
    function Nt(J) {
      ge = J, Ae || (Ae = !0, _e());
    }
    function Te(J, xe) {
      Ot = rt(function() {
        J(Q.unstable_now());
      }, xe);
    }
    Q.unstable_IdlePriority = 5, Q.unstable_ImmediatePriority = 1, Q.unstable_LowPriority = 4, Q.unstable_NormalPriority = 3, Q.unstable_Profiling = null, Q.unstable_UserBlockingPriority = 2, Q.unstable_cancelCallback = function(J) {
      J.callback = null;
    }, Q.unstable_continueExecution = function() {
      Fe || re || (Fe = !0, Nt(ee));
    }, Q.unstable_forceFrameRate = function(J) {
      0 > J || 125 < J ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : St = 0 < J ? Math.floor(1e3 / J) : 5;
    }, Q.unstable_getCurrentPriorityLevel = function() {
      return ye;
    }, Q.unstable_getFirstCallbackNode = function() {
      return N(ce);
    }, Q.unstable_next = function(J) {
      switch (ye) {
        case 1:
        case 2:
        case 3:
          var xe = 3;
          break;
        default:
          xe = ye;
      }
      var ae = ye;
      ye = xe;
      try {
        return J();
      } finally {
        ye = ae;
      }
    }, Q.unstable_pauseExecution = function() {
    }, Q.unstable_requestPaint = function() {
    }, Q.unstable_runWithPriority = function(J, xe) {
      switch (J) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          J = 3;
      }
      var ae = ye;
      ye = J;
      try {
        return xe();
      } finally {
        ye = ae;
      }
    }, Q.unstable_scheduleCallback = function(J, xe, ae) {
      var _ = Q.unstable_now();
      switch (typeof ae == "object" && ae !== null ? (ae = ae.delay, ae = typeof ae == "number" && 0 < ae ? _ + ae : _) : ae = _, J) {
        case 1:
          var P = -1;
          break;
        case 2:
          P = 250;
          break;
        case 5:
          P = 1073741823;
          break;
        case 4:
          P = 1e4;
          break;
        default:
          P = 5e3;
      }
      return P = ae + P, J = { id: Pe++, callback: xe, priorityLevel: J, startTime: ae, expirationTime: P, sortIndex: -1 }, ae > _ ? (J.sortIndex = ae, I(pe, J), N(ce) === null && J === N(pe) && (nt ? (tn(Ot), Ot = -1) : nt = !0, Te(vt, ae - _))) : (J.sortIndex = P, I(ce, J), Fe || re || (Fe = !0, Nt(ee))), J;
    }, Q.unstable_shouldYield = ht, Q.unstable_wrapCallback = function(J) {
      var xe = ye;
      return function() {
        var ae = ye;
        ye = xe;
        try {
          return J.apply(this, arguments);
        } finally {
          ye = ae;
        }
      };
    };
  })(vE)), vE;
}
var hE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aT;
function uk() {
  return aT || (aT = 1, (function(Q) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var I = !1, N = 5;
      function wt(te, be) {
        var lt = te.length;
        te.push(be), S(te, be, lt);
      }
      function tt(te) {
        return te.length === 0 ? null : te[0];
      }
      function gt(te) {
        if (te.length === 0)
          return null;
        var be = te[0], lt = te.pop();
        return lt !== be && (te[0] = lt, Dt(te, lt, 0)), be;
      }
      function S(te, be, lt) {
        for (var Vt = lt; Vt > 0; ) {
          var nn = Vt - 1 >>> 1, vn = te[nn];
          if (ce(vn, be) > 0)
            te[nn] = be, te[Vt] = vn, Vt = nn;
          else
            return;
        }
      }
      function Dt(te, be, lt) {
        for (var Vt = lt, nn = te.length, vn = nn >>> 1; Vt < vn; ) {
          var on = (Vt + 1) * 2 - 1, Kn = te[on], rn = on + 1, Qt = te[rn];
          if (ce(Kn, be) < 0)
            rn < nn && ce(Qt, Kn) < 0 ? (te[Vt] = Qt, te[rn] = be, Vt = rn) : (te[Vt] = Kn, te[on] = be, Vt = on);
          else if (rn < nn && ce(Qt, be) < 0)
            te[Vt] = Qt, te[rn] = be, Vt = rn;
          else
            return;
        }
      }
      function ce(te, be) {
        var lt = te.sortIndex - be.sortIndex;
        return lt !== 0 ? lt : te.id - be.id;
      }
      var pe = 1, Pe = 2, Z = 3, ye = 4, re = 5;
      function Fe(te, be) {
      }
      var nt = typeof performance == "object" && typeof performance.now == "function";
      if (nt) {
        var rt = performance;
        Q.unstable_now = function() {
          return rt.now();
        };
      } else {
        var tn = Date, ot = tn.now();
        Q.unstable_now = function() {
          return tn.now() - ot;
        };
      }
      var Ye = 1073741823, vt = -1, ee = 250, Ae = 5e3, ge = 1e4, Ot = Ye, St = [], st = [], ht = 1, Ge = null, _e = Z, Pt = !1, Lt = !1, Nt = !1, Te = typeof setTimeout == "function" ? setTimeout : null, J = typeof clearTimeout == "function" ? clearTimeout : null, xe = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ae(te) {
        for (var be = tt(st); be !== null; ) {
          if (be.callback === null)
            gt(st);
          else if (be.startTime <= te)
            gt(st), be.sortIndex = be.expirationTime, wt(St, be);
          else
            return;
          be = tt(st);
        }
      }
      function _(te) {
        if (Nt = !1, ae(te), !Lt)
          if (tt(St) !== null)
            Lt = !0, Ln(P);
          else {
            var be = tt(st);
            be !== null && Sr(_, be.startTime - te);
          }
      }
      function P(te, be) {
        Lt = !1, Nt && (Nt = !1, ca()), Pt = !0;
        var lt = _e;
        try {
          var Vt;
          if (!I) return Ve(te, be);
        } finally {
          Ge = null, _e = lt, Pt = !1;
        }
      }
      function Ve(te, be) {
        var lt = be;
        for (ae(lt), Ge = tt(St); Ge !== null && !(Ge.expirationTime > lt && (!te || ci())); ) {
          var Vt = Ge.callback;
          if (typeof Vt == "function") {
            Ge.callback = null, _e = Ge.priorityLevel;
            var nn = Ge.expirationTime <= lt, vn = Vt(nn);
            lt = Q.unstable_now(), typeof vn == "function" ? Ge.callback = vn : Ge === tt(St) && gt(St), ae(lt);
          } else
            gt(St);
          Ge = tt(St);
        }
        if (Ge !== null)
          return !0;
        var on = tt(st);
        return on !== null && Sr(_, on.startTime - lt), !1;
      }
      function je(te, be) {
        switch (te) {
          case pe:
          case Pe:
          case Z:
          case ye:
          case re:
            break;
          default:
            te = Z;
        }
        var lt = _e;
        _e = te;
        try {
          return be();
        } finally {
          _e = lt;
        }
      }
      function ct(te) {
        var be;
        switch (_e) {
          case pe:
          case Pe:
          case Z:
            be = Z;
            break;
          default:
            be = _e;
            break;
        }
        var lt = _e;
        _e = be;
        try {
          return te();
        } finally {
          _e = lt;
        }
      }
      function at(te) {
        var be = _e;
        return function() {
          var lt = _e;
          _e = be;
          try {
            return te.apply(this, arguments);
          } finally {
            _e = lt;
          }
        };
      }
      function Ze(te, be, lt) {
        var Vt = Q.unstable_now(), nn;
        if (typeof lt == "object" && lt !== null) {
          var vn = lt.delay;
          typeof vn == "number" && vn > 0 ? nn = Vt + vn : nn = Vt;
        } else
          nn = Vt;
        var on;
        switch (te) {
          case pe:
            on = vt;
            break;
          case Pe:
            on = ee;
            break;
          case re:
            on = Ot;
            break;
          case ye:
            on = ge;
            break;
          case Z:
          default:
            on = Ae;
            break;
        }
        var Kn = nn + on, rn = {
          id: ht++,
          callback: be,
          priorityLevel: te,
          startTime: nn,
          expirationTime: Kn,
          sortIndex: -1
        };
        return nn > Vt ? (rn.sortIndex = nn, wt(st, rn), tt(St) === null && rn === tt(st) && (Nt ? ca() : Nt = !0, Sr(_, nn - Vt))) : (rn.sortIndex = Kn, wt(St, rn), !Lt && !Pt && (Lt = !0, Ln(P))), rn;
      }
      function it() {
      }
      function ft() {
        !Lt && !Pt && (Lt = !0, Ln(P));
      }
      function Yt() {
        return tt(St);
      }
      function On(te) {
        te.callback = null;
      }
      function wr() {
        return _e;
      }
      var Cn = !1, nr = null, Vn = -1, Bn = N, $r = -1;
      function ci() {
        var te = Q.unstable_now() - $r;
        return !(te < Bn);
      }
      function sa() {
      }
      function qn(te) {
        if (te < 0 || te > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        te > 0 ? Bn = Math.floor(1e3 / te) : Bn = N;
      }
      var Rn = function() {
        if (nr !== null) {
          var te = Q.unstable_now();
          $r = te;
          var be = !0, lt = !0;
          try {
            lt = nr(be, te);
          } finally {
            lt ? In() : (Cn = !1, nr = null);
          }
        } else
          Cn = !1;
      }, In;
      if (typeof xe == "function")
        In = function() {
          xe(Rn);
        };
      else if (typeof MessageChannel < "u") {
        var gr = new MessageChannel(), $a = gr.port2;
        gr.port1.onmessage = Rn, In = function() {
          $a.postMessage(null);
        };
      } else
        In = function() {
          Te(Rn, 0);
        };
      function Ln(te) {
        nr = te, Cn || (Cn = !0, In());
      }
      function Sr(te, be) {
        Vn = Te(function() {
          te(Q.unstable_now());
        }, be);
      }
      function ca() {
        J(Vn), Vn = -1;
      }
      var Qa = sa, fi = null;
      Q.unstable_IdlePriority = re, Q.unstable_ImmediatePriority = pe, Q.unstable_LowPriority = ye, Q.unstable_NormalPriority = Z, Q.unstable_Profiling = fi, Q.unstable_UserBlockingPriority = Pe, Q.unstable_cancelCallback = On, Q.unstable_continueExecution = ft, Q.unstable_forceFrameRate = qn, Q.unstable_getCurrentPriorityLevel = wr, Q.unstable_getFirstCallbackNode = Yt, Q.unstable_next = ct, Q.unstable_pauseExecution = it, Q.unstable_requestPaint = Qa, Q.unstable_runWithPriority = je, Q.unstable_scheduleCallback = Ze, Q.unstable_shouldYield = ci, Q.unstable_wrapCallback = at, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(hE)), hE;
}
var iT;
function fT() {
  return iT || (iT = 1, process.env.NODE_ENV === "production" ? Xm.exports = lk() : Xm.exports = uk()), Xm.exports;
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
var lT;
function ok() {
  if (lT) return Ia;
  lT = 1;
  var Q = nv(), I = fT();
  function N(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var wt = /* @__PURE__ */ new Set(), tt = {};
  function gt(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (tt[n] = r, n = 0; n < r.length; n++) wt.add(r[n]);
  }
  var Dt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ce = Object.prototype.hasOwnProperty, pe = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Pe = {}, Z = {};
  function ye(n) {
    return ce.call(Z, n) ? !0 : ce.call(Pe, n) ? !1 : pe.test(n) ? Z[n] = !0 : (Pe[n] = !0, !1);
  }
  function re(n, r, l, o) {
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
  function Fe(n, r, l, o) {
    if (r === null || typeof r > "u" || re(n, r, l, o)) return !0;
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
  function nt(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var rt = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    rt[n] = new nt(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    rt[r] = new nt(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    rt[n] = new nt(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    rt[n] = new nt(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    rt[n] = new nt(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    rt[n] = new nt(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    rt[n] = new nt(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    rt[n] = new nt(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    rt[n] = new nt(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var tn = /[\-:]([a-z])/g;
  function ot(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      tn,
      ot
    );
    rt[r] = new nt(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(tn, ot);
    rt[r] = new nt(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(tn, ot);
    rt[r] = new nt(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    rt[n] = new nt(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), rt.xlinkHref = new nt("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    rt[n] = new nt(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Ye(n, r, l, o) {
    var c = rt.hasOwnProperty(r) ? rt[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (Fe(r, l, c, o) && (l = null), o || c === null ? ye(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var vt = Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ee = Symbol.for("react.element"), Ae = Symbol.for("react.portal"), ge = Symbol.for("react.fragment"), Ot = Symbol.for("react.strict_mode"), St = Symbol.for("react.profiler"), st = Symbol.for("react.provider"), ht = Symbol.for("react.context"), Ge = Symbol.for("react.forward_ref"), _e = Symbol.for("react.suspense"), Pt = Symbol.for("react.suspense_list"), Lt = Symbol.for("react.memo"), Nt = Symbol.for("react.lazy"), Te = Symbol.for("react.offscreen"), J = Symbol.iterator;
  function xe(n) {
    return n === null || typeof n != "object" ? null : (n = J && n[J] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ae = Object.assign, _;
  function P(n) {
    if (_ === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      _ = r && r[1] || "";
    }
    return `
` + _ + n;
  }
  var Ve = !1;
  function je(n, r) {
    if (!n || Ve) return "";
    Ve = !0;
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
        } catch (U) {
          var o = U;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (U) {
          o = U;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (U) {
          o = U;
        }
        n();
      }
    } catch (U) {
      if (U && o && typeof U.stack == "string") {
        for (var c = U.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, E = d.length - 1; 1 <= m && 0 <= E && c[m] !== d[E]; ) E--;
        for (; 1 <= m && 0 <= E; m--, E--) if (c[m] !== d[E]) {
          if (m !== 1 || E !== 1)
            do
              if (m--, E--, 0 > E || c[m] !== d[E]) {
                var T = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", n.displayName)), T;
              }
            while (1 <= m && 0 <= E);
          break;
        }
      }
    } finally {
      Ve = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? P(n) : "";
  }
  function ct(n) {
    switch (n.tag) {
      case 5:
        return P(n.type);
      case 16:
        return P("Lazy");
      case 13:
        return P("Suspense");
      case 19:
        return P("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = je(n.type, !1), n;
      case 11:
        return n = je(n.type.render, !1), n;
      case 1:
        return n = je(n.type, !0), n;
      default:
        return "";
    }
  }
  function at(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case ge:
        return "Fragment";
      case Ae:
        return "Portal";
      case St:
        return "Profiler";
      case Ot:
        return "StrictMode";
      case _e:
        return "Suspense";
      case Pt:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case ht:
        return (n.displayName || "Context") + ".Consumer";
      case st:
        return (n._context.displayName || "Context") + ".Provider";
      case Ge:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Lt:
        return r = n.displayName || null, r !== null ? r : at(n.type) || "Memo";
      case Nt:
        r = n._payload, n = n._init;
        try {
          return at(n(r));
        } catch {
        }
    }
    return null;
  }
  function Ze(n) {
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
        return at(r);
      case 8:
        return r === Ot ? "StrictMode" : "Mode";
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
  function it(n) {
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
  function ft(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Yt(n) {
    var r = ft(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
  function On(n) {
    n._valueTracker || (n._valueTracker = Yt(n));
  }
  function wr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = ft(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function Cn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function nr(n, r) {
    var l = r.checked;
    return ae({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Vn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = it(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Bn(n, r) {
    r = r.checked, r != null && Ye(n, "checked", r, !1);
  }
  function $r(n, r) {
    Bn(n, r);
    var l = it(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, it(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function ci(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function sa(n, r, l) {
    (r !== "number" || Cn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var qn = Array.isArray;
  function Rn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + it(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function In(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(N(91));
    return ae({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function gr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(N(92));
        if (qn(l)) {
          if (1 < l.length) throw Error(N(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: it(l) };
  }
  function $a(n, r) {
    var l = it(r.value), o = it(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Ln(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Sr(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function ca(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Sr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var Qa, fi = (function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  })(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (Qa = Qa || document.createElement("div"), Qa.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = Qa.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function te(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var be = {
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
  }, lt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(be).forEach(function(n) {
    lt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), be[r] = be[n];
    });
  });
  function Vt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || be.hasOwnProperty(n) && be[n] ? ("" + r).trim() : r + "px";
  }
  function nn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Vt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var vn = ae({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function on(n, r) {
    if (r) {
      if (vn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(N(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(N(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(N(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(N(62));
    }
  }
  function Kn(n, r) {
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
  var Wt = null, fa = null, Er = null;
  function xa(n) {
    if (n = De(n)) {
      if (typeof Wt != "function") throw Error(N(280));
      var r = n.stateNode;
      r && (r = mn(r), Wt(n.stateNode, n.type, r));
    }
  }
  function Hi(n) {
    fa ? Er ? Er.push(n) : Er = [n] : fa = n;
  }
  function Zl() {
    if (fa) {
      var n = fa, r = Er;
      if (Er = fa = null, xa(n), r) for (n = 0; n < r.length; n++) xa(r[n]);
    }
  }
  function eu(n, r) {
    return n(r);
  }
  function pl() {
  }
  var vl = !1;
  function tu(n, r, l) {
    if (vl) return n(r, l);
    vl = !0;
    try {
      return eu(n, r, l);
    } finally {
      vl = !1, (fa !== null || Er !== null) && (pl(), Zl());
    }
  }
  function _r(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = mn(l);
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
    if (l && typeof l != "function") throw Error(N(231, r, typeof l));
    return l;
  }
  var kr = !1;
  if (Dt) try {
    var rr = {};
    Object.defineProperty(rr, "passive", { get: function() {
      kr = !0;
    } }), window.addEventListener("test", rr, rr), window.removeEventListener("test", rr, rr);
  } catch {
    kr = !1;
  }
  function di(n, r, l, o, c, d, m, E, T) {
    var U = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, U);
    } catch (W) {
      this.onError(W);
    }
  }
  var Wa = !1, pi = null, vi = !1, R = null, B = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function le(n, r, l, o, c, d, m, E, T) {
    Wa = !1, pi = null, di.apply(B, arguments);
  }
  function me(n, r, l, o, c, d, m, E, T) {
    if (le.apply(this, arguments), Wa) {
      if (Wa) {
        var U = pi;
        Wa = !1, pi = null;
      } else throw Error(N(198));
      vi || (vi = !0, R = U);
    }
  }
  function Ke(n) {
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
  function Qe(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function mt(n) {
    if (Ke(n) !== n) throw Error(N(188));
  }
  function dt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Ke(n), r === null) throw Error(N(188));
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
          if (d === l) return mt(c), n;
          if (d === o) return mt(c), r;
          d = d.sibling;
        }
        throw Error(N(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, E = c.child; E; ) {
          if (E === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (E === o) {
            m = !0, o = c, l = d;
            break;
          }
          E = E.sibling;
        }
        if (!m) {
          for (E = d.child; E; ) {
            if (E === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (E === o) {
              m = !0, o = d, l = c;
              break;
            }
            E = E.sibling;
          }
          if (!m) throw Error(N(189));
        }
      }
      if (l.alternate !== o) throw Error(N(190));
    }
    if (l.tag !== 3) throw Error(N(188));
    return l.stateNode.current === l ? n : r;
  }
  function Tn(n) {
    return n = dt(n), n !== null ? an(n) : null;
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
  var sn = I.unstable_scheduleCallback, ar = I.unstable_cancelCallback, Ga = I.unstable_shouldYield, qa = I.unstable_requestPaint, Xe = I.unstable_now, et = I.unstable_getCurrentPriorityLevel, Ka = I.unstable_ImmediatePriority, nu = I.unstable_UserBlockingPriority, ru = I.unstable_NormalPriority, hl = I.unstable_LowPriority, Wu = I.unstable_IdlePriority, ml = null, Qr = null;
  function $o(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function") try {
      Qr.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dr = Math.clz32 ? Math.clz32 : Gu, uc = Math.log, oc = Math.LN2;
  function Gu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (uc(n) / oc | 0) | 0;
  }
  var yl = 64, da = 4194304;
  function Xa(n) {
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
  function Ja(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var E = m & ~c;
      E !== 0 ? o = Xa(E) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && (r & c) === 0 && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if ((o & 4) !== 0 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - Dr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function qu(n, r) {
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
  function au(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - Dr(d), E = 1 << m, T = c[m];
      T === -1 ? ((E & l) === 0 || (E & o) !== 0) && (c[m] = qu(E, r)) : T <= r && (n.expiredLanes |= E), d &= ~E;
    }
  }
  function gl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Ku() {
    var n = yl;
    return yl <<= 1, (yl & 4194240) === 0 && (yl = 64), n;
  }
  function Xu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Pi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Dr(r), n[r] = l;
  }
  function Gf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Dr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - Dr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var zt = 0;
  function Ju(n) {
    return n &= -n, 1 < n ? 4 < n ? (n & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var _t, Qo, hi, $e, Zu, ir = !1, mi = [], Or = null, yi = null, cn = null, Gt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), Yn = [], Lr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ba(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Or = null;
        break;
      case "dragenter":
      case "dragleave":
        yi = null;
        break;
      case "mouseover":
      case "mouseout":
        cn = null;
        break;
      case "pointerover":
      case "pointerout":
        Gt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sl.delete(r.pointerId);
    }
  }
  function iu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = De(r), r !== null && Qo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Wo(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Or = iu(Or, n, r, l, o, c), !0;
      case "dragenter":
        return yi = iu(yi, n, r, l, o, c), !0;
      case "mouseover":
        return cn = iu(cn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Gt.set(d, iu(Gt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, iu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Go(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = Ke(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Qe(l), r !== null) {
            n.blockedOn = r, Zu(n.priority, function() {
              hi(l);
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
  function El(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = no(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        rn = o, l.target.dispatchEvent(o), rn = null;
      } else return r = De(l), r !== null && Qo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    El(n) && l.delete(r);
  }
  function qf() {
    ir = !1, Or !== null && El(Or) && (Or = null), yi !== null && El(yi) && (yi = null), cn !== null && El(cn) && (cn = null), Gt.forEach(lu), Sl.forEach(lu);
  }
  function wa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, ir || (ir = !0, I.unstable_scheduleCallback(I.unstable_NormalPriority, qf)));
  }
  function Za(n) {
    function r(c) {
      return wa(c, n);
    }
    if (0 < mi.length) {
      wa(mi[0], n);
      for (var l = 1; l < mi.length; l++) {
        var o = mi[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (Or !== null && wa(Or, n), yi !== null && wa(yi, n), cn !== null && wa(cn, n), Gt.forEach(r), Sl.forEach(r), l = 0; l < Yn.length; l++) o = Yn[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < Yn.length && (l = Yn[0], l.blockedOn === null); ) Go(l), l.blockedOn === null && Yn.shift();
  }
  var gi = vt.ReactCurrentBatchConfig, _a = !0;
  function eo(n, r, l, o) {
    var c = zt, d = gi.transition;
    gi.transition = null;
    try {
      zt = 1, Cl(n, r, l, o);
    } finally {
      zt = c, gi.transition = d;
    }
  }
  function to(n, r, l, o) {
    var c = zt, d = gi.transition;
    gi.transition = null;
    try {
      zt = 4, Cl(n, r, l, o);
    } finally {
      zt = c, gi.transition = d;
    }
  }
  function Cl(n, r, l, o) {
    if (_a) {
      var c = no(n, r, l, o);
      if (c === null) Ec(n, r, o, uu, l), ba(n, o);
      else if (Wo(c, n, r, l, o)) o.stopPropagation();
      else if (ba(n, o), r & 4 && -1 < Lr.indexOf(n)) {
        for (; c !== null; ) {
          var d = De(c);
          if (d !== null && _t(d), d = no(n, r, l, o), d === null && Ec(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Ec(n, r, o, null, l);
    }
  }
  var uu = null;
  function no(n, r, l, o) {
    if (uu = null, n = Qt(o), n = vu(n), n !== null) if (r = Ke(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Qe(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return uu = n, null;
  }
  function ro(n) {
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
        switch (et()) {
          case Ka:
            return 1;
          case nu:
            return 4;
          case ru:
          case hl:
            return 16;
          case Wu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ei = null, h = null, C = null;
  function z() {
    if (C) return C;
    var n, r = h, l = r.length, o, c = "value" in ei ? ei.value : ei.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function j(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function X() {
    return !0;
  }
  function Le() {
    return !1;
  }
  function ie(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n) n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? X : Le, this.isPropagationStopped = Le, this;
    }
    return ae(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = X);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = X);
    }, persist: function() {
    }, isPersistent: X }), r;
  }
  var ze = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, yt = ie(ze), kt = ae({}, ze, { view: 0, detail: 0 }), ln = ie(kt), qt, ut, Kt, hn = ae({}, kt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ed, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Kt && (Kt && n.type === "mousemove" ? (qt = n.screenX - Kt.screenX, ut = n.screenY - Kt.screenY) : ut = qt = 0, Kt = n), qt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : ut;
  } }), Rl = ie(hn), qo = ae({}, hn, { dataTransfer: 0 }), Bi = ie(qo), Ko = ae({}, kt, { relatedTarget: 0 }), ou = ie(Ko), Kf = ae({}, ze, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), sc = ie(Kf), Xf = ae({}, ze, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), rv = ie(Xf), Jf = ae({}, ze, { data: 0 }), Zf = ie(Jf), av = {
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
  }, iv = {
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
  }, Jm = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Jm[n]) ? !!r[n] : !1;
  }
  function ed() {
    return Ii;
  }
  var td = ae({}, kt, { key: function(n) {
    if (n.key) {
      var r = av[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = j(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? iv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ed, charCode: function(n) {
    return n.type === "keypress" ? j(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? j(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), nd = ie(td), rd = ae({}, hn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), lv = ie(rd), cc = ae({}, kt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ed }), uv = ie(cc), Wr = ae({}, ze, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = ie(Wr), Mn = ae({}, hn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = ie(Mn), ad = [9, 13, 27, 32], ao = Dt && "CompositionEvent" in window, Xo = null;
  Dt && "documentMode" in document && (Xo = document.documentMode);
  var Jo = Dt && "TextEvent" in window && !Xo, ov = Dt && (!ao || Xo && 8 < Xo && 11 >= Xo), sv = " ", fc = !1;
  function cv(n, r) {
    switch (n) {
      case "keyup":
        return ad.indexOf(r.keyCode) !== -1;
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
  function fv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var io = !1;
  function dv(n, r) {
    switch (n) {
      case "compositionend":
        return fv(r);
      case "keypress":
        return r.which !== 32 ? null : (fc = !0, sv);
      case "textInput":
        return n = r.data, n === sv && fc ? null : n;
      default:
        return null;
    }
  }
  function Zm(n, r) {
    if (io) return n === "compositionend" || !ao && cv(n, r) ? (n = z(), C = h = ei = null, io = !1, n) : null;
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
        return ov && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ey = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function pv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ey[n.type] : r === "textarea";
  }
  function id(n, r, l, o) {
    Hi(o), r = as(r, "onChange"), 0 < r.length && (l = new yt("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function vv(n) {
    du(n, 0);
  }
  function Zo(n) {
    var r = ni(n);
    if (wr(r)) return n;
  }
  function ty(n, r) {
    if (n === "change") return r;
  }
  var hv = !1;
  if (Dt) {
    var ld;
    if (Dt) {
      var ud = "oninput" in document;
      if (!ud) {
        var mv = document.createElement("div");
        mv.setAttribute("oninput", "return;"), ud = typeof mv.oninput == "function";
      }
      ld = ud;
    } else ld = !1;
    hv = ld && (!document.documentMode || 9 < document.documentMode);
  }
  function yv() {
    Si && (Si.detachEvent("onpropertychange", gv), su = Si = null);
  }
  function gv(n) {
    if (n.propertyName === "value" && Zo(su)) {
      var r = [];
      id(r, su, n, Qt(n)), tu(vv, r);
    }
  }
  function ny(n, r, l) {
    n === "focusin" ? (yv(), Si = r, su = l, Si.attachEvent("onpropertychange", gv)) : n === "focusout" && yv();
  }
  function Sv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Zo(su);
  }
  function ry(n, r) {
    if (n === "click") return Zo(r);
  }
  function Ev(n, r) {
    if (n === "input" || n === "change") return Zo(r);
  }
  function ay(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : ay;
  function es(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!ce.call(r, c) || !ti(n[c], r[c])) return !1;
    }
    return !0;
  }
  function Cv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function dc(n, r) {
    var l = Cv(n);
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
      l = Cv(l);
    }
  }
  function Tl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Tl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ts() {
    for (var n = window, r = Cn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = Cn(n.document);
    }
    return r;
  }
  function pc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function lo(n) {
    var r = ts(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Tl(l.ownerDocument.documentElement, l)) {
      if (o !== null && pc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = dc(l, d);
          var m = dc(
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
  var iy = Dt && "documentMode" in document && 11 >= document.documentMode, uo = null, od = null, ns = null, sd = !1;
  function cd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    sd || uo == null || uo !== Cn(o) || (o = uo, "selectionStart" in o && pc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ns && es(ns, o) || (ns = o, o = as(od, "onSelect"), 0 < o.length && (r = new yt("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = uo)));
  }
  function vc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: vc("Animation", "AnimationEnd"), animationiteration: vc("Animation", "AnimationIteration"), animationstart: vc("Animation", "AnimationStart"), transitionend: vc("Transition", "TransitionEnd") }, lr = {}, fd = {};
  Dt && (fd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function hc(n) {
    if (lr[n]) return lr[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in fd) return lr[n] = r[l];
    return n;
  }
  var Rv = hc("animationend"), Tv = hc("animationiteration"), xv = hc("animationstart"), bv = hc("transitionend"), dd = /* @__PURE__ */ new Map(), mc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ka(n, r) {
    dd.set(n, r), gt(r, [n]);
  }
  for (var pd = 0; pd < mc.length; pd++) {
    var fu = mc[pd], ly = fu.toLowerCase(), uy = fu[0].toUpperCase() + fu.slice(1);
    ka(ly, "on" + uy);
  }
  ka(Rv, "onAnimationEnd"), ka(Tv, "onAnimationIteration"), ka(xv, "onAnimationStart"), ka("dblclick", "onDoubleClick"), ka("focusin", "onFocus"), ka("focusout", "onBlur"), ka(bv, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), gt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), gt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), gt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), gt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), gt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), gt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var rs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), vd = new Set("cancel close invalid load scroll toggle".split(" ").concat(rs));
  function yc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, me(o, r, void 0, n), n.currentTarget = null;
  }
  function du(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var E = o[m], T = E.instance, U = E.currentTarget;
          if (E = E.listener, T !== d && c.isPropagationStopped()) break e;
          yc(c, E, U), d = T;
        }
        else for (m = 0; m < o.length; m++) {
          if (E = o[m], T = E.instance, U = E.currentTarget, E = E.listener, T !== d && c.isPropagationStopped()) break e;
          yc(c, E, U), d = T;
        }
      }
    }
    if (vi) throw n = R, vi = !1, R = null, n;
  }
  function Bt(n, r) {
    var l = r[us];
    l === void 0 && (l = r[us] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (wv(r, n, 2, !1), l.add(o));
  }
  function gc(n, r, l) {
    var o = 0;
    r && (o |= 4), wv(l, n, o, r);
  }
  var Sc = "_reactListening" + Math.random().toString(36).slice(2);
  function oo(n) {
    if (!n[Sc]) {
      n[Sc] = !0, wt.forEach(function(l) {
        l !== "selectionchange" && (vd.has(l) || gc(l, !1, n), gc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Sc] || (r[Sc] = !0, gc("selectionchange", !1, r));
    }
  }
  function wv(n, r, l, o) {
    switch (ro(r)) {
      case 1:
        var c = eo;
        break;
      case 4:
        c = to;
        break;
      default:
        c = Cl;
    }
    l = c.bind(null, r, l, n), c = void 0, !kr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Ec(n, r, l, o, c) {
    var d = o;
    if ((r & 1) === 0 && (r & 2) === 0 && o !== null) e: for (; ; ) {
      if (o === null) return;
      var m = o.tag;
      if (m === 3 || m === 4) {
        var E = o.stateNode.containerInfo;
        if (E === c || E.nodeType === 8 && E.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var T = m.tag;
          if ((T === 3 || T === 4) && (T = m.stateNode.containerInfo, T === c || T.nodeType === 8 && T.parentNode === c)) return;
          m = m.return;
        }
        for (; E !== null; ) {
          if (m = vu(E), m === null) return;
          if (T = m.tag, T === 5 || T === 6) {
            o = d = m;
            continue e;
          }
          E = E.parentNode;
        }
      }
      o = o.return;
    }
    tu(function() {
      var U = d, W = Qt(l), q = [];
      e: {
        var $ = dd.get(n);
        if ($ !== void 0) {
          var fe = yt, Se = n;
          switch (n) {
            case "keypress":
              if (j(l) === 0) break e;
            case "keydown":
            case "keyup":
              fe = nd;
              break;
            case "focusin":
              Se = "focus", fe = ou;
              break;
            case "focusout":
              Se = "blur", fe = ou;
              break;
            case "beforeblur":
            case "afterblur":
              fe = ou;
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
              fe = Rl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              fe = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              fe = uv;
              break;
            case Rv:
            case Tv:
            case xv:
              fe = sc;
              break;
            case bv:
              fe = Yi;
              break;
            case "scroll":
              fe = ln;
              break;
            case "wheel":
              fe = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              fe = rv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              fe = lv;
          }
          var Re = (r & 4) !== 0, kn = !Re && n === "scroll", k = Re ? $ !== null ? $ + "Capture" : null : $;
          Re = [];
          for (var b = U, L; b !== null; ) {
            L = b;
            var G = L.stateNode;
            if (L.tag === 5 && G !== null && (L = G, k !== null && (G = _r(b, k), G != null && Re.push(so(b, G, L)))), kn) break;
            b = b.return;
          }
          0 < Re.length && ($ = new fe($, Se, null, l, W), q.push({ event: $, listeners: Re }));
        }
      }
      if ((r & 7) === 0) {
        e: {
          if ($ = n === "mouseover" || n === "pointerover", fe = n === "mouseout" || n === "pointerout", $ && l !== rn && (Se = l.relatedTarget || l.fromElement) && (vu(Se) || Se[Qi])) break e;
          if ((fe || $) && ($ = W.window === W ? W : ($ = W.ownerDocument) ? $.defaultView || $.parentWindow : window, fe ? (Se = l.relatedTarget || l.toElement, fe = U, Se = Se ? vu(Se) : null, Se !== null && (kn = Ke(Se), Se !== kn || Se.tag !== 5 && Se.tag !== 6) && (Se = null)) : (fe = null, Se = U), fe !== Se)) {
            if (Re = Rl, G = "onMouseLeave", k = "onMouseEnter", b = "mouse", (n === "pointerout" || n === "pointerover") && (Re = lv, G = "onPointerLeave", k = "onPointerEnter", b = "pointer"), kn = fe == null ? $ : ni(fe), L = Se == null ? $ : ni(Se), $ = new Re(G, b + "leave", fe, l, W), $.target = kn, $.relatedTarget = L, G = null, vu(W) === U && (Re = new Re(k, b + "enter", Se, l, W), Re.target = L, Re.relatedTarget = kn, G = Re), kn = G, fe && Se) t: {
              for (Re = fe, k = Se, b = 0, L = Re; L; L = xl(L)) b++;
              for (L = 0, G = k; G; G = xl(G)) L++;
              for (; 0 < b - L; ) Re = xl(Re), b--;
              for (; 0 < L - b; ) k = xl(k), L--;
              for (; b--; ) {
                if (Re === k || k !== null && Re === k.alternate) break t;
                Re = xl(Re), k = xl(k);
              }
              Re = null;
            }
            else Re = null;
            fe !== null && _v(q, $, fe, Re, !1), Se !== null && kn !== null && _v(q, kn, Se, Re, !0);
          }
        }
        e: {
          if ($ = U ? ni(U) : window, fe = $.nodeName && $.nodeName.toLowerCase(), fe === "select" || fe === "input" && $.type === "file") var Ee = ty;
          else if (pv($)) if (hv) Ee = Ev;
          else {
            Ee = Sv;
            var Ne = ny;
          }
          else (fe = $.nodeName) && fe.toLowerCase() === "input" && ($.type === "checkbox" || $.type === "radio") && (Ee = ry);
          if (Ee && (Ee = Ee(n, U))) {
            id(q, Ee, l, W);
            break e;
          }
          Ne && Ne(n, $, U), n === "focusout" && (Ne = $._wrapperState) && Ne.controlled && $.type === "number" && sa($, "number", $.value);
        }
        switch (Ne = U ? ni(U) : window, n) {
          case "focusin":
            (pv(Ne) || Ne.contentEditable === "true") && (uo = Ne, od = U, ns = null);
            break;
          case "focusout":
            ns = od = uo = null;
            break;
          case "mousedown":
            sd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            sd = !1, cd(q, l, W);
            break;
          case "selectionchange":
            if (iy) break;
          case "keydown":
          case "keyup":
            cd(q, l, W);
        }
        var Ue;
        if (ao) e: {
          switch (n) {
            case "compositionstart":
              var Ie = "onCompositionStart";
              break e;
            case "compositionend":
              Ie = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Ie = "onCompositionUpdate";
              break e;
          }
          Ie = void 0;
        }
        else io ? cv(n, l) && (Ie = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Ie = "onCompositionStart");
        Ie && (ov && l.locale !== "ko" && (io || Ie !== "onCompositionStart" ? Ie === "onCompositionEnd" && io && (Ue = z()) : (ei = W, h = "value" in ei ? ei.value : ei.textContent, io = !0)), Ne = as(U, Ie), 0 < Ne.length && (Ie = new Zf(Ie, n, null, l, W), q.push({ event: Ie, listeners: Ne }), Ue ? Ie.data = Ue : (Ue = fv(l), Ue !== null && (Ie.data = Ue)))), (Ue = Jo ? dv(n, l) : Zm(n, l)) && (U = as(U, "onBeforeInput"), 0 < U.length && (W = new Zf("onBeforeInput", "beforeinput", null, l, W), q.push({ event: W, listeners: U }), W.data = Ue));
      }
      du(q, r);
    });
  }
  function so(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function as(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = _r(n, l), d != null && o.unshift(so(n, d, c)), d = _r(n, r), d != null && o.push(so(n, d, c))), n = n.return;
    }
    return o;
  }
  function xl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function _v(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var E = l, T = E.alternate, U = E.stateNode;
      if (T !== null && T === o) break;
      E.tag === 5 && U !== null && (E = U, c ? (T = _r(l, d), T != null && m.unshift(so(l, T, E))) : c || (T = _r(l, d), T != null && m.push(so(l, T, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var kv = /\r\n?/g, oy = /\u0000|\uFFFD/g;
  function Dv(n) {
    return (typeof n == "string" ? n : "" + n).replace(kv, `
`).replace(oy, "");
  }
  function Cc(n, r, l) {
    if (r = Dv(r), Dv(n) !== r && l) throw Error(N(425));
  }
  function bl() {
  }
  var is = null, pu = null;
  function Rc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Tc = typeof setTimeout == "function" ? setTimeout : void 0, hd = typeof clearTimeout == "function" ? clearTimeout : void 0, Ov = typeof Promise == "function" ? Promise : void 0, co = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ov < "u" ? function(n) {
    return Ov.resolve(null).then(n).catch(xc);
  } : Tc;
  function xc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function fo(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (o === 0) {
          n.removeChild(c), Za(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Za(r);
  }
  function Ei(n) {
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
  function Lv(n) {
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
  var wl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + wl, ls = "__reactProps$" + wl, Qi = "__reactContainer$" + wl, us = "__reactEvents$" + wl, po = "__reactListeners$" + wl, sy = "__reactHandles$" + wl;
  function vu(n) {
    var r = n[Ci];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[Ci]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Lv(n); n !== null; ) {
          if (l = n[Ci]) return l;
          n = Lv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function De(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(N(33));
  }
  function mn(n) {
    return n[ls] || null;
  }
  var Rt = [], Da = -1;
  function Oa(n) {
    return { current: n };
  }
  function un(n) {
    0 > Da || (n.current = Rt[Da], Rt[Da] = null, Da--);
  }
  function ke(n, r) {
    Da++, Rt[Da] = n.current, n.current = r;
  }
  var Cr = {}, En = Oa(Cr), $n = Oa(!1), Gr = Cr;
  function qr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Cr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function Nn(n) {
    return n = n.childContextTypes, n != null;
  }
  function vo() {
    un($n), un(En);
  }
  function Mv(n, r, l) {
    if (En.current !== Cr) throw Error(N(168));
    ke(En, r), ke($n, l);
  }
  function os(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(N(108, Ze(n) || "Unknown", c));
    return ae({}, l, o);
  }
  function Xn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Cr, Gr = En.current, ke(En, n), ke($n, $n.current), !0;
  }
  function bc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(N(169));
    l ? (n = os(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, un($n), un(En), ke(En, n)) : un($n), ke($n, l);
  }
  var Ri = null, ho = !1, Wi = !1;
  function wc(n) {
    Ri === null ? Ri = [n] : Ri.push(n);
  }
  function _l(n) {
    ho = !0, wc(n);
  }
  function Ti() {
    if (!Wi && Ri !== null) {
      Wi = !0;
      var n = 0, r = zt;
      try {
        var l = Ri;
        for (zt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ri = null, ho = !1;
      } catch (c) {
        throw Ri !== null && (Ri = Ri.slice(n + 1)), sn(Ka, Ti), c;
      } finally {
        zt = r, Wi = !1;
      }
    }
    return null;
  }
  var kl = [], Dl = 0, Ol = null, Gi = 0, zn = [], La = 0, pa = null, xi = 1, bi = "";
  function hu(n, r) {
    kl[Dl++] = Gi, kl[Dl++] = Ol, Ol = n, Gi = r;
  }
  function Nv(n, r, l) {
    zn[La++] = xi, zn[La++] = bi, zn[La++] = pa, pa = n;
    var o = xi;
    n = bi;
    var c = 32 - Dr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Dr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, xi = 1 << 32 - Dr(r) + c | l << c | o, bi = d + n;
    } else xi = 1 << d | l << c | o, bi = n;
  }
  function _c(n) {
    n.return !== null && (hu(n, 1), Nv(n, 1, 0));
  }
  function kc(n) {
    for (; n === Ol; ) Ol = kl[--Dl], kl[Dl] = null, Gi = kl[--Dl], kl[Dl] = null;
    for (; n === pa; ) pa = zn[--La], zn[La] = null, bi = zn[--La], zn[La] = null, xi = zn[--La], zn[La] = null;
  }
  var Kr = null, Xr = null, dn = !1, Ma = null;
  function md(n, r) {
    var l = ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function zv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = Ei(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: xi, overflow: bi } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = ja(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function yd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function gd(n) {
    if (dn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!zv(n, r)) {
          if (yd(n)) throw Error(N(418));
          r = Ei(l.nextSibling);
          var o = Kr;
          r && zv(n, r) ? md(o, l) : (n.flags = n.flags & -4097 | 2, dn = !1, Kr = n);
        }
      } else {
        if (yd(n)) throw Error(N(418));
        n.flags = n.flags & -4097 | 2, dn = !1, Kr = n;
      }
    }
  }
  function Qn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Kr = n;
  }
  function Dc(n) {
    if (n !== Kr) return !1;
    if (!dn) return Qn(n), dn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Rc(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (yd(n)) throw ss(), Error(N(418));
      for (; r; ) md(n, r), r = Ei(r.nextSibling);
    }
    if (Qn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(N(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Xr = Ei(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Xr = null;
      }
    } else Xr = Kr ? Ei(n.stateNode.nextSibling) : null;
    return !0;
  }
  function ss() {
    for (var n = Xr; n; ) n = Ei(n.nextSibling);
  }
  function Ll() {
    Xr = Kr = null, dn = !1;
  }
  function qi(n) {
    Ma === null ? Ma = [n] : Ma.push(n);
  }
  var cy = vt.ReactCurrentBatchConfig;
  function mu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(N(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(N(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(N(284));
      if (!l._owner) throw Error(N(290, n));
    }
    return n;
  }
  function Oc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(N(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Uv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function yu(n) {
    function r(k, b) {
      if (n) {
        var L = k.deletions;
        L === null ? (k.deletions = [b], k.flags |= 16) : L.push(b);
      }
    }
    function l(k, b) {
      if (!n) return null;
      for (; b !== null; ) r(k, b), b = b.sibling;
      return null;
    }
    function o(k, b) {
      for (k = /* @__PURE__ */ new Map(); b !== null; ) b.key !== null ? k.set(b.key, b) : k.set(b.index, b), b = b.sibling;
      return k;
    }
    function c(k, b) {
      return k = Hl(k, b), k.index = 0, k.sibling = null, k;
    }
    function d(k, b, L) {
      return k.index = L, n ? (L = k.alternate, L !== null ? (L = L.index, L < b ? (k.flags |= 2, b) : L) : (k.flags |= 2, b)) : (k.flags |= 1048576, b);
    }
    function m(k) {
      return n && k.alternate === null && (k.flags |= 2), k;
    }
    function E(k, b, L, G) {
      return b === null || b.tag !== 6 ? (b = qd(L, k.mode, G), b.return = k, b) : (b = c(b, L), b.return = k, b);
    }
    function T(k, b, L, G) {
      var Ee = L.type;
      return Ee === ge ? W(k, b, L.props.children, G, L.key) : b !== null && (b.elementType === Ee || typeof Ee == "object" && Ee !== null && Ee.$$typeof === Nt && Uv(Ee) === b.type) ? (G = c(b, L.props), G.ref = mu(k, b, L), G.return = k, G) : (G = Hs(L.type, L.key, L.props, null, k.mode, G), G.ref = mu(k, b, L), G.return = k, G);
    }
    function U(k, b, L, G) {
      return b === null || b.tag !== 4 || b.stateNode.containerInfo !== L.containerInfo || b.stateNode.implementation !== L.implementation ? (b = cf(L, k.mode, G), b.return = k, b) : (b = c(b, L.children || []), b.return = k, b);
    }
    function W(k, b, L, G, Ee) {
      return b === null || b.tag !== 7 ? (b = tl(L, k.mode, G, Ee), b.return = k, b) : (b = c(b, L), b.return = k, b);
    }
    function q(k, b, L) {
      if (typeof b == "string" && b !== "" || typeof b == "number") return b = qd("" + b, k.mode, L), b.return = k, b;
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case ee:
            return L = Hs(b.type, b.key, b.props, null, k.mode, L), L.ref = mu(k, null, b), L.return = k, L;
          case Ae:
            return b = cf(b, k.mode, L), b.return = k, b;
          case Nt:
            var G = b._init;
            return q(k, G(b._payload), L);
        }
        if (qn(b) || xe(b)) return b = tl(b, k.mode, L, null), b.return = k, b;
        Oc(k, b);
      }
      return null;
    }
    function $(k, b, L, G) {
      var Ee = b !== null ? b.key : null;
      if (typeof L == "string" && L !== "" || typeof L == "number") return Ee !== null ? null : E(k, b, "" + L, G);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ee:
            return L.key === Ee ? T(k, b, L, G) : null;
          case Ae:
            return L.key === Ee ? U(k, b, L, G) : null;
          case Nt:
            return Ee = L._init, $(
              k,
              b,
              Ee(L._payload),
              G
            );
        }
        if (qn(L) || xe(L)) return Ee !== null ? null : W(k, b, L, G, null);
        Oc(k, L);
      }
      return null;
    }
    function fe(k, b, L, G, Ee) {
      if (typeof G == "string" && G !== "" || typeof G == "number") return k = k.get(L) || null, E(b, k, "" + G, Ee);
      if (typeof G == "object" && G !== null) {
        switch (G.$$typeof) {
          case ee:
            return k = k.get(G.key === null ? L : G.key) || null, T(b, k, G, Ee);
          case Ae:
            return k = k.get(G.key === null ? L : G.key) || null, U(b, k, G, Ee);
          case Nt:
            var Ne = G._init;
            return fe(k, b, L, Ne(G._payload), Ee);
        }
        if (qn(G) || xe(G)) return k = k.get(L) || null, W(b, k, G, Ee, null);
        Oc(b, G);
      }
      return null;
    }
    function Se(k, b, L, G) {
      for (var Ee = null, Ne = null, Ue = b, Ie = b = 0, er = null; Ue !== null && Ie < L.length; Ie++) {
        Ue.index > Ie ? (er = Ue, Ue = null) : er = Ue.sibling;
        var jt = $(k, Ue, L[Ie], G);
        if (jt === null) {
          Ue === null && (Ue = er);
          break;
        }
        n && Ue && jt.alternate === null && r(k, Ue), b = d(jt, b, Ie), Ne === null ? Ee = jt : Ne.sibling = jt, Ne = jt, Ue = er;
      }
      if (Ie === L.length) return l(k, Ue), dn && hu(k, Ie), Ee;
      if (Ue === null) {
        for (; Ie < L.length; Ie++) Ue = q(k, L[Ie], G), Ue !== null && (b = d(Ue, b, Ie), Ne === null ? Ee = Ue : Ne.sibling = Ue, Ne = Ue);
        return dn && hu(k, Ie), Ee;
      }
      for (Ue = o(k, Ue); Ie < L.length; Ie++) er = fe(Ue, k, Ie, L[Ie], G), er !== null && (n && er.alternate !== null && Ue.delete(er.key === null ? Ie : er.key), b = d(er, b, Ie), Ne === null ? Ee = er : Ne.sibling = er, Ne = er);
      return n && Ue.forEach(function(Bl) {
        return r(k, Bl);
      }), dn && hu(k, Ie), Ee;
    }
    function Re(k, b, L, G) {
      var Ee = xe(L);
      if (typeof Ee != "function") throw Error(N(150));
      if (L = Ee.call(L), L == null) throw Error(N(151));
      for (var Ne = Ee = null, Ue = b, Ie = b = 0, er = null, jt = L.next(); Ue !== null && !jt.done; Ie++, jt = L.next()) {
        Ue.index > Ie ? (er = Ue, Ue = null) : er = Ue.sibling;
        var Bl = $(k, Ue, jt.value, G);
        if (Bl === null) {
          Ue === null && (Ue = er);
          break;
        }
        n && Ue && Bl.alternate === null && r(k, Ue), b = d(Bl, b, Ie), Ne === null ? Ee = Bl : Ne.sibling = Bl, Ne = Bl, Ue = er;
      }
      if (jt.done) return l(
        k,
        Ue
      ), dn && hu(k, Ie), Ee;
      if (Ue === null) {
        for (; !jt.done; Ie++, jt = L.next()) jt = q(k, jt.value, G), jt !== null && (b = d(jt, b, Ie), Ne === null ? Ee = jt : Ne.sibling = jt, Ne = jt);
        return dn && hu(k, Ie), Ee;
      }
      for (Ue = o(k, Ue); !jt.done; Ie++, jt = L.next()) jt = fe(Ue, k, Ie, jt.value, G), jt !== null && (n && jt.alternate !== null && Ue.delete(jt.key === null ? Ie : jt.key), b = d(jt, b, Ie), Ne === null ? Ee = jt : Ne.sibling = jt, Ne = jt);
      return n && Ue.forEach(function(yh) {
        return r(k, yh);
      }), dn && hu(k, Ie), Ee;
    }
    function kn(k, b, L, G) {
      if (typeof L == "object" && L !== null && L.type === ge && L.key === null && (L = L.props.children), typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ee:
            e: {
              for (var Ee = L.key, Ne = b; Ne !== null; ) {
                if (Ne.key === Ee) {
                  if (Ee = L.type, Ee === ge) {
                    if (Ne.tag === 7) {
                      l(k, Ne.sibling), b = c(Ne, L.props.children), b.return = k, k = b;
                      break e;
                    }
                  } else if (Ne.elementType === Ee || typeof Ee == "object" && Ee !== null && Ee.$$typeof === Nt && Uv(Ee) === Ne.type) {
                    l(k, Ne.sibling), b = c(Ne, L.props), b.ref = mu(k, Ne, L), b.return = k, k = b;
                    break e;
                  }
                  l(k, Ne);
                  break;
                } else r(k, Ne);
                Ne = Ne.sibling;
              }
              L.type === ge ? (b = tl(L.props.children, k.mode, G, L.key), b.return = k, k = b) : (G = Hs(L.type, L.key, L.props, null, k.mode, G), G.ref = mu(k, b, L), G.return = k, k = G);
            }
            return m(k);
          case Ae:
            e: {
              for (Ne = L.key; b !== null; ) {
                if (b.key === Ne) if (b.tag === 4 && b.stateNode.containerInfo === L.containerInfo && b.stateNode.implementation === L.implementation) {
                  l(k, b.sibling), b = c(b, L.children || []), b.return = k, k = b;
                  break e;
                } else {
                  l(k, b);
                  break;
                }
                else r(k, b);
                b = b.sibling;
              }
              b = cf(L, k.mode, G), b.return = k, k = b;
            }
            return m(k);
          case Nt:
            return Ne = L._init, kn(k, b, Ne(L._payload), G);
        }
        if (qn(L)) return Se(k, b, L, G);
        if (xe(L)) return Re(k, b, L, G);
        Oc(k, L);
      }
      return typeof L == "string" && L !== "" || typeof L == "number" ? (L = "" + L, b !== null && b.tag === 6 ? (l(k, b.sibling), b = c(b, L), b.return = k, k = b) : (l(k, b), b = qd(L, k.mode, G), b.return = k, k = b), m(k)) : l(k, b);
    }
    return kn;
  }
  var xn = yu(!0), ue = yu(!1), va = Oa(null), Jr = null, mo = null, Sd = null;
  function Ed() {
    Sd = mo = Jr = null;
  }
  function Cd(n) {
    var r = va.current;
    un(va), n._currentValue = r;
  }
  function Rd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function yn(n, r) {
    Jr = n, Sd = mo = null, n = n.dependencies, n !== null && n.firstContext !== null && ((n.lanes & r) !== 0 && (An = !0), n.firstContext = null);
  }
  function Na(n) {
    var r = n._currentValue;
    if (Sd !== n) if (n = { context: n, memoizedValue: r, next: null }, mo === null) {
      if (Jr === null) throw Error(N(308));
      mo = n, Jr.dependencies = { lanes: 0, firstContext: n };
    } else mo = mo.next = n;
    return r;
  }
  var gu = null;
  function Td(n) {
    gu === null ? gu = [n] : gu.push(n);
  }
  function xd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Td(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ha(n, o);
  }
  function ha(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ma = !1;
  function bd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Av(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ml(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (Tt & 2) !== 0) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Td(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
  }
  function Lc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function jv(n, r) {
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
  function cs(n, r, l, o) {
    var c = n.updateQueue;
    ma = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, E = c.shared.pending;
    if (E !== null) {
      c.shared.pending = null;
      var T = E, U = T.next;
      T.next = null, m === null ? d = U : m.next = U, m = T;
      var W = n.alternate;
      W !== null && (W = W.updateQueue, E = W.lastBaseUpdate, E !== m && (E === null ? W.firstBaseUpdate = U : E.next = U, W.lastBaseUpdate = T));
    }
    if (d !== null) {
      var q = c.baseState;
      m = 0, W = U = T = null, E = d;
      do {
        var $ = E.lane, fe = E.eventTime;
        if ((o & $) === $) {
          W !== null && (W = W.next = {
            eventTime: fe,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var Se = n, Re = E;
            switch ($ = r, fe = l, Re.tag) {
              case 1:
                if (Se = Re.payload, typeof Se == "function") {
                  q = Se.call(fe, q, $);
                  break e;
                }
                q = Se;
                break e;
              case 3:
                Se.flags = Se.flags & -65537 | 128;
              case 0:
                if (Se = Re.payload, $ = typeof Se == "function" ? Se.call(fe, q, $) : Se, $ == null) break e;
                q = ae({}, q, $);
                break e;
              case 2:
                ma = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, $ = c.effects, $ === null ? c.effects = [E] : $.push(E));
        } else fe = { eventTime: fe, lane: $, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, W === null ? (U = W = fe, T = q) : W = W.next = fe, m |= $;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null) break;
          $ = E, E = $.next, $.next = null, c.lastBaseUpdate = $, c.shared.pending = null;
        }
      } while (!0);
      if (W === null && (T = q), c.baseState = T, c.firstBaseUpdate = U, c.lastBaseUpdate = W, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = q;
    }
  }
  function wd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(N(191, c));
        c.call(o);
      }
    }
  }
  var fs = {}, wi = Oa(fs), ds = Oa(fs), ps = Oa(fs);
  function Su(n) {
    if (n === fs) throw Error(N(174));
    return n;
  }
  function _d(n, r) {
    switch (ke(ps, r), ke(ds, n), ke(wi, fs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    un(wi), ke(wi, r);
  }
  function Eu() {
    un(wi), un(ds), un(ps);
  }
  function Fv(n) {
    Su(ps.current);
    var r = Su(wi.current), l = ca(r, n.type);
    r !== l && (ke(ds, n), ke(wi, l));
  }
  function Mc(n) {
    ds.current === n && (un(wi), un(ds));
  }
  var gn = Oa(0);
  function Nc(n) {
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
  var vs = [];
  function Oe() {
    for (var n = 0; n < vs.length; n++) vs[n]._workInProgressVersionPrimary = null;
    vs.length = 0;
  }
  var pt = vt.ReactCurrentDispatcher, Ut = vt.ReactCurrentBatchConfig, Xt = 0, At = null, Un = null, Jn = null, zc = !1, hs = !1, Cu = 0, Y = 0;
  function Mt() {
    throw Error(N(321));
  }
  function He(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Nl(n, r, l, o, c, d) {
    if (Xt = d, At = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, pt.current = n === null || n.memoizedState === null ? qc : Cs, n = l(o, c), hs) {
      d = 0;
      do {
        if (hs = !1, Cu = 0, 25 <= d) throw Error(N(301));
        d += 1, Jn = Un = null, r.updateQueue = null, pt.current = Kc, n = l(o, c);
      } while (hs);
    }
    if (pt.current = wu, r = Un !== null && Un.next !== null, Xt = 0, Jn = Un = At = null, zc = !1, r) throw Error(N(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function Rr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Jn === null ? At.memoizedState = Jn = n : Jn = Jn.next = n, Jn;
  }
  function bn() {
    if (Un === null) {
      var n = At.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Un.next;
    var r = Jn === null ? At.memoizedState : Jn.next;
    if (r !== null) Jn = r, Un = n;
    else {
      if (n === null) throw Error(N(310));
      Un = n, n = { memoizedState: Un.memoizedState, baseState: Un.baseState, baseQueue: Un.baseQueue, queue: Un.queue, next: null }, Jn === null ? At.memoizedState = Jn = n : Jn = Jn.next = n;
    }
    return Jn;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function zl(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(N(311));
    l.lastRenderedReducer = n;
    var o = Un, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var E = m = null, T = null, U = d;
      do {
        var W = U.lane;
        if ((Xt & W) === W) T !== null && (T = T.next = { lane: 0, action: U.action, hasEagerState: U.hasEagerState, eagerState: U.eagerState, next: null }), o = U.hasEagerState ? U.eagerState : n(o, U.action);
        else {
          var q = {
            lane: W,
            action: U.action,
            hasEagerState: U.hasEagerState,
            eagerState: U.eagerState,
            next: null
          };
          T === null ? (E = T = q, m = o) : T = T.next = q, At.lanes |= W, Oi |= W;
        }
        U = U.next;
      } while (U !== null && U !== d);
      T === null ? m = o : T.next = E, ti(o, r.memoizedState) || (An = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, At.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Ru(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(N(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ti(d, r.memoizedState) || (An = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function Uc() {
  }
  function Ac(n, r) {
    var l = At, o = bn(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, An = !0), o = o.queue, ms(Hc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Jn !== null && Jn.memoizedState.tag & 1) {
      if (l.flags |= 2048, Tu(9, Fc.bind(null, l, o, c, r), void 0, null), Wn === null) throw Error(N(349));
      (Xt & 30) !== 0 || jc(l, r, c);
    }
    return c;
  }
  function jc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = At.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, At.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Fc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Pc(r) && Vc(n);
  }
  function Hc(n, r, l) {
    return l(function() {
      Pc(r) && Vc(n);
    });
  }
  function Pc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ti(n, l);
    } catch {
      return !0;
    }
  }
  function Vc(n) {
    var r = ha(n, 1);
    r !== null && Ur(r, n, 1, -1);
  }
  function Bc(n) {
    var r = Rr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = bu.bind(null, At, n), [r.memoizedState, n];
  }
  function Tu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = At.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, At.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Ic() {
    return bn().memoizedState;
  }
  function yo(n, r, l, o) {
    var c = Rr();
    At.flags |= n, c.memoizedState = Tu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function go(n, r, l, o) {
    var c = bn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Un !== null) {
      var m = Un.memoizedState;
      if (d = m.destroy, o !== null && He(o, m.deps)) {
        c.memoizedState = Tu(r, l, d, o);
        return;
      }
    }
    At.flags |= n, c.memoizedState = Tu(1 | r, l, d, o);
  }
  function Yc(n, r) {
    return yo(8390656, 8, n, r);
  }
  function ms(n, r) {
    return go(2048, 8, n, r);
  }
  function $c(n, r) {
    return go(4, 2, n, r);
  }
  function ys(n, r) {
    return go(4, 4, n, r);
  }
  function xu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Qc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(4, 4, xu.bind(null, r, n), l);
  }
  function gs() {
  }
  function Wc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && He(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Gc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && He(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function kd(n, r, l) {
    return (Xt & 21) === 0 ? (n.baseState && (n.baseState = !1, An = !0), n.memoizedState = l) : (ti(l, r) || (l = Ku(), At.lanes |= l, Oi |= l, n.baseState = !0), r);
  }
  function Ss(n, r) {
    var l = zt;
    zt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Ut.transition;
    Ut.transition = {};
    try {
      n(!1), r();
    } finally {
      zt = l, Ut.transition = o;
    }
  }
  function Dd() {
    return bn().memoizedState;
  }
  function Es(n, r, l) {
    var o = Li(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Zr(n)) Hv(r, l);
    else if (l = xd(n, r, l, o), l !== null) {
      var c = Hn();
      Ur(l, n, o, c), en(l, r, o);
    }
  }
  function bu(n, r, l) {
    var o = Li(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Zr(n)) Hv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, E = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = E, ti(E, m)) {
          var T = r.interleaved;
          T === null ? (c.next = c, Td(r)) : (c.next = T.next, T.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = xd(n, r, c, o), l !== null && (c = Hn(), Ur(l, n, o, c), en(l, r, o));
    }
  }
  function Zr(n) {
    var r = n.alternate;
    return n === At || r !== null && r === At;
  }
  function Hv(n, r) {
    hs = zc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function en(n, r, l) {
    if ((l & 4194240) !== 0) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var wu = { readContext: Na, useCallback: Mt, useContext: Mt, useEffect: Mt, useImperativeHandle: Mt, useInsertionEffect: Mt, useLayoutEffect: Mt, useMemo: Mt, useReducer: Mt, useRef: Mt, useState: Mt, useDebugValue: Mt, useDeferredValue: Mt, useTransition: Mt, useMutableSource: Mt, useSyncExternalStore: Mt, useId: Mt, unstable_isNewReconciler: !1 }, qc = { readContext: Na, useCallback: function(n, r) {
    return Rr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Na, useEffect: Yc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, yo(
      4194308,
      4,
      xu.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return yo(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return yo(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Rr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Rr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Es.bind(null, At, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Rr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Bc, useDebugValue: gs, useDeferredValue: function(n) {
    return Rr().memoizedState = n;
  }, useTransition: function() {
    var n = Bc(!1), r = n[0];
    return n = Ss.bind(null, n[1]), Rr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = At, c = Rr();
    if (dn) {
      if (l === void 0) throw Error(N(407));
      l = l();
    } else {
      if (l = r(), Wn === null) throw Error(N(349));
      (Xt & 30) !== 0 || jc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Yc(Hc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, Tu(9, Fc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Rr(), r = Wn.identifierPrefix;
    if (dn) {
      var l = bi, o = xi;
      l = (o & ~(1 << 32 - Dr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = Y++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Cs = {
    readContext: Na,
    useCallback: Wc,
    useContext: Na,
    useEffect: ms,
    useImperativeHandle: Qc,
    useInsertionEffect: $c,
    useLayoutEffect: ys,
    useMemo: Gc,
    useReducer: zl,
    useRef: Ic,
    useState: function() {
      return zl(Xi);
    },
    useDebugValue: gs,
    useDeferredValue: function(n) {
      var r = bn();
      return kd(r, Un.memoizedState, n);
    },
    useTransition: function() {
      var n = zl(Xi)[0], r = bn().memoizedState;
      return [n, r];
    },
    useMutableSource: Uc,
    useSyncExternalStore: Ac,
    useId: Dd,
    unstable_isNewReconciler: !1
  }, Kc = { readContext: Na, useCallback: Wc, useContext: Na, useEffect: ms, useImperativeHandle: Qc, useInsertionEffect: $c, useLayoutEffect: ys, useMemo: Gc, useReducer: Ru, useRef: Ic, useState: function() {
    return Ru(Xi);
  }, useDebugValue: gs, useDeferredValue: function(n) {
    var r = bn();
    return Un === null ? r.memoizedState = n : kd(r, Un.memoizedState, n);
  }, useTransition: function() {
    var n = Ru(Xi)[0], r = bn().memoizedState;
    return [n, r];
  }, useMutableSource: Uc, useSyncExternalStore: Ac, useId: Dd, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = ae({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Od(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : ae({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Xc = { isMounted: function(n) {
    return (n = n._reactInternals) ? Ke(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Li(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ml(n, d, c), r !== null && (Ur(r, n, c, o), Lc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Li(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ml(n, d, c), r !== null && (Ur(r, n, c, o), Lc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Hn(), o = Li(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ml(n, c, o), r !== null && (Ur(r, n, o, l), Lc(r, n, o));
  } };
  function Pv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !es(l, o) || !es(c, d) : !0;
  }
  function Jc(n, r, l) {
    var o = !1, c = Cr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Na(d) : (c = Nn(r) ? Gr : En.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : Cr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Xc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Vv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Xc.enqueueReplaceState(r, r.state, null);
  }
  function Rs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, bd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Na(d) : (d = Nn(r) ? Gr : En.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Od(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Xc.enqueueReplaceState(c, c.state, null), cs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += ct(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Ld(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Md(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var Zc = typeof WeakMap == "function" ? WeakMap : Map;
  function Bv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      xo || (xo = !0, Ou = o), Md(n, r);
    }, l;
  }
  function Nd(n, r, l) {
    l = Ki(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Md(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Md(n, r), typeof o != "function" && (jl === null ? jl = /* @__PURE__ */ new Set([this]) : jl.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function zd(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new Zc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = yy.bind(null, n, r, l), r.then(n, n));
  }
  function Iv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Ul(n, r, l, o, c) {
    return (n.mode & 1) === 0 ? (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ml(l, r, 1))), l.lanes |= 1), n) : (n.flags |= 65536, n.lanes = c, n);
  }
  var Ts = vt.ReactCurrentOwner, An = !1;
  function ur(n, r, l, o) {
    r.child = n === null ? ue(r, null, l, o) : xn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return yn(r, c), o = Nl(n, r, l, o, d, c), l = ri(), n !== null && !An ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ua(n, r, c)) : (dn && l && _c(r), r.flags |= 1, ur(n, r, o, c), r.child);
  }
  function ku(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Gd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, Je(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, (n.lanes & c) === 0) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : es, l(m, o) && n.ref === r.ref) return Ua(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function Je(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (es(d, o) && n.ref === r.ref) if (An = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) (n.flags & 131072) !== 0 && (An = !0);
      else return r.lanes = n.lanes, Ua(n, r, c);
    }
    return Yv(n, r, l, o, c);
  }
  function xs(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if ((r.mode & 1) === 0) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, ke(Co, ya), ya |= l;
    else {
      if ((l & 1073741824) === 0) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, ke(Co, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, ke(Co, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, ke(Co, ya), ya |= o;
    return ur(n, r, c, l), r.child;
  }
  function Ud(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Yv(n, r, l, o, c) {
    var d = Nn(l) ? Gr : En.current;
    return d = qr(r, d), yn(r, c), l = Nl(n, r, l, o, d, c), o = ri(), n !== null && !An ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ua(n, r, c)) : (dn && o && _c(r), r.flags |= 1, ur(n, r, l, c), r.child);
  }
  function $v(n, r, l, o, c) {
    if (Nn(l)) {
      var d = !0;
      Xn(r);
    } else d = !1;
    if (yn(r, c), r.stateNode === null) za(n, r), Jc(r, l, o), Rs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, E = r.memoizedProps;
      m.props = E;
      var T = m.context, U = l.contextType;
      typeof U == "object" && U !== null ? U = Na(U) : (U = Nn(l) ? Gr : En.current, U = qr(r, U));
      var W = l.getDerivedStateFromProps, q = typeof W == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      q || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || T !== U) && Vv(r, m, o, U), ma = !1;
      var $ = r.memoizedState;
      m.state = $, cs(r, o, m, c), T = r.memoizedState, E !== o || $ !== T || $n.current || ma ? (typeof W == "function" && (Od(r, l, W, o), T = r.memoizedState), (E = ma || Pv(r, l, E, o, $, T, U)) ? (q || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = U, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Av(n, r), E = r.memoizedProps, U = r.type === r.elementType ? E : ai(r.type, E), m.props = U, q = r.pendingProps, $ = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = Na(T) : (T = Nn(l) ? Gr : En.current, T = qr(r, T));
      var fe = l.getDerivedStateFromProps;
      (W = typeof fe == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== q || $ !== T) && Vv(r, m, o, T), ma = !1, $ = r.memoizedState, m.state = $, cs(r, o, m, c);
      var Se = r.memoizedState;
      E !== q || $ !== Se || $n.current || ma ? (typeof fe == "function" && (Od(r, l, fe, o), Se = r.memoizedState), (U = ma || Pv(r, l, U, o, $, Se, T) || !1) ? (W || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, Se, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, Se, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Se), m.props = o, m.state = Se, m.context = T, o = U) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return bs(n, r, l, o, d, c);
  }
  function bs(n, r, l, o, c, d) {
    Ud(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && bc(r, l, !1), Ua(n, r, d);
    o = r.stateNode, Ts.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = xn(r, n.child, null, d), r.child = xn(r, null, E, d)) : ur(n, r, E, d), r.memoizedState = o.state, c && bc(r, l, !0), r.child;
  }
  function So(n) {
    var r = n.stateNode;
    r.pendingContext ? Mv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Mv(n, r.context, !1), _d(n, r.containerInfo);
  }
  function Qv(n, r, l, o, c) {
    return Ll(), qi(c), r.flags |= 256, ur(n, r, l, o), r.child;
  }
  var ef = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ad(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function tf(n, r, l) {
    var o = r.pendingProps, c = gn.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), ke(gn, c & 1), n === null)
      return gd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? ((r.mode & 1) === 0 ? r.lanes = 1 : n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, (o & 1) === 0 && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Pl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ad(l), r.memoizedState = ef, n) : jd(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null)) return Wv(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return (m & 1) === 0 && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Hl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Hl(E, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ad(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = ef, o;
    }
    return d = n.child, n = d.sibling, o = Hl(d, { mode: "visible", children: o.children }), (r.mode & 1) === 0 && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function jd(n, r) {
    return r = Pl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ws(n, r, l, o) {
    return o !== null && qi(o), xn(r, n.child, null, l), n = jd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Wv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Ld(Error(N(422))), ws(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Pl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, (r.mode & 1) !== 0 && xn(r, n.child, null, m), r.child.memoizedState = Ad(m), r.memoizedState = ef, d);
    if ((r.mode & 1) === 0) return ws(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var E = o.dgst;
      return o = E, d = Error(N(419)), o = Ld(d, o, void 0), ws(n, r, m, o);
    }
    if (E = (m & n.childLanes) !== 0, An || E) {
      if (o = Wn, o !== null) {
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
        c = (c & (o.suspendedLanes | m)) !== 0 ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ha(n, c), Ur(o, n, c, -1));
      }
      return Wd(), o = Ld(Error(N(421))), ws(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = gy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Ei(c.nextSibling), Kr = r, dn = !0, Ma = null, n !== null && (zn[La++] = xi, zn[La++] = bi, zn[La++] = pa, xi = n.id, bi = n.overflow, pa = r), r = jd(r, o.children), r.flags |= 4096, r);
  }
  function Fd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Rd(n.return, r, l);
  }
  function Mr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function _i(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (ur(n, r, o.children, l), o = gn.current, (o & 2) !== 0) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && (n.flags & 128) !== 0) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Fd(n, l, r);
        else if (n.tag === 19) Fd(n, l, r);
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
    if (ke(gn, o), (r.mode & 1) === 0) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Nc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Mr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Nc(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Mr(r, !0, l, null, d);
        break;
      case "together":
        Mr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function za(n, r) {
    (r.mode & 1) === 0 && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Ua(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, (l & r.childLanes) === 0) return null;
    if (n !== null && r.child !== n.child) throw Error(N(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function _s(n, r, l) {
    switch (r.tag) {
      case 3:
        So(r), Ll();
        break;
      case 5:
        Fv(r);
        break;
      case 1:
        Nn(r.type) && Xn(r);
        break;
      case 4:
        _d(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        ke(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (ke(gn, gn.current & 1), r.flags |= 128, null) : (l & r.child.childLanes) !== 0 ? tf(n, r, l) : (ke(gn, gn.current & 1), n = Ua(n, r, l), n !== null ? n.sibling : null);
        ke(gn, gn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, (n.flags & 128) !== 0) {
          if (o) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), ke(gn, gn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, xs(n, r, l);
    }
    return Ua(n, r, l);
  }
  var Aa, jn, Gv, qv;
  Aa = function(n, r) {
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
  }, jn = function() {
  }, Gv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, Su(wi.current);
      var d = null;
      switch (l) {
        case "input":
          c = nr(n, c), o = nr(n, o), d = [];
          break;
        case "select":
          c = ae({}, c, { value: void 0 }), o = ae({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = In(n, c), o = In(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = bl);
      }
      on(l, o);
      var m;
      l = null;
      for (U in c) if (!o.hasOwnProperty(U) && c.hasOwnProperty(U) && c[U] != null) if (U === "style") {
        var E = c[U];
        for (m in E) E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else U !== "dangerouslySetInnerHTML" && U !== "children" && U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && U !== "autoFocus" && (tt.hasOwnProperty(U) ? d || (d = []) : (d = d || []).push(U, null));
      for (U in o) {
        var T = o[U];
        if (E = c != null ? c[U] : void 0, o.hasOwnProperty(U) && T !== E && (T != null || E != null)) if (U === "style") if (E) {
          for (m in E) !E.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && E[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          U,
          l
        )), l = T;
        else U === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, E = E ? E.__html : void 0, T != null && E !== T && (d = d || []).push(U, T)) : U === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(U, "" + T) : U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && (tt.hasOwnProperty(U) ? (T != null && U === "onScroll" && Bt("scroll", n), d || E === T || (d = [])) : (d = d || []).push(U, T));
      }
      l && (d = d || []).push("style", l);
      var U = d;
      (r.updateQueue = U) && (r.flags |= 4);
    }
  }, qv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function ks(n, r) {
    if (!dn) switch (n.tailMode) {
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
  function Zn(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Kv(n, r, l) {
    var o = r.pendingProps;
    switch (kc(r), r.tag) {
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
        return Zn(r), null;
      case 1:
        return Nn(r.type) && vo(), Zn(r), null;
      case 3:
        return o = r.stateNode, Eu(), un($n), un(En), Oe(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && (r.flags & 256) === 0 || (r.flags |= 1024, Ma !== null && (Lu(Ma), Ma = null))), jn(n, r), Zn(r), null;
      case 5:
        Mc(r);
        var c = Su(ps.current);
        if (l = r.type, n !== null && r.stateNode != null) Gv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(N(166));
            return Zn(r), null;
          }
          if (n = Su(wi.current), Dc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ci] = r, o[ls] = d, n = (r.mode & 1) !== 0, l) {
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
                for (c = 0; c < rs.length; c++) Bt(rs[c], o);
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
                Vn(o, d), Bt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Bt("invalid", o);
                break;
              case "textarea":
                gr(o, d), Bt("invalid", o);
            }
            on(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var E = d[m];
              m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && Cc(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && Cc(
                o.textContent,
                E,
                n
              ), c = ["children", "" + E]) : tt.hasOwnProperty(m) && E != null && m === "onScroll" && Bt("scroll", o);
            }
            switch (l) {
              case "input":
                On(o), ci(o, d, !0);
                break;
              case "textarea":
                On(o), Ln(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = bl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Sr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ci] = r, n[ls] = o, Aa(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Kn(l, o), l) {
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
                  for (c = 0; c < rs.length; c++) Bt(rs[c], n);
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
                  Vn(n, o), c = nr(n, o), Bt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = ae({}, o, { value: void 0 }), Bt("invalid", n);
                  break;
                case "textarea":
                  gr(n, o), c = In(n, o), Bt("invalid", n);
                  break;
                default:
                  c = o;
              }
              on(l, c), E = c;
              for (d in E) if (E.hasOwnProperty(d)) {
                var T = E[d];
                d === "style" ? nn(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && fi(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && te(n, T) : typeof T == "number" && te(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (tt.hasOwnProperty(d) ? T != null && d === "onScroll" && Bt("scroll", n) : T != null && Ye(n, d, T, m));
              }
              switch (l) {
                case "input":
                  On(n), ci(n, o, !1);
                  break;
                case "textarea":
                  On(n), Ln(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + it(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? Rn(n, !!o.multiple, d, !1) : o.defaultValue != null && Rn(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = bl);
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
        return Zn(r), null;
      case 6:
        if (n && r.stateNode != null) qv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(N(166));
          if (l = Su(ps.current), Su(wi.current), Dc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ci] = r, (d = o.nodeValue !== l) && (n = Kr, n !== null)) switch (n.tag) {
              case 3:
                Cc(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Cc(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ci] = r, r.stateNode = o;
        }
        return Zn(r), null;
      case 13:
        if (un(gn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (dn && Xr !== null && (r.mode & 1) !== 0 && (r.flags & 128) === 0) ss(), Ll(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(N(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(N(317));
              d[Ci] = r;
            } else Ll(), (r.flags & 128) === 0 && (r.memoizedState = null), r.flags |= 4;
            Zn(r), d = !1;
          } else Ma !== null && (Lu(Ma), Ma = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return (r.flags & 128) !== 0 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, (r.mode & 1) !== 0 && (n === null || (gn.current & 1) !== 0 ? _n === 0 && (_n = 3) : Wd())), r.updateQueue !== null && (r.flags |= 4), Zn(r), null);
      case 4:
        return Eu(), jn(n, r), n === null && oo(r.stateNode.containerInfo), Zn(r), null;
      case 10:
        return Cd(r.type._context), Zn(r), null;
      case 17:
        return Nn(r.type) && vo(), Zn(r), null;
      case 19:
        if (un(gn), d = r.memoizedState, d === null) return Zn(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) ks(d, !1);
        else {
          if (_n !== 0 || n !== null && (n.flags & 128) !== 0) for (n = r.child; n !== null; ) {
            if (m = Nc(n), m !== null) {
              for (r.flags |= 128, ks(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return ke(gn, gn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && Xe() > To && (r.flags |= 128, o = !0, ks(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Nc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), ks(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !dn) return Zn(r), null;
          } else 2 * Xe() - d.renderingStartTime > To && l !== 1073741824 && (r.flags |= 128, o = !0, ks(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = Xe(), r.sibling = null, l = gn.current, ke(gn, o ? l & 1 | 2 : l & 1), r) : (Zn(r), null);
      case 22:
      case 23:
        return Qd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && (r.mode & 1) !== 0 ? (ya & 1073741824) !== 0 && (Zn(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Zn(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(N(156, r.tag));
  }
  function nf(n, r) {
    switch (kc(r), r.tag) {
      case 1:
        return Nn(r.type) && vo(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), un($n), un(En), Oe(), n = r.flags, (n & 65536) !== 0 && (n & 128) === 0 ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (un(gn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(N(340));
          Ll();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return un(gn), null;
      case 4:
        return Eu(), null;
      case 10:
        return Cd(r.type._context), null;
      case 22:
      case 23:
        return Qd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ds = !1, Tr = !1, fy = typeof WeakSet == "function" ? WeakSet : Set, he = null;
  function Eo(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      pn(n, r, o);
    }
    else l.current = null;
  }
  function rf(n, r, l) {
    try {
      l();
    } catch (o) {
      pn(n, r, o);
    }
  }
  var Xv = !1;
  function Jv(n, r) {
    if (is = _a, n = ts(), pc(n)) {
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
          var m = 0, E = -1, T = -1, U = 0, W = 0, q = n, $ = null;
          t: for (; ; ) {
            for (var fe; q !== l || c !== 0 && q.nodeType !== 3 || (E = m + c), q !== d || o !== 0 && q.nodeType !== 3 || (T = m + o), q.nodeType === 3 && (m += q.nodeValue.length), (fe = q.firstChild) !== null; )
              $ = q, q = fe;
            for (; ; ) {
              if (q === n) break t;
              if ($ === l && ++U === c && (E = m), $ === d && ++W === o && (T = m), (fe = q.nextSibling) !== null) break;
              q = $, $ = q.parentNode;
            }
            q = fe;
          }
          l = E === -1 || T === -1 ? null : { start: E, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, _a = !1, he = r; he !== null; ) if (r = he, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, he = n;
    else for (; he !== null; ) {
      r = he;
      try {
        var Se = r.alternate;
        if ((r.flags & 1024) !== 0) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Se !== null) {
              var Re = Se.memoizedProps, kn = Se.memoizedState, k = r.stateNode, b = k.getSnapshotBeforeUpdate(r.elementType === r.type ? Re : ai(r.type, Re), kn);
              k.__reactInternalSnapshotBeforeUpdate = b;
            }
            break;
          case 3:
            var L = r.stateNode.containerInfo;
            L.nodeType === 1 ? L.textContent = "" : L.nodeType === 9 && L.documentElement && L.removeChild(L.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(N(163));
        }
      } catch (G) {
        pn(r, r.return, G);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, he = n;
        break;
      }
      he = r.return;
    }
    return Se = Xv, Xv = !1, Se;
  }
  function Os(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && rf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Ls(n, r) {
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
  function Hd(n) {
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
  function af(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, af(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[ls], delete r[us], delete r[po], delete r[sy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ms(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Ji(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ms(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function ki(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = bl));
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var wn = null, Nr = !1;
  function zr(n, r, l) {
    for (l = l.child; l !== null; ) Zv(n, r, l), l = l.sibling;
  }
  function Zv(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function") try {
      Qr.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Tr || Eo(l, r);
      case 6:
        var o = wn, c = Nr;
        wn = null, zr(n, r, l), wn = o, Nr = c, wn !== null && (Nr ? (n = wn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : wn.removeChild(l.stateNode));
        break;
      case 18:
        wn !== null && (Nr ? (n = wn, l = l.stateNode, n.nodeType === 8 ? fo(n.parentNode, l) : n.nodeType === 1 && fo(n, l), Za(n)) : fo(wn, l.stateNode));
        break;
      case 4:
        o = wn, c = Nr, wn = l.stateNode.containerInfo, Nr = !0, zr(n, r, l), wn = o, Nr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Tr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && rf(l, r, m), c = c.next;
          } while (c !== o);
        }
        zr(n, r, l);
        break;
      case 1:
        if (!Tr && (Eo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (E) {
          pn(l, r, E);
        }
        zr(n, r, l);
        break;
      case 21:
        zr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Tr = (o = Tr) || l.memoizedState !== null, zr(n, r, l), Tr = o) : zr(n, r, l);
        break;
      default:
        zr(n, r, l);
    }
  }
  function eh(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new fy()), r.forEach(function(o) {
        var c = sh.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ii(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, E = m;
        e: for (; E !== null; ) {
          switch (E.tag) {
            case 5:
              wn = E.stateNode, Nr = !1;
              break e;
            case 3:
              wn = E.stateNode.containerInfo, Nr = !0;
              break e;
            case 4:
              wn = E.stateNode.containerInfo, Nr = !0;
              break e;
          }
          E = E.return;
        }
        if (wn === null) throw Error(N(160));
        Zv(d, m, c), wn = null, Nr = !1;
        var T = c.alternate;
        T !== null && (T.return = null), c.return = null;
      } catch (U) {
        pn(c, r, U);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Pd(r, n), r = r.sibling;
  }
  function Pd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Os(3, n, n.return), Ls(3, n);
          } catch (Re) {
            pn(n, n.return, Re);
          }
          try {
            Os(5, n, n.return);
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        break;
      case 1:
        ii(r, n), ta(n), o & 512 && l !== null && Eo(l, l.return);
        break;
      case 5:
        if (ii(r, n), ta(n), o & 512 && l !== null && Eo(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            te(c, "");
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            E === "input" && d.type === "radio" && d.name != null && Bn(c, d), Kn(E, m);
            var U = Kn(E, d);
            for (m = 0; m < T.length; m += 2) {
              var W = T[m], q = T[m + 1];
              W === "style" ? nn(c, q) : W === "dangerouslySetInnerHTML" ? fi(c, q) : W === "children" ? te(c, q) : Ye(c, W, q, U);
            }
            switch (E) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var $ = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var fe = d.value;
                fe != null ? Rn(c, !!d.multiple, fe, !1) : $ !== !!d.multiple && (d.defaultValue != null ? Rn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Rn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[ls] = d;
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(N(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Re) {
            pn(n, n.return, Re);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Za(r.containerInfo);
        } catch (Re) {
          pn(n, n.return, Re);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Id = Xe())), o & 4 && eh(n);
        break;
      case 22:
        if (W = l !== null && l.memoizedState !== null, n.mode & 1 ? (Tr = (U = Tr) || W, ii(r, n), Tr = U) : ii(r, n), ta(n), o & 8192) {
          if (U = n.memoizedState !== null, (n.stateNode.isHidden = U) && !W && (n.mode & 1) !== 0) for (he = n, W = n.child; W !== null; ) {
            for (q = he = W; he !== null; ) {
              switch ($ = he, fe = $.child, $.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, $, $.return);
                  break;
                case 1:
                  Eo($, $.return);
                  var Se = $.stateNode;
                  if (typeof Se.componentWillUnmount == "function") {
                    o = $, l = $.return;
                    try {
                      r = o, Se.props = r.memoizedProps, Se.state = r.memoizedState, Se.componentWillUnmount();
                    } catch (Re) {
                      pn(o, l, Re);
                    }
                  }
                  break;
                case 5:
                  Eo($, $.return);
                  break;
                case 22:
                  if ($.memoizedState !== null) {
                    Ns(q);
                    continue;
                  }
              }
              fe !== null ? (fe.return = $, he = fe) : Ns(q);
            }
            W = W.sibling;
          }
          e: for (W = null, q = n; ; ) {
            if (q.tag === 5) {
              if (W === null) {
                W = q;
                try {
                  c = q.stateNode, U ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = q.stateNode, T = q.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, E.style.display = Vt("display", m));
                } catch (Re) {
                  pn(n, n.return, Re);
                }
              }
            } else if (q.tag === 6) {
              if (W === null) try {
                q.stateNode.nodeValue = U ? "" : q.memoizedProps;
              } catch (Re) {
                pn(n, n.return, Re);
              }
            } else if ((q.tag !== 22 && q.tag !== 23 || q.memoizedState === null || q === n) && q.child !== null) {
              q.child.return = q, q = q.child;
              continue;
            }
            if (q === n) break e;
            for (; q.sibling === null; ) {
              if (q.return === null || q.return === n) break e;
              W === q && (W = null), q = q.return;
            }
            W === q && (W = null), q.sibling.return = q.return, q = q.sibling;
          }
        }
        break;
      case 19:
        ii(r, n), ta(n), o & 4 && eh(n);
        break;
      case 21:
        break;
      default:
        ii(
          r,
          n
        ), ta(n);
    }
  }
  function ta(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Ms(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(N(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (te(c, ""), o.flags &= -33);
            var d = Ji(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Ji(n);
            ki(n, E, m);
            break;
          default:
            throw Error(N(161));
        }
      } catch (T) {
        pn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function dy(n, r, l) {
    he = n, Vd(n);
  }
  function Vd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; he !== null; ) {
      var c = he, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Ds;
        if (!m) {
          var E = c.alternate, T = E !== null && E.memoizedState !== null || Tr;
          E = Ds;
          var U = Tr;
          if (Ds = m, (Tr = T) && !U) for (he = c; he !== null; ) m = he, T = m.child, m.tag === 22 && m.memoizedState !== null ? Bd(c) : T !== null ? (T.return = m, he = T) : Bd(c);
          for (; d !== null; ) he = d, Vd(d), d = d.sibling;
          he = c, Ds = E, Tr = U;
        }
        th(n);
      } else (c.subtreeFlags & 8772) !== 0 && d !== null ? (d.return = c, he = d) : th(n);
    }
  }
  function th(n) {
    for (; he !== null; ) {
      var r = he;
      if ((r.flags & 8772) !== 0) {
        var l = r.alternate;
        try {
          if ((r.flags & 8772) !== 0) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Tr || Ls(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !Tr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && wd(r, d, o);
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
                wd(r, m, l);
              }
              break;
            case 5:
              var E = r.stateNode;
              if (l === null && r.flags & 4) {
                l = E;
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
                var U = r.alternate;
                if (U !== null) {
                  var W = U.memoizedState;
                  if (W !== null) {
                    var q = W.dehydrated;
                    q !== null && Za(q);
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
              throw Error(N(163));
          }
          Tr || r.flags & 512 && Hd(r);
        } catch ($) {
          pn(r, r.return, $);
        }
      }
      if (r === n) {
        he = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, he = l;
        break;
      }
      he = r.return;
    }
  }
  function Ns(n) {
    for (; he !== null; ) {
      var r = he;
      if (r === n) {
        he = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, he = l;
        break;
      }
      he = r.return;
    }
  }
  function Bd(n) {
    for (; he !== null; ) {
      var r = he;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (T) {
              pn(r, l, T);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (T) {
                pn(r, c, T);
              }
            }
            var d = r.return;
            try {
              Hd(r);
            } catch (T) {
              pn(r, d, T);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Hd(r);
            } catch (T) {
              pn(r, m, T);
            }
        }
      } catch (T) {
        pn(r, r.return, T);
      }
      if (r === n) {
        he = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, he = E;
        break;
      }
      he = r.return;
    }
  }
  var py = Math.ceil, Al = vt.ReactCurrentDispatcher, Du = vt.ReactCurrentOwner, or = vt.ReactCurrentBatchConfig, Tt = 0, Wn = null, Fn = null, sr = 0, ya = 0, Co = Oa(0), _n = 0, zs = null, Oi = 0, Ro = 0, lf = 0, Us = null, na = null, Id = 0, To = 1 / 0, ga = null, xo = !1, Ou = null, jl = null, uf = !1, Zi = null, As = 0, Fl = 0, bo = null, js = -1, xr = 0;
  function Hn() {
    return (Tt & 6) !== 0 ? Xe() : js !== -1 ? js : js = Xe();
  }
  function Li(n) {
    return (n.mode & 1) === 0 ? 1 : (Tt & 2) !== 0 && sr !== 0 ? sr & -sr : cy.transition !== null ? (xr === 0 && (xr = Ku()), xr) : (n = zt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ro(n.type)), n);
  }
  function Ur(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, bo = null, Error(N(185));
    Pi(n, l, o), ((Tt & 2) === 0 || n !== Wn) && (n === Wn && ((Tt & 2) === 0 && (Ro |= l), _n === 4 && li(n, sr)), ra(n, o), l === 1 && Tt === 0 && (r.mode & 1) === 0 && (To = Xe() + 500, ho && Ti()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Ja(n, n === Wn ? sr : 0);
    if (o === 0) l !== null && ar(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ar(l), r === 1) n.tag === 0 ? _l(Yd.bind(null, n)) : wc(Yd.bind(null, n)), co(function() {
        (Tt & 6) === 0 && Ti();
      }), l = null;
      else {
        switch (Ju(o)) {
          case 1:
            l = Ka;
            break;
          case 4:
            l = nu;
            break;
          case 16:
            l = ru;
            break;
          case 536870912:
            l = Wu;
            break;
          default:
            l = ru;
        }
        l = fh(l, of.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function of(n, r) {
    if (js = -1, xr = 0, (Tt & 6) !== 0) throw Error(N(327));
    var l = n.callbackNode;
    if (wo() && n.callbackNode !== l) return null;
    var o = Ja(n, n === Wn ? sr : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & n.expiredLanes) !== 0 || r) r = sf(n, o);
    else {
      r = o;
      var c = Tt;
      Tt |= 2;
      var d = rh();
      (Wn !== n || sr !== r) && (ga = null, To = Xe() + 500, el(n, r));
      do
        try {
          ah();
          break;
        } catch (E) {
          nh(n, E);
        }
      while (!0);
      Ed(), Al.current = d, Tt = c, Fn !== null ? r = 0 : (Wn = null, sr = 0, r = _n);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Fs(n, c))), r === 1) throw l = zs, el(n, 0), li(n, o), ra(n, Xe()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, (o & 30) === 0 && !vy(c) && (r = sf(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Fs(n, d))), r === 1)) throw l = zs, el(n, 0), li(n, o), ra(n, Xe()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(N(345));
          case 2:
            Nu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Id + 500 - Xe(), 10 < r)) {
              if (Ja(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Hn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Tc(Nu.bind(null, n, na, ga), r);
              break;
            }
            Nu(n, na, ga);
            break;
          case 4:
            if (li(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - Dr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = Xe() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * py(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Tc(Nu.bind(null, n, na, ga), o);
              break;
            }
            Nu(n, na, ga);
            break;
          case 5:
            Nu(n, na, ga);
            break;
          default:
            throw Error(N(329));
        }
      }
    }
    return ra(n, Xe()), n.callbackNode === l ? of.bind(null, n) : null;
  }
  function Fs(n, r) {
    var l = Us;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = sf(n, r), n !== 2 && (r = na, na = l, r !== null && Lu(r)), n;
  }
  function Lu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function vy(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var o = 0; o < l.length; o++) {
          var c = l[o], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ti(d(), c)) return !1;
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
  function li(n, r) {
    for (r &= ~lf, r &= ~Ro, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Dr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Yd(n) {
    if ((Tt & 6) !== 0) throw Error(N(327));
    wo();
    var r = Ja(n, 0);
    if ((r & 1) === 0) return ra(n, Xe()), null;
    var l = sf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Fs(n, o));
    }
    if (l === 1) throw l = zs, el(n, 0), li(n, r), ra(n, Xe()), l;
    if (l === 6) throw Error(N(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Nu(n, na, ga), ra(n, Xe()), null;
  }
  function $d(n, r) {
    var l = Tt;
    Tt |= 1;
    try {
      return n(r);
    } finally {
      Tt = l, Tt === 0 && (To = Xe() + 500, ho && Ti());
    }
  }
  function Mu(n) {
    Zi !== null && Zi.tag === 0 && (Tt & 6) === 0 && wo();
    var r = Tt;
    Tt |= 1;
    var l = or.transition, o = zt;
    try {
      if (or.transition = null, zt = 1, n) return n();
    } finally {
      zt = o, or.transition = l, Tt = r, (Tt & 6) === 0 && Ti();
    }
  }
  function Qd() {
    ya = Co.current, un(Co);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, hd(l)), Fn !== null) for (l = Fn.return; l !== null; ) {
      var o = l;
      switch (kc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && vo();
          break;
        case 3:
          Eu(), un($n), un(En), Oe();
          break;
        case 5:
          Mc(o);
          break;
        case 4:
          Eu();
          break;
        case 13:
          un(gn);
          break;
        case 19:
          un(gn);
          break;
        case 10:
          Cd(o.type._context);
          break;
        case 22:
        case 23:
          Qd();
      }
      l = l.return;
    }
    if (Wn = n, Fn = n = Hl(n.current, null), sr = ya = r, _n = 0, zs = null, lf = Ro = Oi = 0, na = Us = null, gu !== null) {
      for (r = 0; r < gu.length; r++) if (l = gu[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var m = d.next;
          d.next = c, o.next = m;
        }
        l.pending = o;
      }
      gu = null;
    }
    return n;
  }
  function nh(n, r) {
    do {
      var l = Fn;
      try {
        if (Ed(), pt.current = wu, zc) {
          for (var o = At.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          zc = !1;
        }
        if (Xt = 0, Jn = Un = At = null, hs = !1, Cu = 0, Du.current = null, l === null || l.return === null) {
          _n = 1, zs = r, Fn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, T = r;
          if (r = sr, E.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var U = T, W = E, q = W.tag;
            if ((W.mode & 1) === 0 && (q === 0 || q === 11 || q === 15)) {
              var $ = W.alternate;
              $ ? (W.updateQueue = $.updateQueue, W.memoizedState = $.memoizedState, W.lanes = $.lanes) : (W.updateQueue = null, W.memoizedState = null);
            }
            var fe = Iv(m);
            if (fe !== null) {
              fe.flags &= -257, Ul(fe, m, E, d, r), fe.mode & 1 && zd(d, U, r), r = fe, T = U;
              var Se = r.updateQueue;
              if (Se === null) {
                var Re = /* @__PURE__ */ new Set();
                Re.add(T), r.updateQueue = Re;
              } else Se.add(T);
              break e;
            } else {
              if ((r & 1) === 0) {
                zd(d, U, r), Wd();
                break e;
              }
              T = Error(N(426));
            }
          } else if (dn && E.mode & 1) {
            var kn = Iv(m);
            if (kn !== null) {
              (kn.flags & 65536) === 0 && (kn.flags |= 256), Ul(kn, m, E, d, r), qi(_u(T, E));
              break e;
            }
          }
          d = T = _u(T, E), _n !== 4 && (_n = 2), Us === null ? Us = [d] : Us.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var k = Bv(d, T, r);
                jv(d, k);
                break e;
              case 1:
                E = T;
                var b = d.type, L = d.stateNode;
                if ((d.flags & 128) === 0 && (typeof b.getDerivedStateFromError == "function" || L !== null && typeof L.componentDidCatch == "function" && (jl === null || !jl.has(L)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var G = Nd(d, E, r);
                  jv(d, G);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        lh(l);
      } catch (Ee) {
        r = Ee, Fn === l && l !== null && (Fn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function rh() {
    var n = Al.current;
    return Al.current = wu, n === null ? wu : n;
  }
  function Wd() {
    (_n === 0 || _n === 3 || _n === 2) && (_n = 4), Wn === null || (Oi & 268435455) === 0 && (Ro & 268435455) === 0 || li(Wn, sr);
  }
  function sf(n, r) {
    var l = Tt;
    Tt |= 2;
    var o = rh();
    (Wn !== n || sr !== r) && (ga = null, el(n, r));
    do
      try {
        hy();
        break;
      } catch (c) {
        nh(n, c);
      }
    while (!0);
    if (Ed(), Tt = l, Al.current = o, Fn !== null) throw Error(N(261));
    return Wn = null, sr = 0, _n;
  }
  function hy() {
    for (; Fn !== null; ) ih(Fn);
  }
  function ah() {
    for (; Fn !== null && !Ga(); ) ih(Fn);
  }
  function ih(n) {
    var r = ch(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? lh(n) : Fn = r, Du.current = null;
  }
  function lh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, (r.flags & 32768) === 0) {
        if (l = Kv(l, r, ya), l !== null) {
          Fn = l;
          return;
        }
      } else {
        if (l = nf(l, r), l !== null) {
          l.flags &= 32767, Fn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          _n = 6, Fn = null;
          return;
        }
      }
      if (r = r.sibling, r !== null) {
        Fn = r;
        return;
      }
      Fn = r = n;
    } while (r !== null);
    _n === 0 && (_n = 5);
  }
  function Nu(n, r, l) {
    var o = zt, c = or.transition;
    try {
      or.transition = null, zt = 1, my(n, r, l, o);
    } finally {
      or.transition = c, zt = o;
    }
    return null;
  }
  function my(n, r, l, o) {
    do
      wo();
    while (Zi !== null);
    if ((Tt & 6) !== 0) throw Error(N(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(N(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Gf(n, d), n === Wn && (Fn = Wn = null, sr = 0), (l.subtreeFlags & 2064) === 0 && (l.flags & 2064) === 0 || uf || (uf = !0, fh(ru, function() {
      return wo(), null;
    })), d = (l.flags & 15990) !== 0, (l.subtreeFlags & 15990) !== 0 || d) {
      d = or.transition, or.transition = null;
      var m = zt;
      zt = 1;
      var E = Tt;
      Tt |= 4, Du.current = null, Jv(n, l), Pd(l, n), lo(pu), _a = !!is, pu = is = null, n.current = l, dy(l), qa(), Tt = E, zt = m, or.transition = d;
    } else n.current = l;
    if (uf && (uf = !1, Zi = n, As = c), d = n.pendingLanes, d === 0 && (jl = null), $o(l.stateNode), ra(n, Xe()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (xo) throw xo = !1, n = Ou, Ou = null, n;
    return (As & 1) !== 0 && n.tag !== 0 && wo(), d = n.pendingLanes, (d & 1) !== 0 ? n === bo ? Fl++ : (Fl = 0, bo = n) : Fl = 0, Ti(), null;
  }
  function wo() {
    if (Zi !== null) {
      var n = Ju(As), r = or.transition, l = zt;
      try {
        if (or.transition = null, zt = 16 > n ? 16 : n, Zi === null) var o = !1;
        else {
          if (n = Zi, Zi = null, As = 0, (Tt & 6) !== 0) throw Error(N(331));
          var c = Tt;
          for (Tt |= 4, he = n.current; he !== null; ) {
            var d = he, m = d.child;
            if ((he.flags & 16) !== 0) {
              var E = d.deletions;
              if (E !== null) {
                for (var T = 0; T < E.length; T++) {
                  var U = E[T];
                  for (he = U; he !== null; ) {
                    var W = he;
                    switch (W.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, W, d);
                    }
                    var q = W.child;
                    if (q !== null) q.return = W, he = q;
                    else for (; he !== null; ) {
                      W = he;
                      var $ = W.sibling, fe = W.return;
                      if (af(W), W === U) {
                        he = null;
                        break;
                      }
                      if ($ !== null) {
                        $.return = fe, he = $;
                        break;
                      }
                      he = fe;
                    }
                  }
                }
                var Se = d.alternate;
                if (Se !== null) {
                  var Re = Se.child;
                  if (Re !== null) {
                    Se.child = null;
                    do {
                      var kn = Re.sibling;
                      Re.sibling = null, Re = kn;
                    } while (Re !== null);
                  }
                }
                he = d;
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && m !== null) m.return = d, he = m;
            else e: for (; he !== null; ) {
              if (d = he, (d.flags & 2048) !== 0) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var k = d.sibling;
              if (k !== null) {
                k.return = d.return, he = k;
                break e;
              }
              he = d.return;
            }
          }
          var b = n.current;
          for (he = b; he !== null; ) {
            m = he;
            var L = m.child;
            if ((m.subtreeFlags & 2064) !== 0 && L !== null) L.return = m, he = L;
            else e: for (m = b; he !== null; ) {
              if (E = he, (E.flags & 2048) !== 0) try {
                switch (E.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, E);
                }
              } catch (Ee) {
                pn(E, E.return, Ee);
              }
              if (E === m) {
                he = null;
                break e;
              }
              var G = E.sibling;
              if (G !== null) {
                G.return = E.return, he = G;
                break e;
              }
              he = E.return;
            }
          }
          if (Tt = c, Ti(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        zt = l, or.transition = r;
      }
    }
    return !1;
  }
  function uh(n, r, l) {
    r = _u(l, r), r = Bv(n, r, 1), n = Ml(n, r, 1), r = Hn(), n !== null && (Pi(n, 1, r), ra(n, r));
  }
  function pn(n, r, l) {
    if (n.tag === 3) uh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        uh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (jl === null || !jl.has(o))) {
          n = _u(l, n), n = Nd(r, n, 1), r = Ml(r, n, 1), n = Hn(), r !== null && (Pi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function yy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Hn(), n.pingedLanes |= n.suspendedLanes & l, Wn === n && (sr & l) === l && (_n === 4 || _n === 3 && (sr & 130023424) === sr && 500 > Xe() - Id ? el(n, 0) : lf |= l), ra(n, r);
  }
  function oh(n, r) {
    r === 0 && ((n.mode & 1) === 0 ? r = 1 : (r = da, da <<= 1, (da & 130023424) === 0 && (da = 4194304)));
    var l = Hn();
    n = ha(n, r), n !== null && (Pi(n, r, l), ra(n, l));
  }
  function gy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), oh(n, l);
  }
  function sh(n, r) {
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
        throw Error(N(314));
    }
    o !== null && o.delete(r), oh(n, l);
  }
  var ch;
  ch = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || $n.current) An = !0;
    else {
      if ((n.lanes & l) === 0 && (r.flags & 128) === 0) return An = !1, _s(n, r, l);
      An = (n.flags & 131072) !== 0;
    }
    else An = !1, dn && (r.flags & 1048576) !== 0 && Nv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        za(n, r), n = r.pendingProps;
        var c = qr(r, En.current);
        yn(r, l), c = Nl(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Nn(o) ? (d = !0, Xn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, bd(r), c.updater = Xc, r.stateNode = c, c._reactInternals = r, Rs(r, o, n, l), r = bs(null, r, o, !0, d, l)) : (r.tag = 0, dn && d && _c(r), ur(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (za(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Ey(o), n = ai(o, n), c) {
            case 0:
              r = Yv(null, r, o, n, l);
              break e;
            case 1:
              r = $v(null, r, o, n, l);
              break e;
            case 11:
              r = ea(null, r, o, n, l);
              break e;
            case 14:
              r = ku(null, r, o, ai(o.type, n), l);
              break e;
          }
          throw Error(N(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Yv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), $v(n, r, o, c, l);
      case 3:
        e: {
          if (So(r), n === null) throw Error(N(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Av(n, r), cs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(N(423)), r), r = Qv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(N(424)), r), r = Qv(n, r, o, l, c);
            break e;
          } else for (Xr = Ei(r.stateNode.containerInfo.firstChild), Kr = r, dn = !0, Ma = null, l = ue(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ll(), o === c) {
              r = Ua(n, r, l);
              break e;
            }
            ur(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Fv(r), n === null && gd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Rc(o, c) ? m = null : d !== null && Rc(o, d) && (r.flags |= 32), Ud(n, r), ur(n, r, m, l), r.child;
      case 6:
        return n === null && gd(r), null;
      case 13:
        return tf(n, r, l);
      case 4:
        return _d(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = xn(r, null, o, l) : ur(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ea(n, r, o, c, l);
      case 7:
        return ur(n, r, r.pendingProps, l), r.child;
      case 8:
        return ur(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return ur(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, ke(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !$n.current) {
              r = Ua(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var E = d.dependencies;
            if (E !== null) {
              m = d.child;
              for (var T = E.firstContext; T !== null; ) {
                if (T.context === o) {
                  if (d.tag === 1) {
                    T = Ki(-1, l & -l), T.tag = 2;
                    var U = d.updateQueue;
                    if (U !== null) {
                      U = U.shared;
                      var W = U.pending;
                      W === null ? T.next = T : (T.next = W.next, W.next = T), U.pending = T;
                    }
                  }
                  d.lanes |= l, T = d.alternate, T !== null && (T.lanes |= l), Rd(
                    d.return,
                    l,
                    r
                  ), E.lanes |= l;
                  break;
                }
                T = T.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(N(341));
              m.lanes |= l, E = m.alternate, E !== null && (E.lanes |= l), Rd(m, l, r), m = d.sibling;
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
          ur(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, yn(r, l), c = Na(c), o = o(c), r.flags |= 1, ur(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), ku(n, r, o, c, l);
      case 15:
        return Je(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), za(n, r), r.tag = 1, Nn(o) ? (n = !0, Xn(r)) : n = !1, yn(r, l), Jc(r, o, c), Rs(r, o, c, l), bs(null, r, o, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return xs(n, r, l);
    }
    throw Error(N(156, r.tag));
  };
  function fh(n, r) {
    return sn(n, r);
  }
  function Sy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ja(n, r, l, o) {
    return new Sy(n, r, l, o);
  }
  function Gd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ey(n) {
    if (typeof n == "function") return Gd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Ge) return 11;
      if (n === Lt) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = ja(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Hs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") Gd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case ge:
        return tl(l.children, c, d, r);
      case Ot:
        m = 8, c |= 8;
        break;
      case St:
        return n = ja(12, l, r, c | 2), n.elementType = St, n.lanes = d, n;
      case _e:
        return n = ja(13, l, r, c), n.elementType = _e, n.lanes = d, n;
      case Pt:
        return n = ja(19, l, r, c), n.elementType = Pt, n.lanes = d, n;
      case Te:
        return Pl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case st:
            m = 10;
            break e;
          case ht:
            m = 9;
            break e;
          case Ge:
            m = 11;
            break e;
          case Lt:
            m = 14;
            break e;
          case Nt:
            m = 16, o = null;
            break e;
        }
        throw Error(N(130, n == null ? n : typeof n, ""));
    }
    return r = ja(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = ja(7, n, o, r), n.lanes = l, n;
  }
  function Pl(n, r, l, o) {
    return n = ja(22, n, o, r), n.elementType = Te, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function qd(n, r, l) {
    return n = ja(6, n, null, r), n.lanes = l, n;
  }
  function cf(n, r, l) {
    return r = ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function dh(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Xu(0), this.expirationTimes = Xu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xu(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ff(n, r, l, o, c, d, m, E, T) {
    return n = new dh(n, r, l, E, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = ja(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, bd(d), n;
  }
  function Cy(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Ae, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Kd(n) {
    if (!n) return Cr;
    n = n._reactInternals;
    e: {
      if (Ke(n) !== n || n.tag !== 1) throw Error(N(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Nn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(N(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (Nn(l)) return os(n, l, r);
    }
    return r;
  }
  function ph(n, r, l, o, c, d, m, E, T) {
    return n = ff(l, o, !0, n, c, d, m, E, T), n.context = Kd(null), l = n.current, o = Hn(), c = Li(l), d = Ki(o, c), d.callback = r ?? null, Ml(l, d, c), n.current.lanes = c, Pi(n, c, o), ra(n, o), n;
  }
  function df(n, r, l, o) {
    var c = r.current, d = Hn(), m = Li(c);
    return l = Kd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ml(c, r, m), n !== null && (Ur(n, c, m, d), Lc(n, c, m)), m;
  }
  function pf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Xd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function vf(n, r) {
    Xd(n, r), (n = n.alternate) && Xd(n, r);
  }
  function vh() {
    return null;
  }
  var zu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Jd(n) {
    this._internalRoot = n;
  }
  hf.prototype.render = Jd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(N(409));
    df(n, r, null, null);
  }, hf.prototype.unmount = Jd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Mu(function() {
        df(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function hf(n) {
    this._internalRoot = n;
  }
  hf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = $e();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < Yn.length && r !== 0 && r < Yn[l].priority; l++) ;
      Yn.splice(l, 0, n), l === 0 && Go(n);
    }
  };
  function Zd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function mf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function hh() {
  }
  function Ry(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var U = pf(m);
          d.call(U);
        };
      }
      var m = ph(r, o, n, 0, null, !1, !1, "", hh);
      return n._reactRootContainer = m, n[Qi] = m.current, oo(n.nodeType === 8 ? n.parentNode : n), Mu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var E = o;
      o = function() {
        var U = pf(T);
        E.call(U);
      };
    }
    var T = ff(n, 0, !1, null, null, !1, !1, "", hh);
    return n._reactRootContainer = T, n[Qi] = T.current, oo(n.nodeType === 8 ? n.parentNode : n), Mu(function() {
      df(r, T, l, o);
    }), T;
  }
  function Ps(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var E = c;
        c = function() {
          var T = pf(m);
          E.call(T);
        };
      }
      df(r, m, n, c);
    } else m = Ry(l, r, n, c, o);
    return pf(m);
  }
  _t = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, Xe()), (Tt & 6) === 0 && (To = Xe() + 500, Ti()));
        }
        break;
      case 13:
        Mu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Hn();
            Ur(o, n, 1, c);
          }
        }), vf(n, 1);
    }
  }, Qo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Hn();
        Ur(r, n, 134217728, l);
      }
      vf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Li(n), l = ha(n, r);
      if (l !== null) {
        var o = Hn();
        Ur(l, n, r, o);
      }
      vf(n, r);
    }
  }, $e = function() {
    return zt;
  }, Zu = function(n, r) {
    var l = zt;
    try {
      return zt = n, r();
    } finally {
      zt = l;
    }
  }, Wt = function(n, r, l) {
    switch (r) {
      case "input":
        if ($r(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = mn(o);
              if (!c) throw Error(N(90));
              wr(o), $r(o, c);
            }
          }
        }
        break;
      case "textarea":
        $a(n, l);
        break;
      case "select":
        r = l.value, r != null && Rn(n, !!l.multiple, r, !1);
    }
  }, eu = $d, pl = Mu;
  var Ty = { usingClientEntryPoint: !1, Events: [De, ni, mn, Hi, Zl, $d] }, Vs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, mh = { bundleType: Vs.bundleType, version: Vs.version, rendererPackageName: Vs.rendererPackageName, rendererConfig: Vs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: vt.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Tn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Vs.findFiberByHostInstance || vh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(mh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ty, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Zd(r)) throw Error(N(200));
    return Cy(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!Zd(n)) throw Error(N(299));
    var l = !1, o = "", c = zu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ff(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, oo(n.nodeType === 8 ? n.parentNode : n), new Jd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(N(188)) : (n = Object.keys(n).join(","), Error(N(268, n)));
    return n = Tn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Mu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!mf(r)) throw Error(N(200));
    return Ps(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!Zd(n)) throw Error(N(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = zu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = ph(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, oo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new hf(r);
  }, Ia.render = function(n, r, l) {
    if (!mf(r)) throw Error(N(200));
    return Ps(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!mf(n)) throw Error(N(40));
    return n._reactRootContainer ? (Mu(function() {
      Ps(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = $d, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!mf(l)) throw Error(N(200));
    if (n == null || n._reactInternals === void 0) throw Error(N(38));
    return Ps(n, r, l, !1, o);
  }, Ia.version = "18.3.1-next-f1338f8080-20240426", Ia;
}
var Ya = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uT;
function sk() {
  return uT || (uT = 1, process.env.NODE_ENV !== "production" && (function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var Q = nv(), I = fT(), N = Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, wt = !1;
    function tt(e) {
      wt = e;
    }
    function gt(e) {
      if (!wt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Dt("warn", e, a);
      }
    }
    function S(e) {
      if (!wt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Dt("error", e, a);
      }
    }
    function Dt(e, t, a) {
      {
        var i = N.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var ce = 0, pe = 1, Pe = 2, Z = 3, ye = 4, re = 5, Fe = 6, nt = 7, rt = 8, tn = 9, ot = 10, Ye = 11, vt = 12, ee = 13, Ae = 14, ge = 15, Ot = 16, St = 17, st = 18, ht = 19, Ge = 21, _e = 22, Pt = 23, Lt = 24, Nt = 25, Te = !0, J = !1, xe = !1, ae = !1, _ = !1, P = !0, Ve = !0, je = !0, ct = !0, at = /* @__PURE__ */ new Set(), Ze = {}, it = {};
    function ft(e, t) {
      Yt(e, t), Yt(e + "Capture", t);
    }
    function Yt(e, t) {
      Ze[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Ze[e] = t;
      {
        var a = e.toLowerCase();
        it[a] = e, e === "onDoubleClick" && (it.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        at.add(t[i]);
    }
    var On = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", wr = Object.prototype.hasOwnProperty;
    function Cn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function nr(e) {
      try {
        return Vn(e), !1;
      } catch {
        return !0;
      }
    }
    function Vn(e) {
      return "" + e;
    }
    function Bn(e, t) {
      if (nr(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Cn(e)), Vn(e);
    }
    function $r(e) {
      if (nr(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Cn(e)), Vn(e);
    }
    function ci(e, t) {
      if (nr(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Cn(e)), Vn(e);
    }
    function sa(e, t) {
      if (nr(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Cn(e)), Vn(e);
    }
    function qn(e) {
      if (nr(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Cn(e)), Vn(e);
    }
    function Rn(e) {
      if (nr(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Cn(e)), Vn(e);
    }
    var In = 0, gr = 1, $a = 2, Ln = 3, Sr = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", te = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", be = new RegExp("^[" + fi + "][" + te + "]*$"), lt = {}, Vt = {};
    function nn(e) {
      return wr.call(Vt, e) ? !0 : wr.call(lt, e) ? !1 : be.test(e) ? (Vt[e] = !0, !0) : (lt[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function vn(e, t, a) {
      return t !== null ? t.type === In : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function on(e, t, a, i) {
      if (a !== null && a.type === In)
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
    function Kn(e, t, a, i) {
      if (t === null || typeof t > "u" || on(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Ln:
            return !t;
          case Sr:
            return t === !1;
          case ca:
            return isNaN(t);
          case Qa:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function rn(e) {
      return Wt.hasOwnProperty(e) ? Wt[e] : null;
    }
    function Qt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === Ln || t === Sr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Wt = {}, fa = [
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
    fa.forEach(function(e) {
      Wt[e] = new Qt(
        e,
        In,
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
        gr,
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
        $a,
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
        $a,
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
        Ln,
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
        Ln,
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
        Sr,
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
        Qa,
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
        ca,
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
    var Er = /[\-\:]([a-z])/g, xa = function(e) {
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
      var t = e.replace(Er, xa);
      Wt[t] = new Qt(
        t,
        gr,
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
      var t = e.replace(Er, xa);
      Wt[t] = new Qt(
        t,
        gr,
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
      var t = e.replace(Er, xa);
      Wt[t] = new Qt(
        t,
        gr,
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
        gr,
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
    var Hi = "xlinkHref";
    Wt[Hi] = new Qt(
      "xlinkHref",
      gr,
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
        gr,
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
    var Zl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, eu = !1;
    function pl(e) {
      !eu && Zl.test(e) && (eu = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function vl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        Bn(a, t), i.sanitizeURL && pl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Sr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Kn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Kn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Ln)
            return a;
          f = e.getAttribute(s);
        }
        return Kn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function tu(e, t, a, i) {
      {
        if (!nn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return Bn(a, t), u === "" + a ? a : u;
      }
    }
    function _r(e, t, a, i) {
      var u = rn(t);
      if (!vn(t, u, i)) {
        if (Kn(t, a, u, i) && (a = null), i || u === null) {
          if (nn(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (Bn(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === Ln ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, g = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var w = u.type, x;
          w === Ln || w === Sr && a === !0 ? x = "" : (Bn(a, y), x = "" + a, u.sanitizeURL && pl(x.toString())), g ? e.setAttributeNS(g, y, x) : e.setAttribute(y, x);
        }
      }
    }
    var kr = Symbol.for("react.element"), rr = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), R = Symbol.for("react.context"), B = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), me = Symbol.for("react.suspense_list"), Ke = Symbol.for("react.memo"), Qe = Symbol.for("react.lazy"), mt = Symbol.for("react.scope"), dt = Symbol.for("react.debug_trace_mode"), Tn = Symbol.for("react.offscreen"), an = Symbol.for("react.legacy_hidden"), sn = Symbol.for("react.cache"), ar = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function Xe(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var et = Object.assign, Ka = 0, nu, ru, hl, Wu, ml, Qr, $o;
    function Dr() {
    }
    Dr.__reactDisabledLog = !0;
    function uc() {
      {
        if (Ka === 0) {
          nu = console.log, ru = console.info, hl = console.warn, Wu = console.error, ml = console.group, Qr = console.groupCollapsed, $o = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Dr,
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
        Ka++;
      }
    }
    function oc() {
      {
        if (Ka--, Ka === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: et({}, e, {
              value: nu
            }),
            info: et({}, e, {
              value: ru
            }),
            warn: et({}, e, {
              value: hl
            }),
            error: et({}, e, {
              value: Wu
            }),
            group: et({}, e, {
              value: ml
            }),
            groupCollapsed: et({}, e, {
              value: Qr
            }),
            groupEnd: et({}, e, {
              value: $o
            })
          });
        }
        Ka < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Gu = N.ReactCurrentDispatcher, yl;
    function da(e, t, a) {
      {
        if (yl === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            yl = i && i[1] || "";
          }
        return `
` + yl + e;
      }
    }
    var Xa = !1, Ja;
    {
      var qu = typeof WeakMap == "function" ? WeakMap : Map;
      Ja = new qu();
    }
    function au(e, t) {
      if (!e || Xa)
        return "";
      {
        var a = Ja.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Xa = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Gu.current, Gu.current = null, uc();
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
            } catch (A) {
              i = A;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (A) {
              i = A;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (A) {
            i = A;
          }
          e();
        }
      } catch (A) {
        if (A && i && typeof A.stack == "string") {
          for (var p = A.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, g = v.length - 1; y >= 1 && g >= 0 && p[y] !== v[g]; )
            g--;
          for (; y >= 1 && g >= 0; y--, g--)
            if (p[y] !== v[g]) {
              if (y !== 1 || g !== 1)
                do
                  if (y--, g--, g < 0 || p[y] !== v[g]) {
                    var w = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && w.includes("<anonymous>") && (w = w.replace("<anonymous>", e.displayName)), typeof e == "function" && Ja.set(e, w), w;
                  }
                while (y >= 1 && g >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, Gu.current = s, oc(), Error.prepareStackTrace = u;
      }
      var x = e ? e.displayName || e.name : "", M = x ? da(x) : "";
      return typeof e == "function" && Ja.set(e, M), M;
    }
    function gl(e, t, a) {
      return au(e, !0);
    }
    function Ku(e, t, a) {
      return au(e, !1);
    }
    function Xu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Pi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return au(e, Xu(e));
      if (typeof e == "string")
        return da(e);
      switch (e) {
        case le:
          return da("Suspense");
        case me:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case B:
            return Ku(e.render);
          case Ke:
            return Pi(e.type, t, a);
          case Qe: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Pi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Gf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case re:
          return da(e.type);
        case Ot:
          return da("Lazy");
        case ee:
          return da("Suspense");
        case ht:
          return da("SuspenseList");
        case ce:
        case Pe:
        case ge:
          return Ku(e.type);
        case Ye:
          return Ku(e.type.render);
        case pe:
          return gl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += Gf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function zt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Ju(e) {
      return e.displayName || "Context";
    }
    function _t(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case di:
          return "Fragment";
        case rr:
          return "Portal";
        case pi:
          return "Profiler";
        case Wa:
          return "StrictMode";
        case le:
          return "Suspense";
        case me:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return Ju(t) + ".Consumer";
          case vi:
            var a = e;
            return Ju(a._context) + ".Provider";
          case B:
            return zt(e, e.render, "ForwardRef");
          case Ke:
            var i = e.displayName || null;
            return i !== null ? i : _t(e.type) || "Memo";
          case Qe: {
            var u = e, s = u._payload, f = u._init;
            try {
              return _t(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Qo(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function hi(e) {
      return e.displayName || "Context";
    }
    function $e(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Lt:
          return "Cache";
        case tn:
          var i = a;
          return hi(i) + ".Consumer";
        case ot:
          var u = a;
          return hi(u._context) + ".Provider";
        case st:
          return "DehydratedFragment";
        case Ye:
          return Qo(a, a.render, "ForwardRef");
        case nt:
          return "Fragment";
        case re:
          return a;
        case ye:
          return "Portal";
        case Z:
          return "Root";
        case Fe:
          return "Text";
        case Ot:
          return _t(a);
        case rt:
          return a === Wa ? "StrictMode" : "Mode";
        case _e:
          return "Offscreen";
        case vt:
          return "Profiler";
        case Ge:
          return "Scope";
        case ee:
          return "Suspense";
        case ht:
          return "SuspenseList";
        case Nt:
          return "TracingMarker";
        // The display name for this tags come from the user-provided type:
        case pe:
        case ce:
        case St:
        case Pe:
        case Ae:
        case ge:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Zu = N.ReactDebugCurrentFrame, ir = null, mi = !1;
    function Or() {
      {
        if (ir === null)
          return null;
        var e = ir._debugOwner;
        if (e !== null && typeof e < "u")
          return $e(e);
      }
      return null;
    }
    function yi() {
      return ir === null ? "" : Vi(ir);
    }
    function cn() {
      Zu.getCurrentStack = null, ir = null, mi = !1;
    }
    function Gt(e) {
      Zu.getCurrentStack = e === null ? null : yi, ir = e, mi = !1;
    }
    function Sl() {
      return ir;
    }
    function Yn(e) {
      mi = e;
    }
    function Lr(e) {
      return "" + e;
    }
    function ba(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Rn(e), e;
        default:
          return "";
      }
    }
    var iu = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Wo(e, t) {
      iu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Go(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function El(e) {
      return e._valueTracker;
    }
    function lu(e) {
      e._valueTracker = null;
    }
    function qf(e) {
      var t = "";
      return e && (Go(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function wa(e) {
      var t = Go(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Rn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            Rn(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            Rn(p), i = "" + p;
          },
          stopTracking: function() {
            lu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Za(e) {
      El(e) || (e._valueTracker = wa(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = El(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = qf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function _a(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var eo = !1, to = !1, Cl = !1, uu = !1;
    function no(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ro(e, t) {
      var a = e, i = t.checked, u = et({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ei(e, t) {
      Wo("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !to && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), to = !0), t.value !== void 0 && t.defaultValue !== void 0 && !eo && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), eo = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: ba(t.value != null ? t.value : i),
        controlled: no(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && _r(a, "checked", i, !1);
    }
    function C(e, t) {
      var a = e;
      {
        var i = no(t);
        !a._wrapperState.controlled && i && !uu && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), uu = !0), a._wrapperState.controlled && !i && !Cl && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Cl = !0);
      }
      h(e, t);
      var u = ba(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Lr(u)) : a.value !== Lr(u) && (a.value = Lr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Le(a, t.type, u) : t.hasOwnProperty("defaultValue") && Le(a, t.type, ba(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function z(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Lr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function j(e, t) {
      var a = e;
      C(a, t), X(a, t);
    }
    function X(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        Bn(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = zh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), C(f, p);
          }
        }
      }
    }
    function Le(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || _a(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Lr(e._wrapperState.initialValue) : e.defaultValue !== Lr(a) && (e.defaultValue = Lr(a)));
    }
    var ie = !1, ze = !1, yt = !1;
    function kt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? Q.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || ze || (ze = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (yt || (yt = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ie && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ie = !0);
    }
    function ln(e, t) {
      t.value != null && e.setAttribute("value", Lr(ba(t.value)));
    }
    var qt = Array.isArray;
    function ut(e) {
      return qt(e);
    }
    var Kt;
    Kt = !1;
    function hn() {
      var e = Or();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Rl = ["value", "defaultValue"];
    function qo(e) {
      {
        Wo("select", e);
        for (var t = 0; t < Rl.length; t++) {
          var a = Rl[t];
          if (e[a] != null) {
            var i = ut(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, hn()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, hn());
          }
        }
      }
    }
    function Bi(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var y = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== y && (u[v].selected = y), y && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var g = Lr(ba(a)), w = null, x = 0; x < u.length; x++) {
          if (u[x].value === g) {
            u[x].selected = !0, i && (u[x].defaultSelected = !0);
            return;
          }
          w === null && !u[x].disabled && (w = u[x]);
        }
        w !== null && (w.selected = !0);
      }
    }
    function Ko(e, t) {
      return et({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      qo(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Kt && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Kt = !0);
    }
    function Kf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Bi(a, !!t.multiple, i, !1) : t.defaultValue != null && Bi(a, !!t.multiple, t.defaultValue, !0);
    }
    function sc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Bi(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Bi(a, !!t.multiple, t.defaultValue, !0) : Bi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Xf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var rv = !1;
    function Jf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = et({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Lr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Zf(e, t) {
      var a = e;
      Wo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !rv && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), rv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (ut(u)) {
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
        initialValue: ba(i)
      };
    }
    function av(e, t) {
      var a = e, i = ba(t.value), u = ba(t.defaultValue);
      if (i != null) {
        var s = Lr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Lr(u));
    }
    function iv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Jm(e, t) {
      av(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", ed = "http://www.w3.org/1998/Math/MathML", td = "http://www.w3.org/2000/svg";
    function nd(e) {
      switch (e) {
        case "svg":
          return td;
        case "math":
          return ed;
        default:
          return Ii;
      }
    }
    function rd(e, t) {
      return e == null || e === Ii ? nd(t) : e === td && t === "foreignObject" ? Ii : e;
    }
    var lv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, cc, uv = lv(function(e, t) {
      if (e.namespaceURI === td && !("innerHTML" in e)) {
        cc = cc || document.createElement("div"), cc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = cc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Wr = 1, Yi = 3, Mn = 8, $i = 9, ad = 11, ao = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Yi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Xo = {
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
    }, Jo = {
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
    function ov(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var sv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Jo).forEach(function(e) {
      sv.forEach(function(t) {
        Jo[ov(t, e)] = Jo[e];
      });
    });
    function fc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Jo.hasOwnProperty(e) && Jo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var cv = /([A-Z])/g, fv = /^ms-/;
    function io(e) {
      return e.replace(cv, "-$1").toLowerCase().replace(fv, "-ms-");
    }
    var dv = function() {
    };
    {
      var Zm = /^(?:webkit|moz|o)[A-Z]/, ey = /^-ms-/, pv = /-(.)/g, id = /;\s*$/, Si = {}, su = {}, vv = !1, Zo = !1, ty = function(e) {
        return e.replace(pv, function(t, a) {
          return a.toUpperCase();
        });
      }, hv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ty(e.replace(ey, "ms-"))
        ));
      }, ld = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, ud = function(e, t) {
        su.hasOwnProperty(t) && su[t] || (su[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(id, "")));
      }, mv = function(e, t) {
        vv || (vv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, yv = function(e, t) {
        Zo || (Zo = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      dv = function(e, t) {
        e.indexOf("-") > -1 ? hv(e) : Zm.test(e) ? ld(e) : id.test(t) && ud(e, t), typeof t == "number" && (isNaN(t) ? mv(e, t) : isFinite(t) || yv(e, t));
      };
    }
    var gv = dv;
    function ny(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : io(i)) + ":", t += fc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function Sv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || gv(i, t[i]);
          var s = fc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ry(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Ev(e) {
      var t = {};
      for (var a in e)
        for (var i = Xo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function ay(e, t) {
      {
        if (!t)
          return;
        var a = Ev(e), i = Ev(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, S("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ry(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var ti = {
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
    }, es = et({
      menuitem: !0
    }, ti), Cv = "__html";
    function dc(e, t) {
      if (t) {
        if (es[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Cv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && S("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Tl(e, t) {
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
    var ts = {
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
    }, pc = {
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
    }, lo = {}, iy = new RegExp("^(aria)-[" + te + "]*$"), uo = new RegExp("^(aria)[A-Z][" + te + "]*$");
    function od(e, t) {
      {
        if (wr.call(lo, t) && lo[t])
          return !0;
        if (uo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = pc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), lo[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), lo[t] = !0, !0;
        }
        if (iy.test(t)) {
          var u = t.toLowerCase(), s = pc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return lo[t] = !0, !1;
          if (t !== s)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), lo[t] = !0, !0;
        }
      }
      return !0;
    }
    function ns(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = od(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function sd(e, t) {
      Tl(e, t) || ns(e, t);
    }
    var cd = !1;
    function vc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !cd && (cd = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cu = function() {
    };
    {
      var lr = {}, fd = /^on./, hc = /^on[^A-Z]/, Rv = new RegExp("^(aria)-[" + te + "]*$"), Tv = new RegExp("^(aria)[A-Z][" + te + "]*$");
      cu = function(e, t, a, i) {
        if (wr.call(lr, t) && lr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), lr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, p), lr[t] = !0, !0;
          if (fd.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), lr[t] = !0, !0;
        } else if (fd.test(t))
          return hc.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), lr[t] = !0, !0;
        if (Rv.test(t) || Tv.test(t))
          return !0;
        if (u === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), lr[t] = !0, !0;
        if (u === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), lr[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), lr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), lr[t] = !0, !0;
        var v = rn(t), y = v !== null && v.type === In;
        if (ts.hasOwnProperty(u)) {
          var g = ts[u];
          if (g !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, g), lr[t] = !0, !0;
        } else if (!y && t !== u)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), lr[t] = !0, !0;
        return typeof a == "boolean" && on(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), lr[t] = !0, !0) : y ? !0 : on(t, a, v, !1) ? (lr[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Ln && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), lr[t] = !0), !0);
      };
    }
    var xv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = cu(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function bv(e, t, a) {
      Tl(e, t) || xv(e, t, a);
    }
    var dd = 1, mc = 2, ka = 4, pd = dd | mc | ka, fu = null;
    function ly(e) {
      fu !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function uy() {
      fu === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function rs(e) {
      return e === fu;
    }
    function vd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var yc = null, du = null, Bt = null;
    function gc(e) {
      var t = Do(e);
      if (t) {
        if (typeof yc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = zh(a);
          yc(t.stateNode, t.type, i);
        }
      }
    }
    function Sc(e) {
      yc = e;
    }
    function oo(e) {
      du ? Bt ? Bt.push(e) : Bt = [e] : du = e;
    }
    function wv() {
      return du !== null || Bt !== null;
    }
    function Ec() {
      if (du) {
        var e = du, t = Bt;
        if (du = null, Bt = null, gc(e), t)
          for (var a = 0; a < t.length; a++)
            gc(t[a]);
      }
    }
    var so = function(e, t) {
      return e(t);
    }, as = function() {
    }, xl = !1;
    function _v() {
      var e = wv();
      e && (as(), Ec());
    }
    function kv(e, t, a) {
      if (xl)
        return e(t, a);
      xl = !0;
      try {
        return so(e, t, a);
      } finally {
        xl = !1, _v();
      }
    }
    function oy(e, t, a) {
      so = e, as = a;
    }
    function Dv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Cc(e, t, a) {
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
          return !!(a.disabled && Dv(t));
        default:
          return !1;
      }
    }
    function bl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = zh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Cc(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var is = !1;
    if (On)
      try {
        var pu = {};
        Object.defineProperty(pu, "passive", {
          get: function() {
            is = !0;
          }
        }), window.addEventListener("test", pu, pu), window.removeEventListener("test", pu, pu);
      } catch {
        is = !1;
      }
    function Rc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (g) {
        this.onError(g);
      }
    }
    var Tc = Rc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var hd = document.createElement("react");
      Tc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var g = document.createEvent("Event"), w = !1, x = !0, M = window.event, A = Object.getOwnPropertyDescriptor(window, "event");
        function F() {
          hd.removeEventListener(H, Me, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = M);
        }
        var oe = Array.prototype.slice.call(arguments, 3);
        function Me() {
          w = !0, F(), a.apply(i, oe), x = !1;
        }
        var we, bt = !1, Et = !1;
        function D(O) {
          if (we = O.error, bt = !0, we === null && O.colno === 0 && O.lineno === 0 && (Et = !0), O.defaultPrevented && we != null && typeof we == "object")
            try {
              we._suppressLogging = !0;
            } catch {
            }
        }
        var H = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", D), hd.addEventListener(H, Me, !1), g.initEvent(H, !1, !1), hd.dispatchEvent(g), A && Object.defineProperty(window, "event", A), w && x && (bt ? Et && (we = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : we = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(we)), window.removeEventListener("error", D), !w)
          return F(), Rc.apply(this, arguments);
      };
    }
    var Ov = Tc, co = !1, xc = null, fo = !1, Ei = null, Lv = {
      onError: function(e) {
        co = !0, xc = e;
      }
    };
    function wl(e, t, a, i, u, s, f, p, v) {
      co = !1, xc = null, Ov.apply(Lv, arguments);
    }
    function Ci(e, t, a, i, u, s, f, p, v) {
      if (wl.apply(this, arguments), co) {
        var y = us();
        fo || (fo = !0, Ei = y);
      }
    }
    function ls() {
      if (fo) {
        var e = Ei;
        throw fo = !1, Ei = null, e;
      }
    }
    function Qi() {
      return co;
    }
    function us() {
      if (co) {
        var e = xc;
        return co = !1, xc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function po(e) {
      return e._reactInternals;
    }
    function sy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var De = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), mn = (
      /*                    */
      2
    ), Rt = (
      /*                       */
      4
    ), Da = (
      /*                */
      16
    ), Oa = (
      /*                 */
      32
    ), un = (
      /*                     */
      64
    ), ke = (
      /*                   */
      128
    ), Cr = (
      /*            */
      256
    ), En = (
      /*                          */
      512
    ), $n = (
      /*                     */
      1024
    ), Gr = (
      /*                      */
      2048
    ), qr = (
      /*                    */
      4096
    ), Nn = (
      /*                   */
      8192
    ), vo = (
      /*             */
      16384
    ), Mv = (
      /*               */
      32767
    ), os = (
      /*                   */
      32768
    ), Xn = (
      /*                */
      65536
    ), bc = (
      /* */
      131072
    ), Ri = (
      /*                       */
      1048576
    ), ho = (
      /*                    */
      2097152
    ), Wi = (
      /*                 */
      4194304
    ), wc = (
      /*                */
      8388608
    ), _l = (
      /*               */
      16777216
    ), Ti = (
      /*              */
      33554432
    ), kl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Rt | $n | 0
    ), Dl = mn | Rt | Da | Oa | En | qr | Nn, Ol = Rt | un | En | Nn, Gi = Gr | Da, zn = Wi | wc | ho, La = N.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (mn | qr)) !== De && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === Z ? a : null;
    }
    function xi(e) {
      if (e.tag === ee) {
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
    function bi(e) {
      return e.tag === Z ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function Nv(e) {
      {
        var t = La.current;
        if (t !== null && t.tag === pe) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", $e(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = po(e);
      return u ? pa(u) === u : !1;
    }
    function _c(e) {
      if (pa(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function kc(e) {
      var t = e.alternate;
      if (!t) {
        var a = pa(e);
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
              return _c(s), e;
            if (v === u)
              return _c(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = f;
        else {
          for (var y = !1, g = s.child; g; ) {
            if (g === i) {
              y = !0, i = s, u = f;
              break;
            }
            if (g === u) {
              y = !0, u = s, i = f;
              break;
            }
            g = g.sibling;
          }
          if (!y) {
            for (g = f.child; g; ) {
              if (g === i) {
                y = !0, i = f, u = s;
                break;
              }
              if (g === u) {
                y = !0, u = f, i = s;
                break;
              }
              g = g.sibling;
            }
            if (!y)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== Z)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = kc(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === re || e.tag === Fe)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Xr(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function dn(e) {
      var t = kc(e);
      return t !== null ? Ma(t) : null;
    }
    function Ma(e) {
      if (e.tag === re || e.tag === Fe)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== ye) {
          var a = Ma(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var md = I.unstable_scheduleCallback, zv = I.unstable_cancelCallback, yd = I.unstable_shouldYield, gd = I.unstable_requestPaint, Qn = I.unstable_now, Dc = I.unstable_getCurrentPriorityLevel, ss = I.unstable_ImmediatePriority, Ll = I.unstable_UserBlockingPriority, qi = I.unstable_NormalPriority, cy = I.unstable_LowPriority, mu = I.unstable_IdlePriority, Oc = I.unstable_yieldValue, Uv = I.unstable_setDisableYieldValue, yu = null, xn = null, ue = null, va = !1, Jr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function mo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ve && (e = et({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: Na
        })), yu = t.inject(e), xn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Sd(e, t) {
      if (xn && typeof xn.onScheduleFiberRoot == "function")
        try {
          xn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function Ed(e, t) {
      if (xn && typeof xn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & ke) === ke;
          if (je) {
            var i;
            switch (t) {
              case Mr:
                i = ss;
                break;
              case _i:
                i = Ll;
                break;
              case za:
                i = qi;
                break;
              case Ua:
                i = mu;
                break;
              default:
                i = qi;
                break;
            }
            xn.onCommitFiberRoot(yu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, S("React instrumentation encountered an error: %s", u));
        }
    }
    function Cd(e) {
      if (xn && typeof xn.onPostCommitFiberRoot == "function")
        try {
          xn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Rd(e) {
      if (xn && typeof xn.onCommitFiberUnmount == "function")
        try {
          xn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function yn(e) {
      if (typeof Oc == "function" && (Uv(e), tt(e)), xn && typeof xn.setStrictMode == "function")
        try {
          xn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Na(e) {
      ue = e;
    }
    function gu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Cu; a++) {
          var i = Hv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Td(e) {
      ue !== null && typeof ue.markCommitStarted == "function" && ue.markCommitStarted(e);
    }
    function xd() {
      ue !== null && typeof ue.markCommitStopped == "function" && ue.markCommitStopped();
    }
    function ha(e) {
      ue !== null && typeof ue.markComponentRenderStarted == "function" && ue.markComponentRenderStarted(e);
    }
    function ma() {
      ue !== null && typeof ue.markComponentRenderStopped == "function" && ue.markComponentRenderStopped();
    }
    function bd(e) {
      ue !== null && typeof ue.markComponentPassiveEffectMountStarted == "function" && ue.markComponentPassiveEffectMountStarted(e);
    }
    function Av() {
      ue !== null && typeof ue.markComponentPassiveEffectMountStopped == "function" && ue.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      ue !== null && typeof ue.markComponentPassiveEffectUnmountStarted == "function" && ue.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ml() {
      ue !== null && typeof ue.markComponentPassiveEffectUnmountStopped == "function" && ue.markComponentPassiveEffectUnmountStopped();
    }
    function Lc(e) {
      ue !== null && typeof ue.markComponentLayoutEffectMountStarted == "function" && ue.markComponentLayoutEffectMountStarted(e);
    }
    function jv() {
      ue !== null && typeof ue.markComponentLayoutEffectMountStopped == "function" && ue.markComponentLayoutEffectMountStopped();
    }
    function cs(e) {
      ue !== null && typeof ue.markComponentLayoutEffectUnmountStarted == "function" && ue.markComponentLayoutEffectUnmountStarted(e);
    }
    function wd() {
      ue !== null && typeof ue.markComponentLayoutEffectUnmountStopped == "function" && ue.markComponentLayoutEffectUnmountStopped();
    }
    function fs(e, t, a) {
      ue !== null && typeof ue.markComponentErrored == "function" && ue.markComponentErrored(e, t, a);
    }
    function wi(e, t, a) {
      ue !== null && typeof ue.markComponentSuspended == "function" && ue.markComponentSuspended(e, t, a);
    }
    function ds(e) {
      ue !== null && typeof ue.markLayoutEffectsStarted == "function" && ue.markLayoutEffectsStarted(e);
    }
    function ps() {
      ue !== null && typeof ue.markLayoutEffectsStopped == "function" && ue.markLayoutEffectsStopped();
    }
    function Su(e) {
      ue !== null && typeof ue.markPassiveEffectsStarted == "function" && ue.markPassiveEffectsStarted(e);
    }
    function _d() {
      ue !== null && typeof ue.markPassiveEffectsStopped == "function" && ue.markPassiveEffectsStopped();
    }
    function Eu(e) {
      ue !== null && typeof ue.markRenderStarted == "function" && ue.markRenderStarted(e);
    }
    function Fv() {
      ue !== null && typeof ue.markRenderYielded == "function" && ue.markRenderYielded();
    }
    function Mc() {
      ue !== null && typeof ue.markRenderStopped == "function" && ue.markRenderStopped();
    }
    function gn(e) {
      ue !== null && typeof ue.markRenderScheduled == "function" && ue.markRenderScheduled(e);
    }
    function Nc(e, t) {
      ue !== null && typeof ue.markForceUpdateScheduled == "function" && ue.markForceUpdateScheduled(e, t);
    }
    function vs(e, t) {
      ue !== null && typeof ue.markStateUpdateScheduled == "function" && ue.markStateUpdateScheduled(e, t);
    }
    var Oe = (
      /*                         */
      0
    ), pt = (
      /*                 */
      1
    ), Ut = (
      /*                    */
      2
    ), Xt = (
      /*               */
      8
    ), At = (
      /*              */
      16
    ), Un = Math.clz32 ? Math.clz32 : hs, Jn = Math.log, zc = Math.LN2;
    function hs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Jn(t) / zc | 0) | 0;
    }
    var Cu = 31, Y = (
      /*                        */
      0
    ), Mt = (
      /*                          */
      0
    ), He = (
      /*                        */
      1
    ), Nl = (
      /*    */
      2
    ), ri = (
      /*             */
      4
    ), Rr = (
      /*            */
      8
    ), bn = (
      /*                     */
      16
    ), Xi = (
      /*                */
      32
    ), zl = (
      /*                       */
      4194240
    ), Ru = (
      /*                        */
      64
    ), Uc = (
      /*                        */
      128
    ), Ac = (
      /*                        */
      256
    ), jc = (
      /*                        */
      512
    ), Fc = (
      /*                        */
      1024
    ), Hc = (
      /*                        */
      2048
    ), Pc = (
      /*                        */
      4096
    ), Vc = (
      /*                        */
      8192
    ), Bc = (
      /*                        */
      16384
    ), Tu = (
      /*                       */
      32768
    ), Ic = (
      /*                       */
      65536
    ), yo = (
      /*                       */
      131072
    ), go = (
      /*                       */
      262144
    ), Yc = (
      /*                       */
      524288
    ), ms = (
      /*                       */
      1048576
    ), $c = (
      /*                       */
      2097152
    ), ys = (
      /*                            */
      130023424
    ), xu = (
      /*                             */
      4194304
    ), Qc = (
      /*                             */
      8388608
    ), gs = (
      /*                             */
      16777216
    ), Wc = (
      /*                             */
      33554432
    ), Gc = (
      /*                             */
      67108864
    ), kd = xu, Ss = (
      /*          */
      134217728
    ), Dd = (
      /*                          */
      268435455
    ), Es = (
      /*               */
      268435456
    ), bu = (
      /*                        */
      536870912
    ), Zr = (
      /*                   */
      1073741824
    );
    function Hv(e) {
      {
        if (e & He)
          return "Sync";
        if (e & Nl)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & Rr)
          return "DefaultHydration";
        if (e & bn)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & zl)
          return "Transition";
        if (e & ys)
          return "Retry";
        if (e & Ss)
          return "SelectiveHydration";
        if (e & Es)
          return "IdleHydration";
        if (e & bu)
          return "Idle";
        if (e & Zr)
          return "Offscreen";
      }
    }
    var en = -1, wu = Ru, qc = xu;
    function Cs(e) {
      switch (Ul(e)) {
        case He:
          return He;
        case Nl:
          return Nl;
        case ri:
          return ri;
        case Rr:
          return Rr;
        case bn:
          return bn;
        case Xi:
          return Xi;
        case Ru:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
          return e & zl;
        case xu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          return e & ys;
        case Ss:
          return Ss;
        case Es:
          return Es;
        case bu:
          return bu;
        case Zr:
          return Zr;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kc(e, t) {
      var a = e.pendingLanes;
      if (a === Y)
        return Y;
      var i = Y, u = e.suspendedLanes, s = e.pingedLanes, f = a & Dd;
      if (f !== Y) {
        var p = f & ~u;
        if (p !== Y)
          i = Cs(p);
        else {
          var v = f & s;
          v !== Y && (i = Cs(v));
        }
      } else {
        var y = a & ~u;
        y !== Y ? i = Cs(y) : s !== Y && (i = Cs(s));
      }
      if (i === Y)
        return Y;
      if (t !== Y && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === Y) {
        var g = Ul(i), w = Ul(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          g >= w || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          g === bn && (w & zl) !== Y
        )
          return t;
      }
      (i & ri) !== Y && (i |= a & bn);
      var x = e.entangledLanes;
      if (x !== Y)
        for (var M = e.entanglements, A = i & x; A > 0; ) {
          var F = An(A), oe = 1 << F;
          i |= M[F], A &= ~oe;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = en; t > 0; ) {
        var u = An(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Od(e, t) {
      switch (e) {
        case He:
        case Nl:
        case ri:
          return t + 250;
        case Rr:
        case bn:
        case Xi:
        case Ru:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
          return t + 5e3;
        case xu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          return en;
        case Ss:
        case Es:
        case bu:
        case Zr:
          return en;
        default:
          return S("Should have found matching lanes. This is a bug in React."), en;
      }
    }
    function Xc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = An(f), v = 1 << p, y = s[p];
        y === en ? ((v & i) === Y || (v & u) !== Y) && (s[p] = Od(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Pv(e) {
      return Cs(e.pendingLanes);
    }
    function Jc(e) {
      var t = e.pendingLanes & ~Zr;
      return t !== Y ? t : t & Zr ? Zr : Y;
    }
    function Vv(e) {
      return (e & He) !== Y;
    }
    function Rs(e) {
      return (e & Dd) !== Y;
    }
    function _u(e) {
      return (e & ys) === e;
    }
    function Ld(e) {
      var t = He | ri | bn;
      return (e & t) === Y;
    }
    function Md(e) {
      return (e & zl) === e;
    }
    function Zc(e, t) {
      var a = Nl | ri | Rr | bn;
      return (t & a) !== Y;
    }
    function Bv(e, t) {
      return (t & e.expiredLanes) !== Y;
    }
    function Nd(e) {
      return (e & zl) !== Y;
    }
    function zd() {
      var e = wu;
      return wu <<= 1, (wu & zl) === Y && (wu = Ru), e;
    }
    function Iv() {
      var e = qc;
      return qc <<= 1, (qc & ys) === Y && (qc = xu), e;
    }
    function Ul(e) {
      return e & -e;
    }
    function Ts(e) {
      return Ul(e);
    }
    function An(e) {
      return 31 - Un(e);
    }
    function ur(e) {
      return An(e);
    }
    function ea(e, t) {
      return (e & t) !== Y;
    }
    function ku(e, t) {
      return (e & t) === t;
    }
    function Je(e, t) {
      return e | t;
    }
    function xs(e, t) {
      return e & ~t;
    }
    function Ud(e, t) {
      return e & t;
    }
    function Yv(e) {
      return e;
    }
    function $v(e, t) {
      return e !== Mt && e < t ? e : t;
    }
    function bs(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function So(e, t, a) {
      e.pendingLanes |= t, t !== bu && (e.suspendedLanes = Y, e.pingedLanes = Y);
      var i = e.eventTimes, u = ur(t);
      i[u] = a;
    }
    function Qv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = An(i), s = 1 << u;
        a[u] = en, i &= ~s;
      }
    }
    function ef(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Ad(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = Y, e.pingedLanes = Y, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = An(f), v = 1 << p;
        i[p] = Y, u[p] = en, s[p] = en, f &= ~v;
      }
    }
    function tf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = An(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function jd(e, t) {
      var a = Ul(t), i;
      switch (a) {
        case ri:
          i = Nl;
          break;
        case bn:
          i = Rr;
          break;
        case Ru:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
        case xu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          i = Xi;
          break;
        case bu:
          i = Es;
          break;
        default:
          i = Mt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Mt ? Mt : i;
    }
    function ws(e, t, a) {
      if (Jr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = ur(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Wv(e, t) {
      if (Jr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = ur(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Fd(e, t) {
      return null;
    }
    var Mr = He, _i = ri, za = bn, Ua = bu, _s = Mt;
    function Aa() {
      return _s;
    }
    function jn(e) {
      _s = e;
    }
    function Gv(e, t) {
      var a = _s;
      try {
        return _s = e, t();
      } finally {
        _s = a;
      }
    }
    function qv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function ks(e, t) {
      return e > t ? e : t;
    }
    function Zn(e, t) {
      return e !== 0 && e < t;
    }
    function Kv(e) {
      var t = Ul(e);
      return Zn(Mr, t) ? Zn(_i, t) ? Rs(t) ? za : Ua : _i : Mr;
    }
    function nf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ds;
    function Tr(e) {
      Ds = e;
    }
    function fy(e) {
      Ds(e);
    }
    var he;
    function Eo(e) {
      he = e;
    }
    var rf;
    function Xv(e) {
      rf = e;
    }
    var Jv;
    function Os(e) {
      Jv = e;
    }
    var Ls;
    function Hd(e) {
      Ls = e;
    }
    var af = !1, Ms = [], Ji = null, ki = null, Di = null, wn = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new Map(), zr = [], Zv = [
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
    function eh(e) {
      return Zv.indexOf(e) > -1;
    }
    function ii(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function Pd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Ji = null;
          break;
        case "dragenter":
        case "dragleave":
          ki = null;
          break;
        case "mouseover":
        case "mouseout":
          Di = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          wn.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Nr.delete(i);
          break;
        }
      }
    }
    function ta(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ii(t, a, i, u, s);
        if (t !== null) {
          var p = Do(t);
          p !== null && he(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function dy(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Ji = ta(Ji, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return ki = ta(ki, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return Di = ta(Di, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return wn.set(y, ta(wn.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var g = u, w = g.pointerId;
          return Nr.set(w, ta(Nr.get(w) || null, e, t, a, i, g)), !0;
        }
      }
      return !1;
    }
    function Vd(e) {
      var t = Ys(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === ee) {
            var u = xi(a);
            if (u !== null) {
              e.blockedOn = u, Ls(e.priority, function() {
                rf(a);
              });
              return;
            }
          } else if (i === Z) {
            var s = a.stateNode;
            if (nf(s)) {
              e.blockedOn = bi(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function th(e) {
      for (var t = Jv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < zr.length && Zn(t, zr[i].priority); i++)
        ;
      zr.splice(i, 0, a), i === 0 && Vd(a);
    }
    function Ns(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Ro(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          ly(s), u.target.dispatchEvent(s), uy();
        } else {
          var f = Do(i);
          return f !== null && he(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Bd(e, t, a) {
      Ns(e) && a.delete(t);
    }
    function py() {
      af = !1, Ji !== null && Ns(Ji) && (Ji = null), ki !== null && Ns(ki) && (ki = null), Di !== null && Ns(Di) && (Di = null), wn.forEach(Bd), Nr.forEach(Bd);
    }
    function Al(e, t) {
      e.blockedOn === t && (e.blockedOn = null, af || (af = !0, I.unstable_scheduleCallback(I.unstable_NormalPriority, py)));
    }
    function Du(e) {
      if (Ms.length > 0) {
        Al(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && Al(Ji, e), ki !== null && Al(ki, e), Di !== null && Al(Di, e);
      var i = function(p) {
        return Al(p, e);
      };
      wn.forEach(i), Nr.forEach(i);
      for (var u = 0; u < zr.length; u++) {
        var s = zr[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; zr.length > 0; ) {
        var f = zr[0];
        if (f.blockedOn !== null)
          break;
        Vd(f), f.blockedOn === null && zr.shift();
      }
    }
    var or = N.ReactCurrentBatchConfig, Tt = !0;
    function Wn(e) {
      Tt = !!e;
    }
    function Fn() {
      return Tt;
    }
    function sr(e, t, a) {
      var i = lf(t), u;
      switch (i) {
        case Mr:
          u = ya;
          break;
        case _i:
          u = Co;
          break;
        case za:
        default:
          u = _n;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = Aa(), s = or.transition;
      or.transition = null;
      try {
        jn(Mr), _n(e, t, a, i);
      } finally {
        jn(u), or.transition = s;
      }
    }
    function Co(e, t, a, i) {
      var u = Aa(), s = or.transition;
      or.transition = null;
      try {
        jn(_i), _n(e, t, a, i);
      } finally {
        jn(u), or.transition = s;
      }
    }
    function _n(e, t, a, i) {
      Tt && zs(e, t, a, i);
    }
    function zs(e, t, a, i) {
      var u = Ro(e, t, a, i);
      if (u === null) {
        Oy(e, t, i, Oi, a), Pd(e, i);
        return;
      }
      if (dy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Pd(e, i), t & ka && eh(e)) {
        for (; u !== null; ) {
          var s = Do(u);
          s !== null && fy(s);
          var f = Ro(e, t, a, i);
          if (f === null && Oy(e, t, i, Oi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Oy(e, t, i, null, a);
    }
    var Oi = null;
    function Ro(e, t, a, i) {
      Oi = null;
      var u = vd(i), s = Ys(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === ee) {
            var v = xi(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === Z) {
            var y = f.stateNode;
            if (nf(y))
              return bi(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Oi = s, null;
    }
    function lf(e) {
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
          return Mr;
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
          return _i;
        case "message": {
          var t = Dc();
          switch (t) {
            case ss:
              return Mr;
            case Ll:
              return _i;
            case qi:
            case cy:
              return za;
            case mu:
              return Ua;
            default:
              return za;
          }
        }
        default:
          return za;
      }
    }
    function Us(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Id(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function To(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ga = null, xo = null, Ou = null;
    function jl(e) {
      return ga = e, xo = As(), !0;
    }
    function uf() {
      ga = null, xo = null, Ou = null;
    }
    function Zi() {
      if (Ou)
        return Ou;
      var e, t = xo, a = t.length, i, u = As(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Ou = u.slice(e, p), Ou;
    }
    function As() {
      return "value" in ga ? ga.value : ga.textContent;
    }
    function Fl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function bo() {
      return !0;
    }
    function js() {
      return !1;
    }
    function xr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = bo : this.isDefaultPrevented = js, this.isPropagationStopped = js, this;
      }
      return et(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = bo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = bo);
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
        isPersistent: bo
      }), t;
    }
    var Hn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Li = xr(Hn), Ur = et({}, Hn, {
      view: 0,
      detail: 0
    }), ra = xr(Ur), of, Fs, Lu;
    function vy(e) {
      e !== Lu && (Lu && e.type === "mousemove" ? (of = e.screenX - Lu.screenX, Fs = e.screenY - Lu.screenY) : (of = 0, Fs = 0), Lu = e);
    }
    var li = et({}, Ur, {
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
      getModifierState: pn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (vy(e), of);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Fs;
      }
    }), Yd = xr(li), $d = et({}, li, {
      dataTransfer: 0
    }), Mu = xr($d), Qd = et({}, Ur, {
      relatedTarget: 0
    }), el = xr(Qd), nh = et({}, Hn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), rh = xr(nh), Wd = et({}, Hn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), sf = xr(Wd), hy = et({}, Hn, {
      data: 0
    }), ah = xr(hy), ih = ah, lh = {
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
    }, Nu = {
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
    function my(e) {
      if (e.key) {
        var t = lh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Fl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Nu[e.keyCode] || "Unidentified" : "";
    }
    var wo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function uh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = wo[e];
      return i ? !!a[i] : !1;
    }
    function pn(e) {
      return uh;
    }
    var yy = et({}, Ur, {
      key: my,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: pn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Fl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Fl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), oh = xr(yy), gy = et({}, li, {
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
    }), sh = xr(gy), ch = et({}, Ur, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: pn
    }), fh = xr(ch), Sy = et({}, Hn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ja = xr(Sy), Gd = et({}, li, {
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
    }), Ey = xr(Gd), Hl = [9, 13, 27, 32], Hs = 229, tl = On && "CompositionEvent" in window, Pl = null;
    On && "documentMode" in document && (Pl = document.documentMode);
    var qd = On && "TextEvent" in window && !Pl, cf = On && (!tl || Pl && Pl > 8 && Pl <= 11), dh = 32, ff = String.fromCharCode(dh);
    function Cy() {
      ft("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), ft("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), ft("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), ft("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Kd = !1;
    function ph(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function df(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function pf(e, t) {
      return e === "keydown" && t.keyCode === Hs;
    }
    function Xd(e, t) {
      switch (e) {
        case "keyup":
          return Hl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Hs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function vf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function vh(e) {
      return e.locale === "ko";
    }
    var zu = !1;
    function Jd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = df(t) : zu ? Xd(t, i) && (s = "onCompositionEnd") : pf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      cf && !vh(i) && (!zu && s === "onCompositionStart" ? zu = jl(u) : s === "onCompositionEnd" && zu && (f = Zi()));
      var p = Ch(a, s);
      if (p.length > 0) {
        var v = new ah(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = vf(i);
          y !== null && (v.data = y);
        }
      }
    }
    function hf(e, t) {
      switch (e) {
        case "compositionend":
          return vf(t);
        case "keypress":
          var a = t.which;
          return a !== dh ? null : (Kd = !0, ff);
        case "textInput":
          var i = t.data;
          return i === ff && Kd ? null : i;
        default:
          return null;
      }
    }
    function Zd(e, t) {
      if (zu) {
        if (e === "compositionend" || !tl && Xd(e, t)) {
          var a = Zi();
          return uf(), zu = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!ph(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return cf && !vh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function mf(e, t, a, i, u) {
      var s;
      if (qd ? s = hf(t, i) : s = Zd(t, i), !s)
        return null;
      var f = Ch(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new ih("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function hh(e, t, a, i, u, s, f) {
      Jd(e, t, a, i, u), mf(e, t, a, i, u);
    }
    var Ry = {
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
    function Ps(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Ry[e.type] : t === "textarea";
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
    function Ty(e) {
      if (!On)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Vs() {
      ft("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function mh(e, t, a, i) {
      oo(i);
      var u = Ch(t, "onChange");
      if (u.length > 0) {
        var s = new Li("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var Vl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      mh(t, n, e, vd(e)), kv(o, t);
    }
    function o(e) {
      kE(e, 0);
    }
    function c(e) {
      var t = Rf(e);
      if (gi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    On && (m = Ty("input") && (!document.documentMode || document.documentMode > 9));
    function E(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", U);
    }
    function T() {
      Vl && (Vl.detachEvent("onpropertychange", U), Vl = null, n = null);
    }
    function U(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function W(e, t, a) {
      e === "focusin" ? (T(), E(t, a)) : e === "focusout" && T();
    }
    function q(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function $(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function fe(e, t) {
      if (e === "click")
        return c(t);
    }
    function Se(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Re(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Le(e, "number", e.value);
    }
    function kn(e, t, a, i, u, s, f) {
      var p = a ? Rf(a) : window, v, y;
      if (r(p) ? v = d : Ps(p) ? m ? v = Se : (v = q, y = W) : $(p) && (v = fe), v) {
        var g = v(t, a);
        if (g) {
          mh(e, g, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && Re(p);
    }
    function k() {
      Yt("onMouseEnter", ["mouseout", "mouseover"]), Yt("onMouseLeave", ["mouseout", "mouseover"]), Yt("onPointerEnter", ["pointerout", "pointerover"]), Yt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function b(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !rs(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Ys(y) || pp(y)))
          return;
      }
      if (!(!v && !p)) {
        var g;
        if (u.window === u)
          g = u;
        else {
          var w = u.ownerDocument;
          w ? g = w.defaultView || w.parentWindow : g = window;
        }
        var x, M;
        if (v) {
          var A = i.relatedTarget || i.toElement;
          if (x = a, M = A ? Ys(A) : null, M !== null) {
            var F = pa(M);
            (M !== F || M.tag !== re && M.tag !== Fe) && (M = null);
          }
        } else
          x = null, M = a;
        if (x !== M) {
          var oe = Yd, Me = "onMouseLeave", we = "onMouseEnter", bt = "mouse";
          (t === "pointerout" || t === "pointerover") && (oe = sh, Me = "onPointerLeave", we = "onPointerEnter", bt = "pointer");
          var Et = x == null ? g : Rf(x), D = M == null ? g : Rf(M), H = new oe(Me, bt + "leave", x, i, u);
          H.target = Et, H.relatedTarget = D;
          var O = null, K = Ys(u);
          if (K === a) {
            var ve = new oe(we, bt + "enter", M, i, u);
            ve.target = D, ve.relatedTarget = Et, O = ve;
          }
          NT(e, H, O, x, M);
        }
      }
    }
    function L(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var G = typeof Object.is == "function" ? Object.is : L;
    function Ee(e, t) {
      if (G(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!wr.call(t, s) || !G(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function Ne(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Ue(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Ie(e, t) {
      for (var a = Ne(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Ne(Ue(a));
      }
    }
    function er(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return jt(e, u, s, f, p);
    }
    function jt(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, g = e, w = null;
      e: for (; ; ) {
        for (var x = null; g === t && (a === 0 || g.nodeType === Yi) && (f = s + a), g === i && (u === 0 || g.nodeType === Yi) && (p = s + u), g.nodeType === Yi && (s += g.nodeValue.length), (x = g.firstChild) !== null; )
          w = g, g = x;
        for (; ; ) {
          if (g === e)
            break e;
          if (w === t && ++v === a && (f = s), w === i && ++y === u && (p = s), (x = g.nextSibling) !== null)
            break;
          g = w, w = g.parentNode;
        }
        g = x;
      }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function Bl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var y = Ie(e, f), g = Ie(e, p);
        if (y && g) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === g.node && u.focusOffset === g.offset)
            return;
          var w = a.createRange();
          w.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(w), u.extend(g.node, g.offset)) : (w.setEnd(g.node, g.offset), u.addRange(w));
        }
      }
    }
    function yh(e) {
      return e && e.nodeType === Yi;
    }
    function yE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : yh(e) ? !1 : yh(t) ? yE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function hT(e) {
      return e && e.ownerDocument && yE(e.ownerDocument.documentElement, e);
    }
    function mT(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function gE() {
      for (var e = window, t = _a(); t instanceof e.HTMLIFrameElement; ) {
        if (mT(t))
          e = t.contentWindow;
        else
          return t;
        t = _a(e.document);
      }
      return t;
    }
    function xy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function yT() {
      var e = gE();
      return {
        focusedElem: e,
        selectionRange: xy(e) ? ST(e) : null
      };
    }
    function gT(e) {
      var t = gE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && hT(a)) {
        i !== null && xy(a) && ET(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === Wr && u.push({
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
    function ST(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = er(e), t || {
        start: 0,
        end: 0
      };
    }
    function ET(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var CT = On && "documentMode" in document && document.documentMode <= 11;
    function RT() {
      ft("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var yf = null, by = null, ep = null, wy = !1;
    function TT(e) {
      if ("selectionStart" in e && xy(e))
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
    function xT(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function SE(e, t, a) {
      var i = xT(a);
      if (!(wy || yf == null || yf !== _a(i))) {
        var u = TT(yf);
        if (!ep || !Ee(ep, u)) {
          ep = u;
          var s = Ch(by, "onSelect");
          if (s.length > 0) {
            var f = new Li("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = yf;
          }
        }
      }
    }
    function bT(e, t, a, i, u, s, f) {
      var p = a ? Rf(a) : window;
      switch (t) {
        // Track the input node that has focus.
        case "focusin":
          (Ps(p) || p.contentEditable === "true") && (yf = p, by = a, ep = null);
          break;
        case "focusout":
          yf = null, by = null, ep = null;
          break;
        // Don't fire the event while the user is dragging. This matches the
        // semantics of the native select event.
        case "mousedown":
          wy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          wy = !1, SE(e, i, u);
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
          if (CT)
            break;
        // falls through
        case "keydown":
        case "keyup":
          SE(e, i, u);
      }
    }
    function gh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var gf = {
      animationend: gh("Animation", "AnimationEnd"),
      animationiteration: gh("Animation", "AnimationIteration"),
      animationstart: gh("Animation", "AnimationStart"),
      transitionend: gh("Transition", "TransitionEnd")
    }, _y = {}, EE = {};
    On && (EE = document.createElement("div").style, "AnimationEvent" in window || (delete gf.animationend.animation, delete gf.animationiteration.animation, delete gf.animationstart.animation), "TransitionEvent" in window || delete gf.transitionend.transition);
    function Sh(e) {
      if (_y[e])
        return _y[e];
      if (!gf[e])
        return e;
      var t = gf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in EE)
          return _y[e] = t[a];
      return e;
    }
    var CE = Sh("animationend"), RE = Sh("animationiteration"), TE = Sh("animationstart"), xE = Sh("transitionend"), bE = /* @__PURE__ */ new Map(), wE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function _o(e, t) {
      bE.set(e, t), ft(t, [e]);
    }
    function wT() {
      for (var e = 0; e < wE.length; e++) {
        var t = wE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        _o(a, "on" + i);
      }
      _o(CE, "onAnimationEnd"), _o(RE, "onAnimationIteration"), _o(TE, "onAnimationStart"), _o("dblclick", "onDoubleClick"), _o("focusin", "onFocus"), _o("focusout", "onBlur"), _o(xE, "onTransitionEnd");
    }
    function _T(e, t, a, i, u, s, f) {
      var p = bE.get(t);
      if (p !== void 0) {
        var v = Li, y = t;
        switch (t) {
          case "keypress":
            if (Fl(i) === 0)
              return;
          /* falls through */
          case "keydown":
          case "keyup":
            v = oh;
            break;
          case "focusin":
            y = "focus", v = el;
            break;
          case "focusout":
            y = "blur", v = el;
            break;
          case "beforeblur":
          case "afterblur":
            v = el;
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
            v = Yd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Mu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = fh;
            break;
          case CE:
          case RE:
          case TE:
            v = rh;
            break;
          case xE:
            v = ja;
            break;
          case "scroll":
            v = ra;
            break;
          case "wheel":
            v = Ey;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = sf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = sh;
            break;
        }
        var g = (s & ka) !== 0;
        {
          var w = !g && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", x = LT(a, p, i.type, g, w);
          if (x.length > 0) {
            var M = new v(p, y, null, i, u);
            e.push({
              event: M,
              listeners: x
            });
          }
        }
      }
    }
    wT(), k(), Vs(), RT(), Cy();
    function kT(e, t, a, i, u, s, f) {
      _T(e, t, a, i, u, s);
      var p = (s & pd) === 0;
      p && (b(e, t, a, i, u), kn(e, t, a, i, u), bT(e, t, a, i, u), hh(e, t, a, i, u));
    }
    var tp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], ky = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(tp));
    function _E(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function DT(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          _E(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var g = t[y], w = g.instance, x = g.currentTarget, M = g.listener;
          if (w !== i && e.isPropagationStopped())
            return;
          _E(e, M, x), i = w;
        }
    }
    function kE(e, t) {
      for (var a = (t & ka) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        DT(s, f, a);
      }
      ls();
    }
    function OT(e, t, a, i, u) {
      var s = vd(a), f = [];
      kT(f, e, i, a, s, t), kE(f, t);
    }
    function Sn(e, t) {
      ky.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = lb(t), u = zT(e);
      i.has(u) || (DE(t, e, mc, a), i.add(u));
    }
    function Dy(e, t, a) {
      ky.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= ka), DE(a, e, i, t);
    }
    var Eh = "_reactListening" + Math.random().toString(36).slice(2);
    function np(e) {
      if (!e[Eh]) {
        e[Eh] = !0, at.forEach(function(a) {
          a !== "selectionchange" && (ky.has(a) || Dy(a, !1, e), Dy(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[Eh] || (t[Eh] = !0, Dy("selectionchange", !1, t)));
      }
    }
    function DE(e, t, a, i, u) {
      var s = sr(e, t, a), f = void 0;
      is && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Id(e, t, s, f) : na(e, t, s) : f !== void 0 ? To(e, t, s, f) : Us(e, t, s);
    }
    function OE(e, t) {
      return e === t || e.nodeType === Mn && e.parentNode === t;
    }
    function Oy(e, t, a, i, u) {
      var s = i;
      if ((t & dd) === 0 && (t & mc) === 0) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === Z || v === ye) {
              var y = p.stateNode.containerInfo;
              if (OE(y, f))
                break;
              if (v === ye)
                for (var g = p.return; g !== null; ) {
                  var w = g.tag;
                  if (w === Z || w === ye) {
                    var x = g.stateNode.containerInfo;
                    if (OE(x, f))
                      return;
                  }
                  g = g.return;
                }
              for (; y !== null; ) {
                var M = Ys(y);
                if (M === null)
                  return;
                var A = M.tag;
                if (A === re || A === Fe) {
                  p = s = M;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      kv(function() {
        return OT(e, t, a, s);
      });
    }
    function rp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function LT(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, g = null; y !== null; ) {
        var w = y, x = w.stateNode, M = w.tag;
        if (M === re && x !== null && (g = x, p !== null)) {
          var A = bl(y, p);
          A != null && v.push(rp(y, A, g));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function Ch(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === re && f !== null) {
          var v = f, y = bl(u, a);
          y != null && i.unshift(rp(u, y, v));
          var g = bl(u, t);
          g != null && i.push(rp(u, g, v));
        }
        u = u.return;
      }
      return i;
    }
    function Sf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== re);
      return e || null;
    }
    function MT(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = Sf(s))
        u++;
      for (var f = 0, p = i; p; p = Sf(p))
        f++;
      for (; u - f > 0; )
        a = Sf(a), u--;
      for (; f - u > 0; )
        i = Sf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Sf(a), i = Sf(i);
      }
      return null;
    }
    function LE(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, g = v.stateNode, w = v.tag;
        if (y !== null && y === i)
          break;
        if (w === re && g !== null) {
          var x = g;
          if (u) {
            var M = bl(p, s);
            M != null && f.unshift(rp(p, M, x));
          } else if (!u) {
            var A = bl(p, s);
            A != null && f.push(rp(p, A, x));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function NT(e, t, a, i, u) {
      var s = i && u ? MT(i, u) : null;
      i !== null && LE(e, t, i, s, !1), u !== null && a !== null && LE(e, a, u, s, !0);
    }
    function zT(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, ap = "dangerouslySetInnerHTML", Rh = "suppressContentEditableWarning", ko = "suppressHydrationWarning", ME = "autoFocus", Bs = "children", Is = "style", Th = "__html", Ly, xh, ip, NE, bh, zE, UE;
    Ly = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, xh = function(e, t) {
      sd(e, t), vc(e, t), bv(e, t, {
        registrationNameDependencies: Ze,
        possibleRegistrationNames: it
      });
    }, zE = On && !document.documentMode, ip = function(e, t, a) {
      if (!Fa) {
        var i = wh(a), u = wh(t);
        u !== i && (Fa = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, NE = function(e) {
      if (!Fa) {
        Fa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, bh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, UE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var UT = /\r\n?/g, AT = /\u0000|\uFFFD/g;
    function wh(e) {
      qn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(UT, `
`).replace(AT, "");
    }
    function _h(e, t, a, i) {
      var u = wh(t), s = wh(e);
      if (s !== u && (i && (Fa || (Fa = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Te))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function AE(e) {
      return e.nodeType === $i ? e : e.ownerDocument;
    }
    function jT() {
    }
    function kh(e) {
      e.onclick = jT;
    }
    function FT(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Is)
            f && Object.freeze(f), Sv(t, f);
          else if (s === ap) {
            var p = f ? f[Th] : void 0;
            p != null && uv(t, p);
          } else if (s === Bs)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && ao(t, f);
            } else typeof f == "number" && ao(t, "" + f);
          else s === Rh || s === ko || s === ME || (Ze.hasOwnProperty(s) ? f != null && (typeof f != "function" && bh(s, f), s === "onScroll" && Sn("scroll", t)) : f != null && _r(t, s, f, u));
        }
    }
    function HT(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Is ? Sv(e, f) : s === ap ? uv(e, f) : s === Bs ? ao(e, f) : _r(e, s, f, i);
      }
    }
    function PT(e, t, a, i) {
      var u, s = AE(a), f, p = i;
      if (p === Ii && (p = nd(e)), p === Ii) {
        if (u = Tl(e, t), !u && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var y = v.firstChild;
          f = v.removeChild(y);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var g = f;
          t.multiple ? g.multiple = !0 : t.size && (g.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !wr.call(Ly, e) && (Ly[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function VT(e, t) {
      return AE(t).createTextNode(e);
    }
    function BT(e, t, a, i) {
      var u = Tl(t, a);
      xh(t, a);
      var s;
      switch (t) {
        case "dialog":
          Sn("cancel", e), Sn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Sn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < tp.length; f++)
            Sn(tp[f], e);
          s = a;
          break;
        case "source":
          Sn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          Sn("error", e), Sn("load", e), s = a;
          break;
        case "details":
          Sn("toggle", e), s = a;
          break;
        case "input":
          ei(e, a), s = ro(e, a), Sn("invalid", e);
          break;
        case "option":
          kt(e, a), s = a;
          break;
        case "select":
          ou(e, a), s = Ko(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Zf(e, a), s = Jf(e, a), Sn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (dc(t, s), FT(t, e, i, s, u), t) {
        case "input":
          Za(e), z(e, a, !1);
          break;
        case "textarea":
          Za(e), iv(e);
          break;
        case "option":
          ln(e, a);
          break;
        case "select":
          Kf(e, a);
          break;
        default:
          typeof s.onClick == "function" && kh(e);
          break;
      }
    }
    function IT(e, t, a, i, u) {
      xh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ro(e, a), p = ro(e, i), s = [];
          break;
        case "select":
          f = Ko(e, a), p = Ko(e, i), s = [];
          break;
        case "textarea":
          f = Jf(e, a), p = Jf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && kh(e);
          break;
      }
      dc(t, p);
      var v, y, g = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Is) {
            var w = f[v];
            for (y in w)
              w.hasOwnProperty(y) && (g || (g = {}), g[y] = "");
          } else v === ap || v === Bs || v === Rh || v === ko || v === ME || (Ze.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var x = p[v], M = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || x === M || x == null && M == null))
          if (v === Is)
            if (x && Object.freeze(x), M) {
              for (y in M)
                M.hasOwnProperty(y) && (!x || !x.hasOwnProperty(y)) && (g || (g = {}), g[y] = "");
              for (y in x)
                x.hasOwnProperty(y) && M[y] !== x[y] && (g || (g = {}), g[y] = x[y]);
            } else
              g || (s || (s = []), s.push(v, g)), g = x;
          else if (v === ap) {
            var A = x ? x[Th] : void 0, F = M ? M[Th] : void 0;
            A != null && F !== A && (s = s || []).push(v, A);
          } else v === Bs ? (typeof x == "string" || typeof x == "number") && (s = s || []).push(v, "" + x) : v === Rh || v === ko || (Ze.hasOwnProperty(v) ? (x != null && (typeof x != "function" && bh(v, x), v === "onScroll" && Sn("scroll", e)), !s && M !== x && (s = [])) : (s = s || []).push(v, x));
      }
      return g && (ay(g, p[Is]), (s = s || []).push(Is, g)), s;
    }
    function YT(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = Tl(a, i), f = Tl(a, u);
      switch (HT(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          av(e, u);
          break;
        case "select":
          sc(e, u);
          break;
      }
    }
    function $T(e) {
      {
        var t = e.toLowerCase();
        return ts.hasOwnProperty(t) && ts[t] || null;
      }
    }
    function QT(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = Tl(t, a), xh(t, a), t) {
        case "dialog":
          Sn("cancel", e), Sn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Sn("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < tp.length; y++)
            Sn(tp[y], e);
          break;
        case "source":
          Sn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Sn("error", e), Sn("load", e);
          break;
        case "details":
          Sn("toggle", e);
          break;
        case "input":
          ei(e, a), Sn("invalid", e);
          break;
        case "option":
          kt(e, a);
          break;
        case "select":
          ou(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Zf(e, a), Sn("invalid", e);
          break;
      }
      dc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var g = e.attributes, w = 0; w < g.length; w++) {
          var x = g[w].name.toLowerCase();
          switch (x) {
            // Controlled attributes are not validated
            // TODO: Only ignore them on controlled tags.
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(g[w].name);
          }
        }
      }
      var M = null;
      for (var A in a)
        if (a.hasOwnProperty(A)) {
          var F = a[A];
          if (A === Bs)
            typeof F == "string" ? e.textContent !== F && (a[ko] !== !0 && _h(e.textContent, F, s, f), M = [Bs, F]) : typeof F == "number" && e.textContent !== "" + F && (a[ko] !== !0 && _h(e.textContent, F, s, f), M = [Bs, "" + F]);
          else if (Ze.hasOwnProperty(A))
            F != null && (typeof F != "function" && bh(A, F), A === "onScroll" && Sn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var oe = void 0, Me = rn(A);
            if (a[ko] !== !0) {
              if (!(A === Rh || A === ko || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              A === "value" || A === "checked" || A === "selected")) {
                if (A === ap) {
                  var we = e.innerHTML, bt = F ? F[Th] : void 0;
                  if (bt != null) {
                    var Et = UE(e, bt);
                    Et !== we && ip(A, we, Et);
                  }
                } else if (A === Is) {
                  if (v.delete(A), zE) {
                    var D = ny(F);
                    oe = e.getAttribute("style"), D !== oe && ip(A, oe, D);
                  }
                } else if (p && !_)
                  v.delete(A.toLowerCase()), oe = tu(e, A, F), F !== oe && ip(A, oe, F);
                else if (!vn(A, Me, p) && !Kn(A, F, Me, p)) {
                  var H = !1;
                  if (Me !== null)
                    v.delete(Me.attributeName), oe = vl(e, A, F, Me);
                  else {
                    var O = i;
                    if (O === Ii && (O = nd(t)), O === Ii)
                      v.delete(A.toLowerCase());
                    else {
                      var K = $T(A);
                      K !== null && K !== A && (H = !0, v.delete(K)), v.delete(A);
                    }
                    oe = tu(e, A, F);
                  }
                  var ve = _;
                  !ve && F !== oe && !H && ip(A, oe, F);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[ko] !== !0 && NE(v), t) {
        case "input":
          Za(e), z(e, a, !0);
          break;
        case "textarea":
          Za(e), iv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && kh(e);
          break;
      }
      return M;
    }
    function WT(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function My(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, S("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Ny(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function zy(e, t, a) {
      {
        if (Fa)
          return;
        Fa = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Uy(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function GT(e, t, a) {
      switch (t) {
        case "input":
          j(e, a);
          return;
        case "textarea":
          Jm(e, a);
          return;
        case "select":
          Xf(e, a);
          return;
      }
    }
    var lp = function() {
    }, up = function() {
    };
    {
      var qT = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], jE = [
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
      ], KT = jE.concat(["button"]), XT = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], FE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      up = function(e, t) {
        var a = et({}, e || FE), i = {
          tag: t
        };
        return jE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), KT.indexOf(t) !== -1 && (a.pTagInButtonScope = null), qT.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var JT = function(e, t) {
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
            return XT.indexOf(t) === -1;
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
      }, ZT = function(e, t) {
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
      }, HE = {};
      lp = function(e, t, a) {
        a = a || FE;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = JT(e, u) ? null : i, f = s ? null : ZT(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!HE[y]) {
            HE[y] = !0;
            var g = e, w = "";
            if (e === "#text" ? /\S/.test(t) ? g = "Text nodes" : (g = "Whitespace text nodes", w = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : g = "<" + e + ">", s) {
              var x = "";
              v === "table" && e === "tr" && (x += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), S("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", g, v, w, x);
            } else
              S("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", g, v);
          }
        }
      };
    }
    var Dh = "suppressHydrationWarning", Oh = "$", Lh = "/$", op = "$?", sp = "$!", ex = "style", Ay = null, jy = null;
    function tx(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case $i:
        case ad: {
          t = i === $i ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : rd(null, "");
          break;
        }
        default: {
          var s = i === Mn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = rd(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = up(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function nx(e, t, a) {
      {
        var i = e, u = rd(i.namespace, t), s = up(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function Sk(e) {
      return e;
    }
    function rx(e) {
      Ay = Fn(), jy = yT();
      var t = null;
      return Wn(!1), t;
    }
    function ax(e) {
      gT(jy), Wn(Ay), Ay = null, jy = null;
    }
    function ix(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (lp(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = up(f.ancestorInfo, e);
          lp(null, p, v);
        }
        s = f.namespace;
      }
      var y = PT(e, t, a, s);
      return dp(u, y), $y(y, t), y;
    }
    function lx(e, t) {
      e.appendChild(t);
    }
    function ux(e, t, a, i, u) {
      switch (BT(e, t, a, i), t) {
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
    function ox(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = up(f.ancestorInfo, t);
          lp(null, p, v);
        }
      }
      return IT(e, t, a, i);
    }
    function Fy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function sx(e, t, a, i) {
      {
        var u = a;
        lp(null, e, u.ancestorInfo);
      }
      var s = VT(e, t);
      return dp(i, s), s;
    }
    function cx() {
      var e = window.event;
      return e === void 0 ? za : lf(e.type);
    }
    var Hy = typeof setTimeout == "function" ? setTimeout : void 0, fx = typeof clearTimeout == "function" ? clearTimeout : void 0, Py = -1, PE = typeof Promise == "function" ? Promise : void 0, dx = typeof queueMicrotask == "function" ? queueMicrotask : typeof PE < "u" ? function(e) {
      return PE.resolve(null).then(e).catch(px);
    } : Hy;
    function px(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function vx(e, t, a, i) {
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
    function hx(e, t, a, i, u, s) {
      YT(e, t, a, i, u), $y(e, u);
    }
    function VE(e) {
      ao(e, "");
    }
    function mx(e, t, a) {
      e.nodeValue = a;
    }
    function yx(e, t) {
      e.appendChild(t);
    }
    function gx(e, t) {
      var a;
      e.nodeType === Mn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && kh(a);
    }
    function Sx(e, t, a) {
      e.insertBefore(t, a);
    }
    function Ex(e, t, a) {
      e.nodeType === Mn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Cx(e, t) {
      e.removeChild(t);
    }
    function Rx(e, t) {
      e.nodeType === Mn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Vy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Mn) {
          var s = u.data;
          if (s === Lh)
            if (i === 0) {
              e.removeChild(u), Du(t);
              return;
            } else
              i--;
          else (s === Oh || s === op || s === sp) && i++;
        }
        a = u;
      } while (a);
      Du(t);
    }
    function Tx(e, t) {
      e.nodeType === Mn ? Vy(e.parentNode, t) : e.nodeType === Wr && Vy(e, t), Du(e);
    }
    function xx(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function bx(e) {
      e.nodeValue = "";
    }
    function wx(e, t) {
      e = e;
      var a = t[ex], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = fc("display", i);
    }
    function _x(e, t) {
      e.nodeValue = t;
    }
    function kx(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function Dx(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Ox(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function Lx(e) {
      return e.nodeType !== Mn ? null : e;
    }
    function BE(e) {
      return e.data === op;
    }
    function By(e) {
      return e.data === sp;
    }
    function Mx(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Nx(e, t) {
      e._reactRetry = t;
    }
    function Mh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Wr || t === Yi)
          break;
        if (t === Mn) {
          var a = e.data;
          if (a === Oh || a === sp || a === op)
            break;
          if (a === Lh)
            return null;
        }
      }
      return e;
    }
    function cp(e) {
      return Mh(e.nextSibling);
    }
    function zx(e) {
      return Mh(e.firstChild);
    }
    function Ux(e) {
      return Mh(e.firstChild);
    }
    function Ax(e) {
      return Mh(e.nextSibling);
    }
    function jx(e, t, a, i, u, s, f) {
      dp(s, e), $y(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & pt) !== Oe;
      return QT(e, t, a, p, i, y, f);
    }
    function Fx(e, t, a, i) {
      return dp(a, e), a.mode & pt, WT(e, t);
    }
    function Hx(e, t) {
      dp(t, e);
    }
    function Px(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Lh) {
            if (a === 0)
              return cp(t);
            a--;
          } else (i === Oh || i === sp || i === op) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function IE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Oh || i === sp || i === op) {
            if (a === 0)
              return t;
            a--;
          } else i === Lh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Vx(e) {
      Du(e);
    }
    function Bx(e) {
      Du(e);
    }
    function Ix(e) {
      return e !== "head" && e !== "body";
    }
    function Yx(e, t, a, i) {
      var u = !0;
      _h(t.nodeValue, a, i, u);
    }
    function $x(e, t, a, i, u, s) {
      if (t[Dh] !== !0) {
        var f = !0;
        _h(i.nodeValue, u, s, f);
      }
    }
    function Qx(e, t) {
      t.nodeType === Wr ? My(e, t) : t.nodeType === Mn || Ny(e, t);
    }
    function Wx(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? My(a, t) : t.nodeType === Mn || Ny(a, t));
      }
    }
    function Gx(e, t, a, i, u) {
      (u || t[Dh] !== !0) && (i.nodeType === Wr ? My(a, i) : i.nodeType === Mn || Ny(a, i));
    }
    function qx(e, t, a) {
      zy(e, t);
    }
    function Kx(e, t) {
      Uy(e, t);
    }
    function Xx(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && zy(i, t);
      }
    }
    function Jx(e, t) {
      {
        var a = e.parentNode;
        a !== null && Uy(a, t);
      }
    }
    function Zx(e, t, a, i, u, s) {
      (s || t[Dh] !== !0) && zy(a, i);
    }
    function eb(e, t, a, i, u) {
      (u || t[Dh] !== !0) && Uy(a, i);
    }
    function tb(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function nb(e) {
      np(e);
    }
    var Ef = Math.random().toString(36).slice(2), Cf = "__reactFiber$" + Ef, Iy = "__reactProps$" + Ef, fp = "__reactContainer$" + Ef, Yy = "__reactEvents$" + Ef, rb = "__reactListeners$" + Ef, ab = "__reactHandles$" + Ef;
    function ib(e) {
      delete e[Cf], delete e[Iy], delete e[Yy], delete e[rb], delete e[ab];
    }
    function dp(e, t) {
      t[Cf] = e;
    }
    function Nh(e, t) {
      t[fp] = e;
    }
    function YE(e) {
      e[fp] = null;
    }
    function pp(e) {
      return !!e[fp];
    }
    function Ys(e) {
      var t = e[Cf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[fp] || a[Cf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = IE(e); u !== null; ) {
              var s = u[Cf];
              if (s)
                return s;
              u = IE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Do(e) {
      var t = e[Cf] || e[fp];
      return t && (t.tag === re || t.tag === Fe || t.tag === ee || t.tag === Z) ? t : null;
    }
    function Rf(e) {
      if (e.tag === re || e.tag === Fe)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function zh(e) {
      return e[Iy] || null;
    }
    function $y(e, t) {
      e[Iy] = t;
    }
    function lb(e) {
      var t = e[Yy];
      return t === void 0 && (t = e[Yy] = /* @__PURE__ */ new Set()), t;
    }
    var $E = {}, QE = N.ReactDebugCurrentFrame;
    function Uh(e) {
      if (e) {
        var t = e._owner, a = Pi(e.type, e._source, t ? t.type : null);
        QE.setExtraStackFrame(a);
      } else
        QE.setExtraStackFrame(null);
    }
    function nl(e, t, a, i, u) {
      {
        var s = Function.call.bind(wr);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (y) {
              p = y;
            }
            p && !(p instanceof Error) && (Uh(u), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), Uh(null)), p instanceof Error && !(p.message in $E) && ($E[p.message] = !0, Uh(u), S("Failed %s type: %s", a, p.message), Uh(null));
          }
      }
    }
    var Qy = [], Ah;
    Ah = [];
    var Uu = -1;
    function Oo(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (Uu < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== Ah[Uu] && S("Unexpected Fiber popped."), e.current = Qy[Uu], Qy[Uu] = null, Ah[Uu] = null, Uu--;
    }
    function ia(e, t, a) {
      Uu++, Qy[Uu] = e.current, Ah[Uu] = a, e.current = t;
    }
    var Wy;
    Wy = {};
    var ui = {};
    Object.freeze(ui);
    var Au = Oo(ui), Il = Oo(!1), Gy = ui;
    function Tf(e, t, a) {
      return a && Yl(t) ? Gy : Au.current;
    }
    function WE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function xf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return ui;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = $e(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && WE(e, t, s), s;
      }
    }
    function jh() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Fh(e) {
      aa(Il, e), aa(Au, e);
    }
    function qy(e) {
      aa(Il, e), aa(Au, e);
    }
    function GE(e, t, a) {
      {
        if (Au.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(Au, t, e), ia(Il, a, e);
      }
    }
    function qE(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = $e(e) || "Unknown";
            Wy[s] || (Wy[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error(($e(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = $e(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return et({}, a, f);
      }
    }
    function Hh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return Gy = Au.current, ia(Au, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function KE(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = qE(e, t, Gy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(Au, e), ia(Au, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function ub(e) {
      {
        if (!hu(e) || e.tag !== pe)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case Z:
              return t.stateNode.context;
            case pe: {
              var a = t.type;
              if (Yl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Lo = 0, Ph = 1, ju = null, Ky = !1, Xy = !1;
    function XE(e) {
      ju === null ? ju = [e] : ju.push(e);
    }
    function ob(e) {
      Ky = !0, XE(e);
    }
    function JE() {
      Ky && Mo();
    }
    function Mo() {
      if (!Xy && ju !== null) {
        Xy = !0;
        var e = 0, t = Aa();
        try {
          var a = !0, i = ju;
          for (jn(Mr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          ju = null, Ky = !1;
        } catch (s) {
          throw ju !== null && (ju = ju.slice(e + 1)), md(ss, Mo), s;
        } finally {
          jn(t), Xy = !1;
        }
      }
      return null;
    }
    var bf = [], wf = 0, Vh = null, Bh = 0, Mi = [], Ni = 0, $s = null, Fu = 1, Hu = "";
    function sb(e) {
      return Ws(), (e.flags & Ri) !== De;
    }
    function cb(e) {
      return Ws(), Bh;
    }
    function fb() {
      var e = Hu, t = Fu, a = t & ~db(t);
      return a.toString(32) + e;
    }
    function Qs(e, t) {
      Ws(), bf[wf++] = Bh, bf[wf++] = Vh, Vh = e, Bh = t;
    }
    function ZE(e, t, a) {
      Ws(), Mi[Ni++] = Fu, Mi[Ni++] = Hu, Mi[Ni++] = $s, $s = e;
      var i = Fu, u = Hu, s = Ih(i) - 1, f = i & ~(1 << s), p = a + 1, v = Ih(t) + s;
      if (v > 30) {
        var y = s - s % 5, g = (1 << y) - 1, w = (f & g).toString(32), x = f >> y, M = s - y, A = Ih(t) + M, F = p << M, oe = F | x, Me = w + u;
        Fu = 1 << A | oe, Hu = Me;
      } else {
        var we = p << s, bt = we | f, Et = u;
        Fu = 1 << v | bt, Hu = Et;
      }
    }
    function Jy(e) {
      Ws();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Qs(e, a), ZE(e, a, i);
      }
    }
    function Ih(e) {
      return 32 - Un(e);
    }
    function db(e) {
      return 1 << Ih(e) - 1;
    }
    function Zy(e) {
      for (; e === Vh; )
        Vh = bf[--wf], bf[wf] = null, Bh = bf[--wf], bf[wf] = null;
      for (; e === $s; )
        $s = Mi[--Ni], Mi[Ni] = null, Hu = Mi[--Ni], Mi[Ni] = null, Fu = Mi[--Ni], Mi[Ni] = null;
    }
    function pb() {
      return Ws(), $s !== null ? {
        id: Fu,
        overflow: Hu
      } : null;
    }
    function vb(e, t) {
      Ws(), Mi[Ni++] = Fu, Mi[Ni++] = Hu, Mi[Ni++] = $s, Fu = t.id, Hu = t.overflow, $s = e;
    }
    function Ws() {
      jr() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ar = null, zi = null, rl = !1, Gs = !1, No = null;
    function hb() {
      rl && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function eC() {
      Gs = !0;
    }
    function mb() {
      return Gs;
    }
    function yb(e) {
      var t = e.stateNode.containerInfo;
      return zi = Ux(t), Ar = e, rl = !0, No = null, Gs = !1, !0;
    }
    function gb(e, t, a) {
      return zi = Ax(t), Ar = e, rl = !0, No = null, Gs = !1, a !== null && vb(e, a), !0;
    }
    function tC(e, t) {
      switch (e.tag) {
        case Z: {
          Qx(e.stateNode.containerInfo, t);
          break;
        }
        case re: {
          var a = (e.mode & pt) !== Oe;
          Gx(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case ee: {
          var i = e.memoizedState;
          i.dehydrated !== null && Wx(i.dehydrated, t);
          break;
        }
      }
    }
    function nC(e, t) {
      tC(e, t);
      var a = R_();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Da) : i.push(a);
    }
    function eg(e, t) {
      {
        if (Gs)
          return;
        switch (e.tag) {
          case Z: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case re:
                var i = t.type;
                t.pendingProps, qx(a, i);
                break;
              case Fe:
                var u = t.pendingProps;
                Kx(a, u);
                break;
            }
            break;
          }
          case re: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case re: {
                var v = t.type, y = t.pendingProps, g = (e.mode & pt) !== Oe;
                Zx(
                  s,
                  f,
                  p,
                  v,
                  y,
                  // TODO: Delete this argument when we remove the legacy root API.
                  g
                );
                break;
              }
              case Fe: {
                var w = t.pendingProps, x = (e.mode & pt) !== Oe;
                eb(
                  s,
                  f,
                  p,
                  w,
                  // TODO: Delete this argument when we remove the legacy root API.
                  x
                );
                break;
              }
            }
            break;
          }
          case ee: {
            var M = e.memoizedState, A = M.dehydrated;
            if (A !== null) switch (t.tag) {
              case re:
                var F = t.type;
                t.pendingProps, Xx(A, F);
                break;
              case Fe:
                var oe = t.pendingProps;
                Jx(A, oe);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function rC(e, t) {
      t.flags = t.flags & ~qr | mn, eg(e, t);
    }
    function aC(e, t) {
      switch (e.tag) {
        case re: {
          var a = e.type;
          e.pendingProps;
          var i = Dx(t, a);
          return i !== null ? (e.stateNode = i, Ar = e, zi = zx(i), !0) : !1;
        }
        case Fe: {
          var u = e.pendingProps, s = Ox(t, u);
          return s !== null ? (e.stateNode = s, Ar = e, zi = null, !0) : !1;
        }
        case ee: {
          var f = Lx(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: pb(),
              retryLane: Zr
            };
            e.memoizedState = p;
            var v = T_(f);
            return v.return = e, e.child = v, Ar = e, zi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function tg(e) {
      return (e.mode & pt) !== Oe && (e.flags & ke) === De;
    }
    function ng(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function rg(e) {
      if (rl) {
        var t = zi;
        if (!t) {
          tg(e) && (eg(Ar, e), ng()), rC(Ar, e), rl = !1, Ar = e;
          return;
        }
        var a = t;
        if (!aC(e, t)) {
          tg(e) && (eg(Ar, e), ng()), t = cp(a);
          var i = Ar;
          if (!t || !aC(e, t)) {
            rC(Ar, e), rl = !1, Ar = e;
            return;
          }
          nC(i, a);
        }
      }
    }
    function Sb(e, t, a) {
      var i = e.stateNode, u = !Gs, s = jx(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function Eb(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Fx(t, a, e);
      if (i) {
        var u = Ar;
        if (u !== null)
          switch (u.tag) {
            case Z: {
              var s = u.stateNode.containerInfo, f = (u.mode & pt) !== Oe;
              Yx(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case re: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, g = (u.mode & pt) !== Oe;
              $x(
                p,
                v,
                y,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                g
              );
              break;
            }
          }
      }
      return i;
    }
    function Cb(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Hx(a, e);
    }
    function Rb(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Px(a);
    }
    function iC(e) {
      for (var t = e.return; t !== null && t.tag !== re && t.tag !== Z && t.tag !== ee; )
        t = t.return;
      Ar = t;
    }
    function Yh(e) {
      if (e !== Ar)
        return !1;
      if (!rl)
        return iC(e), rl = !0, !1;
      if (e.tag !== Z && (e.tag !== re || Ix(e.type) && !Fy(e.type, e.memoizedProps))) {
        var t = zi;
        if (t)
          if (tg(e))
            lC(e), ng();
          else
            for (; t; )
              nC(e, t), t = cp(t);
      }
      return iC(e), e.tag === ee ? zi = Rb(e) : zi = Ar ? cp(e.stateNode) : null, !0;
    }
    function Tb() {
      return rl && zi !== null;
    }
    function lC(e) {
      for (var t = zi; t; )
        tC(e, t), t = cp(t);
    }
    function _f() {
      Ar = null, zi = null, rl = !1, Gs = !1;
    }
    function uC() {
      No !== null && (eR(No), No = null);
    }
    function jr() {
      return rl;
    }
    function ag(e) {
      No === null ? No = [e] : No.push(e);
    }
    var xb = N.ReactCurrentBatchConfig, bb = null;
    function wb() {
      return xb.transition;
    }
    var al = {
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
      var _b = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Xt && (t = a), a = a.return;
        return t;
      }, qs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, vp = [], hp = [], mp = [], yp = [], gp = [], Sp = [], Ks = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Ks.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && vp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillMount == "function" && hp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillReceiveProps == "function" && yp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & Xt && typeof t.UNSAFE_componentWillUpdate == "function" && Sp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(x) {
          e.add($e(x) || "Component"), Ks.add(x.type);
        }), vp = []);
        var t = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(x) {
          t.add($e(x) || "Component"), Ks.add(x.type);
        }), hp = []);
        var a = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(x) {
          a.add($e(x) || "Component"), Ks.add(x.type);
        }), mp = []);
        var i = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(x) {
          i.add($e(x) || "Component"), Ks.add(x.type);
        }), yp = []);
        var u = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(x) {
          u.add($e(x) || "Component"), Ks.add(x.type);
        }), gp = []);
        var s = /* @__PURE__ */ new Set();
        if (Sp.length > 0 && (Sp.forEach(function(x) {
          s.add($e(x) || "Component"), Ks.add(x.type);
        }), Sp = []), t.size > 0) {
          var f = qs(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = qs(i);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = qs(s);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = qs(e);
          gt(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var g = qs(a);
          gt(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, g);
        }
        if (u.size > 0) {
          var w = qs(u);
          gt(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, w);
        }
      };
      var $h = /* @__PURE__ */ new Map(), oC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = _b(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!oC.has(e.type)) {
          var i = $h.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], $h.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        $h.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add($e(s) || "Component"), oC.add(s.type);
            });
            var u = qs(i);
            try {
              Gt(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              cn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        vp = [], hp = [], mp = [], yp = [], gp = [], Sp = [], $h = /* @__PURE__ */ new Map();
      };
    }
    var ig, lg, ug, og, sg, sC = function(e, t) {
    };
    ig = !1, lg = !1, ug = {}, og = {}, sg = {}, sC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = $e(t) || "Component";
        og[a] || (og[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function kb(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Ep(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Xt || P) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== pe) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !kb(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = $e(e) || "Component";
          ug[u] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), ug[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== pe)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          ci(i, "ref");
          var y = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === y)
            return t.ref;
          var g = function(w) {
            var x = v.refs;
            w === null ? delete x[y] : x[y] = w;
          };
          return g._stringRef = y, g;
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
    function Qh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Wh(e) {
      {
        var t = $e(e) || "Component";
        if (sg[t])
          return;
        sg[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function cC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function fC(e) {
      function t(D, H) {
        if (e) {
          var O = D.deletions;
          O === null ? (D.deletions = [H], D.flags |= Da) : O.push(H);
        }
      }
      function a(D, H) {
        if (!e)
          return null;
        for (var O = H; O !== null; )
          t(D, O), O = O.sibling;
        return null;
      }
      function i(D, H) {
        for (var O = /* @__PURE__ */ new Map(), K = H; K !== null; )
          K.key !== null ? O.set(K.key, K) : O.set(K.index, K), K = K.sibling;
        return O;
      }
      function u(D, H) {
        var O = ic(D, H);
        return O.index = 0, O.sibling = null, O;
      }
      function s(D, H, O) {
        if (D.index = O, !e)
          return D.flags |= Ri, H;
        var K = D.alternate;
        if (K !== null) {
          var ve = K.index;
          return ve < H ? (D.flags |= mn, H) : ve;
        } else
          return D.flags |= mn, H;
      }
      function f(D) {
        return e && D.alternate === null && (D.flags |= mn), D;
      }
      function p(D, H, O, K) {
        if (H === null || H.tag !== Fe) {
          var ve = aE(O, D.mode, K);
          return ve.return = D, ve;
        } else {
          var se = u(H, O);
          return se.return = D, se;
        }
      }
      function v(D, H, O, K) {
        var ve = O.type;
        if (ve === di)
          return g(D, H, O.props.children, K, O.key);
        if (H !== null && (H.elementType === ve || // Keep this check inline so it only runs on the false path:
        mR(H, O) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof ve == "object" && ve !== null && ve.$$typeof === Qe && cC(ve) === H.type)) {
          var se = u(H, O.props);
          return se.ref = Ep(D, H, O), se.return = D, se._debugSource = O._source, se._debugOwner = O._owner, se;
        }
        var Be = rE(O, D.mode, K);
        return Be.ref = Ep(D, H, O), Be.return = D, Be;
      }
      function y(D, H, O, K) {
        if (H === null || H.tag !== ye || H.stateNode.containerInfo !== O.containerInfo || H.stateNode.implementation !== O.implementation) {
          var ve = iE(O, D.mode, K);
          return ve.return = D, ve;
        } else {
          var se = u(H, O.children || []);
          return se.return = D, se;
        }
      }
      function g(D, H, O, K, ve) {
        if (H === null || H.tag !== nt) {
          var se = Yo(O, D.mode, K, ve);
          return se.return = D, se;
        } else {
          var Be = u(H, O);
          return Be.return = D, Be;
        }
      }
      function w(D, H, O) {
        if (typeof H == "string" && H !== "" || typeof H == "number") {
          var K = aE("" + H, D.mode, O);
          return K.return = D, K;
        }
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case kr: {
              var ve = rE(H, D.mode, O);
              return ve.ref = Ep(D, null, H), ve.return = D, ve;
            }
            case rr: {
              var se = iE(H, D.mode, O);
              return se.return = D, se;
            }
            case Qe: {
              var Be = H._payload, qe = H._init;
              return w(D, qe(Be), O);
            }
          }
          if (ut(H) || Xe(H)) {
            var Zt = Yo(H, D.mode, O, null);
            return Zt.return = D, Zt;
          }
          Qh(D, H);
        }
        return typeof H == "function" && Wh(D), null;
      }
      function x(D, H, O, K) {
        var ve = H !== null ? H.key : null;
        if (typeof O == "string" && O !== "" || typeof O == "number")
          return ve !== null ? null : p(D, H, "" + O, K);
        if (typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case kr:
              return O.key === ve ? v(D, H, O, K) : null;
            case rr:
              return O.key === ve ? y(D, H, O, K) : null;
            case Qe: {
              var se = O._payload, Be = O._init;
              return x(D, H, Be(se), K);
            }
          }
          if (ut(O) || Xe(O))
            return ve !== null ? null : g(D, H, O, K, null);
          Qh(D, O);
        }
        return typeof O == "function" && Wh(D), null;
      }
      function M(D, H, O, K, ve) {
        if (typeof K == "string" && K !== "" || typeof K == "number") {
          var se = D.get(O) || null;
          return p(H, se, "" + K, ve);
        }
        if (typeof K == "object" && K !== null) {
          switch (K.$$typeof) {
            case kr: {
              var Be = D.get(K.key === null ? O : K.key) || null;
              return v(H, Be, K, ve);
            }
            case rr: {
              var qe = D.get(K.key === null ? O : K.key) || null;
              return y(H, qe, K, ve);
            }
            case Qe:
              var Zt = K._payload, Ft = K._init;
              return M(D, H, O, Ft(Zt), ve);
          }
          if (ut(K) || Xe(K)) {
            var Gn = D.get(O) || null;
            return g(H, Gn, K, ve, null);
          }
          Qh(H, K);
        }
        return typeof K == "function" && Wh(H), null;
      }
      function A(D, H, O) {
        {
          if (typeof D != "object" || D === null)
            return H;
          switch (D.$$typeof) {
            case kr:
            case rr:
              sC(D, O);
              var K = D.key;
              if (typeof K != "string")
                break;
              if (H === null) {
                H = /* @__PURE__ */ new Set(), H.add(K);
                break;
              }
              if (!H.has(K)) {
                H.add(K);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", K);
              break;
            case Qe:
              var ve = D._payload, se = D._init;
              A(se(ve), H, O);
              break;
          }
        }
        return H;
      }
      function F(D, H, O, K) {
        for (var ve = null, se = 0; se < O.length; se++) {
          var Be = O[se];
          ve = A(Be, ve, D);
        }
        for (var qe = null, Zt = null, Ft = H, Gn = 0, Ht = 0, Pn = null; Ft !== null && Ht < O.length; Ht++) {
          Ft.index > Ht ? (Pn = Ft, Ft = null) : Pn = Ft.sibling;
          var ua = x(D, Ft, O[Ht], K);
          if (ua === null) {
            Ft === null && (Ft = Pn);
            break;
          }
          e && Ft && ua.alternate === null && t(D, Ft), Gn = s(ua, Gn, Ht), Zt === null ? qe = ua : Zt.sibling = ua, Zt = ua, Ft = Pn;
        }
        if (Ht === O.length) {
          if (a(D, Ft), jr()) {
            var Yr = Ht;
            Qs(D, Yr);
          }
          return qe;
        }
        if (Ft === null) {
          for (; Ht < O.length; Ht++) {
            var si = w(D, O[Ht], K);
            si !== null && (Gn = s(si, Gn, Ht), Zt === null ? qe = si : Zt.sibling = si, Zt = si);
          }
          if (jr()) {
            var Ra = Ht;
            Qs(D, Ra);
          }
          return qe;
        }
        for (var Ta = i(D, Ft); Ht < O.length; Ht++) {
          var oa = M(Ta, D, Ht, O[Ht], K);
          oa !== null && (e && oa.alternate !== null && Ta.delete(oa.key === null ? Ht : oa.key), Gn = s(oa, Gn, Ht), Zt === null ? qe = oa : Zt.sibling = oa, Zt = oa);
        }
        if (e && Ta.forEach(function(Qf) {
          return t(D, Qf);
        }), jr()) {
          var Qu = Ht;
          Qs(D, Qu);
        }
        return qe;
      }
      function oe(D, H, O, K) {
        var ve = Xe(O);
        if (typeof ve != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          O[Symbol.toStringTag] === "Generator" && (lg || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), lg = !0), O.entries === ve && (ig || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), ig = !0);
          var se = ve.call(O);
          if (se)
            for (var Be = null, qe = se.next(); !qe.done; qe = se.next()) {
              var Zt = qe.value;
              Be = A(Zt, Be, D);
            }
        }
        var Ft = ve.call(O);
        if (Ft == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Gn = null, Ht = null, Pn = H, ua = 0, Yr = 0, si = null, Ra = Ft.next(); Pn !== null && !Ra.done; Yr++, Ra = Ft.next()) {
          Pn.index > Yr ? (si = Pn, Pn = null) : si = Pn.sibling;
          var Ta = x(D, Pn, Ra.value, K);
          if (Ta === null) {
            Pn === null && (Pn = si);
            break;
          }
          e && Pn && Ta.alternate === null && t(D, Pn), ua = s(Ta, ua, Yr), Ht === null ? Gn = Ta : Ht.sibling = Ta, Ht = Ta, Pn = si;
        }
        if (Ra.done) {
          if (a(D, Pn), jr()) {
            var oa = Yr;
            Qs(D, oa);
          }
          return Gn;
        }
        if (Pn === null) {
          for (; !Ra.done; Yr++, Ra = Ft.next()) {
            var Qu = w(D, Ra.value, K);
            Qu !== null && (ua = s(Qu, ua, Yr), Ht === null ? Gn = Qu : Ht.sibling = Qu, Ht = Qu);
          }
          if (jr()) {
            var Qf = Yr;
            Qs(D, Qf);
          }
          return Gn;
        }
        for (var Jp = i(D, Pn); !Ra.done; Yr++, Ra = Ft.next()) {
          var Jl = M(Jp, D, Yr, Ra.value, K);
          Jl !== null && (e && Jl.alternate !== null && Jp.delete(Jl.key === null ? Yr : Jl.key), ua = s(Jl, ua, Yr), Ht === null ? Gn = Jl : Ht.sibling = Jl, Ht = Jl);
        }
        if (e && Jp.forEach(function(ek) {
          return t(D, ek);
        }), jr()) {
          var Z_ = Yr;
          Qs(D, Z_);
        }
        return Gn;
      }
      function Me(D, H, O, K) {
        if (H !== null && H.tag === Fe) {
          a(D, H.sibling);
          var ve = u(H, O);
          return ve.return = D, ve;
        }
        a(D, H);
        var se = aE(O, D.mode, K);
        return se.return = D, se;
      }
      function we(D, H, O, K) {
        for (var ve = O.key, se = H; se !== null; ) {
          if (se.key === ve) {
            var Be = O.type;
            if (Be === di) {
              if (se.tag === nt) {
                a(D, se.sibling);
                var qe = u(se, O.props.children);
                return qe.return = D, qe._debugSource = O._source, qe._debugOwner = O._owner, qe;
              }
            } else if (se.elementType === Be || // Keep this check inline so it only runs on the false path:
            mR(se, O) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Be == "object" && Be !== null && Be.$$typeof === Qe && cC(Be) === se.type) {
              a(D, se.sibling);
              var Zt = u(se, O.props);
              return Zt.ref = Ep(D, se, O), Zt.return = D, Zt._debugSource = O._source, Zt._debugOwner = O._owner, Zt;
            }
            a(D, se);
            break;
          } else
            t(D, se);
          se = se.sibling;
        }
        if (O.type === di) {
          var Ft = Yo(O.props.children, D.mode, K, O.key);
          return Ft.return = D, Ft;
        } else {
          var Gn = rE(O, D.mode, K);
          return Gn.ref = Ep(D, H, O), Gn.return = D, Gn;
        }
      }
      function bt(D, H, O, K) {
        for (var ve = O.key, se = H; se !== null; ) {
          if (se.key === ve)
            if (se.tag === ye && se.stateNode.containerInfo === O.containerInfo && se.stateNode.implementation === O.implementation) {
              a(D, se.sibling);
              var Be = u(se, O.children || []);
              return Be.return = D, Be;
            } else {
              a(D, se);
              break;
            }
          else
            t(D, se);
          se = se.sibling;
        }
        var qe = iE(O, D.mode, K);
        return qe.return = D, qe;
      }
      function Et(D, H, O, K) {
        var ve = typeof O == "object" && O !== null && O.type === di && O.key === null;
        if (ve && (O = O.props.children), typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case kr:
              return f(we(D, H, O, K));
            case rr:
              return f(bt(D, H, O, K));
            case Qe:
              var se = O._payload, Be = O._init;
              return Et(D, H, Be(se), K);
          }
          if (ut(O))
            return F(D, H, O, K);
          if (Xe(O))
            return oe(D, H, O, K);
          Qh(D, O);
        }
        return typeof O == "string" && O !== "" || typeof O == "number" ? f(Me(D, H, "" + O, K)) : (typeof O == "function" && Wh(D), a(D, H));
      }
      return Et;
    }
    var kf = fC(!0), dC = fC(!1);
    function Db(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ic(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ic(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Ob(e, t) {
      for (var a = e.child; a !== null; )
        y_(a, t), a = a.sibling;
    }
    var cg = Oo(null), fg;
    fg = {};
    var Gh = null, Df = null, dg = null, qh = !1;
    function Kh() {
      Gh = null, Df = null, dg = null, qh = !1;
    }
    function pC() {
      qh = !0;
    }
    function vC() {
      qh = !1;
    }
    function hC(e, t, a) {
      ia(cg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== fg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = fg;
    }
    function pg(e, t) {
      var a = cg.current;
      aa(cg, t), e._currentValue = a;
    }
    function vg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (ku(i.childLanes, t) ? u !== null && !ku(u.childLanes, t) && (u.childLanes = Je(u.childLanes, t)) : (i.childLanes = Je(i.childLanes, t), u !== null && (u.childLanes = Je(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Lb(e, t, a) {
      Mb(e, t, a);
    }
    function Mb(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === pe) {
                var p = Ts(a), v = Pu(en, p);
                v.tag = Jh;
                var y = i.updateQueue;
                if (y !== null) {
                  var g = y.shared, w = g.pending;
                  w === null ? v.next = v : (v.next = w.next, w.next = v), g.pending = v;
                }
              }
              i.lanes = Je(i.lanes, a);
              var x = i.alternate;
              x !== null && (x.lanes = Je(x.lanes, a)), vg(i.return, a, e), s.lanes = Je(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === ot)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === st) {
          var M = i.return;
          if (M === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          M.lanes = Je(M.lanes, a);
          var A = M.alternate;
          A !== null && (A.lanes = Je(A.lanes, a)), vg(M, a, e), u = i.sibling;
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
            var F = u.sibling;
            if (F !== null) {
              F.return = u.return, u = F;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Of(e, t) {
      Gh = e, Df = null, dg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && Up(), a.firstContext = null);
      }
    }
    function tr(e) {
      qh && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (dg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (Gh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, Gh.dependencies = {
            lanes: Y,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Xs = null;
    function hg(e) {
      Xs === null ? Xs = [e] : Xs.push(e);
    }
    function Nb() {
      if (Xs !== null) {
        for (var e = 0; e < Xs.length; e++) {
          var t = Xs[e], a = t.interleaved;
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
        Xs = null;
      }
    }
    function mC(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Xh(e, i);
    }
    function zb(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Ub(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Xh(e, i);
    }
    function Ha(e, t) {
      return Xh(e, t);
    }
    var Ab = Xh;
    function Xh(e, t) {
      e.lanes = Je(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = Je(a.lanes, t)), a === null && (e.flags & (mn | qr)) !== De && dR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = Je(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = Je(a.childLanes, t) : (u.flags & (mn | qr)) !== De && dR(e), i = u, u = u.return;
      if (i.tag === Z) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var yC = 0, gC = 1, Jh = 2, mg = 3, Zh = !1, yg, em;
    yg = !1, em = null;
    function gg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: Y
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function SC(e, t) {
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
    function Pu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: yC,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function zo(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (em === u && !yg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), yg = !0), z1()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Ab(e, a);
      } else
        return Ub(e, u, t, a);
    }
    function tm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Nd(a)) {
          var s = u.lanes;
          s = Ud(s, e.pendingLanes);
          var f = Je(s, a);
          u.lanes = f, tf(e, f);
        }
      }
    }
    function Sg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var y = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = y : (f.next = y, f = y), v = v.next;
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
      var g = a.lastBaseUpdate;
      g === null ? a.firstBaseUpdate = t : g.next = t, a.lastBaseUpdate = t;
    }
    function jb(e, t, a, i, u, s) {
      switch (a.tag) {
        case gC: {
          var f = a.payload;
          if (typeof f == "function") {
            pC();
            var p = f.call(s, i, u);
            {
              if (e.mode & Xt) {
                yn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  yn(!1);
                }
              }
              vC();
            }
            return p;
          }
          return f;
        }
        case mg:
          e.flags = e.flags & ~Xn | ke;
        // Intentional fallthrough
        case yC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            pC(), y = v.call(s, i, u);
            {
              if (e.mode & Xt) {
                yn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  yn(!1);
                }
              }
              vC();
            }
          } else
            y = v;
          return y == null ? i : et({}, i, y);
        }
        case Jh:
          return Zh = !0, i;
      }
      return i;
    }
    function nm(e, t, a, i) {
      var u = e.updateQueue;
      Zh = !1, em = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var g = e.alternate;
        if (g !== null) {
          var w = g.updateQueue, x = w.lastBaseUpdate;
          x !== f && (x === null ? w.firstBaseUpdate = y : x.next = y, w.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var M = u.baseState, A = Y, F = null, oe = null, Me = null, we = s;
        do {
          var bt = we.lane, Et = we.eventTime;
          if (ku(i, bt)) {
            if (Me !== null) {
              var H = {
                eventTime: Et,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Mt,
                tag: we.tag,
                payload: we.payload,
                callback: we.callback,
                next: null
              };
              Me = Me.next = H;
            }
            M = jb(e, u, we, M, t, a);
            var O = we.callback;
            if (O !== null && // If the update was already committed, we should not queue its
            // callback again.
            we.lane !== Mt) {
              e.flags |= un;
              var K = u.effects;
              K === null ? u.effects = [we] : K.push(we);
            }
          } else {
            var D = {
              eventTime: Et,
              lane: bt,
              tag: we.tag,
              payload: we.payload,
              callback: we.callback,
              next: null
            };
            Me === null ? (oe = Me = D, F = M) : Me = Me.next = D, A = Je(A, bt);
          }
          if (we = we.next, we === null) {
            if (p = u.shared.pending, p === null)
              break;
            var ve = p, se = ve.next;
            ve.next = null, we = se, u.lastBaseUpdate = ve, u.shared.pending = null;
          }
        } while (!0);
        Me === null && (F = M), u.baseState = F, u.firstBaseUpdate = oe, u.lastBaseUpdate = Me;
        var Be = u.shared.interleaved;
        if (Be !== null) {
          var qe = Be;
          do
            A = Je(A, qe.lane), qe = qe.next;
          while (qe !== Be);
        } else s === null && (u.shared.lanes = Y);
        Wp(A), e.lanes = A, e.memoizedState = M;
      }
      em = null;
    }
    function Fb(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function EC() {
      Zh = !1;
    }
    function rm() {
      return Zh;
    }
    function CC(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Fb(f, a));
        }
    }
    var Cp = {}, Uo = Oo(Cp), Rp = Oo(Cp), am = Oo(Cp);
    function im(e) {
      if (e === Cp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function RC() {
      var e = im(am.current);
      return e;
    }
    function Eg(e, t) {
      ia(am, t, e), ia(Rp, e, e), ia(Uo, Cp, e);
      var a = tx(t);
      aa(Uo, e), ia(Uo, a, e);
    }
    function Lf(e) {
      aa(Uo, e), aa(Rp, e), aa(am, e);
    }
    function Cg() {
      var e = im(Uo.current);
      return e;
    }
    function TC(e) {
      im(am.current);
      var t = im(Uo.current), a = nx(t, e.type);
      t !== a && (ia(Rp, e, e), ia(Uo, a, e));
    }
    function Rg(e) {
      Rp.current === e && (aa(Uo, e), aa(Rp, e));
    }
    var Hb = 0, xC = 1, bC = 1, Tp = 2, il = Oo(Hb);
    function Tg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & xC;
    }
    function xg(e, t) {
      return e & xC | t;
    }
    function Pb(e, t) {
      return e | t;
    }
    function Ao(e, t) {
      ia(il, t, e);
    }
    function Nf(e) {
      aa(il, e);
    }
    function Vb(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function lm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === ee) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || BE(i) || By(i))
              return t;
          }
        } else if (t.tag === ht && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & ke) !== De;
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
    var Pa = (
      /*   */
      0
    ), cr = (
      /* */
      1
    ), $l = (
      /*  */
      2
    ), fr = (
      /*    */
      4
    ), Fr = (
      /*   */
      8
    ), bg = [];
    function wg() {
      for (var e = 0; e < bg.length; e++) {
        var t = bg[e];
        t._workInProgressVersionPrimary = null;
      }
      bg.length = 0;
    }
    function Bb(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var de = N.ReactCurrentDispatcher, xp = N.ReactCurrentBatchConfig, _g, zf;
    _g = /* @__PURE__ */ new Set();
    var Js = Y, Jt = null, dr = null, pr = null, um = !1, bp = !1, wp = 0, Ib = 0, Yb = 25, V = null, Ui = null, jo = -1, kg = !1;
    function It() {
      {
        var e = V;
        Ui === null ? Ui = [e] : Ui.push(e);
      }
    }
    function ne() {
      {
        var e = V;
        Ui !== null && (jo++, Ui[jo] !== e && $b(e));
      }
    }
    function Uf(e) {
      e != null && !ut(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", V, typeof e);
    }
    function $b(e) {
      {
        var t = $e(Jt);
        if (!_g.has(t) && (_g.add(t), Ui !== null)) {
          for (var a = "", i = 30, u = 0; u <= jo; u++) {
            for (var s = Ui[u], f = u === jo ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function la() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function Dg(e, t) {
      if (kg)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", V), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, V, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!G(e[a], t[a]))
          return !1;
      return !0;
    }
    function Af(e, t, a, i, u, s) {
      Js = s, Jt = t, Ui = e !== null ? e._debugHookTypes : null, jo = -1, kg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = Y, e !== null && e.memoizedState !== null ? de.current = WC : Ui !== null ? de.current = QC : de.current = $C;
      var f = a(i, u);
      if (bp) {
        var p = 0;
        do {
          if (bp = !1, wp = 0, p >= Yb)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, kg = !1, dr = null, pr = null, t.updateQueue = null, jo = -1, de.current = GC, f = a(i, u);
        } while (bp);
      }
      de.current = Em, t._debugHookTypes = Ui;
      var v = dr !== null && dr.next !== null;
      if (Js = Y, Jt = null, dr = null, pr = null, V = null, Ui = null, jo = -1, e !== null && (e.flags & zn) !== (t.flags & zn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & pt) !== Oe && S("Internal React error: Expected static flag was missing. Please notify the React team."), um = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function jf() {
      var e = wp !== 0;
      return wp = 0, e;
    }
    function wC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & At) !== Oe ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = xs(e.lanes, a);
    }
    function _C() {
      if (de.current = Em, um) {
        for (var e = Jt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        um = !1;
      }
      Js = Y, Jt = null, dr = null, pr = null, Ui = null, jo = -1, V = null, PC = !1, bp = !1, wp = 0;
    }
    function Ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return pr === null ? Jt.memoizedState = pr = e : pr = pr.next = e, pr;
    }
    function Ai() {
      var e;
      if (dr === null) {
        var t = Jt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = dr.next;
      var a;
      if (pr === null ? a = Jt.memoizedState : a = pr.next, a !== null)
        pr = a, a = pr.next, dr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        dr = e;
        var i = {
          memoizedState: dr.memoizedState,
          baseState: dr.baseState,
          baseQueue: dr.baseQueue,
          queue: dr.queue,
          next: null
        };
        pr === null ? Jt.memoizedState = pr = i : pr = pr.next = i;
      }
      return pr;
    }
    function kC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Og(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Lg(e, t, a) {
      var i = Ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: Y,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = qb.bind(null, Jt, s);
      return [i.memoizedState, f];
    }
    function Mg(e, t, a) {
      var i = Ai(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = dr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var g = f.next, w = s.baseState, x = null, M = null, A = null, F = g;
        do {
          var oe = F.lane;
          if (ku(Js, oe)) {
            if (A !== null) {
              var we = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Mt,
                action: F.action,
                hasEagerState: F.hasEagerState,
                eagerState: F.eagerState,
                next: null
              };
              A = A.next = we;
            }
            if (F.hasEagerState)
              w = F.eagerState;
            else {
              var bt = F.action;
              w = e(w, bt);
            }
          } else {
            var Me = {
              lane: oe,
              action: F.action,
              hasEagerState: F.hasEagerState,
              eagerState: F.eagerState,
              next: null
            };
            A === null ? (M = A = Me, x = w) : A = A.next = Me, Jt.lanes = Je(Jt.lanes, oe), Wp(oe);
          }
          F = F.next;
        } while (F !== null && F !== g);
        A === null ? x = w : A.next = M, G(w, i.memoizedState) || Up(), i.memoizedState = w, i.baseState = x, i.baseQueue = A, u.lastRenderedState = w;
      }
      var Et = u.interleaved;
      if (Et !== null) {
        var D = Et;
        do {
          var H = D.lane;
          Jt.lanes = Je(Jt.lanes, H), Wp(H), D = D.next;
        } while (D !== Et);
      } else f === null && (u.lanes = Y);
      var O = u.dispatch;
      return [i.memoizedState, O];
    }
    function Ng(e, t, a) {
      var i = Ai(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, f = u.pending, p = i.memoizedState;
      if (f !== null) {
        u.pending = null;
        var v = f.next, y = v;
        do {
          var g = y.action;
          p = e(p, g), y = y.next;
        } while (y !== v);
        G(p, i.memoizedState) || Up(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function Ek(e, t, a) {
    }
    function Ck(e, t, a) {
    }
    function zg(e, t, a) {
      var i = Jt, u = Ql(), s, f = jr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), zf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), zf = !0);
      } else {
        if (s = t(), !zf) {
          var p = t();
          G(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
        }
        var v = Hm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Js) || DC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, dm(LC.bind(null, i, y, e), [e]), i.flags |= Gr, _p(cr | Fr, OC.bind(null, i, y, s, t), void 0, null), s;
    }
    function om(e, t, a) {
      var i = Jt, u = Ai(), s = t();
      if (!zf) {
        var f = t();
        G(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
      }
      var p = u.memoizedState, v = !G(p, s);
      v && (u.memoizedState = s, Up());
      var y = u.queue;
      if (Dp(LC.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      pr !== null && pr.memoizedState.tag & cr) {
        i.flags |= Gr, _p(cr | Fr, OC.bind(null, i, y, s, t), void 0, null);
        var g = Hm();
        if (g === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(g, Js) || DC(i, t, s);
      }
      return s;
    }
    function DC(e, t, a) {
      e.flags |= vo;
      var i = {
        getSnapshot: t,
        value: a
      }, u = Jt.updateQueue;
      if (u === null)
        u = kC(), Jt.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function OC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, MC(t) && NC(e);
    }
    function LC(e, t, a) {
      var i = function() {
        MC(t) && NC(e);
      };
      return a(i);
    }
    function MC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !G(a, i);
      } catch {
        return !0;
      }
    }
    function NC(e) {
      var t = Ha(e, He);
      t !== null && yr(t, e, He, en);
    }
    function sm(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: Y,
        dispatch: null,
        lastRenderedReducer: Og,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Kb.bind(null, Jt, a);
      return [t.memoizedState, i];
    }
    function Ug(e) {
      return Mg(Og);
    }
    function Ag(e) {
      return Ng(Og);
    }
    function _p(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = Jt.updateQueue;
      if (s === null)
        s = kC(), Jt.updateQueue = s, s.lastEffect = u.next = u;
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
    function jg(e) {
      var t = Ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function cm(e) {
      var t = Ai();
      return t.memoizedState;
    }
    function kp(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      Jt.flags |= e, u.memoizedState = _p(cr | t, a, void 0, s);
    }
    function fm(e, t, a, i) {
      var u = Ai(), s = i === void 0 ? null : i, f = void 0;
      if (dr !== null) {
        var p = dr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Dg(s, v)) {
            u.memoizedState = _p(t, a, f, s);
            return;
          }
        }
      }
      Jt.flags |= e, u.memoizedState = _p(cr | t, a, f, s);
    }
    function dm(e, t) {
      return (Jt.mode & At) !== Oe ? kp(Ti | Gr | wc, Fr, e, t) : kp(Gr | wc, Fr, e, t);
    }
    function Dp(e, t) {
      return fm(Gr, Fr, e, t);
    }
    function Fg(e, t) {
      return kp(Rt, $l, e, t);
    }
    function pm(e, t) {
      return fm(Rt, $l, e, t);
    }
    function Hg(e, t) {
      var a = Rt;
      return a |= Wi, (Jt.mode & At) !== Oe && (a |= _l), kp(a, fr, e, t);
    }
    function vm(e, t) {
      return fm(Rt, fr, e, t);
    }
    function zC(e, t) {
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
    function Pg(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Rt;
      return u |= Wi, (Jt.mode & At) !== Oe && (u |= _l), kp(u, fr, zC.bind(null, t, e), i);
    }
    function hm(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return fm(Rt, fr, zC.bind(null, t, e), i);
    }
    function Qb(e, t) {
    }
    var mm = Qb;
    function Vg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function ym(e, t) {
      var a = Ai(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Dg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Bg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function gm(e, t) {
      var a = Ai(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Dg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Ig(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function UC(e) {
      var t = Ai(), a = dr, i = a.memoizedState;
      return jC(t, i, e);
    }
    function AC(e) {
      var t = Ai();
      if (dr === null)
        return t.memoizedState = e, e;
      var a = dr.memoizedState;
      return jC(t, a, e);
    }
    function jC(e, t, a) {
      var i = !Ld(Js);
      if (i) {
        if (!G(a, t)) {
          var u = zd();
          Jt.lanes = Je(Jt.lanes, u), Wp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Up()), e.memoizedState = a, a;
    }
    function Wb(e, t, a) {
      var i = Aa();
      jn(qv(i, _i)), e(!0);
      var u = xp.transition;
      xp.transition = {};
      var s = xp.transition;
      xp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (jn(i), xp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && gt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Yg() {
      var e = sm(!1), t = e[0], a = e[1], i = Wb.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function FC() {
      var e = Ug(), t = e[0], a = Ai(), i = a.memoizedState;
      return [t, i];
    }
    function HC() {
      var e = Ag(), t = e[0], a = Ai(), i = a.memoizedState;
      return [t, i];
    }
    var PC = !1;
    function Gb() {
      return PC;
    }
    function $g() {
      var e = Ql(), t = Hm(), a = t.identifierPrefix, i;
      if (jr()) {
        var u = fb();
        i = ":" + a + "R" + u;
        var s = wp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Ib++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Sm() {
      var e = Ai(), t = e.memoizedState;
      return t;
    }
    function qb(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (VC(e))
        BC(t, u);
      else {
        var s = mC(e, t, u, i);
        if (s !== null) {
          var f = Ca();
          yr(s, e, i, f), IC(s, t, i);
        }
      }
      YC(e, i);
    }
    function Kb(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (VC(e))
        BC(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === Y && (s === null || s.lanes === Y)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = de.current, de.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, G(y, v)) {
                zb(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              de.current = p;
            }
          }
        }
        var g = mC(e, t, u, i);
        if (g !== null) {
          var w = Ca();
          yr(g, e, i, w), IC(g, t, i);
        }
      }
      YC(e, i);
    }
    function VC(e) {
      var t = e.alternate;
      return e === Jt || t !== null && t === Jt;
    }
    function BC(e, t) {
      bp = um = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function IC(e, t, a) {
      if (Nd(a)) {
        var i = t.lanes;
        i = Ud(i, e.pendingLanes);
        var u = Je(i, a);
        t.lanes = u, tf(e, u);
      }
    }
    function YC(e, t, a) {
      vs(e, t);
    }
    var Em = {
      readContext: tr,
      useCallback: la,
      useContext: la,
      useEffect: la,
      useImperativeHandle: la,
      useInsertionEffect: la,
      useLayoutEffect: la,
      useMemo: la,
      useReducer: la,
      useRef: la,
      useState: la,
      useDebugValue: la,
      useDeferredValue: la,
      useTransition: la,
      useMutableSource: la,
      useSyncExternalStore: la,
      useId: la,
      unstable_isNewReconciler: J
    }, $C = null, QC = null, WC = null, GC = null, Wl = null, ll = null, Cm = null;
    {
      var Qg = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, We = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      $C = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", It(), Uf(t), Vg(e, t);
        },
        useContext: function(e) {
          return V = "useContext", It(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", It(), Uf(t), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", It(), Uf(a), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", It(), Uf(t), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", It(), Uf(t), Hg(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", It(), Uf(t);
          var a = de.current;
          de.current = Wl;
          try {
            return Bg(e, t);
          } finally {
            de.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", It();
          var i = de.current;
          de.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            de.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", It(), jg(e);
        },
        useState: function(e) {
          V = "useState", It();
          var t = de.current;
          de.current = Wl;
          try {
            return sm(e);
          } finally {
            de.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", It(), void 0;
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", It(), Ig(e);
        },
        useTransition: function() {
          return V = "useTransition", It(), Yg();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", It(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", It(), zg(e, t, a);
        },
        useId: function() {
          return V = "useId", It(), $g();
        },
        unstable_isNewReconciler: J
      }, QC = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", ne(), Vg(e, t);
        },
        useContext: function(e) {
          return V = "useContext", ne(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", ne(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", ne(), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", ne(), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", ne(), Hg(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", ne();
          var a = de.current;
          de.current = Wl;
          try {
            return Bg(e, t);
          } finally {
            de.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", ne();
          var i = de.current;
          de.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            de.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", ne(), jg(e);
        },
        useState: function(e) {
          V = "useState", ne();
          var t = de.current;
          de.current = Wl;
          try {
            return sm(e);
          } finally {
            de.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", ne(), void 0;
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", ne(), Ig(e);
        },
        useTransition: function() {
          return V = "useTransition", ne(), Yg();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", ne(), zg(e, t, a);
        },
        useId: function() {
          return V = "useId", ne(), $g();
        },
        unstable_isNewReconciler: J
      }, WC = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", ne(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", ne(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", ne(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", ne(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", ne(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", ne(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", ne();
          var a = de.current;
          de.current = ll;
          try {
            return gm(e, t);
          } finally {
            de.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", ne();
          var i = de.current;
          de.current = ll;
          try {
            return Mg(e, t, a);
          } finally {
            de.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", ne(), cm();
        },
        useState: function(e) {
          V = "useState", ne();
          var t = de.current;
          de.current = ll;
          try {
            return Ug(e);
          } finally {
            de.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", ne(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", ne(), UC(e);
        },
        useTransition: function() {
          return V = "useTransition", ne(), FC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", ne(), om(e, t);
        },
        useId: function() {
          return V = "useId", ne(), Sm();
        },
        unstable_isNewReconciler: J
      }, GC = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", ne(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", ne(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", ne(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", ne(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", ne(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", ne(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", ne();
          var a = de.current;
          de.current = Cm;
          try {
            return gm(e, t);
          } finally {
            de.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", ne();
          var i = de.current;
          de.current = Cm;
          try {
            return Ng(e, t, a);
          } finally {
            de.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", ne(), cm();
        },
        useState: function(e) {
          V = "useState", ne();
          var t = de.current;
          de.current = Cm;
          try {
            return Ag(e);
          } finally {
            de.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", ne(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", ne(), AC(e);
        },
        useTransition: function() {
          return V = "useTransition", ne(), HC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", ne(), om(e, t);
        },
        useId: function() {
          return V = "useId", ne(), Sm();
        },
        unstable_isNewReconciler: J
      }, Wl = {
        readContext: function(e) {
          return Qg(), tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", We(), It(), Vg(e, t);
        },
        useContext: function(e) {
          return V = "useContext", We(), It(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", We(), It(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", We(), It(), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", We(), It(), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", We(), It(), Hg(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", We(), It();
          var a = de.current;
          de.current = Wl;
          try {
            return Bg(e, t);
          } finally {
            de.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", We(), It();
          var i = de.current;
          de.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            de.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", We(), It(), jg(e);
        },
        useState: function(e) {
          V = "useState", We(), It();
          var t = de.current;
          de.current = Wl;
          try {
            return sm(e);
          } finally {
            de.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", We(), It(), void 0;
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", We(), It(), Ig(e);
        },
        useTransition: function() {
          return V = "useTransition", We(), It(), Yg();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", We(), It(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", We(), It(), zg(e, t, a);
        },
        useId: function() {
          return V = "useId", We(), It(), $g();
        },
        unstable_isNewReconciler: J
      }, ll = {
        readContext: function(e) {
          return Qg(), tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", We(), ne(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", We(), ne(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", We(), ne(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", We(), ne(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", We(), ne(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", We(), ne(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", We(), ne();
          var a = de.current;
          de.current = ll;
          try {
            return gm(e, t);
          } finally {
            de.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", We(), ne();
          var i = de.current;
          de.current = ll;
          try {
            return Mg(e, t, a);
          } finally {
            de.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", We(), ne(), cm();
        },
        useState: function(e) {
          V = "useState", We(), ne();
          var t = de.current;
          de.current = ll;
          try {
            return Ug(e);
          } finally {
            de.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", We(), ne(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", We(), ne(), UC(e);
        },
        useTransition: function() {
          return V = "useTransition", We(), ne(), FC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", We(), ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", We(), ne(), om(e, t);
        },
        useId: function() {
          return V = "useId", We(), ne(), Sm();
        },
        unstable_isNewReconciler: J
      }, Cm = {
        readContext: function(e) {
          return Qg(), tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", We(), ne(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", We(), ne(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", We(), ne(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", We(), ne(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", We(), ne(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", We(), ne(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", We(), ne();
          var a = de.current;
          de.current = ll;
          try {
            return gm(e, t);
          } finally {
            de.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", We(), ne();
          var i = de.current;
          de.current = ll;
          try {
            return Ng(e, t, a);
          } finally {
            de.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", We(), ne(), cm();
        },
        useState: function(e) {
          V = "useState", We(), ne();
          var t = de.current;
          de.current = ll;
          try {
            return Ag(e);
          } finally {
            de.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", We(), ne(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", We(), ne(), AC(e);
        },
        useTransition: function() {
          return V = "useTransition", We(), ne(), HC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", We(), ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", We(), ne(), om(e, t);
        },
        useId: function() {
          return V = "useId", We(), ne(), Sm();
        },
        unstable_isNewReconciler: J
      };
    }
    var Fo = I.unstable_now, qC = 0, Rm = -1, Op = -1, Tm = -1, Wg = !1, xm = !1;
    function KC() {
      return Wg;
    }
    function Xb() {
      xm = !0;
    }
    function Jb() {
      Wg = !1, xm = !1;
    }
    function Zb() {
      Wg = xm, xm = !1;
    }
    function XC() {
      return qC;
    }
    function JC() {
      qC = Fo();
    }
    function Gg(e) {
      Op = Fo(), e.actualStartTime < 0 && (e.actualStartTime = Fo());
    }
    function ZC(e) {
      Op = -1;
    }
    function bm(e, t) {
      if (Op >= 0) {
        var a = Fo() - Op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Op = -1;
      }
    }
    function Gl(e) {
      if (Rm >= 0) {
        var t = Fo() - Rm;
        Rm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case Z:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case vt:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function qg(e) {
      if (Tm >= 0) {
        var t = Fo() - Tm;
        Tm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case Z:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case vt:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      Rm = Fo();
    }
    function Kg() {
      Tm = Fo();
    }
    function Xg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = et({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Jg = {}, Zg, eS, tS, nS, rS, e0, wm, aS, iS, lS, Lp;
    {
      Zg = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), Lp = /* @__PURE__ */ new Set();
      var t0 = /* @__PURE__ */ new Set();
      wm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          t0.has(a) || (t0.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, e0 = function(e, t) {
        if (t === void 0) {
          var a = _t(e) || "Component";
          rS.has(a) || (rS.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(Jg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(Jg);
    }
    function uS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Xt) {
          yn(!0);
          try {
            s = a(i, u);
          } finally {
            yn(!1);
          }
        }
        e0(t, s);
      }
      var f = s == null ? u : et({}, u, s);
      if (e.memoizedState = f, e.lanes === Y) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var oS = {
      isMounted: Nv,
      enqueueSetState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.payload = t, a != null && (wm(a, "setState"), f.callback = a);
        var p = zo(i, f, s);
        p !== null && (yr(p, i, s, u), tm(p, i, s)), vs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.tag = gC, f.payload = t, a != null && (wm(a, "replaceState"), f.callback = a);
        var p = zo(i, f, s);
        p !== null && (yr(p, i, s, u), tm(p, i, s)), vs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = po(e), i = Ca(), u = Bo(a), s = Pu(i, u);
        s.tag = Jh, t != null && (wm(t, "forceUpdate"), s.callback = t);
        var f = zo(a, s, u);
        f !== null && (yr(f, a, u, i), tm(f, a, u)), Nc(a, u);
      }
    };
    function n0(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Xt) {
            yn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              yn(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", _t(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ee(a, i) || !Ee(u, s) : !0;
    }
    function ew(e, t, a) {
      var i = e.stateNode;
      {
        var u = _t(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Xt) === Oe && (Lp.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Xt) === Oe && (Lp.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !iS.has(t) && (iS.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", _t(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !tS.has(t) && (tS.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", _t(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || ut(p)) && S("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function r0(e, t) {
      t.updater = oS, e.stateNode = t, vu(t, e), t._reactInternalInstance = Jg;
    }
    function a0(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !lS.has(t)) {
          lS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", _t(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = tr(f);
      else {
        u = Tf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? xf(e, u) : ui;
      }
      var g = new t(a, s);
      if (e.mode & Xt) {
        yn(!0);
        try {
          g = new t(a, s);
        } finally {
          yn(!1);
        }
      }
      var w = e.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null;
      r0(e, g);
      {
        if (typeof t.getDerivedStateFromProps == "function" && w === null) {
          var x = _t(t) || "Component";
          eS.has(x) || (eS.add(x), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", x, g.state === null ? "null" : "undefined", x));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof g.getSnapshotBeforeUpdate == "function") {
          var M = null, A = null, F = null;
          if (typeof g.componentWillMount == "function" && g.componentWillMount.__suppressDeprecationWarning !== !0 ? M = "componentWillMount" : typeof g.UNSAFE_componentWillMount == "function" && (M = "UNSAFE_componentWillMount"), typeof g.componentWillReceiveProps == "function" && g.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? A = "componentWillReceiveProps" : typeof g.UNSAFE_componentWillReceiveProps == "function" && (A = "UNSAFE_componentWillReceiveProps"), typeof g.componentWillUpdate == "function" && g.componentWillUpdate.__suppressDeprecationWarning !== !0 ? F = "componentWillUpdate" : typeof g.UNSAFE_componentWillUpdate == "function" && (F = "UNSAFE_componentWillUpdate"), M !== null || A !== null || F !== null) {
            var oe = _t(t) || "Component", Me = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            nS.has(oe) || (nS.add(oe), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, oe, Me, M !== null ? `
  ` + M : "", A !== null ? `
  ` + A : "", F !== null ? `
  ` + F : ""));
          }
        }
      }
      return i && WE(e, u, s), g;
    }
    function tw(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", $e(e) || "Component"), oS.enqueueReplaceState(t, t.state, null));
    }
    function i0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = $e(e) || "Component";
          Zg.has(s) || (Zg.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        oS.enqueueReplaceState(t, t.state, null);
      }
    }
    function sS(e, t, a, i) {
      ew(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, gg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = tr(s);
      else {
        var f = Tf(e, t, !0);
        u.context = xf(e, f);
      }
      {
        if (u.state === a) {
          var p = _t(t) || "Component";
          aS.has(p) || (aS.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Xt && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (uS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (tw(e, u), nm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = Rt;
        y |= Wi, (e.mode & At) !== Oe && (y |= _l), e.flags |= y;
      }
    }
    function nw(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = tr(p);
      else {
        var y = Tf(e, t, !0);
        v = xf(e, y);
      }
      var g = t.getDerivedStateFromProps, w = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !w && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && i0(e, u, a, v), EC();
      var x = e.memoizedState, M = u.state = x;
      if (nm(e, a, u, i), M = e.memoizedState, s === a && x === M && !jh() && !rm()) {
        if (typeof u.componentDidMount == "function") {
          var A = Rt;
          A |= Wi, (e.mode & At) !== Oe && (A |= _l), e.flags |= A;
        }
        return !1;
      }
      typeof g == "function" && (uS(e, t, g, a), M = e.memoizedState);
      var F = rm() || n0(e, t, s, a, x, M, v);
      if (F) {
        if (!w && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var oe = Rt;
          oe |= Wi, (e.mode & At) !== Oe && (oe |= _l), e.flags |= oe;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Me = Rt;
          Me |= Wi, (e.mode & At) !== Oe && (Me |= _l), e.flags |= Me;
        }
        e.memoizedProps = a, e.memoizedState = M;
      }
      return u.props = a, u.state = M, u.context = v, F;
    }
    function rw(e, t, a, i, u) {
      var s = t.stateNode;
      SC(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, g = a.contextType, w = ui;
      if (typeof g == "object" && g !== null)
        w = tr(g);
      else {
        var x = Tf(t, a, !0);
        w = xf(t, x);
      }
      var M = a.getDerivedStateFromProps, A = typeof M == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !A && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== w) && i0(t, s, i, w), EC();
      var F = t.memoizedState, oe = s.state = F;
      if (nm(t, i, s, u), oe = t.memoizedState, f === v && F === oe && !jh() && !rm() && !xe)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= Rt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= $n), !1;
      typeof M == "function" && (uS(t, a, M, i), oe = t.memoizedState);
      var Me = rm() || n0(t, a, p, i, F, oe, w) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      xe;
      return Me ? (!A && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, oe, w), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, oe, w)), typeof s.componentDidUpdate == "function" && (t.flags |= Rt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= $n)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= Rt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= $n), t.memoizedProps = i, t.memoizedState = oe), s.props = i, s.state = oe, s.context = w, Me;
    }
    function Zs(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function cS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function aw(e, t) {
      return !0;
    }
    function fS(e, t) {
      try {
        var a = aw(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === pe)
            return;
          console.error(i);
        }
        var p = u ? $e(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === Z)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var g = $e(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + g + ".");
        }
        var w = v + `
` + f + `

` + ("" + y);
        console.error(w);
      } catch (x) {
        setTimeout(function() {
          throw x;
        });
      }
    }
    var iw = typeof WeakMap == "function" ? WeakMap : Map;
    function l0(e, t, a) {
      var i = Pu(en, a);
      i.tag = mg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        X1(u), fS(e, t);
      }, i;
    }
    function dS(e, t, a) {
      var i = Pu(en, a);
      i.tag = mg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          yR(e), fS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        yR(e), fS(e, t), typeof u != "function" && q1(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, He) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", $e(e) || "Unknown"));
      }), i;
    }
    function u0(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new iw(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = J1.bind(null, e, t, a);
        Jr && Gp(e, a), t.then(s, s);
      }
    }
    function lw(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function uw(e, t) {
      var a = e.tag;
      if ((e.mode & pt) === Oe && (a === ce || a === Ye || a === ge)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function o0(e) {
      var t = e;
      do {
        if (t.tag === ee && Vb(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function s0(e, t, a, i, u) {
      if ((e.mode & pt) === Oe) {
        if (e === t)
          e.flags |= Xn;
        else {
          if (e.flags |= ke, a.flags |= bc, a.flags &= -52805, a.tag === pe) {
            var s = a.alternate;
            if (s === null)
              a.tag = St;
            else {
              var f = Pu(en, He);
              f.tag = Jh, zo(a, f, He);
            }
          }
          a.lanes = Je(a.lanes, He);
        }
        return e;
      }
      return e.flags |= Xn, e.lanes = u, e;
    }
    function ow(e, t, a, i, u) {
      if (a.flags |= os, Jr && Gp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        uw(a), jr() && a.mode & pt && eC();
        var f = o0(t);
        if (f !== null) {
          f.flags &= ~Cr, s0(f, t, a, e, u), f.mode & pt && u0(e, s, u), lw(f, e, s);
          return;
        } else {
          if (!Vv(u)) {
            u0(e, s, u), $S();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (jr() && a.mode & pt) {
        eC();
        var v = o0(t);
        if (v !== null) {
          (v.flags & Xn) === De && (v.flags |= Cr), s0(v, t, a, e, u), ag(Zs(i, a));
          return;
        }
      }
      i = Zs(i, a), V1(i);
      var y = t;
      do {
        switch (y.tag) {
          case Z: {
            var g = i;
            y.flags |= Xn;
            var w = Ts(u);
            y.lanes = Je(y.lanes, w);
            var x = l0(y, g, w);
            Sg(y, x);
            return;
          }
          case pe:
            var M = i, A = y.type, F = y.stateNode;
            if ((y.flags & ke) === De && (typeof A.getDerivedStateFromError == "function" || F !== null && typeof F.componentDidCatch == "function" && !oR(F))) {
              y.flags |= Xn;
              var oe = Ts(u);
              y.lanes = Je(y.lanes, oe);
              var Me = dS(y, M, oe);
              Sg(y, Me);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function sw() {
      return null;
    }
    var Mp = N.ReactCurrentOwner, ol = !1, pS, Np, vS, hS, mS, ec, yS, _m, zp;
    pS = {}, Np = {}, vS = {}, hS = {}, mS = {}, ec = !1, yS = {}, _m = {}, zp = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = dC(t, null, a, i) : t.child = kf(t, e.child, a, i);
    }
    function cw(e, t, a, i) {
      t.child = kf(t, e.child, null, i), t.child = kf(t, null, a, i);
    }
    function c0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          _t(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, Yn(!0), v = Af(e, t, f, i, p, u), y = jf(), t.mode & Xt) {
          yn(!0);
          try {
            v = Af(e, t, f, i, p, u), y = jf();
          } finally {
            yn(!1);
          }
        }
        Yn(!1);
      }
      return ma(), e !== null && !ol ? (wC(e, t, u), Vu(e, t, u)) : (jr() && y && Jy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function f0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (h_(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = $f(s), t.tag = ge, t.type = f, ES(t, s), d0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            _t(s)
          ), a.defaultProps !== void 0) {
            var v = _t(s) || "Unknown";
            zp[v] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), zp[v] = !0);
          }
        }
        var y = nE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var g = a.type, w = g.propTypes;
        w && nl(
          w,
          i,
          // Resolved props
          "prop",
          _t(g)
        );
      }
      var x = e.child, M = wS(e, u);
      if (!M) {
        var A = x.memoizedProps, F = a.compare;
        if (F = F !== null ? F : Ee, F(A, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var oe = ic(x, i);
      return oe.ref = t.ref, oe.return = t, t.child = oe, oe;
    }
    function d0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Qe) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var y = s && s.propTypes;
          y && nl(
            y,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            _t(s)
          );
        }
      }
      if (e !== null) {
        var g = e.memoizedProps;
        if (Ee(g, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = g, wS(e, u))
            (e.flags & bc) !== De && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return gS(e, t, a, i, u);
    }
    function p0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ae)
        if ((t.mode & pt) === Oe) {
          var f = {
            baseLanes: Y,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Pm(t, a);
        } else if (ea(a, Zr)) {
          var w = {
            baseLanes: Y,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = w;
          var x = s !== null ? s.baseLanes : a;
          Pm(t, x);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = Je(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Zr;
          var g = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = g, t.updateQueue = null, Pm(t, v), null;
        }
      else {
        var M;
        s !== null ? (M = Je(s.baseLanes, a), t.memoizedState = null) : M = a, Pm(t, M);
      }
      return Sa(e, t, u, a), t.child;
    }
    function fw(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function dw(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function pw(e, t, a) {
      {
        t.flags |= Rt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function v0(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= En, t.flags |= ho);
    }
    function gS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          _t(a)
        );
      }
      var f;
      {
        var p = Tf(t, a, !0);
        f = xf(t, p);
      }
      var v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, Yn(!0), v = Af(e, t, a, i, f, u), y = jf(), t.mode & Xt) {
          yn(!0);
          try {
            v = Af(e, t, a, i, f, u), y = jf();
          } finally {
            yn(!1);
          }
        }
        Yn(!1);
      }
      return ma(), e !== null && !ol ? (wC(e, t, u), Vu(e, t, u)) : (jr() && y && Jy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function h0(e, t, a, i, u) {
      {
        switch (O_(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= ke, t.flags |= Xn;
            var y = new Error("Simulated error coming from DevTools"), g = Ts(u);
            t.lanes = Je(t.lanes, g);
            var w = dS(t, Zs(y, t), g);
            Sg(t, w);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var x = a.propTypes;
          x && nl(
            x,
            i,
            // Resolved props
            "prop",
            _t(a)
          );
        }
      }
      var M;
      Yl(a) ? (M = !0, Hh(t)) : M = !1, Of(t, u);
      var A = t.stateNode, F;
      A === null ? (Dm(e, t), a0(t, a, i), sS(t, a, i, u), F = !0) : e === null ? F = nw(t, a, i, u) : F = rw(e, t, a, i, u);
      var oe = SS(e, t, a, F, M, u);
      {
        var Me = t.stateNode;
        F && Me.props !== i && (ec || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", $e(t) || "a component"), ec = !0);
      }
      return oe;
    }
    function SS(e, t, a, i, u, s) {
      v0(e, t);
      var f = (t.flags & ke) !== De;
      if (!i && !f)
        return u && KE(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Mp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, ZC();
      else {
        ha(t);
        {
          if (Yn(!0), v = p.render(), t.mode & Xt) {
            yn(!0);
            try {
              p.render();
            } finally {
              yn(!1);
            }
          }
          Yn(!1);
        }
        ma();
      }
      return t.flags |= ni, e !== null && f ? cw(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && KE(t, a, !0), t.child;
    }
    function m0(e) {
      var t = e.stateNode;
      t.pendingContext ? GE(e, t.pendingContext, t.pendingContext !== t.context) : t.context && GE(e, t.context, !1), Eg(e, t.containerInfo);
    }
    function vw(e, t, a) {
      if (m0(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      SC(e, t), nm(t, i, null, a);
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
        }, y = t.updateQueue;
        if (y.baseState = v, t.memoizedState = v, t.flags & Cr) {
          var g = Zs(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return y0(e, t, p, a, g);
        } else if (p !== s) {
          var w = Zs(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return y0(e, t, p, a, w);
        } else {
          yb(t);
          var x = dC(t, null, p, a);
          t.child = x;
          for (var M = x; M; )
            M.flags = M.flags & ~mn | qr, M = M.sibling;
        }
      } else {
        if (_f(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function y0(e, t, a, i, u) {
      return _f(), ag(u), t.flags |= Cr, Sa(e, t, a, i), t.child;
    }
    function hw(e, t, a) {
      TC(t), e === null && rg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Fy(i, u);
      return p ? f = null : s !== null && Fy(i, s) && (t.flags |= Oa), v0(e, t), Sa(e, t, f, a), t.child;
    }
    function mw(e, t) {
      return e === null && rg(t), null;
    }
    function yw(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = m_(v), g = ul(v, u), w;
      switch (y) {
        case ce:
          return ES(t, v), t.type = v = $f(v), w = gS(null, t, v, g, i), w;
        case pe:
          return t.type = v = KS(v), w = h0(null, t, v, g, i), w;
        case Ye:
          return t.type = v = XS(v), w = c0(null, t, v, g, i), w;
        case Ae: {
          if (t.type !== t.elementType) {
            var x = v.propTypes;
            x && nl(
              x,
              g,
              // Resolved for outer only
              "prop",
              _t(v)
            );
          }
          return w = f0(
            null,
            t,
            v,
            ul(v.type, g),
            // The inner type can have defaults too
            i
          ), w;
        }
      }
      var M = "";
      throw v !== null && typeof v == "object" && v.$$typeof === Qe && (M = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + M));
    }
    function gw(e, t, a, i, u) {
      Dm(e, t), t.tag = pe;
      var s;
      return Yl(a) ? (s = !0, Hh(t)) : s = !1, Of(t, u), a0(t, a, i), sS(t, a, i, u), SS(null, t, a, !0, s, u);
    }
    function Sw(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s;
      {
        var f = Tf(t, a, !1);
        s = xf(t, f);
      }
      Of(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = _t(a) || "Unknown";
          pS[y] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), pS[y] = !0);
        }
        t.mode & Xt && al.recordLegacyContextWarning(t, null), Yn(!0), Mp.current = t, p = Af(null, t, a, u, s, i), v = jf(), Yn(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var g = _t(a) || "Unknown";
        Np[g] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", g, g, g), Np[g] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var w = _t(a) || "Unknown";
          Np[w] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", w, w, w), Np[w] = !0);
        }
        t.tag = pe, t.memoizedState = null, t.updateQueue = null;
        var x = !1;
        return Yl(a) ? (x = !0, Hh(t)) : x = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, gg(t), r0(t, p), sS(t, a, u, i), SS(null, t, a, !0, x, i);
      } else {
        if (t.tag = ce, t.mode & Xt) {
          yn(!0);
          try {
            p = Af(null, t, a, u, s, i), v = jf();
          } finally {
            yn(!1);
          }
        }
        return jr() && v && Jy(t), Sa(null, t, p, i), ES(t, a), t.child;
      }
    }
    function ES(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), mS[u] || (mS[u] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = _t(t) || "Unknown";
          zp[f] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), zp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = _t(t) || "Unknown";
          hS[p] || (S("%s: Function components do not support getDerivedStateFromProps.", p), hS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = _t(t) || "Unknown";
          vS[v] || (S("%s: Function components do not support contextType.", v), vS[v] = !0);
        }
      }
    }
    var CS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Mt
    };
    function RS(e) {
      return {
        baseLanes: e,
        cachePool: sw(),
        transitions: null
      };
    }
    function Ew(e, t) {
      var a = null;
      return {
        baseLanes: Je(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function Cw(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Tg(e, Tp);
    }
    function Rw(e, t) {
      return xs(e.childLanes, t);
    }
    function g0(e, t, a) {
      var i = t.pendingProps;
      L_(t) && (t.flags |= ke);
      var u = il.current, s = !1, f = (t.flags & ke) !== De;
      if (f || Cw(u, e) ? (s = !0, t.flags &= ~ke) : (e === null || e.memoizedState !== null) && (u = Pb(u, bC)), u = Mf(u), Ao(t, u), e === null) {
        rg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return _w(t, v);
        }
        var y = i.children, g = i.fallback;
        if (s) {
          var w = Tw(t, y, g, a), x = t.child;
          return x.memoizedState = RS(a), t.memoizedState = CS, w;
        } else
          return TS(t, y);
      } else {
        var M = e.memoizedState;
        if (M !== null) {
          var A = M.dehydrated;
          if (A !== null)
            return kw(e, t, f, i, A, M, a);
        }
        if (s) {
          var F = i.fallback, oe = i.children, Me = bw(e, t, oe, F, a), we = t.child, bt = e.child.memoizedState;
          return we.memoizedState = bt === null ? RS(a) : Ew(bt, a), we.childLanes = Rw(e, a), t.memoizedState = CS, Me;
        } else {
          var Et = i.children, D = xw(e, t, Et, a);
          return t.memoizedState = null, D;
        }
      }
    }
    function TS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = xS(u, i);
      return s.return = e, e.child = s, s;
    }
    function Tw(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & pt) === Oe && s !== null ? (p = s, p.childLanes = Y, p.pendingProps = f, e.mode & Ut && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Yo(a, u, i, null)) : (p = xS(f, u), v = Yo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function xS(e, t, a) {
      return SR(e, t, Y, null);
    }
    function S0(e, t) {
      return ic(e, t);
    }
    function xw(e, t, a, i) {
      var u = e.child, s = u.sibling, f = S0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & pt) === Oe && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Da) : p.push(s);
      }
      return t.child = f, f;
    }
    function bw(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & pt) === Oe && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var g = t.child;
        y = g, y.childLanes = Y, y.pendingProps = v, t.mode & Ut && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = S0(f, v), y.subtreeFlags = f.subtreeFlags & zn;
      var w;
      return p !== null ? w = ic(p, i) : (w = Yo(i, s, u, null), w.flags |= mn), w.return = t, y.return = t, y.sibling = w, t.child = y, w;
    }
    function km(e, t, a, i) {
      i !== null && ag(i), kf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = TS(t, s);
      return f.flags |= mn, t.memoizedState = null, f;
    }
    function ww(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = xS(f, s), v = Yo(i, s, u, null);
      return v.flags |= mn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & pt) !== Oe && kf(t, e.child, null, u), v;
    }
    function _w(e, t, a) {
      return (e.mode & pt) === Oe ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = He) : By(t) ? e.lanes = Rr : e.lanes = Zr, null;
    }
    function kw(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Cr) {
          t.flags &= ~Cr;
          var D = cS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return km(e, t, f, D);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= ke, null;
          var H = i.children, O = i.fallback, K = ww(e, t, H, O, f), ve = t.child;
          return ve.memoizedState = RS(f), t.memoizedState = CS, K;
        }
      else {
        if (hb(), (t.mode & pt) === Oe)
          return km(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (By(u)) {
          var p, v, y;
          {
            var g = Mx(u);
            p = g.digest, v = g.message, y = g.stack;
          }
          var w;
          v ? w = new Error(v) : w = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var x = cS(w, p, y);
          return km(e, t, f, x);
        }
        var M = ea(f, e.childLanes);
        if (ol || M) {
          var A = Hm();
          if (A !== null) {
            var F = jd(A, f);
            if (F !== Mt && F !== s.retryLane) {
              s.retryLane = F;
              var oe = en;
              Ha(e, F), yr(A, e, F, oe);
            }
          }
          $S();
          var Me = cS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return km(e, t, f, Me);
        } else if (BE(u)) {
          t.flags |= ke, t.child = e.child;
          var we = Z1.bind(null, e);
          return Nx(u, we), null;
        } else {
          gb(t, u, s.treeContext);
          var bt = i.children, Et = TS(t, bt);
          return Et.flags |= qr, Et;
        }
      }
    }
    function E0(e, t, a) {
      e.lanes = Je(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = Je(i.lanes, t)), vg(e.return, t, a);
    }
    function Dw(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === ee) {
          var u = i.memoizedState;
          u !== null && E0(i, a, e);
        } else if (i.tag === ht)
          E0(i, a, e);
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
    function Ow(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && lm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function Lw(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !yS[e])
        if (yS[e] = !0, typeof e == "string")
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
    function Mw(e, t) {
      e !== void 0 && !_m[e] && (e !== "collapsed" && e !== "hidden" ? (_m[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (_m[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function C0(e, t) {
      {
        var a = ut(e), i = !a && typeof Xe(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Nw(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (ut(e)) {
          for (var a = 0; a < e.length; a++)
            if (!C0(e[a], a))
              return;
        } else {
          var i = Xe(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!C0(s.value, f))
                  return;
                f++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function bS(e, t, a, i, u) {
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
    function R0(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      Lw(u), Mw(s, u), Nw(f, u), Sa(e, t, f, a);
      var p = il.current, v = Tg(p, Tp);
      if (v)
        p = xg(p, Tp), t.flags |= ke;
      else {
        var y = e !== null && (e.flags & ke) !== De;
        y && Dw(t, t.child, a), p = Mf(p);
      }
      if (Ao(t, p), (t.mode & pt) === Oe)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var g = Ow(t.child), w;
            g === null ? (w = t.child, t.child = null) : (w = g.sibling, g.sibling = null), bS(
              t,
              !1,
              // isBackwards
              w,
              g,
              s
            );
            break;
          }
          case "backwards": {
            var x = null, M = t.child;
            for (t.child = null; M !== null; ) {
              var A = M.alternate;
              if (A !== null && lm(A) === null) {
                t.child = M;
                break;
              }
              var F = M.sibling;
              M.sibling = x, x = M, M = F;
            }
            bS(
              t,
              !0,
              // isBackwards
              x,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            bS(
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
    function zw(e, t, a) {
      Eg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = kf(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var T0 = !1;
    function Uw(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || T0 || (T0 = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (hC(t, u, p), f !== null) {
        var y = f.value;
        if (G(y, p)) {
          if (f.children === s.children && !jh())
            return Vu(e, t, a);
        } else
          Lb(t, u, a);
      }
      var g = s.children;
      return Sa(e, t, g, a), t.child;
    }
    var x0 = !1;
    function Aw(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (x0 || (x0 = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Of(t, a);
      var f = tr(i);
      ha(t);
      var p;
      return Mp.current = t, Yn(!0), p = s(f), Yn(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function Up() {
      ol = !0;
    }
    function Dm(e, t) {
      (t.mode & pt) === Oe && e !== null && (e.alternate = null, t.alternate = null, t.flags |= mn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), ZC(), Wp(t.lanes), ea(a, t.childLanes) ? (Db(e, t), t.child) : null;
    }
    function jw(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= Da) : s.push(e), a.flags |= mn, a;
      }
    }
    function wS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function Fw(e, t, a) {
      switch (t.tag) {
        case Z:
          m0(t), t.stateNode, _f();
          break;
        case re:
          TC(t);
          break;
        case pe: {
          var i = t.type;
          Yl(i) && Hh(t);
          break;
        }
        case ye:
          Eg(t, t.stateNode.containerInfo);
          break;
        case ot: {
          var u = t.memoizedProps.value, s = t.type._context;
          hC(t, s, u);
          break;
        }
        case vt:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= Rt);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case ee: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Ao(t, Mf(il.current)), t.flags |= ke, null;
            var y = t.child, g = y.childLanes;
            if (ea(a, g))
              return g0(e, t, a);
            Ao(t, Mf(il.current));
            var w = Vu(e, t, a);
            return w !== null ? w.sibling : null;
          } else
            Ao(t, Mf(il.current));
          break;
        }
        case ht: {
          var x = (e.flags & ke) !== De, M = ea(a, t.childLanes);
          if (x) {
            if (M)
              return R0(e, t, a);
            t.flags |= ke;
          }
          var A = t.memoizedState;
          if (A !== null && (A.rendering = null, A.tail = null, A.lastEffect = null), Ao(t, il.current), M)
            break;
          return null;
        }
        case _e:
        case Pt:
          return t.lanes = Y, p0(e, t, a);
      }
      return Vu(e, t, a);
    }
    function b0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return jw(e, t, nE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || jh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = wS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & ke) === De)
            return ol = !1, Fw(e, t, a);
          (e.flags & bc) !== De ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, jr() && sb(t)) {
        var f = t.index, p = cb();
        ZE(t, p, f);
      }
      switch (t.lanes = Y, t.tag) {
        case Pe:
          return Sw(e, t, t.type, a);
        case Ot: {
          var v = t.elementType;
          return yw(e, t, v, a);
        }
        case ce: {
          var y = t.type, g = t.pendingProps, w = t.elementType === y ? g : ul(y, g);
          return gS(e, t, y, w, a);
        }
        case pe: {
          var x = t.type, M = t.pendingProps, A = t.elementType === x ? M : ul(x, M);
          return h0(e, t, x, A, a);
        }
        case Z:
          return vw(e, t, a);
        case re:
          return hw(e, t, a);
        case Fe:
          return mw(e, t);
        case ee:
          return g0(e, t, a);
        case ye:
          return zw(e, t, a);
        case Ye: {
          var F = t.type, oe = t.pendingProps, Me = t.elementType === F ? oe : ul(F, oe);
          return c0(e, t, F, Me, a);
        }
        case nt:
          return fw(e, t, a);
        case rt:
          return dw(e, t, a);
        case vt:
          return pw(e, t, a);
        case ot:
          return Uw(e, t, a);
        case tn:
          return Aw(e, t, a);
        case Ae: {
          var we = t.type, bt = t.pendingProps, Et = ul(we, bt);
          if (t.type !== t.elementType) {
            var D = we.propTypes;
            D && nl(
              D,
              Et,
              // Resolved for outer only
              "prop",
              _t(we)
            );
          }
          return Et = ul(we.type, Et), f0(e, t, we, Et, a);
        }
        case ge:
          return d0(e, t, t.type, t.pendingProps, a);
        case St: {
          var H = t.type, O = t.pendingProps, K = t.elementType === H ? O : ul(H, O);
          return gw(e, t, H, K, a);
        }
        case ht:
          return R0(e, t, a);
        case Ge:
          break;
        case _e:
          return p0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ff(e) {
      e.flags |= Rt;
    }
    function w0(e) {
      e.flags |= En, e.flags |= ho;
    }
    var _0, _S, k0, D0;
    _0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === re || u.tag === Fe)
          lx(e, u.stateNode);
        else if (u.tag !== ye) {
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
    }, _S = function(e, t) {
    }, k0 = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Cg(), v = ox(f, a, s, i, u, p);
        t.updateQueue = v, v && Ff(t);
      }
    }, D0 = function(e, t, a, i) {
      a !== i && Ff(t);
    };
    function Ap(e, t) {
      if (!jr())
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
    function Hr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = Y, i = De;
      if (t) {
        if ((e.mode & Ut) !== Oe) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = Je(a, Je(y.lanes, y.childLanes)), i |= y.subtreeFlags & zn, i |= y.flags & zn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var g = e.child; g !== null; )
            a = Je(a, Je(g.lanes, g.childLanes)), i |= g.subtreeFlags & zn, i |= g.flags & zn, g.return = e, g = g.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ut) !== Oe) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = Je(a, Je(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = Je(a, Je(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Hw(e, t, a) {
      if (Tb() && (t.mode & pt) !== Oe && (t.flags & ke) === De)
        return lC(t), _f(), t.flags |= Cr | os | Xn, !1;
      var i = Yh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (Cb(t), Hr(t), (t.mode & Ut) !== Oe) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (_f(), (t.flags & ke) === De && (t.memoizedState = null), t.flags |= Rt, Hr(t), (t.mode & Ut) !== Oe) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return uC(), !0;
    }
    function O0(e, t, a) {
      var i = t.pendingProps;
      switch (Zy(t), t.tag) {
        case Pe:
        case Ot:
        case ge:
        case ce:
        case Ye:
        case nt:
        case rt:
        case vt:
        case tn:
        case Ae:
          return Hr(t), null;
        case pe: {
          var u = t.type;
          return Yl(u) && Fh(t), Hr(t), null;
        }
        case Z: {
          var s = t.stateNode;
          if (Lf(t), qy(t), wg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Yh(t);
            if (f)
              Ff(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Cr) !== De) && (t.flags |= $n, uC());
            }
          }
          return _S(e, t), Hr(t), null;
        }
        case re: {
          Rg(t);
          var v = RC(), y = t.type;
          if (e !== null && t.stateNode != null)
            k0(e, t, y, i, v), e.ref !== t.ref && w0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Hr(t), null;
            }
            var g = Cg(), w = Yh(t);
            if (w)
              Sb(t, v, g) && Ff(t);
            else {
              var x = ix(y, i, v, g, t);
              _0(x, t, !1, !1), t.stateNode = x, ux(x, y, i, v) && Ff(t);
            }
            t.ref !== null && w0(t);
          }
          return Hr(t), null;
        }
        case Fe: {
          var M = i;
          if (e && t.stateNode != null) {
            var A = e.memoizedProps;
            D0(e, t, A, M);
          } else {
            if (typeof M != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var F = RC(), oe = Cg(), Me = Yh(t);
            Me ? Eb(t) && Ff(t) : t.stateNode = sx(M, F, oe, t);
          }
          return Hr(t), null;
        }
        case ee: {
          Nf(t);
          var we = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var bt = Hw(e, t, we);
            if (!bt)
              return t.flags & Xn ? t : null;
          }
          if ((t.flags & ke) !== De)
            return t.lanes = a, (t.mode & Ut) !== Oe && Xg(t), t;
          var Et = we !== null, D = e !== null && e.memoizedState !== null;
          if (Et !== D && Et) {
            var H = t.child;
            if (H.flags |= Nn, (t.mode & pt) !== Oe) {
              var O = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              O || Tg(il.current, bC) ? P1() : $S();
            }
          }
          var K = t.updateQueue;
          if (K !== null && (t.flags |= Rt), Hr(t), (t.mode & Ut) !== Oe && Et) {
            var ve = t.child;
            ve !== null && (t.treeBaseDuration -= ve.treeBaseDuration);
          }
          return null;
        }
        case ye:
          return Lf(t), _S(e, t), e === null && nb(t.stateNode.containerInfo), Hr(t), null;
        case ot:
          var se = t.type._context;
          return pg(se, t), Hr(t), null;
        case St: {
          var Be = t.type;
          return Yl(Be) && Fh(t), Hr(t), null;
        }
        case ht: {
          Nf(t);
          var qe = t.memoizedState;
          if (qe === null)
            return Hr(t), null;
          var Zt = (t.flags & ke) !== De, Ft = qe.rendering;
          if (Ft === null)
            if (Zt)
              Ap(qe, !1);
            else {
              var Gn = B1() && (e === null || (e.flags & ke) === De);
              if (!Gn)
                for (var Ht = t.child; Ht !== null; ) {
                  var Pn = lm(Ht);
                  if (Pn !== null) {
                    Zt = !0, t.flags |= ke, Ap(qe, !1);
                    var ua = Pn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= Rt), t.subtreeFlags = De, Ob(t, a), Ao(t, xg(il.current, Tp)), t.child;
                  }
                  Ht = Ht.sibling;
                }
              qe.tail !== null && Qn() > X0() && (t.flags |= ke, Zt = !0, Ap(qe, !1), t.lanes = kd);
            }
          else {
            if (!Zt) {
              var Yr = lm(Ft);
              if (Yr !== null) {
                t.flags |= ke, Zt = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= Rt), Ap(qe, !0), qe.tail === null && qe.tailMode === "hidden" && !Ft.alternate && !jr())
                  return Hr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Qn() * 2 - qe.renderingStartTime > X0() && a !== Zr && (t.flags |= ke, Zt = !0, Ap(qe, !1), t.lanes = kd);
            }
            if (qe.isBackwards)
              Ft.sibling = t.child, t.child = Ft;
            else {
              var Ra = qe.last;
              Ra !== null ? Ra.sibling = Ft : t.child = Ft, qe.last = Ft;
            }
          }
          if (qe.tail !== null) {
            var Ta = qe.tail;
            qe.rendering = Ta, qe.tail = Ta.sibling, qe.renderingStartTime = Qn(), Ta.sibling = null;
            var oa = il.current;
            return Zt ? oa = xg(oa, Tp) : oa = Mf(oa), Ao(t, oa), Ta;
          }
          return Hr(t), null;
        }
        case Ge:
          break;
        case _e:
        case Pt: {
          YS(t);
          var Qu = t.memoizedState, Qf = Qu !== null;
          if (e !== null) {
            var Jp = e.memoizedState, Jl = Jp !== null;
            Jl !== Qf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ae && (t.flags |= Nn);
          }
          return !Qf || (t.mode & pt) === Oe ? Hr(t) : ea(Xl, Zr) && (Hr(t), t.subtreeFlags & (mn | Rt) && (t.flags |= Nn)), null;
        }
        case Lt:
          return null;
        case Nt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Pw(e, t, a) {
      switch (Zy(t), t.tag) {
        case pe: {
          var i = t.type;
          Yl(i) && Fh(t);
          var u = t.flags;
          return u & Xn ? (t.flags = u & ~Xn | ke, (t.mode & Ut) !== Oe && Xg(t), t) : null;
        }
        case Z: {
          t.stateNode, Lf(t), qy(t), wg();
          var s = t.flags;
          return (s & Xn) !== De && (s & ke) === De ? (t.flags = s & ~Xn | ke, t) : null;
        }
        case re:
          return Rg(t), null;
        case ee: {
          Nf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            _f();
          }
          var p = t.flags;
          return p & Xn ? (t.flags = p & ~Xn | ke, (t.mode & Ut) !== Oe && Xg(t), t) : null;
        }
        case ht:
          return Nf(t), null;
        case ye:
          return Lf(t), null;
        case ot:
          var v = t.type._context;
          return pg(v, t), null;
        case _e:
        case Pt:
          return YS(t), null;
        case Lt:
          return null;
        default:
          return null;
      }
    }
    function L0(e, t, a) {
      switch (Zy(t), t.tag) {
        case pe: {
          var i = t.type.childContextTypes;
          i != null && Fh(t);
          break;
        }
        case Z: {
          t.stateNode, Lf(t), qy(t), wg();
          break;
        }
        case re: {
          Rg(t);
          break;
        }
        case ye:
          Lf(t);
          break;
        case ee:
          Nf(t);
          break;
        case ht:
          Nf(t);
          break;
        case ot:
          var u = t.type._context;
          pg(u, t);
          break;
        case _e:
        case Pt:
          YS(t);
          break;
      }
    }
    var M0 = null;
    M0 = /* @__PURE__ */ new Set();
    var Om = !1, Pr = !1, Vw = typeof WeakSet == "function" ? WeakSet : Set, Ce = null, Hf = null, Pf = null;
    function Bw(e) {
      wl(null, function() {
        throw e;
      }), us();
    }
    var Iw = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Ut)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Gl(e);
        }
      else
        t.componentWillUnmount();
    };
    function N0(e, t) {
      try {
        Ho(fr, e);
      } catch (a) {
        fn(e, t, a);
      }
    }
    function kS(e, t, a) {
      try {
        Iw(e, a);
      } catch (i) {
        fn(e, t, i);
      }
    }
    function Yw(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        fn(e, t, i);
      }
    }
    function z0(e, t) {
      try {
        A0(e);
      } catch (a) {
        fn(e, t, a);
      }
    }
    function Vf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (je && ct && e.mode & Ut)
              try {
                ql(), i = a(null);
              } finally {
                Gl(e);
              }
            else
              i = a(null);
          } catch (u) {
            fn(e, t, u);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", $e(e));
        } else
          a.current = null;
    }
    function Lm(e, t, a) {
      try {
        a();
      } catch (i) {
        fn(e, t, i);
      }
    }
    var U0 = !1;
    function $w(e, t) {
      rx(e.containerInfo), Ce = t, Qw();
      var a = U0;
      return U0 = !1, a;
    }
    function Qw() {
      for (; Ce !== null; ) {
        var e = Ce, t = e.child;
        (e.subtreeFlags & kl) !== De && t !== null ? (t.return = e, Ce = t) : Ww();
      }
    }
    function Ww() {
      for (; Ce !== null; ) {
        var e = Ce;
        Gt(e);
        try {
          Gw(e);
        } catch (a) {
          fn(e, e.return, a);
        }
        cn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ce = t;
          return;
        }
        Ce = e.return;
      }
    }
    function Gw(e) {
      var t = e.alternate, a = e.flags;
      if ((a & $n) !== De) {
        switch (Gt(e), e.tag) {
          case ce:
          case Ye:
          case ge:
            break;
          case pe: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !ec && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", $e(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", $e(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = M0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", $e(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case Z: {
            {
              var v = e.stateNode;
              kx(v.containerInfo);
            }
            break;
          }
          case re:
          case Fe:
          case ye:
          case St:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        cn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Pa ? Ki(t) : (e & fr) !== Pa && cs(t), (e & $l) !== Pa && qp(!0), Lm(t, a, p), (e & $l) !== Pa && qp(!1), (e & Fr) !== Pa ? Ml() : (e & fr) !== Pa && wd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Ho(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & Fr) !== Pa ? bd(t) : (e & fr) !== Pa && Lc(t);
            var f = s.create;
            (e & $l) !== Pa && qp(!0), s.destroy = f(), (e & $l) !== Pa && qp(!1), (e & Fr) !== Pa ? Av() : (e & fr) !== Pa && jv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & fr) !== De ? v = "useLayoutEffect" : (s.tag & $l) !== De ? v = "useInsertionEffect" : v = "useEffect";
                var y = void 0;
                p === null ? y = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? y = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : y = " You returned: " + p, S("%s must not return anything besides a function, which is used for clean-up.%s", v, y);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function qw(e, t) {
      if ((t.flags & Rt) !== De)
        switch (t.tag) {
          case vt: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = XC(), p = t.alternate === null ? "mount" : "update";
            KC() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case Z:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case vt:
                  var g = v.stateNode;
                  g.passiveEffectDuration += a;
                  break e;
              }
              v = v.return;
            }
            break;
          }
        }
    }
    function Kw(e, t, a, i) {
      if ((a.flags & Ol) !== De)
        switch (a.tag) {
          case ce:
          case Ye:
          case ge: {
            if (!Pr)
              if (a.mode & Ut)
                try {
                  ql(), Ho(fr | cr, a);
                } finally {
                  Gl(a);
                }
              else
                Ho(fr | cr, a);
            break;
          }
          case pe: {
            var u = a.stateNode;
            if (a.flags & Rt && !Pr)
              if (t === null)
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", $e(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", $e(a) || "instance")), a.mode & Ut)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", $e(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", $e(a) || "instance")), a.mode & Ut)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", $e(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", $e(a) || "instance")), CC(a, p, u));
            break;
          }
          case Z: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case re:
                    y = a.child.stateNode;
                    break;
                  case pe:
                    y = a.child.stateNode;
                    break;
                }
              CC(a, v, y);
            }
            break;
          }
          case re: {
            var g = a.stateNode;
            if (t === null && a.flags & Rt) {
              var w = a.type, x = a.memoizedProps;
              vx(g, w, x);
            }
            break;
          }
          case Fe:
            break;
          case ye:
            break;
          case vt: {
            {
              var M = a.memoizedProps, A = M.onCommit, F = M.onRender, oe = a.stateNode.effectDuration, Me = XC(), we = t === null ? "mount" : "update";
              KC() && (we = "nested-update"), typeof F == "function" && F(a.memoizedProps.id, we, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Me);
              {
                typeof A == "function" && A(a.memoizedProps.id, we, oe, Me), W1(a);
                var bt = a.return;
                e: for (; bt !== null; ) {
                  switch (bt.tag) {
                    case Z:
                      var Et = bt.stateNode;
                      Et.effectDuration += oe;
                      break e;
                    case vt:
                      var D = bt.stateNode;
                      D.effectDuration += oe;
                      break e;
                  }
                  bt = bt.return;
                }
              }
            }
            break;
          }
          case ee: {
            a1(e, a);
            break;
          }
          case ht:
          case St:
          case Ge:
          case _e:
          case Pt:
          case Nt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Pr || a.flags & En && A0(a);
    }
    function Xw(e) {
      switch (e.tag) {
        case ce:
        case Ye:
        case ge: {
          if (e.mode & Ut)
            try {
              ql(), N0(e, e.return);
            } finally {
              Gl(e);
            }
          else
            N0(e, e.return);
          break;
        }
        case pe: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Yw(e, e.return, t), z0(e, e.return);
          break;
        }
        case re: {
          z0(e, e.return);
          break;
        }
      }
    }
    function Jw(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === re) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? xx(u) : wx(i.stateNode, i.memoizedProps);
            } catch (f) {
              fn(e, e.return, f);
            }
          }
        } else if (i.tag === Fe) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? bx(s) : _x(s, i.memoizedProps);
            } catch (f) {
              fn(e, e.return, f);
            }
        } else if (!((i.tag === _e || i.tag === Pt) && i.memoizedState !== null && i !== e)) {
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
    function A0(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case re:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Ut)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", $e(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", $e(e)), t.current = i;
      }
    }
    function Zw(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function j0(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, j0(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === re) {
          var a = e.stateNode;
          a !== null && ib(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function e1(e) {
      for (var t = e.return; t !== null; ) {
        if (F0(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function F0(e) {
      return e.tag === re || e.tag === Z || e.tag === ye;
    }
    function H0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || F0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== re && t.tag !== Fe && t.tag !== st; ) {
          if (t.flags & mn || t.child === null || t.tag === ye)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & mn))
          return t.stateNode;
      }
    }
    function t1(e) {
      var t = e1(e);
      switch (t.tag) {
        case re: {
          var a = t.stateNode;
          t.flags & Oa && (VE(a), t.flags &= ~Oa);
          var i = H0(e);
          OS(e, i, a);
          break;
        }
        case Z:
        case ye: {
          var u = t.stateNode.containerInfo, s = H0(e);
          DS(e, s, u);
          break;
        }
        // eslint-disable-next-line-no-fallthrough
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function DS(e, t, a) {
      var i = e.tag, u = i === re || i === Fe;
      if (u) {
        var s = e.stateNode;
        t ? Ex(a, s, t) : gx(a, s);
      } else if (i !== ye) {
        var f = e.child;
        if (f !== null) {
          DS(f, t, a);
          for (var p = f.sibling; p !== null; )
            DS(p, t, a), p = p.sibling;
        }
      }
    }
    function OS(e, t, a) {
      var i = e.tag, u = i === re || i === Fe;
      if (u) {
        var s = e.stateNode;
        t ? Sx(a, s, t) : yx(a, s);
      } else if (i !== ye) {
        var f = e.child;
        if (f !== null) {
          OS(f, t, a);
          for (var p = f.sibling; p !== null; )
            OS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function n1(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case re: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case Z: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case ye: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        P0(e, t, a), Vr = null, cl = !1;
      }
      Zw(a);
    }
    function Po(e, t, a) {
      for (var i = a.child; i !== null; )
        P0(e, t, i), i = i.sibling;
    }
    function P0(e, t, a) {
      switch (Rd(a), a.tag) {
        case re:
          Pr || Vf(a, t);
        // eslint-disable-next-line-no-fallthrough
        case Fe: {
          {
            var i = Vr, u = cl;
            Vr = null, Po(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? Rx(Vr, a.stateNode) : Cx(Vr, a.stateNode));
          }
          return;
        }
        case st: {
          Vr !== null && (cl ? Tx(Vr, a.stateNode) : Vy(Vr, a.stateNode));
          return;
        }
        case ye: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Po(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case ce:
        case Ye:
        case Ae:
        case ge: {
          if (!Pr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, g = y;
                do {
                  var w = g, x = w.destroy, M = w.tag;
                  x !== void 0 && ((M & $l) !== Pa ? Lm(a, t, x) : (M & fr) !== Pa && (cs(a), a.mode & Ut ? (ql(), Lm(a, t, x), Gl(a)) : Lm(a, t, x), wd())), g = g.next;
                } while (g !== y);
              }
            }
          }
          Po(e, t, a);
          return;
        }
        case pe: {
          if (!Pr) {
            Vf(a, t);
            var A = a.stateNode;
            typeof A.componentWillUnmount == "function" && kS(a, t, A);
          }
          Po(e, t, a);
          return;
        }
        case Ge: {
          Po(e, t, a);
          return;
        }
        case _e: {
          if (
            // TODO: Remove this dead flag
            a.mode & pt
          ) {
            var F = Pr;
            Pr = F || a.memoizedState !== null, Po(e, t, a), Pr = F;
          } else
            Po(e, t, a);
          break;
        }
        default: {
          Po(e, t, a);
          return;
        }
      }
    }
    function r1(e) {
      e.memoizedState;
    }
    function a1(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && Bx(s);
          }
        }
      }
    }
    function V0(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new Vw()), t.forEach(function(i) {
          var u = e_.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Jr)
              if (Hf !== null && Pf !== null)
                Gp(Pf, Hf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function i1(e, t, a) {
      Hf = a, Pf = e, Gt(t), B0(t, e), Gt(t), Hf = null, Pf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            n1(e, t, s);
          } catch (v) {
            fn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & Dl)
        for (var p = t.child; p !== null; )
          Gt(p), B0(p, e), p = p.sibling;
      Gt(f);
    }
    function B0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case ce:
        case Ye:
        case Ae:
        case ge: {
          if (fl(t, e), Kl(e), u & Rt) {
            try {
              sl($l | cr, e, e.return), Ho($l | cr, e);
            } catch (Be) {
              fn(e, e.return, Be);
            }
            if (e.mode & Ut) {
              try {
                ql(), sl(fr | cr, e, e.return);
              } catch (Be) {
                fn(e, e.return, Be);
              }
              Gl(e);
            } else
              try {
                sl(fr | cr, e, e.return);
              } catch (Be) {
                fn(e, e.return, Be);
              }
          }
          return;
        }
        case pe: {
          fl(t, e), Kl(e), u & En && i !== null && Vf(i, i.return);
          return;
        }
        case re: {
          fl(t, e), Kl(e), u & En && i !== null && Vf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                VE(s);
              } catch (Be) {
                fn(e, e.return, Be);
              }
            }
            if (u & Rt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, g = e.updateQueue;
                if (e.updateQueue = null, g !== null)
                  try {
                    hx(f, g, y, v, p, e);
                  } catch (Be) {
                    fn(e, e.return, Be);
                  }
              }
            }
          }
          return;
        }
        case Fe: {
          if (fl(t, e), Kl(e), u & Rt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var w = e.stateNode, x = e.memoizedProps, M = i !== null ? i.memoizedProps : x;
            try {
              mx(w, M, x);
            } catch (Be) {
              fn(e, e.return, Be);
            }
          }
          return;
        }
        case Z: {
          if (fl(t, e), Kl(e), u & Rt && i !== null) {
            var A = i.memoizedState;
            if (A.isDehydrated)
              try {
                Vx(t.containerInfo);
              } catch (Be) {
                fn(e, e.return, Be);
              }
          }
          return;
        }
        case ye: {
          fl(t, e), Kl(e);
          return;
        }
        case ee: {
          fl(t, e), Kl(e);
          var F = e.child;
          if (F.flags & Nn) {
            var oe = F.stateNode, Me = F.memoizedState, we = Me !== null;
            if (oe.isHidden = we, we) {
              var bt = F.alternate !== null && F.alternate.memoizedState !== null;
              bt || H1();
            }
          }
          if (u & Rt) {
            try {
              r1(e);
            } catch (Be) {
              fn(e, e.return, Be);
            }
            V0(e);
          }
          return;
        }
        case _e: {
          var Et = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & pt
          ) {
            var D = Pr;
            Pr = D || Et, fl(t, e), Pr = D;
          } else
            fl(t, e);
          if (Kl(e), u & Nn) {
            var H = e.stateNode, O = e.memoizedState, K = O !== null, ve = e;
            if (H.isHidden = K, K && !Et && (ve.mode & pt) !== Oe) {
              Ce = ve;
              for (var se = ve.child; se !== null; )
                Ce = se, u1(se), se = se.sibling;
            }
            Jw(ve, K);
          }
          return;
        }
        case ht: {
          fl(t, e), Kl(e), u & Rt && V0(e);
          return;
        }
        case Ge:
          return;
        default: {
          fl(t, e), Kl(e);
          return;
        }
      }
    }
    function Kl(e) {
      var t = e.flags;
      if (t & mn) {
        try {
          t1(e);
        } catch (a) {
          fn(e, e.return, a);
        }
        e.flags &= ~mn;
      }
      t & qr && (e.flags &= ~qr);
    }
    function l1(e, t, a) {
      Hf = a, Pf = t, Ce = e, I0(e, t, a), Hf = null, Pf = null;
    }
    function I0(e, t, a) {
      for (var i = (e.mode & pt) !== Oe; Ce !== null; ) {
        var u = Ce, s = u.child;
        if (u.tag === _e && i) {
          var f = u.memoizedState !== null, p = f || Om;
          if (p) {
            LS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, g = y || Pr, w = Om, x = Pr;
            Om = p, Pr = g, Pr && !x && (Ce = u, o1(u));
            for (var M = s; M !== null; )
              Ce = M, I0(
                M,
                // New root; bubble back up to here and stop.
                t,
                a
              ), M = M.sibling;
            Ce = u, Om = w, Pr = x, LS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== De && s !== null ? (s.return = u, Ce = s) : LS(e, t, a);
      }
    }
    function LS(e, t, a) {
      for (; Ce !== null; ) {
        var i = Ce;
        if ((i.flags & Ol) !== De) {
          var u = i.alternate;
          Gt(i);
          try {
            Kw(t, u, i, a);
          } catch (f) {
            fn(i, i.return, f);
          }
          cn();
        }
        if (i === e) {
          Ce = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ce = s;
          return;
        }
        Ce = i.return;
      }
    }
    function u1(e) {
      for (; Ce !== null; ) {
        var t = Ce, a = t.child;
        switch (t.tag) {
          case ce:
          case Ye:
          case Ae:
          case ge: {
            if (t.mode & Ut)
              try {
                ql(), sl(fr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(fr, t, t.return);
            break;
          }
          case pe: {
            Vf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && kS(t, t.return, i);
            break;
          }
          case re: {
            Vf(t, t.return);
            break;
          }
          case _e: {
            var u = t.memoizedState !== null;
            if (u) {
              Y0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ce = a) : Y0(e);
      }
    }
    function Y0(e) {
      for (; Ce !== null; ) {
        var t = Ce;
        if (t === e) {
          Ce = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ce = a;
          return;
        }
        Ce = t.return;
      }
    }
    function o1(e) {
      for (; Ce !== null; ) {
        var t = Ce, a = t.child;
        if (t.tag === _e) {
          var i = t.memoizedState !== null;
          if (i) {
            $0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ce = a) : $0(e);
      }
    }
    function $0(e) {
      for (; Ce !== null; ) {
        var t = Ce;
        Gt(t);
        try {
          Xw(t);
        } catch (i) {
          fn(t, t.return, i);
        }
        if (cn(), t === e) {
          Ce = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ce = a;
          return;
        }
        Ce = t.return;
      }
    }
    function s1(e, t, a, i) {
      Ce = t, c1(t, e, a, i);
    }
    function c1(e, t, a, i) {
      for (; Ce !== null; ) {
        var u = Ce, s = u.child;
        (u.subtreeFlags & Gi) !== De && s !== null ? (s.return = u, Ce = s) : f1(e, t, a, i);
      }
    }
    function f1(e, t, a, i) {
      for (; Ce !== null; ) {
        var u = Ce;
        if ((u.flags & Gr) !== De) {
          Gt(u);
          try {
            d1(t, u, a, i);
          } catch (f) {
            fn(u, u.return, f);
          }
          cn();
        }
        if (u === e) {
          Ce = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, Ce = s;
          return;
        }
        Ce = u.return;
      }
    }
    function d1(e, t, a, i) {
      switch (t.tag) {
        case ce:
        case Ye:
        case ge: {
          if (t.mode & Ut) {
            Kg();
            try {
              Ho(Fr | cr, t);
            } finally {
              qg(t);
            }
          } else
            Ho(Fr | cr, t);
          break;
        }
      }
    }
    function p1(e) {
      Ce = e, v1();
    }
    function v1() {
      for (; Ce !== null; ) {
        var e = Ce, t = e.child;
        if ((Ce.flags & Da) !== De) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              Ce = u, y1(u, e);
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
            Ce = e;
          }
        }
        (e.subtreeFlags & Gi) !== De && t !== null ? (t.return = e, Ce = t) : h1();
      }
    }
    function h1() {
      for (; Ce !== null; ) {
        var e = Ce;
        (e.flags & Gr) !== De && (Gt(e), m1(e), cn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ce = t;
          return;
        }
        Ce = e.return;
      }
    }
    function m1(e) {
      switch (e.tag) {
        case ce:
        case Ye:
        case ge: {
          e.mode & Ut ? (Kg(), sl(Fr | cr, e, e.return), qg(e)) : sl(Fr | cr, e, e.return);
          break;
        }
      }
    }
    function y1(e, t) {
      for (; Ce !== null; ) {
        var a = Ce;
        Gt(a), S1(a, t), cn();
        var i = a.child;
        i !== null ? (i.return = a, Ce = i) : g1(e);
      }
    }
    function g1(e) {
      for (; Ce !== null; ) {
        var t = Ce, a = t.sibling, i = t.return;
        if (j0(t), t === e) {
          Ce = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ce = a;
          return;
        }
        Ce = i;
      }
    }
    function S1(e, t) {
      switch (e.tag) {
        case ce:
        case Ye:
        case ge: {
          e.mode & Ut ? (Kg(), sl(Fr, e, t), qg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function E1(e) {
      switch (e.tag) {
        case ce:
        case Ye:
        case ge: {
          try {
            Ho(fr | cr, e);
          } catch (a) {
            fn(e, e.return, a);
          }
          break;
        }
        case pe: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            fn(e, e.return, a);
          }
          break;
        }
      }
    }
    function C1(e) {
      switch (e.tag) {
        case ce:
        case Ye:
        case ge: {
          try {
            Ho(Fr | cr, e);
          } catch (t) {
            fn(e, e.return, t);
          }
          break;
        }
      }
    }
    function R1(e) {
      switch (e.tag) {
        case ce:
        case Ye:
        case ge: {
          try {
            sl(fr | cr, e, e.return);
          } catch (a) {
            fn(e, e.return, a);
          }
          break;
        }
        case pe: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && kS(e, e.return, t);
          break;
        }
      }
    }
    function T1(e) {
      switch (e.tag) {
        case ce:
        case Ye:
        case ge:
          try {
            sl(Fr | cr, e, e.return);
          } catch (t) {
            fn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var jp = Symbol.for;
      jp("selector.component"), jp("selector.has_pseudo_class"), jp("selector.role"), jp("selector.test_id"), jp("selector.text");
    }
    var x1 = [];
    function b1() {
      x1.forEach(function(e) {
        return e();
      });
    }
    var w1 = N.ReactCurrentActQueue;
    function _1(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function Q0() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && w1.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var k1 = Math.ceil, MS = N.ReactCurrentDispatcher, NS = N.ReactCurrentOwner, Br = N.ReactCurrentBatchConfig, dl = N.ReactCurrentActQueue, vr = (
      /*             */
      0
    ), W0 = (
      /*               */
      1
    ), Ir = (
      /*                */
      2
    ), ji = (
      /*                */
      4
    ), Bu = 0, Fp = 1, tc = 2, Mm = 3, Hp = 4, G0 = 5, zS = 6, xt = vr, Ea = null, Dn = null, hr = Y, Xl = Y, US = Oo(Y), mr = Bu, Pp = null, Nm = Y, Vp = Y, zm = Y, Bp = null, Va = null, AS = 0, q0 = 500, K0 = 1 / 0, D1 = 500, Iu = null;
    function Ip() {
      K0 = Qn() + D1;
    }
    function X0() {
      return K0;
    }
    var Um = !1, jS = null, Bf = null, nc = !1, Vo = null, Yp = Y, FS = [], HS = null, O1 = 50, $p = 0, PS = null, VS = !1, Am = !1, L1 = 50, If = 0, jm = null, Qp = en, Fm = Y, J0 = !1;
    function Hm() {
      return Ea;
    }
    function Ca() {
      return (xt & (Ir | ji)) !== vr ? Qn() : (Qp !== en || (Qp = Qn()), Qp);
    }
    function Bo(e) {
      var t = e.mode;
      if ((t & pt) === Oe)
        return He;
      if ((xt & Ir) !== vr && hr !== Y)
        return Ts(hr);
      var a = wb() !== bb;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Fm === Mt && (Fm = zd()), Fm;
      }
      var u = Aa();
      if (u !== Mt)
        return u;
      var s = cx();
      return s;
    }
    function M1(e) {
      var t = e.mode;
      return (t & pt) === Oe ? He : Iv();
    }
    function yr(e, t, a, i) {
      n_(), J0 && S("useInsertionEffect must not schedule updates."), VS && (Am = !0), So(e, a, i), (xt & Ir) !== Y && e === Ea ? i_(t) : (Jr && ws(e, t, a), l_(t), e === Ea && ((xt & Ir) === vr && (Vp = Je(Vp, a)), mr === Hp && Io(e, hr)), Ba(e, i), a === He && xt === vr && (t.mode & pt) === Oe && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Ip(), JE()));
    }
    function N1(e, t, a) {
      var i = e.current;
      i.lanes = t, So(e, t, a), Ba(e, a);
    }
    function z1(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (xt & Ir) !== vr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Xc(e, t);
      var i = Kc(e, e === Ea ? hr : Y);
      if (i === Y) {
        a !== null && vR(a), e.callbackNode = null, e.callbackPriority = Mt;
        return;
      }
      var u = Ul(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== GS)) {
        a == null && s !== He && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && vR(a);
      var f;
      if (u === He)
        e.tag === Lo ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), ob(tR.bind(null, e))) : XE(tR.bind(null, e)), dl.current !== null ? dl.current.push(Mo) : dx(function() {
          (xt & (Ir | ji)) === vr && Mo();
        }), f = null;
      else {
        var p;
        switch (Kv(i)) {
          case Mr:
            p = ss;
            break;
          case _i:
            p = Ll;
            break;
          case za:
            p = qi;
            break;
          case Ua:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = qS(p, Z0.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function Z0(e, t) {
      if (Jb(), Qp = en, Fm = Y, (xt & (Ir | ji)) !== vr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = Kc(e, e === Ea ? hr : Y);
      if (u === Y)
        return null;
      var s = !Zc(e, u) && !Bv(e, u) && !t, f = s ? Y1(e, u) : Vm(e, u);
      if (f !== Bu) {
        if (f === tc) {
          var p = Jc(e);
          p !== Y && (u = p, f = BS(e, p));
        }
        if (f === Fp) {
          var v = Pp;
          throw rc(e, Y), Io(e, u), Ba(e, Qn()), v;
        }
        if (f === zS)
          Io(e, u);
        else {
          var y = !Zc(e, u), g = e.current.alternate;
          if (y && !A1(g)) {
            if (f = Vm(e, u), f === tc) {
              var w = Jc(e);
              w !== Y && (u = w, f = BS(e, w));
            }
            if (f === Fp) {
              var x = Pp;
              throw rc(e, Y), Io(e, u), Ba(e, Qn()), x;
            }
          }
          e.finishedWork = g, e.finishedLanes = u, U1(e, f, u);
        }
      }
      return Ba(e, Qn()), e.callbackNode === a ? Z0.bind(null, e) : null;
    }
    function BS(e, t) {
      var a = Bp;
      if (nf(e)) {
        var i = rc(e, t);
        i.flags |= Cr, tb(e.containerInfo);
      }
      var u = Vm(e, t);
      if (u !== tc) {
        var s = Va;
        Va = a, s !== null && eR(s);
      }
      return u;
    }
    function eR(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function U1(e, t, a) {
      switch (t) {
        case Bu:
        case Fp:
          throw new Error("Root did not complete. This is a bug in React.");
        // Flow knows about invariant, so it complains if I add a break
        // statement, but eslint doesn't know about invariant, so it complains
        // if I do. eslint-disable-next-line no-fallthrough
        case tc: {
          ac(e, Va, Iu);
          break;
        }
        case Mm: {
          if (Io(e, a), _u(a) && // do not delay if we're inside an act() scope
          !hR()) {
            var i = AS + q0 - Qn();
            if (i > 10) {
              var u = Kc(e, Y);
              if (u !== Y)
                break;
              var s = e.suspendedLanes;
              if (!ku(s, a)) {
                Ca(), ef(e, s);
                break;
              }
              e.timeoutHandle = Hy(ac.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case Hp: {
          if (Io(e, a), Md(a))
            break;
          if (!hR()) {
            var f = ai(e, a), p = f, v = Qn() - p, y = t_(v) - v;
            if (y > 10) {
              e.timeoutHandle = Hy(ac.bind(null, e, Va, Iu), y);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case G0: {
          ac(e, Va, Iu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function A1(e) {
      for (var t = e; ; ) {
        if (t.flags & vo) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!G(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & vo && v !== null) {
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
    function Io(e, t) {
      t = xs(t, zm), t = xs(t, Vp), Qv(e, t);
    }
    function tR(e) {
      if (Zb(), (xt & (Ir | ji)) !== vr)
        throw new Error("Should not already be working.");
      $u();
      var t = Kc(e, Y);
      if (!ea(t, He))
        return Ba(e, Qn()), null;
      var a = Vm(e, t);
      if (e.tag !== Lo && a === tc) {
        var i = Jc(e);
        i !== Y && (t = i, a = BS(e, i));
      }
      if (a === Fp) {
        var u = Pp;
        throw rc(e, Y), Io(e, t), Ba(e, Qn()), u;
      }
      if (a === zS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ac(e, Va, Iu), Ba(e, Qn()), null;
    }
    function j1(e, t) {
      t !== Y && (tf(e, Je(t, He)), Ba(e, Qn()), (xt & (Ir | ji)) === vr && (Ip(), Mo()));
    }
    function IS(e, t) {
      var a = xt;
      xt |= W0;
      try {
        return e(t);
      } finally {
        xt = a, xt === vr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Ip(), JE());
      }
    }
    function F1(e, t, a, i, u) {
      var s = Aa(), f = Br.transition;
      try {
        return Br.transition = null, jn(Mr), e(t, a, i, u);
      } finally {
        jn(s), Br.transition = f, xt === vr && Ip();
      }
    }
    function Yu(e) {
      Vo !== null && Vo.tag === Lo && (xt & (Ir | ji)) === vr && $u();
      var t = xt;
      xt |= W0;
      var a = Br.transition, i = Aa();
      try {
        return Br.transition = null, jn(Mr), e ? e() : void 0;
      } finally {
        jn(i), Br.transition = a, xt = t, (xt & (Ir | ji)) === vr && Mo();
      }
    }
    function nR() {
      return (xt & (Ir | ji)) !== vr;
    }
    function Pm(e, t) {
      ia(US, Xl, e), Xl = Je(Xl, t);
    }
    function YS(e) {
      Xl = US.current, aa(US, e);
    }
    function rc(e, t) {
      e.finishedWork = null, e.finishedLanes = Y;
      var a = e.timeoutHandle;
      if (a !== Py && (e.timeoutHandle = Py, fx(a)), Dn !== null)
        for (var i = Dn.return; i !== null; ) {
          var u = i.alternate;
          L0(u, i), i = i.return;
        }
      Ea = e;
      var s = ic(e.current, null);
      return Dn = s, hr = Xl = t, mr = Bu, Pp = null, Nm = Y, Vp = Y, zm = Y, Bp = null, Va = null, Nb(), al.discardPendingWarnings(), s;
    }
    function rR(e, t) {
      do {
        var a = Dn;
        try {
          if (Kh(), _C(), cn(), NS.current = null, a === null || a.return === null) {
            mr = Fp, Pp = t, Dn = null;
            return;
          }
          if (je && a.mode & Ut && bm(a, !0), Ve)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              wi(a, i, hr);
            } else
              fs(a, t, hr);
          ow(e, a.return, a, t, hr), uR(a);
        } catch (u) {
          t = u, Dn === a && a !== null ? (a = a.return, Dn = a) : a = Dn;
          continue;
        }
        return;
      } while (!0);
    }
    function aR() {
      var e = MS.current;
      return MS.current = Em, e === null ? Em : e;
    }
    function iR(e) {
      MS.current = e;
    }
    function H1() {
      AS = Qn();
    }
    function Wp(e) {
      Nm = Je(e, Nm);
    }
    function P1() {
      mr === Bu && (mr = Mm);
    }
    function $S() {
      (mr === Bu || mr === Mm || mr === tc) && (mr = Hp), Ea !== null && (Rs(Nm) || Rs(Vp)) && Io(Ea, hr);
    }
    function V1(e) {
      mr !== Hp && (mr = tc), Bp === null ? Bp = [e] : Bp.push(e);
    }
    function B1() {
      return mr === Bu;
    }
    function Vm(e, t) {
      var a = xt;
      xt |= Ir;
      var i = aR();
      if (Ea !== e || hr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Gp(e, hr), u.clear()), Wv(e, t);
        }
        Iu = Fd(), rc(e, t);
      }
      Eu(t);
      do
        try {
          I1();
          break;
        } catch (s) {
          rR(e, s);
        }
      while (!0);
      if (Kh(), xt = a, iR(i), Dn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), Ea = null, hr = Y, mr;
    }
    function I1() {
      for (; Dn !== null; )
        lR(Dn);
    }
    function Y1(e, t) {
      var a = xt;
      xt |= Ir;
      var i = aR();
      if (Ea !== e || hr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Gp(e, hr), u.clear()), Wv(e, t);
        }
        Iu = Fd(), Ip(), rc(e, t);
      }
      Eu(t);
      do
        try {
          $1();
          break;
        } catch (s) {
          rR(e, s);
        }
      while (!0);
      return Kh(), iR(i), xt = a, Dn !== null ? (Fv(), Bu) : (Mc(), Ea = null, hr = Y, mr);
    }
    function $1() {
      for (; Dn !== null && !yd(); )
        lR(Dn);
    }
    function lR(e) {
      var t = e.alternate;
      Gt(e);
      var a;
      (e.mode & Ut) !== Oe ? (Gg(e), a = QS(t, e, Xl), bm(e, !0)) : a = QS(t, e, Xl), cn(), e.memoizedProps = e.pendingProps, a === null ? uR(e) : Dn = a, NS.current = null;
    }
    function uR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & os) === De) {
          Gt(t);
          var u = void 0;
          if ((t.mode & Ut) === Oe ? u = O0(a, t, Xl) : (Gg(t), u = O0(a, t, Xl), bm(t, !1)), cn(), u !== null) {
            Dn = u;
            return;
          }
        } else {
          var s = Pw(a, t);
          if (s !== null) {
            s.flags &= Mv, Dn = s;
            return;
          }
          if ((t.mode & Ut) !== Oe) {
            bm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= os, i.subtreeFlags = De, i.deletions = null;
          else {
            mr = zS, Dn = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          Dn = v;
          return;
        }
        t = i, Dn = t;
      } while (t !== null);
      mr === Bu && (mr = G0);
    }
    function ac(e, t, a) {
      var i = Aa(), u = Br.transition;
      try {
        Br.transition = null, jn(Mr), Q1(e, t, a, i);
      } finally {
        Br.transition = u, jn(i);
      }
      return null;
    }
    function Q1(e, t, a, i) {
      do
        $u();
      while (Vo !== null);
      if (r_(), (xt & (Ir | ji)) !== vr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Td(s), u === null)
        return xd(), null;
      if (s === Y && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = Y, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Mt;
      var f = Je(u.lanes, u.childLanes);
      Ad(e, f), e === Ea && (Ea = null, Dn = null, hr = Y), ((u.subtreeFlags & Gi) !== De || (u.flags & Gi) !== De) && (nc || (nc = !0, HS = a, qS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (kl | Dl | Ol | Gi)) !== De, v = (u.flags & (kl | Dl | Ol | Gi)) !== De;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var g = Aa();
        jn(Mr);
        var w = xt;
        xt |= ji, NS.current = null, $w(e, u), JC(), i1(e, u, s), ax(e.containerInfo), e.current = u, ds(s), l1(u, e, s), ps(), gd(), xt = w, jn(g), Br.transition = y;
      } else
        e.current = u, JC();
      var x = nc;
      if (nc ? (nc = !1, Vo = e, Yp = s) : (If = 0, jm = null), f = e.pendingLanes, f === Y && (Bf = null), x || fR(e.current, !1), Ed(u.stateNode, i), Jr && e.memoizedUpdaters.clear(), b1(), Ba(e, Qn()), t !== null)
        for (var M = e.onRecoverableError, A = 0; A < t.length; A++) {
          var F = t[A], oe = F.stack, Me = F.digest;
          M(F.value, {
            componentStack: oe,
            digest: Me
          });
        }
      if (Um) {
        Um = !1;
        var we = jS;
        throw jS = null, we;
      }
      return ea(Yp, He) && e.tag !== Lo && $u(), f = e.pendingLanes, ea(f, He) ? (Xb(), e === PS ? $p++ : ($p = 0, PS = e)) : $p = 0, Mo(), xd(), null;
    }
    function $u() {
      if (Vo !== null) {
        var e = Kv(Yp), t = ks(za, e), a = Br.transition, i = Aa();
        try {
          return Br.transition = null, jn(t), G1();
        } finally {
          jn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function W1(e) {
      FS.push(e), nc || (nc = !0, qS(qi, function() {
        return $u(), null;
      }));
    }
    function G1() {
      if (Vo === null)
        return !1;
      var e = HS;
      HS = null;
      var t = Vo, a = Yp;
      if (Vo = null, Yp = Y, (xt & (Ir | ji)) !== vr)
        throw new Error("Cannot flush passive effects while already rendering.");
      VS = !0, Am = !1, Su(a);
      var i = xt;
      xt |= ji, p1(t.current), s1(t, t.current, a, e);
      {
        var u = FS;
        FS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          qw(t, f);
        }
      }
      _d(), fR(t.current, !0), xt = i, Mo(), Am ? t === jm ? If++ : (If = 0, jm = t) : If = 0, VS = !1, Am = !1, Cd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function oR(e) {
      return Bf !== null && Bf.has(e);
    }
    function q1(e) {
      Bf === null ? Bf = /* @__PURE__ */ new Set([e]) : Bf.add(e);
    }
    function K1(e) {
      Um || (Um = !0, jS = e);
    }
    var X1 = K1;
    function sR(e, t, a) {
      var i = Zs(a, t), u = l0(e, i, He), s = zo(e, u, He), f = Ca();
      s !== null && (So(s, He, f), Ba(s, f));
    }
    function fn(e, t, a) {
      if (Bw(a), qp(!1), e.tag === Z) {
        sR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === Z) {
          sR(i, e, a);
          return;
        } else if (i.tag === pe) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !oR(s)) {
            var f = Zs(a, e), p = dS(i, f, He), v = zo(i, p, He), y = Ca();
            v !== null && (So(v, He, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function J1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ca();
      ef(e, a), u_(e), Ea === e && ku(hr, a) && (mr === Hp || mr === Mm && _u(hr) && Qn() - AS < q0 ? rc(e, Y) : zm = Je(zm, a)), Ba(e, u);
    }
    function cR(e, t) {
      t === Mt && (t = M1(e));
      var a = Ca(), i = Ha(e, t);
      i !== null && (So(i, t, a), Ba(i, a));
    }
    function Z1(e) {
      var t = e.memoizedState, a = Mt;
      t !== null && (a = t.retryLane), cR(e, a);
    }
    function e_(e, t) {
      var a = Mt, i;
      switch (e.tag) {
        case ee:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case ht:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), cR(e, a);
    }
    function t_(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : k1(e / 1960) * 1960;
    }
    function n_() {
      if ($p > O1)
        throw $p = 0, PS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      If > L1 && (If = 0, jm = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function r_() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function fR(e, t) {
      Gt(e), Bm(e, _l, R1), t && Bm(e, Ti, T1), Bm(e, _l, E1), t && Bm(e, Ti, C1), cn();
    }
    function Bm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== De ? i = i.child : ((i.flags & t) !== De && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Im = null;
    function dR(e) {
      {
        if ((xt & Ir) !== vr || !(e.mode & pt))
          return;
        var t = e.tag;
        if (t !== Pe && t !== Z && t !== pe && t !== ce && t !== Ye && t !== Ae && t !== ge)
          return;
        var a = $e(e) || "ReactComponent";
        if (Im !== null) {
          if (Im.has(a))
            return;
          Im.add(a);
        } else
          Im = /* @__PURE__ */ new Set([a]);
        var i = ir;
        try {
          Gt(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Gt(e) : cn();
        }
      }
    }
    var QS;
    {
      var a_ = null;
      QS = function(e, t, a) {
        var i = ER(a_, t);
        try {
          return b0(e, t, a);
        } catch (s) {
          if (mb() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Kh(), _C(), L0(e, t), ER(t, i), t.mode & Ut && Gg(t), wl(null, b0, null, e, t, a), Qi()) {
            var u = us();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var pR = !1, WS;
    WS = /* @__PURE__ */ new Set();
    function i_(e) {
      if (mi && !Gb())
        switch (e.tag) {
          case ce:
          case Ye:
          case ge: {
            var t = Dn && $e(Dn) || "Unknown", a = t;
            if (!WS.has(a)) {
              WS.add(a);
              var i = $e(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case pe: {
            pR || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), pR = !0);
            break;
          }
        }
    }
    function Gp(e, t) {
      if (Jr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ws(e, i, t);
        });
      }
    }
    var GS = {};
    function qS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), GS) : md(e, t);
      }
    }
    function vR(e) {
      if (e !== GS)
        return zv(e);
    }
    function hR() {
      return dl.current !== null;
    }
    function l_(e) {
      {
        if (e.mode & pt) {
          if (!Q0())
            return;
        } else if (!_1() || xt !== vr || e.tag !== ce && e.tag !== Ye && e.tag !== ge)
          return;
        if (dl.current === null) {
          var t = ir;
          try {
            Gt(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, $e(e));
          } finally {
            t ? Gt(e) : cn();
          }
        }
      }
    }
    function u_(e) {
      e.tag !== Lo && Q0() && dl.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function qp(e) {
      J0 = e;
    }
    var Fi = null, Yf = null, o_ = function(e) {
      Fi = e;
    };
    function $f(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function KS(e) {
      return $f(e);
    }
    function XS(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = $f(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: B,
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
    function mR(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case pe: {
            typeof i == "function" && (u = !0);
            break;
          }
          case ce: {
            (typeof i == "function" || s === Qe) && (u = !0);
            break;
          }
          case Ye: {
            (s === B || s === Qe) && (u = !0);
            break;
          }
          case Ae:
          case ge: {
            (s === Ke || s === Qe) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = Fi(a);
          if (f !== void 0 && f === Fi(i))
            return !0;
        }
        return !1;
      }
    }
    function yR(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Yf === null && (Yf = /* @__PURE__ */ new WeakSet()), Yf.add(e);
      }
    }
    var s_ = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Yu(function() {
          JS(e.current, i, a);
        });
      }
    }, c_ = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Yu(function() {
          Kp(t, e, null, null);
        });
      }
    };
    function JS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case ce:
          case ge:
          case pe:
            v = p;
            break;
          case Ye:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, g = !1;
        if (v !== null) {
          var w = Fi(v);
          w !== void 0 && (a.has(w) ? g = !0 : t.has(w) && (f === pe ? g = !0 : y = !0));
        }
        if (Yf !== null && (Yf.has(e) || i !== null && Yf.has(i)) && (g = !0), g && (e._debugNeedsRemount = !0), g || y) {
          var x = Ha(e, He);
          x !== null && yr(x, e, He, en);
        }
        u !== null && !g && JS(u, t, a), s !== null && JS(s, t, a);
      }
    }
    var f_ = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return ZS(e.current, i, a), a;
      }
    };
    function ZS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case ce:
          case ge:
          case pe:
            p = f;
            break;
          case Ye:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? d_(e, a) : i !== null && ZS(i, t, a), u !== null && ZS(u, t, a);
      }
    }
    function d_(e, t) {
      {
        var a = p_(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case re:
              t.add(i.stateNode);
              return;
            case ye:
              t.add(i.stateNode.containerInfo);
              return;
            case Z:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function p_(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === re)
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
    var eE;
    {
      eE = !1;
      try {
        var gR = Object.preventExtensions({});
      } catch {
        eE = !0;
      }
    }
    function v_(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = De, this.subtreeFlags = De, this.deletions = null, this.lanes = Y, this.childLanes = Y, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !eE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new v_(e, t, a, i);
    };
    function tE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function h_(e) {
      return typeof e == "function" && !tE(e) && e.defaultProps === void 0;
    }
    function m_(e) {
      if (typeof e == "function")
        return tE(e) ? pe : ce;
      if (e != null) {
        var t = e.$$typeof;
        if (t === B)
          return Ye;
        if (t === Ke)
          return Ae;
      }
      return Pe;
    }
    function ic(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = De, a.subtreeFlags = De, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & zn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Pe:
        case ce:
        case ge:
          a.type = $f(e.type);
          break;
        case pe:
          a.type = KS(e.type);
          break;
        case Ye:
          a.type = XS(e.type);
          break;
      }
      return a;
    }
    function y_(e, t) {
      e.flags &= zn | mn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = Y, e.lanes = t, e.child = null, e.subtreeFlags = De, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = De, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function g_(e, t, a) {
      var i;
      return e === Ph ? (i = pt, t === !0 && (i |= Xt, i |= At)) : i = Oe, Jr && (i |= Ut), oi(Z, null, null, i);
    }
    function nE(e, t, a, i, u, s) {
      var f = Pe, p = e;
      if (typeof e == "function")
        tE(e) ? (f = pe, p = KS(p)) : p = $f(p);
      else if (typeof e == "string")
        f = re;
      else
        e: switch (e) {
          case di:
            return Yo(a.children, u, s, t);
          case Wa:
            f = rt, u |= Xt, (u & pt) !== Oe && (u |= At);
            break;
          case pi:
            return S_(a, u, s, t);
          case le:
            return E_(a, u, s, t);
          case me:
            return C_(a, u, s, t);
          case Tn:
            return SR(a, u, s, t);
          case an:
          // eslint-disable-next-line no-fallthrough
          case mt:
          // eslint-disable-next-line no-fallthrough
          case sn:
          // eslint-disable-next-line no-fallthrough
          case ar:
          // eslint-disable-next-line no-fallthrough
          case dt:
          // eslint-disable-next-line no-fallthrough
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = ot;
                  break e;
                case R:
                  f = tn;
                  break e;
                case B:
                  f = Ye, p = XS(p);
                  break e;
                case Ke:
                  f = Ae;
                  break e;
                case Qe:
                  f = Ot, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? $e(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var g = oi(f, a, t, u);
      return g.elementType = e, g.type = p, g.lanes = s, g._debugOwner = i, g;
    }
    function rE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = nE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Yo(e, t, a, i) {
      var u = oi(nt, e, i, t);
      return u.lanes = a, u;
    }
    function S_(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(vt, e, i, t | Ut);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function E_(e, t, a, i) {
      var u = oi(ee, e, i, t);
      return u.elementType = le, u.lanes = a, u;
    }
    function C_(e, t, a, i) {
      var u = oi(ht, e, i, t);
      return u.elementType = me, u.lanes = a, u;
    }
    function SR(e, t, a, i) {
      var u = oi(_e, e, i, t);
      u.elementType = Tn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function aE(e, t, a) {
      var i = oi(Fe, e, null, t);
      return i.lanes = a, i;
    }
    function R_() {
      var e = oi(re, null, null, Oe);
      return e.elementType = "DELETED", e;
    }
    function T_(e) {
      var t = oi(st, null, null, Oe);
      return t.stateNode = e, t;
    }
    function iE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(ye, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function ER(e, t) {
      return e === null && (e = oi(Pe, null, null, Oe)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function x_(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Py, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Mt, this.eventTimes = bs(Y), this.expirationTimes = bs(en), this.pendingLanes = Y, this.suspendedLanes = Y, this.pingedLanes = Y, this.expiredLanes = Y, this.mutableReadLanes = Y, this.finishedLanes = Y, this.entangledLanes = Y, this.entanglements = bs(Y), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Ph:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function CR(e, t, a, i, u, s, f, p, v, y) {
      var g = new x_(e, t, a, p, v), w = g_(t, s);
      g.current = w, w.stateNode = g;
      {
        var x = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        w.memoizedState = x;
      }
      return gg(w), g;
    }
    var lE = "18.3.1";
    function b_(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return $r(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: rr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var uE, oE;
    uE = !1, oE = {};
    function RR(e) {
      if (!e)
        return ui;
      var t = po(e), a = ub(t);
      if (t.tag === pe) {
        var i = t.type;
        if (Yl(i))
          return qE(t, i, a);
      }
      return a;
    }
    function w_(e, t) {
      {
        var a = po(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Kr(a);
        if (u === null)
          return null;
        if (u.mode & Xt) {
          var s = $e(a) || "Component";
          if (!oE[s]) {
            oE[s] = !0;
            var f = ir;
            try {
              Gt(u), a.mode & Xt ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Gt(f) : cn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function TR(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return CR(e, t, v, y, a, i, u, s, f);
    }
    function xR(e, t, a, i, u, s, f, p, v, y) {
      var g = !0, w = CR(a, i, g, e, u, s, f, p, v);
      w.context = RR(null);
      var x = w.current, M = Ca(), A = Bo(x), F = Pu(M, A);
      return F.callback = t ?? null, zo(x, F, A), N1(w, A, M), w;
    }
    function Kp(e, t, a, i) {
      Sd(t, e);
      var u = t.current, s = Ca(), f = Bo(u);
      gn(f);
      var p = RR(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && ir !== null && !uE && (uE = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, $e(ir) || "Unknown"));
      var v = Pu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = zo(u, v, f);
      return y !== null && (yr(y, u, f, s), tm(y, u, f)), f;
    }
    function Ym(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case re:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function __(e) {
      switch (e.tag) {
        case Z: {
          var t = e.stateNode;
          if (nf(t)) {
            var a = Pv(t);
            j1(t, a);
          }
          break;
        }
        case ee: {
          Yu(function() {
            var u = Ha(e, He);
            if (u !== null) {
              var s = Ca();
              yr(u, e, He, s);
            }
          });
          var i = He;
          sE(e, i);
          break;
        }
      }
    }
    function bR(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = $v(a.retryLane, t));
    }
    function sE(e, t) {
      bR(e, t);
      var a = e.alternate;
      a && bR(a, t);
    }
    function k_(e) {
      if (e.tag === ee) {
        var t = Ss, a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          yr(a, e, t, i);
        }
        sE(e, t);
      }
    }
    function D_(e) {
      if (e.tag === ee) {
        var t = Bo(e), a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          yr(a, e, t, i);
        }
        sE(e, t);
      }
    }
    function wR(e) {
      var t = dn(e);
      return t === null ? null : t.stateNode;
    }
    var _R = function(e) {
      return null;
    };
    function O_(e) {
      return _R(e);
    }
    var kR = function(e) {
      return !1;
    };
    function L_(e) {
      return kR(e);
    }
    var DR = null, OR = null, LR = null, MR = null, NR = null, zR = null, UR = null, AR = null, jR = null;
    {
      var FR = function(e, t, a) {
        var i = t[a], u = ut(e) ? e.slice() : et({}, e);
        return a + 1 === t.length ? (ut(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = FR(e[i], t, a + 1), u);
      }, HR = function(e, t) {
        return FR(e, t, 0);
      }, PR = function(e, t, a, i) {
        var u = t[i], s = ut(e) ? e.slice() : et({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], ut(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = PR(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, VR = function(e, t, a) {
        if (t.length !== a.length) {
          gt("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              gt("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return PR(e, t, a, 0);
      }, BR = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = ut(e) ? e.slice() : et({}, e);
        return s[u] = BR(e[u], t, a + 1, i), s;
      }, IR = function(e, t, a) {
        return BR(e, t, 0, a);
      }, cE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      DR = function(e, t, a, i) {
        var u = cE(e, t);
        if (u !== null) {
          var s = IR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = et({}, e.memoizedProps);
          var f = Ha(e, He);
          f !== null && yr(f, e, He, en);
        }
      }, OR = function(e, t, a) {
        var i = cE(e, t);
        if (i !== null) {
          var u = HR(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = et({}, e.memoizedProps);
          var s = Ha(e, He);
          s !== null && yr(s, e, He, en);
        }
      }, LR = function(e, t, a, i) {
        var u = cE(e, t);
        if (u !== null) {
          var s = VR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = et({}, e.memoizedProps);
          var f = Ha(e, He);
          f !== null && yr(f, e, He, en);
        }
      }, MR = function(e, t, a) {
        e.pendingProps = IR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, He);
        i !== null && yr(i, e, He, en);
      }, NR = function(e, t) {
        e.pendingProps = HR(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ha(e, He);
        a !== null && yr(a, e, He, en);
      }, zR = function(e, t, a) {
        e.pendingProps = VR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, He);
        i !== null && yr(i, e, He, en);
      }, UR = function(e) {
        var t = Ha(e, He);
        t !== null && yr(t, e, He, en);
      }, AR = function(e) {
        _R = e;
      }, jR = function(e) {
        kR = e;
      };
    }
    function M_(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function N_(e) {
      return null;
    }
    function z_() {
      return ir;
    }
    function U_(e) {
      var t = e.findFiberByHostInstance, a = N.ReactCurrentDispatcher;
      return mo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: DR,
        overrideHookStateDeletePath: OR,
        overrideHookStateRenamePath: LR,
        overrideProps: MR,
        overridePropsDeletePath: NR,
        overridePropsRenamePath: zR,
        setErrorHandler: AR,
        setSuspenseHandler: jR,
        scheduleUpdate: UR,
        currentDispatcherRef: a,
        findHostInstanceByFiber: M_,
        findFiberByHostInstance: t || N_,
        // React Refresh
        findHostInstancesForRefresh: f_,
        scheduleRefresh: s_,
        scheduleRoot: c_,
        setRefreshHandler: o_,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: z_,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: lE
      });
    }
    var YR = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function fE(e) {
      this._internalRoot = e;
    }
    $m.prototype.render = fE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Qm(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Mn) {
          var i = wR(t.current);
          i && i.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Kp(e, t, null, null);
    }, $m.prototype.unmount = fE.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        nR() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          Kp(null, e, null, null);
        }), YE(t);
      }
    };
    function A_(e, t) {
      if (!Qm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      $R(e);
      var a = !1, i = !1, u = "", s = YR;
      t != null && (t.hydrate ? gt("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === kr && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = TR(e, Ph, null, a, i, u, s);
      Nh(f.current, e);
      var p = e.nodeType === Mn ? e.parentNode : e;
      return np(p), new fE(f);
    }
    function $m(e) {
      this._internalRoot = e;
    }
    function j_(e) {
      e && th(e);
    }
    $m.prototype.unstable_scheduleHydration = j_;
    function F_(e, t, a) {
      if (!Qm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      $R(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = YR;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = xR(t, null, e, Ph, i, s, f, p, v);
      if (Nh(y.current, e), np(e), u)
        for (var g = 0; g < u.length; g++) {
          var w = u[g];
          Bb(y, w);
        }
      return new $m(y);
    }
    function Qm(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === ad));
    }
    function Xp(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === ad || e.nodeType === Mn && e.nodeValue === " react-mount-point-unstable "));
    }
    function $R(e) {
      e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), pp(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var H_ = N.ReactCurrentOwner, QR;
    QR = function(e) {
      if (e._reactRootContainer && e.nodeType !== Mn) {
        var t = wR(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = dE(e), u = !!(i && Do(i));
      u && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function dE(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function WR() {
    }
    function P_(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var x = Ym(f);
            s.call(x);
          };
        }
        var f = xR(
          t,
          i,
          e,
          Lo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          WR
        );
        e._reactRootContainer = f, Nh(f.current, e);
        var p = e.nodeType === Mn ? e.parentNode : e;
        return np(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var x = Ym(g);
            y.call(x);
          };
        }
        var g = TR(
          e,
          Lo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          WR
        );
        e._reactRootContainer = g, Nh(g.current, e);
        var w = e.nodeType === Mn ? e.parentNode : e;
        return np(w), Yu(function() {
          Kp(t, g, a, i);
        }), g;
      }
    }
    function V_(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Wm(e, t, a, i, u) {
      QR(a), V_(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = P_(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Ym(f);
            p.call(v);
          };
        }
        Kp(t, f, e, u);
      }
      return Ym(f);
    }
    var GR = !1;
    function B_(e) {
      {
        GR || (GR = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = H_.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", _t(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Wr ? e : w_(e, "findDOMNode");
    }
    function I_(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = pp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Wm(null, e, t, !0, a);
    }
    function Y_(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = pp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Wm(null, e, t, !1, a);
    }
    function $_(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !sy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Wm(e, t, a, !1, i);
    }
    var qR = !1;
    function Q_(e) {
      if (qR || (qR = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Xp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = pp(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = dE(e), i = a && !Do(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          Wm(null, null, e, !1, function() {
            e._reactRootContainer = null, YE(e);
          });
        }), !0;
      } else {
        {
          var u = dE(e), s = !!(u && Do(u)), f = e.nodeType === Wr && Xp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Tr(__), Eo(k_), Xv(D_), Os(Aa), Hd(Gv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Sc(GT), oy(IS, F1, Yu);
    function W_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Qm(t))
        throw new Error("Target container is not a DOM element.");
      return b_(e, t, null, a);
    }
    function G_(e, t, a, i) {
      return $_(e, t, a, i);
    }
    var pE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Do, Rf, zh, oo, Ec, IS]
    };
    function q_(e, t) {
      return pE.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), A_(e, t);
    }
    function K_(e, t, a) {
      return pE.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), F_(e, t, a);
    }
    function X_(e) {
      return nR() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var J_ = U_({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: lE,
      rendererPackageName: "react-dom"
    });
    if (!J_ && On && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var KR = window.location.protocol;
      /^(https?|file):$/.test(KR) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (KR === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = pE, Ya.createPortal = W_, Ya.createRoot = q_, Ya.findDOMNode = B_, Ya.flushSync = X_, Ya.hydrate = I_, Ya.hydrateRoot = K_, Ya.render = Y_, Ya.unmountComponentAtNode = Q_, Ya.unstable_batchedUpdates = IS, Ya.unstable_renderSubtreeIntoContainer = G_, Ya.version = lE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  })()), Ya;
}
var oT;
function ck() {
  if (oT) return Km.exports;
  oT = 1;
  function Q() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Q);
      } catch (I) {
        console.error(I);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (Q(), Km.exports = ok()) : Km.exports = sk(), Km.exports;
}
var sT;
function fk() {
  if (sT) return Wf;
  sT = 1;
  var Q = ck();
  if (process.env.NODE_ENV === "production")
    Wf.createRoot = Q.createRoot, Wf.hydrateRoot = Q.hydrateRoot;
  else {
    var I = Q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    Wf.createRoot = function(N, wt) {
      I.usingClientEntryPoint = !0;
      try {
        return Q.createRoot(N, wt);
      } finally {
        I.usingClientEntryPoint = !1;
      }
    }, Wf.hydrateRoot = function(N, wt, tt) {
      I.usingClientEntryPoint = !0;
      try {
        return Q.hydrateRoot(N, wt, tt);
      } finally {
        I.usingClientEntryPoint = !1;
      }
    };
  }
  return Wf;
}
var dT = fk(), br = nv();
let mE = null;
function dk(Q) {
  mE = Q;
}
function lc(Q, I = {}) {
  if (!mE) throw new Error("Companion host is not configured");
  return mE.moduleCall(`clx.ai-companion.${Q}`, I);
}
const pk = () => lc("getConfig"), cT = (Q) => lc("saveConfig", Q), vk = () => lc("getHistory"), hk = () => lc("clearHistory"), mk = (Q, I = !0) => lc("send", { message: Q, toolsEnabled: I }), yk = (Q) => lc("cancel", { runId: Q }), gk = () => lc("pollEvents");
function pT() {
  const [Q, I] = br.useState([]), [N, wt] = br.useState(""), [tt, gt] = br.useState(!1), [S, Dt] = br.useState(null), [ce, pe] = br.useState(null), [Pe, Z] = br.useState(!1), [ye, re] = br.useState(!1), Fe = br.useRef(null), nt = br.useRef(null);
  br.useEffect(() => {
    (async () => {
      try {
        const ee = await pk();
        pe(ee), Z(ee.actionsEnabled);
      } catch {
      }
      try {
        const ee = await vk();
        I(ee.map((Ae) => ({
          role: Ae.role,
          content: Ae.content,
          timestamp: Ae.timestamp,
          runId: Ae.runId
        })));
      } catch {
      }
    })();
  }, []), br.useEffect(() => {
    if (!tt) return;
    const ee = setInterval(async () => {
      try {
        const Ae = await gk();
        for (const ge of Ae) {
          const Ot = ge.run_id, St = ge.type;
          if (St === "assistant_delta") {
            const st = ge.delta || "";
            I((ht) => {
              const Ge = ht[ht.length - 1];
              if ((Ge == null ? void 0 : Ge.role) === "assistant" && Ge.runId === Ot && Ge.content.endsWith("▌")) {
                const _e = [...ht];
                return _e[_e.length - 1] = {
                  ...Ge,
                  content: Ge.content.slice(0, -1) + st + "▌"
                }, _e;
              }
              return [...ht, {
                role: "assistant",
                content: st + "▌",
                timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
                runId: Ot
              }];
            });
          } else if (St === "done")
            I((st) => {
              const ht = st[st.length - 1];
              if ((ht == null ? void 0 : ht.role) === "assistant" && ht.content.endsWith("▌")) {
                const Ge = [...st];
                return Ge[Ge.length - 1] = { ...ht, content: ht.content.slice(0, -1) }, Ge;
              }
              return st;
            }), gt(!1), Dt(null);
          else if (St === "tool_started")
            I((st) => [...st, {
              role: "assistant",
              content: `🔧 Running: ${ge.tool_name}...`,
              timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
              runId: Ot
            }]);
          else if (St === "tool_result") {
            const st = ge.verified ? "✓" : "✗";
            I((ht) => [...ht, {
              role: "assistant",
              content: `${st} ${ge.tool_name}: ${(ge.result || "").slice(0, 200)}`,
              timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
              runId: Ot
            }]);
          } else (St === "error" || St === "warning") && (I((st) => [...st, {
            role: "assistant",
            content: `⚠ ${ge.message}`,
            timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
            runId: Ot
          }]), St === "error" && (gt(!1), Dt(null)));
        }
      } catch {
      }
    }, 100);
    return () => clearInterval(ee);
  }, [tt]), br.useEffect(() => {
    Fe.current && (Fe.current.scrollTop = Fe.current.scrollHeight);
  }, [Q]), br.useEffect(() => {
    nt.current && (nt.current.style.height = "auto", nt.current.style.height = Math.min(nt.current.scrollHeight, 112) + "px");
  }, [N]);
  const rt = br.useCallback(async (ee) => {
    if (ee == null || ee.preventDefault(), !N.trim() || tt) return;
    const Ae = N.trim();
    wt(""), I((ge) => [...ge, {
      role: "user",
      content: Ae,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    }]);
    try {
      gt(!0);
      const { runId: ge } = await mk(Ae, Pe);
      Dt(ge);
    } catch (ge) {
      I((Ot) => [...Ot, {
        role: "assistant",
        content: `Error: ${ge}`,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      }]), gt(!1);
    }
  }, [N, tt, Pe]), tn = br.useCallback(async () => {
    if (S) {
      try {
        await yk(S);
      } catch {
      }
      gt(!1), Dt(null);
    }
  }, [S]), ot = br.useCallback(async () => {
    try {
      await hk(), I([]);
    } catch {
    }
  }, []), Ye = br.useCallback(async () => {
    if (!Pe && !ye) {
      re(!0);
      return;
    }
    const ee = !Pe;
    try {
      await cT({ actionsEnabled: ee }), Z(ee), re(!1);
    } catch {
    }
  }, [Pe, ye]), vt = br.useCallback((ee) => {
    ee.key === "Enter" && !ee.shiftKey && (ee.preventDefault(), rt());
  }, [rt]);
  return /* @__PURE__ */ $t.jsxs("div", { className: "flex h-full flex-col overflow-hidden bg-cyber-base text-slate-100", children: [
    /* @__PURE__ */ $t.jsxs("div", { className: "flex shrink-0 items-center justify-between border-b border-cyber-line p-3 bg-cyber-base/20", children: [
      /* @__PURE__ */ $t.jsxs("div", { children: [
        /* @__PURE__ */ $t.jsx("h2", { className: "font-display text-xs uppercase tracking-[0.2em] text-cyber-neon font-bold", children: "AI Companion" }),
        /* @__PURE__ */ $t.jsxs("div", { className: "flex gap-2 mt-0.5", children: [
          ce && /* @__PURE__ */ $t.jsx("span", { className: "text-[10px] text-slate-400", children: ce.model }),
          /* @__PURE__ */ $t.jsx("span", { className: `text-[10px] font-semibold ${Pe ? "text-cyber-neon" : "text-slate-500"}`, children: Pe ? "Tools enabled" : "Q&A only" })
        ] })
      ] }),
      /* @__PURE__ */ $t.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ $t.jsxs(
          "button",
          {
            type: "button",
            onClick: Ye,
            className: `rounded border px-1.5 py-0.5 text-[9px] font-semibold transition ${Pe ? "border-cyber-neon/40 text-cyber-neon hover:bg-cyber-neon/10" : "border-slate-500/40 text-slate-500 hover:bg-slate-500/10"}`,
            children: [
              Pe ? "Disable" : "Enable",
              " Tools"
            ]
          }
        ),
        Q.length > 0 && /* @__PURE__ */ $t.jsx(
          "button",
          {
            type: "button",
            onClick: ot,
            className: "rounded border border-cyber-warn/40 px-1.5 py-0.5 text-[9px] font-semibold text-cyber-warn hover:bg-cyber-warn/10",
            children: "Clear"
          }
        )
      ] })
    ] }),
    ye && /* @__PURE__ */ $t.jsxs("div", { className: "shrink-0 mx-3 mt-2 p-3 rounded-lg border border-cyber-neon/40 bg-cyber-neon/5", children: [
      /* @__PURE__ */ $t.jsx("p", { className: "text-[12px] text-slate-200 font-semibold mb-1", children: "Enable App Actions?" }),
      /* @__PURE__ */ $t.jsx("p", { className: "text-[11px] text-slate-400 leading-relaxed mb-2", children: "App Actions let the AI navigate views, check status, and manage configurations on your behalf." }),
      /* @__PURE__ */ $t.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ $t.jsx("button", { onClick: () => {
          cT({ actionsEnabled: !0 }), Z(!0), re(!1);
        }, className: "rounded bg-cyber-neon/20 border border-cyber-neon px-2.5 py-1 text-[11px] font-semibold text-cyber-neon hover:bg-cyber-neon/30", children: "Enable" }),
        /* @__PURE__ */ $t.jsx("button", { onClick: () => re(!1), className: "rounded border border-slate-500/40 px-2.5 py-1 text-[11px] text-slate-400 hover:bg-slate-500/10", children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ $t.jsx("div", { ref: Fe, className: "flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin", children: Q.length === 0 ? /* @__PURE__ */ $t.jsxs("div", { className: "flex h-full flex-col items-center justify-center text-center text-slate-500 py-8", children: [
      /* @__PURE__ */ $t.jsx("p", { className: "text-[13px] italic", children: "No messages yet." }),
      /* @__PURE__ */ $t.jsx("p", { className: "mt-1 text-[12px] text-slate-600", children: "Ask about features, start sessions, or manage configs." })
    ] }) : Q.map((ee, Ae) => /* @__PURE__ */ $t.jsxs(
      "div",
      {
        className: `flex flex-col max-w-[95%] rounded-lg px-3 py-2 leading-normal ${ee.role === "user" ? "bg-cyber-neon/10 border border-cyber-neon/30 text-slate-100 self-end ml-auto" : "bg-cyber-electric/10 border border-cyber-electric/30 text-slate-200 self-start mr-auto"}`,
        children: [
          /* @__PURE__ */ $t.jsxs("span", { className: `text-[11px] font-bold uppercase tracking-wider mb-1 ${ee.role === "user" ? "text-cyber-neon" : "text-cyber-electric"}`, children: [
            ee.role === "user" ? "You" : "Companion",
            /* @__PURE__ */ $t.jsx("span", { className: "ml-2 font-normal opacity-50", children: ee.timestamp })
          ] }),
          /* @__PURE__ */ $t.jsx("p", { className: "whitespace-pre-wrap break-words text-[15px] leading-relaxed", children: ee.content })
        ]
      },
      Ae
    )) }),
    /* @__PURE__ */ $t.jsx("form", { onSubmit: rt, className: "shrink-0 border-t border-cyber-line p-3", children: /* @__PURE__ */ $t.jsxs("div", { className: "flex gap-2 items-end", children: [
      /* @__PURE__ */ $t.jsx(
        "textarea",
        {
          ref: nt,
          placeholder: "Type a message...",
          value: N,
          disabled: tt,
          rows: 1,
          onChange: (ee) => wt(ee.target.value),
          onKeyDown: vt,
          className: "flex-1 min-w-0 rounded border border-cyber-line bg-cyber-base px-2 py-1.5 text-slate-100 placeholder-slate-500 outline-none focus:border-cyber-neon text-[13px] disabled:opacity-50 resize-none overflow-y-auto",
          style: { maxHeight: "7rem" }
        }
      ),
      tt ? /* @__PURE__ */ $t.jsx(
        "button",
        {
          type: "button",
          onClick: tn,
          className: "shrink-0 rounded border border-cyber-warn bg-cyber-warn/15 px-3 py-1.5 font-bold uppercase text-[11px] text-cyber-warn hover:bg-cyber-warn/25 transition",
          children: "Cancel"
        }
      ) : /* @__PURE__ */ $t.jsx(
        "button",
        {
          type: "submit",
          disabled: !N.trim(),
          className: "shrink-0 rounded border border-cyber-neon bg-cyber-neon/15 px-3 py-1.5 font-bold uppercase text-[11px] text-cyber-neon hover:bg-cyber-neon/25 transition disabled:opacity-30",
          children: "Send"
        }
      )
    ] }) })
  ] });
}
function vT(Q) {
  if (Q.apiVersion !== 1 || Q.moduleId !== "clx.ai-companion")
    throw new Error("AI Companion requires CLX UI host API v1");
  dk(Q);
}
function Rk(Q) {
  vT(Q), Q.registerContribution({
    id: "ai-companion.main",
    kind: "mainPanel",
    mount(I) {
      const N = dT.createRoot(I);
      return N.render(/* @__PURE__ */ $t.jsx(pT, {})), () => N.unmount();
    }
  });
}
function Tk(Q) {
  vT(Q), Q.registerContribution({
    id: "ai-companion.settings",
    kind: "settingsSection",
    mount(I) {
      const N = dT.createRoot(I);
      return N.render(/* @__PURE__ */ $t.jsx(pT, {})), () => N.unmount();
    }
  });
}
export {
  Rk as registerMain,
  Tk as registerSettings
};
