import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ children }) {
  return <div className="min-w-0 break-words text-sm leading-7 [&_p]:my-2 [&_h1]:my-4 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:my-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:my-3 [&_h3]:font-semibold [&_h4]:my-2 [&_h4]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-bold [&_hr]:my-5 [&_hr]:border-white/20 [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-4 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/30 [&_pre]:p-3 [&_code]:rounded [&_code]:bg-black/20 [&_code]:px-1 [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:border-white/15 [&_td]:p-2 [&_th]:border [&_th]:border-white/15 [&_th]:p-2">
    <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{
      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">{children}</a>,
    }}>{children}</ReactMarkdown>
  </div>;
}
