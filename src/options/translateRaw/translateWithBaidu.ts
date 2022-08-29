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
const OUTPUT_EL = '.target-output',
    TIMEOUT = 5000,
    MAX_LENGTH = 2000,
    TARGET_URL = 'https://fanyi.baidu.com/#auto/en/';

// FUNCTIONS
const evaluateOutputEl = async (page: Page) => {
    await page.waitForFunction(
        `(() => {
        let els = document.querySelectorAll('${OUTPUT_EL}');
        return els.length;
    })()`,
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
        translation += await page.$$eval(OUTPUT_EL, (els) =>
            els.map((el) => el.textContent).join('\n\n')
        );
        if (i + 1 !== chunks.length) translation += '\n\n';
    }
    return translation;
};
const translateAll = async (page: Page, raw: string) => {
    await page.goto(TARGET_URL + raw);
    await evaluateOutputEl(page);
    return await page.$$eval(OUTPUT_EL, (els) =>
        els.map((el) => el.textContent).join('\n\n')
    );
};
const translateWithBaidu = async (page: Page, raw: string) => {
    try {
        notif('Translating with Baidu...');
        await page.goto(TARGET_URL);
        let translation =
            raw.length > MAX_LENGTH
                ? await translateByChunks(page, splitRaw(raw))
                : await translateAll(page, encodeURIComponent(raw));
        if (!translation.match(/\w/g)) throw new Error('No translation found!');
        await writeFile(draft.baidu, sanitizeContent(translation));
        sccss('Translated with Baidu successfully!');
    } catch (err: any) {
        error('Baidu translation failure!');
        error(err.message);
        const { isConfirmed } = await prompts({
            type: 'confirm',
            name: 'isConfirmed',
            message: 'Do you want to retry?',
            initial: true,
        });
        if (isConfirmed) await translateWithBaidu(page, raw);
    }
};
export default translateWithBaidu;
