import { IPlugin, PluginStore } from 'angular-pluggable';
import { HeaderComponent } from './header.component';
import { HeaderModule } from './header.module';

export class HeaderPlugin implements IPlugin {
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
    this.pluginStore.execFunction('Renderer.add', 'header', HeaderModule);
  }

  deactivate(): void {}
}
