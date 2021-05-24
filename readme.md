### Angular Pluggable

Copy from:

https://react-pluggable.github.io/

angular module must provide resolveComponentFactory function for renderPlugin

```
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


```

### Use Case

1. Import RendererModule into entry module

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { RendererModule } from 'angular-pluggable';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CommonModule, RendererModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

2. Create plugin store and install plugins that you develop

```
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements AfterViewInit {
  title = 'angular-demo';
  private pluginStore: PluginStore;

  constructor() {
    this.pluginStore = createPluginStore();
  }

  ngAfterViewInit() {
    console.log('>> AppComponent AfterViewInit');
    this.pluginStore.install(new RendererPlugin());
    this.pluginStore.install(new HeaderPlugin());
    this.pluginStore.install(new TodoPlugin());
  }

  dispatchHelloworld() {
    this.pluginStore.dispatchEvent(new Event('AlertTodo'));
  }
}

```

3. Use render plugin, must install RendererPlugin that angular-pluggable provide, and register viewcontainer

```
<Renderer placement="header"></Renderer>
```
