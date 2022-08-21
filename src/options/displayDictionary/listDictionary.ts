// IMPORTED TOOLS
import {
    notif,
    error,
    clear,
    divider,
    pressAnyKey,
    getDictionary,
} from '../../utils';
// IMPORTED LIB-FUNCTIONS
import chalk from 'chalk';

// FUNCTIONS
const listDictionary = async () => {
    try {
        clear();
        const dictionary = await getDictionary();
        dictionary.categories.forEach(({ category, words }) => {
            console.log(chalk.cyan(`[${category.toUpperCase()} CATEGORY]`));
            if (words.length) {
                words.forEach(({ word, definitions }) => {
                    console.log(
                        '  ' +
                            chalk.cyan('>') +
                            ' ' +
                            word +
                            chalk.cyan(':') +
                            ' ' +
                            chalk.gray(definitions.join(', '))
                    );
                });
            } else console.log('  ' + chalk.cyan('>') + ' Empty');
        });
        divider();
    } catch (err: any) {
        error('Listing Failure!');
        error(err.message);
    } finally {
        await pressAnyKey();
    }
};
export default listDictionary;
