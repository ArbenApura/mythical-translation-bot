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
const INPUT_EL = '#baidu_translate_input',
    OUTPUT_EL = '.target-output',
    WARNING_EL = '.fanyi-message-content',
    RESET_EL = '.textarea-clear-btn',
    MAX_LENGTH = 2000,
    URL = 'https://fanyi.baidu.com/#cht/en/';

// FUNCTIONS
const evaluateOutputEl = async (page: Page, source: string) => {
    const sourceLines = source.split(/[\n\r]+/g);
    await page.waitForFunction(`(() => {
        let els = document.querySelectorAll('${OUTPUT_EL}');
        let wel = document.querySelectorAll('${WARNING_EL}');
        return wel.textContent || ${sourceLines.length} === els.length;
    })()`);
};
const translateByChunks = async (page: Page, chunks: string[][]) => {
    let translation = '';
    for (let i = 0; i < chunks.length; i++) {
        if (i !== 0) await page.$eval(RESET_EL, (el: any) => el.click());
        let chunk = chunks[i].join('\n\n');
        await page.type(INPUT_EL, chunk);
        await evaluateOutputEl(page, chunk);
        translation += await page.$$eval(OUTPUT_EL, (els) =>
            els.map((el) => el.textContent).join('\n\n')
        );
        if (i + 1 !== chunks.length) translation += '\n\n';
    }
    return translation;
};
const translateAll = async (page: Page, raw: string) => {
    await page.type(INPUT_EL, raw);
    await evaluateOutputEl(page, raw);
    let translation = await page.$$eval(OUTPUT_EL, (els) =>
        els.map((el) => el.textContent).join('\n\n')
    );
    return translation;
};
const translateWithBaidu = async (page: Page, raw: string) => {
    try {
        notif('Translating with Baidu...');
        await page.goto(URL);
        let translation =
            raw.length > MAX_LENGTH
                ? await translateByChunks(page, splitRaw(raw))
                : await translateAll(page, raw);
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
