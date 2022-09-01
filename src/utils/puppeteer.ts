// IMPORTED TOOLS
import { getConfig } from '.';
// IMPORTED LIB-FUNCTIONS
import puppeteer from 'puppeteer';

// FUNCTIONS
export const getBrowser = async (
    mode: 'translator' | 'retriever' = 'translator'
) => {
    const { webscraping } = await getConfig();
    return await puppeteer.launch({
        headless: webscraping[mode].headless,
        product: webscraping.product,
        executablePath: webscraping.executablePath,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
};
