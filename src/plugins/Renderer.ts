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
} from "@angular/core";
import { Event, RenderderEvent } from "../Event";
import { FunctionNames } from "../FunctionNames";
import { usePluginStore } from "../hooks/usePluginStore";

@Component({
  selector: "Renderer",
  template: `<ng-container #componentAnchor></ng-container>`,
})
export class RendererComponent implements AfterViewInit {
  @Input() placement!: string;

  @ViewChild("componentAnchor", { read: ViewContainerRef })
  componentAnchor!: ViewContainerRef;

  private pluginStore = usePluginStore();

  constructor(private injector: Injector) {}

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
    console.log(`>> Renderer in ${placement}`);
    this.componentAnchor.clear();
    const modules = this.pluginStore.execFunction(
      FunctionNames.RENDERER_GET_MODULES_IN_PLACEMENT,
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
export class RendererDirector implements AfterViewInit {
  @Input() placement!: string;

  private pluginStore = usePluginStore();

  constructor(private ref: ViewContainerRef, private injector: Injector) {}

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
    console.log(">> Renderer render: ", this.placement);
    this.ref.clear();
    const modules = this.pluginStore.execFunction(
      FunctionNames.RENDERER_GET_MODULES_IN_PLACEMENT,
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
