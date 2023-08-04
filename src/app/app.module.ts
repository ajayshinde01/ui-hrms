import { DemoComponent } from './modules/main/components/demo/demo.component';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { config } from 'rxjs';
import { PopupComponent } from './modules/master/components/helper/popup/popup.component';

export const CONFIG = new InjectionToken<typeof config>('CONFIG');
@NgModule({
  declarations: [AppComponent, DemoComponent],
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

    ToastrModule.forRoot(),
  ],
  exports: [MatDialogModule],
})
export class AppModule {}
