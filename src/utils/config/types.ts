import { Source } from '../../types';

export interface Config {
    watermark: string;
    webscraping: {
        product: 'chrome' | 'firefox';
        executablePath: string;
        translator: {
            headless: boolean;
            display: {
                label: boolean;
                raw: boolean;
            };
            sources: {
                [key in Source]: boolean;
            };
        };
        retriever: {
            headless: boolean;
            url: string;
        };
    };
}
