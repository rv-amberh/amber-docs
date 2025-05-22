import { Switch } from 'radix-ui';

const SwitchWrapper = ({
  onCheckedChange,
  checked,
  labels,
  disabled,
  icon,
  className = 'justify-left',
}) => {
  return (
    <div
      className={`flex flex-row w-full items-center text-center  ${className}`}
    >
      {
        <label
          className={`pr-6 bottom-[3px] text-text-primary relative font-bold text-xxl}`}
          htmlFor='switcher'
        >
          {icon ? icon : labels[0]}
        </label>
      }
      <Switch.Root
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className='SwitchRoot'
        id='switch_root'
      >
        <Switch.Thumb className='SwitchThumb' />
      </Switch.Root>
    </div>
  );
};

export default SwitchWrapper;
