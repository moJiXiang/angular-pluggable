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
} from "@angular/core";
import { Event, RenderderEvent } from "src/Event";
import { usePluginStore } from "../hooks/usePluginStore";

@Component({
  selector: "Renderer",
  template: `<ng-container #componentAnchor></ng-container>`,
})
export class RendererComponent implements OnInit, AfterViewInit {
  @Input() placement!: string;

  @ViewChild("componentAnchor", { read: ViewContainerRef })
  componentAnchor!: ViewContainerRef;

  private pluginStore = usePluginStore();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.pluginStore.addEventListener(
      "Renderer.componentUpdated",
      (event: RenderderEvent) => {
        if (event.placement === this.placement) {
          this.renderComponent(event.placement);
        }
      }
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  renderComponent(placement: string) {
    console.log(">> Renderer render");
    this.componentAnchor.clear();
    const components = this.pluginStore.execFunction(
      "Renderer.getComponentsInPlacement",
      placement
    );

    if (components && components.length > 0) {
      (components as Type<Component>[]).forEach((component) => {
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(component);

        this.componentAnchor.createComponent(componentFactory);
      });
    }
  }
}

@Directive({
  selector: "[renderer]",
})
export class RendererDirector implements OnInit, AfterViewInit {
  @Input() placement!: string;

  private pluginStore = usePluginStore();

  constructor(
    private ref: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.pluginStore.addEventListener(
      "Renderer.componentUpdated",
      (event: RenderderEvent) => {
        if (event.placement === this.placement) {
          this.renderComponent(event.placement);
        }
      }
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  renderComponent(placement: string) {
    console.log(">> Renderer render: ", this.placement);
    this.ref.clear();
    const components = this.pluginStore.execFunction(
      "Renderer.getComponentsInPlacement",
      placement
    );

    if (components && components.length > 0) {
      (components as Type<Component>[]).forEach((component) => {
        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(component);

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
