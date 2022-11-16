import { motion } from 'framer-motion';
import React, { ComponentProps } from 'react';
import Image from 'next/image';
import { Text } from '../Text';
import css from './StoryImage.module.scss';

interface StoryImageProps {
  src: ComponentProps<typeof Image>['src'];
  alt: string;
  caption: string;
}

export const StoryImage = ({ src, alt, caption }: StoryImageProps) => (
  <motion.div
    className={css.container}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ margin: '-100px' }}
  >
    <figure className={css.figure}>
      <Image className={css.image} src={src} alt={alt} />
      <Text variant="body3" tag="figcaption">
        {caption}
      </Text>
    </figure>
  </motion.div>
);
