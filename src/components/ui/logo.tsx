import Image from 'next/image';

type LogoSize = 'sm' | 'md' | 'lg';

const iconSizes: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 28, height: 28, className: 'h-7 w-7' },
  md: { width: 36, height: 36, className: 'h-9 w-9' },
  lg: { width: 44, height: 44, className: 'h-11 w-11' },
};

const wordmarkSizes: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 120, height: 20, className: 'h-5' },
  md: { width: 160, height: 28, className: 'h-7' },
  lg: { width: 200, height: 34, className: 'h-[34px]' },
};

interface LogoProps {
  size?: LogoSize;
  variant?: 'full' | 'icon';
}

export function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const iconSize = iconSizes[size];
  const wordmarkSize = wordmarkSizes[size];

  if (variant === 'icon') {
    return (
      <Image
        src="/logo-icon.png"
        alt="After Closing Pro"
        width={iconSize.width}
        height={iconSize.height}
        className={iconSize.className}
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Image
        src="/logo-icon.png"
        alt=""
        width={iconSize.width}
        height={iconSize.height}
        className={iconSize.className}
      />
      <Image
        src="/logo-wordmark.png"
        alt="After Closing Pro"
        width={wordmarkSize.width}
        height={wordmarkSize.height}
        className={`${wordmarkSize.className} w-auto`}
      />
    </span>
  );
}
