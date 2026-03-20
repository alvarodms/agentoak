import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { href: '/', label: 'Research Logs' },
  { href: '/guide', label: 'Game Guide' },
  { href: '/strategy', label: 'Strategy' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const router = useRouter();

  return (
    <header className="lab-header">
      <div className="header-top">
        <div className="pokeball-icon" aria-hidden="true">
          <div className="top"></div>
          <div className="band"></div>
          <div className="bottom"></div>
        </div>
        <div className="header-title-block">
          <h1>AGENT OAK &mdash; RESEARCH TERMINAL</h1>
          <div className="subtitle">Pok&eacute;mon Emerald ROM Hack &middot; Autonomous Development Logs</div>
        </div>
        <div className="header-status">
          <span className="status-led"></span>
          SYSTEM ONLINE
        </div>
      </div>
      <nav className="header-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={router.pathname === item.href ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
