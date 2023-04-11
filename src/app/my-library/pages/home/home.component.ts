import { Component, OnDestroy } from '@angular/core';
import { MenuItem, MessageService, } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExamplePdfViewerComponent } from '../../components/example-pdf-viewer/example-pdf-viewer.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [DialogService, MessageService]
})
export class HomeComponent implements OnDestroy{

    showSearch: boolean = false;
    bookList: Book[] = this.libraryService.bookListService
    searchItems: MenuItem[] = [];
    filteredBooks: Book[] = [];
    optionsItems: MenuItem[] = [];
    inputSearch: FormControl = this.formBuilder.control('')
    selectFilter: string = 'Título';
    filter: string = 'title';
    fileInput: any;
    ref!: DynamicDialogRef ;

    constructor(private libraryService: LibraryService, private formBuilder: FormBuilder,
        private pdfService: NgxExtendedPdfViewerService, public dialogService: DialogService, public messageService: MessageService) {

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
        pdfDefaultOptions.assetsFolder = 'bleeding-edge';
        pdfDefaultOptions.doubleTapZoomFactor = '150%'; // The default value is '200%'
        pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5; // The default value is 4096 * 4096 pixels,
    }
    
    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }

      show() {
        this.ref = this.dialogService.open(ExamplePdfViewerComponent, {
            header: 'Mira un pdf',
            width: '70%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true
        });
    }

    changeFilter(filter: string) {
        this.filter = filter;
    }

   

    searchFilter() {


        if (this.inputSearch.value != '') {
            console.log(this.inputSearch.value);
            this.showSearch = true
            if (this.filter == 'title') {
                this.filteredBooks = this.bookList.filter(book => book.title.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
                console.log(this.filteredBooks.length);

            }
            if (this.filter == 'author') {
                console.log("entra en author");
                console.log(this.inputSearch);
                this.filteredBooks = this.bookList.filter(book => book.author.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
            }
            if (this.filter == 'authorTitle') {
                this.filteredBooks = this.bookList.filter(book => (book.title.includes(this.inputSearch.value) && book.author.includes(this.inputSearch.value)));
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