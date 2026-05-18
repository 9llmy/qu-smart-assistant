'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bot, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Message, getMessageDirection, detectMessageLanguage } from '@/lib/chat-store'
import { cn } from '@/lib/utils'

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

function MessageActions({ messageId, content, isRtl }: { messageId: string; content: string; isRtl: boolean }) {
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(`qu-rating-${messageId}`)
    if (saved === 'up' || saved === 'down') setRating(saved)
  }, [messageId])

  const handleRate = (type: 'up' | 'down') => {
    const newRating = rating === type ? null : type
    setRating(newRating)
    if (newRating) {
      localStorage.setItem(`qu-rating-${messageId}`, newRating)
    } else {
      localStorage.removeItem(`qu-rating-${messageId}`)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      'flex items-center gap-1 mt-2 pt-2 border-t border-foreground/10',
      isRtl ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
    )}>
      <button
        onClick={handleCopy}
        className="p-1 rounded-md hover:bg-foreground/10 transition-colors group"
        title={copied ? 'Copied!' : 'Copy'}
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-green-500" />
          : <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />}
      </button>

      <div className="w-px h-3.5 bg-foreground/10 mx-0.5" />

      <button
        onClick={() => handleRate('up')}
        className={cn(
          'p-1 rounded-md transition-colors group',
          rating === 'up' ? 'bg-green-500/15 text-green-500' : 'hover:bg-foreground/10'
        )}
        title="Helpful"
      >
        <ThumbsUp className={cn('w-3.5 h-3.5', rating !== 'up' && 'opacity-60 group-hover:opacity-100')} />
      </button>

      <button
        onClick={() => handleRate('down')}
        className={cn(
          'p-1 rounded-md transition-colors group',
          rating === 'down' ? 'bg-red-500/15 text-red-500' : 'hover:bg-foreground/10'
        )}
        title="Not helpful"
      >
        <ThumbsDown className={cn('w-3.5 h-3.5', rating !== 'down' && 'opacity-60 group-hover:opacity-100')} />
      </button>

      {rating && (
        <span className={cn('text-[0.65rem] opacity-60 mx-1', isRtl ? 'mr-auto' : 'ml-auto')}>
          {rating === 'up' ? '👍 Thanks!' : '👎 Noted'}
        </span>
      )}
    </div>
  )
}

function MessageContent({ content, isRtl }: { content: string; isRtl: boolean }) {
  const lines = content.split('\n')

  return (
    <div
      className="space-y-1.5 leading-relaxed"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        textAlign: isRtl ? 'right' : 'left',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word'
      }}
    >
      {lines.map((line, idx) => {
        const listMatch = line.match(/^([\u2022•\-\*]|\d+[\.\)])\s+(.*)$/)

        if (listMatch) {
          const [, bullet, text] = listMatch
          return (
            <div
              key={idx}
              className={cn('flex gap-2 items-start', isRtl ? 'flex-row-reverse' : 'flex-row')}
            >
              <span className="shrink-0 opacity-80 select-none">{bullet}</span>
              <span className="flex-1">{text}</span>
            </div>
          )
        }

        if (!line.trim()) {
          return <div key={idx} className="h-1.5" aria-hidden="true" />
        }

        const formattedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')

        return <p key={idx} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      })}
    </div>
  )
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 md:px-6"
      style={{ scrollbarGutter: 'stable' }}
    >
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        {messages.map((message, index) => {
          const msgLang = message.detectedLanguage || detectMessageLanguage(message.content)
          const msgDir = getMessageDirection(msgLang)
          const isRtl = msgDir === 'rtl'

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={cn(
                'flex gap-4',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className={cn(
                'w-9 h-9 shrink-0',
                message.role === 'user' ? 'bg-primary' : 'bg-secondary'
              )}>
                <AvatarFallback className={cn(
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                dir={msgDir}
                className={cn(
                  'flex-1 max-w-[85%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-secondary text-secondary-foreground rounded-tl-sm',
                  isRtl && 'text-right',
                  isRtl && message.role === 'user' && 'rounded-tr-2xl rounded-tl-sm',
                  isRtl && message.role === 'assistant' && 'rounded-tl-2xl rounded-tr-sm'
                )}
              >
                <MessageContent content={message.content} isRtl={isRtl} />

                <p
                  className={cn('text-xs mt-2 opacity-70', isRtl ? 'text-left' : 'text-right')}
                  dir="auto"
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                {message.role === 'assistant' && (
                  <MessageActions
                    messageId={message.id}
                    content={message.content}
                    isRtl={isRtl}
                  />
                )}
              </div>
            </motion.div>
          )
        })}

      {isLoading && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-4"
  >
    <Avatar className="w-9 h-9 bg-secondary">
      <AvatarFallback className="bg-secondary text-secondary-foreground">
        <Bot className="w-4 h-4" />
      </AvatarFallback>
    </Avatar>

    <div className="flex-1 max-w-[85%] bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 space-y-2">
      {/* Status text */}
      <div className="flex items-center gap-2 text-xs text-secondary-foreground/70">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"
        />
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          البحث في 8,577 وثيقة...
        </motion.span>
      </div>

      {/* Skeleton lines */}
      <div className="space-y-2 pt-1">
        <motion.div
          className="h-3 bg-secondary-foreground/10 rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: '90%' }}
        />
        <motion.div
          className="h-3 bg-secondary-foreground/10 rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          style={{ width: '75%' }}
        />
        <motion.div
          className="h-3 bg-secondary-foreground/10 rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          style={{ width: '85%' }}
        />
        <motion.div
          className="h-3 bg-secondary-foreground/10 rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          style={{ width: '60%' }}
        />
      </div>
    </div>
  </motion.div>
)}
      </div>
    </div>
  )
}