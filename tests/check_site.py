from html.parser import HTMLParser
from pathlib import Path
import hashlib
root=Path(__file__).resolve().parents[1]/'dist'
class Site(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[];self.links=[];self.images=[];self.local=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='img':
   assert 'alt' in a, 'Missing alt text'
   self.images.append(a['src'])
  if tag in ('img','script','link'):
   src=a.get('src',a.get('href',''))
   if src and not src.startswith(('http:','https:','data:')):self.local.append(src)
s=Site();s.feed((root/'index.html').read_text())
assert len(s.ids)==len(set(s.ids)), 'Duplicate IDs'
for link in s.links:
 if link.startswith('#'):assert link[1:] in s.ids, f'Broken anchor {link}'
for path in s.local:assert (root/path).is_file(), f'Missing asset {path}'
assert len(s.images)==len(set(s.images)), 'Repeated photographs'
hashes=[hashlib.sha256((root/path).read_bytes()).hexdigest() for path in s.images]
assert len(hashes)==len(set(hashes)), 'Duplicate image bytes'
assert 'mailto:bodybazzare916@yahoo.com' in s.links
assert not any('bodybazzaremarketing' in link for link in s.links)
assert (root/'index.html').read_text().count('<h1 ')==1
print(f'PASS: {len(s.links)} links, {len(s.images)} unique images, all anchors/assets and email checked.')
