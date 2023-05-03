import { Component } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService, } from 'primeng/api';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { ref, getStorage } from '@angular/fire/storage'

@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.css'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class BookInfoComponent {

  currentBook!: Book;
  ref!: DynamicDialogRef;
  authorBooks: Book[] = []
  target!: EventTarget;

  constructor(private libraryService: LibraryService, private route: ActivatedRoute,
    private router: Router, public dialogService: DialogService,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  async ngOnInit() {
    await this.route.params.subscribe(params => {
      this.libraryService.getBookByID(params['id'])
        .then(book => {
          this.currentBook = book.data() as Book;
          this.currentBook.id = book.id
          this.libraryService.BookByAuthor(this.currentBook.author).then(Snapshot => Snapshot.forEach((doc) => {
            this.authorBooks.push(doc.data() as Book)
          })).catch(error => console.log(error)
          )
        }
        )
        .catch(error => console.log(error))
    });
  }

  

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  showPdf(route: string) {
    this.libraryService.currentPdf = route;
    this.ref = this.dialogService.open(PdfViewerComponent, {
      header: 'Mira un pdf',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });


  }

  uploadBook(path: string) {
    const storage = getStorage();
    return ref(storage, path);
}

  deleteBook(id: string) {

    this.libraryService.deleteBook(id);

    this.router.navigate(['/home']);

  }

}
