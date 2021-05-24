import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';

import { IPlugin, PluginStore } from 'angular-pluggable';

export class TodoPlugin implements IPlugin {
  pluginStore: PluginStore;

  getPluginName(): string {
    return 'helloworld@1.0.0';
  }

  getDependencies(): string[] {
    return [];
  }

  init(pluginStore: PluginStore): void {
    this.pluginStore = pluginStore;
  }

  activate(): void {
    this.pluginStore.addEventListener('AlertHelloWorld', (event) => {
      alert('Hello World');
    });

    this.pluginStore.execFunction('Renderer.add', 'body', TodoModule);
  }

  deactivate(): void {}
}

@Component({
  selector: 'Todo',
  template: `<h1>Todo</h1>`,
})
export class TodoComponent {
  constructor() {}
}

@NgModule({
  declarations: [TodoComponent],
  imports: [CommonModule],
})
export class TodoModule {
  constructor(private resolver: ComponentFactoryResolver) {}

  public resolveComponentFactory(): ComponentFactory<TodoComponent> {
    return this.resolver.resolveComponentFactory(TodoComponent);
  }
}
