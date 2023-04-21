export interface User {
    id: string;
    fullName: string;
    email:string;
    FavouritesBooks?: string[];
    admin?: boolean;
}