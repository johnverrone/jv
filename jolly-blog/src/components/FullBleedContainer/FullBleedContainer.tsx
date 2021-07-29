import styled from '@emotion/styled';

export const FullBleedContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr min(80ch, calc(100% - 1.5em)) 1fr;
  grid-column-gap: 1.5em;
  margin-top: 60px;

  & * {
    grid-column: 2;
  }
`;
