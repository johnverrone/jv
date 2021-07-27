import styled from '@emotion/styled';

export const FullBleedContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr min(80ch, 100%) 1fr;
  margin-top: 60px;

  & * {
    grid-column: 2;
  }
`;
