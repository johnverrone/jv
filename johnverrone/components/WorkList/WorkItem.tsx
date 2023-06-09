import styled from '@emotion/styled';
import Link from 'next/link';
import { Work } from './types';

const Wrapper = styled.div`
  height: 200px;
  background-color: #1e2127;
  color: #98c379;
  border-radius: 6px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const LinkWrapper = styled(Wrapper.withComponent('a'))`
  text-decoration: none;
`;

const Title = styled.h3`
  font-family: var(--font-family-mono);
  text-transform: lowercase;
`;

interface WorkItemProps extends Work {}

export const WorkItem = ({ title, link }: WorkItemProps) => {
  const component = (
    <>
      <Title>{title}</Title>
    </>
  );
  return link ? (
    <Link href={link} passHref legacyBehavior>
      <LinkWrapper target="_blank" rel="noopener noreferrer">
        {component}
      </LinkWrapper>
    </Link>
  ) : (
    <Wrapper>{component}</Wrapper>
  );
};
