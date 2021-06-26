import { RichText } from '@notionhq/client/build/src/api-types';

export const blockToString = (textBlocks: RichText[]): string => {
  return textBlocks.reduce((text, block) => {
    let content = '';

    if (block.type === 'equation') {
      // handle equation
    }

    if (block.type === 'mention') {
      // handle mention
    }

    if (block.type === 'text') {
      content = block.text.content;
    }

    return (text += content);
  }, '');
};
