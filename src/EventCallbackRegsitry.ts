import { Event } from "./Event";

export class EventCallbackRegsitry {
  private _registry: Map<string, Array<(event: Event) => {}>>;

  constructor() {
    this._registry = new Map();
  }

  addEventListener(name: string, callback: any) {
    let callbacks = this._registry.get(name);

    if (callbacks) {
      callbacks.push(callback);
    } else {
      this._registry.set(name, [callback]);
    }
  }

  removeEventListener(name: string, callback: any) {
    let callbacks = this._registry.get(name);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  dispatchEvent(event: Event) {
    let callbacks = this._registry.get(event.name);
    for (let i in callbacks) {
      callbacks[i as any](event);
    }
  }
}
