import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = true,
}) => {
  const baseClasses = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-1xl overflow-hidden transition-all duration-300';
  const hoverClasses = hover ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-lg' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
