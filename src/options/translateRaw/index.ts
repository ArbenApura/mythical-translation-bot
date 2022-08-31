// IMPORTED TYPES
import type { Source } from '../../types';
// IMPORTED LIB-TYPES
import { Page } from 'puppeteer';
// IMPORTED TOOLS
import {
    notif,
    error,
    clear,
    pressAnyKey,
    extractContent,
    isFileEmpty,
    getConfig,
    getBrowser,
} from '../../utils';
import { draft } from '../../variables';
// IMPORTED FUNCTIONS
import translateWithBaidu from './translateWithBaidu';
import translateWithBing from './translateWithBing';
import translateWithDeepl from './translateWithDeepl';
import translateWithGoogle from './translateWithGoogle';
import translateWithYandex from './translateWithYandex';

// TYPES
interface SourceEntry {
    source: Source;
    execute: (page: Page, raw: string) => Promise<void>;
}

// VARIABLES
const sourceEntries: SourceEntry[] = [
    { source: 'baidu', execute: translateWithBaidu },
    { source: 'bing', execute: translateWithBing },
    { source: 'deepl', execute: translateWithDeepl },
    { source: 'google', execute: translateWithGoogle },
    { source: 'yandex', execute: translateWithYandex },
];

// FUNCTIONS
const translateSources = async (page: Page) => {
    const config = await getConfig();
    const sources = config.webscraping.translator.sources;
    const raw = await extractContent(draft.raw);
    if (raw === '') throw new Error('Raw has no content!');
    for (let i = 0; i < sourceEntries.length; i++) {
        const { source, execute } = sourceEntries[i];
        if (sources[source] && (await isFileEmpty(draft[source])))
            await execute(page, raw);
    }
};
const translateRaw = async () => {
    try {
        clear();
        notif('Launching browser...');
        const browser = await getBrowser();
        notif('Opening new page...');
        const page = await browser.newPage();
        notif('Translating raw...');
        await translateSources(page);
        notif('Closing browser...');
        await browser.close();
        notif('Translation finished!');
    } catch (err: any) {
        error('Translating failure!');
        error(err.message);
    } finally {
        await pressAnyKey();
    }
};
export default translateRaw;
