// IMPORTED TYPES
import type { Config } from './types';
// IMPORTED TOOLS
import { writeFile, extractContent, isFileExists } from '../';
import { assets, CONFIG_TEMPLATE } from '../../variables';

// FUNCTIONS
export const createConfig = async () => {
    await writeFile(assets.config, CONFIG_TEMPLATE);
    return JSON.parse(CONFIG_TEMPLATE) as Config;
};
export const getConfig = async () => {
    if (await isFileExists(assets.config))
        return JSON.parse(await extractContent(assets.config)) as Config;
    else return await createConfig();
};
