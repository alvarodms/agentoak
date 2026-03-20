export default function PokeballSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="loading-state">
      <svg className="pokeball-spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#ee1515" strokeWidth="5" strokeDasharray="70 212" strokeLinecap="round" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="5" strokeDasharray="70 212" strokeLinecap="round" transform="rotate(180 50 50)" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="#222" strokeWidth="4" />
        <circle cx="50" cy="50" r="5" fill="#f0f0f0" />
      </svg>
      <p>{message}</p>
    </div>
  );
}
