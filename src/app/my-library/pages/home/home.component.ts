import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService, } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { FormBuilder, FormControl } from '@angular/forms';

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
    providers: [DialogService, MessageService]
})
export class HomeComponent implements OnDestroy, OnInit {
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


    constructor(private libraryService: LibraryService, private formBuilder: FormBuilder,
        public dialogService: DialogService, public messageService: MessageService,
        private storage: Storage, private userService: UserService, private router: Router) {

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


    }


    showInfo(id: string) {
        this.router.navigate(['/bookinfo', id]);
    }

    favButton(idBook: string) {
        if (this.userService.currentUser?.favouritesBooks?.indexOf(idBook) === -1) {
            this.userService.currentUser?.favouritesBooks?.push(idBook)
            console.log(this.userService.currentUser);

            // localStorage.setItem('user', JSON.stringify(this.currentUser));
        } else {
            const index = this.userService.currentUser?.favouritesBooks?.findIndex(id => id === idBook);
            this.userService.currentUser?.favouritesBooks?.splice(index!, 1);
            this.currentUser?.favouritesBooks?.splice(index!, 1);
        }
    }

    deleteBook(id: string) {

        this.libraryService.deleteBook(id);

        const index = this.filteredBooks.findIndex(book => book.id === id);
        this.filteredBooks.splice(index, 1);

    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }

    async showPdf(route: string, title: string) {
    

        const bookRef =  ref(this.storage, route);
        await getDownloadURL(bookRef).then(urlBook => {
            this.libraryService.currentPdf = urlBook;
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
            console.log(this.inputSearch.value);
            this.showSearch = true
            if (this.filter == 'title') {
                this.filteredBooks = this.bookList.flat().filter(book => book.title.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
                console.log(this.filteredBooks.length);
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

}