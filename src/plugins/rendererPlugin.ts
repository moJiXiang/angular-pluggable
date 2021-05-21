import { Event, RenderderEvent } from "../Event";
import { IPlugin } from "../interfaces/IPlugin";
import { PluginStore } from "../PluginStore";
import { Component } from "@angular/core";

export class RendererPlugin implements IPlugin {
  public pluginStore: PluginStore = new PluginStore();
  private componentMap = new Map<string, Array<Component>>();

  getPluginName() {
    return "Renderer@1.0.0";
  }

  getDependencies() {
    return [];
  }

  init(pluginStore: PluginStore) {
    this.pluginStore = pluginStore;
  }

  addToComponentMap(placement: string, component: Component) {
    let components = this.componentMap.get(placement);
    if (!components) {
      components = [component];
    } else {
      components.push(component);
    }
    this.componentMap.set(placement, components);

    this.pluginStore.dispatchEvent(
      new RenderderEvent("Renderer.componentUpdated", placement)
    );
  }

  removeFromComponentMap(placement: string, component: Component) {
    let array = this.componentMap.get(placement);
    if (array) {
      array.splice(
        array.findIndex((item) => item === component),
        1
      );
    }
    this.pluginStore.dispatchEvent(
      new RenderderEvent("Renderer.componentUpdated", placement)
    );
  }

  getComponentsInPlacement(placement: string) {
    const componentArray = this.componentMap.get(placement);
    if (!componentArray) return [];

    return componentArray;
  }

  activate() {
    this.pluginStore.addFunction(
      "Renderer.add",
      this.addToComponentMap.bind(this)
    );

    this.pluginStore.addFunction(
      "Renderer.remove",
      this.removeFromComponentMap.bind(this)
    );

    this.pluginStore.addFunction(
      "Renderer.getComponentsInPlacement",
      this.getComponentsInPlacement.bind(this)
    );
  }

  deactivate() {
    this.pluginStore.removeFunction("Renderer.add");
    this.pluginStore.removeFunction("Renderer.remove");
    this.pluginStore.removeFunction("Renderer.getComponentsInPlacement");
  }
}
