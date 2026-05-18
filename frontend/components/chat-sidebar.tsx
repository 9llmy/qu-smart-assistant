'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, MessageSquare, Settings, ChevronLeft, Menu, MoreVertical, Pencil, Trash2, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { QULogo } from '@/components/qu-logo'
import { useLanguage } from '@/components/language-provider'
import { Chat, getChatsByDate } from '@/lib/chat-store'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  chats: Chat[]
  currentChatId: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onOpenSettings: () => void
  onOpenAbout: () => void
  onRenameChat: (chatId: string, newTitle: string) => void
  onDeleteChat: (chatId: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onOpenSettings,
  onOpenAbout,
  onRenameChat,
  onDeleteChat,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const { t, dir } = useLanguage()
  const groupedChats = getChatsByDate(chats)
  
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingChatId])

  const handleStartRename = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
  }

  const handleConfirmRename = () => {
    if (editingChatId && editTitle.trim()) {
      onRenameChat(editingChatId, editTitle.trim())
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleCancelRename = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmRename()
    } else if (e.key === 'Escape') {
      handleCancelRename()
    }
  }

  const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirmId(chatId)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteChat(deleteConfirmId)
    }
    setDeleteConfirmId(null)
  }

  const renderChatItem = (chat: Chat) => {
    const isActive = currentChatId === chat.id
    const isEditing = editingChatId === chat.id
    const isHovered = hoveredChatId === chat.id
    const showMenu = isActive || isHovered

    return (
      <motion.div
        key={chat.id}
        initial={{ opacity: 0, x: dir === 'rtl' ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ 
          opacity: 0, 
          x: dir === 'rtl' ? 50 : -50,
          height: 0,
          marginBottom: 0,
          transition: { duration: 0.2 }
        }}
        layout
        className="relative"
        onMouseEnter={() => setHoveredChatId(chat.id)}
        onMouseLeave={() => setHoveredChatId(null)}
      >
        {isEditing ? (
          <div className="px-3 py-2">
            <Input
              ref={editInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleConfirmRename}
              className="h-8 text-sm"
            />
          </div>
        ) : (
          <button
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
              'hover:bg-accent hover:text-accent-foreground',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            <MessageSquare className="w-[1.2em] h-[1.2em] shrink-0" />
            <span className="truncate flex-1 text-start">{chat.title}</span>
            
            {/* Three-dot menu - visible on hover/active on desktop, always visible on mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'p-1 rounded-md transition-all duration-200 shrink-0',
                    'hover:bg-sidebar-accent',
                    // Desktop: show on hover or when active
                    'md:opacity-0 md:group-hover:opacity-100',
                    showMenu && 'md:opacity-100',
                    // Mobile: always visible
                    'opacity-100 md:opacity-0'
                  )}
                >
                  <MoreVertical className="w-[1.2em] h-[1.2em]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={dir === 'rtl' ? 'start' : 'end'} 
                className="w-40"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem 
                  onClick={(e) => handleStartRename(chat, e)}
                  className="gap-2 cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
                >
                  <Pencil className="w-[1.2em] h-[1.2em]" />
                  {t('rename')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleDeleteClick(chat.id, e)}
                  className="gap-2 cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="w-[1.2em] h-[1.2em]" />
                  {t('delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </button>
        )}
      </motion.div>
    )
  }

  const renderChatGroup = (title: string, chatList: Chat[]) => {
    if (chatList.length === 0) return null
    
    return (
      <div className="mb-4">
        <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {chatList.map((chat) => renderChatItem(chat))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="fixed top-2 start-2 z-50 md:hidden bg-background/80 backdrop-blur-sm border border-border shadow-sm h-8 w-8"
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: dir === 'rtl' ? '17.5rem' : '-17.5rem', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir === 'rtl' ? '17.5rem' : '-17.5rem', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed md:relative inset-y-0 start-0 z-50 md:z-0',
              'w-[18rem] max-w-full bg-sidebar border-e border-sidebar-border',
              'flex flex-col h-screen md:h-full overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-sidebar-border">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2.5">
                  <QULogo size="sm" />
                  <span className="font-semibold text-sidebar-foreground text-sm">Qassim AI</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <ChevronLeft className={cn('w-5 h-5', dir === 'rtl' && 'rotate-180')} />
                </Button>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={onNewChat}
                  className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <Plus className="w-[1.2em] h-[1.2em]" />
                  {t('newChat')}
                </Button>
              </motion.div>
            </div>

            {/* Chat History */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
              {chats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-[2.5em] h-[2.5em] mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {t('chatHistory')}
                  </p>
                </div>
              ) : (
                <>
                  {renderChatGroup(t('today'), groupedChats.today)}
                  {renderChatGroup(t('yesterday'), groupedChats.yesterday)}
                  {renderChatGroup(t('previous7Days'), groupedChats.previous7Days)}
                </>
              )}
            </div>

            {/* Footer Buttons */}
<div className="p-3 border-t border-sidebar-border space-y-1">
  <Button
    variant="ghost"
    onClick={onOpenSettings}
    className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  >
    <Settings className="w-5 h-5" />
    {t('settings')}
  </Button>

  <Button
    variant="ghost"
    onClick={onOpenAbout}
    className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  >
    <Info className="w-5 h-5" />
    {t('about')}
  </Button>
</div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteChat')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteChatDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
