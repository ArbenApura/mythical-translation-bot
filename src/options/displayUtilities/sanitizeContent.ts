// IMPORTED TOOLS
import {
    notif,
    sccss,
    error,
    clear,
    pressAnyKey,
    extractContent,
    writeFile,
    sanitizeContent,
} from '../../utils';
import { draft } from '../../variables';

// FUNCTIONS
export default async () => {
    try {
        clear();
        notif('Extracting content...');
        let content = await extractContent(draft.draft);
        notif('Sanitizing content...');
        content = sanitizeContent(content);
        notif('Saving file...');
        await writeFile(draft.draft, content);
        sccss('Sanitized successfully!');
        await pressAnyKey();
    } catch (err: any) {
        if (err.message !== 'cancelled') {
            error('Sanitizing failure!');
            error(err.message);
            await pressAnyKey();
        } else clear();
    }
};
