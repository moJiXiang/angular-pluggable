import PluginStoreInstance from "../PluginStoreInstance";

export function usePluginStore() {
  return PluginStoreInstance.get();
}
