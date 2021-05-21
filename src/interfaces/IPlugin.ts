import { PluginStore } from "../PluginStore";

export interface IPlugin {
  pluginStore: PluginStore;
  getPluginName(): string;
  getDependencies(): string[];
  init(pluginStore: PluginStore): void;
  activate(): void;
  deactivate(): void;
}
