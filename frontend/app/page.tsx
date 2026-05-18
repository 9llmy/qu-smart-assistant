'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChatSidebar } from '@/components/chat-sidebar'
import { sendToN8N } from '@/lib/n8n-service'
import { ChatHeader } from '@/components/chat-header'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { WelcomeScreen } from '@/components/welcome-screen'
import { SettingsModal } from '@/components/settings-modal'
import { AboutModal } from '@/components/about-modal'
import { useLanguage } from '@/components/language-provider'
import { QuickLinks } from '@/components/quick-links'
import {
  Chat,
  Message,
  generateId,
  saveChatToStorage,
  loadChatsFromStorage,
  clearChatsFromStorage,
  detectMessageLanguage,
} from '@/lib/chat-store'
import {
  FontSize,
  loadSettings,
  saveSettings,
  applyGlobalFontSize,
} from '@/lib/settings-store'

// Simulated AI responses for demo purposes - English
const simulatedResponsesEN: Record<string, string> = {
  default: `I'm Qassim AI, your intelligent assistant for Qassim University. I can help you with:

• Academic calendar and important dates
• Course registration and enrollment
• Library services and digital resources
• Campus facilities and student support
• University policies and procedures

How can I assist you today?`,
  calendar: `The academic calendar for the current semester includes these key dates:

**Registration Period:** March 15-25, 2026
**Classes Begin:** March 30, 2026
**Midterm Exams:** May 10-17, 2026
**Final Exams:** July 5-15, 2026
**Summer Break:** July 20, 2026

For the complete academic calendar, please visit the official QU website or contact the Registrar's Office.`,
  registration: `Here's a step-by-step guide for course registration:

1. **Login** to your student portal at portal.qu.edu.sa
2. **Review** available courses for your program
3. **Select** courses matching your study plan
4. **Check** for prerequisites and time conflicts
5. **Confirm** your registration and review fees

**Tips:**
- Register early for better course selection
- Contact your academic advisor for guidance
- Keep your study plan updated`,
  library: `Qassim University Library offers extensive resources:

**Digital Resources:**
- Over 50,000 e-books and journals
- Access to IEEE, Springer, and JSTOR
- Research databases and thesis archives

**Physical Services:**
- Group study rooms (booking available online)
- Computer labs with specialized software
- Printing and scanning facilities

**Operating Hours:**
Sunday-Thursday: 8:00 AM - 10:00 PM
Friday: Closed
Saturday: 10:00 AM - 6:00 PM`,
  campus: `Campus services available for students:

**Health Services:** University clinic with free consultations
**Transportation:** Free shuttle buses between campuses
**Dining:** Multiple cafeterias and food courts
**Sports:** Gymnasium, swimming pool, and sports fields
**IT Support:** Tech help desk in the main library

For emergencies, call: 920-XXX-XXXX

Is there a specific service you'd like more information about?`,
}

// Simulated AI responses - Arabic
const simulatedResponsesAR: Record<string, string> = {
  default: `أنا مساعد القصيم الذكي، مساعدك الشخصي لجامعة القصيم. يمكنني مساعدتك في:

• التقويم الأكاديمي والمواعيد المهمة
• التسجيل في المقررات والقبول
• خدمات المكتبة والمصادر الرقمية
• المرافق الجامعية ودعم الطلاب
• سياسات وإجراءات الجامعة

كيف يمكنني مساعدتك اليوم؟`,
  calendar: `يتضمن التقويم الأكاديمي للفصل الدراسي الحالي المواعيد التالية:

**فترة التسجيل:** 15-25 مارس 2026
**بداية الدراسة:** 30 مارس 2026
**الاختبارات النصفية:** 10-17 مايو 2026
**الاختبارات النهائية:** 5-15 يوليو 2026
**الإجازة الصيفية:** 20 يوليو 2026

للاطلاع على التقويم الأكاديمي الكامل، يرجى زيارة موقع جامعة القصيم الرسمي أو التواصل مع مكتب القبول والتسجيل.`,
  registration: `إليك دليل خطوة بخطوة للتسجيل في المقررات:

1. **تسجيل الدخول** إلى بوابة الطالب portal.qu.edu.sa
2. **مراجعة** المقررات المتاحة لبرنامجك
3. **اختيار** المقررات المناسبة لخطتك الدراسية
4. **التحقق** من المتطلبات السابقة وتعارض الأوقات
5. **تأكيد** التسجيل ومراجعة الرسوم

**نصائح:**
- سجّل مبكراً للحصول على خيارات أفضل
- تواصل مع مرشدك الأكاديمي للحصول على التوجيه
- حافظ على تحديث خطتك الدراسية`,
  library: `تقدم مكتبة جامعة القصيم موارد متنوعة:

**الموارد الرقمية:**
- أكثر من 50,000 كتاب ومجلة إلكترونية
- الوصول إلى IEEE و Springer و JSTOR
- قواعد بيانات البحث وأرشيف الرسائل العلمية

**الخدمات المادية:**
- غرف دراسة جماعية (الحجز متاح عبر الإنترنت)
- معامل حاسوب مع برامج متخصصة
- خدمات الطباعة والمسح الضوئي

**ساعات العمل:**
الأحد-الخميس: 8:00 صباحاً - 10:00 مساءً
الجمعة: مغلق
السبت: 10:00 صباحاً - 6:00 مساءً`,
  campus: `الخدمات المتاحة للطلاب في الحرم الجامعي:

**الخدمات الصحية:** عيادة الجامعة مع استشارات مجانية
**المواصلات:** حافلات نقل مجانية بين الحرم الجامعية
**المطاعم:** مطاعم وصالات طعام متعددة
**الرياضة:** صالة رياضية ومسبح وملاعب رياضية
**الدعم التقني:** مكتب المساعدة التقنية في المكتبة الرئيسية

للطوارئ، اتصل على: 920-XXX-XXXX

هل هناك خدمة معينة تريد معرفة المزيد عنها؟`,
}

