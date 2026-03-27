import * as React from 'react';

export const Dialog = {
  Root: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
    open ? <div role="dialog">{children}</div> : null,
  Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  Description: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Close: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
};

export const Button = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick}>{children}</button>
);

export const Flex = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export const Text = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;

export const TextField = {
  Root: ({ children, ...props }: any) => <input {...props}>{children}</input>,
};

export const Separator = () => <hr />;

export const Switch = ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) => <input type="checkbox" checked={checked} onChange={e => onCheckedChange?.(e.target.checked)} />;
