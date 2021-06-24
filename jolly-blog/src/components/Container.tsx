import styled from '@emotion/styled';

const Container = styled.div`
  padding: 3em 1.5em;
  margin: 0 auto;
  margin-top: 60px;
  width: 100%;
  max-width: ${props => props.theme.responsive.max};
  @media screen and (min-width: ${props => props.theme.responsive.medium}) {
    padding: 3em;
  }
`;

export default Container;
