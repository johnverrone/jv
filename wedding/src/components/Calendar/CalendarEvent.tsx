import { CSSProperties, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import css from './Calendar.module.scss';
import { WeddingEvent } from './types';

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
        <div className={css.eventDot} ref={setReferenceElement} />
        <span>{event.shortName}</span>
      </button>
      {open &&
        ReactDOM.createPortal(
          <div
            ref={setPopperElement}
            className={css.eventBubble}
            style={styles.popper}
            {...attributes.popper}
          >
            <h2>{event.name}</h2>
            <p>{event.location}</p>
            <p>
              {`${event.startTime.toLocaleTimeString(undefined, {
                timeStyle: 'short',
              })} - ${event.endTime.toLocaleTimeString(undefined, {
                timeStyle: 'short',
              })}`}
            </p>
            <p>{event.description}</p>
          </div>,
          document.querySelector('#calendar') ?? document.body
        )}
    </>
  );
}
