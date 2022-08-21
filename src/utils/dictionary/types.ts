export interface DictionaryWord {
    word: string;
    definitions: string[];
}
export interface DictionaryWordExtra extends DictionaryWord {
    category: string;
}
export interface DictionaryCategory {
    category: string;
    words: DictionaryWord[];
}
export interface Dictionary {
    categories: DictionaryCategory[];
}
