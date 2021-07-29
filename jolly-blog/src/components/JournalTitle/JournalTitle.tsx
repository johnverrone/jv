import React from 'react';
import styled from '@emotion/styled';
import { Post } from '@lib/journals';
import { formatDate } from '@utils/date';

const Wrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const TitleText = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-weight: ${props => props.theme.fontWeights.bold};
  line-height: 1.15;
  font-size: 1.866em;
  margin-bottom: 12px;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    font-size: 2.488em;
  }
`;

const Date = styled.h2`
  font-family: ${props => props.theme.fonts.monospace};
  font-size: 0.9em;
  opacity: 0.5;
`;

interface JournalTitleProps extends Pick<Post, 'title' | 'date'> {}

export const JournalTitle: React.FC<JournalTitleProps> = ({
  title,
  date,
}) => {
  return (
    <Wrapper>
      <TitleText>{title}</TitleText>
      <Date>{formatDate(date)}</Date>
    </Wrapper>
  );
};
