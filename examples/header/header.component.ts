import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { HeaderService } from './header.service';
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  providers: [HeaderService],
})
export class HeaderComponent implements OnInit {
  public headers;

  constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.headers = this.headerService.getHeaderList();
  }
}
