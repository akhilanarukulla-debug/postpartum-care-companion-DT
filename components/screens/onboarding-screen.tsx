"use client"

import { Heart } from "lucide-react"
import { BackgroundPattern } from "@/components/background-pattern"

interface OnboardingScreenProps {
  onGetStarted: () => void
}

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen relative flex flex-col">
      <BackgroundPattern />
      
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 animate-in fade-in duration-500">
        {/* Decorative Icon */}
        <div className="w-20 h-20 rounded-full bg-[#E8CFCF]/60 flex items-center justify-center mb-8 animate-in zoom-in duration-300 delay-150">
          <Heart className="w-10 h-10 text-[#5A4545]" strokeWidth={1.5} />
        </div>
        
        {/* Main Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
          {"You're doing"}
          <br />
          <span className="text-[#5A4545]">amazing, mama.</span>
        </h1>
        
        {/* Supportive Text */}
        <p className="text-muted-foreground text-center max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
          {"We're here to support you every step of the way."}
        </p>
      </div>
      
      {/* Bottom CTA */}
      <div className="px-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-500">
        <button
          onClick={onGetStarted}
          className="w-full py-4 bg-[#E8CFCF] text-[#5A4545] font-semibold rounded-2xl
            transition-all duration-150 ease-out
            active:scale-[0.98] active:shadow-none
            hover:shadow-lg hover:bg-[#E0C5C5]
            focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] focus:ring-offset-2"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
