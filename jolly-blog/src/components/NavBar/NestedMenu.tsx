import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Popover } from '@components/Popover';
import { Button } from '@components/Button';
import { NavItem } from './NavBar';

const Pane = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
  pointer-events: auto;
`;

interface NestedMenuProps {
  name: string;
}

export const NestedMenu: React.FC<NestedMenuProps> = ({ name, children }) => {
  const [open, setOpen] = useState(false);
  const [anchorRef, setAnchorRef] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setAnchorRef}>
      <Button onClick={() => setOpen(prev => !prev)}>
        <NavItem>{name}</NavItem>
      </Button>
      <Popover anchor={anchorRef} open={open} offset={8} placement="bottom-end">
        <Pane onClick={() => setOpen(false)}>{children}</Pane>
      </Popover>
    </div>
  );
};
