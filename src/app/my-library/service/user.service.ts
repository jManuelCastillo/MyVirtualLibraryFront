import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  signInWithPopup, GoogleAuthProvider
} from '@angular/fire/auth';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoginComponent } from '../components/login/login.component';
import { doc, setDoc, getDoc, Firestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth: Auth, private dialogService: DialogService, private firestore: Firestore,
    
  ) { }

  ref!: DynamicDialogRef;
  currentUser: User | undefined;
  

  show() {
    this.ref = this.dialogService.open(LoginComponent, {
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  }

  close() {
    this.ref.close()
  }

  // {email, password}: any
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  async registerUserData(uid: string, name: string) {
    return await setDoc(doc(this.firestore, "userData", uid),
      { fullname: name, FavouritesBooks: [], admin: false });
  }

  getLocalUser(){
    if(localStorage.getItem('user')){
      this.currentUser =  JSON.parse(localStorage.getItem('user')!)
  }
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

 async getUser(email: string, password: string): Promise<User | any> {

   await this.login(email, password).
      then(response => {
        this.currentUser = { email: email, id: response.user.uid, fullName: '' }
        return  this.getDataUser(response.user.uid)
         
      }).catch(error => {  return error });
    
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

 async getUserWithGoogle() {
    await this.loginWithGoogle().
      then(response => {
        this.currentUser = { email: response.user.email!, id: response.user.uid, fullName: '' }
        return this.getDataUser(response.user.uid)
      }).catch(error => { return error });
  }

  async getDataUser(uid: string): Promise<User | undefined> {
    const dataUserRef = doc(this.firestore, "userData", uid);
    const docSnap = await getDoc(dataUserRef);

    if (docSnap.exists()) {
      this.currentUser = {
        ...this.currentUser!,
        fullName: docSnap.get('fullname'),
        admin: docSnap.get('admin'),
        favouritesBooks: docSnap.get('favouritesBooks')?? []
      };
      
      

      localStorage.setItem('user', JSON.stringify(this.currentUser))
      
      return this.currentUser
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return undefined
    }
  }


  logout() {
    return signOut(this.auth);
  }
}
