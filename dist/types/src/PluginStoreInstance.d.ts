import { PluginStore } from "./PluginStore";
export default class PluginStoreInstance {
    static get(): PluginStore;
    static set<T>(context?: T): void;
}
