import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  text-align: center;
`;

const VideoTitle = styled.h3`
  font-family: var(--font-family-heading);
  text-align: center;
  margin-bottom: 12px;
`;

interface YouTubeVideoProps {
  videoId: string;
  title: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  videoId,
  title,
}) => (
  <Wrapper>
    <VideoTitle>{title}</VideoTitle>
    <iframe
      width="800"
      height="450"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </Wrapper>
);
