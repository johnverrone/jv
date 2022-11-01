import { AnimatePresence, motion } from 'framer-motion';
import { CSSProperties, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { WeddingEvent } from './types';
import { Text } from '../Text';
import css from './Calendar.module.scss';
import Link from 'next/link';

interface EventProps {
  event: WeddingEvent;
  open: boolean;
  onClick?: () => void;
}

export function CalendarEvent({ event, open, onClick }: EventProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
  });

  return (
    <>
      <button
        style={
          {
            '--top': `${position(event.startTime)}px`,
            '--height': `${height(event.startTime, event.endTime)}px`,
          } as CSSProperties
        }
        className={css.event}
        onClick={onClick}
      >
        <div className={css.eventTime}>
          <Text variant="body3" tag="p">
            {event.startTime.toLocaleTimeString(undefined, {
              timeStyle: 'short',
            })}
          </Text>
        </div>
        <div className={css.eventDot} ref={setReferenceElement} />
        <Text variant="body3">{event.name}</Text>
      </button>
      {typeof window !== 'undefined'
        ? ReactDOM.createPortal(
            <AnimatePresence>
              {open && (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  ref={setPopperElement}
                  role="dialog"
                  className={css.eventBubble}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <Text variant="heading1">
                    {`${event.emoji} ${event.name}`}
                  </Text>
                  <Text variant="body2" tag="p">
                    {event.locationUrl ? (
                      <Link
                        href={event.locationUrl}
                        target="_blank"
                        className="link"
                      >
                        {event.location}
                      </Link>
                    ) : (
                      event.location
                    )}
                  </Text>
                  <Text variant="body2" tag="p">
                    {`${event.day} ${getTimeString(event)}`}
                  </Text>
                  <Text variant="body2" tag="p">
                    {event.description}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>,
            document.querySelector('#calendar') ?? document.body
          )
        : null}
    </>
  );
}

// 320px to represent 16 times (8am => midnight)
// 8am => 0
// 10am => 40px
// 12pm => 80px
// 2pm => 120px
// 4pm => 160px
// 6pm => 200px
// 8pm => 240px
// 10pm => 280px
// midnight => 320px
const position = (date: Date) => {
  const hours = date.getHours();
  return (hours - 8) * 20;
};

const height = (startTime: Date, endTime: Date) => {
  const bottom = position(endTime);
  const top = position(startTime);
  const height = bottom < 0 ? 320 - top : bottom - top;
  return height;
};

const getTimeString = (event: WeddingEvent) => {
  return `${event.startTime.toLocaleTimeString(undefined, {
    timeStyle: 'short',
  })} - ${event.endTime.toLocaleTimeString(undefined, {
    timeStyle: 'short',
  })}`;
};
