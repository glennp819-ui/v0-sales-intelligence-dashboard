import Image from 'next/image'

import { cn } from '@/lib/utils'

interface CursorBrandProps {
  /** compact: icon + wordmark inline; full: icon + wordmark + tagline stacked */
  variant?: 'compact' | 'full'
  className?: string
}

export function CursorBrand({ variant = 'compact', className }: CursorBrandProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Image
        src="/brand/cursor-icon-dark.png"
        alt=""
        width={28}
        height={28}
        className="size-7 shrink-0"
        priority
      />
      <div className={cn(variant === 'full' && 'min-w-0')}>
        <p className="cursor-brand-wordmark text-[15px] leading-none tracking-[-0.03em] text-foreground">
          cursor
        </p>
        {variant === 'full' && (
          <p className="mt-1 truncate text-[10px] leading-none tracking-wide text-muted-foreground uppercase">
            Sales Intelligence
          </p>
        )}
      </div>
    </div>
  )
}
