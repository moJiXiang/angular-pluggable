import { Event } from "./Event";
export declare class EventCallbackRegsitry {
    private _registry;
    constructor();
    addEventListener(name: string, callback: any): void;
    removeEventListener(name: string, callback: any): void;
    dispatchEvent(event: Event): void;
}
