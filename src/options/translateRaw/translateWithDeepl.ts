// IMPORTED LIB-TYPES
import type { Page } from 'puppeteer';
// IMPORTED TOOLS
import {
    writeFile,
    notif,
    sccss,
    error,
    splitRaw,
    sanitizeContent,
} from '../../utils';
import { draft } from '../../variables';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';

// VARIABLES
const OUTPUT_EL = '.lmt__target_textarea',
    TIMEOUT = 10000,
    MAX_LENGTH = 5000,
    TARGET_URL = 'https://www.deepl.com/translator#auto/en/';

// FUNCTIONS
const evaluateOutputEl = async (page: Page) =>
    await page.waitForFunction(
        `document.querySelector('${OUTPUT_EL}').value !== ''`,
        { timeout: TIMEOUT }
    );
const translateByChunks = async (page: Page, chunks: string[][]) => {
    let translation = '';
    for (let i = 0; i < chunks.length; i++) {
        await page.goto(
            TARGET_URL + encodeURIComponent(chunks[i].join('\n\n'))
        );
        await evaluateOutputEl(page);
        translation += await page.$eval(OUTPUT_EL, (el: any) => el.value);
        if (i + 1 !== chunks.length) translation += '\n\n';
    }
    return translation;
};
const translateAll = async (page: Page, raw: string) => {
    await page.goto(TARGET_URL + raw);
    await evaluateOutputEl(page);
    return await page.$eval(OUTPUT_EL, (el: any) => el.value);
};
const translateWithDeepl = async (page: Page, raw: string) => {
    try {
        notif('Translating with Deepl...');
        let translation =
            raw.length > MAX_LENGTH
                ? await translateByChunks(page, splitRaw(raw, MAX_LENGTH))
                : await translateAll(page, encodeURIComponent(raw));
        if (!translation.match(/\w/g)) throw new Error('No translation found!');
        await writeFile(draft.deepl, sanitizeContent(translation));
        sccss('Translated with Deepl successfully!');
    } catch (err: any) {
        error('Deepl translation failure!');
        error(err.message);
        const { isConfirmed } = await prompts({
            type: 'confirm',
            name: 'isConfirmed',
            message: 'Do you want to retry?',
            initial: true,
        });
        if (isConfirmed) await translateWithDeepl(page, raw);
    }
};
export default translateWithDeepl;
