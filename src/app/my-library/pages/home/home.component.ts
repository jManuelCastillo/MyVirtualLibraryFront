import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interface/book.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    showSearch: boolean = false;
    bookList: Book[] = this.libraryService.bookListService
    searchItems: MenuItem[] = [];
    filteredBooks: Book[] = [];
    optionsItems: MenuItem[] = [];
    @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>
    selectFilter: string = 'Título';
    filter: string = 'title';


    constructor(private libraryService: LibraryService) {

        this.searchItems = [
            {
                label: 'Título',
                command: () => {
                    this.selectFilter = 'Título',
                        this.changeFilter('title');
                    this.searchFilter()
                }
            },
            {
                label: 'Autor',
                command: () => {
                    this.selectFilter = 'Autor'
                    this.changeFilter('author');
                    this.searchFilter()
                }
            },
            {
                label: 'Titulo/autor', command: () => {
                    this.selectFilter = 'Titulo/Autor'
                    this.changeFilter('authorTitle');
                    this.searchFilter()
                }
            }
        ];

        this.optionsItems = [
            {
                label: 'Libro',
                command: () => {
                    this.selectFilter = 'Libro',
                        this.searchByBookAuthor();
                }
            },
            {
                label: 'Autor',
                command: () => {
                    this.selectFilter = 'Autor'
                    this.searchByAuthor();
                }
            },
            {
                label: 'Libro/autor', command: () => {
                    this.selectFilter = 'Libro/Autor'
                    this.searchByAuthor();
                }
            }
        ];
    }

    changeFilter(filter: string) {
        this.filter = filter;
    }

    searchFilter() {


        console.log(this.filter);
        if (this.inputSearch.nativeElement.value != '') {
            this.showSearch = true
            if (this.filter == 'title') {
                this.filteredBooks = this.bookList.filter(book => book.title.toLocaleLowerCase().includes(this.inputSearch.nativeElement.value.toLocaleLowerCase()));
                console.log(this.filteredBooks.length);

            }
            if (this.filter == 'author') {
                console.log("entra en author");
                console.log(this.inputSearch.nativeElement.value);
                this.filteredBooks = this.bookList.filter(book => book.author.toLocaleLowerCase().includes(this.inputSearch.nativeElement.value.toLocaleLowerCase()));
            }
            if (this.filter == 'authorTitle') {
                this.filteredBooks = this.bookList.filter(book => (book.title.includes(this.inputSearch.nativeElement.value) && book.author.includes(this.inputSearch.nativeElement.value)));
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

}