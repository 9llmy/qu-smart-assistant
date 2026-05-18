// ============================================================
//  n8n-service.ts — الاتصال بـ n8n Webhook
//  QU Smart Assistant
// ============================================================

// ══════════════════════════════════════════════════════════
//  🔗 إعدادات الاتصال — عدّل هنا فقط
// ══════════════════════════════════════════════════════════
const N8N_CONFIG = {
  // الـ Webhook URL من n8n
  WEBHOOK_URL: 'https://qubot.app.n8n.cloud/webhook/qu-chat',

  // مهلة الانتظار (30 ثانية)
  TIMEOUT_MS: 30000,

  // اسم الحقل اللي يرجعه n8n
  RESPONSE_FIELD: 'reply',

  // وضع التجربة — false = يتصل بـ n8n حقيقي
  DEMO_MODE: false,
}

// ══════════════════════════════════════════════════════════
//  الردود التجريبية (تُستخدم فقط عند DEMO_MODE: true)
// ══════════════════════════════════════════════════════════
const DEMO_RESPONSES_AR: Record<string, string> = {
  default: `أنا مساعد جامعة القصيم الذكي. يمكنني مساعدتك في:\n\n• معلومات القبول والتسجيل\n• الكليات والبرامج الأكاديمية\n• خدمات الطلاب\n• المرافق الجامعية\n\nكيف يمكنني مساعدتك؟`,
  كليات: `تضم جامعة القصيم 17 كلية تشمل:\n\n• كلية الهندسة\n• كلية الطب\n• كلية الحاسب وتقنية المعلومات\n• كلية الأعمال والاقتصاد\n• كلية الصيدلة\n• كلية العلوم\n• وغيرها`,
  قبول: `للتقديم في جامعة القصيم:\n\n1. التقديم عبر بوابة القبول الموحد\n2. الحصول على شهادة الثانوية بنسبة لا تقل عن 85%\n3. اجتياز اختبار القدرات والتحصيل\n\nللمزيد تواصل: 0163800050`,
}

const DEMO_RESPONSES_EN: Record<string, string> = {
  default: `I'm QU Smart Assistant. I can help you with:\n\n• Admission requirements\n• Colleges and programs\n• Student services\n• Campus facilities\n\nHow can I assist you?`,
}

function getDemoResponse(message: string, lang: string): string {
  const m = message.toLowerCase()
  if (lang === 'ar') {
    if (m.includes('كلية') || m.includes('تخصص')) return DEMO_RESPONSES_AR['كليات']
    if (m.includes('قبول') || m.includes('تسجيل')) return DEMO_RESPONSES_AR['قبول']
    return DEMO_RESPONSES_AR['default']
  }
  return DEMO_RESPONSES_EN['default']
}

// ══════════════════════════════════════════════════════════
//  الدالة الرئيسية — إرسال رسالة واستقبال الرد
// ══════════════════════════════════════════════════════════
export async function sendToN8N(
  message: string,
  sessionId: string,
  language: string = 'ar'
): Promise<string> {

  // وضع التجربة
  if (N8N_CONFIG.DEMO_MODE) {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
    return getDemoResponse(message, language)
  }

  // التحقق من الـ URL
  if (!N8N_CONFIG.WEBHOOK_URL || N8N_CONFIG.WEBHOOK_URL.includes('YOUR_N8N')) {
    return '⚠️ الـ Webhook غير مضبوط. افتح `lib/n8n-service.ts` وضع الـ URL الصح.'
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), N8N_CONFIG.TIMEOUT_MS)

  try {
    const res = await fetch(N8N_CONFIG.WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId,
        language,
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const data = await res.json()

    // استخراج الرد من الحقل المحدد
    const reply =
      data[N8N_CONFIG.RESPONSE_FIELD] ??
      data?.output ??
      data?.text ??
      data?.message ??
      data?.response ??
      (typeof data === 'string' ? data : null)

    if (!reply) {
      console.error('n8n response:', data)
      throw new Error('الحقل غير موجود في الرد')
    }

    return reply

  } catch (err: unknown) {
    clearTimeout(timeoutId)

    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        return language === 'ar'
          ? '⏱️ انتهت مهلة الانتظار. تأكد أن الـ Workflow شغّال في n8n.'
          : '⏱️ Request timed out. Please make sure the n8n workflow is active.'
      }
      if (err.message.includes('fetch') || err.message.includes('network')) {
        return language === 'ar'
          ? '🔴 تعذّر الاتصال بـ n8n. تأكد أن الـ Workflow مفعّل.'
          : '🔴 Could not connect to n8n. Please check the workflow is active.'
      }
      return `❌ ${err.message}`
    }

    return language === 'ar' ? '❌ خطأ غير متوقع' : '❌ Unexpected error'
  }
}
