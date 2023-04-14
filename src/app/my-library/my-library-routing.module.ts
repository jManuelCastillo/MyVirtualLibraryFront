import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { ManageComponent } from './pages/manage/manage.component';
import { RegisterComponent } from './pages/register/register.component';
import { BookInfoComponent } from './pages/book-info/book-info.component';


const routes: Routes = [
  {
    path: '', children: [

      { path: 'home', component: HomeComponent },

      { path: 'collection', component: CollectionComponent },

      { path: 'manage', component: ManageComponent },

      { path: 'register', component: RegisterComponent },

      {path: 'bookinfo/:title', component: BookInfoComponent},

      { path: '**', redirectTo: 'home' }
    ]
  },

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MyLibraryRoutingModule { }