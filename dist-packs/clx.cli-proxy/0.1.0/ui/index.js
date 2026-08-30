var qm = { exports: {} }, ev = {}, Km = { exports: {} }, Dt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var eb;
function c_() {
  if (eb) return Dt;
  eb = 1;
  var P = Symbol.for("react.element"), H = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), ye = Symbol.for("react.strict_mode"), Je = Symbol.for("react.profiler"), Ye = Symbol.for("react.provider"), S = Symbol.for("react.context"), Nt = Symbol.for("react.forward_ref"), re = Symbol.for("react.suspense"), de = Symbol.for("react.memo"), rt = Symbol.for("react.lazy"), ae = Symbol.iterator;
  function be(_) {
    return _ === null || typeof _ != "object" ? null : (_ = ae && _[ae] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var ne = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Qe = Object.assign, at = {};
  function ct(_, W, Oe) {
    this.props = _, this.context = W, this.refs = at, this.updater = Oe || ne;
  }
  ct.prototype.isReactComponent = {}, ct.prototype.setState = function(_, W) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, _, W, "setState");
  }, ct.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function Ut() {
  }
  Ut.prototype = ct.prototype;
  function lt(_, W, Oe) {
    this.props = _, this.context = W, this.refs = at, this.updater = Oe || ne;
  }
  var V = lt.prototype = new Ut();
  V.constructor = lt, Qe(V, ct.prototype), V.isPureReactComponent = !0;
  var _e = Array.isArray, ie = Object.prototype.hasOwnProperty, Me = { current: null }, se = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Tt(_, W, Oe) {
    var He, dt = {}, pt = null, ut = null;
    if (W != null) for (He in W.ref !== void 0 && (ut = W.ref), W.key !== void 0 && (pt = "" + W.key), W) ie.call(W, He) && !se.hasOwnProperty(He) && (dt[He] = W[He]);
    var vt = arguments.length - 2;
    if (vt === 1) dt.children = Oe;
    else if (1 < vt) {
      for (var M = Array(vt), pe = 0; pe < vt; pe++) M[pe] = arguments[pe + 2];
      dt.children = M;
    }
    if (_ && _.defaultProps) for (He in vt = _.defaultProps, vt) dt[He] === void 0 && (dt[He] = vt[He]);
    return { $$typeof: P, type: _, key: pt, ref: ut, props: dt, _owner: Me.current };
  }
  function Ct(_, W) {
    return { $$typeof: P, type: _.type, key: W, ref: _.ref, props: _.props, _owner: _._owner };
  }
  function ft(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === P;
  }
  function zt(_) {
    var W = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function(Oe) {
      return W[Oe];
    });
  }
  var Be = /\/+/g;
  function De(_, W) {
    return typeof _ == "object" && _ !== null && _.key != null ? zt("" + _.key) : W.toString(36);
  }
  function kt(_, W, Oe, He, dt) {
    var pt = typeof _;
    (pt === "undefined" || pt === "boolean") && (_ = null);
    var ut = !1;
    if (_ === null) ut = !0;
    else switch (pt) {
      case "string":
      case "number":
        ut = !0;
        break;
      case "object":
        switch (_.$$typeof) {
          case P:
          case H:
            ut = !0;
        }
    }
    if (ut) return ut = _, dt = dt(ut), _ = He === "" ? "." + De(ut, 0) : He, _e(dt) ? (Oe = "", _ != null && (Oe = _.replace(Be, "$&/") + "/"), kt(dt, W, Oe, "", function(pe) {
      return pe;
    })) : dt != null && (ft(dt) && (dt = Ct(dt, Oe + (!dt.key || ut && ut.key === dt.key ? "" : ("" + dt.key).replace(Be, "$&/") + "/") + _)), W.push(dt)), 1;
    if (ut = 0, He = He === "" ? "." : He + ":", _e(_)) for (var vt = 0; vt < _.length; vt++) {
      pt = _[vt];
      var M = He + De(pt, vt);
      ut += kt(pt, W, Oe, M, dt);
    }
    else if (M = be(_), typeof M == "function") for (_ = M.call(_), vt = 0; !(pt = _.next()).done; ) pt = pt.value, M = He + De(pt, vt++), ut += kt(pt, W, Oe, M, dt);
    else if (pt === "object") throw W = String(_), Error("Objects are not valid as a React child (found: " + (W === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : W) + "). If you meant to render a collection of children, use an array instead.");
    return ut;
  }
  function Ze(_, W, Oe) {
    if (_ == null) return _;
    var He = [], dt = 0;
    return kt(_, He, "", "", function(pt) {
      return W.call(Oe, pt, dt++);
    }), He;
  }
  function wt(_) {
    if (_._status === -1) {
      var W = _._result;
      W = W(), W.then(function(Oe) {
        (_._status === 0 || _._status === -1) && (_._status = 1, _._result = Oe);
      }, function(Oe) {
        (_._status === 0 || _._status === -1) && (_._status = 2, _._result = Oe);
      }), _._status === -1 && (_._status = 0, _._result = W);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var le = { current: null }, ee = { transition: null }, Ne = { ReactCurrentDispatcher: le, ReactCurrentBatchConfig: ee, ReactCurrentOwner: Me };
  function oe() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Dt.Children = { map: Ze, forEach: function(_, W, Oe) {
    Ze(_, function() {
      W.apply(this, arguments);
    }, Oe);
  }, count: function(_) {
    var W = 0;
    return Ze(_, function() {
      W++;
    }), W;
  }, toArray: function(_) {
    return Ze(_, function(W) {
      return W;
    }) || [];
  }, only: function(_) {
    if (!ft(_)) throw Error("React.Children.only expected to receive a single React element child.");
    return _;
  } }, Dt.Component = ct, Dt.Fragment = j, Dt.Profiler = Je, Dt.PureComponent = lt, Dt.StrictMode = ye, Dt.Suspense = re, Dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ne, Dt.act = oe, Dt.cloneElement = function(_, W, Oe) {
    if (_ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + _ + ".");
    var He = Qe({}, _.props), dt = _.key, pt = _.ref, ut = _._owner;
    if (W != null) {
      if (W.ref !== void 0 && (pt = W.ref, ut = Me.current), W.key !== void 0 && (dt = "" + W.key), _.type && _.type.defaultProps) var vt = _.type.defaultProps;
      for (M in W) ie.call(W, M) && !se.hasOwnProperty(M) && (He[M] = W[M] === void 0 && vt !== void 0 ? vt[M] : W[M]);
    }
    var M = arguments.length - 2;
    if (M === 1) He.children = Oe;
    else if (1 < M) {
      vt = Array(M);
      for (var pe = 0; pe < M; pe++) vt[pe] = arguments[pe + 2];
      He.children = vt;
    }
    return { $$typeof: P, type: _.type, key: dt, ref: pt, props: He, _owner: ut };
  }, Dt.createContext = function(_) {
    return _ = { $$typeof: S, _currentValue: _, _currentValue2: _, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, _.Provider = { $$typeof: Ye, _context: _ }, _.Consumer = _;
  }, Dt.createElement = Tt, Dt.createFactory = function(_) {
    var W = Tt.bind(null, _);
    return W.type = _, W;
  }, Dt.createRef = function() {
    return { current: null };
  }, Dt.forwardRef = function(_) {
    return { $$typeof: Nt, render: _ };
  }, Dt.isValidElement = ft, Dt.lazy = function(_) {
    return { $$typeof: rt, _payload: { _status: -1, _result: _ }, _init: wt };
  }, Dt.memo = function(_, W) {
    return { $$typeof: de, type: _, compare: W === void 0 ? null : W };
  }, Dt.startTransition = function(_) {
    var W = ee.transition;
    ee.transition = {};
    try {
      _();
    } finally {
      ee.transition = W;
    }
  }, Dt.unstable_act = oe, Dt.useCallback = function(_, W) {
    return le.current.useCallback(_, W);
  }, Dt.useContext = function(_) {
    return le.current.useContext(_);
  }, Dt.useDebugValue = function() {
  }, Dt.useDeferredValue = function(_) {
    return le.current.useDeferredValue(_);
  }, Dt.useEffect = function(_, W) {
    return le.current.useEffect(_, W);
  }, Dt.useId = function() {
    return le.current.useId();
  }, Dt.useImperativeHandle = function(_, W, Oe) {
    return le.current.useImperativeHandle(_, W, Oe);
  }, Dt.useInsertionEffect = function(_, W) {
    return le.current.useInsertionEffect(_, W);
  }, Dt.useLayoutEffect = function(_, W) {
    return le.current.useLayoutEffect(_, W);
  }, Dt.useMemo = function(_, W) {
    return le.current.useMemo(_, W);
  }, Dt.useReducer = function(_, W, Oe) {
    return le.current.useReducer(_, W, Oe);
  }, Dt.useRef = function(_) {
    return le.current.useRef(_);
  }, Dt.useState = function(_) {
    return le.current.useState(_);
  }, Dt.useSyncExternalStore = function(_, W, Oe) {
    return le.current.useSyncExternalStore(_, W, Oe);
  }, Dt.useTransition = function() {
    return le.current.useTransition();
  }, Dt.version = "18.3.1", Dt;
}
var nv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
nv.exports;
var tb;
function f_() {
  return tb || (tb = 1, (function(P, H) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var j = "18.3.1", ye = Symbol.for("react.element"), Je = Symbol.for("react.portal"), Ye = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), Nt = Symbol.for("react.profiler"), re = Symbol.for("react.provider"), de = Symbol.for("react.context"), rt = Symbol.for("react.forward_ref"), ae = Symbol.for("react.suspense"), be = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), Qe = Symbol.for("react.lazy"), at = Symbol.for("react.offscreen"), ct = Symbol.iterator, Ut = "@@iterator";
      function lt(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = ct && h[ct] || h[Ut];
        return typeof C == "function" ? C : null;
      }
      var V = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, _e = {
        transition: null
      }, ie = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Me = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, se = {}, Tt = null;
      function Ct(h) {
        Tt = h;
      }
      se.setExtraStackFrame = function(h) {
        Tt = h;
      }, se.getCurrentStack = null, se.getStackAddendum = function() {
        var h = "";
        Tt && (h += Tt);
        var C = se.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var ft = !1, zt = !1, Be = !1, De = !1, kt = !1, Ze = {
        ReactCurrentDispatcher: V,
        ReactCurrentBatchConfig: _e,
        ReactCurrentOwner: Me
      };
      Ze.ReactDebugCurrentFrame = se, Ze.ReactCurrentActQueue = ie;
      function wt(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), B = 1; B < C; B++)
            z[B - 1] = arguments[B];
          ee("warn", h, z);
        }
      }
      function le(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), B = 1; B < C; B++)
            z[B - 1] = arguments[B];
          ee("error", h, z);
        }
      }
      function ee(h, C, z) {
        {
          var B = Ze.ReactDebugCurrentFrame, te = B.getStackAddendum();
          te !== "" && (C += "%s", z = z.concat([te]));
          var Pe = z.map(function(fe) {
            return String(fe);
          });
          Pe.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Pe);
        }
      }
      var Ne = {};
      function oe(h, C) {
        {
          var z = h.constructor, B = z && (z.displayName || z.name) || "ReactClass", te = B + "." + C;
          if (Ne[te])
            return;
          le("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, B), Ne[te] = !0;
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
          oe(h, "forceUpdate");
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
        enqueueReplaceState: function(h, C, z, B) {
          oe(h, "replaceState");
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
        enqueueSetState: function(h, C, z, B) {
          oe(h, "setState");
        }
      }, W = Object.assign, Oe = {};
      Object.freeze(Oe);
      function He(h, C, z) {
        this.props = h, this.context = C, this.refs = Oe, this.updater = z || _;
      }
      He.prototype.isReactComponent = {}, He.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, He.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var dt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, pt = function(h, C) {
          Object.defineProperty(He.prototype, h, {
            get: function() {
              wt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var ut in dt)
          dt.hasOwnProperty(ut) && pt(ut, dt[ut]);
      }
      function vt() {
      }
      vt.prototype = He.prototype;
      function M(h, C, z) {
        this.props = h, this.context = C, this.refs = Oe, this.updater = z || _;
      }
      var pe = M.prototype = new vt();
      pe.constructor = M, W(pe, He.prototype), pe.isPureReactComponent = !0;
      function Ge() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var yn = Array.isArray;
      function cn(h) {
        return yn(h);
      }
      function Rn(h) {
        {
          var C = typeof Symbol == "function" && Symbol.toStringTag, z = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return z;
        }
      }
      function wn(h) {
        try {
          return kn(h), !1;
        } catch {
          return !0;
        }
      }
      function kn(h) {
        return "" + h;
      }
      function Jn(h) {
        if (wn(h))
          return le("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Rn(h)), kn(h);
      }
      function ci(h, C, z) {
        var B = h.displayName;
        if (B)
          return B;
        var te = C.displayName || C.name || "";
        return te !== "" ? z + "(" + te + ")" : z;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Zn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && le("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case Ye:
            return "Fragment";
          case Je:
            return "Portal";
          case Nt:
            return "Profiler";
          case S:
            return "StrictMode";
          case ae:
            return "Suspense";
          case be:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case de:
              var C = h;
              return sa(C) + ".Consumer";
            case re:
              var z = h;
              return sa(z._context) + ".Provider";
            case rt:
              return ci(h, h.render, "ForwardRef");
            case ne:
              var B = h.displayName || null;
              return B !== null ? B : Zn(h.type) || "Memo";
            case Qe: {
              var te = h, Pe = te._payload, fe = te._init;
              try {
                return Zn(fe(Pe));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var _n = Object.prototype.hasOwnProperty, $n = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Er, Wa, zn;
      zn = {};
      function Cr(h) {
        if (_n.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function ca(h) {
        if (_n.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function $a(h, C) {
        var z = function() {
          Er || (Er = !0, le("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: z,
          configurable: !0
        });
      }
      function fi(h, C) {
        var z = function() {
          Wa || (Wa = !0, le("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: z,
          configurable: !0
        });
      }
      function ue(h) {
        if (typeof h.ref == "string" && Me.current && h.__self && Me.current.stateNode !== h.__self) {
          var C = Zn(Me.current.type);
          zn[C] || (le('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), zn[C] = !0);
        }
      }
      var je = function(h, C, z, B, te, Pe, fe) {
        var We = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: ye,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: z,
          props: fe,
          // Record the component responsible for creating this element.
          _owner: Pe
        };
        return We._store = {}, Object.defineProperty(We._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(We, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: B
        }), Object.defineProperty(We, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: te
        }), Object.freeze && (Object.freeze(We.props), Object.freeze(We)), We;
      };
      function yt(h, C, z) {
        var B, te = {}, Pe = null, fe = null, We = null, Rt = null;
        if (C != null) {
          Cr(C) && (fe = C.ref, ue(C)), ca(C) && (Jn(C.key), Pe = "" + C.key), We = C.__self === void 0 ? null : C.__self, Rt = C.__source === void 0 ? null : C.__source;
          for (B in C)
            _n.call(C, B) && !$n.hasOwnProperty(B) && (te[B] = C[B]);
        }
        var Ft = arguments.length - 2;
        if (Ft === 1)
          te.children = z;
        else if (Ft > 1) {
          for (var on = Array(Ft), Jt = 0; Jt < Ft; Jt++)
            on[Jt] = arguments[Jt + 2];
          Object.freeze && Object.freeze(on), te.children = on;
        }
        if (h && h.defaultProps) {
          var gt = h.defaultProps;
          for (B in gt)
            te[B] === void 0 && (te[B] = gt[B]);
        }
        if (Pe || fe) {
          var Zt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Pe && $a(te, Zt), fe && fi(te, Zt);
        }
        return je(h, Pe, fe, We, Rt, Me.current, te);
      }
      function $t(h, C) {
        var z = je(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return z;
      }
      function an(h, C, z) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var B, te = W({}, h.props), Pe = h.key, fe = h.ref, We = h._self, Rt = h._source, Ft = h._owner;
        if (C != null) {
          Cr(C) && (fe = C.ref, Ft = Me.current), ca(C) && (Jn(C.key), Pe = "" + C.key);
          var on;
          h.type && h.type.defaultProps && (on = h.type.defaultProps);
          for (B in C)
            _n.call(C, B) && !$n.hasOwnProperty(B) && (C[B] === void 0 && on !== void 0 ? te[B] = on[B] : te[B] = C[B]);
        }
        var Jt = arguments.length - 2;
        if (Jt === 1)
          te.children = z;
        else if (Jt > 1) {
          for (var gt = Array(Jt), Zt = 0; Zt < Jt; Zt++)
            gt[Zt] = arguments[Zt + 2];
          te.children = gt;
        }
        return je(h.type, Pe, fe, We, Rt, Ft, te);
      }
      function gn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === ye;
      }
      var fn = ".", er = ":";
      function ln(h) {
        var C = /[=:]/g, z = {
          "=": "=0",
          ":": "=2"
        }, B = h.replace(C, function(te) {
          return z[te];
        });
        return "$" + B;
      }
      var qt = !1, Kt = /\/+/g;
      function fa(h) {
        return h.replace(Kt, "$&/");
      }
      function br(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? (Jn(h.key), ln("" + h.key)) : C.toString(36);
      }
      function Ra(h, C, z, B, te) {
        var Pe = typeof h;
        (Pe === "undefined" || Pe === "boolean") && (h = null);
        var fe = !1;
        if (h === null)
          fe = !0;
        else
          switch (Pe) {
            case "string":
            case "number":
              fe = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case ye:
                case Je:
                  fe = !0;
              }
          }
        if (fe) {
          var We = h, Rt = te(We), Ft = B === "" ? fn + br(We, 0) : B;
          if (cn(Rt)) {
            var on = "";
            Ft != null && (on = fa(Ft) + "/"), Ra(Rt, C, on, "", function(Jf) {
              return Jf;
            });
          } else Rt != null && (gn(Rt) && (Rt.key && (!We || We.key !== Rt.key) && Jn(Rt.key), Rt = $t(
            Rt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            z + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Rt.key && (!We || We.key !== Rt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + Rt.key) + "/"
            ) : "") + Ft
          )), C.push(Rt));
          return 1;
        }
        var Jt, gt, Zt = 0, Sn = B === "" ? fn : B + er;
        if (cn(h))
          for (var Cl = 0; Cl < h.length; Cl++)
            Jt = h[Cl], gt = Sn + br(Jt, Cl), Zt += Ra(Jt, C, z, gt, te);
        else {
          var Ko = lt(h);
          if (typeof Ko == "function") {
            var Bi = h;
            Ko === Bi.entries && (qt || wt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), qt = !0);
            for (var Xo = Ko.call(Bi), su, Xf = 0; !(su = Xo.next()).done; )
              Jt = su.value, gt = Sn + br(Jt, Xf++), Zt += Ra(Jt, C, z, gt, te);
          } else if (Pe === "object") {
            var sc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (sc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : sc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Zt;
      }
      function Hi(h, C, z) {
        if (h == null)
          return h;
        var B = [], te = 0;
        return Ra(h, B, "", "", function(Pe) {
          return C.call(z, Pe, te++);
        }), B;
      }
      function eu(h) {
        var C = 0;
        return Hi(h, function() {
          C++;
        }), C;
      }
      function tu(h, C, z) {
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
        if (!gn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function nu(h) {
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
          $$typeof: re,
          _context: C
        };
        var z = !1, B = !1, te = !1;
        {
          var Pe = {
            $$typeof: de,
            _context: C
          };
          Object.defineProperties(Pe, {
            Provider: {
              get: function() {
                return B || (B = !0, le("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(fe) {
                C.Provider = fe;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(fe) {
                C._currentValue = fe;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(fe) {
                C._currentValue2 = fe;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(fe) {
                C._threadCount = fe;
              }
            },
            Consumer: {
              get: function() {
                return z || (z = !0, le("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(fe) {
                te || (wt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", fe), te = !0);
              }
            }
          }), C.Consumer = Pe;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var _r = -1, Dr = 0, lr = 1, di = 2;
      function Qa(h) {
        if (h._status === _r) {
          var C = h._result, z = C();
          if (z.then(function(Pe) {
            if (h._status === Dr || h._status === _r) {
              var fe = h;
              fe._status = lr, fe._result = Pe;
            }
          }, function(Pe) {
            if (h._status === Dr || h._status === _r) {
              var fe = h;
              fe._status = di, fe._result = Pe;
            }
          }), h._status === _r) {
            var B = h;
            B._status = Dr, B._result = z;
          }
        }
        if (h._status === lr) {
          var te = h._result;
          return te === void 0 && le(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, te), "default" in te || le(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, te), te.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var C = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, z = {
          $$typeof: Qe,
          _payload: C,
          _init: Qa
        };
        {
          var B, te;
          Object.defineProperties(z, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return B;
              },
              set: function(Pe) {
                le("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), B = Pe, Object.defineProperty(z, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return te;
              },
              set: function(Pe) {
                le("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), te = Pe, Object.defineProperty(z, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return z;
      }
      function vi(h) {
        h != null && h.$$typeof === ne ? le("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? le("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && le("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && le("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: rt,
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
            set: function(B) {
              z = B, !h.name && !h.displayName && (h.displayName = B);
            }
          });
        }
        return C;
      }
      var b;
      b = Symbol.for("react.module.reference");
      function Q(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === Ye || h === Nt || kt || h === S || h === ae || h === be || De || h === at || ft || zt || Be || typeof h == "object" && h !== null && (h.$$typeof === Qe || h.$$typeof === ne || h.$$typeof === re || h.$$typeof === de || h.$$typeof === rt || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === b || h.getModuleId !== void 0));
      }
      function ve(h, C) {
        Q(h) || le("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var z = {
          $$typeof: ne,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var B;
          Object.defineProperty(z, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return B;
            },
            set: function(te) {
              B = te, !h.name && !h.displayName && (h.displayName = te);
            }
          });
        }
        return z;
      }
      function Re() {
        var h = V.current;
        return h === null && le(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function ot(h) {
        var C = Re();
        if (h._context !== void 0) {
          var z = h._context;
          z.Consumer === h ? le("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : z.Provider === h && le("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function tt(h) {
        var C = Re();
        return C.useState(h);
      }
      function bt(h, C, z) {
        var B = Re();
        return B.useReducer(h, C, z);
      }
      function St(h) {
        var C = Re();
        return C.useRef(h);
      }
      function Dn(h, C) {
        var z = Re();
        return z.useEffect(h, C);
      }
      function un(h, C) {
        var z = Re();
        return z.useInsertionEffect(h, C);
      }
      function dn(h, C) {
        var z = Re();
        return z.useLayoutEffect(h, C);
      }
      function ur(h, C) {
        var z = Re();
        return z.useCallback(h, C);
      }
      function Ga(h, C) {
        var z = Re();
        return z.useMemo(h, C);
      }
      function qa(h, C, z) {
        var B = Re();
        return B.useImperativeHandle(h, C, z);
      }
      function st(h, C) {
        {
          var z = Re();
          return z.useDebugValue(h, C);
        }
      }
      function mt() {
        var h = Re();
        return h.useTransition();
      }
      function Ka(h) {
        var C = Re();
        return C.useDeferredValue(h);
      }
      function ru() {
        var h = Re();
        return h.useId();
      }
      function au(h, C, z) {
        var B = Re();
        return B.useSyncExternalStore(h, C, z);
      }
      var hl = 0, Gu, ml, $r, $o, Nr, uc, oc;
      function qu() {
      }
      qu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Gu = console.log, ml = console.info, $r = console.warn, $o = console.error, Nr = console.group, uc = console.groupCollapsed, oc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: qu,
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
              log: W({}, h, {
                value: Gu
              }),
              info: W({}, h, {
                value: ml
              }),
              warn: W({}, h, {
                value: $r
              }),
              error: W({}, h, {
                value: $o
              }),
              group: W({}, h, {
                value: Nr
              }),
              groupCollapsed: W({}, h, {
                value: uc
              }),
              groupEnd: W({}, h, {
                value: oc
              })
            });
          }
          hl < 0 && le("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = Ze.ReactCurrentDispatcher, Ja;
      function Ku(h, C, z) {
        {
          if (Ja === void 0)
            try {
              throw Error();
            } catch (te) {
              var B = te.stack.trim().match(/\n( *(at )?)/);
              Ja = B && B[1] || "";
            }
          return `
` + Ja + h;
        }
      }
      var iu = !1, gl;
      {
        var Xu = typeof WeakMap == "function" ? WeakMap : Map;
        gl = new Xu();
      }
      function Ju(h, C) {
        if (!h || iu)
          return "";
        {
          var z = gl.get(h);
          if (z !== void 0)
            return z;
        }
        var B;
        iu = !0;
        var te = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Pe;
        Pe = Xa.current, Xa.current = null, yl();
        try {
          if (C) {
            var fe = function() {
              throw Error();
            };
            if (Object.defineProperty(fe.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(fe, []);
              } catch (Sn) {
                B = Sn;
              }
              Reflect.construct(h, [], fe);
            } else {
              try {
                fe.call();
              } catch (Sn) {
                B = Sn;
              }
              h.call(fe.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Sn) {
              B = Sn;
            }
            h();
          }
        } catch (Sn) {
          if (Sn && B && typeof Sn.stack == "string") {
            for (var We = Sn.stack.split(`
`), Rt = B.stack.split(`
`), Ft = We.length - 1, on = Rt.length - 1; Ft >= 1 && on >= 0 && We[Ft] !== Rt[on]; )
              on--;
            for (; Ft >= 1 && on >= 0; Ft--, on--)
              if (We[Ft] !== Rt[on]) {
                if (Ft !== 1 || on !== 1)
                  do
                    if (Ft--, on--, on < 0 || We[Ft] !== Rt[on]) {
                      var Jt = `
` + We[Ft].replace(" at new ", " at ");
                      return h.displayName && Jt.includes("<anonymous>") && (Jt = Jt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, Jt), Jt;
                    }
                  while (Ft >= 1 && on >= 0);
                break;
              }
          }
        } finally {
          iu = !1, Xa.current = Pe, da(), Error.prepareStackTrace = te;
        }
        var gt = h ? h.displayName || h.name : "", Zt = gt ? Ku(gt) : "";
        return typeof h == "function" && gl.set(h, Zt), Zt;
      }
      function Pi(h, C, z) {
        return Ju(h, !1);
      }
      function qf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, z) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Ju(h, qf(h));
        if (typeof h == "string")
          return Ku(h);
        switch (h) {
          case ae:
            return Ku("Suspense");
          case be:
            return Ku("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case rt:
              return Pi(h.render);
            case ne:
              return Vi(h.type, C, z);
            case Qe: {
              var B = h, te = B._payload, Pe = B._init;
              try {
                return Vi(Pe(te), C, z);
              } catch {
              }
            }
          }
        return "";
      }
      var Pt = {}, Zu = Ze.ReactDebugCurrentFrame;
      function At(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          Zu.setExtraStackFrame(z);
        } else
          Zu.setExtraStackFrame(null);
      }
      function Qo(h, C, z, B, te) {
        {
          var Pe = Function.call.bind(_n);
          for (var fe in h)
            if (Pe(h, fe)) {
              var We = void 0;
              try {
                if (typeof h[fe] != "function") {
                  var Rt = Error((B || "React class") + ": " + z + " type `" + fe + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[fe] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Rt.name = "Invariant Violation", Rt;
                }
                We = h[fe](C, fe, B, z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Ft) {
                We = Ft;
              }
              We && !(We instanceof Error) && (At(te), le("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", B || "React class", z, fe, typeof We), At(null)), We instanceof Error && !(We.message in Pt) && (Pt[We.message] = !0, At(te), le("Failed %s type: %s", z, We.message), At(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          Ct(z);
        } else
          Ct(null);
      }
      var et;
      et = !1;
      function eo() {
        if (Me.current) {
          var h = Zn(Me.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function or(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), z = h.lineNumber;
          return `

Check your code at ` + C + ":" + z + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? or(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var C = eo();
        if (!C) {
          var z = typeof h == "string" ? h : h.displayName || h.name;
          z && (C = `

Check the top-level render call using <` + z + ">.");
        }
        return C;
      }
      function pn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var z = yi(C);
          if (!Or[z]) {
            Or[z] = !0;
            var B = "";
            h && h._owner && h._owner !== Me.current && (B = " It was passed a child from " + Zn(h._owner.type) + "."), hi(h), le('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', z, B), hi(null);
          }
        }
      }
      function Xt(h, C) {
        if (typeof h == "object") {
          if (cn(h))
            for (var z = 0; z < h.length; z++) {
              var B = h[z];
              gn(B) && pn(B, C);
            }
          else if (gn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var te = lt(h);
            if (typeof te == "function" && te !== h.entries)
              for (var Pe = te.call(h), fe; !(fe = Pe.next()).done; )
                gn(fe.value) && pn(fe.value, C);
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
          else if (typeof C == "object" && (C.$$typeof === rt || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === ne))
            z = C.propTypes;
          else
            return;
          if (z) {
            var B = Zn(C);
            Qo(z, h.props, "prop", B, h);
          } else if (C.PropTypes !== void 0 && !et) {
            et = !0;
            var te = Zn(C);
            le("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", te || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && le("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Qn(h) {
        {
          for (var C = Object.keys(h.props), z = 0; z < C.length; z++) {
            var B = C[z];
            if (B !== "children" && B !== "key") {
              hi(h), le("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", B), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), le("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Lr(h, C, z) {
        var B = Q(h);
        if (!B) {
          var te = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (te += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Pe = mi(C);
          Pe ? te += Pe : te += eo();
          var fe;
          h === null ? fe = "null" : cn(h) ? fe = "array" : h !== void 0 && h.$$typeof === ye ? (fe = "<" + (Zn(h.type) || "Unknown") + " />", te = " Did you accidentally export a JSX literal instead of a component?") : fe = typeof h, le("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", fe, te);
        }
        var We = yt.apply(this, arguments);
        if (We == null)
          return We;
        if (B)
          for (var Rt = 2; Rt < arguments.length; Rt++)
            Xt(arguments[Rt], h);
        return h === Ye ? Qn(We) : Sl(We), We;
      }
      var Ta = !1;
      function lu(h) {
        var C = Lr.bind(null, h);
        return C.type = h, Ta || (Ta = !0, wt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return wt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Go(h, C, z) {
        for (var B = an.apply(this, arguments), te = 2; te < arguments.length; te++)
          Xt(arguments[te], B.type);
        return Sl(B), B;
      }
      function qo(h, C) {
        var z = _e.transition;
        _e.transition = {};
        var B = _e.transition;
        _e.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (_e.transition = z, z === null && B._updatedFibers) {
            var te = B._updatedFibers.size;
            te > 10 && wt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), B._updatedFibers.clear();
          }
        }
      }
      var xl = !1, uu = null;
      function Kf(h) {
        if (uu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), z = P && P[C];
            uu = z.call(P, "timers").setImmediate;
          } catch {
            uu = function(te) {
              xl === !1 && (xl = !0, typeof MessageChannel > "u" && le("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Pe = new MessageChannel();
              Pe.port1.onmessage = te, Pe.port2.postMessage(void 0);
            };
          }
        return uu(h);
      }
      var wa = 0, Za = !1;
      function gi(h) {
        {
          var C = wa;
          wa++, ie.current === null && (ie.current = []);
          var z = ie.isBatchingLegacy, B;
          try {
            if (ie.isBatchingLegacy = !0, B = h(), !z && ie.didScheduleLegacyUpdate) {
              var te = ie.current;
              te !== null && (ie.didScheduleLegacyUpdate = !1, El(te));
            }
          } catch (gt) {
            throw ka(C), gt;
          } finally {
            ie.isBatchingLegacy = z;
          }
          if (B !== null && typeof B == "object" && typeof B.then == "function") {
            var Pe = B, fe = !1, We = {
              then: function(gt, Zt) {
                fe = !0, Pe.then(function(Sn) {
                  ka(C), wa === 0 ? to(Sn, gt, Zt) : gt(Sn);
                }, function(Sn) {
                  ka(C), Zt(Sn);
                });
              }
            };
            return !Za && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              fe || (Za = !0, le("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), We;
          } else {
            var Rt = B;
            if (ka(C), wa === 0) {
              var Ft = ie.current;
              Ft !== null && (El(Ft), ie.current = null);
              var on = {
                then: function(gt, Zt) {
                  ie.current === null ? (ie.current = [], to(Rt, gt, Zt)) : gt(Rt);
                }
              };
              return on;
            } else {
              var Jt = {
                then: function(gt, Zt) {
                  gt(Rt);
                }
              };
              return Jt;
            }
          }
        }
      }
      function ka(h) {
        h !== wa - 1 && le("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), wa = h;
      }
      function to(h, C, z) {
        {
          var B = ie.current;
          if (B !== null)
            try {
              El(B), Kf(function() {
                B.length === 0 ? (ie.current = null, C(h)) : to(h, C, z);
              });
            } catch (te) {
              z(te);
            }
          else
            C(h);
        }
      }
      var no = !1;
      function El(h) {
        if (!no) {
          no = !0;
          var C = 0;
          try {
            for (; C < h.length; C++) {
              var z = h[C];
              do
                z = z(!0);
              while (z !== null);
            }
            h.length = 0;
          } catch (B) {
            throw h = h.slice(C + 1), B;
          } finally {
            no = !1;
          }
        }
      }
      var ou = Lr, ro = Go, ao = lu, ei = {
        map: Hi,
        forEach: tu,
        count: eu,
        toArray: pl,
        only: vl
      };
      H.Children = ei, H.Component = He, H.Fragment = Ye, H.Profiler = Nt, H.PureComponent = M, H.StrictMode = S, H.Suspense = ae, H.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ze, H.act = gi, H.cloneElement = ro, H.createContext = nu, H.createElement = ou, H.createFactory = ao, H.createRef = Ge, H.forwardRef = vi, H.isValidElement = gn, H.lazy = pi, H.memo = ve, H.startTransition = qo, H.unstable_act = gi, H.useCallback = ur, H.useContext = ot, H.useDebugValue = st, H.useDeferredValue = Ka, H.useEffect = Dn, H.useId = ru, H.useImperativeHandle = qa, H.useInsertionEffect = un, H.useLayoutEffect = dn, H.useMemo = Ga, H.useReducer = bt, H.useRef = St, H.useState = tt, H.useSyncExternalStore = au, H.useTransition = mt, H.version = j, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(nv, nv.exports)), nv.exports;
}
var nb;
function rv() {
  return nb || (nb = 1, process.env.NODE_ENV === "production" ? Km.exports = c_() : Km.exports = f_()), Km.exports;
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
var rb;
function d_() {
  if (rb) return ev;
  rb = 1;
  var P = rv(), H = Symbol.for("react.element"), j = Symbol.for("react.fragment"), ye = Object.prototype.hasOwnProperty, Je = P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Ye = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(Nt, re, de) {
    var rt, ae = {}, be = null, ne = null;
    de !== void 0 && (be = "" + de), re.key !== void 0 && (be = "" + re.key), re.ref !== void 0 && (ne = re.ref);
    for (rt in re) ye.call(re, rt) && !Ye.hasOwnProperty(rt) && (ae[rt] = re[rt]);
    if (Nt && Nt.defaultProps) for (rt in re = Nt.defaultProps, re) ae[rt] === void 0 && (ae[rt] = re[rt]);
    return { $$typeof: H, type: Nt, key: be, ref: ne, props: ae, _owner: Je.current };
  }
  return ev.Fragment = j, ev.jsx = S, ev.jsxs = S, ev;
}
var tv = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ab;
function p_() {
  return ab || (ab = 1, process.env.NODE_ENV !== "production" && (function() {
    var P = rv(), H = Symbol.for("react.element"), j = Symbol.for("react.portal"), ye = Symbol.for("react.fragment"), Je = Symbol.for("react.strict_mode"), Ye = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), Nt = Symbol.for("react.context"), re = Symbol.for("react.forward_ref"), de = Symbol.for("react.suspense"), rt = Symbol.for("react.suspense_list"), ae = Symbol.for("react.memo"), be = Symbol.for("react.lazy"), ne = Symbol.for("react.offscreen"), Qe = Symbol.iterator, at = "@@iterator";
    function ct(b) {
      if (b === null || typeof b != "object")
        return null;
      var Q = Qe && b[Qe] || b[at];
      return typeof Q == "function" ? Q : null;
    }
    var Ut = P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function lt(b) {
      {
        for (var Q = arguments.length, ve = new Array(Q > 1 ? Q - 1 : 0), Re = 1; Re < Q; Re++)
          ve[Re - 1] = arguments[Re];
        V("error", b, ve);
      }
    }
    function V(b, Q, ve) {
      {
        var Re = Ut.ReactDebugCurrentFrame, ot = Re.getStackAddendum();
        ot !== "" && (Q += "%s", ve = ve.concat([ot]));
        var tt = ve.map(function(bt) {
          return String(bt);
        });
        tt.unshift("Warning: " + Q), Function.prototype.apply.call(console[b], console, tt);
      }
    }
    var _e = !1, ie = !1, Me = !1, se = !1, Tt = !1, Ct;
    Ct = Symbol.for("react.module.reference");
    function ft(b) {
      return !!(typeof b == "string" || typeof b == "function" || b === ye || b === Ye || Tt || b === Je || b === de || b === rt || se || b === ne || _e || ie || Me || typeof b == "object" && b !== null && (b.$$typeof === be || b.$$typeof === ae || b.$$typeof === S || b.$$typeof === Nt || b.$$typeof === re || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      b.$$typeof === Ct || b.getModuleId !== void 0));
    }
    function zt(b, Q, ve) {
      var Re = b.displayName;
      if (Re)
        return Re;
      var ot = Q.displayName || Q.name || "";
      return ot !== "" ? ve + "(" + ot + ")" : ve;
    }
    function Be(b) {
      return b.displayName || "Context";
    }
    function De(b) {
      if (b == null)
        return null;
      if (typeof b.tag == "number" && lt("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof b == "function")
        return b.displayName || b.name || null;
      if (typeof b == "string")
        return b;
      switch (b) {
        case ye:
          return "Fragment";
        case j:
          return "Portal";
        case Ye:
          return "Profiler";
        case Je:
          return "StrictMode";
        case de:
          return "Suspense";
        case rt:
          return "SuspenseList";
      }
      if (typeof b == "object")
        switch (b.$$typeof) {
          case Nt:
            var Q = b;
            return Be(Q) + ".Consumer";
          case S:
            var ve = b;
            return Be(ve._context) + ".Provider";
          case re:
            return zt(b, b.render, "ForwardRef");
          case ae:
            var Re = b.displayName || null;
            return Re !== null ? Re : De(b.type) || "Memo";
          case be: {
            var ot = b, tt = ot._payload, bt = ot._init;
            try {
              return De(bt(tt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var kt = Object.assign, Ze = 0, wt, le, ee, Ne, oe, _, W;
    function Oe() {
    }
    Oe.__reactDisabledLog = !0;
    function He() {
      {
        if (Ze === 0) {
          wt = console.log, le = console.info, ee = console.warn, Ne = console.error, oe = console.group, _ = console.groupCollapsed, W = console.groupEnd;
          var b = {
            configurable: !0,
            enumerable: !0,
            value: Oe,
            writable: !0
          };
          Object.defineProperties(console, {
            info: b,
            log: b,
            warn: b,
            error: b,
            group: b,
            groupCollapsed: b,
            groupEnd: b
          });
        }
        Ze++;
      }
    }
    function dt() {
      {
        if (Ze--, Ze === 0) {
          var b = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: kt({}, b, {
              value: wt
            }),
            info: kt({}, b, {
              value: le
            }),
            warn: kt({}, b, {
              value: ee
            }),
            error: kt({}, b, {
              value: Ne
            }),
            group: kt({}, b, {
              value: oe
            }),
            groupCollapsed: kt({}, b, {
              value: _
            }),
            groupEnd: kt({}, b, {
              value: W
            })
          });
        }
        Ze < 0 && lt("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var pt = Ut.ReactCurrentDispatcher, ut;
    function vt(b, Q, ve) {
      {
        if (ut === void 0)
          try {
            throw Error();
          } catch (ot) {
            var Re = ot.stack.trim().match(/\n( *(at )?)/);
            ut = Re && Re[1] || "";
          }
        return `
` + ut + b;
      }
    }
    var M = !1, pe;
    {
      var Ge = typeof WeakMap == "function" ? WeakMap : Map;
      pe = new Ge();
    }
    function yn(b, Q) {
      if (!b || M)
        return "";
      {
        var ve = pe.get(b);
        if (ve !== void 0)
          return ve;
      }
      var Re;
      M = !0;
      var ot = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var tt;
      tt = pt.current, pt.current = null, He();
      try {
        if (Q) {
          var bt = function() {
            throw Error();
          };
          if (Object.defineProperty(bt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(bt, []);
            } catch (st) {
              Re = st;
            }
            Reflect.construct(b, [], bt);
          } else {
            try {
              bt.call();
            } catch (st) {
              Re = st;
            }
            b.call(bt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (st) {
            Re = st;
          }
          b();
        }
      } catch (st) {
        if (st && Re && typeof st.stack == "string") {
          for (var St = st.stack.split(`
`), Dn = Re.stack.split(`
`), un = St.length - 1, dn = Dn.length - 1; un >= 1 && dn >= 0 && St[un] !== Dn[dn]; )
            dn--;
          for (; un >= 1 && dn >= 0; un--, dn--)
            if (St[un] !== Dn[dn]) {
              if (un !== 1 || dn !== 1)
                do
                  if (un--, dn--, dn < 0 || St[un] !== Dn[dn]) {
                    var ur = `
` + St[un].replace(" at new ", " at ");
                    return b.displayName && ur.includes("<anonymous>") && (ur = ur.replace("<anonymous>", b.displayName)), typeof b == "function" && pe.set(b, ur), ur;
                  }
                while (un >= 1 && dn >= 0);
              break;
            }
        }
      } finally {
        M = !1, pt.current = tt, dt(), Error.prepareStackTrace = ot;
      }
      var Ga = b ? b.displayName || b.name : "", qa = Ga ? vt(Ga) : "";
      return typeof b == "function" && pe.set(b, qa), qa;
    }
    function cn(b, Q, ve) {
      return yn(b, !1);
    }
    function Rn(b) {
      var Q = b.prototype;
      return !!(Q && Q.isReactComponent);
    }
    function wn(b, Q, ve) {
      if (b == null)
        return "";
      if (typeof b == "function")
        return yn(b, Rn(b));
      if (typeof b == "string")
        return vt(b);
      switch (b) {
        case de:
          return vt("Suspense");
        case rt:
          return vt("SuspenseList");
      }
      if (typeof b == "object")
        switch (b.$$typeof) {
          case re:
            return cn(b.render);
          case ae:
            return wn(b.type, Q, ve);
          case be: {
            var Re = b, ot = Re._payload, tt = Re._init;
            try {
              return wn(tt(ot), Q, ve);
            } catch {
            }
          }
        }
      return "";
    }
    var kn = Object.prototype.hasOwnProperty, Jn = {}, ci = Ut.ReactDebugCurrentFrame;
    function sa(b) {
      if (b) {
        var Q = b._owner, ve = wn(b.type, b._source, Q ? Q.type : null);
        ci.setExtraStackFrame(ve);
      } else
        ci.setExtraStackFrame(null);
    }
    function Zn(b, Q, ve, Re, ot) {
      {
        var tt = Function.call.bind(kn);
        for (var bt in b)
          if (tt(b, bt)) {
            var St = void 0;
            try {
              if (typeof b[bt] != "function") {
                var Dn = Error((Re || "React class") + ": " + ve + " type `" + bt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof b[bt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Dn.name = "Invariant Violation", Dn;
              }
              St = b[bt](Q, bt, Re, ve, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (un) {
              St = un;
            }
            St && !(St instanceof Error) && (sa(ot), lt("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Re || "React class", ve, bt, typeof St), sa(null)), St instanceof Error && !(St.message in Jn) && (Jn[St.message] = !0, sa(ot), lt("Failed %s type: %s", ve, St.message), sa(null));
          }
      }
    }
    var _n = Array.isArray;
    function $n(b) {
      return _n(b);
    }
    function Er(b) {
      {
        var Q = typeof Symbol == "function" && Symbol.toStringTag, ve = Q && b[Symbol.toStringTag] || b.constructor.name || "Object";
        return ve;
      }
    }
    function Wa(b) {
      try {
        return zn(b), !1;
      } catch {
        return !0;
      }
    }
    function zn(b) {
      return "" + b;
    }
    function Cr(b) {
      if (Wa(b))
        return lt("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Er(b)), zn(b);
    }
    var ca = Ut.ReactCurrentOwner, $a = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, ue;
    function je(b) {
      if (kn.call(b, "ref")) {
        var Q = Object.getOwnPropertyDescriptor(b, "ref").get;
        if (Q && Q.isReactWarning)
          return !1;
      }
      return b.ref !== void 0;
    }
    function yt(b) {
      if (kn.call(b, "key")) {
        var Q = Object.getOwnPropertyDescriptor(b, "key").get;
        if (Q && Q.isReactWarning)
          return !1;
      }
      return b.key !== void 0;
    }
    function $t(b, Q) {
      typeof b.ref == "string" && ca.current;
    }
    function an(b, Q) {
      {
        var ve = function() {
          fi || (fi = !0, lt("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Q));
        };
        ve.isReactWarning = !0, Object.defineProperty(b, "key", {
          get: ve,
          configurable: !0
        });
      }
    }
    function gn(b, Q) {
      {
        var ve = function() {
          ue || (ue = !0, lt("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Q));
        };
        ve.isReactWarning = !0, Object.defineProperty(b, "ref", {
          get: ve,
          configurable: !0
        });
      }
    }
    var fn = function(b, Q, ve, Re, ot, tt, bt) {
      var St = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: H,
        // Built-in properties that belong on the element
        type: b,
        key: Q,
        ref: ve,
        props: bt,
        // Record the component responsible for creating this element.
        _owner: tt
      };
      return St._store = {}, Object.defineProperty(St._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(St, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Re
      }), Object.defineProperty(St, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: ot
      }), Object.freeze && (Object.freeze(St.props), Object.freeze(St)), St;
    };
    function er(b, Q, ve, Re, ot) {
      {
        var tt, bt = {}, St = null, Dn = null;
        ve !== void 0 && (Cr(ve), St = "" + ve), yt(Q) && (Cr(Q.key), St = "" + Q.key), je(Q) && (Dn = Q.ref, $t(Q, ot));
        for (tt in Q)
          kn.call(Q, tt) && !$a.hasOwnProperty(tt) && (bt[tt] = Q[tt]);
        if (b && b.defaultProps) {
          var un = b.defaultProps;
          for (tt in un)
            bt[tt] === void 0 && (bt[tt] = un[tt]);
        }
        if (St || Dn) {
          var dn = typeof b == "function" ? b.displayName || b.name || "Unknown" : b;
          St && an(bt, dn), Dn && gn(bt, dn);
        }
        return fn(b, St, Dn, ot, Re, ca.current, bt);
      }
    }
    var ln = Ut.ReactCurrentOwner, qt = Ut.ReactDebugCurrentFrame;
    function Kt(b) {
      if (b) {
        var Q = b._owner, ve = wn(b.type, b._source, Q ? Q.type : null);
        qt.setExtraStackFrame(ve);
      } else
        qt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function br(b) {
      return typeof b == "object" && b !== null && b.$$typeof === H;
    }
    function Ra() {
      {
        if (ln.current) {
          var b = De(ln.current.type);
          if (b)
            return `

Check the render method of \`` + b + "`.";
        }
        return "";
      }
    }
    function Hi(b) {
      return "";
    }
    var eu = {};
    function tu(b) {
      {
        var Q = Ra();
        if (!Q) {
          var ve = typeof b == "string" ? b : b.displayName || b.name;
          ve && (Q = `

Check the top-level render call using <` + ve + ">.");
        }
        return Q;
      }
    }
    function pl(b, Q) {
      {
        if (!b._store || b._store.validated || b.key != null)
          return;
        b._store.validated = !0;
        var ve = tu(Q);
        if (eu[ve])
          return;
        eu[ve] = !0;
        var Re = "";
        b && b._owner && b._owner !== ln.current && (Re = " It was passed a child from " + De(b._owner.type) + "."), Kt(b), lt('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ve, Re), Kt(null);
      }
    }
    function vl(b, Q) {
      {
        if (typeof b != "object")
          return;
        if ($n(b))
          for (var ve = 0; ve < b.length; ve++) {
            var Re = b[ve];
            br(Re) && pl(Re, Q);
          }
        else if (br(b))
          b._store && (b._store.validated = !0);
        else if (b) {
          var ot = ct(b);
          if (typeof ot == "function" && ot !== b.entries)
            for (var tt = ot.call(b), bt; !(bt = tt.next()).done; )
              br(bt.value) && pl(bt.value, Q);
        }
      }
    }
    function nu(b) {
      {
        var Q = b.type;
        if (Q == null || typeof Q == "string")
          return;
        var ve;
        if (typeof Q == "function")
          ve = Q.propTypes;
        else if (typeof Q == "object" && (Q.$$typeof === re || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        Q.$$typeof === ae))
          ve = Q.propTypes;
        else
          return;
        if (ve) {
          var Re = De(Q);
          Zn(ve, b.props, "prop", Re, b);
        } else if (Q.PropTypes !== void 0 && !fa) {
          fa = !0;
          var ot = De(Q);
          lt("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ot || "Unknown");
        }
        typeof Q.getDefaultProps == "function" && !Q.getDefaultProps.isReactClassApproved && lt("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(b) {
      {
        for (var Q = Object.keys(b.props), ve = 0; ve < Q.length; ve++) {
          var Re = Q[ve];
          if (Re !== "children" && Re !== "key") {
            Kt(b), lt("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Re), Kt(null);
            break;
          }
        }
        b.ref !== null && (Kt(b), lt("Invalid attribute `ref` supplied to `React.Fragment`."), Kt(null));
      }
    }
    var Dr = {};
    function lr(b, Q, ve, Re, ot, tt) {
      {
        var bt = ft(b);
        if (!bt) {
          var St = "";
          (b === void 0 || typeof b == "object" && b !== null && Object.keys(b).length === 0) && (St += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Dn = Hi();
          Dn ? St += Dn : St += Ra();
          var un;
          b === null ? un = "null" : $n(b) ? un = "array" : b !== void 0 && b.$$typeof === H ? (un = "<" + (De(b.type) || "Unknown") + " />", St = " Did you accidentally export a JSX literal instead of a component?") : un = typeof b, lt("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", un, St);
        }
        var dn = er(b, Q, ve, ot, tt);
        if (dn == null)
          return dn;
        if (bt) {
          var ur = Q.children;
          if (ur !== void 0)
            if (Re)
              if ($n(ur)) {
                for (var Ga = 0; Ga < ur.length; Ga++)
                  vl(ur[Ga], b);
                Object.freeze && Object.freeze(ur);
              } else
                lt("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ur, b);
        }
        if (kn.call(Q, "key")) {
          var qa = De(b), st = Object.keys(Q).filter(function(ru) {
            return ru !== "key";
          }), mt = st.length > 0 ? "{key: someKey, " + st.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Dr[qa + mt]) {
            var Ka = st.length > 0 ? "{" + st.join(": ..., ") + ": ...}" : "{}";
            lt(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, mt, qa, Ka, qa), Dr[qa + mt] = !0;
          }
        }
        return b === ye ? _r(dn) : nu(dn), dn;
      }
    }
    function di(b, Q, ve) {
      return lr(b, Q, ve, !0);
    }
    function Qa(b, Q, ve) {
      return lr(b, Q, ve, !1);
    }
    var pi = Qa, vi = di;
    tv.Fragment = ye, tv.jsx = pi, tv.jsxs = vi;
  })()), tv;
}
var ib;
function v_() {
  return ib || (ib = 1, process.env.NODE_ENV === "production" ? qm.exports = d_() : qm.exports = p_()), qm.exports;
}
var E = v_(), Qf = {}, Xm = { exports: {} }, Ia = {}, Jm = { exports: {} }, hS = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lb;
function h_() {
  return lb || (lb = 1, (function(P) {
    function H(ee, Ne) {
      var oe = ee.length;
      ee.push(Ne);
      e: for (; 0 < oe; ) {
        var _ = oe - 1 >>> 1, W = ee[_];
        if (0 < Je(W, Ne)) ee[_] = Ne, ee[oe] = W, oe = _;
        else break e;
      }
    }
    function j(ee) {
      return ee.length === 0 ? null : ee[0];
    }
    function ye(ee) {
      if (ee.length === 0) return null;
      var Ne = ee[0], oe = ee.pop();
      if (oe !== Ne) {
        ee[0] = oe;
        e: for (var _ = 0, W = ee.length, Oe = W >>> 1; _ < Oe; ) {
          var He = 2 * (_ + 1) - 1, dt = ee[He], pt = He + 1, ut = ee[pt];
          if (0 > Je(dt, oe)) pt < W && 0 > Je(ut, dt) ? (ee[_] = ut, ee[pt] = oe, _ = pt) : (ee[_] = dt, ee[He] = oe, _ = He);
          else if (pt < W && 0 > Je(ut, oe)) ee[_] = ut, ee[pt] = oe, _ = pt;
          else break e;
        }
      }
      return Ne;
    }
    function Je(ee, Ne) {
      var oe = ee.sortIndex - Ne.sortIndex;
      return oe !== 0 ? oe : ee.id - Ne.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Ye = performance;
      P.unstable_now = function() {
        return Ye.now();
      };
    } else {
      var S = Date, Nt = S.now();
      P.unstable_now = function() {
        return S.now() - Nt;
      };
    }
    var re = [], de = [], rt = 1, ae = null, be = 3, ne = !1, Qe = !1, at = !1, ct = typeof setTimeout == "function" ? setTimeout : null, Ut = typeof clearTimeout == "function" ? clearTimeout : null, lt = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function V(ee) {
      for (var Ne = j(de); Ne !== null; ) {
        if (Ne.callback === null) ye(de);
        else if (Ne.startTime <= ee) ye(de), Ne.sortIndex = Ne.expirationTime, H(re, Ne);
        else break;
        Ne = j(de);
      }
    }
    function _e(ee) {
      if (at = !1, V(ee), !Qe) if (j(re) !== null) Qe = !0, wt(ie);
      else {
        var Ne = j(de);
        Ne !== null && le(_e, Ne.startTime - ee);
      }
    }
    function ie(ee, Ne) {
      Qe = !1, at && (at = !1, Ut(Tt), Tt = -1), ne = !0;
      var oe = be;
      try {
        for (V(Ne), ae = j(re); ae !== null && (!(ae.expirationTime > Ne) || ee && !zt()); ) {
          var _ = ae.callback;
          if (typeof _ == "function") {
            ae.callback = null, be = ae.priorityLevel;
            var W = _(ae.expirationTime <= Ne);
            Ne = P.unstable_now(), typeof W == "function" ? ae.callback = W : ae === j(re) && ye(re), V(Ne);
          } else ye(re);
          ae = j(re);
        }
        if (ae !== null) var Oe = !0;
        else {
          var He = j(de);
          He !== null && le(_e, He.startTime - Ne), Oe = !1;
        }
        return Oe;
      } finally {
        ae = null, be = oe, ne = !1;
      }
    }
    var Me = !1, se = null, Tt = -1, Ct = 5, ft = -1;
    function zt() {
      return !(P.unstable_now() - ft < Ct);
    }
    function Be() {
      if (se !== null) {
        var ee = P.unstable_now();
        ft = ee;
        var Ne = !0;
        try {
          Ne = se(!0, ee);
        } finally {
          Ne ? De() : (Me = !1, se = null);
        }
      } else Me = !1;
    }
    var De;
    if (typeof lt == "function") De = function() {
      lt(Be);
    };
    else if (typeof MessageChannel < "u") {
      var kt = new MessageChannel(), Ze = kt.port2;
      kt.port1.onmessage = Be, De = function() {
        Ze.postMessage(null);
      };
    } else De = function() {
      ct(Be, 0);
    };
    function wt(ee) {
      se = ee, Me || (Me = !0, De());
    }
    function le(ee, Ne) {
      Tt = ct(function() {
        ee(P.unstable_now());
      }, Ne);
    }
    P.unstable_IdlePriority = 5, P.unstable_ImmediatePriority = 1, P.unstable_LowPriority = 4, P.unstable_NormalPriority = 3, P.unstable_Profiling = null, P.unstable_UserBlockingPriority = 2, P.unstable_cancelCallback = function(ee) {
      ee.callback = null;
    }, P.unstable_continueExecution = function() {
      Qe || ne || (Qe = !0, wt(ie));
    }, P.unstable_forceFrameRate = function(ee) {
      0 > ee || 125 < ee ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ct = 0 < ee ? Math.floor(1e3 / ee) : 5;
    }, P.unstable_getCurrentPriorityLevel = function() {
      return be;
    }, P.unstable_getFirstCallbackNode = function() {
      return j(re);
    }, P.unstable_next = function(ee) {
      switch (be) {
        case 1:
        case 2:
        case 3:
          var Ne = 3;
          break;
        default:
          Ne = be;
      }
      var oe = be;
      be = Ne;
      try {
        return ee();
      } finally {
        be = oe;
      }
    }, P.unstable_pauseExecution = function() {
    }, P.unstable_requestPaint = function() {
    }, P.unstable_runWithPriority = function(ee, Ne) {
      switch (ee) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          ee = 3;
      }
      var oe = be;
      be = ee;
      try {
        return Ne();
      } finally {
        be = oe;
      }
    }, P.unstable_scheduleCallback = function(ee, Ne, oe) {
      var _ = P.unstable_now();
      switch (typeof oe == "object" && oe !== null ? (oe = oe.delay, oe = typeof oe == "number" && 0 < oe ? _ + oe : _) : oe = _, ee) {
        case 1:
          var W = -1;
          break;
        case 2:
          W = 250;
          break;
        case 5:
          W = 1073741823;
          break;
        case 4:
          W = 1e4;
          break;
        default:
          W = 5e3;
      }
      return W = oe + W, ee = { id: rt++, callback: Ne, priorityLevel: ee, startTime: oe, expirationTime: W, sortIndex: -1 }, oe > _ ? (ee.sortIndex = oe, H(de, ee), j(re) === null && ee === j(de) && (at ? (Ut(Tt), Tt = -1) : at = !0, le(_e, oe - _))) : (ee.sortIndex = W, H(re, ee), Qe || ne || (Qe = !0, wt(ie))), ee;
    }, P.unstable_shouldYield = zt, P.unstable_wrapCallback = function(ee) {
      var Ne = be;
      return function() {
        var oe = be;
        be = Ne;
        try {
          return ee.apply(this, arguments);
        } finally {
          be = oe;
        }
      };
    };
  })(hS)), hS;
}
var mS = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ub;
function m_() {
  return ub || (ub = 1, (function(P) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var H = !1, j = 5;
      function ye(ue, je) {
        var yt = ue.length;
        ue.push(je), S(ue, je, yt);
      }
      function Je(ue) {
        return ue.length === 0 ? null : ue[0];
      }
      function Ye(ue) {
        if (ue.length === 0)
          return null;
        var je = ue[0], yt = ue.pop();
        return yt !== je && (ue[0] = yt, Nt(ue, yt, 0)), je;
      }
      function S(ue, je, yt) {
        for (var $t = yt; $t > 0; ) {
          var an = $t - 1 >>> 1, gn = ue[an];
          if (re(gn, je) > 0)
            ue[an] = je, ue[$t] = gn, $t = an;
          else
            return;
        }
      }
      function Nt(ue, je, yt) {
        for (var $t = yt, an = ue.length, gn = an >>> 1; $t < gn; ) {
          var fn = ($t + 1) * 2 - 1, er = ue[fn], ln = fn + 1, qt = ue[ln];
          if (re(er, je) < 0)
            ln < an && re(qt, er) < 0 ? (ue[$t] = qt, ue[ln] = je, $t = ln) : (ue[$t] = er, ue[fn] = je, $t = fn);
          else if (ln < an && re(qt, je) < 0)
            ue[$t] = qt, ue[ln] = je, $t = ln;
          else
            return;
        }
      }
      function re(ue, je) {
        var yt = ue.sortIndex - je.sortIndex;
        return yt !== 0 ? yt : ue.id - je.id;
      }
      var de = 1, rt = 2, ae = 3, be = 4, ne = 5;
      function Qe(ue, je) {
      }
      var at = typeof performance == "object" && typeof performance.now == "function";
      if (at) {
        var ct = performance;
        P.unstable_now = function() {
          return ct.now();
        };
      } else {
        var Ut = Date, lt = Ut.now();
        P.unstable_now = function() {
          return Ut.now() - lt;
        };
      }
      var V = 1073741823, _e = -1, ie = 250, Me = 5e3, se = 1e4, Tt = V, Ct = [], ft = [], zt = 1, Be = null, De = ae, kt = !1, Ze = !1, wt = !1, le = typeof setTimeout == "function" ? setTimeout : null, ee = typeof clearTimeout == "function" ? clearTimeout : null, Ne = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function oe(ue) {
        for (var je = Je(ft); je !== null; ) {
          if (je.callback === null)
            Ye(ft);
          else if (je.startTime <= ue)
            Ye(ft), je.sortIndex = je.expirationTime, ye(Ct, je);
          else
            return;
          je = Je(ft);
        }
      }
      function _(ue) {
        if (wt = !1, oe(ue), !Ze)
          if (Je(Ct) !== null)
            Ze = !0, zn(W);
          else {
            var je = Je(ft);
            je !== null && Cr(_, je.startTime - ue);
          }
      }
      function W(ue, je) {
        Ze = !1, wt && (wt = !1, ca()), kt = !0;
        var yt = De;
        try {
          var $t;
          if (!H) return Oe(ue, je);
        } finally {
          Be = null, De = yt, kt = !1;
        }
      }
      function Oe(ue, je) {
        var yt = je;
        for (oe(yt), Be = Je(Ct); Be !== null && !(Be.expirationTime > yt && (!ue || ci())); ) {
          var $t = Be.callback;
          if (typeof $t == "function") {
            Be.callback = null, De = Be.priorityLevel;
            var an = Be.expirationTime <= yt, gn = $t(an);
            yt = P.unstable_now(), typeof gn == "function" ? Be.callback = gn : Be === Je(Ct) && Ye(Ct), oe(yt);
          } else
            Ye(Ct);
          Be = Je(Ct);
        }
        if (Be !== null)
          return !0;
        var fn = Je(ft);
        return fn !== null && Cr(_, fn.startTime - yt), !1;
      }
      function He(ue, je) {
        switch (ue) {
          case de:
          case rt:
          case ae:
          case be:
          case ne:
            break;
          default:
            ue = ae;
        }
        var yt = De;
        De = ue;
        try {
          return je();
        } finally {
          De = yt;
        }
      }
      function dt(ue) {
        var je;
        switch (De) {
          case de:
          case rt:
          case ae:
            je = ae;
            break;
          default:
            je = De;
            break;
        }
        var yt = De;
        De = je;
        try {
          return ue();
        } finally {
          De = yt;
        }
      }
      function pt(ue) {
        var je = De;
        return function() {
          var yt = De;
          De = je;
          try {
            return ue.apply(this, arguments);
          } finally {
            De = yt;
          }
        };
      }
      function ut(ue, je, yt) {
        var $t = P.unstable_now(), an;
        if (typeof yt == "object" && yt !== null) {
          var gn = yt.delay;
          typeof gn == "number" && gn > 0 ? an = $t + gn : an = $t;
        } else
          an = $t;
        var fn;
        switch (ue) {
          case de:
            fn = _e;
            break;
          case rt:
            fn = ie;
            break;
          case ne:
            fn = Tt;
            break;
          case be:
            fn = se;
            break;
          case ae:
          default:
            fn = Me;
            break;
        }
        var er = an + fn, ln = {
          id: zt++,
          callback: je,
          priorityLevel: ue,
          startTime: an,
          expirationTime: er,
          sortIndex: -1
        };
        return an > $t ? (ln.sortIndex = an, ye(ft, ln), Je(Ct) === null && ln === Je(ft) && (wt ? ca() : wt = !0, Cr(_, an - $t))) : (ln.sortIndex = er, ye(Ct, ln), !Ze && !kt && (Ze = !0, zn(W))), ln;
      }
      function vt() {
      }
      function M() {
        !Ze && !kt && (Ze = !0, zn(W));
      }
      function pe() {
        return Je(Ct);
      }
      function Ge(ue) {
        ue.callback = null;
      }
      function yn() {
        return De;
      }
      var cn = !1, Rn = null, wn = -1, kn = j, Jn = -1;
      function ci() {
        var ue = P.unstable_now() - Jn;
        return !(ue < kn);
      }
      function sa() {
      }
      function Zn(ue) {
        if (ue < 0 || ue > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ue > 0 ? kn = Math.floor(1e3 / ue) : kn = j;
      }
      var _n = function() {
        if (Rn !== null) {
          var ue = P.unstable_now();
          Jn = ue;
          var je = !0, yt = !0;
          try {
            yt = Rn(je, ue);
          } finally {
            yt ? $n() : (cn = !1, Rn = null);
          }
        } else
          cn = !1;
      }, $n;
      if (typeof Ne == "function")
        $n = function() {
          Ne(_n);
        };
      else if (typeof MessageChannel < "u") {
        var Er = new MessageChannel(), Wa = Er.port2;
        Er.port1.onmessage = _n, $n = function() {
          Wa.postMessage(null);
        };
      } else
        $n = function() {
          le(_n, 0);
        };
      function zn(ue) {
        Rn = ue, cn || (cn = !0, $n());
      }
      function Cr(ue, je) {
        wn = le(function() {
          ue(P.unstable_now());
        }, je);
      }
      function ca() {
        ee(wn), wn = -1;
      }
      var $a = sa, fi = null;
      P.unstable_IdlePriority = ne, P.unstable_ImmediatePriority = de, P.unstable_LowPriority = be, P.unstable_NormalPriority = ae, P.unstable_Profiling = fi, P.unstable_UserBlockingPriority = rt, P.unstable_cancelCallback = Ge, P.unstable_continueExecution = M, P.unstable_forceFrameRate = Zn, P.unstable_getCurrentPriorityLevel = yn, P.unstable_getFirstCallbackNode = pe, P.unstable_next = dt, P.unstable_pauseExecution = vt, P.unstable_requestPaint = $a, P.unstable_runWithPriority = He, P.unstable_scheduleCallback = ut, P.unstable_shouldYield = ci, P.unstable_wrapCallback = pt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(mS)), mS;
}
var ob;
function Sb() {
  return ob || (ob = 1, process.env.NODE_ENV === "production" ? Jm.exports = h_() : Jm.exports = m_()), Jm.exports;
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
var sb;
function y_() {
  if (sb) return Ia;
  sb = 1;
  var P = rv(), H = Sb();
  function j(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var ye = /* @__PURE__ */ new Set(), Je = {};
  function Ye(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (Je[n] = r, n = 0; n < r.length; n++) ye.add(r[n]);
  }
  var Nt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), re = Object.prototype.hasOwnProperty, de = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, rt = {}, ae = {};
  function be(n) {
    return re.call(ae, n) ? !0 : re.call(rt, n) ? !1 : de.test(n) ? ae[n] = !0 : (rt[n] = !0, !1);
  }
  function ne(n, r, l, o) {
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
  function Qe(n, r, l, o) {
    if (r === null || typeof r > "u" || ne(n, r, l, o)) return !0;
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
  function at(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var ct = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    ct[n] = new at(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    ct[r] = new at(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    ct[n] = new at(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    ct[n] = new at(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    ct[n] = new at(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    ct[n] = new at(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    ct[n] = new at(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    ct[n] = new at(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    ct[n] = new at(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Ut = /[\-:]([a-z])/g;
  function lt(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Ut,
      lt
    );
    ct[r] = new at(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Ut, lt);
    ct[r] = new at(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Ut, lt);
    ct[r] = new at(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    ct[n] = new at(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), ct.xlinkHref = new at("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    ct[n] = new at(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function V(n, r, l, o) {
    var c = ct.hasOwnProperty(r) ? ct[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (Qe(r, l, c, o) && (l = null), o || c === null ? be(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var _e = P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ie = Symbol.for("react.element"), Me = Symbol.for("react.portal"), se = Symbol.for("react.fragment"), Tt = Symbol.for("react.strict_mode"), Ct = Symbol.for("react.profiler"), ft = Symbol.for("react.provider"), zt = Symbol.for("react.context"), Be = Symbol.for("react.forward_ref"), De = Symbol.for("react.suspense"), kt = Symbol.for("react.suspense_list"), Ze = Symbol.for("react.memo"), wt = Symbol.for("react.lazy"), le = Symbol.for("react.offscreen"), ee = Symbol.iterator;
  function Ne(n) {
    return n === null || typeof n != "object" ? null : (n = ee && n[ee] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var oe = Object.assign, _;
  function W(n) {
    if (_ === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      _ = r && r[1] || "";
    }
    return `
` + _ + n;
  }
  var Oe = !1;
  function He(n, r) {
    if (!n || Oe) return "";
    Oe = !0;
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
        } catch (A) {
          var o = A;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (A) {
          o = A;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (A) {
          o = A;
        }
        n();
      }
    } catch (A) {
      if (A && o && typeof A.stack == "string") {
        for (var c = A.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, x = d.length - 1; 1 <= m && 0 <= x && c[m] !== d[x]; ) x--;
        for (; 1 <= m && 0 <= x; m--, x--) if (c[m] !== d[x]) {
          if (m !== 1 || x !== 1)
            do
              if (m--, x--, 0 > x || c[m] !== d[x]) {
                var R = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && R.includes("<anonymous>") && (R = R.replace("<anonymous>", n.displayName)), R;
              }
            while (1 <= m && 0 <= x);
          break;
        }
      }
    } finally {
      Oe = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? W(n) : "";
  }
  function dt(n) {
    switch (n.tag) {
      case 5:
        return W(n.type);
      case 16:
        return W("Lazy");
      case 13:
        return W("Suspense");
      case 19:
        return W("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = He(n.type, !1), n;
      case 11:
        return n = He(n.type.render, !1), n;
      case 1:
        return n = He(n.type, !0), n;
      default:
        return "";
    }
  }
  function pt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case se:
        return "Fragment";
      case Me:
        return "Portal";
      case Ct:
        return "Profiler";
      case Tt:
        return "StrictMode";
      case De:
        return "Suspense";
      case kt:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case zt:
        return (n.displayName || "Context") + ".Consumer";
      case ft:
        return (n._context.displayName || "Context") + ".Provider";
      case Be:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Ze:
        return r = n.displayName || null, r !== null ? r : pt(n.type) || "Memo";
      case wt:
        r = n._payload, n = n._init;
        try {
          return pt(n(r));
        } catch {
        }
    }
    return null;
  }
  function ut(n) {
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
        return pt(r);
      case 8:
        return r === Tt ? "StrictMode" : "Mode";
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
  function vt(n) {
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
  function M(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function pe(n) {
    var r = M(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
  function Ge(n) {
    n._valueTracker || (n._valueTracker = pe(n));
  }
  function yn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = M(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function cn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function Rn(n, r) {
    var l = r.checked;
    return oe({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function wn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = vt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function kn(n, r) {
    r = r.checked, r != null && V(n, "checked", r, !1);
  }
  function Jn(n, r) {
    kn(n, r);
    var l = vt(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, vt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
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
    (r !== "number" || cn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Zn = Array.isArray;
  function _n(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + vt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function $n(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(j(91));
    return oe({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Er(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(j(92));
        if (Zn(l)) {
          if (1 < l.length) throw Error(j(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: vt(l) };
  }
  function Wa(n, r) {
    var l = vt(r.value), o = vt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function zn(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Cr(n) {
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
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Cr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var $a, fi = (function(n) {
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
  function ue(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var je = {
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
  }, yt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(je).forEach(function(n) {
    yt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), je[r] = je[n];
    });
  });
  function $t(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || je.hasOwnProperty(n) && je[n] ? ("" + r).trim() : r + "px";
  }
  function an(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = $t(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var gn = oe({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function fn(n, r) {
    if (r) {
      if (gn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(j(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(j(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(j(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(j(62));
    }
  }
  function er(n, r) {
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
  var ln = null;
  function qt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Kt = null, fa = null, br = null;
  function Ra(n) {
    if (n = Ae(n)) {
      if (typeof Kt != "function") throw Error(j(280));
      var r = n.stateNode;
      r && (r = xn(r), Kt(n.stateNode, n.type, r));
    }
  }
  function Hi(n) {
    fa ? br ? br.push(n) : br = [n] : fa = n;
  }
  function eu() {
    if (fa) {
      var n = fa, r = br;
      if (br = fa = null, Ra(n), r) for (n = 0; n < r.length; n++) Ra(r[n]);
    }
  }
  function tu(n, r) {
    return n(r);
  }
  function pl() {
  }
  var vl = !1;
  function nu(n, r, l) {
    if (vl) return n(r, l);
    vl = !0;
    try {
      return tu(n, r, l);
    } finally {
      vl = !1, (fa !== null || br !== null) && (pl(), eu());
    }
  }
  function _r(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = xn(l);
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
    if (l && typeof l != "function") throw Error(j(231, r, typeof l));
    return l;
  }
  var Dr = !1;
  if (Nt) try {
    var lr = {};
    Object.defineProperty(lr, "passive", { get: function() {
      Dr = !0;
    } }), window.addEventListener("test", lr, lr), window.removeEventListener("test", lr, lr);
  } catch {
    Dr = !1;
  }
  function di(n, r, l, o, c, d, m, x, R) {
    var A = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, A);
    } catch (K) {
      this.onError(K);
    }
  }
  var Qa = !1, pi = null, vi = !1, b = null, Q = { onError: function(n) {
    Qa = !0, pi = n;
  } };
  function ve(n, r, l, o, c, d, m, x, R) {
    Qa = !1, pi = null, di.apply(Q, arguments);
  }
  function Re(n, r, l, o, c, d, m, x, R) {
    if (ve.apply(this, arguments), Qa) {
      if (Qa) {
        var A = pi;
        Qa = !1, pi = null;
      } else throw Error(j(198));
      vi || (vi = !0, b = A);
    }
  }
  function ot(n) {
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
  function tt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function bt(n) {
    if (ot(n) !== n) throw Error(j(188));
  }
  function St(n) {
    var r = n.alternate;
    if (!r) {
      if (r = ot(n), r === null) throw Error(j(188));
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
          if (d === l) return bt(c), n;
          if (d === o) return bt(c), r;
          d = d.sibling;
        }
        throw Error(j(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, x = c.child; x; ) {
          if (x === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (x === o) {
            m = !0, o = c, l = d;
            break;
          }
          x = x.sibling;
        }
        if (!m) {
          for (x = d.child; x; ) {
            if (x === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (x === o) {
              m = !0, o = d, l = c;
              break;
            }
            x = x.sibling;
          }
          if (!m) throw Error(j(189));
        }
      }
      if (l.alternate !== o) throw Error(j(190));
    }
    if (l.tag !== 3) throw Error(j(188));
    return l.stateNode.current === l ? n : r;
  }
  function Dn(n) {
    return n = St(n), n !== null ? un(n) : null;
  }
  function un(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = un(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var dn = H.unstable_scheduleCallback, ur = H.unstable_cancelCallback, Ga = H.unstable_shouldYield, qa = H.unstable_requestPaint, st = H.unstable_now, mt = H.unstable_getCurrentPriorityLevel, Ka = H.unstable_ImmediatePriority, ru = H.unstable_UserBlockingPriority, au = H.unstable_NormalPriority, hl = H.unstable_LowPriority, Gu = H.unstable_IdlePriority, ml = null, $r = null;
  function $o(n) {
    if ($r && typeof $r.onCommitFiberRoot == "function") try {
      $r.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Nr = Math.clz32 ? Math.clz32 : qu, uc = Math.log, oc = Math.LN2;
  function qu(n) {
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
      var x = m & ~c;
      x !== 0 ? o = Xa(x) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && (r & c) === 0 && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if ((o & 4) !== 0 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - Nr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Ku(n, r) {
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
  function iu(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - Nr(d), x = 1 << m, R = c[m];
      R === -1 ? ((x & l) === 0 || (x & o) !== 0) && (c[m] = Ku(x, r)) : R <= r && (n.expiredLanes |= x), d &= ~x;
    }
  }
  function gl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Xu() {
    var n = yl;
    return yl <<= 1, (yl & 4194240) === 0 && (yl = 64), n;
  }
  function Ju(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Pi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Nr(r), n[r] = l;
  }
  function qf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Nr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - Nr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Pt = 0;
  function Zu(n) {
    return n &= -n, 1 < n ? 4 < n ? (n & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var At, Qo, hi, et, eo, or = !1, mi = [], Or = null, yi = null, pn = null, Xt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), Qn = [], Lr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ta(n, r) {
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
        pn = null;
        break;
      case "pointerover":
      case "pointerout":
        Xt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sl.delete(r.pointerId);
    }
  }
  function lu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = Ae(r), r !== null && Qo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Go(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Or = lu(Or, n, r, l, o, c), !0;
      case "dragenter":
        return yi = lu(yi, n, r, l, o, c), !0;
      case "mouseover":
        return pn = lu(pn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Xt.set(d, lu(Xt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, lu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function qo(n) {
    var r = hu(n.target);
    if (r !== null) {
      var l = ot(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = tt(l), r !== null) {
            n.blockedOn = r, eo(n.priority, function() {
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
  function xl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = ro(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        ln = o, l.target.dispatchEvent(o), ln = null;
      } else return r = Ae(l), r !== null && Qo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function uu(n, r, l) {
    xl(n) && l.delete(r);
  }
  function Kf() {
    or = !1, Or !== null && xl(Or) && (Or = null), yi !== null && xl(yi) && (yi = null), pn !== null && xl(pn) && (pn = null), Xt.forEach(uu), Sl.forEach(uu);
  }
  function wa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, or || (or = !0, H.unstable_scheduleCallback(H.unstable_NormalPriority, Kf)));
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
    for (Or !== null && wa(Or, n), yi !== null && wa(yi, n), pn !== null && wa(pn, n), Xt.forEach(r), Sl.forEach(r), l = 0; l < Qn.length; l++) o = Qn[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < Qn.length && (l = Qn[0], l.blockedOn === null); ) qo(l), l.blockedOn === null && Qn.shift();
  }
  var gi = _e.ReactCurrentBatchConfig, ka = !0;
  function to(n, r, l, o) {
    var c = Pt, d = gi.transition;
    gi.transition = null;
    try {
      Pt = 1, El(n, r, l, o);
    } finally {
      Pt = c, gi.transition = d;
    }
  }
  function no(n, r, l, o) {
    var c = Pt, d = gi.transition;
    gi.transition = null;
    try {
      Pt = 4, El(n, r, l, o);
    } finally {
      Pt = c, gi.transition = d;
    }
  }
  function El(n, r, l, o) {
    if (ka) {
      var c = ro(n, r, l, o);
      if (c === null) xc(n, r, o, ou, l), Ta(n, o);
      else if (Go(c, n, r, l, o)) o.stopPropagation();
      else if (Ta(n, o), r & 4 && -1 < Lr.indexOf(n)) {
        for (; c !== null; ) {
          var d = Ae(c);
          if (d !== null && At(d), d = ro(n, r, l, o), d === null && xc(n, r, o, ou, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else xc(n, r, o, null, l);
    }
  }
  var ou = null;
  function ro(n, r, l, o) {
    if (ou = null, n = qt(o), n = hu(n), n !== null) if (r = ot(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = tt(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return ou = n, null;
  }
  function ao(n) {
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
        switch (mt()) {
          case Ka:
            return 1;
          case ru:
            return 4;
          case au:
          case hl:
            return 16;
          case Gu:
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
  function B(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function te() {
    return !0;
  }
  function Pe() {
    return !1;
  }
  function fe(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var x in n) n.hasOwnProperty(x) && (l = n[x], this[x] = l ? l(d) : d[x]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? te : Pe, this.isPropagationStopped = Pe, this;
    }
    return oe(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = te);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = te);
    }, persist: function() {
    }, isPersistent: te }), r;
  }
  var We = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Rt = fe(We), Ft = oe({}, We, { view: 0, detail: 0 }), on = fe(Ft), Jt, gt, Zt, Sn = oe({}, Ft, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: td, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Zt && (Zt && n.type === "mousemove" ? (Jt = n.screenX - Zt.screenX, gt = n.screenY - Zt.screenY) : gt = Jt = 0, Zt = n), Jt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : gt;
  } }), Cl = fe(Sn), Ko = oe({}, Sn, { dataTransfer: 0 }), Bi = fe(Ko), Xo = oe({}, Ft, { relatedTarget: 0 }), su = fe(Xo), Xf = oe({}, We, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), sc = fe(Xf), Jf = oe({}, We, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), av = fe(Jf), Zf = oe({}, We, { data: 0 }), ed = fe(Zf), iv = {
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
  }, lv = {
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
  }, Zm = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Zm[n]) ? !!r[n] : !1;
  }
  function td() {
    return Ii;
  }
  var nd = oe({}, Ft, { key: function(n) {
    if (n.key) {
      var r = iv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = B(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? lv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: td, charCode: function(n) {
    return n.type === "keypress" ? B(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? B(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), rd = fe(nd), ad = oe({}, Sn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), uv = fe(ad), cc = oe({}, Ft, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: td }), ov = fe(cc), Qr = oe({}, We, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = fe(Qr), An = oe({}, Sn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Wi = fe(An), id = [9, 13, 27, 32], io = Nt && "CompositionEvent" in window, Jo = null;
  Nt && "documentMode" in document && (Jo = document.documentMode);
  var Zo = Nt && "TextEvent" in window && !Jo, sv = Nt && (!io || Jo && 8 < Jo && 11 >= Jo), cv = " ", fc = !1;
  function fv(n, r) {
    switch (n) {
      case "keyup":
        return id.indexOf(r.keyCode) !== -1;
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
  function dv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var lo = !1;
  function pv(n, r) {
    switch (n) {
      case "compositionend":
        return dv(r);
      case "keypress":
        return r.which !== 32 ? null : (fc = !0, cv);
      case "textInput":
        return n = r.data, n === cv && fc ? null : n;
      default:
        return null;
    }
  }
  function ey(n, r) {
    if (lo) return n === "compositionend" || !io && fv(n, r) ? (n = z(), C = h = ei = null, lo = !1, n) : null;
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
        return sv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ty = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function vv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ty[n.type] : r === "textarea";
  }
  function ld(n, r, l, o) {
    Hi(o), r = is(r, "onChange"), 0 < r.length && (l = new Rt("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, cu = null;
  function hv(n) {
    pu(n, 0);
  }
  function es(n) {
    var r = ni(n);
    if (yn(r)) return n;
  }
  function ny(n, r) {
    if (n === "change") return r;
  }
  var mv = !1;
  if (Nt) {
    var ud;
    if (Nt) {
      var od = "oninput" in document;
      if (!od) {
        var yv = document.createElement("div");
        yv.setAttribute("oninput", "return;"), od = typeof yv.oninput == "function";
      }
      ud = od;
    } else ud = !1;
    mv = ud && (!document.documentMode || 9 < document.documentMode);
  }
  function gv() {
    Si && (Si.detachEvent("onpropertychange", Sv), cu = Si = null);
  }
  function Sv(n) {
    if (n.propertyName === "value" && es(cu)) {
      var r = [];
      ld(r, cu, n, qt(n)), nu(hv, r);
    }
  }
  function ry(n, r, l) {
    n === "focusin" ? (gv(), Si = r, cu = l, Si.attachEvent("onpropertychange", Sv)) : n === "focusout" && gv();
  }
  function xv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return es(cu);
  }
  function ay(n, r) {
    if (n === "click") return es(r);
  }
  function Ev(n, r) {
    if (n === "input" || n === "change") return es(r);
  }
  function iy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : iy;
  function ts(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!re.call(r, c) || !ti(n[c], r[c])) return !1;
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
  function bl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? bl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ns() {
    for (var n = window, r = cn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = cn(n.document);
    }
    return r;
  }
  function pc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function uo(n) {
    var r = ns(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && bl(l.ownerDocument.documentElement, l)) {
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
  var ly = Nt && "documentMode" in document && 11 >= document.documentMode, oo = null, sd = null, rs = null, cd = !1;
  function fd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    cd || oo == null || oo !== cn(o) || (o = oo, "selectionStart" in o && pc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), rs && ts(rs, o) || (rs = o, o = is(sd, "onSelect"), 0 < o.length && (r = new Rt("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = oo)));
  }
  function vc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var fu = { animationend: vc("Animation", "AnimationEnd"), animationiteration: vc("Animation", "AnimationIteration"), animationstart: vc("Animation", "AnimationStart"), transitionend: vc("Transition", "TransitionEnd") }, sr = {}, dd = {};
  Nt && (dd = document.createElement("div").style, "AnimationEvent" in window || (delete fu.animationend.animation, delete fu.animationiteration.animation, delete fu.animationstart.animation), "TransitionEvent" in window || delete fu.transitionend.transition);
  function hc(n) {
    if (sr[n]) return sr[n];
    if (!fu[n]) return n;
    var r = fu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in dd) return sr[n] = r[l];
    return n;
  }
  var bv = hc("animationend"), Rv = hc("animationiteration"), Tv = hc("animationstart"), wv = hc("transitionend"), pd = /* @__PURE__ */ new Map(), mc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function _a(n, r) {
    pd.set(n, r), Ye(r, [n]);
  }
  for (var vd = 0; vd < mc.length; vd++) {
    var du = mc[vd], uy = du.toLowerCase(), oy = du[0].toUpperCase() + du.slice(1);
    _a(uy, "on" + oy);
  }
  _a(bv, "onAnimationEnd"), _a(Rv, "onAnimationIteration"), _a(Tv, "onAnimationStart"), _a("dblclick", "onDoubleClick"), _a("focusin", "onFocus"), _a("focusout", "onBlur"), _a(wv, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), Ye("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ye("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ye("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ye("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ye("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ye("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var as = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), hd = new Set("cancel close invalid load scroll toggle".split(" ").concat(as));
  function yc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, Re(o, r, void 0, n), n.currentTarget = null;
  }
  function pu(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var x = o[m], R = x.instance, A = x.currentTarget;
          if (x = x.listener, R !== d && c.isPropagationStopped()) break e;
          yc(c, x, A), d = R;
        }
        else for (m = 0; m < o.length; m++) {
          if (x = o[m], R = x.instance, A = x.currentTarget, x = x.listener, R !== d && c.isPropagationStopped()) break e;
          yc(c, x, A), d = R;
        }
      }
    }
    if (vi) throw n = b, vi = !1, b = null, n;
  }
  function Qt(n, r) {
    var l = r[os];
    l === void 0 && (l = r[os] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (kv(r, n, 2, !1), l.add(o));
  }
  function gc(n, r, l) {
    var o = 0;
    r && (o |= 4), kv(l, n, o, r);
  }
  var Sc = "_reactListening" + Math.random().toString(36).slice(2);
  function so(n) {
    if (!n[Sc]) {
      n[Sc] = !0, ye.forEach(function(l) {
        l !== "selectionchange" && (hd.has(l) || gc(l, !1, n), gc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Sc] || (r[Sc] = !0, gc("selectionchange", !1, r));
    }
  }
  function kv(n, r, l, o) {
    switch (ao(r)) {
      case 1:
        var c = to;
        break;
      case 4:
        c = no;
        break;
      default:
        c = El;
    }
    l = c.bind(null, r, l, n), c = void 0, !Dr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function xc(n, r, l, o, c) {
    var d = o;
    if ((r & 1) === 0 && (r & 2) === 0 && o !== null) e: for (; ; ) {
      if (o === null) return;
      var m = o.tag;
      if (m === 3 || m === 4) {
        var x = o.stateNode.containerInfo;
        if (x === c || x.nodeType === 8 && x.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var R = m.tag;
          if ((R === 3 || R === 4) && (R = m.stateNode.containerInfo, R === c || R.nodeType === 8 && R.parentNode === c)) return;
          m = m.return;
        }
        for (; x !== null; ) {
          if (m = hu(x), m === null) return;
          if (R = m.tag, R === 5 || R === 6) {
            o = d = m;
            continue e;
          }
          x = x.parentNode;
        }
      }
      o = o.return;
    }
    nu(function() {
      var A = d, K = qt(l), J = [];
      e: {
        var q = pd.get(n);
        if (q !== void 0) {
          var Se = Rt, Te = n;
          switch (n) {
            case "keypress":
              if (B(l) === 0) break e;
            case "keydown":
            case "keyup":
              Se = rd;
              break;
            case "focusin":
              Te = "focus", Se = su;
              break;
            case "focusout":
              Te = "blur", Se = su;
              break;
            case "beforeblur":
            case "afterblur":
              Se = su;
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
              Se = Cl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Se = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Se = ov;
              break;
            case bv:
            case Rv:
            case Tv:
              Se = sc;
              break;
            case wv:
              Se = Yi;
              break;
            case "scroll":
              Se = on;
              break;
            case "wheel":
              Se = Wi;
              break;
            case "copy":
            case "cut":
            case "paste":
              Se = av;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Se = uv;
          }
          var Le = (r & 4) !== 0, jn = !Le && n === "scroll", D = Le ? q !== null ? q + "Capture" : null : q;
          Le = [];
          for (var w = A, L; w !== null; ) {
            L = w;
            var X = L.stateNode;
            if (L.tag === 5 && X !== null && (L = X, D !== null && (X = _r(w, D), X != null && Le.push(co(w, X, L)))), jn) break;
            w = w.return;
          }
          0 < Le.length && (q = new Se(q, Te, null, l, K), J.push({ event: q, listeners: Le }));
        }
      }
      if ((r & 7) === 0) {
        e: {
          if (q = n === "mouseover" || n === "pointerover", Se = n === "mouseout" || n === "pointerout", q && l !== ln && (Te = l.relatedTarget || l.fromElement) && (hu(Te) || Te[$i])) break e;
          if ((Se || q) && (q = K.window === K ? K : (q = K.ownerDocument) ? q.defaultView || q.parentWindow : window, Se ? (Te = l.relatedTarget || l.toElement, Se = A, Te = Te ? hu(Te) : null, Te !== null && (jn = ot(Te), Te !== jn || Te.tag !== 5 && Te.tag !== 6) && (Te = null)) : (Se = null, Te = A), Se !== Te)) {
            if (Le = Cl, X = "onMouseLeave", D = "onMouseEnter", w = "mouse", (n === "pointerout" || n === "pointerover") && (Le = uv, X = "onPointerLeave", D = "onPointerEnter", w = "pointer"), jn = Se == null ? q : ni(Se), L = Te == null ? q : ni(Te), q = new Le(X, w + "leave", Se, l, K), q.target = jn, q.relatedTarget = L, X = null, hu(K) === A && (Le = new Le(D, w + "enter", Te, l, K), Le.target = L, Le.relatedTarget = jn, X = Le), jn = X, Se && Te) t: {
              for (Le = Se, D = Te, w = 0, L = Le; L; L = Rl(L)) w++;
              for (L = 0, X = D; X; X = Rl(X)) L++;
              for (; 0 < w - L; ) Le = Rl(Le), w--;
              for (; 0 < L - w; ) D = Rl(D), L--;
              for (; w--; ) {
                if (Le === D || D !== null && Le === D.alternate) break t;
                Le = Rl(Le), D = Rl(D);
              }
              Le = null;
            }
            else Le = null;
            Se !== null && _v(J, q, Se, Le, !1), Te !== null && jn !== null && _v(J, jn, Te, Le, !0);
          }
        }
        e: {
          if (q = A ? ni(A) : window, Se = q.nodeName && q.nodeName.toLowerCase(), Se === "select" || Se === "input" && q.type === "file") var we = ny;
          else if (vv(q)) if (mv) we = Ev;
          else {
            we = xv;
            var Ie = ry;
          }
          else (Se = q.nodeName) && Se.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (we = ay);
          if (we && (we = we(n, A))) {
            ld(J, we, l, K);
            break e;
          }
          Ie && Ie(n, q, A), n === "focusout" && (Ie = q._wrapperState) && Ie.controlled && q.type === "number" && sa(q, "number", q.value);
        }
        switch (Ie = A ? ni(A) : window, n) {
          case "focusin":
            (vv(Ie) || Ie.contentEditable === "true") && (oo = Ie, sd = A, rs = null);
            break;
          case "focusout":
            rs = sd = oo = null;
            break;
          case "mousedown":
            cd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            cd = !1, fd(J, l, K);
            break;
          case "selectionchange":
            if (ly) break;
          case "keydown":
          case "keyup":
            fd(J, l, K);
        }
        var $e;
        if (io) e: {
          switch (n) {
            case "compositionstart":
              var Xe = "onCompositionStart";
              break e;
            case "compositionend":
              Xe = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Xe = "onCompositionUpdate";
              break e;
          }
          Xe = void 0;
        }
        else lo ? fv(n, l) && (Xe = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Xe = "onCompositionStart");
        Xe && (sv && l.locale !== "ko" && (lo || Xe !== "onCompositionStart" ? Xe === "onCompositionEnd" && lo && ($e = z()) : (ei = K, h = "value" in ei ? ei.value : ei.textContent, lo = !0)), Ie = is(A, Xe), 0 < Ie.length && (Xe = new ed(Xe, n, null, l, K), J.push({ event: Xe, listeners: Ie }), $e ? Xe.data = $e : ($e = dv(l), $e !== null && (Xe.data = $e)))), ($e = Zo ? pv(n, l) : ey(n, l)) && (A = is(A, "onBeforeInput"), 0 < A.length && (K = new ed("onBeforeInput", "beforeinput", null, l, K), J.push({ event: K, listeners: A }), K.data = $e));
      }
      pu(J, r);
    });
  }
  function co(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function is(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = _r(n, l), d != null && o.unshift(co(n, d, c)), d = _r(n, r), d != null && o.push(co(n, d, c))), n = n.return;
    }
    return o;
  }
  function Rl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function _v(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var x = l, R = x.alternate, A = x.stateNode;
      if (R !== null && R === o) break;
      x.tag === 5 && A !== null && (x = A, c ? (R = _r(l, d), R != null && m.unshift(co(l, R, x))) : c || (R = _r(l, d), R != null && m.push(co(l, R, x)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var Dv = /\r\n?/g, sy = /\u0000|\uFFFD/g;
  function Nv(n) {
    return (typeof n == "string" ? n : "" + n).replace(Dv, `
`).replace(sy, "");
  }
  function Ec(n, r, l) {
    if (r = Nv(r), Nv(n) !== r && l) throw Error(j(425));
  }
  function Tl() {
  }
  var ls = null, vu = null;
  function Cc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var bc = typeof setTimeout == "function" ? setTimeout : void 0, md = typeof clearTimeout == "function" ? clearTimeout : void 0, Ov = typeof Promise == "function" ? Promise : void 0, fo = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ov < "u" ? function(n) {
    return Ov.resolve(null).then(n).catch(Rc);
  } : bc;
  function Rc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function po(n, r) {
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
  var wl = Math.random().toString(36).slice(2), Ei = "__reactFiber$" + wl, us = "__reactProps$" + wl, $i = "__reactContainer$" + wl, os = "__reactEvents$" + wl, vo = "__reactListeners$" + wl, cy = "__reactHandles$" + wl;
  function hu(n) {
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
  function Ae(n) {
    return n = n[Ei] || n[$i], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(j(33));
  }
  function xn(n) {
    return n[us] || null;
  }
  var Ot = [], Da = -1;
  function Na(n) {
    return { current: n };
  }
  function sn(n) {
    0 > Da || (n.current = Ot[Da], Ot[Da] = null, Da--);
  }
  function ze(n, r) {
    Da++, Ot[Da] = n.current, n.current = r;
  }
  var Rr = {}, Tn = Na(Rr), Gn = Na(!1), Gr = Rr;
  function qr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Rr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function Fn(n) {
    return n = n.childContextTypes, n != null;
  }
  function ho() {
    sn(Gn), sn(Tn);
  }
  function Mv(n, r, l) {
    if (Tn.current !== Rr) throw Error(j(168));
    ze(Tn, r), ze(Gn, l);
  }
  function ss(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(j(108, ut(n) || "Unknown", c));
    return oe({}, l, o);
  }
  function tr(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Rr, Gr = Tn.current, ze(Tn, n), ze(Gn, Gn.current), !0;
  }
  function Tc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(j(169));
    l ? (n = ss(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, sn(Gn), sn(Tn), ze(Tn, n)) : sn(Gn), ze(Gn, l);
  }
  var Ci = null, mo = !1, Qi = !1;
  function wc(n) {
    Ci === null ? Ci = [n] : Ci.push(n);
  }
  function kl(n) {
    mo = !0, wc(n);
  }
  function bi() {
    if (!Qi && Ci !== null) {
      Qi = !0;
      var n = 0, r = Pt;
      try {
        var l = Ci;
        for (Pt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ci = null, mo = !1;
      } catch (c) {
        throw Ci !== null && (Ci = Ci.slice(n + 1)), dn(Ka, bi), c;
      } finally {
        Pt = r, Qi = !1;
      }
    }
    return null;
  }
  var _l = [], Dl = 0, Nl = null, Gi = 0, Hn = [], Oa = 0, pa = null, Ri = 1, Ti = "";
  function mu(n, r) {
    _l[Dl++] = Gi, _l[Dl++] = Nl, Nl = n, Gi = r;
  }
  function jv(n, r, l) {
    Hn[Oa++] = Ri, Hn[Oa++] = Ti, Hn[Oa++] = pa, pa = n;
    var o = Ri;
    n = Ti;
    var c = 32 - Nr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Nr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, Ri = 1 << 32 - Nr(r) + c | l << c | o, Ti = d + n;
    } else Ri = 1 << d | l << c | o, Ti = n;
  }
  function kc(n) {
    n.return !== null && (mu(n, 1), jv(n, 1, 0));
  }
  function _c(n) {
    for (; n === Nl; ) Nl = _l[--Dl], _l[Dl] = null, Gi = _l[--Dl], _l[Dl] = null;
    for (; n === pa; ) pa = Hn[--Oa], Hn[Oa] = null, Ti = Hn[--Oa], Hn[Oa] = null, Ri = Hn[--Oa], Hn[Oa] = null;
  }
  var Kr = null, Xr = null, hn = !1, La = null;
  function yd(n, r) {
    var l = Aa(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Uv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = xi(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: Ri, overflow: Ti } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Aa(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function gd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Sd(n) {
    if (hn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!Uv(n, r)) {
          if (gd(n)) throw Error(j(418));
          r = xi(l.nextSibling);
          var o = Kr;
          r && Uv(n, r) ? yd(o, l) : (n.flags = n.flags & -4097 | 2, hn = !1, Kr = n);
        }
      } else {
        if (gd(n)) throw Error(j(418));
        n.flags = n.flags & -4097 | 2, hn = !1, Kr = n;
      }
    }
  }
  function qn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Kr = n;
  }
  function Dc(n) {
    if (n !== Kr) return !1;
    if (!hn) return qn(n), hn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Cc(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (gd(n)) throw cs(), Error(j(418));
      for (; r; ) yd(n, r), r = xi(r.nextSibling);
    }
    if (qn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(j(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Xr = xi(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Xr = null;
      }
    } else Xr = Kr ? xi(n.stateNode.nextSibling) : null;
    return !0;
  }
  function cs() {
    for (var n = Xr; n; ) n = xi(n.nextSibling);
  }
  function Ol() {
    Xr = Kr = null, hn = !1;
  }
  function qi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var fy = _e.ReactCurrentBatchConfig;
  function yu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(j(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(j(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var x = c.refs;
          m === null ? delete x[d] : x[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(j(284));
      if (!l._owner) throw Error(j(290, n));
    }
    return n;
  }
  function Nc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(j(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function zv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function gu(n) {
    function r(D, w) {
      if (n) {
        var L = D.deletions;
        L === null ? (D.deletions = [w], D.flags |= 16) : L.push(w);
      }
    }
    function l(D, w) {
      if (!n) return null;
      for (; w !== null; ) r(D, w), w = w.sibling;
      return null;
    }
    function o(D, w) {
      for (D = /* @__PURE__ */ new Map(); w !== null; ) w.key !== null ? D.set(w.key, w) : D.set(w.index, w), w = w.sibling;
      return D;
    }
    function c(D, w) {
      return D = Hl(D, w), D.index = 0, D.sibling = null, D;
    }
    function d(D, w, L) {
      return D.index = L, n ? (L = D.alternate, L !== null ? (L = L.index, L < w ? (D.flags |= 2, w) : L) : (D.flags |= 2, w)) : (D.flags |= 1048576, w);
    }
    function m(D) {
      return n && D.alternate === null && (D.flags |= 2), D;
    }
    function x(D, w, L, X) {
      return w === null || w.tag !== 6 ? (w = Kd(L, D.mode, X), w.return = D, w) : (w = c(w, L), w.return = D, w);
    }
    function R(D, w, L, X) {
      var we = L.type;
      return we === se ? K(D, w, L.props.children, X, L.key) : w !== null && (w.elementType === we || typeof we == "object" && we !== null && we.$$typeof === wt && zv(we) === w.type) ? (X = c(w, L.props), X.ref = yu(D, w, L), X.return = D, X) : (X = Ps(L.type, L.key, L.props, null, D.mode, X), X.ref = yu(D, w, L), X.return = D, X);
    }
    function A(D, w, L, X) {
      return w === null || w.tag !== 4 || w.stateNode.containerInfo !== L.containerInfo || w.stateNode.implementation !== L.implementation ? (w = cf(L, D.mode, X), w.return = D, w) : (w = c(w, L.children || []), w.return = D, w);
    }
    function K(D, w, L, X, we) {
      return w === null || w.tag !== 7 ? (w = tl(L, D.mode, X, we), w.return = D, w) : (w = c(w, L), w.return = D, w);
    }
    function J(D, w, L) {
      if (typeof w == "string" && w !== "" || typeof w == "number") return w = Kd("" + w, D.mode, L), w.return = D, w;
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case ie:
            return L = Ps(w.type, w.key, w.props, null, D.mode, L), L.ref = yu(D, null, w), L.return = D, L;
          case Me:
            return w = cf(w, D.mode, L), w.return = D, w;
          case wt:
            var X = w._init;
            return J(D, X(w._payload), L);
        }
        if (Zn(w) || Ne(w)) return w = tl(w, D.mode, L, null), w.return = D, w;
        Nc(D, w);
      }
      return null;
    }
    function q(D, w, L, X) {
      var we = w !== null ? w.key : null;
      if (typeof L == "string" && L !== "" || typeof L == "number") return we !== null ? null : x(D, w, "" + L, X);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ie:
            return L.key === we ? R(D, w, L, X) : null;
          case Me:
            return L.key === we ? A(D, w, L, X) : null;
          case wt:
            return we = L._init, q(
              D,
              w,
              we(L._payload),
              X
            );
        }
        if (Zn(L) || Ne(L)) return we !== null ? null : K(D, w, L, X, null);
        Nc(D, L);
      }
      return null;
    }
    function Se(D, w, L, X, we) {
      if (typeof X == "string" && X !== "" || typeof X == "number") return D = D.get(L) || null, x(w, D, "" + X, we);
      if (typeof X == "object" && X !== null) {
        switch (X.$$typeof) {
          case ie:
            return D = D.get(X.key === null ? L : X.key) || null, R(w, D, X, we);
          case Me:
            return D = D.get(X.key === null ? L : X.key) || null, A(w, D, X, we);
          case wt:
            var Ie = X._init;
            return Se(D, w, L, Ie(X._payload), we);
        }
        if (Zn(X) || Ne(X)) return D = D.get(L) || null, K(w, D, X, we, null);
        Nc(w, X);
      }
      return null;
    }
    function Te(D, w, L, X) {
      for (var we = null, Ie = null, $e = w, Xe = w = 0, ar = null; $e !== null && Xe < L.length; Xe++) {
        $e.index > Xe ? (ar = $e, $e = null) : ar = $e.sibling;
        var It = q(D, $e, L[Xe], X);
        if (It === null) {
          $e === null && ($e = ar);
          break;
        }
        n && $e && It.alternate === null && r(D, $e), w = d(It, w, Xe), Ie === null ? we = It : Ie.sibling = It, Ie = It, $e = ar;
      }
      if (Xe === L.length) return l(D, $e), hn && mu(D, Xe), we;
      if ($e === null) {
        for (; Xe < L.length; Xe++) $e = J(D, L[Xe], X), $e !== null && (w = d($e, w, Xe), Ie === null ? we = $e : Ie.sibling = $e, Ie = $e);
        return hn && mu(D, Xe), we;
      }
      for ($e = o(D, $e); Xe < L.length; Xe++) ar = Se($e, D, Xe, L[Xe], X), ar !== null && (n && ar.alternate !== null && $e.delete(ar.key === null ? Xe : ar.key), w = d(ar, w, Xe), Ie === null ? we = ar : Ie.sibling = ar, Ie = ar);
      return n && $e.forEach(function(Bl) {
        return r(D, Bl);
      }), hn && mu(D, Xe), we;
    }
    function Le(D, w, L, X) {
      var we = Ne(L);
      if (typeof we != "function") throw Error(j(150));
      if (L = we.call(L), L == null) throw Error(j(151));
      for (var Ie = we = null, $e = w, Xe = w = 0, ar = null, It = L.next(); $e !== null && !It.done; Xe++, It = L.next()) {
        $e.index > Xe ? (ar = $e, $e = null) : ar = $e.sibling;
        var Bl = q(D, $e, It.value, X);
        if (Bl === null) {
          $e === null && ($e = ar);
          break;
        }
        n && $e && Bl.alternate === null && r(D, $e), w = d(Bl, w, Xe), Ie === null ? we = Bl : Ie.sibling = Bl, Ie = Bl, $e = ar;
      }
      if (It.done) return l(
        D,
        $e
      ), hn && mu(D, Xe), we;
      if ($e === null) {
        for (; !It.done; Xe++, It = L.next()) It = J(D, It.value, X), It !== null && (w = d(It, w, Xe), Ie === null ? we = It : Ie.sibling = It, Ie = It);
        return hn && mu(D, Xe), we;
      }
      for ($e = o(D, $e); !It.done; Xe++, It = L.next()) It = Se($e, D, Xe, It.value, X), It !== null && (n && It.alternate !== null && $e.delete(It.key === null ? Xe : It.key), w = d(It, w, Xe), Ie === null ? we = It : Ie.sibling = It, Ie = It);
      return n && $e.forEach(function(gh) {
        return r(D, gh);
      }), hn && mu(D, Xe), we;
    }
    function jn(D, w, L, X) {
      if (typeof L == "object" && L !== null && L.type === se && L.key === null && (L = L.props.children), typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ie:
            e: {
              for (var we = L.key, Ie = w; Ie !== null; ) {
                if (Ie.key === we) {
                  if (we = L.type, we === se) {
                    if (Ie.tag === 7) {
                      l(D, Ie.sibling), w = c(Ie, L.props.children), w.return = D, D = w;
                      break e;
                    }
                  } else if (Ie.elementType === we || typeof we == "object" && we !== null && we.$$typeof === wt && zv(we) === Ie.type) {
                    l(D, Ie.sibling), w = c(Ie, L.props), w.ref = yu(D, Ie, L), w.return = D, D = w;
                    break e;
                  }
                  l(D, Ie);
                  break;
                } else r(D, Ie);
                Ie = Ie.sibling;
              }
              L.type === se ? (w = tl(L.props.children, D.mode, X, L.key), w.return = D, D = w) : (X = Ps(L.type, L.key, L.props, null, D.mode, X), X.ref = yu(D, w, L), X.return = D, D = X);
            }
            return m(D);
          case Me:
            e: {
              for (Ie = L.key; w !== null; ) {
                if (w.key === Ie) if (w.tag === 4 && w.stateNode.containerInfo === L.containerInfo && w.stateNode.implementation === L.implementation) {
                  l(D, w.sibling), w = c(w, L.children || []), w.return = D, D = w;
                  break e;
                } else {
                  l(D, w);
                  break;
                }
                else r(D, w);
                w = w.sibling;
              }
              w = cf(L, D.mode, X), w.return = D, D = w;
            }
            return m(D);
          case wt:
            return Ie = L._init, jn(D, w, Ie(L._payload), X);
        }
        if (Zn(L)) return Te(D, w, L, X);
        if (Ne(L)) return Le(D, w, L, X);
        Nc(D, L);
      }
      return typeof L == "string" && L !== "" || typeof L == "number" ? (L = "" + L, w !== null && w.tag === 6 ? (l(D, w.sibling), w = c(w, L), w.return = D, D = w) : (l(D, w), w = Kd(L, D.mode, X), w.return = D, D = w), m(D)) : l(D, w);
    }
    return jn;
  }
  var Nn = gu(!0), he = gu(!1), va = Na(null), Jr = null, yo = null, xd = null;
  function Ed() {
    xd = yo = Jr = null;
  }
  function Cd(n) {
    var r = va.current;
    sn(va), n._currentValue = r;
  }
  function bd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function En(n, r) {
    Jr = n, xd = yo = null, n = n.dependencies, n !== null && n.firstContext !== null && ((n.lanes & r) !== 0 && (Vn = !0), n.firstContext = null);
  }
  function Ma(n) {
    var r = n._currentValue;
    if (xd !== n) if (n = { context: n, memoizedValue: r, next: null }, yo === null) {
      if (Jr === null) throw Error(j(308));
      yo = n, Jr.dependencies = { lanes: 0, firstContext: n };
    } else yo = yo.next = n;
    return r;
  }
  var Su = null;
  function Rd(n) {
    Su === null ? Su = [n] : Su.push(n);
  }
  function Td(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Rd(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ha(n, o);
  }
  function ha(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ma = !1;
  function wd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Av(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (Lt & 2) !== 0) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Rd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
  }
  function Oc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function Fv(n, r) {
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
  function fs(n, r, l, o) {
    var c = n.updateQueue;
    ma = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, x = c.shared.pending;
    if (x !== null) {
      c.shared.pending = null;
      var R = x, A = R.next;
      R.next = null, m === null ? d = A : m.next = A, m = R;
      var K = n.alternate;
      K !== null && (K = K.updateQueue, x = K.lastBaseUpdate, x !== m && (x === null ? K.firstBaseUpdate = A : x.next = A, K.lastBaseUpdate = R));
    }
    if (d !== null) {
      var J = c.baseState;
      m = 0, K = A = R = null, x = d;
      do {
        var q = x.lane, Se = x.eventTime;
        if ((o & q) === q) {
          K !== null && (K = K.next = {
            eventTime: Se,
            lane: 0,
            tag: x.tag,
            payload: x.payload,
            callback: x.callback,
            next: null
          });
          e: {
            var Te = n, Le = x;
            switch (q = r, Se = l, Le.tag) {
              case 1:
                if (Te = Le.payload, typeof Te == "function") {
                  J = Te.call(Se, J, q);
                  break e;
                }
                J = Te;
                break e;
              case 3:
                Te.flags = Te.flags & -65537 | 128;
              case 0:
                if (Te = Le.payload, q = typeof Te == "function" ? Te.call(Se, J, q) : Te, q == null) break e;
                J = oe({}, J, q);
                break e;
              case 2:
                ma = !0;
            }
          }
          x.callback !== null && x.lane !== 0 && (n.flags |= 64, q = c.effects, q === null ? c.effects = [x] : q.push(x));
        } else Se = { eventTime: Se, lane: q, tag: x.tag, payload: x.payload, callback: x.callback, next: null }, K === null ? (A = K = Se, R = J) : K = K.next = Se, m |= q;
        if (x = x.next, x === null) {
          if (x = c.shared.pending, x === null) break;
          q = x, x = q.next, q.next = null, c.lastBaseUpdate = q, c.shared.pending = null;
        }
      } while (!0);
      if (K === null && (R = J), c.baseState = R, c.firstBaseUpdate = A, c.lastBaseUpdate = K, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Ni |= m, n.lanes = m, n.memoizedState = J;
    }
  }
  function kd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(j(191, c));
        c.call(o);
      }
    }
  }
  var ds = {}, wi = Na(ds), ps = Na(ds), vs = Na(ds);
  function xu(n) {
    if (n === ds) throw Error(j(174));
    return n;
  }
  function _d(n, r) {
    switch (ze(vs, r), ze(ps, n), ze(wi, ds), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    sn(wi), ze(wi, r);
  }
  function Eu() {
    sn(wi), sn(ps), sn(vs);
  }
  function Hv(n) {
    xu(vs.current);
    var r = xu(wi.current), l = ca(r, n.type);
    r !== l && (ze(ps, n), ze(wi, l));
  }
  function Lc(n) {
    ps.current === n && (sn(wi), sn(ps));
  }
  var Cn = Na(0);
  function Mc(n) {
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
  var hs = [];
  function Fe() {
    for (var n = 0; n < hs.length; n++) hs[n]._workInProgressVersionPrimary = null;
    hs.length = 0;
  }
  var xt = _e.ReactCurrentDispatcher, Vt = _e.ReactCurrentBatchConfig, en = 0, Bt = null, Pn = null, nr = null, jc = !1, ms = !1, Cu = 0, G = 0;
  function Ht() {
    throw Error(j(321));
  }
  function qe(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, o, c, d) {
    if (en = d, Bt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, xt.current = n === null || n.memoizedState === null ? qc : Cs, n = l(o, c), ms) {
      d = 0;
      do {
        if (ms = !1, Cu = 0, 25 <= d) throw Error(j(301));
        d += 1, nr = Pn = null, r.updateQueue = null, xt.current = Kc, n = l(o, c);
      } while (ms);
    }
    if (xt.current = ku, r = Pn !== null && Pn.next !== null, en = 0, nr = Pn = Bt = null, jc = !1, r) throw Error(j(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function Tr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return nr === null ? Bt.memoizedState = nr = n : nr = nr.next = n, nr;
  }
  function On() {
    if (Pn === null) {
      var n = Bt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Pn.next;
    var r = nr === null ? Bt.memoizedState : nr.next;
    if (r !== null) nr = r, Pn = n;
    else {
      if (n === null) throw Error(j(310));
      Pn = n, n = { memoizedState: Pn.memoizedState, baseState: Pn.baseState, baseQueue: Pn.baseQueue, queue: Pn.queue, next: null }, nr === null ? Bt.memoizedState = nr = n : nr = nr.next = n;
    }
    return nr;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function jl(n) {
    var r = On(), l = r.queue;
    if (l === null) throw Error(j(311));
    l.lastRenderedReducer = n;
    var o = Pn, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var x = m = null, R = null, A = d;
      do {
        var K = A.lane;
        if ((en & K) === K) R !== null && (R = R.next = { lane: 0, action: A.action, hasEagerState: A.hasEagerState, eagerState: A.eagerState, next: null }), o = A.hasEagerState ? A.eagerState : n(o, A.action);
        else {
          var J = {
            lane: K,
            action: A.action,
            hasEagerState: A.hasEagerState,
            eagerState: A.eagerState,
            next: null
          };
          R === null ? (x = R = J, m = o) : R = R.next = J, Bt.lanes |= K, Ni |= K;
        }
        A = A.next;
      } while (A !== null && A !== d);
      R === null ? m = o : R.next = x, ti(o, r.memoizedState) || (Vn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = R, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Bt.lanes |= d, Ni |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function bu(n) {
    var r = On(), l = r.queue;
    if (l === null) throw Error(j(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ti(d, r.memoizedState) || (Vn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function Uc() {
  }
  function zc(n, r) {
    var l = Bt, o = On(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, Vn = !0), o = o.queue, ys(Hc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || nr !== null && nr.memoizedState.tag & 1) {
      if (l.flags |= 2048, Ru(9, Fc.bind(null, l, o, c, r), void 0, null), Kn === null) throw Error(j(349));
      (en & 30) !== 0 || Ac(l, r, c);
    }
    return c;
  }
  function Ac(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Bt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Bt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
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
    r !== null && zr(r, n, 1, -1);
  }
  function Bc(n) {
    var r = Tr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = wu.bind(null, Bt, n), [r.memoizedState, n];
  }
  function Ru(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Bt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Bt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Ic() {
    return On().memoizedState;
  }
  function go(n, r, l, o) {
    var c = Tr();
    Bt.flags |= n, c.memoizedState = Ru(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function So(n, r, l, o) {
    var c = On();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Pn !== null) {
      var m = Pn.memoizedState;
      if (d = m.destroy, o !== null && qe(o, m.deps)) {
        c.memoizedState = Ru(r, l, d, o);
        return;
      }
    }
    Bt.flags |= n, c.memoizedState = Ru(1 | r, l, d, o);
  }
  function Yc(n, r) {
    return go(8390656, 8, n, r);
  }
  function ys(n, r) {
    return So(2048, 8, n, r);
  }
  function Wc(n, r) {
    return So(4, 2, n, r);
  }
  function gs(n, r) {
    return So(4, 4, n, r);
  }
  function Tu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function $c(n, r, l) {
    return l = l != null ? l.concat([n]) : null, So(4, 4, Tu.bind(null, r, n), l);
  }
  function Ss() {
  }
  function Qc(n, r) {
    var l = On();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && qe(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Gc(n, r) {
    var l = On();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && qe(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Dd(n, r, l) {
    return (en & 21) === 0 ? (n.baseState && (n.baseState = !1, Vn = !0), n.memoizedState = l) : (ti(l, r) || (l = Xu(), Bt.lanes |= l, Ni |= l, n.baseState = !0), r);
  }
  function xs(n, r) {
    var l = Pt;
    Pt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Vt.transition;
    Vt.transition = {};
    try {
      n(!1), r();
    } finally {
      Pt = l, Vt.transition = o;
    }
  }
  function Nd() {
    return On().memoizedState;
  }
  function Es(n, r, l) {
    var o = Oi(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Zr(n)) Pv(r, l);
    else if (l = Td(n, r, l, o), l !== null) {
      var c = Yn();
      zr(l, n, o, c), rn(l, r, o);
    }
  }
  function wu(n, r, l) {
    var o = Oi(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Zr(n)) Pv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, x = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = x, ti(x, m)) {
          var R = r.interleaved;
          R === null ? (c.next = c, Rd(r)) : (c.next = R.next, R.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Td(n, r, c, o), l !== null && (c = Yn(), zr(l, n, o, c), rn(l, r, o));
    }
  }
  function Zr(n) {
    var r = n.alternate;
    return n === Bt || r !== null && r === Bt;
  }
  function Pv(n, r) {
    ms = jc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function rn(n, r, l) {
    if ((l & 4194240) !== 0) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var ku = { readContext: Ma, useCallback: Ht, useContext: Ht, useEffect: Ht, useImperativeHandle: Ht, useInsertionEffect: Ht, useLayoutEffect: Ht, useMemo: Ht, useReducer: Ht, useRef: Ht, useState: Ht, useDebugValue: Ht, useDeferredValue: Ht, useTransition: Ht, useMutableSource: Ht, useSyncExternalStore: Ht, useId: Ht, unstable_isNewReconciler: !1 }, qc = { readContext: Ma, useCallback: function(n, r) {
    return Tr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ma, useEffect: Yc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(
      4194308,
      4,
      Tu.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return go(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return go(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Tr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Tr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Es.bind(null, Bt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Tr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Bc, useDebugValue: Ss, useDeferredValue: function(n) {
    return Tr().memoizedState = n;
  }, useTransition: function() {
    var n = Bc(!1), r = n[0];
    return n = xs.bind(null, n[1]), Tr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Bt, c = Tr();
    if (hn) {
      if (l === void 0) throw Error(j(407));
      l = l();
    } else {
      if (l = r(), Kn === null) throw Error(j(349));
      (en & 30) !== 0 || Ac(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Yc(Hc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, Ru(9, Fc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Tr(), r = Kn.identifierPrefix;
    if (hn) {
      var l = Ti, o = Ri;
      l = (o & ~(1 << 32 - Nr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = G++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Cs = {
    readContext: Ma,
    useCallback: Qc,
    useContext: Ma,
    useEffect: ys,
    useImperativeHandle: $c,
    useInsertionEffect: Wc,
    useLayoutEffect: gs,
    useMemo: Gc,
    useReducer: jl,
    useRef: Ic,
    useState: function() {
      return jl(Xi);
    },
    useDebugValue: Ss,
    useDeferredValue: function(n) {
      var r = On();
      return Dd(r, Pn.memoizedState, n);
    },
    useTransition: function() {
      var n = jl(Xi)[0], r = On().memoizedState;
      return [n, r];
    },
    useMutableSource: Uc,
    useSyncExternalStore: zc,
    useId: Nd,
    unstable_isNewReconciler: !1
  }, Kc = { readContext: Ma, useCallback: Qc, useContext: Ma, useEffect: ys, useImperativeHandle: $c, useInsertionEffect: Wc, useLayoutEffect: gs, useMemo: Gc, useReducer: bu, useRef: Ic, useState: function() {
    return bu(Xi);
  }, useDebugValue: Ss, useDeferredValue: function(n) {
    var r = On();
    return Pn === null ? r.memoizedState = n : Dd(r, Pn.memoizedState, n);
  }, useTransition: function() {
    var n = bu(Xi)[0], r = On().memoizedState;
    return [n, r];
  }, useMutableSource: Uc, useSyncExternalStore: zc, useId: Nd, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = oe({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Od(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : oe({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Xc = { isMounted: function(n) {
    return (n = n._reactInternals) ? ot(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Yn(), c = Oi(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Oc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Yn(), c = Oi(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Oc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Yn(), o = Oi(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (zr(r, n, o, l), Oc(r, n, o));
  } };
  function Vv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !ts(l, o) || !ts(c, d) : !0;
  }
  function Jc(n, r, l) {
    var o = !1, c = Rr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ma(d) : (c = Fn(r) ? Gr : Tn.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : Rr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Xc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Bv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Xc.enqueueReplaceState(r, r.state, null);
  }
  function bs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, wd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ma(d) : (d = Fn(r) ? Gr : Tn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Od(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Xc.enqueueReplaceState(c, c.state, null), fs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += dt(o), o = o.return;
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
  function Iv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      To || (To = !0, Ou = o), Md(n, r);
    }, l;
  }
  function jd(n, r, l) {
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
      Md(n, r), typeof o != "function" && (Al === null ? Al = /* @__PURE__ */ new Set([this]) : Al.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Ud(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new Zc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = gy.bind(null, n, r, l), r.then(n, n));
  }
  function Yv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Ul(n, r, l, o, c) {
    return (n.mode & 1) === 0 ? (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n) : (n.flags |= 65536, n.lanes = c, n);
  }
  var Rs = _e.ReactCurrentOwner, Vn = !1;
  function cr(n, r, l, o) {
    r.child = n === null ? he(r, null, l, o) : Nn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return En(r, c), o = Ml(n, r, l, o, d, c), l = ri(), n !== null && !Vn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ua(n, r, c)) : (hn && l && kc(r), r.flags |= 1, cr(n, r, o, c), r.child);
  }
  function Du(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !qd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, ht(n, r, d, o, c)) : (n = Ps(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, (n.lanes & c) === 0) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ts, l(m, o) && n.ref === r.ref) return Ua(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function ht(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (ts(d, o) && n.ref === r.ref) if (Vn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) (n.flags & 131072) !== 0 && (Vn = !0);
      else return r.lanes = n.lanes, Ua(n, r, c);
    }
    return Wv(n, r, l, o, c);
  }
  function Ts(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if ((r.mode & 1) === 0) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, ze(Co, ya), ya |= l;
    else {
      if ((l & 1073741824) === 0) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, ze(Co, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, ze(Co, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, ze(Co, ya), ya |= o;
    return cr(n, r, c, l), r.child;
  }
  function zd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Wv(n, r, l, o, c) {
    var d = Fn(l) ? Gr : Tn.current;
    return d = qr(r, d), En(r, c), l = Ml(n, r, l, o, d, c), o = ri(), n !== null && !Vn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ua(n, r, c)) : (hn && o && kc(r), r.flags |= 1, cr(n, r, l, c), r.child);
  }
  function $v(n, r, l, o, c) {
    if (Fn(l)) {
      var d = !0;
      tr(r);
    } else d = !1;
    if (En(r, c), r.stateNode === null) ja(n, r), Jc(r, l, o), bs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, x = r.memoizedProps;
      m.props = x;
      var R = m.context, A = l.contextType;
      typeof A == "object" && A !== null ? A = Ma(A) : (A = Fn(l) ? Gr : Tn.current, A = qr(r, A));
      var K = l.getDerivedStateFromProps, J = typeof K == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      J || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (x !== o || R !== A) && Bv(r, m, o, A), ma = !1;
      var q = r.memoizedState;
      m.state = q, fs(r, o, m, c), R = r.memoizedState, x !== o || q !== R || Gn.current || ma ? (typeof K == "function" && (Od(r, l, K, o), R = r.memoizedState), (x = ma || Vv(r, l, x, o, q, R, A)) ? (J || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = R), m.props = o, m.state = R, m.context = A, o = x) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Av(n, r), x = r.memoizedProps, A = r.type === r.elementType ? x : ai(r.type, x), m.props = A, J = r.pendingProps, q = m.context, R = l.contextType, typeof R == "object" && R !== null ? R = Ma(R) : (R = Fn(l) ? Gr : Tn.current, R = qr(r, R));
      var Se = l.getDerivedStateFromProps;
      (K = typeof Se == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (x !== J || q !== R) && Bv(r, m, o, R), ma = !1, q = r.memoizedState, m.state = q, fs(r, o, m, c);
      var Te = r.memoizedState;
      x !== J || q !== Te || Gn.current || ma ? (typeof Se == "function" && (Od(r, l, Se, o), Te = r.memoizedState), (A = ma || Vv(r, l, A, o, q, Te, R) || !1) ? (K || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, Te, R), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, Te, R)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Te), m.props = o, m.state = Te, m.context = R, o = A) : (typeof m.componentDidUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return ws(n, r, l, o, d, c);
  }
  function ws(n, r, l, o, c, d) {
    zd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && Tc(r, l, !1), Ua(n, r, d);
    o = r.stateNode, Rs.current = r;
    var x = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = Nn(r, n.child, null, d), r.child = Nn(r, null, x, d)) : cr(n, r, x, d), r.memoizedState = o.state, c && Tc(r, l, !0), r.child;
  }
  function xo(n) {
    var r = n.stateNode;
    r.pendingContext ? Mv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Mv(n, r.context, !1), _d(n, r.containerInfo);
  }
  function Qv(n, r, l, o, c) {
    return Ol(), qi(c), r.flags |= 256, cr(n, r, l, o), r.child;
  }
  var ef = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ad(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function tf(n, r, l) {
    var o = r.pendingProps, c = Cn.current, d = !1, m = (r.flags & 128) !== 0, x;
    if ((x = m) || (x = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), x ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), ze(Cn, c & 1), n === null)
      return Sd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? ((r.mode & 1) === 0 ? r.lanes = 1 : n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, (o & 1) === 0 && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Pl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ad(l), r.memoizedState = ef, n) : Fd(r, m));
    if (c = n.memoizedState, c !== null && (x = c.dehydrated, x !== null)) return Gv(n, r, m, o, x, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, x = c.sibling;
      var R = { mode: "hidden", children: o.children };
      return (m & 1) === 0 && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = R, r.deletions = null) : (o = Hl(c, R), o.subtreeFlags = c.subtreeFlags & 14680064), x !== null ? d = Hl(x, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ad(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = ef, o;
    }
    return d = n.child, n = d.sibling, o = Hl(d, { mode: "visible", children: o.children }), (r.mode & 1) === 0 && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Fd(n, r) {
    return r = Pl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ks(n, r, l, o) {
    return o !== null && qi(o), Nn(r, n.child, null, l), n = Fd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Gv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Ld(Error(j(422))), ks(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Pl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, (r.mode & 1) !== 0 && Nn(r, n.child, null, m), r.child.memoizedState = Ad(m), r.memoizedState = ef, d);
    if ((r.mode & 1) === 0) return ks(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var x = o.dgst;
      return o = x, d = Error(j(419)), o = Ld(d, o, void 0), ks(n, r, m, o);
    }
    if (x = (m & n.childLanes) !== 0, Vn || x) {
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
        c = (c & (o.suspendedLanes | m)) !== 0 ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ha(n, c), zr(o, n, c, -1));
      }
      return Gd(), o = Ld(Error(j(421))), ks(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Sy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = xi(c.nextSibling), Kr = r, hn = !0, La = null, n !== null && (Hn[Oa++] = Ri, Hn[Oa++] = Ti, Hn[Oa++] = pa, Ri = n.id, Ti = n.overflow, pa = r), r = Fd(r, o.children), r.flags |= 4096, r);
  }
  function Hd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), bd(n.return, r, l);
  }
  function Mr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function ki(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (cr(n, r, o.children, l), o = Cn.current, (o & 2) !== 0) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && (n.flags & 128) !== 0) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Hd(n, l, r);
        else if (n.tag === 19) Hd(n, l, r);
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
    if (ze(Cn, o), (r.mode & 1) === 0) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Mc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Mr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Mc(n) === null) {
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
  function ja(n, r) {
    (r.mode & 1) === 0 && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Ua(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Ni |= r.lanes, (l & r.childLanes) === 0) return null;
    if (n !== null && r.child !== n.child) throw Error(j(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function _s(n, r, l) {
    switch (r.tag) {
      case 3:
        xo(r), Ol();
        break;
      case 5:
        Hv(r);
        break;
      case 1:
        Fn(r.type) && tr(r);
        break;
      case 4:
        _d(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        ze(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (ze(Cn, Cn.current & 1), r.flags |= 128, null) : (l & r.child.childLanes) !== 0 ? tf(n, r, l) : (ze(Cn, Cn.current & 1), n = Ua(n, r, l), n !== null ? n.sibling : null);
        ze(Cn, Cn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, (n.flags & 128) !== 0) {
          if (o) return ki(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), ze(Cn, Cn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Ts(n, r, l);
    }
    return Ua(n, r, l);
  }
  var za, Bn, qv, Kv;
  za = function(n, r) {
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
  }, Bn = function() {
  }, qv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, xu(wi.current);
      var d = null;
      switch (l) {
        case "input":
          c = Rn(n, c), o = Rn(n, o), d = [];
          break;
        case "select":
          c = oe({}, c, { value: void 0 }), o = oe({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = $n(n, c), o = $n(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = Tl);
      }
      fn(l, o);
      var m;
      l = null;
      for (A in c) if (!o.hasOwnProperty(A) && c.hasOwnProperty(A) && c[A] != null) if (A === "style") {
        var x = c[A];
        for (m in x) x.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else A !== "dangerouslySetInnerHTML" && A !== "children" && A !== "suppressContentEditableWarning" && A !== "suppressHydrationWarning" && A !== "autoFocus" && (Je.hasOwnProperty(A) ? d || (d = []) : (d = d || []).push(A, null));
      for (A in o) {
        var R = o[A];
        if (x = c != null ? c[A] : void 0, o.hasOwnProperty(A) && R !== x && (R != null || x != null)) if (A === "style") if (x) {
          for (m in x) !x.hasOwnProperty(m) || R && R.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in R) R.hasOwnProperty(m) && x[m] !== R[m] && (l || (l = {}), l[m] = R[m]);
        } else l || (d || (d = []), d.push(
          A,
          l
        )), l = R;
        else A === "dangerouslySetInnerHTML" ? (R = R ? R.__html : void 0, x = x ? x.__html : void 0, R != null && x !== R && (d = d || []).push(A, R)) : A === "children" ? typeof R != "string" && typeof R != "number" || (d = d || []).push(A, "" + R) : A !== "suppressContentEditableWarning" && A !== "suppressHydrationWarning" && (Je.hasOwnProperty(A) ? (R != null && A === "onScroll" && Qt("scroll", n), d || x === R || (d = [])) : (d = d || []).push(A, R));
      }
      l && (d = d || []).push("style", l);
      var A = d;
      (r.updateQueue = A) && (r.flags |= 4);
    }
  }, Kv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function Ds(n, r) {
    if (!hn) switch (n.tailMode) {
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
  function rr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Xv(n, r, l) {
    var o = r.pendingProps;
    switch (_c(r), r.tag) {
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
        return rr(r), null;
      case 1:
        return Fn(r.type) && ho(), rr(r), null;
      case 3:
        return o = r.stateNode, Eu(), sn(Gn), sn(Tn), Fe(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && (r.flags & 256) === 0 || (r.flags |= 1024, La !== null && (Lu(La), La = null))), Bn(n, r), rr(r), null;
      case 5:
        Lc(r);
        var c = xu(vs.current);
        if (l = r.type, n !== null && r.stateNode != null) qv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(j(166));
            return rr(r), null;
          }
          if (n = xu(wi.current), Dc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ei] = r, o[us] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Qt("cancel", o), Qt("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Qt("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < as.length; c++) Qt(as[c], o);
                break;
              case "source":
                Qt("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Qt(
                  "error",
                  o
                ), Qt("load", o);
                break;
              case "details":
                Qt("toggle", o);
                break;
              case "input":
                wn(o, d), Qt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Qt("invalid", o);
                break;
              case "textarea":
                Er(o, d), Qt("invalid", o);
            }
            fn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var x = d[m];
              m === "children" ? typeof x == "string" ? o.textContent !== x && (d.suppressHydrationWarning !== !0 && Ec(o.textContent, x, n), c = ["children", x]) : typeof x == "number" && o.textContent !== "" + x && (d.suppressHydrationWarning !== !0 && Ec(
                o.textContent,
                x,
                n
              ), c = ["children", "" + x]) : Je.hasOwnProperty(m) && x != null && m === "onScroll" && Qt("scroll", o);
            }
            switch (l) {
              case "input":
                Ge(o), ci(o, d, !0);
                break;
              case "textarea":
                Ge(o), zn(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = Tl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Cr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ei] = r, n[us] = o, za(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = er(l, o), l) {
                case "dialog":
                  Qt("cancel", n), Qt("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Qt("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < as.length; c++) Qt(as[c], n);
                  c = o;
                  break;
                case "source":
                  Qt("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Qt(
                    "error",
                    n
                  ), Qt("load", n), c = o;
                  break;
                case "details":
                  Qt("toggle", n), c = o;
                  break;
                case "input":
                  wn(n, o), c = Rn(n, o), Qt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = oe({}, o, { value: void 0 }), Qt("invalid", n);
                  break;
                case "textarea":
                  Er(n, o), c = $n(n, o), Qt("invalid", n);
                  break;
                default:
                  c = o;
              }
              fn(l, c), x = c;
              for (d in x) if (x.hasOwnProperty(d)) {
                var R = x[d];
                d === "style" ? an(n, R) : d === "dangerouslySetInnerHTML" ? (R = R ? R.__html : void 0, R != null && fi(n, R)) : d === "children" ? typeof R == "string" ? (l !== "textarea" || R !== "") && ue(n, R) : typeof R == "number" && ue(n, "" + R) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (Je.hasOwnProperty(d) ? R != null && d === "onScroll" && Qt("scroll", n) : R != null && V(n, d, R, m));
              }
              switch (l) {
                case "input":
                  Ge(n), ci(n, o, !1);
                  break;
                case "textarea":
                  Ge(n), zn(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + vt(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? _n(n, !!o.multiple, d, !1) : o.defaultValue != null && _n(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = Tl);
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
        return rr(r), null;
      case 6:
        if (n && r.stateNode != null) Kv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(j(166));
          if (l = xu(vs.current), xu(wi.current), Dc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ei] = r, (d = o.nodeValue !== l) && (n = Kr, n !== null)) switch (n.tag) {
              case 3:
                Ec(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Ec(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ei] = r, r.stateNode = o;
        }
        return rr(r), null;
      case 13:
        if (sn(Cn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (hn && Xr !== null && (r.mode & 1) !== 0 && (r.flags & 128) === 0) cs(), Ol(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(j(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(j(317));
              d[Ei] = r;
            } else Ol(), (r.flags & 128) === 0 && (r.memoizedState = null), r.flags |= 4;
            rr(r), d = !1;
          } else La !== null && (Lu(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return (r.flags & 128) !== 0 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, (r.mode & 1) !== 0 && (n === null || (Cn.current & 1) !== 0 ? Mn === 0 && (Mn = 3) : Gd())), r.updateQueue !== null && (r.flags |= 4), rr(r), null);
      case 4:
        return Eu(), Bn(n, r), n === null && so(r.stateNode.containerInfo), rr(r), null;
      case 10:
        return Cd(r.type._context), rr(r), null;
      case 17:
        return Fn(r.type) && ho(), rr(r), null;
      case 19:
        if (sn(Cn), d = r.memoizedState, d === null) return rr(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) Ds(d, !1);
        else {
          if (Mn !== 0 || n !== null && (n.flags & 128) !== 0) for (n = r.child; n !== null; ) {
            if (m = Mc(n), m !== null) {
              for (r.flags |= 128, Ds(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return ze(Cn, Cn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && st() > Ro && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Mc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ds(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !hn) return rr(r), null;
          } else 2 * st() - d.renderingStartTime > Ro && l !== 1073741824 && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = st(), r.sibling = null, l = Cn.current, ze(Cn, o ? l & 1 | 2 : l & 1), r) : (rr(r), null);
      case 22:
      case 23:
        return Qd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && (r.mode & 1) !== 0 ? (ya & 1073741824) !== 0 && (rr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : rr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(j(156, r.tag));
  }
  function nf(n, r) {
    switch (_c(r), r.tag) {
      case 1:
        return Fn(r.type) && ho(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), sn(Gn), sn(Tn), Fe(), n = r.flags, (n & 65536) !== 0 && (n & 128) === 0 ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Lc(r), null;
      case 13:
        if (sn(Cn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(j(340));
          Ol();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return sn(Cn), null;
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
  var Ns = !1, wr = !1, dy = typeof WeakSet == "function" ? WeakSet : Set, Ce = null;
  function Eo(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      mn(n, r, o);
    }
    else l.current = null;
  }
  function rf(n, r, l) {
    try {
      l();
    } catch (o) {
      mn(n, r, o);
    }
  }
  var Jv = !1;
  function Zv(n, r) {
    if (ls = ka, n = ns(), pc(n)) {
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
          var m = 0, x = -1, R = -1, A = 0, K = 0, J = n, q = null;
          t: for (; ; ) {
            for (var Se; J !== l || c !== 0 && J.nodeType !== 3 || (x = m + c), J !== d || o !== 0 && J.nodeType !== 3 || (R = m + o), J.nodeType === 3 && (m += J.nodeValue.length), (Se = J.firstChild) !== null; )
              q = J, J = Se;
            for (; ; ) {
              if (J === n) break t;
              if (q === l && ++A === c && (x = m), q === d && ++K === o && (R = m), (Se = J.nextSibling) !== null) break;
              J = q, q = J.parentNode;
            }
            J = Se;
          }
          l = x === -1 || R === -1 ? null : { start: x, end: R };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (vu = { focusedElem: n, selectionRange: l }, ka = !1, Ce = r; Ce !== null; ) if (r = Ce, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Ce = n;
    else for (; Ce !== null; ) {
      r = Ce;
      try {
        var Te = r.alternate;
        if ((r.flags & 1024) !== 0) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Te !== null) {
              var Le = Te.memoizedProps, jn = Te.memoizedState, D = r.stateNode, w = D.getSnapshotBeforeUpdate(r.elementType === r.type ? Le : ai(r.type, Le), jn);
              D.__reactInternalSnapshotBeforeUpdate = w;
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
            throw Error(j(163));
        }
      } catch (X) {
        mn(r, r.return, X);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Ce = n;
        break;
      }
      Ce = r.return;
    }
    return Te = Jv, Jv = !1, Te;
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
  function Pd(n) {
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
    r !== null && (n.alternate = null, af(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ei], delete r[us], delete r[os], delete r[vo], delete r[cy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
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
  function _i(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Tl));
    else if (o !== 4 && (n = n.child, n !== null)) for (_i(n, r, l), n = n.sibling; n !== null; ) _i(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var Ln = null, jr = !1;
  function Ur(n, r, l) {
    for (l = l.child; l !== null; ) eh(n, r, l), l = l.sibling;
  }
  function eh(n, r, l) {
    if ($r && typeof $r.onCommitFiberUnmount == "function") try {
      $r.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        wr || Eo(l, r);
      case 6:
        var o = Ln, c = jr;
        Ln = null, Ur(n, r, l), Ln = o, jr = c, Ln !== null && (jr ? (n = Ln, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : Ln.removeChild(l.stateNode));
        break;
      case 18:
        Ln !== null && (jr ? (n = Ln, l = l.stateNode, n.nodeType === 8 ? po(n.parentNode, l) : n.nodeType === 1 && po(n, l), Za(n)) : po(Ln, l.stateNode));
        break;
      case 4:
        o = Ln, c = jr, Ln = l.stateNode.containerInfo, jr = !0, Ur(n, r, l), Ln = o, jr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!wr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && rf(l, r, m), c = c.next;
          } while (c !== o);
        }
        Ur(n, r, l);
        break;
      case 1:
        if (!wr && (Eo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (x) {
          mn(l, r, x);
        }
        Ur(n, r, l);
        break;
      case 21:
        Ur(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (wr = (o = wr) || l.memoizedState !== null, Ur(n, r, l), wr = o) : Ur(n, r, l);
        break;
      default:
        Ur(n, r, l);
    }
  }
  function th(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new dy()), r.forEach(function(o) {
        var c = ch.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ii(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, x = m;
        e: for (; x !== null; ) {
          switch (x.tag) {
            case 5:
              Ln = x.stateNode, jr = !1;
              break e;
            case 3:
              Ln = x.stateNode.containerInfo, jr = !0;
              break e;
            case 4:
              Ln = x.stateNode.containerInfo, jr = !0;
              break e;
          }
          x = x.return;
        }
        if (Ln === null) throw Error(j(160));
        eh(d, m, c), Ln = null, jr = !1;
        var R = c.alternate;
        R !== null && (R.return = null), c.return = null;
      } catch (A) {
        mn(c, r, A);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Vd(r, n), r = r.sibling;
  }
  function Vd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Os(3, n, n.return), Ls(3, n);
          } catch (Le) {
            mn(n, n.return, Le);
          }
          try {
            Os(5, n, n.return);
          } catch (Le) {
            mn(n, n.return, Le);
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
            ue(c, "");
          } catch (Le) {
            mn(n, n.return, Le);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, x = n.type, R = n.updateQueue;
          if (n.updateQueue = null, R !== null) try {
            x === "input" && d.type === "radio" && d.name != null && kn(c, d), er(x, m);
            var A = er(x, d);
            for (m = 0; m < R.length; m += 2) {
              var K = R[m], J = R[m + 1];
              K === "style" ? an(c, J) : K === "dangerouslySetInnerHTML" ? fi(c, J) : K === "children" ? ue(c, J) : V(c, K, J, A);
            }
            switch (x) {
              case "input":
                Jn(c, d);
                break;
              case "textarea":
                Wa(c, d);
                break;
              case "select":
                var q = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var Se = d.value;
                Se != null ? _n(c, !!d.multiple, Se, !1) : q !== !!d.multiple && (d.defaultValue != null ? _n(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : _n(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[us] = d;
          } catch (Le) {
            mn(n, n.return, Le);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(j(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Le) {
            mn(n, n.return, Le);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Za(r.containerInfo);
        } catch (Le) {
          mn(n, n.return, Le);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Yd = st())), o & 4 && th(n);
        break;
      case 22:
        if (K = l !== null && l.memoizedState !== null, n.mode & 1 ? (wr = (A = wr) || K, ii(r, n), wr = A) : ii(r, n), ta(n), o & 8192) {
          if (A = n.memoizedState !== null, (n.stateNode.isHidden = A) && !K && (n.mode & 1) !== 0) for (Ce = n, K = n.child; K !== null; ) {
            for (J = Ce = K; Ce !== null; ) {
              switch (q = Ce, Se = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, q, q.return);
                  break;
                case 1:
                  Eo(q, q.return);
                  var Te = q.stateNode;
                  if (typeof Te.componentWillUnmount == "function") {
                    o = q, l = q.return;
                    try {
                      r = o, Te.props = r.memoizedProps, Te.state = r.memoizedState, Te.componentWillUnmount();
                    } catch (Le) {
                      mn(o, l, Le);
                    }
                  }
                  break;
                case 5:
                  Eo(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    js(J);
                    continue;
                  }
              }
              Se !== null ? (Se.return = q, Ce = Se) : js(J);
            }
            K = K.sibling;
          }
          e: for (K = null, J = n; ; ) {
            if (J.tag === 5) {
              if (K === null) {
                K = J;
                try {
                  c = J.stateNode, A ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (x = J.stateNode, R = J.memoizedProps.style, m = R != null && R.hasOwnProperty("display") ? R.display : null, x.style.display = $t("display", m));
                } catch (Le) {
                  mn(n, n.return, Le);
                }
              }
            } else if (J.tag === 6) {
              if (K === null) try {
                J.stateNode.nodeValue = A ? "" : J.memoizedProps;
              } catch (Le) {
                mn(n, n.return, Le);
              }
            } else if ((J.tag !== 22 && J.tag !== 23 || J.memoizedState === null || J === n) && J.child !== null) {
              J.child.return = J, J = J.child;
              continue;
            }
            if (J === n) break e;
            for (; J.sibling === null; ) {
              if (J.return === null || J.return === n) break e;
              K === J && (K = null), J = J.return;
            }
            K === J && (K = null), J.sibling.return = J.return, J = J.sibling;
          }
        }
        break;
      case 19:
        ii(r, n), ta(n), o & 4 && th(n);
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
          throw Error(j(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (ue(c, ""), o.flags &= -33);
            var d = Ji(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, x = Ji(n);
            _i(n, x, m);
            break;
          default:
            throw Error(j(161));
        }
      } catch (R) {
        mn(n, n.return, R);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function py(n, r, l) {
    Ce = n, Bd(n);
  }
  function Bd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; Ce !== null; ) {
      var c = Ce, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Ns;
        if (!m) {
          var x = c.alternate, R = x !== null && x.memoizedState !== null || wr;
          x = Ns;
          var A = wr;
          if (Ns = m, (wr = R) && !A) for (Ce = c; Ce !== null; ) m = Ce, R = m.child, m.tag === 22 && m.memoizedState !== null ? Id(c) : R !== null ? (R.return = m, Ce = R) : Id(c);
          for (; d !== null; ) Ce = d, Bd(d), d = d.sibling;
          Ce = c, Ns = x, wr = A;
        }
        nh(n);
      } else (c.subtreeFlags & 8772) !== 0 && d !== null ? (d.return = c, Ce = d) : nh(n);
    }
  }
  function nh(n) {
    for (; Ce !== null; ) {
      var r = Ce;
      if ((r.flags & 8772) !== 0) {
        var l = r.alternate;
        try {
          if ((r.flags & 8772) !== 0) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              wr || Ls(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !wr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && kd(r, d, o);
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
                kd(r, m, l);
              }
              break;
            case 5:
              var x = r.stateNode;
              if (l === null && r.flags & 4) {
                l = x;
                var R = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    R.autoFocus && l.focus();
                    break;
                  case "img":
                    R.src && (l.src = R.src);
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
                var A = r.alternate;
                if (A !== null) {
                  var K = A.memoizedState;
                  if (K !== null) {
                    var J = K.dehydrated;
                    J !== null && Za(J);
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
              throw Error(j(163));
          }
          wr || r.flags & 512 && Pd(r);
        } catch (q) {
          mn(r, r.return, q);
        }
      }
      if (r === n) {
        Ce = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Ce = l;
        break;
      }
      Ce = r.return;
    }
  }
  function js(n) {
    for (; Ce !== null; ) {
      var r = Ce;
      if (r === n) {
        Ce = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Ce = l;
        break;
      }
      Ce = r.return;
    }
  }
  function Id(n) {
    for (; Ce !== null; ) {
      var r = Ce;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (R) {
              mn(r, l, R);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (R) {
                mn(r, c, R);
              }
            }
            var d = r.return;
            try {
              Pd(r);
            } catch (R) {
              mn(r, d, R);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Pd(r);
            } catch (R) {
              mn(r, m, R);
            }
        }
      } catch (R) {
        mn(r, r.return, R);
      }
      if (r === n) {
        Ce = null;
        break;
      }
      var x = r.sibling;
      if (x !== null) {
        x.return = r.return, Ce = x;
        break;
      }
      Ce = r.return;
    }
  }
  var vy = Math.ceil, zl = _e.ReactCurrentDispatcher, Nu = _e.ReactCurrentOwner, fr = _e.ReactCurrentBatchConfig, Lt = 0, Kn = null, In = null, dr = 0, ya = 0, Co = Na(0), Mn = 0, Us = null, Ni = 0, bo = 0, lf = 0, zs = null, na = null, Yd = 0, Ro = 1 / 0, ga = null, To = !1, Ou = null, Al = null, uf = !1, Zi = null, As = 0, Fl = 0, wo = null, Fs = -1, kr = 0;
  function Yn() {
    return (Lt & 6) !== 0 ? st() : Fs !== -1 ? Fs : Fs = st();
  }
  function Oi(n) {
    return (n.mode & 1) === 0 ? 1 : (Lt & 2) !== 0 && dr !== 0 ? dr & -dr : fy.transition !== null ? (kr === 0 && (kr = Xu()), kr) : (n = Pt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ao(n.type)), n);
  }
  function zr(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, wo = null, Error(j(185));
    Pi(n, l, o), ((Lt & 2) === 0 || n !== Kn) && (n === Kn && ((Lt & 2) === 0 && (bo |= l), Mn === 4 && li(n, dr)), ra(n, o), l === 1 && Lt === 0 && (r.mode & 1) === 0 && (Ro = st() + 500, mo && bi()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    iu(n, r);
    var o = Ja(n, n === Kn ? dr : 0);
    if (o === 0) l !== null && ur(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ur(l), r === 1) n.tag === 0 ? kl(Wd.bind(null, n)) : wc(Wd.bind(null, n)), fo(function() {
        (Lt & 6) === 0 && bi();
      }), l = null;
      else {
        switch (Zu(o)) {
          case 1:
            l = Ka;
            break;
          case 4:
            l = ru;
            break;
          case 16:
            l = au;
            break;
          case 536870912:
            l = Gu;
            break;
          default:
            l = au;
        }
        l = dh(l, of.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function of(n, r) {
    if (Fs = -1, kr = 0, (Lt & 6) !== 0) throw Error(j(327));
    var l = n.callbackNode;
    if (ko() && n.callbackNode !== l) return null;
    var o = Ja(n, n === Kn ? dr : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & n.expiredLanes) !== 0 || r) r = sf(n, o);
    else {
      r = o;
      var c = Lt;
      Lt |= 2;
      var d = ah();
      (Kn !== n || dr !== r) && (ga = null, Ro = st() + 500, el(n, r));
      do
        try {
          ih();
          break;
        } catch (x) {
          rh(n, x);
        }
      while (!0);
      Ed(), zl.current = d, Lt = c, In !== null ? r = 0 : (Kn = null, dr = 0, r = Mn);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Hs(n, c))), r === 1) throw l = Us, el(n, 0), li(n, o), ra(n, st()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, (o & 30) === 0 && !hy(c) && (r = sf(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Hs(n, d))), r === 1)) throw l = Us, el(n, 0), li(n, o), ra(n, st()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(j(345));
          case 2:
            ju(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Yd + 500 - st(), 10 < r)) {
              if (Ja(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Yn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = bc(ju.bind(null, n, na, ga), r);
              break;
            }
            ju(n, na, ga);
            break;
          case 4:
            if (li(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - Nr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = st() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * vy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = bc(ju.bind(null, n, na, ga), o);
              break;
            }
            ju(n, na, ga);
            break;
          case 5:
            ju(n, na, ga);
            break;
          default:
            throw Error(j(329));
        }
      }
    }
    return ra(n, st()), n.callbackNode === l ? of.bind(null, n) : null;
  }
  function Hs(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = sf(n, r), n !== 2 && (r = na, na = l, r !== null && Lu(r)), n;
  }
  function Lu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function hy(n) {
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
    for (r &= ~lf, r &= ~bo, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Nr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Wd(n) {
    if ((Lt & 6) !== 0) throw Error(j(327));
    ko();
    var r = Ja(n, 0);
    if ((r & 1) === 0) return ra(n, st()), null;
    var l = sf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Hs(n, o));
    }
    if (l === 1) throw l = Us, el(n, 0), li(n, r), ra(n, st()), l;
    if (l === 6) throw Error(j(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, ju(n, na, ga), ra(n, st()), null;
  }
  function $d(n, r) {
    var l = Lt;
    Lt |= 1;
    try {
      return n(r);
    } finally {
      Lt = l, Lt === 0 && (Ro = st() + 500, mo && bi());
    }
  }
  function Mu(n) {
    Zi !== null && Zi.tag === 0 && (Lt & 6) === 0 && ko();
    var r = Lt;
    Lt |= 1;
    var l = fr.transition, o = Pt;
    try {
      if (fr.transition = null, Pt = 1, n) return n();
    } finally {
      Pt = o, fr.transition = l, Lt = r, (Lt & 6) === 0 && bi();
    }
  }
  function Qd() {
    ya = Co.current, sn(Co);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, md(l)), In !== null) for (l = In.return; l !== null; ) {
      var o = l;
      switch (_c(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && ho();
          break;
        case 3:
          Eu(), sn(Gn), sn(Tn), Fe();
          break;
        case 5:
          Lc(o);
          break;
        case 4:
          Eu();
          break;
        case 13:
          sn(Cn);
          break;
        case 19:
          sn(Cn);
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
    if (Kn = n, In = n = Hl(n.current, null), dr = ya = r, Mn = 0, Us = null, lf = bo = Ni = 0, na = zs = null, Su !== null) {
      for (r = 0; r < Su.length; r++) if (l = Su[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var m = d.next;
          d.next = c, o.next = m;
        }
        l.pending = o;
      }
      Su = null;
    }
    return n;
  }
  function rh(n, r) {
    do {
      var l = In;
      try {
        if (Ed(), xt.current = ku, jc) {
          for (var o = Bt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          jc = !1;
        }
        if (en = 0, nr = Pn = Bt = null, ms = !1, Cu = 0, Nu.current = null, l === null || l.return === null) {
          Mn = 1, Us = r, In = null;
          break;
        }
        e: {
          var d = n, m = l.return, x = l, R = r;
          if (r = dr, x.flags |= 32768, R !== null && typeof R == "object" && typeof R.then == "function") {
            var A = R, K = x, J = K.tag;
            if ((K.mode & 1) === 0 && (J === 0 || J === 11 || J === 15)) {
              var q = K.alternate;
              q ? (K.updateQueue = q.updateQueue, K.memoizedState = q.memoizedState, K.lanes = q.lanes) : (K.updateQueue = null, K.memoizedState = null);
            }
            var Se = Yv(m);
            if (Se !== null) {
              Se.flags &= -257, Ul(Se, m, x, d, r), Se.mode & 1 && Ud(d, A, r), r = Se, R = A;
              var Te = r.updateQueue;
              if (Te === null) {
                var Le = /* @__PURE__ */ new Set();
                Le.add(R), r.updateQueue = Le;
              } else Te.add(R);
              break e;
            } else {
              if ((r & 1) === 0) {
                Ud(d, A, r), Gd();
                break e;
              }
              R = Error(j(426));
            }
          } else if (hn && x.mode & 1) {
            var jn = Yv(m);
            if (jn !== null) {
              (jn.flags & 65536) === 0 && (jn.flags |= 256), Ul(jn, m, x, d, r), qi(_u(R, x));
              break e;
            }
          }
          d = R = _u(R, x), Mn !== 4 && (Mn = 2), zs === null ? zs = [d] : zs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var D = Iv(d, R, r);
                Fv(d, D);
                break e;
              case 1:
                x = R;
                var w = d.type, L = d.stateNode;
                if ((d.flags & 128) === 0 && (typeof w.getDerivedStateFromError == "function" || L !== null && typeof L.componentDidCatch == "function" && (Al === null || !Al.has(L)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var X = jd(d, x, r);
                  Fv(d, X);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        uh(l);
      } catch (we) {
        r = we, In === l && l !== null && (In = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ah() {
    var n = zl.current;
    return zl.current = ku, n === null ? ku : n;
  }
  function Gd() {
    (Mn === 0 || Mn === 3 || Mn === 2) && (Mn = 4), Kn === null || (Ni & 268435455) === 0 && (bo & 268435455) === 0 || li(Kn, dr);
  }
  function sf(n, r) {
    var l = Lt;
    Lt |= 2;
    var o = ah();
    (Kn !== n || dr !== r) && (ga = null, el(n, r));
    do
      try {
        my();
        break;
      } catch (c) {
        rh(n, c);
      }
    while (!0);
    if (Ed(), Lt = l, zl.current = o, In !== null) throw Error(j(261));
    return Kn = null, dr = 0, Mn;
  }
  function my() {
    for (; In !== null; ) lh(In);
  }
  function ih() {
    for (; In !== null && !Ga(); ) lh(In);
  }
  function lh(n) {
    var r = fh(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? uh(n) : In = r, Nu.current = null;
  }
  function uh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, (r.flags & 32768) === 0) {
        if (l = Xv(l, r, ya), l !== null) {
          In = l;
          return;
        }
      } else {
        if (l = nf(l, r), l !== null) {
          l.flags &= 32767, In = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Mn = 6, In = null;
          return;
        }
      }
      if (r = r.sibling, r !== null) {
        In = r;
        return;
      }
      In = r = n;
    } while (r !== null);
    Mn === 0 && (Mn = 5);
  }
  function ju(n, r, l) {
    var o = Pt, c = fr.transition;
    try {
      fr.transition = null, Pt = 1, yy(n, r, l, o);
    } finally {
      fr.transition = c, Pt = o;
    }
    return null;
  }
  function yy(n, r, l, o) {
    do
      ko();
    while (Zi !== null);
    if ((Lt & 6) !== 0) throw Error(j(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(j(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (qf(n, d), n === Kn && (In = Kn = null, dr = 0), (l.subtreeFlags & 2064) === 0 && (l.flags & 2064) === 0 || uf || (uf = !0, dh(au, function() {
      return ko(), null;
    })), d = (l.flags & 15990) !== 0, (l.subtreeFlags & 15990) !== 0 || d) {
      d = fr.transition, fr.transition = null;
      var m = Pt;
      Pt = 1;
      var x = Lt;
      Lt |= 4, Nu.current = null, Zv(n, l), Vd(l, n), uo(vu), ka = !!ls, vu = ls = null, n.current = l, py(l), qa(), Lt = x, Pt = m, fr.transition = d;
    } else n.current = l;
    if (uf && (uf = !1, Zi = n, As = c), d = n.pendingLanes, d === 0 && (Al = null), $o(l.stateNode), ra(n, st()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (To) throw To = !1, n = Ou, Ou = null, n;
    return (As & 1) !== 0 && n.tag !== 0 && ko(), d = n.pendingLanes, (d & 1) !== 0 ? n === wo ? Fl++ : (Fl = 0, wo = n) : Fl = 0, bi(), null;
  }
  function ko() {
    if (Zi !== null) {
      var n = Zu(As), r = fr.transition, l = Pt;
      try {
        if (fr.transition = null, Pt = 16 > n ? 16 : n, Zi === null) var o = !1;
        else {
          if (n = Zi, Zi = null, As = 0, (Lt & 6) !== 0) throw Error(j(331));
          var c = Lt;
          for (Lt |= 4, Ce = n.current; Ce !== null; ) {
            var d = Ce, m = d.child;
            if ((Ce.flags & 16) !== 0) {
              var x = d.deletions;
              if (x !== null) {
                for (var R = 0; R < x.length; R++) {
                  var A = x[R];
                  for (Ce = A; Ce !== null; ) {
                    var K = Ce;
                    switch (K.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, K, d);
                    }
                    var J = K.child;
                    if (J !== null) J.return = K, Ce = J;
                    else for (; Ce !== null; ) {
                      K = Ce;
                      var q = K.sibling, Se = K.return;
                      if (af(K), K === A) {
                        Ce = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = Se, Ce = q;
                        break;
                      }
                      Ce = Se;
                    }
                  }
                }
                var Te = d.alternate;
                if (Te !== null) {
                  var Le = Te.child;
                  if (Le !== null) {
                    Te.child = null;
                    do {
                      var jn = Le.sibling;
                      Le.sibling = null, Le = jn;
                    } while (Le !== null);
                  }
                }
                Ce = d;
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && m !== null) m.return = d, Ce = m;
            else e: for (; Ce !== null; ) {
              if (d = Ce, (d.flags & 2048) !== 0) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var D = d.sibling;
              if (D !== null) {
                D.return = d.return, Ce = D;
                break e;
              }
              Ce = d.return;
            }
          }
          var w = n.current;
          for (Ce = w; Ce !== null; ) {
            m = Ce;
            var L = m.child;
            if ((m.subtreeFlags & 2064) !== 0 && L !== null) L.return = m, Ce = L;
            else e: for (m = w; Ce !== null; ) {
              if (x = Ce, (x.flags & 2048) !== 0) try {
                switch (x.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, x);
                }
              } catch (we) {
                mn(x, x.return, we);
              }
              if (x === m) {
                Ce = null;
                break e;
              }
              var X = x.sibling;
              if (X !== null) {
                X.return = x.return, Ce = X;
                break e;
              }
              Ce = x.return;
            }
          }
          if (Lt = c, bi(), $r && typeof $r.onPostCommitFiberRoot == "function") try {
            $r.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Pt = l, fr.transition = r;
      }
    }
    return !1;
  }
  function oh(n, r, l) {
    r = _u(l, r), r = Iv(n, r, 1), n = Ll(n, r, 1), r = Yn(), n !== null && (Pi(n, 1, r), ra(n, r));
  }
  function mn(n, r, l) {
    if (n.tag === 3) oh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        oh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Al === null || !Al.has(o))) {
          n = _u(l, n), n = jd(r, n, 1), r = Ll(r, n, 1), n = Yn(), r !== null && (Pi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function gy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Yn(), n.pingedLanes |= n.suspendedLanes & l, Kn === n && (dr & l) === l && (Mn === 4 || Mn === 3 && (dr & 130023424) === dr && 500 > st() - Yd ? el(n, 0) : lf |= l), ra(n, r);
  }
  function sh(n, r) {
    r === 0 && ((n.mode & 1) === 0 ? r = 1 : (r = da, da <<= 1, (da & 130023424) === 0 && (da = 4194304)));
    var l = Yn();
    n = ha(n, r), n !== null && (Pi(n, r, l), ra(n, l));
  }
  function Sy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), sh(n, l);
  }
  function ch(n, r) {
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
        throw Error(j(314));
    }
    o !== null && o.delete(r), sh(n, l);
  }
  var fh;
  fh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Gn.current) Vn = !0;
    else {
      if ((n.lanes & l) === 0 && (r.flags & 128) === 0) return Vn = !1, _s(n, r, l);
      Vn = (n.flags & 131072) !== 0;
    }
    else Vn = !1, hn && (r.flags & 1048576) !== 0 && jv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        ja(n, r), n = r.pendingProps;
        var c = qr(r, Tn.current);
        En(r, l), c = Ml(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Fn(o) ? (d = !0, tr(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, wd(r), c.updater = Xc, r.stateNode = c, c._reactInternals = r, bs(r, o, n, l), r = ws(null, r, o, !0, d, l)) : (r.tag = 0, hn && d && kc(r), cr(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (ja(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Ey(o), n = ai(o, n), c) {
            case 0:
              r = Wv(null, r, o, n, l);
              break e;
            case 1:
              r = $v(null, r, o, n, l);
              break e;
            case 11:
              r = ea(null, r, o, n, l);
              break e;
            case 14:
              r = Du(null, r, o, ai(o.type, n), l);
              break e;
          }
          throw Error(j(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Wv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), $v(n, r, o, c, l);
      case 3:
        e: {
          if (xo(r), n === null) throw Error(j(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Av(n, r), fs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(j(423)), r), r = Qv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(j(424)), r), r = Qv(n, r, o, l, c);
            break e;
          } else for (Xr = xi(r.stateNode.containerInfo.firstChild), Kr = r, hn = !0, La = null, l = he(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ol(), o === c) {
              r = Ua(n, r, l);
              break e;
            }
            cr(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Hv(r), n === null && Sd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Cc(o, c) ? m = null : d !== null && Cc(o, d) && (r.flags |= 32), zd(n, r), cr(n, r, m, l), r.child;
      case 6:
        return n === null && Sd(r), null;
      case 13:
        return tf(n, r, l);
      case 4:
        return _d(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = Nn(r, null, o, l) : cr(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ea(n, r, o, c, l);
      case 7:
        return cr(n, r, r.pendingProps, l), r.child;
      case 8:
        return cr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return cr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, ze(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Gn.current) {
              r = Ua(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var x = d.dependencies;
            if (x !== null) {
              m = d.child;
              for (var R = x.firstContext; R !== null; ) {
                if (R.context === o) {
                  if (d.tag === 1) {
                    R = Ki(-1, l & -l), R.tag = 2;
                    var A = d.updateQueue;
                    if (A !== null) {
                      A = A.shared;
                      var K = A.pending;
                      K === null ? R.next = R : (R.next = K.next, K.next = R), A.pending = R;
                    }
                  }
                  d.lanes |= l, R = d.alternate, R !== null && (R.lanes |= l), bd(
                    d.return,
                    l,
                    r
                  ), x.lanes |= l;
                  break;
                }
                R = R.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(j(341));
              m.lanes |= l, x = m.alternate, x !== null && (x.lanes |= l), bd(m, l, r), m = d.sibling;
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
          cr(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, En(r, l), c = Ma(c), o = o(c), r.flags |= 1, cr(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), Du(n, r, o, c, l);
      case 15:
        return ht(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ja(n, r), r.tag = 1, Fn(o) ? (n = !0, tr(r)) : n = !1, En(r, l), Jc(r, o, c), bs(r, o, c, l), ws(null, r, o, !0, n, l);
      case 19:
        return ki(n, r, l);
      case 22:
        return Ts(n, r, l);
    }
    throw Error(j(156, r.tag));
  };
  function dh(n, r) {
    return dn(n, r);
  }
  function xy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Aa(n, r, l, o) {
    return new xy(n, r, l, o);
  }
  function qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ey(n) {
    if (typeof n == "function") return qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Be) return 11;
      if (n === Ze) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Aa(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Ps(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") qd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case se:
        return tl(l.children, c, d, r);
      case Tt:
        m = 8, c |= 8;
        break;
      case Ct:
        return n = Aa(12, l, r, c | 2), n.elementType = Ct, n.lanes = d, n;
      case De:
        return n = Aa(13, l, r, c), n.elementType = De, n.lanes = d, n;
      case kt:
        return n = Aa(19, l, r, c), n.elementType = kt, n.lanes = d, n;
      case le:
        return Pl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case ft:
            m = 10;
            break e;
          case zt:
            m = 9;
            break e;
          case Be:
            m = 11;
            break e;
          case Ze:
            m = 14;
            break e;
          case wt:
            m = 16, o = null;
            break e;
        }
        throw Error(j(130, n == null ? n : typeof n, ""));
    }
    return r = Aa(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = Aa(7, n, o, r), n.lanes = l, n;
  }
  function Pl(n, r, l, o) {
    return n = Aa(22, n, o, r), n.elementType = le, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Kd(n, r, l) {
    return n = Aa(6, n, null, r), n.lanes = l, n;
  }
  function cf(n, r, l) {
    return r = Aa(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function ph(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Ju(0), this.expirationTimes = Ju(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ju(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ff(n, r, l, o, c, d, m, x, R) {
    return n = new ph(n, r, l, x, R), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Aa(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, wd(d), n;
  }
  function Cy(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Me, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Xd(n) {
    if (!n) return Rr;
    n = n._reactInternals;
    e: {
      if (ot(n) !== n || n.tag !== 1) throw Error(j(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Fn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(j(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (Fn(l)) return ss(n, l, r);
    }
    return r;
  }
  function vh(n, r, l, o, c, d, m, x, R) {
    return n = ff(l, o, !0, n, c, d, m, x, R), n.context = Xd(null), l = n.current, o = Yn(), c = Oi(l), d = Ki(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Pi(n, c, o), ra(n, o), n;
  }
  function df(n, r, l, o) {
    var c = r.current, d = Yn(), m = Oi(c);
    return l = Xd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (zr(n, c, m, d), Oc(n, c, m)), m;
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
  function Jd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function vf(n, r) {
    Jd(n, r), (n = n.alternate) && Jd(n, r);
  }
  function hh() {
    return null;
  }
  var Uu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Zd(n) {
    this._internalRoot = n;
  }
  hf.prototype.render = Zd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(j(409));
    df(n, r, null, null);
  }, hf.prototype.unmount = Zd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Mu(function() {
        df(null, n, null, null);
      }), r[$i] = null;
    }
  };
  function hf(n) {
    this._internalRoot = n;
  }
  hf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = et();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < Qn.length && r !== 0 && r < Qn[l].priority; l++) ;
      Qn.splice(l, 0, n), l === 0 && qo(n);
    }
  };
  function ep(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function mf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function mh() {
  }
  function by(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var A = pf(m);
          d.call(A);
        };
      }
      var m = vh(r, o, n, 0, null, !1, !1, "", mh);
      return n._reactRootContainer = m, n[$i] = m.current, so(n.nodeType === 8 ? n.parentNode : n), Mu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var x = o;
      o = function() {
        var A = pf(R);
        x.call(A);
      };
    }
    var R = ff(n, 0, !1, null, null, !1, !1, "", mh);
    return n._reactRootContainer = R, n[$i] = R.current, so(n.nodeType === 8 ? n.parentNode : n), Mu(function() {
      df(r, R, l, o);
    }), R;
  }
  function Vs(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var x = c;
        c = function() {
          var R = pf(m);
          x.call(R);
        };
      }
      df(r, m, n, c);
    } else m = by(l, r, n, c, o);
    return pf(m);
  }
  At = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, st()), (Lt & 6) === 0 && (Ro = st() + 500, bi()));
        }
        break;
      case 13:
        Mu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Yn();
            zr(o, n, 1, c);
          }
        }), vf(n, 1);
    }
  }, Qo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Yn();
        zr(r, n, 134217728, l);
      }
      vf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Oi(n), l = ha(n, r);
      if (l !== null) {
        var o = Yn();
        zr(l, n, r, o);
      }
      vf(n, r);
    }
  }, et = function() {
    return Pt;
  }, eo = function(n, r) {
    var l = Pt;
    try {
      return Pt = n, r();
    } finally {
      Pt = l;
    }
  }, Kt = function(n, r, l) {
    switch (r) {
      case "input":
        if (Jn(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = xn(o);
              if (!c) throw Error(j(90));
              yn(o), Jn(o, c);
            }
          }
        }
        break;
      case "textarea":
        Wa(n, l);
        break;
      case "select":
        r = l.value, r != null && _n(n, !!l.multiple, r, !1);
    }
  }, tu = $d, pl = Mu;
  var Ry = { usingClientEntryPoint: !1, Events: [Ae, ni, xn, Hi, eu, $d] }, Bs = { findFiberByHostInstance: hu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, yh = { bundleType: Bs.bundleType, version: Bs.version, rendererPackageName: Bs.rendererPackageName, rendererConfig: Bs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: _e.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Dn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Bs.findFiberByHostInstance || hh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(yh), $r = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ry, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ep(r)) throw Error(j(200));
    return Cy(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!ep(n)) throw Error(j(299));
    var l = !1, o = "", c = Uu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ff(n, 1, !1, null, null, l, !1, o, c), n[$i] = r.current, so(n.nodeType === 8 ? n.parentNode : n), new Zd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(j(188)) : (n = Object.keys(n).join(","), Error(j(268, n)));
    return n = Dn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Mu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!mf(r)) throw Error(j(200));
    return Vs(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!ep(n)) throw Error(j(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Uu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = vh(r, null, n, 1, l ?? null, c, !1, d, m), n[$i] = r.current, so(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new hf(r);
  }, Ia.render = function(n, r, l) {
    if (!mf(r)) throw Error(j(200));
    return Vs(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!mf(n)) throw Error(j(40));
    return n._reactRootContainer ? (Mu(function() {
      Vs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[$i] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = $d, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!mf(l)) throw Error(j(200));
    if (n == null || n._reactInternals === void 0) throw Error(j(38));
    return Vs(n, r, l, !1, o);
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
var cb;
function g_() {
  return cb || (cb = 1, process.env.NODE_ENV !== "production" && (function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var P = rv(), H = Sb(), j = P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ye = !1;
    function Je(e) {
      ye = e;
    }
    function Ye(e) {
      if (!ye) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Nt("warn", e, a);
      }
    }
    function S(e) {
      if (!ye) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        Nt("error", e, a);
      }
    }
    function Nt(e, t, a) {
      {
        var i = j.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var re = 0, de = 1, rt = 2, ae = 3, be = 4, ne = 5, Qe = 6, at = 7, ct = 8, Ut = 9, lt = 10, V = 11, _e = 12, ie = 13, Me = 14, se = 15, Tt = 16, Ct = 17, ft = 18, zt = 19, Be = 21, De = 22, kt = 23, Ze = 24, wt = 25, le = !0, ee = !1, Ne = !1, oe = !1, _ = !1, W = !0, Oe = !0, He = !0, dt = !0, pt = /* @__PURE__ */ new Set(), ut = {}, vt = {};
    function M(e, t) {
      pe(e, t), pe(e + "Capture", t);
    }
    function pe(e, t) {
      ut[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), ut[e] = t;
      {
        var a = e.toLowerCase();
        vt[a] = e, e === "onDoubleClick" && (vt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        pt.add(t[i]);
    }
    var Ge = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", yn = Object.prototype.hasOwnProperty;
    function cn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Rn(e) {
      try {
        return wn(e), !1;
      } catch {
        return !0;
      }
    }
    function wn(e) {
      return "" + e;
    }
    function kn(e, t) {
      if (Rn(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, cn(e)), wn(e);
    }
    function Jn(e) {
      if (Rn(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", cn(e)), wn(e);
    }
    function ci(e, t) {
      if (Rn(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, cn(e)), wn(e);
    }
    function sa(e, t) {
      if (Rn(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, cn(e)), wn(e);
    }
    function Zn(e) {
      if (Rn(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", cn(e)), wn(e);
    }
    function _n(e) {
      if (Rn(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", cn(e)), wn(e);
    }
    var $n = 0, Er = 1, Wa = 2, zn = 3, Cr = 4, ca = 5, $a = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ue = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", je = new RegExp("^[" + fi + "][" + ue + "]*$"), yt = {}, $t = {};
    function an(e) {
      return yn.call($t, e) ? !0 : yn.call(yt, e) ? !1 : je.test(e) ? ($t[e] = !0, !0) : (yt[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function gn(e, t, a) {
      return t !== null ? t.type === $n : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function fn(e, t, a, i) {
      if (a !== null && a.type === $n)
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
    function er(e, t, a, i) {
      if (t === null || typeof t > "u" || fn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case zn:
            return !t;
          case Cr:
            return t === !1;
          case ca:
            return isNaN(t);
          case $a:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function ln(e) {
      return Kt.hasOwnProperty(e) ? Kt[e] : null;
    }
    function qt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === Wa || t === zn || t === Cr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Kt = {}, fa = [
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
      Kt[e] = new qt(
        e,
        $n,
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
      Kt[t] = new qt(
        t,
        Er,
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
      Kt[e] = new qt(
        e,
        Wa,
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
      Kt[e] = new qt(
        e,
        Wa,
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
      Kt[e] = new qt(
        e,
        zn,
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
      Kt[e] = new qt(
        e,
        zn,
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
      Kt[e] = new qt(
        e,
        Cr,
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
      Kt[e] = new qt(
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
      Kt[e] = new qt(
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
    var br = /[\-\:]([a-z])/g, Ra = function(e) {
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
      var t = e.replace(br, Ra);
      Kt[t] = new qt(
        t,
        Er,
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
      var t = e.replace(br, Ra);
      Kt[t] = new qt(
        t,
        Er,
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
      var t = e.replace(br, Ra);
      Kt[t] = new qt(
        t,
        Er,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Kt[e] = new qt(
        e,
        Er,
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
    Kt[Hi] = new qt(
      "xlinkHref",
      Er,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Kt[e] = new qt(
        e,
        Er,
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
    var eu = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, tu = !1;
    function pl(e) {
      !tu && eu.test(e) && (tu = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function vl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        kn(a, t), i.sanitizeURL && pl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Cr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : er(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (er(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === zn)
            return a;
          f = e.getAttribute(s);
        }
        return er(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function nu(e, t, a, i) {
      {
        if (!an(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return kn(a, t), u === "" + a ? a : u;
      }
    }
    function _r(e, t, a, i) {
      var u = ln(t);
      if (!gn(t, u, i)) {
        if (er(t, a, u, i) && (a = null), i || u === null) {
          if (an(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (kn(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === zn ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, g = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var k = u.type, T;
          k === zn || k === Cr && a === !0 ? T = "" : (kn(a, y), T = "" + a, u.sanitizeURL && pl(T.toString())), g ? e.setAttributeNS(g, y, T) : e.setAttribute(y, T);
        }
      }
    }
    var Dr = Symbol.for("react.element"), lr = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Qa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), b = Symbol.for("react.context"), Q = Symbol.for("react.forward_ref"), ve = Symbol.for("react.suspense"), Re = Symbol.for("react.suspense_list"), ot = Symbol.for("react.memo"), tt = Symbol.for("react.lazy"), bt = Symbol.for("react.scope"), St = Symbol.for("react.debug_trace_mode"), Dn = Symbol.for("react.offscreen"), un = Symbol.for("react.legacy_hidden"), dn = Symbol.for("react.cache"), ur = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function st(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var mt = Object.assign, Ka = 0, ru, au, hl, Gu, ml, $r, $o;
    function Nr() {
    }
    Nr.__reactDisabledLog = !0;
    function uc() {
      {
        if (Ka === 0) {
          ru = console.log, au = console.info, hl = console.warn, Gu = console.error, ml = console.group, $r = console.groupCollapsed, $o = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Nr,
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
            log: mt({}, e, {
              value: ru
            }),
            info: mt({}, e, {
              value: au
            }),
            warn: mt({}, e, {
              value: hl
            }),
            error: mt({}, e, {
              value: Gu
            }),
            group: mt({}, e, {
              value: ml
            }),
            groupCollapsed: mt({}, e, {
              value: $r
            }),
            groupEnd: mt({}, e, {
              value: $o
            })
          });
        }
        Ka < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var qu = j.ReactCurrentDispatcher, yl;
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
      var Ku = typeof WeakMap == "function" ? WeakMap : Map;
      Ja = new Ku();
    }
    function iu(e, t) {
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
      s = qu.current, qu.current = null, uc();
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
            } catch (F) {
              i = F;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (F) {
              i = F;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (F) {
            i = F;
          }
          e();
        }
      } catch (F) {
        if (F && i && typeof F.stack == "string") {
          for (var p = F.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, g = v.length - 1; y >= 1 && g >= 0 && p[y] !== v[g]; )
            g--;
          for (; y >= 1 && g >= 0; y--, g--)
            if (p[y] !== v[g]) {
              if (y !== 1 || g !== 1)
                do
                  if (y--, g--, g < 0 || p[y] !== v[g]) {
                    var k = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", e.displayName)), typeof e == "function" && Ja.set(e, k), k;
                  }
                while (y >= 1 && g >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, qu.current = s, oc(), Error.prepareStackTrace = u;
      }
      var T = e ? e.displayName || e.name : "", U = T ? da(T) : "";
      return typeof e == "function" && Ja.set(e, U), U;
    }
    function gl(e, t, a) {
      return iu(e, !0);
    }
    function Xu(e, t, a) {
      return iu(e, !1);
    }
    function Ju(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Pi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return iu(e, Ju(e));
      if (typeof e == "string")
        return da(e);
      switch (e) {
        case ve:
          return da("Suspense");
        case Re:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Q:
            return Xu(e.render);
          case ot:
            return Pi(e.type, t, a);
          case tt: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Pi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function qf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ne:
          return da(e.type);
        case Tt:
          return da("Lazy");
        case ie:
          return da("Suspense");
        case zt:
          return da("SuspenseList");
        case re:
        case rt:
        case se:
          return Xu(e.type);
        case V:
          return Xu(e.type.render);
        case de:
          return gl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += qf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Pt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Zu(e) {
      return e.displayName || "Context";
    }
    function At(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case di:
          return "Fragment";
        case lr:
          return "Portal";
        case pi:
          return "Profiler";
        case Qa:
          return "StrictMode";
        case ve:
          return "Suspense";
        case Re:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case b:
            var t = e;
            return Zu(t) + ".Consumer";
          case vi:
            var a = e;
            return Zu(a._context) + ".Provider";
          case Q:
            return Pt(e, e.render, "ForwardRef");
          case ot:
            var i = e.displayName || null;
            return i !== null ? i : At(e.type) || "Memo";
          case tt: {
            var u = e, s = u._payload, f = u._init;
            try {
              return At(f(s));
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
    function et(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Ze:
          return "Cache";
        case Ut:
          var i = a;
          return hi(i) + ".Consumer";
        case lt:
          var u = a;
          return hi(u._context) + ".Provider";
        case ft:
          return "DehydratedFragment";
        case V:
          return Qo(a, a.render, "ForwardRef");
        case at:
          return "Fragment";
        case ne:
          return a;
        case be:
          return "Portal";
        case ae:
          return "Root";
        case Qe:
          return "Text";
        case Tt:
          return At(a);
        case ct:
          return a === Qa ? "StrictMode" : "Mode";
        case De:
          return "Offscreen";
        case _e:
          return "Profiler";
        case Be:
          return "Scope";
        case ie:
          return "Suspense";
        case zt:
          return "SuspenseList";
        case wt:
          return "TracingMarker";
        // The display name for this tags come from the user-provided type:
        case de:
        case re:
        case Ct:
        case rt:
        case Me:
        case se:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var eo = j.ReactDebugCurrentFrame, or = null, mi = !1;
    function Or() {
      {
        if (or === null)
          return null;
        var e = or._debugOwner;
        if (e !== null && typeof e < "u")
          return et(e);
      }
      return null;
    }
    function yi() {
      return or === null ? "" : Vi(or);
    }
    function pn() {
      eo.getCurrentStack = null, or = null, mi = !1;
    }
    function Xt(e) {
      eo.getCurrentStack = e === null ? null : yi, or = e, mi = !1;
    }
    function Sl() {
      return or;
    }
    function Qn(e) {
      mi = e;
    }
    function Lr(e) {
      return "" + e;
    }
    function Ta(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return _n(e), e;
        default:
          return "";
      }
    }
    var lu = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Go(e, t) {
      lu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function qo(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function xl(e) {
      return e._valueTracker;
    }
    function uu(e) {
      e._valueTracker = null;
    }
    function Kf(e) {
      var t = "";
      return e && (qo(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function wa(e) {
      var t = qo(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      _n(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            _n(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            _n(p), i = "" + p;
          },
          stopTracking: function() {
            uu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Za(e) {
      xl(e) || (e._valueTracker = wa(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = xl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Kf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function ka(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var to = !1, no = !1, El = !1, ou = !1;
    function ro(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ao(e, t) {
      var a = e, i = t.checked, u = mt({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ei(e, t) {
      Go("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !no && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), no = !0), t.value !== void 0 && t.defaultValue !== void 0 && !to && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), to = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Ta(t.value != null ? t.value : i),
        controlled: ro(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && _r(a, "checked", i, !1);
    }
    function C(e, t) {
      var a = e;
      {
        var i = ro(t);
        !a._wrapperState.controlled && i && !ou && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), ou = !0), a._wrapperState.controlled && !i && !El && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), El = !0);
      }
      h(e, t);
      var u = Ta(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Lr(u)) : a.value !== Lr(u) && (a.value = Lr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Pe(a, t.type, u) : t.hasOwnProperty("defaultValue") && Pe(a, t.type, Ta(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
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
    function B(e, t) {
      var a = e;
      C(a, t), te(a, t);
    }
    function te(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        kn(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Uh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), C(f, p);
          }
        }
      }
    }
    function Pe(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || ka(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Lr(e._wrapperState.initialValue) : e.defaultValue !== Lr(a) && (e.defaultValue = Lr(a)));
    }
    var fe = !1, We = !1, Rt = !1;
    function Ft(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? P.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || We || (We = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Rt || (Rt = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !fe && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), fe = !0);
    }
    function on(e, t) {
      t.value != null && e.setAttribute("value", Lr(Ta(t.value)));
    }
    var Jt = Array.isArray;
    function gt(e) {
      return Jt(e);
    }
    var Zt;
    Zt = !1;
    function Sn() {
      var e = Or();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Cl = ["value", "defaultValue"];
    function Ko(e) {
      {
        Go("select", e);
        for (var t = 0; t < Cl.length; t++) {
          var a = Cl[t];
          if (e[a] != null) {
            var i = gt(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Sn()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Sn());
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
        for (var g = Lr(Ta(a)), k = null, T = 0; T < u.length; T++) {
          if (u[T].value === g) {
            u[T].selected = !0, i && (u[T].defaultSelected = !0);
            return;
          }
          k === null && !u[T].disabled && (k = u[T]);
        }
        k !== null && (k.selected = !0);
      }
    }
    function Xo(e, t) {
      return mt({}, t, {
        value: void 0
      });
    }
    function su(e, t) {
      var a = e;
      Ko(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Zt && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Zt = !0);
    }
    function Xf(e, t) {
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
    function Jf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var av = !1;
    function Zf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = mt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Lr(a._wrapperState.initialValue)
      });
      return i;
    }
    function ed(e, t) {
      var a = e;
      Go("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !av && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), av = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (gt(u)) {
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
        initialValue: Ta(i)
      };
    }
    function iv(e, t) {
      var a = e, i = Ta(t.value), u = Ta(t.defaultValue);
      if (i != null) {
        var s = Lr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Lr(u));
    }
    function lv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Zm(e, t) {
      iv(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", td = "http://www.w3.org/1998/Math/MathML", nd = "http://www.w3.org/2000/svg";
    function rd(e) {
      switch (e) {
        case "svg":
          return nd;
        case "math":
          return td;
        default:
          return Ii;
      }
    }
    function ad(e, t) {
      return e == null || e === Ii ? rd(t) : e === nd && t === "foreignObject" ? Ii : e;
    }
    var uv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, cc, ov = uv(function(e, t) {
      if (e.namespaceURI === nd && !("innerHTML" in e)) {
        cc = cc || document.createElement("div"), cc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = cc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Qr = 1, Yi = 3, An = 8, Wi = 9, id = 11, io = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Yi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Jo = {
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
    }, Zo = {
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
    function sv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var cv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Zo).forEach(function(e) {
      cv.forEach(function(t) {
        Zo[sv(t, e)] = Zo[e];
      });
    });
    function fc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Zo.hasOwnProperty(e) && Zo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var fv = /([A-Z])/g, dv = /^ms-/;
    function lo(e) {
      return e.replace(fv, "-$1").toLowerCase().replace(dv, "-ms-");
    }
    var pv = function() {
    };
    {
      var ey = /^(?:webkit|moz|o)[A-Z]/, ty = /^-ms-/, vv = /-(.)/g, ld = /;\s*$/, Si = {}, cu = {}, hv = !1, es = !1, ny = function(e) {
        return e.replace(vv, function(t, a) {
          return a.toUpperCase();
        });
      }, mv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ny(e.replace(ty, "ms-"))
        ));
      }, ud = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, od = function(e, t) {
        cu.hasOwnProperty(t) && cu[t] || (cu[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(ld, "")));
      }, yv = function(e, t) {
        hv || (hv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, gv = function(e, t) {
        es || (es = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      pv = function(e, t) {
        e.indexOf("-") > -1 ? mv(e) : ey.test(e) ? ud(e) : ld.test(t) && od(e, t), typeof t == "number" && (isNaN(t) ? yv(e, t) : isFinite(t) || gv(e, t));
      };
    }
    var Sv = pv;
    function ry(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : lo(i)) + ":", t += fc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function xv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || Sv(i, t[i]);
          var s = fc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ay(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Ev(e) {
      var t = {};
      for (var a in e)
        for (var i = Jo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function iy(e, t) {
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
            u[v] = !0, S("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ay(e[f]) ? "Removing" : "Updating", f, p);
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
    }, ts = mt({
      menuitem: !0
    }, ti), Cv = "__html";
    function dc(e, t) {
      if (t) {
        if (ts[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
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
    function bl(e, t) {
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
    var ns = {
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
    }, uo = {}, ly = new RegExp("^(aria)-[" + ue + "]*$"), oo = new RegExp("^(aria)[A-Z][" + ue + "]*$");
    function sd(e, t) {
      {
        if (yn.call(uo, t) && uo[t])
          return !0;
        if (oo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = pc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), uo[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), uo[t] = !0, !0;
        }
        if (ly.test(t)) {
          var u = t.toLowerCase(), s = pc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return uo[t] = !0, !1;
          if (t !== s)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), uo[t] = !0, !0;
        }
      }
      return !0;
    }
    function rs(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = sd(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function cd(e, t) {
      bl(e, t) || rs(e, t);
    }
    var fd = !1;
    function vc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !fd && (fd = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var fu = function() {
    };
    {
      var sr = {}, dd = /^on./, hc = /^on[^A-Z]/, bv = new RegExp("^(aria)-[" + ue + "]*$"), Rv = new RegExp("^(aria)[A-Z][" + ue + "]*$");
      fu = function(e, t, a, i) {
        if (yn.call(sr, t) && sr[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), sr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, p), sr[t] = !0, !0;
          if (dd.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), sr[t] = !0, !0;
        } else if (dd.test(t))
          return hc.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), sr[t] = !0, !0;
        if (bv.test(t) || Rv.test(t))
          return !0;
        if (u === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), sr[t] = !0, !0;
        if (u === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), sr[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), sr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), sr[t] = !0, !0;
        var v = ln(t), y = v !== null && v.type === $n;
        if (ns.hasOwnProperty(u)) {
          var g = ns[u];
          if (g !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, g), sr[t] = !0, !0;
        } else if (!y && t !== u)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), sr[t] = !0, !0;
        return typeof a == "boolean" && fn(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), sr[t] = !0, !0) : y ? !0 : fn(t, a, v, !1) ? (sr[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === zn && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), sr[t] = !0), !0);
      };
    }
    var Tv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = fu(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function wv(e, t, a) {
      bl(e, t) || Tv(e, t, a);
    }
    var pd = 1, mc = 2, _a = 4, vd = pd | mc | _a, du = null;
    function uy(e) {
      du !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), du = e;
    }
    function oy() {
      du === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), du = null;
    }
    function as(e) {
      return e === du;
    }
    function hd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var yc = null, pu = null, Qt = null;
    function gc(e) {
      var t = No(e);
      if (t) {
        if (typeof yc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Uh(a);
          yc(t.stateNode, t.type, i);
        }
      }
    }
    function Sc(e) {
      yc = e;
    }
    function so(e) {
      pu ? Qt ? Qt.push(e) : Qt = [e] : pu = e;
    }
    function kv() {
      return pu !== null || Qt !== null;
    }
    function xc() {
      if (pu) {
        var e = pu, t = Qt;
        if (pu = null, Qt = null, gc(e), t)
          for (var a = 0; a < t.length; a++)
            gc(t[a]);
      }
    }
    var co = function(e, t) {
      return e(t);
    }, is = function() {
    }, Rl = !1;
    function _v() {
      var e = kv();
      e && (is(), xc());
    }
    function Dv(e, t, a) {
      if (Rl)
        return e(t, a);
      Rl = !0;
      try {
        return co(e, t, a);
      } finally {
        Rl = !1, _v();
      }
    }
    function sy(e, t, a) {
      co = e, is = a;
    }
    function Nv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Ec(e, t, a) {
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
          return !!(a.disabled && Nv(t));
        default:
          return !1;
      }
    }
    function Tl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Uh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Ec(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var ls = !1;
    if (Ge)
      try {
        var vu = {};
        Object.defineProperty(vu, "passive", {
          get: function() {
            ls = !0;
          }
        }), window.addEventListener("test", vu, vu), window.removeEventListener("test", vu, vu);
      } catch {
        ls = !1;
      }
    function Cc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (g) {
        this.onError(g);
      }
    }
    var bc = Cc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var md = document.createElement("react");
      bc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var g = document.createEvent("Event"), k = !1, T = !0, U = window.event, F = Object.getOwnPropertyDescriptor(window, "event");
        function I() {
          md.removeEventListener(Y, Ve, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = U);
        }
        var me = Array.prototype.slice.call(arguments, 3);
        function Ve() {
          k = !0, I(), a.apply(i, me), T = !1;
        }
        var Ue, jt = !1, _t = !1;
        function N(O) {
          if (Ue = O.error, jt = !0, Ue === null && O.colno === 0 && O.lineno === 0 && (_t = !0), O.defaultPrevented && Ue != null && typeof Ue == "object")
            try {
              Ue._suppressLogging = !0;
            } catch {
            }
        }
        var Y = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", N), md.addEventListener(Y, Ve, !1), g.initEvent(Y, !1, !1), md.dispatchEvent(g), F && Object.defineProperty(window, "event", F), k && T && (jt ? _t && (Ue = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ue = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ue)), window.removeEventListener("error", N), !k)
          return I(), Cc.apply(this, arguments);
      };
    }
    var Ov = bc, fo = !1, Rc = null, po = !1, xi = null, Lv = {
      onError: function(e) {
        fo = !0, Rc = e;
      }
    };
    function wl(e, t, a, i, u, s, f, p, v) {
      fo = !1, Rc = null, Ov.apply(Lv, arguments);
    }
    function Ei(e, t, a, i, u, s, f, p, v) {
      if (wl.apply(this, arguments), fo) {
        var y = os();
        po || (po = !0, xi = y);
      }
    }
    function us() {
      if (po) {
        var e = xi;
        throw po = !1, xi = null, e;
      }
    }
    function $i() {
      return fo;
    }
    function os() {
      if (fo) {
        var e = Rc;
        return fo = !1, Rc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function vo(e) {
      return e._reactInternals;
    }
    function cy(e) {
      return e._reactInternals !== void 0;
    }
    function hu(e, t) {
      e._reactInternals = t;
    }
    var Ae = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), xn = (
      /*                    */
      2
    ), Ot = (
      /*                       */
      4
    ), Da = (
      /*                */
      16
    ), Na = (
      /*                 */
      32
    ), sn = (
      /*                     */
      64
    ), ze = (
      /*                   */
      128
    ), Rr = (
      /*            */
      256
    ), Tn = (
      /*                          */
      512
    ), Gn = (
      /*                     */
      1024
    ), Gr = (
      /*                      */
      2048
    ), qr = (
      /*                    */
      4096
    ), Fn = (
      /*                   */
      8192
    ), ho = (
      /*             */
      16384
    ), Mv = (
      /*               */
      32767
    ), ss = (
      /*                   */
      32768
    ), tr = (
      /*                */
      65536
    ), Tc = (
      /* */
      131072
    ), Ci = (
      /*                       */
      1048576
    ), mo = (
      /*                    */
      2097152
    ), Qi = (
      /*                 */
      4194304
    ), wc = (
      /*                */
      8388608
    ), kl = (
      /*               */
      16777216
    ), bi = (
      /*              */
      33554432
    ), _l = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Ot | Gn | 0
    ), Dl = xn | Ot | Da | Na | Tn | qr | Fn, Nl = Ot | sn | Tn | Fn, Gi = Gr | Da, Hn = Qi | wc | mo, Oa = j.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (xn | qr)) !== Ae && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === ae ? a : null;
    }
    function Ri(e) {
      if (e.tag === ie) {
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
    function Ti(e) {
      return e.tag === ae ? e.stateNode.containerInfo : null;
    }
    function mu(e) {
      return pa(e) === e;
    }
    function jv(e) {
      {
        var t = Oa.current;
        if (t !== null && t.tag === de) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", et(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = vo(e);
      return u ? pa(u) === u : !1;
    }
    function kc(e) {
      if (pa(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function _c(e) {
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
              return kc(s), e;
            if (v === u)
              return kc(s), t;
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
      if (i.tag !== ae)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = _c(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === ne || e.tag === Qe)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Xr(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function hn(e) {
      var t = _c(e);
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === ne || e.tag === Qe)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== be) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var yd = H.unstable_scheduleCallback, Uv = H.unstable_cancelCallback, gd = H.unstable_shouldYield, Sd = H.unstable_requestPaint, qn = H.unstable_now, Dc = H.unstable_getCurrentPriorityLevel, cs = H.unstable_ImmediatePriority, Ol = H.unstable_UserBlockingPriority, qi = H.unstable_NormalPriority, fy = H.unstable_LowPriority, yu = H.unstable_IdlePriority, Nc = H.unstable_yieldValue, zv = H.unstable_setDisableYieldValue, gu = null, Nn = null, he = null, va = !1, Jr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function yo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Oe && (e = mt({}, e, {
          getLaneLabelMap: Su,
          injectProfilingHooks: Ma
        })), gu = t.inject(e), Nn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function xd(e, t) {
      if (Nn && typeof Nn.onScheduleFiberRoot == "function")
        try {
          Nn.onScheduleFiberRoot(gu, e, t);
        } catch (a) {
          va || (va = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function Ed(e, t) {
      if (Nn && typeof Nn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & ze) === ze;
          if (He) {
            var i;
            switch (t) {
              case Mr:
                i = cs;
                break;
              case ki:
                i = Ol;
                break;
              case ja:
                i = qi;
                break;
              case Ua:
                i = yu;
                break;
              default:
                i = qi;
                break;
            }
            Nn.onCommitFiberRoot(gu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, S("React instrumentation encountered an error: %s", u));
        }
    }
    function Cd(e) {
      if (Nn && typeof Nn.onPostCommitFiberRoot == "function")
        try {
          Nn.onPostCommitFiberRoot(gu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function bd(e) {
      if (Nn && typeof Nn.onCommitFiberUnmount == "function")
        try {
          Nn.onCommitFiberUnmount(gu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function En(e) {
      if (typeof Nc == "function" && (zv(e), Je(e)), Nn && typeof Nn.setStrictMode == "function")
        try {
          Nn.setStrictMode(gu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Ma(e) {
      he = e;
    }
    function Su() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Cu; a++) {
          var i = Pv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Rd(e) {
      he !== null && typeof he.markCommitStarted == "function" && he.markCommitStarted(e);
    }
    function Td() {
      he !== null && typeof he.markCommitStopped == "function" && he.markCommitStopped();
    }
    function ha(e) {
      he !== null && typeof he.markComponentRenderStarted == "function" && he.markComponentRenderStarted(e);
    }
    function ma() {
      he !== null && typeof he.markComponentRenderStopped == "function" && he.markComponentRenderStopped();
    }
    function wd(e) {
      he !== null && typeof he.markComponentPassiveEffectMountStarted == "function" && he.markComponentPassiveEffectMountStarted(e);
    }
    function Av() {
      he !== null && typeof he.markComponentPassiveEffectMountStopped == "function" && he.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      he !== null && typeof he.markComponentPassiveEffectUnmountStarted == "function" && he.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      he !== null && typeof he.markComponentPassiveEffectUnmountStopped == "function" && he.markComponentPassiveEffectUnmountStopped();
    }
    function Oc(e) {
      he !== null && typeof he.markComponentLayoutEffectMountStarted == "function" && he.markComponentLayoutEffectMountStarted(e);
    }
    function Fv() {
      he !== null && typeof he.markComponentLayoutEffectMountStopped == "function" && he.markComponentLayoutEffectMountStopped();
    }
    function fs(e) {
      he !== null && typeof he.markComponentLayoutEffectUnmountStarted == "function" && he.markComponentLayoutEffectUnmountStarted(e);
    }
    function kd() {
      he !== null && typeof he.markComponentLayoutEffectUnmountStopped == "function" && he.markComponentLayoutEffectUnmountStopped();
    }
    function ds(e, t, a) {
      he !== null && typeof he.markComponentErrored == "function" && he.markComponentErrored(e, t, a);
    }
    function wi(e, t, a) {
      he !== null && typeof he.markComponentSuspended == "function" && he.markComponentSuspended(e, t, a);
    }
    function ps(e) {
      he !== null && typeof he.markLayoutEffectsStarted == "function" && he.markLayoutEffectsStarted(e);
    }
    function vs() {
      he !== null && typeof he.markLayoutEffectsStopped == "function" && he.markLayoutEffectsStopped();
    }
    function xu(e) {
      he !== null && typeof he.markPassiveEffectsStarted == "function" && he.markPassiveEffectsStarted(e);
    }
    function _d() {
      he !== null && typeof he.markPassiveEffectsStopped == "function" && he.markPassiveEffectsStopped();
    }
    function Eu(e) {
      he !== null && typeof he.markRenderStarted == "function" && he.markRenderStarted(e);
    }
    function Hv() {
      he !== null && typeof he.markRenderYielded == "function" && he.markRenderYielded();
    }
    function Lc() {
      he !== null && typeof he.markRenderStopped == "function" && he.markRenderStopped();
    }
    function Cn(e) {
      he !== null && typeof he.markRenderScheduled == "function" && he.markRenderScheduled(e);
    }
    function Mc(e, t) {
      he !== null && typeof he.markForceUpdateScheduled == "function" && he.markForceUpdateScheduled(e, t);
    }
    function hs(e, t) {
      he !== null && typeof he.markStateUpdateScheduled == "function" && he.markStateUpdateScheduled(e, t);
    }
    var Fe = (
      /*                         */
      0
    ), xt = (
      /*                 */
      1
    ), Vt = (
      /*                    */
      2
    ), en = (
      /*               */
      8
    ), Bt = (
      /*              */
      16
    ), Pn = Math.clz32 ? Math.clz32 : ms, nr = Math.log, jc = Math.LN2;
    function ms(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (nr(t) / jc | 0) | 0;
    }
    var Cu = 31, G = (
      /*                        */
      0
    ), Ht = (
      /*                          */
      0
    ), qe = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), ri = (
      /*             */
      4
    ), Tr = (
      /*            */
      8
    ), On = (
      /*                     */
      16
    ), Xi = (
      /*                */
      32
    ), jl = (
      /*                       */
      4194240
    ), bu = (
      /*                        */
      64
    ), Uc = (
      /*                        */
      128
    ), zc = (
      /*                        */
      256
    ), Ac = (
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
    ), Ru = (
      /*                       */
      32768
    ), Ic = (
      /*                       */
      65536
    ), go = (
      /*                       */
      131072
    ), So = (
      /*                       */
      262144
    ), Yc = (
      /*                       */
      524288
    ), ys = (
      /*                       */
      1048576
    ), Wc = (
      /*                       */
      2097152
    ), gs = (
      /*                            */
      130023424
    ), Tu = (
      /*                             */
      4194304
    ), $c = (
      /*                             */
      8388608
    ), Ss = (
      /*                             */
      16777216
    ), Qc = (
      /*                             */
      33554432
    ), Gc = (
      /*                             */
      67108864
    ), Dd = Tu, xs = (
      /*          */
      134217728
    ), Nd = (
      /*                          */
      268435455
    ), Es = (
      /*               */
      268435456
    ), wu = (
      /*                        */
      536870912
    ), Zr = (
      /*                   */
      1073741824
    );
    function Pv(e) {
      {
        if (e & qe)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & Tr)
          return "DefaultHydration";
        if (e & On)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & jl)
          return "Transition";
        if (e & gs)
          return "Retry";
        if (e & xs)
          return "SelectiveHydration";
        if (e & Es)
          return "IdleHydration";
        if (e & wu)
          return "Idle";
        if (e & Zr)
          return "Offscreen";
      }
    }
    var rn = -1, ku = bu, qc = Tu;
    function Cs(e) {
      switch (Ul(e)) {
        case qe:
          return qe;
        case Ml:
          return Ml;
        case ri:
          return ri;
        case Tr:
          return Tr;
        case On:
          return On;
        case Xi:
          return Xi;
        case bu:
        case Uc:
        case zc:
        case Ac:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Ru:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case Wc:
          return e & jl;
        case Tu:
        case $c:
        case Ss:
        case Qc:
        case Gc:
          return e & gs;
        case xs:
          return xs;
        case Es:
          return Es;
        case wu:
          return wu;
        case Zr:
          return Zr;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kc(e, t) {
      var a = e.pendingLanes;
      if (a === G)
        return G;
      var i = G, u = e.suspendedLanes, s = e.pingedLanes, f = a & Nd;
      if (f !== G) {
        var p = f & ~u;
        if (p !== G)
          i = Cs(p);
        else {
          var v = f & s;
          v !== G && (i = Cs(v));
        }
      } else {
        var y = a & ~u;
        y !== G ? i = Cs(y) : s !== G && (i = Cs(s));
      }
      if (i === G)
        return G;
      if (t !== G && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === G) {
        var g = Ul(i), k = Ul(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          g >= k || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          g === On && (k & jl) !== G
        )
          return t;
      }
      (i & ri) !== G && (i |= a & On);
      var T = e.entangledLanes;
      if (T !== G)
        for (var U = e.entanglements, F = i & T; F > 0; ) {
          var I = Vn(F), me = 1 << I;
          i |= U[I], F &= ~me;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = rn; t > 0; ) {
        var u = Vn(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Od(e, t) {
      switch (e) {
        case qe:
        case Ml:
        case ri:
          return t + 250;
        case Tr:
        case On:
        case Xi:
        case bu:
        case Uc:
        case zc:
        case Ac:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Ru:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case Wc:
          return t + 5e3;
        case Tu:
        case $c:
        case Ss:
        case Qc:
        case Gc:
          return rn;
        case xs:
        case Es:
        case wu:
        case Zr:
          return rn;
        default:
          return S("Should have found matching lanes. This is a bug in React."), rn;
      }
    }
    function Xc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Vn(f), v = 1 << p, y = s[p];
        y === rn ? ((v & i) === G || (v & u) !== G) && (s[p] = Od(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Vv(e) {
      return Cs(e.pendingLanes);
    }
    function Jc(e) {
      var t = e.pendingLanes & ~Zr;
      return t !== G ? t : t & Zr ? Zr : G;
    }
    function Bv(e) {
      return (e & qe) !== G;
    }
    function bs(e) {
      return (e & Nd) !== G;
    }
    function _u(e) {
      return (e & gs) === e;
    }
    function Ld(e) {
      var t = qe | ri | On;
      return (e & t) === G;
    }
    function Md(e) {
      return (e & jl) === e;
    }
    function Zc(e, t) {
      var a = Ml | ri | Tr | On;
      return (t & a) !== G;
    }
    function Iv(e, t) {
      return (t & e.expiredLanes) !== G;
    }
    function jd(e) {
      return (e & jl) !== G;
    }
    function Ud() {
      var e = ku;
      return ku <<= 1, (ku & jl) === G && (ku = bu), e;
    }
    function Yv() {
      var e = qc;
      return qc <<= 1, (qc & gs) === G && (qc = Tu), e;
    }
    function Ul(e) {
      return e & -e;
    }
    function Rs(e) {
      return Ul(e);
    }
    function Vn(e) {
      return 31 - Pn(e);
    }
    function cr(e) {
      return Vn(e);
    }
    function ea(e, t) {
      return (e & t) !== G;
    }
    function Du(e, t) {
      return (e & t) === t;
    }
    function ht(e, t) {
      return e | t;
    }
    function Ts(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function Wv(e) {
      return e;
    }
    function $v(e, t) {
      return e !== Ht && e < t ? e : t;
    }
    function ws(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function xo(e, t, a) {
      e.pendingLanes |= t, t !== wu && (e.suspendedLanes = G, e.pingedLanes = G);
      var i = e.eventTimes, u = cr(t);
      i[u] = a;
    }
    function Qv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Vn(i), s = 1 << u;
        a[u] = rn, i &= ~s;
      }
    }
    function ef(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Ad(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = G, e.pingedLanes = G, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Vn(f), v = 1 << p;
        i[p] = G, u[p] = rn, s[p] = rn, f &= ~v;
      }
    }
    function tf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = Vn(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Fd(e, t) {
      var a = Ul(t), i;
      switch (a) {
        case ri:
          i = Ml;
          break;
        case On:
          i = Tr;
          break;
        case bu:
        case Uc:
        case zc:
        case Ac:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Ru:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case Wc:
        case Tu:
        case $c:
        case Ss:
        case Qc:
        case Gc:
          i = Xi;
          break;
        case wu:
          i = Es;
          break;
        default:
          i = Ht;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Ht ? Ht : i;
    }
    function ks(e, t, a) {
      if (Jr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = cr(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Gv(e, t) {
      if (Jr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = cr(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Hd(e, t) {
      return null;
    }
    var Mr = qe, ki = ri, ja = On, Ua = wu, _s = Ht;
    function za() {
      return _s;
    }
    function Bn(e) {
      _s = e;
    }
    function qv(e, t) {
      var a = _s;
      try {
        return _s = e, t();
      } finally {
        _s = a;
      }
    }
    function Kv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ds(e, t) {
      return e > t ? e : t;
    }
    function rr(e, t) {
      return e !== 0 && e < t;
    }
    function Xv(e) {
      var t = Ul(e);
      return rr(Mr, t) ? rr(ki, t) ? bs(t) ? ja : Ua : ki : Mr;
    }
    function nf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ns;
    function wr(e) {
      Ns = e;
    }
    function dy(e) {
      Ns(e);
    }
    var Ce;
    function Eo(e) {
      Ce = e;
    }
    var rf;
    function Jv(e) {
      rf = e;
    }
    var Zv;
    function Os(e) {
      Zv = e;
    }
    var Ls;
    function Pd(e) {
      Ls = e;
    }
    var af = !1, Ms = [], Ji = null, _i = null, Di = null, Ln = /* @__PURE__ */ new Map(), jr = /* @__PURE__ */ new Map(), Ur = [], eh = [
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
    function th(e) {
      return eh.indexOf(e) > -1;
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
    function Vd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Ji = null;
          break;
        case "dragenter":
        case "dragleave":
          _i = null;
          break;
        case "mouseover":
        case "mouseout":
          Di = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Ln.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          jr.delete(i);
          break;
        }
      }
    }
    function ta(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ii(t, a, i, u, s);
        if (t !== null) {
          var p = No(t);
          p !== null && Ce(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function py(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Ji = ta(Ji, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return _i = ta(_i, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return Di = ta(Di, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return Ln.set(y, ta(Ln.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var g = u, k = g.pointerId;
          return jr.set(k, ta(jr.get(k) || null, e, t, a, i, g)), !0;
        }
      }
      return !1;
    }
    function Bd(e) {
      var t = Ws(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === ie) {
            var u = Ri(a);
            if (u !== null) {
              e.blockedOn = u, Ls(e.priority, function() {
                rf(a);
              });
              return;
            }
          } else if (i === ae) {
            var s = a.stateNode;
            if (nf(s)) {
              e.blockedOn = Ti(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function nh(e) {
      for (var t = Zv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Ur.length && rr(t, Ur[i].priority); i++)
        ;
      Ur.splice(i, 0, a), i === 0 && Bd(a);
    }
    function js(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = bo(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          uy(s), u.target.dispatchEvent(s), oy();
        } else {
          var f = No(i);
          return f !== null && Ce(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Id(e, t, a) {
      js(e) && a.delete(t);
    }
    function vy() {
      af = !1, Ji !== null && js(Ji) && (Ji = null), _i !== null && js(_i) && (_i = null), Di !== null && js(Di) && (Di = null), Ln.forEach(Id), jr.forEach(Id);
    }
    function zl(e, t) {
      e.blockedOn === t && (e.blockedOn = null, af || (af = !0, H.unstable_scheduleCallback(H.unstable_NormalPriority, vy)));
    }
    function Nu(e) {
      if (Ms.length > 0) {
        zl(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && zl(Ji, e), _i !== null && zl(_i, e), Di !== null && zl(Di, e);
      var i = function(p) {
        return zl(p, e);
      };
      Ln.forEach(i), jr.forEach(i);
      for (var u = 0; u < Ur.length; u++) {
        var s = Ur[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Ur.length > 0; ) {
        var f = Ur[0];
        if (f.blockedOn !== null)
          break;
        Bd(f), f.blockedOn === null && Ur.shift();
      }
    }
    var fr = j.ReactCurrentBatchConfig, Lt = !0;
    function Kn(e) {
      Lt = !!e;
    }
    function In() {
      return Lt;
    }
    function dr(e, t, a) {
      var i = lf(t), u;
      switch (i) {
        case Mr:
          u = ya;
          break;
        case ki:
          u = Co;
          break;
        case ja:
        default:
          u = Mn;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = za(), s = fr.transition;
      fr.transition = null;
      try {
        Bn(Mr), Mn(e, t, a, i);
      } finally {
        Bn(u), fr.transition = s;
      }
    }
    function Co(e, t, a, i) {
      var u = za(), s = fr.transition;
      fr.transition = null;
      try {
        Bn(ki), Mn(e, t, a, i);
      } finally {
        Bn(u), fr.transition = s;
      }
    }
    function Mn(e, t, a, i) {
      Lt && Us(e, t, a, i);
    }
    function Us(e, t, a, i) {
      var u = bo(e, t, a, i);
      if (u === null) {
        Oy(e, t, i, Ni, a), Vd(e, i);
        return;
      }
      if (py(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Vd(e, i), t & _a && th(e)) {
        for (; u !== null; ) {
          var s = No(u);
          s !== null && dy(s);
          var f = bo(e, t, a, i);
          if (f === null && Oy(e, t, i, Ni, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Oy(e, t, i, null, a);
    }
    var Ni = null;
    function bo(e, t, a, i) {
      Ni = null;
      var u = hd(i), s = Ws(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === ie) {
            var v = Ri(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === ae) {
            var y = f.stateNode;
            if (nf(y))
              return Ti(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Ni = s, null;
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
          return ki;
        case "message": {
          var t = Dc();
          switch (t) {
            case cs:
              return Mr;
            case Ol:
              return ki;
            case qi:
            case fy:
              return ja;
            case yu:
              return Ua;
            default:
              return ja;
          }
        }
        default:
          return ja;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Yd(e, t, a, i) {
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
    var ga = null, To = null, Ou = null;
    function Al(e) {
      return ga = e, To = As(), !0;
    }
    function uf() {
      ga = null, To = null, Ou = null;
    }
    function Zi() {
      if (Ou)
        return Ou;
      var e, t = To, a = t.length, i, u = As(), s = u.length;
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
    function wo() {
      return !0;
    }
    function Fs() {
      return !1;
    }
    function kr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = wo : this.isDefaultPrevented = Fs, this.isPropagationStopped = Fs, this;
      }
      return mt(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = wo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = wo);
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
        isPersistent: wo
      }), t;
    }
    var Yn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Oi = kr(Yn), zr = mt({}, Yn, {
      view: 0,
      detail: 0
    }), ra = kr(zr), of, Hs, Lu;
    function hy(e) {
      e !== Lu && (Lu && e.type === "mousemove" ? (of = e.screenX - Lu.screenX, Hs = e.screenY - Lu.screenY) : (of = 0, Hs = 0), Lu = e);
    }
    var li = mt({}, zr, {
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
      getModifierState: mn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (hy(e), of);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Hs;
      }
    }), Wd = kr(li), $d = mt({}, li, {
      dataTransfer: 0
    }), Mu = kr($d), Qd = mt({}, zr, {
      relatedTarget: 0
    }), el = kr(Qd), rh = mt({}, Yn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ah = kr(rh), Gd = mt({}, Yn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), sf = kr(Gd), my = mt({}, Yn, {
      data: 0
    }), ih = kr(my), lh = ih, uh = {
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
    function yy(e) {
      if (e.key) {
        var t = uh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Fl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? ju[e.keyCode] || "Unidentified" : "";
    }
    var ko = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function oh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = ko[e];
      return i ? !!a[i] : !1;
    }
    function mn(e) {
      return oh;
    }
    var gy = mt({}, zr, {
      key: yy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: mn,
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
    }), sh = kr(gy), Sy = mt({}, li, {
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
    }), ch = kr(Sy), fh = mt({}, zr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: mn
    }), dh = kr(fh), xy = mt({}, Yn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Aa = kr(xy), qd = mt({}, li, {
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
    }), Ey = kr(qd), Hl = [9, 13, 27, 32], Ps = 229, tl = Ge && "CompositionEvent" in window, Pl = null;
    Ge && "documentMode" in document && (Pl = document.documentMode);
    var Kd = Ge && "TextEvent" in window && !Pl, cf = Ge && (!tl || Pl && Pl > 8 && Pl <= 11), ph = 32, ff = String.fromCharCode(ph);
    function Cy() {
      M("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), M("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), M("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), M("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Xd = !1;
    function vh(e) {
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
      return e === "keydown" && t.keyCode === Ps;
    }
    function Jd(e, t) {
      switch (e) {
        case "keyup":
          return Hl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Ps;
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
    function hh(e) {
      return e.locale === "ko";
    }
    var Uu = !1;
    function Zd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = df(t) : Uu ? Jd(t, i) && (s = "onCompositionEnd") : pf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      cf && !hh(i) && (!Uu && s === "onCompositionStart" ? Uu = Al(u) : s === "onCompositionEnd" && Uu && (f = Zi()));
      var p = Ch(a, s);
      if (p.length > 0) {
        var v = new ih(s, t, null, i, u);
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
          return a !== ph ? null : (Xd = !0, ff);
        case "textInput":
          var i = t.data;
          return i === ff && Xd ? null : i;
        default:
          return null;
      }
    }
    function ep(e, t) {
      if (Uu) {
        if (e === "compositionend" || !tl && Jd(e, t)) {
          var a = Zi();
          return uf(), Uu = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!vh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return cf && !hh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function mf(e, t, a, i, u) {
      var s;
      if (Kd ? s = hf(t, i) : s = ep(t, i), !s)
        return null;
      var f = Ch(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new lh("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function mh(e, t, a, i, u, s, f) {
      Zd(e, t, a, i, u), mf(e, t, a, i, u);
    }
    var by = {
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
    function Vs(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!by[e.type] : t === "textarea";
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
    function Ry(e) {
      if (!Ge)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Bs() {
      M("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function yh(e, t, a, i) {
      so(i);
      var u = Ch(t, "onChange");
      if (u.length > 0) {
        var s = new Oi("onChange", "change", null, a, i);
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
      yh(t, n, e, hd(e)), Dv(o, t);
    }
    function o(e) {
      OS(e, 0);
    }
    function c(e) {
      var t = Cf(e);
      if (gi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    Ge && (m = Ry("input") && (!document.documentMode || document.documentMode > 9));
    function x(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", A);
    }
    function R() {
      Vl && (Vl.detachEvent("onpropertychange", A), Vl = null, n = null);
    }
    function A(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function K(e, t, a) {
      e === "focusin" ? (R(), x(t, a)) : e === "focusout" && R();
    }
    function J(e, t) {
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
    function Te(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Le(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Pe(e, "number", e.value);
    }
    function jn(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window, v, y;
      if (r(p) ? v = d : Vs(p) ? m ? v = Te : (v = J, y = K) : q(p) && (v = Se), v) {
        var g = v(t, a);
        if (g) {
          yh(e, g, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && Le(p);
    }
    function D() {
      pe("onMouseEnter", ["mouseout", "mouseover"]), pe("onMouseLeave", ["mouseout", "mouseover"]), pe("onPointerEnter", ["pointerout", "pointerover"]), pe("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function w(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !as(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Ws(y) || vp(y)))
          return;
      }
      if (!(!v && !p)) {
        var g;
        if (u.window === u)
          g = u;
        else {
          var k = u.ownerDocument;
          k ? g = k.defaultView || k.parentWindow : g = window;
        }
        var T, U;
        if (v) {
          var F = i.relatedTarget || i.toElement;
          if (T = a, U = F ? Ws(F) : null, U !== null) {
            var I = pa(U);
            (U !== I || U.tag !== ne && U.tag !== Qe) && (U = null);
          }
        } else
          T = null, U = a;
        if (T !== U) {
          var me = Wd, Ve = "onMouseLeave", Ue = "onMouseEnter", jt = "mouse";
          (t === "pointerout" || t === "pointerover") && (me = ch, Ve = "onPointerLeave", Ue = "onPointerEnter", jt = "pointer");
          var _t = T == null ? g : Cf(T), N = U == null ? g : Cf(U), Y = new me(Ve, jt + "leave", T, i, u);
          Y.target = _t, Y.relatedTarget = N;
          var O = null, Z = Ws(u);
          if (Z === a) {
            var Ee = new me(Ue, jt + "enter", U, i, u);
            Ee.target = N, Ee.relatedTarget = _t, O = Ee;
          }
          Bb(e, Y, O, T, U);
        }
      }
    }
    function L(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var X = typeof Object.is == "function" ? Object.is : L;
    function we(e, t) {
      if (X(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!yn.call(t, s) || !X(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function Ie(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function $e(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Xe(e, t) {
      for (var a = Ie(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Ie($e(a));
      }
    }
    function ar(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return It(e, u, s, f, p);
    }
    function It(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, g = e, k = null;
      e: for (; ; ) {
        for (var T = null; g === t && (a === 0 || g.nodeType === Yi) && (f = s + a), g === i && (u === 0 || g.nodeType === Yi) && (p = s + u), g.nodeType === Yi && (s += g.nodeValue.length), (T = g.firstChild) !== null; )
          k = g, g = T;
        for (; ; ) {
          if (g === e)
            break e;
          if (k === t && ++v === a && (f = s), k === i && ++y === u && (p = s), (T = g.nextSibling) !== null)
            break;
          g = k, k = g.parentNode;
        }
        g = T;
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
        var y = Xe(e, f), g = Xe(e, p);
        if (y && g) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === g.node && u.focusOffset === g.offset)
            return;
          var k = a.createRange();
          k.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(k), u.extend(g.node, g.offset)) : (k.setEnd(g.node, g.offset), u.addRange(k));
        }
      }
    }
    function gh(e) {
      return e && e.nodeType === Yi;
    }
    function xS(e, t) {
      return !e || !t ? !1 : e === t ? !0 : gh(e) ? !1 : gh(t) ? xS(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function Rb(e) {
      return e && e.ownerDocument && xS(e.ownerDocument.documentElement, e);
    }
    function Tb(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function ES() {
      for (var e = window, t = ka(); t instanceof e.HTMLIFrameElement; ) {
        if (Tb(t))
          e = t.contentWindow;
        else
          return t;
        t = ka(e.document);
      }
      return t;
    }
    function Ty(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function wb() {
      var e = ES();
      return {
        focusedElem: e,
        selectionRange: Ty(e) ? _b(e) : null
      };
    }
    function kb(e) {
      var t = ES(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && Rb(a)) {
        i !== null && Ty(a) && Db(a, i);
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
    function _b(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = ar(e), t || {
        start: 0,
        end: 0
      };
    }
    function Db(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var Nb = Ge && "documentMode" in document && document.documentMode <= 11;
    function Ob() {
      M("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var yf = null, wy = null, tp = null, ky = !1;
    function Lb(e) {
      if ("selectionStart" in e && Ty(e))
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
    function Mb(e) {
      return e.window === e ? e.document : e.nodeType === Wi ? e : e.ownerDocument;
    }
    function CS(e, t, a) {
      var i = Mb(a);
      if (!(ky || yf == null || yf !== ka(i))) {
        var u = Lb(yf);
        if (!tp || !we(tp, u)) {
          tp = u;
          var s = Ch(wy, "onSelect");
          if (s.length > 0) {
            var f = new Oi("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = yf;
          }
        }
      }
    }
    function jb(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window;
      switch (t) {
        // Track the input node that has focus.
        case "focusin":
          (Vs(p) || p.contentEditable === "true") && (yf = p, wy = a, tp = null);
          break;
        case "focusout":
          yf = null, wy = null, tp = null;
          break;
        // Don't fire the event while the user is dragging. This matches the
        // semantics of the native select event.
        case "mousedown":
          ky = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ky = !1, CS(e, i, u);
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
          if (Nb)
            break;
        // falls through
        case "keydown":
        case "keyup":
          CS(e, i, u);
      }
    }
    function Sh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var gf = {
      animationend: Sh("Animation", "AnimationEnd"),
      animationiteration: Sh("Animation", "AnimationIteration"),
      animationstart: Sh("Animation", "AnimationStart"),
      transitionend: Sh("Transition", "TransitionEnd")
    }, _y = {}, bS = {};
    Ge && (bS = document.createElement("div").style, "AnimationEvent" in window || (delete gf.animationend.animation, delete gf.animationiteration.animation, delete gf.animationstart.animation), "TransitionEvent" in window || delete gf.transitionend.transition);
    function xh(e) {
      if (_y[e])
        return _y[e];
      if (!gf[e])
        return e;
      var t = gf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in bS)
          return _y[e] = t[a];
      return e;
    }
    var RS = xh("animationend"), TS = xh("animationiteration"), wS = xh("animationstart"), kS = xh("transitionend"), _S = /* @__PURE__ */ new Map(), DS = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function _o(e, t) {
      _S.set(e, t), M(t, [e]);
    }
    function Ub() {
      for (var e = 0; e < DS.length; e++) {
        var t = DS[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        _o(a, "on" + i);
      }
      _o(RS, "onAnimationEnd"), _o(TS, "onAnimationIteration"), _o(wS, "onAnimationStart"), _o("dblclick", "onDoubleClick"), _o("focusin", "onFocus"), _o("focusout", "onBlur"), _o(kS, "onTransitionEnd");
    }
    function zb(e, t, a, i, u, s, f) {
      var p = _S.get(t);
      if (p !== void 0) {
        var v = Oi, y = t;
        switch (t) {
          case "keypress":
            if (Fl(i) === 0)
              return;
          /* falls through */
          case "keydown":
          case "keyup":
            v = sh;
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
            v = Wd;
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
            v = dh;
            break;
          case RS:
          case TS:
          case wS:
            v = ah;
            break;
          case kS:
            v = Aa;
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
            v = ch;
            break;
        }
        var g = (s & _a) !== 0;
        {
          var k = !g && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", T = Pb(a, p, i.type, g, k);
          if (T.length > 0) {
            var U = new v(p, y, null, i, u);
            e.push({
              event: U,
              listeners: T
            });
          }
        }
      }
    }
    Ub(), D(), Bs(), Ob(), Cy();
    function Ab(e, t, a, i, u, s, f) {
      zb(e, t, a, i, u, s);
      var p = (s & vd) === 0;
      p && (w(e, t, a, i, u), jn(e, t, a, i, u), jb(e, t, a, i, u), mh(e, t, a, i, u));
    }
    var np = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Dy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(np));
    function NS(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ei(i, t, void 0, e), e.currentTarget = null;
    }
    function Fb(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          NS(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var g = t[y], k = g.instance, T = g.currentTarget, U = g.listener;
          if (k !== i && e.isPropagationStopped())
            return;
          NS(e, U, T), i = k;
        }
    }
    function OS(e, t) {
      for (var a = (t & _a) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        Fb(s, f, a);
      }
      us();
    }
    function Hb(e, t, a, i, u) {
      var s = hd(a), f = [];
      Ab(f, e, i, a, s, t), OS(f, t);
    }
    function bn(e, t) {
      Dy.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = h1(t), u = Ib(e);
      i.has(u) || (LS(t, e, mc, a), i.add(u));
    }
    function Ny(e, t, a) {
      Dy.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= _a), LS(a, e, i, t);
    }
    var Eh = "_reactListening" + Math.random().toString(36).slice(2);
    function rp(e) {
      if (!e[Eh]) {
        e[Eh] = !0, pt.forEach(function(a) {
          a !== "selectionchange" && (Dy.has(a) || Ny(a, !1, e), Ny(a, !0, e));
        });
        var t = e.nodeType === Wi ? e : e.ownerDocument;
        t !== null && (t[Eh] || (t[Eh] = !0, Ny("selectionchange", !1, t)));
      }
    }
    function LS(e, t, a, i, u) {
      var s = dr(e, t, a), f = void 0;
      ls && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Yd(e, t, s, f) : na(e, t, s) : f !== void 0 ? Ro(e, t, s, f) : zs(e, t, s);
    }
    function MS(e, t) {
      return e === t || e.nodeType === An && e.parentNode === t;
    }
    function Oy(e, t, a, i, u) {
      var s = i;
      if ((t & pd) === 0 && (t & mc) === 0) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === ae || v === be) {
              var y = p.stateNode.containerInfo;
              if (MS(y, f))
                break;
              if (v === be)
                for (var g = p.return; g !== null; ) {
                  var k = g.tag;
                  if (k === ae || k === be) {
                    var T = g.stateNode.containerInfo;
                    if (MS(T, f))
                      return;
                  }
                  g = g.return;
                }
              for (; y !== null; ) {
                var U = Ws(y);
                if (U === null)
                  return;
                var F = U.tag;
                if (F === ne || F === Qe) {
                  p = s = U;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      Dv(function() {
        return Hb(e, t, a, s);
      });
    }
    function ap(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function Pb(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, g = null; y !== null; ) {
        var k = y, T = k.stateNode, U = k.tag;
        if (U === ne && T !== null && (g = T, p !== null)) {
          var F = Tl(y, p);
          F != null && v.push(ap(y, F, g));
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
        if (p === ne && f !== null) {
          var v = f, y = Tl(u, a);
          y != null && i.unshift(ap(u, y, v));
          var g = Tl(u, t);
          g != null && i.push(ap(u, g, v));
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
      while (e && e.tag !== ne);
      return e || null;
    }
    function Vb(e, t) {
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
    function jS(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, g = v.stateNode, k = v.tag;
        if (y !== null && y === i)
          break;
        if (k === ne && g !== null) {
          var T = g;
          if (u) {
            var U = Tl(p, s);
            U != null && f.unshift(ap(p, U, T));
          } else if (!u) {
            var F = Tl(p, s);
            F != null && f.push(ap(p, F, T));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function Bb(e, t, a, i, u) {
      var s = i && u ? Vb(i, u) : null;
      i !== null && jS(e, t, i, s, !1), u !== null && a !== null && jS(e, a, u, s, !0);
    }
    function Ib(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, ip = "dangerouslySetInnerHTML", bh = "suppressContentEditableWarning", Do = "suppressHydrationWarning", US = "autoFocus", Is = "children", Ys = "style", Rh = "__html", Ly, Th, lp, zS, wh, AS, FS;
    Ly = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Th = function(e, t) {
      cd(e, t), vc(e, t), wv(e, t, {
        registrationNameDependencies: ut,
        possibleRegistrationNames: vt
      });
    }, AS = Ge && !document.documentMode, lp = function(e, t, a) {
      if (!Fa) {
        var i = kh(a), u = kh(t);
        u !== i && (Fa = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, zS = function(e) {
      if (!Fa) {
        Fa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, wh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, FS = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var Yb = /\r\n?/g, Wb = /\u0000|\uFFFD/g;
    function kh(e) {
      Zn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(Yb, `
`).replace(Wb, "");
    }
    function _h(e, t, a, i) {
      var u = kh(t), s = kh(e);
      if (s !== u && (i && (Fa || (Fa = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && le))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function HS(e) {
      return e.nodeType === Wi ? e : e.ownerDocument;
    }
    function $b() {
    }
    function Dh(e) {
      e.onclick = $b;
    }
    function Qb(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Ys)
            f && Object.freeze(f), xv(t, f);
          else if (s === ip) {
            var p = f ? f[Rh] : void 0;
            p != null && ov(t, p);
          } else if (s === Is)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && io(t, f);
            } else typeof f == "number" && io(t, "" + f);
          else s === bh || s === Do || s === US || (ut.hasOwnProperty(s) ? f != null && (typeof f != "function" && wh(s, f), s === "onScroll" && bn("scroll", t)) : f != null && _r(t, s, f, u));
        }
    }
    function Gb(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Ys ? xv(e, f) : s === ip ? ov(e, f) : s === Is ? io(e, f) : _r(e, s, f, i);
      }
    }
    function qb(e, t, a, i) {
      var u, s = HS(a), f, p = i;
      if (p === Ii && (p = rd(e)), p === Ii) {
        if (u = bl(e, t), !u && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
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
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !yn.call(Ly, e) && (Ly[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function Kb(e, t) {
      return HS(t).createTextNode(e);
    }
    function Xb(e, t, a, i) {
      var u = bl(t, a);
      Th(t, a);
      var s;
      switch (t) {
        case "dialog":
          bn("cancel", e), bn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          bn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < np.length; f++)
            bn(np[f], e);
          s = a;
          break;
        case "source":
          bn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          bn("error", e), bn("load", e), s = a;
          break;
        case "details":
          bn("toggle", e), s = a;
          break;
        case "input":
          ei(e, a), s = ao(e, a), bn("invalid", e);
          break;
        case "option":
          Ft(e, a), s = a;
          break;
        case "select":
          su(e, a), s = Xo(e, a), bn("invalid", e);
          break;
        case "textarea":
          ed(e, a), s = Zf(e, a), bn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (dc(t, s), Qb(t, e, i, s, u), t) {
        case "input":
          Za(e), z(e, a, !1);
          break;
        case "textarea":
          Za(e), lv(e);
          break;
        case "option":
          on(e, a);
          break;
        case "select":
          Xf(e, a);
          break;
        default:
          typeof s.onClick == "function" && Dh(e);
          break;
      }
    }
    function Jb(e, t, a, i, u) {
      Th(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ao(e, a), p = ao(e, i), s = [];
          break;
        case "select":
          f = Xo(e, a), p = Xo(e, i), s = [];
          break;
        case "textarea":
          f = Zf(e, a), p = Zf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && Dh(e);
          break;
      }
      dc(t, p);
      var v, y, g = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Ys) {
            var k = f[v];
            for (y in k)
              k.hasOwnProperty(y) && (g || (g = {}), g[y] = "");
          } else v === ip || v === Is || v === bh || v === Do || v === US || (ut.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var T = p[v], U = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || T === U || T == null && U == null))
          if (v === Ys)
            if (T && Object.freeze(T), U) {
              for (y in U)
                U.hasOwnProperty(y) && (!T || !T.hasOwnProperty(y)) && (g || (g = {}), g[y] = "");
              for (y in T)
                T.hasOwnProperty(y) && U[y] !== T[y] && (g || (g = {}), g[y] = T[y]);
            } else
              g || (s || (s = []), s.push(v, g)), g = T;
          else if (v === ip) {
            var F = T ? T[Rh] : void 0, I = U ? U[Rh] : void 0;
            F != null && I !== F && (s = s || []).push(v, F);
          } else v === Is ? (typeof T == "string" || typeof T == "number") && (s = s || []).push(v, "" + T) : v === bh || v === Do || (ut.hasOwnProperty(v) ? (T != null && (typeof T != "function" && wh(v, T), v === "onScroll" && bn("scroll", e)), !s && U !== T && (s = [])) : (s = s || []).push(v, T));
      }
      return g && (iy(g, p[Ys]), (s = s || []).push(Ys, g)), s;
    }
    function Zb(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = bl(a, i), f = bl(a, u);
      switch (Gb(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          iv(e, u);
          break;
        case "select":
          sc(e, u);
          break;
      }
    }
    function eR(e) {
      {
        var t = e.toLowerCase();
        return ns.hasOwnProperty(t) && ns[t] || null;
      }
    }
    function tR(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = bl(t, a), Th(t, a), t) {
        case "dialog":
          bn("cancel", e), bn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          bn("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < np.length; y++)
            bn(np[y], e);
          break;
        case "source":
          bn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          bn("error", e), bn("load", e);
          break;
        case "details":
          bn("toggle", e);
          break;
        case "input":
          ei(e, a), bn("invalid", e);
          break;
        case "option":
          Ft(e, a);
          break;
        case "select":
          su(e, a), bn("invalid", e);
          break;
        case "textarea":
          ed(e, a), bn("invalid", e);
          break;
      }
      dc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var g = e.attributes, k = 0; k < g.length; k++) {
          var T = g[k].name.toLowerCase();
          switch (T) {
            // Controlled attributes are not validated
            // TODO: Only ignore them on controlled tags.
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(g[k].name);
          }
        }
      }
      var U = null;
      for (var F in a)
        if (a.hasOwnProperty(F)) {
          var I = a[F];
          if (F === Is)
            typeof I == "string" ? e.textContent !== I && (a[Do] !== !0 && _h(e.textContent, I, s, f), U = [Is, I]) : typeof I == "number" && e.textContent !== "" + I && (a[Do] !== !0 && _h(e.textContent, I, s, f), U = [Is, "" + I]);
          else if (ut.hasOwnProperty(F))
            I != null && (typeof I != "function" && wh(F, I), F === "onScroll" && bn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var me = void 0, Ve = ln(F);
            if (a[Do] !== !0) {
              if (!(F === bh || F === Do || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              F === "value" || F === "checked" || F === "selected")) {
                if (F === ip) {
                  var Ue = e.innerHTML, jt = I ? I[Rh] : void 0;
                  if (jt != null) {
                    var _t = FS(e, jt);
                    _t !== Ue && lp(F, Ue, _t);
                  }
                } else if (F === Ys) {
                  if (v.delete(F), AS) {
                    var N = ry(I);
                    me = e.getAttribute("style"), N !== me && lp(F, me, N);
                  }
                } else if (p && !_)
                  v.delete(F.toLowerCase()), me = nu(e, F, I), I !== me && lp(F, me, I);
                else if (!gn(F, Ve, p) && !er(F, I, Ve, p)) {
                  var Y = !1;
                  if (Ve !== null)
                    v.delete(Ve.attributeName), me = vl(e, F, I, Ve);
                  else {
                    var O = i;
                    if (O === Ii && (O = rd(t)), O === Ii)
                      v.delete(F.toLowerCase());
                    else {
                      var Z = eR(F);
                      Z !== null && Z !== F && (Y = !0, v.delete(Z)), v.delete(F);
                    }
                    me = nu(e, F, I);
                  }
                  var Ee = _;
                  !Ee && I !== me && !Y && lp(F, me, I);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[Do] !== !0 && zS(v), t) {
        case "input":
          Za(e), z(e, a, !0);
          break;
        case "textarea":
          Za(e), lv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Dh(e);
          break;
      }
      return U;
    }
    function nR(e, t, a) {
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
    function jy(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Uy(e, t, a) {
      {
        if (Fa)
          return;
        Fa = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function zy(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function rR(e, t, a) {
      switch (t) {
        case "input":
          B(e, a);
          return;
        case "textarea":
          Zm(e, a);
          return;
        case "select":
          Jf(e, a);
          return;
      }
    }
    var up = function() {
    }, op = function() {
    };
    {
      var aR = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], PS = [
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
      ], iR = PS.concat(["button"]), lR = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], VS = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      op = function(e, t) {
        var a = mt({}, e || VS), i = {
          tag: t
        };
        return PS.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), iR.indexOf(t) !== -1 && (a.pTagInButtonScope = null), aR.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var uR = function(e, t) {
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
            return lR.indexOf(t) === -1;
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
      }, oR = function(e, t) {
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
      }, BS = {};
      up = function(e, t, a) {
        a = a || VS;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = uR(e, u) ? null : i, f = s ? null : oR(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!BS[y]) {
            BS[y] = !0;
            var g = e, k = "";
            if (e === "#text" ? /\S/.test(t) ? g = "Text nodes" : (g = "Whitespace text nodes", k = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : g = "<" + e + ">", s) {
              var T = "";
              v === "table" && e === "tr" && (T += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), S("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", g, v, k, T);
            } else
              S("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", g, v);
          }
        }
      };
    }
    var Nh = "suppressHydrationWarning", Oh = "$", Lh = "/$", sp = "$?", cp = "$!", sR = "style", Ay = null, Fy = null;
    function cR(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Wi:
        case id: {
          t = i === Wi ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : ad(null, "");
          break;
        }
        default: {
          var s = i === An ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = ad(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = op(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function fR(e, t, a) {
      {
        var i = e, u = ad(i.namespace, t), s = op(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function U_(e) {
      return e;
    }
    function dR(e) {
      Ay = In(), Fy = wb();
      var t = null;
      return Kn(!1), t;
    }
    function pR(e) {
      kb(Fy), Kn(Ay), Ay = null, Fy = null;
    }
    function vR(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (up(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = op(f.ancestorInfo, e);
          up(null, p, v);
        }
        s = f.namespace;
      }
      var y = qb(e, t, a, s);
      return pp(u, y), $y(y, t), y;
    }
    function hR(e, t) {
      e.appendChild(t);
    }
    function mR(e, t, a, i, u) {
      switch (Xb(e, t, a, i), t) {
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
    function yR(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = op(f.ancestorInfo, t);
          up(null, p, v);
        }
      }
      return Jb(e, t, a, i);
    }
    function Hy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function gR(e, t, a, i) {
      {
        var u = a;
        up(null, e, u.ancestorInfo);
      }
      var s = Kb(e, t);
      return pp(i, s), s;
    }
    function SR() {
      var e = window.event;
      return e === void 0 ? ja : lf(e.type);
    }
    var Py = typeof setTimeout == "function" ? setTimeout : void 0, xR = typeof clearTimeout == "function" ? clearTimeout : void 0, Vy = -1, IS = typeof Promise == "function" ? Promise : void 0, ER = typeof queueMicrotask == "function" ? queueMicrotask : typeof IS < "u" ? function(e) {
      return IS.resolve(null).then(e).catch(CR);
    } : Py;
    function CR(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function bR(e, t, a, i) {
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
    function RR(e, t, a, i, u, s) {
      Zb(e, t, a, i, u), $y(e, u);
    }
    function YS(e) {
      io(e, "");
    }
    function TR(e, t, a) {
      e.nodeValue = a;
    }
    function wR(e, t) {
      e.appendChild(t);
    }
    function kR(e, t) {
      var a;
      e.nodeType === An ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Dh(a);
    }
    function _R(e, t, a) {
      e.insertBefore(t, a);
    }
    function DR(e, t, a) {
      e.nodeType === An ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function NR(e, t) {
      e.removeChild(t);
    }
    function OR(e, t) {
      e.nodeType === An ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function By(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === An) {
          var s = u.data;
          if (s === Lh)
            if (i === 0) {
              e.removeChild(u), Nu(t);
              return;
            } else
              i--;
          else (s === Oh || s === sp || s === cp) && i++;
        }
        a = u;
      } while (a);
      Nu(t);
    }
    function LR(e, t) {
      e.nodeType === An ? By(e.parentNode, t) : e.nodeType === Qr && By(e, t), Nu(e);
    }
    function MR(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function jR(e) {
      e.nodeValue = "";
    }
    function UR(e, t) {
      e = e;
      var a = t[sR], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = fc("display", i);
    }
    function zR(e, t) {
      e.nodeValue = t;
    }
    function AR(e) {
      e.nodeType === Qr ? e.textContent = "" : e.nodeType === Wi && e.documentElement && e.removeChild(e.documentElement);
    }
    function FR(e, t, a) {
      return e.nodeType !== Qr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function HR(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function PR(e) {
      return e.nodeType !== An ? null : e;
    }
    function WS(e) {
      return e.data === sp;
    }
    function Iy(e) {
      return e.data === cp;
    }
    function VR(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function BR(e, t) {
      e._reactRetry = t;
    }
    function Mh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Qr || t === Yi)
          break;
        if (t === An) {
          var a = e.data;
          if (a === Oh || a === cp || a === sp)
            break;
          if (a === Lh)
            return null;
        }
      }
      return e;
    }
    function fp(e) {
      return Mh(e.nextSibling);
    }
    function IR(e) {
      return Mh(e.firstChild);
    }
    function YR(e) {
      return Mh(e.firstChild);
    }
    function WR(e) {
      return Mh(e.nextSibling);
    }
    function $R(e, t, a, i, u, s, f) {
      pp(s, e), $y(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & xt) !== Fe;
      return tR(e, t, a, p, i, y, f);
    }
    function QR(e, t, a, i) {
      return pp(a, e), a.mode & xt, nR(e, t);
    }
    function GR(e, t) {
      pp(t, e);
    }
    function qR(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === An) {
          var i = t.data;
          if (i === Lh) {
            if (a === 0)
              return fp(t);
            a--;
          } else (i === Oh || i === cp || i === sp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function $S(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === An) {
          var i = t.data;
          if (i === Oh || i === cp || i === sp) {
            if (a === 0)
              return t;
            a--;
          } else i === Lh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function KR(e) {
      Nu(e);
    }
    function XR(e) {
      Nu(e);
    }
    function JR(e) {
      return e !== "head" && e !== "body";
    }
    function ZR(e, t, a, i) {
      var u = !0;
      _h(t.nodeValue, a, i, u);
    }
    function e1(e, t, a, i, u, s) {
      if (t[Nh] !== !0) {
        var f = !0;
        _h(i.nodeValue, u, s, f);
      }
    }
    function t1(e, t) {
      t.nodeType === Qr ? My(e, t) : t.nodeType === An || jy(e, t);
    }
    function n1(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Qr ? My(a, t) : t.nodeType === An || jy(a, t));
      }
    }
    function r1(e, t, a, i, u) {
      (u || t[Nh] !== !0) && (i.nodeType === Qr ? My(a, i) : i.nodeType === An || jy(a, i));
    }
    function a1(e, t, a) {
      Uy(e, t);
    }
    function i1(e, t) {
      zy(e, t);
    }
    function l1(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Uy(i, t);
      }
    }
    function u1(e, t) {
      {
        var a = e.parentNode;
        a !== null && zy(a, t);
      }
    }
    function o1(e, t, a, i, u, s) {
      (s || t[Nh] !== !0) && Uy(a, i);
    }
    function s1(e, t, a, i, u) {
      (u || t[Nh] !== !0) && zy(a, i);
    }
    function c1(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function f1(e) {
      rp(e);
    }
    var xf = Math.random().toString(36).slice(2), Ef = "__reactFiber$" + xf, Yy = "__reactProps$" + xf, dp = "__reactContainer$" + xf, Wy = "__reactEvents$" + xf, d1 = "__reactListeners$" + xf, p1 = "__reactHandles$" + xf;
    function v1(e) {
      delete e[Ef], delete e[Yy], delete e[Wy], delete e[d1], delete e[p1];
    }
    function pp(e, t) {
      t[Ef] = e;
    }
    function jh(e, t) {
      t[dp] = e;
    }
    function QS(e) {
      e[dp] = null;
    }
    function vp(e) {
      return !!e[dp];
    }
    function Ws(e) {
      var t = e[Ef];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[dp] || a[Ef], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = $S(e); u !== null; ) {
              var s = u[Ef];
              if (s)
                return s;
              u = $S(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function No(e) {
      var t = e[Ef] || e[dp];
      return t && (t.tag === ne || t.tag === Qe || t.tag === ie || t.tag === ae) ? t : null;
    }
    function Cf(e) {
      if (e.tag === ne || e.tag === Qe)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Uh(e) {
      return e[Yy] || null;
    }
    function $y(e, t) {
      e[Yy] = t;
    }
    function h1(e) {
      var t = e[Wy];
      return t === void 0 && (t = e[Wy] = /* @__PURE__ */ new Set()), t;
    }
    var GS = {}, qS = j.ReactDebugCurrentFrame;
    function zh(e) {
      if (e) {
        var t = e._owner, a = Pi(e.type, e._source, t ? t.type : null);
        qS.setExtraStackFrame(a);
      } else
        qS.setExtraStackFrame(null);
    }
    function nl(e, t, a, i, u) {
      {
        var s = Function.call.bind(yn);
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
            p && !(p instanceof Error) && (zh(u), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), zh(null)), p instanceof Error && !(p.message in GS) && (GS[p.message] = !0, zh(u), S("Failed %s type: %s", a, p.message), zh(null));
          }
      }
    }
    var Qy = [], Ah;
    Ah = [];
    var zu = -1;
    function Oo(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (zu < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== Ah[zu] && S("Unexpected Fiber popped."), e.current = Qy[zu], Qy[zu] = null, Ah[zu] = null, zu--;
    }
    function ia(e, t, a) {
      zu++, Qy[zu] = e.current, Ah[zu] = a, e.current = t;
    }
    var Gy;
    Gy = {};
    var ui = {};
    Object.freeze(ui);
    var Au = Oo(ui), Il = Oo(!1), qy = ui;
    function bf(e, t, a) {
      return a && Yl(t) ? qy : Au.current;
    }
    function KS(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
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
          var p = et(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && KS(e, t, s), s;
      }
    }
    function Fh() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Hh(e) {
      aa(Il, e), aa(Au, e);
    }
    function Ky(e) {
      aa(Il, e), aa(Au, e);
    }
    function XS(e, t, a) {
      {
        if (Au.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(Au, t, e), ia(Il, a, e);
      }
    }
    function JS(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = et(e) || "Unknown";
            Gy[s] || (Gy[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((et(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = et(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return mt({}, a, f);
      }
    }
    function Ph(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return qy = Au.current, ia(Au, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function ZS(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = JS(e, t, qy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(Au, e), ia(Au, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function m1(e) {
      {
        if (!mu(e) || e.tag !== de)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case ae:
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
    var Lo = 0, Vh = 1, Fu = null, Xy = !1, Jy = !1;
    function ex(e) {
      Fu === null ? Fu = [e] : Fu.push(e);
    }
    function y1(e) {
      Xy = !0, ex(e);
    }
    function tx() {
      Xy && Mo();
    }
    function Mo() {
      if (!Jy && Fu !== null) {
        Jy = !0;
        var e = 0, t = za();
        try {
          var a = !0, i = Fu;
          for (Bn(Mr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Fu = null, Xy = !1;
        } catch (s) {
          throw Fu !== null && (Fu = Fu.slice(e + 1)), yd(cs, Mo), s;
        } finally {
          Bn(t), Jy = !1;
        }
      }
      return null;
    }
    var Tf = [], wf = 0, Bh = null, Ih = 0, Li = [], Mi = 0, $s = null, Hu = 1, Pu = "";
    function g1(e) {
      return Gs(), (e.flags & Ci) !== Ae;
    }
    function S1(e) {
      return Gs(), Ih;
    }
    function x1() {
      var e = Pu, t = Hu, a = t & ~E1(t);
      return a.toString(32) + e;
    }
    function Qs(e, t) {
      Gs(), Tf[wf++] = Ih, Tf[wf++] = Bh, Bh = e, Ih = t;
    }
    function nx(e, t, a) {
      Gs(), Li[Mi++] = Hu, Li[Mi++] = Pu, Li[Mi++] = $s, $s = e;
      var i = Hu, u = Pu, s = Yh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Yh(t) + s;
      if (v > 30) {
        var y = s - s % 5, g = (1 << y) - 1, k = (f & g).toString(32), T = f >> y, U = s - y, F = Yh(t) + U, I = p << U, me = I | T, Ve = k + u;
        Hu = 1 << F | me, Pu = Ve;
      } else {
        var Ue = p << s, jt = Ue | f, _t = u;
        Hu = 1 << v | jt, Pu = _t;
      }
    }
    function Zy(e) {
      Gs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Qs(e, a), nx(e, a, i);
      }
    }
    function Yh(e) {
      return 32 - Pn(e);
    }
    function E1(e) {
      return 1 << Yh(e) - 1;
    }
    function eg(e) {
      for (; e === Bh; )
        Bh = Tf[--wf], Tf[wf] = null, Ih = Tf[--wf], Tf[wf] = null;
      for (; e === $s; )
        $s = Li[--Mi], Li[Mi] = null, Pu = Li[--Mi], Li[Mi] = null, Hu = Li[--Mi], Li[Mi] = null;
    }
    function C1() {
      return Gs(), $s !== null ? {
        id: Hu,
        overflow: Pu
      } : null;
    }
    function b1(e, t) {
      Gs(), Li[Mi++] = Hu, Li[Mi++] = Pu, Li[Mi++] = $s, Hu = t.id, Pu = t.overflow, $s = e;
    }
    function Gs() {
      Fr() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ar = null, ji = null, rl = !1, qs = !1, jo = null;
    function R1() {
      rl && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function rx() {
      qs = !0;
    }
    function T1() {
      return qs;
    }
    function w1(e) {
      var t = e.stateNode.containerInfo;
      return ji = YR(t), Ar = e, rl = !0, jo = null, qs = !1, !0;
    }
    function k1(e, t, a) {
      return ji = WR(t), Ar = e, rl = !0, jo = null, qs = !1, a !== null && b1(e, a), !0;
    }
    function ax(e, t) {
      switch (e.tag) {
        case ae: {
          t1(e.stateNode.containerInfo, t);
          break;
        }
        case ne: {
          var a = (e.mode & xt) !== Fe;
          r1(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case ie: {
          var i = e.memoizedState;
          i.dehydrated !== null && n1(i.dehydrated, t);
          break;
        }
      }
    }
    function ix(e, t) {
      ax(e, t);
      var a = Ok();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Da) : i.push(a);
    }
    function tg(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case ae: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ne:
                var i = t.type;
                t.pendingProps, a1(a, i);
                break;
              case Qe:
                var u = t.pendingProps;
                i1(a, u);
                break;
            }
            break;
          }
          case ne: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ne: {
                var v = t.type, y = t.pendingProps, g = (e.mode & xt) !== Fe;
                o1(
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
              case Qe: {
                var k = t.pendingProps, T = (e.mode & xt) !== Fe;
                s1(
                  s,
                  f,
                  p,
                  k,
                  // TODO: Delete this argument when we remove the legacy root API.
                  T
                );
                break;
              }
            }
            break;
          }
          case ie: {
            var U = e.memoizedState, F = U.dehydrated;
            if (F !== null) switch (t.tag) {
              case ne:
                var I = t.type;
                t.pendingProps, l1(F, I);
                break;
              case Qe:
                var me = t.pendingProps;
                u1(F, me);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function lx(e, t) {
      t.flags = t.flags & ~qr | xn, tg(e, t);
    }
    function ux(e, t) {
      switch (e.tag) {
        case ne: {
          var a = e.type;
          e.pendingProps;
          var i = FR(t, a);
          return i !== null ? (e.stateNode = i, Ar = e, ji = IR(i), !0) : !1;
        }
        case Qe: {
          var u = e.pendingProps, s = HR(t, u);
          return s !== null ? (e.stateNode = s, Ar = e, ji = null, !0) : !1;
        }
        case ie: {
          var f = PR(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: C1(),
              retryLane: Zr
            };
            e.memoizedState = p;
            var v = Lk(f);
            return v.return = e, e.child = v, Ar = e, ji = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function ng(e) {
      return (e.mode & xt) !== Fe && (e.flags & ze) === Ae;
    }
    function rg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function ag(e) {
      if (rl) {
        var t = ji;
        if (!t) {
          ng(e) && (tg(Ar, e), rg()), lx(Ar, e), rl = !1, Ar = e;
          return;
        }
        var a = t;
        if (!ux(e, t)) {
          ng(e) && (tg(Ar, e), rg()), t = fp(a);
          var i = Ar;
          if (!t || !ux(e, t)) {
            lx(Ar, e), rl = !1, Ar = e;
            return;
          }
          ix(i, a);
        }
      }
    }
    function _1(e, t, a) {
      var i = e.stateNode, u = !qs, s = $R(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function D1(e) {
      var t = e.stateNode, a = e.memoizedProps, i = QR(t, a, e);
      if (i) {
        var u = Ar;
        if (u !== null)
          switch (u.tag) {
            case ae: {
              var s = u.stateNode.containerInfo, f = (u.mode & xt) !== Fe;
              ZR(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ne: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, g = (u.mode & xt) !== Fe;
              e1(
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
    function N1(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      GR(a, e);
    }
    function O1(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return qR(a);
    }
    function ox(e) {
      for (var t = e.return; t !== null && t.tag !== ne && t.tag !== ae && t.tag !== ie; )
        t = t.return;
      Ar = t;
    }
    function Wh(e) {
      if (e !== Ar)
        return !1;
      if (!rl)
        return ox(e), rl = !0, !1;
      if (e.tag !== ae && (e.tag !== ne || JR(e.type) && !Hy(e.type, e.memoizedProps))) {
        var t = ji;
        if (t)
          if (ng(e))
            sx(e), rg();
          else
            for (; t; )
              ix(e, t), t = fp(t);
      }
      return ox(e), e.tag === ie ? ji = O1(e) : ji = Ar ? fp(e.stateNode) : null, !0;
    }
    function L1() {
      return rl && ji !== null;
    }
    function sx(e) {
      for (var t = ji; t; )
        ax(e, t), t = fp(t);
    }
    function kf() {
      Ar = null, ji = null, rl = !1, qs = !1;
    }
    function cx() {
      jo !== null && (rC(jo), jo = null);
    }
    function Fr() {
      return rl;
    }
    function ig(e) {
      jo === null ? jo = [e] : jo.push(e);
    }
    var M1 = j.ReactCurrentBatchConfig, j1 = null;
    function U1() {
      return M1.transition;
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
      var z1 = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & en && (t = a), a = a.return;
        return t;
      }, Ks = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, hp = [], mp = [], yp = [], gp = [], Sp = [], xp = [], Xs = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Xs.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && hp.push(e), e.mode & en && typeof t.UNSAFE_componentWillMount == "function" && mp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && yp.push(e), e.mode & en && typeof t.UNSAFE_componentWillReceiveProps == "function" && gp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Sp.push(e), e.mode & en && typeof t.UNSAFE_componentWillUpdate == "function" && xp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(T) {
          e.add(et(T) || "Component"), Xs.add(T.type);
        }), hp = []);
        var t = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(T) {
          t.add(et(T) || "Component"), Xs.add(T.type);
        }), mp = []);
        var a = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(T) {
          a.add(et(T) || "Component"), Xs.add(T.type);
        }), yp = []);
        var i = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(T) {
          i.add(et(T) || "Component"), Xs.add(T.type);
        }), gp = []);
        var u = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(T) {
          u.add(et(T) || "Component"), Xs.add(T.type);
        }), Sp = []);
        var s = /* @__PURE__ */ new Set();
        if (xp.length > 0 && (xp.forEach(function(T) {
          s.add(et(T) || "Component"), Xs.add(T.type);
        }), xp = []), t.size > 0) {
          var f = Ks(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = Ks(i);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = Ks(s);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = Ks(e);
          Ye(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var g = Ks(a);
          Ye(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, g);
        }
        if (u.size > 0) {
          var k = Ks(u);
          Ye(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, k);
        }
      };
      var $h = /* @__PURE__ */ new Map(), fx = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = z1(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!fx.has(e.type)) {
          var i = $h.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], $h.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        $h.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(et(s) || "Component"), fx.add(s.type);
            });
            var u = Ks(i);
            try {
              Xt(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              pn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        hp = [], mp = [], yp = [], gp = [], Sp = [], xp = [], $h = /* @__PURE__ */ new Map();
      };
    }
    var lg, ug, og, sg, cg, dx = function(e, t) {
    };
    lg = !1, ug = !1, og = {}, sg = {}, cg = {}, dx = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = et(t) || "Component";
        sg[a] || (sg[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function A1(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Ep(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & en || W) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== de) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !A1(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = et(e) || "Component";
          og[u] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), og[u] = !0);
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
          ci(i, "ref");
          var y = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === y)
            return t.ref;
          var g = function(k) {
            var T = v.refs;
            k === null ? delete T[y] : T[y] = k;
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
    function Gh(e) {
      {
        var t = et(e) || "Component";
        if (cg[t])
          return;
        cg[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function px(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function vx(e) {
      function t(N, Y) {
        if (e) {
          var O = N.deletions;
          O === null ? (N.deletions = [Y], N.flags |= Da) : O.push(Y);
        }
      }
      function a(N, Y) {
        if (!e)
          return null;
        for (var O = Y; O !== null; )
          t(N, O), O = O.sibling;
        return null;
      }
      function i(N, Y) {
        for (var O = /* @__PURE__ */ new Map(), Z = Y; Z !== null; )
          Z.key !== null ? O.set(Z.key, Z) : O.set(Z.index, Z), Z = Z.sibling;
        return O;
      }
      function u(N, Y) {
        var O = lc(N, Y);
        return O.index = 0, O.sibling = null, O;
      }
      function s(N, Y, O) {
        if (N.index = O, !e)
          return N.flags |= Ci, Y;
        var Z = N.alternate;
        if (Z !== null) {
          var Ee = Z.index;
          return Ee < Y ? (N.flags |= xn, Y) : Ee;
        } else
          return N.flags |= xn, Y;
      }
      function f(N) {
        return e && N.alternate === null && (N.flags |= xn), N;
      }
      function p(N, Y, O, Z) {
        if (Y === null || Y.tag !== Qe) {
          var Ee = iS(O, N.mode, Z);
          return Ee.return = N, Ee;
        } else {
          var ge = u(Y, O);
          return ge.return = N, ge;
        }
      }
      function v(N, Y, O, Z) {
        var Ee = O.type;
        if (Ee === di)
          return g(N, Y, O.props.children, Z, O.key);
        if (Y !== null && (Y.elementType === Ee || // Keep this check inline so it only runs on the false path:
        SC(Y, O) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Ee == "object" && Ee !== null && Ee.$$typeof === tt && px(Ee) === Y.type)) {
          var ge = u(Y, O.props);
          return ge.ref = Ep(N, Y, O), ge.return = N, ge._debugSource = O._source, ge._debugOwner = O._owner, ge;
        }
        var Ke = aS(O, N.mode, Z);
        return Ke.ref = Ep(N, Y, O), Ke.return = N, Ke;
      }
      function y(N, Y, O, Z) {
        if (Y === null || Y.tag !== be || Y.stateNode.containerInfo !== O.containerInfo || Y.stateNode.implementation !== O.implementation) {
          var Ee = lS(O, N.mode, Z);
          return Ee.return = N, Ee;
        } else {
          var ge = u(Y, O.children || []);
          return ge.return = N, ge;
        }
      }
      function g(N, Y, O, Z, Ee) {
        if (Y === null || Y.tag !== at) {
          var ge = Wo(O, N.mode, Z, Ee);
          return ge.return = N, ge;
        } else {
          var Ke = u(Y, O);
          return Ke.return = N, Ke;
        }
      }
      function k(N, Y, O) {
        if (typeof Y == "string" && Y !== "" || typeof Y == "number") {
          var Z = iS("" + Y, N.mode, O);
          return Z.return = N, Z;
        }
        if (typeof Y == "object" && Y !== null) {
          switch (Y.$$typeof) {
            case Dr: {
              var Ee = aS(Y, N.mode, O);
              return Ee.ref = Ep(N, null, Y), Ee.return = N, Ee;
            }
            case lr: {
              var ge = lS(Y, N.mode, O);
              return ge.return = N, ge;
            }
            case tt: {
              var Ke = Y._payload, it = Y._init;
              return k(N, it(Ke), O);
            }
          }
          if (gt(Y) || st(Y)) {
            var nn = Wo(Y, N.mode, O, null);
            return nn.return = N, nn;
          }
          Qh(N, Y);
        }
        return typeof Y == "function" && Gh(N), null;
      }
      function T(N, Y, O, Z) {
        var Ee = Y !== null ? Y.key : null;
        if (typeof O == "string" && O !== "" || typeof O == "number")
          return Ee !== null ? null : p(N, Y, "" + O, Z);
        if (typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case Dr:
              return O.key === Ee ? v(N, Y, O, Z) : null;
            case lr:
              return O.key === Ee ? y(N, Y, O, Z) : null;
            case tt: {
              var ge = O._payload, Ke = O._init;
              return T(N, Y, Ke(ge), Z);
            }
          }
          if (gt(O) || st(O))
            return Ee !== null ? null : g(N, Y, O, Z, null);
          Qh(N, O);
        }
        return typeof O == "function" && Gh(N), null;
      }
      function U(N, Y, O, Z, Ee) {
        if (typeof Z == "string" && Z !== "" || typeof Z == "number") {
          var ge = N.get(O) || null;
          return p(Y, ge, "" + Z, Ee);
        }
        if (typeof Z == "object" && Z !== null) {
          switch (Z.$$typeof) {
            case Dr: {
              var Ke = N.get(Z.key === null ? O : Z.key) || null;
              return v(Y, Ke, Z, Ee);
            }
            case lr: {
              var it = N.get(Z.key === null ? O : Z.key) || null;
              return y(Y, it, Z, Ee);
            }
            case tt:
              var nn = Z._payload, Yt = Z._init;
              return U(N, Y, O, Yt(nn), Ee);
          }
          if (gt(Z) || st(Z)) {
            var Xn = N.get(O) || null;
            return g(Y, Xn, Z, Ee, null);
          }
          Qh(Y, Z);
        }
        return typeof Z == "function" && Gh(Y), null;
      }
      function F(N, Y, O) {
        {
          if (typeof N != "object" || N === null)
            return Y;
          switch (N.$$typeof) {
            case Dr:
            case lr:
              dx(N, O);
              var Z = N.key;
              if (typeof Z != "string")
                break;
              if (Y === null) {
                Y = /* @__PURE__ */ new Set(), Y.add(Z);
                break;
              }
              if (!Y.has(Z)) {
                Y.add(Z);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", Z);
              break;
            case tt:
              var Ee = N._payload, ge = N._init;
              F(ge(Ee), Y, O);
              break;
          }
        }
        return Y;
      }
      function I(N, Y, O, Z) {
        for (var Ee = null, ge = 0; ge < O.length; ge++) {
          var Ke = O[ge];
          Ee = F(Ke, Ee, N);
        }
        for (var it = null, nn = null, Yt = Y, Xn = 0, Wt = 0, Wn = null; Yt !== null && Wt < O.length; Wt++) {
          Yt.index > Wt ? (Wn = Yt, Yt = null) : Wn = Yt.sibling;
          var ua = T(N, Yt, O[Wt], Z);
          if (ua === null) {
            Yt === null && (Yt = Wn);
            break;
          }
          e && Yt && ua.alternate === null && t(N, Yt), Xn = s(ua, Xn, Wt), nn === null ? it = ua : nn.sibling = ua, nn = ua, Yt = Wn;
        }
        if (Wt === O.length) {
          if (a(N, Yt), Fr()) {
            var Wr = Wt;
            Qs(N, Wr);
          }
          return it;
        }
        if (Yt === null) {
          for (; Wt < O.length; Wt++) {
            var si = k(N, O[Wt], Z);
            si !== null && (Xn = s(si, Xn, Wt), nn === null ? it = si : nn.sibling = si, nn = si);
          }
          if (Fr()) {
            var Ca = Wt;
            Qs(N, Ca);
          }
          return it;
        }
        for (var ba = i(N, Yt); Wt < O.length; Wt++) {
          var oa = U(ba, N, Wt, O[Wt], Z);
          oa !== null && (e && oa.alternate !== null && ba.delete(oa.key === null ? Wt : oa.key), Xn = s(oa, Xn, Wt), nn === null ? it = oa : nn.sibling = oa, nn = oa);
        }
        if (e && ba.forEach(function($f) {
          return t(N, $f);
        }), Fr()) {
          var Qu = Wt;
          Qs(N, Qu);
        }
        return it;
      }
      function me(N, Y, O, Z) {
        var Ee = st(O);
        if (typeof Ee != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          O[Symbol.toStringTag] === "Generator" && (ug || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), ug = !0), O.entries === Ee && (lg || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), lg = !0);
          var ge = Ee.call(O);
          if (ge)
            for (var Ke = null, it = ge.next(); !it.done; it = ge.next()) {
              var nn = it.value;
              Ke = F(nn, Ke, N);
            }
        }
        var Yt = Ee.call(O);
        if (Yt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Xn = null, Wt = null, Wn = Y, ua = 0, Wr = 0, si = null, Ca = Yt.next(); Wn !== null && !Ca.done; Wr++, Ca = Yt.next()) {
          Wn.index > Wr ? (si = Wn, Wn = null) : si = Wn.sibling;
          var ba = T(N, Wn, Ca.value, Z);
          if (ba === null) {
            Wn === null && (Wn = si);
            break;
          }
          e && Wn && ba.alternate === null && t(N, Wn), ua = s(ba, ua, Wr), Wt === null ? Xn = ba : Wt.sibling = ba, Wt = ba, Wn = si;
        }
        if (Ca.done) {
          if (a(N, Wn), Fr()) {
            var oa = Wr;
            Qs(N, oa);
          }
          return Xn;
        }
        if (Wn === null) {
          for (; !Ca.done; Wr++, Ca = Yt.next()) {
            var Qu = k(N, Ca.value, Z);
            Qu !== null && (ua = s(Qu, ua, Wr), Wt === null ? Xn = Qu : Wt.sibling = Qu, Wt = Qu);
          }
          if (Fr()) {
            var $f = Wr;
            Qs(N, $f);
          }
          return Xn;
        }
        for (var Zp = i(N, Wn); !Ca.done; Wr++, Ca = Yt.next()) {
          var Jl = U(Zp, N, Wr, Ca.value, Z);
          Jl !== null && (e && Jl.alternate !== null && Zp.delete(Jl.key === null ? Wr : Jl.key), ua = s(Jl, ua, Wr), Wt === null ? Xn = Jl : Wt.sibling = Jl, Wt = Jl);
        }
        if (e && Zp.forEach(function(s_) {
          return t(N, s_);
        }), Fr()) {
          var o_ = Wr;
          Qs(N, o_);
        }
        return Xn;
      }
      function Ve(N, Y, O, Z) {
        if (Y !== null && Y.tag === Qe) {
          a(N, Y.sibling);
          var Ee = u(Y, O);
          return Ee.return = N, Ee;
        }
        a(N, Y);
        var ge = iS(O, N.mode, Z);
        return ge.return = N, ge;
      }
      function Ue(N, Y, O, Z) {
        for (var Ee = O.key, ge = Y; ge !== null; ) {
          if (ge.key === Ee) {
            var Ke = O.type;
            if (Ke === di) {
              if (ge.tag === at) {
                a(N, ge.sibling);
                var it = u(ge, O.props.children);
                return it.return = N, it._debugSource = O._source, it._debugOwner = O._owner, it;
              }
            } else if (ge.elementType === Ke || // Keep this check inline so it only runs on the false path:
            SC(ge, O) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Ke == "object" && Ke !== null && Ke.$$typeof === tt && px(Ke) === ge.type) {
              a(N, ge.sibling);
              var nn = u(ge, O.props);
              return nn.ref = Ep(N, ge, O), nn.return = N, nn._debugSource = O._source, nn._debugOwner = O._owner, nn;
            }
            a(N, ge);
            break;
          } else
            t(N, ge);
          ge = ge.sibling;
        }
        if (O.type === di) {
          var Yt = Wo(O.props.children, N.mode, Z, O.key);
          return Yt.return = N, Yt;
        } else {
          var Xn = aS(O, N.mode, Z);
          return Xn.ref = Ep(N, Y, O), Xn.return = N, Xn;
        }
      }
      function jt(N, Y, O, Z) {
        for (var Ee = O.key, ge = Y; ge !== null; ) {
          if (ge.key === Ee)
            if (ge.tag === be && ge.stateNode.containerInfo === O.containerInfo && ge.stateNode.implementation === O.implementation) {
              a(N, ge.sibling);
              var Ke = u(ge, O.children || []);
              return Ke.return = N, Ke;
            } else {
              a(N, ge);
              break;
            }
          else
            t(N, ge);
          ge = ge.sibling;
        }
        var it = lS(O, N.mode, Z);
        return it.return = N, it;
      }
      function _t(N, Y, O, Z) {
        var Ee = typeof O == "object" && O !== null && O.type === di && O.key === null;
        if (Ee && (O = O.props.children), typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case Dr:
              return f(Ue(N, Y, O, Z));
            case lr:
              return f(jt(N, Y, O, Z));
            case tt:
              var ge = O._payload, Ke = O._init;
              return _t(N, Y, Ke(ge), Z);
          }
          if (gt(O))
            return I(N, Y, O, Z);
          if (st(O))
            return me(N, Y, O, Z);
          Qh(N, O);
        }
        return typeof O == "string" && O !== "" || typeof O == "number" ? f(Ve(N, Y, "" + O, Z)) : (typeof O == "function" && Gh(N), a(N, Y));
      }
      return _t;
    }
    var _f = vx(!0), hx = vx(!1);
    function F1(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = lc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = lc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function H1(e, t) {
      for (var a = e.child; a !== null; )
        wk(a, t), a = a.sibling;
    }
    var fg = Oo(null), dg;
    dg = {};
    var qh = null, Df = null, pg = null, Kh = !1;
    function Xh() {
      qh = null, Df = null, pg = null, Kh = !1;
    }
    function mx() {
      Kh = !0;
    }
    function yx() {
      Kh = !1;
    }
    function gx(e, t, a) {
      ia(fg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== dg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = dg;
    }
    function vg(e, t) {
      var a = fg.current;
      aa(fg, t), e._currentValue = a;
    }
    function hg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (Du(i.childLanes, t) ? u !== null && !Du(u.childLanes, t) && (u.childLanes = ht(u.childLanes, t)) : (i.childLanes = ht(i.childLanes, t), u !== null && (u.childLanes = ht(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function P1(e, t, a) {
      V1(e, t, a);
    }
    function V1(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === de) {
                var p = Rs(a), v = Vu(rn, p);
                v.tag = Zh;
                var y = i.updateQueue;
                if (y !== null) {
                  var g = y.shared, k = g.pending;
                  k === null ? v.next = v : (v.next = k.next, k.next = v), g.pending = v;
                }
              }
              i.lanes = ht(i.lanes, a);
              var T = i.alternate;
              T !== null && (T.lanes = ht(T.lanes, a)), hg(i.return, a, e), s.lanes = ht(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === lt)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === ft) {
          var U = i.return;
          if (U === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          U.lanes = ht(U.lanes, a);
          var F = U.alternate;
          F !== null && (F.lanes = ht(F.lanes, a)), hg(U, a, e), u = i.sibling;
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
            var I = u.sibling;
            if (I !== null) {
              I.return = u.return, u = I;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Nf(e, t) {
      qh = e, Df = null, pg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && zp(), a.firstContext = null);
      }
    }
    function ir(e) {
      Kh && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (pg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (qh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, qh.dependencies = {
            lanes: G,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Js = null;
    function mg(e) {
      Js === null ? Js = [e] : Js.push(e);
    }
    function B1() {
      if (Js !== null) {
        for (var e = 0; e < Js.length; e++) {
          var t = Js[e], a = t.interleaved;
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
        Js = null;
      }
    }
    function Sx(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, mg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Jh(e, i);
    }
    function I1(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, mg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Y1(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, mg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Jh(e, i);
    }
    function Ha(e, t) {
      return Jh(e, t);
    }
    var W1 = Jh;
    function Jh(e, t) {
      e.lanes = ht(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = ht(a.lanes, t)), a === null && (e.flags & (xn | qr)) !== Ae && hC(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = ht(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = ht(a.childLanes, t) : (u.flags & (xn | qr)) !== Ae && hC(e), i = u, u = u.return;
      if (i.tag === ae) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var xx = 0, Ex = 1, Zh = 2, yg = 3, em = !1, gg, tm;
    gg = !1, tm = null;
    function Sg(e) {
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
    function Cx(e, t) {
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
    function Vu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: xx,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Uo(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (tm === u && !gg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), gg = !0), Iw()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, W1(e, a);
      } else
        return Y1(e, u, t, a);
    }
    function nm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (jd(a)) {
          var s = u.lanes;
          s = zd(s, e.pendingLanes);
          var f = ht(s, a);
          u.lanes = f, tf(e, f);
        }
      }
    }
    function xg(e, t) {
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
    function $1(e, t, a, i, u, s) {
      switch (a.tag) {
        case Ex: {
          var f = a.payload;
          if (typeof f == "function") {
            mx();
            var p = f.call(s, i, u);
            {
              if (e.mode & en) {
                En(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  En(!1);
                }
              }
              yx();
            }
            return p;
          }
          return f;
        }
        case yg:
          e.flags = e.flags & ~tr | ze;
        // Intentional fallthrough
        case xx: {
          var v = a.payload, y;
          if (typeof v == "function") {
            mx(), y = v.call(s, i, u);
            {
              if (e.mode & en) {
                En(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  En(!1);
                }
              }
              yx();
            }
          } else
            y = v;
          return y == null ? i : mt({}, i, y);
        }
        case Zh:
          return em = !0, i;
      }
      return i;
    }
    function rm(e, t, a, i) {
      var u = e.updateQueue;
      em = !1, tm = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var g = e.alternate;
        if (g !== null) {
          var k = g.updateQueue, T = k.lastBaseUpdate;
          T !== f && (T === null ? k.firstBaseUpdate = y : T.next = y, k.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var U = u.baseState, F = G, I = null, me = null, Ve = null, Ue = s;
        do {
          var jt = Ue.lane, _t = Ue.eventTime;
          if (Du(i, jt)) {
            if (Ve !== null) {
              var Y = {
                eventTime: _t,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Ht,
                tag: Ue.tag,
                payload: Ue.payload,
                callback: Ue.callback,
                next: null
              };
              Ve = Ve.next = Y;
            }
            U = $1(e, u, Ue, U, t, a);
            var O = Ue.callback;
            if (O !== null && // If the update was already committed, we should not queue its
            // callback again.
            Ue.lane !== Ht) {
              e.flags |= sn;
              var Z = u.effects;
              Z === null ? u.effects = [Ue] : Z.push(Ue);
            }
          } else {
            var N = {
              eventTime: _t,
              lane: jt,
              tag: Ue.tag,
              payload: Ue.payload,
              callback: Ue.callback,
              next: null
            };
            Ve === null ? (me = Ve = N, I = U) : Ve = Ve.next = N, F = ht(F, jt);
          }
          if (Ue = Ue.next, Ue === null) {
            if (p = u.shared.pending, p === null)
              break;
            var Ee = p, ge = Ee.next;
            Ee.next = null, Ue = ge, u.lastBaseUpdate = Ee, u.shared.pending = null;
          }
        } while (!0);
        Ve === null && (I = U), u.baseState = I, u.firstBaseUpdate = me, u.lastBaseUpdate = Ve;
        var Ke = u.shared.interleaved;
        if (Ke !== null) {
          var it = Ke;
          do
            F = ht(F, it.lane), it = it.next;
          while (it !== Ke);
        } else s === null && (u.shared.lanes = G);
        Gp(F), e.lanes = F, e.memoizedState = U;
      }
      tm = null;
    }
    function Q1(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function bx() {
      em = !1;
    }
    function am() {
      return em;
    }
    function Rx(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Q1(f, a));
        }
    }
    var Cp = {}, zo = Oo(Cp), bp = Oo(Cp), im = Oo(Cp);
    function lm(e) {
      if (e === Cp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function Tx() {
      var e = lm(im.current);
      return e;
    }
    function Eg(e, t) {
      ia(im, t, e), ia(bp, e, e), ia(zo, Cp, e);
      var a = cR(t);
      aa(zo, e), ia(zo, a, e);
    }
    function Of(e) {
      aa(zo, e), aa(bp, e), aa(im, e);
    }
    function Cg() {
      var e = lm(zo.current);
      return e;
    }
    function wx(e) {
      lm(im.current);
      var t = lm(zo.current), a = fR(t, e.type);
      t !== a && (ia(bp, e, e), ia(zo, a, e));
    }
    function bg(e) {
      bp.current === e && (aa(zo, e), aa(bp, e));
    }
    var G1 = 0, kx = 1, _x = 1, Rp = 2, il = Oo(G1);
    function Rg(e, t) {
      return (e & t) !== 0;
    }
    function Lf(e) {
      return e & kx;
    }
    function Tg(e, t) {
      return e & kx | t;
    }
    function q1(e, t) {
      return e | t;
    }
    function Ao(e, t) {
      ia(il, t, e);
    }
    function Mf(e) {
      aa(il, e);
    }
    function K1(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function um(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === ie) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || WS(i) || Iy(i))
              return t;
          }
        } else if (t.tag === zt && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & ze) !== Ae;
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
    ), pr = (
      /* */
      1
    ), Wl = (
      /*  */
      2
    ), vr = (
      /*    */
      4
    ), Hr = (
      /*   */
      8
    ), wg = [];
    function kg() {
      for (var e = 0; e < wg.length; e++) {
        var t = wg[e];
        t._workInProgressVersionPrimary = null;
      }
      wg.length = 0;
    }
    function X1(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var xe = j.ReactCurrentDispatcher, Tp = j.ReactCurrentBatchConfig, _g, jf;
    _g = /* @__PURE__ */ new Set();
    var Zs = G, tn = null, hr = null, mr = null, om = !1, wp = !1, kp = 0, J1 = 0, Z1 = 25, $ = null, Ui = null, Fo = -1, Dg = !1;
    function Gt() {
      {
        var e = $;
        Ui === null ? Ui = [e] : Ui.push(e);
      }
    }
    function ce() {
      {
        var e = $;
        Ui !== null && (Fo++, Ui[Fo] !== e && eT(e));
      }
    }
    function Uf(e) {
      e != null && !gt(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", $, typeof e);
    }
    function eT(e) {
      {
        var t = et(tn);
        if (!_g.has(t) && (_g.add(t), Ui !== null)) {
          for (var a = "", i = 30, u = 0; u <= Fo; u++) {
            for (var s = Ui[u], f = u === Fo ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function Ng(e, t) {
      if (Dg)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", $), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, $, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!X(e[a], t[a]))
          return !1;
      return !0;
    }
    function zf(e, t, a, i, u, s) {
      Zs = s, tn = t, Ui = e !== null ? e._debugHookTypes : null, Fo = -1, Dg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = G, e !== null && e.memoizedState !== null ? xe.current = Kx : Ui !== null ? xe.current = qx : xe.current = Gx;
      var f = a(i, u);
      if (wp) {
        var p = 0;
        do {
          if (wp = !1, kp = 0, p >= Z1)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Dg = !1, hr = null, mr = null, t.updateQueue = null, Fo = -1, xe.current = Xx, f = a(i, u);
        } while (wp);
      }
      xe.current = Em, t._debugHookTypes = Ui;
      var v = hr !== null && hr.next !== null;
      if (Zs = G, tn = null, hr = null, mr = null, $ = null, Ui = null, Fo = -1, e !== null && (e.flags & Hn) !== (t.flags & Hn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & xt) !== Fe && S("Internal React error: Expected static flag was missing. Please notify the React team."), om = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Af() {
      var e = kp !== 0;
      return kp = 0, e;
    }
    function Dx(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Bt) !== Fe ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Ts(e.lanes, a);
    }
    function Nx() {
      if (xe.current = Em, om) {
        for (var e = tn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        om = !1;
      }
      Zs = G, tn = null, hr = null, mr = null, Ui = null, Fo = -1, $ = null, Ix = !1, wp = !1, kp = 0;
    }
    function $l() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return mr === null ? tn.memoizedState = mr = e : mr = mr.next = e, mr;
    }
    function zi() {
      var e;
      if (hr === null) {
        var t = tn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = hr.next;
      var a;
      if (mr === null ? a = tn.memoizedState : a = mr.next, a !== null)
        mr = a, a = mr.next, hr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        hr = e;
        var i = {
          memoizedState: hr.memoizedState,
          baseState: hr.baseState,
          baseQueue: hr.baseQueue,
          queue: hr.queue,
          next: null
        };
        mr === null ? tn.memoizedState = mr = i : mr = mr.next = i;
      }
      return mr;
    }
    function Ox() {
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
        lanes: G,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = aT.bind(null, tn, s);
      return [i.memoizedState, f];
    }
    function Mg(e, t, a) {
      var i = zi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = hr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var g = f.next, k = s.baseState, T = null, U = null, F = null, I = g;
        do {
          var me = I.lane;
          if (Du(Zs, me)) {
            if (F !== null) {
              var Ue = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Ht,
                action: I.action,
                hasEagerState: I.hasEagerState,
                eagerState: I.eagerState,
                next: null
              };
              F = F.next = Ue;
            }
            if (I.hasEagerState)
              k = I.eagerState;
            else {
              var jt = I.action;
              k = e(k, jt);
            }
          } else {
            var Ve = {
              lane: me,
              action: I.action,
              hasEagerState: I.hasEagerState,
              eagerState: I.eagerState,
              next: null
            };
            F === null ? (U = F = Ve, T = k) : F = F.next = Ve, tn.lanes = ht(tn.lanes, me), Gp(me);
          }
          I = I.next;
        } while (I !== null && I !== g);
        F === null ? T = k : F.next = U, X(k, i.memoizedState) || zp(), i.memoizedState = k, i.baseState = T, i.baseQueue = F, u.lastRenderedState = k;
      }
      var _t = u.interleaved;
      if (_t !== null) {
        var N = _t;
        do {
          var Y = N.lane;
          tn.lanes = ht(tn.lanes, Y), Gp(Y), N = N.next;
        } while (N !== _t);
      } else f === null && (u.lanes = G);
      var O = u.dispatch;
      return [i.memoizedState, O];
    }
    function jg(e, t, a) {
      var i = zi(), u = i.queue;
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
        X(p, i.memoizedState) || zp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function z_(e, t, a) {
    }
    function A_(e, t, a) {
    }
    function Ug(e, t, a) {
      var i = tn, u = $l(), s, f = Fr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), jf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), jf = !0);
      } else {
        if (s = t(), !jf) {
          var p = t();
          X(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
        }
        var v = Pm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Zs) || Lx(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, pm(jx.bind(null, i, y, e), [e]), i.flags |= Gr, _p(pr | Hr, Mx.bind(null, i, y, s, t), void 0, null), s;
    }
    function sm(e, t, a) {
      var i = tn, u = zi(), s = t();
      if (!jf) {
        var f = t();
        X(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
      }
      var p = u.memoizedState, v = !X(p, s);
      v && (u.memoizedState = s, zp());
      var y = u.queue;
      if (Np(jx.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      mr !== null && mr.memoizedState.tag & pr) {
        i.flags |= Gr, _p(pr | Hr, Mx.bind(null, i, y, s, t), void 0, null);
        var g = Pm();
        if (g === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(g, Zs) || Lx(i, t, s);
      }
      return s;
    }
    function Lx(e, t, a) {
      e.flags |= ho;
      var i = {
        getSnapshot: t,
        value: a
      }, u = tn.updateQueue;
      if (u === null)
        u = Ox(), tn.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function Mx(e, t, a, i) {
      t.value = a, t.getSnapshot = i, Ux(t) && zx(e);
    }
    function jx(e, t, a) {
      var i = function() {
        Ux(t) && zx(e);
      };
      return a(i);
    }
    function Ux(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !X(a, i);
      } catch {
        return !0;
      }
    }
    function zx(e) {
      var t = Ha(e, qe);
      t !== null && xr(t, e, qe, rn);
    }
    function cm(e) {
      var t = $l();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: G,
        dispatch: null,
        lastRenderedReducer: Og,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = iT.bind(null, tn, a);
      return [t.memoizedState, i];
    }
    function zg(e) {
      return Mg(Og);
    }
    function Ag(e) {
      return jg(Og);
    }
    function _p(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = tn.updateQueue;
      if (s === null)
        s = Ox(), tn.updateQueue = s, s.lastEffect = u.next = u;
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
    function Fg(e) {
      var t = $l();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function fm(e) {
      var t = zi();
      return t.memoizedState;
    }
    function Dp(e, t, a, i) {
      var u = $l(), s = i === void 0 ? null : i;
      tn.flags |= e, u.memoizedState = _p(pr | t, a, void 0, s);
    }
    function dm(e, t, a, i) {
      var u = zi(), s = i === void 0 ? null : i, f = void 0;
      if (hr !== null) {
        var p = hr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Ng(s, v)) {
            u.memoizedState = _p(t, a, f, s);
            return;
          }
        }
      }
      tn.flags |= e, u.memoizedState = _p(pr | t, a, f, s);
    }
    function pm(e, t) {
      return (tn.mode & Bt) !== Fe ? Dp(bi | Gr | wc, Hr, e, t) : Dp(Gr | wc, Hr, e, t);
    }
    function Np(e, t) {
      return dm(Gr, Hr, e, t);
    }
    function Hg(e, t) {
      return Dp(Ot, Wl, e, t);
    }
    function vm(e, t) {
      return dm(Ot, Wl, e, t);
    }
    function Pg(e, t) {
      var a = Ot;
      return a |= Qi, (tn.mode & Bt) !== Fe && (a |= kl), Dp(a, vr, e, t);
    }
    function hm(e, t) {
      return dm(Ot, vr, e, t);
    }
    function Ax(e, t) {
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
    function Vg(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Ot;
      return u |= Qi, (tn.mode & Bt) !== Fe && (u |= kl), Dp(u, vr, Ax.bind(null, t, e), i);
    }
    function mm(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return dm(Ot, vr, Ax.bind(null, t, e), i);
    }
    function tT(e, t) {
    }
    var ym = tT;
    function Bg(e, t) {
      var a = $l(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function gm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Ng(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Ig(e, t) {
      var a = $l(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function Sm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Ng(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Yg(e) {
      var t = $l();
      return t.memoizedState = e, e;
    }
    function Fx(e) {
      var t = zi(), a = hr, i = a.memoizedState;
      return Px(t, i, e);
    }
    function Hx(e) {
      var t = zi();
      if (hr === null)
        return t.memoizedState = e, e;
      var a = hr.memoizedState;
      return Px(t, a, e);
    }
    function Px(e, t, a) {
      var i = !Ld(Zs);
      if (i) {
        if (!X(a, t)) {
          var u = Ud();
          tn.lanes = ht(tn.lanes, u), Gp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, zp()), e.memoizedState = a, a;
    }
    function nT(e, t, a) {
      var i = za();
      Bn(Kv(i, ki)), e(!0);
      var u = Tp.transition;
      Tp.transition = {};
      var s = Tp.transition;
      Tp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Bn(i), Tp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && Ye("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Wg() {
      var e = cm(!1), t = e[0], a = e[1], i = nT.bind(null, a), u = $l();
      return u.memoizedState = i, [t, i];
    }
    function Vx() {
      var e = zg(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    function Bx() {
      var e = Ag(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    var Ix = !1;
    function rT() {
      return Ix;
    }
    function $g() {
      var e = $l(), t = Pm(), a = t.identifierPrefix, i;
      if (Fr()) {
        var u = x1();
        i = ":" + a + "R" + u;
        var s = kp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = J1++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function xm() {
      var e = zi(), t = e.memoizedState;
      return t;
    }
    function aT(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Io(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Yx(e))
        Wx(t, u);
      else {
        var s = Sx(e, t, u, i);
        if (s !== null) {
          var f = Ea();
          xr(s, e, i, f), $x(s, t, i);
        }
      }
      Qx(e, i);
    }
    function iT(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Io(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Yx(e))
        Wx(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === G && (s === null || s.lanes === G)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = xe.current, xe.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, X(y, v)) {
                I1(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              xe.current = p;
            }
          }
        }
        var g = Sx(e, t, u, i);
        if (g !== null) {
          var k = Ea();
          xr(g, e, i, k), $x(g, t, i);
        }
      }
      Qx(e, i);
    }
    function Yx(e) {
      var t = e.alternate;
      return e === tn || t !== null && t === tn;
    }
    function Wx(e, t) {
      wp = om = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function $x(e, t, a) {
      if (jd(a)) {
        var i = t.lanes;
        i = zd(i, e.pendingLanes);
        var u = ht(i, a);
        t.lanes = u, tf(e, u);
      }
    }
    function Qx(e, t, a) {
      hs(e, t);
    }
    var Em = {
      readContext: ir,
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
      unstable_isNewReconciler: ee
    }, Gx = null, qx = null, Kx = null, Xx = null, Ql = null, ll = null, Cm = null;
    {
      var Qg = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, nt = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      Gx = {
        readContext: function(e) {
          return ir(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", Gt(), Uf(t), Bg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", Gt(), ir(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", Gt(), Uf(t), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", Gt(), Uf(a), Vg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", Gt(), Uf(t), Hg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", Gt(), Uf(t), Pg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", Gt(), Uf(t);
          var a = xe.current;
          xe.current = Ql;
          try {
            return Ig(e, t);
          } finally {
            xe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", Gt();
          var i = xe.current;
          xe.current = Ql;
          try {
            return Lg(e, t, a);
          } finally {
            xe.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", Gt(), Fg(e);
        },
        useState: function(e) {
          $ = "useState", Gt();
          var t = xe.current;
          xe.current = Ql;
          try {
            return cm(e);
          } finally {
            xe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", Gt(), Yg(e);
        },
        useTransition: function() {
          return $ = "useTransition", Gt(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", Gt(), Ug(e, t, a);
        },
        useId: function() {
          return $ = "useId", Gt(), $g();
        },
        unstable_isNewReconciler: ee
      }, qx = {
        readContext: function(e) {
          return ir(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ce(), Bg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ce(), ir(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ce(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ce(), Vg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ce(), Hg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ce(), Pg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ce();
          var a = xe.current;
          xe.current = Ql;
          try {
            return Ig(e, t);
          } finally {
            xe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ce();
          var i = xe.current;
          xe.current = Ql;
          try {
            return Lg(e, t, a);
          } finally {
            xe.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ce(), Fg(e);
        },
        useState: function(e) {
          $ = "useState", ce();
          var t = xe.current;
          xe.current = Ql;
          try {
            return cm(e);
          } finally {
            xe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ce(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ce(), Yg(e);
        },
        useTransition: function() {
          return $ = "useTransition", ce(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ce(), Ug(e, t, a);
        },
        useId: function() {
          return $ = "useId", ce(), $g();
        },
        unstable_isNewReconciler: ee
      }, Kx = {
        readContext: function(e) {
          return ir(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ce(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ce(), ir(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ce(), Np(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ce(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ce(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ce(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ce();
          var a = xe.current;
          xe.current = ll;
          try {
            return Sm(e, t);
          } finally {
            xe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ce();
          var i = xe.current;
          xe.current = ll;
          try {
            return Mg(e, t, a);
          } finally {
            xe.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ce(), fm();
        },
        useState: function(e) {
          $ = "useState", ce();
          var t = xe.current;
          xe.current = ll;
          try {
            return zg(e);
          } finally {
            xe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ce(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ce(), Fx(e);
        },
        useTransition: function() {
          return $ = "useTransition", ce(), Vx();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ce(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", ce(), xm();
        },
        unstable_isNewReconciler: ee
      }, Xx = {
        readContext: function(e) {
          return ir(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ce(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ce(), ir(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ce(), Np(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ce(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ce(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ce(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ce();
          var a = xe.current;
          xe.current = Cm;
          try {
            return Sm(e, t);
          } finally {
            xe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ce();
          var i = xe.current;
          xe.current = Cm;
          try {
            return jg(e, t, a);
          } finally {
            xe.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ce(), fm();
        },
        useState: function(e) {
          $ = "useState", ce();
          var t = xe.current;
          xe.current = Cm;
          try {
            return Ag(e);
          } finally {
            xe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ce(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ce(), Hx(e);
        },
        useTransition: function() {
          return $ = "useTransition", ce(), Bx();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ce(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", ce(), xm();
        },
        unstable_isNewReconciler: ee
      }, Ql = {
        readContext: function(e) {
          return Qg(), ir(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", nt(), Gt(), Bg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", nt(), Gt(), ir(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", nt(), Gt(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", nt(), Gt(), Vg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", nt(), Gt(), Hg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", nt(), Gt(), Pg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", nt(), Gt();
          var a = xe.current;
          xe.current = Ql;
          try {
            return Ig(e, t);
          } finally {
            xe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", nt(), Gt();
          var i = xe.current;
          xe.current = Ql;
          try {
            return Lg(e, t, a);
          } finally {
            xe.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", nt(), Gt(), Fg(e);
        },
        useState: function(e) {
          $ = "useState", nt(), Gt();
          var t = xe.current;
          xe.current = Ql;
          try {
            return cm(e);
          } finally {
            xe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", nt(), Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", nt(), Gt(), Yg(e);
        },
        useTransition: function() {
          return $ = "useTransition", nt(), Gt(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", nt(), Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", nt(), Gt(), Ug(e, t, a);
        },
        useId: function() {
          return $ = "useId", nt(), Gt(), $g();
        },
        unstable_isNewReconciler: ee
      }, ll = {
        readContext: function(e) {
          return Qg(), ir(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", nt(), ce(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", nt(), ce(), ir(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", nt(), ce(), Np(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", nt(), ce(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", nt(), ce(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", nt(), ce(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", nt(), ce();
          var a = xe.current;
          xe.current = ll;
          try {
            return Sm(e, t);
          } finally {
            xe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", nt(), ce();
          var i = xe.current;
          xe.current = ll;
          try {
            return Mg(e, t, a);
          } finally {
            xe.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", nt(), ce(), fm();
        },
        useState: function(e) {
          $ = "useState", nt(), ce();
          var t = xe.current;
          xe.current = ll;
          try {
            return zg(e);
          } finally {
            xe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", nt(), ce(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", nt(), ce(), Fx(e);
        },
        useTransition: function() {
          return $ = "useTransition", nt(), ce(), Vx();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", nt(), ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", nt(), ce(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", nt(), ce(), xm();
        },
        unstable_isNewReconciler: ee
      }, Cm = {
        readContext: function(e) {
          return Qg(), ir(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", nt(), ce(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", nt(), ce(), ir(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", nt(), ce(), Np(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", nt(), ce(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", nt(), ce(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", nt(), ce(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", nt(), ce();
          var a = xe.current;
          xe.current = ll;
          try {
            return Sm(e, t);
          } finally {
            xe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", nt(), ce();
          var i = xe.current;
          xe.current = ll;
          try {
            return jg(e, t, a);
          } finally {
            xe.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", nt(), ce(), fm();
        },
        useState: function(e) {
          $ = "useState", nt(), ce();
          var t = xe.current;
          xe.current = ll;
          try {
            return Ag(e);
          } finally {
            xe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", nt(), ce(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", nt(), ce(), Hx(e);
        },
        useTransition: function() {
          return $ = "useTransition", nt(), ce(), Bx();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", nt(), ce(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", nt(), ce(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", nt(), ce(), xm();
        },
        unstable_isNewReconciler: ee
      };
    }
    var Ho = H.unstable_now, Jx = 0, bm = -1, Op = -1, Rm = -1, Gg = !1, Tm = !1;
    function Zx() {
      return Gg;
    }
    function lT() {
      Tm = !0;
    }
    function uT() {
      Gg = !1, Tm = !1;
    }
    function oT() {
      Gg = Tm, Tm = !1;
    }
    function eE() {
      return Jx;
    }
    function tE() {
      Jx = Ho();
    }
    function qg(e) {
      Op = Ho(), e.actualStartTime < 0 && (e.actualStartTime = Ho());
    }
    function nE(e) {
      Op = -1;
    }
    function wm(e, t) {
      if (Op >= 0) {
        var a = Ho() - Op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Op = -1;
      }
    }
    function Gl(e) {
      if (bm >= 0) {
        var t = Ho() - bm;
        bm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ae:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case _e:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Kg(e) {
      if (Rm >= 0) {
        var t = Ho() - Rm;
        Rm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ae:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case _e:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      bm = Ho();
    }
    function Xg() {
      Rm = Ho();
    }
    function Jg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = mt({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Zg = {}, e0, t0, n0, r0, a0, rE, km, i0, l0, u0, Lp;
    {
      e0 = /* @__PURE__ */ new Set(), t0 = /* @__PURE__ */ new Set(), n0 = /* @__PURE__ */ new Set(), r0 = /* @__PURE__ */ new Set(), i0 = /* @__PURE__ */ new Set(), a0 = /* @__PURE__ */ new Set(), l0 = /* @__PURE__ */ new Set(), u0 = /* @__PURE__ */ new Set(), Lp = /* @__PURE__ */ new Set();
      var aE = /* @__PURE__ */ new Set();
      km = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          aE.has(a) || (aE.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, rE = function(e, t) {
        if (t === void 0) {
          var a = At(e) || "Component";
          a0.has(a) || (a0.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(Zg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(Zg);
    }
    function o0(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & en) {
          En(!0);
          try {
            s = a(i, u);
          } finally {
            En(!1);
          }
        }
        rE(t, s);
      }
      var f = s == null ? u : mt({}, u, s);
      if (e.memoizedState = f, e.lanes === G) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var s0 = {
      isMounted: jv,
      enqueueSetState: function(e, t, a) {
        var i = vo(e), u = Ea(), s = Io(i), f = Vu(u, s);
        f.payload = t, a != null && (km(a, "setState"), f.callback = a);
        var p = Uo(i, f, s);
        p !== null && (xr(p, i, s, u), nm(p, i, s)), hs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = vo(e), u = Ea(), s = Io(i), f = Vu(u, s);
        f.tag = Ex, f.payload = t, a != null && (km(a, "replaceState"), f.callback = a);
        var p = Uo(i, f, s);
        p !== null && (xr(p, i, s, u), nm(p, i, s)), hs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = vo(e), i = Ea(), u = Io(a), s = Vu(i, u);
        s.tag = Zh, t != null && (km(t, "forceUpdate"), s.callback = t);
        var f = Uo(a, s, u);
        f !== null && (xr(f, a, u, i), nm(f, a, u)), Mc(a, u);
      }
    };
    function iE(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & en) {
            En(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              En(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", At(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !we(a, i) || !we(u, s) : !0;
    }
    function sT(e, t, a) {
      var i = e.stateNode;
      {
        var u = At(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & en) === Fe && (Lp.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & en) === Fe && (Lp.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !l0.has(t) && (l0.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", At(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !n0.has(t) && (n0.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", At(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || gt(p)) && S("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function lE(e, t) {
      t.updater = s0, e.stateNode = t, hu(t, e), t._reactInternalInstance = Zg;
    }
    function uE(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === b && f._context === void 0
        );
        if (!p && !u0.has(t)) {
          u0.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", At(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = ir(f);
      else {
        u = bf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? Rf(e, u) : ui;
      }
      var g = new t(a, s);
      if (e.mode & en) {
        En(!0);
        try {
          g = new t(a, s);
        } finally {
          En(!1);
        }
      }
      var k = e.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null;
      lE(e, g);
      {
        if (typeof t.getDerivedStateFromProps == "function" && k === null) {
          var T = At(t) || "Component";
          t0.has(T) || (t0.add(T), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", T, g.state === null ? "null" : "undefined", T));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof g.getSnapshotBeforeUpdate == "function") {
          var U = null, F = null, I = null;
          if (typeof g.componentWillMount == "function" && g.componentWillMount.__suppressDeprecationWarning !== !0 ? U = "componentWillMount" : typeof g.UNSAFE_componentWillMount == "function" && (U = "UNSAFE_componentWillMount"), typeof g.componentWillReceiveProps == "function" && g.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? F = "componentWillReceiveProps" : typeof g.UNSAFE_componentWillReceiveProps == "function" && (F = "UNSAFE_componentWillReceiveProps"), typeof g.componentWillUpdate == "function" && g.componentWillUpdate.__suppressDeprecationWarning !== !0 ? I = "componentWillUpdate" : typeof g.UNSAFE_componentWillUpdate == "function" && (I = "UNSAFE_componentWillUpdate"), U !== null || F !== null || I !== null) {
            var me = At(t) || "Component", Ve = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            r0.has(me) || (r0.add(me), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, me, Ve, U !== null ? `
  ` + U : "", F !== null ? `
  ` + F : "", I !== null ? `
  ` + I : ""));
          }
        }
      }
      return i && KS(e, u, s), g;
    }
    function cT(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", et(e) || "Component"), s0.enqueueReplaceState(t, t.state, null));
    }
    function oE(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = et(e) || "Component";
          e0.has(s) || (e0.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        s0.enqueueReplaceState(t, t.state, null);
      }
    }
    function c0(e, t, a, i) {
      sT(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, Sg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = ir(s);
      else {
        var f = bf(e, t, !0);
        u.context = Rf(e, f);
      }
      {
        if (u.state === a) {
          var p = At(t) || "Component";
          i0.has(p) || (i0.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & en && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (o0(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (cT(e, u), rm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = Ot;
        y |= Qi, (e.mode & Bt) !== Fe && (y |= kl), e.flags |= y;
      }
    }
    function fT(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = ir(p);
      else {
        var y = bf(e, t, !0);
        v = Rf(e, y);
      }
      var g = t.getDerivedStateFromProps, k = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !k && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && oE(e, u, a, v), bx();
      var T = e.memoizedState, U = u.state = T;
      if (rm(e, a, u, i), U = e.memoizedState, s === a && T === U && !Fh() && !am()) {
        if (typeof u.componentDidMount == "function") {
          var F = Ot;
          F |= Qi, (e.mode & Bt) !== Fe && (F |= kl), e.flags |= F;
        }
        return !1;
      }
      typeof g == "function" && (o0(e, t, g, a), U = e.memoizedState);
      var I = am() || iE(e, t, s, a, T, U, v);
      if (I) {
        if (!k && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var me = Ot;
          me |= Qi, (e.mode & Bt) !== Fe && (me |= kl), e.flags |= me;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Ve = Ot;
          Ve |= Qi, (e.mode & Bt) !== Fe && (Ve |= kl), e.flags |= Ve;
        }
        e.memoizedProps = a, e.memoizedState = U;
      }
      return u.props = a, u.state = U, u.context = v, I;
    }
    function dT(e, t, a, i, u) {
      var s = t.stateNode;
      Cx(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, g = a.contextType, k = ui;
      if (typeof g == "object" && g !== null)
        k = ir(g);
      else {
        var T = bf(t, a, !0);
        k = Rf(t, T);
      }
      var U = a.getDerivedStateFromProps, F = typeof U == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !F && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== k) && oE(t, s, i, k), bx();
      var I = t.memoizedState, me = s.state = I;
      if (rm(t, i, s, u), me = t.memoizedState, f === v && I === me && !Fh() && !am() && !Ne)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Ot), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Gn), !1;
      typeof U == "function" && (o0(t, a, U, i), me = t.memoizedState);
      var Ve = am() || iE(t, a, p, i, I, me, k) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Ne;
      return Ve ? (!F && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, me, k), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, me, k)), typeof s.componentDidUpdate == "function" && (t.flags |= Ot), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Gn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Ot), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Gn), t.memoizedProps = i, t.memoizedState = me), s.props = i, s.state = me, s.context = k, Ve;
    }
    function ec(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function f0(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function pT(e, t) {
      return !0;
    }
    function d0(e, t) {
      try {
        var a = pT(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === de)
            return;
          console.error(i);
        }
        var p = u ? et(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === ae)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var g = et(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + g + ".");
        }
        var k = v + `
` + f + `

` + ("" + y);
        console.error(k);
      } catch (T) {
        setTimeout(function() {
          throw T;
        });
      }
    }
    var vT = typeof WeakMap == "function" ? WeakMap : Map;
    function sE(e, t, a) {
      var i = Vu(rn, a);
      i.tag = yg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        lk(u), d0(e, t);
      }, i;
    }
    function p0(e, t, a) {
      var i = Vu(rn, a);
      i.tag = yg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          xC(e), d0(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        xC(e), d0(e, t), typeof u != "function" && ak(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, qe) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", et(e) || "Unknown"));
      }), i;
    }
    function cE(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new vT(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = uk.bind(null, e, t, a);
        Jr && qp(e, a), t.then(s, s);
      }
    }
    function hT(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function mT(e, t) {
      var a = e.tag;
      if ((e.mode & xt) === Fe && (a === re || a === V || a === se)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function fE(e) {
      var t = e;
      do {
        if (t.tag === ie && K1(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function dE(e, t, a, i, u) {
      if ((e.mode & xt) === Fe) {
        if (e === t)
          e.flags |= tr;
        else {
          if (e.flags |= ze, a.flags |= Tc, a.flags &= -52805, a.tag === de) {
            var s = a.alternate;
            if (s === null)
              a.tag = Ct;
            else {
              var f = Vu(rn, qe);
              f.tag = Zh, Uo(a, f, qe);
            }
          }
          a.lanes = ht(a.lanes, qe);
        }
        return e;
      }
      return e.flags |= tr, e.lanes = u, e;
    }
    function yT(e, t, a, i, u) {
      if (a.flags |= ss, Jr && qp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        mT(a), Fr() && a.mode & xt && rx();
        var f = fE(t);
        if (f !== null) {
          f.flags &= ~Rr, dE(f, t, a, e, u), f.mode & xt && cE(e, s, u), hT(f, e, s);
          return;
        } else {
          if (!Bv(u)) {
            cE(e, s, u), $0();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (Fr() && a.mode & xt) {
        rx();
        var v = fE(t);
        if (v !== null) {
          (v.flags & tr) === Ae && (v.flags |= Rr), dE(v, t, a, e, u), ig(ec(i, a));
          return;
        }
      }
      i = ec(i, a), Kw(i);
      var y = t;
      do {
        switch (y.tag) {
          case ae: {
            var g = i;
            y.flags |= tr;
            var k = Rs(u);
            y.lanes = ht(y.lanes, k);
            var T = sE(y, g, k);
            xg(y, T);
            return;
          }
          case de:
            var U = i, F = y.type, I = y.stateNode;
            if ((y.flags & ze) === Ae && (typeof F.getDerivedStateFromError == "function" || I !== null && typeof I.componentDidCatch == "function" && !fC(I))) {
              y.flags |= tr;
              var me = Rs(u);
              y.lanes = ht(y.lanes, me);
              var Ve = p0(y, U, me);
              xg(y, Ve);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function gT() {
      return null;
    }
    var Mp = j.ReactCurrentOwner, ol = !1, v0, jp, h0, m0, y0, tc, g0, _m, Up;
    v0 = {}, jp = {}, h0 = {}, m0 = {}, y0 = {}, tc = !1, g0 = {}, _m = {}, Up = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = hx(t, null, a, i) : t.child = _f(t, e.child, a, i);
    }
    function ST(e, t, a, i) {
      t.child = _f(t, e.child, null, i), t.child = _f(t, null, a, i);
    }
    function pE(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Nf(t, u), ha(t);
      {
        if (Mp.current = t, Qn(!0), v = zf(e, t, f, i, p, u), y = Af(), t.mode & en) {
          En(!0);
          try {
            v = zf(e, t, f, i, p, u), y = Af();
          } finally {
            En(!1);
          }
        }
        Qn(!1);
      }
      return ma(), e !== null && !ol ? (Dx(e, t, u), Bu(e, t, u)) : (Fr() && y && Zy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function vE(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (Rk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Wf(s), t.tag = se, t.type = f, E0(t, s), hE(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            At(s)
          ), a.defaultProps !== void 0) {
            var v = At(s) || "Unknown";
            Up[v] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Up[v] = !0);
          }
        }
        var y = rS(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var g = a.type, k = g.propTypes;
        k && nl(
          k,
          i,
          // Resolved props
          "prop",
          At(g)
        );
      }
      var T = e.child, U = k0(e, u);
      if (!U) {
        var F = T.memoizedProps, I = a.compare;
        if (I = I !== null ? I : we, I(F, i) && e.ref === t.ref)
          return Bu(e, t, u);
      }
      t.flags |= ni;
      var me = lc(T, i);
      return me.ref = t.ref, me.return = t, t.child = me, me;
    }
    function hE(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === tt) {
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
            At(s)
          );
        }
      }
      if (e !== null) {
        var g = e.memoizedProps;
        if (we(g, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = g, k0(e, u))
            (e.flags & Tc) !== Ae && (ol = !0);
          else return t.lanes = e.lanes, Bu(e, t, u);
      }
      return S0(e, t, a, i, u);
    }
    function mE(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || oe)
        if ((t.mode & xt) === Fe) {
          var f = {
            baseLanes: G,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Vm(t, a);
        } else if (ea(a, Zr)) {
          var k = {
            baseLanes: G,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = k;
          var T = s !== null ? s.baseLanes : a;
          Vm(t, T);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = ht(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Zr;
          var g = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = g, t.updateQueue = null, Vm(t, v), null;
        }
      else {
        var U;
        s !== null ? (U = ht(s.baseLanes, a), t.memoizedState = null) : U = a, Vm(t, U);
      }
      return Sa(e, t, u, a), t.child;
    }
    function xT(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function ET(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function CT(e, t, a) {
      {
        t.flags |= Ot;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function yE(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Tn, t.flags |= mo);
    }
    function S0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var f;
      {
        var p = bf(t, a, !0);
        f = Rf(t, p);
      }
      var v, y;
      Nf(t, u), ha(t);
      {
        if (Mp.current = t, Qn(!0), v = zf(e, t, a, i, f, u), y = Af(), t.mode & en) {
          En(!0);
          try {
            v = zf(e, t, a, i, f, u), y = Af();
          } finally {
            En(!1);
          }
        }
        Qn(!1);
      }
      return ma(), e !== null && !ol ? (Dx(e, t, u), Bu(e, t, u)) : (Fr() && y && Zy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function gE(e, t, a, i, u) {
      {
        switch (Hk(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= ze, t.flags |= tr;
            var y = new Error("Simulated error coming from DevTools"), g = Rs(u);
            t.lanes = ht(t.lanes, g);
            var k = p0(t, ec(y, t), g);
            xg(t, k);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var T = a.propTypes;
          T && nl(
            T,
            i,
            // Resolved props
            "prop",
            At(a)
          );
        }
      }
      var U;
      Yl(a) ? (U = !0, Ph(t)) : U = !1, Nf(t, u);
      var F = t.stateNode, I;
      F === null ? (Nm(e, t), uE(t, a, i), c0(t, a, i, u), I = !0) : e === null ? I = fT(t, a, i, u) : I = dT(e, t, a, i, u);
      var me = x0(e, t, a, I, U, u);
      {
        var Ve = t.stateNode;
        I && Ve.props !== i && (tc || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", et(t) || "a component"), tc = !0);
      }
      return me;
    }
    function x0(e, t, a, i, u, s) {
      yE(e, t);
      var f = (t.flags & ze) !== Ae;
      if (!i && !f)
        return u && ZS(t, a, !1), Bu(e, t, s);
      var p = t.stateNode;
      Mp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, nE();
      else {
        ha(t);
        {
          if (Qn(!0), v = p.render(), t.mode & en) {
            En(!0);
            try {
              p.render();
            } finally {
              En(!1);
            }
          }
          Qn(!1);
        }
        ma();
      }
      return t.flags |= ni, e !== null && f ? ST(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && ZS(t, a, !0), t.child;
    }
    function SE(e) {
      var t = e.stateNode;
      t.pendingContext ? XS(e, t.pendingContext, t.pendingContext !== t.context) : t.context && XS(e, t.context, !1), Eg(e, t.containerInfo);
    }
    function bT(e, t, a) {
      if (SE(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      Cx(e, t), rm(t, i, null, a);
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
        if (y.baseState = v, t.memoizedState = v, t.flags & Rr) {
          var g = ec(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return xE(e, t, p, a, g);
        } else if (p !== s) {
          var k = ec(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return xE(e, t, p, a, k);
        } else {
          w1(t);
          var T = hx(t, null, p, a);
          t.child = T;
          for (var U = T; U; )
            U.flags = U.flags & ~xn | qr, U = U.sibling;
        }
      } else {
        if (kf(), p === s)
          return Bu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function xE(e, t, a, i, u) {
      return kf(), ig(u), t.flags |= Rr, Sa(e, t, a, i), t.child;
    }
    function RT(e, t, a) {
      wx(t), e === null && ag(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Hy(i, u);
      return p ? f = null : s !== null && Hy(i, s) && (t.flags |= Na), yE(e, t), Sa(e, t, f, a), t.child;
    }
    function TT(e, t) {
      return e === null && ag(t), null;
    }
    function wT(e, t, a, i) {
      Nm(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = Tk(v), g = ul(v, u), k;
      switch (y) {
        case re:
          return E0(t, v), t.type = v = Wf(v), k = S0(null, t, v, g, i), k;
        case de:
          return t.type = v = X0(v), k = gE(null, t, v, g, i), k;
        case V:
          return t.type = v = J0(v), k = pE(null, t, v, g, i), k;
        case Me: {
          if (t.type !== t.elementType) {
            var T = v.propTypes;
            T && nl(
              T,
              g,
              // Resolved for outer only
              "prop",
              At(v)
            );
          }
          return k = vE(
            null,
            t,
            v,
            ul(v.type, g),
            // The inner type can have defaults too
            i
          ), k;
        }
      }
      var U = "";
      throw v !== null && typeof v == "object" && v.$$typeof === tt && (U = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + U));
    }
    function kT(e, t, a, i, u) {
      Nm(e, t), t.tag = de;
      var s;
      return Yl(a) ? (s = !0, Ph(t)) : s = !1, Nf(t, u), uE(t, a, i), c0(t, a, i, u), x0(null, t, a, !0, s, u);
    }
    function _T(e, t, a, i) {
      Nm(e, t);
      var u = t.pendingProps, s;
      {
        var f = bf(t, a, !1);
        s = Rf(t, f);
      }
      Nf(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = At(a) || "Unknown";
          v0[y] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), v0[y] = !0);
        }
        t.mode & en && al.recordLegacyContextWarning(t, null), Qn(!0), Mp.current = t, p = zf(null, t, a, u, s, i), v = Af(), Qn(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var g = At(a) || "Unknown";
        jp[g] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", g, g, g), jp[g] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var k = At(a) || "Unknown";
          jp[k] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", k, k, k), jp[k] = !0);
        }
        t.tag = de, t.memoizedState = null, t.updateQueue = null;
        var T = !1;
        return Yl(a) ? (T = !0, Ph(t)) : T = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Sg(t), lE(t, p), c0(t, a, u, i), x0(null, t, a, !0, T, i);
      } else {
        if (t.tag = re, t.mode & en) {
          En(!0);
          try {
            p = zf(null, t, a, u, s, i), v = Af();
          } finally {
            En(!1);
          }
        }
        return Fr() && v && Zy(t), Sa(null, t, p, i), E0(t, a), t.child;
      }
    }
    function E0(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), y0[u] || (y0[u] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = At(t) || "Unknown";
          Up[f] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Up[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = At(t) || "Unknown";
          m0[p] || (S("%s: Function components do not support getDerivedStateFromProps.", p), m0[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = At(t) || "Unknown";
          h0[v] || (S("%s: Function components do not support contextType.", v), h0[v] = !0);
        }
      }
    }
    var C0 = {
      dehydrated: null,
      treeContext: null,
      retryLane: Ht
    };
    function b0(e) {
      return {
        baseLanes: e,
        cachePool: gT(),
        transitions: null
      };
    }
    function DT(e, t) {
      var a = null;
      return {
        baseLanes: ht(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function NT(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Rg(e, Rp);
    }
    function OT(e, t) {
      return Ts(e.childLanes, t);
    }
    function EE(e, t, a) {
      var i = t.pendingProps;
      Pk(t) && (t.flags |= ze);
      var u = il.current, s = !1, f = (t.flags & ze) !== Ae;
      if (f || NT(u, e) ? (s = !0, t.flags &= ~ze) : (e === null || e.memoizedState !== null) && (u = q1(u, _x)), u = Lf(u), Ao(t, u), e === null) {
        ag(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return zT(t, v);
        }
        var y = i.children, g = i.fallback;
        if (s) {
          var k = LT(t, y, g, a), T = t.child;
          return T.memoizedState = b0(a), t.memoizedState = C0, k;
        } else
          return R0(t, y);
      } else {
        var U = e.memoizedState;
        if (U !== null) {
          var F = U.dehydrated;
          if (F !== null)
            return AT(e, t, f, i, F, U, a);
        }
        if (s) {
          var I = i.fallback, me = i.children, Ve = jT(e, t, me, I, a), Ue = t.child, jt = e.child.memoizedState;
          return Ue.memoizedState = jt === null ? b0(a) : DT(jt, a), Ue.childLanes = OT(e, a), t.memoizedState = C0, Ve;
        } else {
          var _t = i.children, N = MT(e, t, _t, a);
          return t.memoizedState = null, N;
        }
      }
    }
    function R0(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = T0(u, i);
      return s.return = e, e.child = s, s;
    }
    function LT(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & xt) === Fe && s !== null ? (p = s, p.childLanes = G, p.pendingProps = f, e.mode & Vt && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Wo(a, u, i, null)) : (p = T0(f, u), v = Wo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function T0(e, t, a) {
      return CC(e, t, G, null);
    }
    function CE(e, t) {
      return lc(e, t);
    }
    function MT(e, t, a, i) {
      var u = e.child, s = u.sibling, f = CE(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & xt) === Fe && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Da) : p.push(s);
      }
      return t.child = f, f;
    }
    function jT(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & xt) === Fe && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var g = t.child;
        y = g, y.childLanes = G, y.pendingProps = v, t.mode & Vt && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = CE(f, v), y.subtreeFlags = f.subtreeFlags & Hn;
      var k;
      return p !== null ? k = lc(p, i) : (k = Wo(i, s, u, null), k.flags |= xn), k.return = t, y.return = t, y.sibling = k, t.child = y, k;
    }
    function Dm(e, t, a, i) {
      i !== null && ig(i), _f(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = R0(t, s);
      return f.flags |= xn, t.memoizedState = null, f;
    }
    function UT(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = T0(f, s), v = Wo(i, s, u, null);
      return v.flags |= xn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & xt) !== Fe && _f(t, e.child, null, u), v;
    }
    function zT(e, t, a) {
      return (e.mode & xt) === Fe ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = qe) : Iy(t) ? e.lanes = Tr : e.lanes = Zr, null;
    }
    function AT(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Rr) {
          t.flags &= ~Rr;
          var N = f0(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Dm(e, t, f, N);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= ze, null;
          var Y = i.children, O = i.fallback, Z = UT(e, t, Y, O, f), Ee = t.child;
          return Ee.memoizedState = b0(f), t.memoizedState = C0, Z;
        }
      else {
        if (R1(), (t.mode & xt) === Fe)
          return Dm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Iy(u)) {
          var p, v, y;
          {
            var g = VR(u);
            p = g.digest, v = g.message, y = g.stack;
          }
          var k;
          v ? k = new Error(v) : k = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var T = f0(k, p, y);
          return Dm(e, t, f, T);
        }
        var U = ea(f, e.childLanes);
        if (ol || U) {
          var F = Pm();
          if (F !== null) {
            var I = Fd(F, f);
            if (I !== Ht && I !== s.retryLane) {
              s.retryLane = I;
              var me = rn;
              Ha(e, I), xr(F, e, I, me);
            }
          }
          $0();
          var Ve = f0(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Dm(e, t, f, Ve);
        } else if (WS(u)) {
          t.flags |= ze, t.child = e.child;
          var Ue = ok.bind(null, e);
          return BR(u, Ue), null;
        } else {
          k1(t, u, s.treeContext);
          var jt = i.children, _t = R0(t, jt);
          return _t.flags |= qr, _t;
        }
      }
    }
    function bE(e, t, a) {
      e.lanes = ht(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = ht(i.lanes, t)), hg(e.return, t, a);
    }
    function FT(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === ie) {
          var u = i.memoizedState;
          u !== null && bE(i, a, e);
        } else if (i.tag === zt)
          bE(i, a, e);
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
    function HT(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && um(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function PT(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !g0[e])
        if (g0[e] = !0, typeof e == "string")
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
    function VT(e, t) {
      e !== void 0 && !_m[e] && (e !== "collapsed" && e !== "hidden" ? (_m[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (_m[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function RE(e, t) {
      {
        var a = gt(e), i = !a && typeof st(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function BT(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (gt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!RE(e[a], a))
              return;
        } else {
          var i = st(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!RE(s.value, f))
                  return;
                f++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function w0(e, t, a, i, u) {
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
    function TE(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      PT(u), VT(s, u), BT(f, u), Sa(e, t, f, a);
      var p = il.current, v = Rg(p, Rp);
      if (v)
        p = Tg(p, Rp), t.flags |= ze;
      else {
        var y = e !== null && (e.flags & ze) !== Ae;
        y && FT(t, t.child, a), p = Lf(p);
      }
      if (Ao(t, p), (t.mode & xt) === Fe)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var g = HT(t.child), k;
            g === null ? (k = t.child, t.child = null) : (k = g.sibling, g.sibling = null), w0(
              t,
              !1,
              // isBackwards
              k,
              g,
              s
            );
            break;
          }
          case "backwards": {
            var T = null, U = t.child;
            for (t.child = null; U !== null; ) {
              var F = U.alternate;
              if (F !== null && um(F) === null) {
                t.child = U;
                break;
              }
              var I = U.sibling;
              U.sibling = T, T = U, U = I;
            }
            w0(
              t,
              !0,
              // isBackwards
              T,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            w0(
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
    function IT(e, t, a) {
      Eg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = _f(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var wE = !1;
    function YT(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || wE || (wE = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (gx(t, u, p), f !== null) {
        var y = f.value;
        if (X(y, p)) {
          if (f.children === s.children && !Fh())
            return Bu(e, t, a);
        } else
          P1(t, u, a);
      }
      var g = s.children;
      return Sa(e, t, g, a), t.child;
    }
    var kE = !1;
    function WT(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (kE || (kE = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Nf(t, a);
      var f = ir(i);
      ha(t);
      var p;
      return Mp.current = t, Qn(!0), p = s(f), Qn(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function zp() {
      ol = !0;
    }
    function Nm(e, t) {
      (t.mode & xt) === Fe && e !== null && (e.alternate = null, t.alternate = null, t.flags |= xn);
    }
    function Bu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), nE(), Gp(t.lanes), ea(a, t.childLanes) ? (F1(e, t), t.child) : null;
    }
    function $T(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= Da) : s.push(e), a.flags |= xn, a;
      }
    }
    function k0(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function QT(e, t, a) {
      switch (t.tag) {
        case ae:
          SE(t), t.stateNode, kf();
          break;
        case ne:
          wx(t);
          break;
        case de: {
          var i = t.type;
          Yl(i) && Ph(t);
          break;
        }
        case be:
          Eg(t, t.stateNode.containerInfo);
          break;
        case lt: {
          var u = t.memoizedProps.value, s = t.type._context;
          gx(t, s, u);
          break;
        }
        case _e:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= Ot);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case ie: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Ao(t, Lf(il.current)), t.flags |= ze, null;
            var y = t.child, g = y.childLanes;
            if (ea(a, g))
              return EE(e, t, a);
            Ao(t, Lf(il.current));
            var k = Bu(e, t, a);
            return k !== null ? k.sibling : null;
          } else
            Ao(t, Lf(il.current));
          break;
        }
        case zt: {
          var T = (e.flags & ze) !== Ae, U = ea(a, t.childLanes);
          if (T) {
            if (U)
              return TE(e, t, a);
            t.flags |= ze;
          }
          var F = t.memoizedState;
          if (F !== null && (F.rendering = null, F.tail = null, F.lastEffect = null), Ao(t, il.current), U)
            break;
          return null;
        }
        case De:
        case kt:
          return t.lanes = G, mE(e, t, a);
      }
      return Bu(e, t, a);
    }
    function _E(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return $T(e, t, rS(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Fh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = k0(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & ze) === Ae)
            return ol = !1, QT(e, t, a);
          (e.flags & Tc) !== Ae ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, Fr() && g1(t)) {
        var f = t.index, p = S1();
        nx(t, p, f);
      }
      switch (t.lanes = G, t.tag) {
        case rt:
          return _T(e, t, t.type, a);
        case Tt: {
          var v = t.elementType;
          return wT(e, t, v, a);
        }
        case re: {
          var y = t.type, g = t.pendingProps, k = t.elementType === y ? g : ul(y, g);
          return S0(e, t, y, k, a);
        }
        case de: {
          var T = t.type, U = t.pendingProps, F = t.elementType === T ? U : ul(T, U);
          return gE(e, t, T, F, a);
        }
        case ae:
          return bT(e, t, a);
        case ne:
          return RT(e, t, a);
        case Qe:
          return TT(e, t);
        case ie:
          return EE(e, t, a);
        case be:
          return IT(e, t, a);
        case V: {
          var I = t.type, me = t.pendingProps, Ve = t.elementType === I ? me : ul(I, me);
          return pE(e, t, I, Ve, a);
        }
        case at:
          return xT(e, t, a);
        case ct:
          return ET(e, t, a);
        case _e:
          return CT(e, t, a);
        case lt:
          return YT(e, t, a);
        case Ut:
          return WT(e, t, a);
        case Me: {
          var Ue = t.type, jt = t.pendingProps, _t = ul(Ue, jt);
          if (t.type !== t.elementType) {
            var N = Ue.propTypes;
            N && nl(
              N,
              _t,
              // Resolved for outer only
              "prop",
              At(Ue)
            );
          }
          return _t = ul(Ue.type, _t), vE(e, t, Ue, _t, a);
        }
        case se:
          return hE(e, t, t.type, t.pendingProps, a);
        case Ct: {
          var Y = t.type, O = t.pendingProps, Z = t.elementType === Y ? O : ul(Y, O);
          return kT(e, t, Y, Z, a);
        }
        case zt:
          return TE(e, t, a);
        case Be:
          break;
        case De:
          return mE(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ff(e) {
      e.flags |= Ot;
    }
    function DE(e) {
      e.flags |= Tn, e.flags |= mo;
    }
    var NE, _0, OE, LE;
    NE = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ne || u.tag === Qe)
          hR(e, u.stateNode);
        else if (u.tag !== be) {
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
    }, _0 = function(e, t) {
    }, OE = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Cg(), v = yR(f, a, s, i, u, p);
        t.updateQueue = v, v && Ff(t);
      }
    }, LE = function(e, t, a, i) {
      a !== i && Ff(t);
    };
    function Ap(e, t) {
      if (!Fr())
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
    function Pr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = G, i = Ae;
      if (t) {
        if ((e.mode & Vt) !== Fe) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = ht(a, ht(y.lanes, y.childLanes)), i |= y.subtreeFlags & Hn, i |= y.flags & Hn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var g = e.child; g !== null; )
            a = ht(a, ht(g.lanes, g.childLanes)), i |= g.subtreeFlags & Hn, i |= g.flags & Hn, g.return = e, g = g.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Vt) !== Fe) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = ht(a, ht(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = ht(a, ht(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function GT(e, t, a) {
      if (L1() && (t.mode & xt) !== Fe && (t.flags & ze) === Ae)
        return sx(t), kf(), t.flags |= Rr | ss | tr, !1;
      var i = Wh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (N1(t), Pr(t), (t.mode & Vt) !== Fe) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (kf(), (t.flags & ze) === Ae && (t.memoizedState = null), t.flags |= Ot, Pr(t), (t.mode & Vt) !== Fe) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return cx(), !0;
    }
    function ME(e, t, a) {
      var i = t.pendingProps;
      switch (eg(t), t.tag) {
        case rt:
        case Tt:
        case se:
        case re:
        case V:
        case at:
        case ct:
        case _e:
        case Ut:
        case Me:
          return Pr(t), null;
        case de: {
          var u = t.type;
          return Yl(u) && Hh(t), Pr(t), null;
        }
        case ae: {
          var s = t.stateNode;
          if (Of(t), Ky(t), kg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Wh(t);
            if (f)
              Ff(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Rr) !== Ae) && (t.flags |= Gn, cx());
            }
          }
          return _0(e, t), Pr(t), null;
        }
        case ne: {
          bg(t);
          var v = Tx(), y = t.type;
          if (e !== null && t.stateNode != null)
            OE(e, t, y, i, v), e.ref !== t.ref && DE(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Pr(t), null;
            }
            var g = Cg(), k = Wh(t);
            if (k)
              _1(t, v, g) && Ff(t);
            else {
              var T = vR(y, i, v, g, t);
              NE(T, t, !1, !1), t.stateNode = T, mR(T, y, i, v) && Ff(t);
            }
            t.ref !== null && DE(t);
          }
          return Pr(t), null;
        }
        case Qe: {
          var U = i;
          if (e && t.stateNode != null) {
            var F = e.memoizedProps;
            LE(e, t, F, U);
          } else {
            if (typeof U != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var I = Tx(), me = Cg(), Ve = Wh(t);
            Ve ? D1(t) && Ff(t) : t.stateNode = gR(U, I, me, t);
          }
          return Pr(t), null;
        }
        case ie: {
          Mf(t);
          var Ue = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var jt = GT(e, t, Ue);
            if (!jt)
              return t.flags & tr ? t : null;
          }
          if ((t.flags & ze) !== Ae)
            return t.lanes = a, (t.mode & Vt) !== Fe && Jg(t), t;
          var _t = Ue !== null, N = e !== null && e.memoizedState !== null;
          if (_t !== N && _t) {
            var Y = t.child;
            if (Y.flags |= Fn, (t.mode & xt) !== Fe) {
              var O = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              O || Rg(il.current, _x) ? qw() : $0();
            }
          }
          var Z = t.updateQueue;
          if (Z !== null && (t.flags |= Ot), Pr(t), (t.mode & Vt) !== Fe && _t) {
            var Ee = t.child;
            Ee !== null && (t.treeBaseDuration -= Ee.treeBaseDuration);
          }
          return null;
        }
        case be:
          return Of(t), _0(e, t), e === null && f1(t.stateNode.containerInfo), Pr(t), null;
        case lt:
          var ge = t.type._context;
          return vg(ge, t), Pr(t), null;
        case Ct: {
          var Ke = t.type;
          return Yl(Ke) && Hh(t), Pr(t), null;
        }
        case zt: {
          Mf(t);
          var it = t.memoizedState;
          if (it === null)
            return Pr(t), null;
          var nn = (t.flags & ze) !== Ae, Yt = it.rendering;
          if (Yt === null)
            if (nn)
              Ap(it, !1);
            else {
              var Xn = Xw() && (e === null || (e.flags & ze) === Ae);
              if (!Xn)
                for (var Wt = t.child; Wt !== null; ) {
                  var Wn = um(Wt);
                  if (Wn !== null) {
                    nn = !0, t.flags |= ze, Ap(it, !1);
                    var ua = Wn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= Ot), t.subtreeFlags = Ae, H1(t, a), Ao(t, Tg(il.current, Rp)), t.child;
                  }
                  Wt = Wt.sibling;
                }
              it.tail !== null && qn() > eC() && (t.flags |= ze, nn = !0, Ap(it, !1), t.lanes = Dd);
            }
          else {
            if (!nn) {
              var Wr = um(Yt);
              if (Wr !== null) {
                t.flags |= ze, nn = !0;
                var si = Wr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= Ot), Ap(it, !0), it.tail === null && it.tailMode === "hidden" && !Yt.alternate && !Fr())
                  return Pr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              qn() * 2 - it.renderingStartTime > eC() && a !== Zr && (t.flags |= ze, nn = !0, Ap(it, !1), t.lanes = Dd);
            }
            if (it.isBackwards)
              Yt.sibling = t.child, t.child = Yt;
            else {
              var Ca = it.last;
              Ca !== null ? Ca.sibling = Yt : t.child = Yt, it.last = Yt;
            }
          }
          if (it.tail !== null) {
            var ba = it.tail;
            it.rendering = ba, it.tail = ba.sibling, it.renderingStartTime = qn(), ba.sibling = null;
            var oa = il.current;
            return nn ? oa = Tg(oa, Rp) : oa = Lf(oa), Ao(t, oa), ba;
          }
          return Pr(t), null;
        }
        case Be:
          break;
        case De:
        case kt: {
          W0(t);
          var Qu = t.memoizedState, $f = Qu !== null;
          if (e !== null) {
            var Zp = e.memoizedState, Jl = Zp !== null;
            Jl !== $f && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !oe && (t.flags |= Fn);
          }
          return !$f || (t.mode & xt) === Fe ? Pr(t) : ea(Xl, Zr) && (Pr(t), t.subtreeFlags & (xn | Ot) && (t.flags |= Fn)), null;
        }
        case Ze:
          return null;
        case wt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function qT(e, t, a) {
      switch (eg(t), t.tag) {
        case de: {
          var i = t.type;
          Yl(i) && Hh(t);
          var u = t.flags;
          return u & tr ? (t.flags = u & ~tr | ze, (t.mode & Vt) !== Fe && Jg(t), t) : null;
        }
        case ae: {
          t.stateNode, Of(t), Ky(t), kg();
          var s = t.flags;
          return (s & tr) !== Ae && (s & ze) === Ae ? (t.flags = s & ~tr | ze, t) : null;
        }
        case ne:
          return bg(t), null;
        case ie: {
          Mf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            kf();
          }
          var p = t.flags;
          return p & tr ? (t.flags = p & ~tr | ze, (t.mode & Vt) !== Fe && Jg(t), t) : null;
        }
        case zt:
          return Mf(t), null;
        case be:
          return Of(t), null;
        case lt:
          var v = t.type._context;
          return vg(v, t), null;
        case De:
        case kt:
          return W0(t), null;
        case Ze:
          return null;
        default:
          return null;
      }
    }
    function jE(e, t, a) {
      switch (eg(t), t.tag) {
        case de: {
          var i = t.type.childContextTypes;
          i != null && Hh(t);
          break;
        }
        case ae: {
          t.stateNode, Of(t), Ky(t), kg();
          break;
        }
        case ne: {
          bg(t);
          break;
        }
        case be:
          Of(t);
          break;
        case ie:
          Mf(t);
          break;
        case zt:
          Mf(t);
          break;
        case lt:
          var u = t.type._context;
          vg(u, t);
          break;
        case De:
        case kt:
          W0(t);
          break;
      }
    }
    var UE = null;
    UE = /* @__PURE__ */ new Set();
    var Om = !1, Vr = !1, KT = typeof WeakSet == "function" ? WeakSet : Set, ke = null, Hf = null, Pf = null;
    function XT(e) {
      wl(null, function() {
        throw e;
      }), os();
    }
    var JT = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Vt)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Gl(e);
        }
      else
        t.componentWillUnmount();
    };
    function zE(e, t) {
      try {
        Po(vr, e);
      } catch (a) {
        vn(e, t, a);
      }
    }
    function D0(e, t, a) {
      try {
        JT(e, a);
      } catch (i) {
        vn(e, t, i);
      }
    }
    function ZT(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        vn(e, t, i);
      }
    }
    function AE(e, t) {
      try {
        HE(e);
      } catch (a) {
        vn(e, t, a);
      }
    }
    function Vf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (He && dt && e.mode & Vt)
              try {
                ql(), i = a(null);
              } finally {
                Gl(e);
              }
            else
              i = a(null);
          } catch (u) {
            vn(e, t, u);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", et(e));
        } else
          a.current = null;
    }
    function Lm(e, t, a) {
      try {
        a();
      } catch (i) {
        vn(e, t, i);
      }
    }
    var FE = !1;
    function ew(e, t) {
      dR(e.containerInfo), ke = t, tw();
      var a = FE;
      return FE = !1, a;
    }
    function tw() {
      for (; ke !== null; ) {
        var e = ke, t = e.child;
        (e.subtreeFlags & _l) !== Ae && t !== null ? (t.return = e, ke = t) : nw();
      }
    }
    function nw() {
      for (; ke !== null; ) {
        var e = ke;
        Xt(e);
        try {
          rw(e);
        } catch (a) {
          vn(e, e.return, a);
        }
        pn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ke = t;
          return;
        }
        ke = e.return;
      }
    }
    function rw(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Gn) !== Ae) {
        switch (Xt(e), e.tag) {
          case re:
          case V:
          case se:
            break;
          case de: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !tc && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = UE;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", et(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case ae: {
            {
              var v = e.stateNode;
              AR(v.containerInfo);
            }
            break;
          }
          case ne:
          case Qe:
          case be:
          case Ct:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        pn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Hr) !== Pa ? Ki(t) : (e & vr) !== Pa && fs(t), (e & Wl) !== Pa && Kp(!0), Lm(t, a, p), (e & Wl) !== Pa && Kp(!1), (e & Hr) !== Pa ? Ll() : (e & vr) !== Pa && kd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Po(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & Hr) !== Pa ? wd(t) : (e & vr) !== Pa && Oc(t);
            var f = s.create;
            (e & Wl) !== Pa && Kp(!0), s.destroy = f(), (e & Wl) !== Pa && Kp(!1), (e & Hr) !== Pa ? Av() : (e & vr) !== Pa && Fv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & vr) !== Ae ? v = "useLayoutEffect" : (s.tag & Wl) !== Ae ? v = "useInsertionEffect" : v = "useEffect";
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
    function aw(e, t) {
      if ((t.flags & Ot) !== Ae)
        switch (t.tag) {
          case _e: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = eE(), p = t.alternate === null ? "mount" : "update";
            Zx() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case ae:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case _e:
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
    function iw(e, t, a, i) {
      if ((a.flags & Nl) !== Ae)
        switch (a.tag) {
          case re:
          case V:
          case se: {
            if (!Vr)
              if (a.mode & Vt)
                try {
                  ql(), Po(vr | pr, a);
                } finally {
                  Gl(a);
                }
              else
                Po(vr | pr, a);
            break;
          }
          case de: {
            var u = a.stateNode;
            if (a.flags & Ot && !Vr)
              if (t === null)
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(a) || "instance")), a.mode & Vt)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(a) || "instance")), a.mode & Vt)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", et(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", et(a) || "instance")), Rx(a, p, u));
            break;
          }
          case ae: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ne:
                    y = a.child.stateNode;
                    break;
                  case de:
                    y = a.child.stateNode;
                    break;
                }
              Rx(a, v, y);
            }
            break;
          }
          case ne: {
            var g = a.stateNode;
            if (t === null && a.flags & Ot) {
              var k = a.type, T = a.memoizedProps;
              bR(g, k, T);
            }
            break;
          }
          case Qe:
            break;
          case be:
            break;
          case _e: {
            {
              var U = a.memoizedProps, F = U.onCommit, I = U.onRender, me = a.stateNode.effectDuration, Ve = eE(), Ue = t === null ? "mount" : "update";
              Zx() && (Ue = "nested-update"), typeof I == "function" && I(a.memoizedProps.id, Ue, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Ve);
              {
                typeof F == "function" && F(a.memoizedProps.id, Ue, me, Ve), nk(a);
                var jt = a.return;
                e: for (; jt !== null; ) {
                  switch (jt.tag) {
                    case ae:
                      var _t = jt.stateNode;
                      _t.effectDuration += me;
                      break e;
                    case _e:
                      var N = jt.stateNode;
                      N.effectDuration += me;
                      break e;
                  }
                  jt = jt.return;
                }
              }
            }
            break;
          }
          case ie: {
            pw(e, a);
            break;
          }
          case zt:
          case Ct:
          case Be:
          case De:
          case kt:
          case wt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Vr || a.flags & Tn && HE(a);
    }
    function lw(e) {
      switch (e.tag) {
        case re:
        case V:
        case se: {
          if (e.mode & Vt)
            try {
              ql(), zE(e, e.return);
            } finally {
              Gl(e);
            }
          else
            zE(e, e.return);
          break;
        }
        case de: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && ZT(e, e.return, t), AE(e, e.return);
          break;
        }
        case ne: {
          AE(e, e.return);
          break;
        }
      }
    }
    function uw(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ne) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? MR(u) : UR(i.stateNode, i.memoizedProps);
            } catch (f) {
              vn(e, e.return, f);
            }
          }
        } else if (i.tag === Qe) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? jR(s) : zR(s, i.memoizedProps);
            } catch (f) {
              vn(e, e.return, f);
            }
        } else if (!((i.tag === De || i.tag === kt) && i.memoizedState !== null && i !== e)) {
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
    function HE(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ne:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Vt)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", et(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", et(e)), t.current = i;
      }
    }
    function ow(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function PE(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, PE(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ne) {
          var a = e.stateNode;
          a !== null && v1(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function sw(e) {
      for (var t = e.return; t !== null; ) {
        if (VE(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function VE(e) {
      return e.tag === ne || e.tag === ae || e.tag === be;
    }
    function BE(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || VE(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ne && t.tag !== Qe && t.tag !== ft; ) {
          if (t.flags & xn || t.child === null || t.tag === be)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & xn))
          return t.stateNode;
      }
    }
    function cw(e) {
      var t = sw(e);
      switch (t.tag) {
        case ne: {
          var a = t.stateNode;
          t.flags & Na && (YS(a), t.flags &= ~Na);
          var i = BE(e);
          O0(e, i, a);
          break;
        }
        case ae:
        case be: {
          var u = t.stateNode.containerInfo, s = BE(e);
          N0(e, s, u);
          break;
        }
        // eslint-disable-next-line-no-fallthrough
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function N0(e, t, a) {
      var i = e.tag, u = i === ne || i === Qe;
      if (u) {
        var s = e.stateNode;
        t ? DR(a, s, t) : kR(a, s);
      } else if (i !== be) {
        var f = e.child;
        if (f !== null) {
          N0(f, t, a);
          for (var p = f.sibling; p !== null; )
            N0(p, t, a), p = p.sibling;
        }
      }
    }
    function O0(e, t, a) {
      var i = e.tag, u = i === ne || i === Qe;
      if (u) {
        var s = e.stateNode;
        t ? _R(a, s, t) : wR(a, s);
      } else if (i !== be) {
        var f = e.child;
        if (f !== null) {
          O0(f, t, a);
          for (var p = f.sibling; p !== null; )
            O0(p, t, a), p = p.sibling;
        }
      }
    }
    var Br = null, cl = !1;
    function fw(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ne: {
              Br = i.stateNode, cl = !1;
              break e;
            }
            case ae: {
              Br = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case be: {
              Br = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Br === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        IE(e, t, a), Br = null, cl = !1;
      }
      ow(a);
    }
    function Vo(e, t, a) {
      for (var i = a.child; i !== null; )
        IE(e, t, i), i = i.sibling;
    }
    function IE(e, t, a) {
      switch (bd(a), a.tag) {
        case ne:
          Vr || Vf(a, t);
        // eslint-disable-next-line-no-fallthrough
        case Qe: {
          {
            var i = Br, u = cl;
            Br = null, Vo(e, t, a), Br = i, cl = u, Br !== null && (cl ? OR(Br, a.stateNode) : NR(Br, a.stateNode));
          }
          return;
        }
        case ft: {
          Br !== null && (cl ? LR(Br, a.stateNode) : By(Br, a.stateNode));
          return;
        }
        case be: {
          {
            var s = Br, f = cl;
            Br = a.stateNode.containerInfo, cl = !0, Vo(e, t, a), Br = s, cl = f;
          }
          return;
        }
        case re:
        case V:
        case Me:
        case se: {
          if (!Vr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, g = y;
                do {
                  var k = g, T = k.destroy, U = k.tag;
                  T !== void 0 && ((U & Wl) !== Pa ? Lm(a, t, T) : (U & vr) !== Pa && (fs(a), a.mode & Vt ? (ql(), Lm(a, t, T), Gl(a)) : Lm(a, t, T), kd())), g = g.next;
                } while (g !== y);
              }
            }
          }
          Vo(e, t, a);
          return;
        }
        case de: {
          if (!Vr) {
            Vf(a, t);
            var F = a.stateNode;
            typeof F.componentWillUnmount == "function" && D0(a, t, F);
          }
          Vo(e, t, a);
          return;
        }
        case Be: {
          Vo(e, t, a);
          return;
        }
        case De: {
          if (
            // TODO: Remove this dead flag
            a.mode & xt
          ) {
            var I = Vr;
            Vr = I || a.memoizedState !== null, Vo(e, t, a), Vr = I;
          } else
            Vo(e, t, a);
          break;
        }
        default: {
          Vo(e, t, a);
          return;
        }
      }
    }
    function dw(e) {
      e.memoizedState;
    }
    function pw(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && XR(s);
          }
        }
      }
    }
    function YE(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new KT()), t.forEach(function(i) {
          var u = sk.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Jr)
              if (Hf !== null && Pf !== null)
                qp(Pf, Hf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function vw(e, t, a) {
      Hf = a, Pf = e, Xt(t), WE(t, e), Xt(t), Hf = null, Pf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            fw(e, t, s);
          } catch (v) {
            vn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & Dl)
        for (var p = t.child; p !== null; )
          Xt(p), WE(p, e), p = p.sibling;
      Xt(f);
    }
    function WE(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case re:
        case V:
        case Me:
        case se: {
          if (fl(t, e), Kl(e), u & Ot) {
            try {
              sl(Wl | pr, e, e.return), Po(Wl | pr, e);
            } catch (Ke) {
              vn(e, e.return, Ke);
            }
            if (e.mode & Vt) {
              try {
                ql(), sl(vr | pr, e, e.return);
              } catch (Ke) {
                vn(e, e.return, Ke);
              }
              Gl(e);
            } else
              try {
                sl(vr | pr, e, e.return);
              } catch (Ke) {
                vn(e, e.return, Ke);
              }
          }
          return;
        }
        case de: {
          fl(t, e), Kl(e), u & Tn && i !== null && Vf(i, i.return);
          return;
        }
        case ne: {
          fl(t, e), Kl(e), u & Tn && i !== null && Vf(i, i.return);
          {
            if (e.flags & Na) {
              var s = e.stateNode;
              try {
                YS(s);
              } catch (Ke) {
                vn(e, e.return, Ke);
              }
            }
            if (u & Ot) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, g = e.updateQueue;
                if (e.updateQueue = null, g !== null)
                  try {
                    RR(f, g, y, v, p, e);
                  } catch (Ke) {
                    vn(e, e.return, Ke);
                  }
              }
            }
          }
          return;
        }
        case Qe: {
          if (fl(t, e), Kl(e), u & Ot) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var k = e.stateNode, T = e.memoizedProps, U = i !== null ? i.memoizedProps : T;
            try {
              TR(k, U, T);
            } catch (Ke) {
              vn(e, e.return, Ke);
            }
          }
          return;
        }
        case ae: {
          if (fl(t, e), Kl(e), u & Ot && i !== null) {
            var F = i.memoizedState;
            if (F.isDehydrated)
              try {
                KR(t.containerInfo);
              } catch (Ke) {
                vn(e, e.return, Ke);
              }
          }
          return;
        }
        case be: {
          fl(t, e), Kl(e);
          return;
        }
        case ie: {
          fl(t, e), Kl(e);
          var I = e.child;
          if (I.flags & Fn) {
            var me = I.stateNode, Ve = I.memoizedState, Ue = Ve !== null;
            if (me.isHidden = Ue, Ue) {
              var jt = I.alternate !== null && I.alternate.memoizedState !== null;
              jt || Gw();
            }
          }
          if (u & Ot) {
            try {
              dw(e);
            } catch (Ke) {
              vn(e, e.return, Ke);
            }
            YE(e);
          }
          return;
        }
        case De: {
          var _t = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & xt
          ) {
            var N = Vr;
            Vr = N || _t, fl(t, e), Vr = N;
          } else
            fl(t, e);
          if (Kl(e), u & Fn) {
            var Y = e.stateNode, O = e.memoizedState, Z = O !== null, Ee = e;
            if (Y.isHidden = Z, Z && !_t && (Ee.mode & xt) !== Fe) {
              ke = Ee;
              for (var ge = Ee.child; ge !== null; )
                ke = ge, mw(ge), ge = ge.sibling;
            }
            uw(Ee, Z);
          }
          return;
        }
        case zt: {
          fl(t, e), Kl(e), u & Ot && YE(e);
          return;
        }
        case Be:
          return;
        default: {
          fl(t, e), Kl(e);
          return;
        }
      }
    }
    function Kl(e) {
      var t = e.flags;
      if (t & xn) {
        try {
          cw(e);
        } catch (a) {
          vn(e, e.return, a);
        }
        e.flags &= ~xn;
      }
      t & qr && (e.flags &= ~qr);
    }
    function hw(e, t, a) {
      Hf = a, Pf = t, ke = e, $E(e, t, a), Hf = null, Pf = null;
    }
    function $E(e, t, a) {
      for (var i = (e.mode & xt) !== Fe; ke !== null; ) {
        var u = ke, s = u.child;
        if (u.tag === De && i) {
          var f = u.memoizedState !== null, p = f || Om;
          if (p) {
            L0(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, g = y || Vr, k = Om, T = Vr;
            Om = p, Vr = g, Vr && !T && (ke = u, yw(u));
            for (var U = s; U !== null; )
              ke = U, $E(
                U,
                // New root; bubble back up to here and stop.
                t,
                a
              ), U = U.sibling;
            ke = u, Om = k, Vr = T, L0(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Nl) !== Ae && s !== null ? (s.return = u, ke = s) : L0(e, t, a);
      }
    }
    function L0(e, t, a) {
      for (; ke !== null; ) {
        var i = ke;
        if ((i.flags & Nl) !== Ae) {
          var u = i.alternate;
          Xt(i);
          try {
            iw(t, u, i, a);
          } catch (f) {
            vn(i, i.return, f);
          }
          pn();
        }
        if (i === e) {
          ke = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, ke = s;
          return;
        }
        ke = i.return;
      }
    }
    function mw(e) {
      for (; ke !== null; ) {
        var t = ke, a = t.child;
        switch (t.tag) {
          case re:
          case V:
          case Me:
          case se: {
            if (t.mode & Vt)
              try {
                ql(), sl(vr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(vr, t, t.return);
            break;
          }
          case de: {
            Vf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && D0(t, t.return, i);
            break;
          }
          case ne: {
            Vf(t, t.return);
            break;
          }
          case De: {
            var u = t.memoizedState !== null;
            if (u) {
              QE(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, ke = a) : QE(e);
      }
    }
    function QE(e) {
      for (; ke !== null; ) {
        var t = ke;
        if (t === e) {
          ke = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ke = a;
          return;
        }
        ke = t.return;
      }
    }
    function yw(e) {
      for (; ke !== null; ) {
        var t = ke, a = t.child;
        if (t.tag === De) {
          var i = t.memoizedState !== null;
          if (i) {
            GE(e);
            continue;
          }
        }
        a !== null ? (a.return = t, ke = a) : GE(e);
      }
    }
    function GE(e) {
      for (; ke !== null; ) {
        var t = ke;
        Xt(t);
        try {
          lw(t);
        } catch (i) {
          vn(t, t.return, i);
        }
        if (pn(), t === e) {
          ke = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ke = a;
          return;
        }
        ke = t.return;
      }
    }
    function gw(e, t, a, i) {
      ke = t, Sw(t, e, a, i);
    }
    function Sw(e, t, a, i) {
      for (; ke !== null; ) {
        var u = ke, s = u.child;
        (u.subtreeFlags & Gi) !== Ae && s !== null ? (s.return = u, ke = s) : xw(e, t, a, i);
      }
    }
    function xw(e, t, a, i) {
      for (; ke !== null; ) {
        var u = ke;
        if ((u.flags & Gr) !== Ae) {
          Xt(u);
          try {
            Ew(t, u, a, i);
          } catch (f) {
            vn(u, u.return, f);
          }
          pn();
        }
        if (u === e) {
          ke = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, ke = s;
          return;
        }
        ke = u.return;
      }
    }
    function Ew(e, t, a, i) {
      switch (t.tag) {
        case re:
        case V:
        case se: {
          if (t.mode & Vt) {
            Xg();
            try {
              Po(Hr | pr, t);
            } finally {
              Kg(t);
            }
          } else
            Po(Hr | pr, t);
          break;
        }
      }
    }
    function Cw(e) {
      ke = e, bw();
    }
    function bw() {
      for (; ke !== null; ) {
        var e = ke, t = e.child;
        if ((ke.flags & Da) !== Ae) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              ke = u, ww(u, e);
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
            ke = e;
          }
        }
        (e.subtreeFlags & Gi) !== Ae && t !== null ? (t.return = e, ke = t) : Rw();
      }
    }
    function Rw() {
      for (; ke !== null; ) {
        var e = ke;
        (e.flags & Gr) !== Ae && (Xt(e), Tw(e), pn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ke = t;
          return;
        }
        ke = e.return;
      }
    }
    function Tw(e) {
      switch (e.tag) {
        case re:
        case V:
        case se: {
          e.mode & Vt ? (Xg(), sl(Hr | pr, e, e.return), Kg(e)) : sl(Hr | pr, e, e.return);
          break;
        }
      }
    }
    function ww(e, t) {
      for (; ke !== null; ) {
        var a = ke;
        Xt(a), _w(a, t), pn();
        var i = a.child;
        i !== null ? (i.return = a, ke = i) : kw(e);
      }
    }
    function kw(e) {
      for (; ke !== null; ) {
        var t = ke, a = t.sibling, i = t.return;
        if (PE(t), t === e) {
          ke = null;
          return;
        }
        if (a !== null) {
          a.return = i, ke = a;
          return;
        }
        ke = i;
      }
    }
    function _w(e, t) {
      switch (e.tag) {
        case re:
        case V:
        case se: {
          e.mode & Vt ? (Xg(), sl(Hr, e, t), Kg(e)) : sl(Hr, e, t);
          break;
        }
      }
    }
    function Dw(e) {
      switch (e.tag) {
        case re:
        case V:
        case se: {
          try {
            Po(vr | pr, e);
          } catch (a) {
            vn(e, e.return, a);
          }
          break;
        }
        case de: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            vn(e, e.return, a);
          }
          break;
        }
      }
    }
    function Nw(e) {
      switch (e.tag) {
        case re:
        case V:
        case se: {
          try {
            Po(Hr | pr, e);
          } catch (t) {
            vn(e, e.return, t);
          }
          break;
        }
      }
    }
    function Ow(e) {
      switch (e.tag) {
        case re:
        case V:
        case se: {
          try {
            sl(vr | pr, e, e.return);
          } catch (a) {
            vn(e, e.return, a);
          }
          break;
        }
        case de: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && D0(e, e.return, t);
          break;
        }
      }
    }
    function Lw(e) {
      switch (e.tag) {
        case re:
        case V:
        case se:
          try {
            sl(Hr | pr, e, e.return);
          } catch (t) {
            vn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Fp = Symbol.for;
      Fp("selector.component"), Fp("selector.has_pseudo_class"), Fp("selector.role"), Fp("selector.test_id"), Fp("selector.text");
    }
    var Mw = [];
    function jw() {
      Mw.forEach(function(e) {
        return e();
      });
    }
    var Uw = j.ReactCurrentActQueue;
    function zw(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function qE() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && Uw.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var Aw = Math.ceil, M0 = j.ReactCurrentDispatcher, j0 = j.ReactCurrentOwner, Ir = j.ReactCurrentBatchConfig, dl = j.ReactCurrentActQueue, yr = (
      /*             */
      0
    ), KE = (
      /*               */
      1
    ), Yr = (
      /*                */
      2
    ), Ai = (
      /*                */
      4
    ), Iu = 0, Hp = 1, nc = 2, Mm = 3, Pp = 4, XE = 5, U0 = 6, Mt = yr, xa = null, Un = null, gr = G, Xl = G, z0 = Oo(G), Sr = Iu, Vp = null, jm = G, Bp = G, Um = G, Ip = null, Va = null, A0 = 0, JE = 500, ZE = 1 / 0, Fw = 500, Yu = null;
    function Yp() {
      ZE = qn() + Fw;
    }
    function eC() {
      return ZE;
    }
    var zm = !1, F0 = null, Bf = null, rc = !1, Bo = null, Wp = G, H0 = [], P0 = null, Hw = 50, $p = 0, V0 = null, B0 = !1, Am = !1, Pw = 50, If = 0, Fm = null, Qp = rn, Hm = G, tC = !1;
    function Pm() {
      return xa;
    }
    function Ea() {
      return (Mt & (Yr | Ai)) !== yr ? qn() : (Qp !== rn || (Qp = qn()), Qp);
    }
    function Io(e) {
      var t = e.mode;
      if ((t & xt) === Fe)
        return qe;
      if ((Mt & Yr) !== yr && gr !== G)
        return Rs(gr);
      var a = U1() !== j1;
      if (a) {
        if (Ir.transition !== null) {
          var i = Ir.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Hm === Ht && (Hm = Ud()), Hm;
      }
      var u = za();
      if (u !== Ht)
        return u;
      var s = SR();
      return s;
    }
    function Vw(e) {
      var t = e.mode;
      return (t & xt) === Fe ? qe : Yv();
    }
    function xr(e, t, a, i) {
      fk(), tC && S("useInsertionEffect must not schedule updates."), B0 && (Am = !0), xo(e, a, i), (Mt & Yr) !== G && e === xa ? vk(t) : (Jr && ks(e, t, a), hk(t), e === xa && ((Mt & Yr) === yr && (Bp = ht(Bp, a)), Sr === Pp && Yo(e, gr)), Ba(e, i), a === qe && Mt === yr && (t.mode & xt) === Fe && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Yp(), tx()));
    }
    function Bw(e, t, a) {
      var i = e.current;
      i.lanes = t, xo(e, t, a), Ba(e, a);
    }
    function Iw(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Mt & Yr) !== yr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Xc(e, t);
      var i = Kc(e, e === xa ? gr : G);
      if (i === G) {
        a !== null && yC(a), e.callbackNode = null, e.callbackPriority = Ht;
        return;
      }
      var u = Ul(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== q0)) {
        a == null && s !== qe && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && yC(a);
      var f;
      if (u === qe)
        e.tag === Lo ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), y1(aC.bind(null, e))) : ex(aC.bind(null, e)), dl.current !== null ? dl.current.push(Mo) : ER(function() {
          (Mt & (Yr | Ai)) === yr && Mo();
        }), f = null;
      else {
        var p;
        switch (Xv(i)) {
          case Mr:
            p = cs;
            break;
          case ki:
            p = Ol;
            break;
          case ja:
            p = qi;
            break;
          case Ua:
            p = yu;
            break;
          default:
            p = qi;
            break;
        }
        f = K0(p, nC.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function nC(e, t) {
      if (uT(), Qp = rn, Hm = G, (Mt & (Yr | Ai)) !== yr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = Kc(e, e === xa ? gr : G);
      if (u === G)
        return null;
      var s = !Zc(e, u) && !Iv(e, u) && !t, f = s ? Zw(e, u) : Bm(e, u);
      if (f !== Iu) {
        if (f === nc) {
          var p = Jc(e);
          p !== G && (u = p, f = I0(e, p));
        }
        if (f === Hp) {
          var v = Vp;
          throw ac(e, G), Yo(e, u), Ba(e, qn()), v;
        }
        if (f === U0)
          Yo(e, u);
        else {
          var y = !Zc(e, u), g = e.current.alternate;
          if (y && !Ww(g)) {
            if (f = Bm(e, u), f === nc) {
              var k = Jc(e);
              k !== G && (u = k, f = I0(e, k));
            }
            if (f === Hp) {
              var T = Vp;
              throw ac(e, G), Yo(e, u), Ba(e, qn()), T;
            }
          }
          e.finishedWork = g, e.finishedLanes = u, Yw(e, f, u);
        }
      }
      return Ba(e, qn()), e.callbackNode === a ? nC.bind(null, e) : null;
    }
    function I0(e, t) {
      var a = Ip;
      if (nf(e)) {
        var i = ac(e, t);
        i.flags |= Rr, c1(e.containerInfo);
      }
      var u = Bm(e, t);
      if (u !== nc) {
        var s = Va;
        Va = a, s !== null && rC(s);
      }
      return u;
    }
    function rC(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function Yw(e, t, a) {
      switch (t) {
        case Iu:
        case Hp:
          throw new Error("Root did not complete. This is a bug in React.");
        // Flow knows about invariant, so it complains if I add a break
        // statement, but eslint doesn't know about invariant, so it complains
        // if I do. eslint-disable-next-line no-fallthrough
        case nc: {
          ic(e, Va, Yu);
          break;
        }
        case Mm: {
          if (Yo(e, a), _u(a) && // do not delay if we're inside an act() scope
          !gC()) {
            var i = A0 + JE - qn();
            if (i > 10) {
              var u = Kc(e, G);
              if (u !== G)
                break;
              var s = e.suspendedLanes;
              if (!Du(s, a)) {
                Ea(), ef(e, s);
                break;
              }
              e.timeoutHandle = Py(ic.bind(null, e, Va, Yu), i);
              break;
            }
          }
          ic(e, Va, Yu);
          break;
        }
        case Pp: {
          if (Yo(e, a), Md(a))
            break;
          if (!gC()) {
            var f = ai(e, a), p = f, v = qn() - p, y = ck(v) - v;
            if (y > 10) {
              e.timeoutHandle = Py(ic.bind(null, e, Va, Yu), y);
              break;
            }
          }
          ic(e, Va, Yu);
          break;
        }
        case XE: {
          ic(e, Va, Yu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function Ww(e) {
      for (var t = e; ; ) {
        if (t.flags & ho) {
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
        if (t.subtreeFlags & ho && v !== null) {
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
    function Yo(e, t) {
      t = Ts(t, Um), t = Ts(t, Bp), Qv(e, t);
    }
    function aC(e) {
      if (oT(), (Mt & (Yr | Ai)) !== yr)
        throw new Error("Should not already be working.");
      $u();
      var t = Kc(e, G);
      if (!ea(t, qe))
        return Ba(e, qn()), null;
      var a = Bm(e, t);
      if (e.tag !== Lo && a === nc) {
        var i = Jc(e);
        i !== G && (t = i, a = I0(e, i));
      }
      if (a === Hp) {
        var u = Vp;
        throw ac(e, G), Yo(e, t), Ba(e, qn()), u;
      }
      if (a === U0)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ic(e, Va, Yu), Ba(e, qn()), null;
    }
    function $w(e, t) {
      t !== G && (tf(e, ht(t, qe)), Ba(e, qn()), (Mt & (Yr | Ai)) === yr && (Yp(), Mo()));
    }
    function Y0(e, t) {
      var a = Mt;
      Mt |= KE;
      try {
        return e(t);
      } finally {
        Mt = a, Mt === yr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Yp(), tx());
      }
    }
    function Qw(e, t, a, i, u) {
      var s = za(), f = Ir.transition;
      try {
        return Ir.transition = null, Bn(Mr), e(t, a, i, u);
      } finally {
        Bn(s), Ir.transition = f, Mt === yr && Yp();
      }
    }
    function Wu(e) {
      Bo !== null && Bo.tag === Lo && (Mt & (Yr | Ai)) === yr && $u();
      var t = Mt;
      Mt |= KE;
      var a = Ir.transition, i = za();
      try {
        return Ir.transition = null, Bn(Mr), e ? e() : void 0;
      } finally {
        Bn(i), Ir.transition = a, Mt = t, (Mt & (Yr | Ai)) === yr && Mo();
      }
    }
    function iC() {
      return (Mt & (Yr | Ai)) !== yr;
    }
    function Vm(e, t) {
      ia(z0, Xl, e), Xl = ht(Xl, t);
    }
    function W0(e) {
      Xl = z0.current, aa(z0, e);
    }
    function ac(e, t) {
      e.finishedWork = null, e.finishedLanes = G;
      var a = e.timeoutHandle;
      if (a !== Vy && (e.timeoutHandle = Vy, xR(a)), Un !== null)
        for (var i = Un.return; i !== null; ) {
          var u = i.alternate;
          jE(u, i), i = i.return;
        }
      xa = e;
      var s = lc(e.current, null);
      return Un = s, gr = Xl = t, Sr = Iu, Vp = null, jm = G, Bp = G, Um = G, Ip = null, Va = null, B1(), al.discardPendingWarnings(), s;
    }
    function lC(e, t) {
      do {
        var a = Un;
        try {
          if (Xh(), Nx(), pn(), j0.current = null, a === null || a.return === null) {
            Sr = Hp, Vp = t, Un = null;
            return;
          }
          if (He && a.mode & Vt && wm(a, !0), Oe)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              wi(a, i, gr);
            } else
              ds(a, t, gr);
          yT(e, a.return, a, t, gr), cC(a);
        } catch (u) {
          t = u, Un === a && a !== null ? (a = a.return, Un = a) : a = Un;
          continue;
        }
        return;
      } while (!0);
    }
    function uC() {
      var e = M0.current;
      return M0.current = Em, e === null ? Em : e;
    }
    function oC(e) {
      M0.current = e;
    }
    function Gw() {
      A0 = qn();
    }
    function Gp(e) {
      jm = ht(e, jm);
    }
    function qw() {
      Sr === Iu && (Sr = Mm);
    }
    function $0() {
      (Sr === Iu || Sr === Mm || Sr === nc) && (Sr = Pp), xa !== null && (bs(jm) || bs(Bp)) && Yo(xa, gr);
    }
    function Kw(e) {
      Sr !== Pp && (Sr = nc), Ip === null ? Ip = [e] : Ip.push(e);
    }
    function Xw() {
      return Sr === Iu;
    }
    function Bm(e, t) {
      var a = Mt;
      Mt |= Yr;
      var i = uC();
      if (xa !== e || gr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (qp(e, gr), u.clear()), Gv(e, t);
        }
        Yu = Hd(), ac(e, t);
      }
      Eu(t);
      do
        try {
          Jw();
          break;
        } catch (s) {
          lC(e, s);
        }
      while (!0);
      if (Xh(), Mt = a, oC(i), Un !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Lc(), xa = null, gr = G, Sr;
    }
    function Jw() {
      for (; Un !== null; )
        sC(Un);
    }
    function Zw(e, t) {
      var a = Mt;
      Mt |= Yr;
      var i = uC();
      if (xa !== e || gr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (qp(e, gr), u.clear()), Gv(e, t);
        }
        Yu = Hd(), Yp(), ac(e, t);
      }
      Eu(t);
      do
        try {
          ek();
          break;
        } catch (s) {
          lC(e, s);
        }
      while (!0);
      return Xh(), oC(i), Mt = a, Un !== null ? (Hv(), Iu) : (Lc(), xa = null, gr = G, Sr);
    }
    function ek() {
      for (; Un !== null && !gd(); )
        sC(Un);
    }
    function sC(e) {
      var t = e.alternate;
      Xt(e);
      var a;
      (e.mode & Vt) !== Fe ? (qg(e), a = Q0(t, e, Xl), wm(e, !0)) : a = Q0(t, e, Xl), pn(), e.memoizedProps = e.pendingProps, a === null ? cC(e) : Un = a, j0.current = null;
    }
    function cC(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & ss) === Ae) {
          Xt(t);
          var u = void 0;
          if ((t.mode & Vt) === Fe ? u = ME(a, t, Xl) : (qg(t), u = ME(a, t, Xl), wm(t, !1)), pn(), u !== null) {
            Un = u;
            return;
          }
        } else {
          var s = qT(a, t);
          if (s !== null) {
            s.flags &= Mv, Un = s;
            return;
          }
          if ((t.mode & Vt) !== Fe) {
            wm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= ss, i.subtreeFlags = Ae, i.deletions = null;
          else {
            Sr = U0, Un = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          Un = v;
          return;
        }
        t = i, Un = t;
      } while (t !== null);
      Sr === Iu && (Sr = XE);
    }
    function ic(e, t, a) {
      var i = za(), u = Ir.transition;
      try {
        Ir.transition = null, Bn(Mr), tk(e, t, a, i);
      } finally {
        Ir.transition = u, Bn(i);
      }
      return null;
    }
    function tk(e, t, a, i) {
      do
        $u();
      while (Bo !== null);
      if (dk(), (Mt & (Yr | Ai)) !== yr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Rd(s), u === null)
        return Td(), null;
      if (s === G && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = G, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Ht;
      var f = ht(u.lanes, u.childLanes);
      Ad(e, f), e === xa && (xa = null, Un = null, gr = G), ((u.subtreeFlags & Gi) !== Ae || (u.flags & Gi) !== Ae) && (rc || (rc = !0, P0 = a, K0(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (_l | Dl | Nl | Gi)) !== Ae, v = (u.flags & (_l | Dl | Nl | Gi)) !== Ae;
      if (p || v) {
        var y = Ir.transition;
        Ir.transition = null;
        var g = za();
        Bn(Mr);
        var k = Mt;
        Mt |= Ai, j0.current = null, ew(e, u), tE(), vw(e, u, s), pR(e.containerInfo), e.current = u, ps(s), hw(u, e, s), vs(), Sd(), Mt = k, Bn(g), Ir.transition = y;
      } else
        e.current = u, tE();
      var T = rc;
      if (rc ? (rc = !1, Bo = e, Wp = s) : (If = 0, Fm = null), f = e.pendingLanes, f === G && (Bf = null), T || vC(e.current, !1), Ed(u.stateNode, i), Jr && e.memoizedUpdaters.clear(), jw(), Ba(e, qn()), t !== null)
        for (var U = e.onRecoverableError, F = 0; F < t.length; F++) {
          var I = t[F], me = I.stack, Ve = I.digest;
          U(I.value, {
            componentStack: me,
            digest: Ve
          });
        }
      if (zm) {
        zm = !1;
        var Ue = F0;
        throw F0 = null, Ue;
      }
      return ea(Wp, qe) && e.tag !== Lo && $u(), f = e.pendingLanes, ea(f, qe) ? (lT(), e === V0 ? $p++ : ($p = 0, V0 = e)) : $p = 0, Mo(), Td(), null;
    }
    function $u() {
      if (Bo !== null) {
        var e = Xv(Wp), t = Ds(ja, e), a = Ir.transition, i = za();
        try {
          return Ir.transition = null, Bn(t), rk();
        } finally {
          Bn(i), Ir.transition = a;
        }
      }
      return !1;
    }
    function nk(e) {
      H0.push(e), rc || (rc = !0, K0(qi, function() {
        return $u(), null;
      }));
    }
    function rk() {
      if (Bo === null)
        return !1;
      var e = P0;
      P0 = null;
      var t = Bo, a = Wp;
      if (Bo = null, Wp = G, (Mt & (Yr | Ai)) !== yr)
        throw new Error("Cannot flush passive effects while already rendering.");
      B0 = !0, Am = !1, xu(a);
      var i = Mt;
      Mt |= Ai, Cw(t.current), gw(t, t.current, a, e);
      {
        var u = H0;
        H0 = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          aw(t, f);
        }
      }
      _d(), vC(t.current, !0), Mt = i, Mo(), Am ? t === Fm ? If++ : (If = 0, Fm = t) : If = 0, B0 = !1, Am = !1, Cd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function fC(e) {
      return Bf !== null && Bf.has(e);
    }
    function ak(e) {
      Bf === null ? Bf = /* @__PURE__ */ new Set([e]) : Bf.add(e);
    }
    function ik(e) {
      zm || (zm = !0, F0 = e);
    }
    var lk = ik;
    function dC(e, t, a) {
      var i = ec(a, t), u = sE(e, i, qe), s = Uo(e, u, qe), f = Ea();
      s !== null && (xo(s, qe, f), Ba(s, f));
    }
    function vn(e, t, a) {
      if (XT(a), Kp(!1), e.tag === ae) {
        dC(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === ae) {
          dC(i, e, a);
          return;
        } else if (i.tag === de) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !fC(s)) {
            var f = ec(a, e), p = p0(i, f, qe), v = Uo(i, p, qe), y = Ea();
            v !== null && (xo(v, qe, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function uk(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ea();
      ef(e, a), mk(e), xa === e && Du(gr, a) && (Sr === Pp || Sr === Mm && _u(gr) && qn() - A0 < JE ? ac(e, G) : Um = ht(Um, a)), Ba(e, u);
    }
    function pC(e, t) {
      t === Ht && (t = Vw(e));
      var a = Ea(), i = Ha(e, t);
      i !== null && (xo(i, t, a), Ba(i, a));
    }
    function ok(e) {
      var t = e.memoizedState, a = Ht;
      t !== null && (a = t.retryLane), pC(e, a);
    }
    function sk(e, t) {
      var a = Ht, i;
      switch (e.tag) {
        case ie:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case zt:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), pC(e, a);
    }
    function ck(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : Aw(e / 1960) * 1960;
    }
    function fk() {
      if ($p > Hw)
        throw $p = 0, V0 = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      If > Pw && (If = 0, Fm = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function dk() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function vC(e, t) {
      Xt(e), Im(e, kl, Ow), t && Im(e, bi, Lw), Im(e, kl, Dw), t && Im(e, bi, Nw), pn();
    }
    function Im(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Ae ? i = i.child : ((i.flags & t) !== Ae && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Ym = null;
    function hC(e) {
      {
        if ((Mt & Yr) !== yr || !(e.mode & xt))
          return;
        var t = e.tag;
        if (t !== rt && t !== ae && t !== de && t !== re && t !== V && t !== Me && t !== se)
          return;
        var a = et(e) || "ReactComponent";
        if (Ym !== null) {
          if (Ym.has(a))
            return;
          Ym.add(a);
        } else
          Ym = /* @__PURE__ */ new Set([a]);
        var i = or;
        try {
          Xt(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Xt(e) : pn();
        }
      }
    }
    var Q0;
    {
      var pk = null;
      Q0 = function(e, t, a) {
        var i = bC(pk, t);
        try {
          return _E(e, t, a);
        } catch (s) {
          if (T1() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Xh(), Nx(), jE(e, t), bC(t, i), t.mode & Vt && qg(t), wl(null, _E, null, e, t, a), $i()) {
            var u = os();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var mC = !1, G0;
    G0 = /* @__PURE__ */ new Set();
    function vk(e) {
      if (mi && !rT())
        switch (e.tag) {
          case re:
          case V:
          case se: {
            var t = Un && et(Un) || "Unknown", a = t;
            if (!G0.has(a)) {
              G0.add(a);
              var i = et(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case de: {
            mC || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), mC = !0);
            break;
          }
        }
    }
    function qp(e, t) {
      if (Jr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ks(e, i, t);
        });
      }
    }
    var q0 = {};
    function K0(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), q0) : yd(e, t);
      }
    }
    function yC(e) {
      if (e !== q0)
        return Uv(e);
    }
    function gC() {
      return dl.current !== null;
    }
    function hk(e) {
      {
        if (e.mode & xt) {
          if (!qE())
            return;
        } else if (!zw() || Mt !== yr || e.tag !== re && e.tag !== V && e.tag !== se)
          return;
        if (dl.current === null) {
          var t = or;
          try {
            Xt(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, et(e));
          } finally {
            t ? Xt(e) : pn();
          }
        }
      }
    }
    function mk(e) {
      e.tag !== Lo && qE() && dl.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Kp(e) {
      tC = e;
    }
    var Fi = null, Yf = null, yk = function(e) {
      Fi = e;
    };
    function Wf(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function X0(e) {
      return Wf(e);
    }
    function J0(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Wf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: Q,
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
    function SC(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case de: {
            typeof i == "function" && (u = !0);
            break;
          }
          case re: {
            (typeof i == "function" || s === tt) && (u = !0);
            break;
          }
          case V: {
            (s === Q || s === tt) && (u = !0);
            break;
          }
          case Me:
          case se: {
            (s === ot || s === tt) && (u = !0);
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
    function xC(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Yf === null && (Yf = /* @__PURE__ */ new WeakSet()), Yf.add(e);
      }
    }
    var gk = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Wu(function() {
          Z0(e.current, i, a);
        });
      }
    }, Sk = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Wu(function() {
          Xp(t, e, null, null);
        });
      }
    };
    function Z0(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case re:
          case se:
          case de:
            v = p;
            break;
          case V:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, g = !1;
        if (v !== null) {
          var k = Fi(v);
          k !== void 0 && (a.has(k) ? g = !0 : t.has(k) && (f === de ? g = !0 : y = !0));
        }
        if (Yf !== null && (Yf.has(e) || i !== null && Yf.has(i)) && (g = !0), g && (e._debugNeedsRemount = !0), g || y) {
          var T = Ha(e, qe);
          T !== null && xr(T, e, qe, rn);
        }
        u !== null && !g && Z0(u, t, a), s !== null && Z0(s, t, a);
      }
    }
    var xk = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return eS(e.current, i, a), a;
      }
    };
    function eS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case re:
          case se:
          case de:
            p = f;
            break;
          case V:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? Ek(e, a) : i !== null && eS(i, t, a), u !== null && eS(u, t, a);
      }
    }
    function Ek(e, t) {
      {
        var a = Ck(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ne:
              t.add(i.stateNode);
              return;
            case be:
              t.add(i.stateNode.containerInfo);
              return;
            case ae:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function Ck(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ne)
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
    var tS;
    {
      tS = !1;
      try {
        var EC = Object.preventExtensions({});
      } catch {
        tS = !0;
      }
    }
    function bk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Ae, this.subtreeFlags = Ae, this.deletions = null, this.lanes = G, this.childLanes = G, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !tS && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new bk(e, t, a, i);
    };
    function nS(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Rk(e) {
      return typeof e == "function" && !nS(e) && e.defaultProps === void 0;
    }
    function Tk(e) {
      if (typeof e == "function")
        return nS(e) ? de : re;
      if (e != null) {
        var t = e.$$typeof;
        if (t === Q)
          return V;
        if (t === ot)
          return Me;
      }
      return rt;
    }
    function lc(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Ae, a.subtreeFlags = Ae, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Hn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case rt:
        case re:
        case se:
          a.type = Wf(e.type);
          break;
        case de:
          a.type = X0(e.type);
          break;
        case V:
          a.type = J0(e.type);
          break;
      }
      return a;
    }
    function wk(e, t) {
      e.flags &= Hn | xn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = G, e.lanes = t, e.child = null, e.subtreeFlags = Ae, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Ae, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function kk(e, t, a) {
      var i;
      return e === Vh ? (i = xt, t === !0 && (i |= en, i |= Bt)) : i = Fe, Jr && (i |= Vt), oi(ae, null, null, i);
    }
    function rS(e, t, a, i, u, s) {
      var f = rt, p = e;
      if (typeof e == "function")
        nS(e) ? (f = de, p = X0(p)) : p = Wf(p);
      else if (typeof e == "string")
        f = ne;
      else
        e: switch (e) {
          case di:
            return Wo(a.children, u, s, t);
          case Qa:
            f = ct, u |= en, (u & xt) !== Fe && (u |= Bt);
            break;
          case pi:
            return _k(a, u, s, t);
          case ve:
            return Dk(a, u, s, t);
          case Re:
            return Nk(a, u, s, t);
          case Dn:
            return CC(a, u, s, t);
          case un:
          // eslint-disable-next-line no-fallthrough
          case bt:
          // eslint-disable-next-line no-fallthrough
          case dn:
          // eslint-disable-next-line no-fallthrough
          case ur:
          // eslint-disable-next-line no-fallthrough
          case St:
          // eslint-disable-next-line no-fallthrough
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = lt;
                  break e;
                case b:
                  f = Ut;
                  break e;
                case Q:
                  f = V, p = J0(p);
                  break e;
                case ot:
                  f = Me;
                  break e;
                case tt:
                  f = Tt, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? et(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var g = oi(f, a, t, u);
      return g.elementType = e, g.type = p, g.lanes = s, g._debugOwner = i, g;
    }
    function aS(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = rS(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Wo(e, t, a, i) {
      var u = oi(at, e, i, t);
      return u.lanes = a, u;
    }
    function _k(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(_e, e, i, t | Vt);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function Dk(e, t, a, i) {
      var u = oi(ie, e, i, t);
      return u.elementType = ve, u.lanes = a, u;
    }
    function Nk(e, t, a, i) {
      var u = oi(zt, e, i, t);
      return u.elementType = Re, u.lanes = a, u;
    }
    function CC(e, t, a, i) {
      var u = oi(De, e, i, t);
      u.elementType = Dn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function iS(e, t, a) {
      var i = oi(Qe, e, null, t);
      return i.lanes = a, i;
    }
    function Ok() {
      var e = oi(ne, null, null, Fe);
      return e.elementType = "DELETED", e;
    }
    function Lk(e) {
      var t = oi(ft, null, null, Fe);
      return t.stateNode = e, t;
    }
    function lS(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(be, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function bC(e, t) {
      return e === null && (e = oi(rt, null, null, Fe)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Mk(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Vy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Ht, this.eventTimes = ws(G), this.expirationTimes = ws(rn), this.pendingLanes = G, this.suspendedLanes = G, this.pingedLanes = G, this.expiredLanes = G, this.mutableReadLanes = G, this.finishedLanes = G, this.entangledLanes = G, this.entanglements = ws(G), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Vh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function RC(e, t, a, i, u, s, f, p, v, y) {
      var g = new Mk(e, t, a, p, v), k = kk(t, s);
      g.current = k, k.stateNode = g;
      {
        var T = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        k.memoizedState = T;
      }
      return Sg(k), g;
    }
    var uS = "18.3.1";
    function jk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Jn(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: lr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var oS, sS;
    oS = !1, sS = {};
    function TC(e) {
      if (!e)
        return ui;
      var t = vo(e), a = m1(t);
      if (t.tag === de) {
        var i = t.type;
        if (Yl(i))
          return JS(t, i, a);
      }
      return a;
    }
    function Uk(e, t) {
      {
        var a = vo(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Kr(a);
        if (u === null)
          return null;
        if (u.mode & en) {
          var s = et(a) || "Component";
          if (!sS[s]) {
            sS[s] = !0;
            var f = or;
            try {
              Xt(u), a.mode & en ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Xt(f) : pn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function wC(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return RC(e, t, v, y, a, i, u, s, f);
    }
    function kC(e, t, a, i, u, s, f, p, v, y) {
      var g = !0, k = RC(a, i, g, e, u, s, f, p, v);
      k.context = TC(null);
      var T = k.current, U = Ea(), F = Io(T), I = Vu(U, F);
      return I.callback = t ?? null, Uo(T, I, F), Bw(k, F, U), k;
    }
    function Xp(e, t, a, i) {
      xd(t, e);
      var u = t.current, s = Ea(), f = Io(u);
      Cn(f);
      var p = TC(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && or !== null && !oS && (oS = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, et(or) || "Unknown"));
      var v = Vu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Uo(u, v, f);
      return y !== null && (xr(y, u, f, s), nm(y, u, f)), f;
    }
    function Wm(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ne:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function zk(e) {
      switch (e.tag) {
        case ae: {
          var t = e.stateNode;
          if (nf(t)) {
            var a = Vv(t);
            $w(t, a);
          }
          break;
        }
        case ie: {
          Wu(function() {
            var u = Ha(e, qe);
            if (u !== null) {
              var s = Ea();
              xr(u, e, qe, s);
            }
          });
          var i = qe;
          cS(e, i);
          break;
        }
      }
    }
    function _C(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = $v(a.retryLane, t));
    }
    function cS(e, t) {
      _C(e, t);
      var a = e.alternate;
      a && _C(a, t);
    }
    function Ak(e) {
      if (e.tag === ie) {
        var t = xs, a = Ha(e, t);
        if (a !== null) {
          var i = Ea();
          xr(a, e, t, i);
        }
        cS(e, t);
      }
    }
    function Fk(e) {
      if (e.tag === ie) {
        var t = Io(e), a = Ha(e, t);
        if (a !== null) {
          var i = Ea();
          xr(a, e, t, i);
        }
        cS(e, t);
      }
    }
    function DC(e) {
      var t = hn(e);
      return t === null ? null : t.stateNode;
    }
    var NC = function(e) {
      return null;
    };
    function Hk(e) {
      return NC(e);
    }
    var OC = function(e) {
      return !1;
    };
    function Pk(e) {
      return OC(e);
    }
    var LC = null, MC = null, jC = null, UC = null, zC = null, AC = null, FC = null, HC = null, PC = null;
    {
      var VC = function(e, t, a) {
        var i = t[a], u = gt(e) ? e.slice() : mt({}, e);
        return a + 1 === t.length ? (gt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = VC(e[i], t, a + 1), u);
      }, BC = function(e, t) {
        return VC(e, t, 0);
      }, IC = function(e, t, a, i) {
        var u = t[i], s = gt(e) ? e.slice() : mt({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], gt(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = IC(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, YC = function(e, t, a) {
        if (t.length !== a.length) {
          Ye("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              Ye("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return IC(e, t, a, 0);
      }, WC = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = gt(e) ? e.slice() : mt({}, e);
        return s[u] = WC(e[u], t, a + 1, i), s;
      }, $C = function(e, t, a) {
        return WC(e, t, 0, a);
      }, fS = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      LC = function(e, t, a, i) {
        var u = fS(e, t);
        if (u !== null) {
          var s = $C(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = mt({}, e.memoizedProps);
          var f = Ha(e, qe);
          f !== null && xr(f, e, qe, rn);
        }
      }, MC = function(e, t, a) {
        var i = fS(e, t);
        if (i !== null) {
          var u = BC(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = mt({}, e.memoizedProps);
          var s = Ha(e, qe);
          s !== null && xr(s, e, qe, rn);
        }
      }, jC = function(e, t, a, i) {
        var u = fS(e, t);
        if (u !== null) {
          var s = YC(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = mt({}, e.memoizedProps);
          var f = Ha(e, qe);
          f !== null && xr(f, e, qe, rn);
        }
      }, UC = function(e, t, a) {
        e.pendingProps = $C(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, qe);
        i !== null && xr(i, e, qe, rn);
      }, zC = function(e, t) {
        e.pendingProps = BC(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ha(e, qe);
        a !== null && xr(a, e, qe, rn);
      }, AC = function(e, t, a) {
        e.pendingProps = YC(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, qe);
        i !== null && xr(i, e, qe, rn);
      }, FC = function(e) {
        var t = Ha(e, qe);
        t !== null && xr(t, e, qe, rn);
      }, HC = function(e) {
        NC = e;
      }, PC = function(e) {
        OC = e;
      };
    }
    function Vk(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function Bk(e) {
      return null;
    }
    function Ik() {
      return or;
    }
    function Yk(e) {
      var t = e.findFiberByHostInstance, a = j.ReactCurrentDispatcher;
      return yo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: LC,
        overrideHookStateDeletePath: MC,
        overrideHookStateRenamePath: jC,
        overrideProps: UC,
        overridePropsDeletePath: zC,
        overridePropsRenamePath: AC,
        setErrorHandler: HC,
        setSuspenseHandler: PC,
        scheduleUpdate: FC,
        currentDispatcherRef: a,
        findHostInstanceByFiber: Vk,
        findFiberByHostInstance: t || Bk,
        // React Refresh
        findHostInstancesForRefresh: xk,
        scheduleRefresh: gk,
        scheduleRoot: Sk,
        setRefreshHandler: yk,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: Ik,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: uS
      });
    }
    var QC = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function dS(e) {
      this._internalRoot = e;
    }
    $m.prototype.render = dS.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Qm(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== An) {
          var i = DC(t.current);
          i && i.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Xp(e, t, null, null);
    }, $m.prototype.unmount = dS.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        iC() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Wu(function() {
          Xp(null, e, null, null);
        }), QS(t);
      }
    };
    function Wk(e, t) {
      if (!Qm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      GC(e);
      var a = !1, i = !1, u = "", s = QC;
      t != null && (t.hydrate ? Ye("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Dr && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = wC(e, Vh, null, a, i, u, s);
      jh(f.current, e);
      var p = e.nodeType === An ? e.parentNode : e;
      return rp(p), new dS(f);
    }
    function $m(e) {
      this._internalRoot = e;
    }
    function $k(e) {
      e && nh(e);
    }
    $m.prototype.unstable_scheduleHydration = $k;
    function Qk(e, t, a) {
      if (!Qm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      GC(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = QC;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = kC(t, null, e, Vh, i, s, f, p, v);
      if (jh(y.current, e), rp(e), u)
        for (var g = 0; g < u.length; g++) {
          var k = u[g];
          X1(y, k);
        }
      return new $m(y);
    }
    function Qm(e) {
      return !!(e && (e.nodeType === Qr || e.nodeType === Wi || e.nodeType === id));
    }
    function Jp(e) {
      return !!(e && (e.nodeType === Qr || e.nodeType === Wi || e.nodeType === id || e.nodeType === An && e.nodeValue === " react-mount-point-unstable "));
    }
    function GC(e) {
      e.nodeType === Qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), vp(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var Gk = j.ReactCurrentOwner, qC;
    qC = function(e) {
      if (e._reactRootContainer && e.nodeType !== An) {
        var t = DC(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = pS(e), u = !!(i && No(i));
      u && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function pS(e) {
      return e ? e.nodeType === Wi ? e.documentElement : e.firstChild : null;
    }
    function KC() {
    }
    function qk(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var T = Wm(f);
            s.call(T);
          };
        }
        var f = kC(
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
          KC
        );
        e._reactRootContainer = f, jh(f.current, e);
        var p = e.nodeType === An ? e.parentNode : e;
        return rp(p), Wu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var T = Wm(g);
            y.call(T);
          };
        }
        var g = wC(
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
          KC
        );
        e._reactRootContainer = g, jh(g.current, e);
        var k = e.nodeType === An ? e.parentNode : e;
        return rp(k), Wu(function() {
          Xp(t, g, a, i);
        }), g;
      }
    }
    function Kk(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Gm(e, t, a, i, u) {
      qC(a), Kk(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = qk(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Wm(f);
            p.call(v);
          };
        }
        Xp(t, f, e, u);
      }
      return Wm(f);
    }
    var XC = !1;
    function Xk(e) {
      {
        XC || (XC = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = Gk.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", At(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Qr ? e : Uk(e, "findDOMNode");
    }
    function Jk(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = vp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Gm(null, e, t, !0, a);
    }
    function Zk(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = vp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Gm(null, e, t, !1, a);
    }
    function e_(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !cy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Gm(e, t, a, !1, i);
    }
    var JC = !1;
    function t_(e) {
      if (JC || (JC = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Jp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = vp(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = pS(e), i = a && !No(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Wu(function() {
          Gm(null, null, e, !1, function() {
            e._reactRootContainer = null, QS(e);
          });
        }), !0;
      } else {
        {
          var u = pS(e), s = !!(u && No(u)), f = e.nodeType === Qr && Jp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    wr(zk), Eo(Ak), Jv(Fk), Os(za), Pd(qv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Sc(rR), sy(Y0, Qw, Wu);
    function n_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Qm(t))
        throw new Error("Target container is not a DOM element.");
      return jk(e, t, null, a);
    }
    function r_(e, t, a, i) {
      return e_(e, t, a, i);
    }
    var vS = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [No, Cf, Uh, so, xc, Y0]
    };
    function a_(e, t) {
      return vS.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), Wk(e, t);
    }
    function i_(e, t, a) {
      return vS.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), Qk(e, t, a);
    }
    function l_(e) {
      return iC() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Wu(e);
    }
    var u_ = Yk({
      findFiberByHostInstance: Ws,
      bundleType: 1,
      version: uS,
      rendererPackageName: "react-dom"
    });
    if (!u_ && Ge && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var ZC = window.location.protocol;
      /^(https?|file):$/.test(ZC) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (ZC === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = vS, Ya.createPortal = n_, Ya.createRoot = a_, Ya.findDOMNode = Xk, Ya.flushSync = l_, Ya.hydrate = Jk, Ya.hydrateRoot = i_, Ya.render = Zk, Ya.unmountComponentAtNode = t_, Ya.unstable_batchedUpdates = Y0, Ya.unstable_renderSubtreeIntoContainer = r_, Ya.version = uS, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  })()), Ya;
}
var fb;
function S_() {
  if (fb) return Xm.exports;
  fb = 1;
  function P() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(P);
      } catch (H) {
        console.error(H);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (P(), Xm.exports = y_()) : Xm.exports = g_(), Xm.exports;
}
var db;
function x_() {
  if (db) return Qf;
  db = 1;
  var P = S_();
  if (process.env.NODE_ENV === "production")
    Qf.createRoot = P.createRoot, Qf.hydrateRoot = P.hydrateRoot;
  else {
    var H = P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    Qf.createRoot = function(j, ye) {
      H.usingClientEntryPoint = !0;
      try {
        return P.createRoot(j, ye);
      } finally {
        H.usingClientEntryPoint = !1;
      }
    }, Qf.hydrateRoot = function(j, ye, Je) {
      H.usingClientEntryPoint = !0;
      try {
        return P.hydrateRoot(j, ye, Je);
      } finally {
        H.usingClientEntryPoint = !1;
      }
    };
  }
  return Qf;
}
var xb = x_(), Et = rv();
function E_(P, H = !1) {
  return window.__TAURI_INTERNALS__.transformCallback(P, H);
}
async function Eb(P, H = {}, j) {
  return window.__TAURI_INTERNALS__.invoke(P, H, j);
}
var pb;
(function(P) {
  P.WINDOW_RESIZED = "tauri://resize", P.WINDOW_MOVED = "tauri://move", P.WINDOW_CLOSE_REQUESTED = "tauri://close-requested", P.WINDOW_DESTROYED = "tauri://destroyed", P.WINDOW_FOCUS = "tauri://focus", P.WINDOW_BLUR = "tauri://blur", P.WINDOW_SCALE_FACTOR_CHANGED = "tauri://scale-change", P.WINDOW_THEME_CHANGED = "tauri://theme-changed", P.WINDOW_CREATED = "tauri://window-created", P.WINDOW_SUSPENDED = "tauri://suspended", P.WINDOW_RESUMED = "tauri://resumed", P.WEBVIEW_CREATED = "tauri://webview-created", P.DRAG_ENTER = "tauri://drag-enter", P.DRAG_OVER = "tauri://drag-over", P.DRAG_DROP = "tauri://drag-drop", P.DRAG_LEAVE = "tauri://drag-leave";
})(pb || (pb = {}));
async function C_(P, H) {
  window.__TAURI_EVENT_PLUGIN_INTERNALS__.unregisterListener(P, H), await Eb("plugin:event|unlisten", {
    event: P,
    eventId: H
  });
}
async function b_(P, H, j) {
  var ye;
  const Je = (ye = void 0) !== null && ye !== void 0 ? ye : { kind: "Any" };
  return Eb("plugin:event|listen", {
    event: P,
    target: Je,
    handler: E_(H)
  }).then((Ye) => async () => C_(P, Ye));
}
let SS = null;
function R_(P) {
  SS = P;
}
function Zl(P, H) {
  if (!SS) throw new Error("Proxy host is not configured");
  return SS.moduleCall(`clx.cli-proxy.${P}`, H);
}
const T_ = () => Zl("status", {}), w_ = () => Zl("start", {}), k_ = () => Zl("stop", {}), __ = () => Zl("getConfig", {}), Gf = (P) => Zl("saveConfig", { config: P }), vb = (P) => Zl("addBackend", { backend: P }), D_ = (P) => Zl("removeBackend", { name: P }), yS = () => Zl("getLogs", {}), hb = (P) => Zl("getUsage", { id: P }), N_ = (P) => Zl("resetUsage", { id: P }), gS = 10;
function O_(P) {
  var H;
  return typeof navigator > "u" || !((H = navigator.clipboard) != null && H.writeText) ? Promise.resolve(!1) : navigator.clipboard.writeText(P).then(() => !0).catch(() => !1);
}
function mb() {
  return /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "h-4 w-4", children: /* @__PURE__ */ E.jsx("path", { d: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" }) });
}
function yb() {
  return /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "h-4 w-4", children: /* @__PURE__ */ E.jsx("path", { d: "M4.5 4.5h15v15h-15z" }) });
}
function L_() {
  return /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", className: "h-4 w-4", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) });
}
function M_() {
  return /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" }) });
}
function gb() {
  return /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" }) });
}
function Cb({ isInSidebar: P }) {
  const [H, j] = Et.useState(null), [ye, Je] = Et.useState(null), [Ye, S] = Et.useState([]), [Nt, re] = Et.useState(null), [de, rt] = Et.useState("config"), [ae, be] = Et.useState(!1), [ne, Qe] = Et.useState(null), [at, ct] = Et.useState(""), [Ut, lt] = Et.useState(""), [V, _e] = Et.useState(""), [ie, Me] = Et.useState(""), [se, Tt] = Et.useState(""), [Ct, ft] = Et.useState(!1), [zt, Be] = Et.useState(!1), [De, kt] = Et.useState(""), [Ze, wt] = Et.useState({}), [le, ee] = Et.useState(null), Ne = Et.useCallback(async () => {
    if (!ye) return;
    const M = {};
    for (const pe of ye.backends)
      if (pe.id)
        try {
          M[pe.id] = await hb(pe.id);
        } catch {
        }
    wt(M);
  }, [ye]);
  Et.useEffect(() => {
    Ne();
  }, [ye, Ne]), Et.useEffect(() => {
    let M;
    return b_("proxy-usage-updated", async (pe) => {
      const Ge = pe.payload;
      try {
        const yn = await hb(Ge);
        wt((cn) => ({ ...cn, [Ge]: yn }));
      } catch {
      }
    }).then((pe) => {
      M = pe;
    }), () => {
      M && M();
    };
  }, []), Et.useEffect(() => {
    const M = (pe) => {
      const Ge = pe.detail;
      (Ge === "logs" || Ge === "config") && rt(Ge);
    };
    return window.addEventListener("proxy-select-subtab", M), () => window.removeEventListener("proxy-select-subtab", M);
  }, []);
  const oe = Et.useCallback(async (M) => {
    try {
      await N_(M), ee(null);
    } catch (pe) {
      re(String(pe));
    }
  }, []), _ = () => {
    ct(""), lt(""), _e(""), Me(""), Tt(""), kt(""), ft(!1), Be(!1), be(!1), Qe(null);
  }, W = (M, pe) => {
    ct(M.name), lt(M.url), _e(M.apiKey), Me(M.model), Tt(M.customUserAgent || ""), kt(M.reasoningEffort || ""), ft(M.enableRtk || !1), Be(M.enablePonytail || !1), be(!1), Qe(pe);
  }, Oe = Et.useCallback(async () => {
    const M = [];
    try {
      j(await T_());
    } catch (pe) {
      M.push("status: " + String(pe));
    }
    try {
      Je(await __());
    } catch (pe) {
      M.push("config: " + String(pe));
    }
    try {
      S(await yS());
    } catch (pe) {
      M.push("logs: " + String(pe));
    }
    re(M.length ? M.join(" | ") : null);
  }, []);
  Et.useEffect(() => {
    Oe();
  }, [Oe]), Et.useEffect(() => {
    if (P) {
      const pe = setInterval(async () => {
        try {
          S(await yS());
        } catch {
        }
      }, 3e3);
      return () => clearInterval(pe);
    }
    if (de !== "logs") return;
    const M = setInterval(async () => {
      try {
        S(await yS());
      } catch {
      }
    }, 2e3);
    return () => clearInterval(M);
  }, [de, P]);
  const He = Et.useCallback(async () => {
    try {
      H != null && H.running ? await k_() : await w_(), await Oe();
    } catch (M) {
      re(String(M));
    }
  }, [H, Oe]), dt = Et.useCallback(async (M) => {
    if (ye)
      try {
        Je(await Gf({ ...ye, port: M }));
      } catch (pe) {
        re(String(pe));
      }
  }, [ye]), pt = Et.useCallback(async () => {
    if (!(!at || !Ut || !V || !ie))
      try {
        if (ne !== null && ye) {
          const M = [...ye.backends];
          M[ne] = {
            ...M[ne],
            name: at,
            url: Ut,
            apiKey: V,
            model: ie,
            customUserAgent: se || void 0,
            enableRtk: Ct,
            enablePonytail: zt,
            reasoningEffort: De || void 0
          }, await Gf({ ...ye, backends: M });
        } else
          await vb({
            name: at,
            url: Ut,
            apiKey: V,
            model: ie,
            weight: 1,
            maxRetries: 2,
            headers: {},
            customUserAgent: se || void 0,
            enableRtk: Ct,
            enablePonytail: zt,
            reasoningEffort: De || void 0
          });
        _(), await Oe();
      } catch (M) {
        re(String(M));
      }
  }, [at, Ut, V, ie, se, Ct, zt, De, ne, ye, Oe]), ut = Et.useCallback(async (M) => {
    if (ye)
      try {
        const pe = `${M.name} (Copy)`, Ge = {
          ...M,
          id: void 0,
          name: pe
        };
        await vb(Ge), await Oe();
      } catch (pe) {
        re(String(pe));
      }
  }, [ye, Oe]), vt = Et.useCallback(async (M) => {
    try {
      await D_(M), await Oe();
    } catch (pe) {
      re(String(pe));
    }
  }, [Oe]);
  return ye ? P ? /* @__PURE__ */ E.jsxs("div", { className: "h-full flex flex-col p-4 space-y-4 overflow-y-auto", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "border-b border-cyber-line pb-2", children: [
      /* @__PURE__ */ E.jsx("h2", { className: "font-display text-sm uppercase tracking-widest text-cyber-neon font-bold", children: "CliProxyAI" }),
      /* @__PURE__ */ E.jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: "API proxy configurations" })
    ] }),
    /* @__PURE__ */ E.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-cyber-line bg-cyber-base/40 p-3 text-xs", children: [
      /* @__PURE__ */ E.jsxs("div", { children: [
        /* @__PURE__ */ E.jsx("span", { className: "font-semibold text-slate-200 block", children: "Status" }),
        H && /* @__PURE__ */ E.jsx("span", { className: `text-[10px] uppercase font-mono font-bold ${H.running ? "text-green-400" : "text-slate-400"}`, children: H.running ? "Running" : "Stopped" })
      ] }),
      /* @__PURE__ */ E.jsxs(
        "button",
        {
          onClick: He,
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition ${H != null && H.running ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30" : "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 hover:bg-cyber-neon/30"}`,
          children: [
            H != null && H.running ? /* @__PURE__ */ E.jsx(yb, {}) : /* @__PURE__ */ E.jsx(mb, {}),
            H != null && H.running ? "Stop" : "Start"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ E.jsxs("div", { className: "space-y-3 rounded-lg border border-cyber-line bg-cyber-base/40 p-3 text-xs", children: [
      /* @__PURE__ */ E.jsx("h3", { className: "text-[10px] uppercase font-bold tracking-wider text-slate-400", children: "Server Settings" }),
      /* @__PURE__ */ E.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ E.jsxs("label", { className: "block space-y-1", children: [
        /* @__PURE__ */ E.jsx("span", { className: "text-[9px] uppercase tracking-wider text-slate-500", children: "Port" }),
        /* @__PURE__ */ E.jsx(
          "input",
          {
            type: "number",
            value: ye.port,
            onChange: (M) => dt(Number(M.target.value)),
            className: "w-full bg-cyber-base border border-cyber-line rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyber-neon outline-none",
            min: 1024,
            max: 65535
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ E.jsxs("div", { className: "flex-1 flex flex-col min-h-[220px] border border-cyber-line/50 rounded-lg p-3 bg-cyber-base/20 overflow-hidden", children: [
      /* @__PURE__ */ E.jsxs("div", { className: "flex justify-between items-center border-b border-cyber-line/30 pb-2 mb-2", children: [
        /* @__PURE__ */ E.jsx("h3", { className: "text-[10px] uppercase font-bold tracking-wider text-slate-400", children: "Request Logs" }),
        /* @__PURE__ */ E.jsx("button", { onClick: Oe, className: "text-slate-500 hover:text-slate-300", children: /* @__PURE__ */ E.jsx(gb, {}) })
      ] }),
      /* @__PURE__ */ E.jsx("div", { className: "flex-1 overflow-y-auto space-y-1.5 scrollbar-thin text-[10px] font-mono leading-tight", children: Ye.length === 0 ? /* @__PURE__ */ E.jsx("div", { className: "text-slate-500 italic text-center py-4", children: "No requests yet." }) : Ye.slice().reverse().map((M) => /* @__PURE__ */ E.jsxs("div", { className: "flex justify-between items-start gap-1 p-1 rounded hover:bg-cyber-line/10", children: [
        /* @__PURE__ */ E.jsx("span", { className: "text-slate-500 shrink-0", children: M.timestamp.split(" ")[1] || M.timestamp }),
        /* @__PURE__ */ E.jsx("span", { className: "text-slate-300 truncate max-w-[80px]", children: M.backend }),
        /* @__PURE__ */ E.jsx("span", { className: M.success ? "text-green-400" : "text-red-400", children: M.status || "ERR" }),
        /* @__PURE__ */ E.jsxs("span", { className: "text-slate-500 text-[9px]", children: [
          M.durationMs,
          "ms"
        ] })
      ] }, M.id)) })
    ] })
  ] }) : /* @__PURE__ */ E.jsxs("div", { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "flex items-center justify-between p-6 pb-4", children: [
      /* @__PURE__ */ E.jsxs("div", { children: [
        /* @__PURE__ */ E.jsx("h2", { className: "font-display text-lg uppercase tracking-widest text-cyber-neon", children: "CliProxyAI Backend Configuration" }),
        /* @__PURE__ */ E.jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Manage upstream AI backend servers and monitor logs" })
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "flex items-center gap-3", children: [
        H && /* @__PURE__ */ E.jsx("span", { className: "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider " + (H.running ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"), children: H.running ? "Running" : "Stopped" }),
        /* @__PURE__ */ E.jsx("button", { onClick: He, className: "flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider transition " + (H != null && H.running ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30" : "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 hover:bg-cyber-neon/30"), children: H != null && H.running ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
          /* @__PURE__ */ E.jsx(yb, {}),
          "Stop"
        ] }) : /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
          /* @__PURE__ */ E.jsx(mb, {}),
          "Start"
        ] }) })
      ] })
    ] }),
    (H == null ? void 0 : H.running) && /* @__PURE__ */ E.jsxs("div", { className: "flex gap-4 text-xs text-slate-400 bg-cyber-line/20 border-y border-cyber-line/30 px-6 py-2", children: [
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Port: ",
        /* @__PURE__ */ E.jsx("b", { className: "text-cyber-electric", children: H.port })
      ] }),
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Active Backends: ",
        /* @__PURE__ */ E.jsx("b", { className: "text-cyber-electric", children: H.activeBackends })
      ] }),
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Total Requests: ",
        /* @__PURE__ */ E.jsx("b", { className: "text-cyber-electric", children: H.totalRequests })
      ] })
    ] }),
    Nt && /* @__PURE__ */ E.jsxs("div", { className: "mx-6 mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400", children: [
      Nt,
      /* @__PURE__ */ E.jsx("button", { onClick: () => re(null), className: "ml-2 underline text-xs", children: "Dismiss" })
    ] }),
    /* @__PURE__ */ E.jsxs("div", { className: "flex gap-1 px-6 pt-4 border-b border-cyber-line", children: [
      ["config", "logs"].map((M) => /* @__PURE__ */ E.jsxs("button", { onClick: () => rt(M), className: "px-4 py-2 text-xs font-semibold uppercase tracking-wider transition border-b-2 -mb-[1px] " + (de === M ? "text-cyber-neon border-cyber-neon" : "text-slate-500 border-transparent hover:text-slate-300"), children: [
        M === "config" ? "Backend Configurations" : "Detailed Logs & Inspector",
        M === "logs" && Ye.length > 0 && /* @__PURE__ */ E.jsx("span", { className: "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-cyber-line/40 text-slate-400", children: Ye.length })
      ] }, M)),
      /* @__PURE__ */ E.jsx("div", { className: "flex-1" }),
      /* @__PURE__ */ E.jsx("button", { onClick: Oe, className: "px-3 py-2 text-slate-500 hover:text-slate-300 transition", children: /* @__PURE__ */ E.jsx(gb, {}) })
    ] }),
    /* @__PURE__ */ E.jsx("div", { className: "flex-1 overflow-y-auto", children: de === "config" ? /* @__PURE__ */ E.jsx("div", { className: "p-6 space-y-6", children: /* @__PURE__ */ E.jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
      /* @__PURE__ */ E.jsxs("div", { className: "col-span-2 space-y-4", children: [
        /* @__PURE__ */ E.jsxs("div", { className: "flex items-center justify-between border-b border-cyber-line pb-2", children: [
          /* @__PURE__ */ E.jsxs("h3", { className: "font-display text-sm uppercase tracking-widest text-slate-300", children: [
            "Upstream Backend Servers (",
            ye.backends.length,
            ")"
          ] }),
          /* @__PURE__ */ E.jsxs("button", { onClick: () => {
            _(), be(!0);
          }, className: "flex items-center gap-1 text-xs text-cyber-neon hover:text-cyber-electric transition uppercase tracking-wider", children: [
            /* @__PURE__ */ E.jsx(L_, {}),
            "Add Backend"
          ] })
        ] }),
        (ae || ne !== null) && /* @__PURE__ */ E.jsxs("div", { className: "bg-cyber-line/10 border border-cyber-neon/30 rounded-lg p-4 space-y-3", children: [
          /* @__PURE__ */ E.jsx("h4", { className: "text-xs uppercase tracking-widest text-cyber-neon", children: ne !== null ? "Edit Upstream Server" : "New Upstream Server" }),
          /* @__PURE__ */ E.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ E.jsx("input", { value: at, onChange: (M) => ct(M.target.value), placeholder: "Name (e.g. OpenAI)", className: "bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none" }),
            /* @__PURE__ */ E.jsx("input", { value: Ut, onChange: (M) => lt(M.target.value), placeholder: "Endpoint URL (e.g. https://api.openai.com/v1)", className: "bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none" }),
            /* @__PURE__ */ E.jsx("input", { value: V, onChange: (M) => _e(M.target.value), placeholder: "API Key", type: "password", className: "bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none" }),
            /* @__PURE__ */ E.jsx("input", { value: ie, onChange: (M) => Me(M.target.value), placeholder: "Model identifier (e.g. gpt-4o)", className: "bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none" }),
            /* @__PURE__ */ E.jsx("input", { value: se, onChange: (M) => Tt(M.target.value), placeholder: "User-Agent (optional, e.g. CliProxyAI/1.0)", className: "bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none" }),
            /* @__PURE__ */ E.jsxs(
              "select",
              {
                value: De,
                onChange: (M) => kt(M.target.value),
                className: "bg-cyber-base border border-cyber-line rounded px-3 py-2 text-sm text-slate-200 focus:border-cyber-neon outline-none",
                children: [
                  /* @__PURE__ */ E.jsx("option", { value: "", children: "Reasoning Effort: Default (None)" }),
                  /* @__PURE__ */ E.jsx("option", { value: "low", children: "Reasoning Effort: low" }),
                  /* @__PURE__ */ E.jsx("option", { value: "medium", children: "Reasoning Effort: medium" }),
                  /* @__PURE__ */ E.jsx("option", { value: "high", children: "Reasoning Effort: high" }),
                  /* @__PURE__ */ E.jsx("option", { value: "xhigh", children: "Reasoning Effort: xhigh" }),
                  /* @__PURE__ */ E.jsx("option", { value: "max", children: "Reasoning Effort: max" })
                ]
              }
            ),
            /* @__PURE__ */ E.jsxs("label", { className: "col-span-2 flex items-center gap-2 cursor-pointer pt-1", children: [
              /* @__PURE__ */ E.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: Ct,
                  onChange: (M) => ft(M.target.checked),
                  className: "rounded border-cyber-line bg-cyber-base text-cyber-neon focus:ring-cyber-neon accent-cyber-neon"
                }
              ),
              /* @__PURE__ */ E.jsxs("span", { className: "text-xs text-slate-200 font-medium flex items-center gap-1", children: [
                "⚡ ",
                /* @__PURE__ */ E.jsx("span", { className: "text-cyber-electric font-semibold", children: "Enable RTK Token Compression" }),
                /* @__PURE__ */ E.jsx("span", { className: "text-[10px] text-slate-400 font-normal", children: "(Cắt 60–90% token output command)" })
              ] })
            ] }),
            /* @__PURE__ */ E.jsxs("label", { className: "col-span-2 flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ E.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: zt,
                  onChange: (M) => Be(M.target.checked),
                  className: "rounded border-cyber-line bg-cyber-base text-cyber-neon focus:ring-cyber-neon accent-cyber-neon"
                }
              ),
              /* @__PURE__ */ E.jsxs("span", { className: "text-xs text-slate-200 font-medium flex items-center gap-1", children: [
                "👱‍♂️ ",
                /* @__PURE__ */ E.jsx("span", { className: "text-purple-300 font-semibold", children: "Enable Ponytail Anti-Bloat" }),
                /* @__PURE__ */ E.jsx("span", { className: "text-[10px] text-slate-400 font-normal", children: "(Lazy Senior Dev System Prompt Injector)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ E.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ E.jsx("button", { onClick: _, className: "px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase tracking-wider", children: "Cancel" }),
            /* @__PURE__ */ E.jsx("button", { onClick: pt, disabled: !at || !Ut || !V || !ie, className: "px-3 py-1.5 text-xs bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/30 rounded hover:bg-cyber-neon/30 uppercase tracking-wider disabled:opacity-40", children: ne !== null ? "Update" : "Save Backend" })
          ] })
        ] }),
        ye.backends.length === 0 ? /* @__PURE__ */ E.jsx("div", { className: "text-center py-8 text-slate-500 text-sm", children: "No backend servers configured. Requests will return error." }) : ye.backends.map((M, pe) => /* @__PURE__ */ E.jsxs(
          "div",
          {
            draggable: !0,
            onDragStart: (Ge) => {
              Ge.dataTransfer.setData("text/plain", M.name);
            },
            onDragOver: (Ge) => Ge.preventDefault(),
            onDrop: async (Ge) => {
              Ge.preventDefault();
              const yn = Ge.dataTransfer.getData("text/plain");
              if (yn !== M.name) {
                const cn = ye.backends.findIndex((Jn) => Jn.name === yn), Rn = [...ye.backends], [wn] = Rn.splice(cn, 1), kn = Rn.findIndex((Jn) => Jn.name === M.name);
                Rn.splice(kn, 0, wn);
                try {
                  Je(await Gf({ ...ye, backends: Rn }));
                } catch {
                }
              }
            },
            className: "flex items-center gap-3 bg-cyber-line/10 border border-cyber-line/30 rounded-lg px-4 py-3 group hover:border-cyber-line/60 cursor-grab active:cursor-grabbing",
            children: [
              /* @__PURE__ */ E.jsx("span", { className: "text-[10px] text-slate-600 font-mono w-5", children: pe + 1 }),
              /* @__PURE__ */ E.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ E.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ E.jsx("div", { className: "text-sm text-slate-200 font-semibold truncate", children: M.name }),
                  M.enableRtk && /* @__PURE__ */ E.jsx("span", { className: "px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5", title: "RTK Token Compression Enabled", children: "⚡ RTK" }),
                  M.enablePonytail && /* @__PURE__ */ E.jsx("span", { className: "px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5", title: "Ponytail Anti-Bloat Enabled", children: "👱‍♂️ Ponytail" }),
                  M.reasoningEffort && /* @__PURE__ */ E.jsxs("span", { className: "px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-0.5", title: `Reasoning Effort: ${M.reasoningEffort}`, children: [
                    "🧠 ",
                    M.reasoningEffort
                  ] })
                ] }),
                /* @__PURE__ */ E.jsxs("div", { className: "text-xs text-slate-500 truncate", children: [
                  M.model,
                  " @ ",
                  M.url
                ] }),
                M.customUserAgent && /* @__PURE__ */ E.jsxs("div", { className: "text-[10px] text-cyber-neon/60 truncate", children: [
                  "UA: ",
                  M.customUserAgent
                ] }),
                M.id && Ze[M.id] && /* @__PURE__ */ E.jsxs("div", { className: "mt-2 space-y-0.5 border-t border-cyber-line/20 pt-1.5 text-[10px] text-slate-400 font-mono", children: [
                  /* @__PURE__ */ E.jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-0.5", children: [
                    /* @__PURE__ */ E.jsxs("span", { children: [
                      "Prompt: ",
                      /* @__PURE__ */ E.jsx("span", { className: "text-slate-200", children: Ze[M.id].promptTokens.toLocaleString() })
                    ] }),
                    /* @__PURE__ */ E.jsxs("span", { children: [
                      "Completion: ",
                      /* @__PURE__ */ E.jsx("span", { className: "text-slate-200", children: Ze[M.id].completionTokens.toLocaleString() })
                    ] }),
                    /* @__PURE__ */ E.jsxs("span", { children: [
                      "Total: ",
                      /* @__PURE__ */ E.jsx("span", { className: "text-cyber-electric font-bold", children: Ze[M.id].totalTokens.toLocaleString() })
                    ] })
                  ] }),
                  /* @__PURE__ */ E.jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-0.5 text-slate-500", children: [
                    /* @__PURE__ */ E.jsxs("span", { children: [
                      "Requests: ",
                      /* @__PURE__ */ E.jsx("span", { className: "text-slate-300", children: Ze[M.id].reportedRequests })
                    ] }),
                    Ze[M.id].unreportedRequests > 0 && /* @__PURE__ */ E.jsxs("span", { className: "text-amber-400 font-semibold", title: "Success requests without reported usage", children: [
                      "Unreported: ",
                      Ze[M.id].unreportedRequests,
                      "*"
                    ] }),
                    Ze[M.id].resetAt && /* @__PURE__ */ E.jsxs("span", { children: [
                      "Reset: ",
                      new Date(Ze[M.id].resetAt).toLocaleDateString(),
                      " ",
                      new Date(Ze[M.id].resetAt).toLocaleTimeString()
                    ] })
                  ] }),
                  Ze[M.id].unreportedRequests > 0 && /* @__PURE__ */ E.jsx("div", { className: "text-[9px] text-amber-500/80 italic mt-0.5", children: "* Totals are incomplete: unreported requests found." })
                ] })
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ E.jsx(
                  "button",
                  {
                    onClick: async () => {
                      const Ge = [...ye.backends];
                      if (pe > 0) {
                        [Ge[pe - 1], Ge[pe]] = [Ge[pe], Ge[pe - 1]];
                        try {
                          Je(await Gf({ ...ye, backends: Ge }));
                        } catch {
                        }
                      }
                    },
                    className: "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition p-1 disabled:opacity-10",
                    title: "Move up",
                    disabled: pe === 0,
                    children: /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3 w-3", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m4.5 15.75 7.5-7.5 7.5 7.5" }) })
                  }
                ),
                /* @__PURE__ */ E.jsx(
                  "button",
                  {
                    onClick: async () => {
                      const Ge = [...ye.backends];
                      if (pe < ye.backends.length - 1) {
                        [Ge[pe], Ge[pe + 1]] = [Ge[pe + 1], Ge[pe]];
                        try {
                          Je(await Gf({ ...ye, backends: Ge }));
                        } catch {
                        }
                      }
                    },
                    className: "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition p-1 disabled:opacity-10",
                    title: "Move down",
                    disabled: pe === ye.backends.length - 1,
                    children: /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3 w-3", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m19.5 8.25-7.5 7.5-7.5-7.5" }) })
                  }
                ),
                /* @__PURE__ */ E.jsx("span", { className: "text-[10px] text-slate-500 font-semibold", children: "Max Retries:" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    type: "number",
                    value: M.maxRetries || 2,
                    onChange: async (Ge) => {
                      const yn = [...ye.backends];
                      yn[pe] = { ...M, maxRetries: Number(Ge.target.value) };
                      try {
                        Je(await Gf({ ...ye, backends: yn }));
                      } catch {
                      }
                    },
                    className: "w-12 bg-cyber-base border border-cyber-line rounded px-1 py-0.5 text-[10px] text-slate-300 text-center focus:border-cyber-neon outline-none",
                    min: 1,
                    max: 10
                  }
                ),
                /* @__PURE__ */ E.jsx("button", { onClick: () => ut(M), className: "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyber-electric transition p-1", title: "Duplicate Backend", children: /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" }) }) }),
                /* @__PURE__ */ E.jsx("button", { onClick: () => W(M, pe), className: "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyber-neon transition p-1", title: "Edit", children: /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.86 3.49a2.2 2.2 0 1 1 3.11 3.11L8 18.57l-4 1 1-4 11.86-12.08Z" }) }) }),
                M.id && /* @__PURE__ */ E.jsx("button", { onClick: () => ee(M.id), className: "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-amber-400 transition p-1", title: "Reset Usage", children: /* @__PURE__ */ E.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ E.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" }) }) }),
                /* @__PURE__ */ E.jsx("button", { onClick: () => vt(M.name), className: "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition p-1", children: /* @__PURE__ */ E.jsx(M_, {}) })
              ] })
            ]
          },
          M.name
        ))
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "col-span-1 space-y-6", children: [
        /* @__PURE__ */ E.jsxs("div", { className: "rounded-xl border border-cyber-line/50 bg-cyber-panel/40 p-4 space-y-4", children: [
          /* @__PURE__ */ E.jsx("h3", { className: "text-xs uppercase font-bold tracking-wider text-slate-400", children: "Server Settings" }),
          /* @__PURE__ */ E.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ E.jsxs("label", { className: "block space-y-1", children: [
            /* @__PURE__ */ E.jsx("span", { className: "text-[10px] uppercase tracking-wider text-slate-400", children: "Port" }),
            /* @__PURE__ */ E.jsx(
              "input",
              {
                type: "number",
                value: ye.port,
                onChange: (M) => dt(Number(M.target.value)),
                className: "w-full bg-cyber-base border border-cyber-line rounded px-3 py-2 text-xs text-slate-200 focus:border-cyber-neon outline-none font-mono",
                min: 1024,
                max: 65535
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "bg-cyber-line/5 border border-cyber-line/20 rounded-lg p-4 space-y-2", children: [
          /* @__PURE__ */ E.jsx("h4", { className: "text-xs uppercase tracking-widest text-slate-400", children: "Usage Example" }),
          /* @__PURE__ */ E.jsxs("code", { className: "text-[10px] text-cyber-neon block bg-cyber-base rounded p-2 overflow-x-auto scrollbar-none font-mono select-all", children: [
            "curl http://127.0.0.1:",
            ye.port,
            "/v1/chat/completions"
          ] })
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "rounded-xl border border-cyber-line/30 bg-cyber-base/20 p-4 text-xs leading-relaxed text-slate-400 space-y-2", children: [
          /* @__PURE__ */ E.jsxs("div", { className: "font-bold text-slate-300 flex items-center gap-1.5", children: [
            /* @__PURE__ */ E.jsx("span", { children: "💡" }),
            " API Proxy Server"
          ] }),
          /* @__PURE__ */ E.jsxs("p", { children: [
            "All API requests sent to port ",
            /* @__PURE__ */ E.jsx("span", { className: "text-cyber-neon font-mono font-bold", children: ye.port }),
            " will be load-balanced and proxy-passed to the active backends."
          ] })
        ] })
      ] })
    ] }) }) : /* @__PURE__ */ E.jsx(j_, { logs: Ye }) }),
    le && /* @__PURE__ */ E.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm", children: /* @__PURE__ */ E.jsxs("div", { className: "w-full max-w-sm rounded-xl border border-cyber-line/80 bg-cyber-panel p-6 shadow-2xl space-y-4", children: [
      /* @__PURE__ */ E.jsx("h3", { className: "font-display text-sm uppercase tracking-widest text-amber-400 font-bold", children: "Confirm Reset Usage" }),
      /* @__PURE__ */ E.jsx("p", { className: "text-xs text-slate-300", children: "Are you sure you want to reset the accumulated token usage for this backend to zero? This action cannot be undone." }),
      /* @__PURE__ */ E.jsxs("div", { className: "flex gap-3 justify-end", children: [
        /* @__PURE__ */ E.jsx("button", { onClick: () => ee(null), className: "px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase tracking-wider", children: "Cancel" }),
        /* @__PURE__ */ E.jsx("button", { onClick: () => oe(le), className: "px-3 py-1.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-500/30 uppercase tracking-wider", children: "Reset Usage" })
      ] })
    ] }) })
  ] }) : /* @__PURE__ */ E.jsx("div", { className: "flex h-full items-center justify-center text-slate-500", children: "Loading..." });
}
function j_({ logs: P }) {
  const [H, j] = Et.useState(1), [ye, Je] = Et.useState(null), [Ye, S] = Et.useState(null), Nt = Et.useMemo(() => P.slice().reverse(), [P]), re = Math.max(1, Math.ceil(Nt.length / gS));
  Et.useEffect(() => {
    j((V) => V < 1 ? 1 : V > re ? re : V);
  }, [re]), Et.useEffect(() => {
    if (!Ye) return;
    const V = window.setTimeout(() => S(null), 1500);
    return () => window.clearTimeout(V);
  }, [Ye]);
  const de = Et.useMemo(() => {
    const V = (H - 1) * gS;
    return Nt.slice(V, V + gS);
  }, [Nt, H]);
  Et.useEffect(() => {
    ye !== null && (de.some((V) => V.id === ye) || Je(null));
  }, [ye, de]);
  const rt = Et.useCallback(
    (V) => {
      j(V), Je(null);
    },
    []
  ), ae = Et.useCallback(
    (V, _e) => {
      _e !== "button" && _e !== "selection" && Je((ie) => ie === V ? null : V);
    },
    []
  ), be = Et.useCallback(
    async (V, _e) => {
      const ie = await O_(_e);
      S({ key: V, status: ie ? "copied" : "failed" });
    },
    []
  ), ne = (V) => {
    try {
      return JSON.stringify(JSON.parse(V), null, 2);
    } catch {
      return V;
    }
  }, Qe = (V) => ne(V.requestJson), at = (V) => V.normalizedResponseJson ? ne(V.normalizedResponseJson) : V.responseJson ? ne(V.responseJson) : !V.success && V.errorMsg ? V.errorMsg : "", ct = (V) => {
    var _e, ie, Me, se;
    if (!V.success) return V.errorMsg || "";
    try {
      const Tt = JSON.parse(V.normalizedResponseJson || V.responseJson);
      return ((se = (Me = (ie = (_e = Tt == null ? void 0 : Tt.choices) == null ? void 0 : _e[0]) == null ? void 0 : ie.message) == null ? void 0 : Me.content) == null ? void 0 : se.substring(0, 80)) || "";
    } catch {
      return "";
    }
  }, Ut = (V) => Ye && Ye.key === V ? Ye.status === "copied" ? "Copied" : "Copy failed" : "Copy", lt = (V) => {
    let _e;
    try {
      _e = JSON.parse(V.normalizedResponseJson || V.responseJson);
    } catch {
      return null;
    }
    const ie = (ft, zt) => /* @__PURE__ */ E.jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ E.jsx("div", { className: "text-[10px] uppercase tracking-wider text-slate-500 mb-0.5 font-semibold", children: ft }),
      /* @__PURE__ */ E.jsx("pre", { className: "text-[11px] text-slate-300 bg-black/30 rounded p-2.5 overflow-auto max-h-48 whitespace-pre-wrap font-mono select-text", onClick: (Be) => Be.stopPropagation(), children: zt || "(empty)" })
    ] }, ft), Me = [], se = _e == null ? void 0 : _e.choices;
    se && Array.isArray(se) && se.forEach((ft, zt) => {
      const Be = (ft == null ? void 0 : ft.message) || {};
      Be.content && Me.push(ie(se.length > 1 ? `Content #${zt}` : "Content", String(Be.content)));
      const De = ["reasoning", "reasoning_content", "reasoning_text", "reasoning_details"];
      for (const le of De)
        Be[le] && Me.push(ie(le, String(Be[le])));
      const kt = new Set(De);
      for (const le of Object.keys(Be))
        (le.startsWith("reasoning_") || le.startsWith("thinking")) && Be[le] && !kt.has(le) && Me.push(ie(le, String(Be[le])));
      (Be.tool_calls || Be.function_call) && Me.push(ie("Tool Calls", ne(JSON.stringify(Be.tool_calls || Be.function_call)))), ft.finish_reason && Me.push(ie("Finish Reason", String(ft.finish_reason)));
      const Ze = /* @__PURE__ */ new Set(["content", ...De, "tool_calls", "function_call", "role"]), wt = Object.keys(Be).filter((le) => !Ze.has(le) && !le.startsWith("reasoning_") && !le.startsWith("thinking"));
      if (wt.length > 0) {
        const le = {};
        for (const ee of wt) le[ee] = Be[ee];
        Me.push(ie("Other", ne(JSON.stringify(le))));
      }
    }), _e != null && _e.usage && Me.push(ie("Usage", ne(JSON.stringify(_e.usage))));
    const Tt = /* @__PURE__ */ new Set(["id", "object", "created", "model", "choices", "usage", "system_fingerprint"]), Ct = {};
    for (const ft of Object.keys(_e))
      Tt.has(ft) || (Ct[ft] = _e[ft]);
    return Object.keys(Ct).length > 0 && Me.push(ie("Other", ne(JSON.stringify(Ct)))), Me.length > 0 ? /* @__PURE__ */ E.jsx(E.Fragment, { children: Me }) : null;
  };
  return P.length === 0 ? /* @__PURE__ */ E.jsx("div", { className: "flex items-center justify-center h-40 text-slate-500 text-sm", children: "No requests yet." }) : /* @__PURE__ */ E.jsxs("div", { className: "p-4 select-none", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "flex items-center justify-between gap-4 text-xs text-slate-500 mb-3 px-2", children: [
      /* @__PURE__ */ E.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ E.jsxs("span", { children: [
          P.length,
          " reqs"
        ] }),
        /* @__PURE__ */ E.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ E.jsx("span", { className: "w-2 h-2 rounded-full bg-green-400" }),
          "OK: ",
          P.filter((V) => V.success).length
        ] }),
        /* @__PURE__ */ E.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ E.jsx("span", { className: "w-2 h-2 rounded-full bg-red-400" }),
          "Fail: ",
          P.filter((V) => !V.success).length
        ] })
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "flex items-center gap-2 font-mono", children: [
        /* @__PURE__ */ E.jsx(
          "button",
          {
            type: "button",
            onClick: () => rt(Math.max(1, H - 1)),
            disabled: H <= 1,
            className: "px-2 py-0.5 rounded border border-cyber-line/60 text-slate-300 hover:border-cyber-neon hover:text-cyber-neon transition disabled:opacity-30 disabled:cursor-not-allowed",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ E.jsxs("span", { className: "text-slate-400", children: [
          "Page ",
          H,
          " / ",
          re
        ] }),
        /* @__PURE__ */ E.jsx(
          "button",
          {
            type: "button",
            onClick: () => rt(Math.min(re, H + 1)),
            disabled: H >= re,
            className: "px-2 py-0.5 rounded border border-cyber-line/60 text-slate-300 hover:border-cyber-neon hover:text-cyber-neon transition disabled:opacity-30 disabled:cursor-not-allowed",
            children: "Next"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ E.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ E.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ E.jsx("thead", { children: /* @__PURE__ */ E.jsxs("tr", { className: "text-slate-400 uppercase tracking-wider border-b border-cyber-line/50", children: [
        /* @__PURE__ */ E.jsx("th", { className: "text-left px-2 py-2 w-16", children: "Time" }),
        /* @__PURE__ */ E.jsx("th", { className: "text-left px-2 py-2 w-24", children: "Backend" }),
        /* @__PURE__ */ E.jsx("th", { className: "text-left px-2 py-2 w-14", children: "Status" }),
        /* @__PURE__ */ E.jsx("th", { className: "text-left px-2 py-2 w-14", children: "Dur" }),
        /* @__PURE__ */ E.jsx("th", { className: "text-left px-2 py-2 w-18", children: "Tokens" }),
        /* @__PURE__ */ E.jsx("th", { className: "text-left px-2 py-2", children: "Response" })
      ] }) }),
      /* @__PURE__ */ E.jsx("tbody", { children: de.map((V) => {
        const _e = ye === V.id, ie = `request:${V.id}`, Me = `response:${V.id}`;
        return /* @__PURE__ */ E.jsxs(Et.Fragment, { children: [
          /* @__PURE__ */ E.jsxs(
            "tr",
            {
              className: `hover:bg-cyber-line/10 ${_e ? "bg-cyber-line/10" : ""}`,
              onClick: () => ae(V.id, "row"),
              onMouseUp: (se) => {
                var Tt;
                window.getSelection && ((Tt = window.getSelection()) != null && Tt.toString()) && se.stopPropagation();
              },
              children: [
                /* @__PURE__ */ E.jsx("td", { className: "px-2 py-2 text-slate-500 font-mono align-top", children: V.timestamp }),
                /* @__PURE__ */ E.jsx("td", { className: "px-2 py-2 text-slate-300 font-medium truncate max-w-[100px] align-top", children: V.backend }),
                /* @__PURE__ */ E.jsx("td", { className: "px-2 py-2 align-top", children: /* @__PURE__ */ E.jsx("span", { className: V.success ? "text-green-400" : "text-red-400", children: V.status || "ERR" }) }),
                /* @__PURE__ */ E.jsxs("td", { className: "px-2 py-2 text-slate-500 font-mono align-top", children: [
                  V.durationMs,
                  "ms"
                ] }),
                /* @__PURE__ */ E.jsx("td", { className: "px-2 py-2 text-slate-500 font-mono align-top text-right", children: V.totalTokens > 0 ? /* @__PURE__ */ E.jsx("span", { title: `Prompt: ${V.promptTokens} / Comp: ${V.completionTokens}`, children: V.totalTokens.toLocaleString() }) : "-" }),
                /* @__PURE__ */ E.jsx("td", { className: "px-2 py-2 text-slate-400 truncate max-w-[350px] align-top", children: ct(V) })
              ]
            }
          ),
          _e && /* @__PURE__ */ E.jsx("tr", { className: "bg-cyber-base/80 border-y border-cyber-line/40", children: /* @__PURE__ */ E.jsx("td", { colSpan: 6, className: "px-4 py-4", children: /* @__PURE__ */ E.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ E.jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2", children: [
              /* @__PURE__ */ E.jsxs("div", { className: "flex gap-4 flex-wrap", children: [
                /* @__PURE__ */ E.jsxs("span", { children: [
                  "#",
                  V.id
                ] }),
                /* @__PURE__ */ E.jsx("span", { children: V.timestamp }),
                /* @__PURE__ */ E.jsxs("span", { className: V.success ? "text-green-400" : "text-red-400", children: [
                  V.status || "ERR",
                  " · ",
                  V.durationMs,
                  "ms"
                ] }),
                /* @__PURE__ */ E.jsxs("span", { children: [
                  "Model: ",
                  V.model
                ] }),
                V.totalTokens > 0 && /* @__PURE__ */ E.jsxs("span", { children: [
                  "Tokens: ",
                  V.totalTokens.toLocaleString(),
                  " (P:",
                  V.promptTokens,
                  " C:",
                  V.completionTokens,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ E.jsx(
                "button",
                {
                  type: "button",
                  onClick: (se) => {
                    se.stopPropagation(), ae(V.id, "button");
                  },
                  className: "text-slate-500 hover:text-slate-300 text-xs",
                  children: "Close"
                }
              )
            ] }),
            /* @__PURE__ */ E.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ E.jsxs("div", { children: [
                /* @__PURE__ */ E.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ E.jsx("span", { className: "text-[10px] uppercase tracking-wider text-cyan-400 font-semibold", children: "Request" }),
                  /* @__PURE__ */ E.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (se) => {
                        se.stopPropagation(), be(ie, Qe(V));
                      },
                      className: `text-[10px] px-2 py-0.5 rounded border transition ${Ye && Ye.key === ie ? Ye.status === "copied" ? "border-green-500/60 text-green-400" : "border-red-500/60 text-red-400" : "border-cyber-line/60 text-slate-400 hover:border-cyber-neon hover:text-cyber-neon"}`,
                      children: Ut(ie)
                    }
                  )
                ] }),
                /* @__PURE__ */ E.jsx(
                  "pre",
                  {
                    className: "text-[11px] text-slate-300 bg-black/30 rounded p-3 overflow-auto max-h-64 whitespace-pre-wrap font-mono select-text",
                    onClick: (se) => se.stopPropagation(),
                    children: Qe(V)
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { children: [
                /* @__PURE__ */ E.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ E.jsx("span", { className: "text-[10px] uppercase tracking-wider text-green-400 font-semibold", children: "Response" }),
                  /* @__PURE__ */ E.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (se) => {
                        se.stopPropagation(), be(Me, at(V));
                      },
                      className: `text-[10px] px-2 py-0.5 rounded border transition ${Ye && Ye.key === Me ? Ye.status === "copied" ? "border-green-500/60 text-green-400" : "border-red-500/60 text-red-400" : "border-cyber-line/60 text-slate-400 hover:border-cyber-neon hover:text-cyber-neon"}`,
                      children: Ut(Me)
                    }
                  )
                ] }),
                V.normalizedResponseJson ? /* @__PURE__ */ E.jsxs("div", { className: "space-y-1 max-h-[32rem] overflow-y-auto scrollbar-thin select-text", onClick: (se) => se.stopPropagation(), children: [
                  lt(V),
                  /* @__PURE__ */ E.jsxs("details", { className: "mt-2", children: [
                    /* @__PURE__ */ E.jsxs("summary", { className: "text-[10px] text-slate-500 cursor-pointer hover:text-slate-300 select-none", children: [
                      "Raw ",
                      V.responseTruncated && /* @__PURE__ */ E.jsx("span", { className: "text-amber-400", children: "(256 KiB truncated)" })
                    ] }),
                    /* @__PURE__ */ E.jsx("pre", { className: "text-[11px] text-slate-400 bg-black/20 rounded p-2.5 mt-1 overflow-auto max-h-48 whitespace-pre-wrap font-mono select-text", onClick: (se) => se.stopPropagation(), children: V.responseJson || "(empty)" })
                  ] })
                ] }) : /* @__PURE__ */ E.jsx(
                  "pre",
                  {
                    className: "text-[11px] text-slate-300 bg-black/30 rounded p-3 overflow-auto max-h-64 whitespace-pre-wrap font-mono select-text",
                    onClick: (se) => se.stopPropagation(),
                    children: at(V)
                  }
                )
              ] })
            ] })
          ] }) }) })
        ] }, V.id);
      }) })
    ] }) })
  ] });
}
function bb(P) {
  if (P.apiVersion !== 1 || P.moduleId !== "clx.cli-proxy")
    throw new Error("CliProxyAI requires CLX UI host API v1");
  R_(P);
}
function F_(P) {
  bb(P), P.registerContribution({
    id: "cli-proxy.main",
    kind: "mainPanel",
    mount(H) {
      const j = xb.createRoot(H);
      return j.render(/* @__PURE__ */ E.jsx(Cb, {})), () => j.unmount();
    }
  });
}
function H_(P) {
  bb(P), P.registerContribution({
    id: "cli-proxy.settings",
    kind: "settingsSection",
    mount(H) {
      const j = xb.createRoot(H);
      return j.render(/* @__PURE__ */ E.jsx(Cb, {})), () => j.unmount();
    }
  });
}
export {
  F_ as registerMain,
  H_ as registerSettings
};
