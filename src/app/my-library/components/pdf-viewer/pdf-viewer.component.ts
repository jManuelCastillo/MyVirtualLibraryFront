import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgxExtendedPdfViewerService, pdfDefaultOptions, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { LibraryService } from '../../service/library.service';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { BookmarkService } from '../../service/bookmark.service';
import { UserService } from '../../service/user.service';
import { User } from '../../interfaces/user.interface';
import { Bookmark } from '../../interfaces/bookmark.interface';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfViewerComponent implements OnInit {
  /** In most cases, you don't need the NgxExtendedPdfViewerService. It allows you
     *  to use the "find" api, to extract text and images from a PDF file,
     *  to print programmatically, and to show or hide layers by a method call.
    */
  public page = 5;
  currentPdf!: string;
  public pageLabel: string = "";
  currentMark!: Bookmark;

  constructor(
    private libraryService: LibraryService,
    private bookMarkService: BookmarkService,
    private userService: UserService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    pdfDefaultOptions.doubleTapZoomFactor = '150%';
    pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5;
  }

  async ngOnInit() {
    this.currentPdf = this.libraryService.currentPdf;
    this.bookMarkService.getBookmarkByID(this.userService.currentUser!.id)
      .then(bookMark => {
        this.currentMark = bookMark.data() as Bookmark
        console.log(this.currentMark);
        
      });
  }

  async onEvent(event: any) {
   /*  if (this.currentMark) {

      let index = this.currentMark.files.findIndex(data => data.bookId === this.libraryService.currentPdfId);

      if (index === -1) {
        console.log('añade');
        // Si el "bookId" no existe en la lista, lo agregamos
        this.currentMark.userId = this.userService.currentUser!.id;
        this.currentMark.files.push(event); 
      } else {
        console.log('actualiza');
        
        // Si el "bookId" ya existe en la lista, lo actualizamos
        this.currentMark.data[index] = {
          bookId: this.libraryService.currentPdfId,
          currentPage: event
        };
      }
    } else {
        console.log('no existe');
        
      this.currentMark = {
        userId: this.userService.currentUser!.id,
        data: [{
          bookId: this.libraryService.currentPdfId,
          currentPage: event
        }]
      }
    } */

    await this.bookMarkService.postBookmark(this.userService.currentUser!.id).
      then(response => console.log(response))
  }

}
