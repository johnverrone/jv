import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const TitleText = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-weight: ${props => props.theme.fontWeights.bold};
  line-height: 1.15;
  font-size: 1.866em;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    font-size: 2.488em;
  }
`;

const Date = styled.h2`
  font-size: 0.9em;
  opacity: 0.5;
`;

interface TitleProps {
  title: string;
  date: string;
}

const Title: React.FC<TitleProps> = ({ title, date }) => {
  return (
    <Wrapper>
      <TitleText>{title}</TitleText>
      <Date>{date}</Date>
    </Wrapper>
  );
};

export default Title;
