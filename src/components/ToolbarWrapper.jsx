import { Toolbar } from 'radix-ui';
import {
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  ResetIcon,
  ReloadIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons';
import CharCounter from './CharCounter';

const toolbarData = [
  { toolTypeValue: 'bold', icon: FontBoldIcon },
  { toolTypeValue: 'italic', icon: FontItalicIcon },
  { toolTypeValue: 'heading', icon: HeadingIcon },
  { toolTypeValue: 'list', icon: ListBulletIcon },
  { toolTypeValue: 'undo', icon: ResetIcon },
  { toolTypeValue: 'redo', icon: ReloadIcon },
];

const ToolbarWrapper = ({
  handleUserSelection,
  activeTools,
  charCount,
  charCountNoSpaces,
  canUndo,
  canRedo,
}) => {
  const toolToUse = activeTools.length > 1 ? [] : activeTools[0];

  return (
    <div className='bg-text-primary text-tertiary fixed inset-x-0 top-0 z-50 top-0 border-b border-solid-1 border-gray-200 lg:min-w-full lg:w-screen flex gap-8 lg:justify-end lg:gap-60 lg:pr-20 text:xs lg:text-md flex-row justify-center items-center py-2 shadow-xl hover:shadow-2xl hover:scale-103 hover:py-3'>
      <Toolbar.Root
        className='flex flex-row lg:items-center justify-center lg:min-w-full'
        aria-label='Formatting options'
      >
        <Toolbar.ToggleGroup type='multiple' aria-label='Markdown formatting'>
          {toolbarData.map((tool, idx) => {
            const isUndo = tool.toolTypeValue === 'undo';
            const isRedo = tool.toolTypeValue === 'redo';
            const disabled = (isUndo && !canUndo) || (isRedo && !canRedo);

            return (
              <Toolbar.ToggleItem
                disabled={disabled}
                onPointerDown={e => {
                  e.preventDefault();
                  handleUserSelection(tool.toolTypeValue);
                }}
                className={`cursor-pointer px-2 rounded-full p-2 active:hover:scale-105 hover:bg-accent hover:text-text-primary  disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none ${
                  toolToUse === tool.toolTypeValue ? 'bg-accent text-white' : ''
                }`}
                key={idx}
                value={tool.toolTypeValue}
                aria-label={tool.toolTypeValue}
              >
                <tool.icon className='w-6 h-6' />
              </Toolbar.ToggleItem>
            );
          })}
        </Toolbar.ToggleGroup>
      </Toolbar.Root>

      <div className='lg:absolute'>
        <CharCounter
          charCount={charCount}
          charCountNoSpaces={charCountNoSpaces}
        />
      </div>
    </div>
  );
};

export default ToolbarWrapper;
