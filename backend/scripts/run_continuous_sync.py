"""
JobPulse Continuous Zero-Delay Sync Engine
Runs every 10 minutes continuously to sync genuine 30-day verified job postings
directly into Supabase PostgreSQL with ZERO delay.
"""

import time
import sys
import traceback
from datetime import datetime, timezone
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.sync_real_production_jobs import main as sync_jobs

SYNC_INTERVAL_SECONDS = 600  # 10 minutes

def run_daemon():
    print("=" * 70, flush=True)
    print("🚀 JOBPULSE ZERO-DELAY REAL-TIME SYNC DAEMON STARTED", flush=True)
    print(f"[*] Interval: Every {SYNC_INTERVAL_SECONDS // 60} minutes", flush=True)
    print(f"[*] Target: Supabase Live Database + Worldwide ATS APIs", flush=True)
    print("=" * 70, flush=True)

    iteration = 1
    while True:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        print(f"\n[{now_str}] 🔄 Starting Sync Cycle #{iteration}...", flush=True)

        try:
            sync_jobs()
            print(f"[{datetime.now(timezone.utc).strftime('%H:%M:%S UTC')}] ✅ Sync Cycle #{iteration} completed successfully!", flush=True)
        except Exception as e:
            print(f"[{datetime.now(timezone.utc).strftime('%H:%M:%S UTC')}] ❌ Error during sync cycle #{iteration}: {e}", flush=True)
            traceback.print_exc()

        iteration += 1
        print(f"[*] Sleeping for {SYNC_INTERVAL_SECONDS // 60} minutes until next cycle... (Press Ctrl+C to stop)", flush=True)
        time.sleep(SYNC_INTERVAL_SECONDS)

if __name__ == "__main__":
    try:
        run_daemon()
    except KeyboardInterrupt:
        print("\n[!] Daemon stopped by user. Goodbye!")
