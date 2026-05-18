'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface QULogoProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// Size configurations for responsive image optimization
const sizeConfig = {
  xs: { classes: 'w-6 h-6 md:w-8 md:h-8', sizes: '(min-width: 768px) 32px, 24px' },
  sm: { classes: 'w-7 h-7 md:w-10 md:h-10', sizes: '(min-width: 768px) 40px, 28px' },
  md: { classes: 'w-9 h-9 md:w-14 md:h-14', sizes: '(min-width: 768px) 56px, 36px' },
  lg: { classes: 'w-12 h-12 md:w-20 md:h-20', sizes: '(min-width: 768px) 80px, 48px' },
  xl: { classes: 'w-14 h-14 md:w-24 md:h-24 lg:w-32 lg:h-32', sizes: '(min-width: 1024px) 128px, (min-width: 768px) 96px, 56px' },
}

export function QULogo({ className, size = 'md' }: QULogoProps) {
  const config = sizeConfig[size]

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-[22%] overflow-hidden',
        'backdrop-blur-sm',
        'border border-black/5 dark:border-white/10',
        'shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.08)]',
        'dark:shadow-[0_4px_12px_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.3),0_16px_48px_rgba(0,0,0,0.2)]',
        config.classes, 
        className
      )}
    >
      <Image
        src="/qu-logo.png"
        alt="Qassim University Logo"
        fill
        sizes={config.sizes}
        className="object-cover"
        priority
      />
    </div>
  )
}
