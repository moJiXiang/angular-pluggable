import { EventEmitter } from "events";
import { BehaviorSubject } from "rxjs";
import { diff, gte } from "semver";
import { Event } from "./Event";
import { EventCallbackRegsitry } from "./EventCallbackRegsitry";
import { IPlugin } from "./interfaces/IPlugin";

export class PluginStore extends EventEmitter {
  private _context: any;
  private _functionArray: Map<string, any>;
  private _pluginMap: Map<string, IPlugin>;
  private _eventCallbackRegistry: EventCallbackRegsitry;
  private _observerMap = new Map<string, BehaviorSubject<any>>();

  constructor() {
    super();
    this._functionArray = new Map<string, any>();
    this._pluginMap = new Map<string, IPlugin>();
    this._eventCallbackRegistry = new EventCallbackRegsitry();
  }

  public get observerMap(): Map<string, BehaviorSubject<any>> {
    return this._observerMap;
  }

  public get context() {
    return this._context;
  }

  private dependencyValid(installedVersion: string, requiredVersion: string) {
    const versionDiff = diff(installedVersion, requiredVersion);
    return (
      (versionDiff === null ||
        versionDiff === "patch" ||
        versionDiff === "minor") &&
      gte(installedVersion, requiredVersion)
    );
  }

  getInstalledPlugins() {
    return Array.from(this._pluginMap.values());
  }

  useContext<T>(context: T) {
    this._context = context;
  }

  getContext<T>(): T {
    return this._context as T;
  }

  install(plugin: IPlugin) {
    const pluginNameAndVer = plugin.getPluginName();
    const [pluginName, _] = pluginNameAndVer.split("@");
    const pluginDependencies = plugin.getDependencies() || [];

    const installed = this._pluginMap.get(pluginName);

    if (installed) {
      return;
    }

    // check dependencies is installed
    let installErrors: string[] = [];
    pluginDependencies.forEach((dep: string) => {
      const [depName, depVersion] = dep.split("@");
      const plugin = this._pluginMap.get(depName);

      if (!plugin) {
        installErrors.push(
          `Plugin ${pluginName}: ${depName} has not installed!`
        );
      } else {
        const [, installedVersion] = plugin.getPluginName().split("@");
        if (!this.dependencyValid(installedVersion, depVersion)) {
          installErrors.push(
            `Plugin ${pluginName} need ${depName}@${depVersion}, but ${installedVersion} installed!`
          );
        }
      }
    });

    if (installErrors.length === 0) {
      this._pluginMap.set(pluginName, plugin);
      plugin.init(this);
      plugin.activate();
    } else {
      installErrors.forEach((err) => console.error(err));
    }
  }

  uninstall(pluginName: string) {
    let plugin = this._pluginMap.get(pluginName);

    if (plugin) {
      plugin.deactivate();
      this._pluginMap.delete(pluginName);
    }
  }

  addFunction(key: string, fn: any) {
    this._functionArray.set(key, fn);
  }

  execFunction(key: string, ...args: any) {
    let fn = this._functionArray.get(key);
    if (fn) {
      return fn(...args);
    }
  }

  removeFunction(key: string) {
    this._functionArray.delete(key);
  }

  addEventListener<EventType = Event>(
    name: string,
    listener: (event: EventType) => void
  ) {
    this.addListener(name, listener);
  }

  addOnceEventListener<EventType = Event>(name: string, listener: (event: EventType) => void) {
    this.once(name, listener);
  }

  removeEventListener<EventType = Event>(
    name: string,
    listener: (event: EventType) => void
  ) {
    this.removeListener(name, listener);
  }

  dispatchEvent(event: Event) {
    this.emit(event.name, event);
  }

  removeAllEvents() {
    this.removeAllListeners()
  }

  registObserver(name: string, data?: any) {
    this._observerMap.set(name, new BehaviorSubject(data || null));
  }

  getObserver(name: string): BehaviorSubject<any> | undefined {
    return this._observerMap.get(name);
  }
}
