/**
 * Layout Component - TypeScript version
 * Layout base para las páginas
 */

import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Layout: FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-10">
      {title && (
        <div className="mb-8 w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
        </div>
      )}
      <div className="w-full max-w-6xl px-4">{children}</div>
    </div>
  );
};

export default Layout;
