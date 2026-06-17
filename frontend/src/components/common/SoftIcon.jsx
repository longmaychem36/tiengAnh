const palettes = {
  home: ['#fff2c7', '#ffc800', '#ff4b4b', '#58cc02'],
  tasks: ['#e8f7ff', '#1cb0f6', '#ffc800', '#ff7a59'],
  courses: ['#eef7ff', '#1cb0f6', '#58cc02', '#ffc800'],
  grammar: ['#f0f6ff', '#7c8cff', '#1cb0f6', '#ffb020'],
  dictionary: ['#ecfbff', '#1cb0f6', '#2dd4bf', '#ffc800'],
  vocabulary: ['#fff8df', '#ffc800', '#ff9600', '#58cc02'],
  profile: ['#f3f0ff', '#8b5cf6', '#1cb0f6', '#ff7a59'],
  admin: ['#e8f7ff', '#1cb0f6', '#58cc02', '#ffc800'],
  listening: ['#e8f7ff', '#1cb0f6', '#7dd3fc', '#ff7a59'],
  reading: ['#f1edff', '#8b5cf6', '#c4b5fd', '#ffc800'],
  speaking: ['#fff1e8', '#ff7a1a', '#ffb020', '#1cb0f6'],
  writing: ['#eafbea', '#58cc02', '#22c55e', '#ffb020'],
  games: ['#fff4dc', '#ff9600', '#58cc02', '#1cb0f6'],
  users: ['#f3f0ff', '#8b5cf6', '#1cb0f6', '#58cc02'],
  placement: ['#fff2c7', '#ffc800', '#ff4b4b', '#1cb0f6'],
  logout: ['#ffecec', '#ff4b4b', '#ff7a59', '#ffc800'],
};

