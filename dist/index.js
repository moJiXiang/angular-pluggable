(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.angularPluggable = {}, global.ng.core));
}(this, (function (exports, i0) { 'use strict';

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
            this.functionArray = new Map();
            this.pluginMap = new Map();
            this._eventCallbackRegsitry = new EventCallbackRegsitry();
        }
        PluginStore.prototype.install = function (plugin) {
            var pluginNameAndVer = plugin.getPluginName();
            var _a = pluginNameAndVer.split("@"), pluginName = _a[0]; _a[1];
            plugin.getDependencies();
            // check dependencies is installed
            this.pluginMap.set(pluginName, plugin);
            plugin.init(this);
            plugin.activate();
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
        return PluginStore;
    }());

    var pluginStore;
    var PluginStoreInstance = /** @class */ (function () {
        function PluginStoreInstance() {
        }
        PluginStoreInstance.get = function () {
            return pluginStore;
        };
        PluginStoreInstance.set = function () {
            pluginStore = new PluginStore();
        };
        return PluginStoreInstance;
    }());

    function createPluginStore() {
        PluginStoreInstance.set();
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
        function Event(name) {
            this.name = name;
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

    var RendererPlugin = /** @class */ (function () {
        function RendererPlugin() {
            this.pluginStore = new PluginStore();
            this.ngModuleMap = new Map();
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
        RendererPlugin.prototype.addToNgModuleMap = function (placement, module) {
            var modules = this.ngModuleMap.get(placement);
            if (!modules) {
                modules = [module];
            }
            else {
                modules.push(module);
            }
            this.ngModuleMap.set(placement, modules);
            this.pluginStore.dispatchEvent(new RenderderEvent("Renderer.componentUpdated", placement));
        };
        RendererPlugin.prototype.removeFromNgModuleMap = function (placement, module) {
            var array = this.ngModuleMap.get(placement);
            if (array) {
                array.splice(array.findIndex(function (item) { return item === module; }), 1);
            }
            this.pluginStore.dispatchEvent(new RenderderEvent("Renderer.componentUpdated", placement));
        };
        RendererPlugin.prototype.getModulesInPlacement = function (placement) {
            var componentArray = this.ngModuleMap.get(placement);
            if (!componentArray)
                return [];
            return componentArray;
        };
        RendererPlugin.prototype.activate = function () {
            this.pluginStore.addFunction("Renderer.add", this.addToNgModuleMap.bind(this));
            this.pluginStore.addFunction("Renderer.remove", this.removeFromNgModuleMap.bind(this));
            this.pluginStore.addFunction("Renderer.getModulesInPlacement", this.getModulesInPlacement.bind(this));
        };
        RendererPlugin.prototype.deactivate = function () {
            this.pluginStore.removeFunction("Renderer.add");
            this.pluginStore.removeFunction("Renderer.remove");
            this.pluginStore.removeFunction("Renderer.getModulesInPlacement");
        };
        return RendererPlugin;
    }());

    var _c0 = ["componentAnchor"];
    var RendererComponent = /** @class */ (function () {
        function RendererComponent(injector) {
            this.injector = injector;
            this.pluginStore = usePluginStore();
        }
        RendererComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.pluginStore.addEventListener("Renderer.componentUpdated", function (event) {
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
            console.log(">> Renderer render");
            this.componentAnchor.clear();
            var modules = this.pluginStore.execFunction("Renderer.getModulesInPlacement", placement);
            if (modules && modules.length > 0) {
                modules.forEach(function (module) {
                    var injector = i0.ɵcreateInjector(module, _this.injector);
                    var componentFactory = injector.get(module).resolveComponentFactory();
                    _this.componentAnchor.createComponent(componentFactory);
                });
            }
        };
        RendererComponent.ɵfac = function RendererComponent_Factory(t) { return new (t || RendererComponent)(i0__namespace.ɵɵdirectiveInject(i0__namespace.Injector)); };
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
        }], function () { return [{ type: i0__namespace.Injector }]; }, { placement: [{
                type: i0.Input
            }], componentAnchor: [{
                type: i0.ViewChild,
                args: ["componentAnchor", { read: i0.ViewContainerRef }]
            }] }); })();
    var RendererDirector = /** @class */ (function () {
        function RendererDirector(ref, injector) {
            this.ref = ref;
            this.injector = injector;
            this.pluginStore = usePluginStore();
        }
        RendererDirector.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.pluginStore.addEventListener("Renderer.componentUpdated", function (event) {
                if (event.placement === _this.placement) {
                    Promise.resolve(null).then(function () {
                        _this.renderComponent(event.placement);
                    });
                }
            });
        };
        RendererDirector.prototype.renderComponent = function (placement) {
            var _this = this;
            console.log(">> Renderer render: ", this.placement);
            this.ref.clear();
            var modules = this.pluginStore.execFunction("Renderer.getModulesInPlacement", placement);
            if (modules && modules.length > 0) {
                modules.forEach(function (module) {
                    var injector = i0.ɵcreateInjector(module, _this.injector);
                    var componentFactory = injector.get(module).resolveComponentFactory();
                    _this.ref.createComponent(componentFactory);
                });
            }
        };
        RendererDirector.ɵfac = function RendererDirector_Factory(t) { return new (t || RendererDirector)(i0__namespace.ɵɵdirectiveInject(i0__namespace.ViewContainerRef), i0__namespace.ɵɵdirectiveInject(i0__namespace.Injector)); };
        RendererDirector.ɵdir = i0__namespace.ɵɵdefineDirective({ type: RendererDirector, selectors: [["", "renderer", ""]], inputs: { placement: "placement" } });
        return RendererDirector;
    }());
    (function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0__namespace.ɵsetClassMetadata(RendererDirector, [{
            type: i0.Directive,
            args: [{
                    selector: "[renderer]",
                }]
        }], function () { return [{ type: i0__namespace.ViewContainerRef }, { type: i0__namespace.Injector }]; }, { placement: [{
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

    exports.Event = Event;
    exports.PluginStore = PluginStore;
    exports.RendererComponent = RendererComponent;
    exports.RendererDirector = RendererDirector;
    exports.RendererModule = RendererModule;
    exports.RendererPlugin = RendererPlugin;
    exports.createPluginStore = createPluginStore;
    exports.usePluginStore = usePluginStore;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
