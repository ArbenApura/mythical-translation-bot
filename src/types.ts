export * from './utils/config/types';
export * from './utils/dictionary/types';

export type Source =
    | 'baidu'
    | 'bing'
    | 'deepl'
    | 'google'
    | 'mymemory'
    | 'reverso'
    | 'yandex';
export type DraftFile = Source | 'raw' | 'draft';
export type RootDirectory = 'draft' | 'published' | 'assets';
export interface Chapter {
    title: string;
    href: string;
}
export type Catalog = Chapter[];
