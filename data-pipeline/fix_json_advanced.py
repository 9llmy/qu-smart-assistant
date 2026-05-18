"""
═══════════════════════════════════════════════════════════════
  إصلاح ذكي للملفات التالفة — يحاول كل الطرق
═══════════════════════════════════════════════════════════════
"""
import json
import re
from pathlib import Path

FOLDER = r"C:\Users\saloo\Desktop\Projects\Graduation Project\QU-Data"

fixed_count = 0
failed_count = 0
empty_count = 0

ENCODINGS = ['utf-8-sig', 'utf-8', 'cp1256', 'windows-1256', 'iso-8859-6', 'latin-1']


def read_file(fp):
    """قراءة الملف بأي ترميز ممكن"""
    for enc in ENCODINGS:
        try:
            with open(fp, 'r', encoding=enc) as f:
                content = f.read()
            return content, enc
        except UnicodeDecodeError:
            continue
    # آخر محاولة — قراءة كـ bytes ثم تجاهل الأخطاء
    try:
        with open(fp, 'rb') as f:
            raw = f.read()
        return raw.decode('utf-8', errors='ignore'), 'utf-8-ignore'
    except:
        return None, None


def deep_clean(content):
    """تنظيف عميق للمحتوى"""
    # 1. احذف BOM
    content = content.replace('\ufeff', '').replace('\ufffe', '')

    # 2. أصلح علامات الاقتباس الذكية
    content = (content
        .replace('\u201c', '"').replace('\u201d', '"')
        .replace('\u2018', "'").replace('\u2019', "'")
    )

    # 3. وحّد فواصل الأسطر
    content = content.replace('\r\n', '\n').replace('\r', '\n')

    # 4. احذف الـ control characters
    content = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', content)

    # 5. احذف الفواصل الزائدة قبل ] أو }
    content = re.sub(r',(\s*[\]}])', r'\1', content)

    # 6. أصلح property names بدون quotes
    content = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)', r'\1"\2"\3', content)

    return content.strip()


def try_extract_multiple_jsons(content):
    """يحاول استخراج JSONs متعددة من ملف واحد"""
    results = []
    depth = 0
    start = -1
    in_string = False
    escape = False

    for i, c in enumerate(content):
        if escape:
            escape = False
            continue
        if c == '\\':
            escape = True
            continue
        if c == '"':
            in_string = not in_string
        if in_string:
            continue
        if c in '[{':
            if depth == 0:
                start = i
            depth += 1
        elif c in ']}':
            depth -= 1
            if depth == 0 and start != -1:
                segment = content[start:i+1]
                try:
                    parsed = json.loads(segment)
                    results.append(parsed)
                except:
                    pass
                start = -1
    return results


def fix_file(fp):
    """يحاول إصلاح الملف بكل الطرق"""
    global fixed_count, failed_count, empty_count

    content, encoding = read_file(fp)
    if content is None:
        print(f"❌ {fp.name} — ما قدرت أقرأ الملف")
        failed_count += 1
        return

    if not content.strip():
        print(f"📭 {fp.name} — ملف فاضي")
        empty_count += 1
        return

    # المحاولة 1: قراءة JSON مباشرة
    try:
        json.loads(content)
        return  # سليم
    except:
        pass

    # المحاولة 2: تنظيف عميق
    cleaned = deep_clean(content)
    try:
        data = json.loads(cleaned)
        with open(fp, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ {fp.name} — تنظيف عميق")
        fixed_count += 1
        return
    except:
        pass

    # المحاولة 3: استخراج JSONs متعددة ودمجها
    jsons = try_extract_multiple_jsons(cleaned)
    if jsons:
        # ادمج كل القوائم في قائمة واحدة
        merged = []
        for j in jsons:
            if isinstance(j, list):
                merged.extend(j)
            elif isinstance(j, dict):
                merged.append(j)

        if merged:
            try:
                with open(fp, 'w', encoding='utf-8') as f:
                    json.dump(merged, f, ensure_ascii=False, indent=2)
                print(f"✅ {fp.name} — دمج {len(jsons)} JSONs")
                fixed_count += 1
                return
            except:
                pass

    # المحاولة 4: استخراج النصوص فقط كـ chunks
    arabic_text = re.findall(r'[\u0600-\u06FF\s\d.,،؛؟!()0-9\-/]{50,}', content)
    english_text = re.findall(r'[a-zA-Z\s\d.,;!?()0-9\-/]{100,}', content)

    if arabic_text or english_text:
        chunks = []
        base_id = fp.stem.replace(' ', '_')[:50]

        for i, text in enumerate(arabic_text[:20]):
            chunks.append({
                "id": f"chunk_{base_id}_ar_{i}",
                "metadata": {"language": "ar", "page_title": fp.stem},
                "text": text.strip()
            })

        for i, text in enumerate(english_text[:20]):
            chunks.append({
                "id": f"chunk_{base_id}_en_{i}",
                "metadata": {"language": "en", "page_title": fp.stem},
                "text": text.strip()
            })

        if chunks:
            with open(fp, 'w', encoding='utf-8') as f:
                json.dump(chunks, f, ensure_ascii=False, indent=2)
            print(f"🔄 {fp.name} — استخراج نص ({len(chunks)} chunks)")
            fixed_count += 1
            return

    print(f"❌ {fp.name} — ما قدرت أصلح")
    failed_count += 1


# ── شغّل ─────────────────────────────────────────────
print("🔧 بدء إصلاح الملفات التالفة...\n")

for fp in Path(FOLDER).glob("*.json"):
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            json.load(f)
    except:
        try:
            fix_file(fp)
        except Exception as e:
            print(f"⚠️  {fp.name} — خطأ: {str(e)[:60]}")
            failed_count += 1

# أيضاً .JSON كبيرة
for fp in Path(FOLDER).glob("*.JSON"):
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            json.load(f)
    except:
        try:
            fix_file(fp)
        except Exception as e:
            print(f"⚠️  {fp.name} — خطأ: {str(e)[:60]}")
            failed_count += 1

print(f"\n{'═' * 50}")
print(f"📊 النتيجة:")
print(f"   ✅ تم إصلاحها:    {fixed_count}")
print(f"   📭 ملفات فاضية:   {empty_count}")
print(f"   ❌ تالفة جداً:    {failed_count}")
print(f"{'═' * 50}")