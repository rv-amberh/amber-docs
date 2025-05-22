import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PreviewPanel = ({ rawText }) => {
  return (
    <div id='page_wrapper'>
      <div
        id='preview_wrapper'
        className='
        prose 
        max-w-prose 
        mx-auto 
        min-h-[36rem] 
        bg-slate-200 
        px-8 py-8 
        overflow-auto 
        shadow-xl 
        rounded-md 
        prose-ul:list-disc 
        prose-li:marker:text-black 
        prose-li:my-0 
        '
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{rawText}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PreviewPanel;
