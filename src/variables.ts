import path from 'path';

export const roots = {
    draft: path.join(process.cwd(), 'Draft'),
    published: path.join(process.cwd(), 'Published'),
    assets: path.join(process.cwd(), 'Assets'),
};
export const draft = {
    draft: path.join(roots.draft, 'draft.txt'),
    raw: path.join(roots.draft, 'raw.txt'),
    baidu: path.join(roots.draft, 'baidu.txt'),
    bing: path.join(roots.draft, 'bing.txt'),
    deepl: path.join(roots.draft, 'deepl.txt'),
    google: path.join(roots.draft, 'google.txt'),
    yandex: path.join(roots.draft, 'yandex.txt'),
};
export const assets = {
    config: path.join(roots.assets, 'config.json'),
    dictionary: path.join(roots.assets, 'dictionary.json'),
    dictionaryRegex: path.join(roots.assets, 'dictionary-regex.js'),
};

export const CONFIG_TEMPLATE = `{
    "watermark": "Translated by [watermark].",
    "webscraping": {
        "product": "chrome",
        "executablePath": "C:/Program Files/Google/Chrome/Application/chrome.exe",
        "translator": {
            "headless": true,
            "display": {
                "label": true,
                "raw": true
            },
            "sources": {
                "baidu": true,
                "bing": true,
                "deepl": true,
                "google": true,
                "yandex": true
            }
        },
        "retriever": {
            "headless": true,
            "url": ""
        }
    }
}`;
export const DICTIONARY_TEMPLATE = `{
    "categories": []
}`;
