import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon,
    suffix,
    fullWidth = true,
    className = '',
    multiline = false,
    rows = 3,
    ...props
  },
  ref,
) {
  const wrapperClasses = ['rol-input', fullWidth && 'rol-input--full', className]
    .filter(Boolean)
    .join(' ');

  const Component = multiline ? 'textarea' : 'input';

  return (
    <label className={wrapperClasses}>
      {label && <span className="rol-input__label">{label}</span>}
      <span className={`rol-input__control ${error ? 'rol-input__control--error' : ''}`}>
        {Icon && <Icon size={16} className="rol-input__icon" />}
        <Component
          ref={ref}
          {...(multiline ? { rows } : {})}
          {...props}
        />
        {suffix && <span className="rol-input__suffix">{suffix}</span>}
      </span>
      {error ? (
        <span className="rol-input__message rol-input__message--error">{error}</span>
      ) : hint ? (
        <span className="rol-input__message">{hint}</span>
      ) : null}
    </label>
  );
});

export default Input;
