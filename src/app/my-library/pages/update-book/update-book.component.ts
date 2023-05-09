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

  stateOptions: any[] = [{ label: 'No', value: 'false' }, { label: 'Si', value: 'true' }];
  uploadedFiles: any[] = [];
  genresInput!: string[]
  currentBook!: Book;
  filesToDelete: string[] = [];
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
          this.currentBook.id = params['id'];
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
            descriptionInput: this.currentBook?.description ?? '',
            physBooknput: (this.currentBook?.physicalBook)? 'true' : 'false',
            isAvailable: this.currentBook?.isAvailable,
            isNotAvailableReason: this.currentBook?.isNotAvailableReason
          })
        })
        .catch(error => console.log(error))
    });


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
    physBooknput: ['false'],
    isAvailable: false,
    isNotAvailableReason: {name: '', id:''}
  })

  onUpload(event: any) {
    this.uploadedFiles = []

    for (let file of event.files) {
      if (this.uploadedFiles.some((upFile) => upFile.type === file.type)) {
        this.messageService.add({ severity: 'warn', summary: 'No se pueden repetir archivos con el mismo formato', detail: '' });
        return;
      }

      console.log(this.currentBook.files);

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

  validField(field: string) {
    return this.bookForm.controls[field].errors &&
      this.bookForm.controls[field].touched
  }

  async saveBook() {

    if (this.bookForm.invalid || (this.uploadedFiles.length == 0 && this.currentBook.files.length == 0)) {
      this.bookForm.markAllAsTouched();
      return;
    }

    let newBook: Book = {
      id: this.currentBook.id,
      title: this.bookForm.value.titleInput,
      author: this.bookForm.value.autorInput,
      publisher: this.bookForm.value.publisherInput,
      description: this.bookForm.value.descriptionInput,
      ISBN: this.bookForm.value.ISBNInput,
      numberOfBooks: this.bookForm.value.booksNumberInput,
      publish_date: "",
      genre: this.bookForm.value.genreInput,
      files: this.currentBook.files,
      image: this.bookForm.value.imageInput,
      authorImage: this.bookForm.value.imageAuthorInput,
      pages: this.bookForm.value.pagesNumberInput,
      physicalBook: (this.bookForm.value.physBooknput == "true") ? true : false,
      isAvailable: (this.bookForm.value.physBooknput == 'true') ? true : false,
      isNotAvailableReason:this.bookForm.value.isNotAvailableReason
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

    await this.libraryService.deleteFileBook(this.filesToDelete);
    const book = await this.libraryService.updateBook(newBook);
    // enviado datos al storage

  }

}
