import styled from '@emotion/styled';

const Wrapper = styled.div`
  text-align: center;
`;

const VideoTitle = styled.h3`
  font-family: var(--font-family-heading);
  text-align: center;
  margin-bottom: 12px;
`;

const IFrame = styled.iframe`
  width: min(100%, 800px);
  height: 100%;
  aspect-ratio: 16/9;
`;

interface YouTubeVideoProps {
  videoId: string;
  title: string;
}

export const YouTubeVideo = ({ videoId, title }: YouTubeVideoProps) => (
  <Wrapper>
    <VideoTitle>{title}</VideoTitle>
    <IFrame
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></IFrame>
  </Wrapper>
);
