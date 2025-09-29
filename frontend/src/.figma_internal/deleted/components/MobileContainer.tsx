import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function MobileContainer({ children, className = '', style = {} }: MobileContainerProps) {
  return (
    <div 
      className={`min-h-screen w-full max-w-[393px] mx-auto relative overflow-hidden ${className}`}
      style={{
        ...style,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
      }}
    >
      {children}
    </div>
  );
}