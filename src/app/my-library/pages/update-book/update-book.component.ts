import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Book } from '../../interfaces/book.interface';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { LibraryService } from '../../service/library.service';
import { ActivatedRoute } from '@angular/router';

interface Genre {
  id: number;
  title: string;
}

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css'],
  providers: [MessageService, TitleCasePipe, ConfirmationService],
})
export class UpdateBookComponent {

  stateOptions: any[] = [{ label: 'No', value: 'false' }, { label: 'Si', value: 'true' }];
  uploadedFiles: any[] = [];
  genresInput!: string[]
  currentBook!: Book;
  filesToDelete: string[] = [];
  genres: Genre[] = [];
  selectedGenre: Genre[] = [];
  isMobile = false;
  

  constructor(private formBuilder: FormBuilder, private titlecasePipe: TitleCasePipe, private route: ActivatedRoute,
    private messageService: MessageService, private storage: Storage, private libraryService: LibraryService,
    private confirmationService: ConfirmationService,) {
    this.genresInput = [];
    this.uploadedFiles = []
  }

  ngOnInit() {
    this.onWindowResize();

    this.route.params.subscribe(params => {
      this.libraryService.getBookByID(params['id'])
        .then(book => {
          this.currentBook = book.data() as Book;
          this.currentBook.id = params['id'];
          let date!: Date;
          if (this.currentBook.publish_date != '') {
            const fechaStr = this.currentBook.publish_date;
            const [day, month, year] = fechaStr.split("/").map(Number);
            date = new Date(year, month - 1, day)
          }


          this.bookForm.reset({
            titleInput: this.currentBook?.title ?? '',
            authorInput: this.currentBook?.author ?? '',
            genreInput: this.currentBook?.genre.map(title => {
              const genre = this.genres.find(genre => genre.title === title);
              return {
                id: genre?.id,
                title: genre?.title
              };
            }),
            booksNumberInput: this.currentBook?.numberOfBooks,
            publishDateInput: date ?? '',
            pagesNumberInput: this.currentBook?.pages ?? 1,
            imageInput: this.currentBook?.image ?? '',
            imageAuthorInput: this.currentBook?.authorImage ?? '',
            publisherInput: this.currentBook?.publisher ?? '',
            ISBNInput: this.currentBook?.ISBN,
            descriptionInput: this.currentBook?.description ?? '',
            physBooknput: (this.currentBook?.physicalBook) ? 'true' : 'false',
            isAvailable: this.currentBook?.isAvailable,
            isNotAvailableReason: this.currentBook?.isNotAvailableReason
          })
        })
        .catch(error => console.log(error))
    });


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

  }

  confirmDelete(event: Event, fileRoute: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas borrar este archivo',
      icon: 'pi pi-trash',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Borrar', detail: 'Listo para borrar' });
        this.currentBook.files = this.currentBook.files.filter(file => file.route !== fileRoute);
        this.filesToDelete.push(fileRoute)
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'No se ha borrado' });
      }
    });
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

  onUpload(event: any) {
    this.uploadedFiles = []

    for (let file of event.files) {
      if (this.uploadedFiles.some((upFile) => upFile.type === file.type)) {
        this.messageService.add({ severity: 'warn', summary: 'No se pueden repetir archivos con el mismo formato', detail: '' });
        return;
      }

      if (this.currentBook.files.some((currentFile) => file.type.includes(currentFile.format))) {
        this.messageService.add({ severity: 'warn', summary: 'No se pueden repetir archivos con el mismo formato', detail: '' });
        return;
      }
      this.uploadedFiles.push(file);
    }

    if (this.uploadedFiles.length > 1) {
      this.messageService.add({ severity: 'info', summary: 'Archivos añadidos', detail: '' });
    } else {
      this.messageService.add({ severity: 'info', summary: 'Archivo añadido', detail: '' });
    }

  }

  onWindowResize() {
    this.isMobile = window.innerWidth < 768; // Define el ancho máximo para considerar como pantalla móvil
}

  validField(field: string) {
    return this.bookForm.controls[field].errors &&
      this.bookForm.controls[field].touched
  }

  async saveBook() {
    let tempbook;
    await this.libraryService.bookExist(this.bookForm.value.titleInput).then(Snapshot => Snapshot.forEach((doc) => {
      tempbook = doc.data() as Book
      tempbook.id = doc.id
      console.log(tempbook);
      
    })
    )
    
    if (this.bookForm.invalid || ((this.uploadedFiles.length == 0 && this.currentBook.files.length == 0) && this.bookForm.value.physBooknput == 'false') ||
    tempbook !== undefined) {
      this.bookForm.markAllAsTouched();

      if ((this.uploadedFiles.length == 0 && this.currentBook.files.length == 0) && this.bookForm.value.physBooknput == 'false') {
        this.messageService.add({ severity: 'warn', summary: 'Debe haber almenos un libro digital o que esté en físico', detail: '' });
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


    let updatedBook: Book = {
      id: this.currentBook.id,
      title: this.bookForm.value.titleInput,
      author: this.bookForm.value.authorInput,
      publisher: this.bookForm.value.publisherInput,
      description: this.bookForm.value.descriptionInput,
      ISBN: this.bookForm.value.ISBNInput,
      numberOfBooks: this.bookForm.value.booksNumberInput,
      publish_date: `${day}/${month}/${year}`,
      genre: this.bookForm.value.genreInput.map(genre => genre.title),
      files: this.currentBook.files,
      image: this.bookForm.value.imageInput,
      authorImage: this.bookForm.value.imageAuthorInput,
      pages: this.bookForm.value.pagesNumberInput,
      physicalBook: (this.bookForm.value.physBooknput == "true") ? true : false,
      isAvailable: (this.bookForm.value.physBooknput == 'true') ? true : false,
      isNotAvailableReason: (this.bookForm.value.physBooknput == 'true' && this.bookForm.value.isNotAvailableReason) ? this.bookForm.value.isNotAvailableReason : { name: '', id: '' }

    }


    this.uploadedFiles.map(file => {
      const filesRef = ref(this.storage, `BooksFiles/${file.name}`)

      uploadBytes(filesRef, file)
        .then(response => {
          console.log(response)
        })
        .catch(error => console.log(error));

      updatedBook.files.push({
        format: file.name.split('.').slice(1),
        route: `BooksFiles/${file.name}`
      });
    })



    await this.libraryService.deleteFileBook(this.filesToDelete).then(a => {
      this.libraryService.updateBook(updatedBook)
        .then(response => {
          this.messageService.add({ severity: 'success', summary: 'Libro actualizado', detail: '' });
        }).catch(error => {
          this.messageService.add({ severity: 'warn', summary: 'Hubo un error al actualizar el libro', detail: '' });
        });
    });
  }



}
