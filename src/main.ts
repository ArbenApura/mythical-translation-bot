// IMPORTED TOOLS
import { notif, clear, initialize } from './utils';
// IMPORTED LIB-FUNCTIONS
import prompts from 'prompts';
// IMPORTED FUNCTIONS
import displayDictionary from './options/displayDictionary';
import displayUtilities from './options/displayUtilities';
import retrieveRaw from './options/retrieveRaw';
import translateRaw from './options/translateRaw';

// FUNCTIONS
(async () => {
    try {
        await initialize();
        notif('Greetings, Host!\n');
        do {
            const { response } = await prompts(
                {
                    type: 'select',
                    name: 'response',
                    message: 'Mythical Translation Bot',
                    choices: [
                        {
                            title: 'Dictionary',
                            value: 'dictionary',
                        },
                        {
                            title: 'Retriever',
                            value: 'retriever',
                        },
                        {
                            title: 'Translator',
                            value: 'translator',
                        },
                        {
                            title: 'Utilities',
                            value: 'utilities',
                        },
                        {
                            title: 'Terminate',
                            value: 'terminate',
                        },
                    ],
                    initial: 0,
                },
                {
                    onCancel: () => {
                        throw new Error('terminated');
                    },
                }
            );
            switch (response) {
                case 'dictionary':
                    await displayDictionary();
                    break;
                case 'retriever':
                    await retrieveRaw();
                    break;
                case 'translator':
                    await translateRaw();
                    break;
                case 'utilities':
                    await displayUtilities();
                    break;
                case 'terminate':
                    throw new Error('terminated');
            }
        } while (true);
    } catch (err: any) {
        if (err.message === 'terminated') {
            clear();
            notif('See you again, Host!\n');
        }
    } finally {
        process.exit(1);
    }
})();
