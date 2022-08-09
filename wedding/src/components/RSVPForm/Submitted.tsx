import React from 'react';

interface SubmittedProps {
  onAck: () => void;
}

export const Submitted = ({ onAck }: SubmittedProps) => (
  <div>
    <p>Response received, thanks!</p>
    <button onClick={onAck}>ack</button>
  </div>
);
