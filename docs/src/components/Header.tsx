import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { href: '/', label: 'Research Logs' },
  { href: '/guide', label: 'Game Guide' },
  { href: '/pokedex', label: 'Pokedex' },
  { href: '/moves', label: 'Moves' },
  { href: '/about', label: 'About' },
  { href: '/downloads', label: 'Downloads' },
];

export default function Header() {
  const location = useLocation();

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
            to={item.href}
            className={
              location.pathname === item.href ||
              (item.href === '/pokedex' && location.pathname.startsWith('/pokedex/'))
                ? 'active' : ''
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
