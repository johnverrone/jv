import React, { useState } from 'react';
import styled from '@emotion/styled';
import { BasePlacement, VariationPlacement } from '@popperjs/core';
import { PopperProps, usePopper } from 'react-popper';

const Arrow = styled.div`
  position: absolute;
  height: 12px;
  width: 12px;

  &:after {
    content: '';
    position: absolute;
    top: -6px;
    left: 0;
    transform: rotate(45deg);
    background-color: white;
    width: 100%;
    height: 100%;
  }
`;

const PopperDiv = styled.div`
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);

  &[data-popper-placement^='bottom'] > .arrow {
    top: 0;
  }
`;

export interface PopoverProps {
  anchor: HTMLDivElement | null;
  open: boolean;
  offset?: number;
  placement?: BasePlacement | VariationPlacement;
}

export const Popover: React.FC<PopoverProps> = ({
  anchor,
  open,
  offset = 0,
  placement = 'bottom',
  children,
}) => {
  const [popperRef, setPopperRef] = useState<HTMLDivElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const modifiers: PopperProps<any>['modifiers'] = [
    {
      name: 'arrow',
      options: { element: arrowElement },
    },
    {
      name: 'offset',
      options: {
        offset: [0, offset + 6],
      },
    },
  ];
  const { styles, attributes } = usePopper(anchor, popperRef, {
    placement,
    modifiers,
  });

  return (
    <>
      {open && (
        <>
          <PopperDiv
            ref={setPopperRef}
            style={styles.popper}
            {...attributes.popper}
          >
            {children}
            <Arrow
              ref={setArrowElement}
              style={styles.arrow}
              className="arrow"
            />
          </PopperDiv>
        </>
      )}
    </>
  );
};
