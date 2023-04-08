import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { PrimengModule } from '../primeng/primeng.module';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  declarations: [
    HomeComponent,
    CollectionComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MyLibraryRoutingModule,
    PrimengModule
  ]  
})
export class MyLibraryModule { }
