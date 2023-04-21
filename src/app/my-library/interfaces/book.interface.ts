export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  description: string
  ISBN: string;
  numberOfBooks: number;
  publish_date: string;
  genre: string[];
  files: Files[];
  image: string;
  authorImage: string;
  pages: number;
  taken: boolean;
}
    
export interface Files {
  format: string,
  route: string
}