import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupContentComponent } from './modules/master/components/helper/popup/popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'impDashboard';
  constructor(private dialog: MatDialog) { }
}
