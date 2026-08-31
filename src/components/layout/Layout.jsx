import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

export default function Layout({ children }) {
  const { sidebarOpen, sidebarVisible } = useApp();

  const contentMargin = !sidebarVisible
    ? ''
    : sidebarOpen
      ? 'lg:ml-64'
      : 'lg:ml-[72px]';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 w-full transition-[margin] duration-300 ${contentMargin}`}>
        <Header />
        <main className="flex-1 min-h-0 min-w-0 p-4 sm:p-6 overflow-auto scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
