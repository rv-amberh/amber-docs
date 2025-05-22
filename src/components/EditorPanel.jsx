import { useRef, useState, useEffect } from 'react';
import {
  bold,
  list,
  italic,
  heading,
  cleanupFormatting,
  detectActiveTools,
} from '../utils/textFormatting';
import useHistory from '../hooks/useHistory';
import ToolbarWrapper from './ToolbarWrapper';
import PreviewPanel from '../components/PreviewPanel';

const EditorPanel = ({ expanded, showEditor }) => {
  const textAreaRef = useRef(null);
  const [activeTools, setActiveTools] = useState([]);
  const [charCount, setCharCount] = useState(
    () => localStorage.getItem('character_count') || '0',
  );
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(
    () => localStorage.getItem('character_count_excluding_spaces') || '0',
  );
  const { present, past, future, undo, redo, setText } = useHistory();

  const formatters = {
    bold,
    italic,
    list,
    heading,
    undo,
    redo,
  };

  useEffect(() => {
    const cleaned = cleanupFormatting(present, undefined, 'preview');
    const justText = cleaned.replace(/\n/g, ''); //remove any newline chars left over
    const noMarkers = justText.replace(/\*\*/g, '').replace(/\*/g, ''); //remove any symbols

    const withSpaces = noMarkers.length;
    const withoutSpaces = noMarkers.replace(/\s/g, '').length;

    setCharCount(withSpaces);
    setCharCountNoSpaces(withoutSpaces);

    localStorage.setItem('character_count', String(withSpaces));
    localStorage.setItem(
      'character_count_excluding_spaces',
      String(withoutSpaces),
    );
  }, [present]);

  {
    /* handlers */
  }

  const handleChange = e => {
    let currText = e.target.value;
    setText(currText);
  };

  const handleUserSelection = toolType => {
    if (toolType === 'undo') {
      return undo();
    }
    if (toolType === 'redo') {
      return redo();
    }

    const textAreaCurr = textAreaRef.current;
    let formattedSelectedArea;

    if (!textAreaCurr) return;

    const rawText = textAreaCurr.value;
    const start = textAreaCurr.selectionStart;
    const end = textAreaCurr.selectionEnd;

    if (start === end) {
      setActiveTools([]);
      return;
    }

    const selectedArea = textAreaCurr.value.slice(start, end);

    if (activeTools.length === 1 && activeTools[0] === toolType) {
      formattedSelectedArea = cleanupFormatting(selectedArea);
    } else {
      const formattingTool = formatters[toolType];
      formattedSelectedArea = formattingTool
        ? formattingTool(cleanupFormatting(selectedArea))
        : selectedArea;
    }

    const newString =
      rawText.slice(0, start) + formattedSelectedArea + rawText.slice(end);
    //push to our hook
    setText(newString);

    {
      /* grab the latest active tool for UI update */
    }
    const newTools = detectActiveTools(formattedSelectedArea);
    setActiveTools(newTools);

    setTimeout(() => {
      textAreaCurr.focus();
      textAreaCurr.setSelectionRange(
        start,
        start + formattedSelectedArea.length,
      );
    }, 0);
  };

  {
    /* layout rendering based on setting */
  }
  const renderLayout = () => {
    if (expanded) {
      return (
        <div className='grid grid-cols-1 md:grid-cols-2 mx-auto gap-4 w-full'>
          <div className='flex flex-col min-h-[36rem] w-full h-full bg-white rounded-md shadow p-4  transition-all duration-300 ease-in-out '>
            <textarea
              value={present}
              onChange={handleChange}
              onKeyUp={handleUserSelection}
              onMouseUp={handleUserSelection}
              onSelect={handleUserSelection}
              ref={textAreaRef}
              className='flex-1 p-4 rounded-md resize-none focus:ring-2 focus:outline-blue-900'
            />
          </div>

          <div className='flex flex-col w-full transition-all duration-300 ease-in-out'>
            <PreviewPanel
              charCount={charCount}
              charCountNoSpaces={charCountNoSpaces}
              rawText={present}
            />
          </div>
        </div>
      );
    }

    return (
      <div className='flex flex-col items-center justify-center min-w-full gap-4 transition-all duration-300 ease-in-out'>
        {showEditor && !expanded ? (
          <div className='flex flex-col min-h-[36rem] min-w-full h-full bg-white rounded-md p-4 transition-all duration-300 ease-in-out'>
            <textarea
              value={present}
              onChange={handleChange}
              onKeyUp={handleUserSelection}
              onMouseUp={handleUserSelection}
              onSelect={handleUserSelection}
              ref={textAreaRef}
              className='flex-1 p-4 rounded-md resize-none focus:ring-2 focus:outline-blue-900'
            />
          </div>
        ) : (
          <div className='flex flex-col min-h-[30rem] w-full h-full rounded-md justify-center transition-all duration-300 ease-in-out'>
            <PreviewPanel charCount={charCount} rawText={present} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id='page_wrapper'
      className={`flex flex-col px-4 md:px-10 gap-6 pt-6 pb-12 mb-6 overflow-x-hidden bg-tertiary rounded-md shadow-xl ${
        expanded ? 'w-full min-w-full' : 'w-full mx-auto'
      }`}
    >
      <div className='sticky top-0'>
        <ToolbarWrapper
          activeTools={activeTools}
          handleUserSelection={handleUserSelection}
          charCount={charCount}
          charCountNoSpaces={charCountNoSpaces}
          canUndo={past.length > 0}
          canRedo={future.length > 0}
        />
      </div>
      {renderLayout()}
    </div>
  );
};

export default EditorPanel;
