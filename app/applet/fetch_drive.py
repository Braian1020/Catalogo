import urllib.request
import re
import json

url = "https://drive.google.com/drive/folders/18n8in2fO3td8lvMah2BOCVxwbcDhHjHt?usp=sharing"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8")
        print("HTML length:", len(html))
        
        with open("drive_dump.html", "w", encoding="utf-8") as f:
            f.write(html)
            
        print("Saved drive_dump.html successfully.")
except Exception as e:
    print("Error:", e)
