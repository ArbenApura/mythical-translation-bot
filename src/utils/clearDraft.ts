// IMPORTED TYPES
import type { DraftFile } from '../types';
// IMPORTED TOOLS
import { writeFile } from '.';
import { draft } from '../variables';

// FUNCTIONS
export const clearDraft = async () => {
    await Promise.all(
        Object.keys(draft).map(
            async (key) => await writeFile(draft[key as DraftFile], '')
        )
    );
};
