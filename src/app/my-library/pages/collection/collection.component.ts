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

    constructor(private productService: LibraryService) {}

    ngOnInit() {
        
        this.fantasyBooks = this.bookslist.filter(book => book.genre.toLocaleLowerCase() === 'fantasy' || book.genre.toLocaleLowerCase() === 'Fantasía');

        this.sci_FiBooks = this.bookslist.filter(book => book.genre.toLocaleLowerCase() === 'science fiction' || book.genre.toLocaleLowerCase() === 'sci-fi' || book.genre.toLocaleLowerCase() === 'ciencia ficción');

        this.romanticBooks = this.bookslist.filter(book => book.genre.toLocaleLowerCase() === 'classic' || book.genre.toLocaleLowerCase() === 'románticas');


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