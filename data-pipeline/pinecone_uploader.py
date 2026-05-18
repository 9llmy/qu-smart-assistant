"""
═══════════════════════════════════════════════════════════════
  QU University - Pinecone Bulk Uploader v2.0
  محسّن للبيانات المقسّمة مسبقاً
═══════════════════════════════════════════════════════════════
"""

import os
import re
import json
import time
import hashlib
from pathlib import Path
from typing import List, Dict, Any
from openai import OpenAI
from pinecone import Pinecone
from tqdm import tqdm


# ══════════════════════════════════════════════════════════════
#  ⚙️ CONFIG
# ══════════════════════════════════════════════════════════════

CONFIG = {
    "OPENAI_API_KEY":   "YOUR_OPENAI_API_KEY_HERE",
    "PINECONE_API_KEY": "YOUR_PINECONE_API_KEY_HERE",

    "INDEX_NAME":       "qu-university",
    "NAMESPACE":        "website-content_",

    "DATA_FOLDER":      r"C:\Users\saloo\Desktop\Projects\Graduation Project\QU-Data",

    "BATCH_SIZE":       100,
    "EMBEDDING_MODEL":  "text-embedding-3-small",

    "CLEAR_NAMESPACE":  True,  # امسح القديم قبل الرفع
}


# ══════════════════════════════════════════════════════════════
#  🔧 الدوال المساعدة
# ══════════════════════════════════════════════════════════════

def sanitize_id(text: str) -> str:
    """تحويل أي نص لـ ID آمن (ASCII فقط)"""
    text = str(text).replace('.json', '').replace('.JSON', '')
    ascii_id = re.sub(r'[^a-zA-Z0-9_-]', '_', text)
    ascii_id = re.sub(r'_+', '_', ascii_id).strip('_')
    if not ascii_id or len(ascii_id) < 3:
        ascii_id = 'doc_' + hashlib.md5(text.encode('utf-8', 'ignore')).hexdigest()[:12]
    return ascii_id[:100]


def safe_load_json(file_path: Path) -> Any:
    """قراءة JSON مع معالجة الأخطاء"""
    encodings = ['utf-8', 'utf-8-sig', 'cp1256', 'latin-1']
    for enc in encodings:
        try:
            with open(file_path, 'r', encoding=enc) as f:
                content = f.read()
                # تنظيف الأحرف غير المرئية
                content = content.replace('\ufeff', '').strip()
                return json.loads(content)
        except (UnicodeDecodeError, json.JSONDecodeError):
            continue
    return None


def extract_chunks(data: Any, file_name: str) -> List[Dict]:
    """استخراج الـ chunks من ملف JSON"""
    chunks = []

    def get_text(value) -> str:
        """تحويل أي قيمة لنص آمن"""
        if isinstance(value, str):
            return value.strip()
        if isinstance(value, (dict, list)):
            return json.dumps(value, ensure_ascii=False)
        if value is None:
            return ''
        return str(value).strip()

    # ───── الحالة 1: Array من الـ chunks ─────
    if isinstance(data, list):
        for idx, item in enumerate(data):
            if not isinstance(item, dict):
                if isinstance(item, str) and len(item) > 20:
                    chunks.append({
                        "id": sanitize_id(f"{file_name}_{idx}"),
                        "text": item.strip(),
                        "metadata": {
                            "fileName": file_name,
                            "language": "ar",
                            "pageTitle": file_name[:200],
                            "text": item[:1000],
                        }
                    })
                continue

            text = get_text(item.get('text', ''))
            if not text or len(text) < 20:
                continue

            metadata = item.get('metadata', {})
            if not isinstance(metadata, dict):
                metadata = {}

            chunks.append({
                "id": sanitize_id(f"{file_name}_{item.get('id', idx)}"),
                "text": text,
                "metadata": {
                    "fileName": file_name,
                    "language": str(metadata.get('language', 'ar'))[:10],
                    "pageTitle": str(metadata.get('page_title', file_name))[:200],
                    "text": text[:1000],
                }
            })

    # ───── الحالة 2: Object كبير nested ─────
    elif isinstance(data, dict):
        text = json.dumps(data, ensure_ascii=False, indent=2)
        chunk_size = 1500
        for i in range(0, len(text), chunk_size - 200):
            chunk_text = text[i:i + chunk_size].strip()
            if len(chunk_text) > 50:
                chunks.append({
                    "id": sanitize_id(f"{file_name}_part_{i // chunk_size}"),
                    "text": chunk_text,
                    "metadata": {
                        "fileName": file_name,
                        "language": "ar",
                        "pageTitle": file_name,
                        "text": chunk_text[:1000],
                    }
                })

    return chunks


