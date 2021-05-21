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
} from "@angular/core";
import { Event, RenderderEvent } from "src/Event";
import { usePluginStore } from "../hooks/usePluginStore";

@Component({
  selector: "Renderer",
  template: `<ng-container #{{placement}}></ng-container>`,
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
        this.renderComponent(event.placement);
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

@NgModule({
  declarations: [RendererComponent],
  exports: [RendererComponent],
})
export class RendererModule {}
