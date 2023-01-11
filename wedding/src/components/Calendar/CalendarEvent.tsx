import { AnimatePresence, motion } from 'framer-motion';
import { CSSProperties, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { IWeddingEvent } from './types';
import { Text } from '../Text';
import css from './Calendar.module.scss';
import { getDayString, getTimeString, height, position } from './utils';
import Link from 'next/link';

interface EventProps {
  event: IWeddingEvent;
  open: boolean;
  onClick?: () => void;
}

export function CalendarEvent({ event, open, onClick }: EventProps) {
  const eventTop = position(event.startTime);
  const eventHeight = height(event.startTime, event.endTime);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, -Math.max(eventHeight, 92)] } },
    ],
  });

  return (
    <>
      <button
        style={
          {
            '--top': `${eventTop}px`,
            '--height': `${eventHeight}px`,
          } as CSSProperties
        }
        className={css.event}
        onClick={onClick}
        ref={setReferenceElement}
      >
        <Text variant="heading3" style={{ margin: 0 }}>
          {event.name}
        </Text>
        <div className={css.iconRow}>
          <i className="las la-calendar la-lg"></i>
          <Text variant="body3" tag="p">
            {getTimeString(event)}
          </Text>
        </div>
        <div className={css.iconRow}>
          <i className="las la-map-marker la-lg"></i>
          <Text variant="body3" tag="p">
            {event.location}
          </Text>
        </div>
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
                  <div className={css.metadata}>
                    <Text variant="heading3">{event.name}</Text>
                    <div className={css.iconRow}>
                      <i className="las la-calendar la-lg"></i>
                      <Text variant="body3">{getTimeString(event)}</Text>
                    </div>
                    <div className={css.iconRow}>
                      <i className="las la-map-marker la-lg"></i>
                      <Text variant="body3">
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
                    </div>
                    <div className={css.iconRow}>
                      <i className="las la-tshirt la-lg"></i>
                      <Text variant="body3">{event.attire}</Text>
                    </div>
                  </div>

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
