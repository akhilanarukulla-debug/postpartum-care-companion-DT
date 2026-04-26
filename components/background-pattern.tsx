"use client"

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#FAF9F7]">
      {/* Layer 1: Soft Organic Blobs */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 390 844"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="blobBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="35" />
          </filter>
          <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>

        {/* Top-left large peach/pink blob - partial off-screen */}
        <ellipse
          cx="-30"
          cy="80"
          rx="180"
          ry="140"
          fill="#E8CFCF"
          opacity="0.45"
          filter="url(#blobBlur)"
        />
        
        {/* Top-right warm beige blob */}
        <ellipse
          cx="380"
          cy="30"
          rx="140"
          ry="110"
          fill="#F4E7E1"
          opacity="0.5"
          filter="url(#blobBlur)"
        />
        
        {/* Mid-left lavender blob */}
        <ellipse
          cx="-40"
          cy="380"
          rx="120"
          ry="160"
          fill="#DDD4F0"
          opacity="0.35"
          filter="url(#blobBlur)"
        />
        
        {/* Center-right soft teal accent */}
        <ellipse
          cx="420"
          cy="320"
          rx="100"
          ry="130"
          fill="#CFE8E6"
          opacity="0.3"
          filter="url(#blobBlur)"
        />
        
        {/* Bottom-left peach blob */}
        <ellipse
          cx="60"
          cy="800"
          rx="150"
          ry="120"
          fill="#F7D9C4"
          opacity="0.4"
          filter="url(#blobBlur)"
        />
        
        {/* Bottom-right pink blob - partial */}
        <ellipse
          cx="400"
          cy="750"
          rx="140"
          ry="150"
          fill="#E8CFCF"
          opacity="0.35"
          filter="url(#blobBlur)"
        />
        
        {/* Small accent blobs */}
        <ellipse
          cx="320"
          cy="180"
          rx="50"
          ry="40"
          fill="#F4E7E1"
          opacity="0.35"
          filter="url(#softBlur)"
        />
        
        <ellipse
          cx="80"
          cy="550"
          rx="60"
          ry="50"
          fill="#DDD4F0"
          opacity="0.25"
          filter="url(#softBlur)"
        />
      </svg>

      {/* Layer 2: Botanical Line Art */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 390 844"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Top-left corner branch with leaves */}
        <g 
          opacity="0.18" 
          stroke="#8B7355" 
          strokeWidth="1.2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Main curved branch */}
          <path d="M -20 60 Q 40 50 80 80 Q 120 110 140 95" />
          
          {/* Leaves along branch - almond shaped */}
          <path d="M 25 55 Q 40 35 55 55 Q 40 45 25 55" />
          <path d="M 60 70 Q 80 50 95 70 Q 80 60 60 70" />
          <path d="M 100 90 Q 120 70 135 90 Q 120 80 100 90" />
          
          {/* Secondary small branch */}
          <path d="M 50 65 Q 45 40 60 25" />
          <path d="M 55 35 Q 65 20 75 35 Q 65 28 55 35" />
        </g>

        {/* Top-right eucalyptus/olive branch */}
        <g 
          opacity="0.15" 
          stroke="#9B8B7A" 
          strokeWidth="1" 
          fill="none" 
          strokeLinecap="round"
        >
          {/* Curved stem coming from top-right */}
          <path d="M 420 40 Q 360 60 340 110 Q 320 160 340 200" />
          
          {/* Rounded leaves */}
          <ellipse cx="370" cy="70" rx="18" ry="10" transform="rotate(-30 370 70)" />
          <ellipse cx="345" cy="105" rx="16" ry="9" transform="rotate(15 345 105)" />
          <ellipse cx="330" cy="145" rx="17" ry="10" transform="rotate(-20 330 145)" />
          <ellipse cx="340" cy="185" rx="15" ry="9" transform="rotate(10 340 185)" />
        </g>

        {/* Left side delicate stem with leaves */}
        <g 
          opacity="0.14" 
          stroke="#8B7355" 
          strokeWidth="1.1" 
          fill="none" 
          strokeLinecap="round"
        >
          <path d="M -10 320 Q 30 340 45 380 Q 60 420 40 470 Q 20 520 50 560" />
          
          {/* Leaves */}
          <path d="M 20 350 Q 40 330 50 355 Q 40 345 20 350" />
          <path d="M 50 400 Q 75 385 80 410 Q 70 400 50 400" />
          <path d="M 35 450 Q 55 435 60 460 Q 50 450 35 450" />
          <path d="M 45 510 Q 70 495 75 520 Q 60 510 45 510" />
        </g>

        {/* Bottom-right floral element */}
        <g 
          opacity="0.16" 
          stroke="#A09080" 
          strokeWidth="1.2" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Simple 6-petal flower */}
          <circle cx="340" cy="680" r="12" />
          <path d="M 340 668 Q 340 655 345 648" />
          <path d="M 352 675 Q 365 668 372 672" />
          <path d="M 352 685 Q 365 692 372 688" />
          <path d="M 340 692 Q 340 705 345 712" />
          <path d="M 328 685 Q 315 692 308 688" />
          <path d="M 328 675 Q 315 668 308 672" />
          
          {/* Flower stem */}
          <path d="M 340 692 Q 330 720 340 760 Q 350 800 330 850" />
          
          {/* Stem leaves */}
          <path d="M 335 730 Q 310 720 320 745 Q 305 735 335 730" />
          <path d="M 345 780 Q 370 770 365 795 Q 380 785 345 780" />
        </g>

        {/* Bottom-left simple branch */}
        <g 
          opacity="0.12" 
          stroke="#9B8B7A" 
          strokeWidth="1" 
          fill="none" 
          strokeLinecap="round"
        >
          <path d="M 80 870 Q 60 820 90 780 Q 120 740 100 700" />
          
          {/* Leaves */}
          <path d="M 75 800 Q 50 785 60 810 Q 45 800 75 800" />
          <path d="M 100 755 Q 125 740 120 765 Q 135 755 100 755" />
          <path d="M 100 720 Q 80 700 90 725 Q 75 715 100 720" />
        </g>

        {/* Right edge decorative grass/reeds */}
        <g 
          opacity="0.1" 
          stroke="#8B7355" 
          strokeWidth="1" 
          fill="none" 
          strokeLinecap="round"
        >
          <path d="M 400 500 Q 385 450 395 400 Q 405 350 390 300" />
          <path d="M 415 520 Q 400 480 410 440 Q 420 400 405 360" />
          <path d="M 385 490 Q 375 460 385 430 Q 395 400 380 370" />
        </g>
      </svg>

      {/* Layer 3: Subtle Texture - Dots and Speckles */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Scattered dots pattern */}
          <pattern id="dotsPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="20" r="1" fill="#9B8B7A" opacity="0.06" />
            <circle cx="65" cy="10" r="0.8" fill="#8B7355" opacity="0.05" />
            <circle cx="40" cy="45" r="1.2" fill="#A09080" opacity="0.04" />
            <circle cx="85" cy="55" r="0.7" fill="#9B8B7A" opacity="0.05" />
            <circle cx="25" cy="75" r="0.9" fill="#8B7355" opacity="0.06" />
            <circle cx="70" cy="85" r="1" fill="#A09080" opacity="0.04" />
          </pattern>
          
          {/* Small accent dots - slightly larger for visibility */}
          <pattern id="accentDots" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="50" r="2" fill="#E8CFCF" opacity="0.15" />
            <circle cx="150" cy="30" r="1.5" fill="#DDD4F0" opacity="0.12" />
            <circle cx="80" cy="140" r="2" fill="#F7D9C4" opacity="0.1" />
            <circle cx="170" cy="160" r="1.8" fill="#CFE8E6" opacity="0.12" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#dotsPattern)" />
        <rect width="100%" height="100%" fill="url(#accentDots)" />
      </svg>

      {/* Layer 4: Decorative small elements - dashes and marks */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 390 844"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Small decorative dashes - top area */}
        <g stroke="#9B8B7A" strokeWidth="1" opacity="0.1" strokeLinecap="round">
          <line x1="300" y1="140" x2="305" y2="150" />
          <line x1="310" y1="145" x2="315" y2="155" />
          <line x1="320" y1="138" x2="325" y2="148" />
        </g>
        
        {/* Small dashes - mid left */}
        <g stroke="#8B7355" strokeWidth="1" opacity="0.08" strokeLinecap="round">
          <line x1="30" y1="480" x2="35" y2="490" />
          <line x1="40" y1="485" x2="45" y2="495" />
          <line x1="50" y1="478" x2="55" y2="488" />
        </g>
        
        {/* Small dashes - bottom right */}
        <g stroke="#A09080" strokeWidth="1" opacity="0.1" strokeLinecap="round">
          <line x1="280" y1="620" x2="285" y2="630" />
          <line x1="290" y1="625" x2="295" y2="635" />
          <line x1="300" y1="618" x2="305" y2="628" />
        </g>

        {/* Scattered small dots clusters */}
        <g fill="#9B8B7A" opacity="0.12">
          <circle cx="150" cy="100" r="2" />
          <circle cx="160" cy="95" r="1.5" />
          <circle cx="155" cy="108" r="1.2" />
        </g>
        
        <g fill="#A09080" opacity="0.1">
          <circle cx="250" cy="450" r="1.8" />
          <circle cx="260" cy="445" r="1.3" />
          <circle cx="255" cy="458" r="1.5" />
        </g>
        
        <g fill="#8B7355" opacity="0.08">
          <circle cx="100" cy="650" r="2" />
          <circle cx="110" cy="645" r="1.5" />
          <circle cx="105" cy="658" r="1.2" />
        </g>
      </svg>
    </div>
  )
}
