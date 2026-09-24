import urllib.request
import json

indian_boards = [
    'postman', 'browserstack', 'sprinklr', 'hasura', 'inmobi',
    'clevertap', 'urbancompany', 'chargebee', 'druva', 'zeta',
    'freshworks', 'thoughtworks', 'zepto', 'swiggy', 'groww'
]

for b in indian_boards:
    try:
        url = f"https://boards-api.greenhouse.io/v1/boards/{b}/jobs"
        req = urllib.request.Request(url, headers={'User-Agent': 'JobHighway/1.0'})
        with urllib.request.urlopen(req, timeout=3) as r:
            d = json.loads(r.read().decode())
            jobs = d.get('jobs', [])
            if jobs:
                print(f"{b}: {len(jobs)} jobs | {jobs[0]['title']} -> {jobs[0]['absolute_url']}")
            else:
                print(f"{b}: 0 jobs")
    except Exception as e:
        print(f"{b}: not greenhouse")
