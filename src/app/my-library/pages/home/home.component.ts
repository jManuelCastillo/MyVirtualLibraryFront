import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { UserService } from '../../service/user.service';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [DialogService, MessageService, ConfirmationService]
})
export class HomeComponent implements OnDestroy, OnInit {
    tempBook?: Book;
    visible: boolean = false;
    visible2: boolean = false;
    selectedUser?: User;
    usersForHelp: User[] = [];
    items?: MenuItem[];
    showSearch: boolean = false;
    searchItems: MenuItem[] = [];
    filteredBooks: Book[] = [];
    optionsItems: MenuItem[] = [];
    inputSearch: FormControl = this.formBuilder.control('')
    selectFilter: string = 'Título';
    option: string = 'gestionar'
    filter: string = 'title';
    fileInput: any;
    ref!: DynamicDialogRef;
    bookList: Book[] = [];
    currentUser?: User;
    countries: any[] = [];
    selectedCountry?: string;


    bookForm: FormGroup = this.formBuilder.group({
        searchUser: ['', ],
      })


    constructor(private libraryService: LibraryService, private formBuilder: FormBuilder,
        public dialogService: DialogService, public messageService: MessageService,
        private storage: Storage, private userService: UserService, private router: Router,
        private confirmationService: ConfirmationService, private fb: FormBuilder ) {

        this.searchItems = [
            {
                label: 'Título',
                command: () => {
                    this.selectFilter = 'Título',
                        this.changeButton('title');
                    this.searchFilter()
                }
            },
            {
                label: 'Autor',
                command: () => {
                    this.selectFilter = 'Autor'
                    this.changeButton('author');
                    this.searchFilter()
                }
            },
            {
                label: 'Titulo/autor', command: () => {
                    this.selectFilter = 'Titulo/Autor'
                    this.changeButton('authorTitle');
                    this.searchFilter()
                }
            }
        ];

    }

    async uploadBook(path: string) {
        const bookRef = ref(this.storage, path);
        await getDownloadURL(bookRef).then(urlBook => {
            window.location.href = urlBook
        })
    }


    ngOnInit(): void {
        this.libraryService.getMyBooks().subscribe({
            next: books => this.bookList = books
        })
       
        this.currentUser = JSON.parse(localStorage.getItem('user')!)  as User
       
        
    }

    
    showInfo(id: string) {
        this.router.navigate(['/bookinfo', id]);
    }

    deleteBook(id: string, fileList: any[]) {

        this.libraryService.deleteBook(id);
        this.libraryService.deleteFileBook(fileList.map(file => file.route));
        const index = this.filteredBooks.findIndex(book => book.id === id);
        this.filteredBooks.splice(index, 1);

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

    changeButton(filter: string) {
        this.filter = filter;
    }

    getBook(path: string) {
        const book = ref(this.storage)

    }

    searchFilter() {

        if (this.inputSearch.value != '') {
            this.showSearch = true
            if (this.filter == 'title') {
                this.filteredBooks = this.bookList.flat().filter(book => book.title.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
            }
            if (this.filter == 'author') {
                console.log("entra en author");
                console.log(this.inputSearch);
                this.filteredBooks = this.bookList.flat().filter(book => book.author.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
            }
            if (this.filter == 'authorTitle') {
                this.filteredBooks = this.bookList.flat().filter(book => (book.title.includes(this.inputSearch.value) && book.author.includes(this.inputSearch.value)));
            }
        } else {
            this.showSearch = false;
        }
    }

    options(severity: string) {

    }

    search(severity: string) {

    }

    searchByBookAuthor() {

    }

    searchByAuthor() {

    }

    updateBook(id: string) {
        this.router.navigate(['/updateBook', id]);
    }

    
    favButton(idBook: string, title: string) {

        this.currentUser = this.userService.currentUser;


        if (this.currentUser?.favouritesBooks?.findIndex(favBook => favBook.idBook === idBook) === -1) {
            this.userService.currentUser?.favouritesBooks?.push({idBook, title})

        } else {
            const index = this.userService.currentUser?.favouritesBooks?.findIndex(favBook => favBook.idBook === idBook);
            this.userService.currentUser?.favouritesBooks?.splice(index!, 1);
            this.currentUser?.favouritesBooks?.splice(index!, 1); 
        }
        
        this.userService.updateUser()
    }

    isFav(idBook: string ) {
        this.currentUser = JSON.parse(localStorage.getItem('user')!)
       return this.currentUser!.favouritesBooks != undefined && this.currentUser?.favouritesBooks?.some(favBook => favBook.idBook  == idBook)
    }

    finisedButton(idBook: string, title: string) {

        this.currentUser = this.userService.currentUser;

        if (this.currentUser?.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === idBook) === -1) {
            this.userService.currentUser?.finishedBooks?.push({idBook, title})

        } else {
            const index = this.userService.currentUser?.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === idBook);
            this.userService.currentUser?.finishedBooks?.splice(index!, 1);
            this.currentUser?.finishedBooks?.splice(index!, 1); 
        }
        
        this.userService.updateUser()
    }

    isFinised(idBook: string ) {
        this.currentUser = JSON.parse(localStorage.getItem('user')!)
       return this.currentUser!.finishedBooks != undefined && this.currentUser?.finishedBooks?.some(finishedBook => finishedBook.idBook  == idBook)
    }

    withdrawABook(book: Book){
        this.currentUser = JSON.parse(localStorage.getItem('user')!)

        if(book.isAvailable){
            book.isAvailable = false;
            book.isNotAvailableReason = {name: this.currentUser!.fullName, id: this.currentUser!.id}
            this.libraryService.updateBook(book)

        } else {
            book.isAvailable = true;
            book.isNotAvailableReason = {name: '', id: ''},
            this.libraryService.updateBook(book)
        }
        
    }

   async showWithdrawBook(book: Book) {
        this.visible = true;
        this.usersForHelp =  await this.userService.getUsuario()
        this.tempBook = book
    }

    async showReturnBook(book: Book) {
        this.visible2 = true;
        this.tempBook = book
    }

    returnBookForUser(book: Book){
        book.isAvailable = true;
        book.isNotAvailableReason = {name: '', id: ''}
        this.libraryService.updateBook(book);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Libro devuelto` });
        this.visible2 = false
    }

    withdrawForUser(name: string, id: string, book: Book){
        book.isAvailable = false;
        book.isNotAvailableReason = {name: name, id: id}
        this.libraryService.updateBook(book);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Libro retirado para ${{name}}` });
        this.visible = false
    }
    
    cancel(){
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Acción cancelada' });
        this.visible = false
        this.visible2 = false;
    }

}