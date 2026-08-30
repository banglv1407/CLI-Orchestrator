var Gm = { exports: {} }, Kp = {}, qm = { exports: {} }, yt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var KR;
function K_() {
  if (KR) return yt;
  KR = 1;
  var B = Symbol.for("react.element"), G = Symbol.for("react.portal"), M = Symbol.for("react.fragment"), gt = Symbol.for("react.strict_mode"), ft = Symbol.for("react.profiler"), dt = Symbol.for("react.provider"), S = Symbol.for("react.context"), mt = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), de = Symbol.for("react.memo"), Ee = Symbol.for("react.lazy"), Z = Symbol.iterator;
  function Re(_) {
    return _ === null || typeof _ != "object" ? null : (_ = Z && _[Z] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var ue = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, $e = Object.assign, St = {};
  function pt(_, P, He) {
    this.props = _, this.context = P, this.refs = St, this.updater = He || ue;
  }
  pt.prototype.isReactComponent = {}, pt.prototype.setState = function(_, P) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, _, P, "setState");
  }, pt.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function fn() {
  }
  fn.prototype = pt.prototype;
  function ct(_, P, He) {
    this.props = _, this.context = P, this.refs = St, this.updater = He || ue;
  }
  var Qe = ct.prototype = new fn();
  Qe.constructor = ct, $e(Qe, pt.prototype), Qe.isPureReactComponent = !0;
  var vt = Array.isArray, _e = Object.prototype.hasOwnProperty, ut = { current: null }, Fe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function an(_, P, He) {
    var Ae, rt = {}, Ze = null, Ke = null;
    if (P != null) for (Ae in P.ref !== void 0 && (Ke = P.ref), P.key !== void 0 && (Ze = "" + P.key), P) _e.call(P, Ae) && !Fe.hasOwnProperty(Ae) && (rt[Ae] = P[Ae]);
    var et = arguments.length - 2;
    if (et === 1) rt.children = He;
    else if (1 < et) {
      for (var at = Array(et), Bt = 0; Bt < et; Bt++) at[Bt] = arguments[Bt + 2];
      rt.children = at;
    }
    if (_ && _.defaultProps) for (Ae in et = _.defaultProps, et) rt[Ae] === void 0 && (rt[Ae] = et[Ae]);
    return { $$typeof: B, type: _, key: Ze, ref: Ke, props: rt, _owner: ut.current };
  }
  function Ft(_, P) {
    return { $$typeof: B, type: _.type, key: P, ref: _.ref, props: _.props, _owner: _._owner };
  }
  function Jt(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === B;
  }
  function ln(_) {
    var P = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function(He) {
      return P[He];
    });
  }
  var wt = /\/+/g;
  function Oe(_, P) {
    return typeof _ == "object" && _ !== null && _.key != null ? ln("" + _.key) : P.toString(36);
  }
  function At(_, P, He, Ae, rt) {
    var Ze = typeof _;
    (Ze === "undefined" || Ze === "boolean") && (_ = null);
    var Ke = !1;
    if (_ === null) Ke = !0;
    else switch (Ze) {
      case "string":
      case "number":
        Ke = !0;
        break;
      case "object":
        switch (_.$$typeof) {
          case B:
          case G:
            Ke = !0;
        }
    }
    if (Ke) return Ke = _, rt = rt(Ke), _ = Ae === "" ? "." + Oe(Ke, 0) : Ae, vt(rt) ? (He = "", _ != null && (He = _.replace(wt, "$&/") + "/"), At(rt, P, He, "", function(Bt) {
      return Bt;
    })) : rt != null && (Jt(rt) && (rt = Ft(rt, He + (!rt.key || Ke && Ke.key === rt.key ? "" : ("" + rt.key).replace(wt, "$&/") + "/") + _)), P.push(rt)), 1;
    if (Ke = 0, Ae = Ae === "" ? "." : Ae + ":", vt(_)) for (var et = 0; et < _.length; et++) {
      Ze = _[et];
      var at = Ae + Oe(Ze, et);
      Ke += At(Ze, P, He, at, rt);
    }
    else if (at = Re(_), typeof at == "function") for (_ = at.call(_), et = 0; !(Ze = _.next()).done; ) Ze = Ze.value, at = Ae + Oe(Ze, et++), Ke += At(Ze, P, He, at, rt);
    else if (Ze === "object") throw P = String(_), Error("Objects are not valid as a React child (found: " + (P === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : P) + "). If you meant to render a collection of children, use an array instead.");
    return Ke;
  }
  function _t(_, P, He) {
    if (_ == null) return _;
    var Ae = [], rt = 0;
    return At(_, Ae, "", "", function(Ze) {
      return P.call(He, Ze, rt++);
    }), Ae;
  }
  function Dt(_) {
    if (_._status === -1) {
      var P = _._result;
      P = P(), P.then(function(He) {
        (_._status === 0 || _._status === -1) && (_._status = 1, _._result = He);
      }, function(He) {
        (_._status === 0 || _._status === -1) && (_._status = 2, _._result = He);
      }), _._status === -1 && (_._status = 0, _._result = P);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var Ce = { current: null }, J = { transition: null }, Te = { ReactCurrentDispatcher: Ce, ReactCurrentBatchConfig: J, ReactCurrentOwner: ut };
  function ne() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return yt.Children = { map: _t, forEach: function(_, P, He) {
    _t(_, function() {
      P.apply(this, arguments);
    }, He);
  }, count: function(_) {
    var P = 0;
    return _t(_, function() {
      P++;
    }), P;
  }, toArray: function(_) {
    return _t(_, function(P) {
      return P;
    }) || [];
  }, only: function(_) {
    if (!Jt(_)) throw Error("React.Children.only expected to receive a single React element child.");
    return _;
  } }, yt.Component = pt, yt.Fragment = M, yt.Profiler = ft, yt.PureComponent = ct, yt.StrictMode = gt, yt.Suspense = se, yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Te, yt.act = ne, yt.cloneElement = function(_, P, He) {
    if (_ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + _ + ".");
    var Ae = $e({}, _.props), rt = _.key, Ze = _.ref, Ke = _._owner;
    if (P != null) {
      if (P.ref !== void 0 && (Ze = P.ref, Ke = ut.current), P.key !== void 0 && (rt = "" + P.key), _.type && _.type.defaultProps) var et = _.type.defaultProps;
      for (at in P) _e.call(P, at) && !Fe.hasOwnProperty(at) && (Ae[at] = P[at] === void 0 && et !== void 0 ? et[at] : P[at]);
    }
    var at = arguments.length - 2;
    if (at === 1) Ae.children = He;
    else if (1 < at) {
      et = Array(at);
      for (var Bt = 0; Bt < at; Bt++) et[Bt] = arguments[Bt + 2];
      Ae.children = et;
    }
    return { $$typeof: B, type: _.type, key: rt, ref: Ze, props: Ae, _owner: Ke };
  }, yt.createContext = function(_) {
    return _ = { $$typeof: S, _currentValue: _, _currentValue2: _, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, _.Provider = { $$typeof: dt, _context: _ }, _.Consumer = _;
  }, yt.createElement = an, yt.createFactory = function(_) {
    var P = an.bind(null, _);
    return P.type = _, P;
  }, yt.createRef = function() {
    return { current: null };
  }, yt.forwardRef = function(_) {
    return { $$typeof: mt, render: _ };
  }, yt.isValidElement = Jt, yt.lazy = function(_) {
    return { $$typeof: Ee, _payload: { _status: -1, _result: _ }, _init: Dt };
  }, yt.memo = function(_, P) {
    return { $$typeof: de, type: _, compare: P === void 0 ? null : P };
  }, yt.startTransition = function(_) {
    var P = J.transition;
    J.transition = {};
    try {
      _();
    } finally {
      J.transition = P;
    }
  }, yt.unstable_act = ne, yt.useCallback = function(_, P) {
    return Ce.current.useCallback(_, P);
  }, yt.useContext = function(_) {
    return Ce.current.useContext(_);
  }, yt.useDebugValue = function() {
  }, yt.useDeferredValue = function(_) {
    return Ce.current.useDeferredValue(_);
  }, yt.useEffect = function(_, P) {
    return Ce.current.useEffect(_, P);
  }, yt.useId = function() {
    return Ce.current.useId();
  }, yt.useImperativeHandle = function(_, P, He) {
    return Ce.current.useImperativeHandle(_, P, He);
  }, yt.useInsertionEffect = function(_, P) {
    return Ce.current.useInsertionEffect(_, P);
  }, yt.useLayoutEffect = function(_, P) {
    return Ce.current.useLayoutEffect(_, P);
  }, yt.useMemo = function(_, P) {
    return Ce.current.useMemo(_, P);
  }, yt.useReducer = function(_, P, He) {
    return Ce.current.useReducer(_, P, He);
  }, yt.useRef = function(_) {
    return Ce.current.useRef(_);
  }, yt.useState = function(_) {
    return Ce.current.useState(_);
  }, yt.useSyncExternalStore = function(_, P, He) {
    return Ce.current.useSyncExternalStore(_, P, He);
  }, yt.useTransition = function() {
    return Ce.current.useTransition();
  }, yt.version = "18.3.1", yt;
}
var ev = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
ev.exports;
var JR;
function J_() {
  return JR || (JR = 1, (function(B, G) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var M = "18.3.1", gt = Symbol.for("react.element"), ft = Symbol.for("react.portal"), dt = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), mt = Symbol.for("react.profiler"), se = Symbol.for("react.provider"), de = Symbol.for("react.context"), Ee = Symbol.for("react.forward_ref"), Z = Symbol.for("react.suspense"), Re = Symbol.for("react.suspense_list"), ue = Symbol.for("react.memo"), $e = Symbol.for("react.lazy"), St = Symbol.for("react.offscreen"), pt = Symbol.iterator, fn = "@@iterator";
      function ct(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = pt && h[pt] || h[fn];
        return typeof C == "function" ? C : null;
      }
      var Qe = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, vt = {
        transition: null
      }, _e = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, ut = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Fe = {}, an = null;
      function Ft(h) {
        an = h;
      }
      Fe.setExtraStackFrame = function(h) {
        an = h;
      }, Fe.getCurrentStack = null, Fe.getStackAddendum = function() {
        var h = "";
        an && (h += an);
        var C = Fe.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var Jt = !1, ln = !1, wt = !1, Oe = !1, At = !1, _t = {
        ReactCurrentDispatcher: Qe,
        ReactCurrentBatchConfig: vt,
        ReactCurrentOwner: ut
      };
      _t.ReactDebugCurrentFrame = Fe, _t.ReactCurrentActQueue = _e;
      function Dt(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), j = 1; j < C; j++)
            z[j - 1] = arguments[j];
          J("warn", h, z);
        }
      }
      function Ce(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), j = 1; j < C; j++)
            z[j - 1] = arguments[j];
          J("error", h, z);
        }
      }
      function J(h, C, z) {
        {
          var j = _t.ReactDebugCurrentFrame, K = j.getStackAddendum();
          K !== "" && (C += "%s", z = z.concat([K]));
          var Le = z.map(function(re) {
            return String(re);
          });
          Le.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Le);
        }
      }
      var Te = {};
      function ne(h, C) {
        {
          var z = h.constructor, j = z && (z.displayName || z.name) || "ReactClass", K = j + "." + C;
          if (Te[K])
            return;
          Ce("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, j), Te[K] = !0;
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
          ne(h, "forceUpdate");
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
          ne(h, "replaceState");
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
          ne(h, "setState");
        }
      }, P = Object.assign, He = {};
      Object.freeze(He);
      function Ae(h, C, z) {
        this.props = h, this.context = C, this.refs = He, this.updater = z || _;
      }
      Ae.prototype.isReactComponent = {}, Ae.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, Ae.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var rt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, Ze = function(h, C) {
          Object.defineProperty(Ae.prototype, h, {
            get: function() {
              Dt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var Ke in rt)
          rt.hasOwnProperty(Ke) && Ze(Ke, rt[Ke]);
      }
      function et() {
      }
      et.prototype = Ae.prototype;
      function at(h, C, z) {
        this.props = h, this.context = C, this.refs = He, this.updater = z || _;
      }
      var Bt = at.prototype = new et();
      Bt.constructor = at, P(Bt, Ae.prototype), Bt.isPureReactComponent = !0;
      function On() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var br = Array.isArray;
      function Cn(h) {
        return br(h);
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
      function Ir(h) {
        if (Vn(h))
          return Ce("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", nr(h)), Bn(h);
      }
      function si(h, C, z) {
        var j = h.displayName;
        if (j)
          return j;
        var K = C.displayName || C.name || "";
        return K !== "" ? z + "(" + K + ")" : z;
      }
      function oa(h) {
        return h.displayName || "Context";
      }
      function qn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Ce("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case dt:
            return "Fragment";
          case ft:
            return "Portal";
          case mt:
            return "Profiler";
          case S:
            return "StrictMode";
          case Z:
            return "Suspense";
          case Re:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case de:
              var C = h;
              return oa(C) + ".Consumer";
            case se:
              var z = h;
              return oa(z._context) + ".Provider";
            case Ee:
              return si(h, h.render, "ForwardRef");
            case ue:
              var j = h.displayName || null;
              return j !== null ? j : qn(h.type) || "Memo";
            case $e: {
              var K = h, Le = K._payload, re = K._init;
              try {
                return qn(re(Le));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Rn = Object.prototype.hasOwnProperty, Yn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, gr, Ia, Ln;
      Ln = {};
      function Sr(h) {
        if (Rn.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function sa(h) {
        if (Rn.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function $a(h, C) {
        var z = function() {
          gr || (gr = !0, Ce("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: z,
          configurable: !0
        });
      }
      function ci(h, C) {
        var z = function() {
          Ia || (Ia = !0, Ce("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: z,
          configurable: !0
        });
      }
      function ee(h) {
        if (typeof h.ref == "string" && ut.current && h.__self && ut.current.stateNode !== h.__self) {
          var C = qn(ut.current.type);
          Ln[C] || (Ce('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Ln[C] = !0);
        }
      }
      var xe = function(h, C, z, j, K, Le, re) {
        var ze = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: gt,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: z,
          props: re,
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
          value: K
        }), Object.freeze && (Object.freeze(ze.props), Object.freeze(ze)), ze;
      };
      function tt(h, C, z) {
        var j, K = {}, Le = null, re = null, ze = null, st = null;
        if (C != null) {
          Sr(C) && (re = C.ref, ee(C)), sa(C) && (Ir(C.key), Le = "" + C.key), ze = C.__self === void 0 ? null : C.__self, st = C.__source === void 0 ? null : C.__source;
          for (j in C)
            Rn.call(C, j) && !Yn.hasOwnProperty(j) && (K[j] = C[j]);
        }
        var bt = arguments.length - 2;
        if (bt === 1)
          K.children = z;
        else if (bt > 1) {
          for (var nn = Array(bt), Qt = 0; Qt < bt; Qt++)
            nn[Qt] = arguments[Qt + 2];
          Object.freeze && Object.freeze(nn), K.children = nn;
        }
        if (h && h.defaultProps) {
          var nt = h.defaultProps;
          for (j in nt)
            K[j] === void 0 && (K[j] = nt[j]);
        }
        if (Le || re) {
          var Wt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Le && $a(K, Wt), re && ci(K, Wt);
        }
        return xe(h, Le, re, ze, st, ut.current, K);
      }
      function jt(h, C) {
        var z = xe(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return z;
      }
      function Zt(h, C, z) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var j, K = P({}, h.props), Le = h.key, re = h.ref, ze = h._self, st = h._source, bt = h._owner;
        if (C != null) {
          Sr(C) && (re = C.ref, bt = ut.current), sa(C) && (Ir(C.key), Le = "" + C.key);
          var nn;
          h.type && h.type.defaultProps && (nn = h.type.defaultProps);
          for (j in C)
            Rn.call(C, j) && !Yn.hasOwnProperty(j) && (C[j] === void 0 && nn !== void 0 ? K[j] = nn[j] : K[j] = C[j]);
        }
        var Qt = arguments.length - 2;
        if (Qt === 1)
          K.children = z;
        else if (Qt > 1) {
          for (var nt = Array(Qt), Wt = 0; Wt < Qt; Wt++)
            nt[Wt] = arguments[Wt + 2];
          K.children = nt;
        }
        return xe(h.type, Le, re, ze, st, bt, K);
      }
      function vn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === gt;
      }
      var un = ".", Xn = ":";
      function en(h) {
        var C = /[=:]/g, z = {
          "=": "=0",
          ":": "=2"
        }, j = h.replace(C, function(K) {
          return z[K];
        });
        return "$" + j;
      }
      var Yt = !1, It = /\/+/g;
      function ca(h) {
        return h.replace(It, "$&/");
      }
      function Er(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? (Ir(h.key), en("" + h.key)) : C.toString(36);
      }
      function Ta(h, C, z, j, K) {
        var Le = typeof h;
        (Le === "undefined" || Le === "boolean") && (h = null);
        var re = !1;
        if (h === null)
          re = !0;
        else
          switch (Le) {
            case "string":
            case "number":
              re = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case gt:
                case ft:
                  re = !0;
              }
          }
        if (re) {
          var ze = h, st = K(ze), bt = j === "" ? un + Er(ze, 0) : j;
          if (Cn(st)) {
            var nn = "";
            bt != null && (nn = ca(bt) + "/"), Ta(st, C, nn, "", function(qf) {
              return qf;
            });
          } else st != null && (vn(st) && (st.key && (!ze || ze.key !== st.key) && Ir(st.key), st = jt(
            st,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            z + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (st.key && (!ze || ze.key !== st.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              ca("" + st.key) + "/"
            ) : "") + bt
          )), C.push(st));
          return 1;
        }
        var Qt, nt, Wt = 0, hn = j === "" ? un : j + Xn;
        if (Cn(h))
          for (var Cl = 0; Cl < h.length; Cl++)
            Qt = h[Cl], nt = hn + Er(Qt, Cl), Wt += Ta(Qt, C, z, nt, K);
        else {
          var Go = ct(h);
          if (typeof Go == "function") {
            var Vi = h;
            Go === Vi.entries && (Yt || Dt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Yt = !0);
            for (var qo = Go.call(Vi), uu, Gf = 0; !(uu = qo.next()).done; )
              Qt = uu.value, nt = hn + Er(Qt, Gf++), Wt += Ta(Qt, C, z, nt, K);
          } else if (Le === "object") {
            var uc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (uc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : uc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Wt;
      }
      function Fi(h, C, z) {
        if (h == null)
          return h;
        var j = [], K = 0;
        return Ta(h, j, "", "", function(Le) {
          return C.call(z, Le, K++);
        }), j;
      }
      function Jl(h) {
        var C = 0;
        return Fi(h, function() {
          C++;
        }), C;
      }
      function Zl(h, C, z) {
        Fi(h, function() {
          C.apply(this, arguments);
        }, z);
      }
      function dl(h) {
        return Fi(h, function(C) {
          return C;
        }) || [];
      }
      function pl(h) {
        if (!vn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function eu(h) {
        var C = {
          $$typeof: de,
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
          $$typeof: se,
          _context: C
        };
        var z = !1, j = !1, K = !1;
        {
          var Le = {
            $$typeof: de,
            _context: C
          };
          Object.defineProperties(Le, {
            Provider: {
              get: function() {
                return j || (j = !0, Ce("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(re) {
                C.Provider = re;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(re) {
                C._currentValue = re;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(re) {
                C._currentValue2 = re;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(re) {
                C._threadCount = re;
              }
            },
            Consumer: {
              get: function() {
                return z || (z = !0, Ce("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(re) {
                K || (Dt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", re), K = !0);
              }
            }
          }), C.Consumer = Le;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var wr = -1, _r = 0, rr = 1, fi = 2;
      function Qa(h) {
        if (h._status === wr) {
          var C = h._result, z = C();
          if (z.then(function(Le) {
            if (h._status === _r || h._status === wr) {
              var re = h;
              re._status = rr, re._result = Le;
            }
          }, function(Le) {
            if (h._status === _r || h._status === wr) {
              var re = h;
              re._status = fi, re._result = Le;
            }
          }), h._status === wr) {
            var j = h;
            j._status = _r, j._result = z;
          }
        }
        if (h._status === rr) {
          var K = h._result;
          return K === void 0 && Ce(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, K), "default" in K || Ce(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, K), K.default;
        } else
          throw h._result;
      }
      function di(h) {
        var C = {
          // We use these fields to store the result.
          _status: wr,
          _result: h
        }, z = {
          $$typeof: $e,
          _payload: C,
          _init: Qa
        };
        {
          var j, K;
          Object.defineProperties(z, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return j;
              },
              set: function(Le) {
                Ce("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), j = Le, Object.defineProperty(z, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return K;
              },
              set: function(Le) {
                Ce("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), K = Le, Object.defineProperty(z, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return z;
      }
      function pi(h) {
        h != null && h.$$typeof === ue ? Ce("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Ce("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Ce("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Ce("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: Ee,
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
      function Y(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === dt || h === mt || At || h === S || h === Z || h === Re || Oe || h === St || Jt || ln || wt || typeof h == "object" && h !== null && (h.$$typeof === $e || h.$$typeof === ue || h.$$typeof === se || h.$$typeof === de || h.$$typeof === Ee || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function ae(h, C) {
        Y(h) || Ce("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var z = {
          $$typeof: ue,
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
            set: function(K) {
              j = K, !h.name && !h.displayName && (h.displayName = K);
            }
          });
        }
        return z;
      }
      function he() {
        var h = Qe.current;
        return h === null && Ce(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function Ge(h) {
        var C = he();
        if (h._context !== void 0) {
          var z = h._context;
          z.Consumer === h ? Ce("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : z.Provider === h && Ce("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function Ye(h) {
        var C = he();
        return C.useState(h);
      }
      function ot(h, C, z) {
        var j = he();
        return j.useReducer(h, C, z);
      }
      function it(h) {
        var C = he();
        return C.useRef(h);
      }
      function Tn(h, C) {
        var z = he();
        return z.useEffect(h, C);
      }
      function tn(h, C) {
        var z = he();
        return z.useInsertionEffect(h, C);
      }
      function on(h, C) {
        var z = he();
        return z.useLayoutEffect(h, C);
      }
      function ar(h, C) {
        var z = he();
        return z.useCallback(h, C);
      }
      function Wa(h, C) {
        var z = he();
        return z.useMemo(h, C);
      }
      function Ga(h, C, z) {
        var j = he();
        return j.useImperativeHandle(h, C, z);
      }
      function qe(h, C) {
        {
          var z = he();
          return z.useDebugValue(h, C);
        }
      }
      function Je() {
        var h = he();
        return h.useTransition();
      }
      function qa(h) {
        var C = he();
        return C.useDeferredValue(h);
      }
      function tu() {
        var h = he();
        return h.useId();
      }
      function nu(h, C, z) {
        var j = he();
        return j.useSyncExternalStore(h, C, z);
      }
      var vl = 0, Qu, hl, $r, Io, kr, ic, lc;
      function Wu() {
      }
      Wu.__reactDisabledLog = !0;
      function ml() {
        {
          if (vl === 0) {
            Qu = console.log, hl = console.info, $r = console.warn, Io = console.error, kr = console.group, ic = console.groupCollapsed, lc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Wu,
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
          vl++;
        }
      }
      function fa() {
        {
          if (vl--, vl === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: P({}, h, {
                value: Qu
              }),
              info: P({}, h, {
                value: hl
              }),
              warn: P({}, h, {
                value: $r
              }),
              error: P({}, h, {
                value: Io
              }),
              group: P({}, h, {
                value: kr
              }),
              groupCollapsed: P({}, h, {
                value: ic
              }),
              groupEnd: P({}, h, {
                value: lc
              })
            });
          }
          vl < 0 && Ce("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = _t.ReactCurrentDispatcher, Ka;
      function Gu(h, C, z) {
        {
          if (Ka === void 0)
            try {
              throw Error();
            } catch (K) {
              var j = K.stack.trim().match(/\n( *(at )?)/);
              Ka = j && j[1] || "";
            }
          return `
` + Ka + h;
        }
      }
      var ru = !1, yl;
      {
        var qu = typeof WeakMap == "function" ? WeakMap : Map;
        yl = new qu();
      }
      function Xu(h, C) {
        if (!h || ru)
          return "";
        {
          var z = yl.get(h);
          if (z !== void 0)
            return z;
        }
        var j;
        ru = !0;
        var K = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Le;
        Le = Xa.current, Xa.current = null, ml();
        try {
          if (C) {
            var re = function() {
              throw Error();
            };
            if (Object.defineProperty(re.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(re, []);
              } catch (hn) {
                j = hn;
              }
              Reflect.construct(h, [], re);
            } else {
              try {
                re.call();
              } catch (hn) {
                j = hn;
              }
              h.call(re.prototype);
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
`), st = j.stack.split(`
`), bt = ze.length - 1, nn = st.length - 1; bt >= 1 && nn >= 0 && ze[bt] !== st[nn]; )
              nn--;
            for (; bt >= 1 && nn >= 0; bt--, nn--)
              if (ze[bt] !== st[nn]) {
                if (bt !== 1 || nn !== 1)
                  do
                    if (bt--, nn--, nn < 0 || ze[bt] !== st[nn]) {
                      var Qt = `
` + ze[bt].replace(" at new ", " at ");
                      return h.displayName && Qt.includes("<anonymous>") && (Qt = Qt.replace("<anonymous>", h.displayName)), typeof h == "function" && yl.set(h, Qt), Qt;
                    }
                  while (bt >= 1 && nn >= 0);
                break;
              }
          }
        } finally {
          ru = !1, Xa.current = Le, fa(), Error.prepareStackTrace = K;
        }
        var nt = h ? h.displayName || h.name : "", Wt = nt ? Gu(nt) : "";
        return typeof h == "function" && yl.set(h, Wt), Wt;
      }
      function Hi(h, C, z) {
        return Xu(h, !1);
      }
      function Qf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Pi(h, C, z) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Xu(h, Qf(h));
        if (typeof h == "string")
          return Gu(h);
        switch (h) {
          case Z:
            return Gu("Suspense");
          case Re:
            return Gu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Ee:
              return Hi(h.render);
            case ue:
              return Pi(h.type, C, z);
            case $e: {
              var j = h, K = j._payload, Le = j._init;
              try {
                return Pi(Le(K), C, z);
              } catch {
              }
            }
          }
        return "";
      }
      var Ot = {}, Ku = _t.ReactDebugCurrentFrame;
      function xt(h) {
        if (h) {
          var C = h._owner, z = Pi(h.type, h._source, C ? C.type : null);
          Ku.setExtraStackFrame(z);
        } else
          Ku.setExtraStackFrame(null);
      }
      function $o(h, C, z, j, K) {
        {
          var Le = Function.call.bind(Rn);
          for (var re in h)
            if (Le(h, re)) {
              var ze = void 0;
              try {
                if (typeof h[re] != "function") {
                  var st = Error((j || "React class") + ": " + z + " type `" + re + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[re] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw st.name = "Invariant Violation", st;
                }
                ze = h[re](C, re, j, z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (bt) {
                ze = bt;
              }
              ze && !(ze instanceof Error) && (xt(K), Ce("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", j || "React class", z, re, typeof ze), xt(null)), ze instanceof Error && !(ze.message in Ot) && (Ot[ze.message] = !0, xt(K), Ce("Failed %s type: %s", z, ze.message), xt(null));
            }
        }
      }
      function vi(h) {
        if (h) {
          var C = h._owner, z = Pi(h.type, h._source, C ? C.type : null);
          Ft(z);
        } else
          Ft(null);
      }
      var Be;
      Be = !1;
      function Ju() {
        if (ut.current) {
          var h = qn(ut.current.type);
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
      function hi(h) {
        return h != null ? ir(h.__source) : "";
      }
      var Dr = {};
      function mi(h) {
        var C = Ju();
        if (!C) {
          var z = typeof h == "string" ? h : h.displayName || h.name;
          z && (C = `

Check the top-level render call using <` + z + ">.");
        }
        return C;
      }
      function sn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var z = mi(C);
          if (!Dr[z]) {
            Dr[z] = !0;
            var j = "";
            h && h._owner && h._owner !== ut.current && (j = " It was passed a child from " + qn(h._owner.type) + "."), vi(h), Ce('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', z, j), vi(null);
          }
        }
      }
      function $t(h, C) {
        if (typeof h == "object") {
          if (Cn(h))
            for (var z = 0; z < h.length; z++) {
              var j = h[z];
              vn(j) && sn(j, C);
            }
          else if (vn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var K = ct(h);
            if (typeof K == "function" && K !== h.entries)
              for (var Le = K.call(h), re; !(re = Le.next()).done; )
                vn(re.value) && sn(re.value, C);
          }
        }
      }
      function gl(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var z;
          if (typeof C == "function")
            z = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === Ee || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === ue))
            z = C.propTypes;
          else
            return;
          if (z) {
            var j = qn(C);
            $o(z, h.props, "prop", j, h);
          } else if (C.PropTypes !== void 0 && !Be) {
            Be = !0;
            var K = qn(C);
            Ce("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", K || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && Ce("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function In(h) {
        {
          for (var C = Object.keys(h.props), z = 0; z < C.length; z++) {
            var j = C[z];
            if (j !== "children" && j !== "key") {
              vi(h), Ce("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", j), vi(null);
              break;
            }
          }
          h.ref !== null && (vi(h), Ce("Invalid attribute `ref` supplied to `React.Fragment`."), vi(null));
        }
      }
      function Or(h, C, z) {
        var j = Y(h);
        if (!j) {
          var K = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (K += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Le = hi(C);
          Le ? K += Le : K += Ju();
          var re;
          h === null ? re = "null" : Cn(h) ? re = "array" : h !== void 0 && h.$$typeof === gt ? (re = "<" + (qn(h.type) || "Unknown") + " />", K = " Did you accidentally export a JSX literal instead of a component?") : re = typeof h, Ce("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", re, K);
        }
        var ze = tt.apply(this, arguments);
        if (ze == null)
          return ze;
        if (j)
          for (var st = 2; st < arguments.length; st++)
            $t(arguments[st], h);
        return h === dt ? In(ze) : gl(ze), ze;
      }
      var xa = !1;
      function au(h) {
        var C = Or.bind(null, h);
        return C.type = h, xa || (xa = !0, Dt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return Dt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Qo(h, C, z) {
        for (var j = Zt.apply(this, arguments), K = 2; K < arguments.length; K++)
          $t(arguments[K], j.type);
        return gl(j), j;
      }
      function Wo(h, C) {
        var z = vt.transition;
        vt.transition = {};
        var j = vt.transition;
        vt.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (vt.transition = z, z === null && j._updatedFibers) {
            var K = j._updatedFibers.size;
            K > 10 && Dt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), j._updatedFibers.clear();
          }
        }
      }
      var Sl = !1, iu = null;
      function Wf(h) {
        if (iu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), z = B && B[C];
            iu = z.call(B, "timers").setImmediate;
          } catch {
            iu = function(K) {
              Sl === !1 && (Sl = !0, typeof MessageChannel > "u" && Ce("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Le = new MessageChannel();
              Le.port1.onmessage = K, Le.port2.postMessage(void 0);
            };
          }
        return iu(h);
      }
      var ba = 0, Ja = !1;
      function yi(h) {
        {
          var C = ba;
          ba++, _e.current === null && (_e.current = []);
          var z = _e.isBatchingLegacy, j;
          try {
            if (_e.isBatchingLegacy = !0, j = h(), !z && _e.didScheduleLegacyUpdate) {
              var K = _e.current;
              K !== null && (_e.didScheduleLegacyUpdate = !1, El(K));
            }
          } catch (nt) {
            throw wa(C), nt;
          } finally {
            _e.isBatchingLegacy = z;
          }
          if (j !== null && typeof j == "object" && typeof j.then == "function") {
            var Le = j, re = !1, ze = {
              then: function(nt, Wt) {
                re = !0, Le.then(function(hn) {
                  wa(C), ba === 0 ? Zu(hn, nt, Wt) : nt(hn);
                }, function(hn) {
                  wa(C), Wt(hn);
                });
              }
            };
            return !Ja && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              re || (Ja = !0, Ce("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), ze;
          } else {
            var st = j;
            if (wa(C), ba === 0) {
              var bt = _e.current;
              bt !== null && (El(bt), _e.current = null);
              var nn = {
                then: function(nt, Wt) {
                  _e.current === null ? (_e.current = [], Zu(st, nt, Wt)) : nt(st);
                }
              };
              return nn;
            } else {
              var Qt = {
                then: function(nt, Wt) {
                  nt(st);
                }
              };
              return Qt;
            }
          }
        }
      }
      function wa(h) {
        h !== ba - 1 && Ce("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ba = h;
      }
      function Zu(h, C, z) {
        {
          var j = _e.current;
          if (j !== null)
            try {
              El(j), Wf(function() {
                j.length === 0 ? (_e.current = null, C(h)) : Zu(h, C, z);
              });
            } catch (K) {
              z(K);
            }
          else
            C(h);
        }
      }
      var eo = !1;
      function El(h) {
        if (!eo) {
          eo = !0;
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
            eo = !1;
          }
        }
      }
      var lu = Or, to = Qo, no = au, Za = {
        map: Fi,
        forEach: Zl,
        count: Jl,
        toArray: dl,
        only: pl
      };
      G.Children = Za, G.Component = Ae, G.Fragment = dt, G.Profiler = mt, G.PureComponent = at, G.StrictMode = S, G.Suspense = Z, G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _t, G.act = yi, G.cloneElement = to, G.createContext = eu, G.createElement = lu, G.createFactory = no, G.createRef = On, G.forwardRef = pi, G.isValidElement = vn, G.lazy = di, G.memo = ae, G.startTransition = Wo, G.unstable_act = yi, G.useCallback = ar, G.useContext = Ge, G.useDebugValue = qe, G.useDeferredValue = qa, G.useEffect = Tn, G.useId = tu, G.useImperativeHandle = Ga, G.useInsertionEffect = tn, G.useLayoutEffect = on, G.useMemo = Wa, G.useReducer = ot, G.useRef = it, G.useState = Ye, G.useSyncExternalStore = nu, G.useTransition = Je, G.version = M, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(ev, ev.exports)), ev.exports;
}
var ZR;
function tv() {
  return ZR || (ZR = 1, process.env.NODE_ENV === "production" ? qm.exports = K_() : qm.exports = J_()), qm.exports;
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
function Z_() {
  if (eT) return Kp;
  eT = 1;
  var B = tv(), G = Symbol.for("react.element"), M = Symbol.for("react.fragment"), gt = Object.prototype.hasOwnProperty, ft = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, dt = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(mt, se, de) {
    var Ee, Z = {}, Re = null, ue = null;
    de !== void 0 && (Re = "" + de), se.key !== void 0 && (Re = "" + se.key), se.ref !== void 0 && (ue = se.ref);
    for (Ee in se) gt.call(se, Ee) && !dt.hasOwnProperty(Ee) && (Z[Ee] = se[Ee]);
    if (mt && mt.defaultProps) for (Ee in se = mt.defaultProps, se) Z[Ee] === void 0 && (Z[Ee] = se[Ee]);
    return { $$typeof: G, type: mt, key: Re, ref: ue, props: Z, _owner: ft.current };
  }
  return Kp.Fragment = M, Kp.jsx = S, Kp.jsxs = S, Kp;
}
var Jp = {};
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
function ek() {
  return tT || (tT = 1, process.env.NODE_ENV !== "production" && (function() {
    var B = tv(), G = Symbol.for("react.element"), M = Symbol.for("react.portal"), gt = Symbol.for("react.fragment"), ft = Symbol.for("react.strict_mode"), dt = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), mt = Symbol.for("react.context"), se = Symbol.for("react.forward_ref"), de = Symbol.for("react.suspense"), Ee = Symbol.for("react.suspense_list"), Z = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), ue = Symbol.for("react.offscreen"), $e = Symbol.iterator, St = "@@iterator";
    function pt(R) {
      if (R === null || typeof R != "object")
        return null;
      var Y = $e && R[$e] || R[St];
      return typeof Y == "function" ? Y : null;
    }
    var fn = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ct(R) {
      {
        for (var Y = arguments.length, ae = new Array(Y > 1 ? Y - 1 : 0), he = 1; he < Y; he++)
          ae[he - 1] = arguments[he];
        Qe("error", R, ae);
      }
    }
    function Qe(R, Y, ae) {
      {
        var he = fn.ReactDebugCurrentFrame, Ge = he.getStackAddendum();
        Ge !== "" && (Y += "%s", ae = ae.concat([Ge]));
        var Ye = ae.map(function(ot) {
          return String(ot);
        });
        Ye.unshift("Warning: " + Y), Function.prototype.apply.call(console[R], console, Ye);
      }
    }
    var vt = !1, _e = !1, ut = !1, Fe = !1, an = !1, Ft;
    Ft = Symbol.for("react.module.reference");
    function Jt(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === gt || R === dt || an || R === ft || R === de || R === Ee || Fe || R === ue || vt || _e || ut || typeof R == "object" && R !== null && (R.$$typeof === Re || R.$$typeof === Z || R.$$typeof === S || R.$$typeof === mt || R.$$typeof === se || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Ft || R.getModuleId !== void 0));
    }
    function ln(R, Y, ae) {
      var he = R.displayName;
      if (he)
        return he;
      var Ge = Y.displayName || Y.name || "";
      return Ge !== "" ? ae + "(" + Ge + ")" : ae;
    }
    function wt(R) {
      return R.displayName || "Context";
    }
    function Oe(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && ct("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case gt:
          return "Fragment";
        case M:
          return "Portal";
        case dt:
          return "Profiler";
        case ft:
          return "StrictMode";
        case de:
          return "Suspense";
        case Ee:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case mt:
            var Y = R;
            return wt(Y) + ".Consumer";
          case S:
            var ae = R;
            return wt(ae._context) + ".Provider";
          case se:
            return ln(R, R.render, "ForwardRef");
          case Z:
            var he = R.displayName || null;
            return he !== null ? he : Oe(R.type) || "Memo";
          case Re: {
            var Ge = R, Ye = Ge._payload, ot = Ge._init;
            try {
              return Oe(ot(Ye));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var At = Object.assign, _t = 0, Dt, Ce, J, Te, ne, _, P;
    function He() {
    }
    He.__reactDisabledLog = !0;
    function Ae() {
      {
        if (_t === 0) {
          Dt = console.log, Ce = console.info, J = console.warn, Te = console.error, ne = console.group, _ = console.groupCollapsed, P = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: He,
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
        _t++;
      }
    }
    function rt() {
      {
        if (_t--, _t === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: At({}, R, {
              value: Dt
            }),
            info: At({}, R, {
              value: Ce
            }),
            warn: At({}, R, {
              value: J
            }),
            error: At({}, R, {
              value: Te
            }),
            group: At({}, R, {
              value: ne
            }),
            groupCollapsed: At({}, R, {
              value: _
            }),
            groupEnd: At({}, R, {
              value: P
            })
          });
        }
        _t < 0 && ct("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Ze = fn.ReactCurrentDispatcher, Ke;
    function et(R, Y, ae) {
      {
        if (Ke === void 0)
          try {
            throw Error();
          } catch (Ge) {
            var he = Ge.stack.trim().match(/\n( *(at )?)/);
            Ke = he && he[1] || "";
          }
        return `
` + Ke + R;
      }
    }
    var at = !1, Bt;
    {
      var On = typeof WeakMap == "function" ? WeakMap : Map;
      Bt = new On();
    }
    function br(R, Y) {
      if (!R || at)
        return "";
      {
        var ae = Bt.get(R);
        if (ae !== void 0)
          return ae;
      }
      var he;
      at = !0;
      var Ge = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Ye;
      Ye = Ze.current, Ze.current = null, Ae();
      try {
        if (Y) {
          var ot = function() {
            throw Error();
          };
          if (Object.defineProperty(ot.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(ot, []);
            } catch (qe) {
              he = qe;
            }
            Reflect.construct(R, [], ot);
          } else {
            try {
              ot.call();
            } catch (qe) {
              he = qe;
            }
            R.call(ot.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (qe) {
            he = qe;
          }
          R();
        }
      } catch (qe) {
        if (qe && he && typeof qe.stack == "string") {
          for (var it = qe.stack.split(`
`), Tn = he.stack.split(`
`), tn = it.length - 1, on = Tn.length - 1; tn >= 1 && on >= 0 && it[tn] !== Tn[on]; )
            on--;
          for (; tn >= 1 && on >= 0; tn--, on--)
            if (it[tn] !== Tn[on]) {
              if (tn !== 1 || on !== 1)
                do
                  if (tn--, on--, on < 0 || it[tn] !== Tn[on]) {
                    var ar = `
` + it[tn].replace(" at new ", " at ");
                    return R.displayName && ar.includes("<anonymous>") && (ar = ar.replace("<anonymous>", R.displayName)), typeof R == "function" && Bt.set(R, ar), ar;
                  }
                while (tn >= 1 && on >= 0);
              break;
            }
        }
      } finally {
        at = !1, Ze.current = Ye, rt(), Error.prepareStackTrace = Ge;
      }
      var Wa = R ? R.displayName || R.name : "", Ga = Wa ? et(Wa) : "";
      return typeof R == "function" && Bt.set(R, Ga), Ga;
    }
    function Cn(R, Y, ae) {
      return br(R, !1);
    }
    function nr(R) {
      var Y = R.prototype;
      return !!(Y && Y.isReactComponent);
    }
    function Vn(R, Y, ae) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return br(R, nr(R));
      if (typeof R == "string")
        return et(R);
      switch (R) {
        case de:
          return et("Suspense");
        case Ee:
          return et("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case se:
            return Cn(R.render);
          case Z:
            return Vn(R.type, Y, ae);
          case Re: {
            var he = R, Ge = he._payload, Ye = he._init;
            try {
              return Vn(Ye(Ge), Y, ae);
            } catch {
            }
          }
        }
      return "";
    }
    var Bn = Object.prototype.hasOwnProperty, Ir = {}, si = fn.ReactDebugCurrentFrame;
    function oa(R) {
      if (R) {
        var Y = R._owner, ae = Vn(R.type, R._source, Y ? Y.type : null);
        si.setExtraStackFrame(ae);
      } else
        si.setExtraStackFrame(null);
    }
    function qn(R, Y, ae, he, Ge) {
      {
        var Ye = Function.call.bind(Bn);
        for (var ot in R)
          if (Ye(R, ot)) {
            var it = void 0;
            try {
              if (typeof R[ot] != "function") {
                var Tn = Error((he || "React class") + ": " + ae + " type `" + ot + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[ot] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Tn.name = "Invariant Violation", Tn;
              }
              it = R[ot](Y, ot, he, ae, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (tn) {
              it = tn;
            }
            it && !(it instanceof Error) && (oa(Ge), ct("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", he || "React class", ae, ot, typeof it), oa(null)), it instanceof Error && !(it.message in Ir) && (Ir[it.message] = !0, oa(Ge), ct("Failed %s type: %s", ae, it.message), oa(null));
          }
      }
    }
    var Rn = Array.isArray;
    function Yn(R) {
      return Rn(R);
    }
    function gr(R) {
      {
        var Y = typeof Symbol == "function" && Symbol.toStringTag, ae = Y && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return ae;
      }
    }
    function Ia(R) {
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
      if (Ia(R))
        return ct("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", gr(R)), Ln(R);
    }
    var sa = fn.ReactCurrentOwner, $a = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ci, ee;
    function xe(R) {
      if (Bn.call(R, "ref")) {
        var Y = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (Y && Y.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function tt(R) {
      if (Bn.call(R, "key")) {
        var Y = Object.getOwnPropertyDescriptor(R, "key").get;
        if (Y && Y.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function jt(R, Y) {
      typeof R.ref == "string" && sa.current;
    }
    function Zt(R, Y) {
      {
        var ae = function() {
          ci || (ci = !0, ct("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Y));
        };
        ae.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: ae,
          configurable: !0
        });
      }
    }
    function vn(R, Y) {
      {
        var ae = function() {
          ee || (ee = !0, ct("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Y));
        };
        ae.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: ae,
          configurable: !0
        });
      }
    }
    var un = function(R, Y, ae, he, Ge, Ye, ot) {
      var it = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: G,
        // Built-in properties that belong on the element
        type: R,
        key: Y,
        ref: ae,
        props: ot,
        // Record the component responsible for creating this element.
        _owner: Ye
      };
      return it._store = {}, Object.defineProperty(it._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(it, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: he
      }), Object.defineProperty(it, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ge
      }), Object.freeze && (Object.freeze(it.props), Object.freeze(it)), it;
    };
    function Xn(R, Y, ae, he, Ge) {
      {
        var Ye, ot = {}, it = null, Tn = null;
        ae !== void 0 && (Sr(ae), it = "" + ae), tt(Y) && (Sr(Y.key), it = "" + Y.key), xe(Y) && (Tn = Y.ref, jt(Y, Ge));
        for (Ye in Y)
          Bn.call(Y, Ye) && !$a.hasOwnProperty(Ye) && (ot[Ye] = Y[Ye]);
        if (R && R.defaultProps) {
          var tn = R.defaultProps;
          for (Ye in tn)
            ot[Ye] === void 0 && (ot[Ye] = tn[Ye]);
        }
        if (it || Tn) {
          var on = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          it && Zt(ot, on), Tn && vn(ot, on);
        }
        return un(R, it, Tn, Ge, he, sa.current, ot);
      }
    }
    var en = fn.ReactCurrentOwner, Yt = fn.ReactDebugCurrentFrame;
    function It(R) {
      if (R) {
        var Y = R._owner, ae = Vn(R.type, R._source, Y ? Y.type : null);
        Yt.setExtraStackFrame(ae);
      } else
        Yt.setExtraStackFrame(null);
    }
    var ca;
    ca = !1;
    function Er(R) {
      return typeof R == "object" && R !== null && R.$$typeof === G;
    }
    function Ta() {
      {
        if (en.current) {
          var R = Oe(en.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Fi(R) {
      return "";
    }
    var Jl = {};
    function Zl(R) {
      {
        var Y = Ta();
        if (!Y) {
          var ae = typeof R == "string" ? R : R.displayName || R.name;
          ae && (Y = `

Check the top-level render call using <` + ae + ">.");
        }
        return Y;
      }
    }
    function dl(R, Y) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var ae = Zl(Y);
        if (Jl[ae])
          return;
        Jl[ae] = !0;
        var he = "";
        R && R._owner && R._owner !== en.current && (he = " It was passed a child from " + Oe(R._owner.type) + "."), It(R), ct('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ae, he), It(null);
      }
    }
    function pl(R, Y) {
      {
        if (typeof R != "object")
          return;
        if (Yn(R))
          for (var ae = 0; ae < R.length; ae++) {
            var he = R[ae];
            Er(he) && dl(he, Y);
          }
        else if (Er(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var Ge = pt(R);
          if (typeof Ge == "function" && Ge !== R.entries)
            for (var Ye = Ge.call(R), ot; !(ot = Ye.next()).done; )
              Er(ot.value) && dl(ot.value, Y);
        }
      }
    }
    function eu(R) {
      {
        var Y = R.type;
        if (Y == null || typeof Y == "string")
          return;
        var ae;
        if (typeof Y == "function")
          ae = Y.propTypes;
        else if (typeof Y == "object" && (Y.$$typeof === se || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        Y.$$typeof === Z))
          ae = Y.propTypes;
        else
          return;
        if (ae) {
          var he = Oe(Y);
          qn(ae, R.props, "prop", he, R);
        } else if (Y.PropTypes !== void 0 && !ca) {
          ca = !0;
          var Ge = Oe(Y);
          ct("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Ge || "Unknown");
        }
        typeof Y.getDefaultProps == "function" && !Y.getDefaultProps.isReactClassApproved && ct("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function wr(R) {
      {
        for (var Y = Object.keys(R.props), ae = 0; ae < Y.length; ae++) {
          var he = Y[ae];
          if (he !== "children" && he !== "key") {
            It(R), ct("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", he), It(null);
            break;
          }
        }
        R.ref !== null && (It(R), ct("Invalid attribute `ref` supplied to `React.Fragment`."), It(null));
      }
    }
    var _r = {};
    function rr(R, Y, ae, he, Ge, Ye) {
      {
        var ot = Jt(R);
        if (!ot) {
          var it = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (it += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Tn = Fi();
          Tn ? it += Tn : it += Ta();
          var tn;
          R === null ? tn = "null" : Yn(R) ? tn = "array" : R !== void 0 && R.$$typeof === G ? (tn = "<" + (Oe(R.type) || "Unknown") + " />", it = " Did you accidentally export a JSX literal instead of a component?") : tn = typeof R, ct("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", tn, it);
        }
        var on = Xn(R, Y, ae, Ge, Ye);
        if (on == null)
          return on;
        if (ot) {
          var ar = Y.children;
          if (ar !== void 0)
            if (he)
              if (Yn(ar)) {
                for (var Wa = 0; Wa < ar.length; Wa++)
                  pl(ar[Wa], R);
                Object.freeze && Object.freeze(ar);
              } else
                ct("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              pl(ar, R);
        }
        if (Bn.call(Y, "key")) {
          var Ga = Oe(R), qe = Object.keys(Y).filter(function(tu) {
            return tu !== "key";
          }), Je = qe.length > 0 ? "{key: someKey, " + qe.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!_r[Ga + Je]) {
            var qa = qe.length > 0 ? "{" + qe.join(": ..., ") + ": ...}" : "{}";
            ct(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Je, Ga, qa, Ga), _r[Ga + Je] = !0;
          }
        }
        return R === gt ? wr(on) : eu(on), on;
      }
    }
    function fi(R, Y, ae) {
      return rr(R, Y, ae, !0);
    }
    function Qa(R, Y, ae) {
      return rr(R, Y, ae, !1);
    }
    var di = Qa, pi = fi;
    Jp.Fragment = gt, Jp.jsx = di, Jp.jsxs = pi;
  })()), Jp;
}
var nT;
function tk() {
  return nT || (nT = 1, process.env.NODE_ENV === "production" ? Gm.exports = Z_() : Gm.exports = ek()), Gm.exports;
}
var Vt = tk(), $f = {}, Xm = { exports: {} }, Ba = {}, Km = { exports: {} }, vE = {};
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
function nk() {
  return rT || (rT = 1, (function(B) {
    function G(J, Te) {
      var ne = J.length;
      J.push(Te);
      e: for (; 0 < ne; ) {
        var _ = ne - 1 >>> 1, P = J[_];
        if (0 < ft(P, Te)) J[_] = Te, J[ne] = P, ne = _;
        else break e;
      }
    }
    function M(J) {
      return J.length === 0 ? null : J[0];
    }
    function gt(J) {
      if (J.length === 0) return null;
      var Te = J[0], ne = J.pop();
      if (ne !== Te) {
        J[0] = ne;
        e: for (var _ = 0, P = J.length, He = P >>> 1; _ < He; ) {
          var Ae = 2 * (_ + 1) - 1, rt = J[Ae], Ze = Ae + 1, Ke = J[Ze];
          if (0 > ft(rt, ne)) Ze < P && 0 > ft(Ke, rt) ? (J[_] = Ke, J[Ze] = ne, _ = Ze) : (J[_] = rt, J[Ae] = ne, _ = Ae);
          else if (Ze < P && 0 > ft(Ke, ne)) J[_] = Ke, J[Ze] = ne, _ = Ze;
          else break e;
        }
      }
      return Te;
    }
    function ft(J, Te) {
      var ne = J.sortIndex - Te.sortIndex;
      return ne !== 0 ? ne : J.id - Te.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var dt = performance;
      B.unstable_now = function() {
        return dt.now();
      };
    } else {
      var S = Date, mt = S.now();
      B.unstable_now = function() {
        return S.now() - mt;
      };
    }
    var se = [], de = [], Ee = 1, Z = null, Re = 3, ue = !1, $e = !1, St = !1, pt = typeof setTimeout == "function" ? setTimeout : null, fn = typeof clearTimeout == "function" ? clearTimeout : null, ct = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Qe(J) {
      for (var Te = M(de); Te !== null; ) {
        if (Te.callback === null) gt(de);
        else if (Te.startTime <= J) gt(de), Te.sortIndex = Te.expirationTime, G(se, Te);
        else break;
        Te = M(de);
      }
    }
    function vt(J) {
      if (St = !1, Qe(J), !$e) if (M(se) !== null) $e = !0, Dt(_e);
      else {
        var Te = M(de);
        Te !== null && Ce(vt, Te.startTime - J);
      }
    }
    function _e(J, Te) {
      $e = !1, St && (St = !1, fn(an), an = -1), ue = !0;
      var ne = Re;
      try {
        for (Qe(Te), Z = M(se); Z !== null && (!(Z.expirationTime > Te) || J && !ln()); ) {
          var _ = Z.callback;
          if (typeof _ == "function") {
            Z.callback = null, Re = Z.priorityLevel;
            var P = _(Z.expirationTime <= Te);
            Te = B.unstable_now(), typeof P == "function" ? Z.callback = P : Z === M(se) && gt(se), Qe(Te);
          } else gt(se);
          Z = M(se);
        }
        if (Z !== null) var He = !0;
        else {
          var Ae = M(de);
          Ae !== null && Ce(vt, Ae.startTime - Te), He = !1;
        }
        return He;
      } finally {
        Z = null, Re = ne, ue = !1;
      }
    }
    var ut = !1, Fe = null, an = -1, Ft = 5, Jt = -1;
    function ln() {
      return !(B.unstable_now() - Jt < Ft);
    }
    function wt() {
      if (Fe !== null) {
        var J = B.unstable_now();
        Jt = J;
        var Te = !0;
        try {
          Te = Fe(!0, J);
        } finally {
          Te ? Oe() : (ut = !1, Fe = null);
        }
      } else ut = !1;
    }
    var Oe;
    if (typeof ct == "function") Oe = function() {
      ct(wt);
    };
    else if (typeof MessageChannel < "u") {
      var At = new MessageChannel(), _t = At.port2;
      At.port1.onmessage = wt, Oe = function() {
        _t.postMessage(null);
      };
    } else Oe = function() {
      pt(wt, 0);
    };
    function Dt(J) {
      Fe = J, ut || (ut = !0, Oe());
    }
    function Ce(J, Te) {
      an = pt(function() {
        J(B.unstable_now());
      }, Te);
    }
    B.unstable_IdlePriority = 5, B.unstable_ImmediatePriority = 1, B.unstable_LowPriority = 4, B.unstable_NormalPriority = 3, B.unstable_Profiling = null, B.unstable_UserBlockingPriority = 2, B.unstable_cancelCallback = function(J) {
      J.callback = null;
    }, B.unstable_continueExecution = function() {
      $e || ue || ($e = !0, Dt(_e));
    }, B.unstable_forceFrameRate = function(J) {
      0 > J || 125 < J ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ft = 0 < J ? Math.floor(1e3 / J) : 5;
    }, B.unstable_getCurrentPriorityLevel = function() {
      return Re;
    }, B.unstable_getFirstCallbackNode = function() {
      return M(se);
    }, B.unstable_next = function(J) {
      switch (Re) {
        case 1:
        case 2:
        case 3:
          var Te = 3;
          break;
        default:
          Te = Re;
      }
      var ne = Re;
      Re = Te;
      try {
        return J();
      } finally {
        Re = ne;
      }
    }, B.unstable_pauseExecution = function() {
    }, B.unstable_requestPaint = function() {
    }, B.unstable_runWithPriority = function(J, Te) {
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
      var ne = Re;
      Re = J;
      try {
        return Te();
      } finally {
        Re = ne;
      }
    }, B.unstable_scheduleCallback = function(J, Te, ne) {
      var _ = B.unstable_now();
      switch (typeof ne == "object" && ne !== null ? (ne = ne.delay, ne = typeof ne == "number" && 0 < ne ? _ + ne : _) : ne = _, J) {
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
      return P = ne + P, J = { id: Ee++, callback: Te, priorityLevel: J, startTime: ne, expirationTime: P, sortIndex: -1 }, ne > _ ? (J.sortIndex = ne, G(de, J), M(se) === null && J === M(de) && (St ? (fn(an), an = -1) : St = !0, Ce(vt, ne - _))) : (J.sortIndex = P, G(se, J), $e || ue || ($e = !0, Dt(_e))), J;
    }, B.unstable_shouldYield = ln, B.unstable_wrapCallback = function(J) {
      var Te = Re;
      return function() {
        var ne = Re;
        Re = Te;
        try {
          return J.apply(this, arguments);
        } finally {
          Re = ne;
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
function rk() {
  return aT || (aT = 1, (function(B) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var G = !1, M = 5;
      function gt(ee, xe) {
        var tt = ee.length;
        ee.push(xe), S(ee, xe, tt);
      }
      function ft(ee) {
        return ee.length === 0 ? null : ee[0];
      }
      function dt(ee) {
        if (ee.length === 0)
          return null;
        var xe = ee[0], tt = ee.pop();
        return tt !== xe && (ee[0] = tt, mt(ee, tt, 0)), xe;
      }
      function S(ee, xe, tt) {
        for (var jt = tt; jt > 0; ) {
          var Zt = jt - 1 >>> 1, vn = ee[Zt];
          if (se(vn, xe) > 0)
            ee[Zt] = xe, ee[jt] = vn, jt = Zt;
          else
            return;
        }
      }
      function mt(ee, xe, tt) {
        for (var jt = tt, Zt = ee.length, vn = Zt >>> 1; jt < vn; ) {
          var un = (jt + 1) * 2 - 1, Xn = ee[un], en = un + 1, Yt = ee[en];
          if (se(Xn, xe) < 0)
            en < Zt && se(Yt, Xn) < 0 ? (ee[jt] = Yt, ee[en] = xe, jt = en) : (ee[jt] = Xn, ee[un] = xe, jt = un);
          else if (en < Zt && se(Yt, xe) < 0)
            ee[jt] = Yt, ee[en] = xe, jt = en;
          else
            return;
        }
      }
      function se(ee, xe) {
        var tt = ee.sortIndex - xe.sortIndex;
        return tt !== 0 ? tt : ee.id - xe.id;
      }
      var de = 1, Ee = 2, Z = 3, Re = 4, ue = 5;
      function $e(ee, xe) {
      }
      var St = typeof performance == "object" && typeof performance.now == "function";
      if (St) {
        var pt = performance;
        B.unstable_now = function() {
          return pt.now();
        };
      } else {
        var fn = Date, ct = fn.now();
        B.unstable_now = function() {
          return fn.now() - ct;
        };
      }
      var Qe = 1073741823, vt = -1, _e = 250, ut = 5e3, Fe = 1e4, an = Qe, Ft = [], Jt = [], ln = 1, wt = null, Oe = Z, At = !1, _t = !1, Dt = !1, Ce = typeof setTimeout == "function" ? setTimeout : null, J = typeof clearTimeout == "function" ? clearTimeout : null, Te = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ne(ee) {
        for (var xe = ft(Jt); xe !== null; ) {
          if (xe.callback === null)
            dt(Jt);
          else if (xe.startTime <= ee)
            dt(Jt), xe.sortIndex = xe.expirationTime, gt(Ft, xe);
          else
            return;
          xe = ft(Jt);
        }
      }
      function _(ee) {
        if (Dt = !1, ne(ee), !_t)
          if (ft(Ft) !== null)
            _t = !0, Ln(P);
          else {
            var xe = ft(Jt);
            xe !== null && Sr(_, xe.startTime - ee);
          }
      }
      function P(ee, xe) {
        _t = !1, Dt && (Dt = !1, sa()), At = !0;
        var tt = Oe;
        try {
          var jt;
          if (!G) return He(ee, xe);
        } finally {
          wt = null, Oe = tt, At = !1;
        }
      }
      function He(ee, xe) {
        var tt = xe;
        for (ne(tt), wt = ft(Ft); wt !== null && !(wt.expirationTime > tt && (!ee || si())); ) {
          var jt = wt.callback;
          if (typeof jt == "function") {
            wt.callback = null, Oe = wt.priorityLevel;
            var Zt = wt.expirationTime <= tt, vn = jt(Zt);
            tt = B.unstable_now(), typeof vn == "function" ? wt.callback = vn : wt === ft(Ft) && dt(Ft), ne(tt);
          } else
            dt(Ft);
          wt = ft(Ft);
        }
        if (wt !== null)
          return !0;
        var un = ft(Jt);
        return un !== null && Sr(_, un.startTime - tt), !1;
      }
      function Ae(ee, xe) {
        switch (ee) {
          case de:
          case Ee:
          case Z:
          case Re:
          case ue:
            break;
          default:
            ee = Z;
        }
        var tt = Oe;
        Oe = ee;
        try {
          return xe();
        } finally {
          Oe = tt;
        }
      }
      function rt(ee) {
        var xe;
        switch (Oe) {
          case de:
          case Ee:
          case Z:
            xe = Z;
            break;
          default:
            xe = Oe;
            break;
        }
        var tt = Oe;
        Oe = xe;
        try {
          return ee();
        } finally {
          Oe = tt;
        }
      }
      function Ze(ee) {
        var xe = Oe;
        return function() {
          var tt = Oe;
          Oe = xe;
          try {
            return ee.apply(this, arguments);
          } finally {
            Oe = tt;
          }
        };
      }
      function Ke(ee, xe, tt) {
        var jt = B.unstable_now(), Zt;
        if (typeof tt == "object" && tt !== null) {
          var vn = tt.delay;
          typeof vn == "number" && vn > 0 ? Zt = jt + vn : Zt = jt;
        } else
          Zt = jt;
        var un;
        switch (ee) {
          case de:
            un = vt;
            break;
          case Ee:
            un = _e;
            break;
          case ue:
            un = an;
            break;
          case Re:
            un = Fe;
            break;
          case Z:
          default:
            un = ut;
            break;
        }
        var Xn = Zt + un, en = {
          id: ln++,
          callback: xe,
          priorityLevel: ee,
          startTime: Zt,
          expirationTime: Xn,
          sortIndex: -1
        };
        return Zt > jt ? (en.sortIndex = Zt, gt(Jt, en), ft(Ft) === null && en === ft(Jt) && (Dt ? sa() : Dt = !0, Sr(_, Zt - jt))) : (en.sortIndex = Xn, gt(Ft, en), !_t && !At && (_t = !0, Ln(P))), en;
      }
      function et() {
      }
      function at() {
        !_t && !At && (_t = !0, Ln(P));
      }
      function Bt() {
        return ft(Ft);
      }
      function On(ee) {
        ee.callback = null;
      }
      function br() {
        return Oe;
      }
      var Cn = !1, nr = null, Vn = -1, Bn = M, Ir = -1;
      function si() {
        var ee = B.unstable_now() - Ir;
        return !(ee < Bn);
      }
      function oa() {
      }
      function qn(ee) {
        if (ee < 0 || ee > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ee > 0 ? Bn = Math.floor(1e3 / ee) : Bn = M;
      }
      var Rn = function() {
        if (nr !== null) {
          var ee = B.unstable_now();
          Ir = ee;
          var xe = !0, tt = !0;
          try {
            tt = nr(xe, ee);
          } finally {
            tt ? Yn() : (Cn = !1, nr = null);
          }
        } else
          Cn = !1;
      }, Yn;
      if (typeof Te == "function")
        Yn = function() {
          Te(Rn);
        };
      else if (typeof MessageChannel < "u") {
        var gr = new MessageChannel(), Ia = gr.port2;
        gr.port1.onmessage = Rn, Yn = function() {
          Ia.postMessage(null);
        };
      } else
        Yn = function() {
          Ce(Rn, 0);
        };
      function Ln(ee) {
        nr = ee, Cn || (Cn = !0, Yn());
      }
      function Sr(ee, xe) {
        Vn = Ce(function() {
          ee(B.unstable_now());
        }, xe);
      }
      function sa() {
        J(Vn), Vn = -1;
      }
      var $a = oa, ci = null;
      B.unstable_IdlePriority = ue, B.unstable_ImmediatePriority = de, B.unstable_LowPriority = Re, B.unstable_NormalPriority = Z, B.unstable_Profiling = ci, B.unstable_UserBlockingPriority = Ee, B.unstable_cancelCallback = On, B.unstable_continueExecution = at, B.unstable_forceFrameRate = qn, B.unstable_getCurrentPriorityLevel = br, B.unstable_getFirstCallbackNode = Bt, B.unstable_next = rt, B.unstable_pauseExecution = et, B.unstable_requestPaint = $a, B.unstable_runWithPriority = Ae, B.unstable_scheduleCallback = Ke, B.unstable_shouldYield = si, B.unstable_wrapCallback = Ze, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(hE)), hE;
}
var iT;
function cT() {
  return iT || (iT = 1, process.env.NODE_ENV === "production" ? Km.exports = nk() : Km.exports = rk()), Km.exports;
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
function ak() {
  if (lT) return Ba;
  lT = 1;
  var B = tv(), G = cT();
  function M(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var gt = /* @__PURE__ */ new Set(), ft = {};
  function dt(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (ft[n] = r, n = 0; n < r.length; n++) gt.add(r[n]);
  }
  var mt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), se = Object.prototype.hasOwnProperty, de = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Ee = {}, Z = {};
  function Re(n) {
    return se.call(Z, n) ? !0 : se.call(Ee, n) ? !1 : de.test(n) ? Z[n] = !0 : (Ee[n] = !0, !1);
  }
  function ue(n, r, l, o) {
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
  function $e(n, r, l, o) {
    if (r === null || typeof r > "u" || ue(n, r, l, o)) return !0;
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
  function St(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var pt = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    pt[n] = new St(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    pt[r] = new St(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    pt[n] = new St(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    pt[n] = new St(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    pt[n] = new St(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    pt[n] = new St(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    pt[n] = new St(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    pt[n] = new St(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    pt[n] = new St(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var fn = /[\-:]([a-z])/g;
  function ct(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      fn,
      ct
    );
    pt[r] = new St(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(fn, ct);
    pt[r] = new St(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(fn, ct);
    pt[r] = new St(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    pt[n] = new St(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), pt.xlinkHref = new St("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    pt[n] = new St(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Qe(n, r, l, o) {
    var c = pt.hasOwnProperty(r) ? pt[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && ($e(r, l, c, o) && (l = null), o || c === null ? Re(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var vt = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, _e = Symbol.for("react.element"), ut = Symbol.for("react.portal"), Fe = Symbol.for("react.fragment"), an = Symbol.for("react.strict_mode"), Ft = Symbol.for("react.profiler"), Jt = Symbol.for("react.provider"), ln = Symbol.for("react.context"), wt = Symbol.for("react.forward_ref"), Oe = Symbol.for("react.suspense"), At = Symbol.for("react.suspense_list"), _t = Symbol.for("react.memo"), Dt = Symbol.for("react.lazy"), Ce = Symbol.for("react.offscreen"), J = Symbol.iterator;
  function Te(n) {
    return n === null || typeof n != "object" ? null : (n = J && n[J] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ne = Object.assign, _;
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
  var He = !1;
  function Ae(n, r) {
    if (!n || He) return "";
    He = !0;
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
      He = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? P(n) : "";
  }
  function rt(n) {
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
        return n = Ae(n.type, !1), n;
      case 11:
        return n = Ae(n.type.render, !1), n;
      case 1:
        return n = Ae(n.type, !0), n;
      default:
        return "";
    }
  }
  function Ze(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case Fe:
        return "Fragment";
      case ut:
        return "Portal";
      case Ft:
        return "Profiler";
      case an:
        return "StrictMode";
      case Oe:
        return "Suspense";
      case At:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case ln:
        return (n.displayName || "Context") + ".Consumer";
      case Jt:
        return (n._context.displayName || "Context") + ".Provider";
      case wt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case _t:
        return r = n.displayName || null, r !== null ? r : Ze(n.type) || "Memo";
      case Dt:
        r = n._payload, n = n._init;
        try {
          return Ze(n(r));
        } catch {
        }
    }
    return null;
  }
  function Ke(n) {
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
        return Ze(r);
      case 8:
        return r === an ? "StrictMode" : "Mode";
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
  function et(n) {
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
  function at(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Bt(n) {
    var r = at(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
    n._valueTracker || (n._valueTracker = Bt(n));
  }
  function br(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = at(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
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
    return ne({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Vn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = et(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Bn(n, r) {
    r = r.checked, r != null && Qe(n, "checked", r, !1);
  }
  function Ir(n, r) {
    Bn(n, r);
    var l = et(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? oa(n, r.type, l) : r.hasOwnProperty("defaultValue") && oa(n, r.type, et(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function si(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function oa(n, r, l) {
    (r !== "number" || Cn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var qn = Array.isArray;
  function Rn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + et(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Yn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(M(91));
    return ne({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function gr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(M(92));
        if (qn(l)) {
          if (1 < l.length) throw Error(M(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: et(l) };
  }
  function Ia(n, r) {
    var l = et(r.value), o = et(r.defaultValue);
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
  function sa(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Sr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var $a, ci = (function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  })(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for ($a = $a || document.createElement("div"), $a.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = $a.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function ee(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var xe = {
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
  }, tt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(xe).forEach(function(n) {
    tt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), xe[r] = xe[n];
    });
  });
  function jt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || xe.hasOwnProperty(n) && xe[n] ? ("" + r).trim() : r + "px";
  }
  function Zt(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = jt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var vn = ne({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function un(n, r) {
    if (r) {
      if (vn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(M(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(M(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(M(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(M(62));
    }
  }
  function Xn(n, r) {
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
  var en = null;
  function Yt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var It = null, ca = null, Er = null;
  function Ta(n) {
    if (n = ke(n)) {
      if (typeof It != "function") throw Error(M(280));
      var r = n.stateNode;
      r && (r = mn(r), It(n.stateNode, n.type, r));
    }
  }
  function Fi(n) {
    ca ? Er ? Er.push(n) : Er = [n] : ca = n;
  }
  function Jl() {
    if (ca) {
      var n = ca, r = Er;
      if (Er = ca = null, Ta(n), r) for (n = 0; n < r.length; n++) Ta(r[n]);
    }
  }
  function Zl(n, r) {
    return n(r);
  }
  function dl() {
  }
  var pl = !1;
  function eu(n, r, l) {
    if (pl) return n(r, l);
    pl = !0;
    try {
      return Zl(n, r, l);
    } finally {
      pl = !1, (ca !== null || Er !== null) && (dl(), Jl());
    }
  }
  function wr(n, r) {
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
    if (l && typeof l != "function") throw Error(M(231, r, typeof l));
    return l;
  }
  var _r = !1;
  if (mt) try {
    var rr = {};
    Object.defineProperty(rr, "passive", { get: function() {
      _r = !0;
    } }), window.addEventListener("test", rr, rr), window.removeEventListener("test", rr, rr);
  } catch {
    _r = !1;
  }
  function fi(n, r, l, o, c, d, m, E, T) {
    var U = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, U);
    } catch (Q) {
      this.onError(Q);
    }
  }
  var Qa = !1, di = null, pi = !1, R = null, Y = { onError: function(n) {
    Qa = !0, di = n;
  } };
  function ae(n, r, l, o, c, d, m, E, T) {
    Qa = !1, di = null, fi.apply(Y, arguments);
  }
  function he(n, r, l, o, c, d, m, E, T) {
    if (ae.apply(this, arguments), Qa) {
      if (Qa) {
        var U = di;
        Qa = !1, di = null;
      } else throw Error(M(198));
      pi || (pi = !0, R = U);
    }
  }
  function Ge(n) {
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
  function Ye(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function ot(n) {
    if (Ge(n) !== n) throw Error(M(188));
  }
  function it(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Ge(n), r === null) throw Error(M(188));
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
          if (d === l) return ot(c), n;
          if (d === o) return ot(c), r;
          d = d.sibling;
        }
        throw Error(M(188));
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
          if (!m) throw Error(M(189));
        }
      }
      if (l.alternate !== o) throw Error(M(190));
    }
    if (l.tag !== 3) throw Error(M(188));
    return l.stateNode.current === l ? n : r;
  }
  function Tn(n) {
    return n = it(n), n !== null ? tn(n) : null;
  }
  function tn(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = tn(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var on = G.unstable_scheduleCallback, ar = G.unstable_cancelCallback, Wa = G.unstable_shouldYield, Ga = G.unstable_requestPaint, qe = G.unstable_now, Je = G.unstable_getCurrentPriorityLevel, qa = G.unstable_ImmediatePriority, tu = G.unstable_UserBlockingPriority, nu = G.unstable_NormalPriority, vl = G.unstable_LowPriority, Qu = G.unstable_IdlePriority, hl = null, $r = null;
  function Io(n) {
    if ($r && typeof $r.onCommitFiberRoot == "function") try {
      $r.onCommitFiberRoot(hl, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var kr = Math.clz32 ? Math.clz32 : Wu, ic = Math.log, lc = Math.LN2;
  function Wu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (ic(n) / lc | 0) | 0;
  }
  var ml = 64, fa = 4194304;
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
  function Ka(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var E = m & ~c;
      E !== 0 ? o = Xa(E) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && (r & c) === 0 && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if ((o & 4) !== 0 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - kr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Gu(n, r) {
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
  function ru(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - kr(d), E = 1 << m, T = c[m];
      T === -1 ? ((E & l) === 0 || (E & o) !== 0) && (c[m] = Gu(E, r)) : T <= r && (n.expiredLanes |= E), d &= ~E;
    }
  }
  function yl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function qu() {
    var n = ml;
    return ml <<= 1, (ml & 4194240) === 0 && (ml = 64), n;
  }
  function Xu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Hi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - kr(r), n[r] = l;
  }
  function Qf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - kr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Pi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - kr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Ot = 0;
  function Ku(n) {
    return n &= -n, 1 < n ? 4 < n ? (n & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var xt, $o, vi, Be, Ju, ir = !1, hi = [], Dr = null, mi = null, sn = null, $t = /* @__PURE__ */ new Map(), gl = /* @__PURE__ */ new Map(), In = [], Or = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function xa(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Dr = null;
        break;
      case "dragenter":
      case "dragleave":
        mi = null;
        break;
      case "mouseover":
      case "mouseout":
        sn = null;
        break;
      case "pointerover":
      case "pointerout":
        $t.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        gl.delete(r.pointerId);
    }
  }
  function au(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = ke(r), r !== null && $o(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Qo(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Dr = au(Dr, n, r, l, o, c), !0;
      case "dragenter":
        return mi = au(mi, n, r, l, o, c), !0;
      case "mouseover":
        return sn = au(sn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return $t.set(d, au($t.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, gl.set(d, au(gl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Wo(n) {
    var r = pu(n.target);
    if (r !== null) {
      var l = Ge(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Ye(l), r !== null) {
            n.blockedOn = r, Ju(n.priority, function() {
              vi(l);
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
  function Sl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = to(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        en = o, l.target.dispatchEvent(o), en = null;
      } else return r = ke(l), r !== null && $o(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function iu(n, r, l) {
    Sl(n) && l.delete(r);
  }
  function Wf() {
    ir = !1, Dr !== null && Sl(Dr) && (Dr = null), mi !== null && Sl(mi) && (mi = null), sn !== null && Sl(sn) && (sn = null), $t.forEach(iu), gl.forEach(iu);
  }
  function ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, ir || (ir = !0, G.unstable_scheduleCallback(G.unstable_NormalPriority, Wf)));
  }
  function Ja(n) {
    function r(c) {
      return ba(c, n);
    }
    if (0 < hi.length) {
      ba(hi[0], n);
      for (var l = 1; l < hi.length; l++) {
        var o = hi[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (Dr !== null && ba(Dr, n), mi !== null && ba(mi, n), sn !== null && ba(sn, n), $t.forEach(r), gl.forEach(r), l = 0; l < In.length; l++) o = In[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < In.length && (l = In[0], l.blockedOn === null); ) Wo(l), l.blockedOn === null && In.shift();
  }
  var yi = vt.ReactCurrentBatchConfig, wa = !0;
  function Zu(n, r, l, o) {
    var c = Ot, d = yi.transition;
    yi.transition = null;
    try {
      Ot = 1, El(n, r, l, o);
    } finally {
      Ot = c, yi.transition = d;
    }
  }
  function eo(n, r, l, o) {
    var c = Ot, d = yi.transition;
    yi.transition = null;
    try {
      Ot = 4, El(n, r, l, o);
    } finally {
      Ot = c, yi.transition = d;
    }
  }
  function El(n, r, l, o) {
    if (wa) {
      var c = to(n, r, l, o);
      if (c === null) gc(n, r, o, lu, l), xa(n, o);
      else if (Qo(c, n, r, l, o)) o.stopPropagation();
      else if (xa(n, o), r & 4 && -1 < Or.indexOf(n)) {
        for (; c !== null; ) {
          var d = ke(c);
          if (d !== null && xt(d), d = to(n, r, l, o), d === null && gc(n, r, o, lu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else gc(n, r, o, null, l);
    }
  }
  var lu = null;
  function to(n, r, l, o) {
    if (lu = null, n = Yt(o), n = pu(n), n !== null) if (r = Ge(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Ye(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return lu = n, null;
  }
  function no(n) {
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
        switch (Je()) {
          case qa:
            return 1;
          case tu:
            return 4;
          case nu:
          case vl:
            return 16;
          case Qu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Za = null, h = null, C = null;
  function z() {
    if (C) return C;
    var n, r = h, l = r.length, o, c = "value" in Za ? Za.value : Za.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function j(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function K() {
    return !0;
  }
  function Le() {
    return !1;
  }
  function re(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n) n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? K : Le, this.isPropagationStopped = Le, this;
    }
    return ne(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = K);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = K);
    }, persist: function() {
    }, isPersistent: K }), r;
  }
  var ze = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, st = re(ze), bt = ne({}, ze, { view: 0, detail: 0 }), nn = re(bt), Qt, nt, Wt, hn = ne({}, bt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Jf, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Wt && (Wt && n.type === "mousemove" ? (Qt = n.screenX - Wt.screenX, nt = n.screenY - Wt.screenY) : nt = Qt = 0, Wt = n), Qt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : nt;
  } }), Cl = re(hn), Go = ne({}, hn, { dataTransfer: 0 }), Vi = re(Go), qo = ne({}, bt, { relatedTarget: 0 }), uu = re(qo), Gf = ne({}, ze, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), uc = re(Gf), qf = ne({}, ze, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), rv = re(qf), Xf = ne({}, ze, { data: 0 }), Kf = re(Xf), av = {
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
  function Bi(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Jm[n]) ? !!r[n] : !1;
  }
  function Jf() {
    return Bi;
  }
  var Zf = ne({}, bt, { key: function(n) {
    if (n.key) {
      var r = av[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = j(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? iv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Jf, charCode: function(n) {
    return n.type === "keypress" ? j(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? j(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), ed = re(Zf), td = ne({}, hn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), lv = re(td), oc = ne({}, bt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Jf }), uv = re(oc), Qr = ne({}, ze, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = re(Qr), Mn = ne({}, hn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ii = re(Mn), nd = [9, 13, 27, 32], ro = mt && "CompositionEvent" in window, Xo = null;
  mt && "documentMode" in document && (Xo = document.documentMode);
  var Ko = mt && "TextEvent" in window && !Xo, ov = mt && (!ro || Xo && 8 < Xo && 11 >= Xo), sv = " ", sc = !1;
  function cv(n, r) {
    switch (n) {
      case "keyup":
        return nd.indexOf(r.keyCode) !== -1;
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
  var ao = !1;
  function dv(n, r) {
    switch (n) {
      case "compositionend":
        return fv(r);
      case "keypress":
        return r.which !== 32 ? null : (sc = !0, sv);
      case "textInput":
        return n = r.data, n === sv && sc ? null : n;
      default:
        return null;
    }
  }
  function Zm(n, r) {
    if (ao) return n === "compositionend" || !ro && cv(n, r) ? (n = z(), C = h = Za = null, ao = !1, n) : null;
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
  function rd(n, r, l, o) {
    Fi(o), r = rs(r, "onChange"), 0 < r.length && (l = new st("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var gi = null, ou = null;
  function vv(n) {
    fu(n, 0);
  }
  function Jo(n) {
    var r = ti(n);
    if (br(r)) return n;
  }
  function ty(n, r) {
    if (n === "change") return r;
  }
  var hv = !1;
  if (mt) {
    var ad;
    if (mt) {
      var id = "oninput" in document;
      if (!id) {
        var mv = document.createElement("div");
        mv.setAttribute("oninput", "return;"), id = typeof mv.oninput == "function";
      }
      ad = id;
    } else ad = !1;
    hv = ad && (!document.documentMode || 9 < document.documentMode);
  }
  function yv() {
    gi && (gi.detachEvent("onpropertychange", gv), ou = gi = null);
  }
  function gv(n) {
    if (n.propertyName === "value" && Jo(ou)) {
      var r = [];
      rd(r, ou, n, Yt(n)), eu(vv, r);
    }
  }
  function ny(n, r, l) {
    n === "focusin" ? (yv(), gi = r, ou = l, gi.attachEvent("onpropertychange", gv)) : n === "focusout" && yv();
  }
  function Sv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Jo(ou);
  }
  function ry(n, r) {
    if (n === "click") return Jo(r);
  }
  function Ev(n, r) {
    if (n === "input" || n === "change") return Jo(r);
  }
  function ay(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ei = typeof Object.is == "function" ? Object.is : ay;
  function Zo(n, r) {
    if (ei(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!se.call(r, c) || !ei(n[c], r[c])) return !1;
    }
    return !0;
  }
  function Cv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function cc(n, r) {
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
  function Rl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Rl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function es() {
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
  function fc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function io(n) {
    var r = es(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Rl(l.ownerDocument.documentElement, l)) {
      if (o !== null && fc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = cc(l, d);
          var m = cc(
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
  var iy = mt && "documentMode" in document && 11 >= document.documentMode, lo = null, ld = null, ts = null, ud = !1;
  function od(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    ud || lo == null || lo !== Cn(o) || (o = lo, "selectionStart" in o && fc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ts && Zo(ts, o) || (ts = o, o = rs(ld, "onSelect"), 0 < o.length && (r = new st("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = lo)));
  }
  function dc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var su = { animationend: dc("Animation", "AnimationEnd"), animationiteration: dc("Animation", "AnimationIteration"), animationstart: dc("Animation", "AnimationStart"), transitionend: dc("Transition", "TransitionEnd") }, lr = {}, sd = {};
  mt && (sd = document.createElement("div").style, "AnimationEvent" in window || (delete su.animationend.animation, delete su.animationiteration.animation, delete su.animationstart.animation), "TransitionEvent" in window || delete su.transitionend.transition);
  function pc(n) {
    if (lr[n]) return lr[n];
    if (!su[n]) return n;
    var r = su[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in sd) return lr[n] = r[l];
    return n;
  }
  var Rv = pc("animationend"), Tv = pc("animationiteration"), xv = pc("animationstart"), bv = pc("transitionend"), cd = /* @__PURE__ */ new Map(), vc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function _a(n, r) {
    cd.set(n, r), dt(r, [n]);
  }
  for (var fd = 0; fd < vc.length; fd++) {
    var cu = vc[fd], ly = cu.toLowerCase(), uy = cu[0].toUpperCase() + cu.slice(1);
    _a(ly, "on" + uy);
  }
  _a(Rv, "onAnimationEnd"), _a(Tv, "onAnimationIteration"), _a(xv, "onAnimationStart"), _a("dblclick", "onDoubleClick"), _a("focusin", "onFocus"), _a("focusout", "onBlur"), _a(bv, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), dt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), dt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), dt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), dt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), dt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), dt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ns = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), dd = new Set("cancel close invalid load scroll toggle".split(" ").concat(ns));
  function hc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, he(o, r, void 0, n), n.currentTarget = null;
  }
  function fu(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var E = o[m], T = E.instance, U = E.currentTarget;
          if (E = E.listener, T !== d && c.isPropagationStopped()) break e;
          hc(c, E, U), d = T;
        }
        else for (m = 0; m < o.length; m++) {
          if (E = o[m], T = E.instance, U = E.currentTarget, E = E.listener, T !== d && c.isPropagationStopped()) break e;
          hc(c, E, U), d = T;
        }
      }
    }
    if (pi) throw n = R, pi = !1, R = null, n;
  }
  function Ht(n, r) {
    var l = r[ls];
    l === void 0 && (l = r[ls] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (wv(r, n, 2, !1), l.add(o));
  }
  function mc(n, r, l) {
    var o = 0;
    r && (o |= 4), wv(l, n, o, r);
  }
  var yc = "_reactListening" + Math.random().toString(36).slice(2);
  function uo(n) {
    if (!n[yc]) {
      n[yc] = !0, gt.forEach(function(l) {
        l !== "selectionchange" && (dd.has(l) || mc(l, !1, n), mc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[yc] || (r[yc] = !0, mc("selectionchange", !1, r));
    }
  }
  function wv(n, r, l, o) {
    switch (no(r)) {
      case 1:
        var c = Zu;
        break;
      case 4:
        c = eo;
        break;
      default:
        c = El;
    }
    l = c.bind(null, r, l, n), c = void 0, !_r || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function gc(n, r, l, o, c) {
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
          if (m = pu(E), m === null) return;
          if (T = m.tag, T === 5 || T === 6) {
            o = d = m;
            continue e;
          }
          E = E.parentNode;
        }
      }
      o = o.return;
    }
    eu(function() {
      var U = d, Q = Yt(l), q = [];
      e: {
        var $ = cd.get(n);
        if ($ !== void 0) {
          var ce = st, me = n;
          switch (n) {
            case "keypress":
              if (j(l) === 0) break e;
            case "keydown":
            case "keyup":
              ce = ed;
              break;
            case "focusin":
              me = "focus", ce = uu;
              break;
            case "focusout":
              me = "blur", ce = uu;
              break;
            case "beforeblur":
            case "afterblur":
              ce = uu;
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
              ce = Cl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ce = Vi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ce = uv;
              break;
            case Rv:
            case Tv:
            case xv:
              ce = uc;
              break;
            case bv:
              ce = Yi;
              break;
            case "scroll":
              ce = nn;
              break;
            case "wheel":
              ce = Ii;
              break;
            case "copy":
            case "cut":
            case "paste":
              ce = rv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ce = lv;
          }
          var Se = (r & 4) !== 0, kn = !Se && n === "scroll", k = Se ? $ !== null ? $ + "Capture" : null : $;
          Se = [];
          for (var b = U, L; b !== null; ) {
            L = b;
            var W = L.stateNode;
            if (L.tag === 5 && W !== null && (L = W, k !== null && (W = wr(b, k), W != null && Se.push(oo(b, W, L)))), kn) break;
            b = b.return;
          }
          0 < Se.length && ($ = new ce($, me, null, l, Q), q.push({ event: $, listeners: Se }));
        }
      }
      if ((r & 7) === 0) {
        e: {
          if ($ = n === "mouseover" || n === "pointerover", ce = n === "mouseout" || n === "pointerout", $ && l !== en && (me = l.relatedTarget || l.fromElement) && (pu(me) || me[$i])) break e;
          if ((ce || $) && ($ = Q.window === Q ? Q : ($ = Q.ownerDocument) ? $.defaultView || $.parentWindow : window, ce ? (me = l.relatedTarget || l.toElement, ce = U, me = me ? pu(me) : null, me !== null && (kn = Ge(me), me !== kn || me.tag !== 5 && me.tag !== 6) && (me = null)) : (ce = null, me = U), ce !== me)) {
            if (Se = Cl, W = "onMouseLeave", k = "onMouseEnter", b = "mouse", (n === "pointerout" || n === "pointerover") && (Se = lv, W = "onPointerLeave", k = "onPointerEnter", b = "pointer"), kn = ce == null ? $ : ti(ce), L = me == null ? $ : ti(me), $ = new Se(W, b + "leave", ce, l, Q), $.target = kn, $.relatedTarget = L, W = null, pu(Q) === U && (Se = new Se(k, b + "enter", me, l, Q), Se.target = L, Se.relatedTarget = kn, W = Se), kn = W, ce && me) t: {
              for (Se = ce, k = me, b = 0, L = Se; L; L = Tl(L)) b++;
              for (L = 0, W = k; W; W = Tl(W)) L++;
              for (; 0 < b - L; ) Se = Tl(Se), b--;
              for (; 0 < L - b; ) k = Tl(k), L--;
              for (; b--; ) {
                if (Se === k || k !== null && Se === k.alternate) break t;
                Se = Tl(Se), k = Tl(k);
              }
              Se = null;
            }
            else Se = null;
            ce !== null && _v(q, $, ce, Se, !1), me !== null && kn !== null && _v(q, kn, me, Se, !0);
          }
        }
        e: {
          if ($ = U ? ti(U) : window, ce = $.nodeName && $.nodeName.toLowerCase(), ce === "select" || ce === "input" && $.type === "file") var ye = ty;
          else if (pv($)) if (hv) ye = Ev;
          else {
            ye = Sv;
            var Ne = ny;
          }
          else (ce = $.nodeName) && ce.toLowerCase() === "input" && ($.type === "checkbox" || $.type === "radio") && (ye = ry);
          if (ye && (ye = ye(n, U))) {
            rd(q, ye, l, Q);
            break e;
          }
          Ne && Ne(n, $, U), n === "focusout" && (Ne = $._wrapperState) && Ne.controlled && $.type === "number" && oa($, "number", $.value);
        }
        switch (Ne = U ? ti(U) : window, n) {
          case "focusin":
            (pv(Ne) || Ne.contentEditable === "true") && (lo = Ne, ld = U, ts = null);
            break;
          case "focusout":
            ts = ld = lo = null;
            break;
          case "mousedown":
            ud = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ud = !1, od(q, l, Q);
            break;
          case "selectionchange":
            if (iy) break;
          case "keydown":
          case "keyup":
            od(q, l, Q);
        }
        var Ue;
        if (ro) e: {
          switch (n) {
            case "compositionstart":
              var Ve = "onCompositionStart";
              break e;
            case "compositionend":
              Ve = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Ve = "onCompositionUpdate";
              break e;
          }
          Ve = void 0;
        }
        else ao ? cv(n, l) && (Ve = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Ve = "onCompositionStart");
        Ve && (ov && l.locale !== "ko" && (ao || Ve !== "onCompositionStart" ? Ve === "onCompositionEnd" && ao && (Ue = z()) : (Za = Q, h = "value" in Za ? Za.value : Za.textContent, ao = !0)), Ne = rs(U, Ve), 0 < Ne.length && (Ve = new Kf(Ve, n, null, l, Q), q.push({ event: Ve, listeners: Ne }), Ue ? Ve.data = Ue : (Ue = fv(l), Ue !== null && (Ve.data = Ue)))), (Ue = Ko ? dv(n, l) : Zm(n, l)) && (U = rs(U, "onBeforeInput"), 0 < U.length && (Q = new Kf("onBeforeInput", "beforeinput", null, l, Q), q.push({ event: Q, listeners: U }), Q.data = Ue));
      }
      fu(q, r);
    });
  }
  function oo(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function rs(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = wr(n, l), d != null && o.unshift(oo(n, d, c)), d = wr(n, r), d != null && o.push(oo(n, d, c))), n = n.return;
    }
    return o;
  }
  function Tl(n) {
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
      E.tag === 5 && U !== null && (E = U, c ? (T = wr(l, d), T != null && m.unshift(oo(l, T, E))) : c || (T = wr(l, d), T != null && m.push(oo(l, T, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var kv = /\r\n?/g, oy = /\u0000|\uFFFD/g;
  function Dv(n) {
    return (typeof n == "string" ? n : "" + n).replace(kv, `
`).replace(oy, "");
  }
  function Sc(n, r, l) {
    if (r = Dv(r), Dv(n) !== r && l) throw Error(M(425));
  }
  function xl() {
  }
  var as = null, du = null;
  function Ec(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Cc = typeof setTimeout == "function" ? setTimeout : void 0, pd = typeof clearTimeout == "function" ? clearTimeout : void 0, Ov = typeof Promise == "function" ? Promise : void 0, so = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ov < "u" ? function(n) {
    return Ov.resolve(null).then(n).catch(Rc);
  } : Cc;
  function Rc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function co(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (o === 0) {
          n.removeChild(c), Ja(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Ja(r);
  }
  function Si(n) {
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
  var bl = Math.random().toString(36).slice(2), Ei = "__reactFiber$" + bl, is = "__reactProps$" + bl, $i = "__reactContainer$" + bl, ls = "__reactEvents$" + bl, fo = "__reactListeners$" + bl, sy = "__reactHandles$" + bl;
  function pu(n) {
    var r = n[Ei];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[$i] || l[Ei]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Lv(n); n !== null; ) {
          if (l = n[Ei]) return l;
          n = Lv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function ke(n) {
    return n = n[Ei] || n[$i], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ti(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(M(33));
  }
  function mn(n) {
    return n[is] || null;
  }
  var Et = [], ka = -1;
  function Da(n) {
    return { current: n };
  }
  function rn(n) {
    0 > ka || (n.current = Et[ka], Et[ka] = null, ka--);
  }
  function we(n, r) {
    ka++, Et[ka] = n.current, n.current = r;
  }
  var Cr = {}, En = Da(Cr), $n = Da(!1), Wr = Cr;
  function Gr(n, r) {
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
  function po() {
    rn($n), rn(En);
  }
  function Mv(n, r, l) {
    if (En.current !== Cr) throw Error(M(168));
    we(En, r), we($n, l);
  }
  function us(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(M(108, Ke(n) || "Unknown", c));
    return ne({}, l, o);
  }
  function Kn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Cr, Wr = En.current, we(En, n), we($n, $n.current), !0;
  }
  function Tc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(M(169));
    l ? (n = us(n, r, Wr), o.__reactInternalMemoizedMergedChildContext = n, rn($n), rn(En), we(En, n)) : rn($n), we($n, l);
  }
  var Ci = null, vo = !1, Qi = !1;
  function xc(n) {
    Ci === null ? Ci = [n] : Ci.push(n);
  }
  function wl(n) {
    vo = !0, xc(n);
  }
  function Ri() {
    if (!Qi && Ci !== null) {
      Qi = !0;
      var n = 0, r = Ot;
      try {
        var l = Ci;
        for (Ot = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ci = null, vo = !1;
      } catch (c) {
        throw Ci !== null && (Ci = Ci.slice(n + 1)), on(qa, Ri), c;
      } finally {
        Ot = r, Qi = !1;
      }
    }
    return null;
  }
  var _l = [], kl = 0, Dl = null, Wi = 0, zn = [], Oa = 0, da = null, Ti = 1, xi = "";
  function vu(n, r) {
    _l[kl++] = Wi, _l[kl++] = Dl, Dl = n, Wi = r;
  }
  function Nv(n, r, l) {
    zn[Oa++] = Ti, zn[Oa++] = xi, zn[Oa++] = da, da = n;
    var o = Ti;
    n = xi;
    var c = 32 - kr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - kr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, Ti = 1 << 32 - kr(r) + c | l << c | o, xi = d + n;
    } else Ti = 1 << d | l << c | o, xi = n;
  }
  function bc(n) {
    n.return !== null && (vu(n, 1), Nv(n, 1, 0));
  }
  function wc(n) {
    for (; n === Dl; ) Dl = _l[--kl], _l[kl] = null, Wi = _l[--kl], _l[kl] = null;
    for (; n === da; ) da = zn[--Oa], zn[Oa] = null, xi = zn[--Oa], zn[Oa] = null, Ti = zn[--Oa], zn[Oa] = null;
  }
  var qr = null, Xr = null, dn = !1, La = null;
  function vd(n, r) {
    var l = Aa(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function zv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, qr = n, Xr = Si(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, qr = n, Xr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = da !== null ? { id: Ti, overflow: xi } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Aa(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, qr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function hd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function md(n) {
    if (dn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!zv(n, r)) {
          if (hd(n)) throw Error(M(418));
          r = Si(l.nextSibling);
          var o = qr;
          r && zv(n, r) ? vd(o, l) : (n.flags = n.flags & -4097 | 2, dn = !1, qr = n);
        }
      } else {
        if (hd(n)) throw Error(M(418));
        n.flags = n.flags & -4097 | 2, dn = !1, qr = n;
      }
    }
  }
  function Qn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    qr = n;
  }
  function _c(n) {
    if (n !== qr) return !1;
    if (!dn) return Qn(n), dn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Ec(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (hd(n)) throw os(), Error(M(418));
      for (; r; ) vd(n, r), r = Si(r.nextSibling);
    }
    if (Qn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(M(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Xr = Si(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Xr = null;
      }
    } else Xr = qr ? Si(n.stateNode.nextSibling) : null;
    return !0;
  }
  function os() {
    for (var n = Xr; n; ) n = Si(n.nextSibling);
  }
  function Ol() {
    Xr = qr = null, dn = !1;
  }
  function Gi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var cy = vt.ReactCurrentBatchConfig;
  function hu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(M(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(M(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(M(284));
      if (!l._owner) throw Error(M(290, n));
    }
    return n;
  }
  function kc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(M(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Uv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function mu(n) {
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
      return k = Fl(k, b), k.index = 0, k.sibling = null, k;
    }
    function d(k, b, L) {
      return k.index = L, n ? (L = k.alternate, L !== null ? (L = L.index, L < b ? (k.flags |= 2, b) : L) : (k.flags |= 2, b)) : (k.flags |= 1048576, b);
    }
    function m(k) {
      return n && k.alternate === null && (k.flags |= 2), k;
    }
    function E(k, b, L, W) {
      return b === null || b.tag !== 6 ? (b = Wd(L, k.mode, W), b.return = k, b) : (b = c(b, L), b.return = k, b);
    }
    function T(k, b, L, W) {
      var ye = L.type;
      return ye === Fe ? Q(k, b, L.props.children, W, L.key) : b !== null && (b.elementType === ye || typeof ye == "object" && ye !== null && ye.$$typeof === Dt && Uv(ye) === b.type) ? (W = c(b, L.props), W.ref = hu(k, b, L), W.return = k, W) : (W = Fs(L.type, L.key, L.props, null, k.mode, W), W.ref = hu(k, b, L), W.return = k, W);
    }
    function U(k, b, L, W) {
      return b === null || b.tag !== 4 || b.stateNode.containerInfo !== L.containerInfo || b.stateNode.implementation !== L.implementation ? (b = of(L, k.mode, W), b.return = k, b) : (b = c(b, L.children || []), b.return = k, b);
    }
    function Q(k, b, L, W, ye) {
      return b === null || b.tag !== 7 ? (b = el(L, k.mode, W, ye), b.return = k, b) : (b = c(b, L), b.return = k, b);
    }
    function q(k, b, L) {
      if (typeof b == "string" && b !== "" || typeof b == "number") return b = Wd("" + b, k.mode, L), b.return = k, b;
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case _e:
            return L = Fs(b.type, b.key, b.props, null, k.mode, L), L.ref = hu(k, null, b), L.return = k, L;
          case ut:
            return b = of(b, k.mode, L), b.return = k, b;
          case Dt:
            var W = b._init;
            return q(k, W(b._payload), L);
        }
        if (qn(b) || Te(b)) return b = el(b, k.mode, L, null), b.return = k, b;
        kc(k, b);
      }
      return null;
    }
    function $(k, b, L, W) {
      var ye = b !== null ? b.key : null;
      if (typeof L == "string" && L !== "" || typeof L == "number") return ye !== null ? null : E(k, b, "" + L, W);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case _e:
            return L.key === ye ? T(k, b, L, W) : null;
          case ut:
            return L.key === ye ? U(k, b, L, W) : null;
          case Dt:
            return ye = L._init, $(
              k,
              b,
              ye(L._payload),
              W
            );
        }
        if (qn(L) || Te(L)) return ye !== null ? null : Q(k, b, L, W, null);
        kc(k, L);
      }
      return null;
    }
    function ce(k, b, L, W, ye) {
      if (typeof W == "string" && W !== "" || typeof W == "number") return k = k.get(L) || null, E(b, k, "" + W, ye);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case _e:
            return k = k.get(W.key === null ? L : W.key) || null, T(b, k, W, ye);
          case ut:
            return k = k.get(W.key === null ? L : W.key) || null, U(b, k, W, ye);
          case Dt:
            var Ne = W._init;
            return ce(k, b, L, Ne(W._payload), ye);
        }
        if (qn(W) || Te(W)) return k = k.get(L) || null, Q(b, k, W, ye, null);
        kc(b, W);
      }
      return null;
    }
    function me(k, b, L, W) {
      for (var ye = null, Ne = null, Ue = b, Ve = b = 0, er = null; Ue !== null && Ve < L.length; Ve++) {
        Ue.index > Ve ? (er = Ue, Ue = null) : er = Ue.sibling;
        var Nt = $(k, Ue, L[Ve], W);
        if (Nt === null) {
          Ue === null && (Ue = er);
          break;
        }
        n && Ue && Nt.alternate === null && r(k, Ue), b = d(Nt, b, Ve), Ne === null ? ye = Nt : Ne.sibling = Nt, Ne = Nt, Ue = er;
      }
      if (Ve === L.length) return l(k, Ue), dn && vu(k, Ve), ye;
      if (Ue === null) {
        for (; Ve < L.length; Ve++) Ue = q(k, L[Ve], W), Ue !== null && (b = d(Ue, b, Ve), Ne === null ? ye = Ue : Ne.sibling = Ue, Ne = Ue);
        return dn && vu(k, Ve), ye;
      }
      for (Ue = o(k, Ue); Ve < L.length; Ve++) er = ce(Ue, k, Ve, L[Ve], W), er !== null && (n && er.alternate !== null && Ue.delete(er.key === null ? Ve : er.key), b = d(er, b, Ve), Ne === null ? ye = er : Ne.sibling = er, Ne = er);
      return n && Ue.forEach(function(Vl) {
        return r(k, Vl);
      }), dn && vu(k, Ve), ye;
    }
    function Se(k, b, L, W) {
      var ye = Te(L);
      if (typeof ye != "function") throw Error(M(150));
      if (L = ye.call(L), L == null) throw Error(M(151));
      for (var Ne = ye = null, Ue = b, Ve = b = 0, er = null, Nt = L.next(); Ue !== null && !Nt.done; Ve++, Nt = L.next()) {
        Ue.index > Ve ? (er = Ue, Ue = null) : er = Ue.sibling;
        var Vl = $(k, Ue, Nt.value, W);
        if (Vl === null) {
          Ue === null && (Ue = er);
          break;
        }
        n && Ue && Vl.alternate === null && r(k, Ue), b = d(Vl, b, Ve), Ne === null ? ye = Vl : Ne.sibling = Vl, Ne = Vl, Ue = er;
      }
      if (Nt.done) return l(
        k,
        Ue
      ), dn && vu(k, Ve), ye;
      if (Ue === null) {
        for (; !Nt.done; Ve++, Nt = L.next()) Nt = q(k, Nt.value, W), Nt !== null && (b = d(Nt, b, Ve), Ne === null ? ye = Nt : Ne.sibling = Nt, Ne = Nt);
        return dn && vu(k, Ve), ye;
      }
      for (Ue = o(k, Ue); !Nt.done; Ve++, Nt = L.next()) Nt = ce(Ue, k, Ve, Nt.value, W), Nt !== null && (n && Nt.alternate !== null && Ue.delete(Nt.key === null ? Ve : Nt.key), b = d(Nt, b, Ve), Ne === null ? ye = Nt : Ne.sibling = Nt, Ne = Nt);
      return n && Ue.forEach(function(yh) {
        return r(k, yh);
      }), dn && vu(k, Ve), ye;
    }
    function kn(k, b, L, W) {
      if (typeof L == "object" && L !== null && L.type === Fe && L.key === null && (L = L.props.children), typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case _e:
            e: {
              for (var ye = L.key, Ne = b; Ne !== null; ) {
                if (Ne.key === ye) {
                  if (ye = L.type, ye === Fe) {
                    if (Ne.tag === 7) {
                      l(k, Ne.sibling), b = c(Ne, L.props.children), b.return = k, k = b;
                      break e;
                    }
                  } else if (Ne.elementType === ye || typeof ye == "object" && ye !== null && ye.$$typeof === Dt && Uv(ye) === Ne.type) {
                    l(k, Ne.sibling), b = c(Ne, L.props), b.ref = hu(k, Ne, L), b.return = k, k = b;
                    break e;
                  }
                  l(k, Ne);
                  break;
                } else r(k, Ne);
                Ne = Ne.sibling;
              }
              L.type === Fe ? (b = el(L.props.children, k.mode, W, L.key), b.return = k, k = b) : (W = Fs(L.type, L.key, L.props, null, k.mode, W), W.ref = hu(k, b, L), W.return = k, k = W);
            }
            return m(k);
          case ut:
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
              b = of(L, k.mode, W), b.return = k, k = b;
            }
            return m(k);
          case Dt:
            return Ne = L._init, kn(k, b, Ne(L._payload), W);
        }
        if (qn(L)) return me(k, b, L, W);
        if (Te(L)) return Se(k, b, L, W);
        kc(k, L);
      }
      return typeof L == "string" && L !== "" || typeof L == "number" ? (L = "" + L, b !== null && b.tag === 6 ? (l(k, b.sibling), b = c(b, L), b.return = k, k = b) : (l(k, b), b = Wd(L, k.mode, W), b.return = k, k = b), m(k)) : l(k, b);
    }
    return kn;
  }
  var xn = mu(!0), ie = mu(!1), pa = Da(null), Kr = null, ho = null, yd = null;
  function gd() {
    yd = ho = Kr = null;
  }
  function Sd(n) {
    var r = pa.current;
    rn(pa), n._currentValue = r;
  }
  function Ed(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function yn(n, r) {
    Kr = n, yd = ho = null, n = n.dependencies, n !== null && n.firstContext !== null && ((n.lanes & r) !== 0 && (An = !0), n.firstContext = null);
  }
  function Ma(n) {
    var r = n._currentValue;
    if (yd !== n) if (n = { context: n, memoizedValue: r, next: null }, ho === null) {
      if (Kr === null) throw Error(M(308));
      ho = n, Kr.dependencies = { lanes: 0, firstContext: n };
    } else ho = ho.next = n;
    return r;
  }
  var yu = null;
  function Cd(n) {
    yu === null ? yu = [n] : yu.push(n);
  }
  function Rd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Cd(r)) : (l.next = c.next, c.next = l), r.interleaved = l, va(n, o);
  }
  function va(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ha = !1;
  function Td(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Av(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function qi(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (Ct & 2) !== 0) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, va(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Cd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, va(n, l);
  }
  function Dc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Pi(n, l);
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
  function ss(n, r, l, o) {
    var c = n.updateQueue;
    ha = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, E = c.shared.pending;
    if (E !== null) {
      c.shared.pending = null;
      var T = E, U = T.next;
      T.next = null, m === null ? d = U : m.next = U, m = T;
      var Q = n.alternate;
      Q !== null && (Q = Q.updateQueue, E = Q.lastBaseUpdate, E !== m && (E === null ? Q.firstBaseUpdate = U : E.next = U, Q.lastBaseUpdate = T));
    }
    if (d !== null) {
      var q = c.baseState;
      m = 0, Q = U = T = null, E = d;
      do {
        var $ = E.lane, ce = E.eventTime;
        if ((o & $) === $) {
          Q !== null && (Q = Q.next = {
            eventTime: ce,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var me = n, Se = E;
            switch ($ = r, ce = l, Se.tag) {
              case 1:
                if (me = Se.payload, typeof me == "function") {
                  q = me.call(ce, q, $);
                  break e;
                }
                q = me;
                break e;
              case 3:
                me.flags = me.flags & -65537 | 128;
              case 0:
                if (me = Se.payload, $ = typeof me == "function" ? me.call(ce, q, $) : me, $ == null) break e;
                q = ne({}, q, $);
                break e;
              case 2:
                ha = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, $ = c.effects, $ === null ? c.effects = [E] : $.push(E));
        } else ce = { eventTime: ce, lane: $, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, Q === null ? (U = Q = ce, T = q) : Q = Q.next = ce, m |= $;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null) break;
          $ = E, E = $.next, $.next = null, c.lastBaseUpdate = $, c.shared.pending = null;
        }
      } while (!0);
      if (Q === null && (T = q), c.baseState = T, c.firstBaseUpdate = U, c.lastBaseUpdate = Q, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Di |= m, n.lanes = m, n.memoizedState = q;
    }
  }
  function xd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(M(191, c));
        c.call(o);
      }
    }
  }
  var cs = {}, bi = Da(cs), fs = Da(cs), ds = Da(cs);
  function gu(n) {
    if (n === cs) throw Error(M(174));
    return n;
  }
  function bd(n, r) {
    switch (we(ds, r), we(fs, n), we(bi, cs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : sa(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = sa(r, n);
    }
    rn(bi), we(bi, r);
  }
  function Su() {
    rn(bi), rn(fs), rn(ds);
  }
  function Fv(n) {
    gu(ds.current);
    var r = gu(bi.current), l = sa(r, n.type);
    r !== l && (we(fs, n), we(bi, l));
  }
  function Oc(n) {
    fs.current === n && (rn(bi), rn(fs));
  }
  var gn = Da(0);
  function Lc(n) {
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
  var ps = [];
  function De() {
    for (var n = 0; n < ps.length; n++) ps[n]._workInProgressVersionPrimary = null;
    ps.length = 0;
  }
  var lt = vt.ReactCurrentDispatcher, Lt = vt.ReactCurrentBatchConfig, Gt = 0, Mt = null, Un = null, Jn = null, Mc = !1, vs = !1, Eu = 0, I = 0;
  function kt() {
    throw Error(M(321));
  }
  function je(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ei(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, o, c, d) {
    if (Gt = d, Mt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, lt.current = n === null || n.memoizedState === null ? Wc : Es, n = l(o, c), vs) {
      d = 0;
      do {
        if (vs = !1, Eu = 0, 25 <= d) throw Error(M(301));
        d += 1, Jn = Un = null, r.updateQueue = null, lt.current = Gc, n = l(o, c);
      } while (vs);
    }
    if (lt.current = bu, r = Un !== null && Un.next !== null, Gt = 0, Jn = Un = Mt = null, Mc = !1, r) throw Error(M(300));
    return n;
  }
  function ni() {
    var n = Eu !== 0;
    return Eu = 0, n;
  }
  function Rr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Jn === null ? Mt.memoizedState = Jn = n : Jn = Jn.next = n, Jn;
  }
  function bn() {
    if (Un === null) {
      var n = Mt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Un.next;
    var r = Jn === null ? Mt.memoizedState : Jn.next;
    if (r !== null) Jn = r, Un = n;
    else {
      if (n === null) throw Error(M(310));
      Un = n, n = { memoizedState: Un.memoizedState, baseState: Un.baseState, baseQueue: Un.baseQueue, queue: Un.queue, next: null }, Jn === null ? Mt.memoizedState = Jn = n : Jn = Jn.next = n;
    }
    return Jn;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Nl(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(M(311));
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
        var Q = U.lane;
        if ((Gt & Q) === Q) T !== null && (T = T.next = { lane: 0, action: U.action, hasEagerState: U.hasEagerState, eagerState: U.eagerState, next: null }), o = U.hasEagerState ? U.eagerState : n(o, U.action);
        else {
          var q = {
            lane: Q,
            action: U.action,
            hasEagerState: U.hasEagerState,
            eagerState: U.eagerState,
            next: null
          };
          T === null ? (E = T = q, m = o) : T = T.next = q, Mt.lanes |= Q, Di |= Q;
        }
        U = U.next;
      } while (U !== null && U !== d);
      T === null ? m = o : T.next = E, ei(o, r.memoizedState) || (An = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Mt.lanes |= d, Di |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Cu(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(M(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ei(d, r.memoizedState) || (An = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function Nc() {
  }
  function zc(n, r) {
    var l = Mt, o = bn(), c = r(), d = !ei(o.memoizedState, c);
    if (d && (o.memoizedState = c, An = !0), o = o.queue, hs(jc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Jn !== null && Jn.memoizedState.tag & 1) {
      if (l.flags |= 2048, Ru(9, Ac.bind(null, l, o, c, r), void 0, null), Wn === null) throw Error(M(349));
      (Gt & 30) !== 0 || Uc(l, r, c);
    }
    return c;
  }
  function Uc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Mt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Mt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Ac(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Fc(r) && Hc(n);
  }
  function jc(n, r, l) {
    return l(function() {
      Fc(r) && Hc(n);
    });
  }
  function Fc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ei(n, l);
    } catch {
      return !0;
    }
  }
  function Hc(n) {
    var r = va(n, 1);
    r !== null && zr(r, n, 1, -1);
  }
  function Pc(n) {
    var r = Rr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = xu.bind(null, Mt, n), [r.memoizedState, n];
  }
  function Ru(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Mt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Mt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Vc() {
    return bn().memoizedState;
  }
  function mo(n, r, l, o) {
    var c = Rr();
    Mt.flags |= n, c.memoizedState = Ru(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function yo(n, r, l, o) {
    var c = bn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Un !== null) {
      var m = Un.memoizedState;
      if (d = m.destroy, o !== null && je(o, m.deps)) {
        c.memoizedState = Ru(r, l, d, o);
        return;
      }
    }
    Mt.flags |= n, c.memoizedState = Ru(1 | r, l, d, o);
  }
  function Bc(n, r) {
    return mo(8390656, 8, n, r);
  }
  function hs(n, r) {
    return yo(2048, 8, n, r);
  }
  function Yc(n, r) {
    return yo(4, 2, n, r);
  }
  function ms(n, r) {
    return yo(4, 4, n, r);
  }
  function Tu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Ic(n, r, l) {
    return l = l != null ? l.concat([n]) : null, yo(4, 4, Tu.bind(null, r, n), l);
  }
  function ys() {
  }
  function $c(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && je(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Qc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && je(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function wd(n, r, l) {
    return (Gt & 21) === 0 ? (n.baseState && (n.baseState = !1, An = !0), n.memoizedState = l) : (ei(l, r) || (l = qu(), Mt.lanes |= l, Di |= l, n.baseState = !0), r);
  }
  function gs(n, r) {
    var l = Ot;
    Ot = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Lt.transition;
    Lt.transition = {};
    try {
      n(!1), r();
    } finally {
      Ot = l, Lt.transition = o;
    }
  }
  function _d() {
    return bn().memoizedState;
  }
  function Ss(n, r, l) {
    var o = Oi(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Jr(n)) Hv(r, l);
    else if (l = Rd(n, r, l, o), l !== null) {
      var c = Hn();
      zr(l, n, o, c), Kt(l, r, o);
    }
  }
  function xu(n, r, l) {
    var o = Oi(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Jr(n)) Hv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, E = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = E, ei(E, m)) {
          var T = r.interleaved;
          T === null ? (c.next = c, Cd(r)) : (c.next = T.next, T.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Rd(n, r, c, o), l !== null && (c = Hn(), zr(l, n, o, c), Kt(l, r, o));
    }
  }
  function Jr(n) {
    var r = n.alternate;
    return n === Mt || r !== null && r === Mt;
  }
  function Hv(n, r) {
    vs = Mc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function Kt(n, r, l) {
    if ((l & 4194240) !== 0) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Pi(n, l);
    }
  }
  var bu = { readContext: Ma, useCallback: kt, useContext: kt, useEffect: kt, useImperativeHandle: kt, useInsertionEffect: kt, useLayoutEffect: kt, useMemo: kt, useReducer: kt, useRef: kt, useState: kt, useDebugValue: kt, useDeferredValue: kt, useTransition: kt, useMutableSource: kt, useSyncExternalStore: kt, useId: kt, unstable_isNewReconciler: !1 }, Wc = { readContext: Ma, useCallback: function(n, r) {
    return Rr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ma, useEffect: Bc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, mo(
      4194308,
      4,
      Tu.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return mo(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return mo(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Rr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Rr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Ss.bind(null, Mt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Rr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Pc, useDebugValue: ys, useDeferredValue: function(n) {
    return Rr().memoizedState = n;
  }, useTransition: function() {
    var n = Pc(!1), r = n[0];
    return n = gs.bind(null, n[1]), Rr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Mt, c = Rr();
    if (dn) {
      if (l === void 0) throw Error(M(407));
      l = l();
    } else {
      if (l = r(), Wn === null) throw Error(M(349));
      (Gt & 30) !== 0 || Uc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Bc(jc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, Ru(9, Ac.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Rr(), r = Wn.identifierPrefix;
    if (dn) {
      var l = xi, o = Ti;
      l = (o & ~(1 << 32 - kr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Eu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = I++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Es = {
    readContext: Ma,
    useCallback: $c,
    useContext: Ma,
    useEffect: hs,
    useImperativeHandle: Ic,
    useInsertionEffect: Yc,
    useLayoutEffect: ms,
    useMemo: Qc,
    useReducer: Nl,
    useRef: Vc,
    useState: function() {
      return Nl(Xi);
    },
    useDebugValue: ys,
    useDeferredValue: function(n) {
      var r = bn();
      return wd(r, Un.memoizedState, n);
    },
    useTransition: function() {
      var n = Nl(Xi)[0], r = bn().memoizedState;
      return [n, r];
    },
    useMutableSource: Nc,
    useSyncExternalStore: zc,
    useId: _d,
    unstable_isNewReconciler: !1
  }, Gc = { readContext: Ma, useCallback: $c, useContext: Ma, useEffect: hs, useImperativeHandle: Ic, useInsertionEffect: Yc, useLayoutEffect: ms, useMemo: Qc, useReducer: Cu, useRef: Vc, useState: function() {
    return Cu(Xi);
  }, useDebugValue: ys, useDeferredValue: function(n) {
    var r = bn();
    return Un === null ? r.memoizedState = n : wd(r, Un.memoizedState, n);
  }, useTransition: function() {
    var n = Cu(Xi)[0], r = bn().memoizedState;
    return [n, r];
  }, useMutableSource: Nc, useSyncExternalStore: zc, useId: _d, unstable_isNewReconciler: !1 };
  function ri(n, r) {
    if (n && n.defaultProps) {
      r = ne({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function kd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : ne({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var qc = { isMounted: function(n) {
    return (n = n._reactInternals) ? Ge(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Oi(n), d = qi(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Dc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Hn(), c = Oi(n), d = qi(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Dc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Hn(), o = Oi(n), c = qi(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (zr(r, n, o, l), Dc(r, n, o));
  } };
  function Pv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !Zo(l, o) || !Zo(c, d) : !0;
  }
  function Xc(n, r, l) {
    var o = !1, c = Cr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ma(d) : (c = Nn(r) ? Wr : En.current, o = r.contextTypes, d = (o = o != null) ? Gr(n, c) : Cr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = qc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Vv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && qc.enqueueReplaceState(r, r.state, null);
  }
  function Cs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, Td(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ma(d) : (d = Nn(r) ? Wr : En.current, c.context = Gr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (kd(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && qc.enqueueReplaceState(c, c.state, null), ss(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function wu(n, r) {
    try {
      var l = "", o = r;
      do
        l += rt(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Dd(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Od(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var Kc = typeof WeakMap == "function" ? WeakMap : Map;
  function Bv(n, r, l) {
    l = qi(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      To || (To = !0, Du = o), Od(n, r);
    }, l;
  }
  function Ld(n, r, l) {
    l = qi(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Od(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Od(n, r), typeof o != "function" && (Al === null ? Al = /* @__PURE__ */ new Set([this]) : Al.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Md(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new Kc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = yy.bind(null, n, r, l), r.then(n, n));
  }
  function Yv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function zl(n, r, l, o, c) {
    return (n.mode & 1) === 0 ? (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = qi(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n) : (n.flags |= 65536, n.lanes = c, n);
  }
  var Rs = vt.ReactCurrentOwner, An = !1;
  function ur(n, r, l, o) {
    r.child = n === null ? ie(r, null, l, o) : xn(r, n.child, l, o);
  }
  function Zr(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return yn(r, c), o = Ml(n, r, l, o, d, c), l = ni(), n !== null && !An ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (dn && l && bc(r), r.flags |= 1, ur(n, r, o, c), r.child);
  }
  function _u(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Qd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, Xe(n, r, d, o, c)) : (n = Fs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, (n.lanes & c) === 0) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Zo, l(m, o) && n.ref === r.ref) return za(n, r, c);
    }
    return r.flags |= 1, n = Fl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function Xe(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (Zo(d, o) && n.ref === r.ref) if (An = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) (n.flags & 131072) !== 0 && (An = !0);
      else return r.lanes = n.lanes, za(n, r, c);
    }
    return Iv(n, r, l, o, c);
  }
  function Ts(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if ((r.mode & 1) === 0) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, we(Eo, ma), ma |= l;
    else {
      if ((l & 1073741824) === 0) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, we(Eo, ma), ma |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, we(Eo, ma), ma |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, we(Eo, ma), ma |= o;
    return ur(n, r, c, l), r.child;
  }
  function Nd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Iv(n, r, l, o, c) {
    var d = Nn(l) ? Wr : En.current;
    return d = Gr(r, d), yn(r, c), l = Ml(n, r, l, o, d, c), o = ni(), n !== null && !An ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (dn && o && bc(r), r.flags |= 1, ur(n, r, l, c), r.child);
  }
  function $v(n, r, l, o, c) {
    if (Nn(l)) {
      var d = !0;
      Kn(r);
    } else d = !1;
    if (yn(r, c), r.stateNode === null) Na(n, r), Xc(r, l, o), Cs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, E = r.memoizedProps;
      m.props = E;
      var T = m.context, U = l.contextType;
      typeof U == "object" && U !== null ? U = Ma(U) : (U = Nn(l) ? Wr : En.current, U = Gr(r, U));
      var Q = l.getDerivedStateFromProps, q = typeof Q == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      q || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || T !== U) && Vv(r, m, o, U), ha = !1;
      var $ = r.memoizedState;
      m.state = $, ss(r, o, m, c), T = r.memoizedState, E !== o || $ !== T || $n.current || ha ? (typeof Q == "function" && (kd(r, l, Q, o), T = r.memoizedState), (E = ha || Pv(r, l, E, o, $, T, U)) ? (q || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = U, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Av(n, r), E = r.memoizedProps, U = r.type === r.elementType ? E : ri(r.type, E), m.props = U, q = r.pendingProps, $ = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = Ma(T) : (T = Nn(l) ? Wr : En.current, T = Gr(r, T));
      var ce = l.getDerivedStateFromProps;
      (Q = typeof ce == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== q || $ !== T) && Vv(r, m, o, T), ha = !1, $ = r.memoizedState, m.state = $, ss(r, o, m, c);
      var me = r.memoizedState;
      E !== q || $ !== me || $n.current || ha ? (typeof ce == "function" && (kd(r, l, ce, o), me = r.memoizedState), (U = ha || Pv(r, l, U, o, $, me, T) || !1) ? (Q || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, me, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, me, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = me), m.props = o, m.state = me, m.context = T, o = U) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && $ === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return xs(n, r, l, o, d, c);
  }
  function xs(n, r, l, o, c, d) {
    Nd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && Tc(r, l, !1), za(n, r, d);
    o = r.stateNode, Rs.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = xn(r, n.child, null, d), r.child = xn(r, null, E, d)) : ur(n, r, E, d), r.memoizedState = o.state, c && Tc(r, l, !0), r.child;
  }
  function go(n) {
    var r = n.stateNode;
    r.pendingContext ? Mv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Mv(n, r.context, !1), bd(n, r.containerInfo);
  }
  function Qv(n, r, l, o, c) {
    return Ol(), Gi(c), r.flags |= 256, ur(n, r, l, o), r.child;
  }
  var Jc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function zd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function Zc(n, r, l) {
    var o = r.pendingProps, c = gn.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), we(gn, c & 1), n === null)
      return md(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? ((r.mode & 1) === 0 ? r.lanes = 1 : n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, (o & 1) === 0 && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Hl(m, o, 0, null), n = el(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = zd(l), r.memoizedState = Jc, n) : Ud(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null)) return Wv(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return (m & 1) === 0 && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Fl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Fl(E, d) : (d = el(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? zd(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = Jc, o;
    }
    return d = n.child, n = d.sibling, o = Fl(d, { mode: "visible", children: o.children }), (r.mode & 1) === 0 && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Ud(n, r) {
    return r = Hl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function bs(n, r, l, o) {
    return o !== null && Gi(o), xn(r, n.child, null, l), n = Ud(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Wv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Dd(Error(M(422))), bs(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Hl({ mode: "visible", children: o.children }, c, 0, null), d = el(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, (r.mode & 1) !== 0 && xn(r, n.child, null, m), r.child.memoizedState = zd(m), r.memoizedState = Jc, d);
    if ((r.mode & 1) === 0) return bs(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var E = o.dgst;
      return o = E, d = Error(M(419)), o = Dd(d, o, void 0), bs(n, r, m, o);
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
        c = (c & (o.suspendedLanes | m)) !== 0 ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, va(n, c), zr(o, n, c, -1));
      }
      return $d(), o = Dd(Error(M(421))), bs(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = gy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Si(c.nextSibling), qr = r, dn = !0, La = null, n !== null && (zn[Oa++] = Ti, zn[Oa++] = xi, zn[Oa++] = da, Ti = n.id, xi = n.overflow, da = r), r = Ud(r, o.children), r.flags |= 4096, r);
  }
  function Ad(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Ed(n.return, r, l);
  }
  function Lr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function wi(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (ur(n, r, o.children, l), o = gn.current, (o & 2) !== 0) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && (n.flags & 128) !== 0) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Ad(n, l, r);
        else if (n.tag === 19) Ad(n, l, r);
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
    if (we(gn, o), (r.mode & 1) === 0) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Lc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Lr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Lc(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Lr(r, !0, l, null, d);
        break;
      case "together":
        Lr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Na(n, r) {
    (r.mode & 1) === 0 && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function za(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Di |= r.lanes, (l & r.childLanes) === 0) return null;
    if (n !== null && r.child !== n.child) throw Error(M(153));
    if (r.child !== null) {
      for (n = r.child, l = Fl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Fl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function ws(n, r, l) {
    switch (r.tag) {
      case 3:
        go(r), Ol();
        break;
      case 5:
        Fv(r);
        break;
      case 1:
        Nn(r.type) && Kn(r);
        break;
      case 4:
        bd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        we(pa, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (we(gn, gn.current & 1), r.flags |= 128, null) : (l & r.child.childLanes) !== 0 ? Zc(n, r, l) : (we(gn, gn.current & 1), n = za(n, r, l), n !== null ? n.sibling : null);
        we(gn, gn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, (n.flags & 128) !== 0) {
          if (o) return wi(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), we(gn, gn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Ts(n, r, l);
    }
    return za(n, r, l);
  }
  var Ua, jn, Gv, qv;
  Ua = function(n, r) {
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
      n = r.stateNode, gu(bi.current);
      var d = null;
      switch (l) {
        case "input":
          c = nr(n, c), o = nr(n, o), d = [];
          break;
        case "select":
          c = ne({}, c, { value: void 0 }), o = ne({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Yn(n, c), o = Yn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = xl);
      }
      un(l, o);
      var m;
      l = null;
      for (U in c) if (!o.hasOwnProperty(U) && c.hasOwnProperty(U) && c[U] != null) if (U === "style") {
        var E = c[U];
        for (m in E) E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else U !== "dangerouslySetInnerHTML" && U !== "children" && U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && U !== "autoFocus" && (ft.hasOwnProperty(U) ? d || (d = []) : (d = d || []).push(U, null));
      for (U in o) {
        var T = o[U];
        if (E = c != null ? c[U] : void 0, o.hasOwnProperty(U) && T !== E && (T != null || E != null)) if (U === "style") if (E) {
          for (m in E) !E.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && E[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          U,
          l
        )), l = T;
        else U === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, E = E ? E.__html : void 0, T != null && E !== T && (d = d || []).push(U, T)) : U === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(U, "" + T) : U !== "suppressContentEditableWarning" && U !== "suppressHydrationWarning" && (ft.hasOwnProperty(U) ? (T != null && U === "onScroll" && Ht("scroll", n), d || E === T || (d = [])) : (d = d || []).push(U, T));
      }
      l && (d = d || []).push("style", l);
      var U = d;
      (r.updateQueue = U) && (r.flags |= 4);
    }
  }, qv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function _s(n, r) {
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
  function Xv(n, r, l) {
    var o = r.pendingProps;
    switch (wc(r), r.tag) {
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
        return Nn(r.type) && po(), Zn(r), null;
      case 3:
        return o = r.stateNode, Su(), rn($n), rn(En), De(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (_c(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && (r.flags & 256) === 0 || (r.flags |= 1024, La !== null && (Ou(La), La = null))), jn(n, r), Zn(r), null;
      case 5:
        Oc(r);
        var c = gu(ds.current);
        if (l = r.type, n !== null && r.stateNode != null) Gv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(M(166));
            return Zn(r), null;
          }
          if (n = gu(bi.current), _c(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ei] = r, o[is] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Ht("cancel", o), Ht("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ht("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < ns.length; c++) Ht(ns[c], o);
                break;
              case "source":
                Ht("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Ht(
                  "error",
                  o
                ), Ht("load", o);
                break;
              case "details":
                Ht("toggle", o);
                break;
              case "input":
                Vn(o, d), Ht("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Ht("invalid", o);
                break;
              case "textarea":
                gr(o, d), Ht("invalid", o);
            }
            un(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var E = d[m];
              m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && Sc(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && Sc(
                o.textContent,
                E,
                n
              ), c = ["children", "" + E]) : ft.hasOwnProperty(m) && E != null && m === "onScroll" && Ht("scroll", o);
            }
            switch (l) {
              case "input":
                On(o), si(o, d, !0);
                break;
              case "textarea":
                On(o), Ln(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = xl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Sr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ei] = r, n[is] = o, Ua(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Xn(l, o), l) {
                case "dialog":
                  Ht("cancel", n), Ht("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ht("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < ns.length; c++) Ht(ns[c], n);
                  c = o;
                  break;
                case "source":
                  Ht("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Ht(
                    "error",
                    n
                  ), Ht("load", n), c = o;
                  break;
                case "details":
                  Ht("toggle", n), c = o;
                  break;
                case "input":
                  Vn(n, o), c = nr(n, o), Ht("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = ne({}, o, { value: void 0 }), Ht("invalid", n);
                  break;
                case "textarea":
                  gr(n, o), c = Yn(n, o), Ht("invalid", n);
                  break;
                default:
                  c = o;
              }
              un(l, c), E = c;
              for (d in E) if (E.hasOwnProperty(d)) {
                var T = E[d];
                d === "style" ? Zt(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && ci(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && ee(n, T) : typeof T == "number" && ee(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (ft.hasOwnProperty(d) ? T != null && d === "onScroll" && Ht("scroll", n) : T != null && Qe(n, d, T, m));
              }
              switch (l) {
                case "input":
                  On(n), si(n, o, !1);
                  break;
                case "textarea":
                  On(n), Ln(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + et(o.value));
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
                  typeof c.onClick == "function" && (n.onclick = xl);
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
          if (typeof o != "string" && r.stateNode === null) throw Error(M(166));
          if (l = gu(ds.current), gu(bi.current), _c(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ei] = r, (d = o.nodeValue !== l) && (n = qr, n !== null)) switch (n.tag) {
              case 3:
                Sc(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Sc(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ei] = r, r.stateNode = o;
        }
        return Zn(r), null;
      case 13:
        if (rn(gn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (dn && Xr !== null && (r.mode & 1) !== 0 && (r.flags & 128) === 0) os(), Ol(), r.flags |= 98560, d = !1;
          else if (d = _c(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(M(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(M(317));
              d[Ei] = r;
            } else Ol(), (r.flags & 128) === 0 && (r.memoizedState = null), r.flags |= 4;
            Zn(r), d = !1;
          } else La !== null && (Ou(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return (r.flags & 128) !== 0 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, (r.mode & 1) !== 0 && (n === null || (gn.current & 1) !== 0 ? _n === 0 && (_n = 3) : $d())), r.updateQueue !== null && (r.flags |= 4), Zn(r), null);
      case 4:
        return Su(), jn(n, r), n === null && uo(r.stateNode.containerInfo), Zn(r), null;
      case 10:
        return Sd(r.type._context), Zn(r), null;
      case 17:
        return Nn(r.type) && po(), Zn(r), null;
      case 19:
        if (rn(gn), d = r.memoizedState, d === null) return Zn(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) _s(d, !1);
        else {
          if (_n !== 0 || n !== null && (n.flags & 128) !== 0) for (n = r.child; n !== null; ) {
            if (m = Lc(n), m !== null) {
              for (r.flags |= 128, _s(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return we(gn, gn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && qe() > Ro && (r.flags |= 128, o = !0, _s(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Lc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), _s(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !dn) return Zn(r), null;
          } else 2 * qe() - d.renderingStartTime > Ro && l !== 1073741824 && (r.flags |= 128, o = !0, _s(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = qe(), r.sibling = null, l = gn.current, we(gn, o ? l & 1 | 2 : l & 1), r) : (Zn(r), null);
      case 22:
      case 23:
        return Id(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && (r.mode & 1) !== 0 ? (ma & 1073741824) !== 0 && (Zn(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Zn(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(M(156, r.tag));
  }
  function ef(n, r) {
    switch (wc(r), r.tag) {
      case 1:
        return Nn(r.type) && po(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Su(), rn($n), rn(En), De(), n = r.flags, (n & 65536) !== 0 && (n & 128) === 0 ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Oc(r), null;
      case 13:
        if (rn(gn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(M(340));
          Ol();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return rn(gn), null;
      case 4:
        return Su(), null;
      case 10:
        return Sd(r.type._context), null;
      case 22:
      case 23:
        return Id(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ks = !1, Tr = !1, fy = typeof WeakSet == "function" ? WeakSet : Set, ve = null;
  function So(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      pn(n, r, o);
    }
    else l.current = null;
  }
  function tf(n, r, l) {
    try {
      l();
    } catch (o) {
      pn(n, r, o);
    }
  }
  var Kv = !1;
  function Jv(n, r) {
    if (as = wa, n = es(), fc(n)) {
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
          var m = 0, E = -1, T = -1, U = 0, Q = 0, q = n, $ = null;
          t: for (; ; ) {
            for (var ce; q !== l || c !== 0 && q.nodeType !== 3 || (E = m + c), q !== d || o !== 0 && q.nodeType !== 3 || (T = m + o), q.nodeType === 3 && (m += q.nodeValue.length), (ce = q.firstChild) !== null; )
              $ = q, q = ce;
            for (; ; ) {
              if (q === n) break t;
              if ($ === l && ++U === c && (E = m), $ === d && ++Q === o && (T = m), (ce = q.nextSibling) !== null) break;
              q = $, $ = q.parentNode;
            }
            q = ce;
          }
          l = E === -1 || T === -1 ? null : { start: E, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (du = { focusedElem: n, selectionRange: l }, wa = !1, ve = r; ve !== null; ) if (r = ve, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, ve = n;
    else for (; ve !== null; ) {
      r = ve;
      try {
        var me = r.alternate;
        if ((r.flags & 1024) !== 0) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (me !== null) {
              var Se = me.memoizedProps, kn = me.memoizedState, k = r.stateNode, b = k.getSnapshotBeforeUpdate(r.elementType === r.type ? Se : ri(r.type, Se), kn);
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
            throw Error(M(163));
        }
      } catch (W) {
        pn(r, r.return, W);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, ve = n;
        break;
      }
      ve = r.return;
    }
    return me = Kv, Kv = !1, me;
  }
  function Ds(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && tf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Os(n, r) {
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
  function jd(n) {
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
  function nf(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, nf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ei], delete r[is], delete r[ls], delete r[fo], delete r[sy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ls(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Ki(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ls(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function _i(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = xl));
    else if (o !== 4 && (n = n.child, n !== null)) for (_i(n, r, l), n = n.sibling; n !== null; ) _i(n, r, l), n = n.sibling;
  }
  function ki(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  var wn = null, Mr = !1;
  function Nr(n, r, l) {
    for (l = l.child; l !== null; ) Zv(n, r, l), l = l.sibling;
  }
  function Zv(n, r, l) {
    if ($r && typeof $r.onCommitFiberUnmount == "function") try {
      $r.onCommitFiberUnmount(hl, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Tr || So(l, r);
      case 6:
        var o = wn, c = Mr;
        wn = null, Nr(n, r, l), wn = o, Mr = c, wn !== null && (Mr ? (n = wn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : wn.removeChild(l.stateNode));
        break;
      case 18:
        wn !== null && (Mr ? (n = wn, l = l.stateNode, n.nodeType === 8 ? co(n.parentNode, l) : n.nodeType === 1 && co(n, l), Ja(n)) : co(wn, l.stateNode));
        break;
      case 4:
        o = wn, c = Mr, wn = l.stateNode.containerInfo, Mr = !0, Nr(n, r, l), wn = o, Mr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Tr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && tf(l, r, m), c = c.next;
          } while (c !== o);
        }
        Nr(n, r, l);
        break;
      case 1:
        if (!Tr && (So(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (E) {
          pn(l, r, E);
        }
        Nr(n, r, l);
        break;
      case 21:
        Nr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Tr = (o = Tr) || l.memoizedState !== null, Nr(n, r, l), Tr = o) : Nr(n, r, l);
        break;
      default:
        Nr(n, r, l);
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
  function ai(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, E = m;
        e: for (; E !== null; ) {
          switch (E.tag) {
            case 5:
              wn = E.stateNode, Mr = !1;
              break e;
            case 3:
              wn = E.stateNode.containerInfo, Mr = !0;
              break e;
            case 4:
              wn = E.stateNode.containerInfo, Mr = !0;
              break e;
          }
          E = E.return;
        }
        if (wn === null) throw Error(M(160));
        Zv(d, m, c), wn = null, Mr = !1;
        var T = c.alternate;
        T !== null && (T.return = null), c.return = null;
      } catch (U) {
        pn(c, r, U);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Fd(r, n), r = r.sibling;
  }
  function Fd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ai(r, n), ea(n), o & 4) {
          try {
            Ds(3, n, n.return), Os(3, n);
          } catch (Se) {
            pn(n, n.return, Se);
          }
          try {
            Ds(5, n, n.return);
          } catch (Se) {
            pn(n, n.return, Se);
          }
        }
        break;
      case 1:
        ai(r, n), ea(n), o & 512 && l !== null && So(l, l.return);
        break;
      case 5:
        if (ai(r, n), ea(n), o & 512 && l !== null && So(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            ee(c, "");
          } catch (Se) {
            pn(n, n.return, Se);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            E === "input" && d.type === "radio" && d.name != null && Bn(c, d), Xn(E, m);
            var U = Xn(E, d);
            for (m = 0; m < T.length; m += 2) {
              var Q = T[m], q = T[m + 1];
              Q === "style" ? Zt(c, q) : Q === "dangerouslySetInnerHTML" ? ci(c, q) : Q === "children" ? ee(c, q) : Qe(c, Q, q, U);
            }
            switch (E) {
              case "input":
                Ir(c, d);
                break;
              case "textarea":
                Ia(c, d);
                break;
              case "select":
                var $ = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var ce = d.value;
                ce != null ? Rn(c, !!d.multiple, ce, !1) : $ !== !!d.multiple && (d.defaultValue != null ? Rn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Rn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[is] = d;
          } catch (Se) {
            pn(n, n.return, Se);
          }
        }
        break;
      case 6:
        if (ai(r, n), ea(n), o & 4) {
          if (n.stateNode === null) throw Error(M(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Se) {
            pn(n, n.return, Se);
          }
        }
        break;
      case 3:
        if (ai(r, n), ea(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Ja(r.containerInfo);
        } catch (Se) {
          pn(n, n.return, Se);
        }
        break;
      case 4:
        ai(r, n), ea(n);
        break;
      case 13:
        ai(r, n), ea(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Vd = qe())), o & 4 && eh(n);
        break;
      case 22:
        if (Q = l !== null && l.memoizedState !== null, n.mode & 1 ? (Tr = (U = Tr) || Q, ai(r, n), Tr = U) : ai(r, n), ea(n), o & 8192) {
          if (U = n.memoizedState !== null, (n.stateNode.isHidden = U) && !Q && (n.mode & 1) !== 0) for (ve = n, Q = n.child; Q !== null; ) {
            for (q = ve = Q; ve !== null; ) {
              switch ($ = ve, ce = $.child, $.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ds(4, $, $.return);
                  break;
                case 1:
                  So($, $.return);
                  var me = $.stateNode;
                  if (typeof me.componentWillUnmount == "function") {
                    o = $, l = $.return;
                    try {
                      r = o, me.props = r.memoizedProps, me.state = r.memoizedState, me.componentWillUnmount();
                    } catch (Se) {
                      pn(o, l, Se);
                    }
                  }
                  break;
                case 5:
                  So($, $.return);
                  break;
                case 22:
                  if ($.memoizedState !== null) {
                    Ms(q);
                    continue;
                  }
              }
              ce !== null ? (ce.return = $, ve = ce) : Ms(q);
            }
            Q = Q.sibling;
          }
          e: for (Q = null, q = n; ; ) {
            if (q.tag === 5) {
              if (Q === null) {
                Q = q;
                try {
                  c = q.stateNode, U ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = q.stateNode, T = q.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, E.style.display = jt("display", m));
                } catch (Se) {
                  pn(n, n.return, Se);
                }
              }
            } else if (q.tag === 6) {
              if (Q === null) try {
                q.stateNode.nodeValue = U ? "" : q.memoizedProps;
              } catch (Se) {
                pn(n, n.return, Se);
              }
            } else if ((q.tag !== 22 && q.tag !== 23 || q.memoizedState === null || q === n) && q.child !== null) {
              q.child.return = q, q = q.child;
              continue;
            }
            if (q === n) break e;
            for (; q.sibling === null; ) {
              if (q.return === null || q.return === n) break e;
              Q === q && (Q = null), q = q.return;
            }
            Q === q && (Q = null), q.sibling.return = q.return, q = q.sibling;
          }
        }
        break;
      case 19:
        ai(r, n), ea(n), o & 4 && eh(n);
        break;
      case 21:
        break;
      default:
        ai(
          r,
          n
        ), ea(n);
    }
  }
  function ea(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Ls(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(M(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (ee(c, ""), o.flags &= -33);
            var d = Ki(n);
            ki(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Ki(n);
            _i(n, E, m);
            break;
          default:
            throw Error(M(161));
        }
      } catch (T) {
        pn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function dy(n, r, l) {
    ve = n, Hd(n);
  }
  function Hd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; ve !== null; ) {
      var c = ve, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || ks;
        if (!m) {
          var E = c.alternate, T = E !== null && E.memoizedState !== null || Tr;
          E = ks;
          var U = Tr;
          if (ks = m, (Tr = T) && !U) for (ve = c; ve !== null; ) m = ve, T = m.child, m.tag === 22 && m.memoizedState !== null ? Pd(c) : T !== null ? (T.return = m, ve = T) : Pd(c);
          for (; d !== null; ) ve = d, Hd(d), d = d.sibling;
          ve = c, ks = E, Tr = U;
        }
        th(n);
      } else (c.subtreeFlags & 8772) !== 0 && d !== null ? (d.return = c, ve = d) : th(n);
    }
  }
  function th(n) {
    for (; ve !== null; ) {
      var r = ve;
      if ((r.flags & 8772) !== 0) {
        var l = r.alternate;
        try {
          if ((r.flags & 8772) !== 0) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Tr || Os(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !Tr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ri(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && xd(r, d, o);
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
                xd(r, m, l);
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
                  var Q = U.memoizedState;
                  if (Q !== null) {
                    var q = Q.dehydrated;
                    q !== null && Ja(q);
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
              throw Error(M(163));
          }
          Tr || r.flags & 512 && jd(r);
        } catch ($) {
          pn(r, r.return, $);
        }
      }
      if (r === n) {
        ve = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, ve = l;
        break;
      }
      ve = r.return;
    }
  }
  function Ms(n) {
    for (; ve !== null; ) {
      var r = ve;
      if (r === n) {
        ve = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, ve = l;
        break;
      }
      ve = r.return;
    }
  }
  function Pd(n) {
    for (; ve !== null; ) {
      var r = ve;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Os(4, r);
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
              jd(r);
            } catch (T) {
              pn(r, d, T);
            }
            break;
          case 5:
            var m = r.return;
            try {
              jd(r);
            } catch (T) {
              pn(r, m, T);
            }
        }
      } catch (T) {
        pn(r, r.return, T);
      }
      if (r === n) {
        ve = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, ve = E;
        break;
      }
      ve = r.return;
    }
  }
  var py = Math.ceil, Ul = vt.ReactCurrentDispatcher, ku = vt.ReactCurrentOwner, or = vt.ReactCurrentBatchConfig, Ct = 0, Wn = null, Fn = null, sr = 0, ma = 0, Eo = Da(0), _n = 0, Ns = null, Di = 0, Co = 0, rf = 0, zs = null, ta = null, Vd = 0, Ro = 1 / 0, ya = null, To = !1, Du = null, Al = null, af = !1, Ji = null, Us = 0, jl = 0, xo = null, As = -1, xr = 0;
  function Hn() {
    return (Ct & 6) !== 0 ? qe() : As !== -1 ? As : As = qe();
  }
  function Oi(n) {
    return (n.mode & 1) === 0 ? 1 : (Ct & 2) !== 0 && sr !== 0 ? sr & -sr : cy.transition !== null ? (xr === 0 && (xr = qu()), xr) : (n = Ot, n !== 0 || (n = window.event, n = n === void 0 ? 16 : no(n.type)), n);
  }
  function zr(n, r, l, o) {
    if (50 < jl) throw jl = 0, xo = null, Error(M(185));
    Hi(n, l, o), ((Ct & 2) === 0 || n !== Wn) && (n === Wn && ((Ct & 2) === 0 && (Co |= l), _n === 4 && ii(n, sr)), na(n, o), l === 1 && Ct === 0 && (r.mode & 1) === 0 && (Ro = qe() + 500, vo && Ri()));
  }
  function na(n, r) {
    var l = n.callbackNode;
    ru(n, r);
    var o = Ka(n, n === Wn ? sr : 0);
    if (o === 0) l !== null && ar(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ar(l), r === 1) n.tag === 0 ? wl(Bd.bind(null, n)) : xc(Bd.bind(null, n)), so(function() {
        (Ct & 6) === 0 && Ri();
      }), l = null;
      else {
        switch (Ku(o)) {
          case 1:
            l = qa;
            break;
          case 4:
            l = tu;
            break;
          case 16:
            l = nu;
            break;
          case 536870912:
            l = Qu;
            break;
          default:
            l = nu;
        }
        l = fh(l, lf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function lf(n, r) {
    if (As = -1, xr = 0, (Ct & 6) !== 0) throw Error(M(327));
    var l = n.callbackNode;
    if (bo() && n.callbackNode !== l) return null;
    var o = Ka(n, n === Wn ? sr : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & n.expiredLanes) !== 0 || r) r = uf(n, o);
    else {
      r = o;
      var c = Ct;
      Ct |= 2;
      var d = rh();
      (Wn !== n || sr !== r) && (ya = null, Ro = qe() + 500, Zi(n, r));
      do
        try {
          ah();
          break;
        } catch (E) {
          nh(n, E);
        }
      while (!0);
      gd(), Ul.current = d, Ct = c, Fn !== null ? r = 0 : (Wn = null, sr = 0, r = _n);
    }
    if (r !== 0) {
      if (r === 2 && (c = yl(n), c !== 0 && (o = c, r = js(n, c))), r === 1) throw l = Ns, Zi(n, 0), ii(n, o), na(n, qe()), l;
      if (r === 6) ii(n, o);
      else {
        if (c = n.current.alternate, (o & 30) === 0 && !vy(c) && (r = uf(n, o), r === 2 && (d = yl(n), d !== 0 && (o = d, r = js(n, d))), r === 1)) throw l = Ns, Zi(n, 0), ii(n, o), na(n, qe()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(M(345));
          case 2:
            Mu(n, ta, ya);
            break;
          case 3:
            if (ii(n, o), (o & 130023424) === o && (r = Vd + 500 - qe(), 10 < r)) {
              if (Ka(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Hn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Cc(Mu.bind(null, n, ta, ya), r);
              break;
            }
            Mu(n, ta, ya);
            break;
          case 4:
            if (ii(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - kr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = qe() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * py(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Cc(Mu.bind(null, n, ta, ya), o);
              break;
            }
            Mu(n, ta, ya);
            break;
          case 5:
            Mu(n, ta, ya);
            break;
          default:
            throw Error(M(329));
        }
      }
    }
    return na(n, qe()), n.callbackNode === l ? lf.bind(null, n) : null;
  }
  function js(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (Zi(n, r).flags |= 256), n = uf(n, r), n !== 2 && (r = ta, ta = l, r !== null && Ou(r)), n;
  }
  function Ou(n) {
    ta === null ? ta = n : ta.push.apply(ta, n);
  }
  function vy(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var o = 0; o < l.length; o++) {
          var c = l[o], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ei(d(), c)) return !1;
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
  function ii(n, r) {
    for (r &= ~rf, r &= ~Co, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - kr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Bd(n) {
    if ((Ct & 6) !== 0) throw Error(M(327));
    bo();
    var r = Ka(n, 0);
    if ((r & 1) === 0) return na(n, qe()), null;
    var l = uf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = yl(n);
      o !== 0 && (r = o, l = js(n, o));
    }
    if (l === 1) throw l = Ns, Zi(n, 0), ii(n, r), na(n, qe()), l;
    if (l === 6) throw Error(M(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Mu(n, ta, ya), na(n, qe()), null;
  }
  function Yd(n, r) {
    var l = Ct;
    Ct |= 1;
    try {
      return n(r);
    } finally {
      Ct = l, Ct === 0 && (Ro = qe() + 500, vo && Ri());
    }
  }
  function Lu(n) {
    Ji !== null && Ji.tag === 0 && (Ct & 6) === 0 && bo();
    var r = Ct;
    Ct |= 1;
    var l = or.transition, o = Ot;
    try {
      if (or.transition = null, Ot = 1, n) return n();
    } finally {
      Ot = o, or.transition = l, Ct = r, (Ct & 6) === 0 && Ri();
    }
  }
  function Id() {
    ma = Eo.current, rn(Eo);
  }
  function Zi(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, pd(l)), Fn !== null) for (l = Fn.return; l !== null; ) {
      var o = l;
      switch (wc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && po();
          break;
        case 3:
          Su(), rn($n), rn(En), De();
          break;
        case 5:
          Oc(o);
          break;
        case 4:
          Su();
          break;
        case 13:
          rn(gn);
          break;
        case 19:
          rn(gn);
          break;
        case 10:
          Sd(o.type._context);
          break;
        case 22:
        case 23:
          Id();
      }
      l = l.return;
    }
    if (Wn = n, Fn = n = Fl(n.current, null), sr = ma = r, _n = 0, Ns = null, rf = Co = Di = 0, ta = zs = null, yu !== null) {
      for (r = 0; r < yu.length; r++) if (l = yu[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var m = d.next;
          d.next = c, o.next = m;
        }
        l.pending = o;
      }
      yu = null;
    }
    return n;
  }
  function nh(n, r) {
    do {
      var l = Fn;
      try {
        if (gd(), lt.current = bu, Mc) {
          for (var o = Mt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Mc = !1;
        }
        if (Gt = 0, Jn = Un = Mt = null, vs = !1, Eu = 0, ku.current = null, l === null || l.return === null) {
          _n = 1, Ns = r, Fn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, T = r;
          if (r = sr, E.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var U = T, Q = E, q = Q.tag;
            if ((Q.mode & 1) === 0 && (q === 0 || q === 11 || q === 15)) {
              var $ = Q.alternate;
              $ ? (Q.updateQueue = $.updateQueue, Q.memoizedState = $.memoizedState, Q.lanes = $.lanes) : (Q.updateQueue = null, Q.memoizedState = null);
            }
            var ce = Yv(m);
            if (ce !== null) {
              ce.flags &= -257, zl(ce, m, E, d, r), ce.mode & 1 && Md(d, U, r), r = ce, T = U;
              var me = r.updateQueue;
              if (me === null) {
                var Se = /* @__PURE__ */ new Set();
                Se.add(T), r.updateQueue = Se;
              } else me.add(T);
              break e;
            } else {
              if ((r & 1) === 0) {
                Md(d, U, r), $d();
                break e;
              }
              T = Error(M(426));
            }
          } else if (dn && E.mode & 1) {
            var kn = Yv(m);
            if (kn !== null) {
              (kn.flags & 65536) === 0 && (kn.flags |= 256), zl(kn, m, E, d, r), Gi(wu(T, E));
              break e;
            }
          }
          d = T = wu(T, E), _n !== 4 && (_n = 2), zs === null ? zs = [d] : zs.push(d), d = m;
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
                if ((d.flags & 128) === 0 && (typeof b.getDerivedStateFromError == "function" || L !== null && typeof L.componentDidCatch == "function" && (Al === null || !Al.has(L)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var W = Ld(d, E, r);
                  jv(d, W);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        lh(l);
      } catch (ye) {
        r = ye, Fn === l && l !== null && (Fn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function rh() {
    var n = Ul.current;
    return Ul.current = bu, n === null ? bu : n;
  }
  function $d() {
    (_n === 0 || _n === 3 || _n === 2) && (_n = 4), Wn === null || (Di & 268435455) === 0 && (Co & 268435455) === 0 || ii(Wn, sr);
  }
  function uf(n, r) {
    var l = Ct;
    Ct |= 2;
    var o = rh();
    (Wn !== n || sr !== r) && (ya = null, Zi(n, r));
    do
      try {
        hy();
        break;
      } catch (c) {
        nh(n, c);
      }
    while (!0);
    if (gd(), Ct = l, Ul.current = o, Fn !== null) throw Error(M(261));
    return Wn = null, sr = 0, _n;
  }
  function hy() {
    for (; Fn !== null; ) ih(Fn);
  }
  function ah() {
    for (; Fn !== null && !Wa(); ) ih(Fn);
  }
  function ih(n) {
    var r = ch(n.alternate, n, ma);
    n.memoizedProps = n.pendingProps, r === null ? lh(n) : Fn = r, ku.current = null;
  }
  function lh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, (r.flags & 32768) === 0) {
        if (l = Xv(l, r, ma), l !== null) {
          Fn = l;
          return;
        }
      } else {
        if (l = ef(l, r), l !== null) {
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
  function Mu(n, r, l) {
    var o = Ot, c = or.transition;
    try {
      or.transition = null, Ot = 1, my(n, r, l, o);
    } finally {
      or.transition = c, Ot = o;
    }
    return null;
  }
  function my(n, r, l, o) {
    do
      bo();
    while (Ji !== null);
    if ((Ct & 6) !== 0) throw Error(M(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(M(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Qf(n, d), n === Wn && (Fn = Wn = null, sr = 0), (l.subtreeFlags & 2064) === 0 && (l.flags & 2064) === 0 || af || (af = !0, fh(nu, function() {
      return bo(), null;
    })), d = (l.flags & 15990) !== 0, (l.subtreeFlags & 15990) !== 0 || d) {
      d = or.transition, or.transition = null;
      var m = Ot;
      Ot = 1;
      var E = Ct;
      Ct |= 4, ku.current = null, Jv(n, l), Fd(l, n), io(du), wa = !!as, du = as = null, n.current = l, dy(l), Ga(), Ct = E, Ot = m, or.transition = d;
    } else n.current = l;
    if (af && (af = !1, Ji = n, Us = c), d = n.pendingLanes, d === 0 && (Al = null), Io(l.stateNode), na(n, qe()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (To) throw To = !1, n = Du, Du = null, n;
    return (Us & 1) !== 0 && n.tag !== 0 && bo(), d = n.pendingLanes, (d & 1) !== 0 ? n === xo ? jl++ : (jl = 0, xo = n) : jl = 0, Ri(), null;
  }
  function bo() {
    if (Ji !== null) {
      var n = Ku(Us), r = or.transition, l = Ot;
      try {
        if (or.transition = null, Ot = 16 > n ? 16 : n, Ji === null) var o = !1;
        else {
          if (n = Ji, Ji = null, Us = 0, (Ct & 6) !== 0) throw Error(M(331));
          var c = Ct;
          for (Ct |= 4, ve = n.current; ve !== null; ) {
            var d = ve, m = d.child;
            if ((ve.flags & 16) !== 0) {
              var E = d.deletions;
              if (E !== null) {
                for (var T = 0; T < E.length; T++) {
                  var U = E[T];
                  for (ve = U; ve !== null; ) {
                    var Q = ve;
                    switch (Q.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ds(8, Q, d);
                    }
                    var q = Q.child;
                    if (q !== null) q.return = Q, ve = q;
                    else for (; ve !== null; ) {
                      Q = ve;
                      var $ = Q.sibling, ce = Q.return;
                      if (nf(Q), Q === U) {
                        ve = null;
                        break;
                      }
                      if ($ !== null) {
                        $.return = ce, ve = $;
                        break;
                      }
                      ve = ce;
                    }
                  }
                }
                var me = d.alternate;
                if (me !== null) {
                  var Se = me.child;
                  if (Se !== null) {
                    me.child = null;
                    do {
                      var kn = Se.sibling;
                      Se.sibling = null, Se = kn;
                    } while (Se !== null);
                  }
                }
                ve = d;
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && m !== null) m.return = d, ve = m;
            else e: for (; ve !== null; ) {
              if (d = ve, (d.flags & 2048) !== 0) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Ds(9, d, d.return);
              }
              var k = d.sibling;
              if (k !== null) {
                k.return = d.return, ve = k;
                break e;
              }
              ve = d.return;
            }
          }
          var b = n.current;
          for (ve = b; ve !== null; ) {
            m = ve;
            var L = m.child;
            if ((m.subtreeFlags & 2064) !== 0 && L !== null) L.return = m, ve = L;
            else e: for (m = b; ve !== null; ) {
              if (E = ve, (E.flags & 2048) !== 0) try {
                switch (E.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Os(9, E);
                }
              } catch (ye) {
                pn(E, E.return, ye);
              }
              if (E === m) {
                ve = null;
                break e;
              }
              var W = E.sibling;
              if (W !== null) {
                W.return = E.return, ve = W;
                break e;
              }
              ve = E.return;
            }
          }
          if (Ct = c, Ri(), $r && typeof $r.onPostCommitFiberRoot == "function") try {
            $r.onPostCommitFiberRoot(hl, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ot = l, or.transition = r;
      }
    }
    return !1;
  }
  function uh(n, r, l) {
    r = wu(l, r), r = Bv(n, r, 1), n = Ll(n, r, 1), r = Hn(), n !== null && (Hi(n, 1, r), na(n, r));
  }
  function pn(n, r, l) {
    if (n.tag === 3) uh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        uh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Al === null || !Al.has(o))) {
          n = wu(l, n), n = Ld(r, n, 1), r = Ll(r, n, 1), n = Hn(), r !== null && (Hi(r, 1, n), na(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function yy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Hn(), n.pingedLanes |= n.suspendedLanes & l, Wn === n && (sr & l) === l && (_n === 4 || _n === 3 && (sr & 130023424) === sr && 500 > qe() - Vd ? Zi(n, 0) : rf |= l), na(n, r);
  }
  function oh(n, r) {
    r === 0 && ((n.mode & 1) === 0 ? r = 1 : (r = fa, fa <<= 1, (fa & 130023424) === 0 && (fa = 4194304)));
    var l = Hn();
    n = va(n, r), n !== null && (Hi(n, r, l), na(n, l));
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
        throw Error(M(314));
    }
    o !== null && o.delete(r), oh(n, l);
  }
  var ch;
  ch = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || $n.current) An = !0;
    else {
      if ((n.lanes & l) === 0 && (r.flags & 128) === 0) return An = !1, ws(n, r, l);
      An = (n.flags & 131072) !== 0;
    }
    else An = !1, dn && (r.flags & 1048576) !== 0 && Nv(r, Wi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        Na(n, r), n = r.pendingProps;
        var c = Gr(r, En.current);
        yn(r, l), c = Ml(null, r, o, n, c, l);
        var d = ni();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Nn(o) ? (d = !0, Kn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, Td(r), c.updater = qc, r.stateNode = c, c._reactInternals = r, Cs(r, o, n, l), r = xs(null, r, o, !0, d, l)) : (r.tag = 0, dn && d && bc(r), ur(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (Na(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Ey(o), n = ri(o, n), c) {
            case 0:
              r = Iv(null, r, o, n, l);
              break e;
            case 1:
              r = $v(null, r, o, n, l);
              break e;
            case 11:
              r = Zr(null, r, o, n, l);
              break e;
            case 14:
              r = _u(null, r, o, ri(o.type, n), l);
              break e;
          }
          throw Error(M(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), Iv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), $v(n, r, o, c, l);
      case 3:
        e: {
          if (go(r), n === null) throw Error(M(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Av(n, r), ss(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = wu(Error(M(423)), r), r = Qv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = wu(Error(M(424)), r), r = Qv(n, r, o, l, c);
            break e;
          } else for (Xr = Si(r.stateNode.containerInfo.firstChild), qr = r, dn = !0, La = null, l = ie(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ol(), o === c) {
              r = za(n, r, l);
              break e;
            }
            ur(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Fv(r), n === null && md(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Ec(o, c) ? m = null : d !== null && Ec(o, d) && (r.flags |= 32), Nd(n, r), ur(n, r, m, l), r.child;
      case 6:
        return n === null && md(r), null;
      case 13:
        return Zc(n, r, l);
      case 4:
        return bd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = xn(r, null, o, l) : ur(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), Zr(n, r, o, c, l);
      case 7:
        return ur(n, r, r.pendingProps, l), r.child;
      case 8:
        return ur(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return ur(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, we(pa, o._currentValue), o._currentValue = m, d !== null) if (ei(d.value, m)) {
            if (d.children === c.children && !$n.current) {
              r = za(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var E = d.dependencies;
            if (E !== null) {
              m = d.child;
              for (var T = E.firstContext; T !== null; ) {
                if (T.context === o) {
                  if (d.tag === 1) {
                    T = qi(-1, l & -l), T.tag = 2;
                    var U = d.updateQueue;
                    if (U !== null) {
                      U = U.shared;
                      var Q = U.pending;
                      Q === null ? T.next = T : (T.next = Q.next, Q.next = T), U.pending = T;
                    }
                  }
                  d.lanes |= l, T = d.alternate, T !== null && (T.lanes |= l), Ed(
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
              if (m = d.return, m === null) throw Error(M(341));
              m.lanes |= l, E = m.alternate, E !== null && (E.lanes |= l), Ed(m, l, r), m = d.sibling;
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
        return c = r.type, o = r.pendingProps.children, yn(r, l), c = Ma(c), o = o(c), r.flags |= 1, ur(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ri(o, r.pendingProps), c = ri(o.type, c), _u(n, r, o, c, l);
      case 15:
        return Xe(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ri(o, c), Na(n, r), r.tag = 1, Nn(o) ? (n = !0, Kn(r)) : n = !1, yn(r, l), Xc(r, o, c), Cs(r, o, c, l), xs(null, r, o, !0, n, l);
      case 19:
        return wi(n, r, l);
      case 22:
        return Ts(n, r, l);
    }
    throw Error(M(156, r.tag));
  };
  function fh(n, r) {
    return on(n, r);
  }
  function Sy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Aa(n, r, l, o) {
    return new Sy(n, r, l, o);
  }
  function Qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ey(n) {
    if (typeof n == "function") return Qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === wt) return 11;
      if (n === _t) return 14;
    }
    return 2;
  }
  function Fl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Aa(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Fs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") Qd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case Fe:
        return el(l.children, c, d, r);
      case an:
        m = 8, c |= 8;
        break;
      case Ft:
        return n = Aa(12, l, r, c | 2), n.elementType = Ft, n.lanes = d, n;
      case Oe:
        return n = Aa(13, l, r, c), n.elementType = Oe, n.lanes = d, n;
      case At:
        return n = Aa(19, l, r, c), n.elementType = At, n.lanes = d, n;
      case Ce:
        return Hl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Jt:
            m = 10;
            break e;
          case ln:
            m = 9;
            break e;
          case wt:
            m = 11;
            break e;
          case _t:
            m = 14;
            break e;
          case Dt:
            m = 16, o = null;
            break e;
        }
        throw Error(M(130, n == null ? n : typeof n, ""));
    }
    return r = Aa(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function el(n, r, l, o) {
    return n = Aa(7, n, o, r), n.lanes = l, n;
  }
  function Hl(n, r, l, o) {
    return n = Aa(22, n, o, r), n.elementType = Ce, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Wd(n, r, l) {
    return n = Aa(6, n, null, r), n.lanes = l, n;
  }
  function of(n, r, l) {
    return r = Aa(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function dh(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Xu(0), this.expirationTimes = Xu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xu(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function sf(n, r, l, o, c, d, m, E, T) {
    return n = new dh(n, r, l, E, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Aa(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Td(d), n;
  }
  function Cy(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ut, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Gd(n) {
    if (!n) return Cr;
    n = n._reactInternals;
    e: {
      if (Ge(n) !== n || n.tag !== 1) throw Error(M(170));
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
      throw Error(M(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (Nn(l)) return us(n, l, r);
    }
    return r;
  }
  function ph(n, r, l, o, c, d, m, E, T) {
    return n = sf(l, o, !0, n, c, d, m, E, T), n.context = Gd(null), l = n.current, o = Hn(), c = Oi(l), d = qi(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Hi(n, c, o), na(n, o), n;
  }
  function cf(n, r, l, o) {
    var c = r.current, d = Hn(), m = Oi(c);
    return l = Gd(l), r.context === null ? r.context = l : r.pendingContext = l, r = qi(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (zr(n, c, m, d), Dc(n, c, m)), m;
  }
  function ff(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function qd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function df(n, r) {
    qd(n, r), (n = n.alternate) && qd(n, r);
  }
  function vh() {
    return null;
  }
  var Nu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Xd(n) {
    this._internalRoot = n;
  }
  pf.prototype.render = Xd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(M(409));
    cf(n, r, null, null);
  }, pf.prototype.unmount = Xd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Lu(function() {
        cf(null, n, null, null);
      }), r[$i] = null;
    }
  };
  function pf(n) {
    this._internalRoot = n;
  }
  pf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Be();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < In.length && r !== 0 && r < In[l].priority; l++) ;
      In.splice(l, 0, n), l === 0 && Wo(n);
    }
  };
  function Kd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function vf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function hh() {
  }
  function Ry(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var U = ff(m);
          d.call(U);
        };
      }
      var m = ph(r, o, n, 0, null, !1, !1, "", hh);
      return n._reactRootContainer = m, n[$i] = m.current, uo(n.nodeType === 8 ? n.parentNode : n), Lu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var E = o;
      o = function() {
        var U = ff(T);
        E.call(U);
      };
    }
    var T = sf(n, 0, !1, null, null, !1, !1, "", hh);
    return n._reactRootContainer = T, n[$i] = T.current, uo(n.nodeType === 8 ? n.parentNode : n), Lu(function() {
      cf(r, T, l, o);
    }), T;
  }
  function Hs(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var E = c;
        c = function() {
          var T = ff(m);
          E.call(T);
        };
      }
      cf(r, m, n, c);
    } else m = Ry(l, r, n, c, o);
    return ff(m);
  }
  xt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Pi(r, l | 1), na(r, qe()), (Ct & 6) === 0 && (Ro = qe() + 500, Ri()));
        }
        break;
      case 13:
        Lu(function() {
          var o = va(n, 1);
          if (o !== null) {
            var c = Hn();
            zr(o, n, 1, c);
          }
        }), df(n, 1);
    }
  }, $o = function(n) {
    if (n.tag === 13) {
      var r = va(n, 134217728);
      if (r !== null) {
        var l = Hn();
        zr(r, n, 134217728, l);
      }
      df(n, 134217728);
    }
  }, vi = function(n) {
    if (n.tag === 13) {
      var r = Oi(n), l = va(n, r);
      if (l !== null) {
        var o = Hn();
        zr(l, n, r, o);
      }
      df(n, r);
    }
  }, Be = function() {
    return Ot;
  }, Ju = function(n, r) {
    var l = Ot;
    try {
      return Ot = n, r();
    } finally {
      Ot = l;
    }
  }, It = function(n, r, l) {
    switch (r) {
      case "input":
        if (Ir(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = mn(o);
              if (!c) throw Error(M(90));
              br(o), Ir(o, c);
            }
          }
        }
        break;
      case "textarea":
        Ia(n, l);
        break;
      case "select":
        r = l.value, r != null && Rn(n, !!l.multiple, r, !1);
    }
  }, Zl = Yd, dl = Lu;
  var Ty = { usingClientEntryPoint: !1, Events: [ke, ti, mn, Fi, Jl, Yd] }, Ps = { findFiberByHostInstance: pu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, mh = { bundleType: Ps.bundleType, version: Ps.version, rendererPackageName: Ps.rendererPackageName, rendererConfig: Ps.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: vt.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Tn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Ps.findFiberByHostInstance || vh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Pl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Pl.isDisabled && Pl.supportsFiber) try {
      hl = Pl.inject(mh), $r = Pl;
    } catch {
    }
  }
  return Ba.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ty, Ba.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Kd(r)) throw Error(M(200));
    return Cy(n, r, null, l);
  }, Ba.createRoot = function(n, r) {
    if (!Kd(n)) throw Error(M(299));
    var l = !1, o = "", c = Nu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = sf(n, 1, !1, null, null, l, !1, o, c), n[$i] = r.current, uo(n.nodeType === 8 ? n.parentNode : n), new Xd(r);
  }, Ba.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(M(188)) : (n = Object.keys(n).join(","), Error(M(268, n)));
    return n = Tn(r), n = n === null ? null : n.stateNode, n;
  }, Ba.flushSync = function(n) {
    return Lu(n);
  }, Ba.hydrate = function(n, r, l) {
    if (!vf(r)) throw Error(M(200));
    return Hs(null, n, r, !0, l);
  }, Ba.hydrateRoot = function(n, r, l) {
    if (!Kd(n)) throw Error(M(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Nu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = ph(r, null, n, 1, l ?? null, c, !1, d, m), n[$i] = r.current, uo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new pf(r);
  }, Ba.render = function(n, r, l) {
    if (!vf(r)) throw Error(M(200));
    return Hs(null, n, r, !1, l);
  }, Ba.unmountComponentAtNode = function(n) {
    if (!vf(n)) throw Error(M(40));
    return n._reactRootContainer ? (Lu(function() {
      Hs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[$i] = null;
      });
    }), !0) : !1;
  }, Ba.unstable_batchedUpdates = Yd, Ba.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!vf(l)) throw Error(M(200));
    if (n == null || n._reactInternals === void 0) throw Error(M(38));
    return Hs(n, r, l, !1, o);
  }, Ba.version = "18.3.1-next-f1338f8080-20240426", Ba;
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
function ik() {
  return uT || (uT = 1, process.env.NODE_ENV !== "production" && (function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var B = tv(), G = cT(), M = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, gt = !1;
    function ft(e) {
      gt = e;
    }
    function dt(e) {
      if (!gt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        mt("warn", e, a);
      }
    }
    function S(e) {
      if (!gt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        mt("error", e, a);
      }
    }
    function mt(e, t, a) {
      {
        var i = M.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var se = 0, de = 1, Ee = 2, Z = 3, Re = 4, ue = 5, $e = 6, St = 7, pt = 8, fn = 9, ct = 10, Qe = 11, vt = 12, _e = 13, ut = 14, Fe = 15, an = 16, Ft = 17, Jt = 18, ln = 19, wt = 21, Oe = 22, At = 23, _t = 24, Dt = 25, Ce = !0, J = !1, Te = !1, ne = !1, _ = !1, P = !0, He = !0, Ae = !0, rt = !0, Ze = /* @__PURE__ */ new Set(), Ke = {}, et = {};
    function at(e, t) {
      Bt(e, t), Bt(e + "Capture", t);
    }
    function Bt(e, t) {
      Ke[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Ke[e] = t;
      {
        var a = e.toLowerCase();
        et[a] = e, e === "onDoubleClick" && (et.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        Ze.add(t[i]);
    }
    var On = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", br = Object.prototype.hasOwnProperty;
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
    function Ir(e) {
      if (nr(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Cn(e)), Vn(e);
    }
    function si(e, t) {
      if (nr(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Cn(e)), Vn(e);
    }
    function oa(e, t) {
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
    var Yn = 0, gr = 1, Ia = 2, Ln = 3, Sr = 4, sa = 5, $a = 6, ci = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ee = ci + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", xe = new RegExp("^[" + ci + "][" + ee + "]*$"), tt = {}, jt = {};
    function Zt(e) {
      return br.call(jt, e) ? !0 : br.call(tt, e) ? !1 : xe.test(e) ? (jt[e] = !0, !0) : (tt[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function vn(e, t, a) {
      return t !== null ? t.type === Yn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function un(e, t, a, i) {
      if (a !== null && a.type === Yn)
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
    function Xn(e, t, a, i) {
      if (t === null || typeof t > "u" || un(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Ln:
            return !t;
          case Sr:
            return t === !1;
          case sa:
            return isNaN(t);
          case $a:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function en(e) {
      return It.hasOwnProperty(e) ? It[e] : null;
    }
    function Yt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === Ia || t === Ln || t === Sr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var It = {}, ca = [
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
    ca.forEach(function(e) {
      It[e] = new Yt(
        e,
        Yn,
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
      It[t] = new Yt(
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
      It[e] = new Yt(
        e,
        Ia,
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
      It[e] = new Yt(
        e,
        Ia,
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
      It[e] = new Yt(
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
      It[e] = new Yt(
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
      It[e] = new Yt(
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
      It[e] = new Yt(
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
    }), ["rowSpan", "start"].forEach(function(e) {
      It[e] = new Yt(
        e,
        sa,
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
    var Er = /[\-\:]([a-z])/g, Ta = function(e) {
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
      var t = e.replace(Er, Ta);
      It[t] = new Yt(
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
      var t = e.replace(Er, Ta);
      It[t] = new Yt(
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
      var t = e.replace(Er, Ta);
      It[t] = new Yt(
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
      It[e] = new Yt(
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
    var Fi = "xlinkHref";
    It[Fi] = new Yt(
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
      It[e] = new Yt(
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
    var Jl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, Zl = !1;
    function dl(e) {
      !Zl && Jl.test(e) && (Zl = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function pl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        Bn(a, t), i.sanitizeURL && dl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Sr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Xn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Xn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Ln)
            return a;
          f = e.getAttribute(s);
        }
        return Xn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function eu(e, t, a, i) {
      {
        if (!Zt(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return Bn(a, t), u === "" + a ? a : u;
      }
    }
    function wr(e, t, a, i) {
      var u = en(t);
      if (!vn(t, u, i)) {
        if (Xn(t, a, u, i) && (a = null), i || u === null) {
          if (Zt(t)) {
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
          w === Ln || w === Sr && a === !0 ? x = "" : (Bn(a, y), x = "" + a, u.sanitizeURL && dl(x.toString())), g ? e.setAttributeNS(g, y, x) : e.setAttribute(y, x);
        }
      }
    }
    var _r = Symbol.for("react.element"), rr = Symbol.for("react.portal"), fi = Symbol.for("react.fragment"), Qa = Symbol.for("react.strict_mode"), di = Symbol.for("react.profiler"), pi = Symbol.for("react.provider"), R = Symbol.for("react.context"), Y = Symbol.for("react.forward_ref"), ae = Symbol.for("react.suspense"), he = Symbol.for("react.suspense_list"), Ge = Symbol.for("react.memo"), Ye = Symbol.for("react.lazy"), ot = Symbol.for("react.scope"), it = Symbol.for("react.debug_trace_mode"), Tn = Symbol.for("react.offscreen"), tn = Symbol.for("react.legacy_hidden"), on = Symbol.for("react.cache"), ar = Symbol.for("react.tracing_marker"), Wa = Symbol.iterator, Ga = "@@iterator";
    function qe(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Wa && e[Wa] || e[Ga];
      return typeof t == "function" ? t : null;
    }
    var Je = Object.assign, qa = 0, tu, nu, vl, Qu, hl, $r, Io;
    function kr() {
    }
    kr.__reactDisabledLog = !0;
    function ic() {
      {
        if (qa === 0) {
          tu = console.log, nu = console.info, vl = console.warn, Qu = console.error, hl = console.group, $r = console.groupCollapsed, Io = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: kr,
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
        qa++;
      }
    }
    function lc() {
      {
        if (qa--, qa === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Je({}, e, {
              value: tu
            }),
            info: Je({}, e, {
              value: nu
            }),
            warn: Je({}, e, {
              value: vl
            }),
            error: Je({}, e, {
              value: Qu
            }),
            group: Je({}, e, {
              value: hl
            }),
            groupCollapsed: Je({}, e, {
              value: $r
            }),
            groupEnd: Je({}, e, {
              value: Io
            })
          });
        }
        qa < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Wu = M.ReactCurrentDispatcher, ml;
    function fa(e, t, a) {
      {
        if (ml === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            ml = i && i[1] || "";
          }
        return `
` + ml + e;
      }
    }
    var Xa = !1, Ka;
    {
      var Gu = typeof WeakMap == "function" ? WeakMap : Map;
      Ka = new Gu();
    }
    function ru(e, t) {
      if (!e || Xa)
        return "";
      {
        var a = Ka.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Xa = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Wu.current, Wu.current = null, ic();
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
                    return e.displayName && w.includes("<anonymous>") && (w = w.replace("<anonymous>", e.displayName)), typeof e == "function" && Ka.set(e, w), w;
                  }
                while (y >= 1 && g >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, Wu.current = s, lc(), Error.prepareStackTrace = u;
      }
      var x = e ? e.displayName || e.name : "", N = x ? fa(x) : "";
      return typeof e == "function" && Ka.set(e, N), N;
    }
    function yl(e, t, a) {
      return ru(e, !0);
    }
    function qu(e, t, a) {
      return ru(e, !1);
    }
    function Xu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Hi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return ru(e, Xu(e));
      if (typeof e == "string")
        return fa(e);
      switch (e) {
        case ae:
          return fa("Suspense");
        case he:
          return fa("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Y:
            return qu(e.render);
          case Ge:
            return Hi(e.type, t, a);
          case Ye: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Hi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Qf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ue:
          return fa(e.type);
        case an:
          return fa("Lazy");
        case _e:
          return fa("Suspense");
        case ln:
          return fa("SuspenseList");
        case se:
        case Ee:
        case Fe:
          return qu(e.type);
        case Qe:
          return qu(e.type.render);
        case de:
          return yl(e.type);
        default:
          return "";
      }
    }
    function Pi(e) {
      try {
        var t = "", a = e;
        do
          t += Qf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ot(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Ku(e) {
      return e.displayName || "Context";
    }
    function xt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case fi:
          return "Fragment";
        case rr:
          return "Portal";
        case di:
          return "Profiler";
        case Qa:
          return "StrictMode";
        case ae:
          return "Suspense";
        case he:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return Ku(t) + ".Consumer";
          case pi:
            var a = e;
            return Ku(a._context) + ".Provider";
          case Y:
            return Ot(e, e.render, "ForwardRef");
          case Ge:
            var i = e.displayName || null;
            return i !== null ? i : xt(e.type) || "Memo";
          case Ye: {
            var u = e, s = u._payload, f = u._init;
            try {
              return xt(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function $o(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function vi(e) {
      return e.displayName || "Context";
    }
    function Be(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case _t:
          return "Cache";
        case fn:
          var i = a;
          return vi(i) + ".Consumer";
        case ct:
          var u = a;
          return vi(u._context) + ".Provider";
        case Jt:
          return "DehydratedFragment";
        case Qe:
          return $o(a, a.render, "ForwardRef");
        case St:
          return "Fragment";
        case ue:
          return a;
        case Re:
          return "Portal";
        case Z:
          return "Root";
        case $e:
          return "Text";
        case an:
          return xt(a);
        case pt:
          return a === Qa ? "StrictMode" : "Mode";
        case Oe:
          return "Offscreen";
        case vt:
          return "Profiler";
        case wt:
          return "Scope";
        case _e:
          return "Suspense";
        case ln:
          return "SuspenseList";
        case Dt:
          return "TracingMarker";
        // The display name for this tags come from the user-provided type:
        case de:
        case se:
        case Ft:
        case Ee:
        case ut:
        case Fe:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Ju = M.ReactDebugCurrentFrame, ir = null, hi = !1;
    function Dr() {
      {
        if (ir === null)
          return null;
        var e = ir._debugOwner;
        if (e !== null && typeof e < "u")
          return Be(e);
      }
      return null;
    }
    function mi() {
      return ir === null ? "" : Pi(ir);
    }
    function sn() {
      Ju.getCurrentStack = null, ir = null, hi = !1;
    }
    function $t(e) {
      Ju.getCurrentStack = e === null ? null : mi, ir = e, hi = !1;
    }
    function gl() {
      return ir;
    }
    function In(e) {
      hi = e;
    }
    function Or(e) {
      return "" + e;
    }
    function xa(e) {
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
    var au = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Qo(e, t) {
      au[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Wo(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Sl(e) {
      return e._valueTracker;
    }
    function iu(e) {
      e._valueTracker = null;
    }
    function Wf(e) {
      var t = "";
      return e && (Wo(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ba(e) {
      var t = Wo(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
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
            iu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Ja(e) {
      Sl(e) || (e._valueTracker = ba(e));
    }
    function yi(e) {
      if (!e)
        return !1;
      var t = Sl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Wf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function wa(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Zu = !1, eo = !1, El = !1, lu = !1;
    function to(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function no(e, t) {
      var a = e, i = t.checked, u = Je({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function Za(e, t) {
      Qo("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !eo && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component", t.type), eo = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Zu && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component", t.type), Zu = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: xa(t.value != null ? t.value : i),
        controlled: to(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && wr(a, "checked", i, !1);
    }
    function C(e, t) {
      var a = e;
      {
        var i = to(t);
        !a._wrapperState.controlled && i && !lu && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), lu = !0), a._wrapperState.controlled && !i && !El && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), El = !0);
      }
      h(e, t);
      var u = xa(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Or(u)) : a.value !== Or(u) && (a.value = Or(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Le(a, t.type, u) : t.hasOwnProperty("defaultValue") && Le(a, t.type, xa(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function z(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Or(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function j(e, t) {
      var a = e;
      C(a, t), K(a, t);
    }
    function K(e, t) {
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
            yi(f), C(f, p);
          }
        }
      }
    }
    function Le(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || wa(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Or(e._wrapperState.initialValue) : e.defaultValue !== Or(a) && (e.defaultValue = Or(a)));
    }
    var re = !1, ze = !1, st = !1;
    function bt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? B.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || ze || (ze = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (st || (st = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !re && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), re = !0);
    }
    function nn(e, t) {
      t.value != null && e.setAttribute("value", Or(xa(t.value)));
    }
    var Qt = Array.isArray;
    function nt(e) {
      return Qt(e);
    }
    var Wt;
    Wt = !1;
    function hn() {
      var e = Dr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Cl = ["value", "defaultValue"];
    function Go(e) {
      {
        Qo("select", e);
        for (var t = 0; t < Cl.length; t++) {
          var a = Cl[t];
          if (e[a] != null) {
            var i = nt(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, hn()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, hn());
          }
        }
      }
    }
    function Vi(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var y = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== y && (u[v].selected = y), y && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var g = Or(xa(a)), w = null, x = 0; x < u.length; x++) {
          if (u[x].value === g) {
            u[x].selected = !0, i && (u[x].defaultSelected = !0);
            return;
          }
          w === null && !u[x].disabled && (w = u[x]);
        }
        w !== null && (w.selected = !0);
      }
    }
    function qo(e, t) {
      return Je({}, t, {
        value: void 0
      });
    }
    function uu(e, t) {
      var a = e;
      Go(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Wt && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Wt = !0);
    }
    function Gf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Vi(a, !!t.multiple, i, !1) : t.defaultValue != null && Vi(a, !!t.multiple, t.defaultValue, !0);
    }
    function uc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Vi(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Vi(a, !!t.multiple, t.defaultValue, !0) : Vi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function qf(e, t) {
      var a = e, i = t.value;
      i != null && Vi(a, !!t.multiple, i, !1);
    }
    var rv = !1;
    function Xf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Je({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Or(a._wrapperState.initialValue)
      });
      return i;
    }
    function Kf(e, t) {
      var a = e;
      Qo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !rv && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component"), rv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (nt(u)) {
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
        initialValue: xa(i)
      };
    }
    function av(e, t) {
      var a = e, i = xa(t.value), u = xa(t.defaultValue);
      if (i != null) {
        var s = Or(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Or(u));
    }
    function iv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Jm(e, t) {
      av(e, t);
    }
    var Bi = "http://www.w3.org/1999/xhtml", Jf = "http://www.w3.org/1998/Math/MathML", Zf = "http://www.w3.org/2000/svg";
    function ed(e) {
      switch (e) {
        case "svg":
          return Zf;
        case "math":
          return Jf;
        default:
          return Bi;
      }
    }
    function td(e, t) {
      return e == null || e === Bi ? ed(t) : e === Zf && t === "foreignObject" ? Bi : e;
    }
    var lv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, oc, uv = lv(function(e, t) {
      if (e.namespaceURI === Zf && !("innerHTML" in e)) {
        oc = oc || document.createElement("div"), oc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = oc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Qr = 1, Yi = 3, Mn = 8, Ii = 9, nd = 11, ro = function(e, t) {
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
    }, Ko = {
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
    Object.keys(Ko).forEach(function(e) {
      sv.forEach(function(t) {
        Ko[ov(t, e)] = Ko[e];
      });
    });
    function sc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Ko.hasOwnProperty(e) && Ko[e]) ? t + "px" : (oa(t, e), ("" + t).trim());
    }
    var cv = /([A-Z])/g, fv = /^ms-/;
    function ao(e) {
      return e.replace(cv, "-$1").toLowerCase().replace(fv, "-ms-");
    }
    var dv = function() {
    };
    {
      var Zm = /^(?:webkit|moz|o)[A-Z]/, ey = /^-ms-/, pv = /-(.)/g, rd = /;\s*$/, gi = {}, ou = {}, vv = !1, Jo = !1, ty = function(e) {
        return e.replace(pv, function(t, a) {
          return a.toUpperCase();
        });
      }, hv = function(e) {
        gi.hasOwnProperty(e) && gi[e] || (gi[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ty(e.replace(ey, "ms-"))
        ));
      }, ad = function(e) {
        gi.hasOwnProperty(e) && gi[e] || (gi[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, id = function(e, t) {
        ou.hasOwnProperty(t) && ou[t] || (ou[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(rd, "")));
      }, mv = function(e, t) {
        vv || (vv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, yv = function(e, t) {
        Jo || (Jo = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      dv = function(e, t) {
        e.indexOf("-") > -1 ? hv(e) : Zm.test(e) ? ad(e) : rd.test(t) && id(e, t), typeof t == "number" && (isNaN(t) ? mv(e, t) : isFinite(t) || yv(e, t));
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
              t += a + (s ? i : ao(i)) + ":", t += sc(i, u, s), a = ";";
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
          var s = sc(i, t[i], u);
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
    var ei = {
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
    }, Zo = Je({
      menuitem: !0
    }, ei), Cv = "__html";
    function cc(e, t) {
      if (t) {
        if (Zo[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
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
    function Rl(e, t) {
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
    var es = {
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
    }, fc = {
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
    }, io = {}, iy = new RegExp("^(aria)-[" + ee + "]*$"), lo = new RegExp("^(aria)[A-Z][" + ee + "]*$");
    function ld(e, t) {
      {
        if (br.call(io, t) && io[t])
          return !0;
        if (lo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = fc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), io[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), io[t] = !0, !0;
        }
        if (iy.test(t)) {
          var u = t.toLowerCase(), s = fc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return io[t] = !0, !1;
          if (t !== s)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), io[t] = !0, !0;
        }
      }
      return !0;
    }
    function ts(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = ld(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function ud(e, t) {
      Rl(e, t) || ts(e, t);
    }
    var od = !1;
    function dc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !od && (od = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var su = function() {
    };
    {
      var lr = {}, sd = /^on./, pc = /^on[^A-Z]/, Rv = new RegExp("^(aria)-[" + ee + "]*$"), Tv = new RegExp("^(aria)[A-Z][" + ee + "]*$");
      su = function(e, t, a, i) {
        if (br.call(lr, t) && lr[t])
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
          if (sd.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), lr[t] = !0, !0;
        } else if (sd.test(t))
          return pc.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), lr[t] = !0, !0;
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
        var v = en(t), y = v !== null && v.type === Yn;
        if (es.hasOwnProperty(u)) {
          var g = es[u];
          if (g !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, g), lr[t] = !0, !0;
        } else if (!y && t !== u)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), lr[t] = !0, !0;
        return typeof a == "boolean" && un(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), lr[t] = !0, !0) : y ? !0 : un(t, a, v, !1) ? (lr[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Ln && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), lr[t] = !0), !0);
      };
    }
    var xv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = su(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function bv(e, t, a) {
      Rl(e, t) || xv(e, t, a);
    }
    var cd = 1, vc = 2, _a = 4, fd = cd | vc | _a, cu = null;
    function ly(e) {
      cu !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), cu = e;
    }
    function uy() {
      cu === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), cu = null;
    }
    function ns(e) {
      return e === cu;
    }
    function dd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var hc = null, fu = null, Ht = null;
    function mc(e) {
      var t = ko(e);
      if (t) {
        if (typeof hc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = zh(a);
          hc(t.stateNode, t.type, i);
        }
      }
    }
    function yc(e) {
      hc = e;
    }
    function uo(e) {
      fu ? Ht ? Ht.push(e) : Ht = [e] : fu = e;
    }
    function wv() {
      return fu !== null || Ht !== null;
    }
    function gc() {
      if (fu) {
        var e = fu, t = Ht;
        if (fu = null, Ht = null, mc(e), t)
          for (var a = 0; a < t.length; a++)
            mc(t[a]);
      }
    }
    var oo = function(e, t) {
      return e(t);
    }, rs = function() {
    }, Tl = !1;
    function _v() {
      var e = wv();
      e && (rs(), gc());
    }
    function kv(e, t, a) {
      if (Tl)
        return e(t, a);
      Tl = !0;
      try {
        return oo(e, t, a);
      } finally {
        Tl = !1, _v();
      }
    }
    function oy(e, t, a) {
      oo = e, rs = a;
    }
    function Dv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Sc(e, t, a) {
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
    function xl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = zh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Sc(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var as = !1;
    if (On)
      try {
        var du = {};
        Object.defineProperty(du, "passive", {
          get: function() {
            as = !0;
          }
        }), window.addEventListener("test", du, du), window.removeEventListener("test", du, du);
      } catch {
        as = !1;
      }
    function Ec(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (g) {
        this.onError(g);
      }
    }
    var Cc = Ec;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var pd = document.createElement("react");
      Cc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var g = document.createEvent("Event"), w = !1, x = !0, N = window.event, A = Object.getOwnPropertyDescriptor(window, "event");
        function F() {
          pd.removeEventListener(H, Me, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = N);
        }
        var le = Array.prototype.slice.call(arguments, 3);
        function Me() {
          w = !0, F(), a.apply(i, le), x = !1;
        }
        var be, Tt = !1, ht = !1;
        function D(O) {
          if (be = O.error, Tt = !0, be === null && O.colno === 0 && O.lineno === 0 && (ht = !0), O.defaultPrevented && be != null && typeof be == "object")
            try {
              be._suppressLogging = !0;
            } catch {
            }
        }
        var H = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", D), pd.addEventListener(H, Me, !1), g.initEvent(H, !1, !1), pd.dispatchEvent(g), A && Object.defineProperty(window, "event", A), w && x && (Tt ? ht && (be = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : be = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(be)), window.removeEventListener("error", D), !w)
          return F(), Ec.apply(this, arguments);
      };
    }
    var Ov = Cc, so = !1, Rc = null, co = !1, Si = null, Lv = {
      onError: function(e) {
        so = !0, Rc = e;
      }
    };
    function bl(e, t, a, i, u, s, f, p, v) {
      so = !1, Rc = null, Ov.apply(Lv, arguments);
    }
    function Ei(e, t, a, i, u, s, f, p, v) {
      if (bl.apply(this, arguments), so) {
        var y = ls();
        co || (co = !0, Si = y);
      }
    }
    function is() {
      if (co) {
        var e = Si;
        throw co = !1, Si = null, e;
      }
    }
    function $i() {
      return so;
    }
    function ls() {
      if (so) {
        var e = Rc;
        return so = !1, Rc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function fo(e) {
      return e._reactInternals;
    }
    function sy(e) {
      return e._reactInternals !== void 0;
    }
    function pu(e, t) {
      e._reactInternals = t;
    }
    var ke = (
      /*                      */
      0
    ), ti = (
      /*                */
      1
    ), mn = (
      /*                    */
      2
    ), Et = (
      /*                       */
      4
    ), ka = (
      /*                */
      16
    ), Da = (
      /*                 */
      32
    ), rn = (
      /*                     */
      64
    ), we = (
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
    ), Wr = (
      /*                      */
      2048
    ), Gr = (
      /*                    */
      4096
    ), Nn = (
      /*                   */
      8192
    ), po = (
      /*             */
      16384
    ), Mv = (
      /*               */
      32767
    ), us = (
      /*                   */
      32768
    ), Kn = (
      /*                */
      65536
    ), Tc = (
      /* */
      131072
    ), Ci = (
      /*                       */
      1048576
    ), vo = (
      /*                    */
      2097152
    ), Qi = (
      /*                 */
      4194304
    ), xc = (
      /*                */
      8388608
    ), wl = (
      /*               */
      16777216
    ), Ri = (
      /*              */
      33554432
    ), _l = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Et | $n | 0
    ), kl = mn | Et | ka | Da | En | Gr | Nn, Dl = Et | rn | En | Nn, Wi = Wr | ka, zn = Qi | xc | vo, Oa = M.ReactCurrentOwner;
    function da(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (mn | Gr)) !== ke && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === Z ? a : null;
    }
    function Ti(e) {
      if (e.tag === _e) {
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
    function xi(e) {
      return e.tag === Z ? e.stateNode.containerInfo : null;
    }
    function vu(e) {
      return da(e) === e;
    }
    function Nv(e) {
      {
        var t = Oa.current;
        if (t !== null && t.tag === de) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Be(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = fo(e);
      return u ? da(u) === u : !1;
    }
    function bc(e) {
      if (da(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function wc(e) {
      var t = e.alternate;
      if (!t) {
        var a = da(e);
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
              return bc(s), e;
            if (v === u)
              return bc(s), t;
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
    function qr(e) {
      var t = wc(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === ue || e.tag === $e)
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
      var t = wc(e);
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === ue || e.tag === $e)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== Re) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var vd = G.unstable_scheduleCallback, zv = G.unstable_cancelCallback, hd = G.unstable_shouldYield, md = G.unstable_requestPaint, Qn = G.unstable_now, _c = G.unstable_getCurrentPriorityLevel, os = G.unstable_ImmediatePriority, Ol = G.unstable_UserBlockingPriority, Gi = G.unstable_NormalPriority, cy = G.unstable_LowPriority, hu = G.unstable_IdlePriority, kc = G.unstable_yieldValue, Uv = G.unstable_setDisableYieldValue, mu = null, xn = null, ie = null, pa = !1, Kr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function ho(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        He && (e = Je({}, e, {
          getLaneLabelMap: yu,
          injectProfilingHooks: Ma
        })), mu = t.inject(e), xn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function yd(e, t) {
      if (xn && typeof xn.onScheduleFiberRoot == "function")
        try {
          xn.onScheduleFiberRoot(mu, e, t);
        } catch (a) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function gd(e, t) {
      if (xn && typeof xn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & we) === we;
          if (Ae) {
            var i;
            switch (t) {
              case Lr:
                i = os;
                break;
              case wi:
                i = Ol;
                break;
              case Na:
                i = Gi;
                break;
              case za:
                i = hu;
                break;
              default:
                i = Gi;
                break;
            }
            xn.onCommitFiberRoot(mu, e, i, a);
          }
        } catch (u) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", u));
        }
    }
    function Sd(e) {
      if (xn && typeof xn.onPostCommitFiberRoot == "function")
        try {
          xn.onPostCommitFiberRoot(mu, e);
        } catch (t) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Ed(e) {
      if (xn && typeof xn.onCommitFiberUnmount == "function")
        try {
          xn.onCommitFiberUnmount(mu, e);
        } catch (t) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function yn(e) {
      if (typeof kc == "function" && (Uv(e), ft(e)), xn && typeof xn.setStrictMode == "function")
        try {
          xn.setStrictMode(mu, e);
        } catch (t) {
          pa || (pa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Ma(e) {
      ie = e;
    }
    function yu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Eu; a++) {
          var i = Hv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Cd(e) {
      ie !== null && typeof ie.markCommitStarted == "function" && ie.markCommitStarted(e);
    }
    function Rd() {
      ie !== null && typeof ie.markCommitStopped == "function" && ie.markCommitStopped();
    }
    function va(e) {
      ie !== null && typeof ie.markComponentRenderStarted == "function" && ie.markComponentRenderStarted(e);
    }
    function ha() {
      ie !== null && typeof ie.markComponentRenderStopped == "function" && ie.markComponentRenderStopped();
    }
    function Td(e) {
      ie !== null && typeof ie.markComponentPassiveEffectMountStarted == "function" && ie.markComponentPassiveEffectMountStarted(e);
    }
    function Av() {
      ie !== null && typeof ie.markComponentPassiveEffectMountStopped == "function" && ie.markComponentPassiveEffectMountStopped();
    }
    function qi(e) {
      ie !== null && typeof ie.markComponentPassiveEffectUnmountStarted == "function" && ie.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      ie !== null && typeof ie.markComponentPassiveEffectUnmountStopped == "function" && ie.markComponentPassiveEffectUnmountStopped();
    }
    function Dc(e) {
      ie !== null && typeof ie.markComponentLayoutEffectMountStarted == "function" && ie.markComponentLayoutEffectMountStarted(e);
    }
    function jv() {
      ie !== null && typeof ie.markComponentLayoutEffectMountStopped == "function" && ie.markComponentLayoutEffectMountStopped();
    }
    function ss(e) {
      ie !== null && typeof ie.markComponentLayoutEffectUnmountStarted == "function" && ie.markComponentLayoutEffectUnmountStarted(e);
    }
    function xd() {
      ie !== null && typeof ie.markComponentLayoutEffectUnmountStopped == "function" && ie.markComponentLayoutEffectUnmountStopped();
    }
    function cs(e, t, a) {
      ie !== null && typeof ie.markComponentErrored == "function" && ie.markComponentErrored(e, t, a);
    }
    function bi(e, t, a) {
      ie !== null && typeof ie.markComponentSuspended == "function" && ie.markComponentSuspended(e, t, a);
    }
    function fs(e) {
      ie !== null && typeof ie.markLayoutEffectsStarted == "function" && ie.markLayoutEffectsStarted(e);
    }
    function ds() {
      ie !== null && typeof ie.markLayoutEffectsStopped == "function" && ie.markLayoutEffectsStopped();
    }
    function gu(e) {
      ie !== null && typeof ie.markPassiveEffectsStarted == "function" && ie.markPassiveEffectsStarted(e);
    }
    function bd() {
      ie !== null && typeof ie.markPassiveEffectsStopped == "function" && ie.markPassiveEffectsStopped();
    }
    function Su(e) {
      ie !== null && typeof ie.markRenderStarted == "function" && ie.markRenderStarted(e);
    }
    function Fv() {
      ie !== null && typeof ie.markRenderYielded == "function" && ie.markRenderYielded();
    }
    function Oc() {
      ie !== null && typeof ie.markRenderStopped == "function" && ie.markRenderStopped();
    }
    function gn(e) {
      ie !== null && typeof ie.markRenderScheduled == "function" && ie.markRenderScheduled(e);
    }
    function Lc(e, t) {
      ie !== null && typeof ie.markForceUpdateScheduled == "function" && ie.markForceUpdateScheduled(e, t);
    }
    function ps(e, t) {
      ie !== null && typeof ie.markStateUpdateScheduled == "function" && ie.markStateUpdateScheduled(e, t);
    }
    var De = (
      /*                         */
      0
    ), lt = (
      /*                 */
      1
    ), Lt = (
      /*                    */
      2
    ), Gt = (
      /*               */
      8
    ), Mt = (
      /*              */
      16
    ), Un = Math.clz32 ? Math.clz32 : vs, Jn = Math.log, Mc = Math.LN2;
    function vs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Jn(t) / Mc | 0) | 0;
    }
    var Eu = 31, I = (
      /*                        */
      0
    ), kt = (
      /*                          */
      0
    ), je = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), ni = (
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
    ), Nl = (
      /*                       */
      4194240
    ), Cu = (
      /*                        */
      64
    ), Nc = (
      /*                        */
      128
    ), zc = (
      /*                        */
      256
    ), Uc = (
      /*                        */
      512
    ), Ac = (
      /*                        */
      1024
    ), jc = (
      /*                        */
      2048
    ), Fc = (
      /*                        */
      4096
    ), Hc = (
      /*                        */
      8192
    ), Pc = (
      /*                        */
      16384
    ), Ru = (
      /*                       */
      32768
    ), Vc = (
      /*                       */
      65536
    ), mo = (
      /*                       */
      131072
    ), yo = (
      /*                       */
      262144
    ), Bc = (
      /*                       */
      524288
    ), hs = (
      /*                       */
      1048576
    ), Yc = (
      /*                       */
      2097152
    ), ms = (
      /*                            */
      130023424
    ), Tu = (
      /*                             */
      4194304
    ), Ic = (
      /*                             */
      8388608
    ), ys = (
      /*                             */
      16777216
    ), $c = (
      /*                             */
      33554432
    ), Qc = (
      /*                             */
      67108864
    ), wd = Tu, gs = (
      /*          */
      134217728
    ), _d = (
      /*                          */
      268435455
    ), Ss = (
      /*               */
      268435456
    ), xu = (
      /*                        */
      536870912
    ), Jr = (
      /*                   */
      1073741824
    );
    function Hv(e) {
      {
        if (e & je)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & ni)
          return "InputContinuous";
        if (e & Rr)
          return "DefaultHydration";
        if (e & bn)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & Nl)
          return "Transition";
        if (e & ms)
          return "Retry";
        if (e & gs)
          return "SelectiveHydration";
        if (e & Ss)
          return "IdleHydration";
        if (e & xu)
          return "Idle";
        if (e & Jr)
          return "Offscreen";
      }
    }
    var Kt = -1, bu = Cu, Wc = Tu;
    function Es(e) {
      switch (zl(e)) {
        case je:
          return je;
        case Ml:
          return Ml;
        case ni:
          return ni;
        case Rr:
          return Rr;
        case bn:
          return bn;
        case Xi:
          return Xi;
        case Cu:
        case Nc:
        case zc:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Ru:
        case Vc:
        case mo:
        case yo:
        case Bc:
        case hs:
        case Yc:
          return e & Nl;
        case Tu:
        case Ic:
        case ys:
        case $c:
        case Qc:
          return e & ms;
        case gs:
          return gs;
        case Ss:
          return Ss;
        case xu:
          return xu;
        case Jr:
          return Jr;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Gc(e, t) {
      var a = e.pendingLanes;
      if (a === I)
        return I;
      var i = I, u = e.suspendedLanes, s = e.pingedLanes, f = a & _d;
      if (f !== I) {
        var p = f & ~u;
        if (p !== I)
          i = Es(p);
        else {
          var v = f & s;
          v !== I && (i = Es(v));
        }
      } else {
        var y = a & ~u;
        y !== I ? i = Es(y) : s !== I && (i = Es(s));
      }
      if (i === I)
        return I;
      if (t !== I && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === I) {
        var g = zl(i), w = zl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          g >= w || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          g === bn && (w & Nl) !== I
        )
          return t;
      }
      (i & ni) !== I && (i |= a & bn);
      var x = e.entangledLanes;
      if (x !== I)
        for (var N = e.entanglements, A = i & x; A > 0; ) {
          var F = An(A), le = 1 << F;
          i |= N[F], A &= ~le;
        }
      return i;
    }
    function ri(e, t) {
      for (var a = e.eventTimes, i = Kt; t > 0; ) {
        var u = An(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function kd(e, t) {
      switch (e) {
        case je:
        case Ml:
        case ni:
          return t + 250;
        case Rr:
        case bn:
        case Xi:
        case Cu:
        case Nc:
        case zc:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Ru:
        case Vc:
        case mo:
        case yo:
        case Bc:
        case hs:
        case Yc:
          return t + 5e3;
        case Tu:
        case Ic:
        case ys:
        case $c:
        case Qc:
          return Kt;
        case gs:
        case Ss:
        case xu:
        case Jr:
          return Kt;
        default:
          return S("Should have found matching lanes. This is a bug in React."), Kt;
      }
    }
    function qc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = An(f), v = 1 << p, y = s[p];
        y === Kt ? ((v & i) === I || (v & u) !== I) && (s[p] = kd(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Pv(e) {
      return Es(e.pendingLanes);
    }
    function Xc(e) {
      var t = e.pendingLanes & ~Jr;
      return t !== I ? t : t & Jr ? Jr : I;
    }
    function Vv(e) {
      return (e & je) !== I;
    }
    function Cs(e) {
      return (e & _d) !== I;
    }
    function wu(e) {
      return (e & ms) === e;
    }
    function Dd(e) {
      var t = je | ni | bn;
      return (e & t) === I;
    }
    function Od(e) {
      return (e & Nl) === e;
    }
    function Kc(e, t) {
      var a = Ml | ni | Rr | bn;
      return (t & a) !== I;
    }
    function Bv(e, t) {
      return (t & e.expiredLanes) !== I;
    }
    function Ld(e) {
      return (e & Nl) !== I;
    }
    function Md() {
      var e = bu;
      return bu <<= 1, (bu & Nl) === I && (bu = Cu), e;
    }
    function Yv() {
      var e = Wc;
      return Wc <<= 1, (Wc & ms) === I && (Wc = Tu), e;
    }
    function zl(e) {
      return e & -e;
    }
    function Rs(e) {
      return zl(e);
    }
    function An(e) {
      return 31 - Un(e);
    }
    function ur(e) {
      return An(e);
    }
    function Zr(e, t) {
      return (e & t) !== I;
    }
    function _u(e, t) {
      return (e & t) === t;
    }
    function Xe(e, t) {
      return e | t;
    }
    function Ts(e, t) {
      return e & ~t;
    }
    function Nd(e, t) {
      return e & t;
    }
    function Iv(e) {
      return e;
    }
    function $v(e, t) {
      return e !== kt && e < t ? e : t;
    }
    function xs(e) {
      for (var t = [], a = 0; a < Eu; a++)
        t.push(e);
      return t;
    }
    function go(e, t, a) {
      e.pendingLanes |= t, t !== xu && (e.suspendedLanes = I, e.pingedLanes = I);
      var i = e.eventTimes, u = ur(t);
      i[u] = a;
    }
    function Qv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = An(i), s = 1 << u;
        a[u] = Kt, i &= ~s;
      }
    }
    function Jc(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function zd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = I, e.pingedLanes = I, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = An(f), v = 1 << p;
        i[p] = I, u[p] = Kt, s[p] = Kt, f &= ~v;
      }
    }
    function Zc(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = An(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Ud(e, t) {
      var a = zl(t), i;
      switch (a) {
        case ni:
          i = Ml;
          break;
        case bn:
          i = Rr;
          break;
        case Cu:
        case Nc:
        case zc:
        case Uc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Ru:
        case Vc:
        case mo:
        case yo:
        case Bc:
        case hs:
        case Yc:
        case Tu:
        case Ic:
        case ys:
        case $c:
        case Qc:
          i = Xi;
          break;
        case xu:
          i = Ss;
          break;
        default:
          i = kt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== kt ? kt : i;
    }
    function bs(e, t, a) {
      if (Kr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = ur(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Wv(e, t) {
      if (Kr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = ur(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Ad(e, t) {
      return null;
    }
    var Lr = je, wi = ni, Na = bn, za = xu, ws = kt;
    function Ua() {
      return ws;
    }
    function jn(e) {
      ws = e;
    }
    function Gv(e, t) {
      var a = ws;
      try {
        return ws = e, t();
      } finally {
        ws = a;
      }
    }
    function qv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function _s(e, t) {
      return e > t ? e : t;
    }
    function Zn(e, t) {
      return e !== 0 && e < t;
    }
    function Xv(e) {
      var t = zl(e);
      return Zn(Lr, t) ? Zn(wi, t) ? Cs(t) ? Na : za : wi : Lr;
    }
    function ef(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var ks;
    function Tr(e) {
      ks = e;
    }
    function fy(e) {
      ks(e);
    }
    var ve;
    function So(e) {
      ve = e;
    }
    var tf;
    function Kv(e) {
      tf = e;
    }
    var Jv;
    function Ds(e) {
      Jv = e;
    }
    var Os;
    function jd(e) {
      Os = e;
    }
    var nf = !1, Ls = [], Ki = null, _i = null, ki = null, wn = /* @__PURE__ */ new Map(), Mr = /* @__PURE__ */ new Map(), Nr = [], Zv = [
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
    function ai(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function Fd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Ki = null;
          break;
        case "dragenter":
        case "dragleave":
          _i = null;
          break;
        case "mouseover":
        case "mouseout":
          ki = null;
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
          Mr.delete(i);
          break;
        }
      }
    }
    function ea(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ai(t, a, i, u, s);
        if (t !== null) {
          var p = ko(t);
          p !== null && ve(p);
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
          return Ki = ea(Ki, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return _i = ea(_i, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return ki = ea(ki, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return wn.set(y, ea(wn.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var g = u, w = g.pointerId;
          return Mr.set(w, ea(Mr.get(w) || null, e, t, a, i, g)), !0;
        }
      }
      return !1;
    }
    function Hd(e) {
      var t = Ys(e.target);
      if (t !== null) {
        var a = da(t);
        if (a !== null) {
          var i = a.tag;
          if (i === _e) {
            var u = Ti(a);
            if (u !== null) {
              e.blockedOn = u, Os(e.priority, function() {
                tf(a);
              });
              return;
            }
          } else if (i === Z) {
            var s = a.stateNode;
            if (ef(s)) {
              e.blockedOn = xi(a);
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
      }, i = 0; i < Nr.length && Zn(t, Nr[i].priority); i++)
        ;
      Nr.splice(i, 0, a), i === 0 && Hd(a);
    }
    function Ms(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Co(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          ly(s), u.target.dispatchEvent(s), uy();
        } else {
          var f = ko(i);
          return f !== null && ve(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Pd(e, t, a) {
      Ms(e) && a.delete(t);
    }
    function py() {
      nf = !1, Ki !== null && Ms(Ki) && (Ki = null), _i !== null && Ms(_i) && (_i = null), ki !== null && Ms(ki) && (ki = null), wn.forEach(Pd), Mr.forEach(Pd);
    }
    function Ul(e, t) {
      e.blockedOn === t && (e.blockedOn = null, nf || (nf = !0, G.unstable_scheduleCallback(G.unstable_NormalPriority, py)));
    }
    function ku(e) {
      if (Ls.length > 0) {
        Ul(Ls[0], e);
        for (var t = 1; t < Ls.length; t++) {
          var a = Ls[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ki !== null && Ul(Ki, e), _i !== null && Ul(_i, e), ki !== null && Ul(ki, e);
      var i = function(p) {
        return Ul(p, e);
      };
      wn.forEach(i), Mr.forEach(i);
      for (var u = 0; u < Nr.length; u++) {
        var s = Nr[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Nr.length > 0; ) {
        var f = Nr[0];
        if (f.blockedOn !== null)
          break;
        Hd(f), f.blockedOn === null && Nr.shift();
      }
    }
    var or = M.ReactCurrentBatchConfig, Ct = !0;
    function Wn(e) {
      Ct = !!e;
    }
    function Fn() {
      return Ct;
    }
    function sr(e, t, a) {
      var i = rf(t), u;
      switch (i) {
        case Lr:
          u = ma;
          break;
        case wi:
          u = Eo;
          break;
        case Na:
        default:
          u = _n;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ma(e, t, a, i) {
      var u = Ua(), s = or.transition;
      or.transition = null;
      try {
        jn(Lr), _n(e, t, a, i);
      } finally {
        jn(u), or.transition = s;
      }
    }
    function Eo(e, t, a, i) {
      var u = Ua(), s = or.transition;
      or.transition = null;
      try {
        jn(wi), _n(e, t, a, i);
      } finally {
        jn(u), or.transition = s;
      }
    }
    function _n(e, t, a, i) {
      Ct && Ns(e, t, a, i);
    }
    function Ns(e, t, a, i) {
      var u = Co(e, t, a, i);
      if (u === null) {
        Oy(e, t, i, Di, a), Fd(e, i);
        return;
      }
      if (dy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Fd(e, i), t & _a && eh(e)) {
        for (; u !== null; ) {
          var s = ko(u);
          s !== null && fy(s);
          var f = Co(e, t, a, i);
          if (f === null && Oy(e, t, i, Di, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Oy(e, t, i, null, a);
    }
    var Di = null;
    function Co(e, t, a, i) {
      Di = null;
      var u = dd(i), s = Ys(u);
      if (s !== null) {
        var f = da(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === _e) {
            var v = Ti(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === Z) {
            var y = f.stateNode;
            if (ef(y))
              return xi(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Di = s, null;
    }
    function rf(e) {
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
          return Lr;
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
          return wi;
        case "message": {
          var t = _c();
          switch (t) {
            case os:
              return Lr;
            case Ol:
              return wi;
            case Gi:
            case cy:
              return Na;
            case hu:
              return za;
            default:
              return Na;
          }
        }
        default:
          return Na;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ta(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Vd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Ro(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ya = null, To = null, Du = null;
    function Al(e) {
      return ya = e, To = Us(), !0;
    }
    function af() {
      ya = null, To = null, Du = null;
    }
    function Ji() {
      if (Du)
        return Du;
      var e, t = To, a = t.length, i, u = Us(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Du = u.slice(e, p), Du;
    }
    function Us() {
      return "value" in ya ? ya.value : ya.textContent;
    }
    function jl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function xo() {
      return !0;
    }
    function As() {
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
        return y ? this.isDefaultPrevented = xo : this.isDefaultPrevented = As, this.isPropagationStopped = As, this;
      }
      return Je(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = xo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = xo);
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
        isPersistent: xo
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
    }, Oi = xr(Hn), zr = Je({}, Hn, {
      view: 0,
      detail: 0
    }), na = xr(zr), lf, js, Ou;
    function vy(e) {
      e !== Ou && (Ou && e.type === "mousemove" ? (lf = e.screenX - Ou.screenX, js = e.screenY - Ou.screenY) : (lf = 0, js = 0), Ou = e);
    }
    var ii = Je({}, zr, {
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
        return "movementX" in e ? e.movementX : (vy(e), lf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : js;
      }
    }), Bd = xr(ii), Yd = Je({}, ii, {
      dataTransfer: 0
    }), Lu = xr(Yd), Id = Je({}, zr, {
      relatedTarget: 0
    }), Zi = xr(Id), nh = Je({}, Hn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), rh = xr(nh), $d = Je({}, Hn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), uf = xr($d), hy = Je({}, Hn, {
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
    }, Mu = {
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
        var a = jl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Mu[e.keyCode] || "Unidentified" : "";
    }
    var bo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function uh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = bo[e];
      return i ? !!a[i] : !1;
    }
    function pn(e) {
      return uh;
    }
    var yy = Je({}, zr, {
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
        return e.type === "keypress" ? jl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? jl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), oh = xr(yy), gy = Je({}, ii, {
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
    }), sh = xr(gy), ch = Je({}, zr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: pn
    }), fh = xr(ch), Sy = Je({}, Hn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Aa = xr(Sy), Qd = Je({}, ii, {
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
    }), Ey = xr(Qd), Fl = [9, 13, 27, 32], Fs = 229, el = On && "CompositionEvent" in window, Hl = null;
    On && "documentMode" in document && (Hl = document.documentMode);
    var Wd = On && "TextEvent" in window && !Hl, of = On && (!el || Hl && Hl > 8 && Hl <= 11), dh = 32, sf = String.fromCharCode(dh);
    function Cy() {
      at("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), at("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), at("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), at("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Gd = !1;
    function ph(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function cf(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function ff(e, t) {
      return e === "keydown" && t.keyCode === Fs;
    }
    function qd(e, t) {
      switch (e) {
        case "keyup":
          return Fl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Fs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function df(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function vh(e) {
      return e.locale === "ko";
    }
    var Nu = !1;
    function Xd(e, t, a, i, u) {
      var s, f;
      if (el ? s = cf(t) : Nu ? qd(t, i) && (s = "onCompositionEnd") : ff(t, i) && (s = "onCompositionStart"), !s)
        return null;
      of && !vh(i) && (!Nu && s === "onCompositionStart" ? Nu = Al(u) : s === "onCompositionEnd" && Nu && (f = Ji()));
      var p = Ch(a, s);
      if (p.length > 0) {
        var v = new ah(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = df(i);
          y !== null && (v.data = y);
        }
      }
    }
    function pf(e, t) {
      switch (e) {
        case "compositionend":
          return df(t);
        case "keypress":
          var a = t.which;
          return a !== dh ? null : (Gd = !0, sf);
        case "textInput":
          var i = t.data;
          return i === sf && Gd ? null : i;
        default:
          return null;
      }
    }
    function Kd(e, t) {
      if (Nu) {
        if (e === "compositionend" || !el && qd(e, t)) {
          var a = Ji();
          return af(), Nu = !1, a;
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
          return of && !vh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function vf(e, t, a, i, u) {
      var s;
      if (Wd ? s = pf(t, i) : s = Kd(t, i), !s)
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
      Xd(e, t, a, i, u), vf(e, t, a, i, u);
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
    function Hs(e) {
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
    function Ps() {
      at("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function mh(e, t, a, i) {
      uo(i);
      var u = Ch(t, "onChange");
      if (u.length > 0) {
        var s = new Oi("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var Pl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      mh(t, n, e, dd(e)), kv(o, t);
    }
    function o(e) {
      kE(e, 0);
    }
    function c(e) {
      var t = Ef(e);
      if (yi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    On && (m = Ty("input") && (!document.documentMode || document.documentMode > 9));
    function E(e, t) {
      Pl = e, n = t, Pl.attachEvent("onpropertychange", U);
    }
    function T() {
      Pl && (Pl.detachEvent("onpropertychange", U), Pl = null, n = null);
    }
    function U(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function Q(e, t, a) {
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
    function ce(e, t) {
      if (e === "click")
        return c(t);
    }
    function me(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Se(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Le(e, "number", e.value);
    }
    function kn(e, t, a, i, u, s, f) {
      var p = a ? Ef(a) : window, v, y;
      if (r(p) ? v = d : Hs(p) ? m ? v = me : (v = q, y = Q) : $(p) && (v = ce), v) {
        var g = v(t, a);
        if (g) {
          mh(e, g, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && Se(p);
    }
    function k() {
      Bt("onMouseEnter", ["mouseout", "mouseover"]), Bt("onMouseLeave", ["mouseout", "mouseover"]), Bt("onPointerEnter", ["pointerout", "pointerover"]), Bt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function b(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !ns(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Ys(y) || fp(y)))
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
        var x, N;
        if (v) {
          var A = i.relatedTarget || i.toElement;
          if (x = a, N = A ? Ys(A) : null, N !== null) {
            var F = da(N);
            (N !== F || N.tag !== ue && N.tag !== $e) && (N = null);
          }
        } else
          x = null, N = a;
        if (x !== N) {
          var le = Bd, Me = "onMouseLeave", be = "onMouseEnter", Tt = "mouse";
          (t === "pointerout" || t === "pointerover") && (le = sh, Me = "onPointerLeave", be = "onPointerEnter", Tt = "pointer");
          var ht = x == null ? g : Ef(x), D = N == null ? g : Ef(N), H = new le(Me, Tt + "leave", x, i, u);
          H.target = ht, H.relatedTarget = D;
          var O = null, X = Ys(u);
          if (X === a) {
            var pe = new le(be, Tt + "enter", N, i, u);
            pe.target = D, pe.relatedTarget = ht, O = pe;
          }
          DT(e, H, O, x, N);
        }
      }
    }
    function L(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var W = typeof Object.is == "function" ? Object.is : L;
    function ye(e, t) {
      if (W(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!br.call(t, s) || !W(e[s], t[s]))
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
    function Ve(e, t) {
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
      return Nt(e, u, s, f, p);
    }
    function Nt(e, t, a, i, u) {
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
    function Vl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var y = Ve(e, f), g = Ve(e, p);
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
    function fT(e) {
      return e && e.ownerDocument && yE(e.ownerDocument.documentElement, e);
    }
    function dT(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function gE() {
      for (var e = window, t = wa(); t instanceof e.HTMLIFrameElement; ) {
        if (dT(t))
          e = t.contentWindow;
        else
          return t;
        t = wa(e.document);
      }
      return t;
    }
    function xy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function pT() {
      var e = gE();
      return {
        focusedElem: e,
        selectionRange: xy(e) ? hT(e) : null
      };
    }
    function vT(e) {
      var t = gE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && fT(a)) {
        i !== null && xy(a) && mT(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === Qr && u.push({
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
    function hT(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = er(e), t || {
        start: 0,
        end: 0
      };
    }
    function mT(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Vl(e, t);
    }
    var yT = On && "documentMode" in document && document.documentMode <= 11;
    function gT() {
      at("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var hf = null, by = null, Jd = null, wy = !1;
    function ST(e) {
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
    function ET(e) {
      return e.window === e ? e.document : e.nodeType === Ii ? e : e.ownerDocument;
    }
    function SE(e, t, a) {
      var i = ET(a);
      if (!(wy || hf == null || hf !== wa(i))) {
        var u = ST(hf);
        if (!Jd || !ye(Jd, u)) {
          Jd = u;
          var s = Ch(by, "onSelect");
          if (s.length > 0) {
            var f = new Oi("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = hf;
          }
        }
      }
    }
    function CT(e, t, a, i, u, s, f) {
      var p = a ? Ef(a) : window;
      switch (t) {
        // Track the input node that has focus.
        case "focusin":
          (Hs(p) || p.contentEditable === "true") && (hf = p, by = a, Jd = null);
          break;
        case "focusout":
          hf = null, by = null, Jd = null;
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
          if (yT)
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
    var mf = {
      animationend: gh("Animation", "AnimationEnd"),
      animationiteration: gh("Animation", "AnimationIteration"),
      animationstart: gh("Animation", "AnimationStart"),
      transitionend: gh("Transition", "TransitionEnd")
    }, _y = {}, EE = {};
    On && (EE = document.createElement("div").style, "AnimationEvent" in window || (delete mf.animationend.animation, delete mf.animationiteration.animation, delete mf.animationstart.animation), "TransitionEvent" in window || delete mf.transitionend.transition);
    function Sh(e) {
      if (_y[e])
        return _y[e];
      if (!mf[e])
        return e;
      var t = mf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in EE)
          return _y[e] = t[a];
      return e;
    }
    var CE = Sh("animationend"), RE = Sh("animationiteration"), TE = Sh("animationstart"), xE = Sh("transitionend"), bE = /* @__PURE__ */ new Map(), wE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function wo(e, t) {
      bE.set(e, t), at(t, [e]);
    }
    function RT() {
      for (var e = 0; e < wE.length; e++) {
        var t = wE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        wo(a, "on" + i);
      }
      wo(CE, "onAnimationEnd"), wo(RE, "onAnimationIteration"), wo(TE, "onAnimationStart"), wo("dblclick", "onDoubleClick"), wo("focusin", "onFocus"), wo("focusout", "onBlur"), wo(xE, "onTransitionEnd");
    }
    function TT(e, t, a, i, u, s, f) {
      var p = bE.get(t);
      if (p !== void 0) {
        var v = Oi, y = t;
        switch (t) {
          case "keypress":
            if (jl(i) === 0)
              return;
          /* falls through */
          case "keydown":
          case "keyup":
            v = oh;
            break;
          case "focusin":
            y = "focus", v = Zi;
            break;
          case "focusout":
            y = "blur", v = Zi;
            break;
          case "beforeblur":
          case "afterblur":
            v = Zi;
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
            v = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Lu;
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
            v = Aa;
            break;
          case "scroll":
            v = na;
            break;
          case "wheel":
            v = Ey;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = uf;
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
        var g = (s & _a) !== 0;
        {
          var w = !g && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", x = _T(a, p, i.type, g, w);
          if (x.length > 0) {
            var N = new v(p, y, null, i, u);
            e.push({
              event: N,
              listeners: x
            });
          }
        }
      }
    }
    RT(), k(), Ps(), gT(), Cy();
    function xT(e, t, a, i, u, s, f) {
      TT(e, t, a, i, u, s);
      var p = (s & fd) === 0;
      p && (b(e, t, a, i, u), kn(e, t, a, i, u), CT(e, t, a, i, u), hh(e, t, a, i, u));
    }
    var Zd = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], ky = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(Zd));
    function _E(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ei(i, t, void 0, e), e.currentTarget = null;
    }
    function bT(e, t, a) {
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
          var g = t[y], w = g.instance, x = g.currentTarget, N = g.listener;
          if (w !== i && e.isPropagationStopped())
            return;
          _E(e, N, x), i = w;
        }
    }
    function kE(e, t) {
      for (var a = (t & _a) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        bT(s, f, a);
      }
      is();
    }
    function wT(e, t, a, i, u) {
      var s = dd(a), f = [];
      xT(f, e, i, a, s, t), kE(f, t);
    }
    function Sn(e, t) {
      ky.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = nb(t), u = OT(e);
      i.has(u) || (DE(t, e, vc, a), i.add(u));
    }
    function Dy(e, t, a) {
      ky.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= _a), DE(a, e, i, t);
    }
    var Eh = "_reactListening" + Math.random().toString(36).slice(2);
    function ep(e) {
      if (!e[Eh]) {
        e[Eh] = !0, Ze.forEach(function(a) {
          a !== "selectionchange" && (ky.has(a) || Dy(a, !1, e), Dy(a, !0, e));
        });
        var t = e.nodeType === Ii ? e : e.ownerDocument;
        t !== null && (t[Eh] || (t[Eh] = !0, Dy("selectionchange", !1, t)));
      }
    }
    function DE(e, t, a, i, u) {
      var s = sr(e, t, a), f = void 0;
      as && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Vd(e, t, s, f) : ta(e, t, s) : f !== void 0 ? Ro(e, t, s, f) : zs(e, t, s);
    }
    function OE(e, t) {
      return e === t || e.nodeType === Mn && e.parentNode === t;
    }
    function Oy(e, t, a, i, u) {
      var s = i;
      if ((t & cd) === 0 && (t & vc) === 0) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === Z || v === Re) {
              var y = p.stateNode.containerInfo;
              if (OE(y, f))
                break;
              if (v === Re)
                for (var g = p.return; g !== null; ) {
                  var w = g.tag;
                  if (w === Z || w === Re) {
                    var x = g.stateNode.containerInfo;
                    if (OE(x, f))
                      return;
                  }
                  g = g.return;
                }
              for (; y !== null; ) {
                var N = Ys(y);
                if (N === null)
                  return;
                var A = N.tag;
                if (A === ue || A === $e) {
                  p = s = N;
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
        return wT(e, t, a, s);
      });
    }
    function tp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function _T(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, g = null; y !== null; ) {
        var w = y, x = w.stateNode, N = w.tag;
        if (N === ue && x !== null && (g = x, p !== null)) {
          var A = xl(y, p);
          A != null && v.push(tp(y, A, g));
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
        if (p === ue && f !== null) {
          var v = f, y = xl(u, a);
          y != null && i.unshift(tp(u, y, v));
          var g = xl(u, t);
          g != null && i.push(tp(u, g, v));
        }
        u = u.return;
      }
      return i;
    }
    function yf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ue);
      return e || null;
    }
    function kT(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = yf(s))
        u++;
      for (var f = 0, p = i; p; p = yf(p))
        f++;
      for (; u - f > 0; )
        a = yf(a), u--;
      for (; f - u > 0; )
        i = yf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = yf(a), i = yf(i);
      }
      return null;
    }
    function LE(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, g = v.stateNode, w = v.tag;
        if (y !== null && y === i)
          break;
        if (w === ue && g !== null) {
          var x = g;
          if (u) {
            var N = xl(p, s);
            N != null && f.unshift(tp(p, N, x));
          } else if (!u) {
            var A = xl(p, s);
            A != null && f.push(tp(p, A, x));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function DT(e, t, a, i, u) {
      var s = i && u ? kT(i, u) : null;
      i !== null && LE(e, t, i, s, !1), u !== null && a !== null && LE(e, a, u, s, !0);
    }
    function OT(e, t) {
      return e + "__bubble";
    }
    var ja = !1, np = "dangerouslySetInnerHTML", Rh = "suppressContentEditableWarning", _o = "suppressHydrationWarning", ME = "autoFocus", Vs = "children", Bs = "style", Th = "__html", Ly, xh, rp, NE, bh, zE, UE;
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
      ud(e, t), dc(e, t), bv(e, t, {
        registrationNameDependencies: Ke,
        possibleRegistrationNames: et
      });
    }, zE = On && !document.documentMode, rp = function(e, t, a) {
      if (!ja) {
        var i = wh(a), u = wh(t);
        u !== i && (ja = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, NE = function(e) {
      if (!ja) {
        ja = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, bh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, UE = function(e, t) {
      var a = e.namespaceURI === Bi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var LT = /\r\n?/g, MT = /\u0000|\uFFFD/g;
    function wh(e) {
      qn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(LT, `
`).replace(MT, "");
    }
    function _h(e, t, a, i) {
      var u = wh(t), s = wh(e);
      if (s !== u && (i && (ja || (ja = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Ce))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function AE(e) {
      return e.nodeType === Ii ? e : e.ownerDocument;
    }
    function NT() {
    }
    function kh(e) {
      e.onclick = NT;
    }
    function zT(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Bs)
            f && Object.freeze(f), Sv(t, f);
          else if (s === np) {
            var p = f ? f[Th] : void 0;
            p != null && uv(t, p);
          } else if (s === Vs)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && ro(t, f);
            } else typeof f == "number" && ro(t, "" + f);
          else s === Rh || s === _o || s === ME || (Ke.hasOwnProperty(s) ? f != null && (typeof f != "function" && bh(s, f), s === "onScroll" && Sn("scroll", t)) : f != null && wr(t, s, f, u));
        }
    }
    function UT(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Bs ? Sv(e, f) : s === np ? uv(e, f) : s === Vs ? ro(e, f) : wr(e, s, f, i);
      }
    }
    function AT(e, t, a, i) {
      var u, s = AE(a), f, p = i;
      if (p === Bi && (p = ed(e)), p === Bi) {
        if (u = Rl(e, t), !u && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
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
      return p === Bi && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !br.call(Ly, e) && (Ly[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function jT(e, t) {
      return AE(t).createTextNode(e);
    }
    function FT(e, t, a, i) {
      var u = Rl(t, a);
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
          for (var f = 0; f < Zd.length; f++)
            Sn(Zd[f], e);
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
          Za(e, a), s = no(e, a), Sn("invalid", e);
          break;
        case "option":
          bt(e, a), s = a;
          break;
        case "select":
          uu(e, a), s = qo(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Kf(e, a), s = Xf(e, a), Sn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (cc(t, s), zT(t, e, i, s, u), t) {
        case "input":
          Ja(e), z(e, a, !1);
          break;
        case "textarea":
          Ja(e), iv(e);
          break;
        case "option":
          nn(e, a);
          break;
        case "select":
          Gf(e, a);
          break;
        default:
          typeof s.onClick == "function" && kh(e);
          break;
      }
    }
    function HT(e, t, a, i, u) {
      xh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = no(e, a), p = no(e, i), s = [];
          break;
        case "select":
          f = qo(e, a), p = qo(e, i), s = [];
          break;
        case "textarea":
          f = Xf(e, a), p = Xf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && kh(e);
          break;
      }
      cc(t, p);
      var v, y, g = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Bs) {
            var w = f[v];
            for (y in w)
              w.hasOwnProperty(y) && (g || (g = {}), g[y] = "");
          } else v === np || v === Vs || v === Rh || v === _o || v === ME || (Ke.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var x = p[v], N = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || x === N || x == null && N == null))
          if (v === Bs)
            if (x && Object.freeze(x), N) {
              for (y in N)
                N.hasOwnProperty(y) && (!x || !x.hasOwnProperty(y)) && (g || (g = {}), g[y] = "");
              for (y in x)
                x.hasOwnProperty(y) && N[y] !== x[y] && (g || (g = {}), g[y] = x[y]);
            } else
              g || (s || (s = []), s.push(v, g)), g = x;
          else if (v === np) {
            var A = x ? x[Th] : void 0, F = N ? N[Th] : void 0;
            A != null && F !== A && (s = s || []).push(v, A);
          } else v === Vs ? (typeof x == "string" || typeof x == "number") && (s = s || []).push(v, "" + x) : v === Rh || v === _o || (Ke.hasOwnProperty(v) ? (x != null && (typeof x != "function" && bh(v, x), v === "onScroll" && Sn("scroll", e)), !s && N !== x && (s = [])) : (s = s || []).push(v, x));
      }
      return g && (ay(g, p[Bs]), (s = s || []).push(Bs, g)), s;
    }
    function PT(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = Rl(a, i), f = Rl(a, u);
      switch (UT(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          av(e, u);
          break;
        case "select":
          uc(e, u);
          break;
      }
    }
    function VT(e) {
      {
        var t = e.toLowerCase();
        return es.hasOwnProperty(t) && es[t] || null;
      }
    }
    function BT(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = Rl(t, a), xh(t, a), t) {
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
          for (var y = 0; y < Zd.length; y++)
            Sn(Zd[y], e);
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
          Za(e, a), Sn("invalid", e);
          break;
        case "option":
          bt(e, a);
          break;
        case "select":
          uu(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Kf(e, a), Sn("invalid", e);
          break;
      }
      cc(t, a);
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
      var N = null;
      for (var A in a)
        if (a.hasOwnProperty(A)) {
          var F = a[A];
          if (A === Vs)
            typeof F == "string" ? e.textContent !== F && (a[_o] !== !0 && _h(e.textContent, F, s, f), N = [Vs, F]) : typeof F == "number" && e.textContent !== "" + F && (a[_o] !== !0 && _h(e.textContent, F, s, f), N = [Vs, "" + F]);
          else if (Ke.hasOwnProperty(A))
            F != null && (typeof F != "function" && bh(A, F), A === "onScroll" && Sn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var le = void 0, Me = en(A);
            if (a[_o] !== !0) {
              if (!(A === Rh || A === _o || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              A === "value" || A === "checked" || A === "selected")) {
                if (A === np) {
                  var be = e.innerHTML, Tt = F ? F[Th] : void 0;
                  if (Tt != null) {
                    var ht = UE(e, Tt);
                    ht !== be && rp(A, be, ht);
                  }
                } else if (A === Bs) {
                  if (v.delete(A), zE) {
                    var D = ny(F);
                    le = e.getAttribute("style"), D !== le && rp(A, le, D);
                  }
                } else if (p && !_)
                  v.delete(A.toLowerCase()), le = eu(e, A, F), F !== le && rp(A, le, F);
                else if (!vn(A, Me, p) && !Xn(A, F, Me, p)) {
                  var H = !1;
                  if (Me !== null)
                    v.delete(Me.attributeName), le = pl(e, A, F, Me);
                  else {
                    var O = i;
                    if (O === Bi && (O = ed(t)), O === Bi)
                      v.delete(A.toLowerCase());
                    else {
                      var X = VT(A);
                      X !== null && X !== A && (H = !0, v.delete(X)), v.delete(A);
                    }
                    le = eu(e, A, F);
                  }
                  var pe = _;
                  !pe && F !== le && !H && rp(A, le, F);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[_o] !== !0 && NE(v), t) {
        case "input":
          Ja(e), z(e, a, !0);
          break;
        case "textarea":
          Ja(e), iv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && kh(e);
          break;
      }
      return N;
    }
    function YT(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function My(e, t) {
      {
        if (ja)
          return;
        ja = !0, S("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Ny(e, t) {
      {
        if (ja)
          return;
        ja = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function zy(e, t, a) {
      {
        if (ja)
          return;
        ja = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Uy(e, t) {
      {
        if (t === "" || ja)
          return;
        ja = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function IT(e, t, a) {
      switch (t) {
        case "input":
          j(e, a);
          return;
        case "textarea":
          Jm(e, a);
          return;
        case "select":
          qf(e, a);
          return;
      }
    }
    var ap = function() {
    }, ip = function() {
    };
    {
      var $T = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], jE = [
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
      ], QT = jE.concat(["button"]), WT = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], FE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      ip = function(e, t) {
        var a = Je({}, e || FE), i = {
          tag: t
        };
        return jE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), QT.indexOf(t) !== -1 && (a.pTagInButtonScope = null), $T.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var GT = function(e, t) {
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
            return WT.indexOf(t) === -1;
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
      }, qT = function(e, t) {
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
      ap = function(e, t, a) {
        a = a || FE;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = GT(e, u) ? null : i, f = s ? null : qT(e, a), p = s || f;
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
    var Dh = "suppressHydrationWarning", Oh = "$", Lh = "/$", lp = "$?", up = "$!", XT = "style", Ay = null, jy = null;
    function KT(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Ii:
        case nd: {
          t = i === Ii ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : td(null, "");
          break;
        }
        default: {
          var s = i === Mn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = td(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = ip(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function JT(e, t, a) {
      {
        var i = e, u = td(i.namespace, t), s = ip(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function yk(e) {
      return e;
    }
    function ZT(e) {
      Ay = Fn(), jy = pT();
      var t = null;
      return Wn(!1), t;
    }
    function ex(e) {
      vT(jy), Wn(Ay), Ay = null, jy = null;
    }
    function tx(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (ap(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = ip(f.ancestorInfo, e);
          ap(null, p, v);
        }
        s = f.namespace;
      }
      var y = AT(e, t, a, s);
      return cp(u, y), $y(y, t), y;
    }
    function nx(e, t) {
      e.appendChild(t);
    }
    function rx(e, t, a, i, u) {
      switch (FT(e, t, a, i), t) {
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
    function ax(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = ip(f.ancestorInfo, t);
          ap(null, p, v);
        }
      }
      return HT(e, t, a, i);
    }
    function Fy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function ix(e, t, a, i) {
      {
        var u = a;
        ap(null, e, u.ancestorInfo);
      }
      var s = jT(e, t);
      return cp(i, s), s;
    }
    function lx() {
      var e = window.event;
      return e === void 0 ? Na : rf(e.type);
    }
    var Hy = typeof setTimeout == "function" ? setTimeout : void 0, ux = typeof clearTimeout == "function" ? clearTimeout : void 0, Py = -1, PE = typeof Promise == "function" ? Promise : void 0, ox = typeof queueMicrotask == "function" ? queueMicrotask : typeof PE < "u" ? function(e) {
      return PE.resolve(null).then(e).catch(sx);
    } : Hy;
    function sx(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function cx(e, t, a, i) {
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
    function fx(e, t, a, i, u, s) {
      PT(e, t, a, i, u), $y(e, u);
    }
    function VE(e) {
      ro(e, "");
    }
    function dx(e, t, a) {
      e.nodeValue = a;
    }
    function px(e, t) {
      e.appendChild(t);
    }
    function vx(e, t) {
      var a;
      e.nodeType === Mn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && kh(a);
    }
    function hx(e, t, a) {
      e.insertBefore(t, a);
    }
    function mx(e, t, a) {
      e.nodeType === Mn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function yx(e, t) {
      e.removeChild(t);
    }
    function gx(e, t) {
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
              e.removeChild(u), ku(t);
              return;
            } else
              i--;
          else (s === Oh || s === lp || s === up) && i++;
        }
        a = u;
      } while (a);
      ku(t);
    }
    function Sx(e, t) {
      e.nodeType === Mn ? Vy(e.parentNode, t) : e.nodeType === Qr && Vy(e, t), ku(e);
    }
    function Ex(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function Cx(e) {
      e.nodeValue = "";
    }
    function Rx(e, t) {
      e = e;
      var a = t[XT], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = sc("display", i);
    }
    function Tx(e, t) {
      e.nodeValue = t;
    }
    function xx(e) {
      e.nodeType === Qr ? e.textContent = "" : e.nodeType === Ii && e.documentElement && e.removeChild(e.documentElement);
    }
    function bx(e, t, a) {
      return e.nodeType !== Qr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function wx(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function _x(e) {
      return e.nodeType !== Mn ? null : e;
    }
    function BE(e) {
      return e.data === lp;
    }
    function By(e) {
      return e.data === up;
    }
    function kx(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Dx(e, t) {
      e._reactRetry = t;
    }
    function Mh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Qr || t === Yi)
          break;
        if (t === Mn) {
          var a = e.data;
          if (a === Oh || a === up || a === lp)
            break;
          if (a === Lh)
            return null;
        }
      }
      return e;
    }
    function op(e) {
      return Mh(e.nextSibling);
    }
    function Ox(e) {
      return Mh(e.firstChild);
    }
    function Lx(e) {
      return Mh(e.firstChild);
    }
    function Mx(e) {
      return Mh(e.nextSibling);
    }
    function Nx(e, t, a, i, u, s, f) {
      cp(s, e), $y(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & lt) !== De;
      return BT(e, t, a, p, i, y, f);
    }
    function zx(e, t, a, i) {
      return cp(a, e), a.mode & lt, YT(e, t);
    }
    function Ux(e, t) {
      cp(t, e);
    }
    function Ax(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Lh) {
            if (a === 0)
              return op(t);
            a--;
          } else (i === Oh || i === up || i === lp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function YE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Oh || i === up || i === lp) {
            if (a === 0)
              return t;
            a--;
          } else i === Lh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function jx(e) {
      ku(e);
    }
    function Fx(e) {
      ku(e);
    }
    function Hx(e) {
      return e !== "head" && e !== "body";
    }
    function Px(e, t, a, i) {
      var u = !0;
      _h(t.nodeValue, a, i, u);
    }
    function Vx(e, t, a, i, u, s) {
      if (t[Dh] !== !0) {
        var f = !0;
        _h(i.nodeValue, u, s, f);
      }
    }
    function Bx(e, t) {
      t.nodeType === Qr ? My(e, t) : t.nodeType === Mn || Ny(e, t);
    }
    function Yx(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Qr ? My(a, t) : t.nodeType === Mn || Ny(a, t));
      }
    }
    function Ix(e, t, a, i, u) {
      (u || t[Dh] !== !0) && (i.nodeType === Qr ? My(a, i) : i.nodeType === Mn || Ny(a, i));
    }
    function $x(e, t, a) {
      zy(e, t);
    }
    function Qx(e, t) {
      Uy(e, t);
    }
    function Wx(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && zy(i, t);
      }
    }
    function Gx(e, t) {
      {
        var a = e.parentNode;
        a !== null && Uy(a, t);
      }
    }
    function qx(e, t, a, i, u, s) {
      (s || t[Dh] !== !0) && zy(a, i);
    }
    function Xx(e, t, a, i, u) {
      (u || t[Dh] !== !0) && Uy(a, i);
    }
    function Kx(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function Jx(e) {
      ep(e);
    }
    var gf = Math.random().toString(36).slice(2), Sf = "__reactFiber$" + gf, Yy = "__reactProps$" + gf, sp = "__reactContainer$" + gf, Iy = "__reactEvents$" + gf, Zx = "__reactListeners$" + gf, eb = "__reactHandles$" + gf;
    function tb(e) {
      delete e[Sf], delete e[Yy], delete e[Iy], delete e[Zx], delete e[eb];
    }
    function cp(e, t) {
      t[Sf] = e;
    }
    function Nh(e, t) {
      t[sp] = e;
    }
    function IE(e) {
      e[sp] = null;
    }
    function fp(e) {
      return !!e[sp];
    }
    function Ys(e) {
      var t = e[Sf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[sp] || a[Sf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = YE(e); u !== null; ) {
              var s = u[Sf];
              if (s)
                return s;
              u = YE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function ko(e) {
      var t = e[Sf] || e[sp];
      return t && (t.tag === ue || t.tag === $e || t.tag === _e || t.tag === Z) ? t : null;
    }
    function Ef(e) {
      if (e.tag === ue || e.tag === $e)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function zh(e) {
      return e[Yy] || null;
    }
    function $y(e, t) {
      e[Yy] = t;
    }
    function nb(e) {
      var t = e[Iy];
      return t === void 0 && (t = e[Iy] = /* @__PURE__ */ new Set()), t;
    }
    var $E = {}, QE = M.ReactDebugCurrentFrame;
    function Uh(e) {
      if (e) {
        var t = e._owner, a = Hi(e.type, e._source, t ? t.type : null);
        QE.setExtraStackFrame(a);
      } else
        QE.setExtraStackFrame(null);
    }
    function tl(e, t, a, i, u) {
      {
        var s = Function.call.bind(br);
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
    var zu = -1;
    function Do(e) {
      return {
        current: e
      };
    }
    function ra(e, t) {
      if (zu < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== Ah[zu] && S("Unexpected Fiber popped."), e.current = Qy[zu], Qy[zu] = null, Ah[zu] = null, zu--;
    }
    function aa(e, t, a) {
      zu++, Qy[zu] = e.current, Ah[zu] = a, e.current = t;
    }
    var Wy;
    Wy = {};
    var li = {};
    Object.freeze(li);
    var Uu = Do(li), Bl = Do(!1), Gy = li;
    function Cf(e, t, a) {
      return a && Yl(t) ? Gy : Uu.current;
    }
    function WE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return li;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = Be(e) || "Unknown";
          tl(i, s, "context", p);
        }
        return u && WE(e, t, s), s;
      }
    }
    function jh() {
      return Bl.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Fh(e) {
      ra(Bl, e), ra(Uu, e);
    }
    function qy(e) {
      ra(Bl, e), ra(Uu, e);
    }
    function GE(e, t, a) {
      {
        if (Uu.current !== li)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        aa(Uu, t, e), aa(Bl, a, e);
      }
    }
    function qE(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Be(e) || "Unknown";
            Wy[s] || (Wy[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((Be(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Be(e) || "Unknown";
          tl(u, f, "child context", v);
        }
        return Je({}, a, f);
      }
    }
    function Hh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || li;
        return Gy = Uu.current, aa(Uu, a, e), aa(Bl, Bl.current, e), !0;
      }
    }
    function XE(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = qE(e, t, Gy);
          i.__reactInternalMemoizedMergedChildContext = u, ra(Bl, e), ra(Uu, e), aa(Uu, u, e), aa(Bl, a, e);
        } else
          ra(Bl, e), aa(Bl, a, e);
      }
    }
    function rb(e) {
      {
        if (!vu(e) || e.tag !== de)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case Z:
              return t.stateNode.context;
            case de: {
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
    var Oo = 0, Ph = 1, Au = null, Xy = !1, Ky = !1;
    function KE(e) {
      Au === null ? Au = [e] : Au.push(e);
    }
    function ab(e) {
      Xy = !0, KE(e);
    }
    function JE() {
      Xy && Lo();
    }
    function Lo() {
      if (!Ky && Au !== null) {
        Ky = !0;
        var e = 0, t = Ua();
        try {
          var a = !0, i = Au;
          for (jn(Lr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Au = null, Xy = !1;
        } catch (s) {
          throw Au !== null && (Au = Au.slice(e + 1)), vd(os, Lo), s;
        } finally {
          jn(t), Ky = !1;
        }
      }
      return null;
    }
    var Tf = [], xf = 0, Vh = null, Bh = 0, Li = [], Mi = 0, Is = null, ju = 1, Fu = "";
    function ib(e) {
      return Qs(), (e.flags & Ci) !== ke;
    }
    function lb(e) {
      return Qs(), Bh;
    }
    function ub() {
      var e = Fu, t = ju, a = t & ~ob(t);
      return a.toString(32) + e;
    }
    function $s(e, t) {
      Qs(), Tf[xf++] = Bh, Tf[xf++] = Vh, Vh = e, Bh = t;
    }
    function ZE(e, t, a) {
      Qs(), Li[Mi++] = ju, Li[Mi++] = Fu, Li[Mi++] = Is, Is = e;
      var i = ju, u = Fu, s = Yh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Yh(t) + s;
      if (v > 30) {
        var y = s - s % 5, g = (1 << y) - 1, w = (f & g).toString(32), x = f >> y, N = s - y, A = Yh(t) + N, F = p << N, le = F | x, Me = w + u;
        ju = 1 << A | le, Fu = Me;
      } else {
        var be = p << s, Tt = be | f, ht = u;
        ju = 1 << v | Tt, Fu = ht;
      }
    }
    function Jy(e) {
      Qs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        $s(e, a), ZE(e, a, i);
      }
    }
    function Yh(e) {
      return 32 - Un(e);
    }
    function ob(e) {
      return 1 << Yh(e) - 1;
    }
    function Zy(e) {
      for (; e === Vh; )
        Vh = Tf[--xf], Tf[xf] = null, Bh = Tf[--xf], Tf[xf] = null;
      for (; e === Is; )
        Is = Li[--Mi], Li[Mi] = null, Fu = Li[--Mi], Li[Mi] = null, ju = Li[--Mi], Li[Mi] = null;
    }
    function sb() {
      return Qs(), Is !== null ? {
        id: ju,
        overflow: Fu
      } : null;
    }
    function cb(e, t) {
      Qs(), Li[Mi++] = ju, Li[Mi++] = Fu, Li[Mi++] = Is, ju = t.id, Fu = t.overflow, Is = e;
    }
    function Qs() {
      Ar() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ur = null, Ni = null, nl = !1, Ws = !1, Mo = null;
    function fb() {
      nl && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function eC() {
      Ws = !0;
    }
    function db() {
      return Ws;
    }
    function pb(e) {
      var t = e.stateNode.containerInfo;
      return Ni = Lx(t), Ur = e, nl = !0, Mo = null, Ws = !1, !0;
    }
    function vb(e, t, a) {
      return Ni = Mx(t), Ur = e, nl = !0, Mo = null, Ws = !1, a !== null && cb(e, a), !0;
    }
    function tC(e, t) {
      switch (e.tag) {
        case Z: {
          Bx(e.stateNode.containerInfo, t);
          break;
        }
        case ue: {
          var a = (e.mode & lt) !== De;
          Ix(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case _e: {
          var i = e.memoizedState;
          i.dehydrated !== null && Yx(i.dehydrated, t);
          break;
        }
      }
    }
    function nC(e, t) {
      tC(e, t);
      var a = g_();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= ka) : i.push(a);
    }
    function eg(e, t) {
      {
        if (Ws)
          return;
        switch (e.tag) {
          case Z: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ue:
                var i = t.type;
                t.pendingProps, $x(a, i);
                break;
              case $e:
                var u = t.pendingProps;
                Qx(a, u);
                break;
            }
            break;
          }
          case ue: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ue: {
                var v = t.type, y = t.pendingProps, g = (e.mode & lt) !== De;
                qx(
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
              case $e: {
                var w = t.pendingProps, x = (e.mode & lt) !== De;
                Xx(
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
          case _e: {
            var N = e.memoizedState, A = N.dehydrated;
            if (A !== null) switch (t.tag) {
              case ue:
                var F = t.type;
                t.pendingProps, Wx(A, F);
                break;
              case $e:
                var le = t.pendingProps;
                Gx(A, le);
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
      t.flags = t.flags & ~Gr | mn, eg(e, t);
    }
    function aC(e, t) {
      switch (e.tag) {
        case ue: {
          var a = e.type;
          e.pendingProps;
          var i = bx(t, a);
          return i !== null ? (e.stateNode = i, Ur = e, Ni = Ox(i), !0) : !1;
        }
        case $e: {
          var u = e.pendingProps, s = wx(t, u);
          return s !== null ? (e.stateNode = s, Ur = e, Ni = null, !0) : !1;
        }
        case _e: {
          var f = _x(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: sb(),
              retryLane: Jr
            };
            e.memoizedState = p;
            var v = S_(f);
            return v.return = e, e.child = v, Ur = e, Ni = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function tg(e) {
      return (e.mode & lt) !== De && (e.flags & we) === ke;
    }
    function ng(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function rg(e) {
      if (nl) {
        var t = Ni;
        if (!t) {
          tg(e) && (eg(Ur, e), ng()), rC(Ur, e), nl = !1, Ur = e;
          return;
        }
        var a = t;
        if (!aC(e, t)) {
          tg(e) && (eg(Ur, e), ng()), t = op(a);
          var i = Ur;
          if (!t || !aC(e, t)) {
            rC(Ur, e), nl = !1, Ur = e;
            return;
          }
          nC(i, a);
        }
      }
    }
    function hb(e, t, a) {
      var i = e.stateNode, u = !Ws, s = Nx(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function mb(e) {
      var t = e.stateNode, a = e.memoizedProps, i = zx(t, a, e);
      if (i) {
        var u = Ur;
        if (u !== null)
          switch (u.tag) {
            case Z: {
              var s = u.stateNode.containerInfo, f = (u.mode & lt) !== De;
              Px(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ue: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, g = (u.mode & lt) !== De;
              Vx(
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
    function yb(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Ux(a, e);
    }
    function gb(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Ax(a);
    }
    function iC(e) {
      for (var t = e.return; t !== null && t.tag !== ue && t.tag !== Z && t.tag !== _e; )
        t = t.return;
      Ur = t;
    }
    function Ih(e) {
      if (e !== Ur)
        return !1;
      if (!nl)
        return iC(e), nl = !0, !1;
      if (e.tag !== Z && (e.tag !== ue || Hx(e.type) && !Fy(e.type, e.memoizedProps))) {
        var t = Ni;
        if (t)
          if (tg(e))
            lC(e), ng();
          else
            for (; t; )
              nC(e, t), t = op(t);
      }
      return iC(e), e.tag === _e ? Ni = gb(e) : Ni = Ur ? op(e.stateNode) : null, !0;
    }
    function Sb() {
      return nl && Ni !== null;
    }
    function lC(e) {
      for (var t = Ni; t; )
        tC(e, t), t = op(t);
    }
    function bf() {
      Ur = null, Ni = null, nl = !1, Ws = !1;
    }
    function uC() {
      Mo !== null && (eR(Mo), Mo = null);
    }
    function Ar() {
      return nl;
    }
    function ag(e) {
      Mo === null ? Mo = [e] : Mo.push(e);
    }
    var Eb = M.ReactCurrentBatchConfig, Cb = null;
    function Rb() {
      return Eb.transition;
    }
    var rl = {
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
      var Tb = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Gt && (t = a), a = a.return;
        return t;
      }, Gs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, dp = [], pp = [], vp = [], hp = [], mp = [], yp = [], qs = /* @__PURE__ */ new Set();
      rl.recordUnsafeLifecycleWarnings = function(e, t) {
        qs.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && dp.push(e), e.mode & Gt && typeof t.UNSAFE_componentWillMount == "function" && pp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && vp.push(e), e.mode & Gt && typeof t.UNSAFE_componentWillReceiveProps == "function" && hp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & Gt && typeof t.UNSAFE_componentWillUpdate == "function" && yp.push(e));
      }, rl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        dp.length > 0 && (dp.forEach(function(x) {
          e.add(Be(x) || "Component"), qs.add(x.type);
        }), dp = []);
        var t = /* @__PURE__ */ new Set();
        pp.length > 0 && (pp.forEach(function(x) {
          t.add(Be(x) || "Component"), qs.add(x.type);
        }), pp = []);
        var a = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(x) {
          a.add(Be(x) || "Component"), qs.add(x.type);
        }), vp = []);
        var i = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(x) {
          i.add(Be(x) || "Component"), qs.add(x.type);
        }), hp = []);
        var u = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(x) {
          u.add(Be(x) || "Component"), qs.add(x.type);
        }), mp = []);
        var s = /* @__PURE__ */ new Set();
        if (yp.length > 0 && (yp.forEach(function(x) {
          s.add(Be(x) || "Component"), qs.add(x.type);
        }), yp = []), t.size > 0) {
          var f = Gs(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = Gs(i);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = Gs(s);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = Gs(e);
          dt(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var g = Gs(a);
          dt(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, g);
        }
        if (u.size > 0) {
          var w = Gs(u);
          dt(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, w);
        }
      };
      var $h = /* @__PURE__ */ new Map(), oC = /* @__PURE__ */ new Set();
      rl.recordLegacyContextWarning = function(e, t) {
        var a = Tb(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!oC.has(e.type)) {
          var i = $h.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], $h.set(a, i)), i.push(e));
        }
      }, rl.flushLegacyContextWarning = function() {
        $h.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(Be(s) || "Component"), oC.add(s.type);
            });
            var u = Gs(i);
            try {
              $t(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              sn();
            }
          }
        });
      }, rl.discardPendingWarnings = function() {
        dp = [], pp = [], vp = [], hp = [], mp = [], yp = [], $h = /* @__PURE__ */ new Map();
      };
    }
    var ig, lg, ug, og, sg, sC = function(e, t) {
    };
    ig = !1, lg = !1, ug = {}, og = {}, sg = {}, sC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Be(t) || "Component";
        og[a] || (og[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function xb(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function gp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Gt || P) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== de) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !xb(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = Be(e) || "Component";
          ug[u] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), ug[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== de)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          si(i, "ref");
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
        var t = Be(e) || "Component";
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
          O === null ? (D.deletions = [H], D.flags |= ka) : O.push(H);
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
        for (var O = /* @__PURE__ */ new Map(), X = H; X !== null; )
          X.key !== null ? O.set(X.key, X) : O.set(X.index, X), X = X.sibling;
        return O;
      }
      function u(D, H) {
        var O = ac(D, H);
        return O.index = 0, O.sibling = null, O;
      }
      function s(D, H, O) {
        if (D.index = O, !e)
          return D.flags |= Ci, H;
        var X = D.alternate;
        if (X !== null) {
          var pe = X.index;
          return pe < H ? (D.flags |= mn, H) : pe;
        } else
          return D.flags |= mn, H;
      }
      function f(D) {
        return e && D.alternate === null && (D.flags |= mn), D;
      }
      function p(D, H, O, X) {
        if (H === null || H.tag !== $e) {
          var pe = aE(O, D.mode, X);
          return pe.return = D, pe;
        } else {
          var oe = u(H, O);
          return oe.return = D, oe;
        }
      }
      function v(D, H, O, X) {
        var pe = O.type;
        if (pe === fi)
          return g(D, H, O.props.children, X, O.key);
        if (H !== null && (H.elementType === pe || // Keep this check inline so it only runs on the false path:
        mR(H, O) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof pe == "object" && pe !== null && pe.$$typeof === Ye && cC(pe) === H.type)) {
          var oe = u(H, O.props);
          return oe.ref = gp(D, H, O), oe.return = D, oe._debugSource = O._source, oe._debugOwner = O._owner, oe;
        }
        var Pe = rE(O, D.mode, X);
        return Pe.ref = gp(D, H, O), Pe.return = D, Pe;
      }
      function y(D, H, O, X) {
        if (H === null || H.tag !== Re || H.stateNode.containerInfo !== O.containerInfo || H.stateNode.implementation !== O.implementation) {
          var pe = iE(O, D.mode, X);
          return pe.return = D, pe;
        } else {
          var oe = u(H, O.children || []);
          return oe.return = D, oe;
        }
      }
      function g(D, H, O, X, pe) {
        if (H === null || H.tag !== St) {
          var oe = Yo(O, D.mode, X, pe);
          return oe.return = D, oe;
        } else {
          var Pe = u(H, O);
          return Pe.return = D, Pe;
        }
      }
      function w(D, H, O) {
        if (typeof H == "string" && H !== "" || typeof H == "number") {
          var X = aE("" + H, D.mode, O);
          return X.return = D, X;
        }
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case _r: {
              var pe = rE(H, D.mode, O);
              return pe.ref = gp(D, null, H), pe.return = D, pe;
            }
            case rr: {
              var oe = iE(H, D.mode, O);
              return oe.return = D, oe;
            }
            case Ye: {
              var Pe = H._payload, We = H._init;
              return w(D, We(Pe), O);
            }
          }
          if (nt(H) || qe(H)) {
            var Xt = Yo(H, D.mode, O, null);
            return Xt.return = D, Xt;
          }
          Qh(D, H);
        }
        return typeof H == "function" && Wh(D), null;
      }
      function x(D, H, O, X) {
        var pe = H !== null ? H.key : null;
        if (typeof O == "string" && O !== "" || typeof O == "number")
          return pe !== null ? null : p(D, H, "" + O, X);
        if (typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case _r:
              return O.key === pe ? v(D, H, O, X) : null;
            case rr:
              return O.key === pe ? y(D, H, O, X) : null;
            case Ye: {
              var oe = O._payload, Pe = O._init;
              return x(D, H, Pe(oe), X);
            }
          }
          if (nt(O) || qe(O))
            return pe !== null ? null : g(D, H, O, X, null);
          Qh(D, O);
        }
        return typeof O == "function" && Wh(D), null;
      }
      function N(D, H, O, X, pe) {
        if (typeof X == "string" && X !== "" || typeof X == "number") {
          var oe = D.get(O) || null;
          return p(H, oe, "" + X, pe);
        }
        if (typeof X == "object" && X !== null) {
          switch (X.$$typeof) {
            case _r: {
              var Pe = D.get(X.key === null ? O : X.key) || null;
              return v(H, Pe, X, pe);
            }
            case rr: {
              var We = D.get(X.key === null ? O : X.key) || null;
              return y(H, We, X, pe);
            }
            case Ye:
              var Xt = X._payload, zt = X._init;
              return N(D, H, O, zt(Xt), pe);
          }
          if (nt(X) || qe(X)) {
            var Gn = D.get(O) || null;
            return g(H, Gn, X, pe, null);
          }
          Qh(H, X);
        }
        return typeof X == "function" && Wh(H), null;
      }
      function A(D, H, O) {
        {
          if (typeof D != "object" || D === null)
            return H;
          switch (D.$$typeof) {
            case _r:
            case rr:
              sC(D, O);
              var X = D.key;
              if (typeof X != "string")
                break;
              if (H === null) {
                H = /* @__PURE__ */ new Set(), H.add(X);
                break;
              }
              if (!H.has(X)) {
                H.add(X);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", X);
              break;
            case Ye:
              var pe = D._payload, oe = D._init;
              A(oe(pe), H, O);
              break;
          }
        }
        return H;
      }
      function F(D, H, O, X) {
        for (var pe = null, oe = 0; oe < O.length; oe++) {
          var Pe = O[oe];
          pe = A(Pe, pe, D);
        }
        for (var We = null, Xt = null, zt = H, Gn = 0, Ut = 0, Pn = null; zt !== null && Ut < O.length; Ut++) {
          zt.index > Ut ? (Pn = zt, zt = null) : Pn = zt.sibling;
          var la = x(D, zt, O[Ut], X);
          if (la === null) {
            zt === null && (zt = Pn);
            break;
          }
          e && zt && la.alternate === null && t(D, zt), Gn = s(la, Gn, Ut), Xt === null ? We = la : Xt.sibling = la, Xt = la, zt = Pn;
        }
        if (Ut === O.length) {
          if (a(D, zt), Ar()) {
            var Yr = Ut;
            $s(D, Yr);
          }
          return We;
        }
        if (zt === null) {
          for (; Ut < O.length; Ut++) {
            var oi = w(D, O[Ut], X);
            oi !== null && (Gn = s(oi, Gn, Ut), Xt === null ? We = oi : Xt.sibling = oi, Xt = oi);
          }
          if (Ar()) {
            var Ca = Ut;
            $s(D, Ca);
          }
          return We;
        }
        for (var Ra = i(D, zt); Ut < O.length; Ut++) {
          var ua = N(Ra, D, Ut, O[Ut], X);
          ua !== null && (e && ua.alternate !== null && Ra.delete(ua.key === null ? Ut : ua.key), Gn = s(ua, Gn, Ut), Xt === null ? We = ua : Xt.sibling = ua, Xt = ua);
        }
        if (e && Ra.forEach(function(If) {
          return t(D, If);
        }), Ar()) {
          var $u = Ut;
          $s(D, $u);
        }
        return We;
      }
      function le(D, H, O, X) {
        var pe = qe(O);
        if (typeof pe != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          O[Symbol.toStringTag] === "Generator" && (lg || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), lg = !0), O.entries === pe && (ig || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), ig = !0);
          var oe = pe.call(O);
          if (oe)
            for (var Pe = null, We = oe.next(); !We.done; We = oe.next()) {
              var Xt = We.value;
              Pe = A(Xt, Pe, D);
            }
        }
        var zt = pe.call(O);
        if (zt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Gn = null, Ut = null, Pn = H, la = 0, Yr = 0, oi = null, Ca = zt.next(); Pn !== null && !Ca.done; Yr++, Ca = zt.next()) {
          Pn.index > Yr ? (oi = Pn, Pn = null) : oi = Pn.sibling;
          var Ra = x(D, Pn, Ca.value, X);
          if (Ra === null) {
            Pn === null && (Pn = oi);
            break;
          }
          e && Pn && Ra.alternate === null && t(D, Pn), la = s(Ra, la, Yr), Ut === null ? Gn = Ra : Ut.sibling = Ra, Ut = Ra, Pn = oi;
        }
        if (Ca.done) {
          if (a(D, Pn), Ar()) {
            var ua = Yr;
            $s(D, ua);
          }
          return Gn;
        }
        if (Pn === null) {
          for (; !Ca.done; Yr++, Ca = zt.next()) {
            var $u = w(D, Ca.value, X);
            $u !== null && (la = s($u, la, Yr), Ut === null ? Gn = $u : Ut.sibling = $u, Ut = $u);
          }
          if (Ar()) {
            var If = Yr;
            $s(D, If);
          }
          return Gn;
        }
        for (var Xp = i(D, Pn); !Ca.done; Yr++, Ca = zt.next()) {
          var Kl = N(Xp, D, Yr, Ca.value, X);
          Kl !== null && (e && Kl.alternate !== null && Xp.delete(Kl.key === null ? Yr : Kl.key), la = s(Kl, la, Yr), Ut === null ? Gn = Kl : Ut.sibling = Kl, Ut = Kl);
        }
        if (e && Xp.forEach(function(X_) {
          return t(D, X_);
        }), Ar()) {
          var q_ = Yr;
          $s(D, q_);
        }
        return Gn;
      }
      function Me(D, H, O, X) {
        if (H !== null && H.tag === $e) {
          a(D, H.sibling);
          var pe = u(H, O);
          return pe.return = D, pe;
        }
        a(D, H);
        var oe = aE(O, D.mode, X);
        return oe.return = D, oe;
      }
      function be(D, H, O, X) {
        for (var pe = O.key, oe = H; oe !== null; ) {
          if (oe.key === pe) {
            var Pe = O.type;
            if (Pe === fi) {
              if (oe.tag === St) {
                a(D, oe.sibling);
                var We = u(oe, O.props.children);
                return We.return = D, We._debugSource = O._source, We._debugOwner = O._owner, We;
              }
            } else if (oe.elementType === Pe || // Keep this check inline so it only runs on the false path:
            mR(oe, O) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Pe == "object" && Pe !== null && Pe.$$typeof === Ye && cC(Pe) === oe.type) {
              a(D, oe.sibling);
              var Xt = u(oe, O.props);
              return Xt.ref = gp(D, oe, O), Xt.return = D, Xt._debugSource = O._source, Xt._debugOwner = O._owner, Xt;
            }
            a(D, oe);
            break;
          } else
            t(D, oe);
          oe = oe.sibling;
        }
        if (O.type === fi) {
          var zt = Yo(O.props.children, D.mode, X, O.key);
          return zt.return = D, zt;
        } else {
          var Gn = rE(O, D.mode, X);
          return Gn.ref = gp(D, H, O), Gn.return = D, Gn;
        }
      }
      function Tt(D, H, O, X) {
        for (var pe = O.key, oe = H; oe !== null; ) {
          if (oe.key === pe)
            if (oe.tag === Re && oe.stateNode.containerInfo === O.containerInfo && oe.stateNode.implementation === O.implementation) {
              a(D, oe.sibling);
              var Pe = u(oe, O.children || []);
              return Pe.return = D, Pe;
            } else {
              a(D, oe);
              break;
            }
          else
            t(D, oe);
          oe = oe.sibling;
        }
        var We = iE(O, D.mode, X);
        return We.return = D, We;
      }
      function ht(D, H, O, X) {
        var pe = typeof O == "object" && O !== null && O.type === fi && O.key === null;
        if (pe && (O = O.props.children), typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case _r:
              return f(be(D, H, O, X));
            case rr:
              return f(Tt(D, H, O, X));
            case Ye:
              var oe = O._payload, Pe = O._init;
              return ht(D, H, Pe(oe), X);
          }
          if (nt(O))
            return F(D, H, O, X);
          if (qe(O))
            return le(D, H, O, X);
          Qh(D, O);
        }
        return typeof O == "string" && O !== "" || typeof O == "number" ? f(Me(D, H, "" + O, X)) : (typeof O == "function" && Wh(D), a(D, H));
      }
      return ht;
    }
    var wf = fC(!0), dC = fC(!1);
    function bb(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ac(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ac(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function wb(e, t) {
      for (var a = e.child; a !== null; )
        p_(a, t), a = a.sibling;
    }
    var cg = Do(null), fg;
    fg = {};
    var Gh = null, _f = null, dg = null, qh = !1;
    function Xh() {
      Gh = null, _f = null, dg = null, qh = !1;
    }
    function pC() {
      qh = !0;
    }
    function vC() {
      qh = !1;
    }
    function hC(e, t, a) {
      aa(cg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== fg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = fg;
    }
    function pg(e, t) {
      var a = cg.current;
      ra(cg, t), e._currentValue = a;
    }
    function vg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (_u(i.childLanes, t) ? u !== null && !_u(u.childLanes, t) && (u.childLanes = Xe(u.childLanes, t)) : (i.childLanes = Xe(i.childLanes, t), u !== null && (u.childLanes = Xe(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function _b(e, t, a) {
      kb(e, t, a);
    }
    function kb(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === de) {
                var p = Rs(a), v = Hu(Kt, p);
                v.tag = Jh;
                var y = i.updateQueue;
                if (y !== null) {
                  var g = y.shared, w = g.pending;
                  w === null ? v.next = v : (v.next = w.next, w.next = v), g.pending = v;
                }
              }
              i.lanes = Xe(i.lanes, a);
              var x = i.alternate;
              x !== null && (x.lanes = Xe(x.lanes, a)), vg(i.return, a, e), s.lanes = Xe(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === ct)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Jt) {
          var N = i.return;
          if (N === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          N.lanes = Xe(N.lanes, a);
          var A = N.alternate;
          A !== null && (A.lanes = Xe(A.lanes, a)), vg(N, a, e), u = i.sibling;
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
    function kf(e, t) {
      Gh = e, _f = null, dg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (Zr(a.lanes, t) && Np(), a.firstContext = null);
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
        if (_f === null) {
          if (Gh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          _f = a, Gh.dependencies = {
            lanes: I,
            firstContext: a
          };
        } else
          _f = _f.next = a;
      }
      return t;
    }
    var Xs = null;
    function hg(e) {
      Xs === null ? Xs = [e] : Xs.push(e);
    }
    function Db() {
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
      return u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Kh(e, i);
    }
    function Ob(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Lb(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, hg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Kh(e, i);
    }
    function Fa(e, t) {
      return Kh(e, t);
    }
    var Mb = Kh;
    function Kh(e, t) {
      e.lanes = Xe(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = Xe(a.lanes, t)), a === null && (e.flags & (mn | Gr)) !== ke && dR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = Xe(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = Xe(a.childLanes, t) : (u.flags & (mn | Gr)) !== ke && dR(e), i = u, u = u.return;
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
          lanes: I
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
    function Hu(e, t) {
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
    function No(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (em === u && !yg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), yg = !0), O1()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Mb(e, a);
      } else
        return Lb(e, u, t, a);
    }
    function tm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Ld(a)) {
          var s = u.lanes;
          s = Nd(s, e.pendingLanes);
          var f = Xe(s, a);
          u.lanes = f, Zc(e, f);
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
    function Nb(e, t, a, i, u, s) {
      switch (a.tag) {
        case gC: {
          var f = a.payload;
          if (typeof f == "function") {
            pC();
            var p = f.call(s, i, u);
            {
              if (e.mode & Gt) {
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
          e.flags = e.flags & ~Kn | we;
        // Intentional fallthrough
        case yC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            pC(), y = v.call(s, i, u);
            {
              if (e.mode & Gt) {
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
          return y == null ? i : Je({}, i, y);
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
        var N = u.baseState, A = I, F = null, le = null, Me = null, be = s;
        do {
          var Tt = be.lane, ht = be.eventTime;
          if (_u(i, Tt)) {
            if (Me !== null) {
              var H = {
                eventTime: ht,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: kt,
                tag: be.tag,
                payload: be.payload,
                callback: be.callback,
                next: null
              };
              Me = Me.next = H;
            }
            N = Nb(e, u, be, N, t, a);
            var O = be.callback;
            if (O !== null && // If the update was already committed, we should not queue its
            // callback again.
            be.lane !== kt) {
              e.flags |= rn;
              var X = u.effects;
              X === null ? u.effects = [be] : X.push(be);
            }
          } else {
            var D = {
              eventTime: ht,
              lane: Tt,
              tag: be.tag,
              payload: be.payload,
              callback: be.callback,
              next: null
            };
            Me === null ? (le = Me = D, F = N) : Me = Me.next = D, A = Xe(A, Tt);
          }
          if (be = be.next, be === null) {
            if (p = u.shared.pending, p === null)
              break;
            var pe = p, oe = pe.next;
            pe.next = null, be = oe, u.lastBaseUpdate = pe, u.shared.pending = null;
          }
        } while (!0);
        Me === null && (F = N), u.baseState = F, u.firstBaseUpdate = le, u.lastBaseUpdate = Me;
        var Pe = u.shared.interleaved;
        if (Pe !== null) {
          var We = Pe;
          do
            A = Xe(A, We.lane), We = We.next;
          while (We !== Pe);
        } else s === null && (u.shared.lanes = I);
        $p(A), e.lanes = A, e.memoizedState = N;
      }
      em = null;
    }
    function zb(e, t) {
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
          f !== null && (s.callback = null, zb(f, a));
        }
    }
    var Sp = {}, zo = Do(Sp), Ep = Do(Sp), am = Do(Sp);
    function im(e) {
      if (e === Sp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function RC() {
      var e = im(am.current);
      return e;
    }
    function Eg(e, t) {
      aa(am, t, e), aa(Ep, e, e), aa(zo, Sp, e);
      var a = KT(t);
      ra(zo, e), aa(zo, a, e);
    }
    function Df(e) {
      ra(zo, e), ra(Ep, e), ra(am, e);
    }
    function Cg() {
      var e = im(zo.current);
      return e;
    }
    function TC(e) {
      im(am.current);
      var t = im(zo.current), a = JT(t, e.type);
      t !== a && (aa(Ep, e, e), aa(zo, a, e));
    }
    function Rg(e) {
      Ep.current === e && (ra(zo, e), ra(Ep, e));
    }
    var Ub = 0, xC = 1, bC = 1, Cp = 2, al = Do(Ub);
    function Tg(e, t) {
      return (e & t) !== 0;
    }
    function Of(e) {
      return e & xC;
    }
    function xg(e, t) {
      return e & xC | t;
    }
    function Ab(e, t) {
      return e | t;
    }
    function Uo(e, t) {
      aa(al, t, e);
    }
    function Lf(e) {
      ra(al, e);
    }
    function jb(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function lm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === _e) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || BE(i) || By(i))
              return t;
          }
        } else if (t.tag === ln && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & we) !== ke;
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
    var Ha = (
      /*   */
      0
    ), cr = (
      /* */
      1
    ), Il = (
      /*  */
      2
    ), fr = (
      /*    */
      4
    ), jr = (
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
    function Fb(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var fe = M.ReactCurrentDispatcher, Rp = M.ReactCurrentBatchConfig, _g, Mf;
    _g = /* @__PURE__ */ new Set();
    var Ks = I, qt = null, dr = null, pr = null, um = !1, Tp = !1, xp = 0, Hb = 0, Pb = 25, V = null, zi = null, Ao = -1, kg = !1;
    function Pt() {
      {
        var e = V;
        zi === null ? zi = [e] : zi.push(e);
      }
    }
    function te() {
      {
        var e = V;
        zi !== null && (Ao++, zi[Ao] !== e && Vb(e));
      }
    }
    function Nf(e) {
      e != null && !nt(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", V, typeof e);
    }
    function Vb(e) {
      {
        var t = Be(qt);
        if (!_g.has(t) && (_g.add(t), zi !== null)) {
          for (var a = "", i = 30, u = 0; u <= Ao; u++) {
            for (var s = zi[u], f = u === Ao ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function ia() {
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
        if (!W(e[a], t[a]))
          return !1;
      return !0;
    }
    function zf(e, t, a, i, u, s) {
      Ks = s, qt = t, zi = e !== null ? e._debugHookTypes : null, Ao = -1, kg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = I, e !== null && e.memoizedState !== null ? fe.current = WC : zi !== null ? fe.current = QC : fe.current = $C;
      var f = a(i, u);
      if (Tp) {
        var p = 0;
        do {
          if (Tp = !1, xp = 0, p >= Pb)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, kg = !1, dr = null, pr = null, t.updateQueue = null, Ao = -1, fe.current = GC, f = a(i, u);
        } while (Tp);
      }
      fe.current = Em, t._debugHookTypes = zi;
      var v = dr !== null && dr.next !== null;
      if (Ks = I, qt = null, dr = null, pr = null, V = null, zi = null, Ao = -1, e !== null && (e.flags & zn) !== (t.flags & zn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & lt) !== De && S("Internal React error: Expected static flag was missing. Please notify the React team."), um = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Uf() {
      var e = xp !== 0;
      return xp = 0, e;
    }
    function wC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Mt) !== De ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Ts(e.lanes, a);
    }
    function _C() {
      if (fe.current = Em, um) {
        for (var e = qt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        um = !1;
      }
      Ks = I, qt = null, dr = null, pr = null, zi = null, Ao = -1, V = null, PC = !1, Tp = !1, xp = 0;
    }
    function $l() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return pr === null ? qt.memoizedState = pr = e : pr = pr.next = e, pr;
    }
    function Ui() {
      var e;
      if (dr === null) {
        var t = qt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = dr.next;
      var a;
      if (pr === null ? a = qt.memoizedState : a = pr.next, a !== null)
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
        pr === null ? qt.memoizedState = pr = i : pr = pr.next = i;
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
      var i = $l(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: I,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = $b.bind(null, qt, s);
      return [i.memoizedState, f];
    }
    function Mg(e, t, a) {
      var i = Ui(), u = i.queue;
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
        var g = f.next, w = s.baseState, x = null, N = null, A = null, F = g;
        do {
          var le = F.lane;
          if (_u(Ks, le)) {
            if (A !== null) {
              var be = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: kt,
                action: F.action,
                hasEagerState: F.hasEagerState,
                eagerState: F.eagerState,
                next: null
              };
              A = A.next = be;
            }
            if (F.hasEagerState)
              w = F.eagerState;
            else {
              var Tt = F.action;
              w = e(w, Tt);
            }
          } else {
            var Me = {
              lane: le,
              action: F.action,
              hasEagerState: F.hasEagerState,
              eagerState: F.eagerState,
              next: null
            };
            A === null ? (N = A = Me, x = w) : A = A.next = Me, qt.lanes = Xe(qt.lanes, le), $p(le);
          }
          F = F.next;
        } while (F !== null && F !== g);
        A === null ? x = w : A.next = N, W(w, i.memoizedState) || Np(), i.memoizedState = w, i.baseState = x, i.baseQueue = A, u.lastRenderedState = w;
      }
      var ht = u.interleaved;
      if (ht !== null) {
        var D = ht;
        do {
          var H = D.lane;
          qt.lanes = Xe(qt.lanes, H), $p(H), D = D.next;
        } while (D !== ht);
      } else f === null && (u.lanes = I);
      var O = u.dispatch;
      return [i.memoizedState, O];
    }
    function Ng(e, t, a) {
      var i = Ui(), u = i.queue;
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
        W(p, i.memoizedState) || Np(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function gk(e, t, a) {
    }
    function Sk(e, t, a) {
    }
    function zg(e, t, a) {
      var i = qt, u = $l(), s, f = Ar();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Mf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), Mf = !0);
      } else {
        if (s = t(), !Mf) {
          var p = t();
          W(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Mf = !0);
        }
        var v = Hm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Kc(v, Ks) || DC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, dm(LC.bind(null, i, y, e), [e]), i.flags |= Wr, bp(cr | jr, OC.bind(null, i, y, s, t), void 0, null), s;
    }
    function om(e, t, a) {
      var i = qt, u = Ui(), s = t();
      if (!Mf) {
        var f = t();
        W(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Mf = !0);
      }
      var p = u.memoizedState, v = !W(p, s);
      v && (u.memoizedState = s, Np());
      var y = u.queue;
      if (_p(LC.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      pr !== null && pr.memoizedState.tag & cr) {
        i.flags |= Wr, bp(cr | jr, OC.bind(null, i, y, s, t), void 0, null);
        var g = Hm();
        if (g === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Kc(g, Ks) || DC(i, t, s);
      }
      return s;
    }
    function DC(e, t, a) {
      e.flags |= po;
      var i = {
        getSnapshot: t,
        value: a
      }, u = qt.updateQueue;
      if (u === null)
        u = kC(), qt.updateQueue = u, u.stores = [i];
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
        return !W(a, i);
      } catch {
        return !0;
      }
    }
    function NC(e) {
      var t = Fa(e, je);
      t !== null && yr(t, e, je, Kt);
    }
    function sm(e) {
      var t = $l();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: I,
        dispatch: null,
        lastRenderedReducer: Og,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Qb.bind(null, qt, a);
      return [t.memoizedState, i];
    }
    function Ug(e) {
      return Mg(Og);
    }
    function Ag(e) {
      return Ng(Og);
    }
    function bp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = qt.updateQueue;
      if (s === null)
        s = kC(), qt.updateQueue = s, s.lastEffect = u.next = u;
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
      var t = $l();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function cm(e) {
      var t = Ui();
      return t.memoizedState;
    }
    function wp(e, t, a, i) {
      var u = $l(), s = i === void 0 ? null : i;
      qt.flags |= e, u.memoizedState = bp(cr | t, a, void 0, s);
    }
    function fm(e, t, a, i) {
      var u = Ui(), s = i === void 0 ? null : i, f = void 0;
      if (dr !== null) {
        var p = dr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Dg(s, v)) {
            u.memoizedState = bp(t, a, f, s);
            return;
          }
        }
      }
      qt.flags |= e, u.memoizedState = bp(cr | t, a, f, s);
    }
    function dm(e, t) {
      return (qt.mode & Mt) !== De ? wp(Ri | Wr | xc, jr, e, t) : wp(Wr | xc, jr, e, t);
    }
    function _p(e, t) {
      return fm(Wr, jr, e, t);
    }
    function Fg(e, t) {
      return wp(Et, Il, e, t);
    }
    function pm(e, t) {
      return fm(Et, Il, e, t);
    }
    function Hg(e, t) {
      var a = Et;
      return a |= Qi, (qt.mode & Mt) !== De && (a |= wl), wp(a, fr, e, t);
    }
    function vm(e, t) {
      return fm(Et, fr, e, t);
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
      var i = a != null ? a.concat([e]) : null, u = Et;
      return u |= Qi, (qt.mode & Mt) !== De && (u |= wl), wp(u, fr, zC.bind(null, t, e), i);
    }
    function hm(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return fm(Et, fr, zC.bind(null, t, e), i);
    }
    function Bb(e, t) {
    }
    var mm = Bb;
    function Vg(e, t) {
      var a = $l(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function ym(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Dg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Bg(e, t) {
      var a = $l(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function gm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Dg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Yg(e) {
      var t = $l();
      return t.memoizedState = e, e;
    }
    function UC(e) {
      var t = Ui(), a = dr, i = a.memoizedState;
      return jC(t, i, e);
    }
    function AC(e) {
      var t = Ui();
      if (dr === null)
        return t.memoizedState = e, e;
      var a = dr.memoizedState;
      return jC(t, a, e);
    }
    function jC(e, t, a) {
      var i = !Dd(Ks);
      if (i) {
        if (!W(a, t)) {
          var u = Md();
          qt.lanes = Xe(qt.lanes, u), $p(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Np()), e.memoizedState = a, a;
    }
    function Yb(e, t, a) {
      var i = Ua();
      jn(qv(i, wi)), e(!0);
      var u = Rp.transition;
      Rp.transition = {};
      var s = Rp.transition;
      Rp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (jn(i), Rp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && dt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Ig() {
      var e = sm(!1), t = e[0], a = e[1], i = Yb.bind(null, a), u = $l();
      return u.memoizedState = i, [t, i];
    }
    function FC() {
      var e = Ug(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    function HC() {
      var e = Ag(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    var PC = !1;
    function Ib() {
      return PC;
    }
    function $g() {
      var e = $l(), t = Hm(), a = t.identifierPrefix, i;
      if (Ar()) {
        var u = ub();
        i = ":" + a + "R" + u;
        var s = xp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Hb++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Sm() {
      var e = Ui(), t = e.memoizedState;
      return t;
    }
    function $b(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Vo(e), u = {
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
          var f = Ea();
          yr(s, e, i, f), YC(s, t, i);
        }
      }
      IC(e, i);
    }
    function Qb(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Vo(e), u = {
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
        if (e.lanes === I && (s === null || s.lanes === I)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = fe.current, fe.current = il;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, W(y, v)) {
                Ob(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              fe.current = p;
            }
          }
        }
        var g = mC(e, t, u, i);
        if (g !== null) {
          var w = Ea();
          yr(g, e, i, w), YC(g, t, i);
        }
      }
      IC(e, i);
    }
    function VC(e) {
      var t = e.alternate;
      return e === qt || t !== null && t === qt;
    }
    function BC(e, t) {
      Tp = um = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function YC(e, t, a) {
      if (Ld(a)) {
        var i = t.lanes;
        i = Nd(i, e.pendingLanes);
        var u = Xe(i, a);
        t.lanes = u, Zc(e, u);
      }
    }
    function IC(e, t, a) {
      ps(e, t);
    }
    var Em = {
      readContext: tr,
      useCallback: ia,
      useContext: ia,
      useEffect: ia,
      useImperativeHandle: ia,
      useInsertionEffect: ia,
      useLayoutEffect: ia,
      useMemo: ia,
      useReducer: ia,
      useRef: ia,
      useState: ia,
      useDebugValue: ia,
      useDeferredValue: ia,
      useTransition: ia,
      useMutableSource: ia,
      useSyncExternalStore: ia,
      useId: ia,
      unstable_isNewReconciler: J
    }, $C = null, QC = null, WC = null, GC = null, Ql = null, il = null, Cm = null;
    {
      var Qg = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Ie = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      $C = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", Pt(), Nf(t), Vg(e, t);
        },
        useContext: function(e) {
          return V = "useContext", Pt(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", Pt(), Nf(t), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", Pt(), Nf(a), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", Pt(), Nf(t), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", Pt(), Nf(t), Hg(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", Pt(), Nf(t);
          var a = fe.current;
          fe.current = Ql;
          try {
            return Bg(e, t);
          } finally {
            fe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", Pt();
          var i = fe.current;
          fe.current = Ql;
          try {
            return Lg(e, t, a);
          } finally {
            fe.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", Pt(), jg(e);
        },
        useState: function(e) {
          V = "useState", Pt();
          var t = fe.current;
          fe.current = Ql;
          try {
            return sm(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", Pt(), void 0;
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", Pt(), Yg(e);
        },
        useTransition: function() {
          return V = "useTransition", Pt(), Ig();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", Pt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", Pt(), zg(e, t, a);
        },
        useId: function() {
          return V = "useId", Pt(), $g();
        },
        unstable_isNewReconciler: J
      }, QC = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", te(), Vg(e, t);
        },
        useContext: function(e) {
          return V = "useContext", te(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", te(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", te(), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", te(), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", te(), Hg(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", te();
          var a = fe.current;
          fe.current = Ql;
          try {
            return Bg(e, t);
          } finally {
            fe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", te();
          var i = fe.current;
          fe.current = Ql;
          try {
            return Lg(e, t, a);
          } finally {
            fe.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", te(), jg(e);
        },
        useState: function(e) {
          V = "useState", te();
          var t = fe.current;
          fe.current = Ql;
          try {
            return sm(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", te(), void 0;
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", te(), Yg(e);
        },
        useTransition: function() {
          return V = "useTransition", te(), Ig();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", te(), zg(e, t, a);
        },
        useId: function() {
          return V = "useId", te(), $g();
        },
        unstable_isNewReconciler: J
      }, WC = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", te(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", te(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", te(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", te(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", te(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", te(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", te();
          var a = fe.current;
          fe.current = il;
          try {
            return gm(e, t);
          } finally {
            fe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", te();
          var i = fe.current;
          fe.current = il;
          try {
            return Mg(e, t, a);
          } finally {
            fe.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", te(), cm();
        },
        useState: function(e) {
          V = "useState", te();
          var t = fe.current;
          fe.current = il;
          try {
            return Ug(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", te(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", te(), UC(e);
        },
        useTransition: function() {
          return V = "useTransition", te(), FC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", te(), om(e, t);
        },
        useId: function() {
          return V = "useId", te(), Sm();
        },
        unstable_isNewReconciler: J
      }, GC = {
        readContext: function(e) {
          return tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", te(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", te(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", te(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", te(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", te(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", te(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", te();
          var a = fe.current;
          fe.current = Cm;
          try {
            return gm(e, t);
          } finally {
            fe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", te();
          var i = fe.current;
          fe.current = Cm;
          try {
            return Ng(e, t, a);
          } finally {
            fe.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", te(), cm();
        },
        useState: function(e) {
          V = "useState", te();
          var t = fe.current;
          fe.current = Cm;
          try {
            return Ag(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", te(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", te(), AC(e);
        },
        useTransition: function() {
          return V = "useTransition", te(), HC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", te(), om(e, t);
        },
        useId: function() {
          return V = "useId", te(), Sm();
        },
        unstable_isNewReconciler: J
      }, Ql = {
        readContext: function(e) {
          return Qg(), tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", Ie(), Pt(), Vg(e, t);
        },
        useContext: function(e) {
          return V = "useContext", Ie(), Pt(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", Ie(), Pt(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", Ie(), Pt(), Pg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", Ie(), Pt(), Fg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", Ie(), Pt(), Hg(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", Ie(), Pt();
          var a = fe.current;
          fe.current = Ql;
          try {
            return Bg(e, t);
          } finally {
            fe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", Ie(), Pt();
          var i = fe.current;
          fe.current = Ql;
          try {
            return Lg(e, t, a);
          } finally {
            fe.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", Ie(), Pt(), jg(e);
        },
        useState: function(e) {
          V = "useState", Ie(), Pt();
          var t = fe.current;
          fe.current = Ql;
          try {
            return sm(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", Ie(), Pt(), void 0;
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", Ie(), Pt(), Yg(e);
        },
        useTransition: function() {
          return V = "useTransition", Ie(), Pt(), Ig();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", Ie(), Pt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", Ie(), Pt(), zg(e, t, a);
        },
        useId: function() {
          return V = "useId", Ie(), Pt(), $g();
        },
        unstable_isNewReconciler: J
      }, il = {
        readContext: function(e) {
          return Qg(), tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", Ie(), te(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", Ie(), te(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", Ie(), te(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", Ie(), te(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", Ie(), te(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", Ie(), te(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", Ie(), te();
          var a = fe.current;
          fe.current = il;
          try {
            return gm(e, t);
          } finally {
            fe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", Ie(), te();
          var i = fe.current;
          fe.current = il;
          try {
            return Mg(e, t, a);
          } finally {
            fe.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", Ie(), te(), cm();
        },
        useState: function(e) {
          V = "useState", Ie(), te();
          var t = fe.current;
          fe.current = il;
          try {
            return Ug(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", Ie(), te(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", Ie(), te(), UC(e);
        },
        useTransition: function() {
          return V = "useTransition", Ie(), te(), FC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", Ie(), te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", Ie(), te(), om(e, t);
        },
        useId: function() {
          return V = "useId", Ie(), te(), Sm();
        },
        unstable_isNewReconciler: J
      }, Cm = {
        readContext: function(e) {
          return Qg(), tr(e);
        },
        useCallback: function(e, t) {
          return V = "useCallback", Ie(), te(), ym(e, t);
        },
        useContext: function(e) {
          return V = "useContext", Ie(), te(), tr(e);
        },
        useEffect: function(e, t) {
          return V = "useEffect", Ie(), te(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return V = "useImperativeHandle", Ie(), te(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return V = "useInsertionEffect", Ie(), te(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return V = "useLayoutEffect", Ie(), te(), vm(e, t);
        },
        useMemo: function(e, t) {
          V = "useMemo", Ie(), te();
          var a = fe.current;
          fe.current = il;
          try {
            return gm(e, t);
          } finally {
            fe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          V = "useReducer", Ie(), te();
          var i = fe.current;
          fe.current = il;
          try {
            return Ng(e, t, a);
          } finally {
            fe.current = i;
          }
        },
        useRef: function(e) {
          return V = "useRef", Ie(), te(), cm();
        },
        useState: function(e) {
          V = "useState", Ie(), te();
          var t = fe.current;
          fe.current = il;
          try {
            return Ag(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return V = "useDebugValue", Ie(), te(), mm();
        },
        useDeferredValue: function(e) {
          return V = "useDeferredValue", Ie(), te(), AC(e);
        },
        useTransition: function() {
          return V = "useTransition", Ie(), te(), HC();
        },
        useMutableSource: function(e, t, a) {
          return V = "useMutableSource", Ie(), te(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return V = "useSyncExternalStore", Ie(), te(), om(e, t);
        },
        useId: function() {
          return V = "useId", Ie(), te(), Sm();
        },
        unstable_isNewReconciler: J
      };
    }
    var jo = G.unstable_now, qC = 0, Rm = -1, kp = -1, Tm = -1, Wg = !1, xm = !1;
    function XC() {
      return Wg;
    }
    function Wb() {
      xm = !0;
    }
    function Gb() {
      Wg = !1, xm = !1;
    }
    function qb() {
      Wg = xm, xm = !1;
    }
    function KC() {
      return qC;
    }
    function JC() {
      qC = jo();
    }
    function Gg(e) {
      kp = jo(), e.actualStartTime < 0 && (e.actualStartTime = jo());
    }
    function ZC(e) {
      kp = -1;
    }
    function bm(e, t) {
      if (kp >= 0) {
        var a = jo() - kp;
        e.actualDuration += a, t && (e.selfBaseDuration = a), kp = -1;
      }
    }
    function Wl(e) {
      if (Rm >= 0) {
        var t = jo() - Rm;
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
        var t = jo() - Tm;
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
    function Gl() {
      Rm = jo();
    }
    function Xg() {
      Tm = jo();
    }
    function Kg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ll(e, t) {
      if (e && e.defaultProps) {
        var a = Je({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Jg = {}, Zg, eS, tS, nS, rS, e0, wm, aS, iS, lS, Dp;
    {
      Zg = /* @__PURE__ */ new Set(), eS = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), Dp = /* @__PURE__ */ new Set();
      var t0 = /* @__PURE__ */ new Set();
      wm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          t0.has(a) || (t0.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, e0 = function(e, t) {
        if (t === void 0) {
          var a = xt(e) || "Component";
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
        if (e.mode & Gt) {
          yn(!0);
          try {
            s = a(i, u);
          } finally {
            yn(!1);
          }
        }
        e0(t, s);
      }
      var f = s == null ? u : Je({}, u, s);
      if (e.memoizedState = f, e.lanes === I) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var oS = {
      isMounted: Nv,
      enqueueSetState: function(e, t, a) {
        var i = fo(e), u = Ea(), s = Vo(i), f = Hu(u, s);
        f.payload = t, a != null && (wm(a, "setState"), f.callback = a);
        var p = No(i, f, s);
        p !== null && (yr(p, i, s, u), tm(p, i, s)), ps(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = fo(e), u = Ea(), s = Vo(i), f = Hu(u, s);
        f.tag = gC, f.payload = t, a != null && (wm(a, "replaceState"), f.callback = a);
        var p = No(i, f, s);
        p !== null && (yr(p, i, s, u), tm(p, i, s)), ps(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = fo(e), i = Ea(), u = Vo(a), s = Hu(i, u);
        s.tag = Jh, t != null && (wm(t, "forceUpdate"), s.callback = t);
        var f = No(a, s, u);
        f !== null && (yr(f, a, u, i), tm(f, a, u)), Lc(a, u);
      }
    };
    function n0(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Gt) {
            yn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              yn(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", xt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !ye(a, i) || !ye(u, s) : !0;
    }
    function Xb(e, t, a) {
      var i = e.stateNode;
      {
        var u = xt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Dp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Gt) === De && (Dp.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Dp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Gt) === De && (Dp.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !iS.has(t) && (iS.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", xt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !tS.has(t) && (tS.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", xt(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || nt(p)) && S("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function r0(e, t) {
      t.updater = oS, e.stateNode = t, pu(t, e), t._reactInternalInstance = Jg;
    }
    function a0(e, t, a) {
      var i = !1, u = li, s = li, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !lS.has(t)) {
          lS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === pi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", xt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = tr(f);
      else {
        u = Cf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? Rf(e, u) : li;
      }
      var g = new t(a, s);
      if (e.mode & Gt) {
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
          var x = xt(t) || "Component";
          eS.has(x) || (eS.add(x), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", x, g.state === null ? "null" : "undefined", x));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof g.getSnapshotBeforeUpdate == "function") {
          var N = null, A = null, F = null;
          if (typeof g.componentWillMount == "function" && g.componentWillMount.__suppressDeprecationWarning !== !0 ? N = "componentWillMount" : typeof g.UNSAFE_componentWillMount == "function" && (N = "UNSAFE_componentWillMount"), typeof g.componentWillReceiveProps == "function" && g.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? A = "componentWillReceiveProps" : typeof g.UNSAFE_componentWillReceiveProps == "function" && (A = "UNSAFE_componentWillReceiveProps"), typeof g.componentWillUpdate == "function" && g.componentWillUpdate.__suppressDeprecationWarning !== !0 ? F = "componentWillUpdate" : typeof g.UNSAFE_componentWillUpdate == "function" && (F = "UNSAFE_componentWillUpdate"), N !== null || A !== null || F !== null) {
            var le = xt(t) || "Component", Me = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            nS.has(le) || (nS.add(le), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, le, Me, N !== null ? `
  ` + N : "", A !== null ? `
  ` + A : "", F !== null ? `
  ` + F : ""));
          }
        }
      }
      return i && WE(e, u, s), g;
    }
    function Kb(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Be(e) || "Component"), oS.enqueueReplaceState(t, t.state, null));
    }
    function i0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = Be(e) || "Component";
          Zg.has(s) || (Zg.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        oS.enqueueReplaceState(t, t.state, null);
      }
    }
    function sS(e, t, a, i) {
      Xb(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, gg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = tr(s);
      else {
        var f = Cf(e, t, !0);
        u.context = Rf(e, f);
      }
      {
        if (u.state === a) {
          var p = xt(t) || "Component";
          aS.has(p) || (aS.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Gt && rl.recordLegacyContextWarning(e, u), rl.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (uS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (Kb(e, u), nm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = Et;
        y |= Qi, (e.mode & Mt) !== De && (y |= wl), e.flags |= y;
      }
    }
    function Jb(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = li;
      if (typeof p == "object" && p !== null)
        v = tr(p);
      else {
        var y = Cf(e, t, !0);
        v = Rf(e, y);
      }
      var g = t.getDerivedStateFromProps, w = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !w && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && i0(e, u, a, v), EC();
      var x = e.memoizedState, N = u.state = x;
      if (nm(e, a, u, i), N = e.memoizedState, s === a && x === N && !jh() && !rm()) {
        if (typeof u.componentDidMount == "function") {
          var A = Et;
          A |= Qi, (e.mode & Mt) !== De && (A |= wl), e.flags |= A;
        }
        return !1;
      }
      typeof g == "function" && (uS(e, t, g, a), N = e.memoizedState);
      var F = rm() || n0(e, t, s, a, x, N, v);
      if (F) {
        if (!w && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var le = Et;
          le |= Qi, (e.mode & Mt) !== De && (le |= wl), e.flags |= le;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Me = Et;
          Me |= Qi, (e.mode & Mt) !== De && (Me |= wl), e.flags |= Me;
        }
        e.memoizedProps = a, e.memoizedState = N;
      }
      return u.props = a, u.state = N, u.context = v, F;
    }
    function Zb(e, t, a, i, u) {
      var s = t.stateNode;
      SC(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ll(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, g = a.contextType, w = li;
      if (typeof g == "object" && g !== null)
        w = tr(g);
      else {
        var x = Cf(t, a, !0);
        w = Rf(t, x);
      }
      var N = a.getDerivedStateFromProps, A = typeof N == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !A && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== w) && i0(t, s, i, w), EC();
      var F = t.memoizedState, le = s.state = F;
      if (nm(t, i, s, u), le = t.memoizedState, f === v && F === le && !jh() && !rm() && !Te)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= Et), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= $n), !1;
      typeof N == "function" && (uS(t, a, N, i), le = t.memoizedState);
      var Me = rm() || n0(t, a, p, i, F, le, w) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Te;
      return Me ? (!A && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, le, w), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, le, w)), typeof s.componentDidUpdate == "function" && (t.flags |= Et), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= $n)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= Et), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || F !== e.memoizedState) && (t.flags |= $n), t.memoizedProps = i, t.memoizedState = le), s.props = i, s.state = le, s.context = w, Me;
    }
    function Js(e, t) {
      return {
        value: e,
        source: t,
        stack: Pi(t),
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
    function ew(e, t) {
      return !0;
    }
    function fS(e, t) {
      try {
        var a = ew(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === de)
            return;
          console.error(i);
        }
        var p = u ? Be(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === Z)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var g = Be(e) || "Anonymous";
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
    var tw = typeof WeakMap == "function" ? WeakMap : Map;
    function l0(e, t, a) {
      var i = Hu(Kt, a);
      i.tag = mg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        W1(u), fS(e, t);
      }, i;
    }
    function dS(e, t, a) {
      var i = Hu(Kt, a);
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
        yR(e), fS(e, t), typeof u != "function" && $1(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (Zr(e.lanes, je) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Be(e) || "Unknown"));
      }), i;
    }
    function u0(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new tw(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = G1.bind(null, e, t, a);
        Kr && Qp(e, a), t.then(s, s);
      }
    }
    function nw(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function rw(e, t) {
      var a = e.tag;
      if ((e.mode & lt) === De && (a === se || a === Qe || a === Fe)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function o0(e) {
      var t = e;
      do {
        if (t.tag === _e && jb(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function s0(e, t, a, i, u) {
      if ((e.mode & lt) === De) {
        if (e === t)
          e.flags |= Kn;
        else {
          if (e.flags |= we, a.flags |= Tc, a.flags &= -52805, a.tag === de) {
            var s = a.alternate;
            if (s === null)
              a.tag = Ft;
            else {
              var f = Hu(Kt, je);
              f.tag = Jh, No(a, f, je);
            }
          }
          a.lanes = Xe(a.lanes, je);
        }
        return e;
      }
      return e.flags |= Kn, e.lanes = u, e;
    }
    function aw(e, t, a, i, u) {
      if (a.flags |= us, Kr && Qp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        rw(a), Ar() && a.mode & lt && eC();
        var f = o0(t);
        if (f !== null) {
          f.flags &= ~Cr, s0(f, t, a, e, u), f.mode & lt && u0(e, s, u), nw(f, e, s);
          return;
        } else {
          if (!Vv(u)) {
            u0(e, s, u), $S();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (Ar() && a.mode & lt) {
        eC();
        var v = o0(t);
        if (v !== null) {
          (v.flags & Kn) === ke && (v.flags |= Cr), s0(v, t, a, e, u), ag(Js(i, a));
          return;
        }
      }
      i = Js(i, a), j1(i);
      var y = t;
      do {
        switch (y.tag) {
          case Z: {
            var g = i;
            y.flags |= Kn;
            var w = Rs(u);
            y.lanes = Xe(y.lanes, w);
            var x = l0(y, g, w);
            Sg(y, x);
            return;
          }
          case de:
            var N = i, A = y.type, F = y.stateNode;
            if ((y.flags & we) === ke && (typeof A.getDerivedStateFromError == "function" || F !== null && typeof F.componentDidCatch == "function" && !oR(F))) {
              y.flags |= Kn;
              var le = Rs(u);
              y.lanes = Xe(y.lanes, le);
              var Me = dS(y, N, le);
              Sg(y, Me);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function iw() {
      return null;
    }
    var Op = M.ReactCurrentOwner, ul = !1, pS, Lp, vS, hS, mS, Zs, yS, _m, Mp;
    pS = {}, Lp = {}, vS = {}, hS = {}, mS = {}, Zs = !1, yS = {}, _m = {}, Mp = {};
    function ga(e, t, a, i) {
      e === null ? t.child = dC(t, null, a, i) : t.child = wf(t, e.child, a, i);
    }
    function lw(e, t, a, i) {
      t.child = wf(t, e.child, null, i), t.child = wf(t, null, a, i);
    }
    function c0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && tl(
          s,
          i,
          // Resolved props
          "prop",
          xt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      kf(t, u), va(t);
      {
        if (Op.current = t, In(!0), v = zf(e, t, f, i, p, u), y = Uf(), t.mode & Gt) {
          yn(!0);
          try {
            v = zf(e, t, f, i, p, u), y = Uf();
          } finally {
            yn(!1);
          }
        }
        In(!1);
      }
      return ha(), e !== null && !ul ? (wC(e, t, u), Pu(e, t, u)) : (Ar() && y && Jy(t), t.flags |= ti, ga(e, t, v, u), t.child);
    }
    function f0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (f_(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Yf(s), t.tag = Fe, t.type = f, ES(t, s), d0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && tl(
            p,
            i,
            // Resolved props
            "prop",
            xt(s)
          ), a.defaultProps !== void 0) {
            var v = xt(s) || "Unknown";
            Mp[v] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Mp[v] = !0);
          }
        }
        var y = nE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var g = a.type, w = g.propTypes;
        w && tl(
          w,
          i,
          // Resolved props
          "prop",
          xt(g)
        );
      }
      var x = e.child, N = wS(e, u);
      if (!N) {
        var A = x.memoizedProps, F = a.compare;
        if (F = F !== null ? F : ye, F(A, i) && e.ref === t.ref)
          return Pu(e, t, u);
      }
      t.flags |= ti;
      var le = ac(x, i);
      return le.ref = t.ref, le.return = t, t.child = le, le;
    }
    function d0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Ye) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var y = s && s.propTypes;
          y && tl(
            y,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            xt(s)
          );
        }
      }
      if (e !== null) {
        var g = e.memoizedProps;
        if (ye(g, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ul = !1, t.pendingProps = i = g, wS(e, u))
            (e.flags & Tc) !== ke && (ul = !0);
          else return t.lanes = e.lanes, Pu(e, t, u);
      }
      return gS(e, t, a, i, u);
    }
    function p0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ne)
        if ((t.mode & lt) === De) {
          var f = {
            baseLanes: I,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Pm(t, a);
        } else if (Zr(a, Jr)) {
          var w = {
            baseLanes: I,
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
            v = Xe(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Jr;
          var g = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = g, t.updateQueue = null, Pm(t, v), null;
        }
      else {
        var N;
        s !== null ? (N = Xe(s.baseLanes, a), t.memoizedState = null) : N = a, Pm(t, N);
      }
      return ga(e, t, u, a), t.child;
    }
    function uw(e, t, a) {
      var i = t.pendingProps;
      return ga(e, t, i, a), t.child;
    }
    function ow(e, t, a) {
      var i = t.pendingProps.children;
      return ga(e, t, i, a), t.child;
    }
    function sw(e, t, a) {
      {
        t.flags |= Et;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return ga(e, t, s, a), t.child;
    }
    function v0(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= En, t.flags |= vo);
    }
    function gS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && tl(
          s,
          i,
          // Resolved props
          "prop",
          xt(a)
        );
      }
      var f;
      {
        var p = Cf(t, a, !0);
        f = Rf(t, p);
      }
      var v, y;
      kf(t, u), va(t);
      {
        if (Op.current = t, In(!0), v = zf(e, t, a, i, f, u), y = Uf(), t.mode & Gt) {
          yn(!0);
          try {
            v = zf(e, t, a, i, f, u), y = Uf();
          } finally {
            yn(!1);
          }
        }
        In(!1);
      }
      return ha(), e !== null && !ul ? (wC(e, t, u), Pu(e, t, u)) : (Ar() && y && Jy(t), t.flags |= ti, ga(e, t, v, u), t.child);
    }
    function h0(e, t, a, i, u) {
      {
        switch (w_(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= we, t.flags |= Kn;
            var y = new Error("Simulated error coming from DevTools"), g = Rs(u);
            t.lanes = Xe(t.lanes, g);
            var w = dS(t, Js(y, t), g);
            Sg(t, w);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var x = a.propTypes;
          x && tl(
            x,
            i,
            // Resolved props
            "prop",
            xt(a)
          );
        }
      }
      var N;
      Yl(a) ? (N = !0, Hh(t)) : N = !1, kf(t, u);
      var A = t.stateNode, F;
      A === null ? (Dm(e, t), a0(t, a, i), sS(t, a, i, u), F = !0) : e === null ? F = Jb(t, a, i, u) : F = Zb(e, t, a, i, u);
      var le = SS(e, t, a, F, N, u);
      {
        var Me = t.stateNode;
        F && Me.props !== i && (Zs || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Be(t) || "a component"), Zs = !0);
      }
      return le;
    }
    function SS(e, t, a, i, u, s) {
      v0(e, t);
      var f = (t.flags & we) !== ke;
      if (!i && !f)
        return u && XE(t, a, !1), Pu(e, t, s);
      var p = t.stateNode;
      Op.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, ZC();
      else {
        va(t);
        {
          if (In(!0), v = p.render(), t.mode & Gt) {
            yn(!0);
            try {
              p.render();
            } finally {
              yn(!1);
            }
          }
          In(!1);
        }
        ha();
      }
      return t.flags |= ti, e !== null && f ? lw(e, t, v, s) : ga(e, t, v, s), t.memoizedState = p.state, u && XE(t, a, !0), t.child;
    }
    function m0(e) {
      var t = e.stateNode;
      t.pendingContext ? GE(e, t.pendingContext, t.pendingContext !== t.context) : t.context && GE(e, t.context, !1), Eg(e, t.containerInfo);
    }
    function cw(e, t, a) {
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
          var g = Js(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return y0(e, t, p, a, g);
        } else if (p !== s) {
          var w = Js(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return y0(e, t, p, a, w);
        } else {
          pb(t);
          var x = dC(t, null, p, a);
          t.child = x;
          for (var N = x; N; )
            N.flags = N.flags & ~mn | Gr, N = N.sibling;
        }
      } else {
        if (bf(), p === s)
          return Pu(e, t, a);
        ga(e, t, p, a);
      }
      return t.child;
    }
    function y0(e, t, a, i, u) {
      return bf(), ag(u), t.flags |= Cr, ga(e, t, a, i), t.child;
    }
    function fw(e, t, a) {
      TC(t), e === null && rg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Fy(i, u);
      return p ? f = null : s !== null && Fy(i, s) && (t.flags |= Da), v0(e, t), ga(e, t, f, a), t.child;
    }
    function dw(e, t) {
      return e === null && rg(t), null;
    }
    function pw(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = d_(v), g = ll(v, u), w;
      switch (y) {
        case se:
          return ES(t, v), t.type = v = Yf(v), w = gS(null, t, v, g, i), w;
        case de:
          return t.type = v = XS(v), w = h0(null, t, v, g, i), w;
        case Qe:
          return t.type = v = KS(v), w = c0(null, t, v, g, i), w;
        case ut: {
          if (t.type !== t.elementType) {
            var x = v.propTypes;
            x && tl(
              x,
              g,
              // Resolved for outer only
              "prop",
              xt(v)
            );
          }
          return w = f0(
            null,
            t,
            v,
            ll(v.type, g),
            // The inner type can have defaults too
            i
          ), w;
        }
      }
      var N = "";
      throw v !== null && typeof v == "object" && v.$$typeof === Ye && (N = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + N));
    }
    function vw(e, t, a, i, u) {
      Dm(e, t), t.tag = de;
      var s;
      return Yl(a) ? (s = !0, Hh(t)) : s = !1, kf(t, u), a0(t, a, i), sS(t, a, i, u), SS(null, t, a, !0, s, u);
    }
    function hw(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s;
      {
        var f = Cf(t, a, !1);
        s = Rf(t, f);
      }
      kf(t, i);
      var p, v;
      va(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = xt(a) || "Unknown";
          pS[y] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), pS[y] = !0);
        }
        t.mode & Gt && rl.recordLegacyContextWarning(t, null), In(!0), Op.current = t, p = zf(null, t, a, u, s, i), v = Uf(), In(!1);
      }
      if (ha(), t.flags |= ti, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var g = xt(a) || "Unknown";
        Lp[g] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", g, g, g), Lp[g] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var w = xt(a) || "Unknown";
          Lp[w] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", w, w, w), Lp[w] = !0);
        }
        t.tag = de, t.memoizedState = null, t.updateQueue = null;
        var x = !1;
        return Yl(a) ? (x = !0, Hh(t)) : x = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, gg(t), r0(t, p), sS(t, a, u, i), SS(null, t, a, !0, x, i);
      } else {
        if (t.tag = se, t.mode & Gt) {
          yn(!0);
          try {
            p = zf(null, t, a, u, s, i), v = Uf();
          } finally {
            yn(!1);
          }
        }
        return Ar() && v && Jy(t), ga(null, t, p, i), ES(t, a), t.child;
      }
    }
    function ES(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Dr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), mS[u] || (mS[u] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = xt(t) || "Unknown";
          Mp[f] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Mp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = xt(t) || "Unknown";
          hS[p] || (S("%s: Function components do not support getDerivedStateFromProps.", p), hS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = xt(t) || "Unknown";
          vS[v] || (S("%s: Function components do not support contextType.", v), vS[v] = !0);
        }
      }
    }
    var CS = {
      dehydrated: null,
      treeContext: null,
      retryLane: kt
    };
    function RS(e) {
      return {
        baseLanes: e,
        cachePool: iw(),
        transitions: null
      };
    }
    function mw(e, t) {
      var a = null;
      return {
        baseLanes: Xe(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function yw(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Tg(e, Cp);
    }
    function gw(e, t) {
      return Ts(e.childLanes, t);
    }
    function g0(e, t, a) {
      var i = t.pendingProps;
      __(t) && (t.flags |= we);
      var u = al.current, s = !1, f = (t.flags & we) !== ke;
      if (f || yw(u, e) ? (s = !0, t.flags &= ~we) : (e === null || e.memoizedState !== null) && (u = Ab(u, bC)), u = Of(u), Uo(t, u), e === null) {
        rg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return Tw(t, v);
        }
        var y = i.children, g = i.fallback;
        if (s) {
          var w = Sw(t, y, g, a), x = t.child;
          return x.memoizedState = RS(a), t.memoizedState = CS, w;
        } else
          return TS(t, y);
      } else {
        var N = e.memoizedState;
        if (N !== null) {
          var A = N.dehydrated;
          if (A !== null)
            return xw(e, t, f, i, A, N, a);
        }
        if (s) {
          var F = i.fallback, le = i.children, Me = Cw(e, t, le, F, a), be = t.child, Tt = e.child.memoizedState;
          return be.memoizedState = Tt === null ? RS(a) : mw(Tt, a), be.childLanes = gw(e, a), t.memoizedState = CS, Me;
        } else {
          var ht = i.children, D = Ew(e, t, ht, a);
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
    function Sw(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & lt) === De && s !== null ? (p = s, p.childLanes = I, p.pendingProps = f, e.mode & Lt && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Yo(a, u, i, null)) : (p = xS(f, u), v = Yo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function xS(e, t, a) {
      return SR(e, t, I, null);
    }
    function S0(e, t) {
      return ac(e, t);
    }
    function Ew(e, t, a, i) {
      var u = e.child, s = u.sibling, f = S0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & lt) === De && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= ka) : p.push(s);
      }
      return t.child = f, f;
    }
    function Cw(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & lt) === De && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var g = t.child;
        y = g, y.childLanes = I, y.pendingProps = v, t.mode & Lt && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = S0(f, v), y.subtreeFlags = f.subtreeFlags & zn;
      var w;
      return p !== null ? w = ac(p, i) : (w = Yo(i, s, u, null), w.flags |= mn), w.return = t, y.return = t, y.sibling = w, t.child = y, w;
    }
    function km(e, t, a, i) {
      i !== null && ag(i), wf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = TS(t, s);
      return f.flags |= mn, t.memoizedState = null, f;
    }
    function Rw(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = xS(f, s), v = Yo(i, s, u, null);
      return v.flags |= mn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & lt) !== De && wf(t, e.child, null, u), v;
    }
    function Tw(e, t, a) {
      return (e.mode & lt) === De ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = je) : By(t) ? e.lanes = Rr : e.lanes = Jr, null;
    }
    function xw(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Cr) {
          t.flags &= ~Cr;
          var D = cS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return km(e, t, f, D);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= we, null;
          var H = i.children, O = i.fallback, X = Rw(e, t, H, O, f), pe = t.child;
          return pe.memoizedState = RS(f), t.memoizedState = CS, X;
        }
      else {
        if (fb(), (t.mode & lt) === De)
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
            var g = kx(u);
            p = g.digest, v = g.message, y = g.stack;
          }
          var w;
          v ? w = new Error(v) : w = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var x = cS(w, p, y);
          return km(e, t, f, x);
        }
        var N = Zr(f, e.childLanes);
        if (ul || N) {
          var A = Hm();
          if (A !== null) {
            var F = Ud(A, f);
            if (F !== kt && F !== s.retryLane) {
              s.retryLane = F;
              var le = Kt;
              Fa(e, F), yr(A, e, F, le);
            }
          }
          $S();
          var Me = cS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return km(e, t, f, Me);
        } else if (BE(u)) {
          t.flags |= we, t.child = e.child;
          var be = q1.bind(null, e);
          return Dx(u, be), null;
        } else {
          vb(t, u, s.treeContext);
          var Tt = i.children, ht = TS(t, Tt);
          return ht.flags |= Gr, ht;
        }
      }
    }
    function E0(e, t, a) {
      e.lanes = Xe(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = Xe(i.lanes, t)), vg(e.return, t, a);
    }
    function bw(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === _e) {
          var u = i.memoizedState;
          u !== null && E0(i, a, e);
        } else if (i.tag === ln)
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
    function ww(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && lm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function _w(e) {
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
    function kw(e, t) {
      e !== void 0 && !_m[e] && (e !== "collapsed" && e !== "hidden" ? (_m[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (_m[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function C0(e, t) {
      {
        var a = nt(e), i = !a && typeof qe(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Dw(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (nt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!C0(e[a], a))
              return;
        } else {
          var i = qe(e);
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
      _w(u), kw(s, u), Dw(f, u), ga(e, t, f, a);
      var p = al.current, v = Tg(p, Cp);
      if (v)
        p = xg(p, Cp), t.flags |= we;
      else {
        var y = e !== null && (e.flags & we) !== ke;
        y && bw(t, t.child, a), p = Of(p);
      }
      if (Uo(t, p), (t.mode & lt) === De)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var g = ww(t.child), w;
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
            var x = null, N = t.child;
            for (t.child = null; N !== null; ) {
              var A = N.alternate;
              if (A !== null && lm(A) === null) {
                t.child = N;
                break;
              }
              var F = N.sibling;
              N.sibling = x, x = N, N = F;
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
    function Ow(e, t, a) {
      Eg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = wf(t, null, i, a) : ga(e, t, i, a), t.child;
    }
    var T0 = !1;
    function Lw(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || T0 || (T0 = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && tl(v, s, "prop", "Context.Provider");
      }
      if (hC(t, u, p), f !== null) {
        var y = f.value;
        if (W(y, p)) {
          if (f.children === s.children && !jh())
            return Pu(e, t, a);
        } else
          _b(t, u, a);
      }
      var g = s.children;
      return ga(e, t, g, a), t.child;
    }
    var x0 = !1;
    function Mw(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (x0 || (x0 = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), kf(t, a);
      var f = tr(i);
      va(t);
      var p;
      return Op.current = t, In(!0), p = s(f), In(!1), ha(), t.flags |= ti, ga(e, t, p, a), t.child;
    }
    function Np() {
      ul = !0;
    }
    function Dm(e, t) {
      (t.mode & lt) === De && e !== null && (e.alternate = null, t.alternate = null, t.flags |= mn);
    }
    function Pu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), ZC(), $p(t.lanes), Zr(a, t.childLanes) ? (bb(e, t), t.child) : null;
    }
    function Nw(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= ka) : s.push(e), a.flags |= mn, a;
      }
    }
    function wS(e, t) {
      var a = e.lanes;
      return !!Zr(a, t);
    }
    function zw(e, t, a) {
      switch (t.tag) {
        case Z:
          m0(t), t.stateNode, bf();
          break;
        case ue:
          TC(t);
          break;
        case de: {
          var i = t.type;
          Yl(i) && Hh(t);
          break;
        }
        case Re:
          Eg(t, t.stateNode.containerInfo);
          break;
        case ct: {
          var u = t.memoizedProps.value, s = t.type._context;
          hC(t, s, u);
          break;
        }
        case vt:
          {
            var f = Zr(a, t.childLanes);
            f && (t.flags |= Et);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case _e: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Uo(t, Of(al.current)), t.flags |= we, null;
            var y = t.child, g = y.childLanes;
            if (Zr(a, g))
              return g0(e, t, a);
            Uo(t, Of(al.current));
            var w = Pu(e, t, a);
            return w !== null ? w.sibling : null;
          } else
            Uo(t, Of(al.current));
          break;
        }
        case ln: {
          var x = (e.flags & we) !== ke, N = Zr(a, t.childLanes);
          if (x) {
            if (N)
              return R0(e, t, a);
            t.flags |= we;
          }
          var A = t.memoizedState;
          if (A !== null && (A.rendering = null, A.tail = null, A.lastEffect = null), Uo(t, al.current), N)
            break;
          return null;
        }
        case Oe:
        case At:
          return t.lanes = I, p0(e, t, a);
      }
      return Pu(e, t, a);
    }
    function b0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return Nw(e, t, nE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || jh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ul = !0;
        else {
          var s = wS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & we) === ke)
            return ul = !1, zw(e, t, a);
          (e.flags & Tc) !== ke ? ul = !0 : ul = !1;
        }
      } else if (ul = !1, Ar() && ib(t)) {
        var f = t.index, p = lb();
        ZE(t, p, f);
      }
      switch (t.lanes = I, t.tag) {
        case Ee:
          return hw(e, t, t.type, a);
        case an: {
          var v = t.elementType;
          return pw(e, t, v, a);
        }
        case se: {
          var y = t.type, g = t.pendingProps, w = t.elementType === y ? g : ll(y, g);
          return gS(e, t, y, w, a);
        }
        case de: {
          var x = t.type, N = t.pendingProps, A = t.elementType === x ? N : ll(x, N);
          return h0(e, t, x, A, a);
        }
        case Z:
          return cw(e, t, a);
        case ue:
          return fw(e, t, a);
        case $e:
          return dw(e, t);
        case _e:
          return g0(e, t, a);
        case Re:
          return Ow(e, t, a);
        case Qe: {
          var F = t.type, le = t.pendingProps, Me = t.elementType === F ? le : ll(F, le);
          return c0(e, t, F, Me, a);
        }
        case St:
          return uw(e, t, a);
        case pt:
          return ow(e, t, a);
        case vt:
          return sw(e, t, a);
        case ct:
          return Lw(e, t, a);
        case fn:
          return Mw(e, t, a);
        case ut: {
          var be = t.type, Tt = t.pendingProps, ht = ll(be, Tt);
          if (t.type !== t.elementType) {
            var D = be.propTypes;
            D && tl(
              D,
              ht,
              // Resolved for outer only
              "prop",
              xt(be)
            );
          }
          return ht = ll(be.type, ht), f0(e, t, be, ht, a);
        }
        case Fe:
          return d0(e, t, t.type, t.pendingProps, a);
        case Ft: {
          var H = t.type, O = t.pendingProps, X = t.elementType === H ? O : ll(H, O);
          return vw(e, t, H, X, a);
        }
        case ln:
          return R0(e, t, a);
        case wt:
          break;
        case Oe:
          return p0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Af(e) {
      e.flags |= Et;
    }
    function w0(e) {
      e.flags |= En, e.flags |= vo;
    }
    var _0, _S, k0, D0;
    _0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ue || u.tag === $e)
          nx(e, u.stateNode);
        else if (u.tag !== Re) {
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
        var f = t.stateNode, p = Cg(), v = ax(f, a, s, i, u, p);
        t.updateQueue = v, v && Af(t);
      }
    }, D0 = function(e, t, a, i) {
      a !== i && Af(t);
    };
    function zp(e, t) {
      if (!Ar())
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
    function Fr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = I, i = ke;
      if (t) {
        if ((e.mode & Lt) !== De) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = Xe(a, Xe(y.lanes, y.childLanes)), i |= y.subtreeFlags & zn, i |= y.flags & zn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var g = e.child; g !== null; )
            a = Xe(a, Xe(g.lanes, g.childLanes)), i |= g.subtreeFlags & zn, i |= g.flags & zn, g.return = e, g = g.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Lt) !== De) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = Xe(a, Xe(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = Xe(a, Xe(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Uw(e, t, a) {
      if (Sb() && (t.mode & lt) !== De && (t.flags & we) === ke)
        return lC(t), bf(), t.flags |= Cr | us | Kn, !1;
      var i = Ih(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (yb(t), Fr(t), (t.mode & Lt) !== De) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (bf(), (t.flags & we) === ke && (t.memoizedState = null), t.flags |= Et, Fr(t), (t.mode & Lt) !== De) {
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
        case Ee:
        case an:
        case Fe:
        case se:
        case Qe:
        case St:
        case pt:
        case vt:
        case fn:
        case ut:
          return Fr(t), null;
        case de: {
          var u = t.type;
          return Yl(u) && Fh(t), Fr(t), null;
        }
        case Z: {
          var s = t.stateNode;
          if (Df(t), qy(t), wg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Ih(t);
            if (f)
              Af(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Cr) !== ke) && (t.flags |= $n, uC());
            }
          }
          return _S(e, t), Fr(t), null;
        }
        case ue: {
          Rg(t);
          var v = RC(), y = t.type;
          if (e !== null && t.stateNode != null)
            k0(e, t, y, i, v), e.ref !== t.ref && w0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Fr(t), null;
            }
            var g = Cg(), w = Ih(t);
            if (w)
              hb(t, v, g) && Af(t);
            else {
              var x = tx(y, i, v, g, t);
              _0(x, t, !1, !1), t.stateNode = x, rx(x, y, i, v) && Af(t);
            }
            t.ref !== null && w0(t);
          }
          return Fr(t), null;
        }
        case $e: {
          var N = i;
          if (e && t.stateNode != null) {
            var A = e.memoizedProps;
            D0(e, t, A, N);
          } else {
            if (typeof N != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var F = RC(), le = Cg(), Me = Ih(t);
            Me ? mb(t) && Af(t) : t.stateNode = ix(N, F, le, t);
          }
          return Fr(t), null;
        }
        case _e: {
          Lf(t);
          var be = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Tt = Uw(e, t, be);
            if (!Tt)
              return t.flags & Kn ? t : null;
          }
          if ((t.flags & we) !== ke)
            return t.lanes = a, (t.mode & Lt) !== De && Kg(t), t;
          var ht = be !== null, D = e !== null && e.memoizedState !== null;
          if (ht !== D && ht) {
            var H = t.child;
            if (H.flags |= Nn, (t.mode & lt) !== De) {
              var O = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              O || Tg(al.current, bC) ? A1() : $S();
            }
          }
          var X = t.updateQueue;
          if (X !== null && (t.flags |= Et), Fr(t), (t.mode & Lt) !== De && ht) {
            var pe = t.child;
            pe !== null && (t.treeBaseDuration -= pe.treeBaseDuration);
          }
          return null;
        }
        case Re:
          return Df(t), _S(e, t), e === null && Jx(t.stateNode.containerInfo), Fr(t), null;
        case ct:
          var oe = t.type._context;
          return pg(oe, t), Fr(t), null;
        case Ft: {
          var Pe = t.type;
          return Yl(Pe) && Fh(t), Fr(t), null;
        }
        case ln: {
          Lf(t);
          var We = t.memoizedState;
          if (We === null)
            return Fr(t), null;
          var Xt = (t.flags & we) !== ke, zt = We.rendering;
          if (zt === null)
            if (Xt)
              zp(We, !1);
            else {
              var Gn = F1() && (e === null || (e.flags & we) === ke);
              if (!Gn)
                for (var Ut = t.child; Ut !== null; ) {
                  var Pn = lm(Ut);
                  if (Pn !== null) {
                    Xt = !0, t.flags |= we, zp(We, !1);
                    var la = Pn.updateQueue;
                    return la !== null && (t.updateQueue = la, t.flags |= Et), t.subtreeFlags = ke, wb(t, a), Uo(t, xg(al.current, Cp)), t.child;
                  }
                  Ut = Ut.sibling;
                }
              We.tail !== null && Qn() > K0() && (t.flags |= we, Xt = !0, zp(We, !1), t.lanes = wd);
            }
          else {
            if (!Xt) {
              var Yr = lm(zt);
              if (Yr !== null) {
                t.flags |= we, Xt = !0;
                var oi = Yr.updateQueue;
                if (oi !== null && (t.updateQueue = oi, t.flags |= Et), zp(We, !0), We.tail === null && We.tailMode === "hidden" && !zt.alternate && !Ar())
                  return Fr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Qn() * 2 - We.renderingStartTime > K0() && a !== Jr && (t.flags |= we, Xt = !0, zp(We, !1), t.lanes = wd);
            }
            if (We.isBackwards)
              zt.sibling = t.child, t.child = zt;
            else {
              var Ca = We.last;
              Ca !== null ? Ca.sibling = zt : t.child = zt, We.last = zt;
            }
          }
          if (We.tail !== null) {
            var Ra = We.tail;
            We.rendering = Ra, We.tail = Ra.sibling, We.renderingStartTime = Qn(), Ra.sibling = null;
            var ua = al.current;
            return Xt ? ua = xg(ua, Cp) : ua = Of(ua), Uo(t, ua), Ra;
          }
          return Fr(t), null;
        }
        case wt:
          break;
        case Oe:
        case At: {
          IS(t);
          var $u = t.memoizedState, If = $u !== null;
          if (e !== null) {
            var Xp = e.memoizedState, Kl = Xp !== null;
            Kl !== If && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ne && (t.flags |= Nn);
          }
          return !If || (t.mode & lt) === De ? Fr(t) : Zr(Xl, Jr) && (Fr(t), t.subtreeFlags & (mn | Et) && (t.flags |= Nn)), null;
        }
        case _t:
          return null;
        case Dt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Aw(e, t, a) {
      switch (Zy(t), t.tag) {
        case de: {
          var i = t.type;
          Yl(i) && Fh(t);
          var u = t.flags;
          return u & Kn ? (t.flags = u & ~Kn | we, (t.mode & Lt) !== De && Kg(t), t) : null;
        }
        case Z: {
          t.stateNode, Df(t), qy(t), wg();
          var s = t.flags;
          return (s & Kn) !== ke && (s & we) === ke ? (t.flags = s & ~Kn | we, t) : null;
        }
        case ue:
          return Rg(t), null;
        case _e: {
          Lf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            bf();
          }
          var p = t.flags;
          return p & Kn ? (t.flags = p & ~Kn | we, (t.mode & Lt) !== De && Kg(t), t) : null;
        }
        case ln:
          return Lf(t), null;
        case Re:
          return Df(t), null;
        case ct:
          var v = t.type._context;
          return pg(v, t), null;
        case Oe:
        case At:
          return IS(t), null;
        case _t:
          return null;
        default:
          return null;
      }
    }
    function L0(e, t, a) {
      switch (Zy(t), t.tag) {
        case de: {
          var i = t.type.childContextTypes;
          i != null && Fh(t);
          break;
        }
        case Z: {
          t.stateNode, Df(t), qy(t), wg();
          break;
        }
        case ue: {
          Rg(t);
          break;
        }
        case Re:
          Df(t);
          break;
        case _e:
          Lf(t);
          break;
        case ln:
          Lf(t);
          break;
        case ct:
          var u = t.type._context;
          pg(u, t);
          break;
        case Oe:
        case At:
          IS(t);
          break;
      }
    }
    var M0 = null;
    M0 = /* @__PURE__ */ new Set();
    var Om = !1, Hr = !1, jw = typeof WeakSet == "function" ? WeakSet : Set, ge = null, jf = null, Ff = null;
    function Fw(e) {
      bl(null, function() {
        throw e;
      }), ls();
    }
    var Hw = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Lt)
        try {
          Gl(), t.componentWillUnmount();
        } finally {
          Wl(e);
        }
      else
        t.componentWillUnmount();
    };
    function N0(e, t) {
      try {
        Fo(fr, e);
      } catch (a) {
        cn(e, t, a);
      }
    }
    function kS(e, t, a) {
      try {
        Hw(e, a);
      } catch (i) {
        cn(e, t, i);
      }
    }
    function Pw(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        cn(e, t, i);
      }
    }
    function z0(e, t) {
      try {
        A0(e);
      } catch (a) {
        cn(e, t, a);
      }
    }
    function Hf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Ae && rt && e.mode & Lt)
              try {
                Gl(), i = a(null);
              } finally {
                Wl(e);
              }
            else
              i = a(null);
          } catch (u) {
            cn(e, t, u);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Be(e));
        } else
          a.current = null;
    }
    function Lm(e, t, a) {
      try {
        a();
      } catch (i) {
        cn(e, t, i);
      }
    }
    var U0 = !1;
    function Vw(e, t) {
      ZT(e.containerInfo), ge = t, Bw();
      var a = U0;
      return U0 = !1, a;
    }
    function Bw() {
      for (; ge !== null; ) {
        var e = ge, t = e.child;
        (e.subtreeFlags & _l) !== ke && t !== null ? (t.return = e, ge = t) : Yw();
      }
    }
    function Yw() {
      for (; ge !== null; ) {
        var e = ge;
        $t(e);
        try {
          Iw(e);
        } catch (a) {
          cn(e, e.return, a);
        }
        sn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ge = t;
          return;
        }
        ge = e.return;
      }
    }
    function Iw(e) {
      var t = e.alternate, a = e.flags;
      if ((a & $n) !== ke) {
        switch ($t(e), e.tag) {
          case se:
          case Qe:
          case Fe:
            break;
          case de: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !Zs && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Be(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Be(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ll(e.type, i), u);
              {
                var p = M0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Be(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case Z: {
            {
              var v = e.stateNode;
              xx(v.containerInfo);
            }
            break;
          }
          case ue:
          case $e:
          case Re:
          case Ft:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        sn();
      }
    }
    function ol(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & jr) !== Ha ? qi(t) : (e & fr) !== Ha && ss(t), (e & Il) !== Ha && Wp(!0), Lm(t, a, p), (e & Il) !== Ha && Wp(!1), (e & jr) !== Ha ? Ll() : (e & fr) !== Ha && xd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Fo(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & jr) !== Ha ? Td(t) : (e & fr) !== Ha && Dc(t);
            var f = s.create;
            (e & Il) !== Ha && Wp(!0), s.destroy = f(), (e & Il) !== Ha && Wp(!1), (e & jr) !== Ha ? Av() : (e & fr) !== Ha && jv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & fr) !== ke ? v = "useLayoutEffect" : (s.tag & Il) !== ke ? v = "useInsertionEffect" : v = "useEffect";
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
    function $w(e, t) {
      if ((t.flags & Et) !== ke)
        switch (t.tag) {
          case vt: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = KC(), p = t.alternate === null ? "mount" : "update";
            XC() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
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
    function Qw(e, t, a, i) {
      if ((a.flags & Dl) !== ke)
        switch (a.tag) {
          case se:
          case Qe:
          case Fe: {
            if (!Hr)
              if (a.mode & Lt)
                try {
                  Gl(), Fo(fr | cr, a);
                } finally {
                  Wl(a);
                }
              else
                Fo(fr | cr, a);
            break;
          }
          case de: {
            var u = a.stateNode;
            if (a.flags & Et && !Hr)
              if (t === null)
                if (a.type === a.elementType && !Zs && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Be(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Be(a) || "instance")), a.mode & Lt)
                  try {
                    Gl(), u.componentDidMount();
                  } finally {
                    Wl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ll(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !Zs && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Be(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Be(a) || "instance")), a.mode & Lt)
                  try {
                    Gl(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Wl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !Zs && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Be(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Be(a) || "instance")), CC(a, p, u));
            break;
          }
          case Z: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ue:
                    y = a.child.stateNode;
                    break;
                  case de:
                    y = a.child.stateNode;
                    break;
                }
              CC(a, v, y);
            }
            break;
          }
          case ue: {
            var g = a.stateNode;
            if (t === null && a.flags & Et) {
              var w = a.type, x = a.memoizedProps;
              cx(g, w, x);
            }
            break;
          }
          case $e:
            break;
          case Re:
            break;
          case vt: {
            {
              var N = a.memoizedProps, A = N.onCommit, F = N.onRender, le = a.stateNode.effectDuration, Me = KC(), be = t === null ? "mount" : "update";
              XC() && (be = "nested-update"), typeof F == "function" && F(a.memoizedProps.id, be, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Me);
              {
                typeof A == "function" && A(a.memoizedProps.id, be, le, Me), Y1(a);
                var Tt = a.return;
                e: for (; Tt !== null; ) {
                  switch (Tt.tag) {
                    case Z:
                      var ht = Tt.stateNode;
                      ht.effectDuration += le;
                      break e;
                    case vt:
                      var D = Tt.stateNode;
                      D.effectDuration += le;
                      break e;
                  }
                  Tt = Tt.return;
                }
              }
            }
            break;
          }
          case _e: {
            e1(e, a);
            break;
          }
          case ln:
          case Ft:
          case wt:
          case Oe:
          case At:
          case Dt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Hr || a.flags & En && A0(a);
    }
    function Ww(e) {
      switch (e.tag) {
        case se:
        case Qe:
        case Fe: {
          if (e.mode & Lt)
            try {
              Gl(), N0(e, e.return);
            } finally {
              Wl(e);
            }
          else
            N0(e, e.return);
          break;
        }
        case de: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Pw(e, e.return, t), z0(e, e.return);
          break;
        }
        case ue: {
          z0(e, e.return);
          break;
        }
      }
    }
    function Gw(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ue) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? Ex(u) : Rx(i.stateNode, i.memoizedProps);
            } catch (f) {
              cn(e, e.return, f);
            }
          }
        } else if (i.tag === $e) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? Cx(s) : Tx(s, i.memoizedProps);
            } catch (f) {
              cn(e, e.return, f);
            }
        } else if (!((i.tag === Oe || i.tag === At) && i.memoizedState !== null && i !== e)) {
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
          case ue:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Lt)
            try {
              Gl(), u = t(i);
            } finally {
              Wl(e);
            }
          else
            u = t(i);
          typeof u == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Be(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Be(e)), t.current = i;
      }
    }
    function qw(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function j0(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, j0(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ue) {
          var a = e.stateNode;
          a !== null && tb(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function Xw(e) {
      for (var t = e.return; t !== null; ) {
        if (F0(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function F0(e) {
      return e.tag === ue || e.tag === Z || e.tag === Re;
    }
    function H0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || F0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ue && t.tag !== $e && t.tag !== Jt; ) {
          if (t.flags & mn || t.child === null || t.tag === Re)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & mn))
          return t.stateNode;
      }
    }
    function Kw(e) {
      var t = Xw(e);
      switch (t.tag) {
        case ue: {
          var a = t.stateNode;
          t.flags & Da && (VE(a), t.flags &= ~Da);
          var i = H0(e);
          OS(e, i, a);
          break;
        }
        case Z:
        case Re: {
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
      var i = e.tag, u = i === ue || i === $e;
      if (u) {
        var s = e.stateNode;
        t ? mx(a, s, t) : vx(a, s);
      } else if (i !== Re) {
        var f = e.child;
        if (f !== null) {
          DS(f, t, a);
          for (var p = f.sibling; p !== null; )
            DS(p, t, a), p = p.sibling;
        }
      }
    }
    function OS(e, t, a) {
      var i = e.tag, u = i === ue || i === $e;
      if (u) {
        var s = e.stateNode;
        t ? hx(a, s, t) : px(a, s);
      } else if (i !== Re) {
        var f = e.child;
        if (f !== null) {
          OS(f, t, a);
          for (var p = f.sibling; p !== null; )
            OS(p, t, a), p = p.sibling;
        }
      }
    }
    var Pr = null, sl = !1;
    function Jw(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ue: {
              Pr = i.stateNode, sl = !1;
              break e;
            }
            case Z: {
              Pr = i.stateNode.containerInfo, sl = !0;
              break e;
            }
            case Re: {
              Pr = i.stateNode.containerInfo, sl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Pr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        P0(e, t, a), Pr = null, sl = !1;
      }
      qw(a);
    }
    function Ho(e, t, a) {
      for (var i = a.child; i !== null; )
        P0(e, t, i), i = i.sibling;
    }
    function P0(e, t, a) {
      switch (Ed(a), a.tag) {
        case ue:
          Hr || Hf(a, t);
        // eslint-disable-next-line-no-fallthrough
        case $e: {
          {
            var i = Pr, u = sl;
            Pr = null, Ho(e, t, a), Pr = i, sl = u, Pr !== null && (sl ? gx(Pr, a.stateNode) : yx(Pr, a.stateNode));
          }
          return;
        }
        case Jt: {
          Pr !== null && (sl ? Sx(Pr, a.stateNode) : Vy(Pr, a.stateNode));
          return;
        }
        case Re: {
          {
            var s = Pr, f = sl;
            Pr = a.stateNode.containerInfo, sl = !0, Ho(e, t, a), Pr = s, sl = f;
          }
          return;
        }
        case se:
        case Qe:
        case ut:
        case Fe: {
          if (!Hr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, g = y;
                do {
                  var w = g, x = w.destroy, N = w.tag;
                  x !== void 0 && ((N & Il) !== Ha ? Lm(a, t, x) : (N & fr) !== Ha && (ss(a), a.mode & Lt ? (Gl(), Lm(a, t, x), Wl(a)) : Lm(a, t, x), xd())), g = g.next;
                } while (g !== y);
              }
            }
          }
          Ho(e, t, a);
          return;
        }
        case de: {
          if (!Hr) {
            Hf(a, t);
            var A = a.stateNode;
            typeof A.componentWillUnmount == "function" && kS(a, t, A);
          }
          Ho(e, t, a);
          return;
        }
        case wt: {
          Ho(e, t, a);
          return;
        }
        case Oe: {
          if (
            // TODO: Remove this dead flag
            a.mode & lt
          ) {
            var F = Hr;
            Hr = F || a.memoizedState !== null, Ho(e, t, a), Hr = F;
          } else
            Ho(e, t, a);
          break;
        }
        default: {
          Ho(e, t, a);
          return;
        }
      }
    }
    function Zw(e) {
      e.memoizedState;
    }
    function e1(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && Fx(s);
          }
        }
      }
    }
    function V0(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new jw()), t.forEach(function(i) {
          var u = X1.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Kr)
              if (jf !== null && Ff !== null)
                Qp(Ff, jf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function t1(e, t, a) {
      jf = a, Ff = e, $t(t), B0(t, e), $t(t), jf = null, Ff = null;
    }
    function cl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            Jw(e, t, s);
          } catch (v) {
            cn(s, t, v);
          }
        }
      var f = gl();
      if (t.subtreeFlags & kl)
        for (var p = t.child; p !== null; )
          $t(p), B0(p, e), p = p.sibling;
      $t(f);
    }
    function B0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case se:
        case Qe:
        case ut:
        case Fe: {
          if (cl(t, e), ql(e), u & Et) {
            try {
              ol(Il | cr, e, e.return), Fo(Il | cr, e);
            } catch (Pe) {
              cn(e, e.return, Pe);
            }
            if (e.mode & Lt) {
              try {
                Gl(), ol(fr | cr, e, e.return);
              } catch (Pe) {
                cn(e, e.return, Pe);
              }
              Wl(e);
            } else
              try {
                ol(fr | cr, e, e.return);
              } catch (Pe) {
                cn(e, e.return, Pe);
              }
          }
          return;
        }
        case de: {
          cl(t, e), ql(e), u & En && i !== null && Hf(i, i.return);
          return;
        }
        case ue: {
          cl(t, e), ql(e), u & En && i !== null && Hf(i, i.return);
          {
            if (e.flags & Da) {
              var s = e.stateNode;
              try {
                VE(s);
              } catch (Pe) {
                cn(e, e.return, Pe);
              }
            }
            if (u & Et) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, g = e.updateQueue;
                if (e.updateQueue = null, g !== null)
                  try {
                    fx(f, g, y, v, p, e);
                  } catch (Pe) {
                    cn(e, e.return, Pe);
                  }
              }
            }
          }
          return;
        }
        case $e: {
          if (cl(t, e), ql(e), u & Et) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var w = e.stateNode, x = e.memoizedProps, N = i !== null ? i.memoizedProps : x;
            try {
              dx(w, N, x);
            } catch (Pe) {
              cn(e, e.return, Pe);
            }
          }
          return;
        }
        case Z: {
          if (cl(t, e), ql(e), u & Et && i !== null) {
            var A = i.memoizedState;
            if (A.isDehydrated)
              try {
                jx(t.containerInfo);
              } catch (Pe) {
                cn(e, e.return, Pe);
              }
          }
          return;
        }
        case Re: {
          cl(t, e), ql(e);
          return;
        }
        case _e: {
          cl(t, e), ql(e);
          var F = e.child;
          if (F.flags & Nn) {
            var le = F.stateNode, Me = F.memoizedState, be = Me !== null;
            if (le.isHidden = be, be) {
              var Tt = F.alternate !== null && F.alternate.memoizedState !== null;
              Tt || U1();
            }
          }
          if (u & Et) {
            try {
              Zw(e);
            } catch (Pe) {
              cn(e, e.return, Pe);
            }
            V0(e);
          }
          return;
        }
        case Oe: {
          var ht = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & lt
          ) {
            var D = Hr;
            Hr = D || ht, cl(t, e), Hr = D;
          } else
            cl(t, e);
          if (ql(e), u & Nn) {
            var H = e.stateNode, O = e.memoizedState, X = O !== null, pe = e;
            if (H.isHidden = X, X && !ht && (pe.mode & lt) !== De) {
              ge = pe;
              for (var oe = pe.child; oe !== null; )
                ge = oe, r1(oe), oe = oe.sibling;
            }
            Gw(pe, X);
          }
          return;
        }
        case ln: {
          cl(t, e), ql(e), u & Et && V0(e);
          return;
        }
        case wt:
          return;
        default: {
          cl(t, e), ql(e);
          return;
        }
      }
    }
    function ql(e) {
      var t = e.flags;
      if (t & mn) {
        try {
          Kw(e);
        } catch (a) {
          cn(e, e.return, a);
        }
        e.flags &= ~mn;
      }
      t & Gr && (e.flags &= ~Gr);
    }
    function n1(e, t, a) {
      jf = a, Ff = t, ge = e, Y0(e, t, a), jf = null, Ff = null;
    }
    function Y0(e, t, a) {
      for (var i = (e.mode & lt) !== De; ge !== null; ) {
        var u = ge, s = u.child;
        if (u.tag === Oe && i) {
          var f = u.memoizedState !== null, p = f || Om;
          if (p) {
            LS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, g = y || Hr, w = Om, x = Hr;
            Om = p, Hr = g, Hr && !x && (ge = u, a1(u));
            for (var N = s; N !== null; )
              ge = N, Y0(
                N,
                // New root; bubble back up to here and stop.
                t,
                a
              ), N = N.sibling;
            ge = u, Om = w, Hr = x, LS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Dl) !== ke && s !== null ? (s.return = u, ge = s) : LS(e, t, a);
      }
    }
    function LS(e, t, a) {
      for (; ge !== null; ) {
        var i = ge;
        if ((i.flags & Dl) !== ke) {
          var u = i.alternate;
          $t(i);
          try {
            Qw(t, u, i, a);
          } catch (f) {
            cn(i, i.return, f);
          }
          sn();
        }
        if (i === e) {
          ge = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, ge = s;
          return;
        }
        ge = i.return;
      }
    }
    function r1(e) {
      for (; ge !== null; ) {
        var t = ge, a = t.child;
        switch (t.tag) {
          case se:
          case Qe:
          case ut:
          case Fe: {
            if (t.mode & Lt)
              try {
                Gl(), ol(fr, t, t.return);
              } finally {
                Wl(t);
              }
            else
              ol(fr, t, t.return);
            break;
          }
          case de: {
            Hf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && kS(t, t.return, i);
            break;
          }
          case ue: {
            Hf(t, t.return);
            break;
          }
          case Oe: {
            var u = t.memoizedState !== null;
            if (u) {
              I0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, ge = a) : I0(e);
      }
    }
    function I0(e) {
      for (; ge !== null; ) {
        var t = ge;
        if (t === e) {
          ge = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ge = a;
          return;
        }
        ge = t.return;
      }
    }
    function a1(e) {
      for (; ge !== null; ) {
        var t = ge, a = t.child;
        if (t.tag === Oe) {
          var i = t.memoizedState !== null;
          if (i) {
            $0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, ge = a) : $0(e);
      }
    }
    function $0(e) {
      for (; ge !== null; ) {
        var t = ge;
        $t(t);
        try {
          Ww(t);
        } catch (i) {
          cn(t, t.return, i);
        }
        if (sn(), t === e) {
          ge = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ge = a;
          return;
        }
        ge = t.return;
      }
    }
    function i1(e, t, a, i) {
      ge = t, l1(t, e, a, i);
    }
    function l1(e, t, a, i) {
      for (; ge !== null; ) {
        var u = ge, s = u.child;
        (u.subtreeFlags & Wi) !== ke && s !== null ? (s.return = u, ge = s) : u1(e, t, a, i);
      }
    }
    function u1(e, t, a, i) {
      for (; ge !== null; ) {
        var u = ge;
        if ((u.flags & Wr) !== ke) {
          $t(u);
          try {
            o1(t, u, a, i);
          } catch (f) {
            cn(u, u.return, f);
          }
          sn();
        }
        if (u === e) {
          ge = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, ge = s;
          return;
        }
        ge = u.return;
      }
    }
    function o1(e, t, a, i) {
      switch (t.tag) {
        case se:
        case Qe:
        case Fe: {
          if (t.mode & Lt) {
            Xg();
            try {
              Fo(jr | cr, t);
            } finally {
              qg(t);
            }
          } else
            Fo(jr | cr, t);
          break;
        }
      }
    }
    function s1(e) {
      ge = e, c1();
    }
    function c1() {
      for (; ge !== null; ) {
        var e = ge, t = e.child;
        if ((ge.flags & ka) !== ke) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              ge = u, p1(u, e);
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
            ge = e;
          }
        }
        (e.subtreeFlags & Wi) !== ke && t !== null ? (t.return = e, ge = t) : f1();
      }
    }
    function f1() {
      for (; ge !== null; ) {
        var e = ge;
        (e.flags & Wr) !== ke && ($t(e), d1(e), sn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ge = t;
          return;
        }
        ge = e.return;
      }
    }
    function d1(e) {
      switch (e.tag) {
        case se:
        case Qe:
        case Fe: {
          e.mode & Lt ? (Xg(), ol(jr | cr, e, e.return), qg(e)) : ol(jr | cr, e, e.return);
          break;
        }
      }
    }
    function p1(e, t) {
      for (; ge !== null; ) {
        var a = ge;
        $t(a), h1(a, t), sn();
        var i = a.child;
        i !== null ? (i.return = a, ge = i) : v1(e);
      }
    }
    function v1(e) {
      for (; ge !== null; ) {
        var t = ge, a = t.sibling, i = t.return;
        if (j0(t), t === e) {
          ge = null;
          return;
        }
        if (a !== null) {
          a.return = i, ge = a;
          return;
        }
        ge = i;
      }
    }
    function h1(e, t) {
      switch (e.tag) {
        case se:
        case Qe:
        case Fe: {
          e.mode & Lt ? (Xg(), ol(jr, e, t), qg(e)) : ol(jr, e, t);
          break;
        }
      }
    }
    function m1(e) {
      switch (e.tag) {
        case se:
        case Qe:
        case Fe: {
          try {
            Fo(fr | cr, e);
          } catch (a) {
            cn(e, e.return, a);
          }
          break;
        }
        case de: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            cn(e, e.return, a);
          }
          break;
        }
      }
    }
    function y1(e) {
      switch (e.tag) {
        case se:
        case Qe:
        case Fe: {
          try {
            Fo(jr | cr, e);
          } catch (t) {
            cn(e, e.return, t);
          }
          break;
        }
      }
    }
    function g1(e) {
      switch (e.tag) {
        case se:
        case Qe:
        case Fe: {
          try {
            ol(fr | cr, e, e.return);
          } catch (a) {
            cn(e, e.return, a);
          }
          break;
        }
        case de: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && kS(e, e.return, t);
          break;
        }
      }
    }
    function S1(e) {
      switch (e.tag) {
        case se:
        case Qe:
        case Fe:
          try {
            ol(jr | cr, e, e.return);
          } catch (t) {
            cn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Up = Symbol.for;
      Up("selector.component"), Up("selector.has_pseudo_class"), Up("selector.role"), Up("selector.test_id"), Up("selector.text");
    }
    var E1 = [];
    function C1() {
      E1.forEach(function(e) {
        return e();
      });
    }
    var R1 = M.ReactCurrentActQueue;
    function T1(e) {
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
        return !e && R1.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var x1 = Math.ceil, MS = M.ReactCurrentDispatcher, NS = M.ReactCurrentOwner, Vr = M.ReactCurrentBatchConfig, fl = M.ReactCurrentActQueue, vr = (
      /*             */
      0
    ), W0 = (
      /*               */
      1
    ), Br = (
      /*                */
      2
    ), Ai = (
      /*                */
      4
    ), Vu = 0, Ap = 1, ec = 2, Mm = 3, jp = 4, G0 = 5, zS = 6, Rt = vr, Sa = null, Dn = null, hr = I, Xl = I, US = Do(I), mr = Vu, Fp = null, Nm = I, Hp = I, zm = I, Pp = null, Pa = null, AS = 0, q0 = 500, X0 = 1 / 0, b1 = 500, Bu = null;
    function Vp() {
      X0 = Qn() + b1;
    }
    function K0() {
      return X0;
    }
    var Um = !1, jS = null, Pf = null, tc = !1, Po = null, Bp = I, FS = [], HS = null, w1 = 50, Yp = 0, PS = null, VS = !1, Am = !1, _1 = 50, Vf = 0, jm = null, Ip = Kt, Fm = I, J0 = !1;
    function Hm() {
      return Sa;
    }
    function Ea() {
      return (Rt & (Br | Ai)) !== vr ? Qn() : (Ip !== Kt || (Ip = Qn()), Ip);
    }
    function Vo(e) {
      var t = e.mode;
      if ((t & lt) === De)
        return je;
      if ((Rt & Br) !== vr && hr !== I)
        return Rs(hr);
      var a = Rb() !== Cb;
      if (a) {
        if (Vr.transition !== null) {
          var i = Vr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Fm === kt && (Fm = Md()), Fm;
      }
      var u = Ua();
      if (u !== kt)
        return u;
      var s = lx();
      return s;
    }
    function k1(e) {
      var t = e.mode;
      return (t & lt) === De ? je : Yv();
    }
    function yr(e, t, a, i) {
      J1(), J0 && S("useInsertionEffect must not schedule updates."), VS && (Am = !0), go(e, a, i), (Rt & Br) !== I && e === Sa ? t_(t) : (Kr && bs(e, t, a), n_(t), e === Sa && ((Rt & Br) === vr && (Hp = Xe(Hp, a)), mr === jp && Bo(e, hr)), Va(e, i), a === je && Rt === vr && (t.mode & lt) === De && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !fl.isBatchingLegacy && (Vp(), JE()));
    }
    function D1(e, t, a) {
      var i = e.current;
      i.lanes = t, go(e, t, a), Va(e, a);
    }
    function O1(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Rt & Br) !== vr
      );
    }
    function Va(e, t) {
      var a = e.callbackNode;
      qc(e, t);
      var i = Gc(e, e === Sa ? hr : I);
      if (i === I) {
        a !== null && vR(a), e.callbackNode = null, e.callbackPriority = kt;
        return;
      }
      var u = zl(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(fl.current !== null && a !== GS)) {
        a == null && s !== je && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && vR(a);
      var f;
      if (u === je)
        e.tag === Oo ? (fl.isBatchingLegacy !== null && (fl.didScheduleLegacyUpdate = !0), ab(tR.bind(null, e))) : KE(tR.bind(null, e)), fl.current !== null ? fl.current.push(Lo) : ox(function() {
          (Rt & (Br | Ai)) === vr && Lo();
        }), f = null;
      else {
        var p;
        switch (Xv(i)) {
          case Lr:
            p = os;
            break;
          case wi:
            p = Ol;
            break;
          case Na:
            p = Gi;
            break;
          case za:
            p = hu;
            break;
          default:
            p = Gi;
            break;
        }
        f = qS(p, Z0.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function Z0(e, t) {
      if (Gb(), Ip = Kt, Fm = I, (Rt & (Br | Ai)) !== vr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Iu();
      if (i && e.callbackNode !== a)
        return null;
      var u = Gc(e, e === Sa ? hr : I);
      if (u === I)
        return null;
      var s = !Kc(e, u) && !Bv(e, u) && !t, f = s ? P1(e, u) : Vm(e, u);
      if (f !== Vu) {
        if (f === ec) {
          var p = Xc(e);
          p !== I && (u = p, f = BS(e, p));
        }
        if (f === Ap) {
          var v = Fp;
          throw nc(e, I), Bo(e, u), Va(e, Qn()), v;
        }
        if (f === zS)
          Bo(e, u);
        else {
          var y = !Kc(e, u), g = e.current.alternate;
          if (y && !M1(g)) {
            if (f = Vm(e, u), f === ec) {
              var w = Xc(e);
              w !== I && (u = w, f = BS(e, w));
            }
            if (f === Ap) {
              var x = Fp;
              throw nc(e, I), Bo(e, u), Va(e, Qn()), x;
            }
          }
          e.finishedWork = g, e.finishedLanes = u, L1(e, f, u);
        }
      }
      return Va(e, Qn()), e.callbackNode === a ? Z0.bind(null, e) : null;
    }
    function BS(e, t) {
      var a = Pp;
      if (ef(e)) {
        var i = nc(e, t);
        i.flags |= Cr, Kx(e.containerInfo);
      }
      var u = Vm(e, t);
      if (u !== ec) {
        var s = Pa;
        Pa = a, s !== null && eR(s);
      }
      return u;
    }
    function eR(e) {
      Pa === null ? Pa = e : Pa.push.apply(Pa, e);
    }
    function L1(e, t, a) {
      switch (t) {
        case Vu:
        case Ap:
          throw new Error("Root did not complete. This is a bug in React.");
        // Flow knows about invariant, so it complains if I add a break
        // statement, but eslint doesn't know about invariant, so it complains
        // if I do. eslint-disable-next-line no-fallthrough
        case ec: {
          rc(e, Pa, Bu);
          break;
        }
        case Mm: {
          if (Bo(e, a), wu(a) && // do not delay if we're inside an act() scope
          !hR()) {
            var i = AS + q0 - Qn();
            if (i > 10) {
              var u = Gc(e, I);
              if (u !== I)
                break;
              var s = e.suspendedLanes;
              if (!_u(s, a)) {
                Ea(), Jc(e, s);
                break;
              }
              e.timeoutHandle = Hy(rc.bind(null, e, Pa, Bu), i);
              break;
            }
          }
          rc(e, Pa, Bu);
          break;
        }
        case jp: {
          if (Bo(e, a), Od(a))
            break;
          if (!hR()) {
            var f = ri(e, a), p = f, v = Qn() - p, y = K1(v) - v;
            if (y > 10) {
              e.timeoutHandle = Hy(rc.bind(null, e, Pa, Bu), y);
              break;
            }
          }
          rc(e, Pa, Bu);
          break;
        }
        case G0: {
          rc(e, Pa, Bu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function M1(e) {
      for (var t = e; ; ) {
        if (t.flags & po) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!W(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & po && v !== null) {
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
    function Bo(e, t) {
      t = Ts(t, zm), t = Ts(t, Hp), Qv(e, t);
    }
    function tR(e) {
      if (qb(), (Rt & (Br | Ai)) !== vr)
        throw new Error("Should not already be working.");
      Iu();
      var t = Gc(e, I);
      if (!Zr(t, je))
        return Va(e, Qn()), null;
      var a = Vm(e, t);
      if (e.tag !== Oo && a === ec) {
        var i = Xc(e);
        i !== I && (t = i, a = BS(e, i));
      }
      if (a === Ap) {
        var u = Fp;
        throw nc(e, I), Bo(e, t), Va(e, Qn()), u;
      }
      if (a === zS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, rc(e, Pa, Bu), Va(e, Qn()), null;
    }
    function N1(e, t) {
      t !== I && (Zc(e, Xe(t, je)), Va(e, Qn()), (Rt & (Br | Ai)) === vr && (Vp(), Lo()));
    }
    function YS(e, t) {
      var a = Rt;
      Rt |= W0;
      try {
        return e(t);
      } finally {
        Rt = a, Rt === vr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !fl.isBatchingLegacy && (Vp(), JE());
      }
    }
    function z1(e, t, a, i, u) {
      var s = Ua(), f = Vr.transition;
      try {
        return Vr.transition = null, jn(Lr), e(t, a, i, u);
      } finally {
        jn(s), Vr.transition = f, Rt === vr && Vp();
      }
    }
    function Yu(e) {
      Po !== null && Po.tag === Oo && (Rt & (Br | Ai)) === vr && Iu();
      var t = Rt;
      Rt |= W0;
      var a = Vr.transition, i = Ua();
      try {
        return Vr.transition = null, jn(Lr), e ? e() : void 0;
      } finally {
        jn(i), Vr.transition = a, Rt = t, (Rt & (Br | Ai)) === vr && Lo();
      }
    }
    function nR() {
      return (Rt & (Br | Ai)) !== vr;
    }
    function Pm(e, t) {
      aa(US, Xl, e), Xl = Xe(Xl, t);
    }
    function IS(e) {
      Xl = US.current, ra(US, e);
    }
    function nc(e, t) {
      e.finishedWork = null, e.finishedLanes = I;
      var a = e.timeoutHandle;
      if (a !== Py && (e.timeoutHandle = Py, ux(a)), Dn !== null)
        for (var i = Dn.return; i !== null; ) {
          var u = i.alternate;
          L0(u, i), i = i.return;
        }
      Sa = e;
      var s = ac(e.current, null);
      return Dn = s, hr = Xl = t, mr = Vu, Fp = null, Nm = I, Hp = I, zm = I, Pp = null, Pa = null, Db(), rl.discardPendingWarnings(), s;
    }
    function rR(e, t) {
      do {
        var a = Dn;
        try {
          if (Xh(), _C(), sn(), NS.current = null, a === null || a.return === null) {
            mr = Ap, Fp = t, Dn = null;
            return;
          }
          if (Ae && a.mode & Lt && bm(a, !0), He)
            if (ha(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              bi(a, i, hr);
            } else
              cs(a, t, hr);
          aw(e, a.return, a, t, hr), uR(a);
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
    function U1() {
      AS = Qn();
    }
    function $p(e) {
      Nm = Xe(e, Nm);
    }
    function A1() {
      mr === Vu && (mr = Mm);
    }
    function $S() {
      (mr === Vu || mr === Mm || mr === ec) && (mr = jp), Sa !== null && (Cs(Nm) || Cs(Hp)) && Bo(Sa, hr);
    }
    function j1(e) {
      mr !== jp && (mr = ec), Pp === null ? Pp = [e] : Pp.push(e);
    }
    function F1() {
      return mr === Vu;
    }
    function Vm(e, t) {
      var a = Rt;
      Rt |= Br;
      var i = aR();
      if (Sa !== e || hr !== t) {
        if (Kr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Qp(e, hr), u.clear()), Wv(e, t);
        }
        Bu = Ad(), nc(e, t);
      }
      Su(t);
      do
        try {
          H1();
          break;
        } catch (s) {
          rR(e, s);
        }
      while (!0);
      if (Xh(), Rt = a, iR(i), Dn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Oc(), Sa = null, hr = I, mr;
    }
    function H1() {
      for (; Dn !== null; )
        lR(Dn);
    }
    function P1(e, t) {
      var a = Rt;
      Rt |= Br;
      var i = aR();
      if (Sa !== e || hr !== t) {
        if (Kr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Qp(e, hr), u.clear()), Wv(e, t);
        }
        Bu = Ad(), Vp(), nc(e, t);
      }
      Su(t);
      do
        try {
          V1();
          break;
        } catch (s) {
          rR(e, s);
        }
      while (!0);
      return Xh(), iR(i), Rt = a, Dn !== null ? (Fv(), Vu) : (Oc(), Sa = null, hr = I, mr);
    }
    function V1() {
      for (; Dn !== null && !hd(); )
        lR(Dn);
    }
    function lR(e) {
      var t = e.alternate;
      $t(e);
      var a;
      (e.mode & Lt) !== De ? (Gg(e), a = QS(t, e, Xl), bm(e, !0)) : a = QS(t, e, Xl), sn(), e.memoizedProps = e.pendingProps, a === null ? uR(e) : Dn = a, NS.current = null;
    }
    function uR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & us) === ke) {
          $t(t);
          var u = void 0;
          if ((t.mode & Lt) === De ? u = O0(a, t, Xl) : (Gg(t), u = O0(a, t, Xl), bm(t, !1)), sn(), u !== null) {
            Dn = u;
            return;
          }
        } else {
          var s = Aw(a, t);
          if (s !== null) {
            s.flags &= Mv, Dn = s;
            return;
          }
          if ((t.mode & Lt) !== De) {
            bm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= us, i.subtreeFlags = ke, i.deletions = null;
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
      mr === Vu && (mr = G0);
    }
    function rc(e, t, a) {
      var i = Ua(), u = Vr.transition;
      try {
        Vr.transition = null, jn(Lr), B1(e, t, a, i);
      } finally {
        Vr.transition = u, jn(i);
      }
      return null;
    }
    function B1(e, t, a, i) {
      do
        Iu();
      while (Po !== null);
      if (Z1(), (Rt & (Br | Ai)) !== vr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Cd(s), u === null)
        return Rd(), null;
      if (s === I && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = I, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = kt;
      var f = Xe(u.lanes, u.childLanes);
      zd(e, f), e === Sa && (Sa = null, Dn = null, hr = I), ((u.subtreeFlags & Wi) !== ke || (u.flags & Wi) !== ke) && (tc || (tc = !0, HS = a, qS(Gi, function() {
        return Iu(), null;
      })));
      var p = (u.subtreeFlags & (_l | kl | Dl | Wi)) !== ke, v = (u.flags & (_l | kl | Dl | Wi)) !== ke;
      if (p || v) {
        var y = Vr.transition;
        Vr.transition = null;
        var g = Ua();
        jn(Lr);
        var w = Rt;
        Rt |= Ai, NS.current = null, Vw(e, u), JC(), t1(e, u, s), ex(e.containerInfo), e.current = u, fs(s), n1(u, e, s), ds(), md(), Rt = w, jn(g), Vr.transition = y;
      } else
        e.current = u, JC();
      var x = tc;
      if (tc ? (tc = !1, Po = e, Bp = s) : (Vf = 0, jm = null), f = e.pendingLanes, f === I && (Pf = null), x || fR(e.current, !1), gd(u.stateNode, i), Kr && e.memoizedUpdaters.clear(), C1(), Va(e, Qn()), t !== null)
        for (var N = e.onRecoverableError, A = 0; A < t.length; A++) {
          var F = t[A], le = F.stack, Me = F.digest;
          N(F.value, {
            componentStack: le,
            digest: Me
          });
        }
      if (Um) {
        Um = !1;
        var be = jS;
        throw jS = null, be;
      }
      return Zr(Bp, je) && e.tag !== Oo && Iu(), f = e.pendingLanes, Zr(f, je) ? (Wb(), e === PS ? Yp++ : (Yp = 0, PS = e)) : Yp = 0, Lo(), Rd(), null;
    }
    function Iu() {
      if (Po !== null) {
        var e = Xv(Bp), t = _s(Na, e), a = Vr.transition, i = Ua();
        try {
          return Vr.transition = null, jn(t), I1();
        } finally {
          jn(i), Vr.transition = a;
        }
      }
      return !1;
    }
    function Y1(e) {
      FS.push(e), tc || (tc = !0, qS(Gi, function() {
        return Iu(), null;
      }));
    }
    function I1() {
      if (Po === null)
        return !1;
      var e = HS;
      HS = null;
      var t = Po, a = Bp;
      if (Po = null, Bp = I, (Rt & (Br | Ai)) !== vr)
        throw new Error("Cannot flush passive effects while already rendering.");
      VS = !0, Am = !1, gu(a);
      var i = Rt;
      Rt |= Ai, s1(t.current), i1(t, t.current, a, e);
      {
        var u = FS;
        FS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          $w(t, f);
        }
      }
      bd(), fR(t.current, !0), Rt = i, Lo(), Am ? t === jm ? Vf++ : (Vf = 0, jm = t) : Vf = 0, VS = !1, Am = !1, Sd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function oR(e) {
      return Pf !== null && Pf.has(e);
    }
    function $1(e) {
      Pf === null ? Pf = /* @__PURE__ */ new Set([e]) : Pf.add(e);
    }
    function Q1(e) {
      Um || (Um = !0, jS = e);
    }
    var W1 = Q1;
    function sR(e, t, a) {
      var i = Js(a, t), u = l0(e, i, je), s = No(e, u, je), f = Ea();
      s !== null && (go(s, je, f), Va(s, f));
    }
    function cn(e, t, a) {
      if (Fw(a), Wp(!1), e.tag === Z) {
        sR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === Z) {
          sR(i, e, a);
          return;
        } else if (i.tag === de) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !oR(s)) {
            var f = Js(a, e), p = dS(i, f, je), v = No(i, p, je), y = Ea();
            v !== null && (go(v, je, y), Va(v, y));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function G1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ea();
      Jc(e, a), r_(e), Sa === e && _u(hr, a) && (mr === jp || mr === Mm && wu(hr) && Qn() - AS < q0 ? nc(e, I) : zm = Xe(zm, a)), Va(e, u);
    }
    function cR(e, t) {
      t === kt && (t = k1(e));
      var a = Ea(), i = Fa(e, t);
      i !== null && (go(i, t, a), Va(i, a));
    }
    function q1(e) {
      var t = e.memoizedState, a = kt;
      t !== null && (a = t.retryLane), cR(e, a);
    }
    function X1(e, t) {
      var a = kt, i;
      switch (e.tag) {
        case _e:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case ln:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), cR(e, a);
    }
    function K1(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : x1(e / 1960) * 1960;
    }
    function J1() {
      if (Yp > w1)
        throw Yp = 0, PS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Vf > _1 && (Vf = 0, jm = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function Z1() {
      rl.flushLegacyContextWarning(), rl.flushPendingUnsafeLifecycleWarnings();
    }
    function fR(e, t) {
      $t(e), Bm(e, wl, g1), t && Bm(e, Ri, S1), Bm(e, wl, m1), t && Bm(e, Ri, y1), sn();
    }
    function Bm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== ke ? i = i.child : ((i.flags & t) !== ke && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Ym = null;
    function dR(e) {
      {
        if ((Rt & Br) !== vr || !(e.mode & lt))
          return;
        var t = e.tag;
        if (t !== Ee && t !== Z && t !== de && t !== se && t !== Qe && t !== ut && t !== Fe)
          return;
        var a = Be(e) || "ReactComponent";
        if (Ym !== null) {
          if (Ym.has(a))
            return;
          Ym.add(a);
        } else
          Ym = /* @__PURE__ */ new Set([a]);
        var i = ir;
        try {
          $t(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? $t(e) : sn();
        }
      }
    }
    var QS;
    {
      var e_ = null;
      QS = function(e, t, a) {
        var i = ER(e_, t);
        try {
          return b0(e, t, a);
        } catch (s) {
          if (db() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Xh(), _C(), L0(e, t), ER(t, i), t.mode & Lt && Gg(t), bl(null, b0, null, e, t, a), $i()) {
            var u = ls();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var pR = !1, WS;
    WS = /* @__PURE__ */ new Set();
    function t_(e) {
      if (hi && !Ib())
        switch (e.tag) {
          case se:
          case Qe:
          case Fe: {
            var t = Dn && Be(Dn) || "Unknown", a = t;
            if (!WS.has(a)) {
              WS.add(a);
              var i = Be(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case de: {
            pR || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), pR = !0);
            break;
          }
        }
    }
    function Qp(e, t) {
      if (Kr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          bs(e, i, t);
        });
      }
    }
    var GS = {};
    function qS(e, t) {
      {
        var a = fl.current;
        return a !== null ? (a.push(t), GS) : vd(e, t);
      }
    }
    function vR(e) {
      if (e !== GS)
        return zv(e);
    }
    function hR() {
      return fl.current !== null;
    }
    function n_(e) {
      {
        if (e.mode & lt) {
          if (!Q0())
            return;
        } else if (!T1() || Rt !== vr || e.tag !== se && e.tag !== Qe && e.tag !== Fe)
          return;
        if (fl.current === null) {
          var t = ir;
          try {
            $t(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Be(e));
          } finally {
            t ? $t(e) : sn();
          }
        }
      }
    }
    function r_(e) {
      e.tag !== Oo && Q0() && fl.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Wp(e) {
      J0 = e;
    }
    var ji = null, Bf = null, a_ = function(e) {
      ji = e;
    };
    function Yf(e) {
      {
        if (ji === null)
          return e;
        var t = ji(e);
        return t === void 0 ? e : t.current;
      }
    }
    function XS(e) {
      return Yf(e);
    }
    function KS(e) {
      {
        if (ji === null)
          return e;
        var t = ji(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Yf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: Y,
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
        if (ji === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case de: {
            typeof i == "function" && (u = !0);
            break;
          }
          case se: {
            (typeof i == "function" || s === Ye) && (u = !0);
            break;
          }
          case Qe: {
            (s === Y || s === Ye) && (u = !0);
            break;
          }
          case ut:
          case Fe: {
            (s === Ge || s === Ye) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = ji(a);
          if (f !== void 0 && f === ji(i))
            return !0;
        }
        return !1;
      }
    }
    function yR(e) {
      {
        if (ji === null || typeof WeakSet != "function")
          return;
        Bf === null && (Bf = /* @__PURE__ */ new WeakSet()), Bf.add(e);
      }
    }
    var i_ = function(e, t) {
      {
        if (ji === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Iu(), Yu(function() {
          JS(e.current, i, a);
        });
      }
    }, l_ = function(e, t) {
      {
        if (e.context !== li)
          return;
        Iu(), Yu(function() {
          Gp(t, e, null, null);
        });
      }
    };
    function JS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case se:
          case Fe:
          case de:
            v = p;
            break;
          case Qe:
            v = p.render;
            break;
        }
        if (ji === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, g = !1;
        if (v !== null) {
          var w = ji(v);
          w !== void 0 && (a.has(w) ? g = !0 : t.has(w) && (f === de ? g = !0 : y = !0));
        }
        if (Bf !== null && (Bf.has(e) || i !== null && Bf.has(i)) && (g = !0), g && (e._debugNeedsRemount = !0), g || y) {
          var x = Fa(e, je);
          x !== null && yr(x, e, je, Kt);
        }
        u !== null && !g && JS(u, t, a), s !== null && JS(s, t, a);
      }
    }
    var u_ = function(e, t) {
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
          case se:
          case Fe:
          case de:
            p = f;
            break;
          case Qe:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? o_(e, a) : i !== null && ZS(i, t, a), u !== null && ZS(u, t, a);
      }
    }
    function o_(e, t) {
      {
        var a = s_(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ue:
              t.add(i.stateNode);
              return;
            case Re:
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
    function s_(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ue)
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
    function c_(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = ke, this.subtreeFlags = ke, this.deletions = null, this.lanes = I, this.childLanes = I, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !eE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var ui = function(e, t, a, i) {
      return new c_(e, t, a, i);
    };
    function tE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function f_(e) {
      return typeof e == "function" && !tE(e) && e.defaultProps === void 0;
    }
    function d_(e) {
      if (typeof e == "function")
        return tE(e) ? de : se;
      if (e != null) {
        var t = e.$$typeof;
        if (t === Y)
          return Qe;
        if (t === Ge)
          return ut;
      }
      return Ee;
    }
    function ac(e, t) {
      var a = e.alternate;
      a === null ? (a = ui(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = ke, a.subtreeFlags = ke, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & zn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Ee:
        case se:
        case Fe:
          a.type = Yf(e.type);
          break;
        case de:
          a.type = XS(e.type);
          break;
        case Qe:
          a.type = KS(e.type);
          break;
      }
      return a;
    }
    function p_(e, t) {
      e.flags &= zn | mn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = I, e.lanes = t, e.child = null, e.subtreeFlags = ke, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = ke, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function v_(e, t, a) {
      var i;
      return e === Ph ? (i = lt, t === !0 && (i |= Gt, i |= Mt)) : i = De, Kr && (i |= Lt), ui(Z, null, null, i);
    }
    function nE(e, t, a, i, u, s) {
      var f = Ee, p = e;
      if (typeof e == "function")
        tE(e) ? (f = de, p = XS(p)) : p = Yf(p);
      else if (typeof e == "string")
        f = ue;
      else
        e: switch (e) {
          case fi:
            return Yo(a.children, u, s, t);
          case Qa:
            f = pt, u |= Gt, (u & lt) !== De && (u |= Mt);
            break;
          case di:
            return h_(a, u, s, t);
          case ae:
            return m_(a, u, s, t);
          case he:
            return y_(a, u, s, t);
          case Tn:
            return SR(a, u, s, t);
          case tn:
          // eslint-disable-next-line no-fallthrough
          case ot:
          // eslint-disable-next-line no-fallthrough
          case on:
          // eslint-disable-next-line no-fallthrough
          case ar:
          // eslint-disable-next-line no-fallthrough
          case it:
          // eslint-disable-next-line no-fallthrough
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case pi:
                  f = ct;
                  break e;
                case R:
                  f = fn;
                  break e;
                case Y:
                  f = Qe, p = KS(p);
                  break e;
                case Ge:
                  f = ut;
                  break e;
                case Ye:
                  f = an, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? Be(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var g = ui(f, a, t, u);
      return g.elementType = e, g.type = p, g.lanes = s, g._debugOwner = i, g;
    }
    function rE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = nE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Yo(e, t, a, i) {
      var u = ui(St, e, i, t);
      return u.lanes = a, u;
    }
    function h_(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = ui(vt, e, i, t | Lt);
      return u.elementType = di, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function m_(e, t, a, i) {
      var u = ui(_e, e, i, t);
      return u.elementType = ae, u.lanes = a, u;
    }
    function y_(e, t, a, i) {
      var u = ui(ln, e, i, t);
      return u.elementType = he, u.lanes = a, u;
    }
    function SR(e, t, a, i) {
      var u = ui(Oe, e, i, t);
      u.elementType = Tn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function aE(e, t, a) {
      var i = ui($e, e, null, t);
      return i.lanes = a, i;
    }
    function g_() {
      var e = ui(ue, null, null, De);
      return e.elementType = "DELETED", e;
    }
    function S_(e) {
      var t = ui(Jt, null, null, De);
      return t.stateNode = e, t;
    }
    function iE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = ui(Re, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function ER(e, t) {
      return e === null && (e = ui(Ee, null, null, De)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function E_(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Py, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = kt, this.eventTimes = xs(I), this.expirationTimes = xs(Kt), this.pendingLanes = I, this.suspendedLanes = I, this.pingedLanes = I, this.expiredLanes = I, this.mutableReadLanes = I, this.finishedLanes = I, this.entangledLanes = I, this.entanglements = xs(I), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Eu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Ph:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Oo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function CR(e, t, a, i, u, s, f, p, v, y) {
      var g = new E_(e, t, a, p, v), w = v_(t, s);
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
    function C_(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Ir(i), {
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
        return li;
      var t = fo(e), a = rb(t);
      if (t.tag === de) {
        var i = t.type;
        if (Yl(i))
          return qE(t, i, a);
      }
      return a;
    }
    function R_(e, t) {
      {
        var a = fo(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = qr(a);
        if (u === null)
          return null;
        if (u.mode & Gt) {
          var s = Be(a) || "Component";
          if (!oE[s]) {
            oE[s] = !0;
            var f = ir;
            try {
              $t(u), a.mode & Gt ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? $t(f) : sn();
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
      var x = w.current, N = Ea(), A = Vo(x), F = Hu(N, A);
      return F.callback = t ?? null, No(x, F, A), D1(w, A, N), w;
    }
    function Gp(e, t, a, i) {
      yd(t, e);
      var u = t.current, s = Ea(), f = Vo(u);
      gn(f);
      var p = RR(a);
      t.context === null ? t.context = p : t.pendingContext = p, hi && ir !== null && !uE && (uE = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Be(ir) || "Unknown"));
      var v = Hu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = No(u, v, f);
      return y !== null && (yr(y, u, f, s), tm(y, u, f)), f;
    }
    function Im(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ue:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function T_(e) {
      switch (e.tag) {
        case Z: {
          var t = e.stateNode;
          if (ef(t)) {
            var a = Pv(t);
            N1(t, a);
          }
          break;
        }
        case _e: {
          Yu(function() {
            var u = Fa(e, je);
            if (u !== null) {
              var s = Ea();
              yr(u, e, je, s);
            }
          });
          var i = je;
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
    function x_(e) {
      if (e.tag === _e) {
        var t = gs, a = Fa(e, t);
        if (a !== null) {
          var i = Ea();
          yr(a, e, t, i);
        }
        sE(e, t);
      }
    }
    function b_(e) {
      if (e.tag === _e) {
        var t = Vo(e), a = Fa(e, t);
        if (a !== null) {
          var i = Ea();
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
    function w_(e) {
      return _R(e);
    }
    var kR = function(e) {
      return !1;
    };
    function __(e) {
      return kR(e);
    }
    var DR = null, OR = null, LR = null, MR = null, NR = null, zR = null, UR = null, AR = null, jR = null;
    {
      var FR = function(e, t, a) {
        var i = t[a], u = nt(e) ? e.slice() : Je({}, e);
        return a + 1 === t.length ? (nt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = FR(e[i], t, a + 1), u);
      }, HR = function(e, t) {
        return FR(e, t, 0);
      }, PR = function(e, t, a, i) {
        var u = t[i], s = nt(e) ? e.slice() : Je({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], nt(s) ? s.splice(u, 1) : delete s[u];
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
          dt("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              dt("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return PR(e, t, a, 0);
      }, BR = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = nt(e) ? e.slice() : Je({}, e);
        return s[u] = BR(e[u], t, a + 1, i), s;
      }, YR = function(e, t, a) {
        return BR(e, t, 0, a);
      }, cE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      DR = function(e, t, a, i) {
        var u = cE(e, t);
        if (u !== null) {
          var s = YR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Je({}, e.memoizedProps);
          var f = Fa(e, je);
          f !== null && yr(f, e, je, Kt);
        }
      }, OR = function(e, t, a) {
        var i = cE(e, t);
        if (i !== null) {
          var u = HR(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = Je({}, e.memoizedProps);
          var s = Fa(e, je);
          s !== null && yr(s, e, je, Kt);
        }
      }, LR = function(e, t, a, i) {
        var u = cE(e, t);
        if (u !== null) {
          var s = VR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Je({}, e.memoizedProps);
          var f = Fa(e, je);
          f !== null && yr(f, e, je, Kt);
        }
      }, MR = function(e, t, a) {
        e.pendingProps = YR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Fa(e, je);
        i !== null && yr(i, e, je, Kt);
      }, NR = function(e, t) {
        e.pendingProps = HR(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Fa(e, je);
        a !== null && yr(a, e, je, Kt);
      }, zR = function(e, t, a) {
        e.pendingProps = VR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Fa(e, je);
        i !== null && yr(i, e, je, Kt);
      }, UR = function(e) {
        var t = Fa(e, je);
        t !== null && yr(t, e, je, Kt);
      }, AR = function(e) {
        _R = e;
      }, jR = function(e) {
        kR = e;
      };
    }
    function k_(e) {
      var t = qr(e);
      return t === null ? null : t.stateNode;
    }
    function D_(e) {
      return null;
    }
    function O_() {
      return ir;
    }
    function L_(e) {
      var t = e.findFiberByHostInstance, a = M.ReactCurrentDispatcher;
      return ho({
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
        findHostInstanceByFiber: k_,
        findFiberByHostInstance: t || D_,
        // React Refresh
        findHostInstancesForRefresh: u_,
        scheduleRefresh: i_,
        scheduleRoot: l_,
        setRefreshHandler: a_,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: O_,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: lE
      });
    }
    var IR = typeof reportError == "function" ? (
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
      Gp(e, t, null, null);
    }, $m.prototype.unmount = fE.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        nR() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          Gp(null, e, null, null);
        }), IE(t);
      }
    };
    function M_(e, t) {
      if (!Qm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      $R(e);
      var a = !1, i = !1, u = "", s = IR;
      t != null && (t.hydrate ? dt("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === _r && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = TR(e, Ph, null, a, i, u, s);
      Nh(f.current, e);
      var p = e.nodeType === Mn ? e.parentNode : e;
      return ep(p), new fE(f);
    }
    function $m(e) {
      this._internalRoot = e;
    }
    function N_(e) {
      e && th(e);
    }
    $m.prototype.unstable_scheduleHydration = N_;
    function z_(e, t, a) {
      if (!Qm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      $R(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = IR;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = xR(t, null, e, Ph, i, s, f, p, v);
      if (Nh(y.current, e), ep(e), u)
        for (var g = 0; g < u.length; g++) {
          var w = u[g];
          Fb(y, w);
        }
      return new $m(y);
    }
    function Qm(e) {
      return !!(e && (e.nodeType === Qr || e.nodeType === Ii || e.nodeType === nd));
    }
    function qp(e) {
      return !!(e && (e.nodeType === Qr || e.nodeType === Ii || e.nodeType === nd || e.nodeType === Mn && e.nodeValue === " react-mount-point-unstable "));
    }
    function $R(e) {
      e.nodeType === Qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), fp(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var U_ = M.ReactCurrentOwner, QR;
    QR = function(e) {
      if (e._reactRootContainer && e.nodeType !== Mn) {
        var t = wR(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = dE(e), u = !!(i && ko(i));
      u && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function dE(e) {
      return e ? e.nodeType === Ii ? e.documentElement : e.firstChild : null;
    }
    function WR() {
    }
    function A_(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var x = Im(f);
            s.call(x);
          };
        }
        var f = xR(
          t,
          i,
          e,
          Oo,
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
        return ep(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var x = Im(g);
            y.call(x);
          };
        }
        var g = TR(
          e,
          Oo,
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
        return ep(w), Yu(function() {
          Gp(t, g, a, i);
        }), g;
      }
    }
    function j_(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Wm(e, t, a, i, u) {
      QR(a), j_(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = A_(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Im(f);
            p.call(v);
          };
        }
        Gp(t, f, e, u);
      }
      return Im(f);
    }
    var GR = !1;
    function F_(e) {
      {
        GR || (GR = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = U_.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", xt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Qr ? e : R_(e, "findDOMNode");
    }
    function H_(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !qp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = fp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Wm(null, e, t, !0, a);
    }
    function P_(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !qp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = fp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Wm(null, e, t, !1, a);
    }
    function V_(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !qp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !sy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Wm(e, t, a, !1, i);
    }
    var qR = !1;
    function B_(e) {
      if (qR || (qR = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !qp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = fp(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = dE(e), i = a && !ko(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          Wm(null, null, e, !1, function() {
            e._reactRootContainer = null, IE(e);
          });
        }), !0;
      } else {
        {
          var u = dE(e), s = !!(u && ko(u)), f = e.nodeType === Qr && qp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Tr(T_), So(x_), Kv(b_), Ds(Ua), jd(Gv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), yc(IT), oy(YS, z1, Yu);
    function Y_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Qm(t))
        throw new Error("Target container is not a DOM element.");
      return C_(e, t, null, a);
    }
    function I_(e, t, a, i) {
      return V_(e, t, a, i);
    }
    var pE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [ko, Ef, zh, uo, gc, YS]
    };
    function $_(e, t) {
      return pE.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), M_(e, t);
    }
    function Q_(e, t, a) {
      return pE.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), z_(e, t, a);
    }
    function W_(e) {
      return nR() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var G_ = L_({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: lE,
      rendererPackageName: "react-dom"
    });
    if (!G_ && On && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var XR = window.location.protocol;
      /^(https?|file):$/.test(XR) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (XR === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = pE, Ya.createPortal = Y_, Ya.createRoot = $_, Ya.findDOMNode = F_, Ya.flushSync = W_, Ya.hydrate = H_, Ya.hydrateRoot = Q_, Ya.render = P_, Ya.unmountComponentAtNode = B_, Ya.unstable_batchedUpdates = YS, Ya.unstable_renderSubtreeIntoContainer = I_, Ya.version = lE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  })()), Ya;
}
var oT;
function lk() {
  if (oT) return Xm.exports;
  oT = 1;
  function B() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(B);
      } catch (G) {
        console.error(G);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (B(), Xm.exports = ak()) : Xm.exports = ik(), Xm.exports;
}
var sT;
function uk() {
  if (sT) return $f;
  sT = 1;
  var B = lk();
  if (process.env.NODE_ENV === "production")
    $f.createRoot = B.createRoot, $f.hydrateRoot = B.hydrateRoot;
  else {
    var G = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    $f.createRoot = function(M, gt) {
      G.usingClientEntryPoint = !0;
      try {
        return B.createRoot(M, gt);
      } finally {
        G.usingClientEntryPoint = !1;
      }
    }, $f.hydrateRoot = function(M, gt, ft) {
      G.usingClientEntryPoint = !0;
      try {
        return B.hydrateRoot(M, gt, ft);
      } finally {
        G.usingClientEntryPoint = !1;
      }
    };
  }
  return $f;
}
var ok = uk(), Zp = tv();
let mE = null;
function sk(B) {
  mE = B;
}
function nv(B, G = {}) {
  if (!mE) throw new Error("Local LLM host is not configured");
  return mE.moduleCall(`clx.local-llm.${B}`, G);
}
const ck = () => nv("status"), fk = () => nv("getConfig"), dk = (B) => nv("saveConfig", B), pk = () => nv("loadModel"), vk = () => nv("unloadModel");
function hk() {
  const [B, G] = Zp.useState(null), [M, gt] = Zp.useState(null), [ft, dt] = Zp.useState(!1), [S, mt] = Zp.useState(null);
  Zp.useEffect(() => {
    (async () => {
      try {
        const [Ee, Z] = await Promise.all([fk(), ck()]);
        G(Ee), gt(Z);
      } catch {
      }
    })();
  }, []);
  const se = async (Ee) => {
    if (Ee.preventDefault(), !!B)
      try {
        dt(!0), await dk(B), mt("Settings saved"), setTimeout(() => mt(null), 3e3);
      } catch (Z) {
        mt(`Error: ${Z}`);
      } finally {
        dt(!1);
      }
  }, de = async () => {
    try {
      if (dt(!0), M != null && M.loaded) {
        const Ee = await vk();
        gt(Ee), mt("Model unloaded");
      } else {
        const Ee = await pk();
        gt(Ee), mt("Model loaded successfully");
      }
      setTimeout(() => mt(null), 3e3);
    } catch (Ee) {
      mt(`Error: ${Ee}`);
    } finally {
      dt(!1);
    }
  };
  return B ? /* @__PURE__ */ Vt.jsxs("div", { className: "space-y-4 text-xs", children: [
    /* @__PURE__ */ Vt.jsxs("div", { className: "flex items-center justify-between border-b border-cyber-line/20 pb-2", children: [
      /* @__PURE__ */ Vt.jsx("h3", { className: "font-display text-sm uppercase tracking-wider text-slate-200 font-bold", children: "Local LLM (Candle Runtime)" }),
      /* @__PURE__ */ Vt.jsx("span", { className: `rounded px-2 py-0.5 text-[10px] font-semibold ${M != null && M.loaded ? "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/40" : "bg-slate-700/50 text-slate-400"}`, children: M != null && M.loaded ? "Model Loaded" : "Not Loaded" })
    ] }),
    S && /* @__PURE__ */ Vt.jsx("div", { className: "rounded border border-cyber-neon/40 bg-cyber-neon/10 p-2 text-cyber-neon text-[11px] font-mono", children: S }),
    /* @__PURE__ */ Vt.jsxs("form", { onSubmit: se, className: "space-y-3", children: [
      /* @__PURE__ */ Vt.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ Vt.jsx(
          "input",
          {
            type: "checkbox",
            id: "llm-enabled",
            checked: B.enabled,
            onChange: (Ee) => G({ ...B, enabled: Ee.target.checked }),
            className: "rounded border-cyber-line"
          }
        ),
        /* @__PURE__ */ Vt.jsx("label", { htmlFor: "llm-enabled", className: "text-slate-300 font-semibold", children: "Enable Local LLM Engine" })
      ] }),
      /* @__PURE__ */ Vt.jsxs("div", { children: [
        /* @__PURE__ */ Vt.jsx("label", { className: "block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1", children: "Model Path (.gguf)" }),
        /* @__PURE__ */ Vt.jsx(
          "input",
          {
            type: "text",
            placeholder: "C:/models/llama-3-8b.Q4_K_M.gguf",
            value: B.modelPath || "",
            onChange: (Ee) => G({ ...B, modelPath: Ee.target.value || null }),
            className: "w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 placeholder-slate-600 outline-none focus:border-cyber-neon text-xs"
          }
        )
      ] }),
      /* @__PURE__ */ Vt.jsxs("div", { children: [
        /* @__PURE__ */ Vt.jsx("label", { className: "block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1", children: "Tokenizer Path (optional if next to model)" }),
        /* @__PURE__ */ Vt.jsx(
          "input",
          {
            type: "text",
            placeholder: "C:/models/tokenizer.json",
            value: B.tokenizerPath || "",
            onChange: (Ee) => G({ ...B, tokenizerPath: Ee.target.value || null }),
            className: "w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 placeholder-slate-600 outline-none focus:border-cyber-neon text-xs"
          }
        )
      ] }),
      /* @__PURE__ */ Vt.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ Vt.jsxs("div", { children: [
          /* @__PURE__ */ Vt.jsx("label", { className: "block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1", children: "Max Tokens" }),
          /* @__PURE__ */ Vt.jsx(
            "input",
            {
              type: "number",
              value: B.maxTokens,
              onChange: (Ee) => G({ ...B, maxTokens: parseInt(Ee.target.value) || 256 }),
              className: "w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon text-xs"
            }
          )
        ] }),
        /* @__PURE__ */ Vt.jsxs("div", { children: [
          /* @__PURE__ */ Vt.jsx("label", { className: "block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1", children: "Temperature" }),
          /* @__PURE__ */ Vt.jsx(
            "input",
            {
              type: "number",
              step: "0.1",
              value: B.temperature,
              onChange: (Ee) => G({ ...B, temperature: parseFloat(Ee.target.value) || 0.7 }),
              className: "w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon text-xs"
            }
          )
        ] }),
        /* @__PURE__ */ Vt.jsxs("div", { children: [
          /* @__PURE__ */ Vt.jsx("label", { className: "block text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1", children: "Runtime" }),
          /* @__PURE__ */ Vt.jsxs(
            "select",
            {
              value: B.runtime,
              onChange: (Ee) => G({ ...B, runtime: Ee.target.value }),
              className: "w-full rounded border border-cyber-line bg-cyber-base px-3 py-1.5 text-slate-100 outline-none focus:border-cyber-neon text-xs",
              children: [
                /* @__PURE__ */ Vt.jsx("option", { value: "candle", children: "Candle (CPU/Embedded)" }),
                /* @__PURE__ */ Vt.jsx("option", { value: "llamacpp", children: "llama.cpp Server" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ Vt.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ Vt.jsx(
          "button",
          {
            type: "submit",
            disabled: ft,
            className: "rounded bg-cyber-neon/20 border border-cyber-neon px-3 py-1.5 text-xs font-semibold text-cyber-neon hover:bg-cyber-neon/30 transition disabled:opacity-50",
            children: "Save Settings"
          }
        ),
        B.modelPath && /* @__PURE__ */ Vt.jsx(
          "button",
          {
            type: "button",
            disabled: ft,
            onClick: de,
            className: `rounded border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${M != null && M.loaded ? "border-cyber-warn/40 text-cyber-warn hover:bg-cyber-warn/10" : "border-cyber-electric/40 text-cyber-electric hover:bg-cyber-electric/10"}`,
            children: M != null && M.loaded ? "Unload Model" : "Load Model"
          }
        )
      ] })
    ] })
  ] }) : /* @__PURE__ */ Vt.jsx("div", { className: "p-4 text-xs text-slate-500", children: "Loading Local LLM settings..." });
}
function mk(B) {
  if (B.apiVersion !== 1 || B.moduleId !== "clx.local-llm")
    throw new Error("Local LLM requires CLX UI host API v1");
  sk(B);
}
function Ek(B) {
  mk(B), B.registerContribution({
    id: "local-llm.settings",
    kind: "settingsSection",
    mount(G) {
      const M = ok.createRoot(G);
      return M.render(/* @__PURE__ */ Vt.jsx(hk, {})), () => M.unmount();
    }
  });
}
export {
  Ek as registerSettings
};
