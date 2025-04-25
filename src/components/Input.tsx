import { forwardRef } from 'react';
import InputProps from '../interface/Input';

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { id, type = 'text', value, onChange, placeholder, disabled, className } = props;

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      ref={ref}  
    />
  );
});

export default Input;
