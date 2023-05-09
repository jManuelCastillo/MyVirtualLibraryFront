import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  signInWithPopup, GoogleAuthProvider, getAuth, deleteUser
} from '@angular/fire/auth';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoginComponent } from '../components/login/login.component';
import { doc, setDoc, getDoc, Firestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { BookmarkService } from './bookmark.service';
import { collection, query, where, getDocs,  } from "firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    private auth: Auth, private dialogService: DialogService, private firestore: Firestore,
    private bookMarkService: BookmarkService

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

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  async registerUserData(uid: string, name: string, email: string) {
    return await setDoc(doc(this.firestore, "userData", uid),
      { fullName: name,email: email ,favouritesBooks: [], admin: false, finishedBooks: [] });
  }

  getLocalUser() {
    if (localStorage.getItem('user')) {
      this.currentUser = JSON.parse(localStorage.getItem('user')!)
      this.bookMarkService.getBookmarkByID(this.currentUser!.id)
        .then(bookmark => {

          if (localStorage.getItem('pdfjs.history')) {
            this.bookMarkService.currentBookMarks = JSON.parse(localStorage.getItem('pdfjs.history')!)
          } else {
            if (bookmark.data()) {
              localStorage.setItem('pdfjs.history', JSON.stringify(bookmark.data()))
            }
          }
        });
    }
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  async getUser(email: string, password: string): Promise<User | any> {

    await this.login(email, password).
      then(response => {
        this.currentUser = { email: email, id: response.user.uid, fullName: '' }

        return this.getDataUser(response.user.uid)

      }).catch(error => { return error });

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
        favouritesBooks: docSnap.get('favouritesBooks') ?? [],
        finishedBooks: docSnap.get('finishedBooks') ?? []
      };

      localStorage.setItem('user', JSON.stringify(this.currentUser))

      return this.currentUser
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return undefined
    }
  }

  async updateUser() {
    localStorage.setItem('user', JSON.stringify(this.currentUser));

    return await setDoc(doc(this.firestore, "userData", this.currentUser!.id), {
      favouritesBooks: this.currentUser?.favouritesBooks,
      admin: this.currentUser?.admin,
      fullname: this.currentUser?.fullName,
      finishedBooks: this.currentUser?.finishedBooks
    });
  }

  async getUsuario() {
    let users: User[] = [];
    const citiesRef = collection(this.firestore, "userData");

    // Create a query against the collection.
    const q = query(citiesRef, where("admin", "==", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let jsonUser = doc.data() as User;

      let tempUser: User = { fullName: jsonUser.fullName, email: '', id: doc.id };
      users.push(tempUser);
    });
    return users
  }

  async getAllUsers() {
    let users: User[] = [];
    const bookRef = collection(this.firestore, 'userData')
    await getDocs(query(bookRef, where('admin', '!=', true))).then(Snapshot => Snapshot.forEach((doc) => {
      const tempUser = doc.data() as User
      tempUser.id = doc.id
      users.push(tempUser)
    })
    );
    console.log(users);
    
    return users
  }

  deleteUser(){
      //pasar usuario y borrar de store
      const auth = getAuth();

      // ID del usuario a borrar
      const userId = "xxxxxxxxxxxxx";
      
      /* getAuth()
      .deleteUser(uid)
      .then(() => {
        console.log('Successfully deleted user');
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      }); */
  }

  logout() {
    return signOut(this.auth);
  }
}
