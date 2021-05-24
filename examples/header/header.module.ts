import { CommonModule } from '@angular/common';
import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule],
})
export class HeaderModule {
  constructor(private resolver: ComponentFactoryResolver) {}

  public resolveComponentFactory(): ComponentFactory<HeaderComponent> {
    return this.resolver.resolveComponentFactory(HeaderComponent);
  }
}
