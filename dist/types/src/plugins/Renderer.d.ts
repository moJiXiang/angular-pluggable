import { ViewContainerRef, AfterViewInit, ComponentFactoryResolver, OnDestroy } from "@angular/core";
import * as i0 from "@angular/core";
export declare class RendererComponent implements AfterViewInit, OnDestroy {
    private resolver;
    placement: string;
    componentAnchor: ViewContainerRef;
    private pluginStore;
    private componentRefs;
    constructor(resolver: ComponentFactoryResolver);
    ngAfterViewInit(): void;
    renderComponent(placement: string): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDef<RendererComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<RendererComponent, "Renderer", never, { "placement": "placement"; }, {}, never, never>;
}
export declare class RendererDirector implements AfterViewInit, OnDestroy {
    private ref;
    private resolver;
    placement: string;
    private pluginStore;
    private componentRefs;
    constructor(ref: ViewContainerRef, resolver: ComponentFactoryResolver);
    ngAfterViewInit(): void;
    renderComponent(placement: string): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDef<RendererDirector, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<RendererDirector, "[renderer]", never, { "placement": "placement"; }, {}, never>;
}
export declare class RendererModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<RendererModule, [typeof RendererComponent, typeof RendererDirector], never, [typeof RendererComponent, typeof RendererDirector]>;
    static ɵinj: i0.ɵɵInjectorDef<RendererModule>;
}
