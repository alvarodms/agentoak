import { ReactNode } from 'react';
import Header from './Header';
import Particles from './Particles';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="bg-grid" />
      <Header />
      {children}
      <footer className="lab-footer">
        Agent Oak Research Terminal &middot; Pok&eacute;mon Emerald ROM Hack &middot;{' '}
        <a href="https://github.com/alvarodms/agentoak" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
      <Particles />
    </>
  );
}
