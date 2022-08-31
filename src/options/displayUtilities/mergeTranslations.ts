// IMPORTED TYPES
import type { DraftFile } from '../../types';
// IMPORTED TOOLS
import {
    notif,
    sccss,
    error,
    clear,
    pressAnyKey,
    getConfig,
    extractContent,
    writeFile,
    useDictionary,
    sanitizeContent,
} from '../../utils';
import { draft } from '../../variables';

// TYPES
interface Files {
    [key: string]: {
        path: string;
        content: string[];
    };
}

// VARIABLES
const files: Files = {
    raw: { path: draft.raw, content: [] },
};

// FUNCTIONS
const getFiles = async () => {
    const config = await getConfig();
    const sources = config.webscraping.translator.sources;
    Object.entries(sources).map(([key, value]) => {
        if (value) {
            files[key] = {
                path: draft[key as DraftFile],
                content: [],
            };
        }
    });
    await Promise.all(
        Object.keys(files).map(async (key) => {
            let content = await extractContent(files[key].path);
            content = sanitizeContent(content);
            content = await useDictionary(content);
            const isEmpty = content === '';
            if (key === 'raw' && isEmpty)
                throw new Error('Raw has no content!');
            if (isEmpty) return delete files[key];
            files[key].content = content.replace(/[\n\r]+/g, '\n').split('\n');
        })
    );
    return files;
};
const mergeTranslations = async (files: Files) => {
    const {
        watermark,
        webscraping: { translator },
    } = await getConfig();
    let merged = watermark ? watermark + '\n\n' : '';
    for (let i = 0; i < files.raw.content.length; i++) {
        type Line = { source: string; line: string };
        const lines: Line[] = [];
        if (translator.display.raw)
            lines.push({
                source: 'raw',
                line: files.raw.content[i],
            });
        await Promise.all(
            Object.keys(files).map(async (key) => {
                if (key === 'raw') return;
                lines.push({
                    source: key,
                    line: files[key].content[i],
                });
            })
        );
        const selected: string[] = [];
        for (let i = 0; i < lines.length; i++) {
            let line = translator.display.label
                ? `[${lines[i].source.toUpperCase()}]: `
                : '';
            line += lines[i].line;
            if (lines[i].source === 'deepl') {
                const excluded = [
                    "The company's main",
                    'The first thing',
                    'The first time',
                ];
                if (
                    lines[i].line &&
                    !selected.includes(lines[i].line) &&
                    !excluded.some((v) => lines[i].line.includes(v))
                )
                    selected.push(line || '');
            } else {
                if (lines[i].line && !selected.includes(lines[i].line))
                    selected.push(line || '');
            }
        }
        selected.map((line, index) => {
            merged += line;
            if (index + 1 !== selected.length) merged += '\n';
        });
        if (i + 1 !== files.raw.content.length) merged += '\n\n';
    }
    return merged;
};
export default async () => {
    try {
        clear();
        notif('Extracting contents...');
        const files = await getFiles();
        notif('Merging translations...');
        const merged = await mergeTranslations(files);
        notif('Saving file...');
        await writeFile(draft.draft, merged);
        sccss('Merged successfully!');
    } catch (err: any) {
        error('Merging failure!');
        error(err.message);
    } finally {
        await pressAnyKey();
    }
};
