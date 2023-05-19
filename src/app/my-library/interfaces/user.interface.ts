export interface UserIt {
    id: string;
    fullName: string;
    email:string;
    favouritesBooks?: BookInfo[];
    admin?: boolean;
    finishedBooks?: BookInfo[];
}

export interface BookInfo {
    idBook: string,
    title: string
}