// IMPORTED TOOLS
import {
    pressAnyKey,
    notif,
    sccss,
    error,
    clear,
    clearDraft,
} from '../../utils';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';

// FUNCTIONS
const getConfirmationPrompt = async () => {
    const { isConfirmed } = await prompts(
        {
            type: 'confirm',
            name: 'isConfirmed',
            message: 'Are you sure you want to clear draft?',
            initial: true,
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    if (!isConfirmed) throw new Error('cancelled');
};
export default async () => {
    try {
        clear();
        await getConfirmationPrompt();
        notif('Clearing draft...');
        await clearDraft();
        sccss('Cleared successfully!');
        await pressAnyKey();
    } catch (err: any) {
        if (err.message === 'cancelled') {
            clear();
        } else {
            error('Clearing failure!');
            error(err.message);
            await pressAnyKey();
        }
    }
};
