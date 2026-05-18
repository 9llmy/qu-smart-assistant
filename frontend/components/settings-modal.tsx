'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Palette,
  Globe,
  Type,
  HelpCircle,
  History,
  Sun,
  Moon,
  Monitor,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/components/language-provider'
import { FontSize } from '@/lib/settings-store'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fontSize: FontSize
  onFontSizeChange: (size: FontSize) => void
  onClearHistory: () => void
}

export function SettingsModal({
  open,
  onOpenChange,
  fontSize,
  onFontSizeChange,
  onClearHistory,
}: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage, dir } = useLanguage()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleClearHistory = () => {
    onClearHistory()
    setShowConfirmation(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95%] max-w-md max-h-[90vh] p-0 flex flex-col overflow-hidden"
        showCloseButton={true}
      >
        <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-xl font-semibold">{t('settings')}</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Profile Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-[1.2em] h-[1.2em] text-primary" />
              <h3 className="font-medium text-foreground">{t('profile')}</h3>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
              <Avatar className="w-14 h-14 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  R
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">Rayan</p>
                <p className="text-sm text-muted-foreground">{t('computerScience')}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-[1.2em] h-[1.2em] text-primary" />
              <h3 className="font-medium text-foreground">{t('appearance')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t('theme')}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', icon: Sun, label: t('light') },
                { value: 'dark', icon: Moon, label: t('dark') },
                { value: 'system', icon: Monitor, label: t('system') },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={theme === option.value ? 'default' : 'outline'}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 h-auto py-4',
                    theme === option.value && 'bg-primary text-primary-foreground'
                  )}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </section>

          <Separator />

          {/* Language Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-[1.2em] h-[1.2em] text-primary" />
              <h3 className="font-medium text-foreground">{t('language')}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
                className={cn(
                  'h-12',
                  language === 'en' && 'bg-primary text-primary-foreground'
                )}
              >
                {t('english')}
              </Button>
              <Button
                variant={language === 'ar' ? 'default' : 'outline'}
                onClick={() => setLanguage('ar')}
                className={cn(
                  'h-12 font-[var(--font-tajawal)]',
                  language === 'ar' && 'bg-primary text-primary-foreground'
                )}
              >
                {t('arabic')}
              </Button>
              <Button
                variant={language === 'system' ? 'default' : 'outline'}
                onClick={() => setLanguage('system')}
                className={cn(
                  'h-12',
                  language === 'system' && 'bg-primary text-primary-foreground'
                )}
              >
                {t('system')}
              </Button>
            </div>
          </section>

          <Separator />

          {/* Accessibility Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-[1.2em] h-[1.2em] text-primary" />
              <h3 className="font-medium text-foreground">{t('accessibility')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t('fontSize')}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'small', label: t('small'), size: 'text-sm' },
                { value: 'default', label: t('default'), size: 'text-base' },
                { value: 'large', label: t('large'), size: 'text-lg' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={fontSize === option.value ? 'default' : 'outline'}
                  onClick={() => onFontSizeChange(option.value as FontSize)}
                  className={cn(
                    'h-12',
                    option.size,
                    fontSize === option.value && 'bg-primary text-primary-foreground'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </section>

          <Separator />

          {/* Support & Help Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-[1.2em] h-[1.2em] text-primary" />
              <h3 className="font-medium text-foreground">{t('supportHelp')}</h3>
            </div>
            <div className="space-y-2">
              <a
                href="https://www.qu.edu.sa/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <span className="text-sm text-foreground">{t('technicalSupport')}</span>
                <ExternalLink className="w-[1.2em] h-[1.2em] text-muted-foreground" />
              </a>
              <a
                href="https://www.qu.edu.sa/faqs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              >
                <span className="text-sm text-foreground">{t('faq')}</span>
                <ExternalLink className="w-[1.2em] h-[1.2em] text-muted-foreground" />
              </a>
            </div>
          </section>

          <Separator />

          {/* Data Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-[1.2em] h-[1.2em] text-primary" />
              <h3 className="font-medium text-foreground">{t('data')}</h3>
            </div>
            <Button
              onClick={() => setShowConfirmation(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            >
              {t('clearHistory')}
            </Button>
          </section>
        </div>

        {/* Clear History Confirmation Overlay */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-background rounded-xl p-6 text-center space-y-5 w-[90%] max-w-[20rem] shadow-xl border border-border"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('clearHistory')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('clearHistoryConfirm')}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 h-11"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleClearHistory}
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t('confirm')}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
