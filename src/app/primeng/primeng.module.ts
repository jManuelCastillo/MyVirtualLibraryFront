import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipsModule } from 'primeng/chips';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [],
  exports: [
    ButtonModule,
    TabMenuModule,
    AvatarModule,
    InputTextModule,
    SplitButtonModule,
    CarouselModule,
    TagModule,
    CardModule,
    AccordionModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    ChipsModule,
    DynamicDialogModule,
    ToastModule,
    InputTextareaModule
  ]
})


export class PrimengModule { }
