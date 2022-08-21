// IMPORTED TOOLS
import { clear, error, pressAnyKey } from '../../utils';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';
// IMPORTED FUNCTIONS
import mergeTranslations from './mergeTranslations';
import sanitizeContent from './sanitizeContent';
import publishDraft from './publishDraft';
import clearDraft from './clearDraft';

// FUNCTIONS
const displayUtilities = async () => {
    try {
        do {
            clear();
            const { response } = await prompts(
                {
                    type: 'select',
                    name: 'response',
                    message: 'Utilities',
                    choices: [
                        {
                            title: 'Merge',
                            value: 'merge',
                            description:
                                'Merge all translations and save to [Draft/draft.txt].',
                        },
                        {
                            title: 'Sanitize',
                            value: 'sanitize',
                            description: 'Filter punctuations and trim lines.',
                        },
                        {
                            title: 'Publish',
                            value: 'publish',
                            description:
                                'Move [Draft/draft.txt] to [Published/*.txt]',
                        },
                        {
                            title: 'Clear',
                            value: 'clear',
                            description: 'Clear all files under [Draft/*.txt].',
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
                case 'merge':
                    await mergeTranslations();
                    break;
                case 'sanitize':
                    await sanitizeContent();
                    break;
                case 'publish':
                    await publishDraft();
                    break;
                case 'clear':
                    await clearDraft();
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
export default displayUtilities;
