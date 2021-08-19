import { PluginStore } from "../PluginStore";

export interface IPlugin {
  pluginStore: PluginStore;
  title: string;
  id: string;
  icon?: string;
  getPluginName(): string;
  getDependencies(): string[];
  init(pluginStore: PluginStore): void;
  activate(): void;
  deactivate(): void;
}
