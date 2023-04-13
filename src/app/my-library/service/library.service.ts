import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from '../interfaces/book.interface';
import { APIBook } from '../interfaces/apiBook.interface';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  currentPdf!: string;

  constructor(private http: HttpClient) { }

  private url: string = "https://openlibrary.org/api/books?bibkeys=title:";

  bookListService: Book[] = bookList;
  tempBooks!: APIBook;

  postBook(tempBook: APIBook) {
    console.log(tempBook.data.title)
  }

  getBookFromApi(title :string): Observable<APIBook> {
    return this.http.get<APIBook>(`${this.url}${title}&jscmd=data&format=json`);
  }
}

const bookList: Book[] = [

  {
    id: "1",
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    publisher: 'DAW Books',
    ISBN: '978-0-7564-0407-9',
    numberOfBooks: '2',
    publish_date: new Date('2007-03-27'),
    genre: ['Fantasy'],
    files: [{ format: 'pdf', route: '/assets/pdfs/aaa.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://th.bing.com/th/id/OIP.48swydL7qvLqq5zQjgnBawAAAA?pid=ImgDet&rs=1',
    pages: 123,
    description: 'The Name of the Wind is a fantasy novel by Patrick Rothfuss. It is the first book in the Kingkiller Chronicle series, followed by The Wise Man\'s Fear. The story is about a young man named Kvothe, who tells his life story to a chronicler named Devan Lochees, also known as "the Chronicler."'
  },

  {
    id: "2",
    title: 'The Wise Man\'s Fear',
    author: 'Patrick Rothfuss',
    publisher: 'DAW Books',
    ISBN: '978-0-7564-0571-7',
    numberOfBooks: '2',
    publish_date: new Date('2011-03-01'),
    genre: ['Fantasy'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://books.google.es/books/content?id=2euKXB-3_aoC&hl=es&pg=PP1&img=1&zoom=3&bul=1&sig=ACfU3U3C2i6PaG6hc8GTlYKfJ6iUSIPi9g&w=1280',
    pages: 678,
    description: 'The Wise Man\'s Fear is a fantasy novel by Patrick Rothfuss, the second book in the Kingkiller Chronicle series. It continues the story of Kvothe, who is now a student at the University and embarks on various adventures.'
  },
  {
    id: "3",
    title: 'El señor de los anillos - Las dos torres.mobi',
    author: 'J.R.R. Tolkien',
    publisher: 'George Allen & Unwin',
    ISBN: '978-0-618-25761-3',
    numberOfBooks: '3',
    publish_date: new Date('1954-11-11'),
    genre: ['Fantasy'],
    files: [
      { format: 'epub', route: '../../../assets/epubs/El señor de los anillos - Las dos torres.epub' },
      { format: 'mobi', route: '../../../assets/mobis/El señor de los anillos - Las dos torres.mobi' }],
    image: 'https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81HfbQ8F2UL.jpg',
    pages: 745,
    description: 'The Two Towers is the second volume of J. R. R. Tolkien´s high fantasy novel The Lord of the Rings.'
  },
  {
    id: "4",
    title: 'El señor de los anillos - El retorno del Rey',
    author: 'J.R.R. Tolkien',
    publisher: 'George Allen & Unwin',
    ISBN: '978-0-618-25762-0',
    numberOfBooks: '3',
    publish_date: new Date('1955-10-20'),
    genre: ['Fantasy'],
    files: [
      { format: 'epub', route: '../../../assets/epubs/El señor de los anillos - El retorno del Rey.epub' },
      { format: 'mobi', route: '../../../assets/mobis/El señor de los anillos - El retorno del Rey.mobi' }],
    image: 'https://pictures.abebooks.com/isbn/9780007123803-es.jpg',
    pages: 345,
    description: 'The Return of the King is the third and final volume of J. R. R. Tolkien´s The Lord of the Rings.'
  },
  {
    id: "5",
    title: 'El psicoanalista',
    author: 'Katzenbach, John',
    publisher: 'Planeta',
    ISBN: '978-0-452-28423-4',
    numberOfBooks: '1',
    publish_date: new Date('2014-04-08'),
    genre: ['Dystopian'],
    files: [{ format: 'pdf', route: '/assets/pdfs/El psicoanalista.pdf' }],
    image: '../../../assets/images/covers/El psicoanalista.jpg',
    pages: 564,
    description: 'El año en que esperaba morir se pasó la mayor parte de su quincuagésimo tercer cumpleaños como la mayoría de los demás días, oyendo a la gente quejarse de su madre. Madres desconsideradas, madres crueles, madres sexualmente provocativas. Madres fallecidas que seguían vivas en la mente de sus hijos. Madres vivas a las que sus hijos querían matar. El señor Bishop, en particular, junto con la señorita Levy y el realmente desafortunado Roger Zimmerman, que compartía su piso del Upper West Side y al parecer su vida cotidiana y sus vívidos sueños con una mujer de mal genio, manipuladora e hipocondríaca que parecía empeñada en arruinar hasta el menor intento de independizarse de su hijo, dedicaron sus sesiones a echar pestes contra las mujeres que los habían traído al mundo..'
  },
  {
    id: "6",
    title: 'Jurassic Park',
    author: 'Michael Crichton',
    publisher: 'Alfred A. Knopf',
    ISBN: '978-0-394-58816-3',
    numberOfBooks: '2',
    publish_date: new Date('1990-11-20'),
    genre: ['Science Fiction'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://books.google.es/books/publisher/content?id=DNXYCQAAQBAJ&hl=es&pg=PP1&img=1&zoom=3&bul=1&sig=ACfU3U0w2fqgGlOIHn5pPttxWOdBIPIrKA&w=1280',
    pages: 345,
    description: "Jurassic Park es una novela de ciencia ficción escrita por Michael Crichton. La historia se desarrolla en una isla donde un excéntrico empresario ha creado un parque temático lleno de dinosaurios clonados. Sin embargo, cuando el sistema de seguridad del parque falla, los dinosaurios escapan y comienzan a aterrorizar a los visitantes. La novela es conocida por su estilo de suspenso y su representación científica de los dinosaurios."
  },
  {
    id: "7",
    title: 'Do Androids Dream of Electric Sheep?',
    author: 'Philip K. Dick',
    publisher: 'Doubleday',
    ISBN: '978-0-345-34199-8',
    numberOfBooks: '1',
    publish_date: new Date('1968-06-10'),
    genre: ['Science Fiction'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/do-androids-dream-of-electric-sheep.jpg',
    pages: 345,
    description: " Fue publicado por Doubleday en 1968 y cuenta la historia de Rick Deckard, un cazador de recompensas que es contratado para \"retirar\" a unos replicantes rebeldes en una Tierra post-apocalíptica. La novela explora temas como la naturaleza de la realidad, la conciencia y la identidad."
  },
  {
    id: "8",
    title: 'Ender\'s Game',
    author: 'Orson Scott Card',
    publisher: 'Tor Books',
    ISBN: '978-0-312-93208-4',
    numberOfBooks: '1',
    publish_date: new Date('1985-08-15'),
    genre: ['Science Fiction'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/enders-game.jpg',
    pages: 124,
    description: "Fue publicado por Tor Books en 1985 y sigue la historia de Andrew \"Ender\" Wiggin, un niño prodigio reclutado por la Escuela de Batalla para entrenar como comandante de la flota en una guerra futura contra una raza alienígena conocida como los Insectores. La novela explora temas como la ética militar, la inteligencia artificial y la naturaleza de la violencia."
  },
  {
    id: "9",
    title: 'The Martian',
    author: 'Andy Weir',
    publisher: 'Crown Publishing Group',
    ISBN: '978-0-8041-3902-1',
    numberOfBooks: '1',
    publish_date: new Date('2011-09-27'),
    genre: ['Science Fiction'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/the-martian.jpg',
    pages: 564,
    description: "The Martian es una novela de ciencia ficción escrita por Andy Weir. La historia sigue a Mark Watney, un astronauta que es abandonado en Marte después de una misión espacial fallida. Con recursos limitados, Watney debe encontrar la manera de sobrevivir en el planeta y comunicarse con la Tierra para ser rescatado. La novela es conocida por su precisión científica y su estilo humorístico."
  },
  {
    id: "10",
    title: 'The Hitchhiker\'s Guide to the Galaxy',
    author: 'Douglas Adams',
    publisher: 'Pan Books',
    ISBN: '978-1-84990-674-0',
    numberOfBooks: '5',
    publish_date: new Date('1979-10-12'),
    genre: ['Science Fiction'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/the-hitchhikers-guide-to-the-galaxy.jpg',
    pages: 345,
    description: " Fue publicado por Pan Books en 1979 y es parte de una serie de cinco libros. La historia sigue las aventuras de Arthur Dent, un humano común que es arrastrado al espacio por su amigo extraterrestre Ford Prefect, justo antes de que la Tierra sea destruida para construir una autopista hiperespacial. El libro es una comedia satírica que explora temas como la filosofía, la tecnología y la cultura."
  },

  {
    id: "11",
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    publisher: 'Doubleday',
    ISBN: '978-0-385-50420-8',
    numberOfBooks: '1',
    publish_date: new Date('2003-03-18'),
    genre: ['Mystery'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/the-da-vinci-code.jpg',
    pages: 654,
    description: "Jurassic Park es una novela de ciencia ficción escrita por Michael Crichton. La historia se desarrolla en una isla donde un excéntrico empresario ha creado un parque temático lleno de dinosaurios clonados. Sin embargo, cuando el sistema de seguridad del parque falla, los dinosaurios escapan y comienzan a aterrorizar a los visitantes. La novela es conocida por su estilo de suspenso y su representación científica de los dinosaurios."
  },
  {
    id: "12",
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    publisher: 'Collins Crime Club',
    ISBN: '978-0-00-752750-2',
    numberOfBooks: '1',
    publish_date: new Date('1934-01-01'),
    genre: ['Mystery'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/murder-on-the-orient-express.jpg',
    pages: 345,
    description: "Murder on the Orient Express by Agatha Christie is a classic mystery novel published by Collins Crime Club. The book tells the story of detective Hercule Poirot as he investigates the murder of a wealthy American aboard the luxurious Orient Express train. With a limited number of suspects and a seemingly impossible crime scene, Poirot must use all his wits to solve the case before the killer strikes again. "
  },
  {
    id: "13",
    title: 'El señor de los anillos - La comunidad del anillo',
    author: 'J.R.R. Tolkien',
    publisher: 'George Allen & Unwin',
    ISBN: '978-0-00-712401-6',
    numberOfBooks: '3',
    publish_date: new Date('1954-07-29'),
    genre: ['Fantasy'],
    files: [
      { format: 'epub', route: '../../../assets/epubs/El señor de los anillos - La comunidad del anillo.epub' },
      { format: 'mobi', route: '../../../assets/mobis/El señor de los anillos - La comunidad del anillo.mobi' }],
    image: 'https://www.example.com/the-lord-of-the-rings.jpg',
    pages: 123,
    description: "The Lord of the Rings by J.R.R. Tolkien is a legendary fantasy trilogy published by George Allen & Unwin. The series follows hobbit Frodo Baggins as he embarks on a quest to destroy the One Ring and defeat the dark lord Sauron. Along the way, he is joined by a diverse cast of characters, including elves, dwarves, humans, and wizards, who help him navigate the treacherous landscape of Middle-earth."
  },
  {
    id: "14",
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    publisher: 'DAW Books',
    ISBN: '978-0-7564-0407-9',
    numberOfBooks: '2',
    publish_date: new Date('2007-03-27'),
    genre: ['Fantasy'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/the-name-of-the-wind.jpg',
    pages: 194,
    description: "The Name of the Wind by Patrick Rothfuss is a highly acclaimed fantasy novel published by DAW Books. The book tells the story of Kvothe, a legendary magician and musician, as he recounts his adventures to a chronicler. Through Kvothe's eyes, readers are transported to a richly imagined world filled with magic, music, and danger. "
  },
  {
    id: "15",
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    publisher: 'Bloomsbury',
    ISBN: '978-1-4088-5612-8',
    numberOfBooks: '7',
    publish_date: new Date('1997-06-26'),
    genre: ['Fantasy'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/harry-potter-and-the-philosophers-stone.jpg',
    pages: 312,
    description: 'The first book in the Harry Potter series, following the adventures of an orphaned boy who discovers he is a wizard and attends a school of magic. Harry makes new friends and enemies, and learns about the dark wizard who killed his parents and wants to destroy him.'

  },
  {
    id: "16",
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    publisher: 'Scholastic',
    ISBN: '978-0-439-02348-1',
    numberOfBooks: '3',
    publish_date: new Date('2008-09-14'),
    genre: ['Young Adult'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/the-hunger-games.jpg',
    pages: 234,
    description: 'The first book in the Harry Potter series, following the adventures of an orphaned boy who discovers he is a wizard and attends a school of magic. Harry makes new friends and enemies, and learns about the dark wizard who killed his parents and wants to destroy him.'
  },

  {
    id: "17",
    title: 'Divergent',
    author: 'Veronica Roth',
    publisher: 'Katherine Tegen Books',
    ISBN: '978-0-06-202403-9',
    numberOfBooks: '3',
    publish_date: new Date('2011-04-25'),
    genre: ['Young Adult'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/divergent.jpg',
    pages: 523,
    description: 'The first book in the Harry Potter series, following the adventures of an orphaned boy who discovers he is a wizard and attends a school of magic. Harry makes new friends and enemies, and learns about the dark wizard who killed his parents and wants to destroy him.'
  },
  {
    id: "18",
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publisher: 'J. B. Lippincott & Co.',
    ISBN: '978-0-446-31078-9',
    numberOfBooks: '1',
    publish_date: new Date('1960-07-11'),
    genre: ['Classic'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/to-kill-a-mockingbird.jpg',
    pages: 123,
    description: 'To Kill a Mockingbird is a novel by Harper Lee, published in 1960. It is set in the Deep South and explores themes of racial injustice, class, and gender roles. The story is told from the perspective of a young girl named Scout Finch, as she grows up and learns about the world around her.'
  },
  {
    id: "19",
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publisher: 'T. Egerton, Whitehall',
    ISBN: '978-1-85326-118-9',
    numberOfBooks: '1',
    publish_date: new Date('1813-01-28'),
    genre: ['Classic'],
    files: [{ format: 'pdf', route: '/assets/pdfs/crm.pdf' }, { format: 'epub', route: '' }, { format: 'mobi', route: '' }],
    image: 'https://www.example.com/pride-and-prejudice.jpg',
    pages: 123,
    description: 'Pride and Prejudice is a novel by Jane Austen, published in 1813. It follows the story of Elizabeth Bennet, a young woman in 19th century England, and her journey through the social mores and class structure of her society. The novel is a commentary on the society of the time, as well as a romantic story.'
  }
] 
