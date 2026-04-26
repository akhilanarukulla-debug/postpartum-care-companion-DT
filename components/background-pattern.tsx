"use client"

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="waves" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Soft flowing wave patterns */}
            <path
              d="M0 100 Q50 80 100 100 T200 100"
              fill="none"
              stroke="#E8CFCF"
              strokeWidth="1.5"
              opacity="0.15"
            />
            <path
              d="M0 120 Q50 100 100 120 T200 120"
              fill="none"
              stroke="#D6D4F0"
              strokeWidth="1"
              opacity="0.12"
            />
            <path
              d="M0 60 Q50 40 100 60 T200 60"
              fill="none"
              stroke="#CFE8E6"
              strokeWidth="1.5"
              opacity="0.15"
            />
            {/* Thin curved lines */}
            <path
              d="M20 0 Q40 50 20 100 T20 200"
              fill="none"
              stroke="#D6D4F0"
              strokeWidth="1"
              opacity="0.1"
            />
            <path
              d="M80 0 Q100 50 80 100 T80 200"
              fill="none"
              stroke="#E8CFCF"
              strokeWidth="1"
              opacity="0.12"
            />
            <path
              d="M140 0 Q160 50 140 100 T140 200"
              fill="none"
              stroke="#CFE8E6"
              strokeWidth="1"
              opacity="0.1"
            />
            {/* Abstract organic shapes */}
            <ellipse
              cx="50"
              cy="150"
              rx="30"
              ry="20"
              fill="none"
              stroke="#E8CFCF"
              strokeWidth="1"
              opacity="0.08"
            />
            <ellipse
              cx="150"
              cy="50"
              rx="25"
              ry="15"
              fill="none"
              stroke="#D6D4F0"
              strokeWidth="1"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waves)" />
      </svg>
    </div>
  )
}
