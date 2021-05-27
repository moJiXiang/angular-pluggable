import { BehaviorSubject } from "rxjs";
import { diff, gte } from "semver";
import { Event } from "./Event";
import { EventCallbackRegsitry } from "./EventCallbackRegsitry";
import { IPlugin } from "./interfaces/IPlugin";

export class PluginStore {
  private _context: any;
  private functionArray: Map<string, any>;
  private pluginMap: Map<string, IPlugin>;
  private _eventCallbackRegsitry: EventCallbackRegsitry;
  private observerMap = new Map<string, BehaviorSubject<any>>();

  constructor() {
    this.functionArray = new Map<string, any>();
    this.pluginMap = new Map<string, IPlugin>();
    this._eventCallbackRegsitry = new EventCallbackRegsitry();
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

    // check dependencies is installed
    let installErrors: string[] = [];
    pluginDependencies.forEach((dep: string) => {
      const [depName, depVersion] = dep.split("@");
      const plugin = this.pluginMap.get(depName);

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
      this.pluginMap.set(pluginName, plugin);
      plugin.init(this);
      plugin.activate();
    } else {
      installErrors.forEach((err) => console.error(err));
    }
  }

  uninstall(pluginName: string) {
    let plugin = this.pluginMap.get(pluginName);

    if (plugin) {
      plugin.deactivate();
      this.pluginMap.delete(pluginName);
    }
  }

  addFunction(key: string, fn: any) {
    this.functionArray.set(key, fn);
  }

  execFunction(key: string, ...args: any) {
    let fn = this.functionArray.get(key);
    if (fn) {
      return fn(...args);
    }
  }

  removeFunction(key: string) {
    this.functionArray.delete(key);
  }

  addEventListener<EventType = Event>(
    name: string,
    callback: (event: EventType) => void
  ) {
    this._eventCallbackRegsitry.addEventListener(name, callback);
  }

  removeEventListener<EventType = Event>(
    name: string,
    callback: (event: EventType) => void
  ) {
    this._eventCallbackRegsitry.removeEventListener(name, callback);
  }

  dispatchEvent(event: Event) {
    this._eventCallbackRegsitry.dispatchEvent(event);
  }

  registObserver(name: string, data?: any) {
    this.observerMap.set(name, new BehaviorSubject(data || null));
  }

  getObserver<T>(name: string): BehaviorSubject<T> | undefined {
    return this.observerMap.get(name);
  }
}
