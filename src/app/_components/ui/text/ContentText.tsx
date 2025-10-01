import React from 'react';

import { cn } from '@/lib/utils';

interface ContentTextProps {
  text?: string;
  defaultPadding?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const ContentText: React.FC<ContentTextProps> = ({
  text = '',
  defaultPadding = true,
  align = 'left',
  className = '',
}) => {
  // 텍스트를 줄바꿈으로 분리
  const textLines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line);

  const containerClasses = cn(
    'text-gray-600 text-sm md:text-sm', // $text-font-size-s-rem, mobile에서 더 큰 글씨
    defaultPadding ? 'p-4' : 'p-0', // $padding-m-rem
    {
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
    },
    className
  );

  const paragraphClasses = 'flex flex-col leading-relaxed'; // 170% line-height

  return (
    <div className={containerClasses}>
      <p className={paragraphClasses}>
        {textLines.length > 0 ? (
          textLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))
        ) : (
          <span className="block text-center text-gray-300">텍스트를 입력하세요.</span>
        )}
      </p>
    </div>
  );
};

export default ContentText;
