import {
  Annotations,
  RichText,
  RichTextTextInput,
} from '@notionhq/client/build/src/api-types';

interface TextData extends RichTextTextInput, Annotations {}

const format = (text: TextData): string => {
  let formatted = text.text.content;
  if (text.italic) {
    formatted = `_${formatted}_`;
  }
  return formatted;
};

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
      let data: TextData = {
        ...block,
        ...block.annotations,
      };
      content = format(data);
    }

    return text.concat(content);
  }, '');
};
