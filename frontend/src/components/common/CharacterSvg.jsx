import { useId } from 'react';

export default function CharacterSvg({ width = 96, className = '', ...props }) {
  const uid = useId().replace(/:/g, '');
  const skinId = `skin-${uid}`;
  const hairId = `hair-${uid}`;
  const goldId = `gold-${uid}`;

  return (
    <svg
      className={`practice-character ${className}`.trim()}
      viewBox="0 0 320 460"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Nhân vật hướng dẫn"
      {...props}
    >
      <defs>
        <linearGradient id={skinId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffd6bd" />
          <stop offset="100%" stopColor="#f0a57c" />
        </linearGradient>
        <linearGradient id={hairId} x1="0" x2="1">
          <stop offset="0%" stopColor="#24171b" />
          <stop offset="100%" stopColor="#8a3f2c" />
        </linearGradient>
        <linearGradient id={goldId} x1="0" x2="1">
          <stop offset="0%" stopColor="#ffe88c" />
          <stop offset="100%" stopColor="#b77918" />
        </linearGradient>
      </defs>

      <g className="character-body" transform="translate(20 10)">
        <g className="character-legs">
          <path d="M95 355 C85 395 70 425 48 455" stroke={`url(#${skinId})`} strokeWidth="34" strokeLinecap="round" fill="none" />
          <path d="M185 355 C210 395 220 425 230 455" stroke={`url(#${skinId})`} strokeWidth="36" strokeLinecap="round" fill="none" />
        </g>

        <path d="M77 165 C35 230 50 330 127 363 C195 393 249 343 232 260 C220 203 169 155 118 148 C101 146 87 153 77 165Z" fill={`url(#${skinId})`} />
        <path d="M70 320 C105 350 178 371 224 335 L218 295 C174 314 116 304 78 276 Z" fill="#8d2d25" />
        <path d="M79 276 C119 303 174 312 218 295" stroke="#e8d4c0" strokeWidth="12" fill="none" strokeLinecap="round" />

        <g className="character-arms">
          <path d="M72 210 C35 235 12 268 2 314" stroke={`url(#${skinId})`} strokeWidth="34" strokeLinecap="round" fill="none" />
          <path d="M225 245 C260 270 282 306 286 346" stroke={`url(#${skinId})`} strokeWidth="34" strokeLinecap="round" fill="none" />
          <circle cx="287" cy="354" r="28" fill={`url(#${skinId})`} />
          <circle cx="18" cy="326" r="23" fill={`url(#${skinId})`} />
        </g>

        <g className="character-head">
          <ellipse cx="145" cy="122" rx="86" ry="100" fill={`url(#${skinId})`} />
          <circle cx="60" cy="125" r="27" fill="#f2b08f" />
          <circle cx="56" cy="125" r="12" fill="#e8877e" opacity=".45" />
          <path d="M52 92 C62 19 138 -5 223 26 C254 38 257 65 230 77 C182 98 118 86 52 92Z" fill={`url(#${hairId})`} />
          <path d="M61 92 C20 120 25 176 51 207 C73 181 79 139 61 92Z" fill="#26191b" />
          <path d="M65 87 C113 50 165 44 229 61" stroke="#a2573b" strokeWidth="4" opacity=".6" fill="none" />
          <path d="M54 82 C104 61 177 58 237 76" stroke="#f4f4f4" strokeWidth="9" fill="none" />
          <path d="M54 72 C108 51 181 50 238 67" stroke="#3ec4e8" strokeWidth="6" fill="none" />

          <g className="character-eyes">
            <ellipse cx="116" cy="124" rx="26" ry="34" fill="#fff5e8" />
            <ellipse cx="178" cy="124" rx="24" ry="33" fill="#fff5e8" />
            <circle cx="124" cy="131" r="9" fill="#372b2b" />
            <circle cx="186" cy="130" r="8" fill="#372b2b" />
          </g>

          <path d="M151 105 C174 122 172 159 148 166 C129 161 128 126 151 105Z" fill="#f06a67" />
          <g className="character-moustache">
            <path d="M74 167 C96 142 133 143 151 165 C126 191 92 189 74 167Z" fill="#3a1d18" />
            <path d="M150 164 C174 141 213 146 226 171 C202 194 171 189 150 164Z" fill="#3a1d18" />
          </g>

          <circle cx="116" cy="122" r="42" fill="none" stroke={`url(#${goldId})`} strokeWidth="7" />
          <circle cx="187" cy="122" r="42" fill="none" stroke={`url(#${goldId})`} strokeWidth="7" />
          <path d="M157 120 C164 115 171 115 178 120" stroke={`url(#${goldId})`} strokeWidth="7" strokeLinecap="round" />
          <path d="M76 116 L43 110" stroke={`url(#${goldId})`} strokeWidth="6" strokeLinecap="round" />
          <path d="M226 116 L260 109" stroke={`url(#${goldId})`} strokeWidth="6" strokeLinecap="round" />
        </g>

        <circle cx="34" cy="323" r="13" fill="#10151d" stroke={`url(#${goldId})`} strokeWidth="5" />
        <path d="M246 294 C261 302 267 322 263 342" stroke={`url(#${goldId})`} strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
