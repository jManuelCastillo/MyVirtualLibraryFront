export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  description: string
  ISBN: string;
  numberOfBooks: string;
  publish_date: Date;
  genre: string[];
  files: Files[];
  image: string;
  authorImage: string;
  pages: number;
}
    
export interface Files {
  format: string,
  route: string
}