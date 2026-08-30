var qm = { exports: {} }, Zp = {}, Xm = { exports: {} }, wt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var JE;
function e_() {
  if (JE) return wt;
  JE = 1;
  var R = Symbol.for("react.element"), I = Symbol.for("react.portal"), D = Symbol.for("react.fragment"), Ke = Symbol.for("react.strict_mode"), Ie = Symbol.for("react.profiler"), Ve = Symbol.for("react.provider"), S = Symbol.for("react.context"), ct = Symbol.for("react.forward_ref"), oe = Symbol.for("react.suspense"), le = Symbol.for("react.memo"), Ge = Symbol.for("react.lazy"), ne = Symbol.iterator;
  function de(_) {
    return _ === null || typeof _ != "object" ? null : (_ = ne && _[ne] || _["@@iterator"], typeof _ == "function" ? _ : null);
  }
  var ae = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Te = Object.assign, et = {};
  function Ue(_, B, $e) {
    this.props = _, this.context = B, this.refs = et, this.updater = $e || ae;
  }
  Ue.prototype.isReactComponent = {}, Ue.prototype.setState = function(_, B) {
    if (typeof _ != "object" && typeof _ != "function" && _ != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, _, B, "setState");
  }, Ue.prototype.forceUpdate = function(_) {
    this.updater.enqueueForceUpdate(this, _, "forceUpdate");
  };
  function Qt() {
  }
  Qt.prototype = Ue.prototype;
  function qe(_, B, $e) {
    this.props = _, this.context = B, this.refs = et, this.updater = $e || ae;
  }
  var ze = qe.prototype = new Qt();
  ze.constructor = qe, Te(ze, Ue.prototype), ze.isPureReactComponent = !0;
  var ut = Array.isArray, we = Object.prototype.hasOwnProperty, nt = { current: null }, Ne = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Bt(_, B, $e) {
    var Be, mt = {}, ft = null, ot = null;
    if (B != null) for (Be in B.ref !== void 0 && (ot = B.ref), B.key !== void 0 && (ft = "" + B.key), B) we.call(B, Be) && !Ne.hasOwnProperty(Be) && (mt[Be] = B[Be]);
    var dt = arguments.length - 2;
    if (dt === 1) mt.children = $e;
    else if (1 < dt) {
      for (var yt = Array(dt), Wt = 0; Wt < dt; Wt++) yt[Wt] = arguments[Wt + 2];
      mt.children = yt;
    }
    if (_ && _.defaultProps) for (Be in dt = _.defaultProps, dt) mt[Be] === void 0 && (mt[Be] = dt[Be]);
    return { $$typeof: R, type: _, key: ft, ref: ot, props: mt, _owner: nt.current };
  }
  function Rt(_, B) {
    return { $$typeof: R, type: _.type, key: B, ref: _.ref, props: _.props, _owner: _._owner };
  }
  function Ut(_) {
    return typeof _ == "object" && _ !== null && _.$$typeof === R;
  }
  function It(_) {
    var B = { "=": "=0", ":": "=2" };
    return "$" + _.replace(/[=:]/g, function($e) {
      return B[$e];
    });
  }
  var ht = /\/+/g;
  function De(_, B) {
    return typeof _ == "object" && _ !== null && _.key != null ? It("" + _.key) : B.toString(36);
  }
  function Et(_, B, $e, Be, mt) {
    var ft = typeof _;
    (ft === "undefined" || ft === "boolean") && (_ = null);
    var ot = !1;
    if (_ === null) ot = !0;
    else switch (ft) {
      case "string":
      case "number":
        ot = !0;
        break;
      case "object":
        switch (_.$$typeof) {
          case R:
          case I:
            ot = !0;
        }
    }
    if (ot) return ot = _, mt = mt(ot), _ = Be === "" ? "." + De(ot, 0) : Be, ut(mt) ? ($e = "", _ != null && ($e = _.replace(ht, "$&/") + "/"), Et(mt, B, $e, "", function(Wt) {
      return Wt;
    })) : mt != null && (Ut(mt) && (mt = Rt(mt, $e + (!mt.key || ot && ot.key === mt.key ? "" : ("" + mt.key).replace(ht, "$&/") + "/") + _)), B.push(mt)), 1;
    if (ot = 0, Be = Be === "" ? "." : Be + ":", ut(_)) for (var dt = 0; dt < _.length; dt++) {
      ft = _[dt];
      var yt = Be + De(ft, dt);
      ot += Et(ft, B, $e, yt, mt);
    }
    else if (yt = de(_), typeof yt == "function") for (_ = yt.call(_), dt = 0; !(ft = _.next()).done; ) ft = ft.value, yt = Be + De(ft, dt++), ot += Et(ft, B, $e, yt, mt);
    else if (ft === "object") throw B = String(_), Error("Objects are not valid as a React child (found: " + (B === "[object Object]" ? "object with keys {" + Object.keys(_).join(", ") + "}" : B) + "). If you meant to render a collection of children, use an array instead.");
    return ot;
  }
  function bt(_, B, $e) {
    if (_ == null) return _;
    var Be = [], mt = 0;
    return Et(_, Be, "", "", function(ft) {
      return B.call($e, ft, mt++);
    }), Be;
  }
  function re(_) {
    if (_._status === -1) {
      var B = _._result;
      B = B(), B.then(function($e) {
        (_._status === 0 || _._status === -1) && (_._status = 1, _._result = $e);
      }, function($e) {
        (_._status === 0 || _._status === -1) && (_._status = 2, _._result = $e);
      }), _._status === -1 && (_._status = 0, _._result = B);
    }
    if (_._status === 1) return _._result.default;
    throw _._result;
  }
  var Y = { current: null }, W = { transition: null }, ce = { ReactCurrentDispatcher: Y, ReactCurrentBatchConfig: W, ReactCurrentOwner: nt };
  function ee() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return wt.Children = { map: bt, forEach: function(_, B, $e) {
    bt(_, function() {
      B.apply(this, arguments);
    }, $e);
  }, count: function(_) {
    var B = 0;
    return bt(_, function() {
      B++;
    }), B;
  }, toArray: function(_) {
    return bt(_, function(B) {
      return B;
    }) || [];
  }, only: function(_) {
    if (!Ut(_)) throw Error("React.Children.only expected to receive a single React element child.");
    return _;
  } }, wt.Component = Ue, wt.Fragment = D, wt.Profiler = Ie, wt.PureComponent = qe, wt.StrictMode = Ke, wt.Suspense = oe, wt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ce, wt.act = ee, wt.cloneElement = function(_, B, $e) {
    if (_ == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + _ + ".");
    var Be = Te({}, _.props), mt = _.key, ft = _.ref, ot = _._owner;
    if (B != null) {
      if (B.ref !== void 0 && (ft = B.ref, ot = nt.current), B.key !== void 0 && (mt = "" + B.key), _.type && _.type.defaultProps) var dt = _.type.defaultProps;
      for (yt in B) we.call(B, yt) && !Ne.hasOwnProperty(yt) && (Be[yt] = B[yt] === void 0 && dt !== void 0 ? dt[yt] : B[yt]);
    }
    var yt = arguments.length - 2;
    if (yt === 1) Be.children = $e;
    else if (1 < yt) {
      dt = Array(yt);
      for (var Wt = 0; Wt < yt; Wt++) dt[Wt] = arguments[Wt + 2];
      Be.children = dt;
    }
    return { $$typeof: R, type: _.type, key: mt, ref: ft, props: Be, _owner: ot };
  }, wt.createContext = function(_) {
    return _ = { $$typeof: S, _currentValue: _, _currentValue2: _, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, _.Provider = { $$typeof: Ve, _context: _ }, _.Consumer = _;
  }, wt.createElement = Bt, wt.createFactory = function(_) {
    var B = Bt.bind(null, _);
    return B.type = _, B;
  }, wt.createRef = function() {
    return { current: null };
  }, wt.forwardRef = function(_) {
    return { $$typeof: ct, render: _ };
  }, wt.isValidElement = Ut, wt.lazy = function(_) {
    return { $$typeof: Ge, _payload: { _status: -1, _result: _ }, _init: re };
  }, wt.memo = function(_, B) {
    return { $$typeof: le, type: _, compare: B === void 0 ? null : B };
  }, wt.startTransition = function(_) {
    var B = W.transition;
    W.transition = {};
    try {
      _();
    } finally {
      W.transition = B;
    }
  }, wt.unstable_act = ee, wt.useCallback = function(_, B) {
    return Y.current.useCallback(_, B);
  }, wt.useContext = function(_) {
    return Y.current.useContext(_);
  }, wt.useDebugValue = function() {
  }, wt.useDeferredValue = function(_) {
    return Y.current.useDeferredValue(_);
  }, wt.useEffect = function(_, B) {
    return Y.current.useEffect(_, B);
  }, wt.useId = function() {
    return Y.current.useId();
  }, wt.useImperativeHandle = function(_, B, $e) {
    return Y.current.useImperativeHandle(_, B, $e);
  }, wt.useInsertionEffect = function(_, B) {
    return Y.current.useInsertionEffect(_, B);
  }, wt.useLayoutEffect = function(_, B) {
    return Y.current.useLayoutEffect(_, B);
  }, wt.useMemo = function(_, B) {
    return Y.current.useMemo(_, B);
  }, wt.useReducer = function(_, B, $e) {
    return Y.current.useReducer(_, B, $e);
  }, wt.useRef = function(_) {
    return Y.current.useRef(_);
  }, wt.useState = function(_) {
    return Y.current.useState(_);
  }, wt.useSyncExternalStore = function(_, B, $e) {
    return Y.current.useSyncExternalStore(_, B, $e);
  }, wt.useTransition = function() {
    return Y.current.useTransition();
  }, wt.version = "18.3.1", wt;
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
var eb;
function t_() {
  return eb || (eb = 1, (function(R, I) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var D = "18.3.1", Ke = Symbol.for("react.element"), Ie = Symbol.for("react.portal"), Ve = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), ct = Symbol.for("react.profiler"), oe = Symbol.for("react.provider"), le = Symbol.for("react.context"), Ge = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), de = Symbol.for("react.suspense_list"), ae = Symbol.for("react.memo"), Te = Symbol.for("react.lazy"), et = Symbol.for("react.offscreen"), Ue = Symbol.iterator, Qt = "@@iterator";
      function qe(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = Ue && h[Ue] || h[Qt];
        return typeof C == "function" ? C : null;
      }
      var ze = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ut = {
        transition: null
      }, we = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, nt = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Ne = {}, Bt = null;
      function Rt(h) {
        Bt = h;
      }
      Ne.setExtraStackFrame = function(h) {
        Bt = h;
      }, Ne.getCurrentStack = null, Ne.getStackAddendum = function() {
        var h = "";
        Bt && (h += Bt);
        var C = Ne.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var Ut = !1, It = !1, ht = !1, De = !1, Et = !1, bt = {
        ReactCurrentDispatcher: ze,
        ReactCurrentBatchConfig: ut,
        ReactCurrentOwner: nt
      };
      bt.ReactDebugCurrentFrame = Ne, bt.ReactCurrentActQueue = we;
      function re(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), H = 1; H < C; H++)
            z[H - 1] = arguments[H];
          W("warn", h, z);
        }
      }
      function Y(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), H = 1; H < C; H++)
            z[H - 1] = arguments[H];
          W("error", h, z);
        }
      }
      function W(h, C, z) {
        {
          var H = bt.ReactDebugCurrentFrame, te = H.getStackAddendum();
          te !== "" && (C += "%s", z = z.concat([te]));
          var Ae = z.map(function(se) {
            return String(se);
          });
          Ae.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Ae);
        }
      }
      var ce = {};
      function ee(h, C) {
        {
          var z = h.constructor, H = z && (z.displayName || z.name) || "ReactClass", te = H + "." + C;
          if (ce[te])
            return;
          Y("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, H), ce[te] = !0;
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
          ee(h, "forceUpdate");
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
        enqueueReplaceState: function(h, C, z, H) {
          ee(h, "replaceState");
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
        enqueueSetState: function(h, C, z, H) {
          ee(h, "setState");
        }
      }, B = Object.assign, $e = {};
      Object.freeze($e);
      function Be(h, C, z) {
        this.props = h, this.context = C, this.refs = $e, this.updater = z || _;
      }
      Be.prototype.isReactComponent = {}, Be.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, Be.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var mt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, ft = function(h, C) {
          Object.defineProperty(Be.prototype, h, {
            get: function() {
              re("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var ot in mt)
          mt.hasOwnProperty(ot) && ft(ot, mt[ot]);
      }
      function dt() {
      }
      dt.prototype = Be.prototype;
      function yt(h, C, z) {
        this.props = h, this.context = C, this.refs = $e, this.updater = z || _;
      }
      var Wt = yt.prototype = new dt();
      Wt.constructor = yt, B(Wt, Be.prototype), Wt.isPureReactComponent = !0;
      function Nn() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var wr = Array.isArray;
      function En(h) {
        return wr(h);
      }
      function rr(h) {
        {
          var C = typeof Symbol == "function" && Symbol.toStringTag, z = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return z;
        }
      }
      function Bn(h) {
        try {
          return In(h), !1;
        } catch {
          return !0;
        }
      }
      function In(h) {
        return "" + h;
      }
      function $r(h) {
        if (Bn(h))
          return Y("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", rr(h)), In(h);
      }
      function ci(h, C, z) {
        var H = h.displayName;
        if (H)
          return H;
        var te = C.displayName || C.name || "";
        return te !== "" ? z + "(" + te + ")" : z;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Xn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Y("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case Ve:
            return "Fragment";
          case Ie:
            return "Portal";
          case ct:
            return "Profiler";
          case S:
            return "StrictMode";
          case ne:
            return "Suspense";
          case de:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case le:
              var C = h;
              return sa(C) + ".Consumer";
            case oe:
              var z = h;
              return sa(z._context) + ".Provider";
            case Ge:
              return ci(h, h.render, "ForwardRef");
            case ae:
              var H = h.displayName || null;
              return H !== null ? H : Xn(h.type) || "Memo";
            case Te: {
              var te = h, Ae = te._payload, se = te._init;
              try {
                return Xn(se(Ae));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var bn = Object.prototype.hasOwnProperty, Yn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Sr, $a, Ln;
      Ln = {};
      function xr(h) {
        if (bn.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function ca(h) {
        if (bn.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function Qa(h, C) {
        var z = function() {
          Sr || (Sr = !0, Y("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: z,
          configurable: !0
        });
      }
      function fi(h, C) {
        var z = function() {
          $a || ($a = !0, Y("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: z,
          configurable: !0
        });
      }
      function ie(h) {
        if (typeof h.ref == "string" && nt.current && h.__self && nt.current.stateNode !== h.__self) {
          var C = Xn(nt.current.type);
          Ln[C] || (Y('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Ln[C] = !0);
        }
      }
      var ke = function(h, C, z, H, te, Ae, se) {
        var He = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: Ke,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: z,
          props: se,
          // Record the component responsible for creating this element.
          _owner: Ae
        };
        return He._store = {}, Object.defineProperty(He._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(He, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: H
        }), Object.defineProperty(He, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: te
        }), Object.freeze && (Object.freeze(He.props), Object.freeze(He)), He;
      };
      function pt(h, C, z) {
        var H, te = {}, Ae = null, se = null, He = null, Ct = null;
        if (C != null) {
          xr(C) && (se = C.ref, ie(C)), ca(C) && ($r(C.key), Ae = "" + C.key), He = C.__self === void 0 ? null : C.__self, Ct = C.__source === void 0 ? null : C.__source;
          for (H in C)
            bn.call(C, H) && !Yn.hasOwnProperty(H) && (te[H] = C[H]);
        }
        var Lt = arguments.length - 2;
        if (Lt === 1)
          te.children = z;
        else if (Lt > 1) {
          for (var un = Array(Lt), Kt = 0; Kt < Lt; Kt++)
            un[Kt] = arguments[Kt + 2];
          Object.freeze && Object.freeze(un), te.children = un;
        }
        if (h && h.defaultProps) {
          var vt = h.defaultProps;
          for (H in vt)
            te[H] === void 0 && (te[H] = vt[H]);
        }
        if (Ae || se) {
          var Zt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Ae && Qa(te, Zt), se && fi(te, Zt);
        }
        return ke(h, Ae, se, He, Ct, nt.current, te);
      }
      function Vt(h, C) {
        var z = ke(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return z;
      }
      function rn(h, C, z) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var H, te = B({}, h.props), Ae = h.key, se = h.ref, He = h._self, Ct = h._source, Lt = h._owner;
        if (C != null) {
          xr(C) && (se = C.ref, Lt = nt.current), ca(C) && ($r(C.key), Ae = "" + C.key);
          var un;
          h.type && h.type.defaultProps && (un = h.type.defaultProps);
          for (H in C)
            bn.call(C, H) && !Yn.hasOwnProperty(H) && (C[H] === void 0 && un !== void 0 ? te[H] = un[H] : te[H] = C[H]);
        }
        var Kt = arguments.length - 2;
        if (Kt === 1)
          te.children = z;
        else if (Kt > 1) {
          for (var vt = Array(Kt), Zt = 0; Zt < Kt; Zt++)
            vt[Zt] = arguments[Zt + 2];
          te.children = vt;
        }
        return ke(h.type, Ae, se, He, Ct, Lt, te);
      }
      function hn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === Ke;
      }
      var sn = ".", Kn = ":";
      function an(h) {
        var C = /[=:]/g, z = {
          "=": "=0",
          ":": "=2"
        }, H = h.replace(C, function(te) {
          return z[te];
        });
        return "$" + H;
      }
      var Gt = !1, qt = /\/+/g;
      function fa(h) {
        return h.replace(qt, "$&/");
      }
      function Cr(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), an("" + h.key)) : C.toString(36);
      }
      function Ra(h, C, z, H, te) {
        var Ae = typeof h;
        (Ae === "undefined" || Ae === "boolean") && (h = null);
        var se = !1;
        if (h === null)
          se = !0;
        else
          switch (Ae) {
            case "string":
            case "number":
              se = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case Ke:
                case Ie:
                  se = !0;
              }
          }
        if (se) {
          var He = h, Ct = te(He), Lt = H === "" ? sn + Cr(He, 0) : H;
          if (En(Ct)) {
            var un = "";
            Lt != null && (un = fa(Lt) + "/"), Ra(Ct, C, un, "", function(Xf) {
              return Xf;
            });
          } else Ct != null && (hn(Ct) && (Ct.key && (!He || He.key !== Ct.key) && $r(Ct.key), Ct = Vt(
            Ct,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            z + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Ct.key && (!He || He.key !== Ct.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + Ct.key) + "/"
            ) : "") + Lt
          )), C.push(Ct));
          return 1;
        }
        var Kt, vt, Zt = 0, mn = H === "" ? sn : H + Kn;
        if (En(h))
          for (var El = 0; El < h.length; El++)
            Kt = h[El], vt = mn + Cr(Kt, El), Zt += Ra(Kt, C, z, vt, te);
        else {
          var qo = qe(h);
          if (typeof qo == "function") {
            var Bi = h;
            qo === Bi.entries && (Gt || re("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Gt = !0);
            for (var Xo = qo.call(Bi), ou, qf = 0; !(ou = Xo.next()).done; )
              Kt = ou.value, vt = mn + Cr(Kt, qf++), Zt += Ra(Kt, C, z, vt, te);
          } else if (Ae === "object") {
            var oc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (oc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : oc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Zt;
      }
      function Hi(h, C, z) {
        if (h == null)
          return h;
        var H = [], te = 0;
        return Ra(h, H, "", "", function(Ae) {
          return C.call(z, Ae, te++);
        }), H;
      }
      function Jl(h) {
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
        if (!hn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function tu(h) {
        var C = {
          $$typeof: le,
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
          $$typeof: oe,
          _context: C
        };
        var z = !1, H = !1, te = !1;
        {
          var Ae = {
            $$typeof: le,
            _context: C
          };
          Object.defineProperties(Ae, {
            Provider: {
              get: function() {
                return H || (H = !0, Y("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(se) {
                C.Provider = se;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(se) {
                C._currentValue = se;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(se) {
                C._currentValue2 = se;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(se) {
                C._threadCount = se;
              }
            },
            Consumer: {
              get: function() {
                return z || (z = !0, Y("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(se) {
                te || (re("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", se), te = !0);
              }
            }
          }), C.Consumer = Ae;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var kr = -1, _r = 0, ar = 1, di = 2;
      function Wa(h) {
        if (h._status === kr) {
          var C = h._result, z = C();
          if (z.then(function(Ae) {
            if (h._status === _r || h._status === kr) {
              var se = h;
              se._status = ar, se._result = Ae;
            }
          }, function(Ae) {
            if (h._status === _r || h._status === kr) {
              var se = h;
              se._status = di, se._result = Ae;
            }
          }), h._status === kr) {
            var H = h;
            H._status = _r, H._result = z;
          }
        }
        if (h._status === ar) {
          var te = h._result;
          return te === void 0 && Y(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, te), "default" in te || Y(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, te), te.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var C = {
          // We use these fields to store the result.
          _status: kr,
          _result: h
        }, z = {
          $$typeof: Te,
          _payload: C,
          _init: Wa
        };
        {
          var H, te;
          Object.defineProperties(z, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return H;
              },
              set: function(Ae) {
                Y("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), H = Ae, Object.defineProperty(z, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return te;
              },
              set: function(Ae) {
                Y("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), te = Ae, Object.defineProperty(z, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return z;
      }
      function vi(h) {
        h != null && h.$$typeof === ae ? Y("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Y("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Y("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Y("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: Ge,
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
            set: function(H) {
              z = H, !h.name && !h.displayName && (h.displayName = H);
            }
          });
        }
        return C;
      }
      var E;
      E = Symbol.for("react.module.reference");
      function Q(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === Ve || h === ct || Et || h === S || h === ne || h === de || De || h === et || Ut || It || ht || typeof h == "object" && h !== null && (h.$$typeof === Te || h.$$typeof === ae || h.$$typeof === oe || h.$$typeof === le || h.$$typeof === Ge || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === E || h.getModuleId !== void 0));
      }
      function fe(h, C) {
        Q(h) || Y("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var z = {
          $$typeof: ae,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var H;
          Object.defineProperty(z, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return H;
            },
            set: function(te) {
              H = te, !h.name && !h.displayName && (h.displayName = te);
            }
          });
        }
        return z;
      }
      function xe() {
        var h = ze.current;
        return h === null && Y(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function rt(h) {
        var C = xe();
        if (h._context !== void 0) {
          var z = h._context;
          z.Consumer === h ? Y("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : z.Provider === h && Y("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function Ze(h) {
        var C = xe();
        return C.useState(h);
      }
      function xt(h, C, z) {
        var H = xe();
        return H.useReducer(h, C, z);
      }
      function gt(h) {
        var C = xe();
        return C.useRef(h);
      }
      function Rn(h, C) {
        var z = xe();
        return z.useEffect(h, C);
      }
      function ln(h, C) {
        var z = xe();
        return z.useInsertionEffect(h, C);
      }
      function cn(h, C) {
        var z = xe();
        return z.useLayoutEffect(h, C);
      }
      function ir(h, C) {
        var z = xe();
        return z.useCallback(h, C);
      }
      function Ga(h, C) {
        var z = xe();
        return z.useMemo(h, C);
      }
      function qa(h, C, z) {
        var H = xe();
        return H.useImperativeHandle(h, C, z);
      }
      function at(h, C) {
        {
          var z = xe();
          return z.useDebugValue(h, C);
        }
      }
      function st() {
        var h = xe();
        return h.useTransition();
      }
      function Xa(h) {
        var C = xe();
        return C.useDeferredValue(h);
      }
      function nu() {
        var h = xe();
        return h.useId();
      }
      function ru(h, C, z) {
        var H = xe();
        return H.useSyncExternalStore(h, C, z);
      }
      var hl = 0, Wu, ml, Qr, $o, Dr, lc, uc;
      function Gu() {
      }
      Gu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Wu = console.log, ml = console.info, Qr = console.warn, $o = console.error, Dr = console.group, lc = console.groupCollapsed, uc = console.groupEnd;
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
              log: B({}, h, {
                value: Wu
              }),
              info: B({}, h, {
                value: ml
              }),
              warn: B({}, h, {
                value: Qr
              }),
              error: B({}, h, {
                value: $o
              }),
              group: B({}, h, {
                value: Dr
              }),
              groupCollapsed: B({}, h, {
                value: lc
              }),
              groupEnd: B({}, h, {
                value: uc
              })
            });
          }
          hl < 0 && Y("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Ka = bt.ReactCurrentDispatcher, Za;
      function qu(h, C, z) {
        {
          if (Za === void 0)
            try {
              throw Error();
            } catch (te) {
              var H = te.stack.trim().match(/\n( *(at )?)/);
              Za = H && H[1] || "";
            }
          return `
` + Za + h;
        }
      }
      var au = !1, gl;
      {
        var Xu = typeof WeakMap == "function" ? WeakMap : Map;
        gl = new Xu();
      }
      function Ku(h, C) {
        if (!h || au)
          return "";
        {
          var z = gl.get(h);
          if (z !== void 0)
            return z;
        }
        var H;
        au = !0;
        var te = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ae;
        Ae = Ka.current, Ka.current = null, yl();
        try {
          if (C) {
            var se = function() {
              throw Error();
            };
            if (Object.defineProperty(se.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(se, []);
              } catch (mn) {
                H = mn;
              }
              Reflect.construct(h, [], se);
            } else {
              try {
                se.call();
              } catch (mn) {
                H = mn;
              }
              h.call(se.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (mn) {
              H = mn;
            }
            h();
          }
        } catch (mn) {
          if (mn && H && typeof mn.stack == "string") {
            for (var He = mn.stack.split(`
`), Ct = H.stack.split(`
`), Lt = He.length - 1, un = Ct.length - 1; Lt >= 1 && un >= 0 && He[Lt] !== Ct[un]; )
              un--;
            for (; Lt >= 1 && un >= 0; Lt--, un--)
              if (He[Lt] !== Ct[un]) {
                if (Lt !== 1 || un !== 1)
                  do
                    if (Lt--, un--, un < 0 || He[Lt] !== Ct[un]) {
                      var Kt = `
` + He[Lt].replace(" at new ", " at ");
                      return h.displayName && Kt.includes("<anonymous>") && (Kt = Kt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, Kt), Kt;
                    }
                  while (Lt >= 1 && un >= 0);
                break;
              }
          }
        } finally {
          au = !1, Ka.current = Ae, da(), Error.prepareStackTrace = te;
        }
        var vt = h ? h.displayName || h.name : "", Zt = vt ? qu(vt) : "";
        return typeof h == "function" && gl.set(h, Zt), Zt;
      }
      function Pi(h, C, z) {
        return Ku(h, !1);
      }
      function Wf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, z) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Ku(h, Wf(h));
        if (typeof h == "string")
          return qu(h);
        switch (h) {
          case ne:
            return qu("Suspense");
          case de:
            return qu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Ge:
              return Pi(h.render);
            case ae:
              return Vi(h.type, C, z);
            case Te: {
              var H = h, te = H._payload, Ae = H._init;
              try {
                return Vi(Ae(te), C, z);
              } catch {
              }
            }
          }
        return "";
      }
      var zt = {}, Zu = bt.ReactDebugCurrentFrame;
      function Nt(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          Zu.setExtraStackFrame(z);
        } else
          Zu.setExtraStackFrame(null);
      }
      function Qo(h, C, z, H, te) {
        {
          var Ae = Function.call.bind(bn);
          for (var se in h)
            if (Ae(h, se)) {
              var He = void 0;
              try {
                if (typeof h[se] != "function") {
                  var Ct = Error((H || "React class") + ": " + z + " type `" + se + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[se] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Ct.name = "Invariant Violation", Ct;
                }
                He = h[se](C, se, H, z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Lt) {
                He = Lt;
              }
              He && !(He instanceof Error) && (Nt(te), Y("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", H || "React class", z, se, typeof He), Nt(null)), He instanceof Error && !(He.message in zt) && (zt[He.message] = !0, Nt(te), Y("Failed %s type: %s", z, He.message), Nt(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var C = h._owner, z = Vi(h.type, h._source, C ? C.type : null);
          Rt(z);
        } else
          Rt(null);
      }
      var Xe;
      Xe = !1;
      function Ju() {
        if (nt.current) {
          var h = Xn(nt.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function lr(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), z = h.lineNumber;
          return `

Check your code at ` + C + ":" + z + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? lr(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var C = Ju();
        if (!C) {
          var z = typeof h == "string" ? h : h.displayName || h.name;
          z && (C = `

Check the top-level render call using <` + z + ">.");
        }
        return C;
      }
      function fn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var z = yi(C);
          if (!Or[z]) {
            Or[z] = !0;
            var H = "";
            h && h._owner && h._owner !== nt.current && (H = " It was passed a child from " + Xn(h._owner.type) + "."), hi(h), Y('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', z, H), hi(null);
          }
        }
      }
      function Xt(h, C) {
        if (typeof h == "object") {
          if (En(h))
            for (var z = 0; z < h.length; z++) {
              var H = h[z];
              hn(H) && fn(H, C);
            }
          else if (hn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var te = qe(h);
            if (typeof te == "function" && te !== h.entries)
              for (var Ae = te.call(h), se; !(se = Ae.next()).done; )
                hn(se.value) && fn(se.value, C);
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
          else if (typeof C == "object" && (C.$$typeof === Ge || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === ae))
            z = C.propTypes;
          else
            return;
          if (z) {
            var H = Xn(C);
            Qo(z, h.props, "prop", H, h);
          } else if (C.PropTypes !== void 0 && !Xe) {
            Xe = !0;
            var te = Xn(C);
            Y("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", te || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && Y("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function $n(h) {
        {
          for (var C = Object.keys(h.props), z = 0; z < C.length; z++) {
            var H = C[z];
            if (H !== "children" && H !== "key") {
              hi(h), Y("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", H), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), Y("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Nr(h, C, z) {
        var H = Q(h);
        if (!H) {
          var te = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (te += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ae = mi(C);
          Ae ? te += Ae : te += Ju();
          var se;
          h === null ? se = "null" : En(h) ? se = "array" : h !== void 0 && h.$$typeof === Ke ? (se = "<" + (Xn(h.type) || "Unknown") + " />", te = " Did you accidentally export a JSX literal instead of a component?") : se = typeof h, Y("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", se, te);
        }
        var He = pt.apply(this, arguments);
        if (He == null)
          return He;
        if (H)
          for (var Ct = 2; Ct < arguments.length; Ct++)
            Xt(arguments[Ct], h);
        return h === Ve ? $n(He) : Sl(He), He;
      }
      var Ta = !1;
      function iu(h) {
        var C = Nr.bind(null, h);
        return C.type = h, Ta || (Ta = !0, re("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return re("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Wo(h, C, z) {
        for (var H = rn.apply(this, arguments), te = 2; te < arguments.length; te++)
          Xt(arguments[te], H.type);
        return Sl(H), H;
      }
      function Go(h, C) {
        var z = ut.transition;
        ut.transition = {};
        var H = ut.transition;
        ut.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (ut.transition = z, z === null && H._updatedFibers) {
            var te = H._updatedFibers.size;
            te > 10 && re("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), H._updatedFibers.clear();
          }
        }
      }
      var xl = !1, lu = null;
      function Gf(h) {
        if (lu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), z = R && R[C];
            lu = z.call(R, "timers").setImmediate;
          } catch {
            lu = function(te) {
              xl === !1 && (xl = !0, typeof MessageChannel > "u" && Y("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ae = new MessageChannel();
              Ae.port1.onmessage = te, Ae.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var wa = 0, Ja = !1;
      function gi(h) {
        {
          var C = wa;
          wa++, we.current === null && (we.current = []);
          var z = we.isBatchingLegacy, H;
          try {
            if (we.isBatchingLegacy = !0, H = h(), !z && we.didScheduleLegacyUpdate) {
              var te = we.current;
              te !== null && (we.didScheduleLegacyUpdate = !1, Cl(te));
            }
          } catch (vt) {
            throw ka(C), vt;
          } finally {
            we.isBatchingLegacy = z;
          }
          if (H !== null && typeof H == "object" && typeof H.then == "function") {
            var Ae = H, se = !1, He = {
              then: function(vt, Zt) {
                se = !0, Ae.then(function(mn) {
                  ka(C), wa === 0 ? eo(mn, vt, Zt) : vt(mn);
                }, function(mn) {
                  ka(C), Zt(mn);
                });
              }
            };
            return !Ja && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              se || (Ja = !0, Y("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), He;
          } else {
            var Ct = H;
            if (ka(C), wa === 0) {
              var Lt = we.current;
              Lt !== null && (Cl(Lt), we.current = null);
              var un = {
                then: function(vt, Zt) {
                  we.current === null ? (we.current = [], eo(Ct, vt, Zt)) : vt(Ct);
                }
              };
              return un;
            } else {
              var Kt = {
                then: function(vt, Zt) {
                  vt(Ct);
                }
              };
              return Kt;
            }
          }
        }
      }
      function ka(h) {
        h !== wa - 1 && Y("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), wa = h;
      }
      function eo(h, C, z) {
        {
          var H = we.current;
          if (H !== null)
            try {
              Cl(H), Gf(function() {
                H.length === 0 ? (we.current = null, C(h)) : eo(h, C, z);
              });
            } catch (te) {
              z(te);
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
          } catch (H) {
            throw h = h.slice(C + 1), H;
          } finally {
            to = !1;
          }
        }
      }
      var uu = Nr, no = Wo, ro = iu, ei = {
        map: Hi,
        forEach: eu,
        count: Jl,
        toArray: pl,
        only: vl
      };
      I.Children = ei, I.Component = Be, I.Fragment = Ve, I.Profiler = ct, I.PureComponent = yt, I.StrictMode = S, I.Suspense = ne, I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = bt, I.act = gi, I.cloneElement = no, I.createContext = tu, I.createElement = uu, I.createFactory = ro, I.createRef = Nn, I.forwardRef = vi, I.isValidElement = hn, I.lazy = pi, I.memo = fe, I.startTransition = Go, I.unstable_act = gi, I.useCallback = ir, I.useContext = rt, I.useDebugValue = at, I.useDeferredValue = Xa, I.useEffect = Rn, I.useId = nu, I.useImperativeHandle = qa, I.useInsertionEffect = ln, I.useLayoutEffect = cn, I.useMemo = Ga, I.useReducer = xt, I.useRef = gt, I.useState = Ze, I.useSyncExternalStore = ru, I.useTransition = st, I.version = D, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(tv, tv.exports)), tv.exports;
}
var tb;
function nv() {
  return tb || (tb = 1, process.env.NODE_ENV === "production" ? Xm.exports = e_() : Xm.exports = t_()), Xm.exports;
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
var nb;
function n_() {
  if (nb) return Zp;
  nb = 1;
  var R = nv(), I = Symbol.for("react.element"), D = Symbol.for("react.fragment"), Ke = Object.prototype.hasOwnProperty, Ie = R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Ve = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(ct, oe, le) {
    var Ge, ne = {}, de = null, ae = null;
    le !== void 0 && (de = "" + le), oe.key !== void 0 && (de = "" + oe.key), oe.ref !== void 0 && (ae = oe.ref);
    for (Ge in oe) Ke.call(oe, Ge) && !Ve.hasOwnProperty(Ge) && (ne[Ge] = oe[Ge]);
    if (ct && ct.defaultProps) for (Ge in oe = ct.defaultProps, oe) ne[Ge] === void 0 && (ne[Ge] = oe[Ge]);
    return { $$typeof: I, type: ct, key: de, ref: ae, props: ne, _owner: Ie.current };
  }
  return Zp.Fragment = D, Zp.jsx = S, Zp.jsxs = S, Zp;
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
var rb;
function r_() {
  return rb || (rb = 1, process.env.NODE_ENV !== "production" && (function() {
    var R = nv(), I = Symbol.for("react.element"), D = Symbol.for("react.portal"), Ke = Symbol.for("react.fragment"), Ie = Symbol.for("react.strict_mode"), Ve = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), ct = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), Ge = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), Te = Symbol.iterator, et = "@@iterator";
    function Ue(E) {
      if (E === null || typeof E != "object")
        return null;
      var Q = Te && E[Te] || E[et];
      return typeof Q == "function" ? Q : null;
    }
    var Qt = R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function qe(E) {
      {
        for (var Q = arguments.length, fe = new Array(Q > 1 ? Q - 1 : 0), xe = 1; xe < Q; xe++)
          fe[xe - 1] = arguments[xe];
        ze("error", E, fe);
      }
    }
    function ze(E, Q, fe) {
      {
        var xe = Qt.ReactDebugCurrentFrame, rt = xe.getStackAddendum();
        rt !== "" && (Q += "%s", fe = fe.concat([rt]));
        var Ze = fe.map(function(xt) {
          return String(xt);
        });
        Ze.unshift("Warning: " + Q), Function.prototype.apply.call(console[E], console, Ze);
      }
    }
    var ut = !1, we = !1, nt = !1, Ne = !1, Bt = !1, Rt;
    Rt = Symbol.for("react.module.reference");
    function Ut(E) {
      return !!(typeof E == "string" || typeof E == "function" || E === Ke || E === Ve || Bt || E === Ie || E === le || E === Ge || Ne || E === ae || ut || we || nt || typeof E == "object" && E !== null && (E.$$typeof === de || E.$$typeof === ne || E.$$typeof === S || E.$$typeof === ct || E.$$typeof === oe || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      E.$$typeof === Rt || E.getModuleId !== void 0));
    }
    function It(E, Q, fe) {
      var xe = E.displayName;
      if (xe)
        return xe;
      var rt = Q.displayName || Q.name || "";
      return rt !== "" ? fe + "(" + rt + ")" : fe;
    }
    function ht(E) {
      return E.displayName || "Context";
    }
    function De(E) {
      if (E == null)
        return null;
      if (typeof E.tag == "number" && qe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof E == "function")
        return E.displayName || E.name || null;
      if (typeof E == "string")
        return E;
      switch (E) {
        case Ke:
          return "Fragment";
        case D:
          return "Portal";
        case Ve:
          return "Profiler";
        case Ie:
          return "StrictMode";
        case le:
          return "Suspense";
        case Ge:
          return "SuspenseList";
      }
      if (typeof E == "object")
        switch (E.$$typeof) {
          case ct:
            var Q = E;
            return ht(Q) + ".Consumer";
          case S:
            var fe = E;
            return ht(fe._context) + ".Provider";
          case oe:
            return It(E, E.render, "ForwardRef");
          case ne:
            var xe = E.displayName || null;
            return xe !== null ? xe : De(E.type) || "Memo";
          case de: {
            var rt = E, Ze = rt._payload, xt = rt._init;
            try {
              return De(xt(Ze));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Et = Object.assign, bt = 0, re, Y, W, ce, ee, _, B;
    function $e() {
    }
    $e.__reactDisabledLog = !0;
    function Be() {
      {
        if (bt === 0) {
          re = console.log, Y = console.info, W = console.warn, ce = console.error, ee = console.group, _ = console.groupCollapsed, B = console.groupEnd;
          var E = {
            configurable: !0,
            enumerable: !0,
            value: $e,
            writable: !0
          };
          Object.defineProperties(console, {
            info: E,
            log: E,
            warn: E,
            error: E,
            group: E,
            groupCollapsed: E,
            groupEnd: E
          });
        }
        bt++;
      }
    }
    function mt() {
      {
        if (bt--, bt === 0) {
          var E = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Et({}, E, {
              value: re
            }),
            info: Et({}, E, {
              value: Y
            }),
            warn: Et({}, E, {
              value: W
            }),
            error: Et({}, E, {
              value: ce
            }),
            group: Et({}, E, {
              value: ee
            }),
            groupCollapsed: Et({}, E, {
              value: _
            }),
            groupEnd: Et({}, E, {
              value: B
            })
          });
        }
        bt < 0 && qe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ft = Qt.ReactCurrentDispatcher, ot;
    function dt(E, Q, fe) {
      {
        if (ot === void 0)
          try {
            throw Error();
          } catch (rt) {
            var xe = rt.stack.trim().match(/\n( *(at )?)/);
            ot = xe && xe[1] || "";
          }
        return `
` + ot + E;
      }
    }
    var yt = !1, Wt;
    {
      var Nn = typeof WeakMap == "function" ? WeakMap : Map;
      Wt = new Nn();
    }
    function wr(E, Q) {
      if (!E || yt)
        return "";
      {
        var fe = Wt.get(E);
        if (fe !== void 0)
          return fe;
      }
      var xe;
      yt = !0;
      var rt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Ze;
      Ze = ft.current, ft.current = null, Be();
      try {
        if (Q) {
          var xt = function() {
            throw Error();
          };
          if (Object.defineProperty(xt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(xt, []);
            } catch (at) {
              xe = at;
            }
            Reflect.construct(E, [], xt);
          } else {
            try {
              xt.call();
            } catch (at) {
              xe = at;
            }
            E.call(xt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (at) {
            xe = at;
          }
          E();
        }
      } catch (at) {
        if (at && xe && typeof at.stack == "string") {
          for (var gt = at.stack.split(`
`), Rn = xe.stack.split(`
`), ln = gt.length - 1, cn = Rn.length - 1; ln >= 1 && cn >= 0 && gt[ln] !== Rn[cn]; )
            cn--;
          for (; ln >= 1 && cn >= 0; ln--, cn--)
            if (gt[ln] !== Rn[cn]) {
              if (ln !== 1 || cn !== 1)
                do
                  if (ln--, cn--, cn < 0 || gt[ln] !== Rn[cn]) {
                    var ir = `
` + gt[ln].replace(" at new ", " at ");
                    return E.displayName && ir.includes("<anonymous>") && (ir = ir.replace("<anonymous>", E.displayName)), typeof E == "function" && Wt.set(E, ir), ir;
                  }
                while (ln >= 1 && cn >= 0);
              break;
            }
        }
      } finally {
        yt = !1, ft.current = Ze, mt(), Error.prepareStackTrace = rt;
      }
      var Ga = E ? E.displayName || E.name : "", qa = Ga ? dt(Ga) : "";
      return typeof E == "function" && Wt.set(E, qa), qa;
    }
    function En(E, Q, fe) {
      return wr(E, !1);
    }
    function rr(E) {
      var Q = E.prototype;
      return !!(Q && Q.isReactComponent);
    }
    function Bn(E, Q, fe) {
      if (E == null)
        return "";
      if (typeof E == "function")
        return wr(E, rr(E));
      if (typeof E == "string")
        return dt(E);
      switch (E) {
        case le:
          return dt("Suspense");
        case Ge:
          return dt("SuspenseList");
      }
      if (typeof E == "object")
        switch (E.$$typeof) {
          case oe:
            return En(E.render);
          case ne:
            return Bn(E.type, Q, fe);
          case de: {
            var xe = E, rt = xe._payload, Ze = xe._init;
            try {
              return Bn(Ze(rt), Q, fe);
            } catch {
            }
          }
        }
      return "";
    }
    var In = Object.prototype.hasOwnProperty, $r = {}, ci = Qt.ReactDebugCurrentFrame;
    function sa(E) {
      if (E) {
        var Q = E._owner, fe = Bn(E.type, E._source, Q ? Q.type : null);
        ci.setExtraStackFrame(fe);
      } else
        ci.setExtraStackFrame(null);
    }
    function Xn(E, Q, fe, xe, rt) {
      {
        var Ze = Function.call.bind(In);
        for (var xt in E)
          if (Ze(E, xt)) {
            var gt = void 0;
            try {
              if (typeof E[xt] != "function") {
                var Rn = Error((xe || "React class") + ": " + fe + " type `" + xt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof E[xt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Rn.name = "Invariant Violation", Rn;
              }
              gt = E[xt](Q, xt, xe, fe, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ln) {
              gt = ln;
            }
            gt && !(gt instanceof Error) && (sa(rt), qe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", xe || "React class", fe, xt, typeof gt), sa(null)), gt instanceof Error && !(gt.message in $r) && ($r[gt.message] = !0, sa(rt), qe("Failed %s type: %s", fe, gt.message), sa(null));
          }
      }
    }
    var bn = Array.isArray;
    function Yn(E) {
      return bn(E);
    }
    function Sr(E) {
      {
        var Q = typeof Symbol == "function" && Symbol.toStringTag, fe = Q && E[Symbol.toStringTag] || E.constructor.name || "Object";
        return fe;
      }
    }
    function $a(E) {
      try {
        return Ln(E), !1;
      } catch {
        return !0;
      }
    }
    function Ln(E) {
      return "" + E;
    }
    function xr(E) {
      if ($a(E))
        return qe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Sr(E)), Ln(E);
    }
    var ca = Qt.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, ie;
    function ke(E) {
      if (In.call(E, "ref")) {
        var Q = Object.getOwnPropertyDescriptor(E, "ref").get;
        if (Q && Q.isReactWarning)
          return !1;
      }
      return E.ref !== void 0;
    }
    function pt(E) {
      if (In.call(E, "key")) {
        var Q = Object.getOwnPropertyDescriptor(E, "key").get;
        if (Q && Q.isReactWarning)
          return !1;
      }
      return E.key !== void 0;
    }
    function Vt(E, Q) {
      typeof E.ref == "string" && ca.current;
    }
    function rn(E, Q) {
      {
        var fe = function() {
          fi || (fi = !0, qe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Q));
        };
        fe.isReactWarning = !0, Object.defineProperty(E, "key", {
          get: fe,
          configurable: !0
        });
      }
    }
    function hn(E, Q) {
      {
        var fe = function() {
          ie || (ie = !0, qe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Q));
        };
        fe.isReactWarning = !0, Object.defineProperty(E, "ref", {
          get: fe,
          configurable: !0
        });
      }
    }
    var sn = function(E, Q, fe, xe, rt, Ze, xt) {
      var gt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: I,
        // Built-in properties that belong on the element
        type: E,
        key: Q,
        ref: fe,
        props: xt,
        // Record the component responsible for creating this element.
        _owner: Ze
      };
      return gt._store = {}, Object.defineProperty(gt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(gt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: xe
      }), Object.defineProperty(gt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: rt
      }), Object.freeze && (Object.freeze(gt.props), Object.freeze(gt)), gt;
    };
    function Kn(E, Q, fe, xe, rt) {
      {
        var Ze, xt = {}, gt = null, Rn = null;
        fe !== void 0 && (xr(fe), gt = "" + fe), pt(Q) && (xr(Q.key), gt = "" + Q.key), ke(Q) && (Rn = Q.ref, Vt(Q, rt));
        for (Ze in Q)
          In.call(Q, Ze) && !Qa.hasOwnProperty(Ze) && (xt[Ze] = Q[Ze]);
        if (E && E.defaultProps) {
          var ln = E.defaultProps;
          for (Ze in ln)
            xt[Ze] === void 0 && (xt[Ze] = ln[Ze]);
        }
        if (gt || Rn) {
          var cn = typeof E == "function" ? E.displayName || E.name || "Unknown" : E;
          gt && rn(xt, cn), Rn && hn(xt, cn);
        }
        return sn(E, gt, Rn, rt, xe, ca.current, xt);
      }
    }
    var an = Qt.ReactCurrentOwner, Gt = Qt.ReactDebugCurrentFrame;
    function qt(E) {
      if (E) {
        var Q = E._owner, fe = Bn(E.type, E._source, Q ? Q.type : null);
        Gt.setExtraStackFrame(fe);
      } else
        Gt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function Cr(E) {
      return typeof E == "object" && E !== null && E.$$typeof === I;
    }
    function Ra() {
      {
        if (an.current) {
          var E = De(an.current.type);
          if (E)
            return `

Check the render method of \`` + E + "`.";
        }
        return "";
      }
    }
    function Hi(E) {
      return "";
    }
    var Jl = {};
    function eu(E) {
      {
        var Q = Ra();
        if (!Q) {
          var fe = typeof E == "string" ? E : E.displayName || E.name;
          fe && (Q = `

Check the top-level render call using <` + fe + ">.");
        }
        return Q;
      }
    }
    function pl(E, Q) {
      {
        if (!E._store || E._store.validated || E.key != null)
          return;
        E._store.validated = !0;
        var fe = eu(Q);
        if (Jl[fe])
          return;
        Jl[fe] = !0;
        var xe = "";
        E && E._owner && E._owner !== an.current && (xe = " It was passed a child from " + De(E._owner.type) + "."), qt(E), qe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', fe, xe), qt(null);
      }
    }
    function vl(E, Q) {
      {
        if (typeof E != "object")
          return;
        if (Yn(E))
          for (var fe = 0; fe < E.length; fe++) {
            var xe = E[fe];
            Cr(xe) && pl(xe, Q);
          }
        else if (Cr(E))
          E._store && (E._store.validated = !0);
        else if (E) {
          var rt = Ue(E);
          if (typeof rt == "function" && rt !== E.entries)
            for (var Ze = rt.call(E), xt; !(xt = Ze.next()).done; )
              Cr(xt.value) && pl(xt.value, Q);
        }
      }
    }
    function tu(E) {
      {
        var Q = E.type;
        if (Q == null || typeof Q == "string")
          return;
        var fe;
        if (typeof Q == "function")
          fe = Q.propTypes;
        else if (typeof Q == "object" && (Q.$$typeof === oe || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        Q.$$typeof === ne))
          fe = Q.propTypes;
        else
          return;
        if (fe) {
          var xe = De(Q);
          Xn(fe, E.props, "prop", xe, E);
        } else if (Q.PropTypes !== void 0 && !fa) {
          fa = !0;
          var rt = De(Q);
          qe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", rt || "Unknown");
        }
        typeof Q.getDefaultProps == "function" && !Q.getDefaultProps.isReactClassApproved && qe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function kr(E) {
      {
        for (var Q = Object.keys(E.props), fe = 0; fe < Q.length; fe++) {
          var xe = Q[fe];
          if (xe !== "children" && xe !== "key") {
            qt(E), qe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", xe), qt(null);
            break;
          }
        }
        E.ref !== null && (qt(E), qe("Invalid attribute `ref` supplied to `React.Fragment`."), qt(null));
      }
    }
    var _r = {};
    function ar(E, Q, fe, xe, rt, Ze) {
      {
        var xt = Ut(E);
        if (!xt) {
          var gt = "";
          (E === void 0 || typeof E == "object" && E !== null && Object.keys(E).length === 0) && (gt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Rn = Hi();
          Rn ? gt += Rn : gt += Ra();
          var ln;
          E === null ? ln = "null" : Yn(E) ? ln = "array" : E !== void 0 && E.$$typeof === I ? (ln = "<" + (De(E.type) || "Unknown") + " />", gt = " Did you accidentally export a JSX literal instead of a component?") : ln = typeof E, qe("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ln, gt);
        }
        var cn = Kn(E, Q, fe, rt, Ze);
        if (cn == null)
          return cn;
        if (xt) {
          var ir = Q.children;
          if (ir !== void 0)
            if (xe)
              if (Yn(ir)) {
                for (var Ga = 0; Ga < ir.length; Ga++)
                  vl(ir[Ga], E);
                Object.freeze && Object.freeze(ir);
              } else
                qe("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ir, E);
        }
        if (In.call(Q, "key")) {
          var qa = De(E), at = Object.keys(Q).filter(function(nu) {
            return nu !== "key";
          }), st = at.length > 0 ? "{key: someKey, " + at.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!_r[qa + st]) {
            var Xa = at.length > 0 ? "{" + at.join(": ..., ") + ": ...}" : "{}";
            qe(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, st, qa, Xa, qa), _r[qa + st] = !0;
          }
        }
        return E === Ke ? kr(cn) : tu(cn), cn;
      }
    }
    function di(E, Q, fe) {
      return ar(E, Q, fe, !0);
    }
    function Wa(E, Q, fe) {
      return ar(E, Q, fe, !1);
    }
    var pi = Wa, vi = di;
    Jp.Fragment = Ke, Jp.jsx = pi, Jp.jsxs = vi;
  })()), Jp;
}
var ab;
function a_() {
  return ab || (ab = 1, process.env.NODE_ENV === "production" ? qm.exports = n_() : qm.exports = r_()), qm.exports;
}
var F = a_(), Qf = {}, Km = { exports: {} }, Ia = {}, Zm = { exports: {} }, h0 = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ib;
function i_() {
  return ib || (ib = 1, (function(R) {
    function I(W, ce) {
      var ee = W.length;
      W.push(ce);
      e: for (; 0 < ee; ) {
        var _ = ee - 1 >>> 1, B = W[_];
        if (0 < Ie(B, ce)) W[_] = ce, W[ee] = B, ee = _;
        else break e;
      }
    }
    function D(W) {
      return W.length === 0 ? null : W[0];
    }
    function Ke(W) {
      if (W.length === 0) return null;
      var ce = W[0], ee = W.pop();
      if (ee !== ce) {
        W[0] = ee;
        e: for (var _ = 0, B = W.length, $e = B >>> 1; _ < $e; ) {
          var Be = 2 * (_ + 1) - 1, mt = W[Be], ft = Be + 1, ot = W[ft];
          if (0 > Ie(mt, ee)) ft < B && 0 > Ie(ot, mt) ? (W[_] = ot, W[ft] = ee, _ = ft) : (W[_] = mt, W[Be] = ee, _ = Be);
          else if (ft < B && 0 > Ie(ot, ee)) W[_] = ot, W[ft] = ee, _ = ft;
          else break e;
        }
      }
      return ce;
    }
    function Ie(W, ce) {
      var ee = W.sortIndex - ce.sortIndex;
      return ee !== 0 ? ee : W.id - ce.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Ve = performance;
      R.unstable_now = function() {
        return Ve.now();
      };
    } else {
      var S = Date, ct = S.now();
      R.unstable_now = function() {
        return S.now() - ct;
      };
    }
    var oe = [], le = [], Ge = 1, ne = null, de = 3, ae = !1, Te = !1, et = !1, Ue = typeof setTimeout == "function" ? setTimeout : null, Qt = typeof clearTimeout == "function" ? clearTimeout : null, qe = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ze(W) {
      for (var ce = D(le); ce !== null; ) {
        if (ce.callback === null) Ke(le);
        else if (ce.startTime <= W) Ke(le), ce.sortIndex = ce.expirationTime, I(oe, ce);
        else break;
        ce = D(le);
      }
    }
    function ut(W) {
      if (et = !1, ze(W), !Te) if (D(oe) !== null) Te = !0, re(we);
      else {
        var ce = D(le);
        ce !== null && Y(ut, ce.startTime - W);
      }
    }
    function we(W, ce) {
      Te = !1, et && (et = !1, Qt(Bt), Bt = -1), ae = !0;
      var ee = de;
      try {
        for (ze(ce), ne = D(oe); ne !== null && (!(ne.expirationTime > ce) || W && !It()); ) {
          var _ = ne.callback;
          if (typeof _ == "function") {
            ne.callback = null, de = ne.priorityLevel;
            var B = _(ne.expirationTime <= ce);
            ce = R.unstable_now(), typeof B == "function" ? ne.callback = B : ne === D(oe) && Ke(oe), ze(ce);
          } else Ke(oe);
          ne = D(oe);
        }
        if (ne !== null) var $e = !0;
        else {
          var Be = D(le);
          Be !== null && Y(ut, Be.startTime - ce), $e = !1;
        }
        return $e;
      } finally {
        ne = null, de = ee, ae = !1;
      }
    }
    var nt = !1, Ne = null, Bt = -1, Rt = 5, Ut = -1;
    function It() {
      return !(R.unstable_now() - Ut < Rt);
    }
    function ht() {
      if (Ne !== null) {
        var W = R.unstable_now();
        Ut = W;
        var ce = !0;
        try {
          ce = Ne(!0, W);
        } finally {
          ce ? De() : (nt = !1, Ne = null);
        }
      } else nt = !1;
    }
    var De;
    if (typeof qe == "function") De = function() {
      qe(ht);
    };
    else if (typeof MessageChannel < "u") {
      var Et = new MessageChannel(), bt = Et.port2;
      Et.port1.onmessage = ht, De = function() {
        bt.postMessage(null);
      };
    } else De = function() {
      Ue(ht, 0);
    };
    function re(W) {
      Ne = W, nt || (nt = !0, De());
    }
    function Y(W, ce) {
      Bt = Ue(function() {
        W(R.unstable_now());
      }, ce);
    }
    R.unstable_IdlePriority = 5, R.unstable_ImmediatePriority = 1, R.unstable_LowPriority = 4, R.unstable_NormalPriority = 3, R.unstable_Profiling = null, R.unstable_UserBlockingPriority = 2, R.unstable_cancelCallback = function(W) {
      W.callback = null;
    }, R.unstable_continueExecution = function() {
      Te || ae || (Te = !0, re(we));
    }, R.unstable_forceFrameRate = function(W) {
      0 > W || 125 < W ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Rt = 0 < W ? Math.floor(1e3 / W) : 5;
    }, R.unstable_getCurrentPriorityLevel = function() {
      return de;
    }, R.unstable_getFirstCallbackNode = function() {
      return D(oe);
    }, R.unstable_next = function(W) {
      switch (de) {
        case 1:
        case 2:
        case 3:
          var ce = 3;
          break;
        default:
          ce = de;
      }
      var ee = de;
      de = ce;
      try {
        return W();
      } finally {
        de = ee;
      }
    }, R.unstable_pauseExecution = function() {
    }, R.unstable_requestPaint = function() {
    }, R.unstable_runWithPriority = function(W, ce) {
      switch (W) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          W = 3;
      }
      var ee = de;
      de = W;
      try {
        return ce();
      } finally {
        de = ee;
      }
    }, R.unstable_scheduleCallback = function(W, ce, ee) {
      var _ = R.unstable_now();
      switch (typeof ee == "object" && ee !== null ? (ee = ee.delay, ee = typeof ee == "number" && 0 < ee ? _ + ee : _) : ee = _, W) {
        case 1:
          var B = -1;
          break;
        case 2:
          B = 250;
          break;
        case 5:
          B = 1073741823;
          break;
        case 4:
          B = 1e4;
          break;
        default:
          B = 5e3;
      }
      return B = ee + B, W = { id: Ge++, callback: ce, priorityLevel: W, startTime: ee, expirationTime: B, sortIndex: -1 }, ee > _ ? (W.sortIndex = ee, I(le, W), D(oe) === null && W === D(le) && (et ? (Qt(Bt), Bt = -1) : et = !0, Y(ut, ee - _))) : (W.sortIndex = B, I(oe, W), Te || ae || (Te = !0, re(we))), W;
    }, R.unstable_shouldYield = It, R.unstable_wrapCallback = function(W) {
      var ce = de;
      return function() {
        var ee = de;
        de = ce;
        try {
          return W.apply(this, arguments);
        } finally {
          de = ee;
        }
      };
    };
  })(h0)), h0;
}
var m0 = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lb;
function l_() {
  return lb || (lb = 1, (function(R) {
    process.env.NODE_ENV !== "production" && (function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var I = !1, D = 5;
      function Ke(ie, ke) {
        var pt = ie.length;
        ie.push(ke), S(ie, ke, pt);
      }
      function Ie(ie) {
        return ie.length === 0 ? null : ie[0];
      }
      function Ve(ie) {
        if (ie.length === 0)
          return null;
        var ke = ie[0], pt = ie.pop();
        return pt !== ke && (ie[0] = pt, ct(ie, pt, 0)), ke;
      }
      function S(ie, ke, pt) {
        for (var Vt = pt; Vt > 0; ) {
          var rn = Vt - 1 >>> 1, hn = ie[rn];
          if (oe(hn, ke) > 0)
            ie[rn] = ke, ie[Vt] = hn, Vt = rn;
          else
            return;
        }
      }
      function ct(ie, ke, pt) {
        for (var Vt = pt, rn = ie.length, hn = rn >>> 1; Vt < hn; ) {
          var sn = (Vt + 1) * 2 - 1, Kn = ie[sn], an = sn + 1, Gt = ie[an];
          if (oe(Kn, ke) < 0)
            an < rn && oe(Gt, Kn) < 0 ? (ie[Vt] = Gt, ie[an] = ke, Vt = an) : (ie[Vt] = Kn, ie[sn] = ke, Vt = sn);
          else if (an < rn && oe(Gt, ke) < 0)
            ie[Vt] = Gt, ie[an] = ke, Vt = an;
          else
            return;
        }
      }
      function oe(ie, ke) {
        var pt = ie.sortIndex - ke.sortIndex;
        return pt !== 0 ? pt : ie.id - ke.id;
      }
      var le = 1, Ge = 2, ne = 3, de = 4, ae = 5;
      function Te(ie, ke) {
      }
      var et = typeof performance == "object" && typeof performance.now == "function";
      if (et) {
        var Ue = performance;
        R.unstable_now = function() {
          return Ue.now();
        };
      } else {
        var Qt = Date, qe = Qt.now();
        R.unstable_now = function() {
          return Qt.now() - qe;
        };
      }
      var ze = 1073741823, ut = -1, we = 250, nt = 5e3, Ne = 1e4, Bt = ze, Rt = [], Ut = [], It = 1, ht = null, De = ne, Et = !1, bt = !1, re = !1, Y = typeof setTimeout == "function" ? setTimeout : null, W = typeof clearTimeout == "function" ? clearTimeout : null, ce = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ee(ie) {
        for (var ke = Ie(Ut); ke !== null; ) {
          if (ke.callback === null)
            Ve(Ut);
          else if (ke.startTime <= ie)
            Ve(Ut), ke.sortIndex = ke.expirationTime, Ke(Rt, ke);
          else
            return;
          ke = Ie(Ut);
        }
      }
      function _(ie) {
        if (re = !1, ee(ie), !bt)
          if (Ie(Rt) !== null)
            bt = !0, Ln(B);
          else {
            var ke = Ie(Ut);
            ke !== null && xr(_, ke.startTime - ie);
          }
      }
      function B(ie, ke) {
        bt = !1, re && (re = !1, ca()), Et = !0;
        var pt = De;
        try {
          var Vt;
          if (!I) return $e(ie, ke);
        } finally {
          ht = null, De = pt, Et = !1;
        }
      }
      function $e(ie, ke) {
        var pt = ke;
        for (ee(pt), ht = Ie(Rt); ht !== null && !(ht.expirationTime > pt && (!ie || ci())); ) {
          var Vt = ht.callback;
          if (typeof Vt == "function") {
            ht.callback = null, De = ht.priorityLevel;
            var rn = ht.expirationTime <= pt, hn = Vt(rn);
            pt = R.unstable_now(), typeof hn == "function" ? ht.callback = hn : ht === Ie(Rt) && Ve(Rt), ee(pt);
          } else
            Ve(Rt);
          ht = Ie(Rt);
        }
        if (ht !== null)
          return !0;
        var sn = Ie(Ut);
        return sn !== null && xr(_, sn.startTime - pt), !1;
      }
      function Be(ie, ke) {
        switch (ie) {
          case le:
          case Ge:
          case ne:
          case de:
          case ae:
            break;
          default:
            ie = ne;
        }
        var pt = De;
        De = ie;
        try {
          return ke();
        } finally {
          De = pt;
        }
      }
      function mt(ie) {
        var ke;
        switch (De) {
          case le:
          case Ge:
          case ne:
            ke = ne;
            break;
          default:
            ke = De;
            break;
        }
        var pt = De;
        De = ke;
        try {
          return ie();
        } finally {
          De = pt;
        }
      }
      function ft(ie) {
        var ke = De;
        return function() {
          var pt = De;
          De = ke;
          try {
            return ie.apply(this, arguments);
          } finally {
            De = pt;
          }
        };
      }
      function ot(ie, ke, pt) {
        var Vt = R.unstable_now(), rn;
        if (typeof pt == "object" && pt !== null) {
          var hn = pt.delay;
          typeof hn == "number" && hn > 0 ? rn = Vt + hn : rn = Vt;
        } else
          rn = Vt;
        var sn;
        switch (ie) {
          case le:
            sn = ut;
            break;
          case Ge:
            sn = we;
            break;
          case ae:
            sn = Bt;
            break;
          case de:
            sn = Ne;
            break;
          case ne:
          default:
            sn = nt;
            break;
        }
        var Kn = rn + sn, an = {
          id: It++,
          callback: ke,
          priorityLevel: ie,
          startTime: rn,
          expirationTime: Kn,
          sortIndex: -1
        };
        return rn > Vt ? (an.sortIndex = rn, Ke(Ut, an), Ie(Rt) === null && an === Ie(Ut) && (re ? ca() : re = !0, xr(_, rn - Vt))) : (an.sortIndex = Kn, Ke(Rt, an), !bt && !Et && (bt = !0, Ln(B))), an;
      }
      function dt() {
      }
      function yt() {
        !bt && !Et && (bt = !0, Ln(B));
      }
      function Wt() {
        return Ie(Rt);
      }
      function Nn(ie) {
        ie.callback = null;
      }
      function wr() {
        return De;
      }
      var En = !1, rr = null, Bn = -1, In = D, $r = -1;
      function ci() {
        var ie = R.unstable_now() - $r;
        return !(ie < In);
      }
      function sa() {
      }
      function Xn(ie) {
        if (ie < 0 || ie > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ie > 0 ? In = Math.floor(1e3 / ie) : In = D;
      }
      var bn = function() {
        if (rr !== null) {
          var ie = R.unstable_now();
          $r = ie;
          var ke = !0, pt = !0;
          try {
            pt = rr(ke, ie);
          } finally {
            pt ? Yn() : (En = !1, rr = null);
          }
        } else
          En = !1;
      }, Yn;
      if (typeof ce == "function")
        Yn = function() {
          ce(bn);
        };
      else if (typeof MessageChannel < "u") {
        var Sr = new MessageChannel(), $a = Sr.port2;
        Sr.port1.onmessage = bn, Yn = function() {
          $a.postMessage(null);
        };
      } else
        Yn = function() {
          Y(bn, 0);
        };
      function Ln(ie) {
        rr = ie, En || (En = !0, Yn());
      }
      function xr(ie, ke) {
        Bn = Y(function() {
          ie(R.unstable_now());
        }, ke);
      }
      function ca() {
        W(Bn), Bn = -1;
      }
      var Qa = sa, fi = null;
      R.unstable_IdlePriority = ae, R.unstable_ImmediatePriority = le, R.unstable_LowPriority = de, R.unstable_NormalPriority = ne, R.unstable_Profiling = fi, R.unstable_UserBlockingPriority = Ge, R.unstable_cancelCallback = Nn, R.unstable_continueExecution = yt, R.unstable_forceFrameRate = Xn, R.unstable_getCurrentPriorityLevel = wr, R.unstable_getFirstCallbackNode = Wt, R.unstable_next = mt, R.unstable_pauseExecution = dt, R.unstable_requestPaint = Qa, R.unstable_runWithPriority = Be, R.unstable_scheduleCallback = ot, R.unstable_shouldYield = ci, R.unstable_wrapCallback = ft, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    })();
  })(m0)), m0;
}
var ub;
function db() {
  return ub || (ub = 1, process.env.NODE_ENV === "production" ? Zm.exports = i_() : Zm.exports = l_()), Zm.exports;
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
var ob;
function u_() {
  if (ob) return Ia;
  ob = 1;
  var R = nv(), I = db();
  function D(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var Ke = /* @__PURE__ */ new Set(), Ie = {};
  function Ve(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (Ie[n] = r, n = 0; n < r.length; n++) Ke.add(r[n]);
  }
  var ct = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), oe = Object.prototype.hasOwnProperty, le = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Ge = {}, ne = {};
  function de(n) {
    return oe.call(ne, n) ? !0 : oe.call(Ge, n) ? !1 : le.test(n) ? ne[n] = !0 : (Ge[n] = !0, !1);
  }
  function ae(n, r, l, o) {
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
  function Te(n, r, l, o) {
    if (r === null || typeof r > "u" || ae(n, r, l, o)) return !0;
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
  function et(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var Ue = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    Ue[n] = new et(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    Ue[r] = new et(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    Ue[n] = new et(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    Ue[n] = new et(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    Ue[n] = new et(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    Ue[n] = new et(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    Ue[n] = new et(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    Ue[n] = new et(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    Ue[n] = new et(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Qt = /[\-:]([a-z])/g;
  function qe(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Qt,
      qe
    );
    Ue[r] = new et(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Qt, qe);
    Ue[r] = new et(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Qt, qe);
    Ue[r] = new et(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    Ue[n] = new et(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), Ue.xlinkHref = new et("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    Ue[n] = new et(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function ze(n, r, l, o) {
    var c = Ue.hasOwnProperty(r) ? Ue[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (Te(r, l, c, o) && (l = null), o || c === null ? de(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var ut = R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, we = Symbol.for("react.element"), nt = Symbol.for("react.portal"), Ne = Symbol.for("react.fragment"), Bt = Symbol.for("react.strict_mode"), Rt = Symbol.for("react.profiler"), Ut = Symbol.for("react.provider"), It = Symbol.for("react.context"), ht = Symbol.for("react.forward_ref"), De = Symbol.for("react.suspense"), Et = Symbol.for("react.suspense_list"), bt = Symbol.for("react.memo"), re = Symbol.for("react.lazy"), Y = Symbol.for("react.offscreen"), W = Symbol.iterator;
  function ce(n) {
    return n === null || typeof n != "object" ? null : (n = W && n[W] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ee = Object.assign, _;
  function B(n) {
    if (_ === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      _ = r && r[1] || "";
    }
    return `
` + _ + n;
  }
  var $e = !1;
  function Be(n, r) {
    if (!n || $e) return "";
    $e = !0;
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
                var b = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && b.includes("<anonymous>") && (b = b.replace("<anonymous>", n.displayName)), b;
              }
            while (1 <= m && 0 <= x);
          break;
        }
      }
    } finally {
      $e = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? B(n) : "";
  }
  function mt(n) {
    switch (n.tag) {
      case 5:
        return B(n.type);
      case 16:
        return B("Lazy");
      case 13:
        return B("Suspense");
      case 19:
        return B("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Be(n.type, !1), n;
      case 11:
        return n = Be(n.type.render, !1), n;
      case 1:
        return n = Be(n.type, !0), n;
      default:
        return "";
    }
  }
  function ft(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case Ne:
        return "Fragment";
      case nt:
        return "Portal";
      case Rt:
        return "Profiler";
      case Bt:
        return "StrictMode";
      case De:
        return "Suspense";
      case Et:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case It:
        return (n.displayName || "Context") + ".Consumer";
      case Ut:
        return (n._context.displayName || "Context") + ".Provider";
      case ht:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case bt:
        return r = n.displayName || null, r !== null ? r : ft(n.type) || "Memo";
      case re:
        r = n._payload, n = n._init;
        try {
          return ft(n(r));
        } catch {
        }
    }
    return null;
  }
  function ot(n) {
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
        return r === Bt ? "StrictMode" : "Mode";
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
  function yt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Wt(n) {
    var r = yt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
  function Nn(n) {
    n._valueTracker || (n._valueTracker = Wt(n));
  }
  function wr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = yt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function En(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function rr(n, r) {
    var l = r.checked;
    return ee({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Bn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = dt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function In(n, r) {
    r = r.checked, r != null && ze(n, "checked", r, !1);
  }
  function $r(n, r) {
    In(n, r);
    var l = dt(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, dt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
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
    (r !== "number" || En(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Xn = Array.isArray;
  function bn(n, r, l, o) {
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
  function Yn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(D(91));
    return ee({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Sr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(D(92));
        if (Xn(l)) {
          if (1 < l.length) throw Error(D(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: dt(l) };
  }
  function $a(n, r) {
    var l = dt(r.value), o = dt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Ln(n) {
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
  function ca(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? xr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
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
  function ie(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var ke = {
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
  Object.keys(ke).forEach(function(n) {
    pt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), ke[r] = ke[n];
    });
  });
  function Vt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || ke.hasOwnProperty(n) && ke[n] ? ("" + r).trim() : r + "px";
  }
  function rn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Vt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var hn = ee({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function sn(n, r) {
    if (r) {
      if (hn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(D(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(D(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(D(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(D(62));
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
  var an = null;
  function Gt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var qt = null, fa = null, Cr = null;
  function Ra(n) {
    if (n = Le(n)) {
      if (typeof qt != "function") throw Error(D(280));
      var r = n.stateNode;
      r && (r = yn(r), qt(n.stateNode, n.type, r));
    }
  }
  function Hi(n) {
    fa ? Cr ? Cr.push(n) : Cr = [n] : fa = n;
  }
  function Jl() {
    if (fa) {
      var n = fa, r = Cr;
      if (Cr = fa = null, Ra(n), r) for (n = 0; n < r.length; n++) Ra(r[n]);
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
      vl = !1, (fa !== null || Cr !== null) && (pl(), Jl());
    }
  }
  function kr(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = yn(l);
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
    if (l && typeof l != "function") throw Error(D(231, r, typeof l));
    return l;
  }
  var _r = !1;
  if (ct) try {
    var ar = {};
    Object.defineProperty(ar, "passive", { get: function() {
      _r = !0;
    } }), window.addEventListener("test", ar, ar), window.removeEventListener("test", ar, ar);
  } catch {
    _r = !1;
  }
  function di(n, r, l, o, c, d, m, x, b) {
    var A = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, A);
    } catch (X) {
      this.onError(X);
    }
  }
  var Wa = !1, pi = null, vi = !1, E = null, Q = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function fe(n, r, l, o, c, d, m, x, b) {
    Wa = !1, pi = null, di.apply(Q, arguments);
  }
  function xe(n, r, l, o, c, d, m, x, b) {
    if (fe.apply(this, arguments), Wa) {
      if (Wa) {
        var A = pi;
        Wa = !1, pi = null;
      } else throw Error(D(198));
      vi || (vi = !0, E = A);
    }
  }
  function rt(n) {
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
  function Ze(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function xt(n) {
    if (rt(n) !== n) throw Error(D(188));
  }
  function gt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = rt(n), r === null) throw Error(D(188));
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
          if (d === l) return xt(c), n;
          if (d === o) return xt(c), r;
          d = d.sibling;
        }
        throw Error(D(188));
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
          if (!m) throw Error(D(189));
        }
      }
      if (l.alternate !== o) throw Error(D(190));
    }
    if (l.tag !== 3) throw Error(D(188));
    return l.stateNode.current === l ? n : r;
  }
  function Rn(n) {
    return n = gt(n), n !== null ? ln(n) : null;
  }
  function ln(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = ln(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var cn = I.unstable_scheduleCallback, ir = I.unstable_cancelCallback, Ga = I.unstable_shouldYield, qa = I.unstable_requestPaint, at = I.unstable_now, st = I.unstable_getCurrentPriorityLevel, Xa = I.unstable_ImmediatePriority, nu = I.unstable_UserBlockingPriority, ru = I.unstable_NormalPriority, hl = I.unstable_LowPriority, Wu = I.unstable_IdlePriority, ml = null, Qr = null;
  function $o(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function") try {
      Qr.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dr = Math.clz32 ? Math.clz32 : Gu, lc = Math.log, uc = Math.LN2;
  function Gu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (lc(n) / uc | 0) | 0;
  }
  var yl = 64, da = 4194304;
  function Ka(n) {
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
  function Za(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var x = m & ~c;
      x !== 0 ? o = Ka(x) : (d &= m, d !== 0 && (o = Ka(d)));
    } else m = l & ~c, m !== 0 ? o = Ka(m) : d !== 0 && (o = Ka(d));
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
      var m = 31 - Dr(d), x = 1 << m, b = c[m];
      b === -1 ? ((x & l) === 0 || (x & o) !== 0) && (c[m] = qu(x, r)) : b <= r && (n.expiredLanes |= x), d &= ~x;
    }
  }
  function gl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Xu() {
    var n = yl;
    return yl <<= 1, (yl & 4194240) === 0 && (yl = 64), n;
  }
  function Ku(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Pi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Dr(r), n[r] = l;
  }
  function Wf(n, r) {
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
  function Zu(n) {
    return n &= -n, 1 < n ? 4 < n ? (n & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Nt, Qo, hi, Xe, Ju, lr = !1, mi = [], Or = null, yi = null, fn = null, Xt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), $n = [], Nr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
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
        fn = null;
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
  function iu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = Le(r), r !== null && Qo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Wo(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Or = iu(Or, n, r, l, o, c), !0;
      case "dragenter":
        return yi = iu(yi, n, r, l, o, c), !0;
      case "mouseover":
        return fn = iu(fn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Xt.set(d, iu(Xt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, iu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Go(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = rt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Ze(l), r !== null) {
            n.blockedOn = r, Ju(n.priority, function() {
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
      var l = no(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        an = o, l.target.dispatchEvent(o), an = null;
      } else return r = Le(l), r !== null && Qo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    xl(n) && l.delete(r);
  }
  function Gf() {
    lr = !1, Or !== null && xl(Or) && (Or = null), yi !== null && xl(yi) && (yi = null), fn !== null && xl(fn) && (fn = null), Xt.forEach(lu), Sl.forEach(lu);
  }
  function wa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, lr || (lr = !0, I.unstable_scheduleCallback(I.unstable_NormalPriority, Gf)));
  }
  function Ja(n) {
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
    for (Or !== null && wa(Or, n), yi !== null && wa(yi, n), fn !== null && wa(fn, n), Xt.forEach(r), Sl.forEach(r), l = 0; l < $n.length; l++) o = $n[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < $n.length && (l = $n[0], l.blockedOn === null); ) Go(l), l.blockedOn === null && $n.shift();
  }
  var gi = ut.ReactCurrentBatchConfig, ka = !0;
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
    if (ka) {
      var c = no(n, r, l, o);
      if (c === null) Sc(n, r, o, uu, l), Ta(n, o);
      else if (Wo(c, n, r, l, o)) o.stopPropagation();
      else if (Ta(n, o), r & 4 && -1 < Nr.indexOf(n)) {
        for (; c !== null; ) {
          var d = Le(c);
          if (d !== null && Nt(d), d = no(n, r, l, o), d === null && Sc(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Sc(n, r, o, null, l);
    }
  }
  var uu = null;
  function no(n, r, l, o) {
    if (uu = null, n = Gt(o), n = vu(n), n !== null) if (r = rt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Ze(r), n !== null) return n;
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
        switch (st()) {
          case Xa:
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
  function H(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function te() {
    return !0;
  }
  function Ae() {
    return !1;
  }
  function se(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var x in n) n.hasOwnProperty(x) && (l = n[x], this[x] = l ? l(d) : d[x]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? te : Ae, this.isPropagationStopped = Ae, this;
    }
    return ee(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = te);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = te);
    }, persist: function() {
    }, isPersistent: te }), r;
  }
  var He = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ct = se(He), Lt = ee({}, He, { view: 0, detail: 0 }), un = se(Lt), Kt, vt, Zt, mn = ee({}, Lt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Jf, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Zt && (Zt && n.type === "mousemove" ? (Kt = n.screenX - Zt.screenX, vt = n.screenY - Zt.screenY) : vt = Kt = 0, Zt = n), Kt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : vt;
  } }), El = se(mn), qo = ee({}, mn, { dataTransfer: 0 }), Bi = se(qo), Xo = ee({}, Lt, { relatedTarget: 0 }), ou = se(Xo), qf = ee({}, He, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), oc = se(qf), Xf = ee({}, He, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), av = se(Xf), Kf = ee({}, He, { data: 0 }), Zf = se(Kf), iv = {
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
  }, Jm = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Jm[n]) ? !!r[n] : !1;
  }
  function Jf() {
    return Ii;
  }
  var ed = ee({}, Lt, { key: function(n) {
    if (n.key) {
      var r = iv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = H(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? lv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Jf, charCode: function(n) {
    return n.type === "keypress" ? H(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? H(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), td = se(ed), nd = ee({}, mn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), uv = se(nd), sc = ee({}, Lt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Jf }), ov = se(sc), Wr = ee({}, He, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = se(Wr), Mn = ee({}, mn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = se(Mn), rd = [9, 13, 27, 32], ao = ct && "CompositionEvent" in window, Ko = null;
  ct && "documentMode" in document && (Ko = document.documentMode);
  var Zo = ct && "TextEvent" in window && !Ko, sv = ct && (!ao || Ko && 8 < Ko && 11 >= Ko), cv = " ", cc = !1;
  function fv(n, r) {
    switch (n) {
      case "keyup":
        return rd.indexOf(r.keyCode) !== -1;
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
  var io = !1;
  function pv(n, r) {
    switch (n) {
      case "compositionend":
        return dv(r);
      case "keypress":
        return r.which !== 32 ? null : (cc = !0, cv);
      case "textInput":
        return n = r.data, n === cv && cc ? null : n;
      default:
        return null;
    }
  }
  function ey(n, r) {
    if (io) return n === "compositionend" || !ao && fv(n, r) ? (n = z(), C = h = ei = null, io = !1, n) : null;
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
  function ad(n, r, l, o) {
    Hi(o), r = as(r, "onChange"), 0 < r.length && (l = new Ct("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function hv(n) {
    du(n, 0);
  }
  function Jo(n) {
    var r = ni(n);
    if (wr(r)) return n;
  }
  function ny(n, r) {
    if (n === "change") return r;
  }
  var mv = !1;
  if (ct) {
    var id;
    if (ct) {
      var ld = "oninput" in document;
      if (!ld) {
        var yv = document.createElement("div");
        yv.setAttribute("oninput", "return;"), ld = typeof yv.oninput == "function";
      }
      id = ld;
    } else id = !1;
    mv = id && (!document.documentMode || 9 < document.documentMode);
  }
  function gv() {
    Si && (Si.detachEvent("onpropertychange", Sv), su = Si = null);
  }
  function Sv(n) {
    if (n.propertyName === "value" && Jo(su)) {
      var r = [];
      ad(r, su, n, Gt(n)), tu(hv, r);
    }
  }
  function ry(n, r, l) {
    n === "focusin" ? (gv(), Si = r, su = l, Si.attachEvent("onpropertychange", Sv)) : n === "focusout" && gv();
  }
  function xv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Jo(su);
  }
  function ay(n, r) {
    if (n === "click") return Jo(r);
  }
  function Cv(n, r) {
    if (n === "input" || n === "change") return Jo(r);
  }
  function iy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : iy;
  function es(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!oe.call(r, c) || !ti(n[c], r[c])) return !1;
    }
    return !0;
  }
  function Ev(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function fc(n, r) {
    var l = Ev(n);
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
      l = Ev(l);
    }
  }
  function bl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? bl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ts() {
    for (var n = window, r = En(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = En(n.document);
    }
    return r;
  }
  function dc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function lo(n) {
    var r = ts(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && bl(l.ownerDocument.documentElement, l)) {
      if (o !== null && dc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = fc(l, d);
          var m = fc(
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
  var ly = ct && "documentMode" in document && 11 >= document.documentMode, uo = null, ud = null, ns = null, od = !1;
  function sd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    od || uo == null || uo !== En(o) || (o = uo, "selectionStart" in o && dc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ns && es(ns, o) || (ns = o, o = as(ud, "onSelect"), 0 < o.length && (r = new Ct("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = uo)));
  }
  function pc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: pc("Animation", "AnimationEnd"), animationiteration: pc("Animation", "AnimationIteration"), animationstart: pc("Animation", "AnimationStart"), transitionend: pc("Transition", "TransitionEnd") }, ur = {}, cd = {};
  ct && (cd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function vc(n) {
    if (ur[n]) return ur[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in cd) return ur[n] = r[l];
    return n;
  }
  var bv = vc("animationend"), Rv = vc("animationiteration"), Tv = vc("animationstart"), wv = vc("transitionend"), fd = /* @__PURE__ */ new Map(), hc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function _a(n, r) {
    fd.set(n, r), Ve(r, [n]);
  }
  for (var dd = 0; dd < hc.length; dd++) {
    var fu = hc[dd], uy = fu.toLowerCase(), oy = fu[0].toUpperCase() + fu.slice(1);
    _a(uy, "on" + oy);
  }
  _a(bv, "onAnimationEnd"), _a(Rv, "onAnimationIteration"), _a(Tv, "onAnimationStart"), _a("dblclick", "onDoubleClick"), _a("focusin", "onFocus"), _a("focusout", "onBlur"), _a(wv, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), Ve("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ve("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ve("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ve("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ve("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ve("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var rs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), pd = new Set("cancel close invalid load scroll toggle".split(" ").concat(rs));
  function mc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, xe(o, r, void 0, n), n.currentTarget = null;
  }
  function du(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var x = o[m], b = x.instance, A = x.currentTarget;
          if (x = x.listener, b !== d && c.isPropagationStopped()) break e;
          mc(c, x, A), d = b;
        }
        else for (m = 0; m < o.length; m++) {
          if (x = o[m], b = x.instance, A = x.currentTarget, x = x.listener, b !== d && c.isPropagationStopped()) break e;
          mc(c, x, A), d = b;
        }
      }
    }
    if (vi) throw n = E, vi = !1, E = null, n;
  }
  function Yt(n, r) {
    var l = r[us];
    l === void 0 && (l = r[us] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (kv(r, n, 2, !1), l.add(o));
  }
  function yc(n, r, l) {
    var o = 0;
    r && (o |= 4), kv(l, n, o, r);
  }
  var gc = "_reactListening" + Math.random().toString(36).slice(2);
  function oo(n) {
    if (!n[gc]) {
      n[gc] = !0, Ke.forEach(function(l) {
        l !== "selectionchange" && (pd.has(l) || yc(l, !1, n), yc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[gc] || (r[gc] = !0, yc("selectionchange", !1, r));
    }
  }
  function kv(n, r, l, o) {
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
    l = c.bind(null, r, l, n), c = void 0, !_r || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Sc(n, r, l, o, c) {
    var d = o;
    if ((r & 1) === 0 && (r & 2) === 0 && o !== null) e: for (; ; ) {
      if (o === null) return;
      var m = o.tag;
      if (m === 3 || m === 4) {
        var x = o.stateNode.containerInfo;
        if (x === c || x.nodeType === 8 && x.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var b = m.tag;
          if ((b === 3 || b === 4) && (b = m.stateNode.containerInfo, b === c || b.nodeType === 8 && b.parentNode === c)) return;
          m = m.return;
        }
        for (; x !== null; ) {
          if (m = vu(x), m === null) return;
          if (b = m.tag, b === 5 || b === 6) {
            o = d = m;
            continue e;
          }
          x = x.parentNode;
        }
      }
      o = o.return;
    }
    tu(function() {
      var A = d, X = Gt(l), Z = [];
      e: {
        var q = fd.get(n);
        if (q !== void 0) {
          var me = Ct, Ce = n;
          switch (n) {
            case "keypress":
              if (H(l) === 0) break e;
            case "keydown":
            case "keyup":
              me = td;
              break;
            case "focusin":
              Ce = "focus", me = ou;
              break;
            case "focusout":
              Ce = "blur", me = ou;
              break;
            case "beforeblur":
            case "afterblur":
              me = ou;
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
              me = El;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              me = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              me = ov;
              break;
            case bv:
            case Rv:
            case Tv:
              me = oc;
              break;
            case wv:
              me = Yi;
              break;
            case "scroll":
              me = un;
              break;
            case "wheel":
              me = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              me = av;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              me = uv;
          }
          var Re = (r & 4) !== 0, Dn = !Re && n === "scroll", O = Re ? q !== null ? q + "Capture" : null : q;
          Re = [];
          for (var w = A, M; w !== null; ) {
            M = w;
            var K = M.stateNode;
            if (M.tag === 5 && K !== null && (M = K, O !== null && (K = kr(w, O), K != null && Re.push(so(w, K, M)))), Dn) break;
            w = w.return;
          }
          0 < Re.length && (q = new me(q, Ce, null, l, X), Z.push({ event: q, listeners: Re }));
        }
      }
      if ((r & 7) === 0) {
        e: {
          if (q = n === "mouseover" || n === "pointerover", me = n === "mouseout" || n === "pointerout", q && l !== an && (Ce = l.relatedTarget || l.fromElement) && (vu(Ce) || Ce[Qi])) break e;
          if ((me || q) && (q = X.window === X ? X : (q = X.ownerDocument) ? q.defaultView || q.parentWindow : window, me ? (Ce = l.relatedTarget || l.toElement, me = A, Ce = Ce ? vu(Ce) : null, Ce !== null && (Dn = rt(Ce), Ce !== Dn || Ce.tag !== 5 && Ce.tag !== 6) && (Ce = null)) : (me = null, Ce = A), me !== Ce)) {
            if (Re = El, K = "onMouseLeave", O = "onMouseEnter", w = "mouse", (n === "pointerout" || n === "pointerover") && (Re = uv, K = "onPointerLeave", O = "onPointerEnter", w = "pointer"), Dn = me == null ? q : ni(me), M = Ce == null ? q : ni(Ce), q = new Re(K, w + "leave", me, l, X), q.target = Dn, q.relatedTarget = M, K = null, vu(X) === A && (Re = new Re(O, w + "enter", Ce, l, X), Re.target = M, Re.relatedTarget = Dn, K = Re), Dn = K, me && Ce) t: {
              for (Re = me, O = Ce, w = 0, M = Re; M; M = Rl(M)) w++;
              for (M = 0, K = O; K; K = Rl(K)) M++;
              for (; 0 < w - M; ) Re = Rl(Re), w--;
              for (; 0 < M - w; ) O = Rl(O), M--;
              for (; w--; ) {
                if (Re === O || O !== null && Re === O.alternate) break t;
                Re = Rl(Re), O = Rl(O);
              }
              Re = null;
            }
            else Re = null;
            me !== null && _v(Z, q, me, Re, !1), Ce !== null && Dn !== null && _v(Z, Dn, Ce, Re, !0);
          }
        }
        e: {
          if (q = A ? ni(A) : window, me = q.nodeName && q.nodeName.toLowerCase(), me === "select" || me === "input" && q.type === "file") var Ee = ny;
          else if (vv(q)) if (mv) Ee = Cv;
          else {
            Ee = xv;
            var Fe = ry;
          }
          else (me = q.nodeName) && me.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (Ee = ay);
          if (Ee && (Ee = Ee(n, A))) {
            ad(Z, Ee, l, X);
            break e;
          }
          Fe && Fe(n, q, A), n === "focusout" && (Fe = q._wrapperState) && Fe.controlled && q.type === "number" && sa(q, "number", q.value);
        }
        switch (Fe = A ? ni(A) : window, n) {
          case "focusin":
            (vv(Fe) || Fe.contentEditable === "true") && (uo = Fe, ud = A, ns = null);
            break;
          case "focusout":
            ns = ud = uo = null;
            break;
          case "mousedown":
            od = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            od = !1, sd(Z, l, X);
            break;
          case "selectionchange":
            if (ly) break;
          case "keydown":
          case "keyup":
            sd(Z, l, X);
        }
        var Pe;
        if (ao) e: {
          switch (n) {
            case "compositionstart":
              var We = "onCompositionStart";
              break e;
            case "compositionend":
              We = "onCompositionEnd";
              break e;
            case "compositionupdate":
              We = "onCompositionUpdate";
              break e;
          }
          We = void 0;
        }
        else io ? fv(n, l) && (We = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (We = "onCompositionStart");
        We && (sv && l.locale !== "ko" && (io || We !== "onCompositionStart" ? We === "onCompositionEnd" && io && (Pe = z()) : (ei = X, h = "value" in ei ? ei.value : ei.textContent, io = !0)), Fe = as(A, We), 0 < Fe.length && (We = new Zf(We, n, null, l, X), Z.push({ event: We, listeners: Fe }), Pe ? We.data = Pe : (Pe = dv(l), Pe !== null && (We.data = Pe)))), (Pe = Zo ? pv(n, l) : ey(n, l)) && (A = as(A, "onBeforeInput"), 0 < A.length && (X = new Zf("onBeforeInput", "beforeinput", null, l, X), Z.push({ event: X, listeners: A }), X.data = Pe));
      }
      du(Z, r);
    });
  }
  function so(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function as(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = kr(n, l), d != null && o.unshift(so(n, d, c)), d = kr(n, r), d != null && o.push(so(n, d, c))), n = n.return;
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
      var x = l, b = x.alternate, A = x.stateNode;
      if (b !== null && b === o) break;
      x.tag === 5 && A !== null && (x = A, c ? (b = kr(l, d), b != null && m.unshift(so(l, b, x))) : c || (b = kr(l, d), b != null && m.push(so(l, b, x)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var Dv = /\r\n?/g, sy = /\u0000|\uFFFD/g;
  function Ov(n) {
    return (typeof n == "string" ? n : "" + n).replace(Dv, `
`).replace(sy, "");
  }
  function xc(n, r, l) {
    if (r = Ov(r), Ov(n) !== r && l) throw Error(D(425));
  }
  function Tl() {
  }
  var is = null, pu = null;
  function Cc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Ec = typeof setTimeout == "function" ? setTimeout : void 0, vd = typeof clearTimeout == "function" ? clearTimeout : void 0, Nv = typeof Promise == "function" ? Promise : void 0, co = typeof queueMicrotask == "function" ? queueMicrotask : typeof Nv < "u" ? function(n) {
    return Nv.resolve(null).then(n).catch(bc);
  } : Ec;
  function bc(n) {
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
          n.removeChild(c), Ja(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Ja(r);
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
  var wl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + wl, ls = "__reactProps$" + wl, Qi = "__reactContainer$" + wl, us = "__reactEvents$" + wl, po = "__reactListeners$" + wl, cy = "__reactHandles$" + wl;
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
  function Le(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(D(33));
  }
  function yn(n) {
    return n[ls] || null;
  }
  var kt = [], Da = -1;
  function Oa(n) {
    return { current: n };
  }
  function on(n) {
    0 > Da || (n.current = kt[Da], kt[Da] = null, Da--);
  }
  function Oe(n, r) {
    Da++, kt[Da] = n.current, n.current = r;
  }
  var Er = {}, Cn = Oa(Er), Qn = Oa(!1), Gr = Er;
  function qr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Er;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function Un(n) {
    return n = n.childContextTypes, n != null;
  }
  function vo() {
    on(Qn), on(Cn);
  }
  function Mv(n, r, l) {
    if (Cn.current !== Er) throw Error(D(168));
    Oe(Cn, r), Oe(Qn, l);
  }
  function os(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(D(108, ot(n) || "Unknown", c));
    return ee({}, l, o);
  }
  function Zn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Er, Gr = Cn.current, Oe(Cn, n), Oe(Qn, Qn.current), !0;
  }
  function Rc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(D(169));
    l ? (n = os(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, on(Qn), on(Cn), Oe(Cn, n)) : on(Qn), Oe(Qn, l);
  }
  var Ei = null, ho = !1, Wi = !1;
  function Tc(n) {
    Ei === null ? Ei = [n] : Ei.push(n);
  }
  function kl(n) {
    ho = !0, Tc(n);
  }
  function bi() {
    if (!Wi && Ei !== null) {
      Wi = !0;
      var n = 0, r = zt;
      try {
        var l = Ei;
        for (zt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ei = null, ho = !1;
      } catch (c) {
        throw Ei !== null && (Ei = Ei.slice(n + 1)), cn(Xa, bi), c;
      } finally {
        zt = r, Wi = !1;
      }
    }
    return null;
  }
  var _l = [], Dl = 0, Ol = null, Gi = 0, zn = [], Na = 0, pa = null, Ri = 1, Ti = "";
  function hu(n, r) {
    _l[Dl++] = Gi, _l[Dl++] = Ol, Ol = n, Gi = r;
  }
  function Uv(n, r, l) {
    zn[Na++] = Ri, zn[Na++] = Ti, zn[Na++] = pa, pa = n;
    var o = Ri;
    n = Ti;
    var c = 32 - Dr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Dr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, Ri = 1 << 32 - Dr(r) + c | l << c | o, Ti = d + n;
    } else Ri = 1 << d | l << c | o, Ti = n;
  }
  function wc(n) {
    n.return !== null && (hu(n, 1), Uv(n, 1, 0));
  }
  function kc(n) {
    for (; n === Ol; ) Ol = _l[--Dl], _l[Dl] = null, Gi = _l[--Dl], _l[Dl] = null;
    for (; n === pa; ) pa = zn[--Na], zn[Na] = null, Ti = zn[--Na], zn[Na] = null, Ri = zn[--Na], zn[Na] = null;
  }
  var Xr = null, Kr = null, pn = !1, La = null;
  function hd(n, r) {
    var l = ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function zv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Xr = n, Kr = xi(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Xr = n, Kr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: Ri, overflow: Ti } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = ja(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Xr = n, Kr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function md(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function yd(n) {
    if (pn) {
      var r = Kr;
      if (r) {
        var l = r;
        if (!zv(n, r)) {
          if (md(n)) throw Error(D(418));
          r = xi(l.nextSibling);
          var o = Xr;
          r && zv(n, r) ? hd(o, l) : (n.flags = n.flags & -4097 | 2, pn = !1, Xr = n);
        }
      } else {
        if (md(n)) throw Error(D(418));
        n.flags = n.flags & -4097 | 2, pn = !1, Xr = n;
      }
    }
  }
  function Wn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Xr = n;
  }
  function _c(n) {
    if (n !== Xr) return !1;
    if (!pn) return Wn(n), pn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Cc(n.type, n.memoizedProps)), r && (r = Kr)) {
      if (md(n)) throw ss(), Error(D(418));
      for (; r; ) hd(n, r), r = xi(r.nextSibling);
    }
    if (Wn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(D(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Kr = xi(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Kr = null;
      }
    } else Kr = Xr ? xi(n.stateNode.nextSibling) : null;
    return !0;
  }
  function ss() {
    for (var n = Kr; n; ) n = xi(n.nextSibling);
  }
  function Nl() {
    Kr = Xr = null, pn = !1;
  }
  function qi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var fy = ut.ReactCurrentBatchConfig;
  function mu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(D(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(D(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var x = c.refs;
          m === null ? delete x[d] : x[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(D(284));
      if (!l._owner) throw Error(D(290, n));
    }
    return n;
  }
  function Dc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(D(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Av(n) {
    var r = n._init;
    return r(n._payload);
  }
  function yu(n) {
    function r(O, w) {
      if (n) {
        var M = O.deletions;
        M === null ? (O.deletions = [w], O.flags |= 16) : M.push(w);
      }
    }
    function l(O, w) {
      if (!n) return null;
      for (; w !== null; ) r(O, w), w = w.sibling;
      return null;
    }
    function o(O, w) {
      for (O = /* @__PURE__ */ new Map(); w !== null; ) w.key !== null ? O.set(w.key, w) : O.set(w.index, w), w = w.sibling;
      return O;
    }
    function c(O, w) {
      return O = Hl(O, w), O.index = 0, O.sibling = null, O;
    }
    function d(O, w, M) {
      return O.index = M, n ? (M = O.alternate, M !== null ? (M = M.index, M < w ? (O.flags |= 2, w) : M) : (O.flags |= 2, w)) : (O.flags |= 1048576, w);
    }
    function m(O) {
      return n && O.alternate === null && (O.flags |= 2), O;
    }
    function x(O, w, M, K) {
      return w === null || w.tag !== 6 ? (w = Gd(M, O.mode, K), w.return = O, w) : (w = c(w, M), w.return = O, w);
    }
    function b(O, w, M, K) {
      var Ee = M.type;
      return Ee === Ne ? X(O, w, M.props.children, K, M.key) : w !== null && (w.elementType === Ee || typeof Ee == "object" && Ee !== null && Ee.$$typeof === re && Av(Ee) === w.type) ? (K = c(w, M.props), K.ref = mu(O, w, M), K.return = O, K) : (K = Hs(M.type, M.key, M.props, null, O.mode, K), K.ref = mu(O, w, M), K.return = O, K);
    }
    function A(O, w, M, K) {
      return w === null || w.tag !== 4 || w.stateNode.containerInfo !== M.containerInfo || w.stateNode.implementation !== M.implementation ? (w = sf(M, O.mode, K), w.return = O, w) : (w = c(w, M.children || []), w.return = O, w);
    }
    function X(O, w, M, K, Ee) {
      return w === null || w.tag !== 7 ? (w = tl(M, O.mode, K, Ee), w.return = O, w) : (w = c(w, M), w.return = O, w);
    }
    function Z(O, w, M) {
      if (typeof w == "string" && w !== "" || typeof w == "number") return w = Gd("" + w, O.mode, M), w.return = O, w;
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case we:
            return M = Hs(w.type, w.key, w.props, null, O.mode, M), M.ref = mu(O, null, w), M.return = O, M;
          case nt:
            return w = sf(w, O.mode, M), w.return = O, w;
          case re:
            var K = w._init;
            return Z(O, K(w._payload), M);
        }
        if (Xn(w) || ce(w)) return w = tl(w, O.mode, M, null), w.return = O, w;
        Dc(O, w);
      }
      return null;
    }
    function q(O, w, M, K) {
      var Ee = w !== null ? w.key : null;
      if (typeof M == "string" && M !== "" || typeof M == "number") return Ee !== null ? null : x(O, w, "" + M, K);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case we:
            return M.key === Ee ? b(O, w, M, K) : null;
          case nt:
            return M.key === Ee ? A(O, w, M, K) : null;
          case re:
            return Ee = M._init, q(
              O,
              w,
              Ee(M._payload),
              K
            );
        }
        if (Xn(M) || ce(M)) return Ee !== null ? null : X(O, w, M, K, null);
        Dc(O, M);
      }
      return null;
    }
    function me(O, w, M, K, Ee) {
      if (typeof K == "string" && K !== "" || typeof K == "number") return O = O.get(M) || null, x(w, O, "" + K, Ee);
      if (typeof K == "object" && K !== null) {
        switch (K.$$typeof) {
          case we:
            return O = O.get(K.key === null ? M : K.key) || null, b(w, O, K, Ee);
          case nt:
            return O = O.get(K.key === null ? M : K.key) || null, A(w, O, K, Ee);
          case re:
            var Fe = K._init;
            return me(O, w, M, Fe(K._payload), Ee);
        }
        if (Xn(K) || ce(K)) return O = O.get(M) || null, X(w, O, K, Ee, null);
        Dc(w, K);
      }
      return null;
    }
    function Ce(O, w, M, K) {
      for (var Ee = null, Fe = null, Pe = w, We = w = 0, tr = null; Pe !== null && We < M.length; We++) {
        Pe.index > We ? (tr = Pe, Pe = null) : tr = Pe.sibling;
        var Ft = q(O, Pe, M[We], K);
        if (Ft === null) {
          Pe === null && (Pe = tr);
          break;
        }
        n && Pe && Ft.alternate === null && r(O, Pe), w = d(Ft, w, We), Fe === null ? Ee = Ft : Fe.sibling = Ft, Fe = Ft, Pe = tr;
      }
      if (We === M.length) return l(O, Pe), pn && hu(O, We), Ee;
      if (Pe === null) {
        for (; We < M.length; We++) Pe = Z(O, M[We], K), Pe !== null && (w = d(Pe, w, We), Fe === null ? Ee = Pe : Fe.sibling = Pe, Fe = Pe);
        return pn && hu(O, We), Ee;
      }
      for (Pe = o(O, Pe); We < M.length; We++) tr = me(Pe, O, We, M[We], K), tr !== null && (n && tr.alternate !== null && Pe.delete(tr.key === null ? We : tr.key), w = d(tr, w, We), Fe === null ? Ee = tr : Fe.sibling = tr, Fe = tr);
      return n && Pe.forEach(function(Bl) {
        return r(O, Bl);
      }), pn && hu(O, We), Ee;
    }
    function Re(O, w, M, K) {
      var Ee = ce(M);
      if (typeof Ee != "function") throw Error(D(150));
      if (M = Ee.call(M), M == null) throw Error(D(151));
      for (var Fe = Ee = null, Pe = w, We = w = 0, tr = null, Ft = M.next(); Pe !== null && !Ft.done; We++, Ft = M.next()) {
        Pe.index > We ? (tr = Pe, Pe = null) : tr = Pe.sibling;
        var Bl = q(O, Pe, Ft.value, K);
        if (Bl === null) {
          Pe === null && (Pe = tr);
          break;
        }
        n && Pe && Bl.alternate === null && r(O, Pe), w = d(Bl, w, We), Fe === null ? Ee = Bl : Fe.sibling = Bl, Fe = Bl, Pe = tr;
      }
      if (Ft.done) return l(
        O,
        Pe
      ), pn && hu(O, We), Ee;
      if (Pe === null) {
        for (; !Ft.done; We++, Ft = M.next()) Ft = Z(O, Ft.value, K), Ft !== null && (w = d(Ft, w, We), Fe === null ? Ee = Ft : Fe.sibling = Ft, Fe = Ft);
        return pn && hu(O, We), Ee;
      }
      for (Pe = o(O, Pe); !Ft.done; We++, Ft = M.next()) Ft = me(Pe, O, We, Ft.value, K), Ft !== null && (n && Ft.alternate !== null && Pe.delete(Ft.key === null ? We : Ft.key), w = d(Ft, w, We), Fe === null ? Ee = Ft : Fe.sibling = Ft, Fe = Ft);
      return n && Pe.forEach(function(gh) {
        return r(O, gh);
      }), pn && hu(O, We), Ee;
    }
    function Dn(O, w, M, K) {
      if (typeof M == "object" && M !== null && M.type === Ne && M.key === null && (M = M.props.children), typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case we:
            e: {
              for (var Ee = M.key, Fe = w; Fe !== null; ) {
                if (Fe.key === Ee) {
                  if (Ee = M.type, Ee === Ne) {
                    if (Fe.tag === 7) {
                      l(O, Fe.sibling), w = c(Fe, M.props.children), w.return = O, O = w;
                      break e;
                    }
                  } else if (Fe.elementType === Ee || typeof Ee == "object" && Ee !== null && Ee.$$typeof === re && Av(Ee) === Fe.type) {
                    l(O, Fe.sibling), w = c(Fe, M.props), w.ref = mu(O, Fe, M), w.return = O, O = w;
                    break e;
                  }
                  l(O, Fe);
                  break;
                } else r(O, Fe);
                Fe = Fe.sibling;
              }
              M.type === Ne ? (w = tl(M.props.children, O.mode, K, M.key), w.return = O, O = w) : (K = Hs(M.type, M.key, M.props, null, O.mode, K), K.ref = mu(O, w, M), K.return = O, O = K);
            }
            return m(O);
          case nt:
            e: {
              for (Fe = M.key; w !== null; ) {
                if (w.key === Fe) if (w.tag === 4 && w.stateNode.containerInfo === M.containerInfo && w.stateNode.implementation === M.implementation) {
                  l(O, w.sibling), w = c(w, M.children || []), w.return = O, O = w;
                  break e;
                } else {
                  l(O, w);
                  break;
                }
                else r(O, w);
                w = w.sibling;
              }
              w = sf(M, O.mode, K), w.return = O, O = w;
            }
            return m(O);
          case re:
            return Fe = M._init, Dn(O, w, Fe(M._payload), K);
        }
        if (Xn(M)) return Ce(O, w, M, K);
        if (ce(M)) return Re(O, w, M, K);
        Dc(O, M);
      }
      return typeof M == "string" && M !== "" || typeof M == "number" ? (M = "" + M, w !== null && w.tag === 6 ? (l(O, w.sibling), w = c(w, M), w.return = O, O = w) : (l(O, w), w = Gd(M, O.mode, K), w.return = O, O = w), m(O)) : l(O, w);
    }
    return Dn;
  }
  var Tn = yu(!0), pe = yu(!1), va = Oa(null), Zr = null, mo = null, gd = null;
  function Sd() {
    gd = mo = Zr = null;
  }
  function xd(n) {
    var r = va.current;
    on(va), n._currentValue = r;
  }
  function Cd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function gn(n, r) {
    Zr = n, gd = mo = null, n = n.dependencies, n !== null && n.firstContext !== null && ((n.lanes & r) !== 0 && (jn = !0), n.firstContext = null);
  }
  function Ma(n) {
    var r = n._currentValue;
    if (gd !== n) if (n = { context: n, memoizedValue: r, next: null }, mo === null) {
      if (Zr === null) throw Error(D(308));
      mo = n, Zr.dependencies = { lanes: 0, firstContext: n };
    } else mo = mo.next = n;
    return r;
  }
  var gu = null;
  function Ed(n) {
    gu === null ? gu = [n] : gu.push(n);
  }
  function bd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Ed(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ha(n, o);
  }
  function ha(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ma = !1;
  function Rd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function jv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Xi(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, (_t & 2) !== 0) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Ed(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
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
  function cs(n, r, l, o) {
    var c = n.updateQueue;
    ma = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, x = c.shared.pending;
    if (x !== null) {
      c.shared.pending = null;
      var b = x, A = b.next;
      b.next = null, m === null ? d = A : m.next = A, m = b;
      var X = n.alternate;
      X !== null && (X = X.updateQueue, x = X.lastBaseUpdate, x !== m && (x === null ? X.firstBaseUpdate = A : x.next = A, X.lastBaseUpdate = b));
    }
    if (d !== null) {
      var Z = c.baseState;
      m = 0, X = A = b = null, x = d;
      do {
        var q = x.lane, me = x.eventTime;
        if ((o & q) === q) {
          X !== null && (X = X.next = {
            eventTime: me,
            lane: 0,
            tag: x.tag,
            payload: x.payload,
            callback: x.callback,
            next: null
          });
          e: {
            var Ce = n, Re = x;
            switch (q = r, me = l, Re.tag) {
              case 1:
                if (Ce = Re.payload, typeof Ce == "function") {
                  Z = Ce.call(me, Z, q);
                  break e;
                }
                Z = Ce;
                break e;
              case 3:
                Ce.flags = Ce.flags & -65537 | 128;
              case 0:
                if (Ce = Re.payload, q = typeof Ce == "function" ? Ce.call(me, Z, q) : Ce, q == null) break e;
                Z = ee({}, Z, q);
                break e;
              case 2:
                ma = !0;
            }
          }
          x.callback !== null && x.lane !== 0 && (n.flags |= 64, q = c.effects, q === null ? c.effects = [x] : q.push(x));
        } else me = { eventTime: me, lane: q, tag: x.tag, payload: x.payload, callback: x.callback, next: null }, X === null ? (A = X = me, b = Z) : X = X.next = me, m |= q;
        if (x = x.next, x === null) {
          if (x = c.shared.pending, x === null) break;
          q = x, x = q.next, q.next = null, c.lastBaseUpdate = q, c.shared.pending = null;
        }
      } while (!0);
      if (X === null && (b = Z), c.baseState = b, c.firstBaseUpdate = A, c.lastBaseUpdate = X, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = Z;
    }
  }
  function Td(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(D(191, c));
        c.call(o);
      }
    }
  }
  var fs = {}, wi = Oa(fs), ds = Oa(fs), ps = Oa(fs);
  function Su(n) {
    if (n === fs) throw Error(D(174));
    return n;
  }
  function wd(n, r) {
    switch (Oe(ps, r), Oe(ds, n), Oe(wi, fs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    on(wi), Oe(wi, r);
  }
  function xu() {
    on(wi), on(ds), on(ps);
  }
  function Hv(n) {
    Su(ps.current);
    var r = Su(wi.current), l = ca(r, n.type);
    r !== l && (Oe(ds, n), Oe(wi, l));
  }
  function Nc(n) {
    ds.current === n && (on(wi), on(ds));
  }
  var Sn = Oa(0);
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
  var vs = [];
  function Me() {
    for (var n = 0; n < vs.length; n++) vs[n]._workInProgressVersionPrimary = null;
    vs.length = 0;
  }
  var St = ut.ReactCurrentDispatcher, At = ut.ReactCurrentBatchConfig, Jt = 0, jt = null, An = null, Jn = null, Mc = !1, hs = !1, Cu = 0, G = 0;
  function Mt() {
    throw Error(D(321));
  }
  function Ye(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, o, c, d) {
    if (Jt = d, jt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, St.current = n === null || n.memoizedState === null ? Gc : Cs, n = l(o, c), hs) {
      d = 0;
      do {
        if (hs = !1, Cu = 0, 25 <= d) throw Error(D(301));
        d += 1, Jn = An = null, r.updateQueue = null, St.current = qc, n = l(o, c);
      } while (hs);
    }
    if (St.current = wu, r = An !== null && An.next !== null, Jt = 0, Jn = An = jt = null, Mc = !1, r) throw Error(D(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function br() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Jn === null ? jt.memoizedState = Jn = n : Jn = Jn.next = n, Jn;
  }
  function wn() {
    if (An === null) {
      var n = jt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = An.next;
    var r = Jn === null ? jt.memoizedState : Jn.next;
    if (r !== null) Jn = r, An = n;
    else {
      if (n === null) throw Error(D(310));
      An = n, n = { memoizedState: An.memoizedState, baseState: An.baseState, baseQueue: An.baseQueue, queue: An.queue, next: null }, Jn === null ? jt.memoizedState = Jn = n : Jn = Jn.next = n;
    }
    return Jn;
  }
  function Ki(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Ul(n) {
    var r = wn(), l = r.queue;
    if (l === null) throw Error(D(311));
    l.lastRenderedReducer = n;
    var o = An, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var x = m = null, b = null, A = d;
      do {
        var X = A.lane;
        if ((Jt & X) === X) b !== null && (b = b.next = { lane: 0, action: A.action, hasEagerState: A.hasEagerState, eagerState: A.eagerState, next: null }), o = A.hasEagerState ? A.eagerState : n(o, A.action);
        else {
          var Z = {
            lane: X,
            action: A.action,
            hasEagerState: A.hasEagerState,
            eagerState: A.eagerState,
            next: null
          };
          b === null ? (x = b = Z, m = o) : b = b.next = Z, jt.lanes |= X, Oi |= X;
        }
        A = A.next;
      } while (A !== null && A !== d);
      b === null ? m = o : b.next = x, ti(o, r.memoizedState) || (jn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = b, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, jt.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Eu(n) {
    var r = wn(), l = r.queue;
    if (l === null) throw Error(D(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ti(d, r.memoizedState) || (jn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function Uc() {
  }
  function zc(n, r) {
    var l = jt, o = wn(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, jn = !0), o = o.queue, ms(Fc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Jn !== null && Jn.memoizedState.tag & 1) {
      if (l.flags |= 2048, bu(9, jc.bind(null, l, o, c, r), void 0, null), Gn === null) throw Error(D(349));
      (Jt & 30) !== 0 || Ac(l, r, c);
    }
    return c;
  }
  function Ac(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = jt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, jt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function jc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Hc(r) && Pc(n);
  }
  function Fc(n, r, l) {
    return l(function() {
      Hc(r) && Pc(n);
    });
  }
  function Hc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ti(n, l);
    } catch {
      return !0;
    }
  }
  function Pc(n) {
    var r = ha(n, 1);
    r !== null && zr(r, n, 1, -1);
  }
  function Vc(n) {
    var r = br();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Ki, lastRenderedState: n }, r.queue = n, n = n.dispatch = Tu.bind(null, jt, n), [r.memoizedState, n];
  }
  function bu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = jt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, jt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Bc() {
    return wn().memoizedState;
  }
  function yo(n, r, l, o) {
    var c = br();
    jt.flags |= n, c.memoizedState = bu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function go(n, r, l, o) {
    var c = wn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (An !== null) {
      var m = An.memoizedState;
      if (d = m.destroy, o !== null && Ye(o, m.deps)) {
        c.memoizedState = bu(r, l, d, o);
        return;
      }
    }
    jt.flags |= n, c.memoizedState = bu(1 | r, l, d, o);
  }
  function Ic(n, r) {
    return yo(8390656, 8, n, r);
  }
  function ms(n, r) {
    return go(2048, 8, n, r);
  }
  function Yc(n, r) {
    return go(4, 2, n, r);
  }
  function ys(n, r) {
    return go(4, 4, n, r);
  }
  function Ru(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function $c(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(4, 4, Ru.bind(null, r, n), l);
  }
  function gs() {
  }
  function Qc(n, r) {
    var l = wn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Ye(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Wc(n, r) {
    var l = wn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && Ye(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function kd(n, r, l) {
    return (Jt & 21) === 0 ? (n.baseState && (n.baseState = !1, jn = !0), n.memoizedState = l) : (ti(l, r) || (l = Xu(), jt.lanes |= l, Oi |= l, n.baseState = !0), r);
  }
  function Ss(n, r) {
    var l = zt;
    zt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = At.transition;
    At.transition = {};
    try {
      n(!1), r();
    } finally {
      zt = l, At.transition = o;
    }
  }
  function _d() {
    return wn().memoizedState;
  }
  function xs(n, r, l) {
    var o = Ni(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Jr(n)) Pv(r, l);
    else if (l = bd(n, r, l, o), l !== null) {
      var c = Pn();
      zr(l, n, o, c), nn(l, r, o);
    }
  }
  function Tu(n, r, l) {
    var o = Ni(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Jr(n)) Pv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, x = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = x, ti(x, m)) {
          var b = r.interleaved;
          b === null ? (c.next = c, Ed(r)) : (c.next = b.next, b.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = bd(n, r, c, o), l !== null && (c = Pn(), zr(l, n, o, c), nn(l, r, o));
    }
  }
  function Jr(n) {
    var r = n.alternate;
    return n === jt || r !== null && r === jt;
  }
  function Pv(n, r) {
    hs = Mc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function nn(n, r, l) {
    if ((l & 4194240) !== 0) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var wu = { readContext: Ma, useCallback: Mt, useContext: Mt, useEffect: Mt, useImperativeHandle: Mt, useInsertionEffect: Mt, useLayoutEffect: Mt, useMemo: Mt, useReducer: Mt, useRef: Mt, useState: Mt, useDebugValue: Mt, useDeferredValue: Mt, useTransition: Mt, useMutableSource: Mt, useSyncExternalStore: Mt, useId: Mt, unstable_isNewReconciler: !1 }, Gc = { readContext: Ma, useCallback: function(n, r) {
    return br().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ma, useEffect: Ic, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, yo(
      4194308,
      4,
      Ru.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return yo(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return yo(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = br();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = br();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = xs.bind(null, jt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = br();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Vc, useDebugValue: gs, useDeferredValue: function(n) {
    return br().memoizedState = n;
  }, useTransition: function() {
    var n = Vc(!1), r = n[0];
    return n = Ss.bind(null, n[1]), br().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = jt, c = br();
    if (pn) {
      if (l === void 0) throw Error(D(407));
      l = l();
    } else {
      if (l = r(), Gn === null) throw Error(D(349));
      (Jt & 30) !== 0 || Ac(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Ic(Fc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, bu(9, jc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = br(), r = Gn.identifierPrefix;
    if (pn) {
      var l = Ti, o = Ri;
      l = (o & ~(1 << 32 - Dr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = G++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Cs = {
    readContext: Ma,
    useCallback: Qc,
    useContext: Ma,
    useEffect: ms,
    useImperativeHandle: $c,
    useInsertionEffect: Yc,
    useLayoutEffect: ys,
    useMemo: Wc,
    useReducer: Ul,
    useRef: Bc,
    useState: function() {
      return Ul(Ki);
    },
    useDebugValue: gs,
    useDeferredValue: function(n) {
      var r = wn();
      return kd(r, An.memoizedState, n);
    },
    useTransition: function() {
      var n = Ul(Ki)[0], r = wn().memoizedState;
      return [n, r];
    },
    useMutableSource: Uc,
    useSyncExternalStore: zc,
    useId: _d,
    unstable_isNewReconciler: !1
  }, qc = { readContext: Ma, useCallback: Qc, useContext: Ma, useEffect: ms, useImperativeHandle: $c, useInsertionEffect: Yc, useLayoutEffect: ys, useMemo: Wc, useReducer: Eu, useRef: Bc, useState: function() {
    return Eu(Ki);
  }, useDebugValue: gs, useDeferredValue: function(n) {
    var r = wn();
    return An === null ? r.memoizedState = n : kd(r, An.memoizedState, n);
  }, useTransition: function() {
    var n = Eu(Ki)[0], r = wn().memoizedState;
    return [n, r];
  }, useMutableSource: Uc, useSyncExternalStore: zc, useId: _d, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = ee({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Dd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : ee({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Xc = { isMounted: function(n) {
    return (n = n._reactInternals) ? rt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Ni(n), d = Xi(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Oc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Ni(n), d = Xi(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Oc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Pn(), o = Ni(n), c = Xi(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (zr(r, n, o, l), Oc(r, n, o));
  } };
  function Vv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !es(l, o) || !es(c, d) : !0;
  }
  function Kc(n, r, l) {
    var o = !1, c = Er, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ma(d) : (c = Un(r) ? Gr : Cn.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : Er), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Xc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Bv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Xc.enqueueReplaceState(r, r.state, null);
  }
  function Es(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, Rd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ma(d) : (d = Un(r) ? Gr : Cn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Dd(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Xc.enqueueReplaceState(c, c.state, null), cs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function ku(n, r) {
    try {
      var l = "", o = r;
      do
        l += mt(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Od(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Nd(n, r) {
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
    l = Xi(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      Ro || (Ro = !0, Ou = o), Nd(n, r);
    }, l;
  }
  function Ld(n, r, l) {
    l = Xi(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Nd(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Nd(n, r), typeof o != "function" && (jl === null ? jl = /* @__PURE__ */ new Set([this]) : jl.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Md(n, r, l) {
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
  function zl(n, r, l, o, c) {
    return (n.mode & 1) === 0 ? (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Xi(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n) : (n.flags |= 65536, n.lanes = c, n);
  }
  var bs = ut.ReactCurrentOwner, jn = !1;
  function or(n, r, l, o) {
    r.child = n === null ? pe(r, null, l, o) : Tn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return gn(r, c), o = Ml(n, r, l, o, d, c), l = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (pn && l && wc(r), r.flags |= 1, or(n, r, o, c), r.child);
  }
  function _u(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Wd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, it(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, (n.lanes & c) === 0) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : es, l(m, o) && n.ref === r.ref) return za(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function it(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (es(d, o) && n.ref === r.ref) if (jn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) (n.flags & 131072) !== 0 && (jn = !0);
      else return r.lanes = n.lanes, za(n, r, c);
    }
    return $v(n, r, l, o, c);
  }
  function Rs(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if ((r.mode & 1) === 0) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Oe(Co, ya), ya |= l;
    else {
      if ((l & 1073741824) === 0) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Oe(Co, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, Oe(Co, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, Oe(Co, ya), ya |= o;
    return or(n, r, c, l), r.child;
  }
  function Ud(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function $v(n, r, l, o, c) {
    var d = Un(l) ? Gr : Cn.current;
    return d = qr(r, d), gn(r, c), l = Ml(n, r, l, o, d, c), o = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (pn && o && wc(r), r.flags |= 1, or(n, r, l, c), r.child);
  }
  function Qv(n, r, l, o, c) {
    if (Un(l)) {
      var d = !0;
      Zn(r);
    } else d = !1;
    if (gn(r, c), r.stateNode === null) Ua(n, r), Kc(r, l, o), Es(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, x = r.memoizedProps;
      m.props = x;
      var b = m.context, A = l.contextType;
      typeof A == "object" && A !== null ? A = Ma(A) : (A = Un(l) ? Gr : Cn.current, A = qr(r, A));
      var X = l.getDerivedStateFromProps, Z = typeof X == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      Z || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (x !== o || b !== A) && Bv(r, m, o, A), ma = !1;
      var q = r.memoizedState;
      m.state = q, cs(r, o, m, c), b = r.memoizedState, x !== o || q !== b || Qn.current || ma ? (typeof X == "function" && (Dd(r, l, X, o), b = r.memoizedState), (x = ma || Vv(r, l, x, o, q, b, A)) ? (Z || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = b), m.props = o, m.state = b, m.context = A, o = x) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, jv(n, r), x = r.memoizedProps, A = r.type === r.elementType ? x : ai(r.type, x), m.props = A, Z = r.pendingProps, q = m.context, b = l.contextType, typeof b == "object" && b !== null ? b = Ma(b) : (b = Un(l) ? Gr : Cn.current, b = qr(r, b));
      var me = l.getDerivedStateFromProps;
      (X = typeof me == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (x !== Z || q !== b) && Bv(r, m, o, b), ma = !1, q = r.memoizedState, m.state = q, cs(r, o, m, c);
      var Ce = r.memoizedState;
      x !== Z || q !== Ce || Qn.current || ma ? (typeof me == "function" && (Dd(r, l, me, o), Ce = r.memoizedState), (A = ma || Vv(r, l, A, o, q, Ce, b) || !1) ? (X || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, Ce, b), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, Ce, b)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Ce), m.props = o, m.state = Ce, m.context = b, o = A) : (typeof m.componentDidUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || x === n.memoizedProps && q === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return Ts(n, r, l, o, d, c);
  }
  function Ts(n, r, l, o, c, d) {
    Ud(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && Rc(r, l, !1), za(n, r, d);
    o = r.stateNode, bs.current = r;
    var x = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = Tn(r, n.child, null, d), r.child = Tn(r, null, x, d)) : or(n, r, x, d), r.memoizedState = o.state, c && Rc(r, l, !0), r.child;
  }
  function So(n) {
    var r = n.stateNode;
    r.pendingContext ? Mv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Mv(n, r.context, !1), wd(n, r.containerInfo);
  }
  function Wv(n, r, l, o, c) {
    return Nl(), qi(c), r.flags |= 256, or(n, r, l, o), r.child;
  }
  var Jc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function zd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function ef(n, r, l) {
    var o = r.pendingProps, c = Sn.current, d = !1, m = (r.flags & 128) !== 0, x;
    if ((x = m) || (x = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), x ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Oe(Sn, c & 1), n === null)
      return yd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? ((r.mode & 1) === 0 ? r.lanes = 1 : n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, (o & 1) === 0 && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Pl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = zd(l), r.memoizedState = Jc, n) : Ad(r, m));
    if (c = n.memoizedState, c !== null && (x = c.dehydrated, x !== null)) return Gv(n, r, m, o, x, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, x = c.sibling;
      var b = { mode: "hidden", children: o.children };
      return (m & 1) === 0 && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = b, r.deletions = null) : (o = Hl(c, b), o.subtreeFlags = c.subtreeFlags & 14680064), x !== null ? d = Hl(x, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? zd(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = Jc, o;
    }
    return d = n.child, n = d.sibling, o = Hl(d, { mode: "visible", children: o.children }), (r.mode & 1) === 0 && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Ad(n, r) {
    return r = Pl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ws(n, r, l, o) {
    return o !== null && qi(o), Tn(r, n.child, null, l), n = Ad(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Gv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Od(Error(D(422))), ws(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Pl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, (r.mode & 1) !== 0 && Tn(r, n.child, null, m), r.child.memoizedState = zd(m), r.memoizedState = Jc, d);
    if ((r.mode & 1) === 0) return ws(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var x = o.dgst;
      return o = x, d = Error(D(419)), o = Od(d, o, void 0), ws(n, r, m, o);
    }
    if (x = (m & n.childLanes) !== 0, jn || x) {
      if (o = Gn, o !== null) {
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
      return Qd(), o = Od(Error(D(421))), ws(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Sy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Kr = xi(c.nextSibling), Xr = r, pn = !0, La = null, n !== null && (zn[Na++] = Ri, zn[Na++] = Ti, zn[Na++] = pa, Ri = n.id, Ti = n.overflow, pa = r), r = Ad(r, o.children), r.flags |= 4096, r);
  }
  function jd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Cd(n.return, r, l);
  }
  function Lr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function ki(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (or(n, r, o.children, l), o = Sn.current, (o & 2) !== 0) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && (n.flags & 128) !== 0) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && jd(n, l, r);
        else if (n.tag === 19) jd(n, l, r);
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
    if (Oe(Sn, o), (r.mode & 1) === 0) r.memoizedState = null;
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
  function Ua(n, r) {
    (r.mode & 1) === 0 && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function za(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, (l & r.childLanes) === 0) return null;
    if (n !== null && r.child !== n.child) throw Error(D(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function ks(n, r, l) {
    switch (r.tag) {
      case 3:
        So(r), Nl();
        break;
      case 5:
        Hv(r);
        break;
      case 1:
        Un(r.type) && Zn(r);
        break;
      case 4:
        wd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Oe(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Oe(Sn, Sn.current & 1), r.flags |= 128, null) : (l & r.child.childLanes) !== 0 ? ef(n, r, l) : (Oe(Sn, Sn.current & 1), n = za(n, r, l), n !== null ? n.sibling : null);
        Oe(Sn, Sn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, (n.flags & 128) !== 0) {
          if (o) return ki(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Oe(Sn, Sn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Rs(n, r, l);
    }
    return za(n, r, l);
  }
  var Aa, Fn, qv, Xv;
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
  }, Fn = function() {
  }, qv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, Su(wi.current);
      var d = null;
      switch (l) {
        case "input":
          c = rr(n, c), o = rr(n, o), d = [];
          break;
        case "select":
          c = ee({}, c, { value: void 0 }), o = ee({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Yn(n, c), o = Yn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = Tl);
      }
      sn(l, o);
      var m;
      l = null;
      for (A in c) if (!o.hasOwnProperty(A) && c.hasOwnProperty(A) && c[A] != null) if (A === "style") {
        var x = c[A];
        for (m in x) x.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else A !== "dangerouslySetInnerHTML" && A !== "children" && A !== "suppressContentEditableWarning" && A !== "suppressHydrationWarning" && A !== "autoFocus" && (Ie.hasOwnProperty(A) ? d || (d = []) : (d = d || []).push(A, null));
      for (A in o) {
        var b = o[A];
        if (x = c != null ? c[A] : void 0, o.hasOwnProperty(A) && b !== x && (b != null || x != null)) if (A === "style") if (x) {
          for (m in x) !x.hasOwnProperty(m) || b && b.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in b) b.hasOwnProperty(m) && x[m] !== b[m] && (l || (l = {}), l[m] = b[m]);
        } else l || (d || (d = []), d.push(
          A,
          l
        )), l = b;
        else A === "dangerouslySetInnerHTML" ? (b = b ? b.__html : void 0, x = x ? x.__html : void 0, b != null && x !== b && (d = d || []).push(A, b)) : A === "children" ? typeof b != "string" && typeof b != "number" || (d = d || []).push(A, "" + b) : A !== "suppressContentEditableWarning" && A !== "suppressHydrationWarning" && (Ie.hasOwnProperty(A) ? (b != null && A === "onScroll" && Yt("scroll", n), d || x === b || (d = [])) : (d = d || []).push(A, b));
      }
      l && (d = d || []).push("style", l);
      var A = d;
      (r.updateQueue = A) && (r.flags |= 4);
    }
  }, Xv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function _s(n, r) {
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
  function er(n) {
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
        return er(r), null;
      case 1:
        return Un(r.type) && vo(), er(r), null;
      case 3:
        return o = r.stateNode, xu(), on(Qn), on(Cn), Me(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (_c(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && (r.flags & 256) === 0 || (r.flags |= 1024, La !== null && (Nu(La), La = null))), Fn(n, r), er(r), null;
      case 5:
        Nc(r);
        var c = Su(ps.current);
        if (l = r.type, n !== null && r.stateNode != null) qv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(D(166));
            return er(r), null;
          }
          if (n = Su(wi.current), _c(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ci] = r, o[ls] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Yt("cancel", o), Yt("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Yt("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < rs.length; c++) Yt(rs[c], o);
                break;
              case "source":
                Yt("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Yt(
                  "error",
                  o
                ), Yt("load", o);
                break;
              case "details":
                Yt("toggle", o);
                break;
              case "input":
                Bn(o, d), Yt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Yt("invalid", o);
                break;
              case "textarea":
                Sr(o, d), Yt("invalid", o);
            }
            sn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var x = d[m];
              m === "children" ? typeof x == "string" ? o.textContent !== x && (d.suppressHydrationWarning !== !0 && xc(o.textContent, x, n), c = ["children", x]) : typeof x == "number" && o.textContent !== "" + x && (d.suppressHydrationWarning !== !0 && xc(
                o.textContent,
                x,
                n
              ), c = ["children", "" + x]) : Ie.hasOwnProperty(m) && x != null && m === "onScroll" && Yt("scroll", o);
            }
            switch (l) {
              case "input":
                Nn(o), ci(o, d, !0);
                break;
              case "textarea":
                Nn(o), Ln(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = Tl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = xr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ci] = r, n[ls] = o, Aa(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Kn(l, o), l) {
                case "dialog":
                  Yt("cancel", n), Yt("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Yt("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < rs.length; c++) Yt(rs[c], n);
                  c = o;
                  break;
                case "source":
                  Yt("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Yt(
                    "error",
                    n
                  ), Yt("load", n), c = o;
                  break;
                case "details":
                  Yt("toggle", n), c = o;
                  break;
                case "input":
                  Bn(n, o), c = rr(n, o), Yt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = ee({}, o, { value: void 0 }), Yt("invalid", n);
                  break;
                case "textarea":
                  Sr(n, o), c = Yn(n, o), Yt("invalid", n);
                  break;
                default:
                  c = o;
              }
              sn(l, c), x = c;
              for (d in x) if (x.hasOwnProperty(d)) {
                var b = x[d];
                d === "style" ? rn(n, b) : d === "dangerouslySetInnerHTML" ? (b = b ? b.__html : void 0, b != null && fi(n, b)) : d === "children" ? typeof b == "string" ? (l !== "textarea" || b !== "") && ie(n, b) : typeof b == "number" && ie(n, "" + b) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (Ie.hasOwnProperty(d) ? b != null && d === "onScroll" && Yt("scroll", n) : b != null && ze(n, d, b, m));
              }
              switch (l) {
                case "input":
                  Nn(n), ci(n, o, !1);
                  break;
                case "textarea":
                  Nn(n), Ln(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + dt(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? bn(n, !!o.multiple, d, !1) : o.defaultValue != null && bn(
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
        return er(r), null;
      case 6:
        if (n && r.stateNode != null) Xv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(D(166));
          if (l = Su(ps.current), Su(wi.current), _c(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ci] = r, (d = o.nodeValue !== l) && (n = Xr, n !== null)) switch (n.tag) {
              case 3:
                xc(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && xc(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ci] = r, r.stateNode = o;
        }
        return er(r), null;
      case 13:
        if (on(Sn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (pn && Kr !== null && (r.mode & 1) !== 0 && (r.flags & 128) === 0) ss(), Nl(), r.flags |= 98560, d = !1;
          else if (d = _c(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(D(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(D(317));
              d[Ci] = r;
            } else Nl(), (r.flags & 128) === 0 && (r.memoizedState = null), r.flags |= 4;
            er(r), d = !1;
          } else La !== null && (Nu(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return (r.flags & 128) !== 0 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, (r.mode & 1) !== 0 && (n === null || (Sn.current & 1) !== 0 ? _n === 0 && (_n = 3) : Qd())), r.updateQueue !== null && (r.flags |= 4), er(r), null);
      case 4:
        return xu(), Fn(n, r), n === null && oo(r.stateNode.containerInfo), er(r), null;
      case 10:
        return xd(r.type._context), er(r), null;
      case 17:
        return Un(r.type) && vo(), er(r), null;
      case 19:
        if (on(Sn), d = r.memoizedState, d === null) return er(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) _s(d, !1);
        else {
          if (_n !== 0 || n !== null && (n.flags & 128) !== 0) for (n = r.child; n !== null; ) {
            if (m = Lc(n), m !== null) {
              for (r.flags |= 128, _s(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return Oe(Sn, Sn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && at() > bo && (r.flags |= 128, o = !0, _s(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Lc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), _s(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !pn) return er(r), null;
          } else 2 * at() - d.renderingStartTime > bo && l !== 1073741824 && (r.flags |= 128, o = !0, _s(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = at(), r.sibling = null, l = Sn.current, Oe(Sn, o ? l & 1 | 2 : l & 1), r) : (er(r), null);
      case 22:
      case 23:
        return $d(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && (r.mode & 1) !== 0 ? (ya & 1073741824) !== 0 && (er(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : er(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(D(156, r.tag));
  }
  function tf(n, r) {
    switch (kc(r), r.tag) {
      case 1:
        return Un(r.type) && vo(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return xu(), on(Qn), on(Cn), Me(), n = r.flags, (n & 65536) !== 0 && (n & 128) === 0 ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Nc(r), null;
      case 13:
        if (on(Sn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(D(340));
          Nl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return on(Sn), null;
      case 4:
        return xu(), null;
      case 10:
        return xd(r.type._context), null;
      case 22:
      case 23:
        return $d(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ds = !1, Rr = !1, dy = typeof WeakSet == "function" ? WeakSet : Set, Se = null;
  function xo(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      vn(n, r, o);
    }
    else l.current = null;
  }
  function nf(n, r, l) {
    try {
      l();
    } catch (o) {
      vn(n, r, o);
    }
  }
  var Zv = !1;
  function Jv(n, r) {
    if (is = ka, n = ts(), dc(n)) {
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
          var m = 0, x = -1, b = -1, A = 0, X = 0, Z = n, q = null;
          t: for (; ; ) {
            for (var me; Z !== l || c !== 0 && Z.nodeType !== 3 || (x = m + c), Z !== d || o !== 0 && Z.nodeType !== 3 || (b = m + o), Z.nodeType === 3 && (m += Z.nodeValue.length), (me = Z.firstChild) !== null; )
              q = Z, Z = me;
            for (; ; ) {
              if (Z === n) break t;
              if (q === l && ++A === c && (x = m), q === d && ++X === o && (b = m), (me = Z.nextSibling) !== null) break;
              Z = q, q = Z.parentNode;
            }
            Z = me;
          }
          l = x === -1 || b === -1 ? null : { start: x, end: b };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, ka = !1, Se = r; Se !== null; ) if (r = Se, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Se = n;
    else for (; Se !== null; ) {
      r = Se;
      try {
        var Ce = r.alternate;
        if ((r.flags & 1024) !== 0) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ce !== null) {
              var Re = Ce.memoizedProps, Dn = Ce.memoizedState, O = r.stateNode, w = O.getSnapshotBeforeUpdate(r.elementType === r.type ? Re : ai(r.type, Re), Dn);
              O.__reactInternalSnapshotBeforeUpdate = w;
            }
            break;
          case 3:
            var M = r.stateNode.containerInfo;
            M.nodeType === 1 ? M.textContent = "" : M.nodeType === 9 && M.documentElement && M.removeChild(M.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(D(163));
        }
      } catch (K) {
        vn(r, r.return, K);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Se = n;
        break;
      }
      Se = r.return;
    }
    return Ce = Zv, Zv = !1, Ce;
  }
  function Os(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && nf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Ns(n, r) {
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
  function Fd(n) {
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
  function rf(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, rf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[ls], delete r[us], delete r[po], delete r[cy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ls(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Zi(n) {
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
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Tl));
    else if (o !== 4 && (n = n.child, n !== null)) for (_i(n, r, l), n = n.sibling; n !== null; ) _i(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var kn = null, Mr = !1;
  function Ur(n, r, l) {
    for (l = l.child; l !== null; ) eh(n, r, l), l = l.sibling;
  }
  function eh(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function") try {
      Qr.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Rr || xo(l, r);
      case 6:
        var o = kn, c = Mr;
        kn = null, Ur(n, r, l), kn = o, Mr = c, kn !== null && (Mr ? (n = kn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : kn.removeChild(l.stateNode));
        break;
      case 18:
        kn !== null && (Mr ? (n = kn, l = l.stateNode, n.nodeType === 8 ? fo(n.parentNode, l) : n.nodeType === 1 && fo(n, l), Ja(n)) : fo(kn, l.stateNode));
        break;
      case 4:
        o = kn, c = Mr, kn = l.stateNode.containerInfo, Mr = !0, Ur(n, r, l), kn = o, Mr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Rr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && ((d & 2) !== 0 || (d & 4) !== 0) && nf(l, r, m), c = c.next;
          } while (c !== o);
        }
        Ur(n, r, l);
        break;
      case 1:
        if (!Rr && (xo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (x) {
          vn(l, r, x);
        }
        Ur(n, r, l);
        break;
      case 21:
        Ur(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Rr = (o = Rr) || l.memoizedState !== null, Ur(n, r, l), Rr = o) : Ur(n, r, l);
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
              kn = x.stateNode, Mr = !1;
              break e;
            case 3:
              kn = x.stateNode.containerInfo, Mr = !0;
              break e;
            case 4:
              kn = x.stateNode.containerInfo, Mr = !0;
              break e;
          }
          x = x.return;
        }
        if (kn === null) throw Error(D(160));
        eh(d, m, c), kn = null, Mr = !1;
        var b = c.alternate;
        b !== null && (b.return = null), c.return = null;
      } catch (A) {
        vn(c, r, A);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Hd(r, n), r = r.sibling;
  }
  function Hd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Os(3, n, n.return), Ns(3, n);
          } catch (Re) {
            vn(n, n.return, Re);
          }
          try {
            Os(5, n, n.return);
          } catch (Re) {
            vn(n, n.return, Re);
          }
        }
        break;
      case 1:
        ii(r, n), ta(n), o & 512 && l !== null && xo(l, l.return);
        break;
      case 5:
        if (ii(r, n), ta(n), o & 512 && l !== null && xo(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            ie(c, "");
          } catch (Re) {
            vn(n, n.return, Re);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, x = n.type, b = n.updateQueue;
          if (n.updateQueue = null, b !== null) try {
            x === "input" && d.type === "radio" && d.name != null && In(c, d), Kn(x, m);
            var A = Kn(x, d);
            for (m = 0; m < b.length; m += 2) {
              var X = b[m], Z = b[m + 1];
              X === "style" ? rn(c, Z) : X === "dangerouslySetInnerHTML" ? fi(c, Z) : X === "children" ? ie(c, Z) : ze(c, X, Z, A);
            }
            switch (x) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var q = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var me = d.value;
                me != null ? bn(c, !!d.multiple, me, !1) : q !== !!d.multiple && (d.defaultValue != null ? bn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : bn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[ls] = d;
          } catch (Re) {
            vn(n, n.return, Re);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(D(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Re) {
            vn(n, n.return, Re);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Ja(r.containerInfo);
        } catch (Re) {
          vn(n, n.return, Re);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Bd = at())), o & 4 && th(n);
        break;
      case 22:
        if (X = l !== null && l.memoizedState !== null, n.mode & 1 ? (Rr = (A = Rr) || X, ii(r, n), Rr = A) : ii(r, n), ta(n), o & 8192) {
          if (A = n.memoizedState !== null, (n.stateNode.isHidden = A) && !X && (n.mode & 1) !== 0) for (Se = n, X = n.child; X !== null; ) {
            for (Z = Se = X; Se !== null; ) {
              switch (q = Se, me = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, q, q.return);
                  break;
                case 1:
                  xo(q, q.return);
                  var Ce = q.stateNode;
                  if (typeof Ce.componentWillUnmount == "function") {
                    o = q, l = q.return;
                    try {
                      r = o, Ce.props = r.memoizedProps, Ce.state = r.memoizedState, Ce.componentWillUnmount();
                    } catch (Re) {
                      vn(o, l, Re);
                    }
                  }
                  break;
                case 5:
                  xo(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    Ms(Z);
                    continue;
                  }
              }
              me !== null ? (me.return = q, Se = me) : Ms(Z);
            }
            X = X.sibling;
          }
          e: for (X = null, Z = n; ; ) {
            if (Z.tag === 5) {
              if (X === null) {
                X = Z;
                try {
                  c = Z.stateNode, A ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (x = Z.stateNode, b = Z.memoizedProps.style, m = b != null && b.hasOwnProperty("display") ? b.display : null, x.style.display = Vt("display", m));
                } catch (Re) {
                  vn(n, n.return, Re);
                }
              }
            } else if (Z.tag === 6) {
              if (X === null) try {
                Z.stateNode.nodeValue = A ? "" : Z.memoizedProps;
              } catch (Re) {
                vn(n, n.return, Re);
              }
            } else if ((Z.tag !== 22 && Z.tag !== 23 || Z.memoizedState === null || Z === n) && Z.child !== null) {
              Z.child.return = Z, Z = Z.child;
              continue;
            }
            if (Z === n) break e;
            for (; Z.sibling === null; ) {
              if (Z.return === null || Z.return === n) break e;
              X === Z && (X = null), Z = Z.return;
            }
            X === Z && (X = null), Z.sibling.return = Z.return, Z = Z.sibling;
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
            if (Ls(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(D(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (ie(c, ""), o.flags &= -33);
            var d = Zi(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, x = Zi(n);
            _i(n, x, m);
            break;
          default:
            throw Error(D(161));
        }
      } catch (b) {
        vn(n, n.return, b);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function py(n, r, l) {
    Se = n, Pd(n);
  }
  function Pd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; Se !== null; ) {
      var c = Se, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Ds;
        if (!m) {
          var x = c.alternate, b = x !== null && x.memoizedState !== null || Rr;
          x = Ds;
          var A = Rr;
          if (Ds = m, (Rr = b) && !A) for (Se = c; Se !== null; ) m = Se, b = m.child, m.tag === 22 && m.memoizedState !== null ? Vd(c) : b !== null ? (b.return = m, Se = b) : Vd(c);
          for (; d !== null; ) Se = d, Pd(d), d = d.sibling;
          Se = c, Ds = x, Rr = A;
        }
        nh(n);
      } else (c.subtreeFlags & 8772) !== 0 && d !== null ? (d.return = c, Se = d) : nh(n);
    }
  }
  function nh(n) {
    for (; Se !== null; ) {
      var r = Se;
      if ((r.flags & 8772) !== 0) {
        var l = r.alternate;
        try {
          if ((r.flags & 8772) !== 0) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Rr || Ns(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !Rr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && Td(r, d, o);
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
                Td(r, m, l);
              }
              break;
            case 5:
              var x = r.stateNode;
              if (l === null && r.flags & 4) {
                l = x;
                var b = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    b.autoFocus && l.focus();
                    break;
                  case "img":
                    b.src && (l.src = b.src);
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
                  var X = A.memoizedState;
                  if (X !== null) {
                    var Z = X.dehydrated;
                    Z !== null && Ja(Z);
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
              throw Error(D(163));
          }
          Rr || r.flags & 512 && Fd(r);
        } catch (q) {
          vn(r, r.return, q);
        }
      }
      if (r === n) {
        Se = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Se = l;
        break;
      }
      Se = r.return;
    }
  }
  function Ms(n) {
    for (; Se !== null; ) {
      var r = Se;
      if (r === n) {
        Se = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Se = l;
        break;
      }
      Se = r.return;
    }
  }
  function Vd(n) {
    for (; Se !== null; ) {
      var r = Se;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ns(4, r);
            } catch (b) {
              vn(r, l, b);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (b) {
                vn(r, c, b);
              }
            }
            var d = r.return;
            try {
              Fd(r);
            } catch (b) {
              vn(r, d, b);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Fd(r);
            } catch (b) {
              vn(r, m, b);
            }
        }
      } catch (b) {
        vn(r, r.return, b);
      }
      if (r === n) {
        Se = null;
        break;
      }
      var x = r.sibling;
      if (x !== null) {
        x.return = r.return, Se = x;
        break;
      }
      Se = r.return;
    }
  }
  var vy = Math.ceil, Al = ut.ReactCurrentDispatcher, Du = ut.ReactCurrentOwner, sr = ut.ReactCurrentBatchConfig, _t = 0, Gn = null, Hn = null, cr = 0, ya = 0, Co = Oa(0), _n = 0, Us = null, Oi = 0, Eo = 0, af = 0, zs = null, na = null, Bd = 0, bo = 1 / 0, ga = null, Ro = !1, Ou = null, jl = null, lf = !1, Ji = null, As = 0, Fl = 0, To = null, js = -1, Tr = 0;
  function Pn() {
    return (_t & 6) !== 0 ? at() : js !== -1 ? js : js = at();
  }
  function Ni(n) {
    return (n.mode & 1) === 0 ? 1 : (_t & 2) !== 0 && cr !== 0 ? cr & -cr : fy.transition !== null ? (Tr === 0 && (Tr = Xu()), Tr) : (n = zt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ro(n.type)), n);
  }
  function zr(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, To = null, Error(D(185));
    Pi(n, l, o), ((_t & 2) === 0 || n !== Gn) && (n === Gn && ((_t & 2) === 0 && (Eo |= l), _n === 4 && li(n, cr)), ra(n, o), l === 1 && _t === 0 && (r.mode & 1) === 0 && (bo = at() + 500, ho && bi()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Za(n, n === Gn ? cr : 0);
    if (o === 0) l !== null && ir(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ir(l), r === 1) n.tag === 0 ? kl(Id.bind(null, n)) : Tc(Id.bind(null, n)), co(function() {
        (_t & 6) === 0 && bi();
      }), l = null;
      else {
        switch (Zu(o)) {
          case 1:
            l = Xa;
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
        l = dh(l, uf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function uf(n, r) {
    if (js = -1, Tr = 0, (_t & 6) !== 0) throw Error(D(327));
    var l = n.callbackNode;
    if (wo() && n.callbackNode !== l) return null;
    var o = Za(n, n === Gn ? cr : 0);
    if (o === 0) return null;
    if ((o & 30) !== 0 || (o & n.expiredLanes) !== 0 || r) r = of(n, o);
    else {
      r = o;
      var c = _t;
      _t |= 2;
      var d = ah();
      (Gn !== n || cr !== r) && (ga = null, bo = at() + 500, el(n, r));
      do
        try {
          ih();
          break;
        } catch (x) {
          rh(n, x);
        }
      while (!0);
      Sd(), Al.current = d, _t = c, Hn !== null ? r = 0 : (Gn = null, cr = 0, r = _n);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Fs(n, c))), r === 1) throw l = Us, el(n, 0), li(n, o), ra(n, at()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, (o & 30) === 0 && !hy(c) && (r = of(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Fs(n, d))), r === 1)) throw l = Us, el(n, 0), li(n, o), ra(n, at()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(D(345));
          case 2:
            Mu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Bd + 500 - at(), 10 < r)) {
              if (Za(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Pn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Ec(Mu.bind(null, n, na, ga), r);
              break;
            }
            Mu(n, na, ga);
            break;
          case 4:
            if (li(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - Dr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = at() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * vy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Ec(Mu.bind(null, n, na, ga), o);
              break;
            }
            Mu(n, na, ga);
            break;
          case 5:
            Mu(n, na, ga);
            break;
          default:
            throw Error(D(329));
        }
      }
    }
    return ra(n, at()), n.callbackNode === l ? uf.bind(null, n) : null;
  }
  function Fs(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = of(n, r), n !== 2 && (r = na, na = l, r !== null && Nu(r)), n;
  }
  function Nu(n) {
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
    for (r &= ~af, r &= ~Eo, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Dr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Id(n) {
    if ((_t & 6) !== 0) throw Error(D(327));
    wo();
    var r = Za(n, 0);
    if ((r & 1) === 0) return ra(n, at()), null;
    var l = of(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Fs(n, o));
    }
    if (l === 1) throw l = Us, el(n, 0), li(n, r), ra(n, at()), l;
    if (l === 6) throw Error(D(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Mu(n, na, ga), ra(n, at()), null;
  }
  function Yd(n, r) {
    var l = _t;
    _t |= 1;
    try {
      return n(r);
    } finally {
      _t = l, _t === 0 && (bo = at() + 500, ho && bi());
    }
  }
  function Lu(n) {
    Ji !== null && Ji.tag === 0 && (_t & 6) === 0 && wo();
    var r = _t;
    _t |= 1;
    var l = sr.transition, o = zt;
    try {
      if (sr.transition = null, zt = 1, n) return n();
    } finally {
      zt = o, sr.transition = l, _t = r, (_t & 6) === 0 && bi();
    }
  }
  function $d() {
    ya = Co.current, on(Co);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, vd(l)), Hn !== null) for (l = Hn.return; l !== null; ) {
      var o = l;
      switch (kc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && vo();
          break;
        case 3:
          xu(), on(Qn), on(Cn), Me();
          break;
        case 5:
          Nc(o);
          break;
        case 4:
          xu();
          break;
        case 13:
          on(Sn);
          break;
        case 19:
          on(Sn);
          break;
        case 10:
          xd(o.type._context);
          break;
        case 22:
        case 23:
          $d();
      }
      l = l.return;
    }
    if (Gn = n, Hn = n = Hl(n.current, null), cr = ya = r, _n = 0, Us = null, af = Eo = Oi = 0, na = zs = null, gu !== null) {
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
  function rh(n, r) {
    do {
      var l = Hn;
      try {
        if (Sd(), St.current = wu, Mc) {
          for (var o = jt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Mc = !1;
        }
        if (Jt = 0, Jn = An = jt = null, hs = !1, Cu = 0, Du.current = null, l === null || l.return === null) {
          _n = 1, Us = r, Hn = null;
          break;
        }
        e: {
          var d = n, m = l.return, x = l, b = r;
          if (r = cr, x.flags |= 32768, b !== null && typeof b == "object" && typeof b.then == "function") {
            var A = b, X = x, Z = X.tag;
            if ((X.mode & 1) === 0 && (Z === 0 || Z === 11 || Z === 15)) {
              var q = X.alternate;
              q ? (X.updateQueue = q.updateQueue, X.memoizedState = q.memoizedState, X.lanes = q.lanes) : (X.updateQueue = null, X.memoizedState = null);
            }
            var me = Yv(m);
            if (me !== null) {
              me.flags &= -257, zl(me, m, x, d, r), me.mode & 1 && Md(d, A, r), r = me, b = A;
              var Ce = r.updateQueue;
              if (Ce === null) {
                var Re = /* @__PURE__ */ new Set();
                Re.add(b), r.updateQueue = Re;
              } else Ce.add(b);
              break e;
            } else {
              if ((r & 1) === 0) {
                Md(d, A, r), Qd();
                break e;
              }
              b = Error(D(426));
            }
          } else if (pn && x.mode & 1) {
            var Dn = Yv(m);
            if (Dn !== null) {
              (Dn.flags & 65536) === 0 && (Dn.flags |= 256), zl(Dn, m, x, d, r), qi(ku(b, x));
              break e;
            }
          }
          d = b = ku(b, x), _n !== 4 && (_n = 2), zs === null ? zs = [d] : zs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var O = Iv(d, b, r);
                Fv(d, O);
                break e;
              case 1:
                x = b;
                var w = d.type, M = d.stateNode;
                if ((d.flags & 128) === 0 && (typeof w.getDerivedStateFromError == "function" || M !== null && typeof M.componentDidCatch == "function" && (jl === null || !jl.has(M)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var K = Ld(d, x, r);
                  Fv(d, K);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        uh(l);
      } catch (Ee) {
        r = Ee, Hn === l && l !== null && (Hn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ah() {
    var n = Al.current;
    return Al.current = wu, n === null ? wu : n;
  }
  function Qd() {
    (_n === 0 || _n === 3 || _n === 2) && (_n = 4), Gn === null || (Oi & 268435455) === 0 && (Eo & 268435455) === 0 || li(Gn, cr);
  }
  function of(n, r) {
    var l = _t;
    _t |= 2;
    var o = ah();
    (Gn !== n || cr !== r) && (ga = null, el(n, r));
    do
      try {
        my();
        break;
      } catch (c) {
        rh(n, c);
      }
    while (!0);
    if (Sd(), _t = l, Al.current = o, Hn !== null) throw Error(D(261));
    return Gn = null, cr = 0, _n;
  }
  function my() {
    for (; Hn !== null; ) lh(Hn);
  }
  function ih() {
    for (; Hn !== null && !Ga(); ) lh(Hn);
  }
  function lh(n) {
    var r = fh(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? uh(n) : Hn = r, Du.current = null;
  }
  function uh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, (r.flags & 32768) === 0) {
        if (l = Kv(l, r, ya), l !== null) {
          Hn = l;
          return;
        }
      } else {
        if (l = tf(l, r), l !== null) {
          l.flags &= 32767, Hn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          _n = 6, Hn = null;
          return;
        }
      }
      if (r = r.sibling, r !== null) {
        Hn = r;
        return;
      }
      Hn = r = n;
    } while (r !== null);
    _n === 0 && (_n = 5);
  }
  function Mu(n, r, l) {
    var o = zt, c = sr.transition;
    try {
      sr.transition = null, zt = 1, yy(n, r, l, o);
    } finally {
      sr.transition = c, zt = o;
    }
    return null;
  }
  function yy(n, r, l, o) {
    do
      wo();
    while (Ji !== null);
    if ((_t & 6) !== 0) throw Error(D(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(D(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Wf(n, d), n === Gn && (Hn = Gn = null, cr = 0), (l.subtreeFlags & 2064) === 0 && (l.flags & 2064) === 0 || lf || (lf = !0, dh(ru, function() {
      return wo(), null;
    })), d = (l.flags & 15990) !== 0, (l.subtreeFlags & 15990) !== 0 || d) {
      d = sr.transition, sr.transition = null;
      var m = zt;
      zt = 1;
      var x = _t;
      _t |= 4, Du.current = null, Jv(n, l), Hd(l, n), lo(pu), ka = !!is, pu = is = null, n.current = l, py(l), qa(), _t = x, zt = m, sr.transition = d;
    } else n.current = l;
    if (lf && (lf = !1, Ji = n, As = c), d = n.pendingLanes, d === 0 && (jl = null), $o(l.stateNode), ra(n, at()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (Ro) throw Ro = !1, n = Ou, Ou = null, n;
    return (As & 1) !== 0 && n.tag !== 0 && wo(), d = n.pendingLanes, (d & 1) !== 0 ? n === To ? Fl++ : (Fl = 0, To = n) : Fl = 0, bi(), null;
  }
  function wo() {
    if (Ji !== null) {
      var n = Zu(As), r = sr.transition, l = zt;
      try {
        if (sr.transition = null, zt = 16 > n ? 16 : n, Ji === null) var o = !1;
        else {
          if (n = Ji, Ji = null, As = 0, (_t & 6) !== 0) throw Error(D(331));
          var c = _t;
          for (_t |= 4, Se = n.current; Se !== null; ) {
            var d = Se, m = d.child;
            if ((Se.flags & 16) !== 0) {
              var x = d.deletions;
              if (x !== null) {
                for (var b = 0; b < x.length; b++) {
                  var A = x[b];
                  for (Se = A; Se !== null; ) {
                    var X = Se;
                    switch (X.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, X, d);
                    }
                    var Z = X.child;
                    if (Z !== null) Z.return = X, Se = Z;
                    else for (; Se !== null; ) {
                      X = Se;
                      var q = X.sibling, me = X.return;
                      if (rf(X), X === A) {
                        Se = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = me, Se = q;
                        break;
                      }
                      Se = me;
                    }
                  }
                }
                var Ce = d.alternate;
                if (Ce !== null) {
                  var Re = Ce.child;
                  if (Re !== null) {
                    Ce.child = null;
                    do {
                      var Dn = Re.sibling;
                      Re.sibling = null, Re = Dn;
                    } while (Re !== null);
                  }
                }
                Se = d;
              }
            }
            if ((d.subtreeFlags & 2064) !== 0 && m !== null) m.return = d, Se = m;
            else e: for (; Se !== null; ) {
              if (d = Se, (d.flags & 2048) !== 0) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var O = d.sibling;
              if (O !== null) {
                O.return = d.return, Se = O;
                break e;
              }
              Se = d.return;
            }
          }
          var w = n.current;
          for (Se = w; Se !== null; ) {
            m = Se;
            var M = m.child;
            if ((m.subtreeFlags & 2064) !== 0 && M !== null) M.return = m, Se = M;
            else e: for (m = w; Se !== null; ) {
              if (x = Se, (x.flags & 2048) !== 0) try {
                switch (x.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ns(9, x);
                }
              } catch (Ee) {
                vn(x, x.return, Ee);
              }
              if (x === m) {
                Se = null;
                break e;
              }
              var K = x.sibling;
              if (K !== null) {
                K.return = x.return, Se = K;
                break e;
              }
              Se = x.return;
            }
          }
          if (_t = c, bi(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        zt = l, sr.transition = r;
      }
    }
    return !1;
  }
  function oh(n, r, l) {
    r = ku(l, r), r = Iv(n, r, 1), n = Ll(n, r, 1), r = Pn(), n !== null && (Pi(n, 1, r), ra(n, r));
  }
  function vn(n, r, l) {
    if (n.tag === 3) oh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        oh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (jl === null || !jl.has(o))) {
          n = ku(l, n), n = Ld(r, n, 1), r = Ll(r, n, 1), n = Pn(), r !== null && (Pi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function gy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Pn(), n.pingedLanes |= n.suspendedLanes & l, Gn === n && (cr & l) === l && (_n === 4 || _n === 3 && (cr & 130023424) === cr && 500 > at() - Bd ? el(n, 0) : af |= l), ra(n, r);
  }
  function sh(n, r) {
    r === 0 && ((n.mode & 1) === 0 ? r = 1 : (r = da, da <<= 1, (da & 130023424) === 0 && (da = 4194304)));
    var l = Pn();
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
        throw Error(D(314));
    }
    o !== null && o.delete(r), sh(n, l);
  }
  var fh;
  fh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Qn.current) jn = !0;
    else {
      if ((n.lanes & l) === 0 && (r.flags & 128) === 0) return jn = !1, ks(n, r, l);
      jn = (n.flags & 131072) !== 0;
    }
    else jn = !1, pn && (r.flags & 1048576) !== 0 && Uv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        Ua(n, r), n = r.pendingProps;
        var c = qr(r, Cn.current);
        gn(r, l), c = Ml(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Un(o) ? (d = !0, Zn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, Rd(r), c.updater = Xc, r.stateNode = c, c._reactInternals = r, Es(r, o, n, l), r = Ts(null, r, o, !0, d, l)) : (r.tag = 0, pn && d && wc(r), or(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (Ua(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Cy(o), n = ai(o, n), c) {
            case 0:
              r = $v(null, r, o, n, l);
              break e;
            case 1:
              r = Qv(null, r, o, n, l);
              break e;
            case 11:
              r = ea(null, r, o, n, l);
              break e;
            case 14:
              r = _u(null, r, o, ai(o.type, n), l);
              break e;
          }
          throw Error(D(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), $v(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Qv(n, r, o, c, l);
      case 3:
        e: {
          if (So(r), n === null) throw Error(D(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, jv(n, r), cs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = ku(Error(D(423)), r), r = Wv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = ku(Error(D(424)), r), r = Wv(n, r, o, l, c);
            break e;
          } else for (Kr = xi(r.stateNode.containerInfo.firstChild), Xr = r, pn = !0, La = null, l = pe(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Nl(), o === c) {
              r = za(n, r, l);
              break e;
            }
            or(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Hv(r), n === null && yd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Cc(o, c) ? m = null : d !== null && Cc(o, d) && (r.flags |= 32), Ud(n, r), or(n, r, m, l), r.child;
      case 6:
        return n === null && yd(r), null;
      case 13:
        return ef(n, r, l);
      case 4:
        return wd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = Tn(r, null, o, l) : or(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ea(n, r, o, c, l);
      case 7:
        return or(n, r, r.pendingProps, l), r.child;
      case 8:
        return or(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return or(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, Oe(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Qn.current) {
              r = za(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var x = d.dependencies;
            if (x !== null) {
              m = d.child;
              for (var b = x.firstContext; b !== null; ) {
                if (b.context === o) {
                  if (d.tag === 1) {
                    b = Xi(-1, l & -l), b.tag = 2;
                    var A = d.updateQueue;
                    if (A !== null) {
                      A = A.shared;
                      var X = A.pending;
                      X === null ? b.next = b : (b.next = X.next, X.next = b), A.pending = b;
                    }
                  }
                  d.lanes |= l, b = d.alternate, b !== null && (b.lanes |= l), Cd(
                    d.return,
                    l,
                    r
                  ), x.lanes |= l;
                  break;
                }
                b = b.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(D(341));
              m.lanes |= l, x = m.alternate, x !== null && (x.lanes |= l), Cd(m, l, r), m = d.sibling;
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
          or(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, gn(r, l), c = Ma(c), o = o(c), r.flags |= 1, or(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), _u(n, r, o, c, l);
      case 15:
        return it(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Ua(n, r), r.tag = 1, Un(o) ? (n = !0, Zn(r)) : n = !1, gn(r, l), Kc(r, o, c), Es(r, o, c, l), Ts(null, r, o, !0, n, l);
      case 19:
        return ki(n, r, l);
      case 22:
        return Rs(n, r, l);
    }
    throw Error(D(156, r.tag));
  };
  function dh(n, r) {
    return cn(n, r);
  }
  function xy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ja(n, r, l, o) {
    return new xy(n, r, l, o);
  }
  function Wd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Cy(n) {
    if (typeof n == "function") return Wd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === ht) return 11;
      if (n === bt) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = ja(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Hs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") Wd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case Ne:
        return tl(l.children, c, d, r);
      case Bt:
        m = 8, c |= 8;
        break;
      case Rt:
        return n = ja(12, l, r, c | 2), n.elementType = Rt, n.lanes = d, n;
      case De:
        return n = ja(13, l, r, c), n.elementType = De, n.lanes = d, n;
      case Et:
        return n = ja(19, l, r, c), n.elementType = Et, n.lanes = d, n;
      case Y:
        return Pl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Ut:
            m = 10;
            break e;
          case It:
            m = 9;
            break e;
          case ht:
            m = 11;
            break e;
          case bt:
            m = 14;
            break e;
          case re:
            m = 16, o = null;
            break e;
        }
        throw Error(D(130, n == null ? n : typeof n, ""));
    }
    return r = ja(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = ja(7, n, o, r), n.lanes = l, n;
  }
  function Pl(n, r, l, o) {
    return n = ja(22, n, o, r), n.elementType = Y, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Gd(n, r, l) {
    return n = ja(6, n, null, r), n.lanes = l, n;
  }
  function sf(n, r, l) {
    return r = ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function ph(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Ku(0), this.expirationTimes = Ku(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ku(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function cf(n, r, l, o, c, d, m, x, b) {
    return n = new ph(n, r, l, x, b), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = ja(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Rd(d), n;
  }
  function Ey(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: nt, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function qd(n) {
    if (!n) return Er;
    n = n._reactInternals;
    e: {
      if (rt(n) !== n || n.tag !== 1) throw Error(D(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Un(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(D(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (Un(l)) return os(n, l, r);
    }
    return r;
  }
  function vh(n, r, l, o, c, d, m, x, b) {
    return n = cf(l, o, !0, n, c, d, m, x, b), n.context = qd(null), l = n.current, o = Pn(), c = Ni(l), d = Xi(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Pi(n, c, o), ra(n, o), n;
  }
  function ff(n, r, l, o) {
    var c = r.current, d = Pn(), m = Ni(c);
    return l = qd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Xi(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (zr(n, c, m, d), Oc(n, c, m)), m;
  }
  function df(n) {
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
  function pf(n, r) {
    Xd(n, r), (n = n.alternate) && Xd(n, r);
  }
  function hh() {
    return null;
  }
  var Uu = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Kd(n) {
    this._internalRoot = n;
  }
  vf.prototype.render = Kd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(D(409));
    ff(n, r, null, null);
  }, vf.prototype.unmount = Kd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Lu(function() {
        ff(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function vf(n) {
    this._internalRoot = n;
  }
  vf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Xe();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < $n.length && r !== 0 && r < $n[l].priority; l++) ;
      $n.splice(l, 0, n), l === 0 && Go(n);
    }
  };
  function Zd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function hf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function mh() {
  }
  function by(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var A = df(m);
          d.call(A);
        };
      }
      var m = vh(r, o, n, 0, null, !1, !1, "", mh);
      return n._reactRootContainer = m, n[Qi] = m.current, oo(n.nodeType === 8 ? n.parentNode : n), Lu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var x = o;
      o = function() {
        var A = df(b);
        x.call(A);
      };
    }
    var b = cf(n, 0, !1, null, null, !1, !1, "", mh);
    return n._reactRootContainer = b, n[Qi] = b.current, oo(n.nodeType === 8 ? n.parentNode : n), Lu(function() {
      ff(r, b, l, o);
    }), b;
  }
  function Ps(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var x = c;
        c = function() {
          var b = df(m);
          x.call(b);
        };
      }
      ff(r, m, n, c);
    } else m = by(l, r, n, c, o);
    return df(m);
  }
  Nt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Ka(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, at()), (_t & 6) === 0 && (bo = at() + 500, bi()));
        }
        break;
      case 13:
        Lu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Pn();
            zr(o, n, 1, c);
          }
        }), pf(n, 1);
    }
  }, Qo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Pn();
        zr(r, n, 134217728, l);
      }
      pf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Ni(n), l = ha(n, r);
      if (l !== null) {
        var o = Pn();
        zr(l, n, r, o);
      }
      pf(n, r);
    }
  }, Xe = function() {
    return zt;
  }, Ju = function(n, r) {
    var l = zt;
    try {
      return zt = n, r();
    } finally {
      zt = l;
    }
  }, qt = function(n, r, l) {
    switch (r) {
      case "input":
        if ($r(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = yn(o);
              if (!c) throw Error(D(90));
              wr(o), $r(o, c);
            }
          }
        }
        break;
      case "textarea":
        $a(n, l);
        break;
      case "select":
        r = l.value, r != null && bn(n, !!l.multiple, r, !1);
    }
  }, eu = Yd, pl = Lu;
  var Ry = { usingClientEntryPoint: !1, Events: [Le, ni, yn, Hi, Jl, Yd] }, Vs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, yh = { bundleType: Vs.bundleType, version: Vs.version, rendererPackageName: Vs.rendererPackageName, rendererConfig: Vs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ut.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Rn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Vs.findFiberByHostInstance || hh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(yh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ry, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Zd(r)) throw Error(D(200));
    return Ey(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!Zd(n)) throw Error(D(299));
    var l = !1, o = "", c = Uu;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = cf(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, oo(n.nodeType === 8 ? n.parentNode : n), new Kd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(D(188)) : (n = Object.keys(n).join(","), Error(D(268, n)));
    return n = Rn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Lu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!hf(r)) throw Error(D(200));
    return Ps(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!Zd(n)) throw Error(D(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Uu;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = vh(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, oo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new vf(r);
  }, Ia.render = function(n, r, l) {
    if (!hf(r)) throw Error(D(200));
    return Ps(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!hf(n)) throw Error(D(40));
    return n._reactRootContainer ? (Lu(function() {
      Ps(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = Yd, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!hf(l)) throw Error(D(200));
    if (n == null || n._reactInternals === void 0) throw Error(D(38));
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
var sb;
function o_() {
  return sb || (sb = 1, process.env.NODE_ENV !== "production" && (function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var R = nv(), I = db(), D = R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ke = !1;
    function Ie(e) {
      Ke = e;
    }
    function Ve(e) {
      if (!Ke) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        ct("warn", e, a);
      }
    }
    function S(e) {
      if (!Ke) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        ct("error", e, a);
      }
    }
    function ct(e, t, a) {
      {
        var i = D.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var oe = 0, le = 1, Ge = 2, ne = 3, de = 4, ae = 5, Te = 6, et = 7, Ue = 8, Qt = 9, qe = 10, ze = 11, ut = 12, we = 13, nt = 14, Ne = 15, Bt = 16, Rt = 17, Ut = 18, It = 19, ht = 21, De = 22, Et = 23, bt = 24, re = 25, Y = !0, W = !1, ce = !1, ee = !1, _ = !1, B = !0, $e = !0, Be = !0, mt = !0, ft = /* @__PURE__ */ new Set(), ot = {}, dt = {};
    function yt(e, t) {
      Wt(e, t), Wt(e + "Capture", t);
    }
    function Wt(e, t) {
      ot[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), ot[e] = t;
      {
        var a = e.toLowerCase();
        dt[a] = e, e === "onDoubleClick" && (dt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        ft.add(t[i]);
    }
    var Nn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", wr = Object.prototype.hasOwnProperty;
    function En(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function rr(e) {
      try {
        return Bn(e), !1;
      } catch {
        return !0;
      }
    }
    function Bn(e) {
      return "" + e;
    }
    function In(e, t) {
      if (rr(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, En(e)), Bn(e);
    }
    function $r(e) {
      if (rr(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", En(e)), Bn(e);
    }
    function ci(e, t) {
      if (rr(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, En(e)), Bn(e);
    }
    function sa(e, t) {
      if (rr(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, En(e)), Bn(e);
    }
    function Xn(e) {
      if (rr(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", En(e)), Bn(e);
    }
    function bn(e) {
      if (rr(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", En(e)), Bn(e);
    }
    var Yn = 0, Sr = 1, $a = 2, Ln = 3, xr = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ie = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", ke = new RegExp("^[" + fi + "][" + ie + "]*$"), pt = {}, Vt = {};
    function rn(e) {
      return wr.call(Vt, e) ? !0 : wr.call(pt, e) ? !1 : ke.test(e) ? (Vt[e] = !0, !0) : (pt[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function hn(e, t, a) {
      return t !== null ? t.type === Yn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function sn(e, t, a, i) {
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
    function Kn(e, t, a, i) {
      if (t === null || typeof t > "u" || sn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Ln:
            return !t;
          case xr:
            return t === !1;
          case ca:
            return isNaN(t);
          case Qa:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function an(e) {
      return qt.hasOwnProperty(e) ? qt[e] : null;
    }
    function Gt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === Ln || t === xr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var qt = {}, fa = [
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
      qt[e] = new Gt(
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
      qt[t] = new Gt(
        t,
        Sr,
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
      qt[e] = new Gt(
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
    var Cr = /[\-\:]([a-z])/g, Ra = function(e) {
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
      var t = e.replace(Cr, Ra);
      qt[t] = new Gt(
        t,
        Sr,
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
      var t = e.replace(Cr, Ra);
      qt[t] = new Gt(
        t,
        Sr,
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
      var t = e.replace(Cr, Ra);
      qt[t] = new Gt(
        t,
        Sr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Sr,
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
    qt[Hi] = new Gt(
      "xlinkHref",
      Sr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Sr,
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
    var Jl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, eu = !1;
    function pl(e) {
      !eu && Jl.test(e) && (eu = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function vl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        In(a, t), i.sanitizeURL && pl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === xr) {
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
        if (!rn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return In(a, t), u === "" + a ? a : u;
      }
    }
    function kr(e, t, a, i) {
      var u = an(t);
      if (!hn(t, u, i)) {
        if (Kn(t, a, u, i) && (a = null), i || u === null) {
          if (rn(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (In(a, t), e.setAttribute(s, "" + a));
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
          var k = u.type, T;
          k === Ln || k === xr && a === !0 ? T = "" : (In(a, y), T = "" + a, u.sanitizeURL && pl(T.toString())), g ? e.setAttributeNS(g, y, T) : e.setAttribute(y, T);
        }
      }
    }
    var _r = Symbol.for("react.element"), ar = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), E = Symbol.for("react.context"), Q = Symbol.for("react.forward_ref"), fe = Symbol.for("react.suspense"), xe = Symbol.for("react.suspense_list"), rt = Symbol.for("react.memo"), Ze = Symbol.for("react.lazy"), xt = Symbol.for("react.scope"), gt = Symbol.for("react.debug_trace_mode"), Rn = Symbol.for("react.offscreen"), ln = Symbol.for("react.legacy_hidden"), cn = Symbol.for("react.cache"), ir = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function at(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var st = Object.assign, Xa = 0, nu, ru, hl, Wu, ml, Qr, $o;
    function Dr() {
    }
    Dr.__reactDisabledLog = !0;
    function lc() {
      {
        if (Xa === 0) {
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
        Xa++;
      }
    }
    function uc() {
      {
        if (Xa--, Xa === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: st({}, e, {
              value: nu
            }),
            info: st({}, e, {
              value: ru
            }),
            warn: st({}, e, {
              value: hl
            }),
            error: st({}, e, {
              value: Wu
            }),
            group: st({}, e, {
              value: ml
            }),
            groupCollapsed: st({}, e, {
              value: Qr
            }),
            groupEnd: st({}, e, {
              value: $o
            })
          });
        }
        Xa < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Gu = D.ReactCurrentDispatcher, yl;
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
    var Ka = !1, Za;
    {
      var qu = typeof WeakMap == "function" ? WeakMap : Map;
      Za = new qu();
    }
    function au(e, t) {
      if (!e || Ka)
        return "";
      {
        var a = Za.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Ka = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Gu.current, Gu.current = null, lc();
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
            } catch (j) {
              i = j;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (j) {
              i = j;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (j) {
            i = j;
          }
          e();
        }
      } catch (j) {
        if (j && i && typeof j.stack == "string") {
          for (var p = j.stack.split(`
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
                    return e.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", e.displayName)), typeof e == "function" && Za.set(e, k), k;
                  }
                while (y >= 1 && g >= 0);
              break;
            }
        }
      } finally {
        Ka = !1, Gu.current = s, uc(), Error.prepareStackTrace = u;
      }
      var T = e ? e.displayName || e.name : "", U = T ? da(T) : "";
      return typeof e == "function" && Za.set(e, U), U;
    }
    function gl(e, t, a) {
      return au(e, !0);
    }
    function Xu(e, t, a) {
      return au(e, !1);
    }
    function Ku(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Pi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return au(e, Ku(e));
      if (typeof e == "string")
        return da(e);
      switch (e) {
        case fe:
          return da("Suspense");
        case xe:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Q:
            return Xu(e.render);
          case rt:
            return Pi(e.type, t, a);
          case Ze: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Pi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Wf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ae:
          return da(e.type);
        case Bt:
          return da("Lazy");
        case we:
          return da("Suspense");
        case It:
          return da("SuspenseList");
        case oe:
        case Ge:
        case Ne:
          return Xu(e.type);
        case ze:
          return Xu(e.type.render);
        case le:
          return gl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += Wf(a), a = a.return;
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
    function Zu(e) {
      return e.displayName || "Context";
    }
    function Nt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case di:
          return "Fragment";
        case ar:
          return "Portal";
        case pi:
          return "Profiler";
        case Wa:
          return "StrictMode";
        case fe:
          return "Suspense";
        case xe:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case E:
            var t = e;
            return Zu(t) + ".Consumer";
          case vi:
            var a = e;
            return Zu(a._context) + ".Provider";
          case Q:
            return zt(e, e.render, "ForwardRef");
          case rt:
            var i = e.displayName || null;
            return i !== null ? i : Nt(e.type) || "Memo";
          case Ze: {
            var u = e, s = u._payload, f = u._init;
            try {
              return Nt(f(s));
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
    function Xe(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case bt:
          return "Cache";
        case Qt:
          var i = a;
          return hi(i) + ".Consumer";
        case qe:
          var u = a;
          return hi(u._context) + ".Provider";
        case Ut:
          return "DehydratedFragment";
        case ze:
          return Qo(a, a.render, "ForwardRef");
        case et:
          return "Fragment";
        case ae:
          return a;
        case de:
          return "Portal";
        case ne:
          return "Root";
        case Te:
          return "Text";
        case Bt:
          return Nt(a);
        case Ue:
          return a === Wa ? "StrictMode" : "Mode";
        case De:
          return "Offscreen";
        case ut:
          return "Profiler";
        case ht:
          return "Scope";
        case we:
          return "Suspense";
        case It:
          return "SuspenseList";
        case re:
          return "TracingMarker";
        // The display name for this tags come from the user-provided type:
        case le:
        case oe:
        case Rt:
        case Ge:
        case nt:
        case Ne:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Ju = D.ReactDebugCurrentFrame, lr = null, mi = !1;
    function Or() {
      {
        if (lr === null)
          return null;
        var e = lr._debugOwner;
        if (e !== null && typeof e < "u")
          return Xe(e);
      }
      return null;
    }
    function yi() {
      return lr === null ? "" : Vi(lr);
    }
    function fn() {
      Ju.getCurrentStack = null, lr = null, mi = !1;
    }
    function Xt(e) {
      Ju.getCurrentStack = e === null ? null : yi, lr = e, mi = !1;
    }
    function Sl() {
      return lr;
    }
    function $n(e) {
      mi = e;
    }
    function Nr(e) {
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
          return bn(e), e;
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
    function xl(e) {
      return e._valueTracker;
    }
    function lu(e) {
      e._valueTracker = null;
    }
    function Gf(e) {
      var t = "";
      return e && (Go(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function wa(e) {
      var t = Go(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      bn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            bn(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            bn(p), i = "" + p;
          },
          stopTracking: function() {
            lu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Ja(e) {
      xl(e) || (e._valueTracker = wa(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = xl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Gf(e);
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
    var eo = !1, to = !1, Cl = !1, uu = !1;
    function no(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ro(e, t) {
      var a = e, i = t.checked, u = st({}, t, {
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
        initialValue: Ta(t.value != null ? t.value : i),
        controlled: no(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && kr(a, "checked", i, !1);
    }
    function C(e, t) {
      var a = e;
      {
        var i = no(t);
        !a._wrapperState.controlled && i && !uu && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), uu = !0), a._wrapperState.controlled && !i && !Cl && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Cl = !0);
      }
      h(e, t);
      var u = Ta(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Nr(u)) : a.value !== Nr(u) && (a.value = Nr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ae(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ae(a, t.type, Ta(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function z(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Nr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function H(e, t) {
      var a = e;
      C(a, t), te(a, t);
    }
    function te(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        In(a, "name");
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
    function Ae(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || ka(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Nr(e._wrapperState.initialValue) : e.defaultValue !== Nr(a) && (e.defaultValue = Nr(a)));
    }
    var se = !1, He = !1, Ct = !1;
    function Lt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? R.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || He || (He = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Ct || (Ct = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !se && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), se = !0);
    }
    function un(e, t) {
      t.value != null && e.setAttribute("value", Nr(Ta(t.value)));
    }
    var Kt = Array.isArray;
    function vt(e) {
      return Kt(e);
    }
    var Zt;
    Zt = !1;
    function mn() {
      var e = Or();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var El = ["value", "defaultValue"];
    function qo(e) {
      {
        Wo("select", e);
        for (var t = 0; t < El.length; t++) {
          var a = El[t];
          if (e[a] != null) {
            var i = vt(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, mn()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, mn());
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
        for (var g = Nr(Ta(a)), k = null, T = 0; T < u.length; T++) {
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
      return st({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      qo(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Zt && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Zt = !0);
    }
    function qf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Bi(a, !!t.multiple, i, !1) : t.defaultValue != null && Bi(a, !!t.multiple, t.defaultValue, !0);
    }
    function oc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Bi(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Bi(a, !!t.multiple, t.defaultValue, !0) : Bi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Xf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var av = !1;
    function Kf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = st({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Nr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Zf(e, t) {
      var a = e;
      Wo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !av && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), av = !0);
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
        initialValue: Ta(i)
      };
    }
    function iv(e, t) {
      var a = e, i = Ta(t.value), u = Ta(t.defaultValue);
      if (i != null) {
        var s = Nr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Nr(u));
    }
    function lv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Jm(e, t) {
      iv(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", Jf = "http://www.w3.org/1998/Math/MathML", ed = "http://www.w3.org/2000/svg";
    function td(e) {
      switch (e) {
        case "svg":
          return ed;
        case "math":
          return Jf;
        default:
          return Ii;
      }
    }
    function nd(e, t) {
      return e == null || e === Ii ? td(t) : e === ed && t === "foreignObject" ? Ii : e;
    }
    var uv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, sc, ov = uv(function(e, t) {
      if (e.namespaceURI === ed && !("innerHTML" in e)) {
        sc = sc || document.createElement("div"), sc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = sc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Wr = 1, Yi = 3, Mn = 8, $i = 9, rd = 11, ao = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Yi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Ko = {
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
    function cc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Zo.hasOwnProperty(e) && Zo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var fv = /([A-Z])/g, dv = /^ms-/;
    function io(e) {
      return e.replace(fv, "-$1").toLowerCase().replace(dv, "-ms-");
    }
    var pv = function() {
    };
    {
      var ey = /^(?:webkit|moz|o)[A-Z]/, ty = /^-ms-/, vv = /-(.)/g, ad = /;\s*$/, Si = {}, su = {}, hv = !1, Jo = !1, ny = function(e) {
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
      }, id = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, ld = function(e, t) {
        su.hasOwnProperty(t) && su[t] || (su[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(ad, "")));
      }, yv = function(e, t) {
        hv || (hv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, gv = function(e, t) {
        Jo || (Jo = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      pv = function(e, t) {
        e.indexOf("-") > -1 ? mv(e) : ey.test(e) ? id(e) : ad.test(t) && ld(e, t), typeof t == "number" && (isNaN(t) ? yv(e, t) : isFinite(t) || gv(e, t));
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
              t += a + (s ? i : io(i)) + ":", t += cc(i, u, s), a = ";";
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
          var s = cc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ay(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Cv(e) {
      var t = {};
      for (var a in e)
        for (var i = Ko[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function iy(e, t) {
      {
        if (!t)
          return;
        var a = Cv(e), i = Cv(t), u = {};
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
    }, es = st({
      menuitem: !0
    }, ti), Ev = "__html";
    function fc(e, t) {
      if (t) {
        if (es[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Ev in t.dangerouslySetInnerHTML))
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
    }, dc = {
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
    }, lo = {}, ly = new RegExp("^(aria)-[" + ie + "]*$"), uo = new RegExp("^(aria)[A-Z][" + ie + "]*$");
    function ud(e, t) {
      {
        if (wr.call(lo, t) && lo[t])
          return !0;
        if (uo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = dc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), lo[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), lo[t] = !0, !0;
        }
        if (ly.test(t)) {
          var u = t.toLowerCase(), s = dc.hasOwnProperty(u) ? u : null;
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
          var u = ud(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function od(e, t) {
      bl(e, t) || ns(e, t);
    }
    var sd = !1;
    function pc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !sd && (sd = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cu = function() {
    };
    {
      var ur = {}, cd = /^on./, vc = /^on[^A-Z]/, bv = new RegExp("^(aria)-[" + ie + "]*$"), Rv = new RegExp("^(aria)[A-Z][" + ie + "]*$");
      cu = function(e, t, a, i) {
        if (wr.call(ur, t) && ur[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), ur[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, p), ur[t] = !0, !0;
          if (cd.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), ur[t] = !0, !0;
        } else if (cd.test(t))
          return vc.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), ur[t] = !0, !0;
        if (bv.test(t) || Rv.test(t))
          return !0;
        if (u === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), ur[t] = !0, !0;
        if (u === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), ur[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), ur[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), ur[t] = !0, !0;
        var v = an(t), y = v !== null && v.type === Yn;
        if (ts.hasOwnProperty(u)) {
          var g = ts[u];
          if (g !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, g), ur[t] = !0, !0;
        } else if (!y && t !== u)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), ur[t] = !0, !0;
        return typeof a == "boolean" && sn(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ur[t] = !0, !0) : y ? !0 : sn(t, a, v, !1) ? (ur[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Ln && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ur[t] = !0), !0);
      };
    }
    var Tv = function(e, t, a) {
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
    function wv(e, t, a) {
      bl(e, t) || Tv(e, t, a);
    }
    var fd = 1, hc = 2, _a = 4, dd = fd | hc | _a, fu = null;
    function uy(e) {
      fu !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function oy() {
      fu === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function rs(e) {
      return e === fu;
    }
    function pd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var mc = null, du = null, Yt = null;
    function yc(e) {
      var t = Do(e);
      if (t) {
        if (typeof mc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = zh(a);
          mc(t.stateNode, t.type, i);
        }
      }
    }
    function gc(e) {
      mc = e;
    }
    function oo(e) {
      du ? Yt ? Yt.push(e) : Yt = [e] : du = e;
    }
    function kv() {
      return du !== null || Yt !== null;
    }
    function Sc() {
      if (du) {
        var e = du, t = Yt;
        if (du = null, Yt = null, yc(e), t)
          for (var a = 0; a < t.length; a++)
            yc(t[a]);
      }
    }
    var so = function(e, t) {
      return e(t);
    }, as = function() {
    }, Rl = !1;
    function _v() {
      var e = kv();
      e && (as(), Sc());
    }
    function Dv(e, t, a) {
      if (Rl)
        return e(t, a);
      Rl = !0;
      try {
        return so(e, t, a);
      } finally {
        Rl = !1, _v();
      }
    }
    function sy(e, t, a) {
      so = e, as = a;
    }
    function Ov(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function xc(e, t, a) {
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
          return !!(a.disabled && Ov(t));
        default:
          return !1;
      }
    }
    function Tl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = zh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (xc(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var is = !1;
    if (Nn)
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
    function Cc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (g) {
        this.onError(g);
      }
    }
    var Ec = Cc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var vd = document.createElement("react");
      Ec = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var g = document.createEvent("Event"), k = !1, T = !0, U = window.event, j = Object.getOwnPropertyDescriptor(window, "event");
        function P() {
          vd.removeEventListener(V, je, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = U);
        }
        var ve = Array.prototype.slice.call(arguments, 3);
        function je() {
          k = !0, P(), a.apply(i, ve), T = !1;
        }
        var _e, Ot = !1, Tt = !1;
        function N(L) {
          if (_e = L.error, Ot = !0, _e === null && L.colno === 0 && L.lineno === 0 && (Tt = !0), L.defaultPrevented && _e != null && typeof _e == "object")
            try {
              _e._suppressLogging = !0;
            } catch {
            }
        }
        var V = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", N), vd.addEventListener(V, je, !1), g.initEvent(V, !1, !1), vd.dispatchEvent(g), j && Object.defineProperty(window, "event", j), k && T && (Ot ? Tt && (_e = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : _e = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(_e)), window.removeEventListener("error", N), !k)
          return P(), Cc.apply(this, arguments);
      };
    }
    var Nv = Ec, co = !1, bc = null, fo = !1, xi = null, Lv = {
      onError: function(e) {
        co = !0, bc = e;
      }
    };
    function wl(e, t, a, i, u, s, f, p, v) {
      co = !1, bc = null, Nv.apply(Lv, arguments);
    }
    function Ci(e, t, a, i, u, s, f, p, v) {
      if (wl.apply(this, arguments), co) {
        var y = us();
        fo || (fo = !0, xi = y);
      }
    }
    function ls() {
      if (fo) {
        var e = xi;
        throw fo = !1, xi = null, e;
      }
    }
    function Qi() {
      return co;
    }
    function us() {
      if (co) {
        var e = bc;
        return co = !1, bc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function po(e) {
      return e._reactInternals;
    }
    function cy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var Le = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), yn = (
      /*                    */
      2
    ), kt = (
      /*                       */
      4
    ), Da = (
      /*                */
      16
    ), Oa = (
      /*                 */
      32
    ), on = (
      /*                     */
      64
    ), Oe = (
      /*                   */
      128
    ), Er = (
      /*            */
      256
    ), Cn = (
      /*                          */
      512
    ), Qn = (
      /*                     */
      1024
    ), Gr = (
      /*                      */
      2048
    ), qr = (
      /*                    */
      4096
    ), Un = (
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
    ), Zn = (
      /*                */
      65536
    ), Rc = (
      /* */
      131072
    ), Ei = (
      /*                       */
      1048576
    ), ho = (
      /*                    */
      2097152
    ), Wi = (
      /*                 */
      4194304
    ), Tc = (
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
      kt | Qn | 0
    ), Dl = yn | kt | Da | Oa | Cn | qr | Un, Ol = kt | on | Cn | Un, Gi = Gr | Da, zn = Wi | Tc | ho, Na = D.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (yn | qr)) !== Le && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === ne ? a : null;
    }
    function Ri(e) {
      if (e.tag === we) {
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
      return e.tag === ne ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function Uv(e) {
      {
        var t = Na.current;
        if (t !== null && t.tag === le) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Xe(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = po(e);
      return u ? pa(u) === u : !1;
    }
    function wc(e) {
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
              return wc(s), e;
            if (v === u)
              return wc(s), t;
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
      if (i.tag !== ne)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Xr(e) {
      var t = kc(e);
      return t !== null ? Kr(t) : null;
    }
    function Kr(e) {
      if (e.tag === ae || e.tag === Te)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Kr(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function pn(e) {
      var t = kc(e);
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === ae || e.tag === Te)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== de) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var hd = I.unstable_scheduleCallback, zv = I.unstable_cancelCallback, md = I.unstable_shouldYield, yd = I.unstable_requestPaint, Wn = I.unstable_now, _c = I.unstable_getCurrentPriorityLevel, ss = I.unstable_ImmediatePriority, Nl = I.unstable_UserBlockingPriority, qi = I.unstable_NormalPriority, fy = I.unstable_LowPriority, mu = I.unstable_IdlePriority, Dc = I.unstable_yieldValue, Av = I.unstable_setDisableYieldValue, yu = null, Tn = null, pe = null, va = !1, Zr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function mo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        $e && (e = st({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: Ma
        })), yu = t.inject(e), Tn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function gd(e, t) {
      if (Tn && typeof Tn.onScheduleFiberRoot == "function")
        try {
          Tn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function Sd(e, t) {
      if (Tn && typeof Tn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Oe) === Oe;
          if (Be) {
            var i;
            switch (t) {
              case Lr:
                i = ss;
                break;
              case ki:
                i = Nl;
                break;
              case Ua:
                i = qi;
                break;
              case za:
                i = mu;
                break;
              default:
                i = qi;
                break;
            }
            Tn.onCommitFiberRoot(yu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, S("React instrumentation encountered an error: %s", u));
        }
    }
    function xd(e) {
      if (Tn && typeof Tn.onPostCommitFiberRoot == "function")
        try {
          Tn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Cd(e) {
      if (Tn && typeof Tn.onCommitFiberUnmount == "function")
        try {
          Tn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function gn(e) {
      if (typeof Dc == "function" && (Av(e), Ie(e)), Tn && typeof Tn.setStrictMode == "function")
        try {
          Tn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Ma(e) {
      pe = e;
    }
    function gu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Cu; a++) {
          var i = Pv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Ed(e) {
      pe !== null && typeof pe.markCommitStarted == "function" && pe.markCommitStarted(e);
    }
    function bd() {
      pe !== null && typeof pe.markCommitStopped == "function" && pe.markCommitStopped();
    }
    function ha(e) {
      pe !== null && typeof pe.markComponentRenderStarted == "function" && pe.markComponentRenderStarted(e);
    }
    function ma() {
      pe !== null && typeof pe.markComponentRenderStopped == "function" && pe.markComponentRenderStopped();
    }
    function Rd(e) {
      pe !== null && typeof pe.markComponentPassiveEffectMountStarted == "function" && pe.markComponentPassiveEffectMountStarted(e);
    }
    function jv() {
      pe !== null && typeof pe.markComponentPassiveEffectMountStopped == "function" && pe.markComponentPassiveEffectMountStopped();
    }
    function Xi(e) {
      pe !== null && typeof pe.markComponentPassiveEffectUnmountStarted == "function" && pe.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      pe !== null && typeof pe.markComponentPassiveEffectUnmountStopped == "function" && pe.markComponentPassiveEffectUnmountStopped();
    }
    function Oc(e) {
      pe !== null && typeof pe.markComponentLayoutEffectMountStarted == "function" && pe.markComponentLayoutEffectMountStarted(e);
    }
    function Fv() {
      pe !== null && typeof pe.markComponentLayoutEffectMountStopped == "function" && pe.markComponentLayoutEffectMountStopped();
    }
    function cs(e) {
      pe !== null && typeof pe.markComponentLayoutEffectUnmountStarted == "function" && pe.markComponentLayoutEffectUnmountStarted(e);
    }
    function Td() {
      pe !== null && typeof pe.markComponentLayoutEffectUnmountStopped == "function" && pe.markComponentLayoutEffectUnmountStopped();
    }
    function fs(e, t, a) {
      pe !== null && typeof pe.markComponentErrored == "function" && pe.markComponentErrored(e, t, a);
    }
    function wi(e, t, a) {
      pe !== null && typeof pe.markComponentSuspended == "function" && pe.markComponentSuspended(e, t, a);
    }
    function ds(e) {
      pe !== null && typeof pe.markLayoutEffectsStarted == "function" && pe.markLayoutEffectsStarted(e);
    }
    function ps() {
      pe !== null && typeof pe.markLayoutEffectsStopped == "function" && pe.markLayoutEffectsStopped();
    }
    function Su(e) {
      pe !== null && typeof pe.markPassiveEffectsStarted == "function" && pe.markPassiveEffectsStarted(e);
    }
    function wd() {
      pe !== null && typeof pe.markPassiveEffectsStopped == "function" && pe.markPassiveEffectsStopped();
    }
    function xu(e) {
      pe !== null && typeof pe.markRenderStarted == "function" && pe.markRenderStarted(e);
    }
    function Hv() {
      pe !== null && typeof pe.markRenderYielded == "function" && pe.markRenderYielded();
    }
    function Nc() {
      pe !== null && typeof pe.markRenderStopped == "function" && pe.markRenderStopped();
    }
    function Sn(e) {
      pe !== null && typeof pe.markRenderScheduled == "function" && pe.markRenderScheduled(e);
    }
    function Lc(e, t) {
      pe !== null && typeof pe.markForceUpdateScheduled == "function" && pe.markForceUpdateScheduled(e, t);
    }
    function vs(e, t) {
      pe !== null && typeof pe.markStateUpdateScheduled == "function" && pe.markStateUpdateScheduled(e, t);
    }
    var Me = (
      /*                         */
      0
    ), St = (
      /*                 */
      1
    ), At = (
      /*                    */
      2
    ), Jt = (
      /*               */
      8
    ), jt = (
      /*              */
      16
    ), An = Math.clz32 ? Math.clz32 : hs, Jn = Math.log, Mc = Math.LN2;
    function hs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Jn(t) / Mc | 0) | 0;
    }
    var Cu = 31, G = (
      /*                        */
      0
    ), Mt = (
      /*                          */
      0
    ), Ye = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), ri = (
      /*             */
      4
    ), br = (
      /*            */
      8
    ), wn = (
      /*                     */
      16
    ), Ki = (
      /*                */
      32
    ), Ul = (
      /*                       */
      4194240
    ), Eu = (
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
    ), jc = (
      /*                        */
      1024
    ), Fc = (
      /*                        */
      2048
    ), Hc = (
      /*                        */
      4096
    ), Pc = (
      /*                        */
      8192
    ), Vc = (
      /*                        */
      16384
    ), bu = (
      /*                       */
      32768
    ), Bc = (
      /*                       */
      65536
    ), yo = (
      /*                       */
      131072
    ), go = (
      /*                       */
      262144
    ), Ic = (
      /*                       */
      524288
    ), ms = (
      /*                       */
      1048576
    ), Yc = (
      /*                       */
      2097152
    ), ys = (
      /*                            */
      130023424
    ), Ru = (
      /*                             */
      4194304
    ), $c = (
      /*                             */
      8388608
    ), gs = (
      /*                             */
      16777216
    ), Qc = (
      /*                             */
      33554432
    ), Wc = (
      /*                             */
      67108864
    ), kd = Ru, Ss = (
      /*          */
      134217728
    ), _d = (
      /*                          */
      268435455
    ), xs = (
      /*               */
      268435456
    ), Tu = (
      /*                        */
      536870912
    ), Jr = (
      /*                   */
      1073741824
    );
    function Pv(e) {
      {
        if (e & Ye)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & br)
          return "DefaultHydration";
        if (e & wn)
          return "Default";
        if (e & Ki)
          return "TransitionHydration";
        if (e & Ul)
          return "Transition";
        if (e & ys)
          return "Retry";
        if (e & Ss)
          return "SelectiveHydration";
        if (e & xs)
          return "IdleHydration";
        if (e & Tu)
          return "Idle";
        if (e & Jr)
          return "Offscreen";
      }
    }
    var nn = -1, wu = Eu, Gc = Ru;
    function Cs(e) {
      switch (zl(e)) {
        case Ye:
          return Ye;
        case Ml:
          return Ml;
        case ri:
          return ri;
        case br:
          return br;
        case wn:
          return wn;
        case Ki:
          return Ki;
        case Eu:
        case Uc:
        case zc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case bu:
        case Bc:
        case yo:
        case go:
        case Ic:
        case ms:
        case Yc:
          return e & Ul;
        case Ru:
        case $c:
        case gs:
        case Qc:
        case Wc:
          return e & ys;
        case Ss:
          return Ss;
        case xs:
          return xs;
        case Tu:
          return Tu;
        case Jr:
          return Jr;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function qc(e, t) {
      var a = e.pendingLanes;
      if (a === G)
        return G;
      var i = G, u = e.suspendedLanes, s = e.pingedLanes, f = a & _d;
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
        var g = zl(i), k = zl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          g >= k || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          g === wn && (k & Ul) !== G
        )
          return t;
      }
      (i & ri) !== G && (i |= a & wn);
      var T = e.entangledLanes;
      if (T !== G)
        for (var U = e.entanglements, j = i & T; j > 0; ) {
          var P = jn(j), ve = 1 << P;
          i |= U[P], j &= ~ve;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = nn; t > 0; ) {
        var u = jn(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Dd(e, t) {
      switch (e) {
        case Ye:
        case Ml:
        case ri:
          return t + 250;
        case br:
        case wn:
        case Ki:
        case Eu:
        case Uc:
        case zc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case bu:
        case Bc:
        case yo:
        case go:
        case Ic:
        case ms:
        case Yc:
          return t + 5e3;
        case Ru:
        case $c:
        case gs:
        case Qc:
        case Wc:
          return nn;
        case Ss:
        case xs:
        case Tu:
        case Jr:
          return nn;
        default:
          return S("Should have found matching lanes. This is a bug in React."), nn;
      }
    }
    function Xc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p, y = s[p];
        y === nn ? ((v & i) === G || (v & u) !== G) && (s[p] = Dd(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Vv(e) {
      return Cs(e.pendingLanes);
    }
    function Kc(e) {
      var t = e.pendingLanes & ~Jr;
      return t !== G ? t : t & Jr ? Jr : G;
    }
    function Bv(e) {
      return (e & Ye) !== G;
    }
    function Es(e) {
      return (e & _d) !== G;
    }
    function ku(e) {
      return (e & ys) === e;
    }
    function Od(e) {
      var t = Ye | ri | wn;
      return (e & t) === G;
    }
    function Nd(e) {
      return (e & Ul) === e;
    }
    function Zc(e, t) {
      var a = Ml | ri | br | wn;
      return (t & a) !== G;
    }
    function Iv(e, t) {
      return (t & e.expiredLanes) !== G;
    }
    function Ld(e) {
      return (e & Ul) !== G;
    }
    function Md() {
      var e = wu;
      return wu <<= 1, (wu & Ul) === G && (wu = Eu), e;
    }
    function Yv() {
      var e = Gc;
      return Gc <<= 1, (Gc & ys) === G && (Gc = Ru), e;
    }
    function zl(e) {
      return e & -e;
    }
    function bs(e) {
      return zl(e);
    }
    function jn(e) {
      return 31 - An(e);
    }
    function or(e) {
      return jn(e);
    }
    function ea(e, t) {
      return (e & t) !== G;
    }
    function _u(e, t) {
      return (e & t) === t;
    }
    function it(e, t) {
      return e | t;
    }
    function Rs(e, t) {
      return e & ~t;
    }
    function Ud(e, t) {
      return e & t;
    }
    function $v(e) {
      return e;
    }
    function Qv(e, t) {
      return e !== Mt && e < t ? e : t;
    }
    function Ts(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function So(e, t, a) {
      e.pendingLanes |= t, t !== Tu && (e.suspendedLanes = G, e.pingedLanes = G);
      var i = e.eventTimes, u = or(t);
      i[u] = a;
    }
    function Wv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = jn(i), s = 1 << u;
        a[u] = nn, i &= ~s;
      }
    }
    function Jc(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function zd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = G, e.pingedLanes = G, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p;
        i[p] = G, u[p] = nn, s[p] = nn, f &= ~v;
      }
    }
    function ef(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = jn(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Ad(e, t) {
      var a = zl(t), i;
      switch (a) {
        case ri:
          i = Ml;
          break;
        case wn:
          i = br;
          break;
        case Eu:
        case Uc:
        case zc:
        case Ac:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case bu:
        case Bc:
        case yo:
        case go:
        case Ic:
        case ms:
        case Yc:
        case Ru:
        case $c:
        case gs:
        case Qc:
        case Wc:
          i = Ki;
          break;
        case Tu:
          i = xs;
          break;
        default:
          i = Mt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Mt ? Mt : i;
    }
    function ws(e, t, a) {
      if (Zr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = or(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Gv(e, t) {
      if (Zr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = or(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function jd(e, t) {
      return null;
    }
    var Lr = Ye, ki = ri, Ua = wn, za = Tu, ks = Mt;
    function Aa() {
      return ks;
    }
    function Fn(e) {
      ks = e;
    }
    function qv(e, t) {
      var a = ks;
      try {
        return ks = e, t();
      } finally {
        ks = a;
      }
    }
    function Xv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function _s(e, t) {
      return e > t ? e : t;
    }
    function er(e, t) {
      return e !== 0 && e < t;
    }
    function Kv(e) {
      var t = zl(e);
      return er(Lr, t) ? er(ki, t) ? Es(t) ? Ua : za : ki : Lr;
    }
    function tf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ds;
    function Rr(e) {
      Ds = e;
    }
    function dy(e) {
      Ds(e);
    }
    var Se;
    function xo(e) {
      Se = e;
    }
    var nf;
    function Zv(e) {
      nf = e;
    }
    var Jv;
    function Os(e) {
      Jv = e;
    }
    var Ns;
    function Fd(e) {
      Ns = e;
    }
    var rf = !1, Ls = [], Zi = null, _i = null, Di = null, kn = /* @__PURE__ */ new Map(), Mr = /* @__PURE__ */ new Map(), Ur = [], eh = [
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
    function Hd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Zi = null;
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
          kn.delete(a);
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
    function ta(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ii(t, a, i, u, s);
        if (t !== null) {
          var p = Do(t);
          p !== null && Se(p);
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
          return Zi = ta(Zi, e, t, a, i, s), !0;
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
          return kn.set(y, ta(kn.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var g = u, k = g.pointerId;
          return Mr.set(k, ta(Mr.get(k) || null, e, t, a, i, g)), !0;
        }
      }
      return !1;
    }
    function Pd(e) {
      var t = Ys(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === we) {
            var u = Ri(a);
            if (u !== null) {
              e.blockedOn = u, Ns(e.priority, function() {
                nf(a);
              });
              return;
            }
          } else if (i === ne) {
            var s = a.stateNode;
            if (tf(s)) {
              e.blockedOn = Ti(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function nh(e) {
      for (var t = Jv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Ur.length && er(t, Ur[i].priority); i++)
        ;
      Ur.splice(i, 0, a), i === 0 && Pd(a);
    }
    function Ms(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Eo(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          uy(s), u.target.dispatchEvent(s), oy();
        } else {
          var f = Do(i);
          return f !== null && Se(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Vd(e, t, a) {
      Ms(e) && a.delete(t);
    }
    function vy() {
      rf = !1, Zi !== null && Ms(Zi) && (Zi = null), _i !== null && Ms(_i) && (_i = null), Di !== null && Ms(Di) && (Di = null), kn.forEach(Vd), Mr.forEach(Vd);
    }
    function Al(e, t) {
      e.blockedOn === t && (e.blockedOn = null, rf || (rf = !0, I.unstable_scheduleCallback(I.unstable_NormalPriority, vy)));
    }
    function Du(e) {
      if (Ls.length > 0) {
        Al(Ls[0], e);
        for (var t = 1; t < Ls.length; t++) {
          var a = Ls[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Zi !== null && Al(Zi, e), _i !== null && Al(_i, e), Di !== null && Al(Di, e);
      var i = function(p) {
        return Al(p, e);
      };
      kn.forEach(i), Mr.forEach(i);
      for (var u = 0; u < Ur.length; u++) {
        var s = Ur[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Ur.length > 0; ) {
        var f = Ur[0];
        if (f.blockedOn !== null)
          break;
        Pd(f), f.blockedOn === null && Ur.shift();
      }
    }
    var sr = D.ReactCurrentBatchConfig, _t = !0;
    function Gn(e) {
      _t = !!e;
    }
    function Hn() {
      return _t;
    }
    function cr(e, t, a) {
      var i = af(t), u;
      switch (i) {
        case Lr:
          u = ya;
          break;
        case ki:
          u = Co;
          break;
        case Ua:
        default:
          u = _n;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = Aa(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(Lr), _n(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function Co(e, t, a, i) {
      var u = Aa(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(ki), _n(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function _n(e, t, a, i) {
      _t && Us(e, t, a, i);
    }
    function Us(e, t, a, i) {
      var u = Eo(e, t, a, i);
      if (u === null) {
        Ny(e, t, i, Oi, a), Hd(e, i);
        return;
      }
      if (py(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Hd(e, i), t & _a && th(e)) {
        for (; u !== null; ) {
          var s = Do(u);
          s !== null && dy(s);
          var f = Eo(e, t, a, i);
          if (f === null && Ny(e, t, i, Oi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Ny(e, t, i, null, a);
    }
    var Oi = null;
    function Eo(e, t, a, i) {
      Oi = null;
      var u = pd(i), s = Ys(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === we) {
            var v = Ri(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === ne) {
            var y = f.stateNode;
            if (tf(y))
              return Ti(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Oi = s, null;
    }
    function af(e) {
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
          return ki;
        case "message": {
          var t = _c();
          switch (t) {
            case ss:
              return Lr;
            case Nl:
              return ki;
            case qi:
            case fy:
              return Ua;
            case mu:
              return za;
            default:
              return Ua;
          }
        }
        default:
          return Ua;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Bd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function bo(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ga = null, Ro = null, Ou = null;
    function jl(e) {
      return ga = e, Ro = As(), !0;
    }
    function lf() {
      ga = null, Ro = null, Ou = null;
    }
    function Ji() {
      if (Ou)
        return Ou;
      var e, t = Ro, a = t.length, i, u = As(), s = u.length;
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
    function To() {
      return !0;
    }
    function js() {
      return !1;
    }
    function Tr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = To : this.isDefaultPrevented = js, this.isPropagationStopped = js, this;
      }
      return st(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = To);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = To);
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
        isPersistent: To
      }), t;
    }
    var Pn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Ni = Tr(Pn), zr = st({}, Pn, {
      view: 0,
      detail: 0
    }), ra = Tr(zr), uf, Fs, Nu;
    function hy(e) {
      e !== Nu && (Nu && e.type === "mousemove" ? (uf = e.screenX - Nu.screenX, Fs = e.screenY - Nu.screenY) : (uf = 0, Fs = 0), Nu = e);
    }
    var li = st({}, zr, {
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
        return "movementX" in e ? e.movementX : (hy(e), uf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Fs;
      }
    }), Id = Tr(li), Yd = st({}, li, {
      dataTransfer: 0
    }), Lu = Tr(Yd), $d = st({}, zr, {
      relatedTarget: 0
    }), el = Tr($d), rh = st({}, Pn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ah = Tr(rh), Qd = st({}, Pn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), of = Tr(Qd), my = st({}, Pn, {
      data: 0
    }), ih = Tr(my), lh = ih, uh = {
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
      return e.type === "keydown" || e.type === "keyup" ? Mu[e.keyCode] || "Unidentified" : "";
    }
    var wo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function oh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = wo[e];
      return i ? !!a[i] : !1;
    }
    function vn(e) {
      return oh;
    }
    var gy = st({}, zr, {
      key: yy,
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
        return e.type === "keypress" ? Fl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Fl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), sh = Tr(gy), Sy = st({}, li, {
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
    }), ch = Tr(Sy), fh = st({}, zr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vn
    }), dh = Tr(fh), xy = st({}, Pn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ja = Tr(xy), Wd = st({}, li, {
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
    }), Cy = Tr(Wd), Hl = [9, 13, 27, 32], Hs = 229, tl = Nn && "CompositionEvent" in window, Pl = null;
    Nn && "documentMode" in document && (Pl = document.documentMode);
    var Gd = Nn && "TextEvent" in window && !Pl, sf = Nn && (!tl || Pl && Pl > 8 && Pl <= 11), ph = 32, cf = String.fromCharCode(ph);
    function Ey() {
      yt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), yt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), yt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), yt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var qd = !1;
    function vh(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function ff(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function df(e, t) {
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
    function pf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function hh(e) {
      return e.locale === "ko";
    }
    var Uu = !1;
    function Kd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = ff(t) : Uu ? Xd(t, i) && (s = "onCompositionEnd") : df(t, i) && (s = "onCompositionStart"), !s)
        return null;
      sf && !hh(i) && (!Uu && s === "onCompositionStart" ? Uu = jl(u) : s === "onCompositionEnd" && Uu && (f = Ji()));
      var p = Eh(a, s);
      if (p.length > 0) {
        var v = new ih(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = pf(i);
          y !== null && (v.data = y);
        }
      }
    }
    function vf(e, t) {
      switch (e) {
        case "compositionend":
          return pf(t);
        case "keypress":
          var a = t.which;
          return a !== ph ? null : (qd = !0, cf);
        case "textInput":
          var i = t.data;
          return i === cf && qd ? null : i;
        default:
          return null;
      }
    }
    function Zd(e, t) {
      if (Uu) {
        if (e === "compositionend" || !tl && Xd(e, t)) {
          var a = Ji();
          return lf(), Uu = !1, a;
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
          return sf && !hh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function hf(e, t, a, i, u) {
      var s;
      if (Gd ? s = vf(t, i) : s = Zd(t, i), !s)
        return null;
      var f = Eh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new lh("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function mh(e, t, a, i, u, s, f) {
      Kd(e, t, a, i, u), hf(e, t, a, i, u);
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
    function Ps(e) {
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
      if (!Nn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Vs() {
      yt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function yh(e, t, a, i) {
      oo(i);
      var u = Eh(t, "onChange");
      if (u.length > 0) {
        var s = new Ni("onChange", "change", null, a, i);
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
      yh(t, n, e, pd(e)), Dv(o, t);
    }
    function o(e) {
      O0(e, 0);
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
    Nn && (m = Ry("input") && (!document.documentMode || document.documentMode > 9));
    function x(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", A);
    }
    function b() {
      Vl && (Vl.detachEvent("onpropertychange", A), Vl = null, n = null);
    }
    function A(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function X(e, t, a) {
      e === "focusin" ? (b(), x(t, a)) : e === "focusout" && b();
    }
    function Z(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function q(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function me(e, t) {
      if (e === "click")
        return c(t);
    }
    function Ce(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Re(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ae(e, "number", e.value);
    }
    function Dn(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window, v, y;
      if (r(p) ? v = d : Ps(p) ? m ? v = Ce : (v = Z, y = X) : q(p) && (v = me), v) {
        var g = v(t, a);
        if (g) {
          yh(e, g, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && Re(p);
    }
    function O() {
      Wt("onMouseEnter", ["mouseout", "mouseover"]), Wt("onMouseLeave", ["mouseout", "mouseover"]), Wt("onPointerEnter", ["pointerout", "pointerover"]), Wt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function w(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !rs(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Ys(y) || dp(y)))
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
          var j = i.relatedTarget || i.toElement;
          if (T = a, U = j ? Ys(j) : null, U !== null) {
            var P = pa(U);
            (U !== P || U.tag !== ae && U.tag !== Te) && (U = null);
          }
        } else
          T = null, U = a;
        if (T !== U) {
          var ve = Id, je = "onMouseLeave", _e = "onMouseEnter", Ot = "mouse";
          (t === "pointerout" || t === "pointerover") && (ve = ch, je = "onPointerLeave", _e = "onPointerEnter", Ot = "pointer");
          var Tt = T == null ? g : Cf(T), N = U == null ? g : Cf(U), V = new ve(je, Ot + "leave", T, i, u);
          V.target = Tt, V.relatedTarget = N;
          var L = null, J = Ys(u);
          if (J === a) {
            var ge = new ve(_e, Ot + "enter", U, i, u);
            ge.target = N, ge.relatedTarget = Tt, L = ge;
          }
          Lb(e, V, L, T, U);
        }
      }
    }
    function M(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var K = typeof Object.is == "function" ? Object.is : M;
    function Ee(e, t) {
      if (K(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!wr.call(t, s) || !K(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function Fe(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Pe(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function We(e, t) {
      for (var a = Fe(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Fe(Pe(a));
      }
    }
    function tr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Ft(e, u, s, f, p);
    }
    function Ft(e, t, a, i, u) {
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
        var y = We(e, f), g = We(e, p);
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
    function S0(e, t) {
      return !e || !t ? !1 : e === t ? !0 : gh(e) ? !1 : gh(t) ? S0(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function vb(e) {
      return e && e.ownerDocument && S0(e.ownerDocument.documentElement, e);
    }
    function hb(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function x0() {
      for (var e = window, t = ka(); t instanceof e.HTMLIFrameElement; ) {
        if (hb(t))
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
    function mb() {
      var e = x0();
      return {
        focusedElem: e,
        selectionRange: Ty(e) ? gb(e) : null
      };
    }
    function yb(e) {
      var t = x0(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && vb(a)) {
        i !== null && Ty(a) && Sb(a, i);
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
    function gb(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = tr(e), t || {
        start: 0,
        end: 0
      };
    }
    function Sb(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var xb = Nn && "documentMode" in document && document.documentMode <= 11;
    function Cb() {
      yt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var mf = null, wy = null, Jd = null, ky = !1;
    function Eb(e) {
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
    function bb(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function C0(e, t, a) {
      var i = bb(a);
      if (!(ky || mf == null || mf !== ka(i))) {
        var u = Eb(mf);
        if (!Jd || !Ee(Jd, u)) {
          Jd = u;
          var s = Eh(wy, "onSelect");
          if (s.length > 0) {
            var f = new Ni("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = mf;
          }
        }
      }
    }
    function Rb(e, t, a, i, u, s, f) {
      var p = a ? Cf(a) : window;
      switch (t) {
        // Track the input node that has focus.
        case "focusin":
          (Ps(p) || p.contentEditable === "true") && (mf = p, wy = a, Jd = null);
          break;
        case "focusout":
          mf = null, wy = null, Jd = null;
          break;
        // Don't fire the event while the user is dragging. This matches the
        // semantics of the native select event.
        case "mousedown":
          ky = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ky = !1, C0(e, i, u);
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
          if (xb)
            break;
        // falls through
        case "keydown":
        case "keyup":
          C0(e, i, u);
      }
    }
    function Sh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var yf = {
      animationend: Sh("Animation", "AnimationEnd"),
      animationiteration: Sh("Animation", "AnimationIteration"),
      animationstart: Sh("Animation", "AnimationStart"),
      transitionend: Sh("Transition", "TransitionEnd")
    }, _y = {}, E0 = {};
    Nn && (E0 = document.createElement("div").style, "AnimationEvent" in window || (delete yf.animationend.animation, delete yf.animationiteration.animation, delete yf.animationstart.animation), "TransitionEvent" in window || delete yf.transitionend.transition);
    function xh(e) {
      if (_y[e])
        return _y[e];
      if (!yf[e])
        return e;
      var t = yf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in E0)
          return _y[e] = t[a];
      return e;
    }
    var b0 = xh("animationend"), R0 = xh("animationiteration"), T0 = xh("animationstart"), w0 = xh("transitionend"), k0 = /* @__PURE__ */ new Map(), _0 = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ko(e, t) {
      k0.set(e, t), yt(t, [e]);
    }
    function Tb() {
      for (var e = 0; e < _0.length; e++) {
        var t = _0[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ko(a, "on" + i);
      }
      ko(b0, "onAnimationEnd"), ko(R0, "onAnimationIteration"), ko(T0, "onAnimationStart"), ko("dblclick", "onDoubleClick"), ko("focusin", "onFocus"), ko("focusout", "onBlur"), ko(w0, "onTransitionEnd");
    }
    function wb(e, t, a, i, u, s, f) {
      var p = k0.get(t);
      if (p !== void 0) {
        var v = Ni, y = t;
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
            v = Id;
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
            v = dh;
            break;
          case b0:
          case R0:
          case T0:
            v = ah;
            break;
          case w0:
            v = ja;
            break;
          case "scroll":
            v = ra;
            break;
          case "wheel":
            v = Cy;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = of;
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
          t === "scroll", T = Ob(a, p, i.type, g, k);
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
    Tb(), O(), Vs(), Cb(), Ey();
    function kb(e, t, a, i, u, s, f) {
      wb(e, t, a, i, u, s);
      var p = (s & dd) === 0;
      p && (w(e, t, a, i, u), Dn(e, t, a, i, u), Rb(e, t, a, i, u), mh(e, t, a, i, u));
    }
    var ep = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Dy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(ep));
    function D0(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function _b(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          D0(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var g = t[y], k = g.instance, T = g.currentTarget, U = g.listener;
          if (k !== i && e.isPropagationStopped())
            return;
          D0(e, U, T), i = k;
        }
    }
    function O0(e, t) {
      for (var a = (t & _a) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        _b(s, f, a);
      }
      ls();
    }
    function Db(e, t, a, i, u) {
      var s = pd(a), f = [];
      kb(f, e, i, a, s, t), O0(f, t);
    }
    function xn(e, t) {
      Dy.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = i1(t), u = Mb(e);
      i.has(u) || (N0(t, e, hc, a), i.add(u));
    }
    function Oy(e, t, a) {
      Dy.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= _a), N0(a, e, i, t);
    }
    var Ch = "_reactListening" + Math.random().toString(36).slice(2);
    function tp(e) {
      if (!e[Ch]) {
        e[Ch] = !0, ft.forEach(function(a) {
          a !== "selectionchange" && (Dy.has(a) || Oy(a, !1, e), Oy(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[Ch] || (t[Ch] = !0, Oy("selectionchange", !1, t)));
      }
    }
    function N0(e, t, a, i, u) {
      var s = cr(e, t, a), f = void 0;
      is && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Bd(e, t, s, f) : na(e, t, s) : f !== void 0 ? bo(e, t, s, f) : zs(e, t, s);
    }
    function L0(e, t) {
      return e === t || e.nodeType === Mn && e.parentNode === t;
    }
    function Ny(e, t, a, i, u) {
      var s = i;
      if ((t & fd) === 0 && (t & hc) === 0) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === ne || v === de) {
              var y = p.stateNode.containerInfo;
              if (L0(y, f))
                break;
              if (v === de)
                for (var g = p.return; g !== null; ) {
                  var k = g.tag;
                  if (k === ne || k === de) {
                    var T = g.stateNode.containerInfo;
                    if (L0(T, f))
                      return;
                  }
                  g = g.return;
                }
              for (; y !== null; ) {
                var U = Ys(y);
                if (U === null)
                  return;
                var j = U.tag;
                if (j === ae || j === Te) {
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
        return Db(e, t, a, s);
      });
    }
    function np(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function Ob(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, g = null; y !== null; ) {
        var k = y, T = k.stateNode, U = k.tag;
        if (U === ae && T !== null && (g = T, p !== null)) {
          var j = Tl(y, p);
          j != null && v.push(np(y, j, g));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function Eh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === ae && f !== null) {
          var v = f, y = Tl(u, a);
          y != null && i.unshift(np(u, y, v));
          var g = Tl(u, t);
          g != null && i.push(np(u, g, v));
        }
        u = u.return;
      }
      return i;
    }
    function gf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ae);
      return e || null;
    }
    function Nb(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = gf(s))
        u++;
      for (var f = 0, p = i; p; p = gf(p))
        f++;
      for (; u - f > 0; )
        a = gf(a), u--;
      for (; f - u > 0; )
        i = gf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = gf(a), i = gf(i);
      }
      return null;
    }
    function M0(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, g = v.stateNode, k = v.tag;
        if (y !== null && y === i)
          break;
        if (k === ae && g !== null) {
          var T = g;
          if (u) {
            var U = Tl(p, s);
            U != null && f.unshift(np(p, U, T));
          } else if (!u) {
            var j = Tl(p, s);
            j != null && f.push(np(p, j, T));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function Lb(e, t, a, i, u) {
      var s = i && u ? Nb(i, u) : null;
      i !== null && M0(e, t, i, s, !1), u !== null && a !== null && M0(e, a, u, s, !0);
    }
    function Mb(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, rp = "dangerouslySetInnerHTML", bh = "suppressContentEditableWarning", _o = "suppressHydrationWarning", U0 = "autoFocus", Bs = "children", Is = "style", Rh = "__html", Ly, Th, ap, z0, wh, A0, j0;
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
      od(e, t), pc(e, t), wv(e, t, {
        registrationNameDependencies: ot,
        possibleRegistrationNames: dt
      });
    }, A0 = Nn && !document.documentMode, ap = function(e, t, a) {
      if (!Fa) {
        var i = kh(a), u = kh(t);
        u !== i && (Fa = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, z0 = function(e) {
      if (!Fa) {
        Fa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, wh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, j0 = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var Ub = /\r\n?/g, zb = /\u0000|\uFFFD/g;
    function kh(e) {
      Xn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(Ub, `
`).replace(zb, "");
    }
    function _h(e, t, a, i) {
      var u = kh(t), s = kh(e);
      if (s !== u && (i && (Fa || (Fa = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Y))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function F0(e) {
      return e.nodeType === $i ? e : e.ownerDocument;
    }
    function Ab() {
    }
    function Dh(e) {
      e.onclick = Ab;
    }
    function jb(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Is)
            f && Object.freeze(f), xv(t, f);
          else if (s === rp) {
            var p = f ? f[Rh] : void 0;
            p != null && ov(t, p);
          } else if (s === Bs)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && ao(t, f);
            } else typeof f == "number" && ao(t, "" + f);
          else s === bh || s === _o || s === U0 || (ot.hasOwnProperty(s) ? f != null && (typeof f != "function" && wh(s, f), s === "onScroll" && xn("scroll", t)) : f != null && kr(t, s, f, u));
        }
    }
    function Fb(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Is ? xv(e, f) : s === rp ? ov(e, f) : s === Bs ? ao(e, f) : kr(e, s, f, i);
      }
    }
    function Hb(e, t, a, i) {
      var u, s = F0(a), f, p = i;
      if (p === Ii && (p = td(e)), p === Ii) {
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
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !wr.call(Ly, e) && (Ly[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function Pb(e, t) {
      return F0(t).createTextNode(e);
    }
    function Vb(e, t, a, i) {
      var u = bl(t, a);
      Th(t, a);
      var s;
      switch (t) {
        case "dialog":
          xn("cancel", e), xn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          xn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < ep.length; f++)
            xn(ep[f], e);
          s = a;
          break;
        case "source":
          xn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          xn("error", e), xn("load", e), s = a;
          break;
        case "details":
          xn("toggle", e), s = a;
          break;
        case "input":
          ei(e, a), s = ro(e, a), xn("invalid", e);
          break;
        case "option":
          Lt(e, a), s = a;
          break;
        case "select":
          ou(e, a), s = Xo(e, a), xn("invalid", e);
          break;
        case "textarea":
          Zf(e, a), s = Kf(e, a), xn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (fc(t, s), jb(t, e, i, s, u), t) {
        case "input":
          Ja(e), z(e, a, !1);
          break;
        case "textarea":
          Ja(e), lv(e);
          break;
        case "option":
          un(e, a);
          break;
        case "select":
          qf(e, a);
          break;
        default:
          typeof s.onClick == "function" && Dh(e);
          break;
      }
    }
    function Bb(e, t, a, i, u) {
      Th(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ro(e, a), p = ro(e, i), s = [];
          break;
        case "select":
          f = Xo(e, a), p = Xo(e, i), s = [];
          break;
        case "textarea":
          f = Kf(e, a), p = Kf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && Dh(e);
          break;
      }
      fc(t, p);
      var v, y, g = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Is) {
            var k = f[v];
            for (y in k)
              k.hasOwnProperty(y) && (g || (g = {}), g[y] = "");
          } else v === rp || v === Bs || v === bh || v === _o || v === U0 || (ot.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var T = p[v], U = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || T === U || T == null && U == null))
          if (v === Is)
            if (T && Object.freeze(T), U) {
              for (y in U)
                U.hasOwnProperty(y) && (!T || !T.hasOwnProperty(y)) && (g || (g = {}), g[y] = "");
              for (y in T)
                T.hasOwnProperty(y) && U[y] !== T[y] && (g || (g = {}), g[y] = T[y]);
            } else
              g || (s || (s = []), s.push(v, g)), g = T;
          else if (v === rp) {
            var j = T ? T[Rh] : void 0, P = U ? U[Rh] : void 0;
            j != null && P !== j && (s = s || []).push(v, j);
          } else v === Bs ? (typeof T == "string" || typeof T == "number") && (s = s || []).push(v, "" + T) : v === bh || v === _o || (ot.hasOwnProperty(v) ? (T != null && (typeof T != "function" && wh(v, T), v === "onScroll" && xn("scroll", e)), !s && U !== T && (s = [])) : (s = s || []).push(v, T));
      }
      return g && (iy(g, p[Is]), (s = s || []).push(Is, g)), s;
    }
    function Ib(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = bl(a, i), f = bl(a, u);
      switch (Fb(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          iv(e, u);
          break;
        case "select":
          oc(e, u);
          break;
      }
    }
    function Yb(e) {
      {
        var t = e.toLowerCase();
        return ts.hasOwnProperty(t) && ts[t] || null;
      }
    }
    function $b(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = bl(t, a), Th(t, a), t) {
        case "dialog":
          xn("cancel", e), xn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          xn("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < ep.length; y++)
            xn(ep[y], e);
          break;
        case "source":
          xn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          xn("error", e), xn("load", e);
          break;
        case "details":
          xn("toggle", e);
          break;
        case "input":
          ei(e, a), xn("invalid", e);
          break;
        case "option":
          Lt(e, a);
          break;
        case "select":
          ou(e, a), xn("invalid", e);
          break;
        case "textarea":
          Zf(e, a), xn("invalid", e);
          break;
      }
      fc(t, a);
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
      for (var j in a)
        if (a.hasOwnProperty(j)) {
          var P = a[j];
          if (j === Bs)
            typeof P == "string" ? e.textContent !== P && (a[_o] !== !0 && _h(e.textContent, P, s, f), U = [Bs, P]) : typeof P == "number" && e.textContent !== "" + P && (a[_o] !== !0 && _h(e.textContent, P, s, f), U = [Bs, "" + P]);
          else if (ot.hasOwnProperty(j))
            P != null && (typeof P != "function" && wh(j, P), j === "onScroll" && xn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var ve = void 0, je = an(j);
            if (a[_o] !== !0) {
              if (!(j === bh || j === _o || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              j === "value" || j === "checked" || j === "selected")) {
                if (j === rp) {
                  var _e = e.innerHTML, Ot = P ? P[Rh] : void 0;
                  if (Ot != null) {
                    var Tt = j0(e, Ot);
                    Tt !== _e && ap(j, _e, Tt);
                  }
                } else if (j === Is) {
                  if (v.delete(j), A0) {
                    var N = ry(P);
                    ve = e.getAttribute("style"), N !== ve && ap(j, ve, N);
                  }
                } else if (p && !_)
                  v.delete(j.toLowerCase()), ve = tu(e, j, P), P !== ve && ap(j, ve, P);
                else if (!hn(j, je, p) && !Kn(j, P, je, p)) {
                  var V = !1;
                  if (je !== null)
                    v.delete(je.attributeName), ve = vl(e, j, P, je);
                  else {
                    var L = i;
                    if (L === Ii && (L = td(t)), L === Ii)
                      v.delete(j.toLowerCase());
                    else {
                      var J = Yb(j);
                      J !== null && J !== j && (V = !0, v.delete(J)), v.delete(j);
                    }
                    ve = tu(e, j, P);
                  }
                  var ge = _;
                  !ge && P !== ve && !V && ap(j, ve, P);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[_o] !== !0 && z0(v), t) {
        case "input":
          Ja(e), z(e, a, !0);
          break;
        case "textarea":
          Ja(e), lv(e);
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
    function Qb(e, t, a) {
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
    function Uy(e, t) {
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
    function Ay(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function Wb(e, t, a) {
      switch (t) {
        case "input":
          H(e, a);
          return;
        case "textarea":
          Jm(e, a);
          return;
        case "select":
          Xf(e, a);
          return;
      }
    }
    var ip = function() {
    }, lp = function() {
    };
    {
      var Gb = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], H0 = [
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
      ], qb = H0.concat(["button"]), Xb = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], P0 = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      lp = function(e, t) {
        var a = st({}, e || P0), i = {
          tag: t
        };
        return H0.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), qb.indexOf(t) !== -1 && (a.pTagInButtonScope = null), Gb.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var Kb = function(e, t) {
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
            return Xb.indexOf(t) === -1;
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
      }, Zb = function(e, t) {
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
      }, V0 = {};
      ip = function(e, t, a) {
        a = a || P0;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = Kb(e, u) ? null : i, f = s ? null : Zb(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!V0[y]) {
            V0[y] = !0;
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
    var Oh = "suppressHydrationWarning", Nh = "$", Lh = "/$", up = "$?", op = "$!", Jb = "style", jy = null, Fy = null;
    function eR(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case $i:
        case rd: {
          t = i === $i ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : nd(null, "");
          break;
        }
        default: {
          var s = i === Mn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = nd(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = lp(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function tR(e, t, a) {
      {
        var i = e, u = nd(i.namespace, t), s = lp(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function N_(e) {
      return e;
    }
    function nR(e) {
      jy = Hn(), Fy = mb();
      var t = null;
      return Gn(!1), t;
    }
    function rR(e) {
      yb(Fy), Gn(jy), jy = null, Fy = null;
    }
    function aR(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (ip(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = lp(f.ancestorInfo, e);
          ip(null, p, v);
        }
        s = f.namespace;
      }
      var y = Hb(e, t, a, s);
      return fp(u, y), Qy(y, t), y;
    }
    function iR(e, t) {
      e.appendChild(t);
    }
    function lR(e, t, a, i, u) {
      switch (Vb(e, t, a, i), t) {
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
    function uR(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = lp(f.ancestorInfo, t);
          ip(null, p, v);
        }
      }
      return Bb(e, t, a, i);
    }
    function Hy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function oR(e, t, a, i) {
      {
        var u = a;
        ip(null, e, u.ancestorInfo);
      }
      var s = Pb(e, t);
      return fp(i, s), s;
    }
    function sR() {
      var e = window.event;
      return e === void 0 ? Ua : af(e.type);
    }
    var Py = typeof setTimeout == "function" ? setTimeout : void 0, cR = typeof clearTimeout == "function" ? clearTimeout : void 0, Vy = -1, B0 = typeof Promise == "function" ? Promise : void 0, fR = typeof queueMicrotask == "function" ? queueMicrotask : typeof B0 < "u" ? function(e) {
      return B0.resolve(null).then(e).catch(dR);
    } : Py;
    function dR(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function pR(e, t, a, i) {
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
    function vR(e, t, a, i, u, s) {
      Ib(e, t, a, i, u), Qy(e, u);
    }
    function I0(e) {
      ao(e, "");
    }
    function hR(e, t, a) {
      e.nodeValue = a;
    }
    function mR(e, t) {
      e.appendChild(t);
    }
    function yR(e, t) {
      var a;
      e.nodeType === Mn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Dh(a);
    }
    function gR(e, t, a) {
      e.insertBefore(t, a);
    }
    function SR(e, t, a) {
      e.nodeType === Mn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function xR(e, t) {
      e.removeChild(t);
    }
    function CR(e, t) {
      e.nodeType === Mn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function By(e, t) {
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
          else (s === Nh || s === up || s === op) && i++;
        }
        a = u;
      } while (a);
      Du(t);
    }
    function ER(e, t) {
      e.nodeType === Mn ? By(e.parentNode, t) : e.nodeType === Wr && By(e, t), Du(e);
    }
    function bR(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function RR(e) {
      e.nodeValue = "";
    }
    function TR(e, t) {
      e = e;
      var a = t[Jb], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = cc("display", i);
    }
    function wR(e, t) {
      e.nodeValue = t;
    }
    function kR(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function _R(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function DR(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function OR(e) {
      return e.nodeType !== Mn ? null : e;
    }
    function Y0(e) {
      return e.data === up;
    }
    function Iy(e) {
      return e.data === op;
    }
    function NR(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function LR(e, t) {
      e._reactRetry = t;
    }
    function Mh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Wr || t === Yi)
          break;
        if (t === Mn) {
          var a = e.data;
          if (a === Nh || a === op || a === up)
            break;
          if (a === Lh)
            return null;
        }
      }
      return e;
    }
    function sp(e) {
      return Mh(e.nextSibling);
    }
    function MR(e) {
      return Mh(e.firstChild);
    }
    function UR(e) {
      return Mh(e.firstChild);
    }
    function zR(e) {
      return Mh(e.nextSibling);
    }
    function AR(e, t, a, i, u, s, f) {
      fp(s, e), Qy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & St) !== Me;
      return $b(e, t, a, p, i, y, f);
    }
    function jR(e, t, a, i) {
      return fp(a, e), a.mode & St, Qb(e, t);
    }
    function FR(e, t) {
      fp(t, e);
    }
    function HR(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Lh) {
            if (a === 0)
              return sp(t);
            a--;
          } else (i === Nh || i === op || i === up) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function $0(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Nh || i === op || i === up) {
            if (a === 0)
              return t;
            a--;
          } else i === Lh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function PR(e) {
      Du(e);
    }
    function VR(e) {
      Du(e);
    }
    function BR(e) {
      return e !== "head" && e !== "body";
    }
    function IR(e, t, a, i) {
      var u = !0;
      _h(t.nodeValue, a, i, u);
    }
    function YR(e, t, a, i, u, s) {
      if (t[Oh] !== !0) {
        var f = !0;
        _h(i.nodeValue, u, s, f);
      }
    }
    function $R(e, t) {
      t.nodeType === Wr ? My(e, t) : t.nodeType === Mn || Uy(e, t);
    }
    function QR(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? My(a, t) : t.nodeType === Mn || Uy(a, t));
      }
    }
    function WR(e, t, a, i, u) {
      (u || t[Oh] !== !0) && (i.nodeType === Wr ? My(a, i) : i.nodeType === Mn || Uy(a, i));
    }
    function GR(e, t, a) {
      zy(e, t);
    }
    function qR(e, t) {
      Ay(e, t);
    }
    function XR(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && zy(i, t);
      }
    }
    function KR(e, t) {
      {
        var a = e.parentNode;
        a !== null && Ay(a, t);
      }
    }
    function ZR(e, t, a, i, u, s) {
      (s || t[Oh] !== !0) && zy(a, i);
    }
    function JR(e, t, a, i, u) {
      (u || t[Oh] !== !0) && Ay(a, i);
    }
    function e1(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function t1(e) {
      tp(e);
    }
    var Sf = Math.random().toString(36).slice(2), xf = "__reactFiber$" + Sf, Yy = "__reactProps$" + Sf, cp = "__reactContainer$" + Sf, $y = "__reactEvents$" + Sf, n1 = "__reactListeners$" + Sf, r1 = "__reactHandles$" + Sf;
    function a1(e) {
      delete e[xf], delete e[Yy], delete e[$y], delete e[n1], delete e[r1];
    }
    function fp(e, t) {
      t[xf] = e;
    }
    function Uh(e, t) {
      t[cp] = e;
    }
    function Q0(e) {
      e[cp] = null;
    }
    function dp(e) {
      return !!e[cp];
    }
    function Ys(e) {
      var t = e[xf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[cp] || a[xf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = $0(e); u !== null; ) {
              var s = u[xf];
              if (s)
                return s;
              u = $0(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Do(e) {
      var t = e[xf] || e[cp];
      return t && (t.tag === ae || t.tag === Te || t.tag === we || t.tag === ne) ? t : null;
    }
    function Cf(e) {
      if (e.tag === ae || e.tag === Te)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function zh(e) {
      return e[Yy] || null;
    }
    function Qy(e, t) {
      e[Yy] = t;
    }
    function i1(e) {
      var t = e[$y];
      return t === void 0 && (t = e[$y] = /* @__PURE__ */ new Set()), t;
    }
    var W0 = {}, G0 = D.ReactDebugCurrentFrame;
    function Ah(e) {
      if (e) {
        var t = e._owner, a = Pi(e.type, e._source, t ? t.type : null);
        G0.setExtraStackFrame(a);
      } else
        G0.setExtraStackFrame(null);
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
            p && !(p instanceof Error) && (Ah(u), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), Ah(null)), p instanceof Error && !(p.message in W0) && (W0[p.message] = !0, Ah(u), S("Failed %s type: %s", a, p.message), Ah(null));
          }
      }
    }
    var Wy = [], jh;
    jh = [];
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
      t !== jh[zu] && S("Unexpected Fiber popped."), e.current = Wy[zu], Wy[zu] = null, jh[zu] = null, zu--;
    }
    function ia(e, t, a) {
      zu++, Wy[zu] = e.current, jh[zu] = a, e.current = t;
    }
    var Gy;
    Gy = {};
    var ui = {};
    Object.freeze(ui);
    var Au = Oo(ui), Il = Oo(!1), qy = ui;
    function Ef(e, t, a) {
      return a && Yl(t) ? qy : Au.current;
    }
    function q0(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function bf(e, t) {
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
          var p = Xe(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && q0(e, t, s), s;
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
    function Xy(e) {
      aa(Il, e), aa(Au, e);
    }
    function X0(e, t, a) {
      {
        if (Au.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(Au, t, e), ia(Il, a, e);
      }
    }
    function K0(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Xe(e) || "Unknown";
            Gy[s] || (Gy[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((Xe(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Xe(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return st({}, a, f);
      }
    }
    function Ph(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return qy = Au.current, ia(Au, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function Z0(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = K0(e, t, qy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(Au, e), ia(Au, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function l1(e) {
      {
        if (!hu(e) || e.tag !== le)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case ne:
              return t.stateNode.context;
            case le: {
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
    var No = 0, Vh = 1, ju = null, Ky = !1, Zy = !1;
    function J0(e) {
      ju === null ? ju = [e] : ju.push(e);
    }
    function u1(e) {
      Ky = !0, J0(e);
    }
    function ex() {
      Ky && Lo();
    }
    function Lo() {
      if (!Zy && ju !== null) {
        Zy = !0;
        var e = 0, t = Aa();
        try {
          var a = !0, i = ju;
          for (Fn(Lr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          ju = null, Ky = !1;
        } catch (s) {
          throw ju !== null && (ju = ju.slice(e + 1)), hd(ss, Lo), s;
        } finally {
          Fn(t), Zy = !1;
        }
      }
      return null;
    }
    var Rf = [], Tf = 0, Bh = null, Ih = 0, Li = [], Mi = 0, $s = null, Fu = 1, Hu = "";
    function o1(e) {
      return Ws(), (e.flags & Ei) !== Le;
    }
    function s1(e) {
      return Ws(), Ih;
    }
    function c1() {
      var e = Hu, t = Fu, a = t & ~f1(t);
      return a.toString(32) + e;
    }
    function Qs(e, t) {
      Ws(), Rf[Tf++] = Ih, Rf[Tf++] = Bh, Bh = e, Ih = t;
    }
    function tx(e, t, a) {
      Ws(), Li[Mi++] = Fu, Li[Mi++] = Hu, Li[Mi++] = $s, $s = e;
      var i = Fu, u = Hu, s = Yh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Yh(t) + s;
      if (v > 30) {
        var y = s - s % 5, g = (1 << y) - 1, k = (f & g).toString(32), T = f >> y, U = s - y, j = Yh(t) + U, P = p << U, ve = P | T, je = k + u;
        Fu = 1 << j | ve, Hu = je;
      } else {
        var _e = p << s, Ot = _e | f, Tt = u;
        Fu = 1 << v | Ot, Hu = Tt;
      }
    }
    function Jy(e) {
      Ws();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Qs(e, a), tx(e, a, i);
      }
    }
    function Yh(e) {
      return 32 - An(e);
    }
    function f1(e) {
      return 1 << Yh(e) - 1;
    }
    function eg(e) {
      for (; e === Bh; )
        Bh = Rf[--Tf], Rf[Tf] = null, Ih = Rf[--Tf], Rf[Tf] = null;
      for (; e === $s; )
        $s = Li[--Mi], Li[Mi] = null, Hu = Li[--Mi], Li[Mi] = null, Fu = Li[--Mi], Li[Mi] = null;
    }
    function d1() {
      return Ws(), $s !== null ? {
        id: Fu,
        overflow: Hu
      } : null;
    }
    function p1(e, t) {
      Ws(), Li[Mi++] = Fu, Li[Mi++] = Hu, Li[Mi++] = $s, Fu = t.id, Hu = t.overflow, $s = e;
    }
    function Ws() {
      jr() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ar = null, Ui = null, rl = !1, Gs = !1, Mo = null;
    function v1() {
      rl && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function nx() {
      Gs = !0;
    }
    function h1() {
      return Gs;
    }
    function m1(e) {
      var t = e.stateNode.containerInfo;
      return Ui = UR(t), Ar = e, rl = !0, Mo = null, Gs = !1, !0;
    }
    function y1(e, t, a) {
      return Ui = zR(t), Ar = e, rl = !0, Mo = null, Gs = !1, a !== null && p1(e, a), !0;
    }
    function rx(e, t) {
      switch (e.tag) {
        case ne: {
          $R(e.stateNode.containerInfo, t);
          break;
        }
        case ae: {
          var a = (e.mode & St) !== Me;
          WR(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case we: {
          var i = e.memoizedState;
          i.dehydrated !== null && QR(i.dehydrated, t);
          break;
        }
      }
    }
    function ax(e, t) {
      rx(e, t);
      var a = Ck();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Da) : i.push(a);
    }
    function tg(e, t) {
      {
        if (Gs)
          return;
        switch (e.tag) {
          case ne: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ae:
                var i = t.type;
                t.pendingProps, GR(a, i);
                break;
              case Te:
                var u = t.pendingProps;
                qR(a, u);
                break;
            }
            break;
          }
          case ae: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ae: {
                var v = t.type, y = t.pendingProps, g = (e.mode & St) !== Me;
                ZR(
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
              case Te: {
                var k = t.pendingProps, T = (e.mode & St) !== Me;
                JR(
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
          case we: {
            var U = e.memoizedState, j = U.dehydrated;
            if (j !== null) switch (t.tag) {
              case ae:
                var P = t.type;
                t.pendingProps, XR(j, P);
                break;
              case Te:
                var ve = t.pendingProps;
                KR(j, ve);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function ix(e, t) {
      t.flags = t.flags & ~qr | yn, tg(e, t);
    }
    function lx(e, t) {
      switch (e.tag) {
        case ae: {
          var a = e.type;
          e.pendingProps;
          var i = _R(t, a);
          return i !== null ? (e.stateNode = i, Ar = e, Ui = MR(i), !0) : !1;
        }
        case Te: {
          var u = e.pendingProps, s = DR(t, u);
          return s !== null ? (e.stateNode = s, Ar = e, Ui = null, !0) : !1;
        }
        case we: {
          var f = OR(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: d1(),
              retryLane: Jr
            };
            e.memoizedState = p;
            var v = Ek(f);
            return v.return = e, e.child = v, Ar = e, Ui = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function ng(e) {
      return (e.mode & St) !== Me && (e.flags & Oe) === Le;
    }
    function rg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function ag(e) {
      if (rl) {
        var t = Ui;
        if (!t) {
          ng(e) && (tg(Ar, e), rg()), ix(Ar, e), rl = !1, Ar = e;
          return;
        }
        var a = t;
        if (!lx(e, t)) {
          ng(e) && (tg(Ar, e), rg()), t = sp(a);
          var i = Ar;
          if (!t || !lx(e, t)) {
            ix(Ar, e), rl = !1, Ar = e;
            return;
          }
          ax(i, a);
        }
      }
    }
    function g1(e, t, a) {
      var i = e.stateNode, u = !Gs, s = AR(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function S1(e) {
      var t = e.stateNode, a = e.memoizedProps, i = jR(t, a, e);
      if (i) {
        var u = Ar;
        if (u !== null)
          switch (u.tag) {
            case ne: {
              var s = u.stateNode.containerInfo, f = (u.mode & St) !== Me;
              IR(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ae: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, g = (u.mode & St) !== Me;
              YR(
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
    function x1(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      FR(a, e);
    }
    function C1(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return HR(a);
    }
    function ux(e) {
      for (var t = e.return; t !== null && t.tag !== ae && t.tag !== ne && t.tag !== we; )
        t = t.return;
      Ar = t;
    }
    function $h(e) {
      if (e !== Ar)
        return !1;
      if (!rl)
        return ux(e), rl = !0, !1;
      if (e.tag !== ne && (e.tag !== ae || BR(e.type) && !Hy(e.type, e.memoizedProps))) {
        var t = Ui;
        if (t)
          if (ng(e))
            ox(e), rg();
          else
            for (; t; )
              ax(e, t), t = sp(t);
      }
      return ux(e), e.tag === we ? Ui = C1(e) : Ui = Ar ? sp(e.stateNode) : null, !0;
    }
    function E1() {
      return rl && Ui !== null;
    }
    function ox(e) {
      for (var t = Ui; t; )
        rx(e, t), t = sp(t);
    }
    function wf() {
      Ar = null, Ui = null, rl = !1, Gs = !1;
    }
    function sx() {
      Mo !== null && (nE(Mo), Mo = null);
    }
    function jr() {
      return rl;
    }
    function ig(e) {
      Mo === null ? Mo = [e] : Mo.push(e);
    }
    var b1 = D.ReactCurrentBatchConfig, R1 = null;
    function T1() {
      return b1.transition;
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
      var w1 = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Jt && (t = a), a = a.return;
        return t;
      }, qs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, pp = [], vp = [], hp = [], mp = [], yp = [], gp = [], Xs = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Xs.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && pp.push(e), e.mode & Jt && typeof t.UNSAFE_componentWillMount == "function" && vp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && hp.push(e), e.mode & Jt && typeof t.UNSAFE_componentWillReceiveProps == "function" && mp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && yp.push(e), e.mode & Jt && typeof t.UNSAFE_componentWillUpdate == "function" && gp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        pp.length > 0 && (pp.forEach(function(T) {
          e.add(Xe(T) || "Component"), Xs.add(T.type);
        }), pp = []);
        var t = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(T) {
          t.add(Xe(T) || "Component"), Xs.add(T.type);
        }), vp = []);
        var a = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(T) {
          a.add(Xe(T) || "Component"), Xs.add(T.type);
        }), hp = []);
        var i = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(T) {
          i.add(Xe(T) || "Component"), Xs.add(T.type);
        }), mp = []);
        var u = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(T) {
          u.add(Xe(T) || "Component"), Xs.add(T.type);
        }), yp = []);
        var s = /* @__PURE__ */ new Set();
        if (gp.length > 0 && (gp.forEach(function(T) {
          s.add(Xe(T) || "Component"), Xs.add(T.type);
        }), gp = []), t.size > 0) {
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
          Ve(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var g = qs(a);
          Ve(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, g);
        }
        if (u.size > 0) {
          var k = qs(u);
          Ve(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, k);
        }
      };
      var Qh = /* @__PURE__ */ new Map(), cx = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = w1(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!cx.has(e.type)) {
          var i = Qh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Qh.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        Qh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(Xe(s) || "Component"), cx.add(s.type);
            });
            var u = qs(i);
            try {
              Xt(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              fn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        pp = [], vp = [], hp = [], mp = [], yp = [], gp = [], Qh = /* @__PURE__ */ new Map();
      };
    }
    var lg, ug, og, sg, cg, fx = function(e, t) {
    };
    lg = !1, ug = !1, og = {}, sg = {}, cg = {}, fx = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Xe(t) || "Component";
        sg[a] || (sg[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function k1(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Sp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Jt || B) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== le) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !k1(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = Xe(e) || "Component";
          og[u] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), og[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== le)
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
    function Wh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Gh(e) {
      {
        var t = Xe(e) || "Component";
        if (cg[t])
          return;
        cg[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function dx(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function px(e) {
      function t(N, V) {
        if (e) {
          var L = N.deletions;
          L === null ? (N.deletions = [V], N.flags |= Da) : L.push(V);
        }
      }
      function a(N, V) {
        if (!e)
          return null;
        for (var L = V; L !== null; )
          t(N, L), L = L.sibling;
        return null;
      }
      function i(N, V) {
        for (var L = /* @__PURE__ */ new Map(), J = V; J !== null; )
          J.key !== null ? L.set(J.key, J) : L.set(J.index, J), J = J.sibling;
        return L;
      }
      function u(N, V) {
        var L = ic(N, V);
        return L.index = 0, L.sibling = null, L;
      }
      function s(N, V, L) {
        if (N.index = L, !e)
          return N.flags |= Ei, V;
        var J = N.alternate;
        if (J !== null) {
          var ge = J.index;
          return ge < V ? (N.flags |= yn, V) : ge;
        } else
          return N.flags |= yn, V;
      }
      function f(N) {
        return e && N.alternate === null && (N.flags |= yn), N;
      }
      function p(N, V, L, J) {
        if (V === null || V.tag !== Te) {
          var ge = i0(L, N.mode, J);
          return ge.return = N, ge;
        } else {
          var he = u(V, L);
          return he.return = N, he;
        }
      }
      function v(N, V, L, J) {
        var ge = L.type;
        if (ge === di)
          return g(N, V, L.props.children, J, L.key);
        if (V !== null && (V.elementType === ge || // Keep this check inline so it only runs on the false path:
        gE(V, L) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof ge == "object" && ge !== null && ge.$$typeof === Ze && dx(ge) === V.type)) {
          var he = u(V, L.props);
          return he.ref = Sp(N, V, L), he.return = N, he._debugSource = L._source, he._debugOwner = L._owner, he;
        }
        var Qe = a0(L, N.mode, J);
        return Qe.ref = Sp(N, V, L), Qe.return = N, Qe;
      }
      function y(N, V, L, J) {
        if (V === null || V.tag !== de || V.stateNode.containerInfo !== L.containerInfo || V.stateNode.implementation !== L.implementation) {
          var ge = l0(L, N.mode, J);
          return ge.return = N, ge;
        } else {
          var he = u(V, L.children || []);
          return he.return = N, he;
        }
      }
      function g(N, V, L, J, ge) {
        if (V === null || V.tag !== et) {
          var he = Yo(L, N.mode, J, ge);
          return he.return = N, he;
        } else {
          var Qe = u(V, L);
          return Qe.return = N, Qe;
        }
      }
      function k(N, V, L) {
        if (typeof V == "string" && V !== "" || typeof V == "number") {
          var J = i0("" + V, N.mode, L);
          return J.return = N, J;
        }
        if (typeof V == "object" && V !== null) {
          switch (V.$$typeof) {
            case _r: {
              var ge = a0(V, N.mode, L);
              return ge.ref = Sp(N, null, V), ge.return = N, ge;
            }
            case ar: {
              var he = l0(V, N.mode, L);
              return he.return = N, he;
            }
            case Ze: {
              var Qe = V._payload, tt = V._init;
              return k(N, tt(Qe), L);
            }
          }
          if (vt(V) || at(V)) {
            var tn = Yo(V, N.mode, L, null);
            return tn.return = N, tn;
          }
          Wh(N, V);
        }
        return typeof V == "function" && Gh(N), null;
      }
      function T(N, V, L, J) {
        var ge = V !== null ? V.key : null;
        if (typeof L == "string" && L !== "" || typeof L == "number")
          return ge !== null ? null : p(N, V, "" + L, J);
        if (typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case _r:
              return L.key === ge ? v(N, V, L, J) : null;
            case ar:
              return L.key === ge ? y(N, V, L, J) : null;
            case Ze: {
              var he = L._payload, Qe = L._init;
              return T(N, V, Qe(he), J);
            }
          }
          if (vt(L) || at(L))
            return ge !== null ? null : g(N, V, L, J, null);
          Wh(N, L);
        }
        return typeof L == "function" && Gh(N), null;
      }
      function U(N, V, L, J, ge) {
        if (typeof J == "string" && J !== "" || typeof J == "number") {
          var he = N.get(L) || null;
          return p(V, he, "" + J, ge);
        }
        if (typeof J == "object" && J !== null) {
          switch (J.$$typeof) {
            case _r: {
              var Qe = N.get(J.key === null ? L : J.key) || null;
              return v(V, Qe, J, ge);
            }
            case ar: {
              var tt = N.get(J.key === null ? L : J.key) || null;
              return y(V, tt, J, ge);
            }
            case Ze:
              var tn = J._payload, Ht = J._init;
              return U(N, V, L, Ht(tn), ge);
          }
          if (vt(J) || at(J)) {
            var qn = N.get(L) || null;
            return g(V, qn, J, ge, null);
          }
          Wh(V, J);
        }
        return typeof J == "function" && Gh(V), null;
      }
      function j(N, V, L) {
        {
          if (typeof N != "object" || N === null)
            return V;
          switch (N.$$typeof) {
            case _r:
            case ar:
              fx(N, L);
              var J = N.key;
              if (typeof J != "string")
                break;
              if (V === null) {
                V = /* @__PURE__ */ new Set(), V.add(J);
                break;
              }
              if (!V.has(J)) {
                V.add(J);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", J);
              break;
            case Ze:
              var ge = N._payload, he = N._init;
              j(he(ge), V, L);
              break;
          }
        }
        return V;
      }
      function P(N, V, L, J) {
        for (var ge = null, he = 0; he < L.length; he++) {
          var Qe = L[he];
          ge = j(Qe, ge, N);
        }
        for (var tt = null, tn = null, Ht = V, qn = 0, Pt = 0, Vn = null; Ht !== null && Pt < L.length; Pt++) {
          Ht.index > Pt ? (Vn = Ht, Ht = null) : Vn = Ht.sibling;
          var ua = T(N, Ht, L[Pt], J);
          if (ua === null) {
            Ht === null && (Ht = Vn);
            break;
          }
          e && Ht && ua.alternate === null && t(N, Ht), qn = s(ua, qn, Pt), tn === null ? tt = ua : tn.sibling = ua, tn = ua, Ht = Vn;
        }
        if (Pt === L.length) {
          if (a(N, Ht), jr()) {
            var Yr = Pt;
            Qs(N, Yr);
          }
          return tt;
        }
        if (Ht === null) {
          for (; Pt < L.length; Pt++) {
            var si = k(N, L[Pt], J);
            si !== null && (qn = s(si, qn, Pt), tn === null ? tt = si : tn.sibling = si, tn = si);
          }
          if (jr()) {
            var Ea = Pt;
            Qs(N, Ea);
          }
          return tt;
        }
        for (var ba = i(N, Ht); Pt < L.length; Pt++) {
          var oa = U(ba, N, Pt, L[Pt], J);
          oa !== null && (e && oa.alternate !== null && ba.delete(oa.key === null ? Pt : oa.key), qn = s(oa, qn, Pt), tn === null ? tt = oa : tn.sibling = oa, tn = oa);
        }
        if (e && ba.forEach(function($f) {
          return t(N, $f);
        }), jr()) {
          var Qu = Pt;
          Qs(N, Qu);
        }
        return tt;
      }
      function ve(N, V, L, J) {
        var ge = at(L);
        if (typeof ge != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          L[Symbol.toStringTag] === "Generator" && (ug || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), ug = !0), L.entries === ge && (lg || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), lg = !0);
          var he = ge.call(L);
          if (he)
            for (var Qe = null, tt = he.next(); !tt.done; tt = he.next()) {
              var tn = tt.value;
              Qe = j(tn, Qe, N);
            }
        }
        var Ht = ge.call(L);
        if (Ht == null)
          throw new Error("An iterable object provided no iterator.");
        for (var qn = null, Pt = null, Vn = V, ua = 0, Yr = 0, si = null, Ea = Ht.next(); Vn !== null && !Ea.done; Yr++, Ea = Ht.next()) {
          Vn.index > Yr ? (si = Vn, Vn = null) : si = Vn.sibling;
          var ba = T(N, Vn, Ea.value, J);
          if (ba === null) {
            Vn === null && (Vn = si);
            break;
          }
          e && Vn && ba.alternate === null && t(N, Vn), ua = s(ba, ua, Yr), Pt === null ? qn = ba : Pt.sibling = ba, Pt = ba, Vn = si;
        }
        if (Ea.done) {
          if (a(N, Vn), jr()) {
            var oa = Yr;
            Qs(N, oa);
          }
          return qn;
        }
        if (Vn === null) {
          for (; !Ea.done; Yr++, Ea = Ht.next()) {
            var Qu = k(N, Ea.value, J);
            Qu !== null && (ua = s(Qu, ua, Yr), Pt === null ? qn = Qu : Pt.sibling = Qu, Pt = Qu);
          }
          if (jr()) {
            var $f = Yr;
            Qs(N, $f);
          }
          return qn;
        }
        for (var Kp = i(N, Vn); !Ea.done; Yr++, Ea = Ht.next()) {
          var Zl = U(Kp, N, Yr, Ea.value, J);
          Zl !== null && (e && Zl.alternate !== null && Kp.delete(Zl.key === null ? Yr : Zl.key), ua = s(Zl, ua, Yr), Pt === null ? qn = Zl : Pt.sibling = Zl, Pt = Zl);
        }
        if (e && Kp.forEach(function(Jk) {
          return t(N, Jk);
        }), jr()) {
          var Zk = Yr;
          Qs(N, Zk);
        }
        return qn;
      }
      function je(N, V, L, J) {
        if (V !== null && V.tag === Te) {
          a(N, V.sibling);
          var ge = u(V, L);
          return ge.return = N, ge;
        }
        a(N, V);
        var he = i0(L, N.mode, J);
        return he.return = N, he;
      }
      function _e(N, V, L, J) {
        for (var ge = L.key, he = V; he !== null; ) {
          if (he.key === ge) {
            var Qe = L.type;
            if (Qe === di) {
              if (he.tag === et) {
                a(N, he.sibling);
                var tt = u(he, L.props.children);
                return tt.return = N, tt._debugSource = L._source, tt._debugOwner = L._owner, tt;
              }
            } else if (he.elementType === Qe || // Keep this check inline so it only runs on the false path:
            gE(he, L) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Qe == "object" && Qe !== null && Qe.$$typeof === Ze && dx(Qe) === he.type) {
              a(N, he.sibling);
              var tn = u(he, L.props);
              return tn.ref = Sp(N, he, L), tn.return = N, tn._debugSource = L._source, tn._debugOwner = L._owner, tn;
            }
            a(N, he);
            break;
          } else
            t(N, he);
          he = he.sibling;
        }
        if (L.type === di) {
          var Ht = Yo(L.props.children, N.mode, J, L.key);
          return Ht.return = N, Ht;
        } else {
          var qn = a0(L, N.mode, J);
          return qn.ref = Sp(N, V, L), qn.return = N, qn;
        }
      }
      function Ot(N, V, L, J) {
        for (var ge = L.key, he = V; he !== null; ) {
          if (he.key === ge)
            if (he.tag === de && he.stateNode.containerInfo === L.containerInfo && he.stateNode.implementation === L.implementation) {
              a(N, he.sibling);
              var Qe = u(he, L.children || []);
              return Qe.return = N, Qe;
            } else {
              a(N, he);
              break;
            }
          else
            t(N, he);
          he = he.sibling;
        }
        var tt = l0(L, N.mode, J);
        return tt.return = N, tt;
      }
      function Tt(N, V, L, J) {
        var ge = typeof L == "object" && L !== null && L.type === di && L.key === null;
        if (ge && (L = L.props.children), typeof L == "object" && L !== null) {
          switch (L.$$typeof) {
            case _r:
              return f(_e(N, V, L, J));
            case ar:
              return f(Ot(N, V, L, J));
            case Ze:
              var he = L._payload, Qe = L._init;
              return Tt(N, V, Qe(he), J);
          }
          if (vt(L))
            return P(N, V, L, J);
          if (at(L))
            return ve(N, V, L, J);
          Wh(N, L);
        }
        return typeof L == "string" && L !== "" || typeof L == "number" ? f(je(N, V, "" + L, J)) : (typeof L == "function" && Gh(N), a(N, V));
      }
      return Tt;
    }
    var kf = px(!0), vx = px(!1);
    function _1(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ic(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ic(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function D1(e, t) {
      for (var a = e.child; a !== null; )
        mk(a, t), a = a.sibling;
    }
    var fg = Oo(null), dg;
    dg = {};
    var qh = null, _f = null, pg = null, Xh = !1;
    function Kh() {
      qh = null, _f = null, pg = null, Xh = !1;
    }
    function hx() {
      Xh = !0;
    }
    function mx() {
      Xh = !1;
    }
    function yx(e, t, a) {
      ia(fg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== dg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = dg;
    }
    function vg(e, t) {
      var a = fg.current;
      aa(fg, t), e._currentValue = a;
    }
    function hg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (_u(i.childLanes, t) ? u !== null && !_u(u.childLanes, t) && (u.childLanes = it(u.childLanes, t)) : (i.childLanes = it(i.childLanes, t), u !== null && (u.childLanes = it(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function O1(e, t, a) {
      N1(e, t, a);
    }
    function N1(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === le) {
                var p = bs(a), v = Pu(nn, p);
                v.tag = Jh;
                var y = i.updateQueue;
                if (y !== null) {
                  var g = y.shared, k = g.pending;
                  k === null ? v.next = v : (v.next = k.next, k.next = v), g.pending = v;
                }
              }
              i.lanes = it(i.lanes, a);
              var T = i.alternate;
              T !== null && (T.lanes = it(T.lanes, a)), hg(i.return, a, e), s.lanes = it(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === qe)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Ut) {
          var U = i.return;
          if (U === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          U.lanes = it(U.lanes, a);
          var j = U.alternate;
          j !== null && (j.lanes = it(j.lanes, a)), hg(U, a, e), u = i.sibling;
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
            var P = u.sibling;
            if (P !== null) {
              P.return = u.return, u = P;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Df(e, t) {
      qh = e, _f = null, pg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && Up(), a.firstContext = null);
      }
    }
    function nr(e) {
      Xh && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (pg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (_f === null) {
          if (qh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          _f = a, qh.dependencies = {
            lanes: G,
            firstContext: a
          };
        } else
          _f = _f.next = a;
      }
      return t;
    }
    var Ks = null;
    function mg(e) {
      Ks === null ? Ks = [e] : Ks.push(e);
    }
    function L1() {
      if (Ks !== null) {
        for (var e = 0; e < Ks.length; e++) {
          var t = Ks[e], a = t.interleaved;
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
        Ks = null;
      }
    }
    function gx(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, mg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Zh(e, i);
    }
    function M1(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, mg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function U1(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, mg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Zh(e, i);
    }
    function Ha(e, t) {
      return Zh(e, t);
    }
    var z1 = Zh;
    function Zh(e, t) {
      e.lanes = it(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = it(a.lanes, t)), a === null && (e.flags & (yn | qr)) !== Le && vE(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = it(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = it(a.childLanes, t) : (u.flags & (yn | qr)) !== Le && vE(e), i = u, u = u.return;
      if (i.tag === ne) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var Sx = 0, xx = 1, Jh = 2, yg = 3, em = !1, gg, tm;
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
    function Pu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: Sx,
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
      if (tm === u && !gg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), gg = !0), Mw()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, z1(e, a);
      } else
        return U1(e, u, t, a);
    }
    function nm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Ld(a)) {
          var s = u.lanes;
          s = Ud(s, e.pendingLanes);
          var f = it(s, a);
          u.lanes = f, ef(e, f);
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
    function A1(e, t, a, i, u, s) {
      switch (a.tag) {
        case xx: {
          var f = a.payload;
          if (typeof f == "function") {
            hx();
            var p = f.call(s, i, u);
            {
              if (e.mode & Jt) {
                gn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              mx();
            }
            return p;
          }
          return f;
        }
        case yg:
          e.flags = e.flags & ~Zn | Oe;
        // Intentional fallthrough
        case Sx: {
          var v = a.payload, y;
          if (typeof v == "function") {
            hx(), y = v.call(s, i, u);
            {
              if (e.mode & Jt) {
                gn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              mx();
            }
          } else
            y = v;
          return y == null ? i : st({}, i, y);
        }
        case Jh:
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
        var U = u.baseState, j = G, P = null, ve = null, je = null, _e = s;
        do {
          var Ot = _e.lane, Tt = _e.eventTime;
          if (_u(i, Ot)) {
            if (je !== null) {
              var V = {
                eventTime: Tt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Mt,
                tag: _e.tag,
                payload: _e.payload,
                callback: _e.callback,
                next: null
              };
              je = je.next = V;
            }
            U = A1(e, u, _e, U, t, a);
            var L = _e.callback;
            if (L !== null && // If the update was already committed, we should not queue its
            // callback again.
            _e.lane !== Mt) {
              e.flags |= on;
              var J = u.effects;
              J === null ? u.effects = [_e] : J.push(_e);
            }
          } else {
            var N = {
              eventTime: Tt,
              lane: Ot,
              tag: _e.tag,
              payload: _e.payload,
              callback: _e.callback,
              next: null
            };
            je === null ? (ve = je = N, P = U) : je = je.next = N, j = it(j, Ot);
          }
          if (_e = _e.next, _e === null) {
            if (p = u.shared.pending, p === null)
              break;
            var ge = p, he = ge.next;
            ge.next = null, _e = he, u.lastBaseUpdate = ge, u.shared.pending = null;
          }
        } while (!0);
        je === null && (P = U), u.baseState = P, u.firstBaseUpdate = ve, u.lastBaseUpdate = je;
        var Qe = u.shared.interleaved;
        if (Qe !== null) {
          var tt = Qe;
          do
            j = it(j, tt.lane), tt = tt.next;
          while (tt !== Qe);
        } else s === null && (u.shared.lanes = G);
        Qp(j), e.lanes = j, e.memoizedState = U;
      }
      tm = null;
    }
    function j1(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function Ex() {
      em = !1;
    }
    function am() {
      return em;
    }
    function bx(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, j1(f, a));
        }
    }
    var xp = {}, zo = Oo(xp), Cp = Oo(xp), im = Oo(xp);
    function lm(e) {
      if (e === xp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function Rx() {
      var e = lm(im.current);
      return e;
    }
    function Cg(e, t) {
      ia(im, t, e), ia(Cp, e, e), ia(zo, xp, e);
      var a = eR(t);
      aa(zo, e), ia(zo, a, e);
    }
    function Of(e) {
      aa(zo, e), aa(Cp, e), aa(im, e);
    }
    function Eg() {
      var e = lm(zo.current);
      return e;
    }
    function Tx(e) {
      lm(im.current);
      var t = lm(zo.current), a = tR(t, e.type);
      t !== a && (ia(Cp, e, e), ia(zo, a, e));
    }
    function bg(e) {
      Cp.current === e && (aa(zo, e), aa(Cp, e));
    }
    var F1 = 0, wx = 1, kx = 1, Ep = 2, il = Oo(F1);
    function Rg(e, t) {
      return (e & t) !== 0;
    }
    function Nf(e) {
      return e & wx;
    }
    function Tg(e, t) {
      return e & wx | t;
    }
    function H1(e, t) {
      return e | t;
    }
    function Ao(e, t) {
      ia(il, t, e);
    }
    function Lf(e) {
      aa(il, e);
    }
    function P1(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function um(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === we) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || Y0(i) || Iy(i))
              return t;
          }
        } else if (t.tag === It && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Oe) !== Le;
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
    ), fr = (
      /* */
      1
    ), $l = (
      /*  */
      2
    ), dr = (
      /*    */
      4
    ), Fr = (
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
    function V1(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var ye = D.ReactCurrentDispatcher, bp = D.ReactCurrentBatchConfig, _g, Mf;
    _g = /* @__PURE__ */ new Set();
    var Zs = G, en = null, pr = null, vr = null, om = !1, Rp = !1, Tp = 0, B1 = 0, I1 = 25, $ = null, zi = null, jo = -1, Dg = !1;
    function $t() {
      {
        var e = $;
        zi === null ? zi = [e] : zi.push(e);
      }
    }
    function ue() {
      {
        var e = $;
        zi !== null && (jo++, zi[jo] !== e && Y1(e));
      }
    }
    function Uf(e) {
      e != null && !vt(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", $, typeof e);
    }
    function Y1(e) {
      {
        var t = Xe(en);
        if (!_g.has(t) && (_g.add(t), zi !== null)) {
          for (var a = "", i = 30, u = 0; u <= jo; u++) {
            for (var s = zi[u], f = u === jo ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function Og(e, t) {
      if (Dg)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", $), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, $, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!K(e[a], t[a]))
          return !1;
      return !0;
    }
    function zf(e, t, a, i, u, s) {
      Zs = s, en = t, zi = e !== null ? e._debugHookTypes : null, jo = -1, Dg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = G, e !== null && e.memoizedState !== null ? ye.current = qx : zi !== null ? ye.current = Gx : ye.current = Wx;
      var f = a(i, u);
      if (Rp) {
        var p = 0;
        do {
          if (Rp = !1, Tp = 0, p >= I1)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Dg = !1, pr = null, vr = null, t.updateQueue = null, jo = -1, ye.current = Xx, f = a(i, u);
        } while (Rp);
      }
      ye.current = Cm, t._debugHookTypes = zi;
      var v = pr !== null && pr.next !== null;
      if (Zs = G, en = null, pr = null, vr = null, $ = null, zi = null, jo = -1, e !== null && (e.flags & zn) !== (t.flags & zn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & St) !== Me && S("Internal React error: Expected static flag was missing. Please notify the React team."), om = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Af() {
      var e = Tp !== 0;
      return Tp = 0, e;
    }
    function _x(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & jt) !== Me ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Rs(e.lanes, a);
    }
    function Dx() {
      if (ye.current = Cm, om) {
        for (var e = en.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        om = !1;
      }
      Zs = G, en = null, pr = null, vr = null, zi = null, jo = -1, $ = null, Bx = !1, Rp = !1, Tp = 0;
    }
    function Ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return vr === null ? en.memoizedState = vr = e : vr = vr.next = e, vr;
    }
    function Ai() {
      var e;
      if (pr === null) {
        var t = en.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = pr.next;
      var a;
      if (vr === null ? a = en.memoizedState : a = vr.next, a !== null)
        vr = a, a = vr.next, pr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        pr = e;
        var i = {
          memoizedState: pr.memoizedState,
          baseState: pr.baseState,
          baseQueue: pr.baseQueue,
          queue: pr.queue,
          next: null
        };
        vr === null ? en.memoizedState = vr = i : vr = vr.next = i;
      }
      return vr;
    }
    function Ox() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Ng(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Lg(e, t, a) {
      var i = Ql(), u;
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
      var f = s.dispatch = G1.bind(null, en, s);
      return [i.memoizedState, f];
    }
    function Mg(e, t, a) {
      var i = Ai(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = pr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var g = f.next, k = s.baseState, T = null, U = null, j = null, P = g;
        do {
          var ve = P.lane;
          if (_u(Zs, ve)) {
            if (j !== null) {
              var _e = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Mt,
                action: P.action,
                hasEagerState: P.hasEagerState,
                eagerState: P.eagerState,
                next: null
              };
              j = j.next = _e;
            }
            if (P.hasEagerState)
              k = P.eagerState;
            else {
              var Ot = P.action;
              k = e(k, Ot);
            }
          } else {
            var je = {
              lane: ve,
              action: P.action,
              hasEagerState: P.hasEagerState,
              eagerState: P.eagerState,
              next: null
            };
            j === null ? (U = j = je, T = k) : j = j.next = je, en.lanes = it(en.lanes, ve), Qp(ve);
          }
          P = P.next;
        } while (P !== null && P !== g);
        j === null ? T = k : j.next = U, K(k, i.memoizedState) || Up(), i.memoizedState = k, i.baseState = T, i.baseQueue = j, u.lastRenderedState = k;
      }
      var Tt = u.interleaved;
      if (Tt !== null) {
        var N = Tt;
        do {
          var V = N.lane;
          en.lanes = it(en.lanes, V), Qp(V), N = N.next;
        } while (N !== Tt);
      } else f === null && (u.lanes = G);
      var L = u.dispatch;
      return [i.memoizedState, L];
    }
    function Ug(e, t, a) {
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
        K(p, i.memoizedState) || Up(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function L_(e, t, a) {
    }
    function M_(e, t, a) {
    }
    function zg(e, t, a) {
      var i = en, u = Ql(), s, f = jr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Mf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), Mf = !0);
      } else {
        if (s = t(), !Mf) {
          var p = t();
          K(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Mf = !0);
        }
        var v = Pm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Zs) || Nx(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, pm(Mx.bind(null, i, y, e), [e]), i.flags |= Gr, wp(fr | Fr, Lx.bind(null, i, y, s, t), void 0, null), s;
    }
    function sm(e, t, a) {
      var i = en, u = Ai(), s = t();
      if (!Mf) {
        var f = t();
        K(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), Mf = !0);
      }
      var p = u.memoizedState, v = !K(p, s);
      v && (u.memoizedState = s, Up());
      var y = u.queue;
      if (_p(Mx.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      vr !== null && vr.memoizedState.tag & fr) {
        i.flags |= Gr, wp(fr | Fr, Lx.bind(null, i, y, s, t), void 0, null);
        var g = Pm();
        if (g === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(g, Zs) || Nx(i, t, s);
      }
      return s;
    }
    function Nx(e, t, a) {
      e.flags |= vo;
      var i = {
        getSnapshot: t,
        value: a
      }, u = en.updateQueue;
      if (u === null)
        u = Ox(), en.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function Lx(e, t, a, i) {
      t.value = a, t.getSnapshot = i, Ux(t) && zx(e);
    }
    function Mx(e, t, a) {
      var i = function() {
        Ux(t) && zx(e);
      };
      return a(i);
    }
    function Ux(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !K(a, i);
      } catch {
        return !0;
      }
    }
    function zx(e) {
      var t = Ha(e, Ye);
      t !== null && gr(t, e, Ye, nn);
    }
    function cm(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: G,
        dispatch: null,
        lastRenderedReducer: Ng,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = q1.bind(null, en, a);
      return [t.memoizedState, i];
    }
    function Ag(e) {
      return Mg(Ng);
    }
    function jg(e) {
      return Ug(Ng);
    }
    function wp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = en.updateQueue;
      if (s === null)
        s = Ox(), en.updateQueue = s, s.lastEffect = u.next = u;
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
      var t = Ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function fm(e) {
      var t = Ai();
      return t.memoizedState;
    }
    function kp(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      en.flags |= e, u.memoizedState = wp(fr | t, a, void 0, s);
    }
    function dm(e, t, a, i) {
      var u = Ai(), s = i === void 0 ? null : i, f = void 0;
      if (pr !== null) {
        var p = pr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Og(s, v)) {
            u.memoizedState = wp(t, a, f, s);
            return;
          }
        }
      }
      en.flags |= e, u.memoizedState = wp(fr | t, a, f, s);
    }
    function pm(e, t) {
      return (en.mode & jt) !== Me ? kp(bi | Gr | Tc, Fr, e, t) : kp(Gr | Tc, Fr, e, t);
    }
    function _p(e, t) {
      return dm(Gr, Fr, e, t);
    }
    function Hg(e, t) {
      return kp(kt, $l, e, t);
    }
    function vm(e, t) {
      return dm(kt, $l, e, t);
    }
    function Pg(e, t) {
      var a = kt;
      return a |= Wi, (en.mode & jt) !== Me && (a |= kl), kp(a, dr, e, t);
    }
    function hm(e, t) {
      return dm(kt, dr, e, t);
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
      var i = a != null ? a.concat([e]) : null, u = kt;
      return u |= Wi, (en.mode & jt) !== Me && (u |= kl), kp(u, dr, Ax.bind(null, t, e), i);
    }
    function mm(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return dm(kt, dr, Ax.bind(null, t, e), i);
    }
    function $1(e, t) {
    }
    var ym = $1;
    function Bg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function gm(e, t) {
      var a = Ai(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Og(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Ig(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function Sm(e, t) {
      var a = Ai(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Og(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Yg(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function jx(e) {
      var t = Ai(), a = pr, i = a.memoizedState;
      return Hx(t, i, e);
    }
    function Fx(e) {
      var t = Ai();
      if (pr === null)
        return t.memoizedState = e, e;
      var a = pr.memoizedState;
      return Hx(t, a, e);
    }
    function Hx(e, t, a) {
      var i = !Od(Zs);
      if (i) {
        if (!K(a, t)) {
          var u = Md();
          en.lanes = it(en.lanes, u), Qp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Up()), e.memoizedState = a, a;
    }
    function Q1(e, t, a) {
      var i = Aa();
      Fn(Xv(i, ki)), e(!0);
      var u = bp.transition;
      bp.transition = {};
      var s = bp.transition;
      bp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Fn(i), bp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && Ve("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function $g() {
      var e = cm(!1), t = e[0], a = e[1], i = Q1.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function Px() {
      var e = Ag(), t = e[0], a = Ai(), i = a.memoizedState;
      return [t, i];
    }
    function Vx() {
      var e = jg(), t = e[0], a = Ai(), i = a.memoizedState;
      return [t, i];
    }
    var Bx = !1;
    function W1() {
      return Bx;
    }
    function Qg() {
      var e = Ql(), t = Pm(), a = t.identifierPrefix, i;
      if (jr()) {
        var u = c1();
        i = ":" + a + "R" + u;
        var s = Tp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = B1++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function xm() {
      var e = Ai(), t = e.memoizedState;
      return t;
    }
    function G1(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Ix(e))
        Yx(t, u);
      else {
        var s = gx(e, t, u, i);
        if (s !== null) {
          var f = Ca();
          gr(s, e, i, f), $x(s, t, i);
        }
      }
      Qx(e, i);
    }
    function q1(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Ix(e))
        Yx(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === G && (s === null || s.lanes === G)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = ye.current, ye.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, K(y, v)) {
                M1(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              ye.current = p;
            }
          }
        }
        var g = gx(e, t, u, i);
        if (g !== null) {
          var k = Ca();
          gr(g, e, i, k), $x(g, t, i);
        }
      }
      Qx(e, i);
    }
    function Ix(e) {
      var t = e.alternate;
      return e === en || t !== null && t === en;
    }
    function Yx(e, t) {
      Rp = om = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function $x(e, t, a) {
      if (Ld(a)) {
        var i = t.lanes;
        i = Ud(i, e.pendingLanes);
        var u = it(i, a);
        t.lanes = u, ef(e, u);
      }
    }
    function Qx(e, t, a) {
      vs(e, t);
    }
    var Cm = {
      readContext: nr,
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
      unstable_isNewReconciler: W
    }, Wx = null, Gx = null, qx = null, Xx = null, Wl = null, ll = null, Em = null;
    {
      var Wg = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Je = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      Wx = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", $t(), Uf(t), Bg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", $t(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", $t(), Uf(t), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", $t(), Uf(a), Vg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", $t(), Uf(t), Hg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", $t(), Uf(t), Pg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", $t(), Uf(t);
          var a = ye.current;
          ye.current = Wl;
          try {
            return Ig(e, t);
          } finally {
            ye.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", $t();
          var i = ye.current;
          ye.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            ye.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", $t(), Fg(e);
        },
        useState: function(e) {
          $ = "useState", $t();
          var t = ye.current;
          ye.current = Wl;
          try {
            return cm(e);
          } finally {
            ye.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", $t(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", $t(), Yg(e);
        },
        useTransition: function() {
          return $ = "useTransition", $t(), $g();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", $t(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", $t(), zg(e, t, a);
        },
        useId: function() {
          return $ = "useId", $t(), Qg();
        },
        unstable_isNewReconciler: W
      }, Gx = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ue(), Bg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ue(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ue(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ue(), Vg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ue(), Hg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ue(), Pg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ue();
          var a = ye.current;
          ye.current = Wl;
          try {
            return Ig(e, t);
          } finally {
            ye.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ue();
          var i = ye.current;
          ye.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            ye.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ue(), Fg(e);
        },
        useState: function(e) {
          $ = "useState", ue();
          var t = ye.current;
          ye.current = Wl;
          try {
            return cm(e);
          } finally {
            ye.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ue(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ue(), Yg(e);
        },
        useTransition: function() {
          return $ = "useTransition", ue(), $g();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ue(), zg(e, t, a);
        },
        useId: function() {
          return $ = "useId", ue(), Qg();
        },
        unstable_isNewReconciler: W
      }, qx = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ue(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ue(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ue(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ue(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ue(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ue(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ue();
          var a = ye.current;
          ye.current = ll;
          try {
            return Sm(e, t);
          } finally {
            ye.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ue();
          var i = ye.current;
          ye.current = ll;
          try {
            return Mg(e, t, a);
          } finally {
            ye.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ue(), fm();
        },
        useState: function(e) {
          $ = "useState", ue();
          var t = ye.current;
          ye.current = ll;
          try {
            return Ag(e);
          } finally {
            ye.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ue(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ue(), jx(e);
        },
        useTransition: function() {
          return $ = "useTransition", ue(), Px();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ue(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", ue(), xm();
        },
        unstable_isNewReconciler: W
      }, Xx = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ue(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ue(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ue(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ue(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ue(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ue(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ue();
          var a = ye.current;
          ye.current = Em;
          try {
            return Sm(e, t);
          } finally {
            ye.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ue();
          var i = ye.current;
          ye.current = Em;
          try {
            return Ug(e, t, a);
          } finally {
            ye.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ue(), fm();
        },
        useState: function(e) {
          $ = "useState", ue();
          var t = ye.current;
          ye.current = Em;
          try {
            return jg(e);
          } finally {
            ye.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ue(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ue(), Fx(e);
        },
        useTransition: function() {
          return $ = "useTransition", ue(), Vx();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ue(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", ue(), xm();
        },
        unstable_isNewReconciler: W
      }, Wl = {
        readContext: function(e) {
          return Wg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", Je(), $t(), Bg(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", Je(), $t(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", Je(), $t(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", Je(), $t(), Vg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", Je(), $t(), Hg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", Je(), $t(), Pg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", Je(), $t();
          var a = ye.current;
          ye.current = Wl;
          try {
            return Ig(e, t);
          } finally {
            ye.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", Je(), $t();
          var i = ye.current;
          ye.current = Wl;
          try {
            return Lg(e, t, a);
          } finally {
            ye.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", Je(), $t(), Fg(e);
        },
        useState: function(e) {
          $ = "useState", Je(), $t();
          var t = ye.current;
          ye.current = Wl;
          try {
            return cm(e);
          } finally {
            ye.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", Je(), $t(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", Je(), $t(), Yg(e);
        },
        useTransition: function() {
          return $ = "useTransition", Je(), $t(), $g();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", Je(), $t(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", Je(), $t(), zg(e, t, a);
        },
        useId: function() {
          return $ = "useId", Je(), $t(), Qg();
        },
        unstable_isNewReconciler: W
      }, ll = {
        readContext: function(e) {
          return Wg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", Je(), ue(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", Je(), ue(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", Je(), ue(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", Je(), ue(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", Je(), ue(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", Je(), ue(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", Je(), ue();
          var a = ye.current;
          ye.current = ll;
          try {
            return Sm(e, t);
          } finally {
            ye.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", Je(), ue();
          var i = ye.current;
          ye.current = ll;
          try {
            return Mg(e, t, a);
          } finally {
            ye.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", Je(), ue(), fm();
        },
        useState: function(e) {
          $ = "useState", Je(), ue();
          var t = ye.current;
          ye.current = ll;
          try {
            return Ag(e);
          } finally {
            ye.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", Je(), ue(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", Je(), ue(), jx(e);
        },
        useTransition: function() {
          return $ = "useTransition", Je(), ue(), Px();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", Je(), ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", Je(), ue(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", Je(), ue(), xm();
        },
        unstable_isNewReconciler: W
      }, Em = {
        readContext: function(e) {
          return Wg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", Je(), ue(), gm(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", Je(), ue(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", Je(), ue(), _p(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", Je(), ue(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", Je(), ue(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", Je(), ue(), hm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", Je(), ue();
          var a = ye.current;
          ye.current = ll;
          try {
            return Sm(e, t);
          } finally {
            ye.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", Je(), ue();
          var i = ye.current;
          ye.current = ll;
          try {
            return Ug(e, t, a);
          } finally {
            ye.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", Je(), ue(), fm();
        },
        useState: function(e) {
          $ = "useState", Je(), ue();
          var t = ye.current;
          ye.current = ll;
          try {
            return jg(e);
          } finally {
            ye.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", Je(), ue(), ym();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", Je(), ue(), Fx(e);
        },
        useTransition: function() {
          return $ = "useTransition", Je(), ue(), Vx();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", Je(), ue(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", Je(), ue(), sm(e, t);
        },
        useId: function() {
          return $ = "useId", Je(), ue(), xm();
        },
        unstable_isNewReconciler: W
      };
    }
    var Fo = I.unstable_now, Kx = 0, bm = -1, Dp = -1, Rm = -1, Gg = !1, Tm = !1;
    function Zx() {
      return Gg;
    }
    function X1() {
      Tm = !0;
    }
    function K1() {
      Gg = !1, Tm = !1;
    }
    function Z1() {
      Gg = Tm, Tm = !1;
    }
    function Jx() {
      return Kx;
    }
    function eC() {
      Kx = Fo();
    }
    function qg(e) {
      Dp = Fo(), e.actualStartTime < 0 && (e.actualStartTime = Fo());
    }
    function tC(e) {
      Dp = -1;
    }
    function wm(e, t) {
      if (Dp >= 0) {
        var a = Fo() - Dp;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Dp = -1;
      }
    }
    function Gl(e) {
      if (bm >= 0) {
        var t = Fo() - bm;
        bm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ne:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case ut:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Xg(e) {
      if (Rm >= 0) {
        var t = Fo() - Rm;
        Rm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ne:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case ut:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      bm = Fo();
    }
    function Kg() {
      Rm = Fo();
    }
    function Zg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = st({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var Jg = {}, eS, tS, nS, rS, aS, nC, km, iS, lS, uS, Op;
    {
      eS = /* @__PURE__ */ new Set(), tS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), Op = /* @__PURE__ */ new Set();
      var rC = /* @__PURE__ */ new Set();
      km = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          rC.has(a) || (rC.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, nC = function(e, t) {
        if (t === void 0) {
          var a = Nt(e) || "Component";
          aS.has(a) || (aS.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(Jg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(Jg);
    }
    function oS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Jt) {
          gn(!0);
          try {
            s = a(i, u);
          } finally {
            gn(!1);
          }
        }
        nC(t, s);
      }
      var f = s == null ? u : st({}, u, s);
      if (e.memoizedState = f, e.lanes === G) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var sS = {
      isMounted: Uv,
      enqueueSetState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.payload = t, a != null && (km(a, "setState"), f.callback = a);
        var p = Uo(i, f, s);
        p !== null && (gr(p, i, s, u), nm(p, i, s)), vs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.tag = xx, f.payload = t, a != null && (km(a, "replaceState"), f.callback = a);
        var p = Uo(i, f, s);
        p !== null && (gr(p, i, s, u), nm(p, i, s)), vs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = po(e), i = Ca(), u = Bo(a), s = Pu(i, u);
        s.tag = Jh, t != null && (km(t, "forceUpdate"), s.callback = t);
        var f = Uo(a, s, u);
        f !== null && (gr(f, a, u, i), nm(f, a, u)), Lc(a, u);
      }
    };
    function aC(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Jt) {
            gn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              gn(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Nt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ee(a, i) || !Ee(u, s) : !0;
    }
    function J1(e, t, a) {
      var i = e.stateNode;
      {
        var u = Nt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Op.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Jt) === Me && (Op.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Op.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Jt) === Me && (Op.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !lS.has(t) && (lS.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Nt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !nS.has(t) && (nS.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Nt(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || vt(p)) && S("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function iC(e, t) {
      t.updater = sS, e.stateNode = t, vu(t, e), t._reactInternalInstance = Jg;
    }
    function lC(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === E && f._context === void 0
        );
        if (!p && !uS.has(t)) {
          uS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Nt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = nr(f);
      else {
        u = Ef(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? bf(e, u) : ui;
      }
      var g = new t(a, s);
      if (e.mode & Jt) {
        gn(!0);
        try {
          g = new t(a, s);
        } finally {
          gn(!1);
        }
      }
      var k = e.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null;
      iC(e, g);
      {
        if (typeof t.getDerivedStateFromProps == "function" && k === null) {
          var T = Nt(t) || "Component";
          tS.has(T) || (tS.add(T), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", T, g.state === null ? "null" : "undefined", T));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof g.getSnapshotBeforeUpdate == "function") {
          var U = null, j = null, P = null;
          if (typeof g.componentWillMount == "function" && g.componentWillMount.__suppressDeprecationWarning !== !0 ? U = "componentWillMount" : typeof g.UNSAFE_componentWillMount == "function" && (U = "UNSAFE_componentWillMount"), typeof g.componentWillReceiveProps == "function" && g.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? j = "componentWillReceiveProps" : typeof g.UNSAFE_componentWillReceiveProps == "function" && (j = "UNSAFE_componentWillReceiveProps"), typeof g.componentWillUpdate == "function" && g.componentWillUpdate.__suppressDeprecationWarning !== !0 ? P = "componentWillUpdate" : typeof g.UNSAFE_componentWillUpdate == "function" && (P = "UNSAFE_componentWillUpdate"), U !== null || j !== null || P !== null) {
            var ve = Nt(t) || "Component", je = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            rS.has(ve) || (rS.add(ve), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, ve, je, U !== null ? `
  ` + U : "", j !== null ? `
  ` + j : "", P !== null ? `
  ` + P : ""));
          }
        }
      }
      return i && q0(e, u, s), g;
    }
    function eT(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Xe(e) || "Component"), sS.enqueueReplaceState(t, t.state, null));
    }
    function uC(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = Xe(e) || "Component";
          eS.has(s) || (eS.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        sS.enqueueReplaceState(t, t.state, null);
      }
    }
    function cS(e, t, a, i) {
      J1(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, Sg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = nr(s);
      else {
        var f = Ef(e, t, !0);
        u.context = bf(e, f);
      }
      {
        if (u.state === a) {
          var p = Nt(t) || "Component";
          iS.has(p) || (iS.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Jt && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (oS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (eT(e, u), rm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = kt;
        y |= Wi, (e.mode & jt) !== Me && (y |= kl), e.flags |= y;
      }
    }
    function tT(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = nr(p);
      else {
        var y = Ef(e, t, !0);
        v = bf(e, y);
      }
      var g = t.getDerivedStateFromProps, k = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !k && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && uC(e, u, a, v), Ex();
      var T = e.memoizedState, U = u.state = T;
      if (rm(e, a, u, i), U = e.memoizedState, s === a && T === U && !Fh() && !am()) {
        if (typeof u.componentDidMount == "function") {
          var j = kt;
          j |= Wi, (e.mode & jt) !== Me && (j |= kl), e.flags |= j;
        }
        return !1;
      }
      typeof g == "function" && (oS(e, t, g, a), U = e.memoizedState);
      var P = am() || aC(e, t, s, a, T, U, v);
      if (P) {
        if (!k && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var ve = kt;
          ve |= Wi, (e.mode & jt) !== Me && (ve |= kl), e.flags |= ve;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var je = kt;
          je |= Wi, (e.mode & jt) !== Me && (je |= kl), e.flags |= je;
        }
        e.memoizedProps = a, e.memoizedState = U;
      }
      return u.props = a, u.state = U, u.context = v, P;
    }
    function nT(e, t, a, i, u) {
      var s = t.stateNode;
      Cx(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, g = a.contextType, k = ui;
      if (typeof g == "object" && g !== null)
        k = nr(g);
      else {
        var T = Ef(t, a, !0);
        k = bf(t, T);
      }
      var U = a.getDerivedStateFromProps, j = typeof U == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !j && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== k) && uC(t, s, i, k), Ex();
      var P = t.memoizedState, ve = s.state = P;
      if (rm(t, i, s, u), ve = t.memoizedState, f === v && P === ve && !Fh() && !am() && !ce)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= kt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= Qn), !1;
      typeof U == "function" && (oS(t, a, U, i), ve = t.memoizedState);
      var je = am() || aC(t, a, p, i, P, ve, k) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      ce;
      return je ? (!j && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, ve, k), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, ve, k)), typeof s.componentDidUpdate == "function" && (t.flags |= kt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Qn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= kt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || P !== e.memoizedState) && (t.flags |= Qn), t.memoizedProps = i, t.memoizedState = ve), s.props = i, s.state = ve, s.context = k, je;
    }
    function Js(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function fS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function rT(e, t) {
      return !0;
    }
    function dS(e, t) {
      try {
        var a = rT(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === le)
            return;
          console.error(i);
        }
        var p = u ? Xe(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === ne)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var g = Xe(e) || "Anonymous";
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
    var aT = typeof WeakMap == "function" ? WeakMap : Map;
    function oC(e, t, a) {
      var i = Pu(nn, a);
      i.tag = yg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        Xw(u), dS(e, t);
      }, i;
    }
    function pS(e, t, a) {
      var i = Pu(nn, a);
      i.tag = yg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          SE(e), dS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        SE(e), dS(e, t), typeof u != "function" && Gw(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, Ye) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Xe(e) || "Unknown"));
      }), i;
    }
    function sC(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new aT(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = Kw.bind(null, e, t, a);
        Zr && Wp(e, a), t.then(s, s);
      }
    }
    function iT(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function lT(e, t) {
      var a = e.tag;
      if ((e.mode & St) === Me && (a === oe || a === ze || a === Ne)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function cC(e) {
      var t = e;
      do {
        if (t.tag === we && P1(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function fC(e, t, a, i, u) {
      if ((e.mode & St) === Me) {
        if (e === t)
          e.flags |= Zn;
        else {
          if (e.flags |= Oe, a.flags |= Rc, a.flags &= -52805, a.tag === le) {
            var s = a.alternate;
            if (s === null)
              a.tag = Rt;
            else {
              var f = Pu(nn, Ye);
              f.tag = Jh, Uo(a, f, Ye);
            }
          }
          a.lanes = it(a.lanes, Ye);
        }
        return e;
      }
      return e.flags |= Zn, e.lanes = u, e;
    }
    function uT(e, t, a, i, u) {
      if (a.flags |= os, Zr && Wp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        lT(a), jr() && a.mode & St && nx();
        var f = cC(t);
        if (f !== null) {
          f.flags &= ~Er, fC(f, t, a, e, u), f.mode & St && sC(e, s, u), iT(f, e, s);
          return;
        } else {
          if (!Bv(u)) {
            sC(e, s, u), QS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (jr() && a.mode & St) {
        nx();
        var v = cC(t);
        if (v !== null) {
          (v.flags & Zn) === Le && (v.flags |= Er), fC(v, t, a, e, u), ig(Js(i, a));
          return;
        }
      }
      i = Js(i, a), Pw(i);
      var y = t;
      do {
        switch (y.tag) {
          case ne: {
            var g = i;
            y.flags |= Zn;
            var k = bs(u);
            y.lanes = it(y.lanes, k);
            var T = oC(y, g, k);
            xg(y, T);
            return;
          }
          case le:
            var U = i, j = y.type, P = y.stateNode;
            if ((y.flags & Oe) === Le && (typeof j.getDerivedStateFromError == "function" || P !== null && typeof P.componentDidCatch == "function" && !cE(P))) {
              y.flags |= Zn;
              var ve = bs(u);
              y.lanes = it(y.lanes, ve);
              var je = pS(y, U, ve);
              xg(y, je);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function oT() {
      return null;
    }
    var Np = D.ReactCurrentOwner, ol = !1, vS, Lp, hS, mS, yS, ec, gS, _m, Mp;
    vS = {}, Lp = {}, hS = {}, mS = {}, yS = {}, ec = !1, gS = {}, _m = {}, Mp = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = vx(t, null, a, i) : t.child = kf(t, e.child, a, i);
    }
    function sT(e, t, a, i) {
      t.child = kf(t, e.child, null, i), t.child = kf(t, null, a, i);
    }
    function dC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Nt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Df(t, u), ha(t);
      {
        if (Np.current = t, $n(!0), v = zf(e, t, f, i, p, u), y = Af(), t.mode & Jt) {
          gn(!0);
          try {
            v = zf(e, t, f, i, p, u), y = Af();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (_x(e, t, u), Vu(e, t, u)) : (jr() && y && Jy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function pC(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (vk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Yf(s), t.tag = Ne, t.type = f, CS(t, s), vC(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            Nt(s)
          ), a.defaultProps !== void 0) {
            var v = Nt(s) || "Unknown";
            Mp[v] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Mp[v] = !0);
          }
        }
        var y = r0(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var g = a.type, k = g.propTypes;
        k && nl(
          k,
          i,
          // Resolved props
          "prop",
          Nt(g)
        );
      }
      var T = e.child, U = kS(e, u);
      if (!U) {
        var j = T.memoizedProps, P = a.compare;
        if (P = P !== null ? P : Ee, P(j, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var ve = ic(T, i);
      return ve.ref = t.ref, ve.return = t, t.child = ve, ve;
    }
    function vC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === Ze) {
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
            Nt(s)
          );
        }
      }
      if (e !== null) {
        var g = e.memoizedProps;
        if (Ee(g, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = g, kS(e, u))
            (e.flags & Rc) !== Le && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return SS(e, t, a, i, u);
    }
    function hC(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || ee)
        if ((t.mode & St) === Me) {
          var f = {
            baseLanes: G,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Vm(t, a);
        } else if (ea(a, Jr)) {
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
            v = it(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Jr;
          var g = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = g, t.updateQueue = null, Vm(t, v), null;
        }
      else {
        var U;
        s !== null ? (U = it(s.baseLanes, a), t.memoizedState = null) : U = a, Vm(t, U);
      }
      return Sa(e, t, u, a), t.child;
    }
    function cT(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function fT(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function dT(e, t, a) {
      {
        t.flags |= kt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function mC(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Cn, t.flags |= ho);
    }
    function SS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Nt(a)
        );
      }
      var f;
      {
        var p = Ef(t, a, !0);
        f = bf(t, p);
      }
      var v, y;
      Df(t, u), ha(t);
      {
        if (Np.current = t, $n(!0), v = zf(e, t, a, i, f, u), y = Af(), t.mode & Jt) {
          gn(!0);
          try {
            v = zf(e, t, a, i, f, u), y = Af();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (_x(e, t, u), Vu(e, t, u)) : (jr() && y && Jy(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function yC(e, t, a, i, u) {
      {
        switch (Dk(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= Oe, t.flags |= Zn;
            var y = new Error("Simulated error coming from DevTools"), g = bs(u);
            t.lanes = it(t.lanes, g);
            var k = pS(t, Js(y, t), g);
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
            Nt(a)
          );
        }
      }
      var U;
      Yl(a) ? (U = !0, Ph(t)) : U = !1, Df(t, u);
      var j = t.stateNode, P;
      j === null ? (Om(e, t), lC(t, a, i), cS(t, a, i, u), P = !0) : e === null ? P = tT(t, a, i, u) : P = nT(e, t, a, i, u);
      var ve = xS(e, t, a, P, U, u);
      {
        var je = t.stateNode;
        P && je.props !== i && (ec || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Xe(t) || "a component"), ec = !0);
      }
      return ve;
    }
    function xS(e, t, a, i, u, s) {
      mC(e, t);
      var f = (t.flags & Oe) !== Le;
      if (!i && !f)
        return u && Z0(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Np.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, tC();
      else {
        ha(t);
        {
          if ($n(!0), v = p.render(), t.mode & Jt) {
            gn(!0);
            try {
              p.render();
            } finally {
              gn(!1);
            }
          }
          $n(!1);
        }
        ma();
      }
      return t.flags |= ni, e !== null && f ? sT(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && Z0(t, a, !0), t.child;
    }
    function gC(e) {
      var t = e.stateNode;
      t.pendingContext ? X0(e, t.pendingContext, t.pendingContext !== t.context) : t.context && X0(e, t.context, !1), Cg(e, t.containerInfo);
    }
    function pT(e, t, a) {
      if (gC(t), e === null)
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
        if (y.baseState = v, t.memoizedState = v, t.flags & Er) {
          var g = Js(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return SC(e, t, p, a, g);
        } else if (p !== s) {
          var k = Js(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return SC(e, t, p, a, k);
        } else {
          m1(t);
          var T = vx(t, null, p, a);
          t.child = T;
          for (var U = T; U; )
            U.flags = U.flags & ~yn | qr, U = U.sibling;
        }
      } else {
        if (wf(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function SC(e, t, a, i, u) {
      return wf(), ig(u), t.flags |= Er, Sa(e, t, a, i), t.child;
    }
    function vT(e, t, a) {
      Tx(t), e === null && ag(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Hy(i, u);
      return p ? f = null : s !== null && Hy(i, s) && (t.flags |= Oa), mC(e, t), Sa(e, t, f, a), t.child;
    }
    function hT(e, t) {
      return e === null && ag(t), null;
    }
    function mT(e, t, a, i) {
      Om(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = hk(v), g = ul(v, u), k;
      switch (y) {
        case oe:
          return CS(t, v), t.type = v = Yf(v), k = SS(null, t, v, g, i), k;
        case le:
          return t.type = v = KS(v), k = yC(null, t, v, g, i), k;
        case ze:
          return t.type = v = ZS(v), k = dC(null, t, v, g, i), k;
        case nt: {
          if (t.type !== t.elementType) {
            var T = v.propTypes;
            T && nl(
              T,
              g,
              // Resolved for outer only
              "prop",
              Nt(v)
            );
          }
          return k = pC(
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
      throw v !== null && typeof v == "object" && v.$$typeof === Ze && (U = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + U));
    }
    function yT(e, t, a, i, u) {
      Om(e, t), t.tag = le;
      var s;
      return Yl(a) ? (s = !0, Ph(t)) : s = !1, Df(t, u), lC(t, a, i), cS(t, a, i, u), xS(null, t, a, !0, s, u);
    }
    function gT(e, t, a, i) {
      Om(e, t);
      var u = t.pendingProps, s;
      {
        var f = Ef(t, a, !1);
        s = bf(t, f);
      }
      Df(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = Nt(a) || "Unknown";
          vS[y] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), vS[y] = !0);
        }
        t.mode & Jt && al.recordLegacyContextWarning(t, null), $n(!0), Np.current = t, p = zf(null, t, a, u, s, i), v = Af(), $n(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var g = Nt(a) || "Unknown";
        Lp[g] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", g, g, g), Lp[g] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var k = Nt(a) || "Unknown";
          Lp[k] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", k, k, k), Lp[k] = !0);
        }
        t.tag = le, t.memoizedState = null, t.updateQueue = null;
        var T = !1;
        return Yl(a) ? (T = !0, Ph(t)) : T = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Sg(t), iC(t, p), cS(t, a, u, i), xS(null, t, a, !0, T, i);
      } else {
        if (t.tag = oe, t.mode & Jt) {
          gn(!0);
          try {
            p = zf(null, t, a, u, s, i), v = Af();
          } finally {
            gn(!1);
          }
        }
        return jr() && v && Jy(t), Sa(null, t, p, i), CS(t, a), t.child;
      }
    }
    function CS(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), yS[u] || (yS[u] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = Nt(t) || "Unknown";
          Mp[f] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Mp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = Nt(t) || "Unknown";
          mS[p] || (S("%s: Function components do not support getDerivedStateFromProps.", p), mS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = Nt(t) || "Unknown";
          hS[v] || (S("%s: Function components do not support contextType.", v), hS[v] = !0);
        }
      }
    }
    var ES = {
      dehydrated: null,
      treeContext: null,
      retryLane: Mt
    };
    function bS(e) {
      return {
        baseLanes: e,
        cachePool: oT(),
        transitions: null
      };
    }
    function ST(e, t) {
      var a = null;
      return {
        baseLanes: it(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function xT(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Rg(e, Ep);
    }
    function CT(e, t) {
      return Rs(e.childLanes, t);
    }
    function xC(e, t, a) {
      var i = t.pendingProps;
      Ok(t) && (t.flags |= Oe);
      var u = il.current, s = !1, f = (t.flags & Oe) !== Le;
      if (f || xT(u, e) ? (s = !0, t.flags &= ~Oe) : (e === null || e.memoizedState !== null) && (u = H1(u, kx)), u = Nf(u), Ao(t, u), e === null) {
        ag(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return wT(t, v);
        }
        var y = i.children, g = i.fallback;
        if (s) {
          var k = ET(t, y, g, a), T = t.child;
          return T.memoizedState = bS(a), t.memoizedState = ES, k;
        } else
          return RS(t, y);
      } else {
        var U = e.memoizedState;
        if (U !== null) {
          var j = U.dehydrated;
          if (j !== null)
            return kT(e, t, f, i, j, U, a);
        }
        if (s) {
          var P = i.fallback, ve = i.children, je = RT(e, t, ve, P, a), _e = t.child, Ot = e.child.memoizedState;
          return _e.memoizedState = Ot === null ? bS(a) : ST(Ot, a), _e.childLanes = CT(e, a), t.memoizedState = ES, je;
        } else {
          var Tt = i.children, N = bT(e, t, Tt, a);
          return t.memoizedState = null, N;
        }
      }
    }
    function RS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = TS(u, i);
      return s.return = e, e.child = s, s;
    }
    function ET(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & St) === Me && s !== null ? (p = s, p.childLanes = G, p.pendingProps = f, e.mode & At && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Yo(a, u, i, null)) : (p = TS(f, u), v = Yo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function TS(e, t, a) {
      return CE(e, t, G, null);
    }
    function CC(e, t) {
      return ic(e, t);
    }
    function bT(e, t, a, i) {
      var u = e.child, s = u.sibling, f = CC(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & St) === Me && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Da) : p.push(s);
      }
      return t.child = f, f;
    }
    function RT(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & St) === Me && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var g = t.child;
        y = g, y.childLanes = G, y.pendingProps = v, t.mode & At && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = CC(f, v), y.subtreeFlags = f.subtreeFlags & zn;
      var k;
      return p !== null ? k = ic(p, i) : (k = Yo(i, s, u, null), k.flags |= yn), k.return = t, y.return = t, y.sibling = k, t.child = y, k;
    }
    function Dm(e, t, a, i) {
      i !== null && ig(i), kf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = RS(t, s);
      return f.flags |= yn, t.memoizedState = null, f;
    }
    function TT(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = TS(f, s), v = Yo(i, s, u, null);
      return v.flags |= yn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & St) !== Me && kf(t, e.child, null, u), v;
    }
    function wT(e, t, a) {
      return (e.mode & St) === Me ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = Ye) : Iy(t) ? e.lanes = br : e.lanes = Jr, null;
    }
    function kT(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Er) {
          t.flags &= ~Er;
          var N = fS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Dm(e, t, f, N);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Oe, null;
          var V = i.children, L = i.fallback, J = TT(e, t, V, L, f), ge = t.child;
          return ge.memoizedState = bS(f), t.memoizedState = ES, J;
        }
      else {
        if (v1(), (t.mode & St) === Me)
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
            var g = NR(u);
            p = g.digest, v = g.message, y = g.stack;
          }
          var k;
          v ? k = new Error(v) : k = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var T = fS(k, p, y);
          return Dm(e, t, f, T);
        }
        var U = ea(f, e.childLanes);
        if (ol || U) {
          var j = Pm();
          if (j !== null) {
            var P = Ad(j, f);
            if (P !== Mt && P !== s.retryLane) {
              s.retryLane = P;
              var ve = nn;
              Ha(e, P), gr(j, e, P, ve);
            }
          }
          QS();
          var je = fS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Dm(e, t, f, je);
        } else if (Y0(u)) {
          t.flags |= Oe, t.child = e.child;
          var _e = Zw.bind(null, e);
          return LR(u, _e), null;
        } else {
          y1(t, u, s.treeContext);
          var Ot = i.children, Tt = RS(t, Ot);
          return Tt.flags |= qr, Tt;
        }
      }
    }
    function EC(e, t, a) {
      e.lanes = it(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = it(i.lanes, t)), hg(e.return, t, a);
    }
    function _T(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === we) {
          var u = i.memoizedState;
          u !== null && EC(i, a, e);
        } else if (i.tag === It)
          EC(i, a, e);
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
    function DT(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && um(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function OT(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !gS[e])
        if (gS[e] = !0, typeof e == "string")
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
    function NT(e, t) {
      e !== void 0 && !_m[e] && (e !== "collapsed" && e !== "hidden" ? (_m[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (_m[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function bC(e, t) {
      {
        var a = vt(e), i = !a && typeof at(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function LT(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (vt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!bC(e[a], a))
              return;
        } else {
          var i = at(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!bC(s.value, f))
                  return;
                f++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function wS(e, t, a, i, u) {
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
    function RC(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      OT(u), NT(s, u), LT(f, u), Sa(e, t, f, a);
      var p = il.current, v = Rg(p, Ep);
      if (v)
        p = Tg(p, Ep), t.flags |= Oe;
      else {
        var y = e !== null && (e.flags & Oe) !== Le;
        y && _T(t, t.child, a), p = Nf(p);
      }
      if (Ao(t, p), (t.mode & St) === Me)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var g = DT(t.child), k;
            g === null ? (k = t.child, t.child = null) : (k = g.sibling, g.sibling = null), wS(
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
              var j = U.alternate;
              if (j !== null && um(j) === null) {
                t.child = U;
                break;
              }
              var P = U.sibling;
              U.sibling = T, T = U, U = P;
            }
            wS(
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
            wS(
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
    function MT(e, t, a) {
      Cg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = kf(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var TC = !1;
    function UT(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || TC || (TC = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (yx(t, u, p), f !== null) {
        var y = f.value;
        if (K(y, p)) {
          if (f.children === s.children && !Fh())
            return Vu(e, t, a);
        } else
          O1(t, u, a);
      }
      var g = s.children;
      return Sa(e, t, g, a), t.child;
    }
    var wC = !1;
    function zT(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (wC || (wC = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Df(t, a);
      var f = nr(i);
      ha(t);
      var p;
      return Np.current = t, $n(!0), p = s(f), $n(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function Up() {
      ol = !0;
    }
    function Om(e, t) {
      (t.mode & St) === Me && e !== null && (e.alternate = null, t.alternate = null, t.flags |= yn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), tC(), Qp(t.lanes), ea(a, t.childLanes) ? (_1(e, t), t.child) : null;
    }
    function AT(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= Da) : s.push(e), a.flags |= yn, a;
      }
    }
    function kS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function jT(e, t, a) {
      switch (t.tag) {
        case ne:
          gC(t), t.stateNode, wf();
          break;
        case ae:
          Tx(t);
          break;
        case le: {
          var i = t.type;
          Yl(i) && Ph(t);
          break;
        }
        case de:
          Cg(t, t.stateNode.containerInfo);
          break;
        case qe: {
          var u = t.memoizedProps.value, s = t.type._context;
          yx(t, s, u);
          break;
        }
        case ut:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= kt);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case we: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Ao(t, Nf(il.current)), t.flags |= Oe, null;
            var y = t.child, g = y.childLanes;
            if (ea(a, g))
              return xC(e, t, a);
            Ao(t, Nf(il.current));
            var k = Vu(e, t, a);
            return k !== null ? k.sibling : null;
          } else
            Ao(t, Nf(il.current));
          break;
        }
        case It: {
          var T = (e.flags & Oe) !== Le, U = ea(a, t.childLanes);
          if (T) {
            if (U)
              return RC(e, t, a);
            t.flags |= Oe;
          }
          var j = t.memoizedState;
          if (j !== null && (j.rendering = null, j.tail = null, j.lastEffect = null), Ao(t, il.current), U)
            break;
          return null;
        }
        case De:
        case Et:
          return t.lanes = G, hC(e, t, a);
      }
      return Vu(e, t, a);
    }
    function kC(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return AT(e, t, r0(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Fh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = kS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Oe) === Le)
            return ol = !1, jT(e, t, a);
          (e.flags & Rc) !== Le ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, jr() && o1(t)) {
        var f = t.index, p = s1();
        tx(t, p, f);
      }
      switch (t.lanes = G, t.tag) {
        case Ge:
          return gT(e, t, t.type, a);
        case Bt: {
          var v = t.elementType;
          return mT(e, t, v, a);
        }
        case oe: {
          var y = t.type, g = t.pendingProps, k = t.elementType === y ? g : ul(y, g);
          return SS(e, t, y, k, a);
        }
        case le: {
          var T = t.type, U = t.pendingProps, j = t.elementType === T ? U : ul(T, U);
          return yC(e, t, T, j, a);
        }
        case ne:
          return pT(e, t, a);
        case ae:
          return vT(e, t, a);
        case Te:
          return hT(e, t);
        case we:
          return xC(e, t, a);
        case de:
          return MT(e, t, a);
        case ze: {
          var P = t.type, ve = t.pendingProps, je = t.elementType === P ? ve : ul(P, ve);
          return dC(e, t, P, je, a);
        }
        case et:
          return cT(e, t, a);
        case Ue:
          return fT(e, t, a);
        case ut:
          return dT(e, t, a);
        case qe:
          return UT(e, t, a);
        case Qt:
          return zT(e, t, a);
        case nt: {
          var _e = t.type, Ot = t.pendingProps, Tt = ul(_e, Ot);
          if (t.type !== t.elementType) {
            var N = _e.propTypes;
            N && nl(
              N,
              Tt,
              // Resolved for outer only
              "prop",
              Nt(_e)
            );
          }
          return Tt = ul(_e.type, Tt), pC(e, t, _e, Tt, a);
        }
        case Ne:
          return vC(e, t, t.type, t.pendingProps, a);
        case Rt: {
          var V = t.type, L = t.pendingProps, J = t.elementType === V ? L : ul(V, L);
          return yT(e, t, V, J, a);
        }
        case It:
          return RC(e, t, a);
        case ht:
          break;
        case De:
          return hC(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function jf(e) {
      e.flags |= kt;
    }
    function _C(e) {
      e.flags |= Cn, e.flags |= ho;
    }
    var DC, _S, OC, NC;
    DC = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ae || u.tag === Te)
          iR(e, u.stateNode);
        else if (u.tag !== de) {
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
    }, OC = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Eg(), v = uR(f, a, s, i, u, p);
        t.updateQueue = v, v && jf(t);
      }
    }, NC = function(e, t, a, i) {
      a !== i && jf(t);
    };
    function zp(e, t) {
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
      var t = e.alternate !== null && e.alternate.child === e.child, a = G, i = Le;
      if (t) {
        if ((e.mode & At) !== Me) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = it(a, it(y.lanes, y.childLanes)), i |= y.subtreeFlags & zn, i |= y.flags & zn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var g = e.child; g !== null; )
            a = it(a, it(g.lanes, g.childLanes)), i |= g.subtreeFlags & zn, i |= g.flags & zn, g.return = e, g = g.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & At) !== Me) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = it(a, it(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = it(a, it(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function FT(e, t, a) {
      if (E1() && (t.mode & St) !== Me && (t.flags & Oe) === Le)
        return ox(t), wf(), t.flags |= Er | os | Zn, !1;
      var i = $h(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (x1(t), Hr(t), (t.mode & At) !== Me) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (wf(), (t.flags & Oe) === Le && (t.memoizedState = null), t.flags |= kt, Hr(t), (t.mode & At) !== Me) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return sx(), !0;
    }
    function LC(e, t, a) {
      var i = t.pendingProps;
      switch (eg(t), t.tag) {
        case Ge:
        case Bt:
        case Ne:
        case oe:
        case ze:
        case et:
        case Ue:
        case ut:
        case Qt:
        case nt:
          return Hr(t), null;
        case le: {
          var u = t.type;
          return Yl(u) && Hh(t), Hr(t), null;
        }
        case ne: {
          var s = t.stateNode;
          if (Of(t), Xy(t), kg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = $h(t);
            if (f)
              jf(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Er) !== Le) && (t.flags |= Qn, sx());
            }
          }
          return _S(e, t), Hr(t), null;
        }
        case ae: {
          bg(t);
          var v = Rx(), y = t.type;
          if (e !== null && t.stateNode != null)
            OC(e, t, y, i, v), e.ref !== t.ref && _C(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Hr(t), null;
            }
            var g = Eg(), k = $h(t);
            if (k)
              g1(t, v, g) && jf(t);
            else {
              var T = aR(y, i, v, g, t);
              DC(T, t, !1, !1), t.stateNode = T, lR(T, y, i, v) && jf(t);
            }
            t.ref !== null && _C(t);
          }
          return Hr(t), null;
        }
        case Te: {
          var U = i;
          if (e && t.stateNode != null) {
            var j = e.memoizedProps;
            NC(e, t, j, U);
          } else {
            if (typeof U != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var P = Rx(), ve = Eg(), je = $h(t);
            je ? S1(t) && jf(t) : t.stateNode = oR(U, P, ve, t);
          }
          return Hr(t), null;
        }
        case we: {
          Lf(t);
          var _e = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Ot = FT(e, t, _e);
            if (!Ot)
              return t.flags & Zn ? t : null;
          }
          if ((t.flags & Oe) !== Le)
            return t.lanes = a, (t.mode & At) !== Me && Zg(t), t;
          var Tt = _e !== null, N = e !== null && e.memoizedState !== null;
          if (Tt !== N && Tt) {
            var V = t.child;
            if (V.flags |= Un, (t.mode & St) !== Me) {
              var L = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              L || Rg(il.current, kx) ? Hw() : QS();
            }
          }
          var J = t.updateQueue;
          if (J !== null && (t.flags |= kt), Hr(t), (t.mode & At) !== Me && Tt) {
            var ge = t.child;
            ge !== null && (t.treeBaseDuration -= ge.treeBaseDuration);
          }
          return null;
        }
        case de:
          return Of(t), _S(e, t), e === null && t1(t.stateNode.containerInfo), Hr(t), null;
        case qe:
          var he = t.type._context;
          return vg(he, t), Hr(t), null;
        case Rt: {
          var Qe = t.type;
          return Yl(Qe) && Hh(t), Hr(t), null;
        }
        case It: {
          Lf(t);
          var tt = t.memoizedState;
          if (tt === null)
            return Hr(t), null;
          var tn = (t.flags & Oe) !== Le, Ht = tt.rendering;
          if (Ht === null)
            if (tn)
              zp(tt, !1);
            else {
              var qn = Vw() && (e === null || (e.flags & Oe) === Le);
              if (!qn)
                for (var Pt = t.child; Pt !== null; ) {
                  var Vn = um(Pt);
                  if (Vn !== null) {
                    tn = !0, t.flags |= Oe, zp(tt, !1);
                    var ua = Vn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= kt), t.subtreeFlags = Le, D1(t, a), Ao(t, Tg(il.current, Ep)), t.child;
                  }
                  Pt = Pt.sibling;
                }
              tt.tail !== null && Wn() > JC() && (t.flags |= Oe, tn = !0, zp(tt, !1), t.lanes = kd);
            }
          else {
            if (!tn) {
              var Yr = um(Ht);
              if (Yr !== null) {
                t.flags |= Oe, tn = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= kt), zp(tt, !0), tt.tail === null && tt.tailMode === "hidden" && !Ht.alternate && !jr())
                  return Hr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Wn() * 2 - tt.renderingStartTime > JC() && a !== Jr && (t.flags |= Oe, tn = !0, zp(tt, !1), t.lanes = kd);
            }
            if (tt.isBackwards)
              Ht.sibling = t.child, t.child = Ht;
            else {
              var Ea = tt.last;
              Ea !== null ? Ea.sibling = Ht : t.child = Ht, tt.last = Ht;
            }
          }
          if (tt.tail !== null) {
            var ba = tt.tail;
            tt.rendering = ba, tt.tail = ba.sibling, tt.renderingStartTime = Wn(), ba.sibling = null;
            var oa = il.current;
            return tn ? oa = Tg(oa, Ep) : oa = Nf(oa), Ao(t, oa), ba;
          }
          return Hr(t), null;
        }
        case ht:
          break;
        case De:
        case Et: {
          $S(t);
          var Qu = t.memoizedState, $f = Qu !== null;
          if (e !== null) {
            var Kp = e.memoizedState, Zl = Kp !== null;
            Zl !== $f && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !ee && (t.flags |= Un);
          }
          return !$f || (t.mode & St) === Me ? Hr(t) : ea(Kl, Jr) && (Hr(t), t.subtreeFlags & (yn | kt) && (t.flags |= Un)), null;
        }
        case bt:
          return null;
        case re:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function HT(e, t, a) {
      switch (eg(t), t.tag) {
        case le: {
          var i = t.type;
          Yl(i) && Hh(t);
          var u = t.flags;
          return u & Zn ? (t.flags = u & ~Zn | Oe, (t.mode & At) !== Me && Zg(t), t) : null;
        }
        case ne: {
          t.stateNode, Of(t), Xy(t), kg();
          var s = t.flags;
          return (s & Zn) !== Le && (s & Oe) === Le ? (t.flags = s & ~Zn | Oe, t) : null;
        }
        case ae:
          return bg(t), null;
        case we: {
          Lf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            wf();
          }
          var p = t.flags;
          return p & Zn ? (t.flags = p & ~Zn | Oe, (t.mode & At) !== Me && Zg(t), t) : null;
        }
        case It:
          return Lf(t), null;
        case de:
          return Of(t), null;
        case qe:
          var v = t.type._context;
          return vg(v, t), null;
        case De:
        case Et:
          return $S(t), null;
        case bt:
          return null;
        default:
          return null;
      }
    }
    function MC(e, t, a) {
      switch (eg(t), t.tag) {
        case le: {
          var i = t.type.childContextTypes;
          i != null && Hh(t);
          break;
        }
        case ne: {
          t.stateNode, Of(t), Xy(t), kg();
          break;
        }
        case ae: {
          bg(t);
          break;
        }
        case de:
          Of(t);
          break;
        case we:
          Lf(t);
          break;
        case It:
          Lf(t);
          break;
        case qe:
          var u = t.type._context;
          vg(u, t);
          break;
        case De:
        case Et:
          $S(t);
          break;
      }
    }
    var UC = null;
    UC = /* @__PURE__ */ new Set();
    var Nm = !1, Pr = !1, PT = typeof WeakSet == "function" ? WeakSet : Set, be = null, Ff = null, Hf = null;
    function VT(e) {
      wl(null, function() {
        throw e;
      }), us();
    }
    var BT = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & At)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Gl(e);
        }
      else
        t.componentWillUnmount();
    };
    function zC(e, t) {
      try {
        Ho(dr, e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function DS(e, t, a) {
      try {
        BT(e, a);
      } catch (i) {
        dn(e, t, i);
      }
    }
    function IT(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        dn(e, t, i);
      }
    }
    function AC(e, t) {
      try {
        FC(e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function Pf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Be && mt && e.mode & At)
              try {
                ql(), i = a(null);
              } finally {
                Gl(e);
              }
            else
              i = a(null);
          } catch (u) {
            dn(e, t, u);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Xe(e));
        } else
          a.current = null;
    }
    function Lm(e, t, a) {
      try {
        a();
      } catch (i) {
        dn(e, t, i);
      }
    }
    var jC = !1;
    function YT(e, t) {
      nR(e.containerInfo), be = t, $T();
      var a = jC;
      return jC = !1, a;
    }
    function $T() {
      for (; be !== null; ) {
        var e = be, t = e.child;
        (e.subtreeFlags & _l) !== Le && t !== null ? (t.return = e, be = t) : QT();
      }
    }
    function QT() {
      for (; be !== null; ) {
        var e = be;
        Xt(e);
        try {
          WT(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        fn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, be = t;
          return;
        }
        be = e.return;
      }
    }
    function WT(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Qn) !== Le) {
        switch (Xt(e), e.tag) {
          case oe:
          case ze:
          case Ne:
            break;
          case le: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !ec && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = UC;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Xe(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case ne: {
            {
              var v = e.stateNode;
              kR(v.containerInfo);
            }
            break;
          }
          case ae:
          case Te:
          case de:
          case Rt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        fn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Pa ? Xi(t) : (e & dr) !== Pa && cs(t), (e & $l) !== Pa && Gp(!0), Lm(t, a, p), (e & $l) !== Pa && Gp(!1), (e & Fr) !== Pa ? Ll() : (e & dr) !== Pa && Td());
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
            (e & Fr) !== Pa ? Rd(t) : (e & dr) !== Pa && Oc(t);
            var f = s.create;
            (e & $l) !== Pa && Gp(!0), s.destroy = f(), (e & $l) !== Pa && Gp(!1), (e & Fr) !== Pa ? jv() : (e & dr) !== Pa && Fv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & dr) !== Le ? v = "useLayoutEffect" : (s.tag & $l) !== Le ? v = "useInsertionEffect" : v = "useEffect";
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
    function GT(e, t) {
      if ((t.flags & kt) !== Le)
        switch (t.tag) {
          case ut: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = Jx(), p = t.alternate === null ? "mount" : "update";
            Zx() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case ne:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case ut:
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
    function qT(e, t, a, i) {
      if ((a.flags & Ol) !== Le)
        switch (a.tag) {
          case oe:
          case ze:
          case Ne: {
            if (!Pr)
              if (a.mode & At)
                try {
                  ql(), Ho(dr | fr, a);
                } finally {
                  Gl(a);
                }
              else
                Ho(dr | fr, a);
            break;
          }
          case le: {
            var u = a.stateNode;
            if (a.flags & kt && !Pr)
              if (t === null)
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(a) || "instance")), a.mode & At)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(a) || "instance")), a.mode & At)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Xe(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Xe(a) || "instance")), bx(a, p, u));
            break;
          }
          case ne: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ae:
                    y = a.child.stateNode;
                    break;
                  case le:
                    y = a.child.stateNode;
                    break;
                }
              bx(a, v, y);
            }
            break;
          }
          case ae: {
            var g = a.stateNode;
            if (t === null && a.flags & kt) {
              var k = a.type, T = a.memoizedProps;
              pR(g, k, T);
            }
            break;
          }
          case Te:
            break;
          case de:
            break;
          case ut: {
            {
              var U = a.memoizedProps, j = U.onCommit, P = U.onRender, ve = a.stateNode.effectDuration, je = Jx(), _e = t === null ? "mount" : "update";
              Zx() && (_e = "nested-update"), typeof P == "function" && P(a.memoizedProps.id, _e, a.actualDuration, a.treeBaseDuration, a.actualStartTime, je);
              {
                typeof j == "function" && j(a.memoizedProps.id, _e, ve, je), Qw(a);
                var Ot = a.return;
                e: for (; Ot !== null; ) {
                  switch (Ot.tag) {
                    case ne:
                      var Tt = Ot.stateNode;
                      Tt.effectDuration += ve;
                      break e;
                    case ut:
                      var N = Ot.stateNode;
                      N.effectDuration += ve;
                      break e;
                  }
                  Ot = Ot.return;
                }
              }
            }
            break;
          }
          case we: {
            rw(e, a);
            break;
          }
          case It:
          case Rt:
          case ht:
          case De:
          case Et:
          case re:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Pr || a.flags & Cn && FC(a);
    }
    function XT(e) {
      switch (e.tag) {
        case oe:
        case ze:
        case Ne: {
          if (e.mode & At)
            try {
              ql(), zC(e, e.return);
            } finally {
              Gl(e);
            }
          else
            zC(e, e.return);
          break;
        }
        case le: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && IT(e, e.return, t), AC(e, e.return);
          break;
        }
        case ae: {
          AC(e, e.return);
          break;
        }
      }
    }
    function KT(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ae) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? bR(u) : TR(i.stateNode, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
          }
        } else if (i.tag === Te) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? RR(s) : wR(s, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
        } else if (!((i.tag === De || i.tag === Et) && i.memoizedState !== null && i !== e)) {
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
    function FC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ae:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & At)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Xe(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Xe(e)), t.current = i;
      }
    }
    function ZT(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function HC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, HC(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ae) {
          var a = e.stateNode;
          a !== null && a1(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function JT(e) {
      for (var t = e.return; t !== null; ) {
        if (PC(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function PC(e) {
      return e.tag === ae || e.tag === ne || e.tag === de;
    }
    function VC(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || PC(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ae && t.tag !== Te && t.tag !== Ut; ) {
          if (t.flags & yn || t.child === null || t.tag === de)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & yn))
          return t.stateNode;
      }
    }
    function ew(e) {
      var t = JT(e);
      switch (t.tag) {
        case ae: {
          var a = t.stateNode;
          t.flags & Oa && (I0(a), t.flags &= ~Oa);
          var i = VC(e);
          NS(e, i, a);
          break;
        }
        case ne:
        case de: {
          var u = t.stateNode.containerInfo, s = VC(e);
          OS(e, s, u);
          break;
        }
        // eslint-disable-next-line-no-fallthrough
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function OS(e, t, a) {
      var i = e.tag, u = i === ae || i === Te;
      if (u) {
        var s = e.stateNode;
        t ? SR(a, s, t) : yR(a, s);
      } else if (i !== de) {
        var f = e.child;
        if (f !== null) {
          OS(f, t, a);
          for (var p = f.sibling; p !== null; )
            OS(p, t, a), p = p.sibling;
        }
      }
    }
    function NS(e, t, a) {
      var i = e.tag, u = i === ae || i === Te;
      if (u) {
        var s = e.stateNode;
        t ? gR(a, s, t) : mR(a, s);
      } else if (i !== de) {
        var f = e.child;
        if (f !== null) {
          NS(f, t, a);
          for (var p = f.sibling; p !== null; )
            NS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function tw(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ae: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case ne: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case de: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        BC(e, t, a), Vr = null, cl = !1;
      }
      ZT(a);
    }
    function Po(e, t, a) {
      for (var i = a.child; i !== null; )
        BC(e, t, i), i = i.sibling;
    }
    function BC(e, t, a) {
      switch (Cd(a), a.tag) {
        case ae:
          Pr || Pf(a, t);
        // eslint-disable-next-line-no-fallthrough
        case Te: {
          {
            var i = Vr, u = cl;
            Vr = null, Po(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? CR(Vr, a.stateNode) : xR(Vr, a.stateNode));
          }
          return;
        }
        case Ut: {
          Vr !== null && (cl ? ER(Vr, a.stateNode) : By(Vr, a.stateNode));
          return;
        }
        case de: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Po(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case oe:
        case ze:
        case nt:
        case Ne: {
          if (!Pr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, g = y;
                do {
                  var k = g, T = k.destroy, U = k.tag;
                  T !== void 0 && ((U & $l) !== Pa ? Lm(a, t, T) : (U & dr) !== Pa && (cs(a), a.mode & At ? (ql(), Lm(a, t, T), Gl(a)) : Lm(a, t, T), Td())), g = g.next;
                } while (g !== y);
              }
            }
          }
          Po(e, t, a);
          return;
        }
        case le: {
          if (!Pr) {
            Pf(a, t);
            var j = a.stateNode;
            typeof j.componentWillUnmount == "function" && DS(a, t, j);
          }
          Po(e, t, a);
          return;
        }
        case ht: {
          Po(e, t, a);
          return;
        }
        case De: {
          if (
            // TODO: Remove this dead flag
            a.mode & St
          ) {
            var P = Pr;
            Pr = P || a.memoizedState !== null, Po(e, t, a), Pr = P;
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
    function nw(e) {
      e.memoizedState;
    }
    function rw(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && VR(s);
          }
        }
      }
    }
    function IC(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new PT()), t.forEach(function(i) {
          var u = Jw.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Zr)
              if (Ff !== null && Hf !== null)
                Wp(Hf, Ff);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function aw(e, t, a) {
      Ff = a, Hf = e, Xt(t), YC(t, e), Xt(t), Ff = null, Hf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            tw(e, t, s);
          } catch (v) {
            dn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & Dl)
        for (var p = t.child; p !== null; )
          Xt(p), YC(p, e), p = p.sibling;
      Xt(f);
    }
    function YC(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case oe:
        case ze:
        case nt:
        case Ne: {
          if (fl(t, e), Xl(e), u & kt) {
            try {
              sl($l | fr, e, e.return), Ho($l | fr, e);
            } catch (Qe) {
              dn(e, e.return, Qe);
            }
            if (e.mode & At) {
              try {
                ql(), sl(dr | fr, e, e.return);
              } catch (Qe) {
                dn(e, e.return, Qe);
              }
              Gl(e);
            } else
              try {
                sl(dr | fr, e, e.return);
              } catch (Qe) {
                dn(e, e.return, Qe);
              }
          }
          return;
        }
        case le: {
          fl(t, e), Xl(e), u & Cn && i !== null && Pf(i, i.return);
          return;
        }
        case ae: {
          fl(t, e), Xl(e), u & Cn && i !== null && Pf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                I0(s);
              } catch (Qe) {
                dn(e, e.return, Qe);
              }
            }
            if (u & kt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, g = e.updateQueue;
                if (e.updateQueue = null, g !== null)
                  try {
                    vR(f, g, y, v, p, e);
                  } catch (Qe) {
                    dn(e, e.return, Qe);
                  }
              }
            }
          }
          return;
        }
        case Te: {
          if (fl(t, e), Xl(e), u & kt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var k = e.stateNode, T = e.memoizedProps, U = i !== null ? i.memoizedProps : T;
            try {
              hR(k, U, T);
            } catch (Qe) {
              dn(e, e.return, Qe);
            }
          }
          return;
        }
        case ne: {
          if (fl(t, e), Xl(e), u & kt && i !== null) {
            var j = i.memoizedState;
            if (j.isDehydrated)
              try {
                PR(t.containerInfo);
              } catch (Qe) {
                dn(e, e.return, Qe);
              }
          }
          return;
        }
        case de: {
          fl(t, e), Xl(e);
          return;
        }
        case we: {
          fl(t, e), Xl(e);
          var P = e.child;
          if (P.flags & Un) {
            var ve = P.stateNode, je = P.memoizedState, _e = je !== null;
            if (ve.isHidden = _e, _e) {
              var Ot = P.alternate !== null && P.alternate.memoizedState !== null;
              Ot || Fw();
            }
          }
          if (u & kt) {
            try {
              nw(e);
            } catch (Qe) {
              dn(e, e.return, Qe);
            }
            IC(e);
          }
          return;
        }
        case De: {
          var Tt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & St
          ) {
            var N = Pr;
            Pr = N || Tt, fl(t, e), Pr = N;
          } else
            fl(t, e);
          if (Xl(e), u & Un) {
            var V = e.stateNode, L = e.memoizedState, J = L !== null, ge = e;
            if (V.isHidden = J, J && !Tt && (ge.mode & St) !== Me) {
              be = ge;
              for (var he = ge.child; he !== null; )
                be = he, lw(he), he = he.sibling;
            }
            KT(ge, J);
          }
          return;
        }
        case It: {
          fl(t, e), Xl(e), u & kt && IC(e);
          return;
        }
        case ht:
          return;
        default: {
          fl(t, e), Xl(e);
          return;
        }
      }
    }
    function Xl(e) {
      var t = e.flags;
      if (t & yn) {
        try {
          ew(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        e.flags &= ~yn;
      }
      t & qr && (e.flags &= ~qr);
    }
    function iw(e, t, a) {
      Ff = a, Hf = t, be = e, $C(e, t, a), Ff = null, Hf = null;
    }
    function $C(e, t, a) {
      for (var i = (e.mode & St) !== Me; be !== null; ) {
        var u = be, s = u.child;
        if (u.tag === De && i) {
          var f = u.memoizedState !== null, p = f || Nm;
          if (p) {
            LS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, g = y || Pr, k = Nm, T = Pr;
            Nm = p, Pr = g, Pr && !T && (be = u, uw(u));
            for (var U = s; U !== null; )
              be = U, $C(
                U,
                // New root; bubble back up to here and stop.
                t,
                a
              ), U = U.sibling;
            be = u, Nm = k, Pr = T, LS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== Le && s !== null ? (s.return = u, be = s) : LS(e, t, a);
      }
    }
    function LS(e, t, a) {
      for (; be !== null; ) {
        var i = be;
        if ((i.flags & Ol) !== Le) {
          var u = i.alternate;
          Xt(i);
          try {
            qT(t, u, i, a);
          } catch (f) {
            dn(i, i.return, f);
          }
          fn();
        }
        if (i === e) {
          be = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, be = s;
          return;
        }
        be = i.return;
      }
    }
    function lw(e) {
      for (; be !== null; ) {
        var t = be, a = t.child;
        switch (t.tag) {
          case oe:
          case ze:
          case nt:
          case Ne: {
            if (t.mode & At)
              try {
                ql(), sl(dr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(dr, t, t.return);
            break;
          }
          case le: {
            Pf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && DS(t, t.return, i);
            break;
          }
          case ae: {
            Pf(t, t.return);
            break;
          }
          case De: {
            var u = t.memoizedState !== null;
            if (u) {
              QC(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, be = a) : QC(e);
      }
    }
    function QC(e) {
      for (; be !== null; ) {
        var t = be;
        if (t === e) {
          be = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, be = a;
          return;
        }
        be = t.return;
      }
    }
    function uw(e) {
      for (; be !== null; ) {
        var t = be, a = t.child;
        if (t.tag === De) {
          var i = t.memoizedState !== null;
          if (i) {
            WC(e);
            continue;
          }
        }
        a !== null ? (a.return = t, be = a) : WC(e);
      }
    }
    function WC(e) {
      for (; be !== null; ) {
        var t = be;
        Xt(t);
        try {
          XT(t);
        } catch (i) {
          dn(t, t.return, i);
        }
        if (fn(), t === e) {
          be = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, be = a;
          return;
        }
        be = t.return;
      }
    }
    function ow(e, t, a, i) {
      be = t, sw(t, e, a, i);
    }
    function sw(e, t, a, i) {
      for (; be !== null; ) {
        var u = be, s = u.child;
        (u.subtreeFlags & Gi) !== Le && s !== null ? (s.return = u, be = s) : cw(e, t, a, i);
      }
    }
    function cw(e, t, a, i) {
      for (; be !== null; ) {
        var u = be;
        if ((u.flags & Gr) !== Le) {
          Xt(u);
          try {
            fw(t, u, a, i);
          } catch (f) {
            dn(u, u.return, f);
          }
          fn();
        }
        if (u === e) {
          be = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, be = s;
          return;
        }
        be = u.return;
      }
    }
    function fw(e, t, a, i) {
      switch (t.tag) {
        case oe:
        case ze:
        case Ne: {
          if (t.mode & At) {
            Kg();
            try {
              Ho(Fr | fr, t);
            } finally {
              Xg(t);
            }
          } else
            Ho(Fr | fr, t);
          break;
        }
      }
    }
    function dw(e) {
      be = e, pw();
    }
    function pw() {
      for (; be !== null; ) {
        var e = be, t = e.child;
        if ((be.flags & Da) !== Le) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              be = u, mw(u, e);
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
            be = e;
          }
        }
        (e.subtreeFlags & Gi) !== Le && t !== null ? (t.return = e, be = t) : vw();
      }
    }
    function vw() {
      for (; be !== null; ) {
        var e = be;
        (e.flags & Gr) !== Le && (Xt(e), hw(e), fn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, be = t;
          return;
        }
        be = e.return;
      }
    }
    function hw(e) {
      switch (e.tag) {
        case oe:
        case ze:
        case Ne: {
          e.mode & At ? (Kg(), sl(Fr | fr, e, e.return), Xg(e)) : sl(Fr | fr, e, e.return);
          break;
        }
      }
    }
    function mw(e, t) {
      for (; be !== null; ) {
        var a = be;
        Xt(a), gw(a, t), fn();
        var i = a.child;
        i !== null ? (i.return = a, be = i) : yw(e);
      }
    }
    function yw(e) {
      for (; be !== null; ) {
        var t = be, a = t.sibling, i = t.return;
        if (HC(t), t === e) {
          be = null;
          return;
        }
        if (a !== null) {
          a.return = i, be = a;
          return;
        }
        be = i;
      }
    }
    function gw(e, t) {
      switch (e.tag) {
        case oe:
        case ze:
        case Ne: {
          e.mode & At ? (Kg(), sl(Fr, e, t), Xg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function Sw(e) {
      switch (e.tag) {
        case oe:
        case ze:
        case Ne: {
          try {
            Ho(dr | fr, e);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case le: {
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
    function xw(e) {
      switch (e.tag) {
        case oe:
        case ze:
        case Ne: {
          try {
            Ho(Fr | fr, e);
          } catch (t) {
            dn(e, e.return, t);
          }
          break;
        }
      }
    }
    function Cw(e) {
      switch (e.tag) {
        case oe:
        case ze:
        case Ne: {
          try {
            sl(dr | fr, e, e.return);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case le: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && DS(e, e.return, t);
          break;
        }
      }
    }
    function Ew(e) {
      switch (e.tag) {
        case oe:
        case ze:
        case Ne:
          try {
            sl(Fr | fr, e, e.return);
          } catch (t) {
            dn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Ap = Symbol.for;
      Ap("selector.component"), Ap("selector.has_pseudo_class"), Ap("selector.role"), Ap("selector.test_id"), Ap("selector.text");
    }
    var bw = [];
    function Rw() {
      bw.forEach(function(e) {
        return e();
      });
    }
    var Tw = D.ReactCurrentActQueue;
    function ww(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function GC() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && Tw.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var kw = Math.ceil, MS = D.ReactCurrentDispatcher, US = D.ReactCurrentOwner, Br = D.ReactCurrentBatchConfig, dl = D.ReactCurrentActQueue, hr = (
      /*             */
      0
    ), qC = (
      /*               */
      1
    ), Ir = (
      /*                */
      2
    ), ji = (
      /*                */
      4
    ), Bu = 0, jp = 1, tc = 2, Mm = 3, Fp = 4, XC = 5, zS = 6, Dt = hr, xa = null, On = null, mr = G, Kl = G, AS = Oo(G), yr = Bu, Hp = null, Um = G, Pp = G, zm = G, Vp = null, Va = null, jS = 0, KC = 500, ZC = 1 / 0, _w = 500, Iu = null;
    function Bp() {
      ZC = Wn() + _w;
    }
    function JC() {
      return ZC;
    }
    var Am = !1, FS = null, Vf = null, nc = !1, Vo = null, Ip = G, HS = [], PS = null, Dw = 50, Yp = 0, VS = null, BS = !1, jm = !1, Ow = 50, Bf = 0, Fm = null, $p = nn, Hm = G, eE = !1;
    function Pm() {
      return xa;
    }
    function Ca() {
      return (Dt & (Ir | ji)) !== hr ? Wn() : ($p !== nn || ($p = Wn()), $p);
    }
    function Bo(e) {
      var t = e.mode;
      if ((t & St) === Me)
        return Ye;
      if ((Dt & Ir) !== hr && mr !== G)
        return bs(mr);
      var a = T1() !== R1;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Hm === Mt && (Hm = Md()), Hm;
      }
      var u = Aa();
      if (u !== Mt)
        return u;
      var s = sR();
      return s;
    }
    function Nw(e) {
      var t = e.mode;
      return (t & St) === Me ? Ye : Yv();
    }
    function gr(e, t, a, i) {
      tk(), eE && S("useInsertionEffect must not schedule updates."), BS && (jm = !0), So(e, a, i), (Dt & Ir) !== G && e === xa ? ak(t) : (Zr && ws(e, t, a), ik(t), e === xa && ((Dt & Ir) === hr && (Pp = it(Pp, a)), yr === Fp && Io(e, mr)), Ba(e, i), a === Ye && Dt === hr && (t.mode & St) === Me && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Bp(), ex()));
    }
    function Lw(e, t, a) {
      var i = e.current;
      i.lanes = t, So(e, t, a), Ba(e, a);
    }
    function Mw(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Dt & Ir) !== hr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Xc(e, t);
      var i = qc(e, e === xa ? mr : G);
      if (i === G) {
        a !== null && mE(a), e.callbackNode = null, e.callbackPriority = Mt;
        return;
      }
      var u = zl(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== qS)) {
        a == null && s !== Ye && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && mE(a);
      var f;
      if (u === Ye)
        e.tag === No ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), u1(rE.bind(null, e))) : J0(rE.bind(null, e)), dl.current !== null ? dl.current.push(Lo) : fR(function() {
          (Dt & (Ir | ji)) === hr && Lo();
        }), f = null;
      else {
        var p;
        switch (Kv(i)) {
          case Lr:
            p = ss;
            break;
          case ki:
            p = Nl;
            break;
          case Ua:
            p = qi;
            break;
          case za:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = XS(p, tE.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function tE(e, t) {
      if (K1(), $p = nn, Hm = G, (Dt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = qc(e, e === xa ? mr : G);
      if (u === G)
        return null;
      var s = !Zc(e, u) && !Iv(e, u) && !t, f = s ? Iw(e, u) : Bm(e, u);
      if (f !== Bu) {
        if (f === tc) {
          var p = Kc(e);
          p !== G && (u = p, f = IS(e, p));
        }
        if (f === jp) {
          var v = Hp;
          throw rc(e, G), Io(e, u), Ba(e, Wn()), v;
        }
        if (f === zS)
          Io(e, u);
        else {
          var y = !Zc(e, u), g = e.current.alternate;
          if (y && !zw(g)) {
            if (f = Bm(e, u), f === tc) {
              var k = Kc(e);
              k !== G && (u = k, f = IS(e, k));
            }
            if (f === jp) {
              var T = Hp;
              throw rc(e, G), Io(e, u), Ba(e, Wn()), T;
            }
          }
          e.finishedWork = g, e.finishedLanes = u, Uw(e, f, u);
        }
      }
      return Ba(e, Wn()), e.callbackNode === a ? tE.bind(null, e) : null;
    }
    function IS(e, t) {
      var a = Vp;
      if (tf(e)) {
        var i = rc(e, t);
        i.flags |= Er, e1(e.containerInfo);
      }
      var u = Bm(e, t);
      if (u !== tc) {
        var s = Va;
        Va = a, s !== null && nE(s);
      }
      return u;
    }
    function nE(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function Uw(e, t, a) {
      switch (t) {
        case Bu:
        case jp:
          throw new Error("Root did not complete. This is a bug in React.");
        // Flow knows about invariant, so it complains if I add a break
        // statement, but eslint doesn't know about invariant, so it complains
        // if I do. eslint-disable-next-line no-fallthrough
        case tc: {
          ac(e, Va, Iu);
          break;
        }
        case Mm: {
          if (Io(e, a), ku(a) && // do not delay if we're inside an act() scope
          !yE()) {
            var i = jS + KC - Wn();
            if (i > 10) {
              var u = qc(e, G);
              if (u !== G)
                break;
              var s = e.suspendedLanes;
              if (!_u(s, a)) {
                Ca(), Jc(e, s);
                break;
              }
              e.timeoutHandle = Py(ac.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case Fp: {
          if (Io(e, a), Nd(a))
            break;
          if (!yE()) {
            var f = ai(e, a), p = f, v = Wn() - p, y = ek(v) - v;
            if (y > 10) {
              e.timeoutHandle = Py(ac.bind(null, e, Va, Iu), y);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case XC: {
          ac(e, Va, Iu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function zw(e) {
      for (var t = e; ; ) {
        if (t.flags & vo) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!K(f(), p))
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
      t = Rs(t, zm), t = Rs(t, Pp), Wv(e, t);
    }
    function rE(e) {
      if (Z1(), (Dt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      $u();
      var t = qc(e, G);
      if (!ea(t, Ye))
        return Ba(e, Wn()), null;
      var a = Bm(e, t);
      if (e.tag !== No && a === tc) {
        var i = Kc(e);
        i !== G && (t = i, a = IS(e, i));
      }
      if (a === jp) {
        var u = Hp;
        throw rc(e, G), Io(e, t), Ba(e, Wn()), u;
      }
      if (a === zS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ac(e, Va, Iu), Ba(e, Wn()), null;
    }
    function Aw(e, t) {
      t !== G && (ef(e, it(t, Ye)), Ba(e, Wn()), (Dt & (Ir | ji)) === hr && (Bp(), Lo()));
    }
    function YS(e, t) {
      var a = Dt;
      Dt |= qC;
      try {
        return e(t);
      } finally {
        Dt = a, Dt === hr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Bp(), ex());
      }
    }
    function jw(e, t, a, i, u) {
      var s = Aa(), f = Br.transition;
      try {
        return Br.transition = null, Fn(Lr), e(t, a, i, u);
      } finally {
        Fn(s), Br.transition = f, Dt === hr && Bp();
      }
    }
    function Yu(e) {
      Vo !== null && Vo.tag === No && (Dt & (Ir | ji)) === hr && $u();
      var t = Dt;
      Dt |= qC;
      var a = Br.transition, i = Aa();
      try {
        return Br.transition = null, Fn(Lr), e ? e() : void 0;
      } finally {
        Fn(i), Br.transition = a, Dt = t, (Dt & (Ir | ji)) === hr && Lo();
      }
    }
    function aE() {
      return (Dt & (Ir | ji)) !== hr;
    }
    function Vm(e, t) {
      ia(AS, Kl, e), Kl = it(Kl, t);
    }
    function $S(e) {
      Kl = AS.current, aa(AS, e);
    }
    function rc(e, t) {
      e.finishedWork = null, e.finishedLanes = G;
      var a = e.timeoutHandle;
      if (a !== Vy && (e.timeoutHandle = Vy, cR(a)), On !== null)
        for (var i = On.return; i !== null; ) {
          var u = i.alternate;
          MC(u, i), i = i.return;
        }
      xa = e;
      var s = ic(e.current, null);
      return On = s, mr = Kl = t, yr = Bu, Hp = null, Um = G, Pp = G, zm = G, Vp = null, Va = null, L1(), al.discardPendingWarnings(), s;
    }
    function iE(e, t) {
      do {
        var a = On;
        try {
          if (Kh(), Dx(), fn(), US.current = null, a === null || a.return === null) {
            yr = jp, Hp = t, On = null;
            return;
          }
          if (Be && a.mode & At && wm(a, !0), $e)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              wi(a, i, mr);
            } else
              fs(a, t, mr);
          uT(e, a.return, a, t, mr), sE(a);
        } catch (u) {
          t = u, On === a && a !== null ? (a = a.return, On = a) : a = On;
          continue;
        }
        return;
      } while (!0);
    }
    function lE() {
      var e = MS.current;
      return MS.current = Cm, e === null ? Cm : e;
    }
    function uE(e) {
      MS.current = e;
    }
    function Fw() {
      jS = Wn();
    }
    function Qp(e) {
      Um = it(e, Um);
    }
    function Hw() {
      yr === Bu && (yr = Mm);
    }
    function QS() {
      (yr === Bu || yr === Mm || yr === tc) && (yr = Fp), xa !== null && (Es(Um) || Es(Pp)) && Io(xa, mr);
    }
    function Pw(e) {
      yr !== Fp && (yr = tc), Vp === null ? Vp = [e] : Vp.push(e);
    }
    function Vw() {
      return yr === Bu;
    }
    function Bm(e, t) {
      var a = Dt;
      Dt |= Ir;
      var i = lE();
      if (xa !== e || mr !== t) {
        if (Zr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Wp(e, mr), u.clear()), Gv(e, t);
        }
        Iu = jd(), rc(e, t);
      }
      xu(t);
      do
        try {
          Bw();
          break;
        } catch (s) {
          iE(e, s);
        }
      while (!0);
      if (Kh(), Dt = a, uE(i), On !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Nc(), xa = null, mr = G, yr;
    }
    function Bw() {
      for (; On !== null; )
        oE(On);
    }
    function Iw(e, t) {
      var a = Dt;
      Dt |= Ir;
      var i = lE();
      if (xa !== e || mr !== t) {
        if (Zr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Wp(e, mr), u.clear()), Gv(e, t);
        }
        Iu = jd(), Bp(), rc(e, t);
      }
      xu(t);
      do
        try {
          Yw();
          break;
        } catch (s) {
          iE(e, s);
        }
      while (!0);
      return Kh(), uE(i), Dt = a, On !== null ? (Hv(), Bu) : (Nc(), xa = null, mr = G, yr);
    }
    function Yw() {
      for (; On !== null && !md(); )
        oE(On);
    }
    function oE(e) {
      var t = e.alternate;
      Xt(e);
      var a;
      (e.mode & At) !== Me ? (qg(e), a = WS(t, e, Kl), wm(e, !0)) : a = WS(t, e, Kl), fn(), e.memoizedProps = e.pendingProps, a === null ? sE(e) : On = a, US.current = null;
    }
    function sE(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & os) === Le) {
          Xt(t);
          var u = void 0;
          if ((t.mode & At) === Me ? u = LC(a, t, Kl) : (qg(t), u = LC(a, t, Kl), wm(t, !1)), fn(), u !== null) {
            On = u;
            return;
          }
        } else {
          var s = HT(a, t);
          if (s !== null) {
            s.flags &= Mv, On = s;
            return;
          }
          if ((t.mode & At) !== Me) {
            wm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= os, i.subtreeFlags = Le, i.deletions = null;
          else {
            yr = zS, On = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          On = v;
          return;
        }
        t = i, On = t;
      } while (t !== null);
      yr === Bu && (yr = XC);
    }
    function ac(e, t, a) {
      var i = Aa(), u = Br.transition;
      try {
        Br.transition = null, Fn(Lr), $w(e, t, a, i);
      } finally {
        Br.transition = u, Fn(i);
      }
      return null;
    }
    function $w(e, t, a, i) {
      do
        $u();
      while (Vo !== null);
      if (nk(), (Dt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Ed(s), u === null)
        return bd(), null;
      if (s === G && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = G, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Mt;
      var f = it(u.lanes, u.childLanes);
      zd(e, f), e === xa && (xa = null, On = null, mr = G), ((u.subtreeFlags & Gi) !== Le || (u.flags & Gi) !== Le) && (nc || (nc = !0, PS = a, XS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (_l | Dl | Ol | Gi)) !== Le, v = (u.flags & (_l | Dl | Ol | Gi)) !== Le;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var g = Aa();
        Fn(Lr);
        var k = Dt;
        Dt |= ji, US.current = null, YT(e, u), eC(), aw(e, u, s), rR(e.containerInfo), e.current = u, ds(s), iw(u, e, s), ps(), yd(), Dt = k, Fn(g), Br.transition = y;
      } else
        e.current = u, eC();
      var T = nc;
      if (nc ? (nc = !1, Vo = e, Ip = s) : (Bf = 0, Fm = null), f = e.pendingLanes, f === G && (Vf = null), T || pE(e.current, !1), Sd(u.stateNode, i), Zr && e.memoizedUpdaters.clear(), Rw(), Ba(e, Wn()), t !== null)
        for (var U = e.onRecoverableError, j = 0; j < t.length; j++) {
          var P = t[j], ve = P.stack, je = P.digest;
          U(P.value, {
            componentStack: ve,
            digest: je
          });
        }
      if (Am) {
        Am = !1;
        var _e = FS;
        throw FS = null, _e;
      }
      return ea(Ip, Ye) && e.tag !== No && $u(), f = e.pendingLanes, ea(f, Ye) ? (X1(), e === VS ? Yp++ : (Yp = 0, VS = e)) : Yp = 0, Lo(), bd(), null;
    }
    function $u() {
      if (Vo !== null) {
        var e = Kv(Ip), t = _s(Ua, e), a = Br.transition, i = Aa();
        try {
          return Br.transition = null, Fn(t), Ww();
        } finally {
          Fn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function Qw(e) {
      HS.push(e), nc || (nc = !0, XS(qi, function() {
        return $u(), null;
      }));
    }
    function Ww() {
      if (Vo === null)
        return !1;
      var e = PS;
      PS = null;
      var t = Vo, a = Ip;
      if (Vo = null, Ip = G, (Dt & (Ir | ji)) !== hr)
        throw new Error("Cannot flush passive effects while already rendering.");
      BS = !0, jm = !1, Su(a);
      var i = Dt;
      Dt |= ji, dw(t.current), ow(t, t.current, a, e);
      {
        var u = HS;
        HS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          GT(t, f);
        }
      }
      wd(), pE(t.current, !0), Dt = i, Lo(), jm ? t === Fm ? Bf++ : (Bf = 0, Fm = t) : Bf = 0, BS = !1, jm = !1, xd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function cE(e) {
      return Vf !== null && Vf.has(e);
    }
    function Gw(e) {
      Vf === null ? Vf = /* @__PURE__ */ new Set([e]) : Vf.add(e);
    }
    function qw(e) {
      Am || (Am = !0, FS = e);
    }
    var Xw = qw;
    function fE(e, t, a) {
      var i = Js(a, t), u = oC(e, i, Ye), s = Uo(e, u, Ye), f = Ca();
      s !== null && (So(s, Ye, f), Ba(s, f));
    }
    function dn(e, t, a) {
      if (VT(a), Gp(!1), e.tag === ne) {
        fE(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === ne) {
          fE(i, e, a);
          return;
        } else if (i.tag === le) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !cE(s)) {
            var f = Js(a, e), p = pS(i, f, Ye), v = Uo(i, p, Ye), y = Ca();
            v !== null && (So(v, Ye, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function Kw(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ca();
      Jc(e, a), lk(e), xa === e && _u(mr, a) && (yr === Fp || yr === Mm && ku(mr) && Wn() - jS < KC ? rc(e, G) : zm = it(zm, a)), Ba(e, u);
    }
    function dE(e, t) {
      t === Mt && (t = Nw(e));
      var a = Ca(), i = Ha(e, t);
      i !== null && (So(i, t, a), Ba(i, a));
    }
    function Zw(e) {
      var t = e.memoizedState, a = Mt;
      t !== null && (a = t.retryLane), dE(e, a);
    }
    function Jw(e, t) {
      var a = Mt, i;
      switch (e.tag) {
        case we:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case It:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), dE(e, a);
    }
    function ek(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : kw(e / 1960) * 1960;
    }
    function tk() {
      if (Yp > Dw)
        throw Yp = 0, VS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Bf > Ow && (Bf = 0, Fm = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function nk() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function pE(e, t) {
      Xt(e), Im(e, kl, Cw), t && Im(e, bi, Ew), Im(e, kl, Sw), t && Im(e, bi, xw), fn();
    }
    function Im(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Le ? i = i.child : ((i.flags & t) !== Le && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Ym = null;
    function vE(e) {
      {
        if ((Dt & Ir) !== hr || !(e.mode & St))
          return;
        var t = e.tag;
        if (t !== Ge && t !== ne && t !== le && t !== oe && t !== ze && t !== nt && t !== Ne)
          return;
        var a = Xe(e) || "ReactComponent";
        if (Ym !== null) {
          if (Ym.has(a))
            return;
          Ym.add(a);
        } else
          Ym = /* @__PURE__ */ new Set([a]);
        var i = lr;
        try {
          Xt(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Xt(e) : fn();
        }
      }
    }
    var WS;
    {
      var rk = null;
      WS = function(e, t, a) {
        var i = EE(rk, t);
        try {
          return kC(e, t, a);
        } catch (s) {
          if (h1() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Kh(), Dx(), MC(e, t), EE(t, i), t.mode & At && qg(t), wl(null, kC, null, e, t, a), Qi()) {
            var u = us();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var hE = !1, GS;
    GS = /* @__PURE__ */ new Set();
    function ak(e) {
      if (mi && !W1())
        switch (e.tag) {
          case oe:
          case ze:
          case Ne: {
            var t = On && Xe(On) || "Unknown", a = t;
            if (!GS.has(a)) {
              GS.add(a);
              var i = Xe(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case le: {
            hE || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), hE = !0);
            break;
          }
        }
    }
    function Wp(e, t) {
      if (Zr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ws(e, i, t);
        });
      }
    }
    var qS = {};
    function XS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), qS) : hd(e, t);
      }
    }
    function mE(e) {
      if (e !== qS)
        return zv(e);
    }
    function yE() {
      return dl.current !== null;
    }
    function ik(e) {
      {
        if (e.mode & St) {
          if (!GC())
            return;
        } else if (!ww() || Dt !== hr || e.tag !== oe && e.tag !== ze && e.tag !== Ne)
          return;
        if (dl.current === null) {
          var t = lr;
          try {
            Xt(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Xe(e));
          } finally {
            t ? Xt(e) : fn();
          }
        }
      }
    }
    function lk(e) {
      e.tag !== No && GC() && dl.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Gp(e) {
      eE = e;
    }
    var Fi = null, If = null, uk = function(e) {
      Fi = e;
    };
    function Yf(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function KS(e) {
      return Yf(e);
    }
    function ZS(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Yf(e.render);
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
    function gE(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case le: {
            typeof i == "function" && (u = !0);
            break;
          }
          case oe: {
            (typeof i == "function" || s === Ze) && (u = !0);
            break;
          }
          case ze: {
            (s === Q || s === Ze) && (u = !0);
            break;
          }
          case nt:
          case Ne: {
            (s === rt || s === Ze) && (u = !0);
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
    function SE(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        If === null && (If = /* @__PURE__ */ new WeakSet()), If.add(e);
      }
    }
    var ok = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Yu(function() {
          JS(e.current, i, a);
        });
      }
    }, sk = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Yu(function() {
          qp(t, e, null, null);
        });
      }
    };
    function JS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case oe:
          case Ne:
          case le:
            v = p;
            break;
          case ze:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, g = !1;
        if (v !== null) {
          var k = Fi(v);
          k !== void 0 && (a.has(k) ? g = !0 : t.has(k) && (f === le ? g = !0 : y = !0));
        }
        if (If !== null && (If.has(e) || i !== null && If.has(i)) && (g = !0), g && (e._debugNeedsRemount = !0), g || y) {
          var T = Ha(e, Ye);
          T !== null && gr(T, e, Ye, nn);
        }
        u !== null && !g && JS(u, t, a), s !== null && JS(s, t, a);
      }
    }
    var ck = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return e0(e.current, i, a), a;
      }
    };
    function e0(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case oe:
          case Ne:
          case le:
            p = f;
            break;
          case ze:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? fk(e, a) : i !== null && e0(i, t, a), u !== null && e0(u, t, a);
      }
    }
    function fk(e, t) {
      {
        var a = dk(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ae:
              t.add(i.stateNode);
              return;
            case de:
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
    function dk(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ae)
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
    var t0;
    {
      t0 = !1;
      try {
        var xE = Object.preventExtensions({});
      } catch {
        t0 = !0;
      }
    }
    function pk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Le, this.subtreeFlags = Le, this.deletions = null, this.lanes = G, this.childLanes = G, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !t0 && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new pk(e, t, a, i);
    };
    function n0(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function vk(e) {
      return typeof e == "function" && !n0(e) && e.defaultProps === void 0;
    }
    function hk(e) {
      if (typeof e == "function")
        return n0(e) ? le : oe;
      if (e != null) {
        var t = e.$$typeof;
        if (t === Q)
          return ze;
        if (t === rt)
          return nt;
      }
      return Ge;
    }
    function ic(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Le, a.subtreeFlags = Le, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & zn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Ge:
        case oe:
        case Ne:
          a.type = Yf(e.type);
          break;
        case le:
          a.type = KS(e.type);
          break;
        case ze:
          a.type = ZS(e.type);
          break;
      }
      return a;
    }
    function mk(e, t) {
      e.flags &= zn | yn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = G, e.lanes = t, e.child = null, e.subtreeFlags = Le, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Le, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function yk(e, t, a) {
      var i;
      return e === Vh ? (i = St, t === !0 && (i |= Jt, i |= jt)) : i = Me, Zr && (i |= At), oi(ne, null, null, i);
    }
    function r0(e, t, a, i, u, s) {
      var f = Ge, p = e;
      if (typeof e == "function")
        n0(e) ? (f = le, p = KS(p)) : p = Yf(p);
      else if (typeof e == "string")
        f = ae;
      else
        e: switch (e) {
          case di:
            return Yo(a.children, u, s, t);
          case Wa:
            f = Ue, u |= Jt, (u & St) !== Me && (u |= jt);
            break;
          case pi:
            return gk(a, u, s, t);
          case fe:
            return Sk(a, u, s, t);
          case xe:
            return xk(a, u, s, t);
          case Rn:
            return CE(a, u, s, t);
          case ln:
          // eslint-disable-next-line no-fallthrough
          case xt:
          // eslint-disable-next-line no-fallthrough
          case cn:
          // eslint-disable-next-line no-fallthrough
          case ir:
          // eslint-disable-next-line no-fallthrough
          case gt:
          // eslint-disable-next-line no-fallthrough
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = qe;
                  break e;
                case E:
                  f = Qt;
                  break e;
                case Q:
                  f = ze, p = ZS(p);
                  break e;
                case rt:
                  f = nt;
                  break e;
                case Ze:
                  f = Bt, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? Xe(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var g = oi(f, a, t, u);
      return g.elementType = e, g.type = p, g.lanes = s, g._debugOwner = i, g;
    }
    function a0(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = r0(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Yo(e, t, a, i) {
      var u = oi(et, e, i, t);
      return u.lanes = a, u;
    }
    function gk(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(ut, e, i, t | At);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function Sk(e, t, a, i) {
      var u = oi(we, e, i, t);
      return u.elementType = fe, u.lanes = a, u;
    }
    function xk(e, t, a, i) {
      var u = oi(It, e, i, t);
      return u.elementType = xe, u.lanes = a, u;
    }
    function CE(e, t, a, i) {
      var u = oi(De, e, i, t);
      u.elementType = Rn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function i0(e, t, a) {
      var i = oi(Te, e, null, t);
      return i.lanes = a, i;
    }
    function Ck() {
      var e = oi(ae, null, null, Me);
      return e.elementType = "DELETED", e;
    }
    function Ek(e) {
      var t = oi(Ut, null, null, Me);
      return t.stateNode = e, t;
    }
    function l0(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(de, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function EE(e, t) {
      return e === null && (e = oi(Ge, null, null, Me)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function bk(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Vy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Mt, this.eventTimes = Ts(G), this.expirationTimes = Ts(nn), this.pendingLanes = G, this.suspendedLanes = G, this.pingedLanes = G, this.expiredLanes = G, this.mutableReadLanes = G, this.finishedLanes = G, this.entangledLanes = G, this.entanglements = Ts(G), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Vh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case No:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function bE(e, t, a, i, u, s, f, p, v, y) {
      var g = new bk(e, t, a, p, v), k = yk(t, s);
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
    var u0 = "18.3.1";
    function Rk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return $r(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: ar,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var o0, s0;
    o0 = !1, s0 = {};
    function RE(e) {
      if (!e)
        return ui;
      var t = po(e), a = l1(t);
      if (t.tag === le) {
        var i = t.type;
        if (Yl(i))
          return K0(t, i, a);
      }
      return a;
    }
    function Tk(e, t) {
      {
        var a = po(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Xr(a);
        if (u === null)
          return null;
        if (u.mode & Jt) {
          var s = Xe(a) || "Component";
          if (!s0[s]) {
            s0[s] = !0;
            var f = lr;
            try {
              Xt(u), a.mode & Jt ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Xt(f) : fn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function TE(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return bE(e, t, v, y, a, i, u, s, f);
    }
    function wE(e, t, a, i, u, s, f, p, v, y) {
      var g = !0, k = bE(a, i, g, e, u, s, f, p, v);
      k.context = RE(null);
      var T = k.current, U = Ca(), j = Bo(T), P = Pu(U, j);
      return P.callback = t ?? null, Uo(T, P, j), Lw(k, j, U), k;
    }
    function qp(e, t, a, i) {
      gd(t, e);
      var u = t.current, s = Ca(), f = Bo(u);
      Sn(f);
      var p = RE(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && lr !== null && !o0 && (o0 = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Xe(lr) || "Unknown"));
      var v = Pu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Uo(u, v, f);
      return y !== null && (gr(y, u, f, s), nm(y, u, f)), f;
    }
    function $m(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ae:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function wk(e) {
      switch (e.tag) {
        case ne: {
          var t = e.stateNode;
          if (tf(t)) {
            var a = Vv(t);
            Aw(t, a);
          }
          break;
        }
        case we: {
          Yu(function() {
            var u = Ha(e, Ye);
            if (u !== null) {
              var s = Ca();
              gr(u, e, Ye, s);
            }
          });
          var i = Ye;
          c0(e, i);
          break;
        }
      }
    }
    function kE(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Qv(a.retryLane, t));
    }
    function c0(e, t) {
      kE(e, t);
      var a = e.alternate;
      a && kE(a, t);
    }
    function kk(e) {
      if (e.tag === we) {
        var t = Ss, a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        c0(e, t);
      }
    }
    function _k(e) {
      if (e.tag === we) {
        var t = Bo(e), a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        c0(e, t);
      }
    }
    function _E(e) {
      var t = pn(e);
      return t === null ? null : t.stateNode;
    }
    var DE = function(e) {
      return null;
    };
    function Dk(e) {
      return DE(e);
    }
    var OE = function(e) {
      return !1;
    };
    function Ok(e) {
      return OE(e);
    }
    var NE = null, LE = null, ME = null, UE = null, zE = null, AE = null, jE = null, FE = null, HE = null;
    {
      var PE = function(e, t, a) {
        var i = t[a], u = vt(e) ? e.slice() : st({}, e);
        return a + 1 === t.length ? (vt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = PE(e[i], t, a + 1), u);
      }, VE = function(e, t) {
        return PE(e, t, 0);
      }, BE = function(e, t, a, i) {
        var u = t[i], s = vt(e) ? e.slice() : st({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], vt(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = BE(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, IE = function(e, t, a) {
        if (t.length !== a.length) {
          Ve("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              Ve("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return BE(e, t, a, 0);
      }, YE = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = vt(e) ? e.slice() : st({}, e);
        return s[u] = YE(e[u], t, a + 1, i), s;
      }, $E = function(e, t, a) {
        return YE(e, t, 0, a);
      }, f0 = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      NE = function(e, t, a, i) {
        var u = f0(e, t);
        if (u !== null) {
          var s = $E(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = st({}, e.memoizedProps);
          var f = Ha(e, Ye);
          f !== null && gr(f, e, Ye, nn);
        }
      }, LE = function(e, t, a) {
        var i = f0(e, t);
        if (i !== null) {
          var u = VE(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = st({}, e.memoizedProps);
          var s = Ha(e, Ye);
          s !== null && gr(s, e, Ye, nn);
        }
      }, ME = function(e, t, a, i) {
        var u = f0(e, t);
        if (u !== null) {
          var s = IE(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = st({}, e.memoizedProps);
          var f = Ha(e, Ye);
          f !== null && gr(f, e, Ye, nn);
        }
      }, UE = function(e, t, a) {
        e.pendingProps = $E(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, Ye);
        i !== null && gr(i, e, Ye, nn);
      }, zE = function(e, t) {
        e.pendingProps = VE(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ha(e, Ye);
        a !== null && gr(a, e, Ye, nn);
      }, AE = function(e, t, a) {
        e.pendingProps = IE(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, Ye);
        i !== null && gr(i, e, Ye, nn);
      }, jE = function(e) {
        var t = Ha(e, Ye);
        t !== null && gr(t, e, Ye, nn);
      }, FE = function(e) {
        DE = e;
      }, HE = function(e) {
        OE = e;
      };
    }
    function Nk(e) {
      var t = Xr(e);
      return t === null ? null : t.stateNode;
    }
    function Lk(e) {
      return null;
    }
    function Mk() {
      return lr;
    }
    function Uk(e) {
      var t = e.findFiberByHostInstance, a = D.ReactCurrentDispatcher;
      return mo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: NE,
        overrideHookStateDeletePath: LE,
        overrideHookStateRenamePath: ME,
        overrideProps: UE,
        overridePropsDeletePath: zE,
        overridePropsRenamePath: AE,
        setErrorHandler: FE,
        setSuspenseHandler: HE,
        scheduleUpdate: jE,
        currentDispatcherRef: a,
        findHostInstanceByFiber: Nk,
        findFiberByHostInstance: t || Lk,
        // React Refresh
        findHostInstancesForRefresh: ck,
        scheduleRefresh: ok,
        scheduleRoot: sk,
        setRefreshHandler: uk,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: Mk,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: u0
      });
    }
    var QE = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function d0(e) {
      this._internalRoot = e;
    }
    Qm.prototype.render = d0.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Wm(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Mn) {
          var i = _E(t.current);
          i && i.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      qp(e, t, null, null);
    }, Qm.prototype.unmount = d0.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        aE() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          qp(null, e, null, null);
        }), Q0(t);
      }
    };
    function zk(e, t) {
      if (!Wm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      WE(e);
      var a = !1, i = !1, u = "", s = QE;
      t != null && (t.hydrate ? Ve("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === _r && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = TE(e, Vh, null, a, i, u, s);
      Uh(f.current, e);
      var p = e.nodeType === Mn ? e.parentNode : e;
      return tp(p), new d0(f);
    }
    function Qm(e) {
      this._internalRoot = e;
    }
    function Ak(e) {
      e && nh(e);
    }
    Qm.prototype.unstable_scheduleHydration = Ak;
    function jk(e, t, a) {
      if (!Wm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      WE(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = QE;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = wE(t, null, e, Vh, i, s, f, p, v);
      if (Uh(y.current, e), tp(e), u)
        for (var g = 0; g < u.length; g++) {
          var k = u[g];
          V1(y, k);
        }
      return new Qm(y);
    }
    function Wm(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === rd));
    }
    function Xp(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === rd || e.nodeType === Mn && e.nodeValue === " react-mount-point-unstable "));
    }
    function WE(e) {
      e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), dp(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var Fk = D.ReactCurrentOwner, GE;
    GE = function(e) {
      if (e._reactRootContainer && e.nodeType !== Mn) {
        var t = _E(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = p0(e), u = !!(i && Do(i));
      u && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function p0(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function qE() {
    }
    function Hk(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var T = $m(f);
            s.call(T);
          };
        }
        var f = wE(
          t,
          i,
          e,
          No,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          qE
        );
        e._reactRootContainer = f, Uh(f.current, e);
        var p = e.nodeType === Mn ? e.parentNode : e;
        return tp(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var T = $m(g);
            y.call(T);
          };
        }
        var g = TE(
          e,
          No,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          qE
        );
        e._reactRootContainer = g, Uh(g.current, e);
        var k = e.nodeType === Mn ? e.parentNode : e;
        return tp(k), Yu(function() {
          qp(t, g, a, i);
        }), g;
      }
    }
    function Pk(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Gm(e, t, a, i, u) {
      GE(a), Pk(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = Hk(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = $m(f);
            p.call(v);
          };
        }
        qp(t, f, e, u);
      }
      return $m(f);
    }
    var XE = !1;
    function Vk(e) {
      {
        XE || (XE = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = Fk.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Nt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Wr ? e : Tk(e, "findDOMNode");
    }
    function Bk(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = dp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Gm(null, e, t, !0, a);
    }
    function Ik(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = dp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Gm(null, e, t, !1, a);
    }
    function Yk(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !cy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Gm(e, t, a, !1, i);
    }
    var KE = !1;
    function $k(e) {
      if (KE || (KE = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Xp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = dp(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = p0(e), i = a && !Do(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          Gm(null, null, e, !1, function() {
            e._reactRootContainer = null, Q0(e);
          });
        }), !0;
      } else {
        {
          var u = p0(e), s = !!(u && Do(u)), f = e.nodeType === Wr && Xp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Rr(wk), xo(kk), Zv(_k), Os(Aa), Fd(qv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), gc(Wb), sy(YS, jw, Yu);
    function Qk(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Wm(t))
        throw new Error("Target container is not a DOM element.");
      return Rk(e, t, null, a);
    }
    function Wk(e, t, a, i) {
      return Yk(e, t, a, i);
    }
    var v0 = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Do, Cf, zh, oo, Sc, YS]
    };
    function Gk(e, t) {
      return v0.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), zk(e, t);
    }
    function qk(e, t, a) {
      return v0.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), jk(e, t, a);
    }
    function Xk(e) {
      return aE() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var Kk = Uk({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: u0,
      rendererPackageName: "react-dom"
    });
    if (!Kk && Nn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var ZE = window.location.protocol;
      /^(https?|file):$/.test(ZE) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (ZE === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = v0, Ya.createPortal = Qk, Ya.createRoot = Gk, Ya.findDOMNode = Vk, Ya.flushSync = Xk, Ya.hydrate = Bk, Ya.hydrateRoot = qk, Ya.render = Ik, Ya.unmountComponentAtNode = $k, Ya.unstable_batchedUpdates = YS, Ya.unstable_renderSubtreeIntoContainer = Wk, Ya.version = u0, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  })()), Ya;
}
var cb;
function s_() {
  if (cb) return Km.exports;
  cb = 1;
  function R() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(R);
      } catch (I) {
        console.error(I);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (R(), Km.exports = u_()) : Km.exports = o_(), Km.exports;
}
var fb;
function c_() {
  if (fb) return Qf;
  fb = 1;
  var R = s_();
  if (process.env.NODE_ENV === "production")
    Qf.createRoot = R.createRoot, Qf.hydrateRoot = R.hydrateRoot;
  else {
    var I = R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    Qf.createRoot = function(D, Ke) {
      I.usingClientEntryPoint = !0;
      try {
        return R.createRoot(D, Ke);
      } finally {
        I.usingClientEntryPoint = !1;
      }
    }, Qf.hydrateRoot = function(D, Ke, Ie) {
      I.usingClientEntryPoint = !0;
      try {
        return R.hydrateRoot(D, Ke, Ie);
      } finally {
        I.usingClientEntryPoint = !1;
      }
    };
  }
  return Qf;
}
var f_ = c_();
let g0;
function d_(R) {
  g0 = R;
}
function rv(R, I = {}) {
  return g0 ? g0.moduleCall(`clx.quickapps.${R}`, I) : Promise.reject(new Error("Quick Apps host is not registered"));
}
const p_ = () => rv("list"), v_ = (R) => {
  const { iconDataUrl: I, iconMissing: D, ...Ke } = R;
  return rv("upsert", { app: Ke });
}, h_ = (R) => rv("delete", { id: R }), m_ = () => rv("reextractIcons"), y_ = (R) => rv("launch", { id: R });
var lt = nv();
async function pb(R, I = {}, D) {
  return window.__TAURI_INTERNALS__.invoke(R, I, D);
}
function g_(R) {
  if (R !== void 0) {
    if (typeof R == "string")
      return R;
    if ("ok" in R && "cancel" in R)
      return { OkCancelCustom: [R.ok, R.cancel] };
    if ("yes" in R && "no" in R && "cancel" in R)
      return {
        YesNoCancelCustom: [R.yes, R.no, R.cancel]
      };
    if ("ok" in R)
      return { OkCustom: R.ok };
  }
}
async function y0(R = {}) {
  return typeof R == "object" && Object.freeze(R), await pb("plugin:dialog|open", { options: R });
}
async function S_(R, I) {
  return await pb("plugin:dialog|message", {
    message: R,
    title: I == null ? void 0 : I.title,
    kind: I == null ? void 0 : I.kind,
    buttons: g_(I == null ? void 0 : I.buttons)
  });
}
async function x_(R, I) {
  const D = typeof I == "string" ? { title: I } : I, Ke = (D == null ? void 0 : D.okLabel) || (D == null ? void 0 : D.cancelLabel), Ie = (D == null ? void 0 : D.okLabel) ?? "Ok";
  return await S_(R, {
    title: D == null ? void 0 : D.title,
    kind: D == null ? void 0 : D.kind,
    buttons: Ke ? { ok: Ie, cancel: D.cancelLabel ?? "Cancel" } : "OkCancel"
  }) === Ie;
}
function C_() {
  return /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", className: "h-4 w-4", children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) });
}
function E_() {
  return /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3.5 w-3.5", children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" }) });
}
function b_() {
  return /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3 w-3", children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487 1.687 20.662a1.875 1.875 0 0 0 2.652 2.652L19.514 7.14a1.875 1.875 0 0 0-2.652-2.652Z" }) });
}
function R_() {
  return /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-3 w-3", children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" }) });
}
function T_() {
  return /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-4 w-4", children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" }) });
}
function w_() {
  return /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-4 w-4", children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" }) });
}
function k_({ app: R, selected: I, onLaunch: D, onEdit: Ke, onDelete: Ie, size: Ve = "md" }) {
  var et;
  const [S, ct] = lt.useState(!1), oe = lt.useCallback(() => D(R), [R, D]), le = lt.useCallback((Ue) => {
    Ue.stopPropagation(), Ke(R);
  }, [R, Ke]), Ge = lt.useCallback((Ue) => {
    Ue.stopPropagation(), Ie(R);
  }, [R, Ie]), ne = Ve === "sm" ? "w-10 h-10" : Ve === "lg" ? "w-16 h-16" : "w-12 h-12", de = Ve === "sm" ? "w-8 h-8" : Ve === "lg" ? "w-14 h-14" : "w-10 h-10", ae = Ve === "sm" ? "p-2 gap-1.5" : Ve === "lg" ? "p-4 gap-3" : "p-3 gap-2", Te = Ve === "sm" ? "text-[9px]" : Ve === "lg" ? "text-[13px]" : "text-[11px]";
  return /* @__PURE__ */ F.jsxs(
    "button",
    {
      type: "button",
      onClick: oe,
      onMouseEnter: () => ct(!0),
      onMouseLeave: () => ct(!1),
      title: `${R.command}${(et = R.args) != null && et.length ? " " + R.args.join(" ") : ""}
Single-click to launch
Hover for options`,
      className: `group relative flex flex-col items-center ${ae} rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-accent ${I ? "bg-cyber-accent/20 border-cyber-accent shadow-lg shadow-cyber-accent/20 scale-105" : "bg-cyber-surface/30 border-cyber-line/30 hover:bg-cyber-accent/10 hover:border-cyber-accent/40 hover:scale-105 hover:shadow-md hover:shadow-cyber-accent/10"}`,
      children: [
        /* @__PURE__ */ F.jsx("div", { className: `${ne} rounded-lg bg-cyber-base/60 border border-cyber-line/40 flex items-center justify-center overflow-hidden shrink-0 transition-all duration-200 ${I ? "border-cyber-accent/60" : "group-hover:border-cyber-accent/30"}`, children: R.iconDataUrl && !R.iconMissing ? /* @__PURE__ */ F.jsx(
          "img",
          {
            src: R.iconDataUrl,
            alt: R.name,
            className: `${de} object-contain`,
            draggable: !1
          }
        ) : /* @__PURE__ */ F.jsx("div", { className: `${de} flex items-center justify-center`, children: /* @__PURE__ */ F.jsx("span", { className: `text-cyber-muted font-bold uppercase tracking-wider text-center px-1 ${Ve === "sm" ? "text-[8px]" : "text-[10px]"}`, children: R.name.slice(0, 2).toUpperCase() }) }) }),
        /* @__PURE__ */ F.jsx("div", { className: `w-full ${Te} text-cyber-text text-center line-clamp-2 break-words leading-tight font-medium`, children: R.name }),
        S && /* @__PURE__ */ F.jsxs("div", { className: "absolute top-1 right-1 flex gap-0.5 z-10", children: [
          /* @__PURE__ */ F.jsx(
            "button",
            {
              type: "button",
              onClick: le,
              className: "p-0.5 rounded bg-cyber-base/80 border border-cyber-line/60 text-cyber-muted hover:text-cyber-accent hover:border-cyber-accent/50 transition-colors",
              title: "Edit",
              children: /* @__PURE__ */ F.jsx(b_, {})
            }
          ),
          /* @__PURE__ */ F.jsx(
            "button",
            {
              type: "button",
              onClick: Ge,
              className: "p-0.5 rounded bg-cyber-base/80 border border-cyber-line/60 text-cyber-muted hover:text-cyber-warn hover:border-cyber-warn/50 transition-colors",
              title: "Delete",
              children: /* @__PURE__ */ F.jsx(R_, {})
            }
          )
        ] }),
        I && /* @__PURE__ */ F.jsx("div", { className: "absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyber-accent" })
      ]
    }
  );
}
function __({ initial: R, existingGroups: I, onCancel: D, onSubmit: Ke }) {
  const [Ie, Ve] = lt.useState((R == null ? void 0 : R.name) ?? ""), [S, ct] = lt.useState((R == null ? void 0 : R.command) ?? ""), [oe, le] = lt.useState(((R == null ? void 0 : R.args) ?? []).join(" ")), [Ge, ne] = lt.useState((R == null ? void 0 : R.workingDir) ?? ""), [de, ae] = lt.useState((R == null ? void 0 : R.iconPath) ?? ""), [Te, et] = lt.useState((R == null ? void 0 : R.order) ?? 0), [Ue, Qt] = lt.useState((R == null ? void 0 : R.group) ?? ""), [qe, ze] = lt.useState(""), [ut, we] = lt.useState(!1), [nt, Ne] = lt.useState(!1), [Bt, Rt] = lt.useState(null), [Ut, It] = lt.useState(!1);
  lt.useEffect(() => {
    R && (Ve(R.name), ct(R.command), le((R.args ?? []).join(" ")), ne(R.workingDir ?? ""), ae(R.iconPath ?? ""), et(R.order), Qt(R.group ?? ""));
  }, [R]);
  const ht = lt.useCallback(async () => {
    try {
      const Y = await y0({
        directory: !1,
        multiple: !1,
        title: "Select executable",
        filters: [
          { name: "Executables", extensions: ["exe", "bat", "cmd", "lnk", "ps1"] },
          { name: "All files", extensions: ["*"] }
        ]
      });
      if (typeof Y == "string" && (ct(Y), !Ie.trim())) {
        const ce = (Y.split(/[/\\]/).pop() ?? "").replace(/\.(exe|bat|cmd|lnk|ps1)$/i, "");
        Ve(ce);
      }
    } catch (Y) {
      console.error("Pick exe failed:", Y);
    }
  }, [Ie]), De = lt.useCallback(async () => {
    try {
      const Y = await y0({
        directory: !1,
        multiple: !1,
        title: "Select icon file (optional)",
        filters: [{ name: "Icons", extensions: ["png", "ico", "jpg", "jpeg"] }]
      });
      typeof Y == "string" && ae(Y);
    } catch (Y) {
      console.error("Pick icon failed:", Y);
    }
  }, []), Et = lt.useCallback(async () => {
    try {
      const Y = await y0({
        directory: !0,
        multiple: !1,
        title: "Select working directory"
      });
      typeof Y == "string" && ne(Y);
    } catch (Y) {
      console.error("Pick working dir failed:", Y);
    }
  }, []), bt = ut ? qe : Ue, re = lt.useCallback(
    async (Y) => {
      if (Y.preventDefault(), Rt(null), !Ie.trim()) {
        Rt("Name is required");
        return;
      }
      if (!S.trim()) {
        Rt("Command is required");
        return;
      }
      const W = oe.split(/\s+/).map((_) => _.trim()).filter((_) => _.length > 0), ee = {
        id: (R == null ? void 0 : R.id) ?? D_(Ie),
        name: Ie.trim(),
        command: S.trim(),
        args: W,
        workingDir: Ge.trim() || void 0,
        iconPath: de.trim() || void 0,
        order: Te,
        iconMissing: (R == null ? void 0 : R.iconMissing) ?? !0,
        iconDataUrl: R == null ? void 0 : R.iconDataUrl,
        group: bt.trim() || void 0
      };
      Ne(!0);
      try {
        await Ke(ee);
      } catch (_) {
        Rt(String(_));
      } finally {
        Ne(!1);
      }
    },
    [R, Ie, S, oe, Ge, de, Te, bt, Ke]
  );
  return /* @__PURE__ */ F.jsxs("div", { className: "flex flex-col h-full overflow-hidden", children: [
    /* @__PURE__ */ F.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-cyber-line/40 bg-cyber-base/30 shrink-0", children: [
      /* @__PURE__ */ F.jsxs("div", { children: [
        /* @__PURE__ */ F.jsx("h3", { className: "text-sm font-bold text-cyber-accent uppercase tracking-wider", children: R ? "✎ Edit App" : "+ New App" }),
        /* @__PURE__ */ F.jsx("p", { className: "text-[10px] text-cyber-muted mt-0.5", children: R ? `Editing: ${R.name}` : "Fill in the details below" })
      ] }),
      (R == null ? void 0 : R.iconDataUrl) && !R.iconMissing && /* @__PURE__ */ F.jsx("img", { src: R.iconDataUrl, alt: R.name, className: "w-10 h-10 object-contain rounded-lg border border-cyber-line/40 bg-cyber-base/60", draggable: !1 })
    ] }),
    /* @__PURE__ */ F.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ F.jsxs("form", { id: "quickapp-form", onSubmit: re, className: "flex flex-col gap-4 p-5 pb-4", children: [
      /* @__PURE__ */ F.jsxs("label", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ F.jsxs("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-cyber-muted", children: [
          "Name ",
          /* @__PURE__ */ F.jsx("span", { className: "text-cyber-warn", children: "*" })
        ] }),
        /* @__PURE__ */ F.jsx(
          "input",
          {
            value: Ie,
            onChange: (Y) => Ve(Y.target.value),
            placeholder: "Google Chrome",
            className: "px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
          }
        )
      ] }),
      /* @__PURE__ */ F.jsxs("label", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ F.jsxs("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-cyber-muted", children: [
          "Command / Path ",
          /* @__PURE__ */ F.jsx("span", { className: "text-cyber-warn", children: "*" })
        ] }),
        /* @__PURE__ */ F.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ F.jsx(
            "input",
            {
              value: S,
              onChange: (Y) => ct(Y.target.value),
              placeholder: "C:\\Program Files\\Google\\Chrome\\chrome.exe",
              className: "flex-1 min-w-0 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
            }
          ),
          /* @__PURE__ */ F.jsx(
            "button",
            {
              type: "button",
              onClick: ht,
              className: "px-3 py-2 rounded-lg bg-cyber-accent/20 hover:bg-cyber-accent/40 text-cyber-accent text-[11px] border border-cyber-accent/40 font-semibold transition-all hover:border-cyber-accent/70 shrink-0",
              children: "Browse"
            }
          )
        ] }),
        /* @__PURE__ */ F.jsx("p", { className: "text-[10px] text-cyber-muted/70 leading-relaxed", children: "Supports .exe, .bat, .cmd, .lnk (shortcuts), .ps1" })
      ] }),
      /* @__PURE__ */ F.jsxs("label", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ F.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-cyber-muted", children: "Group (optional)" }),
        ut ? /* @__PURE__ */ F.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ F.jsx(
            "input",
            {
              value: qe,
              onChange: (Y) => ze(Y.target.value),
              placeholder: "e.g. Development, Social, Utilities",
              autoFocus: !0,
              className: "flex-1 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-accent/50 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 transition-all placeholder:text-cyber-muted/50"
            }
          ),
          /* @__PURE__ */ F.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                we(!1), ze("");
              },
              className: "px-3 py-2 rounded-lg bg-cyber-surface/40 hover:bg-cyber-surface/80 text-cyber-muted text-[10px] border border-cyber-line/50 transition-all shrink-0",
              children: "← Back"
            }
          )
        ] }) : /* @__PURE__ */ F.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ F.jsxs(
            "select",
            {
              value: Ue,
              onChange: (Y) => Qt(Y.target.value),
              className: "flex-1 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all",
              children: [
                /* @__PURE__ */ F.jsx("option", { value: "", children: "— No group —" }),
                I.map((Y) => /* @__PURE__ */ F.jsx("option", { value: Y, children: Y }, Y))
              ]
            }
          ),
          /* @__PURE__ */ F.jsx(
            "button",
            {
              type: "button",
              onClick: () => we(!0),
              className: "px-3 py-2 rounded-lg bg-cyber-surface/40 hover:bg-cyber-surface/80 text-cyber-muted text-[10px] border border-cyber-line/50 transition-all shrink-0",
              children: "+ New"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ F.jsxs(
        "button",
        {
          type: "button",
          onClick: () => It(!Ut),
          className: "flex items-center gap-2 text-[11px] text-cyber-muted hover:text-cyber-text transition-colors",
          children: [
            /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: `h-3.5 w-3.5 transition-transform ${Ut ? "rotate-90" : ""}`, children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 4.5l7.5 7.5-7.5 7.5" }) }),
            "Advanced options"
          ]
        }
      ),
      Ut && /* @__PURE__ */ F.jsxs("div", { className: "flex flex-col gap-4 pl-4 border-l-2 border-cyber-line/40", children: [
        /* @__PURE__ */ F.jsxs("label", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ F.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-cyber-muted", children: "Arguments" }),
          /* @__PURE__ */ F.jsx(
            "input",
            {
              value: oe,
              onChange: (Y) => le(Y.target.value),
              placeholder: "--new-window --profile-directory=Default",
              className: "px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
            }
          ),
          /* @__PURE__ */ F.jsx("p", { className: "text-[10px] text-cyber-muted/70", children: "Space-separated arguments" })
        ] }),
        /* @__PURE__ */ F.jsxs("label", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ F.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-cyber-muted", children: "Working Directory" }),
          /* @__PURE__ */ F.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ F.jsx(
              "input",
              {
                value: Ge,
                onChange: (Y) => ne(Y.target.value),
                placeholder: "Leave blank to use default",
                className: "flex-1 min-w-0 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
              }
            ),
            /* @__PURE__ */ F.jsx(
              "button",
              {
                type: "button",
                onClick: Et,
                className: "px-3 py-2 rounded-lg bg-cyber-accent/20 hover:bg-cyber-accent/40 text-cyber-accent text-[11px] border border-cyber-accent/40 font-semibold transition-all hover:border-cyber-accent/70 shrink-0",
                children: "Browse"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ F.jsxs("label", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ F.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-cyber-muted", children: "Custom Icon" }),
          /* @__PURE__ */ F.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ F.jsx(
              "input",
              {
                value: de,
                onChange: (Y) => ae(Y.target.value),
                placeholder: "Auto-extracted from executable",
                className: "flex-1 min-w-0 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
              }
            ),
            /* @__PURE__ */ F.jsx(
              "button",
              {
                type: "button",
                onClick: De,
                className: "px-3 py-2 rounded-lg bg-cyber-accent/20 hover:bg-cyber-accent/40 text-cyber-accent text-[11px] border border-cyber-accent/40 font-semibold transition-all hover:border-cyber-accent/70 shrink-0",
                children: "Browse"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ F.jsxs("label", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ F.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-cyber-muted", children: "Sort Order" }),
          /* @__PURE__ */ F.jsx(
            "input",
            {
              type: "number",
              value: Te,
              onChange: (Y) => et(parseInt(Y.target.value, 10) || 0),
              className: "w-24 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all"
            }
          )
        ] })
      ] }),
      Bt && /* @__PURE__ */ F.jsxs("div", { className: "text-[11px] text-cyber-warn px-3 py-2 rounded-lg bg-cyber-warn/10 border border-cyber-warn/30", children: [
        "⚠ ",
        Bt
      ] })
    ] }) }),
    /* @__PURE__ */ F.jsxs("div", { className: "shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t-2 border-cyber-line/60 bg-cyber-base", children: [
      /* @__PURE__ */ F.jsx(
        "button",
        {
          type: "button",
          onClick: D,
          className: "px-4 py-2 rounded-lg text-[12px] text-cyber-muted hover:text-cyber-text border border-cyber-line/60 hover:border-cyber-line transition-all",
          children: "✕ Cancel"
        }
      ),
      /* @__PURE__ */ F.jsx(
        "button",
        {
          type: "submit",
          form: "quickapp-form",
          disabled: nt,
          className: "flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] bg-cyber-accent text-cyber-base hover:bg-cyber-accent-hover disabled:opacity-50 font-bold transition-all shadow-lg shadow-cyber-accent/30",
          children: nt ? /* @__PURE__ */ F.jsxs(F.Fragment, { children: [
            /* @__PURE__ */ F.jsx("div", { className: "w-3.5 h-3.5 border-2 border-cyber-base/40 border-t-cyber-base rounded-full animate-spin" }),
            "Saving…"
          ] }) : /* @__PURE__ */ F.jsxs(F.Fragment, { children: [
            "✓ ",
            R ? "Save Changes" : "Add App"
          ] })
        }
      )
    ] })
  ] });
}
function D_(R) {
  const I = R.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "app", D = Math.random().toString(36).slice(2, 6);
  return `${I}-${D}`;
}
const ev = "Uncategorized";
function O_() {
  const [R, I] = lt.useState([]), [D, Ke] = lt.useState(!0), [Ie, Ve] = lt.useState(!1), [S, ct] = lt.useState(null), [oe, le] = lt.useState(null), [Ge, ne] = lt.useState(null), [de, ae] = lt.useState(""), [Te, et] = lt.useState(null), [Ue, Qt] = lt.useState("md"), qe = lt.useRef(null), ze = lt.useCallback(async () => {
    Ke(!0), le(null);
    try {
      const re = await p_();
      I(re);
    } catch (re) {
      le(String(re));
    } finally {
      Ke(!1);
    }
  }, []);
  lt.useEffect(() => {
    ze();
  }, [ze]), lt.useEffect(() => () => {
    qe.current && window.clearTimeout(qe.current);
  }, []);
  const ut = lt.useCallback(async (re) => {
    try {
      await y_(re.id), ne(re.id), qe.current && window.clearTimeout(qe.current), qe.current = window.setTimeout(() => ne(null), 800);
    } catch (Y) {
      le(`Failed to launch ${re.name}: ${String(Y)}`);
    }
  }, []), we = lt.useCallback((re) => {
    ct(re), Ve(!0);
  }, []), nt = lt.useCallback(async (re) => {
    if (await x_(`Remove "${re.name}" from Quick Apps?`, {
      title: "Remove Quick App",
      kind: "warning"
    }))
      try {
        await h_(re.id), ct((W) => (W == null ? void 0 : W.id) === re.id ? null : W), await ze();
      } catch (W) {
        le(String(W));
      }
  }, [ze]), Ne = lt.useCallback(() => {
    ct(null), Ve(!0);
  }, []), Bt = lt.useCallback(() => {
    Ve(!1), ct(null);
  }, []), Rt = lt.useCallback(async (re) => {
    await v_(re), Ve(!1), ct(null), await ze();
  }, [ze]), Ut = lt.useCallback(async () => {
    Ke(!0), le(null);
    try {
      const re = await m_();
      I(re);
    } catch (re) {
      le(String(re));
    } finally {
      Ke(!1);
    }
  }, []), It = lt.useMemo(
    () => [...R].sort((re, Y) => re.order - Y.order || re.name.localeCompare(Y.name)),
    [R]
  ), ht = lt.useMemo(() => {
    var W;
    const re = /* @__PURE__ */ new Map();
    for (const ce of It) {
      const ee = ((W = ce.group) == null ? void 0 : W.trim()) || ev;
      re.has(ee) || re.set(ee, []), re.get(ee).push(ce);
    }
    return Array.from(re.entries()).sort(([ce], [ee]) => ce === ev && ee !== ev ? 1 : ee === ev && ce !== ev ? -1 : ce.localeCompare(ee));
  }, [It]), De = lt.useMemo(
    () => Array.from(new Set(R.map((re) => re.group).filter(Boolean))).sort(),
    [R]
  ), Et = lt.useMemo(() => {
    const re = de.trim().toLowerCase();
    return ht.map(([Y, W]) => {
      const ce = W.filter((ee) => {
        const _ = !Te || Te === Y, B = !re || ee.name.toLowerCase().includes(re) || ee.command.toLowerCase().includes(re);
        return _ && B;
      });
      return [Y, ce];
    }).filter(([, Y]) => Y.length > 0);
  }, [ht, Te, de]), bt = Et.reduce((re, [, Y]) => re + Y.length, 0);
  return Ie ? /* @__PURE__ */ F.jsx("div", { className: "flex h-full flex-col overflow-hidden bg-cyber-base", children: /* @__PURE__ */ F.jsx(
    __,
    {
      initial: S,
      existingGroups: De,
      onCancel: Bt,
      onSubmit: Rt
    }
  ) }) : /* @__PURE__ */ F.jsxs("div", { className: "flex h-full flex-col overflow-hidden bg-cyber-base", children: [
    /* @__PURE__ */ F.jsxs("div", { className: "flex shrink-0 items-center justify-between gap-3 border-b border-cyber-line px-6 py-4 bg-gradient-to-r from-cyber-base/80 to-cyber-surface/30", children: [
      /* @__PURE__ */ F.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ F.jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-cyber-accent/20 border border-cyber-accent/40", children: /* @__PURE__ */ F.jsx(w_, {}) }),
        /* @__PURE__ */ F.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ F.jsx("h2", { className: "font-display text-sm uppercase tracking-[0.2em] text-cyber-electric font-bold", children: "Quick Apps" }),
          /* @__PURE__ */ F.jsxs("p", { className: "text-[10px] text-slate-400 mt-0.5", children: [
            R.length,
            " ",
            R.length === 1 ? "app" : "apps",
            Te ? ` · ${Te}` : "",
            de ? ` · "${de}"` : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ F.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
        /* @__PURE__ */ F.jsx("div", { className: "flex gap-0.5 p-0.5 rounded-lg bg-cyber-surface/40 border border-cyber-line/40", children: ["sm", "md", "lg"].map((re) => /* @__PURE__ */ F.jsx(
          "button",
          {
            type: "button",
            onClick: () => Qt(re),
            className: `px-2 py-1 rounded text-[10px] font-mono transition-all ${Ue === re ? "bg-cyber-accent/30 text-cyber-accent border border-cyber-accent/50" : "text-cyber-muted hover:text-cyber-text"}`,
            children: re.toUpperCase()
          },
          re
        )) }),
        /* @__PURE__ */ F.jsxs(
          "button",
          {
            type: "button",
            onClick: () => void Ut(),
            disabled: D,
            title: "Re-extract all icons",
            className: "flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] rounded-lg text-cyber-muted hover:text-cyber-text border border-cyber-line/60 hover:border-cyber-accent/50 disabled:opacity-50 transition-all bg-cyber-surface/30",
            children: [
              /* @__PURE__ */ F.jsx(E_, {}),
              "Icons"
            ]
          }
        ),
        /* @__PURE__ */ F.jsxs(
          "button",
          {
            type: "button",
            onClick: Ne,
            className: "flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg bg-cyber-accent text-cyber-base hover:bg-cyber-accent-hover font-bold transition-all shadow-md shadow-cyber-accent/20",
            children: [
              /* @__PURE__ */ F.jsx(C_, {}),
              "Add App"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ F.jsxs("div", { className: "shrink-0 flex items-center gap-3 px-6 py-3 border-b border-cyber-line/50 bg-cyber-base/30", children: [
      /* @__PURE__ */ F.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
        /* @__PURE__ */ F.jsx("div", { className: "absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-cyber-muted", children: /* @__PURE__ */ F.jsx(T_, {}) }),
        /* @__PURE__ */ F.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search apps…",
            value: de,
            onChange: (re) => ae(re.target.value),
            className: "w-full pl-8 pr-3 py-1.5 rounded-lg bg-cyber-surface/40 border border-cyber-line/60 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/40 focus:border-cyber-accent/60 transition-all placeholder:text-cyber-muted/60"
          }
        ),
        de && /* @__PURE__ */ F.jsx(
          "button",
          {
            type: "button",
            onClick: () => ae(""),
            className: "absolute inset-y-0 right-2 flex items-center text-cyber-muted hover:text-cyber-text text-xs",
            children: "✕"
          }
        )
      ] }),
      ht.length > 1 && /* @__PURE__ */ F.jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto scrollbar-none", children: [
        /* @__PURE__ */ F.jsx(
          "button",
          {
            type: "button",
            onClick: () => et(null),
            className: `shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${Te ? "border-cyber-line/40 text-cyber-muted hover:border-cyber-accent/30 hover:text-cyber-text" : "bg-cyber-accent/20 border-cyber-accent/60 text-cyber-accent"}`,
            children: "All"
          }
        ),
        ht.map(([re, Y]) => /* @__PURE__ */ F.jsxs(
          "button",
          {
            type: "button",
            onClick: () => et(Te === re ? null : re),
            className: `shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${Te === re ? "bg-cyber-accent/20 border-cyber-accent/60 text-cyber-accent" : "border-cyber-line/40 text-cyber-muted hover:border-cyber-accent/30 hover:text-cyber-text"}`,
            children: [
              re,
              /* @__PURE__ */ F.jsx("span", { className: `text-[9px] px-1 py-0.5 rounded-full ${Te === re ? "bg-cyber-accent/30" : "bg-cyber-surface/60"}`, children: Y.length })
            ]
          },
          re
        ))
      ] })
    ] }),
    oe && /* @__PURE__ */ F.jsxs("div", { className: "shrink-0 mx-6 mt-3 px-4 py-2 text-[11px] text-cyber-warn bg-cyber-warn/10 border border-cyber-warn/30 rounded-lg", children: [
      "⚠ ",
      oe
    ] }),
    /* @__PURE__ */ F.jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: D && R.length === 0 ? /* @__PURE__ */ F.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ F.jsxs("div", { className: "flex flex-col items-center gap-3 text-cyber-muted", children: [
      /* @__PURE__ */ F.jsx("div", { className: "w-8 h-8 border-2 border-cyber-accent/40 border-t-cyber-accent rounded-full animate-spin" }),
      /* @__PURE__ */ F.jsx("span", { className: "text-[12px]", children: "Loading apps…" })
    ] }) }) : R.length === 0 ? (
      /* Empty state — no apps at all */
      /* @__PURE__ */ F.jsxs("div", { className: "flex flex-col items-center justify-center gap-6 h-full text-cyber-muted", children: [
        /* @__PURE__ */ F.jsxs(
          "button",
          {
            type: "button",
            onClick: Ne,
            title: "Add new quick app",
            className: "group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-cyber-accent/40 hover:border-cyber-accent hover:bg-cyber-accent/5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-accent shadow-lg shadow-cyber-accent/5 hover:shadow-cyber-accent/20",
            children: [
              /* @__PURE__ */ F.jsx("div", { className: "w-16 h-16 rounded-xl bg-cyber-surface/30 flex items-center justify-center group-hover:bg-cyber-accent/15 transition-colors border border-cyber-line/30 group-hover:border-cyber-accent/40", children: /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "h-8 w-8 text-cyber-muted/50 group-hover:text-cyber-accent transition-colors", children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) }) }),
              /* @__PURE__ */ F.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ F.jsx("p", { className: "text-[14px] font-bold text-cyber-text group-hover:text-cyber-accent transition-colors", children: "Add your first app" }),
                /* @__PURE__ */ F.jsx("p", { className: "text-[11px] text-cyber-muted/70 mt-1", children: "Click to add a quick launch shortcut" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ F.jsxs("p", { className: "text-[10px] text-cyber-muted/50", children: [
          "Or click the ",
          /* @__PURE__ */ F.jsx("span", { className: "text-cyber-accent font-semibold", children: "+ Add App" }),
          " button above"
        ] })
      ] })
    ) : bt === 0 ? /* @__PURE__ */ F.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 h-full text-cyber-muted", children: [
      /* @__PURE__ */ F.jsx("span", { className: "text-2xl", children: "🔍" }),
      /* @__PURE__ */ F.jsx("p", { className: "text-[12px]", children: "No apps match your search" }),
      /* @__PURE__ */ F.jsx("button", { type: "button", onClick: () => {
        ae(""), et(null);
      }, className: "text-[11px] text-cyber-accent hover:underline", children: "Clear filters" })
    ] }) : (
      /* Grouped grid */
      /* @__PURE__ */ F.jsx("div", { className: "flex flex-col gap-8", children: Et.map(([re, Y], W) => /* @__PURE__ */ F.jsxs("section", { children: [
        Et.length > 1 && /* @__PURE__ */ F.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ F.jsx("div", { className: "h-px flex-1 bg-gradient-to-r from-cyber-line/60 to-transparent" }),
          /* @__PURE__ */ F.jsxs("div", { className: "flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-surface/40 border border-cyber-line/40", children: [
            /* @__PURE__ */ F.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-cyber-muted", children: re }),
            /* @__PURE__ */ F.jsx("span", { className: "text-[10px] text-cyber-muted/60 bg-cyber-base/60 px-1.5 py-0.5 rounded-full", children: Y.length })
          ] }),
          /* @__PURE__ */ F.jsx("div", { className: "h-px flex-1 bg-gradient-to-l from-cyber-line/60 to-transparent" })
        ] }),
        /* @__PURE__ */ F.jsxs(
          "div",
          {
            className: "grid gap-3",
            style: {
              gridTemplateColumns: Ue === "sm" ? "repeat(auto-fill, minmax(4.5rem, 1fr))" : Ue === "lg" ? "repeat(auto-fill, minmax(7rem, 1fr))" : "repeat(auto-fill, minmax(5.5rem, 1fr))"
            },
            children: [
              Y.map((ce) => /* @__PURE__ */ F.jsx(
                k_,
                {
                  app: ce,
                  selected: Ge === ce.id,
                  onLaunch: ut,
                  onEdit: we,
                  onDelete: nt,
                  size: Ue
                },
                ce.id
              )),
              W === Et.length - 1 && /* @__PURE__ */ F.jsxs(
                "button",
                {
                  type: "button",
                  onClick: Ne,
                  title: "Add new quick app",
                  className: "group flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-cyber-line/30 hover:border-cyber-accent/50 hover:bg-cyber-accent/5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-accent",
                  children: [
                    /* @__PURE__ */ F.jsx("div", { className: `${Ue === "sm" ? "w-10 h-10" : Ue === "lg" ? "w-16 h-16" : "w-12 h-12"} rounded-lg bg-cyber-surface/20 flex items-center justify-center shrink-0 group-hover:bg-cyber-accent/10 transition-colors`, children: /* @__PURE__ */ F.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: `${Ue === "sm" ? "h-4 w-4" : Ue === "lg" ? "h-7 w-7" : "h-5 w-5"} text-cyber-muted/40 group-hover:text-cyber-accent transition-colors`, children: /* @__PURE__ */ F.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4.5v15m7.5-7.5h-15" }) }) }),
                    /* @__PURE__ */ F.jsx("div", { className: `${Ue === "sm" ? "text-[9px]" : Ue === "lg" ? "text-[12px]" : "text-[10px]"} text-cyber-muted/40 group-hover:text-cyber-accent transition-colors font-medium`, children: "Add" })
                  ]
                }
              )
            ]
          }
        )
      ] }, re)) })
    ) })
  ] });
}
function U_(R) {
  if (R.apiVersion !== 1 || R.moduleId !== "clx.quickapps")
    throw new Error("Quick Apps requires CLX UI host API v1");
  d_(R), R.registerContribution({
    id: "quickapps.main",
    kind: "mainPanel",
    mount(I) {
      const D = f_.createRoot(I);
      return D.render(/* @__PURE__ */ F.jsx(O_, {})), () => D.unmount();
    }
  });
}
export {
  U_ as register
};
