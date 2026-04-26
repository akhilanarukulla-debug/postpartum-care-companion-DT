"use client"

import { useEffect, useState } from "react"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  label: string
  sublabel?: string
  animated?: boolean
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  label,
  sublabel,
  animated = true
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(animated ? 0 : progress)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    if (animated) {
      // Small delay before animation starts for visual effect
      const timeout = setTimeout(() => {
        setAnimatedProgress(progress)
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      setAnimatedProgress(progress)
    }
  }, [progress, animated])

  return (
    <div 
      className="relative flex items-center justify-center animate-in fade-in zoom-in-95 duration-500" 
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-[#CFE8E6]"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transition: animated ? 'stroke-dashoffset 0.8s ease-out' : 'none'
          }}
        />
        {/* Glow effect when full */}
        {animatedProgress >= 100 && (
          <circle
            className="text-[#CFE8E6] animate-gentle-pulse"
            strokeWidth={strokeWidth + 4}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            opacity={0.3}
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-semibold text-foreground">{label}</span>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
