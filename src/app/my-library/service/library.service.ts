import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book } from '../interfaces/book.interface';
import { APIBook } from '../interfaces/apiBook.interface';
import {
  Firestore, addDoc, collection, collectionData,
  getDoc,
  getDocs, query, where
} from '@angular/fire/firestore';
import { doc, deleteDoc } from "firebase/firestore";
import { ref } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})

export class LibraryService {


  currentPdf!: string;
  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) { }

  private apiTitleBooksUrl: string = "https://openlibrary.org/api/books?bibkeys=title:";


  async deleteBook(id: string) {
    const bookRef = doc(this.firestore, `books/${id}`);
    await deleteDoc(bookRef);
  }

  async BookByAuthor(author: string) {
    const citiesRef = collection(this.firestore, "books");

    return await getDocs(query(citiesRef, where("author", "==", author)));

  }

  postBook(tempBook: Book) {
    const bookRef = collection(this.firestore, 'books');
    return addDoc(bookRef, tempBook);
  }

  async getFantasyBooks() {
    const bookRef = collection(this.firestore, 'books')
    return await getDocs(query(bookRef, where('genre', 'array-contains-any', ['Fantasía', 'Fantasy'])));
  }

  async getSciFiBooks() {
    const bookRef = collection(this.firestore, 'books')
    return await getDocs(query(bookRef, where('genre', 'array-contains-any', ['Ciencia Ficción'])));
  }

  async getRomanticBooks() {
    const bookRef = collection(this.firestore, 'books')
    return await getDocs(query(bookRef, where('genre', 'array-contains-any', ['Romántico', 'Romantic'])));
  }

  async getBookByID(id: string) {
    const bookRef = doc(this.firestore, 'books', id);
    return await getDoc(bookRef)
  }

  getMyBooks(): Observable<Book[]> {
    const bookRef = collection(this.firestore, 'books')
    return collectionData(bookRef, { idField: 'id' }) as Observable<Book[]>;
  }

  getBookFromApi(title: string): Observable<APIBook> {
    return this.http.get<APIBook>(`${this.apiTitleBooksUrl}${title}&jscmd=data&format=json`);
  }

}