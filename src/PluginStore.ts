import { Event } from "./Event";
import { EventCallbackRegsitry } from "./EventCallbackRegsitry";
import { IPlugin } from "./interfaces/IPlugin";

export class PluginStore {
  private functionArray: Map<string, any>;
  private pluginMap: Map<string, IPlugin>;
  private _eventCallbackRegsitry: EventCallbackRegsitry;

  constructor() {
    this.functionArray = new Map<string, any>();
    this.pluginMap = new Map<string, IPlugin>();
    this._eventCallbackRegsitry = new EventCallbackRegsitry();
  }

  install(plugin: IPlugin) {
    const pluginNameAndVer = plugin.getPluginName();
    const [pluginName, _] = pluginNameAndVer.split("@");
    const pluginDependencies = plugin.getDependencies();

    // check dependencies is installed
    this.pluginMap.set(pluginName, plugin);
    plugin.init(this);
    plugin.activate();
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
}
