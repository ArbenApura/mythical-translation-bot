// IMPORTED TOOLS
import { clear, error, pressAnyKey } from '../../../utils';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';
// IMPORTED FUNCTIONS
import createWord from './createWord';
import createCategory from './createCategory';

// FUNCTIONS
const displayCreate = async () => {
    try {
        clear();
        const { response } = await prompts(
            {
                type: 'toggle',
                name: 'response',
                message: 'Create?',
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
        if (response) await createWord();
        else await createCategory();
    } catch (err: any) {
        if (err.message === 'cancelled') {
            clear();
        } else {
            error(err.message);
            await pressAnyKey();
        }
    }
};
export default displayCreate;
