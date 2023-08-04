import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  constructor() {}
  public toggle: BehaviorSubject<string> = new BehaviorSubject('');
}
