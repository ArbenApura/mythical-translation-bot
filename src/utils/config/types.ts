import { Source } from '../../types';

export interface Config {
    watermark: string;
    webscraping: {
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
