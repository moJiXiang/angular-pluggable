(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('semver'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs', 'semver', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.angularPluggable = {}, global.rxjs, global.semver, global.ng.core));
}(this, (function (exports, rxjs, semver, i0) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    var EventCallbackRegsitry = /** @class */ (function () {
        function EventCallbackRegsitry() {
            this._registry = new Map();
        }
        EventCallbackRegsitry.prototype.addEventListener = function (name, callback) {
            var callbacks = this._registry.get(name);
            if (callbacks) {
                callbacks.push(callback);
            }
            else {
                this._registry.set(name, [callback]);
            }
        };
        EventCallbackRegsitry.prototype.removeEventListener = function (name, callback) {
            var callbacks = this._registry.get(name);
            if (callbacks) {
                var index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
        EventCallbackRegsitry.prototype.dispatchEvent = function (event) {
            var callbacks = this._registry.get(event.name);
            for (var i in callbacks) {
                callbacks[i](event);
            }
        };
        return EventCallbackRegsitry;
    }());

    var PluginStore = /** @class */ (function () {
        function PluginStore() {
            this.observerMap = new Map();
            this.functionArray = new Map();
            this.pluginMap = new Map();
            this._eventCallbackRegsitry = new EventCallbackRegsitry();
        }
        Object.defineProperty(PluginStore.prototype, "context", {
            get: function () {
                return this._context;
            },
            enumerable: false,
            configurable: true
        });
        PluginStore.prototype.dependencyValid = function (installedVersion, requiredVersion) {
            var versionDiff = semver.diff(installedVersion, requiredVersion);
            return ((versionDiff === null ||
                versionDiff === "patch" ||
                versionDiff === "minor") &&
                semver.gte(installedVersion, requiredVersion));
        };
        PluginStore.prototype.useContext = function (context) {
            this._context = context;
        };
        PluginStore.prototype.getContext = function () {
            return this._context;
        };
        PluginStore.prototype.install = function (plugin) {
            var _this = this;
            var pluginNameAndVer = plugin.getPluginName();
            var _a = pluginNameAndVer.split("@"), pluginName = _a[0]; _a[1];
            var pluginDependencies = plugin.getDependencies() || [];
            // check dependencies is installed
            var installErrors = [];
            pluginDependencies.forEach(function (dep) {
                var _a = dep.split("@"), depName = _a[0], depVersion = _a[1];
                var plugin = _this.pluginMap.get(depName);
                if (!plugin) {
                    installErrors.push("Plugin " + pluginName + ": " + depName + " has not installed!");
                }
                else {
                    var _b = plugin.getPluginName().split("@"), installedVersion = _b[1];
                    if (!_this.dependencyValid(installedVersion, depVersion)) {
                        installErrors.push("Plugin " + pluginName + " need " + depName + "@" + depVersion + ", but " + installedVersion + " installed!");
                    }
                }
            });
            if (installErrors.length === 0) {
                this.pluginMap.set(pluginName, plugin);
                plugin.init(this);
                plugin.activate();
            }
            else {
                installErrors.forEach(function (err) { return console.error(err); });
            }
        };
        PluginStore.prototype.uninstall = function (pluginName) {
            var plugin = this.pluginMap.get(pluginName);
            if (plugin) {
                plugin.deactivate();
                this.pluginMap.delete(pluginName);
            }
        };
        PluginStore.prototype.addFunction = function (key, fn) {
            this.functionArray.set(key, fn);
        };
        PluginStore.prototype.execFunction = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var fn = this.functionArray.get(key);
            if (fn) {
                return fn.apply(void 0, args);
            }
        };
        PluginStore.prototype.removeFunction = function (key) {
            this.functionArray.delete(key);
        };
        PluginStore.prototype.addEventListener = function (name, callback) {
            this._eventCallbackRegsitry.addEventListener(name, callback);
        };
        PluginStore.prototype.removeEventListener = function (name, callback) {
            this._eventCallbackRegsitry.removeEventListener(name, callback);
        };
        PluginStore.prototype.dispatchEvent = function (event) {
            this._eventCallbackRegsitry.dispatchEvent(event);
        };
        PluginStore.prototype.registObserver = function (name, data) {
            this.observerMap.set(name, new rxjs.BehaviorSubject(data || null));
        };
        PluginStore.prototype.getObserver = function (name) {
            return this.observerMap.get(name);
        };
        return PluginStore;
    }());

    var pluginStore;
    var PluginStoreInstance = /** @class */ (function () {
        function PluginStoreInstance() {
        }
        PluginStoreInstance.get = function () {
            return pluginStore;
        };
        PluginStoreInstance.set = function (context) {
            pluginStore = new PluginStore();
            if (context) {
                pluginStore.useContext(context);
            }
        };
        return PluginStoreInstance;
    }());

    function createPluginStore(context) {
        PluginStoreInstance.set(context);
        return PluginStoreInstance.get();
    }

    function usePluginStore() {
        return PluginStoreInstance.get();
    }

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var Event = /** @class */ (function () {
        function Event(name, data) {
            this.name = name;
            if (data) {
                this.data = data;
            }
        }
        return Event;
    }());
    var RenderderEvent = /** @class */ (function (_super) {
        __extends(RenderderEvent, _super);
        function RenderderEvent(name, placement) {
            var _this = _super.call(this, name) || this;
            _this.placement = placement;
            return _this;
        }
        return RenderderEvent;
    }(Event));

    exports.FunctionNames = void 0;
    (function (FunctionNames) {
        FunctionNames["RENDERER_ADD"] = "Renderer.add";
        FunctionNames["RENDERER_ONCE"] = "Renderer.once";
        FunctionNames["RENDERER_REGIST_DIALOG_COMPONENT"] = "Renderer.registDialogComponent";
        FunctionNames["RENDERER_GET_DIALOG_COMPONENT"] = "Renderer.getDialogComponent";
        FunctionNames["RENDERER_REMOVE"] = "Renderer.remove";
        FunctionNames["RENDERER_GET_COMPONENTS_IN_PLACEMENT"] = "Renderer.getComponentsInPlacement";
        FunctionNames["RENDERER_COMPONENT_UPDATED"] = "Renderer.componentUpdated";
        FunctionNames["REGIST_OBSERVER"] = "Regist.observer";
    })(exports.FunctionNames || (exports.FunctionNames = {}));

    var RendererPlugin = /** @class */ (function () {
        function RendererPlugin() {
            this.pluginStore = new PluginStore();
            this.dialogComponentMap = new Map();
            this.componentsMap = new Map();
        }
        RendererPlugin.prototype.getPluginName = function () {
            return "Renderer@1.0.0";
        };
        RendererPlugin.prototype.getDependencies = function () {
            return [];
        };
        RendererPlugin.prototype.init = function (pluginStore) {
            this.pluginStore = pluginStore;
        };
        RendererPlugin.prototype.addTocomponentsMap = function (placement, component) {
            var components = this.componentsMap.get(placement);
            if (!components) {
                components = [component];
            }
            else {
                components.push(component);
            }
            this.componentsMap.set(placement, components);
            this.pluginStore.dispatchEvent(new RenderderEvent(exports.FunctionNames.RENDERER_COMPONENT_UPDATED, placement));
        };
        RendererPlugin.prototype.removeFromcomponentsMap = function (placement, module) {
            var array = this.componentsMap.get(placement);
            if (array) {
                array.splice(array.findIndex(function (item) { return item === module; }), 1);
            }
            this.pluginStore.dispatchEvent(new RenderderEvent(exports.FunctionNames.RENDERER_COMPONENT_UPDATED, placement));
        };
        RendererPlugin.prototype.addToRenderOnceComponent = function (placement, component) {
            this.componentsMap.set(placement, [component]);
            this.pluginStore.dispatchEvent(new RenderderEvent(exports.FunctionNames.RENDERER_COMPONENT_UPDATED, placement));
        };
        RendererPlugin.prototype.getComponentsInPlacement = function (placement) {
            var componentArray = this.componentsMap.get(placement);
            if (!componentArray)
                return [];
            return componentArray;
        };
        RendererPlugin.prototype.addToDialogComponentMap = function (componentName, component) {
            this.dialogComponentMap.set(componentName, component);
        };
        RendererPlugin.prototype.getDialogComponent = function (componentName) {
            return this.dialogComponentMap.get(componentName);
        };
        RendererPlugin.prototype.activate = function () {
            this.pluginStore.addFunction(exports.FunctionNames.RENDERER_ADD, this.addTocomponentsMap.bind(this));
            this.pluginStore.addFunction(exports.FunctionNames.RENDERER_ONCE, this.addToRenderOnceComponent.bind(this));
            this.pluginStore.addFunction(exports.FunctionNames.RENDERER_REGIST_DIALOG_COMPONENT, this.addToDialogComponentMap.bind(this));
            this.pluginStore.addFunction(exports.FunctionNames.RENDERER_GET_DIALOG_COMPONENT, this.getDialogComponent.bind(this));
            this.pluginStore.addFunction(exports.FunctionNames.RENDERER_REMOVE, this.removeFromcomponentsMap.bind(this));
            this.pluginStore.addFunction(exports.FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT, this.getComponentsInPlacement.bind(this));
        };
        RendererPlugin.prototype.deactivate = function () {
            this.pluginStore.removeFunction(exports.FunctionNames.RENDERER_ADD);
            this.pluginStore.removeFunction(exports.FunctionNames.RENDERER_ONCE);
            this.pluginStore.removeFunction(exports.FunctionNames.RENDERER_REGIST_DIALOG_COMPONENT);
            this.pluginStore.removeFunction(exports.FunctionNames.RENDERER_GET_DIALOG_COMPONENT);
            this.pluginStore.removeFunction(exports.FunctionNames.RENDERER_REMOVE);
            this.pluginStore.removeFunction(exports.FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT);
        };
        return RendererPlugin;
    }());

    var _c0 = ["componentAnchor"];
    var RendererComponent = /** @class */ (function () {
        function RendererComponent(resolver) {
            this.resolver = resolver;
            this.pluginStore = usePluginStore();
        }
        RendererComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.pluginStore.addEventListener(exports.FunctionNames.RENDERER_COMPONENT_UPDATED, function (event) {
                if (event.placement === _this.placement) {
                    // https://segmentfault.com/a/1190000013972657
                    // ExpressionChangedAfterItHasBeenCheckedError error
                    Promise.resolve(null).then(function () {
                        _this.renderComponent(event.placement);
                    });
                }
            });
        };
        RendererComponent.prototype.renderComponent = function (placement) {
            var _this = this;
            this.componentAnchor.clear();
            var components = this.pluginStore.execFunction(exports.FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT, placement);
            if (components && components.length > 0) {
                components.forEach(function (component) {
                    console.log(">> Renderer Plugin " + component.name + " in " + placement);
                    var componentFactory = _this.resolver.resolveComponentFactory(component);
                    _this.componentAnchor.createComponent(componentFactory);
                });
            }
        };
        RendererComponent.ɵfac = function RendererComponent_Factory(t) { return new (t || RendererComponent)(i0__namespace.ɵɵdirectiveInject(i0__namespace.ComponentFactoryResolver)); };
        RendererComponent.ɵcmp = i0__namespace.ɵɵdefineComponent({ type: RendererComponent, selectors: [["Renderer"]], viewQuery: function RendererComponent_Query(rf, ctx) { if (rf & 1) {
                i0__namespace.ɵɵviewQuery(_c0, 1, i0.ViewContainerRef);
            } if (rf & 2) {
                var _t = void 0;
                i0__namespace.ɵɵqueryRefresh(_t = i0__namespace.ɵɵloadQuery()) && (ctx.componentAnchor = _t.first);
            } }, inputs: { placement: "placement" }, decls: 2, vars: 0, consts: [["componentAnchor", ""]], template: function RendererComponent_Template(rf, ctx) { if (rf & 1) {
                i0__namespace.ɵɵelementContainer(0, null, 0);
            } }, encapsulation: 2 });
        return RendererComponent;
    }());
    (function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(RendererComponent, [{
            type: i0.Component,
            args: [{
                    selector: "Renderer",
                    template: "<ng-container #componentAnchor></ng-container>",
                }]
        }], function () { return [{ type: i0__namespace.ComponentFactoryResolver }]; }, { placement: [{
                type: i0.Input
            }], componentAnchor: [{
                type: i0.ViewChild,
                args: ["componentAnchor", { read: i0.ViewContainerRef }]
            }] }); })();
    var RendererDirector = /** @class */ (function () {
        function RendererDirector(ref, resolver) {
            this.ref = ref;
            this.resolver = resolver;
            this.pluginStore = usePluginStore();
        }
        RendererDirector.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.pluginStore.addEventListener(exports.FunctionNames.RENDERER_COMPONENT_UPDATED, function (event) {
                if (event.placement === _this.placement) {
                    Promise.resolve(null).then(function () {
                        _this.renderComponent(event.placement);
                    });
                }
            });
        };
        RendererDirector.prototype.renderComponent = function (placement) {
            var _this = this;
            this.ref.clear();
            var components = this.pluginStore.execFunction(exports.FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT, placement);
            if (components && components.length > 0) {
                components.forEach(function (component) {
                    console.log(">> Renderer Plugin " + component.name + " in " + placement);
                    var componentFactory = _this.resolver.resolveComponentFactory(component);
                    _this.ref.createComponent(componentFactory);
                });
            }
        };
        RendererDirector.ɵfac = function RendererDirector_Factory(t) { return new (t || RendererDirector)(i0__namespace.ɵɵdirectiveInject(i0__namespace.ViewContainerRef), i0__namespace.ɵɵdirectiveInject(i0__namespace.ComponentFactoryResolver)); };
        RendererDirector.ɵdir = i0__namespace.ɵɵdefineDirective({ type: RendererDirector, selectors: [["", "renderer", ""]], inputs: { placement: "placement" } });
        return RendererDirector;
    }());
    (function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(RendererDirector, [{
            type: i0.Directive,
            args: [{
                    selector: "[renderer]",
                }]
        }], function () { return [{ type: i0__namespace.ViewContainerRef }, { type: i0__namespace.ComponentFactoryResolver }]; }, { placement: [{
                type: i0.Input
            }] }); })();
    var RendererModule = /** @class */ (function () {
        function RendererModule() {
        }
        RendererModule.ɵmod = i0__namespace.ɵɵdefineNgModule({ type: RendererModule });
        RendererModule.ɵinj = i0__namespace.ɵɵdefineInjector({ factory: function RendererModule_Factory(t) { return new (t || RendererModule)(); } });
        return RendererModule;
    }());
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0__namespace.ɵɵsetNgModuleScope(RendererModule, { declarations: [RendererComponent, RendererDirector], exports: [RendererComponent, RendererDirector] }); })();
    (function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(RendererModule, [{
            type: i0.NgModule,
            args: [{
                    declarations: [RendererComponent, RendererDirector],
                    exports: [RendererComponent, RendererDirector],
                }]
        }], null, null); })();

    var LocalStorage = {
        set: function (key, data) {
            if (typeof data === "object") {
                localStorage.setItem(key, JSON.stringify(data));
            }
            else {
                localStorage.setItem(key, data);
            }
        },
        get: function (key) {
            var data = localStorage.getItem(key);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (error) {
                return data;
            }
        },
        remove: function (key) {
            localStorage.removeItem(key);
        },
    };

    exports.Event = Event;
    exports.LocalStorage = LocalStorage;
    exports.PluginStore = PluginStore;
    exports.RendererComponent = RendererComponent;
    exports.RendererDirector = RendererDirector;
    exports.RendererModule = RendererModule;
    exports.RendererPlugin = RendererPlugin;
    exports.createPluginStore = createPluginStore;
    exports.usePluginStore = usePluginStore;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