// Arabic keywords for topic detection - expanded for better matching
const arabicKeywords = {
  calendar: ['تقويم', 'موعد', 'تاريخ', 'مواعيد', 'الدراسة', 'الفصل', 'الأكاديمية', 'المهمة', 'أكاديمي'],
  registration: ['تسجيل', 'مقرر', 'مقررات', 'قبول', 'التحاق', 'المقررات', 'عملية'],
  library: ['مكتبة', 'كتاب', 'كتب', 'مصادر', 'بحث', 'المكتبة', 'الرقمية', 'الموارد'],
  campus: ['حرم', 'خدمات', 'مرافق', 'جامعة', 'الجامعي', 'الخدمات', 'المتاحة'],
}

/**
 * SYSTEM PROMPT: "You are Qassim AI. You must detect the language of the user's 
 * message and respond in the EXACT same language. If the user asks in Arabic, 
 * you must respond in Arabic. Never switch to English unless the user asks in English."
 * 
 * This function enforces language matching between user input and AI response.
 * Priority:
 * 1. The detected language of the user's message (PRIMARY - always respected)
 * 2. The app's current language setting (used as context/fallback)
 */
function determineResponseLanguage(
  messageLanguage: 'ar' | 'en',
  appLanguage: 'ar' | 'en'
): 'ar' | 'en' {
  // CRITICAL: Always respond in the same language as the user's message
  // This is the core rule - if user writes in Arabic, AI MUST respond in Arabic
  // The detectMessageLanguage function analyzes the actual text content
  return messageLanguage
}

