import { inject, Injectable } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserService } from '../service/user.service';


const isAuthenticated = (): | boolean | Observable<boolean> | Promise<boolean> => {
  const usersService = inject(UserService);
  const router = inject(Router);

  if( usersService.currentUser && usersService.currentUser.admin){
 
    return true;
    }
    return false;

}
  
const isloaded = (): | boolean | Observable<boolean>   => {
   const userService = inject(UserService);
   const router = inject(Router);

  if(userService.currentUser && userService.currentUser.admin){
    return true
  }
  return false
}

export const canActivateGuard: CanActivateFn = isAuthenticated;
export const canMatch: CanMatchFn = isloaded;

