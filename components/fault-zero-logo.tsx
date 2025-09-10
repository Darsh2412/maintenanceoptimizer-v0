interface LogoProps {
  className?: string
  height?: number
}

export function FaultZeroLogo({ className, height = 40 }: LogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        width={height * 5}
        height={height}
        viewBox="0 0 250 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* FAULT text in gray */}
        <text
          x="0"
          y="35"
          fontFamily="Arial, sans-serif"
          fontSize="32"
          fontWeight="bold"
          fill="#A0A0A0"
          letterSpacing="1"
        >
          FAULT
        </text>

        {/* Simple tall lightning bolt */}
        <path d="M125 0 L115 25 L125 25 L115 50 L135 20 L125 20 L135 0 Z" fill="#00A0FF" />

        {/* ZERO text in blue */}
        <text
          x="145"
          y="35"
          fontFamily="Arial, sans-serif"
          fontSize="32"
          fontWeight="bold"
          fill="#00A0FF"
          letterSpacing="1"
        >
          ZERO
        </text>
      </svg>
    </div>
  )
}
