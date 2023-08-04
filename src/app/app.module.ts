import { DemoComponent } from './modules/main/components/demo/demo.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { config } from 'rxjs';	
import { PopupContentComponent } from './modules/master/components/helper/popup/popup.component'; 
import { InjectionToken } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

export const CONFIG = new InjectionToken<typeof config>('CONFIG');

@NgModule({
    declarations: [
        AppComponent,
        DemoComponent,

    ],
    providers: [{ provide: CONFIG, useValue: config }],
    bootstrap: [AppComponent],
    entryComponents: [PopupContentComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogModule,
        ToastrModule.forRoot(),

  ],
  exports: [MatDialogModule],
})
export class AppModule { }
