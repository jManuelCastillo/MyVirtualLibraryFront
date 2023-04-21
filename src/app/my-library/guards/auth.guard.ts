import { inject, Injectable } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LibraryService } from '../service/library.service';




const isAuthenticated = (): | boolean | Observable<boolean> | Promise<boolean> => {
  const libraryService = inject(LibraryService);
  const router = inject(Router);
  
 /*  return authService.verifcaAutentication().pipe(
    tap((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        router.navigate(['./auth/login']);
      }
    }),
  ); */

  if( libraryService.currentUser && libraryService.currentUser.id){
    router.navigate(['./home']);
    return true;
    }
    return false;

}




const isloaded = (): | boolean | Observable<boolean>   => {
   const libraryService = inject(LibraryService);
   const router = inject(Router);

/*   return authService.verifcaAutentication().pipe(
    tap((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        router.navigate(['./auth/login']);
      }
    }),
  ); */

  if(libraryService.currentUser && libraryService.currentUser.id){
    return true
  }
  return false
}

export const canActivate: CanActivateFn = isAuthenticated;
export const canMatch: CanMatchFn = isloaded;

