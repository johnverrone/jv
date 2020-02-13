import styled from '../core/styled';

export const Container = styled.div`
  padding: 4em 1.5em;
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.theme.responsive.max};
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    padding: 4em 3em;
  }
`;
