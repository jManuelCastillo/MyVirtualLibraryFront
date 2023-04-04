import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';

@NgModule({
  declarations: [],
  exports: [
    ButtonModule, 
    TabMenuModule,
    AvatarModule,
    InputTextModule,
    SplitButtonModule
  ]
})
export class PrimengModule { }
