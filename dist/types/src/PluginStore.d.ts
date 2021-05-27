import { BehaviorSubject } from "rxjs";
import { Event } from "./Event";
import { IPlugin } from "./interfaces/IPlugin";
export declare class PluginStore {
    private _context;
    private functionArray;
    private pluginMap;
    private _eventCallbackRegsitry;
    private observerMap;
    constructor();
    get context(): any;
    private dependencyValid;
    useContext<T>(context: T): void;
    getContext<T>(): T;
    install(plugin: IPlugin): void;
    uninstall(pluginName: string): void;
    addFunction(key: string, fn: any): void;
    execFunction(key: string, ...args: any): any;
    removeFunction(key: string): void;
    addEventListener<EventType = Event>(name: string, callback: (event: EventType) => void): void;
    removeEventListener<EventType = Event>(name: string, callback: (event: EventType) => void): void;
    dispatchEvent(event: Event): void;
    registObserver(name: string, data?: any): void;
    getObserver<T>(name: string): BehaviorSubject<T> | undefined;
}
