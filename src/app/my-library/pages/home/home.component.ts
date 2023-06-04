import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { LibraryService } from '../../service/library.service';
import { Book } from '../../interfaces/book.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { UserService } from '../../service/user.service';
import { UserIt } from '../../interfaces/user.interface';
import { Router } from '@angular/router';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [DialogService, MessageService, ConfirmationService]
})
export class HomeComponent implements OnDestroy, OnInit {
    tempBook?: Book;
    visible: boolean = false;
    visible2: boolean = false;
    showModifySuggestion: boolean = false;
    showfinishedBookWindow: boolean = false;
    showRemovefinishedBookWindow: boolean = false;
    selectedUser?: UserIt;
    usersForHelp: UserIt[] = [];
    items?: MenuItem[];
    showSearch: boolean = false;
    searchItems: MenuItem[] = [];
    filteredBooks: Book[] = [];
    optionsItems: MenuItem[] = [];
    inputSearch: FormControl = this.formBuilder.control('')
    selectFilter: string = 'Título';
    option: string = 'gestionar'
    filter: string = 'title';
    fileInput: any;
    ref!: DynamicDialogRef;
    bookList: Book[] = [];
    currentUser?: UserIt;
    countries: any[] = [];
    selectedCountry?: string;
    bookForm: FormGroup = this.formBuilder.group({
        searchUser: ['',],
    })
    suggestionBooks: Book[] = [];
    mostReadGenre = undefined;
    mostUsedGenre?: any;
    bookMostRead: string = '';
    mostFavBook: string = '';
    isMobile = false;
    constructor(private libraryService: LibraryService, private formBuilder: FormBuilder,
        public dialogService: DialogService, public messageService: MessageService,
        private storage: Storage, private userService: UserService, private router: Router,
        private confirmationService: ConfirmationService, private fb: FormBuilder) {

        this.searchItems = [
            {
                label: 'Título',
                command: () => {
                    this.selectFilter = 'Título',
                        this.changeButton('title');
                    this.searchFilter()
                }
            },
            {
                label: 'Autor',
                command: () => {
                    this.selectFilter = 'Autor'
                    this.changeButton('author');
                    this.searchFilter()
                }
            },
            {
                label: 'Género', command: () => {
                    this.selectFilter = 'Género'
                    this.changeButton('genre');
                    this.searchFilter()
                }
            },
            {
                label: 'Editorial', command: () => {
                    this.selectFilter = 'Editorial'
                    this.changeButton('publisher');
                    this.searchFilter()
                }
            }
        ];

    }



    async ngOnInit() {

        this.onWindowResize();

        await this.mostFinishedBookGenre()

        this.libraryService.getAllBooksSuggestions().subscribe({
            next: books => this.suggestionBooks = books
        })

        this.libraryService.getMyBooks().subscribe({
            next: books => this.bookList = books
        })
        this.currentUser = JSON.parse(localStorage.getItem('user')!) as UserIt

    }

    async uploadBook(path: string) {
        const bookRef = ref(this.storage, path);
        await getDownloadURL(bookRef).then(urlBook => {
            window.location.href = urlBook
        })
    }


    onWindowResize() {
        this.isMobile = window.innerWidth < 768; // Define el ancho máximo para considerar como pantalla móvil
    }

    showInfo(id: string) {
        this.router.navigate(['/bookinfo', id]);
    }

