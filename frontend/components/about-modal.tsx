'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Database, Globe, Shield, Zap, Code2, ExternalLink } from 'lucide-react'
import { QULogo } from '@/components/qu-logo'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'

interface AboutModalProps {
  open: boolean
  onClose: () => void
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const { resolvedLanguage } = useLanguage()
  const isAr = resolvedLanguage === 'ar'

  const features = isAr ? [
    { icon: Database, title: '8,577 وثيقة', desc: 'قاعدة معرفية شاملة' },
    { icon: Globe, title: 'عربي وإنجليزي', desc: 'يدعم اللغتين بسلاسة' },
    { icon: Zap, title: 'ردود فورية', desc: 'أقل من 3 ثواني للإجابة' },
    { icon: Shield, title: 'دقيق وآمن', desc: 'يجيب من بيانات الجامعة فقط' },
  ] : [
    { icon: Database, title: '8,577 Documents', desc: 'Comprehensive knowledge base' },
    { icon: Globe, title: 'Bilingual', desc: 'Arabic & English support' },
    { icon: Zap, title: 'Instant Replies', desc: 'Under 3 seconds response' },
    { icon: Shield, title: 'Accurate & Safe', desc: 'Answers from QU data only' },
  ]

  const techStack = [
    { name: 'Next.js 16', color: 'bg-black text-white' },
    { name: 'TypeScript', color: 'bg-blue-600 text-white' },
    { name: 'Tailwind CSS', color: 'bg-cyan-500 text-white' },
    { name: 'n8n', color: 'bg-pink-600 text-white' },
    { name: 'Pinecone', color: 'bg-green-600 text-white' },
    { name: 'OpenAI', color: 'bg-gray-800 text-white' },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-[90vw] md:max-w-2xl md:max-h-[90vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 md:p-8 border-b border-border/50">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <QULogo size="lg" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-1">
                    <span>{isAr ? 'مساعد جامعة القصيم الذكي' : 'QU Smart Assistant'}</span>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isAr ? 'الإصدار 1.0 • مدعوم بالذكاء الاصطناعي' : 'Version 1.0 • AI-Powered Assistant'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {isAr ? 'عن المساعد' : 'About'}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-foreground/80">
                  {isAr
                    ? 'مساعد ذكي مصمم خصيصاً لطلاب جامعة القصيم. مشروع تخرج لقسم علوم الحاسب يستخدم تقنية RAG، دعماً لأهداف رؤية المملكة 2030.'
                    : 'An intelligent assistant designed for Qassim University students. A graduation project from the Computer Science Department, supporting Saudi Vision 2030.'}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {isAr ? 'المميزات' : 'Features'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-secondary/40 rounded-xl border border-border/50">
                      <div className="shrink-0 p-2 bg-primary/10 rounded-lg">
                        <f.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-0.5">{f.title}</h4>
                        <p className="text-xs text-muted-foreground leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  {isAr ? 'التقنيات المستخدمة' : 'Tech Stack'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <span key={idx} className={cn('text-xs font-medium px-3 py-1.5 rounded-md shadow-sm', tech.color)}>
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                  <strong>{isAr ? 'تنبيه:' : 'Disclaimer:'}</strong>{' '}
                  {isAr
                    ? 'هذا المساعد يقدم معلومات من قاعدة بيانات الجامعة. للأمور الرسمية، يرجى التواصل مع الجامعة على 0163800050.'
                    : 'This assistant provides information from the university database. For official matters, please contact 0163800050.'}
                </p>
              </div>
            </div>

            <div className="border-t border-border/50 px-6 py-4 bg-secondary/30 space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  {isAr ? 'فريق المشروع' : 'Project Team'}
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[0.7rem] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span>Suliman Al-Ghofaili</span>
                    <span className="text-[0.55rem] font-bold px-1.5 py-0.5 bg-primary/15 text-primary rounded-full">
                      {isAr ? 'قائد الفريق' : 'LEAD'}
                    </span>
                  </span>
                  <span>Rayan Al-Harbi</span>
                  <span>Khalifah Al-Khalifah</span>
                  <span>Faris Al-Awaji</span>
                  <span>Sultan Al-Mutairi</span>
                  <span>Abdulrahman Al-Resheed</span>
                </div>
              </div>

              <div className="text-[0.7rem]">
                <span className="font-semibold text-primary">
                  {isAr ? 'المشرف: ' : 'Supervisor: '}
                </span>
                <span className="text-muted-foreground">Dr. Abdulgader Al-Maymuni</span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border/30">
                <p className="text-[0.65rem] text-muted-foreground">
                  {isAr ? 'مشروع تخرج - قسم علوم الحاسب - CS498' : 'Graduation Project - Computer Science - CS498'}
                </p>
                <p className="text-[0.65rem] text-muted-foreground">
                  1447/1448 (2025/2026)
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[0.65rem] text-muted-foreground">
                  {isAr ? 'كلية الحاسب - جامعة القصيم' : 'College of Computer - Qassim University'}
                </p>
                <a
                  href="https://www.qu.edu.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  qu.edu.sa
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}