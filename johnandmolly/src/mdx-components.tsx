import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold my-4">{children}</h1>
    ),
    ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
    ...components,
  };
}
