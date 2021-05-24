import { Injectable } from '@angular/core';

@Injectable()
export class HeaderService {
  constructor() {}

  getHeaderList() {
    return ['周一', '周二'];
  }
}
