import PluginStoreInstance from "../PluginStoreInstance";

export function createPluginStore<T>(context?: T) {
  PluginStoreInstance.set<T>(context);
  return PluginStoreInstance.get();
}
