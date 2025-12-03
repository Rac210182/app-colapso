'use client';

interface ProgressCircleProps {
  currentDay: number;
  totalDays: number;
  isLocked: boolean;
}

export function ProgressCircle({ currentDay, totalDays, isLocked }: ProgressCircleProps) {
  const percentage = (currentDay / totalDays) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="120"
          stroke="#333"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r="120"
          stroke={isLocked ? '#DC2626' : '#D4AF37'}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl sm:text-6xl font-bold text-[#D4AF37]">
          {currentDay}
        </span>
        <span className="text-white/60 text-sm mt-2">/ {totalDays}</span>
        {isLocked && (
          <span className="text-red-600 text-xs mt-2 font-bold">TRANCADO</span>
        )}
      </div>
    </div>
  );
}
