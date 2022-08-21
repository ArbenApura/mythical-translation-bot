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

// FUNCTIONS
const getCategory = async () => {
    const { category } = await prompts(
        {
            type: 'text',
            name: 'category',
            message: 'Category?',
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    if (!category) throw new Error('Category was not found!');
    const categories = await dictionary.getCategories();
    if (categories.includes(category))
        throw new Error('Category already exists!');
    return category as string;
};
const createCategory = async () => {
    try {
        clear();
        await dictionary.createCategory(await getCategory());
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
export default createCategory;
