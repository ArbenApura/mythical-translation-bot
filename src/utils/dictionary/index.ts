// IMPORTED TYPES
import type { Dictionary, DictionaryWordExtra } from './types';
// IMPORTED TOOLS
import { writeFile, extractContent, isFileExists } from '..';
import { assets, draft, DICTIONARY_TEMPLATE } from '../../variables';

// FUNCTIONS
export const createDictionary = async () => {
    await writeFile(assets.dictionary, DICTIONARY_TEMPLATE);
    return JSON.parse(DICTIONARY_TEMPLATE) as Dictionary;
};
export const getDictionary = async () => {
    if (await isFileExists(assets.dictionary))
        return JSON.parse(
            await extractContent(assets.dictionary)
        ) as Dictionary;
    else return await createDictionary();
};
export const createDictionaryRegex = async () => {
    const patterns = 'return () => []';
    await writeFile(assets.dictionaryRegex, patterns);
    return [];
};
export const getDictionaryRegex = async () => {
    if (await isFileExists(assets.dictionaryRegex))
        return await new Function(
            await extractContent(assets.dictionaryRegex)
        )()();
    else return await createDictionaryRegex();
};
export const editDictionary = async (dictionary: Dictionary) => {
    await writeFile(assets.dictionary, JSON.stringify(dictionary, null, 4));
    await useDictionaryToDraft();
};
export const getCategories = async () => {
    const { categories } = await getDictionary();
    return categories.map(({ category }) => category);
};
export const getWords = async () => {
    const words: DictionaryWordExtra[] = [];
    const { categories } = await getDictionary();
    categories.map(({ category, words: d_words }) =>
        d_words.map(({ word, definitions }) =>
            words.push({ category, word, definitions })
        )
    );
    return words;
};
export const getWord = async (word: string) => {
    const words = await getWords();
    if (!words.map(({ word }) => word).includes(word))
        throw new Error('Word was not found!');
    for (let i = 0; i < words.length; i++) {
        if (words[i].word === word) return words[i];
    }
    throw new Error('Word was not found!');
};
export const createWord = async (
    word: string,
    definitions: string[],
    category: string
) => {
    const dictionary = await getDictionary();
    const categories = await getCategories();
    const words = await getWords();
    if (words.map(({ word }) => word).includes(word))
        throw new Error('Word already exists!');
    if (categories.includes(category)) {
        dictionary.categories = dictionary.categories.map((d_category) => {
            if (d_category.category === category)
                d_category.words.push({ word, definitions });
            return d_category;
        });
    } else {
        dictionary.categories.push({
            category,
            words: [{ word, definitions }],
        });
    }
    await editDictionary(dictionary);
};
export const deleteWord = async (word: string) => {
    const dictionary = await getDictionary();
    const words = await getWords();
    let category = '';
    words.forEach((d_word) => {
        if (d_word.word === word) category = d_word.category;
    });
    if (category === '') throw new Error('Word was not found!');
    dictionary.categories = dictionary.categories.map((d_category) => {
        if (d_category.category === category) {
            d_category.words = d_category.words.filter(
                (d_word) => d_word.word !== word
            );
            return d_category;
        } else return d_category;
    });
    await editDictionary(dictionary);
};
export const createCategory = async (category: string) => {
    const dictionary = await getDictionary();
    const categories = await getCategories();
    if (categories.includes(category))
        throw new Error('Category already exists!');
    dictionary.categories.push({ category, words: [] });
    await editDictionary(dictionary);
};
export const deleteCategory = async (category: string) => {
    const dictionary = await getDictionary();
    const categories = await getCategories();
    if (!categories.includes(category))
        throw new Error('Category was not found!');
    dictionary.categories = dictionary.categories.filter(
        (d_category) => d_category.category !== category
    );
    await editDictionary(dictionary);
};
export const useDictionary = async (content: string) => {
    const { categories } = await getDictionary();
    categories.forEach(({ words }) => {
        words.forEach(({ word, definitions }) => {
            definitions.forEach((definition) => {
                content = content.replace(
                    new RegExp(`\\W(${definition})\\W`, 'gi'),
                    (v: string) => v[0] + word + v[v.length - 1]
                );
            });
        });
    });
    return await useDictionaryRegex(content);
};
export const useDictionaryRegex = async (content: string) => {
    if (!content) return content;
    const patterns = await getDictionaryRegex();
    patterns.map(
        (pattern: any) => (content = content.replace(pattern[0], pattern[1]))
    );
    return content;
};
export const useDictionaryToDraft = async () => {
    let content = await extractContent(draft.draft);
    content = await useDictionary(content);
    await writeFile(draft.draft, content);
};
