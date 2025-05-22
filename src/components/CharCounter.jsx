const CharCounter = ({ charCount, charCountNoSpaces }) => (
  <div className='flex lg:flex-row pointer-none text-primary flex-col gap-2 text-sm items-left justify-center'>
    <div className='flex flex-row font-bold'>Character Count: {charCount}</div>
    <div className='flex flex-row font-bold'>
      Excluding Spaces: {charCountNoSpaces}
    </div>
  </div>
);

export default CharCounter;
