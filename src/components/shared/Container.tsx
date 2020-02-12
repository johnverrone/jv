import styled from '../core/styled';

export const Container = styled.div`
  padding: 4em 1.5em;
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    padding: 4em 3em;
  }
`;
