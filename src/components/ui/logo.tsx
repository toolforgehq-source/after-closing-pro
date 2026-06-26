import Image from 'next/image';

type LogoSize = 'sm' | 'md' | 'lg';

const iconSizes: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 20, height: 20, className: 'h-5 w-5' },
  md: { width: 28, height: 28, className: 'h-7 w-7' },
  lg: { width: 32, height: 32, className: 'h-8 w-8' },
};

const wordmarkSizes: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 100, height: 16, className: 'h-4' },
  md: { width: 140, height: 22, className: 'h-[22px]' },
  lg: { width: 160, height: 26, className: 'h-[26px]' },
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
