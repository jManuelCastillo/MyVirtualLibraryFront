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
  physicalBook: boolean;
  isAvailable: boolean; 
  isNotAvailableReason?: Data;
}
    
export interface Data {
  name: string,
  id: string
}

export interface Files {
  format: string,
  route: string
}