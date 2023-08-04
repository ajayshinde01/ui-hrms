import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog,MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-popup-content',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<PopupContentComponent>) {}
  closeDialog() {
    this.dialogRef.close();
  }
}
