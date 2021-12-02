import styled from '@emotion/styled';

export const AppContainer = styled.div`
  padding: 12px;
  margin: 0 auto;
  max-width: ${(props) => props.theme.responsive.max};
  @media screen and (min-width: ${(props) => props.theme.responsive.medium}) {
    padding: 3em;
  }
`;
