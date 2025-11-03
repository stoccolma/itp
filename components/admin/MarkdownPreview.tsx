'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
  title?: string;
}

export function MarkdownPreview({ content, title }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-stone max-w-none">
      {title && <h1 className="font-serif text-3xl mb-4">{title}</h1>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-serif mt-8 mb-4 text-stone-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-serif mt-6 mb-3 text-stone-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-serif mt-5 mb-2 text-stone-900">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-stone-700 leading-relaxed">{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-stone-300 pl-4 my-4 italic text-stone-600">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-stone-700">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          code: ({ children }) => (
            <code className="bg-stone-100 px-1 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-stone-50 p-4 rounded overflow-x-auto mb-4">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
