import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { APIBook, Data } from '../../interfaces/apiBook.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  providers: [MessageService]
})
export class ManageComponent implements OnInit {

  genresInput!: string[]
  uploadedFiles: any[] = [];
  data!: Data;
  foundBooks: APIBook = { data: this.data };
  searchItems: MenuItem[] = [];
  selectFilter: string = 'Título';
  filter: string = 'title';
  showSearch: boolean = false;
  filteredBooks: Book[] = [];
  optionsItems: MenuItem[] = [];
  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>


  bookForm: FormGroup = this.formBuilder.group({
    titleInput: [, [Validators.required, Validators.minLength(1), Validators.max(40)]],
    autorInput: [],
    genreInput: [this.formBuilder.array([])],
    booksNumberInput: [[], [Validators.required, Validators.min(1)]],
    publishDateInput: [],
    pagesNumberInput: [, [Validators.required, Validators.min(1)]],
    imageInput: [],
    publisherInput: [],
    ISBNInput: [],
    /* publisherInput: new FormControl('Alma'), */

  })


  ngOnInit(): void {
    this.bookForm.reset({
      titleInput: '',
      autorInput: '',
      
      booksNumberInput: 1,
      publishDateInput: '',
      pagesNumberInput: 1,
      imageInput: '',
      publisherInput: '',
      ISBNInput: ''
    })
  }

  validField(field: string) {
    return this.bookForm.controls[field].errors &&
      this.bookForm.controls[field].touched
  }

  constructor(private libraryService: LibraryService,
    private formBuilder: FormBuilder,
    private messageService: MessageService) {


    this.genresInput = [];

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

  }

  saveBook() {

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }
    console.log(this.bookForm.value);
    this.bookForm.reset({
      titleInput: '',
      autorInput: '',
      genreInput: 'asx',
      booksNumberInput: 1,
      publishDateInput: '',
      pagesNumberInput: 1,
      imageInput: '',
      publisherInput: '',
      ISBNInput: '',
    });
  }

  setGenre(event: { genre: string }) {
  }

  onUpload(event: { files: any; }) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  changeFilter(filter: string) {
    this.filter = filter;
  }

  searchFilter() {

    this.libraryService.getBookFromApi().subscribe((response) => {

      let dataBook: Data | undefined;

      dataBook = Object.values(response)[0]

      this.foundBooks.data = dataBook!

    })

    /*  console.log(this.filter);
     if (this.inputSearch.nativeElement.value != '') {
         this.showSearch = true
         if (this.filter == 'title') {
             this.filteredBooks = this.foundBooks.filter(book => book.title.toLocaleLowerCase().includes(this.inputSearch.nativeElement.value.toLocaleLowerCase()));
             console.log(this.filteredBooks.length);
   
         }
         if (this.filter == 'author') {
             console.log("entra en author");
             console.log(this.inputSearch.nativeElement.value);
             this.filteredBooks = this.foundBooks.filter(book => book.author.toLocaleLowerCase().includes(this.inputSearch.nativeElement.value.toLocaleLowerCase()));
         }
         if (this.filter == 'authorTitle') {
             this.filteredBooks = this.foundBooks.filter(book => (book.title.includes(this.inputSearch.nativeElement.value) && book.author.includes(this.inputSearch.nativeElement.value)));
         }
     } else {
      this.showSearch = false;
     } */
  }

  search(severity: string) {
  }

}
