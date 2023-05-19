import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  signInWithPopup, GoogleAuthProvider, getAuth, deleteUser, User, user,
} from '@angular/fire/auth';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoginComponent } from '../components/login/login.component';
import { doc, setDoc, getDoc, Firestore, deleteDoc } from '@angular/fire/firestore';
import { UserIt } from '../interfaces/user.interface';
import { Observable, of } from 'rxjs';
import { BookmarkService } from './bookmark.service';
import { collection, query, where, getDocs, } from "firebase/firestore";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    private auth: Auth, private dialogService: DialogService, private firestore: Firestore,
    private bookMarkService: BookmarkService, private http: HttpClient

  ) { }

  ref!: DynamicDialogRef;
  currentUser: UserIt | undefined;

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
      { fullName: name, email: email, favouritesBooks: [], admin: false, finishedBooks: [] });
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

  async getUser(email: string, password: string): Promise<UserIt | any> {

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

  async getDataUser(uid: string): Promise<UserIt | undefined> {
    const dataUserRef = doc(this.firestore, "userData", uid);
    const docSnap = await getDoc(dataUserRef);

    if (docSnap.exists()) {
      this.currentUser = {
        ...this.currentUser!,
        fullName: docSnap.get('fullName'),
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

  async updateUser(user?: UserIt) {

    if (user === undefined) {
      //when I want to update a curret user
      localStorage.setItem('user', JSON.stringify(this.currentUser));

      return await setDoc(doc(this.firestore, "userData", this.currentUser!.id), {
        email: this.currentUser?.email,
        favouritesBooks: this.currentUser?.favouritesBooks,
        admin: this.currentUser?.admin,
        fullName: this.currentUser?.fullName,
        finishedBooks: this.currentUser?.finishedBooks
      });
    } else {
      //we use this function to update the users as admin

      return await setDoc(doc(this.firestore, "userData", user!.id), {
        email: user.email,
        favouritesBooks: user.favouritesBooks,
        admin: user.admin,
        fullName: user.fullName,
        finishedBooks: user.finishedBooks
      });
    }
  }

  async getUsuario() {
    let users: UserIt[] = [];
    const citiesRef = collection(this.firestore, "userData");

    // Create a query against the collection.
    const q = query(citiesRef, where("admin", "==", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let jsonUser = doc.data() as UserIt;

      let tempUser: UserIt = { fullName: jsonUser.fullName, email: '', id: doc.id };
      users.push(tempUser);
    });
    return users
  }

  async getAllUsers() {
    let users: UserIt[] = [];
    const userRef = collection(this.firestore, 'userData')
    await getDocs(userRef).then(Snapshot => Snapshot.forEach((doc) => {
      const tempUser = doc.data() as UserIt
      tempUser.id = doc.id

      users.push(tempUser)
    })
    );

    return users
  }

  async letAdmin(userId: string, isAdmin: boolean) {
    await setDoc(doc(this.firestore, "userData", userId), {
      admin: !isAdmin,
    });
  }


  async deleteUser(uid: string) {

    this.http.get(`http://localhost:3000/delete-user/${uid}`).subscribe((response) => {
      console.log(response);
    })

    const userDataRef = doc(this.firestore, `userData/${uid}`);
    deleteDoc(userDataRef).then(()=>{
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
