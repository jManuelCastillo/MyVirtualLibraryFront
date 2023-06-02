import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { UserService } from '../../service/user.service';
import { UserIt } from '../../interfaces/user.interface';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  fantasyBooks: Book[] = [];
  scifiBooks: Book[] = [];
  romanticBooks: Book[] = [];
  classicBooks: Book[] = [];
  currentUser!: UserIt;
  responsiveOptions: any[] = [];
  isMobile = false;
  
  constructor(private libraryService: LibraryService, private router: Router,
     private userService: UserService) { }

  ngAfterContentChecked(): void {
    // Realizar cambios en los datos aquí
    this.currentUser = JSON.parse(localStorage.getItem('user')!) as UserIt;
  }

  async ngOnInit() {
    this.onWindowResize()

    this.currentUser = this.userService.currentUser
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

    await this.libraryService.getClassicBooks().then(Snapshot => Snapshot.forEach((doc) => {
      const newClassicBook = doc.data() as Book
      newClassicBook.id = doc.id
      this.classicBooks.push(newClassicBook)
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

  onWindowResize() {
    this.isMobile = window.innerWidth < 768; // Define el ancho máximo para considerar como pantalla móvil
}

  downloadBookData(books: Book[], genre: string) {

    const bodyData = [['Título', 'Autor', 'Género', 'Editorial', 'Páginas', 'Fecha de Salida']];

    books.forEach(book => {

      let genre: string = book.genre.map(genre => genre).join('\n');
      const rowData: any = [];
      rowData.push(book.title);
      rowData.push(book.author);
      rowData.push(genre);
      rowData.push(book.publisher);
      rowData.push(book.pages);
      rowData.push(book.publish_date);
      bodyData.push(rowData);
    });


    const documentDefinition: any = {
      content: [
        { text: `Listado de libros de ${genre}`, style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: bodyData
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };

    pdfMake.createPdf(documentDefinition).open();

  }


  favButton(idBook: string, title: string) {

    this.currentUser = this.userService.currentUser;
    if (this.currentUser?.favouritesBooks?.findIndex(favBook => favBook.idBook === idBook) === -1) {
      this.userService.currentUser?.favouritesBooks?.push({ idBook, title })

    } else {
      const index = this.userService.currentUser?.favouritesBooks?.findIndex(favBook => favBook.idBook === idBook);
      this.userService.currentUser?.favouritesBooks?.splice(index!, 1);
      this.currentUser?.favouritesBooks?.splice(index!, 1);
    }

    this.userService.updateUser()
  }

  isFav(idBook: string) {
    this.currentUser = JSON.parse(localStorage.getItem('user')!)
    if(this.currentUser){
    return this.currentUser!.favouritesBooks != undefined && this.currentUser?.favouritesBooks?.some(favBook => favBook.idBook == idBook)}
      return false
  }

  finisedButton(idBook: string, title: string) {

    this.currentUser = this.userService.currentUser;

    if (this.currentUser?.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === idBook) === -1) {
        this.userService.currentUser?.finishedBooks?.push({ idBook, title })

    } else {
        const index = this.userService.currentUser?.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === idBook);
        this.userService.currentUser?.finishedBooks?.splice(index!, 1);
        this.currentUser?.finishedBooks?.splice(index!, 1);
    }

    this.userService.updateUser()
}

isFinised(idBook: string) {
    this.currentUser = JSON.parse(localStorage.getItem('user')!)
    return this.currentUser!.finishedBooks != undefined && this.currentUser?.finishedBooks?.some(finishedBook => finishedBook.idBook == idBook)
}
}