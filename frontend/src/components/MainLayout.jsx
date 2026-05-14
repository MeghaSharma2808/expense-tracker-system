import { Sidebar } from './Sidebar';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-light min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
