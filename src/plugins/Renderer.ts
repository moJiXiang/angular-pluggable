import {
  Component,
  Type,
  ComponentFactoryResolver,
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
} from "@angular/core";
import { Event, RenderderEvent } from "src/Event";
import { usePluginStore } from "../hooks/usePluginStore";
import { ComponentUrl } from "./rendererPlugin";

@Component({
  selector: "Renderer",
  template: `<ng-container #componentAnchor></ng-container>`,
})
export class RendererComponent {
  @Input() placement!: string;

  @ViewChild("componentAnchor", { read: ViewContainerRef })
  componentAnchor!: ViewContainerRef;

  private pluginStore = usePluginStore();

  constructor(private injector: Injector) {
    console.log(">> Renderer Component constructor");
    this.pluginStore.addEventListener(
      "Renderer.componentUpdated",
      (event: RenderderEvent) => {
        if (event.placement === this.placement) {
          this.renderComponent(event.placement);
        }
      }
    );
  }

  renderComponent(placement: string) {
    console.log(">> Renderer render");
    this.componentAnchor.clear();
    const modules = this.pluginStore.execFunction(
      "Renderer.getModulesInPlacement",
      placement
    );

    if (modules && modules.length > 0) {
      (modules as NgModule[]).forEach((module) => {
        const injector = createInjector(module, this.injector);
        const componentFactory = injector.get(module).resolveComponentFactory();
        const componentRef =
          this.componentAnchor.createComponent(componentFactory);
      });
    }
  }
}

@Directive({
  selector: "[renderer]",
})
export class RendererDirector {
  @Input() placement!: string;

  private pluginStore = usePluginStore();

  constructor(private ref: ViewContainerRef, private injector: Injector) {
    this.pluginStore.addEventListener(
      "Renderer.componentUpdated",
      (event: RenderderEvent) => {
        if (event.placement === this.placement) {
          this.renderComponent(event.placement);
        }
      }
    );
  }

  renderComponent(placement: string) {
    console.log(">> Renderer render: ", this.placement);
    this.ref.clear();
    const modules = this.pluginStore.execFunction(
      "Renderer.getModulesInPlacement",
      placement
    );

    if (modules && modules.length > 0) {
      (modules as NgModule[]).forEach((module) => {
        const injector = createInjector(module, this.injector);
        const componentFactory = injector.get(module).resolveComponentFactory();

        this.ref.createComponent(componentFactory);
      });
    }
  }
}

@NgModule({
  declarations: [RendererComponent, RendererDirector],
  exports: [RendererComponent, RendererDirector],
})
export class RendererModule {}
