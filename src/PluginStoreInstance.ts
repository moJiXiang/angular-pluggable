import { PluginStore } from "./PluginStore";

let pluginStore: PluginStore;

export default class PluginStoreInstance {
  public static get() {
    return pluginStore;
  }

  public static set<T>(context?: T) {
    pluginStore = new PluginStore();

    if (context) {
      pluginStore.useContext<T>(context);
    }
  }
}
