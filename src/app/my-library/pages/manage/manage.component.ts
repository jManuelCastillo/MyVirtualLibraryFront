import { Component } from '@angular/core';

import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { APIBook, Data } from '../../interfaces/apiBook.interface';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  providers: [MessageService, TitleCasePipe, ConfirmationService,],

})
export class ManageComponent {

  numberOfFinishedBooks?: number;
  numberOfDigitalBooks?: number;
  numberOfphysicalBooks?: number;
  numOfBooks?: number;
  stateOptions: any[] = [{ label: 'No', value: 'false' }, { label: 'Si', value: 'true' }];
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
  inputSearch: FormControl = this.formBuilder.control('');
  users: User[] = []


  constructor(private libraryService: LibraryService, private formBuilder: FormBuilder, 
    private confirmationService: ConfirmationService, private usersService: UserService,
    private titlecasePipe: TitleCasePipe, private messageService: MessageService, 
    private storage: Storage) {
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

  bookForm: FormGroup = this.formBuilder.group({
    titleInput: [, [Validators.required, Validators.maxLength(100)]],
    autorInput: [, Validators.maxLength(60)],
    genreInput: [['Fantasía'], Validators.required],
    booksNumberInput: [[], [Validators.required, Validators.min(1)]],
    publishDateInput: [],
    pagesNumberInput: [, [Validators.required, Validators.min(1)]],
    imageInput: [],
    imageAuthorInput: [],
    publisherInput: [, Validators.maxLength(60)],
    ISBNInput: [, Validators.maxLength(15)],
    descriptionInput: [, [Validators.minLength(0), Validators.maxLength(200)]],
    physBooknput: ['false']
  })


  async ngOnInit() {
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
      descriptionInput: '',
      physBooknput: 'false'
    })

    this.numOfBooks = await this.libraryService.getNumberOfBooks()

    this.numberOfphysicalBooks = await this.libraryService.getNumberOfPhysicalBooks()

    this.numberOfDigitalBooks = await this.libraryService.getNumberOfDigitalBooks()
    
    this.numberOfFinishedBooks = await this.libraryService.getNumberOfFinisedBooks()

    this.users = await this.usersService.getAllUsers()
  }

  validField(field: string) {
    return this.bookForm.controls[field].errors &&
      this.bookForm.controls[field].touched
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
      physicalBook: (this.bookForm.value.physBooknput == 'true') ? true : false,
      isAvailable: (this.bookForm.value.physBooknput == 'true') ? true : false,
      isNotAvailableReason: {name: '', id:''}
    }

    this.uploadedFiles.map(file => {
      const filesRef = ref(this.storage, `BooksFiles/${file.name}`)

      uploadBytes(filesRef, file)
        .then(response => { console.log(response) })
        .catch(error => console.log(error));

      newBook.files.push({
        format: file.name.split('.').slice(1),
        route: `BooksFiles/${file.name}`
      });
    })

    const book = await this.libraryService.postBook(newBook);
    // enviado datos al storage

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
      fileInput: [],
      physBooknput: 'false',
      isAvailable: 'false',
      isNotAvailableReason: {name: '', id:''}
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
      descriptionInput: this.foundBooks?.data?.excerpts?.[0]?.text ?? '',
      physBooknput: 'false',
      isAvailable: false,
      isNotAvailableReason: {name: '', id:''}
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

  confirm(event: Event, idUser: string) {
    this.confirmationService.confirm({
        target: event.target!,
        message: '¿Estás seguro de que quieres borrar este usuario?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Has borrar este usuario correctamente =(' });
        },
        reject: () => {
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Has cancelado la acción' });
        }
    });
}

}
