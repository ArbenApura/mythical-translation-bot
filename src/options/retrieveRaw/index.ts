// IMPORTED TOOLS
import {
    writeFile,
    notif,
    sccss,
    error,
    clear,
    pressAnyKey,
    getConfig,
    sanitizeContent,
    getBrowser,
} from '../../utils';
import { draft } from '../../variables';
// IMPORTED FUNCTIONS
import retrieveFromIXDZS from './retrieveFromIXDZS';

// FUNCTIONS
const retrieveRaw = async () => {
    let raw = '';
    try {
        const config = await getConfig();
        const retriever = config.webscraping.retriever;
        clear();
        notif('Launching browser...');
        const browser = await getBrowser();
        notif('Opening new page...');
        const page = await browser.newPage();
        const host = new URL(retriever.url).host;
        switch (host) {
            case 'tw.ixdzs.com':
                raw = await retrieveFromIXDZS(page);
                break;
            default:
                throw new Error(`Source(${host}) is not supported!`);
        }
        notif('Closing browser...');
        await browser.close();
        if (raw === '') return;
        notif('Saving file...');
        await writeFile(draft.raw, sanitizeContent(raw));
        sccss('Retrieved successfully!');
    } catch (err: any) {
        error('Retrieving failure!');
        error(err.message);
    } finally {
        if (raw === '') clear();
        else await pressAnyKey();
    }
};
export default retrieveRaw;
