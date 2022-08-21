// IMPORTED TOOLS
import {
    notif,
    sccss,
    error,
    clear,
    pressAnyKey,
    useDictionaryToDraft,
} from '../../utils';

// FUNCTIONS
const useDictionary = async () => {
    try {
        clear();
        notif('Using dictionary...');
        await useDictionaryToDraft();
        sccss('Used successfully!');
    } catch (err: any) {
        error('Using Failure!');
        error(err.message);
    } finally {
        await pressAnyKey();
    }
};
export default useDictionary;
