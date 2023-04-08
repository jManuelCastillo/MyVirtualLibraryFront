import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

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
    CardModule
  ]
})
export class PrimengModule { }
