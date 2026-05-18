'use client'

import * as React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ar' | 'system'
type ResolvedLanguage = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  resolvedLanguage: ResolvedLanguage
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

function detectSystemLanguage(): ResolvedLanguage {
  if (typeof navigator === 'undefined') return 'en'
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
  // Check if browser language starts with 'ar' (e.g., 'ar', 'ar-SA', 'ar-EG')
  return browserLang.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

const translations = {
  en: {
    // Sidebar
    'newChat': 'New Chat',
    'chatHistory': 'Chat History',
    'settings': 'Settings',
    'today': 'Today',
    'yesterday': 'Yesterday',
    'previous7Days': 'Previous 7 Days',
    'about': 'About',
    
    // Welcome
    'welcomeTitle': 'Welcome to Qassim University Intelligent Assistant',
    'welcomeSubtitle': 'Your smart portal for all university services',
    'askAnything': 'Ask me anything about Qassim University...',
    
    // Quick Actions
    'academicCalendar': 'Academic Calendar',
    'academicCalendarDesc': 'View important dates and deadlines',
    'courseRegistration': 'Course Registration',
    'courseRegistrationDesc': 'Get help with registration process',
    'libraryServices': 'Library Services',
    'libraryServicesDesc': 'Access digital resources and books',
    'campusServices': 'Campus Services',
    'campusServicesDesc': 'Find campus facilities and support',
    // New Quick Actions
    'medicalCity':        'Medical City',
    'medicalCityDesc':    'University hospital services and clinics',
    'admission':          'Admission & Registration',
    'admissionDesc':      'Requirements and procedures for joining QU',
    'drivingSchool':      'Driving School',
    'drivingSchoolDesc':  'Register and book driving lessons',
    'healthColleges':     'Health Colleges',
    'healthCollegesDesc': 'Medicine, Pharmacy, Nursing and Dentistry',
    'adminServices':      'Admin Services',
    'adminServicesDesc':  'Administrative services for students',
    'research':           'Research & Journals',
    'researchDesc':       'Scientific journals and research centers',

    // Settings Modal
    'profile': 'Profile',
    'appearance': 'Appearance',
    'language': 'Language',
    'accessibility': 'Accessibility',
    'supportHelp': 'Support & Help',
    'data': 'Chat History',
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
    'system': 'System',
    'fontSize': 'Font Size',
    'small': 'Small',
    'default': 'Default',
    'large': 'Large',
    'technicalSupport': 'Technical Support',
    'faq': 'FAQ',
    'clearHistory': 'Clear History',
    'clearHistoryConfirm': 'Are you sure you want to delete all chats?',
    'confirm': 'Confirm',
    'cancel': 'Cancel',
    'english': 'English',
    'arabic': 'العربية',
    'computerScience': 'Computer Science',
    
    // Chat
    'typeMessage': 'Type your message...',
    'send': 'Send',
    'online': 'Online',
    
    //campusServicesDesc
    'healthServices':         'Health Services',
    'healthServicesDesc':     'Medical City and health colleges',
    'admissionReg':           'Admission & Registration',
    'admissionRegDesc':       'Bachelor, Graduate, and Diploma programs',
    'collegesPrograms':       'Colleges & Programs',
    'collegesProgramsDesc':   '17 colleges with academic programs',
    'researchInnovation':     'Research & Innovation',
    'researchInnovationDesc': 'Centers, chairs, and scientific journals',
    'supportServices':        'Support Services',
    'supportServicesDesc':    'Driving school and consulting institute',
    'universityAdmin':        'University Administration',
    'universityAdminDesc':    'Agencies, deanships, and departments',

    // Chat Management
    'rename': 'Rename',
    'delete': 'Delete',
    'deleteChat': 'Delete chat?',
    'deleteChatDesc': 'This action cannot be undone.',
  },
  ar: {
    // Sidebar
    'newChat': 'محادثة جديدة',
    'chatHistory': 'سجل المحادثات',
    'settings': 'الإعدادات',
    'today': 'اليوم',
    'yesterday': 'أمس',
    'previous7Days': 'آخر 7 أيام',
    'about': 'حول',
    
    // Welcome
    'welcomeTitle': 'مرحباً بك في مساعد جامعة القصيم الذكي',
    'welcomeSubtitle': 'بوابتك الذكية لكافة خدمات جامعة القصيم',
    'askAnything': 'اسألني أي شيء عن جامعة القصيم...',
    
    // Quick Actions
    'academicCalendar': 'التقويم الأكاديمي',
    'academicCalendarDesc': 'عرض التواريخ والمواعيد المهمة',
    'courseRegistration': 'تسجيل المقررات',
    'courseRegistrationDesc': 'احصل على مساعدة في التسجيل',
    'libraryServices': 'خدمات المكتبة',
    'libraryServicesDesc': 'الوصول للموارد الرقمية والكتب',
    'campusServices': 'خدمات الحرم الجامعي',
    'campusServicesDesc': 'ابحث عن المرافق والدعم',
    // New Quick Actions
    'medicalCity':        'المدينة الطبية',
    'medicalCityDesc':    'خدمات المستشفى الجامعي والعيادات',
    'admission':          'القبول والتسجيل',
    'admissionDesc':      'شروط وإجراءات الالتحاق بجامعة القصيم',
    'drivingSchool':      'مدرسة القيادة',
    'drivingSchoolDesc':  'التسجيل وحجز دروس القيادة',
    'healthColleges':     'الكليات الصحية',
    'healthCollegesDesc': 'الطب والصيدلة والتمريض وطب الأسنان',
    'adminServices':      'الخدمات الإدارية',
    'adminServicesDesc':  'الخدمات الإدارية المتاحة للطلاب',
    'research':           'البحث والمجلات',
    'researchDesc':       'المجلات العلمية ومراكز الأبحاث',
  
    // Settings Modal
    'profile': 'الملف الشخصي',
    'appearance': 'المظهر',
    'language': 'اللغة',
    'accessibility': 'إمكانية الوصول',
    'supportHelp': 'الدعم والمساعدة',
    'data': 'سجل الدردشة',
    'theme': 'السمة',
    'light': 'فاتح',
    'dark': 'داكن',
    'system': 'النظام',
    'fontSize': 'حجم الخط',
    'small': 'صغير',
    'default': 'افتراضي',
    'large': 'كبير',
    'technicalSupport': 'الدعم الفني',
    'faq': 'الأسئلة الشائعة',
    'clearHistory': 'مسح السجل',
    'clearHistoryConfirm': 'هل أنت متأكد من حذف جميع المحادثات؟',
    'confirm': 'تأكيد',
    'cancel': 'إلغاء',
    'english': 'English',
    'arabic': 'العربية',
    'computerScience': 'علوم الحاسب',
    
    // Chat
    'typeMessage': 'اكتب رسالتك...',
    'send': 'إرسال',
    'online': 'متصل',
    
    //campusServicesDesc 
    'healthServices':         'الخدمات الصحية',
    'healthServicesDesc':     'المدينة الطبية والكليات الصحية',
    'admissionReg':           'القبول والتسجيل',
    'admissionRegDesc':       'البكالوريوس والدراسات العليا والدبلوم',
    'collegesPrograms':       'الكليات والبرامج',
    'collegesProgramsDesc':   '17 كلية بكل التخصصات',
    'researchInnovation':     'البحث والابتكار',
    'researchInnovationDesc': 'المراكز والكراسي والمجلات العلمية',
    'supportServices':        'الخدمات المساندة',
    'supportServicesDesc':    'مدرسة القيادة ومعهد الاستشارات',
    'universityAdmin':        'الإدارة الجامعية',
    'universityAdminDesc':    'الوكالات والعمادات والإدارات',

    // Chat Management
    'rename': 'إعادة التسمية',
    'delete': 'حذف',
    'deleteChat': 'حذف المحادثة؟',
    'deleteChatDesc': 'لا يمكن التراجع عن هذا الإجراء.',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [resolvedLanguage, setResolvedLanguage] = useState<ResolvedLanguage>('en')

  // Resolve language (handle 'system' option)
  const resolveLanguage = (lang: Language): ResolvedLanguage => {
    if (lang === 'system') {
      return detectSystemLanguage()
    }
    return lang
  }

  useEffect(() => {
    const saved = localStorage.getItem('qu-language') as Language | null
    if (saved) {
      setLanguageState(saved)
      setResolvedLanguage(resolveLanguage(saved))
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('qu-language', lang)
    const resolved = resolveLanguage(lang)
    setResolvedLanguage(resolved)
    document.documentElement.dir = resolved === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = resolved
  }

  useEffect(() => {
    document.documentElement.dir = resolvedLanguage === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = resolvedLanguage
  }, [resolvedLanguage])

  const t = (key: string): string => {
    return translations[resolvedLanguage][key as keyof typeof translations['en']] || key
  }

  const dir = resolvedLanguage === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language, resolvedLanguage, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
