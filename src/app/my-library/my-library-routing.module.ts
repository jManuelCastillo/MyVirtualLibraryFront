import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CollectionComponent } from './pages/collection/collection.component';


const routes: Routes = [
  {
    path: '', children: [

      { path: 'home', component: HomeComponent },

      { path: 'collection', component: CollectionComponent },

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
