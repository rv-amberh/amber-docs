import { React, useEffect, useState } from 'react';
import EditorPanel from './EditorPanel';
import SwitchWrapper from './shared/SwitchWrapper';
import { MoonIcon } from '@radix-ui/react-icons';

const AppContent = () => {
  const initialLayout = localStorage.getItem('layout');
  const saved = localStorage.getItem('theme');
  const [expanded, setExpanded] = useState(
    initialLayout === 'compact' ? false : true,
  );
  const [isDark, setIsDark] = useState(() => {
    if (saved) return saved === 'dark';
    else return false;
  });
  const [showEditor, setShowEditor] = useState(true);

  useEffect(() => {
    let value = expanded ? 'expanded' : 'compact';
    localStorage.setItem('layout', value);
  }, [expanded]);

  {
    /* theme updates */
  }

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  {
    /* handlers */
  }

  const handleShowEditor = checked => {
    setShowEditor(checked);
  };

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div
      id='main_wrapper'
      className='flex flex-col px-4 md:px-20 mt-32 lg:mt-24 lg:px-40 h-full w-full bg-primary mx-auto items-center justify-start gap-8 overflow-x-hidden'
    >
      <div className='flex flex-row pt-6 items-start justify-left items-center min-w-full gap-14 lg:pt-8 pt-6 px-2'>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`bg-text-primary text-tertiary font-bold text-xl items-center py-2 mb-2 px-6 rounded-md hover:bg-text-secondary hover:cursor-pointer`}
        >
          {expanded ? 'Compact' : 'Expanded'}
        </button>
        {/* hide our toggle on expanded mode */}
        {!expanded && (
          <SwitchWrapper
            onCheckedChange={handleShowEditor}
            checked={showEditor}
            labels={['Preview', 'Editor']}
            disabled={expanded}
          />
        )}
      </div>
      <EditorPanel expanded={expanded} showEditor={showEditor} />
      <div className='fixed bottom-0 pb-4 min-w-full flex flex-row'>
        {/* handle our theme toggling */}
        <SwitchWrapper
          onCheckedChange={handleToggleTheme}
          checked={!isDark}
          className={'items-end justify-end pb-2 mr-10'}
          labels={['dark', 'light']}
          disabled={false}
          icon={<MoonIcon />}
        />
      </div>
    </div>
  );
};

export default AppContent;
