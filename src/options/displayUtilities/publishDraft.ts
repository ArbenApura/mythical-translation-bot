// IMPORTED TOOLS
import {
    notif,
    sccss,
    error,
    clear,
    divider,
    pressAnyKey,
    extractContent,
    writeFile,
    clearDraft,
} from '../../utils';
import { draft, roots } from '../../variables';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';

// FUNCTIONS
const getTitlePrompt = async () => {
    const { title } = await prompts(
        {
            type: 'text',
            name: 'title',
            message: 'Chapter title?',
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    return title as string;
};
const publishDraft = async () => {
    try {
        clear();
        const title = await getTitlePrompt();
        divider();
        notif('Extracting draft...');
        const content = await extractContent(draft.draft);
        notif('Publishing draft...');
        await writeFile(`${roots.published}/${title}.txt`, content);
        notif('Clearing draft...');
        await clearDraft();
        sccss('Published successfully!');
        await pressAnyKey();
    } catch (err: any) {
        if (err.message === 'cancelled') {
            clear();
        } else {
            error('Publishing failure!');
            error(err.message);
            await pressAnyKey();
        }
    }
};
export default publishDraft;
