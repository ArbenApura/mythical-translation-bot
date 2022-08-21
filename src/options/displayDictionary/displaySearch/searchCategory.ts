// IMPORTED TOOLS
import { notif, error, sccss, divider, pressAnyKey } from '../../../utils';
import * as dictionary from '../../../utils/dictionary';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';

// FUNCTIONS
const getCategoryPrompt = async () => {
    const categories = await dictionary.getCategories();
    const { category } = await prompts(
        {
            type: 'autocomplete',
            name: 'category',
            message: 'Category?',
            choices: categories.map((category) => ({
                title: category,
            })),
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    return category as string;
};
const editCategory = async (category: string) => {
    const { p_category } = await prompts({
        type: 'text',
        name: 'p_category',
        message: 'Category?',
        initial: category,
    });
    divider();
    notif('Editing category....');
    await dictionary.deleteCategory(category);
    await dictionary.createCategory(p_category);
    sccss('Edited successfully!');
};
const deleteCategory = async (category: string) => {
    divider();
    notif('Deleting category....');
    await dictionary.deleteCategory(category);
    sccss('Deleted successfully!');
};
const displayOptions = async () => {
    const category = await getCategoryPrompt();
    const { response } = await prompts(
        {
            type: 'select',
            name: 'response',
            message: category,
            choices: [
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
        case 'edit':
            await editCategory(category);
            break;
        case 'delete':
            await deleteCategory(category);
            break;
        case 'back':
            throw new Error('cancelled');
    }
};
const searchCategory = async () => {
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
export default searchCategory;
