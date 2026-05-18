'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

const quickChips = [
  { ar: 'كيف أحجز موعد في المدينة الطبية؟',    en: 'How to book at Medical City?' },
  { ar: 'ما برامج كلية الهندسة؟',                en: 'Engineering college programs?' },
  { ar: 'كيف أسجل في كلية الطب؟',                en: 'How to register at Medicine college?' },
  { ar: 'كيف أحجز في مدرسة القيادة؟',           en: 'How to book at driving school?' },
  { ar: 'ما المجلات العلمية في الجامعة؟',         en: 'Scientific journals at QU?' },
  { ar: 'كيف أتواصل مع عمادة القبول؟',           en: 'Contact admission deanship?' },
]

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  initialValue?: string
}

export function ChatInput({ onSend, disabled, initialValue = '' }: ChatInputProps) {
  const [message, setMessage] = useState(initialValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { t, dir } = useLanguage()
  const [showChips, setShowChips] = useState(true)
const isAr = dir === 'rtl'

  useEffect(() => {
    if (initialValue) {
      setMessage(initialValue)
      // Focus and move cursor to end
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.selectionStart = textareaRef.current.value.length
        }
      }, 100)
    }
  }, [initialValue])

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChip = (chip: { ar: string; en: string }) => {
  const text = isAr ? chip.ar : chip.en
  setMessage(text)
  setShowChips(false)
  setTimeout(() => textareaRef.current?.focus(), 100)
}

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-resize textarea - use rem-based max height (12.5rem = 200px at 16px base)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const maxHeight = parseFloat(getComputedStyle(document.documentElement).fontSize) * 12.5
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm p-2 md:p-4 pb-4 md:pb-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Quick Chips */}
        {showChips && (
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 flex-nowrap" style={{ scrollbarWidth: 'none' }}>
            {quickChips.map((chip, index) => (
              <button
                key={index}
                onClick={() => handleChip(chip)}
                className="shrink-0 text-[0.65rem] md:text-xs font-medium px-2.5 md:px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 whitespace-nowrap"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                {isAr ? chip.ar : chip.en}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 md:gap-3 bg-secondary/50 rounded-xl md:rounded-2xl border border-border/50 p-1.5 md:p-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t('askAnything')}
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              'min-h-[2.5rem] md:min-h-[2.75rem] max-h-[8rem] md:max-h-[12.5rem] py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base text-foreground placeholder:text-muted-foreground',
              dir === 'rtl' && 'text-right'
            )}
          />
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            size="icon"
            className={cn(
              'shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
              'shadow-lg shadow-primary/20'
            )}
          >
            <Send className={cn('w-4 h-4 md:w-5 md:h-5', dir === 'rtl' && 'rotate-180')} />
            <span className="sr-only">{t('send')}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