function getAIResponse(
  message: string, 
  messageLanguage: 'ar' | 'en',
  appLanguage: 'ar' | 'en'
): string {
  // Determine the response language - prioritize the message language
  // This ensures when service cards send Arabic prompts, we respond in Arabic
  const responseLanguage = determineResponseLanguage(messageLanguage, appLanguage)
  
  const responses = responseLanguage === 'ar' ? simulatedResponsesAR : simulatedResponsesEN
  const lowerMessage = message.toLowerCase()
  
  // Check both Arabic and English keywords regardless of response language
  // to properly detect the topic
  
  // Check Arabic keywords
  for (const keyword of arabicKeywords.calendar) {
    if (message.includes(keyword)) return responses.calendar
  }
  for (const keyword of arabicKeywords.registration) {
    if (message.includes(keyword)) return responses.registration
  }
  for (const keyword of arabicKeywords.library) {
    if (message.includes(keyword)) return responses.library
  }
  for (const keyword of arabicKeywords.campus) {
    if (message.includes(keyword)) return responses.campus
  }
  
  // Check English keywords
  if (lowerMessage.includes('calendar') || lowerMessage.includes('date') || lowerMessage.includes('deadline')) {
    return responses.calendar
  }
  if (lowerMessage.includes('registration') || lowerMessage.includes('register') || lowerMessage.includes('course')) {
    return responses.registration
  }
  if (lowerMessage.includes('library') || lowerMessage.includes('book') || lowerMessage.includes('resource')) {
    return responses.library
  }
  if (lowerMessage.includes('campus') || lowerMessage.includes('service') || lowerMessage.includes('facilit')) {
    return responses.campus
  }
  
  return responses.default
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [showAbout, setShowAbout] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [fontSize, setFontSize] = useState<FontSize>('default')
  const [pendingMessage, setPendingMessage] = useState<string>('')
  const { dir, resolvedLanguage } = useLanguage()

  // Load chats and settings from localStorage on mount
  useEffect(() => {
    const savedChats = loadChatsFromStorage()
    setChats(savedChats)
    
    const savedSettings = loadSettings()
    setFontSize(savedSettings.fontSize)
    applyGlobalFontSize(savedSettings.fontSize)

    // Check screen size for sidebar default state
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get current chat
  const currentChat = chats.find((chat) => chat.id === currentChatId)

  // Create new chat - resets to welcome screen
  const handleNewChat = useCallback(() => {
    // Reset to null/empty state for fresh conversation
    setCurrentChatId(null)
    setPendingMessage('')
    
    // Close sidebar on mobile for better UX
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [])

  // Select existing chat
  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId)
    setPendingMessage('')
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [])

  // Send message
  const handleSendMessage = useCallback(async (content: string) => {
    setPendingMessage('')
    
    // Detect the language of the user's message (isolated from global UI language)
    // This is CRITICAL for ensuring Arabic messages get Arabic responses
    const messageLanguage = detectMessageLanguage(content)
    
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      detectedLanguage: messageLanguage,
    }

    let chatId = currentChatId
    let updatedChats = [...chats]

    if (!chatId) {
      // Create new chat
      const newChat: Chat = {
        id: generateId(),
        title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      chatId = newChat.id
      updatedChats = [newChat, ...chats]
      setCurrentChatId(chatId)
    } else {
      // Add to existing chat
      updatedChats = chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              updatedAt: new Date(),
            }
          : chat
      )
    }

    setChats(updatedChats)
    saveChatToStorage(updatedChats)
    setIsLoading(true)

    // ── اتصال حقيقي بـ n8n ──────────────────────────────
    let responseContent: string
    try {
      responseContent = await sendToN8N(
        content,
        chatId,
        messageLanguage
      )
    } catch {
      responseContent = messageLanguage === 'ar'
        ? 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.'
        : 'Sorry, a connection error occurred. Please try again.'
    }
    const responseLanguage = detectMessageLanguage(responseContent)
    
    const aiResponse: Message = {
      id: generateId(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      detectedLanguage: responseLanguage,
    }

    const finalChats = updatedChats.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            messages: [...chat.messages, aiResponse],
            updatedAt: new Date(),
          }
        : chat
    )

    setChats(finalChats)
    saveChatToStorage(finalChats)
    setIsLoading(false)
  }, [chats, currentChatId, resolvedLanguage])

  // Handle quick action from welcome screen
  const handleQuickAction = useCallback((message: string) => {
    setPendingMessage(message)
  }, [])

  // Handle font size change
  const handleFontSizeChange = useCallback((newSize: FontSize) => {
    setFontSize(newSize)
    saveSettings({ fontSize: newSize })
    applyGlobalFontSize(newSize)
  }, [])

  // Handle clear history
  const handleClearHistory = useCallback(() => {
    setChats([])
    setCurrentChatId(null)
    clearChatsFromStorage()
    setSettingsOpen(false)
  }, [])

  // Rename a chat
  const handleRenameChat = useCallback((chatId: string, newTitle: string) => {
    const updatedChats = chats.map((chat) =>
      chat.id === chatId
        ? { ...chat, title: newTitle, updatedAt: new Date() }
        : chat
    )
    setChats(updatedChats)
    saveChatToStorage(updatedChats)
  }, [chats])

  // Delete a chat
  const handleDeleteChat = useCallback((chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId)
    setChats(updatedChats)
    saveChatToStorage(updatedChats)
    
    // If the deleted chat was the current one, reset to welcome screen
    if (currentChatId === chatId) {
      setCurrentChatId(null)
    }
  }, [chats, currentChatId])

  return (
    <div
      className="flex h-screen w-full max-w-full bg-background overflow-hidden"
      dir={dir}
    >
      {/* Sidebar */}
    <ChatSidebar
  chats={chats}
  currentChatId={currentChatId}
  onNewChat={handleNewChat}
  onSelectChat={handleSelectChat}
onOpenSettings={() => setSettingsOpen(true)}
  onOpenAbout={() => setShowAbout(true)}
  onRenameChat={handleRenameChat}
  onDeleteChat={handleDeleteChat}
  isOpen={sidebarOpen}
  onToggle={() => setSidebarOpen(!sidebarOpen)}
/>
<QuickLinks />

      {/* Main Chat Area */}
      <motion.main
        layout
        className="flex-1 flex flex-col h-full overflow-hidden"
      >
        <ChatHeader />

        {currentChat ? (
          <>
            <ChatMessages messages={currentChat.messages} isLoading={isLoading} />
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </>
        ) : (
          <>
            <div 
              className="flex-1 overflow-y-auto"
              style={{ scrollbarGutter: 'stable' }}
            >
              <WelcomeScreen onQuickAction={handleQuickAction} />
            </div>
            <ChatInput 
              onSend={handleSendMessage} 
              disabled={isLoading} 
              initialValue={pendingMessage}
            />
          </>
        )}
      </motion.main>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        onClearHistory={handleClearHistory}
      />

      {/* About Modal */}
<AboutModal
  open={showAbout}
  onClose={() => setShowAbout(false)}
/>
    </div>
  )
}
