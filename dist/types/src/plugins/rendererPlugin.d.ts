import { IPlugin } from "../interfaces/IPlugin";
import { PluginStore } from "../PluginStore";
import { Component, NgModule } from "@angular/core";
export declare type ComponentUrl = string;
export declare class RendererPlugin implements IPlugin {
    pluginStore: PluginStore;
    private dialogComponentMap;
    private ngModuleMap;
    getPluginName(): string;
    getDependencies(): never[];
    init(pluginStore: PluginStore): void;
    addToNgModuleMap(placement: string, module: NgModule): void;
    removeFromNgModuleMap(placement: string, module: NgModule): void;
    addToRenderOnceModule(placement: string, module: NgModule): void;
    getModulesInPlacement(placement: string): NgModule[];
    addToDialogComponentMap(componentName: string, component: Component): void;
    getDialogComponent(componentName: string): Component | undefined;
    activate(): void;
    deactivate(): void;
}
