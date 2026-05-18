'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Mail, GraduationCap, FileText, BookOpen, HelpCircle, Link2 } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const quickLinks = [
  {
    nameAr: 'بوابة الدخول الموحد',
    nameEn: 'MyQU Portal',
    url:    'https://myqu.qu.edu.sa/',
    icon:   GraduationCap,
  },
  {
    nameAr: 'التعلم الإلكتروني',
    nameEn: 'LMS',
    url:    'https://lms.qu.edu.sa/',
    icon:   BookOpen,
  },
  {
    nameAr: 'إنجاز',
    nameEn: 'Injaz',
    url:    'https://www.qu.edu.sa/dms/',
    icon:   FileText,
  },
  {
    nameAr: 'البريد الجامعي',
    nameEn: 'University Email',
    url:    'https://outlook.com/qu.edu.sa',
    icon:   Mail,
  },
  {
    nameAr: 'دليل الخدمات',
    nameEn: 'Services Guide',
    url:    'https://www.qu.edu.sa/services/',
    icon:   ExternalLink,
  },
  {
    nameAr: 'الأسئلة الشائعة',
    nameEn: 'FAQs',
    url:    'https://www.qu.edu.sa/faqs/',
    icon:   HelpCircle,
  },
]

export function QuickLinks() {
  const { resolvedLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const isAr = resolvedLanguage === 'ar'

  return (
    <div
  className={cn(
    'fixed top-3 z-30',
    isAr ? 'left-20' : 'right-20'
  )}
>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-medium transition-all duration-200 shadow-sm"
      >
        <Link2 className="w-3.5 h-3.5" />
        <span>{isAr ? 'روابط سريعة' : 'Quick Links'}</span>
      </motion.button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />

          {/* Links Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute mt-2 w-56 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50',
              isAr ? 'left-0' : 'right-0'
            )}
          >
            <div className="p-1">
              {quickLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  dir={isAr ? 'rtl' : 'ltr'}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <link.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-foreground/80 group-hover:text-primary transition-colors flex-1">
                    {isAr ? link.nameAr : link.nameEn}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}