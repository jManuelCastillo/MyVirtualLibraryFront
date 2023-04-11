import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PrimengModule } from '../primeng/primeng.module';
import { FooterComponent } from './components/footer/footer.component';
import { ManageComponent } from './pages/manage/manage.component';
import { RegisterComponent } from './pages/register/register.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ExamplePdfViewerComponent } from './components/example-pdf-viewer/example-pdf-viewer.component';


@NgModule({
  declarations: [
    HomeComponent,
    CollectionComponent,
    NavbarComponent,
    FooterComponent,
    ManageComponent,
    RegisterComponent,
    ExamplePdfViewerComponent
    
  
  ],
  imports: [
    CommonModule,
    MyLibraryRoutingModule,
    PrimengModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule
  ]  ,
  providers:[]
})
export class MyLibraryModule { }
