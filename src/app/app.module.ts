import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormComponentComponent } from './form-component/form-component.component';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    FormComponentComponent
  ],
  imports: [
    BrowserModule,
    InputMaskModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
