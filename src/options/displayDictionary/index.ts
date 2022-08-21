// IMPORTED TOOLS
import { clear, error, pressAnyKey } from '../../utils';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';
// IMPORTED FUNCTIONS
import displayCreate from './displayCreate';
import displaySearch from './displaySearch';
import listDictionary from './listDictionary';
import useDictionary from './useDictionary';

// FUNCTIONS
const displayDictionary = async () => {
    try {
        do {
            clear();
            const { response } = await prompts(
                {
                    type: 'select',
                    name: 'response',
                    message: 'Dictionary',
                    choices: [
                        {
                            title: 'Create',
                            value: 'create',
                        },
                        {
                            title: 'Search',
                            value: 'search',
                        },
                        {
                            title: 'List',
                            value: 'list',
                        },
                        {
                            title: 'Use',
                            value: 'use',
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
                case 'create':
                    await displayCreate();
                    break;
                case 'search':
                    await displaySearch();
                    break;
                case 'list':
                    await listDictionary();
                    break;
                case 'use':
                    await useDictionary();
                    break;
                case 'back':
                    throw new Error('cancelled');
            }
        } while (true);
    } catch (err: any) {
        if (err.message === 'cancelled') {
            clear();
        } else {
            error(err.message);
            await pressAnyKey();
        }
    }
};
export default displayDictionary;
