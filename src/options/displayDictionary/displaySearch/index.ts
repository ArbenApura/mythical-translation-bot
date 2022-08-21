// IMPORTED TOOLS
import { clear, error, pressAnyKey } from '../../../utils';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';
// IMPORTED FUNCTIONS
import searchWord from './searchWord';
import searchCategory from './searchCategory';

// FUNCTIONS
const displaySearch = async () => {
    try {
        clear();
        const { response } = await prompts(
            {
                type: 'toggle',
                name: 'response',
                message: 'Search?',
                initial: true,
                active: 'Word',
                inactive: 'Category',
            },
            {
                onCancel: () => {
                    throw new Error('cancelled');
                },
            }
        );
        if (response) await searchWord();
        else await searchCategory();
    } catch (err: any) {
        if (err.message === 'cancelled') {
            clear();
        } else {
            error(err.message);
            await pressAnyKey();
        }
    }
};
export default displaySearch;
