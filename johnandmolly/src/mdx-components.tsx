import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold my-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold my-2">{children}</h3>
    ),
    a: ({ children, ...rest }) => (
      <a className="text-sky-800 underline" target="_blank" {...rest}>
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
    blockquote: ({ children }) => (
      <blockquote className="list-disc my-10 py-4 ps-8 pe-4 bg-neutral-200 border-l-4 border-l-neutral-400 italic">
        {children}
      </blockquote>
    ),
    ...components,
  };
}
