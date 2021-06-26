import { Block } from '@notionhq/client/build/src/api-types';
import { blockToString } from './blockToString';

const EOL = '\n';

export const blocksToMarkdown = (blocks: Block[], depth = 0): string => {
  return blocks.reduce((acc, block) => {
    if (!block) return acc;
    let str = '';

    if (block.has_children) {
      str = ' '
        .repeat(depth)
        .concat(str)
        .concat(blocksToMarkdown(block[block.type].children, depth + 1));
    }

    if (block.type === 'paragraph') {
      const p = blockToString(block.paragraph.text);

      const isCodeSnippet =
        block.paragraph.text[0] &&
        block.paragraph.text[0].plain_text.startsWith('```');

      return acc
        .concat(p)
        .concat(isCodeSnippet ? EOL : EOL.concat(EOL))
        .concat(str);
    }

    if (block.type.startsWith('heading_')) {
      const headingLevel = Number(block.type.split('_')[1]);

      return acc
        .concat(EOL)
        .concat('#'.repeat(headingLevel))
        .concat(' ')
        .concat(blockToString(block[block.type].text))
        .concat(EOL)
        .concat(str);
    }

    return acc;
  }, '');
};
