// IMPORTED LIB-FUNCTIONS
import split from 'just-split';

// FUNCTIONS
export const sanitizeContent = (content: string) => {
    content = content
        .split(/[\n\r]/g)
        .map((line) => line.trim())
        .join('\n');
    const patterns = [
        [/[“”「」]/g, '"'],
        [/。/g, '.'],
        [/，/g, ', '],
        [/？/g, '?'],
        [/！/g, '!'],
        [/…/g, '...'],
        [/ - /g, '-'],
        [/,"\s/g, (v: string) => '."' + v[2]],
        [/"\w/g, (v: string) => v.toUpperCase()],
        [/([.!?] ?){3,}/g, (v: string) => v[0].repeat(3)],
        [/[^".,?!:;\s]$/gm, (v: string) => v + '.'],
        [/[.!;?]"\S/g, (v: string) => v.slice(0, 2) + ' ' + v[2]],
        [/[,.!;?](?=[^\d\s,.!;?"])/g, (v: string) => v + ' '],
    ];
    patterns.map(
        (pattern: any) => (content = content.replace(pattern[0], pattern[1]))
    );
    return content;
};
export const splitRaw = (raw: string, maxChars: number = 500): string[][] => {
    let chunks: string[][] = [raw.split(/[\n\r]+/g)];
    while (chunks.some((chunk) => chunk.join('\n\n').length > maxChars)) {
        let changes = 0;
        chunks.forEach((chunk, index) => {
            if (chunk.join('\n\n').length > maxChars) {
                chunks.splice(
                    index + changes,
                    1,
                    ...split(chunk, Math.ceil(chunk.length / 2))
                );
                changes++;
            }
        });
    }
    return chunks;
};
