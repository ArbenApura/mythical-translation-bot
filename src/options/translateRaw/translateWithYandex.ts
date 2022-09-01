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
const OUTPUT_EL = '#translation',
    TIMEOUT = 10000,
    MAX_LENGTH = 5000,
    TARGET_URL = 'https://translate.yandex.com/?lang=zh-en&text=';

// FUNCTIONS
const evaluateOutputEl = async (page: Page) => {
    const currentUrl = await page.evaluate(() => document.URL);
    if (new URL(currentUrl).pathname === '/showcaptcha')
        throw new Error('Failed to bypass security!');
    await page.waitForFunction(
        `document.querySelector('${OUTPUT_EL}').textContent.match(${/\w/g}) ? true : false`,
        { timeout: TIMEOUT }
    );
};
const translateByChunks = async (page: Page, chunks: string[][]) => {
    let translation = '';
    for (let i = 0; i < chunks.length; i++) {
        await page.goto(
            TARGET_URL + encodeURIComponent(chunks[i].join('\n\n'))
        );
        await evaluateOutputEl(page);
        translation += await page.$eval(OUTPUT_EL, (el) => el.textContent);
        if (i + 1 !== chunks.length) translation += '\n\n';
    }
    return translation;
};
const translateAll = async (page: Page, raw: string) => {
    await page.goto(TARGET_URL + raw);
    await evaluateOutputEl(page);
    return (await page.$eval(OUTPUT_EL, (el) => el.textContent)) || '';
};
const translateWithYandex = async (page: Page, raw: string) => {
    try {
        notif('Translating with Yandex...');
        let translation =
            raw.length > MAX_LENGTH
                ? await translateByChunks(page, splitRaw(raw, MAX_LENGTH))
                : await translateAll(page, encodeURIComponent(raw));
        if (!translation.match(/\w/g)) throw new Error('No translation found!');
        await writeFile(draft.yandex, sanitizeContent(translation));
        sccss('Translated with Yandex successfully!');
    } catch (err: any) {
        error('Yandex translation failure!');
        error(err.message);
        const { isConfirmed } = await prompts({
            type: 'confirm',
            name: 'isConfirmed',
            message: 'Do you want to retry?',
            initial: true,
        });
        if (isConfirmed) await translateWithYandex(page, raw);
    }
};
export default translateWithYandex;
