
  export interface Bookmark {
    userId: string;
    files: File[];
}

export interface File {
    fingerprint: string;
    sidebarView: number;
    page:        number;
    scrollLeft:  number;
    scrollTop:   number;
    rotation:    number;
    zoom:        string;
}
