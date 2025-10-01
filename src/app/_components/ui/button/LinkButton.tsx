'use client';

import { useRouter } from 'next/navigation';

import React from 'react';

import { cn } from '@/lib/utils';

interface LinkButtonProps {
  text: string;
  defaultColor?: string;
  activeColor?: string;
  fontSize?: number;
  isActive?: boolean;
  linkPath: string;
  className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  text,
  defaultColor = '#4e5968',
  activeColor = '#ff2e00',
  fontSize = 15,
  isActive = false,
  linkPath,
  className = '',
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(linkPath);
  };

  const linkClasses = cn('p-1 text-center cursor-pointer hover:underline', isActive ? 'underline' : '', className);

  const linkStyle = {
    color: isActive ? activeColor : defaultColor,
    fontSize: `${fontSize}px`,
  };

  return (
    <a onClick={handleClick} className={linkClasses} style={linkStyle}>
      {text}
    </a>
  );
};

export default LinkButton;
