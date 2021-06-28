import styled from '@emotion/styled';

export const AppContainer = styled.div`
  padding: 3em 1.5em;
  margin: 0 auto;
  margin-top: 60px;
  max-width: ${props => props.theme.responsive.max};
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    padding: 3em;
  }
`;
