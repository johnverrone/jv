import { useRandomInterval } from '@hooks/useRandomInterval';
import React, { CSSProperties, useEffect, useState } from 'react';
import { random } from '@utils/math';
import { HeartInstance } from './HeartInstance';
import css from './Hearts.module.css';

// hot pink
const DEFAULT_COLOR = 'hsl(330deg, 100%, 70%)';

export interface Heart {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: CSSProperties;
}

const generateHeart = (): Heart => {
  const color = `hsl(${random(320, 340)}deg, 100%, ${random(50, 80)}%)`;

  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      // random spot in available space
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
      // float above content
      zIndex: 2,
    },
  };
};

interface HeartsProps {
  active?: boolean;
  children: React.ReactNode;
}

export const Hearts = ({ active = false, children }: HeartsProps) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (!active) {
      setHearts([]);
    } else {
      // immediately generate some hearts
      setHearts([generateHeart()]);
      const timeoutId = window.setTimeout(
        () => setHearts((hearts) => [...hearts, generateHeart()]),
        150
      );
      return () => window.clearTimeout(timeoutId);
    }
  }, [active]);

  useRandomInterval(
    () => {
      const heart = generateHeart();
      const now = Date.now();

      const nextHearts = hearts.filter((h) => {
        const delta = now - h.createdAt;
        return delta < 700;
      });

      nextHearts.push(heart);
      setHearts(nextHearts);
    },
    active ? 150 : null,
    active ? 500 : null
  );

  return (
    <span className={css.wrapper}>
      {hearts.map((heart) => (
        <HeartInstance
          key={heart.id}
          color={heart.color}
          size={heart.size}
          style={heart.style}
        />
      ))}
      <span className={css.childrenWrapper}>{children}</span>
    </span>
  );
};
