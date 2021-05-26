import { IPlugin } from "../interfaces/IPlugin";
import { PluginStore } from "../PluginStore";
import { NgModule } from "@angular/core";
export declare type ComponentUrl = string;
export declare class RendererPlugin implements IPlugin {
    pluginStore: PluginStore;
    private ngModuleMap;
    getPluginName(): string;
    getDependencies(): never[];
    init(pluginStore: PluginStore): void;
    addToNgModuleMap(placement: string, module: NgModule): void;
    removeFromNgModuleMap(placement: string, module: NgModule): void;
    getModulesInPlacement(placement: string): NgModule[];
    activate(): void;
    deactivate(): void;
}
