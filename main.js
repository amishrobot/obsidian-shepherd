var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ShepherdPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian9 = require("obsidian");

// src/ShepherdView.tsx
var import_obsidian5 = require("obsidian");

// node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var d = Array.isArray;
function w(n2, l3) {
  for (var u3 in l3)
    n2[u3] = l3[u3];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l3, u3, t3) {
  var i3, r3, o3, e3 = {};
  for (o3 in u3)
    "key" == o3 ? i3 = u3[o3] : "ref" == o3 ? r3 = u3[o3] : e3[o3] = u3[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps)
    for (o3 in l3.defaultProps)
      void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
  return m(l3, e3, i3, r3, null);
}
function m(n2, t3, i3, r3, o3) {
  var e3 = { type: n2, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
  return null == o3 && null != l.vnode && l.vnode(e3), e3;
}
function k(n2) {
  return n2.children;
}
function x(n2, l3) {
  this.props = n2, this.context = l3;
}
function S(n2, l3) {
  if (null == l3)
    return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u3; l3 < n2.__k.length; l3++)
    if (null != (u3 = n2.__k[l3]) && null != u3.__e)
      return u3.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C(n2) {
  if (n2.__P && n2.__d) {
    var u3 = n2.__v, t3 = u3.__e, i3 = [], r3 = [], o3 = w({}, u3);
    o3.__v = u3.__v + 1, l.vnode && l.vnode(o3), z(n2.__P, o3, u3, n2.__n, n2.__P.namespaceURI, 32 & u3.__u ? [t3] : null, i3, null == t3 ? S(u3) : t3, !!(32 & u3.__u), r3), o3.__v = u3.__v, o3.__.__k[o3.__i] = o3, V(i3, o3, r3), u3.__e = u3.__ = null, o3.__e != t3 && M(o3);
  }
}
function M(n2) {
  if (null != (n2 = n2.__) && null != n2.__c)
    return n2.__e = n2.__c.base = null, n2.__k.some(function(l3) {
      if (null != l3 && null != l3.__e)
        return n2.__e = n2.__c.base = l3.__e;
    }), M(n2);
}
function $(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !I.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(I);
}
function I() {
  try {
    for (var n2, l3 = 1; i.length; )
      i.length > l3 && i.sort(e), n2 = i.shift(), l3 = i.length, C(n2);
  } finally {
    i.length = I.__r = 0;
  }
}
function P(n2, l3, u3, t3, i3, r3, o3, e3, f3, c3, s3) {
  var a3, h3, y3, d3, w3, g2, _2, m3 = t3 && t3.__k || v, b = l3.length;
  for (f3 = A(u3, l3, m3, f3, b), a3 = 0; a3 < b; a3++)
    null != (y3 = u3.__k[a3]) && (h3 = -1 != y3.__i && m3[y3.__i] || p, y3.__i = a3, g2 = z(n2, y3, h3, i3, r3, o3, e3, f3, c3, s3), d3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && D(h3.ref, null, y3), s3.push(y3.ref, y3.__c || d3, y3)), null == w3 && null != d3 && (w3 = d3), (_2 = !!(4 & y3.__u)) || h3.__k === y3.__k ? f3 = H(y3, f3, n2, _2) : "function" == typeof y3.type && void 0 !== g2 ? f3 = g2 : d3 && (f3 = d3.nextSibling), y3.__u &= -7);
  return u3.__e = w3, f3;
}
function A(n2, l3, u3, t3, i3) {
  var r3, o3, e3, f3, c3, s3 = u3.length, a3 = s3, h3 = 0;
  for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++)
    null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? ("string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? o3 = n2.__k[r3] = m(null, o3, null, null, null) : d(o3) ? o3 = n2.__k[r3] = m(k, { children: o3 }, null, null, null) : void 0 === o3.constructor && o3.__b > 0 ? o3 = n2.__k[r3] = m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : n2.__k[r3] = o3, f3 = r3 + h3, o3.__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = T(o3, u3, f3, a3)) && (a3--, (e3 = u3[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > s3 ? h3-- : i3 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f3 && (c3 == f3 - 1 ? h3-- : c3 == f3 + 1 ? h3++ : (c3 > f3 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (a3)
    for (r3 = 0; r3 < s3; r3++)
      null != (e3 = u3[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), E(e3, e3));
  return t3;
}
function H(n2, l3, u3, t3) {
  var i3, r3;
  if ("function" == typeof n2.type) {
    for (i3 = n2.__k, r3 = 0; i3 && r3 < i3.length; r3++)
      i3[r3] && (i3[r3].__ = n2, l3 = H(i3[r3], l3, u3, t3));
    return l3;
  }
  n2.__e != l3 && (t3 && (l3 && n2.type && !l3.parentNode && (l3 = S(n2)), u3.insertBefore(n2.__e, l3 || null)), l3 = n2.__e);
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function T(n2, l3, u3, t3) {
  var i3, r3, o3, e3 = n2.key, f3 = n2.type, c3 = l3[u3], s3 = null != c3 && 0 == (2 & c3.__u);
  if (null === c3 && null == e3 || s3 && e3 == c3.key && f3 == c3.type)
    return u3;
  if (t3 > (s3 ? 1 : 0)) {
    for (i3 = u3 - 1, r3 = u3 + 1; i3 >= 0 || r3 < l3.length; )
      if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f3 == c3.type)
        return o3;
  }
  return -1;
}
function j(n2, l3, u3) {
  "-" == l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || y.test(l3) ? u3 : u3 + "px";
}
function F(n2, l3, u3, t3, i3) {
  var r3, o3;
  n:
    if ("style" == l3)
      if ("string" == typeof u3)
        n2.style.cssText = u3;
      else {
        if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3)
          for (l3 in t3)
            u3 && l3 in u3 || j(n2.style, l3, "");
        if (u3)
          for (l3 in u3)
            t3 && u3[l3] == t3[l3] || j(n2.style, l3, u3[l3]);
      }
    else if ("o" == l3[0] && "n" == l3[1])
      r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u3, u3 ? t3 ? u3.u = t3.u : (u3.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
    else {
      if ("http://www.w3.org/2000/svg" == i3)
        l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2)
        try {
          n2[l3] = null == u3 ? "" : u3;
          break n;
        } catch (n3) {
        }
      "function" == typeof u3 || (null == u3 || false === u3 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u3 ? "" : u3));
    }
}
function O(n2) {
  return function(u3) {
    if (this.l) {
      var t3 = this.l[u3.type + n2];
      if (null == u3.t)
        u3.t = c++;
      else if (u3.t < t3.u)
        return;
      return t3(l.event ? l.event(u3) : u3);
    }
  };
}
function z(n2, u3, t3, i3, r3, o3, e3, f3, c3, s3) {
  var a3, h3, p3, y3, _2, m3, b, S2, C3, M2, $2, I2, A3, H2, L, T3 = u3.type;
  if (void 0 !== u3.constructor)
    return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f3 = u3.__e = t3.__e]), (a3 = l.__b) && a3(u3);
  n:
    if ("function" == typeof T3)
      try {
        if (S2 = u3.props, C3 = T3.prototype && T3.prototype.render, M2 = (a3 = T3.contextType) && i3[a3.__c], $2 = a3 ? M2 ? M2.props.value : a3.__ : i3, t3.__c ? b = (h3 = u3.__c = t3.__c).__ = h3.__E : (C3 ? u3.__c = h3 = new T3(S2, $2) : (u3.__c = h3 = new x(S2, $2), h3.constructor = T3, h3.render = G), M2 && M2.sub(h3), h3.state || (h3.state = {}), h3.__n = i3, p3 = h3.__d = true, h3.__h = [], h3._sb = []), C3 && null == h3.__s && (h3.__s = h3.state), C3 && null != T3.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = w({}, h3.__s)), w(h3.__s, T3.getDerivedStateFromProps(S2, h3.__s))), y3 = h3.props, _2 = h3.state, h3.__v = u3, p3)
          C3 && null == T3.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), C3 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
        else {
          if (C3 && null == T3.getDerivedStateFromProps && S2 !== y3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(S2, $2), u3.__v == t3.__v || !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(S2, h3.__s, $2)) {
            u3.__v != t3.__v && (h3.props = S2, h3.state = h3.__s, h3.__d = false), u3.__e = t3.__e, u3.__k = t3.__k, u3.__k.some(function(n3) {
              n3 && (n3.__ = u3);
            }), v.push.apply(h3.__h, h3._sb), h3._sb = [], h3.__h.length && e3.push(h3);
            break n;
          }
          null != h3.componentWillUpdate && h3.componentWillUpdate(S2, h3.__s, $2), C3 && null != h3.componentDidUpdate && h3.__h.push(function() {
            h3.componentDidUpdate(y3, _2, m3);
          });
        }
        if (h3.context = $2, h3.props = S2, h3.__P = n2, h3.__e = false, I2 = l.__r, A3 = 0, C3)
          h3.state = h3.__s, h3.__d = false, I2 && I2(u3), a3 = h3.render(h3.props, h3.state, h3.context), v.push.apply(h3.__h, h3._sb), h3._sb = [];
        else
          do {
            h3.__d = false, I2 && I2(u3), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
          } while (h3.__d && ++A3 < 25);
        h3.state = h3.__s, null != h3.getChildContext && (i3 = w(w({}, i3), h3.getChildContext())), C3 && !p3 && null != h3.getSnapshotBeforeUpdate && (m3 = h3.getSnapshotBeforeUpdate(y3, _2)), H2 = null != a3 && a3.type === k && null == a3.key ? q(a3.props.children) : a3, f3 = P(n2, d(H2) ? H2 : [H2], u3, t3, i3, r3, o3, e3, f3, c3, s3), h3.base = u3.__e, u3.__u &= -161, h3.__h.length && e3.push(h3), b && (h3.__E = h3.__ = null);
      } catch (n3) {
        if (u3.__v = null, c3 || null != o3)
          if (n3.then) {
            for (u3.__u |= c3 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; )
              f3 = f3.nextSibling;
            o3[o3.indexOf(f3)] = null, u3.__e = f3;
          } else {
            for (L = o3.length; L--; )
              g(o3[L]);
            N(u3);
          }
        else
          u3.__e = t3.__e, u3.__k = t3.__k, n3.then || N(u3);
        l.__e(n3, u3, t3);
      }
    else
      null == o3 && u3.__v == t3.__v ? (u3.__k = t3.__k, u3.__e = t3.__e) : f3 = u3.__e = B(t3.__e, u3, t3, i3, r3, o3, e3, c3, s3);
  return (a3 = l.diffed) && a3(u3), 128 & u3.__u ? void 0 : f3;
}
function N(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(N));
}
function V(n2, u3, t3) {
  for (var i3 = 0; i3 < t3.length; i3++)
    D(t3[i3], t3[++i3], t3[++i3]);
  l.__c && l.__c(u3, n2), n2.some(function(u4) {
    try {
      n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
        n3.call(u4);
      });
    } catch (n3) {
      l.__e(n3, u4.__v);
    }
  });
}
function q(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : d(n2) ? n2.map(q) : w({}, n2);
}
function B(u3, t3, i3, r3, o3, e3, f3, c3, s3) {
  var a3, h3, v3, y3, w3, _2, m3, b = i3.props || p, k3 = t3.props, x2 = t3.type;
  if ("svg" == x2 ? o3 = "http://www.w3.org/2000/svg" : "math" == x2 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (a3 = 0; a3 < e3.length; a3++)
      if ((w3 = e3[a3]) && "setAttribute" in w3 == !!x2 && (x2 ? w3.localName == x2 : 3 == w3.nodeType)) {
        u3 = w3, e3[a3] = null;
        break;
      }
  }
  if (null == u3) {
    if (null == x2)
      return document.createTextNode(k3);
    u3 = document.createElementNS(o3, x2, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x2)
    b === k3 || c3 && u3.data == k3 || (u3.data = k3);
  else {
    if (e3 = e3 && n.call(u3.childNodes), !c3 && null != e3)
      for (b = {}, a3 = 0; a3 < u3.attributes.length; a3++)
        b[(w3 = u3.attributes[a3]).name] = w3.value;
    for (a3 in b)
      w3 = b[a3], "dangerouslySetInnerHTML" == a3 ? v3 = w3 : "children" == a3 || a3 in k3 || "value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3 || F(u3, a3, null, w3, o3);
    for (a3 in k3)
      w3 = k3[a3], "children" == a3 ? y3 = w3 : "dangerouslySetInnerHTML" == a3 ? h3 = w3 : "value" == a3 ? _2 = w3 : "checked" == a3 ? m3 = w3 : c3 && "function" != typeof w3 || b[a3] === w3 || F(u3, a3, w3, b[a3], o3);
    if (h3)
      c3 || v3 && (h3.__html == v3.__html || h3.__html == u3.innerHTML) || (u3.innerHTML = h3.__html), t3.__k = [];
    else if (v3 && (u3.innerHTML = ""), P("template" == t3.type ? u3.content : u3, d(y3) ? y3 : [y3], t3, i3, r3, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o3, e3, f3, e3 ? e3[0] : i3.__k && S(i3, 0), c3, s3), null != e3)
      for (a3 = e3.length; a3--; )
        g(e3[a3]);
    c3 || (a3 = "value", "progress" == x2 && null == _2 ? u3.removeAttribute("value") : null != _2 && (_2 !== u3[a3] || "progress" == x2 && !_2 || "option" == x2 && _2 != b[a3]) && F(u3, a3, _2, b[a3], o3), a3 = "checked", null != m3 && m3 != u3[a3] && F(u3, a3, m3, b[a3], o3));
  }
  return u3;
}
function D(n2, u3, t3) {
  try {
    if ("function" == typeof n2) {
      var i3 = "function" == typeof n2.__u;
      i3 && n2.__u(), i3 && null == u3 || (n2.__u = n2(u3));
    } else
      n2.current = u3;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function E(n2, u3, t3) {
  var i3, r3;
  if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || D(i3, null, u3)), null != (i3 = n2.__c)) {
    if (i3.componentWillUnmount)
      try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u3);
      }
    i3.base = i3.__P = null;
  }
  if (i3 = n2.__k)
    for (r3 = 0; r3 < i3.length; r3++)
      i3[r3] && E(i3[r3], u3, t3 || "function" != typeof n2.type);
  t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function G(n2, l3, u3) {
  return this.constructor(n2, u3);
}
function J(u3, t3, i3) {
  var r3, o3, e3, f3;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u3, t3), o3 = (r3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, e3 = [], f3 = [], z(t3, u3 = (!r3 && i3 || t3).__k = _(k, null, [u3]), o3 || p, p, t3.namespaceURI, !r3 && i3 ? [i3] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i3 ? i3 : o3 ? o3.__e : t3.firstChild, r3, f3), V(e3, u3, f3);
}
n = v.slice, l = { __e: function(n2, l3, u3, t3) {
  for (var i3, r3, o3; l3 = l3.__; )
    if ((i3 = l3.__c) && !i3.__)
      try {
        if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), o3 = i3.__d), o3)
          return i3.__E = i3;
      } catch (l4) {
        n2 = l4;
      }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, x.prototype.setState = function(n2, l3) {
  var u3;
  u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = w({}, this.state), "function" == typeof n2 && (n2 = n2(w({}, u3), this.props)), n2 && w(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), $(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), $(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, I.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = O(false), a = O(true), h = 0;

// node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u3 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u3.__.length && u3.__.push({}), u3.__[n2];
}
function d2(n2) {
  return o2 = 1, h2(D2, n2);
}
function h2(n2, u3, i3) {
  var o3 = p2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u3) : D2(void 0, u3), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.__f)) {
    var f3 = function(n3, t3, r3) {
      if (!o3.__c.__H)
        return true;
      var u4 = o3.__c.__H.__.filter(function(n4) {
        return n4.__c;
      });
      if (u4.every(function(n4) {
        return !n4.__N;
      }))
        return !c3 || c3.call(this, n3, t3, r3);
      var i4 = o3.__c.props !== n3;
      return u4.some(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
        }
      }), c3 && c3.call(this, n3, t3, r3) || i4;
    };
    r2.__f = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u4 = c3;
        c3 = void 0, f3(n3, t3, r3), c3 = u4;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f3;
  }
  return o3.__N || o3.__;
}
function y2(n2, u3) {
  var i3 = p2(t2++, 3);
  !c2.__s && C2(i3.__H, u3) && (i3.__ = n2, i3.u = u3, r2.__H.__h.push(i3));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function T2(n2, r3) {
  var u3 = p2(t2++, 7);
  return C2(u3.__H, r3) && (u3.__ = n2(), u3.__H = r3, u3.__h = n2), u3.__;
}
function j2() {
  for (var n2; n2 = f2.shift(); ) {
    var t3 = n2.__H;
    if (n2.__P && t3)
      try {
        t3.__h.some(z2), t3.__h.some(B2), t3.__h = [];
      } catch (r3) {
        t3.__h = [], c2.__e(r3, n2.__v);
      }
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i3 = (r2 = n2.__c).__H;
  i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.some(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i3.__h.some(z2), i3.__h.some(B2), i3.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.some(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.some(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.some(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u3), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u3 = setTimeout(r3, 35);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u3 = n2.__c;
  "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// src/components/MemberPanel.tsx
var import_obsidian = require("obsidian");

// src/services/helpers.ts
function buildMapsUrl(address, isAppleDevice) {
  if (!address)
    return "";
  const encoded = encodeURIComponent(address);
  if (isAppleDevice) {
    return `maps://?q=${encoded}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}
function parseMinistering(raw) {
  const ministeredBy = [];
  const ministersTo = [];
  if (!raw.trim())
    return { ministeredBy, ministersTo };
  const segments = raw.split("|").map((s3) => s3.trim()).filter(Boolean);
  for (const segment of segments) {
    const match = segment.match(/^(Ministered by|Ministers to)\s*:\s*(.*)$/i);
    if (!match)
      continue;
    const target = match[1].toLowerCase() === "ministered by" ? ministeredBy : ministersTo;
    const names = match[2].split(",").map((n2) => n2.trim()).filter(Boolean);
    for (const name of names) {
      if (!target.includes(name))
        target.push(name);
    }
  }
  return { ministeredBy, ministersTo };
}
function normalizeAddress(address) {
  if (!address.trim())
    return "";
  return address.toLowerCase().replace(/[.,#]/g, " ").replace(/(\d{5})-\d{4}\b/, "$1").replace(/\s+/g, " ").trim();
}
var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function monthYear(iso) {
  const m3 = /^(\d{4})-(\d{2})/.exec(iso || "");
  if (!m3)
    return "";
  const mi = parseInt(m3[2], 10) - 1;
  return mi >= 0 && mi < 12 ? `${MONTHS_SHORT[mi]} ${m3[1]}` : "";
}
function callingNames(raw) {
  return (raw || "").split("/").map((c3) => c3.replace(/\s*\([^)]*\)\s*$/, "").trim()).filter(Boolean).join(" \xB7 ");
}

// src/services/wardSheet.ts
var WARD_SHEET_PATH = "Church/_system/cache/ward-sheet.json";
var SHEET_MEMBER_DIR = "Church/Members";
function isObject(v3) {
  return typeof v3 === "object" && v3 !== null && !Array.isArray(v3);
}
function str(v3) {
  return typeof v3 === "string" ? v3.trim() : "";
}
function events(v3) {
  if (!Array.isArray(v3))
    return [];
  const out = [];
  for (const e3 of v3) {
    if (!isObject(e3))
      continue;
    const date = str(e3.date);
    if (!date)
      continue;
    out.push({ date, kind: str(e3.kind), topic: str(e3.topic) });
  }
  return out;
}
function welcomeForm(v3) {
  if (!isObject(v3))
    return null;
  const f3 = {
    submitted: str(v3.submitted),
    situation: str(v3.situation),
    acceptCalling: str(v3.accept_calling),
    teach: str(v3.teach),
    music: str(v3.music),
    pastCallings: str(v3.past_callings),
    hobbies: str(v3.hobbies),
    forBishopric: str(v3.for_bishopric)
  };
  return Object.values(f3).some(Boolean) ? f3 : null;
}
function memberSheet(v3) {
  if (!isObject(v3))
    return null;
  const created = v3.note_created_ms;
  return {
    noteCreated: typeof created === "number" && Number.isFinite(created) && created > 0 ? created : null,
    lastTalk: str(v3.last_talk),
    lastPrayer: str(v3.last_prayer),
    talks: events(v3.talks),
    prayers: events(v3.prayers),
    upcoming: events(v3.upcoming),
    welcomeForm: welcomeForm(v3.welcome_form)
  };
}
function parseWardSheet(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch (e3) {
    return null;
  }
  if (!isObject(raw) || raw.schema !== 2 || !isObject(raw.members))
    return null;
  const members = {};
  for (const [name, v3] of Object.entries(raw.members)) {
    const m3 = memberSheet(v3);
    if (m3)
      members[name] = m3;
  }
  return { generated: str(raw.generated), members };
}
function sheetKeyForPath(path) {
  const prefix = SHEET_MEMBER_DIR + "/";
  if (!path.startsWith(prefix) || !path.endsWith(".md"))
    return null;
  const key = path.slice(prefix.length, -".md".length);
  if (!key || key.includes("/") || key.startsWith("_"))
    return null;
  return key;
}
var NOTE_IDENTITY_TOLERANCE_MS = 5;
function sheetFor(sheet, path, noteCreated) {
  if (!sheet)
    return null;
  const key = sheetKeyForPath(path);
  if (key === null)
    return null;
  if (!Object.prototype.hasOwnProperty.call(sheet.members, key))
    return null;
  const entry = sheet.members[key];
  if (entry.noteCreated === null || !Number.isFinite(noteCreated))
    return null;
  return Math.abs(entry.noteCreated - noteCreated) < NOTE_IDENTITY_TOLERANCE_MS ? entry : null;
}
function sheetIsEmpty(s3) {
  return !s3.lastTalk && !s3.lastPrayer && !s3.talks.length && !s3.prayers.length && !s3.upcoming.length && !s3.welcomeForm;
}
function kindLabel(kind, fallback) {
  const k3 = kind || fallback;
  return k3.charAt(0).toUpperCase() + k3.slice(1);
}

// src/components/MemberPanel.tsx
var TABS = [
  { id: "facts", label: "Facts", key: "1" },
  { id: "private", label: "Private", key: "2" },
  { id: "ward", label: "Ward", key: "3" }
];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDate(iso, withYear = true) {
  var _a;
  const m3 = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(iso || "");
  if (!m3)
    return iso || "";
  const mon = (_a = MONTHS[parseInt(m3[2], 10) - 1]) != null ? _a : "";
  if (!m3[3])
    return `${mon} ${m3[1]}`;
  const day = parseInt(m3[3], 10);
  return withYear ? `${mon} ${day}, ${m3[1]}` : `${mon} ${day}`;
}
function daysAgo(iso) {
  const m3 = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!m3)
    return null;
  const then = new Date(+m3[1], +m3[2] - 1, +m3[3]).getTime();
  const now = /* @__PURE__ */ new Date();
  const today2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((today2 - then) / 864e5);
}
function lastTalkedLabel(iso) {
  const d3 = daysAgo(iso);
  if (d3 === null)
    return "Never";
  if (d3 <= 0)
    return "Today";
  if (d3 === 1)
    return "Yesterday";
  if (d3 < 60)
    return `${d3} days ago`;
  const mo = Math.round(d3 / 30);
  if (mo < 18)
    return `${mo} months ago`;
  return `${Math.round(d3 / 365)} years ago`;
}
function callingList(raw) {
  return (raw || "").split("/").map((c3) => c3.replace(/\s*\([^)]*\)\s*$/, "").trim()).filter(Boolean);
}
function money(n2) {
  return "$" + n2.toLocaleString("en-US", { minimumFractionDigits: n2 % 1 ? 2 : 0, maximumFractionDigits: 2 });
}
function Icon({ name, class: cls = "" }) {
  const ref = A2(null);
  y2(() => {
    if (ref.current) {
      ref.current.empty();
      (0, import_obsidian.setIcon)(ref.current, name);
    }
  }, [name]);
  return /* @__PURE__ */ _("span", { ref, class: `sh2-icon ${cls}`, "aria-hidden": "true" });
}
function Markdown({ app, component, text, path }) {
  const ref = A2(null);
  y2(() => {
    const el = ref.current;
    if (!el)
      return;
    el.empty();
    void import_obsidian.MarkdownRenderer.render(app, text, el, path, component);
  }, [text, path]);
  return /* @__PURE__ */ _("div", { ref, class: "sh2-prose" });
}
function IconButton({ icon, label, hint, href, onClick }) {
  const title = hint ? `${label} \xB7 ${hint}` : label;
  if (href) {
    return /* @__PURE__ */ _("a", { class: "sh2-iconbtn", href, "aria-label": label, title }, /* @__PURE__ */ _(Icon, { name: icon }));
  }
  return /* @__PURE__ */ _(
    "button",
    {
      type: "button",
      class: "sh2-iconbtn",
      "aria-label": label,
      title,
      onClick: (e3) => onClick == null ? void 0 : onClick(e3)
    },
    /* @__PURE__ */ _(Icon, { name: icon })
  );
}
function Header({ m: m3, photoUrl, act }) {
  const callings = callingList(m3.calling);
  const digits = (m3.phone || "").replace(/\D/g, "");
  const maps = m3.address ? buildMapsUrl(m3.address, import_obsidian.Platform.isMacOS || import_obsidian.Platform.isIosApp) : "";
  const meta = [];
  if (m3.age != null)
    meta.push(String(m3.age));
  if (m3.priesthood && m3.priesthood !== "none")
    meta.push(m3.priesthood.replace(/-/g, " ").replace(/^./, (c3) => c3.toUpperCase()));
  if (m3.movedIn)
    meta.push(`in ward since ${shortDate(m3.movedIn.slice(0, 7))}`);
  const days = daysAgo(m3.lastTalked);
  const tone = days === null ? "is-never" : days > 60 ? "is-stale" : "";
  const initials = m3.name.split(/\s+/).map((w3) => w3[0]).slice(0, 2).join("");
  return /* @__PURE__ */ _("header", { class: "sh2-head" }, /* @__PURE__ */ _("div", { class: "sh2-id" }, photoUrl ? /* @__PURE__ */ _("img", { class: "sh2-avatar", src: photoUrl, alt: "" }) : /* @__PURE__ */ _("div", { class: "sh2-avatar is-empty" }, initials), /* @__PURE__ */ _("div", { class: "sh2-id-text" }, /* @__PURE__ */ _("div", { class: "sh2-name" }, m3.name), /* @__PURE__ */ _("div", { class: `sh2-calling ${callings.length ? "" : "is-none"}` }, callings.length ? callings.join(" \xB7 ") : "No calling"), meta.length > 0 && /* @__PURE__ */ _("div", { class: "sh2-meta" }, meta.join(" \xB7 ")))), /* @__PURE__ */ _("div", { class: "sh2-last" }, /* @__PURE__ */ _("span", { class: "sh2-label" }, "Last talked"), /* @__PURE__ */ _("span", { class: `sh2-last-value ${tone}` }, lastTalkedLabel(m3.lastTalked)), m3.met === false && /* @__PURE__ */ _("span", { class: "sh2-chip" }, "Haven\u2019t met"), m3.met === null && /* @__PURE__ */ _("span", { class: "sh2-chip is-quiet" }, "Met? not sorted")), /* @__PURE__ */ _("div", { class: "sh2-actions" }, digits && /* @__PURE__ */ _(IconButton, { icon: "phone", label: "Call", hint: "C", href: `tel:${digits}` }), digits && /* @__PURE__ */ _(IconButton, { icon: "message-circle", label: "Text", hint: "T", href: `sms:${digits}` }), m3.email && /* @__PURE__ */ _(IconButton, { icon: "mail", label: "Email", hint: "E", href: `mailto:${m3.email}` }), maps && /* @__PURE__ */ _(IconButton, { icon: "map-pin", label: m3.address, href: maps }), /* @__PURE__ */ _("button", { type: "button", class: "sh2-btn mod-cta", title: "Log a conversation \xB7 L", onClick: act.log }, /* @__PURE__ */ _(Icon, { name: "pencil" }), " Log"), /* @__PURE__ */ _(IconButton, { icon: "more-horizontal", label: "Status, recommend, check-in", onClick: act.more })));
}
function Threads({ tasks, act }) {
  const [draft, setDraft] = d2("");
  const open = tasks.filter((t3) => !t3.completed);
  const done = tasks.filter((t3) => t3.completed);
  const [showDone, setShowDone] = d2(false);
  const shown = showDone ? [...open, ...done] : open;
  const submit = () => {
    if (draft.trim())
      act.addTask(draft.trim());
    setDraft("");
  };
  return /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Open threads"), open.length > 0 && /* @__PURE__ */ _("span", { class: "sh2-count" }, open.length), done.length > 0 && /* @__PURE__ */ _("button", { type: "button", class: "sh2-link", onClick: () => setShowDone(!showDone) }, showDone ? "Hide done" : `${done.length} done`)), /* @__PURE__ */ _("div", { class: "sh2-group" }, shown.map((t3) => {
    const d3 = t3.due ? daysAgo(t3.due) : null;
    return /* @__PURE__ */ _("label", { class: `sh2-row sh2-task ${t3.completed ? "is-done" : ""}` }, /* @__PURE__ */ _(
      "input",
      {
        type: "checkbox",
        class: "task-list-item-checkbox",
        checked: t3.completed,
        onChange: () => act.toggleTask(t3.line)
      }
    ), /* @__PURE__ */ _("span", { class: "sh2-task-text" }, t3.text), t3.due && /* @__PURE__ */ _("span", { class: `sh2-due ${d3 !== null && d3 > 0 && !t3.completed ? "is-late" : ""}` }, shortDate(t3.due, false)));
  }), /* @__PURE__ */ _("div", { class: "sh2-row sh2-add-row" }, /* @__PURE__ */ _(Icon, { name: "plus", class: "sh2-muted" }), /* @__PURE__ */ _(
    "input",
    {
      type: "text",
      class: "sh2-input",
      placeholder: "Add a thread",
      value: draft,
      onInput: (e3) => setDraft(e3.target.value),
      onKeyDown: (e3) => {
        if (e3.key === "Enter") {
          e3.preventDefault();
          submit();
        }
      }
    }
  ))));
}
function Segmented({ tab, onTab }) {
  return /* @__PURE__ */ _("div", { class: "sh2-segmented", role: "tablist" }, TABS.map((t3) => /* @__PURE__ */ _(
    "button",
    {
      type: "button",
      role: "tab",
      "aria-selected": tab === t3.id,
      class: `sh2-seg ${tab === t3.id ? "is-active" : ""} ${t3.id === "private" ? "is-private" : ""}`,
      onClick: () => onTab(t3.id)
    },
    t3.id === "private" && /* @__PURE__ */ _(Icon, { name: "lock" }),
    t3.label,
    /* @__PURE__ */ _("kbd", { class: "sh2-kbd" }, t3.key)
  )));
}
function Labeled({ label, date, children, onClick }) {
  return /* @__PURE__ */ _("div", { class: `sh2-row sh2-fact ${onClick ? "is-clickable" : ""}`, onClick }, /* @__PURE__ */ _("div", { class: "sh2-fact-body" }, /* @__PURE__ */ _("div", { class: "sh2-label" }, label), /* @__PURE__ */ _("div", { class: "sh2-value" }, children)), date && /* @__PURE__ */ _("span", { class: "sh2-date" }, shortDate(date)));
}
function FactsTab({ m: m3, act }) {
  const facts = m3.facts.slice();
  const has = (l3) => facts.some((f3) => f3.label.toLowerCase() === l3.toLowerCase());
  const restricted = m3.private.membership.some((r3) => !r3.lifted);
  if (!has("Temple") && !restricted && (m3.endowed || m3.recommend !== "unknown")) {
    const bits = [];
    if (m3.endowed)
      bits.push("Endowed");
    if (m3.recommend === "current" || m3.recommend === "expiring")
      bits.push(`recommend good until ${shortDate(m3.recommendExp.slice(0, 7)) || "\u2014"}`);
    if (m3.recommend === "expired")
      bits.push(`recommend expired ${shortDate(m3.recommendExp.slice(0, 7))}`.trim());
    if (m3.recommend === "none")
      bits.push("no recommend");
    if (bits.length)
      facts.push({ label: "Temple", value: bits.join(", ").replace(/^./, (c3) => c3.toUpperCase()), date: "" });
  }
  if (!has("Mission") && m3.mission)
    facts.push({ label: "Mission", value: m3.mission, date: "" });
  return /* @__PURE__ */ _("div", { class: "sh2-tab" }, facts.length === 0 ? /* @__PURE__ */ _("div", { class: "sh2-empty" }, "Nothing written yet. Facts are what\u2019s true now: work, school, family, where they live.") : /* @__PURE__ */ _("div", { class: "sh2-group" }, facts.map((f3) => /* @__PURE__ */ _(
    Labeled,
    {
      label: f3.label,
      date: f3.date,
      onClick: m3.facts.includes(f3) ? () => act.addFact(f3.label) : void 0
    },
    f3.value
  ))), /* @__PURE__ */ _("button", { type: "button", class: "sh2-add", onClick: () => act.addFact() }, /* @__PURE__ */ _(Icon, { name: "plus" }), " Add fact"));
}
function RestrictionRow({ r: r3, i: i3, act }) {
  const when = r3.lifted ? `${shortDate(r3.since)} \u2013 lifted ${shortDate(r3.lifted)}` : r3.since ? `Since ${shortDate(r3.since)}` : "";
  return /* @__PURE__ */ _("div", { class: `sh2-row sh2-restriction ${r3.lifted ? "is-lifted" : ""}` }, /* @__PURE__ */ _("div", { class: "sh2-fact-body" }, /* @__PURE__ */ _("div", { class: "sh2-value" }, r3.text), when && /* @__PURE__ */ _("div", { class: "sh2-sub" }, when)), !r3.lifted && /* @__PURE__ */ _("button", { type: "button", class: "sh2-link", onClick: (e3) => act.liftRestriction(i3, e3) }, "Lift"));
}
function HelpRows({ help }) {
  const total = help.reduce((s3, x2) => {
    var _a;
    return s3 + ((_a = x2.amount) != null ? _a : 0);
  }, 0);
  return /* @__PURE__ */ _(k, null, help.map((x2) => /* @__PURE__ */ _("div", { class: "sh2-row sh2-help" }, /* @__PURE__ */ _("div", { class: "sh2-fact-body" }, /* @__PURE__ */ _("div", { class: "sh2-value" }, x2.purpose || "\u2014"), x2.date && /* @__PURE__ */ _("div", { class: "sh2-sub" }, shortDate(x2.date))), /* @__PURE__ */ _("span", { class: "sh2-amount" }, x2.amount != null ? money(x2.amount) : ""))), help.some((x2) => x2.amount != null) && /* @__PURE__ */ _("div", { class: "sh2-row sh2-total" }, /* @__PURE__ */ _("span", null, "Total"), /* @__PURE__ */ _("span", { class: "sh2-amount" }, money(total))));
}
function PrivateTab({ app, component, m: m3, act }) {
  const p3 = m3.private;
  const prose = (title, text) => /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, title), /* @__PURE__ */ _("button", { type: "button", class: "sh2-link", onClick: () => act.editPrivate(title) }, text ? "Edit" : "Write")), /* @__PURE__ */ _("div", { class: "sh2-group" }, text ? /* @__PURE__ */ _("div", { class: "sh2-row" }, /* @__PURE__ */ _(Markdown, { app, component, text, path: m3.file.path })) : /* @__PURE__ */ _("div", { class: "sh2-row sh2-muted" }, "Nothing written")));
  return /* @__PURE__ */ _("div", { class: "sh2-tab sh2-private" }, prose("Repentance & recovery", p3.recovery), /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Membership"), /* @__PURE__ */ _("button", { type: "button", class: "sh2-link", onClick: act.addRestriction }, "+ Add")), /* @__PURE__ */ _("div", { class: "sh2-group" }, p3.membership.length ? p3.membership.map((r3, i3) => /* @__PURE__ */ _(RestrictionRow, { r: r3, i: i3, act })) : /* @__PURE__ */ _("div", { class: "sh2-row sh2-muted" }, "No restrictions"))), /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Help given"), /* @__PURE__ */ _("button", { type: "button", class: "sh2-link", onClick: act.addHelp }, "+ Add")), /* @__PURE__ */ _("div", { class: "sh2-group" }, p3.help.length ? /* @__PURE__ */ _(HelpRows, { help: p3.help }) : /* @__PURE__ */ _("div", { class: "sh2-row sh2-muted" }, "None recorded"))), prose("Mental health", p3.mentalHealth));
}
function People({ label, people, act }) {
  if (!people.length)
    return null;
  return /* @__PURE__ */ _(Labeled, { label }, people.map((x2, i3) => /* @__PURE__ */ _("span", null, x2.file ? /* @__PURE__ */ _("a", { class: "sh2-person", onClick: () => act.open(x2.file) }, x2.name) : x2.name, i3 < people.length - 1 ? ", " : "")));
}
function EventRows({ events: events2, fallback }) {
  return /* @__PURE__ */ _(k, null, events2.map((e3) => /* @__PURE__ */ _("div", { class: "sh2-row sh2-fact" }, /* @__PURE__ */ _("div", { class: "sh2-fact-body" }, /* @__PURE__ */ _("div", { class: "sh2-value" }, e3.topic || kindLabel(e3.kind, fallback)), e3.topic && /* @__PURE__ */ _("div", { class: "sh2-sub" }, kindLabel(e3.kind, fallback))), /* @__PURE__ */ _("span", { class: "sh2-date" }, shortDate(e3.date)))));
}
function Folded({ label, text }) {
  const [open, setOpen] = d2(false);
  return /* @__PURE__ */ _("div", { class: "sh2-row sh2-fact sh2-folded" }, /* @__PURE__ */ _("div", { class: "sh2-fact-body" }, /* @__PURE__ */ _("div", { class: "sh2-label" }, /* @__PURE__ */ _(Icon, { name: "lock", class: "sh2-fold-lock" }), " ", label), open && /* @__PURE__ */ _("div", { class: "sh2-value" }, text)), /* @__PURE__ */ _("button", { type: "button", class: "sh2-link", "aria-expanded": open, onClick: () => setOpen(!open) }, open ? "Hide" : "Show"));
}
var PRAYERS_SHOWN = 3;
function SheetSections({ sheet }) {
  var _a, _b;
  const [allPrayers, setAllPrayers] = d2(false);
  if (!sheet)
    return /* @__PURE__ */ _("div", { class: "sh2-footnote" }, "Not in the ward sheet.");
  if (sheetIsEmpty(sheet))
    return /* @__PURE__ */ _("div", { class: "sh2-footnote" }, "No talks, prayers or welcome form in the ward sheet.");
  const f3 = sheet.welcomeForm;
  const lastTalk = sheet.lastTalk || ((_a = sheet.talks[0]) == null ? void 0 : _a.date) || "";
  const lastPrayer = sheet.lastPrayer || ((_b = sheet.prayers[0]) == null ? void 0 : _b.date) || "";
  const prayers = allPrayers ? sheet.prayers : sheet.prayers.slice(0, PRAYERS_SHOWN);
  const never = /* @__PURE__ */ _("span", { class: "sh2-muted" }, "Not on record");
  return /* @__PURE__ */ _(k, null, /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Sacrament meeting")), /* @__PURE__ */ _("div", { class: "sh2-group" }, /* @__PURE__ */ _(Labeled, { label: "Last talk", date: lastTalk }, lastTalk ? lastTalkedLabel(lastTalk) : never), /* @__PURE__ */ _(Labeled, { label: "Last prayer", date: lastPrayer }, lastPrayer ? lastTalkedLabel(lastPrayer) : never))), sheet.upcoming.length > 0 && /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Coming up")), /* @__PURE__ */ _("div", { class: "sh2-group" }, /* @__PURE__ */ _(EventRows, { events: sheet.upcoming, fallback: "Assignment" }))), sheet.talks.length > 0 && /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Talks"), /* @__PURE__ */ _("span", { class: "sh2-tally" }, sheet.talks.length)), /* @__PURE__ */ _("div", { class: "sh2-group" }, /* @__PURE__ */ _(EventRows, { events: sheet.talks, fallback: "Talk" }))), sheet.prayers.length > 0 && /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Prayers"), /* @__PURE__ */ _("span", { class: "sh2-tally" }, sheet.prayers.length), sheet.prayers.length > PRAYERS_SHOWN && /* @__PURE__ */ _("button", { type: "button", class: "sh2-link", onClick: () => setAllPrayers(!allPrayers) }, allPrayers ? "Show fewer" : "Show all")), /* @__PURE__ */ _("div", { class: "sh2-group" }, /* @__PURE__ */ _(EventRows, { events: prayers, fallback: "Prayer" }))), f3 && /* @__PURE__ */ _("section", { class: "sh2-section" }, /* @__PURE__ */ _("div", { class: "sh2-section-head" }, /* @__PURE__ */ _("span", { class: "sh2-section-title" }, "Welcome form"), f3.submitted && /* @__PURE__ */ _("span", { class: "sh2-tally" }, shortDate(f3.submitted))), /* @__PURE__ */ _("div", { class: "sh2-group" }, f3.acceptCalling && /* @__PURE__ */ _(Labeled, { label: "Would accept a calling" }, f3.acceptCalling), f3.teach && /* @__PURE__ */ _(Labeled, { label: "Teaching" }, f3.teach), f3.music && /* @__PURE__ */ _(Labeled, { label: "Music" }, f3.music), f3.pastCallings && /* @__PURE__ */ _(Labeled, { label: "Past callings" }, f3.pastCallings), f3.hobbies && /* @__PURE__ */ _(Labeled, { label: "Hobbies" }, f3.hobbies), f3.situation && /* @__PURE__ */ _(Folded, { label: "Situation", text: f3.situation }), f3.forBishopric && /* @__PURE__ */ _(Folded, { label: "For the bishopric", text: f3.forBishopric }))));
}
function WardTab({ m: m3, people, sheet, act }) {
  const callings = callingList(m3.calling);
  return /* @__PURE__ */ _("div", { class: "sh2-tab" }, /* @__PURE__ */ _("div", { class: "sh2-group" }, /* @__PURE__ */ _(Labeled, { label: "Calling", date: m3.callingSince }, callings.length ? callings.join(" \xB7 ") : /* @__PURE__ */ _("span", { class: "sh2-muted" }, "None")), /* @__PURE__ */ _(People, { label: "Housemates", people: people.housemates, act }), /* @__PURE__ */ _(People, { label: "Ministered by", people: people.ministeredBy, act }), /* @__PURE__ */ _(People, { label: "Ministers to", people: people.ministersTo, act }), m3.movedIn && /* @__PURE__ */ _(Labeled, { label: "Moved in" }, shortDate(m3.movedIn), m3.priorUnit ? ` from ${m3.priorUnit}` : "")), /* @__PURE__ */ _("div", { class: "sh2-group" }, m3.phone && /* @__PURE__ */ _(Labeled, { label: "Phone" }, m3.phone), m3.email && /* @__PURE__ */ _(Labeled, { label: "Email" }, m3.email), m3.address && /* @__PURE__ */ _(Labeled, { label: "Address" }, m3.address)), /* @__PURE__ */ _(SheetSections, { sheet }));
}
function MemberPanel({ app, component, member, photoUrl, people, sheet, tab, onTab, act }) {
  return /* @__PURE__ */ _("div", { class: "sh2" }, /* @__PURE__ */ _(Header, { m: member, photoUrl, act }), /* @__PURE__ */ _("div", { class: "sh2-body" }, /* @__PURE__ */ _(Threads, { tasks: member.tasks, act }), /* @__PURE__ */ _(Segmented, { tab, onTab }), tab === "facts" && /* @__PURE__ */ _(FactsTab, { m: member, act }), tab === "private" && /* @__PURE__ */ _(PrivateTab, { app, component, m: member, act }), tab === "ward" && /* @__PURE__ */ _(WardTab, { key: member.file.path, m: member, people, sheet, act })));
}

// src/services/MemberService.ts
var import_obsidian2 = require("obsidian");

// src/services/sections.ts
var FACT_LABELS = [
  "Background",
  "Work",
  "School",
  "Family",
  "Living",
  "Relationships",
  "Health",
  "Temple",
  "Activity"
];
var PRIVATE_SUBSECTIONS = {
  recovery: "Repentance & recovery",
  membership: "Membership",
  help: "Help given",
  mentalHealth: "Mental health"
};
var DATE = String.raw`\d{4}-\d{2}(?:-\d{2})?`;
var DASH = String.raw`\s+[—–-]\s+`;
function escapeRe(s3) {
  return s3.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function sectionRange(lines, heading, level = 2, from = 0, to = lines.length) {
  const hashes = "#".repeat(level);
  const re = new RegExp(`^${hashes}\\s+${escapeRe(heading)}\\s*$`, "i");
  const stop = new RegExp(`^#{1,${level}}\\s`);
  for (let i3 = from; i3 < to; i3++) {
    if (!re.test(lines[i3]))
      continue;
    let j3 = i3 + 1;
    while (j3 < to && !stop.test(lines[j3]))
      j3++;
    return [i3 + 1, j3];
  }
  return null;
}
function sectionText(lines, range) {
  if (!range)
    return "";
  return lines.slice(range[0], range[1]).join("\n").trim();
}
function splitBody(content) {
  const m3 = content.match(/^---\n[\s\S]*?\n---\n/);
  if (!m3)
    return { body: content, offset: 0 };
  return { body: content.slice(m3[0].length), offset: m3[0].split("\n").length - 1 };
}
var DUE_RE = new RegExp(String.raw`\s*(?:📅\s*|\bby\s+|·\s*)(${DATE})\s*$`, "i");
function parseTasks(body) {
  const lines = body.split("\n");
  const range = sectionRange(lines, "Open threads") || sectionRange(lines, "Next Steps");
  if (!range)
    return [];
  const tasks = [];
  for (let i3 = range[0]; i3 < range[1]; i3++) {
    const m3 = lines[i3].match(/^\s*- \[([ xX])\]\s+(.*)$/);
    if (!m3)
      continue;
    let text = m3[2].trim();
    let due = "";
    const d3 = text.match(DUE_RE);
    if (d3) {
      due = d3[1];
      text = text.slice(0, d3.index).trim();
    }
    tasks.push({ completed: m3[1] !== " ", text, line: i3, due });
  }
  return tasks;
}
var FACT_RE = new RegExp(
  String.raw`^\s*-\s+(?:\*\*(.+?)\*\*:?|([A-Z][\w &/]*?):)\s*(?:[—–-]\s*)?(.*?)\s*(?:\*?\((${DATE})\)\*?)?\s*$`
);
function parseFacts(body) {
  const lines = body.split("\n");
  const range = sectionRange(lines, "Standing facts");
  if (!range)
    return [];
  const facts = [];
  for (let i3 = range[0]; i3 < range[1]; i3++) {
    const m3 = lines[i3].match(FACT_RE);
    if (!m3)
      continue;
    const label = (m3[1] || m3[2] || "").trim();
    const value = (m3[3] || "").trim();
    if (!label || !value)
      continue;
    facts.push({ label, value, date: m3[4] || "" });
  }
  return facts;
}
function listLines(lines, range) {
  if (!range)
    return [];
  return lines.slice(range[0], range[1]).filter((l3) => /^\s*-\s+/.test(l3)).map((l3) => l3.replace(/^\s*-\s+/, "").trim());
}
function parseRestriction(item) {
  let rest = item;
  let since = "";
  let lifted = "";
  const lm = rest.match(new RegExp(String.raw`\s*[·,]?\s*lifted\s+(${DATE})\s*$`, "i"));
  if (lm) {
    lifted = lm[1];
    rest = rest.slice(0, lm.index).trim();
  }
  const sm = rest.match(new RegExp(`^(${DATE})${DASH}(.*)$`));
  if (sm) {
    since = sm[1];
    rest = sm[2].trim();
  }
  return { text: rest, since, lifted };
}
function parseHelp(item) {
  const parts = item.split(/\s+[—–]\s+/).map((p3) => p3.trim());
  let date = "";
  if (parts.length && new RegExp(`^${DATE}$`).test(parts[0]))
    date = parts.shift();
  let amount = null;
  let amountText = "";
  const ai = parts.findIndex((p3) => /^\$\s*[\d,]+(?:\.\d+)?$/.test(p3));
  if (ai >= 0) {
    amountText = parts[ai].replace(/\s+/g, "");
    amount = Number(amountText.replace(/[$,]/g, ""));
    parts.splice(ai, 1);
  }
  return { date, amount, amountText, purpose: parts.join(" \u2014 ") };
}
function parsePrivate(body) {
  const lines = body.split("\n");
  const priv = sectionRange(lines, "Private");
  if (!priv)
    return { recovery: "", membership: [], help: [], mentalHealth: "", present: false };
  const sub = (name) => sectionRange(lines, name, 3, priv[0], priv[1]);
  return {
    present: true,
    recovery: sectionText(lines, sub(PRIVATE_SUBSECTIONS.recovery)),
    membership: listLines(lines, sub(PRIVATE_SUBSECTIONS.membership)).map(parseRestriction),
    help: listLines(lines, sub(PRIVATE_SUBSECTIONS.help)).map(parseHelp),
    mentalHealth: sectionText(lines, sub(PRIVATE_SUBSECTIONS.mentalHealth))
  };
}
var ORDER = ["Open threads", "Standing facts", "Private", "Interactions", "Earlier notes"];
function ensureSection(lines, heading) {
  const found = sectionRange(lines, heading);
  if (found)
    return { lines, range: found };
  const later = ORDER.slice(ORDER.indexOf(heading) + 1);
  let at = -1;
  for (const h3 of later) {
    const r3 = sectionRange(lines, h3);
    if (r3 && (at < 0 || r3[0] - 1 < at))
      at = r3[0] - 1;
  }
  const out = lines.slice();
  if (at < 0) {
    while (out.length && out[out.length - 1].trim() === "")
      out.pop();
    out.push("", `## ${heading}`, "");
  } else {
    out.splice(at, 0, `## ${heading}`, "", "");
  }
  return { lines: out, range: sectionRange(out, heading) };
}
function ensureSubsection(lines, parent, sub) {
  const p3 = ensureSection(lines, parent);
  let out = p3.lines;
  const found = sectionRange(out, sub, 3, p3.range[0], p3.range[1]);
  if (found)
    return { lines: out, range: found };
  let end = p3.range[1];
  while (end > p3.range[0] && out[end - 1].trim() === "")
    end--;
  out = out.slice();
  out.splice(end, 0, "", `### ${sub}`, "");
  const pr = sectionRange(out, parent);
  return { lines: out, range: sectionRange(out, sub, 3, pr[0], pr[1]) };
}
function appendListItem(lines, range, item, prepend = false) {
  const out = lines.slice();
  let at = range[0];
  while (at < range[1] && out[at].trim() === "" && at === range[0])
    at++;
  if (!prepend) {
    for (let i3 = range[0]; i3 < range[1]; i3++)
      if (/^\s*- /.test(out[i3]))
        at = i3 + 1;
  }
  out.splice(at, 0, item);
  if (at + 1 < out.length && /^#/.test(out[at + 1]))
    out.splice(at + 1, 0, "");
  return out;
}
function addTask(content, text) {
  let lines = content.split("\n");
  const legacy = sectionRange(lines, "Open threads") ? null : sectionRange(lines, "Next Steps");
  const target = legacy ? { lines, range: legacy } : ensureSection(lines, "Open threads");
  lines = appendListItem(target.lines, target.range, `- [ ] ${text}`);
  return lines.join("\n");
}
function upsertFact(content, label, value, date) {
  const { lines, range } = ensureSection(content.split("\n"), "Standing facts");
  const line = `- **${label}** \u2014 ${value} *(${date})*`;
  for (let i3 = range[0]; i3 < range[1]; i3++) {
    const m3 = lines[i3].match(FACT_RE);
    if (m3 && (m3[1] || m3[2] || "").trim().toLowerCase() === label.toLowerCase()) {
      const out = lines.slice();
      out[i3] = line;
      return out.join("\n");
    }
  }
  return appendListItem(lines, range, line).join("\n");
}
function addHelp(content, date, amount, purpose) {
  const { lines, range } = ensureSubsection(content.split("\n"), "Private", PRIVATE_SUBSECTIONS.help);
  const amt = amount.trim() ? `$${amount.trim().replace(/^\$/, "")}` : "";
  const item = ["- " + date, amt, purpose.trim()].filter(Boolean).join(" \u2014 ");
  return appendListItem(lines, range, item).join("\n");
}
function addRestriction(content, date, text) {
  const { lines, range } = ensureSubsection(content.split("\n"), "Private", PRIVATE_SUBSECTIONS.membership);
  return appendListItem(lines, range, `- ${date} \u2014 ${text.trim()}`).join("\n");
}
function liftRestriction(content, index, date) {
  const lines = content.split("\n");
  const priv = sectionRange(lines, "Private");
  if (!priv)
    return content;
  const r3 = sectionRange(lines, PRIVATE_SUBSECTIONS.membership, 3, priv[0], priv[1]);
  if (!r3)
    return content;
  let n2 = 0;
  for (let i3 = r3[0]; i3 < r3[1]; i3++) {
    if (!/^\s*-\s+/.test(lines[i3]))
      continue;
    if (n2++ !== index)
      continue;
    if (/lifted\s+\d{4}-/i.test(lines[i3]))
      return content;
    lines[i3] = `${lines[i3].trimEnd()} \xB7 lifted ${date}`;
    return lines.join("\n");
  }
  return content;
}
function ensurePrivateHeading(content, sub) {
  return ensureSubsection(content.split("\n"), "Private", sub).lines.join("\n");
}

// src/services/MemberService.ts
var MemberService = class {
  constructor(app, settings) {
    this.app = app;
    this.settings = settings;
    this.index = null;
    this.indexInvalidationRef = this.app.metadataCache.on("changed", (file) => {
      if (file instanceof import_obsidian2.TFile && this.isMemberFile(file)) {
        this.index = null;
      }
    });
  }
  isMemberFile(file) {
    if (!file)
      return false;
    return file.path.startsWith(this.settings.memberDir + "/") && file.extension === "md";
  }
  async buildMemberState(file) {
    const cache = this.app.metadataCache.getFileCache(file);
    const fm = (cache == null ? void 0 : cache.frontmatter) || {};
    const content = await this.app.vault.read(file);
    const { body } = splitBody(content);
    const tasks = parseTasks(body);
    const interactions = this.parseInteractions(body);
    const lastContact = String(fm["last-contact"] || "");
    const newestEntry = interactions.map((i3) => i3.date).filter(Boolean).sort().pop() || "";
    const lastTalked = [lastContact.slice(0, 10), newestEntry].filter(Boolean).sort().pop() || "";
    const daysSinceContact = this.daysSince(lastTalked);
    const ministering = parseMinistering(String(fm["ministering-assignment"] || ""));
    return {
      file,
      name: String(fm.name || file.basename),
      photo: String(fm.photo || ""),
      phone: String(fm.phone || ""),
      email: String(fm.email || ""),
      address: String(fm.address || ""),
      age: fm.age != null ? Number(fm.age) : null,
      dob: String(fm.dob || ""),
      gender: String(fm.gender || ""),
      priority: fm.priority || "normal",
      status: fm.status || "new",
      pastoralState: fm["pastoral-state"] || "",
      checkIn: fm["check-in"] || "none",
      checkInStyle: fm["check-in-style"] || "gif",
      gifPrompt: String(fm["gif-prompt"] || ""),
      nextOrdinance: fm["next-ordinance"] || "unknown",
      recommend: fm.recommend || "unknown",
      recommendExp: String(fm["recommend-exp"] || ""),
      endowed: fm.endowed === true || fm.endowed === "true",
      priesthood: fm.priesthood || "none",
      ministeringBrothers: Array.isArray(fm["ministering-brothers"]) ? fm["ministering-brothers"] : [],
      ministeringSisters: Array.isArray(fm["ministering-sisters"]) ? fm["ministering-sisters"] : [],
      ministeredBy: ministering.ministeredBy,
      ministersTo: ministering.ministersTo,
      patriarchalBlessing: fm["patriarchal-blessing"] === true,
      calling: String(fm.calling || ""),
      lastContact,
      convertDate: String(fm["convert-date"] || ""),
      movedIn: String(fm["moved-in"] || ""),
      met: fm.met === true || fm.met === "true" ? true : fm.met === false || fm.met === "false" ? false : null,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      daysSinceContact,
      isOverdue: this.checkOverdue(fm.priority, daysSinceContact),
      tasks,
      interactions,
      facts: parseFacts(body),
      private: parsePrivate(body),
      callingSince: String(fm["calling-since"] || ""),
      priorUnit: String(fm["prior-unit"] || ""),
      mission: String(fm.mission || ""),
      lastTalked
    };
  }
  daysSince(dateStr) {
    if (!dateStr)
      return null;
    const d3 = new Date(dateStr);
    if (isNaN(d3.getTime()))
      return null;
    const now = /* @__PURE__ */ new Date();
    return Math.floor((now.getTime() - d3.getTime()) / (1e3 * 60 * 60 * 24));
  }
  checkOverdue(priority, days) {
    if (days === null)
      return false;
    const highPriority = priority === "top-10" || priority === "high";
    return highPriority && days > this.settings.overdueThreshold;
  }
  parseInteractions(body) {
    const interactions = [];
    const lines = body.split("\n");
    let inSection = false;
    let current = null;
    for (const line of lines) {
      if (line.match(/^##\s+Interactions/)) {
        inSection = true;
        continue;
      }
      if (inSection && line.match(/^##\s/) && !line.match(/^###/))
        break;
      if (!inSection)
        continue;
      const heading = line.match(/^###\s+(.*)/);
      if (heading) {
        if (current)
          interactions.push(current);
        const headingText = heading[1];
        const dateMatch = headingText.match(/(\d{4}-\d{2}-\d{2})/);
        current = {
          date: dateMatch ? dateMatch[1] : "",
          title: headingText,
          preview: ""
        };
        continue;
      }
      if (current && line.trim()) {
        if (current.preview) {
          current.preview += " \xB7 " + line.trim();
        } else {
          current.preview = line.trim();
        }
      }
    }
    if (current)
      interactions.push(current);
    return interactions;
  }
  /** All other member files sharing a normalized address, excluding moved-out members. */
  getHousemates(member) {
    const targetAddress = normalizeAddress(member.address);
    if (!targetAddress)
      return [];
    return this.getIndex().filter((entry) => entry.file.path !== member.file.path).filter((entry) => entry.status !== "moved-out").filter((entry) => normalizeAddress(entry.address) === targetAddress).map((entry) => ({ name: entry.name, file: entry.file }));
  }
  /** Looks up a member file by display name (frontmatter `name`, falling back to filename). */
  resolveMemberByName(name) {
    const target = name.trim().toLowerCase();
    if (!target)
      return null;
    const index = this.getIndex();
    const byName = index.find((entry) => entry.name.trim().toLowerCase() === target);
    if (byName)
      return byName.file;
    const byFile = index.find((entry) => entry.file.basename.trim().toLowerCase() === target);
    return byFile ? byFile.file : null;
  }
  getIndex() {
    if (!this.index)
      this.index = this.buildIndex();
    return this.index;
  }
  buildIndex() {
    return this.app.vault.getFiles().filter((f3) => this.isMemberFile(f3)).map((file) => {
      const cache = this.app.metadataCache.getFileCache(file);
      const fm = (cache == null ? void 0 : cache.frontmatter) || {};
      return {
        file,
        name: String(fm.name || file.basename),
        address: String(fm.address || ""),
        status: String(fm.status || "")
      };
    });
  }
};

// src/services/WriteService.ts
var WriteService = class {
  constructor(app) {
    this.app = app;
  }
  async setPriority(file, priority) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.priority = priority;
    });
  }
  /** `met: true|false`; null removes it (back to "not sorted"). */
  async setMet(file, met) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (met === null)
        delete fm.met;
      else
        fm.met = met;
    });
  }
  async setStatus(file, status) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.status = status;
    });
  }
  async setPastoralState(file, state) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm["pastoral-state"] = state;
    });
  }
  async setCheckIn(file, checkIn) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (checkIn === "none")
        delete fm["check-in"];
      else
        fm["check-in"] = checkIn;
    });
  }
  async setCheckInStyle(file, style) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm["check-in-style"] = style;
    });
  }
  async setGifPrompt(file, prompt) {
    const value = prompt.trim();
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (value)
        fm["gif-prompt"] = value;
      else
        delete fm["gif-prompt"];
    });
  }
  async setOrdinance(file, ordinance) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm["next-ordinance"] = ordinance;
    });
  }
  async setRecommend(file, recommend) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.recommend = recommend;
    });
  }
  async setCalling(file, calling) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm.calling = calling;
    });
  }
  async markContacted(file) {
    const day = today();
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    if (!this.hasInteractionHeadingFor(lines, day)) {
      let insertIdx = -1;
      for (let i3 = 0; i3 < lines.length; i3++) {
        if (lines[i3].match(/^##\s+Interactions/)) {
          insertIdx = i3 + 1;
          break;
        }
      }
      if (insertIdx >= 0) {
        const entry = `
### ${day} \u2014 Contact
`;
        lines.splice(insertIdx, 0, entry);
        await this.app.vault.modify(file, lines.join("\n"));
      }
    }
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm["last-contact"] = day;
    });
  }
  hasInteractionHeadingFor(lines, isoDate) {
    let inSection = false;
    for (const line of lines) {
      if (line.match(/^##\s+Interactions/)) {
        inSection = true;
        continue;
      }
      if (inSection && line.match(/^##\s/) && !line.match(/^###/))
        return false;
      if (!inSection)
        continue;
      if (line.match(new RegExp(`^###\\s+${isoDate}\\b`)))
        return true;
    }
    return false;
  }
  async toggleTask(file, taskLine) {
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    const fmEnd = content.indexOf("\n---", 3);
    const bodyStart = fmEnd === -1 ? 0 : content.substring(0, fmEnd + 4).split("\n").length;
    const absoluteLine = bodyStart + taskLine;
    if (absoluteLine < lines.length) {
      const line = lines[absoluteLine];
      if (line.match(/^- \[ \]/)) {
        lines[absoluteLine] = line.replace("- [ ]", "- [x]");
      } else if (line.match(/^- \[[xX]\]/)) {
        lines[absoluteLine] = line.replace(/- \[[xX]\]/, "- [ ]");
      }
      await this.app.vault.modify(file, lines.join("\n"));
    }
  }
  async addTask(file, text) {
    await this.app.vault.process(file, (c3) => addTask(c3, text.trim()));
  }
  async upsertFact(file, label, value) {
    await this.app.vault.process(file, (c3) => upsertFact(c3, label, value.trim(), today()));
  }
  async addHelp(file, date, amount, purpose) {
    await this.app.vault.process(file, (c3) => addHelp(c3, date || today(), amount, purpose));
  }
  async addRestriction(file, date, text) {
    await this.app.vault.process(file, (c3) => addRestriction(c3, date || today(), text));
  }
  async liftRestriction(file, index) {
    await this.app.vault.process(file, (c3) => liftRestriction(c3, index, today()));
  }
  async ensurePrivateHeading(file, sub) {
    await this.app.vault.process(file, (c3) => ensurePrivateHeading(c3, sub));
  }
  async logInteraction(file, note) {
    const day = today();
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");
    let insertIdx = -1;
    for (let i3 = 0; i3 < lines.length; i3++) {
      if (lines[i3].match(/^##\s+Interactions/)) {
        insertIdx = i3 + 1;
        break;
      }
    }
    if (insertIdx >= 0) {
      const entry = `
### ${day} \u2014 Note
${note}
`;
      lines.splice(insertIdx, 0, entry);
      await this.app.vault.modify(file, lines.join("\n"));
    }
    await this.markContacted(file);
  }
};
function today() {
  const d3 = /* @__PURE__ */ new Date();
  return `${d3.getFullYear()}-${String(d3.getMonth() + 1).padStart(2, "0")}-${String(d3.getDate()).padStart(2, "0")}`;
}

// src/folds.ts
var import_obsidian3 = require("obsidian");
var PANEL_SECTIONS = ["Open threads", "Standing facts", "Private", "Earlier notes"];
function sectionFolds(view, headings) {
  const editor = view.editor;
  if (!editor)
    return [];
  const n2 = editor.lineCount();
  const lines = [];
  for (let i3 = 0; i3 < n2; i3++)
    lines.push(editor.getLine(i3));
  const folds = [];
  for (const h3 of headings) {
    const i3 = lines.findIndex((l3) => l3.trim().toLowerCase() === `## ${h3}`.toLowerCase());
    if (i3 < 0)
      continue;
    let j3 = i3 + 1;
    while (j3 < n2 && !/^#{1,2}\s/.test(lines[j3]) && lines[j3].trim() !== "---")
      j3++;
    let end = j3 - 1;
    while (end > i3 && !lines[end].trim())
      end--;
    if (end > i3)
      folds.push({ from: i3, to: end });
  }
  return folds;
}
function confidentialFolds(view) {
  const editor = view.editor;
  if (!editor)
    return [];
  const n2 = editor.lineCount();
  const folds = [];
  for (let i3 = 0; i3 < n2; i3++) {
    if (!/^###\s+confidential/i.test(editor.getLine(i3)))
      continue;
    let j3 = i3 + 1;
    while (j3 < n2 && !/^#{1,3}\s/.test(editor.getLine(j3)) && editor.getLine(j3).trim() !== "---")
      j3++;
    let end = j3 - 1;
    while (end > i3 && !editor.getLine(end).trim())
      end--;
    if (end > i3)
      folds.push({ from: i3, to: end });
  }
  return folds;
}
function views(ws, file) {
  return ws.getLeavesOfType("markdown").map((l3) => l3.view).filter((v3) => {
    var _a;
    return v3 instanceof import_obsidian3.MarkdownView && ((_a = v3.file) == null ? void 0 : _a.path) === file.path;
  });
}
function foldPanelSections(ws, file) {
  var _a, _b;
  for (const view of views(ws, file)) {
    const mode = view.currentMode;
    if (!mode.getFoldInfo || !mode.applyFoldInfo)
      continue;
    try {
      const want = [...sectionFolds(view, PANEL_SECTIONS), ...confidentialFolds(view)];
      const have = (_b = (_a = mode.getFoldInfo()) == null ? void 0 : _a.folds) != null ? _b : [];
      const merged = [...have.filter((f3) => !want.some((w3) => w3.from === f3.from)), ...want];
      mode.applyFoldInfo({ folds: merged, lines: view.editor.lineCount() });
    } catch (e3) {
    }
  }
}
function unfoldSection(ws, file, heading) {
  for (const view of views(ws, file)) {
    const mode = view.currentMode;
    if (!mode.getFoldInfo || !mode.applyFoldInfo)
      continue;
    try {
      const target = sectionFolds(view, [heading])[0];
      const info = mode.getFoldInfo();
      if (!target || !info)
        continue;
      mode.applyFoldInfo({ folds: info.folds.filter((f3) => f3.from !== target.from), lines: view.editor.lineCount() });
    } catch (e3) {
    }
  }
}

// src/menus.ts
var import_obsidian4 = require("obsidian");

// src/models/types.ts
var PRIORITIES = ["top-10", "high", "normal", "new-move-in"];
var STATUSES = ["new", "active", "inactive"];
var PASTORAL_STATES = ["", "working-with", "under-restrictions", "non-responsive", "resolved", "dating-seriously", "getting-married", "preparing-for-baptism"];
var CHECK_INS = ["none", "daily", "weekly"];
var CHECK_IN_STYLES = ["gif", "quick-text", "encouragement", "scripture", "write-myself"];
var ORDINANCES = [
  "unknown",
  "baptism",
  "confirmation",
  "aaronic-priesthood",
  "melchizedek-priesthood",
  "endowment",
  "sealing"
];
var RECOMMENDS = [
  "current",
  "expiring",
  "expired",
  "none",
  "unknown"
];
var DEFAULT_SETTINGS = {
  memberDir: "Church/Members",
  dashboardPath: "Church/_system/views/_dashboard.md",
  overdueThreshold: 14,
  showContactBar: true,
  autoOpenPanel: true
};

// src/menus.ts
var TITLE = (s3) => s3 ? s3.replace(/-/g, " ").replace(/^./, (c3) => c3.toUpperCase()) : "None";
var FormModal = class extends import_obsidian4.Modal {
  constructor(app, heading, fields, onSave, required = []) {
    super(app);
    this.heading = heading;
    this.fields = fields;
    this.onSave = onSave;
    this.required = required;
  }
  onOpen() {
    var _a, _b, _c;
    this.modalEl.addClass("sh-form-modal");
    this.titleEl.setText(this.heading);
    const values = {};
    let first = null;
    let saveBtn = null;
    const ready = () => !this.required.some((k3) => !(values[k3] || "").trim());
    const sync = () => {
      if (saveBtn)
        saveBtn.disabled = !ready();
    };
    const save = () => {
      if (!ready())
        return;
      this.close();
      this.onSave(values);
    };
    const form = this.contentEl.createDiv({ cls: "sh-form" });
    for (const f3 of this.fields) {
      values[f3.key] = (_a = f3.initial) != null ? _a : f3.options ? f3.options[0] : "";
      const row = form.createDiv({ cls: "sh-form-field" });
      const id = `sh-f-${f3.key}-${Math.random().toString(36).slice(2, 7)}`;
      row.createEl("label", { text: f3.label, attr: { for: id } });
      let el;
      if (f3.options) {
        const sel = row.createEl("select", { cls: "dropdown", attr: { id } });
        f3.options.forEach((o3) => sel.createEl("option", { text: o3, value: o3 }));
        sel.value = values[f3.key];
        sel.addEventListener("change", () => {
          values[f3.key] = sel.value;
          sync();
        });
        el = sel;
      } else if (f3.multiline) {
        const ta = row.createEl("textarea", { attr: { id, rows: "5", placeholder: (_b = f3.placeholder) != null ? _b : "" } });
        ta.value = values[f3.key];
        ta.addEventListener("input", () => {
          values[f3.key] = ta.value;
          sync();
        });
        ta.addEventListener("keydown", (e3) => {
          if (e3.key === "Enter" && (e3.metaKey || e3.ctrlKey)) {
            e3.preventDefault();
            save();
          }
        });
        el = ta;
      } else {
        const tx = row.createEl("input", { attr: { id, type: "text", placeholder: (_c = f3.placeholder) != null ? _c : "" } });
        tx.value = values[f3.key];
        tx.addEventListener("input", () => {
          values[f3.key] = tx.value;
          sync();
        });
        tx.addEventListener("keydown", (e3) => {
          if (e3.key === "Enter") {
            e3.preventDefault();
            save();
          }
        });
        el = tx;
      }
      first = first != null ? first : el;
    }
    const bar = this.contentEl.createDiv({ cls: "sh-form-actions" });
    if (this.fields.some((f3) => f3.multiline)) {
      bar.createSpan({ cls: "sh-form-hint", text: import_obsidian4.Platform.isMacOS ? "\u2318\u21B5 to save" : "Ctrl+Enter to save" });
    }
    bar.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    saveBtn = bar.createEl("button", { text: "Save", cls: "mod-cta" });
    saveBtn.addEventListener("click", save);
    sync();
    window.setTimeout(() => first == null ? void 0 : first.focus(), 0);
  }
  onClose() {
    this.contentEl.empty();
  }
};
function logInteraction(app, writer, member) {
  new FormModal(
    app,
    `Log a conversation \xB7 ${member.name}`,
    [{ key: "note", label: "What did you talk about?", multiline: true, placeholder: "Leave blank to just mark that you talked today" }],
    (v3) => {
      const note = (v3.note || "").trim();
      void (note ? writer.logInteraction(member.file, note) : writer.markContacted(member.file));
    }
  ).open();
}
function addFact(app, writer, member, label) {
  var _a;
  const current = label ? (_a = member.facts.find((f3) => f3.label === label)) == null ? void 0 : _a.value : "";
  new FormModal(app, label ? `${label} \xB7 ${member.name}` : `Add a fact \xB7 ${member.name}`, [
    { key: "label", label: "Topic", options: label ? [label] : FACT_LABELS },
    { key: "value", label: "What\u2019s true now", initial: current || "", placeholder: "e.g. Line cook at a Provo diner" }
  ], (v3) => void writer.upsertFact(member.file, v3.label, v3.value), ["value"]).open();
}
function addHelp2(app, writer, member) {
  new FormModal(app, `Help given \xB7 ${member.name}`, [
    { key: "date", label: "Date", initial: today() },
    { key: "amount", label: "Amount", placeholder: "450" },
    { key: "purpose", label: "For", placeholder: "Rent (fast offering)" }
  ], (v3) => void writer.addHelp(member.file, v3.date, v3.amount, v3.purpose), ["purpose"]).open();
}
function addRestriction2(app, writer, member) {
  new FormModal(app, `Membership restriction \xB7 ${member.name}`, [
    { key: "date", label: "Since", initial: today() },
    { key: "text", label: "Restriction", placeholder: "No temple recommend use" }
  ], (v3) => void writer.addRestriction(member.file, v3.date, v3.text), ["text"]).open();
}
function showMoreMenu(app, writer, member, e3) {
  const file = member.file;
  const menu = new import_obsidian4.Menu();
  const group = (title, opts, current, write) => {
    menu.addItem((i3) => i3.setTitle(title).setIsLabel(true));
    for (const o3 of opts) {
      menu.addItem((i3) => i3.setTitle(TITLE(o3)).setChecked(o3 === current).onClick(() => void write(o3)));
    }
    menu.addSeparator();
  };
  menu.addItem((i3) => i3.setTitle("Mark talked today").setIcon("check").onClick(() => void writer.markContacted(file)));
  menu.addSeparator();
  menu.addItem((i3) => i3.setTitle("Met").setIsLabel(true));
  menu.addItem((i3) => i3.setTitle("I know them").setChecked(member.met === true).onClick(() => void writer.setMet(file, true)));
  menu.addItem((i3) => i3.setTitle("Haven't met").setChecked(member.met === false).onClick(() => void writer.setMet(file, false)));
  menu.addSeparator();
  group("Priority", PRIORITIES, member.priority, (v3) => writer.setPriority(file, v3));
  group("Pastoral", PASTORAL_STATES, member.pastoralState, (v3) => writer.setPastoralState(file, v3));
  group("Recommend", RECOMMENDS, member.recommend, (v3) => writer.setRecommend(file, v3));
  group("Next ordinance", ORDINANCES, member.nextOrdinance, (v3) => writer.setOrdinance(file, v3));
  group("Presence", STATUSES, member.status, (v3) => writer.setStatus(file, v3));
  group("Check-in", CHECK_INS, member.checkIn, (v3) => writer.setCheckIn(file, v3));
  if (member.checkIn !== "none") {
    group("Message", CHECK_IN_STYLES, member.checkInStyle, (v3) => writer.setCheckInStyle(file, v3));
    if (member.checkInStyle === "gif") {
      menu.addItem((i3) => i3.setTitle(member.gifPrompt ? `GIF prompt: ${member.gifPrompt}` : "Set GIF prompt\u2026").setIcon("image").onClick(() => new FormModal(
        app,
        "GIF prompt",
        [{ key: "p", label: "Prompt", initial: member.gifPrompt, placeholder: "e.g. locked in, you got this" }],
        (v3) => void writer.setGifPrompt(file, v3.p || "")
      ).open()));
    }
  }
  menu.showAtMouseEvent(e3);
}

// src/ShepherdView.tsx
var VIEW_TYPE_SHEPHERD = "shepherd-view";
var ShepherdView = class extends import_obsidian5.ItemView {
  constructor(leaf, settings) {
    super(leaf);
    this.settings = settings;
    this.currentFile = null;
    this.member = null;
    this.tab = "facts";
    this.wardSheet = null;
    this.wardSheetMtime = -1;
    this.memberService = new MemberService(this.app, settings);
    this.registerEvent(this.memberService.indexInvalidationRef);
    this.writeService = new WriteService(this.app);
  }
  getViewType() {
    return VIEW_TYPE_SHEPHERD;
  }
  getDisplayText() {
    return "Shepherd";
  }
  getIcon() {
    return "heart";
  }
  get host() {
    return this.containerEl.children[1];
  }
  async onOpen() {
    this.host.addClass("shepherd-view");
    this.host.tabIndex = -1;
    this.registerDomEvent(this.host, "keydown", (e3) => this.onKey(e3));
    const file = this.app.workspace.getActiveFile();
    if (file && this.memberService.isMemberFile(file))
      await this.showMember(file);
    else
      this.showEmpty();
  }
  async onClose() {
    J(null, this.host);
  }
  /** 1/2/3 switch tabs, L logs, C/T/E call/text/email: only while focus is in the panel and not typing. */
  onKey(e3) {
    if (!this.member || e3.metaKey || e3.ctrlKey || e3.altKey)
      return;
    const t3 = e3.target;
    if (t3 && (t3.tagName === "INPUT" || t3.tagName === "TEXTAREA" || t3.tagName === "SELECT" || t3.isContentEditable))
      return;
    const k3 = e3.key.toLowerCase();
    const tab = TABS.find((x2) => x2.key === k3);
    if (tab) {
      e3.preventDefault();
      this.setTab(tab.id);
      return;
    }
    if (k3 === "l") {
      e3.preventDefault();
      this.triggerLogExpand();
      return;
    }
    const label = { c: "Call", t: "Text", e: "Email" }[k3];
    if (label) {
      const a3 = this.host.querySelector(`.sh2-actions a[aria-label="${label}"]`);
      if (a3) {
        e3.preventDefault();
        a3.click();
      }
    }
  }
  setTab(tab) {
    this.tab = tab;
    if (this.member)
      this.renderPanel(this.member);
  }
  /**
   * Read the nightly ward sheet cache, re-reading only when the file changed.
   * Never throws: a missing or unreadable file just means no sheet, and the
   * Ward tab says so quietly.
   */
  async loadWardSheet() {
    try {
      const adapter = this.app.vault.adapter;
      const stat = await adapter.stat(WARD_SHEET_PATH);
      if (!stat || stat.type !== "file") {
        this.wardSheet = null;
        this.wardSheetMtime = -1;
        return;
      }
      if (stat.mtime === this.wardSheetMtime)
        return;
      this.wardSheet = parseWardSheet(await adapter.read(WARD_SHEET_PATH));
      this.wardSheetMtime = stat.mtime;
    } catch (e3) {
      this.wardSheet = null;
      this.wardSheetMtime = -1;
    }
  }
  async showMember(file) {
    var _a, _b;
    this.currentFile = file;
    await this.loadWardSheet();
    if (((_a = this.currentFile) == null ? void 0 : _a.path) !== file.path)
      return;
    try {
      const member = await this.memberService.buildMemberState(file);
      if (((_b = this.currentFile) == null ? void 0 : _b.path) !== file.path)
        return;
      this.member = member;
      this.renderPanel(member);
    } catch (e3) {
      this.member = null;
      J(null, this.host);
      this.host.empty();
      const errDiv = this.host.createDiv({ cls: "shepherd-empty" });
      errDiv.createDiv({ text: `Error loading member: ${e3}`, cls: "shepherd-empty-text" });
    }
  }
  showEmpty() {
    this.currentFile = null;
    this.member = null;
    const dashPath = this.settings.dashboardPath;
    J(
      _(
        "div",
        { class: "shepherd-empty" },
        _("div", { class: "shepherd-empty-text" }, "Open a member note to see them here."),
        _("a", {
          class: "shepherd-empty-link",
          onClick: () => {
            if (this.app.vault.getAbstractFileByPath(dashPath) instanceof import_obsidian5.TFile) {
              this.app.workspace.openLinkText(dashPath, "", false);
            }
          }
        }, "Open the dashboard")
      ),
      this.host
    );
  }
  async refresh(file) {
    const target = file || this.currentFile;
    if (target && this.memberService.isMemberFile(target))
      await this.showMember(target);
    else
      this.showEmpty();
  }
  /** Open the log form (command and the L key). */
  triggerLogExpand() {
    if (this.member)
      logInteraction(this.app, this.writeService, this.member);
  }
  noteLeaf() {
    var _a;
    return (_a = this.app.workspace.getMostRecentLeaf()) != null ? _a : this.app.workspace.getLeaf(false);
  }
  renderPanel(member) {
    const file = member.file;
    const w3 = this.writeService;
    const after = (p3) => void p3.then(() => this.showMember(file));
    const photo = member.photo ? this.app.vault.getAbstractFileByPath(member.photo) : null;
    const photoUrl = photo instanceof import_obsidian5.TFile ? this.app.vault.getResourcePath(photo) : null;
    const person = (name) => ({ name, file: this.memberService.resolveMemberByName(name) });
    const act = {
      log: () => logInteraction(this.app, w3, member),
      more: (e3) => showMoreMenu(this.app, w3, member, e3),
      toggleTask: (line) => after(w3.toggleTask(file, line)),
      addTask: (text) => after(w3.addTask(file, text)),
      addFact: (label) => addFact(this.app, w3, member, label),
      addHelp: () => addHelp2(this.app, w3, member),
      addRestriction: () => addRestriction2(this.app, w3, member),
      liftRestriction: (i3, e3) => {
        const menu = new import_obsidian5.Menu();
        menu.addItem((it) => it.setTitle("Mark lifted today").setIcon("check").onClick(() => after(w3.liftRestriction(file, i3))));
        menu.showAtMouseEvent(e3);
      },
      editPrivate: (sub) => {
        void w3.ensurePrivateHeading(file, sub).then(() => this.noteLeaf().openFile(file, { eState: { subpath: `#${sub}` } })).then(() => unfoldSection(this.app.workspace, file, "Private"));
      },
      open: (target) => void this.noteLeaf().openFile(target)
    };
    J(
      _(MemberPanel, {
        app: this.app,
        component: this,
        member,
        photoUrl,
        people: {
          housemates: this.memberService.getHousemates(member),
          ministeredBy: member.ministeredBy.map(person),
          ministersTo: member.ministersTo.map(person)
        },
        sheet: sheetFor(this.wardSheet, member.file.path, member.file.stat.ctime),
        tab: this.tab,
        onTab: (t3) => this.setTab(t3),
        act
      }),
      this.host
    );
  }
};

// src/MetSweepModal.ts
var import_obsidian6 = require("obsidian");
var MetSweepModal = class extends import_obsidian6.Modal {
  constructor(app, members, writer, memberDir) {
    super(app);
    this.members = members;
    this.writer = writer;
    this.memberDir = memberDir;
    this.queue = [];
    this.pos = 0;
    this.sorted = 0;
    this.history = [];
  }
  onOpen() {
    this.modalEl.addClass("shepherd-sweep-modal");
    this.containerEl.addClass("shepherd-sweep-container");
    const files = this.app.vault.getMarkdownFiles().filter((f3) => {
      var _a;
      return ((_a = f3.parent) == null ? void 0 : _a.path) === this.memberDir;
    });
    const fmOf = (f3) => {
      var _a, _b;
      return (_b = (_a = this.app.metadataCache.getFileCache(f3)) == null ? void 0 : _a.frontmatter) != null ? _b : {};
    };
    this.queue = files.filter((f3) => {
      const fm = fmOf(f3);
      const css = fm.cssclasses;
      const isMember = Array.isArray(css) ? css.includes("member-profile") : String(css != null ? css : "").includes("member-profile");
      return isMember && fm.met !== true && fm.met !== false && fm.met !== "true" && fm.met !== "false";
    }).sort((a3, b) => Number(!fmOf(a3).photo) - Number(!fmOf(b).photo) || a3.basename.localeCompare(b.basename));
    const key = (fn) => () => {
      if (!this.modalEl.contains(document.activeElement) && document.activeElement !== document.body)
        return true;
      fn();
      return false;
    };
    this.scope.register([], "k", key(() => void this.answer(true)));
    this.scope.register([], "n", key(() => void this.answer(false)));
    this.scope.register([], "s", key(() => this.next()));
    void this.draw();
  }
  onClose() {
    this.contentEl.empty();
    this.app.metadataCache.offref(this.members.indexInvalidationRef);
  }
  async answer(met) {
    const file = this.queue[this.pos];
    if (!file)
      return;
    await this.writer.setMet(file, met);
    this.history.push(file);
    this.sorted++;
    this.next();
  }
  next() {
    this.pos++;
    void this.draw();
  }
  async undo() {
    const file = this.history.pop();
    if (!file)
      return;
    await this.writer.setMet(file, null);
    this.sorted--;
    this.pos = this.queue.indexOf(file);
    void this.draw();
  }
  /** Open the member's note in the main pane without taking focus from the card. */
  async showNote(file) {
    var _a, _b;
    const leaf = (_a = this.app.workspace.getMostRecentLeaf()) != null ? _a : this.app.workspace.getLeaf(false);
    if (((_b = leaf.view.file) == null ? void 0 : _b.path) !== file.path) {
      await leaf.openFile(file, { active: false });
    }
    this.app.workspace.setActiveLeaf(leaf, { focus: false });
    this.modalEl.focus();
  }
  async draw() {
    const el = this.contentEl;
    el.empty();
    this.titleEl.setText("Who do you know?");
    const file = this.queue[this.pos];
    if (!file) {
      el.createDiv({ cls: "shepherd-sweep-done", text: this.queue.length ? `Done. ${this.sorted} sorted this round${this.pos > this.sorted ? `, ${this.pos - this.sorted} skipped` : ""}.` : "Everyone is sorted." });
      return;
    }
    void this.showNote(file);
    const m3 = await this.members.buildMemberState(file);
    el.createDiv({ cls: "shepherd-sweep-progress", text: `${this.pos + 1} of ${this.queue.length}` });
    const card = el.createDiv({ cls: "shepherd-sweep-card" });
    const photo = m3.photo ? this.app.vault.getAbstractFileByPath(m3.photo) : null;
    if (photo instanceof import_obsidian6.TFile)
      card.createEl("img", { cls: "shepherd-sweep-photo", attr: { src: this.app.vault.getResourcePath(photo), alt: "" } });
    else
      card.createDiv({ cls: "shepherd-sweep-photo is-empty", text: m3.name.split(/\s+/).map((w3) => w3[0]).slice(0, 2).join("") });
    const info = card.createDiv({ cls: "shepherd-sweep-info" });
    info.createDiv({ cls: "shepherd-sweep-name", text: m3.name });
    const bits = [];
    if (m3.age != null)
      bits.push(String(m3.age));
    const since = monthYear(m3.movedIn);
    if (since)
      bits.push(`in the ward since ${since}`);
    if (bits.length)
      info.createDiv({ cls: "shepherd-sweep-sub", text: bits.join(" \xB7 ") });
    info.createDiv({ cls: "shepherd-sweep-sub", text: callingNames(m3.calling) || "No calling" });
    const housemates = this.members.getHousemates(m3).map((p3) => p3.name);
    if (housemates.length)
      info.createDiv({ cls: "shepherd-sweep-sub", text: `Lives with ${housemates.slice(0, 4).join(", ")}` });
    const row = el.createDiv({ cls: "shepherd-sweep-actions" });
    const btn = (label, cls, fn) => {
      const b = row.createEl("button", { cls, text: label });
      b.addEventListener("click", fn);
    };
    btn("Haven't met", "shepherd-sweep-btn", () => void this.answer(false));
    btn("I know them", "shepherd-sweep-btn mod-cta", () => void this.answer(true));
    const foot = el.createDiv({ cls: "shepherd-sweep-foot" });
    const link = (label, fn) => {
      const a3 = foot.createEl("button", { cls: "shepherd-sweep-link", text: label });
      a3.addEventListener("click", fn);
    };
    link("Skip", () => this.next());
    if (this.history.length)
      link("Undo", () => void this.undo());
  }
};

// src/noteBody.ts
var import_obsidian7 = require("obsidian");
var MONTHS2 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var ENTRY = /^(\d{4})-(\d{2})-(\d{2})\s*(?:[—–·:-]\s*)?(.*)$/;
function entryDate(y3, m3, d3, thisYear = (/* @__PURE__ */ new Date()).getFullYear()) {
  var _a;
  const base = `${(_a = MONTHS2[parseInt(m3, 10) - 1]) != null ? _a : m3} ${parseInt(d3, 10)}`;
  return parseInt(y3, 10) === thisYear ? base : `${base}, ${y3}`;
}
function entryKind(type) {
  const t3 = type.toLowerCase();
  if (/interview|recommend|personal meeting|met with/.test(t3))
    return { kind: "interview", icon: "message-square" };
  if (/text|replied/.test(t3))
    return { kind: "text", icon: "message-circle" };
  if (/visit|welcome/.test(t3))
    return { kind: "visit", icon: "home" };
  if (/monologue|granola|circleback|call/.test(t3))
    return { kind: "recording", icon: "mic" };
  if (/tithing/.test(t3))
    return { kind: "tithing", icon: "receipt" };
  if (/welfare|assistance/.test(t3))
    return { kind: "welfare", icon: "hand-heart" };
  if (/ordain|ordinance|baptism|sealing/.test(t3))
    return { kind: "ordinance", icon: "sparkles" };
  if (/contact|hallway|sunday/.test(t3))
    return { kind: "contact", icon: "user" };
  return { kind: "note", icon: "file-text" };
}
function splitEntry(rest) {
  const empty = /,\s*no notes\s*$/i.test(rest);
  const clean = rest.replace(/,\s*no notes\s*$/i, "").trim();
  const [type, ...more] = clean.split(/\s+[—–]\s+/);
  return { type: type || "Note", topic: more.join(" \u2014 "), empty };
}
function replaceText(h3, build) {
  for (const n2 of Array.from(h3.childNodes))
    if (n2.nodeType === Node.TEXT_NODE)
      n2.remove();
  const frag = document.createDocumentFragment();
  build(frag);
  h3.appendChild(frag);
}
function tile(parent, icon, cls = "") {
  const t3 = parent.createSpan({ cls: `sh-tile ${cls}`.trim() });
  (0, import_obsidian7.setIcon)(t3, icon);
  return t3;
}
function makeNoteBodyProcessor(app, isMember) {
  return (el, ctx) => {
    var _a, _b;
    const file = app.vault.getAbstractFileByPath(ctx.sourcePath);
    if (!(file instanceof import_obsidian7.TFile) || !isMember(file))
      return;
    const fm = (_b = (_a = app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) != null ? _b : {};
    el.querySelectorAll("h1").forEach((h3) => {
      if (h3.hasClass("sh-title"))
        return;
      h3.addClass("sh-title");
      const callings = callingNames(String(fm.calling || "")).split(" \xB7 ").filter(Boolean);
      if (!callings.length)
        return;
      const row = createDiv({ cls: "sh-callings" });
      for (const c3 of callings) {
        const chip = row.createSpan({ cls: "sh-calling" });
        (0, import_obsidian7.setIcon)(chip.createSpan({ cls: "sh-calling-ic" }), "users");
        chip.createSpan({ text: c3 });
      }
      h3.insertAdjacentElement("afterend", row);
    });
    el.querySelectorAll("h2").forEach((h3) => {
      var _a2, _b2;
      if (h3.dataset.heading !== "Interactions" || h3.hasClass("sh-conv-h"))
        return;
      h3.addClass("sh-conv-h");
      const heads = (_b2 = (_a2 = app.metadataCache.getFileCache(file)) == null ? void 0 : _a2.headings) != null ? _b2 : [];
      const dated = heads.filter((x2) => x2.level === 3 && ENTRY.test(x2.heading));
      const first = dated.map((x2) => x2.heading.slice(0, 7)).sort()[0];
      replaceText(h3, (f3) => {
        f3.createSpan({ cls: "sh-conv-title", text: "Conversations" });
        if (dated.length) {
          const [y3, m3] = (first || "").split("-");
          const since = y3 && m3 ? ` since ${MONTHS2[parseInt(m3, 10) - 1]} ${y3}` : "";
          f3.createSpan({ cls: "sh-conv-count", text: `${dated.length} ${dated.length === 1 ? "entry" : "entries"}${since}` });
        }
      });
      const btn = createEl("button", { cls: "sh-compose", attr: { type: "button" } });
      (0, import_obsidian7.setIcon)(btn.createSpan({ cls: "sh-compose-ic" }), "plus");
      btn.createSpan({ text: "What did you talk about today?" });
      btn.createEl("kbd", { text: "L" });
      btn.addEventListener("click", (e3) => {
        e3.preventDefault();
        app.commands.executeCommandById("shepherd:log-interaction");
      });
      h3.insertAdjacentElement("afterend", btn);
    });
    el.querySelectorAll("h3").forEach((h3) => {
      var _a2, _b2;
      if (h3.hasClass("sh-ev"))
        return;
      const text = (_b2 = (_a2 = h3.dataset.heading) != null ? _a2 : h3.textContent) != null ? _b2 : "";
      if (/^confidential/i.test(text)) {
        const m4 = /(\d{4})-(\d{2})-(\d{2})/.exec(text);
        const from = /from (bishop [a-z]+)/i.exec(text);
        h3.addClass("sh-ev", "sh-conf");
        replaceText(h3, (f3) => {
          tile(f3, "lock", "sh-tile-lock");
          f3.createSpan({ cls: "sh-ev-date", text: m4 ? entryDate(m4[1], m4[2], m4[3]) : from ? `From ${from[1].replace(/\bbishop\b/i, "Bishop")}` : "Earlier" });
          f3.createSpan({ cls: "sh-ev-conf", text: "Confidential" });
        });
        return;
      }
      const m3 = ENTRY.exec(text);
      if (!m3)
        return;
      const { type, topic, empty } = splitEntry(m3[4]);
      const { kind, icon } = entryKind(type);
      h3.addClass("sh-ev");
      h3.dataset.kind = kind;
      if (empty)
        h3.addClass("sh-ev-empty");
      replaceText(h3, (f3) => {
        tile(f3, icon);
        f3.createSpan({ cls: "sh-ev-date", text: entryDate(m3[1], m3[2], m3[3]) });
        f3.createSpan({ cls: "sh-ev-type", text: type });
        if (topic)
          f3.createSpan({ cls: "sh-ev-topic", text: topic });
        if (empty)
          f3.createSpan({ cls: "sh-ev-none", text: "no notes" });
      });
    });
  };
}

// src/SettingsTab.ts
var import_obsidian8 = require("obsidian");
var ShepherdSettingTab = class extends import_obsidian8.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian8.Setting(containerEl).setName("Member folder").setDesc("Vault-relative folder holding member files. Files outside it get the empty panel.").addText(
      (text) => text.setPlaceholder("Church/Members").setValue(this.plugin.settings.memberDir).onChange(async (value) => {
        this.plugin.settings.memberDir = value.replace(/\/+$/, "").trim();
        await this.plugin.saveSettings();
        this.plugin.refreshView();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Dashboard path").setDesc('Note opened by the "Open Dashboard" link in the empty state.').addText(
      (text) => text.setPlaceholder("Church/_system/views/_dashboard.md").setValue(this.plugin.settings.dashboardPath).onChange(async (value) => {
        this.plugin.settings.dashboardPath = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Overdue threshold (days)").setDesc("Days without contact before a top-10 or high-priority member is flagged overdue.").addText(
      (text) => text.setPlaceholder("14").setValue(String(this.plugin.settings.overdueThreshold)).onChange(async (value) => {
        const n2 = Number(value);
        if (!Number.isFinite(n2) || n2 <= 0)
          return;
        this.plugin.settings.overdueThreshold = Math.floor(n2);
        await this.plugin.saveSettings();
        this.plugin.refreshView();
      })
    );
    new import_obsidian8.Setting(containerEl).setName("Open the panel with member notes").setDesc("Opens the Shepherd panel in the right sidebar when you open a member note and it isn\u2019t already there.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoOpenPanel).onChange(async (value) => {
        this.plugin.settings.autoOpenPanel = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/main.ts
var ShepherdPlugin = class extends import_obsidian9.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.modifyTimeout = null;
  }
  async onload() {
    console.log("Loading Shepherd");
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_SHEPHERD,
      (leaf) => new ShepherdView(leaf, this.settings)
    );
    this.addSettingTab(new ShepherdSettingTab(this.app, this));
    this.addRibbonIcon("heart", "Shepherd", () => {
      this.activateView();
    });
    this.addCommand({
      id: "open-shepherd",
      name: "Open Shepherd Panel",
      callback: () => this.activateView()
    });
    this.addCommand({
      id: "sort-who-i-know",
      name: "Who do I know? (sort members by met / not met)",
      callback: () => {
        const members = new MemberService(this.app, this.settings);
        new MetSweepModal(this.app, members, new WriteService(this.app), this.settings.memberDir).open();
      }
    });
    this.addCommand({
      id: "mark-contacted",
      name: "Mark Member Contacted Today",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || !this.isMemberFile(file))
          return false;
        if (!checking) {
          const writeService = new WriteService(this.app);
          writeService.markContacted(file).then(() => {
            var _a;
            return (_a = this.getView()) == null ? void 0 : _a.refresh(file);
          });
        }
        return true;
      }
    });
    this.addCommand({
      id: "log-interaction",
      name: "Log Interaction (open input)",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "l" }],
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || !this.isMemberFile(file))
          return false;
        if (!checking) {
          const view = this.getView();
          if (view) {
            view.triggerLogExpand();
          } else {
            this.activateView().then(() => {
              var _a;
              return (_a = this.getView()) == null ? void 0 : _a.triggerLogExpand();
            });
          }
        }
        return true;
      }
    });
    document.body.addClass("shepherd-panel-on");
    this.registerMarkdownPostProcessor(makeNoteBodyProcessor(this.app, (f3) => this.isMemberFile(f3)));
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        if (file instanceof import_obsidian9.TFile) {
          if (this.settings.autoOpenPanel && this.isMemberFile(file) && !this.getView()) {
            void this.openPanelQuietly();
          }
          if (this.isMemberFile(file)) {
            for (const ms of [150, 900])
              window.setTimeout(() => foldPanelSections(this.app.workspace, file), ms);
          }
          this.scheduleRefresh(file);
        }
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        const file = this.app.workspace.getActiveFile();
        this.scheduleRefresh(file);
      })
    );
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (!(file instanceof import_obsidian9.TFile) || !this.isMemberFile(file))
          return;
        const view = this.getView();
        if (!view)
          return;
        if (this.modifyTimeout)
          clearTimeout(this.modifyTimeout);
        this.modifyTimeout = setTimeout(() => view.refresh(file), 300);
      })
    );
  }
  async onunload() {
    console.log("Unloading Shepherd");
    document.body.removeClass("shepherd-panel-on");
  }
  isMemberFile(file) {
    return file.path.startsWith(this.settings.memberDir + "/") && file.extension === "md";
  }
  // Re-render the open panel after a settings change.
  refreshView() {
    this.scheduleRefresh(this.app.workspace.getActiveFile());
  }
  getView() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_SHEPHERD);
    for (const leaf of leaves) {
      if (leaf.view instanceof ShepherdView) {
        return leaf.view;
      }
    }
    return null;
  }
  scheduleRefresh(file) {
    const view = this.getView();
    if (!view)
      return;
    if (file && this.isMemberFile(file)) {
      view.refresh(file);
    } else {
      view.refresh();
    }
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_SHEPHERD);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_SHEPHERD, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }
  /** Create the panel in the right sidebar without taking focus from the note. */
  async openPanelQuietly() {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_SHEPHERD).length)
      return;
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf)
      return;
    await leaf.setViewState({ type: VIEW_TYPE_SHEPHERD, active: false });
    if (this.app.workspace.rightSplit.collapsed)
      this.app.workspace.rightSplit.expand();
    this.app.workspace.revealLeaf(leaf);
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
