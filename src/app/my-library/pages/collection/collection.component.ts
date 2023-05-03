import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

    fantasyBooks: Book[] = [];
    scifiBooks: Book[] = [];
    romanticBooks: Book[] = [];

    responsiveOptions: any[] = [];

    constructor(private libraryService: LibraryService, private router: Router) { }

    async ngOnInit() {

        await this.libraryService.getFantasyBooks().then(Snapshot => Snapshot.forEach((doc) => {
            const newFantasyBook = doc.data() as Book
            newFantasyBook.id = doc.id
            this.fantasyBooks.push(newFantasyBook)
        })
        )

        await this.libraryService.getSciFiBooks().then(Snapshot => Snapshot.forEach((doc) => {
            const newScifiBook = doc.data() as Book
            newScifiBook.id = doc.id
            this.scifiBooks.push(newScifiBook)
        })
        )

        await this.libraryService.getRomanticBooks().then(Snapshot => Snapshot.forEach((doc) => {
            const newRomanticBook = doc.data() as Book
            newRomanticBook.id = doc.id
            this.romanticBooks.push(newRomanticBook)
        })
        )

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

    showInfo(id: string) {
        this.router.navigate(['/bookinfo', id]);
    }
}