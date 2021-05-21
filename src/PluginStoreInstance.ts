import { PluginStore } from "./PluginStore";

let pluginStore: PluginStore;

export default class PluginStoreInstance {
  public static get() {
    return pluginStore;
  }

  public static set() {
    pluginStore = new PluginStore();
  }
}
