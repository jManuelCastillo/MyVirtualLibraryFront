import { Component } from '@angular/core';

import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { APIBook, Data } from '../../interfaces/apiBook.interface';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { UserService } from '../../service/user.service';
import { UserIt } from '../../interfaces/user.interface';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


interface Genre {
  id: number;
  title: string;
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  providers: [MessageService, TitleCasePipe, ConfirmationService,],

})


export class ManageComponent {
  emailExist: boolean = false;
  showRegister: boolean = false;
  numberOfFinishedBooks?: number;
  numberOfDigitalBooks?: number;
  numberOfphysicalBooks?: number;
  numOfBooks?: number;
  stateOptions: any[] = [{ label: 'No', value: 'false' }, { label: 'Sí', value: 'true' }];
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
  users: UserIt[] = []
  genres: Genre[] = [];
  selectedGenre: Genre[] = [];
  isMobile = false

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
      }
    ];

  }

  bookForm: FormGroup = this.formBuilder.group({
    titleInput: [, [Validators.required, Validators.maxLength(100)]],
    authorInput: [, [Validators.required, Validators.maxLength(50)]],
    genreInput: [[], Validators.required],
    booksNumberInput: [[], [Validators.required, Validators.min(1)]],
    publishDateInput: [],
    pagesNumberInput: [, [Validators.required, Validators.min(1)]],
    imageInput: [],
    imageAuthorInput: [],
    publisherInput: [, [Validators.required, Validators.maxLength(50)]],
    ISBNInput: [, [Validators.maxLength(50)]],
    descriptionInput: [, [Validators.minLength(0), Validators.maxLength(200)]],
    physBooknput: ['false']
  })

  currentDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = control.value;
    const currentDate = new Date();
    console.log(currentDate);

    if (selectedDate && selectedDate < currentDate) {
      return { invalidDate: true };
    }
    return null;
  }

  registerForm: FormGroup = this.formBuilder.group({
    nameInput: [, [Validators.required, Validators.maxLength(50)]],
    emailInput: [, [Validators.required, Validators.email]],
    passwordInput: [, [Validators.required, Validators.minLength(6), Validators.maxLength(25), this.passwordValidator]],
  })

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const hasUppercase = /[A-Z]/.test(control.value);
    const hasNumber = /\d/.test(control.value);
    const hasSymbol = /[$&+,:;=?@#|'<>.·^*()%!\-]/.test(control.value);
    const valid = hasUppercase && hasNumber && hasSymbol;
    return valid ? null : { invalidPassword: true };
  }

  async ngOnInit() {

    this.onWindowResize()

    this.activeIndex = 0
    this.bookForm.reset({
      titleInput: '',
      authorInput: '',
      genreInput: [],
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

    this.genres = [
      {
        id: 1,
        title: "Romántico",
      },
      {
        id: 2,
        title: "Ciencia Ficción",
      },
      {
        id: 3,
        title: "Fantasía"
      },
      {
        id: 4,
        title: "Poesía",
      },
      {
        id: 5,
        title: "Policíaca",
      },
      {
        id: 6,
        title: "Terror"
      },
      {
        id: 7,
        title: "Clásicos",
      }
    ];

    this.numOfBooks = await this.libraryService.getNumberOfBooks()

    this.numberOfphysicalBooks = await this.libraryService.getNumberOfPhysicalBooks()

    this.numberOfDigitalBooks = await this.libraryService.getNumberOfDigitalBooks()

    this.numberOfFinishedBooks = await this.libraryService.getNumberOfFinisedBooks()

    const filteredUsers = await this.usersService.getAllUsers()
    this.users = filteredUsers.filter(user => user.id !== this.usersService.currentUser.id);



  }

  onWindowResize() {
    this.isMobile = window.innerWidth < 768; // Define el ancho máximo para considerar como pantalla móvil
  }

  validFieldBooks(field: string) {
    return this.bookForm.controls[field].errors &&
      this.bookForm.controls[field].touched
  }

  validFieldRegister(field: string) {
    return this.registerForm.controls[field].errors &&
      this.registerForm.controls[field].touched
  }

  handleFileInput(files: FileList) {
    files.item(0);
  }

  async saveBook() {
    let tempbook;

    await this.libraryService.bookExist(this.bookForm.value.titleInput).then(Snapshot => Snapshot.forEach((doc) => {
      tempbook = doc.data() as Book
      tempbook.id = doc.id
    })
    )

    if (this.bookForm.invalid || (this.uploadedFiles.length == 0 && this.bookForm.value.physBooknput == 'false') ||
      tempbook !== undefined) {

      this.bookForm.markAllAsTouched();
      if (this.uploadedFiles.length == 0 && this.bookForm.value.physBooknput == 'false') {
        this.messageService.add({ severity: 'warn', summary: 'Debe haber al menos un libro digital o que esté en físico', detail: '' });
      }

      if (tempbook !== undefined) {
        this.messageService.add({ severity: 'warn', summary: 'Este libro ya existe', detail: '' });
      }
      return;
    }

    const selectedDate: Date = this.bookForm.value.publishDateInput;

    let day: number = 0;
    let month: number = 0;
    let year: number = 0;
    if (this.bookForm.value.publishDateInput) {
      day = selectedDate.getDate();
      month = selectedDate.getMonth() + 1;
      year = selectedDate.getFullYear();
    }

    let newBook: Book = {
      id: '',
      title: this.bookForm.value.titleInput,
      author: this.bookForm.value.authorInput,
      publisher: this.bookForm.value.publisherInput,
      description: this.bookForm.value.descriptionInput,
      ISBN: this.bookForm.value.ISBNInput,
      numberOfBooks: this.bookForm.value.booksNumberInput,
      publish_date: `${day}/${month}/${year}`,
      genre: this.bookForm.value.genreInput.map(genre => genre.title),
      files: [],
      image: this.bookForm.value.imageInput,
      authorImage: this.bookForm.value.imageAuthorInput,
      pages: this.bookForm.value.pagesNumberInput,
      physicalBook: (this.bookForm.value.physBooknput == 'true') ? true : false,
      isAvailable: (this.bookForm.value.physBooknput == 'true') ? true : false,
      isNotAvailableReason: { name: '', id: '' }
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
    this.messageService.add({ severity: 'success', summary: 'Nuevo libro agregado', detail: '' });
    // enviado datos al storage

    this.uploadedFiles = []
    this.bookForm.reset({
      titleInput: '',
      authorInput: '',
      genreInput: [],
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
      isNotAvailableReason: { name: '', id: '' }
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
      authorInput: this.foundBooks?.data?.authors[0]?.name ?? '',
      genreInput: [],
      booksNumberInput: 1,
      publishDateInput: new Date(this.foundBooks?.data?.publish_date ?? ''),
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
      isNotAvailableReason: { name: '', id: '' }
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
        console.log(this.foundBooks.data === undefined && this.inputSearch.value !== '');

      })
    } else {
      this.foundBooks.data = dataBook!;
    }
  }

  search(severity: string) {
  }

  deleteUser(event: Event, idUser: string) {
    this.confirmationService.confirm({
      target: event.target!,
      message: '¿Estás seguro de que quieres borrar este usuario?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users.slice(1, 1)
        const index = this.users.findIndex(user => user.id === idUser);
        this.users.splice(index!, 1);
        this.usersService.deleteUser(idUser)

        this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'Has borrado este usuario correctamente =(' });
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Has cancelado la acción' });
      }
    });
  }

  letAdmin(user: UserIt) {
    user.admin = !user.admin
    this.usersService.updateUser(user)
  }

  showDialog() {
    this.showRegister = true;
  }

  register() {

    if (this.registerForm.valid) {
      this.usersService.register(this.registerForm.value.emailInput, this.registerForm.value.passwordInput)
        .then(response => {
          this.usersService.registerUserData(response.user.uid, this.registerForm.value.nameInput, this.registerForm.value.emailInput
          ).then(response => {
            this.showRegister = false;
            this.messageService.add({ severity: 'success', summary: 'Nuevo usuario agregado', detail: '' });

          })
            .catch(error => console.log(error));
          this.users.push({ email: this.registerForm.value.emailInput, id: response.user.uid, fullName: this.registerForm.value.nameInput })
          this.registerForm.reset({
            nameInput: '',
            emailInput: '',
            passwordInput: ''
          })
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === 'auth/email-already-in-use') {
            this.emailExist = true
          }
        });


    }
  }

  downloadUsersData(users: UserIt[]) {

    const bodyData = [['Nombre', 'Email', 'Admin', 'Libros Favoritos', 'Libros Leidos']];

    users.forEach(user => {

      let favBooks: string = user.favouritesBooks.map(favBook => favBook.title).join('\n');
      let finishedBooks = user.finishedBooks.map(finishedBook => finishedBook.title).join('\n');
      const rowData: any = [];
      rowData.push(user.fullName);
      rowData.push(user.email);
      rowData.push((user.admin) ? 'Si' : 'No');
      rowData.push(favBooks);
      rowData.push(finishedBooks);
      bodyData.push(rowData);
    });


    const documentDefinition: any = {
      content: [
        { text: 'Listado de usuarios', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: bodyData
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };

    pdfMake.createPdf(documentDefinition).open();

  }


}
