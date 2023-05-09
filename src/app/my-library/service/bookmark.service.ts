import { Injectable } from '@angular/core';
import { Bookmark } from '../interfaces/bookmark.interface';
import { Firestore, setDoc, getDoc } from '@angular/fire/firestore';
import { doc, } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  constructor(private firestore: Firestore) { }
  currentBookMarks?: Bookmark;


  postBookmark(userId: string) {
    const pdfHistory = localStorage.getItem('pdfjs.history');
    const parsedHistory = JSON.parse(pdfHistory!);
    const files = parsedHistory.files;
    
    
    return setDoc(doc(this.firestore, "bookMarks", userId), {
      files: files
    });
  }

  async getBookmarkByID(id: string) {
    const bookRef = doc(this.firestore, 'bookMarks', id);
    return await getDoc(bookRef)
  }



}
