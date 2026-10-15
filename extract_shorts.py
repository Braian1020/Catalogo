import re

with open("drive_dump.html", "r", encoding="utf-8") as f:
    text = f.read()

# Pattern:
# aria-label="([^"]+) Image Shared" ... data-id="([^"]+)"
matches = re.findall(r'aria-label="([^"]+?)\s+Image\s+Shared"[^>]*?data-id="([^"]+)"', text)
print(f"Matched aria-label + data-id: {len(matches)}")
if not matches:
    # let's try broader pattern
    matches = re.findall(r'aria-label="([^"]+?\.(?:png|jpg|jpeg))[^"]*"[\s\S]{1,500}?data-id="([^"]+)"', text)
    print(f"Broader matched: {len(matches)}")

file_map = {}
for name, fid in matches:
    clean_name = name.replace("x22", "").strip()
    file_map[clean_name] = fid
    print(f"{clean_name} -> {fid}")

print("Total unique shorts extracted:", len(file_map))

# Save as json
import json
with open("extracted_shorts.json", "w", encoding="utf-8") as f:
    json.dump(file_map, f, indent=2, ensure_ascii=False)
