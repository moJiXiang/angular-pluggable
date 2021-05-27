import { Event, RenderderEvent } from "../Event";
import { IPlugin } from "../interfaces/IPlugin";
import { PluginStore } from "../PluginStore";
import { FunctionNames } from "../FunctionNames";
import { Component, NgModule, Type } from "@angular/core";

export type ComponentUrl = string;

export class RendererPlugin implements IPlugin {
  public pluginStore: PluginStore = new PluginStore();
  private dialogComponentMap = new Map<string, Component>();
  private componentsMap = new Map<string, Array<Type<Component>>>();

  getPluginName() {
    return "Renderer@1.0.0";
  }

  getDependencies() {
    return [];
  }

  init(pluginStore: PluginStore) {
    this.pluginStore = pluginStore;
  }

  addTocomponentsMap(placement: string, component: Type<Component>) {
    let components = this.componentsMap.get(placement);
    if (!components) {
      components = [component];
    } else {
      components.push(component);
    }
    this.componentsMap.set(placement, components);

    this.pluginStore.dispatchEvent(
      new RenderderEvent(FunctionNames.RENDERER_COMPONENT_UPDATED, placement)
    );
  }

  removeFromcomponentsMap(placement: string, module: NgModule) {
    let array = this.componentsMap.get(placement);
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

  addToRenderOnceComponent(placement: string, component: Type<Component>) {
    this.componentsMap.set(placement, [component]);

    this.pluginStore.dispatchEvent(
      new RenderderEvent(FunctionNames.RENDERER_COMPONENT_UPDATED, placement)
    );
  }

  getComponentsInPlacement(placement: string) {
    const componentArray = this.componentsMap.get(placement);
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
      this.addTocomponentsMap.bind(this)
    );

    this.pluginStore.addFunction(
      FunctionNames.RENDERER_ONCE,
      this.addToRenderOnceComponent.bind(this)
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
      this.removeFromcomponentsMap.bind(this)
    );

    this.pluginStore.addFunction(
      FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT,
      this.getComponentsInPlacement.bind(this)
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
      FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT
    );
  }
}
