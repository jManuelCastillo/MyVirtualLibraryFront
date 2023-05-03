import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgxExtendedPdfViewerService, pdfDefaultOptions, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { LibraryService } from '../../service/library.service';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
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

  constructor(private pdfService: NgxExtendedPdfViewerService,
     private libraryService: LibraryService,
     private storage: Storage) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    pdfDefaultOptions.doubleTapZoomFactor = '150%';
    pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5;
  }

  async ngOnInit() {
       this.currentPdf = this.libraryService.currentPdf    
    
  }

}
