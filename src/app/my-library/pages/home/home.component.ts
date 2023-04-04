import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interface/book.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  bookList: Book[] = this.libraryService.bookListService
  searchItems: MenuItem[] = [];
  optionsItems: MenuItem[] = [];
  inputSearch: string = "";
  selectFilter = 'Libro'
 

    constructor(private libraryService: LibraryService) {
        this.searchItems = [
            {
                label: 'Libro',
                command: () => {
                    this.selectFilter = 'Libro',
                    this.update();
                }
            },
            {
                label: 'Autor',
                command: () => {
                    this.selectFilter = 'Autor'
                    this.delete();
                }
            },
            { label: 'Libro/autor',command: () => {
                this.selectFilter = 'Libro/Autor'
                this.delete();
            } }
        ];

        this.optionsItems = [
            {
                label: 'Libro',
                command: () => {
                    this.selectFilter = 'Libro',
                    this.update();
                }
            },
            {
                label: 'Autor',
                command: () => {
                    this.selectFilter = 'Autor'
                    this.delete();
                }
            },
            { label: 'Libro/autor',command: () => {
                this.selectFilter = 'Libro/Autor'
                this.delete();
            } }
        ];
    }
    
    searchTitle(){

        this.libraryService.bookListService

    }

    options(severity: string) {
        
    }

    search(severity: string) {
        
    }

    update() {
       
    }

    delete() {
     
    }
}