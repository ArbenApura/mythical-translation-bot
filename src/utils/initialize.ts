// IMPORTED TYPES
import type { RootDirectory, DraftFile } from '../types';
// IMPORTED TOOLS
import {
    notif,
    error,
    clear,
    pressAnyKey,
    makeDirectory,
    writeFile,
    createConfig,
    isFileEmpty,
    isFileExists,
    createDictionary,
    createDictionaryRegex,
} from '../utils';
import { roots, draft, assets } from '../variables';

// TYPES
interface AssetEntry {
    path: string;
    execute: () => Promise<any>;
}

// VARIABLES
const assetEntries: AssetEntry[] = [
    { path: assets.config, execute: createConfig },
    { path: assets.dictionary, execute: createDictionary },
    { path: assets.dictionaryRegex, execute: createDictionaryRegex },
];

// FUNCTIONS
export const initialize = async () => {
    try {
        clear();
        notif('Initializing...');
        await Promise.all(
            Object.keys(roots).map(
                async (key) => await makeDirectory(roots[key as RootDirectory])
            )
        );
        await Promise.all(
            Object.keys(draft).map(async (key) => {
                if (!(await isFileExists(draft[key as DraftFile])))
                    await writeFile(draft[key as DraftFile], '');
            })
        );
        for (let i = 0; i < assetEntries.length; i++) {
            const { path, execute } = assetEntries[i];
            if (!(await isFileExists(path)) || (await isFileEmpty(path)))
                await execute();
        }
        clear();
    } catch (err: any) {
        notif('Initializing failure!');
        error(err.message);
        await pressAnyKey();
    }
};
