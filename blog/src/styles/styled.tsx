import styled, { CreateStyled } from '@emotion/styled';
import theme from '../gatsby-plugin-theme-ui';

type Theme = typeof theme;

export default styled as CreateStyled<Theme>;
