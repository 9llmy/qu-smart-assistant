export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  detectedLanguage?: 'ar' | 'en'
}

// Arabic Unicode range detection (covers Arabic, Arabic Supplement, Arabic Extended)
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g

/**
 * Detects if text is primarily Arabic based on character analysis.
 * CRITICAL: This function must correctly identify Arabic text so the AI responds in Arabic.
 * 
 * Returns 'ar' if Arabic characters are found (even a small percentage), 'en' otherwise.
 * 
 * The threshold is set low (10%) to ensure Arabic service card prompts are always detected,
 * even if they contain some numbers or punctuation.
 */
export function detectMessageLanguage(text: string): 'ar' | 'en' {
  // Remove spaces, numbers, and punctuation for analysis
  const cleanedText = text.replace(/[\s\d\p{P}]/gu, '')
  if (!cleanedText) return 'en'
  
  // Count Arabic characters using the global regex
  const arabicMatches = cleanedText.match(ARABIC_REGEX) || []
  const arabicRatio = arabicMatches.length / cleanedText.length
  
  // If more than 10% of characters are Arabic, consider it Arabic
  // This lower threshold ensures Arabic prompts are always detected correctly
  return arabicRatio > 0.1 ? 'ar' : 'en'
}

/**
 * Returns text direction based on detected language
 */
export function getMessageDirection(language: 'ar' | 'en'): 'rtl' | 'ltr' {
  return language === 'ar' ? 'rtl' : 'ltr'
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function getChatsByDate(chats: Chat[]): {
  today: Chat[]
  yesterday: Chat[]
  previous7Days: Chat[]
  older: Chat[]
} {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  return {
    today: chats.filter((chat) => new Date(chat.updatedAt) >= today),
    yesterday: chats.filter(
      (chat) =>
        new Date(chat.updatedAt) >= yesterday && new Date(chat.updatedAt) < today
    ),
    previous7Days: chats.filter(
      (chat) =>
        new Date(chat.updatedAt) >= sevenDaysAgo &&
        new Date(chat.updatedAt) < yesterday
    ),
    older: chats.filter((chat) => new Date(chat.updatedAt) < sevenDaysAgo),
  }
}

export function saveChatToStorage(chats: Chat[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('qu-chats', JSON.stringify(chats))
  }
}

export function loadChatsFromStorage(): Chat[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('qu-chats')
    if (saved) {
      const chats = JSON.parse(saved)
      return chats.map((chat: Chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
    }
  }
  return []
}

export function clearChatsFromStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('qu-chats')
  }
}
