import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FormBeginnerComponent } from './components/form/form.component';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from './services/analysis.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {FileUploadModule} from 'primeng/fileupload';
import {DividerModule} from 'primeng/divider';
import {SliderModule} from 'primeng/slider';

@NgModule({
  declarations: [
    AppComponent,
    FormBeginnerComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    SliderModule,
    DividerModule,
    FileUploadModule,
    BrowserModule,
    HttpClientModule,
    InputMaskModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    InputTextareaModule,
    TooltipModule,
    ChartModule,
    TabViewModule,
    TableModule,
    CalendarModule,
    BrowserAnimationsModule,
    ToastModule
  ],
  providers: [AnalysisService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
