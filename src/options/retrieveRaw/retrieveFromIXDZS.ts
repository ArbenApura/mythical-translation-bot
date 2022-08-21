// IMPORTED LIB-TYPES
import type { Page } from 'puppeteer';
// IMPORTED TYPES
import type { Catalog, Chapter } from '../../types';
// IMPORTED TOOLS
import { error, notif, clear, getConfig } from '../../utils';
// IMPORTED FUNCTIONS
import prompts from 'prompts';

// FUNCTIONS
const retrieveCatalog = async (page: Page) => {
    const {
        webscraping: { retriever },
    } = await getConfig();
    await page.goto(retriever.url);
    const catalog = await page.$$eval('#a-list .u-chapter a', (els) =>
        els.map((el: any) => ({
            title: el.textContent,
            href: el.href,
        }))
    );
    return catalog as Catalog;
};
const retrieveRaw = async (page: Page, chapter: Chapter) => {
    let raw = chapter.title + '\n\n';
    await page.goto(chapter.href);
    const lines = await page.$$eval('.page-content p', (els) =>
        els.map((el, index) => {
            if (el.classList.contains('abg')) return '';
            let line = el.textContent || '';
            if (line && index + 1 !== els.length) line += '\n\n';
            return line;
        })
    );
    lines.map((line) => {
        if (raw) raw += line;
    });
    return raw;
};
const selectChapter = async (totalChapters: number) => {
    let { number } = await prompts(
        {
            type: 'number',
            name: 'number',
            message: 'Chapter number?',
            min: 1,
            max: totalChapters,
        },
        {
            onCancel: () => {
                throw new Error('cancelled');
            },
        }
    );
    return number;
};
const selectConfirmation = async (catalog: Catalog, number: number) => {
    let isCancelled = false;
    let { response } = await prompts(
        {
            type: 'select',
            name: 'response',
            message: catalog[number - 1].title,
            choices: [
                {
                    title: 'Confirm',
                    value: 1,
                },
                {
                    title: 'Retry',
                    value: 2,
                },
                {
                    title: 'Next',
                    value: 3,
                    disabled: number + 1 > catalog.length,
                },
                {
                    title: 'Prev',
                    value: 4,
                    disabled: number - 1 < 1,
                },
                {
                    title: 'Cancel',
                    value: 5,
                },
            ],
            initial: 0,
        },
        { onCancel: () => (isCancelled = true) }
    );
    if (isCancelled || response === 5) throw new Error('cancelled');
    return response;
};
const retrieveFromIXDZS = async (page: Page) => {
    let isConfirmed = false,
        raw = '';
    try {
        notif('Connecting to IXDZS...');
        const catalog = await retrieveCatalog(page);
        notif(`Found a total of ${catalog.length} chapters!`);
        do {
            let number = await selectChapter(catalog.length);
            do {
                clear();
                let response = await selectConfirmation(catalog, number);
                if (response === 1) {
                    isConfirmed = true;
                    notif('Retrieving raw...');
                    raw = await retrieveRaw(page, catalog[number - 1]);
                    break;
                } else if (response === 2) {
                    clear();
                    break;
                } else if (response === 3) number++;
                else if (response === 4) number--;
            } while (true);
        } while (!isConfirmed);
    } catch (err: any) {
        if (err.message !== 'cancelled') {
            error('IXDZS retrieving failure!');
            error(err.message);
        }
    } finally {
        return raw;
    }
};
export default retrieveFromIXDZS;
