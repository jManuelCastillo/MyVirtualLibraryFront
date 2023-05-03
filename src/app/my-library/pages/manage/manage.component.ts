import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { APIBook, Data } from '../../interfaces/apiBook.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  providers: [MessageService, TitleCasePipe,],

})
export class ManageComponent {

  activeIndex!: number;
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
  inputSearch: FormControl = this.formBuilder.control('')


  bookForm: FormGroup = this.formBuilder.group({
    titleInput: [, [Validators.required, Validators.maxLength(40)]],
    autorInput: [,Validators.maxLength(60)],
    genreInput: [['Fantasía'], Validators.required],
    booksNumberInput: [[], [Validators.required, Validators.min(1)]],
    publishDateInput: [],
    pagesNumberInput: [, [Validators.required, Validators.min(1)]],
    imageInput: [],
    imageAuthorInput: [],
    publisherInput: [, Validators.maxLength(60)],
    ISBNInput: [, Validators.maxLength(15)],
    descriptionInput: [, [Validators.minLength(0), Validators.maxLength(200)]],

  })


  ngOnInit(): void {
    this.activeIndex = 0
    this.bookForm.reset({
      titleInput: '',
      autorInput: '',
      genreInput: ['Fantasía'],
      booksNumberInput: 1,
      publishDateInput: '',
      pagesNumberInput: 1,
      imageInput: '',
      imageAuthorInput: '',
      publisherInput: '',
      ISBNInput: '',
      descriptionInput: ''
    })
  }

  validField(field: string) {
    return this.bookForm.controls[field].errors &&
      this.bookForm.controls[field].touched
  }

  constructor(private libraryService: LibraryService, private formBuilder: FormBuilder,
    private titlecasePipe: TitleCasePipe, private messageService: MessageService, private storage: Storage) {
    this.genresInput = [];
    this.uploadedFiles = []
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

  handleFileInput(files: FileList) {
    files.item(0);
  }

  async saveBook() {

    if (this.bookForm.invalid || this.uploadedFiles.length == 0) {
      this.bookForm.markAllAsTouched();
      return;
    }

    let newBook: Book = {
      id: '',
      title: this.bookForm.value.titleInput,
      author: this.bookForm.value.autorInput,
      publisher: this.bookForm.value.publisherInput,
      description: this.bookForm.value.descriptionInput,
      ISBN: this.bookForm.value.ISBNInput,
      numberOfBooks: this.bookForm.value.booksNumberInput,
      publish_date: "",
      genre: this.bookForm.value.genreInput,
      files: [],
      image: this.bookForm.value.imageInput,
      authorImage: this.bookForm.value.imageAuthorInput,
      pages: this.bookForm.value.pagesNumberInput,
      taken: false
    }

    this.uploadedFiles.map(file => {
      const filesRef = ref(this.storage, `BooksFiles/${file.name}`)

      uploadBytes(filesRef, file)
        .then(response => { console.log(response) })
        .catch(error => console.log(error));

      console.log(filesRef);

      newBook.files.push({
        format: file.name.split('.').slice(1),
        route: `BooksFiles/${file.name}`
      });
    })

    const book = await this.libraryService.postBook(newBook);
    // enviado datos al storage
    console.log(book);





    this.uploadedFiles = []
    this.bookForm.reset({
      titleInput: '',
      autorInput: '',
      genreInput: ['Fantasía'],
      booksNumberInput: 1,
      publishDateInput: '',
      pagesNumberInput: 1,
      imageInput: '',
      publisherInput: '',
      ISBNInput: '',
      descriptionInput: '',
      fileInput: []
    });
  }

  onUpload(event: any) {
    this.uploadedFiles = []

    for (let file of event.files) {

      if (!this.uploadedFiles.some((upFile) => {
        return upFile.type === file.type
      })) {

        this.uploadedFiles.push(file);

      } else {
        this.messageService.add({ severity: 'warn', summary: 'No se pueden repetir archivos con el mismo formato', detail: '' });
      }
    }

    if (this.uploadedFiles.length > 1) {
      this.messageService.add({ severity: 'info', summary: 'Archivos añadidos', detail: '' });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Archivo añadido', detail: '' });
    }

  }

  changeFilter(filter: string) {
    this.filter = filter;
  }

  getBookData() {

    this.bookForm.reset({
      titleInput: this.foundBooks?.data?.title ?? '',
      autorInput: this.foundBooks?.data?.authors[0]?.name ?? '',
      genreInput: (this.foundBooks?.data?.subjects?.length > 5) ? this.foundBooks?.data?.subjects?.slice(0, 5)?.map(subj => subj.name) : this.foundBooks?.data?.subjects?.map(subj => subj.name) ?? [],
      booksNumberInput: 1,
      publishDateInput: this.foundBooks?.data?.publish_date ?? '',
      pagesNumberInput: this.foundBooks?.data?.number_of_pages ?? 1,
      imageInput: this.foundBooks?.data?.cover?.large ?? '',
      imageAuthorInput: this.foundBooks?.data?.subject_people?.[0]?.url ?? '',
      publisherInput: this.foundBooks?.data?.publishers?.[0]?.name ?? '',
      ISBNInput: (this.foundBooks?.data?.identifiers?.isbn_10 && this.foundBooks.data.identifiers.isbn_10[0])
        ?? (this.foundBooks?.data?.identifiers?.openlibrary && this.foundBooks.data.identifiers.openlibrary[0])
        ?? (this.foundBooks?.data?.identifiers?.isbn_13 && this.foundBooks.data.identifiers.isbn_13[0])
        ?? '',
      descriptionInput: this.foundBooks?.data?.excerpts?.[0]?.text ?? ''
    })

    this.activeIndex = 0;


  }

  searchFilter() {
    let dataBook: Data | undefined;
    if (this.inputSearch.value) {
      this.activeIndex = 1
      this.libraryService.getBookFromApi(this.titlecasePipe.transform(this.inputSearch.value)).subscribe((response) => {
        dataBook = Object.values(response)[0]
        this.foundBooks.data = dataBook!
      })
    } else {
      this.foundBooks.data = dataBook!;
    }
  }

  search(severity: string) {
  }

}
