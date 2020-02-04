import styled, { CreateStyled } from '@emotion/styled';

export type Theme = {
  colors: {
    text: string,
    background: string,
  }
}

export default styled as CreateStyled<Theme>;
