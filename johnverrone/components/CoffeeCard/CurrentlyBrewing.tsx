import styled from '@emotion/styled';

const Wrapper = styled.span`
  background-color: var(--color-snow-light);
  padding: 2px 8px;

  text-align: center;
  text-transform: lowercase;
  letter-spacing: 0.4rem;
  font-weight: bold;
`;

export const CurrentlyBrewing = () => {
  return <Wrapper>Currently Brewing</Wrapper>;
};
