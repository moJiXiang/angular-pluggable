import PluginStoreInstance from "../PluginStoreInstance";

export function createPluginStore() {
  PluginStoreInstance.set();
  return PluginStoreInstance.get();
}
