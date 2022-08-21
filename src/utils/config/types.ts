import { Source } from '../../types';

export interface Config {
    watermark: string;
    webscraping: {
        headless: boolean;
        product: 'chrome' | 'firefox';
        executablePath: string;
        translator: {
            display: {
                label: boolean;
                raw: boolean;
            };
            sources: {
                [key in Source]: boolean;
            };
        };
        retriever: {
            url: string;
        };
    };
}
