'use client'
import { HeartPulse, GraduationCap, Building2, Microscope, Car, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { QULogo } from '@/components/qu-logo'
import { useLanguage } from '@/components/language-provider'
import { QuickLinks } from '@/components/quick-links'

interface WelcomeScreenProps {
  onQuickAction: (message: string) => void
}

const quickActions = [
  {
    icon: HeartPulse,
    titleKey: 'healthServices',
    descKey: 'healthServicesDesc',
    promptEn: 'What health services does QU Medical City and health colleges provide?',
    promptAr: 'ما هي الخدمات الصحية في المدينة الطبية والكليات الصحية بجامعة القصيم؟',
  },
  {
    icon: GraduationCap,
    titleKey: 'admissionReg',
    descKey: 'admissionRegDesc',
    promptEn: 'What are the admission requirements for Bachelor, Graduate, and Diploma programs?',
    promptAr: 'ما هي شروط ومتطلبات القبول للبكالوريوس والدراسات العليا والدبلوم؟',
  },
  {
    icon: Building2,
    titleKey: 'collegesPrograms',
    descKey: 'collegesProgramsDesc',
    promptEn: 'What colleges and academic programs are offered at Qassim University?',
    promptAr: 'ما هي الكليات والبرامج الأكاديمية المتاحة في جامعة القصيم؟',
  },
  {
    icon: Microscope,
    titleKey: 'researchInnovation',
    descKey: 'researchInnovationDesc',
    promptEn: 'What research centers, chairs, and scientific journals does QU have?',
    promptAr: 'ما هي مراكز الأبحاث والكراسي البحثية والمجلات العلمية في جامعة القصيم؟',
  },
  {
    icon: Car,
    titleKey: 'supportServices',
    descKey: 'supportServicesDesc',
    promptEn: 'How can I register at the driving school or the Studies and Consulting Institute?',
    promptAr: 'كيف أسجل في مدرسة القيادة أو معهد الدراسات والاستشارات؟',
  },
  {
    icon: Briefcase,
    titleKey: 'universityAdmin',
    descKey: 'universityAdminDesc',
    promptEn: 'What administrative departments, agencies, and deanships are at QU?',
    promptAr: 'ما هي الإدارات والوكالات والعمادات في جامعة القصيم؟',
  },
]

const stats = [
  { value: '3,305',  labelAr: 'عضو هيئة تدريس',   labelEn: 'Faculty Members'      },
  { value: '13,706', labelAr: 'بحث منشور',          labelEn: 'Published Research'   },
  { value: '1,773',  labelAr: 'قاعة دراسية',        labelEn: 'Classrooms'           },
  { value: '433',    labelAr: 'مختبرات ومعامل',     labelEn: 'Labs & Workshops'     },
  { value: '269',    labelAr: 'قاعة تدريبية',       labelEn: 'Training Halls'       },
  { value: '230',    labelAr: 'عيادة طبية',         labelEn: 'Medical Clinics'      },
  { value: '42',     labelAr: 'مكتبة',              labelEn: 'Libraries'            },
  { value: '12',     labelAr: 'مجلة علمية',         labelEn: 'Scientific Journals'  },
  { value: '5',      labelAr: 'مراكز بحثية',        labelEn: 'Research Centers'     },
  { value: '5',      labelAr: 'جمعية علمية',        labelEn: 'Scientific Societies' },
  { value: '15',     labelAr: 'صالة رياضية',        labelEn: 'Sports Halls'         },
  { value: '3',      labelAr: 'مدن جامعية',         labelEn: 'University Cities'    },
]

export function WelcomeScreen({ onQuickAction }: WelcomeScreenProps) {
  const { t, resolvedLanguage } = useLanguage()
  const isAr = resolvedLanguage === 'ar'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-start py-3 md:py-6 px-4"
    >
      {/* Logo & Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-3 md:mb-5 text-center"
      >
        <QULogo size="xl" className="mx-auto mb-2 md:mb-4" />
        <h1
          dir={isAr ? 'rtl' : 'ltr'}
          className="text-[1.125rem] md:text-[1.875rem] lg:text-[2.25rem] font-bold mb-1 md:mb-3 leading-tight text-balance"
        >
          <span className="text-primary">{isAr ? 'مرحباً بك' : 'Welcome'}</span>
          <span className="text-foreground">
            {' '}{isAr ? 'في مساعد جامعة القصيم الذكي' : 'to Qassim University Intelligent Assistant'}
          </span>
        </h1>
        <p
          dir={isAr ? 'rtl' : 'ltr'}
          className="text-muted-foreground text-[0.75rem] md:text-[1.125rem] font-normal max-w-md mx-auto leading-relaxed text-balance"
        >
          {t('welcomeSubtitle')}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-3xl mb-5 md:mb-7"
      >
        <p
          dir={isAr ? 'rtl' : 'ltr'}
          className="text-center text-[0.65rem] md:text-xs font-semibold text-muted-foreground mb-2 md:mb-3 uppercase tracking-widest"
        >
          {isAr ? '🏛️ جامعة القصيم في أرقام' : '🏛️ Qassim University in Numbers'}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 md:gap-2">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.04, duration: 0.3 }}
              className="flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 rounded-xl p-2 md:p-3 transition-all duration-300 text-center group cursor-default"
            >
              <span className="text-primary font-extrabold text-sm md:text-base lg:text-lg leading-none mb-1 group-hover:scale-110 transition-transform duration-200">
                {stat.value}
              </span>
              <span
                dir={isAr ? 'rtl' : 'ltr'}
                className="text-muted-foreground text-[0.5rem] md:text-[0.6rem] leading-tight"
              >
                {isAr ? stat.labelAr : stat.labelEn}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full max-w-2xl pb-3"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.titleKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 + index * 0.1, duration: 0.4 }}
          >
            <Card
              onClick={() => onQuickAction(isAr ? action.promptAr : action.promptEn)}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-2.5 md:p-5">
                <div className="flex items-center gap-2.5 md:gap-4">
                  <div className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0">
                    <action.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      dir={isAr ? 'rtl' : 'ltr'}
                      className="font-semibold text-[0.8125rem] md:text-base text-card-foreground mb-0.5 group-hover:text-primary transition-colors"
                    >
                      {t(action.titleKey)}
                    </h3>
                    <p
                      dir={isAr ? 'rtl' : 'ltr'}
                      className="text-[0.6875rem] md:text-sm text-muted-foreground line-clamp-1 md:line-clamp-2"
                      style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                    >
                      {t(action.descKey)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}