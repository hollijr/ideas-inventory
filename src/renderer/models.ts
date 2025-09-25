export enum ViewType {
    LIST = 'list',
    GRID = 'grid'
}

export interface CookieIdea {
    name: string;
    cutter: string;
    ideaImage: string;
    cutterImage: string;
    tags: string[];
}

export interface CookieItem {
    ideaName: string;
    ideaImage: string;
    tags: string[];
    cutterName: string;
    cutterImage: string;
}

export interface Filter {
    [key: string]: string;
}