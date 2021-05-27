import { Event, RenderderEvent } from "../Event";
import { IPlugin } from "../interfaces/IPlugin";
import { PluginStore } from "../PluginStore";
import { FunctionNames } from "../FunctionNames";
import { Component, NgModule } from "@angular/core";

export type ComponentUrl = string;

export class RendererPlugin implements IPlugin {
  public pluginStore: PluginStore = new PluginStore();
  private dialogComponentMap = new Map<string, Component>();
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
      new RenderderEvent(FunctionNames.RENDERER_COMPONENT_UPDATED, placement)
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
      new RenderderEvent(FunctionNames.RENDERER_COMPONENT_UPDATED, placement)
    );
  }

  addToRenderOnceModule(placement: string, module: NgModule) {
    this.ngModuleMap.set(placement, [module]);

    this.pluginStore.dispatchEvent(
      new RenderderEvent(FunctionNames.RENDERER_COMPONENT_UPDATED, placement)
    );
  }

  getModulesInPlacement(placement: string) {
    const componentArray = this.ngModuleMap.get(placement);
    if (!componentArray) return [];

    return componentArray;
  }

  addToDialogComponentMap(componentName: string, component: Component) {
    this.dialogComponentMap.set(componentName, component);
  }

  getDialogComponent(componentName: string): Component | undefined {
    return this.dialogComponentMap.get(componentName);
  }

  activate() {
    this.pluginStore.addFunction(
      FunctionNames.RENDERER_ADD,
      this.addToNgModuleMap.bind(this)
    );

    this.pluginStore.addFunction(
      FunctionNames.RENDERER_ONCE,
      this.addToRenderOnceModule.bind(this)
    );

    this.pluginStore.addFunction(
      FunctionNames.RENDERER_REGIST_DIALOG_COMPONENT,
      this.addToDialogComponentMap.bind(this)
    );

    this.pluginStore.addFunction(
      FunctionNames.RENDERER_GET_DIALOG_COMPONENT,
      this.getDialogComponent.bind(this)
    );

    this.pluginStore.addFunction(
      FunctionNames.RENDERER_REMOVE,
      this.removeFromNgModuleMap.bind(this)
    );

    this.pluginStore.addFunction(
      FunctionNames.RENDERER_GET_MODULES_IN_PLACEMENT,
      this.getModulesInPlacement.bind(this)
    );
  }

  deactivate() {
    this.pluginStore.removeFunction(FunctionNames.RENDERER_ADD);
    this.pluginStore.removeFunction(FunctionNames.RENDERER_ONCE);

    this.pluginStore.removeFunction(
      FunctionNames.RENDERER_REGIST_DIALOG_COMPONENT
    );
    this.pluginStore.removeFunction(
      FunctionNames.RENDERER_GET_DIALOG_COMPONENT
    );
    this.pluginStore.removeFunction(FunctionNames.RENDERER_REMOVE);
    this.pluginStore.removeFunction(
      FunctionNames.RENDERER_GET_MODULES_IN_PLACEMENT
    );
  }
}
