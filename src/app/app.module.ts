import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupComponent } from './modules/master/components/helper/popup/popup.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { config } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

export const CONFIG = new InjectionToken<typeof config>('CONFIG');
@NgModule({
  declarations: [AppComponent],
  providers: [{ provide: CONFIG, useValue: config }],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,

    ToastrModule.forRoot({
      positionClass: 'toast-center', // Set the position class to center
    }),
  ],
})
export class AppModule {}
