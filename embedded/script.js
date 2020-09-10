/*
  Highlight.js 10.2.0 (da7d149b)
  License: BSD-3-Clause
  Copyright (c) 2006-2020, Ivan Sagalaev
*/
var hljs = function () {
  "use strict";

  function e(n) {
    Object.freeze(n);
    var t = "function" == typeof n;
    return Object.getOwnPropertyNames(n).forEach((function (r) {
      !Object.hasOwnProperty.call(n, r) || null === n[r] || "object" != typeof n[r] && "function" != typeof n[r] || t && ("caller" === r || "callee" === r || "arguments" === r) || Object.isFrozen(n[r]) || e(n[r])
    })), n
  }

  class n {
    constructor(e) {
      void 0 === e.data && (e.data = {}), this.data = e.data
    }

    ignoreMatch() {
      this.ignore = !0
    }
  }

  function t(e) {
    return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
  }

  function r(e, ...n) {
    var t = {};
    for (const n in e) t[n] = e[n];
    return n.forEach((function (e) {
      for (const n in e) t[n] = e[n]
    })), t
  }

  function a(e) {
    return e.nodeName.toLowerCase()
  }

  var i = Object.freeze({
    __proto__: null, escapeHTML: t, inherit: r, nodeStream: function (e) {
      var n = [];
      return function e(t, r) {
        for (var i = t.firstChild; i; i = i.nextSibling) 3 === i.nodeType ? r += i.nodeValue.length : 1 === i.nodeType && (n.push({
          event: "start",
          offset: r,
          node: i
        }), r = e(i, r), a(i).match(/br|hr|img|input/) || n.push({event: "stop", offset: r, node: i}));
        return r
      }(e, 0), n
    }, mergeStreams: function (e, n, r) {
      var i = 0, s = "", o = [];

      function l() {
        return e.length && n.length ? e[0].offset !== n[0].offset ? e[0].offset < n[0].offset ? e : n : "start" === n[0].event ? e : n : e.length ? e : n
      }

      function c(e) {
        s += "<" + a(e) + [].map.call(e.attributes, (function (e) {
          return " " + e.nodeName + '="' + t(e.value) + '"'
        })).join("") + ">"
      }

      function u(e) {
        s += "</" + a(e) + ">"
      }

      function g(e) {
        ("start" === e.event ? c : u)(e.node)
      }

      for (; e.length || n.length;) {
        var d = l();
        if (s += t(r.substring(i, d[0].offset)), i = d[0].offset, d === e) {
          o.reverse().forEach(u);
          do {
            g(d.splice(0, 1)[0]), d = l()
          } while (d === e && d.length && d[0].offset === i);
          o.reverse().forEach(c)
        } else "start" === d[0].event ? o.push(d[0].node) : o.pop(), g(d.splice(0, 1)[0])
      }
      return s + t(r.substr(i))
    }
  });
  const s = "</span>", o = e => !!e.kind;

  class l {
    constructor(e, n) {
      this.buffer = "", this.classPrefix = n.classPrefix, e.walk(this)
    }

    addText(e) {
      this.buffer += t(e)
    }

    openNode(e) {
      if (!o(e)) return;
      let n = e.kind;
      e.sublanguage || (n = `${this.classPrefix}${n}`), this.span(n)
    }

    closeNode(e) {
      o(e) && (this.buffer += s)
    }

    value() {
      return this.buffer
    }

    span(e) {
      this.buffer += `<span class="${e}">`
    }
  }

  class c {
    constructor() {
      this.rootNode = {children: []}, this.stack = [this.rootNode]
    }

    get top() {
      return this.stack[this.stack.length - 1]
    }

    get root() {
      return this.rootNode
    }

    add(e) {
      this.top.children.push(e)
    }

    openNode(e) {
      const n = {kind: e, children: []};
      this.add(n), this.stack.push(n)
    }

    closeNode() {
      if (this.stack.length > 1) return this.stack.pop()
    }

    closeAllNodes() {
      for (; this.closeNode();) ;
    }

    toJSON() {
      return JSON.stringify(this.rootNode, null, 4)
    }

    walk(e) {
      return this.constructor._walk(e, this.rootNode)
    }

    static _walk(e, n) {
      return "string" == typeof n ? e.addText(n) : n.children && (e.openNode(n), n.children.forEach(n => this._walk(e, n)), e.closeNode(n)), e
    }

    static _collapse(e) {
      "string" != typeof e && e.children && (e.children.every(e => "string" == typeof e) ? e.children = [e.children.join("")] : e.children.forEach(e => {
        c._collapse(e)
      }))
    }
  }

  class u extends c {
    constructor(e) {
      super(), this.options = e
    }

    addKeyword(e, n) {
      "" !== e && (this.openNode(n), this.addText(e), this.closeNode())
    }

    addText(e) {
      "" !== e && this.add(e)
    }

    addSublanguage(e, n) {
      const t = e.root;
      t.kind = n, t.sublanguage = !0, this.add(t)
    }

    toHTML() {
      return new l(this, this.options).value()
    }

    finalize() {
      return !0
    }
  }

  function g(e) {
    return e ? "string" == typeof e ? e : e.source : null
  }

  const d = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
    h = {begin: "\\\\[\\s\\S]", relevance: 0},
    f = {className: "string", begin: "'", end: "'", illegal: "\\n", contains: [h]},
    p = {className: "string", begin: '"', end: '"', illegal: "\\n", contains: [h]},
    m = {begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},
    b = function (e, n, t = {}) {
      var a = r({className: "comment", begin: e, end: n, contains: []}, t);
      return a.contains.push(m), a.contains.push({
        className: "doctag",
        begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
        relevance: 0
      }), a
    }, v = b("//", "$"), x = b("/\\*", "\\*/"), E = b("#", "$");
  var _ = Object.freeze({
    __proto__: null,
    IDENT_RE: "[a-zA-Z]\\w*",
    UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
    NUMBER_RE: "\\b\\d+(\\.\\d+)?",
    C_NUMBER_RE: d,
    BINARY_NUMBER_RE: "\\b(0b[01]+)",
    RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
    SHEBANG: (e = {}) => {
      const n = /^#![ ]*\//;
      return e.binary && (e.begin = function (...e) {
        return e.map(e => g(e)).join("")
      }(n, /.*\b/, e.binary, /\b.*/)), r({
        className: "meta",
        begin: n,
        end: /$/,
        relevance: 0,
        "on:begin": (e, n) => {
          0 !== e.index && n.ignoreMatch()
        }
      }, e)
    },
    BACKSLASH_ESCAPE: h,
    APOS_STRING_MODE: f,
    QUOTE_STRING_MODE: p,
    PHRASAL_WORDS_MODE: m,
    COMMENT: b,
    C_LINE_COMMENT_MODE: v,
    C_BLOCK_COMMENT_MODE: x,
    HASH_COMMENT_MODE: E,
    NUMBER_MODE: {className: "number", begin: "\\b\\d+(\\.\\d+)?", relevance: 0},
    C_NUMBER_MODE: {className: "number", begin: d, relevance: 0},
    BINARY_NUMBER_MODE: {className: "number", begin: "\\b(0b[01]+)", relevance: 0},
    CSS_NUMBER_MODE: {
      className: "number",
      begin: "\\b\\d+(\\.\\d+)?(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    },
    REGEXP_MODE: {
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        className: "regexp",
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [h, {begin: /\[/, end: /\]/, relevance: 0, contains: [h]}]
      }]
    },
    TITLE_MODE: {className: "title", begin: "[a-zA-Z]\\w*", relevance: 0},
    UNDERSCORE_TITLE_MODE: {className: "title", begin: "[a-zA-Z_]\\w*", relevance: 0},
    METHOD_GUARD: {begin: "\\.\\s*[a-zA-Z_]\\w*", relevance: 0},
    END_SAME_AS_BEGIN: function (e) {
      return Object.assign(e, {
        "on:begin": (e, n) => {
          n.data._beginMatch = e[1]
        }, "on:end": (e, n) => {
          n.data._beginMatch !== e[1] && n.ignoreMatch()
        }
      })
    }
  }), w = "of and for in not or if then".split(" ");

  function N(e, n) {
    return n ? +n : function (e) {
      return w.includes(e.toLowerCase())
    }(e) ? 0 : 1
  }

  const y = {
    props: ["language", "code", "autodetect"], data: function () {
      return {detectedLanguage: "", unknownLanguage: !1}
    }, computed: {
      className() {
        return this.unknownLanguage ? "" : "hljs " + this.detectedLanguage
      }, highlighted() {
        if (!this.autoDetect && !hljs.getLanguage(this.language)) return console.warn(`The language "${this.language}" you specified could not be found.`), this.unknownLanguage = !0, t(this.code);
        let e;
        return this.autoDetect ? (e = hljs.highlightAuto(this.code), this.detectedLanguage = e.language) : (e = hljs.highlight(this.language, this.code, this.ignoreIllegals), this.detectectLanguage = this.language), e.value
      }, autoDetect() {
        return !(this.language && (e = this.autodetect, !e && "" !== e));
        var e
      }, ignoreIllegals: () => !0
    }, render(e) {
      return e("pre", {}, [e("code", {class: this.className, domProps: {innerHTML: this.highlighted}})])
    }
  }, R = {
    install(e) {
      e.component("highlightjs", y)
    }
  }, k = t, O = r, {nodeStream: M, mergeStreams: L} = i, T = Symbol("nomatch");
  return function (t) {
    var a = [], i = Object.create(null), s = Object.create(null), o = [], l = !0, c = /(^(<[^>]+>|\t|)+|\n)/gm,
      d = "Could not find the language '{}', did you forget to load/include a language module?";
    const h = {disableAutodetect: !0, name: "Plain text", contains: []};
    var f = {
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      tabReplace: null,
      useBR: !1,
      languages: null,
      __emitter: u
    };

    function p(e) {
      return f.noHighlightRe.test(e)
    }

    function m(e, n, t, r) {
      var a = {code: n, language: e};
      S("before:highlight", a);
      var i = a.result ? a.result : b(a.language, a.code, t, r);
      return i.code = a.code, S("after:highlight", i), i
    }

    function b(e, t, a, s) {
      var o = t;

      function c(e, n) {
        var t = E.case_insensitive ? n[0].toLowerCase() : n[0];
        return Object.prototype.hasOwnProperty.call(e.keywords, t) && e.keywords[t]
      }

      function u() {
        null != R.subLanguage ? function () {
          if ("" !== L) {
            var e = null;
            if ("string" == typeof R.subLanguage) {
              if (!i[R.subLanguage]) return void M.addText(L);
              e = b(R.subLanguage, L, !0, O[R.subLanguage]), O[R.subLanguage] = e.top
            } else e = v(L, R.subLanguage.length ? R.subLanguage : null);
            R.relevance > 0 && (j += e.relevance), M.addSublanguage(e.emitter, e.language)
          }
        }() : function () {
          if (!R.keywords) return void M.addText(L);
          let e = 0;
          R.keywordPatternRe.lastIndex = 0;
          let n = R.keywordPatternRe.exec(L), t = "";
          for (; n;) {
            t += L.substring(e, n.index);
            const r = c(R, n);
            if (r) {
              const [e, a] = r;
              M.addText(t), t = "", j += a, M.addKeyword(n[0], e)
            } else t += n[0];
            e = R.keywordPatternRe.lastIndex, n = R.keywordPatternRe.exec(L)
          }
          t += L.substr(e), M.addText(t)
        }(), L = ""
      }

      function h(e) {
        return e.className && M.openNode(e.className), R = Object.create(e, {parent: {value: R}})
      }

      function p(e) {
        return 0 === R.matcher.regexIndex ? (L += e[0], 1) : (I = !0, 0)
      }

      var m = {};

      function x(t, r) {
        var i = r && r[0];
        if (L += t, null == i) return u(), 0;
        if ("begin" === m.type && "end" === r.type && m.index === r.index && "" === i) {
          if (L += o.slice(r.index, r.index + 1), !l) {
            const n = Error("0 width match regex");
            throw n.languageName = e, n.badRule = m.rule, n
          }
          return 1
        }
        if (m = r, "begin" === r.type) return function (e) {
          var t = e[0], r = e.rule;
          const a = new n(r), i = [r.__beforeBegin, r["on:begin"]];
          for (const n of i) if (n && (n(e, a), a.ignore)) return p(t);
          return r && r.endSameAsBegin && (r.endRe = RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")), r.skip ? L += t : (r.excludeBegin && (L += t), u(), r.returnBegin || r.excludeBegin || (L = t)), h(r), r.returnBegin ? 0 : t.length
        }(r);
        if ("illegal" === r.type && !a) {
          const e = Error('Illegal lexeme "' + i + '" for mode "' + (R.className || "<unnamed>") + '"');
          throw e.mode = R, e
        }
        if ("end" === r.type) {
          var s = function (e) {
            var t = e[0], r = o.substr(e.index), a = function e(t, r, a) {
              let i = function (e, n) {
                var t = e && e.exec(n);
                return t && 0 === t.index
              }(t.endRe, a);
              if (i) {
                if (t["on:end"]) {
                  const e = new n(t);
                  t["on:end"](r, e), e.ignore && (i = !1)
                }
                if (i) {
                  for (; t.endsParent && t.parent;) t = t.parent;
                  return t
                }
              }
              if (t.endsWithParent) return e(t.parent, r, a)
            }(R, e, r);
            if (!a) return T;
            var i = R;
            i.skip ? L += t : (i.returnEnd || i.excludeEnd || (L += t), u(), i.excludeEnd && (L = t));
            do {
              R.className && M.closeNode(), R.skip || R.subLanguage || (j += R.relevance), R = R.parent
            } while (R !== a.parent);
            return a.starts && (a.endSameAsBegin && (a.starts.endRe = a.endRe), h(a.starts)), i.returnEnd ? 0 : t.length
          }(r);
          if (s !== T) return s
        }
        if ("illegal" === r.type && "" === i) return 1;
        if (S > 1e5 && S > 3 * r.index) throw Error("potential infinite loop, way more iterations than matches");
        return L += i, i.length
      }

      var E = y(e);
      if (!E) throw console.error(d.replace("{}", e)), Error('Unknown language: "' + e + '"');
      var _ = function (e) {
        function n(n, t) {
          return RegExp(g(n), "m" + (e.case_insensitive ? "i" : "") + (t ? "g" : ""))
        }

        class t {
          constructor() {
            this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
          }

          addRule(e, n) {
            n.position = this.position++, this.matchIndexes[this.matchAt] = n, this.regexes.push([n, e]), this.matchAt += function (e) {
              return RegExp(e.toString() + "|").exec("").length - 1
            }(e) + 1
          }

          compile() {
            0 === this.regexes.length && (this.exec = () => null);
            const e = this.regexes.map(e => e[1]);
            this.matcherRe = n(function (e, n = "|") {
              for (var t = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./, r = 0, a = "", i = 0; i < e.length; i++) {
                var s = r += 1, o = g(e[i]);
                for (i > 0 && (a += n), a += "("; o.length > 0;) {
                  var l = t.exec(o);
                  if (null == l) {
                    a += o;
                    break
                  }
                  a += o.substring(0, l.index), o = o.substring(l.index + l[0].length), "\\" === l[0][0] && l[1] ? a += "\\" + (+l[1] + s) : (a += l[0], "(" === l[0] && r++)
                }
                a += ")"
              }
              return a
            }(e), !0), this.lastIndex = 0
          }

          exec(e) {
            this.matcherRe.lastIndex = this.lastIndex;
            const n = this.matcherRe.exec(e);
            if (!n) return null;
            const t = n.findIndex((e, n) => n > 0 && void 0 !== e), r = this.matchIndexes[t];
            return n.splice(0, t), Object.assign(n, r)
          }
        }

        class a {
          constructor() {
            this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
          }

          getMatcher(e) {
            if (this.multiRegexes[e]) return this.multiRegexes[e];
            const n = new t;
            return this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)), n.compile(), this.multiRegexes[e] = n, n
          }

          resumingScanAtSamePosition() {
            return 0 != this.regexIndex
          }

          considerAll() {
            this.regexIndex = 0
          }

          addRule(e, n) {
            this.rules.push([e, n]), "begin" === n.type && this.count++
          }

          exec(e) {
            const n = this.getMatcher(this.regexIndex);
            n.lastIndex = this.lastIndex;
            const t = n.exec(e);
            return t && (this.regexIndex += t.position + 1, this.regexIndex === this.count && (this.regexIndex = 0)), t
          }
        }

        function i(e, n) {
          const t = e.input[e.index - 1], r = e.input[e.index + e[0].length];
          "." !== t && "." !== r || n.ignoreMatch()
        }

        if (e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        return function t(s, o) {
          const l = s;
          if (s.compiled) return l;
          s.compiled = !0, s.__beforeBegin = null, s.keywords = s.keywords || s.beginKeywords;
          let c = null;
          if ("object" == typeof s.keywords && (c = s.keywords.$pattern, delete s.keywords.$pattern), s.keywords && (s.keywords = function (e, n) {
            var t = {};
            return "string" == typeof e ? r("keyword", e) : Object.keys(e).forEach((function (n) {
              r(n, e[n])
            })), t;

            function r(e, r) {
              n && (r = r.toLowerCase()), r.split(" ").forEach((function (n) {
                var r = n.split("|");
                t[r[0]] = [e, N(r[0], r[1])]
              }))
            }
          }(s.keywords, e.case_insensitive)), s.lexemes && c) throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
          return l.keywordPatternRe = n(s.lexemes || c || /\w+/, !0), o && (s.beginKeywords && (s.begin = "\\b(" + s.beginKeywords.split(" ").join("|") + ")(?=\\b|\\s)", s.__beforeBegin = i), s.begin || (s.begin = /\B|\b/), l.beginRe = n(s.begin), s.endSameAsBegin && (s.end = s.begin), s.end || s.endsWithParent || (s.end = /\B|\b/), s.end && (l.endRe = n(s.end)), l.terminator_end = g(s.end) || "", s.endsWithParent && o.terminator_end && (l.terminator_end += (s.end ? "|" : "") + o.terminator_end)), s.illegal && (l.illegalRe = n(s.illegal)), void 0 === s.relevance && (s.relevance = 1), s.contains || (s.contains = []), s.contains = [].concat(...s.contains.map((function (e) {
            return function (e) {
              return e.variants && !e.cached_variants && (e.cached_variants = e.variants.map((function (n) {
                return r(e, {variants: null}, n)
              }))), e.cached_variants ? e.cached_variants : function e(n) {
                return !!n && (n.endsWithParent || e(n.starts))
              }(e) ? r(e, {starts: e.starts ? r(e.starts) : null}) : Object.isFrozen(e) ? r(e) : e
            }("self" === e ? s : e)
          }))), s.contains.forEach((function (e) {
            t(e, l)
          })), s.starts && t(s.starts, o), l.matcher = function (e) {
            const n = new a;
            return e.contains.forEach(e => n.addRule(e.begin, {
              rule: e,
              type: "begin"
            })), e.terminator_end && n.addRule(e.terminator_end, {type: "end"}), e.illegal && n.addRule(e.illegal, {type: "illegal"}), n
          }(l), l
        }(e)
      }(E), w = "", R = s || _, O = {}, M = new f.__emitter(f);
      !function () {
        for (var e = [], n = R; n !== E; n = n.parent) n.className && e.unshift(n.className);
        e.forEach(e => M.openNode(e))
      }();
      var L = "", j = 0, A = 0, S = 0, I = !1;
      try {
        for (R.matcher.considerAll(); ;) {
          S++, I ? I = !1 : (R.matcher.lastIndex = A, R.matcher.considerAll());
          const e = R.matcher.exec(o);
          if (!e && R.matcher.resumingScanAtSamePosition()) {
            L += o[A], A += 1;
            continue
          }
          if (!e) break;
          const n = x(o.substring(A, e.index), e);
          A = e.index + n
        }
        return x(o.substr(A)), M.closeAllNodes(), M.finalize(), w = M.toHTML(), {
          relevance: j,
          value: w,
          language: e,
          illegal: !1,
          emitter: M,
          top: R
        }
      } catch (n) {
        if (n.message && n.message.includes("Illegal")) return {
          illegal: !0,
          illegalBy: {msg: n.message, context: o.slice(A - 100, A + 100), mode: n.mode},
          sofar: w,
          relevance: 0,
          value: k(o),
          emitter: M
        };
        if (l) return {illegal: !1, relevance: 0, value: k(o), emitter: M, language: e, top: R, errorRaised: n};
        throw n
      }
    }

    function v(e, n) {
      n = n || f.languages || Object.keys(i);
      var t = function (e) {
        const n = {relevance: 0, emitter: new f.__emitter(f), value: k(e), illegal: !1, top: h};
        return n.emitter.addText(e), n
      }(e), r = t;
      return n.filter(y).filter(A).forEach((function (n) {
        var a = b(n, e, !1);
        a.language = n, a.relevance > r.relevance && (r = a), a.relevance > t.relevance && (r = t, t = a)
      })), r.language && (t.second_best = r), t
    }

    function x(e) {
      return f.tabReplace || f.useBR ? e.replace(c, e => "\n" === e ? f.useBR ? "<br>" : e : f.tabReplace ? e.replace(/\t/g, f.tabReplace) : e) : e
    }

    function E(e) {
      let n = null;
      const t = function (e) {
        var n = e.className + " ";
        n += e.parentNode ? e.parentNode.className : "";
        const t = f.languageDetectRe.exec(n);
        if (t) {
          var r = y(t[1]);
          return r || (console.warn(d.replace("{}", t[1])), console.warn("Falling back to no-highlight mode for this block.", e)), r ? t[1] : "no-highlight"
        }
        return n.split(/\s+/).find(e => p(e) || y(e))
      }(e);
      if (p(t)) return;
      S("before:highlightBlock", {
        block: e,
        language: t
      }), f.useBR ? (n = document.createElement("div")).innerHTML = e.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, "\n") : n = e;
      const r = n.textContent, a = t ? m(t, r, !0) : v(r), i = M(n);
      if (i.length) {
        const e = document.createElement("div");
        e.innerHTML = a.value, a.value = L(i, M(e), r)
      }
      a.value = x(a.value), S("after:highlightBlock", {
        block: e,
        result: a
      }), e.innerHTML = a.value, e.className = function (e, n, t) {
        var r = n ? s[n] : t, a = [e.trim()];
        return e.match(/\bhljs\b/) || a.push("hljs"), e.includes(r) || a.push(r), a.join(" ").trim()
      }(e.className, t, a.language), e.result = {
        language: a.language,
        re: a.relevance,
        relavance: a.relevance
      }, a.second_best && (e.second_best = {
        language: a.second_best.language,
        re: a.second_best.relevance,
        relavance: a.second_best.relevance
      })
    }

    const w = () => {
      if (!w.called) {
        w.called = !0;
        var e = document.querySelectorAll("pre code");
        a.forEach.call(e, E)
      }
    };

    function y(e) {
      return e = (e || "").toLowerCase(), i[e] || i[s[e]]
    }

    function j(e, {languageName: n}) {
      "string" == typeof e && (e = [e]), e.forEach(e => {
        s[e] = n
      })
    }

    function A(e) {
      var n = y(e);
      return n && !n.disableAutodetect
    }

    function S(e, n) {
      var t = e;
      o.forEach((function (e) {
        e[t] && e[t](n)
      }))
    }

    Object.assign(t, {
      highlight: m, highlightAuto: v, fixMarkup: function (e) {
        return console.warn("fixMarkup is deprecated and will be removed entirely in v11.0"), console.warn("Please see https://github.com/highlightjs/highlight.js/issues/2534"), x(e)
      }, highlightBlock: E, configure: function (e) {
        f = O(f, e)
      }, initHighlighting: w, initHighlightingOnLoad: function () {
        window.addEventListener("DOMContentLoaded", w, !1)
      }, registerLanguage: function (e, n) {
        var r = null;
        try {
          r = n(t)
        } catch (n) {
          if (console.error("Language definition for '{}' could not be registered.".replace("{}", e)), !l) throw n;
          console.error(n), r = h
        }
        r.name || (r.name = e), i[e] = r, r.rawDefinition = n.bind(null, t), r.aliases && j(r.aliases, {languageName: e})
      }, listLanguages: function () {
        return Object.keys(i)
      }, getLanguage: y, registerAliases: j, requireLanguage: function (e) {
        var n = y(e);
        if (n) return n;
        throw Error("The '{}' language is required, but not loaded.".replace("{}", e))
      }, autoDetection: A, inherit: O, addPlugin: function (e) {
        o.push(e)
      }, vuePlugin: R
    }), t.debugMode = function () {
      l = !1
    }, t.safeMode = function () {
      l = !0
    }, t.versionString = "10.2.0";
    for (const n in _) "object" == typeof _[n] && e(_[n]);
    return Object.assign(t, _), t
  }({})
}();
"object" == typeof exports && "undefined" != typeof module && (module.exports = hljs);
hljs.registerLanguage("python", function () {
  "use strict";
  return function (e) {
    var n = {
        keyword: "and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10",
        built_in: "Ellipsis NotImplemented",
        literal: "False None True"
      }, a = {className: "meta", begin: /^(>>>|\.\.\.) /},
      i = {className: "subst", begin: /\{/, end: /\}/, keywords: n, illegal: /#/},
      s = {begin: /\{\{/, relevance: 0}, r = {
        className: "string",
        contains: [e.BACKSLASH_ESCAPE],
        variants: [{
          begin: /(u|b)?r?'''/,
          end: /'''/,
          contains: [e.BACKSLASH_ESCAPE, a],
          relevance: 10
        }, {
          begin: /(u|b)?r?"""/,
          end: /"""/,
          contains: [e.BACKSLASH_ESCAPE, a],
          relevance: 10
        }, {begin: /(fr|rf|f)'''/, end: /'''/, contains: [e.BACKSLASH_ESCAPE, a, s, i]}, {
          begin: /(fr|rf|f)"""/,
          end: /"""/,
          contains: [e.BACKSLASH_ESCAPE, a, s, i]
        }, {begin: /(u|r|ur)'/, end: /'/, relevance: 10}, {
          begin: /(u|r|ur)"/,
          end: /"/,
          relevance: 10
        }, {begin: /(b|br)'/, end: /'/}, {begin: /(b|br)"/, end: /"/}, {
          begin: /(fr|rf|f)'/,
          end: /'/,
          contains: [e.BACKSLASH_ESCAPE, s, i]
        }, {
          begin: /(fr|rf|f)"/,
          end: /"/,
          contains: [e.BACKSLASH_ESCAPE, s, i]
        }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
      }, l = {
        className: "number",
        relevance: 0,
        variants: [{begin: e.BINARY_NUMBER_RE + "[lLjJ]?"}, {begin: "\\b(0o[0-7]+)[lLjJ]?"}, {begin: e.C_NUMBER_RE + "[lLjJ]?"}]
      }, t = {
        className: "params",
        variants: [{begin: /\(\s*\)/, skip: !0, className: null}, {
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          contains: ["self", a, l, r, e.HASH_COMMENT_MODE]
        }]
      };
    return i.contains = [r, l, a], {
      name: "Python",
      aliases: ["py", "gyp", "ipython"],
      keywords: n,
      illegal: /(<\/|->|\?)|=>/,
      contains: [a, l, {
        beginKeywords: "if",
        relevance: 0
      }, r, e.HASH_COMMENT_MODE, {
        variants: [{className: "function", beginKeywords: "def"}, {
          className: "class",
          beginKeywords: "class"
        }],
        end: /:/,
        illegal: /[${=;\n,]/,
        contains: [e.UNDERSCORE_TITLE_MODE, t, {begin: /->/, endsWithParent: !0, keywords: "None"}]
      }, {className: "meta", begin: /^[\t ]*@/, end: /$/}, {begin: /\b(print|exec)\(/}]
    }
  }
}());
hljs.registerLanguage("python-repl", function () {
  "use strict";
  return function (n) {
    return {
      aliases: ["pycon"],
      contains: [{
        className: "meta",
        starts: {end: / |$/, starts: {end: "$", subLanguage: "python"}},
        variants: [{begin: /^>>>(?=[ ]|$)/}, {begin: /^\.\.\.(?=[ ]|$)/}]
      }]
    }
  }
}());
hljs.registerLanguage("protobuf", function () {
  "use strict";
  return function (e) {
    return {
      name: "Protocol Buffers",
      keywords: {
        keyword: "package import option optional required repeated group oneof",
        built_in: "double float int32 int64 uint32 uint64 sint32 sint64 fixed32 fixed64 sfixed32 sfixed64 bool string bytes",
        literal: "true false"
      },
      contains: [e.QUOTE_STRING_MODE, e.NUMBER_MODE, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
        className: "class",
        beginKeywords: "message enum service",
        end: /\{/,
        illegal: /\n/,
        contains: [e.inherit(e.TITLE_MODE, {starts: {endsWithParent: !0, excludeEnd: !0}})]
      }, {
        className: "function",
        beginKeywords: "rpc",
        end: /[{;]/,
        excludeEnd: !0,
        keywords: "rpc returns"
      }, {begin: /^\s*[A-Z_]+/, end: /\s*=/, excludeEnd: !0}]
    }
  }
}());
hljs.registerLanguage("c-like", function () {
  "use strict";
  return function (e) {
    function t(e) {
      return "(?:" + e + ")?"
    }

    var n = "(decltype\\(auto\\)|" + t("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + t("<.*?>") + ")",
      r = {className: "keyword", begin: "\\b[a-z\\d_]*_t\\b"}, a = {
        className: "string",
        variants: [{
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [e.BACKSLASH_ESCAPE]
        }, {
          begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
          end: "'",
          illegal: "."
        }, e.END_SAME_AS_BEGIN({begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/, end: /\)([^()\\ ]{0,16})"/})]
      }, i = {
        className: "number",
        variants: [{begin: "\\b(0b[01']+)"}, {begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"}, {begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"}],
        relevance: 0
      }, s = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {"meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"},
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, e.inherit(a, {className: "meta-string"}), {
          className: "meta-string",
          begin: /<.*?>/,
          end: /$/,
          illegal: "\\n"
        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
      }, o = {className: "title", begin: t("[a-zA-Z_]\\w*::") + e.IDENT_RE, relevance: 0},
      c = t("[a-zA-Z_]\\w*::") + e.IDENT_RE + "\\s*\\(", l = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
        literal: "true false nullptr NULL"
      }, d = [r, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, i, a], _ = {
        variants: [{begin: /=/, end: /;/}, {begin: /\(/, end: /\)/}, {
          beginKeywords: "new throw return else",
          end: /;/
        }],
        keywords: l,
        contains: d.concat([{begin: /\(/, end: /\)/, keywords: l, contains: d.concat(["self"]), relevance: 0}]),
        relevance: 0
      }, u = {
        className: "function",
        begin: "(" + n + "[\\*&\\s]+)+" + c,
        returnBegin: !0,
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: l,
        illegal: /[^\w\s\*&:<>]/,
        contains: [{begin: "decltype\\(auto\\)", keywords: l, relevance: 0}, {
          begin: c,
          returnBegin: !0,
          contains: [o],
          relevance: 0
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: l,
          relevance: 0,
          contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, a, i, r, {
            begin: /\(/,
            end: /\)/,
            keywords: l,
            relevance: 0,
            contains: ["self", e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, a, i, r]
          }]
        }, r, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, s]
      };
    return {
      aliases: ["c", "cc", "h", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
      keywords: l,
      disableAutodetect: !0,
      illegal: "</",
      contains: [].concat(_, u, d, [s, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: l,
        contains: ["self", r]
      }, {begin: e.IDENT_RE + "::", keywords: l}, {
        className: "class",
        beginKeywords: "class struct",
        end: /[{;:]/,
        contains: [{begin: /</, end: />/, contains: ["self"]}, e.TITLE_MODE]
      }]),
      exports: {preprocessor: s, strings: a, keywords: l}
    }
  }
}());
hljs.registerLanguage("pgsql", function () {
  "use strict";
  return function (E) {
    var T = E.COMMENT("--", "$"), N = "\\$([a-zA-Z_]?|[a-zA-Z_][a-zA-Z_0-9]*)\\$",
      A = "BIGINT INT8 BIGSERIAL SERIAL8 BIT VARYING VARBIT BOOLEAN BOOL BOX BYTEA CHARACTER CHAR VARCHAR CIDR CIRCLE DATE DOUBLE PRECISION FLOAT8 FLOAT INET INTEGER INT INT4 INTERVAL JSON JSONB LINE LSEG|10 MACADDR MACADDR8 MONEY NUMERIC DEC DECIMAL PATH POINT POLYGON REAL FLOAT4 SMALLINT INT2 SMALLSERIAL|10 SERIAL2|10 SERIAL|10 SERIAL4|10 TEXT TIME ZONE TIMETZ|10 TIMESTAMP TIMESTAMPTZ|10 TSQUERY|10 TSVECTOR|10 TXID_SNAPSHOT|10 UUID XML NATIONAL NCHAR INT4RANGE|10 INT8RANGE|10 NUMRANGE|10 TSRANGE|10 TSTZRANGE|10 DATERANGE|10 ANYELEMENT ANYARRAY ANYNONARRAY ANYENUM ANYRANGE CSTRING INTERNAL RECORD PG_DDL_COMMAND VOID UNKNOWN OPAQUE REFCURSOR NAME OID REGPROC|10 REGPROCEDURE|10 REGOPER|10 REGOPERATOR|10 REGCLASS|10 REGTYPE|10 REGROLE|10 REGNAMESPACE|10 REGCONFIG|10 REGDICTIONARY|10 ",
      R = A.trim().split(" ").map((function (E) {
        return E.split("|")[0]
      })).join("|"),
      I = "ARRAY_AGG AVG BIT_AND BIT_OR BOOL_AND BOOL_OR COUNT EVERY JSON_AGG JSONB_AGG JSON_OBJECT_AGG JSONB_OBJECT_AGG MAX MIN MODE STRING_AGG SUM XMLAGG CORR COVAR_POP COVAR_SAMP REGR_AVGX REGR_AVGY REGR_COUNT REGR_INTERCEPT REGR_R2 REGR_SLOPE REGR_SXX REGR_SXY REGR_SYY STDDEV STDDEV_POP STDDEV_SAMP VARIANCE VAR_POP VAR_SAMP PERCENTILE_CONT PERCENTILE_DISC ROW_NUMBER RANK DENSE_RANK PERCENT_RANK CUME_DIST NTILE LAG LEAD FIRST_VALUE LAST_VALUE NTH_VALUE NUM_NONNULLS NUM_NULLS ABS CBRT CEIL CEILING DEGREES DIV EXP FLOOR LN LOG MOD PI POWER RADIANS ROUND SCALE SIGN SQRT TRUNC WIDTH_BUCKET RANDOM SETSEED ACOS ACOSD ASIN ASIND ATAN ATAND ATAN2 ATAN2D COS COSD COT COTD SIN SIND TAN TAND BIT_LENGTH CHAR_LENGTH CHARACTER_LENGTH LOWER OCTET_LENGTH OVERLAY POSITION SUBSTRING TREAT TRIM UPPER ASCII BTRIM CHR CONCAT CONCAT_WS CONVERT CONVERT_FROM CONVERT_TO DECODE ENCODE INITCAP LEFT LENGTH LPAD LTRIM MD5 PARSE_IDENT PG_CLIENT_ENCODING QUOTE_IDENT|10 QUOTE_LITERAL|10 QUOTE_NULLABLE|10 REGEXP_MATCH REGEXP_MATCHES REGEXP_REPLACE REGEXP_SPLIT_TO_ARRAY REGEXP_SPLIT_TO_TABLE REPEAT REPLACE REVERSE RIGHT RPAD RTRIM SPLIT_PART STRPOS SUBSTR TO_ASCII TO_HEX TRANSLATE OCTET_LENGTH GET_BIT GET_BYTE SET_BIT SET_BYTE TO_CHAR TO_DATE TO_NUMBER TO_TIMESTAMP AGE CLOCK_TIMESTAMP|10 DATE_PART DATE_TRUNC ISFINITE JUSTIFY_DAYS JUSTIFY_HOURS JUSTIFY_INTERVAL MAKE_DATE MAKE_INTERVAL|10 MAKE_TIME MAKE_TIMESTAMP|10 MAKE_TIMESTAMPTZ|10 NOW STATEMENT_TIMESTAMP|10 TIMEOFDAY TRANSACTION_TIMESTAMP|10 ENUM_FIRST ENUM_LAST ENUM_RANGE AREA CENTER DIAMETER HEIGHT ISCLOSED ISOPEN NPOINTS PCLOSE POPEN RADIUS WIDTH BOX BOUND_BOX CIRCLE LINE LSEG PATH POLYGON ABBREV BROADCAST HOST HOSTMASK MASKLEN NETMASK NETWORK SET_MASKLEN TEXT INET_SAME_FAMILY INET_MERGE MACADDR8_SET7BIT ARRAY_TO_TSVECTOR GET_CURRENT_TS_CONFIG NUMNODE PLAINTO_TSQUERY PHRASETO_TSQUERY WEBSEARCH_TO_TSQUERY QUERYTREE SETWEIGHT STRIP TO_TSQUERY TO_TSVECTOR JSON_TO_TSVECTOR JSONB_TO_TSVECTOR TS_DELETE TS_FILTER TS_HEADLINE TS_RANK TS_RANK_CD TS_REWRITE TSQUERY_PHRASE TSVECTOR_TO_ARRAY TSVECTOR_UPDATE_TRIGGER TSVECTOR_UPDATE_TRIGGER_COLUMN XMLCOMMENT XMLCONCAT XMLELEMENT XMLFOREST XMLPI XMLROOT XMLEXISTS XML_IS_WELL_FORMED XML_IS_WELL_FORMED_DOCUMENT XML_IS_WELL_FORMED_CONTENT XPATH XPATH_EXISTS XMLTABLE XMLNAMESPACES TABLE_TO_XML TABLE_TO_XMLSCHEMA TABLE_TO_XML_AND_XMLSCHEMA QUERY_TO_XML QUERY_TO_XMLSCHEMA QUERY_TO_XML_AND_XMLSCHEMA CURSOR_TO_XML CURSOR_TO_XMLSCHEMA SCHEMA_TO_XML SCHEMA_TO_XMLSCHEMA SCHEMA_TO_XML_AND_XMLSCHEMA DATABASE_TO_XML DATABASE_TO_XMLSCHEMA DATABASE_TO_XML_AND_XMLSCHEMA XMLATTRIBUTES TO_JSON TO_JSONB ARRAY_TO_JSON ROW_TO_JSON JSON_BUILD_ARRAY JSONB_BUILD_ARRAY JSON_BUILD_OBJECT JSONB_BUILD_OBJECT JSON_OBJECT JSONB_OBJECT JSON_ARRAY_LENGTH JSONB_ARRAY_LENGTH JSON_EACH JSONB_EACH JSON_EACH_TEXT JSONB_EACH_TEXT JSON_EXTRACT_PATH JSONB_EXTRACT_PATH JSON_OBJECT_KEYS JSONB_OBJECT_KEYS JSON_POPULATE_RECORD JSONB_POPULATE_RECORD JSON_POPULATE_RECORDSET JSONB_POPULATE_RECORDSET JSON_ARRAY_ELEMENTS JSONB_ARRAY_ELEMENTS JSON_ARRAY_ELEMENTS_TEXT JSONB_ARRAY_ELEMENTS_TEXT JSON_TYPEOF JSONB_TYPEOF JSON_TO_RECORD JSONB_TO_RECORD JSON_TO_RECORDSET JSONB_TO_RECORDSET JSON_STRIP_NULLS JSONB_STRIP_NULLS JSONB_SET JSONB_INSERT JSONB_PRETTY CURRVAL LASTVAL NEXTVAL SETVAL COALESCE NULLIF GREATEST LEAST ARRAY_APPEND ARRAY_CAT ARRAY_NDIMS ARRAY_DIMS ARRAY_FILL ARRAY_LENGTH ARRAY_LOWER ARRAY_POSITION ARRAY_POSITIONS ARRAY_PREPEND ARRAY_REMOVE ARRAY_REPLACE ARRAY_TO_STRING ARRAY_UPPER CARDINALITY STRING_TO_ARRAY UNNEST ISEMPTY LOWER_INC UPPER_INC LOWER_INF UPPER_INF RANGE_MERGE GENERATE_SERIES GENERATE_SUBSCRIPTS CURRENT_DATABASE CURRENT_QUERY CURRENT_SCHEMA|10 CURRENT_SCHEMAS|10 INET_CLIENT_ADDR INET_CLIENT_PORT INET_SERVER_ADDR INET_SERVER_PORT ROW_SECURITY_ACTIVE FORMAT_TYPE TO_REGCLASS TO_REGPROC TO_REGPROCEDURE TO_REGOPER TO_REGOPERATOR TO_REGTYPE TO_REGNAMESPACE TO_REGROLE COL_DESCRIPTION OBJ_DESCRIPTION SHOBJ_DESCRIPTION TXID_CURRENT TXID_CURRENT_IF_ASSIGNED TXID_CURRENT_SNAPSHOT TXID_SNAPSHOT_XIP TXID_SNAPSHOT_XMAX TXID_SNAPSHOT_XMIN TXID_VISIBLE_IN_SNAPSHOT TXID_STATUS CURRENT_SETTING SET_CONFIG BRIN_SUMMARIZE_NEW_VALUES BRIN_SUMMARIZE_RANGE BRIN_DESUMMARIZE_RANGE GIN_CLEAN_PENDING_LIST SUPPRESS_REDUNDANT_UPDATES_TRIGGER LO_FROM_BYTEA LO_PUT LO_GET LO_CREAT LO_CREATE LO_UNLINK LO_IMPORT LO_EXPORT LOREAD LOWRITE GROUPING CAST".split(" ").map((function (E) {
        return E.split("|")[0]
      })).join("|");
    return {
      name: "PostgreSQL", aliases: ["postgres", "postgresql"], case_insensitive: !0, keywords: {
        keyword: "ABORT ALTER ANALYZE BEGIN CALL CHECKPOINT|10 CLOSE CLUSTER COMMENT COMMIT COPY CREATE DEALLOCATE DECLARE DELETE DISCARD DO DROP END EXECUTE EXPLAIN FETCH GRANT IMPORT INSERT LISTEN LOAD LOCK MOVE NOTIFY PREPARE REASSIGN|10 REFRESH REINDEX RELEASE RESET REVOKE ROLLBACK SAVEPOINT SECURITY SELECT SET SHOW START TRUNCATE UNLISTEN|10 UPDATE VACUUM|10 VALUES AGGREGATE COLLATION CONVERSION|10 DATABASE DEFAULT PRIVILEGES DOMAIN TRIGGER EXTENSION FOREIGN WRAPPER|10 TABLE FUNCTION GROUP LANGUAGE LARGE OBJECT MATERIALIZED VIEW OPERATOR CLASS FAMILY POLICY PUBLICATION|10 ROLE RULE SCHEMA SEQUENCE SERVER STATISTICS SUBSCRIPTION SYSTEM TABLESPACE CONFIGURATION DICTIONARY PARSER TEMPLATE TYPE USER MAPPING PREPARED ACCESS METHOD CAST AS TRANSFORM TRANSACTION OWNED TO INTO SESSION AUTHORIZATION INDEX PROCEDURE ASSERTION ALL ANALYSE AND ANY ARRAY ASC ASYMMETRIC|10 BOTH CASE CHECK COLLATE COLUMN CONCURRENTLY|10 CONSTRAINT CROSS DEFERRABLE RANGE DESC DISTINCT ELSE EXCEPT FOR FREEZE|10 FROM FULL HAVING ILIKE IN INITIALLY INNER INTERSECT IS ISNULL JOIN LATERAL LEADING LIKE LIMIT NATURAL NOT NOTNULL NULL OFFSET ON ONLY OR ORDER OUTER OVERLAPS PLACING PRIMARY REFERENCES RETURNING SIMILAR SOME SYMMETRIC TABLESAMPLE THEN TRAILING UNION UNIQUE USING VARIADIC|10 VERBOSE WHEN WHERE WINDOW WITH BY RETURNS INOUT OUT SETOF|10 IF STRICT CURRENT CONTINUE OWNER LOCATION OVER PARTITION WITHIN BETWEEN ESCAPE EXTERNAL INVOKER DEFINER WORK RENAME VERSION CONNECTION CONNECT TABLES TEMP TEMPORARY FUNCTIONS SEQUENCES TYPES SCHEMAS OPTION CASCADE RESTRICT ADD ADMIN EXISTS VALID VALIDATE ENABLE DISABLE REPLICA|10 ALWAYS PASSING COLUMNS PATH REF VALUE OVERRIDING IMMUTABLE STABLE VOLATILE BEFORE AFTER EACH ROW PROCEDURAL ROUTINE NO HANDLER VALIDATOR OPTIONS STORAGE OIDS|10 WITHOUT INHERIT DEPENDS CALLED INPUT LEAKPROOF|10 COST ROWS NOWAIT SEARCH UNTIL ENCRYPTED|10 PASSWORD CONFLICT|10 INSTEAD INHERITS CHARACTERISTICS WRITE CURSOR ALSO STATEMENT SHARE EXCLUSIVE INLINE ISOLATION REPEATABLE READ COMMITTED SERIALIZABLE UNCOMMITTED LOCAL GLOBAL SQL PROCEDURES RECURSIVE SNAPSHOT ROLLUP CUBE TRUSTED|10 INCLUDE FOLLOWING PRECEDING UNBOUNDED RANGE GROUPS UNENCRYPTED|10 SYSID FORMAT DELIMITER HEADER QUOTE ENCODING FILTER OFF FORCE_QUOTE FORCE_NOT_NULL FORCE_NULL COSTS BUFFERS TIMING SUMMARY DISABLE_PAGE_SKIPPING RESTART CYCLE GENERATED IDENTITY DEFERRED IMMEDIATE LEVEL LOGGED UNLOGGED OF NOTHING NONE EXCLUDE ATTRIBUTE USAGE ROUTINES TRUE FALSE NAN INFINITY ALIAS BEGIN CONSTANT DECLARE END EXCEPTION RETURN PERFORM|10 RAISE GET DIAGNOSTICS STACKED|10 FOREACH LOOP ELSIF EXIT WHILE REVERSE SLICE DEBUG LOG INFO NOTICE WARNING ASSERT OPEN SUPERUSER NOSUPERUSER CREATEDB NOCREATEDB CREATEROLE NOCREATEROLE INHERIT NOINHERIT LOGIN NOLOGIN REPLICATION NOREPLICATION BYPASSRLS NOBYPASSRLS ",
        built_in: "CURRENT_TIME CURRENT_TIMESTAMP CURRENT_USER CURRENT_CATALOG|10 CURRENT_DATE LOCALTIME LOCALTIMESTAMP CURRENT_ROLE|10 CURRENT_SCHEMA|10 SESSION_USER PUBLIC FOUND NEW OLD TG_NAME|10 TG_WHEN|10 TG_LEVEL|10 TG_OP|10 TG_RELID|10 TG_RELNAME|10 TG_TABLE_NAME|10 TG_TABLE_SCHEMA|10 TG_NARGS|10 TG_ARGV|10 TG_EVENT|10 TG_TAG|10 ROW_COUNT RESULT_OID|10 PG_CONTEXT|10 RETURNED_SQLSTATE COLUMN_NAME CONSTRAINT_NAME PG_DATATYPE_NAME|10 MESSAGE_TEXT TABLE_NAME SCHEMA_NAME PG_EXCEPTION_DETAIL|10 PG_EXCEPTION_HINT|10 PG_EXCEPTION_CONTEXT|10 SQLSTATE SQLERRM|10 SUCCESSFUL_COMPLETION WARNING DYNAMIC_RESULT_SETS_RETURNED IMPLICIT_ZERO_BIT_PADDING NULL_VALUE_ELIMINATED_IN_SET_FUNCTION PRIVILEGE_NOT_GRANTED PRIVILEGE_NOT_REVOKED STRING_DATA_RIGHT_TRUNCATION DEPRECATED_FEATURE NO_DATA NO_ADDITIONAL_DYNAMIC_RESULT_SETS_RETURNED SQL_STATEMENT_NOT_YET_COMPLETE CONNECTION_EXCEPTION CONNECTION_DOES_NOT_EXIST CONNECTION_FAILURE SQLCLIENT_UNABLE_TO_ESTABLISH_SQLCONNECTION SQLSERVER_REJECTED_ESTABLISHMENT_OF_SQLCONNECTION TRANSACTION_RESOLUTION_UNKNOWN PROTOCOL_VIOLATION TRIGGERED_ACTION_EXCEPTION FEATURE_NOT_SUPPORTED INVALID_TRANSACTION_INITIATION LOCATOR_EXCEPTION INVALID_LOCATOR_SPECIFICATION INVALID_GRANTOR INVALID_GRANT_OPERATION INVALID_ROLE_SPECIFICATION DIAGNOSTICS_EXCEPTION STACKED_DIAGNOSTICS_ACCESSED_WITHOUT_ACTIVE_HANDLER CASE_NOT_FOUND CARDINALITY_VIOLATION DATA_EXCEPTION ARRAY_SUBSCRIPT_ERROR CHARACTER_NOT_IN_REPERTOIRE DATETIME_FIELD_OVERFLOW DIVISION_BY_ZERO ERROR_IN_ASSIGNMENT ESCAPE_CHARACTER_CONFLICT INDICATOR_OVERFLOW INTERVAL_FIELD_OVERFLOW INVALID_ARGUMENT_FOR_LOGARITHM INVALID_ARGUMENT_FOR_NTILE_FUNCTION INVALID_ARGUMENT_FOR_NTH_VALUE_FUNCTION INVALID_ARGUMENT_FOR_POWER_FUNCTION INVALID_ARGUMENT_FOR_WIDTH_BUCKET_FUNCTION INVALID_CHARACTER_VALUE_FOR_CAST INVALID_DATETIME_FORMAT INVALID_ESCAPE_CHARACTER INVALID_ESCAPE_OCTET INVALID_ESCAPE_SEQUENCE NONSTANDARD_USE_OF_ESCAPE_CHARACTER INVALID_INDICATOR_PARAMETER_VALUE INVALID_PARAMETER_VALUE INVALID_REGULAR_EXPRESSION INVALID_ROW_COUNT_IN_LIMIT_CLAUSE INVALID_ROW_COUNT_IN_RESULT_OFFSET_CLAUSE INVALID_TABLESAMPLE_ARGUMENT INVALID_TABLESAMPLE_REPEAT INVALID_TIME_ZONE_DISPLACEMENT_VALUE INVALID_USE_OF_ESCAPE_CHARACTER MOST_SPECIFIC_TYPE_MISMATCH NULL_VALUE_NOT_ALLOWED NULL_VALUE_NO_INDICATOR_PARAMETER NUMERIC_VALUE_OUT_OF_RANGE SEQUENCE_GENERATOR_LIMIT_EXCEEDED STRING_DATA_LENGTH_MISMATCH STRING_DATA_RIGHT_TRUNCATION SUBSTRING_ERROR TRIM_ERROR UNTERMINATED_C_STRING ZERO_LENGTH_CHARACTER_STRING FLOATING_POINT_EXCEPTION INVALID_TEXT_REPRESENTATION INVALID_BINARY_REPRESENTATION BAD_COPY_FILE_FORMAT UNTRANSLATABLE_CHARACTER NOT_AN_XML_DOCUMENT INVALID_XML_DOCUMENT INVALID_XML_CONTENT INVALID_XML_COMMENT INVALID_XML_PROCESSING_INSTRUCTION INTEGRITY_CONSTRAINT_VIOLATION RESTRICT_VIOLATION NOT_NULL_VIOLATION FOREIGN_KEY_VIOLATION UNIQUE_VIOLATION CHECK_VIOLATION EXCLUSION_VIOLATION INVALID_CURSOR_STATE INVALID_TRANSACTION_STATE ACTIVE_SQL_TRANSACTION BRANCH_TRANSACTION_ALREADY_ACTIVE HELD_CURSOR_REQUIRES_SAME_ISOLATION_LEVEL INAPPROPRIATE_ACCESS_MODE_FOR_BRANCH_TRANSACTION INAPPROPRIATE_ISOLATION_LEVEL_FOR_BRANCH_TRANSACTION NO_ACTIVE_SQL_TRANSACTION_FOR_BRANCH_TRANSACTION READ_ONLY_SQL_TRANSACTION SCHEMA_AND_DATA_STATEMENT_MIXING_NOT_SUPPORTED NO_ACTIVE_SQL_TRANSACTION IN_FAILED_SQL_TRANSACTION IDLE_IN_TRANSACTION_SESSION_TIMEOUT INVALID_SQL_STATEMENT_NAME TRIGGERED_DATA_CHANGE_VIOLATION INVALID_AUTHORIZATION_SPECIFICATION INVALID_PASSWORD DEPENDENT_PRIVILEGE_DESCRIPTORS_STILL_EXIST DEPENDENT_OBJECTS_STILL_EXIST INVALID_TRANSACTION_TERMINATION SQL_ROUTINE_EXCEPTION FUNCTION_EXECUTED_NO_RETURN_STATEMENT MODIFYING_SQL_DATA_NOT_PERMITTED PROHIBITED_SQL_STATEMENT_ATTEMPTED READING_SQL_DATA_NOT_PERMITTED INVALID_CURSOR_NAME EXTERNAL_ROUTINE_EXCEPTION CONTAINING_SQL_NOT_PERMITTED MODIFYING_SQL_DATA_NOT_PERMITTED PROHIBITED_SQL_STATEMENT_ATTEMPTED READING_SQL_DATA_NOT_PERMITTED EXTERNAL_ROUTINE_INVOCATION_EXCEPTION INVALID_SQLSTATE_RETURNED NULL_VALUE_NOT_ALLOWED TRIGGER_PROTOCOL_VIOLATED SRF_PROTOCOL_VIOLATED EVENT_TRIGGER_PROTOCOL_VIOLATED SAVEPOINT_EXCEPTION INVALID_SAVEPOINT_SPECIFICATION INVALID_CATALOG_NAME INVALID_SCHEMA_NAME TRANSACTION_ROLLBACK TRANSACTION_INTEGRITY_CONSTRAINT_VIOLATION SERIALIZATION_FAILURE STATEMENT_COMPLETION_UNKNOWN DEADLOCK_DETECTED SYNTAX_ERROR_OR_ACCESS_RULE_VIOLATION SYNTAX_ERROR INSUFFICIENT_PRIVILEGE CANNOT_COERCE GROUPING_ERROR WINDOWING_ERROR INVALID_RECURSION INVALID_FOREIGN_KEY INVALID_NAME NAME_TOO_LONG RESERVED_NAME DATATYPE_MISMATCH INDETERMINATE_DATATYPE COLLATION_MISMATCH INDETERMINATE_COLLATION WRONG_OBJECT_TYPE GENERATED_ALWAYS UNDEFINED_COLUMN UNDEFINED_FUNCTION UNDEFINED_TABLE UNDEFINED_PARAMETER UNDEFINED_OBJECT DUPLICATE_COLUMN DUPLICATE_CURSOR DUPLICATE_DATABASE DUPLICATE_FUNCTION DUPLICATE_PREPARED_STATEMENT DUPLICATE_SCHEMA DUPLICATE_TABLE DUPLICATE_ALIAS DUPLICATE_OBJECT AMBIGUOUS_COLUMN AMBIGUOUS_FUNCTION AMBIGUOUS_PARAMETER AMBIGUOUS_ALIAS INVALID_COLUMN_REFERENCE INVALID_COLUMN_DEFINITION INVALID_CURSOR_DEFINITION INVALID_DATABASE_DEFINITION INVALID_FUNCTION_DEFINITION INVALID_PREPARED_STATEMENT_DEFINITION INVALID_SCHEMA_DEFINITION INVALID_TABLE_DEFINITION INVALID_OBJECT_DEFINITION WITH_CHECK_OPTION_VIOLATION INSUFFICIENT_RESOURCES DISK_FULL OUT_OF_MEMORY TOO_MANY_CONNECTIONS CONFIGURATION_LIMIT_EXCEEDED PROGRAM_LIMIT_EXCEEDED STATEMENT_TOO_COMPLEX TOO_MANY_COLUMNS TOO_MANY_ARGUMENTS OBJECT_NOT_IN_PREREQUISITE_STATE OBJECT_IN_USE CANT_CHANGE_RUNTIME_PARAM LOCK_NOT_AVAILABLE OPERATOR_INTERVENTION QUERY_CANCELED ADMIN_SHUTDOWN CRASH_SHUTDOWN CANNOT_CONNECT_NOW DATABASE_DROPPED SYSTEM_ERROR IO_ERROR UNDEFINED_FILE DUPLICATE_FILE SNAPSHOT_TOO_OLD CONFIG_FILE_ERROR LOCK_FILE_EXISTS FDW_ERROR FDW_COLUMN_NAME_NOT_FOUND FDW_DYNAMIC_PARAMETER_VALUE_NEEDED FDW_FUNCTION_SEQUENCE_ERROR FDW_INCONSISTENT_DESCRIPTOR_INFORMATION FDW_INVALID_ATTRIBUTE_VALUE FDW_INVALID_COLUMN_NAME FDW_INVALID_COLUMN_NUMBER FDW_INVALID_DATA_TYPE FDW_INVALID_DATA_TYPE_DESCRIPTORS FDW_INVALID_DESCRIPTOR_FIELD_IDENTIFIER FDW_INVALID_HANDLE FDW_INVALID_OPTION_INDEX FDW_INVALID_OPTION_NAME FDW_INVALID_STRING_LENGTH_OR_BUFFER_LENGTH FDW_INVALID_STRING_FORMAT FDW_INVALID_USE_OF_NULL_POINTER FDW_TOO_MANY_HANDLES FDW_OUT_OF_MEMORY FDW_NO_SCHEMAS FDW_OPTION_NAME_NOT_FOUND FDW_REPLY_HANDLE FDW_SCHEMA_NOT_FOUND FDW_TABLE_NOT_FOUND FDW_UNABLE_TO_CREATE_EXECUTION FDW_UNABLE_TO_CREATE_REPLY FDW_UNABLE_TO_ESTABLISH_CONNECTION PLPGSQL_ERROR RAISE_EXCEPTION NO_DATA_FOUND TOO_MANY_ROWS ASSERT_FAILURE INTERNAL_ERROR DATA_CORRUPTED INDEX_CORRUPTED "
      }, illegal: /:==|\W\s*\(\*|(^|\s)\$[a-z]|{{|[a-z]:\s*$|\.\.\.|TO:|DO:/, contains: [{
        className: "keyword",
        variants: [{begin: /\bTEXT\s*SEARCH\b/}, {begin: /\b(PRIMARY|FOREIGN|FOR(\s+NO)?)\s+KEY\b/}, {begin: /\bPARALLEL\s+(UNSAFE|RESTRICTED|SAFE)\b/}, {begin: /\bSTORAGE\s+(PLAIN|EXTERNAL|EXTENDED|MAIN)\b/}, {begin: /\bMATCH\s+(FULL|PARTIAL|SIMPLE)\b/}, {begin: /\bNULLS\s+(FIRST|LAST)\b/}, {begin: /\bEVENT\s+TRIGGER\b/}, {begin: /\b(MAPPING|OR)\s+REPLACE\b/}, {begin: /\b(FROM|TO)\s+(PROGRAM|STDIN|STDOUT)\b/}, {begin: /\b(SHARE|EXCLUSIVE)\s+MODE\b/}, {begin: /\b(LEFT|RIGHT)\s+(OUTER\s+)?JOIN\b/}, {begin: /\b(FETCH|MOVE)\s+(NEXT|PRIOR|FIRST|LAST|ABSOLUTE|RELATIVE|FORWARD|BACKWARD)\b/}, {begin: /\bPRESERVE\s+ROWS\b/}, {begin: /\bDISCARD\s+PLANS\b/}, {begin: /\bREFERENCING\s+(OLD|NEW)\b/}, {begin: /\bSKIP\s+LOCKED\b/}, {begin: /\bGROUPING\s+SETS\b/}, {begin: /\b(BINARY|INSENSITIVE|SCROLL|NO\s+SCROLL)\s+(CURSOR|FOR)\b/}, {begin: /\b(WITH|WITHOUT)\s+HOLD\b/}, {begin: /\bWITH\s+(CASCADED|LOCAL)\s+CHECK\s+OPTION\b/}, {begin: /\bEXCLUDE\s+(TIES|NO\s+OTHERS)\b/}, {begin: /\bFORMAT\s+(TEXT|XML|JSON|YAML)\b/}, {begin: /\bSET\s+((SESSION|LOCAL)\s+)?NAMES\b/}, {begin: /\bIS\s+(NOT\s+)?UNKNOWN\b/}, {begin: /\bSECURITY\s+LABEL\b/}, {begin: /\bSTANDALONE\s+(YES|NO|NO\s+VALUE)\b/}, {begin: /\bWITH\s+(NO\s+)?DATA\b/}, {begin: /\b(FOREIGN|SET)\s+DATA\b/}, {begin: /\bSET\s+(CATALOG|CONSTRAINTS)\b/}, {begin: /\b(WITH|FOR)\s+ORDINALITY\b/}, {begin: /\bIS\s+(NOT\s+)?DOCUMENT\b/}, {begin: /\bXML\s+OPTION\s+(DOCUMENT|CONTENT)\b/}, {begin: /\b(STRIP|PRESERVE)\s+WHITESPACE\b/}, {begin: /\bNO\s+(ACTION|MAXVALUE|MINVALUE)\b/}, {begin: /\bPARTITION\s+BY\s+(RANGE|LIST|HASH)\b/}, {begin: /\bAT\s+TIME\s+ZONE\b/}, {begin: /\bGRANTED\s+BY\b/}, {begin: /\bRETURN\s+(QUERY|NEXT)\b/}, {begin: /\b(ATTACH|DETACH)\s+PARTITION\b/}, {begin: /\bFORCE\s+ROW\s+LEVEL\s+SECURITY\b/}, {begin: /\b(INCLUDING|EXCLUDING)\s+(COMMENTS|CONSTRAINTS|DEFAULTS|IDENTITY|INDEXES|STATISTICS|STORAGE|ALL)\b/}, {begin: /\bAS\s+(ASSIGNMENT|IMPLICIT|PERMISSIVE|RESTRICTIVE|ENUM|RANGE)\b/}]
      }, {begin: /\b(FORMAT|FAMILY|VERSION)\s*\(/}, {
        begin: /\bINCLUDE\s*\(/,
        keywords: "INCLUDE"
      }, {begin: /\bRANGE(?!\s*(BETWEEN|UNBOUNDED|CURRENT|[-0-9]+))/}, {begin: /\b(VERSION|OWNER|TEMPLATE|TABLESPACE|CONNECTION\s+LIMIT|PROCEDURE|RESTRICT|JOIN|PARSER|COPY|START|END|COLLATION|INPUT|ANALYZE|STORAGE|LIKE|DEFAULT|DELIMITER|ENCODING|COLUMN|CONSTRAINT|TABLE|SCHEMA)\s*=/}, {
        begin: /\b(PG_\w+?|HAS_[A-Z_]+_PRIVILEGE)\b/,
        relevance: 10
      }, {
        begin: /\bEXTRACT\s*\(/,
        end: /\bFROM\b/,
        returnEnd: !0,
        keywords: {type: "CENTURY DAY DECADE DOW DOY EPOCH HOUR ISODOW ISOYEAR MICROSECONDS MILLENNIUM MILLISECONDS MINUTE MONTH QUARTER SECOND TIMEZONE TIMEZONE_HOUR TIMEZONE_MINUTE WEEK YEAR"}
      }, {
        begin: /\b(XMLELEMENT|XMLPI)\s*\(\s*NAME/,
        keywords: {keyword: "NAME"}
      }, {
        begin: /\b(XMLPARSE|XMLSERIALIZE)\s*\(\s*(DOCUMENT|CONTENT)/,
        keywords: {keyword: "DOCUMENT CONTENT"}
      }, {
        beginKeywords: "CACHE INCREMENT MAXVALUE MINVALUE",
        end: E.C_NUMBER_RE,
        returnEnd: !0,
        keywords: "BY CACHE INCREMENT MAXVALUE MINVALUE"
      }, {className: "type", begin: /\b(WITH|WITHOUT)\s+TIME\s+ZONE\b/}, {
        className: "type",
        begin: /\bINTERVAL\s+(YEAR|MONTH|DAY|HOUR|MINUTE|SECOND)(\s+TO\s+(MONTH|HOUR|MINUTE|SECOND))?\b/
      }, {
        begin: /\bRETURNS\s+(LANGUAGE_HANDLER|TRIGGER|EVENT_TRIGGER|FDW_HANDLER|INDEX_AM_HANDLER|TSM_HANDLER)\b/,
        keywords: {
          keyword: "RETURNS",
          type: "LANGUAGE_HANDLER TRIGGER EVENT_TRIGGER FDW_HANDLER INDEX_AM_HANDLER TSM_HANDLER"
        }
      }, {begin: "\\b(" + I + ")\\s*\\("}, {begin: "\\.(" + R + ")\\b"}, {
        begin: "\\b(" + R + ")\\s+PATH\\b",
        keywords: {keyword: "PATH", type: A.replace("PATH ", "")}
      }, {className: "type", begin: "\\b(" + R + ")\\b"}, {
        className: "string",
        begin: "'",
        end: "'",
        contains: [{begin: "''"}]
      }, {
        className: "string",
        begin: "(e|E|u&|U&)'",
        end: "'",
        contains: [{begin: "\\\\."}],
        relevance: 10
      }, E.END_SAME_AS_BEGIN({
        begin: N,
        end: N,
        contains: [{
          subLanguage: ["pgsql", "perl", "python", "tcl", "r", "lua", "java", "php", "ruby", "bash", "scheme", "xml", "json"],
          endsWithParent: !0
        }]
      }), {
        begin: '"',
        end: '"',
        contains: [{begin: '""'}]
      }, E.C_NUMBER_MODE, E.C_BLOCK_COMMENT_MODE, T, {
        className: "meta",
        variants: [{begin: "%(ROW)?TYPE", relevance: 10}, {begin: "\\$\\d+"}, {begin: "^#\\w", end: "$"}]
      }, {className: "symbol", begin: "<<\\s*[a-zA-Z_][a-zA-Z_0-9$]*\\s*>>", relevance: 10}]
    }
  }
}());
hljs.registerLanguage("gradle", function () {
  "use strict";
  return function (e) {
    return {
      name: "Gradle",
      case_insensitive: !0,
      keywords: {keyword: "task project allprojects subprojects artifacts buildscript configurations dependencies repositories sourceSets description delete from into include exclude source classpath destinationDir includes options sourceCompatibility targetCompatibility group flatDir doLast doFirst flatten todir fromdir ant def abstract break case catch continue default do else extends final finally for if implements instanceof native new private protected public return static switch synchronized throw throws transient try volatile while strictfp package import false null super this true antlrtask checkstyle codenarc copy boolean byte char class double float int interface long short void compile runTime file fileTree abs any append asList asWritable call collect compareTo count div dump each eachByte eachFile eachLine every find findAll flatten getAt getErr getIn getOut getText grep immutable inject inspect intersect invokeMethods isCase join leftShift minus multiply newInputStream newOutputStream newPrintWriter newReader newWriter next plus pop power previous print println push putAt read readBytes readLines reverse reverseEach round size sort splitEachLine step subMap times toInteger toList tokenize upto waitForOrKill withPrintWriter withReader withStream withWriter withWriterAppend write writeLine"},
      contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.NUMBER_MODE, e.REGEXP_MODE]
    }
  }
}());
hljs.registerLanguage("less", function () {
  "use strict";
  return function (e) {
    var n = "([\\w-]+|@{[\\w-]+})", a = [], s = [], t = function (e) {
      return {className: "string", begin: "~?" + e + ".*?" + e}
    }, r = function (e, n, a) {
      return {className: e, begin: n, relevance: a}
    }, i = {begin: "\\(", end: "\\)", contains: s, relevance: 0};
    s.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, t("'"), t('"'), e.CSS_NUMBER_MODE, {
      begin: "(url|data-uri)\\(",
      starts: {className: "string", end: "[\\)\\n]", excludeEnd: !0}
    }, r("number", "#[0-9A-Fa-f]+\\b"), i, r("variable", "@@?[\\w-]+", 10), r("variable", "@{[\\w-]+}"), r("built_in", "~?`[^`]*?`"), {
      className: "attribute",
      begin: "[\\w-]+\\s*:",
      end: ":",
      returnBegin: !0,
      excludeEnd: !0
    }, {className: "meta", begin: "!important"});
    var c = s.concat({begin: "{", end: "}", contains: a}),
      l = {beginKeywords: "when", endsWithParent: !0, contains: [{beginKeywords: "and not"}].concat(s)}, o = {
        begin: n + "\\s*:",
        returnBegin: !0,
        end: "[;}]",
        relevance: 0,
        contains: [{
          className: "attribute",
          begin: n,
          end: ":",
          excludeEnd: !0,
          starts: {endsWithParent: !0, illegal: "[<=$]", relevance: 0, contains: s}
        }]
      }, g = {
        className: "keyword",
        begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
        starts: {end: "[;{}]", returnEnd: !0, contains: s, relevance: 0}
      }, d = {
        className: "variable",
        variants: [{begin: "@[\\w-]+\\s*:", relevance: 15}, {begin: "@[\\w-]+"}],
        starts: {end: "[;}]", returnEnd: !0, contains: c}
      }, b = {
        variants: [{begin: "[\\.#:&\\[>]", end: "[;{}]"}, {begin: n, end: "{"}],
        returnBegin: !0,
        returnEnd: !0,
        illegal: "[<='$\"]",
        relevance: 0,
        contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, l, r("keyword", "all\\b"), r("variable", "@{[\\w-]+}"), r("selector-tag", n + "%?", 0), r("selector-id", "#" + n), r("selector-class", "\\." + n, 0), r("selector-tag", "&", 0), {
          className: "selector-attr",
          begin: "\\[",
          end: "\\]"
        }, {className: "selector-pseudo", begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/}, {
          begin: "\\(",
          end: "\\)",
          contains: c
        }, {begin: "!important"}]
      };
    return a.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, g, d, o, b), {
      name: "Less",
      case_insensitive: !0,
      illegal: "[=>'/<($\"]",
      contains: a
    }
  }
}());
hljs.registerLanguage("c", function () {
  "use strict";
  return function (e) {
    var n = e.requireLanguage("c-like").rawDefinition();
    return n.name = "C", n.aliases = ["c", "h"], n
  }
}());
hljs.registerLanguage("elixir", function () {
  "use strict";
  return function (e) {
    var n = "[a-zA-Z_][a-zA-Z0-9_.]*(\\!|\\?)?", i = {
      $pattern: n,
      keyword: "and false then defined module in return redo retry end for true self when next until do begin unless nil break not case cond alias while ensure or include use alias fn quote require import with|0"
    }, a = {className: "subst", begin: "#\\{", end: "}", keywords: i}, s = {
      className: "number",
      begin: "(\\b0o[0-7_]+)|(\\b0b[01_]+)|(\\b0x[0-9a-fA-F_]+)|(-?\\b[1-9][0-9_]*(.[0-9_]+([eE][-+]?[0-9]+)?)?)",
      relevance: 0
    }, b = {
      className: "string",
      begin: "~[a-z](?=[/|([{<\"'])",
      contains: [{
        endsParent: !0,
        contains: [{
          contains: [e.BACKSLASH_ESCAPE, a],
          variants: [{begin: /"/, end: /"/}, {begin: /'/, end: /'/}, {begin: /\//, end: /\//}, {
            begin: /\|/,
            end: /\|/
          }, {begin: /\(/, end: /\)/}, {begin: /\[/, end: /\]/}, {begin: /\{/, end: /\}/}, {
            begin: /</,
            end: />/
          }]
        }]
      }]
    }, d = {
      className: "string",
      contains: [e.BACKSLASH_ESCAPE, a],
      variants: [{begin: /"""/, end: /"""/}, {begin: /'''/, end: /'''/}, {
        begin: /~S"""/,
        end: /"""/,
        contains: []
      }, {begin: /~S"/, end: /"/, contains: []}, {begin: /~S'''/, end: /'''/, contains: []}, {
        begin: /~S'/,
        end: /'/,
        contains: []
      }, {begin: /'/, end: /'/}, {begin: /"/, end: /"/}]
    }, r = {
      className: "function",
      beginKeywords: "def defp defmacro",
      end: /\B\b/,
      contains: [e.inherit(e.TITLE_MODE, {begin: n, endsParent: !0})]
    }, g = e.inherit(r, {
      className: "class",
      beginKeywords: "defimpl defmodule defprotocol defrecord",
      end: /\bdo\b|$|;/
    }), t = [d, {
      className: "string",
      begin: "~[A-Z](?=[/|([{<\"'])",
      contains: [{begin: /"/, end: /"/}, {begin: /'/, end: /'/}, {begin: /\//, end: /\//}, {
        begin: /\|/,
        end: /\|/
      }, {begin: /\(/, end: /\)/}, {begin: /\[/, end: /\]/}, {begin: /\{/, end: /\}/}, {begin: /\</, end: /\>/}]
    }, b, e.HASH_COMMENT_MODE, g, r, {begin: "::"}, {
      className: "symbol",
      begin: ":(?![\\s:])",
      contains: [d, {begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?"}],
      relevance: 0
    }, {className: "symbol", begin: n + ":(?!:)", relevance: 0}, s, {
      className: "variable",
      begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))"
    }, {begin: "->"}, {
      begin: "(" + e.RE_STARTERS_RE + ")\\s*",
      contains: [e.HASH_COMMENT_MODE, {
        begin: /\/: (?=\d+\s*[,\]])/,
        relevance: 0,
        contains: [s]
      }, {
        className: "regexp",
        illegal: "\\n",
        contains: [e.BACKSLASH_ESCAPE, a],
        variants: [{begin: "/", end: "/[a-z]*"}, {begin: "%r\\[", end: "\\][a-z]*"}]
      }],
      relevance: 0
    }];
    return a.contains = t, {name: "Elixir", keywords: i, contains: t}
  }
}());
hljs.registerLanguage("kotlin", function () {
  "use strict";
  return function (e) {
    var n = {
        keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
        built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
        literal: "true false null"
      }, a = {className: "symbol", begin: e.UNDERSCORE_IDENT_RE + "@"},
      i = {className: "subst", begin: "\\${", end: "}", contains: [e.C_NUMBER_MODE]},
      s = {className: "variable", begin: "\\$" + e.UNDERSCORE_IDENT_RE}, t = {
        className: "string",
        variants: [{begin: '"""', end: '"""(?=[^"])', contains: [s, i]}, {
          begin: "'",
          end: "'",
          illegal: /\n/,
          contains: [e.BACKSLASH_ESCAPE]
        }, {begin: '"', end: '"', illegal: /\n/, contains: [e.BACKSLASH_ESCAPE, s, i]}]
      };
    i.contains.push(t);
    var r = {
        className: "meta",
        begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + e.UNDERSCORE_IDENT_RE + ")?"
      }, l = {
        className: "meta",
        begin: "@" + e.UNDERSCORE_IDENT_RE,
        contains: [{begin: /\(/, end: /\)/, contains: [e.inherit(t, {className: "meta-string"})]}]
      }, c = e.COMMENT("/\\*", "\\*/", {contains: [e.C_BLOCK_COMMENT_MODE]}),
      o = {variants: [{className: "type", begin: e.UNDERSCORE_IDENT_RE}, {begin: /\(/, end: /\)/, contains: []}]},
      d = o;
    return d.variants[1].contains = [o], o.variants[1].contains = [d], {
      name: "Kotlin",
      aliases: ["kt"],
      keywords: n,
      contains: [e.COMMENT("/\\*\\*", "\\*/", {
        relevance: 0,
        contains: [{className: "doctag", begin: "@[A-Za-z]+"}]
      }), e.C_LINE_COMMENT_MODE, c, {
        className: "keyword",
        begin: /\b(break|continue|return|this)\b/,
        starts: {contains: [{className: "symbol", begin: /@\w+/}]}
      }, a, r, l, {
        className: "function",
        beginKeywords: "fun",
        end: "[(]|$",
        returnBegin: !0,
        excludeEnd: !0,
        keywords: n,
        illegal: /fun\s+(<.*>)?[^\s\(]+(\s+[^\s\(]+)\s*=/,
        relevance: 5,
        contains: [{
          begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
          returnBegin: !0,
          relevance: 0,
          contains: [e.UNDERSCORE_TITLE_MODE]
        }, {className: "type", begin: /</, end: />/, keywords: "reified", relevance: 0}, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          endsParent: !0,
          keywords: n,
          relevance: 0,
          contains: [{
            begin: /:/,
            end: /[=,\/]/,
            endsWithParent: !0,
            contains: [o, e.C_LINE_COMMENT_MODE, c],
            relevance: 0
          }, e.C_LINE_COMMENT_MODE, c, r, l, t, e.C_NUMBER_MODE]
        }, c]
      }, {
        className: "class",
        beginKeywords: "class interface trait",
        end: /[:\{(]|$/,
        excludeEnd: !0,
        illegal: "extends implements",
        contains: [{beginKeywords: "public protected internal private constructor"}, e.UNDERSCORE_TITLE_MODE, {
          className: "type",
          begin: /</,
          end: />/,
          excludeBegin: !0,
          excludeEnd: !0,
          relevance: 0
        }, {className: "type", begin: /[,:]\s*/, end: /[<\(,]|$/, excludeBegin: !0, returnEnd: !0}, r, l]
      }, t, {className: "meta", begin: "^#!/usr/bin/env", end: "$", illegal: "\n"}, {
        className: "number",
        begin: "\\b(0[bB]([01]+[01_]+[01]+|[01]+)|0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)|(([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?|\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))([eE][-+]?\\d+)?)[lLfF]?",
        relevance: 0
      }]
    }
  }
}());
hljs.registerLanguage("ini", function () {
  "use strict";

  function e(e) {
    return e ? "string" == typeof e ? e : e.source : null
  }

  function n(...n) {
    return n.map(n => e(n)).join("")
  }

  return function (a) {
    var s = {
      className: "number",
      relevance: 0,
      variants: [{begin: /([\+\-]+)?[\d]+_[\d_]+/}, {begin: a.NUMBER_RE}]
    }, i = a.COMMENT();
    i.variants = [{begin: /;/, end: /$/}, {begin: /#/, end: /$/}];
    var t = {className: "variable", variants: [{begin: /\$[\w\d"][\w\d_]*/}, {begin: /\$\{(.*?)}/}]},
      r = {className: "literal", begin: /\bon|off|true|false|yes|no\b/}, l = {
        className: "string",
        contains: [a.BACKSLASH_ESCAPE],
        variants: [{begin: "'''", end: "'''", relevance: 10}, {
          begin: '"""',
          end: '"""',
          relevance: 10
        }, {begin: '"', end: '"'}, {begin: "'", end: "'"}]
      }, c = {begin: /\[/, end: /\]/, contains: [i, r, t, l, s, "self"], relevance: 0},
      g = "(" + [/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/].map(n => e(n)).join("|") + ")";
    return {
      name: "TOML, also INI",
      aliases: ["toml"],
      case_insensitive: !0,
      illegal: /\S/,
      contains: [i, {
        className: "section",
        begin: /\[+/,
        end: /\]+/
      }, {
        begin: n(g, "(\\s*\\.\\s*", g, ")*", n("(?=", /\s*=\s*[^#\s]/, ")")),
        className: "attr",
        starts: {end: /$/, contains: [i, c, r, t, l, s]}
      }]
    }
  }
}());
hljs.registerLanguage("plaintext", function () {
  "use strict";
  return function (t) {
    return {name: "Plain text", aliases: ["text", "txt"], disableAutodetect: !0}
  }
}());
hljs.registerLanguage("xml", function () {
  "use strict";
  return function (e) {
    var n = {className: "symbol", begin: "&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;"},
      a = {begin: "\\s", contains: [{className: "meta-keyword", begin: "#?[a-z_][a-z1-9_-]+", illegal: "\\n"}]},
      s = e.inherit(a, {begin: "\\(", end: "\\)"}), t = e.inherit(e.APOS_STRING_MODE, {className: "meta-string"}),
      i = e.inherit(e.QUOTE_STRING_MODE, {className: "meta-string"}), c = {
        endsWithParent: !0,
        illegal: /</,
        relevance: 0,
        contains: [{className: "attr", begin: "[A-Za-z0-9\\._:-]+", relevance: 0}, {
          begin: /=\s*/,
          relevance: 0,
          contains: [{
            className: "string",
            endsParent: !0,
            variants: [{begin: /"/, end: /"/, contains: [n]}, {
              begin: /'/,
              end: /'/,
              contains: [n]
            }, {begin: /[^\s"'=<>`]+/}]
          }]
        }]
      };
    return {
      name: "HTML, XML",
      aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
      case_insensitive: !0,
      contains: [{
        className: "meta",
        begin: "<![a-z]",
        end: ">",
        relevance: 10,
        contains: [a, i, t, s, {
          begin: "\\[",
          end: "\\]",
          contains: [{className: "meta", begin: "<![a-z]", end: ">", contains: [a, s, i, t]}]
        }]
      }, e.COMMENT("\x3c!--", "--\x3e", {relevance: 10}), {
        begin: "<\\!\\[CDATA\\[",
        end: "\\]\\]>",
        relevance: 10
      }, n, {className: "meta", begin: /<\?xml/, end: /\?>/, relevance: 10}, {
        className: "tag",
        begin: "<style(?=\\s|>)",
        end: ">",
        keywords: {name: "style"},
        contains: [c],
        starts: {end: "</style>", returnEnd: !0, subLanguage: ["css", "xml"]}
      }, {
        className: "tag",
        begin: "<script(?=\\s|>)",
        end: ">",
        keywords: {name: "script"},
        contains: [c],
        starts: {end: "<\/script>", returnEnd: !0, subLanguage: ["javascript", "handlebars", "xml"]}
      }, {
        className: "tag",
        begin: "</?",
        end: "/?>",
        contains: [{className: "name", begin: /[^\/><\s]+/, relevance: 0}, c]
      }]
    }
  }
}());
hljs.registerLanguage("php", function () {
  "use strict";
  return function (e) {
    var r = {begin: "\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"},
      t = {className: "meta", variants: [{begin: /<\?php/, relevance: 10}, {begin: /<\?[=]?/}, {begin: /\?>/}]},
      a = {className: "subst", variants: [{begin: /\$\w+/}, {begin: /\{\$/, end: /\}/}]},
      n = e.inherit(e.APOS_STRING_MODE, {illegal: null}),
      i = e.inherit(e.QUOTE_STRING_MODE, {illegal: null, contains: e.QUOTE_STRING_MODE.contains.concat(a)}),
      o = e.END_SAME_AS_BEGIN({
        begin: /<<<[ \t]*(\w+)\n/,
        end: /[ \t]*(\w+)\b/,
        contains: e.QUOTE_STRING_MODE.contains.concat(a)
      }), l = {
        className: "string",
        contains: [e.BACKSLASH_ESCAPE, t],
        variants: [e.inherit(n, {begin: "b'", end: "'"}), e.inherit(i, {begin: 'b"', end: '"'}), i, n, o]
      }, s = {variants: [e.BINARY_NUMBER_MODE, e.C_NUMBER_MODE]}, c = {
        keyword: "__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ die echo exit include include_once print require require_once array abstract and as binary bool boolean break callable case catch class clone const continue declare default do double else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval extends final finally float for foreach from global goto if implements instanceof insteadof int integer interface isset iterable list new object or private protected public real return string switch throw trait try unset use var void while xor yield",
        literal: "false null true",
        built_in: "Error|0 AppendIterator ArgumentCountError ArithmeticError ArrayIterator ArrayObject AssertionError BadFunctionCallException BadMethodCallException CachingIterator CallbackFilterIterator CompileError Countable DirectoryIterator DivisionByZeroError DomainException EmptyIterator ErrorException Exception FilesystemIterator FilterIterator GlobIterator InfiniteIterator InvalidArgumentException IteratorIterator LengthException LimitIterator LogicException MultipleIterator NoRewindIterator OutOfBoundsException OutOfRangeException OuterIterator OverflowException ParentIterator ParseError RangeException RecursiveArrayIterator RecursiveCachingIterator RecursiveCallbackFilterIterator RecursiveDirectoryIterator RecursiveFilterIterator RecursiveIterator RecursiveIteratorIterator RecursiveRegexIterator RecursiveTreeIterator RegexIterator RuntimeException SeekableIterator SplDoublyLinkedList SplFileInfo SplFileObject SplFixedArray SplHeap SplMaxHeap SplMinHeap SplObjectStorage SplObserver SplObserver SplPriorityQueue SplQueue SplStack SplSubject SplSubject SplTempFileObject TypeError UnderflowException UnexpectedValueException ArrayAccess Closure Generator Iterator IteratorAggregate Serializable Throwable Traversable WeakReference Directory __PHP_Incomplete_Class parent php_user_filter self static stdClass"
      };
    return {
      aliases: ["php", "php3", "php4", "php5", "php6", "php7"],
      case_insensitive: !0,
      keywords: c,
      contains: [e.HASH_COMMENT_MODE, e.COMMENT("//", "$", {contains: [t]}), e.COMMENT("/\\*", "\\*/", {
        contains: [{
          className: "doctag",
          begin: "@[A-Za-z]+"
        }]
      }), e.COMMENT("__halt_compiler.+?;", !1, {
        endsWithParent: !0,
        keywords: "__halt_compiler"
      }), t, {
        className: "keyword",
        begin: /\$this\b/
      }, r, {begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/}, {
        className: "function",
        beginKeywords: "fn function",
        end: /[;{]/,
        excludeEnd: !0,
        illegal: "[$%\\[]",
        contains: [e.UNDERSCORE_TITLE_MODE, {
          className: "params",
          begin: "\\(",
          end: "\\)",
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: c,
          contains: ["self", r, e.C_BLOCK_COMMENT_MODE, l, s]
        }]
      }, {
        className: "class",
        beginKeywords: "class interface",
        end: "{",
        excludeEnd: !0,
        illegal: /[:\(\$"]/,
        contains: [{beginKeywords: "extends implements"}, e.UNDERSCORE_TITLE_MODE]
      }, {
        beginKeywords: "namespace",
        end: ";",
        illegal: /[\.']/,
        contains: [e.UNDERSCORE_TITLE_MODE]
      }, {beginKeywords: "use", end: ";", contains: [e.UNDERSCORE_TITLE_MODE]}, {begin: "=>"}, l, s]
    }
  }
}());
hljs.registerLanguage("php-template", function () {
  "use strict";
  return function (n) {
    return {
      name: "PHP template",
      subLanguage: "xml",
      contains: [{
        begin: /<\?(php|=)?/,
        end: /\?>/,
        subLanguage: "php",
        contains: [{begin: "/\\*", end: "\\*/", skip: !0}, {begin: 'b"', end: '"', skip: !0}, {
          begin: "b'",
          end: "'",
          skip: !0
        }, n.inherit(n.APOS_STRING_MODE, {
          illegal: null,
          className: null,
          contains: null,
          skip: !0
        }), n.inherit(n.QUOTE_STRING_MODE, {illegal: null, className: null, contains: null, skip: !0})]
      }]
    }
  }
}());
hljs.registerLanguage("bash", function () {
  "use strict";
  return function (e) {
    const s = {};
    Object.assign(s, {
      className: "variable",
      variants: [{begin: /\$[\w\d#@][\w\d_]*/}, {
        begin: /\$\{/,
        end: /\}/,
        contains: [{begin: /:-/, contains: [s]}]
      }]
    });
    const t = {className: "subst", begin: /\$\(/, end: /\)/, contains: [e.BACKSLASH_ESCAPE]},
      n = {className: "string", begin: /"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, s, t]};
    t.contains.push(n);
    const a = {
      begin: /\$\(\(/,
      end: /\)\)/,
      contains: [{begin: /\d+#[0-9a-f]+/, className: "number"}, e.NUMBER_MODE, s]
    }, i = e.SHEBANG({binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)", relevance: 10}), c = {
      className: "function",
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: !0,
      contains: [e.inherit(e.TITLE_MODE, {begin: /\w[\w\d_]*/})],
      relevance: 0
    };
    return {
      name: "Bash",
      aliases: ["sh", "zsh"],
      keywords: {
        $pattern: /\b-?[a-z\._-]+\b/,
        keyword: "if then else elif fi for while in do done case esac function",
        literal: "true false",
        built_in: "break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp",
        _: "-ne -eq -lt -gt -f -d -e -s -l -a"
      },
      contains: [i, e.SHEBANG(), c, a, e.HASH_COMMENT_MODE, n, {
        className: "",
        begin: /\\"/
      }, {className: "string", begin: /'/, end: /'/}, s]
    }
  }
}());
hljs.registerLanguage("go", function () {
  "use strict";
  return function (e) {
    var n = {
      keyword: "break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune",
      literal: "true false iota nil",
      built_in: "append cap close complex copy imag len make new panic print println real recover delete"
    };
    return {
      name: "Go",
      aliases: ["golang"],
      keywords: n,
      illegal: "</",
      contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
        className: "string",
        variants: [e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {begin: "`", end: "`"}]
      }, {
        className: "number",
        variants: [{begin: e.C_NUMBER_RE + "[i]", relevance: 1}, e.C_NUMBER_MODE]
      }, {begin: /:=/}, {
        className: "function",
        beginKeywords: "func",
        end: "\\s*(\\{|$)",
        excludeEnd: !0,
        contains: [e.TITLE_MODE, {className: "params", begin: /\(/, end: /\)/, keywords: n, illegal: /["']/}]
      }]
    }
  }
}());
hljs.registerLanguage("cpp", function () {
  "use strict";
  return function (e) {
    var i = e.requireLanguage("c-like").rawDefinition();
    return i.disableAutodetect = !1, i.name = "C++", i.aliases = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"], i
  }
}());
hljs.registerLanguage("perl", function () {
  "use strict";
  return function (e) {
    var n = {
        $pattern: /[\w.]+/,
        keyword: "getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmget sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when"
      }, t = {className: "subst", begin: "[$@]\\{", end: "\\}", keywords: n}, s = {begin: "->{", end: "}"}, r = {
        variants: [{begin: /\$\d/}, {begin: /[\$%@](\^\w\b|#\w+(::\w+)*|{\w+}|\w+(::\w*)*)/}, {
          begin: /[\$%@][^\s\w{]/,
          relevance: 0
        }]
      }, i = [e.BACKSLASH_ESCAPE, t, r],
      a = [r, e.HASH_COMMENT_MODE, e.COMMENT("^\\=\\w", "\\=cut", {endsWithParent: !0}), s, {
        className: "string",
        contains: i,
        variants: [{begin: "q[qwxr]?\\s*\\(", end: "\\)", relevance: 5}, {
          begin: "q[qwxr]?\\s*\\[",
          end: "\\]",
          relevance: 5
        }, {begin: "q[qwxr]?\\s*\\{", end: "\\}", relevance: 5}, {
          begin: "q[qwxr]?\\s*\\|",
          end: "\\|",
          relevance: 5
        }, {begin: "q[qwxr]?\\s*\\<", end: "\\>", relevance: 5}, {
          begin: "qw\\s+q",
          end: "q",
          relevance: 5
        }, {begin: "'", end: "'", contains: [e.BACKSLASH_ESCAPE]}, {begin: '"', end: '"'}, {
          begin: "`",
          end: "`",
          contains: [e.BACKSLASH_ESCAPE]
        }, {begin: "{\\w+}", contains: [], relevance: 0}, {
          begin: "-?\\w+\\s*\\=\\>",
          contains: [],
          relevance: 0
        }]
      }, {
        className: "number",
        begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
        relevance: 0
      }, {
        begin: "(\\/\\/|" + e.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
        keywords: "split return print reverse grep",
        relevance: 0,
        contains: [e.HASH_COMMENT_MODE, {
          className: "regexp",
          begin: "(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",
          relevance: 10
        }, {
          className: "regexp",
          begin: "(m|qr)?/",
          end: "/[a-z]*",
          contains: [e.BACKSLASH_ESCAPE],
          relevance: 0
        }]
      }, {
        className: "function",
        beginKeywords: "sub",
        end: "(\\s*\\(.*?\\))?[;{]",
        excludeEnd: !0,
        relevance: 5,
        contains: [e.TITLE_MODE]
      }, {begin: "-\\w\\b", relevance: 0}, {
        begin: "^__DATA__$",
        end: "^__END__$",
        subLanguage: "mojolicious",
        contains: [{begin: "^@@.*", end: "$", className: "comment"}]
      }];
    return t.contains = a, s.contains = a, {name: "Perl", aliases: ["pl", "pm"], keywords: n, contains: a}
  }
}());
hljs.registerLanguage("lua", function () {
  "use strict";
  return function (e) {
    var t = {begin: "\\[=*\\[", end: "\\]=*\\]", contains: ["self"]},
      a = [e.COMMENT("--(?!\\[=*\\[)", "$"), e.COMMENT("--\\[=*\\[", "\\]=*\\]", {contains: [t], relevance: 10})];
    return {
      name: "Lua",
      keywords: {
        $pattern: e.UNDERSCORE_IDENT_RE,
        literal: "true false nil",
        keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
        built_in: "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
      },
      contains: a.concat([{
        className: "function",
        beginKeywords: "function",
        end: "\\)",
        contains: [e.inherit(e.TITLE_MODE, {begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}), {
          className: "params",
          begin: "\\(",
          endsWithParent: !0,
          contains: a
        }].concat(a)
      }, e.C_NUMBER_MODE, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
        className: "string",
        begin: "\\[=*\\[",
        end: "\\]=*\\]",
        contains: [t],
        relevance: 5
      }])
    }
  }
}());
hljs.registerLanguage("markdown", function () {
  "use strict";
  return function (n) {
    const e = {begin: "<", end: ">", subLanguage: "xml", relevance: 0}, a = {
      begin: "\\[.+?\\][\\(\\[].*?[\\)\\]]",
      returnBegin: !0,
      contains: [{
        className: "string",
        begin: "\\[",
        end: "\\]",
        excludeBegin: !0,
        returnEnd: !0,
        relevance: 0
      }, {className: "link", begin: "\\]\\(", end: "\\)", excludeBegin: !0, excludeEnd: !0}, {
        className: "symbol",
        begin: "\\]\\[",
        end: "\\]",
        excludeBegin: !0,
        excludeEnd: !0
      }],
      relevance: 10
    }, i = {
      className: "strong",
      contains: [],
      variants: [{begin: /_{2}/, end: /_{2}/}, {begin: /\*{2}/, end: /\*{2}/}]
    }, s = {
      className: "emphasis",
      contains: [],
      variants: [{begin: /\*(?!\*)/, end: /\*/}, {begin: /_(?!_)/, end: /_/, relevance: 0}]
    };
    i.contains.push(s), s.contains.push(i);
    var c = [e, a];
    return i.contains = i.contains.concat(c), s.contains = s.contains.concat(c), {
      name: "Markdown",
      aliases: ["md", "mkdown", "mkd"],
      contains: [{
        className: "section",
        variants: [{begin: "^#{1,6}", end: "$", contains: c = c.concat(i, s)}, {
          begin: "(?=^.+?\\n[=-]{2,}$)",
          contains: [{begin: "^[=-]*$"}, {begin: "^", end: "\\n", contains: c}]
        }]
      }, e, {
        className: "bullet",
        begin: "^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
        end: "\\s+",
        excludeEnd: !0
      }, i, s, {className: "quote", begin: "^>\\s+", contains: c, end: "$"}, {
        className: "code",
        variants: [{begin: "(`{3,})(.|\\n)*?\\1`*[ ]*"}, {begin: "(~{3,})(.|\\n)*?\\1~*[ ]*"}, {
          begin: "```",
          end: "```+[ ]*$"
        }, {begin: "~~~", end: "~~~+[ ]*$"}, {begin: "`.+?`"}, {
          begin: "(?=^( {4}|\\t))",
          contains: [{begin: "^( {4}|\\t)", end: "(\\n)$"}],
          relevance: 0
        }]
      }, {begin: "^[-\\*]{3,}", end: "$"}, a, {
        begin: /^\[[^\n]+\]:/,
        returnBegin: !0,
        contains: [{
          className: "symbol",
          begin: /\[/,
          end: /\]/,
          excludeBegin: !0,
          excludeEnd: !0
        }, {className: "link", begin: /:\s*/, end: /$/, excludeBegin: !0}]
      }]
    }
  }
}());
hljs.registerLanguage("makefile", function () {
  "use strict";
  return function (e) {
    var i = {
        className: "variable",
        variants: [{
          begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
          contains: [e.BACKSLASH_ESCAPE]
        }, {begin: /\$[@%<?\^\+\*]/}]
      }, n = {className: "string", begin: /"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, i]}, a = {
        className: "variable",
        begin: /\$\([\w-]+\s/,
        end: /\)/,
        keywords: {built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"},
        contains: [i]
      }, r = {begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)"},
      s = {className: "section", begin: /^[^\s]+:/, end: /$/, contains: [i]};
    return {
      name: "Makefile",
      aliases: ["mk", "mak"],
      keywords: {
        $pattern: /[\w-]+/,
        keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
      },
      contains: [e.HASH_COMMENT_MODE, i, n, a, r, {
        className: "meta",
        begin: /^\.PHONY:/,
        end: /$/,
        keywords: {$pattern: /[\.\w]+/, "meta-keyword": ".PHONY"}
      }, s]
    }
  }
}());
hljs.registerLanguage("cmake", function () {
  "use strict";
  return function (e) {
    return {
      name: "CMake",
      aliases: ["cmake.in"],
      case_insensitive: !0,
      keywords: {keyword: "break cmake_host_system_information cmake_minimum_required cmake_parse_arguments cmake_policy configure_file continue elseif else endforeach endfunction endif endmacro endwhile execute_process file find_file find_library find_package find_path find_program foreach function get_cmake_property get_directory_property get_filename_component get_property if include include_guard list macro mark_as_advanced math message option return separate_arguments set_directory_properties set_property set site_name string unset variable_watch while add_compile_definitions add_compile_options add_custom_command add_custom_target add_definitions add_dependencies add_executable add_library add_link_options add_subdirectory add_test aux_source_directory build_command create_test_sourcelist define_property enable_language enable_testing export fltk_wrap_ui get_source_file_property get_target_property get_test_property include_directories include_external_msproject include_regular_expression install link_directories link_libraries load_cache project qt_wrap_cpp qt_wrap_ui remove_definitions set_source_files_properties set_target_properties set_tests_properties source_group target_compile_definitions target_compile_features target_compile_options target_include_directories target_link_directories target_link_libraries target_link_options target_sources try_compile try_run ctest_build ctest_configure ctest_coverage ctest_empty_binary_directory ctest_memcheck ctest_read_custom_files ctest_run_script ctest_sleep ctest_start ctest_submit ctest_test ctest_update ctest_upload build_name exec_program export_library_dependencies install_files install_programs install_targets load_command make_directory output_required_files remove subdir_depends subdirs use_mangled_mesa utility_source variable_requires write_file qt5_use_modules qt5_use_package qt5_wrap_cpp on off true false and or not command policy target test exists is_newer_than is_directory is_symlink is_absolute matches less greater equal less_equal greater_equal strless strgreater strequal strless_equal strgreater_equal version_less version_greater version_equal version_less_equal version_greater_equal in_list defined"},
      contains: [{
        className: "variable",
        begin: "\\${",
        end: "}"
      }, e.HASH_COMMENT_MODE, e.QUOTE_STRING_MODE, e.NUMBER_MODE]
    }
  }
}());
hljs.registerLanguage("json", function () {
  "use strict";
  return function (n) {
    var e = {literal: "true false null"}, i = [n.C_LINE_COMMENT_MODE, n.C_BLOCK_COMMENT_MODE],
      t = [n.QUOTE_STRING_MODE, n.C_NUMBER_MODE],
      a = {end: ",", endsWithParent: !0, excludeEnd: !0, contains: t, keywords: e}, l = {
        begin: "{",
        end: "}",
        contains: [{
          className: "attr",
          begin: /"/,
          end: /"/,
          contains: [n.BACKSLASH_ESCAPE],
          illegal: "\\n"
        }, n.inherit(a, {begin: /:/})].concat(i),
        illegal: "\\S"
      }, s = {begin: "\\[", end: "\\]", contains: [n.inherit(a)], illegal: "\\S"};
    return t.push(l, s), i.forEach((function (n) {
      t.push(n)
    })), {name: "JSON", contains: t, keywords: e, illegal: "\\S"}
  }
}());
hljs.registerLanguage("shell", function () {
  "use strict";
  return function (s) {
    return {
      name: "Shell Session",
      aliases: ["console"],
      contains: [{
        className: "meta",
        begin: "^\\s{0,3}[/\\w\\d\\[\\]()@-]*[>%$#]",
        starts: {end: "$", subLanguage: "bash"}
      }]
    }
  }
}());
hljs.registerLanguage("css", function () {
  "use strict";
  return function (e) {
    var n = {
      begin: /(?:[A-Z\_\.\-]+|--[a-zA-Z0-9_-]+)\s*:/,
      returnBegin: !0,
      end: ";",
      endsWithParent: !0,
      contains: [{
        className: "attribute",
        begin: /\S/,
        end: ":",
        excludeEnd: !0,
        starts: {
          endsWithParent: !0,
          excludeEnd: !0,
          contains: [{
            begin: /[\w-]+\(/,
            returnBegin: !0,
            contains: [{className: "built_in", begin: /[\w-]+/}, {
              begin: /\(/,
              end: /\)/,
              contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE]
            }]
          }, e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, e.C_BLOCK_COMMENT_MODE, {
            className: "number",
            begin: "#[0-9A-Fa-f]+"
          }, {className: "meta", begin: "!important"}]
        }
      }]
    };
    return {
      name: "CSS",
      case_insensitive: !0,
      illegal: /[=\/|'\$]/,
      contains: [e.C_BLOCK_COMMENT_MODE, {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/
      }, {className: "selector-class", begin: /\.[A-Za-z0-9_-]+/}, {
        className: "selector-attr",
        begin: /\[/,
        end: /\]/,
        illegal: "$",
        contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
      }, {className: "selector-pseudo", begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/}, {
        begin: "@(page|font-face)",
        lexemes: "@[a-z-]+",
        keywords: "@page @font-face"
      }, {
        begin: "@",
        end: "[{;]",
        illegal: /:/,
        returnBegin: !0,
        contains: [{className: "keyword", begin: /@\-?\w[\w]*(\-\w+)*/}, {
          begin: /\s/,
          endsWithParent: !0,
          excludeEnd: !0,
          relevance: 0,
          keywords: "and or not only",
          contains: [{
            begin: /[a-z-]+:/,
            className: "attribute"
          }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE]
        }]
      }, {className: "selector-tag", begin: "[a-zA-Z-][a-zA-Z0-9_-]*", relevance: 0}, {
        begin: "{",
        end: "}",
        illegal: /\S/,
        contains: [e.C_BLOCK_COMMENT_MODE, n]
      }]
    }
  }
}());
hljs.registerLanguage("diff", function () {
  "use strict";
  return function (e) {
    return {
      name: "Diff",
      aliases: ["patch"],
      contains: [{
        className: "meta",
        relevance: 10,
        variants: [{begin: /^@@ +\-\d+,\d+ +\+\d+,\d+ +@@$/}, {begin: /^\*\*\* +\d+,\d+ +\*\*\*\*$/}, {begin: /^\-\-\- +\d+,\d+ +\-\-\-\-$/}]
      }, {
        className: "comment",
        variants: [{begin: /Index: /, end: /$/}, {begin: /={3,}/, end: /$/}, {
          begin: /^\-{3}/,
          end: /$/
        }, {begin: /^\*{3} /, end: /$/}, {begin: /^\+{3}/, end: /$/}, {begin: /^\*{15}$/}]
      }, {className: "addition", begin: "^\\+", end: "$"}, {
        className: "deletion",
        begin: "^\\-",
        end: "$"
      }, {className: "addition", begin: "^\\!", end: "$"}]
    }
  }
}());
hljs.registerLanguage("http", function () {
  "use strict";
  return function (e) {
    var n = "HTTP/[0-9\\.]+";
    return {
      name: "HTTP",
      aliases: ["https"],
      illegal: "\\S",
      contains: [{
        begin: "^" + n,
        end: "$",
        contains: [{className: "number", begin: "\\b\\d{3}\\b"}]
      }, {
        begin: "^[A-Z]+ (.*?) " + n + "$",
        returnBegin: !0,
        end: "$",
        contains: [{
          className: "string",
          begin: " ",
          end: " ",
          excludeBegin: !0,
          excludeEnd: !0
        }, {begin: n}, {className: "keyword", begin: "[A-Z]+"}]
      }, {
        className: "attribute",
        begin: "^\\w",
        end: ": ",
        excludeEnd: !0,
        illegal: "\\n|\\s|=",
        starts: {end: "$", relevance: 0}
      }, {begin: "\\n\\n", starts: {subLanguage: [], endsWithParent: !0}}]
    }
  }
}());
hljs.registerLanguage("powershell", function () {
  "use strict";
  return function (e) {
    var n = {
        $pattern: /-?[A-z\.\-]+\b/,
        keyword: "if else foreach return do while until elseif begin for trap data dynamicparam end break throw param continue finally in switch exit filter try process catch hidden static parameter",
        built_in: "ac asnp cat cd CFS chdir clc clear clhy cli clp cls clv cnsn compare copy cp cpi cpp curl cvpa dbp del diff dir dnsn ebp echo|0 epal epcsv epsn erase etsn exsn fc fhx fl ft fw gal gbp gc gcb gci gcm gcs gdr gerr ghy gi gin gjb gl gm gmo gp gps gpv group gsn gsnp gsv gtz gu gv gwmi h history icm iex ihy ii ipal ipcsv ipmo ipsn irm ise iwmi iwr kill lp ls man md measure mi mount move mp mv nal ndr ni nmo npssc nsn nv ogv oh popd ps pushd pwd r rbp rcjb rcsn rd rdr ren ri rjb rm rmdir rmo rni rnp rp rsn rsnp rujb rv rvpa rwmi sajb sal saps sasv sbp sc scb select set shcm si sl sleep sls sort sp spjb spps spsv start stz sujb sv swmi tee trcm type wget where wjb write"
      }, s = {begin: "`[\\s\\S]", relevance: 0}, i = {
        className: "variable",
        variants: [{begin: /\$\B/}, {className: "keyword", begin: /\$this/}, {begin: /\$[\w\d][\w\d_:]*/}]
      }, a = {
        className: "string",
        variants: [{begin: /"/, end: /"/}, {begin: /@"/, end: /^"@/}],
        contains: [s, i, {className: "variable", begin: /\$[A-z]/, end: /[^A-z]/}]
      }, t = {className: "string", variants: [{begin: /'/, end: /'/}, {begin: /@'/, end: /^'@/}]},
      r = e.inherit(e.COMMENT(null, null), {
        variants: [{begin: /#/, end: /$/}, {begin: /<#/, end: /#>/}],
        contains: [{
          className: "doctag",
          variants: [{begin: /\.(synopsis|description|example|inputs|outputs|notes|link|component|role|functionality)/}, {begin: /\.(parameter|forwardhelptargetname|forwardhelpcategory|remotehelprunspace|externalhelp)\s+\S+/}]
        }]
      }), c = {
        className: "class",
        beginKeywords: "class enum",
        end: /\s*[{]/,
        excludeEnd: !0,
        relevance: 0,
        contains: [e.TITLE_MODE]
      }, l = {
        className: "function",
        begin: /function\s+/,
        end: /\s*\{|$/,
        excludeEnd: !0,
        returnBegin: !0,
        relevance: 0,
        contains: [{begin: "function", relevance: 0, className: "keyword"}, {
          className: "title",
          begin: /\w[\w\d]*((-)[\w\d]+)*/,
          relevance: 0
        }, {begin: /\(/, end: /\)/, className: "params", relevance: 0, contains: [i]}]
      }, o = {
        begin: /using\s/,
        end: /$/,
        returnBegin: !0,
        contains: [a, t, {className: "keyword", begin: /(using|assembly|command|module|namespace|type)/}]
      }, p = {
        className: "function",
        begin: /\[.*\]\s*[\w]+[ ]??\(/,
        end: /$/,
        returnBegin: !0,
        relevance: 0,
        contains: [{
          className: "keyword",
          begin: "(".concat(n.keyword.toString().replace(/\s/g, "|"), ")\\b"),
          endsParent: !0,
          relevance: 0
        }, e.inherit(e.TITLE_MODE, {endsParent: !0})]
      }, g = [p, r, s, e.NUMBER_MODE, a, t, {
        className: "built_in",
        variants: [{begin: "(Add|Clear|Close|Copy|Enter|Exit|Find|Format|Get|Hide|Join|Lock|Move|New|Open|Optimize|Pop|Push|Redo|Remove|Rename|Reset|Resize|Search|Select|Set|Show|Skip|Split|Step|Switch|Undo|Unlock|Watch|Backup|Checkpoint|Compare|Compress|Convert|ConvertFrom|ConvertTo|Dismount|Edit|Expand|Export|Group|Import|Initialize|Limit|Merge|New|Out|Publish|Restore|Save|Sync|Unpublish|Update|Approve|Assert|Complete|Confirm|Deny|Disable|Enable|Install|Invoke|Register|Request|Restart|Resume|Start|Stop|Submit|Suspend|Uninstall|Unregister|Wait|Debug|Measure|Ping|Repair|Resolve|Test|Trace|Connect|Disconnect|Read|Receive|Send|Write|Block|Grant|Protect|Revoke|Unblock|Unprotect|Use|ForEach|Sort|Tee|Where)+(-)[\\w\\d]+"}]
      }, i, {className: "literal", begin: /\$(null|true|false)\b/}, {
        className: "selector-tag",
        begin: /\@\B/,
        relevance: 0
      }], m = {
        begin: /\[/,
        end: /\]/,
        excludeBegin: !0,
        excludeEnd: !0,
        relevance: 0,
        contains: [].concat("self", g, {
          begin: "(string|char|byte|int|long|bool|decimal|single|double|DateTime|xml|array|hashtable|void)",
          className: "built_in",
          relevance: 0
        }, {className: "type", begin: /[\.\w\d]+/, relevance: 0})
      };
    return p.contains.unshift(m), {
      name: "PowerShell",
      aliases: ["ps", "ps1"],
      case_insensitive: !0,
      keywords: n,
      contains: g.concat(c, l, o, {
        variants: [{
          className: "operator",
          begin: "(-and|-as|-band|-bnot|-bor|-bxor|-casesensitive|-ccontains|-ceq|-cge|-cgt|-cle|-clike|-clt|-cmatch|-cne|-cnotcontains|-cnotlike|-cnotmatch|-contains|-creplace|-csplit|-eq|-exact|-f|-file|-ge|-gt|-icontains|-ieq|-ige|-igt|-ile|-ilike|-ilt|-imatch|-in|-ine|-inotcontains|-inotlike|-inotmatch|-ireplace|-is|-isnot|-isplit|-join|-le|-like|-lt|-match|-ne|-not|-notcontains|-notin|-notlike|-notmatch|-or|-regex|-replace|-shl|-shr|-split|-wildcard|-xor)\\b"
        }, {className: "literal", begin: /(-)[\w\d]+/, relevance: 0}]
      }, m)
    }
  }
}());
hljs.registerLanguage("vim", function () {
  "use strict";
  return function (e) {
    return {
      name: "Vim Script",
      keywords: {
        $pattern: /[!#@\w]+/,
        keyword: "N|0 P|0 X|0 a|0 ab abc abo al am an|0 ar arga argd arge argdo argg argl argu as au aug aun b|0 bN ba bad bd be bel bf bl bm bn bo bp br brea breaka breakd breakl bro bufdo buffers bun bw c|0 cN cNf ca cabc caddb cad caddf cal cat cb cc ccl cd ce cex cf cfir cgetb cgete cg changes chd che checkt cl cla clo cm cmapc cme cn cnew cnf cno cnorea cnoreme co col colo com comc comp con conf cope cp cpf cq cr cs cst cu cuna cunme cw delm deb debugg delc delf dif diffg diffo diffp diffpu diffs diffthis dig di dl dell dj dli do doautoa dp dr ds dsp e|0 ea ec echoe echoh echom echon el elsei em en endfo endf endt endw ene ex exe exi exu f|0 files filet fin fina fini fir fix fo foldc foldd folddoc foldo for fu go gr grepa gu gv ha helpf helpg helpt hi hid his ia iabc if ij il im imapc ime ino inorea inoreme int is isp iu iuna iunme j|0 ju k|0 keepa kee keepj lN lNf l|0 lad laddb laddf la lan lat lb lc lch lcl lcs le lefta let lex lf lfir lgetb lgete lg lgr lgrepa lh ll lla lli lmak lm lmapc lne lnew lnf ln loadk lo loc lockv lol lope lp lpf lr ls lt lu lua luad luaf lv lvimgrepa lw m|0 ma mak map mapc marks mat me menut mes mk mks mksp mkv mkvie mod mz mzf nbc nb nbs new nm nmapc nme nn nnoreme noa no noh norea noreme norm nu nun nunme ol o|0 om omapc ome on ono onoreme opt ou ounme ow p|0 profd prof pro promptr pc ped pe perld po popu pp pre prev ps pt ptN ptf ptj ptl ptn ptp ptr pts pu pw py3 python3 py3d py3f py pyd pyf quita qa rec red redi redr redraws reg res ret retu rew ri rightb rub rubyd rubyf rund ru rv sN san sa sal sav sb sbN sba sbf sbl sbm sbn sbp sbr scrip scripte scs se setf setg setl sf sfir sh sim sig sil sl sla sm smap smapc sme sn sni sno snor snoreme sor so spelld spe spelli spellr spellu spellw sp spr sre st sta startg startr star stopi stj sts sun sunm sunme sus sv sw sy synti sync tN tabN tabc tabdo tabe tabf tabfir tabl tabm tabnew tabn tabo tabp tabr tabs tab ta tags tc tcld tclf te tf th tj tl tm tn to tp tr try ts tu u|0 undoj undol una unh unl unlo unm unme uns up ve verb vert vim vimgrepa vi viu vie vm vmapc vme vne vn vnoreme vs vu vunme windo w|0 wN wa wh wi winc winp wn wp wq wqa ws wu wv x|0 xa xmapc xm xme xn xnoreme xu xunme y|0 z|0 ~ Next Print append abbreviate abclear aboveleft all amenu anoremenu args argadd argdelete argedit argglobal arglocal argument ascii autocmd augroup aunmenu buffer bNext ball badd bdelete behave belowright bfirst blast bmodified bnext botright bprevious brewind break breakadd breakdel breaklist browse bunload bwipeout change cNext cNfile cabbrev cabclear caddbuffer caddexpr caddfile call catch cbuffer cclose center cexpr cfile cfirst cgetbuffer cgetexpr cgetfile chdir checkpath checktime clist clast close cmap cmapclear cmenu cnext cnewer cnfile cnoremap cnoreabbrev cnoremenu copy colder colorscheme command comclear compiler continue confirm copen cprevious cpfile cquit crewind cscope cstag cunmap cunabbrev cunmenu cwindow delete delmarks debug debuggreedy delcommand delfunction diffupdate diffget diffoff diffpatch diffput diffsplit digraphs display deletel djump dlist doautocmd doautoall deletep drop dsearch dsplit edit earlier echo echoerr echohl echomsg else elseif emenu endif endfor endfunction endtry endwhile enew execute exit exusage file filetype find finally finish first fixdel fold foldclose folddoopen folddoclosed foldopen function global goto grep grepadd gui gvim hardcopy help helpfind helpgrep helptags highlight hide history insert iabbrev iabclear ijump ilist imap imapclear imenu inoremap inoreabbrev inoremenu intro isearch isplit iunmap iunabbrev iunmenu join jumps keepalt keepmarks keepjumps lNext lNfile list laddexpr laddbuffer laddfile last language later lbuffer lcd lchdir lclose lcscope left leftabove lexpr lfile lfirst lgetbuffer lgetexpr lgetfile lgrep lgrepadd lhelpgrep llast llist lmake lmap lmapclear lnext lnewer lnfile lnoremap loadkeymap loadview lockmarks lockvar lolder lopen lprevious lpfile lrewind ltag lunmap luado luafile lvimgrep lvimgrepadd lwindow move mark make mapclear match menu menutranslate messages mkexrc mksession mkspell mkvimrc mkview mode mzscheme mzfile nbclose nbkey nbsart next nmap nmapclear nmenu nnoremap nnoremenu noautocmd noremap nohlsearch noreabbrev noremenu normal number nunmap nunmenu oldfiles open omap omapclear omenu only onoremap onoremenu options ounmap ounmenu ownsyntax print profdel profile promptfind promptrepl pclose pedit perl perldo pop popup ppop preserve previous psearch ptag ptNext ptfirst ptjump ptlast ptnext ptprevious ptrewind ptselect put pwd py3do py3file python pydo pyfile quit quitall qall read recover redo redir redraw redrawstatus registers resize retab return rewind right rightbelow ruby rubydo rubyfile rundo runtime rviminfo substitute sNext sandbox sargument sall saveas sbuffer sbNext sball sbfirst sblast sbmodified sbnext sbprevious sbrewind scriptnames scriptencoding scscope set setfiletype setglobal setlocal sfind sfirst shell simalt sign silent sleep slast smagic smapclear smenu snext sniff snomagic snoremap snoremenu sort source spelldump spellgood spellinfo spellrepall spellundo spellwrong split sprevious srewind stop stag startgreplace startreplace startinsert stopinsert stjump stselect sunhide sunmap sunmenu suspend sview swapname syntax syntime syncbind tNext tabNext tabclose tabedit tabfind tabfirst tablast tabmove tabnext tabonly tabprevious tabrewind tag tcl tcldo tclfile tearoff tfirst throw tjump tlast tmenu tnext topleft tprevious trewind tselect tunmenu undo undojoin undolist unabbreviate unhide unlet unlockvar unmap unmenu unsilent update vglobal version verbose vertical vimgrep vimgrepadd visual viusage view vmap vmapclear vmenu vnew vnoremap vnoremenu vsplit vunmap vunmenu write wNext wall while winsize wincmd winpos wnext wprevious wqall wsverb wundo wviminfo xit xall xmapclear xmap xmenu xnoremap xnoremenu xunmap xunmenu yank",
        built_in: "synIDtrans atan2 range matcharg did_filetype asin feedkeys xor argv complete_check add getwinposx getqflist getwinposy screencol clearmatches empty extend getcmdpos mzeval garbagecollect setreg ceil sqrt diff_hlID inputsecret get getfperm getpid filewritable shiftwidth max sinh isdirectory synID system inputrestore winline atan visualmode inputlist tabpagewinnr round getregtype mapcheck hasmapto histdel argidx findfile sha256 exists toupper getcmdline taglist string getmatches bufnr strftime winwidth bufexists strtrans tabpagebuflist setcmdpos remote_read printf setloclist getpos getline bufwinnr float2nr len getcmdtype diff_filler luaeval resolve libcallnr foldclosedend reverse filter has_key bufname str2float strlen setline getcharmod setbufvar index searchpos shellescape undofile foldclosed setqflist buflisted strchars str2nr virtcol floor remove undotree remote_expr winheight gettabwinvar reltime cursor tabpagenr finddir localtime acos getloclist search tanh matchend rename gettabvar strdisplaywidth type abs py3eval setwinvar tolower wildmenumode log10 spellsuggest bufloaded synconcealed nextnonblank server2client complete settabwinvar executable input wincol setmatches getftype hlID inputsave searchpair or screenrow line settabvar histadd deepcopy strpart remote_peek and eval getftime submatch screenchar winsaveview matchadd mkdir screenattr getfontname libcall reltimestr getfsize winnr invert pow getbufline byte2line soundfold repeat fnameescape tagfiles sin strwidth spellbadword trunc maparg log lispindent hostname setpos globpath remote_foreground getchar synIDattr fnamemodify cscope_connection stridx winbufnr indent min complete_add nr2char searchpairpos inputdialog values matchlist items hlexists strridx browsedir expand fmod pathshorten line2byte argc count getwinvar glob foldtextresult getreg foreground cosh matchdelete has char2nr simplify histget searchdecl iconv winrestcmd pumvisible writefile foldlevel haslocaldir keys cos matchstr foldtext histnr tan tempname getcwd byteidx getbufvar islocked escape eventhandler remote_send serverlist winrestview synstack pyeval prevnonblank readfile cindent filereadable changenr exp"
      },
      illegal: /;/,
      contains: [e.NUMBER_MODE, {className: "string", begin: "'", end: "'", illegal: "\\n"}, {
        className: "string",
        begin: /"(\\"|\n\\|[^"\n])*"/
      }, e.COMMENT('"', "$"), {className: "variable", begin: /[bwtglsav]:[\w\d_]*/}, {
        className: "function",
        beginKeywords: "function function!",
        end: "$",
        relevance: 0,
        contains: [e.TITLE_MODE, {className: "params", begin: "\\(", end: "\\)"}]
      }, {className: "symbol", begin: /<[\w-]+>/}]
    }
  }
}());
hljs.registerLanguage("objectivec", function () {
  "use strict";
  return function (e) {
    var n = /[a-zA-Z@][a-zA-Z0-9_]*/, _ = {$pattern: n, keyword: "@interface @class @protocol @implementation"};
    return {
      name: "Objective-C",
      aliases: ["mm", "objc", "obj-c"],
      keywords: {
        $pattern: n,
        keyword: "int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign readwrite self @synchronized id typeof nonatomic super unichar IBOutlet IBAction strong weak copy in out inout bycopy byref oneway __strong __weak __block __autoreleasing @private @protected @public @try @property @end @throw @catch @finally @autoreleasepool @synthesize @dynamic @selector @optional @required @encode @package @import @defs @compatibility_alias __bridge __bridge_transfer __bridge_retained __bridge_retain __covariant __contravariant __kindof _Nonnull _Nullable _Null_unspecified __FUNCTION__ __PRETTY_FUNCTION__ __attribute__ getter setter retain unsafe_unretained nonnull nullable null_unspecified null_resettable class instancetype NS_DESIGNATED_INITIALIZER NS_UNAVAILABLE NS_REQUIRES_SUPER NS_RETURNS_INNER_POINTER NS_INLINE NS_AVAILABLE NS_DEPRECATED NS_ENUM NS_OPTIONS NS_SWIFT_UNAVAILABLE NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_REFINED_FOR_SWIFT NS_SWIFT_NAME NS_SWIFT_NOTHROW NS_DURING NS_HANDLER NS_ENDHANDLER NS_VALUERETURN NS_VOIDRETURN",
        literal: "false true FALSE TRUE nil YES NO NULL",
        built_in: "BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"
      },
      illegal: "</",
      contains: [{
        className: "built_in",
        begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
      }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, e.C_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
        className: "string",
        variants: [{begin: '@"', end: '"', illegal: "\\n", contains: [e.BACKSLASH_ESCAPE]}]
      }, {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {"meta-keyword": "if else elif endif define undef warning error line pragma ifdef ifndef include"},
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, e.inherit(e.QUOTE_STRING_MODE, {className: "meta-string"}), {
          className: "meta-string",
          begin: /<.*?>/,
          end: /$/,
          illegal: "\\n"
        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
      }, {
        className: "class",
        begin: "(" + _.keyword.split(" ").join("|") + ")\\b",
        end: "({|$)",
        excludeEnd: !0,
        keywords: _,
        contains: [e.UNDERSCORE_TITLE_MODE]
      }, {begin: "\\." + e.UNDERSCORE_IDENT_RE, relevance: 0}]
    }
  }
}());
hljs.registerLanguage("apache", function () {
  "use strict";
  return function (e) {
    var n = {className: "number", begin: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?"};
    return {
      name: "Apache config",
      aliases: ["apacheconf"],
      case_insensitive: !0,
      contains: [e.HASH_COMMENT_MODE, {
        className: "section",
        begin: "</?",
        end: ">",
        contains: [n, {className: "number", begin: ":\\d{1,5}"}, e.inherit(e.QUOTE_STRING_MODE, {relevance: 0})]
      }, {
        className: "attribute",
        begin: /\w+/,
        relevance: 0,
        keywords: {nomarkup: "order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"},
        starts: {
          end: /$/,
          relevance: 0,
          keywords: {literal: "on off all deny allow"},
          contains: [{className: "meta", begin: "\\s\\[", end: "\\]$"}, {
            className: "variable",
            begin: "[\\$%]\\{",
            end: "\\}",
            contains: ["self", {className: "number", begin: "[\\$%]\\d+"}]
          }, n, {className: "number", begin: "\\d+"}, e.QUOTE_STRING_MODE]
        }
      }],
      illegal: /\S/
    }
  }
}());
hljs.registerLanguage("coffeescript", function () {
  "use strict";
  const e = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
    n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
    a = [].concat(["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"], ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer"], ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]);
  return function (r) {
    var t = {
        keyword: e.concat(["then", "unless", "until", "loop", "by", "when", "and", "or", "is", "isnt", "not"]).filter((e => n => !e.includes(n))(["var", "const", "let", "function", "static"])).join(" "),
        literal: n.concat(["yes", "no", "on", "off"]).join(" "),
        built_in: a.concat(["npm", "print"]).join(" ")
      }, i = "[A-Za-z$_][0-9A-Za-z$_]*", s = {className: "subst", begin: /#\{/, end: /}/, keywords: t},
      o = [r.BINARY_NUMBER_MODE, r.inherit(r.C_NUMBER_MODE, {
        starts: {
          end: "(\\s*/)?",
          relevance: 0
        }
      }), {
        className: "string",
        variants: [{begin: /'''/, end: /'''/, contains: [r.BACKSLASH_ESCAPE]}, {
          begin: /'/,
          end: /'/,
          contains: [r.BACKSLASH_ESCAPE]
        }, {begin: /"""/, end: /"""/, contains: [r.BACKSLASH_ESCAPE, s]}, {
          begin: /"/,
          end: /"/,
          contains: [r.BACKSLASH_ESCAPE, s]
        }]
      }, {
        className: "regexp",
        variants: [{
          begin: "///",
          end: "///",
          contains: [s, r.HASH_COMMENT_MODE]
        }, {begin: "//[gim]{0,3}(?=\\W)", relevance: 0}, {begin: /\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/}]
      }, {begin: "@" + i}, {
        subLanguage: "javascript",
        excludeBegin: !0,
        excludeEnd: !0,
        variants: [{begin: "```", end: "```"}, {begin: "`", end: "`"}]
      }];
    s.contains = o;
    var c = r.inherit(r.TITLE_MODE, {begin: i}), l = {
      className: "params",
      begin: "\\([^\\(]",
      returnBegin: !0,
      contains: [{begin: /\(/, end: /\)/, keywords: t, contains: ["self"].concat(o)}]
    };
    return {
      name: "CoffeeScript",
      aliases: ["coffee", "cson", "iced"],
      keywords: t,
      illegal: /\/\*/,
      contains: o.concat([r.COMMENT("###", "###"), r.HASH_COMMENT_MODE, {
        className: "function",
        begin: "^\\s*" + i + "\\s*=\\s*(\\(.*\\))?\\s*\\B[-=]>",
        end: "[-=]>",
        returnBegin: !0,
        contains: [c, l]
      }, {
        begin: /[:\(,=]\s*/,
        relevance: 0,
        contains: [{
          className: "function",
          begin: "(\\(.*\\))?\\s*\\B[-=]>",
          end: "[-=]>",
          returnBegin: !0,
          contains: [l]
        }]
      }, {
        className: "class",
        beginKeywords: "class",
        end: "$",
        illegal: /[:="\[\]]/,
        contains: [{beginKeywords: "extends", endsWithParent: !0, illegal: /[:="\[\]]/, contains: [c]}, c]
      }, {begin: i + ":", end: ":", returnBegin: !0, returnEnd: !0, relevance: 0}])
    }
  }
}());
hljs.registerLanguage("ruby", function () {
  "use strict";
  return function (e) {
    var n = "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?", a = {
        keyword: "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",
        literal: "true false nil"
      }, s = {className: "doctag", begin: "@[A-Za-z]+"}, i = {begin: "#<", end: ">"},
      r = [e.COMMENT("#", "$", {contains: [s]}), e.COMMENT("^\\=begin", "^\\=end", {
        contains: [s],
        relevance: 10
      }), e.COMMENT("^__END__", "\\n$")], c = {className: "subst", begin: "#\\{", end: "}", keywords: a}, t = {
        className: "string",
        contains: [e.BACKSLASH_ESCAPE, c],
        variants: [{begin: /'/, end: /'/}, {begin: /"/, end: /"/}, {begin: /`/, end: /`/}, {
          begin: "%[qQwWx]?\\(",
          end: "\\)"
        }, {begin: "%[qQwWx]?\\[", end: "\\]"}, {begin: "%[qQwWx]?{", end: "}"}, {
          begin: "%[qQwWx]?<",
          end: ">"
        }, {begin: "%[qQwWx]?/", end: "/"}, {begin: "%[qQwWx]?%", end: "%"}, {
          begin: "%[qQwWx]?-",
          end: "-"
        }, {
          begin: "%[qQwWx]?\\|",
          end: "\\|"
        }, {begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/}, {
          begin: /<<[-~]?'?(\w+)(?:.|\n)*?\n\s*\1\b/,
          returnBegin: !0,
          contains: [{begin: /<<[-~]?'?/}, e.END_SAME_AS_BEGIN({
            begin: /(\w+)/,
            end: /(\w+)/,
            contains: [e.BACKSLASH_ESCAPE, c]
          })]
        }]
      }, b = {className: "params", begin: "\\(", end: "\\)", endsParent: !0, keywords: a}, d = [t, i, {
        className: "class",
        beginKeywords: "class module",
        end: "$|;",
        illegal: /=/,
        contains: [e.inherit(e.TITLE_MODE, {begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}), {
          begin: "<\\s*",
          contains: [{begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE}]
        }].concat(r)
      }, {
        className: "function",
        beginKeywords: "def",
        end: "$|;",
        contains: [e.inherit(e.TITLE_MODE, {begin: n}), b].concat(r)
      }, {begin: e.IDENT_RE + "::"}, {
        className: "symbol",
        begin: e.UNDERSCORE_IDENT_RE + "(\\!|\\?)?:",
        relevance: 0
      }, {className: "symbol", begin: ":(?!\\s)", contains: [t, {begin: n}], relevance: 0}, {
        className: "number",
        begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
        relevance: 0
      }, {begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))"}, {
        className: "params",
        begin: /\|/,
        end: /\|/,
        keywords: a
      }, {
        begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
        keywords: "unless",
        contains: [i, {
          className: "regexp",
          contains: [e.BACKSLASH_ESCAPE, c],
          illegal: /\n/,
          variants: [{begin: "/", end: "/[a-z]*"}, {begin: "%r{", end: "}[a-z]*"}, {
            begin: "%r\\(",
            end: "\\)[a-z]*"
          }, {begin: "%r!", end: "![a-z]*"}, {begin: "%r\\[", end: "\\][a-z]*"}]
        }].concat(r),
        relevance: 0
      }].concat(r);
    c.contains = d, b.contains = d;
    var g = [{begin: /^\s*=>/, starts: {end: "$", contains: d}}, {
      className: "meta",
      begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>)",
      starts: {end: "$", contains: d}
    }];
    return {
      name: "Ruby",
      aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
      keywords: a,
      illegal: /\/\*/,
      contains: r.concat(g).concat(d)
    }
  }
}());
hljs.registerLanguage("csharp", function () {
  "use strict";
  return function (e) {
    var n = {
        keyword: "abstract as base bool break byte case catch char checked const continue decimal default delegate do double enum event explicit extern finally fixed float for foreach goto if implicit in init int interface internal is lock long object operator out override params private protected public readonly ref sbyte sealed short sizeof stackalloc static string struct switch this try typeof uint ulong unchecked unsafe ushort using virtual void volatile while add alias ascending async await by descending dynamic equals from get global group into join let nameof on orderby partial remove select set value var when where yield",
        literal: "null false true"
      }, i = e.inherit(e.TITLE_MODE, {begin: "[a-zA-Z](\\.?\\w)*"}), a = {
        className: "number",
        variants: [{begin: "\\b(0b[01']+)"}, {begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"}, {begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"}],
        relevance: 0
      }, s = {className: "string", begin: '@"', end: '"', contains: [{begin: '""'}]},
      t = e.inherit(s, {illegal: /\n/}), l = {className: "subst", begin: "{", end: "}", keywords: n},
      r = e.inherit(l, {illegal: /\n/}), c = {
        className: "string",
        begin: /\$"/,
        end: '"',
        illegal: /\n/,
        contains: [{begin: "{{"}, {begin: "}}"}, e.BACKSLASH_ESCAPE, r]
      }, o = {
        className: "string",
        begin: /\$@"/,
        end: '"',
        contains: [{begin: "{{"}, {begin: "}}"}, {begin: '""'}, l]
      }, g = e.inherit(o, {illegal: /\n/, contains: [{begin: "{{"}, {begin: "}}"}, {begin: '""'}, r]});
    l.contains = [o, c, s, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, a, e.C_BLOCK_COMMENT_MODE], r.contains = [g, c, t, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, a, e.inherit(e.C_BLOCK_COMMENT_MODE, {illegal: /\n/})];
    var d = {variants: [o, c, s, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]},
      E = {begin: "<", end: ">", contains: [{beginKeywords: "in out"}, i]},
      _ = e.IDENT_RE + "(<" + e.IDENT_RE + "(\\s*,\\s*" + e.IDENT_RE + ")*>)?(\\[\\])?",
      b = {begin: "@" + e.IDENT_RE, relevance: 0};
    return {
      name: "C#",
      aliases: ["cs", "c#"],
      keywords: n,
      illegal: /::/,
      contains: [e.COMMENT("///", "$", {
        returnBegin: !0,
        contains: [{
          className: "doctag",
          variants: [{begin: "///", relevance: 0}, {begin: "\x3c!--|--\x3e"}, {begin: "</?", end: ">"}]
        }]
      }), e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
        className: "meta",
        begin: "#",
        end: "$",
        keywords: {"meta-keyword": "if else elif endif define undef warning error line region endregion pragma checksum"}
      }, d, a, {
        beginKeywords: "class interface",
        end: /[{;=]/,
        illegal: /[^\s:,]/,
        contains: [{beginKeywords: "where class"}, i, E, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
      }, {
        beginKeywords: "namespace",
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [i, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
      }, {
        beginKeywords: "record",
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [i, E, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
      }, {
        className: "meta",
        begin: "^\\s*\\[",
        excludeBegin: !0,
        end: "\\]",
        excludeEnd: !0,
        contains: [{className: "meta-string", begin: /"/, end: /"/}]
      }, {beginKeywords: "new return throw await else", relevance: 0}, {
        className: "function",
        begin: "(" + _ + "\\s+)+" + e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
        returnBegin: !0,
        end: /\s*[{;=]/,
        excludeEnd: !0,
        keywords: n,
        contains: [{
          begin: e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
          returnBegin: !0,
          contains: [e.TITLE_MODE, E],
          relevance: 0
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: n,
          relevance: 0,
          contains: [d, a, e.C_BLOCK_COMMENT_MODE]
        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
      }, b]
    }
  }
}());
hljs.registerLanguage("properties", function () {
  "use strict";
  return function (e) {
    var n = "[ \\t\\f]*", t = "(" + n + "[:=]" + n + "|[ \\t\\f]+)", a = "([^\\\\:= \\t\\f\\n]|\\\\.)+", s = {
      end: t,
      relevance: 0,
      starts: {className: "string", end: /$/, relevance: 0, contains: [{begin: "\\\\\\n"}]}
    };
    return {
      name: ".properties",
      case_insensitive: !0,
      illegal: /\S/,
      contains: [e.COMMENT("^\\s*[!#]", "$"), {
        begin: "([^\\\\\\W:= \\t\\f\\n]|\\\\.)+" + t,
        returnBegin: !0,
        contains: [{className: "attr", begin: "([^\\\\\\W:= \\t\\f\\n]|\\\\.)+", endsParent: !0, relevance: 0}],
        starts: s
      }, {
        begin: a + t,
        returnBegin: !0,
        relevance: 0,
        contains: [{className: "meta", begin: a, endsParent: !0, relevance: 0}],
        starts: s
      }, {className: "attr", relevance: 0, begin: a + n + "$"}]
    }
  }
}());
hljs.registerLanguage("scss", function () {
  "use strict";
  return function (e) {
    var t = {className: "variable", begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b"},
      i = {className: "number", begin: "#[0-9A-Fa-f]+"};
    return e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, e.C_BLOCK_COMMENT_MODE, {
      name: "SCSS",
      case_insensitive: !0,
      illegal: "[=/|']",
      contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
        className: "selector-id",
        begin: "\\#[A-Za-z0-9_-]+",
        relevance: 0
      }, {className: "selector-class", begin: "\\.[A-Za-z0-9_-]+", relevance: 0}, {
        className: "selector-attr",
        begin: "\\[",
        end: "\\]",
        illegal: "$"
      }, {
        className: "selector-tag",
        begin: "\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
        relevance: 0
      }, {
        className: "selector-pseudo",
        begin: ":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"
      }, {
        className: "selector-pseudo",
        begin: "::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"
      }, t, {
        className: "attribute",
        begin: "\\b(src|z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
        illegal: "[^\\s]"
      }, {begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"}, {
        begin: ":",
        end: ";",
        contains: [t, i, e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
          className: "meta",
          begin: "!important"
        }]
      }, {begin: "@(page|font-face)", lexemes: "@[a-z-]+", keywords: "@page @font-face"}, {
        begin: "@",
        end: "[{;]",
        returnBegin: !0,
        keywords: "and or not only",
        contains: [{
          begin: "@[a-z-]+",
          className: "keyword"
        }, t, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, i, e.CSS_NUMBER_MODE]
      }]
    }
  }
}());
hljs.registerLanguage("swift", function () {
  "use strict";
  return function (e) {
    var i = {
        keyword: "#available #colorLiteral #column #else #elseif #endif #file #fileLiteral #function #if #imageLiteral #line #selector #sourceLocation _ __COLUMN__ __FILE__ __FUNCTION__ __LINE__ Any as as! as? associatedtype associativity break case catch class continue convenience default defer deinit didSet do dynamic dynamicType else enum extension fallthrough false fileprivate final for func get guard if import in indirect infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol Protocol public repeat required rethrows return right self Self set static struct subscript super switch throw throws true try try! try? Type typealias unowned var weak where while willSet",
        literal: "true false nil",
        built_in: "abs advance alignof alignofValue anyGenerator assert assertionFailure bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC bridgeToObjectiveCUnconditional c compactMap contains count countElements countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords enumerate equal fatalError filter find getBridgedObjectiveCType getVaList indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC isUniquelyReferenced isUniquelyReferencedNonObjC join lazy lexicographicalCompare map max maxElement min minElement numericCast overlaps partition posix precondition preconditionFailure print println quickSort readLine reduce reflect reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split startsWith stride strideof strideofValue swap toString transcode underestimateCount unsafeAddressOf unsafeBitCast unsafeDowncast unsafeUnwrap unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer withUnsafePointerToObject withUnsafeMutablePointer withUnsafeMutablePointers withUnsafePointer withUnsafePointers withVaList zip"
      }, n = e.COMMENT("/\\*", "\\*/", {contains: ["self"]}),
      t = {className: "subst", begin: /\\\(/, end: "\\)", keywords: i, contains: []}, a = {
        className: "string",
        contains: [e.BACKSLASH_ESCAPE, t],
        variants: [{begin: /"""/, end: /"""/}, {begin: /"/, end: /"/}]
      }, r = {
        className: "number",
        begin: "\\b([\\d_]+(\\.[\\deE_]+)?|0x[a-fA-F0-9_]+(\\.[a-fA-F0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b",
        relevance: 0
      };
    return t.contains = [r], {
      name: "Swift",
      keywords: i,
      contains: [a, e.C_LINE_COMMENT_MODE, n, {
        className: "type",
        begin: "\\b[A-Z][\\wÀ-ʸ']*[!?]"
      }, {className: "type", begin: "\\b[A-Z][\\wÀ-ʸ']*", relevance: 0}, r, {
        className: "function",
        beginKeywords: "func",
        end: "{",
        excludeEnd: !0,
        contains: [e.inherit(e.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/}), {
          begin: /</,
          end: />/
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          endsParent: !0,
          keywords: i,
          contains: ["self", r, a, e.C_BLOCK_COMMENT_MODE, {begin: ":"}],
          illegal: /["']/
        }],
        illegal: /\[|%/
      }, {
        className: "class",
        beginKeywords: "struct protocol class extension enum",
        keywords: i,
        end: "\\{",
        excludeEnd: !0,
        contains: [e.inherit(e.TITLE_MODE, {begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/})]
      }, {
        className: "meta",
        begin: "(@discardableResult|@warn_unused_result|@exported|@lazy|@noescape|@NSCopying|@NSManaged|@objc|@objcMembers|@convention|@required|@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|@infix|@prefix|@postfix|@autoclosure|@testable|@available|@nonobjc|@NSApplicationMain|@UIApplicationMain|@dynamicMemberLookup|@propertyWrapper)\\b"
      }, {beginKeywords: "import", end: /$/, contains: [e.C_LINE_COMMENT_MODE, n]}]
    }
  }
}());
hljs.registerLanguage("applescript", function () {
  "use strict";
  return function (e) {
    var t = e.inherit(e.QUOTE_STRING_MODE, {illegal: ""}),
      r = {className: "params", begin: "\\(", end: "\\)", contains: ["self", e.C_NUMBER_MODE, t]},
      n = e.COMMENT("--", "$"),
      i = [n, e.COMMENT("\\(\\*", "\\*\\)", {contains: ["self", n]}), e.HASH_COMMENT_MODE];
    return {
      name: "AppleScript",
      aliases: ["osascript"],
      keywords: {
        keyword: "about above after against and around as at back before beginning behind below beneath beside between but by considering contain contains continue copy div does eighth else end equal equals error every exit fifth first for fourth from front get given global if ignoring in into is it its last local me middle mod my ninth not of on onto or over prop property put ref reference repeat returning script second set seventh since sixth some tell tenth that the|0 then third through thru timeout times to transaction try until where while whose with without",
        literal: "AppleScript false linefeed return pi quote result space tab true",
        built_in: "alias application boolean class constant date file integer list number real record string text activate beep count delay launch log offset read round run say summarize write character characters contents day frontmost id item length month name paragraph paragraphs rest reverse running time version weekday word words year"
      },
      contains: [t, e.C_NUMBER_MODE, {
        className: "built_in",
        begin: "\\b(clipboard info|the clipboard|info for|list (disks|folder)|mount volume|path to|(close|open for) access|(get|set) eof|current date|do shell script|get volume settings|random number|set volume|system attribute|system info|time to GMT|(load|run|store) script|scripting components|ASCII (character|number)|localized string|choose (application|color|file|file name|folder|from list|remote application|URL)|display (alert|dialog))\\b|^\\s*return\\b"
      }, {
        className: "literal",
        begin: "\\b(text item delimiters|current application|missing value)\\b"
      }, {
        className: "keyword",
        begin: "\\b(apart from|aside from|instead of|out of|greater than|isn't|(doesn't|does not) (equal|come before|come after|contain)|(greater|less) than( or equal)?|(starts?|ends|begins?) with|contained by|comes (before|after)|a (ref|reference)|POSIX file|POSIX path|(date|time) string|quoted form)\\b"
      }, {beginKeywords: "on", illegal: "[${=;\\n]", contains: [e.UNDERSCORE_TITLE_MODE, r]}].concat(i),
      illegal: "//|->|=>|\\[\\["
    }
  }
}());
hljs.registerLanguage("asciidoc", function () {
  "use strict";
  return function (e) {
    return {
      name: "AsciiDoc",
      aliases: ["adoc"],
      contains: [e.COMMENT("^/{4,}\\n", "\\n/{4,}$", {relevance: 10}), e.COMMENT("^//", "$", {relevance: 0}), {
        className: "title",
        begin: "^\\.\\w.*$"
      }, {begin: "^[=\\*]{4,}\\n", end: "\\n^[=\\*]{4,}$", relevance: 10}, {
        className: "section",
        relevance: 10,
        variants: [{begin: "^(={1,5}) .+?( \\1)?$"}, {begin: "^[^\\[\\]\\n]+?\\n[=\\-~\\^\\+]{2,}$"}]
      }, {className: "meta", begin: "^:.+?:", end: "\\s", excludeEnd: !0, relevance: 10}, {
        className: "meta",
        begin: "^\\[.+?\\]$",
        relevance: 0
      }, {className: "quote", begin: "^_{4,}\\n", end: "\\n_{4,}$", relevance: 10}, {
        className: "code",
        begin: "^[\\-\\.]{4,}\\n",
        end: "\\n[\\-\\.]{4,}$",
        relevance: 10
      }, {
        begin: "^\\+{4,}\\n",
        end: "\\n\\+{4,}$",
        contains: [{begin: "<", end: ">", subLanguage: "xml", relevance: 0}],
        relevance: 10
      }, {className: "bullet", begin: "^(\\*+|\\-+|\\.+|[^\\n]+?::)\\s+"}, {
        className: "symbol",
        begin: "^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",
        relevance: 10
      }, {
        className: "strong",
        begin: "\\B\\*(?![\\*\\s])",
        end: "(\\n{2}|\\*)",
        contains: [{begin: "\\\\*\\w", relevance: 0}]
      }, {
        className: "emphasis",
        begin: "\\B'(?!['\\s])",
        end: "(\\n{2}|')",
        contains: [{begin: "\\\\'\\w", relevance: 0}],
        relevance: 0
      }, {className: "emphasis", begin: "_(?![_\\s])", end: "(\\n{2}|_)", relevance: 0}, {
        className: "string",
        variants: [{begin: "``.+?''"}, {begin: "`.+?'"}]
      }, {className: "code", begin: "(`.+?`|\\+.+?\\+)", relevance: 0}, {
        className: "code",
        begin: "^[ \\t]",
        end: "$",
        relevance: 0
      }, {
        begin: "^'{3,}[ \\t]*$",
        relevance: 10
      }, {
        begin: "(link:)?(http|https|ftp|file|irc|image:?):\\S+\\[.*?\\]",
        returnBegin: !0,
        contains: [{begin: "(link|image:?):", relevance: 0}, {
          className: "link",
          begin: "\\w",
          end: "[^\\[]+",
          relevance: 0
        }, {className: "string", begin: "\\[", end: "\\]", excludeBegin: !0, excludeEnd: !0, relevance: 0}],
        relevance: 10
      }]
    }
  }
}());
hljs.registerLanguage("java", function () {
  "use strict";

  function e(e) {
    return e ? "string" == typeof e ? e : e.source : null
  }

  function n(e) {
    return a("(", e, ")?")
  }

  function a(...n) {
    return n.map(n => e(n)).join("")
  }

  function s(...n) {
    return "(" + n.map(n => e(n)).join("|") + ")"
  }

  return function (e) {
    var t = "false synchronized int abstract float private char boolean var static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private module requires exports do",
      i = {
        className: "meta",
        begin: "@[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*",
        contains: [{begin: /\(/, end: /\)/, contains: ["self"]}]
      }, r = e => a("[", e, "]+([", e, "_]*[", e, "]+)?"), c = {
        className: "number",
        variants: [{begin: `\\b(0[bB]${r("01")})[lL]?`}, {begin: `\\b(0${r("0-7")})[dDfFlL]?`}, {begin: a(/\b0[xX]/, s(a(r("a-fA-F0-9"), /\./, r("a-fA-F0-9")), a(r("a-fA-F0-9"), /\.?/), a(/\./, r("a-fA-F0-9"))), /([pP][+-]?(\d+))?/, /[fFdDlL]?/)}, {begin: a(/\b/, s(a(/\d*\./, r("\\d")), r("\\d")), /[eE][+-]?[\d]+[dDfF]?/)}, {begin: a(/\b/, r(/\d/), n(/\.?/), n(r(/\d/)), /[dDfFlL]?/)}],
        relevance: 0
      };
    return {
      name: "Java",
      aliases: ["jsp"],
      keywords: t,
      illegal: /<\/|#/,
      contains: [e.COMMENT("/\\*\\*", "\\*/", {
        relevance: 0,
        contains: [{begin: /\w+@/, relevance: 0}, {className: "doctag", begin: "@[A-Za-z]+"}]
      }), e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
        className: "class",
        beginKeywords: "class interface enum",
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: "class interface enum",
        illegal: /[:"\[\]]/,
        contains: [{beginKeywords: "extends implements"}, e.UNDERSCORE_TITLE_MODE]
      }, {beginKeywords: "new throw return else", relevance: 0}, {
        className: "function",
        begin: "([À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(<[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(\\s*,\\s*[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*)*>)?\\s+)+" + e.UNDERSCORE_IDENT_RE + "\\s*\\(",
        returnBegin: !0,
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: t,
        contains: [{
          begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
          returnBegin: !0,
          relevance: 0,
          contains: [e.UNDERSCORE_TITLE_MODE]
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: t,
          relevance: 0,
          contains: [i, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.C_NUMBER_MODE, e.C_BLOCK_COMMENT_MODE]
        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
      }, c, i]
    }
  }
}());
hljs.registerLanguage("javascript", function () {
  "use strict";
  const e = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
    n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
    a = [].concat(["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"], ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer"], ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]);

  function s(e) {
    return r("(?=", e, ")")
  }

  function r(...e) {
    return e.map(e => (function (e) {
      return e ? "string" == typeof e ? e : e.source : null
    })(e)).join("")
  }

  return function (t) {
    var i = "[A-Za-z$_][0-9A-Za-z$_]*", c = {begin: /<[A-Za-z0-9\\._:-]+/, end: /\/[A-Za-z0-9\\._:-]+>|\/>/}, o = {
      $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
      keyword: e.join(" "),
      literal: n.join(" "),
      built_in: a.join(" ")
    }, l = {
      className: "number",
      variants: [{begin: "\\b(0[bB][01]+)n?"}, {begin: "\\b(0[oO][0-7]+)n?"}, {begin: t.C_NUMBER_RE + "n?"}],
      relevance: 0
    }, E = {className: "subst", begin: "\\$\\{", end: "\\}", keywords: o, contains: []}, d = {
      begin: "html`",
      end: "",
      starts: {end: "`", returnEnd: !1, contains: [t.BACKSLASH_ESCAPE, E], subLanguage: "xml"}
    }, g = {
      begin: "css`",
      end: "",
      starts: {end: "`", returnEnd: !1, contains: [t.BACKSLASH_ESCAPE, E], subLanguage: "css"}
    }, u = {className: "string", begin: "`", end: "`", contains: [t.BACKSLASH_ESCAPE, E]};
    E.contains = [t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, d, g, u, l, t.REGEXP_MODE];
    var b = E.contains.concat([{
        begin: /\(/,
        end: /\)/,
        contains: ["self"].concat(E.contains, [t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE])
      }, t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE]),
      _ = {className: "params", begin: /\(/, end: /\)/, excludeBegin: !0, excludeEnd: !0, contains: b};
    return {
      name: "JavaScript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: o,
      contains: [t.SHEBANG({binary: "node", relevance: 5}), {
        className: "meta",
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      }, t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, d, g, u, t.C_LINE_COMMENT_MODE, t.COMMENT("/\\*\\*", "\\*/", {
        relevance: 0,
        contains: [{
          className: "doctag",
          begin: "@[A-Za-z]+",
          contains: [{className: "type", begin: "\\{", end: "\\}", relevance: 0}, {
            className: "variable",
            begin: i + "(?=\\s*(-)|$)",
            endsParent: !0,
            relevance: 0
          }, {begin: /(?=[^\n])\s/, relevance: 0}]
        }]
      }), t.C_BLOCK_COMMENT_MODE, l, {
        begin: r(/[{,\n]\s*/, s(r(/(((\/\/.*$)|(\/\*(.|\n)*\*\/))\s*)*/, i + "\\s*:"))),
        relevance: 0,
        contains: [{className: "attr", begin: i + s("\\s*:"), relevance: 0}]
      }, {
        begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        contains: [t.C_LINE_COMMENT_MODE, t.C_BLOCK_COMMENT_MODE, t.REGEXP_MODE, {
          className: "function",
          begin: "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" + t.UNDERSCORE_IDENT_RE + ")\\s*=>",
          returnBegin: !0,
          end: "\\s*=>",
          contains: [{
            className: "params",
            variants: [{begin: t.UNDERSCORE_IDENT_RE}, {
              className: null,
              begin: /\(\s*\)/,
              skip: !0
            }, {begin: /\(/, end: /\)/, excludeBegin: !0, excludeEnd: !0, keywords: o, contains: b}]
          }]
        }, {begin: /,/, relevance: 0}, {
          className: "",
          begin: /\s/,
          end: /\s*/,
          skip: !0
        }, {
          variants: [{begin: "<>", end: "</>"}, {begin: c.begin, end: c.end}],
          subLanguage: "xml",
          contains: [{begin: c.begin, end: c.end, skip: !0, contains: ["self"]}]
        }],
        relevance: 0
      }, {
        className: "function",
        beginKeywords: "function",
        end: /\{/,
        excludeEnd: !0,
        contains: [t.inherit(t.TITLE_MODE, {begin: i}), _],
        illegal: /\[|%/
      }, {begin: /\$[(.]/}, t.METHOD_GUARD, {
        className: "class",
        beginKeywords: "class",
        end: /[{;=]/,
        excludeEnd: !0,
        illegal: /[:"\[\]]/,
        contains: [{beginKeywords: "extends"}, t.UNDERSCORE_TITLE_MODE]
      }, {beginKeywords: "constructor", end: /\{/, excludeEnd: !0}, {
        begin: "(get|set)\\s+(?=" + i + "\\()",
        end: /{/,
        keywords: "get set",
        contains: [t.inherit(t.TITLE_MODE, {begin: i}), {begin: /\(\)/}, _]
      }],
      illegal: /#(?!!)/
    }
  }
}());
hljs.registerLanguage("typescript", function () {
  "use strict";
  const e = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
    n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
    a = [].concat(["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"], ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer"], ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]);
  return function (r) {
    var t = {
      $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
      keyword: e.concat(["type", "namespace", "typedef", "interface", "public", "private", "protected", "implements", "declare", "abstract", "readonly"]).join(" "),
      literal: n.join(" "),
      built_in: a.concat(["any", "void", "number", "boolean", "string", "object", "never", "enum"]).join(" ")
    }, s = {className: "meta", begin: "@[A-Za-z$_][0-9A-Za-z$_]*"}, i = {
      className: "number",
      variants: [{begin: "\\b(0[bB][01]+)n?"}, {begin: "\\b(0[oO][0-7]+)n?"}, {begin: r.C_NUMBER_RE + "n?"}],
      relevance: 0
    }, o = {className: "subst", begin: "\\$\\{", end: "\\}", keywords: t, contains: []}, c = {
      begin: "html`",
      end: "",
      starts: {end: "`", returnEnd: !1, contains: [r.BACKSLASH_ESCAPE, o], subLanguage: "xml"}
    }, l = {
      begin: "css`",
      end: "",
      starts: {end: "`", returnEnd: !1, contains: [r.BACKSLASH_ESCAPE, o], subLanguage: "css"}
    }, E = {className: "string", begin: "`", end: "`", contains: [r.BACKSLASH_ESCAPE, o]};
    o.contains = [r.APOS_STRING_MODE, r.QUOTE_STRING_MODE, c, l, E, i, r.REGEXP_MODE];
    var d = {
      begin: "\\(",
      end: /\)/,
      keywords: t,
      contains: ["self", r.QUOTE_STRING_MODE, r.APOS_STRING_MODE, r.NUMBER_MODE]
    }, u = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      excludeBegin: !0,
      excludeEnd: !0,
      keywords: t,
      contains: [r.C_LINE_COMMENT_MODE, r.C_BLOCK_COMMENT_MODE, s, d]
    };
    return {
      name: "TypeScript",
      aliases: ["ts"],
      keywords: t,
      contains: [r.SHEBANG(), {
        className: "meta",
        begin: /^\s*['"]use strict['"]/
      }, r.APOS_STRING_MODE, r.QUOTE_STRING_MODE, c, l, E, r.C_LINE_COMMENT_MODE, r.C_BLOCK_COMMENT_MODE, i, {
        begin: "(" + r.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        contains: [r.C_LINE_COMMENT_MODE, r.C_BLOCK_COMMENT_MODE, r.REGEXP_MODE, {
          className: "function",
          begin: "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" + r.UNDERSCORE_IDENT_RE + ")\\s*=>",
          returnBegin: !0,
          end: "\\s*=>",
          contains: [{
            className: "params",
            variants: [{begin: r.UNDERSCORE_IDENT_RE}, {
              className: null,
              begin: /\(\s*\)/,
              skip: !0
            }, {
              begin: /\(/,
              end: /\)/,
              excludeBegin: !0,
              excludeEnd: !0,
              keywords: t,
              contains: d.contains
            }]
          }]
        }],
        relevance: 0
      }, {
        className: "function",
        beginKeywords: "function",
        end: /[\{;]/,
        excludeEnd: !0,
        keywords: t,
        contains: ["self", r.inherit(r.TITLE_MODE, {begin: "[A-Za-z$_][0-9A-Za-z$_]*"}), u],
        illegal: /%/,
        relevance: 0
      }, {beginKeywords: "constructor", end: /[\{;]/, excludeEnd: !0, contains: ["self", u]}, {
        begin: /module\./,
        keywords: {built_in: "module"},
        relevance: 0
      }, {beginKeywords: "module", end: /\{/, excludeEnd: !0}, {
        beginKeywords: "interface",
        end: /\{/,
        excludeEnd: !0,
        keywords: "interface extends"
      }, {begin: /\$[(.]/}, {begin: "\\." + r.IDENT_RE, relevance: 0}, s, d]
    }
  }
}());
hljs.registerLanguage("arduino", function () {
  "use strict";
  return function (e) {
    var t = e.requireLanguage("cpp").rawDefinition(), r = t.keywords;
    return r.keyword += " boolean byte word String", r.literal += " DIGITAL_MESSAGE FIRMATA_STRING ANALOG_MESSAGE REPORT_DIGITAL REPORT_ANALOG INPUT_PULLUP SET_PIN_MODE INTERNAL2V56 SYSTEM_RESET LED_BUILTIN INTERNAL1V1 SYSEX_START INTERNAL EXTERNAL DEFAULT OUTPUT INPUT HIGH LOW", r.built_in += " setup loop KeyboardController MouseController SoftwareSerial EthernetServer EthernetClient LiquidCrystal RobotControl GSMVoiceCall EthernetUDP EsploraTFT HttpClient RobotMotor WiFiClient GSMScanner FileSystem Scheduler GSMServer YunClient YunServer IPAddress GSMClient GSMModem Keyboard Ethernet Console GSMBand Esplora Stepper Process WiFiUDP GSM_SMS Mailbox USBHost Firmata PImage Client Server GSMPIN FileIO Bridge Serial EEPROM Stream Mouse Audio Servo File Task GPRS WiFi Wire TFT GSM SPI SD runShellCommandAsynchronously analogWriteResolution retrieveCallingNumber printFirmwareVersion analogReadResolution sendDigitalPortPair noListenOnLocalhost readJoystickButton setFirmwareVersion readJoystickSwitch scrollDisplayRight getVoiceCallStatus scrollDisplayLeft writeMicroseconds delayMicroseconds beginTransmission getSignalStrength runAsynchronously getAsynchronously listenOnLocalhost getCurrentCarrier readAccelerometer messageAvailable sendDigitalPorts lineFollowConfig countryNameWrite runShellCommand readStringUntil rewindDirectory readTemperature setClockDivider readLightSensor endTransmission analogReference detachInterrupt countryNameRead attachInterrupt encryptionType readBytesUntil robotNameWrite readMicrophone robotNameRead cityNameWrite userNameWrite readJoystickY readJoystickX mouseReleased openNextFile scanNetworks noInterrupts digitalWrite beginSpeaker mousePressed isActionDone mouseDragged displayLogos noAutoscroll addParameter remoteNumber getModifiers keyboardRead userNameRead waitContinue processInput parseCommand printVersion readNetworks writeMessage blinkVersion cityNameRead readMessage setDataMode parsePacket isListening setBitOrder beginPacket isDirectory motorsWrite drawCompass digitalRead clearScreen serialEvent rightToLeft setTextSize leftToRight requestFrom keyReleased compassRead analogWrite interrupts WiFiServer disconnect playMelody parseFloat autoscroll getPINUsed setPINUsed setTimeout sendAnalog readSlider analogRead beginWrite createChar motorsStop keyPressed tempoWrite readButton subnetMask debugPrint macAddress writeGreen randomSeed attachGPRS readString sendString remotePort releaseAll mouseMoved background getXChange getYChange answerCall getResult voiceCall endPacket constrain getSocket writeJSON getButton available connected findUntil readBytes exitValue readGreen writeBlue startLoop IPAddress isPressed sendSysex pauseMode gatewayIP setCursor getOemKey tuneWrite noDisplay loadImage switchPIN onRequest onReceive changePIN playFile noBuffer parseInt overflow checkPIN knobRead beginTFT bitClear updateIR bitWrite position writeRGB highByte writeRed setSpeed readBlue noStroke remoteIP transfer shutdown hangCall beginSMS endWrite attached maintain noCursor checkReg checkPUK shiftOut isValid shiftIn pulseIn connect println localIP pinMode getIMEI display noBlink process getBand running beginSD drawBMP lowByte setBand release bitRead prepare pointTo readRed setMode noFill remove listen stroke detach attach noTone exists buffer height bitSet circle config cursor random IRread setDNS endSMS getKey micros millis begin print write ready flush width isPIN blink clear press mkdir rmdir close point yield image BSSID click delay read text move peek beep rect line open seek fill size turn stop home find step tone sqrt RSSI SSID end bit tan cos sin pow map abs max min get run put", t.name = "Arduino", t.aliases = ["ino"], t
  }
}());
hljs.registerLanguage("rust", function () {
  "use strict";
  return function (e) {
    var n = "([ui](8|16|32|64|128|size)|f(32|64))?",
      t = "drop i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 str char bool Box Option Result String Vec Copy Send Sized Sync Drop Fn FnMut FnOnce ToOwned Clone Debug PartialEq PartialOrd Eq Ord AsRef AsMut Into From Default Iterator Extend IntoIterator DoubleEndedIterator ExactSizeIterator SliceConcatExt ToString assert! assert_eq! bitflags! bytes! cfg! col! concat! concat_idents! debug_assert! debug_assert_eq! env! panic! file! format! format_args! include_bin! include_str! line! local_data_key! module_path! option_env! print! println! select! stringify! try! unimplemented! unreachable! vec! write! writeln! macro_rules! assert_ne! debug_assert_ne!";
    return {
      name: "Rust",
      aliases: ["rs"],
      keywords: {
        $pattern: e.IDENT_RE + "!?",
        keyword: "abstract as async await become box break const continue crate do dyn else enum extern false final fn for if impl in let loop macro match mod move mut override priv pub ref return self Self static struct super trait true try type typeof unsafe unsized use virtual where while yield",
        literal: "true false Some None Ok Err",
        built_in: t
      },
      illegal: "</",
      contains: [e.C_LINE_COMMENT_MODE, e.COMMENT("/\\*", "\\*/", {contains: ["self"]}), e.inherit(e.QUOTE_STRING_MODE, {
        begin: /b?"/,
        illegal: null
      }), {
        className: "string",
        variants: [{begin: /r(#*)"(.|\n)*?"\1(?!#)/}, {begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/}]
      }, {className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/}, {
        className: "number",
        variants: [{begin: "\\b0b([01_]+)" + n}, {begin: "\\b0o([0-7_]+)" + n}, {begin: "\\b0x([A-Fa-f0-9_]+)" + n}, {begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + n}],
        relevance: 0
      }, {
        className: "function",
        beginKeywords: "fn",
        end: "(\\(|<)",
        excludeEnd: !0,
        contains: [e.UNDERSCORE_TITLE_MODE]
      }, {
        className: "meta",
        begin: "#\\!?\\[",
        end: "\\]",
        contains: [{className: "meta-string", begin: /"/, end: /"/}]
      }, {
        className: "class",
        beginKeywords: "type",
        end: ";",
        contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, {endsParent: !0})],
        illegal: "\\S"
      }, {
        className: "class",
        beginKeywords: "trait enum struct union",
        end: "{",
        contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, {endsParent: !0})],
        illegal: "[\\w\\d]"
      }, {begin: e.IDENT_RE + "::", keywords: {built_in: t}}, {begin: "->"}]
    }
  }
}());
hljs.registerLanguage("nginx", function () {
  "use strict";
  return function (e) {
    var n = {
      className: "variable",
      variants: [{begin: /\$\d+/}, {begin: /\$\{/, end: /}/}, {begin: "[\\$\\@]" + e.UNDERSCORE_IDENT_RE}]
    }, a = {
      endsWithParent: !0,
      keywords: {
        $pattern: "[a-z/_]+",
        literal: "on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"
      },
      relevance: 0,
      illegal: "=>",
      contains: [e.HASH_COMMENT_MODE, {
        className: "string",
        contains: [e.BACKSLASH_ESCAPE, n],
        variants: [{begin: /"/, end: /"/}, {begin: /'/, end: /'/}]
      }, {
        begin: "([a-z]+):/",
        end: "\\s",
        endsWithParent: !0,
        excludeEnd: !0,
        contains: [n]
      }, {
        className: "regexp",
        contains: [e.BACKSLASH_ESCAPE, n],
        variants: [{begin: "\\s\\^", end: "\\s|{|;", returnEnd: !0}, {
          begin: "~\\*?\\s+",
          end: "\\s|{|;",
          returnEnd: !0
        }, {begin: "\\*(\\.[a-z\\-]+)+"}, {begin: "([a-z\\-]+\\.)+\\*"}]
      }, {
        className: "number",
        begin: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"
      }, {className: "number", begin: "\\b\\d+[kKmMgGdshdwy]*\\b", relevance: 0}, n]
    };
    return {
      name: "Nginx config",
      aliases: ["nginxconf"],
      contains: [e.HASH_COMMENT_MODE, {
        begin: e.UNDERSCORE_IDENT_RE + "\\s+{",
        returnBegin: !0,
        end: "{",
        contains: [{className: "section", begin: e.UNDERSCORE_IDENT_RE}],
        relevance: 0
      }, {
        begin: e.UNDERSCORE_IDENT_RE + "\\s",
        end: ";|{",
        returnBegin: !0,
        contains: [{className: "attribute", begin: e.UNDERSCORE_IDENT_RE, starts: a}],
        relevance: 0
      }],
      illegal: "[^\\s\\}]"
    }
  }
}());
hljs.registerLanguage("latex", function () {
  "use strict";
  return function (e) {
    var n = {
      className: "tag",
      begin: /\\/,
      relevance: 0,
      contains: [{
        className: "name",
        variants: [{begin: /[a-zA-Z\u0430-\u044f\u0410-\u042f]+[*]?/}, {begin: /[^a-zA-Z\u0430-\u044f\u0410-\u042f0-9]/}],
        starts: {
          endsWithParent: !0,
          relevance: 0,
          contains: [{
            className: "string",
            variants: [{begin: /\[/, end: /\]/}, {begin: /\{/, end: /\}/}]
          }, {
            begin: /\s*=\s*/,
            endsWithParent: !0,
            relevance: 0,
            contains: [{className: "number", begin: /-?\d*\.?\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?/}]
          }]
        }
      }]
    };
    return {
      name: "LaTeX",
      aliases: ["tex"],
      contains: [n, {
        className: "formula",
        contains: [n],
        relevance: 0,
        variants: [{begin: /\$\$/, end: /\$\$/}, {begin: /\$/, end: /\$/}]
      }, e.COMMENT("%", "$", {relevance: 0})]
    }
  }
}());
hljs.registerLanguage("yaml", function () {
  "use strict";
  return function (e) {
    var n = "true false yes no null", a = "[\\w#;/?:@&=+$,.~*\\'()[\\]]+", s = {
        className: "string",
        relevance: 0,
        variants: [{begin: /'/, end: /'/}, {begin: /"/, end: /"/}, {begin: /\S+/}],
        contains: [e.BACKSLASH_ESCAPE, {
          className: "template-variable",
          variants: [{begin: "{{", end: "}}"}, {begin: "%{", end: "}"}]
        }]
      }, i = e.inherit(s, {variants: [{begin: /'/, end: /'/}, {begin: /"/, end: /"/}, {begin: /[^\s,{}[\]]+/}]}),
      l = {end: ",", endsWithParent: !0, excludeEnd: !0, contains: [], keywords: n, relevance: 0},
      t = {begin: "{", end: "}", contains: [l], illegal: "\\n", relevance: 0},
      g = {begin: "\\[", end: "\\]", contains: [l], illegal: "\\n", relevance: 0}, b = [{
        className: "attr",
        variants: [{begin: "\\w[\\w :\\/.-]*:(?=[ \t]|$)"}, {begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)'}, {begin: "'\\w[\\w :\\/.-]*':(?=[ \t]|$)"}]
      }, {className: "meta", begin: "^---s*$", relevance: 10}, {
        className: "string",
        begin: "[\\|>]([0-9]?[+-])?[ ]*\\n( *)[\\S ]+\\n(\\2[\\S ]+\\n?)*"
      }, {
        begin: "<%[%=-]?",
        end: "[%-]?%>",
        subLanguage: "ruby",
        excludeBegin: !0,
        excludeEnd: !0,
        relevance: 0
      }, {className: "type", begin: "!\\w+!" + a}, {className: "type", begin: "!<" + a + ">"}, {
        className: "type",
        begin: "!" + a
      }, {className: "type", begin: "!!" + a}, {
        className: "meta",
        begin: "&" + e.UNDERSCORE_IDENT_RE + "$"
      }, {className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"}, {
        className: "bullet",
        begin: "\\-(?=[ ]|$)",
        relevance: 0
      }, e.HASH_COMMENT_MODE, {beginKeywords: n, keywords: {literal: n}}, {
        className: "number",
        begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
      }, {className: "number", begin: e.C_NUMBER_RE + "\\b"}, t, g, s], c = [...b];
    return c.pop(), c.push(i), l.contains = c, {
      name: "YAML",
      case_insensitive: !0,
      aliases: ["yml", "YAML"],
      contains: b
    }
  }
}());
hljs.registerLanguage("erlang", function () {
  "use strict";
  return function (e) {
    var n = "[a-z'][a-zA-Z0-9_']*", r = "(" + n + ":" + n + "|" + n + ")", a = {
        keyword: "after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun if let not of orelse|10 query receive rem try when xor",
        literal: "false true"
      }, i = e.COMMENT("%", "$"), c = {
        className: "number",
        begin: "\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)",
        relevance: 0
      }, s = {begin: "fun\\s+" + n + "/\\d+"}, t = {
        begin: r + "\\(",
        end: "\\)",
        returnBegin: !0,
        relevance: 0,
        contains: [{begin: r, relevance: 0}, {
          begin: "\\(",
          end: "\\)",
          endsWithParent: !0,
          returnEnd: !0,
          relevance: 0
        }]
      }, d = {begin: "{", end: "}", relevance: 0}, o = {begin: "\\b_([A-Z][A-Za-z0-9_]*)?", relevance: 0},
      l = {begin: "[A-Z][a-zA-Z0-9_]*", relevance: 0}, b = {
        begin: "#" + e.UNDERSCORE_IDENT_RE,
        relevance: 0,
        returnBegin: !0,
        contains: [{begin: "#" + e.UNDERSCORE_IDENT_RE, relevance: 0}, {begin: "{", end: "}", relevance: 0}]
      }, g = {beginKeywords: "fun receive if try case", end: "end", keywords: a};
    g.contains = [i, s, e.inherit(e.APOS_STRING_MODE, {className: ""}), g, t, e.QUOTE_STRING_MODE, c, d, o, l, b];
    var u = [i, s, g, t, e.QUOTE_STRING_MODE, c, d, o, l, b];
    t.contains[1].contains = u, d.contains = u, b.contains[1].contains = u;
    var E = {className: "params", begin: "\\(", end: "\\)", contains: u};
    return {
      name: "Erlang",
      aliases: ["erl"],
      keywords: a,
      illegal: "(</|\\*=|\\+=|-=|/\\*|\\*/|\\(\\*|\\*\\))",
      contains: [{
        className: "function",
        begin: "^" + n + "\\s*\\(",
        end: "->",
        returnBegin: !0,
        illegal: "\\(|#|//|/\\*|\\\\|:|;",
        contains: [E, e.inherit(e.TITLE_MODE, {begin: n})],
        starts: {end: ";|\\.", keywords: a, contains: u}
      }, i, {
        begin: "^-",
        end: "\\.",
        relevance: 0,
        excludeEnd: !0,
        returnBegin: !0,
        keywords: {
          $pattern: "-" + e.IDENT_RE,
          keyword: "-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn -import -include -include_lib -compile -define -else -endif -file -behaviour -behavior -spec"
        },
        contains: [E]
      }, c, e.QUOTE_STRING_MODE, b, o, l, d, {begin: /\.$/}]
    }
  }
}());
hljs.registerLanguage("dockerfile", function () {
  "use strict";
  return function (e) {
    return {
      name: "Dockerfile",
      aliases: ["docker"],
      case_insensitive: !0,
      keywords: "from maintainer expose env arg user onbuild stopsignal",
      contains: [e.HASH_COMMENT_MODE, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.NUMBER_MODE, {
        beginKeywords: "run cmd entrypoint volume add copy workdir label healthcheck shell",
        starts: {end: /[^\\]$/, subLanguage: "bash"}
      }],
      illegal: "</"
    }
  }
}());
hljs.registerLanguage("sql", function () {
  "use strict";
  return function (e) {
    var t = e.COMMENT("--", "$");
    return {
      name: "SQL", case_insensitive: !0, illegal: /[<>{}*]/, contains: [{
        beginKeywords: "begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment values with",
        end: /;/,
        endsWithParent: !0,
        keywords: {
          $pattern: /[\w\.]+/,
          keyword: "as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select self semi sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",
          literal: "true false null unknown",
          built_in: "array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text time timestamp tinyint varchar varchar2 varying void"
        },
        contains: [{className: "string", begin: "'", end: "'", contains: [{begin: "''"}]}, {
          className: "string",
          begin: '"',
          end: '"',
          contains: [{begin: '""'}]
        }, {
          className: "string",
          begin: "`",
          end: "`"
        }, e.C_NUMBER_MODE, e.C_BLOCK_COMMENT_MODE, t, e.HASH_COMMENT_MODE]
      }, e.C_BLOCK_COMMENT_MODE, t, e.HASH_COMMENT_MODE]
    }
  }
}());

'use strict';
const init = () => {
  document.querySelectorAll('pre').forEach((block) => {
    console.log(block.parentElement.classList)
    if (!(block.parentElement.classList.contains('highlight-plain')
      || block.parentElement.classList.contains('highlight-none')
        || (block.parentElement.classList.contains('highlight-text')))) {
      hljs.highlightBlock(block);
    }
  });
}

let loaded = 0;
document.addEventListener("DOMContentLoaded", init);
