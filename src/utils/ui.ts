// IMPORTED LIB-FUNCTIONS
import chalk from 'chalk';
// @ts-ignore
import pak from 'press-any-key';

// FUNCTIONS
export const pressAnyKey = async () => {
    await pak(chalk.cyan('[!]: ') + 'Press any key to continue...');
    clear();
};
export const divider = () =>
    console.log(chalk.gray('-'.repeat(process.stdout.columns)));
export const notif = (message: string) =>
    console.log(chalk.cyan('[!]:'), message);
export const error = (message: string) =>
    console.log(chalk.red('[!]:'), message);
export const sccss = (message: string) =>
    console.log(chalk.green('[!]:'), message);
export const clear = () => {
    process.stdout.write('\u001b[3J\u001b[1J');
    console.clear();
};