    async deleteBook(event: Event, id: string, fileList: any[]) {
        let tempUsers: UserIt[] = await this.userService.getAllUsers();
        this.confirmationService.confirm({
            target: event.target,
            message: '¿Seguro qué quieres borrar el libro?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.libraryService.deleteBook(id);
                this.libraryService.deleteFileBook(fileList.map(file => file.route));
                const index = this.filteredBooks.findIndex(book => book.id === id);
                this.filteredBooks.splice(index, 1);
                let bookIndex = this.suggestionBooks.findIndex(book => book.id === id);
                this.suggestionBooks.splice(bookIndex, 1)
                this.libraryService.deleteBookSuggestions(id)
                tempUsers.forEach(user => {
                    if (user.id != this.currentUser.id) {
                        user.favouritesBooks = user.favouritesBooks.filter(
                            (book) => book.idBook !== id
                        );

                        // Elimina los elementos con idBook coincidente de finishedBooks
                        user.finishedBooks = user.finishedBooks.filter(
                            (book) => book.idBook !== id
                        );

                        this.userService.updateUser(user)
                    } else {

                        this.userService.currentUser.favouritesBooks = this.userService.currentUser.favouritesBooks.filter(
                            (book) => book.idBook !== id
                        );

                        // Elimina los elementos con idBook coincidente de finishedBooks
                        this.userService.currentUser.finishedBooks = this.userService.currentUser.finishedBooks.filter(
                            (book) => book.idBook !== id
                        );

                        this.userService.updateUser()
                    }
                });

                this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Libro borrado' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la acción' });
            }
        });



    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }

    async showPdf(route: string, title: string, id: string) {

        const bookRef = ref(this.storage, route);
        await getDownloadURL(bookRef).then(urlBook => {

            this.libraryService.currentPdf = urlBook;
            this.libraryService.currentPdfId = id;
            this.ref = this.dialogService.open(PdfViewerComponent, {
                header: title,
                width: (this.isMobile) ? '100%' : '70%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true
            });
        })

    }

    changeButton(filter: string) {
        this.filter = filter;
    }

    getBook(path: string) {
        const book = ref(this.storage)

    }

    searchFilter() {
        if (this.inputSearch.value != '') {
            this.showSearch = true

            switch (this.filter) {

                case 'title':
                    this.filteredBooks = this.bookList.flat().filter(book =>
                        book.title.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
                    break;
                case 'author':
                    this.filteredBooks = this.bookList.flat().filter(book =>
                        book.author.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
                    break;
                case 'genre':
                    this.filteredBooks = this.filteredBooks = this.bookList.flat().filter(book =>
                        book.genre.some(genre => genre.toLowerCase().includes(this.inputSearch.value.toLowerCase())));
                    break;
                case 'publisher':
                    this.filteredBooks = this.bookList.flat().filter(book =>
                        book.publisher.toLocaleLowerCase().includes(this.inputSearch.value.toLocaleLowerCase()));
                    break;
                default:
            }
        } else {
            this.showSearch = false;
        }
    }

    options(severity: string) {

    }

    search(severity: string) {

    }

    searchByBookAuthor() {

    }

    searchByAuthor() {

    }

    updateBook(id: string) {
        this.router.navigate(['/updateBook', id]);
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
        return this.currentUser!.favouritesBooks != undefined && this.currentUser?.favouritesBooks?.some(favBook => favBook.idBook == idBook)
    }

    userFinisedButton() {

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

    withdrawABook(book: Book) {
        this.currentUser = JSON.parse(localStorage.getItem('user')!)

        if (book.isAvailable) {
            book.isAvailable = false;
            book.isNotAvailableReason = { name: this.currentUser!.fullName, id: this.currentUser!.id }
            this.libraryService.updateBook(book)

        } else {
            book.isAvailable = true;
            book.isNotAvailableReason = { name: '', id: '' },
                this.libraryService.updateBook(book)
        }

    }

    async showWithdrawBook(book: Book) {
        this.visible = true;
        this.usersForHelp = await this.userService.getUsuario()
        this.tempBook = book
    }

    async showfinishedBook(book: Book) {
        this.showfinishedBookWindow = true;
        const users = await this.userService.getAllUsers();

        this.usersForHelp = users.filter(user =>
            !user.finishedBooks || !user.finishedBooks.some(finishedBook => finishedBook.idBook === book.id)
        );
        this.tempBook = book
    }

    async showRemovefinishedBook(book: Book) {
        this.showRemovefinishedBookWindow = true;
        const users = await this.userService.getAllUsers();
        this.usersForHelp = users.filter(user =>
            user.finishedBooks && user.finishedBooks.some(finishedBook => finishedBook.idBook === book.id)
        );
        this.tempBook = book
    }

    async showReturnBook(book: Book) {
        this.visible2 = true;
        this.tempBook = book
    }



    returnBookForUser(book: Book) {
        book.isAvailable = true;
        book.isNotAvailableReason = { name: '', id: '' }
        this.libraryService.updateBook(book);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Libro devuelto` });
        this.visible2 = false
    }

    modifySuggestions() {
        this.showModifySuggestion = true;
    }

    async managePreferenceBooks(book: Book) {

        if (this.checkSuggestion(book)) {
            let bookIndex = this.suggestionBooks.indexOf(book)
            this.suggestionBooks.splice(bookIndex, 1)
            this.libraryService.deleteBookSuggestions(book.id)
        } else {
            this.suggestionBooks.push(book)
            await this.libraryService.postBookSuggestions(book)
        }
    }

    withdrawForUser(name: string, id: string, book: Book) {
        book.isAvailable = false;
        book.isNotAvailableReason = { name: name, id: id }
        this.libraryService.updateBook(book);
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: `Libro retirado para ${name}` });
        this.visible = false
    }

    selectAsFinishedForUser(user: UserIt, book: Book) {

        user?.finishedBooks?.push({ idBook: book.id, title: book.title })
        this.userService.updateUser(user)
        let name = user.fullName;
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Marcado como finalizado para ' + name });
        this.showfinishedBookWindow = false
    }

    deselectAsFinishedForUser(user: UserIt, book: Book) {
        const index = user.finishedBooks?.findIndex(finishedBook => finishedBook.idBook === book.id);

        user.finishedBooks?.splice(index!, 1);

        this.userService.updateUser(user)
        let name = user.fullName;
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Desmarcar como finalizado para ' + name });
        this.showRemovefinishedBookWindow = false;
    }


    cancel() {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Acción cancelada' });
        this.visible = false;
        this.visible2 = false;
        this.showModifySuggestion = false;
        this.showfinishedBookWindow = false;
        this.showRemovefinishedBookWindow = false;
    }

    checkSuggestion(book: Book) {
        return this.suggestionBooks.some(tempBook => book.id === tempBook.id)
    }

    async mostFinishedBookGenre() {
        const users: UserIt[] = [];
        const books: Book[] = [];
        const genreFrequency: Record<string, number> = {};
        await this.userService.getAllUsers().then(tempUsers => users.push(...tempUsers));
        await this.libraryService.getAllBooks().then(tempBooks => books.push(...tempBooks));

        // Paso 1: Recorrer el arreglo de usuarios
        const bookFrequencyFinished = {};
        users.forEach((user) => {
            // Paso 2: Obtener los idBook de finishedBooks de cada usuario
            const finishedBooks = user.finishedBooks;
            finishedBooks.forEach((book) => {
                const { idBook, title } = book;
                // Paso 3: Contar la frecuencia de cada idBook
                if (idBook in bookFrequencyFinished) {
                    bookFrequencyFinished[idBook]++;
                } else {
                    bookFrequencyFinished[idBook] = 1;
                }
            });
        });

        // Paso 4: Encontrar el idBook con la frecuencia más alta
        let mostFrequentIdBook = null;
        let highestFrequency = 0;
        for (const idBook in bookFrequencyFinished) {
            const frequency = bookFrequencyFinished[idBook];
            if (frequency > highestFrequency) {
                highestFrequency = frequency;
                mostFrequentIdBook = idBook;
            }
        }

        // Paso 5: Obtener el título del libro más repetido
        let mostFrequentTitle = "";
        if (mostFrequentIdBook !== null) {


            users.forEach((user) => {
                const finishedBooks = user.finishedBooks;
                const book = finishedBooks.find((book) => book.idBook === mostFrequentIdBook);
                if (book) {
                    mostFrequentTitle = book.title;
                    return;
                }
            });
        }

        this.bookMostRead = mostFrequentTitle


        // Paso 1: Recorrer el arreglo de usuarios
        const bookFrequencyFav = {};
        users.forEach((user) => {
            // Paso 2: Obtener los idBook de favouritesBooks de cada usuario
            const favouritesBooks = user.favouritesBooks;
            favouritesBooks.forEach((book) => {
                const { idBook, title } = book;
                // Paso 3: Contar la frecuencia de cada idBook
                if (idBook in bookFrequencyFav) {
                    bookFrequencyFav[idBook]++;
                } else {
                    bookFrequencyFav[idBook] = 1;
                }
            });
        });

        // Paso 4: Encontrar el idBook con la frecuencia más alta
        let mostFrequentIdBookFav = null;
        highestFrequency = 0;
        for (const idBook in bookFrequencyFav) {
            const frequency = bookFrequencyFav[idBook];
            if (frequency > highestFrequency) {
                highestFrequency = frequency;
                mostFrequentIdBookFav = idBook;
            }
        }

        // Paso 5: Obtener el título del libro más repetido
        let mostFrequentTitleFav = "";
        if (mostFrequentIdBookFav !== null) {


            users.forEach((user) => {
                const favouritesBooks = user.favouritesBooks;
                const book = favouritesBooks.find((book) => book.idBook === mostFrequentIdBookFav);
                if (book) {
                    mostFrequentTitleFav = book.title;
                    return;
                }
            });
        }


        this.mostFavBook = mostFrequentTitleFav




        users.forEach((user) => {
            user.finishedBooks?.forEach((finishedBook) => {
                const book = books.find((book) => book.id === finishedBook.idBook);
                if (book && book.genre) {
                    book.genre.forEach((genre) => {
                        genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
                    });
                }
            });
        });

        // Obtener el título y el número de veces que aparece cada libro en finishedBooks
        const bookFrequency: Record<string, number> = {};

        users.forEach((user) => {
            user.finishedBooks?.forEach((finishedBook) => {
                const book = books.find((book) => book.id === finishedBook.idBook);
                if (book) {
                    const { title, idBook } = finishedBook;
                    const bookKey = `${title} (${idBook})`;
                    bookFrequency[bookKey] = (bookFrequency[bookKey] || 0) + 1;
                }
            });
        });

        // Encontrar el género más utilizado
        this.mostUsedGenre = Object.keys(genreFrequency).reduce((a, b) =>
            genreFrequency[a] > genreFrequency[b] ? a : b
        );

        const idBookFrequency: Record<string, number> = {};

        users.forEach((user) => {
            user.finishedBooks?.forEach((finishedBook) => {
                const { idBook } = finishedBook;
                idBookFrequency[idBook] = (idBookFrequency[idBook] || 0) + 1;
            });
        });
    }

}

