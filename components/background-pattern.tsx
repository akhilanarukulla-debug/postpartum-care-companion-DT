"use client"

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#FAF9F7]">
      {/* Abstract Organic Blobs - Soft pastel shapes with blur */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Blur filter for soft blob edges */}
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
          <filter id="mediumBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
        </defs>

        {/* Large organic blobs - positioned in corners and edges */}
        {/* Top-left dusty pink blob */}
        <ellipse
          cx="-5%"
          cy="10%"
          rx="25%"
          ry="20%"
          fill="#E8CFCF"
          opacity="0.35"
          filter="url(#softBlur)"
        />
        
        {/* Top-right peach blob */}
        <ellipse
          cx="95%"
          cy="5%"
          rx="20%"
          ry="18%"
          fill="#F7D9C4"
          opacity="0.3"
          filter="url(#softBlur)"
        />
        
        {/* Middle-left lavender blob */}
        <ellipse
          cx="-8%"
          cy="45%"
          rx="18%"
          ry="25%"
          fill="#D6D4F0"
          opacity="0.25"
          filter="url(#softBlur)"
        />
        
        {/* Bottom-right beige blob */}
        <ellipse
          cx="100%"
          cy="85%"
          rx="22%"
          ry="20%"
          fill="#EADBC8"
          opacity="0.35"
          filter="url(#softBlur)"
        />
        
        {/* Bottom-left soft pink blob */}
        <ellipse
          cx="5%"
          cy="95%"
          rx="20%"
          ry="15%"
          fill="#E8CFCF"
          opacity="0.28"
          filter="url(#softBlur)"
        />
        
        {/* Center-right small peach accent */}
        <ellipse
          cx="90%"
          cy="40%"
          rx="12%"
          ry="15%"
          fill="#F7D9C4"
          opacity="0.2"
          filter="url(#mediumBlur)"
        />
      </svg>

      {/* Botanical Line Art Layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Top-left branch with leaves */}
        <g opacity="0.15" stroke="#9B8B7A" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Main branch */}
          <path d="M -20 80 Q 30 60 80 90 Q 130 120 150 100" />
          {/* Leaves on branch */}
          <path d="M 20 70 Q 35 50 30 70 Q 45 55 20 70" />
          <path d="M 50 80 Q 70 60 65 82 Q 85 65 50 80" />
          <path d="M 90 95 Q 105 75 100 97 Q 120 80 90 95" />
          <path d="M 120 105 Q 140 85 135 107 Q 155 90 120 105" />
        </g>

        {/* Top-right eucalyptus branch */}
        <g opacity="0.12" stroke="#8B7B6B" strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M 320 -10 Q 300 30 310 70 Q 320 110 300 140" />
          {/* Round eucalyptus leaves */}
          <ellipse cx="295" cy="25" rx="12" ry="8" transform="rotate(-20 295 25)" />
          <ellipse cx="315" cy="50" rx="10" ry="7" transform="rotate(15 315 50)" />
          <ellipse cx="300" cy="80" rx="11" ry="8" transform="rotate(-10 300 80)" />
          <ellipse cx="310" cy="110" rx="10" ry="7" transform="rotate(20 310 110)" />
        </g>

        {/* Bottom-right floral element */}
        <g opacity="0.18" stroke="#A09080" strokeWidth="1.2" fill="none" strokeLinecap="round" transform="translate(280, 520)">
          {/* Simple flower */}
          <circle cx="30" cy="30" r="8" />
          <path d="M 30 22 Q 30 10 35 5" />
          <path d="M 38 27 Q 50 20 55 25" />
          <path d="M 38 33 Q 50 40 55 35" />
          <path d="M 30 38 Q 30 50 35 55" />
          <path d="M 22 33 Q 10 40 5 35" />
          <path d="M 22 27 Q 10 20 5 25" />
          {/* Stem */}
          <path d="M 30 38 Q 25 60 30 90 Q 35 120 25 150" />
          {/* Stem leaves */}
          <path d="M 28 70 Q 10 65 15 80 Q 5 75 28 70" />
          <path d="M 32 100 Q 50 95 45 110 Q 55 105 32 100" />
        </g>

        {/* Left side delicate branch */}
        <g opacity="0.14" stroke="#9B8B7A" strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M -10 350 Q 20 330 40 350 Q 60 370 50 400 Q 40 430 60 460" />
          {/* Small leaves */}
          <path d="M 15 340 Q 25 325 20 345 Q 35 330 15 340" />
          <path d="M 45 365 Q 60 350 55 370 Q 70 355 45 365" />
          <path d="M 48 410 Q 65 400 58 418 Q 75 405 48 410" />
        </g>

        {/* Bottom-left botanical curve */}
        <g opacity="0.12" stroke="#8B7B6B" strokeWidth="1.2" fill="none" strokeLinecap="round">
          <path d="M 50 700 Q 80 650 60 600 Q 40 550 70 520" />
          {/* Attached leaves */}
          <path d="M 70 640 Q 90 620 80 645 Q 100 625 70 640" />
          <path d="M 55 580 Q 75 560 65 585 Q 85 565 55 580" />
          <path d="M 65 540 Q 85 520 75 545 Q 95 525 65 540" />
        </g>

        {/* Right side tall grass/reed */}
        <g opacity="0.1" stroke="#9B8B7A" strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M 340 700 Q 335 650 340 600 Q 345 550 338 500 Q 330 450 340 400" />
          <path d="M 355 700 Q 360 660 355 620 Q 350 580 358 540 Q 365 500 355 460" />
          <path d="M 325 700 Q 320 670 328 640 Q 335 610 325 580" />
        </g>
      </svg>

      {/* Subtle texture dots layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.8" fill="#9B8B7A" opacity="0.08" />
            <circle cx="50" cy="30" r="0.6" fill="#A09080" opacity="0.06" />
            <circle cx="30" cy="60" r="0.7" fill="#8B7B6B" opacity="0.07" />
            <circle cx="70" cy="70" r="0.5" fill="#9B8B7A" opacity="0.05" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  )
}
