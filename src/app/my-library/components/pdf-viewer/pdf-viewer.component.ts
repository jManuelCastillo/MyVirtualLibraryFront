import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { LibraryService } from '../../service/library.service';
import { BookmarkService } from '../../service/bookmark.service';
import { UserService } from '../../service/user.service';
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
  zoom = '150%';
  isMobile: boolean = false;
  constructor(
    private libraryService: LibraryService,
    private bookMarkService: BookmarkService,
    private userService: UserService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    pdfDefaultOptions.doubleTapZoomFactor = '150%';
    pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5;
  }

  async ngOnInit() {
    this.onWindowResize()
    this.currentPdf = this.libraryService.currentPdf;
    this.bookMarkService.getBookmarkByID(this.userService.currentUser!.id)
      .then(bookMark => {
        this.currentMark = bookMark.data() as Bookmark
        console.log(this.currentMark);

      });
  }

  async onEvent(event: any) {

    await this.bookMarkService.postBookmark(this.userService.currentUser!.id).
      then(response => console.log(response))
  }
    
  onWindowResize() {
    this.isMobile = window.innerWidth < 768; // Define el ancho máximo para considerar como pantalla móvil
  }
}
