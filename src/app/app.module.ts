import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormBeginnerComponent } from './components/form-beginner/form-beginner.component';
import {InputMaskModule} from 'primeng/inputmask';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { FormsModule }   from '@angular/forms';
import { AnalysisService } from './services/analysis.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormAdvancedComponent } from './components/form-advanced/form-advanced.component';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    AppComponent,
    FormBeginnerComponent,
    HeaderComponent,
    FooterComponent,
    FormAdvancedComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InputMaskModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    InputTextareaModule
  ],
  providers: [AnalysisService],
  bootstrap: [AppComponent]
})
export class AppModule { }
