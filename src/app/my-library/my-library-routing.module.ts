import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { ManageComponent } from './pages/manage/manage.component';
import { RegisterComponent } from './pages/register/register.component';
import { BookInfoComponent } from './pages/book-info/book-info.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { canMatch, canActivateGuard } from './guards/auth.guard';
import { UpdateBookComponent } from './pages/update-book/update-book.component';


const routes: Routes = [
  {
    path: '', children: [

      { path: 'home', component: HomeComponent },

      { path: 'collection', component: CollectionComponent },

      {
        path: 'manage', component: ManageComponent,
        canMatch: [canMatch],
        canActivate: [canActivateGuard]
      },

      {
        path: 'register', component: RegisterComponent
      },

      {
        path: 'updateBook/:id', component: UpdateBookComponent,
        canMatch: [canMatch],
        canActivate: [canActivateGuard]
      },

      {
        path: 'bookinfo/:id',
        component: BookInfoComponent,
        ...canActivate(() => redirectUnauthorizedTo(['/register']))
      },

      { path: '**', redirectTo: 'home' }
    ]
  },

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],

})
export class MyLibraryRoutingModule { }
