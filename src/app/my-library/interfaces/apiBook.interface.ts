export interface APIBook {
    data: Data;
}

export interface Data {
    url:            string;
    key:            string;
    title:          string;
    authors:        Info[];
    identifiers:    Identifiers;
    publishers:     Publisher[];
    publish_date:   string;
    subjects:       Info[];
    number_of_pages: number,
    subject_places: Info[];
    subject_people: Info[];
    excerpts:       Excerpt[];
    links:          Link[];
    cover:          Cover;
}

export interface Info {
    url:  string;
    name: string;
}

export interface Cover {
    small:  string;
    medium: string;
    large:  string;
}

export interface Excerpt {
    text:    string;
    comment: string;
}

export interface Identifiers {
    isbn_10:     string[];
    isbn_13:     string[];
    openlibrary: string[];
}

export interface Link {
    title: string;
    url:   string;
}

export interface Publisher {
    name: string;
}