def read_all_files(folder: Path) -> List[Dict]:
    """قراءة كل الملفات وتجميع الـ chunks"""
    json_files = list(folder.rglob("*.json")) + list(folder.rglob("*.JSON"))
    json_files = list(set(json_files))  # إزالة التكرار

    print(f"📂 وجدت {len(json_files)} ملف JSON\n")

    all_chunks = []
    skipped = 0

    for fp in tqdm(json_files, desc="قراءة الملفات", unit="ملف"):
        data = safe_load_json(fp)
        if data is None:
            skipped += 1
            continue

        file_name = fp.stem
        chunks = extract_chunks(data, file_name)
        all_chunks.extend(chunks)

    print(f"\n✅ تم تجميع {len(all_chunks):,} chunk من الملفات")
    if skipped > 0:
        print(f"⚠️  تخطّى {skipped} ملف بسبب أخطاء")

    return all_chunks


# ══════════════════════════════════════════════════════════════
#  🚀 السكريبت الرئيسي
# ══════════════════════════════════════════════════════════════

def main():
    print("═" * 60)
    print("  🎓 QU - Pinecone Bulk Uploader v2.0")
    print("═" * 60)

    # ── 1. الاتصال ──────────────────────────────────────────
    print("\n🔌 الاتصال بـ OpenAI و Pinecone...")
    openai_client = OpenAI(api_key=CONFIG["OPENAI_API_KEY"])
    pc            = Pinecone(api_key=CONFIG["PINECONE_API_KEY"])
    index         = pc.Index(CONFIG["INDEX_NAME"])
    print("   ✅ متصل")

    # ── 2. مسح القديم ────────────────────────────────────────
    if CONFIG["CLEAR_NAMESPACE"]:
        print(f"\n🧹 مسح الـ namespace: {CONFIG['NAMESPACE']}")
        try:
            index.delete(delete_all=True, namespace=CONFIG["NAMESPACE"])
            print("   ✅ تم المسح")
            time.sleep(2)
        except Exception as e:
            print(f"   ℹ️  {e}")

    # ── 3. قراءة الملفات ─────────────────────────────────────
    folder = Path(CONFIG["DATA_FOLDER"])
    if not folder.exists():
        print(f"\n❌ المجلد غير موجود: {folder}")
        return

    chunks = read_all_files(folder)
    if not chunks:
        print("\n❌ ما فيه chunks")
        return

    # ── 4. إزالة التكرار ─────────────────────────────────────
    seen = set()
    unique = []
    for c in chunks:
        if c["id"] not in seen:
            seen.add(c["id"])
            unique.append(c)
    print(f"📦 بعد إزالة التكرار: {len(unique):,} chunk")
    chunks = unique

    # ── 5. توليد embeddings ورفع ─────────────────────────────
    print(f"\n🧠 توليد embeddings ورفع لـ Pinecone (دفعات من {CONFIG['BATCH_SIZE']})...\n")

    total = len(chunks)
    uploaded = 0
    errors = 0

    progress = tqdm(total=total, desc="رفع", unit="chunk")

    for start in range(0, total, CONFIG["BATCH_SIZE"]):
        batch = chunks[start:start + CONFIG["BATCH_SIZE"]]
        texts = [c["text"] for c in batch]

        try:
            # توليد embeddings للدفعة كاملة (أسرع 10x)
            response = openai_client.embeddings.create(
                model=CONFIG["EMBEDDING_MODEL"],
                input=texts,
            )

            vectors = [{
                "id":       chunk["id"],
                "values":   embedding.embedding,
                "metadata": chunk["metadata"],
            } for chunk, embedding in zip(batch, response.data)]

            # رفع للـ Pinecone
            index.upsert(vectors=vectors, namespace=CONFIG["NAMESPACE"])
            uploaded += len(vectors)

        except Exception as e:
            errors += len(batch)
            tqdm.write(f"⚠️  خطأ في دفعة: {str(e)[:80]}")
            time.sleep(2)

        progress.update(len(batch))
        progress.set_postfix({"uploaded": uploaded, "errors": errors})

    progress.close()

    # ── 6. التحقق ────────────────────────────────────────────
    print("\n📊 التحقق من Pinecone...")
    time.sleep(3)
    try:
        stats = index.describe_index_stats()
        ns_stats = stats.get("namespaces", {}).get(CONFIG["NAMESPACE"], {})
        total_vec = ns_stats.get("vector_count", 0)
    except Exception:
        total_vec = "غير معروف"

    print("\n" + "═" * 60)
    print(f"  ✅ اكتمل!")
    print(f"  📦 vectors في Pinecone: {total_vec}")
    print(f"  ⬆️  تم رفع: {uploaded:,}")
    print(f"  ❌ أخطاء: {errors}")
    print("═" * 60)


if __name__ == "__main__":
    main()
