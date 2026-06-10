import type { ReactNode } from 'react';
import Header from '../navigation/Header';
import Container from './Container';

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main className="safe-bottom">
        <Container className="py-6 sm:py-8 lg:py-10">{children}</Container>
      </main>
    </div>
  );
};

export default AppShell;
