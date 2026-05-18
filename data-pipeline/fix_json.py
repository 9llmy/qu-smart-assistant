"""
يصلح ملفات JSON المكسورة في مجلد QU-Data
"""
import json
import re
from pathlib import Path

FOLDER = r"C:\Users\saloo\Desktop\Projects\Graduation Project\QU-Data"

broken_files = []
fixed_files = []

for fp in Path(FOLDER).glob("*.json"):
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        # محاولة قراءة JSON كما هو
        try:
            json.loads(content)
            continue  # الملف سليم
        except:
            pass

        broken_files.append(fp.name)

        # ── محاولات الإصلاح ──────────────────────────
        original = content

        # 1. احذف BOM
        content = content.replace('\ufeff', '')

        # 2. احذف الفواصل الزائدة قبل ] أو }
        content = re.sub(r',(\s*[\]}])', r'\1', content)

        # 3. أصلح علامات الاقتباس الذكية
        content = content.replace('"', '"').replace('"', '"')
        content = content.replace(''', "'").replace(''', "'")

        # 4. احذف الأسطر الفارغة الزائدة
        content = re.sub(r'\n\s*\n', '\n', content)

        # 5. أصلح \r\n
        content = content.replace('\r\n', '\n').replace('\r', '\n')

        # حاول قراءة JSON بعد الإصلاح
        try:
            data = json.loads(content)
            # احفظ الملف المُصلح
            with open(fp, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            fixed_files.append(fp.name)
            print(f"✅ تم إصلاح: {fp.name}")
        except Exception as e:
            print(f"❌ ما قدرت أصلح: {fp.name} — {str(e)[:60]}")

    except Exception as e:
        print(f"⚠️  خطأ في قراءة {fp.name}: {e}")

print(f"\n📊 الإحصائيات:")
print(f"   🔍 ملفات مكسورة: {len(broken_files)}")
print(f"   ✅ تم إصلاحها: {len(fixed_files)}")
print(f"   ❌ ما زالت مكسورة: {len(broken_files) - len(fixed_files)}")