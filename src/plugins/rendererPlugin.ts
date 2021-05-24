import { Event, RenderderEvent } from "../Event";
import { IPlugin } from "../interfaces/IPlugin";
import { PluginStore } from "../PluginStore";
import { Component, NgModule } from "@angular/core";

export type ComponentUrl = string;

export class RendererPlugin implements IPlugin {
  public pluginStore: PluginStore = new PluginStore();
  private ngModuleMap = new Map<string, Array<NgModule>>();

  getPluginName() {
    return "Renderer@1.0.0";
  }

  getDependencies() {
    return [];
  }

  init(pluginStore: PluginStore) {
    this.pluginStore = pluginStore;
  }

  addToNgModuleMap(placement: string, module: NgModule) {
    let modules = this.ngModuleMap.get(placement);
    if (!modules) {
      modules = [module];
    } else {
      modules.push(module);
    }
    this.ngModuleMap.set(placement, modules);

    this.pluginStore.dispatchEvent(
      new RenderderEvent("Renderer.componentUpdated", placement)
    );
  }

  removeFromNgModuleMap(placement: string, module: NgModule) {
    let array = this.ngModuleMap.get(placement);
    if (array) {
      array.splice(
        array.findIndex((item) => item === module),
        1
      );
    }
    this.pluginStore.dispatchEvent(
      new RenderderEvent("Renderer.componentUpdated", placement)
    );
  }

  getModulesInPlacement(placement: string) {
    const componentArray = this.ngModuleMap.get(placement);
    if (!componentArray) return [];

    return componentArray;
  }

  activate() {
    this.pluginStore.addFunction(
      "Renderer.add",
      this.addToNgModuleMap.bind(this)
    );

    this.pluginStore.addFunction(
      "Renderer.remove",
      this.removeFromNgModuleMap.bind(this)
    );

    this.pluginStore.addFunction(
      "Renderer.getModulesInPlacement",
      this.getModulesInPlacement.bind(this)
    );
  }

  deactivate() {
    this.pluginStore.removeFunction("Renderer.add");
    this.pluginStore.removeFunction("Renderer.remove");
    this.pluginStore.removeFunction("Renderer.getModulesInPlacement");
  }
}
