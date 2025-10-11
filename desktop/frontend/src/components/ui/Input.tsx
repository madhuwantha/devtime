import React from 'react';

interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoFocus = false,
  className = '',
  id,
  name,
}) => {
  const baseClasses = 'w-full px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-500';

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      className={`${baseClasses} ${className}`}
    />
  );
};
