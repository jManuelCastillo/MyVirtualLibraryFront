import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book } from '../interfaces/book.interface';
import { APIBook } from '../interfaces/apiBook.interface';
import {
  Firestore, addDoc, collection, collectionData,
  getCountFromServer,
  getDoc, setDoc,
  getDocs, query, updateDoc, where,
} from '@angular/fire/firestore';
import { doc, deleteDoc, } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})

export class LibraryService {


  currentPdf!: string;
  currentPdfId!: string;

  constructor(private http: HttpClient, private firestore: Firestore) { }

  private apiTitleBooksUrl: string = "https://openlibrary.org/api/books?bibkeys=title:";

  async deleteBook(id: string) {
    const bookRef = doc(this.firestore, `books/${id}`);
    await deleteDoc(bookRef);
  }

  async deleteFileBook(pathBooks: string[]) {

    const storage = getStorage();
    pathBooks.map(path => {

      const bookRef = ref(storage, path);
      // Delete the file
      deleteObject(bookRef).then((d) => {
        // File deleted successfully
        console.log(d);
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });

    })

  }

  async bookByAuthor(author: string) {
    const citiesRef = collection(this.firestore, "books");
    return await getDocs(query(citiesRef, where("author", "==", author)));
  }

  updateBook(book: Book) {
    const bookRef = doc(this.firestore, `books/${book.id}`)
    this.updateSuggestionBook(book)
    return updateDoc(bookRef, {
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      description: book.description,
      ISBN: book.ISBN,
      numberOfBooks: book.numberOfBooks,
      publish_date: book.publish_date,
      genre: book.genre,
      files: book.files,
      image: book.image,
      authorImage: book.authorImage,
      pages: book.pages,
      physicalBook: book.physicalBook,
      isAvailable: book.isAvailable,
      isNotAvailableReason: book.isNotAvailableReason
    })
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
    return await getDocs(query(bookRef, where('genre', 'array-contains-any', ['Ciencia Ficción', 'Sci-Fi'])));
  }

  async getRomanticBooks() {
    const bookRef = collection(this.firestore, 'books')
    return await getDocs(query(bookRef, where('genre', 'array-contains-any', ['Romántico', 'Romantic'])));
  }

  async getClassicBooks() {
    const bookRef = collection(this.firestore, 'books')
    return await getDocs(query(bookRef, where('genre', 'array-contains-any', ['Clásicos', 'Classic'])));
  }

  async getAllBooks() {

    let books: Book[] = [];
    const userRef = collection(this.firestore, 'books')
    await getDocs(userRef).then(Snapshot => Snapshot.forEach((doc) => {
      const tempBook = doc.data() as Book
      books.push(tempBook)
    })
    );
    return books
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

  async getNumberOfBooks() {
    const coll = collection(this.firestore, "books");
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count
  }

  async getNumberOfPhysicalBooks() {
    const coll = collection(this.firestore, "books");
    const q = query(coll, where("physicalBook", "==", true));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count
  }

  async getNumberOfDigitalBooks() {
    const coll = collection(this.firestore, "books");
    const q = query(coll, where("files", "!=", []));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count
  }

  async bookExist(title:string){
     const bookRef = collection(this.firestore, "books");
    return await getDocs(query(bookRef,  where("title", "==", title)));
  }

  async getNumberOfFinisedBooks() {
    let total = 0;
    const querySnapshot = await getDocs(collection(this.firestore, "userData"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const userData = doc.data();
      total += userData['finishedBooks'].length
    });
    return total
  }

  async postBookSuggestions(book: Book) {
    return await setDoc(doc(this.firestore, "booksSugestions", book.id),
      {
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        description: book.description,
        ISBN: book.ISBN,
        numberOfBooks: book.numberOfBooks,
        publish_date: book.publish_date,
        genre: book.genre,
        files: book.files,
        image: book.image,
        authorImage: book.authorImage,
        pages: book.pages,
        physicalBook: book.physicalBook,
        isAvailable: book.isAvailable,
        isNotAvailableReason: book.isNotAvailableReason
      });
  }

  getAllBooksSuggestions(): Observable<Book[]> {
    const bookRef = collection(this.firestore, 'booksSugestions')
    return collectionData(bookRef, { idField: 'id' }) as Observable<Book[]>;

  }

  async deleteBookSuggestions(id: string) {
    const bookRef = doc(this.firestore, `booksSugestions/${id}`);
    await deleteDoc(bookRef);
  }

  updateSuggestionBook(book: Book) {
    
    const bookRef = doc(this.firestore, `booksSugestions/${book.id}`)
    return updateDoc(bookRef, {
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      description: book.description,
      ISBN: book.ISBN,
      numberOfBooks: book.numberOfBooks,
      publish_date: book.publish_date,
      genre: book.genre,
      files: book.files,
      image: book.image,
      authorImage: book.authorImage,
      pages: book.pages,
      physicalBook: book.physicalBook,
      isAvailable: book.isAvailable,
      isNotAvailableReason: book.isNotAvailableReason
    })

  }

}