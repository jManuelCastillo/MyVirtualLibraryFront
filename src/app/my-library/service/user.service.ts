import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth:Auth) {
    
  }
// {email, password}: any
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout(){
   return signOut(this.auth);
  }
}
