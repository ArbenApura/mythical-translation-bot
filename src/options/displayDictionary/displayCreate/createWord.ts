// IMPORTED TOOLS
import { notif, sccss, error, divider, pressAnyKey } from '../../../utils';
import * as dictionary from '../../../utils/dictionary';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';

// FUNCTIONS
const getWordPrompt = async () => {
    const { word } = await prompts(
        {
            type: 'text',
            name: 'word',
            message: 'Word?',
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    const words = await dictionary.getWords();
    if (words.map(({ word }) => word).includes(word))
        throw new Error('Word already exists!');
    return word as string;
};
const getDefinitionsPrompt = async () => {
    const { definitions } = await prompts(
        {
            type: 'list',
            name: 'definitions',
            message: 'Definitions?',
            separator: ',',
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    return definitions as string[];
};
const getCategoryPrompt = async () => {
    const categories = await dictionary.getCategories();
    const { category } = await prompts(
        {
            type: 'autocomplete',
            name: 'category',
            message: 'Category?',
            choices: categories.map((category) => ({ title: category })),
            limit: 5,
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    if (!category) throw new Error('Category was not found!');
    return category as string;
};
const createWord = async () => {
    try {
        await dictionary.createWord(
            await getWordPrompt(),
            await getDefinitionsPrompt(),
            await getCategoryPrompt()
        );
        divider();
        sccss('Created successfully!');
        await pressAnyKey();
    } catch (err: any) {
        if (err.message !== 'cancelled') {
            divider();
            error('Creating Failure!');
            error(err.message);
            await pressAnyKey();
        }
    }
};
export default createWord;
