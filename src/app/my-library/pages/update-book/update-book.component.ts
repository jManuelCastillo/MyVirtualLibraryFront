import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Book } from '../../interfaces/book.interface';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { LibraryService } from '../../service/library.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css'],
  providers: [MessageService, TitleCasePipe, ConfirmationService],
})
export class UpdateBookComponent {

  uploadedFiles: any[] = [];
  genresInput!: string[]
  currentBook!: Book;
  constructor(private formBuilder: FormBuilder, private titlecasePipe: TitleCasePipe, private route: ActivatedRoute,
    private messageService: MessageService, private storage: Storage, private libraryService: LibraryService,
    private confirmationService: ConfirmationService,) {
    this.genresInput = [];
    this.uploadedFiles = []
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.libraryService.getBookByID(params['id'])
        .then(book => {
          this.currentBook = book.data() as Book;

          this.bookForm.reset({
            titleInput: this.currentBook?.title ?? '',
            autorInput: this.currentBook?.author ?? '',
            genreInput: this.currentBook?.genre ?? [],
            booksNumberInput: this.currentBook?.numberOfBooks,
            publishDateInput: this.currentBook?.publish_date ?? '',
            pagesNumberInput: this.currentBook?.pages ?? 1,
            imageInput: this.currentBook?.image ?? '',
            imageAuthorInput: this.currentBook?.authorImage ?? '',
            publisherInput: this.currentBook?.publisher ?? '',
            ISBNInput: this.currentBook?.ISBN,
            descriptionInput: this.currentBook?.description ?? ''
          })
        })
        .catch(error => console.log(error))
    });


  }

  confirm(event: Event, file: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Deseas borrar este archivo',
        icon: 'pi pi-trash',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Borrar', detail: 'Listo para borrar' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'No se ha borrado' });
        }
    });
}

  bookForm: FormGroup = this.formBuilder.group({
    titleInput: [, [Validators.required, Validators.maxLength(40)]],
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

  })

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

  validField(field: string) {
    return this.bookForm.controls[field].errors &&
      this.bookForm.controls[field].touched
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

}
