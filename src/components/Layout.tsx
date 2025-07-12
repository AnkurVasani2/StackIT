import * as React from 'react'; // ✅ Correct form

import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="font-pixel text-sm bg-black text-green-400 min-h-screen">
      <Header />
      <main className="pb-8">
        {children}
      </main>
    </div>
    </div>
  );
};

export default Layout;
