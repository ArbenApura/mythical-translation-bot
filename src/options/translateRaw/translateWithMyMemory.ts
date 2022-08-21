// IMPORTED LIB-TYPES
import type { Page } from 'puppeteer';
// IMPORTED TOOLS
import { writeFile, notif, error, sccss, sanitizeContent } from '../../utils';
import { draft } from '../../variables';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';

// VARIABLES
const OUTPUT_EL = '#traduzioneajax',
    TARGET_URL =
        'https://mymemory.translated.net/en/Chinese-Traditional/English/';

// FUNCTIONS
const evaluateOutputEl = async (page: Page) => {
    try {
        await page.waitForFunction(
            `document.querySelector('${OUTPUT_EL}').textContent.match(${/\S/g})`
        );
        return true;
    } catch (err: any) {
        return false;
    }
};
const translateWithMyMemory = async (page: Page, raw: string) => {
    try {
        notif('Translating with MyMemory...');
        let translation = '',
            lines = raw.split(/[\n\r]+/g);
        for (let i = 0; i < lines.length; i++) {
            await page.goto(TARGET_URL + encodeURIComponent(lines[i]));
            if (await evaluateOutputEl(page))
                translation += await page.$eval(
                    OUTPUT_EL,
                    (el) => el.textContent
                );
            else translation += '...';
            if (i + 1 !== lines.length) translation += '\n\n';
        }
        if (translation.match(/\S/g) === null)
            throw new Error('No translation found!');
        await writeFile(draft.mymemory, sanitizeContent(translation));
        sccss('Translated with MyMemory successfully!');
    } catch (err: any) {
        error('MyMemory translation failure!');
        error(err.message);
        const { isConfirmed } = await prompts({
            type: 'confirm',
            name: 'isConfirmed',
            message: 'Do you want to retry?',
            initial: true,
        });
        if (isConfirmed) await translateWithMyMemory(page, raw);
    }
};
export default translateWithMyMemory;
