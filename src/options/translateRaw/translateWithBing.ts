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
const INPUT_EL = '#tta_input_ta',
    OUTPUT_EL = '#tta_output_ta',
    RESET_EL = '#tta_clear',
    MAX_LENGTH = 1000,
    TARGET_URL = 'https://www.bing.com/translator?from=zh-Hant&to=en';

// FUNCTIONS
const evaluateOutputEl = async (page: Page, source: string) => {
    const sourceLines = source.split(/[\n\r]+/g);
    await page.waitForFunction(`(() => {
        const output = document.querySelector('${OUTPUT_EL}').value;
        const outputLines = output.split(${/[\n\r]+/g});
        return ${sourceLines.length} === outputLines.length;
    })()`);
};
const translateByChunks = async (page: Page, chunks: string[][]) => {
    let translation = '';
    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i].join('\n\n');
        if (i !== 0) await page.$eval(RESET_EL, (el: any) => el.click());
        await page.type(INPUT_EL, chunk);
        await evaluateOutputEl(page, chunk);
        translation += await page.$eval(OUTPUT_EL, (el: any) => el.value);
        if (i + 1 !== chunks.length) translation += '\n\n';
    }
    return translation;
};
const translateAll = async (page: Page, raw: string) => {
    await page.type(INPUT_EL, raw);
    await evaluateOutputEl(page, raw);
    return await page.$eval(OUTPUT_EL, (el: any) => el.value);
};
const translateWithBing = async (page: Page, raw: string) => {
    try {
        notif('Translating with Bing...');
        await page.goto(TARGET_URL);
        let translation =
            raw.length > MAX_LENGTH
                ? await translateByChunks(page, splitRaw(raw))
                : await translateAll(page, raw);
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
