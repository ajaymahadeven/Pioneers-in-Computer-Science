interface Props {
  name: string;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.[0] ?? "?").toUpperCase();
  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}

export function AvatarPlaceholder({ name, className = "" }: Props) {
  const initials = getInitials(name);

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-end overflow-hidden bg-[#e8e6e1] dark:bg-[#252525] ${className}`}
      aria-label={`No photo available for ${name}`}
      role="img"
    >
      {/* Bust silhouette */}
      <svg
        viewBox="0 0 100 90"
        className="w-full"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
      >
        {/* Head */}
        <circle
          cx="50"
          cy="30"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-[#b0ada6] dark:text-[#3e3e3e]"
        />
        {/* Shoulders / body */}
        <path
          d="M10 90 Q10 58 50 58 Q90 58 90 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-[#b0ada6] dark:text-[#3e3e3e]"
        />
        {/* Neck */}
        <line
          x1="50"
          y1="48"
          x2="50"
          y2="58"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-[#b0ada6] dark:text-[#3e3e3e]"
        />

        {/* Initials */}
        <text
          x="50"
          y="36"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="600"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fill="currentColor"
          className="text-[#7a776f] dark:text-[#5a5a5a]"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
