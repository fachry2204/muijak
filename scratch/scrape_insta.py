import urllib.request
import re
import json

try:
    req = urllib.request.Request(
        'https://www.picuki.com/profile/muijakarta', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # Find all image sources
    imgs = re.findall(r'<img[^>]+src="([^"]+)"', html)
    # Filter for post images (they usually contain picuki.com/media or similar or just keep them)
    # picuki uses 'https://scontent' or 'picuki.com/hosted-by-instagram'
    imgs = [img for img in imgs if 'scontent' in img or 'picuki' in img]
    imgs = list(set(imgs))[:10]
    print(json.dumps(imgs))
except Exception as e:
    print("Error:", e)
