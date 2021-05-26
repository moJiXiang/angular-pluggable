import { Event } from "./Event";
import { IPlugin } from "./interfaces/IPlugin";
export declare class PluginStore {
    private functionArray;
    private pluginMap;
    private _eventCallbackRegsitry;
    constructor();
    install(plugin: IPlugin): void;
    uninstall(pluginName: string): void;
    addFunction(key: string, fn: any): void;
    execFunction(key: string, ...args: any): any;
    removeFunction(key: string): void;
    addEventListener<EventType = Event>(name: string, callback: (event: EventType) => void): void;
    removeEventListener<EventType = Event>(name: string, callback: (event: EventType) => void): void;
    dispatchEvent(event: Event): void;
}
