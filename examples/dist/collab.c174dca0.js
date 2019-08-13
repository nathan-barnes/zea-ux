parcelRequire = (function(e, r, n, t) {
  var i = 'function' == typeof parcelRequire && parcelRequire,
    o = 'function' == typeof require && require;
  function u(n, t) {
    if (!r[n]) {
      if (!e[n]) {
        var f = 'function' == typeof parcelRequire && parcelRequire;
        if (!t && f) return f(n, !0);
        if (i) return i(n, !0);
        if (o && 'string' == typeof n) return o(n);
        var c = new Error("Cannot find module '" + n + "'");
        throw ((c.code = 'MODULE_NOT_FOUND'), c);
      }
      (p.resolve = function(r) {
        return e[n][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[n] = new u.Module(n));
      e[n][0].call(l.exports, p, l, l.exports, this);
    }
    return r[n].exports;
    function p(e) {
      return u(p.resolve(e));
    }
  }
  (u.isParcelRequire = !0),
    (u.Module = function(e) {
      (this.id = e), (this.bundle = u), (this.exports = {});
    }),
    (u.modules = e),
    (u.cache = r),
    (u.parent = i),
    (u.register = function(r, n) {
      e[r] = [
        function(e, r) {
          r.exports = n;
        },
        {},
      ];
    });
  for (var f = 0; f < n.length; f++) u(n[f]);
  if (n.length) {
    var c = u(n[n.length - 1]);
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = c)
      : 'function' == typeof define && define.amd
      ? define(function() {
          return c;
        })
      : t && (this[t] = c);
  }
  return u;
})(
  {
    Yfwc: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        const e = 'https://apistage.visualive.io/api/v1/';
        var t = e;
        exports.default = t;
      },
      {},
    ],
    'iQl/': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        const e = 'https://api.visualive.io/api/v1/';
        var t = e;
        exports.default = t;
      },
      {},
    ],
    VlSg: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = u(require('./development.js')),
          r = u(require('./production.js')),
          t = u(require('./stage.js'));
        function u(e) {
          return e && e.__esModule ? e : { default: e };
        }
        const o = () =>
          null == window.process
            ? { HOST_URL: t.default }
            : { HOST_URL: r.default };
        var s = o;
        exports.default = s;
      },
      {
        './development.js': 'Yfwc',
        './production.js': 'iQl/',
        './stage.js': 'Yfwc',
      },
    ],
    '0oFO': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.getParameterFromUrl = i),
          (exports.getRequest = p),
          (exports.getCurrentUser = exports.getProjectResourcesRecursive = exports.getProjectData = exports.BAD_REQUEST = exports.INVALID_TOKEN = void 0);
        var e = t(require('./config/settings.js'));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        const { HOST_URL: r } = (0, e.default)(),
          o = 'invalid token';
        exports.INVALID_TOKEN = o;
        const n = 'bad request';
        function s(e) {
          return (
            'E_UNAUTHORIZED' === e.code &&
            'Missing or invalid authentication token' === e.message
          );
        }
        function c(e) {
          const { data: t } = e.data;
          return s(e) && t && t.err && 'ip is unauthorized' === t.err;
        }
        function i(e) {
          return new window.URL(window.location.href).searchParams.get(e);
        }
        function a() {
          return i('token');
        }
        function u(e) {
          return e && 'E_BAD_REQUEST' === e.code;
        }
        function d(e, t, i, d) {
          const l = r + e,
            p = a(),
            f = new Headers();
          f.append('Content-Type', d), f.append('x-access-token', p);
          const g = {
              method: t,
              headers: f,
              body: i,
              mode: 'cors',
              cache: 'default',
            },
            h = new window.Request(l, g);
          return window
            .fetch(h)
            .then(e => (e.status > 499 ? Promise.reject(e.json()) : e.json()))
            .then(e => {
              if (c(e)) return Promise.reject(e.data.err);
              if (s(e)) {
                const e = { error: o };
                return Promise.reject(e);
              }
              if (u(e)) {
                const t = { error: n, message: e.data || e.message };
                return Promise.reject(t);
              }
              return e.data;
            });
        }
        function l(e, t, r) {
          return d(e, t, r, 'application/json');
        }
        function p(e) {
          return l(e, 'GET');
        }
        exports.BAD_REQUEST = n;
        const f = (e, t) => {
          return p(
            `project/version?projectId=${e}&versionId=${t || 'lastest'}`
          );
        };
        exports.getProjectData = f;
        const g = (e, t, r = []) =>
          -1 != r.indexOf(e)
            ? Promise.resolve(void 0)
            : new Promise(function(t, o) {
                r.push(e),
                  f(e)
                    .then(n => {
                      console.log(e, n);
                      let s = n.filesPlain;
                      if (0 == n.dependencies.length) return void t(s);
                      const c = [];
                      for (let e of n.dependencies) c.push(g(e, void 0, r));
                      Promise.all(c)
                        .then(e => {
                          for (let t of e) t && (s = Object.assign(t, s));
                          t(s);
                        })
                        .catch(() => {
                          console.error(
                            'Error while loading project depdendencies:',
                            e
                          ),
                            o('Unable to collect deps');
                        });
                    })
                    .catch(t => {
                      console.error('Error while loading project:', e, t);
                    });
              });
        exports.getProjectResourcesRecursive = g;
        const h = () => {
          return p('users/me');
        };
        exports.getCurrentUser = h;
      },
      { './config/settings.js': 'VlSg' },
    ],
    JrmM: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        class t {
          constructor() {
            (this.__undoStack = []), (this.__redoStack = []);
          }
          addChange(t) {
            this.__undoStack.push(t), (this.__redoStack = []);
          }
          undo() {
            if (this.__undoStack.length > 0) {
              const t = this.__undoStack.pop();
              t.undo(), this.__redoStack.push(t);
            }
          }
          redo() {
            if (this.__redoStack.length > 0) {
              const t = this.__redoStack.pop();
              t.redo(), this.__undoStack.push(t);
            }
          }
        }
        var o = t;
        exports.default = o;
      },
      {},
    ],
    TrYh: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.Signal = void 0);
        class t {
          constructor() {
            (this.__slots = []),
              (this.connect = this.connect.bind(this)),
              (this.disconnect = this.disconnect.bind(this)),
              (this.emit = this.emit.bind(this));
          }
          connect(t) {
            if (null == t)
              throw 'a function callback must be passed to Signal.connect';
            if (-1 != this.__slots.indexOf(t))
              return void console.warn('fn already connected to Signal.');
            const s = this.__slots.length;
            return (
              (this.__slots[s] = t),
              this.__toggledSignal &&
                this.__toggled &&
                (this.__data ? t(...this.__data) : t()),
              s
            );
          }
          disconnect(t) {
            const s = [];
            if (
              (this.__slots.forEach(function(i, n) {
                i === t && s.push(n);
              }),
              0 != s.length)
            )
              for (let i of s) this.__slots[i] = void 0;
            else
              console.warn(
                'callback :' +
                  t.name +
                  ' was not connected to this signal:' +
                  this.__name
              );
          }
          disconnectID(t) {
            if (!this.__slots[t]) throw 'Invalid ID';
            this.__slots[t] = void 0;
          }
          emit(...t) {
            const s = this.__slots.length;
            for (let i = 0; i < s; i++) {
              const s = this.__slots[i];
              s && s(...t);
            }
          }
        }
        exports.Signal = t;
      },
      {},
    ],
    u1MQ: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var t = require('./Signal.js');
        class i {
          constructor() {
            (this.actions = []), (this.actionAdded = new t.Signal());
          }
          registerAction(t) {
            const { name: i } = t;
            i
              ? this._addAction(t)
              : console.warn('A action is missing its name.');
          }
          _addAction(t) {
            this.actions.push(t), this.actionAdded.emit(t);
          }
          getActions() {
            return this.actions;
          }
        }
        var s = i;
        exports.default = s;
      },
      { './Signal.js': 'TrYh' },
    ],
    F60O: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        class e {
          constructor(e) {
            this.name = e;
          }
          undo() {}
          redo() {}
        }
        var t = e;
        exports.default = t;
      },
      {},
    ],
    qENZ: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = t(require('./undoredo/Change.js'));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class s extends e.default {
          constructor(e, t, s) {
            super('SelectionChange'),
              (this.__selectionManager = e),
              (this.__prevSelection = t),
              (this.__newSelection = s);
          }
          undo() {
            this.__selectionManager.setSelection(this.__oldValue);
          }
          redo() {
            this.__selectionManager.setSelection(this.__newValue);
          }
        }
        class i {
          constructor(e) {
            (this.undoRedoManager = e),
              (this.__selection = new Set()),
              (this.selectionChanged = new Visualive.Signal()),
              (this.leadSelectionChanged = new Visualive.Signal());
          }
          toggleItemSelection(e, t = !0) {
            const i = new Set(this.__selection),
              n = e.getParameter('Selected');
            !t ||
              (1 == this.__selection.size && this.__selection.has(n)) ||
              this.clearSelection(!1),
              n.getValue()
                ? (n.setValue(!1), this.__selection.delete(n))
                : (n.setValue(!0), this.__selection.add(n));
            const l = new s(this, i, this.__selection);
            this.undoRedoManager.addChange(l),
              1 === this.__selection.size
                ? this.leadSelectionChanged.emit(e)
                : 0 === this.__selection.size &&
                  this.leadSelectionChanged.emit(),
              this.selectionChanged.emit(this.__selection);
          }
          deselectItem(e) {
            const t = e.getParameter('Selected');
            if (t.getValue()) {
              const e = new Set(this.__selection);
              t.setValue(!1), this.__selection.delete(t);
              const i = new s(this, e, this.__selection);
              this.undoRedoManager.addChange(i),
                this.selectionChanged.emit(this.__selection);
            }
          }
          clearSelection(e = !0) {
            if (0 == this.__selection.size) return !1;
            let t;
            e && (t = new Set(this.__selection));
            for (let s of this.__selection) s.setValue(!1);
            if ((this.__selection.clear(), e)) {
              const e = new s(this, t, this.__selection);
              this.undoRedoManager.addChange(e),
                this.selectionChanged.emit(this.__selection);
            }
            return !0;
          }
          setSelection(e) {
            for (let t of e)
              this.__selection.has(t) ||
                (t.setValue(!0), this.__selection.add(t));
            for (let t of this.__selection)
              e.has(t) || (t.setValue(!1), this.__selection.delete(t));
          }
        }
        var n = i;
        exports.default = n;
      },
      { './undoredo/Change.js': 'F60O' },
    ],
    SHxf: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        class e {
          constructor() {
            this.loaders = [];
          }
          registerLoader(e, r) {
            this.loaders.push({ loader: e, rule: r });
          }
          findLoader(e) {
            for (let r = this.loaders.length; r-- > 0; ) {
              const { loader: o, rule: s } = this.loaders[r];
              if (s(e)) return o;
            }
            console.warn(`Loader not found for file '${e.name}`);
          }
        }
        var r = e;
        exports.default = r;
      },
      {},
    ],
    '7YxH': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        class e {
          constructor(e, t) {
            (this.actionRegistry = e),
              (this.domElement = t),
              (this.__existingItems = {}),
              this._buildTopBar();
          }
          _buildTopBar() {
            this.domElement.innerHTML = '';
            const e = this._addUlTo(this.domElement, 'pure-menu-list');
            this.actionRegistry.getActions().forEach(t => {
              this._addMenuItem(e, t);
            }),
              this.actionRegistry.actionAdded.connect(t => {
                this._addMenuItem(e, t);
              });
          }
          _addMenuItem(e, t) {
            let n = e;
            for (let o = 0; o < t.path.length; o++) {
              const e = t.path[o];
              if (!this.__existingItems[e]) {
                const t = this._addLiTo(n, 'pure-menu-item');
                t.classList.add(
                  'pure-menu-has-children',
                  'pure-menu-allow-hover'
                );
                this._addATo(t, 'pure-menu-link', e);
                const s = this._addUlTo(t, 'pure-menu-children shadow-3');
                this.__existingItems[e] = s;
              }
              n = this.__existingItems[e];
            }
            const s = this._addATo(n, 'pure-menu-link', null, t.callback);
            this._addSpanTo(s, 'ActionTitle', t.name),
              this._addSpanTo(s, 'ActionShortcut', this._keyComboAsText(t)),
              t.key && this._addKeyListener(t);
          }
          _addKeyListener(e) {
            document.addEventListener('keydown', t => {
              const n = e.metaKeys || {},
                s =
                  this._comboFragment(n.alt, 'A') +
                  this._comboFragment(n.control, 'C') +
                  this._comboFragment(n.shift, 'S') +
                  e.key,
                o =
                  this._comboFragment(t.altKey, 'A') +
                  this._comboFragment(t.metaKey || t.ctrlKey, 'C') +
                  this._comboFragment(t.shiftKey, 'S') +
                  t.key;
              s.toLowerCase() === o.toLowerCase() &&
                this._invokeCallback(e.callback, t);
            });
          }
          _invokeCallback(e, t) {
            t.preventDefault(), e();
          }
          _addSpanTo(e, t, n) {
            const s = document.createElement('span');
            return (
              (s.className = t), n && (s.innerHTML = n), e.appendChild(s), s
            );
          }
          _addATo(e, t, n, s) {
            const o = document.createElement('a');
            return (
              (o.href = '#'),
              (o.className = t),
              n && (o.innerHTML = n),
              s &&
                o.addEventListener('click', e => {
                  e.preventDefault(), s();
                }),
              e.appendChild(o),
              o
            );
          }
          _addUlTo(e, t, n) {
            const s = document.createElement('ul');
            return (
              (s.className = t), n && (s.innerHTML = n), e.appendChild(s), s
            );
          }
          _addLiTo(e, t, n) {
            const s = document.createElement('li');
            return (
              (s.className = t), n && (s.innerHTML = n), e.appendChild(s), s
            );
          }
          _comboFragment(e, t) {
            return e ? t + '+' : '';
          }
          _keyComboAsText(e) {
            const { metaKeys: t, key: n } = e;
            return n
              ? this._comboFragment(t.shift, 'Shift') +
                  this._comboFragment(t.alt, 'Alt') +
                  this._comboFragment(t.control, 'Ctrl') +
                  n
              : '';
          }
        }
        var t = e;
        exports.default = t;
      },
      {},
    ],
    lGqk: [
      function(require, module, exports) {
        'use strict';
        function e() {
          const e = document.getElementsByClassName('PanelHandler');
          document.getElementById('viewport');
          Object.keys(e).forEach(t => {
            const n = e[t],
              o = document.getElementsByClassName('SidePanel')[t],
              s = 0 == t;
            let d, u;
            function m(e) {
              const t = e.clientX - d;
              let n = s ? u + t : u - t;
              n < 40 && (n = 0), (o.style.width = `${n}px`);
            }
            function c(e) {
              document.removeEventListener('mousemove', m, !1),
                document.removeEventListener('mouseup', c, !1);
            }
            n.addEventListener(
              'mousedown',
              function(e) {
                (d = e.clientX),
                  (u = parseInt(
                    document.defaultView.getComputedStyle(o).width,
                    10
                  )),
                  document.addEventListener('mousemove', m, !1),
                  document.addEventListener('mouseup', c, !1);
              },
              !1
            );
          });
        }
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = e);
      },
      {},
    ],
    mOLL: [
      function(require, module, exports) {
        var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
          e = [
            'source',
            'protocol',
            'authority',
            'userInfo',
            'user',
            'password',
            'host',
            'port',
            'relative',
            'path',
            'directory',
            'file',
            'query',
            'anchor',
          ];
        module.exports = function(t) {
          var s = t,
            o = t.indexOf('['),
            a = t.indexOf(']');
          -1 != o &&
            -1 != a &&
            (t =
              t.substring(0, o) +
              t.substring(o, a).replace(/:/g, ';') +
              t.substring(a, t.length));
          for (var u = r.exec(t || ''), i = {}, h = 14; h--; )
            i[e[h]] = u[h] || '';
          return (
            -1 != o &&
              -1 != a &&
              ((i.source = s),
              (i.host = i.host
                .substring(1, i.host.length - 1)
                .replace(/;/g, ':')),
              (i.authority = i.authority
                .replace('[', '')
                .replace(']', '')
                .replace(/;/g, ':')),
              (i.ipv6uri = !0)),
            i
          );
        };
      },
      {},
    ],
    WEtT: [
      function(require, module, exports) {
        var s = 1e3,
          e = 60 * s,
          r = 60 * e,
          a = 24 * r,
          n = 365.25 * a;
        function c(c) {
          if (!((c = String(c)).length > 100)) {
            var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
              c
            );
            if (t) {
              var i = parseFloat(t[1]);
              switch ((t[2] || 'ms').toLowerCase()) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                  return i * n;
                case 'days':
                case 'day':
                case 'd':
                  return i * a;
                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                  return i * r;
                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                  return i * e;
                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                  return i * s;
                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                  return i;
                default:
                  return;
              }
            }
          }
        }
        function t(n) {
          return n >= a
            ? Math.round(n / a) + 'd'
            : n >= r
            ? Math.round(n / r) + 'h'
            : n >= e
            ? Math.round(n / e) + 'm'
            : n >= s
            ? Math.round(n / s) + 's'
            : n + 'ms';
        }
        function i(n) {
          return (
            o(n, a, 'day') ||
            o(n, r, 'hour') ||
            o(n, e, 'minute') ||
            o(n, s, 'second') ||
            n + ' ms'
          );
        }
        function o(s, e, r) {
          if (!(s < e))
            return s < 1.5 * e
              ? Math.floor(s / e) + ' ' + r
              : Math.ceil(s / e) + ' ' + r + 's';
        }
        module.exports = function(s, e) {
          e = e || {};
          var r = typeof s;
          if ('string' === r && s.length > 0) return c(s);
          if ('number' === r && !1 === isNaN(s)) return e.long ? i(s) : t(s);
          throw new Error(
            'val is not a non-empty string or a valid number. val=' +
              JSON.stringify(s)
          );
        };
      },
      {},
    ],
    Uygk: [
      function(require, module, exports) {
        function e(e) {
          var r,
            s = 0;
          for (r in e) (s = (s << 5) - s + e.charCodeAt(r)), (s |= 0);
          return exports.colors[Math.abs(s) % exports.colors.length];
        }
        function r(r) {
          var t;
          function o() {
            if (o.enabled) {
              var e = o,
                r = +new Date(),
                s = r - (t || r);
              (e.diff = s), (e.prev = t), (e.curr = r), (t = r);
              for (
                var n = new Array(arguments.length), p = 0;
                p < n.length;
                p++
              )
                n[p] = arguments[p];
              (n[0] = exports.coerce(n[0])),
                'string' != typeof n[0] && n.unshift('%O');
              var a = 0;
              (n[0] = n[0].replace(/%([a-zA-Z%])/g, function(r, s) {
                if ('%%' === r) return r;
                a++;
                var t = exports.formatters[s];
                if ('function' == typeof t) {
                  var o = n[a];
                  (r = t.call(e, o)), n.splice(a, 1), a--;
                }
                return r;
              })),
                exports.formatArgs.call(e, n),
                (o.log || exports.log || console.log.bind(console)).apply(e, n);
            }
          }
          return (
            (o.namespace = r),
            (o.enabled = exports.enabled(r)),
            (o.useColors = exports.useColors()),
            (o.color = e(r)),
            (o.destroy = s),
            'function' == typeof exports.init && exports.init(o),
            exports.instances.push(o),
            o
          );
        }
        function s() {
          var e = exports.instances.indexOf(this);
          return -1 !== e && (exports.instances.splice(e, 1), !0);
        }
        function t(e) {
          var r;
          exports.save(e), (exports.names = []), (exports.skips = []);
          var s = ('string' == typeof e ? e : '').split(/[\s,]+/),
            t = s.length;
          for (r = 0; r < t; r++)
            s[r] &&
              ('-' === (e = s[r].replace(/\*/g, '.*?'))[0]
                ? exports.skips.push(new RegExp('^' + e.substr(1) + '$'))
                : exports.names.push(new RegExp('^' + e + '$')));
          for (r = 0; r < exports.instances.length; r++) {
            var o = exports.instances[r];
            o.enabled = exports.enabled(o.namespace);
          }
        }
        function o() {
          exports.enable('');
        }
        function n(e) {
          if ('*' === e[e.length - 1]) return !0;
          var r, s;
          for (r = 0, s = exports.skips.length; r < s; r++)
            if (exports.skips[r].test(e)) return !1;
          for (r = 0, s = exports.names.length; r < s; r++)
            if (exports.names[r].test(e)) return !0;
          return !1;
        }
        function p(e) {
          return e instanceof Error ? e.stack || e.message : e;
        }
        (exports = module.exports = r.debug = r.default = r),
          (exports.coerce = p),
          (exports.disable = o),
          (exports.enable = t),
          (exports.enabled = n),
          (exports.humanize = require('ms')),
          (exports.instances = []),
          (exports.names = []),
          (exports.skips = []),
          (exports.formatters = {});
      },
      { ms: 'WEtT' },
    ],
    'g5I+': [
      function(require, module, exports) {
        var t,
          e,
          n = (module.exports = {});
        function r() {
          throw new Error('setTimeout has not been defined');
        }
        function o() {
          throw new Error('clearTimeout has not been defined');
        }
        function i(e) {
          if (t === setTimeout) return setTimeout(e, 0);
          if ((t === r || !t) && setTimeout)
            return (t = setTimeout), setTimeout(e, 0);
          try {
            return t(e, 0);
          } catch (n) {
            try {
              return t.call(null, e, 0);
            } catch (n) {
              return t.call(this, e, 0);
            }
          }
        }
        function u(t) {
          if (e === clearTimeout) return clearTimeout(t);
          if ((e === o || !e) && clearTimeout)
            return (e = clearTimeout), clearTimeout(t);
          try {
            return e(t);
          } catch (n) {
            try {
              return e.call(null, t);
            } catch (n) {
              return e.call(this, t);
            }
          }
        }
        !(function() {
          try {
            t = 'function' == typeof setTimeout ? setTimeout : r;
          } catch (n) {
            t = r;
          }
          try {
            e = 'function' == typeof clearTimeout ? clearTimeout : o;
          } catch (n) {
            e = o;
          }
        })();
        var c,
          s = [],
          l = !1,
          a = -1;
        function f() {
          l &&
            c &&
            ((l = !1),
            c.length ? (s = c.concat(s)) : (a = -1),
            s.length && h());
        }
        function h() {
          if (!l) {
            var t = i(f);
            l = !0;
            for (var e = s.length; e; ) {
              for (c = s, s = []; ++a < e; ) c && c[a].run();
              (a = -1), (e = s.length);
            }
            (c = null), (l = !1), u(t);
          }
        }
        function m(t, e) {
          (this.fun = t), (this.array = e);
        }
        function p() {}
        (n.nextTick = function(t) {
          var e = new Array(arguments.length - 1);
          if (arguments.length > 1)
            for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
          s.push(new m(t, e)), 1 !== s.length || l || i(h);
        }),
          (m.prototype.run = function() {
            this.fun.apply(null, this.array);
          }),
          (n.title = 'browser'),
          (n.browser = !0),
          (n.env = {}),
          (n.argv = []),
          (n.version = ''),
          (n.versions = {}),
          (n.on = p),
          (n.addListener = p),
          (n.once = p),
          (n.off = p),
          (n.removeListener = p),
          (n.removeAllListeners = p),
          (n.emit = p),
          (n.prependListener = p),
          (n.prependOnceListener = p),
          (n.listeners = function(t) {
            return [];
          }),
          (n.binding = function(t) {
            throw new Error('process.binding is not supported');
          }),
          (n.cwd = function() {
            return '/';
          }),
          (n.chdir = function(t) {
            throw new Error('process.chdir is not supported');
          }),
          (n.umask = function() {
            return 0;
          });
      },
      {},
    ],
    uha7: [
      function(require, module, exports) {
        var process = require('process');
        var e = require('process');
        function o() {
          return (
            !(
              'undefined' == typeof window ||
              !window.process ||
              'renderer' !== window.process.type
            ) ||
            (('undefined' == typeof navigator ||
              !navigator.userAgent ||
              !navigator.userAgent
                .toLowerCase()
                .match(/(edge|trident)\/(\d+)/)) &&
              (('undefined' != typeof document &&
                document.documentElement &&
                document.documentElement.style &&
                document.documentElement.style.WebkitAppearance) ||
                ('undefined' != typeof window &&
                  window.console &&
                  (window.console.firebug ||
                    (window.console.exception && window.console.table))) ||
                ('undefined' != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
                  parseInt(RegExp.$1, 10) >= 31) ||
                ('undefined' != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent
                    .toLowerCase()
                    .match(/applewebkit\/(\d+)/))))
          );
        }
        function C(e) {
          var o = this.useColors;
          if (
            ((e[0] =
              (o ? '%c' : '') +
              this.namespace +
              (o ? ' %c' : ' ') +
              e[0] +
              (o ? '%c ' : ' ') +
              '+' +
              exports.humanize(this.diff)),
            o)
          ) {
            var C = 'color: ' + this.color;
            e.splice(1, 0, C, 'color: inherit');
            var t = 0,
              r = 0;
            e[0].replace(/%[a-zA-Z%]/g, function(e) {
              '%%' !== e && (t++, '%c' === e && (r = t));
            }),
              e.splice(r, 0, C);
          }
        }
        function t() {
          return (
            'object' == typeof console &&
            console.log &&
            Function.prototype.apply.call(console.log, console, arguments)
          );
        }
        function r(e) {
          try {
            null == e
              ? exports.storage.removeItem('debug')
              : (exports.storage.debug = e);
          } catch (o) {}
        }
        function n() {
          var o;
          try {
            o = exports.storage.debug;
          } catch (C) {}
          return !o && void 0 !== e && 'env' in e && (o = void 0), o;
        }
        function F() {
          try {
            return window.localStorage;
          } catch (e) {}
        }
        (exports = module.exports = require('./debug')),
          (exports.log = t),
          (exports.formatArgs = C),
          (exports.save = r),
          (exports.load = n),
          (exports.useColors = o),
          (exports.storage =
            'undefined' != typeof chrome && void 0 !== chrome.storage
              ? chrome.storage.local
              : F()),
          (exports.colors = [
            '#0000CC',
            '#0000FF',
            '#0033CC',
            '#0033FF',
            '#0066CC',
            '#0066FF',
            '#0099CC',
            '#0099FF',
            '#00CC00',
            '#00CC33',
            '#00CC66',
            '#00CC99',
            '#00CCCC',
            '#00CCFF',
            '#3300CC',
            '#3300FF',
            '#3333CC',
            '#3333FF',
            '#3366CC',
            '#3366FF',
            '#3399CC',
            '#3399FF',
            '#33CC00',
            '#33CC33',
            '#33CC66',
            '#33CC99',
            '#33CCCC',
            '#33CCFF',
            '#6600CC',
            '#6600FF',
            '#6633CC',
            '#6633FF',
            '#66CC00',
            '#66CC33',
            '#9900CC',
            '#9900FF',
            '#9933CC',
            '#9933FF',
            '#99CC00',
            '#99CC33',
            '#CC0000',
            '#CC0033',
            '#CC0066',
            '#CC0099',
            '#CC00CC',
            '#CC00FF',
            '#CC3300',
            '#CC3333',
            '#CC3366',
            '#CC3399',
            '#CC33CC',
            '#CC33FF',
            '#CC6600',
            '#CC6633',
            '#CC9900',
            '#CC9933',
            '#CCCC00',
            '#CCCC33',
            '#FF0000',
            '#FF0033',
            '#FF0066',
            '#FF0099',
            '#FF00CC',
            '#FF00FF',
            '#FF3300',
            '#FF3333',
            '#FF3366',
            '#FF3399',
            '#FF33CC',
            '#FF33FF',
            '#FF6600',
            '#FF6633',
            '#FF9900',
            '#FF9933',
            '#FFCC00',
            '#FFCC33',
          ]),
          (exports.formatters.j = function(e) {
            try {
              return JSON.stringify(e);
            } catch (o) {
              return '[UnexpectedJSONParseError]: ' + o.message;
            }
          }),
          exports.enable(n());
      },
      { './debug': 'Uygk', process: 'g5I+' },
    ],
    gG6R: [
      function(require, module, exports) {
        var global = arguments[3];
        var t = arguments[3],
          o = require('parseuri'),
          r = require('debug')('socket.io-client:url');
        function p(p, s) {
          var e = p;
          (s = s || t.location),
            null == p && (p = s.protocol + '//' + s.host),
            'string' == typeof p &&
              ('/' === p.charAt(0) &&
                (p = '/' === p.charAt(1) ? s.protocol + p : s.host + p),
              /^(https?|wss?):\/\//.test(p) ||
                (r('protocol-less url %s', p),
                (p = void 0 !== s ? s.protocol + '//' + p : 'https://' + p)),
              r('parse %s', p),
              (e = o(p))),
            e.port ||
              (/^(http|ws)$/.test(e.protocol)
                ? (e.port = '80')
                : /^(http|ws)s$/.test(e.protocol) && (e.port = '443')),
            (e.path = e.path || '/');
          var l = -1 !== e.host.indexOf(':') ? '[' + e.host + ']' : e.host;
          return (
            (e.id = e.protocol + '://' + l + ':' + e.port),
            (e.href =
              e.protocol +
              '://' +
              l +
              (s && s.port === e.port ? '' : ':' + e.port)),
            e
          );
        }
        module.exports = p;
      },
      { parseuri: 'mOLL', debug: 'uha7' },
    ],
    EgeI: [
      function(require, module, exports) {
        var process = require('process');
        var e = require('process');
        function o() {
          return (
            !(
              'undefined' == typeof window ||
              !window.process ||
              'renderer' !== window.process.type
            ) ||
            (('undefined' == typeof navigator ||
              !navigator.userAgent ||
              !navigator.userAgent
                .toLowerCase()
                .match(/(edge|trident)\/(\d+)/)) &&
              (('undefined' != typeof document &&
                document.documentElement &&
                document.documentElement.style &&
                document.documentElement.style.WebkitAppearance) ||
                ('undefined' != typeof window &&
                  window.console &&
                  (window.console.firebug ||
                    (window.console.exception && window.console.table))) ||
                ('undefined' != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
                  parseInt(RegExp.$1, 10) >= 31) ||
                ('undefined' != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent
                    .toLowerCase()
                    .match(/applewebkit\/(\d+)/))))
          );
        }
        function C(e) {
          var o = this.useColors;
          if (
            ((e[0] =
              (o ? '%c' : '') +
              this.namespace +
              (o ? ' %c' : ' ') +
              e[0] +
              (o ? '%c ' : ' ') +
              '+' +
              exports.humanize(this.diff)),
            o)
          ) {
            var C = 'color: ' + this.color;
            e.splice(1, 0, C, 'color: inherit');
            var t = 0,
              r = 0;
            e[0].replace(/%[a-zA-Z%]/g, function(e) {
              '%%' !== e && (t++, '%c' === e && (r = t));
            }),
              e.splice(r, 0, C);
          }
        }
        function t() {
          return (
            'object' == typeof console &&
            console.log &&
            Function.prototype.apply.call(console.log, console, arguments)
          );
        }
        function r(e) {
          try {
            null == e
              ? exports.storage.removeItem('debug')
              : (exports.storage.debug = e);
          } catch (o) {}
        }
        function n() {
          var o;
          try {
            o = exports.storage.debug;
          } catch (C) {}
          return !o && void 0 !== e && 'env' in e && (o = void 0), o;
        }
        function F() {
          try {
            return window.localStorage;
          } catch (e) {}
        }
        (exports = module.exports = require('./debug')),
          (exports.log = t),
          (exports.formatArgs = C),
          (exports.save = r),
          (exports.load = n),
          (exports.useColors = o),
          (exports.storage =
            'undefined' != typeof chrome && void 0 !== chrome.storage
              ? chrome.storage.local
              : F()),
          (exports.colors = [
            '#0000CC',
            '#0000FF',
            '#0033CC',
            '#0033FF',
            '#0066CC',
            '#0066FF',
            '#0099CC',
            '#0099FF',
            '#00CC00',
            '#00CC33',
            '#00CC66',
            '#00CC99',
            '#00CCCC',
            '#00CCFF',
            '#3300CC',
            '#3300FF',
            '#3333CC',
            '#3333FF',
            '#3366CC',
            '#3366FF',
            '#3399CC',
            '#3399FF',
            '#33CC00',
            '#33CC33',
            '#33CC66',
            '#33CC99',
            '#33CCCC',
            '#33CCFF',
            '#6600CC',
            '#6600FF',
            '#6633CC',
            '#6633FF',
            '#66CC00',
            '#66CC33',
            '#9900CC',
            '#9900FF',
            '#9933CC',
            '#9933FF',
            '#99CC00',
            '#99CC33',
            '#CC0000',
            '#CC0033',
            '#CC0066',
            '#CC0099',
            '#CC00CC',
            '#CC00FF',
            '#CC3300',
            '#CC3333',
            '#CC3366',
            '#CC3399',
            '#CC33CC',
            '#CC33FF',
            '#CC6600',
            '#CC6633',
            '#CC9900',
            '#CC9933',
            '#CCCC00',
            '#CCCC33',
            '#FF0000',
            '#FF0033',
            '#FF0066',
            '#FF0099',
            '#FF00CC',
            '#FF00FF',
            '#FF3300',
            '#FF3333',
            '#FF3366',
            '#FF3399',
            '#FF33CC',
            '#FF33FF',
            '#FF6600',
            '#FF6633',
            '#FF9900',
            '#FF9933',
            '#FFCC00',
            '#FFCC33',
          ]),
          (exports.formatters.j = function(e) {
            try {
              return JSON.stringify(e);
            } catch (o) {
              return '[UnexpectedJSONParseError]: ' + o.message;
            }
          }),
          exports.enable(n());
      },
      { './debug': 'Uygk', process: 'g5I+' },
    ],
    z8J7: [
      function(require, module, exports) {
        function t(t) {
          if (t) return e(t);
        }
        function e(e) {
          for (var s in t.prototype) e[s] = t.prototype[s];
          return e;
        }
        'undefined' != typeof module && (module.exports = t),
          (t.prototype.on = t.prototype.addEventListener = function(t, e) {
            return (
              (this._callbacks = this._callbacks || {}),
              (this._callbacks['$' + t] = this._callbacks['$' + t] || []).push(
                e
              ),
              this
            );
          }),
          (t.prototype.once = function(t, e) {
            function s() {
              this.off(t, s), e.apply(this, arguments);
            }
            return (s.fn = e), this.on(t, s), this;
          }),
          (t.prototype.off = t.prototype.removeListener = t.prototype.removeAllListeners = t.prototype.removeEventListener = function(
            t,
            e
          ) {
            if (
              ((this._callbacks = this._callbacks || {}), 0 == arguments.length)
            )
              return (this._callbacks = {}), this;
            var s,
              i = this._callbacks['$' + t];
            if (!i) return this;
            if (1 == arguments.length)
              return delete this._callbacks['$' + t], this;
            for (var r = 0; r < i.length; r++)
              if ((s = i[r]) === e || s.fn === e) {
                i.splice(r, 1);
                break;
              }
            return this;
          }),
          (t.prototype.emit = function(t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1),
              s = this._callbacks['$' + t];
            if (s)
              for (var i = 0, r = (s = s.slice(0)).length; i < r; ++i)
                s[i].apply(this, e);
            return this;
          }),
          (t.prototype.listeners = function(t) {
            return (
              (this._callbacks = this._callbacks || {}),
              this._callbacks['$' + t] || []
            );
          }),
          (t.prototype.hasListeners = function(t) {
            return !!this.listeners(t).length;
          });
      },
      {},
    ],
    '42Z2': [
      function(require, module, exports) {
        var r = {}.toString;
        module.exports =
          Array.isArray ||
          function(t) {
            return '[object Array]' == r.call(t);
          };
      },
      {},
    ],
    V5UO: [
      function(require, module, exports) {
        var global = arguments[3];
        var f = arguments[3];
        module.exports = n;
        var r =
            'function' == typeof f.Buffer &&
            'function' == typeof f.Buffer.isBuffer,
          e = 'function' == typeof f.ArrayBuffer,
          u =
            e && 'function' == typeof f.ArrayBuffer.isView
              ? f.ArrayBuffer.isView
              : function(r) {
                  return r.buffer instanceof f.ArrayBuffer;
                };
        function n(n) {
          return (
            (r && f.Buffer.isBuffer(n)) ||
            (e && (n instanceof f.ArrayBuffer || u(n)))
          );
        }
      },
      {},
    ],
    'i//B': [
      function(require, module, exports) {
        var global = arguments[3];
        var e = arguments[3],
          t = require('isarray'),
          r = require('./is-buffer'),
          n = Object.prototype.toString,
          o =
            'function' == typeof e.Blob ||
            '[object BlobConstructor]' === n.call(e.Blob),
          a =
            'function' == typeof e.File ||
            '[object FileConstructor]' === n.call(e.File);
        function f(e, n) {
          if (!e) return e;
          if (r(e)) {
            var o = { _placeholder: !0, num: n.length };
            return n.push(e), o;
          }
          if (t(e)) {
            for (var a = new Array(e.length), i = 0; i < e.length; i++)
              a[i] = f(e[i], n);
            return a;
          }
          if ('object' == typeof e && !(e instanceof Date)) {
            a = {};
            for (var u in e) a[u] = f(e[u], n);
            return a;
          }
          return e;
        }
        function i(e, r) {
          if (!e) return e;
          if (e && e._placeholder) return r[e.num];
          if (t(e)) for (var n = 0; n < e.length; n++) e[n] = i(e[n], r);
          else if ('object' == typeof e) for (var o in e) e[o] = i(e[o], r);
          return e;
        }
        (exports.deconstructPacket = function(e) {
          var t = [],
            r = e.data,
            n = e;
          return (
            (n.data = f(r, t)),
            (n.attachments = t.length),
            { packet: n, buffers: t }
          );
        }),
          (exports.reconstructPacket = function(e, t) {
            return (e.data = i(e.data, t)), (e.attachments = void 0), e;
          }),
          (exports.removeBlobs = function(e, n) {
            var f = 0,
              i = e;
            !(function e(u, c, l) {
              if (!u) return u;
              if ((o && u instanceof Blob) || (a && u instanceof File)) {
                f++;
                var s = new FileReader();
                (s.onload = function() {
                  l ? (l[c] = this.result) : (i = this.result), --f || n(i);
                }),
                  s.readAsArrayBuffer(u);
              } else if (t(u)) for (var p = 0; p < u.length; p++) e(u[p], p, u);
              else if ('object' == typeof u && !r(u))
                for (var b in u) e(u[b], b, u);
            })(i),
              f || n(i);
          });
      },
      { isarray: '42Z2', './is-buffer': 'V5UO' },
    ],
    'D3t/': [
      function(require, module, exports) {
        var t = require('debug')('socket.io-parser'),
          r = require('component-emitter'),
          e = require('./binary'),
          n = require('isarray'),
          o = require('./is-buffer');
        function s() {}
        (exports.protocol = 4),
          (exports.types = [
            'CONNECT',
            'DISCONNECT',
            'EVENT',
            'ACK',
            'ERROR',
            'BINARY_EVENT',
            'BINARY_ACK',
          ]),
          (exports.CONNECT = 0),
          (exports.DISCONNECT = 1),
          (exports.EVENT = 2),
          (exports.ACK = 3),
          (exports.ERROR = 4),
          (exports.BINARY_EVENT = 5),
          (exports.BINARY_ACK = 6),
          (exports.Encoder = s),
          (exports.Decoder = p);
        var i = exports.ERROR + '"encode error"';
        function c(r) {
          var e = '' + r.type;
          if (
            ((exports.BINARY_EVENT !== r.type &&
              exports.BINARY_ACK !== r.type) ||
              (e += r.attachments + '-'),
            r.nsp && '/' !== r.nsp && (e += r.nsp + ','),
            null != r.id && (e += r.id),
            null != r.data)
          ) {
            var n = a(r.data);
            if (!1 === n) return i;
            e += n;
          }
          return t('encoded %j as %s', r, e), e;
        }
        function a(t) {
          try {
            return JSON.stringify(t);
          } catch (r) {
            return !1;
          }
        }
        function u(t, r) {
          e.removeBlobs(t, function(t) {
            var n = e.deconstructPacket(t),
              o = c(n.packet),
              s = n.buffers;
            s.unshift(o), r(s);
          });
        }
        function p() {
          this.reconstructor = null;
        }
        function f(r) {
          var e = 0,
            o = { type: Number(r.charAt(0)) };
          if (null == exports.types[o.type])
            return N('unknown packet type ' + o.type);
          if (
            exports.BINARY_EVENT === o.type ||
            exports.BINARY_ACK === o.type
          ) {
            for (
              var s = '';
              '-' !== r.charAt(++e) && ((s += r.charAt(e)), e != r.length);

            );
            if (s != Number(s) || '-' !== r.charAt(e))
              throw new Error('Illegal attachments');
            o.attachments = Number(s);
          }
          if ('/' === r.charAt(e + 1))
            for (o.nsp = ''; ++e; ) {
              if (',' === (c = r.charAt(e))) break;
              if (((o.nsp += c), e === r.length)) break;
            }
          else o.nsp = '/';
          var i = r.charAt(e + 1);
          if ('' !== i && Number(i) == i) {
            for (o.id = ''; ++e; ) {
              var c;
              if (null == (c = r.charAt(e)) || Number(c) != c) {
                --e;
                break;
              }
              if (((o.id += r.charAt(e)), e === r.length)) break;
            }
            o.id = Number(o.id);
          }
          if (r.charAt(++e)) {
            var a = h(r.substr(e));
            if (!(!1 !== a && (o.type === exports.ERROR || n(a))))
              return N('invalid payload');
            o.data = a;
          }
          return t('decoded %s as %j', r, o), o;
        }
        function h(t) {
          try {
            return JSON.parse(t);
          } catch (r) {
            return !1;
          }
        }
        function d(t) {
          (this.reconPack = t), (this.buffers = []);
        }
        function N(t) {
          return { type: exports.ERROR, data: 'parser error: ' + t };
        }
        (s.prototype.encode = function(r, e) {
          (t('encoding packet %j', r),
          exports.BINARY_EVENT === r.type || exports.BINARY_ACK === r.type)
            ? u(r, e)
            : e([c(r)]);
        }),
          r(p.prototype),
          (p.prototype.add = function(t) {
            var r;
            if ('string' == typeof t)
              (r = f(t)),
                exports.BINARY_EVENT === r.type || exports.BINARY_ACK === r.type
                  ? ((this.reconstructor = new d(r)),
                    0 === this.reconstructor.reconPack.attachments &&
                      this.emit('decoded', r))
                  : this.emit('decoded', r);
            else {
              if (!o(t) && !t.base64) throw new Error('Unknown type: ' + t);
              if (!this.reconstructor)
                throw new Error(
                  'got binary data when not reconstructing a packet'
                );
              (r = this.reconstructor.takeBinaryData(t)) &&
                ((this.reconstructor = null), this.emit('decoded', r));
            }
          }),
          (p.prototype.destroy = function() {
            this.reconstructor && this.reconstructor.finishedReconstruction();
          }),
          (d.prototype.takeBinaryData = function(t) {
            if (
              (this.buffers.push(t),
              this.buffers.length === this.reconPack.attachments)
            ) {
              var r = e.reconstructPacket(this.reconPack, this.buffers);
              return this.finishedReconstruction(), r;
            }
            return null;
          }),
          (d.prototype.finishedReconstruction = function() {
            (this.reconPack = null), (this.buffers = []);
          });
      },
      {
        debug: 'EgeI',
        'component-emitter': 'z8J7',
        './binary': 'i//B',
        isarray: '42Z2',
        './is-buffer': 'V5UO',
      },
    ],
    Hgkk: [
      function(require, module, exports) {
        try {
          module.exports =
            'undefined' != typeof XMLHttpRequest &&
            'withCredentials' in new XMLHttpRequest();
        } catch (e) {
          module.exports = !1;
        }
      },
      {},
    ],
    'W/Bd': [
      function(require, module, exports) {
        var global = arguments[3];
        var e = arguments[3],
          t = require('has-cors');
        module.exports = function(n) {
          var r = n.xdomain,
            c = n.xscheme,
            i = n.enablesXDR;
          try {
            if ('undefined' != typeof XMLHttpRequest && (!r || t))
              return new XMLHttpRequest();
          } catch (o) {}
          try {
            if ('undefined' != typeof XDomainRequest && !c && i)
              return new XDomainRequest();
          } catch (o) {}
          if (!r)
            try {
              return new e[(['Active'].concat('Object').join('X'))](
                'Microsoft.XMLHTTP'
              );
            } catch (o) {}
        };
      },
      { 'has-cors': 'Hgkk' },
    ],
    GzmB: [
      function(require, module, exports) {
        module.exports =
          Object.keys ||
          function(r) {
            var e = [],
              t = Object.prototype.hasOwnProperty;
            for (var o in r) t.call(r, o) && e.push(o);
            return e;
          };
      },
      {},
    ],
    FRly: [
      function(require, module, exports) {
        'use strict';
        (exports.byteLength = u),
          (exports.toByteArray = i),
          (exports.fromByteArray = d);
        for (
          var r = [],
            t = [],
            e = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
            n =
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            o = 0,
            a = n.length;
          o < a;
          ++o
        )
          (r[o] = n[o]), (t[n.charCodeAt(o)] = o);
        function h(r) {
          var t = r.length;
          if (t % 4 > 0)
            throw new Error('Invalid string. Length must be a multiple of 4');
          var e = r.indexOf('=');
          return -1 === e && (e = t), [e, e === t ? 0 : 4 - (e % 4)];
        }
        function u(r) {
          var t = h(r),
            e = t[0],
            n = t[1];
          return (3 * (e + n)) / 4 - n;
        }
        function c(r, t, e) {
          return (3 * (t + e)) / 4 - e;
        }
        function i(r) {
          for (
            var n,
              o = h(r),
              a = o[0],
              u = o[1],
              i = new e(c(r, a, u)),
              f = 0,
              A = u > 0 ? a - 4 : a,
              d = 0;
            d < A;
            d += 4
          )
            (n =
              (t[r.charCodeAt(d)] << 18) |
              (t[r.charCodeAt(d + 1)] << 12) |
              (t[r.charCodeAt(d + 2)] << 6) |
              t[r.charCodeAt(d + 3)]),
              (i[f++] = (n >> 16) & 255),
              (i[f++] = (n >> 8) & 255),
              (i[f++] = 255 & n);
          return (
            2 === u &&
              ((n = (t[r.charCodeAt(d)] << 2) | (t[r.charCodeAt(d + 1)] >> 4)),
              (i[f++] = 255 & n)),
            1 === u &&
              ((n =
                (t[r.charCodeAt(d)] << 10) |
                (t[r.charCodeAt(d + 1)] << 4) |
                (t[r.charCodeAt(d + 2)] >> 2)),
              (i[f++] = (n >> 8) & 255),
              (i[f++] = 255 & n)),
            i
          );
        }
        function f(t) {
          return (
            r[(t >> 18) & 63] + r[(t >> 12) & 63] + r[(t >> 6) & 63] + r[63 & t]
          );
        }
        function A(r, t, e) {
          for (var n, o = [], a = t; a < e; a += 3)
            (n =
              ((r[a] << 16) & 16711680) +
              ((r[a + 1] << 8) & 65280) +
              (255 & r[a + 2])),
              o.push(f(n));
          return o.join('');
        }
        function d(t) {
          for (
            var e, n = t.length, o = n % 3, a = [], h = 0, u = n - o;
            h < u;
            h += 16383
          )
            a.push(A(t, h, h + 16383 > u ? u : h + 16383));
          return (
            1 === o
              ? ((e = t[n - 1]), a.push(r[e >> 2] + r[(e << 4) & 63] + '=='))
              : 2 === o &&
                ((e = (t[n - 2] << 8) + t[n - 1]),
                a.push(r[e >> 10] + r[(e >> 4) & 63] + r[(e << 2) & 63] + '=')),
            a.join('')
          );
        }
        (t['-'.charCodeAt(0)] = 62), (t['_'.charCodeAt(0)] = 63);
      },
      {},
    ],
    Quj6: [
      function(require, module, exports) {
        (exports.read = function(a, o, t, r, h) {
          var M,
            p,
            w = 8 * h - r - 1,
            f = (1 << w) - 1,
            e = f >> 1,
            i = -7,
            N = t ? h - 1 : 0,
            n = t ? -1 : 1,
            s = a[o + N];
          for (
            N += n, M = s & ((1 << -i) - 1), s >>= -i, i += w;
            i > 0;
            M = 256 * M + a[o + N], N += n, i -= 8
          );
          for (
            p = M & ((1 << -i) - 1), M >>= -i, i += r;
            i > 0;
            p = 256 * p + a[o + N], N += n, i -= 8
          );
          if (0 === M) M = 1 - e;
          else {
            if (M === f) return p ? NaN : (1 / 0) * (s ? -1 : 1);
            (p += Math.pow(2, r)), (M -= e);
          }
          return (s ? -1 : 1) * p * Math.pow(2, M - r);
        }),
          (exports.write = function(a, o, t, r, h, M) {
            var p,
              w,
              f,
              e = 8 * M - h - 1,
              i = (1 << e) - 1,
              N = i >> 1,
              n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
              s = r ? 0 : M - 1,
              u = r ? 1 : -1,
              l = o < 0 || (0 === o && 1 / o < 0) ? 1 : 0;
            for (
              o = Math.abs(o),
                isNaN(o) || o === 1 / 0
                  ? ((w = isNaN(o) ? 1 : 0), (p = i))
                  : ((p = Math.floor(Math.log(o) / Math.LN2)),
                    o * (f = Math.pow(2, -p)) < 1 && (p--, (f *= 2)),
                    (o += p + N >= 1 ? n / f : n * Math.pow(2, 1 - N)) * f >=
                      2 && (p++, (f /= 2)),
                    p + N >= i
                      ? ((w = 0), (p = i))
                      : p + N >= 1
                      ? ((w = (o * f - 1) * Math.pow(2, h)), (p += N))
                      : ((w = o * Math.pow(2, N - 1) * Math.pow(2, h)),
                        (p = 0)));
              h >= 8;
              a[t + s] = 255 & w, s += u, w /= 256, h -= 8
            );
            for (
              p = (p << h) | w, e += h;
              e > 0;
              a[t + s] = 255 & p, s += u, p /= 256, e -= 8
            );
            a[t + s - u] |= 128 * l;
          });
      },
      {},
    ],
    aMB2: [
      function(require, module, exports) {
        var global = arguments[3];
        var t = arguments[3],
          r = require('base64-js'),
          e = require('ieee754'),
          n = require('isarray');
        function i() {
          try {
            var t = new Uint8Array(1);
            return (
              (t.__proto__ = {
                __proto__: Uint8Array.prototype,
                foo: function() {
                  return 42;
                },
              }),
              42 === t.foo() &&
                'function' == typeof t.subarray &&
                0 === t.subarray(1, 1).byteLength
            );
          } catch (r) {
            return !1;
          }
        }
        function o() {
          return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
        }
        function u(t, r) {
          if (o() < r) throw new RangeError('Invalid typed array length');
          return (
            f.TYPED_ARRAY_SUPPORT
              ? ((t = new Uint8Array(r)).__proto__ = f.prototype)
              : (null === t && (t = new f(r)), (t.length = r)),
            t
          );
        }
        function f(t, r, e) {
          if (!(f.TYPED_ARRAY_SUPPORT || this instanceof f))
            return new f(t, r, e);
          if ('number' == typeof t) {
            if ('string' == typeof r)
              throw new Error(
                'If encoding is specified then the first argument must be a string'
              );
            return c(this, t);
          }
          return s(this, t, r, e);
        }
        function s(t, r, e, n) {
          if ('number' == typeof r)
            throw new TypeError('"value" argument must not be a number');
          return 'undefined' != typeof ArrayBuffer && r instanceof ArrayBuffer
            ? g(t, r, e, n)
            : 'string' == typeof r
            ? l(t, r, e)
            : y(t, r);
        }
        function h(t) {
          if ('number' != typeof t)
            throw new TypeError('"size" argument must be a number');
          if (t < 0)
            throw new RangeError('"size" argument must not be negative');
        }
        function a(t, r, e, n) {
          return (
            h(r),
            r <= 0
              ? u(t, r)
              : void 0 !== e
              ? 'string' == typeof n
                ? u(t, r).fill(e, n)
                : u(t, r).fill(e)
              : u(t, r)
          );
        }
        function c(t, r) {
          if ((h(r), (t = u(t, r < 0 ? 0 : 0 | w(r))), !f.TYPED_ARRAY_SUPPORT))
            for (var e = 0; e < r; ++e) t[e] = 0;
          return t;
        }
        function l(t, r, e) {
          if (
            (('string' == typeof e && '' !== e) || (e = 'utf8'),
            !f.isEncoding(e))
          )
            throw new TypeError('"encoding" must be a valid string encoding');
          var n = 0 | v(r, e),
            i = (t = u(t, n)).write(r, e);
          return i !== n && (t = t.slice(0, i)), t;
        }
        function p(t, r) {
          var e = r.length < 0 ? 0 : 0 | w(r.length);
          t = u(t, e);
          for (var n = 0; n < e; n += 1) t[n] = 255 & r[n];
          return t;
        }
        function g(t, r, e, n) {
          if ((r.byteLength, e < 0 || r.byteLength < e))
            throw new RangeError("'offset' is out of bounds");
          if (r.byteLength < e + (n || 0))
            throw new RangeError("'length' is out of bounds");
          return (
            (r =
              void 0 === e && void 0 === n
                ? new Uint8Array(r)
                : void 0 === n
                ? new Uint8Array(r, e)
                : new Uint8Array(r, e, n)),
            f.TYPED_ARRAY_SUPPORT
              ? ((t = r).__proto__ = f.prototype)
              : (t = p(t, r)),
            t
          );
        }
        function y(t, r) {
          if (f.isBuffer(r)) {
            var e = 0 | w(r.length);
            return 0 === (t = u(t, e)).length ? t : (r.copy(t, 0, 0, e), t);
          }
          if (r) {
            if (
              ('undefined' != typeof ArrayBuffer &&
                r.buffer instanceof ArrayBuffer) ||
              'length' in r
            )
              return 'number' != typeof r.length || W(r.length)
                ? u(t, 0)
                : p(t, r);
            if ('Buffer' === r.type && n(r.data)) return p(t, r.data);
          }
          throw new TypeError(
            'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
          );
        }
        function w(t) {
          if (t >= o())
            throw new RangeError(
              'Attempt to allocate Buffer larger than maximum size: 0x' +
                o().toString(16) +
                ' bytes'
            );
          return 0 | t;
        }
        function d(t) {
          return +t != t && (t = 0), f.alloc(+t);
        }
        function v(t, r) {
          if (f.isBuffer(t)) return t.length;
          if (
            'undefined' != typeof ArrayBuffer &&
            'function' == typeof ArrayBuffer.isView &&
            (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)
          )
            return t.byteLength;
          'string' != typeof t && (t = '' + t);
          var e = t.length;
          if (0 === e) return 0;
          for (var n = !1; ; )
            switch (r) {
              case 'ascii':
              case 'latin1':
              case 'binary':
                return e;
              case 'utf8':
              case 'utf-8':
              case void 0:
                return $(t).length;
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return 2 * e;
              case 'hex':
                return e >>> 1;
              case 'base64':
                return K(t).length;
              default:
                if (n) return $(t).length;
                (r = ('' + r).toLowerCase()), (n = !0);
            }
        }
        function E(t, r, e) {
          var n = !1;
          if (((void 0 === r || r < 0) && (r = 0), r > this.length)) return '';
          if (((void 0 === e || e > this.length) && (e = this.length), e <= 0))
            return '';
          if ((e >>>= 0) <= (r >>>= 0)) return '';
          for (t || (t = 'utf8'); ; )
            switch (t) {
              case 'hex':
                return x(this, r, e);
              case 'utf8':
              case 'utf-8':
                return Y(this, r, e);
              case 'ascii':
                return L(this, r, e);
              case 'latin1':
              case 'binary':
                return D(this, r, e);
              case 'base64':
                return S(this, r, e);
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return C(this, r, e);
              default:
                if (n) throw new TypeError('Unknown encoding: ' + t);
                (t = (t + '').toLowerCase()), (n = !0);
            }
        }
        function b(t, r, e) {
          var n = t[r];
          (t[r] = t[e]), (t[e] = n);
        }
        function R(t, r, e, n, i) {
          if (0 === t.length) return -1;
          if (
            ('string' == typeof e
              ? ((n = e), (e = 0))
              : e > 2147483647
              ? (e = 2147483647)
              : e < -2147483648 && (e = -2147483648),
            (e = +e),
            isNaN(e) && (e = i ? 0 : t.length - 1),
            e < 0 && (e = t.length + e),
            e >= t.length)
          ) {
            if (i) return -1;
            e = t.length - 1;
          } else if (e < 0) {
            if (!i) return -1;
            e = 0;
          }
          if (('string' == typeof r && (r = f.from(r, n)), f.isBuffer(r)))
            return 0 === r.length ? -1 : _(t, r, e, n, i);
          if ('number' == typeof r)
            return (
              (r &= 255),
              f.TYPED_ARRAY_SUPPORT &&
              'function' == typeof Uint8Array.prototype.indexOf
                ? i
                  ? Uint8Array.prototype.indexOf.call(t, r, e)
                  : Uint8Array.prototype.lastIndexOf.call(t, r, e)
                : _(t, [r], e, n, i)
            );
          throw new TypeError('val must be string, number or Buffer');
        }
        function _(t, r, e, n, i) {
          var o,
            u = 1,
            f = t.length,
            s = r.length;
          if (
            void 0 !== n &&
            ('ucs2' === (n = String(n).toLowerCase()) ||
              'ucs-2' === n ||
              'utf16le' === n ||
              'utf-16le' === n)
          ) {
            if (t.length < 2 || r.length < 2) return -1;
            (u = 2), (f /= 2), (s /= 2), (e /= 2);
          }
          function h(t, r) {
            return 1 === u ? t[r] : t.readUInt16BE(r * u);
          }
          if (i) {
            var a = -1;
            for (o = e; o < f; o++)
              if (h(t, o) === h(r, -1 === a ? 0 : o - a)) {
                if ((-1 === a && (a = o), o - a + 1 === s)) return a * u;
              } else -1 !== a && (o -= o - a), (a = -1);
          } else
            for (e + s > f && (e = f - s), o = e; o >= 0; o--) {
              for (var c = !0, l = 0; l < s; l++)
                if (h(t, o + l) !== h(r, l)) {
                  c = !1;
                  break;
                }
              if (c) return o;
            }
          return -1;
        }
        function A(t, r, e, n) {
          e = Number(e) || 0;
          var i = t.length - e;
          n ? (n = Number(n)) > i && (n = i) : (n = i);
          var o = r.length;
          if (o % 2 != 0) throw new TypeError('Invalid hex string');
          n > o / 2 && (n = o / 2);
          for (var u = 0; u < n; ++u) {
            var f = parseInt(r.substr(2 * u, 2), 16);
            if (isNaN(f)) return u;
            t[e + u] = f;
          }
          return u;
        }
        function m(t, r, e, n) {
          return Q($(r, t.length - e), t, e, n);
        }
        function P(t, r, e, n) {
          return Q(G(r), t, e, n);
        }
        function T(t, r, e, n) {
          return P(t, r, e, n);
        }
        function B(t, r, e, n) {
          return Q(K(r), t, e, n);
        }
        function U(t, r, e, n) {
          return Q(H(r, t.length - e), t, e, n);
        }
        function S(t, e, n) {
          return 0 === e && n === t.length
            ? r.fromByteArray(t)
            : r.fromByteArray(t.slice(e, n));
        }
        function Y(t, r, e) {
          e = Math.min(t.length, e);
          for (var n = [], i = r; i < e; ) {
            var o,
              u,
              f,
              s,
              h = t[i],
              a = null,
              c = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
            if (i + c <= e)
              switch (c) {
                case 1:
                  h < 128 && (a = h);
                  break;
                case 2:
                  128 == (192 & (o = t[i + 1])) &&
                    (s = ((31 & h) << 6) | (63 & o)) > 127 &&
                    (a = s);
                  break;
                case 3:
                  (o = t[i + 1]),
                    (u = t[i + 2]),
                    128 == (192 & o) &&
                      128 == (192 & u) &&
                      (s = ((15 & h) << 12) | ((63 & o) << 6) | (63 & u)) >
                        2047 &&
                      (s < 55296 || s > 57343) &&
                      (a = s);
                  break;
                case 4:
                  (o = t[i + 1]),
                    (u = t[i + 2]),
                    (f = t[i + 3]),
                    128 == (192 & o) &&
                      128 == (192 & u) &&
                      128 == (192 & f) &&
                      (s =
                        ((15 & h) << 18) |
                        ((63 & o) << 12) |
                        ((63 & u) << 6) |
                        (63 & f)) > 65535 &&
                      s < 1114112 &&
                      (a = s);
              }
            null === a
              ? ((a = 65533), (c = 1))
              : a > 65535 &&
                ((a -= 65536),
                n.push(((a >>> 10) & 1023) | 55296),
                (a = 56320 | (1023 & a))),
              n.push(a),
              (i += c);
          }
          return O(n);
        }
        (exports.Buffer = f),
          (exports.SlowBuffer = d),
          (exports.INSPECT_MAX_BYTES = 50),
          (f.TYPED_ARRAY_SUPPORT =
            void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : i()),
          (exports.kMaxLength = o()),
          (f.poolSize = 8192),
          (f._augment = function(t) {
            return (t.__proto__ = f.prototype), t;
          }),
          (f.from = function(t, r, e) {
            return s(null, t, r, e);
          }),
          f.TYPED_ARRAY_SUPPORT &&
            ((f.prototype.__proto__ = Uint8Array.prototype),
            (f.__proto__ = Uint8Array),
            'undefined' != typeof Symbol &&
              Symbol.species &&
              f[Symbol.species] === f &&
              Object.defineProperty(f, Symbol.species, {
                value: null,
                configurable: !0,
              })),
          (f.alloc = function(t, r, e) {
            return a(null, t, r, e);
          }),
          (f.allocUnsafe = function(t) {
            return c(null, t);
          }),
          (f.allocUnsafeSlow = function(t) {
            return c(null, t);
          }),
          (f.isBuffer = function(t) {
            return !(null == t || !t._isBuffer);
          }),
          (f.compare = function(t, r) {
            if (!f.isBuffer(t) || !f.isBuffer(r))
              throw new TypeError('Arguments must be Buffers');
            if (t === r) return 0;
            for (
              var e = t.length, n = r.length, i = 0, o = Math.min(e, n);
              i < o;
              ++i
            )
              if (t[i] !== r[i]) {
                (e = t[i]), (n = r[i]);
                break;
              }
            return e < n ? -1 : n < e ? 1 : 0;
          }),
          (f.isEncoding = function(t) {
            switch (String(t).toLowerCase()) {
              case 'hex':
              case 'utf8':
              case 'utf-8':
              case 'ascii':
              case 'latin1':
              case 'binary':
              case 'base64':
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return !0;
              default:
                return !1;
            }
          }),
          (f.concat = function(t, r) {
            if (!n(t))
              throw new TypeError(
                '"list" argument must be an Array of Buffers'
              );
            if (0 === t.length) return f.alloc(0);
            var e;
            if (void 0 === r)
              for (r = 0, e = 0; e < t.length; ++e) r += t[e].length;
            var i = f.allocUnsafe(r),
              o = 0;
            for (e = 0; e < t.length; ++e) {
              var u = t[e];
              if (!f.isBuffer(u))
                throw new TypeError(
                  '"list" argument must be an Array of Buffers'
                );
              u.copy(i, o), (o += u.length);
            }
            return i;
          }),
          (f.byteLength = v),
          (f.prototype._isBuffer = !0),
          (f.prototype.swap16 = function() {
            var t = this.length;
            if (t % 2 != 0)
              throw new RangeError('Buffer size must be a multiple of 16-bits');
            for (var r = 0; r < t; r += 2) b(this, r, r + 1);
            return this;
          }),
          (f.prototype.swap32 = function() {
            var t = this.length;
            if (t % 4 != 0)
              throw new RangeError('Buffer size must be a multiple of 32-bits');
            for (var r = 0; r < t; r += 4)
              b(this, r, r + 3), b(this, r + 1, r + 2);
            return this;
          }),
          (f.prototype.swap64 = function() {
            var t = this.length;
            if (t % 8 != 0)
              throw new RangeError('Buffer size must be a multiple of 64-bits');
            for (var r = 0; r < t; r += 8)
              b(this, r, r + 7),
                b(this, r + 1, r + 6),
                b(this, r + 2, r + 5),
                b(this, r + 3, r + 4);
            return this;
          }),
          (f.prototype.toString = function() {
            var t = 0 | this.length;
            return 0 === t
              ? ''
              : 0 === arguments.length
              ? Y(this, 0, t)
              : E.apply(this, arguments);
          }),
          (f.prototype.equals = function(t) {
            if (!f.isBuffer(t))
              throw new TypeError('Argument must be a Buffer');
            return this === t || 0 === f.compare(this, t);
          }),
          (f.prototype.inspect = function() {
            var t = '',
              r = exports.INSPECT_MAX_BYTES;
            return (
              this.length > 0 &&
                ((t = this.toString('hex', 0, r)
                  .match(/.{2}/g)
                  .join(' ')),
                this.length > r && (t += ' ... ')),
              '<Buffer ' + t + '>'
            );
          }),
          (f.prototype.compare = function(t, r, e, n, i) {
            if (!f.isBuffer(t))
              throw new TypeError('Argument must be a Buffer');
            if (
              (void 0 === r && (r = 0),
              void 0 === e && (e = t ? t.length : 0),
              void 0 === n && (n = 0),
              void 0 === i && (i = this.length),
              r < 0 || e > t.length || n < 0 || i > this.length)
            )
              throw new RangeError('out of range index');
            if (n >= i && r >= e) return 0;
            if (n >= i) return -1;
            if (r >= e) return 1;
            if (this === t) return 0;
            for (
              var o = (i >>>= 0) - (n >>>= 0),
                u = (e >>>= 0) - (r >>>= 0),
                s = Math.min(o, u),
                h = this.slice(n, i),
                a = t.slice(r, e),
                c = 0;
              c < s;
              ++c
            )
              if (h[c] !== a[c]) {
                (o = h[c]), (u = a[c]);
                break;
              }
            return o < u ? -1 : u < o ? 1 : 0;
          }),
          (f.prototype.includes = function(t, r, e) {
            return -1 !== this.indexOf(t, r, e);
          }),
          (f.prototype.indexOf = function(t, r, e) {
            return R(this, t, r, e, !0);
          }),
          (f.prototype.lastIndexOf = function(t, r, e) {
            return R(this, t, r, e, !1);
          }),
          (f.prototype.write = function(t, r, e, n) {
            if (void 0 === r) (n = 'utf8'), (e = this.length), (r = 0);
            else if (void 0 === e && 'string' == typeof r)
              (n = r), (e = this.length), (r = 0);
            else {
              if (!isFinite(r))
                throw new Error(
                  'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                );
              (r |= 0),
                isFinite(e)
                  ? ((e |= 0), void 0 === n && (n = 'utf8'))
                  : ((n = e), (e = void 0));
            }
            var i = this.length - r;
            if (
              ((void 0 === e || e > i) && (e = i),
              (t.length > 0 && (e < 0 || r < 0)) || r > this.length)
            )
              throw new RangeError('Attempt to write outside buffer bounds');
            n || (n = 'utf8');
            for (var o = !1; ; )
              switch (n) {
                case 'hex':
                  return A(this, t, r, e);
                case 'utf8':
                case 'utf-8':
                  return m(this, t, r, e);
                case 'ascii':
                  return P(this, t, r, e);
                case 'latin1':
                case 'binary':
                  return T(this, t, r, e);
                case 'base64':
                  return B(this, t, r, e);
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return U(this, t, r, e);
                default:
                  if (o) throw new TypeError('Unknown encoding: ' + n);
                  (n = ('' + n).toLowerCase()), (o = !0);
              }
          }),
          (f.prototype.toJSON = function() {
            return {
              type: 'Buffer',
              data: Array.prototype.slice.call(this._arr || this, 0),
            };
          });
        var I = 4096;
        function O(t) {
          var r = t.length;
          if (r <= I) return String.fromCharCode.apply(String, t);
          for (var e = '', n = 0; n < r; )
            e += String.fromCharCode.apply(String, t.slice(n, (n += I)));
          return e;
        }
        function L(t, r, e) {
          var n = '';
          e = Math.min(t.length, e);
          for (var i = r; i < e; ++i) n += String.fromCharCode(127 & t[i]);
          return n;
        }
        function D(t, r, e) {
          var n = '';
          e = Math.min(t.length, e);
          for (var i = r; i < e; ++i) n += String.fromCharCode(t[i]);
          return n;
        }
        function x(t, r, e) {
          var n = t.length;
          (!r || r < 0) && (r = 0), (!e || e < 0 || e > n) && (e = n);
          for (var i = '', o = r; o < e; ++o) i += Z(t[o]);
          return i;
        }
        function C(t, r, e) {
          for (var n = t.slice(r, e), i = '', o = 0; o < n.length; o += 2)
            i += String.fromCharCode(n[o] + 256 * n[o + 1]);
          return i;
        }
        function M(t, r, e) {
          if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint');
          if (t + r > e)
            throw new RangeError('Trying to access beyond buffer length');
        }
        function k(t, r, e, n, i, o) {
          if (!f.isBuffer(t))
            throw new TypeError('"buffer" argument must be a Buffer instance');
          if (r > i || r < o)
            throw new RangeError('"value" argument is out of bounds');
          if (e + n > t.length) throw new RangeError('Index out of range');
        }
        function N(t, r, e, n) {
          r < 0 && (r = 65535 + r + 1);
          for (var i = 0, o = Math.min(t.length - e, 2); i < o; ++i)
            t[e + i] =
              (r & (255 << (8 * (n ? i : 1 - i)))) >>> (8 * (n ? i : 1 - i));
        }
        function z(t, r, e, n) {
          r < 0 && (r = 4294967295 + r + 1);
          for (var i = 0, o = Math.min(t.length - e, 4); i < o; ++i)
            t[e + i] = (r >>> (8 * (n ? i : 3 - i))) & 255;
        }
        function F(t, r, e, n, i, o) {
          if (e + n > t.length) throw new RangeError('Index out of range');
          if (e < 0) throw new RangeError('Index out of range');
        }
        function j(t, r, n, i, o) {
          return (
            o || F(t, r, n, 4, 3.4028234663852886e38, -3.4028234663852886e38),
            e.write(t, r, n, i, 23, 4),
            n + 4
          );
        }
        function q(t, r, n, i, o) {
          return (
            o || F(t, r, n, 8, 1.7976931348623157e308, -1.7976931348623157e308),
            e.write(t, r, n, i, 52, 8),
            n + 8
          );
        }
        (f.prototype.slice = function(t, r) {
          var e,
            n = this.length;
          if (
            ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
            (r = void 0 === r ? n : ~~r) < 0
              ? (r += n) < 0 && (r = 0)
              : r > n && (r = n),
            r < t && (r = t),
            f.TYPED_ARRAY_SUPPORT)
          )
            (e = this.subarray(t, r)).__proto__ = f.prototype;
          else {
            var i = r - t;
            e = new f(i, void 0);
            for (var o = 0; o < i; ++o) e[o] = this[o + t];
          }
          return e;
        }),
          (f.prototype.readUIntLE = function(t, r, e) {
            (t |= 0), (r |= 0), e || M(t, r, this.length);
            for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256); )
              n += this[t + o] * i;
            return n;
          }),
          (f.prototype.readUIntBE = function(t, r, e) {
            (t |= 0), (r |= 0), e || M(t, r, this.length);
            for (var n = this[t + --r], i = 1; r > 0 && (i *= 256); )
              n += this[t + --r] * i;
            return n;
          }),
          (f.prototype.readUInt8 = function(t, r) {
            return r || M(t, 1, this.length), this[t];
          }),
          (f.prototype.readUInt16LE = function(t, r) {
            return r || M(t, 2, this.length), this[t] | (this[t + 1] << 8);
          }),
          (f.prototype.readUInt16BE = function(t, r) {
            return r || M(t, 2, this.length), (this[t] << 8) | this[t + 1];
          }),
          (f.prototype.readUInt32LE = function(t, r) {
            return (
              r || M(t, 4, this.length),
              (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                16777216 * this[t + 3]
            );
          }),
          (f.prototype.readUInt32BE = function(t, r) {
            return (
              r || M(t, 4, this.length),
              16777216 * this[t] +
                ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
            );
          }),
          (f.prototype.readIntLE = function(t, r, e) {
            (t |= 0), (r |= 0), e || M(t, r, this.length);
            for (var n = this[t], i = 1, o = 0; ++o < r && (i *= 256); )
              n += this[t + o] * i;
            return n >= (i *= 128) && (n -= Math.pow(2, 8 * r)), n;
          }),
          (f.prototype.readIntBE = function(t, r, e) {
            (t |= 0), (r |= 0), e || M(t, r, this.length);
            for (var n = r, i = 1, o = this[t + --n]; n > 0 && (i *= 256); )
              o += this[t + --n] * i;
            return o >= (i *= 128) && (o -= Math.pow(2, 8 * r)), o;
          }),
          (f.prototype.readInt8 = function(t, r) {
            return (
              r || M(t, 1, this.length),
              128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            );
          }),
          (f.prototype.readInt16LE = function(t, r) {
            r || M(t, 2, this.length);
            var e = this[t] | (this[t + 1] << 8);
            return 32768 & e ? 4294901760 | e : e;
          }),
          (f.prototype.readInt16BE = function(t, r) {
            r || M(t, 2, this.length);
            var e = this[t + 1] | (this[t] << 8);
            return 32768 & e ? 4294901760 | e : e;
          }),
          (f.prototype.readInt32LE = function(t, r) {
            return (
              r || M(t, 4, this.length),
              this[t] |
                (this[t + 1] << 8) |
                (this[t + 2] << 16) |
                (this[t + 3] << 24)
            );
          }),
          (f.prototype.readInt32BE = function(t, r) {
            return (
              r || M(t, 4, this.length),
              (this[t] << 24) |
                (this[t + 1] << 16) |
                (this[t + 2] << 8) |
                this[t + 3]
            );
          }),
          (f.prototype.readFloatLE = function(t, r) {
            return r || M(t, 4, this.length), e.read(this, t, !0, 23, 4);
          }),
          (f.prototype.readFloatBE = function(t, r) {
            return r || M(t, 4, this.length), e.read(this, t, !1, 23, 4);
          }),
          (f.prototype.readDoubleLE = function(t, r) {
            return r || M(t, 8, this.length), e.read(this, t, !0, 52, 8);
          }),
          (f.prototype.readDoubleBE = function(t, r) {
            return r || M(t, 8, this.length), e.read(this, t, !1, 52, 8);
          }),
          (f.prototype.writeUIntLE = function(t, r, e, n) {
            ((t = +t), (r |= 0), (e |= 0), n) ||
              k(this, t, r, e, Math.pow(2, 8 * e) - 1, 0);
            var i = 1,
              o = 0;
            for (this[r] = 255 & t; ++o < e && (i *= 256); )
              this[r + o] = (t / i) & 255;
            return r + e;
          }),
          (f.prototype.writeUIntBE = function(t, r, e, n) {
            ((t = +t), (r |= 0), (e |= 0), n) ||
              k(this, t, r, e, Math.pow(2, 8 * e) - 1, 0);
            var i = e - 1,
              o = 1;
            for (this[r + i] = 255 & t; --i >= 0 && (o *= 256); )
              this[r + i] = (t / o) & 255;
            return r + e;
          }),
          (f.prototype.writeUInt8 = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 1, 255, 0),
              f.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
              (this[r] = 255 & t),
              r + 1
            );
          }),
          (f.prototype.writeUInt16LE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 2, 65535, 0),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r] = 255 & t), (this[r + 1] = t >>> 8))
                : N(this, t, r, !0),
              r + 2
            );
          }),
          (f.prototype.writeUInt16BE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 2, 65535, 0),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r] = t >>> 8), (this[r + 1] = 255 & t))
                : N(this, t, r, !1),
              r + 2
            );
          }),
          (f.prototype.writeUInt32LE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 4, 4294967295, 0),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r + 3] = t >>> 24),
                  (this[r + 2] = t >>> 16),
                  (this[r + 1] = t >>> 8),
                  (this[r] = 255 & t))
                : z(this, t, r, !0),
              r + 4
            );
          }),
          (f.prototype.writeUInt32BE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 4, 4294967295, 0),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r] = t >>> 24),
                  (this[r + 1] = t >>> 16),
                  (this[r + 2] = t >>> 8),
                  (this[r + 3] = 255 & t))
                : z(this, t, r, !1),
              r + 4
            );
          }),
          (f.prototype.writeIntLE = function(t, r, e, n) {
            if (((t = +t), (r |= 0), !n)) {
              var i = Math.pow(2, 8 * e - 1);
              k(this, t, r, e, i - 1, -i);
            }
            var o = 0,
              u = 1,
              f = 0;
            for (this[r] = 255 & t; ++o < e && (u *= 256); )
              t < 0 && 0 === f && 0 !== this[r + o - 1] && (f = 1),
                (this[r + o] = (((t / u) >> 0) - f) & 255);
            return r + e;
          }),
          (f.prototype.writeIntBE = function(t, r, e, n) {
            if (((t = +t), (r |= 0), !n)) {
              var i = Math.pow(2, 8 * e - 1);
              k(this, t, r, e, i - 1, -i);
            }
            var o = e - 1,
              u = 1,
              f = 0;
            for (this[r + o] = 255 & t; --o >= 0 && (u *= 256); )
              t < 0 && 0 === f && 0 !== this[r + o + 1] && (f = 1),
                (this[r + o] = (((t / u) >> 0) - f) & 255);
            return r + e;
          }),
          (f.prototype.writeInt8 = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 1, 127, -128),
              f.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
              t < 0 && (t = 255 + t + 1),
              (this[r] = 255 & t),
              r + 1
            );
          }),
          (f.prototype.writeInt16LE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 2, 32767, -32768),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r] = 255 & t), (this[r + 1] = t >>> 8))
                : N(this, t, r, !0),
              r + 2
            );
          }),
          (f.prototype.writeInt16BE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 2, 32767, -32768),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r] = t >>> 8), (this[r + 1] = 255 & t))
                : N(this, t, r, !1),
              r + 2
            );
          }),
          (f.prototype.writeInt32LE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 4, 2147483647, -2147483648),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r] = 255 & t),
                  (this[r + 1] = t >>> 8),
                  (this[r + 2] = t >>> 16),
                  (this[r + 3] = t >>> 24))
                : z(this, t, r, !0),
              r + 4
            );
          }),
          (f.prototype.writeInt32BE = function(t, r, e) {
            return (
              (t = +t),
              (r |= 0),
              e || k(this, t, r, 4, 2147483647, -2147483648),
              t < 0 && (t = 4294967295 + t + 1),
              f.TYPED_ARRAY_SUPPORT
                ? ((this[r] = t >>> 24),
                  (this[r + 1] = t >>> 16),
                  (this[r + 2] = t >>> 8),
                  (this[r + 3] = 255 & t))
                : z(this, t, r, !1),
              r + 4
            );
          }),
          (f.prototype.writeFloatLE = function(t, r, e) {
            return j(this, t, r, !0, e);
          }),
          (f.prototype.writeFloatBE = function(t, r, e) {
            return j(this, t, r, !1, e);
          }),
          (f.prototype.writeDoubleLE = function(t, r, e) {
            return q(this, t, r, !0, e);
          }),
          (f.prototype.writeDoubleBE = function(t, r, e) {
            return q(this, t, r, !1, e);
          }),
          (f.prototype.copy = function(t, r, e, n) {
            if (
              (e || (e = 0),
              n || 0 === n || (n = this.length),
              r >= t.length && (r = t.length),
              r || (r = 0),
              n > 0 && n < e && (n = e),
              n === e)
            )
              return 0;
            if (0 === t.length || 0 === this.length) return 0;
            if (r < 0) throw new RangeError('targetStart out of bounds');
            if (e < 0 || e >= this.length)
              throw new RangeError('sourceStart out of bounds');
            if (n < 0) throw new RangeError('sourceEnd out of bounds');
            n > this.length && (n = this.length),
              t.length - r < n - e && (n = t.length - r + e);
            var i,
              o = n - e;
            if (this === t && e < r && r < n)
              for (i = o - 1; i >= 0; --i) t[i + r] = this[i + e];
            else if (o < 1e3 || !f.TYPED_ARRAY_SUPPORT)
              for (i = 0; i < o; ++i) t[i + r] = this[i + e];
            else Uint8Array.prototype.set.call(t, this.subarray(e, e + o), r);
            return o;
          }),
          (f.prototype.fill = function(t, r, e, n) {
            if ('string' == typeof t) {
              if (
                ('string' == typeof r
                  ? ((n = r), (r = 0), (e = this.length))
                  : 'string' == typeof e && ((n = e), (e = this.length)),
                1 === t.length)
              ) {
                var i = t.charCodeAt(0);
                i < 256 && (t = i);
              }
              if (void 0 !== n && 'string' != typeof n)
                throw new TypeError('encoding must be a string');
              if ('string' == typeof n && !f.isEncoding(n))
                throw new TypeError('Unknown encoding: ' + n);
            } else 'number' == typeof t && (t &= 255);
            if (r < 0 || this.length < r || this.length < e)
              throw new RangeError('Out of range index');
            if (e <= r) return this;
            var o;
            if (
              ((r >>>= 0),
              (e = void 0 === e ? this.length : e >>> 0),
              t || (t = 0),
              'number' == typeof t)
            )
              for (o = r; o < e; ++o) this[o] = t;
            else {
              var u = f.isBuffer(t) ? t : $(new f(t, n).toString()),
                s = u.length;
              for (o = 0; o < e - r; ++o) this[o + r] = u[o % s];
            }
            return this;
          });
        var V = /[^+\/0-9A-Za-z-_]/g;
        function X(t) {
          if ((t = J(t).replace(V, '')).length < 2) return '';
          for (; t.length % 4 != 0; ) t += '=';
          return t;
        }
        function J(t) {
          return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, '');
        }
        function Z(t) {
          return t < 16 ? '0' + t.toString(16) : t.toString(16);
        }
        function $(t, r) {
          var e;
          r = r || 1 / 0;
          for (var n = t.length, i = null, o = [], u = 0; u < n; ++u) {
            if ((e = t.charCodeAt(u)) > 55295 && e < 57344) {
              if (!i) {
                if (e > 56319) {
                  (r -= 3) > -1 && o.push(239, 191, 189);
                  continue;
                }
                if (u + 1 === n) {
                  (r -= 3) > -1 && o.push(239, 191, 189);
                  continue;
                }
                i = e;
                continue;
              }
              if (e < 56320) {
                (r -= 3) > -1 && o.push(239, 191, 189), (i = e);
                continue;
              }
              e = 65536 + (((i - 55296) << 10) | (e - 56320));
            } else i && (r -= 3) > -1 && o.push(239, 191, 189);
            if (((i = null), e < 128)) {
              if ((r -= 1) < 0) break;
              o.push(e);
            } else if (e < 2048) {
              if ((r -= 2) < 0) break;
              o.push((e >> 6) | 192, (63 & e) | 128);
            } else if (e < 65536) {
              if ((r -= 3) < 0) break;
              o.push((e >> 12) | 224, ((e >> 6) & 63) | 128, (63 & e) | 128);
            } else {
              if (!(e < 1114112)) throw new Error('Invalid code point');
              if ((r -= 4) < 0) break;
              o.push(
                (e >> 18) | 240,
                ((e >> 12) & 63) | 128,
                ((e >> 6) & 63) | 128,
                (63 & e) | 128
              );
            }
          }
          return o;
        }
        function G(t) {
          for (var r = [], e = 0; e < t.length; ++e)
            r.push(255 & t.charCodeAt(e));
          return r;
        }
        function H(t, r) {
          for (var e, n, i, o = [], u = 0; u < t.length && !((r -= 2) < 0); ++u)
            (n = (e = t.charCodeAt(u)) >> 8),
              (i = e % 256),
              o.push(i),
              o.push(n);
          return o;
        }
        function K(t) {
          return r.toByteArray(X(t));
        }
        function Q(t, r, e, n) {
          for (var i = 0; i < n && !(i + e >= r.length || i >= t.length); ++i)
            r[i + e] = t[i];
          return i;
        }
        function W(t) {
          return t != t;
        }
      },
      { 'base64-js': 'FRly', ieee754: 'Quj6', isarray: '42Z2', buffer: 'aMB2' },
    ],
    LDTC: [
      function(require, module, exports) {
        var Buffer = require('buffer').Buffer;
        var e = require('buffer').Buffer,
          t = require('isarray'),
          r = Object.prototype.toString,
          o =
            'function' == typeof Blob ||
            ('undefined' != typeof Blob &&
              '[object BlobConstructor]' === r.call(Blob)),
          f =
            'function' == typeof File ||
            ('undefined' != typeof File &&
              '[object FileConstructor]' === r.call(File));
        function n(r) {
          if (!r || 'object' != typeof r) return !1;
          if (t(r)) {
            for (var i = 0, u = r.length; i < u; i++) if (n(r[i])) return !0;
            return !1;
          }
          if (
            ('function' == typeof e && e.isBuffer && e.isBuffer(r)) ||
            ('function' == typeof ArrayBuffer && r instanceof ArrayBuffer) ||
            (o && r instanceof Blob) ||
            (f && r instanceof File)
          )
            return !0;
          if (
            r.toJSON &&
            'function' == typeof r.toJSON &&
            1 === arguments.length
          )
            return n(r.toJSON(), !0);
          for (var c in r)
            if (Object.prototype.hasOwnProperty.call(r, c) && n(r[c]))
              return !0;
          return !1;
        }
        module.exports = n;
      },
      { isarray: '42Z2', buffer: 'aMB2' },
    ],
    DqQZ: [
      function(require, module, exports) {
        module.exports = function(r, e, n) {
          var t = r.byteLength;
          if (((e = e || 0), (n = n || t), r.slice)) return r.slice(e, n);
          if (
            (e < 0 && (e += t),
            n < 0 && (n += t),
            n > t && (n = t),
            e >= t || e >= n || 0 === t)
          )
            return new ArrayBuffer(0);
          for (
            var f = new Uint8Array(r), i = new Uint8Array(n - e), u = e, a = 0;
            u < n;
            u++, a++
          )
            i[a] = f[u];
          return i.buffer;
        };
      },
      {},
    ],
    kehq: [
      function(require, module, exports) {
        function n(n, t, u) {
          var r = !1;
          return (u = u || o), (c.count = n), 0 === n ? t() : c;
          function c(n, o) {
            if (c.count <= 0) throw new Error('after called too many times');
            --c.count,
              n ? ((r = !0), t(n), (t = u)) : 0 !== c.count || r || t(null, o);
          }
        }
        function o() {}
        module.exports = n;
      },
      {},
    ],
    O8rs: [
      function(require, module, exports) {
        var global = arguments[3];
        var define;
        var r,
          t = arguments[3];
        !(function(n) {
          var e = 'object' == typeof exports && exports,
            o =
              'object' == typeof module &&
              module &&
              module.exports == e &&
              module,
            i = 'object' == typeof t && t;
          (i.global !== i && i.window !== i) || (n = i);
          var u,
            f,
            a,
            c = String.fromCharCode;
          function d(r) {
            for (var t, n, e = [], o = 0, i = r.length; o < i; )
              (t = r.charCodeAt(o++)) >= 55296 && t <= 56319 && o < i
                ? 56320 == (64512 & (n = r.charCodeAt(o++)))
                  ? e.push(((1023 & t) << 10) + (1023 & n) + 65536)
                  : (e.push(t), o--)
                : e.push(t);
            return e;
          }
          function l(r, t) {
            if (r >= 55296 && r <= 57343) {
              if (t)
                throw Error(
                  'Lone surrogate U+' +
                    r.toString(16).toUpperCase() +
                    ' is not a scalar value'
                );
              return !1;
            }
            return !0;
          }
          function v(r, t) {
            return c(((r >> t) & 63) | 128);
          }
          function s(r, t) {
            if (0 == (4294967168 & r)) return c(r);
            var n = '';
            return (
              0 == (4294965248 & r)
                ? (n = c(((r >> 6) & 31) | 192))
                : 0 == (4294901760 & r)
                ? (l(r, t) || (r = 65533),
                  (n = c(((r >> 12) & 15) | 224)),
                  (n += v(r, 6)))
                : 0 == (4292870144 & r) &&
                  ((n = c(((r >> 18) & 7) | 240)),
                  (n += v(r, 12)),
                  (n += v(r, 6))),
              (n += c((63 & r) | 128))
            );
          }
          function h() {
            if (a >= f) throw Error('Invalid byte index');
            var r = 255 & u[a];
            if ((a++, 128 == (192 & r))) return 63 & r;
            throw Error('Invalid continuation byte');
          }
          function p(r) {
            var t, n;
            if (a > f) throw Error('Invalid byte index');
            if (a == f) return !1;
            if (((t = 255 & u[a]), a++, 0 == (128 & t))) return t;
            if (192 == (224 & t)) {
              if ((n = ((31 & t) << 6) | h()) >= 128) return n;
              throw Error('Invalid continuation byte');
            }
            if (224 == (240 & t)) {
              if ((n = ((15 & t) << 12) | (h() << 6) | h()) >= 2048)
                return l(n, r) ? n : 65533;
              throw Error('Invalid continuation byte');
            }
            if (
              240 == (248 & t) &&
              (n = ((7 & t) << 18) | (h() << 12) | (h() << 6) | h()) >= 65536 &&
              n <= 1114111
            )
              return n;
            throw Error('Invalid UTF-8 detected');
          }
          var y = {
            version: '2.1.2',
            encode: function(r, t) {
              for (
                var n = !1 !== (t = t || {}).strict,
                  e = d(r),
                  o = e.length,
                  i = -1,
                  u = '';
                ++i < o;

              )
                u += s(e[i], n);
              return u;
            },
            decode: function(r, t) {
              var n = !1 !== (t = t || {}).strict;
              (u = d(r)), (f = u.length), (a = 0);
              for (var e, o = []; !1 !== (e = p(n)); ) o.push(e);
              return (function(r) {
                for (var t, n = r.length, e = -1, o = ''; ++e < n; )
                  (t = r[e]) > 65535 &&
                    ((o += c((((t -= 65536) >>> 10) & 1023) | 55296)),
                    (t = 56320 | (1023 & t))),
                    (o += c(t));
                return o;
              })(o);
            },
          };
          if ('function' == typeof r && 'object' == typeof r.amd && r.amd)
            r(function() {
              return y;
            });
          else if (e && !e.nodeType)
            if (o) o.exports = y;
            else {
              var b = {}.hasOwnProperty;
              for (var w in y) b.call(y, w) && (e[w] = y[w]);
            }
          else n.utf8 = y;
        })(this);
      },
      {},
    ],
    g2Ys: [
      function(require, module, exports) {
        !(function() {
          'use strict';
          for (
            var r =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
              e = new Uint8Array(256),
              t = 0;
            t < r.length;
            t++
          )
            e[r.charCodeAt(t)] = t;
          (exports.encode = function(e) {
            var t,
              n = new Uint8Array(e),
              o = n.length,
              a = '';
            for (t = 0; t < o; t += 3)
              (a += r[n[t] >> 2]),
                (a += r[((3 & n[t]) << 4) | (n[t + 1] >> 4)]),
                (a += r[((15 & n[t + 1]) << 2) | (n[t + 2] >> 6)]),
                (a += r[63 & n[t + 2]]);
            return (
              o % 3 == 2
                ? (a = a.substring(0, a.length - 1) + '=')
                : o % 3 == 1 && (a = a.substring(0, a.length - 2) + '=='),
              a
            );
          }),
            (exports.decode = function(r) {
              var t,
                n,
                o,
                a,
                h,
                c = 0.75 * r.length,
                g = r.length,
                i = 0;
              '=' === r[r.length - 1] && (c--, '=' === r[r.length - 2] && c--);
              var u = new ArrayBuffer(c),
                A = new Uint8Array(u);
              for (t = 0; t < g; t += 4)
                (n = e[r.charCodeAt(t)]),
                  (o = e[r.charCodeAt(t + 1)]),
                  (a = e[r.charCodeAt(t + 2)]),
                  (h = e[r.charCodeAt(t + 3)]),
                  (A[i++] = (n << 2) | (o >> 4)),
                  (A[i++] = ((15 & o) << 4) | (a >> 2)),
                  (A[i++] = ((3 & a) << 6) | (63 & h));
              return u;
            });
        })();
      },
      {},
    ],
    R8YD: [
      function(require, module, exports) {
        var global = arguments[3];
        var e = arguments[3],
          t =
            e.BlobBuilder ||
            e.WebKitBlobBuilder ||
            e.MSBlobBuilder ||
            e.MozBlobBuilder,
          r = (function() {
            try {
              return 2 === new Blob(['hi']).size;
            } catch (e) {
              return !1;
            }
          })(),
          n =
            r &&
            (function() {
              try {
                return 2 === new Blob([new Uint8Array([1, 2])]).size;
              } catch (e) {
                return !1;
              }
            })(),
          o = t && t.prototype.append && t.prototype.getBlob;
        function u(e) {
          for (var t = 0; t < e.length; t++) {
            var r = e[t];
            if (r.buffer instanceof ArrayBuffer) {
              var n = r.buffer;
              if (r.byteLength !== n.byteLength) {
                var o = new Uint8Array(r.byteLength);
                o.set(new Uint8Array(n, r.byteOffset, r.byteLength)),
                  (n = o.buffer);
              }
              e[t] = n;
            }
          }
        }
        function b(e, r) {
          r = r || {};
          var n = new t();
          u(e);
          for (var o = 0; o < e.length; o++) n.append(e[o]);
          return r.type ? n.getBlob(r.type) : n.getBlob();
        }
        function f(e, t) {
          return u(e), new Blob(e, t || {});
        }
        module.exports = r ? (n ? e.Blob : f) : o ? b : void 0;
      },
      {},
    ],
    Xbno: [
      function(require, module, exports) {
        var global = arguments[3];
        var e,
          r = arguments[3],
          t = require('./keys'),
          n = require('has-binary2'),
          a = require('arraybuffer.slice'),
          o = require('after'),
          f = require('./utf8');
        r && r.ArrayBuffer && (e = require('base64-arraybuffer'));
        var i =
            'undefined' != typeof navigator &&
            /Android/i.test(navigator.userAgent),
          u =
            'undefined' != typeof navigator &&
            /PhantomJS/i.test(navigator.userAgent),
          c = i || u;
        exports.protocol = 3;
        var d = (exports.packets = {
            open: 0,
            close: 1,
            ping: 2,
            pong: 3,
            message: 4,
            upgrade: 5,
            noop: 6,
          }),
          s = t(d),
          l = { type: 'error', data: 'parser error' },
          y = require('blob');
        function p(e, r) {
          return r('b' + exports.packets[e.type] + e.data.data);
        }
        function g(e, r, t) {
          if (!r) return exports.encodeBase64Packet(e, t);
          var n = e.data,
            a = new Uint8Array(n),
            o = new Uint8Array(1 + n.byteLength);
          o[0] = d[e.type];
          for (var f = 0; f < a.length; f++) o[f + 1] = a[f];
          return t(o.buffer);
        }
        function h(e, r, t) {
          if (!r) return exports.encodeBase64Packet(e, t);
          var n = new FileReader();
          return (
            (n.onload = function() {
              (e.data = n.result), exports.encodePacket(e, r, !0, t);
            }),
            n.readAsArrayBuffer(e.data)
          );
        }
        function v(e, r, t) {
          if (!r) return exports.encodeBase64Packet(e, t);
          if (c) return h(e, r, t);
          var n = new Uint8Array(1);
          return (n[0] = d[e.type]), t(new y([n.buffer, e.data]));
        }
        function A(e) {
          try {
            e = f.decode(e, { strict: !1 });
          } catch (r) {
            return !1;
          }
          return e;
        }
        function b(e, r, t) {
          for (
            var n = new Array(e.length),
              a = o(e.length, t),
              f = function(e, t, a) {
                r(t, function(r, t) {
                  (n[e] = t), a(r, n);
                });
              },
              i = 0;
            i < e.length;
            i++
          )
            f(i, e[i], a);
        }
        (exports.encodePacket = function(e, t, n, a) {
          'function' == typeof t && ((a = t), (t = !1)),
            'function' == typeof n && ((a = n), (n = null));
          var o = void 0 === e.data ? void 0 : e.data.buffer || e.data;
          if (r.ArrayBuffer && o instanceof ArrayBuffer) return g(e, t, a);
          if (y && o instanceof r.Blob) return v(e, t, a);
          if (o && o.base64) return p(e, a);
          var i = d[e.type];
          return (
            void 0 !== e.data &&
              (i += n
                ? f.encode(String(e.data), { strict: !1 })
                : String(e.data)),
            a('' + i)
          );
        }),
          (exports.encodeBase64Packet = function(e, t) {
            var n,
              a = 'b' + exports.packets[e.type];
            if (y && e.data instanceof r.Blob) {
              var o = new FileReader();
              return (
                (o.onload = function() {
                  var e = o.result.split(',')[1];
                  t(a + e);
                }),
                o.readAsDataURL(e.data)
              );
            }
            try {
              n = String.fromCharCode.apply(null, new Uint8Array(e.data));
            } catch (c) {
              for (
                var f = new Uint8Array(e.data), i = new Array(f.length), u = 0;
                u < f.length;
                u++
              )
                i[u] = f[u];
              n = String.fromCharCode.apply(null, i);
            }
            return (a += r.btoa(n)), t(a);
          }),
          (exports.decodePacket = function(e, r, t) {
            if (void 0 === e) return l;
            if ('string' == typeof e) {
              if ('b' === e.charAt(0))
                return exports.decodeBase64Packet(e.substr(1), r);
              if (t && !1 === (e = A(e))) return l;
              var n = e.charAt(0);
              return Number(n) == n && s[n]
                ? e.length > 1
                  ? { type: s[n], data: e.substring(1) }
                  : { type: s[n] }
                : l;
            }
            n = new Uint8Array(e)[0];
            var o = a(e, 1);
            return (
              y && 'blob' === r && (o = new y([o])), { type: s[n], data: o }
            );
          }),
          (exports.decodeBase64Packet = function(r, t) {
            var n = s[r.charAt(0)];
            if (!e) return { type: n, data: { base64: !0, data: r.substr(1) } };
            var a = e.decode(r.substr(1));
            return 'blob' === t && y && (a = new y([a])), { type: n, data: a };
          }),
          (exports.encodePayload = function(e, r, t) {
            'function' == typeof r && ((t = r), (r = null));
            var a = n(e);
            if (r && a)
              return y && !c
                ? exports.encodePayloadAsBlob(e, t)
                : exports.encodePayloadAsArrayBuffer(e, t);
            if (!e.length) return t('0:');
            b(
              e,
              function(e, t) {
                exports.encodePacket(e, !!a && r, !1, function(e) {
                  t(
                    null,
                    (function(e) {
                      return e.length + ':' + e;
                    })(e)
                  );
                });
              },
              function(e, r) {
                return t(r.join(''));
              }
            );
          }),
          (exports.decodePayload = function(e, r, t) {
            if ('string' != typeof e)
              return exports.decodePayloadAsBinary(e, r, t);
            var n;
            if (('function' == typeof r && ((t = r), (r = null)), '' === e))
              return t(l, 0, 1);
            for (var a, o, f = '', i = 0, u = e.length; i < u; i++) {
              var c = e.charAt(i);
              if (':' === c) {
                if ('' === f || f != (a = Number(f))) return t(l, 0, 1);
                if (f != (o = e.substr(i + 1, a)).length) return t(l, 0, 1);
                if (o.length) {
                  if (
                    ((n = exports.decodePacket(o, r, !1)),
                    l.type === n.type && l.data === n.data)
                  )
                    return t(l, 0, 1);
                  if (!1 === t(n, i + a, u)) return;
                }
                (i += a), (f = '');
              } else f += c;
            }
            return '' !== f ? t(l, 0, 1) : void 0;
          }),
          (exports.encodePayloadAsArrayBuffer = function(e, r) {
            if (!e.length) return r(new ArrayBuffer(0));
            b(
              e,
              function(e, r) {
                exports.encodePacket(e, !0, !0, function(e) {
                  return r(null, e);
                });
              },
              function(e, t) {
                var n = t.reduce(function(e, r) {
                    var t;
                    return (
                      e +
                      (t =
                        'string' == typeof r
                          ? r.length
                          : r.byteLength).toString().length +
                      t +
                      2
                    );
                  }, 0),
                  a = new Uint8Array(n),
                  o = 0;
                return (
                  t.forEach(function(e) {
                    var r = 'string' == typeof e,
                      t = e;
                    if (r) {
                      for (
                        var n = new Uint8Array(e.length), f = 0;
                        f < e.length;
                        f++
                      )
                        n[f] = e.charCodeAt(f);
                      t = n.buffer;
                    }
                    a[o++] = r ? 0 : 1;
                    var i = t.byteLength.toString();
                    for (f = 0; f < i.length; f++) a[o++] = parseInt(i[f]);
                    a[o++] = 255;
                    for (n = new Uint8Array(t), f = 0; f < n.length; f++)
                      a[o++] = n[f];
                  }),
                  r(a.buffer)
                );
              }
            );
          }),
          (exports.encodePayloadAsBlob = function(e, r) {
            b(
              e,
              function(e, r) {
                exports.encodePacket(e, !0, !0, function(e) {
                  var t = new Uint8Array(1);
                  if (((t[0] = 1), 'string' == typeof e)) {
                    for (
                      var n = new Uint8Array(e.length), a = 0;
                      a < e.length;
                      a++
                    )
                      n[a] = e.charCodeAt(a);
                    (e = n.buffer), (t[0] = 0);
                  }
                  var o = (e instanceof ArrayBuffer
                      ? e.byteLength
                      : e.size
                    ).toString(),
                    f = new Uint8Array(o.length + 1);
                  for (a = 0; a < o.length; a++) f[a] = parseInt(o[a]);
                  if (((f[o.length] = 255), y)) {
                    var i = new y([t.buffer, f.buffer, e]);
                    r(null, i);
                  }
                });
              },
              function(e, t) {
                return r(new y(t));
              }
            );
          }),
          (exports.decodePayloadAsBinary = function(e, r, t) {
            'function' == typeof r && ((t = r), (r = null));
            for (var n = e, o = []; n.byteLength > 0; ) {
              for (
                var f = new Uint8Array(n), i = 0 === f[0], u = '', c = 1;
                255 !== f[c];
                c++
              ) {
                if (u.length > 310) return t(l, 0, 1);
                u += f[c];
              }
              (n = a(n, 2 + u.length)), (u = parseInt(u));
              var d = a(n, 0, u);
              if (i)
                try {
                  d = String.fromCharCode.apply(null, new Uint8Array(d));
                } catch (p) {
                  var s = new Uint8Array(d);
                  d = '';
                  for (c = 0; c < s.length; c++) d += String.fromCharCode(s[c]);
                }
              o.push(d), (n = a(n, u));
            }
            var y = o.length;
            o.forEach(function(e, n) {
              t(exports.decodePacket(e, r, !0), n, y);
            });
          });
      },
      {
        './keys': 'GzmB',
        'has-binary2': 'LDTC',
        'arraybuffer.slice': 'DqQZ',
        after: 'kehq',
        './utf8': 'O8rs',
        'base64-arraybuffer': 'g2Ys',
        blob: 'R8YD',
      },
    ],
    rlk1: [
      function(require, module, exports) {
        var t = require('engine.io-parser'),
          e = require('component-emitter');
        function s(t) {
          (this.path = t.path),
            (this.hostname = t.hostname),
            (this.port = t.port),
            (this.secure = t.secure),
            (this.query = t.query),
            (this.timestampParam = t.timestampParam),
            (this.timestampRequests = t.timestampRequests),
            (this.readyState = ''),
            (this.agent = t.agent || !1),
            (this.socket = t.socket),
            (this.enablesXDR = t.enablesXDR),
            (this.pfx = t.pfx),
            (this.key = t.key),
            (this.passphrase = t.passphrase),
            (this.cert = t.cert),
            (this.ca = t.ca),
            (this.ciphers = t.ciphers),
            (this.rejectUnauthorized = t.rejectUnauthorized),
            (this.forceNode = t.forceNode),
            (this.extraHeaders = t.extraHeaders),
            (this.localAddress = t.localAddress);
        }
        (module.exports = s),
          e(s.prototype),
          (s.prototype.onError = function(t, e) {
            var s = new Error(t);
            return (
              (s.type = 'TransportError'),
              (s.description = e),
              this.emit('error', s),
              this
            );
          }),
          (s.prototype.open = function() {
            return (
              ('closed' !== this.readyState && '' !== this.readyState) ||
                ((this.readyState = 'opening'), this.doOpen()),
              this
            );
          }),
          (s.prototype.close = function() {
            return (
              ('opening' !== this.readyState && 'open' !== this.readyState) ||
                (this.doClose(), this.onClose()),
              this
            );
          }),
          (s.prototype.send = function(t) {
            if ('open' !== this.readyState)
              throw new Error('Transport not open');
            this.write(t);
          }),
          (s.prototype.onOpen = function() {
            (this.readyState = 'open'), (this.writable = !0), this.emit('open');
          }),
          (s.prototype.onData = function(e) {
            var s = t.decodePacket(e, this.socket.binaryType);
            this.onPacket(s);
          }),
          (s.prototype.onPacket = function(t) {
            this.emit('packet', t);
          }),
          (s.prototype.onClose = function() {
            (this.readyState = 'closed'), this.emit('close');
          });
      },
      { 'engine.io-parser': 'Xbno', 'component-emitter': 'z8J7' },
    ],
    JGjf: [
      function(require, module, exports) {
        (exports.encode = function(e) {
          var n = '';
          for (var o in e)
            e.hasOwnProperty(o) &&
              (n.length && (n += '&'),
              (n += encodeURIComponent(o) + '=' + encodeURIComponent(e[o])));
          return n;
        }),
          (exports.decode = function(e) {
            for (
              var n = {}, o = e.split('&'), t = 0, r = o.length;
              t < r;
              t++
            ) {
              var d = o[t].split('=');
              n[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
            }
            return n;
          });
      },
      {},
    ],
    raUg: [
      function(require, module, exports) {
        module.exports = function(o, t) {
          var p = function() {};
          (p.prototype = t.prototype),
            (o.prototype = new p()),
            (o.prototype.constructor = o);
        };
      },
      {},
    ],
    'C+Rv': [
      function(require, module, exports) {
        'use strict';
        var r,
          e = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(
            ''
          ),
          t = 64,
          n = {},
          o = 0,
          u = 0;
        function a(r) {
          var n = '';
          do {
            (n = e[r % t] + n), (r = Math.floor(r / t));
          } while (r > 0);
          return n;
        }
        function c(r) {
          var e = 0;
          for (u = 0; u < r.length; u++) e = e * t + n[r.charAt(u)];
          return e;
        }
        function f() {
          var e = a(+new Date());
          return e !== r ? ((o = 0), (r = e)) : e + '.' + a(o++);
        }
        for (; u < t; u++) n[e[u]] = u;
        (f.encode = a), (f.decode = c), (module.exports = f);
      },
      {},
    ],
    V4Sz: [
      function(require, module, exports) {
        var process = require('process');
        var e = require('process');
        function o() {
          return (
            !(
              'undefined' == typeof window ||
              !window.process ||
              'renderer' !== window.process.type
            ) ||
            (('undefined' == typeof navigator ||
              !navigator.userAgent ||
              !navigator.userAgent
                .toLowerCase()
                .match(/(edge|trident)\/(\d+)/)) &&
              (('undefined' != typeof document &&
                document.documentElement &&
                document.documentElement.style &&
                document.documentElement.style.WebkitAppearance) ||
                ('undefined' != typeof window &&
                  window.console &&
                  (window.console.firebug ||
                    (window.console.exception && window.console.table))) ||
                ('undefined' != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
                  parseInt(RegExp.$1, 10) >= 31) ||
                ('undefined' != typeof navigator &&
                  navigator.userAgent &&
                  navigator.userAgent
                    .toLowerCase()
                    .match(/applewebkit\/(\d+)/))))
          );
        }
        function C(e) {
          var o = this.useColors;
          if (
            ((e[0] =
              (o ? '%c' : '') +
              this.namespace +
              (o ? ' %c' : ' ') +
              e[0] +
              (o ? '%c ' : ' ') +
              '+' +
              exports.humanize(this.diff)),
            o)
          ) {
            var C = 'color: ' + this.color;
            e.splice(1, 0, C, 'color: inherit');
            var t = 0,
              r = 0;
            e[0].replace(/%[a-zA-Z%]/g, function(e) {
              '%%' !== e && (t++, '%c' === e && (r = t));
            }),
              e.splice(r, 0, C);
          }
        }
        function t() {
          return (
            'object' == typeof console &&
            console.log &&
            Function.prototype.apply.call(console.log, console, arguments)
          );
        }
        function r(e) {
          try {
            null == e
              ? exports.storage.removeItem('debug')
              : (exports.storage.debug = e);
          } catch (o) {}
        }
        function n() {
          var o;
          try {
            o = exports.storage.debug;
          } catch (C) {}
          return !o && void 0 !== e && 'env' in e && (o = void 0), o;
        }
        function F() {
          try {
            return window.localStorage;
          } catch (e) {}
        }
        (exports = module.exports = require('./debug')),
          (exports.log = t),
          (exports.formatArgs = C),
          (exports.save = r),
          (exports.load = n),
          (exports.useColors = o),
          (exports.storage =
            'undefined' != typeof chrome && void 0 !== chrome.storage
              ? chrome.storage.local
              : F()),
          (exports.colors = [
            '#0000CC',
            '#0000FF',
            '#0033CC',
            '#0033FF',
            '#0066CC',
            '#0066FF',
            '#0099CC',
            '#0099FF',
            '#00CC00',
            '#00CC33',
            '#00CC66',
            '#00CC99',
            '#00CCCC',
            '#00CCFF',
            '#3300CC',
            '#3300FF',
            '#3333CC',
            '#3333FF',
            '#3366CC',
            '#3366FF',
            '#3399CC',
            '#3399FF',
            '#33CC00',
            '#33CC33',
            '#33CC66',
            '#33CC99',
            '#33CCCC',
            '#33CCFF',
            '#6600CC',
            '#6600FF',
            '#6633CC',
            '#6633FF',
            '#66CC00',
            '#66CC33',
            '#9900CC',
            '#9900FF',
            '#9933CC',
            '#9933FF',
            '#99CC00',
            '#99CC33',
            '#CC0000',
            '#CC0033',
            '#CC0066',
            '#CC0099',
            '#CC00CC',
            '#CC00FF',
            '#CC3300',
            '#CC3333',
            '#CC3366',
            '#CC3399',
            '#CC33CC',
            '#CC33FF',
            '#CC6600',
            '#CC6633',
            '#CC9900',
            '#CC9933',
            '#CCCC00',
            '#CCCC33',
            '#FF0000',
            '#FF0033',
            '#FF0066',
            '#FF0099',
            '#FF00CC',
            '#FF00FF',
            '#FF3300',
            '#FF3333',
            '#FF3366',
            '#FF3399',
            '#FF33CC',
            '#FF33FF',
            '#FF6600',
            '#FF6633',
            '#FF9900',
            '#FF9933',
            '#FFCC00',
            '#FFCC33',
          ]),
          (exports.formatters.j = function(e) {
            try {
              return JSON.stringify(e);
            } catch (o) {
              return '[UnexpectedJSONParseError]: ' + o.message;
            }
          }),
          exports.enable(n());
      },
      { './debug': 'Uygk', process: 'g5I+' },
    ],
    '7Xp9': [
      function(require, module, exports) {
        var t = require('../transport'),
          e = require('parseqs'),
          i = require('engine.io-parser'),
          o = require('component-inherit'),
          n = require('yeast'),
          r = require('debug')('engine.io-client:polling');
        module.exports = p;
        var s =
          null !=
          new (require('xmlhttprequest-ssl'))({ xdomain: !1 }).responseType;
        function p(e) {
          var i = e && e.forceBase64;
          (s && !i) || (this.supportsBinary = !1), t.call(this, e);
        }
        o(p, t),
          (p.prototype.name = 'polling'),
          (p.prototype.doOpen = function() {
            this.poll();
          }),
          (p.prototype.pause = function(t) {
            var e = this;
            function i() {
              r('paused'), (e.readyState = 'paused'), t();
            }
            if (
              ((this.readyState = 'pausing'), this.polling || !this.writable)
            ) {
              var o = 0;
              this.polling &&
                (r('we are currently polling - waiting to pause'),
                o++,
                this.once('pollComplete', function() {
                  r('pre-pause polling complete'), --o || i();
                })),
                this.writable ||
                  (r('we are currently writing - waiting to pause'),
                  o++,
                  this.once('drain', function() {
                    r('pre-pause writing complete'), --o || i();
                  }));
            } else i();
          }),
          (p.prototype.poll = function() {
            r('polling'), (this.polling = !0), this.doPoll(), this.emit('poll');
          }),
          (p.prototype.onData = function(t) {
            var e = this;
            r('polling got data %s', t);
            i.decodePayload(t, this.socket.binaryType, function(t, i, o) {
              if (
                ('opening' === e.readyState && e.onOpen(), 'close' === t.type)
              )
                return e.onClose(), !1;
              e.onPacket(t);
            }),
              'closed' !== this.readyState &&
                ((this.polling = !1),
                this.emit('pollComplete'),
                'open' === this.readyState
                  ? this.poll()
                  : r('ignoring poll - transport state "%s"', this.readyState));
          }),
          (p.prototype.doClose = function() {
            var t = this;
            function e() {
              r('writing close packet'), t.write([{ type: 'close' }]);
            }
            'open' === this.readyState
              ? (r('transport open - closing'), e())
              : (r('transport not open - deferring close'),
                this.once('open', e));
          }),
          (p.prototype.write = function(t) {
            var e = this;
            this.writable = !1;
            var o = function() {
              (e.writable = !0), e.emit('drain');
            };
            i.encodePayload(t, this.supportsBinary, function(t) {
              e.doWrite(t, o);
            });
          }),
          (p.prototype.uri = function() {
            var t = this.query || {},
              i = this.secure ? 'https' : 'http',
              o = '';
            return (
              !1 !== this.timestampRequests && (t[this.timestampParam] = n()),
              this.supportsBinary || t.sid || (t.b64 = 1),
              (t = e.encode(t)),
              this.port &&
                (('https' === i && 443 !== Number(this.port)) ||
                  ('http' === i && 80 !== Number(this.port))) &&
                (o = ':' + this.port),
              t.length && (t = '?' + t),
              i +
                '://' +
                (-1 !== this.hostname.indexOf(':')
                  ? '[' + this.hostname + ']'
                  : this.hostname) +
                o +
                this.path +
                t
            );
          });
      },
      {
        '../transport': 'rlk1',
        parseqs: 'JGjf',
        'engine.io-parser': 'Xbno',
        'component-inherit': 'raUg',
        yeast: 'C+Rv',
        debug: 'V4Sz',
        'xmlhttprequest-ssl': 'W/Bd',
      },
    ],
    G8kN: [
      function(require, module, exports) {
        var global = arguments[3];
        var t = arguments[3],
          e = require('xmlhttprequest-ssl'),
          s = require('./polling'),
          r = require('component-emitter'),
          i = require('component-inherit'),
          o = require('debug')('engine.io-client:polling-xhr');
        function a() {}
        function n(e) {
          if (
            (s.call(this, e),
            (this.requestTimeout = e.requestTimeout),
            (this.extraHeaders = e.extraHeaders),
            t.location)
          ) {
            var r = 'https:' === location.protocol,
              i = location.port;
            i || (i = r ? 443 : 80),
              (this.xd = e.hostname !== t.location.hostname || i !== e.port),
              (this.xs = e.secure !== r);
          }
        }
        function h(t) {
          (this.method = t.method || 'GET'),
            (this.uri = t.uri),
            (this.xd = !!t.xd),
            (this.xs = !!t.xs),
            (this.async = !1 !== t.async),
            (this.data = void 0 !== t.data ? t.data : null),
            (this.agent = t.agent),
            (this.isBinary = t.isBinary),
            (this.supportsBinary = t.supportsBinary),
            (this.enablesXDR = t.enablesXDR),
            (this.requestTimeout = t.requestTimeout),
            (this.pfx = t.pfx),
            (this.key = t.key),
            (this.passphrase = t.passphrase),
            (this.cert = t.cert),
            (this.ca = t.ca),
            (this.ciphers = t.ciphers),
            (this.rejectUnauthorized = t.rejectUnauthorized),
            (this.extraHeaders = t.extraHeaders),
            this.create();
        }
        function u() {
          for (var t in h.requests)
            h.requests.hasOwnProperty(t) && h.requests[t].abort();
        }
        (module.exports = n),
          (module.exports.Request = h),
          i(n, s),
          (n.prototype.supportsBinary = !0),
          (n.prototype.request = function(t) {
            return (
              ((t = t || {}).uri = this.uri()),
              (t.xd = this.xd),
              (t.xs = this.xs),
              (t.agent = this.agent || !1),
              (t.supportsBinary = this.supportsBinary),
              (t.enablesXDR = this.enablesXDR),
              (t.pfx = this.pfx),
              (t.key = this.key),
              (t.passphrase = this.passphrase),
              (t.cert = this.cert),
              (t.ca = this.ca),
              (t.ciphers = this.ciphers),
              (t.rejectUnauthorized = this.rejectUnauthorized),
              (t.requestTimeout = this.requestTimeout),
              (t.extraHeaders = this.extraHeaders),
              new h(t)
            );
          }),
          (n.prototype.doWrite = function(t, e) {
            var s = 'string' != typeof t && void 0 !== t,
              r = this.request({ method: 'POST', data: t, isBinary: s }),
              i = this;
            r.on('success', e),
              r.on('error', function(t) {
                i.onError('xhr post error', t);
              }),
              (this.sendXhr = r);
          }),
          (n.prototype.doPoll = function() {
            o('xhr poll');
            var t = this.request(),
              e = this;
            t.on('data', function(t) {
              e.onData(t);
            }),
              t.on('error', function(t) {
                e.onError('xhr poll error', t);
              }),
              (this.pollXhr = t);
          }),
          r(h.prototype),
          (h.prototype.create = function() {
            var s = {
              agent: this.agent,
              xdomain: this.xd,
              xscheme: this.xs,
              enablesXDR: this.enablesXDR,
            };
            (s.pfx = this.pfx),
              (s.key = this.key),
              (s.passphrase = this.passphrase),
              (s.cert = this.cert),
              (s.ca = this.ca),
              (s.ciphers = this.ciphers),
              (s.rejectUnauthorized = this.rejectUnauthorized);
            var r = (this.xhr = new e(s)),
              i = this;
            try {
              o('xhr open %s: %s', this.method, this.uri),
                r.open(this.method, this.uri, this.async);
              try {
                if (this.extraHeaders)
                  for (var a in (r.setDisableHeaderCheck &&
                    r.setDisableHeaderCheck(!0),
                  this.extraHeaders))
                    this.extraHeaders.hasOwnProperty(a) &&
                      r.setRequestHeader(a, this.extraHeaders[a]);
              } catch (n) {}
              if ('POST' === this.method)
                try {
                  this.isBinary
                    ? r.setRequestHeader(
                        'Content-type',
                        'application/octet-stream'
                      )
                    : r.setRequestHeader(
                        'Content-type',
                        'text/plain;charset=UTF-8'
                      );
                } catch (n) {}
              try {
                r.setRequestHeader('Accept', '*/*');
              } catch (n) {}
              'withCredentials' in r && (r.withCredentials = !0),
                this.requestTimeout && (r.timeout = this.requestTimeout),
                this.hasXDR()
                  ? ((r.onload = function() {
                      i.onLoad();
                    }),
                    (r.onerror = function() {
                      i.onError(r.responseText);
                    }))
                  : (r.onreadystatechange = function() {
                      if (2 === r.readyState)
                        try {
                          var t = r.getResponseHeader('Content-Type');
                          i.supportsBinary &&
                            'application/octet-stream' === t &&
                            (r.responseType = 'arraybuffer');
                        } catch (n) {}
                      4 === r.readyState &&
                        (200 === r.status || 1223 === r.status
                          ? i.onLoad()
                          : setTimeout(function() {
                              i.onError(r.status);
                            }, 0));
                    }),
                o('xhr data %s', this.data),
                r.send(this.data);
            } catch (n) {
              return void setTimeout(function() {
                i.onError(n);
              }, 0);
            }
            t.document &&
              ((this.index = h.requestsCount++),
              (h.requests[this.index] = this));
          }),
          (h.prototype.onSuccess = function() {
            this.emit('success'), this.cleanup();
          }),
          (h.prototype.onData = function(t) {
            this.emit('data', t), this.onSuccess();
          }),
          (h.prototype.onError = function(t) {
            this.emit('error', t), this.cleanup(!0);
          }),
          (h.prototype.cleanup = function(e) {
            if (void 0 !== this.xhr && null !== this.xhr) {
              if (
                (this.hasXDR()
                  ? (this.xhr.onload = this.xhr.onerror = a)
                  : (this.xhr.onreadystatechange = a),
                e)
              )
                try {
                  this.xhr.abort();
                } catch (s) {}
              t.document && delete h.requests[this.index], (this.xhr = null);
            }
          }),
          (h.prototype.onLoad = function() {
            var t;
            try {
              var e;
              try {
                e = this.xhr.getResponseHeader('Content-Type');
              } catch (s) {}
              t =
                ('application/octet-stream' === e && this.xhr.response) ||
                this.xhr.responseText;
            } catch (s) {
              this.onError(s);
            }
            null != t && this.onData(t);
          }),
          (h.prototype.hasXDR = function() {
            return void 0 !== t.XDomainRequest && !this.xs && this.enablesXDR;
          }),
          (h.prototype.abort = function() {
            this.cleanup();
          }),
          (h.requestsCount = 0),
          (h.requests = {}),
          t.document &&
            (t.attachEvent
              ? t.attachEvent('onunload', u)
              : t.addEventListener &&
                t.addEventListener('beforeunload', u, !1));
      },
      {
        'xmlhttprequest-ssl': 'W/Bd',
        './polling': '7Xp9',
        'component-emitter': 'z8J7',
        'component-inherit': 'raUg',
        debug: 'V4Sz',
      },
    ],
    wxMx: [
      function(require, module, exports) {
        var global = arguments[3];
        var e = arguments[3],
          t = require('./polling'),
          r = require('component-inherit');
        module.exports = s;
        var i,
          o = /\n/g,
          n = /\\n/g;
        function a() {}
        function s(r) {
          t.call(this, r),
            (this.query = this.query || {}),
            i || (e.___eio || (e.___eio = []), (i = e.___eio)),
            (this.index = i.length);
          var o = this;
          i.push(function(e) {
            o.onData(e);
          }),
            (this.query.j = this.index),
            e.document &&
              e.addEventListener &&
              e.addEventListener(
                'beforeunload',
                function() {
                  o.script && (o.script.onerror = a);
                },
                !1
              );
        }
        r(s, t),
          (s.prototype.supportsBinary = !1),
          (s.prototype.doClose = function() {
            this.script &&
              (this.script.parentNode.removeChild(this.script),
              (this.script = null)),
              this.form &&
                (this.form.parentNode.removeChild(this.form),
                (this.form = null),
                (this.iframe = null)),
              t.prototype.doClose.call(this);
          }),
          (s.prototype.doPoll = function() {
            var e = this,
              t = document.createElement('script');
            this.script &&
              (this.script.parentNode.removeChild(this.script),
              (this.script = null)),
              (t.async = !0),
              (t.src = this.uri()),
              (t.onerror = function(t) {
                e.onError('jsonp poll error', t);
              });
            var r = document.getElementsByTagName('script')[0];
            r
              ? r.parentNode.insertBefore(t, r)
              : (document.head || document.body).appendChild(t),
              (this.script = t),
              'undefined' != typeof navigator &&
                /gecko/i.test(navigator.userAgent) &&
                setTimeout(function() {
                  var e = document.createElement('iframe');
                  document.body.appendChild(e), document.body.removeChild(e);
                }, 100);
          }),
          (s.prototype.doWrite = function(e, t) {
            var r = this;
            if (!this.form) {
              var i,
                a = document.createElement('form'),
                s = document.createElement('textarea'),
                c = (this.iframeId = 'eio_iframe_' + this.index);
              (a.className = 'socketio'),
                (a.style.position = 'absolute'),
                (a.style.top = '-1000px'),
                (a.style.left = '-1000px'),
                (a.target = c),
                (a.method = 'POST'),
                a.setAttribute('accept-charset', 'utf-8'),
                (s.name = 'd'),
                a.appendChild(s),
                document.body.appendChild(a),
                (this.form = a),
                (this.area = s);
            }
            function m() {
              d(), t();
            }
            function d() {
              if (r.iframe)
                try {
                  r.form.removeChild(r.iframe);
                } catch (t) {
                  r.onError('jsonp polling iframe removal error', t);
                }
              try {
                var e = '<iframe src="javascript:0" name="' + r.iframeId + '">';
                i = document.createElement(e);
              } catch (t) {
                ((i = document.createElement('iframe')).name = r.iframeId),
                  (i.src = 'javascript:0');
              }
              (i.id = r.iframeId), r.form.appendChild(i), (r.iframe = i);
            }
            (this.form.action = this.uri()),
              d(),
              (e = e.replace(n, '\\\n')),
              (this.area.value = e.replace(o, '\\n'));
            try {
              this.form.submit();
            } catch (h) {}
            this.iframe.attachEvent
              ? (this.iframe.onreadystatechange = function() {
                  'complete' === r.iframe.readyState && m();
                })
              : (this.iframe.onload = m);
          });
      },
      { './polling': '7Xp9', 'component-inherit': 'raUg' },
    ],
    sC8V: [function(require, module, exports) {}, {}],
    '/cF2': [
      function(require, module, exports) {
        var global = arguments[3];
        var e,
          t = arguments[3],
          s = require('../transport'),
          r = require('engine.io-parser'),
          o = require('parseqs'),
          i = require('component-inherit'),
          n = require('yeast'),
          a = require('debug')('engine.io-client:websocket'),
          h = t.WebSocket || t.MozWebSocket;
        if ('undefined' == typeof window)
          try {
            e = require('ws');
          } catch (u) {}
        var p = h;
        function c(t) {
          t && t.forceBase64 && (this.supportsBinary = !1),
            (this.perMessageDeflate = t.perMessageDeflate),
            (this.usingBrowserWebSocket = h && !t.forceNode),
            (this.protocols = t.protocols),
            this.usingBrowserWebSocket || (p = e),
            s.call(this, t);
        }
        p || 'undefined' != typeof window || (p = e),
          (module.exports = c),
          i(c, s),
          (c.prototype.name = 'websocket'),
          (c.prototype.supportsBinary = !0),
          (c.prototype.doOpen = function() {
            if (this.check()) {
              var e = this.uri(),
                t = this.protocols,
                s = {
                  agent: this.agent,
                  perMessageDeflate: this.perMessageDeflate,
                };
              (s.pfx = this.pfx),
                (s.key = this.key),
                (s.passphrase = this.passphrase),
                (s.cert = this.cert),
                (s.ca = this.ca),
                (s.ciphers = this.ciphers),
                (s.rejectUnauthorized = this.rejectUnauthorized),
                this.extraHeaders && (s.headers = this.extraHeaders),
                this.localAddress && (s.localAddress = this.localAddress);
              try {
                this.ws = this.usingBrowserWebSocket
                  ? t
                    ? new p(e, t)
                    : new p(e)
                  : new p(e, t, s);
              } catch (r) {
                return this.emit('error', r);
              }
              void 0 === this.ws.binaryType && (this.supportsBinary = !1),
                this.ws.supports && this.ws.supports.binary
                  ? ((this.supportsBinary = !0),
                    (this.ws.binaryType = 'nodebuffer'))
                  : (this.ws.binaryType = 'arraybuffer'),
                this.addEventListeners();
            }
          }),
          (c.prototype.addEventListeners = function() {
            var e = this;
            (this.ws.onopen = function() {
              e.onOpen();
            }),
              (this.ws.onclose = function() {
                e.onClose();
              }),
              (this.ws.onmessage = function(t) {
                e.onData(t.data);
              }),
              (this.ws.onerror = function(t) {
                e.onError('websocket error', t);
              });
          }),
          (c.prototype.write = function(e) {
            var s = this;
            this.writable = !1;
            for (var o = e.length, i = 0, n = o; i < n; i++)
              !(function(e) {
                r.encodePacket(e, s.supportsBinary, function(r) {
                  if (!s.usingBrowserWebSocket) {
                    var i = {};
                    if (
                      (e.options && (i.compress = e.options.compress),
                      s.perMessageDeflate)
                    )
                      ('string' == typeof r
                        ? t.Buffer.byteLength(r)
                        : r.length) < s.perMessageDeflate.threshold &&
                        (i.compress = !1);
                  }
                  try {
                    s.usingBrowserWebSocket ? s.ws.send(r) : s.ws.send(r, i);
                  } catch (u) {
                    a('websocket closed before onclose event');
                  }
                  --o || h();
                });
              })(e[i]);
            function h() {
              s.emit('flush'),
                setTimeout(function() {
                  (s.writable = !0), s.emit('drain');
                }, 0);
            }
          }),
          (c.prototype.onClose = function() {
            s.prototype.onClose.call(this);
          }),
          (c.prototype.doClose = function() {
            void 0 !== this.ws && this.ws.close();
          }),
          (c.prototype.uri = function() {
            var e = this.query || {},
              t = this.secure ? 'wss' : 'ws',
              s = '';
            return (
              this.port &&
                (('wss' === t && 443 !== Number(this.port)) ||
                  ('ws' === t && 80 !== Number(this.port))) &&
                (s = ':' + this.port),
              this.timestampRequests && (e[this.timestampParam] = n()),
              this.supportsBinary || (e.b64 = 1),
              (e = o.encode(e)).length && (e = '?' + e),
              t +
                '://' +
                (-1 !== this.hostname.indexOf(':')
                  ? '[' + this.hostname + ']'
                  : this.hostname) +
                s +
                this.path +
                e
            );
          }),
          (c.prototype.check = function() {
            return !(
              !p ||
              ('__initialize' in p && this.name === c.prototype.name)
            );
          });
      },
      {
        '../transport': 'rlk1',
        'engine.io-parser': 'Xbno',
        parseqs: 'JGjf',
        'component-inherit': 'raUg',
        yeast: 'C+Rv',
        debug: 'V4Sz',
        ws: 'sC8V',
      },
    ],
    PPwh: [
      function(require, module, exports) {
        var global = arguments[3];
        var e = arguments[3],
          o = require('xmlhttprequest-ssl'),
          r = require('./polling-xhr'),
          n = require('./polling-jsonp'),
          t = require('./websocket');
        function i(t) {
          var i = !1,
            s = !1,
            l = !1 !== t.jsonp;
          if (e.location) {
            var p = 'https:' === location.protocol,
              a = location.port;
            a || (a = p ? 443 : 80),
              (i = t.hostname !== location.hostname || a !== t.port),
              (s = t.secure !== p);
          }
          if (
            ((t.xdomain = i),
            (t.xscheme = s),
            'open' in new o(t) && !t.forceJSONP)
          )
            return new r(t);
          if (!l) throw new Error('JSONP disabled');
          return new n(t);
        }
        (exports.polling = i), (exports.websocket = t);
      },
      {
        'xmlhttprequest-ssl': 'W/Bd',
        './polling-xhr': 'G8kN',
        './polling-jsonp': 'wxMx',
        './websocket': '/cF2',
      },
    ],
    pSkj: [
      function(require, module, exports) {
        var r = [].indexOf;
        module.exports = function(e, n) {
          if (r) return e.indexOf(n);
          for (var f = 0; f < e.length; ++f) if (e[f] === n) return f;
          return -1;
        };
      },
      {},
    ],
    Jjui: [
      function(require, module, exports) {
        var global = arguments[3];
        var e = arguments[3],
          t = require('./transports/index'),
          r = require('component-emitter'),
          s = require('debug')('engine.io-client:socket'),
          i = require('indexof'),
          o = require('engine.io-parser'),
          n = require('parseuri'),
          a = require('parseqs');
        function p(t, r) {
          if (!(this instanceof p)) return new p(t, r);
          (r = r || {}),
            t && 'object' == typeof t && ((r = t), (t = null)),
            t
              ? ((t = n(t)),
                (r.hostname = t.host),
                (r.secure = 'https' === t.protocol || 'wss' === t.protocol),
                (r.port = t.port),
                t.query && (r.query = t.query))
              : r.host && (r.hostname = n(r.host).host),
            (this.secure =
              null != r.secure
                ? r.secure
                : e.location && 'https:' === location.protocol),
            r.hostname && !r.port && (r.port = this.secure ? '443' : '80'),
            (this.agent = r.agent || !1),
            (this.hostname =
              r.hostname || (e.location ? location.hostname : 'localhost')),
            (this.port =
              r.port ||
              (e.location && location.port
                ? location.port
                : this.secure
                ? 443
                : 80)),
            (this.query = r.query || {}),
            'string' == typeof this.query &&
              (this.query = a.decode(this.query)),
            (this.upgrade = !1 !== r.upgrade),
            (this.path = (r.path || '/engine.io').replace(/\/$/, '') + '/'),
            (this.forceJSONP = !!r.forceJSONP),
            (this.jsonp = !1 !== r.jsonp),
            (this.forceBase64 = !!r.forceBase64),
            (this.enablesXDR = !!r.enablesXDR),
            (this.timestampParam = r.timestampParam || 't'),
            (this.timestampRequests = r.timestampRequests),
            (this.transports = r.transports || ['polling', 'websocket']),
            (this.transportOptions = r.transportOptions || {}),
            (this.readyState = ''),
            (this.writeBuffer = []),
            (this.prevBufferLen = 0),
            (this.policyPort = r.policyPort || 843),
            (this.rememberUpgrade = r.rememberUpgrade || !1),
            (this.binaryType = null),
            (this.onlyBinaryUpgrades = r.onlyBinaryUpgrades),
            (this.perMessageDeflate =
              !1 !== r.perMessageDeflate && (r.perMessageDeflate || {})),
            !0 === this.perMessageDeflate && (this.perMessageDeflate = {}),
            this.perMessageDeflate &&
              null == this.perMessageDeflate.threshold &&
              (this.perMessageDeflate.threshold = 1024),
            (this.pfx = r.pfx || null),
            (this.key = r.key || null),
            (this.passphrase = r.passphrase || null),
            (this.cert = r.cert || null),
            (this.ca = r.ca || null),
            (this.ciphers = r.ciphers || null),
            (this.rejectUnauthorized =
              void 0 === r.rejectUnauthorized || r.rejectUnauthorized),
            (this.forceNode = !!r.forceNode);
          var s = 'object' == typeof e && e;
          s.global === s &&
            (r.extraHeaders &&
              Object.keys(r.extraHeaders).length > 0 &&
              (this.extraHeaders = r.extraHeaders),
            r.localAddress && (this.localAddress = r.localAddress)),
            (this.id = null),
            (this.upgrades = null),
            (this.pingInterval = null),
            (this.pingTimeout = null),
            (this.pingIntervalTimer = null),
            (this.pingTimeoutTimer = null),
            this.open();
        }
        function h(e) {
          var t = {};
          for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
          return t;
        }
        (module.exports = p),
          (p.priorWebsocketSuccess = !1),
          r(p.prototype),
          (p.protocol = o.protocol),
          (p.Socket = p),
          (p.Transport = require('./transport')),
          (p.transports = require('./transports/index')),
          (p.parser = require('engine.io-parser')),
          (p.prototype.createTransport = function(e) {
            s('creating transport "%s"', e);
            var r = h(this.query);
            (r.EIO = o.protocol), (r.transport = e);
            var i = this.transportOptions[e] || {};
            return (
              this.id && (r.sid = this.id),
              new t[e]({
                query: r,
                socket: this,
                agent: i.agent || this.agent,
                hostname: i.hostname || this.hostname,
                port: i.port || this.port,
                secure: i.secure || this.secure,
                path: i.path || this.path,
                forceJSONP: i.forceJSONP || this.forceJSONP,
                jsonp: i.jsonp || this.jsonp,
                forceBase64: i.forceBase64 || this.forceBase64,
                enablesXDR: i.enablesXDR || this.enablesXDR,
                timestampRequests:
                  i.timestampRequests || this.timestampRequests,
                timestampParam: i.timestampParam || this.timestampParam,
                policyPort: i.policyPort || this.policyPort,
                pfx: i.pfx || this.pfx,
                key: i.key || this.key,
                passphrase: i.passphrase || this.passphrase,
                cert: i.cert || this.cert,
                ca: i.ca || this.ca,
                ciphers: i.ciphers || this.ciphers,
                rejectUnauthorized:
                  i.rejectUnauthorized || this.rejectUnauthorized,
                perMessageDeflate:
                  i.perMessageDeflate || this.perMessageDeflate,
                extraHeaders: i.extraHeaders || this.extraHeaders,
                forceNode: i.forceNode || this.forceNode,
                localAddress: i.localAddress || this.localAddress,
                requestTimeout: i.requestTimeout || this.requestTimeout,
                protocols: i.protocols || void 0,
              })
            );
          }),
          (p.prototype.open = function() {
            var e;
            if (
              this.rememberUpgrade &&
              p.priorWebsocketSuccess &&
              -1 !== this.transports.indexOf('websocket')
            )
              e = 'websocket';
            else {
              if (0 === this.transports.length) {
                var t = this;
                return void setTimeout(function() {
                  t.emit('error', 'No transports available');
                }, 0);
              }
              e = this.transports[0];
            }
            this.readyState = 'opening';
            try {
              e = this.createTransport(e);
            } catch (r) {
              return this.transports.shift(), void this.open();
            }
            e.open(), this.setTransport(e);
          }),
          (p.prototype.setTransport = function(e) {
            s('setting transport %s', e.name);
            var t = this;
            this.transport &&
              (s('clearing existing transport %s', this.transport.name),
              this.transport.removeAllListeners()),
              (this.transport = e),
              e
                .on('drain', function() {
                  t.onDrain();
                })
                .on('packet', function(e) {
                  t.onPacket(e);
                })
                .on('error', function(e) {
                  t.onError(e);
                })
                .on('close', function() {
                  t.onClose('transport close');
                });
          }),
          (p.prototype.probe = function(e) {
            s('probing transport "%s"', e);
            var t = this.createTransport(e, { probe: 1 }),
              r = !1,
              i = this;
            function o() {
              if (i.onlyBinaryUpgrades) {
                var o = !this.supportsBinary && i.transport.supportsBinary;
                r = r || o;
              }
              r ||
                (s('probe transport "%s" opened', e),
                t.send([{ type: 'ping', data: 'probe' }]),
                t.once('packet', function(o) {
                  if (!r)
                    if ('pong' === o.type && 'probe' === o.data) {
                      if (
                        (s('probe transport "%s" pong', e),
                        (i.upgrading = !0),
                        i.emit('upgrading', t),
                        !t)
                      )
                        return;
                      (p.priorWebsocketSuccess = 'websocket' === t.name),
                        s('pausing current transport "%s"', i.transport.name),
                        i.transport.pause(function() {
                          r ||
                            ('closed' !== i.readyState &&
                              (s(
                                'changing transport and sending upgrade packet'
                              ),
                              l(),
                              i.setTransport(t),
                              t.send([{ type: 'upgrade' }]),
                              i.emit('upgrade', t),
                              (t = null),
                              (i.upgrading = !1),
                              i.flush()));
                        });
                    } else {
                      s('probe transport "%s" failed', e);
                      var n = new Error('probe error');
                      (n.transport = t.name), i.emit('upgradeError', n);
                    }
                }));
            }
            function n() {
              r || ((r = !0), l(), t.close(), (t = null));
            }
            function a(r) {
              var o = new Error('probe error: ' + r);
              (o.transport = t.name),
                n(),
                s('probe transport "%s" failed because of error: %s', e, r),
                i.emit('upgradeError', o);
            }
            function h() {
              a('transport closed');
            }
            function c() {
              a('socket closed');
            }
            function u(e) {
              t &&
                e.name !== t.name &&
                (s('"%s" works - aborting "%s"', e.name, t.name), n());
            }
            function l() {
              t.removeListener('open', o),
                t.removeListener('error', a),
                t.removeListener('close', h),
                i.removeListener('close', c),
                i.removeListener('upgrading', u);
            }
            (p.priorWebsocketSuccess = !1),
              t.once('open', o),
              t.once('error', a),
              t.once('close', h),
              this.once('close', c),
              this.once('upgrading', u),
              t.open();
          }),
          (p.prototype.onOpen = function() {
            if (
              (s('socket open'),
              (this.readyState = 'open'),
              (p.priorWebsocketSuccess = 'websocket' === this.transport.name),
              this.emit('open'),
              this.flush(),
              'open' === this.readyState &&
                this.upgrade &&
                this.transport.pause)
            ) {
              s('starting upgrade probes');
              for (var e = 0, t = this.upgrades.length; e < t; e++)
                this.probe(this.upgrades[e]);
            }
          }),
          (p.prototype.onPacket = function(e) {
            if (
              'opening' === this.readyState ||
              'open' === this.readyState ||
              'closing' === this.readyState
            )
              switch (
                (s('socket receive: type "%s", data "%s"', e.type, e.data),
                this.emit('packet', e),
                this.emit('heartbeat'),
                e.type)
              ) {
                case 'open':
                  this.onHandshake(JSON.parse(e.data));
                  break;
                case 'pong':
                  this.setPing(), this.emit('pong');
                  break;
                case 'error':
                  var t = new Error('server error');
                  (t.code = e.data), this.onError(t);
                  break;
                case 'message':
                  this.emit('data', e.data), this.emit('message', e.data);
              }
            else
              s('packet received with socket readyState "%s"', this.readyState);
          }),
          (p.prototype.onHandshake = function(e) {
            this.emit('handshake', e),
              (this.id = e.sid),
              (this.transport.query.sid = e.sid),
              (this.upgrades = this.filterUpgrades(e.upgrades)),
              (this.pingInterval = e.pingInterval),
              (this.pingTimeout = e.pingTimeout),
              this.onOpen(),
              'closed' !== this.readyState &&
                (this.setPing(),
                this.removeListener('heartbeat', this.onHeartbeat),
                this.on('heartbeat', this.onHeartbeat));
          }),
          (p.prototype.onHeartbeat = function(e) {
            clearTimeout(this.pingTimeoutTimer);
            var t = this;
            t.pingTimeoutTimer = setTimeout(function() {
              'closed' !== t.readyState && t.onClose('ping timeout');
            }, e || t.pingInterval + t.pingTimeout);
          }),
          (p.prototype.setPing = function() {
            var e = this;
            clearTimeout(e.pingIntervalTimer),
              (e.pingIntervalTimer = setTimeout(function() {
                s(
                  'writing ping packet - expecting pong within %sms',
                  e.pingTimeout
                ),
                  e.ping(),
                  e.onHeartbeat(e.pingTimeout);
              }, e.pingInterval));
          }),
          (p.prototype.ping = function() {
            var e = this;
            this.sendPacket('ping', function() {
              e.emit('ping');
            });
          }),
          (p.prototype.onDrain = function() {
            this.writeBuffer.splice(0, this.prevBufferLen),
              (this.prevBufferLen = 0),
              0 === this.writeBuffer.length ? this.emit('drain') : this.flush();
          }),
          (p.prototype.flush = function() {
            'closed' !== this.readyState &&
              this.transport.writable &&
              !this.upgrading &&
              this.writeBuffer.length &&
              (s('flushing %d packets in socket', this.writeBuffer.length),
              this.transport.send(this.writeBuffer),
              (this.prevBufferLen = this.writeBuffer.length),
              this.emit('flush'));
          }),
          (p.prototype.write = p.prototype.send = function(e, t, r) {
            return this.sendPacket('message', e, t, r), this;
          }),
          (p.prototype.sendPacket = function(e, t, r, s) {
            if (
              ('function' == typeof t && ((s = t), (t = void 0)),
              'function' == typeof r && ((s = r), (r = null)),
              'closing' !== this.readyState && 'closed' !== this.readyState)
            ) {
              (r = r || {}).compress = !1 !== r.compress;
              var i = { type: e, data: t, options: r };
              this.emit('packetCreate', i),
                this.writeBuffer.push(i),
                s && this.once('flush', s),
                this.flush();
            }
          }),
          (p.prototype.close = function() {
            if ('opening' === this.readyState || 'open' === this.readyState) {
              this.readyState = 'closing';
              var e = this;
              this.writeBuffer.length
                ? this.once('drain', function() {
                    this.upgrading ? i() : t();
                  })
                : this.upgrading
                ? i()
                : t();
            }
            function t() {
              e.onClose('forced close'),
                s('socket closing - telling transport to close'),
                e.transport.close();
            }
            function r() {
              e.removeListener('upgrade', r),
                e.removeListener('upgradeError', r),
                t();
            }
            function i() {
              e.once('upgrade', r), e.once('upgradeError', r);
            }
            return this;
          }),
          (p.prototype.onError = function(e) {
            s('socket error %j', e),
              (p.priorWebsocketSuccess = !1),
              this.emit('error', e),
              this.onClose('transport error', e);
          }),
          (p.prototype.onClose = function(e, t) {
            if (
              'opening' === this.readyState ||
              'open' === this.readyState ||
              'closing' === this.readyState
            ) {
              s('socket close with reason: "%s"', e);
              clearTimeout(this.pingIntervalTimer),
                clearTimeout(this.pingTimeoutTimer),
                this.transport.removeAllListeners('close'),
                this.transport.close(),
                this.transport.removeAllListeners(),
                (this.readyState = 'closed'),
                (this.id = null),
                this.emit('close', e, t),
                (this.writeBuffer = []),
                (this.prevBufferLen = 0);
            }
          }),
          (p.prototype.filterUpgrades = function(e) {
            for (var t = [], r = 0, s = e.length; r < s; r++)
              ~i(this.transports, e[r]) && t.push(e[r]);
            return t;
          });
      },
      {
        './transports/index': 'PPwh',
        'component-emitter': 'z8J7',
        debug: 'V4Sz',
        indexof: 'pSkj',
        'engine.io-parser': 'Xbno',
        parseuri: 'mOLL',
        parseqs: 'JGjf',
        './transport': 'rlk1',
      },
    ],
    sh5F: [
      function(require, module, exports) {
        (module.exports = require('./socket')),
          (module.exports.parser = require('engine.io-parser'));
      },
      { './socket': 'Jjui', 'engine.io-parser': 'Xbno' },
    ],
    yYHC: [
      function(require, module, exports) {
        function r(r, e) {
          for (var n = [], o = (e = e || 0) || 0; o < r.length; o++)
            n[o - e] = r[o];
          return n;
        }
        module.exports = r;
      },
      {},
    ],
    Co6q: [
      function(require, module, exports) {
        function e(e, n, o) {
          return (
            e.on(n, o),
            {
              destroy: function() {
                e.removeListener(n, o);
              },
            }
          );
        }
        module.exports = e;
      },
      {},
    ],
    QoMD: [
      function(require, module, exports) {
        var n = [].slice;
        module.exports = function(r, t) {
          if (('string' == typeof t && (t = r[t]), 'function' != typeof t))
            throw new Error('bind() requires a function');
          var o = n.call(arguments, 2);
          return function() {
            return t.apply(r, o.concat(n.call(arguments)));
          };
        };
      },
      {},
    ],
    '4nNQ': [
      function(require, module, exports) {
        var t = require('socket.io-parser'),
          e = require('component-emitter'),
          i = require('to-array'),
          s = require('./on'),
          n = require('component-bind'),
          o = require('debug')('socket.io-client:socket'),
          c = require('parseqs'),
          r = require('has-binary2');
        module.exports = exports = a;
        var h = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1,
          },
          p = e.prototype.emit;
        function a(t, e, i) {
          (this.io = t),
            (this.nsp = e),
            (this.json = this),
            (this.ids = 0),
            (this.acks = {}),
            (this.receiveBuffer = []),
            (this.sendBuffer = []),
            (this.connected = !1),
            (this.disconnected = !0),
            (this.flags = {}),
            i && i.query && (this.query = i.query),
            this.io.autoConnect && this.open();
        }
        e(a.prototype),
          (a.prototype.subEvents = function() {
            if (!this.subs) {
              var t = this.io;
              this.subs = [
                s(t, 'open', n(this, 'onopen')),
                s(t, 'packet', n(this, 'onpacket')),
                s(t, 'close', n(this, 'onclose')),
              ];
            }
          }),
          (a.prototype.open = a.prototype.connect = function() {
            return this.connected
              ? this
              : (this.subEvents(),
                this.io.open(),
                'open' === this.io.readyState && this.onopen(),
                this.emit('connecting'),
                this);
          }),
          (a.prototype.send = function() {
            var t = i(arguments);
            return t.unshift('message'), this.emit.apply(this, t), this;
          }),
          (a.prototype.emit = function(e) {
            if (h.hasOwnProperty(e)) return p.apply(this, arguments), this;
            var s = i(arguments),
              n = {
                type: (void 0 !== this.flags.binary
                ? this.flags.binary
                : r(s))
                  ? t.BINARY_EVENT
                  : t.EVENT,
                data: s,
                options: {},
              };
            return (
              (n.options.compress = !this.flags || !1 !== this.flags.compress),
              'function' == typeof s[s.length - 1] &&
                (o('emitting packet with ack id %d', this.ids),
                (this.acks[this.ids] = s.pop()),
                (n.id = this.ids++)),
              this.connected ? this.packet(n) : this.sendBuffer.push(n),
              (this.flags = {}),
              this
            );
          }),
          (a.prototype.packet = function(t) {
            (t.nsp = this.nsp), this.io.packet(t);
          }),
          (a.prototype.onopen = function() {
            if ((o('transport is open - connecting'), '/' !== this.nsp))
              if (this.query) {
                var e =
                  'object' == typeof this.query
                    ? c.encode(this.query)
                    : this.query;
                o('sending connect packet with query %s', e),
                  this.packet({ type: t.CONNECT, query: e });
              } else this.packet({ type: t.CONNECT });
          }),
          (a.prototype.onclose = function(t) {
            o('close (%s)', t),
              (this.connected = !1),
              (this.disconnected = !0),
              delete this.id,
              this.emit('disconnect', t);
          }),
          (a.prototype.onpacket = function(e) {
            var i = e.nsp === this.nsp,
              s = e.type === t.ERROR && '/' === e.nsp;
            if (i || s)
              switch (e.type) {
                case t.CONNECT:
                  this.onconnect();
                  break;
                case t.EVENT:
                case t.BINARY_EVENT:
                  this.onevent(e);
                  break;
                case t.ACK:
                case t.BINARY_ACK:
                  this.onack(e);
                  break;
                case t.DISCONNECT:
                  this.ondisconnect();
                  break;
                case t.ERROR:
                  this.emit('error', e.data);
              }
          }),
          (a.prototype.onevent = function(t) {
            var e = t.data || [];
            o('emitting event %j', e),
              null != t.id &&
                (o('attaching ack callback to event'), e.push(this.ack(t.id))),
              this.connected ? p.apply(this, e) : this.receiveBuffer.push(e);
          }),
          (a.prototype.ack = function(e) {
            var s = this,
              n = !1;
            return function() {
              if (!n) {
                n = !0;
                var c = i(arguments);
                o('sending ack %j', c),
                  s.packet({
                    type: r(c) ? t.BINARY_ACK : t.ACK,
                    id: e,
                    data: c,
                  });
              }
            };
          }),
          (a.prototype.onack = function(t) {
            var e = this.acks[t.id];
            'function' == typeof e
              ? (o('calling ack %s with %j', t.id, t.data),
                e.apply(this, t.data),
                delete this.acks[t.id])
              : o('bad ack %s', t.id);
          }),
          (a.prototype.onconnect = function() {
            (this.connected = !0),
              (this.disconnected = !1),
              this.emit('connect'),
              this.emitBuffered();
          }),
          (a.prototype.emitBuffered = function() {
            var t;
            for (t = 0; t < this.receiveBuffer.length; t++)
              p.apply(this, this.receiveBuffer[t]);
            for (
              this.receiveBuffer = [], t = 0;
              t < this.sendBuffer.length;
              t++
            )
              this.packet(this.sendBuffer[t]);
            this.sendBuffer = [];
          }),
          (a.prototype.ondisconnect = function() {
            o('server disconnect (%s)', this.nsp),
              this.destroy(),
              this.onclose('io server disconnect');
          }),
          (a.prototype.destroy = function() {
            if (this.subs) {
              for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
              this.subs = null;
            }
            this.io.destroy(this);
          }),
          (a.prototype.close = a.prototype.disconnect = function() {
            return (
              this.connected &&
                (o('performing disconnect (%s)', this.nsp),
                this.packet({ type: t.DISCONNECT })),
              this.destroy(),
              this.connected && this.onclose('io client disconnect'),
              this
            );
          }),
          (a.prototype.compress = function(t) {
            return (this.flags.compress = t), this;
          }),
          (a.prototype.binary = function(t) {
            return (this.flags.binary = t), this;
          });
      },
      {
        'socket.io-parser': 'D3t/',
        'component-emitter': 'z8J7',
        'to-array': 'yYHC',
        './on': 'Co6q',
        'component-bind': 'QoMD',
        debug: 'uha7',
        parseqs: 'JGjf',
        'has-binary2': 'LDTC',
      },
    ],
    sO3v: [
      function(require, module, exports) {
        function t(t) {
          (t = t || {}),
            (this.ms = t.min || 100),
            (this.max = t.max || 1e4),
            (this.factor = t.factor || 2),
            (this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0),
            (this.attempts = 0);
        }
        (module.exports = t),
          (t.prototype.duration = function() {
            var t = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
              var i = Math.random(),
                o = Math.floor(i * this.jitter * t);
              t = 0 == (1 & Math.floor(10 * i)) ? t - o : t + o;
            }
            return 0 | Math.min(t, this.max);
          }),
          (t.prototype.reset = function() {
            this.attempts = 0;
          }),
          (t.prototype.setMin = function(t) {
            this.ms = t;
          }),
          (t.prototype.setMax = function(t) {
            this.max = t;
          }),
          (t.prototype.setJitter = function(t) {
            this.jitter = t;
          });
      },
      {},
    ],
    w2Dm: [
      function(require, module, exports) {
        var t = require('engine.io-client'),
          e = require('./socket'),
          n = require('component-emitter'),
          o = require('socket.io-parser'),
          i = require('./on'),
          s = require('component-bind'),
          c = require('debug')('socket.io-client:manager'),
          r = require('indexof'),
          h = require('backo2'),
          a = Object.prototype.hasOwnProperty;
        function p(t, e) {
          if (!(this instanceof p)) return new p(t, e);
          t && 'object' == typeof t && ((e = t), (t = void 0)),
            ((e = e || {}).path = e.path || '/socket.io'),
            (this.nsps = {}),
            (this.subs = []),
            (this.opts = e),
            this.reconnection(!1 !== e.reconnection),
            this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
            this.reconnectionDelay(e.reconnectionDelay || 1e3),
            this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
            this.randomizationFactor(e.randomizationFactor || 0.5),
            (this.backoff = new h({
              min: this.reconnectionDelay(),
              max: this.reconnectionDelayMax(),
              jitter: this.randomizationFactor(),
            })),
            this.timeout(null == e.timeout ? 2e4 : e.timeout),
            (this.readyState = 'closed'),
            (this.uri = t),
            (this.connecting = []),
            (this.lastPing = null),
            (this.encoding = !1),
            (this.packetBuffer = []);
          var n = e.parser || o;
          (this.encoder = new n.Encoder()),
            (this.decoder = new n.Decoder()),
            (this.autoConnect = !1 !== e.autoConnect),
            this.autoConnect && this.open();
        }
        (module.exports = p),
          (p.prototype.emitAll = function() {
            for (var t in (this.emit.apply(this, arguments), this.nsps))
              a.call(this.nsps, t) &&
                this.nsps[t].emit.apply(this.nsps[t], arguments);
          }),
          (p.prototype.updateSocketIds = function() {
            for (var t in this.nsps)
              a.call(this.nsps, t) && (this.nsps[t].id = this.generateId(t));
          }),
          (p.prototype.generateId = function(t) {
            return ('/' === t ? '' : t + '#') + this.engine.id;
          }),
          n(p.prototype),
          (p.prototype.reconnection = function(t) {
            return arguments.length
              ? ((this._reconnection = !!t), this)
              : this._reconnection;
          }),
          (p.prototype.reconnectionAttempts = function(t) {
            return arguments.length
              ? ((this._reconnectionAttempts = t), this)
              : this._reconnectionAttempts;
          }),
          (p.prototype.reconnectionDelay = function(t) {
            return arguments.length
              ? ((this._reconnectionDelay = t),
                this.backoff && this.backoff.setMin(t),
                this)
              : this._reconnectionDelay;
          }),
          (p.prototype.randomizationFactor = function(t) {
            return arguments.length
              ? ((this._randomizationFactor = t),
                this.backoff && this.backoff.setJitter(t),
                this)
              : this._randomizationFactor;
          }),
          (p.prototype.reconnectionDelayMax = function(t) {
            return arguments.length
              ? ((this._reconnectionDelayMax = t),
                this.backoff && this.backoff.setMax(t),
                this)
              : this._reconnectionDelayMax;
          }),
          (p.prototype.timeout = function(t) {
            return arguments.length
              ? ((this._timeout = t), this)
              : this._timeout;
          }),
          (p.prototype.maybeReconnectOnOpen = function() {
            !this.reconnecting &&
              this._reconnection &&
              0 === this.backoff.attempts &&
              this.reconnect();
          }),
          (p.prototype.open = p.prototype.connect = function(e, n) {
            if (
              (c('readyState %s', this.readyState),
              ~this.readyState.indexOf('open'))
            )
              return this;
            c('opening %s', this.uri), (this.engine = t(this.uri, this.opts));
            var o = this.engine,
              s = this;
            (this.readyState = 'opening'), (this.skipReconnect = !1);
            var r = i(o, 'open', function() {
                s.onopen(), e && e();
              }),
              h = i(o, 'error', function(t) {
                if (
                  (c('connect_error'),
                  s.cleanup(),
                  (s.readyState = 'closed'),
                  s.emitAll('connect_error', t),
                  e)
                ) {
                  var n = new Error('Connection error');
                  (n.data = t), e(n);
                } else s.maybeReconnectOnOpen();
              });
            if (!1 !== this._timeout) {
              var a = this._timeout;
              c('connect attempt will timeout after %d', a);
              var p = setTimeout(function() {
                c('connect attempt timed out after %d', a),
                  r.destroy(),
                  o.close(),
                  o.emit('error', 'timeout'),
                  s.emitAll('connect_timeout', a);
              }, a);
              this.subs.push({
                destroy: function() {
                  clearTimeout(p);
                },
              });
            }
            return this.subs.push(r), this.subs.push(h), this;
          }),
          (p.prototype.onopen = function() {
            c('open'),
              this.cleanup(),
              (this.readyState = 'open'),
              this.emit('open');
            var t = this.engine;
            this.subs.push(i(t, 'data', s(this, 'ondata'))),
              this.subs.push(i(t, 'ping', s(this, 'onping'))),
              this.subs.push(i(t, 'pong', s(this, 'onpong'))),
              this.subs.push(i(t, 'error', s(this, 'onerror'))),
              this.subs.push(i(t, 'close', s(this, 'onclose'))),
              this.subs.push(i(this.decoder, 'decoded', s(this, 'ondecoded')));
          }),
          (p.prototype.onping = function() {
            (this.lastPing = new Date()), this.emitAll('ping');
          }),
          (p.prototype.onpong = function() {
            this.emitAll('pong', new Date() - this.lastPing);
          }),
          (p.prototype.ondata = function(t) {
            this.decoder.add(t);
          }),
          (p.prototype.ondecoded = function(t) {
            this.emit('packet', t);
          }),
          (p.prototype.onerror = function(t) {
            c('error', t), this.emitAll('error', t);
          }),
          (p.prototype.socket = function(t, n) {
            var o = this.nsps[t];
            if (!o) {
              (o = new e(this, t, n)), (this.nsps[t] = o);
              var i = this;
              o.on('connecting', s),
                o.on('connect', function() {
                  o.id = i.generateId(t);
                }),
                this.autoConnect && s();
            }
            function s() {
              ~r(i.connecting, o) || i.connecting.push(o);
            }
            return o;
          }),
          (p.prototype.destroy = function(t) {
            var e = r(this.connecting, t);
            ~e && this.connecting.splice(e, 1),
              this.connecting.length || this.close();
          }),
          (p.prototype.packet = function(t) {
            c('writing packet %j', t);
            var e = this;
            t.query && 0 === t.type && (t.nsp += '?' + t.query),
              e.encoding
                ? e.packetBuffer.push(t)
                : ((e.encoding = !0),
                  this.encoder.encode(t, function(n) {
                    for (var o = 0; o < n.length; o++)
                      e.engine.write(n[o], t.options);
                    (e.encoding = !1), e.processPacketQueue();
                  }));
          }),
          (p.prototype.processPacketQueue = function() {
            if (this.packetBuffer.length > 0 && !this.encoding) {
              var t = this.packetBuffer.shift();
              this.packet(t);
            }
          }),
          (p.prototype.cleanup = function() {
            c('cleanup');
            for (var t = this.subs.length, e = 0; e < t; e++) {
              this.subs.shift().destroy();
            }
            (this.packetBuffer = []),
              (this.encoding = !1),
              (this.lastPing = null),
              this.decoder.destroy();
          }),
          (p.prototype.close = p.prototype.disconnect = function() {
            c('disconnect'),
              (this.skipReconnect = !0),
              (this.reconnecting = !1),
              'opening' === this.readyState && this.cleanup(),
              this.backoff.reset(),
              (this.readyState = 'closed'),
              this.engine && this.engine.close();
          }),
          (p.prototype.onclose = function(t) {
            c('onclose'),
              this.cleanup(),
              this.backoff.reset(),
              (this.readyState = 'closed'),
              this.emit('close', t),
              this._reconnection && !this.skipReconnect && this.reconnect();
          }),
          (p.prototype.reconnect = function() {
            if (this.reconnecting || this.skipReconnect) return this;
            var t = this;
            if (this.backoff.attempts >= this._reconnectionAttempts)
              c('reconnect failed'),
                this.backoff.reset(),
                this.emitAll('reconnect_failed'),
                (this.reconnecting = !1);
            else {
              var e = this.backoff.duration();
              c('will wait %dms before reconnect attempt', e),
                (this.reconnecting = !0);
              var n = setTimeout(function() {
                t.skipReconnect ||
                  (c('attempting reconnect'),
                  t.emitAll('reconnect_attempt', t.backoff.attempts),
                  t.emitAll('reconnecting', t.backoff.attempts),
                  t.skipReconnect ||
                    t.open(function(e) {
                      e
                        ? (c('reconnect attempt error'),
                          (t.reconnecting = !1),
                          t.reconnect(),
                          t.emitAll('reconnect_error', e.data))
                        : (c('reconnect success'), t.onreconnect());
                    }));
              }, e);
              this.subs.push({
                destroy: function() {
                  clearTimeout(n);
                },
              });
            }
          }),
          (p.prototype.onreconnect = function() {
            var t = this.backoff.attempts;
            (this.reconnecting = !1),
              this.backoff.reset(),
              this.updateSocketIds(),
              this.emitAll('reconnect', t);
          });
      },
      {
        'engine.io-client': 'sh5F',
        './socket': '4nNQ',
        'component-emitter': 'z8J7',
        'socket.io-parser': 'D3t/',
        './on': 'Co6q',
        'component-bind': 'QoMD',
        debug: 'uha7',
        indexof: 'pSkj',
        backo2: 'sO3v',
      },
    ],
    '+Q6K': [
      function(require, module, exports) {
        var e = require('./url'),
          r = require('socket.io-parser'),
          o = require('./manager'),
          t = require('debug')('socket.io-client');
        module.exports = exports = n;
        var c = (exports.managers = {});
        function n(r, n) {
          'object' == typeof r && ((n = r), (r = void 0)), (n = n || {});
          var s,
            i = e(r),
            u = i.source,
            a = i.id,
            p = i.path,
            q = c[a] && p in c[a].nsps;
          return (
            n.forceNew || n['force new connection'] || !1 === n.multiplex || q
              ? (t('ignoring socket cache for %s', u), (s = o(u, n)))
              : (c[a] || (t('new io instance for %s', u), (c[a] = o(u, n))),
                (s = c[a])),
            i.query && !n.query && (n.query = i.query),
            s.socket(i.path, n)
          );
        }
        (exports.protocol = r.protocol),
          (exports.connect = n),
          (exports.Manager = require('./manager')),
          (exports.Socket = require('./socket'));
      },
      {
        './url': 'gG6R',
        'socket.io-parser': 'D3t/',
        './manager': 'w2Dm',
        debug: 'uha7',
        './socket': '4nNQ',
      },
    ],
    '0+rg': [
      function(require, module, exports) {
        var e =
          ('undefined' != typeof crypto &&
            crypto.getRandomValues &&
            crypto.getRandomValues.bind(crypto)) ||
          ('undefined' != typeof msCrypto &&
            'function' == typeof window.msCrypto.getRandomValues &&
            msCrypto.getRandomValues.bind(msCrypto));
        if (e) {
          var o = new Uint8Array(16);
          module.exports = function() {
            return e(o), o;
          };
        } else {
          var r = new Array(16);
          module.exports = function() {
            for (var e, o = 0; o < 16; o++)
              0 == (3 & o) && (e = 4294967296 * Math.random()),
                (r[o] = (e >>> ((3 & o) << 3)) & 255);
            return r;
          };
        }
      },
      {},
    ],
    gPRH: [
      function(require, module, exports) {
        for (var r = [], o = 0; o < 256; ++o)
          r[o] = (o + 256).toString(16).substr(1);
        function t(o, t) {
          var n = t || 0,
            u = r;
          return [
            u[o[n++]],
            u[o[n++]],
            u[o[n++]],
            u[o[n++]],
            '-',
            u[o[n++]],
            u[o[n++]],
            '-',
            u[o[n++]],
            u[o[n++]],
            '-',
            u[o[n++]],
            u[o[n++]],
            '-',
            u[o[n++]],
            u[o[n++]],
            u[o[n++]],
            u[o[n++]],
            u[o[n++]],
            u[o[n++]],
          ].join('');
        }
        module.exports = t;
      },
      {},
    ],
    qQkq: [
      function(require, module, exports) {
        var r = require('./lib/rng'),
          n = require('./lib/bytesToUuid');
        function e(e, i, u) {
          var a = (i && u) || 0;
          'string' == typeof e &&
            ((i = 'binary' === e ? new Array(16) : null), (e = null));
          var l = (e = e || {}).random || (e.rng || r)();
          if (((l[6] = (15 & l[6]) | 64), (l[8] = (63 & l[8]) | 128), i))
            for (var o = 0; o < 16; ++o) i[a + o] = l[o];
          return i || n(l);
        }
        module.exports = e;
      },
      { './lib/rng': '0+rg', './lib/bytesToUuid': 'gPRH' },
    ],
    Tz0q: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = t(require('socket.io-client')),
          s = t(require('uuid/v4'));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class i {
          constructor(e) {
            (this.userId = e), (this.callbacks = {});
          }
          joinRoom(e) {
            const { projectId: s, fileId: t, roomId: i } = e;
            (this.projectId = s),
              (this.fileId = t),
              (this.fullRoomId = `${s}${t}${i || ''}`),
              (this.phone = PHONE({
                media: { audio: !1, video: !1 },
                number: this.fullRoomId,
                publish_key: 'pub-c-c632ffe7-eecd-4ad0-8cc2-6ecc47c17625',
                subscribe_key: 'sub-c-78f93af8-cc85-11e8-bbf2-f202706b73e5',
              })),
              this.phone.ready(() => {
                this.phone.dial(this.fullRoomId),
                  this.sendUserJoined(this.userId);
              }),
              this.phone.message((e, s) => {
                const { type: t } = s,
                  i = this.callbacks[t];
                i && i.forEach(e => e(s));
              });
          }
          createRoom() {
            const e = (0, s.default)(),
              t = e.substring(0, e.indexOf('-'));
            return (
              this.joinRoom(this.projectId, this.fileId, t),
              window.history.pushState(
                null,
                null,
                `?project-id=${this.projectId}&file-id=${
                  this.fileId
                }&room-id=${t}`
              ),
              t
            );
          }
          pub(e) {
            this.phone.send(Object.assign(e, { userId: this.userId }));
          }
          sub(e, s) {
            const t = this.callbacks[e];
            this.callbacks[e] = t ? t.concat(s) : [s];
          }
          sendUserJoined(e) {
            this.pub({ type: i.actions.USER_JOINED, payload: { userId: e } });
          }
          sendTextMessage(e) {
            this.pub({ type: i.actions.TEXT_MESSAGE, payload: { text: e } });
          }
          sendCommand(e) {
            this.pub({ type: i.actions.COMMAND, payload: { command: e } });
          }
        }
        i.actions = {
          USER_JOINED: 'user-joined',
          USER_LEFT: 'user-left',
          TEXT_MESSAGE: 'text-message',
          COMMAND: 'command',
        };
        var o = i;
        exports.default = o;
      },
      { 'socket.io-client': '+Q6K', 'uuid/v4': 'qQkq' },
    ],
    GkkA: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          Object.defineProperty(exports, 'VisualiveSession', {
            enumerable: !0,
            get: function() {
              return e.default;
            },
          });
        var e = r(require('./src/VisualiveSession'));
        function r(e) {
          return e && e.__esModule ? e : { default: e };
        }
      },
      { './src/VisualiveSession': 'Tz0q' },
    ],
    YprN: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = require('@visualive/collab');
        const n = n => {
          n.innerHTML =
            '\n    <div class="ba b--light-blue br2 pa2 h5 overflow-y-auto mb2" id="receivedMessages"></div>\n\n    <form autocomplete="off" name="formSendMessage">\n      <div class="mb5 flex">\n        <input class="flex-grow-1 mr1" name="messageToSend" required type="text">\n        <button class="pure-button">\n          <i class="material-icons f4">send</i>\n        </button>\n      </div>\n    </form>\n\n    <form class="pure-form pure-form-aligned" name="formCreateRoom">\n      <legend>Create Room</legend>\n      <fieldset>\n        <div class="pure-control-group">\n          <label for="roomId">Room ID</label>\n          <input name="roomId" disabled type="text">\n          <button class="pure-button" type="button">\n            <i class="material-icons f4">file_copy</i>\n          </button>\n        </div>\n      </fieldset>\n      <div class="flex justify-center">\n        <button class="pure-button pure-button-primary">\n          Create Room\n        </button>\n      </div>\n    </form>\n\n    <form class="pure-form pure-form-aligned" name="formJoinRoom">\n      <legend>Join Room</legend>\n      <fieldset>\n        <div class="pure-control-group">\n          <label for="roomId">Room ID</label>\n          <input name="roomId" type="text">\n        </div>\n      </fieldset>\n      <div class="flex justify-center">\n        <button class="pure-button pure-button-primary">\n          Join Room\n        </button>\n      </div>\n    </form>\n\n    <div class="hidden" id="mediaWrapper"></div>\n  ';
          const o = new URLSearchParams(window.location.search),
            t = o.get('project-id'),
            r = o.get('file-id'),
            s = o.get('room-id'),
            a = o.get('token'),
            i = document.getElementById('receivedMessages'),
            d = (document.getElementById('mediaWrapper'),
            new e.VisualiveSession(a));
          return (
            d.joinRoom({ projectId: t, fileId: r, roomId: s }),
            document.formCreateRoom.addEventListener('submit', e => {
              const n = e.target,
                o = d.createRoom();
              (n.roomId.value = o), e.preventDefault();
            }),
            document.formSendMessage.addEventListener('submit', e => {
              const n = e.target;
              d.sendTextMessage(n.messageToSend.value),
                e.preventDefault(),
                n.reset();
            }),
            d.sub(e.VisualiveSession.actions.TEXT_MESSAGE, e => {
              const n = document.createElement('p');
              (n.innerHTML = `<strong>${e.userId}:</strong> ${e.payload.text}`),
                i.appendChild(n);
            }),
            d.sub(e.VisualiveSession.actions.USER_JOINED, e => {
              const n = document.createElement('p');
              (n.innerHTML = `<strong>(User Joined: ${e.userId})</strong>`),
                i.appendChild(n);
            }),
            d
          );
        };
        var o = n;
        exports.default = o;
      },
      { '@visualive/collab': 'GkkA' },
    ],
    sxsB: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        class e {
          constructor() {
            (this.treeItemFactories = []),
              (this.widgetFactories = []),
              (this.inspectorFactories = []);
          }
          registerInpector(e, t) {
            this.inspectorFactories.push({ inspector: e, rule: t });
          }
          constructInspector(...e) {
            const t = e[0];
            for (let r = this.inspectorFactories.length; r-- > 0; ) {
              const o = this.inspectorFactories[r];
              if (o.rule(t)) return new o.inspector(...e);
            }
            console.warn(
              `Inspector factory not found for parameter '${t.getName()}' of class '${
                t.constructor.name
              }'`
            );
          }
          registerTreeItemElement(e, t) {
            this.treeItemFactories.push({ treeItemElement: e, rule: t });
          }
          constructTreeItemElement(...e) {
            const t = e[0];
            for (let r = this.treeItemFactories.length; r-- > 0; ) {
              const o = this.treeItemFactories[r];
              if (o.rule(t)) return new o.treeItemElement(...e);
            }
            console.warn(
              `Tree item factory not found for parameter '${t.getName()}' of class '${
                t.constructor.name
              }'`
            );
          }
          registerWidget(e, t) {
            this.widgetFactories.push({ widget: e, rule: t });
          }
          constructWidget(...e) {
            const t = e[0];
            for (let r = this.widgetFactories.length; r-- > 0; ) {
              const o = this.widgetFactories[r];
              if (o.rule(t)) return new o.widget(...e);
            }
            console.warn(
              `Widget factory not found for parameter '${t.getName()}' of class '${
                t.constructor.name
              }'`
            );
          }
        }
        const t = new e();
        var r = t;
        exports.default = r;
      },
      {},
    ],
    tcHS: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = t(require('./Change.js'));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class a extends e.default {
          constructor(e) {
            super(e.getName() + ' Changed'),
              (this.__param = e),
              this.__newValue,
              (this.__oldValue = e.getValue());
          }
          setValue(e) {
            this.__param.setValue(e), (this.__newValue = e);
          }
          undo() {
            this.__param.setValue(this.__oldValue);
          }
          redo() {
            this.__param.setValue(this.__newValue);
          }
        }
        var s = a;
        exports.default = s;
      },
      { './Change.js': 'F60O' },
    ],
    'y+Mj': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = s(require('./VisualiveUxFactory.js')),
          t = s(require('../undoredo/ParameterValueChange.js'));
        function s(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class i {
          constructor(e, s, i, l = !1) {
            (this.treeItem = e),
              (this.parentDomElement = s),
              (this.appData = i),
              (this.li = document.createElement('li')),
              (this.li.className = 'TreeNodesListItem'),
              (this.expandBtn = document.createElement('button')),
              (this.expandBtn.className = 'TreeNodesListItem__ToggleExpanded'),
              this.li.appendChild(this.expandBtn),
              (this.toggleVisibilityBtn = document.createElement('button')),
              (this.toggleVisibilityBtn.className =
                'TreeNodesListItem__ToggleVisibility'),
              this.li.appendChild(this.toggleVisibilityBtn),
              (this.toggleVisibilityBtn.innerHTML =
                '<i class="material-icons md-15">visibility</i>');
            const n = this.treeItem.getParameter('Visible');
            this.toggleVisibilityBtn.addEventListener('click', () => {
              const e = new t.default(n);
              e.setValue(!n.getValue()),
                this.appData.undoRedoManager.addChange(e);
            });
            const a = () => {
              n.getValue()
                ? this.li.classList.remove('TreeNodesListItem--isHidden')
                : this.li.classList.add('TreeNodesListItem--isHidden');
            };
            n.valueChanged.connect(a),
              a(),
              (this.titleElement = document.createElement('span')),
              (this.titleElement.className = 'TreeNodesListItem__Title'),
              (this.titleElement.textContent = e.getName()),
              this.li.appendChild(this.titleElement);
            const d = this.treeItem.getParameter('Selected');
            this.titleElement.addEventListener('click', e => {
              i.selectionManager.toggleItemSelection(this.treeItem, !e.ctrlKey);
            });
            const r = () => {
              d.getValue()
                ? this.li.classList.add('TreeNodesListItem--isSelected')
                : this.li.classList.remove('TreeNodesListItem--isSelected');
            };
            if (
              (d.valueChanged.connect(r),
              r(),
              this.parentDomElement.appendChild(this.li),
              (this.ul = document.createElement('ul')),
              (this.ul.className = 'TreeNodesList'),
              this.li.appendChild(this.ul),
              (this.childElements = []),
              (this._expanded = !1),
              l)
            )
              this.expand();
            else {
              this.treeItem.getChildren().length > 0 && this.collapse();
            }
            this.expandBtn.addEventListener('click', () => {
              this.treeItem.numChildren() > 0 &&
                (this._expanded ? this.collapse() : this.expand());
            }),
              this.treeItem.childAdded.connect((e, t) => {
                this.addChild(e);
              }),
              this.treeItem.childRemoved.connect((e, t) => {});
          }
          addComponent(e) {
            this.subul ||
              ((this.subul = document.createElement('ul')),
              this.titleElement.appendChild(this.subul));
            const t = document.createElement('li');
            t.className = 'TreeNodesListItem';
            const s = document.createElement('span');
            (s.className = 'TreeNodesListItem__Title'),
              (s.textContent = e),
              t.appendChild(s),
              this.subul.appendChild(t);
          }
          addChild(t, s = !1) {
            if (this._expanded) {
              const i = e.default.constructTreeItemElement(
                t,
                this.ul,
                this.appData,
                s
              );
              this.childElements.push(i);
            } else this.collapse();
          }
          expand() {
            if (
              ((this._expanded = !0),
              this.ul.classList.remove('TreeNodesList--collapsed'),
              (this.expandBtn.innerHTML =
                '<i class="material-icons md-24">arrow_drop_down</i>'),
              !this.childrenAlreadyCreated)
            ) {
              const e = this.treeItem.getChildren();
              for (let t of e) this.addChild(t);
              this.childrenAlreadyCreated = !0;
            }
          }
          collapse() {
            this.ul.classList.add('TreeNodesList--collapsed'),
              (this.expandBtn.innerHTML =
                '<i class="material-icons md-24">arrow_right</i>'),
              (this._expanded = !1);
          }
        }
        e.default.registerTreeItemElement(
          i,
          e => e instanceof Visualive.TreeItem
        );
        class l extends i {
          constructor(e, t, s, i = !1) {
            super(e, t, s, i);
          }
        }
        e.default.registerTreeItemElement(
          l,
          e => e instanceof Visualive.GeomItem
        );
        class n {
          constructor(e, t, s) {
            (this.parentDomElement = e),
              (this.appData = s),
              (this.ul = document.createElement('ul')),
              (this.ul.className = 'TreeNodesList TreeNodesList--root'),
              this.parentDomElement.appendChild(this.ul),
              (this.rootElement = new i(t, this.ul, s, !0));
          }
          getDomElement() {
            return this.container;
          }
        }
        var a = n;
        exports.default = a;
      },
      {
        './VisualiveUxFactory.js': 'sxsB',
        '../undoredo/ParameterValueChange.js': 'tcHS',
      },
    ],
    '8pt0': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = t(require('../ui/VisualiveUxFactory.js'));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class a {
          constructor(e, t, a) {
            (this.domElement = t),
              this.clean(),
              (this.undoRedoManager = a),
              (this.container = document.createElement('div')),
              (this.container.className = 'container'),
              this.domElement.appendChild(this.container),
              (this.ul = document.createElement('ul')),
              (this.ul.className = 'flex-outer'),
              this.container.appendChild(this.ul),
              e && this.setParameterOwner(e);
          }
          clean() {
            for (; this.domElement.firstChild; )
              this.domElement.removeChild(this.domElement.firstChild);
          }
          destroy() {
            this.clean();
          }
          getDomElement() {
            return this.container;
          }
          setParameterOwner(e) {
            if (((this.parameterOwner = e), (this.widgets = []), e))
              for (let t of e.getParameters()) this.addParameterWidget(t);
          }
          addParameterWidget(t) {
            const a = t.getName(),
              r = document.createElement('li');
            this.ul.appendChild(r);
            const i = document.createElement('label');
            i.setAttribute('for', a),
              i.appendChild(document.createTextNode(a)),
              r.appendChild(i);
            const n = e.default.constructWidget(t, r, this.undoRedoManager);
            n
              ? this.widgets.push(n)
              : console.warn(`Unable to display parameter '${a}'`);
          }
        }
        var r = a;
        exports.default = r;
      },
      { '../ui/VisualiveUxFactory.js': 'sxsB' },
    ],
    '0eNb': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        class e {
          constructor(e) {
            (this.labelElem = document.createElement('label')),
              this.labelElem.setAttribute('for', e.getName()),
              this.labelElem.appendChild(document.createTextNode(e.getName()));
          }
          setParentDomElem(e) {
            (this.parentDomElem = e), e.appendChild(this.labelElem);
          }
        }
        var t = e;
        exports.default = t;
      },
      {},
    ],
    gzQl: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = u(require('./BaseWidget.js')),
          t = u(require('../../undoredo/ParameterValueChange.js')),
          a = u(require('../VisualiveUxFactory.js'));
        function u(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class r extends e.default {
          constructor(e, a, u) {
            super(e);
            const r = document.createElement('input');
            let d;
            (r.className = 'mdl-textfield__input'),
              r.setAttribute('id', e.getName()),
              r.setAttribute('type', 'text'),
              r.setAttribute('value', e.getValue()),
              r.setAttribute('tabindex', 0),
              a.appendChild(r),
              e.valueChanged.connect(() => {
                d || (r.value = e.getValue());
              }),
              r.addEventListener('input', () => {
                d || ((d = new t.default(e)), u.addChange(d)),
                  d.setValue(r.valueAsNumber);
              }),
              r.addEventListener('change', () => {
                d || ((d = new t.default(e)), u.addChange(d)),
                  d.setValue(r.valueAsNumber),
                  (d = void 0);
              });
          }
        }
        (exports.default = r),
          a.default.registerWidget(
            r,
            e => 'StringParameter' == e.constructor.name
          );
      },
      {
        './BaseWidget.js': '0eNb',
        '../../undoredo/ParameterValueChange.js': 'tcHS',
        '../VisualiveUxFactory.js': 'sxsB',
      },
    ],
    '/cZL': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = a(require('./ParameterContainer.js')),
          t = a(require('./VisualiveUxFactory.js')),
          r = a(require('./parameter-widgets/StringWidget.js'));
        function a(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class n {
          constructor(e) {
            (this._treeItem = e), (this.valueChanged = e.nameChanged);
          }
          getName() {
            return 'Name';
          }
          getValue() {
            return this._treeItem.getName();
          }
          setValue(e) {
            return this._treeItem.setName(e);
          }
        }
        class s {
          constructor(t, a, s) {
            const i = document.createElement('ul');
            i.className = 'list pa0';
            const u = document.createElement('li'),
              l = document.createElement('li');
            a.appendChild(i),
              i.appendChild(u),
              i.appendChild(l),
              (this.nameWidget = new r.default(new n(t), u, s)),
              (this.parameterContainer = new e.default(t, l, s));
          }
          destroy() {
            this.parameterContainer.destroy();
          }
        }
        (exports.default = s),
          t.default.registerInpector(s, e => e instanceof Visualive.TreeItem);
      },
      {
        './ParameterContainer.js': '8pt0',
        './VisualiveUxFactory.js': 'sxsB',
        './parameter-widgets/StringWidget.js': 'gzQl',
      },
    ],
    '9eHz': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = t(require('./VisualiveUxFactory.js'));
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class s {
          constructor(e, t) {
            (this.domElement = e),
              (this.domElement.innerHTML = ''),
              (this.undoRedoManager = t);
          }
          inspect(t) {
            this.inspector &&
              (this.inspector.destroy(), (this.domElement.innerHTML = '')),
              t &&
                (this.inspector = e.default.constructInspector(
                  t,
                  this.domElement,
                  this.undoRedoManager
                ));
          }
        }
        var o = s;
        exports.default = o;
      },
      { './VisualiveUxFactory.js': 'sxsB' },
    ],
    RcTJ: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.CurrentUserChip = exports.UserChip = void 0);
        var e = require('../PlatformAPI.js');
        class s {
          constructor(e) {
            (this.domElement = e),
              this.clean(),
              (this.userDiv = document.createElement('div')),
              (this.userDiv.className = 'user-chip'),
              this.domElement.appendChild(this.userDiv),
              (this.userNameSpan = document.createElement('span')),
              (this.userNameSpan.className = 'user-name'),
              this.userDiv.appendChild(this.userNameSpan),
              (this.userImageDiv = document.createElement('div')),
              (this.userImage = document.createElement('img')),
              (this.userImage.className = 'user-image br-100 ba b--black-10'),
              (this.userImage.alt = 'Avatar'),
              (this.userImage.src = 'https://placeimg.com/150/150/tech'),
              this.userImageDiv.appendChild(this.userImage),
              this.userDiv.appendChild(this.userImageDiv);
          }
          clean() {
            for (; this.domElement.firstChild; )
              this.domElement.removeChild(this.domElement.firstChild);
          }
          unmount() {
            this.clean();
          }
        }
        exports.UserChip = s;
        class t extends s {
          constructor(s) {
            super(s),
              (0, e.getCurrentUser)()
                .then(e => {
                  this.userNameSpan.innerHTML = e.name;
                })
                .catch(() => {
                  console.error('Error getting current user.');
                });
          }
        }
        exports.CurrentUserChip = t;
      },
      { '../PlatformAPI.js': '0oFO' },
    ],
    '5fi+': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = r(require('./BaseWidget.js')),
          t = r(require('../VisualiveUxFactory.js')),
          a = r(require('../../undoredo/ParameterValueChange.js'));
        function r(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class u extends e.default {
          constructor(e, t, r) {
            super(e), console.log('BooleanWidget', e.getName(), e.getValue());
            const u = document.createElement('input');
            u.setAttribute('id', e.getName()),
              u.setAttribute('type', 'checkbox'),
              u.setAttribute('tabindex', 0),
              (u.checked = e.getValue()),
              t.appendChild(u);
            let d = !1;
            e.valueChanged.connect(() => {
              d || (u.checked = e.getValue());
            }),
              u.addEventListener('input', () => {
                d = !0;
                const t = new a.default(e);
                t.setValue(u.checked), r.addChange(t), (d = !1);
              });
          }
        }
        (exports.default = u),
          t.default.registerWidget(
            u,
            e => 'BooleanParameter' == e.constructor.name
          );
      },
      {
        './BaseWidget.js': '0eNb',
        '../VisualiveUxFactory.js': 'sxsB',
        '../../undoredo/ParameterValueChange.js': 'tcHS',
      },
    ],
    'jj+L': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var t = 'iro__marker',
          e = function(e, r) {
            var s = e.g({ class: t });
            s.circle(0, 0, r.r, {
              class: t + '__outer',
              fill: 'none',
              strokeWidth: 5,
              stroke: '#000',
            }),
              s.circle(0, 0, r.r, {
                class: t + '__inner',
                fill: 'none',
                strokeWidth: 2,
                stroke: '#fff',
              }),
              (this.g = s);
          };
        e.prototype.move = function(t, e) {
          this.g.setTransform('translate', [t, e]);
        };
        var r = 'iro__wheel',
          s = Math.PI,
          i = Math.sqrt,
          n = Math.abs,
          o = Math.round,
          a = function(t, s) {
            (this._opts = s), (this.type = 'wheel');
            var i = s.cY,
              n = s.cX,
              o = s.r,
              a = s.border,
              h = t.g({ class: r });
            h.circle(n, i, o + a.w / 2, {
              class: r + '__border',
              fill: '#fff',
              stroke: a.color,
              strokeWidth: a.w,
            });
            for (
              var c = h.g({ class: r + '__hue', strokeWidth: o, fill: 'none' }),
                l = 0;
              l < 360;
              l++
            )
              c.arc(n, i, o / 2, l, l + 1.5, {
                stroke: 'hsl(' + (s.anticlockwise ? 360 - l : l) + ',100%,50%)',
              });
            h
              .circle(n, i, o, { class: r + '__saturation' })
              .setGradient(
                'fill',
                t.gradient('radial', {
                  0: { color: '#fff' },
                  100: { color: '#fff', opacity: 0 },
                })
              ),
              (this._lightness = h.circle(n, i, o, {
                class: r + '__lightness',
                opacity: 0,
              })),
              (this.marker = new e(h, s.marker));
          };
        (a.prototype.update = function(t, e) {
          var r = this._opts,
            i = t.hsv;
          if (
            (e.v &&
              r.lightness &&
              this._lightness.setAttrs({ opacity: (1 - i.v / 100).toFixed(2) }),
            e.h || e.s)
          ) {
            var n = (r.anticlockwise ? 360 - i.h : i.h) * (s / 180),
              o = (i.s / 100) * r.rMax;
            this.marker.move(r.cX + o * Math.cos(n), r.cY + o * Math.sin(n));
          }
        }),
          (a.prototype.input = function(t, e) {
            var r = this._opts,
              n = r.rMax,
              a = r.cX - t,
              h = r.cY - e,
              c = Math.atan2(h, a),
              l = o(c * (180 / s)) + 180,
              u = Math.min(i(a * a + h * h), n);
            return {
              h: (l = r.anticlockwise ? 360 - l : l),
              s: o((100 / n) * u),
            };
          }),
          (a.prototype.checkHit = function(t, e) {
            var r = this._opts,
              s = n(t - r.cX),
              o = n(e - r.cY);
            return i(s * s + o * o) < r.r;
          });
        var h = Math.round,
          c = Math.floor;
        function l(t, e) {
          var r = t.match(
              /(\S+)\((\d+)(%?)(?:\D+?)(\d+)(%?)(?:\D+?)(\d+)(%?)(?:\D+?)?([0-9\.]+?)?\)/i
            ),
            s = parseInt(r[2]),
            i = parseInt(r[4]),
            n = parseInt(r[6]);
          return [
            r[1],
            '%' == r[3] ? (s / 100) * e[0] : s,
            '%' == r[5] ? (i / 100) * e[1] : i,
            '%' == r[7] ? (n / 100) * e[2] : n,
            parseFloat(r[8]) || void 0,
          ];
        }
        function u(t) {
          return t instanceof v ? t : new v(t);
        }
        function f(t, e, r) {
          return t <= e ? e : t >= r ? r : t;
        }
        function p(t, e) {
          var r = {};
          for (var s in t) r[s] = e[s] != t[s];
          return r;
        }
        var v = function(t) {
            (this._onChange = !1),
              (this._value = { h: void 0, s: void 0, v: void 0 }),
              t && this.set(t);
          },
          g = {
            hsv: { configurable: !0 },
            rgb: { configurable: !0 },
            hsl: { configurable: !0 },
            rgbString: { configurable: !0 },
            hexString: { configurable: !0 },
            hslString: { configurable: !0 },
          };
        (v.mix = function(t, e, r) {
          var s = u(t).rgb,
            i = u(e).rgb;
          return (
            (r = f(r / 100 || 0.5, 0, 1)),
            new v({
              r: c(s.r + (i.r - s.r) * r),
              g: c(s.g + (i.g - s.g) * r),
              b: c(s.b + (i.b - s.b) * r),
            })
          );
        }),
          (v.lighten = function(t, e) {
            var r = u(t),
              s = r.hsv;
            return (s.v = f(s.v + e, 0, 100)), (r.hsv = s), r;
          }),
          (v.darken = function(t, e) {
            var r = u(t),
              s = r.hsv;
            return (s.v = f(s.v - e, 0, 100)), (r.hsv = s), r;
          }),
          (v.hsv2Rgb = function(t) {
            var e,
              r,
              s,
              i,
              n,
              o,
              a,
              l,
              u = t.h / 360,
              f = t.s / 100,
              p = t.v / 100;
            switch (
              ((o = p * (1 - f)),
              (a = p * (1 - (n = 6 * u - (i = c(6 * u))) * f)),
              (l = p * (1 - (1 - n) * f)),
              i % 6)
            ) {
              case 0:
                (e = p), (r = l), (s = o);
                break;
              case 1:
                (e = a), (r = p), (s = o);
                break;
              case 2:
                (e = o), (r = p), (s = l);
                break;
              case 3:
                (e = o), (r = a), (s = p);
                break;
              case 4:
                (e = l), (r = o), (s = p);
                break;
              case 5:
                (e = p), (r = o), (s = a);
            }
            return { r: h(255 * e), g: h(255 * r), b: h(255 * s) };
          }),
          (v.rgb2Hsv = function(t) {
            var e,
              r = t.r / 255,
              s = t.g / 255,
              i = t.b / 255,
              n = Math.max(r, s, i),
              o = Math.min(r, s, i),
              a = n - o;
            switch (n) {
              case o:
                e = 0;
                break;
              case r:
                e = (s - i) / a + (s < i ? 6 : 0);
                break;
              case s:
                e = (i - r) / a + 2;
                break;
              case i:
                e = (r - s) / a + 4;
            }
            return {
              h: 360 * (e /= 6),
              s: 0 == n ? 0 : (a / n) * 100,
              v: 100 * n,
            };
          }),
          (v.hsv2Hsl = function(t) {
            var e = t.s / 100,
              r = t.v / 100,
              s = 0.5 * r * (2 - e);
            return (
              (e = (r * e) / (1 - Math.abs(2 * s - 1))),
              { h: t.h, s: 100 * e || 0, l: 100 * s }
            );
          }),
          (v.hsl2Hsv = function(t) {
            var e = t.s / 100,
              r = t.l / 100;
            return (
              (e *= (r *= 2) <= 1 ? r : 2 - r),
              { h: t.h, s: ((2 * e) / (r + e)) * 100, v: ((r + e) / 2) * 100 }
            );
          }),
          (v.hsl2Str = function(t) {
            return (
              'hsl' +
              (t.a ? 'a' : '') +
              '(' +
              t.h +
              ', ' +
              t.s +
              '%, ' +
              t.l +
              '%' +
              (t.a ? ', ' + t.a : '') +
              ')'
            );
          }),
          (v.rgb2Str = function(t) {
            return (
              'rgb' +
              (t.a ? 'a' : '') +
              '(' +
              t.r +
              ', ' +
              t.g +
              ', ' +
              t.b +
              (t.a ? ', ' + t.a : '') +
              ')'
            );
          }),
          (v.rgb2Hex = function(t) {
            var e = '#';
            return (
              (e += t.r.toString(16).padStart(2, '0')),
              (e += t.g.toString(16).padStart(2, '0')),
              (e += t.b.toString(16).padStart(2, '0'))
            );
          }),
          (v.parseHexStr = function(t) {
            t = t.replace('#', '');
            var e = parseInt('0x' + t),
              r = 3 == t.length,
              s = r ? 15 : 255,
              i = r ? 4 : 8,
              n = r ? 17 : 1;
            return {
              r: ((e >> (2 * i)) & s) * n,
              g: ((e >> i) & s) * n,
              b: (e & s) * n,
            };
          }),
          (v.parseHslStr = function(t) {
            var e = l(t, [360, 100, 100]);
            return { h: e[2], s: e[3], l: e[4] };
          }),
          (v.parseRgbStr = function(t) {
            var e = l(t, [255, 255, 255]);
            return { r: e[1], g: e[2], b: e[3] };
          }),
          (g.hsv.get = function() {
            var t = this._value;
            return { h: t.h, s: t.s, v: t.v };
          }),
          (g.hsv.set = function(t) {
            if (this._onChange) {
              var e = this._value;
              for (var r in e) t.hasOwnProperty(r) || (t[r] = e[r]);
              var s = p(e, t);
              (this._value = t), (s.h || s.s || s.v) && this._onChange(this, s);
            } else this._value = t;
          }),
          (g.rgb.get = function() {
            var t = v.hsv2Rgb(this._value);
            return { r: h(t.r), g: h(t.g), b: h(t.b) };
          }),
          (g.rgb.set = function(t) {
            this.hsv = v.rgb2Hsv(t);
          }),
          (g.hsl.get = function() {
            var t = v.hsv2Hsl(this._value);
            return { h: h(t.h), s: h(t.s), l: h(t.l) };
          }),
          (g.hsl.set = function(t) {
            this.hsv = v.hsl2Hsv(t);
          }),
          (g.rgbString.get = function() {
            return v.rgb2Str(this.rgb);
          }),
          (g.rgbString.set = function(t) {
            this.rgb = v.parseRgbStr(t);
          }),
          (g.hexString.get = function() {
            return v.rgb2Hex(this.rgb);
          }),
          (g.hexString.set = function(t) {
            this.rgb = v.parseHexStr(t);
          }),
          (g.hslString.get = function() {
            return v.hsl2Str(this.hsl);
          }),
          (g.hslString.set = function(t) {
            this.hsl = v.parseHslStr(t);
          }),
          (v.prototype.set = function(t) {
            'object' == typeof t
              ? t instanceof v
                ? (this.hsv = v.hsv)
                : 'r' in t
                ? (this.rgb = t)
                : 'v' in t
                ? (this.hsv = t)
                : 'l' in t && (this.hsl = t)
              : 'string' == typeof t &&
                (/^rgb/.test(t)
                  ? (this.rgbString = t)
                  : /^hsl/.test(t)
                  ? (this.hslString = t)
                  : /^#[0-9A-Fa-f]/.test(t) && (this.hexString = t));
          }),
          (v.prototype.setChannel = function(t, e, r) {
            var s = this[t];
            (s[e] = r), (this[t] = s);
          }),
          (v.prototype.clone = function() {
            return new v(this);
          }),
          (v.prototype.compare = function(t, e) {
            return p(this[(e = e || 'hsv')], u(t)[e]);
          }),
          (v.prototype.mix = function(t, e) {
            this.hsv = mix(this, t, e).hsv;
          }),
          (v.prototype.lighten = function(t) {
            lighten(this, t);
          }),
          (v.prototype.darken = function(t) {
            darken(this, t);
          }),
          Object.defineProperties(v.prototype, g);
        var d = 'iro__slider',
          y = function(t, r) {
            var s = r.r,
              i = r.w,
              n = r.h,
              o = r.x,
              a = r.y,
              h = r.border.w;
            (r.range = { min: o + s, max: o + i - s, w: i - 2 * s }),
              (r.sliderType = r.sliderType || 'v'),
              (this.type = 'slider'),
              (this._opts = r);
            var c = s + h / 2,
              l = t.g({ class: d }),
              u = l.insert('rect', {
                class: d + '__value',
                rx: c,
                ry: c,
                x: o - h / 2,
                y: a - h / 2,
                width: i + h,
                height: n + h,
                strokeWidth: h,
                stroke: r.border.color,
              });
            u.setGradient(
              'fill',
              t.gradient('linear', {
                0: { color: '#000' },
                100: { color: '#fff' },
              })
            ),
              (this._gradient = u.gradient),
              (this.marker = new e(l, r.marker));
          };
        (y.prototype.update = function(t, e) {
          var r = this._opts,
            s = r.range,
            i = t.hsv,
            n = v.hsv2Hsl({ h: i.h, s: i.s, v: 100 });
          if (
            'v' == r.sliderType &&
            ((e.h || e.s) &&
              this._gradient.stops[1].setAttrs({
                stopColor: 'hsl(' + n.h + ',' + n.s + '%,' + n.l + '%)',
              }),
            e.v)
          ) {
            var o = i.v / 100;
            this.marker.move(s.min + o * s.w, r.y + r.h / 2);
          }
        }),
          (y.prototype.input = function(t, e) {
            var r = this._opts.range,
              s = Math.max(Math.min(t, r.max), r.min) - r.min;
            return { v: Math.round((100 / r.w) * s) };
          }),
          (y.prototype.checkHit = function(t, e) {
            var r = this._opts;
            return t > r.x && t < r.x + r.w && e > r.y && e < r.y + r.h;
          });
        var _ = 0,
          b = 'Gradient',
          m = 'http://www.w3.org/2000/svg',
          w = {
            class: 'class',
            stroke: 'stroke',
            strokeWidth: 'stroke-width',
            fill: 'fill',
            opacity: 'opacity',
            offset: 'offset',
            stopColor: 'stop-color',
            stopOpacity: 'stop-opacity',
          },
          k = {
            translate: 'setTranslate',
            scale: 'setScale',
            rotate: 'setRotate',
          },
          S = window.navigator.userAgent.toLowerCase(),
          x = /msie|trident|edge/.test(S),
          M = /^((?!chrome|android).)*safari/i.test(S),
          C = function(t, e, r, s) {
            var i = document.createElementNS(m, r);
            (this.el = i),
              this.setAttrs(s),
              (e.el || e).appendChild(i),
              (this._root = t),
              (this._svgTransforms = {}),
              (this._transformList = !!i.transform && i.transform.baseVal);
          };
        (C.prototype.insert = function(t, e) {
          return new C(this._root, this, t, e);
        }),
          (C.prototype.g = function(t) {
            return this.insert('g', t);
          }),
          (C.prototype.arc = function(t, e, r, s, i, n) {
            var o = i - s <= 180 ? 0 : 1;
            (s *= Math.PI / 180), (i *= Math.PI / 180);
            var a = t + r * Math.cos(i),
              h = e + r * Math.sin(i),
              c = t + r * Math.cos(s),
              l = e + r * Math.sin(s);
            return (
              ((n = n || {}).d = ['M', a, h, 'A', r, r, 0, o, 0, c, l].join(
                ' '
              )),
              this.insert('path', n)
            );
          }),
          (C.prototype.circle = function(t, e, r, s) {
            return (
              ((s = s || {}).cx = t),
              (s.cy = e),
              (s.r = r),
              this.insert('circle', s)
            );
          }),
          (C.prototype.setTransform = function(t, e) {
            if (x) this.setAttrs({ transform: t + '(' + e.join(', ') + ')' });
            else {
              var r,
                s = this._svgTransforms;
              s[t]
                ? (r = s[t])
                : ((r = this._root.el.createSVGTransform()),
                  (s[t] = r),
                  this._transformList.appendItem(r)),
                r[t in k ? k[t] : t].apply(r, e);
            }
          }),
          (C.prototype.setAttrs = function(t) {
            for (var e in t) {
              var r = e in w ? w[e] : e;
              this.el.setAttribute(r, t[e]);
            }
          }),
          (C.prototype.setGradient = function(t, e) {
            var r = {};
            (r[t] = e.getUrl()),
              (e._refs[t] = this),
              (this.gradient = e),
              this.setAttrs(r);
          });
        var T = function(t, e, r) {
          var s = [],
            i = t._defs.insert(e + b, { id: 'iro' + b + _++ });
          for (var n in r) {
            var o = r[n];
            s.push(
              i.insert('stop', {
                offset: n + '%',
                stopColor: o.color,
                stopOpacity: void 0 === o.opacity ? 1 : o.opacity,
              })
            );
          }
          (this.el = i.el), (this.stops = s), (this._refs = {});
        };
        T.prototype.getUrl = function(t) {
          return (
            'url(' +
            (M ? t || window.location.href : '') +
            '#' +
            this.el.id +
            ')'
          );
        };
        var H = (function(t) {
            function e(e, r, s, i) {
              t.call(this, null, e, 'svg', {
                width: r,
                height: s,
                style: 'display:' + (i || 'block') + ';touch-action:none',
              }),
                (this._root = this),
                (this._defs = this.insert('defs')),
                (this._gradients = []);
            }
            return (
              t && (e.__proto__ = t),
              (e.prototype = Object.create(t && t.prototype)),
              (e.prototype.constructor = e),
              (e.prototype.gradient = function(t, e) {
                var r = new T(this, t, e);
                return this._gradients.push(r), r;
              }),
              (e.prototype.updateUrls = function(t) {
                if (M)
                  for (var e = this._gradients, r = 0; r < e.length; r++)
                    for (var s in e[r]._refs) {
                      var i = {};
                      (i[s] = e[r].getUrl(t)), e[r]._refs[s].setAttrs(i);
                    }
              }),
              e
            );
          })(C),
          A = function() {
            var t = document.createElement('style');
            document.head.appendChild(t),
              t.appendChild(document.createTextNode('')),
              (this.style = t);
            var e = t.sheet;
            (this.sheet = e),
              (this.rules = e.rules || e.cssRules),
              (this.map = {});
          },
          R = {
            enabled: { configurable: !0 },
            cssText: { configurable: !0 },
            css: { configurable: !0 },
          };
        (R.enabled.get = function() {
          return !this.sheet.disabled;
        }),
          (R.enabled.set = function(t) {
            this.sheet.disabled = !t;
          }),
          (R.cssText.get = function() {
            var t = this.map,
              e = [];
            for (var r in t)
              e.push(
                r.replace(/,\W/g, ',\n') +
                  ' {\n\t' +
                  t[r].cssText.replace(/;\W/g, ';\n\t') +
                  '\n}'
              );
            return e.join('\n');
          }),
          (R.css.get = function() {
            var t = this.map,
              e = {};
            for (var r in t) {
              var s = t[r];
              e[r] = {};
              for (var i = 0; i < s.length; i++) {
                var n = s[i];
                e[r][n] = s.getPropertyValue(n);
              }
            }
            return e;
          }),
          (A.prototype.setRule = function(t, e, r) {
            var s = this.sheet,
              i = s.rules || s.cssRules,
              n = this.map;
            if (
              ((e = e.replace(/([A-Z])/g, function(t) {
                return '-' + t.toLowerCase();
              })),
              n.hasOwnProperty(t))
            )
              n[t].setProperty(e, r);
            else {
              var o = i.length,
                a = e + ': ' + r;
              try {
                s.insertRule(t + ' {' + a + ';}', o);
              } catch (h) {
                s.addRule(t, a, o);
              } finally {
                (i = s.rules || s.cssRules), (n[t] = i[o].style);
              }
            }
          }),
          Object.defineProperties(A.prototype, R);
        var P = 'mousedown',
          I = 'mousemove',
          O = 'mouseup',
          W = 'touchstart',
          j = 'touchmove',
          L = 'touchend',
          X = 'readystatechange',
          Y = 'complete';
        function E(t, e, r, s) {
          void 0 === s && (s = {});
          for (var i = 0; i < e.length; i++) t.addEventListener(e[i], r, s);
        }
        function G(t, e, r) {
          for (var s = 0; s < e.length; s++) t.removeEventListener(e[s], r);
        }
        function U(t) {
          document.readyState == Y
            ? t()
            : E(document, [X], function e(r) {
                document.readyState == Y && (t(), G(document, [X], e));
              });
        }
        var D = function(t, e) {
          var r = this;
          (e = e || {}),
            (this._events = {}),
            (this._mouseTarget = !1),
            (this._colorChangeActive = !1),
            (this.css = e.css || e.styles || void 0),
            U(function() {
              r._mount(t, e);
            });
        };
        (D.prototype._mount = function(t, e) {
          var r = this;
          t = 'string' == typeof t ? document.querySelector(t) : t;
          var s = e.width || parseInt(t.width) || 320,
            i = e.height || parseInt(t.height) || 320,
            n = e.padding + 2 || 6,
            o = e.borderWidth || 0,
            h = e.markerRadius || 8,
            c = e.sliderMargin || 24,
            l = e.sliderHeight || 2 * h + 2 * n + 2 * o,
            u = Math.min(i - l - c, s),
            f = u / 2 - o,
            p = (s - u) / 2,
            g = { r: h },
            d = { w: o, color: e.borderColor || '#fff' };
          (this.el = t),
            (this.svg = new H(t, s, i, e.display)),
            (this.ui = [
              new a(this.svg, {
                cX: p + u / 2,
                cY: u / 2,
                r: f,
                rMax: f - (h + n),
                marker: g,
                border: d,
                lightness: null == e.wheelLightness || e.wheelLightness,
                anticlockwise: e.anticlockwise,
              }),
              new y(this.svg, {
                sliderType: 'v',
                x: p + o,
                y: u + c,
                w: u - 2 * o,
                h: l - 2 * o,
                r: l / 2 - o,
                marker: g,
                border: d,
              }),
            ]),
            (this.stylesheet = new A()),
            (this.color = new v()),
            (this.color._onChange = this._update.bind(this)),
            this.color.set(e.color || e.defaultValue || '#fff'),
            this.on('history:stateChange', function(t) {
              r.svg.updateUrls(t);
            }),
            E(this.svg.el, [P, W], this, { passive: !1 }),
            this.emit('mount', this);
        }),
          (D.prototype._update = function(t, e) {
            for (
              var r = t.rgbString, s = this.css, i = 0;
              i < this.ui.length;
              i++
            )
              this.ui[i].update(t, e);
            for (var n in s) {
              var o = s[n];
              for (var a in o) this.stylesheet.setRule(n, a, r);
            }
            this._colorChangeActive ||
              ((this._colorChangeActive = !0),
              this.emit('color:change', t, e),
              (this._colorChangeActive = !1));
          }),
          (D.prototype.on = function(t, e) {
            var r = this._events;
            (r[t] || (r[t] = [])).push(e);
          }),
          (D.prototype.off = function(t, e) {
            var r = this._events[t];
            r && r.splice(r.indexOf(e), 1);
          }),
          (D.prototype.emit = function(t) {
            for (var e = [], r = arguments.length - 1; r-- > 0; )
              e[r] = arguments[r + 1];
            for (
              var s = this._events,
                i = (s[t] || []).concat(s['*'] || []),
                n = 0;
              n < i.length;
              n++
            )
              i[n].apply(null, e);
          }),
          (D.prototype.handleEvent = function(t) {
            var e = t.touches ? t.changedTouches[0] : t,
              r = this.svg.el.getBoundingClientRect(),
              s = e.clientX - r.left,
              i = e.clientY - r.top;
            switch (t.type) {
              case P:
              case W:
                for (var n = 0; n < this.ui.length; n++) {
                  var o = this.ui[n];
                  o.checkHit(s, i) &&
                    ((this._mouseTarget = o),
                    E(document, [I, j, O, L], this, { passive: !1 }),
                    this.emit('input:start', this.color),
                    (this.color.hsv = this._mouseTarget.input(s, i)));
                }
                break;
              case I:
              case j:
                this.color.hsv = this._mouseTarget.input(s, i);
                break;
              case O:
              case L:
                (this._mouseTarget = !1),
                  this.emit('input:end', this.color),
                  G(document, [I, j, O, L], this);
            }
            this._mouseTarget && t.preventDefault();
          });
        var V = { Color: v, ColorPicker: D, Stylesheet: A, version: '3.5.1' },
          F = V;
        exports.default = F;
      },
      {},
    ],
    '7rDG': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = a(require('../../../node_modules/@jaames/iro/dist/iro.es.js')),
          r = a(require('./BaseWidget.js')),
          o = a(require('../VisualiveUxFactory.js')),
          t = a(require('../../undoredo/ParameterValueChange.js'));
        function a(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class d extends r.default {
          constructor(r, o, a) {
            console.log('ColorWidget'), super(r);
            const d = new e.default.ColorPicker(o, {
              width: 200,
              height: 200,
              color: { r: 255, g: 0, b: 0 },
              anticlockwise: !0,
              borderWidth: 1,
              borderColor: '#fff',
            });
            let l = void 0;
            r.valueChanged.connect(() => {
              if (!l) {
                const e = r.getValue();
                d.color.rgb = { r: 255 * e.r, g: 255 * e.g, b: 255 * e.b };
              }
            }),
              d.on('input:start', () => {
                (l = new t.default(r)), a.addChange(l);
              }),
              d.on('input:end', () => {
                l = void 0;
              }),
              d.on('color:change', (e, o) => {
                l || ((l = new t.default(r)), a.addChange(l));
                const n = d.color.rgb;
                l.setValue(
                  new Visualive.Color(n.r / 255, n.g / 255, n.b / 255)
                );
              });
          }
          setParentDomElem(e) {}
        }
        (exports.default = d),
          o.default.registerWidget(
            d,
            e => 'ColorParameter' == e.constructor.name
          );
      },
      {
        '../../../node_modules/@jaames/iro/dist/iro.es.js': 'jj+L',
        './BaseWidget.js': '0eNb',
        '../VisualiveUxFactory.js': 'sxsB',
        '../../undoredo/ParameterValueChange.js': 'tcHS',
      },
    ],
    'qjd/': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = u(require('./BaseWidget.js')),
          t = u(require('../VisualiveUxFactory.js')),
          a = u(require('../../undoredo/ParameterValueChange.js'));
        function u(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class r extends e.default {
          constructor(e, t, u) {
            super(e);
            const r = e.getRange();
            let s = document.createElement('input');
            if (r) {
              (s.className = 'mdl-slider mdl-js-slider'),
                s.setAttribute('id', e.getName()),
                s.setAttribute('type', 'range'),
                s.setAttribute('min', r[0]),
                s.setAttribute('max', r[1]),
                s.setAttribute('value', e.getValue());
              const t = e.getStep();
              t && s.setAttribute('step', t), s.setAttribute('tabindex', 0);
            } else
              (s.className = 'mdl-textfield__input'),
                s.setAttribute('id', e.getName()),
                s.setAttribute('type', 'number'),
                s.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
                s.setAttribute('value', e.getValue()),
                s.setAttribute('tabindex', 0);
            t.appendChild(s);
            let i = void 0;
            e.valueChanged.connect(() => {
              i || (s.value = e.getValue());
            }),
              s.addEventListener('input', () => {
                i || ((i = new a.default(e)), u.addChange(i)),
                  i.setValue(s.valueAsNumber);
              }),
              s.addEventListener('change', () => {
                i || ((i = new a.default(e)), u.addChange(i)),
                  i.setValue(s.valueAsNumber),
                  (i = void 0);
              });
          }
        }
        (exports.default = r),
          t.default.registerWidget(
            r,
            e => e instanceof Visualive.NumberParameter
          );
      },
      {
        './BaseWidget.js': '0eNb',
        '../VisualiveUxFactory.js': 'sxsB',
        '../../undoredo/ParameterValueChange.js': 'tcHS',
      },
    ],
    pjhJ: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = n(require('./BaseWidget.js')),
          t = n(require('../VisualiveUxFactory.js')),
          a = n(require('../../undoredo/ParameterValueChange.js'));
        function n(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class u extends e.default {
          constructor(e, t, n) {
            super(e);
            const u = document.createElement('div');
            u.className = 'container';
            const r = document.createElement('ul');
            (r.className = 'flex-editvalues'), u.appendChild(r);
            const d = document.createElement('input');
            d.setAttribute('id', e.getName()),
              d.setAttribute('type', 'number'),
              d.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              d.setAttribute('value', e.getValue().x),
              d.setAttribute('tabindex', 0),
              (d.style.width = '100%');
            const i = document.createElement('li');
            i.appendChild(d), r.appendChild(i);
            const s = document.createElement('input');
            s.setAttribute('id', e.getName()),
              s.setAttribute('type', 'number'),
              s.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              s.setAttribute('value', e.getValue().y),
              s.setAttribute('tabindex', 0),
              (s.style.width = '100%');
            const l = document.createElement('li');
            l.appendChild(s), r.appendChild(l), t.appendChild(u);
            let c = void 0;
            e.valueChanged.connect(() => {
              if (!c) {
                const t = e.getValue();
                (d.value = t.x), (s.value = t.y);
              }
            });
            const o = () => {
                c || ((c = new a.default(e)), n.addChange(c)),
                  c.setValue(
                    new Visualive.Vec2(d.valueAsNumber, s.valueAsNumber)
                  );
              },
              p = () => {
                o(), (c = void 0);
              };
            d.addEventListener('input', o),
              s.addEventListener('input', o),
              d.addEventListener('change', p),
              s.addEventListener('change', p);
          }
        }
        (exports.default = u),
          t.default.registerWidget(
            u,
            e => 'Vec2Parameter' == e.constructor.name
          );
      },
      {
        './BaseWidget.js': '0eNb',
        '../VisualiveUxFactory.js': 'sxsB',
        '../../undoredo/ParameterValueChange.js': 'tcHS',
      },
    ],
    Xtbt: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = a(require('./BaseWidget.js')),
          t = a(require('../VisualiveUxFactory.js')),
          n = a(require('../../undoredo/ParameterValueChange.js'));
        function a(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class u extends e.default {
          constructor(e, t, a) {
            super(e);
            const u = document.createElement('div');
            u.className = 'container';
            const d = document.createElement('ul');
            (d.className = 'flex-editvalues'), u.appendChild(d);
            const i = document.createElement('input');
            i.setAttribute('id', e.getName()),
              i.setAttribute('type', 'number'),
              i.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              i.setAttribute('value', e.getValue().x),
              i.setAttribute('tabindex', 0),
              (i.style.width = '100%');
            const r = document.createElement('li');
            r.appendChild(i), d.appendChild(r);
            const s = document.createElement('input');
            s.setAttribute('id', e.getName()),
              s.setAttribute('type', 'number'),
              s.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              s.setAttribute('value', e.getValue().y),
              s.setAttribute('tabindex', 0),
              (s.style.width = '100%');
            const l = document.createElement('li');
            l.appendChild(s), d.appendChild(l);
            const c = document.createElement('input');
            c.setAttribute('id', e.getName()),
              c.setAttribute('type', 'number'),
              c.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              c.setAttribute('value', e.getValue().z),
              c.setAttribute('tabindex', 0),
              (c.style.width = '100%');
            const o = document.createElement('li');
            o.appendChild(c), d.appendChild(o), t.appendChild(u);
            let p = void 0;
            e.valueChanged.connect(() => {
              if (!p) {
                const t = e.getValue();
                (i.value = t.x), (s.value = t.y), (c.value = t.z);
              }
            });
            const m = () => {
                p || ((p = new n.default(e)), a.addChange(p)),
                  p.setValue(
                    new Visualive.Vec3(
                      i.valueAsNumber,
                      s.valueAsNumber,
                      c.valueAsNumber
                    )
                  );
              },
              b = () => {
                m(), (p = void 0);
              };
            i.addEventListener('input', m),
              s.addEventListener('input', m),
              c.addEventListener('input', m),
              i.addEventListener('change', b),
              s.addEventListener('change', b),
              c.addEventListener('change', b);
          }
        }
        (exports.default = u),
          t.default.registerWidget(
            u,
            e => 'Vec3Parameter' == e.constructor.name
          );
      },
      {
        './BaseWidget.js': '0eNb',
        '../VisualiveUxFactory.js': 'sxsB',
        '../../undoredo/ParameterValueChange.js': 'tcHS',
      },
    ],
    Q9jr: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          (exports.default = void 0);
        var e = a(require('./BaseWidget.js')),
          t = a(require('../VisualiveUxFactory.js')),
          n = a(require('../../undoredo/ParameterValueChange.js'));
        function a(e) {
          return e && e.__esModule ? e : { default: e };
        }
        class u extends e.default {
          constructor(e, t, a) {
            super(e);
            const u = document.createElement('div');
            u.className = 'container';
            const i = document.createElement('ul');
            (i.className = 'flex-editvalues'), u.appendChild(i);
            const d = document.createElement('input');
            d.setAttribute('id', e.getName()),
              d.setAttribute('type', 'number'),
              d.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              d.setAttribute('value', e.getValue().x),
              d.setAttribute('tabindex', 0),
              (d.style.width = '100%');
            const r = document.createElement('li');
            r.appendChild(d), i.appendChild(r);
            const s = document.createElement('input');
            s.setAttribute('id', e.getName()),
              s.setAttribute('type', 'number'),
              s.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              s.setAttribute('value', e.getValue().y),
              s.setAttribute('tabindex', 0),
              (s.style.width = '100%');
            const l = document.createElement('li');
            l.appendChild(s), i.appendChild(l);
            const c = document.createElement('input');
            c.setAttribute('id', e.getName()),
              c.setAttribute('type', 'number'),
              c.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              c.setAttribute('value', e.getValue().z),
              c.setAttribute('tabindex', 0),
              (c.style.width = '100%');
            const o = document.createElement('li');
            o.appendChild(c), i.appendChild(o);
            const p = document.createElement('input');
            p.setAttribute('id', e.getName()),
              p.setAttribute('type', 'number'),
              p.setAttribute('pattern', '-?[0-9]*(.[0-9]+)?'),
              p.setAttribute('value', e.getValue().t),
              p.setAttribute('tabindex', 0),
              (p.style.width = '100%');
            const m = document.createElement('li');
            m.appendChild(p), i.appendChild(m), t.appendChild(u);
            let b = void 0;
            e.valueChanged.connect(() => {
              if (!b) {
                const t = e.getValue();
                (d.value = t.x),
                  (s.value = t.y),
                  (c.value = t.z),
                  (p.value = t.t);
              }
            });
            const v = () => {
                b || ((b = new n.default(e)), a.addChange(b)),
                  b.setValue(
                    new Visualive.Vec4(
                      d.valueAsNumber,
                      s.valueAsNumber,
                      c.valueAsNumber,
                      p.valueAsNumber
                    )
                  );
              },
              A = () => {
                v(), (b = void 0);
              };
            d.addEventListener('input', v),
              s.addEventListener('input', v),
              c.addEventListener('input', v),
              p.addEventListener('input', v),
              d.addEventListener('change', A),
              s.addEventListener('change', A),
              c.addEventListener('change', A),
              p.addEventListener('change', A);
          }
        }
        (exports.default = u),
          t.default.registerWidget(
            u,
            e => 'Vec4Parameter' == e.constructor.name
          );
      },
      {
        './BaseWidget.js': '0eNb',
        '../VisualiveUxFactory.js': 'sxsB',
        '../../undoredo/ParameterValueChange.js': 'tcHS',
      },
    ],
    DhM2: [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          Object.defineProperty(exports, 'getRequest', {
            enumerable: !0,
            get: function() {
              return e.getRequest;
            },
          }),
          Object.defineProperty(exports, 'getCurrentUser', {
            enumerable: !0,
            get: function() {
              return e.getCurrentUser;
            },
          }),
          Object.defineProperty(exports, 'getProjectData', {
            enumerable: !0,
            get: function() {
              return e.getProjectData;
            },
          }),
          Object.defineProperty(exports, 'getProjectResourcesRecursive', {
            enumerable: !0,
            get: function() {
              return e.getProjectResourcesRecursive;
            },
          }),
          Object.defineProperty(exports, 'getParameterFromUrl', {
            enumerable: !0,
            get: function() {
              return e.getParameterFromUrl;
            },
          }),
          Object.defineProperty(exports, 'UndoRedoManager', {
            enumerable: !0,
            get: function() {
              return r.default;
            },
          }),
          Object.defineProperty(exports, 'ActionRegistry', {
            enumerable: !0,
            get: function() {
              return t.default;
            },
          }),
          Object.defineProperty(exports, 'SelectionManager', {
            enumerable: !0,
            get: function() {
              return n.default;
            },
          }),
          Object.defineProperty(exports, 'LoaderRegistry', {
            enumerable: !0,
            get: function() {
              return u.default;
            },
          }),
          Object.defineProperty(exports, 'TopMenuBar', {
            enumerable: !0,
            get: function() {
              return i.default;
            },
          }),
          Object.defineProperty(exports, 'setupPanels', {
            enumerable: !0,
            get: function() {
              return o.default;
            },
          }),
          Object.defineProperty(exports, 'setupCollab', {
            enumerable: !0,
            get: function() {
              return s.default;
            },
          }),
          Object.defineProperty(exports, 'SceneTreeView', {
            enumerable: !0,
            get: function() {
              return c.default;
            },
          }),
          Object.defineProperty(exports, 'TreeItemInspector', {
            enumerable: !0,
            get: function() {
              return a.default;
            },
          }),
          Object.defineProperty(exports, 'ParameterContainer', {
            enumerable: !0,
            get: function() {
              return d.default;
            },
          }),
          Object.defineProperty(exports, 'InspectorContainer', {
            enumerable: !0,
            get: function() {
              return p.default;
            },
          }),
          Object.defineProperty(exports, 'UserChip', {
            enumerable: !0,
            get: function() {
              return f.UserChip;
            },
          }),
          Object.defineProperty(exports, 'CurrentUserChip', {
            enumerable: !0,
            get: function() {
              return f.CurrentUserChip;
            },
          }),
          Object.defineProperty(exports, 'BooleanWidget', {
            enumerable: !0,
            get: function() {
              return g.default;
            },
          }),
          Object.defineProperty(exports, 'ColorWidget', {
            enumerable: !0,
            get: function() {
              return l.default;
            },
          }),
          Object.defineProperty(exports, 'NumberWidget', {
            enumerable: !0,
            get: function() {
              return b.default;
            },
          }),
          Object.defineProperty(exports, 'StringWidget', {
            enumerable: !0,
            get: function() {
              return j.default;
            },
          }),
          Object.defineProperty(exports, 'Vec2Widget', {
            enumerable: !0,
            get: function() {
              return m.default;
            },
          }),
          Object.defineProperty(exports, 'Vec3Widget', {
            enumerable: !0,
            get: function() {
              return P.default;
            },
          }),
          Object.defineProperty(exports, 'Vec4Widget', {
            enumerable: !0,
            get: function() {
              return y.default;
            },
          });
        var e = require('./src/PlatformAPI.js'),
          r = x(require('./src/undoredo/UndoRedoManager.js')),
          t = x(require('./src/ActionRegistry.js')),
          n = x(require('./src/SelectionManager.js')),
          u = x(require('./src/LoaderRegistry.js')),
          i = x(require('./src/ui/TopMenuBar.js')),
          o = x(require('./src/ui/side-panels.js')),
          s = x(require('./src/ui/setupCollab.js')),
          c = x(require('./src/ui/scene-tree-view.js')),
          a = x(require('./src/ui/TreeItemInspector.js')),
          d = x(require('./src/ui/ParameterContainer.js')),
          p = x(require('./src/ui/InspectorContainer.js')),
          f = require('./src/ui/UserChip.js'),
          g = x(require('./src/ui/parameter-widgets/BooleanWidget.js')),
          l = x(require('./src/ui/parameter-widgets/ColorWidget.js')),
          b = x(require('./src/ui/parameter-widgets/NumberWidget.js')),
          j = x(require('./src/ui/parameter-widgets/StringWidget.js')),
          m = x(require('./src/ui/parameter-widgets/Vec2Widget.js')),
          P = x(require('./src/ui/parameter-widgets/Vec3Widget.js')),
          y = x(require('./src/ui/parameter-widgets/Vec4Widget.js'));
        function x(e) {
          return e && e.__esModule ? e : { default: e };
        }
      },
      {
        './src/PlatformAPI.js': '0oFO',
        './src/undoredo/UndoRedoManager.js': 'JrmM',
        './src/ActionRegistry.js': 'u1MQ',
        './src/SelectionManager.js': 'qENZ',
        './src/LoaderRegistry.js': 'SHxf',
        './src/ui/TopMenuBar.js': '7YxH',
        './src/ui/side-panels.js': 'lGqk',
        './src/ui/setupCollab.js': 'YprN',
        './src/ui/scene-tree-view.js': 'y+Mj',
        './src/ui/TreeItemInspector.js': '/cZL',
        './src/ui/ParameterContainer.js': '8pt0',
        './src/ui/InspectorContainer.js': '9eHz',
        './src/ui/UserChip.js': 'RcTJ',
        './src/ui/parameter-widgets/BooleanWidget.js': '5fi+',
        './src/ui/parameter-widgets/ColorWidget.js': '7rDG',
        './src/ui/parameter-widgets/NumberWidget.js': 'qjd/',
        './src/ui/parameter-widgets/StringWidget.js': 'gzQl',
        './src/ui/parameter-widgets/Vec2Widget.js': 'pjhJ',
        './src/ui/parameter-widgets/Vec3Widget.js': 'Xtbt',
        './src/ui/parameter-widgets/Vec4Widget.js': 'Q9jr',
      },
    ],
    BcAW: [
      function(require, module, exports) {
        'use strict';
        var e = require('@visualive/ux'),
          l = document.getElementById('collabWrapper');
        (0, e.setupCollab)(l);
      },
      { '@visualive/ux': 'DhM2' },
    ],
  },
  {},
  ['BcAW'],
  null
);
//# sourceMappingURL=/collab.5d88ac7f.map
