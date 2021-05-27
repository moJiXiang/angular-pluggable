import { IPlugin } from "../interfaces/IPlugin";
import { PluginStore } from "../PluginStore";
import { Component, NgModule, Type } from "@angular/core";
export declare type ComponentUrl = string;
export declare class RendererPlugin implements IPlugin {
    pluginStore: PluginStore;
    private dialogComponentMap;
    private componentsMap;
    getPluginName(): string;
    getDependencies(): never[];
    init(pluginStore: PluginStore): void;
    addTocomponentsMap(placement: string, component: Type<Component>): void;
    removeFromcomponentsMap(placement: string, module: NgModule): void;
    addToRenderOnceComponent(placement: string, component: Type<Component>): void;
    getComponentsInPlacement(placement: string): Type<Component>[];
    addToDialogComponentMap(componentName: string, component: Component): void;
    getDialogComponent(componentName: string): Component | undefined;
    activate(): void;
    deactivate(): void;
}
