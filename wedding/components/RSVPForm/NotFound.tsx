import React from 'react';

interface NotFoundProps {
  onRetry: () => void;
  onStartOver: () => void;
}

export const NotFound = ({ onRetry, onStartOver }: NotFoundProps) => (
  <div>
    <p>There was an error finding your invite</p>
    <button onClick={onRetry}>retry</button>
    <button onClick={onStartOver}>start over</button>
  </div>
);
