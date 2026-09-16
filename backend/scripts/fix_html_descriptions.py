"""
Fix HTML entity escaping in Supabase database:
Decodes &lt;h2&gt; -> <h2>, &amp; -> &, &quot; -> ", etc. in description_html,
and cleans description_text to be proper plain text.
"""

import html
import re
from urllib.parse import quote_plus
from sqlalchemy import create_engine, text

def run_fix():
    print("[*] Connecting to Supabase PostgreSQL...", flush=True)
    p = quote_plus('MyJobPulse@2026#')
    engine = create_engine(f'postgresql://postgres.difdvbmniyhlltmdzngg:{p}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require')

    with engine.connect() as conn:
        print("[*] Fetching jobs with HTML-escaped descriptions...", flush=True)
        rows = conn.execute(text("""
            SELECT id, description_html, description_text 
            FROM jobs 
            WHERE description_html ILIKE '%&lt;%' 
               OR description_text ILIKE '%&lt;%'
               OR description_html ILIKE '%&gt;%'
        """)).fetchall()

        print(f"[+] Found {len(rows)} jobs with escaped HTML entities. Decoding...", flush=True)

        params = []
        batch_size = 100
        updated = 0

        for r in rows:
            jid, d_html, d_text = r[0], r[1], r[2]

            # Decode HTML entities twice in case of double-escaping
            clean_html = d_html or ""
            for _ in range(2):
                if '&lt;' in clean_html or '&gt;' in clean_html or '&quot;' in clean_html or '&amp;' in clean_html:
                    clean_html = html.unescape(clean_html)

            # Plain text description: decode and strip tags cleanly
            clean_text = d_text or ""
            for _ in range(2):
                if '&lt;' in clean_text or '&gt;' in clean_text or '&quot;' in clean_text or '&amp;' in clean_text:
                    clean_text = html.unescape(clean_text)
            clean_text = re.sub(r'<[^>]+>', ' ', clean_text)
            clean_text = re.sub(r'\s+', ' ', clean_text).strip()

            params.append({
                "jid": jid,
                "d_html": clean_html,
                "d_text": clean_text
            })

            if len(params) >= batch_size:
                conn.execute(text("""
                    UPDATE jobs 
                    SET description_html = :d_html,
                        description_text = :d_text
                    WHERE id = :jid
                """), params)
                conn.commit()
                updated += len(params)
                print(f"[+] Decoded {updated}/{len(rows)} jobs...", flush=True)
                params = []

        if params:
            conn.execute(text("""
                UPDATE jobs 
                SET description_html = :d_html,
                    description_text = :d_text
                WHERE id = :jid
            """), params)
            conn.commit()
            updated += len(params)

        print(f"[SUCCESS] Successfully decoded and formatted HTML descriptions for all {updated} jobs!", flush=True)

if __name__ == '__main__':
    run_fix()
