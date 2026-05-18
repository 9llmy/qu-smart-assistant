'use client'

import { motion } from 'framer-motion'
import { QULogo } from '@/components/qu-logo'
import { useLanguage } from '@/components/language-provider'

export function ChatHeader() {
  const { dir } = useLanguage()
  const isRtl = dir === 'rtl'

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="shrink-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 px-3 py-2 md:px-6 md:py-3 min-h-[2.75rem] md:min-h-[3.5rem]">
        {/* Spacer for mobile menu button - matches the fixed button position */}
        <div className="w-8 h-8 shrink-0 md:hidden" aria-hidden="true" />
        
        {/* Logo and Title - responsive to language direction */}
        <div className={`flex items-center gap-2.5 md:gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <QULogo size="xs" className="shrink-0" />
          <h1 className="text-base md:text-xl font-bold text-foreground truncate">Qassim AI</h1>
        </div>
      </div>
    </motion.header>
  )
}
