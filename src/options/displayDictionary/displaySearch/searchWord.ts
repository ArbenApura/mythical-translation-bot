// IMPORTED TOOLS
import {
    notif,
    sccss,
    error,
    clear,
    divider,
    pressAnyKey,
} from '../../../utils';
import * as dictionary from '../../../utils/dictionary';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';
import chalk from 'chalk';

// FUNCTIONS
const getWordPrompt = async () => {
    const words = await dictionary.getWords();
    const { word } = await prompts(
        {
            type: 'autocomplete',
            name: 'word',
            message: 'Word?',
            choices: words.map(({ word, category }) => ({
                title: word,
                description: category + ' category',
            })),
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    return word as string;
};
const addDefinitions = async (word: string) => {
    const { definitions } = await dictionary.getWord(word);
    clear();
    console.log(chalk.cyan('[DEFINITIONS]'));
    console.log(chalk.cyan('  >'), definitions.join(', '));
    divider();
    const { n_definitions } = await prompts({
        type: 'list',
        name: 'n_definitions',
        message: 'Definitions?',
        separator: ',',
    });
    divider();
    notif('Adding definitions!');
    await dictionary.addDefinitions(word, n_definitions);
    sccss('Added successfully!');
};
const editWord = async (word: string) => {
    const categories = await dictionary.getCategories();
    const { definitions, category } = await dictionary.getWord(word);
    const { p_word, p_definitions, p_category } = await prompts([
        {
            type: 'text',
            name: 'p_word',
            message: 'Word?',
            initial: word,
        },
        {
            type: 'list',
            name: 'p_definitions',
            message: 'Definitions?',
            separator: ',',
            initial: definitions.join(', '),
        },
        {
            type: 'autocomplete',
            name: 'p_category',
            message: 'Category?',
            initial: category,
            choices: categories.map((category) => ({ title: category })),
            limit: 10,
        },
    ]);
    divider();
    notif('Editing word...');
    await dictionary.deleteWord(word);
    await dictionary.createWord(p_word, p_definitions, p_category);
    sccss('Edited successfully!');
};
const deleteWord = async (word: string) => {
    divider();
    notif('Deleting word...');
    await dictionary.deleteWord(word);
    sccss('Deleted successfully!');
};
const displayOptions = async () => {
    let word = await getWordPrompt();
    const { response } = await prompts(
        {
            type: 'select',
            name: 'response',
            message: word,
            choices: [
                {
                    title: 'Add',
                    value: 'add',
                },
                {
                    title: 'Edit',
                    value: 'edit',
                },
                {
                    title: 'Delete',
                    value: 'delete',
                },
                {
                    title: 'Back',
                    value: 'back',
                },
            ],
            initial: 0,
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    switch (response) {
        case 'add':
            await addDefinitions(word);
            break;
        case 'edit':
            await editWord(word);
            break;
        case 'delete':
            await deleteWord(word);
            break;
        case 'back':
            throw new Error('cancelled');
    }
};
const searchWord = async () => {
    try {
        await displayOptions();
        await pressAnyKey();
    } catch (err: any) {
        if (err.message !== 'cancelled') {
            error('Searching Failure!');
            error(err.message);
            await pressAnyKey();
        }
    }
};
export default searchWord;
