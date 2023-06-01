import { Component } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService, } from 'primeng/api';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { BookmarkService } from '../../service/bookmark.service';
import { UserService } from '../../service/user.service';
import { UserIt } from '../../interfaces/user.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';


@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class BookInfoComponent {

  currentBook!: Book;
  ref!: DynamicDialogRef;
  authorBooks: Book[] = []
  target!: EventTarget;
  currentUser!: UserIt;
  visible: boolean = false;
  visible2: boolean = false;
  usersForHelp: UserIt[] = [];
  tempBook?: Book;
  selectedUser?: UserIt;
  bookForm: FormGroup = this.formBuilder.group({
    searchUser: ['',],
  })
  numberOfBooks: string;
  showModifySuggestion: boolean = false;
  showfinishedBookWindow: boolean = false;
  showRemovefinishedBookWindow: boolean = false;


  constructor(private libraryService: LibraryService, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router, public dialogService: DialogService, private userService: UserService,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    private storage: Storage,
  ) {
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.libraryService.getBookByID(params['id'])
        .then(book => {
          this.currentBook = book.data() as Book;
          this.currentBook.id = book.id

          switch (this.currentBook.numberOfBooks) {
            case 1: this.numberOfBooks = 'Un solo libro'
              break;
            case 2: this.numberOfBooks = 'dilogía'
              break;
            case 3: this.numberOfBooks = 'trilogía'
              break;
            default: this.numberOfBooks = 'saga'
          }

          this.authorBooks = []
          this.libraryService.bookByAuthor(this.currentBook.author).then(Snapshot => Snapshot.forEach((doc) => {
            this.authorBooks.push(doc.data() as Book)
          })).catch(error => console.log(error)
          )
        }
        )
        .catch(error => console.log(error))
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  async showPdf(route: string, title: string, id: string) {

    const bookRef = ref(this.storage, route);
    await getDownloadURL(bookRef).then(urlBook => {

      this.libraryService.currentPdf = urlBook;
      this.libraryService.currentPdfId = id;
      this.ref = this.dialogService.open(PdfViewerComponent, {
        header: title,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true
      });
    })

  }

  updateBook(id: string) {
    this.router.navigate(['/updateBook', id]);
  }

  async uploadBook(path: string) {
    const bookRef = ref(this.storage, path);
    await getDownloadURL(bookRef).then(urlBook => {
      window.location.href = urlBook
    })
  }

  async deleteBook(event: Event, id: string, fileList: any[]) {
    let tempUsers: UserIt[] = await this.userService.getAllUsers();
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Seguro que quieres borrar el libro?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.libraryService.deleteBook(id);
        this.libraryService.deleteFileBook(fileList.map(file => file.route));
        this.libraryService.deleteBookSuggestions(id)
        tempUsers.forEach(user => {
          if (user.id != this.currentUser.id) {
            user.favouritesBooks = user.favouritesBooks.filter(
              (book) => book.idBook !== id
            );

            // Elimina los elementos con idBook coincidente de finishedBooks
            user.finishedBooks = user.finishedBooks.filter(
              (book) => book.idBook !== id
            );

            this.userService.updateUser(user)
          } else {

            this.userService.currentUser.favouritesBooks = this.userService.currentUser.favouritesBooks.filter(
              (book) => book.idBook !== id
            );

            // Elimina los elementos con idBook coincidente de finishedBooks
            this.userService.currentUser.finishedBooks = this.userService.currentUser.finishedBooks.filter(
              (book) => book.idBook !== id
            );

            this.userService.updateUser()
          }
        });
        this.router.navigate(['/home']);
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Libro borrado' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la acción' });
      }
    });



  }


  selectAsFinishedForUser(user: UserIt, book: Book) {

    user?.finishedBooks?.push({ idBook: book.id, title: book.title })
    this.userService.updateUser(user)
    let name = user.fullName;
    this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Marcado como finalizado para ' + name });
    this.showfinishedBookWindow = false
  }

  deselectAsFinishedForUser(user: UserIt, book: Book) {
    const index = user.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === book.id);

    user.finishedBooks?.splice(index!, 1);

    this.userService.updateUser(user)
    let name = user.fullName;
    this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Desmarcar como finalizado para ' + name });
    this.showRemovefinishedBookWindow = false;
  }

  async showfinishedBook(book: Book) {
    this.showfinishedBookWindow = true;
    const users = await this.userService.getAllUsers();

    this.usersForHelp = users.filter(user =>
      !user.finishedBooks || !user.finishedBooks.some(finishedBook => finishedBook.idBook === book.id)
    );
    this.tempBook = book
  }

  async showRemovefinishedBook(book: Book) {
    this.showRemovefinishedBookWindow = true;
    const users = await this.userService.getAllUsers();
    this.usersForHelp = users.filter(user =>
      user.finishedBooks && user.finishedBooks.some(finishedBook => finishedBook.idBook === book.id)
    );
    this.tempBook = book
  }

  showInfo(id: string) {
    this.router.navigate(['/bookinfo', id]);
  }


  async showWithdrawBook(book: Book) {
    this.visible = true;
    this.usersForHelp = await this.userService.getUsuario()
    this.tempBook = book
  }

  async showReturnBook(book: Book) {
    this.visible2 = true;
    this.tempBook = book
  }

  isFav(idBook: string) {
    this.currentUser = JSON.parse(localStorage.getItem('user')!)
    return this.currentUser != null && this.currentUser!.favouritesBooks != undefined && this.currentUser?.favouritesBooks?.some(favBook => favBook.idBook == idBook)
  }

  favButton(idBook: string, title: string) {

    this.currentUser = this.userService.currentUser;
    if (this.currentUser?.favouritesBooks?.findIndex(favBook => favBook.idBook === idBook) === -1) {
      this.userService.currentUser?.favouritesBooks?.push({ idBook, title })
    } else {
      const index = this.userService.currentUser?.favouritesBooks?.findIndex(favBook => favBook.idBook === idBook);
      this.userService.currentUser?.favouritesBooks?.splice(index!, 1);
      this.currentUser?.favouritesBooks?.splice(index!, 1);
    }
    this.userService.updateUser()
  }

  finisedButton(idBook: string, title: string) {

    this.currentUser = this.userService.currentUser;

    if (this.currentUser?.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === idBook) === -1) {
      this.userService.currentUser?.finishedBooks?.push({ idBook, title })

    } else {
      const index = this.userService.currentUser?.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === idBook);
      this.userService.currentUser?.finishedBooks?.splice(index!, 1);
      this.currentUser?.finishedBooks?.splice(index!, 1);
    }

    this.userService.updateUser()
  }

  isFinised(idBook: string) {
    this.currentUser = JSON.parse(localStorage.getItem('user')!)
    return this.currentUser != null && this.currentUser!.finishedBooks != undefined && this.currentUser?.finishedBooks?.some(finishedBook => finishedBook.idBook == idBook)
  }

  withdrawABook(book: Book) {
    this.currentUser = JSON.parse(localStorage.getItem('user')!)

    if (book.isAvailable) {
      book.isAvailable = false;
      book.isNotAvailableReason = { name: this.currentUser!.fullName, id: this.currentUser!.id }
      this.libraryService.updateBook(book)

    } else {
      book.isAvailable = true;
      book.isNotAvailableReason = { name: '', id: '' },
        this.libraryService.updateBook(book)
    }

  }

  returnBookForUser(book: Book) {
    book.isAvailable = true;
    book.isNotAvailableReason = { name: '', id: '' }
    this.libraryService.updateBook(book);
    this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Libro devuelto` });
    this.visible2 = false
  }

  withdrawForUser(name: string, id: string, book: Book) {
    book.isAvailable = false;
    book.isNotAvailableReason = { name: name, id: id }
    this.libraryService.updateBook(book);

    this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Libro retirado el libro` });
    this.visible = false
  }

  cancel() {
    this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Acción cancelada' });
    this.visible = false
    this.visible2 = false;
  }


}
