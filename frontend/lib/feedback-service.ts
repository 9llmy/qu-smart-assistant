const FEEDBACK_WEBHOOK_URL = 'https://qubot.app.n8n.cloud/webhook/qu-feedback'

export async function sendFeedback(data: {
  question: string
  answer: string
  rating: 'up' | 'down'
  language: string
}): Promise<void> {
  try {
    await fetch(FEEDBACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: data.question,
        answer: data.answer,
        rating: data.rating === 'up' ? '👍 Good' : '👎 Bad',
        language: data.language === 'ar' ? 'Arabic' : 'English',
      }),
    })
  } catch (error) {
    console.error('Feedback error:', error)
  }
}