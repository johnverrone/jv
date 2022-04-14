import styled from '@emotion/styled';

export const A = styled.a`
  text-decoration: none;

  :link {
    color: var(--color-sunset-medium);
  }

  :visited {
    color: var(--color-sunset-dark);
  }

  :focus {
  }

  :hover {
    text-decoration: underline;
  }

  :active {
    color: var(--color-sunset-light);
  }
`;
