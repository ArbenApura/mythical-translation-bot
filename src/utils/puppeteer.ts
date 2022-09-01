// IMPORTED TOOLS
import { getConfig } from '.';
import { roots } from '../variables';
// IMPORTED LIB-FUNCTIONS
import puppeteer from 'puppeteer';

// FUNCTIONS
export const getBrowser = async (
    mode: 'translator' | 'retriever' = 'translator'
) => {
    const { webscraping } = await getConfig();
    return await puppeteer.launch({
        headless: webscraping[mode].headless,
        executablePath: roots.chrome,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
};
