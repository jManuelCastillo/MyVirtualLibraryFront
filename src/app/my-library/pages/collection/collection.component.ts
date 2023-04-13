import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

    bookslist: Book[] = this.productService.bookListService;
    fantasyBooks: Book[] = [];
    sci_FiBooks: Book[] = [];
    romanticBooks: Book[] = [];

    responsiveOptions: any[] = [];

    constructor(private productService: LibraryService) { }

    ngOnInit() {

        this.fantasyBooks = this.bookslist.filter(book => book.genre.map((genre) => genre.toLocaleLowerCase() === 'fantasy' || 'fantasía'));

        this.sci_FiBooks = this.bookslist.filter(book => book.genre.map((genre) => genre.toLocaleLowerCase() === 'science fiction' || 'ciencia ficción'));

        this.romanticBooks = this.bookslist.filter(book => book.genre.map((genre) => genre.toLocaleLowerCase() === 'classic' || 'románticas'));


        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }


}