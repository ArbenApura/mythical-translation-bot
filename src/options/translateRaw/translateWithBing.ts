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
const OUTPUT_EL = '#tta_output_ta',
    TIMEOUT = 5000,
    MAX_LENGTH = 1000,
    TARGET_URL = 'https://www.bing.com/translator?from=&to=en&text=';

// FUNCTIONS
const evaluateOutputEl = async (page: Page, source: string) => {
    const sourceLines = source.split(/[\n\r]+/g);
    await page.waitForFunction(
        `(() => {
        const output = document.querySelector('${OUTPUT_EL}').value;
        const outputLines = output.split(${/[\n\r]+/g});
        return ${sourceLines.length} === outputLines.length;
    })()`,
        { timeout: TIMEOUT }
    );
};
const translateByChunks = async (page: Page, chunks: string[][]) => {
    let translation = '';
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i].join('\n\n');
        await page.goto(
            TARGET_URL + encodeURIComponent(chunks[i].join('\n\n'))
        );
        await evaluateOutputEl(page, chunk);
        translation += await page.$eval(OUTPUT_EL, (el: any) => el.value);
        if (i + 1 !== chunks.length) translation += '\n\n';
    }
    return translation;
};
const translateAll = async (page: Page, raw: string) => {
    await page.goto(TARGET_URL + raw);
    await evaluateOutputEl(page, raw);
    return await page.$eval(OUTPUT_EL, (el: any) => el.value);
};
const translateWithBing = async (page: Page, raw: string) => {
    try {
        notif('Translating with Bing...');
        let translation =
            raw.length > MAX_LENGTH
                ? await translateByChunks(page, splitRaw(raw))
                : await translateAll(page, encodeURIComponent(raw));
        if (!translation.match(/\w/g)) throw new Error('No translation found!');
        await writeFile(draft.bing, sanitizeContent(translation));
        sccss('Translated with Bing successfully!');
    } catch (err: any) {
        error('Bing translation failure!');
        error(err.message);
        const { isConfirmed } = await prompts({
            type: 'confirm',
            name: 'isConfirmed',
            message: 'Do you want to retry?',
            initial: true,
        });
        if (isConfirmed) await translateWithBing(page, raw);
    }
};
export default translateWithBing;
