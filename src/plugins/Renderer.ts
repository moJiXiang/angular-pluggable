import {
  Component,
  ViewChild,
  ViewContainerRef,
  Input,
  AfterViewInit,
  NgModule,
  OnInit,
  Directive,
  ɵcreateInjector as createInjector,
  Injector,
  Inject,
  ComponentFactoryResolver,
  Type,
  ComponentRef,
  OnDestroy,
} from "@angular/core";
import { Event, RenderderEvent } from "../Event";
import { FunctionNames } from "../FunctionNames";
import { usePluginStore } from "../hooks/usePluginStore";

@Component({
  selector: "Renderer",
  template: `<ng-container #componentAnchor></ng-container>`,
})
export class RendererComponent implements AfterViewInit, OnDestroy {
  @Input() placement!: string;

  @ViewChild("componentAnchor", { read: ViewContainerRef })
  componentAnchor!: ViewContainerRef;

  private pluginStore = usePluginStore();

  private componentRefs: ComponentRef<Component>[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    this.pluginStore.addEventListener(
      FunctionNames.RENDERER_COMPONENT_UPDATED,
      (event: RenderderEvent) => {
        if (event.placement === this.placement) {
          // https://segmentfault.com/a/1190000013972657
          // ExpressionChangedAfterItHasBeenCheckedError error
          Promise.resolve(null).then(() => {
            this.renderComponent(event.placement);
          });
        }
      }
    );
  }

  renderComponent(placement: string) {
    this.componentAnchor.clear();
    const components = this.pluginStore.execFunction(
      FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT,
      placement
    );

    if (components && components.length > 0) {
      (components as Type<Component>[]).forEach((component) => {
        console.log(`>> Renderer Plugin ${component.name} in ${placement}`);
        const componentFactory =
          this.resolver.resolveComponentFactory(component);
        const ref = this.componentAnchor.createComponent(componentFactory);
        this.componentRefs.push(ref);
      });
    }
  }

  ngOnDestroy() {
    for (let ref of this.componentRefs) {
      ref.destroy();
    }
  }
}

@Directive({
  selector: "[renderer]",
})
export class RendererDirector implements AfterViewInit, OnDestroy {
  @Input() placement!: string;

  private pluginStore = usePluginStore();

  private componentRefs: ComponentRef<Component>[] = [];

  constructor(
    private ref: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  ngAfterViewInit() {
    this.pluginStore.addEventListener(
      FunctionNames.RENDERER_COMPONENT_UPDATED,
      (event: RenderderEvent) => {
        if (event.placement === this.placement) {
          Promise.resolve(null).then(() => {
            this.renderComponent(event.placement);
          });
        }
      }
    );
  }

  renderComponent(placement: string) {
    this.ref.clear();
    const components = this.pluginStore.execFunction(
      FunctionNames.RENDERER_GET_COMPONENTS_IN_PLACEMENT,
      placement
    );

    if (components && components.length > 0) {
      (components as Type<Component>[]).forEach((component) => {
        console.log(`>> Renderer Plugin ${component.name} in ${placement}`);
        const componentFactory =
          this.resolver.resolveComponentFactory(component);

        const ref = this.ref.createComponent(componentFactory);
        this.componentRefs.push(ref);
      });
    }
  }

  ngOnDestroy() {
    for (let ref of this.componentRefs) {
      ref.destroy();
    }
  }
}

@NgModule({
  declarations: [RendererComponent, RendererDirector],
  exports: [RendererComponent, RendererDirector],
})
export class RendererModule {}
