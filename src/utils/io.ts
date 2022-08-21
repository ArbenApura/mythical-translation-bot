// IMPORTED LIB-FUNCTIONS
import fs from 'fs';

// FUNCTIONS
export const makeDirectory = (path: string) =>
    new Promise((resolve: any, reject: any) => {
        if (!fs.existsSync(path)) {
            fs.mkdir(path, (error: any) => {
                if (error) reject(Error(`Failed to make directory(${path})!`));
                else resolve();
            });
        } else resolve();
    });
export const writeFile = (path: string, content: string) =>
    new Promise((resolve: any, reject: any) =>
        fs.writeFile(path, content, (error: any) => {
            if (error) reject(Error(`Failed to write file(${path})!`));
            else resolve();
        })
    );
export const extractContent = async (path: string) => {
    const data = await fs.promises.readFile(path);
    return data.toString();
};
export const isFileEmpty = async (path: string) => {
    const content = await extractContent(path);
    return content === '';
};
export const isFileExists = async (path: string) => fs.existsSync(path);