function Base({ name, size, className, children, title }) {
  const [bg, main, accent, extra] = palettes[name] || palettes.courses;

  return (
    <svg
      className={`soft-icon ${className || ''}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ '--soft-bg': bg, '--soft-main': main, '--soft-accent': accent, '--soft-extra': extra }}
    >
      <rect x="5" y="5" width="54" height="54" rx="18" fill={bg} />
      <path d="M18 12h19c9 0 15 6 15 15v7" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.78" />
      {children}
    </svg>
  );
}

function SoftIcon({ name = 'courses', size = 38, className = '', title }) {
  if (name === 'home') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M16 31 32 18l16 13" fill="none" stroke="var(--soft-accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 30h22v18H21z" fill="var(--soft-main)" />
        <path d="M29 48V37h8v11" fill="#fff" />
        <circle cx="26" cy="35" r="3" fill="var(--soft-extra)" />
      </Base>
    );
  }

  if (name === 'tasks') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M21 17v32" stroke="var(--soft-main)" strokeWidth="6" strokeLinecap="round" />
        <path d="M24 18h22l-5 9 5 9H24z" fill="var(--soft-accent)" stroke="var(--soft-accent)" strokeWidth="3" strokeLinejoin="round" />
        <path d="m29 28 5 5 10-11" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </Base>
    );
  }

  if (name === 'courses') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <rect x="18" y="20" width="28" height="9" rx="4" fill="var(--soft-main)" />
        <rect x="15" y="30" width="31" height="9" rx="4" fill="var(--soft-accent)" />
        <rect x="20" y="40" width="27" height="9" rx="4" fill="var(--soft-extra)" />
        <path d="M24 24h16M22 35h18M27 45h13" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      </Base>
    );
  }

  if (name === 'grammar' || name === 'reading') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M15 20c8-3 13-1 17 4 4-5 9-7 17-4v28c-8-3-13-1-17 4-4-5-9-7-17-4z" fill="#fff" stroke="var(--soft-main)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M32 24v27M21 29h6M21 37h7M38 29h6M38 37h5" stroke="var(--soft-accent)" strokeWidth="3" strokeLinecap="round" />
        {name === 'grammar' && <path d="M25 44h14" stroke="var(--soft-extra)" strokeWidth="4" strokeLinecap="round" />}
      </Base>
    );
  }

  if (name === 'dictionary') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <circle cx="28" cy="28" r="11" fill="#fff" stroke="var(--soft-main)" strokeWidth="5" />
        <path d="m37 37 10 10" stroke="var(--soft-accent)" strokeWidth="7" strokeLinecap="round" />
        <path d="M25 29h7M28 25v8" stroke="var(--soft-extra)" strokeWidth="3" strokeLinecap="round" />
      </Base>
    );
  }

  if (name === 'vocabulary') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <rect x="18" y="20" width="30" height="26" rx="8" fill="var(--soft-main)" />
        <path d="M24 20h18l-4 8H20z" fill="var(--soft-accent)" />
        <path d="M25 34h16M25 40h11" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="45" cy="22" r="5" fill="var(--soft-extra)" />
      </Base>
    );
  }

  if (name === 'profile' || name === 'users') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <circle cx="32" cy="25" r="9" fill="var(--soft-main)" />
        <path d="M17 49c2-10 9-15 15-15s13 5 15 15" fill="var(--soft-accent)" />
        <circle cx="43" cy="39" r="7" fill="var(--soft-extra)" />
        <path d="m40 39 3 3 5-7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </Base>
    );
  }

  if (name === 'admin') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M32 15 48 21v11c0 10-6 17-16 21-10-4-16-11-16-21V21z" fill="var(--soft-main)" />
        <path d="m24 33 6 6 12-14" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="19" r="5" fill="var(--soft-extra)" />
      </Base>
    );
  }

  if (name === 'listening') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M18 35v-5c0-9 6-15 14-15s14 6 14 15v5" fill="none" stroke="var(--soft-main)" strokeWidth="6" strokeLinecap="round" />
        <rect x="14" y="31" width="11" height="17" rx="5" fill="var(--soft-accent)" />
        <rect x="39" y="31" width="11" height="17" rx="5" fill="var(--soft-accent)" />
        <path d="M29 45h8" stroke="var(--soft-extra)" strokeWidth="5" strokeLinecap="round" />
      </Base>
    );
  }

  if (name === 'speaking') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M16 24c0-6 5-10 12-10h9c7 0 12 4 12 10s-5 10-12 10h-8l-9 8 2-9c-4-2-6-5-6-9z" fill="var(--soft-main)" />
        <path d="M25 25h15M25 31h9" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="43" cy="43" r="8" fill="var(--soft-accent)" />
        <path d="M43 38v8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </Base>
    );
  }

  if (name === 'writing') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M18 44 40 22l8 8-22 22-11 3z" fill="var(--soft-main)" />
        <path d="m39 22 4-4c2-2 5-2 7 0s2 5 0 7l-4 4z" fill="var(--soft-accent)" />
        <path d="M17 44h12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 52h22" stroke="var(--soft-extra)" strokeWidth="4" strokeLinecap="round" />
      </Base>
    );
  }

  if (name === 'games') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M18 29c2-7 8-9 14-5 6-4 12-2 14 5l4 13c1 5-4 9-8 5l-5-5H27l-5 5c-4 4-9 0-8-5z" fill="var(--soft-main)" />
        <path d="M23 34h10M28 29v10" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="40" cy="33" r="3" fill="#fff" />
        <circle cx="46" cy="39" r="3" fill="#fff" />
        <path d="m32 15 2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="var(--soft-extra)" />
      </Base>
    );
  }

  if (name === 'placement') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <circle cx="32" cy="32" r="17" fill="var(--soft-main)" />
        <path d="M32 18v14l10 7" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 18 16 14M44 18l4-4" stroke="var(--soft-accent)" strokeWidth="4" strokeLinecap="round" />
      </Base>
    );
  }

  if (name === 'logout') {
    return (
      <Base name={name} size={size} className={className} title={title}>
        <path d="M20 17h19v30H20z" fill="var(--soft-main)" />
        <path d="M36 32h13m-5-6 6 6-6 6" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="32" r="3" fill="var(--soft-extra)" />
      </Base>
    );
  }

  return (
    <Base name={name} size={size} className={className} title={title}>
      <circle cx="32" cy="32" r="15" fill="var(--soft-main)" />
      <path d="m24 32 6 6 12-14" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="45" cy="20" r="5" fill="var(--soft-extra)" />
    </Base>
  );
}

export default SoftIcon;
